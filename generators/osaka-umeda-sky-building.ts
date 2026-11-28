/**
 * Umeda Sky Building (梅田スカイビル), Kita-ku, Osaka: procedural, CC0-1.0.
 * bun generators/osaka-umeda-sky-building.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/osaka-umeda-sky-building.glb, the low model;
 * - models/osaka-umeda-sky-building.detail.glb, drawn from zoom 16: the same
 *   massing with the escalator tubes, the elevator shafts and the 22nd-floor
 *   bridge as open 3D trusses at full density.
 *
 * This file also exports the small kit the other osaka- models of this batch
 * (HEP Five, Gate Tower Building, Osaka Station) build with: boxes, beams,
 * lattice shafts, Warren trusses, annular plates and a GLB writer for a
 * low/detail pair. Its own build runs only under `import.meta.main`.
 *
 * Map frame: x east, y north, z up, metres. Built square to the building, its
 * long axis (the two towers) along x; the placement's bearing (3.7) turns it
 * to OSM's outline, whose long sides run at 93.7 degrees. The origin is the
 * centre of the Floating Garden's ring (OSM way/252708905), which is also the
 * centre of the outline; y = 0 is the ground (flat: Umeda is on reclaimed
 * delta ground, 1-3 m above sea level).
 *
 * Hiroshi Hara / Atelier Phi, 1993. Two 40-storey towers joined at the top by
 * the Floating Garden Observatory (空中庭園展望台, 39F-40F and the open
 * rooftop "Sky Walk"), lifted into place whole from the ground (lift-up
 * construction). Visitors ride a lift to 35F and cross the void in glass
 * escalator tubes that rise through the ring into the observatory. A steel
 * bridge joins the towers at 22F.
 *
 * OSM (relation/3389505, multipolygon, height=173, 40 levels):
 * - outer way/252485322 and the ring way/252708905 (r 18.3 m, measured);
 * - parts: east tower way/252485324 (40 lv), way/252708902 (39), way/252708904
 *   (38); west tower way/252708901 (39), way/252708903 (38); the deck
 *   way/588689730 and way/649098944 (levels 39-40);
 * - in this frame: towers 28 m wide (x) by 54.5 m deep (y), west tower
 *   x -54.2..-26.5, east tower x 26.3..54.5, so the void is 52.6 m wide;
 *   y -26.9..27.6; the deck's south face projects 1 m between x -17.8 and
 *   18.4. All measured from the OSM outline (GSI KIBAN tracing).
 *
 * Published: 173 m to the roof (OSM, CTBUH; ja.wikipedia gives 175.3 m to
 * the highest point and 168.7 m for the deck); 40 floors above ground;
 * Floating Garden on 39F-40F and the roof; the 22F connecting bridge
 * (ja.wikipedia "梅田スカイビル"); escalator from 35F to 39F (operator).
 *
 * Estimated from photos (scaled to the 173 m height and the 52.6 m void):
 * - storey height 4.3 m (173 / 40);
 * - the towers' outer thirds top out lower than OSM's level tags say: the
 *   outer third ~152 m, the middle ~163 m, the inner third at the deck's
 *   173 m (Sakai Yayoi, Kakidai, dllu: the crown steps up toward the deck);
 *   the scalloped "cloud" parapets on the outer steps (semicircles ~4.4 m);
 * - the white crown from ~142 m up, with a row of windows;
 * - the deck 152-173 m (Kakidai: its face is ~19 m deep), a band of
 *   windows at 165-169 m and of portholes at 159-162 m on both faces;
 * - the ring opening: ~29 m across on the deck's underside (0.55 of the
 *   void in Falbisoner's and Syced's views from below), widening to OSM's
 *   36.6 m at the roof; glazed inside;
 * - four struts under the deck at each tower (Falbisoner, Sakai);
 * - the hanging lobby block under the deck's west half
 *   (x -26.5..8, 116-128 m; Kakidai shows it ~25-50 m below the deck's top) and the two escalator tubes: from it to the
 *   ring's far side, rising ~29 m (Kakidai; the operator says 35F to 39F),
 *   drawn 4.4 m wide and 5.2 m tall so they read at phone size along a line ~34 degrees off
 *   the long axis in plan (Falbisoner's straight-up view);
 * - two lattice elevator shafts, ~7 m square, from the ground to the
 *   lobby block, and a stair lattice beside the east tower from the ground to
 *   the 22F bridge (Kakidai, Sakai); their positions across the depth are
 *   not photographed and are invented (near the centre line);
 * - the 22F bridge at ~88 m, 5 m wide, a Warren truss 6 m deep with a
 *   cambered top chord over its east half (Kakidai, Sakai);
 * - white stepped bands on the inner ends of the north and south faces
 *   (Sakai, Kakidai), and the slot with four portholes at ~85-94 m at the
 *   north end of the east tower's east face (dllu, Sakai, 加茂川の民).
 * - colours: the curtain walls are mirror glass that reads sky blue in sun
 *   and blue-grey under cloud (#4f6f9e to #9db0c4 in the photos), drawn
 *   #5f80b4 (deep reflective blue, lifted a little from the photos' #3e5f97
 *   in sun), with pale silver mullion and floor lines; the white aluminium panels #dcdfe3 to #eef0f2, drawn #e4e7ea;
 *   the steel of the tubes, shafts and bridge dark grey (#3d434b-#6a7079),
 *   drawn #5b626c.
 * Invented: the west tower's west face (no photo from the west; kept plain,
 *   without the east face's porthole slot); the rooftop plant blocks.
 * Left out: the podium and the neighbouring Garden Five/Six (separate OSM
 *   buildings), rooftop cranes and antennas, the glass lifts' cars.
 * Terrain: see the report; elevation 0.
 *
 * Night: the curtain walls are `window` and glow; the deck's window and
 * porthole bands are `window-2`; the tubes and the ring's glazing are
 * `glass` and stay dark (the real ring is ringed by blue LEDs, left out).
 *
 * Photos (Wikimedia Commons, evidence):
 * - "2018 Umeda Sky Building.jpg", Kakidai, CC BY-SA 4.0 (void face, from the south)
 * - "Umeda Sky Building 2026.jpg", Sakai Yayoi, CC0 (south and east faces)
 * - "Umeda Sky Building from Umekita Park Osaka 16 June 2026 dllu.jpg", Daniel Lu, CC BY-SA 4.0 (east and south faces)
 * - "梅田スカイビル.jpg", 加茂川の民, CC0 (from the south-east, above)
 * - "Shin-Umeda-City-01.jpg", J o, CC BY-SA 3.0 (from the south-east, above)
 * - "Umeda Sky Building, Osaka, November 2016 -01.jpg", Martin Falbisoner, CC BY-SA 4.0 (deck from below)
 * - "Umeda Sky Building, Osaka, November 2016 -02.jpg", Martin Falbisoner, CC BY-SA 4.0 (escalator tube inside)
 * - "Umeda Sky Buildng.jpg", Syced, CC0 (void from below)
 * - "Umeda Sky Building seen from Lucua 202508.jpg", 掬茶, CC BY-SA 4.0 (from the south-east)
 * - "Umeda Sky Building (54206773779).jpg", Kanesue, CC BY 2.0 (from the east)
 * - "梅田スカイビル空中庭園展望台 - panoramio (8).jpg", kanesue, CC BY 3.0 (tubes from above, in the ring)
 * Look-only: none.
 */
import { Part, cross, sub, writeGlb, type GlbOptions, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

// ---------------------------------------------------------------------------
// Kit, shared by the osaka- models of this batch.

export const TAU = Math.PI * 2
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1))
export type XY = [number, number]
export type Mat = { part: Part; material: MaterialSpec }

/** A flat triangle wound to face `n`. */
export function ftri(p: Part, a: V3, b: V3, c: V3, n: V3) {
  const N = unit(n)
  p.tri(a, b, c, undefined, undefined, undefined, [N, N, N])
}
/** A flat quad wound to face `n`. */
export function fquad(p: Part, a: V3, b: V3, c: V3, d: V3, n?: V3) {
  const N = n ?? cross(sub(b, a), sub(c, a))
  ftri(p, a, b, c, N)
  ftri(p, a, c, d, N)
}

/** An axis-aligned box; `faces` picks the sides drawn (default all but the bottom). */
export function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, o: { bottom?: boolean; top?: boolean; bevel?: number; sides?: string } = {}) {
  const sides = o.sides ?? 'nesw', b = o.bevel ?? 0
  const zt = z1 - b
  const r0: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const r1: V3[] = [[x0, y0, zt], [x1, y0, zt], [x1, y1, zt], [x0, y1, zt]]
  const r2: V3[] = b > 0 ? [[x0 + b, y0 + b, z1], [x1 - b, y0 + b, z1], [x1 - b, y1 - b, z1], [x0 + b, y1 - b, z1]] : r1
  const key = ['s', 'e', 'n', 'w']
  const outN: V3[] = [[0, -1, 0], [1, 0, 0], [0, 1, 0], [-1, 0, 0]]
  for (let i = 0; i < 4; i++) {
    if (!sides.includes(key[i])) continue
    const j = (i + 1) % 4
    fquad(p, r0[i], r0[j], r1[j], r1[i], outN[i])
    if (b > 0) fquad(p, r1[i], r1[j], r2[j], r2[i], add(outN[i], [0, 0, 1]))
  }
  if (o.top !== false) fquad(p, r2[0], r2[1], r2[2], r2[3], [0, 0, 1])
  if (o.bottom) fquad(p, r0[3], r0[2], r0[1], r0[0], [0, 0, -1])
}

/** A square-section member from A to B, `w` wide and `h` deep, faces turned to `up`. */
export function beam(p: Part, A: V3, B: V3, w: number, h = w, up: V3 = [0, 0, 1], caps = false) {
  const d = unit(sub(B, A))
  let u = cross(d, up)
  if (Math.hypot(...u) < 1e-3) u = cross(d, [1, 0, 0])
  u = mul(unit(u), w / 2)
  const v = mul(unit(cross(u, d)), h / 2)
  const ring = (c: V3): V3[] => [add(add(c, u), v), add(sub(c, u), v), sub(sub(c, u), v), sub(add(c, u), v)]
  const a = ring(A), b = ring(B)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    fquad(p, a[i], a[j], b[j], b[i], add(sub(a[i], A), sub(a[j], A)))
  }
  if (caps) {
    fquad(p, a[3], a[2], a[1], a[0], mul(d, -1))
    fquad(p, b[0], b[1], b[2], b[3], d)
  }
}

/** A round member (n-gon tube), smooth-shaded, from A to B. */
export function rod(p: Part, A: V3, B: V3, r: number, n = 6) {
  const d = unit(sub(B, A))
  let u = cross(d, [0, 0, 1])
  if (Math.hypot(...u) < 1e-3) u = cross(d, [1, 0, 0])
  u = unit(u)
  const v = unit(cross(u, d))
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * TAU, a1 = ((i + 1) / n) * TAU
    const N0 = add(mul(u, Math.cos(a0)), mul(v, Math.sin(a0))), N1 = add(mul(u, Math.cos(a1)), mul(v, Math.sin(a1)))
    const P = (c: V3, N: V3) => add(c, mul(N, r))
    p.tri(P(A, N0), P(A, N1), P(B, N1), undefined, undefined, undefined, [N0, N1, N1])
    p.tri(P(A, N0), P(B, N1), P(B, N0), undefined, undefined, undefined, [N0, N1, N0])
  }
}

/**
 * A square lattice shaft: four corner posts from z0 to z1, a ring of beams
 * every `bay` metres, and diagonals in each face (X-bracing when `x`).
 */
export function latticeShaft(p: Part, cx: number, cy: number, half: number, z0: number, z1: number, o: { bay: number; post: number; member: number; x?: boolean; every?: number }) {
  const c: XY[] = [[cx - half, cy - half], [cx + half, cy - half], [cx + half, cy + half], [cx - half, cy + half]]
  for (const [x, y] of c) beam(p, [x, y, z0], [x, y, z1], o.post)
  z0 += o.member / 2
  const n = Math.max(1, Math.round((z1 - z0) / o.bay)), dz = (z1 - z0) / n
  for (let k = 0; k <= n; k++) {
    const z = z0 + k * dz
    for (let i = 0; i < 4; i++) {
      const a = c[i], b = c[(i + 1) % 4]
      beam(p, [a[0], a[1], z], [b[0], b[1], z], o.member)
    }
  }
  const every = o.every ?? 1
  for (let k = 0; k < n; k++) {
    if (k % every) continue
    const za = z0 + k * dz, zb = za + dz * every > z1 ? z1 : za + dz * Math.min(every, n - k)
    for (let i = 0; i < 4; i++) {
      const a = c[i], b = c[(i + 1) % 4]
      const flip = (k / every + i) % 2 === 0
      const A: V3 = flip ? [a[0], a[1], za] : [b[0], b[1], za], B: V3 = flip ? [b[0], b[1], zb] : [a[0], a[1], zb]
      beam(p, A, B, o.member * 0.8)
      if (o.x) beam(p, [A[0], A[1], zb], [B[0], B[1], za], o.member * 0.8)
    }
  }
}

/**
 * A planar Warren truss between two chord polylines sampled by `at(t)` (top)
 * and `bt(t)` (bottom), t in 0..1, with n panels.
 */
export function warren(p: Part, top: (t: number) => V3, bot: (t: number) => V3, n: number, chord: number, web: number, verticals = false) {
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = (i + 1) / n, tm = (i + 0.5) / n
    beam(p, top(t0), top(t1), chord)
    beam(p, bot(t0), bot(t1), chord)
    beam(p, bot(t0), top(tm), web)
    beam(p, top(tm), bot(t1), web)
    if (verticals) beam(p, bot(t0), top(t0), web)
  }
  if (verticals) beam(p, bot(1), top(1), web)
}

/** A polygon ring of n points round (cx, cy). */
export const circle = (cx: number, cy: number, r: number, n = 16, a0 = 0): XY[] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos(a0 + (i / n) * TAU), cy + r * Math.sin(a0 + (i / n) * TAU)] as XY)

/**
 * A flat plate at height z between a convex outer ring and a round hole of
 * radius r (centre cx, cy), facing up or down. The hole's points are taken
 * at the same angles as the outer ring's, so the outer ring should be dense
 * enough (corners plus intermediate points) for a round hole.
 */
export function annulus(p: Part, outer: XY[], cx: number, cy: number, r: number, z: number, up: boolean) {
  const n = outer.length
  const hole = outer.map(([x, y]) => {
    const a = Math.atan2(y - cy, x - cx)
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as XY
  })
  const N: V3 = [0, 0, up ? 1 : -1]
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    fquad(p, [hole[i][0], hole[i][1], z], [outer[i][0], outer[i][1], z], [outer[j][0], outer[j][1], z], [hole[j][0], hole[j][1], z], N)
  }
}

/** A rectangle's boundary sampled at the angles of an n-gon round (cx, cy), corners included, counter-clockwise. */
export function rectRing(x0: number, y0: number, x1: number, y1: number, cx: number, cy: number, n: number): XY[] {
  const angles: number[] = Array.from({ length: n }, (_, i) => (i / n) * TAU - Math.PI)
  for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]) angles.push(Math.atan2(y - cy, x - cx))
  angles.sort((a, b) => a - b)
  return angles.map((a) => {
    const dx = Math.cos(a), dy = Math.sin(a)
    const ts = [dx > 1e-9 ? (x1 - cx) / dx : Infinity, dx < -1e-9 ? (x0 - cx) / dx : Infinity, dy > 1e-9 ? (y1 - cy) / dy : Infinity, dy < -1e-9 ? (y0 - cy) / dy : Infinity]
    const t = Math.min(...ts)
    return [cx + dx * t, cy + dy * t] as XY
  })
}

/** A disc (n-gon) in a vertical plane, flush on a wall: centre c, normal `out`, radius r. */
export function wallDisc(p: Part, c: V3, out: V3, r: number, n = 12) {
  const o = unit(out)
  let u = cross([0, 0, 1], o)
  if (Math.hypot(...u) < 1e-3) u = [1, 0, 0]
  u = unit(u)
  const v: V3 = [0, 0, 1]
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * TAU, a1 = ((i + 1) / n) * TAU
    const P = (a: number) => add(c, add(mul(u, r * Math.cos(a)), mul(v, r * Math.sin(a))))
    ftri(p, c, P(a0), P(a1), o)
  }
}

/** Write a low/detail pair, checking each against its budget (moving nodes counted once per node). */
export async function writeLods(id: string, name: string, extras: Record<string, unknown>, lods: Array<{ file: string; parts: Mat[]; maxTris: number; maxBytes: number; options?: GlbOptions }>) {
  for (const { file, parts, maxTris, maxBytes, options } of lods) {
    const used = parts.filter((x) => x.part.triangles > 0)
    const all = [...used, ...(options?.nodes ?? []).flatMap((n) => n.parts)]
    const names = new Set(all.filter((x) => x.part.triangles > 0).map((x) => x.material.name))
    if (names.size > 6) throw new Error(`${file}: ${names.size} materials`)
    const triangles = all.reduce((t, { part }) => t + part.triangles, 0)
    const per = new Map<string, number>()
    for (const x of all) per.set(x.material.name, (per.get(x.material.name) ?? 0) + x.part.triangles)
    console.log(file, [...per].map(([k, v]) => `${k}:${v}`).join(' '))
    if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
    const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', ...extras }, options)
    if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
    const out = new URL(`../models/${file}`, import.meta.url).pathname
    await Bun.write(out, glb)
    console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
  }
}

// ---------------------------------------------------------------------------
// Umeda Sky Building

const H = 173 // roof of the deck and the towers' inner thirds
const ST = 173 / 40 // storey height
const Y0 = -26.9, Y1 = 27.6 // tower depth
const TI = 26.4, TO = 54.4 // tower inner and outer faces, |x|
const AX = 17.9 // the annexes' void faces below ~120 m, |x|
const DECK0 = 152 // deck underside
const CROWN = 142 // white crown from here up
const RING_TOP = 18.3, RING_BOT = 14.5

function build(detail: boolean): Mat[] {
  const glassWall = new Part() // curtain walls (window)
  const white = new Part() // white aluminium
  const steel = new Part() // tubes, shafts, bridge
  const tube = new Part() // glazing of the escalator tubes and the ring
  const roof = new Part()
  const win = new Part() // punched windows, portholes, deck bands

  // Towers: mirrored about x = 0. s = +1 east tower, -1 west tower.
  for (const s of [1, -1]) {
    const X = (x: number) => s * x
    const xs = (a: number, b: number): [number, number] => (s > 0 ? [a, b] : [-b, -a])
    // Steps of the crown: inner third to the deck's roof, then down outwards.
    const steps: Array<[number, number, number]> = [[TI, 34.6, H], [34.6, 44.5, 163], [44.5, TO, 152]]
    // Glass body to the crown.
    {
      const [x0, x1] = xs(TI, TO)
      box(glassWall, x0, Y0, x1, Y1, 0, CROWN, { top: false })
    }
    for (const [a, b, top] of steps) {
      const [x0, x1] = xs(a, b)
      // The inner third's crown under the deck is hidden by it; the walls
      // facing the void stop at the deck's underside.
      const sides = a === 44.5 ? (s > 0 ? 'nes' : 'nsw') : 'ns'
      box(white, x0, Y0, x1, Y1, CROWN, top, { bevel: 0.5, sides, top: false })
      box(roof, x0 + 0.6, Y0 + 0.6, x1 - 0.6, Y1 - 0.6, top - 0.9, top - 0.89, { sides: '' })
      // parapet lip
      for (const [p0, p1] of [[[x0, Y0], [x1, Y0 + 0.6]], [[x0, Y1 - 0.6], [x1, Y1]], [[x0, Y0], [x0 + 0.6, Y1]], [[x1 - 0.6, Y0], [x1, Y1]]] as [XY, XY][])
        box(white, p0[0], p0[1], p1[0], p1[1], top - 0.9, top, { sides: '' })
    }
    // Inner-third wall facing the void, from the crown up to the deck.
    {
      const x = X(TI)
      fquad(white, [x, Y0, CROWN], [x, Y1, CROWN], [x, Y1, DECK0], [x, Y0, DECK0], [-s, 0, 0])
    }
    // Step risers between the stepped tops (the walls between thirds).
    for (const [xa, za, zb] of [[34.6, 163, H], [44.5, 152, 163]] as [number, number, number][]) {
      const x = X(xa)
      fquad(white, [x, Y0, za], [x, Y1, za], [x, Y1, zb], [x, Y0, zb], [s, 0, 0])
    }

    // Crown window row on every outer face of the crown.
    const rowsZ: Array<[number, number]> = [[145.5, 148.5]]
    for (const [a, b, top] of steps) {
      const [x0, x1] = xs(a, b)
      const zr: Array<[number, number]> = [...rowsZ]
      if (top > 158) zr.push([155, 158])
      if (top > 168) zr.push([164.5, 167.5])
      for (const [z0, z1] of zr) {
        if (z1 > top - 2) continue
        for (const [y, ny] of [[Y0 - 0.05, -1], [Y1 + 0.05, 1]] as [number, number][]) {
          const w = x1 - x0, k = Math.max(1, Math.round(w / 4.2)), bw = w / k
          for (let i = 0; i < k; i++) {
            const u0 = x0 + i * bw + 0.7, u1 = x0 + (i + 1) * bw - 0.7
            const P = ny < 0 ? ([[u0, y, z0], [u1, y, z0], [u1, y, z1], [u0, y, z1]] as V3[]) : ([[u1, y, z0], [u0, y, z0], [u0, y, z1], [u1, y, z1]] as V3[])
            fquad(win, P[0], P[1], P[2], P[3], [0, ny, 0])
          }
        }
      }
    }
    // Outer face crown windows (the east face of the east tower, the west of the west).
    {
      const x = X(TO) + s * 0.05
      for (const [z0, z1] of rowsZ) {
        const k = 12, bw = (Y1 - Y0) / k
        for (let i = 0; i < k; i++) {
          const y0 = Y0 + i * bw + 0.8, y1 = Y0 + (i + 1) * bw - 0.8
          const P: V3[] = s > 0 ? [[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]] : [[x, y1, z0], [x, y0, z0], [x, y0, z1], [x, y1, z1]]
          fquad(win, P[0], P[1], P[2], P[3], [s, 0, 0])
        }
      }
    }

    // Scalloped "cloud" parapets on the two outer steps, along the north
    // and south edges and the outer face: half-discs standing on the lip.
    const scallop = (c: V3, along: V3, r: number, t: number) => {
      const n = detail ? 10 : 5
      const nrm = unit(cross(along, [0, 0, 1]))
      for (const side of [1, -1]) {
        const off = mul(nrm, (side * t) / 2)
        for (let i = 0; i < n; i++) {
          const a0 = (i / n) * Math.PI, a1 = ((i + 1) / n) * Math.PI
          const P = (a: number) => add(add(c, off), add(mul(along, r * Math.cos(a)), [0, 0, r * Math.sin(a)]))
          ftri(white, add(c, off), P(a0), P(a1), mul(nrm, side))
        }
      }
      for (let i = 0; i < n; i++) {
        const a0 = (i / n) * Math.PI, a1 = ((i + 1) / n) * Math.PI
        const P = (a: number, side: number) => add(add(c, mul(nrm, (side * t) / 2)), add(mul(along, r * Math.cos(a)), [0, 0, r * Math.sin(a)]))
        const am = (a0 + a1) / 2
        fquad(white, P(a0, 1), P(a0, -1), P(a1, -1), P(a1, 1), add(mul(along, Math.cos(am)), [0, 0, Math.sin(am)]))
      }
    }
    for (const [a, b, top] of steps.slice(1)) {
      const [x0, x1] = xs(a, b)
      const nb = 2, w = (x1 - x0) / nb
      for (let i = 0; i < nb; i++) {
        const cx = x0 + (i + 0.5) * w
        scallop([cx, Y0 + 0.4, top], [1, 0, 0], w / 2 - 0.3, 0.8)
        scallop([cx, Y1 - 0.4, top], [1, 0, 0], w / 2 - 0.3, 0.8)
      }
    }
    {
      const x = X(TO) - s * 0.4, nb = 6, w = (Y1 - Y0) / nb
      for (let i = 0; i < nb; i++) scallop([x, Y0 + (i + 0.5) * w, 152], [0, 1, 0], w / 2 - 0.3, 0.8)
    }
    // Rooftop plant blocks on the middle step (estimated).
    {
      const [x0, x1] = xs(36, 43)
      box(white, x0, -12, x1, 8, 163 - 0.9, 168, { bevel: 0.4 })
    }

    // The inner annexes: below the deck the towers reach ~8.5 m further into
    // the void (Kakidai: the gap at mid-height is ~2/3 of the deck's span),
    // in two white steps clad on the void side in glass, carrying grouped
    // windows on their north and south faces (Sakai, Kakidai, Syced).
    const annex: Array<[number, number, number]> = [[AX, AX + 4.2, 95], [AX + 4.2, TI, 120]]
    for (const [a, b, top] of annex) {
      const [x0, x1] = xs(a, b)
      box(glassWall, x0, Y0, x1, Y1, 0, top, { sides: a === AX ? (s > 0 ? 'nsw' : 'nse') : 'ns', top: false })
      box(white, x0, Y0, x1, Y1, top - 1.2, top, { sides: a === AX ? (s > 0 ? 'nsw' : 'nse') : 'ns', bevel: 0.4 })
    }
    {
      const x = X(AX + 4.2)
      fquad(glassWall, [x, Y0, 95], [x, Y1, 95], [x, Y1, 120], [x, Y0, 120], [-s, 0, 0])
    }
    // White columns on the annex's north and south faces at its inner edge,
    // to 95 m and 120 m, with a column of two-storey windows (Kakidai, Sakai).
    for (const [a, b, top] of [[AX - 0.5, AX + 3.6, 95], [AX + 3.6, AX + 7.2, 120]] as [number, number, number][]) {
      const [x0, x1] = xs(a, b)
      for (const [y, ny] of [[Y0, -1], [Y1, 1]] as [number, number][]) {
        const yo = y + ny * 0.5
        box(white, x0, Math.min(y, yo), x1, Math.max(y, yo), 0, top, { sides: ny < 0 ? 'sew' : 'new', bevel: 0.3 })
        const ww = (x1 - x0) * 0.5, cx = (x0 + x1) / 2, yy = yo + ny * 0.05
        for (let z = 8.6; z + 2 * ST <= top - 1.5; z += 2 * ST) {
          const z0 = z + 0.9, z1 = z + 2 * ST - 0.9
          const P: V3[] = ny < 0 ? [[cx - ww / 2, yy, z0], [cx + ww / 2, yy, z0], [cx + ww / 2, yy, z1], [cx - ww / 2, yy, z1]] : [[cx + ww / 2, yy, z0], [cx - ww / 2, yy, z0], [cx - ww / 2, yy, z1], [cx + ww / 2, yy, z1]]
          fquad(win, P[0], P[1], P[2], P[3], [0, ny, 0])
        }
      }
      // and down the void face's edge
    }
    // A white strip down the middle of each annex's void face.
    {
      const x = X(AX) - s * 0.4
      const [xa, xb] = s > 0 ? [x, X(AX)] : [X(AX), x]
      box(white, xa, -3, xb, 3, 0, 95, { sides: s > 0 ? 'nsw' : 'nse', bevel: 0.3 })
    }
    // A white band on the tower's own north and south faces beside the
    // annex, to ~60 m (the lowest step of the white columns in the photos).
    {
      const [x0, x1] = xs(TI, TI + 5.5)
      for (const [y, ny] of [[Y0, -1], [Y1, 1]] as [number, number][]) {
        const yo = y + ny * 0.5
        box(white, x0, Math.min(y, yo), x1, Math.max(y, yo), 0, 60, { sides: ny < 0 ? 's' + (s > 0 ? 'e' : 'w') : 'n' + (s > 0 ? 'e' : 'w'), bevel: 0.3 })
      }
    }
    // Silver mullion and floor lines on the glass: a floor line every three
    // storeys and a mullion line every ~7 m (the photos show a fine silver
    // grid on deep blue mirror glass; a few lines keep it from being a slab).
    {
      const [x0, x1] = xs(TI, TO), o = 0.07, t = 0.18
      const strip = (a: V3, b: V3, c: V3, d: V3, n: V3) => fquad(white, a, b, c, d, n)
      for (let f = 3; f * ST < CROWN - 2; f += 3) {
        const z0 = f * ST - t, z1 = f * ST + t
        strip([x0, Y0 - o, z0], [x1, Y0 - o, z0], [x1, Y0 - o, z1], [x0, Y0 - o, z1], [0, -1, 0])
        strip([x1, Y1 + o, z0], [x0, Y1 + o, z0], [x0, Y1 + o, z1], [x1, Y1 + o, z1], [0, 1, 0])
        const xo = s > 0 ? x1 + o : x0 - o
        strip([xo, Y0, z0], [xo, Y1, z0], [xo, Y1, z1], [xo, Y0, z1], [s, 0, 0])
      }
      const mz0 = s > 0 ? 0 : 0
      for (const fx of [0.25, 0.5, 0.75]) {
        const x = x0 + (x1 - x0) * fx
        for (const [y, ny] of [[Y0 - o, -1], [Y1 + o, 1]] as [number, number][])
          strip([x - t, y, mz0], [x + t, y, mz0], [x + t, y, CROWN], [x - t, y, CROWN], [0, ny, 0])
      }
      const xo = s > 0 ? x1 + o : x0 - o
      for (let k = 1; k < 8; k++) {
        const y = Y0 + ((Y1 - Y0) * k) / 8
        strip([xo, y - t, 0], [xo, y + t, 0], [xo, y + t, CROWN], [xo, y - t, CROWN], [s, 0, 0])
      }
    }
  }

  // The porthole slot at the north end of the east tower's east face (dllu,
  // Sakai): a dark recess with a white box carrying four portholes.
  {
    const x = TO, z0 = 89, z1 = 98
    box(steel, x - 1.6, 8, x + 0.02, 19, z0, z1, { sides: 'e', top: false })
    box(white, x - 0.2, 19, x + 0.9, 27.6, z0 - 0.5, z1 + 0.5, { bevel: 0.25, bottom: true, sides: 'nes' })
    for (let i = 0; i < 4; i++) wallDisc(win, [x + 0.95, 20.2 + i * 2.05, (z0 + z1) / 2], [1, 0, 0], 0.85, detail ? 12 : 8)
  }

  // The Floating Garden: the deck between the towers, 152-173 m, a ring
  // opening through it, glazed inside.
  {
    const dx0 = -TI - 0.2, dx1 = TI + 0.2, dy0 = Y0 - 0.7, dy1 = Y1
    const seg = detail ? 48 : 24
    const outer = rectRing(dx0, dy0, dx1, dy1, 0, 0, seg)
    annulus(white, outer, 0, 0, RING_BOT, DECK0, false)
    annulus(roof, outer, 0, 0, RING_TOP, H - 0.9, true)
    // The deck's faces, north and south (east/west faces are inside the towers).
    for (const [y, ny] of [[dy0, -1], [dy1, 1]] as [number, number][]) {
      const P = (x: number, z: number): V3 => [x, y, z]
      fquad(white, P(dx0, DECK0), P(dx1, DECK0), P(dx1, H), P(dx0, H), [0, ny, 0])
      // parapet lip
      box(white, dx0, ny < 0 ? y : y - 0.6, dx1, ny < 0 ? y + 0.6 : y, H - 0.9, H + 1.1, { sides: 'ns' })
      // window band 165-169 and portholes 159-162
      const yy = y + ny * 0.05, n = 10, w = (dx1 - dx0 - 4) / n
      for (let i = 0; i < n; i++) {
        const u0 = dx0 + 2 + i * w + 0.5, u1 = dx0 + 2 + (i + 1) * w - 0.5
        const Q: V3[] = ny < 0 ? [[u0, yy, 165], [u1, yy, 165], [u1, yy, 169], [u0, yy, 169]] : [[u1, yy, 165], [u0, yy, 165], [u0, yy, 169], [u1, yy, 169]]
        fquad(win, Q[0], Q[1], Q[2], Q[3], [0, ny, 0])
      }
      const np = 12, pw = (dx1 - dx0 - 8) / (np - 1)
      for (let i = 0; i < np; i++) wallDisc(win, [dx0 + 4 + i * pw, yy, 160.5], [0, ny, 0], 1.05, detail ? 12 : 6)
      // a lip under the face
      box(white, dx0, ny < 0 ? y - 0.6 : y, dx1, ny < 0 ? y : y + 0.6, DECK0 - 0.6, DECK0 + 0.8, { bottom: true, sides: ny < 0 ? 's' : 'n' })
    }
    // The ring's inner wall: a white lip at the bottom, glazing, a white
    // band, and the roof's edge, widening from 14.5 m to 18.3 m.
    const n = detail ? 40 : 24
    const prof: Array<[number, number, Part]> = [[RING_BOT, DECK0, white], [RING_BOT + 0.8, 155, tube], [RING_TOP - 1.2, 167.5, white], [RING_TOP - 0.6, 169, white], [RING_TOP, H - 0.9, white]]
    for (let k = 0; k < prof.length - 1; k++) {
      const [r0, z0, part] = prof[k], [r1, z1] = prof[k + 1]
      for (let i = 0; i < n; i++) {
        const a0 = (i / n) * TAU, a1 = ((i + 1) / n) * TAU
        const P = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]
        const am = (a0 + a1) / 2, sl = Math.atan2(r1 - r0, z1 - z0)
        const N: V3 = [-Math.cos(am) * Math.cos(sl), -Math.sin(am) * Math.cos(sl), Math.sin(sl)]
        fquad(part, P(r0, a0, z0), P(r1, a0, z1), P(r1, a1, z1), P(r0, a1, z0), N)
      }
    }
    // Sky Walk railing ring on the roof (a low glass band).
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * TAU, a1 = ((i + 1) / n) * TAU, r = RING_TOP + 0.3
      const P = (a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]
      const am = (a0 + a1) / 2
      fquad(tube, P(a0, H - 0.9), P(a1, H - 0.9), P(a1, H + 0.4), P(a0, H + 0.4), [Math.cos(am), Math.sin(am), 0])
      fquad(tube, P(a1, H - 0.9), P(a0, H - 0.9), P(a0, H + 0.4), P(a1, H + 0.4), [-Math.cos(am), -Math.sin(am), 0])
    }
    // Struts under the deck at each tower (Falbisoner, Sakai): from the
    // tower's face to the deck's underside.
    for (const s of [1, -1]) for (const y of [-18, -6, 6, 18]) {
      beam(white, [s * TI, y, DECK0 - 13], [s * (TI - 9), y, DECK0 + 0.2], 1.4, 1.4, [0, 0, 1], true)
    }
  }

  // The hanging lobby at 35F under the deck's west half, and the escalator
  // tubes rising from it through the ring.
  {
    box(white, -TI - 0.2, -14, 8, 10, 116, 128, { bottom: true, bevel: 0.3, sides: 'nse' })
    for (let i = 0; i < 4; i++) {
      const x0 = -22 + i * 7.4
      for (const [y, ny] of [[-14.05, -1], [10.05, 1]] as [number, number][]) {
        const Q: V3[] = ny < 0 ? [[x0, y, 119.5], [x0 + 4.4, y, 119.5], [x0 + 4.4, y, 125], [x0, y, 125]] : [[x0 + 4.4, y, 119.5], [x0, y, 119.5], [x0, y, 125], [x0 + 4.4, y, 125]]
        fquad(win, Q[0], Q[1], Q[2], Q[3], [0, ny, 0])
      }
    }
    // Two tubes, 4.4 m wide, 5.2 m tall, 6.8 m apart, rising 29 m from the
    // lobby (128 m) to the observatory floor (~157 m).
    const dir = unit([Math.cos((34 * Math.PI) / 180), Math.sin((34 * Math.PI) / 180), 0])
    const side: V3 = [-dir[1], dir[0], 0]
    for (const off of [-3.4, 3.4]) {
      const A: V3 = add([-14, -10.5, 128], mul(side, off)), B: V3 = add([13, 11, 157], mul(side, off))
      tubeTruss(A, B, side, detail)
    }
  }

  function tubeTruss(A: V3, B: V3, side: V3, fine: boolean) {
    const w = 4.4, h = 5.2, kz = h / 4.2
    const sw = mul(side, w / 2), L = Math.hypot(...sub(B, A))
    const at = (t: number, sx: number, z: number): V3 => add(add(add(A, mul(sub(B, A), t)), mul(sw, sx)), [0, 0, z * (z > 0.3 ? kz : 1)])
    // The glass skin: a shallow arched section (walls + roof facets).
    const sec: Array<[number, number]> = fine ? [[-1, 0.2], [-1, 2.6], [-0.75, 3.6], [-0.35, 4.1], [0.35, 4.1], [0.75, 3.6], [1, 2.6], [1, 0.2]] : [[-1, 0.2], [-1, 3.2], [-0.5, 4.1], [0.5, 4.1], [1, 3.2], [1, 0.2]]
    for (let k = 0; k < sec.length - 1; k++) {
      const [s0, z0] = sec[k], [s1, z1] = sec[k + 1]
      const n = unit(add(mul(side, z1 - z0), [0, 0, -(s1 - s0) * (w / 2)]))
      const N = mul(n, -1)
      fquad(fine ? tube : steel, at(0, s0, z0), at(0, s1, z1), at(1, s1, z1), at(1, s0, z0), N)
    }
    // The floor: a steel deck under the glass.
    const flN: V3 = [0, 0, -1]
    fquad(steel, at(0, -1.1, 0), at(1, -1.1, 0), at(1, 1.1, 0), at(0, 1.1, 0), flN)
    fquad(steel, at(0, 1.1, 0.25), at(1, 1.1, 0.25), at(1, -1.1, 0.25), at(0, -1.1, 0.25), [0, 0, 1])
    // Side trusses: Warren trusses along both walls, chords top and bottom.
    const n = fine ? Math.round(L / 2.6) : Math.round(L / 9)
    for (const sx of [-1.12, 1.12]) {
      warren(steel, (t) => at(t, sx, h - 0.6), (t) => at(t, sx, 0), n, fine ? 0.42 : 0.8, fine ? 0.26 : 0.6, fine)
    }
    if (fine) {
      // ribs round the section every other panel
      for (let i = 0; i <= n; i += 2) {
        const t = i / n
        for (let k = 0; k < sec.length - 1; k++) {
          const [s0, z0] = sec[k], [s1, z1] = sec[k + 1]
          beam(steel, at(t, s0 * 1.06, z0), at(t, s1 * 1.06, z1 * 1.02), 0.2)
        }
      }
    }
  }

  // Lattice elevator shafts from the ground to the lobby block, and the
  // stair lattice beside the east tower up to the 22F bridge.
  const shaft = (cx: number, cy: number, half: number, z1: number) =>
    latticeShaft(steel, cx, cy, half, 0, z1, detail ? { bay: 4.3, post: 0.6, member: 0.32, x: true } : { bay: 13.8, post: 1.0, member: 0.6, every: 2 })
  shaft(-14.4, 1, 3.4, 116)
  shaft(2.3, 1, 3.4, 116)
  shaft(14.2, -11.5, 2.4, 21 * ST - 0.6)
  // Shaft cores: a pale glass lift core inside each lift shaft.
  for (const cx of [-14.4, 2.3]) box(tube, cx - 1.6, -0.6, cx + 1.6, 2.6, 0, 116, { top: false })

  // The 22F bridge, 5 m wide, from tower to tower at ~88 m.
  {
    const zb = 21 * ST, depth = 6, y0 = -14, y1 = -9
    for (const y of [y0, y1]) {
      warren(steel, (t) => [lerp(-AX, AX, t), y, zb + depth + (t > 0.5 ? 2.2 * Math.sin(((t - 0.5) / 0.5) * Math.PI) : 0)], (t) => [lerp(-AX, AX, t), y, zb], detail ? 18 : 8, detail ? 0.55 : 0.8, detail ? 0.32 : 0.55, detail)
    }
    box(steel, -AX, y0, AX, y1, zb - 0.6, zb + 0.3, { bottom: true, sides: 'ns' })
    // the enclosed walkway (glass) inside the truss
    box(tube, -AX, y0 + 0.6, AX, y1 - 0.6, zb + 0.3, zb + 3.2, { sides: 'ns' })
    if (detail) for (let i = 0; i <= 18; i += 2) {
      const x = lerp(-AX, AX, i / 18)
      beam(steel, [x, y0, zb + depth], [x, y1, zb + depth], 0.35)
      beam(steel, [x, y0, zb], [x, y1, zb], 0.35)
    }
  }

  return [
    { part: glassWall, material: { ...PALETTE.window, color: 0x5f80b4 } },
    { part: white, material: finish('umeda-aluminium', 0xe4e7ea) },
    { part: steel, material: finish('umeda-steel', 0x5b626c) },
    { part: tube, material: PALETTE.glass },
    { part: roof, material: PALETTE.roof },
    { part: win, material: windowVariant(2, 0x64798a) },
  ]
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

if (import.meta.main) {
  await writeLods('osaka-umeda-sky-building', 'Umeda Sky Building', { bearing: 3.7, elevation: 0, height: 173 }, [
    { file: 'osaka-umeda-sky-building.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'osaka-umeda-sky-building.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1536 * 1024 },
  ])
}
