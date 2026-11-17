/**
 * Massachusetts State House, Beacon Hill, Boston (1798 Charles Bulfinch;
 * 1895 Brigham extension; 1917 marble wings) — original procedural
 * geometry, CC0-1.0.
 * bun generators/bos-massachusetts-state-house.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 348.7: the long walls of OSM way/29718019 run at
 * 348.7°, so the Bulfinch front faces "south" (-y) onto Beacon Street and
 * Boston Common, and the Brigham extension runs "north" (+y) to Derne
 * Street. Anchor = the outline's centroid, -71.0638017, 42.358561.
 *
 * Identity (from the photos below):
 *  1. The gilded dome over the Bulfinch front, on a low drum, with a white
 *     balustraded lantern and a gilded cap and pinecone.
 *  2. Bulfinch's red-brick front: a ground-floor arcade of seven arches
 *     under a loggia of twelve white Corinthian columns (paired at the
 *     ends), white entablature and balustrade, a brick attic and a
 *     pediment; side bays with round-arched upper windows in blind arches
 *     over plain lower windows; a grey stone base.
 *  3. The long white marble wings (1917) east and west, three storeys over
 *     a basement, coming forward past the Bulfinch front, with grey slate
 *     hip roofs over their end pavilions.
 *  4. The yellow-brick Brigham extension behind, on two grey granite
 *     storeys, with round-arched windows and a balustrade, a semicircular
 *     bay on its west side.
 *
 * Plan: OSM way/29718019 and its parts in the turned frame, simplified to
 * rectangles and made symmetric about x = 0.5 for the front: the Bulfinch
 * block (way/240316598) x -26..27, y -54..-35; its loggia and arcade
 * (way/824935872 and the column parts) y -59.2..-54, x -15..16; the attic
 * and pediment (way/240316619) x -8.8..9.8; the dome (way/240316620,
 * way/240316623) centred at (0.5, -44.3); the wing pavilions
 * (way/240316612, way/240316624, way/240399428-29) x -69..-51.5 and
 * 52.5..70, y -66.2..-14; the range behind the front (way/240399430) and
 * the connectors, y -38..-20; the Brigham extension (way/822603180)
 * x -24.2..26, y -23.5..80.8, its north centre x -13..15 to y 87.2, its
 * west bay from the OSM curve.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021, 1 m grid, read in this
 * frame with tools/lidar_frame.py. y = 0 is the lowest ground, on Derne
 * Street at the north end; the ground in front of the Bulfinch block is
 * 9.5 m higher (Mapterhorn and lidar agree), the wings' fronts about 5–6 m.
 * Measured: Bulfinch side blocks' balustrade 30.6 (drawn 29.8) and roofs
 * to 32; the loggia's top 29–30; the pediment's peak 37.7; the dome about
 * r 8 at 38, 46.5 at r 4, the pinecone 56.3; wing eaves about 30, the
 * pavilions' hip ridges 33.9, the rear range's ridge 32.4; the Brigham
 * eaves 29–30, roof to 34.6.
 *
 * Estimated from the photos (scaled from the measured front height of
 * 21 m, ground to balustrade): the Bulfinch storeys (base to 10.6, arcade
 * storey to 17.6, the colonnade storey to 27.6), the arcade arches, the
 * columns, windows, attic and pediment; the dome's springing (38.5) and
 * crown (48.5) and the lantern's stages, cross-checked with the lidar; the
 * wings' and the Brigham's window rows and bays (Ashburton photo).
 *
 * Ground: the walls run down to y = 0 everywhere and sink into Beacon
 * Hill; windows are placed at the real floor levels and left out where the
 * ground (Mapterhorn, the table below) is above their sills. Elevation 0.
 * Not modelled: the front steps, gates and fence, the statues, Ashburton
 * Park, flagpoles, rooftop solar panels.
 *
 * Night: the dome is floodlit and glows gold; the Bulfinch front is
 * floodlit; windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Massachusetts State House Boston November 2016.jpg, King of Hearts,
 *    CC BY-SA 4.0 (front)
 *    https://commons.wikimedia.org/wiki/File:Massachusetts_State_House_Boston_November_2016.jpg
 *  - Boston -Massachusetts State House (48718911666).jpg, Ajay Suresh,
 *    CC BY 2.0 (front)
 *    https://commons.wikimedia.org/wiki/File:Boston_-Massachusetts_State_House_(48718911666).jpg
 *  - Massachusetts State House, Boston, Massachusetts - oblique frontal
 *    view.JPG, Daderot, CC BY-SA 3.0 (front from the south-east)
 *    https://commons.wikimedia.org/wiki/File:Massachusetts_State_House,_Boston,_Massachusetts_-_oblique_frontal_view.JPG
 *  - "New" Massachusetts State House, July 2014.JPG, Kathy92648, CC BY-SA
 *    3.0 (front) https://commons.wikimedia.org/wiki/File:%22New%22_Massachusetts_State_House,_July_2014.JPG
 *  - Massachusetts State House, aerial view (8609105065).jpg, City of
 *    Boston Archives, CC BY 2.0 (from above, south-east: roofs, wings,
 *    Brigham extension)
 *    https://commons.wikimedia.org/wiki/File:Massachusetts_State_House,_aerial_view_(8609105065).jpg
 *  - Ashburton Place and Bowdoin Street, 2011 (54609230796).jpg, Ethan
 *    Long, CC BY-SA 4.0 (the Brigham extension's east side from above)
 *    https://commons.wikimedia.org/wiki/File:Ashburton_Place_and_Bowdoin_Street,_2011_(54609230796).jpg
 *  - Massachusetts State House Expansion Stages.png, Гоманков Алексей, CC0
 *    (plan of the three stages)
 *    https://commons.wikimedia.org/wiki/File:Massachusetts_State_House_Expansion_Stages.png
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the Brigham extension's west and north sides and the wings' outer
 * ends are not photographed here; their windows follow the east side and
 * the front. Light courts in the Brigham roof are left out. The aerial
 * (decades old) shows green copper on the Brigham roofs; the 2011 photo
 * shows grey, which is drawn.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, ccw, cornice, gableRoof, hipRoof, offset, onWall, rectShape, revolve, save, split, wall, capPoly, type XY } from './atl-tech-tower'
import { ledge } from './atl-flatiron-building'

const brick = new Part(), marble = new Part(), yellow = new Part(), roof = new Part(), gold = new Part(), win = new Part()

// ── Ground: Mapterhorn z15 in this frame (tools/terrain.ts grid, 10 m), metres above its lowest value; rows y = -95..95, columns x = -95..95 ──
const T = [
  [6.6, 7.1, 6.8, 7.0, 7.1, 6.9, 6.7, 7.8, 7.1, 6.0, 6.0, 6.0, 6.3, 5.7, 5.6, 5.6, 5.7, 5.8, 5.8, 5.2],
  [7.4, 7.7, 7.2, 7.5, 7.5, 7.3, 7.1, 8.6, 9.0, 8.6, 8.5, 8.7, 8.5, 7.0, 6.6, 6.3, 5.8, 5.8, 5.7, 5.5],
  [7.8, 8.1, 8.2, 8.1, 7.9, 7.5, 8.7, 10.1, 10.6, 10.6, 10.5, 10.5, 9.8, 7.1, 6.8, 7.1, 7.2, 5.8, 5.5, 5.7],
  [8.4, 8.7, 8.4, 8.3, 9.2, 8.6, 10.5, 11.0, 11.3, 11.4, 11.2, 11.1, 10.8, 7.7, 7.3, 6.1, 5.0, 6.2, 6.2, 5.9],
  [9.5, 9.4, 8.5, 9.0, 10.4, 11.0, 10.9, 11.4, 11.6, 11.5, 11.4, 11.1, 11.1, 9.2, 9.1, 9.2, 7.7, 6.4, 6.4, 6.1],
  [10.2, 10.6, 8.6, 9.1, 10.4, 11.2, 11.0, 11.4, 11.2, 10.6, 10.0, 9.9, 10.5, 9.9, 9.8, 9.2, 7.9, 6.6, 6.5, 6.3],
  [11.0, 10.7, 8.7, 9.1, 9.8, 10.1, 10.1, 10.0, 9.3, 8.8, 8.7, 8.7, 8.7, 9.7, 9.8, 7.6, 7.2, 6.7, 6.8, 6.4],
  [11.1, 10.5, 8.9, 8.5, 7.9, 8.0, 8.0, 7.9, 7.6, 7.6, 7.5, 7.5, 7.4, 7.8, 7.8, 7.2, 7.0, 7.0, 7.0, 7.1],
  [11.3, 10.7, 10.7, 10.9, 10.3, 10.0, 9.8, 9.5, 9.2, 9.2, 9.1, 9.0, 8.8, 8.6, 8.5, 8.0, 7.6, 7.1, 7.1, 7.1],
  [11.3, 11.1, 10.9, 10.5, 10.2, 10.1, 9.8, 9.5, 9.4, 9.2, 9.1, 8.9, 8.7, 8.5, 8.2, 7.8, 7.6, 7.2, 7.2, 7.1],
  [11.0, 11.0, 10.7, 10.4, 10.0, 9.8, 5.8, 8.8, 8.6, 8.3, 8.0, 7.8, 7.7, 8.0, 7.8, 7.8, 7.7, 7.3, 7.4, 7.1],
  [10.6, 10.9, 10.4, 10.2, 9.8, 9.3, 6.0, 7.7, 7.5, 7.2, 6.9, 6.6, 6.3, 7.8, 7.8, 7.7, 7.8, 7.4, 7.4, 7.3],
  [9.9, 10.2, 10.6, 8.6, 8.0, 8.6, 5.8, 6.5, 6.4, 6.1, 6.1, 6.1, 6.1, 7.3, 7.4, 7.4, 7.3, 7.2, 7.1, 7.4],
  [9.1, 9.2, 9.2, 7.6, 7.2, 7.7, 6.8, 5.6, 5.3, 5.0, 4.9, 5.3, 6.0, 7.2, 7.2, 7.6, 7.1, 6.8, 6.5, 6.7],
  [8.2, 8.1, 7.6, 6.5, 6.4, 6.9, 6.0, 2.9, 3.6, 4.4, 5.1, 5.9, 6.6, 7.1, 7.3, 7.2, 7.2, 6.9, 5.6, 6.2],
  [7.4, 7.0, 6.2, 5.6, 5.7, 6.1, 5.9, 2.9, 3.4, 4.0, 4.5, 5.1, 5.7, 6.2, 7.4, 7.2, 7.3, 6.3, 4.2, 4.1],
  [6.4, 6.3, 5.7, 5.7, 5.7, 5.3, 5.2, 2.9, 2.7, 2.6, 3.2, 3.7, 4.3, 4.7, 7.6, 7.8, 7.5, 5.8, 3.2, 3.2],
  [5.6, 5.3, 4.4, 4.0, 5.0, 4.9, 4.4, 3.4, 2.4, 2.4, 2.2, 2.4, 1.9, 2.8, 7.3, 7.2, 6.1, 3.6, 2.1, 1.9],
  [4.8, 4.5, 4.1, 3.6, 4.0, 4.4, 3.5, 2.4, 2.2, 2.1, 2.1, 1.7, 1.3, 1.1, 1.0, 1.1, 1.1, 1.0, 0.9, 1.0],
  [4.0, 3.5, 3.2, 3.1, 2.9, 2.8, 2.7, 2.5, 2.3, 2.1, 1.7, 1.4, 1.1, 0.8, 0.8, 0.9, 0.8, 1.0, 0.4, 0.0],
] // row 0 is y = -95 (the south), the last y = 95
/** The ground (m above y = 0) at a plan point, bilinear in the table. */
function ground(x: number, y: number) {
  const c = Math.max(0, Math.min(18.999, (x + 95) / 10)), r = Math.max(0, Math.min(18.999, (y + 95) / 10))
  const c0 = Math.floor(c), r0 = Math.floor(r), fc = c - c0, fr = r - r0
  const v = (rr: number, cc: number) => T[rr][cc]
  const g = (1 - fr) * ((1 - fc) * v(r0, c0) + fc * v(r0, c0 + 1)) + fr * ((1 - fc) * v(r0 + 1, c0) + fc * v(r0 + 1, c0 + 1))
  return Math.max(0, g - 2.0) // 2.0: the table's value at the lowest point under the footprint
}

type Rect = [number, number, number, number]
const rect = ([x0, x1, y0, y1]: Rect): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const masses: Rect[] = [] // for hiding windows on walls that touch another block
const hidden = (x: number, y: number) => masses.some(([x0, x1, y0, y1]) => x > x0 && x < x1 && y > y0 && y < y1)

/**
 * Windows along every face of a ring, `bay` metres apart, at absolute rows;
 * skipped where the ground is above the sill or another block covers the
 * wall. `shape` makes one window's outline at s along the face.
 */
function windows(ring: XY[], bay: number, rows: Array<[number, number, boolean?]>, margin = 1.5, w = 1.4, onlyFaces?: (a: XY, b: XY) => boolean) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (onlyFaces && !onlyFaces(a, b)) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.round((L - 2 * margin) / bay)
    if (n < 1) continue
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
    for (let k = 0; k < n; k++) {
      const s = margin + ((k + 0.5) * (L - 2 * margin)) / n
      const px = a[0] + t[0] * s, py = a[1] + t[1] * s
      if (hidden(px + nn[0] * 1.5, py + nn[1] * 1.5)) continue
      const g = ground(px + nn[0] * 2, py + nn[1] * 2)
      for (const [z0, z1, arch] of rows) {
        if (z0 < g + 0.6) continue
        onWall(win, a, b, arch ? archShape(s, w, z0, z1 - w / 2, 4) : rectShape(s - w / 2, s + w / 2, z0, z1), 0.05)
      }
    }
  }
}
/** A solid parapet (balustrade) round a ring, `t` thick. */
function parapet(p: Part, ring: XY[], z0: number, z1: number, t = 0.45) {
  const inner = offset(ring, -t)
  wall(p, ring, z0, z1)
  wall(p, [...inner].reverse(), z0, z1)
  ledge(p, ring, inner, z1, true)
}

const AX = 0.5 // the front's axis

// ── The marble wings: end pavilions and the range behind the front ──
const WING_EAVE = 30, BASE_TOP = 7.5
const pav: Rect[] = [[-69, -51.5, -66.2, -14], [52.5, 70, -66.2, -14]]
const range: Rect = [-51.5, 52.5, -38, -20]
for (const r of [...pav, range]) {
  const ring = split(rect(r), 5)
  wall(marble, ring, 0, WING_EAVE)
  cornice(marble, rect(r), WING_EAVE - 1.0, 1.0, 0.5, null)
}
for (const [x0, x1, y0, y1] of pav) {
  parapet(marble, rect([x0, x1, y0, y1]), WING_EAVE, WING_EAVE + 1.0)
  capPoly(roof, rect([x0, x1, y0, y1]), WING_EAVE + 0.2, true) // the flat behind the balustrade
  hipRoof(roof, x0 + 1.2, x1 - 1.2, y0 + 1.2, y1 - 1.2, WING_EAVE + 0.3, 33.9, 0)
}
gableRoof(roof, null, range[0], range[1], range[2], range[3], WING_EAVE, 32.4, 'x', 0.3, 0)
masses.push(...pav, range)

// ── The Brigham extension ──
const brig: Rect = [-24.2, 26, -23.5, 80.8], brigN: Rect = [-13, 15, 80.8, 87.2]
const BR_EAVE = 29, GRANITE = 16
const brigRing: XY[] = ccw([[-24.2, -20], [26, -20], [26, 0.9], [29.4, 0.9], [29.4, 30.2], [26, 30.2], [26, 80.8], [15, 80.8], [15, 87.2], [-13, 87.2], [-13, 80.8], [-24.2, 80.8]])
{
  const r = split(brigRing, 5)
  wall(marble, r, 0, GRANITE)
  wall(yellow, r, GRANITE, BR_EAVE)
  cornice(marble, brigRing, BR_EAVE - 0.9, 0.9, 0.5, null)
  parapet(marble, brigRing, BR_EAVE, BR_EAVE + 1.0)
  capPoly(roof, brigRing, BR_EAVE + 0.2, true)
  // a white string course at the top of the granite
  cornice(marble, brigRing, GRANITE - 0.4, 0.6, 0.2, null)
  hipRoof(roof, brig[0] + 1, brig[1] - 1, -19, brig[3] - 1, BR_EAVE + 0.3, 34.6, 0)
  hipRoof(roof, brigN[0] + 1, brigN[1] - 1, 79, brigN[3] - 1, BR_EAVE + 0.3, 32.5, 0)
}
// The west bay: a half drum on the Brigham's west wall, x < -24.2.
{
  const c: XY = [-24.2, 15], R = 11.5, n = 10
  const arc: XY[] = Array.from({ length: n + 1 }, (_, i) => {
    const a = Math.PI / 2 + (i / n) * Math.PI
    return [c[0] + R * Math.cos(a), c[1] + R * Math.sin(a)] as XY
  })
  const ring = ccw([...arc, [c[0] + 0.5, c[1] - R], [c[0] + 0.5, c[1] + R]] as XY[])
  wall(marble, ring, 0, GRANITE)
  wall(yellow, ring, GRANITE, BR_EAVE)
  cornice(marble, ring, BR_EAVE - 0.9, 0.9, 0.5, null)
  revolve(roof, c, [[R + 0.3, BR_EAVE], [R * 0.6, BR_EAVE + 3.2], [0, BR_EAVE + 4.2]], 20, 0, true, false)
  windows(arc, 3.9, [[17.6, 22.0, true], [23.4, 27.6, true]], 0.3, 1.5)
}
masses.push(brig, brigN)

// ── The Bulfinch front ──
const BUL: Rect = [-26, 27, -54, -35]
const LOG: Rect = [-15, 16, -59.2, -54] // the arcade and loggia
const BUL_BASE = 10.6, ARC_TOP = 17.6, COL_TOP = 27.6, SIDE_BAL = 29.8
{
  const ring = split(rect(BUL), 5)
  wall(marble, ring, 0, BUL_BASE)
  wall(brick, ring, BUL_BASE, COL_TOP)
  // the white band between the storeys and the entablature
  cornice(marble, rect(BUL), ARC_TOP - 0.4, 0.5, 0.15, null)
  cornice(marble, rect(BUL), COL_TOP, 1.4, 0.45, null)
  parapet(marble, rect(BUL), COL_TOP + 1.4, SIDE_BAL)
  capPoly(roof, rect(BUL), COL_TOP + 1.5, true)
  // low hip roofs over the side blocks, behind the balustrade
  hipRoof(roof, BUL[0] + 0.8, -9, BUL[2] + 0.8, BUL[3] - 0.8, COL_TOP + 1.4, 32, 0)
  hipRoof(roof, 10, BUL[1] - 0.8, BUL[2] + 0.8, BUL[3] - 0.8, COL_TOP + 1.4, 32, 0)
}
// The arcade storey of the loggia: brick, seven arches.
{
  const [x0, x1, y0, y1] = LOG
  const ring = split(rect(LOG), 5)
  wall(marble, ring, 0, BUL_BASE)
  wall(brick, ring, BUL_BASE, ARC_TOP)
  capPoly(marble, rect(LOG), ARC_TOP, true)
  const L = x1 - x0, aw = 2.7
  for (let k = 0; k < 7; k++) {
    const s = (L * (k + 0.5)) / 7
    onWall(win, [x0, y0], [x1, y0], archShape(s, aw, BUL_BASE, ARC_TOP - 1.0 - aw / 2, 8), 0.05)
    // the white roundels between the arches
    if (k > 0) {
      const sr = (L * k) / 7
      onWall(marble, [x0, y0], [x1, y0], Array.from({ length: 10 }, (_, i) => [sr + 0.35 * Math.cos((i / 10) * Math.PI * 2), 16.6 + 0.35 * Math.sin((i / 10) * Math.PI * 2)] as [number, number]), 0.05)
    }
  }
  // twelve Corinthian columns, about 1.3 m thick: pairs at each end, eight between
  const xs = [x0 + 0.85, x0 + 2.45, x0 + 5.0, x0 + 6.6]
  const inner = Array.from({ length: 4 }, (_, i) => x0 + 10.2 + (i * (L - 20.4)) / 3)
  for (const x of [...xs, ...inner, ...xs.map((v) => x0 + x1 - v)]) {
    revolve(marble, [x, y0 + 0.95], [[0.85, ARC_TOP], [0.85, ARC_TOP + 0.35], [0.68, ARC_TOP + 0.45], [0.6, COL_TOP - 1.0], [0.82, COL_TOP - 0.1], [0.82, COL_TOP]], 8, Math.PI / 8, false, true)
  }
  // the loggia's entablature and balustrade, a little higher than the sides
  box(marble, x0 - 0.2, x1 + 0.2, y0 - 0.2, y1, COL_TOP, COL_TOP + 1.6, marble, 0.25, true)
  parapet(marble, rect([x0 - 0.2, x1 + 0.2, y0 - 0.2, y1 + 0.5]), COL_TOP + 1.6, 30.4)
  // the wall behind the columns: windows and roundels
  for (let k = 0; k < 6; k++) {
    const s = 3.0 + (k * (L - 6)) / 5
    if (hidden(x0 + s, y1 - 1)) continue
    onWall(win, [x0, y1], [x1, y1], rectShape(s - 0.75, s + 0.75, ARC_TOP + 1.6, ARC_TOP + 4.6), 0.05)
    onWall(win, [x0, y1], [x1, y1], Array.from({ length: 10 }, (_, i) => [s + 0.5 * Math.cos((i / 10) * Math.PI * 2), 24.6 + 0.5 * Math.sin((i / 10) * Math.PI * 2)] as [number, number]), 0.05)
  }
}
// The Bulfinch side bays: plain lower windows, round-arched upper windows in white surrounds.
for (const side of [-1, 1]) {
  const [x0, x1] = side < 0 ? [BUL[0], LOG[0]] : [LOG[1], BUL[1]]
  for (let k = 0; k < 3; k++) {
    const x = x0 + ((x1 - x0) * (k + 0.5)) / 3
    const s = x - BUL[0]
    onWall(win, [BUL[0], BUL[2]], [BUL[1], BUL[2]], rectShape(s - 0.75, s + 0.75, 11.8, 15.6), 0.05)
    onWall(marble, [BUL[0], BUL[2]], [BUL[1], BUL[2]], archShape(s, 2.4, 18.6, 23.6, 8), 0.04)
    onWall(win, [BUL[0], BUL[2]], [BUL[1], BUL[2]], archShape(s, 1.6, 19.4, 23.6, 8), 0.07)
  }
}
// Ends of the Bulfinch block (visible between the wings and the loggia).
windows([[BUL[1], BUL[2]], [BUL[1], -38]], 3.6, [[11.8, 15.6], [19.4, 24.4, true]], 1.0, 1.5)
windows([[BUL[0], -38], [BUL[0], BUL[2]]], 3.6, [[11.8, 15.6], [19.4, 24.4, true]], 1.0, 1.5)
masses.push(BUL, LOG)

// The brick attic and the pediment over the centre, its roof running back to the dome.
{
  const ax0 = -8.8, ax1 = 9.8, ay0 = -54, ay1 = -40
  box(brick, ax0, ax1, ay0, ay1, COL_TOP, 32.4, null, 0)
  cornice(marble, rect([ax0, ax1, ay0, ay1]), 32.4, 0.8, 0.4, null)
  for (let k = 0; k < 6; k++) {
    const s = 1.8 + (k * (ax1 - ax0 - 3.6)) / 5
    onWall(win, [ax0, ay0], [ax1, ay0], rectShape(s - 0.55, s + 0.55, 30.6, 31.8), 0.05)
  }
  gableRoof(roof, brick, ax0, ax1, ay0 - 0.2, ay1, 33.2, 37.7, 'y', 0.4, 0.4)
  // white raking cornices on the pediment's face
  const y = ay0 - 0.65, xm = AX, lo = 33.2
  for (const sgn of [-1, 1]) {
    const xe = sgn < 0 ? ax0 - 0.5 : ax1 + 0.5
    const a: V3 = [xe, y, lo - 0.1], b: V3 = [xm, y, 37.85], c: V3 = [xm, y, 37.25], d: V3 = [xe, y, lo + 0.5]
    const f: V3[] = [[0, -1, 0], [0, -1, 0], [0, -1, 0]]
    marble.tri(a, b, c, undefined, undefined, undefined, f)
    marble.tri(a, c, d, undefined, undefined, undefined, f)
  }
  marble.quad([ax0 - 0.5, y, lo - 0.3], [ax1 + 0.5, y, lo - 0.3], [ax1 + 0.5, y, lo + 0.1], [ax0 - 0.5, y, lo + 0.1])
}

// ── The dome ──
{
  const C: XY = [AX, -44.3], N = 16
  // the drum, white, mostly hidden behind the attic
  revolve(marble, C, [[8.3, 30], [8.3, 37.9], [8.7, 38.1], [8.7, 38.6], [8.1, 38.6]], N, 0, true, false)
  // the gilded dome: a slightly raised half ellipse, 8 m radius, 10 m tall
  const prof: [number, number][] = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 8) * (Math.PI / 2) * 0.93
    return [8.0 * Math.cos(a), 38.6 + 10 * Math.sin(a)]
  })
  revolve(gold, C, [...prof, [2.4, 48.3]], N, 0, false, false)
  // lantern: balustraded base, white drum with arched windows, gilded cap and pinecone
  revolve(marble, C, [[2.9, 48.0], [2.9, 49.2], [2.0, 49.2], [2.0, 53.4], [2.35, 53.4], [2.35, 53.8], [2.1, 53.8]], 8, Math.PI / 8, true, false)
  for (let i = 0; i < 8; i++) {
    const a0 = Math.PI / 8 + (i / 8) * Math.PI * 2, a1 = a0 + Math.PI / 4
    const a: XY = [C[0] + 2.0 * Math.cos(a0), C[1] + 2.0 * Math.sin(a0)], b: XY = [C[0] + 2.0 * Math.cos(a1), C[1] + 2.0 * Math.sin(a1)]
    onWall(win, a, b, archShape(0.77, 0.9, 50.0, 52.4, 6), 0.03)
  }
  revolve(gold, C, [[2.1, 53.8], [1.9, 54.3], [1.3, 54.9], [0.6, 55.3], [0.45, 55.5], [0.6, 56.0], [0.45, 56.6], [0.12, 57.0], [0, 57.1]], 8, Math.PI / 8, false, true)
}

// ── Windows on the wings and the Brigham extension ──
// The wings: basement, three storeys.
const wingRows: Array<[number, number, boolean?]> = [[9.0, 11.6], [13.4, 16.4], [18.6, 21.8], [23.6, 26.8]]
for (const r of pav) windows(rect(r), 3.4, wingRows, 1.6, 1.4)
windows(rect(range), 3.6, wingRows, 2, 1.4)
// The Brigham extension: granite storeys, then two rows of arched windows in the yellow brick.
const brigRows: Array<[number, number, boolean?]> = [[3.0, 5.6], [7.4, 10.0], [11.6, 14.6], [17.6, 22.0, true], [23.4, 27.6, true]]
windows(brigRing, 4.4, brigRows, 1.8, 1.5)

// Night: the dome and the Bulfinch front are floodlit.
const front = (p: V3, n: V3) => (n[1] < -0.6 && p[1] < -50 && Math.abs(p[0]) < 28 ? 0.75 : 0)
await save('bos-massachusetts-state-house', 'Massachusetts State House', [
  { part: brick, material: { ...finish('statehouse-brick', 0xbf6b52), floodlight: front } },
  { part: marble, material: { ...finish('statehouse-marble', 0xf0ece3), floodlight: (p, n) => (p[2] > 47 ? 0.9 : front(p, n)) } },
  { part: yellow, material: finish('statehouse-yellow-brick', 0xe2c88c) },
  { part: roof, material: PALETTE.roof },
  { part: gold, material: { ...finish('statehouse-gold', 0xdcb553), floodlight: () => 0.95 } },
  { part: win, material: PALETTE.window },
], { height: 57.1, anchor: [42.358561, -71.0638017], bearing: 348.7 }, 6500)
