# Update PR

This action updates Pull Requests, by performing a few actions:

 - Determine project from branch name (`proj-22`, `feature/proj-22`, `feature/proj-22-steve` and alike)
 - Remove any duplicate occurances of the project code from the title
 - Remove prefixes like `Feature/` auto-created by GitHub sometimes
 - Convert title to Title Case (`My pull request` → `My Pull Request`)
 - Prefix the project code in brackets (`[PROJ-22]`)
 - If a label exists with the prefix, it adds the label to the PR.

## Installation

To add it to your project, create a new workflow that triggers on PR creation and changes.

For example, this could look like this:

```yaml
name: Update PR details

on:
  pull_request:
    types:
      - opened
      - edited

jobs:
  fix-pr:
    name: Update PR details
    runs-on: ubuntu-latest

    steps:
      - name: Update PR
        uses: sibizwolle/fix-title@master
        with:
          token: ${{ secrets.GITHUB_TOKEN }},
          label: true

