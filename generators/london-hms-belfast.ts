/**
 * HMS Belfast, Town-class light cruiser (launched 1938), museum ship moored
 * off The Queen's Walk, London. Original procedural geometry, CC0-1.0.
 *   bun generators/london-hms-belfast.ts
 *
 * Frame: turned to BEARING 286.8, the ship's heading: +y runs from the stern
 * to the bow (compass 286.8, upriver, WNW), +x is the starboard side (compass
 * 16.8, toward the City bank), z up, metres. Origin = the area centroid of
 * the OSM outline way/5006061 (-0.0812909, 51.5065686), on the waterline.
 *
 * y = 0 is the waterline: nothing below the water is drawn. elevation 0: the
 * map stands the model on the lowest terrain under its footprint, which here
 * is the river surface in the terrain (Mapterhorn reads 3.1 m AOD all round
 * the hull, the EA lidar water surface 3.1 m AOD too). The ship floats, so
 * her waterline is the water surface; the tide (about +/-3 m) is not modelled.
 *
 * What makes it HMS Belfast, and how each is drawn
 * - The long hull, 185 m on the OSM outline (published 187 m), 19.5 m beam
 *   at the deck (published 19.3 m): flared sides (fine at the waterline
 *   forward, widening to the deck edge), the sheer rising 1.6 m to the bow,
 *   the raked stem, the cruiser stern, the forecastle deck stepping down to
 *   the quarterdeck at the break aft of the second funnel.
 * - The Admiralty disruptive camouflage she wears now (the 1942 scheme):
 *   broad angular panels in dark blue-grey, mid grey and pale grey, as real
 *   material regions cut along straight diagonal boundaries, different on
 *   each side (port and starboard photos). The upperworks are pale and mid
 *   grey, the decks a warm grey.
 * - Four triple 6-inch turrets, A and B forward (B superfiring), X and Y aft
 *   (X superfiring): tapered plan, sloped face, rangefinder ears, three real
 *   barrels each with blast bags, trained fore and aft and elevated 10 deg.
 * - The bridge: the wide shelter-deck block with its wings, then three
 *   stacked round-fronted decks stepping in (window bands at 15, 17.5 and
 *   20 m), the compass platform at 21 m and the director control tower with
 *   its rangefinder arms and hood to 25 m, rising well above B turret.
 * - Two raked funnels, oval in plan (6.8 x 5.2 m) and 23 m tall, scaled
 *   from the side photos (OSM maps 5.1 x 3.7 m and 20.5 m), black-capped.
 * - The deckhouses between and beside the funnels (searchlight and pom-pom
 *   platforms) and the after control position.
 * - Two tripod masts with real 3D legs, the platform, a dark lattice
 *   topmast with braces, yards and pole.
 * - The six twin 4-inch mounts amidships, the black director domes.
 * - Night: the bridge window band and a row of portholes glow.
 *
 * Evidence
 * - OSM (ODbL): way/5006061 (HMS Belfast, building=ship, height 41 above
 *   the waterline, wikidata Q757178) and its 3D parts (all replaced):
 *   hull decks way/1420435891 (forecastle 7.5 m, y -31..94) and
 *   way/1420435892 (quarterdeck 5.5 m); turrets way/203708840 (A, 11),
 *   way/203708835 (B, 13.5), way/1367195722 (X, 13.5), way/1367195723 (Y,
 *   11) with barrels way/1420435869-1420435880; bridge way/203708834 (19),
 *   way/203708832 and way/1420435889 (wings, 13.5); deckhouses
 *   way/1420435886, way/1420435890, way/1420435885, way/203708844;
 *   funnels way/1420435887 and way/1420435888 (20.5); masts
 *   way/1420435867, way/1420435868, way/1420435883 (fore, 31.5-32) and
 *   way/1420435881, way/1420435882, way/1420435884 (main, 27.5-28.5).
 * - Environment Agency LIDAR Composite DSM 1 m, Open Government Licence v3.0
 *   (composite ~2000-2022): water 3.1 m AOD; above it the forecastle deck
 *   7.2 amidships rising to 8.8 at the stem, the quarterdeck 4.6-5.2, the
 *   bridge top 17-18, the foremast platform 31.9. The funnels read low (the
 *   last returns fall inside the open stacks), so their 20.5 m is from OSM.
 * - Published: length 613 ft 6 in (187 m), beam 63 ft 4 in (19.3 m),
 *   12 x 6-inch in four triple Mk XXIII turrets, 12 x 4-inch in six twin
 *   mounts (Wikipedia "HMS Belfast (C35)"; Imperial War Museums).
 * - Photos (Wikimedia Commons), opened and compared:
 *   "London, HMS Belfast -- 2016 -- 4797.jpg", Dietmar Rabich, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:London,_HMS_Belfast_--_2016_--_4797.jpg
 *     (bow on, starboard bow: flare, stem, bridge front, foremast);
 *   "HMS Belfast near Tower Bridge. London.jpg", Ввласенко, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:HMS_Belfast_near_Tower_Bridge._London.jpg
 *     (starboard bow quarter: camouflage, bridge, masts);
 *   "HMS Belfast. London.jpg", Ввласенко, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:HMS_Belfast._London.jpg
 *     (starboard quarter from astern: funnels, masts, X and Y);
 *   "HMS Belfast from London Bridge City of London England.jpg", Acabashi,
 *     CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:HMS_Belfast_from_London_Bridge_City_of_London_England.jpg
 *     (starboard side: the whole camouflage and the profile);
 *   "London , Southwark - HMS Belfast from The Shard - geograph.org.uk -
 *     4819897.jpg", Lewis Clarke, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:London_,_Southwark_-_HMS_Belfast_from_The_Shard_-_geograph.org.uk_-_4819897.jpg
 *     (from above, port side: decks, turret plan, port camouflage);
 *   "Bows of HMS Belfast, London - geograph.org.uk - 2332967.jpg", Peter
 *     Trimming, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Bows_of_HMS_Belfast,_London_-_geograph.org.uk_-_2332967.jpg
 * - Look-only: none.
 *
 * Estimated: the waterline plan (from the deck outline and the published
 * beam, finer forward for the flare), the camouflage boundaries (from the
 * photos, simplified to straight diagonals, at most three regions across
 * any station), the turret shape and barrel length (50 calibres, 7.6 m),
 * the topmasts (lattice to 38.4 and 33.2, poles to 41 and 36; OSM gives 41
 * overall), the secondary mounts and directors.
 *
 * Doubts
 * - type: docs/reference.md has no "vessel" type; "other" is used, with
 *   ship tags.
 * - The guns are trained fore and aft; the real forward turrets are trained
 *   a little to starboard and elevated. The rigging, rails, boats, cranes and
 *   the quarterdeck awning are left out.
 * - The camouflage is a simplification of the real pattern; its boundaries
 *   are within a few metres of the photos, not traced exactly.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { writeFileSync } from 'node:fs'

export const BEARING = 286.8
const ID = 'london-hms-belfast'

// ---------------------------------------------------------------------------
// Kit: planar facets with real recessed openings
// ---------------------------------------------------------------------------
type P2 = [number, number]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const subv = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (a: V3): V3 => scl(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1))

/** A convex polygon, wound so its face points along `want` (flipped if not). */
function poly(p: Part, pts: V3[], want?: V3) {
  if (pts.length < 3) return
  let q = pts
  if (want) {
    let n: V3 = [0, 0, 0]
    for (let i = 0; i < q.length; i++) n = add(n, crs(q[i], q[(i + 1) % q.length]))
    if (dot(n, want) < 0) q = [...q].reverse()
  }
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}

/** Keep the part of a convex 2D polygon with a*s + b*t <= c. */
function clip2(pg: P2[], a: number, b: number, c: number): P2[] {
  const out: P2[] = []
  for (let i = 0; i < pg.length; i++) {
    const P = pg[i], Q = pg[(i + 1) % pg.length]
    const fp = a * P[0] + b * P[1] - c, fq = a * Q[0] + b * Q[1] - c
    if (fp <= 0) out.push(P)
    if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) {
      const k = fp / (fp - fq)
      out.push([P[0] + (Q[0] - P[0]) * k, P[1] + (Q[1] - P[1]) * k])
    }
  }
  return out
}

/** Keep the part of a convex 3D polygon with n.p <= d. */
function clip3(pg: V3[], n: V3, d: number): V3[] {
  const out: V3[] = []
  for (let i = 0; i < pg.length; i++) {
    const P = pg[i], Q = pg[(i + 1) % pg.length]
    const fp = dot(n, P) - d, fq = dot(n, Q) - d
    if (fp <= 1e-9) out.push(P)
    if ((fp < -1e-9 && fq > 1e-9) || (fp > 1e-9 && fq < -1e-9)) {
      const k = fp / (fp - fq)
      out.push(add(P, scl(subv(Q, P), k)))
    }
  }
  return out
}

type Frame = { o: V3; u: V3; v: V3; n: V3 }
/** A facet's frame: n outward, u horizontal to the right seen from outside, v up the face. */
function frameOf(pg: V3[]): Frame {
  let n: V3 = [0, 0, 0]
  for (let i = 0; i < pg.length; i++) n = add(n, crs(pg[i], pg[(i + 1) % pg.length]))
  n = unit(n)
  let u = crs([0, 0, 1], n)
  if (Math.hypot(u[0], u[1], u[2]) < 1e-6) u = [1, 0, 0]
  u = unit(u)
  return { o: pg[0], u, v: crs(n, u), n }
}
const to2 = (f: Frame, p: V3): P2 => [dot(subv(p, f.o), f.u), dot(subv(p, f.o), f.v)]
const to3 = (f: Frame, s: number, t: number, d = 0): V3 => add(add(add(f.o, scl(f.u, s)), scl(f.v, t)), scl(f.n, d))

/** A recessed opening in facet coordinates. */
type Hole = { s0: number; s1: number; t0: number; t1: number; d: number; back: Part; side?: Part }

function inside2(pg: P2[], s: number, t: number) {
  for (let i = 0; i < pg.length; i++) {
    const P = pg[i], Q = pg[(i + 1) % pg.length]
    if ((Q[0] - P[0]) * (t - P[1]) - (Q[1] - P[1]) * (s - P[0]) < -1e-6) return false
  }
  return true
}

/**
 * A planar convex facet (counter-clockwise seen from outside) with
 * rectangular openings recessed into it: the face is cut into horizontal
 * strips at the openings' edges and each strip into cells, so the openings
 * are real holes with a back and reveals. Openings that do not fit inside
 * the facet, or overlap one already taken, are dropped.
 */
function facet(p: Part, pg3: V3[], holes: Hole[] = [], f = frameOf(pg3)) {
  const pg = pg3.map((q) => to2(f, q))
  const ok: Hole[] = []
  for (const h of holes) {
    if (!(h.s1 > h.s0 && h.t1 > h.t0)) continue
    if (![[h.s0, h.t0], [h.s1, h.t0], [h.s1, h.t1], [h.s0, h.t1]].every(([s, t]) => inside2(pg, s, t))) continue
    if (ok.some((k) => k.s0 < h.s1 && h.s0 < k.s1 && k.t0 < h.t1 && h.t0 < k.t1)) continue
    ok.push(h)
  }
  const ts = [...new Set([Math.min(...pg.map((q) => q[1])), Math.max(...pg.map((q) => q[1])), ...ok.flatMap((h) => [h.t0, h.t1])])].sort((a, b) => a - b)
  const emit = (cell: P2[]) => { if (cell.length >= 3) poly(p, cell.map(([s, t]) => to3(f, s, t)), f.n) }
  for (let i = 0; i < ts.length - 1; i++) {
    const ta = ts[i], tb = ts[i + 1]
    if (tb - ta < 1e-6) continue
    const strip = clip2(clip2(pg, 0, -1, -ta), 0, 1, tb)
    if (strip.length < 3) continue
    const act = ok.filter((h) => h.t0 <= ta + 1e-6 && h.t1 >= tb - 1e-6).sort((a, b) => a.s0 - b.s0)
    let from = -Infinity
    for (const h of act) {
      emit(clip2(from === -Infinity ? strip : clip2(strip, -1, 0, -from), 1, 0, h.s0))
      from = h.s1
    }
    emit(from === -Infinity ? strip : clip2(strip, -1, 0, -from))
  }
  for (const h of ok) recess(p, f, h)
}

/** The back and reveals of an opening. The head (facing down) is left out. */
function recess(p: Part, f: Frame, h: Hole) {
  const s = h.side ?? p
  const F = (a: number, b: number) => to3(f, a, b), B = (a: number, b: number) => to3(f, a, b, -h.d)
  poly(h.back, [B(h.s0, h.t0), B(h.s1, h.t0), B(h.s1, h.t1), B(h.s0, h.t1)], f.n)
  poly(s, [F(h.s0, h.t0), F(h.s1, h.t0), B(h.s1, h.t0), B(h.s0, h.t0)], f.v) // sill
  poly(s, [F(h.s0, h.t0), B(h.s0, h.t0), B(h.s0, h.t1), F(h.s0, h.t1)], f.u) // left reveal
  poly(s, [F(h.s1, h.t0), F(h.s1, h.t1), B(h.s1, h.t1), B(h.s1, h.t0)], scl(f.u, -1)) // right reveal
}

/** Facet-frame s for a world point, and t for a world height on that facet. */
const sAt = (f: Frame, p: V3) => dot(subv(p, f.o), f.u)
const tAtZ = (f: Frame, z: number) => (z - f.o[2]) / f.v[2]

/** A vertical wall quad from a to b (plan points, counter-clockwise round the building) between z0 and z1. */
const wallPoly = (a: P2, b: P2, z0: number, z1: number): V3[] => [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]]

/** A box with its corners chamfered by c, top capped. */
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, c = 0.3, top = true) {
  const r = (z: number): V3[] => c > 0
    ? [[x0 + c, y0, z], [x1 - c, y0, z], [x1, y0 + c, z], [x1, y1 - c, z], [x1 - c, y1, z], [x0 + c, y1, z], [x0, y1 - c, z], [x0, y0 + c, z]]
    : [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  p.loft([r(z0), r(z1)])
  if (top) p.cap(r(z1), true)
}

/** Offset a counter-clockwise plan ring outward by d (mitred). */
function offsetRing(r: P2[], d: number): P2[] {
  const n = r.length
  return r.map((P, i) => {
    const A = r[(i - 1 + n) % n], C = r[(i + 1) % n]
    const e1 = unit([P[0] - A[0], P[1] - A[1], 0]), e2 = unit([C[0] - P[0], C[1] - P[1], 0])
    const n1: P2 = [e1[1], -e1[0]], n2: P2 = [e2[1], -e2[0]]
    const m: P2 = [n1[0] + n2[0], n1[1] + n2[1]]
    const k = d / (1 + n1[0] * n2[0] + n1[1] * n2[1])
    return [P[0] + m[0] * k, P[1] + m[1] * k] as P2
  })
}

/** A band standing proud of a plan ring by `out`, between z0 and z1 (a cornice or string course). */
function band(p: Part, r: P2[], z0: number, z1: number, out: number) {
  const o = offsetRing(r, out)
  const n = r.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    p.quad([o[i][0], o[i][1], z0], [o[j][0], o[j][1], z0], [o[j][0], o[j][1], z1], [o[i][0], o[i][1], z1])
    p.quad([r[i][0], r[i][1], z1], [o[i][0], o[i][1], z1], [o[j][0], o[j][1], z1], [r[j][0], r[j][1], z1])
    p.quad([r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [o[j][0], o[j][1], z0], [o[i][0], o[i][1], z0])
  }
}

/** Chamfer the convex corners of a counter-clockwise plan ring by c. */
function chamfer(r: P2[], c: number): { ring: P2[]; cut: boolean[] } {
  const ring: P2[] = [], cut: boolean[] = []
  const n = r.length
  r.forEach((P, i) => {
    const A = r[(i - 1 + n) % n], C = r[(i + 1) % n]
    const convex = (P[0] - A[0]) * (C[1] - P[1]) - (P[1] - A[1]) * (C[0] - P[0]) > 0
    if (!convex) { ring.push(P); cut.push(false); return }
    const a = unit([A[0] - P[0], A[1] - P[1], 0]), b = unit([C[0] - P[0], C[1] - P[1], 0])
    ring.push([P[0] + a[0] * c, P[1] + a[1] * c]); cut.push(false)
    ring.push([P[0] + b[0] * c, P[1] + b[1] * c]); cut.push(true) // edge into this point is the chamfer
  })
  return { ring, cut }
}

/** Ear-clipping cap for a simple counter-clockwise plan ring at height z. */
function capRing(p: Part, r: P2[], z: number) {
  const idx = r.map((_, i) => i)
  const area = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const a = r[idx[(k - 1 + idx.length) % idx.length]], b = r[idx[k]], c = r[idx[(k + 1) % idx.length]]
      if (area(a, b, c) <= 1e-9) continue
      const blocked = idx.some((m) => {
        const q = r[m]
        if (q === a || q === b || q === c) return false
        return area(a, b, q) > 0 && area(b, c, q) > 0 && area(c, a, q) > 0
      })
      if (blocked) continue
      p.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) p.tri([...r[idx[0]], z] as V3, [...r[idx[1]], z] as V3, [...r[idx[2]], z] as V3)
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Materials
// ---------------------------------------------------------------------------
const M = {
  dark: finish('belfast-camo-dark', 0x4c5b6b),
  mid: finish('belfast-camo-mid', 0x8796a2),
  pale: finish('belfast-camo-pale', 0xd3d9dc),
  deck: finish('belfast-deck', 0xa8a196),
  black: finish('belfast-black', 0x4a4f57),
  window: PALETTE.window,
}
const dark = new Part(), mid = new Part(), pale = new Part(), deck = new Part(), black = new Part(), win = new Part()

const lerpT = (tab: [number, number][], y: number) => {
  if (y <= tab[0][0]) return tab[0][1]
  for (let i = 0; i < tab.length - 1; i++) {
    const [y0, a] = tab[i], [y1, b] = tab[i + 1]
    if (y <= y1) return a + ((b - a) * (y - y0)) / (y1 - y0)
  }
  return tab[tab.length - 1][1]
}

// ---------------------------------------------------------------------------
// The hull: flare, sheer, raked stem, cruiser stern, the quarterdeck step
// ---------------------------------------------------------------------------
const STERN = -91, BOW = 94, BREAK = -31
/** Deck-edge half-breadth (OSM outline, held to the published 19.3 m beam). */
const W1: [number, number][] = [
  [-91, 0], [-89.5, 2.0], [-87, 3.3], [-83, 4.4], [-77, 5.5], [-70, 6.5], [-60, 7.8], [-50, 8.8], [-38, 9.5], [-25, 9.8],
  [-10, 9.8], [10, 9.75], [27, 9.45], [41, 8.9], [52, 8.1], [62, 7.1], [70, 6.0], [78, 4.7], [85, 3.1], [90, 1.7], [94, 0],
]
/** Waterline half-breadth: fuller amidships, fine at the bow (the flare), ends short of the deck at both ends. */
const W0: [number, number][] = [
  [-88, 0], [-86, 1.6], [-82, 3.3], [-76, 4.7], [-70, 5.9], [-60, 7.4], [-50, 8.5], [-38, 9.35], [-25, 9.62],
  [-10, 9.65], [10, 9.6], [27, 9.05], [41, 8.0], [52, 6.8], [62, 5.3], [70, 3.9], [78, 2.4], [85, 1.0], [90, 0],
]
/** Forecastle deck (with the sheer rising to the bow) and the quarterdeck, one deck lower. */
const zF = (y: number) => 7.25 + Math.pow(Math.max(0, y - 35) / (BOW - 35), 2) * 1.6
const zQ = (y: number) => 4.9 + Math.pow(Math.max(0, BREAK - y) / (BREAK - STERN), 2) * 0.35
const zDeck = (y: number) => (y >= BREAK ? zF(y) : zQ(y))
const zSeg = (y: number, seg: number) => (seg > 0 ? zF(y) : zQ(y))
const zBot = (y: number) => y > 90 ? zF(y) * ((y - 90) / (BOW - 90)) * 0.97 : y < -88 ? zQ(y) * ((-88 - y) / (-88 - STERN)) * 0.95 : 0
const vAt = (y: number, z: number, seg: number) => Math.max(0, Math.min(1, (z - zBot(y)) / (zSeg(y, seg) - zBot(y))))
const hullPt = (y: number, v: number, side: number, seg: number): V3 => {
  const zd = zSeg(y, seg), zb = zBot(y), w0 = lerpT(W0, y), w1 = lerpT(W1, y)
  return [side * (w0 + (w1 - w0) * Math.pow(v, 1.6)), y, zb + v * (zd - zb)]
}

/** Camouflage: regions between boundary lines y = a + (b - a) v (a at the waterline, b at the deck edge). */
type Region = { a: number; b: number; c: Part; split?: number; low?: Part }
const STAR: Region[] = [ // starboard (+x), from the stern
  { a: -200, b: -200, c: dark }, { a: -72, b: -80, c: pale }, { a: -40, b: -52, c: mid },
  { a: 10, b: -18, c: pale, split: 0.32, low: dark }, { a: 55, b: 30, c: dark },
]
const PORT: Region[] = [ // port (-x)
  { a: -200, b: -200, c: mid }, { a: -66, b: -50, c: pale, split: 0.36, low: dark }, { a: -16, b: -30, c: pale },
  { a: 30, b: 46, c: dark }, { a: 43, b: 62, c: dark, split: 0.45, low: pale },
]
function hullSide(side: number, y0: number, y1: number, stations: number[]) {
  const regs = side > 0 ? STAR : PORT
  const vs = [0, 0.45, 1]
  const ys = stations.filter((y) => y >= y0 && y <= y1)
  for (let i = 0; i < ys.length - 1; i++) {
    for (let j = 0; j < vs.length - 1; j++) {
      const cell: P2[] = [[ys[i], vs[j]], [ys[i + 1], vs[j]], [ys[i + 1], vs[j + 1]], [ys[i], vs[j + 1]]]
      for (let r = 0; r < regs.length; r++) {
        const A = regs[r], B = regs[r + 1]
        // y >= A.a + (A.b - A.a) v   and   y <= B.a + (B.b - B.a) v
        let q = clip2(cell, -1, A.b - A.a, -A.a)
        if (B) q = clip2(q, 1, -(B.b - B.a), B.a)
        if (q.length < 3) continue
        const pieces: [P2[], Part][] = A.split === undefined ? [[q, A.c]] : [[clip2(q, 0, 1, A.split), A.low!], [clip2(q, 0, -1, -A.split), A.c]]
        // The black boot-topping along the waterline cuts every region.
        const boot = 0.07
        const split: [P2[], Part][] = []
        for (const [pc, mat] of pieces) {
          split.push([clip2(pc, 0, 1, boot), black], [clip2(pc, 0, -1, -boot), mat])
        }
        for (const [pc, mat] of split) {
          if (pc.length < 3) continue
          const seg = y0 < BREAK - 1 ? -1 : 1
          const pts = pc.map(([y, v]) => hullPt(y, v, side, seg))
          poly(mat, pts, [side, 0, 0])
        }
      }
    }
  }
}
const ST: number[] = [...new Set([...W1.map((p) => p[0]), ...W0.map((p) => p[0]), BREAK, -88, 90,
  ...Array.from({ length: 38 }, (_, k) => STERN + k * 5)].filter((y) => y >= STERN && y <= BOW))].sort((a, b) => a - b)
for (const side of [1, -1]) {
  hullSide(side, STERN, BREAK, ST)
  hullSide(side, BREAK, BOW, ST)
}
// Decks.
for (const [y0, y1] of [[STERN, BREAK], [BREAK, BOW]]) {
  const ys = ST.filter((y) => y >= y0 && y <= y1)
  for (let i = 0; i < ys.length - 1; i++) {
    const s = (y: number, side: number) => hullPt(y, 1, side, y0 < BREAK ? -1 : 1)
    poly(deck, [s(ys[i], -1), s(ys[i], 1), s(ys[i + 1], 1), s(ys[i + 1], -1)], [0, 0, 1])
  }
}
// The break of the forecastle: a bulkhead facing aft.
{
  const w = lerpT(W1, BREAK)
  poly(pale, [[-w, BREAK, zQ(BREAK)], [w, BREAK, zQ(BREAK)], [w, BREAK, zF(BREAK)], [-w, BREAK, zF(BREAK)]], [0, -1, 0])
}

// ---------------------------------------------------------------------------
// Kit for the upperworks
// ---------------------------------------------------------------------------
/** A box with chamfered vertical corners; sides and top in one material (or separate top). */
function hbox(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, c = 0.25, top?: Part) {
  const r = (z: number): V3[] => [[x0 + c, y0, z], [x1 - c, y0, z], [x1, y0 + c, z], [x1, y1 - c, z], [x1 - c, y1, z], [x0 + c, y1, z], [x0, y1 - c, z], [x0, y0 + c, z]]
  p.loft([r(z0), r(z1)])
  ;(top ?? p).cap(r(z1), true)
}
/** A tube between two points, n sides, radius r (capped at the far end). */
function tube(p: Part, a: V3, b: V3, r: number, n = 6, cap = true) {
  const d = unit(subv(b, a))
  const ref: V3 = Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const u = unit(crs(d, ref)), w = crs(d, u)
  const ring = (c: V3) => Array.from({ length: n }, (_, k) => {
    const t = (k / n) * Math.PI * 2
    return add(c, add(scl(u, r * Math.cos(t)), scl(w, r * Math.sin(t))))
  })
  const A = ring(a), B = ring(b)
  for (let k = 0; k < n; k++) {
    const j = (k + 1) % n
    const nk = unit(subv(A[k], a)), nj = unit(subv(A[j], a))
    p.tri(A[k], A[j], B[j], undefined, undefined, undefined, [nk, nj, nj])
    p.tri(A[k], B[j], B[k], undefined, undefined, undefined, [nk, nj, nk])
  }
  if (cap) poly(p, B, d)
}
/** A vertical cylinder (barbette), n sides. */
function cyl(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, n = 14, top?: Part) {
  const ring = (z: number) => Array.from({ length: n }, (_, k) => [cx + r * Math.cos((k / n) * Math.PI * 2), cy + r * Math.sin((k / n) * Math.PI * 2), z] as V3)
  const A = ring(z0), B = ring(z1)
  for (let k = 0; k < n; k++) {
    const j = (k + 1) % n
    const nk: V3 = unit([A[k][0] - cx, A[k][1] - cy, 0]), nj: V3 = unit([A[j][0] - cx, A[j][1] - cy, 0])
    p.tri(A[k], A[j], B[j], undefined, undefined, undefined, [nk, nj, nj])
    p.tri(A[k], B[j], B[k], undefined, undefined, undefined, [nk, nj, nk])
  }
  poly(top ?? p, B, [0, 0, 1])
}
/** A low dome (director), radius r, on z0. */
function dome(p: Part, cx: number, cy: number, r: number, z0: number, n = 10) {
  const rings = [0, 0.45, 0.8, 1].map((t) => {
    const a = (t * Math.PI) / 2
    return Array.from({ length: n }, (_, k) => [cx + r * Math.cos(a) * Math.cos((k / n) * Math.PI * 2), cy + r * Math.cos(a) * Math.sin((k / n) * Math.PI * 2), z0 + r * Math.sin(a) * 0.85] as V3)
  })
  for (let i = 0; i < rings.length - 1; i++) {
    for (let k = 0; k < n; k++) {
      const j = (k + 1) % n
      const q = [rings[i][k], rings[i][j], rings[i + 1][j], rings[i + 1][k]]
      const m = scl(add(add(q[0], q[1]), add(q[2], q[3])), 0.25)
      poly(p, q, subv(m, [cx, cy, z0]))
    }
  }
}

/**
 * A Mk XXIII triple 6-inch turret: tapered sides, sloped face, flat roof,
 * three real barrels. (cx, cy) centre of rotation; dir +1 trains forward, -1 aft.
 */
function turret(cx: number, cy: number, zBase: number, dir: number, barbette?: number) {
  if (barbette !== undefined) cyl(mid, cx, cy, 3.7, barbette, zBase, 14, deck)
  const H = 2.9, F = dir
  const P = (x: number, y: number, z: number): V3 => [cx + x, cy + F * y, zBase + z]
  // Plan: rear 7.8 wide at y -4.6, front 6.0 wide at y +3.6; the face slopes back 1.1 m.
  const bot = [P(-3.9, -4.6, 0), P(3.9, -4.6, 0), P(3.0, 3.6, 0), P(-3.0, 3.6, 0)]
  const top = [P(-3.75, -4.4, H), P(3.75, -4.4, H), P(2.8, 2.5, H), P(-2.8, 2.5, H)]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const q = [bot[i], bot[j], top[j], top[i]]
    const m = scl(add(add(q[0], q[1]), add(q[2], q[3])), 0.25)
    poly(pale, q, subv(m, P(0, -0.4, H / 2)))
  }
  poly(pale, top, [0, 0, 1])
  // Rangefinder hood ears at the rear corners.
  for (const s of [-1, 1]) hbox(mid, cx + s * 3.9 - 0.6, cy + F * -3.2 - 0.6, cx + s * 3.9 + 0.6, cy + F * -3.2 + 0.6, zBase + 1.4, zBase + 2.3, 0.15)
  // Barrels, elevated 10 degrees, from the face.
  const el = (10 * Math.PI) / 180, L = 7.6
  for (const x of [-1.75, 0, 1.75]) {
    const a = P(x, 3.0, 1.15), b: V3 = [a[0], a[1] + F * L * Math.cos(el), a[2] + L * Math.sin(el)]
    tube(mid, a, b, 0.27, 6)
    // Blast bag at the root.
    tube(black, P(x, 2.95, 1.15), [a[0], a[1] + F * 0.9, a[2] + 0.16], 0.45, 6, false)
  }
}

// ---------------------------------------------------------------------------
// Turrets A, B forward; X, Y aft
// ---------------------------------------------------------------------------
const FC = zDeck(0) // forecastle deck amidships
turret(-0.3, 65.0, zDeck(65) + 0.6, 1, zDeck(65) - 0.05)
turret(-0.3, 55.3, 10.6, 1, zDeck(55) - 0.05)
turret(-0.2, -49.4, 10.6, -1, 7.4)
turret(-0.1, -59.4, 8.1, -1, zDeck(-59) - 0.05)
// X turret's raised base.
hbox(mid, -5.8, -61.3, 5.6, -46.0, zDeck(-50) - 0.05, 7.5, 0.6, deck)

// ---------------------------------------------------------------------------
// Bridge, deckhouses, funnels, masts
// ---------------------------------------------------------------------------
// Bridge base: the wide shelter-deck house with the wings.
hbox(mid, -8.6, 23.5, 8.6, 44.0, FC - 0.05, 13.5, 0.6, deck)
// The bridge: stacked round-fronted decks stepping in to the compass
// platform, each with a window band, and the director control tower on top.
function bridgeDeck(R: number, yb: number, yc: number, z0: number, z1: number, wz?: [number, number]) {
  const n = 8
  const pts: P2[] = [[R, yb]]
  for (let k = 0; k <= n; k++) { const a = (k / n) * Math.PI; pts.push([R * Math.cos(a), yc + R * Math.sin(a)]) }
  pts.push([-R, yb])
  const lvl = (z: number, r = R) => pts.map(([x, y]) => {
    const k = r / R
    return [x * k, y > yc ? yc + (y - yc) * k : y, z] as V3
  })
  if (!wz) { pale.loft([lvl(z0), lvl(z1)]); pale.cap(lvl(z1), true); return }
  pale.loft([lvl(z0), lvl(wz[0])])
  win.loft([lvl(wz[0], R - 0.15), lvl(wz[1], R - 0.15)])
  const L0 = lvl(wz[0]), I0 = lvl(wz[0], R - 0.15)
  for (let k = 0; k < L0.length; k++) { const j = (k + 1) % L0.length; poly(pale, [L0[k], L0[j], I0[j], I0[k]], [0, 0, 1]) }
  pale.loft([lvl(wz[1]), lvl(z1)])
  pale.cap(lvl(z1), true)
}
bridgeDeck(6.6, 25.0, 38.6, 13.5, 16.2, [14.9, 15.7])
bridgeDeck(5.5, 26.2, 39.6, 16.2, 19.0, [17.3, 18.4])
bridgeDeck(4.6, 27.6, 39.4, 19.0, 21.0, [19.9, 20.4])
// Director control tower with its rangefinder arms and hood.
hbox(mid, -2.1, 32.4, 2.1, 37.4, 21.0, 23.8, 0.35)
hbox(black, -3.7, 34.4, 3.7, 35.4, 22.8, 23.5, 0.1)
dome(black, 0, 34.9, 1.5, 23.8)
// Midships shelter-deck house, the aft superstructure, the after director.
hbox(mid, -6.6, -51.6, 6.4, 0.6, 7.2, 10.0, 0.5, deck)
hbox(mid, -6.6, -51.6, 6.4, BREAK, zDeck(-40) - 0.05, 7.3, 0.4) // under it, aft of the break
hbox(pale, -4.0, -44.6, 3.8, -30.6, 10.0, 12.5, 0.4, deck)
hbox(mid, -1.8, -40.2, 1.8, -36.4, 12.5, 14.4, 0.3)
hbox(black, -2.9, -38.6, 2.9, -37.9, 13.6, 14.1, 0.1)
// Boat deck between the funnels and the bridge.
hbox(mid, -5.6, 0.6, 5.6, 25.7, FC - 0.05, 9.6, 0.4, deck)

// Funnels: stadium section, raked aft, black caps.
for (const yc of [4.75, -22.05]) {
  const n = 12, a = 3.4, b = 2.6, z0 = 9.6, z1 = 23.0, rake = 1.4
  const ring = (z: number, sh: number) => Array.from({ length: n }, (_, k) => {
    const t = (k / n) * Math.PI * 2
    return [b * Math.cos(t), yc + a * Math.sin(t) - sh, z] as V3
  })
  const r0 = ring(z0, 0), r1 = ring(z1 - 1.1, rake * (z1 - 1.1 - z0) / (z1 - z0)), r2 = ring(z1, rake)
  const sm = (R: V3[], S: V3[], p: Part) => {
    for (let k = 0; k < n; k++) {
      const j = (k + 1) % n
      const t0 = (k / n) * Math.PI * 2, t1 = (j / n) * Math.PI * 2
      const n0: V3 = unit([Math.cos(t0) / b, Math.sin(t0) / a, 0]), n1: V3 = unit([Math.cos(t1) / b, Math.sin(t1) / a, 0])
      p.tri(R[k], R[j], S[j], undefined, undefined, undefined, [n0, n1, n1])
      p.tri(R[k], S[j], S[k], undefined, undefined, undefined, [n0, n1, n0])
    }
  }
  sm(r0, r1, pale)
  sm(r1, r2, black)
  poly(black, r2, [0, 0, 1])
}

/** A tripod mast: apex, three feet, a platform, a tapered lattice topmast with yards, a pole. */
function tripod(apex: V3, feet: V3[], top: number, pole: number, yard: number) {
  for (const f of feet) tube(pale, f, apex, 0.42, 6, false)
  hbox(mid, apex[0] - 1.6, apex[1] - 1.6, apex[0] + 1.6, apex[1] + 1.6, apex[2] - 0.2, apex[2] + 0.5, 0.2)
  // Lattice topmast: four dark legs, tapering, with cross braces.
  const z0 = apex[2] + 0.5, h0 = 1.1, h1 = 0.5
  const leg = (sx: number, sy: number, z: number) => {
    const h = h0 + (h1 - h0) * ((z - z0) / (top - z0))
    return [apex[0] + sx * h, apex[1] + sy * h, z] as V3
  }
  const corners: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  for (const [sx, sy] of corners) tube(black, leg(sx, sy, z0), leg(sx, sy, top), 0.14, 4, false)
  const zm = (z0 + top) / 2
  for (let i = 0; i < 4; i++) {
    const [ax, ay] = corners[i], [bx, by] = corners[(i + 1) % 4]
    tube(black, leg(ax, ay, z0), leg(bx, by, zm), 0.1, 4, false)
    tube(black, leg(ax, ay, zm), leg(bx, by, top), 0.1, 4, false)
  }
  hbox(black, apex[0] - h1 - 0.2, apex[1] - h1 - 0.2, apex[0] + h1 + 0.2, apex[1] + h1 + 0.2, top, top + 0.5, 0.05)
  tube(black, [apex[0], apex[1], top + 0.5], [apex[0], apex[1], pole], 0.13, 4)
  // Yards.
  tube(pale, [apex[0] - yard / 2, apex[1], top - 1.4], [apex[0] + yard / 2, apex[1], top - 1.4], 0.12, 4)
  tube(pale, [apex[0] - yard * 0.35, apex[1], zm], [apex[0] + yard * 0.35, apex[1], zm], 0.12, 4)
}
tripod([0, 28.6, 31.5], [[0, 30.0, 21.0], [-3.1, 24.2, 13.5], [3.1, 24.2, 13.5]], 38.4, 41.0, 8.5)
tripod([0, -12.4, 27.5], [[0, -8.2, 10.0], [-3.0, -16.4, 10.0], [3.0, -16.4, 10.0]], 33.2, 36.0, 7.0)

// Secondary armament: three twin 4-inch mounts a side, shields and barrels.
for (const side of [-1, 1]) {
  for (const yc of [-3.4, -11.6, -17.6]) {
    const x = side * 5.3
    hbox(pale, x - 1.6, yc - 1.5, x + 1.6, yc + 1.8, 10.0, 12.5, 0.35)
    for (const o of [-0.55, 0.55]) {
      const a: V3 = [x + o, yc + 1.7, 11.4]
      tube(mid, a, [a[0] + side * 1.4, a[1] + 3.8, a[2] + 1.8], 0.2, 4)
    }
  }
}
// Deckhouses between the funnels and round the mainmast foot (the
// searchlight and pom-pom platforms), and the after control position.
hbox(pale, -3.3, -17.6, 3.3, -6.2, 10.0, 12.9, 0.35, deck)
hbox(pale, -2.4, -4.6, 2.4, 0.4, 10.0, 12.4, 0.3, deck)
hbox(mid, -2.6, -16.4, 2.6, -14.0, 12.9, 14.6, 0.25)
for (const side of [-1, 1]) {
  hbox(pale, side > 0 ? 3.0 : -6.4, -28.6, side > 0 ? 6.4 : -3.0, -25.6, 10.0, 12.6, 0.3, deck)
  dome(black, side * 4.7, -27.1, 1.0, 12.6)
}
// Directors: the black domes beside the bridge and aft.
for (const side of [-1, 1]) dome(black, side * 6.3, 23.4, 1.25, 13.5)
dome(black, 0, -33.0, 1.2, 12.5)
// Bridge-wing pom-pom tubs and the hangar roofs: plain blocks on the boat deck.
for (const side of [-1, 1]) hbox(pale, side > 0 ? 3.4 : -7.8, 14.0, side > 0 ? 7.8 : -3.4, 21.0, 9.6, 12.4, 0.4, deck)
// Portholes along the forecastle: a broken row, as lit windows (only a few, bold).
for (const side of [-1, 1]) {
  for (let y = -26; y <= 52; y += 6.5) {
    const seg = y >= BREAK ? 1 : -1
    const z = zDeck(y) - 1.6
    const pt = (yy: number, zz: number): V3 => { const q = hullPt(yy, vAt(yy, zz, seg), side, seg); return [q[0] + side * 0.03, q[1], q[2]] }
    poly(win, [pt(y - 0.35, z - 0.35), pt(y + 0.35, z - 0.35), pt(y + 0.35, z + 0.35), pt(y - 0.35, z + 0.35)], [side, 0, 0])
  }
}

// Ship's boats on the boat deck and the boat crane between them.
for (const side of [-1, 1]) {
  for (const [y0, y1] of [[9.5, 18.0], [-29.0, -24.0]] as [number, number][]) {
    const x = side * 6.9, z0 = 10.4
    const hull: V3[] = [[x - 1.1, y0 + 0.8, z0], [x + 1.1, y0 + 0.8, z0], [x + 1.1, y1 - 1.2, z0], [x, y1, z0], [x - 1.1, y1 - 1.2, z0]]
    const top = hull.map(([a, b, c]) => [x + (a - x) * 1.12, b, c + 1.1] as V3)
    const bot = hull.map(([a, b]) => [x + (a - x) * 0.6, b, z0] as V3)
    for (let i = 0; i < hull.length; i++) {
      const j = (i + 1) % hull.length
      poly(pale, [bot[i], bot[j], top[j], top[i]], [top[i][0] + top[j][0] - 2 * x, (top[i][1] + top[j][1]) / 2 - (y0 + y1) / 2, 0])
    }
    poly(mid, top, [0, 0, 1])
    // Davits.
    for (const y of [y0 + 1.5, y1 - 1.8]) tube(black, [side * 5.4, y, 9.6], [side * 7.0, y, 12.6], 0.13, 4)
  }
}
tube(black, [0, -4.0, 10.0], [0, -4.0, 16.5], 0.45, 6)
tube(black, [0, -4.0, 15.8], [8.5, -1.0, 13.2], 0.22, 4)
// Bow: the hawse pipes and the breakwater on the forecastle.
for (const side of [-1, 1]) poly(black, [[side * lerpT(W1, 84) * 0.93, 84.0, 5.6], [side * lerpT(W1, 85.6) * 0.93, 85.6, 5.6], [side * lerpT(W1, 85.6) * 0.93, 85.6, 6.6], [side * lerpT(W1, 84) * 0.93, 84.0, 6.6]], [side, 0.3, 0])
{
  const yb = 73.0, z = zDeck(yb)
  poly(pale, [[-5.4, yb - 2.2, z], [0, yb + 1.0, z], [0, yb + 1.0, z + 1.1], [-5.4, yb - 2.2, z + 0.9]], [-0.5, 1, 0])
  poly(pale, [[0, yb + 1.0, z], [5.4, yb - 2.2, z], [5.4, yb - 2.2, z + 0.9], [0, yb + 1.0, z + 1.1]], [0.5, 1, 0])
}

const parts = [
  { part: dark, material: M.dark },
  { part: mid, material: M.mid },
  { part: pale, material: M.pale },
  { part: deck, material: M.deck },
  { part: black, material: M.black },
  { part: win, material: M.window },
]
if (import.meta.main) {
  const tris = parts.reduce((s, { part }) => s + part.triangles, 0)
  const glb = writeGlb('HMS Belfast', parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the waterline anchor' })
  writeFileSync(new URL(`../models/${ID}.glb`, import.meta.url), glb)
  console.log(`models/${ID}.glb: ${tris} triangles, ${glb.length} bytes`)
}
