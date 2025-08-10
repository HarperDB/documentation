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

# Check if we need to run the full migration (versioned docs don't exist)
if [ ! -d "$SITE_DIR/versioned_docs" ] || [ ! -f "$SITE_DIR/versions.json" ]; then
    echo "Versioned documentation not found. Running full migration..."
    
    # Clean up any existing versioned docs
    rm -rf "$SITE_DIR/versioned_docs" "$SITE_DIR/versioned_sidebars" "$SITE_DIR/docs"
    
    # Run the migration script to create versioned docs
    echo "Creating versioned documentation from release branches..."
    node "$SCRIPT_DIR/migrate-branches-to-versions.js"
    
    if [ $? -ne 0 ]; then
        echo "Migration failed!"
        exit 1
    fi
fi

# Run the appropriate Docusaurus command
cd "$SITE_DIR"
case "$COMMAND" in
    start)
        echo "Starting Docusaurus development server..."
        npm run "$COMMAND"
        ;;
    build)
        echo "Building Docusaurus site..."
        npm run "$COMMAND"
        ;;
    *)
        echo "Unknown command: $COMMAND"
        exit 1
        ;;
esac