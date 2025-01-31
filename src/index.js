// imports
import { getInput, setOutput, setFailed } from '@actions/core';
import { getOctokit } from '@actions/github';
import { readFileSync, writeFileSync } from 'fs';

// main
async function run() {
    try {
        const octokit = new getOctokit(getInput('token'));

        const ref = getInput('source-ref');

        const repositoryAndOwner = getInput('source-repository').split('/');
        const owner = repositoryAndOwner[0];
        const repo = repositoryAndOwner[1]

        let configurationFiles = getInput('actions-configuration-files');
        configurationFiles = configurationFiles.split(',');

        configurationFiles.forEach(file => {
            let fileName = file.includes('/') ? file.substring(file.lastIndexOf('/') + 1, file.length) : file;
            let filePath = './.github/workflows/' + fileName;

            octokit.rest.repos.getContent({ owner: owner, repo: repo, path: file, ref: ref, headers: { 'Accept': 'application/vnd.github.v3.raw' } }).then(response => {
                let current = readFileSync(filePath);

                if (current != response.data) {
                    writeFileSync(filePath, response.data);
                    setOutput('updated', 'true');
                }
            }).catch(error => setFailed('Cannot resolve `' + fileName + '` in target branch! ErrMsg => ' + error));
        });
    } catch (error) {
        setFailed(error.message);
    }
}

// start the action
run();
