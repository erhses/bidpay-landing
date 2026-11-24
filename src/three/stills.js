/* Still images for the page, rendered from kit.js so they share the hero's material and light. Not loaded by the
   site: research/tools renders these once and saves them to public/img (see README, "3D notes").
   Every still uses the same camera direction and light, and is framed by its own outline so it fills the same
   share of the plate whatever its shape. */
import { T, bag, cards, coins, medals, pieces, setFont, setup, shadow } from './kit.js';

/* name -> [build, turn about y] */
const SUBJECTS = {
  /* the payment section, step by step */
  choose: [() => bag(), -.5],
  split: [() => pieces(3, 0, { tilt: true }), -.38],
  pay: [() => pieces(3, 1), -.38],
  /* the features */
  wallet: [() => cards(), -.42],
  save: [() => coins(), -.5],
  tiers: [() => medals(), -.3],
};
export const NAMES = Object.keys(SUBJECTS);

export function still(canvas, name, opt) {
  opt = opt || {};
  setFont(opt.font);
  const subject = SUBJECTS[name]; if (!subject) throw new Error('no still called ' + name);
  const { renderer, scene, camera } = setup(canvas, { keep: true });
  const obj = subject[0](opt); obj.rotation.y = subject[1]; scene.add(obj);
  const box = new T.Box3().setFromObject(obj), sphere = box.getBoundingSphere(new T.Sphere()), size = box.getSize(new T.Vector3());
  const floor = shadow(Math.max(size.x, size.z) * 1.35, Math.max(size.x, size.z) * .7, .22); floor.position.set(sphere.center.x, box.min.y + .002, sphere.center.z + .1); scene.add(floor);
  const r = canvas.getBoundingClientRect(); renderer.setPixelRatio(1); renderer.setSize(r.width, r.height, false);
  const dir = new T.Vector3(0, .34, 1).normalize(), fill = opt.fill || .74, corners = [], p = new T.Vector3();
  for (let i = 0; i < 8; i++) corners.push(new T.Vector3(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z));
  camera.aspect = r.width / r.height; camera.fov = 30;
  /* place the camera, measure how much of the frame the object's box covers, and move in or out until it covers `fill` */
  let dist = sphere.radius * 4, target = sphere.center.clone();
  for (let k = 0; k < 6; k++) {
    camera.position.copy(target).addScaledVector(dir, dist); camera.lookAt(target); camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    corners.forEach(c => { p.copy(c).project(camera); x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); });
    dist *= Math.max((x1 - x0) / 2, (y1 - y0) / 2) / fill;
    /* recentre on the middle of the projected outline */
    const mid = new T.Vector3((x0 + x1) / 2, (y0 + y1) / 2, .5).unproject(camera).sub(camera.position).normalize();
    const reach = camera.position.distanceTo(target);
    target.copy(camera.position).addScaledVector(mid, reach);
  }
  camera.position.copy(target).addScaledVector(dir, dist); camera.lookAt(target); camera.updateProjectionMatrix();
  renderer.render(scene, camera);
}
