// Trailer director v4 (loaded with ?trailer), about 80 s.
//   Title → a tour of all seven worlds (one travelling shot each, all drifting the same way so the cuts flow) →
//   Cloudveil Sanctuary: crane onto the court, the pair, the bow, the draw, VS → one continuous duel through four
//   locations. Nobody flies: inside a location the fight moves on the ground (dash exchanges, ridge hops) or by
//   cutting on a push-off; between locations each seam has a cause: a match cut mid-slash, a gas lamp shattered into
//   fire, a roof that breaks under a kick so Haru falls into the Keep. The world reacts throughout (env-fx.js).
// With ?capture the game is stepped frame by frame (window.__STEP__); tools/trailer-capture.mjs records it.
import { createEnvFx } from './env-fx.js';
export function install(C) {
  const { THREE } = C, V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ease = t => { t = clamp(t); return t * t * (3 - 2 * t); }, easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
  const cam = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, .1, 2500);
  addEventListener('resize', () => { cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); });
  function groundY(x, z, fb = 0) { try { const g = C.getWorld().walkHeight(x, z); return Number.isFinite(g) ? g : fb; } catch { return fb; } }
  const env = createEnvFx(THREE, C.scene);
  // every big impact lights the world around it, and the heavy ones leave scars
  { const fx = C.fx; if (fx) { const wrap = (n, fn) => { const o = fx[n]; if (o) fx[n] = (...a) => { try { fn(...a); } catch {} return o.apply(fx, a); }; };
    wrap('clashBurst', at => env.flashLight(at, 0xffe2a8, 55, .22));
    wrap('hitBurst', (at, o = {}) => { env.flashLight(at, o.color ?? 0xbfefff, o.heavy ? 70 : 30, o.heavy ? .3 : .16); if (o.heavy) env.scar(V3(at.x, groundY(at.x, at.z, at.y - 1), at.z), 1.3); });
    wrap('shockwave', at => { env.flashLight(at, 0xffffff, 60, .3); env.scar(at, 2); }); } }

  const TOUR = [
    { id: 'cedar', kanji: '谷', world: 'World I', name: 'The Valley of Silent Bells' },
    { id: 'city-tower', kanji: '灯', world: 'World II', name: 'The Ward of a Thousand Lamps' },
    { id: 'ridge-hollow', kanji: '霧', world: 'World III', name: 'Mistweave Ridge', exposure: 2.1 },
    { id: 'express-dawn', kanji: '汽', world: 'World IV', name: 'The Midnight Express' },
    { id: 'quarter-avenue', kanji: '浮', world: 'World V', name: 'The Floating Quarter' },
    { id: 'springs-basin', kanji: '炉', world: 'World VI', name: 'Ember Springs' },
    { id: 'keep-atrium', kanji: '城', world: 'World VII', name: 'The Endless Keep' },
  ].map(o => ({ ...o, tour: true }));
  // fight locations. beats: [seconds of fight here, who, what]
  const FIGHT = [
    { id: 'sanctuary', mode: 'sanctuary', intro: true, splash: true, dur: 11.2, out: 'match', palette: ['wide', 'closeH', 'dir', 'top', 'lowHero', 'closeR', 'dir', 'orbit', 'ots', 'dutch'],
      beats: [[2.2, 'hero', 'dashAttack'], [3.2, 'x', 'birds'], [3.3, 'rival', 'parry'], [4.4, 'rival', 'c1'], [5.4, 'x', 'relocate'], [6.9, 'hero', 'launcher'], [8.3, 'rival', 'kick']] },
    { id: 'city-avenue', mode: 'city', in: 'match', dur: 11, out: 'lamp', palette: ['track', 'closeR', 'dir', 'puddle', 'otsR', 'closeH', 'dir', 'blade', 'track', 'wide'],
      beats: [[.9, 'hero', 'dashAttack'], [1.8, 'hero', 'c2'], [2.6, 'hero', 'art2'], [5.4, 'rival', 'dashAttack'], [6.3, 'rival', 'c1'], [7.1, 'hero', 'dashAttack'], [8, 'x', 'clash']] },
    { id: 'quarter-rooftops', mode: 'rooftops', in: 'fire', dur: 11, out: 'roof', palette: ['low', 'closeH', 'dir', 'crane', 'closeR', 'wide', 'dir', 'dutch', 'lowHero'],
      beats: [[.8, 'x', 'clash'], [1.6, 'x', 'hops'], [3.9, 'rival', 'art2'], [6.3, 'x', 'beam'], [7.6, 'hero', 'c1'], [8.6, 'rival', 'kick']] },
    { id: 'keep-meridian', mode: 'keep', in: 'fall', finale: true, winner: 'hero', fin: 9.6, palette: ['vertigo', 'closeH', 'dir', 'orbit', 'closeR', 'dir', 'dutch', 'ots', 'top'],
      beats: [[2.0, 'rival', 'art'], [5.6, 'x', 'clash'], [6.6, 'x', 'lock']] },
  ];
  const SEQ = [...TOUR, ...FIGHT];
  const INTRO = r => r.intro ? 2.0 : 0, FIN_AT = r => r.fin ?? 1e9, isArtName = n => n === 'art' || n === 'art2';
  const TOUR_DUR = 2.5, OPEN = 2.6;

  // ---------- overlay ----------
  const css = document.createElement('style'); css.textContent = `
  body.trailer header.interface,body.trailer #hud,body.trailer #title,body.trailer #title-foot,body.trailer #toast,body.trailer #interact,body.trailer #photo-hint,body.trailer #duel,body.trailer #arena-label,body.trailer #loading,body.trailer #views,body.trailer #crosshair{display:none!important}
  #trl{position:fixed;inset:0;pointer-events:none;z-index:50;overflow:hidden;font-family:'Cormorant Garamond',Georgia,serif;color:#f6efe2}
  #trl .black{position:absolute;inset:0;background:#05060a;opacity:0}
  #trl .flash{position:absolute;inset:0;background:#fff;opacity:0}
  #trl .bars i{position:absolute;left:0;right:0;height:9vh;background:#000}#trl .bars i:first-child{top:0}#trl .bars i:last-child{bottom:0}
  #trl .card{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;text-align:center}
  #trl .kanji{font-family:'Hiragino Mincho ProN','Yu Mincho',serif;font-weight:600;color:#b8232f;text-shadow:0 0 30px rgba(184,35,47,.45)}
  #trl .logo{font-size:min(11vw,150px);letter-spacing:.18em;font-weight:600;line-height:1;text-shadow:0 0 40px rgba(120,200,220,.25)}
  #trl .sub{font-family:Manrope,Arial,sans-serif;font-size:min(1.6vw,20px);letter-spacing:.5em;text-transform:uppercase;opacity:.82;margin-top:2.2vh}
  #trl .world{position:absolute;left:7vw;bottom:13vh;display:flex;align-items:flex-end;gap:2.4vw;opacity:0}
  #trl .world .wk{font-family:'Hiragino Mincho ProN','Yu Mincho',serif;font-size:min(13vw,190px);line-height:.85;color:#f6efe2;text-shadow:0 0 34px rgba(0,0,0,.55)}
  #trl .world .wn{font-family:Manrope,Arial,sans-serif;font-weight:800;font-size:min(1.3vw,16px);letter-spacing:.6em;color:#ffd98a}
  #trl .world .wt{font-size:min(5vw,66px);font-weight:600;line-height:1.05;text-shadow:0 2px 18px rgba(0,0,0,.7)}
  #trl .world .ink{height:3px;margin-top:1.4vh;background:linear-gradient(90deg,#ffd98a,rgba(255,217,138,0));transform-origin:left}
  #trl .lower{position:absolute;left:6vw;bottom:14vh;opacity:0}
  #trl .lower .nm{font-size:min(4.2vw,56px);font-weight:600;line-height:1.02;text-shadow:0 2px 18px rgba(0,0,0,.6)}
  #trl .lower .wd{font-family:Manrope,Arial,sans-serif;font-size:min(1.05vw,13px);letter-spacing:.34em;text-transform:uppercase;opacity:.85;margin-top:.8vh;color:#ffd98a}
  #trl .tag{font-size:min(6.4vw,96px);font-weight:600;letter-spacing:.04em}#trl .tag b{color:#ff6a4a;font-weight:600}`;
  document.head.append(css);
  const ov = document.createElement('div'); ov.id = 'trl';
  ov.innerHTML = `<div class="bars"><i></i><i></i></div>
   <div class="world"><div class="wk"></div><div><div class="wn"></div><div class="wt"></div><div class="ink"></div></div></div>
   <div class="lower"><div class="nm"></div><div class="wd"></div></div>
   <div class="black"></div><div class="flash"></div>
   <div class="card open"><div class="kanji" style="font-size:min(9vw,130px)">鐘</div><div class="logo">VEILBOUND</div></div>
   <div class="card tagc"><div class="tag">Ring the <b>severed</b> bells.</div></div>
   <div class="card endc"><div class="kanji" style="font-size:min(6vw,86px)">鐘</div><div class="logo" style="font-size:min(9vw,124px)">VEILBOUND</div><div class="sub">An Original Adventure</div></div>`;
  document.body.append(ov); document.body.classList.add('trailer');
  const $ = s => ov.querySelector(s), op = (el, v, extra = '') => { el.style.opacity = clamp(v); if (extra) el.style.transform = extra; };

  // ---------- state ----------
  let si = -1, R = null, t = 0, phase = 'idle', fightT = 0, koT = -1, beatI = 0, pending = [], done = false, endT = 0;
  let stations = [], stationI = 0, leg = null, wasTraveling = false, special = null, hopsLeft = 0, splashT = 0;
  let shot = null, shotI = 0, wantWide = true;
  const S = {};
  const fighters = () => C.combat.fighters, H = () => fighters()[0], Rv = () => fighters()[1];
  const walk = (x, z) => { try { return C.getWorld().canWalk(x, z); } catch { return false; } };
  const fwdOf = f => V3(Math.sin(f.g.rotation.y), 0, Math.cos(f.g.rotation.y));
  const head = f => f.g.userData.bones.head.getWorldPosition(V3()), chestOf = f => f.g.userData.bones.chest.getWorldPosition(V3());

  function findStations(cx, cz, cy) {
    const w = C.getWorld(), pts = [...(w.discoveries || []).map(d => d.pos), ...Object.values(w.views || {}).map(v => v.pos)], out = [];
    const ray = new THREE.Raycaster(); ray.far = 9; ray.camera = C.viewCam; const roofed = (x, y, z) => { ray.set(V3(x, y + 2.2, z), V3(0, 1, 0)); return ray.intersectObject(w.root, true).some(h => h.object.isMesh && !h.object.isSkinnedMesh); };
    const footing = p => { for (const r of [0, 1.5, 3]) for (let k = 0; k < (r ? 6 : 1); k++) { const x = p[0] + Math.cos(k) * r, z = p[2] + Math.sin(k) * r; if (walk(x, z) && walk(x + 1.2, z) && walk(x - 1.2, z) && walk(x, z + 1.2) && walk(x, z - 1.2)) return [x, z]; } return null; };
    for (const p of pts) { const q = footing(p); if (!q) continue; const [x, z] = q, y = groundY(x, z, cy), d = Math.hypot(x - cx, z - cz); if (d > 7 && d < 30 && Math.abs(y - cy) < 2.5 && !roofed(x, y, z)) out.push({ x, y, z, d }); }
    out.sort((a, b) => b.d - a.d); return out;
  }

  async function prepare(i) {
    si = i; R = SEQ[i]; t = 0; fightT = 0; koT = -1; beatI = 0; pending = []; stationI = 0; leg = null; wasTraveling = false; special = null; hopsLeft = 0; shot = null; wantWide = true;
    Object.assign(R, { finDone: false, outDone: 0, lastPush: 0 });
    const cb = C.combat; cb.stop(true); cb.cinema = true; cb.roam = true; cb.autoLock = false; C.fx?.clear?.();
    if (C.getWorld()?.root?.name !== 'region-' + R.id) await C.go(R.id);
    if (R.exposure) C.renderer.toneMappingExposure *= R.exposure;
    env.setMode(R.mode || null);
    if (R.tour) {
      const vs = Object.values(C.getWorld().views || {}).filter(v => !/inside|interior/i.test(v.name || ''));
      const v = vs[R.view ?? 0] || vs[0]; S.tour = v ? { pos: V3(...v.pos), look: V3(...v.look) } : { pos: V3(0, 6, 20), look: V3(0, 2, 0) };
      $('.world .wk').textContent = R.kanji; $('.world .wn').textContent = R.world.toUpperCase(); $('.world .wt').textContent = R.name;
      phase = 'hold'; return;
    }
    const reg = C.regions[R.id], a = reg.arena, [cx, , cz] = a.center, half = Math.min(...a.size) / 2;
    const rp = Rv().g.position.clone();
    if (!R.intro) { rp.set(cx, 0, cz - 1.3); rp.y = groundY(rp.x, rp.z, 0); Rv().g.position.copy(rp); }
    let hp = null; for (const ang of [0, .5, -.5, 1, -1, Math.PI / 2, -Math.PI / 2]) { const gap = R.intro ? Math.min(4.6, half * .9) : 2.5; const x = rp.x + Math.sin(ang) * gap, z = rp.z + Math.cos(ang) * gap; if (walk(x, z)) { hp = V3(x, 0, z); break; } }
    hp = hp || V3(cx, 0, cz + 2); hp.y = groundY(hp.x, hp.z, rp.y);
    C.place([hp.x, hp.y + 1.68, hp.z], [rp.x, rp.y + 1.4, rp.z]); H().g.position.copy(hp);
    for (const f of fighters()) { f.g.userData.setDrawn(!R.intro); f.a.play(R.intro ? 'idle' : 'stance', 0); f.a.resetFluid?.(); if (R.intro) { f.hp = 100; f.art = 0; } f.vel?.set(0, 0, 0); f.travel = null; f.g.visible = true; }
    H().g.rotation.y = Math.atan2(rp.x - hp.x, rp.z - hp.z); Rv().g.rotation.y = Math.atan2(hp.x - rp.x, hp.z - rp.z);
    const mid = hp.clone().lerp(rp, .5), axis = rp.clone().sub(hp).setY(0).normalize();
    let side = V3(axis.z, 0, -axis.x); const test = s => walk(mid.x + s.x * 4, mid.z + s.z * 4); if (!test(side) && test(side.clone().negate())) side.negate();
    Object.assign(S, { hp, rp, mid, axis, side, sep: hp.distanceTo(rp), center: V3(cx, groundY(cx, cz, mid.y), cz) });
    stations = findStations(cx, cz, S.center.y);
    $('.lower .nm').textContent = reg.name; $('.lower .wd').textContent = (TOUR.find(o => C.regions[o.id]?.world === reg.world) || {}).name || '';
    C.renderer.shadowMap.needsUpdate = true;
    phase = 'hold';
  }

  const look = (pos, aim, fov = 42, roll = 0, upv) => { cam.position.copy(pos); if (upv) cam.up.copy(upv); else cam.up.set(0, 1, 0); cam.lookAt(aim); if (roll) cam.rotateZ(roll); if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); } return cam; };

  // ---------- the introduction (Sanctuary only) ----------
  const T = () => { const crane = 1.6, wide = crane + 1.0, bow = wide + 1.95, draw = bow + 1.7; return { crane, wide, bow, draw }; };
  function preCam() {
    const k = T(), m = S.mid.clone().add(V3(0, 1, 0));
    if (t < k.crane) { const u = ease(t / k.crane); const a0 = m.clone().addScaledVector(S.side, 16).addScaledVector(S.axis, -6).add(V3(0, 11, 0)), a1 = m.clone().addScaledVector(S.side, 7.5).addScaledVector(S.axis, -1.5).add(V3(0, 1.6, 0)); return look(a0.lerp(a1, u), m, 44); }
    if (t < k.wide) { const u = (t - k.crane) / (k.wide - k.crane); return look(m.clone().addScaledVector(S.side, 7.5 - u * 1.6).addScaledVector(S.axis, -1.5 + u * .8).add(V3(0, .6 - u * .3, 0)), m, 44 - u * 3); }
    if (t < k.bow) { const u = (t - k.wide) / (k.bow - k.wide); return look(m.clone().addScaledVector(S.side, S.sep * 1.18 + .6 - u * .35).add(V3(0, -.12, 0)), m.clone().add(V3(0, .05, 0)), 40); }
    const u = (t - k.bow) / (k.draw - k.bow);
    if (u < .45) { const h = H(), hand = h.g.userData.bones.handR.getWorldPosition(V3()), fw = fwdOf(h); return look(hand.clone().addScaledVector(fw, .95).addScaledVector(S.side, .45).add(V3(0, .12, 0)), hand.clone().addScaledVector(fw, .15), 34, .06); }
    const v = (u - .45) / .55, mm = S.mid.clone().add(V3(0, 1.15, 0));
    return look(mm.clone().addScaledVector(S.side, S.sep * 1.02 + .4 - v * .4).add(V3(0, -.7, 0)), mm, 44, -.03);
  }
  // ---------- the tour: one travelling shot per world, all drifting left to right ----------
  function tourCam(lt) {
    const u = clamp(lt / TOUR_DUR), s = S.tour, fwd = s.look.clone().sub(s.pos).setY(0).normalize(), right = V3(-fwd.z, 0, fwd.x);
    return look(s.pos.clone().addScaledVector(right, (u - .5) * 3).addScaledVector(fwd, u * 1.6).add(V3(0, u * .4, 0)), s.look.clone().addScaledVector(right, (u - .5) * 2.2), 48 - u * 3);
  }

  // ---------- cinematographer ----------
  const SHOT_DUR = { wide: 1.9, crane: 1.8, orbit: 1.7, top: 1.3, closeH: 1.1, closeR: 1.1, ots: 1.3, otsR: 1.3, lowHero: 1.3, dutch: 1.3, blade: 1.1, dir: 1.2, track: 2.0, puddle: 1.3, low: 1.5, vertigo: 1.7 };
  function shotPose(name, u, sg) {
    const h = H().g.position, r = Rv().g.position, hh = head(H()), rh = head(Rv());
    const M = h.clone().lerp(r, .5), a = V3(r.x - h.x, 0, r.z - h.z).normalize(), s = V3(a.z, 0, -a.x).multiplyScalar(sg);
    switch (name) {
      case 'wide': return { pos: M.clone().addScaledVector(s, 9 - u * 1.4).addScaledVector(a, -2.5).add(V3(0, 3.4 - u * .8, 0)), aim: M.clone().add(V3(0, 1, 0)), fov: 42 };
      case 'crane': return { pos: M.clone().addScaledVector(s, 14).addScaledVector(a, 4).add(V3(0, 11 - u * 5, 0)), aim: M.clone().add(V3(0, .8, 0)), fov: 38, high: true };
      case 'orbit': { const b = Math.atan2(s.x, s.z) + (u - .5) * 1.1; return { pos: M.clone().add(V3(Math.sin(b) * 4.6, 1.35, Math.cos(b) * 4.6)), aim: M.clone().add(V3(0, 1.1, 0)), fov: 46 }; }
      case 'top': return { pos: M.clone().add(V3(0, 7.4 - u * 1.2, 0)).addScaledVector(s, .5), aim: M.clone(), fov: 46, upv: a.clone(), high: true };
      case 'vertigo': return { pos: M.clone().add(V3(0, 12 - u * 3, 0)).addScaledVector(s, .3), aim: M.clone(), fov: 50, upv: a.clone().applyAxisAngle(V3(0, 1, 0), u * 1.2), high: true };
      case 'closeH': return { pos: hh.clone().addScaledVector(fwdOf(H()), .9 - u * .12).addScaledVector(s, .38).add(V3(0, -.05, 0)), aim: hh.clone(), fov: 30, roll: .05 };
      case 'closeR': return { pos: rh.clone().addScaledVector(fwdOf(Rv()), .9 - u * .12).addScaledVector(s, -.38).add(V3(0, -.05, 0)), aim: rh.clone(), fov: 30, roll: -.05 };
      case 'ots': return { pos: rh.clone().addScaledVector(a, .8).addScaledVector(s, .45).add(V3(0, .1, 0)), aim: hh.clone().add(V3(0, -.12, 0)), fov: 36 };
      case 'otsR': return { pos: hh.clone().addScaledVector(a, -.8).addScaledVector(s, -.45).add(V3(0, .1, 0)), aim: rh.clone().add(V3(0, -.12, 0)), fov: 36 };
      case 'lowHero': return { pos: h.clone().addScaledVector(a, -1.4).addScaledVector(s, .9).add(V3(0, .22, 0)), aim: hh.clone().lerp(rh, .5).add(V3(0, .15, 0)), fov: 58, roll: -.08 };
      case 'low': return { pos: M.clone().addScaledVector(s, 3.2 - u * .6).add(V3(0, .3, 0)), aim: M.clone().add(V3(0, 1.6, 0)), fov: 52, roll: .04 };
      case 'dutch': return { pos: M.clone().addScaledVector(s, 3.4).addScaledVector(a, (u - .5) * 1.2).add(V3(0, .75, 0)), aim: M.clone().add(V3(0, 1.15, 0)), fov: 44, roll: .22 };
      case 'blade': return { pos: M.clone().addScaledVector(s, 1.9).add(V3(0, 1.0, 0)), aim: M.clone().add(V3(0, 1.2, 0)), fov: 62, roll: -.05 };
      case 'track': return { pos: M.clone().addScaledVector(s, 4.2).addScaledVector(a, -1).add(V3(0, .95, 0)), aim: M.clone().addScaledVector(a, .6).add(V3(0, 1.05, 0)), fov: 46 };
      case 'puddle': return { pos: M.clone().addScaledVector(s, 2.6).addScaledVector(a, -.8).add(V3(0, .14, 0)), aim: M.clone().add(V3(0, 1.1, 0)), fov: 54, roll: .06 };
    }
  }
  const shotOk = p => p && (p.high ? p.pos.y > groundY(p.pos.x, p.pos.z, 0) + 3 : walk(p.pos.x, p.pos.z) || p.pos.distanceTo(H().g.position) < 1.6);
  function cine(dt) {
    const cb = C.combat, F = fighters(), dm = C.director?.mode || 'gameplay', order = R.palette;
    const free = cb.phase === 'fight' && !cb.traveling && (dm === 'gameplay' || dm === 'return' || shot) && !F.some(f => f.isArt) && !cb.state().lock && fightT > INTRO(R) + .3;
    if (!free || (dm !== 'gameplay' && dm !== 'return' && shot && shot.name === 'dir')) { if (shot) { shot = null; shotI++; } return null; }
    if (!shot) {
      for (let tries = 0; tries < order.length; tries++) {
        const name = wantWide ? order[0] : order[shotI % order.length];
        let sg = 1; if (name !== 'dir') { if (!shotOk(shotPose(name, 0, 1))) { if (shotOk(shotPose(name, 0, -1))) sg = -1; else { wantWide = false; shotI++; continue; } } }
        shot = { name, t: 0, sg }; wantWide = false; break;
      }
      if (!shot) return null;
    }
    shot.t += dt; if (shot.t > SHOT_DUR[shot.name]) { shot = null; shotI++; return cine(0); }
    if (shot.name === 'dir') return null;
    const p = shotPose(shot.name, shot.t / SHOT_DUR[shot.name], shot.sg); return look(p.pos, p.aim, p.fov, p.roll || 0, p.upv);
  }
  // ridge hops: a tracking shot that keeps the ground in frame
  const travelPos = V3(), travelAim = V3();
  function travelCam(dt, first) {
    const m = H().g.position.clone().lerp(Rv().g.position, .5).add(V3(0, 1, 0)), side = leg.side.clone(); if (!walk(m.x + side.x * 4, m.z + side.z * 4) && walk(m.x - side.x * 4, m.z - side.z * 4)) side.negate();
    const want = m.clone().addScaledVector(side, 4.6).addScaledVector(leg.dir, -1.2).add(V3(0, .5, 0)); want.y = Math.max(want.y, groundY(want.x, want.z, m.y - 1) + .6);
    if (first) { travelPos.copy(want); travelAim.copy(m); }
    travelPos.lerp(want, 1 - Math.exp(-dt * 9)); travelAim.lerp(m, 1 - Math.exp(-dt * 14)); return look(travelPos, travelAim, 48);
  }
  // seams and set pieces get their own authored framing
  function specialCam() {
    const s = special, h = H(), r = Rv();
    if (s.kind === 'match') { const c = chestOf(h), fw = fwdOf(h), sd = V3(fw.z, 0, -fw.x); return look(c.clone().addScaledVector(sd, 2.1).addScaledVector(fw, .5).add(V3(0, .1, 0)), c.clone().addScaledVector(fw, .7), 40, .05); }
    if (s.kind === 'pushoff') { const m = h.g.position.clone().lerp(r.g.position, .5); return look(m.clone().addScaledVector(S.side, 3).add(V3(0, .28, 0)), m.clone().add(V3(0, .8, 0)), 52); }
    if (s.kind === 'lamp') { const L = s.at; return look(L.clone().addScaledVector(S.side, 3.2).add(V3(0, -2.4, 0)), L.clone().add(V3(0, -.9, 0)), 50, -.06); }
    if (s.kind === 'roof') { const c = h.g.position.clone(); return look(c.clone().add(V3(.4, 5.5 + s.t * 2, .4)), c.clone().add(V3(0, -1, 0)), 50, 0, S.axis.clone()); }
    if (s.kind === 'fallIn') { const c = S.mid.clone(); return look(c.clone().addScaledVector(S.side, 2.4).add(V3(0, .25, 0)), c.clone().add(V3(0, 4 - s.t * 3.5, 0)), 62, .05); }
  }

  function overlays() {
    let fl = 0;
    if (phase === 'tour' || (phase === 'hold' && R?.tour)) {
      const lt = t - (si === 0 ? OPEN : 0);
      if (si === 0) { const a = t < .35 ? t / .35 : 1, b = 1 - clamp((t - (OPEN - .45)) / .45); op($('.open'), Math.min(a, b), `scale(${1.04 - .04 * easeOut(t / OPEN)})`); op($('.black'), t < OPEN - .35 ? 1 : 1 - clamp((t - (OPEN - .35)) / .45)); }
      else op($('.black'), phase === 'hold' ? 1 : 0);
      const wv = Math.min(clamp((lt - .15) / .35), 1 - clamp((lt - TOUR_DUR + .45) / .35));
      op($('.world'), wv, `translateX(${(1 - easeOut(clamp((lt - .15) / .5))) * -40}px)`); $('.world .ink').style.transform = `scaleX(${easeOut(clamp((lt - .2) / .7))})`;
      if (lt >= 0 && lt < .14 && si > 0) fl = .5 * (1 - lt / .14);
    } else op($('.world'), 0);
    if (phase === 'pre') op($('.black'), 1 - clamp(t / .3));
    let fc = '#fff';
    if (phase === 'fight') {
      if (R.in === 'fire') { fl = Math.max(fl, 1 - clamp(fightT / .4)); fc = '#ffb15a'; }
      if (R.in === 'fall') op($('.black'), 1 - clamp(fightT / .25));
      if (R.out === 'lamp' && R.dur) { const v = clamp((fightT - (R.dur - .3)) / .3); if (v > 0) { fl = Math.max(fl, v); fc = '#ffb15a'; } }
      if (R.out === 'roof' && R.dur) op($('.black'), clamp((fightT - (R.dur - .22)) / .22));
    }
    $('.flash').style.background = fc; op($('.flash'), fl);
    const cont = phase === 'fight' && !R.intro, lv = cont ? Math.min(clamp((fightT - .25) / .3), 1 - clamp((fightT - 2.0) / .4)) : 0; op($('.lower'), lv);
    const k = T(), bars = phase === 'pre' ? clamp((t - k.wide) / .35) : phase === 'fight' && fightT < INTRO(R) ? 1 - clamp((fightT - INTRO(R) + .35) / .35) : 0;
    $('.bars').firstChild.style.transform = `translateY(${-100 * (1 - bars)}%)`; $('.bars').lastChild.style.transform = `translateY(${100 * (1 - bars)}%)`;
  }

  // ---------- fight beats ----------
  function relocate() { // push off, cut, and land mid-exchange somewhere else in the location
    const s = stations[stationI++ % Math.max(1, stations.length)]; if (!s) return;
    special = { kind: 'pushoff', t: 0, dur: .32, then: () => {
      const dir = V3(s.x - S.mid.x, 0, s.z - S.mid.z).normalize(), a = V3(s.x, s.y, s.z), hp = a.clone().addScaledVector(dir, -1.15), rp = a.clone().addScaledVector(dir, 1.15);
      hp.y = groundY(hp.x, hp.z, s.y); rp.y = groundY(rp.x, rp.z, s.y);
      C.place([hp.x, hp.y + 1.68, hp.z], [rp.x, rp.y + 1.3, rp.z]); H().g.position.copy(hp); Rv().g.position.copy(rp);
      H().g.rotation.y = Math.atan2(rp.x - hp.x, rp.z - hp.z); Rv().g.rotation.y = Math.atan2(hp.x - rp.x, hp.z - rp.z);
      S.mid = hp.clone().lerp(rp, .5); S.axis = dir; S.side = V3(dir.z, 0, -dir.x);
      C.director?.reset(); shot = null; wantWide = true; C.combat.force('x', 'clash'); env.gust(S.mid, dir, 30);
    } };
    for (const f of fighters()) f.a.play('dashIn', .05);
  }
  function hop() { const m = H().g.position.clone().lerp(Rv().g.position, .5), dir = S.axis.clone().applyAxisAngle(V3(0, 1, 0), (hopsLeft % 2 ? .5 : -.5) + Math.PI / 2), tgt = m.clone().addScaledVector(dir, 3.2);
    if (!walk(tgt.x, tgt.z)) tgt.copy(m).addScaledVector(dir, -3.2); tgt.y = groundY(tgt.x, tgt.z, m.y);
    leg = { ...C.combat.leapTo(tgt, { h: .75, dur: .42, gap: 2.1, mode: 'hop', lag: .12, crouch: .08 }), first: true }; }

  function fightStep(dt) {
    const cb = C.combat, F = fighters(), win = R.winner === 'rival' ? F[1] : F[0], lose = win === F[0] ? F[1] : F[0];
    fightT += dt;
    // entry beats need the duel to be live (the first update moves it from intro to fight)
    if (S.doMatch && cb.phase === 'fight') { S.doMatch = false; cb.force('hero', 'c1'); H().a.update(S.matchT || .16); }
    if (S.doClash && cb.phase === 'fight') { S.doClash = false; cb.force('x', 'clash'); }
    if (fightT < FIN_AT(R)) for (const f of F) f.hp = Math.max(f.hp, 32);
    // ---- seams out of this location ----
    if (R.dur) {
      const left = R.dur - fightT;
      if (R.out === 'match' && left < .78 && R.outDone === 0) { R.outDone = 1; cb.force('hero', 'c1'); special = { kind: 'match', t: 0, dur: 9 }; }
      if (R.out === 'match' && R.outDone === 1 && H().a.name === 'c1' && H().a.time >= .16) { S.matchT = H().a.time; phase = 'roundDone'; return; }
      if (R.out === 'lamp' && left < 1.35 && R.outDone === 0) { R.outDone = 1; const r = Rv().g.position, at = r.clone().addScaledVector(S.side, -.9).addScaledVector(S.axis, -.2); at.y = groundY(at.x, at.z, r.y); env.placeLamp(at); special = { kind: 'lamp', t: 0, dur: 9, at: at.clone().add(V3(0, 3.1, 0)) }; }
      if (R.out === 'lamp' && left < .8 && R.outDone === 1) { R.outDone = 2; cb.force('rival', 'c1'); }
      if (R.out === 'lamp' && left < .5 && R.outDone === 2) { R.outDone = 3; env.breakLamp(); C.fx?.impactFrame?.('ink', .06); C.fx?.speedLines?.(1, { kind: 'radial', dur: .4 }); }
      if (R.out === 'roof' && left < 1.0 && R.outDone === 0) { R.outDone = 1; cb.force('rival', 'kick'); }
      if (R.out === 'roof' && left < .62 && R.outDone === 1) { R.outDone = 2; const p = H().g.position.clone(); C.fx?.debris?.(p, { count: 22, power: 1.4 }); C.fx?.dust?.(p, { size: 1.8, count: 14 }); C.fx?.impactFrame?.('ink', .07); env.flashLight(p.clone().add(V3(0, 1, 0)), 0xff7a30, 90, .5);
        H().travel = { from: p.clone(), to: p.clone().add(V3(0, -6, 0)), t: 0, delay: 0, dur: .55, h: 0, mode: 'fall', side: S.side, dir: S.axis, clashed: true, launched: true }; H().air = true; special = { kind: 'roof', t: 0, dur: 9 }; }
      if (left <= 0) { phase = 'roundDone'; cb.stop(true); C.fx?.clear?.(); return; }
    }
    while (beatI < R.beats.length && fightT >= R.beats[beatI][0]) { const [, who, what] = R.beats[beatI++]; pending.push({ who, what, until: fightT + 1.6 }); }
    if (fightT >= FIN_AT(R) && !R.finDone) { R.finDone = true; R.finT = fightT; lose.hp = 1; lose.ai = false; lose.guardT = 0; pending.push({ who: R.winner, what: 'art', until: fightT + 3 }); }
    const blocked = F.some(f => f.isArt) || cb.state().lock || cb.traveling || !!special;
    pending = pending.filter(p => {
      if (fightT > p.until) return false;
      if (p.what === 'birds') { env.birds(S.mid); return false; }
      if (p.what === 'beam') { const at = H().g.position.clone().lerp(Rv().g.position, .5).addScaledVector(S.side, .2); env.dropBeam(at); C.fx?.speedLines?.(.7, { kind: 'radial', dur: .3 }); return false; }
      if (blocked || F.some(f => f.air || ['launched', 'down', 'crash', 'thrown'].includes(f.a.name))) return true;
      if (p.what === 'relocate') { relocate(); return false; }
      if (p.what === 'hops') { hopsLeft = 3; hop(); return false; }
      if (isArtName(p.what)) { const f = p.who === 'rival' ? F[1] : F[0]; if (isArtName(f.a.name)) return false; cb.force(p.who, p.what); return !isArtName(f.a.name); }
      cb.force(p.who, p.what); return false;
    });
    if (hopsLeft > 0 && !cb.traveling && leg && !special) { hopsLeft--; if (hopsLeft > 0) hop(); }
    if (R.finDone && koT < 0 && fightT - R.finT > 4 && fightT - (R.lastPush || 0) > 1.1 && !isArtName(win.a.name)) { R.lastPush = fightT; cb.force(R.winner, 'dashAttack'); }
    if (cb.phase === 'ko' && koT < 0) koT = 0;
    if (koT >= 0) koT += dt;
    if (koT > 2.3) op($('.black'), clamp((koT - 2.3) / .5));
    if (koT > 2.85) { phase = 'end'; endT = 0; cb.stop(true); C.fx?.clear?.(); }
    if (R.mode === 'city') { splashT -= dt; if (splashT < 0) { splashT = .12; for (const f of F) if (f.vel.lengthSq() > .3 || ['dashIn', 'dashAttack', 'battleRun', 'land'].includes(f.a.name)) env.splash(f.g.position); } }
  }

  function endStep(dt) {
    endT += dt; op($('.black'), 1); op($('.open'), 0);
    op($('.tagc'), Math.min(clamp(endT / .4), 1 - clamp((endT - 2.0) / .4)), `scale(${1 + .03 * endT})`);
    op($('.endc'), clamp((endT - 2.5) / .6), `scale(${1.03 - .03 * easeOut((endT - 2.5) / 3)})`);
    if (endT > 5.9) done = true;
  }

  window.__CAM_OVERRIDE__ = (raw) => {
    if (phase === 'idle' || done) return phase === 'end' ? cam : null;
    const focus = phase === 'fight' || phase === 'pre' ? H().g.position.clone().lerp(Rv().g.position, .5) : null;
    env.update(raw, cam, focus);
    if (phase === 'hold') { op($('.black'), 1); if (R.tour) { for (const f of fighters()) f.g.visible = false; return tourCam(0); } return R.intro ? preCam() : null; }
    t += raw;
    if (phase === 'tour') {
      for (const f of fighters()) { f.g.visible = false; if (f.shadow) f.shadow.visible = false; }
      overlays(); const lt = t - (si === 0 ? OPEN : 0); if (lt >= TOUR_DUR) phase = 'roundDone';
      return tourCam(Math.max(0, lt));
    }
    if (phase === 'pre') {
      const k = T();
      if (t >= k.wide && !S.bowed) { S.bowed = true; for (const f of fighters()) f.a.play('bow', .2); }
      if (t >= k.bow && !S.drew) { S.drew = true; for (const f of fighters()) f.a.play('draw', .15); C.fx?.flash?.('#ffffff', .12, .35); }
      if (t >= k.bow + 1.0 && !S.glint) { S.glint = true; C.fx?.flash?.('#ffffff', .1, .5); C.fx?.speedLines?.(.6, { kind: 'radial', dur: .35 }); }
      if (t >= k.draw) { S.bowed = S.drew = S.glint = false; phase = 'fight'; fightT = 0; const cb = C.combat; cb.cinema = false; cb.start({ splash: !!R.splash, quiet: true, draw: false, intro: INTRO(R), introCam: false, callout: 'Fight' }); cb.setAuto(true); for (const f of fighters()) f.ai = true; overlays(); return null; }
      overlays(); return preCam();
    }
    if (phase === 'fight') {
      fightStep(raw); overlays();
      if (phase !== 'fight') return cam;
      if (special) {
        special.t += raw;
        if (special.kind === 'pushoff' && special.t >= special.dur) { const f = special.then; special = null; f(); return null; }
        if ((special.kind === 'fallIn' || (special.kind === 'match' && R.in === 'match' && !R.out)) && special.t > special.dur) { special = null; C.director?.reset(); shot = null; }
        else if (special.kind === 'match' && R.in === 'match' && special.t > special.dur && fightT < 1) { special = null; C.director?.reset(); shot = null; wantWide = true; }
        else return specialCam();
      }
      const trav = C.combat.traveling;
      if (trav && leg) { const c = travelCam(raw, leg.first); leg.first = false; wasTraveling = true; return c; }
      if (wasTraveling && !trav) { wasTraveling = false; C.director?.reset(); shot = null; }
      return cine(raw);
    }
    if (phase === 'end') { endStep(raw); overlays(); return cam; }
    return cam;
  };

  const api = {
    rounds: SEQ.map(r => r.id),
    async prepare(i) { await prepare(i); op($('.black'), 1); return true; },
    go() {
      if (phase !== 'hold') return; t = 0;
      if (R.tour) { phase = 'tour'; return; }
      if (R.intro) { phase = 'pre'; return; }
      phase = 'fight'; fightT = 0; op($('.black'), 0); const cb = C.combat; cb.cinema = false;
      cb.start({ splash: false, quiet: true, draw: false, intro: 0, introCam: false, callout: false }); cb.setAuto(true); for (const f of fighters()) f.ai = true;
      if (R.in === 'match') { S.doMatch = true; special = { kind: 'match', t: 0, dur: .55 }; }
      if (R.in === 'fall') { for (const f of fighters()) f.g.position.add(V3(0, 9, 0)); C.place([H().g.position.x, H().g.position.y + 1.68, H().g.position.z], [S.mid.x, S.mid.y, S.mid.z]); leg = { ...cb.leapTo(S.mid.clone().setY(groundY(S.mid.x, S.mid.z, S.mid.y)), { mode: 'fall', dur: .6, gap: 2.4, lag: .22 }), first: true }; special = { kind: 'fallIn', t: 0, dur: .95 }; }
      if (R.in === 'fire') { C.fx?.speedLines?.(1, { kind: 'radial', dur: .45 }); S.doClash = true; }
    },
    get phase() { return phase; }, get round() { return si; }, get done() { return done; },
    state: () => ({ phase, round: si, id: R?.id, t: +t.toFixed(2), fightT: +fightT.toFixed(2), koT: +koT.toFixed(2), stations: stations.length, duel: C.combat.state?.() }),
  };
  window.__TRAILER__ = api;
  return api;
}
