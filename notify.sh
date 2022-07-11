#!/bin/bash

CI_COMMIT_MESSAGE=${CI_COMMIT_MESSAGE//$'\n'/}

echo "$APPLICATION"
echo "$BRANCH"
echo "$TRIGGERED_BY"
echo "$MESSAGE"

generate_post_data()
{
  cat  <<EOF
{
  "environment": "STAGING",
  "application": "$APPLICATION",
  "triggeredBy": "$TRIGGERED_BY",
  "jobUrl": "$CI_JOB_URL",
  "jobId": "$GITHUB_RUN_ID",
  "message": "$MESSAGE",
  "version": "$CI_COMMIT_SHORT_SHA",
  "branch": "$BRANCH",
  "status": "FAILURE"
}
EOF
}

curl --trace-ascii - \
        -b 'dt-access-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI2LCJpYXQiOjE2NTY1OTQzMTMyMDl9.sM9DgzSZlHXUfG1KOWXzH-h1L_2wFymdjTrxKRJqawk' \
        -d "$(generate_post_data)" \
        -H 'Content-Type: application/json' \
        'https://9391-217-173-3-120.eu.ngrok.io/api/notify'