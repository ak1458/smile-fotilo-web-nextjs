import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono, Schibsted_Grotesk } from 'next/font/google';

// Self-hosted via next/font — no runtime Google Fonts request (CSP-safe), no CLS.
export const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const sans = Schibsted_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans-aurora',
  display: 'swap',
});
