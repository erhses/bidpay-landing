/* Review copy of the landing page's behaviour, for the published preview only.
   The markup comes from the production build; this file stands in for the React components' client code:
   Header.tsx, Hero.tsx, ScrollEffects.tsx and DownloadLink.tsx. Keep it in step with them.
   preview.py fills in CYCLES from src/content/site.ts. The 3D module is loaded on its own (see the hero block), so
   if it cannot load, the header and the scroll effects still work. */

const CYCLES = __CYCLES__;
const LINKS = { appStore: 'https://apps.apple.com/mn/app/bid-pay/id6745394883', googlePlay: 'https://play.google.com/store/apps/details?id=com.bidpay' };
const label = (n) => `${n}-р төлөлт`;
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;

/* ---------- download links: the right store on a phone ---------- */
const ua = navigator.userAgent, store = /iPhone|iPad|iPod/.test(ua) ? LINKS.appStore : /Android/.test(ua) ? LINKS.googlePlay : null;
if (store) $$('a.btn.fill[href="#tatah"]').forEach((a) => { a.href = store; a.target = '_blank'; a.rel = 'noopener'; });

/* ---------- header: part of the hero at the top, a floating bar once the hero has gone ---------- */
const bar = document.querySelector('header.top'), heroEl = document.getElementById('hero');
const links = $$('.top nav a'), marks = links.map((a) => document.querySelector(a.getAttribute('href')));
let past = false, busy = false;
bar.addEventListener('animationend', (e) => { if (e.animationName === 'lift') bar.classList.remove('stuck', 'out'); });
function track() {
  busy = false;
  const now = heroEl.getBoundingClientRect().bottom < 100;
  if (now !== past) { past = now; if (now) { bar.classList.remove('out'); bar.classList.add('stuck'); } else if (calm) bar.classList.remove('stuck'); else bar.classList.add('out'); }
  const line = innerHeight * 0.4; let cur = -1;
  marks.forEach((m, i) => { if (m && m.getBoundingClientRect().top <= line) cur = i; });
  links.forEach((a, i) => a.classList.toggle('on', i === cur));
}
addEventListener('scroll', () => { if (!busy) { busy = true; requestAnimationFrame(track); } }, { passive: true });
addEventListener('resize', track); track();

/* ---------- hero: the live 3D scene ---------- */
(async () => {
  const view = heroEl.querySelector('.view'), canvas = view.querySelector('canvas');
  if (!root.hasAttribute('data-3d')) return;
  try {
    const { default: BP } = await import('./bp3d.js');
    await Promise.all([document.fonts.load('600 40px Geologica', label(1) + ' 0123456789,₮'), document.fonts.load('500 40px Geologica', label(1))]).catch(() => {});
    const api = BP.hero(canvas, { font: 'Geologica, "Golos Text", Arial, sans-serif', label, screen: 'img/app-home.webp', cycles: CYCLES });
    heroEl.classList.add('live'); api.start();
    new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? api.start() : api.stop()))).observe(view);
    document.addEventListener('visibilitychange', () => (document.hidden ? api.stop() : api.start()));
    const lim = (v) => Math.max(-1, Math.min(1, v));
    heroEl.addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse') return; const b = view.getBoundingClientRect(); api.point(lim(((e.clientX - b.left) / b.width) * 2 - 1), lim(((e.clientY - b.top) / b.height) * 2 - 1)); });
    heroEl.addEventListener('pointerleave', () => api.point(0, 0));
    view.addEventListener('click', () => api.next());
  } catch (e) { root.removeAttribute('data-3d'); }
})();

/* ---------- things rise in as they scroll into view ---------- */
if (!calm && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.dataset.rv = 'in'; io.unobserve(e.target); } }), { threshold: 0.12 });
  $$('[data-rv]').forEach((el) => { el.style.setProperty('--d', String([...el.parentElement.children].indexOf(el) % 4)); if (el.getBoundingClientRect().top > innerHeight * 0.9) { el.dataset.rv = 'pre'; io.observe(el); } });
}
