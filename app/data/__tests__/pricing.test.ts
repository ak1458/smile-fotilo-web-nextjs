/**
 * Pricing single-source-of-truth contract.
 *
 * History: the home FAQ advertised ₹15,999/15k/35k while the pricing section
 * said ₹25k/65k/1.25L on the same page. These tests pin every price mention
 * to app/data/pricing.ts so the contradiction cannot return.
 */
import fs from 'fs';
import path from 'path';

import {
  PRICING,
  PRICING_FACTS,
  HOME_FAQS,
} from '../pricing';

const read = (rel: string) =>
  fs.readFileSync(path.join(process.cwd(), rel), 'utf8');

describe('pricing data module', () => {
  it('exposes the three project plans with current prices', () => {
    const titles = PRICING.project.plans.map((p) => p.title);
    expect(titles).toEqual(['Launch', 'Growth', 'Premium']);
    const prices = PRICING.project.plans.map((p) => p.price);
    expect(prices).toEqual(['₹25,000', '₹65,000', '₹1,25,000+']);
  });

  it('exposes the three autopilot plans with current prices', () => {
    const prices = PRICING.autopilot.plans.map((p) => p.price);
    expect(prices).toEqual(['₹20,000', '₹12,000', '₹30,000']);
  });

  it('publishes facts used by FAQ, Echo, and schema', () => {
    expect(PRICING_FACTS.websiteFrom).toBe('₹25,000');
    expect(PRICING_FACTS.growthFrom).toBe('₹65,000');
    expect(PRICING_FACTS.autopilotMonthly).toBe('₹12,000');
  });

  it('home FAQ pricing answer is derived from PRICING_FACTS', () => {
    const pricingFaq = HOME_FAQS.find((f) =>
      f.question.toLowerCase().includes('cost'),
    );
    expect(pricingFaq).toBeDefined();
    expect(pricingFaq!.answer).toContain(PRICING_FACTS.websiteFrom);
    expect(pricingFaq!.answer).not.toContain('15,999');
  });
});

describe('no stray price literals outside pricing.ts', () => {
  const consumers = [
    'app/HomePageClient.tsx',
    'app/actions/chat.ts',
    'app/components/ChatSupport.tsx',
  ];

  it.each(consumers)('%s contains no stale ₹15,999/15k/35k pricing', (file) => {
    const src = read(file);
    expect(src).not.toMatch(/15,?999/);
    expect(src).not.toMatch(/INR 15k/i);
    expect(src).not.toMatch(/INR 35k/i);
  });

  it('HomePageClient pulls plans from the pricing module instead of inline literals', () => {
    const src = read('app/HomePageClient.tsx');
    expect(src).toMatch(/from ['"].\/data\/pricing['"]/);
  });
});

describe('trust purge regression guards', () => {
  it('home hero no longer renders the auto review badge', () => {
    const src = read('app/HomePageClient.tsx');
    expect(src).not.toContain('118 Google reviews');
  });

  it('organization schema carries no third-party aggregateRating', () => {
    const src = read('app/components/JsonLd.tsx');
    expect(src).not.toContain('aggregateRating');
  });

  it('footer carries no AI-content disclosure', () => {
    const src = read('app/components/Footer.tsx');
    expect(src).not.toMatch(/AI-assisted, human-reviewed/i);
  });

  it('portfolio page shows neither review counts nor GitHub star counts', () => {
    const dir = path.join(process.cwd(), 'app/portfolio');
    const walk = (d: string): string[] =>
      fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
        const p = path.join(d, e.name);
        if (e.isDirectory()) return e.name === '__tests__' ? [] : walk(p);
        return /\.(tsx?|css)$/.test(e.name) ? [fs.readFileSync(p, 'utf8')] : [];
      });
    const src = walk(dir).join('\n');
    expect(src).not.toContain('118 Google reviews');
    expect(src).not.toContain('stargazers_count');
  });

  it('location pages no longer render the auto-generated GMB feed', () => {
    for (const f of [
      'app/locations/gonda/GondaPageClient.tsx',
      'app/locations/ayodhya/AyodhyaPageClient.tsx',
      'app/locations/greater-noida/GreaterNoidaPageClient.tsx',
    ]) {
      expect(read(f)).not.toContain('GmbUpdates');
    }
  });
});
