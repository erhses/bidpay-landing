'use client';

import { useEffect } from 'react';

const TURN = 2800;

/**
 * The motion in section 3, kept small:
 * - [data-play] blocks wait off screen (data-play="ready") and play once when they arrive (data-play="on"):
 *   the savings rows rise and their bars fill; the tier line climbs and lights each badge as it passes.
 * - The service stack turns over every few seconds while it is on screen: the front card slides away and comes back
 *   at the rear. It pauses under the pointer and when the tab is hidden.
 * Nothing is hidden until this runs, so the section reads complete without script; with reduced motion it stays still.
 */
export default function FeatureMotion() {
  useEffect(() => {
    const root = document.getElementById('bolomj');
    if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

    const plays = root.querySelectorAll<HTMLElement>('[data-play]');
    const seen = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          (e.target as HTMLElement).dataset.play = 'on';
          seen.unobserve(e.target);
        }),
      { threshold: 0.35 },
    );
    plays.forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight * 0.85) {
        el.dataset.play = 'ready';
        seen.observe(el);
      } else el.dataset.play = 'on';
    });

    const stack = root.querySelector<HTMLElement>('[data-stack]');
    const cards = stack ? Array.from(stack.querySelectorAll<HTMLElement>('.svc')) : [];
    let timer = 0;
    let visible = false;
    let held = false;
    const turn = () => {
      const front = cards.find((c) => c.dataset.pos === '0');
      if (!front) return;
      front.dataset.pos = 'out';
      cards.forEach((c) => {
        if (c !== front) c.dataset.pos = String(Number(c.dataset.pos) - 1);
      });
      window.setTimeout(() => {
        front.classList.add('snap');
        front.dataset.pos = String(cards.length - 1);
        void front.offsetWidth;
        front.classList.remove('snap');
      }, 450);
    };
    const run = () => {
      window.clearInterval(timer);
      if (visible && !held && !document.hidden) timer = window.setInterval(turn, TURN);
    };
    const watch = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      run();
    }, { threshold: 0.4 });
    const hold = (on: boolean) => () => {
      held = on;
      run();
    };
    const onHidden = () => run();
    if (stack && cards.length > 1) {
      watch.observe(stack);
      stack.addEventListener('pointerenter', hold(true));
      stack.addEventListener('pointerleave', hold(false));
      document.addEventListener('visibilitychange', onHidden);
    }

    return () => {
      seen.disconnect();
      watch.disconnect();
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onHidden);
    };
  }, []);

  return null;
}
