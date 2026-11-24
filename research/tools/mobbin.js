// Reads Mobbin's public explore pages (no login) and lists the featured sites with their tags.
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const out = process.argv[2];
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' });
  const all = {};
  for (const slug of process.argv.slice(3)) {
    const url = 'https://mobbin.com/explore/sites/' + slug;
    const p = await ctx.newPage();
    try {
      await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 });
      try { await p.waitForLoadState('networkidle', { timeout: 10000 }); } catch (e) {}
      for (let i = 0; i < 10; i++) { await p.mouse.wheel(0, 3000); await p.waitForTimeout(600); }
      const cards = await p.evaluate(() => {
        const res = [];
        const seen = new Set();
        document.querySelectorAll('a[href^="/explore/sections/"]').forEach(a => {
          const href = a.getAttribute('href'); if (seen.has(href)) return; seen.add(href);
          let c = a; for (let i = 0; i < 6 && c.parentElement; i++) { c = c.parentElement; if (c.querySelectorAll('a[href^="/explore/sites/"]').length) break; }
          const tags = [...c.querySelectorAll('a[href^="/explore/sites/"]')].map(t => t.getAttribute('href').replace('/explore/sites/', ''));
          const img = c.querySelector('img');
          const text = (c.innerText || '').replace(/\s+/g, ' ').trim();
          res.push({ href, tags, alt: img ? img.alt : '', text: text.slice(-80) });
        });
        return res;
      });
      all[slug] = cards;
      console.log(slug, cards.length);
    } catch (e) { console.log(slug, 'ERR', String(e).slice(0, 150)); }
    await p.close();
  }
  fs.writeFileSync(out, JSON.stringify(all, null, 1));
  await b.close();
})();
