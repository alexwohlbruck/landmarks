/**
 * Cape Point Old Lighthouse (1860), Cape Point, Cape Town — procedural,
 * CC0-1.0.
 * bun generators/cpt-cape-point-lighthouse.ts
 *
 * Frame: x east, y north, z up, metres; bearing 0 (the tower is round).
 * Origin = centroid of the OSM outline way/350143420, on the paved summit
 * platform the tower stands on (y = 0).
 *
 * The original Cape Point light on the summit of Cape Maclear, inactive
 * since 1919: a short, stout round cast-iron tower (Victoria Foundry,
 * Greenwich, 1857), black on its lower half and white above, a wide
 * saucer-shaped gallery flaring out from the top of the shaft with a thin
 * white railing, a twelve-sided white lantern with big panes, and a low red
 * roof with a red vent and arrow weathervane.
 *
 * Identity, in order: the black-and-white two-tone drum, the flared white
 * gallery saucer, the glazed lantern under its red cap. The saucer is drawn
 * a little thicker than real and the railing as bold posts and a top rail so
 * both survive at 80 px.
 *
 * Which lighthouse. The assignment named way/344538954 at 18.4969 -34.3569;
 * that way is the NEW lighthouse (1919, on Dias Point, 87 m focal height,
 * a square unpainted stone tower — OSM's seamark tags there are the active
 * light's). The old 1860 lighthouse described in the assignment (white
 * cylinder, lantern, on the summit of the peak) is OSM way/350143420
 * ("Cape Point Old Lighthouse", historic=lighthouse, start_date 1860-05-01,
 * ele 816 ft, wikidata Q10966914) at 18.49025 -34.35382, 700 m north-west,
 * matching Wikipedia's coordinates for the old light (34°21′12″S
 * 18°29′25″E). This model is the old lighthouse, placed on way/350143420.
 *
 * Evidence
 *  - OSM way/350143420: a 12-gon of radius 1.72 m (3.45 m across). Anchor =
 *    its centroid. Replaces that way only.
 *  - Published: The Lighthouse Directory (R. Rowlett, ibiblio.org/lighthouse
 *    zaf3.htm), "Cape Point (1)": 1860, inactive since 1919, 8 m round
 *    cylindrical cast iron tower with lantern and gallery, upper half white,
 *    lower half black, lantern white with a red dome, focal plane 249 m.
 *    Wikipedia "Cape Point": in use 1860–1919, 262 m above sea level, the
 *    two lighthouses 700 m apart. The maker's plate (A3alb 07) reads
 *    "Iron tower by Victoria Foundry Co Greenwich ... 1857".
 *  - Proportions estimated from Delso DD 100 (a near-level view of the
 *    upper half, scaled to the 3.45 m shaft: 58.8 px/m) and A3alb 05 and
 *    Reem Al-Kashif (the whole shaft from the platform, wide-angle): black
 *    0–3.1 m, white 3.1–4.9 m, saucer, a straight cone 4.85–5.43 m and a 0.17 m rim to the deck at 5.6 m, 4.8 m across,
 *    lantern base wall 5.6–6.4 m, glazing 6.4–7.55 m, red fascia and roof to
 *    7.95 m, vane 8.5 m; the tower to the roof is about the published 8 m.
 *  - Openings: a small square window either side in the white band and a
 *    round porthole under the saucer (A3alb 05); the door in the black band
 *    is black on black and left out.
 *  - Colours from daylight photos: white, black (pulled to charcoal, the
 *    palette's darkest), signal red roof, pale glass.
 *  - Ground: the tower stands on a small paved platform inside low stone
 *    walls on the rocky summit, about 238–249 m above the sea. No lidar or
 *    NAIP in South Africa, and the map's terrain (Mapterhorn) has no z15
 *    tiles here (tools/terrain.ts 404s), so whether the map's terrain shows
 *    the peak is unknown. The tower is built from y = 0 on its own base with
 *    elevation 0, as the lead asked; the summit's rock and walls are not
 *    modelled.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Antiguo faro, Cape Point, Sudáfrica, 2018-07-23, DD 100.jpg, Diego
 *    Delso, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Antiguo_faro,_Cape_Point,_Sud%C3%A1frica,_2018-07-23,_DD_100.jpg
 *  - Cape Point Lighthouse 1860-1919. 05.JPG, A3alb, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Cape_Point_Lighthouse_1860-1919._05.JPG
 *  - Cape Point Lighthouse 1860-1919. 07.JPG (maker's plate), A3alb,
 *    CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Cape_Point_Lighthouse_1860-1919._07.JPG
 *  - The Old Lighthouse in the Cape of Good Hope.jpg, Reem Al-Kashif,
 *    CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:The_Old_Lighthouse_in_the_Cape_of_Good_Hope.jpg
 *  - Lighthouse Cape Point, South Africa.JPG, S. Lukas, public domain,
 *    https://commons.wikimedia.org/wiki/File:Lighthouse_Cape_Point,_South_Africa.JPG
 *  - Cape point old lighthouse.jpg, thomas_sly, CC BY 2.0,
 *    https://commons.wikimedia.org/wiki/File:Cape_point_old_lighthouse.jpg
 *  - Cape Town (ZA), Cape Point Nature Reserve, Old Cape Point Lighthouse --
 *    2024 -- 3373.jpg, Dietmar Rabich, CC BY-SA 4.0 (lantern close up),
 *    https://commons.wikimedia.org/wiki/File:Cape_Town_(ZA),_Cape_Point_Nature_Reserve,_Old_Cape_Point_Lighthouse_--_2024_--_3373.jpg
 * Look-only references: none. No commercial imagery.
 *
 * Doubts: no level photo shows the whole shaft (the platform walls hide its
 * foot in distant views and the close ones look steeply up), so the black
 * and white band heights are ±0.3 m; OSM's 3.45 m circle sets the scale.
 * Night: the light has been dark since 1919, so the lantern is `glass`
 * (stays dark) and nothing is lit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, walls, cap, lathe, rect, type XY } from './chi-aon-center'
import { face } from './phl-independence-hall'

const ANCHOR: [number, number] = [-34.3538204, 18.4902513]
const white = new Part(), black = new Part(), red = new Part(), glass = new Part(), win = new Part()

const R = 1.72 // shaft radius (OSM)
const BLACK = 3.1, FLARE = 4.85, DECK = 5.6, LW = 6.4, LG = 7.55, ROOF0 = 7.75, ROOF1 = 7.98
const SEG = 16

// shaft: black lower half with a small foot, white above
lathe(black, 0, 0, [[0, 0], [R + 0.08, 0], [R + 0.08, 0.25], [R, 0.3], [R, BLACK]], SEG)
lathe(white, 0, 0, [[R, BLACK], [R, FLARE]], SEG)
// the saucer gallery: a straight conical underside out to a thin rim, then the deck
lathe(white, 0, 0, [[R, FLARE], [2.4, DECK - 0.17], [2.4, DECK], [0, DECK]], SEG)
// lantern: twelve-sided white base wall, glazing, white mullions, red fascia and roof
const LR = 1.6
const ring12 = (r: number): XY[] => Array.from({ length: 12 }, (_, k) => [r * Math.cos((k * Math.PI) / 6 + Math.PI / 12), r * Math.sin((k * Math.PI) / 6 + Math.PI / 12)] as XY)
walls(white, ring12(LR), DECK, LW)
cap(white, ring12(LR), LW) // hidden floor under the glass, keeps the lantern solid
walls(glass, ring12(LR - 0.04), LW, LG)
{
  const C = ring12(LR + 0.02)
  for (const [x, y] of C) {
    const a = Math.atan2(y, x), n: V3 = [Math.cos(a), Math.sin(a), 0], t: V3 = [-Math.sin(a), Math.cos(a), 0], w = 0.08
    face(white, [[x - t[0] * w, y - t[1] * w, LW], [x + t[0] * w, y + t[1] * w, LW], [x + t[0] * w, y + t[1] * w, LG], [x - t[0] * w, y - t[1] * w, LG]], n)
  }
}
{
  const o = ring12(LR + 0.08)
  walls(red, o, ROOF0 - 0.22, ROOF0) // the red band round the top of the glazing
  cap(red, o, ROOF0 - 0.22, false)
  // low red roof: a shallow cone to a small drum, the vent pipe and the vane
  lathe(red, 0, 0, [[LR + 0.08, ROOF0], [1.15, ROOF0 + 0.15], [0.35, ROOF1], [0.35, ROOF1 + 0.08], [0, ROOF1 + 0.08]], 12, Math.PI / 12)
  const v = rect(-0.1, -0.1, 0.1, 0.1)
  walls(red, v, ROOF1, 8.25); cap(red, v, 8.25)
  // the curved vent hood, a bold block bent over to the side
  const hood = rect(-0.14, -0.14, 0.32, 0.14)
  walls(red, hood, 8.18, 8.38); cap(red, hood, 8.38); cap(red, hood, 8.18, false)
  const m = rect(-0.03, -0.03, 0.03, 0.03)
  walls(red, m, 8.38, 8.6); cap(red, m, 8.6)
  // arrow vane, east-west, bold
  for (const s of [1, -1]) {
    face(red, [[-0.5, 0, 8.43], [0.3, 0, 8.43], [0.3, 0, 8.53], [-0.5, 0, 8.53]], [0, s, 0])
    face(red, [[0.3, 0, 8.34], [0.58, 0, 8.48], [0.3, 0, 8.62]], [0, s, 0])
    face(red, [[-0.55, 0, 8.37], [-0.38, 0, 8.37], [-0.38, 0, 8.59], [-0.55, 0, 8.59]], [0, s, 0])
  }
}
// gallery railing: bold white posts and a top rail on the saucer's edge
{
  const RR = 2.25, H = 1.0
  for (let k = 0; k < 12; k++) {
    const a = (k * Math.PI) / 6, x = RR * Math.cos(a), y = RR * Math.sin(a), w = 0.05
    const r = rect(x - w, y - w, x + w, y + w)
    walls(white, r, DECK, DECK + H)
  }
  const o: XY[] = Array.from({ length: SEG }, (_, k) => [(RR + 0.05) * Math.cos((k * 2 * Math.PI) / SEG), (RR + 0.05) * Math.sin((k * 2 * Math.PI) / SEG)] as XY)
  const i: XY[] = o.map(([x, y]) => [x * (RR - 0.05) / (RR + 0.05), y * (RR - 0.05) / (RR + 0.05)] as XY)
  for (const z of [DECK + H - 0.08, DECK + 0.5]) {
    walls(white, o, z, z + 0.08)
    walls(white, [...i].reverse(), z, z + 0.08)
  }
}
// small windows in the white band and a porthole under the saucer
for (const a of [Math.PI * 0.15, Math.PI * 1.15]) {
  const n: V3 = [Math.cos(a), Math.sin(a), 0], t: V3 = [-Math.sin(a), Math.cos(a), 0], d = R + 0.03, w = 0.22
  face(win, [[n[0] * d - t[0] * w, n[1] * d - t[1] * w, 3.85], [n[0] * d + t[0] * w, n[1] * d + t[1] * w, 3.85], [n[0] * d + t[0] * w, n[1] * d + t[1] * w, 4.4], [n[0] * d - t[0] * w, n[1] * d - t[1] * w, 4.4]], n)
}
{
  const a = Math.PI * 0.65, n: V3 = [Math.cos(a), Math.sin(a), 0], t: V3 = [-Math.sin(a), Math.cos(a), 0], d = R + 0.03
  const C: V3 = [n[0] * d, n[1] * d, 4.7]
  for (let k = 0; k < 10; k++) {
    const p = (q: number): V3 => [C[0] + t[0] * 0.17 * Math.cos(q), C[1] + t[1] * 0.17 * Math.cos(q), C[2] + 0.17 * Math.sin(q)]
    face(win, [C, p((k * 2 * Math.PI) / 10), p(((k + 1) * 2 * Math.PI) / 10)], n)
  }
}

await save('cpt-cape-point-lighthouse', 'Cape Point Old Lighthouse', ANCHOR, 0, [
  { part: white, material: finish('lighthouse-white', 0xf2f0ea) },
  { part: black, material: finish('lighthouse-black', 0x4a4f57) },
  { part: red, material: finish('lantern-red', 0xc4413a) },
  { part: glass, material: PALETTE.glass },
  { part: win, material: PALETTE.window },
])
