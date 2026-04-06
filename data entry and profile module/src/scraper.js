"use strict";

const TWO_DG_HOST = "www.2dgalleries.com";
const TWO_DG_BASE_URL = `https://${TWO_DG_HOST}`;

const DEFAULT_HEADERS = {
  "accept-language": "en-US,en;q=0.9",
  "user-agent": "DataEntryPOC/1.0 (+https://localhost)"
};

function assert2dProfileUrl(inputUrl) {
  let parsedUrl;

  try {
    parsedUrl = new URL(inputUrl);
  } catch {
    throw new Error("Invalid URL provided.");
  }

  const isValidHost = parsedUrl.hostname === TWO_DG_HOST || parsedUrl.hostname.endsWith(`.${TWO_DG_HOST}`);
  const isProfilePath = /^\/profile\/.+/i.test(parsedUrl.pathname);

  if (!isValidHost || !isProfilePath) {
    throw new Error("Only 2DGalleries profile URLs are allowed (example: https://www.2dgalleries.com/profile/jan).");
  }

  parsedUrl.searchParams.set("lang", "en");
  return parsedUrl;
}

async function fetchHtml(url) {
  const response = await fetch(url, { headers: DEFAULT_HEADERS });

  if (!response.ok) {
    throw new Error(`Request failed for ${url} with status ${response.status}.`);
  }

  return response.text();
}

function extractUserId(profileHtml) {
  const userIdMatch = profileHtml.match(/\/userartworks\/(\d+)/i);

  if (!userIdMatch) {
    throw new Error("Could not detect the profile user id from 2DGalleries page.");
  }

  return Number(userIdMatch[1]);
}

function extractExpectedCount(profileHtml, userId) {
  const counterRegex = new RegExp(`<a\\s+href=\"/userartworks/${userId}\"[^>]*>\\s*(\\d+)\\s+artworks?\\s*</a>`, "i");
  const directMatch = profileHtml.match(counterRegex);

  if (directMatch) {
    return Number(directMatch[1]);
  }

  const allArtworksOption = profileHtml.match(/All artworks[^0-9]*(\d+)/i);
  if (allArtworksOption) {
    return Number(allArtworksOption[1]);
  }

  return null;
}

function splitArtworkBlocks(pageHtml) {
  return pageHtml
    .split('<div class="artworkcontainer">')
    .slice(1)
    .map((partial) => `<div class="artworkcontainer">${partial}`);
}

function firstMatch(regex, content) {
  const match = content.match(regex);
  return match ? match[1] : "";
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, " ");
}

function decodeHtmlEntities(value) {
  const entityMap = {
    amp: "&",
    apos: "'",
    quot: '"',
    lt: "<",
    gt: ">",
    nbsp: " ",
    eacute: "é",
    Eacute: "É",
    aacute: "á",
    agrave: "à",
    egrave: "è",
    ecirc: "ê",
    ccedil: "ç",
    uuml: "ü",
    ouml: "ö",
    auml: "ä"
  };

  let decoded = value.replace(/&([a-zA-Z]+);/g, (full, named) => entityMap[named] || full);

  decoded = decoded.replace(/&#(\d+);/g, (_, codePoint) => {
    const asNumber = Number(codePoint);
    return Number.isNaN(asNumber) ? _ : String.fromCodePoint(asNumber);
  });

  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, hexCodePoint) => {
    const asNumber = Number.parseInt(hexCodePoint, 16);
    return Number.isNaN(asNumber) ? _ : String.fromCodePoint(asNumber);
  });

  return decoded;
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function cleanText(value) {
  return normalizeWhitespace(decodeHtmlEntities(stripTags(value || "")));
}

function toAbsoluteUrl(value) {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${TWO_DG_BASE_URL}${value}`;
  }

  return `${TWO_DG_BASE_URL}/${value}`;
}

function parseArtworkBlock(blockHtml) {
  const artworkPath = firstMatch(/<a class=\"img\"\s+href=\"([^\"]+)\"/i, blockHtml);
  if (!artworkPath) {
    return null;
  }

  const imagePath = firstMatch(/<img[^>]+src=\"([^\"]+)\"/i, blockHtml);
  const titleRaw = firstMatch(/<h3[^>]*>([\s\S]*?)<\/h3>/i, blockHtml);
  const artistMatches = [...blockHtml.matchAll(/<a class=\"artist\"[^>]*>([\s\S]*?)<\/a>/gi)];

  const artists = artistMatches
    .map((match) => cleanText(match[1]))
    .filter(Boolean);

  return {
    artworkTitle: cleanText(titleRaw) || "Untitled artwork",
    artistName: artists.length > 0 ? artists.join(", ") : "Unknown artist",
    artworkUrl: toAbsoluteUrl(artworkPath),
    imageUrl: toAbsoluteUrl(imagePath)
  };
}

function findNextOffset(pageHtml, currentOffset) {
  const matches = [...pageHtml.matchAll(/data-url=\"\/userartworks\/\d+\?uid=\d+&\s*offset=(\d+)\"/gi)];
  const higherOffsets = matches
    .map((match) => Number(match[1]))
    .filter((offset) => Number.isFinite(offset) && offset > currentOffset);

  if (higherOffsets.length === 0) {
    return null;
  }

  return Math.min(...higherOffsets);
}

function dedupeEntries(entries) {
  const seen = new Set();
  const deduped = [];

  for (const entry of entries) {
    const key = entry.artworkUrl || `${entry.artworkTitle}|${entry.artistName}|${entry.imageUrl}`;

    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(entry);
    }
  }

  return deduped;
}

async function scrape2dGalleriesProfile(profileUrl) {
  const safeProfileUrl = assert2dProfileUrl(profileUrl);
  const profileHtml = await fetchHtml(safeProfileUrl.href);

  const profileUserId = extractUserId(profileHtml);
  const expectedCount = extractExpectedCount(profileHtml, profileUserId);

  const collected = [];
  const visitedOffsets = new Set();

  let currentOffset = 0;
  let iteration = 0;

  while (iteration < 100) {
    if (visitedOffsets.has(currentOffset)) {
      break;
    }

    visitedOffsets.add(currentOffset);

    const pageUrl = `${TWO_DG_BASE_URL}/userartworks/${profileUserId}?uid=${profileUserId}&offset=${currentOffset}&ajx=1&pager=1&hr=1&pid=${profileUserId}`;
    const pageHtml = await fetchHtml(pageUrl);

    const pageEntries = splitArtworkBlocks(pageHtml)
      .map(parseArtworkBlock)
      .filter(Boolean);

    if (pageEntries.length === 0) {
      break;
    }

    collected.push(...pageEntries);

    const nextOffset = findNextOffset(pageHtml, currentOffset);
    if (nextOffset === null) {
      break;
    }

    currentOffset = nextOffset;
    iteration += 1;
  }

  const entries = dedupeEntries(collected);

  return {
    sourceUrl: safeProfileUrl.href,
    profileUserId,
    expectedCount,
    foundCount: entries.length,
    meetsExpectedCount: expectedCount === null ? null : entries.length === expectedCount,
    entries
  };
}

module.exports = {
  scrape2dGalleriesProfile,
  __internal: {
    assert2dProfileUrl,
    extractUserId,
    extractExpectedCount,
    splitArtworkBlocks,
    parseArtworkBlock,
    findNextOffset,
    decodeHtmlEntities
  }
};
