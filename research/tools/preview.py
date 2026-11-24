"""Builds the shareable review copy of the landing page from the production build.

The published review link (a claude.ai artifact) cannot run the Next.js app, so this takes the page markup that
`npm run build` prerenders, removes Next's scripts, inlines the stylesheet, and adds preview.js, which reproduces
the page's client behaviour. The 3D scene is the production module itself, with `three` loaded from cdnjs.

Usage, from the project root, after `npm run build`:
    python3 research/tools/preview.py <out-dir>
The out-dir then holds index.html, preview.js, bp3d.js, kit.js and img/, ready to publish or to serve locally.
"""
import json
import os
import re
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERE = os.path.dirname(os.path.abspath(__file__))
THREE = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js'
FONTS = 'https://fonts.googleapis.com/css2?family=Geologica:wght@400..700&family=Golos+Text:wght@400..600&display=swap'
# Same check as layout.tsx: play the 3D scene only when motion is allowed and WebGL exists.
GATE = "(function(){try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&window.WebGLRenderingContext)document.documentElement.setAttribute('data-3d','')}catch(e){}})()"


def read(path):
    with open(os.path.join(ROOT, path), encoding='utf-8') as f:
        return f.read()


def main(out):
    os.makedirs(os.path.join(out, 'img'), exist_ok=True)

    page = read('.next/server/app/index.html')
    body = page[page.index('<body'):]
    body = body[body.index('>') + 1:body.rindex('</body>')]
    body = re.sub(r'<script\b[^>]*>.*?</script>', '', body, flags=re.S)
    body = re.sub(r'<div hidden="">.*?</div>', '', body, count=1, flags=re.S)
    body = body.replace('="/img/', '="img/')
    if '/_next/' in body:
        raise SystemExit('Next.js asset paths left in the markup: ' + ', '.join(sorted(set(re.findall(r'/_next/[^"\s]+', body)))[:5]))

    css = read('src/app/globals.css')
    css = ':root { --font-head: "Geologica"; --font-body: "Golos Text" }\n' + css

    html = '\n'.join([
        '<title>BID Pay Landing</title>',
        '<meta name="claude:viewport-fit-sides" content="cover">',
        f'<link rel="stylesheet" href="{FONTS}">',
        f'<style>\n{css}</style>',
        f'<script>{GATE}</script>',
        f'<div lang="mn">{body}</div>',
        '<script type="module" src="preview.js"></script>',
        '',
    ])
    with open(os.path.join(out, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html)

    # The hero scene and the kit it is built from; only the kit imports three, which comes from cdnjs here.
    kit = read('src/three/kit.js')
    if "import * as T from 'three';" not in kit:
        raise SystemExit('src/three/kit.js no longer imports three the expected way')
    with open(os.path.join(out, 'kit.js'), 'w', encoding='utf-8') as f:
        f.write(kit.replace("import * as T from 'three';", f"import * as T from '{THREE}';"))
    scene = read('src/three/bp3d.js')
    if "from 'three'" in scene:
        raise SystemExit('src/three/bp3d.js imports three directly; route it through kit.js')
    with open(os.path.join(out, 'bp3d.js'), 'w', encoding='utf-8') as f:
        f.write(scene)

    site = read('src/content/site.ts')
    block = site[site.index('cycles: ['):]
    block = block[:block.index('] as Array')]
    cycles = [[int(a.replace('_', '')), int(b)] for a, b in re.findall(r'\[([\d_]+),\s*(\d+)\]', block)]
    if not cycles:
        raise SystemExit('could not read hero.cycles from src/content/site.ts')
    with open(os.path.join(HERE, 'preview.js'), encoding='utf-8') as f:
        script = f.read().replace('__CYCLES__', json.dumps(cycles))
    with open(os.path.join(out, 'preview.js'), 'w', encoding='utf-8') as f:
        f.write(script)

    used = sorted(set(re.findall(r'img/([\w.-]+)', body)) | {'app-home.webp'})
    for name in used:
        shutil.copyfile(os.path.join(ROOT, 'public', 'img', name), os.path.join(out, 'img', name))
    print(f'{out}: index.html {len(html) // 1024} KB, {len(used)} images, cycles {cycles}')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    main(os.path.abspath(sys.argv[1]))
