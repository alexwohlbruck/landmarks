/**
 * Jin Mao Tower, Lujiazui, Shanghai — original procedural geometry, CC0-1.0.
 * bun generators/shanghai-jin-mao-tower.ts   (low model and detail LOD)
 *
 * Frame: bearing 0 (the tower is square to the compass). Origin = area
 * centroid of the OSM outline way/376075961 (121.501406 E, 31.237251 N), on
 * the plaza; the tower axis is at (-1.0, 0.0). y = 0 is the plaza;
 * elevation 0.
 *
 * Form, as read from OSM and the photos:
 * - a square shaft, 54 m across the flanks at the foot (OSM), with a bay in
 *   the middle of each face (18 m wide) standing 3.9 m proud between two
 *   strong silver ribs; the central bays taper straight up to the crown;
 * - the pagoda tiers: the flanks (the corners, chamfered) step in at the top
 *   of each tier under a flared silver lip; the tiers shorten upward by the
 *   tower's rule (16, 14, 12, 10, 8 floors, then ever shorter ones, two to
 *   four floors each, counted on the photos), nineteen tiers to the 88th
 *   floor (348 m), then six more in the crown;
 * - the crown: a steep stepped pyramid (348-384 m, OSM's pyramidal part
 *   ends at 382 m) in seven steps, the central bays ending in pointed gables
 *   (350-368 m); on it a slim drum with eight flared blades round the foot
 *   of the spire (384-398 m), each with its own up-turned tip, and the needle
 *   to 420.5 m;
 * - bronze-grey: dark grey glass between a heavy silver-bronze metal
 *   lattice of vertical ribs and the tier lips;
 * - at the foot: the four entrance canopies (OSM, 8-10 m, glazed barrel
 *   vaults) and the Jin Mao podium to the west (OSM way/167061959,
 *   5 levels), drawn as a 24 m block.
 *
 * Evidence
 * - OSM, fetched 2026-11-27 with tools/osm.py: outline way/376075961 (height
 *   420.5, Q80813), parts way/188377486 (348 m, 88 levels: the cross-shaped
 *   plan, flanks +/-27 m, central bays +/-30.9 m, 18 m wide),
 *   way/376016310 (pyramidal crown to 382 m), way/376016312 (spire 420 m),
 *   the canopies way/167061956, 167061957, 167061961, 524263611 (8-10 m,
 *   round roofs), the podium way/167061959 (5 levels).
 * - Published: 420.5 m to the spire top, 88 floors, observation deck on the
 *   88th floor at 340 m; SOM (Adrian Smith), completed 1999; the tiers
 *   follow the number 8: the lowest segment is 16 floors and each one above
 *   is 1/8 shorter (Wikipedia "Jin Mao Tower"; CTBUH Skyscraper Center).
 * - Photos (Wikimedia Commons, daylight unless noted):
 *   "Jin Mao Tower 20260418.jpg", DvTor8303, CC0, from the NW (~307): the
 *   tiers and lips, the central bays and ribs, the crown and the podium;
 *   https://commons.wikimedia.org/wiki/File:Jin_Mao_Tower_20260418.jpg
 *   "Shanghai Jin Mao Tower 5166298.jpg", Ermell, CC0, from the WSW (~247):
 *   the crown, gables, spire blades, colour of the lattice;
 *   https://commons.wikimedia.org/wiki/File:Shanghai_Jin_Mao_Tower_5166298.jpg
 *   "Based of Jin Mao Tower from SWFC.jpg", Tim Sheerman-Chase, CC BY 2.0,
 *   from above (SWFC, to the ESE): the plan, the chamfered corners, the
 *   glazed entrance canopies, the podium roof;
 *   https://commons.wikimedia.org/wiki/File:Based_of_Jin_Mao_Tower_from_SWFC.jpg
 *   "Shanghai Tower, Shanghai World Financial Center and Jin Mao Tower 20251126.jpg",
 *   Supanut Arunopra, CC BY 4.0, from the west: the whole silhouette and the
 *   tier rhythm; https://commons.wikimedia.org/wiki/File:Shanghai_Tower,_Shanghai_World_Financial_Center_and_Jin_Mao_Tower_20251126.jpg
 *   "Pudong Shanghai November 2017 panorama.jpg", King of Hearts, CC BY-SA 4.0,
 *   from the Bund: height against the other two towers;
 *   https://commons.wikimedia.org/wiki/File:Pudong_Shanghai_November_2017_panorama.jpg
 *   "Jin Mao Tower at night 20260417.jpg", DvTor8303, CC0, at night;
 *   https://commons.wikimedia.org/wiki/File:Jin_Mao_Tower_at_night_20260417.jpg
 * - No lidar, NAIP or Mapillary over Shanghai (batch notes).
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 420.5 m; 88 floors (~3.9 m a floor, which puts the tops of
 *   the 16-, 14-, 12-, 10- and 8-floor tiers at 66, 120, 167, 206, 237 m).
 * - Measured (OSM): the plan (flanks 54 m, bays 61.8 m across, 18 m wide),
 *   the main roof 348 m, the canopies.
 * - Measured (Bund panorama, scaled between the 348 m roof and the 420.5 m
 *   tip, ~3.5 px/m): the crown pyramid ~348-388 m, the blades ~14 m tall,
 *   the needle ~18 m (the tower's left half is hidden there, so widths were
 *   taken from the 2026 photo, corrected for its perspective: the top is
 *   ~0.85 of the foot's width).
 * - Estimated: the fourteen tiers above 237 m (251 ... 348 m, 6-14 m each;
 *   counted on the 5166298 photo, whose upper flank shows a step every two
 *   to three floors); the taper (flanks 27 -> 23.5 m half-width at 282 m,
 *   then faster to 16.5 m at 348 m; bays 30.9 -> 27.5 -> 21.5 m), from the
 *   2026 photo corrected for perspective and the stepped top in the Bund
 *   panorama; the corner notches (13% of the flank); the lips
 *   (2.6 m out, 2.6 m tall, as the NW photo shows the steps as the main
 *   silhouette feature); the gables and the crown tiers; the spire's
 *   blades; the podium's height (24 m); colours sampled from the 2026 and
 *   5166298 photos (glass #6f8a99 lit, #5a5b56-#6a6d66 in shade; metal
 *   #8e8676 lit to #c3c4bd in full sun), drawn as glass #66727a and
 *   silver-bronze metal #9c978b; the lattice as bold leaning ribs (three
 *   per flank side, three per bay; five each and slim per-tier mullions in
 *   the detail LOD), sparser and bolder than the real one.
 * - Invented: none of the massing.
 *
 * Doubts
 * - The real corners are notched in several small steps; drawn as one
 *   chamfer per tier.
 * - The podium's height and roof are not measured.
 *
 * Night: the glass glows as windows; the silver lattice, lips and crown are
 * floodlit, more strongly toward the crown, as in the night photo.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { face, prism, saveLods, type Layer, type XY } from './auckland-sky-tower'
import { gridSurface } from './shanghai-tower'
import { polyTris } from './berlin-oberbaum-bridge'

const AX: XY = [-1.0, 0.0]
const TOP = 420.5
const ROOF = 348
// tier tops (m), the shaft then the crown
const TIERS = [66, 120, 167, 206, 237, 251, 263, 273, 282, 290, 297, 304, 311, 318, 325, 331, 337, 343, ROOF]
const CROWN = [353, 358, 363, 368, 373, 378, 384]
const F0 = 27, F_MID = 23.5, F_ROOF = 16.5
// tier k's flank half-width: a slow taper to 282 m, then a faster one into the crown
const flank = (k: number) => {
  const z = TIERS[k]
  return fAt(z)
}
/** The flanks' taper as a line through the tier tops (the walls step in under it). */
function fAt(z: number) {
  return z <= 66 ? F0 : z <= 282 ? F0 - ((F0 - F_MID) * (z - 66)) / (282 - 66) : F_MID - ((F_MID - F_ROOF) * (z - 282)) / (ROOF - 282)
}
const CROWN_F = [15, 13, 11.2, 9.5, 8, 6.6, 5.4]
const bay = (z: number) => { const q = Math.min(z, ROOF); return q <= 282 ? 30.9 - (3.4 * q) / 282 : 27.5 - (6 * (q - 282)) / (ROOF - 282) } // central bay face
const bayW = (z: number) => 9 - (2.5 * Math.min(z, ROOF)) / ROOF // central bay half-width

type Set = { win: Part; silver: Part; roof: Part; glass: Part; podium: Part }
const mk = (): Set => ({ win: new Part(), silver: new Part(), roof: new Part(), glass: new Part(), podium: new Part() })

/** The flank plan: a square with a square notch cut into each corner, counter-clockwise, about the axis. */
function octa(f: number, c: number, z: number): V3[] {
  const a = AX[0], b = AX[1], g = f - c
  const q: [number, number][] = [[f, -g], [f, g], [g, g], [g, f], [-g, f], [-g, g], [-f, g], [-f, -g], [-g, -g], [-g, -f], [g, -f], [g, -g]]
  return q.map(([x, y]) => [a + x, b + y, z] as V3)
}
/** The cross of the central bays, counter-clockwise. */
function cross(z: number, dp = 0): V3[] {
  const p = bay(z) + dp, w = bayW(z), a = AX[0], b = AX[1]
  return [[p, -w], [p, w], [w, w], [w, p], [-w, p], [-w, w], [-p, w], [-p, -w], [-w, -w], [-w, -p], [w, -p], [w, -w]].map(([x, y]) => [a + x, b + y, z] as V3)
}
const capFan = (p: Part, ring: V3[], up: boolean) => {
  const n = ring.length, c: V3 = [ring.reduce((s, v) => s + v[0], 0) / n, ring.reduce((s, v) => s + v[1], 0) / n, ring[0][2]]
  for (let i = 0; i < n; i++) face(p, up ? [c, ring[i], ring[(i + 1) % n]] : [c, ring[(i + 1) % n], ring[i]], [0, 0, up ? 1 : -1])
}
const sharp = () => true

function build(s: Set, d: boolean) {
  // ---- the pagoda tiers (flanks) ----
  const LIP_H = 2.6, LIP_O = 2.6
  const tiers: [number, number, number][] = [] // z0, z1, f
  let z0 = 0
  TIERS.forEach((z1, k) => { tiers.push([z0, z1, flank(k)]); z0 = z1 })
  CROWN.forEach((z1, k) => { tiers.push([z0, z1, CROWN_F[k]]); z0 = z1 })
  for (const [a, b, f] of tiers) {
    const c = Math.max(1.0, f * 0.13)
    const wallTop = b - LIP_H
    gridSurface([octa(f, c, a), octa(f, c, wallTop)], true, () => (b > ROOF ? s.silver : s.win), sharp)
    // the flared lip
    gridSurface([octa(f, c, wallTop), octa(f + LIP_O, c, b - 0.6), octa(f + LIP_O, c, b)], true, () => s.silver, sharp)
    capFan(s.silver, octa(f + LIP_O, c, b), true)
    // detail: slim secondary mullion fins between the ribs, tier by tier
    if (d && b <= ROOF) {
      const g = f - c, w0 = bayW(a) + 1.6
      for (let side = 0; side < 4; side++) {
        const ang = (side * Math.PI) / 2, cs = Math.cos(ang), sn = Math.sin(ang)
        const R = (x: number, y: number): XY => [AX[0] + x * cs - y * sn, AX[1] + x * sn + y * cs]
        for (const sy of [-1, 1]) for (const t of [0.215, 0.405, 0.595, 0.785]) {
          const y = sy * (w0 + (g - 1.2 - w0) * t), hw = 0.18
          prism(s.silver, [R(f - 0.2, y - hw), R(f + 0.5, y - hw), R(f + 0.5, y + hw), R(f - 0.2, y + hw)], a + 0.3, wallTop)
        }
      }
    }
  }

  // ---- the lattice: bold silver ribs running up the flanks over the glass, leaning with the taper ----
  {
    const per = d ? [0.12, 0.31, 0.5, 0.69, 0.88] : [0.2, 0.5, 0.8]
    const segs: [number, number][] = [[0.3, 237], [237, 282], [282, ROOF - 1]]
    for (let side = 0; side < 4; side++) {
      const ang = (side * Math.PI) / 2, cs = Math.cos(ang), sn = Math.sin(ang)
      const R = (x: number, y: number, z: number): V3 => [AX[0] + x * cs - y * sn, AX[1] + x * sn + y * cs, z]
      for (const sy of [-1, 1]) for (const t of per) for (const [za, zb] of segs) {
        const hw = d ? 0.4 : 0.5
        const at = (z: number) => {
          const f = fAt(z), c = Math.max(1.0, f * 0.13), w0 = bayW(z) + 1.6, y = sy * (w0 + (f - c - 1.2 - w0) * t)
          return [R(f - 1.8, y - hw, z), R(f + 0.5, y - hw, z), R(f + 0.5, y + hw, z), R(f - 1.8, y + hw, z)]
        }
        const r0 = at(za), r1 = at(zb)
        const ring0 = ccwRing(r0) ? r0 : [...r0].reverse(), ring1 = ccwRing(r1) ? r1 : [...r1].reverse()
        gridSurface([ring0, ring1], true, () => s.silver, sharp)
        if (zb > 300) capFan(s.silver, ring1, true)
      }
    }
  }

  // ---- the central bays: one tapering cross from the plaza to the roof ----
  const zs = [0, 282, ROOF + 2]
  gridSurface(zs.map((z) => cross(z)), true, () => s.win, sharp)
  // silver bands across the bays at the tier tops, and lattice fins up the bays
  for (const z of TIERS) {
    const r0 = cross(z - 2.4, 0.05), r1 = cross(z, 0.05)
    for (const i of [0, 3, 6, 9]) {
      const j = i + 1
      face(s.silver, [r0[i], r0[j], r1[j], r1[i]], [0, 0, 0].map((_, k) => k === 2 ? 0 : (r0[i][k] + r0[j][k]) / 2 - AX[k]) as V3)
    }
  }
  for (let side = 0; side < 4; side++) {
    const ang = (side * Math.PI) / 2, cs = Math.cos(ang), sn = Math.sin(ang)
    const R = (x: number, y: number): XY => [AX[0] + x * cs - y * sn, AX[1] + x * sn + y * cs]
    const fr = d ? [-0.66, -0.33, 0, 0.33, 0.66] : [-0.5, 0, 0.5]
    const segs: [number, number][] = [[0.5, 282], [282, ROOF]]
    for (const [za, zb] of segs) for (const t of fr) {
      // a fin following the bay face from za to zb (the face leans in, so build it as a lofted box)
      const hw = d ? 0.5 : 0.6, o = d ? 1.0 : 1.1
      const at = (z: number) => {
        const p = bay(z), y = t * bayW(z)
        return [R(p, y - hw), R(p + o, y - hw), R(p + o, y + hw), R(p, y + hw)].map(([x, yy]) => [x, yy, z] as V3)
      }
      const r0 = at(za), r1 = at(zb)
      const ring0 = ccwRing(r0) ? r0 : [...r0].reverse(), ring1 = ccwRing(r1) ? r1 : [...r1].reverse()
      gridSurface([ring0, ring1], true, () => s.silver, sharp)
    }
  }
  // the ribs: two strong silver ribs at the edges of each bay
  for (let side = 0; side < 4; side++) {
    const ang = (side * Math.PI) / 2, cs = Math.cos(ang), sn = Math.sin(ang)
    const R = (x: number, y: number, z: number): V3 => [AX[0] + x * cs - y * sn, AX[1] + x * sn + y * cs, z]
    for (const sy of [-1, 1]) {
      const rib = (z: number) => {
        const p = bay(z), w = bayW(z), rw = d ? 0.7 : 0.9, ro = d ? 1.0 : 1.3
        return [R(p - 2.5, sy * w - rw, z), R(p + ro, sy * w - rw, z), R(p + ro, sy * w + rw, z), R(p - 2.5, sy * w + rw, z)]
      }
      const top = ROOF + 6
      const rows = [rib(0), rib(282), rib(top)]
      gridSurface(rows.map((r) => (ccwRing(r) ? r : [...r].reverse())), true, () => s.silver, sharp)
      capFan(s.silver, ccwRing(rows[1]) ? rows[1] : [...rows[1]].reverse(), true)
    }
    // the gable over each bay: a pointed end rising to 368 m
    const zE = ROOF + 2, zP = 368
    const p = bay(ROOF), w = bayW(ROOF)
    const g = (x: number): V3[] => [R(x, -w, zE), R(x, w, zE), R(x, 0, zP)]
    const outer = g(p), inner = g(2)
    autoFace(s.silver, outer, [cs, sn, 0]) // the gable's face (lattice)
    autoFace(s.silver, [outer[0], inner[0], inner[2], outer[2]], [sn, -cs, 1]) // the two pitched roofs
    autoFace(s.silver, [outer[1], outer[2], inner[2], inner[1]], [-sn, cs, 1])
    // a silver frame round the gable (its rake), so it reads at phone size
    for (const [A, B] of [[outer[0], outer[2]], [outer[1], outer[2]]] as [V3, V3][]) {
      const o = (q: V3, t: number): V3 => [q[0] + cs * 0.3, q[1] + sn * 0.3, q[2] + t]
      autoFace(s.silver, [o(A, -1.6), o(B, -1.6), o(B, 0), o(A, 0)], [cs, sn, 0])
    }
  }

  // ---- the spire ----
  const SP0 = 384
  const ring = (r: number, z: number, n = 8): V3[] => Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + Math.PI / 8
    return [AX[0] + r * Math.cos(a), AX[1] + r * Math.sin(a), z] as V3
  })
  gridSurface([ring(2.6, SP0), ring(2.2, 390), ring(1.7, 398)], true, () => s.silver, sharp)
  capFan(s.silver, ring(1.7, 398), true)
  // blades round the spire's foot (eight, flared)
  const nb = 8
  for (let i = 0; i < nb; i++) {
    const a = (i / nb) * Math.PI * 2
    const cs = Math.cos(a), sn = Math.sin(a)
    const P = (r: number, z: number, t: number): V3 => [AX[0] + r * cs - t * sn, AX[1] + r * sn + t * cs, z]
    const T = d ? 0.22 : 0.32
    // each blade flares out and up to its own tip, with a notch between the tip and the needle, so the blades read apart
    const prof: [number, number][] = [[1.6, 398], [4.3, 392], [7.4, 398], [6.6, SP0 + 2], [1.8, SP0]]
    for (const t of [T, -T]) for (const tri of polyTris(prof)) face(s.silver, tri.map(([r, z]) => P(r, z, t)), [-sn * Math.sign(t), cs * Math.sign(t), 0])
    for (let k = 0; k < prof.length; k++) {
      const [r0, zz0] = prof[k], [r1, zz1] = prof[(k + 1) % prof.length]
      const ex = r1 - r0, ez = zz1 - zz0
      face(s.silver, [P(r0, zz0, -T), P(r1, zz1, -T), P(r1, zz1, T), P(r0, zz0, T)], [cs * ez, sn * ez, -ex])
    }
  }
  // the needle
  const nN = d ? 8 : 6
  gridSurface([ring(1.6, 398, nN), ring(1.0, 407, nN), ring(0.45, 415, nN), ring(0.12, TOP, nN)], true, () => s.silver, sharp)
  capFan(s.silver, ring(0.12, TOP, nN), true)

  // ---- at the foot: the four glazed entrance canopies and the podium ----
  for (const [cx, cy, hx, hy] of CANOPIES) {
    const along = hx > hy ? 'x' : 'y' // the vault runs out from the tower
    const n = d ? 8 : 5, R0 = 8, rise = 2
    const half = along === 'x' ? hy : hx, len = along === 'x' ? hx : hy
    const pt = (t: number, sgnL: number): V3 => {
      const a = Math.PI * (t / n), off = -Math.cos(a) * half, z = R0 + Math.sin(a) * rise
      return along === 'x' ? [cx + sgnL * len, cy + off, z] : [cx + off, cy + sgnL * len, z]
    }
    for (let i = 0; i < n; i++) {
      const a = pt(i, -1), b = pt(i, 1), c = pt(i + 1, 1), dd = pt(i + 1, -1)
      const mz = Math.sin((Math.PI * (i + 0.5)) / n), mo = -Math.cos((Math.PI * (i + 0.5)) / n)
      const nn: V3 = along === 'x' ? [0, mo, mz] : [mo, 0, mz]
      face(s.glass, [a, b, c, dd], nn)
      face(s.glass, [dd, c, b, a], [-nn[0], -nn[1], -nn[2]])
    }
    // posts at the outer corners
    for (const sg of [-1, 1]) {
      const px = along === 'x' ? cx + Math.sign(cx) * (len - 0.5) : cx + sg * (half - 0.5)
      const py = along === 'x' ? cy + sg * (half - 0.5) : cy + Math.sign(cy) * (len - 0.5)
      prism(s.silver, [[px - 0.35, py - 0.35], [px + 0.35, py - 0.35], [px + 0.35, py + 0.35], [px - 0.35, py + 0.35]], 0, R0, { top: false })
    }
  }
  prism(s.podium, PODIUM, 0, PODIUM_H - 1, { top: false })
  prism(s.silver, PODIUM, PODIUM_H - 1, PODIUM_H, { top: false })
  for (const [a, b, c] of polyTris(PODIUM)) face(s.roof, [[a[0], a[1], PODIUM_H], [b[0], b[1], PODIUM_H], [c[0], c[1], PODIUM_H]], [0, 0, 1])
}

/** A planar face whose normal is taken from its corners, turned to agree with `hint`. */
function autoFace(p: Part, pts: V3[], hint: V3) {
  const a = pts[0], b = pts[1], c = pts[2]
  const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  let n: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0) n = [-n[0], -n[1], -n[2]]
  face(p, pts, n)
}
function ccwRing(r: V3[]): boolean {
  let s = 0
  for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; s += a[0] * b[1] - b[0] * a[1] }
  return s > 0
}

// canopies: centre x, y, half extents (OSM way/167061956, 167061957, 167061961, 524263611)
const CANOPIES: [number, number, number, number][] = [
  [38.3, 0.0, 8.3, 9.0], // east
  [-0.4, -39.0, 9.1, 8.2], // south
  [-0.4, 39.0, 9.0, 8.1], // north
  [-37.5, -0.2, 5.8, 9.1], // west, against the podium
]
const PODIUM_H = 24
const PODIUM: XY[] = [[-86.1, -57.7], [-89.7, 71.1], [-86.6, 80.7], [-74.0, 81.3], [-59.6, 74.6], [-45.8, 66.0], [-43.2, 8.9], [-43.2, -9.3], [-40.7, -63.3]]

// ---- Materials and output ----------------------------------------------------------------------

const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : p[2] > 280 ? 0.95 : p[2] > 30 ? 0.55 : 0.3)
const WIN: MaterialSpec = { ...PALETTE.window, color: 0x66727a }
const SILVER: MaterialSpec = { ...finish('jm-silver', 0x9c978b, 0.5), floodlight: lit }
const ROOFM: MaterialSpec = PALETTE.roof
const GLASS: MaterialSpec = { ...PALETTE.glass, doubleSided: false }
const POD: MaterialSpec = finish('jm-podium', 0xc9c8c2)
const layers = (s: Set): Layer[] => [
  { part: s.win, material: WIN },
  { part: s.silver, material: SILVER },
  { part: s.roof, material: ROOFM },
  { part: s.glass, material: GLASS },
  { part: s.podium, material: POD },
]

if (import.meta.main) {
  const low = mk(), det = mk()
  build(low, false)
  build(det, true)
  await saveLods('shanghai-jin-mao-tower', 'Jin Mao Tower', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centroid, on the plaza',
    bearing: 0, height: TOP,
  }, 6500)
}
