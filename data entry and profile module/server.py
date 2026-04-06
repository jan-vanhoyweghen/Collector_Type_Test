#!/usr/bin/env python3
"""Data entry browser module server (Python fallback when Node.js is unavailable)."""

from __future__ import annotations

import json
import os
import posixpath
import re
import secrets
import subprocess
import struct
import sys
import tempfile
import threading
import time
import zlib
from dataclasses import dataclass
from html import unescape
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Callable, Dict, List, Optional
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse
from urllib.request import Request, urlopen

HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "3000"))
PUBLIC_DIR = Path(__file__).resolve().parent / "public"

TWO_DG_HOST = "www.2dgalleries.com"
TWO_DG_BASE_URL = f"https://{TWO_DG_HOST}"

MIME_TYPES = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
}

DEFAULT_HEADERS = {
    "accept-language": "en-US,en;q=0.9",
    "user-agent": "DataEntryPOC/1.0 (+https://localhost)",
}

PDF_IMAGE_CACHE: Dict[str, Dict[str, object]] = {}
PDF_IMAGE_CACHE_LOCK = threading.Lock()
PDF_IMAGE_CACHE_TTL_SECONDS = 45 * 60
PDF_IMAGE_CACHE_MAX_ITEMS = 400

PDF_OBJECT_RE = re.compile(rb"(\d+)\s+(\d+)\s+obj\s*(.*?)\s*endobj", re.DOTALL)
PDF_TEXT_TOKEN_RE = re.compile(
    rb"BT|ET|T\*|"
    rb"/([A-Za-z0-9]+)\s+([-0-9.]+)\s+Tf|"
    rb"([\-0-9.]+)\s+([\-0-9.]+)\s+Td|"
    rb"([\-0-9.]+)\s+([\-0-9.]+)\s+TD|"
    rb"([\-0-9.]+)\s+([\-0-9.]+)\s+([\-0-9.]+)\s+([\-0-9.]+)\s+([\-0-9.]+)\s+([\-0-9.]+)\s+Tm|"
    rb"<([0-9A-Fa-f\s]+)>\s*Tj|"
    rb"\((?:\\.|[^\\)])*\)\s*Tj|"
    rb"\[(.*?)\]\s*TJ",
    re.DOTALL,
)


def normalize_spaces(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def clean_text(text: str) -> str:
    no_tags = re.sub(r"<[^>]*>", " ", text or "")
    return normalize_spaces(unescape(no_tags))


def to_absolute_url(value: str) -> str:
    if not value:
        return ""
    if re.match(r"^https?://", value, re.IGNORECASE):
        return value
    if value.startswith("/"):
        return f"{TWO_DG_BASE_URL}{value}"
    return f"{TWO_DG_BASE_URL}/{value}"


@dataclass
class ArtworkEntry:
    artworkTitle: str
    artistName: str
    artworkUrl: str
    imageUrl: str


def fetch_html(url: str) -> str:
    request = Request(url=url, headers=DEFAULT_HEADERS)
    try:
        with urlopen(request, timeout=20) as response:
            return response.read().decode("utf-8", errors="replace")
    except HTTPError as error:
        raise ValueError(f"Request failed for {url} with status {error.code}.") from error
    except URLError as error:
        raise ValueError(f"Network error while requesting {url}: {error.reason}") from error


def assert_2dg_profile_url(input_url: str) -> str:
    try:
        parsed = urlparse(input_url)
    except ValueError as error:
        raise ValueError("Invalid URL provided.") from error

    host = (parsed.hostname or "").lower()
    path = parsed.path or ""

    is_valid_host = host == TWO_DG_HOST or host.endswith(f".{TWO_DG_HOST}")
    is_profile_path = re.match(r"^/profile/.+", path, re.IGNORECASE) is not None

    if not is_valid_host or not is_profile_path:
        raise ValueError(
            "Only 2DGalleries profile URLs are allowed (example: https://www.2dgalleries.com/profile/jan)."
        )

    query_items = dict(parse_qsl(parsed.query, keep_blank_values=True))
    query_items["lang"] = "en"

    return urlunparse(
        (
            parsed.scheme or "https",
            parsed.netloc,
            parsed.path,
            parsed.params,
            urlencode(query_items),
            parsed.fragment,
        )
    )


def extract_user_id(profile_html: str) -> int:
    match = re.search(r"/userartworks/(\d+)", profile_html, re.IGNORECASE)
    if not match:
        raise ValueError("Could not detect the profile user id from 2DGalleries page.")
    return int(match.group(1))


def extract_expected_count(profile_html: str, user_id: int) -> Optional[int]:
    direct = re.search(
        rf"<a\s+href=\"/userartworks/{user_id}\"[^>]*>\s*(\d+)\s+artworks?\s*</a>",
        profile_html,
        re.IGNORECASE,
    )
    if direct:
        return int(direct.group(1))

    fallback = re.search(r"All artworks[^0-9]*(\d+)", profile_html, re.IGNORECASE)
    if fallback:
        return int(fallback.group(1))

    return None


def split_artwork_blocks(page_html: str) -> List[str]:
    parts = page_html.split('<div class="artworkcontainer">')[1:]
    return [f'<div class="artworkcontainer">{item}' for item in parts]


def parse_artwork_block(block_html: str) -> Optional[ArtworkEntry]:
    artwork_path_match = re.search(r'<a class="img"\s+href="([^"]+)"', block_html, re.IGNORECASE)
    if not artwork_path_match:
        return None

    image_path_match = re.search(r'<img[^>]+src="([^"]+)"', block_html, re.IGNORECASE)
    title_match = re.search(r"<h3[^>]*>([\s\S]*?)</h3>", block_html, re.IGNORECASE)

    artist_matches = re.findall(r'<a class="artist"[^>]*>([\s\S]*?)</a>', block_html, re.IGNORECASE)
    artists = [clean_text(item) for item in artist_matches if clean_text(item)]

    title = clean_text(title_match.group(1) if title_match else "") or "Untitled artwork"
    artist_name = ", ".join(artists) if artists else "Unknown artist"

    return ArtworkEntry(
        artworkTitle=title,
        artistName=artist_name,
        artworkUrl=to_absolute_url(artwork_path_match.group(1)),
        imageUrl=to_absolute_url(image_path_match.group(1) if image_path_match else ""),
    )


def find_next_offset(page_html: str, current_offset: int) -> Optional[int]:
    matches = re.findall(r'data-url="/userartworks/\d+\?uid=\d+&\s*offset=(\d+)"', page_html, re.IGNORECASE)
    higher = [int(item) for item in matches if int(item) > current_offset]
    return min(higher) if higher else None


def scrape_2dg_profile(profile_url: str) -> Dict[str, object]:
    safe_profile_url = assert_2dg_profile_url(profile_url)
    profile_html = fetch_html(safe_profile_url)

    profile_user_id = extract_user_id(profile_html)
    expected_count = extract_expected_count(profile_html, profile_user_id)

    collected: List[ArtworkEntry] = []
    visited_offsets = set()
    current_offset = 0

    for _ in range(100):
        if current_offset in visited_offsets:
            break

        visited_offsets.add(current_offset)

        page_url = (
            f"{TWO_DG_BASE_URL}/userartworks/{profile_user_id}"
            f"?uid={profile_user_id}&offset={current_offset}&ajx=1&pager=1&hr=1&pid={profile_user_id}"
        )
        page_html = fetch_html(page_url)

        page_entries = [
            parsed
            for parsed in (parse_artwork_block(block) for block in split_artwork_blocks(page_html))
            if parsed is not None
        ]

        if not page_entries:
            break

        collected.extend(page_entries)

        next_offset = find_next_offset(page_html, current_offset)
        if next_offset is None:
            break

        current_offset = next_offset

    deduped: List[ArtworkEntry] = []
    seen = set()

    for entry in collected:
        key = entry.artworkUrl or f"{entry.artworkTitle}|{entry.artistName}|{entry.imageUrl}"
        if key not in seen:
            seen.add(key)
            deduped.append(entry)

    entries_payload = [
        {
            "artworkTitle": item.artworkTitle,
            "artistName": item.artistName,
            "artworkUrl": item.artworkUrl,
            "imageUrl": item.imageUrl,
        }
        for item in deduped
    ]

    return {
        "sourceUrl": safe_profile_url,
        "profileUserId": profile_user_id,
        "expectedCount": expected_count,
        "foundCount": len(entries_payload),
        "meetsExpectedCount": None if expected_count is None else len(entries_payload) == expected_count,
        "entries": entries_payload,
    }


def parse_multipart_form_data(content_type: str, body_bytes: bytes) -> Dict[str, Dict[str, object]]:
    boundary_match = re.search(r'boundary=(?:"([^"]+)"|([^;]+))', content_type, re.IGNORECASE)
    if not boundary_match:
        raise ValueError("Missing multipart boundary in content-type header.")

    boundary_text = boundary_match.group(1) or boundary_match.group(2) or ""
    boundary = boundary_text.strip().encode("utf-8")
    if not boundary:
        raise ValueError("Invalid multipart boundary.")

    delimiter = b"--" + boundary
    sections = body_bytes.split(delimiter)

    fields: Dict[str, str] = {}
    files: Dict[str, Dict[str, object]] = {}

    for raw_section in sections:
        section = raw_section.strip()
        if not section or section == b"--":
            continue

        if section.endswith(b"--"):
            section = section[:-2]

        section = section.strip(b"\r\n")
        if not section:
            continue

        header_blob, separator, content_blob = section.partition(b"\r\n\r\n")
        if not separator:
            continue

        headers: Dict[str, str] = {}
        for header_line in header_blob.decode("utf-8", errors="replace").split("\r\n"):
            if ":" not in header_line:
                continue
            key, value = header_line.split(":", 1)
            headers[key.strip().lower()] = value.strip()

        disposition = headers.get("content-disposition", "")
        name_match = re.search(r'name="([^"]+)"', disposition, re.IGNORECASE)
        if not name_match:
            continue

        field_name = name_match.group(1).strip()
        filename_match = re.search(r'filename="([^"]*)"', disposition, re.IGNORECASE)
        content = content_blob.rstrip(b"\r\n")

        if filename_match is not None:
            files[field_name] = {
                "filename": filename_match.group(1),
                "content_type": headers.get("content-type", "application/octet-stream"),
                "content": content,
            }
        else:
            fields[field_name] = content.decode("utf-8", errors="replace")

    return {"fields": fields, "files": files}


def decode_pdf_literal_string(raw: bytes) -> str:
    out = bytearray()
    i = 0

    while i < len(raw):
        current = raw[i]

        if current != 92:  # backslash
            out.append(current)
            i += 1
            continue

        i += 1
        if i >= len(raw):
            break

        escaped = raw[i]

        if escaped in (10, 13):  # line continuation
            if escaped == 13 and i + 1 < len(raw) and raw[i + 1] == 10:
                i += 1
            i += 1
            continue

        mapped = {
            ord("n"): 10,
            ord("r"): 13,
            ord("t"): 9,
            ord("b"): 8,
            ord("f"): 12,
        }.get(escaped)

        if mapped is not None:
            out.append(mapped)
            i += 1
            continue

        if escaped in (ord("("), ord(")"), ord("\\")):
            out.append(escaped)
            i += 1
            continue

        if ord("0") <= escaped <= ord("7"):
            oct_digits = [escaped]
            for _ in range(2):
                if i + 1 < len(raw) and ord("0") <= raw[i + 1] <= ord("7"):
                    i += 1
                    oct_digits.append(raw[i])
                else:
                    break
            out.append(int(bytes(oct_digits), 8))
            i += 1
            continue

        out.append(escaped)
        i += 1

    return out.decode("latin-1", errors="ignore")


def emit_pdf_progress(progress_callback: Optional[Callable[[int, str], None]], value: int, message: str) -> None:
    if progress_callback is None:
        return

    bounded = max(0, min(100, int(value)))
    try:
        progress_callback(bounded, message)
    except Exception:  # pylint: disable=broad-except
        pass


def split_pdf_stream_body(body: bytes) -> tuple[bytes, Optional[bytes]]:
    stream_match = re.search(rb"^(.*?)\bstream\r?\n(.*?)\r?\nendstream\s*$", body, re.DOTALL)
    if not stream_match:
        return body, None
    return stream_match.group(1), stream_match.group(2)


def decode_pdf_stream_bytes(header: bytes, stream_bytes: Optional[bytes]) -> Optional[bytes]:
    if stream_bytes is None:
        return None

    if b"/Filter /FlateDecode" in header:
        for wbits in (None, -15):
            try:
                if wbits is None:
                    return zlib.decompress(stream_bytes)
                return zlib.decompress(stream_bytes, wbits)
            except Exception:  # pylint: disable=broad-except
                continue
        return None

    return stream_bytes


def parse_pdf_object_map(pdf_bytes: bytes) -> Dict[int, bytes]:
    objects: Dict[int, bytes] = {}
    for obj_match in PDF_OBJECT_RE.finditer(pdf_bytes):
        object_id = int(obj_match.group(1))
        objects[object_id] = obj_match.group(3)
    return objects


def parse_pdf_page_font_map(page_body: bytes) -> Dict[str, int]:
    font_map: Dict[str, int] = {}
    font_block = re.search(rb"/Font\s*<<(.*?)>>", page_body, re.DOTALL)
    if not font_block:
        return font_map

    for name, font_id in re.findall(rb"/([A-Za-z0-9]+)\s+(\d+)\s+0\s+R", font_block.group(1)):
        font_map[name.decode("ascii", errors="ignore")] = int(font_id)

    return font_map


def parse_pdf_page_content_refs(page_body: bytes) -> List[int]:
    content_refs: List[int] = []
    array_match = re.search(rb"/Contents\s*\[(.*?)\]", page_body, re.DOTALL)
    if array_match:
        content_refs = [int(ref) for ref in re.findall(rb"(\d+)\s+0\s+R", array_match.group(1))]
        return content_refs

    single_match = re.search(rb"/Contents\s+(\d+)\s+0\s+R", page_body)
    if single_match:
        content_refs = [int(single_match.group(1))]

    return content_refs


def decode_pdf_cmap_unicode(hex_text: str) -> str:
    try:
        decoded = bytes.fromhex(hex_text)
    except ValueError:
        return ""

    if not decoded:
        return ""

    if len(decoded) % 2 == 0:
        try:
            return decoded.decode("utf-16-be", errors="ignore")
        except Exception:  # pylint: disable=broad-except
            pass

    return decoded.decode("latin-1", errors="ignore")


def parse_pdf_tounicode_cmap(cmap_text: str) -> tuple[Dict[bytes, str], List[int]]:
    mapping: Dict[bytes, str] = {}
    code_lengths: set[int] = set()

    for block in re.finditer(r"beginbfchar\s*(.*?)\s*endbfchar", cmap_text, re.DOTALL):
        for source_hex, dest_hex in re.findall(r"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>", block.group(1)):
            source_bytes = bytes.fromhex(source_hex)
            code_lengths.add(len(source_bytes))
            mapping[source_bytes] = decode_pdf_cmap_unicode(dest_hex)

    for block in re.finditer(r"beginbfrange\s*(.*?)\s*endbfrange", cmap_text, re.DOTALL):
        for line in block.group(1).splitlines():
            clean_line = line.strip()
            if not clean_line:
                continue

            direct_match = re.match(r"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>", clean_line)
            if direct_match:
                start_hex, end_hex, dest_start_hex = direct_match.groups()
                start_bytes = bytes.fromhex(start_hex)
                end_bytes = bytes.fromhex(end_hex)
                if len(start_bytes) != len(end_bytes):
                    continue

                code_length = len(start_bytes)
                code_lengths.add(code_length)
                start_code = int.from_bytes(start_bytes, "big")
                end_code = int.from_bytes(end_bytes, "big")
                dest_start_code = int(dest_start_hex, 16)

                for offset, code in enumerate(range(start_code, end_code + 1)):
                    mapping[code.to_bytes(code_length, "big")] = chr(dest_start_code + offset)
                continue

            array_match = re.match(r"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*\[(.*?)\]", clean_line)
            if not array_match:
                continue

            start_hex, end_hex, dest_array = array_match.groups()
            start_bytes = bytes.fromhex(start_hex)
            end_bytes = bytes.fromhex(end_hex)
            if len(start_bytes) != len(end_bytes):
                continue

            code_length = len(start_bytes)
            code_lengths.add(code_length)
            start_code = int.from_bytes(start_bytes, "big")
            end_code = int.from_bytes(end_bytes, "big")
            values = re.findall(r"<([0-9A-Fa-f]+)>", dest_array)

            for offset, code in enumerate(range(start_code, min(end_code + 1, start_code + len(values)))):
                mapping[code.to_bytes(code_length, "big")] = decode_pdf_cmap_unicode(values[offset])

    if not code_lengths:
        code_lengths = {2}

    return mapping, sorted(code_lengths, reverse=True)


def decode_pdf_hex_sequence(hex_chunk: bytes, cmap: Dict[bytes, str], code_lengths: List[int]) -> str:
    clean_hex = re.sub(rb"\s+", b"", hex_chunk)
    if len(clean_hex) % 2 == 1:
        clean_hex += b"0"

    if not clean_hex:
        return ""

    try:
        data = bytes.fromhex(clean_hex.decode("ascii"))
    except ValueError:
        return ""

    output: List[str] = []
    index = 0

    while index < len(data):
        matched = False

        for code_length in code_lengths:
            if index + code_length > len(data):
                continue

            key = data[index : index + code_length]
            if key in cmap:
                output.append(cmap[key])
                index += code_length
                matched = True
                break

        if matched:
            continue

        byte = data[index]
        if 32 <= byte < 127:
            output.append(chr(byte))
        index += 1

    return "".join(output)


def prune_pdf_image_cache(now: Optional[float] = None) -> None:
    current = now if now is not None else time.monotonic()
    stale_tokens = [
        token
        for token, payload in PDF_IMAGE_CACHE.items()
        if current - float(payload.get("created_at", 0.0)) > PDF_IMAGE_CACHE_TTL_SECONDS
    ]
    for token in stale_tokens:
        PDF_IMAGE_CACHE.pop(token, None)

    if len(PDF_IMAGE_CACHE) <= PDF_IMAGE_CACHE_MAX_ITEMS:
        return

    ordered_tokens = sorted(PDF_IMAGE_CACHE.keys(), key=lambda token: float(PDF_IMAGE_CACHE[token].get("created_at", 0.0)))
    for token in ordered_tokens[: len(PDF_IMAGE_CACHE) - PDF_IMAGE_CACHE_MAX_ITEMS]:
        PDF_IMAGE_CACHE.pop(token, None)


def store_pdf_image_asset(content: bytes, mime: str) -> str:
    token = secrets.token_urlsafe(12)
    created_at = time.monotonic()
    with PDF_IMAGE_CACHE_LOCK:
        prune_pdf_image_cache(now=created_at)
        PDF_IMAGE_CACHE[token] = {"content": content, "mime": mime, "created_at": created_at}
    return f"/api/pdf-image/{token}"


def get_pdf_image_asset(token: str) -> Optional[Dict[str, object]]:
    now = time.monotonic()
    with PDF_IMAGE_CACHE_LOCK:
        prune_pdf_image_cache(now=now)
        asset = PDF_IMAGE_CACHE.get(token)
        if not asset:
            return None
        return {"content": asset.get("content", b""), "mime": asset.get("mime", "application/octet-stream")}


def build_png_chunk(chunk_type: bytes, payload: bytes) -> bytes:
    checksum = zlib.crc32(chunk_type + payload) & 0xFFFFFFFF
    return struct.pack(">I", len(payload)) + chunk_type + payload + struct.pack(">I", checksum)


def encode_png_from_raw(raw_pixels: bytes, width: int, height: int, channels: int) -> bytes:
    if channels == 1:
        color_type = 0
    elif channels == 3:
        color_type = 2
    else:
        raise ValueError("Unsupported channel count for PNG encoding.")

    row_size = width * channels
    scanlines = bytearray()
    for row_index in range(height):
        row_start = row_index * row_size
        row_end = row_start + row_size
        scanlines.append(0)  # filter type 0
        scanlines.extend(raw_pixels[row_start:row_end])

    ihdr = struct.pack(">IIBBBBB", width, height, 8, color_type, 0, 0, 0)
    idat = zlib.compress(bytes(scanlines), level=6)
    return b"\x89PNG\r\n\x1a\n" + build_png_chunk(b"IHDR", ihdr) + build_png_chunk(b"IDAT", idat) + build_png_chunk(b"IEND", b"")


def downsample_raw_pixels(raw_pixels: bytes, width: int, height: int, channels: int, max_dimension: int) -> tuple[bytes, int, int]:
    if max(width, height) <= max_dimension:
        return raw_pixels, width, height

    scale = max_dimension / float(max(width, height))
    target_width = max(1, int(round(width * scale)))
    target_height = max(1, int(round(height * scale)))

    source_row_size = width * channels
    reduced = bytearray(target_width * target_height * channels)
    write_index = 0

    for y_pos in range(target_height):
        source_y = min(height - 1, int((y_pos * height) / target_height))
        source_row_start = source_y * source_row_size
        for x_pos in range(target_width):
            source_x = min(width - 1, int((x_pos * width) / target_width))
            source_offset = source_row_start + (source_x * channels)
            reduced[write_index : write_index + channels] = raw_pixels[source_offset : source_offset + channels]
            write_index += channels

    return bytes(reduced), target_width, target_height


def convert_cmyk_to_rgb(raw_pixels: bytes) -> bytes:
    if len(raw_pixels) % 4 != 0:
        return b""

    rgb = bytearray((len(raw_pixels) // 4) * 3)
    write_index = 0
    for index in range(0, len(raw_pixels), 4):
        c = raw_pixels[index] / 255.0
        m = raw_pixels[index + 1] / 255.0
        y = raw_pixels[index + 2] / 255.0
        k = raw_pixels[index + 3] / 255.0
        rgb[write_index] = int(255 * (1.0 - min(1.0, c * (1.0 - k) + k)))
        rgb[write_index + 1] = int(255 * (1.0 - min(1.0, m * (1.0 - k) + k)))
        rgb[write_index + 2] = int(255 * (1.0 - min(1.0, y * (1.0 - k) + k)))
        write_index += 3

    return bytes(rgb)


def parse_pdf_filter_names(header: bytes) -> List[str]:
    filter_match = re.search(rb"/Filter\s*(\[[^\]]+\]|/[^\s/>]+)", header)
    if not filter_match:
        return []

    filter_blob = filter_match.group(1)
    return [name.decode("ascii", errors="ignore") for name in re.findall(rb"/([A-Za-z0-9]+)", filter_blob)]


def parse_pdf_image_channels(header: bytes, object_map: Dict[int, bytes]) -> int:
    color_match = re.search(rb"/ColorSpace\s*(\[[^\]]+\]|/[^\s/>]+)", header)
    if not color_match:
        return 3

    color_blob = color_match.group(1)
    if color_blob.startswith(b"/DeviceGray"):
        return 1
    if color_blob.startswith(b"/DeviceRGB"):
        return 3
    if color_blob.startswith(b"/DeviceCMYK"):
        return 4

    icc_match = re.search(rb"/ICCBased\s+(\d+)\s+0\s+R", color_blob)
    if not icc_match:
        return 3

    icc_object = object_map.get(int(icc_match.group(1)))
    if not icc_object:
        return 3

    channel_match = re.search(rb"/N\s+(\d+)", icc_object)
    if not channel_match:
        return 3

    return int(channel_match.group(1))


def parse_pdf_image_dimensions(header: bytes) -> tuple[int, int, int]:
    width_match = re.search(rb"/Width\s+(\d+)", header)
    height_match = re.search(rb"/Height\s+(\d+)", header)
    bits_match = re.search(rb"/BitsPerComponent\s+(\d+)", header)

    width = int(width_match.group(1)) if width_match else 0
    height = int(height_match.group(1)) if height_match else 0
    bits = int(bits_match.group(1)) if bits_match else 8
    return width, height, bits


def decode_pdf_image_object(object_body: bytes, object_map: Dict[int, bytes], max_dimension: int = 420) -> Optional[Dict[str, object]]:
    if b"/Subtype /Image" not in object_body:
        return None

    header, stream_data = split_pdf_stream_body(object_body)
    if stream_data is None:
        return None

    width, height, bits = parse_pdf_image_dimensions(header)
    if width <= 0 or height <= 0:
        return None

    filters = parse_pdf_filter_names(header)
    filter_set = set(filters)

    if "DCTDecode" in filter_set:
        return {"content": stream_data, "mime": "image/jpeg", "width": width, "height": height}

    if "JPXDecode" in filter_set:
        return {"content": stream_data, "mime": "image/jp2", "width": width, "height": height}

    if "FlateDecode" not in filter_set:
        return None

    decoded_pixels = decode_pdf_stream_bytes(header, stream_data)
    if not decoded_pixels:
        return None

    channels = parse_pdf_image_channels(header, object_map)
    if bits != 8 or channels not in {1, 3, 4}:
        return None

    expected_length = width * height * channels
    if len(decoded_pixels) < expected_length:
        return None
    if len(decoded_pixels) > expected_length:
        decoded_pixels = decoded_pixels[:expected_length]

    if channels == 4:
        converted = convert_cmyk_to_rgb(decoded_pixels)
        if not converted:
            return None
        decoded_pixels = converted
        channels = 3

    reduced_pixels, out_width, out_height = downsample_raw_pixels(decoded_pixels, width, height, channels, max_dimension)

    try:
        png_bytes = encode_png_from_raw(reduced_pixels, out_width, out_height, channels)
    except Exception:  # pylint: disable=broad-except
        return None

    return {"content": png_bytes, "mime": "image/png", "width": out_width, "height": out_height}


def extract_pdf_page_images(
    pdf_bytes: bytes,
    max_images: int = 60,
    progress_callback: Optional[Callable[[int, str], None]] = None,
    progress_start: int = 95,
    progress_end: int = 99,
) -> List[Dict[str, object]]:
    object_map = parse_pdf_object_map(pdf_bytes)
    page_ids = sorted(object_id for object_id, body in object_map.items() if b"/Type /Page" in body)
    total_pages = len(page_ids)
    if total_pages == 0:
        return []

    page_images: List[Dict[str, object]] = []

    for page_index, page_id in enumerate(page_ids, start=1):
        page_body = object_map.get(page_id, b"")
        xobject_block = re.search(rb"/XObject\s*<<(.*?)>>", page_body, re.DOTALL)
        if xobject_block:
            image_candidates: List[tuple[int, int]] = []
            for _name, object_ref in re.findall(rb"/([A-Za-z0-9]+)\s+(\d+)\s+0\s+R", xobject_block.group(1)):
                object_id = int(object_ref)
                image_body = object_map.get(object_id)
                if not image_body or b"/Subtype /Image" not in image_body:
                    continue

                width, height, _bits = parse_pdf_image_dimensions(image_body)
                image_candidates.append((object_id, max(1, width * height)))

            image_candidates.sort(key=lambda item: item[1], reverse=True)

            for image_object_id, _area in image_candidates:
                image_body = object_map.get(image_object_id)
                if not image_body:
                    continue

                image_payload = decode_pdf_image_object(image_body, object_map)
                if not image_payload:
                    continue

                image_content = image_payload.get("content", b"")
                image_mime = str(image_payload.get("mime", "image/png"))
                if not isinstance(image_content, (bytes, bytearray)) or len(image_content) == 0:
                    continue

                image_url = store_pdf_image_asset(bytes(image_content), image_mime)
                page_images.append(
                    {
                        "pageIndex": page_index - 1,
                        "imageUrl": image_url,
                        "objectId": image_object_id,
                    }
                )
                break

        if progress_callback is not None:
            progress = progress_start + int((page_index / total_pages) * (progress_end - progress_start))
            emit_pdf_progress(progress_callback, progress, f"Extracting artwork images ({page_index}/{total_pages})")

        if len(page_images) >= max_images:
            break

    return page_images


def extract_pdf_page_image_urls(
    pdf_bytes: bytes,
    max_images: int = 60,
    progress_callback: Optional[Callable[[int, str], None]] = None,
    progress_start: int = 95,
    progress_end: int = 99,
) -> List[str]:
    page_images = extract_pdf_page_images(
        pdf_bytes,
        max_images=max_images,
        progress_callback=progress_callback,
        progress_start=progress_start,
        progress_end=progress_end,
    )
    return [str(item.get("imageUrl", "")) for item in page_images if str(item.get("imageUrl", ""))]


def extract_pdf_text_lines(
    pdf_bytes: bytes,
    progress_callback: Optional[Callable[[int, str], None]] = None,
    include_page_lines: bool = False,
) -> object:
    last_progress = -1

    def report_once(value: int, message: str) -> None:
        nonlocal last_progress
        bounded = max(0, min(100, int(value)))
        if bounded <= last_progress:
            return
        last_progress = bounded
        emit_pdf_progress(progress_callback, bounded, message)

    def run_strings_fallback(start_progress: int, end_progress: int, live_message: str) -> List[str]:
        fallback_lines: List[str] = []
        tmp_path = None
        process: Optional[subprocess.Popen] = None

        try:
            with tempfile.NamedTemporaryFile(prefix="collector_pdf_", suffix=".pdf", delete=False) as temp_pdf:
                temp_pdf.write(pdf_bytes)
                tmp_path = temp_pdf.name

            process = subprocess.Popen(  # pylint: disable=consider-using-with
                ["/usr/bin/strings", "-n", "5", tmp_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )

            report_once(start_progress, live_message)
            current = start_progress
            started_at = time.monotonic()
            timeout_seconds = 120.0

            while process.poll() is None:
                if time.monotonic() - started_at >= timeout_seconds:
                    process.kill()
                    break
                if current < end_progress - 1:
                    current += 1
                    report_once(current, live_message)
                time.sleep(0.35)

            stdout = ""
            if process:
                try:
                    stdout, _stderr = process.communicate(timeout=2)
                except subprocess.TimeoutExpired:
                    process.kill()
                    stdout = ""

            if stdout:
                fallback_lines = stdout.splitlines()

            report_once(end_progress, "Fallback text extraction completed")
        except Exception:  # pylint: disable=broad-except
            pass
        finally:
            if process and process.poll() is None:
                process.kill()
            if tmp_path:
                try:
                    os.remove(tmp_path)
                except OSError:
                    pass

        return fallback_lines

    page_line_groups: List[List[str]] = []

    report_once(18, "Parsing PDF objects")
    object_map = parse_pdf_object_map(pdf_bytes)
    if not object_map:
        report_once(30, "Switching to fallback text extraction")
        fallback = run_strings_fallback(31, 79, "Running fallback text extraction")
        report_once(80, "Cleaning extracted text")
        fallback_clean = [normalize_spaces(line) for line in fallback if len(normalize_spaces(line)) > 1]
        if include_page_lines:
            return fallback_clean, [fallback_clean] if fallback_clean else []
        return fallback_clean

    report_once(22, "Building font maps")
    font_cmaps: Dict[int, tuple[Dict[bytes, str], List[int]]] = {}

    for object_id, body in object_map.items():
        if b"/Type /Font" not in body:
            continue

        to_unicode_match = re.search(rb"/ToUnicode\s+(\d+)\s+0\s+R", body)
        if not to_unicode_match:
            continue

        to_unicode_id = int(to_unicode_match.group(1))
        to_unicode_body = object_map.get(to_unicode_id)
        if not to_unicode_body:
            continue

        to_unicode_header, to_unicode_stream = split_pdf_stream_body(to_unicode_body)
        decoded_cmap = decode_pdf_stream_bytes(to_unicode_header, to_unicode_stream)
        if not decoded_cmap or b"begincmap" not in decoded_cmap:
            continue

        cmap_text = decoded_cmap.decode("latin-1", errors="ignore")
        font_cmaps[object_id] = parse_pdf_tounicode_cmap(cmap_text)

    page_ids = sorted(object_id for object_id, body in object_map.items() if b"/Type /Page" in body)
    total_pages = len(page_ids)
    extracted_lines: List[str] = []

    if total_pages > 0:
        report_once(26, f"Analyzing page text (0/{total_pages})")

    for page_index, page_id in enumerate(page_ids, start=1):
        page_body = object_map.get(page_id, b"")
        page_font_map = parse_pdf_page_font_map(page_body)
        content_refs = parse_pdf_page_content_refs(page_body)
        page_segments: List[tuple[float, float, str]] = []
        page_extracted_lines: List[str] = []

        for content_ref in content_refs:
            content_body = object_map.get(content_ref)
            if not content_body:
                continue

            content_header, content_stream = split_pdf_stream_body(content_body)
            decoded_content = decode_pdf_stream_bytes(content_header, content_stream)
            if not decoded_content or (b"Tj" not in decoded_content and b"TJ" not in decoded_content):
                continue

            in_text = False
            current_font: Optional[str] = None
            current_x = 0.0
            current_y = 0.0
            segment_text: List[str] = []
            segment_x = 0.0
            segment_y = 0.0
            segment_started = False

            def flush_segment() -> None:
                nonlocal segment_text, segment_started
                if not segment_started:
                    return

                merged = normalize_spaces("".join(segment_text))
                if merged:
                    page_segments.append((segment_y, segment_x, merged))
                segment_text = []
                segment_started = False

            for token_match in PDF_TEXT_TOKEN_RE.finditer(decoded_content):
                token = token_match.group(0)

                if token == b"BT":
                    in_text = True
                    continue

                if token == b"ET":
                    flush_segment()
                    in_text = False
                    continue

                if not in_text:
                    continue

                if token_match.group(1):
                    current_font = token_match.group(1).decode("ascii", errors="ignore")
                    continue

                if token_match.group(3):
                    current_x += float(token_match.group(3))
                    current_y += float(token_match.group(4))
                    continue

                if token_match.group(5):
                    current_x += float(token_match.group(5))
                    current_y += float(token_match.group(6))
                    continue

                if token_match.group(7):
                    current_x = float(token_match.group(11))
                    current_y = float(token_match.group(12))
                    continue

                if token == b"T*":
                    flush_segment()
                    continue

                cmap: Dict[bytes, str] = {}
                code_lengths = [2]
                if current_font and current_font in page_font_map:
                    font_object_id = page_font_map[current_font]
                    if font_object_id in font_cmaps:
                        cmap, code_lengths = font_cmaps[font_object_id]

                decoded_text = ""
                if token_match.group(13):
                    decoded_text = decode_pdf_hex_sequence(token_match.group(13), cmap, code_lengths)
                elif token.endswith(b"Tj") and token.startswith(b"("):
                    decoded_text = decode_pdf_literal_string(token[:-2].strip()[1:-1])
                elif token.endswith(b"TJ"):
                    array_body = token_match.group(14) or b""
                    parts: List[str] = []
                    for piece_match in re.finditer(rb"<([0-9A-Fa-f\s]+)>|\((?:\\.|[^\\)])*\)", array_body, re.DOTALL):
                        piece = piece_match.group(0)
                        if piece.startswith(b"<"):
                            parts.append(decode_pdf_hex_sequence(piece[1:-1], cmap, code_lengths))
                        else:
                            parts.append(decode_pdf_literal_string(piece[1:-1]))
                    decoded_text = "".join(parts)

                if not decoded_text:
                    continue

                if not segment_started:
                    segment_started = True
                    segment_x = current_x
                    segment_y = current_y
                segment_text.append(decoded_text)

            flush_segment()

        if page_segments:
            page_segments.sort(key=lambda item: (-item[0], item[1]))
            grouped_rows: List[List[tuple[float, str]]] = []
            current_row: List[tuple[float, str]] = []
            current_row_y: Optional[float] = None

            for y_pos, x_pos, text in page_segments:
                if current_row_y is None or abs(y_pos - current_row_y) <= 0.8:
                    current_row.append((x_pos, text))
                    current_row_y = y_pos if current_row_y is None else (current_row_y * 0.7 + y_pos * 0.3)
                else:
                    grouped_rows.append(current_row)
                    current_row = [(x_pos, text)]
                    current_row_y = y_pos

            if current_row:
                grouped_rows.append(current_row)

            for row in grouped_rows:
                row.sort(key=lambda item: item[0])
                merged_line = normalize_spaces("".join(text for _, text in row))
                if merged_line:
                    extracted_lines.append(merged_line)
                    page_extracted_lines.append(merged_line)

        page_line_groups.append(page_extracted_lines)

        if total_pages > 0:
            progress_value = 26 + int((page_index / total_pages) * 54)
            report_once(progress_value, f"Analyzing page text ({page_index}/{total_pages})")

    if not extracted_lines:
        report_once(30, "Switching to fallback text extraction")
        extracted_lines = run_strings_fallback(
            start_progress=max(31, last_progress + 1),
            end_progress=79,
            live_message="Running fallback text extraction",
        )

    report_once(80, "Cleaning extracted text")
    cleaned_lines: List[str] = []

    for line in extracted_lines:
        cleaned = normalize_spaces(line)
        if len(cleaned) < 2:
            continue
        if cleaned_lines and cleaned_lines[-1] == cleaned:
            continue
        cleaned_lines.append(cleaned)

    report_once(88, "Text extraction complete")
    if include_page_lines:
        cleaned_page_lines: List[List[str]] = []
        for page_lines in page_line_groups:
            cleaned_page: List[str] = []
            for line in page_lines:
                cleaned = normalize_spaces(line)
                if len(cleaned) < 2:
                    continue
                if cleaned_page and cleaned_page[-1] == cleaned:
                    continue
                cleaned_page.append(cleaned)
            cleaned_page_lines.append(cleaned_page)
        return cleaned_lines, cleaned_page_lines

    return cleaned_lines


def looks_like_person_name(line: str) -> bool:
    return re.match(
        r"^[A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÖØ-öø-ÿ'’.\-]+(?:\s+[A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÖØ-öø-ÿ'’.\-]+){1,3}$",
        line,
    ) is not None


def split_compact_words(text: str) -> str:
    merged = normalize_spaces(text)
    if not merged:
        return ""

    merged = re.sub(r"(?<=[a-zà-öø-ÿ])(?=[A-ZÀ-ÖØ-Þ])", " ", merged)
    merged = re.sub(r"(?<=[A-Za-zÀ-ÖØ-öø-ÿ])(?=\d)", " ", merged)
    merged = re.sub(r"(?<=\d)(?=[A-Za-zÀ-ÖØ-öø-ÿ])", " ", merged)
    merged = re.sub(r"\s+", " ", merged)
    return merged.strip()


def clean_artist_candidate(text: str) -> str:
    candidate = split_compact_words(text)
    if not candidate:
        return ""

    candidate = re.split(r"https?://", candidate, maxsplit=1)[0].strip()
    candidate = re.split(r"\s{2,}|--+|—+", candidate, maxsplit=1)[0].strip()
    words = candidate.split()
    if not words:
        return ""

    blocked_tokens = {
        "A",
        "Au",
        "Aux",
        "Avec",
        "Ce",
        "Cette",
        "Ces",
        "Dans",
        "De",
        "Des",
        "Du",
        "Et",
        "Il",
        "La",
        "Le",
        "Les",
        "Mon",
        "Par",
        "Pour",
        "Projet",
        "Comme",
        "Rarement",
        "Quantau",
        "Voici",
    }
    while words and words[0] in blocked_tokens:
        words = words[1:]

    if not words:
        return ""

    cleaned_words: List[str] = []
    for word in words:
        cleaned_word = re.sub(r"[^A-Za-zÀ-ÖØ-öø-ÿ'’\-]", "", word)
        if not cleaned_word:
            continue
        if len(cleaned_word) > 14:
            continue
        if cleaned_word.count("'") + cleaned_word.count("’") > 1:
            continue
        if not re.match(r"^[A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÖØ-öø-ÿ'’\-]+$", cleaned_word):
            continue
        if cleaned_word in blocked_tokens:
            continue
        cleaned_words.append(cleaned_word)

    if not cleaned_words:
        return ""

    for idx in range(0, len(cleaned_words) - 1):
        first = cleaned_words[idx]
        second = cleaned_words[idx + 1]
        if len(first) < 3 or len(second) < 3:
            continue
        return f"{first} {second}"

    if len(cleaned_words) == 1:
        if not re.search(r"[’'\-]", cleaned_words[0]):
            return ""
        return cleaned_words[0]

    return candidate[:80]


def clean_title_candidate(text: str) -> str:
    candidate = split_compact_words(text)
    candidate = re.split(r"https?://", candidate, maxsplit=1)[0].strip()
    candidate = candidate.strip(" -–—:;,.")
    return normalize_spaces(candidate)


def looks_like_title_candidate(line: str) -> bool:
    candidate = clean_title_candidate(line)
    if not candidate:
        return False

    if len(candidate) < 3 or len(candidate) > 60:
        return False

    if not re.match(r"^[A-ZÀ-ÖØ-Þ0-9]", candidate):
        return False

    lowered = candidate.lower()
    blocked_fragments = (
        "artist:",
        "exposition",
        "expositions",
        "collection",
        "www.",
        "http",
        "youtube",
        "vimeo",
        "copyright",
        "festival",
        "musée",
        "museum",
    )
    if any(fragment in lowered for fragment in blocked_fragments):
        return False

    if re.fullmatch(r"[\d\s\-_/.:]+", candidate):
        return False

    words = candidate.split()
    if len(words) > 6:
        return False

    if " " not in candidate and len(candidate) > 28:
        return False

    punctuation_count = len(re.findall(r"[.,;:!?]", candidate))
    if punctuation_count > 1:
        return False

    apostrophe_count = candidate.count("'") + candidate.count("’")
    if apostrophe_count > 2:
        return False

    return any(re.search(r"[A-Za-zÀ-ÖØ-öø-ÿ]", word) for word in words)


def score_suggestion_quality(title: str, artist: str) -> int:
    cleaned_title = clean_title_candidate(title)
    cleaned_artist = clean_artist_candidate(artist)

    score = 0
    if looks_like_title_candidate(cleaned_title):
        score += 4

    title_length = len(cleaned_title)
    if 4 <= title_length <= 35:
        score += 2
    elif title_length <= 50:
        score += 1

    if cleaned_title and cleaned_title[0].isupper():
        score += 1

    punctuation_count = len(re.findall(r"[.,;:!?]", cleaned_title))
    if punctuation_count > 1:
        score -= 2

    if cleaned_artist and looks_like_person_name(cleaned_artist):
        score += 2
    elif cleaned_artist:
        score -= 1

    return score


def suggest_title_and_artist(lines: List[str]) -> Dict[str, str]:
    candidate_lines = [line for line in lines if line][:120]

    artist = ""
    title = ""

    for line in candidate_lines:
        match = re.match(r"(?i)^artist(?:\(s\))?\s*[:\-]\s*(.+)$", line)
        if match:
            artist = normalize_spaces(match.group(1))
            break

    if not artist:
        for line in candidate_lines:
            match = re.match(r"(?i)^by\s+(.+)$", line)
            if match:
                artist = normalize_spaces(match.group(1))
                break

    if not artist:
        for line in candidate_lines:
            if looks_like_person_name(line):
                artist = line
                break

    for line in candidate_lines:
        match = re.match(r"(?i)^(?:title|artwork)\s*[:\-]\s*(.+)$", line)
        if match:
            title = normalize_spaces(match.group(1))
            break

    stopwords = ("page ", "www.", "http", "copyright", "catalog", "all rights", "www", ".com")
    if not title:
        for line in candidate_lines:
            lowered = line.lower()
            if any(word in lowered for word in stopwords):
                continue
            if looks_like_person_name(line):
                continue
            if len(line) < 3 or len(line) > 110:
                continue
            if re.fullmatch(r"[\d\s\-_/.:]+", line):
                continue
            title = line
            break

    return {"artworkTitle": clean_title_candidate(title), "artistName": clean_artist_candidate(artist)}


def extract_pdf_suggestion_list(lines: List[str]) -> List[Dict[str, str]]:
    candidate_lines = [line for line in lines if line][:6000]
    title_pattern = re.compile(r"(?i)^(?:title|artwork)\s*[:\-]\s*(.+)$")
    artist_pattern = re.compile(r"(?i)^artist(?:\(s\))?\s*[:\-]\s*(.+)$")
    by_pattern = re.compile(r"(?i)^by\s+(.+)$")

    suggestions: List[Dict[str, str]] = []
    seen = set()

    def add_candidate(title_value: str, artist_value: str) -> None:
        title_clean = clean_title_candidate(title_value)
        artist_clean = clean_artist_candidate(artist_value)
        if not title_clean:
            return

        if artist_clean and len(artist_clean.split()) == 1:
            # One-word artist names are usually noise in this PDF layout.
            if not re.match(r"^[A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÖØ-öø-ÿ'’\-]+$", artist_clean):
                artist_clean = ""

        if artist_clean and not looks_like_person_name(artist_clean):
            if len(artist_clean.split()) > 1:
                artist_clean = ""

        if not looks_like_title_candidate(title_clean):
            title_clean = ""
        if not title_clean:
            return

        signature = f"{title_clean.lower()}::{artist_clean.lower()}"
        if signature in seen:
            return

        seen.add(signature)
        suggestions.append({"artworkTitle": title_clean, "artistName": artist_clean})

    pending_title = ""
    pending_artist = ""

    for idx, line in enumerate(candidate_lines):
        title_match = title_pattern.match(line)
        if title_match:
            title_value = clean_title_candidate(title_match.group(1))
            if pending_artist:
                add_candidate(title_value, pending_artist)
                pending_artist = ""
                pending_title = ""
            else:
                if pending_title:
                    add_candidate(pending_title, "")
                pending_title = title_value
            continue

        artist_match = artist_pattern.match(line) or by_pattern.match(line)
        if artist_match:
            artist_value = clean_artist_candidate(artist_match.group(1))
            if pending_title:
                add_candidate(pending_title, artist_value)
                pending_title = ""
                pending_artist = ""
            else:
                if pending_artist:
                    add_candidate("", pending_artist)
                pending_artist = artist_value

            # Look around an artist marker to find the most plausible nearby title.
            nearby_title = ""
            for offset in range(1, 9):
                lookahead_index = idx + offset
                if lookahead_index >= len(candidate_lines):
                    break
                lookahead_line = candidate_lines[lookahead_index]
                if looks_like_title_candidate(lookahead_line):
                    nearby_title = lookahead_line
                    break

            if not nearby_title:
                for offset in range(1, 5):
                    lookback_index = idx - offset
                    if lookback_index < 0:
                        break
                    lookback_line = candidate_lines[lookback_index]
                    if looks_like_title_candidate(lookback_line):
                        nearby_title = lookback_line
                        break

            add_candidate(nearby_title, artist_value)
            pending_artist = ""

    if pending_title:
        add_candidate(pending_title, "")

    # Second pass: only if the primary pass produced too few candidates.
    if len(suggestions) < 58:
        for idx, line in enumerate(candidate_lines):
            if not looks_like_title_candidate(line):
                continue

            nearest_artist = ""
            for distance in range(1, 8):
                for direction in (-1, 1):
                    target = idx + (distance * direction)
                    if target < 0 or target >= len(candidate_lines):
                        continue
                    artist_match = artist_pattern.match(candidate_lines[target]) or by_pattern.match(candidate_lines[target])
                    if artist_match:
                        nearest_artist = clean_artist_candidate(artist_match.group(1))
                        break
                if nearest_artist:
                    break

            add_candidate(line, nearest_artist)
            if len(suggestions) >= 70:
                break

    fallback = suggest_title_and_artist(candidate_lines)
    add_candidate(fallback.get("artworkTitle", ""), fallback.get("artistName", ""))

    target_count = 58
    if len(suggestions) > target_count:
        ranked = sorted(
            (
                (score_suggestion_quality(item.get("artworkTitle", ""), item.get("artistName", "")), idx)
                for idx, item in enumerate(suggestions)
            ),
            key=lambda item: (-item[0], item[1]),
        )
        keep_indexes = {idx for _score, idx in ranked[:target_count]}
        suggestions = [item for idx, item in enumerate(suggestions) if idx in keep_indexes]

    return suggestions[:80]


def normalize_pdf_match_text(text: str) -> str:
    normalized = normalize_spaces(text).casefold()
    normalized = re.sub(r"[^\w]+", " ", normalized, flags=re.UNICODE)
    return normalize_spaces(normalized)


def tokenize_pdf_match_text(text: str) -> List[str]:
    tokens = [token for token in normalize_pdf_match_text(text).split() if len(token) >= 3 and not token.isdigit()]
    deduped: List[str] = []
    seen = set()
    for token in tokens:
        if token in seen:
            continue
        seen.add(token)
        deduped.append(token)
    return deduped


def score_pdf_page_for_suggestion(
    suggestion: Dict[str, str],
    page_blob: str,
    page_tokens: set[str],
) -> float:
    title = normalize_pdf_match_text(str(suggestion.get("artworkTitle", "")))
    artist = normalize_pdf_match_text(str(suggestion.get("artistName", "")))
    if not title:
        return 0.0

    score = 0.0

    title_tokens = tokenize_pdf_match_text(title)
    if title and len(title) >= 4 and title in page_blob:
        score += 12.0
    if title_tokens:
        title_hits = sum(1 for token in title_tokens if token in page_tokens)
        score += 8.0 * (title_hits / len(title_tokens))
        if title_tokens[0] in page_tokens:
            score += 1.5

    artist_tokens = tokenize_pdf_match_text(artist)
    if artist and len(artist) >= 4 and artist in page_blob:
        score += 5.0
    if artist_tokens:
        artist_hits = sum(1 for token in artist_tokens if token in page_tokens)
        score += 3.0 * (artist_hits / len(artist_tokens))

    return score


def estimate_pdf_suggestion_target_pages(
    suggestions: List[Dict[str, str]],
    page_line_groups: List[List[str]],
) -> List[int]:
    total_pages = len(page_line_groups)
    if not suggestions or total_pages == 0:
        return []

    page_contexts: List[Dict[str, object]] = []
    for lines in page_line_groups:
        blob = normalize_pdf_match_text(" ".join(lines))
        page_contexts.append({"blob": blob, "tokens": set(blob.split())})

    targets: List[int] = []
    running_page = 0

    for index, suggestion in enumerate(suggestions):
        best_page = -1
        best_score = 0.0
        search_start = max(0, running_page - 2)

        for page_index in range(search_start, total_pages):
            context = page_contexts[page_index]
            blob = str(context.get("blob", ""))
            tokens = context.get("tokens", set())
            if not isinstance(tokens, set):
                tokens = set()
            score = score_pdf_page_for_suggestion(suggestion, blob, tokens)
            score += (page_index / max(1, total_pages - 1)) * 0.02
            if score > best_score:
                best_score = score
                best_page = page_index

        if best_page < 0 or best_score < 2.4:
            fallback_page = (
                int(round((index / max(1, len(suggestions) - 1)) * (total_pages - 1))) if total_pages > 1 else 0
            )
            best_page = max(running_page, fallback_page)

        if best_page + 2 < running_page:
            best_page = running_page

        running_page = max(running_page, best_page)
        targets.append(best_page)

    return targets


def match_pdf_suggestions_to_images(
    suggestions: List[Dict[str, str]],
    page_line_groups: List[List[str]],
    page_images: List[Dict[str, object]],
) -> List[str]:
    image_points: List[tuple[int, str]] = []
    for item in page_images:
        image_url = str(item.get("imageUrl", "")).strip()
        if not image_url:
            continue
        try:
            page_index = int(item.get("pageIndex", -1))
        except (TypeError, ValueError):
            page_index = -1
        if page_index < 0:
            continue
        image_points.append((page_index, image_url))

    if not suggestions or not image_points:
        return []

    image_points.sort(key=lambda item: item[0])
    total_images = len(image_points)

    target_pages = estimate_pdf_suggestion_target_pages(suggestions, page_line_groups)
    if not target_pages:
        return [
            image_points[min(total_images - 1, int((idx / max(1, len(suggestions) - 1)) * (total_images - 1)))][1]
            for idx in range(len(suggestions))
        ]

    matched_urls: List[str] = []
    cursor = 0

    if total_images >= len(target_pages):
        total_targets = len(target_pages)
        for idx, target_page in enumerate(target_pages):
            remaining_targets = total_targets - idx
            max_assignable_idx = total_images - remaining_targets
            start_idx = min(cursor, max_assignable_idx)

            best_idx = start_idx
            best_distance = abs(image_points[start_idx][0] - target_page)

            for candidate_idx in range(start_idx + 1, max_assignable_idx + 1):
                candidate_distance = abs(image_points[candidate_idx][0] - target_page)
                if candidate_distance < best_distance:
                    best_distance = candidate_distance
                    best_idx = candidate_idx

            matched_urls.append(image_points[best_idx][1])
            cursor = best_idx + 1
    else:
        for target_page in target_pages:
            if cursor >= total_images:
                matched_urls.append(image_points[-1][1])
                continue

            best_idx = cursor
            best_distance = abs(image_points[cursor][0] - target_page)
            search_end = min(total_images, cursor + 10)

            for candidate_idx in range(cursor + 1, search_end):
                candidate_distance = abs(image_points[candidate_idx][0] - target_page)
                if candidate_distance < best_distance:
                    best_distance = candidate_distance
                    best_idx = candidate_idx

            matched_urls.append(image_points[best_idx][1])
            cursor = best_idx + 1

    return matched_urls


def extract_pdf_insights(
    file_bytes: bytes, filename: str, progress_callback: Optional[Callable[[int, str], None]] = None
) -> Dict[str, object]:
    emit_pdf_progress(progress_callback, 5, "Validating uploaded PDF")

    if not file_bytes:
        raise ValueError("Uploaded PDF file is empty.")

    if not file_bytes.startswith(b"%PDF"):
        raise ValueError("Uploaded file does not look like a valid PDF.")

    emit_pdf_progress(progress_callback, 12, "PDF validated")
    extracted_text_result = extract_pdf_text_lines(
        file_bytes,
        progress_callback=progress_callback,
        include_page_lines=True,
    )
    if isinstance(extracted_text_result, tuple):
        text_lines, page_line_groups = extracted_text_result
    else:
        text_lines = extracted_text_result
        page_line_groups = []

    emit_pdf_progress(progress_callback, 92, "Building artwork suggestions")
    suggestion_list = extract_pdf_suggestion_list(text_lines)
    page_images: List[Dict[str, object]] = []
    if suggestion_list:
        emit_pdf_progress(progress_callback, 94, "Matching artwork images")
        page_images = extract_pdf_page_images(
            file_bytes,
            max_images=max(12, min(140, len(suggestion_list) + 24)),
            progress_callback=progress_callback,
            progress_start=95,
            progress_end=99,
        )

    if suggestion_list and page_images:
        matched_urls = match_pdf_suggestions_to_images(suggestion_list, page_line_groups, page_images)
        for index, suggestion in enumerate(suggestion_list):
            if index < len(matched_urls):
                suggestion["imageUrl"] = matched_urls[index]

    primary_suggestion = dict(suggestion_list[0]) if suggestion_list else {"artworkTitle": "", "artistName": ""}

    result = {
        "fileName": filename or "upload.pdf",
        "extractedTextLength": sum(len(line) for line in text_lines),
        "lineCount": len(text_lines),
        "previewLines": text_lines[:8],
        "suggestions": primary_suggestion,
        "suggestionsList": suggestion_list,
        "suggestionsCount": len(suggestion_list),
        "imagesCount": len(page_images),
    }
    emit_pdf_progress(progress_callback, 100, "PDF analysis completed")
    return result


class AppHandler(BaseHTTPRequestHandler):
    server_version = "DataEntryModule/0.1"

    def do_OPTIONS(self) -> None:
        self.send_response(HTTPStatus.NO_CONTENT)
        self._set_cors_headers()
        self.end_headers()

    def do_HEAD(self) -> None:
        self._handle_request(with_body=False)

    def do_GET(self) -> None:
        self._handle_request(with_body=True)

    def do_POST(self) -> None:
        self._handle_request(with_body=True)

    def log_message(self, fmt: str, *args: object) -> None:
        sys.stdout.write("%s - - [%s] %s\n" % (self.client_address[0], self.log_date_time_string(), fmt % args))

    def _set_cors_headers(self) -> None:
        self.send_header("access-control-allow-origin", "*")
        self.send_header("access-control-allow-methods", "GET,POST,HEAD,OPTIONS")
        self.send_header("access-control-allow-headers", "content-type")

    def _send_json(self, status: int, payload: Dict[str, object], with_body: bool = True) -> None:
        encoded = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self._set_cors_headers()
        self.send_header("cache-control", "no-store")
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header("content-length", str(len(encoded)))
        self.end_headers()
        if with_body:
            self.wfile.write(encoded)

    def _send_text(self, status: int, text: str, with_body: bool = True) -> None:
        encoded = text.encode("utf-8")
        self.send_response(status)
        self._set_cors_headers()
        self.send_header("cache-control", "no-store")
        self.send_header("content-type", "text/plain; charset=utf-8")
        self.send_header("content-length", str(len(encoded)))
        self.end_headers()
        if with_body:
            self.wfile.write(encoded)

    def _send_file(self, status: int, file_path: Path, with_body: bool = True) -> None:
        content = file_path.read_bytes()
        extension = file_path.suffix.lower()
        mime = MIME_TYPES.get(extension, "application/octet-stream")

        self.send_response(status)
        self._set_cors_headers()
        self.send_header("cache-control", "no-store")
        self.send_header("content-type", mime)
        self.send_header("content-length", str(len(content)))
        self.end_headers()
        if with_body:
            self.wfile.write(content)

    def _send_stream_headers(self) -> None:
        self.send_response(HTTPStatus.OK)
        self._set_cors_headers()
        self.send_header("cache-control", "no-store")
        self.send_header("content-type", "application/x-ndjson; charset=utf-8")
        self.end_headers()

    def _stream_event(self, payload: Dict[str, object]) -> bool:
        try:
            encoded = (json.dumps(payload, ensure_ascii=False) + "\n").encode("utf-8")
            self.wfile.write(encoded)
            self.wfile.flush()
            return True
        except Exception:  # pylint: disable=broad-except
            return False

    def _handle_request(self, with_body: bool) -> None:
        parsed = urlparse(self.path)

        if parsed.path == "/api/health" and self.command == "GET":
            self._send_json(HTTPStatus.OK, {"ok": True, "service": "data-entry-browser-module"}, with_body=with_body)
            return

        if parsed.path == "/api/scrape" and self.command == "POST":
            self._handle_scrape(with_body=with_body)
            return

        if parsed.path == "/api/pdf-extract" and self.command == "POST":
            self._handle_pdf_extract(with_body=with_body)
            return

        if parsed.path == "/api/pdf-extract-stream" and self.command == "POST":
            self._handle_pdf_extract_stream(with_body=with_body)
            return

        if parsed.path.startswith("/api/pdf-image/") and self.command in {"GET", "HEAD"}:
            self._handle_pdf_image_get(parsed.path, with_body=with_body)
            return

        if parsed.path.startswith("/api/"):
            self._send_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "API endpoint not found"}, with_body=with_body)
            return

        if self.command not in {"GET", "HEAD"}:
            self._send_text(HTTPStatus.METHOD_NOT_ALLOWED, "Method Not Allowed", with_body=with_body)
            return

        self._serve_static(parsed.path, with_body=with_body)

    def _handle_scrape(self, with_body: bool) -> None:
        try:
            raw_length = self.headers.get("content-length")
            length = int(raw_length) if raw_length else 0
        except ValueError:
            self._send_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "Invalid content length"}, with_body=with_body)
            return

        body_bytes = self.rfile.read(length) if length > 0 else b"{}"
        try:
            body = json.loads(body_bytes.decode("utf-8"))
        except json.JSONDecodeError:
            self._send_json(
                HTTPStatus.BAD_REQUEST,
                {"ok": False, "error": "Request body must be valid JSON."},
                with_body=with_body,
            )
            return

        target_url = str(body.get("url", "")).strip()
        if not target_url:
            self._send_json(
                HTTPStatus.BAD_REQUEST,
                {"ok": False, "error": "Please provide a profile URL in `url`."},
                with_body=with_body,
            )
            return

        try:
            result = scrape_2dg_profile(target_url)
        except Exception as error:  # pylint: disable=broad-except
            self._send_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": str(error)}, with_body=with_body)
            return

        payload = {"ok": True, **result}
        self._send_json(HTTPStatus.OK, payload, with_body=with_body)

    def _handle_pdf_extract(self, with_body: bool) -> None:
        content_type = self.headers.get("content-type", "")
        if "multipart/form-data" not in content_type.lower():
            self._send_json(
                HTTPStatus.BAD_REQUEST,
                {"ok": False, "error": "Use multipart/form-data and include `pdfFile`."},
                with_body=with_body,
            )
            return

        try:
            raw_length = self.headers.get("content-length")
            length = int(raw_length) if raw_length else 0
        except ValueError:
            self._send_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "Invalid content length"}, with_body=with_body)
            return

        if length <= 0:
            self._send_json(
                HTTPStatus.BAD_REQUEST,
                {"ok": False, "error": "No multipart body received."},
                with_body=with_body,
            )
            return

        body_bytes = self.rfile.read(length)

        try:
            parsed = parse_multipart_form_data(content_type, body_bytes)
        except ValueError as error:
            self._send_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": str(error)}, with_body=with_body)
            return

        uploaded = parsed["files"].get("pdfFile")
        if not uploaded:
            self._send_json(
                HTTPStatus.BAD_REQUEST,
                {"ok": False, "error": "Missing file field `pdfFile`."},
                with_body=with_body,
            )
            return

        filename = str(uploaded.get("filename", "upload.pdf"))
        file_bytes = uploaded.get("content", b"")
        if not isinstance(file_bytes, (bytes, bytearray)):
            file_bytes = b""

        try:
            insights = extract_pdf_insights(bytes(file_bytes), filename)
        except Exception as error:  # pylint: disable=broad-except
            self._send_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": str(error)}, with_body=with_body)
            return

        self._send_json(HTTPStatus.OK, {"ok": True, **insights}, with_body=with_body)

    def _handle_pdf_extract_stream(self, with_body: bool) -> None:
        if not with_body:
            self._send_text(HTTPStatus.METHOD_NOT_ALLOWED, "Method Not Allowed", with_body=with_body)
            return

        content_type = self.headers.get("content-type", "")
        if "multipart/form-data" not in content_type.lower():
            self._send_json(
                HTTPStatus.BAD_REQUEST,
                {"ok": False, "error": "Use multipart/form-data and include `pdfFile`."},
                with_body=with_body,
            )
            return

        try:
            raw_length = self.headers.get("content-length")
            length = int(raw_length) if raw_length else 0
        except ValueError:
            self._send_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "Invalid content length"}, with_body=with_body)
            return

        if length <= 0:
            self._send_json(
                HTTPStatus.BAD_REQUEST,
                {"ok": False, "error": "No multipart body received."},
                with_body=with_body,
            )
            return

        body_bytes = self.rfile.read(length)

        try:
            parsed = parse_multipart_form_data(content_type, body_bytes)
        except ValueError as error:
            self._send_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": str(error)}, with_body=with_body)
            return

        uploaded = parsed["files"].get("pdfFile")
        if not uploaded:
            self._send_json(
                HTTPStatus.BAD_REQUEST,
                {"ok": False, "error": "Missing file field `pdfFile`."},
                with_body=with_body,
            )
            return

        filename = str(uploaded.get("filename", "upload.pdf"))
        file_bytes = uploaded.get("content", b"")
        if not isinstance(file_bytes, (bytes, bytearray)):
            file_bytes = b""

        self._send_stream_headers()

        if not self._stream_event({"type": "progress", "progress": 3, "message": "Upload received"}):
            return

        def report_progress(progress: int, message: str) -> None:
            self._stream_event({"type": "progress", "progress": int(progress), "message": message})

        try:
            insights = extract_pdf_insights(bytes(file_bytes), filename, progress_callback=report_progress)
            self._stream_event({"type": "result", "payload": {"ok": True, **insights}})
        except Exception as error:  # pylint: disable=broad-except
            self._stream_event({"type": "error", "error": str(error)})

    def _handle_pdf_image_get(self, request_path: str, with_body: bool) -> None:
        token_match = re.match(r"^/api/pdf-image/([A-Za-z0-9_-]+)$", request_path)
        if not token_match:
            self._send_text(HTTPStatus.NOT_FOUND, "Not Found", with_body=with_body)
            return

        asset = get_pdf_image_asset(token_match.group(1))
        if not asset:
            self._send_text(HTTPStatus.NOT_FOUND, "Image not found", with_body=with_body)
            return

        content = asset.get("content", b"")
        if not isinstance(content, (bytes, bytearray)):
            content = b""
        mime = str(asset.get("mime", "application/octet-stream"))

        self.send_response(HTTPStatus.OK)
        self._set_cors_headers()
        self.send_header("cache-control", "no-store")
        self.send_header("content-type", mime)
        self.send_header("content-length", str(len(content)))
        self.end_headers()
        if with_body:
            self.wfile.write(bytes(content))

    def _serve_static(self, request_path: str, with_body: bool) -> None:
        normalized = request_path

        if normalized in {"/public", "/public/", "/public/index.html"}:
            normalized = "/"
        elif normalized.startswith("/public/"):
            normalized = normalized[len("/public") :]

        if normalized in {"", "/"}:
            normalized_rel = "index.html"
        else:
            normalized_rel = posixpath.normpath(normalized.lstrip("/"))

        if normalized_rel.startswith("../"):
            self._send_text(HTTPStatus.FORBIDDEN, "Forbidden", with_body=with_body)
            return

        file_path = (PUBLIC_DIR / normalized_rel).resolve()

        try:
            file_path.relative_to(PUBLIC_DIR.resolve())
        except ValueError:
            self._send_text(HTTPStatus.FORBIDDEN, "Forbidden", with_body=with_body)
            return

        if not file_path.exists() or not file_path.is_file():
            self._send_text(HTTPStatus.NOT_FOUND, "Not Found", with_body=with_body)
            return

        self._send_file(HTTPStatus.OK, file_path, with_body=with_body)


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), AppHandler)
    print(f"Data entry browser module running at http://{HOST}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
