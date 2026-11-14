/**
 * National Assembly Proceeding Hall (국회의사당), Yeouido, Seoul — original
 * procedural geometry, CC0-1.0.
 * bun generators/seoul-national-assembly.ts
 *
 * Map frame turned to the building: +y runs along the long sides to compass
 * 52, +x to compass 142, the front (the eight-pillar facade with the grand
 * stair) faces +x. z up, metres. BEARING 52. Origin = centroid of the OSM
 * outline way/270596342 (stairs included, so the hall itself is centred
 * at (-6.2, 0.2)).
 *
 * Evidence
 * - OSM way/270596342 "국회의사당" (building=government, 6 levels) and its
 *   parts: 608162297 (platform, 5 m, 123 x 164 m); 608162749 (the hall, 40 m,
 *   95 x 136 m); 639632935 (the roof slab, 40-43 m, 114.5 x 155.4 m);
 *   270594679 (the dome, 43-61 m, 65 m across: the model's dome is taller,
 *   see below); 608164568-608164591 (the 24
 *   square pillars, 40 m: eight on the front and back, four more on each
 *   end); the stair parts 639626344/347/348/350/351, 875733797/798/799/801,
 *   876004835, 877104966-877104969; the inner parts 877366975-877366988
 *   (no heights, inside the hall). OSM places the end pillar rows 7 m off
 *   centre; the model sets them symmetric about the hall, as built.
 * - Published: completed 1975; 24 pillars for the 24 solar terms, eight on
 *   the front for the eight provinces; copper dome (Wikipedia "National
 *   Assembly Proceeding Hall").
 * - Commons photos (daylight):
 *   "Republic of Korea capitol.jpg" (Cjb8293, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Republic_of_Korea_capitol.jpg):
 *     the front square on: eight pale granite pillars to a deep flat slab
 *     with a two-band fascia, the punched-window hall behind, the dark bronze
 *     screen over the glazed entrance in the middle bay, the pale green dome
 *     on a white drum.
 *   "Fountain in National Assembly Building of South Korea.jpg" (AnbyG, CC
 *     BY-SA 4.0): the front and the slab's overhang at the corners.
 *   "Korea-Seoul-Yeouido-National Assembly Building-03.jpg" (Alain Seguin,
 *     CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Korea-Seoul-Yeouido-National_Assembly_Building-03.jpg):
 *     from the approach road: the drum's ring of dark windows, the dome's
 *     profile, the slab corners.
 *   "Pond of the National Assembly in South Korea.jpg" (Cjb8293, CC BY-SA
 *     4.0): the slab's overhang at an end.
 *   Colours sampled from the Cjb8293 photo: granite #cbcdcc, drum #eff5f4,
 *   dome #b4e3e3 (sunlit) pulled to #9fd0c3, bronze screen #403d35 pulled to
 *   #6e6252.
 *
 * Measured from "Korea-Seoul-Yeouido-National Assembly Building-03.jpg" (a
 * telephoto view, scaled by the 20.7 m pillar spacing): the drum ~7 m tall
 * with its ring of dark windows in the lower half, the dome rising ~18 m
 * over a ~63 m base, so its crown stands at ~68.5 m, not OSM's 61 (the
 * dome part's 43-61 looks like a guess); the slab ~6 m deep.
 * Estimated: the slab's fascia bands and soffit (39.5 m), the pillars'
 * chamfers and capitals, window grouping (three panels per bay, two tiers of
 * three storeys), the entrance screen's extent. The platform and stairs
 * follow OSM; the back and end stairs have no OSM height and are drawn as
 * plain flights from the 5 m platform. No lidar exists for Korea and the
 * map's terrain (Mapterhorn) has no tiles over Seoul; Yeouido is flat.
 *
 * Night: the granite and the dome are floodlit (`_FLOODLIGHT`); the windows
 * glow; the entrance screen is `entrance`.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 52
const ANCHOR = { lng: 126.914197, lat: 37.531849 }

const granite = new Part(), dome = new Part(), win = new Part(), screen = new Part(), roof = new Part(), white = new Part()

const CX = -6.2, CY = 0.2
const P = 5 // platform top
const SOFFIT = 39.5, SLAB = 43.5
const HXB = 47.45, HYB = 67.85 // hall half sizes
const HXS = 57.25, HYS = 77.7 // slab half sizes
const PX = 51.2, PY = 72.5 // pillar rows

function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bev = 0, bottom = false) {
  const r = (a: number, b: number, c: number, d: number, z: number): V3[] => [[a, c, z], [b, c, z], [b, d, z], [a, d, z]]
  if (bev > 0) {
    p.loft([r(x0, x1, y0, y1, z0), r(x0, x1, y0, y1, z1 - bev), r(x0 + bev, x1 - bev, y0 + bev, y1 - bev, z1)])
    p.cap(r(x0 + bev, x1 - bev, y0 + bev, y1 - bev, z1), true)
  } else {
    p.loft([r(x0, x1, y0, y1, z0), r(x0, x1, y0, y1, z1)])
    p.cap(r(x0, x1, y0, y1, z1), true)
  }
  if (bottom) p.cap(r(x0, x1, y0, y1, z0), false)
}

/** A flight of `n` steps along +dir (1 = +x, -1 = -x, 2 = +y, -2 = -y) falling from `h` to 0. */
function flight(x0: number, x1: number, y0: number, y1: number, h: number, dir: number, n: number) {
  for (let k = 0; k < n; k++) {
    const t0 = k / n, t1 = (k + 1) / n, z = h * (1 - t0) - 0.001 * k
    let a = x0, b = x1, c = y0, d = y1
    if (dir === 1) { a = x0 + (x1 - x0) * t0; b = x0 + (x1 - x0) * t1; c = y0; d = y1 }
    if (dir === -1) { b = x1 - (x1 - x0) * t0; a = x1 - (x1 - x0) * t1 }
    if (dir === 2) { c = y0 + (y1 - y0) * t0; d = y0 + (y1 - y0) * t1 }
    if (dir === -2) { d = y1 - (y1 - y0) * t0; c = y1 - (y1 - y0) * t1 }
    // each step runs from the ground up to its tread, back to the top of the flight
    if (dir === 1) box(granite, a, x1, c, d, 0, z)
    else if (dir === -1) box(granite, x0, b, c, d, 0, z)
    else if (dir === 2) box(granite, a, b, c, y1, 0, z)
    else box(granite, a, b, y0, d, 0, z)
  }
}

// --- Platform (608162297) ---
box(granite, -68, 55, -81.8, 82.7, 0, P, 0.3)

// --- Front stair (+x): landing, flight, cheek walls, long side ramps ---
box(granite, 55, 76.8, -23.2, 23.8, 0, P)
flight(76.8, 90.2, -23.2, 23.8, P, 1, 6)
box(granite, 76.7, 90.3, 23.8, 31.3, 0, P + 0.8, 0.3)
box(granite, 76.7, 90.3, -30.5, -23.2, 0, P + 0.8, 0.3)
flight(58.8, 67.5, 23.8, 81.8, P, 2, 5) // ramps falling toward each end
flight(58.8, 67.5, -80.9, -23.2, P, -2, 5)
// --- Back stair (-x) and end stairs (±y) ---
flight(-84, -68, -26.3, 27.7, P, -1, 5)
flight(-19.4, 6.1, 82.7, 97.9, P, 2, 5)
flight(-19.6, 5.7, -98.3, -81.8, P, -2, 5)

// --- The hall: granite walls ---
box(granite, CX - HXB, CX + HXB, CY - HYB, CY + HYB, P, SOFFIT)

// Windows: per bay between pillars, three panels, two tiers of three storeys.
const tiers: [number, number][] = [[P + 3.2, P + 15.6], [P + 17.4, P + 30.0]]
function facePanels(axis: 'x' | 'y', side: number, centres: number[], half: number, skipMid: boolean) {
  const off = 0.06
  for (let b = 0; b < centres.length - 1; b++) {
    const c0 = Math.max(centres[b], -half), c1 = Math.min(centres[b + 1], half)
    if (c1 - c0 < 6) continue
    const mid = (c0 + c1) / 2
    const isMid = skipMid && Math.abs(mid) < 3
    const span = c1 - c0, pw = (span - 2 * 2.2 - 2 * 1.8) / 3
    for (let k = 0; k < 3; k++) {
      const u0 = c0 + 2.2 + k * (pw + 1.8), u1 = u0 + pw
      for (const [z0, z1] of tiers) {
        if (isMid) continue
        quadOn(win, axis, side, u0, u1, z0, z1, off)
      }
    }
    if (isMid) {
      // entrance bay: bronze screen above, dark glazed doors below
      quadOn(screen, axis, side, c0 + 2, c1 - 2, P + 8, SOFFIT - 2, off)
      quadOn(win, axis, side, c0 + 2, c1 - 2, P + 0.2, P + 6.8, off)
    }
  }
}
/** A flat panel on a face of the hall: axis 'x' = the ±x faces (u along y), 'y' = the ±y faces (u along x). */
function quadOn(p: Part, axis: 'x' | 'y', side: number, u0: number, u1: number, z0: number, z1: number, off: number) {
  if (axis === 'x') {
    const x = CX + side * (HXB + off)
    const a = CY + u0, b = CY + u1
    if (side > 0) p.quad([x, a, z0], [x, b, z0], [x, b, z1], [x, a, z1])
    else p.quad([x, b, z0], [x, a, z0], [x, a, z1], [x, b, z1])
  } else {
    const y = CY + side * (HYB + off)
    const a = CX + u0, b = CX + u1
    if (side > 0) p.quad([b, y, z0], [a, y, z0], [a, y, z1], [b, y, z1])
    else p.quad([a, y, z0], [b, y, z0], [b, y, z1], [a, y, z1])
  }
}
const ys = Array.from({ length: 8 }, (_, k) => -PY + (2 * PY * k) / 7)
const xs = Array.from({ length: 6 }, (_, k) => -PX + (2 * PX * k) / 5)
facePanels('x', 1, [-HYB, ...ys.slice(1, -1), HYB], HYB, true)
facePanels('x', -1, [-HYB, ...ys.slice(1, -1), HYB], HYB, false)
facePanels('y', 1, [-HXB, ...xs.slice(1, -1), HXB], HXB, false)
facePanels('y', -1, [-HXB, ...xs.slice(1, -1), HXB], HXB, false)

// --- The 24 pillars: chamfered square shafts with a flared capital ---
function pillar(x: number, y: number) {
  const ring = (h: number, c: number, z: number): V3[] => [
    [x + h - c, y - h, z], [x + h, y - h + c, z], [x + h, y + h - c, z], [x + h - c, y + h, z],
    [x - h + c, y + h, z], [x - h, y + h - c, z], [x - h, y - h + c, z], [x - h + c, y - h, z],
  ]
  granite.loft([ring(1.9, 0.6, P), ring(1.9, 0.6, SOFFIT - 2.2), ring(2.5, 0.7, SOFFIT - 0.6), ring(2.5, 0.7, SOFFIT)])
}
for (const y of ys) { pillar(CX - PX, CY + y); pillar(CX + PX, CY + y) }
for (const x of xs.slice(1, -1)) { pillar(CX + x, CY - PY); pillar(CX + x, CY + PY) }

// --- Roof slab: soffit, two-band fascia (a recessed groove between), roof deck ---
{
  const x0 = CX - HXS, x1 = CX + HXS, y0 = CY - HYS, y1 = CY + HYS
  box(granite, x0 + 0.6, x1 - 0.6, y0 + 0.6, y1 - 0.6, SOFFIT, SOFFIT + 1.4, 0, true) // lower band, set back
  box(granite, x0, x1, y0, y1, SOFFIT + 1.4, SLAB - 0.4, 0, true)
  box(white, x0 - 0.05, x1 + 0.05, y0 - 0.05, y1 + 0.05, SLAB - 0.4, SLAB, 0.25)
  // roof deck: a slightly darker field inside the fascia
  roof.cap([[x0 + 2, y0 + 2, SLAB + 0.03], [x1 - 2, y0 + 2, SLAB + 0.03], [x1 - 2, y1 - 2, SLAB + 0.03], [x0 + 2, y1 - 2, SLAB + 0.03]], true)
}

// --- Drum and dome (270594679: 65 m across, to 61 m) ---
{
  const N = 32, R = 32.7, Z0 = SLAB, ZW0 = SLAB + 0.8, ZW1 = SLAB + 4.2, ZD = SLAB + 7
  const pt = (r: number, i: number, z: number): V3 => {
    const a = (2 * Math.PI * i) / N
    return [CX + r * Math.cos(a), CY + r * Math.sin(a), z]
  }
  const nr = (i: number): V3 => { const a = (2 * Math.PI * i) / N; return [Math.cos(a), Math.sin(a), 0] }
  const wall = (p: Part, r: number, za: number, zb: number) => {
    for (let i = 0; i < N; i++) {
      const j = i + 1
      p.tri(pt(r, i, za), pt(r, j, za), pt(r, j, zb), undefined, undefined, undefined, [nr(i), nr(j), nr(j)])
      p.tri(pt(r, i, za), pt(r, j, zb), pt(r, i, zb), undefined, undefined, undefined, [nr(i), nr(j), nr(i)])
    }
  }
  wall(white, R, Z0, ZW0)
  wall(win, R - 0.25, ZW0, ZW1) // the ring of dark drum windows
  wall(white, R, ZW1, ZD)
  // piers between the drum windows, bold enough to break the band into openings
  for (let i = 0; i < 32; i++) {
    const a = (2 * Math.PI * (i + 0.5)) / 32, c = Math.cos(a), s = Math.sin(a), w = 1.3
    const q = (r: number, t: number, z: number): V3 => [CX + r * c - t * s, CY + r * s + t * c, z]
    white.quad(q(R + 0.05, -w, ZW0), q(R + 0.05, w, ZW0), q(R + 0.05, w, ZW1), q(R + 0.05, -w, ZW1))
  }
  // drum top: a narrow white ledge in to the dome's foot
  const RB = 31.4
  for (let i = 0; i < N; i++) white.quad(pt(R, i, ZD), pt(R, i + 1, ZD), pt(RB, i + 1, ZD), pt(RB, i, ZD))
  // spherical cap: base radius RB at ZD, rise to 61
  const TOP = 68.5, h = TOP - ZD, Rs = (RB * RB + h * h) / (2 * h), zc = TOP - Rs
  const phi0 = Math.asin(RB / Rs), M = 9
  const sp = (k: number, i: number): [V3, V3] => {
    const phi = phi0 * (1 - k / M), a = (2 * Math.PI * i) / N
    const r = Rs * Math.sin(phi), z = zc + Rs * Math.cos(phi)
    return [[CX + r * Math.cos(a), CY + r * Math.sin(a), z], [Math.sin(phi) * Math.cos(a), Math.sin(phi) * Math.sin(a), Math.cos(phi)]]
  }
  for (let k = 0; k < M; k++) for (let i = 0; i < N; i++) {
    const [a, na] = sp(k, i), [b, nb] = sp(k, i + 1), [c, nc] = sp(k + 1, i + 1), [d, nd] = sp(k + 1, i)
    if (k === M - 1) { dome.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc]); continue }
    dome.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
    dome.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
  }
  // a small finial at the crown
  box(white, CX - 0.8, CX + 0.8, CY - 0.8, CY + 0.8, TOP - 0.4, TOP + 1.2, 0.3)
}

const flood = (p: V3, n: V3) => (n[2] > 0.8 ? 0.15 : 0.85)
const parts = [
  { part: granite, material: { ...finish('granite', 0xdcdcd7), floodlight: flood } },
  { part: dome, material: { ...finish('patina-dome', 0x9fd0c3), floodlight: (p: V3) => (p[2] > 45 ? 0.7 : 0) } },
  { part: win, material: PALETTE.window },
  { part: screen, material: { ...PALETTE.entrance, color: 0x6e6252 } },
  { part: roof, material: { ...PALETTE.roof, color: 0xbfc4c6 } },
  { part: white, material: { ...PALETTE.trim, color: 0xf2f3ef, floodlight: flood } },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('National Assembly Proceeding Hall', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 69.7,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: REPLACES(),
})
function REPLACES() {
  const ids = ['way/270596342', 'way/270594679', 'way/608162297', 'way/608162749', 'way/639632935',
    'way/639626344', 'way/639626347', 'way/639626348', 'way/639626350', 'way/639626351',
    'way/875733797', 'way/875733798', 'way/875733799', 'way/875733801', 'way/876004835',
    'way/877104966', 'way/877104967', 'way/877104968', 'way/877104969']
  for (let i = 608164568; i <= 608164591; i++) ids.push(`way/${i}`)
  for (let i = 877366975; i <= 877366988; i++) ids.push(`way/${i}`)
  return ids
}
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/seoul-national-assembly.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
