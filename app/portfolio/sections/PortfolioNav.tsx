'use client';
import { useEffect, useRef } from 'react';
import { useActiveSection, useMagnetic } from '../lib/hooks';
import { SOCIAL } from '@/app/data/portfolio';

const LINKS = [
  ['about', 'About'],
  ['work', 'Work'],
  ['experience', 'Experience'],
  ['skills', 'Skills'],
  ['testimonials', 'Voices'],
  ['contact', 'Contact'],
] as const;

const SECTION_IDS = LINKS.map((l) => l[0]);

export default function PortfolioNav({
  menuOpen,
  onToggleMenu,
  desktop,
}: {
  menuOpen: boolean;
  onToggleMenu: () => void;
  desktop: boolean;
}) {
  const navRef = useRef<HTMLElement>(null);
  const active = useActiveSection(SECTION_IDS as unknown as string[]);
  const ctaRef = useMagnetic<HTMLAnchorElement>(desktop);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      nav.classList.toggle('solid', y > 40);
      if (y > last && y > 320 && !menuOpen) nav.classList.add('hide');
      else nav.classList.remove('hide');
      last = y;
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => removeEventListener('scroll', onScroll);
  }, [menuOpen]);

  return (
    <nav className="nav" ref={navRef}>
      <div className="nav-inner">
        <a href="#hero" className="brand" aria-label="Ashraf Kamal — top">
          <span className="mark">AK</span>
          <span>
            Ashraf Kamal
            <small>FULL-STACK · AI</small>
          </span>
        </a>

        <div className="nav-links">
          {LINKS.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>
              <span className="dot" />
              {label}
            </a>
          ))}
        </div>

        <div className="nav-cta">
          <a
            href={SOCIAL.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            ref={ctaRef}
            className="btn btn-primary"
            style={{ padding: '11px 20px', fontSize: 14 }}
          >
            <span className="btn-label" data-mlabel>
              Let&apos;s talk
            </span>
          </a>
          <button className="menu-btn" onClick={onToggleMenu} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            <i />
            <i />
            <i />
          </button>
        </div>
      </div>
    </nav>
  );
}
