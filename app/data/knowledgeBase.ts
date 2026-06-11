import { PRICING_FACTS } from './pricing';

// Echo's company knowledge. Prices are interpolated from app/data/pricing.ts
// so the assistant can never drift from the published pricing.
export const SMILE_FOTILO_KNOWLEDGE = `
**ABOUT SMILE FOTILO:**
Smile Fotilo is a founder-led web development and digital marketing studio in Gonda, Uttar Pradesh, run by Ashraf Kamal. We build fast, SEO-ready websites, run local SEO, and set up AI automation for clinics, e-commerce, and local businesses across India — and for clients in the US. Direct founder communication, same-day replies, Hindi and English.

**OUR SERVICES:**

1. **Web Design & Development:**
   - Custom Website Design (Next.js, React, WordPress)
   - E-Commerce Solutions (WooCommerce, Shopify, Custom Stacks)
   - Web Applications (dashboards, CRM, booking platforms)
   - Responsive & Mobile-First Design
   - Website Redesigns that preserve SEO

2. **SEO & Digital Growth:**
   - Technical SEO Audits
   - On-Page & Off-Page Optimization
   - Local SEO (Google Business Profile)
   - Content Strategy
   - Google Ads & PPC Management

3. **Branding & Identity:**
   - Logo Design & Visual Identity systems
   - Brand Strategy & Positioning
   - Copywriting & Brand Voice
   - Social Media Branding

4. **AI Automation (Growth Autopilot & AI Local Business OS):**
   - Missed-call recovery via WhatsApp
   - Appointment reminders and review-response workflows
   - Bilingual (Hindi/English) customer-query chatbot
   - Clinic-first, works for any local business

**PRICING PACKAGES:**

- **Launch (${PRICING_FACTS.websiteFrom} / project):**
  - Best for doctors, clinics, local shops getting online.
  - 5-page responsive website
  - On-page SEO setup + Google Business Profile optimization
  - Lead form + WhatsApp CTA

- **Growth (${PRICING_FACTS.growthFrom} / starting):**
  - Best for businesses & small e-commerce.
  - Dynamic pages or online store
  - Conversion-focused UX + performance
  - Advanced SEO & analytics, 3 months support

- **Premium (${PRICING_FACTS.premiumFrom} / custom):**
  - Custom builds with integrations.
  - Custom web app (React/Next.js)
  - Payments / CRM / AI integrations
  - Advanced SEO + delivery roadmap

- **Automation Setup (${PRICING_FACTS.automationSetup} / one-time):**
  - Workflow mapping, integrations, prompt design, go-live.

- **Growth Autopilot (${PRICING_FACTS.autopilotMonthly} / month / location):**
  - Managed automation: missed-call recovery, reminders, reviews, bilingual support.

- **Multi-Branch OS (${PRICING_FACTS.multiBranchMonthly} / month):**
  - Multi-location automation with reporting and approval controls.

**KEY PAGES (link visitors to these):**
- Pricing: smilefotilo.com/pricing
- Contact / free quote: smilefotilo.com/contact
- Client work: smilefotilo.com/work
- Services: smilefotilo.com/services

**CONTACT INFO:**
- **Email:** support@smilefotilo.com
- **Phone / WhatsApp:** +91 9453878422
- **Location:** HQ in Gonda, UP; studio in Greater Noida; presence in Ayodhya. Serving Lucknow, Noida, and clients worldwide.

**WHY CHOOSE US?**
Founder-direct work — the person you talk to is the person who designs, builds, and supports your project. Revenue-focused builds, fast delivery (most sites in 2-3 weeks), and honest communication.
`;
