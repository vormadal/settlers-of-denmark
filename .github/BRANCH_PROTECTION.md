# Branch Protection Setup

This document describes how to configure branch protection rules to ensure the PR build verification passes before merging.

## Setting Up Branch Protection Rules

To enforce the Docker build verification on pull requests before they can be merged to `main`, follow these steps:

1. Go to your GitHub repository settings
2. Navigate to **Settings** → **Branches** → **Branch protection rules**
3. Click **Add rule** or edit the existing rule for the `main` branch
4. Configure the following settings:

### Required Settings

- **Branch name pattern**: `main`
- **Require status checks to pass before merging**: ✅ Enabled
  - **Require branches to be up to date before merging**: ✅ Enabled (recommended)
  - Search for and select the following status check:
    - `build` (from the "PR Build Verification" workflow)

### Recommended Additional Settings

- **Require a pull request before merging**: ✅ Enabled
  - **Require approvals**: Set to 1 or more reviewers (optional but recommended)
- **Do not allow bypassing the above settings**: ✅ Enabled (prevents administrators from bypassing)

## What This Protects Against

The branch protection rule ensures that:

1. ✅ The full Docker image builds successfully
2. ✅ Both client and server compile without errors
3. ✅ All dependencies can be installed correctly
4. ✅ The production image can be created

## Workflow Details

The PR build verification workflow (`.github/workflows/pr-build.yml`):
- Triggers on all pull requests targeting the `main` branch
- Builds the complete Docker image using the existing `Dockerfile`
- Uses GitHub Actions cache to speed up subsequent builds
- Does not push the image (build verification only)

## Troubleshooting

If the build check fails:
1. Check the GitHub Actions workflow run for detailed error messages
2. Review the Docker build logs in the workflow output
3. Test the build locally with: `docker build -t settlers-of-denmark:test .`
4. Ensure all dependencies in `package.json` and `package-lock.json` are correct
