// Renders every still image from the 3D kit into public/img, as WebP with transparency.
// Needs Playwright with Chromium (npm i playwright@1.48.2 somewhere on NODE_PATH). Run from the project root:
//   NODE_PATH=/path/to/node_modules node research/tools/render-stills.js
const { chromium } = require('playwright');
const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'public/img');
/* published path -> file on disk */
const FILES = {
  'three.module.js': 'node_modules/three/build/three.module.js',
  'kit.js': 'src/three/kit.js',
  'stills.js': 'src/three/stills.js',
  'bp3d.js': 'src/three/bp3d.js',
  'stills.html': 'research/tools/stills.html',
  'poster.html': 'research/tools/poster.html',
};
/* still name -> output file */
const STILLS = { choose: 's-choose.webp', split: 's-split.webp', pay: 's-pay.webp', wallet: 'f-wallet.webp', save: 'f-save.webp', tiers: 'f-tiers.webp' };
const TYPES = { '.js': 'text/javascript', '.html': 'text/html', '.webp': 'image/webp', '.png': 'image/png' };

function heroCycles() {
  const site = fs.readFileSync(path.join(ROOT, 'src/content/site.ts'), 'utf8');
  const block = site.slice(site.indexOf('cycles: ['), site.indexOf('] as Array'));
  return [...block.matchAll(/\[([\d_]+),\s*(\d+)\]/g)].map(m => [Number(m[1].replace(/_/g, '')), Number(m[2])]);
}

(async () => {
  const server = http.createServer((req, res) => {
    const name = decodeURIComponent(req.url.split('?')[0].slice(1));
    const file = FILES[name] || (name.startsWith('img/') ? path.join('public', name) : null);
    if (!file) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(name)] || 'application/octet-stream' });
    fs.createReadStream(path.join(ROOT, file)).pipe(res);
  }).listen(0, '127.0.0.1');
  await new Promise(r => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const save = async (page, file) => {
    const data = await page.evaluate(() => document.getElementById('c').toDataURL('image/webp', .9));
    fs.writeFileSync(path.join(OUT, file), Buffer.from(data.split(',')[1], 'base64'));
    console.log(file, Math.round(fs.statSync(path.join(OUT, file)).size / 1024) + ' KB');
  };
  try {
    for (const [name, file] of Object.entries(STILLS)) {
      const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
      page.on('pageerror', e => console.log(name, 'error:', e.message));
      await page.goto(`${base}stills.html?name=${name}`);
      await page.waitForFunction(() => window.done, null, { timeout: 30000 });
      const done = await page.evaluate(() => window.done);
      if (done !== 'ok') throw new Error(`${name}: ${done}`);
      await save(page, file); await page.close();
    }
    const page = await browser.newPage({ viewport: { width: 900, height: 918 } });
    await page.goto(`${base}poster.html?cycles=${encodeURIComponent(JSON.stringify(heroCycles()))}`);
    await page.waitForFunction(() => window.done, null, { timeout: 30000 });
    await save(page, 'hero-poster.webp'); await page.close();
  } finally {
    await browser.close(); server.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
