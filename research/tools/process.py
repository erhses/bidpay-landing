# Converts raw captures into web-sized images and extracts a palette for each reference.
# usage: process.py shotsDir outImgDir id...
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from best import best
from PIL import Image
d, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
res = {}
def hexc(c): return '#%02x%02x%02x' % tuple(c)
def palette(im):
    q = im.resize((160, 100)).quantize(colors=12, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette(); cnt = sorted(q.getcolors(), reverse=True)
    cols = [(n, tuple(pal[i*3:i*3+3])) for n, i in cnt]
    picked = []
    for n, c in cols:
        if all(sum(abs(a-b) for a, b in zip(c, p)) > 70 for p in picked): picked.append(c)
        if len(picked) == 5: break
    return [hexc(c) for c in picked]
for i in sys.argv[3:]:
    r = {}
    hp = os.path.join(d, i + '-hero.png')
    if not os.path.exists(hp): print(i, 'missing hero'); continue
    hero = Image.open(hp).convert('RGB'); r['palette'] = palette(hero)
    h = hero.resize((1200, int(hero.height * 1200 / hero.width)), Image.LANCZOS); h.save(os.path.join(out, i + '-hero.webp'), quality=80, method=6)
    src = best(d, i)
    full = Image.open(src).convert('RGB')
    if full.height > 11700: full = full.crop((0, 0, full.width, 11700))
    f = full.resize((760, int(full.height * 760 / full.width)), Image.LANCZOS); f.save(os.path.join(out, i + '-page.webp'), quality=64, method=6)
    r['pageH'] = f.height; r['pageSrc'] = os.path.basename(src)
    mp = os.path.join(d, i + '-mobile.png')
    if os.path.exists(mp):
        m = Image.open(mp).convert('RGB'); m = m.resize((390, int(m.height * 390 / m.width)), Image.LANCZOS); m.save(os.path.join(out, i + '-mobile.webp'), quality=78, method=6); r['mobile'] = True
    fj = os.path.join(d, i + '.json')
    if os.path.exists(fj):
        x = json.load(open(fj)).get('facts', {})
        fonts = []
        for f_ in x.get('fonts', []):
            f_ = f_.strip('_'); 
            if f_.startswith('_'): f_ = f_.strip('_')
            import re
            f_ = re.sub(r'_[0-9a-f]{5,}$', '', f_).replace('_', ' ').strip()
            if f_.lower() in ('times new roman', 'arial', 'sans-serif', '-apple-system', 'system-ui', 'serif', 'helvetica', 'ui-sans-serif', 'blinkmacsystemfont', 'segoe ui'): continue
            if f_ and f_ not in fonts: fonts.append(f_)
        r['fonts'] = fonts[:3]; r['title'] = x.get('title', '')
    res[i] = r; print(i, r.get('palette'), r.get('fonts'), r['pageH'], r['pageSrc'])
json.dump(res, open(os.path.join(out, '_meta.json'), 'w'), indent=1)
