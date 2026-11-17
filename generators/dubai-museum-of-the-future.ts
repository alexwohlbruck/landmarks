/**
 * Museum of the Future, Dubai — original procedural geometry, CC0-1.0.
 * bun generators/dubai-museum-of-the-future.ts
 *
 * Frame: map frame turned to BEARING 38.8 (the outline's long axis, found as
 * the direction of least width): model +y runs along the ring towards the NE
 * end, +x across it towards the SE (Al Mustaqbal St), z up, metres. Origin =
 * centroid of OSM way/1054289435 (55.2818293 E, 25.2191117 N).
 *
 * The landmark is a stainless-steel ring standing upright in a NE-SW plane,
 * set into a grass-covered podium hill. The hill is built: it holds the
 * entrance hall (a glazed arch opens in its NW side) and has round skylights,
 * and OSM maps nothing under the ring, so the map would draw flat ground there.
 * The hill is therefore modelled as part of the landmark (a green finish over
 * its built shell), from street level at y = 0, with elevation 0; the ring
 * sinks into its crown. It is not ground landscaping in the sense of STYLE.md.
 *
 * Evidence
 * - OSM way/1054289435 (building, height 77): the ring's plan, 139.3 m along
 *   the axis, up to 39 m across; narrow and pointed at the SW (half-width ~7 m
 *   around a centre 6 m to the NW), widening to ~19 m by 30 m in, a 20 m
 *   radius round NE end. These half-widths drive the ring's depth below.
 *   way/1054289437 (building:part, layer 1) is the footbridge to Emirates
 *   Towers: not modelled, not replaced.
 * - Published: height 77 m (OSM tag; Killa Design/Buro Happold, as reported
 *   on Wikipedia "Museum of the Future" and its sources), seven floors,
 *   1,024 stainless-steel-clad composite panels, windows forming Arabic
 *   calligraphy by Matar Bin Lahej; opened 22 February 2022.
 * - Photos (daylight):
 *   "The Museum of the Future, Dubai" (two), Simon_sees, CC BY 2.0,
 *     https://www.flickr.com/photos/39551170@N02/52070688089 and
 *     https://www.flickr.com/photos/39551170@N02/52070466153
 *     (from Sheikh Zayed Road, NW, level and ~200 m off: every ring
 *     proportion below is measured on the first, scaled to the OSM length);
 *   "Museum of the future Dubai UAE.", amanderson2, CC BY 2.0,
 *     https://www.flickr.com/photos/49399018@N00/51973473427 (the hill, the
 *     glazed entrance arch, the strokes up close);
 *   "Museum of the Future 8.jpg", "Museum of the Future 9.jpg",
 *     "Museum of the Future 11.jpg", EditQ, CC0,
 *     https://commons.wikimedia.org/wiki/File:Museum_of_the_Future_9.jpg (and _8, _11)
 *     (from the SE and S, the ring end-on);
 *   "Museum of the Future.jpg", Александр Сигачёв, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Museum_of_the_Future.jpg
 *     (dusk, from the SE: the hill and the lit calligraphy);
 *   "Emirates Towers Shk Zayed Road.jpg", Ahmed Al Habesh, CC BY-SA 4.0
 *     (from the N, with Emirates Towers).
 * - No lidar or open aerials for the UAE; Mapterhorn has no tiles here, so
 *   the terrain could not be checked. The site is flat.
 *
 * Numbers (revised after lead review, round 1)
 * - Top of the ring 77 m: published/OSM. Ring length 139.3 m: OSM.
 * - Ring outer height 70 m (7-77 m), i.e. half its length: measured on the
 *   most face-on licensed photo (Simon_sees 52070688089, from SZR NW of the
 *   museum; roll-corrected ring 685 x ~300 px, hole drawn out to 2.2:1, so
 *   little foreshortening) as 0.43-0.48 of the visible length, which includes
 *   some of the ring's depth; the more oblique 52070466153 gives >= 0.55 with
 *   its foot hidden by the metro viaduct. A 54 m ring (first version) was too
 *   flat. Estimated, +-5 m.
 * - The hole: 40% of the length (s -61.8 to -6.2, 12.5 m in from the SW
 *   tip), 38% of the height (30.7-57.3 m), so the NE end is a solid mass
 *   over half the ring's length: measured on the same face-on photo (hole
 *   from 46% to 91% of the length from the NE end).
 * - The tube's depth (across the ring plane) follows the OSM half-widths.
 * - The hill: 168 x 84 m, 21 m high, flat-crowned, so the ring's lower curve
 *   (7 m at its lowest) runs down into it for most of its length, as in both
 *   SZR photos. Estimated. The glazed entrance arch (22 x 12 m) is a flush
 *   glass panel laid on the hill's NW flank: estimated.
 * - Calligraphy: broad flush window strokes (STYLE.md: special windows are
 *   flush shapes; never a texture), 0.06 m off the skin and laid on it in
 *   ~4 m rows: three lines of long sweeping strokes (5-8.5 m wide, 60-110
 *   degrees long) round each broad face and twelve tall upright strokes
 *   (alifs, 4-6 m wide) across the tube, mostly on the thick NE end; about
 *   35-40% of the broad faces dark. The arrangement is invented in the manner
 *   of the real script, not traced: the text is not reproduced.
 * Look-only references: none.
 * Doubts: no photo from straight above; the hill's extent and the ring's
 * depth profile rest on OSM and oblique photos. The ring's cross-section is
 * drawn as a full rounded ellipse; the real one is a little flatter on the
 * broad faces.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, windowVariant } from './palette'

const BEARING = 38.8
const ANCHOR = { lng: 55.2818293, lat: 25.2191117 }

const steel = new Part(), strokes = new Part(), hill = new Part(), arch = new Part()

// --- Ring in its own plane: s = along the axis (model y), z up. ---
const S_MID = -4.65, A_OUT = 69.65 // outer ellipse: s from -74.3 to 65.0
const Z_MID = 42, B_OUT = 35 // 7 .. 77: 70 m tall, half its length (face-on SZR photo)
const S_HOLE = -34, A_HOLE = 27.8 // hole: s from -61.8 to -6.2 (40% of the length, 12.5 m from the SW tip)
const Z_HOLE = 44, B_HOLE = 13.3 // 30.7 .. 57.3 (38% of the height)

const lerpTable = (t: [number, number][], x: number) => {
  if (x <= t[0][0]) return t[0][1]
  for (let i = 1; i < t.length; i++) if (x <= t[i][0]) {
    const [x0, y0] = t[i - 1], [x1, y1] = t[i]
    return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
  }
  return t[t.length - 1][1]
}
// OSM half-width and centre offset (across the ring) by position along it.
const HALF: [number, number][] = [[-74, 7.5], [-68, 8], [-64, 9.5], [-58, 11.5], [-52, 13.5], [-45, 15.5], [-39, 17.5], [-30, 18.5], [-18, 19], [42, 19.5], [65, 20.5]]
const CENTRE: [number, number][] = [[-74, -6.5], [-64, -4.5], [-52, -3], [-39, -0.7], [-18, 0.2], [65, 0.7]]

/** Distance from the hole centre to an ellipse along direction (c, s). */
function rayToEllipse(cs: number, sn: number, cx: number, cz: number, a: number, b: number) {
  // point H + t(cs,sn) on ((x-cx)/a)^2 + ((z-cz)/b)^2 = 1
  const dx = S_HOLE - cx, dz = Z_HOLE - cz
  const qa = (cs * cs) / (a * a) + (sn * sn) / (b * b)
  const qb = 2 * ((dx * cs) / (a * a) + (dz * sn) / (b * b))
  const qc = (dx * dx) / (a * a) + (dz * dz) / (b * b) - 1
  return (-qb + Math.sqrt(qb * qb - 4 * qa * qc)) / (2 * qa)
}

const P_EXP = 2 / 2.6 // superellipse cross-section: a little fuller than an ellipse
const sgnPow = (v: number, p: number) => Math.sign(v) * Math.abs(v) ** p

/**
 * The ring surface. th: angle round the hole (0 = towards the NE end), ps:
 * angle round the tube (0 = outer edge, 90 = the SE face, 180 = the hole's
 * edge, 270 = the NW face).
 */
function ringPoint(th: number, ps: number): V3 {
  const cs = Math.cos(th), sn = Math.sin(th)
  const ri = rayToEllipse(cs, sn, S_HOLE, Z_HOLE, A_HOLE, B_HOLE)
  const ro = rayToEllipse(cs, sn, S_MID, Z_MID, A_OUT, B_OUT)
  const sOut = S_HOLE + cs * ro
  const half = lerpTable(HALF, sOut), off = lerpTable(CENTRE, sOut)
  const mid = (ri + ro) / 2, hr = (ro - ri) / 2
  const r = mid + hr * sgnPow(Math.cos(ps), P_EXP)
  const d = half * sgnPow(Math.sin(ps), P_EXP)
  return [off + d, S_HOLE + cs * r, Z_HOLE + sn * r]
}
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit3 = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const addS = (a: V3, b: V3, s: number): V3 => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s]
const E = 1e-3
const dTh = (th: number, ps: number) => sub3(ringPoint(th + E, ps), ringPoint(th - E, ps)).map((v) => v / (2 * E)) as V3
const dPs = (th: number, ps: number) => sub3(ringPoint(th, ps + E), ringPoint(th, ps - E)).map((v) => v / (2 * E)) as V3
/** Outward normal. (th increases anticlockwise seen from +x, ps runs outer->SE face->inner.) */
const ringNormal = (th: number, ps: number): V3 => unit3(cross3(dTh(th, ps), dPs(th, ps)))
// Check the sign once: at the outer edge of the NE end the normal must point +y.
const NSIGN = ringNormal(0, 0)[1] > 0 ? 1 : -1
const nrm = (th: number, ps: number): V3 => ringNormal(th, ps).map((v) => v * NSIGN) as V3

// --- The steel skin. ---
const NT = 56, NP = 20
{
  const grid: { p: V3; n: V3 }[][] = []
  for (let i = 0; i <= NT; i++) {
    const th = (i / NT) * Math.PI * 2, row: { p: V3; n: V3 }[] = []
    for (let j = 0; j <= NP; j++) {
      const ps = (j / NP) * Math.PI * 2
      row.push({ p: ringPoint(th, ps), n: nrm(th, ps) })
    }
    grid.push(row)
  }
  for (let i = 0; i < NT; i++) for (let j = 0; j < NP; j++) {
    const a = grid[i][j], b = grid[i + 1][j], c = grid[i + 1][j + 1], d = grid[i][j + 1]
    steel.tri(a.p, b.p, c.p, undefined, undefined, undefined, [a.n, b.n, c.n])
    steel.tri(a.p, c.p, d.p, undefined, undefined, undefined, [a.n, c.n, d.n])
  }
}

// --- Calligraphy: broad flush strokes on the two broad faces. ---
/** Move a surface parameter so its point shifts by v (two Newton steps). */
function shiftParam(th: number, ps: number, v: V3): [number, number] {
  const target = addS(ringPoint(th, ps), v, 1)
  let t = th, p = ps
  for (let it = 0; it < 2; it++) {
    const r = sub3(target, ringPoint(t, p))
    const a = dTh(t, p), b = dPs(t, p)
    const aa = a[0] * a[0] + a[1] * a[1] + a[2] * a[2], bb = b[0] * b[0] + b[1] * b[1] + b[2] * b[2], ab = a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
    const av = a[0] * r[0] + a[1] * r[1] + a[2] * r[2], bv = b[0] * r[0] + b[1] * r[1] + b[2] * r[2]
    const det = aa * bb - ab * ab
    t += (bb * av - ab * bv) / det
    p += (aa * bv - ab * av) / det
  }
  return [t, p]
}
const LIFT = 0.06
/**
 * One stroke: a centre line in (th, u) on a face, u = 0 at the hole's edge,
 * 1 at the outer edge; width in metres. Each cross-section is four points
 * laid on the curved skin, so a broad stroke follows it instead of cutting
 * under it.
 */
function stroke(face: 1 | -1, pts: [number, number][], width: (t: number) => number) {
  const toPs = (u: number) => (face > 0 ? Math.PI - u * Math.PI : Math.PI + u * Math.PI)
  const centre = pts.map(([th, u]) => [th, toPs(u)] as [number, number])
  const rows: { p: V3; n: V3 }[][] = []
  centre.forEach(([th, ps], k) => {
    const n = nrm(th, ps)
    const [th0, ps0] = centre[Math.max(0, k - 1)], [th1, ps1] = centre[Math.min(centre.length - 1, k + 1)]
    const tan = unit3(sub3(ringPoint(th1, ps1), ringPoint(th0, ps0)))
    const side = unit3(cross3(n, tan))
    const w = width(k / (centre.length - 1)) / 2
    rows.push([-1, -1 / 3, 1 / 3, 1].map((f) => {
      const [ta, pa] = shiftParam(th, ps, side.map((v) => v * w * f) as V3)
      const nn = nrm(ta, pa)
      return { p: addS(ringPoint(ta, pa), nn, LIFT), n: nn }
    }))
  })
  for (let k = 0; k < rows.length - 1; k++) for (let c = 0; c < 3; c++) {
    const a = rows[k][c], b = rows[k][c + 1], d = rows[k + 1][c], e = rows[k + 1][c + 1]
    strokes.tri(a.p, d.p, e.p, undefined, undefined, undefined, [a.n, d.n, e.n])
    strokes.tri(a.p, e.p, b.p, undefined, undefined, undefined, [a.n, e.n, b.n])
  }
}
const deg = Math.PI / 180
/** Rows for a stroke so each runs ~3.5 m along the skin: short chords stay on top of it. */
function rowsFor(face: 1 | -1, at: (t: number) => [number, number]) {
  const toPs = (u: number) => (face > 0 ? Math.PI - u * Math.PI : Math.PI + u * Math.PI)
  let len = 0, prev: V3 | null = null
  for (let i = 0; i <= 24; i++) {
    const [th, u] = at(i / 24), q = ringPoint(th, toPs(u))
    if (prev) len += Math.hypot(...sub3(q, prev))
    prev = q
  }
  return Math.max(6, Math.ceil(len / 4))
}
// Deterministic pseudo-random numbers, so the model is the same every build.
let seed = 7
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)

for (const face of [1, -1] as const) {
  seed = face > 0 ? 7 : 911
  // Two lines of long, broad sweeping strokes running round the ring.
  for (const [u0, wBase] of [[0.26, 7], [0.52, 5], [0.76, 8]] as [number, number][]) {
    let th = rnd() * 25 * deg
    while (th < 2 * Math.PI - 30 * deg) {
      const span = Math.min((60 + rnd() * 50) * deg, 2 * Math.PI - 8 * deg - th)
      const amp = 0.04 + rnd() * 0.05, ph = rnd() * Math.PI * 2
      const n = rowsFor(face, (t) => [th + span * t, u0]), pts: [number, number][] = []
      for (let k = 0; k <= n; k++) {
        const t = k / n
        pts.push([th + span * t, u0 + amp * Math.sin(ph + t * Math.PI * 2)])
      }
      // thick body, tapering to a point at one end and a blunt head at the other
      stroke(face, pts, (t) => wBase * (0.25 + 0.75 * Math.sin(Math.PI * (0.15 + 0.8 * t))))
      th += span + (10 + rnd() * 10) * deg
    }
  }
  // Tall upright strokes across the tube (alifs), most on the thick NE end.
  const alifs = [-62, -50, -38, -26, -14, -2, 12, 30, 150, 168, 192, 210]
  for (const a0 of alifs) {
    const th = (a0 + (rnd() - 0.5) * 4) * deg
    const slant = (rnd() - 0.5) * 8 * deg
    const pts: [number, number][] = []
    const n = rowsFor(face, (t) => [th + slant * t, 0.12 + 0.76 * t])
    for (let m = 0; m <= n; m++) pts.push([th + slant * (m / n), 0.12 + 0.76 * (m / n)])
    stroke(face, pts, (t) => 4.2 + 1.6 * Math.sin(Math.PI * t))
  }
}

// --- The podium hill: built, grassed; a flat-crowned dome from the street to 21 m. ---
const HILL_L = 84, HILL_W = 42, HILL_H = 21, HILL_S = -4.65, HILL_K = 2.6
const hillZ = (r: number) => HILL_H * Math.max(0, 1 - r ** 3.4) ** 0.5
/** Normalised (superelliptic) radius of a plan point. */
const hillR = (x: number, y: number) => ((Math.abs(x) / HILL_W) ** HILL_K + (Math.abs(y - HILL_S) / HILL_L) ** HILL_K) ** (1 / HILL_K)
{
  const NS = 36, NR = 7
  const ringAt = (r: number): V3[] => Array.from({ length: NS }, (_, i) => {
    const a = (i / NS) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a)
    const x = HILL_W * r * sgnPow(c, 2 / HILL_K), y = HILL_S + HILL_L * r * sgnPow(s, 2 / HILL_K)
    return [x, y, hillZ(r)] as V3
  })
  const rings: V3[][] = []
  for (let k = NR; k >= 0; k--) rings.push(ringAt(Math.sin(((k / NR) * Math.PI) / 2) * 0.999 + 0.001))
  rings[0] = rings[0].map(([x, y]) => [x, y, 0] as V3)
  hill.loft(rings)
  hill.cap(rings[rings.length - 1], true)
}

// --- The glazed entrance arch: a flush glass panel laid on the NW flank of the hill. ---
{
  const sC = -31, R = 11, H = 12
  /** The hill surface on the NW side at plan position y, height z (bisection on x). */
  const onHill = (y: number, z: number): V3 => {
    let lo = 0, hi = HILL_W
    for (let it = 0; it < 30; it++) {
      const m = (lo + hi) / 2
      if (hillZ(hillR(m, y)) > z) lo = m; else hi = m
    }
    // the surface normal points out and up; lift the glass 0.06 m off it
    const x = -lo, e = 0.05
    const gx = (hillZ(hillR(-x + e, y)) - hillZ(hillR(-x - e, y))) / (2 * e)
    const gy = (hillZ(hillR(-x, y + e)) - hillZ(hillR(-x, y - e))) / (2 * e)
    const n = unit3([gx, -gy, 1]) // d/dx of z at -x flips sign
    return [x + n[0] * 0.06, y + n[1] * 0.06, z + n[2] * 0.06]
  }
  const NA = 10, NRAD = 3
  const pt = (i: number, k: number): V3 => {
    const a = Math.PI - (i / NA) * Math.PI, f = k / NRAD
    return onHill(sC + R * f * Math.cos(a), 0.3 + (H - 0.3) * f * Math.sin(a))
  }
  for (let i = 0; i < NA; i++) for (let k = 0; k < NRAD; k++) {
    const a = pt(i, k), b = pt(i + 1, k), c = pt(i + 1, k + 1), d = pt(i, k + 1)
    // faces outwards (towards -x, the NW); wind accordingly
    if (k === 0) arch.tri(a, d, c)
    else { arch.tri(a, d, c); arch.tri(a, c, b) }
  }
}

const parts = [
  { part: steel, material: finish('stainless-steel', 0xd2d6d9, 0.35) },
  { part: strokes, material: { name: 'window', color: 0x56636e, roughness: 0.35 } },
  { part: hill, material: finish('grass-podium', 0x93ad78) },
  { part: arch, material: windowVariant(2, 0x8fa9b8) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Museum of the Future', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 77,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/1054289435'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/dubai-museum-of-the-future.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
