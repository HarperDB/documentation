import React from 'react';
import { Redirect } from '@docusaurus/router';

export default function DocsIndex(): JSX.Element {
  return <Redirect to="/docs/latest" />;
}