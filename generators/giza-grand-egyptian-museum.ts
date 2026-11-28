/**
 * Grand Egyptian Museum (Heneghan Peng, competition 2003, opened 2025),
 * on the edge of the Giza plateau: original procedural geometry, CC0-1.0,
 * no textures.
 *   bun generators/giza-grand-egyptian-museum.ts
 * Writes models/giza-grand-egyptian-museum.glb (low) and
 * models/giza-grand-egyptian-museum.detail.glb (detail: finer joints, a
 * second set of small bronze triangles, more portal mullions).
 *
 * Map frame: x east, y north, z up, metres. Anchor = the lead's point
 * (lng 31.11907, lat 29.99458), inside the OSM outline. Bearing 338.5: the
 * long straight west wall of the OSM outline (way/652382736, aligned on
 * the pyramid of Menkaure) runs along model y.
 *
 * Identity, in order: the vast pale facade facing the plaza (model east;
 * the wall aligned on Khufu): one folded plane of alabaster triangles,
 * bold bronze triangles set in it, its top a long ramp rising from the
 * north end to its full height at the entrance end (south); the great
 * dark-glazed pyramid of the portal cut into it; the dark wedge of roof
 * cantilevered over the plaza at the entrance end, over the atrium's
 * glazing; the roof as one plane following the ramp back to the plateau;
 * the Hanging Obelisk on its dark gate pavilion in the plaza.
 *
 * Evidence
 *  - Plan: OSM relation/16783121 (building=museum, height 46): outer
 *    way/652382736, inner way/1228577530 (the slot by the north-west
 *    wing); the main gate way/1228653668 (the portal, at y -72 to -42);
 *    the small canopy way/1228653673 (building=roof) on the north wall;
 *    the Hanging Obelisk is an OSM node (historic=memorial, man_made=
 *    obelisk) at (202, -81) here, 120 m out in the plaza. The plaza facade
 *    is one straight OSM line, 244 m from (41.7, 70.3) to (111.7, -163.2);
 *    the outline's 11 m bump at y 3-26 is dropped behind it.
 *  - Which end is which: in g2, g3, w00 and w13 the obelisk stands right
 *    of the portal and the tall end with the dark canopy and the glazing
 *    is at the left: the cameras stand south-east in the plaza looking
 *    north-west, so the entrance end is the south end (the atrium looks
 *    toward the pyramids, Wikipedia).
 *  - Heights: OSM 46 m. The facade ramps from 18 m at its north end to
 *    46 m at the south end (ESTIMATED from w12, w13, g2: about two and a
 *    half times as tall at the entrance end as at the far end). The roof
 *    is one plane on that ramp, rising 0.03 per metre back to the west
 *    (to 50 m at most) so it meets the plateau, which the terrain (z12,
 *    older than the building) shows 20-25 m up at the south-west.
 *  - Facade: triangles 13 m a side in four rows sheared to the ramp; each
 *    up-cell a shallow three-faceted pyramid 1.1 m proud with raised pale
 *    joints, two in three carrying a bronze triangle 8 m across standing
 *    proud (g1, g4, g11, w13); a regular stand-in for the real
 *    Sierpinski layout. Portal: 54 m along the facade, 19 m out, its apex
 *    just under the facade's top (w13: about 90 % of the facade there),
 *    both faces dark glazing with a pale frame and dark mullions.
 *  - Obelisk: Ramesses II's obelisk, 16 m (published), raised on four
 *    supports over a dark pavilion 22 m square and 6 m high (estimated
 *    from g2, w00).
 *  - Photos (Wikimedia Commons):
 *    g1 Ibrahim.ID, "Grand Egyptian Museum - EGWUG Trip (2).jpg", public domain (the portal)
 *      https://commons.wikimedia.org/wiki/File:Grand_Egyptian_Museum_-_EGWUG_Trip_(2).jpg
 *    g2 Amr F.Nagy, "Grand Egyptian Museum 2025 (57645).jpg", public domain (facade from the plaza)
 *      https://commons.wikimedia.org/wiki/File:Grand_Egyptian_Museum_2025_(57645).jpg
 *    g3 Amr F.Nagy, "Grand Egyptian Museum 2025 (77418).jpg", public domain
 *      https://commons.wikimedia.org/wiki/File:Grand_Egyptian_Museum_2025_(77418).jpg
 *    g4 Slyronit, "Grand Egyptian Museum Facade 3.jpg", CC BY-SA 4.0 (facade close)
 *      https://commons.wikimedia.org/wiki/File:Grand_Egyptian_Museum_Facade_3.jpg
 *    g8 Djehouty, "Grand Egyptian Museum 2019-11-05a.jpg", CC BY-SA 4.0 (roof planes from the plateau)
 *      https://commons.wikimedia.org/wiki/File:Grand_Egyptian_Museum_2019-11-05a.jpg
 *    g11 Djehouty, "Grand Egyptian Museum 2019-11-07b.jpg", CC BY-SA 4.0 (facade panels, bronze triangles)
 *      https://commons.wikimedia.org/wiki/File:Grand_Egyptian_Museum_2019-11-07b.jpg
 *    g13 Mohamed abdelzaher, "Grand Egyptian Museum.jpg", CC BY-SA 4.0 (night: atrium glazing, lit facade)
 *      https://commons.wikimedia.org/wiki/File:Grand_Egyptian_Museum.jpg
 *    g14 Djehouty, "Grand Egyptian Museum 2019-11-07j.jpg", CC BY-SA 4.0 (the facade's length)
 *      https://commons.wikimedia.org/wiki/File:Grand_Egyptian_Museum_2019-11-07j.jpg
 *    g15 Richard Mortel, "Main Galleries plan in grand egyptian museum.jpg", CC BY 2.0 (gallery bands)
 *      https://commons.wikimedia.org/wiki/File:Main_Galleries_plan_in_grand_egyptian_museum.jpg
 *    w00, w12, w13 ولاء, "Grand Egyptian Museum (GEM) 2025 00/12/13.jpg", public domain (the plaza front, 2025)
 *      https://commons.wikimedia.org/wiki/File:Grand_Egyptian_Museum_(GEM)_2025_00.jpg
 *      https://commons.wikimedia.org/wiki/File:Grand_Egyptian_Museum_(GEM)_2025_12.jpg
 *      https://commons.wikimedia.org/wiki/File:Grand_Egyptian_Museum_(GEM)_2025_13.jpg
 *  - Colours: facade stone pale cream (g2, g3 sunlit #d9d0c2), drawn
 *    #e8e0cf; bronze triangles drawn #8f8070, bronze-grey (g1, g4, w13);
 *    canopy and pavilion dark grey #4f545c; obelisk granite #c7a690.
 *  No look-only sources. No commercial imagery. No lidar exists here.
 *
 * Invented or simplified: no aerial photo was found, so the roof is
 * drawn as one plane, not surveyed; the walls round the stepped south and
 * west ends are plain; the triangle pattern is regular; the grand
 * staircase, terraces and the plaza's landscaping are not drawn. Doubts:
 * the ramp's exact heights; the north-west wing's height (20 m) and use.
 */
import clipping from 'polygon-clipping'
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY } from './chi-aon-center'
import { face } from './phl-independence-hall'
import { beam, polyTris } from './berlin-oberbaum-bridge'
import { box, cyl, writeModel, type Slot } from './pretoria-union-buildings'

const ID = 'giza-grand-egyptian-museum'
const NAME = 'Grand Egyptian Museum'
const ANCHOR: [number, number] = [31.11907, 29.99458]
const BEARING = 338.5

// OSM way/652382736 in this frame, counter-clockwise.
const OUTLINE: XY[] = [[126.9,-193.0],[132.7,-168.1],[124.5,-166.2],[111.7,-163.2],[104.3,-136.6],[95.6,-106.4],[86.6,-76.3],[85.2,-71.4],[81.9,-60.7],[80.7,-56.9],[79.2,-51.9],[76.1,-41.7],[68.1,-16.2],[62.2,3.2],[66.9,22.9],[55.3,25.7],[41.7,70.3],[0.8,86.5],[-10.4,90.9],[-15.4,92.9],[-20.0,94.7],[-25.1,96.7],[-33.4,100.0],[-77.0,117.1],[-76.7,151.9],[-70.6,166.6],[-76.6,172.2],[-76.0,247.3],[-71.8,257.7],[-75.9,261.5],[-75.5,312.9],[-72.8,319.1],[-75.5,321.7],[-75.4,327.1],[-94.2,324.5],[-96.7,183.0],[-99.5,183.1],[-102.2,67.3],[-77.4,58.0],[-77.3,62.9],[-71.9,61.9],[-71.7,-25.5],[-71.5,-203.6],[-71.4,-270.3],[-45.1,-281.9],[-44.7,-255.9],[-11.4,-268.2],[-11.4,-256.8],[21.4,-269.7],[19.7,-256.7],[63.4,-273.8],[59.4,-246.7],[96.8,-262.0],[97.9,-273.3],[143.3,-286.9],[123.6,-207.3]]
const SLOT: XY[] = [[-77.0,115.3],[-77.3,68.1],[-71.9,67.1],[-72.2,113.7]]
const CANOPY: XY[] = [[-33.4,100.0],[-25.1,96.7],[-20.0,94.7],[-15.4,92.9],[-10.4,90.9],[0.8,86.5],[-4.9,95.1],[-10.5,103.5],[-14.0,108.8],[-19.2,106.4],[-26.9,102.9]]

/** The plaza facade: one straight line in OSM from its north end to its south end. */
const F0: XY = [41.7, 70.3], F1: XY = [111.7, -163.2]
const FL = Math.hypot(F1[0] - F0[0], F1[1] - F0[1])
const FU: XY = [(F1[0] - F0[0]) / FL, (F1[1] - F0[1]) / FL], FN: XY = [-FU[1], FU[0]] // FN points out to the plaza
/** Along the facade from its north end, and how far behind it (west). */
const along = (x: number, y: number) => (x - F0[0]) * FU[0] + (y - F0[1]) * FU[1]
const behind = (x: number, y: number) => -((x - F0[0]) * FN[0] + (y - F0[1]) * FN[1])
/** The facade's top: a long ramp from 18 m at its north end up to 46 m at the entrance end (south). */
const ZN = 18, ZS = 46
const fTop = (a: number) => ZN + ((ZS - ZN) * Math.max(0, Math.min(FL, a))) / FL
/** The roof: one plane on the facade's ramp, rising back toward the plateau (west) so it meets it. */
const roofZ = (x: number, y: number) => Math.min(50, Math.max(ZN, fTop(along(x, y)) + 0.03 * Math.max(0, behind(x, y))))
const WING_Y = 117, WING_Z = 20
/** The Hanging Obelisk (OSM node, historic=memorial) and its gate pavilion. */
const OBELISK: XY = [202, -81]

function build(detail: boolean): Slot[] {
  const stone = new Part(), bronze = new Part(), roof = new Part(), win = new Part(), dark = new Part(), granite = new Part()
  const close = (r: XY[]) => [...r, r[0]]

  // --- massing: the main body (less the slot, the wing and the bump past the facade line) and the wing
  const cutFront: XY[] = [F0, [F0[0] + FN[0] * 60, F0[1] + FN[1] * 60], [F1[0] + FN[0] * 60, F1[1] + FN[1] * 60], F1].map(([x, y]) => [x + FU[0] * 0, y] as XY)
  const wingBox: XY[] = [[-200, WING_Y], [-60, WING_Y], [-60, 400], [-200, 400]]
  let main = clipping.difference([close(OUTLINE)], [close(SLOT)], [close(wingBox)])
  main = clipping.difference(main as any, [close(cutFront)])
  const wing = clipping.intersection([close(OUTLINE)], [close(wingBox)])
  const onFacade = (a: XY, b: XY) => Math.abs(behind(...a)) < 0.3 && Math.abs(behind(...b)) < 0.3 && along(...a) > -1 && along(...b) < FL + 1 && along(...b) > -1
  for (const poly of main) {
    const outer = poly[0].slice(0, -1) as XY[], holes = poly.slice(1).map((h) => h.slice(0, -1) as XY[])
    for (const [a, b, c] of polyTris(outer, holes)) face(roof, [[...a, roofZ(...a)], [...b, roofZ(...b)], [...c, roofZ(...c)]] as V3[], [0, 0, 1])
    for (const ring of [outer, ...holes]) for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.05) continue
      if (onFacade(a, b)) continue
      const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
      const isHole = ring !== outer
      const nn: V3 = isHole ? [-n[0], -n[1], 0] : [n[0], n[1], 0]
      const za = roofZ(...a), zb = roofZ(...b)
      // the atrium's triangulated glazing fills the walls round the facade's south (entrance) end (g2, g13)
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
      const north = !isHole && along(mx, my) > FL - 3 && Math.hypot(mx - F1[0], my - F1[1]) < 32 && n[0] * FN[0] + n[1] * FN[1] > -0.2
      face(north ? win : stone, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], zb], [a[0], a[1], za]], nn)
      face(stone, [[a[0], a[1], za], [b[0], b[1], zb], [b[0], b[1], zb + 1.2], [a[0], a[1], za + 1.2]], nn)
      face(stone, [[a[0], a[1], za + 1.2], [b[0], b[1], zb + 1.2], [b[0] - nn[0] * 0.8, b[1] - nn[1] * 0.8, zb + 1.2], [a[0] - nn[0] * 0.8, a[1] - nn[1] * 0.8, za + 1.2]], [0, 0, 1])
      face(stone, [[b[0] - nn[0] * 0.8, b[1] - nn[1] * 0.8, zb], [a[0] - nn[0] * 0.8, a[1] - nn[1] * 0.8, za], [a[0] - nn[0] * 0.8, a[1] - nn[1] * 0.8, za + 1.2], [b[0] - nn[0] * 0.8, b[1] - nn[1] * 0.8, zb + 1.2]], [-nn[0], -nn[1], 0])
      if (north) {
        // a bold triangulated glazing grid
        const step = detail ? 7 : 12
        for (let s = step / 2; s < L; s += step) {
          const P = (q: number, z: number): V3 => [a[0] + ((b[0] - a[0]) * q) / L + nn[0] * 0.2, a[1] + ((b[1] - a[1]) * q) / L + nn[1] * 0.2, z]
          const zt = za + ((zb - za) * s) / L
          beam(stone, P(s, 0), P(Math.min(L, s + zt * 0.55), Math.min(zt, (L - s) / 0.55)), 0.5, nn, false, 0.4)
          beam(stone, P(s, 0), P(Math.max(0, s - zt * 0.55), Math.min(zt, s / 0.55)), 0.5, nn, false, 0.4)
        }
      }
    }
  }
  for (const poly of wing) {
    const r = poly[0].slice(0, -1) as XY[]
    for (const [a, b, c] of polyTris(r)) face(roof, [[...a, WING_Z], [...b, WING_Z], [...c, WING_Z]] as V3[], [0, 0, 1])
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.05) continue
      const n: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
      const lo = a[1] <= WING_Y + 0.01 && b[1] <= WING_Y + 0.01 ? Math.min(roofZ(...a), WING_Z) : 0
      face(stone, [[a[0], a[1], lo], [b[0], b[1], lo], [b[0], b[1], WING_Z], [a[0], a[1], WING_Z]], n)
    }
  }

  // --- the facade: one folded plane of alabaster triangles along the plaza, ramping down to the south
  {
    const T = 13, ROWS = 4
    const H = (T * Math.sqrt(3)) / 2
    const P = (s: number, h: number, o: number): V3 => {
      // h is 0..ROWS rows, sheared up to the ramp so the top follows it exactly
      const z = h <= 0 && o < 0 ? 0 : 3.2 + (h / ROWS) * (fTop(s) - 3.2)
      return [F0[0] + FU[0] * s + FN[0] * o, F0[1] + FU[1] * s + FN[1] * o, z]
    }
    const off = (r: number) => (r % 2 ? T / 2 : 0)
    const sv = (r: number, m: number) => Math.max(0, Math.min(FL, off(r) + m * T))
    const fold = (r: number, m: number) => ((((r + m) % 2) + 2) % 2 === 0 ? 1.4 : 0.1)
    const V = (r: number, m: number) => P(sv(r, m), r, fold(r, m))
    /** Row r's top vertex index over bottom index k's right half. */
    const up = (r: number, k: number) => (r % 2 ? k + 1 : k)
    const portal = (s: number) => s > 106 && s < 168
    const nOut: V3 = [FN[0], FN[1], 0]
    const bronzeTri = (a: V3, b: V3, c: V3, k = 0.62) => {
      const cx = (a[0] + b[0] + c[0]) / 3, cy = (a[1] + b[1] + c[1]) / 3, cz = (a[2] + b[2] + c[2]) / 3
      const sh = (p: V3, o: number): V3 => [cx + (p[0] - cx) * k + FN[0] * o, cy + (p[1] - cy) * k + FN[1] * o, cz + (p[2] - cz) * k]
      const o = 1.25
      face(bronze, [sh(a, o), sh(b, o), sh(c, o)], nOut)
      for (const [p, q] of [[a, b], [b, c], [c, a]] as [V3, V3][]) face(bronze, [sh(p, 0.2), sh(q, 0.2), sh(q, o), sh(p, o)], [(p[0] + q[0]) / 2 - cx, (p[1] + q[1]) / 2 - cy, (p[2] + q[2]) / 2 - cz])
    }
    const mMax = Math.ceil(FL / T) + 1
    for (let r = 0; r < ROWS; r++) for (let k = -1; k <= mMax; k++) {
      const s0 = sv(r, k), s1 = sv(r, k + 1)
      // up cell
      const a = V(r, k), b = V(r, k + 1), c = V(r + 1, up(r, k))
      const sm = (s0 + s1) / 2
      const inPortal = portal(sm) && (r + 1) / ROWS * fTop(sm) < 30
      if (s1 - s0 > 0.3 && !inPortal) {
        // a shallow three-faceted pyramid: the folded skin (g1, g4)
        const cx = (a[0] + b[0] + c[0]) / 3 + FN[0] * 1.1, cy = (a[1] + b[1] + c[1]) / 3 + FN[1] * 1.1, cz = (a[2] + b[2] + c[2]) / 3
        const C: V3 = [cx, cy, cz]
        for (const [p, q] of [[a, b], [b, c], [c, a]] as [V3, V3][]) face(stone, [p, q, C], [FN[0] * 2 + (p[0] + q[0]) / 2 - cx, FN[1] * 2 + (p[1] + q[1]) / 2 - cy, (p[2] + q[2]) / 2 - cz])
        // the pale joints of the triangulation, standing proud along the cell's edges (g1, g11, w13)
        for (const [p, q] of [[a, b], [b, c], [c, a]] as [V3, V3][]) if (p[2] > 0.1 || q[2] > 0.1) beam(stone, [p[0] + FN[0] * 0.5, p[1] + FN[1] * 0.5, p[2]], [q[0] + FN[0] * 0.5, q[1] + FN[1] * 0.5, q[2]], detail ? 0.45 : 0.6, nOut, false, 0.5)
        if ((((k + 2 * r) % 3) + 3) % 3 !== 2) bronzeTri(a, b, c)
      }
      // down cell, between this up cell and the next
      const d0 = sv(r + 1, up(r, k)), d1 = sv(r + 1, up(r, k) + 1)
      const e = V(r + 1, up(r, k) + 1)
      const sd = (d0 + d1 + s1) / 3
      const inPortalD = portal(sd) && (r + 1) / ROWS * fTop(sd) < 30
      if (d1 - d0 > 0.3 && !inPortalD) {
        face(stone, [c, b, e], nOut)
        if (detail && (((k + r) % 3) + 3) % 3 === 0) bronzeTri(c, b, e, 0.32)
      }
    }
    // a plain backing wall on the facade line, seen round the portal
    for (let q = 0; q < FL; q += 20) {
      const e = Math.min(FL, q + 20)
      face(stone, [P(q, 0, -0.05), P(e, 0, -0.05), P(e, ROWS, -0.05), P(q, ROWS, -0.05)], nOut)
    }
    // the dark glazed ground-floor band under the skin (w13)
    for (const [q0, q1] of [[0, 110], [164, FL]]) face(dark, [P(q0, 0, -0.04).map((v, i) => (i < 2 ? v + FN[i] * 0.3 : 0)) as V3, P(q1, 0, -0.04).map((v, i) => (i < 2 ? v + FN[i] * 0.3 : 0)) as V3, P(q1, 0, -0.04).map((v, i) => (i < 2 ? v + FN[i] * 0.3 : 3.2)) as V3, P(q0, 0, -0.04).map((v, i) => (i < 2 ? v + FN[i] * 0.3 : 3.2)) as V3], nOut)
    // the facade's ends: returns back to the building
    for (const s of [0, FL]) face(stone, [P(s, 0, 0), P(s, 0, 1.4), P(s, ROWS, 1.4), P(s, ROWS, 0)], [s === 0 ? -FU[0] : FU[0], s === 0 ? -FU[1] : FU[1], 0])
    // the coping along the ramp
    for (let s = 0; s < FL; s += T) {
      const e = Math.min(FL, s + T)
      face(stone, [P(s, ROWS, -0.8), P(e, ROWS, -0.8), P(e, ROWS, 1.5), P(s, ROWS, 1.5)].map((p) => [p[0], p[1], p[2] + 0.4] as V3), [0, 0, 1])
      face(stone, [P(s, ROWS, 1.5), P(e, ROWS, 1.5), [...P(e, ROWS, 1.5).slice(0, 2), fTop(e) + 0.4] as V3, [...P(s, ROWS, 1.5).slice(0, 2), fTop(s) + 0.4] as V3], [FN[0], FN[1], 0])
    }
  }

  // --- the portal: a great dark-glazed pyramid cut into the facade at the main gate (g1, g2)
  {
    const s0 = 110, s1 = 164, sm = (s0 + s1) / 2, out = 19, top = fTop(sm) - 1.0
    const Q = (s: number, o: number, z: number): V3 => [F0[0] + FU[0] * s + FN[0] * o, F0[1] + FU[1] * s + FN[1] * o, z]
    const A = Q(s0, 0, 0), B = Q(s1, 0, 0), C = Q(sm, out, 0), Tp = Q(sm, 0, top)
    // the two glazed faces, and the facade wall behind the cut, above the pyramid
    face(win, [A, C, Tp], [FN[0] - FU[0], FN[1] - FU[1], 0.7])
    face(win, [C, B, Tp], [FN[0] + FU[0], FN[1] + FU[1], 0.7])
    const zt = (s: number) => fTop(s)
    face(stone, [Q(s0, 0.1, 0), Tp, Q(sm, 0.1, zt(sm)), Q(s0, 0.1, zt(s0))].map((p, i) => (i === 1 ? [p[0] + FN[0] * 0.1, p[1] + FN[1] * 0.1, p[2]] as V3 : p)), [FN[0], FN[1], 0])
    face(stone, [Tp, Q(s1, 0.1, 0), Q(s1, 0.1, zt(s1)), Q(sm, 0.1, zt(sm))].map((p, i) => (i === 0 ? [p[0] + FN[0] * 0.1, p[1] + FN[1] * 0.1, p[2]] as V3 : p)), [FN[0], FN[1], 0])
    // its bold pale frame: the three edges and the ridge, and a mullion grid on each face
    for (const [p, q] of [[A, Tp], [B, Tp], [C, Tp]] as [V3, V3][]) beam(stone, p, q, 1.3, [0, 0, 1], true, 1.0)
    const mull = detail ? 5 : 2
    for (let i = 1; i <= mull; i++) {
      const t = i / (mull + 1)
      const m = (p: V3, q: V3): V3 => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t]
      beam(dark, m(A, Tp), m(C, Tp), 0.35, [0, 0, 1], false, 0.3)
      beam(dark, m(B, Tp), m(C, Tp), 0.35, [0, 0, 1], false, 0.3)
    }
  }

  // --- the dark wedge of roof cantilevered over the entrance plaza at the facade's south end (g2, g3, g13)
  {
    const Q = (a: number, o: number): XY => [F0[0] + FU[0] * a + FN[0] * o, F0[1] + FU[1] * a + FN[1] * o]
    const ring: XY[] = [Q(FL - 62, 0.5), Q(FL + 4, 30), Q(FL + 26, 8), Q(FL + 26, -2), Q(FL - 62, -2)]
    const zc = (x: number, y: number) => ZS + 1.4 - 0.12 * Math.max(0, -behind(x, y)) + x * 0
    const tris = polyTris(ring)
    for (const [a, b, c] of tris) face(dark, [[...a, zc(...a) + 1.6], [...b, zc(...b) + 1.6], [...c, zc(...c) + 1.6]] as V3[], [0, 0, 1])
    for (const [a, b, c] of tris) face(dark, [[...a, zc(...a) - 0.6], [...b, zc(...b) - 0.6], [...c, zc(...c) - 0.6]] as V3[], [0, 0, -1])
    for (let k = 0; k < ring.length; k++) {
      const a = ring[k], b = ring[(k + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1e-6) continue
      const n: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
      face(dark, [[a[0], a[1], zc(...a) - 0.6], [b[0], b[1], zc(...b) - 0.6], [b[0], b[1], zc(...b) + 1.6], [a[0], a[1], zc(...a) + 1.6]], n)
    }
    // the OSM canopy on the north wall (building=roof), a small dark wedge over the side entrance
    const zn = (x: number, y: number) => roofZ(x, Math.min(y, 86)) - 0.4 + x * 0
    for (const [a, b, c] of polyTris(CANOPY)) face(dark, [[...a, zn(...a) + 1.0], [...b, zn(...b) + 1.0], [...c, zn(...c) + 1.0]] as V3[], [0, 0, 1])
    for (const [a, b, c] of polyTris(CANOPY)) face(dark, [[...a, zn(...a) - 0.4], [...b, zn(...b) - 0.4], [...c, zn(...c) - 0.4]] as V3[], [0, 0, -1])
  }

  // --- the Hanging Obelisk of Ramesses II over its dark gate pavilion (g2, g3)
  {
    const [ox, oy] = OBELISK, rot = Math.atan2(FU[1], FU[0])
    const sq = (h: number): XY[] => [[-h, -h], [h, -h], [h, h], [-h, h]].map(([x, y]) => [ox + x * Math.cos(rot) - y * Math.sin(rot), oy + x * Math.sin(rot) + y * Math.cos(rot)] as XY)
    const prism = (p: Part, r0: XY[], r1: XY[], z0: number, z1: number, topCap: boolean) => {
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4, m: XY = [(r0[i][0] + r0[j][0]) / 2 - ox, (r0[i][1] + r0[j][1]) / 2 - oy]
        face(p, [[...r0[i], z0], [...r0[j], z0], [...r1[j], z1], [...r1[i], z1]] as V3[], [m[0], m[1], 0.05])
      }
      if (topCap) face(p, r1.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
    }
    // the pavilion: a dark box 22 m square, 6 m high, its top a dark glass deck
    prism(dark, sq(11), sq(11), 0, 6, true)
    // four slender supports and the obelisk raised on them, the base seen through the pavilion's glass in reality
    for (const [x, y] of sq(1.2)) cyl(dark, x, y, 0.25, 6, 9, 6, false)
    prism(granite, sq(1.35), sq(1.35), 9, 9.6, false)
    prism(granite, sq(1.3), sq(0.85), 9.6, 25, false)
    const tip: V3 = [ox, oy, 26.6], t = sq(0.85)
    for (let i = 0; i < 4; i++) face(granite, [[...t[i], 25], [...t[(i + 1) % 4], 25], tip] as V3[], [(t[i][0] + t[(i + 1) % 4][0]) / 2 - ox, (t[i][1] + t[(i + 1) % 4][1]) / 2 - oy, 0.4])
  }

  const flood = (_p: V3, n: V3) => (n[2] > 0.7 ? 0 : (n[0] * FN[0] + n[1] * FN[1]) > 0.3 ? 0.95 : 0.35)
  return [
    { part: stone, material: { ...finish('gem-alabaster', 0xe8e0cf), floodlight: flood } },
    { part: bronze, material: finish('gem-bronze', 0x8f8070) },
    { part: roof, material: finish('gem-roof', 0xd5cdbd) },
    { part: win, material: { ...PALETTE.window, color: 0x55687a } },
    { part: dark, material: finish('gem-canopy', 0x4f545c) },
    { part: granite, material: { ...finish('gem-obelisk', 0xc7a690), floodlight: () => 0.9 } },
  ]
}

if (import.meta.main) {
  const extras = { anchor: ANCHOR, bearing: BEARING }
  await writeModel(`${ID}.glb`, NAME, build(false), extras, 6500, 250_000)
  await writeModel(`${ID}.detail.glb`, NAME, build(true), extras, 40_000, 1_536_000)
}
