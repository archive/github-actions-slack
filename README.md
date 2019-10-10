# github-actions-slack

## How to use

Required
_slack-bot-user-oauth-access-token_
_slack-channel_
_slack-text_

.github/workflows
slack-notifications.yml

```
name: slack-notifications

on: [push, pull_request, issues]

jobs:
  slack-notifications:
    runs-on: ubuntu-latest
    name: Notify us on slack when we have new PR or Issues
    steps:
    - name: Notify
      id: notify
      uses: archive/github-actions-slack@master
      with:
        slack-bot-user-oauth-access-token: ${{ secrets.SLACK_BOT_USER_OAUTH_ACCESS_TOKEN }}
        slack-channel: test-temp
        slack-text: Hello! We have a ${{ github.event_name }} on ${{ github.repository }}
    - name: Result from Notify
      run: echo "The status was ${{ steps.notify.outputs.slack-result }}"
```

https://api.slack.com/methods/chat.postMessage
