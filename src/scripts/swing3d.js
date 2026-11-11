import * as THREE from 'three';
import { seatedPerson } from './characters.js';

// The developer-on-a-swing as a lit 3D scene. World units are CSS pixels on the z = 0 plane,
// so the rope pivot lands exactly on the DOM S—N bar and the ground sits just above "(Scroll)".
// The character is modelled in the old SVG's units (240 wide, seat 250 below the bar) and scaled.
export function createSwing3D(canvas, swingEl) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 10, 8000);
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.75, ...extra });
  const part = (geo, m, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    return mesh;
  };
  const rod = (a, b, r, m) => {
    const d = new THREE.Vector3().subVectors(b, a);
    const mesh = part(new THREE.CylinderGeometry(r, r, d.length(), 12), m);
    mesh.position.copy(a).addScaledVector(d, 0.5);
    mesh.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
    return mesh;
  };

  const rope = mat(0xcfcfcb), wood = mat(0x8a6a4a);

  // pivot sits on the bar; rig swings around it.
  const pivot = new THREE.Group();
  const rig = new THREE.Group();
  pivot.add(rig);
  scene.add(pivot);

  rig.add(rod(V(-36, 0, 0), V(-54, -250, 0), 1.6, rope), rod(V(36, 0, 0), V(54, -250, 0), 1.6, rope));
  rig.add(part(new THREE.BoxGeometry(128, 8, 46), wood, 0, -253, 0));
  const { group: dev, shins } = seatedPerson();
  rig.add(dev);

  // Light: a lamp above the bar, a visible beam down through it, a lit pool on the ground.
  scene.add(new THREE.HemisphereLight(0xbcd0ff, 0x000000, 0.45));
  const lamp = new THREE.SpotLight(0xfff1dc, 3.2, 0, 0.42, 0.75, 0);
  lamp.castShadow = true;
  lamp.shadow.mapSize.set(1024, 1024);
  lamp.shadow.camera.near = 50;
  lamp.shadow.camera.far = 3000;
  lamp.shadow.bias = -0.0006;
  lamp.shadow.radius = 4;
  scene.add(lamp, lamp.target);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(5, 16, 12), new THREE.MeshBasicMaterial({ color: 0xfff6e8 }));
  scene.add(bulb);

  const beam = new THREE.Mesh(
    new THREE.ConeGeometry(1, 1, 48, 1, true),
    new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      uniforms: { color: { value: new THREE.Color(0xfff1dc) } },
      // Brightest at the lamp (local y = +0.5), fading out toward the ground.
      vertexShader: 'varying float vY; void main(){ vY = position.y + 0.5; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform vec3 color; varying float vY; void main(){ gl_FragColor = vec4(color, 0.11 * vY * vY); }',
    }),
  );
  scene.add(beam);

  const poolCanvas = Object.assign(document.createElement('canvas'), { width: 256, height: 256 });
  const pg = poolCanvas.getContext('2d');
  const grad = pg.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, '#fff');
  grad.addColorStop(0.55, '#888');
  grad.addColorStop(1, '#000');
  pg.fillStyle = grad;
  pg.fillRect(0, 0, 256, 256);
  // The ground only exists where light lands, so its edge never shows against the black page.
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshStandardMaterial({ color: 0x8c8c86, roughness: 1, transparent: true, alphaMap: new THREE.CanvasTexture(poolCanvas) }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const hero = swingEl.closest('.hero');
  const scrollCue = hero?.querySelector('.hero-scroll');
  const within = (el, ancestor) => {
    let x = 0, y = 0;
    for (let n = el; n && n !== ancestor; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
    return { x, y };
  };

  function resize() {
    if (!hero) return;
    const W = hero.clientWidth, H = hero.clientHeight;
    const at = within(swingEl, hero); // layout offsets ignore the hero's entrance/scroll transforms
    Object.assign(canvas.style, { left: `${-at.x}px`, top: `${-at.y}px`, width: `${W}px`, height: `${H}px` });
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.position.set(0, 0, H / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    camera.updateProjectionMatrix();

    const toWorld = (px, py) => V(px - W / 2, H / 2 - py, 0);
    const p = toWorld(at.x + swingEl.offsetWidth / 2, at.y);
    pivot.position.copy(p);
    rig.scale.setScalar(swingEl.offsetWidth / 240);

    const floorY = toWorld(0, scrollCue ? scrollCue.offsetTop - 44 : H * 0.88).y;
    const lampPos = V(p.x, p.y + 240, 70);
    lamp.position.copy(lampPos);
    bulb.position.copy(lampPos);
    lamp.target.position.set(p.x, floorY, 20);

    const h = lampPos.y - floorY, r = h * Math.tan(lamp.angle) * 0.92;
    beam.scale.set(r, h, r);
    beam.position.set(lampPos.x, lampPos.y - h / 2, lampPos.z - 25);
    beam.rotation.x = Math.atan2(50, h); // tilt toward the lamp target so the cone follows the light
    floor.position.set(p.x, floorY, 20);
    floor.scale.set(r * 2.6, r * 2.6, 1);
    renderer.render(scene, camera);
  }

  resize();
  addEventListener('resize', resize);
  document.fonts?.ready.then(resize);

  return {
    // theta > 0 = seat toward the viewer. Legs stretch out going forward, tuck under going back.
    pose(theta, max) {
      pivot.rotation.x = -theta;
      shins.rotation.x = theta > 0 ? (-1.1 * theta) / max : (0.6 * -theta) / max;
      renderer.render(scene, camera);
    },
  };
}
