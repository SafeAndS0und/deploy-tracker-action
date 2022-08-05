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

const getJobUrl = (repoUrl, runId) => {
  if (!repoUrl || !runId) {
    return
  }
  return repoUrl + '/actions/runs/' + runId
}

// https://docs.github.com/en/actions/learn-github-actions/contexts#job-context
const translateJobStatus = (str) => {
  switch (str) {
    case "success":
      return "SUCCESS"
    case "failure":
      return "FAILURE"
    case "cancelled":
      return "CANCELLED"
    default:
      return str
  }
}

const getInputValue = (field, fallback) => {
  const value = core.getInput(field)

  if (value === '-') {
    return undefined
  }

  return value || fallback || undefined
}

const main = async () => {
  try {
    const dtAccessToken = core.getInput('dt-access-token');

    const body = {
      application: getInputValue('application', github.context.payload.repository.name),
      status: translateJobStatus(getInputValue('status', 'SUCCESS')),
      environment: getInputValue('environment'),
      message: getInputValue('message', github.context.payload?.head_commit?.message || github.context.payload?.commits?.[0]?.message) ,
      triggeredBy: getInputValue('triggeredBy', github.context.actor),
      branch: getInputValue('branch', getBranchName(github.context.ref)) ,
      version: getInputValue('version', getVersionFromTag(github.context.ref)) ,
      ticket: getInputValue('ticket') ,
      jobUrl: getInputValue('jobUrl', getJobUrl(github.context.payload.repository.html_url, github.context.runId) || github.context.payload?.head_commit?.url),
      jobId: getInputValue('jobId', github.context.runId.toString()),
      tags: handleArrayValue(getInputValue('tags')),
      teams: handleArrayValue(getInputValue('teams')),
      silent: handleBooleanValue(getInputValue('silent')),
      ephemeral: handleBooleanValue(getInputValue('ephemeral')),
    }

    console.log(body)

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
