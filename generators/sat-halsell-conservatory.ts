/**
 * Lucile Halsell Conservatory, San Antonio Botanical Garden: procedural,
 * CC0-1.0.
 * bun generators/sat-halsell-conservatory.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * middle of the glass houses (-98.4568762, 29.4580904), the lidar grid's
 * centre. y = 0 is the floor of the sunken courtyard, the lowest ground
 * under the model; the garden round it is about 4.3 m higher (2017 lidar
 * ground; Mapterhorn shows the same pit, so it is already in the terrain).
 *
 * Emilio Ambasz, 1988: the greenhouses are sunk into the ground round a
 * courtyard, ringed by a concrete gallery, and only their glass roofs
 * rise above the earth: a big pavilion (three quarters of a truncated cone
 * cut by two vertical glass faces), a truncated cone, two pyramids and a
 * low cone.
 *
 * Measured (lidar USGS_LPC_TX_Central_B2_2017_LAS_2019, flown 2017;
 * heights above y = 0; plans from OSM's greenhouse areas):
 * - the big pavilion (OSM way/79583192), radius 16.6 m, to 22.1 m: the
 *   2022 NAIP shows its glass rings centred on the cut corner, so the cone's
 *   axis is that corner, and its two vertical cut faces are steep
 *   triangles 18 m tall on a 16.6 m base (the steep triangle seen from
 *   the garden);
 * - the truncated cone (way/79583187), radius 10.5 m, rising to its top
 *   ring (radius 5.2 m, the lidar's ring of highest returns at r 4-5 m;
 *   drawn at the outer edge of that ring so the sides are steep, 65
 *   degrees, as the photos show) at 15.9 m;
 * - the two pyramids (ways 79583188 and 79583189), 14.5 and 14.1 m;
 * - the low cone (way/79583193), radius 8.5 m, 10.3 m (lidar 9.2, raised to clear the drawn ground), on higher ground
 *   (8.1 m) north of the court;
 * - the garden grade 4.3 m; the courtyard floor y = 0.
 * Lidar returns on glass are sparse (some pass through to the plants), so
 * the tops are the highest returns, the shapes from photos.
 * From photos: the forms, the green glass (pulled a little darker after
 * review), the grey concrete
 * gallery and plinths.
 * Estimated: the pyramids' apexes centred (the lidar's highest returns sit
 * near one corner of each; the photos show steep faces, drawn regular),
 * the big pavilion's top ring (radius 6 m), the gallery's line along the
 * court's south and west edges (a 4 m wide roof at grade).
 * Drawn: the glazing bars as a few bold pale ribs and rings (every other
 * cone segment, two rings; two bars and a centre bar on each pyramid face),
 * far fewer and wider than the real ones, so the glass reads as framed.
 * Left out: the gallery's slanted piers, the planting.
 *
 * OSM maps the glass houses only as landuse=greenhouse_horticulture
 * areas, not as buildings, so the map draws nothing there and the model
 * replaces nothing.
 *
 * Night: the glass is `glass` and stays dark, as the style asks.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Moon over the Conservatory.jpg", Corey Leopold, CC BY 2.0 (from the courtyard)
 * - "Lucile Halsell Conservatory at sunset1.jpg" and "...at sunset.jpg", Corey Leopold, CC BY 2.0
 * - "Big Sky over the Gardens.jpg", Corey Leopold, CC BY 2.0
 * - USGS NAIP orthophoto (public domain): the plans, the big pavilion's axis
 *
 * Doubts: the pyramids' exact form (possibly skewed), the gallery's plan.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { ring, walls, capPoly, type XY } from './sat-frost-tower'

const glass = new Part()
const conc = new Part()
const bars = new Part()   // glazing bars, bold and few so they read

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function tf(p: Part, a: V3, b: V3, c: V3, n: V3) {
  if (dot(cross(sub(b, a), sub(c, a)), n) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
const qf = (p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) => { tf(p, a, b, c, n); tf(p, a, c, d, n) }
const GRADE = 4.3

/** A truncated cone over angles a0..a1 (radians, from east), plinth below. */
function cone(cx: number, cy: number, r0: number, r1: number, z1: number, a0 = 0, a1 = Math.PI * 2, K = 20, closeEnds = false, GRADE = 4.3) {
  const P = (r: number, a: number, z: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
  for (let k = 0; k < K; k++) {
    const t0 = a0 + ((a1 - a0) * k) / K, t1 = a0 + ((a1 - a0) * (k + 1)) / K, tm = (t0 + t1) / 2
    const n: V3 = [Math.cos(tm) * (z1 - GRADE), Math.sin(tm) * (z1 - GRADE), r0 - r1]
    qf(glass, P(r0, t0, GRADE), P(r0, t1, GRADE), P(r1, t1, z1), P(r1, t0, z1), n)
    qf(conc, P(r0, t0, 0), P(r0, t1, 0), P(r0, t1, GRADE), P(r0, t0, GRADE), [Math.cos(tm), Math.sin(tm), 0])
    tf(glass, [cx, cy, z1], P(r1, t0, z1), P(r1, t1, z1), [0, 0, 1])
    // a rib up every other segment line, and two rings round the cone
    const o = 0.1, w = 0.35 / Math.max(r1, 1)
    if (k % 2 === 0) qf(bars, P(r0 + o, t0 - (w * r1) / r0, GRADE), P(r0 + o, t0 + (w * r1) / r0, GRADE), P(r1 + o, t0 + w, z1), P(r1 + o, t0 - w, z1), n)
    for (const f of [0.35, 0.7]) {
      const ra = r0 + (r1 - r0) * f, za = GRADE + (z1 - GRADE) * f, d = 0.25
      const rb = r0 + (r1 - r0) * (f + d / (z1 - GRADE)), zb = za + d
      qf(bars, P(ra + o, t0, za), P(ra + o, t1, za), P(rb + o, t1, zb), P(rb + o, t0, zb), n)
    }
  }
  if (closeEnds) for (const [a, s] of [[a0, -1], [a1, 1]] as const) {
    const n: V3 = [-Math.sin(a) * s, Math.cos(a) * s, 0]
    qf(glass, [cx, cy, GRADE], P(r0, a, GRADE), P(r1, a, z1), [cx, cy, z1], n)
    qf(conc, [cx, cy, 0], P(r0, a, 0), P(r0, a, GRADE), [cx, cy, GRADE], n)
  }
}
/** A pyramid on a rectangle (plan ring), apex at its centre, plinth below. */
function pyramid(R: XY[], apex: number) {
  const P = ring(R), cx = P.reduce((s, p) => s + p[0], 0) / P.length, cy = P.reduce((s, p) => s + p[1], 0) / P.length
  walls(conc, P, 0, GRADE)
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length], m: V3 = [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 3]
    tf(glass, [a[0], a[1], GRADE], [b[0], b[1], GRADE], [cx, cy, apex], m)
    // two horizontal bars across the face and a bar up its middle
    const L = (p: XY, f: number): V3 => [p[0] + (cx - p[0]) * f, p[1] + (cy - p[1]) * f, GRADE + (apex - GRADE) * f]
    const off = (q: V3): V3 => { const l = Math.hypot(m[0], m[1], m[2]); return [q[0] + (m[0] / l) * 0.1, q[1] + (m[1] / l) * 0.1, q[2] + (m[2] / l) * 0.1] }
    for (const f of [0.33, 0.66]) {
      const g = f + 0.035
      qf(bars, off(L(a, f)), off(L(b, f)), off(L(b, g)), off(L(a, g)), m)
    }
    const mid: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], t: XY = [(b[0] - a[0]) * 0.015, (b[1] - a[1]) * 0.015]
    qf(bars, off([mid[0] - t[0], mid[1] - t[1], GRADE]), off([mid[0] + t[0], mid[1] + t[1], GRADE]), off([cx, cy, apex - 0.3]), off([cx, cy, apex - 0.3]), m)
  }
}

// the big pavilion: three quarters of a truncated cone, open to the south-west
cone(44.2, -4.5, 16.6, 6.0, 22.1, -Math.PI / 2 + 0.06, Math.PI - 0.04, 18, true)
// the truncated cone and the low cone
cone(-50.0, -5.5, 10.5, 5.2, 15.9)
cone(3.6, 30.8, 8.5, 0.6, 10.3, 0, Math.PI * 2, 16, false, 8.1)
// the two pyramids
pyramid([[-3.2, -38.1], [-3.8, -25.2], [-16.8, -24.7], [-17.8, -37.9]], 14.5)
pyramid([[9.5, -21.6], [21.7, -21.6], [20.4, -34.5], [9.2, -33.8]], 14.1)

// the gallery round the courtyard: a concrete roof at grade on the court's
// edge, from the cone in the west to the big pavilion in the east, and
// its wall down to the court floor
{
  const G = ring([[-40, -15], [23, -15], [23, -11], [-36, -11], [-36, 8], [-40, 8]])
  walls(conc, G, 0, GRADE)
  capPoly(conc, G, GRADE, true)
}

// Colours from daylight photos, pulled to the palette's lightness.
const parts = [
  { part: glass, material: { name: 'glass', color: 0x84aea9, roughness: 0.24 } },
  { part: conc, material: finish('halsell-concrete', 0xcdc8bd) },
  { part: bars, material: finish('halsell-glazing-bars', 0xe4e8e6) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Lucile Halsell Conservatory', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 22.1, anchor: [29.4580904, -98.4568762], replaces: [],
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/sat-halsell-conservatory.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
