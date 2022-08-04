import core from '@actions/core'
import github from '@actions/github'
import fetch from 'node-fetch'

const main = async () => {
    try {
        const dtAccessToken = core.getInput('dt-access-token');
        const application = core.getInput('application');
        const status = core.getInput('status');
        const environment = core.getInput('environment');
        const message = core.getInput('message');
        const triggeredBy = core.getInput('triggeredBy');
        const branch = core.getInput('branch');
        const version = core.getInput('version');
        const ticket = core.getInput('ticket');
        const jobUrl = core.getInput('jobUrl');
        const jobId = core.getInput('jobId');
        const tags = core.getInput('tags');
        const teams = core.getInput('teams');
        const silent = core.getInput('silent');
        const ephemeral = core.getInput('ephemeral');

        console.log(JSON.stringify(github.context, null, 2));

        const body = {
            application: application || '',
            status: status || 'SUCCESS',
            environment: environment || '',
            message: message || '',
            triggeredBy: triggeredBy || '',
            branch: branch || '',
            version: version || '',
            ticket: ticket || '',
            jobUrl: jobUrl || '',
            jobId: jobId || '',
            tags: tags || '',
            teams: teams || '',
            silent: silent || '',
            ephemeral: ephemeral || '',
        }

        const response = await fetch("https://api.deploytracker.io/notify", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "dt-access-token": dtAccessToken,
            },
            body: JSON.stringify(body),
        })
        console.log(response.status);

    } catch (error) {
        core.setFailed(error.message);
    }
}

main()
