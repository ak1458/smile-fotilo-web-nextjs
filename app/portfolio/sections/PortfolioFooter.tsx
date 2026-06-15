'use client';
import { useClock } from '../lib/hooks';
import { SOCIAL } from '@/app/data/portfolio';

export default function PortfolioFooter() {
  const clock = useClock();
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <a href={SOCIAL.whatsapp} target="_blank" rel="noopener noreferrer" className="foot-big">
            Let&apos;s
            <br />
            <em>talk</em>.
          </a>
          <div className="foot-meta">
            ASHRAF KAMAL
            <br />
            © 2026 — All rights reserved
            <br />
            Built with intent · Smile Fotilo
            <br />
            <span>{clock}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
