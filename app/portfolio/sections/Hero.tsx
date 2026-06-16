'use client';
import dynamic from 'next/dynamic';
import { useClock, useMagnetic } from '../lib/hooks';
import { SOCIAL } from '@/app/data/portfolio';

const HeroScene = dynamic(() => import('../three/HeroScene'), { ssr: false });

const MARQUEE = ['React', 'Next.js', 'TypeScript', 'AI Automation', 'WordPress', 'Performance', 'SEO'];

export default function Hero({ desktop, reduced }: { desktop: boolean; reduced: boolean }) {
  const clock = useClock();
  const primary = useMagnetic<HTMLAnchorElement>(desktop);
  const ghost = useMagnetic<HTMLAnchorElement>(desktop);
  const show3D = desktop && !reduced;

  return (
    <header id="hero">
      {show3D ? <HeroScene /> : <div className="hero-bg" />}
      <div className="scrim" />

      <div className="hero-top">
        <div className="hero-meta">
          <b>ASHRAF KAMAL</b>
          <br />
          Full-Stack Developer
          <br />
          AI Product Builder
        </div>
        <div className="hero-meta" style={{ textAlign: 'right' }}>
          <b>2026 — PORTFOLIO</b>
          <br />
          Gonda, India · remote
          <br />
          <span>{clock}</span>
        </div>
      </div>

      <div className="hero-inner">
        <h1 className="hero-title lines">
          <span className="line">
            <span>Building digital</span>
          </span>
          <span className="line">
            <span>products that</span>
          </span>
          <span className="line">
            <span>
              feel <em>alive</em>
            </span>
          </span>
        </h1>
        <div className="hero-row reveal" style={{ ['--d' as string]: '.5s' }}>
          <p className="hero-lead">
            <span className="role">Full-stack developer, AI-assisted product builder & founder of Smile Fotilo. </span>
            I build fast, scalable digital products — modern web, AI workflows, automation, and SEO.
          </p>
          <div className="hero-cta">
            <a href="#work" className="btn btn-primary" ref={primary}>
              <span className="btn-label" data-mlabel>
                View selected work
              </span>
              <span className="arrow">→</span>
            </a>
            <a href={SOCIAL.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" ref={ghost}>
              <span className="btn-label" data-mlabel>
                Start a project
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="scroll-cue">
        <span>Scroll</span>
        <span className="bar" />
      </div>

      <div className="marquee">
        <div className="track">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i}>{m === 'AI Automation' ? <b>{m}</b> : m}</span>
          ))}
        </div>
      </div>
    </header>
  );
}
