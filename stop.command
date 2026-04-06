#!/bin/bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/data entry and profile module"
TARGET_PORT=3000

echo "Collector DNA backend stoppen..."
echo "Backendmap: $BACKEND_DIR"
echo ""

is_project_backend_pid() {
  local pid="$1"
  local cmd
  cmd="$(ps -o command= -p "$pid" 2>/dev/null || true)"

  if [[ "$cmd" == *"$BACKEND_DIR/server.js"* ]] || [[ "$cmd" == *"$BACKEND_DIR/server.py"* ]]; then
    return 0
  fi

  return 1
}

PIDS=()

if command -v lsof >/dev/null 2>&1; then
  while IFS= read -r pid; do
    [[ -z "$pid" ]] && continue
    if is_project_backend_pid "$pid"; then
      PIDS+=("$pid")
    fi
  done < <(lsof -nP -iTCP:"$TARGET_PORT" -sTCP:LISTEN -t 2>/dev/null || true)
fi

if command -v pgrep >/dev/null 2>&1; then
  while IFS= read -r pid; do
    [[ -z "$pid" ]] && continue
    if is_project_backend_pid "$pid"; then
      PIDS+=("$pid")
    fi
  done < <(pgrep -f "$BACKEND_DIR/server.js" 2>/dev/null || true)

  while IFS= read -r pid; do
    [[ -z "$pid" ]] && continue
    if is_project_backend_pid "$pid"; then
      PIDS+=("$pid")
    fi
  done < <(pgrep -f "$BACKEND_DIR/server.py" 2>/dev/null || true)
fi

# Deduplicate PIDs
UNIQUE=()
for pid in "${PIDS[@]:-}"; do
  [[ -z "$pid" ]] && continue
  seen=0
  for existing in "${UNIQUE[@]:-}"; do
    if [[ "$existing" == "$pid" ]]; then
      seen=1
      break
    fi
  done
  if [[ "$seen" -eq 0 ]]; then
    UNIQUE+=("$pid")
  fi
done

if [[ "${#UNIQUE[@]}" -eq 0 ]]; then
  echo "Geen actieve backend van dit project gevonden."
  exit 0
fi

echo "Stoppen van backend-processen: ${UNIQUE[*]}"
kill "${UNIQUE[@]}" 2>/dev/null || true

sleep 0.6

STILL_RUNNING=()
for pid in "${UNIQUE[@]}"; do
  if kill -0 "$pid" 2>/dev/null; then
    STILL_RUNNING+=("$pid")
  fi
done

if [[ "${#STILL_RUNNING[@]}" -gt 0 ]]; then
  echo "Force stop voor processen: ${STILL_RUNNING[*]}"
  kill -9 "${STILL_RUNNING[@]}" 2>/dev/null || true
fi

echo "Backend gestopt."
