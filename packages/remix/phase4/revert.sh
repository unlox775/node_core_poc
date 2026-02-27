#!/usr/bin/env bash
# Revert Phase 4 patch. Run from repo root.
[[ "$0" != "$BASH_SOURCE" ]] && { echo "Do not source this script; run it: ./revert.sh"; return 1 2>/dev/null || exit 1; }
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$REPO_ROOT"
git apply -R "$SCRIPT_DIR/phase4.patch"
echo "Phase 4 reverted. Run: cd packages/remix && npm run db:reseed && npm run dev"
