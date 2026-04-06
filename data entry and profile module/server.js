"use strict";

const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs/promises");
const os = require("node:os");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");

const { scrape2dGalleriesProfile } = require("./src/scraper");

const execFileAsync = promisify(execFile);
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

function setCorsHeaders(res) {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "GET,POST,HEAD,OPTIONS");
  res.setHeader("access-control-allow-headers", "content-type");
}

function sendJson(res, statusCode, payload) {
  const data = JSON.stringify(payload);

  setCorsHeaders(res);
  res.writeHead(statusCode, {
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8"
  });

  res.end(data);
}

function sendText(res, statusCode, text) {
  setCorsHeaders(res);
  res.writeHead(statusCode, {
    "cache-control": "no-store",
    "content-type": "text/plain; charset=utf-8"
  });

  res.end(text);
}

function sendNdjsonHeaders(res) {
  setCorsHeaders(res);
  res.writeHead(200, {
    "cache-control": "no-store",
    "content-type": "application/x-ndjson; charset=utf-8"
  });
}

function writeNdjsonEvent(res, payload) {
  try {
    res.write(`${JSON.stringify(payload)}\n`);
    return true;
  } catch {
    return false;
  }
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function parseMultipartFormData(contentType, bodyBuffer) {
  const boundaryMatch = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType || "");
  if (!boundaryMatch) {
    throw new Error("Missing multipart boundary in content-type header.");
  }

  const boundary = `--${(boundaryMatch[1] || boundaryMatch[2] || "").trim()}`;
  if (!boundary || boundary === "--") {
    throw new Error("Invalid multipart boundary.");
  }

  const bodyText = bodyBuffer.toString("latin1");
  const sections = bodyText.split(boundary);
  const files = {};
  const fields = {};

  for (const rawSection of sections) {
    let section = rawSection.trim();
    if (!section || section === "--") {
      continue;
    }

    if (section.endsWith("--")) {
      section = section.slice(0, -2).trim();
    }

    const headerEnd = section.indexOf("\r\n\r\n");
    if (headerEnd === -1) {
      continue;
    }

    const headerText = section.slice(0, headerEnd);
    let contentText = section.slice(headerEnd + 4);
    if (contentText.endsWith("\r\n")) {
      contentText = contentText.slice(0, -2);
    }

    const headers = {};
    for (const line of headerText.split("\r\n")) {
      const idx = line.indexOf(":");
      if (idx === -1) {
        continue;
      }
      const key = line.slice(0, idx).trim().toLowerCase();
      const value = line.slice(idx + 1).trim();
      headers[key] = value;
    }

    const disposition = headers["content-disposition"] || "";
    const nameMatch = /name="([^"]+)"/i.exec(disposition);
    if (!nameMatch) {
      continue;
    }

    const fieldName = nameMatch[1];
    const fileNameMatch = /filename="([^"]*)"/i.exec(disposition);
    const contentBuffer = Buffer.from(contentText, "latin1");

    if (fileNameMatch) {
      files[fieldName] = {
        filename: fileNameMatch[1],
        contentType: headers["content-type"] || "application/octet-stream",
        content: contentBuffer
      };
    } else {
      fields[fieldName] = contentBuffer.toString("utf8");
    }
  }

  return { fields, files };
}

async function extractPdfTextLines(pdfBuffer, progressCallback) {
  if (!Buffer.isBuffer(pdfBuffer) || pdfBuffer.length === 0) {
    return [];
  }

  const tmpPath = path.join(os.tmpdir(), `collector_pdf_${Date.now()}_${Math.random().toString(16).slice(2)}.pdf`);

  try {
    if (typeof progressCallback === "function") {
      progressCallback(18, "Preparing PDF text extraction");
    }

    await fs.writeFile(tmpPath, pdfBuffer);
    if (typeof progressCallback === "function") {
      progressCallback(28, "PDF file staged");
    }

    let heartbeatValue = 30;
    let heartbeatTimer = null;
    let stdout = "";
    if (typeof progressCallback === "function") {
      progressCallback(heartbeatValue, "Extracting PDF text");
      heartbeatTimer = setInterval(() => {
        heartbeatValue = Math.min(86, heartbeatValue + 2);
        progressCallback(heartbeatValue, "Extracting PDF text");
      }, 900);
    }

    try {
      const result = await execFileAsync("/usr/bin/strings", ["-n", "5", tmpPath], {
        encoding: "utf8",
        timeout: 15000
      });
      stdout = result.stdout;
    } finally {
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
      }
    }

    const seen = new Set();
    const lines = [];

    for (const line of String(stdout || "").split(/\r?\n/)) {
      const clean = normalizeText(line);
      if (clean.length < 2 || seen.has(clean)) {
        continue;
      }
      seen.add(clean);
      lines.push(clean);
    }

    if (typeof progressCallback === "function") {
      progressCallback(90, "PDF text extraction complete");
    }
    return lines;
  } finally {
    await fs.unlink(tmpPath).catch(() => {});
  }
}

function looksLikePersonName(line) {
  return /^[A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÖØ-öø-ÿ'’.\-]+(?:\s+[A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÖØ-öø-ÿ'’.\-]+){1,3}$/.test(line);
}

function suggestTitleAndArtist(lines) {
  const candidateLines = lines.slice(0, 120).filter(Boolean);

  let artist = "";
  let artworkTitle = "";

  for (const line of candidateLines) {
    const match = /^(?:artist(?:\(s\))?)\s*[:\-]\s*(.+)$/i.exec(line);
    if (match) {
      artist = normalizeText(match[1]);
      break;
    }
  }

  if (!artist) {
    for (const line of candidateLines) {
      const match = /^by\s+(.+)$/i.exec(line);
      if (match) {
        artist = normalizeText(match[1]);
        break;
      }
    }
  }

  if (!artist) {
    for (const line of candidateLines) {
      if (looksLikePersonName(line)) {
        artist = line;
        break;
      }
    }
  }

  for (const line of candidateLines) {
    const match = /^(?:title|artwork)\s*[:\-]\s*(.+)$/i.exec(line);
    if (match) {
      artworkTitle = normalizeText(match[1]);
      break;
    }
  }

  const stopwords = ["page ", "www.", "http", "copyright", "catalog", "all rights", ".com"];
  if (!artworkTitle) {
    for (const line of candidateLines) {
      const lowered = line.toLowerCase();
      if (stopwords.some((word) => lowered.includes(word))) {
        continue;
      }
      if (looksLikePersonName(line)) {
        continue;
      }
      if (line.length < 3 || line.length > 110) {
        continue;
      }
      if (/^[\d\s\-_/.:]+$/.test(line)) {
        continue;
      }
      artworkTitle = line;
      break;
    }
  }

  return { artworkTitle, artistName: artist };
}

function extractPdfSuggestionList(lines) {
  const candidateLines = lines.slice(0, 240).filter(Boolean);
  const titlePattern = /^(?:title|artwork)\s*[:\-]\s*(.+)$/i;
  const artistPattern = /^artist(?:\(s\))?\s*[:\-]\s*(.+)$/i;
  const byPattern = /^by\s+(.+)$/i;

  const suggestions = [];
  const seen = new Set();

  function addCandidate(titleValue, artistValue) {
    const artworkTitle = normalizeText(titleValue);
    const artistName = normalizeText(artistValue);

    if (!artworkTitle && !artistName) {
      return;
    }

    const signature = `${artworkTitle.toLowerCase()}::${artistName.toLowerCase()}`;
    if (seen.has(signature)) {
      return;
    }

    seen.add(signature);
    suggestions.push({ artworkTitle, artistName });
  }

  let pendingTitle = "";
  let pendingArtist = "";

  for (const line of candidateLines) {
    const titleMatch = titlePattern.exec(line);
    if (titleMatch) {
      const titleValue = normalizeText(titleMatch[1]);
      if (pendingArtist) {
        addCandidate(titleValue, pendingArtist);
        pendingArtist = "";
        pendingTitle = "";
      } else {
        if (pendingTitle) {
          addCandidate(pendingTitle, "");
        }
        pendingTitle = titleValue;
      }
      continue;
    }

    const artistMatch = artistPattern.exec(line) || byPattern.exec(line);
    if (artistMatch) {
      const artistValue = normalizeText(artistMatch[1]);
      if (pendingTitle) {
        addCandidate(pendingTitle, artistValue);
        pendingTitle = "";
        pendingArtist = "";
      } else {
        if (pendingArtist) {
          addCandidate("", pendingArtist);
        }
        pendingArtist = artistValue;
      }
    }
  }

  if (pendingTitle) {
    addCandidate(pendingTitle, "");
  }
  if (pendingArtist) {
    addCandidate("", pendingArtist);
  }

  const fallback = suggestTitleAndArtist(candidateLines);
  addCandidate(fallback.artworkTitle, fallback.artistName);

  return suggestions.slice(0, 30);
}

async function extractPdfInsights(fileBuffer, fileName, progressCallback) {
  if (typeof progressCallback === "function") {
    progressCallback(5, "Validating uploaded PDF");
  }

  if (!Buffer.isBuffer(fileBuffer) || fileBuffer.length === 0) {
    throw new Error("Uploaded PDF file is empty.");
  }

  if (String(fileBuffer.slice(0, 4)) !== "%PDF") {
    throw new Error("Uploaded file does not look like a valid PDF.");
  }

  if (typeof progressCallback === "function") {
    progressCallback(12, "PDF validated");
  }

  const lines = await extractPdfTextLines(fileBuffer, progressCallback);
  if (typeof progressCallback === "function") {
    progressCallback(95, "Building artwork suggestions");
  }
  const suggestionsList = extractPdfSuggestionList(lines);
  const suggestions = suggestionsList[0] || { artworkTitle: "", artistName: "" };

  if (typeof progressCallback === "function") {
    progressCallback(100, "PDF analysis completed");
  }

  return {
    fileName: fileName || "upload.pdf",
    extractedTextLength: lines.reduce((sum, line) => sum + line.length, 0),
    lineCount: lines.length,
    previewLines: lines.slice(0, 8),
    suggestions,
    suggestionsList,
    suggestionsCount: suggestionsList.length
  };
}

async function readRequestBodyBuffer(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function readRequestBody(req) {
  const bodyBuffer = await readRequestBodyBuffer(req);
  return bodyBuffer.toString("utf8");
}

async function parseJsonBody(req) {
  const bodyText = await readRequestBody(req);

  if (!bodyText) {
    return {};
  }

  try {
    return JSON.parse(bodyText);
  } catch {
    throw new Error("Request body must be valid JSON.");
  }
}

function getSafePublicFilePath(requestPath) {
  const normalizedRequestPath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
  const resolvedPath = path.normalize(normalizedRequestPath).replace(/^([.][.][/\\])+/, "");
  const absolutePath = path.join(PUBLIC_DIR, resolvedPath);

  const allowedPrefix = `${PUBLIC_DIR}${path.sep}`;
  if (absolutePath !== PUBLIC_DIR && !absolutePath.startsWith(allowedPrefix)) {
    return null;
  }

  return absolutePath;
}

async function serveStaticFile(req, res, pathname) {
  let normalizedPathname = pathname;

  if (normalizedPathname === "/public" || normalizedPathname === "/public/") {
    normalizedPathname = "/";
  } else if (normalizedPathname === "/public/index.html") {
    normalizedPathname = "/";
  } else if (normalizedPathname.startsWith("/public/")) {
    normalizedPathname = normalizedPathname.replace(/^\/public/, "");
  }

  const filePath = getSafePublicFilePath(normalizedPathname);
  if (!filePath) {
    sendText(res, 403, "Forbidden");
    return;
  }

  try {
    const fileContent = await fs.readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extension] || "application/octet-stream";

    setCorsHeaders(res);
    res.writeHead(200, {
      "cache-control": "no-store",
      "content-type": contentType
    });

    if (req.method === "HEAD") {
      res.end();
      return;
    }

    res.end(fileContent);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      sendText(res, 404, "Not Found");
      return;
    }

    console.error(error);
    sendText(res, 500, "Internal Server Error");
  }
}

async function handleApi(req, res, urlObj) {
  if (req.method === "GET" && urlObj.pathname === "/api/health") {
    sendJson(res, 200, {
      ok: true,
      service: "data-entry-browser-module"
    });
    return true;
  }

  if (req.method === "POST" && urlObj.pathname === "/api/scrape") {
    try {
      const body = await parseJsonBody(req);
      const targetUrl = typeof body.url === "string" ? body.url.trim() : "";

      if (!targetUrl) {
        sendJson(res, 400, {
          ok: false,
          error: "Please provide a profile URL in `url`."
        });
        return true;
      }

      const scrapeResult = await scrape2dGalleriesProfile(targetUrl);

      sendJson(res, 200, {
        ok: true,
        ...scrapeResult
      });
      return true;
    } catch (error) {
      sendJson(res, 400, {
        ok: false,
        error: error instanceof Error ? error.message : "Scrape failed"
      });
      return true;
    }
  }

  if (req.method === "POST" && urlObj.pathname === "/api/pdf-extract") {
    try {
      const contentType = String(req.headers["content-type"] || "");
      if (!contentType.toLowerCase().includes("multipart/form-data")) {
        sendJson(res, 400, {
          ok: false,
          error: "Use multipart/form-data and include `pdfFile`."
        });
        return true;
      }

      const bodyBuffer = await readRequestBodyBuffer(req);
      const parsed = parseMultipartFormData(contentType, bodyBuffer);
      const uploaded = parsed.files.pdfFile;

      if (!uploaded) {
        sendJson(res, 400, {
          ok: false,
          error: "Missing file field `pdfFile`."
        });
        return true;
      }

      const insights = await extractPdfInsights(uploaded.content, uploaded.filename);
      sendJson(res, 200, {
        ok: true,
        ...insights
      });
      return true;
    } catch (error) {
      sendJson(res, 400, {
        ok: false,
        error: error instanceof Error ? error.message : "PDF extraction failed"
      });
      return true;
    }
  }

  if (req.method === "POST" && urlObj.pathname === "/api/pdf-extract-stream") {
    try {
      const contentType = String(req.headers["content-type"] || "");
      if (!contentType.toLowerCase().includes("multipart/form-data")) {
        sendJson(res, 400, {
          ok: false,
          error: "Use multipart/form-data and include `pdfFile`."
        });
        return true;
      }

      const bodyBuffer = await readRequestBodyBuffer(req);
      const parsed = parseMultipartFormData(contentType, bodyBuffer);
      const uploaded = parsed.files.pdfFile;

      if (!uploaded) {
        sendJson(res, 400, {
          ok: false,
          error: "Missing file field `pdfFile`."
        });
        return true;
      }

      sendNdjsonHeaders(res);
      if (!writeNdjsonEvent(res, { type: "progress", progress: 3, message: "Upload received" })) {
        return true;
      }

      const insights = await extractPdfInsights(uploaded.content, uploaded.filename, (progress, message) => {
        writeNdjsonEvent(res, { type: "progress", progress, message });
      });

      writeNdjsonEvent(res, {
        type: "result",
        payload: {
          ok: true,
          ...insights
        }
      });
      res.end();
      return true;
    } catch (error) {
      sendNdjsonHeaders(res);
      writeNdjsonEvent(res, {
        type: "error",
        error: error instanceof Error ? error.message : "PDF extraction failed"
      });
      res.end();
      return true;
    }
  }

  if (urlObj.pathname.startsWith("/api/")) {
    sendJson(res, 404, {
      ok: false,
      error: "API endpoint not found"
    });
    return true;
  }

  return false;
}

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url || !req.method) {
      sendText(res, 400, "Bad Request");
      return;
    }

    if (req.method === "OPTIONS") {
      setCorsHeaders(res);
      res.writeHead(204);
      res.end();
      return;
    }

    const urlObj = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const apiHandled = await handleApi(req, res, urlObj);

    if (apiHandled) {
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      sendText(res, 405, "Method Not Allowed");
      return;
    }

    await serveStaticFile(req, res, urlObj.pathname);
  } catch (error) {
    console.error(error);
    sendText(res, 500, "Internal Server Error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Data entry browser module running at http://${HOST}:${PORT}`);
});
