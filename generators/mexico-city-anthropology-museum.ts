/**
 * Museo Nacional de Antropología, Paseo de la Reforma and Calzada Gandhi,
 * Bosque de Chapultepec, Mexico City (Pedro Ramírez Vázquez, with Jorge
 * Campuzano and Rafael Mijares, 1964): procedural, CC0-1.0.
 *   bun generators/mexico-city-anthropology-museum.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 9.3, so the
 * model's +x runs down the long patio axis (bearing 99.3) from the Sala
 * Mexica at the west end to the entrance front on the plaza at the east,
 * and every OSM wall is square to it. Origin: the area centroid of the
 * two OSM building outlines, at ground level.
 *
 * Form: a ring of two-storey exhibition halls round the long central
 * patio, open at its east end to the entrance block; blank outer walls of
 * grey-buff stone; to the patio a glazed ground floor under an upper
 * storey screened by Manuel Felguérez's aluminium lattice; the Sala Mexica
 * closing the west end under a canopy, the pool before it (modelled as its
 * rim only) and the white marble walk out into it. Over the east half of
 * the patio, El Paraguas: an 82 x 54 m flat roof, aluminium-clad, held
 * up by one bronze-clad column (José Chávez Morado's relief), with an
 * oculus round the column from which the rain-water cascade falls, a
 * hanging steel ring under it, and tie rods fanning out from the column's
 * head across the roof. The entrance front on the plaza: a white marble
 * block with the national emblem over the glazed doors.
 *
 * Sources
 * - OSM (ODbL): way/433753690 (the ring of halls, building, 2 levels),
 *   way/433753691 (the entrance block, 2 levels), relation/17310243
 *   ("El Paraguas", building=roof, multipolygon: outer way/433749990, an
 *   82.7 x 54.7 m rectangle, inner way/1257973479, the 11 m oculus). The
 *   museum grounds are way/433756023 (not a building). Replaced: the two
 *   buildings and the roof relation.
 * - Published: the umbrella "approximately 265 by 175 ft" (81 x 53 m) on
 *   a single column, reinforced concrete clad in aluminium, the column
 *   relief by José Chávez Morado (en.wikipedia "National Museum of
 *   Anthropology (Mexico)"); the lattice by Manuel Felguérez, anodised
 *   aluminium, on the upper floor round the patio; two floors round the
 *   patio; the pool before the Sala Mexica joined to it by a white marble
 *   platform (es.wikipedia "Museo Nacional de Antropología (México)").
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 ProtoplasmaKid, "Vista aérea del Museo Nacional de Antropología de
 *     México 1.jpg" to "6.jpg", CC BY 4.0 (drone: 2 over the plaza from the
 *     east, the entrance block, the umbrella and its column above the
 *     roofs; 3 straight down on the umbrella, its tie rods and oculus; 4
 *     straight down on the patio, pool, marble walk and the Mexica canopy,
 *     from which the patio's length and the pool are scaled; 5 from the
 *     north-east, the halls' roofs and heights);
 *     https://commons.wikimedia.org/wiki/File:Vista_a%C3%A9rea_del_Museo_Nacional_de_Antropolog%C3%ADa_de_M%C3%A9xico_2.jpg
 *     https://commons.wikimedia.org/wiki/File:Vista_a%C3%A9rea_del_Museo_Nacional_de_Antropolog%C3%ADa_de_M%C3%A9xico_3.jpg
 *     https://commons.wikimedia.org/wiki/File:Vista_a%C3%A9rea_del_Museo_Nacional_de_Antropolog%C3%ADa_de_M%C3%A9xico_4.jpg
 *     https://commons.wikimedia.org/wiki/File:Vista_a%C3%A9rea_del_Museo_Nacional_de_Antropolog%C3%ADa_de_M%C3%A9xico_5.jpg
 *   2 Rob Young, "Museo Nacional de Antropología (El Paragua)
 *     (8263441535).jpg", CC BY 2.0 (under the umbrella: the column, the
 *     hanging ring, the soffit, the lattice storey over the glazed ground
 *     floor);
 *     https://commons.wikimedia.org/wiki/File:Museo_Nacional_de_Antropolog%C3%ADa_(El_Paragua)_(8263441535).jpg
 *   3 Nan Palmero, "Museo Nacional de Antropología (46734417554).jpg",
 *     CC BY 2.0 (the cascade, the soffit's hips, the lobby's glazed patio
 *     front with its marble band, the stone walls).
 *     https://commons.wikimedia.org/wiki/File:Museo_Nacional_de_Antropolog%C3%ADa_(46734417554).jpg
 *   4 opheliarossetti, "Paraguas del Museo Nacional de Antropología.jpg",
 *     CC BY-SA 3.0.
 *     https://commons.wikimedia.org/wiki/File:Paraguas_del_Museo_Nacional_de_Antropolog%C3%ADa.jpg
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s);
 *   the museum is on the flat floor of the basin in Chapultepec (~2,240 m).
 * - Plan: OSM throughout (walls, the umbrella's rectangle and oculus);
 *   the front block's patio face is 13 m east of the halls' ends, the
 *   gardens between them (photo 1.3); its first 8 m, under the umbrella's
 *   edge, is drawn as a lower lobby strip (9.8 m), since photo 1.5 shows
 *   the umbrella standing clear above the entrance block's roof there. The pool, 37 x 17 m, and the marble
 *   walk, 5.6 m wide, scaled from photo 1.4 against the patio's width.
 * - Estimated heights (no published figures found), from photos 1.2, 1.5
 *   and 2: halls and entrance block 13 m; ground floor 5.5 m, the lattice
 *   storey 6.5-12.5 m; the umbrella's fascia 16-19 m (a fascia's depth
 *   clear above the halls' roofs in photo 1.5), its soffit rising to
 *   17.4 m at the ring; the hanging ring 3 m deep; the column 3 m across,
 *   standing about 10 m above the roof (photos 1.2, 1.5); the tie rods
 *   meet it at 28.2 m.
 * - Doubts: the halls' roofs are drawn flat at one height (photo 1.5 shows
 *   small steps and rooftop plant, left out); the outer walls' recessed
 *   base is left out; the lattice is drawn as bold vertical blades at 2 m
 *   with rails, not Felguérez's serpent pattern; the fascia's fins are
 *   drawn every 3 m, sparser than real; the caracol sculpture and the rain cascade are left
 *   out.
 *
 * Night: the glazed ground floors and the glass behind the lattice are
 *   `window` and glow; the umbrella is floodlit from below.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { extrude, prism, rect, save, tube, type XY } from './dc-wwii-memorial'

const stone = new Part(), roof = new Part(), win = new Part(), alu = new Part(), marble = new Part(), bronze = new Part()

// Plan, in the turned frame before centring (OSM, metres).
const RING: XY[] = [[79.0, 48.5], [-72.9, 48.5], [-73.0, 15.7], [-111.4, 15.8], [-111.5, -33.1], [-99.1, -33.1], [-99.2, -65.3], [19.1, -65.3], [19.1, -61.8], [36.4, -61.8], [36.4, -66.4], [78.6, -66.5], [78.7, -29.2], [31.9, -29.2], [31.9, -33.5], [-54.1, -33.4], [-54.0, 15.8], [31.8, 15.8], [31.8, 11.1], [78.9, 11.1]]
const FRONT: XY[] = [[100.0, 72.8], [141.0, 72.9], [141.4, -62.8], [100.0, -62.9]]
// The lobby's lower west strip, under the umbrella's east edge.
const LOBBY: XY[] = [[92.0, 72.7], [100.0, 72.8], [100.0, -62.9], [92.3, -63.0]]
const AXIS = -8.1 // the patio's (and the umbrella's) centre line
const H = 13 // halls and entrance block

// ---- The halls and the entrance block: stone walls, flat roofs. ----
for (const [poly, h] of [[RING, H], [FRONT, H], [LOBBY, 9.8]] as [XY[], number][]) {
  extrude(stone, poly, 0, h - 0.3, undefined, { caps: [false, false] })
  extrude(roof, poly, h - 0.3, h, undefined, { caps: [false, true] })
}

/** A panel flat on a wall facing +y (s = 1) or -y (s = -1) at y. */
function wallY(p: Part, y: number, s: number, x0: number, x1: number, z0: number, z1: number, off = 0.04) {
  const yy = y + s * off
  if (s > 0) p.quad([x1, yy, z0], [x0, yy, z0], [x0, yy, z1], [x1, yy, z1])
  else p.quad([x0, yy, z0], [x1, yy, z0], [x1, yy, z1], [x0, yy, z1])
}
/** The same on a wall facing +x (s = 1) or -x (s = -1) at x. */
function wallX(p: Part, x: number, s: number, y0: number, y1: number, z0: number, z1: number, off = 0.04) {
  const xx = x + s * off
  if (s > 0) p.quad([xx, y0, z0], [xx, y1, z0], [xx, y1, z1], [xx, y0, z1])
  else p.quad([xx, y1, z0], [xx, y0, z0], [xx, y0, z1], [xx, y1, z1])
}

// ---- The patio's long walls: glazed ground floor, lattice storey. ----
// North wall faces -y (into the patio), south wall faces +y.
const PATIO_WALLS: [number, number, number, number][] = [
  // [y, facing, x0, x1]
  [15.8, -1, -54.0, 31.8], [11.1, -1, 31.8, 78.9],
  [-33.4, 1, -54.1, 31.9], [-29.2, 1, 31.9, 78.7],
]
for (const [y, s, x0, x1] of PATIO_WALLS) {
  // Ground floor: glass in bays of about 8 m between stone piers.
  const n = Math.round((x1 - x0) / 8), w = (x1 - x0) / n
  for (let k = 0; k < n; k++) wallY(win, y, s, x0 + k * w + 0.6, x0 + (k + 1) * w - 0.6, 0.3, 5.5)
  // Glass behind the lattice.
  wallY(win, y, s, x0 + 0.5, x1 - 0.5, 6.5, 12.4)
  // The lattice: blades standing off the wall, between two rails.
  const d0 = 0.15, d1 = 1.0
  for (let x = x0 + 1.2; x < x1 - 0.8; x += 2.0)
    prism(alu, [[x - 0.2, y + s * d0], [x + 0.2, y + s * d0], [x + 0.2, y + s * d1], [x - 0.2, y + s * d1]], 6.3, 12.6, 0)
  for (const [z0, z1] of [[6.0, 6.5], [12.4, 12.9]])
    prism(alu, [[x0 + 0.3, y + s * 0.02], [x1 - 0.3, y + s * 0.02], [x1 - 0.3, y + s * 1.15], [x0 + 0.3, y + s * 1.15]], z0, z1, 0.05)
}

// ---- The Sala Mexica's front at the west end: glass under a canopy. ----
wallX(win, -54.05, 1, -30, 13, 0.3, 6.0)
prism(stone, rect(-51.5, AXIS, 2.6, 22.5), 11.6, 12.4, 0.15)

// ---- The pool's rim and the white marble walk out into it. ----
{
  const x0 = -35.5, x1 = 1.5, y0 = AXIS - 8.5, y1 = AXIS + 8.5, w = 0.6, h = 0.5
  prism(stone, [[x0, y0], [x1, y0], [x1, y0 + w], [x0, y0 + w]], 0, h, 0.05)
  prism(stone, [[x0, y1 - w], [x1, y1 - w], [x1, y1], [x0, y1]], 0, h, 0.05)
  prism(stone, [[x0, y0 + w], [x0 + w, y0 + w], [x0 + w, y1 - w], [x0, y1 - w]], 0, h, 0.05)
  prism(stone, [[x1 - w, y0 + w], [x1, y0 + w], [x1, y1 - w], [x1 - w, y1 - w]], 0, h, 0.05)
  prism(marble, rect(-38.5, AXIS, 11.0, 2.8), 0, 0.7, 0.1)
}

// ---- The entrance block's patio face, under the umbrella. ----
wallX(win, 92.1, -1, AXIS - 21, AXIS + 21, 0.3, 5.5)
wallX(marble, 92.1, -1, AXIS - 21, AXIS + 21, 5.5, 9.5)

// ---- The entrance front on the plaza: white marble over glass doors. ----
prism(marble, rect(145.0, AXIS, 4.2, 16.5, 0, 0.3), 5.5, 12.4, 0.3)
prism(win, rect(143.2, AXIS, 2.2, 15.8), 0, 5.5, 0)
// The national emblem: a round relief on the marble.
tube(marble, [[149.2, AXIS, 9.0], [149.55, AXIS, 9.0]], [2.4, 2.4], undefined, 16)

// ---- El Paraguas. ----
const UX0 = 16.1, UX1 = 98.8, UY0 = -35.5, UY1 = 19.3
const CX = 57.8, CY = -7.9, RO = 5.6 // the oculus round the column
const ZF0 = 16.0, ZF1 = 19.0, ZS = 17.4 // fascia, and the soffit at the ring
{
  const N = 32
  // Where the ray from the column at angle a leaves the roof's rectangle.
  const edge = (a: number): [number, number] => {
    const dx = Math.cos(a), dy = Math.sin(a)
    const tx = dx > 0 ? (UX1 - CX) / dx : dx < 0 ? (UX0 - CX) / dx : Infinity
    const ty = dy > 0 ? (UY1 - CY) / dy : dy < 0 ? (UY0 - CY) / dy : Infinity
    const t = Math.min(tx, ty)
    return [CX + dx * t, CY + dy * t]
  }
  // Sample the rectangle at its corners too, so they stay square.
  const corners = [[UX1, UY0], [UX1, UY1], [UX0, UY1], [UX0, UY0]].map(([x, y]) => Math.atan2(y - CY, x - CX))
  const angs = [...Array.from({ length: N }, (_, i) => (i / N) * 2 * Math.PI - Math.PI), ...corners].sort((a, b) => a - b)
  const M = angs.length
  const out = angs.map(edge), inn = angs.map(a => [CX + RO * Math.cos(a), CY + RO * Math.sin(a)])
  for (let i = 0; i < M; i++) {
    const j = (i + 1) % M
    const [ox0, oy0] = out[i], [ox1, oy1] = out[j], [ix0, iy0] = inn[i], [ix1, iy1] = inn[j]
    // Top, flat, facing up.
    alu.quad([ix0, iy0, ZF1], [ox0, oy0, ZF1], [ox1, oy1, ZF1], [ix1, iy1, ZF1])
    // Soffit, rising to the ring, facing down.
    alu.quad([ix1, iy1, ZS], [ox1, oy1, ZF0], [ox0, oy0, ZF0], [ix0, iy0, ZS])
    // Fascia, facing out.
    alu.quad([ox0, oy0, ZF0], [ox1, oy1, ZF0], [ox1, oy1, ZF1], [ox0, oy0, ZF1])
    // The oculus's lining, facing the column.
    bronze.quad([ix1, iy1, ZS], [ix0, iy0, ZS], [ix0, iy0, ZF1], [ix1, iy1, ZF1])
  }
}
// The fascia's vertical aluminium fins, every 3 m round the edge.
{
  const fin = (x: number, y: number, nx: number, ny: number) => {
    const tx = -ny, ty = nx, w = 0.25, d = 0.45
    prism(alu, [[x - tx * w, y - ty * w], [x + tx * w, y + ty * w], [x + tx * w + nx * d, y + ty * w + ny * d], [x - tx * w + nx * d, y - ty * w + ny * d]], ZF0 - 0.3, ZF1, 0)
  }
  for (let x = UX0 + 1.5; x < UX1 - 1; x += 3) { fin(x, UY1, 0, 1); fin(x, UY0, 0, -1) }
  for (let y = UY0 + 1.5; y < UY1 - 1; y += 3) { fin(UX1, y, 1, 0); fin(UX0, y, -1, 0) }
}
// The hanging steel ring under the oculus.
{
  const n = 24, r0 = RO - 0.1, r1 = RO + 0.5, z0 = ZS - 3.0
  const P = (r: number, a: number, z: number): V3 => [CX + r * Math.cos(a), CY + r * Math.sin(a), z]
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * 2 * Math.PI, a1 = ((i + 1) / n) * 2 * Math.PI
    bronze.quad(P(r1, a0, z0), P(r1, a1, z0), P(r1, a1, ZS), P(r1, a0, ZS))
    bronze.quad(P(r0, a1, z0), P(r0, a0, z0), P(r0, a0, ZS), P(r0, a1, ZS))
    bronze.quad(P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z0), P(r1, a0, z0))
  }
  // Radial spokes from the column to the ring.
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * 2 * Math.PI
    tube(bronze, [P(1.4, a, ZS - 0.8), P(r0, a, ZS - 0.8)], [0.25, 0.25], [0.6, 0.6], 4)
  }
}
// The column, and its head above the roof.
tube(bronze, [[CX, CY, 0], [CX, CY, 28.5]], [1.5, 1.4], undefined, 16)
tube(bronze, [[CX, CY, 28.5], [CX, CY, 29.4]], [1.8, 1.8], undefined, 16)
// The tie rods fanning from the column's head to the roof.
{
  const n = 20
  for (let k = 0; k < n; k++) {
    const a = ((k + 0.5) / n) * 2 * Math.PI
    const end: V3 = [CX + 34 * Math.cos(a), CY + 21 * Math.sin(a), ZF1 + 0.2]
    tube(alu, [[CX, CY, 28.2], end], [0.3, 0.3], undefined, 4)
  }
}

// ---- Centre on the anchor (the two outlines' area centroid). ----
const AX = 25.6, AY = -5.6
const parts = [stone, roof, win, alu, marble, bronze]
for (const p of parts) for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] -= AX; p.pos[i + 2] += AY }

const underLit = (p: V3, n: V3) => (n[2] < -0.5 ? 0.7 : 0.2)
await save('mexico-city-anthropology-museum', 'Museo Nacional de Antropología', [
  { part: stone, material: finish('chiluca-stone', 0xd5ccbd) },
  { part: roof, material: finish('pale-roof', 0xaab0b3) },
  { part: win, material: PALETTE.window },
  { part: alu, material: { ...finish('aluminium', 0xeceeed, 0.5), floodlight: underLit } },
  { part: marble, material: PALETTE.trim },
  { part: bronze, material: finish('bronze', 0x5f5a52, 0.6) },
], { bearing: 9.3 }, 6500)
