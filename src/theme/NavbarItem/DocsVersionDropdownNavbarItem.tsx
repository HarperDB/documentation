import React from 'react';
import DocsVersionDropdownNavbarItem from '@theme-original/NavbarItem/DocsVersionDropdownNavbarItem';
import { useLocation } from '@docusaurus/router';
import type { Props } from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';

function checkPathname(pathname: string) {
	return pathname.startsWith('/fabric') || pathname.startsWith('/release-notes');
}

export default function DocsVersionDropdownNavbarItemWrapper(props: Props) {
	const location = useLocation();

	return checkPathname(location.pathname) ? null : <DocsVersionDropdownNavbarItem {...props} />;
}
