/**
 * The Exchange 106 (Menara Exchange 106, 2015-2019, Johnson Pilton Walker),
 * Tun Razak Exchange, Kuala Lumpur: procedural, CC0-1.0.
 * bun generators/kl-exchange-106.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/kl-exchange-106.glb, the low model;
 * - models/kl-exchange-106.detail.glb, drawn from zoom 16: the same with
 *   three-step corners instead of two, silver mullion ribs on the crown's
 *   diamonds, the sky-lobby notch under the frame, and the louvres.
 *
 * Map frame, turned to the tower: BEARING 63.4, so model +y points to
 * compass 63.4 (the NE face) and +x to 153.4 (the SE face). Origin: the area
 * centroid of the OSM outline way/503451214 (3.1418098 N, 101.7186900 E).
 * y = 0 is the tower's foot; elevation 0.
 *
 * Identity, in order: a tall, gently tapering deep-blue glass shaft on a
 * near-square plan with stepped (chamfered) corners; the crown, a narrower,
 * inward-leaning box of silver-white glass folded into rows of shallow
 * diamond pyramids (the "diagonal-cut" glass), whose folds make its corners
 * zigzag; the shoulders where the shaft's corners stop under the crown; the
 * tall silver frame on each face below the crown (two bars and a lintel
 * round the sky-lobby notch), lit white at night with the crown.
 *
 * Sources:
 *  - OSM (ODbL), fetched 2026-11-27 with tools/osm.py: the outline
 *    way/503451214 (building=office, The Exchange 106, height 453.6, 95
 *    levels, roof:shape quadruple_saltbox, wikidata Q27670200). Turned to
 *    63.4° (the axis fitted to its edges) it is a rectangle x ±34.7, y ±30.5
 *    with one chamfered corner. Its neighbours, the Porte Cochère Lobby
 *    (way/868626495) on the SW face and an unnamed round office annex
 *    (way/775440119) on the SE face, share only edges with it; they are
 *    separate low buildings and are neither drawn nor replaced.
 *  - Wikipedia "The Exchange 106" (read 2026-11): 453.6 m, 95 storeys,
 *    completed 2019; CTBUH: architectural height 453.6 m.
 *  - Photos (Wikimedia Commons), with the side each was taken from:
 *    * The_Exchange_106_20241022_-_full.jpg, Ahmad Ali Karim, CC0: from the
 *      WSW (~240°, elevated, ~1.8 km), almost square on to the SW face:
 *      measured against the 453.6 m top: widths 65 m at the foot, 58.5 m at
 *      ~200 m, 52 m at the crown's foot (~395 m); the crown 44 m wide at its
 *      foot and 37.5 m at the top; the frame bars ~332-395 m, 33 m apart;
 *      louvres at the corners at ~198 and ~368 m; the colours.
 *      https://commons.wikimedia.org/wiki/File:The_Exchange_106_20241022_-_full.jpg
 *    * The_Exchange_106_20241022_-_top.jpg, Ahmad Ali Karim, CC0: the crown
 *      close up: two diamonds across a face, about six rows, each diamond
 *      lit above and shaded below (pyramids), the zigzag corners, the
 *      rooftop box; the frame, lintel and notch; the stepped corners.
 *      https://commons.wikimedia.org/wiki/File:The_Exchange_106_20241022_-_top.jpg
 *    * The_Exchange_106_with_other_buildings.jpg, Ahmad Ali Karim, CC0: the
 *      tower in the TRX skyline. https://commons.wikimedia.org/wiki/File:The_Exchange_106_with_other_buildings.jpg
 *    * The_Exchange_106_20231216_(3).jpg, InterEdit88, CC0: from the foot,
 *      looking up a corner: the chamfered corners, the dark slots at the
 *      shoulders. https://commons.wikimedia.org/wiki/File:The_Exchange_106_20231216_(3).jpg
 *    * The_Exchange_106_Towers_at_night_(231211).jpg, angys*, CC BY-SA 4.0:
 *      night: the crown lit (purple that night), the frame bars and the
 *      shoulders lit white, the offices lit.
 *      https://commons.wikimedia.org/wiki/File:The_Exchange_106_Towers_at_night_(231211).jpg
 *    * The_Exchange_106_MyTown_Roof.jpg, Capt'n London, CC BY-SA 4.0: the
 *      shaft's proportions (under construction, from the east).
 *      https://commons.wikimedia.org/wiki/File:The_Exchange_106_MyTown_Roof.jpg
 *  - No lidar (outside the US). No Google, Apple, Bing or Mapbox imagery,
 *    Street View or 3D tiles were used. No look-only references.
 *
 * Numbers in the model:
 *  - Published: the top, 453.6 m (the rooftop box; the crown's parapet at
 *    451.5 m).
 *  - OSM: the axis (63.4°) and the foot's depth (y ±30.5).
 *  - From the photos: the foot's width (x ±32.8, between OSM's 34.7 and the
 *    photo's 65 m), the straight taper to 0.8 at 395 m, the crown (395-
 *    451.5 m, 0.85 then 0.72 of the shaft's foot), the frame, the louvres.
 *  - Estimated: the corner steps (2 x 2.6 m, three in the detail model);
 *    the diamonds' depth (1.5 m, bolder than real so they read); the frame
 *    bars 1.6 m wide, 0.8 m proud.
 *
 * Night: the crown is `neon-exchange-crown` (silver by day, glowing at
 *    night; its real colour changes); the frame bars and lintels are
 *    `neon-exchange-frame` (white); the shaft is `window` (lit offices).
 *
 * Doubts:
 *  - OSM's outline is 69 x 61 m, the photo reads ~65 m across the SW face;
 *    the plan is drawn 65.6 x 61 m.
 *  - The NE and SE faces were seen only obliquely; the frame is drawn on all
 *    four faces as the night photo shows it on two.
 *  - The crown's diamonds are drawn as simple pyramids; the real glass may
 *    fold differently.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]
const BEARING = 63.4
const A0 = 32.8, B0 = 30.5 // half-widths of the foot (x, y)
const SHAFT_TOP = 395, TAPER = 0.8
const CROWN_TOP = 451.5, TOP = 453.6
const CROWN_S0 = 0.68, CROWN_S1 = 0.58 // crown half-widths as a share of the foot's (44 and 37.5 m of 65)
const FRAME = { z0: 332, w: 1.6, proud: 0.8, half: 0.32 } // bars at ±0.32 of the face width
const LOUVRES = [198, 368]

type LOD = { detail: boolean; steps: number; rows: number; across: number; depth: number }
const LOW: LOD = { detail: false, steps: 2, rows: 6, across: 2, depth: 1.8 }
const DETAIL: LOD = { detail: true, steps: 3, rows: 6, across: 2, depth: 1.8 }

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const subv = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

/** A triangle wound to face away from `ref` (a point on the axis, or a direction when `dir`). */
function face(part: Part, a: V3, b: V3, c: V3, ref: V3 = [0, 0, 0], dirn = false) {
  const n = crs(subv(b, a), subv(c, a))
  const m = mul(add(add(a, b), c), 1 / 3)
  const o = dirn ? ref : subv(m, [ref[0], ref[1], m[2]])
  if (dot(n, o) >= 0) part.tri(a, b, c); else part.tri(a, c, b)
}
const up: V3 = [0, 0, 1]

/**
 * The shaft's plan at scale s: a rectangle whose corners are cut back in
 * `steps` square steps (the stepped chamfer), ccw from the +x,-y corner.
 */
function plan(s: number, steps: number): XY[] {
  const a = A0 * s, b = B0 * s, c = 5.2 * s, st = c / steps
  const out: XY[] = []
  // one corner, (+,+), traced from the +x face to the +y face, then mirrored
  const corner = (sx: number, sy: number) => {
    const pts: XY[] = []
    for (let k = 0; k <= steps; k++) {
      // a staircase from (a, b - c) to (a - c, b)
      const x = a - k * st, y = b - c + k * st
      if (k > 0) pts.push([x, y - st])
      pts.push([x, y])
    }
    return pts.map(([x, y]) => [x * sx, y * sy] as XY)
  }
  // ccw: (+,+) corner goes +x face → +y face; then (-,+) mirrored in x and reversed, etc.
  const pp = corner(1, 1)
  const mp = corner(-1, 1).reverse()
  const mm = corner(-1, -1)
  const pm = corner(1, -1).reverse()
  out.push(...pp, ...mp, ...mm, ...pm)
  return out
}

function build(lod: LOD) {
  const glass = new Part()
  const crown = new Part()
  const frame = new Part()
  const louvre = new Part()
  const roof = new Part()
  const notch = new Part()

  // --- The shaft: the plan lofted from the foot to the crown's foot, tapering.
  const P0 = plan(1, lod.steps), P1 = plan(TAPER, lod.steps)
  const n = P0.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a0: V3 = [P0[i][0], P0[i][1], 0], b0: V3 = [P0[j][0], P0[j][1], 0]
    const a1: V3 = [P1[i][0], P1[i][1], SHAFT_TOP], b1: V3 = [P1[j][0], P1[j][1], SHAFT_TOP]
    // wind outward: the stepped corners are re-entrant, so use the edge's own normal
    const en: V3 = [P0[j][1] - P0[i][1], -(P0[j][0] - P0[i][0]), 0]
    face(glass, a0, b0, b1, en, true); face(glass, a0, b1, a1, en, true)
  }
  const at = (s: number) => (z: number) => 1 - (1 - TAPER) * (z / SHAFT_TOP) * s
  const sAt = at(1)

  // --- The crown: four inward-leaning faces of diamond pyramids.
  const ca0 = A0 * CROWN_S0, cb0 = B0 * CROWN_S0, ca1 = A0 * CROWN_S1, cb1 = B0 * CROWN_S1
  // The crown's lowest half-row flares out to the shaft's corners (the
  // shoulders in the close photo); above it the faces lean in.
  const tf = 1 / (2 * lod.rows), fa = A0 * TAPER - 1.2, fb = B0 * TAPER - 1.2
  const cornersAt = (t: number): V3[] => {
    const z = SHAFT_TOP + (CROWN_TOP - SHAFT_TOP) * t
    const a = t < tf ? fa + (ca0 - fa) * (t / tf) : ca0 + (ca1 - ca0) * ((t - tf) / (1 - tf))
    const b = t < tf ? fb + (cb0 - fb) * (t / tf) : cb0 + (cb1 - cb0) * ((t - tf) / (1 - tf))
    return [[a, -b, z], [a, b, z], [-a, b, z], [-a, -b, z]] // ccw: +x face first
  }
  const N = lod.across, R = lod.rows
  const I = 2 * N, J = 2 * R
  const faceNormal = (f: number): V3 => {
    const c0 = cornersAt(tf), c1 = cornersAt(1)
    const a = c0[f], b = c0[(f + 1) % 4], a1 = c1[f]
    return unit(crs(subv(b, a), subv(a1, a)))
  }
  const cornerPush = (f: number): V3 => unit(add(faceNormal(f), faceNormal((f + 3) % 4))) // at the face's start corner
  const pt = (f: number, i: number, j: number): V3 => {
    const t = j / J, c = cornersAt(t)
    const p = lerp3(c[f], c[(f + 1) % 4], i / I)
    if ((i + j) % 2 === 1 && j > 0 && j < J) {
      // a diamond's centre, pushed out
      const push = i === 0 ? mul(cornerPush(f), lod.depth * 1.3) : i === I ? mul(cornerPush((f + 1) % 4), lod.depth * 1.3) : mul(faceNormal(f), lod.depth)
      return add(p, push)
    }
    return p
  }
  const ribs: [V3, V3][] = []
  for (let f = 0; f < 4; f++) {
    const nrm = faceNormal(f)
    for (let i = 0; i <= I; i++) for (let j = 0; j <= J; j++) {
      if ((i + j) % 2 === 0) continue
      const c = pt(f, i, j)
      const nb = { N: [i, j + 1], E: [i + 1, j], S: [i, j - 1], W: [i - 1, j] } as Record<string, number[]>
      for (const [p, q] of [['N', 'E'], ['E', 'S'], ['S', 'W'], ['W', 'N']]) {
        const [pi, pj] = nb[p], [qi, qj] = nb[q]
        if (pi < 0 || qi < 0 || pi > I || qi > I || pj < 0 || qj < 0 || pj > J || qj > J) continue
        face(crown, c, pt(f, pi, pj), pt(f, qi, qj), nrm, true)
      }
      for (const k of ['N', 'E']) {
        const [pi, pj] = nb[k]
        if (pi >= 0 && pi <= I && pj >= 0 && pj <= J) ribs.push([pt(f, pi, pj), c])
      }
      for (const k of ['S', 'W']) {
        const [pi, pj] = nb[k]
        if (pi >= 0 && pi <= I && pj >= 0 && pj <= J) ribs.push([pt(f, pi, pj), c])
      }
    }
  }
  // The crown's roof and the rooftop box.
  const ct = cornersAt(1)
  face(roof, ct[0], ct[1], ct[2], up, true); face(roof, ct[0], ct[2], ct[3], up, true)
  const box = (part: Part, cx: number, cy: number, hx: number, hy: number, z0: number, z1: number) => {
    const r: V3[] = [[cx + hx, cy - hy, z0], [cx + hx, cy + hy, z0], [cx - hx, cy + hy, z0], [cx - hx, cy - hy, z0]]
    const c: V3 = [cx, cy, 0]
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4], a1: V3 = [a[0], a[1], z1], b1: V3 = [b[0], b[1], z1]
      face(part, a, b, b1, c); face(part, a, b1, a1, c)
    }
    const t = r.map((p) => [p[0], p[1], z1] as V3)
    face(part, t[0], t[1], t[2], up, true); face(part, t[0], t[2], t[3], up, true)
  }
  box(roof, 0, 0, ca1 * 0.62, cb1 * 0.62, CROWN_TOP - 0.2, TOP)

  // The shoulders: the shaft's top, round the crown's foot.
  const c0 = cornersAt(0)
  // fan from each shaft-top vertex to the nearest crown corner; a ring of quads
  {
    const z = SHAFT_TOP
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const a: V3 = [P1[i][0], P1[i][1], z], b: V3 = [P1[j][0], P1[j][1], z]
      // the crown corner whose quadrant holds the edge's midpoint
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
      const ang = Math.atan2(my / B0, mx / A0)
      // map the angle to the crown outline point on the same ray
      const k = Math.min(ca0 / Math.abs(Math.cos(ang) * A0 || 1e-9), cb0 / Math.abs(Math.sin(ang) * B0 || 1e-9))
      const ray = (p: V3): V3 => {
        const t = Math.min(fa / Math.max(1e-9, Math.abs(p[0])), fb / Math.max(1e-9, Math.abs(p[1])))
        return [p[0] * t, p[1] * t, z]
      }
      void k
      face(roof, a, b, ray(b), up, true); face(roof, a, ray(b), ray(a), up, true)
    }
    void c0
  }

  // --- The frame on each face: two bars and a lintel, from FRAME.z0 to the crown.
  const faceAt = (f: number, z: number) => {
    // the shaft's face f (0 +x, 1 +y, 2 -x, 3 -y) at height z: centre, along, out, half-width
    const s = sAt(z), a = A0 * s, b = B0 * s
    const out: V3 = [[1, 0, 0], [0, 1, 0], [-1, 0, 0], [0, -1, 0]][f] as V3
    const along: V3 = [[0, 1, 0], [-1, 0, 0], [0, -1, 0], [1, 0, 0]][f] as V3
    const half = f % 2 === 0 ? b : a
    const c: V3 = mul(out, f % 2 === 0 ? a : b)
    return { c: [c[0], c[1], z] as V3, along, out, half }
  }
  const slab = (part: Part, f: number, u0: number, u1: number, z0: number, z1: number, proud: number) => {
    // a strip on face f between along-offsets u0..u1 (metres), z0..z1, standing proud
    const q = (u: number, z: number, o: number): V3 => {
      const F = faceAt(f, z)
      return add(add(F.c, mul(F.along, u)), mul(F.out, o))
    }
    const A = q(u0, z0, 0), B = q(u1, z0, 0), C = q(u1, z1, 0), D = q(u0, z1, 0)
    const A1 = q(u0, z0, proud), B1 = q(u1, z0, proud), C1 = q(u1, z1, proud), D1 = q(u0, z1, proud)
    const o = faceAt(f, (z0 + z1) / 2).out
    face(part, A1, B1, C1, o, true); face(part, A1, C1, D1, o, true) // front
    const al = faceAt(f, z0).along
    face(part, B, C, C1, al, true); face(part, B, C1, B1, al, true) // right side
    face(part, A, D1, D, mul(al, -1), true); face(part, A, A1, D1, mul(al, -1), true) // left side
    face(part, D, D1, C1, up, true); face(part, D, C1, C, up, true) // top
    face(part, A, B1, A1, [0, 0, -1], true); face(part, A, B, B1, [0, 0, -1], true) // bottom
  }
  for (let f = 0; f < 4; f++) {
    const hz = faceAt(f, SHAFT_TOP).half
    const u = FRAME.half * 2 * hz
    for (const sgn of [-1, 1]) slab(frame, f, sgn * u - FRAME.w / 2, sgn * u + FRAME.w / 2, FRAME.z0, SHAFT_TOP, FRAME.proud)
    slab(frame, f, -u - FRAME.w / 2, u + FRAME.w / 2, SHAFT_TOP - 1.6, SHAFT_TOP, FRAME.proud)
    if (lod.detail) {
      // the sky-lobby notch: a dark recess under the lintel
      slab(notch, f, -u + FRAME.w / 2, u - FRAME.w / 2, SHAFT_TOP - 8, SHAFT_TOP - 1.6, 0.06)
    }
    // the louvres at the corners: dark panels on the side bays
    for (const z of LOUVRES) {
      const h = faceAt(f, z).half
      for (const sgn of [-1, 1]) {
        const u0 = sgn * (h - 5.2 * sAt(z)), u1 = sgn * (h - 5.2 * sAt(z) - (lod.detail ? 9 : 8))
        slab(louvre, f, Math.min(u0, u1), Math.max(u0, u1), z, z + (lod.detail ? 4.5 : 4), 0.12)
      }
    }
  }

  // The crown's mullion ribs on the diamonds' edges (detail only).
  if (lod.detail) {
    for (const [a, b] of ribs) {
      const e = unit(subv(b, a))
      const m = mul(add(a, b), 0.5)
      const o = unit([m[0], m[1], 0])
      const side = unit(crs(e, o))
      const w = 0.18, h = 0.15
      const A: V3 = add(add(a, mul(side, w)), mul(o, h)), B: V3 = add(add(b, mul(side, w)), mul(o, h))
      const A2: V3 = add(add(a, mul(side, -w)), mul(o, h)), B2: V3 = add(add(b, mul(side, -w)), mul(o, h))
      face(frame, A, B, B2, o, true); face(frame, A, B2, A2, o, true)
    }
  }

  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: glass, material: { ...PALETTE.window, color: 0x3f73a3 } },
    { part: crown, material: finish('neon-exchange-crown', 0xc6d2dc, 0.3) },
    { part: frame, material: finish('neon-exchange-frame', 0xa9b4bd, 0.5) },
    { part: louvre, material: finish('exchange-louvre', 0x5e6e7e, 0.6) },
    { part: roof, material: PALETTE.roof },
  ]
  if (notch.triangles) parts.push({ part: notch, material: windowVariant(2, 0x56677a) })
  return parts
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  const summary = parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(', ')
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles} (${summary})`)
  const glb = writeGlb('The Exchange 106', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: BEARING, elevation: 0, height: TOP,
  })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles (${summary}), ${glb.length} bytes`)
}

if (import.meta.main) {
  await write('kl-exchange-106.glb', build(LOW), 6500, 250_000)
  await write('kl-exchange-106.detail.glb', build(DETAIL), 40_000, 1536 * 1024)
}
