'use client';
import { useRef } from 'react';
import Image from 'next/image';
import type { Project } from '../lib/portfolio';

function updated(pushedAt: string) {
  if (!pushedAt) return null;
  const d = new Date(pushedAt);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

function Media({ p, desktop }: { p: Project; desktop: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!desktop) return;
    const el = ref.current;
    const glow = glowRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg)`;
    glow?.style.setProperty('--mx', `${(px + 0.5) * 100}%`);
    glow?.style.setProperty('--my', `${(py + 0.5) * 100}%`);
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <div className="project-media" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ ['--p' as string]: p.accent }}>
      {p.thumbnail ? (
        <div className="thumb">
          <Image src={p.thumbnail} alt={p.name} fill sizes="(max-width:860px) 100vw, 50vw" />
        </div>
      ) : (
        <>
          <div className="ph-grid" />
          <div className="ph-name">{p.name}</div>
        </>
      )}
      <div className="glow" ref={glowRef} />
      {p.liveUrl && (
        <span className="preview-tag">
          <span className="led" />
          Live preview
        </span>
      )}
      <span className={`status-pill ${p.status.toLowerCase()}`}>{p.status}</span>
      <span className="expand">↗</span>
    </div>
  );
}

function FeaturedCard({ p, i, total, onOpen, desktop }: { p: Project; i: number; total: number; onOpen: (p: Project) => void; desktop: boolean }) {
  const up = updated(p.pushedAt);
  return (
    <article
      className={`project reveal ${i % 2 === 1 ? 'alt' : ''}`}
      onClick={() => onOpen(p)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onOpen(p);
      }}
    >
      <Media p={p} desktop={desktop} />
      <div className="project-info">
        <span className="cat">{p.category}</span>
        <h3>{p.name}</h3>
        <p>{p.summary}</p>
        <div className="project-results">
          <div className="r">
            <div className="v">{p.status}</div>
            <div className="k">Status</div>
          </div>
          {p.tech[0] && (
            <div className="r">
              <div className="v">{p.tech[0]}</div>
              <div className="k">Primary tech</div>
            </div>
          )}
          {up && (
            <div className="r">
              <div className="v">{up}</div>
              <div className="k">Updated</div>
            </div>
          )}
        </div>
        <div className="tags">
          {p.tech.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="project-links">
          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
              ↗ Live site
            </a>
          )}
          <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
            ↗ Source
          </a>
        </div>
        <div className="work-index">
          <span style={{ color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span> / {String(total).padStart(2, '0')} — open case ↗
        </div>
      </div>
    </article>
  );
}

function RestCard({ p, onOpen }: { p: Project; onOpen: (p: Project) => void }) {
  return (
    <div
      className="rcard"
      onClick={() => onOpen(p)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onOpen(p);
      }}
    >
      <div className="rcard-top">
        <span className="cat">{p.category}</span>
        <span className={`status-pill ${p.status.toLowerCase()}`} style={{ position: 'static', backdropFilter: 'none' }}>
          {p.status}
        </span>
      </div>
      <h4>{p.name}</h4>
      <p>{p.summary}</p>
      <div className="tags">
        {p.tech.slice(0, 3).map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}

export default function Work({
  featured,
  rest,
  onOpen,
  desktop,
}: {
  featured: Project[];
  rest: Project[];
  onOpen: (p: Project) => void;
  desktop: boolean;
}) {
  return (
    <section id="work">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">
            <span className="idx">02</span> Selected Work
          </span>
          <h2>
            Things I&apos;ve <em>built</em> &amp; shipped.
          </h2>
          <p>Pulled live from GitHub — new projects appear here automatically. Click any project to open the full case.</p>
        </div>

        <div className="work-list">
          {featured.map((p, i) => (
            <FeaturedCard key={p.id} p={p} i={i} total={featured.length} onOpen={onOpen} desktop={desktop} />
          ))}
        </div>

        {rest.length > 0 && (
          <div className="work-rest">
            <div className="work-rest-head reveal">
              <h3>More builds</h3>
              <a href="https://github.com/ak1458?tab=repositories" target="_blank" rel="noopener noreferrer" className="project-links">
                <span>↗ All repositories</span>
              </a>
            </div>
            <div className="rest-grid">
              {rest.map((p) => (
                <RestCard key={p.id} p={p} onOpen={onOpen} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
