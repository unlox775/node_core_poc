#!/usr/bin/env bash
# Revert Phase 4 (scaffolding + integration). Run from repo root.
[[ "$0" != "$BASH_SOURCE" ]] && { echo "Do not source this script; run it: ./revert.sh"; return 1 2>/dev/null || exit 1; }
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$REPO_ROOT"

echo "Step 1: Reverting integration patch..."
git apply -R "$SCRIPT_DIR/phase4-integration.patch" 2>/dev/null || true

echo "Step 2: Removing scaffold-generated files..."
rm -rf packages/redwoodjs/web/src/components/Contact
rm -f packages/redwoodjs/api/src/graphql/contacts.sdl.ts
rm -rf packages/redwoodjs/api/src/services/contacts
rm -rf packages/redwoodjs/web/src/pages/Contact
rm -f packages/redwoodjs/web/src/scaffold.css
rm -f packages/redwoodjs/web/src/lib/formatters.tsx 2>/dev/null || true
rm -f packages/redwoodjs/web/src/lib/formatters.test.tsx 2>/dev/null || true
rm -rf packages/redwoodjs/web/src/layouts/ScaffoldLayout
# Restore Routes and App if scaffold modified them
git checkout packages/redwoodjs/web/src/Routes.tsx packages/redwoodjs/web/src/App.tsx 2>/dev/null || true

echo "Step 3: Reverting schema patch..."
git apply -R "$SCRIPT_DIR/phase4-schema-initial.patch"

echo "Step 4: Resetting database and reseeding..."
cd packages/redwoodjs
(yarn rw prisma db push --force-reset 2>/dev/null || npx rw prisma db push --force-reset)
(yarn rw prisma db seed 2>/dev/null || npx rw prisma db seed)

echo "Phase 4 reverted. Run: cd packages/redwoodjs && (yarn rw dev || npx rw dev)"
