# Branch Protection Setup Guide

To enforce the lint and format checks before PRs can be merged, follow these steps:

## 1. Go to Branch Protection Settings

1. Navigate to your repository on GitHub
2. Go to Settings → Branches
3. Click "Add rule" or edit the existing rule for `main`

## 2. Configure Protection Rules

Set these options:

- ✅ **Require a pull request before merging**
- ✅ **Require status checks to pass before merging**
  - Search for and add: `Lint and Format Check`
- ✅ **Require branches to be up to date before merging**
- ✅ **Do not allow bypassing the above settings**

## 3. Optional Additional Settings

- ✅ **Dismiss stale PR approvals when new commits are pushed**
- ✅ **Require review from CODEOWNERS**

## Notes

- The lint/format workflow only runs on PRs, not on pushes to main
- Your existing deploy workflow will continue to run independently
- PRs will be blocked from merging if formatting or TypeScript issues are found
- Contributors can fix issues by running `npm run format` and `npm run typecheck`

## Testing

Create a test PR with formatting issues to verify the workflow blocks merging as expected.
