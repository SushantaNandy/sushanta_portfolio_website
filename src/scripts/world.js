import * as THREE from 'three';

const NAVY = 0x0b1b2e, GO = 0x2fd47a, WAIT = 0xf2b84b, GREY = 0x41566e;
const GATE_GAP = 46, FIRST_GATE = -24;
const gateZ = (i) => FIRST_GATE - i * GATE_GAP;
const NAMES = ['Profile', 'Results', 'Domain', 'Projects', 'About', 'Contact'];
const LAST = NAMES.length - 1;
const END_Z = gateZ(LAST) - 40;

function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function windowsTexture() {
  return canvasTexture(64, 128, (g, w, h) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
    for (let y = 4; y < h - 4; y += 8) for (let x = 4; x < w - 4; x += 8) {
      if (Math.random() < 0.32) { g.fillStyle = Math.random() < 0.8 ? '#ffd98a' : '#9fe8ff'; g.fillRect(x, y, 4, 4); }
    }
  });
}

function labelTexture(i) {
  return canvasTexture(512, 128, (g, w, h) => {
    g.fillStyle = 'rgba(11,27,46,0.9)'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#9fb0c3'; g.font = '600 28px ui-monospace, monospace';
    g.fillText(`STAGE ${i + 1}`, 24, 44);
    g.fillStyle = '#eaf0f6'; g.font = '700 54px system-ui, sans-serif';
    g.fillText(NAMES[i], 24, 104);
  });
}

function buildCity(scene) {
  const tex = windowsTexture();
  const mat = new THREE.MeshStandardMaterial({ color: 0x10243b, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.9, roughness: 0.9 });
  const count = 260;
  const city = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat, count);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const side = i % 2 ? 1 : -1;
    const w = 5 + Math.random() * 7, d = 5 + Math.random() * 7, h = 8 + Math.random() ** 2 * 50;
    p.set(side * (22 + Math.random() * 70), h / 2, 40 - Math.random() * (40 - END_Z + 40));
    s.set(w, h, d);
    city.setMatrixAt(i, m.compose(p, q, s));
  }
  scene.add(city);
}

function buildRoad(scene) {
  const len = 40 - END_Z;
  const tex = canvasTexture(64, 256, (g, w, h) => {
    g.fillStyle = '#132a44'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#3c5876'; g.fillRect(w / 2 - 2, 0, 4, h * 0.5);
    g.fillStyle = '#2fd47a'; g.fillRect(0, 0, 3, h); g.fillRect(w - 3, 0, 3, h);
  });
  tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(1, len / 12);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(14, len), new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.25, roughness: 0.8 }));
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, 0.01, 40 - len / 2);
  scene.add(road);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 600), new THREE.MeshStandardMaterial({ color: 0x07121f, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.z = END_Z / 2;
  scene.add(ground);
}

// One gate per stage, with a status lamp and a pipeline segment leading to it.
function buildGate(scene, i) {
  const z = gateZ(i);
  const frame = new THREE.MeshStandardMaterial({ color: 0x1d3552, roughness: 0.6, metalness: 0.3 });
  const g = new THREE.Group();
  for (const x of [-7.5, 7.5]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.7, 8, 0.7), frame);
    post.position.set(x, 4, 0); g.add(post);
  }
  const beam = new THREE.Mesh(new THREE.BoxGeometry(15.7, 0.9, 0.9), frame);
  beam.position.y = 8.2; g.add(beam);

  const label = new THREE.Mesh(new THREE.PlaneGeometry(8, 2), new THREE.MeshBasicMaterial({ map: labelTexture(i), transparent: true }));
  label.position.set(0, 10, 0); g.add(label);

  const lampMat = new THREE.MeshStandardMaterial({ color: GREY, emissive: GREY, emissiveIntensity: 1 });
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 12), lampMat);
  lamp.position.set(0, 8.2, 0.6); g.add(lamp);

  const segMat = new THREE.MeshStandardMaterial({ color: GREY, emissive: GREY, emissiveIntensity: 0.8 });
  const seg = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, GATE_GAP - 2), segMat);
  seg.position.set(-8.6, 0.12, GATE_GAP / 2); g.add(seg);

  g.position.z = z;
  scene.add(g);
  return { z, lampMat, segMat, passed: false };
}

function buildPod(scene) {
  const pod = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), new THREE.MeshStandardMaterial({ color: 0xdfe8f1, roughness: 0.25, metalness: 0.4 }));
  body.scale.set(1.3, 0.55, 2);
  const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.62, 24, 12), new THREE.MeshStandardMaterial({ color: 0x0b1b2e, emissive: 0x2a9dd4, emissiveIntensity: 0.6, roughness: 0.1 }));
  canopy.position.set(0, 0.42, -0.25); canopy.scale.set(1, 0.7, 1.4);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.12, 10, 40), new THREE.MeshBasicMaterial({ color: GO }));
  ring.rotation.x = Math.PI / 2; ring.position.y = -0.45;
  const light = new THREE.PointLight(GO, 30, 14, 2);
  light.position.y = -0.6;
  const tilt = new THREE.Group();
  tilt.add(body, canopy, ring, light);
  pod.add(tilt);
  pod.position.set(0, 1.4, 22);
  scene.add(pod);
  return { pod, tilt };
}

function createSound() {
  let ctx, hum, gain;
  return {
    on() {
      ctx ??= new AudioContext();
      if (!hum) {
        hum = ctx.createOscillator(); hum.type = 'sawtooth'; hum.frequency.value = 55;
        const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 400;
        gain = ctx.createGain(); gain.gain.value = 0;
        hum.connect(filter).connect(gain).connect(ctx.destination); hum.start();
      }
      ctx.resume();
    },
    off() { ctx?.suspend(); },
    speed(v) { if (gain) { gain.gain.value = 0.015 + v * 0.0025; hum.frequency.value = 55 + v * 3; } },
    chime() {
      if (!ctx || ctx.state !== 'running') return;
      const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
      o.frequency.setValueAtTime(880, t); o.frequency.setValueAtTime(1320, t + 0.09);
      g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.5);
    },
  };
}

export function startWorld(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(NAVY);
  scene.fog = new THREE.Fog(NAVY, 40, 170);
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 400);

  scene.add(new THREE.HemisphereLight(0x5a7da6, 0x07121f, 1.1));
  const moon = new THREE.DirectionalLight(0x9fc3ff, 1.2);
  moon.position.set(-30, 60, 20); scene.add(moon);

  buildRoad(scene);
  buildCity(scene);
  const gates = NAMES.map((_, i) => buildGate(scene, i));
  const { pod, tilt } = buildPod(scene);

  const panel = document.getElementById('panel');
  const articles = [...panel.querySelectorAll('[data-station]')];
  const stageBtns = [...document.querySelectorAll('[data-goto]')];
  const hint = document.getElementById('hint');
  const sound = createSound();

  function show(i) {
    articles.forEach((a, j) => (a.hidden = j !== i));
    panel.hidden = false;
    document.body.classList.add('panel-open');
  }
  document.getElementById('close').addEventListener('click', () => { panel.hidden = true; document.body.classList.remove('panel-open'); });

  function pass(i) {
    const g = gates[i];
    if (g.passed) return;
    g.passed = true;
    const c = i === LAST ? WAIT : GO; // the last stage waits on the recruiter
    g.lampMat.color.setHex(c); g.lampMat.emissive.setHex(c);
    g.segMat.color.setHex(GO); g.segMat.emissive.setHex(GO);
    stageBtns[i].classList.add('is-passed');
    sound.chime();
  }

  // Driving state
  const keys = { up: false, down: false, left: false, right: false };
  const KEYMAP = { ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right' };
  let heading = 0, speed = 0, current = -1;

  const setKey = (k, v) => {
    keys[k] = v;
    if (v) hint.classList.add('is-gone');
  };
  addEventListener('keydown', (e) => {
    const k = KEYMAP[e.code];
    if (!k || e.target.closest?.('input, textarea, select')) return;
    if (e.code.startsWith('Arrow')) e.preventDefault();
    setKey(k, true);
  });
  addEventListener('keyup', (e) => { const k = KEYMAP[e.code]; if (k) keys[k] = false; });
  addEventListener('blur', () => Object.keys(keys).forEach((k) => (keys[k] = false)));
  for (const b of document.querySelectorAll('[data-key]')) {
    const k = b.dataset.key;
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); b.setPointerCapture(e.pointerId); setKey(k, true); });
    for (const ev of ['pointerup', 'pointercancel']) b.addEventListener(ev, () => (keys[k] = false));
  }

  stageBtns.forEach((b, i) => b.addEventListener('click', () => {
    pod.position.set(0, 1.4, gateZ(i) + 14); // just before the gate, so it stays in view
    heading = 0; speed = 0;
    camera.position.set(0, 7, pod.position.z + 11); // snap, so the camera doesn't fly through gates
    for (let j = 0; j <= i; j++) pass(j);
    current = i; show(i);
    hint.classList.add('is-gone');
  }));

  const soundBtn = document.getElementById('sound');
  soundBtn.addEventListener('click', () => {
    const on = soundBtn.getAttribute('aria-pressed') !== 'true';
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.textContent = on ? 'Sound on' : 'Sound off';
    on ? sound.on() : sound.off();
  });

  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 760 ? 72 : 60;
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize);
  resize();

  const camTarget = new THREE.Vector3(), look = new THREE.Vector3();
  const clock = new THREE.Clock();
  camera.position.set(0, 7, 34);

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;

    const thrust = (keys.up ? 1 : 0) - (keys.down ? 0.6 : 0);
    speed += thrust * 34 * dt;
    speed *= Math.pow(0.35, dt); // drag
    speed = THREE.MathUtils.clamp(speed, -12, 30);
    const steer = (keys.left ? 1 : 0) - (keys.right ? 1 : 0);
    heading += steer * dt * 2.2 * Math.min(1, Math.abs(speed) / 6 + 0.25);

    pod.position.x = THREE.MathUtils.clamp(pod.position.x - Math.sin(heading) * speed * dt, -60, 60);
    pod.position.z = THREE.MathUtils.clamp(pod.position.z - Math.cos(heading) * speed * dt, END_Z, 34);
    pod.position.y = 1.4 + Math.sin(t * 2.4) * 0.12;
    pod.rotation.y = heading;
    tilt.rotation.z = THREE.MathUtils.lerp(tilt.rotation.z, steer * 0.25 * Math.min(1, speed / 10), 0.1);
    tilt.rotation.x = THREE.MathUtils.lerp(tilt.rotation.x, -thrust * 0.08, 0.1);

    // Passing a gate: on the road and just beyond its line.
    for (let i = 0; i < gates.length; i++) {
      const dz = pod.position.z - gates[i].z;
      if (dz < 0 && dz > -6 && Math.abs(pod.position.x) < 8.5) {
        pass(i);
        if (current !== i) { current = i; show(i); }
      }
    }
    gates[LAST].lampMat.emissiveIntensity = gates[LAST].passed ? 0.7 + Math.sin(t * 4) * 0.5 : 1;
    sound.speed(Math.abs(speed));

    camTarget.set(Math.sin(heading) * 11, 5.5, Math.cos(heading) * 11).add(pod.position);
    camera.position.lerp(camTarget, 1 - Math.pow(0.02, dt));
    look.set(-Math.sin(heading) * 6, 1, -Math.cos(heading) * 6).add(pod.position);
    camera.lookAt(look);

    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(frame);
  document.addEventListener('visibilitychange', () => {
    renderer.setAnimationLoop(document.hidden ? null : frame);
    clock.getDelta();
  });
}
