/**
 * Paris-Charles de Gaulle Airport, Terminal 1 (Aérogare 1; Paul Andreu for
 * Aéroport de Paris, opened 1974): the round concrete "camembert" with its
 * Y-headed piers, its banded drum and rooftop car park, the central court
 * crossed by the glass-topped escalator tubes, and its six satellites plus
 * the 2022 junction building that joins satellites 1–3 — procedural,
 * CC0-1.0, no textures.
 * bun generators/paris-cdg-terminal-1.ts
 *
 * Writes five models, one per freestanding building (the satellites are
 * reached from the drum only by underground passages), each as a low GLB
 * and a `.detail.glb` (the detail level adds the drum's band joints, the
 * rooftop ramp houses' openings, more piers' and tubes' segments, satellite
 * mullions and the jet bridges' columns):
 * - paris-cdg-terminal-1: the drum, its court and tubes, the piers and the
 *   trench pavilion. Anchor: the area centroid of the drum's OSM outline
 *   way/171883502 (2.5418484, 49.0144005). y = 0 is the floor of the sunken
 *   ring the drum stands in (the lower road level).
 * - paris-cdg-terminal-1-satellites-t-w: satellites T and V and the 2022
 *   junction ("Satellite U") that joins them into one building (satellites
 *   Est 1–3), with satellite W, which the glazed footbridge way/1375084073
 *   joins to V above ground. Anchor: the area centroid of the outlines of
 *   T, U, V and W together (2.5441783, 49.015269).
 * - paris-cdg-terminal-1-satellite-x, -y, -z: one satellite each. Anchor:
 *   the area centroid of its outline (X 2.5394993, 49.0159449; Y 2.5385285,
 *   49.0145927; Z 2.5391132, 49.0131483).
 * Each satellite stands on the apron, 12.5 m over the drum's ring floor;
 * its y = 0 is the apron (the lowest ground under it). The joint model sank
 * their walls 1.5 m under the apron; split, they start at the apron and
 * their sills are 1.5 m shorter, so everything over the apron is as before.
 * Jet bridges go with the satellite whose outline their first point is on.
 *
 * Also the small kit the other CDG models of this batch import (`lathe`,
 * `tube`, `plane`, `extrude`, `frustum`, `jetLine`, `CDG` colours, `glassWall`);
 * the models are only written when this file is run directly.
 *
 * Map frame: x = east, y = north, z up, metres. Bearing 0. The OSM data
 * below are in the drum's frame; each satellite is built there and moved to
 * its own anchor.
 *
 * Identifying features (photos): the round drum, 188 m across, of ribbed
 * concrete in horizontal bands, standing on sixteen piers whose heads split
 * into a Y under a deep soffit, over a recessed, glazed base with the road
 * decks; the dark rooftop car park ringed by white ramp houses and four
 * concrete lift towers; the open central court with its oculus and the
 * glass-topped escalator tubes crossing it (Klack's interior photos); the
 * sunken ring the base stands in, ramps diving under the drum; the
 * trapezoidal satellites with a raised hipped lantern in the middle of a
 * flat roof, glass walls and a white fascia; the jet bridges.
 *
 * Evidence
 * - OSM (API map call, November 2026): the drum way/171883502 (radius
 *   93.4–94.8 m, mean 94.1); satellites way/172859842 (T), 172956322 (V),
 *   172859856 (W), 172859851 (X), 172859843 (Y), 172956328 (Z); the
 *   junction way/967374659 ("Satellite U"); W, X, Y and Z carry
 *   building:parts tagged 10 m (body), 15 m pyramidal (lantern), 7 m, and
 *   8 m and 4 m skillions (the arm down to the passage); seven 7 m blocks
 *   with min_height 5 around the drum (way/401466277…318, the passage heads
 *   at the edge of the sunken ring); way/401466258 (transportation, 3 m, the
 *   pavilion in the southern road trench); way/1375084073 (the footbridge
 *   from W to the junction); aeroway=jet_bridge centre lines.
 * - Published: opened 1974, Paul Andreu (Britannica, "Terminal 1 at Charles
 *   de Gaulle Airport"; ADP). Seven satellites originally, reached through
 *   underground passages; satellites 1–3 joined by a new building (about
 *   290 m long, ~22 m, R+3; pss-archi.eu FR-77282-53957; ADP press, 2022:
 *   36,000 m², reopened December 2022). fr.wikipedia ("Aéroport de
 *   Paris-Charles-de-Gaulle") names satellites Est 1 to 3 as T, U and V.
 * - Terrain: Mapterhorn z15 shows the drum in a ring ~12.5 m below the
 *   apron (0–5 m inside r ≈ 80 m against 12.3–13.4 m on the apron), and the
 *   southern road trench; that is y = 0 here.
 * - Photos (Wikimedia Commons / Flickr; in the catalog, the three aerials
 *   (Citizen59's, Avdeev's, Salard's) are on every model, the rest on the
 *   drum's):
 *   https://commons.wikimedia.org/wiki/File:Terminal1_CDGParisAirport.jpg
 *     (Citizen59, CC BY 3.0) aerial from the south: the roof plan, ramp
 *     houses, lift towers, the court's collar, the piers and glazed base,
 *     satellite roofs; most plan measurements were read from it;
 *   https://commons.wikimedia.org/wiki/File:Terminal_1_of_CDG_Airport.jpg
 *     (Dmitry Avdeev, CC BY-SA 3.0) aerial from the south: the satellites
 *     around the drum, the sunken ring;
 *   https://www.flickr.com/photos/11085937@N02/4999861411 (Citizen59, CC
 *     BY-SA 2.0) from the south at apron level: the drum's profile, the Y
 *     piers, the base and ramps; heights were scaled from it;
 *   https://commons.wikimedia.org/wiki/File:Terminal-1-Paris-Charles-de-Gaulle-Roissy-en-France-02-2018a.jpg
 *     and …-02-2018d.jpg (Gunnar Klack, CC BY-SA 4.0) the drum from the
 *     south-west and south at road level: bands, rounded lower edge,
 *     piers, the galleries of the road decks;
 *   …-02-2018b.jpg and …-02-2018c.jpg (Gunnar Klack, CC BY-SA 4.0) and
 *     https://www.flickr.com/photos/148300038@N02/38711201360 (gnrklk, CC
 *     BY-SA 2.0): the court, its oculus ring and the crossing tubes;
 *   https://commons.wikimedia.org/wiki/File:CDG_TERMINAL_1_FROM_A320_F-GJVW_AIR_FRANCE_TAKE_OFF_FLIGHT_CDG-VCE_(16554098828).jpg
 *     (Eric Salard, CC BY-SA 2.0) aerial from the south-west.
 * - No lidar (IGN LiDAR HD exists, open, but there is no repo tool).
 *
 * Numbers: drum radius 94.1 m (OSM); 16 piers at r 87 m (counted from the
 * aerial, spacing ~34 m); base glazing at r 80 m (estimated: the soffit is
 * about 14 m deep in the aerial); pier shafts 4.2 m wide to 10.6 m, Y
 * capitals (wide inverted wedges, 16.8 m across at the top, 6 m deep) to the
 * soffit at 16.5 m, drum bands 16.5–33.5 m, coping to 34.4 m (scaled from
 * the 4 m "Terminal 1" letters and the drum's width in Citizen59's apron
 * photo; the apron at 12.5 m from the terrain); the court r 22 m with an
 * oculus r 17.5 m (aerial: collar ~42 m across, hole ~34 m); four lift towers
 * 12 m square, 6.5 m over the deck; 24 ramp houses 9 × 25 m, 2 m high
 * (estimated from the aerial); six tubes 3.6 m across (photos: a person's
 * height against them); satellites: OSM heights over the apron; the
 * junction 20 m over the apron (published ~22 m, from the lower ground);
 * jet bridges at 3.5–6.5 m over the apron (estimated).
 * Colour: the concrete is a warm mid grey-beige in Citizen59's two photos
 * (about #bdb6aa by day), drawn as cdg-t1-concrete #c4bdb1, with a grey
 * joint line at the foot of each drum band; the ramp houses' roofs and the
 * satellites' fascias and lanterns stay pale, as in the aerial.
 * Doubts: the junction building has no licensed photo here (opened 2022,
 * after every aerial found): its height and glazing are from the published
 * figures and OSM alone; satellites T and V carry no parts in OSM and are
 * drawn like the others; the number of ramp houses and their spacing are
 * approximate; the passage heads' height (OSM 5–7 m) is relative to a
 * ground that slopes there.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, quadN, unit, area, capPoly, insetRing } from './nyc-570-lexington'
import { triangulate } from './chi-aon-center'
import { prismRing, writeLod, newMats, ccw, simplify, type Mats } from './tokyo-haneda-terminal-1'

// ===========================================================================
// Kit (shared with the other CDG models of this batch)
// ===========================================================================

/** CDG colours, from daylight photos, pulled to the palette's lightness. */
export const CDG = {
  /** Andreu's board-marked concrete, warm light grey. */
  concrete: finish('cdg-concrete', 0xd3cec4),
  /** Car-park asphalt and dark roofs. */
  deck: finish('cdg-deck', 0x8b9095),
  /** Light, reflective glazing; lit at night. */
  window: { name: 'window', color: 0x8ea3b3, roughness: 0.35 } as MaterialSpec,
  /** White fascias, ramp houses, mullions. */
  white: finish('cdg-white', 0xeeece6),
  /** Metal: the escalator tubes, jet bridges, grey roofs. */
  metal: finish('cdg-metal', 0xa3aab0),
  /** Light grey standing-seam roofs (T2's vaults and shells). */
  roof: finish('cdg-roof', 0xbcc2c7),
  glass: PALETTE.glass,
  /** Glazing deep in shade (under T1's soffit), a darker teal grey; lit at night. */
  shade: windowVariant(2, 0x6f8690),
}

/** Rotate (x, y) about the origin by `deg` counter-clockwise. */
export const rot = (p: XY, deg: number): XY => { const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c] }
const P = (r: number, a: number, z: number, cx = 0, cy = 0): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]

/**
 * A surface of revolution about (cx, cy): `prof` is [r, z] from one end to
 * the other; the face's normal is (dz, −dr) in the (r, z) plane, so a
 * profile running upwards faces out, downwards faces in, outwards faces
 * down and inwards faces up. Smooth around, flat along the profile. An arc
 * a0…a1 (radians) draws part of it.
 */
export function lathe(p: Part, prof: [number, number][], n: number, o: { cx?: number; cy?: number; a0?: number; a1?: number } = {}) {
  const cx = o.cx ?? 0, cy = o.cy ?? 0, a0 = o.a0 ?? 0, a1 = o.a1 ?? 2 * Math.PI
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const L = Math.hypot(r1 - r0, z1 - z0); if (L < 1e-6) continue
    const nr = (z1 - z0) / L, nz = -(r1 - r0) / L
    for (let i = 0; i < n; i++) {
      const a = a0 + ((a1 - a0) * i) / n, b = a0 + ((a1 - a0) * (i + 1)) / n
      const na: V3 = [nr * Math.cos(a), nr * Math.sin(a), nz], nb: V3 = [nr * Math.cos(b), nr * Math.sin(b), nz]
      if (r0 < 1e-6) p.tri(P(r0, a, z0, cx, cy), P(r1, b, z1, cx, cy), P(r1, a, z1, cx, cy), undefined, undefined, undefined, [na, nb, na])
      else if (r1 < 1e-6) p.tri(P(r0, a, z0, cx, cy), P(r0, b, z0, cx, cy), P(r1, a, z1, cx, cy), undefined, undefined, undefined, [na, nb, na])
      else quadN(p, P(r0, a, z0, cx, cy), P(r0, b, z0, cx, cy), P(r1, b, z1, cx, cy), P(r1, a, z1, cx, cy), [na, nb, nb, na])
    }
  }
}

/** A round tube of radius r from A to B, n sides, with flat end caps. */
export function tube(p: Part, A: V3, B: V3, r: number, n: number, caps = true) {
  const d = unit([B[0] - A[0], B[1] - A[1], B[2] - A[2]])
  const ref: V3 = Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const u = unit([d[1] * ref[2] - d[2] * ref[1], d[2] * ref[0] - d[0] * ref[2], d[0] * ref[1] - d[1] * ref[0]])
  const v: V3 = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], d[0] * u[1] - d[1] * u[0]]
  const dir = (i: number): V3 => { const a = (2 * Math.PI * i) / n; return [u[0] * Math.cos(a) + v[0] * Math.sin(a), u[1] * Math.cos(a) + v[1] * Math.sin(a), u[2] * Math.cos(a) + v[2] * Math.sin(a)] }
  const at = (C: V3, e: V3): V3 => [C[0] + e[0] * r, C[1] + e[1] * r, C[2] + e[2] * r]
  for (let i = 0; i < n; i++) {
    const ea = dir(i), eb = dir(i + 1)
    quadN(p, at(A, ea), at(A, eb), at(B, eb), at(B, ea), [ea, eb, eb, ea])
    if (caps) {
      const m: V3 = [-d[0], -d[1], -d[2]]
      p.tri(A, at(A, eb), at(A, ea), undefined, undefined, undefined, [m, m, m])
      p.tri(B, at(B, ea), at(B, eb), undefined, undefined, undefined, [d, d, d])
    }
  }
}

/** A flat polygon (any winding, planar, simple) facing `n`. */
export function plane(p: Part, pts: V3[], n: V3) {
  // project onto the plane's two in-plane axes
  const ref: V3 = Math.abs(n[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const u = unit([n[1] * ref[2] - n[2] * ref[1], n[2] * ref[0] - n[0] * ref[2], n[0] * ref[1] - n[1] * ref[0]])
  const v: V3 = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]]
  let r: XY[] = pts.map((q) => [q[0] * u[0] + q[1] * u[1] + q[2] * u[2], q[0] * v[0] + q[1] * v[1] + q[2] * v[2]])
  let idx = pts.map((_, i) => i)
  if (area(r) < 0) { r = r.slice().reverse(); idx = idx.slice().reverse() }
  for (const [a, b, c] of triangulate(r)) p.tri(pts[idx[a]], pts[idx[b]], pts[idx[c]], undefined, undefined, undefined, [n, n, n])
}

/**
 * A profile drawn in a vertical plane and extruded: `prof` is (s, z) with s
 * along the unit `u` (horizontal), placed at `o`, extruded by `depth` along
 * `w` (horizontal, perpendicular to u).
 */
export function extrude(p: Part, prof: XY[], o: V3, u: V3, w: V3, depth: number, sides: Part = p) {
  const at = (s: number, z: number, t: number): V3 => [o[0] + u[0] * s + w[0] * t, o[1] + u[1] * s + w[1] * t, o[2] + z]
  const r = ccw(prof)
  // face normals: the two flat faces point along ∓w
  plane(p, r.map(([s, z]) => at(s, z, 0)), [-w[0], -w[1], -w[2]])
  plane(p, r.map(([s, z]) => at(s, z, depth)), w)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const ds = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(ds, dz); if (L < 1e-6) continue
    // outward in (s, z) for a counter-clockwise ring: (dz, −ds)
    const ns = dz / L, nz = -ds / L
    const n: V3 = unit([u[0] * ns, u[1] * ns, nz])
    quadN(sides, at(a[0], a[1], 0), at(b[0], b[1], 0), at(b[0], b[1], depth), at(a[0], a[1], depth), [n, n, n, n])
  }
}

/** A hipped frustum on a ring: walls from z0 sloping in to the ring inset by `ins` at z1, flat top. */
export function frustum(p: Part, ring: XY[], z0: number, z1: number, ins: number, top: Part = p) {
  const r = ccw(ring)
  const c: XY = [r.reduce((s, q) => s + q[0], 0) / r.length, r.reduce((s, q) => s + q[1], 0) / r.length]
  const t = r.map((q) => { const dx = q[0] - c[0], dy = q[1] - c[1], L = Math.hypot(dx, dy); const k = Math.max(0.15, 1 - ins / L); return [c[0] + dx * k, c[1] + dy * k] as XY })
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    p.quad([r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [t[j][0], t[j][1], z1], [t[i][0], t[i][1], z1])
  }
  capPoly(top, t, z1)
}

/**
 * A glazed wall from a to b (counter-clockwise ring order), z0…z1: window
 * glazing set 0.05 m proud of a solid backing, with pale mullions every
 * `bay` metres and transoms at `rows`.
 */
export function glassWall(wall: Part | null, win: Part, trim: Part | null, a: XY, b: XY, z0: number, z1: number, o: { bay?: number; rows?: number[]; mw?: number } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.2) return
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, n: V3 = [uy, -ux, 0]
  const v = (s: number, z: number, d = 0): V3 => [a[0] + ux * s + n[0] * d, a[1] + uy * s + n[1] * d, z]
  if (wall) wall.quad(v(0, z0), v(L, z0), v(L, z1), v(0, z1))
  win.quad(v(0, z0, 0.05), v(L, z0, 0.05), v(L, z1, 0.05), v(0, z1, 0.05))
  if (!trim) return
  const mw = o.mw ?? 0.45
  if (o.bay) { const k = Math.max(1, Math.round(L / o.bay)); for (let i = 1; i < k; i++) { const s = (L * i) / k; trim.quad(v(s - mw / 2, z0, 0.1), v(s + mw / 2, z0, 0.1), v(s + mw / 2, z1, 0.1), v(s - mw / 2, z1, 0.1)) } }
  for (const z of o.rows ?? []) trim.quad(v(0, z - mw / 2, 0.1), v(L, z - mw / 2, 0.1), v(L, z + mw / 2, 0.1), v(0, z + mw / 2, 0.1))
}

/** A flat-roofed block on a ring: glazed walls with a solid fascia band on top. */
export function glassBlock(M: { wall: Part; win: Part; trim: Part; roof: Part }, ring: XY[], z0: number, z1: number, o: { fascia?: number; sill?: number; bay?: number; rows?: number[] } = {}) {
  const r = ccw(ring), fa = o.fascia ?? 1.5, sill = o.sill ?? 0
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.05) continue
    if (L > 2.5) glassWall(null, M.win, o.bay ? M.trim : null, a, b, z0 + sill, z1 - fa, { bay: o.bay, rows: o.rows })
    else M.wall.quad([a[0], a[1], z0 + sill], [b[0], b[1], z0 + sill], [b[0], b[1], z1 - fa], [a[0], a[1], z1 - fa])
    M.trim.quad([a[0], a[1], z1 - fa], [b[0], b[1], z1 - fa], [b[0], b[1], z1], [a[0], a[1], z1])
    if (sill > 0) M.wall.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z0 + sill], [a[0], a[1], z0 + sill])
  }
  capPoly(M.roof, r, z1)
}

/** Jet bridges along OSM centre lines: a box per leg, a column under each joint. */
export function jetLine(p: Part, line: XY[], z0: number, z1: number, w: number, base: number, nCol = 6, bottom = nCol > 0) {
  for (let i = 0; i < line.length - 1; i++) {
    const a = line[i], b = line[i + 1]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.5) continue
    const n: XY = [((b[1] - a[1]) / L) * (w / 2), ((a[0] - b[0]) / L) * (w / 2)]
    prismRing(p, [[a[0] + n[0], a[1] + n[1]], [b[0] + n[0], b[1] + n[1]], [b[0] - n[0], b[1] - n[1]], [a[0] - n[0], a[1] - n[1]]], z0, z1, p, bottom ? p : null)
  }
  if (nCol > 0) for (const q of line.slice(1)) {
    const r = 0.5
    prismRing(p, Array.from({ length: nCol }, (_, k) => [q[0] + r * Math.cos((2 * Math.PI * k) / nCol), q[1] + r * Math.sin((2 * Math.PI * k) / nCol)] as XY), base, z0, null)
  }
}

export const centroid = (r: XY[]): XY => {
  let A = 0, x = 0, y = 0
  for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length], c = a[0] * b[1] - b[0] * a[1]; A += c; x += (a[0] + b[0]) * c; y += (a[1] + b[1]) * c }
  return [x / (3 * A), y / (3 * A)]
}

// ===========================================================================
// OSM data, in this frame (bearing 0, anchor 2.5418484, 49.0144005)
// ===========================================================================
/** way/172859842 */
const SAT_T: XY[] = [[193.1,-114.1],[199.3,-100.4],[172.5,-87.4],[173.4,-85.4],[174.4,-83.4],[175.3,-81.4],[175.8,-80.1],[176.4,-78.7],[187.4,-83.2],[191.2,-74.7],[207.5,-83.1],[210.6,-77.6],[215.8,-78.1],[230.0,-79.6],[241.9,-80.7],[259.0,-81.8],[255.3,-89.7],[240.5,-120.9],[230.6,-141.9],[227.3,-148.8],[215.6,-136.9],[197.3,-118.4]]
/** way/172956322 */
const SAT_V: XY[] = [[125.7,238.9],[133.0,234.5],[160.9,213.9],[180.1,200.4],[186.3,195.8],[145.9,168.6],[125.0,154.8],[119.7,159.4],[114.4,152.9],[113.1,153.7],[111.8,154.5],[110.1,155.6],[108.4,156.7],[107.2,157.6],[111.6,163.9],[105.7,168.7],[119.0,187.1],[117.7,188.1],[113.8,190.7],[112.7,191.5],[114.3,198.0],[120.9,223.1]]
/** way/967374659 */
const JUNCTION: XY[] = [[145.9,168.6],[186.3,195.8],[250.8,102.0],[268.7,34.8],[264.9,-2.3],[259.0,-81.8],[241.9,-80.7],[230.0,-79.6],[233.4,-49.8],[242.6,31.5],[232.7,63.7],[182.3,67.6],[160.4,97.9],[120.2,153.6],[125.0,154.8]]
/** way/172859856 */
const SAT_W: XY[] = [[14.7,269.3],[14.4,268.1],[10.1,253.0],[1.7,222.9],[0.3,222.7],[-5.1,222.3],[-10.7,221.8],[-13.9,221.5],[-11.7,193.6],[-12.1,193.4],[-14.0,192.4],[-15.5,191.7],[-16.1,191.7],[-17.8,191.7],[-18.7,191.9],[-21.2,192.3],[-21.7,199.9],[-28.7,199.6],[-29.9,201.0],[-31.7,220.2],[-39.3,219.2],[-41.2,223.6],[-52.2,247.2],[-59.7,263.4],[-50.7,264.1],[7.2,268.7]]
/** way/172859851 */
const SAT_X: XY[] = [[-216.4,164.1],[-209.8,170.5],[-185.1,194.6],[-168.2,211.0],[-163.6,215.6],[-163.1,214.5],[-156.8,201.0],[-143.1,171.8],[-148.8,166.2],[-153.3,161.8],[-154.1,161.0],[-134.8,142.4],[-134.4,139.8],[-132.3,137.5],[-133.9,136.1],[-135.5,134.7],[-136.7,133.5],[-138.8,134.7],[-141.2,134.1],[-146.3,139.4],[-151.3,135.1],[-153.2,135.2],[-166.4,148.7],[-166.9,148.3],[-170.1,145.2],[-172.0,143.3],[-177.1,145.7],[-200.8,156.8]]
/** way/172859843 */
const SAT_Y: XY[] = [[-220.9,40.6],[-222.1,27.8],[-222.4,24.8],[-195.6,22.4],[-193.3,21.5],[-193.3,20.4],[-193.5,18.7],[-193.6,16.2],[-193.7,14.8],[-194.0,14.2],[-195.3,13.6],[-202.4,14.1],[-203.2,7.1],[-204.6,5.7],[-223.9,7.0],[-224.4,-0.1],[-228.4,-1.2],[-254.1,-8.0],[-271.9,-12.6],[-271.2,-4.5],[-270.4,3.9],[-267.8,30.0],[-265.6,53.2],[-264.9,60.5],[-248.9,53.3]]
/** way/172956328 */
const SAT_Z: XY[] = [[-242.9,-122.6],[-242.0,-122.4],[-225.3,-118.1],[-195.3,-110.4],[-187.4,-121.9],[-186.5,-123.2],[-161.7,-105.1],[-160.5,-106.6],[-159.3,-108.4],[-158.0,-110.4],[-156.6,-112.4],[-155.5,-114.1],[-166.3,-120.9],[-161.8,-127.5],[-176.6,-137.6],[-172.2,-143.9],[-178.2,-152.4],[-196.9,-178.4],[-200.6,-183.4],[-205.1,-177.0],[-225.5,-147.6],[-239.0,-128.4]]
/** way/1222070372 */
const W10: XY[] = [[-39.3,219.2],[-31.7,220.2],[-24.6,220.7],[-28.4,228.0],[-38.3,248.9],[-2.1,252.1],[-8.7,229.6],[-10.7,221.8],[-5.1,222.3],[0.3,222.7],[1.7,222.9],[14.7,269.3],[-59.7,263.4]]
/** way/1222070371 */
const W15: XY[] = [[-28.4,228.0],[-8.7,229.6],[-2.1,252.1],[-38.3,248.9]]
/** way/1222070370 */
const W8: XY[] = [[-23.2,220.8],[-13.9,221.5],[-11.7,193.6],[-12.1,193.4],[-14.0,192.4],[-15.5,191.7],[-16.1,191.7],[-17.8,191.7],[-18.7,191.9],[-21.2,192.3],[-21.7,199.9]]
/** way/1222070369 */
const W4: XY[] = [[-31.7,220.2],[-24.6,220.7],[-23.2,220.8],[-21.7,199.9],[-28.7,199.6],[-29.9,201.0]]
/** way/1222070373 */
const W0: XY[] = [[-28.4,228.0],[-8.7,229.6],[-10.7,221.8],[-13.9,221.5],[-23.2,220.8],[-24.6,220.7]]
/** way/1222001501 */
const X10: XY[] = [[-172.0,143.3],[-166.4,148.7],[-160.4,154.3],[-170.2,158.7],[-191.4,168.1],[-166.8,192.4],[-157.4,171.2],[-153.3,161.8],[-143.1,171.8],[-163.6,215.6],[-185.1,194.6],[-209.8,170.5],[-216.4,164.1],[-200.8,156.8],[-177.1,145.7]]
/** way/1222001503 */
const X15: XY[] = [[-191.4,168.1],[-166.8,192.4],[-157.4,171.2],[-170.2,158.7]]
/** way/1222001502 */
const X7: XY[] = [[-160.4,154.3],[-170.2,158.7],[-157.4,171.2],[-153.3,161.8],[-154.1,161.0],[-154.8,160.3]]
/** way/1222060508 */
const X4: XY[] = [[-166.4,148.7],[-160.4,154.3],[-146.3,139.4],[-151.3,135.1],[-153.2,135.2]]
/** way/1222060509 */
const X8: XY[] = [[-160.4,154.3],[-146.3,139.4],[-141.2,134.1],[-138.8,134.7],[-136.7,133.5],[-135.5,134.7],[-133.9,136.1],[-132.3,137.5],[-134.4,139.8],[-134.8,142.4],[-154.1,161.0],[-154.8,160.3]]
/** way/1222070386 */
const Y10: XY[] = [[-224.4,-0.1],[-223.9,7.0],[-223.1,16.4],[-231.8,14.1],[-253.7,8.4],[-250.4,42.7],[-230.0,31.9],[-222.1,27.8],[-220.9,40.6],[-264.9,60.5],[-265.6,53.2],[-267.8,30.0],[-271.9,-12.6],[-254.1,-8.0],[-228.4,-1.2]]
/** way/1222070388 */
const Y15: XY[] = [[-253.7,8.4],[-250.4,42.7],[-230.0,31.9],[-230.5,27.1],[-231.8,14.1]]
/** way/1222070387 */
const Y7: XY[] = [[-231.8,14.1],[-230.5,27.1],[-230.0,31.9],[-222.1,27.8],[-222.4,24.8],[-223.1,16.4]]
/** way/1222070384 */
const Y8: XY[] = [[-193.3,21.5],[-193.3,20.4],[-193.5,18.7],[-193.6,16.2],[-193.7,14.8],[-194.0,14.2],[-195.3,13.6],[-202.4,14.1],[-223.1,16.4],[-222.4,24.8],[-195.6,22.4]]
/** way/1222070385 */
const Y4: XY[] = [[-223.1,16.4],[-202.4,14.1],[-203.2,7.1],[-204.6,5.7],[-223.9,7.0]]
/** way/1222070382 */
const YB: XY[] = [[-245.4,-17.5],[-246.6,-12.9],[-232.9,-9.3],[-230.4,-8.7],[-226.1,-7.5],[-225.6,-9.5],[-229.9,-10.6],[-232.4,-11.3],[-237.6,-12.6],[-236.9,-15.3]]
/** way/1222070391 */
const Z10: XY[] = [[-200.6,-183.4],[-196.9,-178.4],[-178.2,-152.4],[-172.2,-143.9],[-176.6,-137.6],[-180.3,-132.2],[-184.8,-138.5],[-197.9,-157.4],[-217.6,-129.2],[-195.0,-123.7],[-187.4,-121.9],[-195.3,-110.4],[-225.3,-118.1],[-242.0,-122.4],[-242.9,-122.6],[-239.0,-128.4],[-225.5,-147.6],[-205.1,-177.0]]
/** way/1222070393 */
const Z15: XY[] = [[-217.6,-129.2],[-197.9,-157.4],[-184.8,-138.5],[-195.0,-123.7]]
/** way/1222070392 */
const Z7: XY[] = [[-187.4,-121.9],[-195.0,-123.7],[-184.8,-138.5],[-180.3,-132.2],[-181.2,-130.9],[-186.5,-123.2]]
/** way/1222070389 */
const Z8: XY[] = [[-186.5,-123.2],[-161.7,-105.1],[-160.5,-106.6],[-159.3,-108.4],[-158.0,-110.4],[-156.6,-112.4],[-155.5,-114.1],[-166.3,-120.9],[-181.2,-130.9]]
/** way/1222070390 */
const Z4: XY[] = [[-181.2,-130.9],[-166.3,-120.9],[-161.8,-127.5],[-176.6,-137.6],[-180.3,-132.2]]
/** way/1375084073 */
const WALK: XY[] = [[-5.1,222.3],[-1.9,217.3],[113.5,186.0],[117.7,188.1],[113.8,190.7],[113.3,190.5],[1.1,221.3],[0.3,222.7]]
/** way/401466360 */
const HUT: XY[] = [[25.8,259.8],[20.2,261.1],[19.3,257.2],[17.1,257.7],[16.0,253.1],[18.2,252.6],[18.5,254.2],[20.6,253.7],[24.1,252.9]]
/** way/401466258 */
const PAV: XY[] = [[14.4,-92.4],[1.0,-93.6],[7.9,-158.7],[17.8,-157.8],[16.1,-126.2]]
/** way/401466277 */
const P1: XY[] = [[94.4,29.7],[97.0,19.7],[114.6,24.0],[115.3,26.5],[113.6,32.5],[111.9,33.8]]
/** way/401466288 */
const P2: XY[] = [[52.9,84.2],[61.3,78.1],[71.5,92.2],[71.3,94.3],[65.8,98.4],[63.0,98.0]]
/** way/401466294 */
const P3: XY[] = [[91.8,-38.3],[86.9,-47.4],[102.8,-54.9],[105.8,-54.6],[108.7,-48.3],[108.2,-46.1]]
/** way/401466297 */
const P4: XY[] = [[-99.7,14.0],[-117.2,15.6],[-118.7,14.1],[-119.3,6.8],[-118.2,5.5],[-100.4,3.7]]
/** way/401466309 */
const P5: XY[] = [[-74.4,66.8],[-67.0,74.4],[-79.4,86.2],[-81.7,86.1],[-86.5,81.4],[-86.3,78.9]]
/** way/401466312 */
const P6: XY[] = [[-85.7,-53.1],[-100.5,-63.5],[-100.4,-65.4],[-96.4,-70.9],[-94.2,-71.0],[-80.1,-61.4]]
/** way/401466318 */
const P7: XY[] = [[-13.8,98.2],[-3.6,99.1],[-5.0,116.6],[-6.6,118.0],[-14.0,117.7],[-14.8,115.3]]
/** aeroway=jet_bridge centre lines (OSM ways 1222070363–401, 1222001494–500) */
const JETS: XY[][] = [
  [[-225.3,-118.1],[-228.5,-106.9],[-208.6,-98.6]],
  [[-242.0,-122.4],[-252.1,-117.9],[-253.7,-113.5],[-273.5,-114.1]],
  [[-265.6,-125.9],[-246.3,-134.0],[-239.0,-128.4]],
  [[-225.5,-147.6],[-232.9,-153.1],[-255.0,-147.8]],
  [[-205.1,-177.0],[-213.3,-181.5],[-203.0,-200.5]],
  [[-196.9,-178.4],[-189.8,-182.6],[-181.5,-170.2],[-178.7,-172.0],[-157.6,-178.9]],
  [[-178.2,-152.4],[-171.9,-157.2],[-166.5,-149.3],[-163.5,-144.9],[-161.5,-146.1],[-143.9,-137.8]],
  [[-166.5,-149.3],[-164.7,-150.6],[-156.9,-167.9]],
  [[-200.8,156.8],[-205.1,148.1],[-221.0,153.1]],
  [[-163.1,214.5],[-161.0,227.8],[-156.7,229.5],[-161.4,247.8]],
  [[-168.2,211.0],[-175.8,218.6],[-172.1,236.2]],
  [[-185.1,194.6],[-192.3,202.4],[-198.1,218.8]],
  [[-209.8,170.5],[-216.3,177.6],[-226.5,169.8],[-233.0,164.8]],
  [[-177.1,145.7],[-181.4,136.7],[-161.8,124.3]],
  [[-156.8,201.0],[-145.9,206.0],[-134.4,187.0]],
  [[-248.9,53.3],[-243.7,63.9],[-222.8,57.1]],
  [[-264.9,60.5],[-269.8,69.3],[-267.6,74.1],[-244.4,73.1]],
  [[-265.6,53.2],[-275.5,53.8],[-286.3,68.5]],
  [[-267.8,30.0],[-277.6,30.9],[-292.4,40.9]],
  [[-270.4,3.9],[-289.4,2.2],[-290.6,-14.5]],
  [[-271.2,-4.5],[-280.8,-3.4],[-285.9,-25.2]],
  [[-254.1,-8.0],[-251.6,-16.9],[-277.4,-26.5]],
  [[-228.4,-1.2],[-226.1,-10.6],[-205.3,-8.1]],
  [[-50.7,264.1],[-51.6,274.2],[-72.8,273.5]],
  [[7.2,268.7],[6.5,278.4],[-1.1,297.7]],
  [[14.4,268.1],[23.8,275.8],[28.0,274.8],[33.7,289.0]],
  [[10.1,253.0],[21.2,249.9],[18.0,228.2]],
  [[-41.2,223.6],[-50.6,219.3],[-44.2,198.2]],
  [[-52.2,247.2],[-61.5,243.0],[-72.8,261.2]]
]

// ===========================================================================
// Terminal 1
// ===========================================================================

/**
 * T1's board-marked concrete: warm mid grey-beige in the daylight photos
 * (about #bdb6aa), pulled to the palette's lightness. The kit's lighter
 * `CDG.concrete` stays for Terminal 2's later, paler concrete.
 */
const T1_CONCRETE = finish('cdg-t1-concrete', 0xc4bdb1)

/** The apron and satellites' ground over the sunken ring's floor (terrain). */
const AP = 12.5
/** Base glazing, pier ring, soffit, drum. */
const R_BASE = 80.5, R_PIER = 87, Z_SOFFIT = 16.5, Z_SHAFT = 11.2
const DECK = 33.8, INNER_DECK = 29.6, R_STEP = 52, R_COURT = 22, R_OCULUS = 17.5, Z_OCULUS = 26.5

/** The escalator tubes across the court: [from angle °, z] → [to angle °, z]. */
const TUBES: [number, number, number, number][] = [
  [208, 2.6, 338, 12.5],
  [152, 10.0, 30, 19.5],
  [250, 10.5, 105, 20.5],
  [292, 15.5, 72, 24.0],
  [118, 2.6, 182, 9.0],
  [350, 3.0, 262, 7.5],
]

function buildDrum(detail: boolean) {
  const M: Mats = newMats(['con', 'deck', 'win', 'white', 'metal', 'base'])
  const seg = detail ? 96 : 40

  // --- the base: glazed drum under the soffit, with the road-deck galleries ---
  lathe(M.base, [[R_BASE, 0], [R_BASE, Z_SOFFIT]], seg)
  for (const z of [6.3, 11.0]) lathe(M.con, detail ? [[R_BASE - 0.1, z - 1.3], [R_BASE + 3.6, z - 1.3], [R_BASE + 3.6, z + 0.2], [R_BASE + 3.2, z + 0.2], [R_BASE + 3.2, z], [R_BASE - 0.1, z]] : [[R_BASE - 0.1, z - 1.3], [R_BASE + 3.6, z - 1.3], [R_BASE + 3.6, z], [R_BASE - 0.1, z]], seg / 2)
  if (detail) for (let k = 0; k < 64; k++) { // mullions of the base glazing
    const a = (2 * Math.PI * (k + 0.5)) / 64, t: XY = [-Math.sin(a), Math.cos(a)], c: XY = [R_BASE * Math.cos(a), R_BASE * Math.sin(a)]
    const A: XY = [c[0] - t[0] * 0.25, c[1] - t[1] * 0.25], B: XY = [c[0] + t[0] * 0.25, c[1] + t[1] * 0.25]
    const o: XY = [Math.cos(a) * 0.12, Math.sin(a) * 0.12]
    M.white.quad([A[0] + o[0], A[1] + o[1], 0], [B[0] + o[0], B[1] + o[1], 0], [B[0] + o[0], B[1] + o[1], Z_SOFFIT], [A[0] + o[0], A[1] + o[1], Z_SOFFIT])
  }

  // --- sixteen piers with Y heads; the main (south) axis falls between two ---
  const yHead: XY[] = [[-2.1, Z_SHAFT - 0.6], [2.1, Z_SHAFT - 0.6], [6.4, Z_SOFFIT - 1.3], [8.4, Z_SOFFIT + 0.05], [2.9, Z_SOFFIT + 0.05], [0, 15.0], [-2.9, Z_SOFFIT + 0.05], [-8.4, Z_SOFFIT + 0.05], [-6.4, Z_SOFFIT - 1.3]]
  for (let k = 0; k < 16; k++) {
    const a = -90 + 11.25 + k * 22.5, ar = (a * Math.PI) / 180
    const out: V3 = [Math.cos(ar), Math.sin(ar), 0], t: V3 = [-Math.sin(ar), Math.cos(ar), 0]
    const r0 = R_PIER - 3, d = 6
    const o: V3 = [out[0] * r0, out[1] * r0, 0]
    // the shaft
    const sq: XY[] = [[-2.1, 1], [2.1, 1], [2.1, d - 1], [-2.1, d - 1]].map(([s, w]) => [o[0] + t[0] * s + out[0] * w, o[1] + t[1] * s + out[1] * w] as XY)
    prismRing(M.con, sq, 0, Z_SHAFT, null)
    // the Y, extruded radially
    extrude(M.con, yHead, o, t, out, d)
  }

  // --- the soffit and its rounded edge, the banded drum, coping and parapet ---
  // the drum turns under in a broad quarter-round (photos: the sign band's lower edge)
  const RQ = 3.2, qc: XY = [93.85 - RQ, Z_SOFFIT + RQ]
  lathe(M.con, [[R_BASE - 0.2, Z_SOFFIT], ...Array.from({ length: detail ? 7 : 4 }, (_, i) => { const t = (Math.PI / 2) * (i / (detail ? 6 : 3)); return [qc[0] + RQ * Math.sin(t), qc[1] - RQ * Math.cos(t)] as [number, number] })], seg)
  // four bands, each a little proud of the one below, with a tucked joint
  const bands: [number, number, number][] = [[93.85, Z_SOFFIT + RQ, 22.4], [94.1, 22.4, 26.3], [94.35, 26.3, 30.1], [94.6, 30.1, 33.3]]
  // each band: a recessed joint line in a darker grey at its foot, then its face, a little proud of the band below
  bands.forEach(([r, z0, z1], i) => {
    if (i > 0) {
      const rp = bands[i - 1][0]
      lathe(M.con, [[rp, z0], [r - 0.35, z0]], seg) // the step in, facing up
      lathe(M.metal, [[r - 0.35, z0], [r - 0.35, z0 + 0.55], [r, z0 + 0.55]], seg) // the joint line and its lip
    }
    lathe(M.con, [[r, i > 0 ? z0 + 0.55 : z0], [r, z1]], seg)
  })
  lathe(M.con, [[94.6, 33.3], [94.95, 33.6], [94.95, 34.4], [93.2, 34.4], [93.2, DECK]], seg)

  // --- the roof: outer car-park deck, the step down to the inner deck, the court's collar ---
  lathe(M.deck, [[93.2, DECK], [R_STEP, DECK]], seg)
  lathe(M.white, [[R_STEP, DECK + 0.6], [R_STEP + 0.4, DECK + 0.6], [R_STEP + 0.4, DECK]], seg / 2)
  lathe(M.white, [[R_STEP, DECK + 0.6], [R_STEP, INNER_DECK]], seg)
  lathe(M.win, [[R_STEP - 0.06, INNER_DECK + 2.6], [R_STEP - 0.06, INNER_DECK + 0.9]], seg) // the glazed band in the step's face
  lathe(M.deck, [[R_STEP, INNER_DECK], [R_COURT + 1, INNER_DECK]], seg)
  const cs = detail ? 48 : 20
  lathe(M.con, [[R_COURT + 1, INNER_DECK], [R_COURT + 1, 33.0], [R_OCULUS, 33.0], [R_OCULUS, Z_OCULUS], [R_COURT, Z_OCULUS], [R_COURT, Z_OCULUS - 1.2]], cs)
  // the court's own walls: glazed floors between concrete floor bands, facing in
  lathe(M.win, [[R_COURT + 0.05, Z_OCULUS - 1.2], [R_COURT + 0.05, 0]], cs)
  for (const z of detail ? [5.2, 10.4, 15.6, 20.8] : [7.8, 18.2]) lathe(M.con, [[R_COURT - 0.15, z + 0.9], [R_COURT - 0.15, z - 0.4]], cs)
  if (detail) for (let k = 0; k < 24; k++) { // the court's concrete columns
    const a = (2 * Math.PI * (k + 0.5)) / 24, c: XY = [(R_COURT - 0.3) * Math.cos(a), (R_COURT - 0.3) * Math.sin(a)]
    prismRing(M.con, [[c[0] - 0.4, c[1] - 0.4], [c[0] + 0.4, c[1] - 0.4], [c[0] + 0.4, c[1] + 0.4], [c[0] - 0.4, c[1] + 0.4]], 0, Z_OCULUS - 1.2, null)
  }

  // --- the escalator tubes crossing the court ---
  const ends: [V3, V3][] = TUBES.map(([a0, z0, a1, z1]) => {
    const A: XY = [Math.cos((a0 * Math.PI) / 180) * (R_COURT + 1), Math.sin((a0 * Math.PI) / 180) * (R_COURT + 1)]
    const B: XY = [Math.cos((a1 * Math.PI) / 180) * (R_COURT + 1), Math.sin((a1 * Math.PI) / 180) * (R_COURT + 1)]
    return [[A[0], A[1], z0], [B[0], B[1], z1]]
  })
  for (const [A, B] of ends) {
    tube(M.metal, A, B, 1.8, detail ? 14 : 8, false)
    if (detail) { // the glass top: a pale ridge along the crown
      tube(M.white, [A[0], A[1], A[2] + 1.75], [B[0], B[1], B[2] + 1.75], 0.35, 6, false)
    }
  }

  // --- rooftop: four lift towers and the white ramp houses ---
  const towers = [100, 190, 268, 8]
  for (const a of towers) {
    const c = rot([57, 0], a)
    const sq: XY[] = [[-6, -6], [6, -6], [6, 6], [-6, 6]].map((q) => { const r = rot(q as XY, a); return [c[0] + r[0], c[1] + r[1]] as XY })
    prismRing(M.con, sq, INNER_DECK - 0.3, DECK, null)
    frustum(M.con, sq, DECK, DECK + 6.5, 1.2)
    if (detail) prismRing(M.deck, sq.map(([x, y]) => [c[0] + (x - c[0]) * 0.6, c[1] + (y - c[1]) * 0.6] as XY), DECK + 6.5, DECK + 6.8, M.deck)
  }
  const houses: number[] = []
  for (const g of [0, 90, 180, 270]) for (let k = 0; k < 6; k++) houses.push(g - 21.25 + k * 8.5)
  for (const a of houses) {
    const box: XY[] = [[66, -4.5], [91, -4.5], [91, 4.5], [66, 4.5]].map((q) => rot(q as XY, a))
    prismRing(M.con, box, DECK - 0.2, DECK + 1.8, null)
    capPoly(M.white, box.map((q) => q), DECK + 1.8)
    if (detail) { // the dark ramp opening along the house's side
      const o = box.map((q) => q)
      const A = o[0], B = o[1], n: XY = [(B[1] - A[1]) / 28, (A[0] - B[0]) / 28]
      const s = (t: number): XY => [A[0] + (B[0] - A[0]) * t + n[0] * 0.06, A[1] + (B[1] - A[1]) * t + n[1] * 0.06]
      M.deck.quad([...s(0.08), DECK + 0.3] as V3, [...s(0.92), DECK + 0.3] as V3, [...s(0.92), DECK + 1.4] as V3, [...s(0.08), DECK + 1.4] as V3)
    }
  }

  // --- the passage heads at the edge of the sunken ring, and the trench pavilion ---
  // (the seven passage heads, OSM 5–7 m at the ring's edge, sit under the map's terrain there and are left to the map)
  prismRing(M.con, PAV, 0, 3.6, M.deck)

  return mats(M)
}

/** The six materials, in the order both levels write them. */
const mats = (M: Mats) => [
  { part: M.con, material: T1_CONCRETE },
  { part: M.deck, material: CDG.deck },
  { part: M.win, material: CDG.window },
  { part: M.white, material: CDG.white },
  { part: M.metal, material: CDG.metal },
  { part: M.base, material: CDG.shade },
]

// ===========================================================================
// The satellites, on the apron
// ===========================================================================

/** The freestanding satellite buildings (see the header). */
type Sat = 'satellites-t-w' | 'X' | 'Y' | 'Z'

/** Which satellite each jet bridge belongs to: the one whose outline is nearest its first point. */
function jetsOf(rings: XY[][]) {
  const all: [XY[], XY[]][] = [[SAT_T, SAT_T], [SAT_V, SAT_V], [JUNCTION, JUNCTION], [SAT_W, SAT_W], [SAT_X, SAT_X], [SAT_Y, SAT_Y], [SAT_Z, SAT_Z]]
  const near = (q: XY) => { let best = Infinity, ring: XY[] | null = null; for (const [r] of all) for (const v of r) { const d = Math.hypot(v[0] - q[0], v[1] - q[1]); if (d < best) { best = d; ring = r } } return ring }
  return JETS.filter((j) => rings.includes(near(j[0])!))
}

/**
 * One satellite model, still in the drum's frame: its walls start on the
 * apron (z = AP, which becomes its own y = 0 when it is moved to its
 * anchor). The original model sank them 1.5 m below the apron; the sills
 * here are 1.5 m shorter, so everything above the apron is unchanged.
 */
function buildSat(detail: boolean, which: Sat) {
  const M: Mats = newMats(['con', 'deck', 'win', 'white', 'metal', 'base'])
  const S = { wall: M.con, win: M.win, trim: M.white, roof: M.con }
  const z0 = AP, sill = detail ? 0.5 : 0, rows = detail ? [AP + 3.6] : []
  const bay = detail ? 6 : 12
  const sm = (r: XY[]) => (detail ? r : simplify(ccw(r), 1.2))
  const sat = (body0: XY[], lantern: XY[], low0: XY[][], arms0: [XY[], number][]) => {
    const body = sm(body0), low = low0.map(sm), arms = arms0.map(([r, h]) => [sm(r), h] as [XY[], number])
    glassBlock(S, body, z0, AP + 10, { fascia: 1.6, sill, bay, rows })
    glassBlock(S, lantern, z0, AP + 10, { fascia: 1.6, sill })
    frustum(M.white, lantern, AP + 10, AP + 15, 5.5, M.white)
    for (const r of low) glassBlock(S, r, z0, AP + 7, { fascia: 1.2, sill })
    for (const [r, h] of arms) glassBlock(S, r, z0, AP + h, { fascia: 1.0, sill: 0 })
  }
  const plain = (r: XY[]) => { // no parts in OSM: body and a lantern over its middle
    const c = centroid(ccw(r)), hull = ccw(r)
    const lan = hull.filter((_, i) => i % 2 === 0).map(([x, y]) => [c[0] + (x - c[0]) * 0.42, c[1] + (y - c[1]) * 0.42] as XY)
    glassBlock(S, sm(r), z0, AP + 10, { fascia: 1.6, sill, bay, rows })
    frustum(M.white, lan, AP + 10, AP + 14, 3, M.white)
  }
  let rings: XY[][]
  if (which === 'satellites-t-w') {
    sat(W10, W15, [], [[W8, 8], [W4, 4]])
    for (const r of [SAT_T, SAT_V]) plain(r)
    prismRing(M.con, HUT, z0, AP + 3, M.metal)
    // --- the 2022 junction of satellites 1–3, and the footbridge from W ---
    glassBlock(S, sm(JUNCTION), z0, AP + 20, { fascia: 2.2, sill: 0, bay: detail ? 7.5 : 15, rows: detail ? [AP + 6.5, AP + 12.5] : [AP + 9.5] })
    glassBlock(S, WALK, AP + 4.5, AP + 8.5, { fascia: 0.9, sill: 0.6 })
    capPoly(M.white, WALK, AP + 4.5, false)
    for (let t = 0.1; t < 1; t += 0.2) {
      const a: XY = [-1.9 + (113.5 + 1.9) * t, 217.3 + (186.0 - 217.3) * t + 2.5]
      prismRing(M.con, [[a[0] - 0.5, a[1] - 0.5], [a[0] + 0.5, a[1] - 0.5], [a[0] + 0.5, a[1] + 0.5], [a[0] - 0.5, a[1] + 0.5]], z0, AP + 4.5, null)
    }
    rings = [SAT_T, SAT_V, JUNCTION, SAT_W]
  } else if (which === 'X') { sat(X10, X15, [X7], [[X8, 8], [X4, 4]]); rings = [SAT_X] }
  else if (which === 'Y') { sat(Y10, Y15, [Y7], [[Y8, 8], [Y4, 4]]); prismRing(M.con, YB, z0, AP + 4, M.metal); rings = [SAT_Y] }
  else { sat(Z10, Z15, [Z7], [[Z8, 8], [Z4, 4]]); rings = [SAT_Z] }

  // --- jet bridges ---
  for (const j of jetsOf(rings)) jetLine(M.metal, j, AP + 3.6, AP + 6.4, detail ? 3.2 : 3.4, z0, detail ? 8 : 0)
  return mats(M)
}

/** Move built parts (already in glTF's frame) so (east, north, up) = `o` becomes the origin. */
function moveTo(parts: ReturnType<typeof mats>, o: V3) {
  for (const { part } of parts) for (let i = 0; i < part.pos.length; i += 3) { part.pos[i] -= o[0]; part.pos[i + 1] -= o[2]; part.pos[i + 2] += o[1] }
  return parts
}

/** Closest approach of the tubes to one another (they must not touch). */
function checkTubes() {
  const pts = TUBES.map(([a0, z0, a1, z1]) => [[Math.cos((a0 * Math.PI) / 180) * R_COURT, Math.sin((a0 * Math.PI) / 180) * R_COURT, z0], [Math.cos((a1 * Math.PI) / 180) * R_COURT, Math.sin((a1 * Math.PI) / 180) * R_COURT, z1]] as [V3, V3])
  let worst = Infinity
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    let best = Infinity
    for (let s = 0; s <= 40; s++) for (let t = 0; t <= 40; t++) {
      const a = pts[i][0].map((v, k) => v + (pts[i][1][k] - v) * (s / 40)), b = pts[j][0].map((v, k) => v + (pts[j][1][k] - v) * (t / 40))
      best = Math.min(best, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]))
    }
    if (best < 4) console.warn(`tubes ${i} and ${j} pass ${best.toFixed(1)} m apart`)
    worst = Math.min(worst, best)
  }
  return worst
}

/** Area centroid of several outlines together. */
const centroidOf = (rings: XY[][]): XY => {
  let A = 0, x = 0, y = 0
  for (const r0 of rings) { const r = ccw(r0), c = centroid(r), a = area(r); A += a; x += c[0] * a; y += c[1] * a }
  return [x / A, y / A]
}
const LNG0 = 2.5418484, LAT0 = 49.0144005
const lngLat = ([x, y]: XY) => [+(LNG0 + x / (Math.cos((LAT0 * Math.PI) / 180) * 111320)).toFixed(7), +(LAT0 + y / 110574).toFixed(7)]

/** The satellite models: id, name, key, anchor outlines, OSM way for `osm`, height over the apron. */
export const SATS: { id: string; name: string; which: Sat; rings: XY[][]; osm: string; height: number }[] = [
  { id: 'paris-cdg-terminal-1-satellites-t-w', name: 'Paris-CDG Terminal 1 Satellites T–W', which: 'satellites-t-w', rings: [SAT_T, JUNCTION, SAT_V, SAT_W], osm: 'way/967374659', height: 20 },
  { id: 'paris-cdg-terminal-1-satellite-x', name: 'Paris-CDG Terminal 1 Satellite X', which: 'X', rings: [SAT_X], osm: 'way/172859851', height: 15 },
  { id: 'paris-cdg-terminal-1-satellite-y', name: 'Paris-CDG Terminal 1 Satellite Y', which: 'Y', rings: [SAT_Y], osm: 'way/172859843', height: 15 },
  { id: 'paris-cdg-terminal-1-satellite-z', name: 'Paris-CDG Terminal 1 Satellite Z', which: 'Z', rings: [SAT_Z], osm: 'way/172956328', height: 15 },
]

if (import.meta.main) {
  checkTubes()
  const extras = { bearing: 0, osm: 'way/171883502', height: DECK + 6.5 }
  writeLod('Paris-CDG Terminal 1', 'paris-cdg-terminal-1.glb', buildDrum(false), extras, 8000, 250_000)
  writeLod('Paris-CDG Terminal 1', 'paris-cdg-terminal-1.detail.glb', buildDrum(true), extras, 40_000, 1_500_000)
  for (const m of SATS) {
    const c = centroidOf(m.rings), o: V3 = [c[0], c[1], AP]
    console.log(`${m.id}: anchor ${c.map((v) => v.toFixed(1)).join(', ')} in the drum's frame = lng, lat ${lngLat(c).join(', ')}`)
    const ex = { bearing: 0, osm: m.osm, height: m.height }
    writeLod(m.name, `${m.id}.glb`, moveTo(buildSat(false, m.which), o), ex, 8000, 250_000)
    writeLod(m.name, `${m.id}.detail.glb`, moveTo(buildSat(true, m.which), o), ex, 40_000, 1_500_000)
  }
}
