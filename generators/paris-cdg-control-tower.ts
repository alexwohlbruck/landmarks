/**
 * Paris-Charles de Gaulle Airport, the south control tower (Tour Sud, about
 * 2004; Aéroports de Paris), between Terminal 2 and the southern runways:
 * a slim glazed cylinder carrying the glazed cab under a wide white disc —
 * procedural, CC0-1.0, no textures.
 * bun generators/paris-cdg-control-tower.ts
 *
 * Which tower: CDG has four. Tour Centrale (~75 m, ~1975, at Roissypôle)
 * is the old one; Tour Nord (90 m in OSM, the fluted concrete tower at
 * Terminal 1) and Tour Sud (80 m in OSM, this one) were built about 2004 to
 * control the two runway pairs; the east apron tower is 60 m. The
 * assignment's "80 m tower between T2 and the runways" is Tour Sud: OSM
 * way/52667314, height 80, glass, at 2.57351, 49.00345 (east of the given
 * coordinates, beside the CDG 2 station and the 2C/2E road decks).
 *
 * Map frame: x = east, y = north, z up, metres. Bearing 0 (a round tower).
 * Anchor: the shaft's centre, OSM way/52667314 (2.5735082, 49.0034516).
 * y = 0 is the ground at the shaft (terrain flat there).
 *
 * Evidence
 * - OSM (API map call, November 2026): the shaft way/52667314 (radius
 *   5.5–5.9 m, height 80, building:material glass); the disc
 *   way/1222110810 (building=roof, radius 11.7–12.1 m, white, height 80);
 *   the link block way/1222110811 (3–8 m).
 * - Published: heights ~80–90 m, built about 2004 (pss-archi.eu,
 *   FR-95527-6067; assemblée nationale written answer on the new towers,
 *   2004).
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:Paris_Charles_de_Gaulle_Airport_Control_Tower.jpg
 *     (Arne Müseler, CC BY-SA 3.0 de) from the south-west, close: the glass
 *     shaft and its banding, the cab, the disc;
 *   https://commons.wikimedia.org/wiki/File:Tour_de_contr%C3%B4le_-_a%C3%A9roport_Paris-Charles-de-Gaulle_(juin_2023).jpg
 *     (Benoît Prieur, CC0) from the road decks to the west;
 *   https://commons.wikimedia.org/wiki/File:Paris-Charles_de_Gaulle_Airport_control_tower.jpg
 *     (Avi1111 dr. avishai teicher, CC BY-SA 4.0) from the north-west.
 *
 * Numbers: shaft r 5.7 and disc r 11.9 (OSM); disc top 80 m (OSM); the
 * cab, 6 m of glass leaning out slightly, from 66.8 to 72.6 m, a narrower
 * neck (r 3.6) to 76.4 m, and the disc's lens 3.6 m thick (scaled from Müseler's photo against the shaft's
 * width); the shaft's grey floor bands every ~9.5 m (photo); mast 4 m
 * (estimated).
 * Doubts: the shaft's base, behind the road decks in every photo, is
 * drawn plain.
 */
import { writeLod, newMats, prismRing, type Mats } from './tokyo-haneda-terminal-1'
import { CDG, lathe, tube } from './paris-cdg-terminal-1'
import { type XY } from './nyc-570-lexington'

const R = 5.7, RD = 11.9, TOP = 80

function build(detail: boolean) {
  const M: Mats = newMats(['white', 'win', 'glass', 'metal', 'con'])
  const n = detail ? 48 : 28
  lathe(M.con, [[R, 0], [R, 1.2]], n)
  lathe(M.glass, [[R, 1.2], [R, 66]], n)
  // fine floor bands up the shaft, metal-grey as in the photos
  for (let z = 9.5; z < 64; z += 9.5) lathe(M.metal, [[R + 0.06, z - 0.25], [R + 0.06, z + 0.25]], n)
  if (detail) for (let k = 0; k < 16; k++) { // mullions
    const a = (2 * Math.PI * k) / 16
    prismRing(M.metal, [[-0.12, -0.05], [0.12, -0.05], [0.12, 0.1], [-0.12, 0.1]].map(([s, d]) => [(R + d) * Math.cos(a) - s * Math.sin(a), (R + d) * Math.sin(a) + s * Math.cos(a)] as XY), 1.2, 66, null)
  }
  // the cab (dark-framed glass, leaning out a little), its roof, the neck and the disc
  lathe(M.white, [[R, 66], [R + 0.3, 66.2], [R + 0.3, 66.8]], n)
  lathe(M.win, [[R + 0.15, 66.8], [R + 0.55, 72.6]], n)
  lathe(M.white, [[R + 0.55, 72.6], [R + 0.55, 73.3], [3.6, 73.3]], n)
  lathe(M.metal, [[3.6, 73.3], [3.6, 76.4]], n)
  lathe(M.white, [[3.6, 76.4], [RD - 0.5, 78.5], [RD, 78.9], [RD, 79.3], [RD - 1.4, 79.7], [4, TOP], [0, TOP]], n)
  // radome and mast on the roof
  lathe(M.white, [[1.6, TOP], [1.6, TOP + 1], [1.1, TOP + 2.1], [0, TOP + 2.5]], detail ? 16 : 10, { cx: 2.5, cy: 0 })
  tube(M.metal, [-2.5, 0, TOP], [-2.5, 0, TOP + 4], 0.15, 6)
  // the link block on the north side
  prismRing(M.con, HUT, 0, 8, M.con)
  return [
    { part: M.white, material: CDG.white },
    { part: M.win, material: CDG.window },
    { part: M.glass, material: { ...CDG.glass, color: 0x93abab } },
    { part: M.metal, material: CDG.metal },
    { part: M.con, material: CDG.concrete },
  ]
}

/** way/1222110811, in this frame */
const HUT: XY[] = [[-1.3, 4.9], [1.1, 5.2], [2.6, 4.6], [2.9, 13.1], [1.4, 13.1], [-0.8, 13.1]]

if (import.meta.main) {
  writeLod('Paris-CDG Tour Sud (control tower)', 'paris-cdg-control-tower.glb', build(false), { bearing: 0, osm: 'way/52667314', height: TOP + 4 }, 5000, 250_000)
}
