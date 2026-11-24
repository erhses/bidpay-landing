'use client';

import { type CSSProperties, type PointerEvent, useEffect, useRef, useState } from 'react';
import { downloadLabel, hero, paymentLabel } from '@/content/site';
import { cls } from '@/lib/format';
import type { HeroApi } from '@/three/bp3d';
import DownloadLink from './DownloadLink';

const order = (n: number) => ({ '--n': n }) as CSSProperties;
const clamp = (v: number) => Math.max(-1, Math.min(1, v));

/**
 * A quiet first screen: the headline, one line, one button, and one 3D object. The words are there from the first
 * paint. layout.tsx marks <html data-3d> before paint when the scene can play (motion allowed, WebGL present); the
 * mark hides the still so it does not flash before the live scene. Without it, the still is what people see.
 */
export default function Hero() {
  const view = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<HeroApi | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const el = view.current;
    const cv = canvas.current;
    if (!el || !cv || !root.hasAttribute('data-3d')) return;

    let alive = true;
    const cleanup: Array<() => void> = [];

    (async () => {
      try {
        const { default: BP } = await import('@/three/bp3d');
        const font = getComputedStyle(root).getPropertyValue('--font-head').trim();
        if (font && document.fonts) {
          // The scene draws text into textures, so the faces it needs must be loaded first.
          await Promise.all([
            document.fonts.load(`600 40px ${font}`, `${paymentLabel(1)} 0123456789,₮`),
            document.fonts.load(`500 40px ${font}`, paymentLabel(1)),
          ]).catch(() => undefined);
        }
        if (!alive) return;

        const api = BP.hero(cv, { font: font || undefined, label: paymentLabel, screen: hero.screen, cycles: hero.cycles });
        scene.current = api;
        setLive(true);
        api.start();

        const seen = new IntersectionObserver((entries) => entries.forEach((entry) => (entry.isIntersecting ? api.start() : api.stop())));
        seen.observe(el);
        const onVisibility = () => (document.hidden ? api.stop() : api.start());
        document.addEventListener('visibilitychange', onVisibility);
        cleanup.push(() => {
          seen.disconnect();
          document.removeEventListener('visibilitychange', onVisibility);
          api.dispose();
          scene.current = null;
        });
      } catch {
        // No WebGL after all, or the scene failed to load: show the still.
        root.removeAttribute('data-3d');
      }
    })();

    return () => {
      alive = false;
      cleanup.forEach((undo) => undo());
    };
  }, []);

  /* The object leans a little toward the pointer, wherever it is in the hero. */
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const box = view.current?.getBoundingClientRect();
    if (e.pointerType !== 'mouse' || !scene.current || !box) return;
    scene.current.point(clamp(((e.clientX - box.left) / box.width) * 2 - 1), clamp(((e.clientY - box.top) / box.height) * 2 - 1));
  };

  return (
    <section id="hero" className={cls('hero', live && 'live')} onPointerMove={onMove} onPointerLeave={() => scene.current?.point(0, 0)}>
      <div className="wrap hero-in">
        <div className="say">
          <h1>
            {hero.title.map((line, i) => (
              <span key={line} className="rise" style={order(i)}>
                {line}
              </span>
            ))}
          </h1>
          <p className="lede rise" style={order(2)}>
            {hero.lede}
          </p>
          <div className="act rise" style={order(3)}>
            <DownloadLink className="btn fill">{downloadLabel}</DownloadLink>
          </div>
          <p className="trust rise" style={order(4)}>
            {hero.trust}
          </p>
        </div>
        <div className="view" ref={view} onClick={() => scene.current?.next()}>
          <img className="poster" src="/img/hero-poster.webp" alt="" width={900} height={900} />
          <canvas ref={canvas} role="img" aria-label={hero.sceneLabel} />
        </div>
      </div>
    </section>
  );
}
