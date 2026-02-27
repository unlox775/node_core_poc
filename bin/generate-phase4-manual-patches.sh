#!/usr/bin/env bash
# Regenerates phase4-manual-patch.md for all 5 stacks from their phase4.patch files.
# Run from repo root.
set -e
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

for stack in vite-express-prisma t3-stack remix redwoodjs nestjs-vite-react; do
  patch="$REPO_ROOT/packages/$stack/phase4/phase4.patch"
  if [ -f "$patch" ]; then
    node bin/patch-to-markdown.js "$patch"
  fi
done

echo "Done. All phase4-manual-patch.md files regenerated."
