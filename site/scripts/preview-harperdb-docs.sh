#!/bin/bash
# Preview documentation from harperdb repository
# Run this from the documentation/site directory
# Usage: ./scripts/preview-harperdb-docs.sh <path-to-harperdb>

HARPERDB_PATH=$1

if [ -z "$HARPERDB_PATH" ]; then
    echo "Usage: $0 <path-to-harperdb>"
    echo "Example: $0 ../../harperdb"
    exit 1
fi

# Convert to absolute path
HARPERDB_PATH="$(cd "$HARPERDB_PATH" && pwd)"

if [ ! -d "$HARPERDB_PATH/docs" ]; then
    echo "Error: No docs directory found at $HARPERDB_PATH/docs"
    echo "Have you run the sync-and-convert script?"
    exit 1
fi

echo "Starting preview of harperdb docs..."
echo "  Docs path: $HARPERDB_PATH/docs"
echo "  Images path: $HARPERDB_PATH/docs/images"

# Clear docusaurus cache to ensure config changes are picked up
echo "Clearing docusaurus cache..."
npx docusaurus clear

# Start docusaurus with environment variables pointing to harperdb
echo "Starting server with DOCS_PATH=$HARPERDB_PATH/docs"
DOCS_PATH="$HARPERDB_PATH/docs" \
IMAGES_PATH="$HARPERDB_PATH/docs/images" \
npm start