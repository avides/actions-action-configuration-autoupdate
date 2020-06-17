# actions-action-configuration-autoupdate

This actions updates the local GitHub Actions configuration `yml`-files. You need an extra Github repository as source for your GitHub Actions configuration. To auto-commit the changes within the action run you can use the[stefanzweifel/git-auto-commit-action](https://github.com/stefanzweifel/git-auto-commit-action) action.

## Requirements

- GitHub repository that contains your personal GitHub Actions configuration files

## Inputs

### `token`

**Required** The repository token is used to request the remote GitHub Actions configuration-files from the [GitHub API](https://developer.github.com/v3/repos/contents/#get-contents)

### `actions-configuration-files`

**Required** Comma separated list of GitHub Action configuration filenames with path to the location in your remote repository

### `source-repository`

**Required** GitHub repository where your GitHub Action configuration is located

### `source-ref`

Branch/Commit/Tag from source repository where to get updated GitHub Actions configuration files (default: master)

## Outputs

### `updated`

Is set to `true` if one configuration file is changed. Usage:
```
- uses: avides/actions-action-configuration-autoupdate@v1.0.0
  id: actions_action_configuration_autoupdate
  with:
    token: ${{ secrets.PAT }}
    actions-configuration-files: path/to/files/workflow1.yml,path/to/files/workflow2.yml
    source-repository: your/workflow-configuration-repository

- name: action-configuration-updated
  if: ${{ steps.actions_action_configuration_autoupdate.outputs.updated }} == 'true'
  run: exit 1
```

## Example usage
```
- name: action-configuration-autoupdate
  uses: avides/action-configuration-autoupdate@v1.0.0
  with:
    token: ${{ secrets.PAT }}
    actions-configuration-files: path/to/files/workflow1.yml,path/to/files/workflow2.yml
    source-repository: your/workflow-configuration-repository
```

## Example usage with auto-commit
```
- name: checkout
  uses: actions/checkout@v2
  with:
    ref: ${{ github.head_ref }}
    token: ${{ secrets.PAT }}

- name: action-configuration-autoupdate
  uses: avides/action-configuration-autoupdate@v1.0.0
  with:
    token: ${{ secrets.PAT }}
    actions-configuration-files: path/to/files/workflow1.yml,path/to/files/workflow2.yml
    source-repository: your/workflow-configuration-repository

- uses: stefanzweifel/git-auto-commit-action@v4
  with:
    file_pattern: .github/workflows/*.yml
    commit_message: Update GitHub Action configuration
```
