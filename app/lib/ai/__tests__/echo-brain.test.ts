/**
 * Echo assistant golden tests.
 *
 * The fast-path (predefined replies) and the system prompt are the parts of
 * Echo we fully control — these tests pin their behavior: prices come from
 * app/data/pricing.ts, contact details are correct, junk gets filtered, and
 * the prompt carries page context.
 */
import {
  getPredefinedReply,
  buildSystemPrompt,
  isLowValueOrOffTopicQuery,
  isComplexQuery,
  formatReply,
} from '../echo-brain';
import { PRICING_FACTS } from '../../../data/pricing';

describe('golden replies: pricing always matches the pricing module', () => {
  it.each([
    'how much does a website cost',
    'what is your pricing',
    'whats the cost?',
    'budget kitna lagega for website',
  ])('"%s" quotes the canonical Launch price', (q) => {
    const reply = getPredefinedReply(q);
    expect(reply).not.toBeNull();
    expect(reply!.text).toContain(PRICING_FACTS.websiteFrom);
  });

  it('autopilot question quotes the canonical monthly price', () => {
    const reply = getPredefinedReply('tell me about clinic autopilot');
    expect(reply).not.toBeNull();
    expect(reply!.text).toContain(PRICING_FACTS.autopilotMonthly);
  });

  it('e-commerce question quotes the canonical Growth price', () => {
    const reply = getPredefinedReply('I want an online store');
    expect(reply).not.toBeNull();
    expect(reply!.text).toContain(PRICING_FACTS.growthFrom);
  });
});

describe('golden replies: routing and contact', () => {
  it('contact intent returns the real phone and email', () => {
    const reply = getPredefinedReply('how can I contact you');
    expect(reply!.text).toContain('+91 9453878422');
    expect(reply!.text).toContain('support@smilefotilo.com');
  });

  it('portfolio intent offers the work page', () => {
    const reply = getPredefinedReply('show me examples of your work');
    expect(reply).not.toBeNull();
    expect(reply!.quickReplies.length).toBeGreaterThanOrEqual(2);
  });

  it('greeting gets a consultative opener with quick replies', () => {
    const reply = getPredefinedReply('hello');
    expect(reply).not.toBeNull();
    expect(reply!.quickReplies.length).toBeGreaterThanOrEqual(3);
  });

  it('unknown business question falls through to the AI (null)', () => {
    expect(
      getPredefinedReply('can you integrate my inventory system with tally and build a dealer portal'),
    ).toBeNull();
  });
});

describe('junk filtering', () => {
  it.each(['asdf', 'lol', 'tell me a joke', 'qqqqqqqqq'])(
    '"%s" is treated as low value/off topic',
    (q) => {
      expect(isLowValueOrOffTopicQuery(q, [])).toBe(true);
    },
  );

  it('real business questions are never filtered', () => {
    expect(isLowValueOrOffTopicQuery('website price for my clinic', [])).toBe(false);
  });
});

describe('complexity routing', () => {
  it('integration/architecture questions route to the reasoning model', () => {
    expect(isComplexQuery('I need a CRM integration with custom workflow')).toBe(true);
  });
  it('simple questions stay on the fast model', () => {
    expect(isComplexQuery('price?')).toBe(false);
  });
});

describe('system prompt', () => {
  it('carries canonical pricing facts', () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain(PRICING_FACTS.websiteFrom);
    expect(prompt).toContain(PRICING_FACTS.autopilotMonthly);
  });

  it('injects page context so Echo knows where the visitor is', () => {
    const prompt = buildSystemPrompt('/services/web-design');
    expect(prompt).toContain('/services/web-design');
  });

  it('stays grounded — no invented review counts', () => {
    expect(buildSystemPrompt()).not.toContain('118');
  });
});

describe('formatReply', () => {
  it('appends quick replies in the parseable format', () => {
    expect(formatReply('Hi', ['A', 'B'])).toBe('Hi\n[QUICK_REPLIES: A | B]');
  });
});
