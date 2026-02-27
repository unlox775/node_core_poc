#!/usr/bin/env bash
# Apply Phase 4 (Contact model) using scaffolding + integration patch. Run from repo root.
[[ "$0" != "$BASH_SOURCE" ]] && { echo "Do not source this script; run it: ./apply.sh"; return 1 2>/dev/null || exit 1; }
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$REPO_ROOT"

echo "Step 1: Applying schema (Contact model only)..."
git apply "$SCRIPT_DIR/phase4-schema-initial.patch"

echo "Step 2: Pushing schema to database..."
cd packages/redwoodjs
(yarn rw prisma db push --force-reset 2>/dev/null || npx rw prisma db push --force-reset) || true

echo "Step 3: Running Redwood scaffold for Contact..."
echo "  (Run: yarn rw generate scaffold Contact   OR   npx rw generate scaffold Contact)"
echo "  If yarn/npx fails, run it manually from packages/redwoodjs, then run this script again with --skip-scaffold"
if [[ "$1" != "--skip-scaffold" ]]; then
  (yarn rw generate scaffold Contact 2>/dev/null || npx rw generate scaffold Contact 2>/dev/null) || {
    echo "Scaffold failed or not available. Run manually:"
    echo "  cd packages/redwoodjs && yarn rw generate scaffold Contact"
    echo "Then: ./packages/redwoodjs/phase4/apply.sh --skip-scaffold"
    exit 1
  }
fi

cd "$REPO_ROOT"
echo "Step 4: Applying integration patch (Deal-Contact, admin pages)..."
git apply "$SCRIPT_DIR/phase4-integration.patch"

echo "Step 5: Pushing updated schema (DealContact) and seeding..."
cd packages/redwoodjs
(yarn rw prisma db push --force-reset 2>/dev/null || npx rw prisma db push --force-reset)
(yarn rw prisma db seed 2>/dev/null || npx rw prisma db seed)

echo "Phase 4 applied. Run: cd packages/redwoodjs && (yarn rw dev || npx rw dev)"
