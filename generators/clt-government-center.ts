/**
 * Charlotte-Mecklenburg Government Center, 600 E 4th St, Charlotte (1988).
 * City and county offices and the council chamber.
 *
 * The plan is one large right triangle, its right angle at the west corner
 * and its long side straight north-south on the east plaza (OSM way and
 * parts, confirmed by lidar). The tower fills the northern half, itself a
 * right triangle: two equal leg faces (south and east, so from the SE plaza
 * it reads as a plain square block) and a long hypotenuse facing north-west,
 * which meets the south face in a knife-edge corner at the west. The low
 * southern half holds the council chamber, its circular skylight on the roof.
 *
 * Frame: bearing 1.9 (the east face's line), +y north.
 *
 * Sources
 * - OSM way/1113509383 (outline), building parts way/499337303 (tower,
 *   height 61) and way/131139742 (low wing, height 19).
 * - USGS lidar USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17), 1 m grid,
 *   read in this frame: tower parapet 72.2 m and roof 71.5 m above the
 *   box's lowest ground; lower roof wells 66.2; penthouse to 77.8; the low
 *   wing's roof 16.2 with a 16.8 parapet; E 4th St at the SW corner about
 *   0.8; the east plaza 6.2.
 * - USGS NAIP: the plan, the low wing's circular skylight.
 * - Photos, all by City Dweller 2, CC BY-SA 4.0 (EVIDENCE):
 *   https://commons.wikimedia.org/wiki/File:Charlotte_Mecklenburg_Government_Center_Mid-March_2024.jpg
 *     (from the SE plaza: the two leg faces, the colonnade, the top row of openings)
 *   https://commons.wikimedia.org/wiki/File:Charlotte-Mecklenburg_Government_Center_December_2023.jpg
 *     (the east face from Davidson St, the ribbon windows, the openings)
 *   https://commons.wikimedia.org/wiki/File:Charlotte-Mecklenburg_Government_Center_August_2007.jpg
 *     (the knife-edge west corner from 4th St)
 *   https://commons.wikimedia.org/wiki/File:Charlotte_Mecklenburg_Government_Center_Entrance_Mid-March_2024.jpg
 *     (the two-storey granite colonnade at the plaza entrance)
 *
 * Numbers (y = 0 is E 4th St at the SW tip, lidar 0.8)
 * - Tower parapet 71.4, roof 70.7, penthouse 74.0: measured (lidar).
 * - Low wing roof 15.4, parapet 16.0: measured (lidar).
 * - East plaza 5.4 above y = 0: measured (lidar). The colonnade is two
 *   storeys over it (10 m, photo-scaled).
 * - Plan corners: measured (lidar, within 1 m of OSM).
 * - Ribbon windows: the real building has one dark band per floor (about 15
 *   floors); drawn as one band per two floors, per the style rules.
 * - The top band's square openings: counted from the photos (seven across
 *   the south face, five in the south half of the east face); the
 *   hypotenuse's eight are estimated from the 2007 photo's oblique view.
 * - The skylight ring: NAIP, radius 12 m.
 *
 * Compared with the March 2024 plaza photo (render from 135) and the
 * December 2023 east-face photo (render from 95). Still differs: the real
 * ribbons are one per floor and finer; the colonnade piers are paler and
 * more closely spaced than drawn.
 *
 * Doubts
 * - The brief mentions a curved front; no evidence shows one beyond the
 *   circular skylight of the council chamber, so none is drawn.
 * - The low wing's 4th St face is seen only edge-on in the 2007 photo:
 *   window bands there are estimated.
 * - The north tip and the hypotenuse face are not shown head-on by any
 *   photo; treated like the leg faces.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, panel, save, walls, onWall, type XY } from './chi-aon-center'

const BEARING = 1.9
const ANCHOR: [number, number] = [35.2212571, -80.8394852]

const granite = new Part(), win = new Part(), roof = new Part(), voids = new Part(), glass = new Part(), pier = new Part()

const PLAZA = 5.4, COL = PLAZA + 10.0
const T_PAR = 71.4, T_ROOF = 70.7, W_ROOF = 15.4, W_PAR = 16.0

// counter-clockwise rings
const TOWER: XY[] = [[-40.5, -3.5], [23, -3.5], [23, 60]]
const WING: XY[] = [[-38.5, -3.5], [22.5, -63], [23, -3.5]]

/** A parapeted flat roof over a ring. */
function roofTop(r: XY[], zPar: number, zRoof: number, lip = 0.7) {
  const i = inset(r, lip)
  for (let k = 0; k < r.length; k++) {
    const j = (k + 1) % r.length
    granite.quad([r[k][0], r[k][1], zPar], [r[j][0], r[j][1], zPar], [i[j][0], i[j][1], zPar], [i[k][0], i[k][1], zPar])
    granite.quad([i[j][0], i[j][1], zPar], [i[k][0], i[k][1], zPar], [i[k][0], i[k][1], zRoof], [i[j][0], i[j][1], zRoof])
  }
  cap(roof, i, zRoof)
  return i
}

// ---------------------------------------------------------------- the tower
walls(granite, TOWER, 0, T_PAR)
const tIn = roofTop(TOWER, T_PAR, T_ROOF)
// the penthouse (lidar: 74-78 m over a small block near the centroid)
{
  const r: XY[] = [[-2, 14], [10, 14], [10, 26], [-2, 26]]
  walls(roof, r, T_ROOF, 74.0)
  cap(roof, r, 74.0)
}
void tIn

/** Faces of the tower: ribbon windows, two floors to a band, between solid corners. */
const BANDS: [number, number][] = []
for (let z = COL + 1.2; z + 4.0 < 64.8; z += 7.0) BANDS.push([z, z + 4.0])
for (let i = 0; i < 3; i++) {
  const a = TOWER[i], b = TOWER[(i + 1) % 3]
  const { L } = onWall(a, b)
  // solid corners: wider at the acute corners
  const endA = i === 2 ? 5.5 : i === 0 ? 5.5 : 3.0
  const endB = i === 0 ? 3.0 : i === 1 ? 5.5 : 5.5
  for (const [z0, z1] of BANDS) panel(win, a, b, endA, L - endB, z0, z1, 0.05)
  // the top band: a row of square openings
  // south face: seven across; east face: five, in its southern half only (both photos); hypotenuse: eight
  const n = i === 0 ? 7 : i === 1 ? 5 : 8
  const span = i === 1 ? (L - endA - endB) * 0.45 : L - endA - endB, step = span / n
  for (let k = 0; k < n; k++) {
    const c = endA + (k + 0.5) * step
    panel(voids, a, b, c - 1.6, c + 1.6, 66.4, 69.6, 0.05)
  }
}

// the two-storey colonnade at the foot of the east face (plaza) and the hypotenuse
function colonnade(a: XY, b: XY, z0: number, z1: number, bay = 7.5) {
  const { L, P } = onWall(a, b)
  const n = Math.max(1, Math.round(L / bay)), w = L / n
  for (let k = 0; k < n; k++) panel(win, a, b, k * w + 1.0, (k + 1) * w - 1.0, z0 + 0.3, z1 - 1.0, 0.05)
  // granite piers standing proud of the glass
  for (let k = 0; k <= n; k++) {
    const s = Math.min(L - 0.6, Math.max(0.6, k * w))
    const q = [P(s - 0.6, z0, 0), P(s + 0.6, z0, 0), P(s + 0.6, z0, 0.6), P(s - 0.6, z0, 0.6)].map(p => [p[0], p[1]] as XY).reverse()
    walls(pier, q, z0, z1)
    cap(pier, q, z1)
  }
  void P
}
colonnade(TOWER[1], TOWER[2], PLAZA, COL)                 // east face, on the plaza
colonnade(TOWER[2], TOWER[0], 0, 12.0, 8.5)          // hypotenuse, on Davidson / 5th side

// ---------------------------------------------------------------- the low wing (council chamber)
walls(granite, WING, 0, W_PAR)
roofTop(WING, W_PAR, W_ROOF, 0.6)
colonnade(WING[1], WING[2], PLAZA, W_ROOF - 0.4)          // east face, on the plaza
{
  // the 4th St face: two broad window bands (estimated)
  const a = WING[0], b = WING[1], { L } = onWall(a, b)
  const n = Math.round(L / 7), w = L / n
  for (let k = 1; k < n - 1; k++) {
    panel(win, a, b, k * w + 1.0, (k + 1) * w - 1.0, 2.0, 6.6, 0.05)
    panel(win, a, b, k * w + 1.0, (k + 1) * w - 1.0, 8.2, 13.6, 0.05)
  }
}
// the council chamber's circular skylight ring (NAIP)
{
  const cx = 9.5, cy = -16, R = 12, r0 = 10.6, seg = 16, z = W_ROOF + 0.12
  for (let k = 0; k < seg; k++) {
    const a0 = (k / seg) * 2 * Math.PI, a1 = ((k + 1) / seg) * 2 * Math.PI
    const P = (r: number, a: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
    glass.quad(P(r0, a0), P(R, a0), P(R, a1), P(r0, a1))
  }
  // a low drum edge so it reads from the side
  const ring: XY[] = Array.from({ length: seg }, (_, k) => [cx + R * Math.cos((k / seg) * 2 * Math.PI), cy + R * Math.sin((k / seg) * 2 * Math.PI)] as XY)
  walls(granite, ring, W_ROOF, z)
}

if (import.meta.main) {
  await save('clt-government-center', 'Charlotte-Mecklenburg Government Center', ANCHOR, BEARING, [
    { part: granite, material: finish('gc-granite', 0xdbcabd) },
    { part: pier, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: voids, material: finish('gc-opening', 0x4a4f57) },
    { part: roof, material: PALETTE.roof },
    { part: glass, material: PALETTE.glass },
  ])
}
