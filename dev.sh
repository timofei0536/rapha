#!/usr/bin/env bash

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20

kill -9 $(lsof -ti:3000) 2>/dev/null || true
# Keep .next — dev starts faster with cache. Full clean: rm -rf .next && npm run dev

node scripts/sync/watch-theme-sync.mjs &
THEME_PID=$!

next dev -p 3000 &
DEV_PID=$!

cleanup() {
  kill "$THEME_PID" 2>/dev/null || true
  kill "$DEV_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

sleep 2
open "http://localhost:3000/" || true

wait "$DEV_PID"
