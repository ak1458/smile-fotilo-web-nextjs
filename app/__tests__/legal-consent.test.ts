/**
 * Legal & consent contract.
 *
 * History: GA + GTM + conversion tracking fired unconditionally for every
 * visitor — no consent banner, no Consent Mode, no cookie policy. EU/GDPR
 * exposure and nothing to point to from the privacy policy.
 */
import fs from 'fs';
import path from 'path';

const read = (rel: string) =>
  fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
const exists = (rel: string) => fs.existsSync(path.join(process.cwd(), rel));

describe('legal pages', () => {
  it.each(['app/cookie-policy/page.tsx', 'app/disclaimer/page.tsx'])(
    '%s exists',
    (p) => expect(exists(p)).toBe(true),
  );

  it('cookie policy documents the cookies the site actually sets', () => {
    const src = read('app/cookie-policy/page.tsx');
    for (const cookie of ['_ga', 'echo_client_id', 'sf_cookie_consent']) {
      expect(src).toContain(cookie);
    }
  });

  it('footer links all four legal pages', () => {
    const src = read('app/components/Footer.tsx');
    for (const href of ['/privacy', '/terms', '/cookie-policy', '/disclaimer']) {
      expect(src).toContain(`"${href}"`);
    }
  });

  it('legal pages are in the sitemap', () => {
    const sitemap = read('app/sitemap.ts');
    expect(sitemap).toContain('/cookie-policy');
    expect(sitemap).toContain('/disclaimer');
  });
});

describe('cookie consent + Google Consent Mode v2', () => {
  it('a consent banner component exists and is rendered in the root layout', () => {
    expect(exists('app/components/CookieConsent.tsx')).toBe(true);
    expect(read('app/layout.tsx')).toContain('CookieConsent');
  });

  it('analytics defaults all consent signals to denied before any config call', () => {
    const src = read('app/components/GoogleAnalytics.tsx');
    const defaultIdx = src.indexOf("'consent', 'default'");
    const configIdx = src.indexOf("'config'");
    expect(defaultIdx).toBeGreaterThan(-1);
    expect(defaultIdx).toBeLessThan(configIdx);
    for (const signal of ['analytics_storage', 'ad_storage', 'ad_user_data', 'ad_personalization']) {
      expect(src).toContain(signal);
    }
  });

  it('accepting updates consent via gtag consent update', () => {
    const src = read('app/components/CookieConsent.tsx');
    expect(src).toContain("'consent', 'update'");
    expect(src).toContain('sf_cookie_consent');
  });

  it('privacy policy mentions the consent mechanism and cookie policy', () => {
    const src = read('app/privacy/page.tsx');
    expect(src.toLowerCase()).toContain('cookie');
    expect(src).toContain('/cookie-policy');
  });
});
