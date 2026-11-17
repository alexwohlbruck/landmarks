/**
 * Boston Public Library, Central Library, Copley Square: the McKim Building
 * (1895, McKim, Mead & White) and the Johnson Building (1972, Philip
 * Johnson) — original procedural geometry, CC0-1.0.
 * bun generators/bos-boston-public-library.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 340: the Back Bay grid of OSM relation/63755 runs
 * at 70°/340°, so x runs along Boylston Street (east +x, Dartmouth Street
 * and Copley Square; west -x, Exeter Street), +y is Boylston Street and -y
 * Blagden Street. Anchor = the outline's centroid, -71.0782886, 42.3493254.
 *
 * Identity (from the photos below):
 *  1. The McKim Building: a pale pink-grey Milford granite Renaissance
 *     palazzo, its upper storey one long arcade of thirteen round-headed
 *     windows on each street front over a plain rusticated ground storey,
 *     three arched entrances in the middle of the Dartmouth Street front.
 *  2. A deep cornice with green copper cresting, the carved frieze under it,
 *     and a low red-tile hipped roof round an open inner courtyard (with a
 *     small hipped pavilion on its east side).
 *  3. The Johnson Building behind it, in the same granite: a massive block
 *     in three bays a side between deep piers, a glass ground storey, a
 *     huge segmental lunette in each bay, a dark slot under the eaves, and
 *     a grey sloping roof rim round a flat top.
 *  4. A lower link between the two.
 *
 * Plan: OSM relation/63755 (outer way/29551175, inner way/29554877, the
 * courtyard) and its 19 building:part ways, in the turned frame, squared
 * up: McKim x 4..73.3, y ±35, courtyard x 17..47.5, y -22..20.5, east
 * pavilion x 39.5..47.5, y -8.7..7.2; link x -4.7..4.7, y ±30; Johnson
 * x -73.2..-4.7, y ±35. The lidar outline agrees with OSM's here.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 1 m grid, read
 * with tools/lidar_frame.py; y = 0 is the lowest ground (2.5 above the
 * grid's ground_min). Measured: McKim cornice 22.2, hip ridges 27.8–28.3,
 * the courtyard eaves about 24.5 (the arcade roof inside it 9, not drawn),
 * the pavilion 25; Johnson rim 22.2, rising over 8 m to the flat top at
 * 28.0, rooftop plant to about 31.5; the link 21–27 (drawn 22; OSM 18).
 * OSM: parts 24 m with 6 m roofs.
 *
 * Estimated from the photos (Lëa-Kim Châteauneuf's square-on Dartmouth
 * front, scaled from the 22.2 m cornice): the arcade (windows 3.0 m wide,
 * sills 11.0, apex 17.0, on a 4.1 m bay), the string course at 10, the
 * ground windows, the entrances (3.6 m wide, to 7.0), the frieze and the
 * cresting; on the Johnson, the piers, the lunettes (13 m chord, 6 m rise,
 * on 9.5) and the slot under the eaves.
 *
 * Ground: Mapterhorn and lidar ground fall about 1 m from Exeter Street to
 * Dartmouth Street; elevation 0. Copley Square's steps are the map's.
 *
 * Night: the McKim facades are floodlit (TanRo's night photo), its windows
 * and the Johnson's glass ground storey glow; the entrances are lit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - 2017 Boston Public Library McKim Building.jpg, Beyond My Ken, CC BY-SA
 *    4.0 (Boylston St front from the north-east)
 *    https://commons.wikimedia.org/wiki/File:2017_Boston_Public_Library_McKim_Building.jpg
 *  - Boston Public Library, McKim Building (2019).jpg, Lëa-Kim
 *    Châteauneuf, CC BY-SA 4.0 (Dartmouth St front, square on)
 *    https://commons.wikimedia.org/wiki/File:Boston_Public_Library,_McKim_Building_(2019).jpg
 *  - Boston Public Library, McKim Building (11-2019).jpg, Lëa-Kim
 *    Châteauneuf, CC BY-SA 4.0 (from the south-east)
 *    https://commons.wikimedia.org/wiki/File:Boston_Public_Library,_McKim_Building_(11-2019).jpg
 *  - Boston Library eb1.jpg, Fcb981, CC BY-SA 3.0 (Dartmouth St front)
 *    https://commons.wikimedia.org/wiki/File:Boston_Library_eb1.jpg
 *  - 2017 Boston Public Library Johnson Building.jpg, Beyond My Ken, CC BY-SA
 *    4.0 (Boylston St, from the north-west)
 *    https://commons.wikimedia.org/wiki/File:2017_Boston_Public_Library_Johnson_Building.jpg
 *  - Johnson building bpl.jpg, David Jones, CC BY 2.0 (Boylston St)
 *    https://commons.wikimedia.org/wiki/File:Johnson_building_bpl.jpg
 *  - Courtyard - Boston Public Library, McKim Building - DSC09277.JPG,
 *    Daderot, CC0 (the courtyard)
 *    https://commons.wikimedia.org/wiki/File:Courtyard_-_Boston_Public_Library,_McKim_Building_-_DSC09277.JPG
 *  - Boston Public Library's McKim Building at Night.jpg, TanRo, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Boston_Public_Library%27s_McKim_Building_at_Night.jpg
 *  - USGS NAIP orthophoto (public domain), for the roofs.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the Blagden Street (south) front is not photographed and is drawn
 * like Boylston Street. The McKim roof's hips are simplified to one ridge
 * ring; the east range really has a flat strip at the ridge. The courtyard
 * arcade and the inscriptions are left out. The Johnson's Exeter and
 * Blagden fronts are drawn like Boylston.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, at, band, box, cornice, hipRoof, onWall, rectShape, save, wall, type XY } from './atl-tech-tower'

const granite = new Part(), tile = new Part(), copper = new Part(), win = new Part(), slate = new Part(), door = new Part()

type F = [XY, XY]
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const cw = (r: XY[]) => [...r].reverse()

// ═══════════════════════════════ McKim Building ═══════════════════════════════
const MX0 = 4, MX1 = 73.3, MY = 35, TOP = 22.2
const M = rect(MX0, MX1, -MY, MY), CY = rect(17, 47.5, -22, 20.5)
wall(granite, M, 0, 20.9)
band(granite, M, 9.8, 0.6, 0.18)
cornice(granite, M, 20.9, 1.3, 0.85, null)
wall(copper, M.map(([x, y]) => [x + Math.sign(x - 38.65) * 0.62, y + Math.sign(y) * 0.62] as XY), TOP, TOP + 0.45)
// courtyard walls and the red-tile hip roof round it
wall(granite, cw(CY), 0, 24.5)
{
  const eave = rect(MX0 + 0.3, MX1 - 0.3, -MY + 0.3, MY - 0.3), ridge = rect(11, 60, -27.5, 27.5)
  tile.loft([at(eave, 22.0), at(ridge, 28.3)])
  tile.loft([at(cw(CY), 24.5), at(cw(ridge), 28.3)])
}
// the east pavilion in the courtyard
box(granite, 39.5, 47.5, -8.7, 7.2, 0, 22, null, 0)
hipRoof(tile, 39.5, 47.5, -8.7, 7.2, 22, 25.5, 0.4)

// The arcade of 13 round-headed windows a front, ground windows under them.
const ME: F = [[MX1, -MY], [MX1, MY]], MN: F = [[MX1, MY], [MX0, MY]], MS: F = [[MX0, -MY], [MX1, -MY]]
for (const f of [ME, MN, MS]) {
  const L = 2 * MY, bay = 4.1, s0 = L / 2 - 6 * bay
  for (let k = 0; k < 13; k++) {
    const s = s0 + k * bay
    onWall(win, f[0], f[1], archShape(s, 3.0, 11.0, 15.5, 10), 0.06)
    const entry = f === ME && k >= 5 && k <= 7
    if (entry) {
      onWall(door, f[0], f[1], archShape(s, 3.4, 0.4, 5.3, 10), 0.06)
    } else onWall(win, f[0], f[1], rectShape(s - 0.7, s + 0.7, 3.2, 5.6), 0.06)
  }
  // the frieze's panel band, a slightly sunk line under the cornice
  onWall(slate, f[0], f[1], rectShape(5.2, L - 5.2, 19.55, 19.75), 0.03)
}
// Courtyard: an upper row of round-headed windows on each side.
for (const [a, b] of [[[17, 20.5], [47.5, 20.5]], [[47.5, -22], [17, -22]], [[17, -22], [17, 20.5]]] as F[]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.round(L / 4.2)
  for (let k = 0; k < n; k++) onWall(win, a, b, archShape((k + 0.5) * (L / n), 2.0, 14.5, 17.5, 8), 0.06)
}

// ════════════════════════════════════ Link ════════════════════════════════════
box(granite, -4.7, MX0 + 0.1, -30, 30, 0, 22, slate, 0.3)

// ═══════════════════════════════ Johnson Building ═══════════════════════════════
const JX0 = -73.2, JX1 = -4.7, JY = 35
const J = rect(JX0, JX1, -JY, JY)
wall(granite, J, 0, TOP)
{
  const top = rect(JX0 + 8, JX1 - 8, -JY + 8, JY - 8)
  slate.loft([at(rect(JX0 - 0.4, JX1 + 0.4, -JY - 0.4, JY + 0.4), TOP - 0.2), at(top, 28.0)])
  slate.loft([at(J, TOP - 0.2), at(rect(JX0 - 0.4, JX1 + 0.4, -JY - 0.4, JY + 0.4), TOP - 0.2)])
  granite.cap(at(top, 28.0), true)
  box(slate, -30, -22, 0, 14, 28.0, 31.5, slate, 0.3)
}
const JW: F = [[JX0, JY], [JX0, -JY]], JN: F = [[JX1, JY], [JX0, JY]], JS: F = [[JX0, -JY], [JX1, -JY]]
for (const f of [JW, JN, JS]) {
  const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1]), bw = L / 3
  for (let k = 0; k < 3; k++) {
    const s = (k + 0.5) * bw
    // glass ground storey, set between the piers
    onWall(win, f[0], f[1], rectShape(s - bw / 2 + 1.6, s + bw / 2 - 1.6, 0.3, 5.6), 0.06)
    // the lunette: a segmental arch, 13 m chord, 6 m rise, on 9.5
    const c = 13 / 2, rise = 6, R = (c * c + rise * rise) / (2 * rise), a0 = Math.asin(c / R)
    const pts: [number, number][] = []
    for (let i = 0; i <= 10; i++) { const a = -a0 + (2 * a0 * i) / 10; pts.push([s + R * Math.sin(a), 9.5 - (R - rise) + R * Math.cos(a)]) }
    onWall(win, f[0], f[1], pts, 0.06)
    // the dark slot under the eaves
    onWall(win, f[0], f[1], rectShape(s - bw / 2 + 1.6, s + bw / 2 - 1.6, 18.6, 21.0), 0.06)
  }
  // two deep piers between the bays
  for (const k of [1, 2]) {
    const L2 = L, t: XY = [(f[1][0] - f[0][0]) / L2, (f[1][1] - f[0][1]) / L2], nn: XY = [t[1], -t[0]]
    const p = (u: number, v: number): XY => [f[0][0] + t[0] * u + nn[0] * v, f[0][1] + t[1] * u + nn[1] * v]
    const a = p(k * bw - 1.0, 0), b = p(k * bw + 1.0, 0.7)
    box(granite, Math.min(a[0], b[0]), Math.max(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[1], b[1]), 0, TOP - 0.3, granite, 0.25)
  }
}

const lit = (p: V3, n: V3) => (p[0] > MX0 && Math.abs(n[2]) < 0.5 && p[2] < 23 ? 0.85 : 0)
await save('bos-boston-public-library', 'Boston Public Library', [
  { part: granite, material: { ...finish('bpl-granite', 0xddd2c6), floodlight: lit } },
  { part: tile, material: finish('bpl-tile', 0xa8654f) },
  { part: copper, material: PALETTE.copper },
  { part: win, material: PALETTE.window },
  { part: slate, material: PALETTE.roof },
  { part: door, material: PALETTE.entrance },
], { height: 31.5, anchor: [42.3493254, -71.0782886], bearing: 340 })
