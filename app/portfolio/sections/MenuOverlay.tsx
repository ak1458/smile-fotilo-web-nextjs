'use client';
import { useEffect } from 'react';
import { SOCIAL } from '@/app/data/portfolio';

const ITEMS = [
  ['about', 'About'],
  ['work', 'Work'],
  ['experience', 'Experience'],
  ['skills', 'Skills'],
  ['testimonials', 'Voices'],
  ['contact', 'Contact'],
] as const;

export default function MenuOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [onClose]);

  const direct = [
    SOCIAL.email && { href: `mailto:${SOCIAL.email}`, label: SOCIAL.email, external: false },
    SOCIAL.github && { href: SOCIAL.github, label: 'GitHub ↗', external: true },
    SOCIAL.linkedin && { href: SOCIAL.linkedin, label: 'LinkedIn ↗', external: true },
    SOCIAL.youtube && { href: SOCIAL.youtube, label: 'YouTube ↗', external: true },
    SOCIAL.whatsapp && { href: SOCIAL.whatsapp, label: 'WhatsApp ↗', external: true },
  ].filter(Boolean) as { href: string; label: string; external: boolean }[];

  return (
    <div className="overlay">
      <div className="ov-grid">
        <nav className="ov-nav">
          {ITEMS.map(([id, label], i) => (
            <a key={id} href={`#${id}`} style={{ ['--i' as string]: i }} onClick={onClose}>
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              {label}
              <span className="arw">→</span>
            </a>
          ))}
        </nav>
        <div className="ov-side">
          <h5>Direct</h5>
          {direct.map((d) => (
            <a key={d.label} href={d.href} {...(d.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              {d.label}
            </a>
          ))}
          <h5 style={{ marginTop: 34 }}>Currently</h5>
          <a href="#contact" style={{ color: 'var(--muted)' }} onClick={onClose}>
            Open to freelance projects & collaborations
          </a>
        </div>
      </div>
    </div>
  );
}
