/**
 * David H. Koch Theater, Lincoln Center — procedural, CC0-1.0, no textures.
 * bun generators/nyc-koch-theater.ts
 *
 * Map frame: x = model east (Columbus Avenue), y = model north (the plaza),
 * z up, metres. Placed at bearing 29°, the Manhattan grid. Anchor: area
 * centroid of the OSM outline way/265354528. The plaza front faces north
 * (+y).
 *
 * Identifying features (from the photos):
 * 1. Paired square travertine columns standing free across the plaza front,
 *    four pairs (one at each corner and two inside), rising the full height
 *    to a deep plain fascia: the box above.
 * 2. Behind them a recessed two-storey glass loggia: tall dark glass between
 *    stone piers over the promenade balcony (about 5 m up, with its
 *    balustrade line), the entrances below.
 * 3. Plain travertine sides with shallow pilasters under the same fascia.
 * 4. The auditorium box and the stage house above the roof towards 62nd
 *    Street.
 *
 * Evidence
 * - OSM way/265354528 (outline, 59 × 79 m), parts 1475173705 (the ring,
 *   24 m), 330177536 (the auditorium, 27 m), 330177537 (the stage house,
 *   31.7 m).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), resampled in the model frame
 *   (/tmp/city/nyc/work/lc/rot.py), above the street level at 23.8 m
 *   NAVD88 (the lowest ground round the footprint, 62nd Street and Columbus
 *   Avenue): the plaza in front 1.1 m; the roof 23.0 m to the outline; the
 *   auditorium box 28.0 m over x −21…20.5, y −33…25; the stage house 33–35 m
 *   over x −13…12, y −37…−20.
 * - Published: Philip Johnson, 1964, as the New York State Theater
 *   (Wikipedia).
 * - Photos (Wikimedia Commons, daylight): the plaza front (AramilFeraxa,
 *   CC BY 4.0), the front and Columbus Avenue side (Epicgenius, CC BY-SA
 *   4.0; DEGA MD, CC BY-SA 4.0), the front from the north-west (Ajay
 *   Suresh, CC BY 2.0); /tmp/city/nyc/work/nyc-koch-theater/photos/credits.txt.
 *
 * Measured from the photos scaled to the lidar's 21.9 m above the plaza:
 * the fascia about 3 m deep, the balcony about 5 m above the plaza, the
 * columns about 1.7 m square. Estimated: the pairs' spacing (pair centres at
 * ±8.6 and ±25.7 m, the columns of a pair 6.2 m apart, from the
 * perspective of the plaza photo), the loggia's depth (4 m), the side
 * pilasters' pitch, the 62nd Street (south) front, drawn plain as no
 * licensed photo of it was found. The plaza and the fountain are not
 * modelled.
 */
import { Part } from './mesh'
import { finish, PALETTE } from './palette'
import { finishModel, massing, type XY } from './nyc-570-lexington'
import { cube, face } from './nyc-met-opera'
import { box } from './nyc-city-hall'

function build() {
  const stone = new Part(), win = new Part(), door = new Part(), roof = new Part(), shade = new Part(), trim = new Part()

  const X0 = -29.6, X1 = 29.6, YS = -39.6, YF = 39.6
  const PLAZA = 1.1, TOP = 23.0, FASCIA = TOP - 3.0, AUD = 28.0, STAGE = 34.5
  const YG = YF - 4.0      // the loggia's glass wall
  const COL = 0.85         // half the columns' width

  // The body, the auditorium box and the stage house.
  massing({
    wall: stone, win: null, roof, coping: stone, facade: null, bevel: 0.4,
    boxes: [[X0, YS, X1, YG, TOP], [-21.8, -33, 20.4, 25.5, AUD], [-13, -36.8, 12, -19.5, STAGE]],
  })

  // The loggia: the glass wall 4 m behind the columns, in shadow.
  const front = face([X1, YG], [X0, YG])  // facing +y; s runs east → west
  front.rect(shade, 0, front.L, PLAZA, FASCIA, 0.02)
  // The side walls run out to the front, behind the corner columns.
  cube(stone, X0, YG - 0.1, X0 + 0.6, YF - 1.6, 0, FASCIA)
  cube(stone, X1 - 0.6, YG - 0.1, X1, YF - 1.6, 0, FASCIA)
  // The glass wall seen through it (drawn on the recess plane, as panels
  // between stone piers behind each column), the balcony and the doors.
  const pairs = [-25.7, -8.6, 8.6, 25.7]
  const cols = pairs.flatMap((c) => (Math.abs(c) > 20 ? [Math.sign(c) * (X1 - COL), Math.sign(c) * (X1 - COL - 6.2)] : [c - 3.1, c + 3.1])).sort((a, b) => a - b)
  const sOf = (x: number) => X1 - x
  for (let k = 0; k < cols.length - 1; k++) {
    const s0 = sOf(cols[k + 1]) + COL + 0.3, s1 = sOf(cols[k]) - COL - 0.3
    front.rect(win, s0, s1, PLAZA + 6.2, FASCIA - 0.8, 0.06)
    front.rect(win, s0, s1, PLAZA + 0.3, PLAZA + 4.6, 0.06)
    if (k % 2 === 1) front.rect(door, (s0 + s1) / 2 - 1.8, (s0 + s1) / 2 + 1.8, PLAZA, PLAZA + 3.2, 0.1)
    // The inner row: a stone pier in the glass wall behind each wide bay (the photos from the north-east).
    if (s1 - s0 > 8) front.box(stone, (s0 + s1) / 2 - 0.8, (s0 + s1) / 2 + 0.8, 0, 0.9, 0, FASCIA, false)
  }
  // The promenade balcony: a pale slab with its balustrade, between the corners.
  front.box(trim, 0.6, front.L - 0.6, 0, 1.6, PLAZA + 4.6, PLAZA + 6.2, true)
  // The free columns, square, the full height to the fascia, standing in
  // front of the recess (their fronts on the outline).
  for (const x of cols) box(stone, null, x - COL, YF - 2 * COL, x + COL, YF, 0, FASCIA + 0.05, 0.25)
  // The fascia: the box above, out to the outline, over the loggia's depth.
  cube(stone, X0, YG, X1, YF, FASCIA, TOP, true)
  roof.quad([X0 + 0.4, YG, TOP + 0.03], [X1 - 0.4, YG, TOP + 0.03], [X1 - 0.4, YF - 0.4, TOP + 0.03], [X0 + 0.4, YF - 0.4, TOP + 0.03])
  // The loggia's floor at the plaza's level over a plinth.
  cube(stone, X0 + 0.02, YF - 4.0, X1 - 0.02, YF - 0.02, 0, PLAZA)

  // Sides and back: plain travertine with shallow pilasters under the fascia.
  const pil = (a: XY, b: XY, n: number, from = 0) => {
    const f = face(a, b), p = (f.L - from) / n
    for (let k = 1; k < n; k++) f.box(stone, from + k * p - 0.7, from + k * p + 0.7, 0, 0.35, 0, FASCIA, true)
    f.box(stone, 0, f.L, 0, 0.35, FASCIA, TOP - 0.4, true) // the fascia's lip
  }
  pil([X1, YS], [X1, YF - 1.6], 10)  // east (Columbus Avenue)
  pil([X0, YF - 1.6], [X0, YS], 10)  // west
  pil([X0, YS], [X1, YS], 7)        // south (62nd Street)

  finishModel('David H. Koch Theater', 'nyc-koch-theater', [
    { part: stone, material: finish('lincoln-travertine', 0xede6d8) },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
    { part: roof, material: PALETTE.roof },
    { part: trim, material: PALETTE.trim },
    { part: shade, material: finish('koch-loggia', 0x8f969c) },
  ], { bearing: 29, osm: 'way/265354528', height: STAGE })
}

if (import.meta.main) build()
