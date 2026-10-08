/**
 * Sather Tower (the Campanile), UC Berkeley — original procedural geometry,
 * CC0-1.0.
 * bun generators/sf-sather-tower.ts
 *
 * Frame: built square to the tower, BEARING 344.8 (its faces run 15.2° anti-
 * clockwise of the compass points). x east-ish, y north-ish, z up, metres.
 * Origin = the centre of the shaft (lidar), 0.8 m east-south-east of the OSM
 * outline's centroid.
 *
 * Evidence
 * - OSM way/24024507 (building=bell_tower, height 93.6), a 10.5 m square;
 *   way/1013163515 is the spire (roof:shape pyramidal) inside it.
 * - USGS 3DEP lidar (CA_AlamedaCo_3_2021) at 0.5 m, in this frame
 *   (/tmp/city/sf/work/sf-sather-tower). y = 0 is 98.5 m NAVD88, the ground
 *   all round the base (flat to ±0.2 m). Measured above it: the belfry
 *   cornice's outer edge 70.3 (about ±5.6 m); the attic's deck 72.8 (±4.5);
 *   the corner pinnacles to ~77.5; the spire's square plinth 75.7 (±3.6); the
 *   pyramid from ~76 at ±3.2 to the lantern; the lantern and finial 92.5.
 * - Published (Wikipedia; UC Berkeley): 1914, John Galen Howard, after St
 *   Mark's Campanile in Venice; 307 ft (93.6 m); granite; four clock faces;
 *   the observation platform at the belfry, about 200 ft up; a 61-bell
 *   carillon.
 * - Commons daylight photos: "Sather Tower-2.jpg", "Sather Tower.jpg"
 *   (Almonroth, CC BY-SA 3.0), "Sather Tower Campanile April2015
 *   eastface.jpg" (Apostmodernist, CC BY-SA 4.0), "Sather Tower from Memorial
 *   Glade.jpg" (Coolcaesar, CC BY-SA 4.0), "Sather Tower, Campanile
 *   University Berkeley.jpg" (Burkhard Mücke, CC BY-SA 4.0), "Sather Tower
 *   2013-09-29 13-34-23.jpg" (EricDLee, CC BY-SA 3.0).
 *
 * Estimated from the photos (scaled to the lidar's cornice and attic): the
 * belfry sill (60.0) and balustrade, the three arched openings per side
 * (2.0 m wide, to 67.4), the band under the belfry, the clock dials (r 2.6,
 * centre 54.3), the slit windows up each face, the corner pilaster strips,
 * the spire's tip (89.5) and the lantern's size. The four sides are drawn
 * alike, as the tower is.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const BEARING = 344.8
const ANCHOR = { lng: -122.257822, lat: 37.872056 }
const granite = new Part(), trim = new Part(), win = new Part(), spire = new Part(), metal = new Part()

// --- Dimensions (m above the ground) ---
const S = 5.25 // the shaft's half-width
const BAND0 = 57.8, BAND1 = 58.6 // the band under the belfry
const SILL = 60.0, BELFRY_TOP = 68.6, CORNICE = 70.3, ATTIC = 72.8
const PLINTH = 75.7, PYR0 = 75.7, PYR_TIP = 89.5, TOP = 93.0

/** An axis-aligned box with chamfered vertical edges. */
function block(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, ch = 0.3, top: Part | null = part, bottom: Part | null = null) {
  const r: XY[] = [[x0 + ch, y0], [x1 - ch, y0], [x1, y0 + ch], [x1, y1 - ch], [x1 - ch, y1], [x0 + ch, y1], [x0, y1 - ch], [x0, y0 + ch]]
  for (let i = 0; i < 8; i++) {
    const a = r[i], b = r[(i + 1) % 8]
    part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  for (let i = 1; i < 7; i++) {
    if (top) top.tri([r[0][0], r[0][1], z1], [r[i][0], r[i][1], z1], [r[i + 1][0], r[i + 1][1], z1])
    if (bottom) bottom.tri([r[0][0], r[0][1], z0], [r[i + 1][0], r[i + 1][1], z0], [r[i][0], r[i][1], z0])
  }
}
const cube = (p: Part, h: number, z0: number, z1: number, ch = 0.3, top: Part | null = p, bottom: Part | null = null) => block(p, -h, h, -h, h, z0, z1, ch, top, bottom)

/** The four quarter-turns: the tower is the same on every side. */
const turn = (k: number) => ([x, y, z]: V3): V3 => {
  const c = Math.round(Math.cos((k * Math.PI) / 2)), s = Math.round(Math.sin((k * Math.PI) / 2))
  return [c * x - s * y, s * x + c * y, z]
}
/** A point on the south face (y = -h - d), s along it from west to east. */
const onFace = (k: number, h: number, s: number, d: number, z: number) => turn(k)([s, -h - d, z])
const panel = (p: Part, k: number, h: number, s0: number, s1: number, z0: number, z1: number, d = 0.05) =>
  p.quad(onFace(k, h, s0, d, z0), onFace(k, h, s1, d, z0), onFace(k, h, s1, d, z1), onFace(k, h, s0, d, z1))
/** A raised strip on a face: front, two sides and a top. */
function relief(p: Part, k: number, h: number, s0: number, s1: number, d: number, z0: number, z1: number) {
  panel(p, k, h, s0, s1, z0, z1, d)
  p.quad(onFace(k, h, s0, 0, z0), onFace(k, h, s0, d, z0), onFace(k, h, s0, d, z1), onFace(k, h, s0, 0, z1))
  p.quad(onFace(k, h, s1, d, z0), onFace(k, h, s1, 0, z0), onFace(k, h, s1, 0, z1), onFace(k, h, s1, d, z1))
  p.quad(onFace(k, h, s0, d, z1), onFace(k, h, s1, d, z1), onFace(k, h, s1, 0, z1), onFace(k, h, s0, 0, z1))
}
/** A round-headed panel: a rectangle and a true semicircle of its width. */
function arched(p: Part, k: number, h: number, sc: number, w: number, z0: number, z1: number, d = 0.05, n = 8) {
  const r = w / 2, spring = z1 - r
  panel(p, k, h, sc - r, sc + r, z0, spring, d)
  for (let i = 0; i < n; i++) {
    const a0 = (Math.PI * i) / n, a1 = (Math.PI * (i + 1)) / n
    p.tri(onFace(k, h, sc, d, spring), onFace(k, h, sc + r * Math.cos(a0), d, spring + r * Math.sin(a0)), onFace(k, h, sc + r * Math.cos(a1), d, spring + r * Math.sin(a1)))
  }
}
function disc(p: Part, k: number, h: number, zc: number, r: number, d: number, n = 16) {
  for (let i = 0; i < n; i++) {
    const a0 = (2 * Math.PI * i) / n, a1 = (2 * Math.PI * (i + 1)) / n
    p.tri(onFace(k, h, 0, d, zc), onFace(k, h, r * Math.cos(a0), d, zc + r * Math.sin(a0)), onFace(k, h, r * Math.cos(a1), d, zc + r * Math.sin(a1)))
  }
}
/** A square pyramid, its base at z0 with half-width h, apex at z1. */
function pyramid(p: Part, x: number, y: number, h: number, z0: number, z1: number) {
  const q: V3[] = [[x - h, y - h, z0], [x + h, y - h, z0], [x + h, y + h, z0], [x - h, y + h, z0]]
  for (let i = 0; i < 4; i++) p.tri(q[i], q[(i + 1) % 4], [x, y, z1])
}

// ---------------------------------------------------------------------------
// The shaft: plain granite with a pilaster strip down each corner, a low base
// course, and a column of slit windows up the middle of each side.
cube(granite, S + 0.2, 0, 1.6, 0.3, granite)
cube(granite, S - 0.15, 1.6, BAND0, 0.2, null)
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const x0 = sx > 0 ? S - 1.2 : -S, x1 = sx > 0 ? S : -S + 1.2
  const y0 = sy > 0 ? S - 1.2 : -S, y1 = sy > 0 ? S : -S + 1.2
  block(granite, x0, x1, y0, y1, 1.6, BAND0, 0.25, null)
}
for (let k = 0; k < 4; k++) {
  for (let i = 0; i < 6; i++) {
    const z = 7 + i * 7.2
    panel(win, k, S - 0.15, -0.25, 0.25, z, z + 2.2)
  }
  // the clock: a dark ring round a pale dial, and its hands
  disc(metal, k, S - 0.15, 54.3, 2.6, 0.05)
  disc(trim, k, S - 0.15, 54.3, 2.25, 0.1)
  const hand = (len: number, w: number, ang: number, d: number) => {
    const c = Math.cos(ang), s = Math.sin(ang), nx = -s * w, nz = c * w
    metal.quad(onFace(k, S - 0.15, nx, d, 54.3 + nz), onFace(k, S - 0.15, -nx, d, 54.3 - nz),
      onFace(k, S - 0.15, len * c - nx, d, 54.3 + len * s - nz), onFace(k, S - 0.15, len * c + nx, d, 54.3 + len * s + nz))
  }
  hand(1.9, 0.12, Math.PI / 2 + 0.35, 0.14) // minute hand near twelve
  hand(1.3, 0.16, -0.35, 0.16) // hour hand near four
}

// The band under the belfry, then the belfry: three tall round-arched
// openings a side over a balustrade, between broad corner piers.
cube(trim, S + 0.25, BAND0, BAND1, 0.3, trim, trim)
cube(granite, S, BAND1, BELFRY_TOP, 0.3, null)
for (let k = 0; k < 4; k++) {
  for (const sc of [-2.45, 0, 2.45]) arched(win, k, S, sc, 2.0, SILL + 0.2, 67.4)
  relief(trim, k, S, -3.75, 3.75, 0.2, SILL, SILL + 1.2) // the balustrade
}
// The cornice over the belfry, and the attic with its corner pinnacles.
cube(trim, S + 0.35, BELFRY_TOP, CORNICE, 0.3, trim, trim)
cube(granite, 4.75, CORNICE, ATTIC, 0.25, trim)
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const x = sx * 4.2, y = sy * 4.2
  block(trim, x - 0.5, x + 0.5, y - 0.5, y + 0.5, ATTIC, ATTIC + 2.2, 0.1, null)
  pyramid(trim, x, y, 0.5, ATTIC + 2.2, 79.0)
}

// The spire: a pale plinth, then the green copper pyramid, its lantern and
// finial.
cube(trim, 3.6, ATTIC, PLINTH, 0.25, null)
for (let k = 0; k < 4; k++) {
  const T = turn(k)
  spire.quad(T([-3.6, -3.6, PLINTH]), T([3.6, -3.6, PLINTH]), T([3.3, -3.3, PYR0 + 0.1]), T([-3.3, -3.3, PYR0 + 0.1]))
  spire.tri(T([-3.3, -3.3, PYR0 + 0.1]), T([3.3, -3.3, PYR0 + 0.1]), [0, 0, PYR_TIP])
}
cube(metal, 0.55, PYR_TIP - 1.4, PYR_TIP + 1.3, 0.12, null)
pyramid(metal, 0, 0, 0.7, PYR_TIP + 1.3, PYR_TIP + 2.0)
cube(metal, 0.12, PYR_TIP + 1.9, TOP, 0.04, metal)

const parts = [
  { part: granite, material: finish('sather-granite', 0xebe6dc) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: spire, material: finish('sather-verdigris', 0x9fc2b2) },
  { part: metal, material: finish('sather-bronze', 0x5f6f68) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Sather Tower', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TOP,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/24024507', 'way/1013163515'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-sather-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
