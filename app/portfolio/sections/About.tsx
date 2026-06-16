'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

const CHAPTERS = [
  ['01', 'The journey', 'Self-taught developer who started with WordPress builds and never stopped. Now I ship full-stack products end-to-end — architecture, APIs, and the last 5% of polish that makes an interface feel right.'],
  ['02', 'Philosophy', 'Speed is a feature. Clarity is a feature. The best products feel inevitable. AI is a multiplier on craft, never a replacement for it.'],
  ['03', 'Process', 'Understand the problem, prototype fast, validate with real users, then engineer for scale. AI-assisted workflows run through the whole pipeline — idea to production in days.'],
  ['04', 'Mindset', 'Curious, relentless, allergic to "good enough." I build in public and share what I learn — through content and open work.'],
] as const;

export default function About({ repoCount, desktop }: { repoCount: number; desktop: boolean }) {
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el || !desktop) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`;
    };
    const leave = () => {
      el.style.transform = '';
    };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, [desktop]);

  const stats: Array<[React.ReactNode, string]> = [
    [<>6<em>+</em></>, 'Years building'],
    ['10+', 'Projects shipped'],
    [String(repoCount), 'Public repos'],
    ['2', 'Countries served'],
  ];

  return (
    <section id="about">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">
            <span className="idx">01</span> About
          </span>
          <h2>
            I build products at the intersection of <em>code, AI &amp; craft</em>.
          </h2>
        </div>
        <div className="about-grid">
          <div className="about-chapters">
            {CHAPTERS.map(([no, title, body], i) => (
              <div className="chapter reveal" key={no} style={{ ['--d' as string]: `${i * 0.1}s` }}>
                <h3>
                  <span className="c-no">{no}</span>
                  {title}
                </h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
          <div className="about-visual">
            <div className="portrait reveal" ref={tiltRef}>
              <Image
                src="/portfolio/ashraf.png"
                alt="Ashraf Kamal"
                fill
                sizes="(max-width:900px) 100vw, 460px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="about-stats">
              {stats.map(([num, lbl], i) => (
                <div className="stat reveal" key={lbl} style={{ ['--d' as string]: `${i * 0.08}s` }}>
                  <div className="num">{num}</div>
                  <div className="lbl">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
