/**
 * Sistine Chapel (Cappella Sistina), Vatican City: procedural, CC0-1.0,
 * no textures.
 *   bun generators/rome-sistine-chapel.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 359.2 (the
 * OSM outline's long sides run 89.2 degrees). Origin: the centroid of the
 * OSM outline way/215289671, 12.454404, 41.902934. The chapel is a plain
 * 46 x 21 m brick box; its altar wall is at the west end.
 *
 * Modelled: the tall brick walls; the high crown of the old defensive
 * gallery: a row of corbelled arches (machicolations) under a projecting
 * band pierced by small square openings, all round the box; the lean-to
 * tile roof over that gallery; the set-back plastered attic storey over
 * the vault with its gabled tile roof and pediment gable ends; the six tall
 * round-headed windows on each long side; one great sloping buttress at
 * the west end of the north side (photo 2).
 *
 * Only the chapel's own outline is modelled; the Apostolic Palace's wings
 * that abut it are separate OSM buildings. No building:part lies over the
 * outline. The walls stand 0.6 m inside the outline so the model doesn't
 * reach over the palace wings that share its walls.
 *
 * Sources
 * - OSM (ODbL), fetched 2026-11-28: way/215289671 (building=chapel, no
 *   height tags), 45.9 x 21.0 m.
 * - Published (it.wikipedia "Cappella Sistina"): inside 40.93 x 13.41 m,
 *   20.70 m high to the barrel vault.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 Maus-Trauden, "Cappella Sistina - 2005.jpg", CC BY-SA 3.0 (from the
 *     dome of St. Peter's: the plan, the machicolation band and gallery
 *     openings, the lean-to roof, the attic and its gabled roof, the round-
 *     headed windows of the south side);
 *     https://commons.wikimedia.org/wiki/File:Cappella_Sistina_-_2005.jpg
 *   2 Sailko, "Veduta della cappella sistina dai giardini vaticani, 04.jpg",
 *     CC BY 3.0 (from the west: the gable end, the attic's proportions
 *     (16 m wide, ~9 m to the apex), the sloping buttress, brick colour);
 *     https://commons.wikimedia.org/wiki/File:Veduta_della_cappella_sistina_dai_giardini_vaticani,_04.jpg
 *   3 Yair Haklai, "Sistine Chapel-St. Peter's Basilica Dome.jpg",
 *     CC BY-SA 3.0 (close-up of the corbel arches, the gallery openings and
 *     the attic's cornice).
 *     https://commons.wikimedia.org/wiki/File:Sistine_Chapel-St._Peter%27s_Basilica_Dome.jpg
 * - Terrain: Mapterhorn z13; the ground rises ~0.7 m north to south under
 *   the chapel. Elevation 0.
 *
 * Numbers
 * - From OSM: the plan.
 * - Estimated: the chapel floor about 10 m over the ground outside (the two
 *   storeys of the basement), so the vault's crown is near 30.7 and the
 *   walls run to 28.0; the arch band 28.0-29.6, the gallery band 29.6-31.6
 *   with openings 0.9 m square every 2.2 m (photos 1 and 3); the attic
 *   set back 2.5 m, to 37.0, ridge 41.0 (photo 2's proportions); the
 *   windows 2.6 m wide, 20.4-27.6, just under the arch band (photo 1).
 * - Roofs: the gable roof and the gallery's lean-to in the palette's
 *   terracotta, apart from the brick (review).
 * - Doubts: no published outside height; the basement's height and the
 *   ground under the chapel (it is wedged between palace courts at
 *   different levels) are estimates. The east end and the north side are
 *   largely hidden by the palace in every photo.
 *
 * Night: the chapel is not floodlit; its windows glow.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { extrude, prism, rect, type XY } from './dc-wwii-memorial'

const brick = new Part()
const plaster = new Part()
const tile = new Part()
const glazing = new Part()
const shade = new Part() // the dark gallery openings and arches

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
/** A panel on the face x = X (dir ±1) or y = Y, from (u0, z0) to (u1, z1), with a semicircular head if `round`. */
function panel(p: Part, face: 'x' | 'y', at: number, dir: number, u0: number, u1: number, z0: number, z1: number, round = false, seg = 4) {
  const P = (u: number, z: number): V3 => (face === 'x' ? [at + dir * 0.05, u, z] : [u, at + dir * 0.05, z])
  const n: V3 = face === 'x' ? [dir, 0, 0] : [0, dir, 0]
  const h = (u1 - u0) / 2, spring = round ? z1 - h : z1
  quad(p, P(u0, z0), P(u1, z0), P(u1, spring), P(u0, spring), n)
  if (round) for (let k = 0; k < seg; k++) {
    const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg, m = (u0 + u1) / 2
    tri(p, P(m, spring), P(m + h * Math.cos(a0), spring + h * Math.sin(a0)), P(m + h * Math.cos(a1), spring + h * Math.sin(a1)), n)
  }
}

const HX = 23.0 - 0.6, HY = 10.5 - 0.6 // half-sizes, inside the outline
const WALL = 28.0, ARCH = 29.6, GAL = 31.6, SET = 2.5, ATT0 = 33.0, ATT1 = 37.0, RIDGE = 41.0

// The brick box, up to the top of the gallery.
prism(brick, rect(0, 0, HX, HY), 0, WALL, 0)
// The machicolation band and the gallery, standing out 0.7 m.
prism(brick, rect(0, 0, HX + 0.7, HY + 0.7), WALL, GAL, 0.25)
// Corbelled arches under the band and the gallery's square openings, all round.
const faces: Array<['x' | 'y', number, number, number]> = [['x', HX + 0.7, 1, HY + 0.7], ['x', -HX - 0.7, -1, HY + 0.7], ['y', HY + 0.7, 1, HX + 0.7], ['y', -HY - 0.7, -1, HX + 0.7]]
for (const [face, at, dir, half] of faces) {
  const n = Math.floor((2 * half - 1.2) / 2.2)
  const u0 = -((n - 1) * 2.2) / 2
  for (let k = 0; k < n; k++) {
    const u = u0 + k * 2.2
    panel(shade, face, at, dir, u - 0.65, u + 0.65, WALL, ARCH - 0.2, true, 3)
    panel(shade, face, at, dir, u - 0.45, u + 0.45, 30.2, 31.1)
  }
}
// The lean-to roof over the gallery, up to the attic's wall.
{
  const o = [HX + 0.9, HY + 0.9], i = [HX - SET, HY - SET]
  const C = (s: number[], z: number): V3[] => [[-s[0], -s[1], z], [s[0], -s[1], z], [s[0], s[1], z], [-s[0], s[1], z]]
  const out = C(o, GAL), inn = C(i, ATT0)
  for (let k = 0; k < 4; k++) quad(tile, out[k], out[(k + 1) % 4], inn[(k + 1) % 4], inn[k], [0, 0, 1])
}
// The plastered attic over the vault, its cornice, the gabled roof and the
// pediments at the ends.
prism(plaster, rect(0, 0, HX - SET, HY - SET), GAL, ATT1, 0)
prism(plaster, rect(0, 0, HX - SET + 0.5, HY - SET + 0.5), ATT1 - 0.6, ATT1, 0.2)
{
  const X = HX - SET + 0.7, Y = HY - SET + 0.7
  for (const s of [-1, 1]) {
    quad(tile, [-X, s * Y, ATT1], [X, s * Y, ATT1], [X, 0, RIDGE], [-X, 0, RIDGE], [0, s, 1.5])
    tri(plaster, [s * (X - 0.7), -Y + 0.7, ATT1], [s * (X - 0.7), Y - 0.7, ATT1], [s * (X - 0.7), 0, RIDGE - 0.4], [s, 0, 0])
  }
}
// The six round-headed windows on each long side.
for (const s of [-1, 1]) for (let k = 0; k < 6; k++) {
  const u = -17.5 + k * 7.0
  panel(glazing, 'y', s * HY, s, u - 1.3, u + 1.3, 20.4, 27.6, true, 4)
}
// The great sloping buttress at the west end of the north side (photo 2).
extrude(brick, [[HY, 0], [HY + 4.5, 0], [HY + 1.0, 24.0], [HY, 24.0]] as XY[], -HX + 1.0, -HX + 5.0, (u, v, w) => [w, u, v])

// ---------------------------------------------------------------- write

const up = (n: V3) => (n[2] > 0.7 ? 0.4 : 1)
const PARTS = [
  // Colours from photos 1 and 2, pulled to the palette's lightness: the
  // orange-brown brick, the attic's ochre plaster, terracotta tiles.
  { part: brick, material: { ...finish('sistine-brick', 0xc7a184), floodlight: (_p: V3, n: V3) => 0.15 * up(n) } },
  { part: plaster, material: finish('ochre-plaster', 0xdcc8a2) },
  { part: tile, material: { ...PALETTE.terracotta } },
  { part: glazing, material: PALETTE.window },
  { part: shade, material: finish('shadow', 0x7a6656) },
]
const triangles = PARTS.reduce((s, { part }) => s + part.triangles, 0)
const glb = writeGlb('Sistine Chapel', PARTS, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', bearing: 359.2, osm: 'way/215289671',
})
console.log(`${triangles} triangles, ${glb.length} bytes`)
if (triangles > 5000) throw new Error(`triangle budget exceeded: ${triangles}`)
if (glb.length > 250 * 1024) throw new Error(`file budget exceeded: ${glb.length}`)
await Bun.write(new URL('../models/rome-sistine-chapel.glb', import.meta.url).pathname, glb)
