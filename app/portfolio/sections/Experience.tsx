'use client';
import { useEffect, useRef } from 'react';

const MILESTONES: Array<{ yr: [string, string]; role: string; org: string; text: string }> = [
  { yr: ['20', '18'], role: 'First production code', org: 'Self-taught', text: 'Freelance WordPress builds while teaching myself JavaScript at night. The obsession with how things feel started here.' },
  { yr: ['20', '21'], role: 'Front-end & WordPress dev', org: 'Freelance', text: 'Shipped marketing sites, e-commerce stores and local-SEO builds for real businesses across India.' },
  { yr: ['20', '22'], role: 'Digital marketing + brand', org: 'Veloria Vault', text: 'Ran a leather brand end-to-end — website, marketplace listings, product optimisation and AI-generated content.' },
  { yr: ['20', '23'], role: 'Full-stack & app builder', org: 'Client projects', text: 'Built full-stack apps for real operations — PulseKart POS, OrderFlow logistics, and the Takhti tuition PWA.' },
  { yr: ['20', '24'], role: 'Founder & developer', org: 'Smile Fotilo', text: 'Run a solo web + AI-automation studio — discovery, design, development, deployment and support with AI-assisted workflows.' },
];

export default function Experience({ reduced, desktop }: { reduced: boolean; desktop: boolean }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Scroll-jack only on capable desktops. On mobile / reduced-motion the
    // timeline is a plain horizontal swipe (no inflated section height).
    if (reduced || !desktop) {
      stickyRef.current?.classList.add('static');
      if (outerRef.current) outerRef.current.style.height = '';
      return;
    }
    stickyRef.current?.classList.remove('static');
    const outer = outerRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    if (!outer || !track || !bar) return;

    let scrollDist = 0;
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
    const layout = () => {
      scrollDist = Math.max(0, track.scrollWidth - innerWidth);
      outer.style.height = `${innerHeight + scrollDist}px`;
    };
    let ticking = false;
    const update = () => {
      const total = outer.offsetHeight - innerHeight;
      const top = outer.getBoundingClientRect().top;
      const p = clamp(-top / (total || 1), 0, 1);
      track.style.transform = `translate3d(${(-p * scrollDist).toFixed(1)}px,0,0)`;
      bar.style.width = `${(p * 100).toFixed(1)}%`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    const onResize = () => {
      layout();
      update();
    };
    layout();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onResize);
    update();
    const t = setTimeout(() => {
      layout();
      update();
    }, 600);
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onResize);
      clearTimeout(t);
      outer.style.height = '';
    };
  }, [reduced, desktop]);

  return (
    <section id="experience">
      <div className="tl-outer" ref={outerRef}>
        <div className="tl-sticky" ref={stickyRef}>
          <div className="wrap">
            <div className="section-head reveal" style={{ marginBottom: 30 }}>
              <span className="eyebrow">
                <span className="idx">03</span> Experience
              </span>
              <h2>
                A path, not a <em>résumé</em>.
              </h2>
            </div>
          </div>
          <div className="tl-progress">
            <i ref={barRef} />
          </div>
          <div className="timeline-viewport">
            <div className="timeline-track" ref={trackRef}>
              {MILESTONES.map((m) => (
                <div className="milestone" key={m.yr.join('')}>
                  <span className="node" />
                  <div className="yr">
                    {m.yr[0]}
                    <em>{m.yr[1]}</em>
                  </div>
                  <div className="role">{m.role}</div>
                  <div className="org">{m.org}</div>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="wrap">
            <p className="tl-hint">Keep scrolling to travel the timeline →</p>
          </div>
        </div>
      </div>
    </section>
  );
}
