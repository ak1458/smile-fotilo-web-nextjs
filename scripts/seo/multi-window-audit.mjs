// Multi-window GSC + GA4 audit. Run:
//   node --env-file=.env.production.local --env-file=.env.local scripts/seo/multi-window-audit.mjs
import { google } from 'googleapis';

const GSC_SITE = process.env.SEARCH_CONSOLE_SITE_URL || 'sc-domain:smilefotilo.com';
const GA4_PROPERTY = process.env.GA4_PROPERTY_ID || 'properties/418127097';

import fs from 'fs';

function getAuth(scopes) {
  // Prefer a key file (GOOGLE_SA_KEY_FILE or the default GOOGLE_APPLICATION_CREDENTIALS);
  // inline JSON via --env-file gets mangled by quote stripping.
  const keyFile = [process.env.GOOGLE_SA_KEY_FILE, process.env.GOOGLE_APPLICATION_CREDENTIALS]
    .find((p) => p && fs.existsSync(p));
  if (keyFile) return new google.auth.GoogleAuth({ keyFile, scopes });

  const json = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON?.trim();
  if (!json) throw new Error('No service-account credentials found');
  const creds = JSON.parse(json);
  if (typeof creds.private_key === 'string') creds.private_key = creds.private_key.replace(/\\n/g, '\n');
  return new google.auth.GoogleAuth({ credentials: creds, scopes });
}

const day = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
const WINDOWS = [7, 30, 90, 180];

async function gsc() {
  const auth = getAuth(['https://www.googleapis.com/auth/webmasters.readonly']);
  const sc = google.searchconsole({ version: 'v1', auth });
  const q = (body) => sc.searchanalytics.query({ siteUrl: GSC_SITE, requestBody: body }).then((r) => r.data.rows || []);

  const out = { totals: {}, pages90: [], queries90: [], pages30_vs_prior30: {} };

  for (const w of WINDOWS) {
    const rows = await q({ startDate: day(w + 2), endDate: day(2), rowLimit: 1 });
    out.totals[`${w}d`] = rows[0]
      ? { clicks: rows[0].clicks, impressions: rows[0].impressions, ctr: +(rows[0].ctr * 100).toFixed(2), position: +rows[0].position.toFixed(1) }
      : { clicks: 0, impressions: 0 };
  }

  out.pages90 = (await q({ startDate: day(92), endDate: day(2), dimensions: ['page'], rowLimit: 15 }))
    .map((r) => ({ page: r.keys[0].replace('https://smilefotilo.com', ''), clicks: r.clicks, imp: r.impressions, ctr: +(r.ctr * 100).toFixed(1), pos: +r.position.toFixed(1) }));

  out.queries90 = (await q({ startDate: day(92), endDate: day(2), dimensions: ['query'], rowLimit: 20 }))
    .map((r) => ({ q: r.keys[0], clicks: r.clicks, imp: r.impressions, ctr: +(r.ctr * 100).toFixed(1), pos: +r.position.toFixed(1) }));

  const cur = await q({ startDate: day(32), endDate: day(2), dimensions: ['page'], rowLimit: 25 });
  const prior = await q({ startDate: day(62), endDate: day(32), dimensions: ['page'], rowLimit: 25 });
  const priorMap = new Map(prior.map((r) => [r.keys[0], r]));
  out.pages30_vs_prior30 = cur.slice(0, 12).map((r) => {
    const p = priorMap.get(r.keys[0]);
    return {
      page: r.keys[0].replace('https://smilefotilo.com', ''),
      imp: r.impressions, impPrior: p?.impressions ?? 0,
      clicks: r.clicks, clicksPrior: p?.clicks ?? 0,
      pos: +r.position.toFixed(1), posPrior: p ? +p.position.toFixed(1) : null,
    };
  });

  return out;
}

async function ga4() {
  const auth = getAuth(['https://www.googleapis.com/auth/analytics.readonly']);
  const ad = google.analyticsdata({ version: 'v1beta', auth });
  const run = (body) => ad.properties.runReport({ property: GA4_PROPERTY, requestBody: body }).then((r) => r.data);

  const out = { totals: {}, channels90: [], pages90: [] };

  for (const w of WINDOWS) {
    const r = await run({
      dateRanges: [{ startDate: `${w}daysAgo`, endDate: 'yesterday' }],
      metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'conversions' }, { name: 'engagementRate' }],
    });
    const m = r.rows?.[0]?.metricValues || [];
    out.totals[`${w}d`] = {
      sessions: +(m[0]?.value ?? 0), users: +(m[1]?.value ?? 0),
      conversions: +(m[2]?.value ?? 0), engagement: +(+(m[3]?.value ?? 0) * 100).toFixed(1),
    };
  }

  const ch = await run({
    dateRanges: [{ startDate: '90daysAgo', endDate: 'yesterday' }],
    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
    metrics: [{ name: 'sessions' }, { name: 'conversions' }],
    limit: 8,
  });
  out.channels90 = (ch.rows || []).map((r) => ({ channel: r.dimensionValues[0].value, sessions: +r.metricValues[0].value, conv: +r.metricValues[1].value }));

  const pg = await run({
    dateRanges: [{ startDate: '90daysAgo', endDate: 'yesterday' }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'sessions' }, { name: 'engagementRate' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 12,
  });
  out.pages90 = (pg.rows || []).map((r) => ({ page: r.dimensionValues[0].value, sessions: +r.metricValues[0].value, engagement: +(+r.metricValues[1].value * 100).toFixed(1) }));

  return out;
}

const result = {};
try { result.gsc = await gsc(); } catch (e) { result.gsc = { error: e.message }; }
try { result.ga4 = await ga4(); } catch (e) { result.ga4 = { error: e.message }; }
console.log(JSON.stringify(result, null, 1));
