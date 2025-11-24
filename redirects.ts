// Redirect configuration for Docusaurus client-side redirects
// Based on GitBook .gitbook.yaml redirects

type RedirectRule = {
	to: string;
	from: string | string[];
};

// Release notes redirects (not affected by base path)
function generateReleaseNotesRedirects(): RedirectRule[] {
	// Generate redirects for all old release notes paths to new location
	const versions = ['v1-alby', 'v2-penny', 'v3-monkey', 'v4-tucker'];
	const redirects: RedirectRule[] = [];

	// Main release notes index - redirect from current version (4.6) path
	redirects.push({
		from: '/docs/technical-details/release-notes',
		to: '/release-notes',
	});

	// Also redirect from each versioned docs path
	const docVersions = ['4.1', '4.2', '4.3', '4.4', '4.5', '4.6'];
	for (const docVersion of docVersions) {
		redirects.push({
			from: `/docs/${docVersion}/technical-details/release-notes`,
			to: '/release-notes',
		});
	}

	// Version index pages will be handled by the wildcard createRedirects function
	// to avoid duplicates

	return redirects;
}

// Documentation redirects
function generateDocsRedirects(basePath: string): RedirectRule[] {
	// Helper to add base path to a route
	const withBase = (path: string) => {
		// If basePath is just '/', return path as-is to avoid double slashes
		return basePath === '/' ? path : `${basePath}${path}`;
	};

	const redirects: RedirectRule[] = [];

	// Only add root redirect if docs are not at root
	if (basePath !== '/') {
		redirects.push({
			from: '/',
			to: basePath,
		});
	}

	redirects.push(
		// Operations API
		{
			from: withBase('/developers/operations-api/utilities'),
			to: withBase('/developers/operations-api/system-operations'),
		},

		// Installation paths
		{ from: withBase('/install-harperdb'), to: withBase('/deployments/install-harper/') },
		{ from: withBase('/install-harperdb/linux'), to: withBase('/deployments/install-harper/linux') },
		{ from: withBase('/install-harperdb/other'), to: withBase('/deployments/install-harper/') },
		{ from: withBase('/install-harperdb/docker'), to: withBase('/deployments/install-harper/') },
		{ from: withBase('/install-harperdb/mac'), to: withBase('/deployments/install-harper/') },
		{ from: withBase('/install-harperdb/windows'), to: withBase('/deployments/install-harper/') },
		{ from: withBase('/install-harperdb/linux-quickstart'), to: withBase('/deployments/install-harper/linux') },
		{ from: withBase('/install-harperdb/offline'), to: withBase('/deployments/install-harper/') },
		{ from: withBase('/install-harperdb/node-ver-requirement'), to: withBase('/deployments/install-harper/') },
		{ from: withBase('/deployments/install-harperdb'), to: withBase('/deployments/install-harper/') },
		{ from: withBase('/deployments/install-harperdb/linux'), to: withBase('/deployments/install-harper/linux') },
		{ from: withBase('/getting-started/install-harper'), to: withBase('/getting-started/installation') },

		// Harper Studio (old HarperDB Studio paths)
		{ from: withBase('/harperdb-studio'), to: withBase('/administration/harper-studio/') },
		{ from: withBase('/harperdb-studio/create-account'), to: withBase('/administration/harper-studio/create-account') },
		{
			from: withBase('/harperdb-studio/login-password-reset'),
			to: withBase('/administration/harper-studio/login-password-reset'),
		},
		{
			from: [withBase('/harperdb-studio/resources'), withBase('/administration/harper-studio/resources')],
			to: withBase('/administration/harper-studio/'),
		},
		{ from: withBase('/harperdb-studio/organizations'), to: withBase('/administration/harper-studio/organizations') },
		{ from: withBase('/harperdb-studio/instances'), to: withBase('/administration/harper-studio/instances') },
		{
			from: withBase('/harperdb-studio/query-instance-data'),
			to: withBase('/administration/harper-studio/query-instance-data'),
		},
		{
			from: withBase('/harperdb-studio/manage-schemas-browse-data'),
			to: withBase('/administration/harper-studio/manage-databases-browse-data'),
		},
		{
			from: [withBase('/harperdb-studio/manage-charts'), withBase('/administration/harper-studio/manage-charts')],
			to: withBase('/administration/harper-studio/query-instance-data'),
		},
		{
			from: withBase('/harperdb-studio/manage-clustering'),
			to: withBase('/administration/harper-studio/manage-replication'),
		},
		{
			from: withBase('/harperdb-studio/manage-instance-users'),
			to: withBase('/administration/harper-studio/manage-instance-users'),
		},
		{
			from: withBase('/harperdb-studio/manage-instance-roles'),
			to: withBase('/administration/harper-studio/manage-instance-users'),
		},
		{
			from: withBase('/harperdb-studio/manage-functions'),
			to: withBase('/administration/harper-studio/manage-applications'),
		},
		{
			from: withBase('/harperdb-studio/instance-metrics'),
			to: withBase('/administration/harper-studio/instance-metrics'),
		},
		{
			from: withBase('/harperdb-studio/instance-configuration'),
			to: withBase('/administration/harper-studio/instance-configuration'),
		},
		{
			from: withBase('/harperdb-studio/enable-mixed-content'),
			to: withBase('/administration/harper-studio/enable-mixed-content'),
		},

		// Harper Cloud (old HarperDB Cloud paths)
		{ from: withBase('/harperdb-cloud'), to: withBase('/deployments/harper-cloud/') },

		// Security
		{ from: withBase('/security'), to: withBase('/developers/security/') },
		{ from: withBase('/security/jwt-auth'), to: withBase('/developers/security/jwt-auth') },
		{ from: withBase('/security/basic-auth'), to: withBase('/developers/security/basic-auth') },
		{ from: withBase('/security/configuration'), to: withBase('/developers/security/configuration') },
		{ from: withBase('/security/users-and-roles'), to: withBase('/developers/security/users-and-roles') },

		// Custom Functions → Applications
		{ from: withBase('/custom-functions'), to: withBase('/developers/applications/') },
		{ from: withBase('/custom-functions/define-routes'), to: withBase('/developers/applications/define-routes') },
		{
			from: [withBase('/custom-functions/using-npm-git'), withBase('/developers/custom-functions/create-project')],
			to: withBase('/developers/applications/'),
		},
		{ from: withBase('/custom-functions/custom-functions-operations'), to: withBase('/developers/operations-api/') },
		{
			from: withBase('/custom-functions/debugging-custom-function'),
			to: withBase('/developers/applications/debugging'),
		},

		// SQL Guide Root Page
		{ from: withBase('/sql-guide'), to: withBase('/reference/sql-guide/') },
		{ from: withBase('/developers/sql-guide'), to: withBase('/reference/sql-guide/') },

		// Clustering Root Page
		{ from: withBase('/clustering'), to: withBase('/reference/clustering/') },

		// CLI
		{ from: withBase('/harperdb-cli'), to: withBase('/deployments/harper-cli') },
		{ from: withBase('/deployments/harperdb-cli'), to: withBase('/deployments/harper-cli') },

		// Top-level paths
		{ from: withBase('/configuration'), to: withBase('/deployments/configuration') },
		{ from: withBase('/logging'), to: withBase('/administration/logging/standard-logging') },
		{ from: withBase('/transaction-logging'), to: withBase('/administration/logging/transaction-logging') },
		{ from: withBase('/audit-logging'), to: withBase('/administration/logging/audit-logging') },
		{ from: withBase('/jobs'), to: withBase('/administration/jobs') },
		{ from: withBase('/upgrade-hdb-instance'), to: withBase('/deployments/upgrade-hdb-instance') },
		{ from: withBase('/operations-api'), to: withBase('/developers/operations-api/') },
		{ from: withBase('/rest'), to: withBase('/developers/rest') },
		{ from: withBase('/api'), to: withBase('/developers/operations-api/') },

		// File rename redirect
		{ from: withBase('/administration/logging/logging'), to: withBase('/administration/logging/standard-logging') },

		// Old Technical Details -> Reference paths
		{ from: withBase('/technical-details/reference'), to: withBase('/reference/') },

		// Getting Started -> Root
		{ from: withBase('/getting-started'), to: withBase('/') }
	);

	return redirects;
}

// Combine all redirects
export function generateRedirects(basePath: string): RedirectRule[] {
	return [...generateReleaseNotesRedirects(), ...generateDocsRedirects(basePath)];
}

// For backward compatibility, export a default set with empty base path
export const redirects = generateRedirects('');

// Function to create wildcard redirects for moved sections
// This handles dynamic redirects for paths not explicitly defined in the main redirect list
export function createRedirects(existingPath: string, basePath: string = ''): string[] | undefined {
	const redirects: string[] = [];

	// Handle release notes redirects from old location to new
	if (existingPath.startsWith('/release-notes/')) {
		// Extract the path after /release-notes/
		const subpath = existingPath.replace('/release-notes/', '');

		// Handle old version naming (4.tucker -> v4-tucker, etc.)
		let oldSubpath = subpath;
		const versionMap: Record<string, string> = {
			'v1-alby': '1.alby',
			'v2-penny': '2.penny',
			'v3-monkey': '3.monkey',
			'v4-tucker': '4.tucker',
		};

		// Check if the path starts with a new version name and convert to old format
		for (const [newName, oldName] of Object.entries(versionMap)) {
			if (subpath.startsWith(`${newName}/`) || subpath === newName) {
				oldSubpath = subpath.replace(newName, oldName);
				break;
			}
		}

		// Add redirects from current version docs (4.6 is served at /docs/)
		redirects.push(`/docs/technical-details/release-notes/${subpath}`);
		if (oldSubpath !== subpath) {
			redirects.push(`/docs/technical-details/release-notes/${oldSubpath}`);
		}

		// Also redirect from all versioned docs paths
		const versions = ['4.1', '4.2', '4.3', '4.4', '4.5', '4.6'];
		for (const version of versions) {
			redirects.push(`/docs/${version}/technical-details/release-notes/${subpath}`);
			if (oldSubpath !== subpath) {
				redirects.push(`/docs/${version}/technical-details/release-notes/${oldSubpath}`);
			}
		}
	}

	// Only create wildcard redirects for paths that aren't already explicitly defined
	// Check if this is a path we handle with wildcard redirects

	// Harper Studio - only for subpaths not already defined
	if (existingPath.startsWith(`${basePath}/administration/harper-studio/`)) {
		const subpath = existingPath.replace(`${basePath}/administration/harper-studio/`, '');
		// Skip paths that are already explicitly redirected
		const explicitStudioPaths = [
			'create-account',
			'login-password-reset',
			'organizations',
			'instances',
			'query-instance-data',
			'manage-databases-browse-data',
			'manage-replication',
			'manage-instance-users',
			'manage-applications',
			'instance-metrics',
			'instance-configuration',
			'enable-mixed-content',
		];
		if (subpath && !explicitStudioPaths.includes(subpath)) {
			redirects.push(`${basePath}/administration/harperdb-studio/${subpath}`);
		}
	}

	// Harper Cloud - only for subpaths not already defined
	if (existingPath.startsWith(`${basePath}/deployments/harper-cloud/`)) {
		const subpath = existingPath.replace(`${basePath}/deployments/harper-cloud/`, '');
		// The main harper-cloud redirect is explicit, only handle other subpaths
		if (subpath) {
			redirects.push(`${basePath}/deployments/harperdb-cloud/${subpath}`);
		}
	}

	// Install Harper - only for subpaths not already defined
	if (existingPath.startsWith(`${basePath}/deployments/install-harper/`)) {
		const subpath = existingPath.replace(`${basePath}/deployments/install-harper/`, '');
		// Skip 'linux' as it's explicitly defined
		if (subpath && subpath !== 'linux') {
			redirects.push(`${basePath}/deployments/install-harperdb/${subpath}`);
		}
	}

	// Custom Functions - handle subpaths
	if (existingPath.startsWith(`${basePath}/developers/custom-functions/`)) {
		const subpath = existingPath.replace(`${basePath}/developers/custom-functions/`, '');
		// Skip paths that are explicitly defined
		const explicitCustomPaths = ['define-routes', 'debugging-custom-function', 'example-projects'];
		if (subpath && !explicitCustomPaths.includes(subpath)) {
			redirects.push(`${basePath}/custom-functions/${subpath}`);
		}
	}

	if (existingPath.startsWith(`${basePath}/reference/sql-guide`)) {
		const subpath = existingPath.replace(`${basePath}/reference/sql-guide`, '');
		if (subpath) {
			redirects.push(`${basePath}/sql-guide${subpath}`);
			redirects.push(`${basePath}/developers/sql-guide${subpath}`);
		}
	}

	if (existingPath.startsWith(`${basePath}/reference/clustering`)) {
		const subpath = existingPath.replace(`${basePath}/reference/clustering`, '');
		if (subpath) {
			redirects.push(`${basePath}/developers/clustering${subpath}`);
		}
	}

	// Old Technical Details -> Reference paths
	if (existingPath.startsWith(`${basePath}/reference/`)) {
		const subpath = existingPath.replace(`${basePath}/reference/`, '');
		if (subpath) {
			redirects.push(`${basePath}/technical-details/reference/${subpath}`);
		}
	}

	// Don't create wildcard redirects for these as they're all explicitly defined:
	// - /developers/security/* (all subpaths are explicit)
	// - /deployments/harper-cli (explicit)
	// - /developers/operations-api/* (has explicit redirects)

	return redirects.length > 0 ? redirects : undefined;
}
