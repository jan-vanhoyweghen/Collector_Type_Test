# Data Entry Browser Module (POC)

This project implements the requested **collector profile + data entry browser module**.

## What it includes

- Collector profile form
  - Required: first name, name
  - Optional: age, location, mail address
  - Input mode choice: manual, PDF, scrape link
- Data entry module
  - Manual entry (one by one)
  - PDF workflow (auto-detect title/artist suggestions and optionally import multiple artworks from one PDF)
  - Scraping workflow for 2DGalleries profile links
- Artwork listing table
  - One picture, artwork name, and artist name per row

## POC scrape target

Default scrape URL in the UI:

- `https://www.2dgalleries.com/profile/jan`

The scraper reads the profile metadata and paginated artwork blocks from 2DGalleries and reports:

- expected profile artwork count
- found extracted artwork count
- whether both match

## Run

With Node.js:

```bash
npm start
```

Or with Python fallback:

```bash
python3 server.py
```

Open:

- `http://127.0.0.1:3000`

Also valid:

- `http://127.0.0.1:3000/public/index.html`

## Start with double click (macOS)

- Double-click `start.command` in the project folder.
- Keep the Terminal window open while using the module.
- The script uses `server.js` when Node.js is installed, otherwise it falls back to `server.py` (Python 3).
- Your browser opens automatically on `http://127.0.0.1:3000/`.

## API

- `GET /api/health`
- `POST /api/scrape`
- `POST /api/pdf-extract` (multipart form-data, field: `pdfFile`)
- OpenAPI spec: `exports/openapi.json`

Example body:

```json
{
  "url": "https://www.2dgalleries.com/profile/jan"
}
```
