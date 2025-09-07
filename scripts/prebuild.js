#!/usr/bin/env node

/**
 * Pre-build script for Docusaurus
 * Handles dynamic configuration based on environment variables
 *
 * Usage:
 *   node prebuild.js        - Setup for build/start
 *   node prebuild.js clean  - Clean generated files
 */

const fs = require('node:fs');
const path = require('node:path');

// Check if running in clean mode
const isCleanMode = process.argv[2] === 'clean';

// Get the route base path from environment variable
const routeBasePath = process.env.DOCUSAURUS_ROUTE_BASE_PATH || '/';

const indexPagePath = path.join(__dirname, '../src/pages/index.tsx');
const pagesDir = path.join(__dirname, '../src/pages');

// Helper function to remove the index page
function removeIndexPage() {
	if (fs.existsSync(indexPagePath)) {
		fs.unlinkSync(indexPagePath);
		console.log('Removed index.tsx');
		return true;
	}
	return false;
}

if (isCleanMode) {
	// Clean mode - remove all generated files
	console.log('Cleaning generated files...');
	removeIndexPage();
	process.exit(0);
}

console.log('Running pre-build setup...');
console.log(`Route base path: ${routeBasePath}`);

// Setup index redirect page based on route configuration
if (routeBasePath === '/') {
	// If docs are at root, remove the index redirect page
	console.log('Docs are at root (/), removing index redirect page, if it exists...');
	removeIndexPage();
} else {
	// If docs are not at root, ensure the index redirect page exists
	console.log(`Docs are at ${routeBasePath}, creating index redirect page...`);

	// Create pages directory if it doesn't exist
	if (!fs.existsSync(pagesDir)) {
		fs.mkdirSync(pagesDir, { recursive: true });
	}

	// Create the redirect page
	const redirectContent = `import React from 'react';
import { Redirect } from '@docusaurus/router';

export default function Home(): JSX.Element {
  // Redirect to the docs location
  return <Redirect to="${routeBasePath}" />;
}
`;

	fs.writeFileSync(indexPagePath, redirectContent);
	console.log(`Created index redirect to ${routeBasePath}`);
}

// Generate release notes data
console.log('Generating release notes data...');
require('./generateReleaseNotesData')();
