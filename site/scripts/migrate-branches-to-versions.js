#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Require conversion functions before switching branches
const { processDirectory: convertGitBookToDocusaurus } = require('./convert-gitbook-to-docusaurus');

// Configuration
const REPO_ROOT = path.join(__dirname, '../../');
const SITE_DIR = path.join(REPO_ROOT, 'site');
const DOCS_DIR = path.join(REPO_ROOT, 'docs');
const IMAGES_DIR = path.join(REPO_ROOT, 'images');
const VERSIONED_DOCS_DIR = path.join(SITE_DIR, 'versioned_docs');
const VERSIONED_SIDEBARS_DIR = path.join(SITE_DIR, 'versioned_sidebars');
const TEMP_DIR = path.join(REPO_ROOT, 'temp-migration');
const DOCUSAURUS_CONFIG_PATH = path.join(SITE_DIR, 'docusaurus.config.ts');
const VERSIONS_FILE = path.join(SITE_DIR, 'versions.json');

// Release branches to migrate (in version order, oldest to newest)
const RELEASE_BRANCHES = [
    'release_4.1',
    'release_4.2',
    'release_4.3',
    'release_4.4',
    'release_4.5',
    'release_4.6'
];

// Map branch names to version numbers
// Version-specific exclusions - paths that shouldn't be migrated
const VERSION_EXCLUSIONS = {
    // '4.1': [], // Version 4.1 needs custom-functions for its sidebar structure
    '4.2': ['custom-functions'], // Custom functions deprecated, use redirects instead
    '4.3': ['custom-functions'], // Not in SUMMARY.md, not part of actual docs
    '4.4': ['custom-functions'], // Custom functions deprecated, use redirects instead
    '4.5': ['getting-started.md', 'custom-functions'], // Root-level file not in SUMMARY.md for 4.5, custom functions deprecated
    '4.6': ['custom-functions'], // Custom functions deprecated, use redirects instead
    // Add more version-specific exclusions as needed
};

function branchToVersion(branch) {
    return branch.replace('release_', '');
}

// Execute git command and return output
function gitExec(command, options = {}) {
    try {
        return execSync(`git ${command}`, { 
            cwd: REPO_ROOT, 
            encoding: 'utf8',
            ...options 
        }).trim();
    } catch (error) {
        console.error(`Git command failed: git ${command}`);
        console.error(error.message);
        throw error;
    }
}

// Save current branch and changes
function saveCurrentState() {
    let currentBranch = gitExec('rev-parse --abbrev-ref HEAD');
    const currentCommit = gitExec('rev-parse HEAD');
    const hasChanges = gitExec('status --porcelain');
    
    // Check if we're in detached HEAD state (common in CI)
    if (currentBranch === 'HEAD') {
        console.log('Detected detached HEAD state (common in CI)');
        console.log(`Current commit: ${currentCommit}`);
        
        // Try to find which branch we're on by checking which branches contain this commit
        try {
            const branches = gitExec(`branch -r --contains ${currentCommit}`);
            console.log('Branches containing current commit:', branches);
            
            // In CI, we might want to use the commit hash directly
            currentBranch = currentCommit;
            console.log(`Will restore to commit: ${currentCommit}`);
        } catch (e) {
            console.log('Could not determine branch from commit');
        }
    } else {
        console.log(`Starting from branch: ${currentBranch}`);
    }
    
    console.log(`Current working directory: ${process.cwd()}`);
    
    if (hasChanges) {
        console.log('Stashing current changes...');
        gitExec('stash push -m "migrate-branches-to-versions temporary stash"');
    }
    
    return { 
        currentBranch, 
        currentCommit,
        isDetachedHead: currentBranch === currentCommit,
        hasChanges: !!hasChanges, 
        startingDir: process.cwd() 
    };
}

// Restore original state
function restoreState(state) {
    console.log(`\nRestoring original state...`);
    const currentLocation = gitExec('rev-parse --abbrev-ref HEAD');
    console.log(`Current location: ${currentLocation}`);
    console.log(`Current directory: ${process.cwd()}`);
    
    if (state.isDetachedHead) {
        // In CI with detached HEAD, checkout the specific commit
        console.log(`Restoring to commit: ${state.currentCommit}`);
        gitExec(`checkout ${state.currentCommit}`);
        
        // Verify we're at the right commit
        const actualCommit = gitExec('rev-parse HEAD');
        if (actualCommit !== state.currentCommit) {
            console.error(`Warning: Expected commit ${state.currentCommit} but at ${actualCommit}`);
        } else {
            console.log(`✓ Successfully restored to commit ${state.currentCommit}`);
        }
    } else {
        // Normal branch checkout
        console.log(`Switching back to branch: ${state.currentBranch}...`);
        gitExec(`checkout ${state.currentBranch}`);
        
        // Verify we're on the right branch
        const actualBranch = gitExec('rev-parse --abbrev-ref HEAD');
        if (actualBranch !== state.currentBranch) {
            console.error(`Warning: Expected to be on ${state.currentBranch} but actually on ${actualBranch}`);
        } else {
            console.log(`✓ Successfully restored to branch ${state.currentBranch}`);
        }
    }
    
    if (state.hasChanges) {
        console.log('Restoring stashed changes...');
        try {
            gitExec('stash pop');
        } catch (error) {
            // Check if it's just "No stash entries found"
            if (!error.message.includes('No stash entries found')) {
                throw error;
            }
            console.log('Note: No stash entries found (this is fine if changes were already restored)');
        }
    }
}

// Copy directory recursively
function copyDirectory(src, dest, excludePaths = []) {
    fs.mkdirSync(dest, { recursive: true });
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        // Check if this path should be excluded
        const shouldExclude = excludePaths.some(excludePath => {
            const fullExcludePath = path.resolve(src, excludePath);
            return srcPath === fullExcludePath || srcPath.startsWith(fullExcludePath + path.sep);
        });
        
        if (shouldExclude) {
            console.log(`  Skipping excluded path: ${srcPath}`);
            continue;
        }
        
        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath, excludePaths);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Process a single release branch
function processBranch(branch, isLatest = false) {
    const version = branchToVersion(branch);
    console.log(`\n=== Processing ${branch} (version ${version}) ===`);
    
    // Checkout the branch
    console.log(`Checking out ${branch}...`);
    gitExec(`checkout ${branch}`);
    
    // Create temporary directory for this version
    const tempVersionDir = path.join(TEMP_DIR, version);
    fs.rmSync(tempVersionDir, { recursive: true, force: true });
    fs.mkdirSync(tempVersionDir, { recursive: true });
    
    // Copy docs and images to temp directory
    console.log('Copying docs and images...');
    
    // Get version-specific exclusions
    const excludePaths = VERSION_EXCLUSIONS[version] || [];
    if (excludePaths.length > 0) {
        console.log(`  Excluding paths for version ${version}: ${excludePaths.join(', ')}`);
    }
    
    if (fs.existsSync(DOCS_DIR)) {
        copyDirectory(DOCS_DIR, path.join(tempVersionDir, 'docs'), excludePaths);
    }
    if (fs.existsSync(IMAGES_DIR)) {
        copyDirectory(IMAGES_DIR, path.join(tempVersionDir, 'images'));
    }
    
    // Convert GitBook to Docusaurus format
    console.log('Converting GitBook to Docusaurus format...');
    const docsPath = path.join(tempVersionDir, 'docs');
    const outputPath = path.join(tempVersionDir, 'converted-docs');
    
    // Set IMAGES_PATH environment variable for the conversion
    const originalImagesPath = process.env.IMAGES_PATH;
    process.env.IMAGES_PATH = path.join(tempVersionDir, 'images');
    
    // Convert using the imported function with version info
    convertGitBookToDocusaurus(docsPath, outputPath, docsPath, outputPath, { version });
    
    // Restore original IMAGES_PATH
    if (originalImagesPath) {
        process.env.IMAGES_PATH = originalImagesPath;
    } else {
        delete process.env.IMAGES_PATH;
    }
    
    // Fix version-specific broken links
    if (version !== '4.1') {
        // Fix the link to custom-functions/define-helpers in define-routes.md
        const defineRoutesPath = path.join(outputPath, 'developers', 'applications', 'define-routes.md');
        if (fs.existsSync(defineRoutesPath)) {
            console.log(`Fixing broken link in define-routes.md for version ${version}...`);
            let content = fs.readFileSync(defineRoutesPath, 'utf8');
            content = content.replace(
                '[Define Helpers](../../custom-functions/define-helpers)',
                '[Helper Methods](#helper-methods)'
            );
            fs.writeFileSync(defineRoutesPath, content);
        }
    }
    
    // Always create versioned docs
    const versionedPath = path.join(VERSIONED_DOCS_DIR, `version-${version}`);
    console.log(`Creating versioned docs at ${versionedPath}...`);
    fs.rmSync(versionedPath, { recursive: true, force: true });
    copyDirectory(outputPath, versionedPath);
    
    // Generate sidebar for this version
    generateVersionedSidebar(version, versionedPath);
    
    // If this is the latest version, ALSO copy to main docs directory
    if (isLatest) {
        console.log('Also copying latest version to main docs directory...');
        const mainDocsPath = path.join(SITE_DIR, 'docs');
        fs.rmSync(mainDocsPath, { recursive: true, force: true });
        copyDirectory(outputPath, mainDocsPath);
    }
    
    // Copy images to static directory with version prefix
    const versionedImagesPath = path.join(SITE_DIR, 'static', 'img', `v${version}`);
    if (fs.existsSync(path.join(tempVersionDir, 'images'))) {
        console.log(`Copying images to ${versionedImagesPath}...`);
        fs.rmSync(versionedImagesPath, { recursive: true, force: true });
        copyDirectory(path.join(tempVersionDir, 'images'), versionedImagesPath);
    }
    
    return version;
}

// Helper to generate release notes sidebar in reverse order
function generateReleaseNotesSidebar(docsPath) {
    const releaseNotesPath = path.join(docsPath, 'release-notes');
    if (!fs.existsSync(releaseNotesPath)) {
        return {
            type: 'category',
            label: 'Release Notes',
            items: [{type: 'autogenerated', dirName: 'release-notes'}],
        };
    }
    
    // Read release notes structure
    const items = [];
    
    // Add index if exists
    if (fs.existsSync(path.join(releaseNotesPath, 'index.md'))) {
        items.push('release-notes/index');
    }
    
    // Get all subdirectories (e.g., 4.tucker, 3.monkey, etc.)
    const dirs = fs.readdirSync(releaseNotesPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .sort((a, b) => {
            // Extract numbers for sorting
            const aNum = parseInt(a.split('.')[0]) || 0;
            const bNum = parseInt(b.split('.')[0]) || 0;
            return bNum - aNum; // Reverse order (newest first: 4, 3, 2, 1)
        });
    
    // Process each directory
    dirs.forEach(dir => {
        // Add category for this version series
        // Since dirs are already sorted correctly (newest first),
        // they will appear in the correct order in the sidebar
        const parts = dir.split('.');
        const versionNum = parts[0];
        const versionName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
        
        items.push({
            type: 'category',
            label: `HarperDB ${versionName} (Version ${versionNum})`,
            items: [{
                type: 'autogenerated',
                dirName: `release-notes/${dir}`
            }]
        });
    });
    
    return {
        type: 'category',
        label: 'Release Notes',
        items: items,
    };
}

// Generate sidebar configuration for a version
function generateVersionedSidebar(version, docsPath) {
    console.log(`Generating sidebar for version ${version}...`);
    
    let sidebarConfig;
    
    // Version 4.1 has a different structure
    if (version === '4.1') {
        sidebarConfig = {
            docsSidebar: [
                {
                    type: 'doc',
                    id: 'index',
                    label: 'Developer Documentation',
                },
                {
                    type: 'category',
                    label: 'Install HarperDB',
                    items: [{type: 'autogenerated', dirName: 'install-harperdb'}],
                },
                {
                    type: 'category',
                    label: 'Getting Started',
                    items: [{type: 'autogenerated', dirName: 'getting-started'}],
                },
                {
                    type: 'link',
                    label: 'Full API Documentation',
                    href: 'https://api.harperdb.io/',
                },
                {
                    type: 'category',
                    label: 'HarperDB Studio',
                    items: [{type: 'autogenerated', dirName: 'harperdb-studio'}],
                },
                {
                    type: 'category',
                    label: 'HarperDB Cloud',
                    items: [{type: 'autogenerated', dirName: 'harperdb-cloud'}],
                },
                {
                    type: 'category',
                    label: 'Security',
                    items: [{type: 'autogenerated', dirName: 'security'}],
                },
                {
                    type: 'category',
                    label: 'Clustering',
                    items: [{type: 'autogenerated', dirName: 'clustering'}],
                },
                {
                    type: 'category',
                    label: 'Custom Functions',
                    items: [{type: 'autogenerated', dirName: 'custom-functions'}],
                },
                {
                    type: 'category',
                    label: 'Add-ons and SDKs',
                    items: [{type: 'autogenerated', dirName: 'add-ons-and-sdks'}],
                },
                {
                    type: 'category',
                    label: 'SQL Guide',
                    items: [{type: 'autogenerated', dirName: 'sql-guide'}],
                },
                'harperdb-cli',
                'configuration',
                'logging',
                'transaction-logging',
                'audit-logging',
                'jobs',
                'upgrade-hdb-instance',
                {
                    type: 'category',
                    label: 'Reference',
                    items: [{type: 'autogenerated', dirName: 'reference'}],
                },
                'support',
                generateReleaseNotesSidebar(docsPath),
            ]
        };
    } else if (version === '4.4' || version === '4.3' || version === '4.2') {
        // Versions 4.2-4.4 have getting-started.md instead of directory
        sidebarConfig = {
            docsSidebar: [
                {
                    type: 'doc',
                    id: 'index',
                    label: 'Harper Docs',
                },
                'getting-started',
                {
                    type: 'category',
                    label: 'Developers',
                    items: [{type: 'autogenerated', dirName: 'developers'}],
                },
                {
                    type: 'category',
                    label: 'Administration',
                    items: [{type: 'autogenerated', dirName: 'administration'}],
                },
                {
                    type: 'category',
                    label: 'Deployments',
                    items: [{type: 'autogenerated', dirName: 'deployments'}],
                },
                {
                    type: 'category',
                    label: 'Technical Details',
                    items: [{type: 'autogenerated', dirName: 'technical-details'}],
                },
            ]
        };
    } else {
        // Version 4.5+ use the modern structure with getting-started directory
        sidebarConfig = {
            docsSidebar: [
                {
                    type: 'doc',
                    id: 'index',
                    label: 'Harper Docs',
                },
                {
                    type: 'category',
                    label: 'Getting Started',
                    items: [{type: 'autogenerated', dirName: 'getting-started'}],
                },
                {
                    type: 'category',
                    label: 'Developers',
                    items: [{type: 'autogenerated', dirName: 'developers'}],
                },
                {
                    type: 'category',
                    label: 'Administration',
                    items: [{type: 'autogenerated', dirName: 'administration'}],
                },
                {
                    type: 'category',
                    label: 'Deployments',
                    items: [{type: 'autogenerated', dirName: 'deployments'}],
                },
                {
                    type: 'category',
                    label: 'Technical Details',
                    items: [{type: 'autogenerated', dirName: 'technical-details'}],
                },
            ]
        };
    }
    
    const sidebarFile = path.join(VERSIONED_SIDEBARS_DIR, `version-${version}-sidebars.json`);
    fs.mkdirSync(VERSIONED_SIDEBARS_DIR, { recursive: true });
    fs.writeFileSync(sidebarFile, JSON.stringify(sidebarConfig, null, 2));
}

// Generate versions.json file
function generateVersionsJson(versions) {
    console.log('\nGenerating versions.json...');
    
    // Versions should be listed from newest to oldest
    const sortedVersions = versions.sort((a, b) => {
        const [aMajor, aMinor, aPatch = 0] = a.split('.').map(Number);
        const [bMajor, bMinor, bPatch = 0] = b.split('.').map(Number);
        
        if (bMajor !== aMajor) return bMajor - aMajor;
        if (bMinor !== aMinor) return bMinor - aMinor;
        return bPatch - aPatch;
    });
    
    fs.writeFileSync(VERSIONS_FILE, JSON.stringify(sortedVersions, null, 2));
    
    console.log('Created versions.json with versions:', sortedVersions);
}

// Update docusaurus.config.ts for versioning
function updateDocusaurusConfig(configContent) {
    console.log('\nUpdating docusaurus.config.ts for versioning...');
    
    // Check if versioning is already configured
    if (!configContent.includes('onlyIncludeVersions')) {
        // Add versioning configuration to docs preset
        const docsConfigRegex = /(docs:\s*{[^}]*)(}\s*,)/s;
        
        const versioningConfig = `
					includeCurrentVersion: true,
					// Uncomment to limit which versions are deployed
					// onlyIncludeVersions: ['4.6', '4.5'],`;
        
        configContent = configContent.replace(docsConfigRegex, (match, docsStart, docsEnd) => {
            // Insert before the closing brace
            return docsStart + versioningConfig + '\n' + docsEnd;
        });
        
        console.log('Updated docusaurus.config.ts with versioning configuration');
    }
    
    
    return configContent;
}

// Main migration function
async function migrate() {
    console.log('Starting migration of release branches to Docusaurus versions...');
    console.log('This script will:');
    console.log('1. Checkout each release branch');
    console.log('2. Copy and convert docs to Docusaurus format');
    console.log('3. Create versioned documentation structure');
    console.log('4. Generate versions.json and sidebar files');
    console.log('\nPress Ctrl+C to cancel, or wait 5 seconds to continue...\n');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Save current state
    const originalState = saveCurrentState();
    
    // Read docusaurus config before switching branches
    let docusaurusConfig = null;
    if (fs.existsSync(DOCUSAURUS_CONFIG_PATH)) {
        docusaurusConfig = fs.readFileSync(DOCUSAURUS_CONFIG_PATH, 'utf8');
    }
    
    try {
        // Create directories (these will persist across branch switches)
        fs.mkdirSync(VERSIONED_DOCS_DIR, { recursive: true });
        fs.mkdirSync(VERSIONED_SIDEBARS_DIR, { recursive: true });
        fs.mkdirSync(TEMP_DIR, { recursive: true });
        
        // Process each branch
        const versions = [];
        for (let i = 0; i < RELEASE_BRANCHES.length; i++) {
            const branch = RELEASE_BRANCHES[i];
            const isLatest = i === RELEASE_BRANCHES.length - 1;
            
            try {
                const version = processBranch(branch, isLatest);
                versions.push(version); // Add all versions, including the latest
            } catch (error) {
                console.error(`Failed to process ${branch}:`, error.message);
                // Continue with other branches
            }
        }
        
        // Generate versions.json
        generateVersionsJson(versions);
        
        // Clean up temp directory
        console.log('\nCleaning up temporary files...');
        fs.rmSync(TEMP_DIR, { recursive: true, force: true });
        
        console.log('\n✅ Version migration completed successfully!');
        console.log('\nNext steps:');
        console.log('1. Review the generated files in:');
        console.log(`   - ${VERSIONED_DOCS_DIR}`);
        console.log(`   - ${VERSIONED_SIDEBARS_DIR}`);
        console.log(`   - ${VERSIONS_FILE}`);
        console.log('2. Docs replacement will happen after branch switch');
        console.log('3. Test the site with: npm run start');
        console.log('4. Adjust sidebar configurations as needed');
        console.log('5. Update image references if necessary');
        
    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        throw error;
    } finally {
        // Restore original state
        restoreState(originalState);
        
        // After switching back, ensure the site directory exists
        // In CI, switching branches might have removed it
        console.log(`\nChecking if site directory exists at: ${SITE_DIR}`);
        if (!fs.existsSync(SITE_DIR)) {
            console.error('\n⚠️  Warning: Site directory was removed during branch switching.');
            console.error(`Expected site directory at: ${SITE_DIR}`);
            console.error('This can happen in CI when switching to older branches.');
            console.error('The site directory should be restored by Git, but it may not be immediate.');
            
            // Try to force Git to restore the directory
            console.log('Attempting to restore site directory from Git...');
            try {
                gitExec('checkout HEAD -- site');
                console.log('✓ Restored site directory from Git');
                
                // Verify it was restored
                if (fs.existsSync(SITE_DIR)) {
                    console.log('✓ Site directory now exists');
                } else {
                    console.error('✗ Site directory still missing after restore attempt');
                }
            } catch (e) {
                console.error('Could not restore site directory:', e.message);
                console.error('Git may not have the site directory in the current branch');
            }
        } else {
            console.log('✓ Site directory exists');
        }
        
        // Update and write docusaurus config after returning to original branch
        if (docusaurusConfig && fs.existsSync(DOCUSAURUS_CONFIG_PATH)) {
            const updatedConfig = updateDocusaurusConfig(docusaurusConfig);
            if (updatedConfig !== docusaurusConfig) {
                fs.writeFileSync(DOCUSAURUS_CONFIG_PATH, updatedConfig);
            }
        }
        
        // Keep docs in site directory - don't overwrite root docs
        console.log('\nDocs have been migrated to site directory.');
        console.log('  Current docs: site/docs');
        console.log('  Versioned docs: site/versioned_docs');
    }
}

// Run migration if called directly
if (require.main === module) {
    migrate().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { migrate };