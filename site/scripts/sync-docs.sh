#!/bin/bash
# Sync documentation between documentation and harperdb repos
# Usage: ./sync-docs.sh <target-repo-path> [branch]
# Example from harperdb: bash ../documentation/site/scripts/sync-docs.sh . main
# Example from documentation: bash site/scripts/sync-docs.sh ../../harperdb main

TARGET_PATH=$1
BRANCH=${2:-main}
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SOURCE_REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

if [ -z "$TARGET_PATH" ]; then
    echo "Usage: $0 <target-repo-path> [branch]"
    echo "Example from harperdb: bash ../documentation/site/scripts/sync-docs.sh . main"
    echo "Example from documentation: bash site/scripts/sync-docs.sh ../../harperdb main"
    exit 1
fi

# Convert to absolute path
TARGET_PATH="$(cd "$TARGET_PATH" && pwd)"

echo "Syncing documentation:"
echo "  From: $SOURCE_REPO_ROOT (branch: $BRANCH)"
echo "  To: $TARGET_PATH"

# Ensure both repos are on correct branch and have latest changes
for REPO_PATH in "$SOURCE_REPO_ROOT" "$TARGET_PATH"; do
    echo ""
    echo "Updating repository: $REPO_PATH"
    cd "$REPO_PATH"
    
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
        echo "Switching from '$CURRENT_BRANCH' to '$BRANCH'..."
        git checkout "$BRANCH"
        if [ $? -ne 0 ]; then
            echo "Error: Failed to switch to branch '$BRANCH' in $REPO_PATH"
            exit 1
        fi
    fi
    
    echo "Pulling latest changes..."
    git pull origin "$BRANCH"
    if [ $? -ne 0 ]; then
        echo "Warning: Failed to pull latest changes. Continue anyway? (y/n)"
        read -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
done

# Create target docs directory if needed
mkdir -p "$TARGET_PATH/docs"

# Copy documentation
echo ""
echo "Copying documentation files..."
cp -r "$SOURCE_REPO_ROOT/docs/"* "$TARGET_PATH/docs/"

# Copy images if they exist
if [ -d "$SOURCE_REPO_ROOT/images" ]; then
    mkdir -p "$TARGET_PATH/images"
    cp -r "$SOURCE_REPO_ROOT/images/"* "$TARGET_PATH/images/"
fi

echo ""
echo "Sync complete!"
echo "Documentation has been synced from $SOURCE_REPO_ROOT to $TARGET_PATH"
echo "Remember to commit and push changes in the target repository."