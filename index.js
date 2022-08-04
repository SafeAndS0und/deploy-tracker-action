import core from '@actions/core'
import github from '@actions/github'
import fetch from 'node-fetch'

const getBranchName = (ref) => {
  return ref.slice(ref.lastIndexOf('/') + 1)
}

const handleBooleanValue = (str) => {
  return str && str === 'true' || false
}

const handleArrayValue = (str) => {
  return str ? str.split(/[,]+/) : undefined
}

const main = async () => {
  try {
    const dtAccessToken = core.getInput('dt-access-token');

    const body = {
      application: core.getInput('application') || github.context.payload.repository.name,
      status: core.getInput('status') || 'SUCCESS',
      environment: core.getInput('environment') || undefined,
      message: core.getInput('message') || github.context.payload?.head_commit?.message || github.context.payload?.commits?.[0]?.message,
      triggeredBy: core.getInput('triggeredBy') || github.context.actor,
      branch: core.getInput('branch') || getBranchName(github.context.ref) || undefined,
      version: core.getInput('version') || undefined,
      ticket: core.getInput('ticket') || undefined,
      jobUrl: core.getInput('jobUrl') || github.context.payload?.head_commit?.url,
      jobId: core.getInput('jobId') || github.context.runId.toString(),
      tags: handleArrayValue(core.getInput('tags')),
      teams: handleArrayValue(core.getInput('teams')),
      silent: handleBooleanValue(core.getInput('silent')),
      ephemeral: handleBooleanValue(core.getInput('ephemeral')),
    }

    console.log(body, 'body');

    await fetch("https://api.deploytracker.io/notify", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "dt-access-token": dtAccessToken,
      },
      body: JSON.stringify(body),
    }).catch(e => console.log(e))

  } catch (error) {
    core.setFailed(error.message);
  }
}

main()
