/**
 * Museo Jumex, Blvd. Miguel de Cervantes Saavedra 303, Nuevo Polanco,
 * Mexico City (David Chipperfield Architects, 2013): procedural, CC0-1.0.
 *   bun generators/mexico-city-museo-jumex.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 346.5 (the
 * long east wall in OSM), so the model's -x is the west entrance front on
 * the plaza and +y runs along it. Origin: the centroid of the OSM building
 * outline, at plaza level.
 *
 * Form: a pale travertine block lifted on round pilotis over a recessed
 * glass ground floor; two gallery storeys, then a top storey that steps
 * out a little all round; a sawtooth roof of five teeth whose sloped faces
 * look west, each with a skylight strip under its ridge, so the side walls
 * show the tooth profile. Deep terrace openings are cut into the first
 * gallery storey on the west front and the north side, and a tall slot
 * window into the north side above.
 *
 * Sources
 * - OSM (ODbL): way/885052520 (building=museum, architect David
 *   Chipperfield, levels 8, concrete, colour wheat, roof:shape=sawtooth,
 *   roof:orientation=across), inside the museum site way/251841831 (not a
 *   building). The outline is a rough trapezoid (sides 39, 38, 38, 20 m);
 *   the model is a 28 x 38 m rectangle of about the same area on
 *   its centroid, aligned with its east side, which looked the most
 *   reliable edge.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 Fundación Jumex, "DJI 0040-HDR cropped.jpg", CC BY 4.0 (drone,
 *     level, the west front: storeys, lip, terrace opening, pilotis, the
 *     tooth profiles at both side edges, the skylight strip);
 *     https://commons.wikimedia.org/wiki/File:DJI_0040-HDR_cropped.jpg
 *   2 Luisalvaz, "Vista del Museo Jumex desde el Museo Soumaya.JPG",
 *     CC BY-SA 4.0 (from the north-west: the sawtooth in profile on the
 *     north side, the north terrace and slot, the overhang);
 *     https://commons.wikimedia.org/wiki/File:Vista_del_Museo_Jumex_desde_el_Museo_Soumaya.JPG
 *   3 Fundación Jumex, "Museo Jumex exterior.png", CC BY-SA 4.0, and
 *     OliAzor, "Vista del museo Jumex.jpg", CC BY 4.0 (the travertine
 *     colour, the glass ground floor and columns).
 *     https://commons.wikimedia.org/wiki/File:Museo_Jumex_exterior.png
 *     https://commons.wikimedia.org/wiki/File:Vista_del_museo_Jumex.jpg
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s);
 *   Nuevo Polanco is on the flat lake-bed basin (~2,240 m).
 * - Estimated from photos 1-2 (scaled from the 28 m front): pilotis 4 m,
 *   gallery storeys to 20 m, top storey to 30 m stepping out 0.8 m,
 *   teeth 4.5 m high, so 34.5 m overall (no published height found); column
 *   spacing about 9 m; the west terrace 12 x 6 m, 5 m deep.
 * - Doubts: the footprint (OSM outline is rough); the south and east sides
 *   are not photographed and are drawn plain; the east-facing vertical
 *   faces of the teeth are drawn in travertine.
 *
 * Night: the glass ground floor and the terrace glazing are `window` and
 *   glow; skylights are `glass` and stay dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { extrude, prism, rect, save, tube, type XY } from './dc-wwii-memorial'

const trav = new Part(), win = new Part(), sky = new Part(), col = new Part()

const HX = 19, HY = 14 // half depth (x, west-east) and half width (y)
const Z1 = 4.0, ZO0 = 5.5, ZO1 = 11.5, Z2 = 20.0, Z3 = 30.0, ZT = 34.5, OV = 0.8

// ---- Ground floor: a glass box set back under the block, and pilotis. ----
prism(win, rect(0, 0, HX - 3.2, HY - 3.0), 0, Z1, 0)
for (const y of [-9, 0, 9]) for (const x of [-HX + 1.3, HX - 1.3])
  tube(col, [[x, y, 0], [x, y, Z1]], [0.75, 0.75], undefined, 12)
for (const x of [-11, 0, 11]) for (const y of [-HY + 1.3, HY - 1.3])
  tube(col, [[x, y, 0], [x, y, Z1]], [0.75, 0.75], undefined, 12)

// ---- The gallery storeys, with the terrace notches cut in. ----
prism(trav, rect(0, 0, HX, HY), Z1, ZO0, 0)
const notched: XY[] = [
  [-HX, -HY], [HX, -HY], [HX, HY], [6, HY], [6, HY - 4], [-12, HY - 4], [-12, HY],
  [-HX, HY], [-HX, 6], [-HX + 5, 6], [-HX + 5, -6], [-HX, -6],
]
extrude(trav, notched, ZO0, ZO1, undefined, { caps: [false, false] })
// Soffits and floors of the notches.
const flat = (p: Part, x0: number, x1: number, y0: number, y1: number, z: number, up: boolean) => {
  const q: V3[] = [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  if (up) p.quad(q[0], q[1], q[2], q[3]); else p.quad(q[3], q[2], q[1], q[0])
}
flat(trav, -HX, -HX + 5, -6, 6, ZO0, true); flat(trav, -HX, -HX + 5, -6, 6, ZO1, false)
flat(trav, -12, 6, HY - 4, HY, ZO0, true); flat(trav, -12, 6, HY - 4, HY, ZO1, false)
// Glazing at the back of each terrace.
{
  const x = -HX + 5 - 0.05
  win.quad([x, 6, ZO0], [x, -6, ZO0], [x, -6, ZO1], [x, 6, ZO1])
  const y = HY - 4 + 0.05
  win.quad([6, y, ZO0], [-12, y, ZO0], [-12, y, ZO1], [6, y, ZO1])
}
prism(trav, rect(0, 0, HX, HY), ZO1, Z2, 0.3)
// The slot window on the north side of the second storey.
{
  const y = HY + 0.04
  win.quad([-1.5, y, 13], [-3.5, y, 13], [-3.5, y, 19], [-1.5, y, 19])
}

// ---- The top storey, stepping out all round. ----
prism(trav, rect(0, 0, HX + OV, HY + OV, 0, 0.3), Z2, Z3, 0.3)

// ---- The sawtooth roof: five teeth across the depth, slopes facing west. ----
{
  const X0 = -HX - OV, W = (2 * (HX + OV)) / 5, Y = HY + OV
  for (let k = 0; k < 5; k++) {
    const a = X0 + k * W, b = a + W
    // Sloped face (west-facing), from (a, Z3) up to the ridge (b, ZT).
    trav.quad([a, Y, Z3], [a, -Y, Z3], [b, -Y, ZT], [b, Y, ZT])
    // Vertical east face of the tooth.
    trav.quad([b, -Y, Z3], [b, Y, Z3], [b, Y, ZT], [b, -Y, ZT])
    // Gable triangles on the side walls.
    trav.tri([a, -Y, Z3], [b, -Y, Z3], [b, -Y, ZT])
    trav.tri([a, Y, Z3], [b, Y, ZT], [b, Y, Z3])
    // The skylight strip under the ridge, just proud of the slope.
    const t0 = 0.74, t1 = 0.94, lift = 0.05, m = 1.2
    const P = (t: number, y: number): V3 => [a + (b - a) * t - lift * 0.5, y, Z3 + (ZT - Z3) * t + lift]
    sky.quad(P(t0, Y - m), P(t0, -Y + m), P(t1, -Y + m), P(t1, Y - m))
  }
}

await save('mexico-city-museo-jumex', 'Museo Jumex', [
  { part: trav, material: finish('travertine', 0xe9dfcb) },
  { part: col, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: sky, material: { ...PALETTE.glass, color: 0xb9c6cd } }, // greyer than the library glass: the skylights read grey in photos 1-2
], { bearing: 346.5 }, 5000)
