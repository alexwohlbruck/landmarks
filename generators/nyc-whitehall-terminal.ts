/**
 * Staten Island Ferry Whitehall Terminal, 4 South Street, Manhattan — procedural, CC0-1.0, no textures.
 * bun generators/nyc-whitehall-terminal.ts
 *
 * The 2005 terminal (Frederic Schwartz Architects with TAMS): a glass hall
 * whose roof rises towards Peter Minuit Plaza, behind a long stainless
 * canopy that carries the STATEN ISLAND FERRY letters; on the harbour side a
 * concrete slip building over the ferry slips, a glazed upper band and a
 * south-facing solar roof.
 *
 * Map frame: x east, y north, z up, metres (bearing 0: the outline is a fan
 * with no dominant axis, so the model is built on the OSM coordinates
 * directly). Anchor: area centroid of the OSM outline way/38868195.
 * z = 0 is the harbour (lidar water surface, -0.5 m NAVD88), the lowest
 * ground under the footprint; the plaza is 3.0 m above it, so on the plaza
 * side the bottom 3 m of the walls sit under the pavement.
 * Not modelled: the water, the ferries, the fender racks and the slips'
 * ramps and gangways. The projecting slip houses over the three slips are
 * included (they are OSM parts of the building).
 *
 * Evidence
 * - OSM: building relation/2848024: outline way/38868195 (height 15),
 *   parts way/213853441 (the slip building, 20), 213853440 (its south
 *   strip, 23), 213853442 / 213853443 / 213853444 (west tower, roof block,
 *   east tower, 24), 213847694 / 213847696 / 213847698 (the slip houses,
 *   building=roof, 12), 213847700 (the plaza canopy, 4.5…5).
 * - Lidar: USGS 3DEP NY_NewYorkCity (flown 2017), 0.5 m grid, heights above
 *   the water: plaza 3.0; canopy top 8.3; the hall roof one plane, 15.3 m
 *   at its south-west corner to 26.6 m along the plaza front
 *   (z = 19.55 + 0.0138 x + 0.1375 y); the slip building's flat roof 22.3;
 *   the slip houses' tops 18.0…18.6, projecting ~7 m beyond the outline's
 *   south edge (lidar and NAIP agree; OSM's 12 m is too low); the glazed
 *   band's top 27.6 and the solar roof rising from it to 31.5 about 9 m
 *   back; the towers 27.2 (east) and 27.5 (west); a roof block to 26.5.
 * - Published: opened 2005 (Wikipedia "Whitehall Terminal"; Frederic
 *   Schwartz Architects); three slips in service.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   plaza front: "Staten Island Ferry Whitehall Terminal (48126534661).jpg", Ajay Suresh, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Staten_Island_Ferry_Whitehall_Terminal_(48126534661).jpg
 *   plaza front at dusk: "Whitehall Terminal vc.jpg", Charles Smith, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Whitehall_Terminal_vc.jpg
 *   plaza front and canopy: "South Ferry td (2019-07-18) 09 - Whitehall Terminal.jpg", Tdorante10, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:South_Ferry_td_(2019-07-18)_09_-_Whitehall_Terminal.jpg
 *   north-west corner: "South Ferry td (2019-07-07) 03 - Whitehall Terminal.jpg", Tdorante10, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:South_Ferry_td_(2019-07-07)_03_-_Whitehall_Terminal.jpg
 *   west side: "Staten Island Ferry Whitehall Terminal.jpg", Kidfly182, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Staten_Island_Ferry_Whitehall_Terminal.jpg
 *   harbour side from above: "Staten Island Ferry Whitehall Terminal photo Don Ramey Logan.jpg" and
 *     "Manhattan Island Ferry Terminals photo Don Ramey Logan.jpg", Don Ramey Logan, CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Staten_Island_Ferry_Whitehall_Terminal_photo_Don_Ramey_Logan.jpg
 *     https://commons.wikimedia.org/wiki/File:Manhattan_Island_Ferry_Terminals_photo_Don_Ramey_Logan.jpg
 *   harbour side from the water: "Andrew J. Barberi at Staten Island Ferry Whitehall Terminal.JPG", Opencooper, CC0,
 *     https://commons.wikimedia.org/wiki/File:Andrew_J._Barberi_at_Staten_Island_Ferry_Whitehall_Terminal.JPG
 *   from the harbour: "Staten Island Ferry terminal.jpg", Daniel Schwen, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Staten_Island_Ferry_terminal.jpg
 *   Aerial plan: USGS NAIP (public domain).
 *
 * Numbers
 * - Measured: footprint (OSM), every height above (lidar), the slip houses'
 *   depth (lidar, NAIP).
 * - Estimated from the photos: the slip openings 0…12 m, the orange bands
 *   12…13 m; the glazed band 18…22.6 with its blue panel strip along the top, pale
 *   structure above it to the array's lower edge (27.6, lidar); mullion spacing
 *   (every ~9 m, every other real mullion); the canopy's columns (every
 *   ~12 m); the letters 6 m tall (about a third of the glass above the canopy),
 *   standing on the canopy 2 m in from its curved front along the north-east
 *   glass wall (the plaza front), the words spanning nearly all of it;
 *   the canopy's fascia 1.3 m deep.
 * - Colours from daylight photos: pale grey concrete, teal-green
 *   reflective glass, stainless canopy and letters (drawn pale), the orange
 *   slip bands, dark blue-grey solar panels.
 *
 * Lettering: STATEN ISLAND FERRY is kept because the sign is part of the
 * landmark (STYLE.md, famous signs), drawn with generators/lettering.ts as the
 * real sign's letterforms (traced from the Ajay Suresh and Charles Smith
 * photos) and bent along the canopy's curved front.
 * Canopy: its plaza front is drawn as an arc bulging 3 m (OSM has it nearly
 * straight; the photos show it curving). The long north-west arm is real:
 * NAIP shows it as a continuous shaded canopy along the OSM outline, and
 * Tdorante10's 2019-07-18 photo shows its columns.
 *
 * Doubts: the canopy's far north-west arm (to y = 130) is drawn from OSM
 * alone, no photo shows it whole. The harbour side's slip openings are
 * placed under the three OSM slip houses; photos show three openings but
 * their exact widths are estimated. The lead's note of a "large
 * cantilevered roof canopy" is not borne out by the lidar (the hall roof
 * ends at the glass wall); the cantilevered element is the low plaza
 * canopy, modelled.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, prism, finishModel, capPoly, area, circle } from './nyc-570-lexington'
import { block, wallFrame, grow } from './nyc-city-hall'
import { Pen, strokes, type Pt } from './lettering'

const stone = new Part(), glass = new Part(), roof = new Part(), win = new Part(), orange = new Part(), solar = new Part()

const PLAZA = 3.0
const roofZ = (x: number, y: number) => 19.55 + 0.0138 * x + 0.1375 * y

/** Ear-clipping triangles of a simple polygon, as index triples (counter-clockwise). */
function earClip(ring: XY[]): [number, number, number][] {
  const pts = area(ring) < 0 ? [...ring].reverse() : ring
  const flip = area(ring) < 0
  const idx = pts.map((_, i) => i), tris: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 20000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      if (cr(pts[i0], pts[i1], pts[i2]) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && cr(pts[i0], pts[i1], pts[j]) >= 0 && cr(pts[i1], pts[i2], pts[j]) >= 0 && cr(pts[i2], pts[i0], pts[j]) >= 0)) continue
      tris.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) tris.push([idx[0], idx[1], idx[2]])
  const n = ring.length
  return flip ? tris.map(([a, b, c]) => [n - 1 - a, n - 1 - b, n - 1 - c]) : tris
}

/** A quad wound to face along n. */
function face(p: Part, pts: V3[], n: V3) {
  const [a, b, c] = pts
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const k = (u[1] * v[2] - u[2] * v[1]) * n[0] + (u[2] * v[0] - u[0] * v[2]) * n[1] + (u[0] * v[1] - u[1] * v[0]) * n[2]
  const q = k < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}
const edgesOf = (r: XY[]) => r.map((a, i) => [a, r[(i + 1) % r.length]] as [XY, XY])
const L = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

// ===========================================================================
// The hall: glass walls under one sloping roof
// ===========================================================================
const HALL: XY[] = [
  [-37.7, -27.2], [-10.0, -24.0], [18.9, -21.3], [25.9, -20.4], [46.5, -14.3], [44.9, -6.4],
  [18.2, 49.3], [-3.7, 51.6], [-25.4, 53.9], [-27.0, 51.1], [-39.3, 30.0], [-40.7, 9.6], [-41.3, 4.4],
]
{
  // Walls: teal glass from the water to the roof plane, with pale mullions and a fascia.
  for (const [a, b] of edgesOf(HALL)) {
    const za = roofZ(a[0], a[1]), zb = roofZ(b[0], b[1])
    const f = wallFrame(a, b, 0)
    const len = L(a, b)
    face(glass, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], zb], [a[0], a[1], za]], f.n)
    // The south side of the hall is against the slip building: no mullions there.
    if (a[1] < -15 && b[1] < -15) continue
    const fd = wallFrame(a, b, 0.08)
    const zAt = (s: number) => za + (zb - za) * (s / len)
    // Pale mullion grid: verticals every ~6 m, floor lines every 4 m up the glass (clipped to the sloping top).
    const n = Math.max(1, Math.round(len / 6))
    for (let k = 1; k < n; k++) {
      const s = (len * k) / n
      face(stone, [fd.at(s - 0.18, PLAZA), fd.at(s + 0.18, PLAZA), fd.at(s + 0.18, zAt(s + 0.18)), fd.at(s - 0.18, zAt(s - 0.18))], f.n)
    }
    for (const z of [12.3, 16.3, 20.3, 24.3]) {
      // The part of this wall whose top is above z + 0.8.
      const ok = (s: number) => zAt(s) > z + 0.8
      let s0 = ok(0) ? 0 : za === zb ? len : Math.max(0, Math.min(len, ((z + 0.8 - za) / (zb - za)) * len))
      let s1 = ok(len) ? len : za === zb ? 0 : Math.max(0, Math.min(len, ((z + 0.8 - za) / (zb - za)) * len))
      if (s1 - s0 < 1) continue
      face(stone, [fd.at(s0, z), fd.at(s1, z), fd.at(s1, z + 0.3), fd.at(s0, z + 0.3)], f.n)
    }
    face(stone, [fd.at(0, za - 0.7), fd.at(len, zb - 0.7), fd.at(len, zb + 0.15), fd.at(0, za + 0.15)], f.n)
  }
  // The roof: one plane, pale grey.
  for (const [i, j, k] of earClip(HALL)) {
    const p = (q: XY): V3 => [q[0], q[1], roofZ(q[0], q[1])]
    roof.tri(p(HALL[i]), p(HALL[j]), p(HALL[k]))
  }
}

// ===========================================================================
// The slip building on the harbour side
// ===========================================================================
// The outline's south edge, west to east, and the slip building behind it.
const SOUTH: XY[] = [[-41.1, -47.3], [-37.8, -47.0], [-17.9, -45.2], [-6.8, -43.7], [13.3, -41.7], [16.6, -41.2], [36.0, -35.6], [55.6, -29.7]]
const SLIP_BLD: XY[] = [
  ...SOUTH, [58.6, -28.5], [56.7, -24.0], [53.1, -12.4], [46.5, -14.3], [25.9, -20.4], [18.9, -21.3], [-10.0, -24.0], [-37.7, -27.2],
  [-37.1, -32.1], [-42.7, -32.8], [-41.5, -43.5],
]
const FLAT = 22.3, BAND0 = 18.0, GLASS_TOP = 22.6, BAND1 = 27.6, SOLAR_TOP = 31.5, SOLAR_D = 9.0
prism({ wall: stone, win: null, roof, ring: SLIP_BLD, z0: 0, z1: FLAT, facade: null, bevel: 0.3 })

// The glazed band along the south edge (a volume 4.5 m deep to 27.6 m) and the solar array over it:
// an open tilted plane rising to 31.5 m about 9 m back, on posts.
{
  const off = (a: XY, b: XY, d: number): [XY, XY] => {
    const len = L(a, b), nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len // inward (north) normal
    return [[a[0] + nx * d, a[1] + ny * d], [b[0] + nx * d, b[1] + ny * d]]
  }
  const mitre = (d: number): XY[] => SOUTH.map((p, i) => {
    const a = SOUTH[Math.max(0, i - 1)], b = SOUTH[Math.min(SOUTH.length - 1, i + 1)]
    const len = L(a, b), nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len
    return [p[0] + nx * d, p[1] + ny * d]
  })
  const mid = mitre(4.5), back = mitre(SOLAR_D)
  const T = 0.35 // the array's thickness
  for (let i = 0; i < SOUTH.length - 1; i++) {
    const a = SOUTH[i], b = SOUTH[i + 1], ma = mid[i], mb = mid[i + 1], ba = back[i], bb = back[i + 1]
    const f = wallFrame(a, b, 0.06), len = L(a, b)
    const out: V3 = f.n, inn: V3 = [-out[0], -out[1], 0]
    // Glazed band, standing a little proud of the concrete, and its blue panel strip.
    face(glass, [f.at(0, BAND0), f.at(len, BAND0), f.at(len, GLASS_TOP), f.at(0, GLASS_TOP)], out)
    const f2 = wallFrame(a, b, 0.12)
    face(win, [f2.at(0.3, GLASS_TOP - 1.4), f2.at(len - 0.3, GLASS_TOP - 1.4), f2.at(len - 0.3, GLASS_TOP), f2.at(0.3, GLASS_TOP)], out)
    // The concrete behind the glass from the flat roof up, the band's roof and its back wall.
    face(stone, [[a[0], a[1], FLAT], [b[0], b[1], FLAT], [b[0], b[1], BAND1], [a[0], a[1], BAND1]], out)
    face(roof, [[a[0], a[1], BAND1], [b[0], b[1], BAND1], [mb[0], mb[1], BAND1], [ma[0], ma[1], BAND1]], [0, 0, 1])
    face(stone, [[ma[0], ma[1], FLAT], [mb[0], mb[1], FLAT], [mb[0], mb[1], BAND1], [ma[0], ma[1], BAND1]], inn)
    // The solar array: a thin tilted plane from a 1 m overhang over the band up to the back line.
    const [oa, ob] = off(a, b, -1.0)
    const up = (q: XY, z: number): V3 => [q[0], q[1], z]
    face(solar, [up(oa, BAND1 + T), up(ob, BAND1 + T), up(bb, SOLAR_TOP), up(ba, SOLAR_TOP)], [0, 0, 1])
    face(solar, [up(oa, BAND1), up(ob, BAND1), up(bb, SOLAR_TOP - T), up(ba, SOLAR_TOP - T)], [0, 0, -1])
    face(solar, [up(oa, BAND1), up(ob, BAND1), up(ob, BAND1 + T), up(oa, BAND1 + T)], out)
    face(solar, [up(ba, SOLAR_TOP - T), up(bb, SOLAR_TOP - T), up(bb, SOLAR_TOP), up(ba, SOLAR_TOP)], inn)
  }
  // Posts under the array's back edge, every ~12 m.
  for (let i = 0; i < back.length; i++) {
    const p = back[i]
    if (i > 0 && i < back.length - 1 && L(back[i - 1], p) < 14) continue
    block(roof, p[0] - 0.45, p[1] - 0.45, p[0] + 0.45, p[1] + 0.45, FLAT, SOLAR_TOP - 0.3)
  }
  // Ends of the glazed band.
  for (const [p, q, n] of [[SOUTH[0], mid[0], -1], [SOUTH[SOUTH.length - 1], mid[mid.length - 1], 1]] as [XY, XY, number][]) {
    const dx = q[0] - p[0], dy = q[1] - p[1], nn: V3 = [n * dy, -n * dx, 0]
    face(stone, [[p[0], p[1], FLAT], [q[0], q[1], FLAT], [q[0], q[1], BAND1], [p[0], p[1], BAND1]], nn)
  }
}

// The three slip houses: concrete boxes projecting over the slips, orange along their lower edge,
// with the dark slip opening behind each.
const HOUSES: XY[][] = [
  [[-37.2, -53.1], [-17.3, -51.3], [-17.9, -45.2], [-37.8, -47.0]],
  [[-6.8, -43.7], [-6.2, -50.0], [13.9, -48.0], [13.3, -41.7]],
  [[36.0, -35.6], [37.9, -41.7], [57.5, -35.8], [55.6, -29.7]],
]
for (const h of HOUSES) {
  const ring = area(h) < 0 ? [...h].reverse() : h
  prism({ wall: stone, win: null, roof, ring, z0: 13.0, z1: 18.3, facade: null, bevel: 0.25 })
  capPoly(stone, ring, 13.0, false)
  prism({ wall: orange, win: null, roof: null, ring, z0: 12.0, z1: 13.0, facade: null, bevel: 0.25 })
  capPoly(win, ring, 12.0, false)
  // The opening in the main face behind: the house's width less a metre each side.
  // Find the house edge that lies on the outline (the back edge) and open the wall under it.
  let best: [XY, XY] | null = null, bestD = 1e9
  for (const [a, b] of edgesOf(ring)) {
    const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const d = Math.min(...SOUTH.slice(0, -1).map((p, i) => {
      const q = SOUTH[i + 1], len = L(p, q), t = Math.max(0, Math.min(1, ((m[0] - p[0]) * (q[0] - p[0]) + (m[1] - p[1]) * (q[1] - p[1])) / (len * len)))
      return Math.hypot(m[0] - p[0] - t * (q[0] - p[0]), m[1] - p[1] - t * (q[1] - p[1]))
    }))
    if (d < bestD) { bestD = d; best = [a, b] }
  }
  const [a, b] = best!, len = L(a, b)
  // The back edge runs the house's way round; face it outwards (south) by swapping.
  const f = wallFrame(b, a, 0.06)
  face(win, [f.at(1.0, 0), f.at(len - 1.0, 0), f.at(len - 1.0, 12.0), f.at(1.0, 12.0)], f.n)
}

// Towers at the ends and the roof block.
prism({ wall: stone, win: null, roof, ring: [[-41.5, -43.5], [-35.8, -42.8], [-37.1, -32.1], [-42.7, -32.8]], z0: 0, z1: 27.5, facade: null, bevel: 0.3 })
// The east end is glass-clad (seen at the edge of street photos of the Battery Maritime Building).
{
  const t: XY[] = [[44.9, -6.4], [50.9, -25.8], [56.7, -24.0], [53.1, -12.4], [50.7, -4.6]]
  // grown 0.12 m so its walls don't share a plane with the slip building's
  prism({ wall: glass, win: null, roof, ring: grow(area(t) < 0 ? [...t].reverse() : t, 0.12), z0: 0, z1: 27.2, facade: null, bevel: 0.3 })
}
prism({ wall: stone, win: null, roof, ring: [[-2.0, -35.0], [18.0, -33.0], [17.0, -22.6], [-2.0, -24.4]], z0: FLAT, z1: 26.5, facade: null, bevel: 0.3 })

// ===========================================================================
// The plaza canopy (way/213847700) on columns, and the letters on it
// ===========================================================================
const CANOPY: XY[] = [
  [39.4, 19.9], [34.7, 29.3], [32.1, 34.6], [30.8, 37.1], [28.3, 42.6], [20.1, 58.5], [19.2, 61.2], [18.8, 62.4], [18.4, 66.0], [18.5, 70.0],
  [17.9, 72.9], [16.5, 75.1], [14.7, 77.0], [12.1, 78.4], [10.9, 78.8], [9.6, 79.1], [7.7, 79.1], [5.3, 78.9], [3.3, 78.0], [0.9, 76.2],
  [-0.9, 74.1], [2.1, 70.9], [3.7, 72.3], [5.4, 73.5], [7.5, 74.2], [9.1, 74.1], [11.6, 73.3], [13.0, 71.4], [13.6, 68.8], [12.8, 66.6],
  [11.5, 64.6], [9.9, 62.9], [8.9, 62.2], [8.0, 61.5], [5.3, 60.9], [2.8, 60.7], [-2.8, 61.0], [-16.4, 62.1], [-19.4, 62.9], [-21.3, 64.4],
  [-21.7, 65.5], [-22.2, 66.9], [-22.2, 69.1], [-21.2, 71.3], [-16.9, 76.8], [-15.1, 79.8], [-13.8, 83.1], [-13.3, 86.3], [-13.5, 89.7],
  [-14.1, 93.2], [-15.5, 96.8], [-17.3, 99.5], [-19.7, 102.2], [-25.5, 107.3], [-51.7, 130.3], [-53.9, 127.8], [-54.8, 126.9], [-55.2, 126.4],
  [-24.4, 99.5], [-22.0, 97.1], [-19.9, 94.1], [-18.6, 90.4], [-18.5, 85.7], [-19.2, 82.5], [-20.7, 79.6], [-22.8, 77.0], [-37.0, 58.4],
  [-44.8, 47.7], [-50.9, 39.5], [-51.6, 37.3], [-51.3, 34.4], [-46.6, 23.3], [-44.3, 18.0], [-42.3, 13.3], [-40.7, 9.6], [-39.3, 30.0],
  [-27.0, 51.1], [-25.4, 53.9], [-3.7, 51.6], [18.2, 49.3], [44.9, -6.4], [50.7, -4.6], [42.2, 18.7], [41.5, 20.6],
]
// The canopy's front along the plaza (OSM: nearly straight from (50.7, -4.6) to (19.2, 61.2)) is drawn
// as a gentle arc bulging 3 m towards the plaza, as the photos show it curving round the front.
const ARC_A: XY = [50.7, -4.6], ARC_B: XY = [19.2, 61.2], BULGE = 3.0
const arcCircle = (() => {
  const m: XY = [(ARC_A[0] + ARC_B[0]) / 2, (ARC_A[1] + ARC_B[1]) / 2], c = L(ARC_A, ARC_B) / 2
  const dx = (ARC_B[0] - ARC_A[0]) / (2 * c), dy = (ARC_B[1] - ARC_A[1]) / (2 * c), nx = dy, ny = -dx // towards the plaza (east)
  const R = (c * c + BULGE * BULGE) / (2 * BULGE)
  const ctr: XY = [m[0] - nx * (R - BULGE), m[1] - ny * (R - BULGE)]
  const a0 = Math.atan2(ARC_A[1] - ctr[1], ARC_A[0] - ctr[0]), a1 = Math.atan2(ARC_B[1] - ctr[1], ARC_B[0] - ctr[0])
  return { ctr, R, a0, a1 }
})()
const arcAt = (t: number, inset = 0): XY => {
  const { ctr, R, a0, a1 } = arcCircle, a = a0 + (a1 - a0) * t
  return [ctr[0] + (R - inset) * Math.cos(a), ctr[1] + (R - inset) * Math.sin(a)]
}
{
  const i6 = CANOPY.findIndex((p) => p[0] === 19.2 && p[1] === 61.2), iE = CANOPY.findIndex((p) => p[0] === 44.9 && p[1] === -6.4)
  const front = Array.from({ length: 11 }, (_, k) => arcAt((k + 1) / 12))
  CANOPY.splice(0, CANOPY.length, ...front, ...CANOPY.slice(i6, iE + 1), ARC_A)
}
const C0 = 7.0, C1 = 8.3
{
  for (const [i, j, k] of earClip(CANOPY)) {
    const at = (q: XY, z: number): V3 => [q[0], q[1], z]
    roof.tri(at(CANOPY[i], C1), at(CANOPY[j], C1), at(CANOPY[k], C1))
    roof.tri(at(CANOPY[i], C0), at(CANOPY[k], C0), at(CANOPY[j], C0))
  }
  const ring = area(CANOPY) < 0 ? [...CANOPY].reverse() : CANOPY
  for (const [a, b] of edgesOf(ring)) {
    const f = wallFrame(a, b, 0)
    face(stone, [[a[0], a[1], C0], [b[0], b[1], C0], [b[0], b[1], C1], [a[0], a[1], C1]], f.n) // the stainless fascia
  }
  // Columns: under the canopy's outer edge, every ~12 m, set a metre in from it towards the inner edge.
  const iN = CANOPY.findIndex((p) => p[0] === -55.2), outer = CANOPY.slice(0, iN + 1), inner = CANOPY.slice(iN + 1)
  let last: XY | null = null
  for (const p of outer) {
    if (last && L(last, p) < 12) continue
    let q = inner[0]
    for (const r of inner) if (L(p, r) < L(p, q)) q = r
    const t = Math.min(0.5, 1.2 / Math.max(L(p, q), 1.2))
    const c: XY = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]
    const rs = (z: number) => circle(c[0], c[1], 0.4, 8).map(([x, y]) => [x, y, z] as V3)
    stone.loft([rs(PLAZA - 0.5), rs(C0)])
    last = p
  }
}

// STATEN ISLAND FERRY: the real sign's letters, standing on the canopy and following its curved front.
// Traced from the Ajay Suresh and Charles Smith photos: a geometric sans of medium weight (stroke about
// 0.16 of the cap height), letters about 0.6 of the cap height wide with round bowls on S, D and R,
// a pointed A with a low bar, tight spacing. Stainless sides and rims, dark faces (the faces carry blue
// neon at night; drawn in the window slate).
{
  const E = 0.08 // half the stroke, so outer edges land on the letter box
  const G: Record<string, { w: number; draw: (p: Pen, w: number) => void }> = {
    S: { w: 0.62, draw: (p, w) => { p.moveTo([w - E, 0.8]).cubicTo([w - E, 0.97], [E, 0.99], [E, 0.75]).cubicTo([E, 0.5], [w - E, 0.52], [w - E, 0.27]).cubicTo([w - E, 0.01], [E, 0.03], [E, 0.2]) } },
    T: { w: 0.62, draw: (p, w) => { p.moveTo([0, 1 - E]).lineTo([w, 1 - E]); p.moveTo([w / 2, 1 - E]).lineTo([w / 2, 0]) } },
    A: { w: 0.7, draw: (p, w) => { p.moveTo([E * 0.6, 0]).lineTo([w / 2, 1 - E * 0.4]).lineTo([w - E * 0.6, 0]); p.moveTo([0.22 * w, 0.3]).lineTo([0.78 * w, 0.3]) } },
    E: { w: 0.52, draw: (p, w) => { p.moveTo([w, 1 - E]).lineTo([E, 1 - E]).lineTo([E, E]).lineTo([w, E]); p.moveTo([E, 0.52]).lineTo([0.9 * w, 0.52]) } },
    N: { w: 0.66, draw: (p, w) => { p.moveTo([E, 0]).lineTo([E, 1 - E * 0.5]).lineTo([w - E, E * 0.5]).lineTo([w - E, 1]) } },
    I: { w: 0.16, draw: (p, w) => { p.moveTo([w / 2, 0]).lineTo([w / 2, 1]) } },
    L: { w: 0.5, draw: (p, w) => { p.moveTo([E, 1]).lineTo([E, E]).lineTo([w, E]) } },
    D: { w: 0.66, draw: (p, w) => { p.moveTo([E, E]).lineTo([E, 1 - E]).lineTo([0.4 * w, 1 - E]).cubicTo([w - E + 0.04, 1 - E], [w - E + 0.04, E], [0.4 * w, E]).lineTo([E, E]) } },
    F: { w: 0.5, draw: (p, w) => { p.moveTo([w, 1 - E]).lineTo([E, 1 - E]).lineTo([E, 0]); p.moveTo([E, 0.5]).lineTo([0.88 * w, 0.5]) } },
    R: { w: 0.62, draw: (p, w) => { p.moveTo([E, 0]).lineTo([E, 1 - E]).lineTo([0.5 * w, 1 - E]).cubicTo([w - E + 0.03, 1 - E], [w - E + 0.03, 0.47], [0.5 * w, 0.47]).lineTo([E, 0.47]); p.moveTo([0.48 * w, 0.47]).lineTo([w - E * 0.6, 0]) } },
    Y: { w: 0.66, draw: (p, w) => { p.moveTo([E * 0.6, 1]).lineTo([w / 2, 0.46]).lineTo([w - E * 0.6, 1]); p.moveTo([w / 2, 0.46]).lineTo([w / 2, 0]) } },
  }
  const text = 'STATEN ISLAND FERRY', GAP = 0.12, SPACE = 0.42
  const pen = new Pen()
  let u = 0
  for (const ch of text) {
    if (ch === ' ') { u += SPACE; continue }
    const g = G[ch], one = new Pen()
    g.draw(one, g.w)
    pen.add(one, u)
    u += g.w + GAP
  }
  const width = u - GAP
  // Along the arc, 2 m in from the canopy's front: arc length per cap height H.
  const H = 6.0, inset = 2.0
  const { R, a0, a1 } = arcCircle, Ri = R - inset, span = Math.abs(a1 - a0) * Ri
  const start = Math.max(0.5, (span - width * H) / 2 + 2.5) // shifted a little towards the north corner, as in the photos
  const place = (uu: number, v: number, w: number): V3 => {
    const t = (start + uu * H) / span
    const p = arcAt(t, inset), q = arcAt(t, inset - 1) // q: one metre further out (towards the reader)
    const ox = q[0] - p[0], oy = q[1] - p[1]
    return [p[0] + ox * w, p[1] + oy * w, C1 + v * H]
  }
  strokes(stone, pen.paths as Pt[][], { width: 0.19, depth: 0.7, place, back: true })
  strokes(win, pen.paths as Pt[][], { width: 0.11, depth: 0.74, place: (uu, v, w) => place(uu, v, w) })
}

finishModel('Staten Island Ferry Whitehall Terminal', 'nyc-whitehall-terminal', [
  { part: stone, material: PALETTE.stone },
  { part: glass, material: windowVariant(2, 0x8fbab4) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: orange, material: finish('ferry-orange', 0xe0884e) },
  { part: solar, material: finish('whitehall-solar', 0x5d6d80) },
], { bearing: 0, osm: 'way/38868195', height: 31.5 }, 6500)
