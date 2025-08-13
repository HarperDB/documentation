#!/usr/bin/env node

/**
 * Script to cut a new version from the latest versioned docs
 * Since we no longer have a /docs directory, we copy from the latest version
 *
 * Usage: npm run version [version]
 * Example: npm run version 4.8
 * 
 * If no version is provided, it will auto-increment the latest version
 */

const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.dirname(__dirname);
const VERSIONED_DOCS = path.join(REPO_ROOT, 'versioned_docs');
const VERSIONED_SIDEBARS = path.join(REPO_ROOT, 'versioned_sidebars');
const VERSIONS_FILE = path.join(REPO_ROOT, 'versions.json');

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

function getLatestVersion() {
	const versions = JSON.parse(fs.readFileSync(VERSIONS_FILE, 'utf8'));
	return versions[0]; // First version is the latest
}

function incrementVersion(version) {
	const [major, minor] = version.split('.').map(Number);
	return `${major}.${minor + 1}`;
}

function updateImagePaths(dir, oldVersion, newVersion) {
	// Recursively find all .md files and update image paths
	const files = fs.readdirSync(dir, { withFileTypes: true });
	
	for (const file of files) {
		const filePath = path.join(dir, file.name);
		
		if (file.isDirectory()) {
			updateImagePaths(filePath, oldVersion, newVersion);
		} else if (file.name.endsWith('.md')) {
			let content = fs.readFileSync(filePath, 'utf8');
			const oldPath = `/img/v${oldVersion}/`;
			const newPath = `/img/v${newVersion}/`;
			
			if (content.includes(oldPath)) {
				content = content.replace(new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPath);
				fs.writeFileSync(filePath, content, 'utf8');
				console.log(`   Updated: ${path.relative(REPO_ROOT, filePath)}`);
			}
		}
	}
}

function main() {
	let newVersion = process.argv[2];
	const latestVersion = getLatestVersion();

	// If no version provided, auto-increment
	if (!newVersion) {
		newVersion = incrementVersion(latestVersion);
		console.log(`No version specified, auto-incrementing from ${latestVersion} to ${newVersion}`);
	}

	// Validate version format
	if (!/^\d+\.\d+$/.test(newVersion)) {
		console.error(`Error: Invalid version format "${newVersion}". Expected format: X.Y (e.g., 4.8)`);
		process.exit(1);
	}

	console.log(`\nCutting version ${newVersion} from version ${latestVersion}...`);

	const sourceDocsDir = path.join(VERSIONED_DOCS, `version-${latestVersion}`);
	const targetDocsDir = path.join(VERSIONED_DOCS, `version-${newVersion}`);
	const sourceSidebarFile = path.join(VERSIONED_SIDEBARS, `version-${latestVersion}-sidebars.json`);
	const targetSidebarFile = path.join(VERSIONED_SIDEBARS, `version-${newVersion}-sidebars.json`);

	// Check if source exists
	if (!fs.existsSync(sourceDocsDir)) {
		console.error(`Error: Source docs not found at ${sourceDocsDir}`);
		process.exit(1);
	}

	// Check if target already exists
	if (fs.existsSync(targetDocsDir)) {
		console.error(`Error: Version ${newVersion} already exists at ${targetDocsDir}`);
		process.exit(1);
	}

	try {
		// Copy docs
		console.log(`Copying docs from version-${latestVersion} to version-${newVersion}...`);
		copyDirectory(sourceDocsDir, targetDocsDir);

		// Update image paths in the new version
		console.log(`Updating image paths from /img/v${latestVersion}/ to /img/v${newVersion}/...`);
		updateImagePaths(targetDocsDir, latestVersion, newVersion);

		// Copy images for the new version
		const staticImgSource = path.join(REPO_ROOT, 'static', 'img', `v${latestVersion}`);
		const staticImgTarget = path.join(REPO_ROOT, 'static', 'img', `v${newVersion}`);
		if (fs.existsSync(staticImgSource)) {
			console.log(`Copying images from static/img/v${latestVersion} to static/img/v${newVersion}...`);
			copyDirectory(staticImgSource, staticImgTarget);
		}

		// Copy sidebar
		console.log(`Copying sidebar configuration...`);
		fs.copyFileSync(sourceSidebarFile, targetSidebarFile);

		// Update versions.json
		console.log('Updating versions.json...');
		const versions = JSON.parse(fs.readFileSync(VERSIONS_FILE, 'utf8'));
		versions.unshift(newVersion); // Add new version at the beginning
		fs.writeFileSync(VERSIONS_FILE, JSON.stringify(versions, null, 0) + '\n');

		console.log(`\n✅ Successfully created version ${newVersion}`);
		console.log(`   - Versioned docs created at: versioned_docs/version-${newVersion}/`);
		console.log(`   - Sidebar created at: versioned_sidebars/version-${newVersion}-sidebars.json`);
		console.log(`   - Version added to versions.json`);

		console.log('\n🎉 Version creation complete!');
		console.log('\nNext steps:');
		console.log(`1. Update docusaurus.config.ts to set lastVersion to '${newVersion}'`);
		console.log(`2. Update the version config in docusaurus.config.ts for the new version`);
		console.log(`3. If this is a release, update onlyIncludeVersions in production to include '${latestVersion}'`);
		console.log('4. Create a PR with the changes');
		console.log(`\nNote: Version ${newVersion} is now the latest development version`);
	} catch (error) {
		console.error('\n❌ Error creating version:', error.message || error);
		process.exit(1);
	}
}

main();