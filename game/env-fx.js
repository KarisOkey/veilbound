// Reactive environment for the duel: the world answers the fight.
// Clash light (every big impact lights the surroundings), lingering scorch scars, wind-blown leaves and scattering
// birds (Sanctuary), rain splashes and heavier rain (Lamplight Avenue), embers and ash plus a falling burning beam
// (Burning Rooftops), and a gas lamp that shatters into fire. Everything is pooled; nothing allocates per frame.
export function createEnvFx(THREE, scene) {
  const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z), rnd = (a = 0, b = 1) => a + Math.random() * (b - a);
  const root = new THREE.Group(); root.name = 'env-fx'; scene.add(root);
  const tex = draw => { const c = document.createElement('canvas'); c.width = c.height = 64; draw(c.getContext('2d')); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
  const leafTex = tex(g => { g.translate(32, 32); g.rotate(.5); g.fillStyle = '#fff'; g.beginPath(); g.ellipse(0, 0, 26, 11, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-24, 0); g.lineTo(24, 0); g.stroke(); });
  const birdTex = tex(g => { g.strokeStyle = '#111'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(6, 26); g.quadraticCurveTo(20, 16, 32, 30); g.quadraticCurveTo(44, 16, 58, 26); g.stroke(); });
  const dotTex = tex(g => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 30); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.35, 'rgba(255,255,255,.6)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); });
  const ringTex = tex(g => { g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 3; g.beginPath(); g.arc(32, 32, 26, 0, 7); g.stroke(); });
  const scarTex = tex(g => { const r = g.createRadialGradient(32, 32, 2, 32, 32, 31); r.addColorStop(0, 'rgba(10,8,6,.85)'); r.addColorStop(.6, 'rgba(20,14,10,.45)'); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); g.strokeStyle = 'rgba(0,0,0,.6)'; g.lineWidth = 2; for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28; g.beginPath(); g.moveTo(32, 32); g.lineTo(32 + Math.cos(a) * 30, 32 + Math.sin(a) * 30); g.stroke(); } });

  // ---------- clash light ----------
  const lights = []; for (let i = 0; i < 3; i++) { const L = new THREE.PointLight(0xffffff, 0, 9, 1.6); L.visible = false; root.add(L); lights.push({ L, t: 1, peak: 0 }); }
  let li = 0;
  function flashLight(at, color = 0xffe2b0, power = 40, life = .22) { const o = lights[li++ % lights.length]; o.L.position.copy(at); o.L.color.set(color); o.peak = power; o.t = 0; o.life = life; o.L.visible = true; }

  // ---------- billboards: leaves, birds, embers, splashes ----------
  function pool(n, map, { additive = false, size = .1 } = {}) {
    const P = []; for (let i = 0; i < n; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map, transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending })); s.visible = false; s.scale.setScalar(size); root.add(s); P.push({ s, p: V3(), v: V3(), life: 0, age: 0, spin: 0, size }); }
    let i = 0; return { P, next: () => P[i++ % n] };
  }
  const leaves = pool(90, leafTex, { size: .09 }), birds = pool(14, birdTex, { size: .35 }), embers = pool(160, dotTex, { additive: true, size: .07 }), splashes = pool(40, ringTex, { size: .2 }), sparks = pool(80, dotTex, { additive: true, size: .06 });
  for (const q of splashes.P) { q.s.material.rotation = 0; }
  const leafCols = [0x6f8e4a, 0x9aa64f, 0xc9a64a, 0x7a5a32];

  // ---------- scars ----------
  const scars = []; for (let i = 0; i < 14; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: scarTex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 })); m.rotation.x = -Math.PI / 2; m.visible = false; m.renderOrder = 2; root.add(m); scars.push(m); }
  let si = 0; function scar(at, size = 1.2) { const m = scars[si++ % scars.length]; m.position.set(at.x, at.y + .02, at.z); m.scale.setScalar(size); m.rotation.z = Math.random() * 6.28; m.material.opacity = .9; m.visible = true; }

  // ---------- set pieces ----------
  // a gas lamp the duel passes; one cut shatters it into fire
  const lampMat = new THREE.MeshStandardMaterial({ color: 0x1c1a1a, metalness: .6, roughness: .5 }), glassMat = new THREE.MeshStandardMaterial({ color: 0xffd38a, emissive: 0xffb050, emissiveIntensity: 2.2, transparent: true, opacity: .9 });
  const lamp = new THREE.Group(); { const post = new THREE.Mesh(new THREE.CylinderGeometry(.05, .07, 3.0, 8), lampMat); post.position.y = 1.5; const cap = new THREE.Mesh(new THREE.ConeGeometry(.24, .18, 6), lampMat); cap.position.y = 3.38; const glass = new THREE.Mesh(new THREE.CylinderGeometry(.16, .12, .34, 6), glassMat); glass.position.y = 3.15; const L = new THREE.PointLight(0xffb060, 6, 9, 1.8); L.position.y = 3.1; lamp.add(post, cap, glass, L); lamp.userData = { glass, L }; }
  lamp.visible = false; root.add(lamp); let lampBurst = -1;
  // a burning beam that drops between the fighters
  const beamMat = new THREE.MeshStandardMaterial({ color: 0x3a2214, emissive: 0xff5a10, emissiveIntensity: .9, roughness: .9 });
  const beam = new THREE.Mesh(new THREE.BoxGeometry(3.2, .26, .26), beamMat); beam.visible = false; root.add(beam); const beamFire = new THREE.PointLight(0xff6a20, 0, 8, 1.6); beam.add(beamFire);
  let beamS = null;

  let mode = null, gustT = 0, rainBoost = 0;
  const api = {
    root, flashLight, scar,
    setMode(m) { mode = m; for (const p of [leaves, birds, embers, splashes, sparks]) for (const q of p.P) { q.life = 0; q.s.visible = false; } for (const m2 of scars) m2.visible = false; lamp.visible = false; beam.visible = false; beamS = null; lampBurst = -1; rainBoost = 0; },
    gust(at, dir, n = 26) { for (let i = 0; i < n; i++) { const q = leaves.next(); q.p.set(at.x + rnd(-2.5, 2.5), at.y + rnd(.1, 1.8), at.z + rnd(-2.5, 2.5)); q.v.set(dir.x * rnd(3, 6) + rnd(-1, 1), rnd(.5, 2.4), dir.z * rnd(3, 6) + rnd(-1, 1)); q.life = rnd(1.6, 2.8); q.age = 0; q.spin = rnd(-6, 6); q.s.material.color.set(leafCols[i % 4]); q.s.visible = true; } },
    birds(at) { for (let i = 0; i < birds.P.length; i++) { const q = birds.next(); q.p.set(at.x + rnd(-5, 5), at.y + rnd(5, 9), at.z + rnd(-5, 5)); q.v.set(rnd(-4, 4), rnd(3, 6), rnd(-4, 4)); q.life = rnd(2.5, 3.5); q.age = 0; q.s.visible = true; } },
    splash(at) { const q = splashes.next(); q.p.set(at.x, at.y + .03, at.z); q.life = .45; q.age = 0; q.s.visible = true; for (let i = 0; i < 4; i++) { const d = sparks.next(); d.p.set(at.x, at.y + .05, at.z); d.v.set(rnd(-1.2, 1.2), rnd(1.5, 3), rnd(-1.2, 1.2)); d.life = .35; d.age = 0; d.s.material.color.set(0xbcd4ff); d.s.visible = true; } },
    rain(boost) { rainBoost = boost; },
    placeLamp(at) { lamp.position.copy(at); lamp.visible = true; lamp.userData.glass.visible = true; lamp.userData.L.intensity = 6; lampBurst = -1; },
    breakLamp() { if (!lamp.visible) return; const at = lamp.position.clone().add(V3(0, 3.1, 0)); lamp.userData.glass.visible = false; lampBurst = 0; flashLight(at, 0xff8a30, 120, .6); for (let i = 0; i < 60; i++) { const q = embers.next(); q.p.copy(at); q.v.set(rnd(-4, 4), rnd(-1, 5), rnd(-4, 4)); q.life = rnd(.6, 1.4); q.age = 0; q.s.material.color.set(i % 3 ? 0xff9a40 : 0xffe0a0); q.s.visible = true; } return at; },
    dropBeam(at) { beam.position.set(at.x, at.y + 7, at.z); beam.rotation.set(rnd(-.2, .2), rnd(0, 3), rnd(-.25, .25)); beam.visible = true; beamFire.intensity = 8; beamS = { vy: 0, floor: at.y + .13, landed: false }; },
    get beamLanded() { return !!beamS?.landed; },
    update(dt, cam, focus) {
      for (const o of lights) { if (o.t >= 1) { o.L.visible = false; continue; } o.t += dt / o.life; o.L.intensity = o.peak * Math.pow(1 - Math.min(1, o.t), 2); }
      // ambient life per world
      if (mode === 'sanctuary' && focus) { gustT -= dt; if (gustT < 0) { gustT = rnd(1.4, 2.6); this.gust(focus, V3(1, 0, .3).normalize(), 10); } }
      if (mode === 'rooftops' && focus) for (let k = 0; k < 3; k++) { const q = embers.next(); if (q.life > 0) continue; q.p.set(focus.x + rnd(-8, 8), focus.y + rnd(-.5, 1), focus.z + rnd(-8, 8)); q.v.set(rnd(-.4, .4), rnd(1, 2.6), rnd(-.4, .4)); q.life = rnd(1.5, 3); q.age = 0; q.s.material.color.set(Math.random() < .7 ? 0xff7a30 : 0xffc070); q.s.visible = true; }
      for (const q of leaves.P) { if (q.life <= 0) continue; q.age += dt; q.life -= dt; q.v.y -= 1.2 * dt; q.v.multiplyScalar(1 - dt * .6); q.p.addScaledVector(q.v, dt); q.p.x += Math.sin(q.age * 5 + q.spin) * dt * .6; q.s.position.copy(q.p); q.s.material.rotation += q.spin * dt; q.s.material.opacity = Math.min(1, q.life); if (q.life <= 0) q.s.visible = false; }
      for (const q of birds.P) { if (q.life <= 0) continue; q.age += dt; q.life -= dt; q.p.addScaledVector(q.v, dt); q.s.position.copy(q.p); q.s.scale.set(.35, .35 * (.6 + .4 * Math.abs(Math.sin(q.age * 14))), 1); q.s.material.opacity = Math.min(1, q.life); if (q.life <= 0) q.s.visible = false; }
      for (const q of embers.P) { if (q.life <= 0) continue; q.age += dt; q.life -= dt; q.v.y += (mode === 'rooftops' ? .6 : -3) * dt; q.p.addScaledVector(q.v, dt); q.p.x += Math.sin(q.age * 3 + q.p.z) * dt * .3; q.s.position.copy(q.p); q.s.material.opacity = Math.min(1, q.life * 1.5); if (q.life <= 0) q.s.visible = false; }
      for (const q of sparks.P) { if (q.life <= 0) continue; q.life -= dt; q.v.y -= 9 * dt; q.p.addScaledVector(q.v, dt); q.s.position.copy(q.p); q.s.material.opacity = Math.min(1, q.life * 3); if (q.life <= 0) q.s.visible = false; }
      for (const q of splashes.P) { if (q.life <= 0) continue; q.age += dt; q.life -= dt; const k = q.age / .45; q.s.position.copy(q.p); q.s.scale.set(.15 + k * .9, (.15 + k * .9) * .35, 1); q.s.material.opacity = (1 - k) * .8; if (q.life <= 0) q.s.visible = false; }
      if (lampBurst >= 0) { lampBurst += dt; lamp.userData.L.intensity = lampBurst < .5 ? 30 * (1 - lampBurst) : 4 + Math.random() * 4; }
      if (beamS && !beamS.landed) { beamS.vy -= 24 * dt; beam.position.y += beamS.vy * dt; beam.rotation.z += dt * .8; if (beam.position.y <= beamS.floor) { beam.position.y = beamS.floor; beamS.landed = true; flashLight(beam.position.clone().add(V3(0, .5, 0)), 0xff7a30, 90, .5); scar(beam.position, 2.4); for (let i = 0; i < 50; i++) { const q = embers.next(); q.p.copy(beam.position); q.v.set(rnd(-4, 4), rnd(1, 6), rnd(-4, 4)); q.life = rnd(.8, 1.8); q.age = 0; q.s.material.color.set(0xff8a30); q.s.visible = true; } } }
      if (beamS?.landed) beamFire.intensity = 6 + Math.random() * 3;
      for (const m of scars) if (m.visible) m.material.opacity = Math.max(.35, m.material.opacity - dt * .05);
    },
  };
  return api;
}
