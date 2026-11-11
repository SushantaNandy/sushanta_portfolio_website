import * as THREE from 'three';

// The release gate: builds ride a conveyor through a scanner. Passing builds light up green;
// every fifth one is a bug, turns red and is pushed off the belt. Renders only while on screen.
export function createGate(canvas, section) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const eye = new THREE.Vector3(0.5, 4.4, 11);
  const look = new THREE.Vector3(-1.2, 0.9, 0); // gate sits right of the heading

  const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.6, ...extra });
  const box = (w, h, d, m, x, y, z) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y, z);
    mesh.castShadow = mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  };

  // Ground that only exists where the light lands, so it melts into the black page.
  const pool = Object.assign(document.createElement('canvas'), { width: 256, height: 256 });
  const pg = pool.getContext('2d');
  const grad = pg.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, '#fff');
  grad.addColorStop(0.5, '#777');
  grad.addColorStop(1, '#000');
  pg.fillStyle = grad;
  pg.fillRect(0, 0, 256, 256);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(34, 16), mat(0x3a3a38, { roughness: 1, transparent: true, alphaMap: new THREE.CanvasTexture(pool) }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Conveyor with a moving striped belt
  const LEN = 26, TOP = 0.6;
  box(LEN, 0.3, 2.2, mat(0x141414), 0, TOP - 0.15, 0);
  const stripes = Object.assign(document.createElement('canvas'), { width: 64, height: 8 });
  const sg = stripes.getContext('2d');
  sg.fillStyle = '#1d1d1d';
  sg.fillRect(0, 0, 64, 8);
  sg.fillStyle = '#2b2b2b';
  sg.fillRect(0, 0, 6, 8);
  const beltTex = new THREE.CanvasTexture(stripes);
  beltTex.wrapS = THREE.RepeatWrapping;
  beltTex.repeat.set(LEN / 0.8, 1);
  const belt = new THREE.Mesh(new THREE.PlaneGeometry(LEN, 2), mat(0xffffff, { map: beltTex, roughness: 0.9 }));
  belt.rotation.x = -Math.PI / 2;
  belt.position.y = TOP + 0.005;
  belt.receiveShadow = true;
  scene.add(belt);

  // The gate: two pillars, a beam, a green strip and a scanning light sheet
  const frame = mat(0x2a2a2a, { metalness: 0.5, roughness: 0.35 });
  box(0.28, 2.7, 0.28, frame, 0, 1.35, 1.4);
  box(0.28, 2.7, 0.28, frame, 0, 1.35, -1.4);
  box(0.32, 0.32, 3.1, frame, 0, 2.75, 0);
  const strip = box(0.1, 0.05, 2.6, new THREE.MeshBasicMaterial({ color: 0x2fd47a }), 0, 2.57, 0);
  strip.castShadow = false;
  const sheetMat = new THREE.MeshBasicMaterial({ color: 0x2fd47a, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
  const sheet = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.95), sheetMat);
  sheet.rotation.y = Math.PI / 2;
  sheet.position.set(0, 1.58, 0);
  scene.add(sheet);
  const gateLight = new THREE.PointLight(0x2fd47a, 0, 6, 0);
  gateLight.position.set(0, 2.2, 0);
  scene.add(gateLight);

  scene.add(new THREE.HemisphereLight(0xcfd8ff, 0x000000, 0.9));
  const key = new THREE.SpotLight(0xfff1dc, 3.4, 0, 0.62, 0.85, 0);
  key.position.set(-1.5, 10, 4);
  key.target.position.set(0, 0, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 2;
  key.shadow.camera.far = 30;
  key.shadow.bias = -0.0008;
  scene.add(key, key.target);

  // Builds
  const RAW = 0x6a6a66, PASS = 0x2fd47a, FAIL = 0xe5484d;
  const N = 7, GAP = LEN / N, SPEED = 1.5, Y = TOP + 0.42;
  let count = 0;
  const builds = Array.from({ length: N }, (_, i) => {
    const m = box(0.84, 0.84, 0.84, mat(RAW, { roughness: 0.45 }), -LEN / 2 + i * GAP, Y, 0);
    return { m, state: 'raw', pop: 0, vz: 0, vy: 0, rest: 0 };
  });
  const paint = (b, color) => {
    b.m.material.color.setHex(color);
    b.m.material.emissive.setHex(color === RAW ? 0x000000 : color);
    b.m.material.emissiveIntensity = color === RAW ? 0 : 0.35;
  };
  const respawn = (b) => {
    const minX = Math.min(...builds.filter((o) => o !== b && o.state !== 'fall').map((o) => o.m.position.x));
    b.m.position.set(Math.min(minX - GAP, -LEN / 2), Y, 0);
    b.m.rotation.set(0, 0, 0);
    b.state = 'raw';
    b.vz = b.vy = b.rest = 0;
    paint(b, RAW);
  };

  let flash = 0;
  function step(dt) {
    beltTex.offset.x -= (SPEED * dt) / 0.8;
    for (const b of builds) {
      const p = b.m.position;
      if (b.state !== 'fall') p.x += SPEED * dt;
      if (b.state === 'raw' && p.x >= 0) {
        b.state = ++count % 5 === 0 ? 'bug' : 'pass';
        paint(b, b.state === 'bug' ? FAIL : PASS);
        b.pop = 1;
        flash = 1;
        sheetMat.color.setHex(b.state === 'bug' ? FAIL : PASS);
        gateLight.color.setHex(b.state === 'bug' ? FAIL : PASS);
      }
      if (b.state === 'bug' && p.x > 1.8) { b.state = 'fall'; b.vz = 2.4; }
      if (b.state === 'fall') {
        p.z += b.vz * dt;
        if (p.z > 1.1) { b.vy -= 9.8 * dt; b.m.rotation.x += 3 * dt; }
        p.y += b.vy * dt;
        if (p.y < 0.42) { p.y = 0.42; b.vy = 0; b.vz *= 0.9; b.rest += dt; }
        if (b.rest > 1.6) respawn(b);
      } else if (p.x > LEN / 2) respawn(b);
      b.pop = Math.max(0, b.pop - dt * 4);
      b.m.scale.setScalar(1 + 0.14 * Math.sin(b.pop * Math.PI));
    }
    flash = Math.max(0, flash - dt * 2.5);
    sheetMat.opacity = 0.32 * flash;
    gateLight.intensity = 3 * flash;
  }

  // Gentle camera parallax that eases toward the pointer instead of snapping to it
  const aim = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  section.addEventListener('pointermove', (e) => {
    const r = section.getBoundingClientRect();
    aim.x = (e.clientX - r.left) / r.width - 0.5;
    aim.y = (e.clientY - r.top) / r.height - 0.5;
  }, { passive: true });

  const draw = () => {
    camera.position.set(eye.x + cur.x * 2.2, eye.y - cur.y * 1.2, eye.z);
    camera.lookAt(look);
    renderer.render(scene, camera);
  };
  const resize = () => {
    const w = section.clientWidth, h = section.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 640 ? 46 : 32; // keep the whole gate in frame on phones
    camera.updateProjectionMatrix();
    draw();
  };
  new ResizeObserver(resize).observe(section);
  resize();

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; // one still frame

  let visible = false, last = 0;
  const loop = (now) => {
    if (!visible) return;
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    step(dt);
    cur.x += (aim.x - cur.x) * Math.min(1, dt * 4);
    cur.y += (aim.y - cur.y) * Math.min(1, dt * 4);
    draw();
    requestAnimationFrame(loop);
  };
  new IntersectionObserver(([e]) => {
    const was = visible;
    visible = e.isIntersecting;
    if (visible && !was) { last = performance.now(); requestAnimationFrame(loop); }
  }).observe(section);
}
