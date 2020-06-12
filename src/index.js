// imports
const core = require('@actions/core');
const github = require('@actions/github');

const fs = require('fs');

// main
async function run() {
    try {
        var octokit = new github.GitHub(core.getInput('token'));

        var ref = core.getInput('source-ref');

        var repositoryAndOwner = core.getInput('source-repository').split('/');
        var owner = repositoryAndOwner[0];
        var repo = repositoryAndOwner[1]

        var configurationFiles = core.getInput('actions-configuration-files');
        configurationFiles = configurationFiles.split(',');

        configurationFiles.forEach(file => {
            let fileName = file.includes('/') ? file.substring(file.lastIndexOf('/') + 1, file.length) : file;
            let filePath = './.github/workflows/' + fileName;

            octokit.repos.getContents({ owner: owner, repo: repo, path: file, ref: ref, headers: { 'Accept': 'application/vnd.github.v3.raw' } }).then(response => {
                
                // update file
                fs.writeFileSync(filePath, response.data);

            }).catch(error => console.log('Cannot resolve `' + fileName + '` in target branch! ErrMsg => ' + error));
        });
    } catch (error) {
        core.setFailed(error.message);
    }
}

// start the action
run();
