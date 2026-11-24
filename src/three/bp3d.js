/* BiD Pay hero scene: a clay phone running the app, with the price of a purchase in front of it, cut into payments.
   The number of payments changes from one cycle to the next. Built from kit.js, the same material and light as every
   still image on the page. */
import { T, clamp, inCubic, outQuint, phone as makePhone, setFont, setup, shadow, slab as makeSlab } from './kit.js';

const BP = {};

/* The phone rises into place, then the price appears in front of it, is cut into payments, and the pieces turn to
   show what each payment is; the first one is marked paid. Each cycle uses a new amount and number of payments. */
BP.hero = function (canvas, opt) {
  opt = opt || {};
  setFont(opt.font);
  const { renderer, scene, camera } = setup(canvas, { keep: opt.keep }), TAN = Math.tan(Math.PI / 12), D = 6.6, rig = new T.Group(); scene.add(rig);
  /* [amount, number of payments]; amounts divide evenly so every payment is a round figure */
  const cycles = opt.cycles && opt.cycles.length ? opt.cycles : [[1200000, 3], [2400000, 6], [480000, 2], [1600000, 4]];
  let t = 0, cyc = -.55, n = 0, last = 0, raf = 0, on = false, px = 0, py = 0, tx = 0, ty = 0;
  const phone = makePhone(opt.screen || 'img/app-home.webp', () => { if (!on) draw(0); }); rig.add(phone);
  const Y = -1.18, slab = makeSlab({ label: opt.label }), SS = .78; slab.g.position.set(0, Y, .75); rig.add(slab.g);
  const floor = shadow(4.6, 1.2, .2); floor.position.set(0, -1.74, .3); rig.add(floor);
  function fit() {
    const r = canvas.getBoundingClientRect(); if (!r.width) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.setSize(r.width, r.height, false);
    /* frame the phone top to the shadow, and the widest split (six pieces, nearer the camera than the phone) with room to spare */
    const a = r.width / r.height, vis = Math.max(4.3, 4.6 / a), z = vis / (2 * TAN);
    camera.aspect = a; camera.position.set(0, .55, z); camera.lookAt(0, .24, 0); camera.updateProjectionMatrix();
  }
  function draw(dt) {
    t += dt; cyc += dt;
    if (cyc >= D) { cyc -= D; n = (n + 1) % cycles.length; slab.set(cycles[n][0], cycles[n][1]); }
    px += (tx - px) * Math.min(1, dt * 3); py += (ty - py) * Math.min(1, dt * 3);
    /* the phone rises into place, then rests with a slow sway */
    const up = outQuint(clamp(t / 1.4));
    phone.scale.setScalar(1.1 * (.94 + .06 * up));
    phone.position.set(.08, .58 - (1 - up) * .8 + Math.sin(t * .8) * .03, 0);
    phone.rotation.set(-.05 + py * .08, -.34 - (1 - up) * .5 + Math.sin(t * .4) * .06 + px * .22, .02);
    floor.material.opacity = .2 * up;
    /* the amount */
    const grow = outQuint(clamp(cyc / .6)), shrink = inCubic(clamp((cyc - (D - .4)) / .4)), s = Math.max(.0001, grow * (1 - shrink));
    slab.pose(Math.max(0, cyc), D);
    slab.g.scale.setScalar(SS * s); slab.g.position.y = Y - (1 - grow) * .22;
    slab.g.rotation.set(py * .05, px * .08, 0);
    renderer.render(scene, camera);
  }
  function loop(now) { raf = requestAnimationFrame(loop); const dt = Math.min(.05, (now - last) / 1000 || 0); last = now; draw(dt); }
  const api = {
    start() { if (on) return; on = true; last = performance.now(); raf = requestAnimationFrame(loop); },
    stop() { on = false; cancelAnimationFrame(raf); },
    /* pointer position over the scene, each axis from -1 to 1 */
    point(x, y) { tx = x; ty = y; },
    /* move on to the next amount */
    next() { if (cyc > .6 && cyc < D - .45) cyc = D - .45; },
    /* draw one settled frame: cycle `index`, `at` seconds in (used to render the still image) */
    pose(index, at) { api.stop(); t = 3; n = index % cycles.length; cyc = at; slab.set(cycles[n][0], cycles[n][1]); fit(); draw(0); },
    fit,
    dispose() { api.stop(); window.removeEventListener('resize', fit); renderer.dispose(); },
  };
  slab.set(cycles[0][0], cycles[0][1]);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => slab.set());
  fit(); window.addEventListener('resize', fit); draw(0);
  return api;
};

export default BP;
