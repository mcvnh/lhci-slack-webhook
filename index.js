const core = require('@actions/core');
const fetch = require('node-fetch');

const start = async function () {
  try {
    const webhook = core.getInput('slack_webhook')
    const manifest = JSON.parse(core.getInput('manifest'));

    const summary = manifest.map((it) => {
      return [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Page: ${it.url}`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Performance*: ${it.summary.performance}, *Accessibility*: ${it.summary.accessibility}, *Best Practices*: ${it.summary["best-practices"]} , *SEO*: ${it.summary.seo}, *PWA*: ${it.summary.pwa}`
          }
        },
        {
          type: "divider"
        },
      ]
    }).flatMap((it) => [...it]);

    const slackBody = { blocks: summary }

    const resp = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slackBody),
    });

    console.log(resp);
  } catch (error) {
    core.setFailed(error.message);
  }
}

start();