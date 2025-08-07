import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Debug: Log environment variables
if (process.env.DOCS_PATH) {
	console.log('Using DOCS_PATH:', process.env.DOCS_PATH);
}
if (process.env.IMAGES_PATH) {
	console.log('Using IMAGES_PATH:', process.env.IMAGES_PATH);
}

const scripts = [];

// `npm run site:build` and `docusaurus build` sets this to 'production'
// `npm run site:dev` and `docusaurus start` sets it to 'development'
if (process.env.NODE_ENV === 'production') {
	scripts.push({ src: 'js/reo.js' });
}

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
	url: 'https://docs.harperdb.io',
	// Set the /<baseUrl>/ pathname under which your site is served
	baseUrl: '/',

	// Serve images from the repository root or from env var path
	staticDirectories: process.env.IMAGES_PATH ? ['static', process.env.IMAGES_PATH] : ['static', '../images'],

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: 'HarperDB', // Usually your GitHub org/user name.
	projectName: 'documentation', // Usually your repo name.

	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',

	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
					// Use converted docs from DOCS_PATH or default location
					path: process.env.DOCS_PATH || '../docs',
					sidebarPath: './sidebars.ts',
					routeBasePath: 'docs',
					editUrl: ({ docPath }) => {
						// Find where docs/ starts in the path and use everything from there
						const docsIndex = docPath.indexOf('docs/');
						if (docsIndex !== -1) {
							const cleanPath = docPath.substring(docsIndex);
							// TODO: When implementing versioned docs, this will need to handle version branches
							return `https://github.com/HarperDB/documentation/blob/main/${cleanPath}`;
						}
						// Fallback if docs/ is not found
						return `https://github.com/HarperDB/documentation/blob/main/docs/${docPath}`;
					},
					lastVersion: 'current',
					includeCurrentVersion: true,
					versions: {
						'current': {
							label: 'Latest',
							path: 'latest',
						},
						'4.6': {
							label: '4.6',
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

	themes: [
		[
			require.resolve('@easyops-cn/docusaurus-search-local'),
			{
				hashed: true,
				language: ['en'],
				indexDocs: true,
				indexBlog: false,
				highlightSearchTermsOnTargetPage: true,
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
					href: 'https://github.com/HarperDB/harperdb',
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
							to: '/docs/latest/getting-started/',
						},
						{
							label: 'Developers',
							to: '/docs/latest/category/developers',
						},
						{
							label: 'Administration',
							to: '/docs/latest/category/administration',
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
