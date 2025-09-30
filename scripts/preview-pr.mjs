#!/usr/bin/env node

/**
 * Preview a PR's build artifact locally
 * Usage: node scripts/preview-pr.mjs <PR_NUMBER>
 *
 * SECURITY WARNING:
 * This script downloads and serves built artifacts from GitHub Actions.
 * Only use this with PRs from trusted contributors, as the built files
 * may contain arbitrary JavaScript that will execute in your browser.
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline';

const PR_NUMBER = process.argv[2];
const SKIP_CONFIRMATION = process.argv.includes('--yes') || process.argv.includes('-y');

if (!PR_NUMBER || !/^\d+$/.test(PR_NUMBER)) {
	console.error('Usage: node scripts/preview-pr.mjs <PR_NUMBER> [--yes]');
	process.exit(1);
}

/**
 * Sanitize shell arguments to prevent command injection
 */
function sanitizeShellArg(arg) {
	// Only allow alphanumeric, hyphens, underscores, slashes, and dots
	if (!/^[a-zA-Z0-9\-_/.]+$/.test(arg)) {
		throw new Error(`Invalid characters in argument: ${arg}`);
	}
	return arg;
}

/**
 * Prompt user for confirmation
 */
async function confirm(message) {
	if (SKIP_CONFIRMATION) return true;

	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) => {
		rl.question(`${message} (y/N): `, (answer) => {
			rl.close();
			resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
		});
	});
}

const PREVIEW_DIR = join(process.cwd(), '.preview');
const PR_DIR = join(PREVIEW_DIR, `pr-${PR_NUMBER}`);
const BUILD_DIR = join(PR_DIR, 'build');

async function main() {
	console.log(`📦 Fetching PR #${PR_NUMBER} build artifact...\n`);

	try {
		// Get the PR's branch name and author info
		const prInfo = JSON.parse(
			execSync(`gh pr view ${PR_NUMBER} --json headRefName,author,title,url,isDraft`, { encoding: 'utf-8' })
		);

		if (!prInfo.headRefName) {
			console.error(`❌ Could not find PR #${PR_NUMBER}`);
			process.exit(1);
		}

		// Sanitize branch name to prevent command injection
		const sanitizedBranch = sanitizeShellArg(prInfo.headRefName);

		console.log(`\n📋 PR Information:`);
		console.log(`   Number: #${PR_NUMBER}`);
		console.log(`   Title: ${prInfo.title}`);
		console.log(`   Author: ${prInfo.author.login}`);
		console.log(`   Branch: ${prInfo.headRefName}`);
		console.log(`   URL: ${prInfo.url}`);
		console.log(`   Draft: ${prInfo.isDraft ? 'Yes' : 'No'}`);

		console.log(`\n⚠️  SECURITY WARNING:`);
		console.log(`   This will download and serve built files that may contain arbitrary code.`);
		console.log(`   Only proceed if you trust the PR author: ${prInfo.author.login}`);
		console.log(`   The built site will execute JavaScript in your browser.\n`);

		const shouldContinue = await confirm('Do you want to continue?');
		if (!shouldContinue) {
			console.log('❌ Aborted by user');
			process.exit(0);
		}

		console.log(`\n✓ PR branch: ${prInfo.headRefName}`);

		// Get the workflow run for this PR (using sanitized branch name)
		const runs = JSON.parse(
			execSync(
				`gh api repos/HarperDB/documentation/actions/runs --paginate -X GET -f branch=${sanitizedBranch} --jq '.workflow_runs | map(select(.conclusion == "success" and .name == "Deploy Docusaurus to GitHub Pages")) | sort_by(.created_at) | reverse | .[0]'`,
				{ encoding: 'utf-8' }
			)
		);

		if (!runs || !runs.id) {
			console.error(`❌ No successful workflow run found for PR #${PR_NUMBER}`);
			console.log('\nMake sure:');
			console.log('  1. The PR number is correct');
			console.log('  2. The PR has a successful build');
			console.log('  3. The build artifact exists');
			process.exit(1);
		}

		console.log(`✓ Found workflow run: ${runs.id}`);

		// Validate workflow run ID is numeric
		if (!/^\d+$/.test(String(runs.id))) {
			throw new Error('Invalid workflow run ID format');
		}

		// Get the artifacts for this run
		const artifacts = JSON.parse(
			execSync(`gh api repos/HarperDB/documentation/actions/runs/${runs.id}/artifacts --jq '.artifacts'`, {
				encoding: 'utf-8',
			})
		);

		const artifact = artifacts.find((a) => a.name === 'github-pages');

		if (!artifact) {
			console.error(`❌ No 'github-pages' artifact found for this PR`);
			process.exit(1);
		}

		// Validate artifact ID is numeric
		if (!/^\d+$/.test(String(artifact.id))) {
			throw new Error('Invalid artifact ID format');
		}

		const sizeMB = (artifact.size_in_bytes / 1024 / 1024).toFixed(2);
		console.log(`✓ Found artifact: ${artifact.name} (${sizeMB} MB)`);

		// Warn about large artifacts
		if (artifact.size_in_bytes > 100 * 1024 * 1024) {
			console.log(`\n⚠️  WARNING: Large artifact detected (${sizeMB} MB)`);
			const proceedLarge = await confirm('Artifact is unusually large. Continue?');
			if (!proceedLarge) {
				console.log('❌ Aborted by user');
				process.exit(0);
			}
		}

		// Create preview directory
		if (existsSync(PR_DIR)) {
			console.log(`\n🧹 Cleaning up existing preview for PR #${PR_NUMBER}...`);
			rmSync(PR_DIR, { recursive: true, force: true });
		}
		mkdirSync(PR_DIR, { recursive: true });

		// Download the artifact
		console.log('⬇️  Downloading artifact...');
		const artifactZip = join(PR_DIR, 'artifact.zip');
		execSync(`gh api repos/HarperDB/documentation/actions/artifacts/${artifact.id}/zip > "${artifactZip}"`, {
			stdio: 'inherit',
		});

		// Verify the downloaded file exists and is non-empty
		if (!existsSync(artifactZip)) {
			throw new Error('Downloaded artifact file not found');
		}

		// Extract the artifact (it's a tar.gz inside a zip)
		console.log('📂 Extracting artifact...');
		execSync(`unzip -q "${artifactZip}" -d "${PR_DIR}"`, { stdio: 'inherit' });

		// The github-pages artifact contains a tar.gz file
		const tarFile = join(PR_DIR, 'artifact.tar');
		if (existsSync(tarFile)) {
			mkdirSync(BUILD_DIR, { recursive: true });
			execSync(`tar -xzf "${tarFile}" -C "${BUILD_DIR}"`, { stdio: 'inherit' });
		} else {
			throw new Error('Expected artifact.tar not found in artifact');
		}

		// Verify extracted files are within expected directory
		const resolvedBuildDir = join(BUILD_DIR);
		if (!resolvedBuildDir.startsWith(PREVIEW_DIR)) {
			throw new Error('Security violation: extracted files outside preview directory');
		}

		// Clean up compressed files
		rmSync(artifactZip, { force: true });
		rmSync(tarFile, { force: true });

		console.log('\n✅ Preview ready!\n');
		console.log(`📁 Build location: ${BUILD_DIR}`);
		console.log(`\n⚠️  REMINDER: Only interact with the preview if you trust the PR author.`);
		console.log(`             Do not enter sensitive information in the preview.\n`);

		const startServer = await confirm('Start preview server?');
		if (!startServer) {
			console.log(`\n💡 You can manually serve the build later with:`);
			console.log(`   npm run serve -- --dir "${BUILD_DIR}"`);
			process.exit(0);
		}

		console.log(`\n🚀 Starting preview server...\n`);

		// Start the server with quoted path to prevent injection
		execSync(`npm run serve -- --dir "${BUILD_DIR}"`, { stdio: 'inherit' });
	} catch (error) {
		console.error('\n❌ Error:', error.message);
		process.exit(1);
	}
}

// Run the main function
main();
