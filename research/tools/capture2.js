// Usage: node capture2.js <outDir> <id>=<url> ...
// One pass per site: first-screen shot, scroll frames (stitched later), page facts, phone shot.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const MUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const VH = 900, MAXF = 12;
const BTN = [...(process.env.DISMISS ? process.env.DISMISS.split(',') : []), 'Reject all', 'Reject All', 'Decline', 'Decline all', 'Reject', 'Only necessary', 'Necessary only', 'Deny', 'Continue', 'Accept all', 'Accept All', 'Accept', 'Got it', 'I agree', 'Agree', 'OK', 'Okay', 'Принять', 'Понятно', 'Хорошо', 'Согласен', 'Зөвшөөрөх', 'Хаах'];

async function tidy(page) {
  if (process.env.ESC) { try { await page.keyboard.press('Escape'); await page.waitForTimeout(400); await page.mouse.click(12, 500); await page.waitForTimeout(600); } catch (e) {} }
  for (const sel of (process.env.CLICKSEL ? process.env.CLICKSEL.split('|') : [])) { try { await page.locator(sel).first().click({ timeout: 1500 }); await page.waitForTimeout(600); } catch (e) {} }
  for (const l of BTN) {
    try { const b = page.getByRole('button', { name: l, exact: true }).first(); if (await b.isVisible({ timeout: 150 })) { await b.click({ timeout: 800 }); await page.waitForTimeout(400); break; } } catch (e) {}
  }
  // Remove small pinned boxes that talk about cookies (never anything covering most of the screen).
  try {
    await page.evaluate(() => {
      const words = ['cookie', 'Cookie', 'куки', 'cookies'];
      [...document.querySelectorAll('body *')].filter(e => e.children.length === 0 && words.some(w => (e.textContent || '').includes(w))).forEach(e => {
        let c = e;
        while (c && c !== document.body) {
          const s = getComputedStyle(c);
          if (s.position === 'fixed' || s.position === 'sticky') { const r = c.getBoundingClientRect(); if (r.width * r.height < innerWidth * innerHeight * 0.45) c.remove(); return; }
          c = c.parentElement;
        }
      });
    });
  } catch (e) {}
}
async function facts(page) {
  return await page.evaluate(() => {
    const cs = el => getComputedStyle(el); const fontCount = {};
    [...document.querySelectorAll('body *')].slice(0, 2500).forEach(e => { const f = cs(e).fontFamily.split(',')[0].replace(/["']/g, '').trim(); fontCount[f] = (fontCount[f] || 0) + 1; });
    const heads = [...document.querySelectorAll('h1,h2,h3')].map(h => h.tagName + ':' + (h.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 90)).filter(x => x.length > 4).slice(0, 26);
    return { title: document.title, lang: document.documentElement.lang, height: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight), fonts: Object.entries(fontCount).sort((a, b) => b[1] - a[1]).slice(0, 8).map(e => e[0]), heads, qr: document.querySelectorAll('[class*="qr" i], img[src*="qr" i], img[alt*="qr" i], canvas[class*="qr" i]').length };
  });
}
async function one(browser, outDir, id, url) {
  const rec = { id, url };
  const ctx = await browser.newContext({ viewport: { width: 1440, height: VH }, userAgent: UA, locale: 'en-US' });
  const page = await ctx.newPage(); page.setDefaultTimeout(20000);
  const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  rec.status = resp ? resp.status() : 0; rec.finalUrl = page.url();
  try { await page.waitForLoadState('networkidle', { timeout: 10000 }); } catch (e) {}
  await page.waitForTimeout(2200); await tidy(page); await page.waitForTimeout(500);
  const dir = path.join(outDir, id + '-frames'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  try { rec.facts = await facts(page); } catch (e) { rec.facts = {}; }
  for (let n = 0; n < MAXF; n++) {
    const y = await page.evaluate(() => Math.round(window.scrollY));
    await page.waitForTimeout(n === 0 ? 200 : 850);
    await page.screenshot({ path: path.join(dir, String(n).padStart(2, '0') + '.png'), timeout: 20000 });
    await page.evaluate(() => { document.querySelectorAll('body *').forEach(e => { const s = getComputedStyle(e); if (s.position !== 'fixed' && s.position !== 'sticky') return; const r = e.getBoundingClientRect(); if ((s.position === 'fixed' && r.width * r.height < innerWidth * innerHeight * 0.5) || (r.height < 140 && r.top < 60)) e.style.setProperty('visibility', 'hidden', 'important'); }); });
    await page.mouse.wheel(0, VH);
    let prev = -1, y2 = y;
    for (let k = 0; k < 14; k++) { await page.waitForTimeout(220); y2 = await page.evaluate(() => Math.round(window.scrollY)); if (y2 === prev) break; prev = y2; }
    if (y2 === y) { await page.evaluate(v => window.scrollBy({ top: v, behavior: 'instant' }), VH); await page.waitForTimeout(500); y2 = await page.evaluate(() => Math.round(window.scrollY)); if (y2 === y) break; }
    if (y2 - y < VH - 6) { await page.waitForTimeout(850); await page.screenshot({ path: path.join(dir, String(n + 1).padStart(2, '0') + '.png'), timeout: 20000 }); fs.writeFileSync(path.join(dir, 'last.txt'), String(y2 - y)); break; }
    if (y2 - y > VH + 6) { await page.evaluate(t => window.scrollTo({ top: t, behavior: 'instant' }), y + VH); await page.waitForTimeout(300); }
  }
  await ctx.close();
  fs.copyFileSync(path.join(dir, '00.png'), path.join(outDir, id + '-hero.png'));
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: MUA, locale: 'en-US' });
  const mp = await m.newPage(); mp.setDefaultTimeout(20000);
  try { await mp.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 }); try { await mp.waitForLoadState('networkidle', { timeout: 8000 }); } catch (e) {} await mp.waitForTimeout(1800); await tidy(mp); await mp.waitForTimeout(400); await mp.screenshot({ path: path.join(outDir, id + '-mobile.png'), timeout: 20000 }); } catch (e) { rec.mobileError = String(e).slice(0, 120); }
  await m.close();
  rec.frames = fs.readdirSync(dir).filter(f => f.endsWith('.png')).length; rec.ok = true;
  return rec;
}
(async () => {
  const [outDir, ...pairs] = process.argv.slice(2);
  for (const p of pairs) {
    const i = p.indexOf('='); const id = p.slice(0, i), url = p.slice(i + 1);
    let rec = { id, url, ok: false }; let browser;
    try {
      browser = await chromium.launch();
      rec = await Promise.race([one(browser, outDir, id, url), new Promise((_, rej) => setTimeout(() => rej(new Error('watchdog: site took over 170s')), 170000))]);
    } catch (e) { rec.error = String(e).slice(0, 200); }
    try { await browser.close(); } catch (e) {}
    fs.writeFileSync(path.join(outDir, id + '.json'), JSON.stringify(rec, null, 1));
    console.log(id, rec.ok ? 'ok frames ' + rec.frames + ' status ' + rec.status : 'FAIL ' + rec.error);
  }
})();
