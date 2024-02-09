# Fix PR titles

This action fixes titles of Pull Requests, by performing a few actions:

 - Determine project from branch name (`proj-22`, `feature/proj-22`, `feature/proj-22-steve` and alike)
 - Remove any duplicate occurances of the project code from the title
 - Remove prefixes like `Feature/` auto-created by GitHub sometimes
 - Convert title to Title Case (`My pull request` → `My Pull Request`)
 - Prefix the project code in brackets (`[PROJ-22]`)

If the only changes are casing, no changes are made.

## Installation

To add it to your project, create a new workflow that triggers on PR creation and changes.

For example, this could look like this:

```yaml
name: Clean up PR title

on:
  pull_request:
    types:
      - opened
      - edited

jobs:
  fix-titels:
    name: Clean up PR titles
    runs-on: ubuntu-latest

    steps:
      - name: Update PR title
        uses: sibizwolle/fix-title@master
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

