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

// Run the post-processing
const buildDir = path.join(__dirname, '..', 'build');
generateIndexHtmlFiles(buildDir).catch(console.error);
