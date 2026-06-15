'use client';
import { useCallback, useEffect, useState } from 'react';
import { GOOGLE_REVIEWS_URL } from '@/app/data/portfolio';

// Real testimonials only — sourced from app/components/Testimonials.tsx.
// No review counts / star counts on this page (pinned decision).
const VOICES: Array<{ q: [string, string, string]; nm: string; rl: string; av: string }> = [
  { q: ['Smile Fotilo transformed our website with their outstanding design skills. Their expertise in ', 'WordPress and SEO', ' boosted our online presence significantly.'], nm: 'Rachit Gupta', rl: 'Google review · Verified', av: 'RG' },
  { q: ['Website development and SEO works were outstanding. They felt ', 'more like friends than clients', '.'], nm: 'Jimmy Li', rl: 'Google review · Verified', av: 'JL' },
  { q: ['Best website development in Gonda and Lucknow — but in terms of India, ', 'I think it’s the best', '.'], nm: 'Vivek Chaudhary', rl: 'Google review · Verified', av: 'VC' },
  { q: ['Ashraf built and manages our entire website, runs our Amazon and Flipkart ads, and creates all our content. ', 'He handles everything', ' so I can focus on my product.'], nm: 'Veloria Vault', rl: 'Luxury Leather · Lucknow', av: 'VV' },
  { q: ['The pharmacy billing system replaced our manual process completely — ', 'inventory, prescriptions, GST billing', ', all from one dashboard.'], nm: 'PulseKart', rl: 'Pharmacy POS · Gonda', av: 'PK' },
];

export default function Voices({ reduced }: { reduced: boolean }) {
  const [cur, setCur] = useState(0);
  const n = VOICES.length;
  const go = useCallback((i: number) => setCur(((i % n) + n) % n), [n]);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setCur((c) => (c + 1) % n), 5200);
    return () => clearInterval(id);
  }, [reduced, n]);

  return (
    <section id="testimonials">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">
            <span className="idx">05</span> Voices
          </span>
          <h2>
            What people <em>say</em>.
          </h2>
        </div>

        <div className="tstack">
          {VOICES.map((t, i) => {
            const off = (i - cur + n) % n;
            const depth = Math.min(off, 3);
            return (
              <div
                key={t.nm}
                className="tcard"
                style={{
                  zIndex: n - off,
                  opacity: off > 2 ? 0 : 1,
                  transform: `translateY(${depth * 16}px) translateZ(${-depth * 90}px) scale(${1 - depth * 0.05})`,
                  filter: off === 0 ? 'none' : `brightness(${1 - depth * 0.18})`,
                  pointerEvents: off === 0 ? 'auto' : 'none',
                }}
              >
                <div className="quote">
                  “{t.q[0]}
                  <em>{t.q[1]}</em>
                  {t.q[2]}”
                </div>
                <div className="who">
                  <div className="av">{t.av}</div>
                  <div>
                    <div className="nm">{t.nm}</div>
                    <div className="rl">{t.rl}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="tdots">
          {VOICES.map((t, i) => (
            <i key={t.nm} className={i === cur ? 'on' : ''} onClick={() => go(i)} />
          ))}
        </div>
        <div className="tctrl">
          <button onClick={() => go(cur - 1)} aria-label="Previous">
            ←
          </button>
          <button onClick={() => go(cur + 1)} aria-label="Next">
            →
          </button>
        </div>
        <div className="reviews-link">
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
            Read client reviews on Google →
          </a>
        </div>
      </div>
    </section>
  );
}
