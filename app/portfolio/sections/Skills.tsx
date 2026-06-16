'use client';
import { useState } from 'react';

const CLUSTERS: Record<string, { label: string; items: string[] }> = {
  frontend: { label: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Framer Motion', 'Three.js'] },
  ai: { label: 'AI & Automation', items: ['AI-assisted dev', 'Automation', 'Prompt Eng.', 'Chatbots', 'OpenRouter / Groq'] },
  backend: { label: 'Backend / CMS', items: ['Node.js', 'PostgreSQL', 'Supabase', 'WordPress', 'WooCommerce', 'REST APIs'] },
  growth: { label: 'Growth', items: ['SEO', 'Core Web Vitals', 'Analytics (GA4/GSC)', 'Content', 'Conversion'] },
};

const TABS = ['all', ...Object.keys(CLUSTERS)] as const;
type Tab = (typeof TABS)[number];

export default function Skills({ desktop, reduced }: { desktop: boolean; reduced: boolean }) {
  const [tab, setTab] = useState<Tab>('all');

  const chips = Object.entries(CLUSTERS).flatMap(([key, c]) =>
    c.items.map((item) => ({ item, key, core: c.items.indexOf(item) < 2 })),
  );

  return (
    <section id="skills">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">
            <span className="idx">04</span> Skills
          </span>
          <h2>
            A living <em>ecosystem</em> of tools.
          </h2>
          <p>Not a list of bars — a constellation. The tools I build with daily, grouped by how I use them.</p>
        </div>

        <div className="skills-cluster-tabs">
          {TABS.map((t) => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t === 'all' ? 'All' : CLUSTERS[t].label}
            </button>
          ))}
        </div>

        <div className={`skills-stage flat`} style={{ marginTop: 28 }}>
          <div className="skill-cloud">
            {chips.map(({ item, key, core }) => {
              const dim = tab !== 'all' && tab !== key;
              return (
                <span
                  key={item}
                  className={`skill-chip${core ? ' core' : ''}${dim ? ' dim' : ''}`}
                  style={reduced ? undefined : { transitionDelay: `${(Math.random() * 0.1).toFixed(2)}s` }}
                >
                  <span className="d" />
                  {item}
                </span>
              );
            })}
          </div>
          <div className="skills-legend reveal">
            {desktop ? 'Filter by cluster to bring a group of tools forward.' : 'Tap a cluster to focus a group of tools.'}
          </div>
        </div>
      </div>
    </section>
  );
}
