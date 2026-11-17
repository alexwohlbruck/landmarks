/**
 * Memorial Hall (Please Touch Museum), Fairmount Park, Philadelphia —
 * procedural, CC0-1.0, no textures.
 * bun generators/phl-memorial-hall.ts
 *
 * Map frame: x along the hall (east-south-east), y across it (north-north-
 * east), z up, metres. Placed at bearing 25.7, the turn of the OSM
 * outline's minimum rectangle; the anchor is the outline's area centroid
 * (lng -75.209047, lat 39.979462). The main front, with the entrance
 * pavilion, faces south-south-west (-y) towards the Centennial grounds; the
 * dome stands at (-8.15, 1.5), on the hall's axis of symmetry. z = 0 is the
 * ground round the hall (level to within half a metre).
 *
 * What it is: Hermann J. Schwarzmann's art gallery for the 1876 Centennial
 * Exhibition, the only major exhibition building left: a granite Beaux-Arts
 * hall 365 by 210 ft with a central entrance pavilion of three great
 * arches, open arcades either side, a corner pavilion at each corner, and
 * over the centre a glass-and-iron dome (green, ribbed) on a square base,
 * crowned by the statue of Columbia. It held the Pennsylvania Museum (the
 * Museum of Art's forerunner) until 1928; since 2008 the Please Touch
 * Museum. The display name is "Memorial Hall"; OSM names the building
 * "Please Touch Museum".
 *
 * Replaces: way/49916202 (the hall and its octagonal east annex; no parts).
 *
 * Evidence
 * - OSM way/49916202: the plan, used as drawn for the body (its corner
 *   pavilions, the projecting centres front and back) and the annex.
 * - USGS 3DEP lidar, USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown
 *   2015), 0.5 m, read in this frame, heights over the ground round the
 *   hall: side galleries 11-12, the raised centre halls 15-17, corner
 *   pavilions 18, the entrance pavilion and the dome's square base 20-21,
 *   the dome's springing 23-27, its crown 39, Columbia's head 44 (published 150
 *   ft, 45.7 m); dome 19-20 m across; the annex 9-11.
 * - Photos (Wikimedia Commons): "Memorial Hall - January 2010.jpg"
 *   (Frederikto, CC BY-SA 3.0: the whole south front, its symmetry, the
 *   three arches and the corner pavilions' great arched windows);
 *   "Memorial Hall on Beautiful Summer Day.jpg" (Oreos4everyone, CC BY-SA
 *   4.0: the entrance arches, paired columns, the arcade, the attic
 *   statues); "Philadelphia Memorial Hall 0013.jpg" (Foolish Productions
 *   Photography, CC BY-SA 4.0: the side wall's arched windows and
 *   balustrade, the green ribbed dome); "Memorial Hall in Fairmount Park,
 *   Philadelphia, PA.JPG" (Ngilmour3, CC BY-SA 3.0); HABS PA-1708-B /
 *   PA,51-PHILA,265B aerial views looking northwest and northeast (Jack E.
 *   Boucher, public domain: the roofs, the skylit halls, the annex).
 * - Published: Wikipedia "Memorial Hall (Philadelphia)", NHL nomination
 *   (365 x 210 ft, 150 ft to Columbia, granite, 1876).
 * - Estimated from the photos: arch and window sizes and counts, the front
 *   steps (1.5 m), the arcades' depth (dark recess 3 m), the dome's profile
 *   and ribs, the statues as plain blocks, the granite's colour.
 *
 * Doubts
 * - The rear (north) facade is drawn like the sides; no licensed photo of it
 *   was used. The four winged horse groups in front (Pegasus statues) stand
 *   apart on the plaza and are not drawn.
 * - The raised centre halls' roofs are drawn as glass hips from the lidar
 *   heights and the aerials; their exact form is not resolved.
 *
 * Night: the arched windows and entrance arches glow; the granite is
 * floodlit, the dome a little (estimated from the building's floodlighting
 * as seen in look-only night photos; no licensed night photo was used).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, cylinder, grow, panel, qf, rect, tf, type Rect } from './dc-white-house'
import { lathe, pslab, saveModel, type XY } from './dc-nga-west'

const granite = new Part(), roof = new Part(), dome = new Part(), win = new Part(), shade = new Part(), glass = new Part()
const XC = -8.15, YC = 1.5 // the axis of symmetry and the dome

// The OSM outline, in this frame (x = -v, y = u of the minimum rectangle).
const uv: [number, number][] = [[33.3, -7.4], [31.5, -7.4], [31.5, -29.1], [33.8, -29.4], [33.6, -45.4], [34.0, -45.4], [34.0, -50.8],
  [28.5, -50.8], [28.5, -50.5], [17.6, -50.8], [17.6, -48.0], [9.9, -48.0], [-9.3, -48.0], [-16.8, -48.0], [-16.8, -50.7],
  [-22.2, -50.7], [-22.2, -50.4], [-33.1, -50.7], [-32.8, -39.7], [-33.1, -39.7], [-33.1, -34.3], [-30.4, -34.3], [-30.0, -7.7],
  [-35.8, -7.5], [-35.8, -5.6], [-35.7, 8.4], [-35.6, 22.5], [-35.6, 23.0], [-30.2, 23.0], [-30.7, 48.0], [-33.2, 48.0], [-33.2, 53.4],
  [-32.8, 53.4], [-33.1, 64.2], [-22.3, 63.9], [-22.3, 64.3], [-16.7, 64.3], [-16.7, 62.0], [17.5, 62.0], [17.5, 64.2], [22.9, 64.2],
  [22.9, 63.9], [33.9, 64.2], [33.9, 58.8], [33.5, 58.8], [33.9, 47.9], [31.4, 47.9], [31.4, 21.9], [33.3, 21.9], [33.3, 8.4]]
const BODY: XY[] = uv.map(([u, v]) => [-v, u])
const ANNEX: XY[] = ([[9.9, -48.0], [9.9, -49.2], [16.9, -56.3], [17.0, -66.1], [9.9, -72.7], [9.9, -76.7], [-9.3, -76.7], [-9.3, -72.9],
  [-16.2, -65.9], [-16.2, -62.8], [-22.1, -62.8], [-22.1, -58.1], [-16.1, -58.1], [-16.1, -56.0], [-9.3, -49.3], [-9.3, -48.0]] as XY[]).map(([u, v]) => [-v, u] as XY)

/** Mirror a rect across the hall's axis x = XC. */
const mx = (r: Rect): Rect => rect(2 * XC - r.x1, 2 * XC - r.x0, r.y0, r.y1)

/** A semicircular-headed opening on a wall face (side 's' | 'n' | 'e' | 'w'), centred at c along it. */
function arch(p: Part, side: 's' | 'n' | 'e' | 'w', at: number, c: number, w: number, z0: number, top: number, seg = 8) {
  const r = w / 2, spring = top - r
  panel(p, side, at, c - r, c + r, z0, spring, 0.06)
  const o = side === 's' || side === 'w' ? -0.06 : 0.06
  const n: V3 = side === 's' ? [0, -1, 0] : side === 'n' ? [0, 1, 0] : side === 'e' ? [1, 0, 0] : [-1, 0, 0]
  const P = (a: number, z: number): V3 => (side === 's' || side === 'n' ? [a, at + o, z] : [at + o, a, z])
  for (let k = 0; k < seg; k++) {
    const t0 = (Math.PI * k) / seg, t1 = (Math.PI * (k + 1)) / seg
    tf(p, P(c, spring), P(c + r * Math.cos(t0), spring + r * Math.sin(t0)), P(c + r * Math.cos(t1), spring + r * Math.sin(t1)), n)
  }
}

// ---------------------------------------------------------------------------
// The body on the OSM plan: granite to the balustrade, a flat roof.
const WALL = 11.8
pslab(granite, BODY, 0, WALL, 0.25, roof)
pslab(granite, ANNEX, 0, 10.0, 0.2, roof)

// The raised centre halls: a clerestory under glass hips along the hall's
// length, and across it under the dome.
{
  const r = rect(XC - 46, XC + 46, YC - 13.5, YC + 12.5)
  cbox(granite, r, WALL, 14.6, { top: false })
  const g = grow(r, 0.3)
  roof.loft([[[g.x0, g.y0, 14.6], [g.x1, g.y0, 14.6], [g.x1, g.y1, 14.6], [g.x0, g.y1, 14.6]],
    [[g.x0 + 6, YC - 4, 17.0], [g.x1 - 6, YC - 4, 17.0], [g.x1 - 6, YC + 3, 17.0], [g.x0 + 6, YC + 3, 17.0]]])
  roof.cap([[g.x0 + 6, YC - 4, 17.0], [g.x1 - 6, YC - 4, 17.0], [g.x1 - 6, YC + 3, 17.0], [g.x0 + 6, YC + 3, 17.0]], true)
  // skylight strips on the two long slopes
  for (const s of [-1, 1]) for (const [a, b] of [[XC - 40, XC - 16], [XC + 16, XC + 40]]) {
    const y0 = s < 0 ? g.y0 + 2.5 : g.y1 - 2.5, y1 = s < 0 ? YC - 6 : YC + 5
    const z = (y: number) => 14.6 + ((Math.abs(y - (s < 0 ? g.y0 : g.y1))) / Math.abs((s < 0 ? YC - 4 : YC + 3) - (s < 0 ? g.y0 : g.y1))) * 2.4 + 0.05
    qf(glass, [a, y0, z(y0)], [b, y0, z(y0)], [b, y1, z(y1)], [a, y1, z(y1)], [0, s * 0.4, 1])
  }
}

// The two ends between the pavilions rise to 15 m (lidar), tall halls.
for (const s of [-1, 1]) {
  const r = s > 0 ? rect(XC + 42.4, XC + 56.2, -18, 18) : rect(XC - 56.2, XC - 42.4, -18, 18)
  cbox(granite, r, WALL - 0.2, 14.4, { top: false })
  cbox(granite, grow(r, 0.3), 14.4, 15.0, { b: 0.12, bottom: true, top: roof })
}

// The corner pavilions: square towers to 18 m, a great arched window on each outer face.
for (const r0 of [rect(XC + 42.4, XC + 58.6, -33.1, -20.0), rect(XC + 42.4, XC + 58.6, 20.0, 34.0)]) {
  for (const r of [r0, mx(r0)]) {
    cbox(granite, r, WALL - 0.2, 17.2, { top: false })
    cbox(granite, grow(r, 0.4), 17.2, 18.0, { b: 0.15, bottom: true, top: roof })
    const front = r.y0 < 0 ? 's' : 'n', fy = r.y0 < 0 ? r.y0 : r.y1, side = r.x0 > XC ? 'e' : 'w', sx = r.x0 > XC ? r.x1 : r.x0
    arch(win, front, fy, (r.x0 + r.x1) / 2, 6.2, 2.0, 13.4)
    arch(win, side, sx, (r.y0 + r.y1) / 2, 6.0, 2.0, 13.4)
    // a statue group on the attic's outer corner
    const cx = side === 'e' ? r.x1 - 1.6 : r.x0 + 1.6, cy = front === 's' ? r.y0 + 1.6 : r.y1 - 1.6
    cbox(granite, rect(cx - 1.0, cx + 1.0, cy - 1.0, cy + 1.0), 18.0, 19.0, { b: 0.1 })
    cbox(granite, rect(cx - 0.6, cx + 0.6, cy - 0.6, cy + 0.6), 19.0, 21.0, { b: 0.25 })
  }
}

// The south front between the pavilions: open arcades, five arches a side,
// in front of a dark recess.
for (const s of [-1, 1]) {
  const xa = XC + s * 15.0, xb = XC + s * 42.4
  const lo = Math.min(xa, xb), hi = Math.max(xa, xb)
  for (let k = 0; k < 5; k++) {
    const c = lo + ((hi - lo) * (k + 0.5)) / 5
    arch(shade, 's', -30.8, c, 3.4, 1.4, 9.0)
    arch(win, 's', -30.8 + 0.03, c, 2.2, 1.4, 7.8)
  }
}
// Arched windows down the sides and along the back.
for (const s of [-1, 1]) {
  const x = s > 0 ? XC + 56.2 : XC - 56.2, side = s > 0 ? 'e' : 'w'
  for (let k = 0; k < 4; k++) arch(win, side, x, -13.5 + (k * 27) / 3, 3.0, 3.0, 12.4)
}
for (const s of [-1, 1]) for (let k = 0; k < 6; k++) arch(win, 'n', 31.5, XC + s * (17.5 + k * 4.4), 3.2, 2.4, 10.6)

// The entrance pavilion: three great arches between paired columns, an
// attic with statues, the steps.
{
  const r = rect(XC - 15.0, XC + 15.6, -35.8, -14.0)
  cbox(granite, r, WALL - 0.2, 19.6, { top: false })
  cbox(granite, grow(r, 0.4), 19.6, 20.6, { b: 0.15, bottom: true, top: roof })
  const xc = (r.x0 + r.x1) / 2
  for (const k of [-1, 0, 1]) {
    arch(shade, 's', r.y0, xc + k * 8.6, 6.2, 1.5, 14.6)
    arch(win, 's', r.y0 + 0.03, xc + k * 8.6, 5.2, 1.5, 13.8)
  }
  for (const k of [-1.5, -0.5, 0.5, 1.5]) for (const d of [-0.6, 0.6]) {
    const x = xc + k * 8.6 + d
    cylinder(granite, x, r.y0 - 0.55, 0.42, 1.5, 12.6, 8)
    cbox(granite, rect(x - 0.55, x + 0.55, r.y0 - 1.1, r.y0), 12.6, 13.3, { bottom: true })
  }
  for (const x of [r.x0 + 1.4, r.x1 - 1.4]) {
    cbox(granite, rect(x - 1.1, x + 1.1, r.y0 + 0.3, r.y0 + 2.5), 20.6, 21.6, { b: 0.1 })
    cbox(granite, rect(x - 0.6, x + 0.6, r.y0 + 0.8, r.y0 + 2.0), 21.6, 24.2, { b: 0.3 })
  }
  // the steps up to the arches
  cbox(granite, rect(r.x0 - 1, r.x1 + 1, r.y0 - 4.2, r.y0), 0, 0.75, { b: 0.1 })
  cbox(granite, rect(r.x0 - 1, r.x1 + 1, r.y0 - 2.4, r.y0), 0.75, 1.5, { b: 0.1 })
}

// The dome: a square base with statues at its corners, the drum, the ribbed
// green dome and Columbia on its lantern.
{
  const b = rect(XC - 12, XC + 12, YC - 11.5, YC + 11.5)
  cbox(granite, b, 14.6, 20.0, { top: false })
  cbox(granite, grow(b, 0.4), 20.0, 20.8, { b: 0.15, bottom: true, top: roof })
  for (const [x, y] of [[b.x0 + 1.5, b.y0 + 1.5], [b.x1 - 1.5, b.y0 + 1.5], [b.x1 - 1.5, b.y1 - 1.5], [b.x0 + 1.5, b.y1 - 1.5]]) {
    cbox(granite, rect(x - 1.1, x + 1.1, y - 1.1, y + 1.1), 20.8, 22.2, { b: 0.1 })
    cbox(granite, rect(x - 0.6, x + 0.6, y - 0.6, y + 0.6), 22.2, 24.6, { b: 0.3 })
  }
  for (const s of ['s', 'n'] as const) arch(win, s, s === 's' ? b.y0 : b.y1, XC, 5.0, 14.8, 19.2)
  for (const s of ['e', 'w'] as const) arch(win, s, s === 'e' ? b.x1 : b.x0, YC, 5.0, 14.8, 19.2)
  lathe(granite, XC, YC, [[9.8, 20.8], [9.8, 22.4], [10.6, 22.4], [10.6, 23.0]], 16, false)
  const prof: [number, number][] = [[10.5, 23.0], [10.3, 26.0], [9.6, 29.4], [8.2, 32.5], [6.2, 35.2], [3.8, 37.4], [1.7, 38.8]]
  lathe(dome, XC, YC, prof, 16, false)
  // ribs: raised bands over the green
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4, ca = Math.cos(a), sa = Math.sin(a), w = 0.35
    for (let i = 0; i < prof.length - 1; i++) {
      const [r0, z0] = prof[i], [r1, z1] = prof[i + 1]
      const P = (r: number, z: number, d: number): V3 => [XC + (r + 0.12) * ca - d * sa, YC + (r + 0.12) * sa + d * ca, z]
      const n: V3 = [ca * (z1 - z0), sa * (z1 - z0), r0 - r1]
      const pa = P(r0, z0, -w), pb = P(r0, z0, w), pc = P(r1, z1, w), pd = P(r1, z1, -w)
      tf(granite, pa, pb, pc, n); tf(granite, pa, pc, pd, n)
    }
  }
  lathe(granite, XC, YC, [[1.7, 38.6], [1.7, 40.4], [2.1, 40.4], [2.1, 40.8], [0.9, 40.8], [0.9, 42.0]], 8, true)
  // Columbia: a slim figure on the lantern, bold enough to read
  lathe(dome, XC, YC, [[0.75, 42.0], [0.55, 43.4], [0.3, 44.2], [0.0, 44.6]], 8, false)
}

const lit = (_p: V3, n: V3) => (n[2] > 0.6 ? 0.1 : 0.6)
const GRANITE = { ...finish('mh-granite', 0xdcdbd3), floodlight: lit }
const DOME = { ...PALETTE.patina, floodlight: () => 0.35 }
if (import.meta.main) {
  await saveModel('phl-memorial-hall', 'Memorial Hall', [
    { part: granite, material: GRANITE },
    { part: roof, material: finish('mh-roof', 0x9aa1a6) },
    { part: dome, material: DOME },
    { part: win, material: PALETTE.window },
    { part: shade, material: finish('mh-shade', 0x8d8f8c) },
    { part: glass, material: PALETTE.glass },
  ], { source: 'generators/phl-memorial-hall.ts', bearing: 25.7, osm: 'way/49916202', footprint: [141, 70], height: 44.6 }, 5000)
}
