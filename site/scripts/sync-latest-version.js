#!/usr/bin/env node

/**
 * Sync the latest version to site/docs for 'current' documentation
 * This ensures '/' and '/<latest version>/' both work with the same content
 */

const fs = require('node:fs');
const path = require('node:path');

const SITE_DIR = path.join(__dirname, '..');
const VERSIONED_DOCS_DIR = path.join(SITE_DIR, 'versioned_docs');
const DOCS_DIR = path.join(SITE_DIR, 'docs');
const VERSIONS_FILE = path.join(SITE_DIR, 'versions.json');

// Copy directory recursively
// Why JavaScript instead of a shell command like `cp -r`?
// 1. Cross-platform compatibility (Windows doesn't have cp)
// 2. Better error handling and reporting
// 3. Consistent with other build scripts in the project
// While we could shell out to cp/robocopy based on platform,
// keeping it in JS makes the build process more predictable
function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function main() {
    // Read versions.json to get the latest version
    // Note: versions.json is a required Docusaurus file that defines:
    // - Which versions exist and their order
    // - Which version appears in the version dropdown
    // - The ordering for version navigation
    // We use it here as the source of truth since Docusaurus requires it anyway
    
    if (!fs.existsSync(VERSIONS_FILE)) {
        console.error(`Error: versions.json not found at ${VERSIONS_FILE}`);
        console.error('Run the migration script first to create versioned docs.');
        process.exit(1);
    }
    
    const versions = JSON.parse(fs.readFileSync(VERSIONS_FILE, 'utf8'));
    const latestVersion = versions[0]; // First version in the array is the latest
    
    if (!latestVersion) {
        console.error('Error: No versions found in versions.json');
        process.exit(1);
    }
    
    const versionedDocsPath = path.join(VERSIONED_DOCS_DIR, `version-${latestVersion}`);
    
    if (!fs.existsSync(versionedDocsPath)) {
        console.error(`Error: Version ${latestVersion} docs not found at ${versionedDocsPath}`);
        console.error('Run the migration script first to create versioned docs.');
        process.exit(1);
    }
    
    console.log(`Syncing version ${latestVersion} to site/docs for 'current'...`);
    
    // Remove existing docs directory
    if (fs.existsSync(DOCS_DIR)) {
        fs.rmSync(DOCS_DIR, { recursive: true, force: true });
    }
    
    // Copy versioned docs to site/docs
    copyDirectory(versionedDocsPath, DOCS_DIR);
    
    console.log(`✓ Version ${latestVersion} synced to site/docs`);
    console.log(`  - Available at / as 'current'`);
    console.log(`  - Also available at /${latestVersion}/ for version-specific permalinking`);
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { main };