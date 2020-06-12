# actions-action-configuration-update

This actions updates the local GitHub Actions configuration `yml`-files. You need an extra Github repository as source for your GitHub Actions configuration. To auto-commit the changes within the action run you can use [stefanzweifel/git-auto-commit-action](https://github.com/stefanzweifel/git-auto-commit-action).

## Inputs

### `token`

**Required** The repository token is used to request the remote GitHub Actions configuration-files from the [GitHub API](https://developer.github.com/v3/repos/contents/#get-contents)

### `actions-configuration-files`

**Required** Comma separated list of GitHub Action configuration filenames with path to the location in your remote repository

### `source-repository`

**Required** GitHub repository where your GitHub Action configuration is located

### `source-ref`

Branch/Commit/Tag from source repository where to get updated GitHub Actions configuration files

## Outputs

### `isUpdated`

If the version update is valid then the new version is available as output. Usage:
```
- uses: avides/actions-project-version-check@latest
  id: actions_project_version_check
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    file-to-check: pom.xml

- name: use-version-from-check
  run: echo "New version is: " ${{ steps.actions_project_version_check.outputs.version }}
```

## Example usage
```
- name: action-configuration-update
  uses: avides/action-configuration-update@v1.0.0
  with:
    token: ${{ secrets.PAT }}
    actions-configuration-files: workflow.yml
    source-repository: your/workflow-configuration-repository

- name: action-configuration-updated
  if: ${{ <expression> }}
  run: exit 0
```

## Example usage with auto-commit
```
- name: checkout
  uses: actions/checkout@v2
  with:
    ref: ${{ github.head_ref }}
    token: ${{ secrets.PAT }}

- name: action-configuration-update
  uses: avides/action-configuration-update@v1.0.0
  with:
    token: ${{ secrets.PAT }}
    actions-configuration-files: some-dir/workflow.yml
    source-repository: your/workflow-configuration-repository

- uses: stefanzweifel/git-auto-commit-action@v4
  with:
    file_pattern: .github/workflows/*.yml
    commit_message: Update GitHub Action configuration
```
