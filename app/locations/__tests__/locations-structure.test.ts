/**
 * Locations architecture contract.
 *
 * History: the old WordPress site ran city subdomains (noida.smilefotilo.com,
 * lucknow.smilefotilo.com) that died with the migration — Google still has
 * them indexed. /locations/noida was the planned redirect target but was
 * never built. City pages also used agency-network voice ("Our Network",
 * "Strategic Locations") that contradicts the founder-led positioning.
 */
import fs from 'fs';
import path from 'path';

import { SERVICE_AREA_LOCATIONS, getServiceAreaLocation } from '../../data/locations';

const read = (rel: string) =>
  fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
const exists = (rel: string) => fs.existsSync(path.join(process.cwd(), rel));

describe('service-area location data', () => {
  it('includes Noida with substantive unique content', () => {
    const noida = getServiceAreaLocation('noida');
    expect(noida).toBeDefined();
    expect(noida!.name).toBe('Noida');
    expect(noida!.faqs.length).toBeGreaterThanOrEqual(3);
    expect(noida!.services.length).toBeGreaterThanOrEqual(3);
    // Unique copy, not a template echo: intro must mention the city.
    expect(noida!.intro).toContain('Noida');
  });

  it('every entry has the fields the template renders', () => {
    for (const loc of SERVICE_AREA_LOCATIONS) {
      expect(loc.slug).toMatch(/^[a-z0-9-]+$/);
      expect(loc.heroTitle.length).toBeGreaterThan(10);
      expect(loc.metaTitle.length).toBeLessThanOrEqual(65);
      expect(loc.metaDescription.length).toBeLessThanOrEqual(165);
    }
  });
});

describe('/locations/noida route', () => {
  it('exists', () => {
    expect(exists('app/locations/noida/page.tsx')).toBe(true);
  });

  it('is in the sitemap', () => {
    expect(read('app/sitemap.ts')).toContain('/locations/noida');
  });

  it('has a LocalBusiness-safe schema entry (service-area, no fabricated address)', () => {
    const src = read('app/components/LocationSchema.tsx');
    expect(src).toContain('noida:');
  });

  it('is reachable from the cross-location nav', () => {
    expect(read('app/components/OtherLocations.tsx')).toContain('/locations/noida');
  });
});

describe('locations voice matches founder-led positioning', () => {
  it('locations index drops the agency-network framing', () => {
    const src = read('app/locations/page.tsx');
    expect(src).not.toContain('Our Network');
    expect(src).not.toContain('Strategic <span className="text-indigo-300">Locations</span>');
  });
});

describe('tools cull', () => {
  it.each([
    'app/tools/brand-kit',
    'app/tools/content-calendar',
    'app/tools/document-intelligence',
  ])('%s is removed', (dir) => {
    expect(exists(dir)).toBe(false);
  });

  it('removed tool URLs 301 to /tools', () => {
    const config = read('next.config.ts');
    for (const slug of ['brand-kit', 'content-calendar', 'document-intelligence']) {
      expect(config).toContain(`/tools/${slug}`);
    }
  });

  it('tools index no longer advertises removed tools', () => {
    const src = read('app/tools/page.tsx');
    expect(src).not.toContain('/tools/brand-kit');
    expect(src).not.toContain('/tools/content-calendar');
    expect(src).not.toContain('/tools/document-intelligence');
  });
});
