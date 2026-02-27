#!/usr/bin/env bash
# Start local PostgreSQL (Homebrew). Run from anywhere.
# Prereq: brew install postgresql@14, initdb already run for the data dir.

set -e

# Apple Silicon vs Intel
if [[ -d /opt/homebrew/var/postgresql@14 ]]; then
  DATA_DIR="/opt/homebrew/var/postgresql@14"
  PG_BIN="/opt/homebrew/opt/postgresql@14/bin"
elif [[ -d /usr/local/var/postgresql@14 ]]; then
  DATA_DIR="/usr/local/var/postgresql@14"
  PG_BIN="/usr/local/opt/postgresql@14/bin"
else
  echo "PostgreSQL data dir not found. Run: brew install postgresql@14"
  echo "Then: initdb /opt/homebrew/var/postgresql@14  (Apple Silicon)"
  echo "Or:   initdb /usr/local/var/postgresql@14     (Intel)"
  exit 1
fi

LOG_FILE="${HOME}/postgresql@14.log"

if "${PG_BIN}/pg_isready" -h localhost -q 2>/dev/null; then
  echo "PostgreSQL is already running on localhost:5432"
  exit 0
fi

echo "Starting PostgreSQL..."
"${PG_BIN}/pg_ctl" -D "$DATA_DIR" -l "$LOG_FILE" start

echo "PostgreSQL started. Log: $LOG_FILE"
