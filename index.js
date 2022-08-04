const core = require('@actions/core');
const github = require('@actions/github');
// import fetch from 'node-fetch'

try {
    const application = core.getInput('application');
    const branch = core.getInput('branch');
    const triggeredBy = core.getInput('triggeredBy');
    const message = core.getInput('message');
    console.log(application, branch, triggeredBy, message);
    console.log(JSON.stringify(github.context, undefined, 2));
} catch (error) {
    core.setFailed(error.message);
}