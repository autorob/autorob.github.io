#!/usr/bin/env bash
# Syncs Project 1 student-facing content from the autorob_agentic repository's
# project-spec-visualizer branch, pinned to a specific commit so re-syncs are
# an explicit, reviewable diff rather than a silent drive-by update.
set -euo pipefail

# autorob_agentic is a private repository -- SOURCE_REPO defaults to the
# local clone (this sandbox's working layout puts it at
# /ai/development/autorob_agentic, alongside this site's own working dir).
# Override with a git+ssh/https URL (and appropriate credentials/deploy key)
# if running somewhere that local clone doesn't exist, e.g. in CI.
SOURCE_REPO="${SOURCE_REPO:-/ai/development/autorob_agentic}"
SOURCE_REF="project-spec-visualizer"
SOURCE_SHA="f6e6f8d74e66854bf9ffa5b35988d0656786bd96"
SOURCE_DOCS_DIR="docs"   # the *upstream* repo's docs dir -- never mirrored by name locally
DEST="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/docs/projects/project1"

WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

git clone --no-checkout --quiet "$SOURCE_REPO" "$WORKDIR/src"
git -C "$WORKDIR/src" checkout "$SOURCE_SHA" -- \
  "$SOURCE_DOCS_DIR/PROJECT1_ASTAR.md" \
  "$SOURCE_DOCS_DIR/ROSBRIDGE_PROTOCOL.md" \
  "$SOURCE_DOCS_DIR/layouts/c.md" \
  "$SOURCE_DOCS_DIR/layouts/cpp.md" \
  "$SOURCE_DOCS_DIR/layouts/python.md" \
  "$SOURCE_DOCS_DIR/layouts/rust.md"

mkdir -p "$DEST/layouts"
cp "$WORKDIR/src/$SOURCE_DOCS_DIR/PROJECT1_ASTAR.md"     "$DEST/index.md"
cp "$WORKDIR/src/$SOURCE_DOCS_DIR/ROSBRIDGE_PROTOCOL.md" "$DEST/ROSBRIDGE_PROTOCOL.md"
cp "$WORKDIR/src/$SOURCE_DOCS_DIR/layouts/"*.md           "$DEST/layouts/"

echo "Synced from $SOURCE_REPO@$SOURCE_SHA ($SOURCE_REF) -- review with git diff before committing."
