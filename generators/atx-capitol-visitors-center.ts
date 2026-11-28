/**
 * The Capitol Complex Visitors Center: the old General Land Office Building
 * (1857, Christoph Conrad Stremme, Rundbogenstil with castellated gables),
 * 112 East 11th Street, on the Texas Capitol grounds, Austin — procedural,
 * CC0-1.0, no textures.
 *   bun generators/atx-capitol-visitors-center.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 17.9, the downtown grid
 * (the outline's long axis), so +y runs up the 30 m length towards 12th
 * Street and the long faces look east-south-east (Brazos Street) and
 * west-north-west (the Capitol lawn). Anchor = area centroid of OSM
 * way/42806381, -97.739287, 30.272647. z = 0 is the lowest ground under the
 * footprint, the south-west corner; the lawn rises 1.0 m to the middle of
 * the west face and 1.1 m along the east (lidar ground and the map's terrain
 * agree).
 *
 * Identity: a pale stuccoed block, scored like ashlar, two tall storeys of
 * round-arched windows over a high plinth, an attic of small arched windows,
 * and at each end of both long faces a pavilion crowned by a low stepped,
 * crenellated gable with square merlon blocks at its shoulders — four
 * "castle" gables in all — over a plain gabled roof.
 *
 * Numbers (lidar = USGS 3DEP USGS_LPC_TX_Central_B1_2017_LAS_2019, flown
 * 2017, 0.5 m grid read in this frame; ground 3.9 above the grid's minimum):
 *  - plan x -9.75..9.75, y -15.1..15.0: OSM and lidar;
 *  - eaves 15.2 (lidar 19.1); main ridge along y at x = 0, 19.1 (lidar
 *    23.0); the pavilions' cross roofs over y 5..15 and -15..-5, ridge along
 *    x at 19.3 (lidar 23.2), eaves 15.1 on the end faces (lidar 19.0);
 *  - the castle gables on the long faces: shoulder blocks 1.3 m square in
 *    plan, tops 17.7 (lidar 21.6), the crenellated crest 19.5 at the
 *    pavilion's middle (lidar 23.4), symmetric (lidar). The photos make the
 *    near shoulder look as high as the crest: that is the perspective of a
 *    camera close under the corner;
 *  - storeys, string courses, window heights and widths: scaled on
 *    "highsmith" from the 14.2 m between the lawn and the eaves mid-face:
 *    plinth to 3.2, ground-floor windows 3.7-6.05, a string course at 7.3,
 *    upper windows 8.4-10.7, the attic string at 12.5, attic windows
 *    13.2-14.3; the door arch 1.9 m wide over seven steps;
 *  - bays from both photos: two windows a floor and three small gable
 *    windows on each pavilion, three bays and six attic windows between
 *    them, the door in the middle bay (west face); on the north end two
 *    windows a floor and five attic windows;
 *  - colour: the stucco sampled in "moore" (sun) and "highsmith" (overcast),
 *    pulled to the palette's lightness, #e6e2da. The roof is not seen in
 *    any photo (NAIP was down): the palette's roof grey, estimated.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  moore     "General land office building 2006.jpg", Larry D. Moore,
 *            CC BY 4.0 (from the north-west: the west face and the north end)
 *            https://commons.wikimedia.org/wiki/File:General_land_office_building_2006.jpg
 *  highsmith "The old Texas General Land Office Building, now the Texas
 *            Capitol Visitors Center ...", Carol M. Highsmith, public domain
 *            (the same side, from further off)
 *            https://commons.wikimedia.org/wiki/File:The_old_Texas_General_Land_Office_Building,_now_the_Texas_Capitol_Visitor_Center,_in_Austin,_Texas_LCCN2014632482.tif
 * Look-only (CC BY-NC-ND, not relied on): wallyg's Flickr set "Austin -
 * Texas State Capitol: Capitol Visitors Center". No commercial imagery.
 *
 * Replaces way/42806381.
 *
 * Doubts: no licensed photo of the east face or the south end: they are
 * drawn like the west face and the north end, without the door. The
 * which-face-is-which reading (photos from the north-west) rests on the
 * lawn sloping down to the north-west in both photos and in the lidar. The
 * dark recessed strips beside the pavilions and the hood moulds round the
 * arches are left out (one colour, too fine).
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { box, save, type XY } from './atl-flatiron-building'
import { gableRoof, opening } from './atx-governors-mansion'

const stucco = new Part(), roof = new Part(), win = new Part(), door = new Part()

const XW = -9.75, XE = 9.75, YS = -15.1, YN = 15.0
const PLINTH = 3.2, STR1 = 7.3, STR2 = 12.5, EAVE = 15.2, RIDGE = 19.1, PRIDGE = 19.3
const SHOULDER = 17.7, CREST = 19.5, P = 0.3 // the pavilions stand 0.3 m proud of the long faces
const PAV = [[5.0, YN], [YS, -5.0]] as const

// the plinth, a little proud, with a chamfered cap
box(stucco, XW - 0.2 - P, XE + 0.2 + P, YS - 0.2, YN + 0.2, 0, PLINTH, stucco, 0.25)
// the walls
box(stucco, XW, XE, YS, YN, PLINTH, EAVE, null, 0)
for (const [y0, y1] of PAV) for (const s of [-1, 1]) {
  const x0 = s < 0 ? XW - P : XE, x1 = s < 0 ? XW : XE + P
  box(stucco, x0, x1, y0, y1, PLINTH, EAVE, null, 0)
}
// string courses round the whole block (stepping out round the pavilions) and the eaves cornice
for (const [z, h, o] of [[STR1, 0.3, 0.15], [STR2, 0.3, 0.15], [EAVE - 0.35, 0.35, 0.3]] as const) {
  box(stucco, XW - o, XE + o, -5.0, 5.0, z, z + h, stucco, 0.08, true)
  for (const [y0, y1] of PAV) box(stucco, XW - P - o, XE + P + o, y0 - o, y1 + o, z, z + h, stucco, 0.08, true)
}

// ── the roofs ──
gableRoof(roof, stucco, XW - 0.3, XE + 0.3, -10.1, 10.1, EAVE, RIDGE, 'y')
for (const [y0, y1] of PAV) gableRoof(roof, null, XW, XE, y0 - 0.3 * Math.sign(y0), y1 + 0.3 * Math.sign(y1), EAVE - 0.1, PRIDGE, 'x')

// ── the castle gables: stepped, crenellated parapets on the long faces ──
function castleGable(x0: number, x1: number, y0: number, y1: number, dir: number) {
  const ym = (y0 + y1) / 2, half = (y1 - y0) / 2, SB = 1.3, FLAT = 1.0
  // the parapet's top at a point along the face, before the crenels
  const top = (y: number) => {
    const d = Math.abs(y - ym)
    if (d >= half - SB) return SHOULDER
    if (d <= FLAT) return CREST
    return CREST - ((d - FLAT) / (half - SB - FLAT)) * (CREST - SHOULDER + 0.6)
  }
  // the solid wall under the merlons: a stepped silhouette, 0.4 m steps
  const STEP = 0.4, MER = 0.55
  for (let y = y0; y < y1 - 1e-6; y += STEP) {
    const yb = Math.min(y1, y + STEP), t = top((y + yb) / 2)
    box(stucco, x0, x1, y, yb, EAVE - 0.01, t - MER, stucco, 0)
    // the raking moulding 1.5 m under the crest line, stepping with it ("highsmith")
    const zm = Math.min(SHOULDER, t) - 1.5
    if (zm > EAVE + 0.2) {
      const xo = dir < 0 ? x0 : x1
      box(stucco, Math.min(xo, xo + dir * 0.18), Math.max(xo, xo + dir * 0.18), y, yb, zm - 0.3, zm, stucco, 0)
    }
    // merlons two steps in three (0.8 m merlons, 0.4 m crenels), solid on the shoulder blocks
    const k = Math.round((y - y0) / STEP)
    const inBlock = Math.abs((y + yb) / 2 - ym) >= half - SB
    if (inBlock || k % 3 !== 2) box(stucco, x0, x1, y, yb, t - MER, t, stucco, 0.06)
  }
}
for (const [y0, y1] of PAV) {
  castleGable(XW - P, XW - P + 0.7, y0, y1, -1)
  castleGable(XE + P - 0.7, XE + P, y0, y1, 1)
}

// ── the openings ──
// a long face, a → b with the outside to the right
const GF: [number, number] = [3.7, 5.45], UF: [number, number] = [8.4, 10.1]
function longFace(a: XY, b: XY, withDoor: boolean) {
  const out = P // the pavilions' faces stand P proud of the wall
  const sOf = (y: number) => (b[1] > a[1] ? y - a[1] : a[1] - y)
  for (const [y0, y1] of PAV) {
    const ym = (y0 + y1) / 2
    for (const d of [-2.2, 2.2]) {
      opening(win, a, b, sOf(ym + d), 1.2, GF[0], GF[1], 'round', out + 0.04)
      opening(win, a, b, sOf(ym + d), 1.2, UF[0], UF[1], 'round', out + 0.04)
    }
    for (const d of [-1.5, 0, 1.5]) opening(win, a, b, sOf(ym + d), 0.8, 13.0, 14.1, 'round', out + 0.04)
  }
  for (const y of [-3.0, 0, 3.0]) {
    if (withDoor && y === 0) opening(door, a, b, sOf(y), 1.9, 2.6, 5.2, 'round', 0.05)
    else opening(win, a, b, sOf(y), 1.2, GF[0], GF[1], 'round', 0.04)
    opening(win, a, b, sOf(y), 1.2, UF[0], UF[1], 'round', 0.04)
  }
  for (const y of [-3.75, -2.25, -0.75, 0.75, 2.25, 3.75]) opening(win, a, b, sOf(y), 0.6, 13.2, 14.0, 'round', 0.04)
}
// the west face has the door (the photos); the east face is drawn without it
longFace([XW, YN], [XW, YS], true)
longFace([XE, YS], [XE, YN], false)
// the end faces: two windows a floor and five attic windows in the middle
for (const [a, b] of [[[XE, YN], [XW, YN]], [[XW, YS], [XE, YS]]] as [XY, XY][]) {
  const L = Math.abs(b[0] - a[0])
  for (const d of [-1.8, 1.8]) {
    opening(win, a, b, L / 2 + d, 1.2, GF[0], GF[1], 'round', 0.04)
    opening(win, a, b, L / 2 + d, 1.2, UF[0], UF[1], 'round', 0.04)
  }
  for (const d of [-2.8, -1.4, 0, 1.4, 2.8]) opening(win, a, b, L / 2 + d, 0.6, 13.2, 14.0, 'round', 0.04)
}

// the steps up to the west door: a landing and a short flight down to the lawn
// (the map's terrain stands at z 1.6 there)
box(stucco, XW - 1.6, XW - 0.15, -1.6, 1.6, 0, 2.6, stucco, 0.08)
for (let k = 0; k < 2; k++) box(stucco, XW - 1.6 - 0.4 * (k + 1), XW - 1.6, -1.6, 1.6, 0, 2.6 - 0.35 * (k + 1), stucco, 0)

if (import.meta.main) {
  await save('atx-capitol-visitors-center', 'Capitol Complex Visitors Center (General Land Office Building)', [
    { part: stucco, material: finish('land-office-stucco', 0xe6e2da) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: door, material: { ...PALETTE.entrance, color: 0x7a6858 } },
  ], { bearing: 17.9, replaces: ['way/42806381'] }, 5000)
}
