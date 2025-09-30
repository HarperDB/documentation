const path = require('node:path');
const fs = require('node:fs/promises');

// Copy /myPath.html to /myPath/index.html
// This ensures both URL patterns work: /myPath and /myPath/
async function generateIndexHtmlFiles(outDir) {
	console.log('Post-build: Creating index.html files from hoisted pages...');

	// Walk through all directories recursively
	async function* walkDirs(dir) {
		const dirents = await fs.readdir(dir, { withFileTypes: true });
		for (const dirent of dirents) {
			if (dirent.isDirectory()) {
				const res = path.resolve(dir, dirent.name);
				yield res;
				yield* walkDirs(res);
			}
		}
	}

	const processedFiles = [];

	for await (const dirPath of walkDirs(outDir)) {
		// Check if there's already an index.html in this directory
		const indexPath = path.join(dirPath, 'index.html');
		try {
			await fs.stat(indexPath);
			// index.html exists, skip this directory
			continue;
		} catch {
			// No index.html, continue checking
		}

		// Check if there's a sibling HTML file with the same name as the directory
		const dirName = path.basename(dirPath);
		const siblingHtmlPath = path.join(path.dirname(dirPath), `${dirName}.html`);

		try {
			await fs.stat(siblingHtmlPath);
			// Sibling HTML file exists, copy it as index.html
			await fs.copyFile(siblingHtmlPath, indexPath);
			processedFiles.push(`${dirName}.html → ${dirName}/index.html`);
		} catch {
			// No sibling HTML file, skip
		}
	}

	if (processedFiles.length > 0) {
		console.log(`Post-build: Created ${processedFiles.length} index.html files`);
		// Uncomment to see details:
		// processedFiles.forEach(f => console.log(`  - ${f}`));
	} else {
		console.log('Post-build: No index.html files needed');
	}
}

// Copy redirect index.html files to .html ONLY for old release notes paths
// This ensures redirects work with simple HTTP servers like `npm run serve`
// Example: docs/technical-details/release-notes/4.tucker/4.4.0/index.html
//       -> docs/technical-details/release-notes/4.tucker/4.4.0.html
async function generateReleaseNotesRedirectHtmlFiles(outDir) {
	console.log('Post-build: Creating .html redirect files for old release notes paths...');

	const redirectBase = path.join(outDir, 'docs', 'technical-details', 'release-notes');

	try {
		await fs.stat(redirectBase);
	} catch {
		console.log('Post-build: No release notes redirects found, skipping');
		return;
	}

	// Walk through all directories recursively
	async function* walkDirs(dir) {
		const dirents = await fs.readdir(dir, { withFileTypes: true });
		for (const dirent of dirents) {
			if (dirent.isDirectory()) {
				const res = path.resolve(dir, dirent.name);
				yield res;
				yield* walkDirs(res);
			}
		}
	}

	const processedFiles = [];

	for await (const dirPath of walkDirs(redirectBase)) {
		// Check if this directory has an index.html redirect file
		const indexPath = path.join(dirPath, 'index.html');
		try {
			const content = await fs.readFile(indexPath, 'utf8');
			// Check if it's a redirect file (contains meta refresh)
			if (content.includes('meta http-equiv="refresh"')) {
				// Create a sibling .html file with the same content
				const dirName = path.basename(dirPath);
				const siblingHtmlPath = path.join(path.dirname(dirPath), `${dirName}.html`);
				await fs.copyFile(indexPath, siblingHtmlPath);
				processedFiles.push(`${dirName}/index.html → ${dirName}.html`);
			}
		} catch {
			// No index.html or other error, skip
		}
	}

	if (processedFiles.length > 0) {
		console.log(`Post-build: Created ${processedFiles.length} .html redirect files`);
		// Uncomment to see details:
		// processedFiles.forEach(f => console.log(`  - ${f}`));
	} else {
		console.log('Post-build: No .html redirect files needed');
	}
}

// Run the post-processing
const buildDir = path.join(__dirname, '..', 'build');
generateIndexHtmlFiles(buildDir)
	.then(() => generateReleaseNotesRedirectHtmlFiles(buildDir))
	.catch(console.error);
