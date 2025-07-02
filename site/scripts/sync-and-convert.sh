#!/bin/bash
# Sync and convert documentation from GitBook format to Docusaurus format

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# The documentation repo root is two levels up from site/scripts
DOC_REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SOURCE_DOCS_DIR="$DOC_REPO_ROOT/docs"

# Default values
BRANCH="main"
SAMPLE_MODE=false
DRY_RUN=false
TARGET_PATH=""

# Function to display usage
usage() {
    echo "Usage: $0 [OPTIONS] <target-repo-path>"
    echo ""
    echo "Options can appear before or after the target path:"
    echo "  -b branch    Branch to sync (default: main)"
    echo "  -s          Sample mode - convert subset of files, no branch changes"
    echo "  -d          Dry run - show what would be done without making changes"
    echo "  -h          Show this help message"
    echo ""
    echo "Examples:"
    echo "  # Normal sync from harperdb repo"
    echo "  bash ../documentation/site/scripts/sync-and-convert.sh ."
    echo ""
    echo "  # Sync specific branch (options before path)"
    echo "  bash ../documentation/site/scripts/sync-and-convert.sh -b release_4.5 ."
    echo ""
    echo "  # Sync specific branch (options after path)"
    echo "  bash ../documentation/site/scripts/sync-and-convert.sh . -b release_4.5"
    echo ""
    echo "  # Sample mode with dry run"
    echo "  bash ../documentation/site/scripts/sync-and-convert.sh -s -d ."
    exit 1
}

# Parse all arguments manually to allow options anywhere
while [[ $# -gt 0 ]]; do
    case $1 in
        -b|--branch)
            BRANCH="$2"
            shift 2
            ;;
        -s|--sample)
            SAMPLE_MODE=true
            shift
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -h|--help)
            usage
            ;;
        -*)
            echo "Invalid option: $1" >&2
            usage
            ;;
        *)
            # This is the target path
            if [ -z "$TARGET_PATH" ]; then
                TARGET_PATH="$1"
            else
                echo "Error: Multiple target paths specified: '$TARGET_PATH' and '$1'" >&2
                usage
            fi
            shift
            ;;
    esac
done

# Validate required arguments
if [ -z "$TARGET_PATH" ]; then
    echo "Error: Target repository path is required"
    usage
fi

# Convert to absolute path
TARGET_PATH="$(cd "$TARGET_PATH" && pwd)"

echo "Syncing and converting documentation:"
echo "  From: $SOURCE_DOCS_DIR"
echo "  To: $TARGET_PATH/docs"
echo "  Branch: $BRANCH"
[ "$SAMPLE_MODE" = true ] && echo "  Mode: SAMPLE MODE - Limited files, no branch changes"
[ "$DRY_RUN" = true ] && echo "  Mode: DRY RUN - No files will be modified"

# Skip branch changes in sample mode
if [ "$SAMPLE_MODE" = false ]; then
    # Ensure both repos are on correct branch and have latest changes
    for REPO_PATH in "$DOC_REPO_ROOT" "$TARGET_PATH"; do
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
else
    echo ""
    echo "Sample mode: Skipping branch changes"
fi

# Create target docs directory if needed (only if not in dry run)
if [ "$DRY_RUN" = false ]; then
    mkdir -p "$TARGET_PATH/docs"
fi

# Create temporary directory for conversion
TEMP_DIR=$(mktemp -d)
echo ""
echo "Converting documentation in temporary directory: $TEMP_DIR"

# Copy docs to temp directory for conversion (no dry-run here, temp gets cleaned up)
if [ "$SAMPLE_MODE" = true ]; then
    echo "Sample mode: Selecting files with various GitBook features..."
    
    # Sample files that demonstrate different GitBook features
    SAMPLE_FILES=(
        "README.md"                                    # Root documentation home - will be converted to index.md
        "index.md"                                     # Root index 'intentionally left blank' file for gitbook - should be overwritten by README.md
        "getting-started/README.md"                    # README → index.md conversion
        "getting-started/install-harper.md"            # Likely has hints/warnings
        "developers/operations-api/README.md"          # Another README example
        "developers/rest.md"                           # API examples, code blocks
        "developers/operations-api/quickstart-examples.md"  # Code tabs, examples
        "developers/security/configuration.md"         # Configuration, warnings
        "administration/administration.md"             # Ordered lists, procedures
        "administration/logging/logging.md"            # Images, diagrams
    )
    
    # Copy sample files to temp (always copy, even in dry-run)
    FILE_COUNT=0
    for file in "${SAMPLE_FILES[@]}"; do
        if [ -f "$SOURCE_DOCS_DIR/$file" ]; then
            dir=$(dirname "$file")
            mkdir -p "$TEMP_DIR/$dir"
            rsync -av "$SOURCE_DOCS_DIR/$file" "$TEMP_DIR/$file"
            ((FILE_COUNT++))
        fi
    done
    echo "Copied $FILE_COUNT sample files to temp directory"
else
    # Copy all docs
    rsync -av "$SOURCE_DOCS_DIR/" "$TEMP_DIR/"
fi

# Run conversion script
echo ""
echo "Converting GitBook syntax to Docusaurus..."
if [ "$DRY_RUN" = true ]; then
    echo "Dry run: Would run conversion on files in $TEMP_DIR"
else
    node "$SCRIPT_DIR/convert-gitbook-to-docusaurus.js" "$TEMP_DIR"
fi

# Copy converted docs to target
echo ""
echo "Copying converted documentation to $TARGET_PATH/docs/..."
FINAL_RSYNC_FLAGS="-av --delete"
[ "$DRY_RUN" = true ] && FINAL_RSYNC_FLAGS="$FINAL_RSYNC_FLAGS --dry-run"
rsync $FINAL_RSYNC_FLAGS "$TEMP_DIR/" "$TARGET_PATH/docs/"

# Copy images if they exist
if [ -d "$DOC_REPO_ROOT/images" ]; then
    echo "Copying images to docs/images..."
    IMAGE_RSYNC_FLAGS="-av"
    [ "$DRY_RUN" = true ] && IMAGE_RSYNC_FLAGS="$IMAGE_RSYNC_FLAGS --dry-run"
    rsync $IMAGE_RSYNC_FLAGS "$DOC_REPO_ROOT/images/" "$TARGET_PATH/docs/images/"
fi

# Clean up temp directory
rm -rf "$TEMP_DIR" 2>/dev/null || true

echo ""
echo "Sync and conversion complete!"
echo "Documentation has been converted and synced to $TARGET_PATH"
echo "Remember to review the changes and commit them in the target repository."