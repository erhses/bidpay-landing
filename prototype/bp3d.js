/* BiD Pay 3D kit. Small procedural models, lit by a generated studio environment, drawn with three.js r128.
   Used live in the hero and offline to render the still images in the feature cards. */
(function () {
  const T = window.THREE; if (!T) return;
  const BP = (window.BP3D = {});
  const ORANGE = 0xf67420;
  const C = hex => new T.Color(hex).convertSRGBToLinear();
  const clamp = v => Math.min(1, Math.max(0, v));
  const outCubic = x => 1 - Math.pow(1 - x, 3), inCubic = x => x * x * x;
  const outBack = x => 1 + 2.4 * Math.pow(x - 1, 3) + 1.4 * Math.pow(x - 1, 2);

  /* ---------- geometry helpers ---------- */
  function rrShape(w, h, r) {
    const s = new T.Shape(), x = -w / 2, y = -h / 2; r = Math.max(.0005, Math.min(r, w / 2, h / 2));
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
    s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
    s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
    s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false); return s;
  }
  /* box with rounded corners (front view) and rounded edges; w along x, h along y, d along z */
  function rbox(w, h, d, r, b) {
    b = Math.min(b == null ? r * .6 : b, d / 2 - .0005, w / 2 - .001, h / 2 - .001);
    const g = new T.ExtrudeGeometry(rrShape(w - 2 * b, h - 2 * b, Math.max(r - b, .001)), { depth: d - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 5, curveSegments: 10 });
    g.center(); return weld(g);
  }
  function weld(g) {
    const p = g.attributes.position, seen = new Map(), idx = [], np = [];
    for (let i = 0; i < p.count; i++) { const k = Math.round(p.getX(i) * 1e4) + '_' + Math.round(p.getY(i) * 1e4) + '_' + Math.round(p.getZ(i) * 1e4); let j = seen.get(k); if (j === undefined) { j = np.length / 3; seen.set(k, j); np.push(p.getX(i), p.getY(i), p.getZ(i)); } idx.push(j); }
    const o = new T.BufferGeometry(); o.setAttribute('position', new T.Float32BufferAttribute(np, 3)); o.setIndex(idx); o.computeVertexNormals(); return o;
  }
  /* capsule lying along x */
  function pill(len, rad) {
    const p = [], n = 14, half = len / 2 - rad;
    for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + (Math.PI / 2) * (i / n); p.push(new T.Vector2(Math.cos(a) * rad, -half + Math.sin(a) * rad)); }
    for (let i = 0; i <= n; i++) { const a = (Math.PI / 2) * (i / n); p.push(new T.Vector2(Math.cos(a) * rad, half + Math.sin(a) * rad)); }
    const g = new T.LatheGeometry(p, 40); g.rotateZ(Math.PI / 2); return g;
  }
  /* disc with softened rim, axis along y */
  function coin(r, h, b) {
    const p = [new T.Vector2(0, -h / 2), new T.Vector2(r - b, -h / 2)];
    for (let i = 1; i < 6; i++) { const a = -Math.PI / 2 + (Math.PI / 2) * (i / 6); p.push(new T.Vector2(r - b + Math.cos(a) * b, -h / 2 + b + Math.sin(a) * b)); }
    for (let i = 0; i <= 6; i++) { const a = (Math.PI / 2) * (i / 6); p.push(new T.Vector2(r - b + Math.cos(a) * b, h / 2 - b + Math.sin(a) * b)); }
    p.push(new T.Vector2(0, h / 2)); return new T.LatheGeometry(p, 56);
  }
  const mesh = (g, m, x, y, z) => { const o = new T.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); return o; };
  const soft = (color, o) => new T.MeshPhysicalMaterial(Object.assign({ color: C(color), roughness: .36, metalness: 0, clearcoat: .55, clearcoatRoughness: .28 }, o || {}));
  const cloth = (color, o) => new T.MeshStandardMaterial(Object.assign({ color: C(color), roughness: .94, metalness: 0 }, o || {}));
  const metal = (color, rough) => new T.MeshStandardMaterial({ color: C(color), metalness: 1, roughness: rough == null ? .2 : rough });
  function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 8; return t; }
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };

  /* ---------- renderer, studio light ---------- */
  BP.setup = function (canvas, opt) {
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
    const camera = new T.PerspectiveCamera(30, 1, .1, 60); camera.position.set(0, .7, 9); camera.lookAt(0, -.05, 0);
    return { renderer, scene, camera };
  };
  BP.shadow = function (w, d, y) {
    const t = canvasTex(256, 256, (c, s) => { const g = c.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); g.addColorStop(0, 'rgba(40,24,10,.55)'); g.addColorStop(.6, 'rgba(40,24,10,.16)'); g.addColorStop(1, 'rgba(40,24,10,0)'); c.fillStyle = g; c.fillRect(0, 0, s, s); });
    const m = mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, opacity: .3 }), 0, y == null ? -1.02 : y, 0);
    m.rotation.x = -Math.PI / 2; m.scale.set(w || 2.3, d || 1, 1); return m;
  };

  /* ---------- things people buy ---------- */
  BP.headphones = function () {
    const g = new T.Group(), shell = soft(0xf6f1e8, { roughness: .3 }), dark = cloth(0x25272e, { roughness: .78 }), chrome = metal(0xdfe3e9, .16), accent = soft(ORANGE, { roughness: .28, clearcoat: 1 });
    g.add(mesh(new T.TorusGeometry(.96, .075, 20, 90, Math.PI), shell, 0, .3, 0));
    const pad = mesh(new T.TorusGeometry(.96, .1, 16, 40, Math.PI * .46), dark, 0, .3, 0); pad.rotation.z = Math.PI * .27; pad.scale.set(.975, .975, 1.55); g.add(pad);
    [-1, 1].forEach(s => {
      const cup = new T.Group(), body = mesh(rbox(.36, .86, .66, .16, .14), shell); cup.add(body);
      const disc = mesh(new T.CylinderGeometry(.21, .21, .035, 48), accent, s * .185, 0, 0); disc.rotation.z = Math.PI / 2; cup.add(disc);
      const ring = mesh(new T.TorusGeometry(.215, .018, 12, 48), chrome, s * .19, 0, 0); ring.rotation.y = Math.PI / 2; cup.add(ring);
      const cushion = mesh(new T.TorusGeometry(.25, .115, 18, 44), dark, -s * .2, 0, 0); cushion.scale.set(1, 1.32, 1); cushion.rotation.y = Math.PI / 2; cup.add(cushion);
      cup.add(mesh(new T.CylinderGeometry(.034, .034, .3, 16), chrome, 0, .56, 0));
      cup.position.set(s * .96, -.3, 0); cup.rotation.z = -s * .07; g.add(cup);
    });
    return { g, s: 1.08, ry: .55, rx: .12 };
  };
  BP.sofa = function () {
    const g = new T.Group(), fab = cloth(ORANGE), fab2 = cloth(0xff8b3e), cream = cloth(0xfaf1e2), wood = soft(0x7b4f2e, { roughness: .55, clearcoat: .2 });
    g.add(mesh(rbox(2.3, .44, 1.06, .15, .13), fab, 0, -.24, 0));
    const back = mesh(rbox(2.3, .98, .36, .17, .14), fab, 0, .22, -.42); back.rotation.x = -.13; g.add(back);
    [-1, 1].forEach(s => {
      g.add(mesh(rbox(.38, .74, 1.12, .17, .14), fab, s * 1.13, -.02, .02));
      g.add(mesh(rbox(.9, .22, .8, .1, .09), fab2, s * .47, .07, .1));
      const bc = mesh(rbox(.88, .52, .24, .12, .1), fab2, s * .47, .42, -.2); bc.rotation.x = -.22; g.add(bc);
      [-1, 1].forEach(z => g.add(mesh(new T.CylinderGeometry(.05, .035, .2, 16), wood, s * .95, -.55, z * .38)));
    });
    const pil = mesh(rbox(.44, .44, .17, .13, .08), cream, -.6, .36, .16); pil.rotation.set(-.32, .25, .3); g.add(pil);
    return { g, s: .98, ry: -.5, rx: .2 };
  };
  BP.laptop = function () {
    const g = new T.Group(), alu = new T.MeshStandardMaterial({ color: C(0xd3d8df), metalness: .92, roughness: .3 }), dark = soft(0x1c1e24, { roughness: .5, clearcoat: .2 });
    const base = mesh(rbox(2.15, 1.42, .09, .13, .03), alu, 0, -.5, 0); base.rotation.x = -Math.PI / 2; g.add(base);
    const keys = mesh(new T.PlaneGeometry(1.86, .62), dark, 0, -.452, -.2); keys.rotation.x = -Math.PI / 2; g.add(keys);
    const pad = mesh(new T.PlaneGeometry(.7, .42), new T.MeshStandardMaterial({ color: C(0xc3c8d0), metalness: .9, roughness: .2 }), 0, -.452, .42); pad.rotation.x = -Math.PI / 2; g.add(pad);
    const hinge = new T.Group(); hinge.position.set(0, -.46, -.7); hinge.rotation.x = -.3;
    hinge.add(mesh(rbox(2.15, 1.42, .06, .13, .022), alu, 0, .71, 0));
    const ui = canvasTex(1024, 664, (c, w, h) => {
      c.fillStyle = '#f3f4f6'; c.fillRect(0, 0, w, h); c.fillStyle = '#f67420'; c.fillRect(0, 0, w, 96);
      c.fillStyle = '#fff'; rr(c, 40, 30, 150, 36, 18); c.fill(); rr(c, w - 150, 30, 110, 36, 18); c.fill();
      const cols = ['#ffd9b8', '#cfe6ff', '#d3f1dc', '#ffe6a8'];
      for (let i = 0; i < 4; i++) { const x = 40 + i * 244; c.fillStyle = '#fff'; rr(c, x, 140, 212, 300, 26); c.fill(); c.fillStyle = cols[i]; rr(c, x + 16, 156, 180, 170, 18); c.fill(); c.fillStyle = '#16181d'; rr(c, x + 16, 346, 120, 16, 8); c.fill(); c.fillStyle = '#f67420'; rr(c, x + 16, 384, 180, 12, 6); c.fill(); c.fillStyle = '#e4e6eb'; c.fillRect(x + 16 + 45 - 2, 384, 4, 12); c.fillRect(x + 16 + 90 - 2, 384, 4, 12); c.fillRect(x + 16 + 135 - 2, 384, 4, 12); }
      c.fillStyle = '#fff'; rr(c, 40, 480, w - 80, 140, 26); c.fill(); c.fillStyle = '#16181d'; rr(c, 70, 514, 260, 22, 11); c.fill(); c.fillStyle = '#f67420'; rr(c, w - 290, 520, 220, 60, 30); c.fill();
    });
    hinge.add(mesh(new T.PlaneGeometry(2.0, 1.28), new T.MeshBasicMaterial({ map: ui, toneMapped: false }), 0, .71, .031)); g.add(hinge);
    g.position.y = -.1; const w = new T.Group(); w.add(g);
    return { g: w, s: 1.06, ry: -.52, rx: .2 };
  };
  BP.washer = function () {
    const g = new T.Group(), white = soft(0xfbfbf8, { roughness: .22, clearcoat: 1 }), grey = soft(0xe3e6ea, { roughness: .4 }), chrome = metal(0xe2e6ec, .12), glass = new T.MeshPhysicalMaterial({ color: C(0x18222e), roughness: .06, metalness: .3, clearcoat: 1, clearcoatRoughness: .04 });
    g.add(mesh(rbox(1.56, 1.86, 1.3, .15, .09), white));
    g.add(mesh(rbox(1.36, .27, .05, .09, .02), grey, 0, .7, .655));
    g.add(mesh(new T.TorusGeometry(.53, .075, 22, 72), chrome, 0, -.14, .66));
    g.add(mesh(new T.CircleGeometry(.5, 56), glass, 0, -.14, .668));
    g.add(mesh(new T.TorusGeometry(.33, .022, 12, 56), metal(0x8d96a3, .3), 0, -.14, .672));
    const laundry = mesh(new T.SphereGeometry(.3, 32, 20, 0, Math.PI * 2, 0, Math.PI * .5), soft(ORANGE, { roughness: .5, clearcoat: .2 }), 0, -.36, .5); laundry.scale.set(1, .5, .5); g.add(laundry);
    const knob = mesh(new T.CylinderGeometry(.09, .09, .08, 40), soft(ORANGE, { clearcoat: 1, roughness: .25 }), .44, .7, .7); knob.rotation.x = Math.PI / 2; g.add(knob);
    g.add(mesh(rbox(.34, .11, .03, .04, .01), soft(0x1c1e24, { roughness: .15, clearcoat: 1 }), -.02, .7, .685));
    g.add(mesh(rbox(.4, .15, .03, .05, .012), white, -.46, .7, .685));
    [-1, 1].forEach(s => [-1, 1].forEach(z => g.add(mesh(new T.CylinderGeometry(.06, .06, .08, 20), soft(0x2a2c33), s * .6, -.96, z * .5))));
    return { g, s: .9, ry: -.5, rx: .14 };
  };

  /* ---------- the payment bar: one bar that splits into four ---------- */
  BP.bar = function (len, rad) {
    const L = len || .47, R = rad || .1, g = new T.Group(), white = C(0xffffff), orange = C(ORANGE), geo = pill(L, R);
    const segs = [0, 1, 2, 3].map(() => { const m = mesh(geo, soft(0xffffff, { roughness: .2, clearcoat: 1, clearcoatRoughness: .1 })); g.add(m); return m; });
    function set(open, paid) { const gap = -2 * R + (2 * R + .075) * open; segs.forEach((m, i) => { m.position.x = (i - 1.5) * (L + gap); m.material.color.copy(white).lerp(orange, clamp(paid - i)); }); }
    set(1, 0); return { g, segs, set };
  };

  /* ---------- objects for the still renders ---------- */
  BP.card = function (color) {
    const g = new T.Group(), w = 2.7, h = 1.7, top = color === 'dark';
    const face = canvasTex(1080, 680, (c, W, H) => {
      const gr = c.createLinearGradient(0, 0, W, H); if (top) { gr.addColorStop(0, '#2b2e36'); gr.addColorStop(1, '#101115'); } else { gr.addColorStop(0, '#ff9c4f'); gr.addColorStop(1, '#ef6410'); } c.fillStyle = gr; c.fillRect(0, 0, W, H);
      c.globalAlpha = .13; c.fillStyle = '#fff'; c.beginPath(); c.arc(W * .82, H * .1, 330, 0, 7); c.fill(); c.beginPath(); c.arc(W * 1.02, H * .86, 300, 0, 7); c.fill(); c.globalAlpha = 1;
      c.fillStyle = '#fff'; c.font = '600 70px Geologica, Arial, sans-serif'; c.fillText('BiD', 70, 128); const bw = c.measureText('BiD').width; c.font = '300 70px Geologica, Arial, sans-serif'; c.fillText(' debit', 70 + bw, 128);
      const cg = c.createLinearGradient(70, 250, 210, 350); cg.addColorStop(0, '#f6e3b0'); cg.addColorStop(1, '#c9a560'); c.fillStyle = cg; rr(c, 70, 250, 140, 104, 20); c.fill();
      c.strokeStyle = 'rgba(90,60,10,.45)'; c.lineWidth = 3; c.beginPath(); c.moveTo(70, 302); c.lineTo(210, 302); c.moveTo(118, 250); c.lineTo(118, 354); c.moveTo(162, 250); c.lineTo(162, 354); c.stroke();
      c.fillStyle = 'rgba(255,255,255,.92)'; c.font = '500 46px Geologica, Arial, sans-serif'; c.fillText('••••  ••••  ••••  4173', 70, 560);
    });
    const body = mesh(rbox(w, h, .05, .17, .018), soft(top ? 0x1a1b20 : 0xf26a12, { roughness: .3, clearcoat: 1 })); g.add(body);
    const sg = new T.ShapeGeometry(rrShape(w - .02, h - .02, .16), 14), pos = sg.attributes.position, uv = sg.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / w + .5, pos.getY(i) / h + .5);
    g.add(mesh(sg, new T.MeshStandardMaterial({ map: face, roughness: .5, metalness: 0, envMapIntensity: .4 }), 0, 0, .0262));
    return g;
  };
  BP.coins = function () {
    const g = new T.Group(), gold = new T.MeshStandardMaterial({ color: C(0xffa53a), metalness: 1, roughness: .24 }), edge = new T.MeshStandardMaterial({ color: C(0xf08a1c), metalness: 1, roughness: .34 });
    const one = () => { const c = new T.Group(); c.add(mesh(coin(.52, .11, .035), gold)); c.add(mesh(new T.TorusGeometry(.4, .018, 10, 56), edge, 0, .056, 0)).children[1].rotation.x = Math.PI / 2; return c; };
    [[-.75, 5], [.32, 8], [1.3, 3]].forEach(([x, n], k) => { for (let i = 0; i < n; i++) { const c = one(); c.position.set(x + (Math.sin(i * 7.3 + k) * .03), -1 + i * .118, (k - 1) * -.25 + Math.cos(i * 5.1) * .03); c.rotation.y = i * .7; g.add(c); } });
    const lean = one(); lean.position.set(-.2, -.62, .85); lean.rotation.set(1.25, .2, .5); g.add(lean);
    return g;
  };
  BP.medals = function () {
    const g = new T.Group(), star = new T.Shape();
    for (let i = 0; i < 10; i++) { const a = Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? .13 : .29; i ? star.lineTo(Math.cos(a) * q, Math.sin(a) * q) : star.moveTo(Math.cos(a) * q, Math.sin(a) * q); }
    const sgeo = new T.ExtrudeGeometry(star, { depth: .03, bevelEnabled: true, bevelThickness: .015, bevelSize: .012, bevelSegments: 3 });
    [[0x35409a, 0x5562c8, .55], [0xb5713a, 0xd28e52, .3], [0xc4cad3, 0xe6eaf0, .2], [0xf0ad2b, 0xffcd5c, .2]].forEach(([c1, c2, ro], i) => {
      const m = new T.Group(), body = metal(c1, ro), inner = metal(c2, ro + .08);
      const d = mesh(coin(.58, .12, .04), body); d.rotation.x = Math.PI / 2; m.add(d);
      const d2 = mesh(coin(.44, .05, .02), inner, 0, 0, .06); d2.rotation.x = Math.PI / 2; m.add(d2);
      m.add(mesh(sgeo, body, 0, 0, .075));
      [-1, 1].forEach(s => { const r = mesh(rbox(.2, .62, .03, .02, .008), cloth(i === 0 ? 0x8f9ad6 : ORANGE), s * .15, -.72, -.05); r.rotation.z = s * .22; m.add(r); });
      m.position.set((i - 1.5) * 1.22, Math.sin(i * 1.7) * .1 + .12, 0); m.rotation.set(.05, (1.5 - i) * .16, (i - 1.5) * -.04); m.scale.setScalar(.82 + i * .09); g.add(m);
    });
    return g;
  };
  BP.pills = function () {
    const g = new T.Group(), geo = pill(1.5, .3);
    [0, 1, 2].forEach(i => { const on = i < 1, m = mesh(geo, soft(on ? ORANGE : 0xffffff, { roughness: on ? .22 : .16, clearcoat: 1, clearcoatRoughness: .08 })); m.position.set((i - 1) * .12, .7 - i * .7, i * .04); m.rotation.z = .02 * (i - 1); g.add(m); });
    g.rotation.z = .12; return g;
  };
  /* one posed scene for a still render */
  BP.still = function (canvas, name) {
    const { renderer, scene, camera } = BP.setup(canvas, { keep: true }), g = new T.Group(); scene.add(g);
    if (name === 'card') { const a = BP.card(), b = BP.card('dark'); b.position.set(.35, -.5, -.5); b.rotation.set(-.1, -.5, .12); a.position.set(-.1, .22, .2); a.rotation.set(-.2, -.48, .1); g.add(b, a); scene.add(BP.shadow(4, 1.6, -1.55)); }
    else if (name === 'coins') { g.add(BP.coins()); g.rotation.set(.16, -.4, 0); g.position.y = .15; scene.add(BP.shadow(4, 1.8, -1.02)); }
    else if (name === 'medals') { g.add(BP.medals()); g.scale.setScalar(.82); g.rotation.set(.04, -.12, 0); }
    else if (name === 'pills') { g.add(BP.pills()); g.rotation.set(.1, -.5, 0); }
    else if (name === 'hero') {
      const ph = BP.phone(arguments[2] || 'img/app-home.webp', () => renderer.render(scene, camera)); ph.position.set(.55, .5, 0); ph.rotation.set(-.06, -.38, .03); g.add(ph);
      const cd = BP.card('dark'); cd.scale.setScalar(.62); cd.position.set(-1.5, .7, -.6); cd.rotation.set(.22, .5, -.16); g.add(cd);
      const sl = BP.slab(); sl.text(1600000); sl.g.position.set(0, -1.5, 1.1); sl.pose(5, 7.5); g.add(sl.g); camera.position.z = 12.5; camera.lookAt(0, -.05, 0);
    }
    else { const o = BP[name](); o.g.scale.setScalar(o.s); o.g.rotation.set(o.rx, o.ry, 0); o.g.position.y = .15; g.add(o.g); scene.add(BP.shadow()); const b = BP.bar(); b.set(1, 1); b.g.position.set(0, -1.42, .7); scene.add(b.g); o.g.scale.setScalar(o.s * 1.12); o.g.position.y = .24; }
    const r = canvas.getBoundingClientRect(); renderer.setPixelRatio(1); renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height; camera.updateProjectionMatrix(); renderer.render(scene, camera);
  };

  /* ---------- the amount: one slab, cut into four payments ---------- */
  const money = n => Math.round(n).toLocaleString('en-US') + '₮';
  const outQuint = x => 1 - Math.pow(1 - x, 5), inOut = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  BP.slab = function () {
    const PW = 1.06, PH = .66, PD = .24, G = .14, g = new T.Group(), white = C(0xffffff), dark = C(0x16181d);
    const body = () => soft(0xffffff, { roughness: .28, clearcoat: .8, clearcoatRoughness: .2 });
    const ink = tex => new T.MeshBasicMaterial({ map: tex, color: dark.clone(), transparent: true, toneMapped: false, depthWrite: false });
    const wholeTex = canvasTex(2048, 320, () => {}), whole = new T.Group();
    whole.add(mesh(rbox(PW * 4, PH, PD, .1, .045), body()));
    whole.add(mesh(new T.PlaneGeometry(PW * 4, PH), ink(wholeTex), 0, 0, PD / 2 + .004)); g.add(whole);
    const pieces = [0, 1, 2, 3].map(i => {
      const p = new T.Group(), m = mesh(rbox(PW, PH, PD, .1, .045), body()); p.add(m);
      const ft = wholeTex.clone(); ft.repeat.set(.25, 1); ft.offset.set(i * .25, 0); ft.needsUpdate = true;
      p.add(mesh(new T.PlaneGeometry(PW, PH), ink(ft), 0, 0, PD / 2 + .004));
      const bt = canvasTex(512, 320, () => {}), bm = ink(bt), back = mesh(new T.PlaneGeometry(PW, PH), bm, 0, 0, -PD / 2 - .004); back.rotation.x = Math.PI; p.add(back);
      p.userData = { m, ft, bt, bm }; g.add(p); return p;
    });
    const blades = [0, 1, 2].map(k => { const b = mesh(new T.PlaneGeometry(.04, PH * 7), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, toneMapped: false, depthWrite: false }), (k - 1) * PW, 0, PD / 2 + .07); g.add(b); return b; });
    let amount = 0;
    function text(v) {
      amount = v == null ? amount : v; const F = 'Geologica, "Golos Text", Arial, sans-serif';
      let c = wholeTex.image.getContext('2d'), w = 2048, h = 320; c.clearRect(0, 0, w, h); c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = '600 196px ' + F; c.fillText(money(amount), w / 2, h / 2 + 10);
      wholeTex.needsUpdate = true;
      pieces.forEach((p, i) => { p.userData.ft.needsUpdate = true; c = p.userData.bt.image.getContext('2d'); w = 512; c.clearRect(0, 0, w, h); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = 'rgba(255,255,255,.62)'; c.font = '500 48px ' + F; c.fillText((i + 1) + '-р төлөлт', w / 2, 98); c.fillStyle = '#fff'; c.font = '600 92px ' + F; c.fillText(money(amount / 4), w / 2, 200); p.userData.bt.needsUpdate = true; });
    }
    /* t: seconds into the cycle (the cut lands at 1.5), D: cycle length */
    function pose(t, D) {
      const cut = t >= 1.5, end = D - 1, back = clamp((t - end) / .55);
      whole.visible = !cut;
      const gaps = [0, 1, 2].map(k => outQuint(clamp((t - (1.55 + k * .1)) / .7)) * G * (1 - inOut(back))), sum = gaps[0] + gaps[1] + gaps[2];
      pieces.forEach((p, i) => {
        p.visible = cut; let x = (i - 1.5) * PW - sum / 2; for (let k = 0; k < i; k++) x += gaps[k];
        const paid = i === 0 ? clamp((t - 3.7) / .35) * (1 - clamp((t - end) / .2)) : 0;
        p.position.set(x, 0, i === 0 ? paid * .12 : 0);
        p.rotation.x = Math.PI * (inOut(clamp((t - (2.3 + i * .1)) / .75)) - inOut(clamp((t - (end + i * .04)) / .5)));
        p.userData.m.material.color.copy(white).lerp(dark, paid); p.userData.bm.color.copy(dark).lerp(white, paid);
      });
      blades.forEach((b, k) => { const u = clamp((t - (1.42 + k * .1)) / .22), on = u > 0 && u < 1; b.visible = on; b.scale.y = Math.max(.001, Math.sin(u * Math.PI)); b.material.opacity = Math.sin(u * Math.PI); });
    }
    text(0); pose(0, 7.5);
    return { g, text, pose, pieces, width: PW * 4 };
  };

  /* ---------- a phone showing the real app ---------- */
  BP.phone = function (src, ready) {
    const g = new T.Group(), W = 1.42, H = 2.94, D = .15, R = .25, frame = new T.MeshStandardMaterial({ color: C(0x34363c), metalness: 1, roughness: .32 });
    const face = (w, h, r, m, z) => { const sg = new T.ShapeGeometry(rrShape(w, h, r), 16), p = sg.attributes.position, uv = sg.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + .5, p.getY(i) / h + .5); return mesh(sg, m, 0, 0, z); };
    g.add(mesh(rbox(W, H, D, R, .05), frame));
    g.add(face(W - .06, H - .06, R - .03, new T.MeshPhysicalMaterial({ color: C(0x07080a), roughness: .08, clearcoat: 1, clearcoatRoughness: .04 }), D / 2 + .0015));
    const tex = new T.TextureLoader().load(src, () => ready && ready()); tex.encoding = T.sRGBEncoding; tex.anisotropy = 8;
    g.add(face(W - .15, H - .15, R - .075, new T.MeshBasicMaterial({ map: tex, toneMapped: false }), D / 2 + .003));
    const rear = face(W - .06, H - .06, R - .03, new T.MeshPhysicalMaterial({ color: C(0x1d1e22), roughness: .38, metalness: .5, clearcoat: .5 }), -D / 2 - .0015); rear.rotation.y = Math.PI; g.add(rear);
    g.add(mesh(rbox(.64, .66, .05, .17, .02), new T.MeshPhysicalMaterial({ color: C(0x111215), roughness: .22, metalness: .4, clearcoat: 1 }), -.3, .98, -D / 2 - .02));
    [[-.44, 1.13], [-.16, 1.13], [-.3, .85]].forEach(q => { const l = mesh(new T.CylinderGeometry(.115, .115, .06, 36), new T.MeshStandardMaterial({ color: C(0x05060a), metalness: 1, roughness: .12 }), q[0], q[1], -D / 2 - .05); l.rotation.x = Math.PI / 2; g.add(l); });
    g.add(mesh(rbox(.03, .36, .05, .012, .008), frame, W / 2 + .004, .55, 0)); g.add(mesh(rbox(.03, .22, .05, .012, .008), frame, -W / 2 - .004, .8, 0)); g.add(mesh(rbox(.03, .22, .05, .012, .008), frame, -W / 2 - .004, .5, 0));
    return g;
  };

  /* ---------- live hero ----------
     Opening: the amount drops in and lands hard, three cuts split it, the camera pulls back while the pieces
     turn into four payments and the phone and card arrive. After that the cut repeats with new amounts. */
  BP.hero = function (canvas, opt) {
    opt = opt || {};
    const { renderer, scene, camera } = BP.setup(canvas), TAN = Math.tan(Math.PI / 12), rig = new T.Group(), D = 7.5; scene.add(rig);
    const amounts = opt.amounts || [1600000, 480000, 3200000];
    const phone = BP.phone(opt.screen || 'img/app-home.webp'); phone.scale.setScalar(1.14); rig.add(phone);
    const card = BP.card('dark'); rig.add(card);
    const slab = BP.slab(), SS = .86; slab.g.position.set(0, -1.5, .6); rig.add(slab.g);
    const ring = mesh(new T.RingGeometry(.86, 1, 72), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, toneMapped: false })); ring.position.set(0, -1.5, .4); rig.add(ring);
    const shardG = new T.BoxGeometry(.1, .1, .035), shards = [];
    for (let i = 0; i < 54; i++) { const m = mesh(shardG, soft(i % 3 ? 0xffffff : 0x16181d, { roughness: .3 })); m.visible = false; rig.add(m); const a = Math.random() * Math.PI, sp = 2.5 + Math.random() * 6; shards.push({ m, x0: (Math.random() - .5) * 3.8, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * .9 + 1.2, vz: (Math.random() - .25) * 5, rx: 4 + Math.random() * 10, ry: 4 + Math.random() * 10, k: .6 + Math.random() * .8 }); }
    const stops = [.38, .8, .9, 1]; let si = 0, hold = 0;
    const hits = [[.38, .17], [.8, .055], [.9, .055], [1, .055]], S = new T.Vector3(), A = new T.Vector3(), B = new T.Vector3(), L = new T.Vector3();
    let t = 0, cyc = .7, n = 0, last = 0, raf = 0, on = false, px = 0, py = 0, tx = 0, ty = 0, zf = 9, z0 = 6, beat = 0, thump = -9;
    function fit() {
      const r = canvas.getBoundingClientRect(); if (!r.width) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.setSize(r.width, r.height, false);
      const a = r.width / r.height; camera.aspect = a;
      if (a > 1.25) {
        /* fit the whole scene (phone top to slab bottom) into the band between the header and the stage's lower edge */
        const pad = opt.pad ? opt.pad() : { top: 0, bottom: 0 }, usable = Math.max(160, r.height - pad.top - pad.bottom), TOP = 2.46, BOT = -1.98;
        const vis = Math.max(9 / a, (TOP - BOT) * r.height / usable); zf = vis / (2 * TAN);
        rig.position.set(vis * a * .185, -.05 + vis / 2 - (pad.top + usable / 2) * vis / r.height - (TOP + BOT) / 2, 0);
      } else { zf = Math.max(9, 5.6 / (2 * TAN * a)); rig.position.set(0, .45, 0); }
      z0 = (slab.width * SS * 1.14) / (2 * TAN * a); camera.updateProjectionMatrix();
    }
    function draw(dt) {
      if (hold > 0) { hold -= dt; dt = 0; }
      t += dt; cyc += dt;
      if (si < stops.length && t >= stops[si]) { hold = si === 0 ? .075 : .045; si++; }
      if (cyc >= D) { cyc -= D; n = (n + 1) % amounts.length; slab.text(amounts[n]); thump = t; hits.push([t, .025]); if (hits.length > 8) hits.splice(4, 1); }
      if (beat === 0 && t >= .38) { beat = 1; opt.onBeat && opt.onBeat('impact'); }
      if (beat === 1 && t >= 1.25) { beat = 2; opt.onBeat && opt.onBeat('reveal'); }
      px += (tx - px) * Math.min(1, dt * 4); py += (ty - py) * Math.min(1, dt * 4);
      /* the amount */
      const fall = clamp(t / .38), land = clamp((t - .38) / .16), th = clamp((t - thump) / .3);
      slab.pose(cyc, D);
      slab.g.position.y = -1.5 + (1 - fall * fall) * 3.4; slab.g.rotation.x = (1 - fall) * -.7 + py * .08; slab.g.rotation.y = px * .1;
      slab.pieces.forEach((p, i) => { const b = Math.sin(clamp((cyc - (1.5 + i * .04)) / .5) * Math.PI); p.position.y += b * (i % 2 ? .3 : .2); p.rotation.z = (i - 1.5) * .11 * b; });
      const burst = t - .38, mini = t - thump;
      shards.forEach((q, i) => { const d = burst > 0 && burst < 1.2 ? burst : (mini > 0 && mini < .8 && i < 18 ? mini * 1.4 : -1); if (d < 0) { q.m.visible = false; return; } const pw = burst < 1.2 ? 1 : .5; q.m.visible = true; q.m.position.set(q.x0 + q.vx * d * pw, -1.5 + q.vy * d * pw - 5 * d * d, .6 + q.vz * d * pw); q.m.rotation.set(q.rx * d, q.ry * d, 0); q.m.scale.setScalar(Math.max(.001, q.k * (1 - d / 1.2))); });
      const sq = Math.sin(land * Math.PI) * .12 + Math.sin(th * Math.PI) * .035; slab.g.scale.set(SS * (1 + sq), SS * (1 - sq), SS);
      const rg = t < 2 ? clamp((t - .38) / .55) : th; ring.scale.setScalar(.6 + rg * (t < 2 ? 5 : 2.6)); ring.material.opacity = (t < .38 ? 0 : (1 - rg)) * (t < 2 ? .55 : .25);
      /* phone and card arrive once the camera starts to pull back */
      const up = outQuint(clamp((t - 1.3) / 1.25));
      phone.visible = t > 1.3; phone.position.set(.72, .64 - (1 - up) * 4.6 + Math.sin(t * .9) * .035, 0);
      phone.rotation.set(-.06 + py * .16, -.38 - (1 - up) * Math.PI * 2 + Math.sin(t * .45) * .1 + px * .38, .03);
      const ci = outQuint(clamp((t - 1.75) / 1.2));
      card.visible = t > 1.75; card.scale.setScalar(.72 * Math.max(.001, ci)); card.position.set(-.92 + (1 - ci) * -2.2, 1.32 + (1 - ci) * 1.4 + Math.sin(t * .7 + 2) * .05, -.6);
      card.rotation.set(.22 + py * .2, .5 + (1 - ci) * 2.4 + px * .3, -.16 + Math.sin(t * .5) * .04);
      /* camera: tight on the amount, then back to the full picture */
      const k = inOut(clamp((t - 1.25) / 1.15));
      S.copy(rig.position).add(slab.g.position).setY(rig.position.y - 1.5);
      A.set(S.x, S.y + .12, S.z + z0); B.set(0, .7, zf); camera.position.lerpVectors(A, B, k);
      let sh = 0; hits.forEach(h => { const d = t - h[0]; if (d > 0 && d < .6) sh += h[1] * Math.exp(-d * 9) * Math.sin(d * 78); });
      camera.position.x += sh; camera.position.y += sh * .7;
      camera.fov = 30 - (t > .38 ? 6 * Math.exp(-(t - .38) * 6) : 0) - (mini > 0 ? 1.6 * Math.exp(-mini * 7) : 0); camera.updateProjectionMatrix();
      L.set(S.x, S.y, S.z).lerp(B.set(0, -.05, 0), k); camera.lookAt(L);
      renderer.render(scene, camera);
    }
    function loop(now) { raf = requestAnimationFrame(loop); const dt = Math.min(.05, (now - last) / 1000 || 0); last = now; draw(dt); }
    const api = {
      start() { if (on) return; on = true; last = performance.now(); raf = requestAnimationFrame(loop); },
      stop() { on = false; cancelAnimationFrame(raf); },
      point(x, y) { tx = x; ty = y; },
      next() { if (t > 3 && cyc < D - 1) cyc = D - 1; },
      skip() { t = Math.max(t, 4); cyc = Math.max(cyc, 4.7); beat = 2; },
      fit,
    };
    slab.text(amounts[0]); if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => slab.text());
    fit(); window.addEventListener('resize', fit); draw(0);
    return api;
  };
})();
