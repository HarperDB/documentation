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

const config: Config = {
	title: 'Harper Docs',
	tagline:
		'Harper fuses database, cache, messaging, and application functions into a single process — delivering performance and simplicity for data-intensive, latency-sensitive applications.',
	favicon: 'img/HarperDogSmall.png',

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

	// Even if you don't use internationalization, you can use this field to set
	// useful metadata like html lang. For example, if your site is Chinese, you
	// may want to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},

	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
					// IMPORTANT: This site only works with converted docs from harperdb repo
					// The documentation repo contains GitBook-formatted docs that must be converted first
					// Always run preview from harperdb repo: npm run docs:dev
					path: process.env.DOCS_PATH || '../docs', // DOCS_PATH should always be set to harperdb/docs
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
					versions: {
						current: {
							label: 'Latest',
							path: '',
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
	],

	themeConfig: {
		// Replace with your project's social card
		image: 'img/docusaurus-social-card.jpg',
		navbar: {
			// title: 'Harper Docs',
			logo: {
				alt: 'Harper Logo',
				src: 'img/HarperPrimaryBlk.svg',
				srcDark: 'img/HarperPrimaryWht.svg',
			},
			items: [
				// {
				// 	type: 'docSidebar',
				// 	sidebarId: 'docsSidebar',
				// 	position: 'left',
				// 	label: 'Documentation',
				// },
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
							to: '/docs/category/getting-started',
						},
						{
							label: 'Developers',
							to: '/docs/category/developers',
						},
						{
							label: 'Administration',
							to: '/docs/category/administration',
						},
						{
							label: 'Technical Reference',
							to: '/docs/technical-details/reference/',
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
};

export default config;
