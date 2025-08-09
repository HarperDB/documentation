// Redirect configuration for Docusaurus client-side redirects
// Based on GitBook .gitbook.yaml redirects

type RedirectRule = {
	to: string;
	from: string | string[];
};

export const redirects: RedirectRule[] = [
	// Operations API
	{ from: '/developers/operations-api/utilities', to: '/developers/operations-api/system-operations' },
	
	// Installation paths
	{ from: '/install-harperdb', to: '/deployments/install-harper/' },
	{ from: '/install-harperdb/linux', to: '/deployments/install-harper/linux' },
	{ from: '/install-harperdb/other', to: '/deployments/install-harper/' },
	{ from: '/install-harperdb/docker', to: '/deployments/install-harper/' },
	{ from: '/install-harperdb/mac', to: '/deployments/install-harper/' },
	{ from: '/install-harperdb/windows', to: '/deployments/install-harper/' },
	{ from: '/install-harperdb/linux-quickstart', to: '/deployments/install-harper/linux' },
	{ from: '/install-harperdb/offline', to: '/deployments/install-harper/' },
	{ from: '/install-harperdb/node-ver-requirement', to: '/deployments/install-harper/' },
	{ from: '/deployments/install-harperdb', to: '/deployments/install-harper/' },
	{ from: '/deployments/install-harperdb/linux', to: '/deployments/install-harper/linux' },
	
	// Harper Studio (old HarperDB Studio paths)
	{ from: '/harperdb-studio', to: '/administration/harper-studio/' },
	{ from: '/harperdb-studio/create-account', to: '/administration/harper-studio/create-account' },
	{ from: '/harperdb-studio/login-password-reset', to: '/administration/harper-studio/login-password-reset' },
	{ from: ['/harperdb-studio/resources', '/administration/harper-studio/resources'], to: '/administration/harper-studio/' },
	{ from: '/harperdb-studio/organizations', to: '/administration/harper-studio/organizations' },
	{ from: '/harperdb-studio/instances', to: '/administration/harper-studio/instances' },
	{ from: '/harperdb-studio/query-instance-data', to: '/administration/harper-studio/query-instance-data' },
	{ from: '/harperdb-studio/manage-schemas-browse-data', to: '/administration/harper-studio/manage-databases-browse-data' },
	{ from: ['/harperdb-studio/manage-charts', '/administration/harper-studio/manage-charts'], to: '/administration/harper-studio/query-instance-data' },
	{ from: '/harperdb-studio/manage-clustering', to: '/administration/harper-studio/manage-replication' },
	{ from: '/harperdb-studio/manage-instance-users', to: '/administration/harper-studio/manage-instance-users' },
	{ from: '/harperdb-studio/manage-instance-roles', to: '/administration/harper-studio/manage-instance-users' },
	{ from: '/harperdb-studio/manage-functions', to: '/administration/harper-studio/manage-applications' },
	{ from: '/harperdb-studio/instance-metrics', to: '/administration/harper-studio/instance-metrics' },
	{ from: '/harperdb-studio/instance-configuration', to: '/administration/harper-studio/instance-configuration' },
	{ from: '/harperdb-studio/enable-mixed-content', to: '/administration/harper-studio/enable-mixed-content' },
	
	// Harper Cloud (old HarperDB Cloud paths)
	{ from: '/harperdb-cloud', to: '/deployments/harper-cloud/' },
	
	// Security
	{ from: '/security', to: '/developers/security/' },
	{ from: '/security/jwt-auth', to: '/developers/security/jwt-auth' },
	{ from: '/security/basic-auth', to: '/developers/security/basic-auth' },
	{ from: '/security/configuration', to: '/developers/security/configuration' },
	{ from: '/security/users-and-roles', to: '/developers/security/users-and-roles' },
	
	// Custom Functions → Applications
	{ from: '/custom-functions', to: '/developers/applications/' },
	{ from: '/custom-functions/define-routes', to: '/developers/applications/define-routes' },
	{ from: ['/custom-functions/using-npm-git', '/developers/custom-functions/create-project'], to: '/developers/applications/' },
	{ from: '/custom-functions/custom-functions-operations', to: '/developers/operations-api/' },
	{ from: '/custom-functions/debugging-custom-function', to: '/developers/applications/debugging' },
	{ from: '/custom-functions/example-projects', to: '/developers/applications/example-projects' },
	
	// Add-ons and SDKs
	{ from: '/add-ons-and-sdks', to: '/developers/applications/' },
	{ from: '/add-ons-and-sdks/google-data-studio', to: '/developers/miscellaneous/google-data-studio' },
	
	// SQL Guide
	{ from: '/sql-guide', to: '/developers/sql-guide/' },
	
	// CLI
	{ from: '/harperdb-cli', to: '/deployments/harper-cli' },
	{ from: '/deployments/harperdb-cli', to: '/deployments/harper-cli' },
	
	// Top-level paths
	{ from: '/configuration', to: '/deployments/configuration' },
	{ from: '/logging', to: '/administration/logging/standard-logging' },
	{ from: '/transaction-logging', to: '/administration/logging/transaction-logging' },
	{ from: '/audit-logging', to: '/administration/logging/audit-logging' },
	{ from: '/jobs', to: '/administration/jobs' },
	{ from: '/upgrade-hdb-instance', to: '/deployments/upgrade-hdb-instance' },
	{ from: '/reference', to: '/technical-details/reference/' },
	{ from: '/operations-api', to: '/developers/operations-api/' },
	{ from: '/rest', to: '/developers/rest' },
	{ from: '/api', to: '/developers/operations-api/' },
	
	// File rename redirect
	{ from: '/administration/logging/logging', to: '/administration/logging/standard-logging' },
];

// Function to create wildcard redirects for moved sections
export function createRedirects(existingPath: string): string[] | undefined {
	const redirects: string[] = [];
	
	// Handle wildcard redirects for paths with subpaths
	if (existingPath.startsWith('/administration/harper-studio/')) {
		const subpath = existingPath.replace('/administration/harper-studio/', '');
		if (subpath) {  // Only add redirect if there's an actual subpath
			redirects.push(`/administration/harperdb-studio/${subpath}`);
		}
	}
	
	if (existingPath.startsWith('/deployments/harper-cloud/')) {
		const subpath = existingPath.replace('/deployments/harper-cloud/', '');
		if (subpath) {  // Only add redirect if there's an actual subpath
			redirects.push(`/harperdb-cloud/${subpath}`);
			redirects.push(`/deployments/harperdb-cloud/${subpath}`);
		}
	}
	
	if (existingPath.startsWith('/developers/clustering/')) {
		const subpath = existingPath.replace('/developers/clustering/', '');
		if (subpath) {  // Only add redirect if there's an actual subpath
			redirects.push(`/clustering/${subpath}`);
		}
	}
	
	if (existingPath.startsWith('/developers/sql-guide/')) {
		const subpath = existingPath.replace('/developers/sql-guide/', '');
		if (subpath) {  // Only add redirect if there's an actual subpath
			redirects.push(`/sql-guide/${subpath}`);
		}
	}
	
	return redirects.length > 0 ? redirects : undefined;
}