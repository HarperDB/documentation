#!/bin/bash

# Script to serve built Docusaurus site
# Assumes site has already been built with build-local.sh

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SITE_DIR="$(dirname "$SCRIPT_DIR")"

# Check if build exists
if [ ! -d "$SITE_DIR/build" ]; then
    echo "No build found. Please run 'npm run site:build' first."
    exit 1
fi

# Serve the built site
echo "Serving Docusaurus site..."
cd "$SITE_DIR"
npm run serve