import core from '@actions/core'
import github from '@actions/github'
import fetch from 'node-fetch'

const main = async () => {
    try {
        const dtAccessToken = core.getInput('dt-access-token');
        const application = core.getInput('application');
        const branch = core.getInput('branch');
        const triggeredBy = core.getInput('triggeredBy');
        const message = core.getInput('message');

        const response = await fetch("https://api.deploytracker.io/notify", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "dt-access-token": dtAccessToken,
            },
            body: JSON.stringify({
                application,
                triggeredBy,
                branch,
                message,
                version: "1.0.0",
                status: "SUCCESS",
            }),
        });
        console.log(response);
    } catch (error) {
        core.setFailed(error.message);
    }
}

main()
