import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { generateRedirects, createRedirects as createRedirectsBase } from './redirects';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const scripts = [];

// `npm run build` sets this to 'production'
// `npm start` and `npm run dev` sets it to 'development'
if (process.env.NODE_ENV === 'production') {
	scripts.push({ src: '/js/reo.js' });
}

// Determine base URL from environment variable or use defaults
// For GitHub Pages deployment: DOCUSAURUS_BASE_URL=/documentation/
// For local development: DOCUSAURUS_BASE_URL=/ (or unset)
// Can also be set via command line: npm run build -- --base-url /documentation/
const baseUrl = process.env.DOCUSAURUS_BASE_URL || '/';

// Determine route base path for docs
// Can be set to '/docs/' if we need docs under a subdirectory
// Default is '/' to serve docs at the root
const routeBasePath = process.env.DOCUSAURUS_ROUTE_BASE_PATH || '/';

// URL can also be overridden if needed
const url = process.env.DOCUSAURUS_URL || 'https://docs.harperdb.io';

// Always log configuration at build time
console.log('Docusaurus URL config:', { url, baseUrl, routeBasePath });

const config: Config = {
	title: 'Harper Docs',
	tagline:
		'Harper fuses database, cache, messaging, and application functions into a single process — delivering performance and simplicity for data-intensive, latency-sensitive applications.',
	favicon: 'img/HarperDogLogo.svg',

	// Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
	future: {
		v4: true, // Improve compatibility with the upcoming Docusaurus v4
	},

	// Set the production url of your site here
	url,
	// Set the /<baseUrl>/ pathname under which your site is served
	baseUrl,

	// Serve images from the repository root or from env var path
	staticDirectories: process.env.IMAGES_PATH ? ['static', process.env.IMAGES_PATH] : ['static', '../images'],

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: 'HarperDB', // Usually your GitHub org/user name.
	projectName: 'documentation', // Usually your repo name.

	onBrokenLinks: 'warn',
	onBrokenMarkdownLinks: 'warn',

	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
					path: '../docs',
					sidebarPath: './sidebars.ts',
					// Docs are served at the configured route base path
					routeBasePath,
					editUrl: ({ versionDocsDirPath, docPath }) => {
						// For versioned docs: versionDocsDirPath is like 'versioned_docs/version-4.6'
						// For current docs: versionDocsDirPath is 'docs'
						if (versionDocsDirPath.startsWith('versioned_docs')) {
							// Versioned docs are in versioned_docs/version-X.X/
							return `https://github.com/HarperDB/documentation/blob/main/${versionDocsDirPath}/${docPath}`;
						} else {
							// Current docs are in the root docs/ directory
							return `https://github.com/HarperDB/documentation/blob/main/docs/${docPath}`;
						}
					},
					lastVersion: '4.6',
					includeCurrentVersion: false,
					versions: {
						'4.6': {
							banner: 'none', // No banner for this version
						},
						'4.5': {
							// No banner for 4.5 as its still actively maintained. Docusaurus doesn't allow us to set custom
							// text for the banner. Only option is to eject swizzle DocVersionBanner (`npm run swizzle @docusaurus/theme-classic DocVersionBanner -- --eject`)
							// and modify the internal rendering logic based on the version number. Cannot even add a new `banner` option without even more hackery.
							// Here is a relevant discussion thread: https://github.com/facebook/docusaurus/discussions/7112 if we really want this, we should look to contribute this feature.
							banner: 'none',
						},
					},
					remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }]],
				},
				blog: false,
				theme: {
					customCss: './src/css/custom.css',
				},
			} satisfies Preset.Options,
		],
	],

	plugins: [
		[
			'@docusaurus/plugin-client-redirects',
			{
				redirects: generateRedirects(routeBasePath),
				createRedirects: (existingPath: string) => createRedirectsBase(existingPath, routeBasePath),
			},
		],
	],

	themes: [
		[
			require.resolve('@easyops-cn/docusaurus-search-local'),
			{
				hashed: true,
				language: ['en'],
				indexDocs: true,
				indexBlog: false,
				indexPages: false,
				docsRouteBasePath: routeBasePath,
				highlightSearchTermsOnTargetPage: true,
				searchResultLimits: 8,
				// Explicitly set the search bar position
				searchBarPosition: 'right',
			},
		],
		'@docusaurus/theme-mermaid',
	],

	markdown: {
		mermaid: true,
	},

	themeConfig: {
		// Replace with your project's social card
		image: 'img/HarperOpenGraph.jpg',
		navbar: {
			logo: {
				alt: 'Harper Logo',
				src: 'img/HarperPrimaryBlk.svg',
				srcDark: 'img/HarperPrimaryWht.svg',
				href: 'https://www.harpersystems.dev',
			},
			items: [
				{
					type: 'docSidebar',
					sidebarId: 'docsSidebar',
					position: 'left',
					label: 'Documentation',
				},
				{
					type: 'docsVersionDropdown',
					position: 'right',
					dropdownActiveClassDisabled: true,
				},
				{
					href: 'https://github.com/HarperDB/documentation',
					label: 'GitHub',
					position: 'right',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [
				{
					title: 'Documentation',
					items: [
						{
							label: 'Getting Started',
							to: `${routeBasePath}/getting-started`,
						},
						// {
						// 	label: 'Developers',
						// 	to: `${routeBasePath}/developers`,
						// },
						{
							label: 'Administration',
							to: `${routeBasePath}/administration`,
						},
					],
				},
				{
					title: 'Community',
					items: [
						{
							label: 'Slack',
							href: 'https://harperdbcommunity.slack.com',
						},
						{
							label: 'LinkedIn',
							href: 'https://www.linkedin.com/company/harpersystems/',
						},
						{
							label: 'X (Twitter)',
							href: 'https://twitter.com/harperdbio',
						},
					],
				},
				{
					title: 'More',
					items: [
						{
							label: 'Harper Systems',
							href: 'https://www.harpersystems.dev',
						},
						{
							label: 'Blog',
							href: 'https://www.harpersystems.dev/blog',
						},
						{
							label: 'GitHub',
							href: 'https://github.com/HarperDB/harperdb',
						},
						{
							label: 'Contact',
							href: 'https://www.harpersystems.dev/contact',
						},
					],
				},
			],
			copyright: `Copyright © ${new Date().getFullYear()} HarperDB, Inc.`,
		},
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula,
		},
	} satisfies Preset.ThemeConfig,
	scripts,
};

export default config;
