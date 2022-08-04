import core from '@actions/core'
import github from '@actions/github'
import fetch from 'node-fetch'

const notifyDeployTrackerEndpoint = "https://api.deploytracker.io/notify"

const getBranchName = (ref) => {
  if (ref.includes('refs/heads/')) {
    return ref.slice(ref.lastIndexOf('/') + 1)
  }
}

const getVersionFromTag = (ref) => {
  if (ref.includes('refs/tags/')) {
    return ref.slice(ref.lastIndexOf('/') + 1)
  }
}

const handleBooleanValue = (str) => {
  return str && str === 'true' || undefined
}

const handleArrayValue = (str) => {
  return str ? str.split(/[,]+/) : undefined
}

// https://docs.github.com/en/actions/learn-github-actions/contexts#job-context
const translateJobStatus = (str) => {
  switch (str) {
    case "success":
      return "SUCCESS"
    case "failure":
      return "FAILURE"
    case "cancelled":
      return "CANCEL"
    default:
      return undefined
  }
}

const main = async () => {
  try {
    const dtAccessToken = core.getInput('dt-access-token');

    const body = {
      application: core.getInput('application') || github.context.payload.repository.name,
      status: translateJobStatus(core.getInput('status')) || 'SUCCESS',
      environment: core.getInput('environment') || undefined,
      message: core.getInput('message') || github.context.payload?.head_commit?.message || github.context.payload?.commits?.[0]?.message,
      triggeredBy: core.getInput('triggeredBy') || github.context.actor,
      branch: core.getInput('branch') || getBranchName(github.context.ref) || undefined,
      version: core.getInput('version') || getVersionFromTag(github.context.ref) || undefined,
      ticket: core.getInput('ticket') || undefined,
      jobUrl: core.getInput('jobUrl') || github.context.payload?.head_commit?.url,
      jobId: core.getInput('jobId') || github.context.runId.toString(),
      tags: handleArrayValue(core.getInput('tags')),
      teams: handleArrayValue(core.getInput('teams')),
      silent: handleBooleanValue(core.getInput('silent')),
      ephemeral: handleBooleanValue(core.getInput('ephemeral')),
    }

    const response = await fetch(notifyDeployTrackerEndpoint, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "dt-access-token": dtAccessToken,
      },
      body: JSON.stringify(body),
    }).catch(e => console.log(e))


    if (!response.ok) {
      const text = await response.text();
      console.log('Error: ', text)
      console.log('Status: ', response.status)
      console.log('Body: ', body)
      core.setFailed(text);
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

main()
