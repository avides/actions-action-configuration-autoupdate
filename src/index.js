// imports
const core = require('@actions/core');
const github = require('@actions/github');

const fs = require('fs');

// main
async function run() {
    try {
        var octokit = new github.getOctokit(core.getInput('token'));

        var ref = core.getInput('source-ref');

        var repositoryAndOwner = core.getInput('source-repository').split('/');
        var owner = repositoryAndOwner[0];
        var repo = repositoryAndOwner[1]

        var configurationFiles = core.getInput('actions-configuration-files');
        configurationFiles = configurationFiles.split(',');

        configurationFiles.forEach(file => {
            let fileName = file.includes('/') ? file.substring(file.lastIndexOf('/') + 1, file.length) : file;
            let filePath = './.github/workflows/' + fileName;

            octokit.rest.repos.getContent({ owner: owner, repo: repo, path: file, ref: ref, headers: { 'Accept': 'application/vnd.github.v3.raw' } }).then(response => {
                let current = fs.readFileSync(filePath);

                if (current != response.data) {
                    fs.writeFileSync(filePath, response.data);
                    core.setOutput('updated', 'true');
                }
            }).catch(error => core.setFailed('Cannot resolve `' + fileName + '` in target branch! ErrMsg => ' + error));
        });
    } catch (error) {
        core.setFailed(error.message);
    }
}

// start the action
run();
