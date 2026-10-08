/**
 * Chicago Theatre (1921, Rapp and Rapp), 175 N State Street, Chicago —
 * original procedural geometry, CC0-1.0.
 *
 *   bun generators/chi-chicago-theatre.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the centroid of the
 * OSM outline way/124873919 (41.885396, -87.627238). The outline's edges run
 * at 359.9° / 89.7°, so the model is built square and placed at bearing
 * 359.7.
 * The outline is an L: the lobby block on State Street (x -39.8..-19.7,
 * 18 m of frontage) and the auditorium behind it, east of the Page Brothers
 * Building, to x = 28.4.
 *
 * Identity, in order: the vertical C-H-I-C-A-G-O blade sign at the north end
 * of the facade; the long marquee across the front with its round CHICAGO
 * medallion and the word in letters on top; the cream terracotta facade with
 * one great round-arched window (the Arc de Triomphe motif) between narrow
 * piers, a deep main cornice and an attic storey. The auditorium behind is
 * plain brick massing, as the brief asks.
 *
 * Lettering: STYLE.md rules out lettering except where the sign is the
 * landmark. This is that exception: the vertical sign's letters, and the
 * smaller CHICAGO on the marquee, are simple extruded block letters on a
 * flat red panel, not a texture. They are in the `entrance` material, which
 * is their real cream bulb colour by day and glows at night like the sign.
 *
 * Evidence:
 *  - OSM: way/124873919 (outline, 6 levels), way/1176843051 (building=roof,
 *    the marquee: 8 m deep across the 18 m frontage; the photos show about
 *    6 m, which is used), way/124873930 (Page Brothers, north neighbour).
 *  - Heights: nothing is published. Measured off Rob Young's photo from
 *    the south-west, scaled by the 18 m frontage and checked against the
 *    seven storeys of the Page Brothers Building beside it: main cornice
 *    ≈ 26.8 m, attic top ≈ 30 m, arch window ≈ 7 m wide springing at
 *    ≈ 14 m, marquee ≈ 5.0-8.4 m, sign ≈ 10-33.6 m with letters ≈ 2.8 m
 *    tall, projecting ≈ 4.6 m. Expect ±2 m.
 *  - Auditorium: the big flat roof in USGS NAIP (x -20..15.7) and a separate
 *    strip at the east end, read as the stage house. Their heights (24 m
 *    and 29 m) are estimates: the photos show the auditorium's south wall
 *    about level with the lobby's cornice, and a plain block rising just
 *    behind the facade.
 *  - Photos (Wikimedia Commons): Balaban_and_Katz_Chicago_Theatre_(5945866075)
 *    .jpg (Rob Young, CC BY 2.0, south-west); Balaban_and_Katz_Chicago
 *    _Theatre.jpg (Jeff Jondahl, CC BY-SA 3.0, west); Chicago_Theater_-_day
 *    .jpg (Wally Gobetz, CC BY 2.0, south-west); Balaban_and_Katz_Chicago
 *    _Theater.JPG (JABullinger, CC BY-SA 3.0, night); Chicago_(2836745244)
 *    .jpg (Banalities, CC BY 2.0, elevated, from the north-west);
 *    20120825_View_of_State_Street_from_Wit_Roof_Bar.JPG (TonyTheTiger,
 *    CC BY-SA 3.0, from above). No commercial imagery.
 *
 * Invented or simplified: the marquee's scrollwork and bulb borders (plain
 * red frame), the sign's gold border and its steel bracing to the roof (left
 * out), the fire escape on the south wall (left out).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { plate, type UV } from './chi-picasso'

const stone = new Part(), brick = new Part(), roof = new Part(), win = new Part(), lit = new Part(), red = new Part()

type XY = [number, number]
const at = (pts: XY[], z: number): V3[] => pts.map(([x, y]) => [x, y, z])
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** An axis-aligned box. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  plate(p, rect(x0, x1, y0, y1), (u, v, w) => [u, v, (z0 + z1) / 2 + w], z1 - z0)
}

/** A flat panel on a wall: `face` picks the wall (W/S/N/E at coordinate c), u runs along it. */
type Face = { axis: 'x' | 'y'; c: number; out: 1 | -1 }
function panel(p: Part, f: Face, u0: number, u1: number, z0: number, z1: number, off = 0.06) {
  const P = (u: number, z: number): V3 => f.axis === 'x' ? [f.c + f.out * off, u, z] : [u, f.c + f.out * off, z]
  const pts = [P(u0, z0), P(u1, z0), P(u1, z1), P(u0, z1)]
  const n: V3 = f.axis === 'x' ? [f.out, 0, 0] : [0, f.out, 0]
  const nn = (a: V3, b: V3, c: V3) => {
    const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    return (ab[1] * ac[2] - ab[2] * ac[1]) * n[0] + (ab[2] * ac[0] - ab[0] * ac[2]) * n[1] + (ab[0] * ac[1] - ab[1] * ac[0]) * n[2]
  }
  if (nn(pts[0], pts[1], pts[2]) > 0) p.quad(pts[0], pts[1], pts[2], pts[3])
  else p.quad(pts[0], pts[3], pts[2], pts[1])
}
/** A round-arched panel: jambs from z0, semicircle springing at zs. */
function arched(p: Part, f: Face, uc: number, w: number, z0: number, zs: number, off = 0.06, depth = 0) {
  const r = w / 2, pts: UV[] = [[uc - r, z0], [uc + r, z0]]
  for (let k = 0; k <= 10; k++) { const a = (k / 10) * Math.PI; pts.push([uc + r * Math.cos(a), zs + r * Math.sin(a)]) }
  const map = (u: number, z: number, wv: number): V3 => {
    const d = f.out * (off + (depth ? depth / 2 + wv : wv))
    return f.axis === 'x' ? [f.c + d, u, z] : [u, f.c + d, z]
  }
  plate(p, pts, map, depth || 0.02)
}

// ── Plan, from OSM ───────────────────────────────────────────────────────
const XW = -39.8 // State Street frontage
const XL = -19.7 // back of the lobby block
const YS = -23.3, YN = -5.3 // lobby block's south and north walls
const AUD: XY[] = [[XL, -23.4], [15.7, -23.6], [15.7, 27.8], [-20.2, 27.6]]
const STAGE: XY[] = [[15.7, -23.6], [28.9, -23.7], [27.9, 27.9], [15.7, 27.8]]

// ── Lobby block: cream terracotta, main cornice, attic ──────────────────
const CORNICE = 26.8, ATTIC = 30.0
{
  const ring = rect(XW, XL, YS, YN)
  stone.loft([at(ring, 0), at(ring, CORNICE - 1.2)])
  // Main cornice: a bevelled step out and back.
  const o = rect(XW - 0.8, XL, YS - 0.8, YN)
  stone.loft([at(ring, CORNICE - 1.2), at(o, CORNICE - 0.4), at(o, CORNICE), at(ring, CORNICE + 0.3)])
  // Attic storey and its top cornice.
  stone.loft([at(ring, CORNICE + 0.3), at(ring, ATTIC - 0.5)])
  const t = rect(XW - 0.4, XL, YS - 0.4, YN)
  stone.loft([at(ring, ATTIC - 0.5), at(t, ATTIC - 0.1), at(t, ATTIC)])
  roof.cap(at(t, ATTIC), true)
}

// The State Street facade (west face). Seen from the street the viewer's
// right is south, so u runs along y.
const W: Face = { axis: 'x', c: XW, out: -1 }
{
  // Piers either side of the arch bay, a little proud of the wall.
  const BAY0 = -18.0, BAY1 = -9.6
  box(stone, XW - 0.45, XW, YS, BAY0, 0, CORNICE - 1.2)
  box(stone, XW - 0.45, XW, BAY1, YN, 0, CORNICE - 1.2)
  // The great arch: a raised frame, then the window set into it.
  const uc = (BAY0 + BAY1) / 2
  arched(stone, W, uc, 8.6, 8.4, 13.6, 0, 0.3)
  arched(win, W, uc, 6.8, 8.4, 14.1, 0.32)
  // Over the arch: a band of four windows, and the attic's row.
  for (let i = 0; i < 4; i++) { const u = BAY0 + 1.2 + i * 2.0; panel(win, W, u, u + 1.2, 20.6, 22.9) }
  for (const u of [YS + 1.4, BAY1 + 2.1]) { panel(win, W, u, u + 1.3, 20.6, 22.9, 0.51); panel(win, W, u, u + 1.3, 15.0, 17.4, 0.51) }
  for (let i = 0; i < 6; i++) { const u = YS + 1.6 + i * 2.85; panel(win, W, u, u + 1.4, 27.6, 29.1, 0.07) }
  // Doors under the marquee.
  panel(lit, W, YS + 2.0, YN - 2.0, 0.3, 4.4, 0.08)
}

// The lobby's south wall: tall round-arched windows at the street, then
// punched windows up to the attic.
const S: Face = { axis: 'y', c: YS, out: -1 }
for (let i = 0; i < 4; i++) {
  const uc = XW + 3.0 + i * 4.6
  arched(win, S, uc, 2.4, 1.2, 6.2)
  for (const z of [10.0, 15.0, 20.6]) panel(win, S, uc - 0.7, uc + 0.7, z, z + 2.4)
  panel(win, S, uc - 0.7, uc + 0.7, 27.6, 29.1)
}
// North wall above the Page Brothers Building (about 24 m).
const N: Face = { axis: 'y', c: YN, out: 1 }
for (let i = 0; i < 4; i++) { const uc = XW + 3.0 + i * 4.6; panel(win, N, uc - 0.7, uc + 0.7, 27.6, 29.1) }

// ── Auditorium and stage house: plain brick massing ──────────────────────
for (const [ring, h] of [[AUD, 24.0], [STAGE, 29.0]] as [XY[], number][]) {
  brick.loft([at(ring, 0), at(ring, h - 0.6)])
  brick.loft([at(ring, h - 0.6), at(ring, h)])
  roof.cap(at(ring, h), true)
}
// A few windows on the auditorium's south wall (exit stairs).
for (const x of [-14, -4, 6]) for (const z of [6, 12, 18]) panel(win, { axis: 'y', c: -23.5, out: -1 }, x, x + 1.4, z, z + 2.2)

// ── Lettering: block glyphs on a 5 × 7 grid ──────────────────────────────
const R = (x0: number, y0: number, x1: number, y1: number): UV[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const K = 1.4
const GLYPHS: Record<string, UV[][]> = {
  C: [R(0, 0, K, 7), R(0, 7 - K, 5, 7), R(0, 0, 5, K)],
  H: [R(0, 0, K, 7), R(5 - K, 0, 5, 7), R(K, 2.8, 5 - K, 4.2)],
  I: [R(1.8, 0, 3.2, 7)],
  A: [R(0, 0, K, 7), R(5 - K, 0, 5, 7), R(K, 7 - K, 5 - K, 7), R(K, 2.8, 5 - K, 4.2)],
  G: [R(0, 0, K, 7), R(K, 7 - K, 5, 7), R(K, 0, 5, K), R(5 - K, K, 5, 3.6), R(2.6, 2.4, 5 - K, 3.6)],
  O: [R(0, 0, K, 7), R(5 - K, 0, 5, 7), R(K, 0, 5 - K, K), R(K, 7 - K, 5 - K, 7)],
}
/**
 * One letter as raised blocks. `place(g, d)` maps a glyph point (grid units,
 * x to the reader's right, y up) and a depth off the panel to the model.
 */
function letter(ch: string, place: (g: UV, d: number) => V3, depth: number) {
  for (const poly of GLYPHS[ch]) plate(lit, poly, (u, v, w) => place([u, v], depth / 2 + w), depth)
}

// ── The vertical sign: a red blade at the north end of the facade ───────
{
  const y0 = -7.7, y1 = -6.3, x0 = XW - 4.6, x1 = XW
  box(red, x0, x1, y0, y1, 10.2, 32.0)
  box(red, x0 - 0.4, x1, y0 - 0.25, y1 + 0.25, 32.0, 33.6) // crown
  box(red, x0 + 0.9, x1, y0 + 0.1, y1 - 0.1, 9.4, 10.2)    // foot, into the marquee
  const word = 'CHICAGO', cap = 2.8, unit = cap / 7, pitch = 3.0, top = 31.4
  const xc = (x0 + x1) / 2
  for (let i = 0; i < word.length; i++) {
    const zb = top - cap - i * pitch
    // South face: the reader's right is east. North face: west.
    letter(word[i], ([gx, gy], d) => [xc + (gx - 2.5) * unit, y0 - d, zb + gy * unit], 0.22)
    letter(word[i], ([gx, gy], d) => [xc - (gx - 2.5) * unit, y1 + d, zb + gy * unit], 0.22)
  }
}

// ── The marquee: across the frontage, 6 m out over the sidewalk ─────────
{
  const xo = XW - 6.0, y0 = YS + 0.1, y1 = YN - 0.1, z0 = 5.0, z1 = 8.4
  box(red, xo, XW, y0, y1, z0, z1)
  // Letter boards on the front and both ends.
  panel(lit, { axis: 'x', c: xo, out: -1 }, y0 + 0.6, y1 - 0.6, z0 + 0.45, z1 - 1.0, 0.04)
  for (const [c, out] of [[y0, -1], [y1, 1]] as [number, -1 | 1][]) panel(lit, { axis: 'y', c, out }, xo + 0.5, XW - 0.4, z0 + 0.45, z1 - 1.0, 0.04)
  // The crest along the top, higher in the middle under the medallion.
  box(red, xo, xo + 0.6, y0 + 1.0, y1 - 1.0, z1, z1 + 0.6)
  // The round medallion behind the word, under the sign.
  const mc = -10.4, mz = z1 + 1.7, mr = 1.75, ring: UV[] = []
  for (let k = 0; k < 16; k++) { const a = (k / 16) * Math.PI * 2; ring.push([mc + mr * Math.cos(a), mz + mr * Math.sin(a)]) }
  plate(red, ring, (u, v, w) => [xo + 0.3 + w, u, v], 0.5)
  // CHICAGO across the top of the marquee, reading from the street: the
  // reader's right is south.
  const word = 'CHICAGO', cap = 1.5, unit = cap / 7, adv = 6.2 * unit
  const start = mc + (word.length * adv - unit * 1.2) / 2
  for (let i = 0; i < word.length; i++) {
    const u0 = start - i * adv
    letter(word[i], ([gx, gy], d) => [xo - d, u0 - gx * unit, z1 + 0.9 + gy * unit], 0.2)
  }
}

const parts = [
  { part: stone, material: PALETTE.stone },
  { part: brick, material: finish('chicago-theatre-brick', 0xc9ae92) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: lit, material: PALETTE.entrance },
  { part: red, material: finish('chicago-theatre-red', 0xc9473a) },
]
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('Chicago Theatre', parts, {
  frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [41.885396, -87.627238], bearing: 359.7,
})
if (triangles > 5000 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/chi-chicago-theatre.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
