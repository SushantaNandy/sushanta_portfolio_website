import * as THREE from 'three';
import { seatedPerson } from './characters.js';

// The /work/ workshop: Sushanta on a chair with his laptop, and beside him a floating formation of
// 36 blocks that rebuilds itself into each project (bars growing, a suite migrating, a locator
// healing...). Blocks ease toward their targets every frame, so switching project is one morph.
// show(scene, label) is called by the page as the reader scrolls between projects.
const N = 36;
const FX = 190; // formation centre x
const C = { green: 0x2fd47a, blue: 0x3fb6ff, purple: 0x8b6cff, gold: 0xffc56b, red: 0xff5a5a, dim: 0x2a3550, white: 0xe8e8e4 };
const hidden = [0, 200, 0, 0.01, 0.01, 0.01, C.dim];
const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

// Each formation: (i, t) => [x, y, z, sx, sy, sz, color], in units of one 26px block.
const F = {
  // Suites move one by one from the legacy (purple) stack to the Playwright (green) stack.
  migrate(i, t) {
    const m = Math.floor(((t % 14) / 11) * 30), moved = i < Math.min(m, 30);
    if (i >= 30) return hidden;
    const slot = moved ? i : 29 - i; // taken off the top of the old stack, laid at the bottom of the new one
    return [(moved ? 110 : -110) + ((slot % 3) - 1) * 30, 15 + Math.floor(slot / 3) * 30, 0, 1, 1, 1, moved ? C.green : C.purple];
  },
  // Coins drop onto six growing stacks.
  ledger(i, t) {
    const s = i % 6, lvl = Math.floor(i / 6), want = [2, 3, 4, 5, 6, 6][s];
    const shown = lvl < want && (t % 10) > (lvl * 6 + s) * 0.18;
    return shown ? [(s - 2.5) * 46, 6 + lvl * 13, 0, 1.4, 0.4, 1.4, C.gold] : [(s - 2.5) * 46, 420, 0, 0.01, 0.01, 0.01, C.gold];
  },
  // An orbit of ideas that settles into lines of code, and back.
  ai(i, t) {
    if (Math.floor(t / 3.2) % 2 === 0) {
      const a = (i / N) * Math.PI * 2 + t * 0.9;
      return [Math.cos(a) * 150, 240 + Math.sin(a) * 70, Math.sin(a) * 90, 0.7, 0.7, 0.7, i % 3 ? C.purple : C.green];
    }
    const row = Math.floor(i / 6), col = i % 6, len = [3, 5, 4, 6, 2, 5][row];
    if (col >= len) return [-140, 420 - row * 52, 0, 0.01, 0.01, 0.01, C.green];
    return [-140 + col * 50 + (row % 2) * 24, 420 - row * 52, 0, 1.6, 0.6, 0.6, row === 0 ? C.purple : C.green];
  },
  // A device screen of locators: one breaks (red) and heals (green) every two seconds.
  heal(i, t) {
    const c = i % 6, r = Math.floor(i / 6), k = (Math.floor(t / 2) * 7) % N, ph = t % 2;
    let color = C.dim, s = 1;
    if (i === k) { color = ph < 0.9 ? C.red : C.green; s = ph < 0.9 ? 1 : 1 + 0.25 * Math.sin(Math.min(1, (ph - 0.9) / 0.4) * Math.PI); }
    return [(c - 2.5) * 42, 50 + r * 42, 0, s, s, 0.3, color];
  },
  // The E2E suite growing from nothing to 220+.
  bars(i, t) {
    if (i >= 12) return hidden;
    const g = ease(((t % 9) - i * 0.12) / 4);
    const h = Math.max(4, (14 + 320 * Math.pow(i / 11, 1.6)) * g);
    return [(i - 5.5) * 30, h / 2, 0, 0.8, h / 26, 0.8, i === 11 ? C.green : C.blue];
  },
  // A heartbeat line scrolling past: the daily health check.
  health(i, t) {
    const x = (i - (N - 1) / 2) * 11, u = ((i / N) * 3 - t * 0.6) % 1, p = u < 0 ? u + 1 : u;
    const beat = p > 0.42 && p < 0.58 ? Math.sin(((p - 0.42) / 0.16) * Math.PI * 2) * (p < 0.5 ? 130 : 60) : 0;
    return [x, 230 + beat, 0, 0.35, 0.35, 0.35, beat > 40 ? C.white : C.green];
  },
  // The app on one side, the mock server on the other, requests and responses in between.
  mock(i, t) {
    if (i < 12) return [-150 + (i % 2) * 30, 15 + Math.floor(i / 2) * 30, 0, 1, 1, 1, C.blue];
    if (i < 24) return [120 + (i % 2) * 30, 15 + Math.floor((i - 12) / 2) * 30, 0, 1, 1, 1, C.purple];
    const k = i - 24, u = 0.5 - 0.5 * Math.cos(t * 1.6 + k * 0.55);
    return [-110 + u * 210, 70 + (k % 4) * 45, 0, 0.45, 0.45, 0.45, k % 2 ? C.green : C.white];
  },
  // Phones in an arc, each getting its tick in turn: the daily mobile run.
  phones(i, t) {
    if (i < 6) {
      const a = (i - 2.5) * 0.32;
      return [Math.sin(a) * 210, 120 + Math.sin(t * 1.4 + i) * 8, -Math.cos(a) * 60 + 60, 1.7, 3.4, 0.25, 0x1b2230];
    }
    if (i < 12) {
      const k = i - 6, a = (k - 2.5) * 0.32, on = (t % 6) > k * 0.7;
      return [Math.sin(a) * 210, on ? 245 : 200, -Math.cos(a) * 60 + 70, on ? 0.6 : 0.01, on ? 0.6 : 0.01, 0.6, C.green];
    }
    return hidden;
  },
  // Candlesticks for the trading project.
  candles(i, t) {
    const o = [0, 30, 10, 60, 40, 90, 70, 120, 100, 150, 130, 190], k = i % 12;
    if (i >= 24) return hidden;
    const up = k % 2 === 0 || k === 11, g = ease((t % 12) / 3 - k * 0.12);
    const body = (30 + (k % 3) * 18) * g, y = 80 + o[k] + (k === 11 ? Math.sin(t * 3) * 6 : 0);
    return i < 12
      ? [(k - 5.5) * 30, y, 0, 0.75, Math.max(0.05, body / 26), 0.75, up ? C.green : C.red]
      : [(k - 5.5) * 30, y, 0, 0.12, Math.max(0.05, (body + 40 * g) / 26), 0.12, 0x9a9a96];
  },
};

export function createWorkshop(canvas, stage) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 10, 6000);
  const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, ...extra });
  const mesh = (geo, m, x = 0, y = 0, z = 0) => {
    const o = new THREE.Mesh(geo, m);
    o.position.set(x, y, z);
    o.castShadow = o.receiveShadow = true;
    return o;
  };

  // Floor that only exists where light lands.
  const pc = Object.assign(document.createElement('canvas'), { width: 256, height: 256 });
  const pg = pc.getContext('2d');
  const rg = pg.createRadialGradient(128, 128, 0, 128, 128, 128);
  rg.addColorStop(0, '#fff');
  rg.addColorStop(0.55, '#666');
  rg.addColorStop(1, '#000');
  pg.fillStyle = rg;
  pg.fillRect(0, 0, 256, 256);
  const floor = mesh(new THREE.PlaneGeometry(1200, 700), mat(0x3a3a38, { roughness: 1, transparent: true, alphaMap: new THREE.CanvasTexture(pc) }), 80, 0, 0);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Sushanta on a chair, laptop on his lap, turned a little toward his work.
  const me = seatedPerson();
  me.group.position.y = 312;
  const seat = new THREE.Group();
  const cm = mat(0x2b2b2b);
  seat.add(mesh(new THREE.BoxGeometry(110, 10, 64), cm, 0, 55, 2), mesh(new THREE.BoxGeometry(110, 120, 10), cm, 0, 115, -30));
  for (const [x, z] of [[-48, -26], [48, -26], [-48, 28], [48, 28]]) seat.add(mesh(new THREE.CylinderGeometry(3, 3, 50, 8), cm, x, 25, z));
  seat.add(me.group);
  seat.position.set(-110, 0, 40);
  seat.rotation.y = 0.35;
  scene.add(seat);

  // The formation
  const blocks = new THREE.InstancedMesh(new THREE.BoxGeometry(26, 26, 26), new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.1 }), N);
  blocks.castShadow = true;
  scene.add(blocks);
  const cur = Array.from({ length: N }, () => ({ p: new THREE.Vector3(FX, 200, 0), s: new THREE.Vector3(0.01, 0.01, 0.01), c: new THREE.Color(C.dim) }));
  const tgtC = new THREE.Color(), tv = new THREE.Vector3(), dummy = new THREE.Object3D();
  for (let i = 0; i < N; i++) blocks.setColorAt(i, cur[i].c);

  // Result label above the formation
  const lc = Object.assign(document.createElement('canvas'), { width: 640, height: 120 });
  const lg = lc.getContext('2d');
  const ltex = new THREE.CanvasTexture(lc);
  ltex.colorSpace = THREE.SRGBColorSpace;
  const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: ltex, transparent: true, opacity: 0, depthWrite: false, depthTest: false }));
  label.renderOrder = 10;
  label.position.set(FX, 470, 0);
  scene.add(label);
  const drawLabel = (text) => {
    lg.clearRect(0, 0, 640, 120);
    lg.font = '600 40px "Schibsted Grotesk Variable", system-ui, sans-serif';
    const w = Math.min(632, lg.measureText(text).width + 64);
    lg.fillStyle = '#2fd47a';
    lg.beginPath();
    lg.roundRect((640 - w) / 2, 8, w, 104, 52);
    lg.fill();
    lg.fillStyle = '#04140a';
    lg.textAlign = 'center';
    lg.textBaseline = 'middle';
    lg.fillText(text, 320, 62, 600);
    ltex.needsUpdate = true;
  };

  // Lights: dim fill, a warm spot on him, a cool spot on the formation tinted per project.
  scene.add(new THREE.HemisphereLight(0xcfd8ff, 0x000000, 0.6));
  const spot = (x, tx, color, intensity) => {
    const s = new THREE.SpotLight(color, intensity, 0, 0.4, 0.8, 0);
    s.position.set(x, 900, 260);
    s.target.position.set(tx, 0, 0);
    s.castShadow = true;
    s.shadow.mapSize.set(1024, 1024);
    s.shadow.bias = -0.0008;
    scene.add(s, s.target);
    return s;
  };
  spot(-180, -110, 0xfff1dc, 4.5);
  const work = spot(FX + 60, FX, 0xffffff, 3.5);
  const glow = new THREE.PointLight(C.green, 2, 700, 0);
  glow.position.set(FX, 260, 160);
  scene.add(glow);

  let form = F.bars, since = 0, clock = 0, lastText = '';
  const frame = (dt, snap = false) => {
    clock += dt;
    since += dt;
    const k = snap ? 1 : 1 - Math.exp(-dt * 5);
    for (let i = 0; i < N; i++) {
      const [x, y, z, sx, sy, sz, color] = form(i, clock);
      const c = cur[i];
      c.p.lerp(tv.set(FX + x, y, z), k);
      c.s.lerp(tv.set(sx, sy, sz), k);
      c.c.lerp(tgtC.set(color), k);
      dummy.position.copy(c.p);
      dummy.scale.copy(c.s);
      dummy.rotation.set(0, Math.sin(clock * 0.5 + i) * 0.04, 0);
      dummy.updateMatrix();
      blocks.setMatrixAt(i, dummy.matrix);
      blocks.setColorAt(i, c.c);
    }
    blocks.instanceMatrix.needsUpdate = true;
    blocks.instanceColor.needsUpdate = true;

    // Typing, a glance at the blocks after each switch, and the label popping in.
    const glance = since < 2.2 ? Math.sin((since / 2.2) * Math.PI) : 0;
    me.head.rotation.y = 0.75 * glance;
    me.head.rotation.x = 0.1 + 0.03 * Math.sin(clock * 2.1) - 0.15 * glance;
    me.arms[0].rotation.x = 0.06 * Math.sin(clock * 15);
    me.arms[1].rotation.x = 0.06 * Math.sin(clock * 15 + 2);
    me.screen.intensity = 0.4 + 0.15 * Math.sin(clock * 6);
    const lk = snap ? 1 : ease((since - 0.3) / 0.5);
    label.material.opacity = lk;
    const w = 300 * (0.9 + 0.1 * lk);
    label.scale.set(w, (w * 120) / 640, 1);
    renderer.render(scene, camera);
  };

  const resize = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Fit roughly x -240..360 and y -20..520 whatever the stage shape.
    const v = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const dist = Math.max(300 / v, 300 / (v * camera.aspect));
    camera.position.set(90, 380, dist);
    camera.lookAt(90, 255, 0);
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(() => { resize(); frame(0); }).observe(stage);
  resize();

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = false, last = 0;
  const loop = (now) => {
    if (!visible) return;
    frame(Math.min((now - last) / 1000, 1 / 30));
    last = now;
    requestAnimationFrame(loop);
  };
  if (!still) new IntersectionObserver(([e]) => {
    const was = visible;
    visible = e.isIntersecting;
    if (visible && !was) { last = performance.now(); requestAnimationFrame(loop); }
  }).observe(stage);

  return {
    show(name, text, tint = C.green) {
      if (F[name] === form && text === lastText) return;
      form = F[name] ?? F.bars;
      since = 0;
      if (text !== lastText) { lastText = text; drawLabel(text); }
      glow.color.set(tint);
      work.color.set(0xffffff).lerp(new THREE.Color(tint), 0.25);
      if (still) { clock = 30; frame(0, true); } // reduced motion: jump to the finished formation
    },
  };
}
