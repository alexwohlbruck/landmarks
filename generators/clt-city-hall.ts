/**
 * Charlotte City Hall, 600 E Trade St, Charlotte. Neoclassical, 1923-25,
 * architect C. C. Hook; a Mecklenburg County historic landmark.
 *
 * A three-storey limestone block, long side on E Trade St: a rusticated
 * ground storey of round-arched windows, then a giant two-storey colonnade
 * of paired columns recessed between two end pavilions, a cornice and a low
 * attic parapet. Frame: bearing 46.5, so +y faces Trade St (NE) and the long
 * axis runs along x.
 *
 * Sources
 * - OSM way/322278241 (outline 50.4 x 22.2 m, height 23 - too high, see lidar).
 * - USGS lidar USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17), 0.5 m
 *   grid in this frame: parapet 20.1 and roof 18.3-19.0 above the box's
 *   lowest ground; the rear (4th St side) ground 0.8; the Trade St lawn 2.6
 *   with a raised terrace along the front at 3.3-4.1.
 * - Photos:
 *   https://commons.wikimedia.org/wiki/File:Old_City_Hall_East_Trade_St_March_2024.jpg
 *     City Dweller 2, CC BY-SA 4.0 (EVIDENCE): the Trade St front and the
 *     east end, colour and the arched ground storey.
 *   https://commons.wikimedia.org/wiki/File:City_hall,_Charlotte,_N._C._(5755507357).jpg
 *     Boston Public Library (Tichnor Bros. postcard), CC BY 2.0 (EVIDENCE):
 *     the whole front and the west end; the bay count and proportions.
 * - Facts: NC Architects & Builders, https://ncarchitects.lib.ncsu.edu/buildings/B000742
 *   (C. C. Hook, 1923-25); Mecklenburg County Historic Landmarks,
 *   https://hl.mecknc.gov/Properties/Designated-Historic-Landmarks/charlotte/uptown-charlotte/charlotte-city-hall
 *
 * Numbers (y = 0 is the rear ground, lidar 0.8)
 * - Parapet 19.3, roof 17.6, Trade St ground 1.8, front terrace 3.0: measured (lidar).
 * - Ground storey to 7.3, columns to 15.3, entablature and cornice to 17.6:
 *   photo-scaled from the postcard against the measured parapet.
 * - Pavilions 11 m wide, colonnade of six pairs, recessed 2 m: estimated
 *   from the postcard.
 *
 * Compared with the postcard (render from 20, the mirror side of its
 * symmetric front) and the 2024 photo (render from 70). Still differs: no
 * rustication on the ground storey, no carved panels or balustrades, the
 * front steps' pedestals and globes are left out.
 * - The lidar shows a raised strip all along the front; only the central
 *   steps are drawn, as the postcard shows them.
 *
 * Doubts
 * - The rear (4th St / Government Center) face is not photographed; drawn
 *   with the end faces' window rhythm, no colonnade.
 * - Column pairs and arch counts follow the postcard, which is a painted
 *   print, not a photo.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, inset, panel, save, walls, onWall, type XY } from './chi-aon-center'

const BEARING = 46.5
const ANCHOR: [number, number] = [35.2220888, -80.8381699]

const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), door = new Part()

const HX = 25.2, HY = 11.1
const FRONT_G = 1.8, BASE = 7.3, COL_TOP = 15.3, CORNICE = 17.6, PARAPET = 19.3
const PAV = 11.0, RECESS = 2.0

/** A round-headed window on wall a→b: a rectangle s0..s1, z0..zs, under a semicircle. */
function arch(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.05, seg = 8) {
  const { P } = onWall(a, b)
  const r = (s1 - s0) / 2, c = (s0 + s1) / 2
  const ring: V3[] = [P(s0, z0, out), P(s1, z0, out), P(s1, zs, out)]
  for (let k = 1; k < seg; k++) {
    const t = (k / seg) * Math.PI
    ring.push(P(c + r * Math.cos(t), zs + r * Math.sin(t), out))
  }
  ring.push(P(s0, zs, out))
  for (let k = 1; k < ring.length - 1; k++) p.tri(ring[0], ring[k], ring[k + 1])
}

// ---------------------------------------------------------------- the body
// Plan: the front's centre recessed between the pavilions above the ground storey.
const xP = HX - PAV // pavilion inner edge
const BODY: XY[] = [[-HX, -HY], [HX, -HY], [HX, HY], [-HX, HY]]
walls(stone, BODY, 0, BASE)                          // ground storey, full plan
const UPPER: XY[] = [[-HX, -HY], [HX, -HY], [HX, HY], [xP, HY], [xP, HY - RECESS], [-xP, HY - RECESS], [-xP, HY], [-HX, HY]]
walls(stone, UPPER, BASE, CORNICE - 0.6)
// the ledge over the ground storey in the recess
cap(stone, [[-xP, HY - RECESS], [xP, HY - RECESS], [xP, HY], [-xP, HY]], BASE)
// a belt course over the ground storey, all round
walls(trim, inset(BODY, -0.15), BASE - 0.5, BASE)
// entablature over the colonnade, spanning the recess
{
  const r: XY[] = [[-xP, HY - RECESS], [xP, HY - RECESS], [xP, HY], [-xP, HY]]
  walls(stone, r, COL_TOP, CORNICE - 0.6)
  cap(stone, r, COL_TOP, false)
}
// cornice: a projecting bevelled band, then the attic parapet and the roof
block(trim, null, inset(BODY, -0.6), CORNICE - 0.6, CORNICE, 0.3)
{
  // the cornice's top, a ring out to the attic wall (the roof sits at the same height inside)
  const o = inset(BODY, -0.3), i = inset(BODY, 0.3)
  for (let k = 0; k < 4; k++) {
    const j = (k + 1) % 4
    trim.quad([o[k][0], o[k][1], CORNICE], [o[j][0], o[j][1], CORNICE], [i[j][0], i[j][1], CORNICE], [i[k][0], i[k][1], CORNICE])
  }
}
{
  const att = inset(BODY, 0.3)
  walls(stone, att, CORNICE, PARAPET)
  const lip = inset(att, 0.5)
  for (let k = 0; k < 4; k++) {
    const j = (k + 1) % 4
    trim.quad([att[k][0], att[k][1], PARAPET], [att[j][0], att[j][1], PARAPET], [lip[j][0], lip[j][1], PARAPET], [lip[k][0], lip[k][1], PARAPET])
    stone.quad([lip[j][0], lip[j][1], PARAPET], [lip[k][0], lip[k][1], PARAPET], [lip[k][0], lip[k][1], PARAPET - 1.7], [lip[j][0], lip[j][1], PARAPET - 1.7])
  }
  cap(roof, lip, PARAPET - 1.7)
}

// ---------------------------------------------------------------- the colonnade: six pairs of columns
{
  const yC = HY - 0.7, rC = 0.55, seg = 12
  const span = 2 * xP - 2.0, pitch = span / 6
  for (let k = 0; k < 6; k++) {
    const cx = -xP + 1.0 + (k + 0.5) * pitch
    for (const dx of [-0.85, 0.85]) {
      const ring: XY[] = Array.from({ length: seg }, (_, i) => [cx + dx + rC * Math.cos((i / seg) * 2 * Math.PI), yC + rC * Math.sin((i / seg) * 2 * Math.PI)] as XY)
      walls(trim, ring, BASE, COL_TOP - 0.5)
      // capital and base blocks
      const sq: XY[] = [[cx + dx - 0.75, yC - 0.75], [cx + dx + 0.75, yC - 0.75], [cx + dx + 0.75, yC + 0.75], [cx + dx - 0.75, yC + 0.75]]
      walls(trim, sq, COL_TOP - 0.5, COL_TOP)
      walls(trim, sq, BASE, BASE + 0.4)
      cap(trim, sq, BASE + 0.4)
    }
    // the tall window between the pairs' neighbours, on the recessed wall
    // the recessed wall runs +x → -x in the counter-clockwise ring, so its outside is +y
    const a: XY = [xP, HY - RECESS], b: XY = [-xP, HY - RECESS]
    if (k < 5) {
      const s2 = xP - (cx + pitch / 2)
      panel(win, a, b, s2 - 1.0, s2 + 1.0, BASE + 0.9, 10.6, 0.05)
      panel(win, a, b, s2 - 1.0, s2 + 1.0, 11.6, COL_TOP - 0.8, 0.05)
    }
  }
}

// ---------------------------------------------------------------- windows
{
  const front0: XY = [HX, HY], front1: XY = [-HX, HY]     // the Trade St face runs +x → -x (counter-clockwise)
  // ground storey arches along the front: two per pavilion, seven across the centre (the middle three are doors)
  const L = 2 * HX
  for (const c of [3.2, 7.8, L - 7.8, L - 3.2]) arch(win, front0, front1, c - 1.0, c + 1.0, FRONT_G + 1.2, 5.3)
  for (let k = 0; k < 7; k++) {
    const c = PAV + 1.0 + (k + 0.5) * (L - 2 * PAV - 2.0) / 7
    const isDoor = k >= 2 && k <= 4
    arch(isDoor ? door : win, front0, front1, c - 1.0, c + 1.0, isDoor ? 3.0 : FRONT_G + 1.2, 5.3)
  }
  // pavilion upper floors: two windows a floor
  for (const c of [3.3, 7.7, L - 7.7, L - 3.3]) {
    panel(win, front0, front1, c - 0.9, c + 0.9, BASE + 1.0, 10.8, 0.05)
    panel(win, front0, front1, c - 0.9, c + 0.9, 12.0, COL_TOP - 0.6, 0.05)
  }
  // ends (four bays) and the rear (eleven bays): arched below, two floors of windows above
  const faces: [XY, XY, number][] = [[[-HX, HY], [-HX, -HY], 4], [[HX, -HY], [HX, HY], 4], [[-HX, -HY], [HX, -HY], 11]]
  for (const [a, b, n] of faces) {
    const { L: l } = onWall(a, b), w = l / n
    for (let k = 0; k < n; k++) {
      const c = (k + 0.5) * w
      const z0 = a[1] === HY || b[1] === HY ? 1.4 : 1.2
      arch(win, a, b, c - 0.95, c + 0.95, z0, 5.2)
      panel(win, a, b, c - 0.85, c + 0.85, BASE + 1.0, 10.8, 0.05)
      panel(win, a, b, c - 0.85, c + 0.85, 12.0, COL_TOP - 0.6, 0.05)
    }
  }
}

// ---------------------------------------------------------------- the front terrace and steps (lidar 3.0 above the rear ground)
{
  const t: XY[] = [[-9, HY], [9, HY], [9, HY + 2.4], [-9, HY + 2.4]]
  walls(stone, t, 0, 3.0)
  cap(stone, t, 3.0)
  for (const [d, z] of [[3.0, 2.4], [3.6, 1.8]] as const) {
    const s: XY[] = [[-6, HY + 2.4], [6, HY + 2.4], [6, HY + d], [-6, HY + d]]
    walls(stone, s, 0, z)
    cap(stone, s, z)
  }
}

if (import.meta.main) {
  await save('clt-city-hall', 'Charlotte City Hall', ANCHOR, BEARING, [
    { part: stone, material: finish('cityhall-limestone', 0xe7ddcc) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
    { part: roof, material: PALETTE.roof },
  ])
}
