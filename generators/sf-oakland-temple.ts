/**
 * Oakland California Temple — original procedural geometry, CC0-1.0.
 * bun generators/sf-oakland-temple.ts
 *
 * Frame: built square to the temple, BEARING 5 (its walls run 5° clockwise
 * of the compass points). x east-ish (+x = east wing), y north-ish (+y = the
 * front, over the cascade and Temple Hill's gardens), z up, metres. Origin =
 * the centre of the central tower (lidar), the temple's centre of symmetry,
 * 0.7 m south-east of OSM's anchor point.
 *
 * Evidence
 * - OSM way/52391545 (the temple, building:part, 3 levels): a cross-shaped
 *   plan, an east-west bar 57 x 16 m through a central block 29 x 24 m with
 *   middle projections to ±16.7 and square towers at its four corners;
 *   way/894014038 (part, height 52) the central tower; way/894014037 (the
 *   two-level podium the temple stands on, 64 x 48 m plus its forecourt and,
 *   to the north, the two wings flanking the cascade, ways 52391546/7, which
 *   this model leaves to the map).
 * - USGS 3DEP lidar (CA_AlamedaCo_2_2021) at 0.5 m in this frame
 *   (/tmp/city/sf/work/sf-oakland-temple). y = 0 is 202.1 m NAVD88, the
 *   ground round the podium (flat to ±0.4 m; the hill falls away beyond it to
 *   the east, west and south). Measured above it: the podium deck 6.7 (±33 m,
 *   y -27..+24, the forecourt to +30); the wings' roofs 15.5; the central
 *   block's roof 16.6 (parapet 16.9); the corner towers 4 m square to 21.6,
 *   their spires' tips ~29; the central tower's plinth 16 m square to 19.5,
 *   its main stage 12 m square to 29.1, then 8 m to 33.3 and 5.8 m to ~36.3;
 *   its spire's tip 51.
 * - Published (Wikipedia; the Church's temple pages): dedicated 1964,
 *   architect Harold W. Burton; reinforced concrete faced with Sierra white
 *   granite; five spires of gold-anodised open latticework, the central one
 *   170 ft (52 m); on a terrace on Temple Hill above the Bay.
 * - Commons daylight photos: "Mormon Temple, Oakland.jpg" (USGS, public
 *   domain, the north front over the cascade), "Oaklandfront.JPG" (Hurling7,
 *   public domain, the front), "Main Tower, Oakland California Temple 1.jpg"
 *   (Hurling7, public domain, the stepped tower and a corner tower close up),
 *   "Mormontemplet i Oakland.jpg" (Johan Jönsson, CC BY-SA 4.0, the front on
 *   axis), "Oakland LDS temple2.jpg" and "Oakland Mormon Temple.jpg" (Calibas,
 *   CC BY-SA 4.0 / public domain, from the hills: plan, wings, podium).
 *
 * Estimated: the stepped corners of the tower's main stage and of the corner
 * towers (1 m), the spires' bases, the corner spires' tips (30.5, the lidar
 * misses a slender tip), the shallow pilasters on the wings, the podium's
 * ground-storey window band, the north front's relief panel. The latticework
 * is drawn as solid gold faces. South and north fronts are drawn alike.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const BEARING = 5
const ANCHOR = { lng: -122.199095, lat: 37.807815 }
const granite = new Part(), roof = new Part(), gold = new Part(), win = new Part(), trim = new Part(), deck = new Part()

// --- Dimensions (m above the lowest ground) ---
const DECK = 6.7
const WING_X = 28.5, WING_Y = 7.9, WING_TOP = 15.5
const CORE_X = 14.7, CORE_Y = 12, MID_X = 8.5, MID_Y = 16.7, CORE_TOP = 16.6
const CT = 13.7, CT_H = 2.0, CT_TOP = 21.6, CT_TIP = 30.5 // corner towers: centre offset, half-width, shaft top, spire tip
const T1 = 8, T1_TOP = 19.5, T2 = 6, T2_TOP = 29.1, T3 = 4, T3_TOP = 33.3, T4 = 2.9, T4_TOP = 36.3
const SPIRE = 50.5, FINIAL = 52

/** An axis-aligned box with chamfered vertical edges. */
function block(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, ch = 0.3, top: Part | null = part) {
  const r: XY[] = [[x0 + ch, y0], [x1 - ch, y0], [x1, y0 + ch], [x1, y1 - ch], [x1 - ch, y1], [x0 + ch, y1], [x0, y1 - ch], [x0, y0 + ch]]
  for (let i = 0; i < 8; i++) {
    const a = r[i], b = r[(i + 1) % 8]
    part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) for (let i = 1; i < 7; i++) top.tri([r[0][0], r[0][1], z1], [r[i][0], r[i][1], z1], [r[i + 1][0], r[i + 1][1], z1])
}
const cbox = (p: Part, cx: number, cy: number, hx: number, hy: number, z0: number, z1: number, ch = 0.3, top: Part | null = p) =>
  block(p, cx - hx, cx + hx, cy - hy, cy + hy, z0, z1, ch, top)
/**
 * A square stage with stepped (re-entrant) corners: the art-deco profile of
 * the towers. A cross of two boxes plus a corner box set in by `step`.
 */
function stepped(p: Part, cx: number, cy: number, h: number, step: number, z0: number, z1: number, top: Part | null = p) {
  cbox(p, cx, cy, h, h - 2 * step, z0, z1, 0.15, top)
  cbox(p, cx, cy, h - 2 * step, h, z0, z1, 0.15, top)
  cbox(p, cx, cy, h - step, h - step, z0, z1, 0.15, top)
}
/** A square pyramid, base half-width h at z0, apex at z1. */
function pyramid(p: Part, x: number, y: number, h: number, z0: number, z1: number) {
  const q: V3[] = [[x - h, y - h, z0], [x + h, y - h, z0], [x + h, y + h, z0], [x - h, y + h, z0]]
  for (let i = 0; i < 4; i++) p.tri(q[i], q[(i + 1) % 4], [x, y, z1])
}
/** A spire: a short straight-sided base, then a tall pyramid and a needle. */
function spire(x: number, y: number, h: number, z0: number, tip: number, needle: number) {
  cbox(gold, x, y, h, h, z0, z0 + 0.6, 0.1, null)
  pyramid(gold, x, y, h, z0 + 0.6, tip)
  cbox(gold, x, y, 0.12, 0.12, tip - 0.8, needle, 0.03)
}
type Face = { a: XY; t: XY; n: XY; len: number }
const face = (a: XY, b: XY): Face => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
  return { a, t, n: [t[1], -t[0]], len }
}
const at = (f: Face, s: number, d: number, z: number): V3 => [f.a[0] + f.t[0] * s + f.n[0] * d, f.a[1] + f.t[1] * s + f.n[1] * d, z]
const panel = (p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d = 0.05) =>
  p.quad(at(f, s0, d, z0), at(f, s1, d, z0), at(f, s1, d, z1), at(f, s0, d, z1))
/** A raised strip on a face: front, ends and top. */
function relief(p: Part, f: Face, s0: number, s1: number, d: number, z0: number, z1: number) {
  panel(p, f, s0, s1, z0, z1, d)
  p.quad(at(f, s0, 0, z0), at(f, s0, d, z0), at(f, s0, d, z1), at(f, s0, 0, z1))
  p.quad(at(f, s1, d, z0), at(f, s1, 0, z0), at(f, s1, 0, z1), at(f, s1, d, z1))
  p.quad(at(f, s0, d, z1), at(f, s1, d, z1), at(f, s1, 0, z1), at(f, s0, 0, z1))
}

// ---------------------------------------------------------------------------
// The podium: one tall storey of white wall over the hill, its deck the
// paved terrace the temple stands on, with windows round its foot.
{
  const ring: XY[] = [[-32.5, -27], [32.5, -27], [32.5, 24], [21.5, 24], [21.5, 29.7], [-22, 29.7], [-22, 24], [-32.5, 24]]
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    granite.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], DECK], [a[0], a[1], DECK])
    const f = face(a, b), n = Math.max(1, Math.round(f.len / 4.5)), w = f.len / n
    relief(trim, f, 0, f.len, 0.12, DECK - 0.6, DECK)
    for (let q = 0; q < n; q++) panel(win, f, q * w + 1.2, (q + 1) * w - 1.2, 1.4, 3.6, 0.06)
  }
  // deck: the main rectangle and the forecourt
  deck.quad([-32.5, -27, DECK], [32.5, -27, DECK], [32.5, 24, DECK], [-32.5, 24, DECK])
  deck.quad([-22, 24, DECK], [21.5, 24, DECK], [21.5, 29.7, DECK], [-22, 29.7, DECK])
}

// ---------------------------------------------------------------------------
// The temple: the long east-west wings, the taller central block with its
// middle projections, and four corner towers.
block(granite, -WING_X, WING_X, -WING_Y, WING_Y, DECK, WING_TOP, 0.3, roof)
block(granite, -CORE_X, CORE_X, -CORE_Y, CORE_Y, DECK, CORE_TOP, 0.3, roof)
block(granite, -MID_X, MID_X, -MID_Y, MID_Y, DECK, CORE_TOP, 0.3, roof)
// coping lines along the roofs
for (const [x0, x1, y0, y1, z] of [[-WING_X, WING_X, -WING_Y, WING_Y, WING_TOP], [-CORE_X, CORE_X, -CORE_Y, CORE_Y, CORE_TOP], [-MID_X, MID_X, -MID_Y, MID_Y, CORE_TOP]]) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  for (let i = 0; i < 4; i++) relief(trim, face(r[i], r[(i + 1) % 4]), -0.05, Math.hypot(r[(i + 1) % 4][0] - r[i][0], r[(i + 1) % 4][1] - r[i][1]) + 0.05, 0.12, z - 0.7, z + 0.02)
}
// shallow pilasters on the wings' long walls and ends, about 4 m apart
for (const sx of [-1, 1]) {
  const x0 = sx * CORE_X, x1 = sx * WING_X
  for (const sy of [-1, 1]) {
    const f = sx * sy > 0 ? face([x1, sy * WING_Y], [x0, sy * WING_Y]) : face([x0, sy * WING_Y], [x1, sy * WING_Y])
    const n = Math.round(f.len / 4.6)
    for (let q = 1; q < n; q++) relief(granite, f, (q * f.len) / n - 0.35, (q * f.len) / n + 0.35, 0.15, DECK, WING_TOP - 0.7)
  }
  const end = sx > 0 ? face([x1, -WING_Y], [x1, WING_Y]) : face([x1, WING_Y], [x1, -WING_Y])
  for (let q = 1; q < 4; q++) relief(granite, end, (q * end.len) / 4 - 0.35, (q * end.len) / 4 + 0.35, 0.15, DECK, WING_TOP - 0.7)
}
// the relief panels over the north and south fronts
for (const sy of [-1, 1]) {
  const f = sy > 0 ? face([MID_X, MID_Y], [-MID_X, MID_Y]) : face([-MID_X, -MID_Y], [MID_X, -MID_Y])
  relief(trim, f, 2.0, f.len - 2.0, 0.12, 11.2, 14.6)
}
// corner towers, each with a gold spire
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const x = sx * CT, y = sy * CT
  stepped(granite, x, y, CT_H, 0.45, DECK, CT_TOP, trim)
  spire(x, y, CT_H - 0.45, CT_TOP, CT_TIP, CT_TIP + 1.2)
}

// ---------------------------------------------------------------------------
// The central tower: a plinth, the tall stepped main stage, two smaller
// stages and the great gold spire.
cbox(granite, 0, 0, T1, T1, CORE_TOP - 0.5, T1_TOP, 0.3, trim)
stepped(granite, 0, 0, T2, 0.9, T1_TOP, T2_TOP, trim)
stepped(granite, 0, 0, T3, 0.6, T2_TOP, T3_TOP, trim)
cbox(granite, 0, 0, T4, T4, T3_TOP, T4_TOP, 0.25, trim)
spire(0, 0, 2.6, T4_TOP, SPIRE, FINIAL)
// the carved vertical bands up the middle of each face of the main stage
for (let k = 0; k < 4; k++) {
  const r: XY[] = [[-T2, -T2], [T2, -T2], [T2, T2], [-T2, T2]]
  const f = face(r[k], r[(k + 1) % 4])
  relief(trim, f, T2 - 1.0, T2 + 1.0, 0.1, T1_TOP + 1.0, T2_TOP - 1.0)
}

const parts = [
  { part: granite, material: finish('oakland-temple-granite', 0xedebe6) },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: gold, material: finish('oakland-temple-gold', 0xd2bb72, 0.5) },
  { part: win, material: PALETTE.window },
  { part: deck, material: finish('oakland-temple-terrace', 0xd6d3c9) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Oakland California Temple', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: FINIAL,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/52391545', 'way/894014038', 'way/894014037'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-oakland-temple.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
