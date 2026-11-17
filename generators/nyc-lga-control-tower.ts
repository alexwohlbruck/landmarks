/**
 * LaGuardia Airport air traffic control tower, Queens — procedural, CC0-1.0, no textures.
 * bun generators/nyc-lga-control-tower.ts
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0 (the tower is
 * round). Anchor: area centroid of the OSM outline way/284852152 (tower and
 * its two-storey base wing). The tower stands at (−9.9, −13.3) in this frame.
 *
 * Identity checked: OSM way/647215656 inside that outline is tagged
 * aeroway=tower, man_made=tower, service=aircraft_control, 68 m; the photos
 * from the Grand Central Parkway show this tower beside Terminal B.
 *
 * Identifying features (photos): a thick round concrete shaft; a white collar
 * where it meets the big blue metal drum, which has a rounded underside,
 * small grouped windows and, at its top, a recessed band of glass under a
 * wide thin disc roof; above that a short blue plinth and the octagonal cab
 * of dark glass leaning outward, under a flat roof bristling with antennas.
 *
 * Evidence
 * - OSM: way/284852152 (outline, 68 m), way/647215656 (tower part, round,
 *   26.4 m across, 68 m), way/1222335146 (base wing, 2 levels).
 * - Lidar: USGS 3DEP NY_NewYorkCity, flown 2017 (tower opened 2010), 0.5 m,
 *   above the apron (~3.2 m NAVD88): the drum's roof 57–58 m over a circle
 *   of r ≈ 12–13 m centred (−10, −14); the cab 67–70 m (antennas); the base
 *   wing 11–12 m. (work/nyc-lga-control-tower/lidar.json)
 * - Photos (Wikimedia Commons, Tdorante10, CC BY-SA 4.0):
 *   https://commons.wikimedia.org/wiki/File:Grand_Central_Pkwy_td_(2022-01-14)_043_-_LaGuardia_Airport_Terminal_B_Tower.jpg
 *     (from the south; proportions scaled from it against the OSM drum
 *     diameter and the lidar's 57.5 m drum roof)
 *   https://commons.wikimedia.org/wiki/File:Grand_Central_Pkwy_td_(2022-01-14)_041_-_LaGuardia_Airport_Terminal_B_Tower.jpg
 *   https://commons.wikimedia.org/wiki/File:Grand_Central_Pkwy_td_(2022-01-14)_045_-_LaGuardia_Airport_Terminal_B.jpg
 *
 * Estimated (from the 043 photo): shaft r 6.6 m to 38 m; collar 38–40.5 m;
 * the blue drum 40.5–54 m with its rounded underside; the glass band
 * 54–57 m; the disc roof's white edge 57–57.6 m, r 13.6 m, rising as a blue cap to
 * the cab at 60.5 m; the cab glass 60.5–65.4 m (r 5.8 → 7.0 m); cab roof
 * 66.9 m, the antennas (left out) taking it to OSM's 68 m and the lidar's 70. The base
 * wing's facade (grey panels and one window band per storey). Antennas and
 * the window groups' exact placement are left out / simplified.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, capPoly, finishModel, facade, area, type Facade } from './nyc-570-lexington'
import { lathe } from './clt-terminal'

const blue = new Part(), win = new Part(), trim = new Part(), conc = new Part(), roof = new Part(), panel = new Part()
const CX = -9.9, CY = -13.3, SEG = 28

// Shaft and collar.
lathe(conc, CX, CY, [[6.6, 0], [6.6, 38.0]], SEG)
lathe(trim, CX, CY, [[6.6, 38.0], [7.6, 38.2], [8.4, 39.2], [8.6, 40.5]], SEG)
// The drum: rounded underside, blue body, glass band, disc roof.
lathe(blue, CX, CY, [[8.6, 40.5], [10.6, 40.9], [11.9, 41.8], [12.5, 43.2], [12.7, 45.5], [12.8, 54.0]], SEG)
lathe(win, CX, CY, [[12.4, 54.0], [12.4, 57.0]], SEG)
lathe(trim, CX, CY, [[12.4, 57.0], [13.6, 57.05], [13.7, 57.35], [13.5, 57.6]], SEG)
lathe(blue, CX, CY, [[13.5, 57.6], [9.6, 57.9], [7.4, 59.2], [5.9, 60.5]], SEG)
// Plinth, then the octagonal cab (flat faces) and its roof.
function octBand(p: Part, r0: number, z0: number, r1: number, z1: number) {
  const pt = (r: number, i: number, z: number): V3 => { const t = Math.PI / 8 + (i * Math.PI) / 4; return [CX + r * Math.cos(t), CY + r * Math.sin(t), z] }
  for (let i = 0; i < 8; i++) p.quad(pt(r0, i, z0), pt(r0, i + 1, z0), pt(r1, i + 1, z1), pt(r1, i, z1))
}
octBand(win, 5.8, 60.5, 7.0, 65.4)
octBand(blue, 7.0, 65.4, 7.1, 66.4)
{
  const top: XY[] = Array.from({ length: 8 }, (_, i) => { const t = Math.PI / 8 + (i * Math.PI) / 4; return [CX + 6.6 * Math.cos(t), CY + 6.6 * Math.sin(t)] as XY })
  octBand(roof, 7.1, 66.4, 6.6, 66.9)
  capPoly(roof, top, 66.9)
}
// Small window groups on the drum (two rows of a few panes, in six places), 0.06 m proud.
for (let g = 0; g < 6; g++) {
  const a0 = (g / 6) * 2 * Math.PI + 0.3
  for (const [z0, z1] of [[46.2, 47.6], [48.2, 49.6]]) {
    const n = 5, span = 0.42
    for (let k = 0; k < n; k++) {
      const t0 = a0 + (k / n) * span, t1 = a0 + ((k + 0.82) / n) * span, r = 12.78
      const P = (t: number, z: number): V3 => [CX + r * Math.cos(t), CY + r * Math.sin(t), z]
      win.quad(P(t0, z0), P(t1, z0), P(t1, z1), P(t0, z1))
    }
  }
}

// --- The base wing (way/1222335146 and the small piece to the south-west), 11.5 m ---
const WING: XY[] = [[-26.1, -5.7], [-27.5, -4.5], [-0.9, 21.3], [11.0, 20.2], [10.0, 9.1], [7.1, 3.5], [4.0, 0.3], [2.5, 1.5], [-14.2, -15.3], [-15.0, -14.5], [-16.3, -11.8], [-18.2, -9.5], [-20.5, -7.6], [-23.2, -6.3]]
const wingFacade: Facade = { bay: 4.5, ratio: 0.8, floor: 5.2, group: 1, spandrel: 1.4, sill: 1.2, head: 1.2, ground: 1.2, minLength: 3 }
function wing(ring0: XY[], h: number) {
  const ring = area(ring0) < 0 ? ring0.slice().reverse() : ring0
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const inTower = Math.hypot(m[0] - CX, m[1] - CY) < 6.4
    facade(panel, inTower ? null : win, a, b, 0, h - 0.4, inTower ? null : wingFacade)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    trim.quad([a[0] + n[0] * 0.1, a[1] + n[1] * 0.1, h - 0.4], [b[0] + n[0] * 0.1, b[1] + n[1] * 0.1, h - 0.4], [b[0] + n[0] * 0.1, b[1] + n[1] * 0.1, h], [a[0] + n[0] * 0.1, a[1] + n[1] * 0.1, h])
  }
  capPoly(roof, ring, h)
}
wing(WING, 11.5)
wing([[-13.9, -29.3], [-23.1, -22.2], [-19.2, -19.0], [-11.5, -24.6]], 6)

finishModel('LaGuardia Airport Air Traffic Control Tower', 'nyc-lga-control-tower', [
  { part: blue, material: finish('lga-tower-blue', 0x86a3c3) },
  { part: win, material: PALETTE.window },
  { part: trim, material: PALETTE.trim },
  { part: conc, material: finish('lga-tower-concrete', 0xd8d2c6) },
  { part: roof, material: PALETTE.roof },
  { part: panel, material: PALETTE.stone },
], { bearing: 0, osm: 'way/284852152', height: 66.9 }, 5000)
