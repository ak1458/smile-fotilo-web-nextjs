'use client';
import { useEffect, useRef } from 'react';
import type { Project } from '../lib/portfolio';

export default function CaseOverlay({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = !!project;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const p = project;
  const bg = p
    ? `radial-gradient(70% 90% at 70% 10%, ${hexA(p.accent, 0.45)}, transparent 60%), linear-gradient(160deg, ${hexA(p.accent, 0.35)}, var(--charcoal))`
    : undefined;

  return (
    <div className={`case ${open ? 'open' : ''}`} aria-hidden={!open}>
      <button className="case-close" ref={closeRef} onClick={onClose}>
        ✕ Close
      </button>
      {p && (
        <>
          <div className="case-hero">
            <div className="bg" style={{ background: bg }} />
            <div className="scrim" />
            <div className="inner">
              <div className="cat">{p.category}</div>
              <h2>{p.name}</h2>
            </div>
          </div>
          <div className="case-body">
            <div>
              <p style={{ fontSize: 22, color: 'var(--white)' }}>{p.summary}</p>
              <p>
                {p.name} is {p.status === 'Live' ? 'live and actively maintained' : p.status === 'Archived' ? 'an archived build' : 'in active development'}
                {p.tech.length ? `, built with ${p.tech.join(', ')}.` : '.'} Explore the source on GitHub
                {p.liveUrl ? ' or open the live site' : ''} below.
              </p>
              <p style={{ color: 'var(--muted)' }}>
                Want a deeper walkthrough — architecture, decisions, and how AI-assisted workflows shaped it? Reach out and I&apos;ll talk you
                through it.
              </p>
            </div>
            <div className="case-meta">
              <div className="row">
                <div className="k">Category</div>
                <div className="v">{p.category}</div>
              </div>
              <div className="row">
                <div className="k">Status</div>
                <div className="v">{p.status}</div>
              </div>
              <div className="row">
                <div className="k">Stack</div>
                <div className="v">{p.tech.join(' · ') || '—'}</div>
              </div>
              <div className="row">
                <div className="k">Links</div>
                <div className="v">
                  <a href={p.repoUrl} target="_blank" rel="noopener noreferrer">
                    GitHub ↗
                  </a>
                  {p.liveUrl && (
                    <>
                      {'  ·  '}
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                        Live ↗
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function hexA(hex: string, a: number) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
