#!/bin/bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$PROJECT_DIR/.." && pwd)"
PUBLIC_DIR="$PROJECT_DIR/public"
cd "$PROJECT_DIR"

echo "Data Entry Browser Module starten..."
echo "Projectmap: $PROJECT_DIR"
echo "Open in je browser: http://127.0.0.1:3000/"
echo ""

if [[ -d "$PUBLIC_DIR" ]] && [[ -f "$ROOT_DIR/index.html" ]] && [[ -f "$ROOT_DIR/app.js" ]] && [[ -f "$ROOT_DIR/styles.css" ]]; then
  cp "$ROOT_DIR/app.js" "$PUBLIC_DIR/app.js"
  cp "$ROOT_DIR/index.html" "$PUBLIC_DIR/index.html"
  cp "$ROOT_DIR/styles.css" "$PUBLIC_DIR/styles.css"
  echo "Frontend gesynchroniseerd vanuit root projectmap."
  echo ""
fi

if command -v open >/dev/null 2>&1; then
  (sleep 1; open "http://127.0.0.1:3000/" >/dev/null 2>&1 || true) &
fi

if command -v node >/dev/null 2>&1; then
  echo "Backend: Node.js (server.js)"
  exec node server.js
fi

if command -v python3 >/dev/null 2>&1; then
  echo "Backend: Python fallback (server.py)"
  exec python3 server.py
fi

echo "Geen Node.js of Python3 gevonden op je systeem."
echo "Installeer Node.js via: https://nodejs.org/ of Python 3 via: https://www.python.org/"
read -r -p "Druk op Enter om af te sluiten..." _
exit 1
