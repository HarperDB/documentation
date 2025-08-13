#!/usr/bin/env node

/**
 * Script to cut a new version from the repository's /docs directory
 * This is used for creating new versions (4.7+) after the GitBook migration
 *
 * Usage: npm run version <version>
 * Example: npm run version 4.7
 */

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const SCRIPT_DIR = __dirname;
const SITE_DIR = path.dirname(SCRIPT_DIR);
const REPO_ROOT = path.dirname(SITE_DIR);
const REPO_DOCS = path.join(REPO_ROOT, 'docs');
const SITE_DOCS = path.join(SITE_DIR, 'docs');

function copyDirectory(src, dest) {
	// Create destination directory
	fs.mkdirSync(dest, { recursive: true });

	// Read all items in source directory
	const items = fs.readdirSync(src, { withFileTypes: true });

	for (const item of items) {
		const srcPath = path.join(src, item.name);
		const destPath = path.join(dest, item.name);

		if (item.isDirectory()) {
			// Recursively copy subdirectories
			copyDirectory(srcPath, destPath);
		} else {
			// Copy file
			fs.copyFileSync(srcPath, destPath);
		}
	}
}

function removeDirectory(dir) {
	if (fs.existsSync(dir)) {
		fs.rmSync(dir, { recursive: true, force: true });
	}
}

function main() {
	const version = process.argv[2];

	if (!version) {
		console.error('Usage: npm run version <version>');
		console.error('Example: npm run version 4.7');
		process.exit(1);
	}

	// Validate version format
	if (!/^\d+\.\d+$/.test(version)) {
		console.error(`Error: Invalid version format "${version}". Expected format: X.Y (e.g., 4.7)`);
		process.exit(1);
	}

	console.log(`\nCutting version ${version} from repository docs...`);

	// Check if repo docs exist
	if (!fs.existsSync(REPO_DOCS)) {
		console.error(`Error: Repository docs not found at ${REPO_DOCS}`);
		console.error('After migration, the repository /docs directory should contain vNext documentation.');
		process.exit(1);
	}

	// Remove existing site/docs if it exists (it's just a build-time copy)
	if (fs.existsSync(SITE_DOCS)) {
		console.log('Removing existing site/docs (build-time copy)...');
		removeDirectory(SITE_DOCS);
	}

	try {
		// Copy repo docs to site docs
		console.log('Copying repository docs to site/docs...');
		copyDirectory(REPO_DOCS, SITE_DOCS);

		// Run Docusaurus version command
		console.log(`\nRunning Docusaurus version command for ${version}...`);
		execSync(`npm run docusaurus docs:version ${version}`, {
			cwd: SITE_DIR,
			stdio: 'inherit',
		});

		console.log(`\n✅ Successfully created version ${version}`);
		console.log(`   - Versioned docs created at: versioned_docs/version-${version}/`);
		console.log(`   - Version added to versions.json`);

		// Clean up - remove the temporary site/docs (it's in .gitignore anyway)
		console.log('\nCleaning up temporary site/docs...');
		removeDirectory(SITE_DOCS);

		console.log('\n🎉 Version creation complete!');
		console.log('\nNext steps:');
		console.log('1. Create a PR with the new versioned docs and updated versions.json');
		console.log('2. Site will deploy automatically when PR is merged');
		console.log(`\nNote: Version ${version} is now the latest and will be synced to site/docs during build`);
	} catch (error) {
		console.error('\n❌ Error creating version:', error.message || error);

		// Clean up on error
		if (fs.existsSync(SITE_DOCS)) {
			console.log('Cleaning up temporary site/docs...');
			removeDirectory(SITE_DOCS);
		}

		process.exit(1);
	}
}

main();
