import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

page.on('response', async (resp) => {
  if (resp.status() >= 400) {
    const req = resp.request();
    const headers = req.headers();
    const postData = req.postData() || '';
    console.log(JSON.stringify({
      status: resp.status(),
      url: resp.url(),
      method: req.method(),
      resourceType: req.resourceType(),
      headers: {
        accept: headers['accept'],
        contentType: headers['content-type'],
        nextAction: headers['next-action'],
        rsc: headers['rsc'],
        nextRouterStateTree: headers['next-router-state-tree'] ? 'present' : undefined,
        origin: headers['origin'],
        referer: headers['referer'],
      },
      postDataPreview: postData.slice(0, 600),
    }, null, 2));
  }
});

await page.goto('https://smilefotilo.com/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(6000);

await context.close();
await browser.close();
