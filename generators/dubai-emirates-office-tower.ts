/**
 * Emirates Office Tower, Dubai — original procedural geometry, CC0-1.0.
 * bun generators/dubai-emirates-office-tower.ts
 *
 * This file also exports `buildEmiratesTower`, the shared builder for both
 * Jumeirah Emirates Towers; `dubai-emirates-hotel-tower.ts` imports it. Merge
 * this generator first.
 *
 * Frame: map frame, x east, y north, z up, metres, origin at the outline's
 * centroid. The plan below is the hotel's detailed OSM outline (way/393391114,
 * the WEST tower) in its own unrotated frame. The two towers are a 180-degree
 * point-symmetric pair (spire corners facing each other across the gap; every
 * photo below shows the spires on the inner sides), so the office tower uses
 * the same plan placed at BEARING 180 on its own outline. The office's own OSM
 * outline (way/393391115, 4 nodes) is a rough copy with the same 1254 m2 area;
 * the rotated plan lies within ~1.5 m of it.
 *
 * Which tower is which. OSM's names and the assignment put the office on the
 * west outline. The evidence says the office is the EAST one:
 * - Wikidata P625: Emirates Office Tower (Q845182) 55.28333 E; Jumeirah
 *   Emirates Towers Hotel (Q1049027) 55.28194 E.
 * - OSM's building:parts on the west outline (way/1001192974-984) stop at
 *   309 m, the hotel's published tip, not the office's 355 m.
 * - "Emirates Towers (4128598985).jpg" (2009, from Sheikh Zayed Road north-east
 *   of the towers, Burj Khalifa behind them): the east (left, nearer) tower is
 *   the one with the tall crown and spire.
 * - "Emirates Towers Shk Zayed Road.jpg" (2022, from SZR north of the towers):
 *   the west tower (right) has the short crown.
 * So this model is placed on way/393391115, and the hotel on way/393391114.
 *
 * Evidence
 * - OSM way/393391114 (hotel outline, 16 nodes): an equilateral triangle of
 *   ~54 m sides, corners WSW, N and SE. Its parts give the anatomy shared by
 *   both towers: two base legs (976 along the NW face, 975 at the SE corner)
 *   and a 13.5 m glass drum (977) under a portal on the other two faces; the
 *   NW face set back 2.2 m between 11 and 43 m along it, filled by a shallow
 *   curved glass wall (980); a corner notch at the SE (spire) corner cut 17 m
 *   back along both faces (979) with a 5.6 m glass cylinder in it (982); a
 *   skillion crown over the whole triangle, low along the NW face and high at
 *   the SE corner (974, roof:direction 305); spire parts at the SE corner.
 * - Published (Wikipedia "Emirates Office Tower", "Emirates Towers"): 355 m
 *   to the tip (354.6 m), roof 301 m (infobox), top floor 240.4 m; triangular
 *   plan; silver aluminium panels with silver and copper reflective glass; a
 *   curved wall almost the full height of one face. Completed 1999-2000,
 *   architect Hazel Wong (NORR).
 * - Photos (Wikimedia Commons, daylight):
 *   "Emirates Towers in Dubai at dawn.jpg", Jackardsiffant, CC BY 3.0,
 *     https://commons.wikimedia.org/wiki/File:Emirates_Towers_in_Dubai_at_dawn.jpg
 *     (distant and nearly level: used for every height ratio below);
 *   "Emirates Towers - panoramio.jpg" and "Emirates Towers - panoramio (1).jpg",
 *     Aidas U., CC BY 3.0, https://commons.wikimedia.org/wiki/File:Emirates_Towers_-_panoramio.jpg,
 *     https://commons.wikimedia.org/wiki/File:Emirates_Towers_-_panoramio_(1).jpg
 *     (the portal, drum, slots, notch and cylinder, colours);
 *   "Emirates Towers (4128598985).jpg", Leandro Neumann Ciuffo, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Emirates_Towers_(4128598985).jpg (from the NE);
 *   "Emirates Towers (9343061234).jpg", ADTeasdale, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Emirates_Towers_(9343061234).jpg (from a tower, high);
 *   "Emirates Towers Shk Zayed Road.jpg", Ahmed Al Habesh, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Emirates_Towers_Shk_Zayed_Road.jpg (from the N);
 *   "Dub-emtow.jpg", Bgabel, CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Dub-emtow.jpg
 *     (from the W along SZR);
 *   "Emirates towers.jpg", Mujeebpully, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Emirates_towers.jpg (silhouettes at dusk).
 * - No lidar or aerial imagery covers the UAE in the allowed sources; the map
 *   terrain (Mapterhorn) has no tiles here, so the ground could not be checked.
 *   The site is flat; elevation 0.
 *
 * Numbers (office)
 * - Tip 355: published. Crown high corner 300: published roof 301 m, and the
 *   dawn photo (0.83 of the height). Spire step 322: estimated from the dawn
 *   photo. Crown low edge 232, top of the glass 188, portal 50: estimated from
 *   the dawn photo as fractions of 355 (0.653, 0.53, 0.14; the panoramio pair
 *   agrees on the portal within 5 m). The low crown edge sits just under the
 *   published 240 m top floor.
 * - Plan: the hotel's OSM plan (notch, cylinder, drum, legs, curved wall all
 *   from its parts), rotated 180 degrees and scaled 1.18 (sides ~64 m rather
 *   than 54 m). Estimated: in the two photos where the office stands whole
 *   and nearly level (dawn, Mujeebpully dusk) its width is 0.177-0.183 of its
 *   355 m height, i.e. 63-65 m, where a 54 m triangle can show at most 54 m;
 *   the same photos give the hotel 54-57 m, matching its OSM outline. The
 *   published 100,000 m2 over 54 floors (~1,850 m2 a floor) also gives a
 *   ~65 m equilateral triangle. The office's OSM outline (4 nodes, the same
 *   1254 m2 area as the hotel's) looks copied from the hotel, so the model
 *   overhangs it by ~5 m a side.
 * - Glass bands grouped three floors to a panel (12.5 m pitch, 9.5 m of glass);
 *   five slot windows in the crown zone of the two faces beside the spire,
 *   2 m wide, from the photos. All estimated.
 * Bevels (lead review, round 1): 0.6 m chamfers on the three vertical
 * corners and round the crown's sloped top edge, 0.5 m on the portal legs'
 * corners, the notch corners and the shaft's soffit over the portal, 0.4 m on
 * the spire block. The lobby drum is dark glass set 2.5 m behind the legs.
 * Look-only references: none.
 * Doubts: no photo shows the curved NW/SE face squarely; its band pattern is
 * drawn like the flat faces. The brown sunshade fins and the crown louvres are
 * left out (too fine). The podium "Emirates Towers" (way/28743901, the
 * two-storey Boulevard mall around both towers) is not replaced: neither model
 * draws it, and the map's low extrusion of it hides the towers' bottom metres.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, windowVariant, type Swatch } from './palette'

type V2 = [number, number]

export type TwinSpec = {
  id: string
  name: string
  anchor: { lng: number; lat: number }
  bearing: number
  replaces: string[]
  /** Top of the base portal over the glass drum. */
  portal: number
  /** Top of the banded glass; the notch and slot windows start here. */
  glassTop: number
  /** Low edge of the sloped crown (along the NW face of the plan). */
  crownLow: number
  /** High corner of the crown, at the spire corner. */
  crownHigh: number
  /** Where the spire narrows. */
  spireStep: number
  tip: number
  /** Floor-group pitch of the glass bands. */
  pitch: number
  /** Plan size relative to the hotel's OSM outline (54 m sides). */
  planScale: number
}

// --- Plan (hotel OSM outline, metres from its centroid) ---
const A: V2 = [-27.7, -14.3] // WSW corner
const B: V2 = [1.4, 30.9] // N corner
const C: V2 = [26.3, -16.7] // SE corner: the spire and notch corner

const add = (p: V2, q: V2): V2 => [p[0] + q[0], p[1] + q[1]]
const sc = (p: V2, s: number): V2 => [p[0] * s, p[1] * s]
const dif = (p: V2, q: V2): V2 => [p[0] - q[0], p[1] - q[1]]
const norm2 = (p: V2): V2 => { const l = Math.hypot(p[0], p[1]); return [p[0] / l, p[1] / l] }
const dist2 = (p: V2, q: V2) => Math.hypot(p[0] - q[0], p[1] - q[1])
/** A point d metres from p towards q. */
const along = (p: V2, q: V2, d: number): V2 => add(p, sc(norm2(dif(q, p)), d))
/** Plan scale of the tower being built: 1 for the hotel's OSM plan. */
let PLAN_S = 1
const at = (p: V2, z: number): V3 => [p[0] * PLAN_S, p[1] * PLAN_S, z]

const uAB = norm2(dif(B, A))
const nAB: V2 = [-uAB[1], uAB[0]] // outward normal of the NW face (away from C)
// Check the outward side: C must lie on the negative side.
if ((C[0] - A[0]) * nAB[0] + (C[1] - A[1]) * nAB[1] > 0) { nAB[0] *= -1; nAB[1] *= -1 }
const ALT = Math.abs((C[0] - A[0]) * nAB[0] + (C[1] - A[1]) * nAB[1]) // C's distance from AB

const CH = 0.6 // corner chamfer, the bevel on the three vertical corners
const INSET = 2.2, CURVE0 = 11, CURVE1 = 43 // curved glass wall on the NW face (OSM 978/980)
const NOTCH = 17 // the corner notch, back along both faces from C (OSM 979)
const CYL: V2 = [16.6, -10.6], CYL_R = 5.6 // the copper glass cylinder in the notch (OSM 982)
const DRUM: V2 = [3.1, -2.0], DRUM_R = 13.5 // the lobby drum (OSM 977)

/** Corners with the chamfer: each corner becomes two points. */
function chamfered(corners: V2[], cut = CH): V2[] {
  const out: V2[] = []
  corners.forEach((p, i) => {
    const prev = corners[(i + corners.length - 1) % corners.length], next = corners[(i + 1) % corners.length]
    out.push(along(p, prev, cut), along(p, next, cut))
  })
  return out
}

/** The NW face's curved glass between A and B: inset returns and a shallow arc out to the face line. */
function curveRun(n = 8): V2[] {
  const q0 = along(A, B, CURVE0), q1 = along(A, B, CURVE1)
  const pts: V2[] = []
  // walking from B back to A (the polygon runs A -> C -> B -> ... -> A)
  pts.push(q1, add(q1, sc(nAB, -INSET)))
  for (let i = 1; i < n; i++) {
    const t = 1 - i / n
    const p = add(q0, sc(uAB, (CURVE1 - CURVE0) * t))
    const bulge = INSET * Math.sin(Math.PI * t) // 0 at the ends, INSET in the middle
    pts.push(add(p, sc(nAB, -INSET + bulge)))
  }
  pts.push(add(q0, sc(nAB, -INSET)), q0)
  return pts
}

/** Ear-clipping triangulation of a simple CCW polygon. */
function triangulate(poly: V2[]): [number, number, number][] {
  const idx = poly.map((_, i) => i), tris: [number, number, number][] = []
  const crossz = (a: V2, b: V2, c: V2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (p: V2, a: V2, b: V2, c: V2) => crossz(a, b, p) >= -1e-9 && crossz(b, c, p) >= -1e-9 && crossz(c, a, p) >= -1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 5000) {
    let clipped = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (crossz(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inTri(poly[j], a, b, c))) continue
      tris.push([i0, i1, i2]); idx.splice(k, 1); clipped = true; break
    }
    if (!clipped) break
  }
  if (idx.length === 3) tris.push([idx[0], idx[1], idx[2]])
  // A polygon that won't clip (self-intersecting, or wound clockwise) would leave a roof out.
  if (tris.length !== poly.length - 2) throw new Error(`triangulate: ${tris.length} of ${poly.length - 2} triangles`)
  return tris
}

/** Vertical walls around a CCW plan polygon, with optional caps. */
function prism(p: Part, poly: V2[], z0: number, z1: number, top = true, bottom = false, topZ?: (q: V2) => number) {
  const n = poly.length
  for (let i = 0; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n]
    const za = topZ ? topZ(a) : z1, zb = topZ ? topZ(b) : z1
    if (za - z0 < 1e-3 && zb - z0 < 1e-3) continue
    if (za - z0 < 1e-3) p.tri(at(a, z0), at(b, z0), at(b, zb))
    else if (zb - z0 < 1e-3) p.tri(at(a, z0), at(b, z0), at(a, za))
    else p.quad(at(a, z0), at(b, z0), at(b, zb), at(a, za))
  }
  const tris = triangulate(poly)
  for (const [i, j, k] of tris) {
    if (top) {
      const z = (q: V2) => (topZ ? topZ(q) : z1)
      p.tri(at(poly[i], z(poly[i])), at(poly[j], z(poly[j])), at(poly[k], z(poly[k])))
    }
    if (bottom) p.tri(at(poly[i], z0), at(poly[k], z0), at(poly[j], z0))
  }
}


/** Chamfer only the listed corners of a polygon. */
function chamferSome(poly: V2[], which: number[], cut: number): V2[] {
  const out: V2[] = []
  poly.forEach((p, i) => {
    if (!which.includes(i)) { out.push(p); return }
    const prev = poly[(i + poly.length - 1) % poly.length], next = poly[(i + 1) % poly.length]
    out.push(along(p, prev, cut), along(p, next, cut))
  })
  return out
}

/** A CCW polygon moved inwards by d (mitred). */
function inset(poly: V2[], d: number): V2[] {
  const n = poly.length
  return poly.map((v, i) => {
    const a = poly[(i + n - 1) % n], b = poly[(i + 1) % n]
    const u1 = norm2(dif(v, a)), u2 = norm2(dif(b, v))
    const n1: V2 = [-u1[1], u1[0]], n2: V2 = [-u2[1], u2[0]]
    const k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    return add(v, sc(add(n1, n2), d / k))
  })
}

/**
 * Vertical walls from z0 to a (possibly sloped) top, with a bevel of `bev`
 * round the top edge: the walls stop bev under the top and a chamfer runs in
 * to the top face, which is inset by bev.
 */
function bevelPrism(p: Part, poly: V2[], z0: number, topZ: (q: V2) => number, bev: number, bottom = false) {
  const inner = inset(poly, bev), n = poly.length
  const wz = (q: V2) => Math.max(z0, topZ(q) - bev)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, a = poly[i], b = poly[j], ai = inner[i], bi = inner[j]
    const za = wz(a), zb = wz(b)
    if (za - z0 > 1e-3 || zb - z0 > 1e-3) {
      if (za - z0 < 1e-3) p.tri(at(a, z0), at(b, z0), at(b, zb))
      else if (zb - z0 < 1e-3) p.tri(at(a, z0), at(b, z0), at(a, za))
      else p.quad(at(a, z0), at(b, z0), at(b, zb), at(a, za))
    }
    p.quad(at(a, za), at(b, zb), at(bi, topZ(bi)), at(ai, topZ(ai)))
  }
  // The inset can fold over a chamfer as short as the bevel, so triangulate
  // the outer plan; the inner ring has the same corners in the same order.
  for (const [i, j, k] of triangulate(poly)) {
    p.tri(at(inner[i], topZ(inner[i])), at(inner[j], topZ(inner[j])), at(inner[k], topZ(inner[k])))
    if (bottom) p.tri(at(poly[i], z0), at(poly[k], z0), at(poly[j], z0))
  }
}

function cylinder(p: Part, c: V2, r: number, z0: number, z1: number, n = 16, top = false) {
  const ring = (z: number) => Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    return at([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)], z)
  })
  const r0 = ring(z0), r1 = ring(z1)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const ni: V3 = [Math.cos((i / n) * Math.PI * 2), Math.sin((i / n) * Math.PI * 2), 0]
    const nj: V3 = [Math.cos((j / n) * Math.PI * 2), Math.sin((j / n) * Math.PI * 2), 0]
    p.tri(r0[i], r0[j], r1[j], undefined, undefined, undefined, [ni, nj, nj])
    p.tri(r0[i], r1[j], r1[i], undefined, undefined, undefined, [ni, nj, ni])
  }
  if (top) p.cap(r1, true)
}

/** A flat panel on the face from p to q (CCW order, outward to the right), between s0..s1 along it and z0..z1. */
function facePanel(part: Part, p: V2, q: V2, s0: number, s1: number, z0: number, z1: number, out = 0.05) {
  const u = norm2(dif(q, p)), n: V2 = [u[1], -u[0]]
  const a = add(add(p, sc(u, s0)), sc(n, out)), b = add(add(p, sc(u, s1)), sc(n, out))
  part.quad(at(a, z0), at(b, z0), at(b, z1), at(a, z1))
}

export function buildEmiratesTower(spec: TwinSpec): { glb: Uint8Array; triangles: number } {
  const alu = new Part(), glass = new Part(), drum = new Part(), copper = new Part()
  const { portal, glassTop, crownLow, crownHigh, spireStep, tip, pitch } = spec
  PLAN_S = spec.planScale
  const crownZ = (q: V2) => {
    const d = Math.abs((q[0] - A[0]) * nAB[0] + (q[1] - A[1]) * nAB[1])
    return crownLow + ((crownHigh - crownLow) * d) / ALT
  }

  // --- Base: the two legs and the glass drum under the portal. ---
  const lAC = along(A, C, 11.6), lBC = along(B, C, 11) // the NW leg's inner corners (OSM 976)
  prism(alu, chamferSome(legAB(), [2, 3], 0.5), 0, portal, false)
  function legAB(): V2[] {
    // A chamfered at the corner A and B only; the inner edge stays sharp.
    return [along(A, B, CH), along(A, C, CH), lAC, lBC, along(B, C, CH), along(B, A, CH)]
  }
  const kAC = along(C, A, 11), kBC = along(C, B, 11) // the corner leg at C (OSM 975)
  prism(alu, chamferSome([kAC, along(C, A, CH), along(C, B, CH), kBC], [0, 3], 0.5), 0, portal, false)
  cylinder(drum, DRUM, DRUM_R - 2.5, 0, portal) // set ~2.5 m back behind the leg faces

  // --- Shaft: full triangle with the curved NW face, from the portal to the glass top. ---
  const shaftPlan = (notch: boolean): V2[] => {
    const pts: V2[] = [along(A, B, CH), along(A, C, CH)]
    if (notch) pts.push(along(C, A, NOTCH), along(C, B, NOTCH))
    else pts.push(along(C, A, CH), along(C, B, CH))
    pts.push(along(B, C, CH), along(B, A, CH), ...curveRun())
    return pts
  }
  {
    // the shaft over the portal, its soffit edge bevelled 0.5 m
    const P = shaftPlan(false), Q = inset(P, 0.5), b = 0.5
    prism(alu, P, portal + b, glassTop, false, false)
    for (let i = 0; i < P.length; i++) {
      const j = (i + 1) % P.length
      alu.quad(at(Q[i], portal), at(P[i], portal + b), at(P[j], portal + b), at(Q[j], portal))
    }
    for (const [i, j, k] of triangulate(Q)) alu.tri(at(Q[i], portal), at(Q[k], portal), at(Q[j], portal))
  }
  // the notch's floor
  alu.cap([at(along(C, A, NOTCH), glassTop), at(along(C, A, CH), glassTop), at(along(C, B, CH), glassTop), at(along(C, B, NOTCH), glassTop)], true)
  // the notch zone: body cut back at C, copper cylinder standing in the cut
  prism(alu, chamferSome(shaftPlan(true), [2, 3], 0.5), glassTop, crownLow, false, false)
  cylinder(copper, CYL, CYL_R, glassTop, crownLow)

  // --- Crown: one sloped plane, low along the NW face, high at C; soffit over the notch. ---
  const crownPlan = chamfered([A, C, B])
  bevelPrism(alu, crownPlan, crownLow, crownZ, 0.6, true)

  // --- Spire: the corner at C carried up as a blade, then a slimmer top. ---
  {
    const s0 = 5.5, z0 = crownZ(along(C, A, s0)) - 0.5
    bevelPrism(alu, chamferSome([along(C, A, s0), along(C, A, CH), along(C, B, CH), along(C, B, s0)], [0, 3], 0.4), z0, () => spireStep, 0.4)
    const s1 = 4.4
    const lo = [along(C, A, s1), along(C, A, CH * 0.6), along(C, B, CH * 0.6), along(C, B, s1)]
    const hiC = along(C, add(sc(A, 0.5), sc(B, 0.5)), 0.4)
    const hi = [along(hiC, A, 2.2), hiC, hiC, along(hiC, B, 2.2)]
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      if (i === 1) { alu.tri(at(lo[1], spireStep), at(lo[2], spireStep), at(hi[1], tip)); continue }
      alu.quad(at(lo[i], spireStep), at(lo[j], spireStep), at(hi[j], tip), at(hi[i], tip))
    }
    alu.tri(at(hi[0], tip), at(hi[1], tip), at(hi[3], tip))
  }

  // --- Glass bands on the two faces beside the spire, three floors to a panel. ---
  const bands: [number, number][] = []
  for (let z = portal + 2.5; z + pitch * 0.5 < glassTop - 1; z += pitch) bands.push([z, Math.min(z + pitch - 3, glassTop - 1.5)])
  for (const [z0, z1] of bands) {
    // face A -> C: aluminium strip at A over the leg, glass to the corner at C
    facePanel(glass, A, C, 11.6, dist2(A, C) - 2.0, z0, z1)
    // face C -> B: glass from the corner at C to the strip at B
    facePanel(glass, C, B, 2.0, dist2(C, B) - 11, z0, z1)
  }
  // The curved wall on the NW face: glass bands following the arc, aluminium between.
  {
    const run = curveRun().slice(1, -1) // the arc between its inset ends, B side first
    for (let z0 = portal + 2.5; z0 < crownLow - 4; z0 += pitch) {
      const z1 = Math.min(z0 + pitch - 3, crownLow - 2)
      for (let i = 0; i < run.length - 1; i++) {
        const p = run[i], q = run[i + 1]
        const u = norm2(dif(q, p)), n: V2 = [u[1], -u[0]]
        const a = add(p, sc(n, 0.05)), b = add(q, sc(n, 0.05))
        glass.quad(at(a, z0), at(b, z0), at(b, z1), at(a, z1))
      }
    }
  }

  // --- Five slot windows in the crown zone of both faces beside the spire. ---
  for (let k = 0; k < 5; k++) {
    const s = 9.5 + k * 4.4
    facePanel(glass, A, C, s, s + 2.4, glassTop + 2, crownLow - 2.5)
    facePanel(glass, C, B, dist2(C, B) - s - 2.4, dist2(C, B) - s, glassTop + 2, crownLow - 2.5)
  }

  const mats: Swatch[] = [
    finish('silver-aluminium', 0xd6dbdf, 0.45),
    { name: 'window', color: 0xa3b8c8, roughness: 0.3 },
    windowVariant(2, 0x4f606b),
    finish('copper-glass', 0xa98b6e, 0.4),
  ]
  const parts = [alu, glass, drum, copper].map((part, i) => ({ part, material: mats[i] }))
  const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(spec.name, parts, {
    license: 'CC0-1.0', bearing: spec.bearing, elevation: 0, anchor: [spec.anchor.lat, spec.anchor.lng], height: tip,
    frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    replaces: spec.replaces,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  return { glb, triangles }
}

export async function writeTower(spec: TwinSpec) {
  const { glb, triangles } = buildEmiratesTower(spec)
  const out = new URL(`../models/${spec.id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}

if (import.meta.main) {
  await writeTower({
    id: 'dubai-emirates-office-tower',
    name: 'Emirates Office Tower',
    anchor: { lng: 55.2836335, lat: 25.2176177 },
    bearing: 180,
    replaces: ['way/393391115'],
    portal: 50,
    glassTop: 188,
    crownLow: 232,
    crownHigh: 300,
    spireStep: 322,
    tip: 355,
    pitch: 12.5,
    planScale: 1.18,
  })
}
