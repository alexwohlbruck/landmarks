/**
 * El CapiToon Theater, the facade of Mickey & Minnie's Runaway Railway
 * (opened 2023), Mickey's Toontown, Disneyland Park, Anaheim — procedural,
 * CC0-1.0.
 * bun generators/dlr-toontown-el-capitoon.ts
 *
 * A cartoon Art Deco movie palace at the head of Toontown's main street: a
 * cream false front crowned by pill-topped fins in yellow, red and teal,
 * stepping up either side of a tall cream blade carrying the red
 * "EL CAPITOON" sign, over a rounded marquee on cream columns. A teal turret
 * with a red cone roof stands at its right. Behind, the lobby and queue
 * buildings fill OSM's outline at a plain lobby height.
 *
 * Map frame: x east, y north, z up, metres, turned so the theatre's front
 * is model south. Origin at the outline's centroid (-117.9183276,
 * 33.8156035), on the ground. Bearing 30 (the front faces 210°, measured
 * from OSM's front edge, way/1343882491).
 *
 * Evidence:
 *  - OSM, measured: the outline way/987163640 (55 x 33 m) and the marquee
 *    canopy, relation/14558732 (its outer ring drawn whole; the inner ring
 *    is ignored).
 *  - Photos (licensed, post-2023): the front, square on (Troutfarm27,
 *    CC BY-SA 4.0, commons File:Runaway Railway Disneyland entrance.jpg),
 *    and from the front-left (Contributor19, CC BY 4.0, File:Mickey's
 *    Toontown, 2025.jpg); front-right with the turret (Cory Doctorow,
 *    CC BY-SA 2.0, File:Mickey & Minnie's Runaway Railway (Disneyland)
 *    1.jpg); night front (Muffin Dragon, CC BY-SA 4.0, File:MMRRDLR.jpg).
 *
 * Estimated: every height, from the square-on photo scaled on the marquee
 * (top ~6.3 m): blade caps 15 m, teal pylons 11.8 m, the yellow and red
 * fins 8–9 m, theatre block 7.4 m; the marquee's underside 4.4 m.
 * Invented: the lobby and queue buildings' height (6 m) and their plain
 * cream walls and flat roofs — no photo shows them, much of them is hidden
 * behind other Toontown facades and the painted backdrop; the turret's
 * size and place (from the outline's bay beside the facade and the photo).
 * Left out: the lettering, the bulbs, the posters and the backdrop hills,
 * which belong to the Runaway Railway show building (way/868763698), not
 * this outline.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const TAU = Math.PI * 2

// ---------------------------------------------------------------------------
// OSM (lon, lat): the building outline and the marquee roof's outer ring
// (relation/14558732: way/1343882491 + way/1082430142).

const ANCHOR: XY = [-117.9183276, 33.8156035]
const BEARING = 30 // the theatre faces 210°, so model south is its front
const OUTLINE: XY[] = [[-117.9184654, 33.8156511], [-117.9184653, 33.8156129], [-117.9184662, 33.8155906], [-117.9184666, 33.8155813], [-117.9184569, 33.8155738], [-117.9184680, 33.8155663], [-117.9184638, 33.8155627], [-117.9184528, 33.8155533], [-117.9184282, 33.8155323], [-117.9184388, 33.8155172], [-117.9184467, 33.8155061], [-117.9184627, 33.8154835], [-117.9184428, 33.8154738], [-117.9183582, 33.8154329], [-117.9183454, 33.8154455], [-117.9183380, 33.8154526], [-117.9183312, 33.8154599], [-117.9183309, 33.8154497], [-117.9182766, 33.8154501], [-117.9182617, 33.8154504], [-117.9182619, 33.8154599], [-117.9182470, 33.8154602], [-117.9182459, 33.8154938], [-117.9181200, 33.8154956], [-117.9181202, 33.8155724], [-117.9181552, 33.8155723], [-117.9181556, 33.8156625], [-117.9181862, 33.8156630], [-117.9181846, 33.8157333], [-117.9186711, 33.8157323], [-117.9186709, 33.8157101], [-117.9186998, 33.8157108], [-117.9187004, 33.8156670], [-117.9187144, 33.8156672], [-117.9187148, 33.8156366], [-117.9186705, 33.8156362], [-117.9186703, 33.8156499], [-117.9184654, 33.8156511]]
const MARQUEE: XY[] = [[-117.9184627, 33.8154835], [-117.9184428, 33.8154738], [-117.9183582, 33.8154329], [-117.9183983, 33.8153831], [-117.9184105, 33.8153833], [-117.9184455, 33.8153940], [-117.9184703, 33.8154055], [-117.9184944, 33.8154255], [-117.9184994, 33.8154348], [-117.9184627, 33.8154835]]

const MX = 111320 * Math.cos((ANCHOR[1] * Math.PI) / 180), MY = 110574
const rad = (BEARING * Math.PI) / 180
/** lon/lat → model frame: east/north metres from the anchor, turned by -BEARING. */
const toModel = ([lon, lat]: XY): XY => {
  const e = (lon - ANCHOR[0]) * MX, n = (lat - ANCHOR[1]) * MY
  return [e * Math.cos(rad) - n * Math.sin(rad), e * Math.sin(rad) + n * Math.cos(rad)]
}

// ---------------------------------------------------------------------------
// Dimensions

const BODY = 6.0      // the lobby and queue buildings behind
const BOX = 7.4       // the theatre block behind the false front
const DEEP = 12       // its depth behind the facade
const M0 = 4.4, M1 = 6.3 // marquee underside and top
const BLADE = 15.0    // top of the vertical sign's caps

const plaster = new Part() // cream walls
const roof = new Part()
const teal = new Part()
const yellow = new Part()
const red = new Part()
const door = new Part()

// ---------------------------------------------------------------------------
// Kit

const unit3 = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n?: [V3, V3, V3, V3]) {
  p.tri(a, b, c, undefined, undefined, undefined, n && [n[0], n[1], n[2]])
  p.tri(a, c, d, undefined, undefined, undefined, n && [n[0], n[2], n[3]])
}

function earClip(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i)
  const out: [number, number, number][] = []
  const cross = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (p: XY, a: XY, b: XY, c: XY) => cross(a, b, p) >= -1e-9 && cross(b, c, p) >= -1e-9 && cross(c, a, p) >= -1e-9
  while (idx.length > 3) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i = idx[(k + idx.length - 1) % idx.length], j = idx[k], l = idx[(k + 1) % idx.length]
      const [a, b, c] = [poly[i], poly[j], poly[l]]
      if (cross(a, b, c) <= 1e-9) continue
      if (idx.some((m) => m !== i && m !== j && m !== l && inTri(poly[m], a, b, c))) continue
      out.push([i, j, l]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) throw new Error('ear clipping failed')
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}

/** Drop repeated and collinear nodes, make counter-clockwise. */
function clean(ring: XY[]): XY[] {
  let p = ring.slice(0, -1)
  p = p.filter((q, i) => { const r = p[(i + 1) % p.length]; return Math.hypot(q[0] - r[0], q[1] - r[1]) > 0.05 })
  const area = p.reduce((s, q, i) => { const r = p[(i + 1) % p.length]; return s + q[0] * r[1] - r[0] * q[1] }, 0)
  return area < 0 ? p.reverse() : p
}

/** A prism over a polygon: walls in `wall`, top in `top`, optionally the underside. */
function prism(poly: XY[], z0: number, z1: number, wall: Part, top: Part | null, under: Part | null = null) {
  const N = poly.length
  for (let i = 0; i < N; i++) {
    const a = poly[i], b = poly[(i + 1) % N]
    quad(wall, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  for (const [i, j, k] of earClip(poly)) {
    if (top) top.tri([...poly[i], z1] as V3, [...poly[j], z1] as V3, [...poly[k], z1] as V3)
    if (under) under.tri([...poly[i], z0] as V3, [...poly[k], z0] as V3, [...poly[j], z0] as V3)
  }
}

/**
 * A box with its top edges rounded over (`r`), for the facade's pill-topped
 * fins: x0..x1 across, y0..y1 deep, z0..z1 up.
 */
function fin(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, r: number, open = false) {
  const steps = 4
  // profile across x: straight sides to z1 - r, then quarter rounds
  const prof: [number, number, V3][] = []
  prof.push([x0, z0, [-1, 0, 0]])
  for (let s = 0; s <= steps; s++) {
    const t = (s / steps) * (Math.PI / 2)
    prof.push([x0 + r - r * Math.cos(t), z1 - r + r * Math.sin(t), [-Math.cos(t), 0, Math.sin(t)]])
  }
  for (let s = 0; s <= steps; s++) {
    const t = (Math.PI / 2) * (1 - s / steps)
    prof.push([x1 - r + r * Math.cos(t), z1 - r + r * Math.sin(t), [Math.cos(t), 0, Math.sin(t)]])
  }
  prof.push([x1, z0, [1, 0, 0]])
  for (let i = 0; i < prof.length - 1; i++) {
    const [ax, az, an] = prof[i], [bx, bz, bn] = prof[i + 1]
    // outer skin, swept along y
    quad(p, [ax, y1, az], [bx, y1, bz], [bx, y0, bz], [ax, y0, az], [an, bn, bn, an])
  }
  // front and back faces
  for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) {
    const c: V3 = [(x0 + x1) / 2, y, z0]
    for (let i = 0; i < prof.length - 1; i++) {
      const a: V3 = [prof[i][0], y, prof[i][1]], b: V3 = [prof[i + 1][0], y, prof[i + 1][1]]
      if (s < 0) p.tri(c, b, a); else p.tri(c, a, b)
    }
  }
  if (!open) quad(p, [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0])
}


/**
 * The crown's blocks: square in front view, their top front edge rounded
 * over (`r`), as the photos show them. x0..x1 across, y0 (front) .. y1 deep.
 */
function block(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, r: number) {
  const steps = 4
  const prof: [number, number, V3][] = [[y0, z0, [0, -1, 0]], [y0, z1 - r, [0, -1, 0]]]
  for (let s = 1; s < steps; s++) {
    const t = (s / steps) * (Math.PI / 2)
    prof.push([y0 + r - r * Math.cos(t), z1 - r + r * Math.sin(t), [0, -Math.cos(t), Math.sin(t)]])
  }
  prof.push([y0 + r, z1, [0, 0, 1]], [y1, z1, [0, 0, 1]])
  // the round and the top, swept across x; flat front below the round
  for (let i = 0; i < prof.length - 1; i++) {
    const [ay, az, an] = prof[i], [by, bz, bn] = prof[i + 1]
    const flat = i === 0
    quad(p, [x0, ay, az], [x1, ay, az], [x1, by, bz], [x0, by, bz], flat ? undefined : [an, an, bn, bn])
  }
  // back
  quad(p, [x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1])
  // the two ends
  for (const [x, s] of [[x0, -1], [x1, 1]] as [number, number][]) {
    const c: V3 = [x, y1, z0]
    const ring = [...prof.map(([y, z]) => [x, y, z] as V3)]
    for (let i = 0; i < ring.length - 1; i++) {
      if (s > 0) p.tri(c, ring[i], ring[i + 1]); else p.tri(c, ring[i + 1], ring[i])
    }
    if (s > 0) p.tri(c, [x, y1, z1], ring[ring.length - 1]) ; else p.tri(c, ring[ring.length - 1], [x, y1, z1])
  }
}

function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = false) {
  const c = (x: number, y: number, z: number): V3 => [x, y, z]
  quad(p, c(x0, y0, z0), c(x1, y0, z0), c(x1, y0, z1), c(x0, y0, z1))
  quad(p, c(x1, y0, z0), c(x1, y1, z0), c(x1, y1, z1), c(x1, y0, z1))
  quad(p, c(x1, y1, z0), c(x0, y1, z0), c(x0, y1, z1), c(x1, y1, z1))
  quad(p, c(x0, y1, z0), c(x0, y0, z0), c(x0, y0, z1), c(x0, y1, z1))
  quad(p, c(x0, y0, z1), c(x1, y0, z1), c(x1, y1, z1), c(x0, y1, z1))
  if (bottom) quad(p, c(x0, y1, z0), c(x1, y1, z0), c(x1, y0, z0), c(x0, y0, z0))
}

/** A smooth cylinder or cone frustum about a vertical axis. */
function round(p: Part, cx: number, cy: number, r0: number, z0: number, r1: number, z1: number, n = 16, top = false) {
  const k = (r0 - r1) / (z1 - z0)
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU, b = ((i + 1) / n) * TAU
    const P = (t: number, r: number, z: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
    const N = (t: number): V3 => unit3([Math.cos(t), Math.sin(t), k])
    if (r1 <= 0.001) p.tri(P(a, r0, z0), P(b, r0, z0), [cx, cy, z1], undefined, undefined, undefined, [N(a), N(b), N((a + b) / 2)])
    else quad(p, P(a, r0, z0), P(b, r0, z0), P(b, r1, z1), P(a, r1, z1), [N(a), N(b), N(b), N(a)])
    if (top && r1 > 0.001) p.tri(P(a, r1, z1), P(b, r1, z1), [cx, cy, z1])
  }
}

// ---------------------------------------------------------------------------
// The buildings: OSM's outline at lobby height.

const outline = clean(OUTLINE.map(toModel))
prism(outline, 0, BODY, plaster, roof)

// The facade line: OSM's front edge, nodes 11 → 13 (way/1343882491).
const fa = toModel(OUTLINE[11]), fb = toModel(OUTLINE[13])
const FX = (fa[0] + fb[0]) / 2, FY = (fa[1] + fb[1]) / 2 // ≈ a level line in this frame
const W = Math.hypot(fb[0] - fa[0], fb[1] - fa[1]) / 2   // half the facade's width

// The theatre block behind the facade, a little proud of the lobby roofs.
prism([[FX - W, FY], [FX + W, FY], [FX + W, FY + DEEP], [FX - W, FY + DEEP]], 0, BOX, plaster, roof)

// ---------------------------------------------------------------------------
// The crown: pill-topped fins stepping down either side of the sign, in the
// photos' order outward from it — teal, yellow, red, yellow — then cream.

const FIN_D = 2.4
const BW = 1.0, BD = 1.8 // the sign blade: half-width, depth
const fins: [number, number, number, Part][] = [
  // [inner offset, outer offset, top, material]
  [BW, 1.7, 11.8, teal],
  [1.7, 2.9, 8.7, yellow],
  [2.9, 3.9, 8.0, red],
  [3.9, 5.0, 9.0, yellow],
  [5.0, W, 8.4, plaster],
]
for (const [i0, i1, top, m] of fins) for (const s of [1, -1]) {
  const [x0, x1] = s > 0 ? [FX + i0, FX + i1] : [FX - i1, FX - i0]
  block(m, x0, x1, FY - 0.05, FY + FIN_D, M1 - 0.2, top, 0.6)
}

// The vertical sign: a cream blade with a yellow-framed red panel facing the
// street, under three stepped cream caps.

box(plaster, FX - BW, FX + BW, FY - 0.6, FY - 0.6 + BD, M1, BLADE - 1.2)
box(yellow, FX - 0.8, FX + 0.8, FY - 0.7, FY - 0.6, M1 + 0.4, BLADE - 1.8)
box(red, FX - 0.58, FX + 0.58, FY - 0.78, FY - 0.7, M1 + 0.7, BLADE - 2.1)
for (const [k, z] of [[1.0, BLADE - 1.2], [0.86, BLADE - 0.75], [0.7, BLADE - 0.35]] as [number, number][]) {
  fin(k < 0.8 ? teal : plaster, FX - BW * k * 1.25, FX + BW * k * 1.25, FY - 0.7 * k, FY - 0.6 + BD * k, z, z + 0.4, 0.2)
}

// ---------------------------------------------------------------------------
// The marquee, OSM's canopy outline: cream sign band between teal bulb rails.

const mq = clean(MARQUEE.map(toModel))
prism(mq, M0, M0 + 0.35, teal, null, teal)
prism(mq, M0 + 0.35, M1 - 0.35, plaster, null)
prism(mq, M1 - 0.35, M1, teal, roof)


// Columns at the marquee's front, cream with teal collars.
for (const s of [1, -1]) {
  const cx = FX + s * (W - 0.6), cy = FY - 4.6
  round(plaster, cx, cy, 0.42, 0, 0.42, M0, 12)
  round(teal, cx, cy, 0.55, M0 - 0.7, 0.55, M0 - 0.4, 12, true)
}

// The lobby front under the marquee: doors, ticket window, posters.
box(door, FX - W + 1.2, FX + W - 1.2, FY - 0.08, FY, 0.0, 3.4)

// ---------------------------------------------------------------------------
// The teal turret beside the theatre, with its red cone roof.

{
  const t1 = toModel([-117.9183309, 33.8154497]), t2 = toModel([-117.9182766, 33.8154501])
  const r = 2.7
  const cx = (t1[0] + t2[0]) / 2, cy = Math.max(t1[1], t2[1]) + r * 0.5
  round(teal, cx, cy, r, 0, r, 7.4, 16)
  round(plaster, cx, cy, r + 0.25, 7.4, r + 0.25, 7.8, 16)
  round(red, cx, cy, r + 0.45, 7.8, 0, 10.6, 16)
}

// ---------------------------------------------------------------------------

const parts = [
  { part: plaster, material: finish('toon-cream', 0xf6e8cf) },
  { part: roof, material: PALETTE.roof },
  { part: teal, material: finish('toon-teal', 0x7fc3bd) },
  { part: yellow, material: finish('toon-yellow', 0xeec463) },
  { part: red, material: finish('toon-red', 0xd0675d) },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((sum, { part }) => sum + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('El CapiToon Theater', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: BEARING, elevation: 0, height: BLADE,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/dlr-toontown-el-capitoon.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes; facade tilt ${(Math.atan2(fb[1] - fa[1], fb[0] - fa[0]) * 180 / Math.PI).toFixed(1)}°, at (${FX.toFixed(1)}, ${FY.toFixed(1)}), ${(2 * W).toFixed(1)} m wide`)
