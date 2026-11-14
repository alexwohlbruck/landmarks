/**
 * The British Museum, Great Russell Street, London — procedural, CC0-1.0,
 * no textures. bun generators/london-british-museum.ts
 *
 * Writes models/london-british-museum.glb (low) and
 * models/london-british-museum.detail.glb (detail). Also holds the small
 * classical kit (`lodKit`, `ionic`, `entablature`, `prismPoly`, `facadeBays`,
 * `figure`) that london-national-gallery.ts imports: merge this one first.
 *
 * Map frame: x east, y north, z up, metres, turned to BEARING 325: +y (model
 * north) is compass 325°, so the Great Russell Street front faces model
 * south (compass 145°). Anchor: the area centroid of the outer ring of the
 * OSM multipolygon relation/177044 (lng -0.127114, lat 51.519371). The front's
 * symmetry axis is x = 13.9. z = 0 is 1.4 m below the forecourt, the level
 * of the street on the east (Montague Street) side, the lowest ground the
 * outline touches; the forecourt is ZF = 1.4.
 *
 * What makes it the British Museum, and how each is drawn
 * - Smirke's Greek Revival south front (1823–1852): a deep Ionic colonnade
 *   of 44 columns (OSM maps 46 shafts and the model draws those 46: 14 in
 *   the main row, the octastyle portico's front row of 8, and 12 round each
 *   projecting wing). Real round shafts (8 sides low, 12 detail) on plinths,
 *   with Ionic capitals (volute block and abacus; scroll drums in the
 *   detail) and the full entablature carried back to the walls, so the
 *   colonnade is a real deep loggia with shadow behind the columns.
 * - The portico: taller entablature, the pediment with Westmacott's group
 *   "The Progress of Civilisation" as standing and reclining figures in the
 *   tympanum, its lead gable roof running back over the range, the flagpole.
 * - The forecourt framed by the two projecting wings; the podium and the
 *   portico steps. The East and West Residences flank it.
 * - The Great Court roof (Foster + Partners, 2000): a shallow glass and steel
 *   surface rising from the four ranges round the quadrangle to the Reading
 *   Room drum, smooth-shaded, with a bold diamond lattice of frame members
 *   standing on it (24 x 5 cells low, 40 x 8 detail). Material `glass`.
 * - The round Reading Room (1857) in the middle: its drum, the pale
 *   grey-green dome and the glazed lantern.
 * - The rest of the block from the OSM building parts: the ranges round the
 *   court, the King Edward VII Galleries (north), the WCEC and west ranges,
 *   with lead roofs and long glazed roof lights, window bays on the street
 *   faces.
 *
 * Evidence
 * - OSM (ODbL): relation/177044 (building=museum, Grade I, NHLE 1130404,
 *   wikidata Q6373) and every building:part inside it (325 ways: 46 column
 *   shafts, 245 facets of the Great Court roof, the Reading Room and the
 *   ranges), all listed in `replaces`. Parts mapped by OSM but drawn only
 *   as the court beneath the glass: the four inner porticos of the court
 *   (way/1390726425..1390726432).
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (composite of flights ~2000-2022). Measured above the forecourt
 *   (the box's ground_min, 9.7 m AOD, is a basement area; forecourt 26.0 m
 *   AOD, Montague Street 1.4 m lower): colonnade and wings 20.2 m to the
 *   blocking course; portico raking eaves 22.0, ridge 26.4 m; ranges round
 *   the court 20.2; King Edward VII Galleries 24.7, its centre block 28.4;
 *   north-west range 21.4; east block 20.0; residences 16.9 to the ridge;
 *   Reading Room dome 32.7 at the lantern ring, 36.6 at the top. The glass
 *   roof is not in the last-return DSM (it reads the court floor, 2 m below
 *   the forecourt), so its heights come from the OSM roof facets (edge
 *   21.7-22, highest 27.0 m above the court floor) and are estimated here as
 *   20.4 at the edge rising to 25.4 at the drum, above the forecourt.
 * - Published: columns 45 ft (13.7 m) high, 44 in the colonnade (Wikipedia,
 *   "British Museum"; Historic England list entry 1130404); Great Court
 *   roof 2000, 3,312 glass panels (Wikipedia, "Great Court").
 * - Photos (Wikimedia Commons), each as evidence:
 *   "British Museum (aerial).jpg", Luke Massey & the Greater London National
 *   Park City Initiative, CC BY 2.0 (plan, roofs, court roof, dome colour);
 *   "The roof of the British Museum from tower of Senate House, University of
 *   London (46742488414).jpg", Orangeaurochs, CC BY 2.0 (court roof profile
 *   and dome from the north);
 *   "London - Great Russell Street - British Museum 1823 by Robert Smirke -
 *   ICE Photocompilation Viewing frm WSW to NNE on Neo-Classical Museum
 *   Front.jpg", Txllxt TxllxT, CC BY-SA 4.0 (front proportions; the portico
 *   entablature stands about 2.3 m above the colonnade's);
 *   "British Museum London 2016 Facade 02.JPG", Paasikivi, CC BY-SA 4.0;
 *   "British Museum from NE 2.JPG", Ham, CC BY-SA 3.0;
 *   "British Museum 2018.jpg", Tiia Monto, CC BY-SA 3.0 (east wing close up:
 *   capitals, windows, podium, stone colour).
 * - Estimated from the photos: podium 2.0 m, colonnade entablature 3.6 m,
 *   portico entablature 5.7 m, window sizes and heights, stone colour (a
 *   weathered buff-grey Portland stone, a little greyer than `stone`).
 * - Invented/simplified: the pediment figures are generic standing and
 *   seated forms in the real group's rhythm (tallest in the centre); the
 *   court's inner facades are not drawn (seen only through the glass); the
 *   backs and the service yards are plain walls with grouped windows.
 * - Look-only references: none.
 *
 * Night: the south front and portico are floodlit (`_FLOODLIGHT` on stone
 * and trim faces of the front); windows glow; the glass roof stays dark.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { writeModel } from './london-buckingham-palace'
import { cylinder, cbox, rect, qf, tf, hip, gable } from './dc-white-house'
import { capPoly, wallsPoly, ccw, type XY } from './dc-national-cathedral'
import { lathe, ellipsoid, smooth, TAU } from './nyc-columbus-monument'

export const ID = 'london-british-museum'
export const BEARING = 325

// ---------------------------------------------------------------------------
// Shared classical kit (also used by london-national-gallery.ts)
// ---------------------------------------------------------------------------

/** Level of detail switches. */
export type Lod = { hi: boolean; seg: number }
export const lodKit = (hi: boolean): Lod => ({ hi, seg: hi ? 12 : 8 })

/** Vertical prism over any simple polygon: walls and a flat top. */
export function prismPoly(wall: Part, top: Part | null, ring: XY[], z0: number, z1: number) {
  wallsPoly(wall, ring, z0, z1)
  if (top) capPoly(top, ring, z1, true)
}

/**
 * An Ionic column standing at (x, y) from z0 to z1 (capital top), shaft
 * radius r at the foot. The volute block is long along `ax` (a unit vector
 * in plan: the facade's direction).
 */
export function ionic(L: Lod, shaft: Part, cap: Part, x: number, y: number, z0: number, z1: number, r: number, ax: XY = [1, 0]) {
  const ex = Math.abs(ax[0]) > 0.5
  const wa = r * 1.55, wb = r * 1.15
  const [hx, hy] = ex ? [wa, wb] : [wb, wa]
  const zc = z1 - r * 1.05
  if (!L.hi) {
    // Low: an 8-sided smooth shaft and one capital block (volutes and abacus).
    cylinder(shaft, x, y, r, z0, zc, L.seg, r * 0.86)
    cbox(cap, rect(x - hx, x + hx, y - hy, y + hy), zc, z1)
    return
  }
  const pl = r * 1.3, ph = Math.min(0.45, (z1 - z0) * 0.035)
  cbox(cap, rect(x - pl, x + pl, y - pl, y + pl), z0, z0 + ph, { c: 0.08 })
  cylinder(cap, x, y, r * 1.14, z0 + ph, z0 + ph + 0.3, L.seg, r * 1.02)
  cylinder(shaft, x, y, r, z0 + ph + 0.3, zc, L.seg, r * 0.86)
  // Capital: volute block (wide along the facade), abacus, the two scroll drums.
  cbox(cap, rect(x - hx, x + hx, y - hy, y + hy), zc, z1 - r * 0.25, { c: 0.06 })
  cbox(cap, rect(x - r * 1.25, x + r * 1.25, y - r * 1.25, y + r * 1.25), z1 - r * 0.25, z1, { c: 0.05 })
  for (const s of [-1, 1]) {
    const cx = x + (ex ? s * wa : 0), cy = y + (ex ? 0 : s * wa)
    const n = 8, rr = r * 0.42, zc2 = zc + r * 0.32, half = (ex ? hy : hx) * 1.0
    for (let k = 0; k < n; k++) {
      const a0 = (TAU * k) / n, a1 = (TAU * (k + 1)) / n
      const P = (a: number, t: number): V3 => ex
        ? [cx + s * rr * 0.6 * Math.cos(a), y + t, zc2 + rr * Math.sin(a)]
        : [x + t, cy + s * rr * 0.6 * Math.cos(a), zc2 + rr * Math.sin(a)]
      const m = (a0 + a1) / 2
      const nrm: V3 = ex ? [s * Math.cos(m), 0, Math.sin(m)] : [0, s * Math.cos(m), Math.sin(m)]
      qf(cap, P(a0, -half), P(a1, -half), P(a1, half), P(a0, half), nrm)
    }
  }
}

/** A wall-face frame for panels: origin o, along-unit u, outward normal n (plan). */
export type Face = { o: XY; u: XY; n: XY; len: number }
export function faceOf(a: XY, b: XY): Face {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  return { o: a, u, n: [u[1], -u[0]], len: L }
}
export const fpt = (f: Face, s: number, z: number, d = 0): V3 => [f.o[0] + f.u[0] * s + f.n[0] * d, f.o[1] + f.u[1] * s + f.n[1] * d, z]
/** A flat panel on a face. */
export function fpanel(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d = 0.06) {
  qf(p, fpt(f, s0, z0, d), fpt(f, s1, z0, d), fpt(f, s1, z1, d), fpt(f, s0, z1, d), [f.n[0], f.n[1], 0])
}
/** A block standing proud of a face (front, ends, top, optional soffit). */
export function fblock(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number, soffit = false) {
  const n: V3 = [f.n[0], f.n[1], 0], u: V3 = [f.u[0], f.u[1], 0]
  qf(p, fpt(f, s0, z0, d1), fpt(f, s1, z0, d1), fpt(f, s1, z1, d1), fpt(f, s0, z1, d1), n)
  qf(p, fpt(f, s0, z1, d0), fpt(f, s1, z1, d0), fpt(f, s1, z1, d1), fpt(f, s0, z1, d1), [0, 0, 1])
  qf(p, fpt(f, s0, z0, d0), fpt(f, s0, z0, d1), fpt(f, s0, z1, d1), fpt(f, s0, z1, d0), [-u[0], -u[1], 0])
  qf(p, fpt(f, s1, z0, d0), fpt(f, s1, z0, d1), fpt(f, s1, z1, d1), fpt(f, s1, z1, d0), u)
  if (soffit) qf(p, fpt(f, s0, z0, d0), fpt(f, s1, z0, d0), fpt(f, s1, z0, d1), fpt(f, s0, z0, d1), [0, 0, -1])
}

/**
 * Window bays along every outward edge of a ring longer than `minLen`:
 * panels `w` wide, `bay` apart, between z0 and z1, with a hood band in
 * `hood` when given. `keep` filters edges by their outward normal/midpoint.
 */
export function facadeBays(win: Part, hood: Part | null, ring: XY[], z0: number, z1: number, o: { bay: number; w: number; minLen?: number; keep?: (f: Face, mid: XY) => boolean; margin?: number }) {
  const R = ccw(ring)
  for (let i = 0; i < R.length; i++) {
    const a = R[i], b = R[(i + 1) % R.length]
    const f = faceOf(a, b)
    if (f.len < (o.minLen ?? 8)) continue
    const mid: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    if (o.keep && !o.keep(f, mid)) continue
    const m = o.margin ?? 2
    const n = Math.max(1, Math.floor((f.len - 2 * m) / o.bay))
    const step = (f.len - 2 * m) / n
    for (let k = 0; k < n; k++) {
      const s = m + step * (k + 0.5)
      fpanel(win, f, s - o.w / 2, s + o.w / 2, z0, z1)
      if (hood) fblock(hood, f, s - o.w / 2 - 0.25, s + o.w / 2 + 0.25, z1 + 0.15, z1 + 0.5, 0, 0.3)
    }
  }
}

/**
 * A bold relief figure for a pediment or attic: standing (h tall) or
 * reclining (lying along `ax`), at (x, y, z) on a face whose outward
 * normal is `n`. Torso, head, legs or drapery, an arm.
 */
export function figure(p: Part, c: V3, h: number, n: XY, pose: 'stand' | 'seat' | 'lie', lean = 0, lo = false) {
  const E = (q: V3, rr: V3, a: number, b: number, yaw: number, pitch = 0) => ellipsoid(p, q, rr, lo ? 4 : a, lo ? 2 : b, yaw, pitch)
  const u: XY = [-n[1], n[0]]
  const P = (s: number, d: number, z: number): V3 => [c[0] + u[0] * s + n[0] * d, c[1] + u[1] * s + n[1] * d, c[2] + z]
  const yaw = Math.atan2(u[1], u[0])
  if (pose === 'lie') {
    // Body lying along the face, propped on one arm, head up at one end.
    E(P(0, 0.2, h * 0.16), [h * 0.42, h * 0.16, h * 0.15], 6, 3, yaw)
    E(P(-lean * h * 0.42, 0.2, h * 0.36), [h * 0.09, h * 0.09, h * 0.1], 5, 3, yaw)
    return
  }
  const sit = pose === 'seat'
  const legH = sit ? h * 0.3 : h * 0.46
  // Legs / drapery as a tapered block, torso, head, an arm raised or lowered.
  E(P(sit ? 0.12 * h : 0, 0.18, legH / 2), [h * (sit ? 0.2 : 0.15), h * 0.14, legH / 2], 6, 3, yaw)
  E(P(lean * h * 0.08, 0.2, legH + h * 0.2), [h * 0.16, h * 0.12, h * 0.23], 6, 3, yaw)
  E(P(lean * h * 0.12, 0.22, legH + h * 0.5), [h * 0.09, h * 0.09, h * 0.1], 5, 3, yaw)
  E(P(lean * h * 0.2 + h * 0.16, 0.24, legH + h * 0.28), [h * 0.05, h * 0.05, h * 0.2], 4, 2, yaw, lean * 0.6)
}

// ---------------------------------------------------------------------------
// The museum
// ---------------------------------------------------------------------------

const ZF = 1.4 // forecourt above z = 0
const CX = 13.9 // the front's axis
const mx = (x: number) => 2 * CX - x

// OSM building parts (model frame, simplified to 0.4 m) and their heights
// above the forecourt (lidar unless noted).
const P_FRONT: XY[] = [[51.1, -49.8], [-22.3, -49.9], [-41.3, -49.2], [-41.3, -48.1], [-66.7, -48.0], [-66.7, -63.4], [-40.6, -63.3], [-40.6, -62.3], [-37.3, -62.3], [-37.5, -69.5], [-79.3, -69.3], [-79.5, -83.0], [-37.1, -83.6], [-37.1, -94.9], [-21.6, -94.9], [-21.6, -70.0], [49.4, -70.0], [49.4, -94.9], [64.9, -94.9], [64.9, -91.1], [65.6, -91.1], [65.6, -83.6], [64.3, -83.6], [64.5, -69.7], [70.7, -69.6], [70.7, -48.9]]
const P_CORE: XY[] = [[27.9, 82.5], [0.1, 82.6], [0.2, 67.9], [-66.0, 67.8], [-65.8, 54.5], [-54.8, 54.4], [-54.9, 50.2], [-50.1, 50.2], [-50.2, 54.4], [-42.2, 54.3], [-42.3, 47.2], [-36.1, 47.1], [-36.7, -49.4], [-22.3, -49.9], [-22.6, 47.3], [50.7, 47.5], [51.1, -49.8], [65.5, -48.9], [65.8, -10.1], [67.8, -10.1], [68.0, 13.4], [65.8, 13.4], [65.8, 46.5], [69.4, 46.4], [69.5, 56.8], [67.3, 56.9], [67.3, 68.0], [28.0, 68.3]]
type Blk = { ring: XY[]; h: number; roof?: 'hip' | 'gableY'; eave?: number; win?: boolean }
const BLOCKS: Blk[] = [
  { ring: P_CORE, h: 20.2 },
  // north-west range (way/1389773613)
  { ring: [[-65.9, 70.1], [-6.9, 70.5], [-6.7, 74.8], [-2.2, 74.8], [-2.1, 87.9], [-58.0, 88.0], [-58.2, 93.8], [-46.9, 93.7], [-47.1, 111.8], [-49.0, 111.8], [-49.1, 117.1], [-53.7, 117.0], [-53.7, 112.1], [-71.2, 112.1], [-71.0, 88.1], [-79.9, 88.1], [-80.0, 69.5], [-80.8, 69.5], [-80.9, 64.9], [-68.9, 65.0], [-68.8, 70.1]], h: 21.4, win: true },
  // King Edward VII Galleries (way/1389773617) and centre block (way/1390420037)
  { ring: [[60.9, 91.7], [61.6, 90.5], [66.0, 89.5], [73.0, 89.3], [74.1, 92.1], [72.6, 93.6], [72.5, 110.5], [-44.6, 110.4], [-44.5, 93.3], [-46.1, 91.0], [-44.7, 88.7], [-42.0, 89.1], [-41.5, 90.2], [-33.9, 90.2], [-33.9, 91.6], [0.1, 91.8], [0.1, 92.9], [27.9, 92.9], [27.9, 91.5]], h: 24.7 },
  { ring: [[0.1, 82.6], [27.9, 82.5], [27.9, 92.9], [21.4, 92.9], [21.5, 95.8], [16.9, 95.8], [16.9, 92.9], [0.1, 92.9]], h: 28.4 },
  // east block (way/1389773609)
  { ring: [[70.7, -62.0], [95.3, -61.9], [95.3, -69.5], [64.5, -69.7], [64.9, -81.2], [68.9, -81.3], [69.0, -82.7], [103.3, -82.8], [103.4, -81.8], [109.2, -81.9], [108.9, -75.8], [109.9, -75.8], [109.6, -49.3], [109.1, -49.3], [109.0, -43.6], [86.8, -43.4], [86.8, -49.0], [70.7, -48.9]], h: 20.0, win: true },
  // west ranges (way/1390409119, 1390409116..118, 1390420034..36)
  { ring: [[-68.3, -38.2], [-68.3, -45.5], [-66.7, -45.5], [-66.7, -48.0], [-41.3, -48.1], [-41.3, -49.2], [-36.7, -49.4], [-36.1, 47.1], [-42.3, 47.2], [-42.2, 54.3], [-50.2, 54.4], [-50.1, 50.2], [-54.9, 50.2], [-54.8, 54.4], [-65.8, 54.5], [-65.8, 38.6], [-67.4, 38.6], [-67.5, 25.4], [-72.1, 25.5], [-72.4, -22.6], [-67.5, -22.6], [-67.5, -38.2]], h: 15.0 },
  { ring: [[-87.4, -22.7], [-79.6, -29.7], [-72.4, -22.6], [-72.1, 25.5], [-79.5, 32.4], [-87.7, 25.4]], h: 17.4, roof: 'gableY', eave: 13.4, win: true },
  { ring: [[-92.4, 40.6], [-92.2, 25.3], [-67.5, 25.4], [-67.4, 40.5]], h: 18.0, roof: 'hip', eave: 13.6, win: true },
  { ring: [[-92.2, -37.9], [-67.5, -38.2], [-67.5, -22.6], [-92.3, -22.7]], h: 18.0, roof: 'hip', eave: 13.6, win: true },
  { ring: [[-83.8, -62.4], [-70.0, -62.5], [-69.9, -48.5], [-83.7, -48.5]], h: 8.1, win: true },
  { ring: [[-68.3, -38.2], [-86.8, -38.0], [-86.6, -44.8], [-68.3, -45.0]], h: 8.6 },
  { ring: [[-55.5, -4.8], [-55.5, -17.6], [-42.8, -17.9], [-42.9, -4.9]], h: 19.2 },
  // south-west block (way/1390409113)
  { ring: [[-83.8, -62.4], [-83.9, -87.2], [-72.3, -87.6], [-72.3, -89.9], [-37.1, -90.7], [-37.1, -83.6], [-79.5, -83.0], [-79.3, -69.3], [-37.5, -69.5], [-37.3, -62.3], [-40.6, -62.3], [-40.6, -63.3], [-66.7, -63.4], [-66.7, -62.6]], h: 13.0, win: true },
  // low east and north links (way/1389773608, 1390420033, 1390420038..40), inner roof (way/1390409115)
  { ring: [[70.7, -69.6], [95.3, -69.5], [95.3, -61.9], [70.7, -62.0]], h: 9.0 },
  { ring: [[65.6, -91.1], [86.6, -91.3], [86.6, -89.9], [87.6, -89.9], [87.5, -84.0], [76.8, -84.1], [76.8, -87.9], [65.5, -87.6]], h: 5.0 },
  { ring: [[27.9, 80.2], [31.4, 80.2], [31.4, 76.3], [63.9, 75.9], [63.7, 89.6], [31.4, 89.9], [31.4, 83.8], [27.9, 83.9]], h: 4.5 },
  { ring: [[67.3, 68.0], [71.1, 68.0], [70.0, 89.8], [66.0, 89.5]], h: 7.0 },
  { ring: [[65.5, -48.9], [70.7, -48.9], [71.1, 68.0], [67.3, 68.0], [67.3, 56.9], [69.5, 56.8], [69.4, 46.4], [65.8, 46.5], [65.8, 13.4], [68.0, 13.4], [67.8, -10.1], [65.8, -10.1]], h: 7.0 },
  { ring: [[-66.0, 67.8], [0.2, 67.9], [0.1, 82.6], [-2.3, 82.5], [-2.2, 74.8], [-6.7, 74.8], [-6.9, 70.5], [-65.9, 70.1]], h: 20.3 },
]
// The East and West Residences (way/1389773610, way/1389773611), flanking the forecourt.
const RES_W: XY[] = [[-58.3, -90.5], [-74.2, -89.8], [-74.2, -125.2], [-58.5, -125.4]]
const RES_E: XY[] = [[86.6, -125.4], [102.0, -125.4], [102.1, -117.5], [103.6, -117.5], [103.5, -97.9], [102.5, -98.0], [102.1, -90.0], [99.1, -89.8], [99.1, -85.6], [96.3, -84.2], [92.5, -84.2], [89.7, -86.1], [87.6, -86.1], [87.6, -89.9], [86.6, -89.9]]

// The Great Court and the Reading Room.
const GC = { x0: -22.4, x1: 50.9, y0: -49.8, y1: 47.4 }
const RC: XY = [14.3, 1.3], RR = 22.2

const OSM_PARTS = `37909796 1389773608 1389773609 1389773610 1389773611 1389773612 1389773613 1389773614 1389773615 1389773617
1389773618-1389773665 1390409113 1390409115-1390409119 1390420033-1390420040 1390441933-1390442176 1390726425-1390726433`

export function replacesList(): string[] {
  const out = ['relation/177044']
  for (const tok of OSM_PARTS.split(/\s+/).filter(Boolean)) {
    const [a, b] = tok.split('-').map(Number)
    for (let i = a; i <= (b ?? a); i++) out.push(`way/${i}`)
  }
  return out
}

function build(hi: boolean) {
  const L = lodKit(hi)
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), glass = new Part(), dome = new Part()

  // ===== Massing from the OSM parts ======================================
  for (const b of BLOCKS) {
    const zt = ZF + (b.roof ? b.eave! : b.h)
    prismPoly(stone, b.roof ? null : roof, b.ring, 0, zt)
    if (!b.roof) {
      // A parapet lip so the roof edge reads.
      if (hi && b.h > 12) wallsPoly(trim, b.ring, zt - 0.6, zt)
    } else {
      const xs = b.ring.map((p) => p[0]), ys = b.ring.map((p) => p[1])
      const r = rect(Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys))
      capPoly(roof, b.ring, zt, true)
      if (b.roof === 'hip') hip(roof, r, zt, ZF + b.h, Math.min(r.x1 - r.x0, r.y1 - r.y0) * 0.45)
      else gable(roof, stone, rect(r.x0 + 1.5, r.x1 - 1.5, r.y0 + 2, r.y1 - 2), zt, ZF + b.h, true)
    }
    if (b.win) facadeBays(win, null, b.ring, ZF + 4.2, ZF + Math.min(b.roof ? b.eave! : b.h, 20) - 3.2, { bay: hi ? 4.2 : 8, w: hi ? 1.7 : 3.2, minLen: hi ? 10 : 14, margin: 2.5 })
  }
  // The front range behind the colonnade (way/1389773615), to the blocking course.
  prismPoly(stone, roof, P_FRONT, 0, ZF + 20.2)

  // ===== South front =======================================================
  const POD = ZF + 2.0, COL = POD + 13.8, ENT = COL + 3.6, ATT = ZF + 20.2 + 0.4
  const PENT = COL + 5.7, PAPEX = ZF + 26.4
  const r = 0.72
  // Column positions: main row, portico front row, the two wings (mirrored).
  const cols: Array<{ x: number; y: number; ax: XY }> = []
  for (let k = 0; k < 7; k++) for (const s of [-1, 1]) cols.push({ x: CX + s * (2.425 + 4.85 * k), y: -75.4, ax: [1, 0] })
  for (let k = 0; k < 4; k++) for (const s of [-1, 1]) cols.push({ x: CX + s * (2.425 + 4.85 * k), y: -80.2, ax: [1, 0] })
  const wingW: Array<[number, number, XY]> = []
  for (const y of [-80.2, -85.0, -89.8, -94.7]) wingW.push([-17.6, y, [0, 1]])
  for (const x of [-17.6, -22.4, -27.2, -32.0, -36.8, -41.6]) wingW.push([x, -99.5, [1, 0]])
  for (const y of [-95.2, -91.0]) wingW.push([-41.6, y, [0, 1]])
  for (const [x, y, ax] of wingW) { cols.push({ x, y, ax }); cols.push({ x: mx(x), y, ax }) }
  for (const c of cols) ionic(L, trim, trim, c.x, c.y, POD, COL, r, c.ax)

  // Podium: under the wings, the colonnade and the portico, with steps.
  const podW: XY[] = [[-43.6, -101.4], [-15.4, -101.4], [-15.4, -77.1], [-4.4, -77.1], [-4.4, -82.4], [32.2, -82.4], [32.2, -77.1], [43.2, -77.1], [43.2, -101.4], [71.4, -101.4], [71.4, -69], [-43.6, -69]]
  prismPoly(stone, stone, podW, 0, POD)
  for (let k = 0; k < (hi ? 6 : 3); k++) {
    const t = (k + 1) / ((hi ? 6 : 3) + 1)
    cbox(stone, rect(-4.4 + 0.3, 32.2 - 0.3, -85.4 + 3.0 * t, -82.4), 0, ZF + (POD - ZF) * t, { top: true })
  }
  // Steps run up from the forecourt to the colonnade between the wings too.
  cbox(stone, rect(-15.4, -4.4, -78.4, -77.1), 0, ZF + 1.0)
  cbox(stone, rect(32.2, 43.2, -78.4, -77.1), 0, ZF + 1.0)

  // Walls behind the colonnade: the central wall (y = -70) and the wing blocks
  // are the front range's prism; windows, the door and the plinth go on them.
  const wallC = faceOf([-21.6, -70.0], [49.4, -70.0]) // runs east, normal south
  const fW = (x0: number, x1: number, y: number) => faceOf([x0, y], [x1, y])
  const hood = (f: Face, s: number) => hi ? fblock(trim, f, s - 1.2, s + 1.2, POD + 7.8, POD + 8.3, 0, 0.35, true) : fpanel(trim, f, s - 1.2, s + 1.2, POD + 7.8, POD + 8.4, 0.1)
  const bayXs: number[] = []
  for (let k = -6; k <= 6; k++) bayXs.push(CX + 4.85 * k)
  for (const x of bayXs) {
    const s = x - -21.6
    if (Math.abs(x - CX) < 1) {
      fpanel(win, wallC, s - 1.9, s + 1.9, POD, POD + 7.2) // main door
      fblock(trim, wallC, s - 2.6, s + 2.6, POD + 7.2, POD + 8.0, 0, 0.45, true)
      continue
    }
    fpanel(win, wallC, s - 0.85, s + 0.85, POD + 3.0, POD + 7.6)
    hood(wallC, s)
  }
  // Wing walls behind their colonnades: front (y = -94.9), inner side, west end.
  for (const sgn of [1, -1]) {
    const X = (x: number) => (sgn > 0 ? x : mx(x))
    const front = sgn > 0 ? fW(-37.1, -21.6, -94.9) : fW(mx(-21.6), mx(-37.1), -94.9)
    for (const x of [-34.6, -29.6, -24.6]) {
      const s = X(x) - (sgn > 0 ? -37.1 : mx(-21.6))
      fpanel(win, front, s - 0.85, s + 0.85, POD + 3.0, POD + 7.6)
      hood(front, s)
    }
    // Inner side face (x = -21.6 facing east, or 49.4 facing west).
    const side = sgn > 0 ? faceOf([-21.6, -94.9], [-21.6, -70]) : faceOf([mx(-21.6), -70], [mx(-21.6), -94.9])
    for (const y of [-87.4, -82.4, -77.4]) {
      const s = sgn > 0 ? y - -94.9 : -70 - y
      fpanel(win, side, s - 0.85, s + 0.85, POD + 3.0, POD + 7.6)
      hood(side, s)
    }
  }

  // Entablatures: the colonnade and wings (one U-shaped slab from the column
  // lines back to the walls), then the portico's taller one.
  const eo = r * 1.3 + 0.15 // reach past the column centres
  const entU: XY[] = [
    [-41.6 - eo, -99.5 - eo], [-17.6 + eo, -99.5 - eo], [-17.6 + eo, -75.4 - eo],
    [mx(-17.6) - eo, -75.4 - eo], [mx(-17.6) - eo, -99.5 - eo], [mx(-41.6) + eo, -99.5 - eo],
    [mx(-41.6) + eo, -90.0], [mx(-37.1), -90.0], [mx(-37.1), -69.0], [-37.1, -69.0], [-37.1, -90.0], [-41.6 - eo, -90.0],
  ]
  // architrave + frieze (stone), soffit at the column tops
  prismPoly(stone, null, entU, COL, ENT - 1.25)
  capPoly(stone, entU, COL, false)
  // cornice, projecting
  const grow = (ring: XY[], d: number): XY[] => {
    const R = ccw(ring), n = R.length
    return R.map((q, i) => {
      const a = R[(i + n - 1) % n], b = R[(i + 1) % n]
      const e1 = [q[0] - a[0], q[1] - a[1]], e2 = [b[0] - q[0], b[1] - q[1]]
      const l1 = Math.hypot(e1[0], e1[1]), l2 = Math.hypot(e2[0], e2[1])
      const n1 = [e1[1] / l1, -e1[0] / l1], n2 = [e2[1] / l2, -e2[0] / l2]
      const m = [n1[0] + n2[0], n1[1] + n2[1]], k = (m[0] * n1[0] + m[1] * n1[1])
      return [q[0] + (m[0] * d) / k, q[1] + (m[1] * d) / k] as XY
    })
  }
  const entC = grow(entU, 0.7)
  prismPoly(trim, null, entC, ENT - 0.75, ENT)
  capPoly(trim, entC, ENT - 0.75, false)
  capPoly(roof, entC, ENT, true)
  // frieze band slightly recessed reads as a shadow line under the cornice
  prismPoly(trim, null, grow(entU, 0.25), ENT - 1.25, ENT - 0.75)
  // blocking course / attic set back, to the lidar's 20.2 m
  prismPoly(stone, roof, grow(entU, -0.8), ENT, ATT)
  // wing roofs: flat lead, with a raised lantern light on each wing
  for (const sgn of [1, -1]) {
    const x0 = sgn > 0 ? -35.5 : mx(-23.2), x1 = sgn > 0 ? -23.2 : mx(-35.5)
    const rr = rect(x0, x1, -92, -73)
    cbox(roof, rr, ATT, ATT + 0.6)
    gable(glass, roof, rect(x0 + 3.5, x1 - 3.5, -88, -77), ATT + 0.6, ATT + 1.5, true)
  }

  // Portico: entablature, pediment with figures, gable roof back over the range.
  const px0 = CX - 16.975 - eo, px1 = CX + 16.975 + eo, py0 = -80.2 - eo
  cbox(stone, rect(px0, px1, py0, -70), COL, PENT - 1.5, { bottom: true, top: false })
  cbox(trim, rect(px0 - 0.25, px1 + 0.25, py0 - 0.25, -70), PENT - 3.6, PENT - 1.5, { top: false })
  cbox(trim, rect(px0 - 0.75, px1 + 0.75, py0 - 0.75, -70), PENT - 1.5, PENT, { bottom: true, top: roof })
  // Pediment: tympanum set back, raking cornices, the roof running to y = -64.
  const pyF = py0 - 0.2, rise = PAPEX - PENT
  const tymY = pyF + 0.7
  tf(stone, [px0 + 0.3, tymY, PENT], [px1 - 0.3, tymY, PENT], [CX, tymY, PAPEX - 0.9], [0, -1, 0])
  for (const s of [-1, 1]) {
    const xe = s < 0 ? px0 - 0.75 : px1 + 0.75
    // raking cornice: a sloped slab from the eave to the apex, front face and soffit
    const A: V3 = [xe, pyF - 0.55, PENT], B: V3 = [CX, pyF - 0.55, PAPEX], A2: V3 = [xe, tymY, PENT], B2: V3 = [CX, tymY, PAPEX]
    const dz = 0.95
    qf(trim, A, B, [B[0], B[1], B[2] - dz], [A[0] + s * -1.4, A[1], A[2]], [0, -1, 0])
    qf(trim, [A[0] + s * -1.4, A[1], A[2]], [B[0], B[1], B[2] - dz], [B2[0], B2[1], B2[2] - dz], [A2[0] + s * -1.4, A2[1], A2[2]], [0, 0, -1])
    // roof slope from the cornice back to y = -64
    qf(dome, A, B, [CX, -64, PAPEX], [xe, -64, PENT], [s * rise, 0, CX - xe < 0 ? -(CX - xe) : CX - xe])
  }
  tf(roof, [px0 - 0.75, -64, PENT], [px1 + 0.75, -64, PENT], [CX, -64, PAPEX], [0, 1, 0])
  // The sculpture group: 15 figures, tallest at the centre, reclining at the corners.
  const nF = hi ? 15 : 7
  for (let k = 0; k < nF; k++) {
    const t = (k - (nF - 1) / 2) / ((nF - 1) / 2) // -1..1
    const x = CX + t * 15.2
    const avail = (PAPEX - 1.0 - PENT) * (1 - Math.abs(t)) + 0.2
    const pose = Math.abs(t) > 0.8 ? 'lie' : Math.abs(t) > 0.45 ? 'seat' : 'stand'
    const h = pose === 'lie' ? 3.4 : Math.min(4.0, avail * (pose === 'seat' ? 1.2 : 1.0))
    figure(trim, [x, tymY - 0.15, PENT + 0.05], h, [0, -1], pose, -Math.sign(t) * 0.5, !hi)
  }
  // Acroteria blocks at the apex and eaves, the flagpole.
  cbox(trim, rect(CX - 0.6, CX + 0.6, pyF - 0.4, pyF + 0.8), PAPEX - 0.2, PAPEX + 0.9)
  cylinder(roof, CX, -66, 0.16, PAPEX - 0.5, PAPEX + 11, hi ? 8 : 5, 0.08)

  // ===== The residences ===================================================
  for (const ring of [RES_W, RES_E]) {
    const zt = ZF + 14.0
    prismPoly(stone, roof, ring, 0, zt)
    wallsPoly(trim, ring, zt - 0.7, zt)
    const xs = ring.map((p) => p[0]), ys = ring.map((p) => p[1])
    const rr = rect(Math.min(...xs) + 1.2, Math.max(...xs) - 1.2, Math.min(...ys) + 1.2, Math.max(...ys) - 1.2)
    hip(roof, rr, zt, ZF + 16.9, (rr.x1 - rr.x0) * 0.42)
    for (const [z0, z1] of [[ZF + 1.4, ZF + 3.8], [ZF + 5.2, ZF + 8.4], [ZF + 9.6, ZF + 12.0]] as const) {
      facadeBays(win, null, ring, z0, z1, { bay: 3.6, w: 1.4, minLen: 12, margin: 2.2 })
    }
  }

  // ===== Great Court roof ==================================================
  // Rectangle points (corners included) mapped by angle to the drum circle.
  const nx = hi ? 9 : 5, ny = hi ? 11 : 7, M = hi ? 8 : 5
  const rectPts: XY[] = []
  const side = (a: XY, b: XY, n: number) => { for (let i = 0; i < n; i++) rectPts.push([a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n]) }
  side([GC.x0, GC.y0], [GC.x1, GC.y0], nx); side([GC.x1, GC.y0], [GC.x1, GC.y1], ny)
  side([GC.x1, GC.y1], [GC.x0, GC.y1], nx); side([GC.x0, GC.y1], [GC.x0, GC.y0], ny)
  const N = rectPts.length
  const zE = ZF + 20.4, zC = ZF + 25.4
  const S = (i: number, j: number): V3 => {
    const R = rectPts[i % N], th = Math.atan2(R[1] - RC[1], R[0] - RC[0])
    const Q: XY = [RC[0] + (RR + 0.4) * Math.cos(th), RC[1] + (RR + 0.4) * Math.sin(th)]
    const s = j / M
    const z = zE + (zC - zE) * (1 - (1 - s) ** 2)
    return [R[0] + (Q[0] - R[0]) * s, R[1] + (Q[1] - R[1]) * s, z]
  }
  smooth(glass, (q) => {
    for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) qf(q, S(i, j), S(i + 1, j), S(i + 1, j + 1), S(i, j + 1), [0, 0, 1])
  }, 40)
  // Diamond lattice ribs standing 0.18 m off the glass, plus the edge and drum rings.
  const rib = (A: V3, B: V3, w: number) => {
    const d = [B[0] - A[0], B[1] - A[1]], l = Math.hypot(d[0], d[1]) || 1
    const sx = (-d[1] / l) * (w / 2), sy = (d[0] / l) * (w / 2), h = 0.18
    qf(trim, [A[0] - sx, A[1] - sy, A[2] + h], [B[0] - sx, B[1] - sy, B[2] + h], [B[0] + sx, B[1] + sy, B[2] + h], [A[0] + sx, A[1] + sy, A[2] + h], [0, 0, 1])
  }
  const rw = hi ? 0.32 : 0.55
  for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) {
    rib(S(i, j), S(i + 1, j + 1), rw)
    rib(S(i + 1, j), S(i, j + 1), rw)
  }
  for (let i = 0; i < N; i++) rib(S(i, M), S(i + 1, M), 0.7)
  // Parapet ring the roof springs from (the court's top edge).
  cbox(trim, rect(GC.x0 - 0.6, GC.x0 + 0.2, GC.y0, GC.y1), ZF + 19.6, zE + 0.25, { top: true })
  cbox(trim, rect(GC.x1 - 0.2, GC.x1 + 0.6, GC.y0, GC.y1), ZF + 19.6, zE + 0.25, { top: true })
  cbox(trim, rect(GC.x0, GC.x1, GC.y0 - 0.6, GC.y0 + 0.2), ZF + 19.6, zE + 0.25, { top: true })
  cbox(trim, rect(GC.x0, GC.x1, GC.y1 - 0.2, GC.y1 + 0.6), ZF + 19.6, zE + 0.25, { top: true })

  // ===== Reading Room: drum, dome, lantern ================================
  const nR = hi ? 32 : 16
  // Drum rises from the court floor to just above the roof junction.
  smooth(stone, (q) => lathe(q, [[RR, 0], [RR, zC + 0.6]], nR, RC[0], RC[1], false), 30)
  lathe(trim, [[RR + 0.4, zC + 0.6], [RR + 0.4, zC + 1.2], [RR - 0.6, zC + 1.2]], nR, RC[0], RC[1], false)
  const domeBase = zC + 1.2, rTop = 7.2, zTop = ZF + 32.4
  const prof: [number, number][] = []
  const nd = hi ? 7 : 4
  for (let k = 0; k <= nd; k++) {
    const t = k / nd, a = t * Math.acos(rTop / (RR - 0.8))
    // a spherical cap from the drum rim to the lantern ring
    prof.push([(RR - 0.8) * Math.cos(a), domeBase + (zTop - domeBase) * Math.sin(a) / Math.sin(Math.acos(rTop / (RR - 0.8)))])
  }
  smooth(dome, (q) => lathe(q, prof, nR, RC[0], RC[1], false), 35)
  // Dome ribs (lead rolls) as bold lines
  if (true) {
    const nRib = hi ? 20 : 10
    for (let k = 0; k < nRib; k++) {
      const a = (TAU * k) / nRib
      for (let i = 0; i < prof.length - 1; i++) {
        const [r0, z0] = prof[i], [r1, z1] = prof[i + 1]
        const P = (rr: number, z: number, da: number): V3 => [RC[0] + rr * Math.cos(a + da / rr), RC[1] + rr * Math.sin(a + da / rr), z + 0.12]
        qf(trim, P(r0, z0, -0.22), P(r0, z0, 0.22), P(r1, z1, 0.22), P(r1, z1, -0.22), [Math.cos(a), Math.sin(a), 1])
      }
    }
  }
  // Lantern: glazed drum with a shallow cone and finial.
  lathe(trim, [[rTop + 0.3, zTop], [rTop + 0.3, zTop + 0.5], [rTop - 0.2, zTop + 0.5]], hi ? 20 : 12, RC[0], RC[1], false)
  lathe(glass, [[rTop - 0.4, zTop + 0.5], [rTop - 0.4, zTop + 2.4]], hi ? 20 : 12, RC[0], RC[1], false)
  lathe(dome, [[rTop - 0.1, zTop + 2.4], [rTop - 0.1, zTop + 2.8], [1.2, zTop + 4.0], [0.4, zTop + 4.4]], hi ? 20 : 12, RC[0], RC[1], true)

  // ===== Roof lights over the galleries (long glazed ridges) ===============
  const lights: Array<[number, number, number, number, boolean]> = [
    [-33.5, -25.2, -40, 40, true], [53.8, 62.6, -40, 40, true], [-10, 40, 52, 63, false],
    [-30, 60, -66.5, -55, false], [-60, -40, 72, 85, false], [-30, -8, 96, 106, false], [32, 66, 96, 106, false],
  ]
  for (const [x0, x1, y0, y1, ns] of lights) {
    const zt = ZF + (y0 > 90 ? 24.7 : y0 > 69 ? 21.4 : 20.2)
    cbox(roof, rect(x0, x1, y0, y1), zt, zt + 0.5)
    gable(glass, roof, rect(x0 + 0.6, x1 - 0.6, y0 + 0.6, y1 - 0.6), zt + 0.5, zt + 1.9, ns)
  }

  // ===== King Edward VII Galleries: the giant Ionic order on Montague Place
  for (let k = 0; k < 20; k++) {
    const x = -38 + k * (104 / 19)
    if (hi) ionic(L, trim, trim, x, 111.4, ZF + 3.0, ZF + 19.4, 0.62, [1, 0])
    else cbox(trim, rect(x - 0.6, x + 0.6, 110.4, 111.6), ZF + 3, ZF + 19.4, { c: 0.25, top: false })
    if (k < 19) fpanel(win, faceOf([x + 104 / 19, 110.45], [x, 110.45]), 1.0, 104 / 19 - 1.0, ZF + 6, ZF + 15, 0.06)
  }
  cbox(trim, rect(-44.6, 72.5, 109.6, 112.4), ZF + 19.4, ZF + 21.4, { bottom: true, top: roof })

  // ===== Materials and night ==============================================
  const front = (p: V3, n: V3) => (p[1] < -60 && p[2] < 29 && n[1] < -0.3 ? 0.9 : p[1] < -60 && p[2] < 29 && Math.abs(n[0]) > 0.6 ? 0.5 : 0)
  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: stone, material: { ...finish('portland-stone', 0xe4d9c6), floodlight: front } },
    { part: trim, material: { ...PALETTE.trim, floodlight: front } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: glass, material: { name: 'glass', color: 0x8dbdb6, roughness: 0.24 } },
    { part: dome, material: finish('reading-room-dome', 0xc3d6ca) },
  ]
  return parts
}

if (import.meta.main) {
  const extras = { landmark: 'British Museum', wikidata: 'Q6373' }
  writeModel('British Museum', ID, build(false), extras, 6500)
  writeModel('British Museum', ID, build(true), extras, 40000, `${ID}.detail`)
}
