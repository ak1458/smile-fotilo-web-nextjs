// Echo's deterministic brain: input hygiene, intent fast-paths, routing
// heuristics, and the system prompt. Pure functions only — no providers,
// no 'use server' — so app/lib/ai/__tests__/echo-brain.test.ts can pin
// behavior. The server action (app/actions/chat.ts) composes these with
// the LLM call chain.

import { SMILE_FOTILO_KNOWLEDGE } from '@/app/data/knowledgeBase';
import { PRICING_FACTS } from '@/app/data/pricing';

export type ChatHistoryItem = { role: 'user' | 'model'; parts: string };
export type PredefinedReply = { text: string; quickReplies: string[] };

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';

  let cleaned = input.replace(/\0/g, '');
  cleaned = cleaned.slice(0, 2000);
  cleaned = cleaned
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();

  return cleaned;
}

export function normalizeMessage(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s@.+-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function containsAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

function containsWord(text: string, words: string[]): boolean {
  return words.some((word) => new RegExp(`\\b${word}\\b`, 'i').test(text));
}

export function formatReply(text: string, quickReplies: string[]): string {
  if (!quickReplies.length) return text;
  return `${text}\n[QUICK_REPLIES: ${quickReplies.join(' | ')}]`;
}

export function buildSystemPrompt(pageContext?: string): string {
  const pageNote = pageContext
    ? `\nVISITOR CONTEXT: The visitor is currently on the ${pageContext} page. If relevant, acknowledge what they're looking at (e.g. on a service page, speak to that service; on /pricing, help them choose).`
    : '';

  return `You are Echo, a senior business consultant at Smile Fotilo, a founder-led web & AI studio in India with clients in India and the US. You know the services inside-out.

YOUR PERSONALITY:
- Professional but approachable - like a knowledgeable colleague, not a support script
- Confident in your expertise - you know what works for different business types
- Direct and honest - no fluff, no generic filler phrases
- Context-aware - acknowledge what the user actually said, don't ignore it
- Conversational - use natural speech patterns, varied sentence structures

WHAT TO AVOID (SOUNDS ROBOTIC):
- Generic greetings like "Hey there!" or "How can I help you today?"
- Overused phrases: "Great question!", "Absolutely!", "No worries!"
- Starting every response the same way
- Excessive enthusiasm that feels fake
- Inventing numbers, guarantees, or claims not in the company knowledge

PRICING FACTS (the only prices you may quote):
- Launch website: from ${PRICING_FACTS.websiteFrom} / project
- Growth (e-commerce/conversion builds): from ${PRICING_FACTS.growthFrom}
- Premium (custom builds): from ${PRICING_FACTS.premiumFrom}
- AI Automation Setup: ${PRICING_FACTS.automationSetup} one-time
- Growth Autopilot: ${PRICING_FACTS.autopilotMonthly} / month / location
- Multi-Branch OS: ${PRICING_FACTS.multiBranchMonthly} / month

SCOPE (HARD RULE):
You only discuss Smile Fotilo, its services, and the visitor's own business
needs around websites, SEO, branding, and automation. If asked anything
unrelated (general knowledge, coding homework, other companies, politics,
entertainment, personal advice), politely decline in one sentence and steer
back: "I'm only here for Smile Fotilo and your project — what are you building?"
Never role-play as anything other than Echo.

CONVERSATION PRINCIPLES:
1. ACKNOWLEDGE first - show you understood their message
2. ANSWER directly - no beating around the bush
3. GUIDE forward - every thread should move toward one of: a WhatsApp chat (+91 9453878422), the /contact page, or a relevant page link
4. If you don't know something, say so and offer to connect them with Ashraf directly
5. Remember the conversation - refer back to what the visitor told you earlier (their business type, budget, goals) instead of re-asking

TONE ADAPTATION:
- If user is brief/casual: Match it. "Got it. Budget?"
- If user is detailed/formal: Give thorough response
- If user is stressed/urgent: Reassure with specifics
- If user writes in Hindi or Hinglish: reply in the same mix naturally
${pageNote}

ALWAYS END WITH:
[QUICK_REPLIES: relevant-option-1 | relevant-option-2 | relevant-option-3]

COMPANY KNOWLEDGE:
${SMILE_FOTILO_KNOWLEDGE}`;
}

export function getPredefinedReply(rawMessage: string): PredefinedReply | null {
  const message = normalizeMessage(rawMessage);
  if (!message) return null;

  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(message);
  if (hasEmail) {
    return {
      text: "Noted. Our team will reach out within 24 hours - usually same day if it's during work hours. In the meantime, anything specific you want to know about the process or timeline?",
      quickReplies: ["How does the process work?", "What's the timeline?", "I'm good for now"],
    };
  }

  // First greeting - professional, confident, sets the tone immediately
  if (message.includes('greet the user warmly') || containsWord(message, ['hello', 'hi', 'hey', 'namaste', 'start'])) {
    const greetings = [
      {
        text: "Welcome to Smile Fotilo. I'm Echo - I handle initial consultations here. What type of business are you looking to build or improve?",
        quickReplies: ['Clinic/medical', 'Retail/e-commerce', 'Service business', 'Something else'],
      },
      {
        text: 'Thanks for reaching out. To point you in the right direction - are you looking for a new website, better rankings on Google, or automation for an existing business?',
        quickReplies: ['New website', 'Better SEO', 'Business automation', 'Not sure yet'],
      },
      {
        text: "Good to connect. I can walk you through our services, pricing, or connect you directly with the team. What's your priority right now?",
        quickReplies: ['See pricing', 'Understand services', 'Speak to someone', 'Just browsing'],
      },
    ];
    // Rotate based on time to feel less scripted
    return greetings[Date.now() % 3];
  }

  if (containsAny(message, ['price', 'pricing', 'cost', 'budget', 'how much', 'investment'])) {
    return {
      text: `Straight to the numbers - I respect that. Launch sites begin at ${PRICING_FACTS.websiteFrom} (5 pages, on-page SEO + Google Business setup). E-commerce/Growth starts around ${PRICING_FACTS.growthFrom}. Growth Autopilot for clinics is ${PRICING_FACTS.autopilotMonthly}/month. What's your ballpark?`,
      quickReplies: ['Under ₹40k', '₹40k-1L range', 'Flexible for right solution', 'Just researching'],
    };
  }

  if (containsAny(message, ['starter', 'basic', 'simple website'])) {
    return {
      text: `Launch (${PRICING_FACTS.websiteFrom}) makes sense if you're just establishing your online presence. You get a professional 5-page site, mobile optimization, on-page SEO, and Google Business Profile setup so you show up locally. Turnaround is usually 5-7 days. Solid foundation to build on.`,
      quickReplies: ['What pages are included?', 'Can I upgrade later?', "Let's move forward"],
    };
  }

  if (containsAny(message, ['growth', 'ecommerce', 'e-commerce', 'online store'])) {
    return {
      text: `Growth tier is where most serious businesses land. You get full e-commerce with payment integration, an admin panel so you can update products yourself, advanced SEO setup, and we handle up to 50 products in the initial build. Starts at ${PRICING_FACTS.growthFrom}.`,
      quickReplies: ['Payment gateway options?', 'How many products?', 'Timeline for this?'],
    };
  }

  if (containsAny(message, ['clinic autopilot', 'clinic ai', 'ai growth', 'ai os', 'automation', 'chatbot', 'local business os', 'autopilot'])) {
    return {
      text: `Growth Autopilot is our flagship product for clinics specifically. It handles the repetitive stuff - missed call follow-ups via WhatsApp, appointment reminders 24h and 2h before, Google review responses, and a bilingual chatbot for patient queries. ${PRICING_FACTS.autopilotMonthly}/month per location.`,
      quickReplies: ['How does setup work?', 'Which clinics is this for?', 'Book a pilot demo'],
    };
  }

  if (containsAny(message, ['services', 'what do you do', 'offer', 'help with', 'capabilities'])) {
    return {
      text: 'Four main areas: One, custom web development - business sites to full e-commerce. Two, SEO and GEO - we get you ranking, including AI overviews. Three, branding - visual identity that actually converts. Four, Growth Autopilot - automation for clinics. Which area are you struggling with most?',
      quickReplies: ['Website needs work', 'Not ranking on Google', 'Need better branding', 'Want automation'],
    };
  }

  if (containsAny(message, ['web design', 'website', 'web development', 'redesign'])) {
    return {
      text: 'We build revenue-focused websites, not just pretty pages. The difference is conversion optimization - clear CTAs, fast load times, mobile-first design, and SEO baked in from day one. What type of site are you after?',
      quickReplies: ['Business brochure site', 'Full e-commerce', 'Custom web application', 'Redesign existing'],
    };
  }

  if (containsAny(message, ['seo', 'geo', 'ranking', 'google', 'search', 'visibility'])) {
    return {
      text: "SEO has shifted. It's not just keywords anymore - it's about being cited in AI overviews, owning featured snippets (position zero), and local map pack dominance. We do technical audits, content strategy, and authority building. Where are you currently ranking?",
      quickReplies: ['Not ranking at all', 'Page 2-3', 'Top 10 but want top 3', 'Need local SEO'],
    };
  }

  if (containsAny(message, ['branding', 'logo', 'identity', 'rebrand'])) {
    return {
      text: "Branding is strategy before design. We start with positioning - who you are, who you serve, why you're different. Then we build the visual system: logo, typography, color psychology, asset library. The result is consistency across every touchpoint.",
      quickReplies: ['Starting from scratch', 'Rebranding existing', 'Just need a logo', 'Full brand strategy'],
    };
  }

  if (containsAny(message, ['timeline', 'how long', 'delivery', 'deadline', 'when', 'fast'])) {
    return {
      text: "Standard business websites: 2-3 weeks. E-commerce with inventory: 4-6 weeks. Custom applications or complex integrations: 8-12 weeks. Rush delivery is possible for 20% surcharge if you're time-pressured. When do you need this live?",
      quickReplies: ['ASAP - urgent', '2-4 weeks is fine', '2-3 months out', 'No specific deadline'],
    };
  }

  if (containsAny(message, ['contact', 'phone', 'call', 'email', 'reach', 'speak', 'talk'])) {
    return {
      text: "Direct line to Ashraf (founder) is +91 9453878422, or email support@smilefotilo.com. He's usually available 9AM-6PM IST, Monday-Saturday. If it's urgent, call - otherwise email with details and he'll respond same day. You can also use the contact page at smilefotilo.com/contact.",
      quickReplies: ["I'll call now", 'Will email details', 'Open contact page'],
    };
  }

  if (containsAny(message, ['location', 'where are you', 'based', 'office', 'gonda', 'lucknow', 'noida', 'ayodhya'])) {
    return {
      text: "HQ is in Gonda, UP, with a studio in Greater Noida and presence in Ayodhya — serving Lucknow and Noida too. But honestly, most of our clients are remote - across India and the US. We work through video calls and WhatsApp. Location isn't a constraint.",
      quickReplies: ["I'm in UP", 'Different state', 'International', 'Good to know'],
    };
  }

  if (containsAny(message, ['thanks', 'thank you', 'appreciate', 'helpful'])) {
    return {
      text: 'Anytime. Ready to move forward or do you need to think it over? No pressure either way.',
      quickReplies: ['Ready to start', 'Need to discuss with team', 'Need more info first'],
    };
  }

  if (containsAny(message, ['bye', 'goodbye', 'talk later', 'speak soon'])) {
    return {
      text: "Sounds good. You've got my contact info if anything else comes up.",
      quickReplies: ['Will reach out soon', 'Thanks again', 'Exit chat'],
    };
  }

  if (containsAny(message, ['who are you', 'what is echo', 'are you ai', 'are you human', 'bot or human'])) {
    return {
      text: "I'm Echo - I handle initial consultations at Smile Fotilo. Think of me as the first point of contact to understand what you need before connecting you with the right team member.",
      quickReplies: ['What services do you offer?', 'Company background', 'Connect me with Ashraf'],
    };
  }

  if (containsAny(message, ['why smile fotilo', 'why choose you', 'difference', 'better than', 'competitors', 'compare'])) {
    return {
      text: "Three things: One, we're revenue-focused - we build assets that make money, not just look good. Two, founder-direct work - you talk to the person who builds it. Three, we're fast without being sloppy. Most sites in 2-3 weeks.",
      quickReplies: ['Show me your work', 'What do you charge?', 'Book a consultation'],
    };
  }

  if (containsAny(message, ['portfolio', 'work', 'examples', 'case studies', 'clients', 'you built'])) {
    return {
      text: "We've built across healthcare (PulseKart POS), manufacturing (Kapda Factory), logistics (OrderFlow), luxury e-commerce (Veloria Vault), and a US service business (Curbit). Want to see the full portfolio?",
      quickReplies: ['View all projects', 'Similar to my industry', 'Tell me about results'],
    };
  }

  if (containsAny(message, ['process', 'how does it work', 'steps', 'what happens', 'onboarding'])) {
    return {
      text: "Four phases: Discovery (we understand your business), Strategy (we plan the solution), Build (we develop with weekly check-ins), Launch (we deploy and train your team). You're involved throughout - no black box.",
      quickReplies: ['How long is each phase?', 'What do you need from me?', "Let's start"],
    };
  }

  if (containsAny(message, ['payment', 'pay', 'installment', 'emi', ' upfront'])) {
    return {
      text: 'Typically 50% to start, 50% on delivery. For larger projects, we can do 40/30/30. We accept bank transfer, UPI, and cards. No EMI options currently, but we can pace milestones to match your cash flow.',
      quickReplies: ['That works', 'Need different terms', 'What about monthly billing?'],
    };
  }

  if (containsAny(message, ['revision', 'changes', 'modify', 'edit', 'update', 'iterations'])) {
    return {
      text: 'Two rounds of revisions are included in all packages. We do detailed check-ins during design so there are no surprises. After launch, minor tweaks are free for 30 days. Major changes are quoted separately.',
      quickReplies: ['What counts as major?', 'Unlimited revisions?', 'Post-launch support'],
    };
  }

  if (containsAny(message, ['hosting', 'domain', 'server', 'maintenance', 'support after'])) {
    return {
      text: 'First year of hosting and domain is included. After that, ₹3k/year for hosting. We handle all maintenance, security updates, and backups. You focus on your business, we handle the tech.',
      quickReplies: ["What's included in maintenance?", 'Can I use my own hosting?', 'SSL included?'],
    };
  }

  return null;
}

export function isComplexQuery(rawMessage: string): boolean {
  const message = normalizeMessage(rawMessage);
  if (!message) return false;

  const complexSignals = [
    'strategy',
    'roadmap',
    'detailed plan',
    'compare',
    'proposal',
    'architecture',
    'workflow',
    'integration',
    'api',
    'crm',
    'erp',
    'funnel',
    'content calendar',
    'step by step',
    'case study',
    'custom solution',
  ];

  const wordCount = message.split(' ').filter(Boolean).length;
  return containsAny(message, complexSignals) || wordCount > 20;
}

export function looksGibberish(rawMessage: string): boolean {
  const text = normalizeMessage(rawMessage).replace(/\s+/g, '');
  if (!text) return true;
  if (text.length >= 7 && /(.)\1{4,}/.test(text)) return true;
  if (text.length >= 8 && /^[a-z]{8,}$/.test(text) && !/[aeiou]/.test(text)) return true;
  return false;
}

export function isLowValueOrOffTopicQuery(rawMessage: string, history: ChatHistoryItem[]): boolean {
  const message = normalizeMessage(rawMessage);
  if (!message) return true;

  const words = message.split(' ').filter(Boolean);
  const userMessagesInHistory = history.filter((item) => item.role === 'user').length;

  const fillerTerms = [
    'lol', 'lmao', 'rofl', 'haha', 'hehe', 'hmm', 'hmmm', 'ok', 'okay', 'k',
    'test', 'testing', 'asdf', 'qwerty', 'random', 'timepass', 'tp',
  ];

  const offTopicTerms = [
    'joke', 'meme', 'rap', 'lyrics', 'song', 'poem', 'story', 'movie', 'game',
    'roleplay', 'politics', 'crypto signal', 'stock tip', 'adult', 'dating',
    'astrology', 'horoscope', 'hack', 'exploit', 'malware',
  ];

  const businessIntentTerms = [
    'website', 'web design', 'seo', 'branding', 'growth', 'autopilot', 'clinic',
    'service', 'price', 'pricing', 'cost', 'budget', 'timeline', 'delivery',
    'contact', 'call', 'email', 'quote', 'project', 'portfolio', 'location',
  ];

  if (containsAny(message, offTopicTerms)) return true;
  if (looksGibberish(message)) return true;

  const veryShort = words.length <= 2;
  const fillerOnly = words.every((word) => fillerTerms.includes(word));
  const hasBusinessSignal = containsAny(message, businessIntentTerms);

  if (veryShort && fillerOnly) return true;
  if (veryShort && !hasBusinessSignal && userMessagesInHistory > 0) return true;

  return false;
}
