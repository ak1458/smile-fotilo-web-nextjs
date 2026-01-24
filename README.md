# Smile Fotilo - Digital Agency Website

Premium digital agency website built with Next.js 16, featuring AI-powered chatbot, modern UI, and SEO optimization for "Zero Position" ranking.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your API key from [Groq Console](https://console.groq.com/).

## 📁 Project Structure

```
app/
├── actions/          # Server actions (chat API)
├── components/       # Reusable components
├── data/             # Knowledge base
├── locations/        # Location pages (Gonda, Lucknow, etc.)
├── services/         # Service pages (SEO, Branding, Web Design)
├── work/             # Portfolio pages
├── privacy/          # Privacy Policy
├── terms/            # Terms of Service
└── layout.tsx        # Root layout with global SEO
```

## 🛡️ Security Features

| Feature | Implementation |
|---------|----------------|
| CSP | Strict Content-Security-Policy |
| HSTS | 2-year max-age with preload |
| Clickjacking | X-Frame-Options: SAMEORIGIN |
| MIME Sniffing | X-Content-Type-Options: nosniff |
| XSS | X-XSS-Protection + React escaping |
| Rate Limiting | 20 requests/min per client |
| Input Sanitization | HTML/script tag removal |

## 🔍 SEO Features

- **Schema Markup**: Organization, LocalBusiness, Service, FAQPage, HowTo
- **SpeakableSpecification**: Optimized for AI assistants
- **ProfilePage**: E-E-A-T author credentials
- **Lead-with-Answer**: Featured snippet optimization
- **GEO Ready**: 2026 Generative Engine Optimization

## 🤖 AI Chatbot (Echo)

- Powered by Groq (Llama 3.3 70B)
- Collects project requirements
- Generates PDF proposals
- Rate-limited and sanitized

## 📍 Location Pages

- Gonda (HQ)
- Lucknow
- Greater Noida
- Ayodhya

Each with LocalBusiness schema.

## 📱 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Groq SDK (Llama 3.3)
- **Animations**: Framer Motion
- **PDF**: jsPDF

## 🚢 Deployment

Works with Vercel, Netlify, or any Node.js host.

```bash
npm run build
npm run start
```

## 📄 License

MIT

---

Built with passion by [Smile Fotilo](https://smilefotilo.com)
