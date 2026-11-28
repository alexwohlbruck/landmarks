/**
 * St. Mary's Catholic Church, San Antonio: procedural, CC0-1.0.
 * bun generators/sat-st-marys-church.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the nave runs east
 * from its west front on St. Mary's Street). The origin is the lidar grid's
 * centre, OSM's outline centroid (way/100056502: -98.4910782, 29.4256436).
 * y = 0 is the street, flat round the church (2017 lidar ground).
 *
 * Built 1923-24 for the Oblate parish on the River Walk: a Romanesque
 * Revival church of red-brown brick with pale stone trim. The west front
 * is a tall gable with a rose window over three round-arched portals,
 * between a tall square bell tower on the north corner (arched belfry
 * openings, a pinnacled parapet) and a lower tower on the south corner.
 *
 * Measured (lidar USGS_LPC_TX_Central_B2_2017_LAS_2019, flown 2017;
 * heights above y = 0):
 * - the nave: eaves 13.5 m, ridge 20.5 m, running east from the front;
 * - the north-west tower 27.1 m (x -17.7..-11, y 9..15.5), the south-west
 *   tower 25.5 m (x -17.7..-11, y -16.3..-10);
 * - the chancel at the east end, ridge 16 m; side rooms either side of it
 *   6.5 m.
 * From photos: the brick and stone, the rose window, the portals, the
 *   tower's belfry and parapet, the round-arched windows down the nave.
 * Estimated: window and portal sizes, the belfry openings (three per
 *   face), pinnacle sizes, the roof's colour (no photo shows it; drawn in
 *   the palette's roof grey).
 * The brief describes a buff Gothic church with a spire; the lidar (flat
 * square tower tops, no spire) and the photos titled for this church
 * (Rennett Stowe, Corey Leopold) show the brick Romanesque church drawn
 * here. Two photos by Ken Lund titled "St. Mary's Catholic Church, San
 * Antonio" show a different, limestone church with a round turret and
 * spire, and were not used.
 *
 * OSM: way/100056502 (outline, no parts), replaced.
 *
 * Night: the west front and tower are floodlit; windows are `window`.
 *
 * Photos (all EVIDENCE):
 * - "St Marys Catholic Church, San Antonio (7675130620).jpg", Rennett Stowe, CC BY 2.0 (Commons)
 * - "St. Marys Catholic Church", Corey Leopold, CC BY 2.0,
 *   https://www.flickr.com/photos/97708873@N00/2462193213
 *
 * Doubts: the south-west tower's form (lower and plainer in the photos,
 * drawn as a plain square tower), the east end.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ring, walls, capPoly, box, type XY } from './sat-frost-tower'

const brick = new Part()
const stone = new Part()
const win = new Part()
const roofP = new Part()
const door = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function tf(p: Part, a: V3, b: V3, c: V3, n: V3) {
  if (dot(cross(sub(b, a), sub(c, a)), n) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
const qf = (p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) => { tf(p, a, b, c, n); tf(p, a, c, d, n) }
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => ring([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])

/** A gabled hall along x: walls to the eaves, end gables, two roof planes. */
function hall(x0: number, x1: number, hw: number, eave: number, ridge: number) {
  walls(brick, rect(x0, x1, -hw, hw), 0, eave)
  for (const [x, s] of [[x0, -1], [x1, 1]] as const) tf(brick, [x, -hw, eave], [x, hw, eave], [x, 0, ridge], [s, 0, 0])
  const o = 0.4
  for (const s of [-1, 1]) qf(roofP, [x0 - o, s * (hw + o), eave - 0.2], [x1 + o, s * (hw + o), eave - 0.2], [x1 + o, 0, ridge + 0.1], [x0 - o, 0, ridge + 0.1], [0, s * (ridge - eave), hw])
}
/** A round-headed panel on a wall facing n, centred at u along t. */
function arched(p: Part, base: V3, t: V3, n: V3, w: number, z0: number, z1: number) {
  const r = w / 2, P = (u: number, z: number): V3 => [base[0] + t[0] * u + n[0] * 0.05, base[1] + t[1] * u + n[1] * 0.05, z]
  qf(p, P(-r, z0), P(r, z0), P(r, z1), P(-r, z1), n)
  for (let j = 0; j < 8; j++) {
    const a0 = (Math.PI * j) / 8, a1 = (Math.PI * (j + 1)) / 8
    tf(p, P(0, z1), P(r * Math.cos(a0), z1 + r * Math.sin(a0)), P(r * Math.cos(a1), z1 + r * Math.sin(a1)), n)
  }
}

// the nave, the chancel, the side rooms
const FRONT = -17.4
hall(FRONT, 13.0, 14.0, 13.5, 20.5)
hall(13.0, 18.3, 6.0, 11.0, 16.0)
for (const [y0, y1] of [[6, 13], [-13, -6]]) { walls(brick, rect(13, 18.3, y0, y1), 0, 6.5); capPoly(roofP, rect(13, 18.3, y0, y1), 6.5, true) }
// nave windows: tall round-headed lights between the buttress bays
for (let x = -7; x <= 10; x += 4.2) for (const s of [-1, 1]) arched(win, [x, s * 14, 0], [1, 0, 0], [0, s, 0], 1.6, 4.5, 10.5)

// the west front: stone portals and the rose window
{
  const n: V3 = [-1, 0, 0], t: V3 = [0, 1, 0]
  for (const [y, w, h] of [[0, 3.0, 5.5], [-5.2, 2.0, 4.2], [5.2, 2.0, 4.2]] as [number, number, number][]) {
    arched(stone, [FRONT, y, 0], t, n, w + 1.2, 0.4, h + 0.3)
    arched(door, [FRONT - 0.05, y, 0], t, n, w, 0.4, h)
  }
  // the rose window, a stone ring round a dark disc
  const C: V3 = [FRONT - 0.06, 0, 13.8], K = 16
  for (const [p, r, dx] of [[stone, 2.9, 0.06], [win, 2.3, 0.1]] as [Part, number, number][]) {
    for (let k = 0; k < K; k++) {
      const a0 = (2 * Math.PI * k) / K, a1 = (2 * Math.PI * (k + 1)) / K
      tf(p, [C[0] - dx, 0, C[2]], [C[0] - dx, r * Math.cos(a0), C[2] + r * Math.sin(a0)], [C[0] - dx, r * Math.cos(a1), C[2] + r * Math.sin(a1)], n)
    }
  }
  // a stone band along the front's gable base
  qf(stone, [FRONT - 0.04, -11, 9.6], [FRONT - 0.04, 11, 9.6], [FRONT - 0.04, 11, 10.3], [FRONT - 0.04, -11, 10.3], n)
}

// the towers
for (const t of [
  { y0: 9.0, y1: 15.5, body: 21.5, top: 26.2, belfry: true },
  { y0: -16.3, y1: -10.0, body: 23.0, top: 25.0, belfry: false },
]) {
  const x0 = -17.7, x1 = -11.0, cx = (x0 + x1) / 2, cy = (t.y0 + t.y1) / 2, hx = (x1 - x0) / 2, hy = (t.y1 - t.y0) / 2
  box(brick, cx, cy, hx, hy, 0, t.top)
  box(stone, cx, cy, hx + 0.25, hy + 0.25, t.body - 0.5, t.body)        // string course
  box(stone, cx, cy, hx + 0.3, hy + 0.3, t.top - 0.6, t.top)            // cornice
  capPoly(roofP, rect(x0 + 0.3, x1 - 0.3, t.y0 + 0.3, t.y1 - 0.3), t.top + 0.01, true)
  // corner pinnacles on the parapet
  for (const [px, py] of [[x0, t.y0], [x1, t.y0], [x1, t.y1], [x0, t.y1]]) box(stone, px, py, 0.45, 0.45, t.top - 0.6, t.top + 1.4)
  if (!t.belfry) continue
  // three arched belfry openings on each face
  for (const [n, base, tt] of [
    [[-1, 0, 0], [x0, cy, 0], [0, 1, 0]], [[1, 0, 0], [x1, cy, 0], [0, 1, 0]],
    [[0, -1, 0], [cx, t.y0, 0], [1, 0, 0]], [[0, 1, 0], [cx, t.y1, 0], [1, 0, 0]],
  ] as [V3, V3, V3][]) {
    for (const u of [-1.7, 0, 1.7]) arched(win, [base[0] + tt[0] * u, base[1] + tt[1] * u, 0], tt, n, 1.1, t.body + 0.6, t.top - 2.4)
  }
}

// Colours from daylight photos, pulled to the palette's lightness.
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : p[0] < -16 || (p[0] < -10 && p[1] > 8.5) ? 0.85 : 0.15)
const parts = [
  { part: brick, material: { ...finish('stmarys-brick', 0xbf8468), floodlight: lit } },
  { part: stone, material: { ...PALETTE.trim, floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: roofP, material: PALETTE.roof },
  { part: door, material: finish('stmarys-door', 0x6a4a36) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb("St. Mary's Catholic Church", parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 27.6, anchor: [29.4256436, -98.4910782], replaces: ['way/100056502'],
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/sat-st-marys-church.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
