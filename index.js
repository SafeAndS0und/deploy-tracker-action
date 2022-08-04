import core from '@actions/core'
import github from '@actions/github'
// import fetch from 'node-fetch'

try {
    const dtAccessToken = core.getInput('dt-access-token');
    const application = core.getInput('application');
    const branch = core.getInput('branch');
    const triggeredBy = core.getInput('triggeredBy');
    const message = core.getInput('message');
    console.log(dtAccessToken, application, branch, triggeredBy, message);
} catch (error) {
    core.setFailed(error.message);
}