import React from 'react';
import { Redirect } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Home(): JSX.Element {
	const { siteConfig } = useDocusaurusContext();
	// Get the routeBasePath from the docs preset config
	const docsPath = siteConfig?.presets?.[0]?.[1]?.docs?.routeBasePath || '/docs';

	// Redirect to the configured docs path
	return <Redirect to={docsPath} />;
}
