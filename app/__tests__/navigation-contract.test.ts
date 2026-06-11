/**
 * Navigation contract.
 *
 * History: there was no /contact page — every Contact link pointed at the
 * /#contact home anchor, which warps cross-page visitors to the homepage.
 * Desktop nav also carried two competing portfolio entries and anchor links.
 * These tests pin the restructured navigation.
 */
import fs from 'fs';
import path from 'path';

const read = (rel: string) =>
  fs.readFileSync(path.join(process.cwd(), rel), 'utf8');

const exists = (rel: string) => fs.existsSync(path.join(process.cwd(), rel));

describe('/contact page', () => {
  it('exists as a route', () => {
    expect(exists('app/contact/page.tsx')).toBe(true);
  });

  it('is not shadowed by the legacy WP redirect to /about', () => {
    const config = read('next.config.ts');
    const redirectsBlock = config.slice(config.indexOf('async redirects'));
    // The old rule { source: '/contact', destination: '/about' } must be gone.
    expect(redirectsBlock).not.toMatch(/source:\s*'\/contact\/?',\s*\n\s*destination:\s*'\/about'/);
  });
});

describe('NavBar', () => {
  const src = read('app/components/NavBar.tsx');

  it('offers a non-WhatsApp primary CTA to /contact', () => {
    expect(src).toContain('/contact');
  });

  it('keeps Portfolio out of the trimmed desktop bar (one proof surface: Work)', () => {
    const desktopBlock = src.slice(
      src.indexOf('const primaryNav'),
      src.indexOf('];', src.indexOf('const primaryNav')),
    );
    expect(desktopBlock).not.toContain('/portfolio');
    expect(desktopBlock).toContain('/services');
    expect(desktopBlock).toContain('/work');
  });

  it('mobile menu links to Contact and Locations', () => {
    const mobileBlock = src.slice(
      src.indexOf('const menuItems'),
      src.indexOf('];', src.indexOf('const menuItems')),
    );
    expect(mobileBlock).toContain('/contact');
    expect(mobileBlock).toContain('/locations');
  });
});

describe('cross-page contact links use the real page, not the home anchor', () => {
  it.each([
    'app/components/MobileBottomNav.tsx',
    'app/components/Footer.tsx',
    'app/blog/BlogPageClient.tsx',
    'app/portfolio/PortfolioPageClient.tsx',
  ])('%s has no /#contact link', (file) => {
    expect(read(file)).not.toContain('/#contact');
  });
});

describe('home page journeys', () => {
  const src = read('app/HomePageClient.tsx');

  it('does not funnel visitors into the noindexed marketplace', () => {
    expect(src).not.toContain('/marketplace');
  });

  it('"See Client Results" goes to the case-study hub, not a home anchor', () => {
    expect(src).not.toMatch(/href="#work"/);
  });
});

describe('button labels match destinations', () => {
  it('AI OS section no longer promises a "Blueprint" while linking to the clinic page', () => {
    expect(read('app/components/AILocalBusinessOS.tsx')).not.toContain(
      'Explore Growth Blueprint',
    );
  });
});
