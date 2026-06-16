'use client';
import { useEffect, useRef, useState } from 'react';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

export function useIsDesktop(min = 880) {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = matchMedia(`(min-width:${min}px) and (pointer:fine)`);
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [min]);
  return desktop;
}

// Lenis smooth scroll on desktop, non-reduced-motion only. No-op (native scroll) otherwise.
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let raf = 0;
    let alive = true;
    import('lenis')
      .then(({ default: Lenis }) => {
        if (!alive) return;
        lenis = new Lenis({ duration: 1.1, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        const loop = (time: number) => {
          lenis?.raf(time);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      })
      .catch(() => {});
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, [enabled]);
}

// scroll-based reveals: add `reveal-anim` to <html>, toggle `in` on `.reveal`/`.lines` as they enter view.
export function useReveals(enabled: boolean) {
  useEffect(() => {
    const all = Array.from(document.querySelectorAll<HTMLElement>('.reveal, .lines'));
    if (!enabled) {
      all.forEach((el) => el.classList.add('in'));
      return;
    }
    document.documentElement.classList.add('reveal-anim');
    const items = [...all];
    const check = () => {
      const vh = innerHeight;
      for (let i = items.length - 1; i >= 0; i--) {
        const r = items[i].getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > -50) {
          items[i].classList.add('in');
          items.splice(i, 1);
        }
      }
    };
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          check();
          ticking = false;
        });
      }
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    check();
    const t1 = setTimeout(check, 300);
    const t2 = setTimeout(check, 900);
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      clearTimeout(t1);
      clearTimeout(t2);
      document.documentElement.classList.remove('reveal-anim');
    };
  }, [enabled]);
}

export function useMagnetic<T extends HTMLElement = HTMLElement>(enabled: boolean) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const label = el.querySelector<HTMLElement>('[data-mlabel]') || el;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${mx * 0.28}px,${my * 0.28}px)`;
      label.style.transform = `translate(${mx * 0.12}px,${my * 0.12}px)`;
    };
    const leave = () => {
      el.style.transform = '';
      label.style.transform = '';
    };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, [enabled]);
  return ref;
}

export function useClock() {
  const [t, setT] = useState('—');
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString('en-US', { hour12: false, timeZoneName: 'short' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

// active-section tracking for the nav (scroll-based; reliable across browsers)
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const onScroll = () => {
      const line = innerHeight * 0.42;
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) cur = id;
      }
      setActive(cur);
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    };
  }, [ids]);
  return active;
}
