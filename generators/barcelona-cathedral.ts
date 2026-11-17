/**
 * Barcelona Cathedral (Catedral de la Santa Creu i Santa Eulàlia) —
 * original procedural geometry, CC0-1.0. bun generators/barcelona-cathedral.ts
 *
 * This file also exports the small Gothic kit (pointed arches, roses,
 * octagonal towers, hipped and gabled roofs, arcades) that the other
 * Barcelona church generators import (barcelona-santa-maria-del-mar,
 * barcelona-santa-maria-del-pi, barcelona-tibidabo-sagrat-cor); merge this one
 * first. The cathedral itself is built only under `import.meta.main`.
 *
 * Frame: built turned to the church's axis, BEARING 313. +y is the axis
 * towards the neo-Gothic main front on the Pla de la Seu (north-west); +x is
 * the Carrer dels Comtes side (north-east); -x the cloister and Carrer del
 * Bisbe side. z up, metres. Origin = centroid of the OSM outline
 * relation/3298476 (outer way/37427928, the cloister garth way/37428414 is the
 * inner ring). The nave's axis runs at x = 17.7.
 *
 * Evidence
 * - OSM relation/3298476 (Q17155) and its building:parts, from the Catalan
 *   cadastre ("source=catastro"): way/305857549 nave 30 m (gabled, roof 4),
 *   way/305857552 aisles and chapels 25 m, way/305857554 the chevet's
 *   radiating chapels 15 m, way/305857560 the cimbori 80 m (octagon 14.8 m
 *   across), way/305857564 and way/305857565 the two bell towers 53 m,
 *   way/305857557 sacristy 15 m, cloister galleries way/305857559 (15 m,
 *   hipped), way/305857553 (20 m, hipped), way/305857563 (20 m),
 *   way/305857551 (10 m), the block on the Pla de la Seu beside the front
 *   way/305857555 and way/305857558 (23 m), the chapel of Santa Llúcia
 *   way/1075852646 and a one-storey part way/643140535.
 * - Published (ca.wikipedia "Catedral de Barcelona"; en.wikipedia "Barcelona
 *   Cathedral"; Wikidata Q17155 heights 26 / 53 / 80): 93 m long, 40 m wide,
 *   central nave 26 m inside / 28 m outside, aisles 21 m, front 40 m wide; the
 *   two octagonal bell towers at the ends of the transept 53 m; the cimbori
 *   (lantern and openwork spire over the first bay of the nave, right behind
 *   the front) 80 m with the bronze Santa Helena on top. en.wikipedia gives 70
 *   m for the cimbori; the Catalan article, Wikidata and OSM (cadastre) agree
 *   on 80, and the photo scaling below lands on about 80, so 80 is used.
 *   Neo-Gothic front by Josep Oriol Mestres and August Font, 1887-1890;
 *   cimbori 1906-1913.
 * - Mapterhorn terrain (bun tools/terrain.ts grid, bearing 313): the ground
 *   rises about 3 m from the front (y = 0 here, the Pla de la Seu) to the
 *   apse and 3.5 m to the cloister's far corner; walls run down to y = 0.
 * - Commons daylight photos (EVIDENCE):
 *   "Façana principal de la Catedral de Barcelona.jpg" (Matrixlanau, CC BY-SA
 *   4.0, the front head-on);
 *   "Catedral de Barcelona, vista desde Plaça Nova.jpg" (Simon Burchell, CC
 *   BY-SA 3.0, the front and the block beside it from the west, level and
 *   distant: the photo used to scale the front);
 *   "Barcelona Cathedral - Roof of Cathedral.jpg" (Didier Descouens, CC BY-SA
 *   4.0, the cimbori and the front's spires from the roof);
 *   "Catedral Barcelona (0).JPG" (MarisaLR, CC BY-SA 3.0, both bell towers
 *   from a roof to the south-east);
 *   "Torres i cimbori catedral Barcelona.jpg" (Pere López, CC BY-SA 3.0,
 *   the towers and spire from afar);
 *   "Barcelona Cathedral from Carrer dels Comtes 01.JPG" (Simon Burchell, CC
 *   BY-SA 3.0, the north-east side, chapels, buttresses and the Sant Iu
 *   tower with its iron bell cage);
 *   "Barcelona 2016-218.jpg" (Victor Grigas, CC BY-SA 4.0, the south-west
 *   wall and tower from Carrer del Bisbe).
 *
 * Estimated from the photos (scaled to the published 80 m and 40 m): the
 * front's two lateral spires (square bodies to 34, an open
 * octagonal lantern to 42, openwork needles to 60, 75% of the cimbori as
 * the front photo measures (0.74), so they stand clear of the 53 m bell towers behind), its central screen (33) and
 * outer bays (26), the portal (to 17) and its gable (to 29); the cimbori's
 * octagon (from the roof to 44, parapet 45.5, corner turrets and pinnacles to
 * 52) and spire (to 76, statue to 80); the bell towers' stages (shaft to 40,
 * belfry with two lancets a face to 50, parapet 53) and the Sant Iu tower's
 * iron cage; chapels 15 m, aisle walls 22 m, nave eaves 27, ridge 30;
 * buttress spacing; the cloister's open arcades. Colours from the photos,
 * pulled to the palette's lightness: warm grey-brown Montjuïc sandstone on
 * the old church, a paler golden stone on the neo-Gothic front and cimbori,
 * brown-grey stone roof terraces, dark iron. The block beside the front
 * (OSM parts 305857555/558) is drawn in the same stone, plain.
 *
 * Doubts: what the 23 m block beside the front is (OSM gives no name; it is
 * one of the relation's parts, so it is kept, plain, in the cathedral's
 * stone; the pink render seen from Plaça Nova may belong to the neighbouring
 * buildings); the cloister galleries' exact heights (OSM only); the bell towers'
 * belfry openings are drawn as flush lancets. The spire's openwork is drawn
 * solid, with bands.
 *
 * Night: the front, the cimbori and the bell towers are floodlit; the stone
 * there carries a `floodlight` wash.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, chamfer, circle, onWall, rect, save, triangulate, walls, type XY } from './chi-aon-center'

export { cap, chamfer, circle, onWall, rect, walls, type XY }

/** A flat prism over a counter-clockwise ring, top capped (onto `top`). */
export function prism(p: Part, r: XY[], z0: number, z1: number, top: Part | null = p) {
  walls(p, r, z0, z1)
  if (top) cap(top, r, z1)
}

/** Walls of a counter-clockwise ring, leaving out the edges listed (edge i runs from r[i] to r[i+1]). */
export function wallsSkip(p: Part, r: XY[], z0: number, z1: number, skip: number[]) {
  r.forEach((a, i) => {
    if (skip.includes(i)) return
    const b = r[(i + 1) % r.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  })
}

/** A shape in a wall's own (s along, z up) coordinates, set `out` in front of wall a→b. */
export function flush(p: Part, a: XY, b: XY, pts: XY[], out = 0.06) {
  const { P } = onWall(a, b)
  const v = pts.map(([s, z]) => P(s, z, out))
  for (const [i, j, k] of triangulate(pts)) p.tri(v[i], v[j], v[k])
}

/** Outline of an arch window in (s, z): sides to the springing, then a pointed (or round) head. */
export function archOutline(sc: number, w: number, z0: number, z1: number, pointed = true, n = 4): XY[] {
  const h = w / 2
  if (!pointed) {
    const spring = Math.max(z0, z1 - h)
    const pts: XY[] = [[sc - h, z0], [sc + h, z0]]
    for (let k = 0; k <= 2 * n; k++) { const a = (k / (2 * n)) * Math.PI; pts.push([sc + h * Math.cos(a), spring + h * Math.sin(a)]) }
    return dedupe(pts)
  }
  const rise = w * Math.sin(Math.PI / 3)
  const spring = Math.max(z0, z1 - rise)
  const pts: XY[] = [[sc - h, z0], [sc + h, z0]]
  for (let k = 0; k <= n; k++) { const a = (k / n) * (Math.PI / 3); pts.push([sc - h + w * Math.cos(a), spring + w * Math.sin(a)]) }
  for (let k = n - 1; k >= 1; k--) { const a = (k / n) * (Math.PI / 3); pts.push([sc + h - w * Math.cos(a), spring + w * Math.sin(a)]) }
  return dedupe(pts)
}
const dedupe = (pts: XY[]): XY[] => pts.filter((p, i) => { const q = pts[(i + 1) % pts.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-4 })

/** A flush pointed (or round) arch panel on wall a→b, centred `sc` along it. */
export function arch(p: Part, a: XY, b: XY, sc: number, w: number, z0: number, z1: number, out = 0.06, pointed = true) {
  flush(p, a, b, archOutline(sc, w, z0, z1, pointed), out)
}

/** A flush disc (rose window) or ring on wall a→b. */
export function rose(p: Part, a: XY, b: XY, sc: number, zc: number, r1: number, r0 = 0, out = 0.06, n = 16) {
  const { P } = onWall(a, b)
  const pt = (r: number, t: number) => P(sc + r * Math.cos(t), zc + r * Math.sin(t), out)
  for (let i = 0; i < n; i++) {
    const t0 = (i / n) * 2 * Math.PI, t1 = ((i + 1) / n) * 2 * Math.PI
    if (r0 <= 0) p.tri(P(sc, zc, out), pt(r1, t0), pt(r1, t1))
    else p.quad(pt(r1, t0), pt(r1, t1), pt(r0, t1), pt(r0, t0))
  }
}

/** A flat-shaded solid of revolution about (cx, cy) from an (r, z) profile; `seg` sides. */
export function turned(p: Part, cx: number, cy: number, prof: XY[], seg = 8, a0 = Math.PI / 8) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    for (let i = 0; i < seg; i++) {
      const t0 = a0 + (i / seg) * 2 * Math.PI, t1 = a0 + ((i + 1) / seg) * 2 * Math.PI
      const P = (r: number, z: number, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
      if (r0 < 1e-6 && r1 < 1e-6) continue
      if (r1 < 1e-6) p.tri(P(r0, z0, t0), P(r0, z0, t1), [cx, cy, z1])
      else if (r0 < 1e-6) p.tri([cx, cy, z0], P(r1, z1, t1), P(r1, z1, t0))
      else p.quad(P(r0, z0, t0), P(r0, z0, t1), P(r1, z1, t1), P(r1, z1, t0))
    }
  }
}

/** A slim pinnacle: square or octagonal shaft then a spike. */
export function pinnacle(p: Part, x: number, y: number, r: number, z0: number, z1: number, z2: number, seg = 4) {
  turned(p, x, y, [[r, z0], [r, z1], [r * 1.2, z1 + 0.15], [0, z2]], seg, seg === 4 ? Math.PI / 4 : Math.PI / seg)
}

/** A hipped roof over an axis-aligned rectangle, eaves at z, rising h. */
export function hip(p: Part, x0: number, y0: number, x1: number, y1: number, z: number, h: number) {
  const along = x1 - x0 >= y1 - y0, hw = (along ? y1 - y0 : x1 - x0) / 2
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const A: V3 = [x0, y0, z], B: V3 = [x1, y0, z], C: V3 = [x1, y1, z], D: V3 = [x0, y1, z]
  const r0: V3 = along ? [x0 + hw, cy, z + h] : [cx, y0 + hw, z + h]
  const r1: V3 = along ? [x1 - hw, cy, z + h] : [cx, y1 - hw, z + h]
  if (along) {
    p.quad(A, B, r1, r0); p.quad(C, D, r0, r1); p.tri(B, C, r1); p.tri(D, A, r0)
  } else {
    p.quad(B, C, r1, r0); p.quad(D, A, r0, r1); p.tri(A, B, r0); p.tri(C, D, r1)
  }
}

/**
 * A gabled hall over an axis-aligned rectangle: walls to the eaves, gable
 * ends, roof planes with a small overhang. The ridge runs along the longer
 * side unless `alongY` says otherwise.
 */
export function hall(wall: Part, roof: Part, x0: number, y0: number, x1: number, y1: number, eave: number, ridge: number, alongY = y1 - y0 > x1 - x0, ends: [boolean, boolean] = [true, true], o = 0.4) {
  // (a, b): a along the ridge, b across it
  const a0 = alongY ? y0 : x0, a1 = alongY ? y1 : x1, c = alongY ? (x0 + x1) / 2 : (y0 + y1) / 2, hw = alongY ? (x1 - x0) / 2 : (y1 - y0) / 2
  const M = (a: number, b: number, z: number): V3 => (alongY ? [c - b, a, z] : [a, c + b, z])
  wall.quad(M(a0, -hw, 0), M(a1, -hw, 0), M(a1, -hw, eave), M(a0, -hw, eave))
  wall.quad(M(a1, hw, 0), M(a0, hw, 0), M(a0, hw, eave), M(a1, hw, eave))
  if (ends[1]) { wall.quad(M(a1, -hw, 0), M(a1, hw, 0), M(a1, hw, eave), M(a1, -hw, eave)); wall.tri(M(a1, -hw, eave), M(a1, hw, eave), M(a1, 0, ridge)) }
  if (ends[0]) { wall.quad(M(a0, hw, 0), M(a0, -hw, 0), M(a0, -hw, eave), M(a0, hw, eave)); wall.tri(M(a0, hw, eave), M(a0, -hw, eave), M(a0, 0, ridge)) }
  const ez = eave - (o * (ridge - eave)) / hw
  roof.quad(M(a0, -hw - o, ez), M(a1, -hw - o, ez), M(a1, 0, ridge), M(a0, 0, ridge))
  roof.quad(M(a1, hw + o, ez), M(a0, hw + o, ez), M(a0, 0, ridge), M(a1, 0, ridge))
  roof.quad(M(a1, -hw - o, ez), M(a0, -hw - o, ez), M(a0, -hw, eave), M(a1, -hw, eave))
  roof.quad(M(a0, hw + o, ez), M(a1, hw + o, ez), M(a1, hw, eave), M(a0, hw, eave))
}

/** A moulding (string course, cornice) round a ring: `d` proud, z0..z1. */
export function course(p: Part, r: XY[], z0: number, z1: number, d = 0.35) {
  const n = r.length
  const o: XY[] = r.map((c, i) => {
    const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]
    const n1 = norm(a, c), n2 = norm(c, b)
    const k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    return [c[0] + ((n1[0] + n2[0]) / Math.max(k, 0.2)) * d, c[1] + ((n1[1] + n2[1]) / Math.max(k, 0.2)) * d]
  })
  walls(p, o, z0, z1)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    p.quad([o[i][0], o[i][1], z1], [o[j][0], o[j][1], z1], [r[j][0], r[j][1], z1], [r[i][0], r[i][1], z1])
    p.quad([r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [o[j][0], o[j][1], z0], [o[i][0], o[i][1], z0])
  }
}
// outward normal of a counter-clockwise edge a→b
const norm = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l] }

/** Edges of a counter-clockwise ring, as [a, b] pairs. */
export const edges = (r: XY[]): [XY, XY][] => r.map((a, i) => [a, r[(i + 1) % r.length]])

/** Half a regular polygon round (cx, cy), from angle a0 sweeping `sweep` radians in n steps. */
export const arc = (cx: number, cy: number, r: number, a0: number, sweep: number, n: number): XY[] =>
  Array.from({ length: n + 1 }, (_, k) => [cx + r * Math.cos(a0 + (k / n) * sweep), cy + r * Math.sin(a0 + (k / n) * sweep)] as XY)

/**
 * An open arcade along wall a→b (counter-clockwise ring edge, so outward is
 * to the right): piers at the face, a lintel band above the openings and
 * the back wall set `depth` behind. `n` bays between s0 and s1.
 */
export function arcade(wall: Part, dark: Part, a: XY, b: XY, s0: number, s1: number, n: number, z0: number, zOpen: number, zTop: number, depth: number, pier: number) {
  const { P } = onWall(a, b)
  const bay = (s1 - s0) / n
  // back wall, dark: the shaded gallery behind the arches
  dark.quad(P(s0, z0, -depth), P(s1, z0, -depth), P(s1, zOpen, -depth), P(s0, zOpen, -depth))
  // gallery ceiling seen from below
  wall.quad(P(s0, zOpen, -depth), P(s1, zOpen, -depth), P(s1, zOpen, 0), P(s0, zOpen, 0))
  // the band over the arches
  wall.quad(P(s0, zOpen, 0), P(s1, zOpen, 0), P(s1, zTop, 0), P(s0, zTop, 0))
  for (let k = 0; k <= n; k++) {
    const s = s0 + k * bay, h = pier / 2
    const lo = k === 0 ? s : s - h, hi = k === n ? s : s + h
    // front, sides of each pier
    wall.quad(P(lo, z0, 0), P(hi, z0, 0), P(hi, zOpen, 0), P(lo, zOpen, 0))
    if (k > 0) wall.quad(P(lo, z0, -depth), P(lo, z0, 0), P(lo, zOpen, 0), P(lo, zOpen, -depth))
    if (k < n) wall.quad(P(hi, z0, 0), P(hi, z0, -depth), P(hi, zOpen, -depth), P(hi, zOpen, 0))
    // a pointed head in each opening: the spandrels, drawn as wall
    if (k < n) {
      const sa = hi, sb = s0 + (k + 1) * bay - (k + 1 === n ? 0 : h), w = sb - sa, top = zOpen, spring = top - w * 0.6
      const m = (sa + sb) / 2
      wall.tri(P(sa, spring, 0), P(m, top, 0), P(sa, top, 0))
      wall.tri(P(sb, spring, 0), P(sb, top, 0), P(m, top, 0))
    }
  }
}

export { save }

// ---------------------------------------------------------------------------
// The cathedral

function build() {
  const stone = new Part(), front = new Part(), roof = new Part(), win = new Part(), iron = new Part()
  const CX = 17.7 // the nave's axis
  const X = (u: number) => CX + u
  const FY = 39.5 // the main front's face

  // --- The church body: chapels, aisles, nave ---
  const CH = 15, AISLE = 22, EAVE = 27, RIDGE = 30
  const Y0 = -21, Y1 = 36 // body between the chevet and the front block
  // chapels band: u ±19.5
  prism(stone, rect(X(-19.5), Y0, X(19.5), Y1), 0, CH, roof)
  course(front, rect(X(-19.5), Y0, X(19.5), Y1), CH - 0.6, CH)
  // aisle walls: u ±13.5
  prism(stone, rect(X(-13.5), Y0, X(13.5), Y1), CH, AISLE, roof)
  course(front, rect(X(-13.5), Y0, X(13.5), Y1), AISLE - 0.6, AISLE)
  // nave
  hall(stone, roof, X(-7), Y0 - 14, X(7), Y1, AISLE, EAVE, true, [false, false])
  // bays: buttress lines and windows on both long sides
  const BAYS = [-9, -1.5, 6, 13.5, 21, 28.5]
  for (const sd of [1, -1]) {
    // outer face of the chapels and the aisle wall (counter-clockwise edge, outward to the right)
    const chapA: XY = sd > 0 ? [X(19.5), Y0] : [X(-19.5), Y1], chapB: XY = sd > 0 ? [X(19.5), Y1] : [X(-19.5), Y0]
    const aisA: XY = sd > 0 ? [X(13.5), Y0] : [X(-13.5), Y1], aisB: XY = sd > 0 ? [X(13.5), Y1] : [X(-13.5), Y0]
    const nvA: XY = sd > 0 ? [X(7), Y0] : [X(-7), Y1], nvB: XY = sd > 0 ? [X(7), Y1] : [X(-7), Y0]
    const s = (y: number) => (sd > 0 ? y - Y0 : Y1 - y)
    for (let i = 0; i < BAYS.length; i++) {
      const yb = BAYS[i]
      // the buttress: from the chapel face up past the chapel roof to the aisle cornice
      const bx0 = sd > 0 ? X(13.5) : X(-20.7), bx1 = sd > 0 ? X(20.7) : X(-13.5)
      prism(stone, chamfer(rect(bx0, yb - 1.0, bx1, yb + 1.0), 0.3), 0, AISLE - 1.5, stone)
      pinnacle(front, sd > 0 ? X(19.2) : X(-19.2), yb, 0.6, AISLE - 1.5, AISLE + 0.4, AISLE + 3.2)
      if (i === BAYS.length - 1) continue
      const yc = (yb + BAYS[i + 1]) / 2
      if (sd > 0 || yc < 17) {
        // chapel windows (north-east side; the cloister covers the other's)
        if (sd > 0) arch(win, chapA, chapB, s(yc), 3.0, 4.5, 13.0)
        arch(win, aisA, aisB, s(yc), 3.8, 15.6, 21.2)
      }
      rose(win, nvA, nvB, s(yc), 24.6, 1.05, 0, 0.06, 10)
    }
  }

  // --- The transept's bell towers (53 m, octagonal) ---
  const towers: [number, number, boolean][] = [[X(17.5), -15.4, true], [X(-17.5), -15.4, false]]
  for (const [tx, ty, cage] of towers) {
    const R = 5.0
    turned(stone, tx, ty, [[R, 0], [R, 39.4], [R + 0.45, 39.6], [R + 0.45, 40.4], [R - 0.2, 40.6], [R - 0.2, 50.2], [R + 0.3, 50.4], [R + 0.3, 53.0], [0, 53.0]], 8)
    // the belfry: two tall lancets a face
    const ring = circle(tx, ty, R - 0.2, 8, Math.PI / 8)
    edges(ring).forEach(([a, b]) => {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      for (const d of [-0.85, 0.85]) arch(win, a, b, L / 2 + d, 1.1, 42.4, 49.2)
    })
    // corner buttresses on the shaft
    for (let k = 0; k < 8; k++) {
      const t = (k / 8) * 2 * Math.PI + Math.PI / 8
      pinnacle(front, tx + (R + 0.15) * Math.cos(t), ty + (R + 0.15) * Math.sin(t), 0.32, 50.4, 53.2, 54.8)
    }
    if (cage) {
      // the Sant Iu tower's iron bell cage: ribs to a crown and a vane
      const C = 3.6
      for (let k = 0; k < 6; k++) {
        const t = (k / 6) * 2 * Math.PI
        const pts: XY[] = [[0, 53], [0.4, 55.5], [0.75, 57.4], [0.95, 59.0]]
        const at = (f: number, z: number): V3 => [tx + (C * (1 - f)) * Math.cos(t), ty + (C * (1 - f)) * Math.sin(t), z]
        for (let q = 0; q < pts.length - 1; q++) {
          const [f0, z0] = pts[q], [f1, z1] = pts[q + 1]
          const A = at(f0, z0), B = at(f1, z1), w = 0.22
          const nx = -Math.sin(t) * w, ny = Math.cos(t) * w
          iron.quad([A[0] - nx, A[1] - ny, A[2]], [A[0] + nx, A[1] + ny, A[2]], [B[0] + nx, B[1] + ny, B[2]], [B[0] - nx, B[1] - ny, B[2]])
          iron.quad([A[0] + nx, A[1] + ny, A[2]], [A[0] - nx, A[1] - ny, A[2]], [B[0] - nx, B[1] - ny, B[2]], [B[0] + nx, B[1] + ny, B[2]])
        }
      }
      turned(iron, tx, ty, [[0.9, 52.8], [0.9, 56], [0.25, 58.8], [0.25, 61.5], [0, 62.2]], 6)
    }
  }

  // --- The chevet: radiating chapels, ambulatory, apse ---
  const AY = -35.5
  // build the rings counter-clockwise: from (X(-r), y0) down round the end to (X(r), y0)
  const chevet = (r: number, cy: number, y0: number): XY[] => [[X(-r), y0], ...arc(X(0), cy, r, Math.PI, Math.PI, 5), [X(r), y0]]
  const chap = chevet(18.5, AY, Y0)
  prism(stone, chap, 0, 14, roof)
  course(front, chap, 13.4, 14)
  const amb = chevet(13.5, AY, Y0)
  prism(stone, amb, 14, 22, roof)
  course(front, amb, 21.4, 22)
  // the apse: walls to the eaves and a half cone
  const apse = chevet(7, AY, Y0 - 14)
  walls(stone, apse, 22, EAVE)
  const tip: V3 = [X(0), AY, RIDGE]
  const apR = arc(X(0), AY, 7.35, Math.PI, Math.PI, 5)
  const apZ = EAVE - 0.35 * (RIDGE - EAVE) / 7
  for (let k = 0; k < 5; k++) roof.tri([apR[k][0], apR[k][1], apZ], [apR[k + 1][0], apR[k + 1][1], apZ], tip)
  // windows round the chevet and buttresses between the chapels
  edges(chap).forEach(([a, b], i) => {
    if (i === 0 || i === chap.length - 1) return
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L > 4) arch(win, a, b, L / 2, 2.2, 4.5, 11.5)
  })
  edges(amb).forEach(([a, b], i) => {
    if (i === 0 || i === amb.length - 1) return
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L > 4) arch(win, a, b, L / 2, 2.4, 15.6, 20.8)
  })
  edges(apse).forEach(([a, b], i) => {
    if (i === 0 || i === apse.length - 1) return
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L > 3) rose(win, a, b, L / 2, 24.6, 1.0, 0, 0.06, 10)
  })
  for (let k = 1; k < 5; k++) {
    const t = Math.PI + (k / 5) * Math.PI
    const bx = X(0) + 16.5 * Math.cos(t), by = AY + 16.5 * Math.sin(t)
    turned(stone, bx, by, [[1.1, 0], [1.1, 19.5], [0, 21.5]], 4, t + Math.PI / 4)
    pinnacle(front, X(0) + 13.9 * Math.cos(t), AY + 13.9 * Math.sin(t), 0.45, 22, 22.8, 25.2)
  }
  // the sacristy on the Comtes side, between the tower and the chevet chapels
  prism(stone, rect(X(19.5), -12.5, X(21.6), 8), 0, 14, roof)

  // --- The cimbori: octagonal lantern over the first bay, openwork spire, Santa Helena ---
  {
    const cx = X(0), cy = 24.7, R = 7.84
    const ring = circle(cx, cy, R, 8, Math.PI / 8)
    prism(front, ring, AISLE, 44, null)
    course(front, ring, 43.4, 45.6, 0.45)
    cap(roof, ring, 45.6)
    edges(ring).forEach(([a, b]) => {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      arch(win, a, b, L / 2, 3.0, 31.0, 42.6)
      // the gablet over each window
      const { P } = onWall(a, b)
      front.tri(P(L / 2 - 2.2, 43.0, 0.2), P(L / 2 + 2.2, 43.0, 0.2), P(L / 2, 48.4, 0.2))
      front.tri(P(L / 2 + 2.2, 43.0, 0.2), P(L / 2 - 2.2, 43.0, 0.2), P(L / 2, 48.4, 0.2))
    })
    // corner turrets with pinnacles
    for (let k = 0; k < 8; k++) {
      const t = Math.PI / 8 + (k / 8) * 2 * Math.PI
      turned(front, cx + (R + 0.2) * Math.cos(t), cy + (R + 0.2) * Math.sin(t), [[0.75, AISLE + 4], [0.75, 46.5], [0.9, 46.7], [0, 52.5]], 6)
    }
    // the inner ring of pinnacles round the spire's foot
    for (let k = 0; k < 8; k++) {
      const t = (k / 8) * 2 * Math.PI
      pinnacle(front, cx + 4.6 * Math.cos(t), cy + 4.6 * Math.sin(t), 0.45, 45.6, 52, 57.5)
    }
    // the spire: octagonal, with two crown bands and a pierced look given by slit panels
    turned(front, cx, cy, [[4.3, 45.6], [3.5, 52], [3.75, 52.4], [3.75, 53.4], [2.25, 61.5], [2.45, 61.8], [2.45, 62.6], [0.75, 73.5], [0.95, 73.8], [0.95, 75.2], [0, 75.4]], 8)
    for (let k = 0; k < 8; k++) {
      const t0 = Math.PI / 8 + (k / 8) * 2 * Math.PI, t1 = t0 + Math.PI / 4
      // a long dark slit in each face of the spire (the openwork), slightly proud
      const f = (r: number, z: number, s: number): V3 => {
        const tm = (t0 + t1) / 2, ap = r * Math.cos(Math.PI / 8) + 0.08
        return [cx + ap * Math.cos(tm) - s * Math.sin(tm), cy + ap * Math.sin(tm) + s * Math.cos(tm), z]
      }
      const rAt = (z: number) => (z < 61.5 ? 3.75 + ((2.25 - 3.75) * (z - 53.4)) / (61.5 - 53.4) : 2.45 + ((0.75 - 2.45) * (z - 62.6)) / (73.5 - 62.6))
      for (const [z0, z1] of [[54.4, 60.6], [63.6, 71.0]]) {
        const w0 = rAt(z0) * 0.2, w1 = rAt(z1) * 0.2
        roof.quad(f(rAt(z0), z0, -w0), f(rAt(z0), z0, w0), f(rAt(z1), z1, w1), f(rAt(z1), z1, -w1))
      }
    }
    // Santa Helena with the cross, bold enough to read
    turned(iron, cx, cy, [[0.55, 75.3], [0.62, 76.6], [0.45, 78.2], [0.3, 78.7], [0.12, 79.2], [0.12, 80.0], [0, 80.0]], 6)
  }

  // --- The neo-Gothic main front (1887-1890) ---
  {
    const FY0 = 33.5
    // central screen, side bays, outer bays
    prism(front, rect(X(-9.5), FY0, X(9.5), FY), 0, 33, roof)
    for (const sd of [1, -1]) {
      const ox0 = sd > 0 ? X(16.5) : X(-20), ox1 = sd > 0 ? X(20) : X(-16.5)
      prism(front, rect(ox0, 34.5, ox1, FY), 0, 26.5, roof)
      pinnacle(front, (ox0 + ox1) / 2, FY - 0.6, 0.55, 26.5, 28.5, 31.5)
      // the tower: square with chamfered corners, then an octagonal spire
      const tx0 = sd > 0 ? X(9.5) : X(-16.5), tx1 = sd > 0 ? X(16.5) : X(-9.5), tcx = (tx0 + tx1) / 2, tcy = FY - 3.5
      prism(front, chamfer(rect(tx0, FY - 7, tx1, FY), 1.1), 0, 34.0, roof)
      course(front, chamfer(rect(tx0, FY - 7, tx1, FY), 1.1), 33.2, 34.4, 0.3)
      // the lateral spire: an octagonal open lantern, then a tall openwork needle
      turned(front, tcx, tcy, [[3.4, 34.0], [3.4, 41.0], [3.7, 41.2], [3.7, 42.0], [3.35, 42.2], [1.6, 52.5], [1.8, 52.7], [1.8, 53.4], [0.14, 59.6], [0, 60.0]], 8)
      for (let k = 0; k < 8; k++) {
        const tm = Math.PI / 4 + (k / 8) * 2 * Math.PI, c = Math.cos(tm), sn = Math.sin(tm)
        const rAt = (z: number) => 3.35 + ((1.6 - 3.35) * (z - 42.2)) / (52.5 - 42.2)
        const f = (z: number, w: number, r: number): V3 => { const ap = r * Math.cos(Math.PI / 8) + 0.08; return [tcx + ap * c - w * sn, tcy + ap * sn + w * c, z] }
        win.quad(f(35.0, -0.65, 3.4), f(35.0, 0.65, 3.4), f(40.4, 0.65, 3.4), f(40.4, -0.65, 3.4))
        roof.quad(f(43.4, -rAt(43.4) * 0.2, rAt(43.4)), f(43.4, rAt(43.4) * 0.2, rAt(43.4)), f(51.4, rAt(51.4) * 0.2, rAt(51.4)), f(51.4, -rAt(51.4) * 0.2, rAt(51.4)))
      }
      for (const [px, py] of [[tx0 + 0.6, FY - 0.6], [tx1 - 0.6, FY - 0.6], [tx0 + 0.6, FY - 6.4], [tx1 - 0.6, FY - 6.4]] as XY[])
        pinnacle(front, px, py, 0.65, 34.4, 40.0, 47.5)
      // the tower's front: a tall window, a smaller one over it
      const fa: XY = [tx1, FY], fb: XY = [tx0, FY]
      arch(win, fa, fb, 3.5, 2.6, 17.5, 26.5)
      arch(win, fa, fb, 3.5, 2.0, 27.0, 32.6)
      // outer bay window, side-bay window
      arch(win, [ox1, FY], [ox0, FY], 1.75, 1.8, 15, 22.5)
      // the tower's outer side
      const sa: XY = sd > 0 ? [tx1, FY - 7] : [tx0, FY], sb: XY = sd > 0 ? [tx1, FY] : [tx0, FY - 7]
      arch(win, sa, sb, 3.5, 2.0, 27.0, 32.6)
    }
    const fa: XY = [X(9.5), FY], fb: XY = [X(-9.5), FY]
    // the portal: archivolts (trim ring left as stone), doors and tympanum dark
    arch(roof, fa, fb, 9.5, 10.0, 0, 19.0, 0.1)
    arch(win, fa, fb, 9.5, 6.6, 0, 16.2, 0.16)
    // the gable over the portal with its tracery
    const { P } = onWall(fa, fb)
    front.quad(P(3.0, 14.0, 0), P(16.0, 14.0, 0), P(16.0, 14.0, 0.6), P(3.0, 14.0, 0.6))
    front.tri(P(3.0, 14.0, 0.6), P(16.0, 14.0, 0.6), P(9.5, 29.5, 0.6))
    front.quad(P(16.0, 14.0, 0.6), P(16.0, 14.0, 0), P(9.5, 29.5, 0), P(9.5, 29.5, 0.6))
    front.quad(P(9.5, 29.5, 0.6), P(9.5, 29.5, 0), P(3.0, 14.0, 0), P(3.0, 14.0, 0.6))
    rose(win, fa, fb, 9.5, 20.5, 2.3, 0, 0.66, 12)
    pinnacle(front, X(0), FY + 0.3, 0.5, 29.0, 30.0, 32.5)
    // windows either side of the gable and the gallery under the cornice
    for (const s of [3.3, 15.7]) arch(win, fa, fb, s, 2.4, 17.5, 25.0)
    for (let k = 0; k < 5; k++) arch(win, fa, fb, 5.4 + k * 2.05, 1.2, 28.6, 31.6)
    course(front, rect(X(-9.5), FY0, X(9.5), FY), 32.4, 33.4, 0.3)
    for (const s of [-9.2, -4.6, 0, 4.6, 9.2]) if (s !== 0) pinnacle(front, X(s), FY - 0.4, 0.45, 33.4, 34.6, 37.2)
  }

  // --- The cloister and the buildings round it ---
  {
    // galleries (east, north, south) and the west wing; the garth (x -32.4..-12.3, y -11.5..16.9) stays
    // open, ringed by open pointed arcades (their shaded galleries in the roof colour, unlit at night).
    // Below the arcade tops only the outer walls are drawn.
    const GX0 = -32.4, GX1 = -12.3, GY0 = -11.5, GY1 = 16.9, AO = 6.2, AT = 7.6
    const east = rect(GX1, GY0, X(-19.5), GY1), north = rect(GX0, GY1, X(-19.5), 23.2)
    const south = rect(GX0, -23.3, X(-19.5), GY0), west = rect(-45.7, -23.2, GX0, 23.2)
    prism(stone, east, AT, 13, null); hip(roof, GX1 - 0.3, GY0, X(-19.5), GY1, 13, 2)
    prism(stone, north, AT, 13, null); hip(roof, GX0, GY1, X(-19.5), 23.4, 13, 2)
    wallsSkip(stone, south, 0, AT, [2]); prism(stone, south, AT, 18, null); hip(roof, GX0, -23.5, X(-19.5), GY0 + 0.3, 18, 2)
    wallsSkip(stone, west, 0, AT, [1]); prism(stone, west, AT, 10, roof)
    course(stone, west, 9.4, 10, 0.25)
    const D = 3.0
    // the garth's faces, clockwise round it so each faces into it
    arcade(stone, roof, [GX0, GY0], [GX0, GY1], 0.6, GY1 - GY0 - 0.6, 7, 0, AO, AT, D, 1.0)
    arcade(stone, roof, [GX0, GY1], [GX1, GY1], 0.6, GX1 - GX0 - 0.6, 5, 0, AO, AT, D, 1.0)
    arcade(stone, roof, [GX1, GY1], [GX1, GY0], 0.6, GY1 - GY0 - 0.6, 7, 0, AO, AT, D, 1.0)
    arcade(stone, roof, [GX1, GY0], [GX0, GY0], 0.6, GX1 - GX0 - 0.6, 5, 0, AO, AT, D, 1.0)
    // the Santa Llúcia chapel's door and window on the west wing's street face
    arch(win, [-45.7, 23.2], [-45.7, -23.2], 37.5, 2.2, 0.5, 5.2, 0.06, false)
    // the block on the Pla de la Seu beside the front (OSM parts of the cathedral), in the same stone
    prism(stone, rect(-35, 23.2, X(-19.5), 38.8), 0, 22, roof)
    course(stone, rect(-35, 23.2, X(-19.5), 38.8), 21.4, 22, 0.25)
    // windows on the block's front to the plaza
    for (let k = 0; k < 5; k++) {
      const s = 4 + k * 6.6
      flush(win, [X(-19.5), 38.8], [-35, 38.8], [[s - 1.0, 10.5], [s + 1.0, 10.5], [s + 1.0, 18.5], [s - 1.0, 18.5]])
    }
  }

  // Close the bottom so the shadow pass sees a solid.
  cap(stone, rect(-45.7, -54, X(20), FY), 0, false)

  const lit = (p: V3, n: V3): number => ((p[1] > 16 && p[0] > -3) || Math.hypot(p[0] - X(17.5), p[1] + 15.4) < 6 || Math.hypot(p[0] - X(-17.5), p[1] + 15.4) < 6 ? (n[2] > 0.7 ? 0.3 : 1) : 0)
  return [
    { part: stone, material: { ...finish('bcn-cathedral-stone', 0xd8c9b0), floodlight: lit } },
    { part: front, material: { ...finish('bcn-cathedral-front', 0xe6d7ba), floodlight: lit } },
    { part: roof, material: finish('bcn-cathedral-roof', 0xb7aa95) },
    { part: win, material: PALETTE.window },
    { part: iron, material: finish('bcn-cathedral-iron', 0x5d5a55) },
  ]
}

if (import.meta.main) await save('barcelona-cathedral', 'Barcelona Cathedral', [41.38391, 2.17636], 313, build(), 6500)
