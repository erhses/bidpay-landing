'use client';

import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { cls } from '@/lib/format';
import TierBadge, { type Tier } from './TierBadge';

type Item = { readonly id: Tier; readonly name: string; readonly line: string };

/**
 * One tier badge in a spotlight, turning to the next every few seconds while it is on screen, with the four tiers on a
 * track underneath that fills up to the one shown. Tapping a tier shows it and stops the turning. With reduced motion,
 * or before script runs, it rests on Standard and the track still works as buttons.
 */
export default function TierSpot({ list }: { list: readonly Item[] }) {
  const [at, setAt] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!auto || !el || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    let timer = 0;
    let visible = false;
    const run = () => {
      window.clearInterval(timer);
      if (visible && !document.hidden) timer = window.setInterval(() => setAt((i) => (i + 1) % list.length), 2600);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        run();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    document.addEventListener('visibilitychange', run);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', run);
    };
  }, [auto, list.length]);

  return (
    <div className="spot" ref={ref} data-tier={list[at].id} style={{ '--at': at } as CSSProperties}>
      <div className="spot-stage">
        {list.map((t, i) => (
          <div className={cls('spot-badge', i === at && 'on')} aria-hidden={i !== at} key={t.id}>
            <TierBadge tier={t.id} title={t.name} />
          </div>
        ))}
      </div>
      <p className="spot-line" aria-live="polite">
        {list[at].line}
      </p>
      <ol className="nodes">
        {list.map((t, i) => (
          <li key={t.id}>
            <button
              type="button"
              className={cls(i <= at && 'done')}
              aria-pressed={i === at}
              onClick={() => {
                setAt(i);
                setAuto(false);
              }}
            >
              <i aria-hidden="true" />
              {t.name}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
