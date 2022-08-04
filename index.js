import core from '@actions/core'
import github from '@actions/github'
import fetch from 'node-fetch'

const getBranchName = (ref) => {
    if (ref.indexOf('/refs/heads/') > -1) {
        return ref.slice('/refs/heads/'.length);
    }
}

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
            application: application || github.context.payload.repository.name,
            status: status || 'SUCCESS',
            environment: environment || undefined,
            message: message || github.context.payload?.head_commit?.message || github.context.payload?.commits?.[0]?.message,
            triggeredBy: triggeredBy || github.context.actor,
            branch: branch || getBranchName(github.context.ref),
            version: version || undefined,
            ticket: ticket || undefined,
            jobUrl: jobUrl || github.context.payload?.head_commit?.url,
            jobId: jobId || github.context.runId.toString(),
            tags: tags || undefined,
            teams: teams || undefined,
            silent: silent || undefined,
            ephemeral: ephemeral || undefined,
        }

        console.log(body, 'body');

        const response = await fetch("https://api.deploytracker.io/notify", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "dt-access-token": dtAccessToken,
            },
            body: JSON.stringify(body),
        }).catch(e => console.log(e))
        console.log(response.status, 'status');

    } catch (error) {
        core.setFailed(error.message);
    }
}

main()
