/* BiD Pay 3D kit. Every object on the page is made from one material, soft clay, in two strong tones: charcoal
   and brand orange, with white only for small details and printing. Tier medals add the colours people already
   read as levels (bronze, silver, gold), in the same clay. One studio light for everything. The live hero scene
   (bp3d.js) and the still images (stills.js) both build from here, so they cannot drift apart.
   three.js r128, pinned: the colour and lighting code targets that release. */
import * as T from 'three';

export { T };

/* ---------- the palette and the material ---------- */
export const ORANGE = 0xe2580a, DARK = 0x2a2c33, WHITE = 0xf7f5f1, INK = 0x16181d;
export const BRONZE = 0xb8743f, SILVER = 0xc2c7cf, GOLD = 0xeeac36;
/* colours are written as sRGB hex; r128 needs them converted, or the orange washes out */
export const C = hex => new T.Color(hex).convertSRGBToLinear();
/* how much of the overhead light each tone takes: warm colours take less, so a face turned up stays its colour
   instead of turning peach; charcoal takes a little more, so its form still reads */
const GLOW = { [ORANGE]: .62, [GOLD]: .62, [BRONZE]: .7, [DARK]: 1.15 };
/* soft clay: matte with a faint satin coat. The only material. */
export const clay = (color = DARK, o) => new T.MeshPhysicalMaterial(Object.assign({ color: C(color), roughness: .5, metalness: 0, clearcoat: .28, clearcoatRoughness: .42, envMapIntensity: GLOW[color] || 1 }, o || {}));

export const clamp = v => Math.min(1, Math.max(0, v));
export const inCubic = x => x * x * x;
export const outQuint = x => 1 - Math.pow(1 - x, 5);
export const inOut = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
export const money = n => Math.round(n).toLocaleString('en-US') + '₮';

/* Family used for text drawn into textures; the page passes its loaded web font in. */
let FONT = 'Geologica, "Golos Text", Arial, sans-serif';
export const setFont = f => { if (f) FONT = f; };

/* ---------- geometry ---------- */
export function rrShape(w, h, r) {
  const s = new T.Shape(), x = -w / 2, y = -h / 2; r = Math.max(.0005, Math.min(r, w / 2, h / 2));
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false); return s;
}
/* box with rounded corners (front view) and rounded edges; w along x, h along y, d along z */
export function rbox(w, h, d, r, b) {
  b = Math.min(b == null ? r * .6 : b, d / 2 - .0005, w / 2 - .001, h / 2 - .001);
  const g = new T.ExtrudeGeometry(rrShape(w - 2 * b, h - 2 * b, Math.max(r - b, .001)), { depth: d - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 5, curveSegments: 10 });
  g.center(); return weld(g);
}
/* merge duplicate vertices so bevels shade as one smooth surface */
function weld(g) {
  const p = g.attributes.position, seen = new Map(), idx = [], np = [];
  for (let i = 0; i < p.count; i++) { const k = Math.round(p.getX(i) * 1e4) + '_' + Math.round(p.getY(i) * 1e4) + '_' + Math.round(p.getZ(i) * 1e4); let j = seen.get(k); if (j === undefined) { j = np.length / 3; seen.set(k, j); np.push(p.getX(i), p.getY(i), p.getZ(i)); } idx.push(j); }
  const o = new T.BufferGeometry(); o.setAttribute('position', new T.Float32BufferAttribute(np, 3)); o.setIndex(idx); o.computeVertexNormals(); return o;
}
/* disc with softened rim, axis along y */
function disc(r, h, b) {
  const p = [new T.Vector2(0, -h / 2), new T.Vector2(r - b, -h / 2)];
  for (let i = 1; i < 6; i++) { const a = -Math.PI / 2 + (Math.PI / 2) * (i / 6); p.push(new T.Vector2(r - b + Math.cos(a) * b, -h / 2 + b + Math.sin(a) * b)); }
  for (let i = 0; i <= 6; i++) { const a = (Math.PI / 2) * (i / 6); p.push(new T.Vector2(r - b + Math.cos(a) * b, h / 2 - b + Math.sin(a) * b)); }
  p.push(new T.Vector2(0, h / 2)); return new T.LatheGeometry(p, 64);
}
/* five-pointed star, extruded along z with a soft bevel */
function star(outer, inner, depth) {
  const s = new T.Shape();
  for (let i = 0; i < 10; i++) { const a = Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? inner : outer; if (i) s.lineTo(Math.cos(a) * r, Math.sin(a) * r); else s.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
  const g = new T.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: depth * .5, bevelSize: outer * .06, bevelSegments: 4 }); g.center(); return g;
}
export const mesh = (g, m, x, y, z) => { const o = new T.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); return o; };
export function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; if (draw) draw(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 8; return t; }
/* set the largest font, up to `size`, at which `text` fits in `max` pixels */
export function fitFont(c, text, weight, size, max) { do { c.font = weight + ' ' + size + 'px ' + FONT; size -= 4; } while (size > 12 && c.measureText(text).width > max); }
/* printing: drawn white on the canvas, tinted by the material colour (white on the charcoal and orange clay) */
const ink = (tex, color = WHITE) => new T.MeshBasicMaterial({ map: tex, color: C(color), transparent: true, toneMapped: false, depthWrite: false });
/* a flat face carrying a texture, with uvs spread over its full rectangle */
function printed(w, h, r, tex) {
  const sg = new T.ShapeGeometry(rrShape(w, h, r), 16), p = sg.attributes.position, uv = sg.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + .5, p.getY(i) / h + .5);
  return new T.Mesh(sg, ink(tex));
}

/* ---------- renderer and studio light ---------- */
export function setup(canvas, opt) {
  opt = opt || {};
  const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: !!opt.keep });
  renderer.outputEncoding = T.sRGBEncoding; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05; renderer.setClearColor(0x000000, 0);
  const scene = new T.Scene();
  const pm = new T.PMREMGenerator(renderer), room = new T.Scene();
  room.add(new T.Mesh(new T.SphereGeometry(30, 32, 16), new T.MeshBasicMaterial({ color: C(0xa9aeb8), side: T.BackSide })));
  const lamp = (w, h, p, col, k) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(col).multiplyScalar(k), side: T.DoubleSide })); m.position.set(p[0], p[1], p[2]); m.lookAt(0, 0, 0); room.add(m); };
  lamp(18, 18, [0, 14, 3], 0xffffff, 3); lamp(9, 12, [-12, 4, 7], 0xfff0de, 2.3); lamp(7, 12, [13, 3, 2], 0xe4eeff, 1.5); lamp(12, 5, [0, -2, 14], 0xffffff, .9); lamp(30, 30, [0, -12, 0], 0xd8dce4, .55);
  scene.environment = pm.fromScene(room, .035).texture; pm.dispose();
  const key = new T.DirectionalLight(0xffffff, .5); key.position.set(-3, 6, 5); scene.add(key);
  const camera = new T.PerspectiveCamera(30, 1, .1, 80); camera.position.set(0, .7, 9); camera.lookAt(0, 0, 0);
  return { renderer, scene, camera };
}

/* soft round shadow on the floor */
export function shadow(w, d, opacity) {
  const tex = canvasTex(256, 256, (c, s) => { const g = c.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); g.addColorStop(0, 'rgba(48,36,24,.6)'); g.addColorStop(.55, 'rgba(48,36,24,.18)'); g.addColorStop(1, 'rgba(48,36,24,0)'); c.fillStyle = g; c.fillRect(0, 0, s, s); });
  const m = mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, opacity }));
  m.rotation.x = -Math.PI / 2; m.scale.set(w, d, 1); return m;
}

/* ---------- the phone: a charcoal clay body around the real app screen ---------- */
export function phone(src, ready) {
  const g = new T.Group(), W = 1.42, H = 2.94, D = .15, R = .25, body = clay(DARK);
  const face = (w, h, r, m, z) => { const sg = new T.ShapeGeometry(rrShape(w, h, r), 16), p = sg.attributes.position, uv = sg.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + .5, p.getY(i) / h + .5); return mesh(sg, m, 0, 0, z); };
  g.add(mesh(rbox(W, H, D, R, .05), body));
  g.add(face(W - .06, H - .06, R - .03, new T.MeshPhysicalMaterial({ color: C(0x0b0c0f), roughness: .1, clearcoat: 1, clearcoatRoughness: .05 }), D / 2 + .0015));
  const tex = new T.TextureLoader().load(src, () => ready && ready()); tex.encoding = T.sRGBEncoding; tex.anisotropy = 8;
  g.add(face(W - .15, H - .15, R - .075, new T.MeshBasicMaterial({ map: tex, toneMapped: false }), D / 2 + .003));
  g.add(mesh(rbox(.64, .66, .05, .17, .02), body, -.3, .98, -D / 2 - .02));
  [[-.44, 1.13], [-.16, 1.13], [-.3, .85]].forEach(q => { const l = mesh(new T.CylinderGeometry(.11, .11, .06, 36), new T.MeshPhysicalMaterial({ color: C(0x0b0c0f), roughness: .15, clearcoat: 1 }), q[0], q[1], -D / 2 - .05); l.rotation.x = Math.PI / 2; g.add(l); });
  g.add(mesh(rbox(.03, .36, .05, .012, .008), body, W / 2 + .004, .55, 0)); g.add(mesh(rbox(.03, .22, .05, .012, .008), body, -W / 2 - .004, .8, 0)); g.add(mesh(rbox(.03, .22, .05, .012, .008), body, -W / 2 - .004, .5, 0));
  return g;
}

/* ---------- the amount: one charcoal slab, cut into any number of payments from 2 to 6 ---------- */
export const CUT = 1.3, FLIP = 2, PAID = 3.1;
export function slab(opt) {
  opt = opt || {};
  const label = opt.label || (n => n + '-р төлөлт');
  const W = 4.24, PH = .66, PD = .24, G = .12, MAX = 6, g = new T.Group(), dark = C(DARK), orange = C(ORANGE);
  const wholeTex = canvasTex(2048, 320), whole = new T.Group();
  whole.add(mesh(rbox(W, PH, PD, .1, .045), clay(DARK)));
  whole.add(mesh(new T.PlaneGeometry(W, PH), ink(wholeTex), 0, 0, PD / 2 + .004)); g.add(whole);
  const shapes = {}, shapeFor = n => shapes[n] || (shapes[n] = { box: rbox(W / n, PH, PD, .1, .045), face: new T.PlaneGeometry(W / n, PH) });
  const pieces = Array.from({ length: MAX }, () => {
    const p = new T.Group(), s = shapeFor(4), m = mesh(s.box, clay(DARK)); p.add(m);
    const ft = wholeTex.clone(); ft.needsUpdate = true;
    const front = mesh(s.face, ink(ft), 0, 0, PD / 2 + .004); p.add(front);
    const bm = ink(null), back = mesh(s.face, bm, 0, 0, -PD / 2 - .004); back.rotation.x = Math.PI; p.add(back);
    p.visible = false; p.userData = { m, front, back, ft, bm, bt: null }; g.add(p); return p;
  });
  const blades = Array.from({ length: MAX - 1 }, () => { const b = mesh(new T.PlaneGeometry(.03, PH * 2.6), new T.MeshBasicMaterial({ color: C(ORANGE), transparent: true, toneMapped: false, depthWrite: false }), 0, 0, PD / 2 + .06); b.visible = false; g.add(b); return b; });
  let amount = 0, parts = 4;
  /* a new amount and/or a new number of payments */
  function set(value, n) {
    if (value != null) amount = value; if (n != null) parts = Math.max(2, Math.min(MAX, n));
    const s = shapeFor(parts), each = money(amount / parts);
    const c = wholeTex.image.getContext('2d'); c.clearRect(0, 0, 2048, 320); c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle';
    fitFont(c, money(amount), 600, 196, 2048 * .9); c.fillText(money(amount), 1024, 170); wholeTex.needsUpdate = true;
    pieces.forEach((p, i) => {
      const u = p.userData; if (i >= parts) { p.visible = false; return; }
      u.m.geometry = s.box; u.front.geometry = s.face; u.back.geometry = s.face;
      u.ft.repeat.set(1 / parts, 1); u.ft.offset.set(i / parts, 0); u.ft.needsUpdate = true;
      if (u.bt) u.bt.dispose();
      u.bt = canvasTex(Math.round(320 * (W / parts) / PH), 320, (b, w) => {
        b.textAlign = 'center'; b.textBaseline = 'middle';
        b.fillStyle = 'rgba(255,255,255,.66)'; fitFont(b, label(i + 1), 500, 48, w * .84); b.fillText(label(i + 1), w / 2, 98);
        b.fillStyle = '#fff'; fitFont(b, each, 600, 92, w * .86); b.fillText(each, w / 2, 204);
      });
      u.bm.map = u.bt; u.bm.needsUpdate = true;
    });
  }
  /* t: seconds into the cycle, D: cycle length. Cut at CUT, pieces turn to show their payment at FLIP, the first is paid at PAID. */
  function pose(t, D) {
    const n = parts, pw = W / n, cut = t >= CUT, end = D - 1.25, close = 1 - inOut(clamp((t - (end + .35)) / .5));
    whole.visible = !cut;
    const gaps = []; let sum = 0;
    for (let k = 0; k < n - 1; k++) { const gk = outQuint(clamp((t - (CUT + .04 + k * .05)) / .7)) * G * close; gaps.push(gk); sum += gk; }
    pieces.forEach((p, i) => {
      if (i >= n) { p.visible = false; return; }
      p.visible = cut; let x = (i - (n - 1) / 2) * pw - sum / 2; for (let k = 0; k < i; k++) x += gaps[k];
      const paid = i === 0 ? clamp((t - PAID) / .35) * (1 - clamp((t - end) / .25)) : 0;
      p.position.set(x, 0, paid * .1);
      p.rotation.x = Math.PI * (inOut(clamp((t - (FLIP + i * .07)) / .7)) - inOut(clamp((t - (end + i * .04)) / .5)));
      p.userData.m.material.color.copy(dark).lerp(orange, paid);
      p.userData.m.material.envMapIntensity = 1.15 - .53 * paid;
    });
    blades.forEach((b, k) => {
      if (k >= n - 1) { b.visible = false; return; }
      const u = clamp((t - (CUT - .1 + k * .05)) / .24), s = Math.sin(u * Math.PI);
      b.visible = u > 0 && u < 1; b.position.x = (k + 1) * pw - W / 2; b.scale.y = Math.max(.001, s); b.material.opacity = s;
    });
  }
  return { g, set, pose, width: W };
}

/* ---------- still-life objects. Each sits on y = 0 and faces the camera; the caller turns it. ---------- */

/* a shopping bag: orange, with charcoal handles */
export function bag() {
  const g = new T.Group();
  g.add(mesh(rbox(1.5, 1.7, .64, .07, .045), clay(ORANGE), 0, .85, 0));
  g.add(mesh(rbox(1.52, .12, .66, .04, .03), clay(ORANGE), 0, 1.64, 0));
  [-.2, .2].forEach(z => g.add(mesh(new T.TorusGeometry(.34, .05, 18, 56, Math.PI), clay(DARK), 0, 1.7, z)));
  return g;
}

/* the price, cut into charcoal pieces; `paid` pieces are orange. No figures printed: this is the idea, not an offer. */
export function pieces(n, paid, opt) {
  opt = opt || {};
  const g = new T.Group(), w = opt.width || 1.12, h = .7, d = .3, gap = opt.gap == null ? .2 : opt.gap;
  for (let i = 0; i < n; i++) {
    const on = i < (paid || 0), m = mesh(rbox(w, h, d, .12, .05), clay(on ? ORANGE : DARK));
    m.position.set((i - (n - 1) / 2) * (w + gap), h / 2 + (on ? .06 : 0), on ? .12 : 0);
    m.rotation.z = opt.tilt ? (i - (n - 1) / 2) * -.035 : 0;
    g.add(m);
  }
  return g;
}

/* two cards: a charcoal BiD card in front of an orange one */
export function cards() {
  const g = new T.Group(), w = 2.7, h = 1.7, d = .06;
  /* this card faces the overhead light more than anything else, so it takes even less of it */
  const back = mesh(rbox(w, h, d, .16, .02), clay(ORANGE, { envMapIntensity: .36 })); back.position.set(.42, .36, -.34); back.rotation.z = .1; g.add(back);
  const front = new T.Group(); front.add(mesh(rbox(w, h, d, .16, .02), clay(DARK)));
  const face = canvasTex(1080, 680, (c, W, H) => {
    c.fillStyle = '#fff'; c.textBaseline = 'alphabetic';
    c.font = '600 84px ' + FONT; c.fillText('BiD', 76, 146);
    c.font = '500 46px ' + FONT; c.globalAlpha = .6; c.fillText('••••  ••••  ••••  4173', 76, H - 82); c.globalAlpha = 1;
  });
  const print = printed(w - .02, h - .02, .15, face); print.position.z = d / 2 + .002; front.add(print);
  front.add(mesh(rbox(.42, .32, .03, .06, .012), clay(GOLD), -w / 2 + .5, .0, d / 2 + .012));
  front.position.set(-.18, .0, .1); front.rotation.z = -.04; g.add(front);
  g.rotation.x = -.5; g.position.y = .95;
  const o = new T.Group(); o.add(g); return o;
}

/* savings: three stacks of orange coins, rising */
export function coins() {
  const g = new T.Group(), geo = disc(.52, .13, .045), mat = clay(ORANGE), heights = [3, 5, 8];
  heights.forEach((n, s) => {
    for (let i = 0; i < n; i++) g.add(mesh(geo, mat, (s - 1) * 1.2 + Math.sin(i * 7.1 + s) * .02, .065 + i * .14, (s - 1) * -.22 + Math.cos(i * 4.3 + s) * .02));
  });
  return g;
}

/* tiers: four medals, each larger and higher than the last, in the colours people read as levels:
   charcoal (Standard), bronze, silver, gold. A raised star on each; no words needed. */
export function medals() {
  const g = new T.Group(), tones = [DARK, BRONZE, SILVER, GOLD], sizes = [.48, .6, .74, .9];
  let x = -2.3;
  tones.forEach((tone, i) => {
    const r = sizes[i], m = new T.Group(), body = clay(tone);
    /* a thick disc, a raised rim, a deep star, and a loop at the top so it reads as a medal, not a coin */
    const face = mesh(disc(r, .22, .07), body); face.rotation.x = Math.PI / 2; m.add(face);
    const rim = mesh(new T.TorusGeometry(r * .8, r * .05, 14, 72), body, 0, 0, .1); m.add(rim);
    m.add(mesh(star(r * .52, r * .22, .14), body, 0, 0, .19));
    const loop = mesh(new T.TorusGeometry(r * .14, r * .045, 12, 32), body, 0, r + r * .1, 0); m.add(loop);
    m.rotation.set(-.12, .38, 0);
    x += r; m.position.set(x, r + i * .36, i * .06); x += r + .16;
    g.add(m);
  });
  return g;
}
