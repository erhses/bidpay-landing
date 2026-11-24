'use client';

import { useEffect, useState } from 'react';
import { downloadLabel, nav } from '@/content/site';
import { cls } from '@/lib/format';
import DownloadLink from './DownloadLink';

/**
 * At the top of the page the header is part of the hero and scrolls away with it, so it never sits over the 3D
 * scene. Once the hero has left the screen it comes back as a floating bar and marks the section in view.
 */
export default function Header() {
  const [mode, setMode] = useState<'hero' | 'bar' | 'leaving'>('hero');
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const heroEl = document.getElementById('hero');
    const sections = nav.map((item) => document.querySelector(item.href));
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let past = false;
    let frame = 0;

    const track = () => {
      frame = 0;
      const now = !!heroEl && heroEl.getBoundingClientRect().bottom < 100;
      if (now !== past) {
        past = now;
        setMode(now ? 'bar' : calm ? 'hero' : 'leaving');
      }
      const line = innerHeight * 0.4;
      let current = -1;
      sections.forEach((section, i) => {
        if (section && section.getBoundingClientRect().top <= line) current = i;
      });
      setActive(current);
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(track);
    };

    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    queue();
    return () => {
      removeEventListener('scroll', queue);
      removeEventListener('resize', queue);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={cls('top', mode !== 'hero' && 'stuck', mode === 'leaving' && 'out')}
      onAnimationEnd={(e) => {
        if (e.animationName === 'lift') setMode((m) => (m === 'leaving' ? 'hero' : m));
      }}
    >
      <a className="logo" href="#top" aria-label="BiD Pay">
        <img src="/img/icon.webp" alt="" width={32} height={32} />
        BiD Pay
      </a>
      <nav aria-label="Үндсэн цэс">
        {nav.map((item, i) => (
          <a key={item.href} href={item.href} className={i === active ? 'on' : undefined}>
            {item.label}
          </a>
        ))}
      </nav>
      <DownloadLink className="btn fill small">{downloadLabel}</DownloadLink>
    </header>
  );
}
