// Records the Veilbound trailer frame by frame and encodes it.
// node tools/trailer-capture.mjs [--port 4186] [--fps 30] [--w 1920 --h 1080] [--rounds 0,1,2,3] [--out <dir>] [--video <file.mp4>] [--max <secs per round>]
// The game runs with ?capture&trailer: nothing moves unless this script steps it, so every frame is exact.
import puppeteer from 'puppeteer'; import fs from 'node:fs'; import { execFileSync } from 'node:child_process';
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const port = arg('port', '4186'), fps = +arg('fps', 30), W = +arg('w', 1920), Hh = +arg('h', 1080), out = arg('out', 'evidence/trailer/frames'), video = arg('video', 'evidence/trailer/veilbound-trailer.mp4');
const maxSecs = +arg('max', 60), every = +arg('every', 1);
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', `--window-size=${W},${Hh}`] });
const page = await browser.newPage(); await page.setViewport({ width: W, height: Hh, deviceScaleFactor: 1 });
const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
const pause = ms => new Promise(r => setTimeout(r, ms)); let n = 0; const log = [];
const t0 = Date.now();
try {
  await page.goto(`http://127.0.0.1:${port}/?capture=1&trailer=1&v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => (window.__READY__ && window.__TRAILER__) || window.__LOAD_ERROR__, { timeout: 240000 });
  const le = await page.evaluate(() => window.__LOAD_ERROR__); if (le) throw Error(le);
  await page.evaluate(() => window.__START__()); await page.evaluate(() => window.__STEP__(3, 30));
  const rounds = (arg('rounds', '') || (await page.evaluate(() => window.__TRAILER__.rounds.map((_, i) => i).join(',')))).split(',').map(Number);
  for (const i of rounds) {
    await page.evaluate(i => window.__TRAILER__.prepare(i), i);
    // settle textures, shadows and shaders off the record
    for (let k = 0; k < 20; k++) { await page.evaluate(() => window.__STEP__(1, 30)); await pause(30); }
    await page.evaluate(() => window.__TRAILER__.go());
    for (let f = 0; f < maxSecs * fps; f++) {
      const st = await page.evaluate(r => { window.__STEP__(1, r); return window.__TRAILER__.state(); }, fps);
      if (f % every === 0) { await page.screenshot({ path: `${out}/f${String(n).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 93 }); n++; }
      if (f % (fps * 2) === 0) { log.push(st); process.stderr.write(`round ${i} t=${st.t} phase=${st.phase} frames=${n}\n`); }
      if (st.phase === 'roundDone' || (st.phase === 'end' && await page.evaluate(() => window.__TRAILER__.done))) break;
    }
  }
} catch (e) { errors.push('FAIL ' + e.message); }
await browser.close();
if (n && !arg('noencode')) { fs.mkdirSync(video.replace(/\/[^/]*$/, ''), { recursive: true }); execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps / every), '-i', `${out}/f%05d.jpg`, '-vf', 'scale=in_range=full:out_range=tv,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-profile:v', 'high', '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-movflags', '+faststart', video]); }
console.log(JSON.stringify({ frames: n, seconds: +(n * every / fps).toFixed(1), wall: Math.round((Date.now() - t0) / 1000), video: n ? video : null, errors: [...new Set(errors)].slice(0, 20), log: log.slice(-6) }, null, 1));
