/**
 * Missouri History Museum, Forest Park, St. Louis — the Jefferson Memorial
 * Building (1913, Isaac S. Taylor; the first national monument to Thomas
 * Jefferson, on the 1904 World's Fair's main entrance) and the Emerson
 * Center addition behind it (2000, Hellmuth, Obata + Kassabaum) —
 * procedural, CC0-1.0, no textures.  bun generators/stl-missouri-history-museum.ts
 *
 * Map frame: x along the front (east, a little south), y toward the front
 * (Lindell Boulevard, north), z up, metres. Bearing 7.3°: the long walls of
 * OSM relation/20071806 run at 97.3°. Anchor -90.2858171, 38.6451656: the
 * area centroid of the relation's outer way/73906333.
 *
 * OSM: one multipolygon covers both buildings — the outer way and two inner
 * ways, the two open courts between the 1913 building's front range and its
 * rear range (x ±9 to ±43.5, y 0 to 12.4; the lidar shows ground and trees
 * in them). The model draws all of it, so it replaces the relation only.
 * The 1913 building is the part north of y -15.8; the 2000 addition is the
 * curved block south of it.
 *
 * Measured (USGS lidar USGS_LPC_MO_StLouis_2017_LAS_2018, flown 2017–18,
 * 1 m grid, above the lowest ground at the front corners; the back stands
 * 0.9 m higher; all lifted 2.5 m in the model, see OFF below): the 1913 building's roof 12.6 all round its courts; the
 * central block 17.4 over the front loggia (its attic) and 15.8 over the
 * hall behind it (x -6 to 8, y -14 to 12); the addition 10.6, its central
 * entrance block 13.6.
 * Estimated from the photos (scaled from the 12.6 m cornice): the order
 * (six engaged Ionic columns 9 m tall on each front wing, the loggia's
 * columns), the two tiers of windows between them, the balustrade (1.2 m),
 * the base (1.8 m), the attic's eagles left out; the addition's glass wall
 * and its two sunshade bands, its stone end blocks.
 * Doubts: the central hall's roof is drawn as a low glass vault (the lidar
 * shows a raised strip 3 m over the roofs; no photo shows it); the east
 * and west ends and the back of the 1913 building are drawn from the front
 * wings' banding without their own photos.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   - "Missouri History Museum - Front 2012.JPG", Marcus Qwertyus,
 *     CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Missouri_History_Museum_-_Front_2012.JPG
 *     (the front from the north-west: west wing, end pavilion, loggia, attic);
 *   - "Missouri History Museum - Rear 2012.JPG", Marcus Qwertyus,
 *     CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Missouri_History_Museum_-_Rear_2012.JPG
 *     (the Emerson Center's glass south front, entrance block, stone ends);
 *   - "Missouri History Museum - panoramio (1).jpg", Bohao Zhao, CC BY 3.0,
 *     https://commons.wikimedia.org/wiki/File:Missouri_History_Museum_-_panoramio_(1).jpg
 *     (the west wing's colonnade close up).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, ccw, cornice, onWall, prism, rectShape, save, type XY } from './atl-tech-tower'
import { column } from './atl-flatiron-building'

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), glass = new Part(), panel = new Part()
const R = (x0: number, x1: number, y0: number, y1: number): XY[] => ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
const TOP = 12.6, CORN = 10.6, BASE = 1.8

// ── The 1913 building: front range, rear range, end ranges, central spine ──
const FRONT = ccw([[-47.5, 12.5], [-47.5, 15.2], [-50.9, 15.2], [-50.7, 26.6], [-46.9, 26.5], [-46.8, 29.8], [-15.2, 29.8], [-15.2, 28.1], [-9.3, 28.2], [-9.3, 30.4], [9.0, 30.3], [9.0, 28.0], [15.4, 27.8], [15.4, 29.7], [47.7, 29.6], [47.7, 27.1], [51.1, 27.1], [51.0, 14.9], [47.5, 14.9], [47.5, 12.4]])
const REAR = ccw([[-47.0, -15.8], [46.7, -15.8], [46.7, -11.9], [51.2, -12.0], [51.2, -0.2], [47.4, -0.1], [47.4, 0.4], [-47.5, 0.5], [-47.5, 0.0], [-50.9, 0.0], [-50.9, -12.0], [-47.1, -12.0]])
const PIECES: XY[][] = [FRONT, REAR, R(-45.9, -43.5, 0.2, 12.6), R(43.4, 45.9, 0.2, 12.5), R(-8.9, 9.1, 0.2, 12.5)]
for (const P of PIECES) {
  prism(stone, P, 0, CORN, null, 0)
  cornice(trim, P, CORN, 0.8, 0.5, null)
  prism(trim, P, CORN + 0.8, TOP, roof, 0.15) // the balustrade band and the roof inside it
  cornice(stone, P, BASE - 0.4, 0.4, 0.2, null) // the base's top
}

// Front wings: six engaged Ionic columns on each, with two tiers of windows
// between them (photos); the end pavilions with a window per floor.
for (const [x0, x1] of [[-45.4, -15.6], [15.8, 45.6]] as [number, number][]) {
  const n = 6, step = (x1 - x0) / (n - 1)
  for (let i = 0; i < n; i++) {
    const x = x0 + step * i
    column(trim, [x, 30.1], 0.6, BASE, CORN - 0.6, 10)
    box(trim, x - 0.85, x + 0.85, 29.5, 30.9, CORN - 0.7, CORN, null, 0.1) // capital
    if (i < n - 1) for (const [z0, z1] of [[2.6, 5.8], [6.4, 9.4]]) {
      onWall(win, [x + step / 2 + 1.0, 29.75], [x + step / 2 - 1.0, 29.75], rectShape(0, 2.0, z0, z1), 0.06) // tall narrow windows (photo)
    }
  }
}
// Windows on the ends and the back of the 1913 building, one per bay, two tiers.
function bays(a: XY, b: XY, bay: number, tiers: [number, number][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / bay)), w = L / n
  for (let i = 0; i < n; i++) for (const [z0, z1] of tiers) onWall(win, a, b, rectShape(i * w + w * 0.33, (i + 1) * w - w * 0.33, z0, z1), 0.06)
}
const TIERS: [number, number][] = [[2.6, 5.8], [6.4, 9.4]]
bays([-50.7, 26.6], [-50.9, 15.2], 5.7, TIERS) // west end pavilion (front half)
bays([51.0, 14.9], [51.1, 27.1], 6.1, TIERS) // east end pavilion
bays([-50.9, 0.0], [-50.9, -12.0], 6, TIERS)
bays([51.2, -12.0], [51.2, -0.2], 6, TIERS)
bays([-46.9, 26.5], [-50.7, 26.6], 3.8, TIERS) // the pavilions' fronts
bays([51.1, 27.1], [47.7, 27.1], 3.4, TIERS)
// the rear range's back wall where the addition doesn't cover it
bays([-47.0, -15.8], [-33.3, -15.8], 4.6, TIERS)
bays([32.0, -15.8], [46.7, -15.8], 4.9, TIERS)
// the courts' walls
for (const [x0, x1] of [[-43.5, -8.9], [9.1, 43.4]] as [number, number][]) {
  bays([x0, 12.4], [x1, 12.4], 5, TIERS) // the front range's back, facing the court (south)
  bays([x1, 0.2], [x0, 0.2], 5, TIERS) // the rear range's front, facing the court (north)
}

// The central loggia: two pylons, four columns between them on the front,
// the recessed wall with three doors, the attic above with its cornice.
box(stone, -9.3, -6.9, 28.2, 31.9, 0, CORN, null, 0.2)
box(stone, 6.7, 9.0, 28.0, 31.9, 0, CORN, null, 0.2)
box(trim, -9.3, 9.0, 30.4, 31.9, CORN - 1.4, CORN + 0.6, null, 0.15) // the loggia's entablature
for (let i = 0; i < 4; i++) {
  const x = -5.0 + i * 3.1
  column(trim, [x, 31.0], 0.62, BASE, CORN - 1.4, 10)
  box(trim, x - 0.85, x + 0.85, 30.3, 31.7, CORN - 2.1, CORN - 1.4, null, 0.1)
}
for (const x of [-3.4, -0.1, 3.2]) onWall(win, [x + 1.0, 28.2], [x - 1.0, 28.2], rectShape(0, 2.0, BASE, 5.8), 0.06)
for (let k = 0; k < 3; k++) box(stone, -8.5 + k * 0.3, 8.2 - k * 0.3, 31.9, 34.0 - k * 0.7, 0, 0.6 + k * 0.45, stone, 0.08) // steps
// the attic over the loggia (lidar 17.4)
box(stone, -9.3, 9.0, 14.0, 31.4, TOP, 17.4 - 0.9, null, 0)
cornice(trim, R(-9.3, 9.0, 14.0, 31.4), 17.4 - 0.9, 0.9, 0.5, roof)
onWall(trim, [9.0, 31.4], [-9.3, 31.4], rectShape(4.5, 13.8, 13.6, 15.6), 0.08) // the inscription panel

// The central hall behind it: a low glass vault over the roofs (lidar 15.8).
{
  const x0 = -6.2, x1 = 8.2, y0 = -14.5, y1 = 14.0, n = 8, r = (x1 - x0) / 2, xc = (x0 + x1) / 2, rise = 15.8 - TOP
  const P = (k: number, y: number): V3 => { const t = Math.PI * (k / n); return [xc - r * Math.cos(t), y, TOP + rise * Math.sin(t)] }
  for (let k = 0; k < n; k++) glass.quad(P(k, y0), P(k + 1, y0), P(k + 1, y1), P(k, y1))
  for (const [y, flip] of [[y0, false], [y1, true]] as [number, boolean][]) for (let k = 0; k < n; k++) {
    const c: V3 = [xc, y, TOP]
    if (flip) glass.tri(c, P(k, y), P(k + 1, y)); else glass.tri(c, P(k + 1, y), P(k, y))
  }
  for (let y = y0 + 3.5; y < y1; y += 3.5) for (let k = 0; k < n; k++) { // glazing ribs
    const a = P(k, y), b = P(k + 1, y)
    box(trim, Math.min(a[0], b[0]), Math.max(a[0], b[0]), y - 0.12, y + 0.12, Math.min(a[2], b[2]), Math.max(a[2], b[2]) + 0.12, trim, 0)
  }
}

// ── The Emerson Center addition (2000) ─────────────────────────────────────
const ADD = ccw([[32.0, -15.7], [32.0, -24.4], [38.2, -24.5], [38.3, -28.6], [33.1, -28.6], [33.0, -30.4], [26.1, -32.7], [20.0, -34.3], [14.5, -35.3], [9.4, -36.0], [5.0, -36.4], [5.1, -34.7], [-5.0, -34.6], [-5.1, -36.4], [-9.6, -35.9], [-15.8, -35.1], [-22.1, -33.9], [-28.1, -32.3], [-33.4, -30.3], [-33.4, -28.7], [-38.4, -28.7], [-38.4, -24.4], [-33.3, -24.3], [-33.3, -15.9]])
const AT = 10.6
prism(panel, ADD, 0, AT, roof, 0.2)
// the curved glass south front between the stone ends, with two sunshade bands
const ARC: XY[] = [[33.0, -30.4], [26.1, -32.7], [20.0, -34.3], [14.5, -35.3], [9.4, -36.0], [5.0, -36.4]]
const ARCW: XY[] = [[-5.1, -36.4], [-9.6, -35.9], [-15.8, -35.1], [-22.1, -33.9], [-28.1, -32.3], [-33.4, -30.3]]
for (const A of [ARC, ARCW]) for (let i = 0; i < A.length - 1; i++) {
  const a = A[i], b = A[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const [p, q] = ccwEdge(a, b)
  onWall(win, p, q, rectShape(0.15, L - 0.15, 0.8, AT - 1.0), 0.06)
  for (const z of [4.0, 7.4]) onWall(trim, p, q, rectShape(0, L, z, z + 0.35), 0.5)
}
// the entrance block at the middle of the curve (lidar 13.6), glazed
box(panel, -5.0, 5.1, -34.7, -24, AT - 0.2, 13.6, roof, 0.2)
onWall(win, [-5.0, -34.6], [5.1, -34.7], rectShape(0.8, 9.3, 0.6, 12.8), 0.07)
box(trim, -5.6, 5.7, -36.6, -34.6, 4.3, 4.6, trim, 0.05) // its canopy

/** The edge a→b oriented so onWall faces out of the addition's ring. */
function ccwEdge(a: XY, b: XY): [XY, XY] {
  const ccwRing = ADD
  const i = ccwRing.findIndex((p) => p[0] === a[0] && p[1] === a[1]), j = ccwRing.findIndex((p) => p[0] === b[0] && p[1] === b[1])
  return (j === (i + 1) % ccwRing.length) ? [a, b] : [b, a]
}

// The map's terrain (Mapterhorn) under the footprint dips 1.8–2.8 m below the
// ground round the building (terrain.ts grid; the lidar shows level ground,
// so it is an artefact of the bare-earth model under the building). The map
// stands y = 0 on that dip, so everything above the ground is lifted by OFF
// and the walls run down to y = 0: the building keeps its real height over
// the streets and lawns round it.
const OFF = 2.5
for (const part of [stone, trim, roof, win, glass, panel]) for (let k = 1; k < part.pos.length; k += 3) if (part.pos[k] > 0.01) part.pos[k] += OFF

const floodlit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.05 : p[1] > 20 && n[1] > 0.4 ? 0.8 : 0.3)
await save('stl-missouri-history-museum', 'Missouri History Museum', [
  { part: stone, material: { ...finish('mohist-limestone', 0xe6dfcf), floodlight: floodlit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: floodlit } },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
  { part: panel, material: finish('mohist-addition-stone', 0xcdbb9f) },
], { height: 17.4 + 2.5, anchor: [38.6451656, -90.2858171], bearing: 7.3, osm: 'relation/20071806' }, 6500)
