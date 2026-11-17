/**
 * Trellick Tower, Golborne Road, London W10: procedural, CC0-1.0.
 * bun generators/london-trellick-tower.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 23, so the
 * slab's long axis (bearing 113) is the model's x axis: the balcony face is
 * the model's south (-y), the corridor face its north (+y), the service
 * tower at the west (-x) end. The origin is the centroid of the slab's OSM
 * outline (way/57721739). y = 0 is the lowest ground under the footprint:
 * the sunken south side of the estate; the Golborne Road side, north, is
 * 5.4 m higher (lidar) and the north walls run down into it.
 * Built 1968-72 (Ernő Goldfinger for the GLC), listed Grade II* (NHLE 1246373).
 *
 * Published (Wikipedia "Trellick Tower"): 98 m, 31 storeys, 217 flats; the
 * lifts and stairs are in the separate service tower, joined to the slab by
 * a bridge on every third floor, with the boiler house cantilevered from
 * its top.
 *
 * Measured, Environment Agency LIDAR Composite DSM/DTM 1 m (Open Government
 * Licence v3.0):
 * - ground: 0.3 m south of the slab (y = 0 here), 5.7 m north, the
 *   two-storey podium on the south side roofed at 6.0 m (it is a deck at
 *   the north ground level);
 * - slab roof 89.5 m (84 m above Golborne Road), service tower top 100.1 m
 *   (published 98 m is from the street: 94.7 m here), a flue to 103.9 m;
 * - the gap between slab and service tower reads ground (6-8 m wide).
 *   The lidar outlines sit about 3 m north of OSM's; OSM's are used.
 *
 * From photos (heights scaled from the lidar roofs; the bridge interval of
 * three floors, 8.16 m, as the unit):
 * - 31 storeys of 2.72 m above the north ground; bridges at floors 2, 5, ...,
 *   26 (nine), each a box 3.75 m deep with a window strip, open sky
 *   between them;
 * - the boiler house: a box cantilevered west off the service tower, nearly its full depth (3.5 m in the photo, drawn 4.5 m so it reads at phone size),
 *   85.2-95.7 m, a window band 89.0-93.0 m, its soffit a wedge back to the
 *   shaft at 78 m; the shaft's top stepped, 100.1 and 100.9 m;
 * - the balcony face: five bays between piers, deep balcony slabs, some
 *   balcony fronts painted (red-orange is the commonest in the photos); the
 *   corridor face: window bands with the corridor floor plain between;
 * - the end walls: board-marked concrete with a stack of windows.
 *
 * Estimated: bay widths (photos), band depths, service tower plan inside
 * OSM's outline (8.2 x 10 m shaft, a 3-storey base block filling the
 * outline), which balconies are coloured (a fixed pattern, not a survey).
 * Abstracted: one balcony slab per three floors (the real slabs are every
 * floor; drawn per floor they would be pinstripes at map distance).
 * Left out: aerials,
 * railings, the entrance canopy.
 *
 * OSM: way/57721739 (slab outline, with its south podium part
 * way/777427856), way/85866116 (service tower).
 *
 * Night: flats' windows and the boiler house band glow (`window`).
 *
 * Photos (Wikimedia Commons), EVIDENCE:
 * - "Trellick Tower front view.jpg", Ethan Nunn, CC BY-SA 4.0 (from the south-west, telephoto: bridges, boiler house)
 * - "Trellick Tower - 2025-11-02.jpg", Sludge G, CC BY-SA 4.0 (balcony face, end wall)
 * - "Trellick Tower south.jpg", Graeme Maclean, CC BY 2.0 (balcony face, coloured panels)
 * - "Trellick Tower north side HDR.jpg", Graeme Maclean, CC BY 2.0 (corridor face)
 * - "Trellick Tower west side.jpg", Graeme Maclean, CC BY 2.0 (service tower from the west)
 * - "Trellick Tower 06.JPG", Edwardx, CC BY-SA 3.0 (entrance, concrete)
 * - "Trellick Tower 2.jpg", Rc1959, CC0 (entrance)
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const conc = new Part()   // board-marked concrete
const deep = new Part()   // shadowed recesses: soffits, balcony backs
const win = new Part()
const roof = new Part()
const paint = new Part()  // coloured balcony fronts

/** Axis-aligned box. Faces listed in `skip` ('n','s','e','w','t','b') are left off. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, skip = '') {
  const c = (x: number, y: number, z: number): V3 => [x, y, z]
  if (!skip.includes('s')) p.quad(c(x0, y0, z0), c(x1, y0, z0), c(x1, y0, z1), c(x0, y0, z1))
  if (!skip.includes('n')) p.quad(c(x1, y1, z0), c(x0, y1, z0), c(x0, y1, z1), c(x1, y1, z1))
  if (!skip.includes('e')) p.quad(c(x1, y0, z0), c(x1, y1, z0), c(x1, y1, z1), c(x1, y0, z1))
  if (!skip.includes('w')) p.quad(c(x0, y1, z0), c(x0, y0, z0), c(x0, y0, z1), c(x0, y1, z1))
  if (!skip.includes('t')) p.quad(c(x0, y0, z1), c(x1, y0, z1), c(x1, y1, z1), c(x0, y1, z1))
  if (!skip.includes('b')) p.quad(c(x0, y1, z0), c(x1, y1, z0), c(x1, y0, z0), c(x0, y0, z0))
}
/** A flat panel on a wall facing 'n','s','e' or 'w', 0.04 m proud. */
function panel(p: Part, face: string, at: number, a0: number, a1: number, z0: number, z1: number) {
  const o = 0.04
  if (face === 's') p.quad([a0, at - o, z0], [a1, at - o, z0], [a1, at - o, z1], [a0, at - o, z1])
  if (face === 'n') p.quad([a1, at + o, z0], [a0, at + o, z0], [a0, at + o, z1], [a1, at + o, z1])
  if (face === 'e') p.quad([at + o, a0, z0], [at + o, a1, z0], [at + o, a1, z1], [at + o, a0, z1])
  if (face === 'w') p.quad([at - o, a1, z0], [at - o, a0, z0], [at - o, a0, z1], [at - o, a1, z1])
}

// ------------------------------------------------------------- dimensions ---
const X0 = -23.2, X1 = 22.3, YS = -3.2, YN = 10.4   // slab (OSM)
const G = 5.4, FL = 2.72, NG = 10, GROUP = 3 * FL      // north ground, storey, groups of three
const ROOF = G + 31 * FL                               // 89.7
const BAL = 1.3                                       // balcony depth, drawn inside the outline
const PIERS = [X0, -14.1, -5.0, 4.1, 13.2, X1]        // five bays on the long faces

// ------------------------------------------------------------------ podium ---
// The two-storey block on the south side (way/777427856), its roof a deck.
box(conc, -20.1, X1, -10.8, YS, 0, 6.0, 'n')
for (let i = 0; i < 5; i++) panel(win, 's', -10.8, -18.6 + i * 8.0, -12.4 + i * 8.0, 1.6, 4.4)
panel(win, 'e', X1, -9.8, -4.2, 1.6, 4.4)

// ------------------------------------------------------------------- slab ---
// The core block, its south face set back by the balcony depth.
box(conc, X0, X1, YS + BAL, YN, 0, ROOF, 's')
// South (balcony) face: below the north ground a plain wall with a window
// band; above, per group of three storeys, recessed glazing behind deep
// balcony slabs, piers between bays.
deep.quad([X0, YS + BAL, 0], [X1, YS + BAL, 0], [X1, YS + BAL, ROOF], [X0, YS + BAL, ROOF])
box(conc, X0, X1, YS, YS + BAL, 0, G, 'n')
for (let b = 0; b < PIERS.length - 1; b++) panel(win, 's', YS, PIERS[b] + 1.2, PIERS[b + 1] - 1.2, 1.4, 4.2)
for (const x of PIERS) {
  const a = x === X0 ? X0 : x === X1 ? X1 - 1.1 : x - 0.55
  box(conc, a, a + 1.1, YS, YS + BAL, G, ROOF - FL, 'n')
}
for (let g = 0; g < NG; g++) {
  const z = G + g * GROUP
  // The balcony slab with its front upstand, at the top of the group.
  box(conc, X0, X1, YS, YS + BAL, z + GROUP - 1.6, z + GROUP, 'n')
  // A lighter slab line between, at the second storey's balconies, so the
  // storey rhythm shows without a line per floor.
  box(conc, X0, X1, YS + 0.3, YS + BAL, z + FL + 0.6, z + FL + 1.2, 'n')
  // Glazing on the recessed wall, one panel per storey pair between the slabs.
  for (let b = 0; b < PIERS.length - 1; b++) {
    const a0 = PIERS[b] + 0.75, a1 = PIERS[b + 1] - 0.75
    panel(win, 's', YS + BAL, a0, a1, z + 0.3, z + FL + 0.5)
    panel(win, 's', YS + BAL, a0, a1, z + FL + 1.3, z + GROUP - 1.7)
    // Painted balcony fronts: a fixed scatter over the face.
    if ((g * 3 + b * 2) % 5 === 1 || (g + b) % 7 === 3) panel(paint, 's', YS, a0 + 0.4, a1 - 0.4, z + GROUP - 1.5, z + GROUP - 0.1)
  }
}
// The top storey: a plain parapet band, flush with the slab fronts.
box(conc, X0, X1, YS, YS + BAL, ROOF - FL, ROOF + 0.5, 'n')
// North (corridor) face: per group, glazing over the two flat storeys and
// a plain corridor storey with a narrow window strip.
for (let g = 0; g < NG; g++) {
  const z = G + g * GROUP
  for (let b = 0; b < PIERS.length - 1; b++) {
    const a0 = PIERS[b] + 0.8, a1 = PIERS[b + 1] - 0.8
    panel(win, 'n', YN, a0, a1, z + 0.4, z + 2 * FL - 0.4)
    panel(win, 'n', YN, a0 + 1.5, a1 - 1.5, z + 2 * FL + 0.9, z + 2 * FL + 1.7)
  }
  // The corridor floor's band stands a little proud.
  box(conc, X0, X1, YN, YN + 0.35, z + 2 * FL - 0.1, z + GROUP + 0.1, 's')
}
// End walls: a stack of windows per storey group, toward the south side.
for (let g = 0; g < NG; g++) {
  const z = G + g * GROUP
  panel(win, 'e', X1, YS + 2.0, YS + 5.6, z + 0.6, z + GROUP - 0.8)
  panel(win, 'w', X0, YS + 2.0, YS + 5.6, z + 0.6, z + GROUP - 0.8)
}
// Roof: parapet ring and the flat roof.
box(roof, X0 + 0.6, X1 - 0.6, YS + 0.6, YN - 0.6, ROOF - 0.01, ROOF + 0.15, 'b')
box(conc, X0, X1, YN - 0.6, YN, ROOF, ROOF + 0.5, 'b')
box(conc, X0, X0 + 0.6, YS + 0.6, YN - 0.6, ROOF, ROOF + 0.5, 'b')
box(conc, X1 - 0.6, X1, YS + 0.6, YN - 0.6, ROOF, ROOF + 0.5, 'b')
box(conc, X0, X1, YS, YS + 0.6, ROOF + 0.4, ROOF + 0.5, 'b')
// Lift motor room on the slab roof.
box(conc, -6, 2, 3.0, 8.0, ROOF, ROOF + 2.6, 'b')

// ---------------------------------------------------------- service tower ---
const TX0 = -37.9, TX1 = -29.7, TY0 = 3.0, TY1 = 13.0, TOP = 100.1
// The base block, filling OSM's outline, three storeys above the north ground.
box(conc, -41.7, TX1, 2.4, 13.7, 0, G + 8.0)
panel(win, 's', 2.4, -40.5, -31.0, G + 4.6, G + 6.6)
panel(win, 'w', -41.7, 3.6, 12.5, G + 4.6, G + 6.6)
// The shaft, its top stepped.
box(conc, TX0, TX1, TY0, TY1, G + 8.0, TOP, 'b')
box(conc, TX0 + 1.0, TX0 + 5.0, TY0 + 1.0, TY1 - 1.0, TOP, TOP + 0.8, 'b')
box(conc, TX0 + 3.0, TX0 + 4.4, TY1 - 3.0, TY1 - 1.6, TOP, 103.9, 'b') // the flue
// Slot windows of the stair: two staggered columns of short slots on the south and north faces.
for (const yf of ['s', 'n']) {
  const at = yf === 's' ? TY0 : TY1
  for (let z = G + 12; z < 80; z += GROUP / 2) {
    panel(win, yf, at, -36.4, -35.6, z, z + 2.0)
    panel(win, yf, at, -33.6, -32.8, z + GROUP / 4, z + GROUP / 4 + 2.0)
  }
}
// The boiler house: cantilevered west, a window band, the wedge soffit.
{
  const BX = TX0 - 4.5, BY0 = 3.4, BY1 = 12.6, BZ0 = 85.2, BZ1 = 95.7
  box(conc, BX, TX0, BY0, BY1, BZ0, BZ1, 'e')
  box(conc, BX - 0.15, TX0, BY0 - 0.15, BY1 + 0.15, BZ1 - 0.4, BZ1 + 0.3, 'e') // parapet lip
  panel(win, 'w', BX, BY0 + 0.6, BY1 - 0.6, 89.0, 93.0)
  panel(win, 's', BY0, BX + 0.3, TX0 - 0.3, 89.0, 93.0)
  panel(win, 'n', BY1, BX + 0.3, TX0 - 0.3, 89.0, 93.0)
  // Wedge: from the box's underside edge at x = BX down to the shaft at 78 m.
  const W = 78.0
  deep.quad([TX0, BY1, W], [TX0, BY0, W], [BX, BY0, BZ0], [BX, BY1, BZ0])     // sloping soffit, facing down-west
  conc.tri([BX, BY0, BZ0], [TX0, BY0, W], [TX0, BY0, BZ0])                    // south cheek
  conc.tri([TX0, BY1, BZ0], [TX0, BY1, W], [BX, BY1, BZ0])                    // north cheek
}

// ---------------------------------------------------------------- bridges ---
// One on every third floor (floors 2 to 26), spanning the gap; a deep
// spandrel with a window strip, the sky showing between them.
for (let f = 2; f <= 26; f += 3) {
  const z = G + f * FL, by0 = 4.6, by1 = 8.8
  box(conc, TX1, X0, by0, by1, z - 1.0, z + 2.75, 'ew')
  panel(win, 's', by0, TX1 + 0.4, X0 - 0.4, z + 1.5, z + 2.4)
  panel(win, 'n', by1, TX1 + 0.4, X0 - 0.4, z + 1.5, z + 2.4)
}

// ---------------------------------------------------------------- output ---
// Colours from daylight photos: the board-marked concrete is a warm
// grey-brown, pulled to the palette's lightness; recesses and soffits a
// shade darker; the painted balcony fronts a muted red-orange.
const parts = [
  { part: conc, material: finish('trellick-concrete', 0x978c7c) },
  { part: deep, material: finish('trellick-shadow', 0x6f675d) },
  { part: win, material: { ...PALETTE.window, color: 0x7a8a97 } },
  { part: roof, material: PALETTE.roof },
  { part: paint, material: finish('trellick-balcony-red', 0xc0644a) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Trellick Tower', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 23, elevation: 0, height: 103.9,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/london-trellick-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
