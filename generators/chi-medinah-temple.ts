/**
 * Medinah Temple, Chicago (1912, Huehl & Schmid) — original procedural
 * geometry, CC0-1.0.
 * bun generators/chi-medinah-temple.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/210680454,
 * 41.892894,-87.627205. The outline's edges run at 89.5° / 179.5°, so the
 * catalog bearing is 359.5 and the building is square to this frame.
 *
 * Identity: a tan brick Moorish Revival block on Wabash Avenue with two
 * square corner towers at the Ohio and Ontario Street ends, each carrying a
 * copper dome over a deep bracketed cornice; between them the tall
 * entrance pavilion with its great tile-framed arch. Second: rows of
 * horseshoe-arched windows over a plain ground floor; from above, the
 * auditorium's broad pale rounded roof with its shallow central dome.
 *
 * Evidence:
 *  - plan: OSM outline, used as drawn. Tower squares (≈ 11 m, at the two
 *    east corners), the auditorium roof (a rounded oblong ≈ 37 × 60 m with a
 *    shallow dome ≈ 24 m across) and the lower west wing are read off USGS
 *    NAIP.
 *  - heights: nothing is published. Measured on w_lemay's photo from Ohio &
 *    Wabash, scaled by the tower's 11 m width: main cornice ≈ 20 m, tower
 *    cornice ≈ 30 m, dome ≈ 10 m across with its crown at ≈ 37 m. The
 *    west wing (≈ 16 m) and the auditorium roof (≈ 21.5 m, dome to
 *    ≈ 25.5 m) are estimated from NAIP shadows; OSM gives 5 levels.
 *    Expect ±2 m.
 *  - colour: tan-brown brick pulled to the palette's lightness; the domes'
 *    weathered copper reads grey-green in the photos; cornices and the
 *    arch frame lighter.
 *
 * Photos (Wikimedia Commons): Medinah_Temple,_Wabash_Avenue,_River_North,
 * _Chicago,_IL.jpg (w_lemay, CC BY-SA 2.0); Medinah_Temple_2.JPG
 * (Thshriver, CC BY-SA 3.0); Medinah_Temple,_Near_North,_Chicago,_Illinois
 * _(11004462776).jpg (Ken Lund, CC BY-SA 2.0); Medinah_temple_facade.jpg
 * (CC BY 3.0); Bally's_Chicago_at_Medinah_Temple_-_Chicago,_IL_-_August_2026
 * .jpg (AlphaBeta135, CC BY 4.0). USGS NAIP for the roof plan. No
 * commercial imagery.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), dome = new Part(), door = new Part()

type XY = [number, number]
const at = (pts: XY[], z: number): V3[] => pts.map(([x, y]) => [x, y, z])
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const edges = (ring: XY[]) => ring.map((a, i) => [a, ring[(i + 1) % ring.length]] as [XY, XY])
const elen = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])
const grow = (r: XY[], d: number): XY[] => {
  // Axis-aligned rectangles only: push every corner out by d.
  const cx = r.reduce((s, p) => s + p[0], 0) / r.length, cy = r.reduce((s, p) => s + p[1], 0) / r.length
  return r.map(([x, y]) => [x + Math.sign(x - cx) * d, y + Math.sign(y - cy) * d])
}

/** Walls to `top`, a bevelled cornice that projects `out`, and a roof. */
function block(p: Part, ring: XY[], top: number, out = 0.5, roofPart: Part | null = roof) {
  p.loft([at(ring, 0), at(ring, top - 1.4)])
  const o = grow(ring, out)
  trim.loft([at(ring, top - 1.4), at(o, top - 0.6), at(o, top)])
  if (roofPart) roofPart.cap(at(o, top), true)
}
function panel(p: Part, a: XY, b: XY, u0: number, u1: number, z0: number, z1: number, off = 0.06) {
  const L = elen(a, b), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const P = (u: number, z: number): V3 => [a[0] + ux * u + uy * off, a[1] + uy * u - ux * off, z]
  p.quad(P(u0, z0), P(u1, z0), P(u1, z1), P(u0, z1))
}
/** A horseshoe-arched panel: the arch runs a little past the semicircle. */
function horseshoe(p: Part, a: XY, b: XY, uc: number, w: number, z0: number, z1: number, off = 0.06) {
  const L = elen(a, b), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const P = (u: number, z: number): V3 => [a[0] + ux * u + uy * off, a[1] + uy * u - ux * off, z]
  const r = w / 2, cz = z1 - r
  const pts: V3[] = [P(uc - r * 0.85, z0), P(uc + r * 0.85, z0)]
  for (let k = 0; k <= 10; k++) {
    const t = -0.55 + (k / 10) * (Math.PI + 1.1)
    pts.push(P(uc + r * Math.cos(t), cz + r * Math.sin(t)))
  }
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1])
}

// ── Masses ───────────────────────────────────────────────────────────────
const X0 = -16.5, X1 = 27.5, Y0 = -33.0, Y1 = 32.9
const MAIN = rect(X0, X1, Y0, Y1)
block(brick, MAIN, 20)
// The lower west wing (toward the Tree Studios).
const WEST: XY[] = [[-35.1, -17.4], [X0, -17.4], [X0, Y1], [-18.3, Y1], [-18.3, 15.0], [-35.1, 15.0]]
brick.loft([at(WEST, 0), at(WEST, 15.2)])
trim.loft([at(WEST, 15.2), at(WEST, 16)])
roof.cap(at(WEST.slice(0, 2).concat([[X0, 15.0], [-35.1, 15.0]]), 16), true)
roof.cap(at([[-18.3, 15.0], [X0, 15.0], [X0, Y1], [-18.3, Y1]], 16), true)

// The auditorium roof: a pale rounded oblong over the hall with a shallow
// dome in the middle (NAIP).
{
  const cx = 7.5, cy = 0, hx = 18.5, hy = 30, rr = 11
  const ring: XY[] = []
  const corners: [number, number, number][] = [[hx - rr, -(hy - rr), -Math.PI / 2], [hx - rr, hy - rr, 0], [-(hx - rr), hy - rr, Math.PI / 2], [-(hx - rr), -(hy - rr), Math.PI]]
  for (const [ox, oy, a0] of corners) for (let k = 0; k <= 4; k++) {
    const a = a0 + (k / 4) * (Math.PI / 2)
    ring.push([cx + ox + rr * Math.cos(a), cy + oy + rr * Math.sin(a)])
  }
  roof.loft([at(ring, 20), at(ring, 21.5)])
  // Dome: a few rings to a shallow crown.
  const R = 12, rise = 4, n = 16
  const ringAt = (r: number, z: number): V3[] => Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    return [cx - 6.5 + r * Math.cos(a), cy + 1 + r * Math.sin(a), z]
  })
  const rings: V3[][] = []
  for (let k = 0; k <= 3; k++) { const t = k / 3; rings.push(ringAt(R * Math.cos(t * 1.2), 21.5 + rise * Math.sin(t * 1.2) / Math.sin(1.2))) }
  roof.loft(rings)
  roof.cap(rings[rings.length - 1], true)
  // Flat oblong roof around the dome: a fan to the ring is close enough, the
  // dome sits on top of it.
  roof.cap(at(ring, 21.5), true)
}

// ── Facades: bays of plain ground-floor openings, horseshoe arches on the
// second floor, small windows above ───────────────────────────────────────
const TW = 11 // tower width
function bays(a: XY, b: XY, u0: number, u1: number, n: number, top = 20) {
  const pitch = (u1 - u0) / n
  for (let i = 0; i < n; i++) {
    const uc = u0 + pitch * (i + 0.5)
    panel(win, a, b, uc - 1.0, uc + 1.0, 1.2, 4.4)
    horseshoe(win, a, b, uc, 2.1, 7.5, 12.4)
    panel(win, a, b, uc - 0.75, uc + 0.75, 14.2, Math.min(17.4, top - 2.6))
  }
}
const [S, E, N] = edges(MAIN)
bays(S[0], S[1], 0, elen(...S) - TW, 7)
bays(E[0], E[1], TW, 27, 3)
bays(E[0], E[1], 38.9, elen(...E) - TW, 3)
bays(N[0], N[1], TW, elen(...N), 7)
for (const [a, b] of edges(WEST)) {
  const L = elen(a, b)
  if (Math.abs(a[0] - X0) < 0.01 && Math.abs(b[0] - X0) < 0.01) continue
  if (L < 5) continue
  const n = Math.round(L / 5), pitch = L / n
  for (let i = 0; i < n; i++) {
    const uc = pitch * (i + 0.5)
    panel(win, a, b, uc - 0.9, uc + 0.9, 1.5, 5)
    panel(win, a, b, uc - 0.8, uc + 0.8, 7.5, 12.5)
  }
}

// ── The Wabash entrance pavilion ─────────────────────────────────────────
{
  const yc = (Y0 + Y1) / 2, hw = 6.2
  const ring = rect(X1 - 0.4, X1 + 0.7, yc - hw, yc + hw)
  block(brick, ring, 22.5, 0.4)
  const a: XY = [X1 + 0.7, yc - hw], b: XY = [X1 + 0.7, yc + hw]
  // The tiled frame, the arch with its screen, and the doors.
  panel(trim, a, b, 1.2, 2 * hw - 1.2, 2.5, 19.5, 0.05)
  horseshoe(brick, a, b, hw, 8.4, 2.6, 17.2, 0.1)
  horseshoe(win, a, b, hw, 7.2, 8.5, 16.6, 0.14)
  panel(door, a, b, hw - 3, hw + 3, 0, 5.2, 0.14)
  for (const u of [hw - 2.4, hw - 0.8, hw + 0.8, hw + 2.4]) panel(win, a, b, u - 0.5, u + 0.5, 6.0, 7.8, 0.14)
}

// ── The corner towers and their domes ────────────────────────────────────
for (const yc of [Y0 + TW / 2, Y1 - TW / 2]) {
  const xc = X1 - TW / 2, h = TW / 2
  const ring = rect(xc - h, xc + h, yc - h, yc + h)
  brick.loft([at(ring, 0), at(ring, 28.4)])
  // Deep bracketed cornice: a bevelled step out, a band, and back in.
  const o = grow(ring, 0.9)
  trim.loft([at(ring, 28.4), at(o, 29.3), at(o, 30.3), at(grow(ring, 0.3), 30.6)])
  roof.cap(at(grow(ring, 0.3), 30.6), true)
  // Windows on every face: the framed triple window high up, the
  // balcony arcade on the second floor, small windows between.
  for (const [a, b] of edges(ring)) {
    for (const u of [h - 2.2, h, h + 2.2]) panel(win, a, b, u - 0.7, u + 0.7, 23.2, 27.0)
    panel(trim, a, b, h - 3.4, h + 3.4, 22.6, 27.6, 0.03)
    for (const u of [h - 2.2, h + 2.2]) panel(win, a, b, u - 0.6, u + 0.6, 15, 17.5)
    for (const u of [h - 2.0, h, h + 2.0]) horseshoe(win, a, b, u, 1.4, 8.5, 12.6)
    panel(win, a, b, h - 1.6, h + 1.6, 0.5, 5.4)
  }
  // The dome: a drum, then a slightly bulbous copper dome with a finial.
  const n = 16, R = 5.0, z0 = 30.6
  const ringR = (r: number, z: number): V3[] => Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    return [xc + r * Math.cos(a), yc + r * Math.sin(a), z]
  })
  dome.loft([ringR(R * 0.97, z0), ringR(R * 0.97, z0 + 0.6)])
  const prof: [number, number][] = [[1.0, 0.6], [1.05, 1.8], [1.0, 3.2], [0.85, 4.5], [0.6, 5.5], [0.3, 6.1], [0.08, 6.3]]
  dome.loft([ringR(R * 0.97, z0 + 0.6), ...prof.map(([k, dz]) => ringR(R * k, z0 + dz))])
  dome.cap(ringR(R * 0.08, z0 + 6.3), true)
}

const parts = [
  { part: brick, material: finish('medinah-brick', 0xbf9b7a) },
  { part: trim, material: finish('medinah-trim', 0xdcc4a4) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: dome, material: finish('medinah-copper', 0x7b8f8c) },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('Medinah Temple', parts, {
  frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [41.892894, -87.627205], bearing: 359.5,
})
if (triangles > 5000 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/chi-medinah-temple.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
