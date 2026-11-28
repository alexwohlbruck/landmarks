/**
 * Santa Maria in Aracoeli, on the Capitoline, Rome: procedural, CC0-1.0,
 * no textures.
 *   bun generators/rome-santa-maria-in-aracoeli.ts
 *
 * Map frame: x, y, z up, metres, turned to bearing 259: +y points WSW, out
 * of the facade and down the stair to Piazza d'Aracoeli; +x points NNW,
 * toward the Vittoriano. Origin: the centroid of the OSM outline way/25640152
 * at 12.4831827, 41.8939608. The facade's centre line is x = 3.1.
 *
 * y = 0 is the foot of the stair (the Scalinata dell'Aracoeli, 123 steps in
 * OSM), the level of Piazza d'Aracoeli and the lowest ground under the
 * model. The church floor and the top of the stair are at F = 19 m: OSM
 * tags the church 45 m, and the facade measures 26 m on the photos, so the
 * floor stands 19 m over the piazza (123 steps of 0.155 m over the 59 m run
 * OSM maps). Everything below the floor is the hill's masonry: the
 * substructures, drawn in brick down to y = 0 and buried by the terrain
 * where it is higher.
 *
 * Modelled: the plain unfinished brick facade (37 m wide) with its raised
 * central band and sloping shoulders under thin brick cornices, the white
 * string course under the band, the small oculus in the band, the round-
 * headed window in its square recess, the two small rose windows, and the
 * one main portal with its white marble arched surround, lunette and dark
 * green doors (the photos show only this one portal in the facade); the
 * nave with its gabled terracotta roof, the aisles under lean-to roofs, the
 * side chapels, the transept and the choir, all on OSM's plan; the stair
 * (the Scalinata), 24 m wide, with its brick side walls and the landing in
 * front of the facade. OSM maps the stair only as a highway=steps line, not
 * as a building; it is drawn because the church reads from the city as the
 * brick front at the top of that stair, and the map's z13 terrain here is
 * far smoother than the hill.
 *
 * Sources
 * - OSM (ODbL), fetched 2026-11-28 (API map call): the outline way/25640152
 *   (building=church, height 45, wikidata Q318660); the steps way/86242193
 *   (Scalinata dell'Ara Coeli, step_count 123, from y 98.6 to 39.7 here).
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 ThePhotografer, "Santa Maria in Aracoeli (Rome) - Facade.jpg",
 *     CC BY-SA 4.0 (the facade from the top of the stair: every opening,
 *     the cornices, the brick colour);
 *     https://commons.wikimedia.org/wiki/File:Santa_Maria_in_Aracoeli_(Rome)_-_Facade.jpg
 *   2 Falk2, "14 536 Santa Maria in Aracoeli, Campidoglio.jpg", CC BY-SA 4.0
 *     (from Piazza d'Aracoeli: the stair, its walls and width, the facade's
 *     proportions with less foreshortening, the roofs behind, the
 *     Vittoriano beside it);
 *     https://commons.wikimedia.org/wiki/File:14_536_Santa_Maria_in_Aracoeli,_Campidoglio.jpg
 * - Terrain: Mapterhorn z13 only (~15 m pixels): it shows the hill as a
 *   smooth slope, 3-11 m over the piazza under the church, where the real
 *   floor is ~19 m up. The substructure walls stand above the drawn ground
 *   there; that is the terrain's error, not the model's. Elevation 0.
 *
 * Numbers
 * - From OSM: the plan of every mass  (simplified; the round chapel
 *   followed as a half octagon), the stair's position and run.
 * - Measured on photo 1 (facade 37 m = 945 px; heights x1.1 for the upward
 *   view, checked against photo 2's 0.74 height/width): facade 26 m, the
 *   central band 19.6 m wide from F+21.6 to F+26, the shoulders falling to
 *   F+19.0 at the edges; the portal surround 6.6 m wide and 8.5 m high, the
 *   doors 3.8 x 3.6 m; the rose windows (reworked after review, measured
 *   again) 2.8 m across with their stone ring, 5.1 m from the edges, centred
 *   at F+8.6, a third of the way up; the rectangular window frame 2.7 m wide,
 *   F+12.3 to F+16.9, with the oval light 1.5 x 2.4 m; the oculus 1.45 m
 *   with a 2 m stone ring at F+23.4 in the raised band; pale dentil lines
 *   under the top eave and the shoulder cornices. PIAZZA: everything is lifted 2 m (see the write section) so
 *   the stair's foot meets the map's ground.
 * - Estimated: stair width 24 m (photo 2, against the facade); nave and
 *   aisle eaves and ridges from the facade's band and shoulders; transept
 *   and choir heights (no photo shows the back; the Vittoriano hides it).
 * - Not modelled: the small bell-gable tower (its place is not mapped and no
 *   photo here shows it in context), the convent, the Cosmatesque side door
 *   toward the Campidoglio.
 *
 * Night: the facade and the stair walls are floodlit; the windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { earcut, extrude, prism, rect, save, type XY } from './dc-wwii-memorial'

const brick = new Part()
const tile = new Part()
const trim = new Part()
const win = new Part()
const door = new Part()
const step = new Part()

function tri(p: Part, a: V3, b: V3, c: V3, dir: V3) {
  const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (n[0] * dir[0] + n[1] * dir[1] + n[2] * dir[2] < 0) p.tri(a, c, b)
  else p.tri(a, b, c)
}
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, dir: V3) {
  tri(p, a, b, c, dir)
  tri(p, a, c, d, dir)
}
function face(p: Part, ring: XY[], at: (u: number, v: number) => V3, dir: V3) {
  for (const [i, j, k] of earcut(ring)) tri(p, at(...ring[i]), at(...ring[j]), at(...ring[k]), dir)
}
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0) {
  prism(p, rect((x0 + x1) / 2, (y0 + y1) / 2, Math.abs(x1 - x0) / 2, Math.abs(y1 - y0) / 2), z0, z1, b)
}
/** A gabled roof over x0..x1 (ridge along y), eaves at e, ridge at r, with gable ends. */
function roofY(x0: number, x1: number, y0: number, y1: number, e: number, r: number, gableWall = true) {
  const m = (x0 + x1) / 2, o = 0
  quad(tile, [x0 - o, y0, e - 0.15], [m, y0, r], [m, y1, r], [x0 - o, y1, e - 0.15], [-1, 0, 2])
  quad(tile, [m, y0, r], [x1 + o, y0, e - 0.15], [x1 + o, y1, e - 0.15], [m, y1, r], [1, 0, 2])
  if (gableWall) for (const [y, d] of [[y0, -1], [y1, 1]] as const) tri(brick, [x0, y, e], [x1, y, e], [m, y, r - 0.1], [0, d, 0])
}
/** A gabled roof with its ridge along x. */
function roofX(x0: number, x1: number, y0: number, y1: number, e: number, r: number) {
  const m = (y0 + y1) / 2, o = 0
  quad(tile, [x0, y0 - o, e - 0.15], [x1, y0 - o, e - 0.15], [x1, m, r], [x0, m, r], [0, -1, 2])
  quad(tile, [x0, m, r], [x1, m, r], [x1, y1 + o, e - 0.15], [x0, y1 + o, e - 0.15], [0, 1, 2])
  for (const [x, d] of [[x0, -1], [x1, 1]] as const) tri(brick, [x, y0, e], [x, y1, e], [x, m, r - 0.1], [d, 0, 0])
}
/** A lean-to roof falling from (xHi, hi) to (xLo, lo), along y. */
function leanTo(xHi: number, xLo: number, y0: number, y1: number, hi: number, lo: number) {
  const d = Math.sign(xLo - xHi), o = 0
  quad(tile, [xHi, y0, hi], [xLo + d * o, y0, lo - 0.12], [xLo + d * o, y1, lo - 0.12], [xHi, y1, hi], [d * (hi - lo), 0, Math.abs(xLo - xHi)])
  for (const [y, s] of [[y0, -1], [y1, 1]] as const) tri(brick, [xHi, y, lo], [xLo, y, lo], [xHi, y, hi], [0, s, 0])
}

const F = 19 // church floor and top of the stair, over Piazza d'Aracoeli
const CX = 3.1 // facade centre line
const FY = 33.9 // facade plane

// ---------------------------------------------------------------- the church

// Facade half-widths: the band 9.8, the facade 18.6.
const BAND = 9.8, FW = 18.6
const NAVE0 = CX - BAND, NAVE1 = CX + BAND
const AISLE0 = CX - FW, AISLE1 = CX + FW
// Nave: walls to the eaves, gabled roof under the facade's top.
const NAVE_E = F + 20.4, NAVE_R = F + 24.6
box(brick, NAVE0, NAVE1, -24.0, FY - 1.2, 0, NAVE_E)
roofY(NAVE0, NAVE1, -24.0, FY - 1.2, NAVE_E, NAVE_R)
// Aisles under lean-to roofs, and the chapels beyond them.
const AISLE_HI = F + 19.4, AISLE_LO = F + 17.0
box(brick, AISLE0, NAVE0, -9.1, FY - 1.2, 0, AISLE_LO)
box(brick, NAVE1, AISLE1, -6.0, FY - 1.2, 0, AISLE_LO)
leanTo(NAVE0, AISLE0, -9.1, FY - 1.2, AISLE_HI, AISLE_LO)
leanTo(NAVE1, AISLE1, -6.0, FY - 1.2, AISLE_HI, AISLE_LO)
// The chapels on the south-east (−x) side, the round chapel's bump as a
// half octagon on OSM's curve, and the narrow strip on the north-west side.
// Nothing overhangs the outline: neighbours share these walls.
box(brick, -19.6, AISLE0, -9.1, 28.4, 0, F + 13.0)
leanTo(AISLE0, -19.6, -9.1, 28.4, F + 14.5, F + 12.6)
prism(brick, Array.from({ length: 5 }, (_, i) => {
  const a = Math.PI / 2 + (Math.PI * i) / 4
  return [-19.6 + 4.3 * Math.cos(a), 16.65 + 3.55 * Math.sin(a)] as XY
}), 0, F + 11.0, 0)
box(brick, AISLE1, 24.0, -6.0, 31.5, 0, F + 13.0)
leanTo(AISLE1, 24.0, -6.0, 31.5, F + 14.0, F + 12.6)
// The transept, its ridge across the church.
const TR_E = F + 17.0, TR_R = F + 20.6
box(brick, -28.2, 25.2, -23.9, -9.1, 0, TR_E)
roofX(-28.2, 25.2, -23.9, -9.1, TR_E, TR_R)
// The choir behind it, and the step in the outline south of it.
box(brick, -9.1, 7.6, -37.6, -23.9, 0, F + 17.0)
roofY(-9.1, 7.6, -37.6, -23.9, F + 17.0, F + 20.2)
box(brick, -20.5, -9.1, -30.6, -23.9, 0, F + 12.0)
box(brick, 7.6, 25.2, -24.4, -23.9, 0, F + 12.0)

// ---------------------------------------------------------------- the facade

{
  const Y = FY, T = 1.2 // the facade wall's front face and thickness
  // The outline: shoulders sloping to the edges, the band above.
  const SH_IN = F + 21.6, SH_OUT = F + 19.0, TOP = F + 26
  const ring: XY[] = [[AISLE0, 0], [AISLE1, 0], [AISLE1, SH_OUT], [NAVE1, SH_IN], [NAVE1, TOP], [NAVE0, TOP], [NAVE0, SH_IN], [AISLE0, SH_OUT]]
  extrude(brick, ring, Y - T, Y, (u, v, w) => [u, w, v])
  // The brick cornices on the band's top and along the shoulders, each with
  // a pale dentil line under it (photo 1).
  box(brick, NAVE0 - 0.5, NAVE1 + 0.5, Y - T - 0.3, Y + 0.55, TOP - 0.35, TOP + 0.35)
  box(trim, NAVE0 - 0.25, NAVE1 + 0.25, Y - 0.3, Y + 0.32, TOP - 0.8, TOP - 0.35)
  for (const s of [-1, 1]) {
    const xi = s > 0 ? NAVE1 : NAVE0, xo = s > 0 ? AISLE1 : AISLE0
    const r: XY[] = [[xo + s * 0.4, SH_OUT - 0.3], [xi, SH_IN - 0.3], [xi, SH_IN + 0.35], [xo + s * 0.4, SH_OUT + 0.35]]
    extrude(brick, r, Y - T, Y + 0.5, (u, v, w) => [u, w, v])
    const dl: XY[] = [[xo + s * 0.2, SH_OUT - 0.75], [xi, SH_IN - 0.75], [xi, SH_IN - 0.3], [xo + s * 0.2, SH_OUT - 0.3]]
    extrude(trim, dl, Y - 0.2, Y + 0.28, (u, v, w) => [u, w, v])
  }
  // A stone band at the floor's level across the facade, either side of
  // the stair: where the hill's masonry ends and the church begins.
  for (const s of [-1, 1]) {
    const xa = s < 0 ? AISLE0 - 0.3 : CX + 12.9, xb = s < 0 ? CX - 12.9 : AISLE1 + 0.3
    box(step, xa, xb, Y - 0.3, Y + 0.35, F - 0.7, F)
  }
  // The white string course under the band.
  box(trim, NAVE0 + 0.2, NAVE1 - 0.2, Y - 0.2, Y + 0.12, SH_IN - 0.25, SH_IN + 0.05)
  // The oculus in the band, a dark disc flush on the brick.
  const disc = (cx: number, cz: number, r: number, n: number): XY[] =>
    Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * Math.PI * 2), cz + r * Math.sin((i / n) * Math.PI * 2)] as XY)
  face(trim, disc(CX, F + 23.4, 1.0, 12), (u, v) => [u, Y + 0.03, v], [0, 1, 0])
  face(win, disc(CX, F + 23.4, 0.72, 12), (u, v) => [u, Y + 0.06, v], [0, 1, 0])
  // The window at mid-height: a rectangular recess with a pale stone frame
  // and sill, the oval light inside (photo 1).
  face(trim, [[CX - 1.35, F + 12.3], [CX + 1.35, F + 12.3], [CX + 1.35, F + 16.9], [CX - 1.35, F + 16.9]], (u, v) => [u, Y + 0.03, v], [0, 1, 0])
  face(brick, [[CX - 1.1, F + 12.6], [CX + 1.1, F + 12.6], [CX + 1.1, F + 16.6], [CX - 1.1, F + 16.6]], (u, v) => [u, Y + 0.06, v], [0, 1, 0])
  face(win, Array.from({ length: 12 }, (_, i) => [CX + 0.75 * Math.cos((i / 12) * Math.PI * 2), F + 14.4 + 1.2 * Math.sin((i / 12) * Math.PI * 2)] as XY), (u, v) => [u, Y + 0.09, v], [0, 1, 0])
  // The two rose windows, low on either side: flush rosettes, a pale ring,
  // the dark light, a pale hub and six bold spokes.
  for (const s of [-1, 1]) {
    const cx = CX + s * (FW - 5.1), cz = F + 8.6, at = (u: number, v: number): V3 => [u, Y + 0.03, v]
    face(trim, disc(cx, cz, 1.4, 12), at, [0, 1, 0])
    face(win, disc(cx, cz, 1.08, 12), (u, v) => [u, Y + 0.06, v], [0, 1, 0])
    face(trim, disc(cx, cz, 0.3, 6), (u, v) => [u, Y + 0.09, v], [0, 1, 0])
    for (let k = 0; k < 6; k++) {
      const a = (k * Math.PI) / 3, ca = Math.cos(a), sa = Math.sin(a), w = 0.09
      face(trim, [[cx + 0.25 * ca - w * sa, cz + 0.25 * sa + w * ca], [cx + 0.25 * ca + w * sa, cz + 0.25 * sa - w * ca], [cx + 1.1 * ca + w * sa, cz + 1.1 * sa - w * ca], [cx + 1.1 * ca - w * sa, cz + 1.1 * sa + w * ca]], (u, v) => [u, Y + 0.09, v], [0, 1, 0])
    }
  }
  // The portal: white marble jambs and arch, the lunette, the doors.
  const PW = 3.3, R = 3.3, SPRING = F + 5.2
  const arch: XY[] = [[CX - PW, F], [CX + PW, F]]
  for (let k = 0; k <= 8; k++) arch.push([CX + R * Math.cos((Math.PI * k) / 8), SPRING + R * Math.sin((Math.PI * k) / 8)])
  extrude(trim, arch, Y, Y + 0.35, (u, v, w) => [u, w, v], { caps: [false, true] })
  // Inner reveal: the lunette in brick and the doors, set into the surround.
  const r2 = 2.3
  const lun: XY[] = [[CX - r2, SPRING - 0.6], [CX + r2, SPRING - 0.6]]
  for (let k = 0; k <= 8; k++) lun.push([CX + r2 * Math.cos((Math.PI * k) / 8), SPRING + r2 * Math.sin((Math.PI * k) / 8)])
  face(brick, lun, (u, v) => [u, Y + 0.38, v], [0, 1, 0])
  face(trim, [[CX - r2, SPRING - 0.9], [CX + r2, SPRING - 0.9], [CX + r2, SPRING - 0.6], [CX - r2, SPRING - 0.6]], (u, v) => [u, Y + 0.38, v], [0, 1, 0])
  face(door, [[CX - 1.9, F], [CX + 1.9, F], [CX + 1.9, F + 3.6], [CX - 1.9, F + 3.6]], (u, v) => [u, Y + 0.38, v], [0, 1, 0])
}

// ---------------------------------------------------------------- the stair

{
  // 31 flights' worth of treads (fewer than the real 123, each a group of
  // four), from the piazza at y = 98.6 to the landing at 39.7, as one
  // stepped profile extruded across the stair's width.
  const W0 = CX - 12, W1 = CX + 12, FOOT = 98.6, TOP = 39.7, N = 31
  const prof: XY[] = [[FOOT, 0]]
  for (let i = 0; i < N; i++) {
    const y = FOOT - ((FOOT - TOP) * i) / N, z = (F * (i + 1)) / N
    prof.push([y, z], [y - (FOOT - TOP) / N, z])
  }
  prof.push([TOP - 0.01, F], [TOP - 0.01, 0])
  extrude(step, prof, W0, W1, (u, v, w) => [w, u, v], { caps: [false, false] })
  // The landing before the facade.
  box(step, W0, W1, FY, TOP, 0, F)
  // The brick walls each side, stepping up with the stair, capped in stone.
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? W0 - 0.9 : W1, x1 = x0 + 0.9
    const wall: XY[] = [[FOOT, 0], [FOOT, 1.1], [TOP, F + 1.1], [FY, F + 1.1], [FY, 0]]
    extrude(brick, wall, x0, x1, (u, v, w) => [w, u, v], { caps: [true, true] })
  }
}

// ---------------------------------------------------------------- write

// The map's ground at the stair's foot is 2 m over the lowest ground under
// the model (z13 terrain), so everything above y = 0 is lifted by PIAZZA and
// what stands on y = 0 is stretched down to it.
const PIAZZA = 2.0
for (const p of [brick, tile, trim, win, door, step]) for (let i = 1; i < p.pos.length; i += 3) if (p.pos[i] > 0.001) p.pos[i] += PIAZZA

const up = (n: V3) => (n[2] > 0.7 ? 0.35 : 1)
// The facade and the stair are floodlit; the other walls barely.
const lit = (k: number) => (p: V3, n: V3) => (n[1] > 0.5 && p[1] > FY - 2 ? 1 : p[1] > FY ? 0.8 : 0.2) * k * up(n)

console.log({ brick: brick.triangles, tile: tile.triangles, trim: trim.triangles, win: win.triangles, door: door.triangles, step: step.triangles })
await save('rome-santa-maria-in-aracoeli', 'Santa Maria in Aracoeli', [
  // Colours from photos 1 and 2, pulled to the palette's lightness: the
  // warm orange-brown brick; grey travertine steps; terracotta roofs.
  { part: brick, material: { ...finish('aracoeli-brick', 0xc78a6b), floodlight: lit(1) } },
  { part: tile, material: PALETTE.terracotta },
  { part: trim, material: { ...PALETTE.trim, floodlight: lit(1) } },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('aracoeli-door', 0x56645b) },
  { part: step, material: { ...finish('aracoeli-steps', 0xd3cdc2), floodlight: lit(0.8) } },
], { bearing: 259, osm: 'way/25640152' })
