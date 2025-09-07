import React from 'react';

// Import the release notes data statically
const releaseNotesData = require('@site/release-notes-data.json');

interface LatestPatchLinkProps {
	major: number;
	minor: number;
	label?: string;
}

export default function LatestPatchLink({ major, minor, label }: LatestPatchLinkProps): React.JSX.Element {
	const releaseData = releaseNotesData[major];

	if (!releaseData) {
		return <>[{label || `${major}.${minor}`}]</>;
	}

	// Find the latest patch version for this minor release
	const targetPrefix = `${major}.${minor}.`;
	const latestPatch = releaseData.versions.find((version: string) => version.startsWith(targetPrefix));

	if (!latestPatch) {
		return <>[{label || `${major}.${minor}`}]</>;
	}

	// Create the link - note we use a regular anchor tag since this is rendered in the heading
	const href = `/release-notes/v${major}-${releaseData.pupName.toLowerCase()}/${latestPatch}`;
	const displayLabel = label || `${major}.${minor}`;

	return <a href={href}>[{displayLabel}]</a>;
}
