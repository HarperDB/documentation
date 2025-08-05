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
    const currentBranch = gitExec('rev-parse --abbrev-ref HEAD');
    const hasChanges = gitExec('status --porcelain');
    
    if (hasChanges) {
        console.log('Stashing current changes...');
        gitExec('stash push -m "migrate-branches-to-versions temporary stash"');
    }
    
    return { currentBranch, hasChanges: !!hasChanges };
}

// Restore original state
function restoreState(state) {
    console.log(`Switching back to ${state.currentBranch}...`);
    gitExec(`checkout ${state.currentBranch}`);
    
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
function copyDirectory(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    
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
    if (fs.existsSync(DOCS_DIR)) {
        copyDirectory(DOCS_DIR, path.join(tempVersionDir, 'docs'));
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
        
        // Update and write docusaurus config after returning to original branch
        if (docusaurusConfig && fs.existsSync(DOCUSAURUS_CONFIG_PATH)) {
            const updatedConfig = updateDocusaurusConfig(docusaurusConfig);
            if (updatedConfig !== docusaurusConfig) {
                fs.writeFileSync(DOCUSAURUS_CONFIG_PATH, updatedConfig);
            }
        }
        
        // Move site/docs to replace root docs AFTER switching branches
        console.log('\nReplacing GitBook docs with converted Docusaurus docs...');
        const siteDocsPath = path.join(SITE_DIR, 'docs');
        const rootDocsPath = path.join(REPO_ROOT, 'docs');
        
        if (fs.existsSync(siteDocsPath)) {
            // Remove existing docs
            if (fs.existsSync(rootDocsPath)) {
                console.log(`  Removing existing GitBook docs at ${rootDocsPath}`);
                fs.rmSync(rootDocsPath, { recursive: true, force: true });
            }
            
            // Move site/docs to root docs
            console.log(`  Moving ${siteDocsPath} to ${rootDocsPath}`);
            fs.renameSync(siteDocsPath, rootDocsPath);
            console.log('  ✓ Docs replaced successfully');
        }
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