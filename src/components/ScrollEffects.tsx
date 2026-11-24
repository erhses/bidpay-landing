'use client';

import { useEffect } from 'react';

/**
 * Anything marked data-rv rises into place the first time it scrolls into view; neighbours arrive one after another.
 * Nothing is hidden until this runs, so the page reads normally without script or with reduced motion.
 */
export default function ScrollEffects() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

    const seen = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.rv = 'in';
          seen.unobserve(entry.target);
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll<HTMLElement>('[data-rv]').forEach((el) => {
      el.style.setProperty('--d', String(Array.from(el.parentElement?.children ?? []).indexOf(el) % 4));
      if (el.getBoundingClientRect().top > innerHeight * 0.9) {
        el.dataset.rv = 'pre';
        seen.observe(el);
      }
    });

    return () => seen.disconnect();
  }, []);

  return null;
}
