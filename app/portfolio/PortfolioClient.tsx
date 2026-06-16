'use client';
import { useState } from 'react';
import s from './portfolio.module.css';
import { display, serif, mono, sans } from './fonts';
import { useReducedMotion, useIsDesktop, useLenis, useReveals } from './lib/hooks';
import type { Project } from './lib/portfolio';
import PortfolioNav from './sections/PortfolioNav';
import MenuOverlay from './sections/MenuOverlay';
import Hero from './sections/Hero';
import About from './sections/About';
import Work from './sections/Work';
import Experience from './sections/Experience';
import Skills from './sections/Skills';
import Voices from './sections/Voices';
import Contact from './sections/Contact';
import PortfolioFooter from './sections/PortfolioFooter';
import CaseOverlay from './sections/CaseOverlay';

export interface PortfolioClientProps {
  featured: Project[];
  rest: Project[];
  repoCount: number;
}

export default function PortfolioClient({ featured, rest, repoCount }: PortfolioClientProps) {
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<Project | null>(null);

  useLenis(desktop && !reduced);
  useReveals(!reduced);

  return (
    <div className={`${s.aurora} ${display.variable} ${serif.variable} ${mono.variable} ${sans.variable} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="grain" />
      <div className="vignette" />

      <PortfolioNav menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} desktop={desktop} />
      <MenuOverlay onClose={() => setMenuOpen(false)} />

      <Hero desktop={desktop} reduced={reduced} />

      <main>
        <About repoCount={repoCount} desktop={desktop} />
        <Work featured={featured} rest={rest} onOpen={setActive} desktop={desktop} />
        <Experience reduced={reduced} desktop={desktop} />
        <Skills desktop={desktop} reduced={reduced} />
        <Voices reduced={reduced} />
        <Contact />
      </main>

      <PortfolioFooter />
      <CaseOverlay project={active} onClose={() => setActive(null)} />
    </div>
  );
}
