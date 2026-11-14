/**
 * The Albert Memorial, Kensington Gardens, London (Sir George Gilbert Scott,
 * 1862-1875; statue of Prince Albert by John Henry Foley and Thomas Brock,
 * 1875): original procedural geometry, CC0-1.0.
 * bun generators/london-albert-memorial.ts
 * Writes models/london-albert-memorial.glb (low, 6,500-triangle allowance) and
 * models/london-albert-memorial.detail.glb (detail, detailZoom 16).
 *
 * This file also holds the small sculpture kit (`place`, `figure`, `animal`,
 * `pointedArchWall`, ...) that london-wellington-arch.ts imports for its
 * Quadriga, so it must be merged before that model.
 *
 * Map frame, turned to BEARING 353.5 (the axis of the memorial and its
 * platform, from the OSM outline): +y (model north) is compass 353.5, so
 * Albert faces -y, south, towards the Royal Albert Hall. z up, metres;
 * z = 0 is the lowest ground under the footprint, the path at the foot of the
 * south steps. Origin = the area centroid of the platform, OSM way/372965954.
 * The memorial itself is centred 4.1 m north and 0.4 m east of that (the
 * centroid of the canopy outline way/372965957 and of the four continent
 * groups, ways 372965958-61), so everything is built about C = (0.4, 4.1)...
 * in the code `C` below.
 *
 * What makes it the Albert Memorial, and how each is drawn
 * - The canopy (ciborium): four slender corner piers, each a cluster of four
 *   polished pink-granite shafts round a dark core with dark capitals,
 *   carrying four wide, tall pointed arches (6.5 m span, apex 19.9 m) - real
 *   through openings framing Albert, with a crossing vault inside; the gilt inscription
 *   frieze and cornice; a mosaic gable on each face (gold tympanum, gilt
 *   crocketed raking edges); a crossing of steep dark roofs behind the gables;
 *   a tall slender pinnacle on each corner.
 * - The spire: stacked octagonal stages, each stepping in to about 80% of the
 *   one below and tapering: the dark stage with gilt panels and the gilt
 *   Virtues on its ledge, the arcaded lantern (real pointed openings, a gilt
 *   figure inside in the detail model) with corner pinnacles, a narrower dark
 *   stage, then two gilt stages with a tier of four winged gilt angels at
 *   each, the gilt orb and the cross to 54 m.
 * - Prince Albert, seated, fully gilt, under the canopy facing south on his
 *   granite pedestal: head, torso, robes, legs, the catalogue of the Great
 *   Exhibition on his knee.
 * - The podium with the white marble Parnassus frieze (relief figures in the
 *   detail model), on a pink granite base; the four marble groups of
 *   Agriculture, Manufactures, Commerce and Engineering on its corners.
 * - The broad stepped pyramid of grey granite steps on all four sides (6
 *   tiers low, 16 detail) rising to the podium, on a base tier 41.6 m square
 *   that carries the corner plinths and the gilt railing. The flat paved
 *   surround of OSM's platform outline beyond it is left to the map (paving
 *   is ground); the base tier runs down to z = 0, so its south side stands
 *   proud where the ground falls to the path.
 * - The four continent groups on their granite plinths at the outer corners,
 *   each round its animal: Europe (south-west, a bull), Asia (south-east, a
 *   kneeling elephant), Africa (north-east, a camel), America (north-west, a
 *   bison), with seated and standing figures. Real figure and animal forms
 *   (heads, bodies, legs, trunks, horns, humps), bold and simplified.
 *
 * Sources
 * - OSM: platform way/372965954 (Historic England 1217741, wikidata Q281465);
 *   canopy way/372965957; continent groups way/372965958 (America),
 *   372965959 (Asia), 372965960 (Africa), 372965961 (Europe); the two cheek
 *   blocks of the south steps way/372965963 and way/372965964 (not
 *   modelled, and not replaced: the map draws them).
 *   (c) OpenStreetMap contributors, ODbL.
 * - Lidar: Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government
 *   Licence v3.0 (flights 2000s-2022): outer platform 2.7 m above the south
 *   path (z = 0); podium top 7.3; spire read to 47.4 (the angels; the cross is
 *   too thin for a 1 m grid); continent groups to ~7.4 (plinth + group).
 * - Published: 176 ft (54 m) tall (Wikipedia "Albert Memorial"; Historic
 *   England list entry 1217741). Albert's statue about 14 ft (4.3 m) seated.
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Albert Memorial, London - May 2008.jpg", David Iliff (Diliff), CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Albert_Memorial,_London_-_May_2008.jpg
 *     (south front, level and distant: every stage height, scaled);
 *   "Albert Memorial London July 2015-4.jpg", Alvesgaspar, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Albert_Memorial_London_July_2015-4.jpg
 *     (north side, level: podium, frieze, steps, spire tiers);
 *   "Albert Memorial London 2020 03 Detail.jpg", Julian Herzog, CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Albert_Memorial_London_2020_03_Detail.jpg
 *     (the spire: Virtues, lantern, angels, orb and cross; gables, pinnacles);
 *   "Albert Memorial London 2020 04.jpg", Julian Herzog, CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Albert_Memorial_London_2020_04.jpg
 *   "Albert Memorial, Londres, Inglaterra, 2022-11-25, DD 04.jpg", Diego Delso, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Albert_Memorial,_Londres,_Inglaterra,_2022-11-25,_DD_04.jpg
 *     (south-east: the Asia group and elephant, the plinths, railing, steps);
 *   "Albert Memorial, Londres, Inglaterra, 2022-11-25, DD 01.jpg", Diego Delso, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Albert_Memorial,_Londres,_Inglaterra,_2022-11-25,_DD_01.jpg
 *     (south front with the outer steps);
 *   "Albert Memorial, Londres, Inglaterra, 2022-11-25, DD 93-95 HDR.jpg", Diego Delso, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Albert_Memorial,_Londres,_Inglaterra,_2022-11-25,_DD_93-95_HDR.jpg
 *     (night: the canopy, statue and spire floodlit).
 * - Look-only: none.
 *
 * Measured / published / estimated
 * - Measured (lidar): outer platform 2.7; the landing at the top of the
 *   steps 5.1; the canopy floor 7.3 (modelled 7.6, see doubts); overall
 *   height checked against the 47.4 m spire reading.
 * - Published: 54 m overall. Modelled 54.0 m to the top of the cross above the
 *   south path.
 * - Estimated from the photos (scaled by the canopy's OSM width, 9.6 m, and
 *   the lidar levels): steps 2.7-5.1, podium 5.1-7.6 (17 m square), piers
 *   and columns, arch spring 16.8 and apex 19.9, cornice 22.4-23.6, gable
 *   apex 30.3, corner pinnacles to 35.6, spire stages (radius 2.15 / 1.72 /
 *   1.38 / 1.1 / 0.88 m) to 33.8 / 38.6 / angels at 42.0 and 45.5 / orb
 *   49.2 / cross 54.0, the continent plinths (2.2 m) and
 *   groups (to ~2.8 m above them), the railing (1.9 m).
 * - Invented: the exact poses of every figure in the groups (each group is
 *   drawn as its subject: its animal and three or four figures), the frieze
 *   figures (a rhythm of standing figures, not the real 169 portraits).
 *
 * Doubts
 * - The lidar does not resolve the podium as a block: it reads a smooth rise
 *   from the 5.1 m landing to 7.1-7.3 m. Every photo shows a frieze podium
 *   about as tall as the steps, so the model has steps 2.7-5.1 and a 2.5 m
 *   podium to 7.6 (0.3 m over the lidar), and builds the canopy on that.
 * - Low model: the continent groups are their animals only (the riders and
 *   attendant figures are in the detail model), to stay under 250 KB; the
 *   frieze reliefs, pier bronzes and the lantern figure are detail-only too.
 * - The continent groups' animals face outward on the diagonal; their real
 *   orientations vary a little.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { smooth, solid, tube, ellipsoid, slab, lathe, face, TAU } from './nyc-columbus-monument'
import { writeModel, box, cbox } from './london-buckingham-palace'

export const BEARING = 353.5

// ===========================================================================
// Sculpture kit (shared with london-wellington-arch.ts)
// ===========================================================================

/** Quality: the low model and the detail model share every builder. */
export type Q = { tube: number; ell: number; rows: number; ring: number; detail: boolean }
export const LOW: Q = { tube: 4, ell: 5, rows: 3, ring: 5, detail: false }
export const HIGH: Q = { tube: 7, ell: 9, rows: 4, ring: 10, detail: true }

/** An ellipse ring (counter-clockwise from above) at height z. */
export const ell = (cx: number, cy: number, z: number, rx: number, ry: number, n: number): V3[] =>
  Array.from({ length: n }, (_, i): V3 => [cx + rx * Math.cos(i * TAU / n), cy + ry * Math.sin(i * TAU / n), z])

/**
 * Place what `build` makes in a local frame (x = its right, y = forward, z up)
 * into `dst`: scaled by k, rolled about local y by `roll`, pitched about
 * local x by `pitch` (nose up positive), turned by `yaw` about z, moved to
 * `at`; smooth-shaded.
 */
export function place(dst: Part, at: V3, yaw: number, k: number, build: (q: Part) => void, crease = 88, pitch = 0, roll = 0) {
  smooth(dst, (q) => {
    build(q)
    const c = Math.cos(yaw), s = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), cr = Math.cos(roll), sr = Math.sin(roll)
    for (let i = 0; i < q.pos.length; i += 3) {
      // Part stores glTF (x, z, -y): map x = X, y = -Z, z = Y.
      let x = q.pos[i] * k, y = -q.pos[i + 2] * k, z = q.pos[i + 1] * k
      ;[x, z] = [x * cr - z * sr, x * sr + z * cr]
      ;[y, z] = [y * cp - z * sp, y * sp + z * cp]
      const X = at[0] + x * c - y * s, Y = at[1] + x * s + y * c, Z = at[2] + z
      q.pos[i] = X; q.pos[i + 1] = Z; q.pos[i + 2] = -Y
    }
  }, crease)
}

/** The yaw that turns local +y (forward) to face the direction (dx, dy). */
export const facing = (dx: number, dy: number) => Math.atan2(dy, dx) - Math.PI / 2

/** A wing from `root`: a broad covert blade and long primaries. side +1 right, -1 left. */
export function wing(q: Part, Q: Q, root: V3, side: 1 | -1, span: number, lift: number, back: number) {
  const U: V3 = [side * Math.cos(lift) * Math.cos(back), -Math.sin(back) * Math.cos(lift), Math.sin(lift)]
  const up: V3 = [-side * Math.sin(lift) * 0.6, -0.3, Math.cos(lift)]
  const t = Math.max(0.05, span * 0.06)
  slab(q, root, U, up, [[0, -0.28 * span], [0.7 * span, -0.2 * span], [0.95 * span, 0.08 * span], [0.5 * span, 0.28 * span], [0.05 * span, 0.22 * span]], t * 1.4)
  const blades = Q.detail ? 2 : 0
  for (let b = 0; b < blades; b++) {
    const f = blades > 1 ? b / (blades - 1) : 0.5
    const tip = span * (1.05 - 0.2 * f), dz = -0.22 * span * f
    slab(q, root, U, up, [[0.35 * span, dz - 0.12 * span], [tip, dz + 0.02 * span], [tip * 0.97, dz + 0.14 * span], [0.4 * span, dz + 0.12 * span]], t)
  }
}

export type FigureOpts = {
  /** Shoulder→elbow→hand paths, in units of h, local frame. */
  arms: V3[][]
  seated?: boolean
  /** Robe to the ground (default) or legs showing (a nude or a boy). */
  legs?: boolean
  wings?: { span: number; lift: number; back: number }
  stride?: number
  lean?: number
  helmet?: boolean
  crown?: boolean
  girth?: number
}

/**
 * A human figure facing +y, feet at the origin, h tall to the top of the head
 * (standing), or h from the feet to the top of the head when seated (the
 * seat at ~0.33 h, at the origin's level + 0.33 h).
 */
export function figure(q: Part, Q: Q, h: number, o: FigureOpts) {
  const H = (x: number, y: number, z: number): V3 => [x * h, y * h, z * h]
  const G = o.girth ?? 1.25, lean = o.lean ?? 0
  const r = (z: number, rx: number, ry: number, dy = 0) => ell(0, dy * h, z * h, rx * h * G, ry * h * G, Q.ring)
  if (!Q.detail) return figureLite(q, Q, h, o, G, lean, r, H)
  if (o.seated) {
    // Thighs forward from the hips, shins down to the feet, the robe between.
    for (const s of [-1, 1]) {
      tube(q, [H(s * 0.09, -0.04, 0.36), H(s * 0.1, 0.2, 0.37), H(s * 0.105, 0.28, 0.35)], [0.085 * h * G, 0.08 * h * G, 0.07 * h * G], Q.tube)
      tube(q, [H(s * 0.105, 0.28, 0.33), H(s * 0.11, 0.32, 0.12), H(s * 0.11, 0.34, 0.02)], [0.065 * h * G, 0.055 * h * G, 0.05 * h * G], Q.tube)
      if (Q.detail) ellipsoid(q, H(s * 0.11, 0.38, 0.025), [0.04 * h, 0.08 * h, 0.03 * h], 6, 3)
    }
    if (!o.legs) solid(q, [ell(0, 0.24 * h, 0, 0.26 * h, 0.15 * h, Q.ring), ell(0, 0.22 * h, 0.22 * h, 0.22 * h, 0.12 * h, Q.ring), ell(0, 0.13 * h, 0.4 * h, 0.21 * h, 0.17 * h, Q.ring)])
    // A seat block under the hips.
    if (Q.detail || o.legs) solid(q, [ell(0, -0.05 * h, 0, 0.2 * h, 0.17 * h, 4), ell(0, -0.05 * h, 0.33 * h, 0.2 * h, 0.17 * h, 4)])
    solid(q, [r(0.33, 0.14, 0.1), r(0.5, 0.115, 0.08, lean * 0.15), r(0.65, 0.13, 0.08, lean * 0.3), r(0.71, 0.125, 0.07, lean * 0.35), r(0.76, 0.045, 0.045, lean * 0.4)])
    ellipsoid(q, H(0, 0.01 + lean * 0.45, 0.84), [0.065 * h, 0.07 * h, 0.08 * h], Q.ell, Q.rows)
  } else {
    if (o.legs) {
      for (const s of [-1, 1]) {
        const f = (o.stride ?? 0) * s
        tube(q, [H(s * 0.06, 0.01, 0.5), H(s * 0.06, f * 0.08, 0.26), H(s * 0.06, f * 0.12, 0.03)], [0.065 * h * G, 0.05 * h * G, 0.04 * h * G], Q.tube)
      }
      solid(q, [r(0.45, 0.11, 0.075), r(0.56, 0.1, 0.07)])
    } else {
      solid(q, [r(0.0, 0.16, 0.12, 0.01), r(0.25, 0.135, 0.095), r(0.5, 0.115, 0.08), r(0.56, 0.105, 0.072)])
      if (o.stride) ellipsoid(q, H(0.05, 0.12, 0.02), [0.04 * h, 0.08 * h, 0.03 * h], 5, 2)
    }
    solid(q, [r(0.56, 0.105, 0.072), r(0.66, 0.11, 0.075, lean * 0.1), r(0.75, 0.135, 0.078, lean * 0.2), r(0.8, 0.125, 0.07, lean * 0.25), r(0.84, 0.045, 0.045, lean * 0.3)])
    ellipsoid(q, H(0, 0.01 + lean * 0.35, 0.9), [0.06 * h, 0.065 * h, 0.075 * h], Q.ell, Q.rows)
  }
  const top = o.seated ? 0.84 : 0.9
  if (o.wings) for (const s of [1, -1] as const) wing(q, Q, H(s * 0.07, -0.08, o.seated ? 0.7 : 0.77), s, o.wings.span * h, o.wings.lift, o.wings.back)
  if (o.helmet) ellipsoid(q, H(0, lean * 0.4, top + 0.035), [0.07 * h, 0.075 * h, 0.05 * h], Q.ell, Q.rows)
  if (o.crown) solid(q, [r(top + 0.05, 0.045, 0.045, lean * 0.4), r(top + 0.1, 0.055, 0.055, lean * 0.4)])
  for (const a of o.arms) tube(q, a.map(([x, y, z], i) => H(i === 0 ? x * G : x * 1.1, y, z)), a.map((_, i) => (0.05 - i * 0.008) * h * G), Q.tube)
}

/** The low model's figure: one loft from hem (or lap) to neck, head, two straight arms, wings. */
function figureLite(q: Part, Q: Q, h: number, o: FigureOpts, G: number, lean: number, r: (z: number, rx: number, ry: number, dy?: number) => V3[], H: (x: number, y: number, z: number) => V3) {
  if (o.seated) {
    // The lap and shins as one block forward of the hips, then the torso.
    solid(q, [ell(0, 0.12 * h, 0, 0.2 * h * G, 0.2 * h * G, Q.ring), ell(0, 0.14 * h, 0.4 * h, 0.18 * h * G, 0.22 * h * G, Q.ring)])
    solid(q, [r(0.33, 0.14, 0.1), r(0.5, 0.115, 0.08, lean * 0.15), r(0.68, 0.13, 0.08, lean * 0.3), r(0.76, 0.045, 0.045, lean * 0.4)])
    ellipsoid(q, H(0, 0.01 + lean * 0.45, 0.84), [0.065 * h, 0.07 * h, 0.08 * h], Q.ell, Q.rows)
  } else {
    solid(q, [r(0.0, 0.16, 0.12, 0.01), r(0.5, 0.115, 0.08), r(0.66, 0.11, 0.075, lean * 0.1), r(0.76, 0.135, 0.078, lean * 0.2), r(0.84, 0.045, 0.045, lean * 0.3)])
    ellipsoid(q, H(0, 0.01 + lean * 0.35, 0.9), [0.06 * h, 0.065 * h, 0.075 * h], Q.ell, Q.rows)
  }
  const top = o.seated ? 0.84 : 0.9
  if (o.helmet || o.crown) ellipsoid(q, H(0, lean * 0.4, top + 0.04), [0.07 * h, 0.075 * h, 0.05 * h], Q.ell, 2)
  for (const a of o.arms) {
    const pts = [a[0], a[a.length - 1]]
    tube(q, pts.map(([x, y, z], i) => H(i === 0 ? x * G : x * 1.1, y, z)), [0.05 * h * G, 0.035 * h * G], 4)
  }
  if (o.wings) for (const s of [1, -1] as const) wing(q, Q, H(s * 0.07, -0.08, o.seated ? 0.7 : 0.77), s, o.wings.span * h, o.wings.lift, o.wings.back)
}

export type AnimalKind = 'horse' | 'bull' | 'elephant' | 'camel' | 'bison'
export type AnimalPose = {
  /** Body pitched up about the hips, radians (a rearing horse). */
  rear?: number
  /** Lying or kneeling, legs folded under. */
  lying?: boolean
  /** Front hooves: lifted and folded (rearing) — 0 standing, 1 fully raised. */
  lift?: number
  /** Head turned/tossed: radians of neck lift extra. */
  toss?: number
  /** Gallop stride: hind legs thrust back. */
  stride?: number
  /** Bolder barrel, neck and legs (drawn heavier than life to read at map distance). */
  girth?: number
}

/**
 * A four-legged animal facing +y, hooves at z = 0, scaled so `s` is its
 * shoulder (withers) height in metres. Head, neck, barrel, four legs with a
 * knee, tail; horns, humps, trunk, tusks and ears by kind.
 */
export function animal(q: Part, Q: Q, kind: AnimalKind, s: number, pose: AnimalPose = {}) {
  const P: Record<AnimalKind, { len: number; bodyZ: number; rB: number; rC: number; rH: number; neck: [V3, V3]; head: [V3, V3]; rHead: number; leg: number }> = {
    horse: { len: 0.95, bodyZ: 0.78, rB: 0.2, rC: 0.22, rH: 0.2, neck: [[0, 0.4, 0.86], [0, 0.66, 1.36]], head: [[0, 0.64, 1.42], [0, 0.88, 1.16]], rHead: 0.095, leg: 0.06 },
    bull: { len: 0.95, bodyZ: 0.68, rB: 0.27, rC: 0.3, rH: 0.25, neck: [[0, 0.45, 0.78], [0, 0.62, 0.86]], head: [[0, 0.62, 0.86], [0, 0.8, 0.62]], rHead: 0.12, leg: 0.075 },
    elephant: { len: 0.85, bodyZ: 0.66, rB: 0.36, rC: 0.36, rH: 0.33, neck: [[0, 0.38, 0.8], [0, 0.52, 0.86]], head: [[0, 0.5, 0.88], [0, 0.66, 0.7]], rHead: 0.22, leg: 0.11 },
    camel: { len: 0.8, bodyZ: 0.82, rB: 0.17, rC: 0.18, rH: 0.17, neck: [[0, 0.38, 0.84], [0, 0.66, 0.8]], head: [[0, 0.66, 1.25], [0, 0.86, 1.2]], rHead: 0.07, leg: 0.05 },
    bison: { len: 0.95, bodyZ: 0.66, rB: 0.24, rC: 0.36, rH: 0.22, neck: [[0, 0.42, 0.72], [0, 0.6, 0.58]], head: [[0, 0.6, 0.6], [0, 0.76, 0.36]], rHead: 0.15, leg: 0.07 },
  }
  const p0 = P[kind], gk = pose.girth ?? 1
  const p = { ...p0, rB: p0.rB * gk, rC: p0.rC * gk, rH: p0.rH * gk, rHead: p0.rHead * Math.sqrt(gk), leg: p0.leg * Math.sqrt(gk) }
  const S = (v: V3): V3 => [v[0] * s, v[1] * s, v[2] * s]
  const lyingDrop = pose.lying ? p.bodyZ - p.rH * 0.9 - 0.02 : 0
  const hip: V3 = [0, -p.len / 2, p.bodyZ - lyingDrop]
  const rear = pose.rear ?? 0
  // Body-frame points are rotated about the hips by `rear`.
  const R = (v: V3): V3 => {
    const dy = v[1] - hip[1], dz = v[2] - lyingDrop - hip[2]
    return S([v[0], hip[1] + dy * Math.cos(rear) - dz * Math.sin(rear), hip[2] + dy * Math.sin(rear) + dz * Math.cos(rear)])
  }
  const yb = p.len / 2
  // Barrel: haunch, belly, chest.
  tube(q, [R([0, -yb - 0.08, p.bodyZ + 0.02]), R([0, -yb + 0.12, p.bodyZ]), R([0, 0, p.bodyZ - 0.02]), R([0, yb - 0.08, p.bodyZ + (kind === 'bison' ? 0.06 : 0)]), R([0, yb + 0.06, p.bodyZ + 0.02])],
    [p.rH * 0.55 * s, p.rH * s, p.rB * s, p.rC * s, p.rC * 0.6 * s], Q.detail ? Q.tube + 2 : Q.tube)
  // Neck and head (tossed up by `toss`).
  const toss = pose.toss ?? 0
  const T = (v: V3): V3 => {
    const n0 = p.neck[0], dy = v[1] - n0[1], dz = v[2] - n0[2]
    return R([v[0], n0[1] + dy * Math.cos(toss) - dz * Math.sin(toss), n0[2] + dy * Math.sin(toss) + dz * Math.cos(toss)])
  }
  if (kind === 'camel') {
    // The camel's neck dips forward and rises to the head.
    tube(q, [T([0, 0.36, 0.86]), T([0, 0.58, 0.78]), T([0, 0.72, 0.95]), T([0, 0.74, 1.2])], [0.1 * s, 0.08 * s, 0.065 * s, 0.06 * s], Q.tube)
  } else tube(q, [T(p.neck[0]), T(p.neck[1])], [p.rC * (kind === 'horse' ? 0.75 : 0.85) * s, p.rHead * 1.1 * s], Q.tube)
  tube(q, [T(p.head[0]), T(p.head[1])], [p.rHead * s, p.rHead * 0.7 * s], Q.tube)
  if (kind === 'horse') {
    // Mane crest and ears.
    tube(q, [T([0, 0.36, 0.98]), T([0, 0.6, 1.42])], [0.05 * s, 0.04 * s], 4)
    for (const sx of [-1, 1]) tube(q, [T([sx * 0.05, 0.64, 1.45]), T([sx * 0.06, 0.62, 1.55])], [0.025 * s, 0.008 * s], 4)
  }
  if (kind === 'bull' || kind === 'bison') {
    for (const sx of [-1, 1]) tube(q, [T([sx * 0.06, 0.66, 0.86]), T([sx * 0.18, 0.66, 0.92]), T([sx * 0.2, 0.7, 1.02])], [0.035 * s, 0.03 * s, 0.012 * s], 4)
  }
  if (kind === 'bison') {
    // The shaggy hump over the shoulders and the beard.
    ellipsoid(q, R([0, yb - 0.12, p.bodyZ + 0.26]), [0.22 * s, 0.3 * s, 0.24 * s], Q.ell, Q.rows)
    ellipsoid(q, T([0, 0.7, 0.42]), [0.09 * s, 0.1 * s, 0.14 * s], Q.ell, Q.rows)
  }
  if (kind === 'camel') ellipsoid(q, R([0, 0.0, p.bodyZ + 0.17]), [0.13 * s, 0.22 * s, 0.17 * s], Q.ell, Q.rows)
  if (kind === 'elephant') {
    // Trunk curling down, tusks, big ears.
    tube(q, [T([0, 0.68, 0.72]), T([0, 0.78, 0.5]), T([0, 0.8, 0.24]), T([0, 0.86, 0.1])], [0.1 * s, 0.075 * s, 0.055 * s, 0.045 * s], Q.tube)
    for (const sx of [-1, 1]) {
      tube(q, [T([sx * 0.1, 0.66, 0.62]), T([sx * 0.13, 0.82, 0.5]), T([sx * 0.12, 0.92, 0.56])], [0.035 * s, 0.03 * s, 0.015 * s], 4)
      slab(q, T([sx * 0.18, 0.5, 0.86]), [sx, -0.35, 0], [0, 0, 1], [[0, -0.28 * s], [0.3 * s, -0.22 * s], [0.34 * s, 0.05 * s], [0.18 * s, 0.2 * s], [0, 0.14 * s]], 0.04 * s)
    }
  }
  // Tail.
  if (Q.detail || kind === 'horse') tube(q, [R([0, -yb - 0.1, p.bodyZ + 0.05]), R([0, -yb - 0.25, p.bodyZ - 0.25]), R([0, -yb - 0.22, p.bodyZ - 0.55])], kind === 'horse' ? [0.05 * s, 0.06 * s, 0.035 * s] : [0.025 * s, 0.022 * s, 0.03 * s], 4)
  // Legs.
  const lr = p.leg * s, lift = pose.lift ?? 0, stride = pose.stride ?? 0
  for (const sx of [-1, 1]) {
    const x = sx * p.rB * 0.55
    // Hind legs (in the world frame; the hips stay put when rearing).
    if (pose.lying) {
      tube(q, [S([x, -yb + 0.05, p.bodyZ - lyingDrop]), S([x * 1.5, -yb + 0.25, 0.08]), S([x * 1.4, -yb + 0.5, 0.05])], [lr * 1.4, lr, lr * 0.9], Q.tube)
    } else {
      const back = stride * 0.25 + rear * 0.15
      tube(q, [S([x, -yb + 0.06, p.bodyZ - 0.05]), S([x, -yb - 0.05 - back * 0.5, p.bodyZ * 0.5]), S([x, -yb + 0.04 - back, 0.18 * p.bodyZ]), S([x, -yb + 0.06 - back, 0])], [lr * 1.6, lr * 1.05, lr * 0.85, lr * 0.95], Q.tube)
    }
    // Front legs (body frame): straight down, or folded up when rearing/lying.
    if (pose.lying) {
      tube(q, [R([x, yb - 0.1, p.bodyZ]), S([x * 1.3, yb + 0.05, 0.08]), S([x * 1.2, yb + 0.3, 0.06])], [lr * 1.3, lr, lr * 0.9], Q.tube)
    } else {
      const fold = lift * (sx > 0 ? 1 : 0.75)
      const sh = R([x, yb - 0.1, p.bodyZ - 0.05])
      // Knee forward and up, hoof tucked back under it.
      // Standing: knee and hoof under the shoulder. Raised: the forearm
      // thrown forward and up, the cannon and hoof hanging back under it.
      const kneeL: V3 = [x, yb - 0.1 + fold * 0.38, p.bodyZ * 0.52 + fold * (p.bodyZ * 0.48 - 0.22)]
      const hoofL: V3 = [x, yb - 0.08 + fold * 0.28, fold * (p.bodyZ - 0.62)]
      tube(q, [sh, R(kneeL), R(hoofL)], [lr * 1.4, lr * 0.95, lr * 0.85], Q.tube)
    }
  }
}

/**
 * A wall with a pointed (or round, rise = span/2) arch opening through it,
 * in a face's local frame: u along the face (-W/2..W/2), d outward (d0
 * inner face, d1 outer face), z up; `xf` maps local to the model frame.
 * Draws both faces, the soffit and the two ends; the top is left open.
 */
export function pointedArchWall(p: Part, xf: (u: number, d: number, z: number) => V3, W: number, d0: number, d1: number, zs: number, zt: number, span: number, rise: number, n = 8, o: { soffit?: Part; frontOnly?: boolean } = {}) {
  const R = (rise * rise + span * span / 4) / span
  const cx = -span / 2 + R // the left half's centre (on the right of the middle for a pointed arch)
  const arc: [number, number][] = []
  const half = Math.max(2, Math.round(n / 2))
  const phi1 = Math.acos(Math.min(1, Math.max(-1, (0 - cx) / R)))
  for (let i = 0; i <= half; i++) {
    const a = Math.PI + (phi1 - Math.PI) * i / half
    arc.push([cx + R * Math.cos(a), zs + R * Math.sin(a)])
  }
  for (let i = half - 1; i >= 0; i--) arc.push([-arc[i][0], arc[i][1]])
  const m = arc.length - 1
  const inside = xf(0, (d0 + d1) / 2, zt + 50)
  for (const [d, sgn] of (o.frontOnly ? [[d1, 1]] : [[d1, 1], [d0, -1]]) as [number, number][]) {
    const ctr = xf(0, d - sgn * 5, (zs + zt) / 2)
    for (let i = 0; i < m; i++) {
      const tu0 = -W / 2 + W * i / m, tu1 = -W / 2 + W * (i + 1) / m
      face(p, xf(arc[i][0], d, arc[i][1]), xf(arc[i + 1][0], d, arc[i + 1][1]), xf(tu1, d, zt), xf(tu0, d, zt), ctr)
    }
    tri(p, xf(-W / 2, d, zs), xf(arc[0][0], d, arc[0][1]), xf(-W / 2, d, zt), ctr)
    tri(p, xf(arc[m][0], d, arc[m][1]), xf(W / 2, d, zs), xf(W / 2, d, zt), ctr)
  }
  // Soffit (faces down/into the opening).
  if (!o.frontOnly) for (let i = 0; i < m; i++) {
    const mz = (arc[i][1] + arc[i + 1][1]) / 2
    face(o.soffit ?? p, xf(arc[i][0], d0, arc[i][1]), xf(arc[i + 1][0], d0, arc[i + 1][1]), xf(arc[i + 1][0], d1, arc[i + 1][1]), xf(arc[i][0], d1, arc[i][1]), xf(0, (d0 + d1) / 2, mz + 3))
  }
  void inside
}

/** A local→model transform for face k (0 = north/+y, then clockwise: east, south, west) about (cx, cy). */
export const faceXf = (k: number, cx = 0, cy = 0) => (u: number, d: number, z: number): V3 => {
  const a = -k * Math.PI / 2, c = Math.cos(a), s = Math.sin(a)
  // local u = +x, d = +y for face 0; rotate clockwise by k quarters.
  return [cx + u * c - d * s, cy + u * s + d * c, z]
}

/** A triangle oriented away from `inside`. */
export function tri(p: Part, a: V3, b: V3, c: V3, inside: V3) {
  const n: V3 = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
  const m: V3 = [(a[0] + b[0] + c[0]) / 3 - inside[0], (a[1] + b[1] + c[1]) / 3 - inside[1], (a[2] + b[2] + c[2]) / 3 - inside[2]]
  if (n[0] * m[0] + n[1] * m[1] + n[2] * m[2] >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}

/** A square (or n-gon) pyramid/frustum from radius r0 at z0 to r1 at z1, about (cx, cy), turned by `rot`. */
export function frustum(p: Part, cx: number, cy: number, z0: number, z1: number, r0: number, r1: number, n = 4, rot = Math.PI / 4, top = true) {
  const ring = (r: number, z: number) => Array.from({ length: n }, (_, i): V3 => [cx + r * Math.cos(rot + i * TAU / n), cy + r * Math.sin(rot + i * TAU / n), z])
  if (r1 <= 0.001) {
    const b = ring(r0, z0), apex: V3 = [cx, cy, z1]
    for (let i = 0; i < n; i++) p.tri(b[i], b[(i + 1) % n], apex)
    return
  }
  p.loft([ring(r0, z0), ring(r1, z1)])
  if (top) p.cap(ring(r1, z1), true)
}

// ===========================================================================
// The memorial
// ===========================================================================

/** The memorial's centre in the model frame (see the header). */
const C: [number, number] = [0.4, 4.1]


function build(Q: Q) {
  const marble = new Part(), stone = new Part(), granite = new Part(), pink = new Part(), gilt = new Part(), dark = new Part()
  const [cx, cy] = C
  const at = (x: number, y: number, z: number): V3 => [cx + x, cy + y, z]
  const sq = (h: number, z: number): V3[] => [at(-h, -h, z), at(h, -h, z), at(h, h, z), at(-h, h, z)]
  const sbox = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) => box(p, cx + x0, cy + y0, cx + x1, cy + y1, z0, z1)
  const scbox = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, c = 0.2) => cbox(p, cx + x0, cy + y0, cx + x1, cy + y1, z0, z1, Q.detail || x1 - x0 > 6 ? c : 0)
  const ZP = 2.7, ZS = 5.1, ZT = 7.6 // platform, top of the steps, top of the podium

  // ===== The base tier the steps and corner plinths stand on ==============
  // The flat paved surround beyond it is left to the map (the terrain shows
  // the raised platform; paving is ground). The tier runs down to z = 0 so
  // its south side stands proud where the ground falls away.
  const BT = 20.8, R0 = 17.8
  {
    const n = Q.detail ? 7 : 2
    for (let k = 0; k < 4; k++) {
      const xf = faceXf(k, cx, cy)
      for (let i = 0; i < n; i++) {
        const u0 = -BT + 2 * BT * i / n, u1 = -BT + 2 * BT * (i + 1) / n
        face(granite, xf(u0, BT, 0), xf(u1, BT, 0), xf(u1, BT, ZP), xf(u0, BT, ZP), [cx, cy, 1])
      }
      // The tier's top: the walk between the plinths and the foot of the steps.
      face(granite, xf(-BT, BT, ZP), xf(BT, BT, ZP), xf(R0, R0, ZP), xf(-R0, R0, ZP), [cx, cy, -5])
    }
  }

  // ===== The steps and the podium ==========================================
  {
    const nSteps = Q.detail ? 16 : 6, R1 = 9.7
    for (let k = 0; k < nSteps; k++) {
      const h = R0 - (R0 - R1) * k / nSteps, z = ZP + (ZS - ZP) * (k + 1) / nSteps
      granite.loft([sq(h, ZP - 0.01), sq(h, z)])
      // Treads only where the next step doesn't cover them.
      const hi = R0 - (R0 - R1) * (k + 1) / nSteps
      const o = sq(h, z), i = sq(hi, z)
      for (let e = 0; e < 4; e++) granite.quad(o[e], o[(e + 1) % 4], i[(e + 1) % 4], i[e])
    }
    granite.cap(sq(R1, ZS), true)
    // Podium: pink granite base, marble frieze, granite cornice.
    const PH = 8.5
    pink.loft([sq(PH + 0.25, ZS - 0.01), sq(PH + 0.25, ZS + 0.55)]); pink.cap(sq(PH + 0.25, ZS + 0.55), true)
    marble.loft([sq(PH, ZS + 0.5), sq(PH, ZT - 0.55)])
    pink.loft([sq(PH + 0.12, ZT - 0.6), sq(PH + 0.12, ZT - 0.42)])
    stone.loft([sq(PH + 0.3, ZT - 0.42), sq(PH + 0.3, ZT)]); stone.cap(sq(PH + 0.3, ZT), true)
    // The Parnassus frieze: a rank of figures in relief on each face.
    if (Q.detail) {
      for (let k = 0; k < 4; k++) {
        const xf = faceXf(k, cx, cy)
        const n = 12
        for (let i = 0; i < n; i++) {
          const u = -PH + 0.45 + (2 * PH - 0.9) * (i + 0.5) / n
          const zb = ZS + 0.6, hh = 1.45 + 0.08 * Math.sin(i * 2.3)
          const base = xf(u, PH, zb)
          const seatedF = i % 5 === 2
          place(marble, base, -k * Math.PI / 2, 1, (q) => {
            // Half-relief: the figure pushed half into the frieze.
            figure(q, LOW, hh, { seated: seatedF, arms: [[[0.13, 0, 0.78], [0.19, 0.08, 0.6], [0.16, 0.14, 0.48]]], girth: 1.15 })
          }, 88)
        }
      }
    }
  }

  // ===== The canopy ========================================================
  const H = 4.8 // half-width of the canopy body
  const PI0 = 3.25 // inner face of the piers (the arch's half-span)
  const ZSP = 16.8, ZC0 = 22.4, ZC1 = 23.6, ZG = 30.3
  {
    // Piers: pedestal, four columns round a core, capitals.
    for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
      const px = sx * (PI0 + H) / 2, py = sy * (PI0 + H) / 2, w = (H - PI0) / 2
      scbox(granite, px - w - 0.25, py - w - 0.25, px + w + 0.25, py + w + 0.25, ZT, ZT + 0.5, 0.2)
      scbox(stone, px - w - 0.1, py - w - 0.1, px + w + 0.1, py + w + 0.1, ZT + 0.5, ZT + 1.3, 0.2)
      scbox(dark, px - w * 0.4, py - w * 0.4, px + w * 0.4, py + w * 0.4, ZT + 1.3, ZSP - 0.9, 0.1)
      for (const [ox, oy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
        const ccx = cx + px + ox * w * 0.62, ccy = cy + py + oy * w * 0.62
        lathe(pink, [[0.27, ZT + 1.3], [0.25, ZSP - 0.9]], Q.detail ? 12 : 5, ccx, ccy, false)
        // Gilt shaft rings.
        if (Q.detail) lathe(gilt, [[0.39, 11.7], [0.39, 12.0]], 12, ccx, ccy, false)
        if (Q.detail) lathe(stone, [[0.42, ZT + 1.3], [0.42, ZT + 1.55], [0.36, ZT + 1.6]], 12, ccx, ccy, false)
      }
      // Capital block, and the bronze figures on the outer corner of each pier.
      scbox(dark, px - w - 0.15, py - w - 0.15, px + w + 0.15, py + w + 0.15, ZSP - 0.9, ZSP, 0.25)
      if (Q.detail) lathe(gilt, [[w + 0.17, ZSP - 0.75], [w + 0.17, ZSP - 0.55]], 4, cx + px, cy + py, false)
      if (!Q.detail) scbox(gilt, px - w * 0.62 - 0.4, py - w * 0.62 - 0.4, px + w * 0.62 + 0.4, py + w * 0.62 + 0.4, 11.7, 12.0, 0)
      const ox = sx * (H + 0.05), oy = sy * (H + 0.05)
      if (Q.detail) place(dark, at(ox, oy, ZT + 4.6), facing(sx, sy), 1, (q) => figure(q, Q, 1.9, { arms: [[[0.13, 0, 0.78], [0.2, 0.06, 0.6], [0.16, 0.14, 0.48]], [[-0.13, 0, 0.78], [-0.2, 0.06, 0.6], [-0.16, 0.12, 0.47]]] }))
      if (Q.detail) place(dark, at(ox, oy, ZSP + 0.7), facing(sx, sy), 1, (q) => figure(q, Q, 1.8, { arms: [[[0.13, 0, 0.78], [0.2, 0.06, 0.6], [0.16, 0.14, 0.48]]] }))
      // Ledges the bronze figures stand on.
      if (Q.detail) { scbox(stone, ox - 0.45, oy - 0.45, ox + 0.45, oy + 0.45, ZT + 4.3, ZT + 4.6, 0.12); scbox(stone, ox - 0.45, oy - 0.45, ox + 0.45, oy + 0.45, ZSP + 0.4, ZSP + 0.7, 0.12) }
    }
    // Arch walls on each face: through openings, pointed.
    for (let k = 0; k < 4; k++) {
      const xf = faceXf(k, cx, cy)
      pointedArchWall(stone, xf, 2 * H, H - 0.9, H, ZSP, ZC0, 2 * PI0, 3.1, Q.detail ? 14 : 6, { soffit: dark })
      // Gilt mosaic spandrels round the arch, up to the inscription band.
      pointedArchWall(gilt, xf, 2 * H - 0.3, H, H + 0.04, ZSP + 0.5, ZC0 - 1.0, 2 * PI0 + 0.7, 3.5, Q.detail ? 10 : 4, { frontOnly: true })
      // The gilt arch moulding: a band round the arch on the outer face.
      if (true) {
        const span = 2 * PI0 + 0.5, rise = 3.35, R = (rise * rise + span * span / 4) / span, ccx = -span / 2 + R
        const n = Q.detail ? 10 : 3, phi1 = Math.acos(-ccx / R)
        const pts: V3[] = []
        for (let i = 0; i <= n; i++) { const a = Math.PI + (phi1 - Math.PI) * i / n; pts.push(xf(ccx + R * Math.cos(a), H + 0.12, ZSP + R * Math.sin(a))) }
        for (let i = n - 1; i >= 0; i--) { const a = Math.PI + (phi1 - Math.PI) * i / n; pts.push(xf(-(ccx + R * Math.cos(a)), H + 0.12, ZSP + R * Math.sin(a))) }
        tube(gilt, pts, pts.map(() => 0.16), 4)
      }
      // Mosaic spandrel panels (gilt) either side of the arch, and the gilt
      // inscription frieze under the cornice.
      face(gilt, xf(-H + 0.15, H + 0.03, ZC0 - 0.95), xf(H - 0.15, H + 0.03, ZC0 - 0.95), xf(H - 0.15, H + 0.03, ZC0 - 0.2), xf(-H + 0.15, H + 0.03, ZC0 - 0.2), xf(0, 0, ZC0 - 0.5))
    }
    // Crossing vault: the dark mosaic ceiling seen through the arches.
    { const v = sq(H - 0.9, 20.4); dark.cap(v, false) }
    // Cornice.
    scbox(stone, -H - 0.3, -H - 0.3, H + 0.3, H + 0.3, ZC0, ZC1 - 0.35, 0.3)
    scbox(stone, -H - 0.55, -H - 0.55, H + 0.55, H + 0.55, ZC1 - 0.35, ZC1, 0.35)
    // Gargoyles at the corners of the cornice (the dark bronze spouts).
    for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) tube(dark, [at(sx * (H + 0.3), sy * (H + 0.3), ZC1 - 0.25), at(sx * (H + 1.1), sy * (H + 1.1), ZC1 - 0.1)], [0.22, 0.14], 5)

    // Gables, mosaics and crockets.
    for (let k = 0; k < 4; k++) {
      const xf = faceXf(k, cx, cy)
      const G0 = H + 0.1, G1 = H - 0.6
      const L = xf(-H, G0, ZC1), Rr = xf(H, G0, ZC1), A = xf(0, G0, ZG)
      const Lb = xf(-H, G1, ZC1), Rb = xf(H, G1, ZC1), Ab = xf(0, G1, ZG)
      const inC = xf(0, (G0 + G1) / 2, (ZC1 + ZG) / 2)
      tri(stone, L, Rr, A, inC)
      // Gold mosaic tympanum, set just proud.
      const ti = 1.0
      tri(gilt, xf(-H + ti * 1.6, G0 + 0.04, ZC1 + 0.45), xf(H - ti * 1.6, G0 + 0.04, ZC1 + 0.45), xf(0, G0 + 0.04, ZG - ti * 2.0), xf(0, 0, ZC1 + 2))
      // Raking copings: gilt, bold.
      tube(gilt, [xf(-H - 0.2, G0 + 0.05, ZC1 - 0.05), xf(0, G0 + 0.05, ZG + 0.3)], [0.24, 0.24], 4)
      tube(gilt, [xf(0, G0 + 0.05, ZG + 0.3), xf(H + 0.2, G0 + 0.05, ZC1 - 0.05)], [0.24, 0.24], 4)
      if (Q.detail) for (let i = 1; i < 8; i++) for (const s of [-1, 1]) {
        const t = i / 8, u = s * H * (1 - t), z = ZC1 + (ZG - ZC1) * t
        ellipsoid(gilt, xf(u + s * 0.12, G0 + 0.12, z + 0.3), [0.17, 0.17, 0.2], 6, 3)
      }
      // Gilt finial on the apex.
      ellipsoid(gilt, xf(0, G0, ZG + 0.75), [0.3, 0.3, 0.45], Q.detail ? 10 : 6, Q.detail ? 5 : 3)
      // Roof behind the gable: a pitched roof back to the crossing.
      const r0 = xf(-H + 0.3, G1, ZC1), r1 = xf(0, G1, ZG - 0.25), r2 = xf(H - 0.3, G1, ZC1)
      const c0 = xf(-H + 0.3, 0, ZC1), c1 = xf(0, 0, ZG - 0.25), c2 = xf(H - 0.3, 0, ZC1)
      face(dark, r0, r1, c1, c0, xf(0, G1 / 2, ZC1))
      face(dark, r1, r2, c2, c1, xf(0, G1 / 2, ZC1))
      tri(stone, Lb, Ab, Rb, xf(0, H, (ZC1 + ZG) / 2))
      if (Q.detail) tube(gilt, [xf(0, G1, ZG - 0.15), xf(0, 0.4, ZG - 0.15)], [0.14, 0.14], 4)
    }
    // Corner pinnacles: shaft with a niche, gabled cap, spirelet, gilt finial.
    for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
      const px = sx * (H - 0.35), py = sy * (H - 0.35), w = 0.62
      scbox(stone, px - w, py - w, px + w, py + w, ZC1, 29.2, 0.15)
      if (Q.detail) for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
        const fx = cx + px + dx * (w + 0.02), fy = cy + py + dy * (w + 0.02)
        face(dark, [fx - dy * 0.3, fy + dx * 0.3, 25.0], [fx + dy * 0.3, fy - dx * 0.3, 25.0], [fx + dy * 0.3, fy - dx * 0.3, 28.0], [fx - dy * 0.3, fy + dx * 0.3, 28.0], [cx + px, cy + py, 26])
      }
      frustum(stone, cx + px, cy + py, 29.2, 30.1, w * 1.42 + 0.1, w * 1.42 + 0.1, 4, Math.PI / 4, true)
      frustum(stone, cx + px, cy + py, 30.1, 35.0, w * 1.2, 0, Q.detail ? 8 : 4, Q.detail ? Math.PI / 8 : Math.PI / 4)
      if (Q.detail) for (let i = 0; i < 6; i++) ellipsoid(gilt, at(px, py, 30.6 + i * 0.75), [w * 1.2 * (1 - i / 6.5) + 0.1, w * 1.2 * (1 - i / 6.5) + 0.1, 0.12], 8, 2)
      ellipsoid(gilt, at(px, py, 35.25), [0.28, 0.28, 0.4], Q.detail ? 8 : 5, Q.detail ? 4 : 2)
    }
  }

  // ===== The spire =========================================================
  // Stacked octagonal stages, each stepping in to about 80% of the one
  // below and tapering on its own, from the roof crossing to the cross at
  // 54 m: the dark lower stage with gilt panels and the Virtues at its
  // corners, the arcaded lantern, then the gilt upper tiers with their
  // angels, the orb and the cross.
  {
    const oct = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, i): V3 => at(r * Math.cos(Math.PI / 8 + i * TAU / 8), r * Math.sin(Math.PI / 8 + i * TAU / 8), z))
    const stage = (p: Part, z0: number, z1: number, r0: number, r1: number) => { p.loft([oct(r0, z0), oct(r1, z1)]); p.cap(oct(r1, z1), true) }
    const ledge = (z: number, r: number) => stage(gilt, z - 0.3, z, r, r)
    const corners = (r: number) => Array.from({ length: 8 }, (_, i) => [r * Math.cos(Math.PI / 8 + i * TAU / 8), r * Math.sin(Math.PI / 8 + i * TAU / 8)] as [number, number])
    // Stage 1 (dark, gilt-panelled), from inside the roofs.
    const r1 = 2.15, z1a = 28.0, z1b = 33.8
    stage(dark, z1a, z1b, r1, r1 * 0.93)
    for (let k = 0; k < 8; k++) {
      const a0 = Math.PI / 8 + k * TAU / 8, a1 = a0 + TAU / 8, am = (a0 + a1) / 2, rr = r1 * 0.95 + 0.04
      const P = (a: number, z: number, f: number): V3 => at(rr * Math.cos(a) * f, rr * Math.sin(a) * f, z)
      const b0 = am - 0.22, b1 = am + 0.22
      if (k % 2 === 0) face(gilt, P(b0, 30.8, 1), P(b1, 30.8, 1), P(b1, 33.0, 0.97), P(b0, 33.0, 0.97), at(0, 0, 32))
    }
    ledge(z1b + 0.3, r1 * 1.08)
    // The Virtues: gilt standing figures at four corners of the ledge.
    for (const [x, y] of corners(r1 * 0.98).filter((_, i) => i % 2 === 0)) {
      place(gilt, at(x, y, z1b + 0.3), facing(x, y), 1, (q) => figure(q, Q, 2.6, { arms: Q.detail ? [[[0.13, 0, 0.78], [0.2, 0.1, 0.6], [0.14, 0.2, 0.55]], [[-0.13, 0, 0.78], [-0.18, 0.05, 0.6], [-0.15, 0.08, 0.45]]] : [] }))
    }
    // Stage 2: the lantern - eight dark shafts with pointed arches between, real openings, a gilt figure inside.
    const r2 = r1 * 0.8, z2a = z1b + 0.3, z2b = 38.6
    stage(dark, z2a, z2a + 0.4, r2, r2)
    for (const [x, y] of corners(r2 - 0.12)) cbox(dark, cx + x - 0.2, cy + y - 0.2, cx + x + 0.2, cy + y + 0.2, z2a + 0.4, z2b - 0.6, 0)
    for (let k = 0; k < 8; k++) {
      const a0 = Math.PI / 8 + k * TAU / 8, a1 = a0 + TAU / 8
      const p0: [number, number] = [r2 * Math.cos(a0), r2 * Math.sin(a0)], p1: [number, number] = [r2 * Math.cos(a1), r2 * Math.sin(a1)]
      const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2, L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1])
      const ux = (p1[0] - p0[0]) / L, uy = (p1[1] - p0[1]) / L, nx = uy, ny = -ux
      const xf = (u: number, d: number, z: number): V3 => at(mx + ux * u + nx * (d - 0.0), my + uy * u + ny * (d - 0.0), z)
      if (Q.detail || k % 2 === 0) pointedArchWall(dark, xf, L, -0.25, 0.0, z2b - 1.7, z2b, L - 0.42, 0.9, Q.detail ? 6 : 2)
      else face(dark, xf(-L / 2, 0, z2a + 0.4), xf(L / 2, 0, z2a + 0.4), xf(L / 2, 0, z2b), xf(-L / 2, 0, z2b), at(0, 0, z2b - 1))
      // A gablet over each face, gilt-edged (detail).
      if (Q.detail) { const g0 = xf(-L / 2, 0.02, z2b), g1 = xf(L / 2, 0.02, z2b), ga = xf(0, 0.02, z2b + 1.2); tri(dark, g0, g1, ga, at(0, 0, z2b)); tube(gilt, [g0, ga, g1], [0.07, 0.07, 0.07], 4) }
    }
    if (Q.detail) place(gilt, at(0, 0, z2a + 0.4), 0, 1, (q) => figure(q, Q, 2.4, { arms: [[[0.13, 0, 0.78], [0.2, 0.1, 0.6], [0.14, 0.2, 0.55]]] }))
    ledge(z2b + 0.3, r2 * 1.05)
    for (const [x, y] of corners(r2).filter((_, i) => Q.detail || i % 2 === 0)) frustum(dark, cx + x, cy + y, z2b + 0.3, z2b + 2.0, 0.22, 0, 4)
    // Stage 3: dark, narrower, to the first angel ledge.
    const r3 = r2 * 0.8, z3b = 42.0
    stage(dark, z2b + 0.3, z3b - 0.3, r3, r3 * 0.9)
    ledge(z3b, r3 * 1.02)
    // Stage 4: gilt, with the lower tier of angels at its corners.
    const r4 = r3 * 0.8, z4b = 45.5
    stage(gilt, z3b, z4b - 0.3, r4, r4 * 0.85)
    ledge(z4b, r4 * 1.05)
    // Stage 5: gilt, the upper angels; then the tapering finial to the orb.
    const r5 = r4 * 0.8, z5b = 48.5
    stage(gilt, z4b, z5b, r5, r5 * 0.7)
    for (const [z, r, h] of [[z3b, r3 * 0.85, 2.4], [z4b, r4 * 0.92, 2.1]] as [number, number, number][]) {
      for (let i = 0; i < 4; i++) {
        const a = Math.PI / 4 + i * Math.PI / 2, dx = Math.cos(a), dy = Math.sin(a)
        place(gilt, at(dx * r, dy * r, z), facing(dx, dy), 1, (q) => figure(q, Q, h, {
          wings: { span: 0.55, lift: 1.15, back: 0.5 },
          arms: Q.detail || z < 45 ? [[[0.13, 0, 0.78], [0.22, 0.08, 0.92], [0.2, 0.12, 1.08]], [[-0.13, 0, 0.78], [-0.22, 0.08, 0.92], [-0.2, 0.12, 1.08]]] : [],
        }), 88)
      }
    }
    // The crown-orb and the cross, gilt, drawn bold, to 54 m.
    ellipsoid(gilt, at(0, 0, 49.2), [0.6, 0.6, 0.55], Q.detail ? 12 : 8, Q.detail ? 6 : 4)
    lathe(gilt, [[0.32, 49.6], [0.22, 50.1]], 6, cx, cy, false)
    scbox(gilt, -0.18, -0.18, 0.18, 0.18, 49.9, 54.0, 0.05)
    scbox(gilt, -1.0, -0.16, 1.0, 0.16, 52.3, 52.65, 0.05)
    if (Q.detail) for (const [dx, dz] of [[1.0, 52.48], [-1.0, 52.48]]) ellipsoid(gilt, at(dx, 0, dz), [0.2, 0.2, 0.2], 6, 3)
  }

  // ===== Prince Albert =====================================================
  {
    scbox(pink, -1.6, -1.8, 1.6, 1.8, ZT, ZT + 0.7, 0.15)
    scbox(pink, -1.35, -1.5, 1.35, 1.5, ZT + 0.7, ZT + 2.4, 0.12)
    scbox(stone, -1.45, -1.6, 1.45, 1.6, ZT + 2.4, ZT + 3.2, 0.12)
    for (let k = 0; k < 4; k++) if (Q.detail) { const xf = faceXf(k, cx, cy); const d = k % 2 ? 1.36 : 1.51; face(gilt, xf(-0.6, d, ZT + 1.1), xf(0.6, d, ZT + 1.1), xf(0.6, d, ZT + 2.1), xf(-0.6, d, ZT + 2.1), xf(0, 0, ZT + 1.5)) }
    scbox(gilt, -1.25, -1.35, 1.25, 1.35, ZT + 3.2, ZT + 3.55, 0.1)
    // Seated, facing south, the catalogue on his right knee, robes over the chair.
    place(gilt, at(0, 0.05, ZT + 3.55), Math.PI, 1, (q) => {
      figure(q, Q, 4.1, {
        seated: true, girth: 1.35, lean: 0.03,
        arms: [
          [[0.15, 0.0, 0.7], [0.22, 0.12, 0.52], [0.16, 0.3, 0.42]],
          [[-0.15, 0.0, 0.7], [-0.22, 0.1, 0.52], [-0.18, 0.3, 0.44]],
        ],
      })
      // The chair's high back and arms under his robes.
      if (Q.detail) solid(q, [ell(0, -0.55, 0.9, 1.0, 0.25, 6), ell(0, -0.6, 2.9, 0.9, 0.2, 6)])
      // The catalogue: a block on his right knee.
      q.loft([[[0.15, 0.95, 1.55], [0.85, 0.95, 1.55], [0.85, 1.45, 1.55], [0.15, 1.45, 1.55]], [[0.15, 0.95, 1.75], [0.85, 0.95, 1.75], [0.85, 1.45, 1.75], [0.15, 1.45, 1.75]]] as V3[][])
      q.cap([[0.15, 0.95, 1.75], [0.85, 0.95, 1.75], [0.85, 1.45, 1.75], [0.15, 1.45, 1.75]], true)
      // The cloak of the Garter falling from the shoulders over the chair.
      solid(q, [ell(0, -0.15, 0.3, 0.75, 0.35, Q.ring), ell(0, -0.12, 1.6, 0.68, 0.32, Q.ring), ell(0, -0.08, 2.95, 0.58, 0.28, Q.ring)])
    }, 88)
  }

  // ===== The four groups on the podium corners ============================
  // Agriculture (SW), Manufactures (SE), Commerce (NE), Engineering (NW):
  // a standing figure with two seated figures round it.
  for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
    const gx = sx * 7.0, gy = sy * 7.0
    scbox(marble, gx - 1.2, gy - 1.2, gx + 1.2, gy + 1.2, ZT, ZT + 0.45, 0.4)
    place(marble, at(gx, gy, ZT + 0.45), facing(sx, sy), 1, (q) => {
      figure(q, Q, 2.9, { arms: [[[0.13, 0, 0.78], [0.22, 0.05, 0.62], [0.2, 0.12, 0.5]], [[-0.13, 0, 0.78], [-0.24, 0.05, 0.92], [-0.22, 0.1, 1.05]]] })
      for (const s of Q.detail ? [-1, 1] : []) {
        const sub = new Part()
        figure(sub, Q, 2.1, { seated: true, lean: 0.1, arms: [[[0.13, 0, 0.7], [0.22, 0.15, 0.55], [0.15, 0.3, 0.5]]] })
        for (let i = 0; i < sub.pos.length; i += 3) { sub.pos[i] += s * 0.75; sub.pos[i + 2] -= 0.35 }
        q.pos.push(...sub.pos); q.nrm.push(...sub.nrm); q.uv.push(...sub.uv)
      }
    })
  }

  // ===== The continent groups, their plinths, the railing ==================
  {
    const D = 18.3, PW = 2.1, PZ = ZP + 2.2
    const groups: { sx: number; sy: number; kind: 'bull' | 'elephant' | 'camel' | 'bison' }[] = [
      { sx: -1, sy: -1, kind: 'bull' }, // Europe
      { sx: 1, sy: -1, kind: 'elephant' }, // Asia
      { sx: 1, sy: 1, kind: 'camel' }, // Africa
      { sx: -1, sy: 1, kind: 'bison' }, // America
    ]
    for (const g of groups) {
      const gx = g.sx * D, gy = g.sy * D
      scbox(granite, gx - PW - 0.2, gy - PW - 0.2, gx + PW + 0.2, gy + PW + 0.2, ZP, ZP + 0.45, 0.15)
      scbox(granite, gx - PW, gy - PW, gx + PW, gy + PW, ZP + 0.45, PZ - 0.35, 0.12)
      scbox(granite, gx - PW - 0.15, gy - PW - 0.15, gx + PW + 0.15, gy + PW + 0.15, PZ - 0.35, PZ, 0.15)
      // Pink granite panels on each face.
      for (let k = 0; k < 4; k++) { const xf = faceXf(k, cx + gx, cy + gy); face(pink, xf(-1.5, PW + 0.03, ZP + 0.8), xf(1.5, PW + 0.03, ZP + 0.8), xf(1.5, PW + 0.03, PZ - 0.6), xf(-1.5, PW + 0.03, PZ - 0.6), xf(0, 0, ZP + 1)) }
      // The group, facing out along the diagonal.
      const yaw = facing(g.sx, g.sy)
      place(marble, at(gx, gy, PZ), yaw, 1, (q) => {
        // Rocky base the group sits on.
        if (Q.detail) solid(q, [ell(0, 0, 0, 1.9, 1.9, 12), ell(0, 0, 0.3, 1.75, 1.75, 12)])
        const fig = (x: number, y: number, z: number, yawL: number, h: number, o: FigureOpts) => {
          const sub = new Part(); figure(sub, Q, h, o)
          const c = Math.cos(yawL), s = Math.sin(yawL)
          for (let i = 0; i < sub.pos.length; i += 3) {
            const X = sub.pos[i], Y = -sub.pos[i + 2]
            sub.pos[i] = x + X * c - Y * s; sub.pos[i + 2] = -(y + X * s + Y * c); sub.pos[i + 1] += z
          }
          q.pos.push(...sub.pos); q.nrm.push(...sub.nrm); q.uv.push(...sub.uv)
        }
        const beast = (kind: AnimalKind, s: number, pose: AnimalPose, x: number, y: number, yawL: number) => {
          const sub = new Part(); animal(sub, Q, kind, s, pose)
          const c = Math.cos(yawL), si = Math.sin(yawL)
          for (let i = 0; i < sub.pos.length; i += 3) {
            const X = sub.pos[i], Y = -sub.pos[i + 2]
            sub.pos[i] = x + X * c - Y * si; sub.pos[i + 2] = -(y + X * si + Y * c); sub.pos[i + 1] += 0.3
          }
          q.pos.push(...sub.pos); q.nrm.push(...sub.nrm); q.uv.push(...sub.uv)
        }
        const armsA: V3[][] = [[[0.13, 0, 0.78], [0.22, 0.06, 0.62], [0.18, 0.14, 0.5]], [[-0.13, 0, 0.78], [-0.22, 0.06, 0.62], [-0.18, 0.14, 0.5]]]
        if (g.kind === 'elephant') {
          // Asia: the kneeling elephant, the woman seated on it unveiling, figures at its feet.
          beast('elephant', 2.3, { lying: true }, 0, 0.1, 0)
          if (Q.detail) fig(0, -0.2, 2.0, 0, 1.9, { seated: true, arms: [[[0.13, 0, 0.7], [0.25, 0.05, 0.9], [0.18, 0.05, 1.08]], [[-0.13, 0, 0.7], [-0.22, 0.1, 0.55], [-0.15, 0.25, 0.5]]] })
          fig(-1.1, 0.6, 0.3, 0.5, 1.8, { seated: true, arms: armsA })
          if (Q.detail) fig(1.15, -0.5, 0.3, -0.6, 2.1, { arms: armsA })
        } else if (g.kind === 'bull') {
          // Europe: Europa seated on the reclining bull, figures round it.
          beast('bull', 1.95, { lying: true }, 0, 0.1, 0)
          if (Q.detail) fig(0, -0.15, 1.35, 0, 2.1, { seated: true, crown: true, arms: armsA })
          fig(-1.15, 0.7, 0.3, 0.6, 2.2, { arms: armsA, helmet: true })
          if (Q.detail) fig(1.2, -0.6, 0.3, -0.5, 1.8, { seated: true, arms: armsA })
        } else if (g.kind === 'camel') {
          // Africa: the kneeling camel and its rider, an Egyptian princess and attendants.
          beast('camel', 2.4, { lying: true }, 0, 0.1, 0)
          if (Q.detail) fig(0, -0.15, 1.45, 0, 1.8, { seated: true, arms: armsA })
          fig(-1.2, 0.5, 0.3, 0.6, 2.2, { arms: armsA })
          if (Q.detail) fig(1.2, -0.7, 0.3, -0.4, 1.8, { seated: true, arms: armsA })
        } else {
          // America: the charging bison with the Indian maiden riding, figures beside.
          beast('bison', 2.0, { stride: 0.6 }, 0, 0.0, 0)
          if (Q.detail) fig(0, -0.2, 1.8, 0, 1.8, { seated: true, arms: armsA })
          fig(-1.25, 0.4, 0.3, 0.5, 2.2, { arms: armsA })
          if (Q.detail) fig(1.25, -0.6, 0.3, -0.5, 2.1, { arms: armsA, helmet: true })
        }
      })
    }
    // The gilt railing between the plinths: posts, top and bottom rails, bars.
    const RH = 1.9
    for (let k = 0; k < 4; k++) {
      const xf = faceXf(k, cx, cy)
      const u0 = -D + PW + 0.2, u1 = D - PW - 0.2, n = Q.detail ? 8 : 2
      for (let i = 0; i <= n; i++) {
        const u = u0 + (u1 - u0) * i / n
        const p0 = xf(u, D, ZP)
        if (Q.detail) { cbox(pink, p0[0] - 0.14, p0[1] - 0.14, p0[0] + 0.14, p0[1] + 0.14, ZP, ZP + RH + 0.15, 0.04); ellipsoid(gilt, xf(u, D, ZP + RH + 0.28), [0.13, 0.13, 0.16], 6, 3) }
        else box(pink, p0[0] - 0.16, p0[1] - 0.16, p0[0] + 0.16, p0[1] + 0.16, ZP, ZP + RH + 0.2)
      }
      for (const z of [ZP + 0.2, ZP + RH - 0.1]) { const a = xf(u0, D, z), b = xf(u1, D, z); cbox(gilt, Math.min(a[0], b[0]) - 0.06, Math.min(a[1], b[1]) - 0.06, Math.max(a[0], b[0]) + 0.06, Math.max(a[1], b[1]) + 0.06, z - 0.06, z + 0.06, 0) }
      if (Q.detail) {
        const nb = 40
        for (let i = 0; i < nb; i++) {
          const u = u0 + (u1 - u0) * (i + 0.5) / nb
          const a = xf(u, D, ZP + 0.2), b = xf(u, D, ZP + RH - 0.1)
          cbox(gilt, a[0] - 0.025, a[1] - 0.025, a[0] + 0.025, a[1] + 0.025, a[2], b[2], 0)
        }
        tube(gilt, [xf(u0, D, ZP + RH - 0.45), xf(u1, D, ZP + RH - 0.45)], [0.05, 0.05], 4)
      } else {
        // Low model: a few bold bars per bay.
        for (let i = 0; i < 0; i++) {
          const u = u0 + (u1 - u0) * (i + 0.5) / 24
          const a = xf(u, D, ZP + 0.2)
          box(gilt, a[0] - 0.05, a[1] - 0.05, a[0] + 0.05, a[1] + 0.05, a[2], ZP + RH - 0.1)
        }
      }
    }
  }

  return { marble, stone, granite, pink, gilt, dark }
}

function write(Q: Q, file: string, maxTris: number) {
  const { marble, stone, granite, pink, gilt, dark } = build(Q)
  const lit = (p: V3, n: V3) => (n[2] > 0.95 ? 0.3 : Math.min(1, 0.4 + p[2] / 40))
  writeModel('Albert Memorial', 'london-albert-memorial', [
    { part: stone, material: { ...mat('memorial-stone', 0xe6ddcc), floodlight: lit } },
    { part: marble, material: Q.detail ? { ...mat('memorial-marble', 0xf3f0ea, 0.7), floodlight: (p) => (p[2] < 12 ? 0.8 : 0.2) } : mat('memorial-marble', 0xf3f0ea, 0.7) },
    { part: granite, material: mat('memorial-granite', 0xc2bcb2) },
    { part: pink, material: mat('memorial-pink-granite', 0xa8766a, 0.6) },
    { part: gilt, material: { ...mat('memorial-gilt', 0xe2b445, 0.4), floodlight: () => 1 } },
    { part: dark, material: { ...mat('memorial-dark', 0x524c4a, 0.7), floodlight: (p) => (p[2] > 27 ? 0.6 : 0) } },
  ], { bearing: BEARING, osm: 'way/372965954', height: 54.0 }, maxTris, file)
}

function mat(name: string, color: number, roughness = 0.85): MaterialSpec {
  return { name, color, roughness }
}

if (import.meta.main) {
  write(LOW, 'london-albert-memorial', 6500)
  write(HIGH, 'london-albert-memorial.detail', 40000)
}
