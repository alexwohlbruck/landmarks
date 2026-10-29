/**
 * Newark Liberty International Airport (EWR): the FAA air traffic control
 * tower (opened about 2002-04, replacing the 1960 Lorimer tower).
 * Procedural, CC0-1.0.
 *   bun generators/nyc-ewr-control-tower.ts
 *
 * A tall pale concrete shaft, square with broad chamfered corners and
 * scored with panel joints, that flares like a trumpet into an octagonal
 * head: a band of windows, a projecting lip, a sloped skirt, then the
 * narrower glass cab leaning outward under a dark roof, a dark equipment
 * box and a crown of antennas.
 *
 * Map frame: x and y along the shaft's faces, z up, metres; placed at
 * bearing 26, the turn of OSM's square (way/537070755) and octagon
 * (way/437257662) for the cab and head. Origin at their common centre.
 *
 * Published: 325 ft (99 m) (Wikipedia, "Newark Liberty International
 * Airport", History).
 * Measured (USGS_Lidar_Point_Cloud_NJ_SdL5_2014, 0.5 m grid; ground 2.5 m
 * over the box's lowest return): the head's skirt roof ring at r 7.5-10.5 m,
 * 90-91.5 m; the cab roof (r 4-7 m) 97.5 m; the equipment box 100 m. OSM
 * tags 60 / 62 m on these ways, which is wrong; the lidar and Wikipedia
 * agree on about 100 m.
 * Measured from photo t7 (straight on, 14.1 px per metre, scaled to OSM's
 * 22 m octagon and the lidar top): the shaft 13.5 m across with 8.5 m faces,
 * straight to 71.6 m; the flare to 21.3 m across at 84.4 m; the window band
 * to 87.6 m; the lip 22 m; the skirt up to 91.3 m; the cab 13.1 m across at
 * its foot, 14.5 m at its top, 91.5-96.8 m; the equipment box 9.6 m.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - t7 "NewarkAirportControlTower 01.jpg", Djflem, CC0: straight on,
 *   every proportion.
 *   https://commons.wikimedia.org/wiki/File:NewarkAirportControlTower_01.jpg
 * - t8 "NewarkAirportControlTowerMariottHotel.jpg", Djflem, CC0: the head
 *   and cab, the band of windows.
 *   https://commons.wikimedia.org/wiki/File:NewarkAirportControlTowerMariottHotel.jpg
 * - t1 "Newark Airport & Control TowerJPG.jpg", Sterilgutassistentin,
 *   CC BY-SA 3.0: from the airfield, the shaft over the terminals.
 *   https://commons.wikimedia.org/wiki/File:Newark_Airport_%26_Control_TowerJPG.jpg
 * - t4 "Newark Liberty ATC & Mariott Hotel.jpg", hh oldman, CC BY 3.0: from
 *   the roads to the south-east.
 *   https://commons.wikimedia.org/wiki/File:Newark_Liberty_ATC_%26_Mariott_Hotel.jpg
 * - t6 "Newark-Liberty.airside.ATCTJPG.jpg", Sterilgutassistentin,
 *   CC BY-SA 3.0: from the apron, west.
 *   https://commons.wikimedia.org/wiki/File:Newark-Liberty.airside.ATCTJPG.jpg
 *
 * Estimated: the chamfer of the shaft from the one view (it may be a
 * shallow curve rather than a flat); the head's plan is drawn as the OSM
 * octagon. The low base building at the foot (OSM way/232292234) is not
 * part of this model. Night: the head's window band is `window` (offices,
 * lit); the cab is `glass` and stays dark, as working cabs are kept dim.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const concrete = new Part(), band = new Part(), cab = new Part(), dark = new Part(), joints = new Part()

/** An octagon: half-width h, faces along the axes, main faces f = k*h wide (half). */
const oct = (h: number, k: number, z: number): V3[] => {
  const f = h * k
  return [[f, -h, z], [h, -f, z], [h, f, z], [f, h, z], [-f, h, z], [-h, f, z], [-h, -f, z], [-f, -h, z]]
}
const SHAFT_K = 0.63, HEAD_K = Math.tan(Math.PI / 8)
/** Loft (h, z, k) stations into faces. */
function loft(p: Part, st: [number, number, number][]) {
  p.loft(st.map(([h, z, k]) => oct(h, k, z)))
}
function capAt(p: Part, h: number, k: number, z: number, up = true) {
  p.cap(oct(h, k, z), up)
}

// shaft and flare
const flare: [number, number, number][] = [[6.75, 0, SHAFT_K], [6.75, 71.6, SHAFT_K]]
for (const [h, z] of [[6.95, 74], [7.5, 77], [8.4, 80], [9.6, 82.6], [10.65, 84.4]] as [number, number][]) {
  const t = (z - 71.6) / (84.4 - 71.6)
  flare.push([h, z, SHAFT_K + (HEAD_K - SHAFT_K) * t])
}
loft(concrete, flare)
// head: window band between a sill and a lintel course
loft(concrete, [[10.65, 84.4, HEAD_K], [10.65, 85.0, HEAD_K]])
loft(band, [[10.45, 85.0, HEAD_K], [10.45, 87.3, HEAD_K]])
concrete.loft([oct(10.45, HEAD_K, 85.0), oct(10.65, HEAD_K, 85.0)].reverse()) // reveal under the band
loft(concrete, [[10.45, 87.3, HEAD_K], [10.65, 87.3, HEAD_K], [10.65, 87.6, HEAD_K], [11.0, 87.6, HEAD_K], [11.0, 88.1, HEAD_K], [7.25, 91.3, HEAD_K]])
capAt(concrete, 7.25, HEAD_K, 91.3)
// the cab: glass leaning out, a dark roof, the equipment box, antennas
loft(dark, [[6.55, 91.3, HEAD_K], [6.55, 91.6, HEAD_K]])
loft(cab, [[6.55, 91.6, HEAD_K], [7.25, 96.8, HEAD_K]])
loft(dark, [[7.25, 96.8, HEAD_K], [7.4, 96.8, HEAD_K], [7.4, 97.5, HEAD_K], [4.8, 97.5, HEAD_K], [4.8, 100.0, HEAD_K]])
capAt(dark, 4.8, HEAD_K, 100.0)
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * 2 * Math.PI + Math.PI / 8, r = 6.6
  const x = r * Math.cos(a), y = r * Math.sin(a), s = 0.09
  const ring = (z: number): V3[] => [[x - s, y - s, z], [x + s, y - s, z], [x + s, y + s, z], [x - s, y + s, z]]
  dark.loft([ring(97.5), ring(i % 2 ? 102.6 : 101.2)])
}
// panel joints on the shaft: a few horizontal courses, faint and broad
for (let z = 9; z < 71; z += 9) {
  const r0 = oct(6.79, SHAFT_K, z), r1 = oct(6.79, SHAFT_K, z + 0.22)
  joints.loft([r0, r1])
}

const parts = [
  { part: concrete, material: finish('tower-concrete', 0xe1ddd4) },
  { part: joints, material: finish('concrete-joint', 0xc9c4ba) },
  { part: band, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
  { part: cab, material: { name: 'glass', color: 0x56697a, roughness: 0.24 } },
  { part: dark, material: finish('cab-metal', 0x4f555d) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Newark Airport Control Tower', parts, {
  license: 'CC0-1.0', bearing: 26, elevation: 0, height: 102.6,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/437257662', 'way/537070755'],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-ewr-control-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
