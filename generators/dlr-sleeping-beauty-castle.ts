/**
 * Sleeping Beauty Castle, Disneyland Park, Anaheim — procedural, CC0-1.0.
 * bun generators/dlr-sleeping-beauty-castle.ts
 *
 * Map frame: x east, y north, z up, metres. Origin at the area centroid of
 * the OSM outline way/331440228 (-117.9195400, 33.8127932), on the ground.
 * Placed at bearing 0: the archway runs due north–south, from the hub
 * (south) into Fantasyland (north), and the outline's front and rear faces
 * are square to it. Geometry below is written in a frame whose origin is
 * 0.648 m east and 1.680 m north of the anchor (the point the OSM parts were
 * measured from: -117.9189470, 33.8128084)
 * and shifted onto the anchor at the end.
 *
 * Anaheim's castle is small (77 ft) and built in forced perspective, and the
 * model keeps its three layers:
 *  - the grey-blue stone base: the curtain wall on the OSM outline, its wings
 *    running north-west and north-east to end towers, crenellated, pierced
 *    north–south by the archway, with round towers carrying small blue cones;
 *  - the pink centre: the keep behind the gate, its steep blue roof hipped
 *    to the hub with a pink dormer and two pink corner turrets, gabled to
 *    Fantasyland; the square pink tower with its blue pyramid west of it;
 *    the low east hall with the gold flèche; the low west hall;
 *  - the tall white tower east of the keep, with two galleries, a stair
 *    turret and the highest blue cone and gold finial.
 *
 * Evidence:
 *  - OSM, measured (relation/7751688 and its 40 members): the outline
 *    (332 m², 39.5 × 21 m with its wings) and the building:parts — the keep
 *    (way/331430139, 14 m, gabled), the tall tower (way/123045128 and
 *    /123045130, 22–23 m), its stair turret (way/335137574, /335316774,
 *    21–22.5 m), the square tower (way/312549916, 13–14 m, hipped), the east
 *    hall (way/331430135, 9 m) and its flèche (way/312550372), the west hall
 *    (way/132311785, 8 m), the gate's round towers (way/123045133,
 *    /123045118, 7.2 m drums, 9.6 m cones), the keep's front turrets
 *    (way/332667873–877, 14–15 m), and the wall towers (way/123045129,
 *    /160998709, /331440225, /123045140, /123045134, /123045127,
 *    /123045121; 7–9 m). The archway axis is midway between the two gate
 *    towers, x = −1.25 here.
 *  - Published: 77 ft (23.5 m) to the top (Wikipedia; OSM height_ft=77).
 *  - Photos, licensed (Wikimedia Commons; one Flickr via Openverse): front from the hub, Feb 2024
 *    (Parksfan1955, CC0) — the scale for every level of the front, at 33 px/m
 *    measured on the gate towers' OSM spacing; the south-west across the
 *    moat after the 2019 repaint (CrispyCream27, CC BY-SA 4.0); the
 *    south-east across the moat (SolarSurfer, public domain, pre-2019
 *    colours, used for shape only); the south-west (JeffChristiansen via
 *    Flickr, CC BY 2.0); the rear and roofs from the Skyway, 1978
 *    (foundin_a_attic, CC BY 2.0) — the keep's north gable with its tall
 *    window and flanking turrets.
 *
 * Colours are the 2019 repaint's, as in the 2024 photo: blue-grey stone,
 * clear pink upper walls, cobalt-blue roofs, gold finials, flèche and arch
 * trim, and a white tall tower.
 *
 * Measured vs estimated:
 *  - measured (OSM): footprint, every part's position and plan size, the
 *    gate tower drums (7.2 m; 7.4 here);
 *  - published: the 23.5 m top, given to the tall tower's finial;
 *  - proportioned on the 2024 front photo, against the published top: the
 *    keep's pink face is about as tall as the stone wall below it (wall
 *    6.2 m, held a little under the photo's 6.4–6.8 so the gate towers and
 *    keep keep their proportions; eave 11.4 m) and its roof rises to just
 *    under the tall tower's main gallery (ridge 15.6 m; OSM says 14); the
 *    tall tower's galleries (15.6 and 18.2 m) and cone (19.8–21.9 m); the
 *    square tower's eave (13.2 m) and apex (16.2 m; OSM 13–14); the keep's
 *    corner turrets (cones to 14.3 m, matching OSM's 14–15); the flèche
 *    (15.5 m; OSM says 12); the wall towers' cones;
 *  - invented: the rear (north) side below the keep's gable — the only
 *    licensed rear view is the 1978 Skyway photo, which shows the gable,
 *    its window and turrets but not the base; the rear is modelled as the
 *    same crenellated stone wall. The white twin turret behind the keep's
 *    roof is placed from the front photo alone.
 *
 * Doubts: OSM's part heights are partly cone bases and partly tips, so
 * levels come from the front photo; heights further back than the gate are
 * scaled by an estimated depth factor. The real castle carries many more
 * pinnacles, banners, crests and gilded trim; the model keeps the ones that
 * make its silhouette. The bridge over the moat is not part of the OSM
 * building and is left to the map.
 */
import { Part, len, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const TAU = Math.PI * 2

const stone = new Part()   // blue-grey stone base and wall towers
const pink = new Part()    // upper walls
const blue = new Part()    // roofs
const gold = new Part()    // finials, flèche, arch trim
const white = new Part()   // the tall tower
const glazing = new Part() // windows

// ---------------------------------------------------------------------------
// Kit

const unit = (a: V3): V3 => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
function tri(p: Part, a: V3, b: V3, c: V3, n?: V3[]) { p.tri(a, b, c, undefined, undefined, undefined, n) }
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n?: [V3, V3, V3, V3]) {
  tri(p, a, b, c, n && [n[0], n[1], n[2]])
  tri(p, a, c, d, n && [n[0], n[2], n[3]])
}

/** A smooth-shaded frustum about a vertical axis; r1 = 0 makes a cone. */
function frustum(p: Part, cx: number, cy: number, r0: number, z0: number, r1: number, z1: number,
  n: number, o: { top?: boolean; phase?: number } = {}) {
  const ph = (o.phase ?? 0.5 / n) * TAU
  const k = (r0 - r1) / (z1 - z0)
  const at = (i: number, r: number, z: number): V3 => {
    const t = ph + (i / n) * TAU
    return [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
  }
  const nrm = (t: number): V3 => unit([Math.cos(t), Math.sin(t), k])
  for (let i = 0; i < n; i++) {
    const j = i + 1
    const ti = ph + (i / n) * TAU, tj = ph + (j / n) * TAU
    const ni = nrm(ti), nj = nrm(tj)
    if (r1 <= 0) tri(p, at(i, r0, z0), at(j, r0, z0), [cx, cy, z1], [ni, nj, nrm((ti + tj) / 2)])
    else quad(p, at(i, r0, z0), at(j, r0, z0), at(j, r1, z1), at(i, r1, z1), [ni, nj, nj, ni])
  }
  if (o.top && r1 > 0) for (let i = 1; i < n - 1; i++) tri(p, at(0, r1, z1), at(i, r1, z1), at(i + 1, r1, z1))
}

const area = (q: XY[]) => q.reduce((s, a, i) => { const b = q[(i + 1) % q.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2

/** Keep the part of a polygon where a·x + b·y + c ≥ 0 (Sutherland–Hodgman). */
function clip(poly: XY[], a: number, b: number, c: number): XY[] {
  const f = (p: XY) => a * p[0] + b * p[1] + c
  const out: XY[] = []
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], fp = f(p), fq = f(q)
    if (fp >= 0) out.push(p)
    if ((fp >= 0) !== (fq >= 0)) {
      const t = fp / (fp - fq)
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t])
    }
  }
  return out
}

/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
function earcut(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i), out: [number, number, number][] = []
  const crossz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => crossz(a, b, p) > 1e-9 && crossz(b, c, p) > 1e-9 && crossz(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (crossz(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(poly[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A vertical prism over a polygon, flat-shaded. */
function prism(p: Part, poly: XY[], z0: number, z1: number, o: { top?: boolean; skip?: (a: XY, b: XY) => boolean } = {}) {
  if (area(poly) < 0) poly = [...poly].reverse()
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-6 || o.skip?.(a, b)) continue
    quad(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (o.top !== false) for (const [i, j, k] of earcut(poly)) tri(p, [...poly[i], z1] as V3, [...poly[j], z1] as V3, [...poly[k], z1] as V3)
}

const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** A box with its vertical edges chamfered by c. */
function cbox(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, c = 0.3, top = true) {
  prism(p, [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]], z0, z1, { top })
}

/** A hipped roof over a rectangle (a pyramid when square). */
function hip(p: Part, x0: number, x1: number, y0: number, y1: number, ze: number, zr: number) {
  const w = x1 - x0, d = y1 - y0
  if (w >= d) {
    const ym = (y0 + y1) / 2, a = x0 + d / 2, b = x1 - d / 2
    quad(p, [x0, y0, ze], [x1, y0, ze], [b, ym, zr], [a, ym, zr])
    quad(p, [x1, y1, ze], [x0, y1, ze], [a, ym, zr], [b, ym, zr])
    tri(p, [x1, y0, ze], [x1, y1, ze], [b, ym, zr])
    tri(p, [x0, y1, ze], [x0, y0, ze], [a, ym, zr])
  } else {
    const xm = (x0 + x1) / 2, a = y0 + w / 2, b = y1 - w / 2
    quad(p, [x1, y0, ze], [x1, y1, ze], [xm, b, zr], [xm, a, zr])
    quad(p, [x0, y1, ze], [x0, y0, ze], [xm, a, zr], [xm, b, zr])
    tri(p, [x0, y0, ze], [x1, y0, ze], [xm, a, zr])
    tri(p, [x1, y1, ze], [x0, y1, ze], [xm, b, zr])
  }
}

/** Merlons along a polygon's edges, flush with the wall face. */
function merlons(p: Part, poly: XY[], z: number, h: number, w: number, d: number, pitch: number, keep?: (a: XY, b: XY) => boolean) {
  if (area(poly) < 0) poly = [...poly].reverse()
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    if (keep && !keep(a, b)) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < w + 0.3) continue
    const n = Math.max(0, Math.floor((L - w) / pitch))
    const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = -uy, ny = ux // inward normal (CCW)
    const start = (L - n * pitch - w) / 2
    for (let k = 0; k <= n; k++) {
      const s = start + k * pitch
      const c0: XY = [a[0] + ux * s, a[1] + uy * s], c1: XY = [a[0] + ux * (s + w), a[1] + uy * (s + w)]
      prism(p, [c0, c1, [c1[0] + nx * d, c1[1] + ny * d], [c0[0] + nx * d, c0[1] + ny * d]], z, z + h)
    }
  }
}

/** Merlons round a circle. */
function ringMerlons(p: Part, cx: number, cy: number, r: number, z: number, h: number, count: number, d = 0.3) {
  for (let k = 0; k < count; k++) {
    const t0 = (k / count) * TAU, t1 = t0 + (TAU / count) * 0.5
    const P = (t: number, rr: number): XY => [cx + rr * Math.cos(t), cy + rr * Math.sin(t)]
    prism(p, [P(t0, r - d), P(t0, r), P(t1, r), P(t1, r - d)], z, z + h)
  }
}

/**
 * A flat window panel on a wall plane, 0.05 m proud: rectangular, or with a
 * pointed or round head. `face` is the wall's outward normal.
 */
function windowPanel(p: Part, face: 'n' | 's' | 'e' | 'w', plane: number, u: number, w: number, z0: number, z1: number, head: 'flat' | 'pointed' | 'round' = 'flat') {
  const pts: [number, number][] = [[-w / 2, z0], [w / 2, z0]]
  if (head === 'pointed') {
    const spring = z1 - w * 0.75
    pts.push([w / 2, spring], [w * 0.36, spring + w * 0.42], [0, z1], [-w * 0.36, spring + w * 0.42], [-w / 2, spring])
  } else if (head === 'round') {
    const spring = z1 - w / 2
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * Math.PI; pts.push([(w / 2) * Math.cos(t), spring + (w / 2) * Math.sin(t)]) }
  } else pts.push([w / 2, z1], [-w / 2, z1])
  const off = 0.05
  const to = ([s, z]: [number, number]): V3 =>
    face === 's' ? [u + s, plane - off, z] : face === 'n' ? [u - s, plane + off, z]
      : face === 'e' ? [plane + off, u + s, z] : [plane - off, u - s, z]
  for (let i = 1; i < pts.length - 1; i++) tri(p, to(pts[0]), to(pts[i]), to(pts[i + 1]))
}

/** A gold finial spike from z0 up by h. */
function finial(cx: number, cy: number, z0: number, h: number, r = 0.13) {
  frustum(gold, cx, cy, r, z0, 0, z0 + h, 4)
}

/** A blue cone with a thin gold ring at its foot and a gold finial. */
function spire(cx: number, cy: number, r: number, z0: number, tip: number, n: number, fin = 0.9) {
  frustum(gold, cx, cy, r + 0.04, z0 - 0.18, r + 0.04, z0, n)
  frustum(blue, cx, cy, r, z0, 0, tip, n)
  finial(cx, cy, tip - 0.25, fin, Math.max(0.09, r * 0.12))
}

// ---------------------------------------------------------------------------
// Plan: OSM way/331440228, Douglas–Peucker simplified to 0.3 m.

const OUTLINE: XY[] = [[6.9, 0.9], [4.4, 0.9], [4.3, 1.4], [-8.0, 1.4], [-8.1, 0.7], [-10.5, 0.7], [-14.6, 4.9], [-14.1, 9.7], [-15.0, 9.3], [-15.8, 10.2], [-20.6, 7.6], [-20.6, 6.9], [-19.1, 5.2], [-18.7, 3.7], [-17.6, 3.1], [-15.9, 3.7], [-13.3, 0.8], [-13.4, -0.3], [-12.4, -1.3], [-12.4, -4.4], [-13.1, -4.3], [-13.2, -7.5], [-10.8, -7.5], [-10.3, -8.1], [-7.3, -8.0], [-7.1, -9.2], [-6.3, -9.7], [-5.1, -9.6], [-4.7, -10.8], [4.0, -10.7], [5.2, -8.1], [8.0, -6.7], [9.3, -7.4], [10.4, -7.1], [11.0, -5.3], [10.1, -4.2], [8.8, -4.2], [8.8, -3.5], [10.8, -3.5], [11.1, -2.1], [14.6, 1.0], [15.9, 3.4], [16.7, 3.2], [17.7, 3.9], [18.1, 6.5], [18.9, 7.4], [16.9, 9.5], [14.6, 6.1], [13.0, 6.8], [10.3, 4.5], [9.5, 4.7], [9.5, 3.8]]

const AX = -1.25                 // archway axis, midway between the gate towers
const ARCH_W = 3.4, ARCH_SPRING = 1.8
const AX0 = AX - ARCH_W / 2, AX1 = AX + ARCH_W / 2
const WALL = 6.2                 // curtain wall top (photo: 6.4–6.8 m; OSM outline 7), held a little
                                 // low so the gate towers and the pink keep read at the photo's proportions
const FRONT = -10.75, REAR = 1.4 // the archway's two faces

// ---------------------------------------------------------------------------
// 1. Stone base: the outline in two pieces either side of the archway.

const west = clip(OUTLINE, -1, 0, AX0)
const east = clip(OUTLINE, 1, 0, -AX1)
const onCut = (a: XY, b: XY) => Math.abs(a[0] - b[0]) < 1e-6 && (Math.abs(a[0] - AX0) < 1e-6 || Math.abs(a[0] - AX1) < 1e-6)
for (const side of [west, east]) {
  prism(stone, side, 0, WALL)
  merlons(stone, side, WALL, 0.75, 0.75, 0.4, 1.7, (a, b) => !onCut(a, b))
}

// The archway: a semicircular vault through the middle strip, the strip
// above it to the wall top, and the gold trim round its front.
{
  const R = ARCH_W / 2, N = 10
  const arc: XY[] = []
  for (let i = 0; i <= N; i++) {
    const t = Math.PI - (i / N) * Math.PI
    arc.push([AX + R * Math.cos(t), ARCH_SPRING + R * Math.sin(t)])
  }
  const y0 = FRONT, y1 = REAR, top = WALL + 0.3
  for (let i = 0; i < N; i++) {
    const [xa, za] = arc[i], [xb, zb] = arc[i + 1]
    quad(stone, [xa, y0, za], [xb, y0, zb], [xb, y0, top], [xa, y0, top])
    quad(stone, [xb, y1, zb], [xa, y1, za], [xa, y1, top], [xb, y1, top])
    const nA = unit([AX - xa, 0, ARCH_SPRING - za]), nB = unit([AX - xb, 0, ARCH_SPRING - zb])
    quad(stone, [xa, y1, za], [xb, y1, zb], [xb, y0, zb], [xa, y0, za], [nA, nB, nB, nA])
    // Gold archivolt, 0.35 m wide, on the hub face.
    const g = 0.35, yf = y0 - 0.06
    const pa: V3 = [AX + (xa - AX) * (R + g) / R, yf, ARCH_SPRING + (za - ARCH_SPRING) * (R + g) / R]
    const pb: V3 = [AX + (xb - AX) * (R + g) / R, yf, ARCH_SPRING + (zb - ARCH_SPRING) * (R + g) / R]
    quad(gold, [xa, yf, za], [xb, yf, zb], pb, pa)
  }
  // The strip's top and its merlons over the gate, front and back.
  quad(stone, [AX0, y0, top], [AX1, y0, top], [AX1, y1, top], [AX0, y1, top])
  for (const [y, inward] of [[y0, 1], [y1, -1]] as [number, number][]) {
    for (const x of [AX - 1.2, AX, AX + 1.2]) {
      const yy = inward > 0 ? y : y - 0.4
      prism(stone, rect(x - 0.38, x + 0.38, yy, yy + 0.4), top, top + 0.75)
    }
  }
  // The gate jambs below the springing are the cut faces of the two sides.
}

// ---------------------------------------------------------------------------
// 2. Wall towers. OSM centres and radii; levels from the photos.

type Round = { c: XY; r: number; drum: number; cap: 'cone' | 'skirt' | 'crown'; inner: number; coneR: number; tip: number }
const ROUND: Round[] = [
  // The gate towers (way/123045133, /123045118): crenellated drums with a
  // small cone on a pink core. Brought 0.5 m forward of OSM's centres and
  // widened 5–10%: every photo from the moat shows them standing out in
  // front of the walls beside the gate.
  { c: [-6.1, -8.9], r: 1.55, drum: 7.4, cap: 'crown', inner: 0.65, coneR: 0.8, tip: 10.4 },
  { c: [3.7, -8.9], r: 1.55, drum: 7.4, cap: 'crown', inner: 0.65, coneR: 0.8, tip: 10.4 },
  // East front (way/123045129): crenellated, a pink drum and a big cone.
  { c: [9.3, -5.7], r: 1.68, drum: 7.1, cap: 'crown', inner: 1.1, coneR: 1.3, tip: 11.4 },
  // West (way/123045140): a blue skirt roof, a pink drum and a cone.
  { c: [-12.0, 0.2], r: 1.5, drum: 6.4, cap: 'skirt', inner: 0.8, coneR: 0.95, tip: 10.4 },
  // Wing ends (way/123045134, /123045127).
  { c: [-17.4, 4.8], r: 1.75, drum: 6.8, cap: 'crown', inner: 1.15, coneR: 1.3, tip: 10.2 },
  { c: [16.5, 4.7], r: 1.4, drum: 7.0, cap: 'crown', inner: 0.9, coneR: 1.05, tip: 10.0 },
]
for (const t of ROUND) {
  const [x, y] = t.c, r = t.r, n = r > 1.4 ? 14 : 12
  frustum(stone, x, y, r, 0, r, t.drum, n)
  if (t.cap === 'crown') {
    // Corbelled crown and merlons, then the core rising inside them.
    frustum(stone, x, y, r, t.drum - 0.1, r + 0.35, t.drum + 0.35, n)
    frustum(stone, x, y, r + 0.35, t.drum + 0.35, r + 0.35, t.drum + 0.75, n, { top: true })
    ringMerlons(stone, x, y, r + 0.35, t.drum + 0.75, 0.6, r > 1.45 ? 9 : 8, 0.35)
    const core = t.drum + 0.75 + 0.8
    frustum(pink, x, y, t.inner, t.drum + 0.75, t.inner, core, 10)
    spire(x, y, t.coneR, core, t.tip, 12)
  } else {
    frustum(stone, x, y, r, t.drum, r, t.drum, n, { top: true })
    frustum(blue, x, y, r + 0.2, t.drum, t.inner, t.drum + 0.8, n)
    frustum(pink, x, y, t.inner, t.drum + 0.8, t.inner, t.drum + 1.6, 10)
    spire(x, y, t.coneR, t.drum + 1.6, t.tip, 12)
  }
}

// The square tower on the west wall (way/331440225): machicolated, with a
// pink drum and cone (way/123045145, /123045122).
{
  const sq = rect(-13.2, -10.8, -7.5, -4.3)
  prism(stone, sq, 0, 7.0)
  prism(stone, rect(-13.4, -10.6, -7.7, -4.1), 7.0, 7.5)
  merlons(stone, rect(-13.4, -10.6, -7.7, -4.1), 7.5, 0.6, 0.6, 0.3, 1.2)
  frustum(pink, -12.0, -5.9, 0.9, 7.5, 0.9, 8.5, 12)
  spire(-12.0, -5.9, 1.05, 8.5, 10.8, 12)
}

// The square tower east of the keep (way/160998709), crenellated, with the
// round turret's tall cone rising from it (way/331440221, /331440238).
{
  const sq = rect(6.9, 11.0, -2.1, 1.0)
  prism(stone, sq, 0, 7.6)
  merlons(stone, sq, 7.6, 0.6, 0.7, 0.35, 1.5)
  frustum(stone, 8.9, -0.5, 1.25, 7.6, 1.25, 8.3, 12)
  spire(8.9, -0.5, 1.45, 8.3, 12.0, 12)
}

// The north-west wing's end block (way/123045121).
{
  const blk: XY[] = [[-17.8, 9.0], [-18.3, 8.0], [-17.2, 6.6], [-14.9, 6.8], [-15.0, 8.9]]
  prism(stone, blk, 0, 7.2)
  merlons(stone, blk, 7.2, 0.6, 0.6, 0.3, 1.4)
}

// ---------------------------------------------------------------------------
// 3. The pink centre.

// The keep (way/331430139): pink walls to the eave, the steep blue roof
// hipped to the hub and gabled to Fantasyland, ridge 14 m.
const K = { x0: -4.2, x1: 1.5, y0: -9.0, y1: 0.5 }
const KM = (K.x0 + K.x1) / 2
const EAVE = 11.4, RIDGE = 15.6
cbox(pink, K.x0, K.x1, K.y0, K.y1, WALL - 0.5, EAVE, 0.3, false)
{
  const o = 0.25 // eave overhang
  const x0 = K.x0 - o, x1 = K.x1 + o, y0 = K.y0 - o, y1 = K.y1 + 0.05
  const yh = y0 + (x1 - x0) / 2
  quad(blue, [x1, y0, EAVE], [x1, y1, EAVE], [KM, y1, RIDGE], [KM, yh, RIDGE])
  quad(blue, [x0, y1, EAVE], [x0, y0, EAVE], [KM, yh, RIDGE], [KM, y1, RIDGE])
  tri(blue, [x0, y0, EAVE], [x1, y0, EAVE], [KM, yh, RIDGE])
  // Soffit, so the overhang is not see-through from below.
  quad(blue, [x0, y0, EAVE], [x0, y1, EAVE], [x1, y1, EAVE], [x1, y0, EAVE])
  // The north gable, pink, with its tall pointed window.
  tri(pink, [K.x1, K.y1, EAVE], [K.x0, K.y1, EAVE], [KM, K.y1, RIDGE - 0.15])
  windowPanel(glazing, 'n', K.y1, KM, 1.2, EAVE - 2.6, RIDGE - 1.4, 'pointed')
  // Gold cresting along the ridge and the finial over the hip.
  frustum(gold, KM, yh, 0.1, RIDGE, 0, RIDGE + 1.6, 4)
}
// A gold cornice line at the eave.
{
  const z = EAVE - 0.35
  const ring: XY[] = rect(K.x0 - 0.06, K.x1 + 0.06, K.y0 - 0.06, K.y1 + 0.06)
  // Not across the north gable, whose tall window runs through this level.
  prism(gold, ring, z, z + 0.3, { top: false, skip: (a, b) => a[1] > K.y1 && b[1] > K.y1 })
}
// The hub face: the arched window over the gate and the dormer above it.
windowPanel(glazing, 's', K.y0, AX, 0.8, 7.3, 8.9, 'round')
windowPanel(glazing, 's', K.y0, AX, 0.7, 9.5, 10.8, 'round')
{
  const w = 1.6, x0 = AX - w / 2, x1 = AX + w / 2, yf = K.y0 - 0.1, yb = K.y0 + 1.8, zt = EAVE + 1.6, zp = 14.3
  prism(pink, rect(x0, x1, yf, yb), EAVE - 0.4, zt)
  quad(pink, [x0, yf, zt], [x1, yf, zt], [AX + 0.02, yf, zp], [AX - 0.02, yf, zp])
  // The dormer's own little roof, running back into the main one.
  quad(blue, [x1 + 0.1, yf - 0.1, zt], [x1 + 0.1, yb, zt], [AX, yb, zp], [AX, yf - 0.1, zp])
  quad(blue, [x0 - 0.1, yb, zt], [x0 - 0.1, yf - 0.1, zt], [AX, yf - 0.1, zp], [AX, yb, zp])
  windowPanel(glazing, 's', yf, AX, 0.75, EAVE - 0.2, EAVE + 1.3, 'flat')
  finial(AX, yf, zp - 0.2, 0.9)
}
// Corner turrets on the keep's hub face (way/332667873–877) and on its
// Fantasyland gable (from the 1978 Skyway photo).
for (const [x, y, top, tip] of [[-4.0, -8.8, 12.2, 14.3], [1.3, -8.7, 12.2, 14.3], [-4.0, 0.3, 12.4, 14.6], [1.3, 0.3, 12.4, 14.6]] as [number, number, number, number][]) {
  frustum(pink, x, y, 0.48, WALL, 0.48, top, 10)
  frustum(pink, x, y, 0.48, top - 0.6, 0.6, top, 10, { top: true })
  spire(x, y, 0.6, top, tip, 10, 0.8)
}

// The square tower west of the keep (way/312549916): pink, arched windows
// under a blue pyramid, apex 16.2 m.
{
  const x0 = -7.3, x1 = -4.3, y0 = -5.7, y1 = -2.5
  cbox(pink, x0, x1, y0, y1, WALL - 0.5, 13.2, 0.25, false)
  prism(pink, rect(x0 - 0.15, x1 + 0.15, y0 - 0.15, y1 + 0.15), 11.8, 12.2)
  hip(blue, x0 - 0.3, x1 + 0.3, y0 - 0.3, y1 + 0.3, 13.1, 16.2)
  quad(blue, [x0 - 0.3, y0 - 0.3, 13.1], [x0 - 0.3, y1 + 0.3, 13.1], [x1 + 0.3, y1 + 0.3, 13.1], [x1 + 0.3, y0 - 0.3, 13.1])
  finial((x0 + x1) / 2, (y0 + y1) / 2, 16.0, 1.2)
  for (const u of [-0.8, 0, 0.8]) {
    windowPanel(glazing, 's', y0, (x0 + x1) / 2 + u, 0.42, 10.7, 11.35, 'round')
    windowPanel(glazing, 'w', x0, (y0 + y1) / 2 + u, 0.42, 10.7, 11.35, 'round')
    windowPanel(glazing, 'n', y1, (x0 + x1) / 2 + u, 0.42, 10.7, 11.35, 'round')
  }
}

// The west hall (way/132311785): a low hipped blue roof behind the wall.
{
  cbox(pink, -10.4, -7.3, -5.7, -2.5, WALL - 0.5, 7.4, 0.2, false)
  hip(blue, -10.6, -4.3, -5.9, -2.3, 7.3, 9.4)
}

// The east hall (way/331430135): pink walls with pointed windows, a hipped
// blue roof, and the gold flèche on its ridge (way/312550372).
{
  const x0 = 1.5, x1 = 6.7, y0 = -6.1, y1 = -2.2
  cbox(pink, x0, x1, y0, y1, WALL - 0.5, 8.8, 0.4, false)
  hip(blue, x0 - 0.25, x1 + 0.25, y0 - 0.25, y1 + 0.25, 8.7, 11.0)
  quad(blue, [x0 - 0.25, y0 - 0.25, 8.7], [x0 - 0.25, y1 + 0.25, 8.7], [x1 + 0.25, y1 + 0.25, 8.7], [x1 + 0.25, y0 - 0.25, 8.7])
  for (const u of [-4.95, -3.35]) windowPanel(glazing, 'e', x1, u, 0.7, 7.0, 8.5, 'pointed')
  for (const u of [5.0, 6.0]) windowPanel(glazing, 's', y0, u, 0.6, 7.1, 8.5, 'pointed')
  // Flèche: an open gold lantern and a tall needle.
  const fx = 3.6, fy = -4.2
  frustum(gold, fx, fy, 0.5, 10.4, 0.5, 12.0, 8)
  frustum(gold, fx, fy, 0.5, 12.0, 0.62, 12.3, 8, { top: true })
  frustum(gold, fx, fy, 0.45, 12.3, 0, 15.5, 8)
}

// ---------------------------------------------------------------------------
// 4. The tall white tower (way/123045128, /123045130) and its stair turret
// (way/335137574, /335316774). Published 23.5 m to the finial's tip.
{
  const x = 0.8, y = -4.7, n = 14
  // The keep's ridge rises to just under the main gallery, as in the photo.
  frustum(white, x, y, 0.88, WALL, 0.88, 15.6, n)
  // Main gallery: corbels, a parapet ring and merlons.
  frustum(white, x, y, 0.88, 15.6, 1.33, 16.2, n)
  frustum(white, x, y, 1.33, 16.2, 1.33, 16.7, n, { top: true })
  ringMerlons(white, x, y, 1.33, 16.7, 0.55, 10, 0.28)
  frustum(white, x, y, 0.82, 16.7, 0.82, 18.2, n)
  // Upper gallery.
  frustum(white, x, y, 0.82, 18.2, 1.05, 18.6, n)
  frustum(white, x, y, 1.05, 18.6, 1.05, 19.2, n, { top: true })
  frustum(white, x, y, 0.75, 19.2, 0.75, 19.8, n)
  spire(x, y, 0.84, 19.8, 21.9, n, 1.9)
  // Stair turret on the north-east, its own cone just below the main one.
  frustum(white, 1.75, -4.05, 0.38, 12.0, 0.38, 19.9, 8)
  spire(1.75, -4.05, 0.44, 19.9, 21.7, 8, 0.7)
  // Slit windows.
  windowPanel(glazing, 's', y - 0.88, x, 0.36, 13.2, 14.6, 'round')
  windowPanel(glazing, 's', y - 0.82, x, 0.36, 17.1, 17.9, 'round')
  windowPanel(glazing, 'w', x - 0.88, y, 0.36, 13.2, 14.6, 'round')
  windowPanel(glazing, 'e', x + 0.88, y, 0.36, 13.2, 14.6, 'round')
}

// The white twin turret rising behind the keep's ridge.
{
  const x = -2.7, y = -2.2
  frustum(white, x, y, 0.55, 12.5, 0.55, 16.2, 10)
  frustum(white, x, y, 0.55, 16.2, 0.72, 16.5, 10)
  frustum(white, x, y, 0.72, 16.5, 0.72, 17.0, 10, { top: true })
  spire(x, y, 0.5, 17.0, 19.2, 10, 0.8)
  frustum(white, x + 0.55, y + 0.35, 0.28, 15.0, 0.28, 17.2, 6)
  spire(x + 0.55, y + 0.35, 0.3, 17.2, 18.6, 6, 0.6)
}

// ---------------------------------------------------------------------------
// Shift onto the anchor: the outline's area centroid is 0.648 m west and
// 1.680 m south of the point the plan above was measured from, so every
// point moves 0.648 m east and 1.680 m north. Part stores glTF (x, z, −y),
// so x grows by 0.648 and glTF z shrinks by 1.680.

const parts = [
  { part: stone, material: finish('castle-stone', 0xb3bbcc) },
  { part: pink, material: finish('castle-pink', 0xf2c5c8) },
  { part: blue, material: finish('castle-blue', 0x3f66c6, 0.6) },
  { part: gold, material: finish('castle-gold', 0xd9b45e, 0.5) },
  { part: white, material: PALETTE.trim },
  { part: glazing, material: PALETTE.window },
]
for (const { part } of parts) {
  for (let i = 0; i < part.pos.length; i += 3) {
    part.pos[i] += 0.648
    part.pos[i + 2] -= 1.680
  }
}
const triangles = parts.reduce((sum, { part }) => sum + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Sleeping Beauty Castle', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 23.5,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/dlr-sleeping-beauty-castle.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
