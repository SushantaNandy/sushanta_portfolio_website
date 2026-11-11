import * as THREE from 'three';
import { seatedPerson } from './characters.js';

// A short looping film: HR finds the email, copies it and sends an invite; the interview runs
// under a pendant lamp; then "You're hired!" with confetti. 14s loop, rendered only on screen.
// onAct(i) lets the page highlight the matching caption (0 email, 1 interview, 2 hired).
export function createHireScene(canvas, section, onAct = () => {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 10, 6000);
  const look = new THREE.Vector3(0, 250, 0);
  const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, ...extra });
  const mesh = (geo, m, x = 0, y = 0, z = 0) => {
    const o = new THREE.Mesh(geo, m);
    o.position.set(x, y, z);
    o.castShadow = o.receiveShadow = true;
    return o;
  };

  // Ground: only exists where light lands, so it melts into the black page.
  const pc = Object.assign(document.createElement('canvas'), { width: 256, height: 256 });
  const pg = pc.getContext('2d');
  const rg = pg.createRadialGradient(128, 128, 0, 128, 128, 128);
  rg.addColorStop(0, '#fff');
  rg.addColorStop(0.55, '#777');
  rg.addColorStop(1, '#000');
  pg.fillStyle = rg;
  pg.fillRect(0, 0, 256, 256);
  const floor = mesh(new THREE.PlaneGeometry(1100, 560), mat(0x3a3a38, { roughness: 1, transparent: true, alphaMap: new THREE.CanvasTexture(pc) }));
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Two people on chairs, angled toward each other and toward the viewer.
  const chair = (color) => {
    const g = new THREE.Group(), m = mat(color);
    g.add(mesh(new THREE.BoxGeometry(110, 10, 64), m, 0, 55, 2));
    g.add(mesh(new THREE.BoxGeometry(110, 120, 10), m, 0, 115, -30));
    for (const [x, z] of [[-48, -26], [48, -26], [-48, 28], [48, 28]]) g.add(mesh(new THREE.CylinderGeometry(3, 3, 50, 8), m, x, 25, z));
    return g;
  };
  const seat = (person, chairColor, x, ry) => {
    const g = new THREE.Group();
    person.group.position.y = 312; // feet on the floor, seat at y = 60
    g.add(chair(chairColor), person.group);
    g.position.x = x;
    g.rotation.y = ry;
    scene.add(g);
    return person;
  };
  const hr = seat(seatedPerson({ shirt: 0x6b4fa0, pants: 0x2b2b33, skin: 0xe0ac7e, hair: 0x3a2416, shoes: 0x1c1c1c, headphones: false, glasses: false, laptop: false, bun: true }), 0x2b2b2b, -230, Math.PI / 2 - 0.6);
  const me = seat(seatedPerson(), 0x2b2b2b, 230, -Math.PI / 2 + 0.6);

  // Coffee table and a pendant lamp above it
  scene.add(mesh(new THREE.CylinderGeometry(62, 62, 6, 40), mat(0x8a6a4a), 0, 92, 30));
  scene.add(mesh(new THREE.CylinderGeometry(5, 5, 90, 10), mat(0x222222), 0, 45, 30));
  const shade = mesh(new THREE.ConeGeometry(34, 30, 32, 1, true), mat(0x1c1c1c, { side: THREE.DoubleSide }), 0, 470, 30);
  scene.add(shade, mesh(new THREE.CylinderGeometry(1, 1, 300, 6), mat(0x333333), 0, 635, 30));
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfff1dc });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(9, 16, 12), bulbMat).translateY(456).translateZ(30));

  // Lights: dim fill, one spot per person, the pendant, and a warm flash for the hire.
  const fill = new THREE.HemisphereLight(0xcfd8ff, 0x000000, 0.55);
  const spot = (x, z, tx) => {
    const s = new THREE.SpotLight(0xfff1dc, 0, 0, 0.32, 0.8, 0);
    s.position.set(x, 900, z);
    s.target.position.set(tx, 0, 0);
    s.castShadow = true;
    s.shadow.mapSize.set(1024, 1024);
    s.shadow.bias = -0.0008;
    scene.add(s, s.target);
    return s;
  };
  const hrSpot = spot(-330, 200, -230), meSpot = spot(330, 200, 230);
  const pendant = new THREE.SpotLight(0xffe2b8, 0, 0, 0.75, 0.6, 0);
  pendant.position.set(0, 450, 30);
  pendant.target.position.set(0, 0, 30);
  pendant.castShadow = true;
  pendant.shadow.mapSize.set(1024, 1024);
  const party = new THREE.PointLight(0xffc56b, 0, 900, 0);
  party.position.set(0, 380, 160);
  scene.add(fill, pendant, pendant.target, party);

  // Visible beam under the pendant
  const beam = new THREE.Mesh(
    new THREE.ConeGeometry(1, 1, 48, 1, true),
    new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      uniforms: { color: { value: new THREE.Color(0xffe2b8) }, k: { value: 0 } },
      vertexShader: 'varying float vY; void main(){ vY = position.y + 0.5; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform vec3 color; uniform float k; varying float vY; void main(){ gl_FragColor = vec4(color, k * 0.12 * vY * vY); }',
    }),
  );
  beam.scale.set(330, 450, 330);
  beam.position.set(0, 225, 30);
  scene.add(beam);

  // Billboard labels drawn on canvas
  const label = (lines, { w = 520, h = 120, bg = '#f4f4f2', fg = '#0b0b0b', size = 34, worldW = 300 } = {}) => {
    const c = Object.assign(document.createElement('canvas'), { width: w, height: h });
    const g = c.getContext('2d');
    g.fillStyle = bg;
    g.beginPath();
    g.roundRect(4, 4, w - 8, h - 8, h / 4);
    g.fill();
    g.fillStyle = fg;
    g.font = `600 ${size}px "Schibsted Grotesk Variable", system-ui, sans-serif`;
    g.textBaseline = 'middle';
    lines.forEach((t, i) => g.fillText(t, 28, h / 2 + (i - (lines.length - 1) / 2) * size * 1.25));
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false, depthTest: false }));
    s.renderOrder = 10; // labels always read on top of the set
    s.userData.size = [worldW, (worldW * h) / w];
    s.scale.set(...s.userData.size, 1);
    scene.add(s);
    return s;
  };
  const inbox = label(['✉  nandysushanta8@gmail.com'], { w: 640, worldW: 330 });
  inbox.position.set(-250, 420, 60);
  const copied = label(['Copied ✓'], { w: 260, bg: '#2fd47a', worldW: 120 });
  copied.position.set(-130, 470, 80);
  const ask = label(['Tell me about your', 'Playwright work?'], { w: 440, h: 150, worldW: 230 });
  ask.position.set(-250, 440, 60);
  const reply = label(['Migrated the regression', 'suite: 40% faster releases.'], { w: 520, h: 150, bg: '#2fd47a', worldW: 270 });
  reply.position.set(250, 440, 60);
  const hired = label(["You're hired!"], { w: 480, h: 130, bg: '#2fd47a', size: 58, worldW: 320 });
  hired.position.set(0, 455, 60);

  // Invite envelope
  const envelope = new THREE.Group();
  envelope.add(mesh(new THREE.BoxGeometry(56, 36, 3), mat(0xf4f4f2, { emissive: 0x333333 })));
  for (const s of [-1, 1]) {
    const flap = mesh(new THREE.BoxGeometry(34, 3, 1), mat(0x2fd47a, { emissive: 0x2fd47a, emissiveIntensity: 0.6 }), s * 14, 6, 2);
    flap.rotation.z = s * -0.55;
    envelope.add(flap);
  }
  envelope.visible = false;
  scene.add(envelope);
  const from = new THREE.Vector3(-250, 380, 60), to = new THREE.Vector3(230, 210, 90), mid = new THREE.Vector3(0, 620, 120);

  // Confetti
  const COUNT = 140;
  const confetti = new THREE.InstancedMesh(new THREE.PlaneGeometry(9, 5), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }), COUNT);
  const palette = [0x2fd47a, 0xf4f4f2, 0xffc56b, 0x6b4fa0].map((c) => new THREE.Color(c));
  const bits = Array.from({ length: COUNT }, (_, i) => {
    confetti.setColorAt(i, palette[i % palette.length]);
    return { p: new THREE.Vector3(), v: new THREE.Vector3(), r: new THREE.Euler(), s: Math.random() * 6 + 2 };
  });
  confetti.visible = false;
  scene.add(confetti);
  const dummy = new THREE.Object3D();
  const burst = () => {
    for (const b of bits) {
      b.p.set(0, 455, 60);
      const a = Math.random() * Math.PI * 2, up = Math.random();
      b.v.set(Math.cos(a) * (120 + 260 * Math.random()), 260 + 320 * up, Math.sin(a) * 160);
      b.r.set(Math.random() * 6, Math.random() * 6, 0);
    }
    confetti.visible = true;
  };

  // Timeline helpers
  const LOOP = 14;
  const clamp01 = (x) => Math.min(1, Math.max(0, x));
  const out3 = (x) => 1 - Math.pow(1 - x, 3);
  const window_ = (t, a, b, fade = 0.35) => Math.min(clamp01((t - a) / fade), clamp01((b - t) / fade)); // 0→1→0
  const pop = (sprite, t, a, b) => {
    const k = window_(t, a, b);
    sprite.material.opacity = k;
    const s = 0.85 + 0.15 * out3(clamp01((t - a) / 0.35));
    sprite.scale.set(sprite.userData.size[0] * s, sprite.userData.size[1] * s, 1);
  };

  let act = -1, burstDone = false, prevT = 0;
  function frame(t, dt) {
    const a = t < 4.5 ? 0 : t < 9.5 ? 1 : 2;
    if (a !== act) { act = a; onAct(a); }
    const fadeAll = window_(t, 0, LOOP, 0.6);

    // Act 1: HR finds and copies the email, the invite flies over.
    hrSpot.intensity = 5 * fadeAll * (a === 0 ? 1 : 0.55);
    pop(inbox, t, 0.4, 3.2);
    pop(copied, t, 1.5, 3.0);
    hr.arms[1].rotation.x = t > 1.2 && t < 2.2 ? -0.5 * Math.sin(((t - 1.2) / 1) * Math.PI) : 0; // reaches to copy
    const f = clamp01((t - 2.4) / 1.4);
    envelope.visible = f > 0 && f < 1;
    if (envelope.visible) {
      const e = out3(f), u = 1 - e;
      envelope.position.set(0, 0, 0).addScaledVector(from, u * u).addScaledVector(mid, 2 * u * e).addScaledVector(to, e * e);
      envelope.rotation.set(0, e * Math.PI * 2, Math.sin(e * Math.PI) * 0.4);
    }
    me.screen.intensity = 0.35 + 3 * window_(t, 3.8, 4.8, 0.25); // invite lands: screen flashes
    meSpot.intensity = 5 * fadeAll * (t > 3.6 ? 1 : 0.25);

    // Act 2: the interview under the pendant lamp; heads nod as each one talks.
    const lampK = fadeAll * (a >= 1 ? clamp01((t - 4.5) / 0.6) : 0);
    pendant.intensity = 2.2 * lampK;
    beam.material.uniforms.k.value = lampK;
    bulbMat.color.setScalar(0.25 + 0.75 * lampK);
    pop(ask, t, 5.0, 7.0);
    pop(reply, t, 7.1, 9.3);
    hr.head.rotation.x = 0.08 * Math.sin(t * 7) * window_(t, 5.0, 7.0);
    me.head.rotation.x = 0.08 * Math.sin(t * 7) * window_(t, 7.1, 9.3) - 0.12 * window_(t, 3.8, 4.8);

    // Act 3: hired. Light flash, badge, confetti, arms up.
    if (t >= 9.8 && !burstDone) { burst(); burstDone = true; }
    if (t < prevT) burstDone = false; // loop restarted
    pop(hired, t, 9.8, 13.4);
    party.intensity = 4 * window_(t, 9.7, 13.4, 0.25) * (1 + 0.3 * Math.sin(t * 9));
    const up = window_(t, 10, 13, 0.4);
    for (const arm of me.arms) arm.rotation.x = -2.4 * out3(up);
    hr.arms[1].rotation.x += -1.2 * out3(up);
    if (confetti.visible) {
      bits.forEach((b, i) => {
        b.v.y -= 420 * dt;
        b.v.multiplyScalar(1 - 0.6 * dt);
        b.p.addScaledVector(b.v, dt);
        b.r.x += b.s * dt;
        b.r.y += b.s * 0.7 * dt;
        dummy.position.copy(b.p);
        dummy.rotation.copy(b.r);
        dummy.scale.setScalar(window_(t, 9.8, 13.4, 0.3));
        dummy.updateMatrix();
        confetti.setMatrixAt(i, dummy.matrix);
      });
      confetti.instanceMatrix.needsUpdate = true;
      if (t > 13.4) confetti.visible = false;
    }
    prevT = t;
    renderer.render(scene, camera);
  }

  const resize = () => {
    const w = section.clientWidth, h = section.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Keep both people in frame on narrow screens by backing the camera away.
    const hHalf = Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect);
    const dist = Math.max(1150, 470 / Math.tan(hHalf));
    camera.position.set(0, 360, dist);
    camera.lookAt(look);
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(() => { resize(); frame(prevT, 0); }).observe(section);
  resize();

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // One still frame of the ending, without the flying confetti.
    frame(11.5, 0);
    return;
  }
  let visible = false, last = 0, clock = 0;
  const loop = (now) => {
    if (!visible) return;
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    clock = (clock + dt) % LOOP;
    frame(clock, dt);
    requestAnimationFrame(loop);
  };
  new IntersectionObserver(([e]) => {
    const was = visible;
    visible = e.isIntersecting;
    if (visible && !was) { last = performance.now(); requestAnimationFrame(loop); }
  }).observe(section);
}
