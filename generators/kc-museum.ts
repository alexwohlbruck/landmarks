/**
 * The Kansas City Museum at Corinthian Hall, 3218 Gladstone Boulevard,
 * Kansas City, Missouri (1908-10, Henry F. Hoit for lumberman R. A. Long;
 * a museum since 1940) — procedural, CC0-1.0, no textures.
 * bun generators/kc-museum.ts
 *
 * A Beaux-Arts limestone mansion: a three-storey block of nine bays, its
 * south front centred on a giant-order portico of four Corinthian columns
 * carrying an entablature and balustrade; a belt course over the first
 * floor, a lower attic storey, the main cornice and a balustrade round the
 * roof; behind it a steep green copper lower roof with round dormers, a low
 * red tile hip above it with copper cresting, and tall
 * chimneys; a raised balustraded terrace across the front; one-storey
 * loggias at the east and west ends and a lower service wing to the north.
 *
 * Frame: bearing 2 (the block's long walls run 2 degrees off east-west),
 * x right (east), y forward (north), z up, metres. Origin at the OSM
 * outline's centroid, -94.5422106 39.11576. Heights below are written from
 * the south lawn in front of the terrace (lidar 2.0 over the box's
 * ground_min); the lowest ground under the footprint is 0.66 m lower, at the
 * west loggia (terrain 1.34), so build() lifts everything by 0.66 and the
 * bases run down to y = 0 there. The ground rises about 1.8 m to the north.
 *
 * Covers way/499028053. The west loggia (lidar, x -38.5..-34.3) stands just
 * outside the OSM outline, over no mapped building.
 *
 * Sources
 * - OSM (c) OpenStreetMap contributors: way/499028053, wikidata Q16998098.
 * - USGS 3DEP lidar MO_FEMANRCS_1_2020 (flown 2020), 0.5 m grid
 *   (SCRATCH/work/kc-museum/lidar.json). Measured, as z here: the front
 *   terrace 2.3; the parapet edge 14.6-15.8; the hipped roof's flat top
 *   18.6 over x -29..-7, y -1..9; chimneys to 20.2-20.4 (sparse returns,
 *   drawn to 21); the portico's top 11.2-12.4; the east porch and west
 *   loggia 7.0-7.8; the north wing 11.5-13.3.
 * - Mapterhorn terrain: 1.9-2.0 along the south, 3.8 along the north side.
 * Photos (evidence):
 * - "Kansas City Museum.jpg", Jack Boucher (HABS, Library of Congress),
 *   public domain (the front and east from the south-east)
 *   https://commons.wikimedia.org/wiki/File:Kansas_City_Museum.jpg
 * - "General view of the Kansas City Museum.jpg", Jack Boucher, public
 *   domain (the front, face-on)
 *   https://commons.wikimedia.org/wiki/File:General_view_of_the_Kansas_City_Museum.jpg
 * - "Kansas City Museum at Corinthian Hall (Robert A. Long House) ...
 *   panoramio.jpg", MARELBU, CC BY 3.0 (the front, roof and chimneys)
 *   https://commons.wikimedia.org/wiki/File:Kansas_City_Museum_at_Corinthian_Hall_(Robert_A._Long_House)_-_The_72-room_French_Renaissance_mansion,_located_on_3218_Gladstone_Blvd._http-www.ralonghistoricalsociety.org_-_panoramio.jpg
 * - "Kansas City Museum of History and Science.jpg", Charvex, public
 *   domain (the front)
 *   https://commons.wikimedia.org/wiki/File:Kansas_City_Museum_of_History_and_Science.jpg
 * - "Museum of Kansas City 2025a.jpg", "... 2025b.jpg", Antony-22,
 *   CC BY-SA 4.0 (the front steps; the east side wall)
 *   https://commons.wikimedia.org/wiki/File:Museum_of_Kansas_City_2025a.jpg
 *   https://commons.wikimedia.org/wiki/File:Museum_of_Kansas_City_2025b.jpg
 *
 * Numbers: plan from OSM (exact) and lidar (the loggia); heights from lidar
 * (above). Estimated from the photos against those: the storeys (ground
 * floor 2.3-6.6, first floor to the belt course at 10.6-11.4, attic storey
 * to the cornice at 13.9-14.6, balustrade to 15.6), the window shapes
 * (round-headed on the ground floor, pedimented on the first, small
 * squarish in the attic), the column size and spacing, the terrace steps.
 * Colours from the daylight photos, pulled to the palette's lightness:
 * limestone #cfc2a6 -> #dccfb6, the columns and balustrades a shade paler,
 * the tile #9a5a46 -> #a08174 (muted toward roof grey), the copper lower
 * roof and cresting -> patina; the portico's shaded back wall #6f6c66.
 * Roof split: copper from the cornice (14.6) to 17.0, tile to the lidar's
 * flat top 18.6, 3 m over the balustrade (NAIP unreachable, 504, so the
 * colours are from the street photos only).
 *
 * Doubts: no photo of the north side or the service wing (drawn plainly to
 * the lidar heights); the side elevations' window count (five bays) is from
 * the oblique photos. Left out: the carved cartouches, the urns, the
 * lettering on the frieze, the gate piers and fence. The wall in the
 * portico's shade and the doors share one shaded-stone material.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { pslab, pwalls, pcap, lathe, roundColumn, type XY } from './dc-nga-west'
import { faceAt, facePoly, faceSlab, archPoly, rectPoly, saveModel, type Face } from './sd-california-tower'

const STONE = finish('kcm-limestone', 0xdccfb6)
const PALE = finish('kcm-limestone-pale', 0xe9e0cd)
const TILE = finish('kcm-roof-tile', 0xa08174)

const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// main block
const X0 = -34.3, X1 = -1.8, Y0 = -6.2, Y1 = 14.7, XM = (X0 + X1) / 2
const ZT = 2.3 // terrace
const ZB0 = 10.6, ZB1 = 11.4 // belt course
const ZC0 = 13.9, ZC1 = 14.6 // main cornice
const ZBAL = 15.6

/** A hipped roof from a rectangle at z0 up to a flat top rectangle at z1 (an inset of `d`). */
function hipped(p: Part, r: [number, number, number, number], z0: number, z1: number, d: number) {
  const [x0, x1, y0, y1] = r
  const o: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const i: V3[] = [[x0 + d, y0 + d, z1], [x1 - d, y0 + d, z1], [x1 - d, y1 - d, z1], [x0 + d, y1 - d, z1]]
  p.loft([o, i])
  p.cap(i, true)
}

/** A solid balustrade of thickness t round a rectangle's edge, z0..z1, as four thin slabs. */
function parapet(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, t = 0.35, skip: string = '') {
  if (!skip.includes('s')) pslab(p, rect(x0, x1, y0, y0 + t), z0, z1, 0.06)
  if (!skip.includes('n')) pslab(p, rect(x0, x1, y1 - t, y1), z0, z1, 0.06)
  if (!skip.includes('w')) pslab(p, rect(x0, x0 + t, y0 + t, y1 - t), z0, z1, 0.06)
  if (!skip.includes('e')) pslab(p, rect(x1 - t, x1, y0 + t, y1 - t), z0, z1, 0.06)
}

function build() {
  const stone = new Part(), pale = new Part(), tile = new Part(), copper = new Part(), win = new Part(), door = new Part()

  // ---- the front terrace (to the ground in front, sinking into the rise behind)
  pslab(stone, rect(X0 - 0.4, X1 + 0.4, -11.2, Y0), 0, ZT, 0.08, pale)
  parapet(pale, X0 - 0.4, X1 + 0.4, -11.2, Y0 + 0.1, ZT, ZT + 1.0, 0.35, 'n')
  // the steps up to the portico (the lawn in front stands about 0.8 m over the base, terrain)
  for (let k = 2; k < 6; k++) pslab(pale, rect(XM - 2.6, XM + 2.6, -14.2 + k * 0.5, -11.2), 0, ((k + 1) * ZT) / 6, 0.03)

  // ---- the main block
  pslab(stone, rect(X0, X1, Y0, Y1), 0, ZC0, 0, false)
  // belt course and main cornice, a little proud; the attic balustrade
  pslab(pale, rect(X0 - 0.2, X1 + 0.2, Y0 - 0.2, Y1 + 0.2), ZB0, ZB1, 0.08, false, true)
  pslab(pale, rect(X0 - 0.5, X1 + 0.5, Y0 - 0.5, Y1 + 0.5), ZC0, ZC1, 0.15, stone, true)
  parapet(pale, X0 - 0.35, X1 + 0.35, Y0 - 0.35, Y1 + 0.35, ZC1, ZBAL, 0.4)
  // the hipped tile roof inside the balustrade, its flat top edged in copper cresting
  // the roof, mostly hidden from the street: a steep green copper lower slope with round dormers
  // (all the photos show), then a low red tile hip to the lidar's flat top, its edge crested in copper
  hipped(copper, [X0 + 0.6, X1 - 0.6, Y0 + 0.6, Y1 - 0.6], ZC1, 17.0, 1.2)
  hipped(tile, [X0 + 1.8, X1 - 1.8, Y0 + 1.8, Y1 - 1.8], 17.0, 18.6, 3.0)
  parapet(copper, X0 + 4.8, X1 - 4.8, Y0 + 4.8, Y1 - 4.8, 18.6, 18.95, 0.25)
  // oeil-de-boeuf dormers on the copper slope, over the front, back and ends
  const dormer = (x: number, y: number, deg: number) => {
    const ex = deg === 90 || deg === 270
    pslab(copper, ex ? rect(x - 0.5, x + 0.5, y - 0.65, y + 0.65) : rect(x - 0.65, x + 0.65, y - 0.5, y + 0.5), 15.2, 16.7, 0.12)
    const F = faceAt(x + (deg === 90 ? 0.5 : deg === 270 ? -0.5 : 0), y + (deg === 0 ? 0.5 : deg === 180 ? -0.5 : 0), deg)
    facePoly(win, F, archPoly(0, 0.7, 15.75, 15.75, 8).concat(archPoly(0, 0.7, 15.75, 15.75, 8).map(([u, z]) => [u, 2 * 15.75 - z] as XY).slice(1, -1).reverse()), 0.03)
  }
  for (const x of [-25.6, -18.05, -10.5]) { dormer(x, Y0 + 1.2, 180); dormer(x, Y1 - 1.2, 0) }
  for (const y of [4.25]) { dormer(X0 + 1.2, y, 270); dormer(X1 - 1.2, y, 90) }
  // chimneys: four on the front slope, two at the back (lidar)
  for (const [x, y] of [[-28.6, -0.6], [-23.0, -1.4], [-13.2, -1.4], [-7.6, -0.6], [-28.6, 10.4], [-7.6, 10.4]] as XY[]) {
    pslab(stone, rect(x - 0.7, x + 0.7, y - 0.45, y + 0.45), 15.0, 20.6, 0, false)
    pslab(pale, rect(x - 0.85, x + 0.85, y - 0.6, y + 0.6), 20.6, 21.0, 0.08)
  }

  // ---- windows: nine bays on the long fronts, five on the ends
  const S = faceAt(0, Y0, 180), N = faceAt(0, Y1, 0), W = faceAt(X0, 0, 270), E = faceAt(X1, 0, 90)
  const sideBays = (a: number, b: number, n: number) => Array.from({ length: n }, (_, k) => a + ((k + 0.5) * (b - a)) / n)
  const PX0 = -22.7, PX1 = -13.5
  const frontX = [...sideBays(X0, PX0, 3), ...sideBays(PX0, PX1, 3), ...sideBays(PX1, X1, 3)]
  const bay = (F: Face, u: number, centre: boolean) => {
    // ground floor: round-headed, in a pale surround
    if (centre) {
      facePoly(pale, F, archPoly(u, 2.6, ZT, 5.6, 10), 0.04)
      facePoly(door, F, rectPoly(u - 1.0, u + 1.0, ZT, 4.9), 0.08)
      facePoly(win, F, archPoly(u, 2.0, 4.9, 5.6, 10), 0.08)
    } else {
      facePoly(pale, F, archPoly(u, 1.9, 3.0, 5.4, 10), 0.04)
      facePoly(win, F, archPoly(u, 1.4, 3.2, 5.4, 10), 0.08)
    }
    // first floor: tall windows under a pediment
    facePoly(pale, F, rectPoly(u - 0.95, u + 0.95, 7.0, 9.9), 0.04)
    facePoly(win, F, rectPoly(u - 0.65, u + 0.65, 7.25, 9.6), 0.08)
    facePoly(pale, F, [[u - 1.15, 9.9], [u + 1.15, 9.9], [u, 10.45]], 0.1)
    // attic storey: small squarish windows
    facePoly(pale, F, rectPoly(u - 0.8, u + 0.8, 11.75, 13.4), 0.04)
    facePoly(win, F, rectPoly(u - 0.6, u + 0.6, 11.95, 13.2), 0.08)
  }
  // the shaded wall behind the portico columns
  facePoly(door, S, rectPoly(PX0 + 0.2, PX1 - 0.2, ZT, 11.2), 0.02)
  for (const x of frontX) {
    if (x > PX0 && x < PX1) {
      // behind the portico: tall glazed doors on the ground floor and the first floor, the main door in the middle
      const mid = Math.abs(x - (PX0 + PX1) / 2) < 0.1
      facePoly(pale, S, archPoly(x, 2.3, ZT, 5.8, 10), 0.04)
      if (mid) { facePoly(door, S, rectPoly(x - 0.85, x + 0.85, ZT, 5.0), 0.08); facePoly(win, S, archPoly(x, 1.7, 5.0, 5.8, 10), 0.08) }
      else facePoly(win, S, archPoly(x, 1.7, ZT + 0.2, 5.8, 10), 0.08)
      facePoly(pale, S, rectPoly(x - 1.05, x + 1.05, 6.9, 10.1), 0.04)
      facePoly(win, S, rectPoly(x - 0.75, x + 0.75, 7.0, 9.9), 0.08)
      facePoly(pale, S, rectPoly(x - 0.8, x + 0.8, 11.75, 13.4), 0.04)
      facePoly(win, S, rectPoly(x - 0.6, x + 0.6, 11.95, 13.2), 0.08)
    } else bay(S, x, false)
  }
  for (const x of frontX) if (x < -14.5 || x > -0.4) bay(N, -x, false)
  for (const y of sideBays(Y0, Y1, 5)) { bay(W, -y, false); bay(E, y, false) }

  // ---- the portico: four Corinthian columns, the entablature and its balustrade
  const PY0 = -10.8
  pslab(pale, rect(PX0, PX1, PY0, Y0), ZT, ZT + 0.3, 0.05)
  for (const dx of [-4.05, -1.35, 1.35, 4.05]) roundColumn(pale, (PX0 + PX1) / 2 + dx, PY0 + 0.8, 0.56, ZT + 0.3, 11.2, 12, 1.1)
  // pilasters against the wall behind the outer columns
  for (const dx of [-4.05, 4.05]) pslab(pale, rect((PX0 + PX1) / 2 + dx - 0.5, (PX0 + PX1) / 2 + dx + 0.5, Y0 - 0.3, Y0), ZT, 11.2, 0.05, false)
  pslab(pale, rect(PX0, PX1, PY0, Y0), 11.2, 12.2, 0.1, stone, true)
  pslab(pale, rect(PX0 - 0.25, PX1 + 0.25, PY0 - 0.25, Y0), 12.2, 12.5, 0.08, stone, true)
  parapet(pale, PX0 - 0.1, PX1 + 0.1, PY0 - 0.1, Y0, 12.5, 13.4, 0.35, 'n')

  // ---- the one-storey loggias at the east and west ends (lidar 7.0-7.8): arched openings, flat roofs, balustrades
  for (const [x0, x1, y0, y1, out] of [[X1, 2.4, -2.0, 10.2, 90], [-38.5, X0, -1.0, 9.6, 270]] as [number, number, number, number, number][]) {
    pslab(stone, rect(x0, x1, y0, y1), 0, 6.6, 0, false)
    pslab(pale, rect(x0 - 0.2, x1 + 0.2, y0 - 0.2, y1 + 0.2), 6.6, 7.0, 0.08, stone, true)
    parapet(pale, x0 - 0.1, x1 + 0.1, y0 - 0.1, y1 + 0.1, 7.0, 7.8, 0.3, out === 90 ? 'w' : 'e')
    const F = faceAt(out === 90 ? x1 : x0, 0, out)
    const uy = (y: number) => (out === 90 ? y : -y)
    for (const y of sideBays(y0, y1, 3)) {
      facePoly(pale, F, archPoly(uy(y), 2.6, 1.6, 4.6, 10), 0.04)
      facePoly(win, F, archPoly(uy(y), 2.0, 1.9, 4.6, 10), 0.08)
    }
    for (const [yy, deg] of [[y0, 180], [y1, 0]] as [number, number][]) {
      const G = faceAt(0, yy, deg), xm = (x0 + x1) / 2
      facePoly(pale, G, archPoly(deg === 180 ? xm : -xm, 2.4, 1.6, 4.6, 10), 0.04)
      facePoly(win, G, archPoly(deg === 180 ? xm : -xm, 1.8, 1.9, 4.6, 10), 0.08)
    }
  }

  // ---- the north service wing (lidar 11.5-13.3): plain walls, hipped tile roof
  const NW = rect(-14.0, -0.4, Y1, 30.0)
  pslab(stone, NW, 0, 11.0, 0, false)
  pslab(pale, rect(-14.3, -0.1, Y1, 30.3), 10.6, 11.1, 0.08, false, true)
  hipped(tile, [-14.3, -0.1, Y1 + 0.3, 30.3], 11.1, 13.3, 3.0)
  const NF = faceAt(0, 30.0, 0), EF = faceAt(-0.4, 0, 90), WF = faceAt(-14.0, 0, 270)
  for (const x of sideBays(-14.0, -0.4, 3)) for (const [z0, z1] of [[3.0, 5.4], [7.0, 9.4]]) {
    facePoly(pale, NF, rectPoly(-x - 0.85, -x + 0.85, z0 - 0.2, z1 + 0.2), 0.04)
    facePoly(win, NF, rectPoly(-x - 0.6, -x + 0.6, z0, z1), 0.08)
  }
  for (const y of sideBays(Y1 + 0.5, 30.0, 3)) for (const [z0, z1] of [[3.0, 5.4], [7.0, 9.4]]) {
    for (const [F, u] of [[EF, y], [WF, -y]] as [Face, number][]) {
      facePoly(pale, F, rectPoly(u - 0.85, u + 0.85, z0 - 0.2, z1 + 0.2), 0.04)
      facePoly(win, F, rectPoly(u - 0.6, u + 0.6, z0, z1), 0.08)
    }
  }

  // Lift everything above the base by DZ: the lowest ground under the footprint is at the west
  // loggia (map terrain 1.34 over ground_min), 0.66 m below the south lawn the heights above were
  // read from; the bases stay on y = 0 and run down to it.
  const DZ = 0.66
  for (const p of [stone, pale, tile, copper, win, door]) for (let i = 1; i < p.pos.length; i += 3) if (p.pos[i] > 1e-6) p.pos[i] += DZ
  return [
    { part: stone, material: STONE },
    { part: pale, material: PALE },
    { part: tile, material: TILE },
    { part: copper, material: PALETTE.patina },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('kcm-portico-shade', 0x6f6c66) },
  ]
}

if (import.meta.main) await saveModel('kc-museum', 'Kansas City Museum', build(), 6500)
