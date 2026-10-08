/**
 * Disney's Contemporary Resort, the A-frame tower — procedural, CC0-1.0.
 * bun generators/wdw-contemporary-resort.ts
 *
 * Map frame: x east, y north, z up, metres. Placed at bearing 0: the tower's
 * long axis runs due north (the OSM outline's long sides are within 0.1° of
 * north). The anchor is the middle of the A-frame: halfway between the outer
 * feet of its sloped sides (OSM x -41.7 and +23.1 m) and between the ends of
 * its end legs (y -70.0 and +65.1 m), in the frame of OSM way/344910189.
 *
 * What it is (Welton Becket for Disney and US Steel, 1971): a steel A-frame
 * whose two sloped sides carry nine floors of stacked, balconied guest rooms,
 * with the Grand Canyon Concourse atrium inside, glazed at both ends in
 * bronze glass between two leaning end legs. The monorail runs straight
 * through the concourse. A penthouse (California Grill) sits on the flat roof.
 *
 * Evidence:
 * - OSM (measured): outline way/344910189, 64.7 × 135.1 m; the slope strips
 *   way/784959501–522 put the side faces from x = ±32 m at the ground to the
 *   40 m wide roof, and the frame ribs every 10.1 m along the sides (12 bays,
 *   as photo 01 shows); the end-wall parts way/692275601–617 and
 *   way/692834842–844 give the glass trapezoid (17 m wide at the top, 32 m
 *   near the bottom, 10 m to 48 m up) and the end legs about 12 m wide; the
 *   penthouse octagon way/692834841/5 (33 × 52 m) and its hipped cap
 *   way/563012186–193; the gabled concourse skylights way/563718274–280 and
 *   way/784959677–681. The glass ends sit 6–7 m behind the ends of the legs.
 * - Published: 14 storeys, 184 ft (56 m) to the top of the penthouse.
 * - Photos (Wikimedia Commons, see the report for credits): 01 and 02, the
 *   lake (west) side face-on, give the heights in proportion to 56 m: the
 *   white podium to 13.4 m, a dark recessed band to 19 m, nine room floors to
 *   the roof at 47.5 m, the end legs 2 m above it, the penthouse windows,
 *   fascia and cap. OSM's 51 m roof and 56 m top don't fit the photos; the
 *   photos win and the top stays at the published 56 m.
 *   "Left", "Arriving Monorail Teal" and Brian Kendig's 2005 photo show the
 *   north end: leaning legs of cream panels, balconies stepping along their
 *   inner edges, bronze glass between, the beams entering above a white base.
 *
 * The monorail: OSM's two beams (way/692276307 and way/880022913, layer 2,
 * tunnel=yes through the building) run north–south at x = -13.8 and -4.4 m in
 * this frame. The concourse is the 4th floor; the photos put the beams
 * entering just above the white base wall. The opening is modelled as a real
 * tunnel through the whole building, 10.5 to 18.5 m up and x -16.3 to -1.5,
 * so the monorail lines the map draws beneath show through both ends, and a
 * train (beam top ~13 m, car roof ~17 m) would fit. The beam height is an
 * estimate from photos; OSM's height=30 on the tunnel way doesn't match them.
 *
 * Estimated: the beam opening, the depth of the room-band steps (1 m), the
 * dark band's 2.2 m recess, the low podium blocks filling the outline's
 * entrance wings (4.5 m), the penthouse piers. Invented: nothing structural.
 */
import { Part, cross, len, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const frame = new Part(), trim = new Part(), win = new Part(), glass = new Part(), roof = new Part()

type XZ = [number, number]
const unit = (v: V3): V3 => { const l = len(v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A triangle with per-corner normals, its winding fixed to agree with them. */
function tri(p: Part, a: V3, b: V3, c: V3, n: V3[]) {
  const f = cross([b[0] - a[0], b[1] - a[1], b[2] - a[2]], [c[0] - a[0], c[1] - a[1], c[2] - a[2]])
  if (len(f) < 1e-9) return
  const avg: V3 = [n[0][0] + n[1][0] + n[2][0], n[0][1] + n[1][1] + n[2][1], n[0][2] + n[1][2] + n[2][2]]
  if (dot(f, avg) >= 0) p.tri(a, b, c, undefined, undefined, undefined, n)
  else p.tri(a, c, b, undefined, undefined, undefined, [n[0], n[2], n[1]])
}
/** A flat convex polygon facing `n`. */
function face(p: Part, pts: V3[], n: V3) {
  const u = unit(n)
  for (let i = 1; i < pts.length - 1; i++) tri(p, pts[0], pts[i], pts[i + 1], [u, u, u])
}
/** A flat convex polygon facing away from the point `inside`. */
function faceAway(p: Part, pts: V3[], inside: V3) {
  let n: V3 = [0, 0, 0]
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    n = [n[0] + (a[1] - b[1]) * (a[2] + b[2]), n[1] + (a[2] - b[2]) * (a[0] + b[0]), n[2] + (a[0] - b[0]) * (a[1] + b[1])]
  }
  const c = pts.reduce<V3>((s, q) => [s[0] + q[0] / pts.length, s[1] + q[1] / pts.length, s[2] + q[2] / pts.length], [0, 0, 0])
  if (dot(n, [c[0] - inside[0], c[1] - inside[1], c[2] - inside[2]]) < 0) n = [-n[0], -n[1], -n[2]]
  face(p, pts, n)
}
/**
 * A convex section in the x–z plane extruded along y from y0 to y1. `bevel`
 * chamfers the edges round the end faces it is given for, so they catch light.
 */
function prismY(p: Part, sec: XZ[], y0: number, y1: number, o: { bevel?: number; ends?: [boolean, boolean]; skipBottom?: boolean } = {}) {
  const b = o.bevel ?? 0, ends = o.ends ?? [true, true]
  const cx = sec.reduce((s, q) => s + q[0], 0) / sec.length, cz = sec.reduce((s, q) => s + q[1], 0) / sec.length
  const inset = (k: number) => sec.map(([x, z]): XZ => {
    const d = Math.hypot(x - cx, z - cz) || 1
    return [x - ((x - cx) / d) * k, z - ((z - cz) / d) * k]
  })
  const ring = (s: XZ[], y: number) => s.map(([x, z]): V3 => [x, y, z])
  const rings: V3[][] = []
  if (ends[0] && b) rings.push(ring(inset(b), y0))
  rings.push(ring(sec, ends[0] && b ? y0 + b : y0))
  rings.push(ring(sec, ends[1] && b ? y1 - b : y1))
  if (ends[1] && b) rings.push(ring(inset(b), y1))
  const mid: V3 = [cx, (y0 + y1) / 2, cz]
  const n = sec.length
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const q = [rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i]]
      if (o.skipBottom && q.every((v) => v[2] < 0.01)) continue
      faceAway(p, q, mid)
    }
  if (ends[0]) faceAway(p, rings[0], mid)
  if (ends[1]) faceAway(p, rings[rings.length - 1], mid)
}
/** An axis-aligned box, bottom face left off when it sits on the ground. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part = p) {
  const c: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]
  const v = (x: number, y: number, z: number): V3 => [x, y, z]
  faceAway(p, [v(x0, y0, z0), v(x1, y0, z0), v(x1, y0, z1), v(x0, y0, z1)], c)
  faceAway(p, [v(x0, y1, z0), v(x1, y1, z0), v(x1, y1, z1), v(x0, y1, z1)], c)
  faceAway(p, [v(x0, y0, z0), v(x0, y1, z0), v(x0, y1, z1), v(x0, y0, z1)], c)
  faceAway(p, [v(x1, y0, z0), v(x1, y1, z0), v(x1, y1, z1), v(x1, y0, z1)], c)
  faceAway(top, [v(x0, y0, z1), v(x1, y0, z1), v(x1, y1, z1), v(x0, y1, z1)], c)
  if (z0 > 0.01) faceAway(p, [v(x0, y0, z0), v(x1, y0, z0), v(x1, y1, z0), v(x0, y1, z0)], c)
}

// ---------------------------------------------------------------------------
// Dimensions.

const ROOF = 47.5          // the flat roof over the room floors
const LEGTOP = 49.5        // the end legs stand 2 m proud of it
const FOOT = 31.85         // the sloped face's half-width at the ground
const SLOPE = 12 / ROOF    // inward per metre up: 40 m wide at the roof
const O = (z: number) => FOOT - SLOPE * z       // outer face of the rooms and legs
const LEG = 12             // the end legs' width, measured across
const I = (z: number) => O(z) - LEG             // the legs' inner edge = the glass edge
const GLASS_Y = 60.8       // the glazed end walls, set back from…
const END_Y = 67.55        // …the ends of the legs
const PODIUM = 13.4        // white base wall on the sides
const ROOMS = 19           // first room floor
const FLOORS = 9
const FH = (ROOF - 1 - ROOMS) / FLOORS          // 3.06 m a floor, under a 1 m parapet
const SLAB = 1.3           // the white balcony front of each floor
const STEP = 0.8           // the dark band's recess behind it
const BASE_END = 10.5      // the white base wall under the end glass
const GTOP = 45            // the end glass's top, under a cream band
const TUN = { x0: -16.3, x1: -1.5, z0: BASE_END, z1: 18.5 } // the monorail's way through
const RIB_W = 1.6

// ---------------------------------------------------------------------------
// The sloped sides: one stepped profile, extruded the length of the
// building between the glass ends. Per floor: a white balcony front on the
// slope line, and the dark room band set back behind it.

type Seg = { a: XZ; b: XZ; part: Part }
const prof: Seg[] = []
const seg = (a: XZ, b: XZ, part: Part) => prof.push({ a, b, part })
{
  const podX = O(PODIUM) - 0.8, darkX = O(ROOMS) - 2.2
  seg([podX, 0], [podX, PODIUM], trim)
  seg([podX, PODIUM], [darkX, PODIUM], trim)
  seg([darkX, PODIUM], [darkX, ROOMS], win)
  seg([darkX, ROOMS], [O(ROOMS), ROOMS], trim)
  for (let k = 0; k < FLOORS; k++) {
    const z = ROOMS + k * FH, x = O(z)
    seg([x, z], [x, z + SLAB], trim)
    seg([x, z + SLAB], [x - STEP, z + SLAB], trim)
    seg([x - STEP, z + SLAB], [x - STEP, z + FH], win)
    seg([x - STEP, z + FH], [O(z + FH), z + FH], trim)
  }
  const zp = ROOMS + FLOORS * FH
  seg([O(zp), zp], [O(zp), ROOF], trim)
}
for (const side of [1, -1]) {
  for (const { a, b, part } of prof) {
    const A: V3 = [side * a[0], -GLASS_Y, a[1]], B: V3 = [side * b[0], -GLASS_Y, b[1]]
    const A1: V3 = [A[0], GLASS_Y, A[2]], B1: V3 = [B[0], GLASS_Y, B[2]]
    const n = unit([side * (b[1] - a[1]), 0, -(b[0] - a[0])])
    face(part, [A, B, B1, A1], n)
  }
}
// The roof, with the tunnel's lid and floor left to the tunnel itself.
{
  const r = O(ROOF - 1)
  face(roof, [[-r, -GLASS_Y, ROOF], [r, -GLASS_Y, ROOF], [r, GLASS_Y, ROOF], [-r, GLASS_Y, ROOF]], [0, 0, 1])
}

// The frame ribs: the A-frame's trusses, proud of the face, every 10.1 m.
const BAY = (2 * GLASS_Y) / 12
for (let k = 1; k < 12; k++) {
  const y = -GLASS_Y + k * BAY
  for (const side of [1, -1]) {
    const sec: XZ[] = [[O(0) - 1.6, 0], [O(0) + 0.5, 0], [O(ROOF) + 0.5, ROOF], [O(ROOF) - 1.6, ROOF]]
    prismY(frame, sec.map(([x, z]): XZ => [side * x, z]), y - RIB_W / 2, y + RIB_W / 2, { skipBottom: true })
  }
}

// ---------------------------------------------------------------------------
// The ends: two leaning legs, bronze glass between them over a white base,
// a cream band across the top, and the balconies stacked along each leg's
// inner edge, stepping in floor by floor.

for (const end of [1, -1]) {
  const y0 = end * GLASS_Y, y1 = end * END_Y
  const lo = Math.min(y0, y1), hi = Math.max(y0, y1)
  for (const side of [1, -1]) {
    const sec: XZ[] = [[I(0), 0], [O(0), 0], [O(LEGTOP), LEGTOP], [I(LEGTOP), LEGTOP]]
    prismY(frame, sec.map(([x, z]): XZ => [side * x, z]), lo, hi, {
      bevel: 0.5, ends: end > 0 ? [false, true] : [true, false], skipBottom: true,
    })
  }
  // The white base wall in front of the glass, under the beams.
  box(trim, -I(0), I(0), lo, hi, 0, BASE_END)
  // The cream band over the glass, between the legs.
  {
    const yb = y0 + end * 0.6
    const pts: V3[] = [[-I(GTOP), yb, GTOP], [I(GTOP), yb, GTOP], [I(LEGTOP), yb, LEGTOP - 1], [-I(LEGTOP), yb, LEGTOP - 1]]
    face(frame, pts, [0, end, 0])
    face(frame, [[-I(GTOP), y0, GTOP], [I(GTOP), y0, GTOP], [I(GTOP), yb, GTOP], [-I(GTOP), yb, GTOP]], [0, 0, -1])
    face(frame, [[-I(LEGTOP), y0, LEGTOP - 1], [I(LEGTOP), y0, LEGTOP - 1], [I(LEGTOP), yb, LEGTOP - 1], [-I(LEGTOP), yb, LEGTOP - 1]], [0, 0, 1])
  }
  // The glass: a trapezoid between the legs' inner edges, with the
  // monorail's opening cut from its foot.
  const g = (x: number, z: number): V3 => [x, y0, z]
  face(glass, [g(-I(TUN.z1), TUN.z1), g(I(TUN.z1), TUN.z1), g(I(GTOP), GTOP), g(-I(GTOP), GTOP)], [0, end, 0])
  face(glass, [g(-I(BASE_END), BASE_END), g(TUN.x0, BASE_END), g(TUN.x0, TUN.z1), g(-I(TUN.z1), TUN.z1)], [0, end, 0])
  face(glass, [g(TUN.x1, BASE_END), g(I(BASE_END), BASE_END), g(I(TUN.z1), TUN.z1), g(TUN.x1, TUN.z1)], [0, end, 0])
  // Balcony trays, white, stacked up each leg's inner edge.
  for (let k = 0; k < FLOORS; k++) {
    const z = ROOMS + k * FH
    for (const side of [1, -1]) {
      const xi = I(z + SLAB)
      const xa = side > 0 ? xi - 5 : -xi - 0.3, xb = side > 0 ? xi + 0.3 : -xi + 5
      box(trim, xa, xb, end > 0 ? GLASS_Y : -END_Y + 0.6, end > 0 ? END_Y - 0.6 : -GLASS_Y, z, z + SLAB)
    }
  }
}

// The concourse tunnel the monorail runs through, end to end.
{
  const { x0, x1, z0, z1 } = TUN, Y = GLASS_Y
  face(roof, [[x0, -Y, z0], [x1, -Y, z0], [x1, Y, z0], [x0, Y, z0]], [0, 0, 1])
  face(roof, [[x0, -GLASS_Y, z1], [x1, -GLASS_Y, z1], [x1, GLASS_Y, z1], [x0, GLASS_Y, z1]], [0, 0, -1])
  face(roof, [[x0, -GLASS_Y, z0], [x0, GLASS_Y, z0], [x0, GLASS_Y, z1], [x0, -GLASS_Y, z1]], [1, 0, 0])
  face(roof, [[x1, -GLASS_Y, z0], [x1, GLASS_Y, z0], [x1, GLASS_Y, z1], [x1, -GLASS_Y, z1]], [-1, 0, 0])
}

// ---------------------------------------------------------------------------
// The roof: concourse skylights, and the penthouse.

for (const end of [1, -1])
  for (const [a, b] of [[26.5, 30.3], [31.3, 38.7], [41.3, 49.3], [51.7, 59.3]]) {
    const y0 = end * a, y1 = end * b
    prismY(glass, [[-6.9, ROOF], [6.9, ROOF], [0, ROOF + 1.2]], Math.min(y0, y1), Math.max(y0, y1), { skipBottom: true })
  }

{
  const hx = 16.4, hy = 25.9, ch = 4.5, z0 = ROOF, z1 = ROOF + 4, z2 = z1 + 2, top = 56
  const oct = (dx: number, dy: number, c: number, z: number): V3[] => [
    [-dx + c, -dy, z], [dx - c, -dy, z], [dx, -dy + c, z], [dx, dy - c, z],
    [dx - c, dy, z], [-dx + c, dy, z], [-dx, dy - c, z], [-dx, -dy + c, z]]
  const wall = (p: Part, a: V3[], b: V3[]) => {
    for (let i = 0; i < 8; i++) faceAway(p, [a[i], a[(i + 1) % 8], b[(i + 1) % 8], b[i]], [0, 0, (a[0][2] + b[0][2]) / 2])
  }
  wall(win, oct(hx, hy, ch, z0), oct(hx, hy, ch, z1))
  // The fascia, a little proud, and its bevelled top.
  wall(trim, oct(hx + 0.4, hy + 0.4, ch, z1), oct(hx + 0.4, hy + 0.4, ch, z2 - 0.4))
  wall(trim, oct(hx + 0.4, hy + 0.4, ch, z2 - 0.4), oct(hx, hy, ch, z2))
  face(trim, oct(hx + 0.4, hy + 0.4, ch, z1).reverse(), [0, 0, -1])
  // The cap: steep-sided, from a 18 × 34 m base to a 15 × 30 m flat top.
  const cb = [[-9, -17], [9, -17], [9, 17], [-9, 17]].map(([x, y]): V3 => [x, y, z2])
  const ct = [[-7.5, -15], [7.5, -15], [7.5, 15], [-7.5, 15]].map(([x, y]): V3 => [x, y, top])
  face(trim, oct(hx, hy, ch, z2), [0, 0, 1])
  for (let i = 0; i < 4; i++) faceAway(trim, [cb[i], cb[(i + 1) % 4], ct[(i + 1) % 4], ct[i]], [0, 0, z2])
  face(trim, ct, [0, 0, 1])
  // Piers dividing the window band into bays (photo 01: five along a side).
  for (const s of [-1, 1]) {
    for (const y of [-12.5, -2.5, 7.5, 17.5].map((v) => v - 2.5)) box(trim, s > 0 ? hx - 0.2 : -hx - 0.2, s > 0 ? hx + 0.2 : -hx + 0.2, y - 0.4, y + 0.4, z0, z1)
    for (const x of [-6, 0, 6]) box(trim, x - 0.4, x + 0.4, s > 0 ? hy - 0.2 : -hy - 0.2, s > 0 ? hy + 0.2 : -hy + 0.2, z0, z1)
  }
}

// ---------------------------------------------------------------------------
// The low wings of the outline: the entrance lobby on the east, and the
// one-storey fronts at both ends, under the monorail beams.

const LOW = 4.5
box(trim, 32.25, 38.8, -18.1, 18.5, 0, LOW, roof)
box(trim, 38.8, 42.2, -18.1, -11.4, 0, LOW, roof)
box(trim, 38.8, 42.2, 12.7, 18.5, 0, LOW, roof)
box(trim, -28.9, 27.5, END_Y, 71.3, 0, LOW, roof)
box(trim, -18.2, -8.75, 71.3, 78.75, 0, LOW, roof)
box(trim, -26.4, 26.3, -71.1, -END_Y, 0, LOW, roof)
box(trim, -17.7, -7.8, -78.3, -71.1, 0, LOW, roof)

// ---------------------------------------------------------------------------

// Colours from the photos, on the shared palette: the frame and legs are
// cream concrete, a shade deeper than the white balcony fronts so the ribs
// read; the room bands are the palette's slate `window`, lit at night; the
// end walls and concourse are bronze `glass`, the atrium's structural
// glazing, dark but no darker than the style's charcoal floor.
const parts = [
  { part: frame, material: finish('contemporary-cream', 0xe0d3bc) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: glass, material: { name: 'glass', color: 0x625f5c, roughness: 0.3 } },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((sum, { part }) => sum + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb("Disney's Contemporary Resort", parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 56,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/wdw-contemporary-resort.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
