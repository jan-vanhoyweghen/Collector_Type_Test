#!/bin/bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/data entry and profile module"
PUBLIC_DIR="$BACKEND_DIR/public"
APP_FILE="$PROJECT_DIR/index.html"
HOST="127.0.0.1"
DEFAULT_PORT=3000

echo "Collector DNA app starten..."
echo "Projectmap: $PROJECT_DIR"
echo "Backendmap: $BACKEND_DIR"
echo "Appbestand: $APP_FILE"
echo ""

if [[ ! -d "$BACKEND_DIR" ]]; then
  echo "Backend map niet gevonden: $BACKEND_DIR"
  read -r -p "Druk op Enter om af te sluiten..." _
  exit 1
fi

if [[ ! -f "$APP_FILE" ]]; then
  echo "App index niet gevonden: $APP_FILE"
  read -r -p "Druk op Enter om af te sluiten..." _
  exit 1
fi

if [[ -d "$PUBLIC_DIR" ]]; then
  cp "$PROJECT_DIR/app.js" "$PUBLIC_DIR/app.js"
  cp "$PROJECT_DIR/index.html" "$PUBLIC_DIR/index.html"
  cp "$PROJECT_DIR/styles.css" "$PUBLIC_DIR/styles.css"
  echo "Frontend gesynchroniseerd naar backend/public."
  echo ""
fi

pick_port() {
  local port="$DEFAULT_PORT"

  if ! command -v lsof >/dev/null 2>&1; then
    echo "$port"
    return 0
  fi

  while lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; do
    port=$((port + 1))
    if [[ "$port" -gt 3999 ]]; then
      break
    fi
  done

  echo "$port"
}

BACKEND_PORT="$(pick_port)"
API_BASE_URL="http://$HOST:$BACKEND_PORT"
APP_URL="file://${APP_FILE// /%20}#api=${API_BASE_URL}"

if command -v open >/dev/null 2>&1; then
  (sleep 1; open "$APP_URL" >/dev/null 2>&1 || true) &
fi

cd "$BACKEND_DIR"
echo "Backend target: $API_BASE_URL"
echo "App URL: $APP_URL"
echo ""

if command -v node >/dev/null 2>&1; then
  echo "Backend: Node.js (server.js)"
  PORT="$BACKEND_PORT" HOST="$HOST" exec node server.js
fi

if command -v python3 >/dev/null 2>&1; then
  echo "Backend: Python fallback (server.py)"
  PORT="$BACKEND_PORT" HOST="$HOST" exec python3 server.py
fi

echo "Geen Node.js of Python3 gevonden op je systeem."
echo "Installeer Node.js via: https://nodejs.org/ of Python 3 via: https://www.python.org/"
read -r -p "Druk op Enter om af te sluiten..." _
exit 1
