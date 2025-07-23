#!/bin/bash

# Shared script for converting GitBook docs and running Docusaurus commands
# Usage: convert-and-run.sh <command>
# Commands: start, build

COMMAND=$1
if [ -z "$COMMAND" ]; then
    echo "Usage: $0 <command>"
    echo "Commands: start, build"
    exit 1
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SITE_DIR="$(dirname "$SCRIPT_DIR")"
REPO_ROOT="$(dirname "$SITE_DIR")"

# Create a temporary docs directory at the expected location
TEMP_DOCS="$REPO_ROOT/docs-temp"

echo "Setting up temporary docs directory..."
rm -rf "$TEMP_DOCS"
mkdir -p "$TEMP_DOCS"

# Convert GitBook docs to Docusaurus format using the original converter with output directory
echo "Converting GitBook docs to Docusaurus format..."
node "$SCRIPT_DIR/convert-gitbook-to-docusaurus.js" "$REPO_ROOT/docs" "$TEMP_DOCS"

if [ $? -ne 0 ]; then
    echo "Conversion failed!"
    exit 1
fi

# Copy images to where the converted docs expect them
echo "Copying images..."
mkdir -p "$TEMP_DOCS/images"
cp -r "$REPO_ROOT/images/." "$TEMP_DOCS/images/"

# Run the appropriate Docusaurus command with DOCS_PATH
cd "$SITE_DIR"
case "$COMMAND" in
    start)
        echo "Starting Docusaurus development server..."
        DOCS_PATH="$TEMP_DOCS" npm run "$COMMAND"
        ;;
    build)
        echo "Building Docusaurus site..."
        DOCS_PATH="$TEMP_DOCS" npm run "$COMMAND"
        ;;
    *)
        echo "Unknown command: $COMMAND"
        exit 1
        ;;
esac