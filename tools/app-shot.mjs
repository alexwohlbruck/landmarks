// Screenshot landmarks in the real map app (Parchment), from street level,
// with the terrain on and off. The final check before a release: the tools/
// renderer shows the model, this shows it standing on the map's ground, among
// its neighbours, with the map's own lighting and clipping.
//
//   APP_URL=https://<parchment-dev-server>/ SESSION_FILE=<file> \
//     node tools/app-shot.mjs <scenes.json> [scene ...]
//
// Needs Playwright with Chromium, which this repo doesn't install:
//   bun add --no-save playwright && bunx playwright install chromium
//
// The app must be a Parchment *development* server (Vite), not a production
// build: the script drives the map through `window.__parchmentMap`, which only
// dev builds expose. Point it at a dev server whose Barrelman serves the
// release (or local build) you want to check.
//
// scenes.json names viewpoints. from/to are [east, north] metres from the
// landmark's anchor (lng/lat); eye and look are metres above the ground under
// each. id is the landmark's placement id.
//
//   { "boa": { "id": "bank-of-america-corporate-center", "lng": -80.8422257, "lat": 35.2273121,
//              "from": [55, -55], "to": [28, -28], "eye": 1.6, "look": 1 } }
//
// Writes <OUT>/<TAG>-<scene>-terrain-<on|off>.png for each scene and setting.
//
// env:
//   APP_URL        the app (required)
//   SESSION_FILE   a file holding the value of a signed-in `auth_session`
//                  cookie, copied from a browser; keep it outside the repo
//   OUT            output dir (default preview/app)
//   TAG            file-name prefix (default shot)
//   TERRAIN        off,on (default both)
//   SINK           <id>=<metres>: draw that landmark with this elevation, to
//                  try a value before it is released
//   NOCLIP=1       turn off the clipping of what goes below the flat map
//   EVAL           a JS expression evaluated in the page, printed (debugging)
//   HOST_MAP       "<host> <ip>": resolve the app's host name to this address,
//                  for a name the headless browser can't resolve itself (a
//                  private DNS name, say)
//   CHROME_ARGS    extra Chromium flags, space-separated
import fs from 'node:fs'
import path from 'node:path'

const [scenesFile, ...wanted] = process.argv.slice(2)
const APP = process.env.APP_URL
if (!APP || !scenesFile) {
  console.error('usage: APP_URL=... [SESSION_FILE=...] node tools/app-shot.mjs <scenes.json> [scene ...]')
  process.exit(1)
}
const { chromium } = await import('playwright').catch(() => {
  console.error('needs Playwright: bun add --no-save playwright && bunx playwright install chromium')
  process.exit(1)
})
const ALL = JSON.parse(fs.readFileSync(scenesFile, 'utf8'))
const scenes = wanted.length ? wanted : Object.keys(ALL)
const missing = scenes.filter((s) => !ALL[s])
if (missing.length) throw new Error(`not in ${scenesFile}: ${missing.join(', ')}`)
const OUT = process.env.OUT || path.join(import.meta.dirname, '../preview/app')
const TAG = process.env.TAG || 'shot'
const terrains = (process.env.TERRAIN || 'off,on').split(',')
fs.mkdirSync(OUT, { recursive: true })

const args = ['--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=gl-egl', ...(process.env.CHROME_ARGS || '').split(' ').filter(Boolean)]
if (process.env.HOST_MAP) args.push(`--host-resolver-rules=MAP ${process.env.HOST_MAP}`)
const browser = await chromium.launch({ args })
const ctx = await browser.newContext({ viewport: { width: 1100, height: 1000 }, ignoreHTTPSErrors: true })
if (process.env.SESSION_FILE) {
  const value = fs.readFileSync(process.env.SESSION_FILE, 'utf8').trim()
  await ctx.addCookies([{ name: 'auth_session', value, domain: new URL(APP).hostname, path: '/', secure: APP.startsWith('https') }])
}
const page = await ctx.newPage()
page.on('pageerror', (e) => console.log('pageerror', e.message.slice(0, 200)))

const first = ALL[scenes[0]]
await page.goto(APP, { waitUntil: 'load', timeout: 300000 })
await page.waitForTimeout(2000)

for (const terrain of terrains) {
  // The app keeps its map settings and camera in localStorage; set them and reload.
  await page.evaluate(({ lng, lat, terrain }) => {
    const m = JSON.parse(localStorage.getItem('map') || 'null')
    if (m) {
      Object.assign(m, { engine: 'maplibre', buildings3d: true, objects3d: true, terrain3d: terrain === 'on' })
      localStorage.setItem('map', JSON.stringify(m))
    }
    localStorage.setItem('map-camera', JSON.stringify({ center: [lng, lat], zoom: 18, bearing: 0, pitch: 60 }))
  }, { ...first, terrain })
  await page.reload({ waitUntil: 'load', timeout: 300000 })
  await page.waitForTimeout(3000)
  for (const x of await page.getByRole('button', { name: /^cancel$/i }).all()) await x.click().catch(() => {})
  await page.waitForFunction(() => !!window.__parchmentMap?.getLayer('map-landmarks'), null, { timeout: 180000 })
  console.log('terrain', terrain, 'actual', await page.evaluate(() => !!window.__parchmentMap.getTerrain()))
  // Hide the app's panels so the map fills the frame.
  await page.addStyleTag({ content: 'body *:not(.maplibregl-map):not(.maplibregl-map *):not(:has(.maplibregl-map)) { visibility: hidden !important }' })

  if (process.env.NOCLIP)
    await page.evaluate(() => {
      const L = window.__parchmentMap.getLayer('map-landmarks').implementation
      const own = L.groundUniforms
      L.groundUniforms = function (gl, u, p) {
        own.call(this, gl, u, p)
        if (u.u_floor) gl.uniform1f(u.u_floor, -1e6)
      }
    })
  if (process.env.SINK) {
    const [id, metres] = process.env.SINK.split('=')
    await page.evaluate(({ id, d }) => {
      const L = window.__parchmentMap.getLayer('map-landmarks').implementation
      const own = L.place
      L.place = function (lm, ...a) {
        return own.call(this, lm.id === id ? { ...lm, elevation: d } : lm, ...a)
      }
      L.invalidate()
    }, { id, d: Number(metres) })
  }
  if (process.env.EVAL) console.log('EVAL', JSON.stringify(await page.evaluate(process.env.EVAL)))

  for (const s of scenes) {
    const info = await page.evaluate(async (sc) => {
      const map = window.__parchmentMap
      const off = ([e, n]) => ({ lng: sc.lng + e / (111320 * Math.cos((sc.lat * Math.PI) / 180)), lat: sc.lat + n / 111320 })
      const from = off(sc.from), to = off(sc.to)
      // A rough jump first, so the terrain under both points has loaded.
      map.jumpTo({ center: to, zoom: 18, pitch: 60, bearing: 0 })
      await new Promise((r) => map.once('idle', r))
      await new Promise((r) => setTimeout(r, 1500))
      const ground = (p) => (map.getTerrain() ? map.queryTerrainElevation(p) ?? 0 : 0)
      map.jumpTo(map.calculateCameraOptionsFromTo(from, ground(from) + sc.eye, to, ground(to) + sc.look))
      await new Promise((r) => map.once('idle', r))
      await new Promise((r) => setTimeout(r, 3000))
      map.triggerRepaint()
      await new Promise((r) => map.once('idle', r))
      const p = map.getLayer('map-landmarks')?.implementation?.placements?.find((p) => p.id === sc.id)
      return { gFrom: ground(from), gTo: ground(to), placed: !!p, elevation: p?.elevation, sink: p?.sink, groundMean: p?.groundMean }
    }, ALL[s])
    console.log(s, terrain, JSON.stringify(info))
    await page.screenshot({ path: `${OUT}/${TAG}-${s}-terrain-${terrain}.png`, timeout: 180000 })
  }
}
await browser.close()
