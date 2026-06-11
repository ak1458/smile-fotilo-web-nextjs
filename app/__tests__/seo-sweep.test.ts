/**
 * SEO sweep contract: structured data present where it earns rich results,
 * dead components removed.
 */
import fs from 'fs';
import path from 'path';

const read = (rel: string) =>
  fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
const exists = (rel: string) => fs.existsSync(path.join(process.cwd(), rel));

describe('home page structured data', () => {
  it('exposes FAQPage schema sourced from the same HOME_FAQS the visitor sees', () => {
    const src = read('app/page.tsx');
    expect(src).toContain('faqSchema');
    expect(src).toContain('HOME_FAQS');
  });
});

describe('dead code', () => {
  it('the never-rendered Breadcrumbs component is gone', () => {
    expect(exists('app/components/Breadcrumbs.tsx')).toBe(false);
  });
});
