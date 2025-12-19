import React from 'react';
import DocsVersionDropdownNavbarItem from '@theme-original/NavbarItem/DocsVersionDropdownNavbarItem';
import { useLocation } from '@docusaurus/router';
import type { Props } from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';

function isNonVersionedPathname(pathname: string) {
	return pathname.startsWith('/fabric') || pathname.startsWith('/release-notes') || pathname.startsWith('/learn');
}

export default function DocsVersionDropdownNavbarItemWrapper(props: Props) {
	const location = useLocation();

	return isNonVersionedPathname(location.pathname) ? null : <DocsVersionDropdownNavbarItem {...props} />;
}
