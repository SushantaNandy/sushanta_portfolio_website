import * as THREE from 'three';

// A seated person built from primitives, in the hero swing's units: the seat surface is at
// y = -250 and the head centre at y = -150, facing +z. Shared by the swing and the hiring scene.
export function seatedPerson({
  shirt = 0x1f2a37, pants = 0x2a3442, skin = 0xc68b5e, hair = 0x141414, shoes = 0x2fd47a,
  headphones = true, glasses = true, laptop = true, bun = false,
} = {}) {
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
  const body = mat(shirt), legs = mat(pants), face = mat(skin), dark = mat(hair), white = mat(0xe8e8e4);
  const green = mat(0x2fd47a, { emissive: 0x0b3a20 }), shoe = mat(shoes, { emissive: shoes === 0x2fd47a ? 0x0b3a20 : 0x000000 });
  const metal = mat(0xd9dde3, { roughness: 0.35, metalness: 0.4 });

  const group = new THREE.Group();
  group.add(part(new THREE.CapsuleGeometry(24, 36, 8, 20), body, 0, -213, -2));
  group.add(part(new THREE.CylinderGeometry(9, 9, 14, 12), face, 0, -173, 0));

  // Head pivots at the neck so it can nod.
  const head = new THREE.Group();
  head.position.set(0, -172, 0);
  const H = (mesh) => { mesh.position.y += 172; head.add(mesh); return mesh; };
  H(part(new THREE.SphereGeometry(25, 32, 24), face, 0, -150, 0));
  H(part(new THREE.SphereGeometry(26.5, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.42), dark, 0, -150, 0)).rotation.x = -0.35;
  if (bun) H(part(new THREE.SphereGeometry(11, 16, 12), dark, 0, -133, -22));
  if (headphones) {
    H(part(new THREE.TorusGeometry(29, 2.6, 10, 40, Math.PI), white, 0, -150, -2));
    for (const s of [-1, 1]) H(part(new THREE.CylinderGeometry(8, 8, 9, 20), green, s * 28, -153, -2)).rotation.z = Math.PI / 2;
  }
  for (const s of [-1, 1]) {
    if (glasses) H(part(new THREE.TorusGeometry(7, 1.2, 8, 24), white, s * 9, -151, 23.5));
    H(part(new THREE.SphereGeometry(2.6, 12, 8), dark, s * 9, -151, 24));
  }
  H(part(new THREE.TorusGeometry(5, 1, 6, 16, Math.PI), dark, 0, -161, 24)).rotation.z = Math.PI;
  group.add(head);

  // Arms pivot at the shoulder so they can be raised.
  const arms = [-1, 1].map((s) => {
    const arm = new THREE.Group();
    arm.position.set(s * 24, -190, 2);
    const A = (mesh) => { mesh.position.add(V(-s * 24, 190, -2)); arm.add(mesh); return mesh; };
    A(rod(V(s * 24, -190, 2), V(s * 30, -222, 20), 6.5, body));
    A(rod(V(s * 30, -222, 20), V(s * 18, -232, 40), 6, body));
    A(part(new THREE.SphereGeometry(5.5, 12, 10), face, s * 17, -233, 42));
    group.add(arm);
    return arm;
  });

  let screen = null;
  if (laptop) {
    group.add(part(new THREE.BoxGeometry(76, 4, 46), metal, 0, -237, 32));
    const lid = new THREE.Group();
    lid.position.set(0, -235, 55);
    lid.rotation.x = -0.22;
    lid.add(part(new THREE.BoxGeometry(70, 46, 3), metal, 0, 23, 0));
    const c = Object.assign(document.createElement('canvas'), { width: 128, height: 64 });
    const g = c.getContext('2d');
    g.fillStyle = '#16a35a';
    g.font = 'bold 40px monospace';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('</>', 64, 34);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const logo = new THREE.Mesh(new THREE.PlaneGeometry(32, 16), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
    logo.position.set(0, 23, 1.6);
    lid.add(logo);
    group.add(lid);
    screen = new THREE.PointLight(0x2fd47a, 0.35, 70, 0); // screen light on the face
    screen.position.set(0, -205, 45);
    group.add(screen);
  }

  // Thighs on the seat; shins hang from the knees.
  const shins = new THREE.Group();
  shins.position.set(0, -246, 42);
  for (const s of [-1, 1]) {
    group.add(rod(V(s * 12, -246, -2), V(s * 12, -246, 42), 8, legs));
    shins.add(rod(V(s * 12, 0, 0), V(s * 12, -54, 0), 7, legs));
    const foot = part(new THREE.SphereGeometry(10, 16, 12), shoe, s * 12, -58, 6);
    foot.scale.set(1, 0.6, 1.5);
    shins.add(foot);
  }
  group.add(shins);

  return { group, head, arms, shins, screen };
}
