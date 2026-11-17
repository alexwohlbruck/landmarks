/**
 * Geisel Library, UC San Diego — William Pereira, 1970.
 *
 * The brutalist "spaceship": a board-formed concrete pedestal on sixteen
 * piers, each pier bending outward into a raking strut that carries the
 * widest floor; floors 4 and 5 hang inside the strut cage, widening upward,
 * floor 6 is the widest, and floors 7 and 8 step back in again, so the
 * section is a diamond. Every floor is a band of glass under a thick
 * concrete slab edge, and every plan is a square with stepped corners.
 *
 * Frame: bearing 0 (OSM's outline is square to north within 0.2°). +x east,
 * +y north, metres, origin at the anchor (the outline's centre). z = 0 is
 * the lowest ground under the footprint as the map's terrain draws it,
 * lidar 1.5 m above ground_min. The real forum plaza the piers stand on is
 * the roof of the underground floors, 8.5 m higher (lidar 10.0); the map's
 * bare-earth terrain doesn't show it, so the pedestal runs down to z = 0 as
 * the library's own lower floors. Elevation 0.
 *
 * Sources
 * - OSM way/159385495 (Geisel Library, architect William Pereira,
 *   wikidata Q63969880) and its parts way/1331147926 (pedestal, 3 levels,
 *   ±11.6 m), way/1331147923 (floor 4 plan), way/1331147924 (floor 5),
 *   way/1331147925 (floor 6, the outline). © OSM contributors.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 0.5 m grid, in this
 *   frame (above ground_min 108.32 m): plaza 10.0–10.1, west lawn 5.5,
 *   floor 6 roof 31.5 (±32), floor 7 roof 35.6 (±25), floor 8 roof 39.7
 *   (±18), penthouse 41.9–42.2.
 * - Mapterhorn terrain: 1.0–5.4 m over its 108.56 m base under the
 *   footprint (no plaza deck).
 * - USGS NAIP orthophoto (plan; taupe roofs edged by white fascias).
 * - Wikipedia "Geisel Library": William Pereira, 1970, eight storeys.
 * Photos (evidence):
 * - "Geisel West, UCSD.JPG" and "Geisel East, UCSD.JPG", Tktktk, CC BY 3.0,
 *   https://commons.wikimedia.org/wiki/File:Geisel_West,_UCSD.JPG
 *   https://commons.wikimedia.org/wiki/File:Geisel_East,_UCSD.JPG
 *   (corner view: strut bend, slopes, storey bands; scaled against lidar).
 * - "Geisel Library 01.jpg" and "Geisel Library 2.jpg", Codera23,
 *   CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Geisel_Library_01.jpg
 *   (four struts a face, piers, stepped slab edges, colours).
 * - "Geisel Library, UCSD, October 2016.jpg" (1, 2, 3), Jami (Wiki Ed),
 *   CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Geisel_Library,_UCSD,_October_2016.jpg
 * - "Geisel Library, UCSD.jpg", belisario (Flickr), CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:Geisel_Library,_UCSD.jpg
 * - "Geisel Library at UCSD.jpg", sarahmirk, CC BY 4.0 (strut detail).
 * - "Geisel Library, UCSD - Noviembre 2023.jpg", Absuloz, CC0.
 * Look-only: none.
 *
 * Numbers
 * - Plans: floor 6 ±32.3 with three-step corners, floor 5 (and 7) ±25.3,
 *   floor 4 (and 8) ±18.4, pedestal ±11.6 — OSM, squared to 4-fold
 *   symmetry (measured; OSM's own parts differ by < 0.6 m side to side).
 * - Heights above the plaza (lidar, measured): floor 6 roof 21.5, floor 7
 *   roof 25.6, floor 8 roof 29.7, penthouse 32.
 * - Floors 4 and 5 drawn 2.2 and 3.4 m inside OSM's parts 1331147923/4
 *   (which match floors 8 and 7 above), so the struts stand outside their
 *   glass as in every photo (estimated).
 * - Piers 2.6 × 2.3 m standing free, bending 4 m above the plaza; struts
 *   2.4 m deep, 2.3 m wide, reaching the edge of floor 6 (±31.8) at its
 *   underside (16.6), their heads drawn 1.2 m proud of the slab edge and
 *   0.9 m above it (bolder than built, for phone size); behind the piers the lowest storeys are dark glass; floor 4 and 5 slabs at 7.3 and 11.6, glass bands
 *   between — scaled from "Geisel West" against the lidar (estimated).
 * - Strut positions ±3.5 and ±9.5 along each face — counted and spaced
 *   from Codera23's photo (estimated).
 *
 * Doubts
 * - The map's terrain lies about 8.5 m under the real plaza, so the piers
 *   and the dark glass storeys run down to it; the 1993 underground wing
 *   is not modelled.
 * - Mullions are left out; the glass is one band per floor.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { qf } from './dc-white-house'
import { pslab, poffset, saveModel, type XY } from './dc-nga-west'

const ID = 'sd-geisel-library'

const CONCRETE = finish('geisel-concrete', 0xc9c2b6)
const FASCIA = finish('geisel-fascia', 0xe9e4da)
const GLASS = { name: 'window', color: 0x6d8ba0, roughness: 0.3 }
const RECESS = finish('geisel-recess', 0x5f5e5c)
/** The tar roofs read warm taupe in NAIP, not the palette's cool grey. */
const ROOF = finish('geisel-roof', 0xa39a8e)

const concrete = new Part(), fascia = new Part(), glass = new Part(), recess = new Part(), roof = new Part()

const P = 8.5 // the forum plaza above z = 0

/** A 4-fold symmetric outline from its first octant (x ≥ 0, y ≥ x side), CCW. */
function sym(oct: XY[]): XY[] {
  // oct runs from (0, top) clockwise to the diagonal.
  const q: XY[] = [...oct]
  for (let i = oct.length - 1; i >= 0; i--) {
    const [x, y] = oct[i]
    if (Math.abs(x - y) < 1e-6 || x === 0) continue
    q.push([y, x])
  }
  // q: from (0, top) clockwise to (top, 0) region; rotate to fill.
  const quad = q.filter(([x]) => x >= 0)
  const ring: XY[] = []
  for (let k = 0; k < 4; k++) {
    const c = Math.cos((-k * Math.PI) / 2), s = Math.sin((-k * Math.PI) / 2)
    for (const [x, y] of quad) ring.push([x * c - y * s, x * s + y * c])
  }
  // dedupe the axis points and make CCW
  const out: XY[] = []
  for (const p of ring) if (!out.some((o) => Math.hypot(o[0] - p[0], o[1] - p[1]) < 1e-6)) out.push(p)
  return out.reverse()
}
const O6 = sym([[0, 32.3], [12.9, 32.3], [12.9, 25.6], [18.5, 25.6], [18.5, 21.4], [21.4, 21.4]])
const O5 = sym([[0, 25.3], [12.7, 25.3], [12.7, 18.6], [18.6, 18.6]])
const O4 = sym([[0, 18.4], [12.8, 18.4], [12.8, 14.2], [14.2, 14.2]])

// --- The base: no solid podium. Behind the ring of piers the lowest
// storeys are dark glass set deep in shadow, from the map's ground to the
// underside of floor 4; a thin concrete band marks the plaza slab.
pslab(recess, [[-10.0, -10.0], [10.0, -10.0], [10.0, 10.0], [-10.0, 10.0]], 0, P + 7.3, 0, false)
pslab(concrete, [[-10.3, -10.3], [10.3, -10.3], [10.3, 10.3], [-10.3, 10.3]], P - 0.6, P + 0.2, 0.1, false, true)

// --- Sixteen piers bending into raking struts.
/** A closed six-faced solid from its bottom and top quads (same order). */
function hexa(p: Part, b: V3[], t: V3[]) {
  const c: V3 = [0, 0, 0]
  for (const v of [...b, ...t]) for (let k = 0; k < 3; k++) c[k] += v[k] / 8
  const face = (q: V3[]) => {
    const m: V3 = [0, 0, 0]
    for (const v of q) for (let k = 0; k < 3; k++) m[k] += v[k] / 4
    qf(p, q[0], q[1], q[2], q[3], [m[0] - c[0], m[1] - c[1], m[2] - c[2]])
  }
  face(b); face(t)
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; face([b[i], b[j], t[j], t[i]]) }
}
const BEND = P + 4.0, TOP = P + 16.6, REACH = 31.8
for (let k = 0; k < 4; k++) {
  const ang = (k * Math.PI) / 2
  const nx = Math.cos(ang), ny = Math.sin(ang), tx = -ny, ty = nx
  const W = (r: number, t: number, z: number): V3 => [nx * r + tx * t, ny * r + ty * t, z]
  for (const t0 of [-9.5, -3.5, 3.5, 9.5]) {
    const hw = 1.15, r0 = 10.3, r1 = 12.9
    // the pier, a free-standing square column from the ground to the bend
    hexa(concrete, [W(r0, t0 - hw, 0), W(r1, t0 - hw, 0), W(r1, t0 + hw, 0), W(r0, t0 + hw, 0)],
      [W(r0, t0 - hw, BEND + 0.8), W(r1, t0 - hw, BEND + 0.8), W(r1, t0 + hw, BEND + 0.8), W(r0, t0 + hw, BEND + 0.8)])
    // the strut: a deep beam (2.4 m measured plumb) from the bend up and out
    // to the edge of floor 6, its end flush with the slab edge
    const s0 = (r0 + r1) / 2, d = 2.4
    hexa(concrete, [W(s0, t0 - hw, BEND - 1.6), W(s0, t0 - hw, BEND + 0.8), W(s0, t0 + hw, BEND + 0.8), W(s0, t0 + hw, BEND - 1.6)],
      [W(REACH, t0 - hw, TOP - d), W(REACH, t0 - hw, TOP), W(REACH, t0 + hw, TOP), W(REACH, t0 + hw, TOP - d)])
    // its head runs through the slab edge of floor 6 and shows in the
    // white fascia band as a concrete block, which is how the struts still
    // read from above (Tktktk's "Geisel West": the strut ends break the
    // slab edge). Drawn 1.2 m proud of the edge and 0.9 m above the slab,
    // a little bolder than built, so the sixteen ends read at phone size.
    hexa(concrete, [W(REACH - 2.6, t0 - hw, TOP - 0.4), W(REACH - 2.6, t0 - hw, TOP + 2.0), W(REACH - 2.6, t0 + hw, TOP + 2.0), W(REACH - 2.6, t0 + hw, TOP - 0.4)],
      [W(REACH + 1.2, t0 - hw, TOP - 0.4), W(REACH + 1.2, t0 - hw, TOP + 2.0), W(REACH + 1.2, t0 + hw, TOP + 2.0), W(REACH + 1.2, t0 + hw, TOP - 0.4)])
  }
}

// --- The floors: slab, glass band, slab — a diamond in section.
const IN = 1.0
// floor 4 (hung) and floor 5 (hung), floor 6 (on the struts)
// the hung floors sit inside the strut cage: their slab edges stop at the
// struts' inner faces, the glass a metre further in
const H4 = poffset(O4, -2.2), H5 = poffset(O5, -3.4)
pslab(concrete, H4, P + 7.3, P + 8.4, 0.25, concrete, true)
pslab(glass, poffset(H4, -IN), P + 8.4, P + 11.6, 0, false)
pslab(concrete, H5, P + 11.6, P + 12.8, 0.25, concrete, true)
pslab(glass, poffset(H5, -IN), P + 12.8, P + 16.6, 0, false)
pslab(fascia, O6, P + 16.6, P + 17.7, 0.25, false, true)
pslab(glass, poffset(O6, -0.8), P + 17.7, P + 20.6, 0, false)
pslab(fascia, O6, P + 20.6, P + 21.5, 0.3, roof)
// floors 7 and 8 step back in
pslab(glass, poffset(O5, -0.8), P + 21.5, P + 24.7, 0, false)
pslab(fascia, O5, P + 24.7, P + 25.6, 0.3, roof)
pslab(glass, poffset(O4, -0.8), P + 25.6, P + 28.8, 0, false)
pslab(fascia, O4, P + 28.8, P + 29.7, 0.3, roof)
// the penthouse
pslab(concrete, [[-6.5, -6.5], [6.5, -6.5], [6.5, 6.5], [-6.5, 6.5]], P + 29.7, P + 32.0, 0.3, roof)

if (import.meta.main) {
  await saveModel(ID, 'Geisel Library', [
    { part: concrete, material: CONCRETE },
    { part: fascia, material: FASCIA },
    { part: glass, material: GLASS },
    { part: recess, material: RECESS },
    { part: roof, material: ROOF },
  ], { source: `generators/${ID}.ts` })
}
