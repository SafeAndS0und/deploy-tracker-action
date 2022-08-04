# Deploy Tracker Action

This action helps to integrate [Deploy Tracker](https://deploytracker.io) with Github Actions.  
Deploy Tracker is a deployment notification and tracking tool, that can reduce noise and spam in your Slack.  
Among other things, Deploy Tracker can help you with:
- Tracking the history of your releases
- Displaying current status of your application deployments
- Customizing your notification messages
- Creating complex [rules](https://deploytracker.io/documentation/web-dashboard/rules) for things such as: mentioning users, silencing notifications or using different Slack channels based on certain properties.

---

![Slack Notifications](https://deploytracker.io/docs/overview/what-is-deploy-tracker/slack-notification-1.png)  

![Deploy Tracker Status And History](https://deploytracker.io/docs/overview/what-is-deploy-tracker/status-and-history.png)  

Few Links: 
- [What is Deploy Tracker?](https://deploytracker.io/documentation/overview/what-is-deploy-tracker)
- [Getting Started](https://deploytracker.io/documentation/overview/getting-started)
- [Integrating with Github Actions](https://deploytracker.io/documentation/api-and-integrations/github-actions)

---

### Example usage:
```yaml 
# your-github-action.yml

name: deploy
on:
  push:

jobs:
  start-deployment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - id: call-dt-public-action
        uses: SafeAndS0und/deploy-tracker-action@1.0.0
        with:
          dt-access-token: ${{ secrets.DT_ACCESS_TOKEN }}
          status: 'START'


  end-deployment:
    runs-on: ubuntu-latest
    needs: start-deployment
    steps:
      - uses: actions/checkout@v3
      - id: call-dt-public-action
        uses: SafeAndS0und/deploy-tracker-action@1.0.0
        with:
          dt-access-token: ${{ secrets.DT_ACCESS_TOKEN }}
          status: ${{ job.status }}
```

### Authorization
To authorize you need to provide `dt-access-token` field, which you can obtain by creating a project in Deploy Tracker. Learn more in [Getting Started](https://deploytracker.io/documentation/overview/getting-started).
We recommend to make use of Github's [action secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) to store the token.

### Inputs
Pretty much all inputs besides the access token have a handy default values assigned using [Github Context](https://docs.github.com/en/actions/learn-github-actions/contexts#job-context). 
You can override any field using the inputs.
Some fields also serve different roles (for example we can deduce ticket by looking for a ticket-id pattern in branch or commit message) 
All of this is better described in the [Deploy Tracker documentation](https://deploytracker.io/documentation/api-and-integrations/notification-parameters).

Also feel free to take a look at the `index.js` to see how the default values are derived from Github context.
 

| field           | default                             | example           | description                                                             |
|-----------------|-------------------------------------|-------------------|-------------------------------------------------------------------------|
| dt-access-token |                                     | eyJhbGciOiJIUz... | Authorizes you and your project                                         |
| application     | context.payload.repository.name     | trading-api       | Name of the deployed application or service                             |
| status          | "SUCCESS"                           | SUCCESS           | Status of the deployment, recommended to use ${{ job.status }} variable |
| environment     |                                     | STAGING           | Environment to which the application is being deployed on               |
| message         | context.payload.head_commit.message | Fixed something   | Message describing changes, usually commit message                      |
| triggeredBy     | context.actor                       | walter.white      | Name of the person who triggered the deployment                         |
| branch          | slice(context.ref) (see index.js)   | DT-1/fixes        | Name of the branch                                                      |
| version         | slice(context.ref) (see index.js)   | 1.2.1             | Version of the application                                              |
| ticket          |                                     | DT-1              | Ticket name or ID - It can be used for detecting and linking tickets    |
| jobUrl          | see index.js                        | https://github... | If provided, will add a hyperlink to the notification                   |
| jobId           | context.runId                       | W2sb4d            |                                                                         |
| tags            |                                     | tag1, tag2        | Comma-separated list of tags associated with the deployment             |
| teams           |                                     | walter, gus.fring | Comma-separated list of teams that are related to this deployment       |
| silent          | false                               | true              | If 'true' (as string), the message won't be sent to Slack               |
| ephemeral       | false                               | true              | If 'true' (as string), the message won't be saved in database           |


Example of overriding certain values:
```yaml
    uses: SafeAndS0und/deploy-tracker-action@1.0.0
    with:
      dt-access-token: ${{ secrets.DT_ACCESS_TOKEN }}
      environment: 'PROD'
      status: ${{ job.status }}
      jobId: ${{ github.run_number }}
```