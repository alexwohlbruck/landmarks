/**
 * Hilton Palacio del Rio, San Antonio: procedural, CC0-1.0.
 * bun generators/sat-hilton-palacio-del-rio.ts
 *
 * Map frame: built turned to bearing 21.9 (the slab's long axis, from the
 * 2017 lidar), so local +y runs along the slab to the north-north-east
 * and +x across it to the east-south-east; metres, z up. The origin is the
 * slab's centre (-98.4878407, 29.4223935). y = 0 is the lowest ground under
 * the footprint, the River Walk along the slab's west side; the street on
 * the east is 6 m higher.
 *
 * Cerna and Garza / H.B. Zachry, 1968, for HemisFair: the first hotel of
 * its size built of prefabricated rooms, 496 concrete modules furnished in
 * a yard and craned into a concrete frame in 202 days. A 21-storey slab,
 * its long faces a grid of projecting room boxes with balconies between
 * solid cream end walls, under a dark crown band; a low wing at its south
 * end along the street and another at its north end.
 *
 * Measured (lidar USGS_LPC_TX_Central_B2_2017_LAS_2019, flown 2017;
 * heights above y = 0):
 * - the slab 87.5 by 25 m, its roof 66.7 m; the lift and stair core on
 *   its west side to 73 m;
 * - the south wing (OSM's outline, east of the slab's south half) and the
 *   north wing about 17-18 m.
 * From photos: the module grid (about 20 bays by 18 floors on each long
 * face), the solid end bays, the dark crown band with its fins, the cream
 * concrete.
 * Drawn: the module grid as grouped relief, per STYLE.md: a recessed dark
 * (shadowed balconies, so a darker window colour)
 * window wall behind cream fins every two modules and slabs every two
 * floors, so each cell stands for four rooms.
 * Estimated: the module size (4.1 m by 2.9 m), the end bays (7.5 m), the
 * crown band (6 m), the relief depth (1.4 m); the fins and slabs drawn
 * 1.7 and 1.3 m thick so the cream frame reads as much as the shadows.
 * Left out: balcony rails, the arcade at the base, signs.
 *
 * OSM: way/79156153 (outline, no parts), replaced.
 *
 * Night: the rooms are `window`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Hilton Palacio del Rio.jpg", Toohool, CC BY-SA 4.0
 * - "Hilton Palacio del RIo, San Antonio.jpg", Blas J, CC BY-SA 4.0
 * - "Hilton Palacio Del Rio from River Walk, northside.jpg", Robert Simmons, CC BY 2.0
 * - "HiltondelRiosantx.JPG", Sahmeditor, public domain
 * - "Hilton Palacio Del Rio hotel, cropped.JPG", ZeChief, CC BY-SA 3.0 (from above)
 * No look-only sources used.
 *
 * Doubts: the wings' heights and facades are read from the lidar and
 * distant photos only.
 */
import { Part, writeGlb } from './mesh'
import { PALETTE, finish } from './palette'
import { ring, walls, capPoly, box, bayPanels, type XY } from './sat-frost-tower'

const conc = new Part()
const win = new Part()
const crown = new Part()
const roofP = new Part()

const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => ring([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
const X0 = -12.9, X1 = 12.1, Y0 = -43.6, Y1 = 43.8, TOP = 66.7, CROWN = 60.7, END = 7.5, D = 1.4

// The slab: cream end bays full height, the long faces recessed behind the
// module grid between them, the dark crown band on top.
walls(conc, rect(X0, X1, Y0, Y0 + END), 0, CROWN)
walls(conc, rect(X0, X1, Y1 - END, Y1), 0, CROWN)
walls(win, rect(X0 + D, X1 - D, Y0 + END, Y1 - END), 0, CROWN)
walls(crown, rect(X0 - 0.3, X1 + 0.3, Y0 - 0.3, Y1 + 0.3), CROWN, TOP)
capPoly(roofP, rect(X0 - 0.3, X1 + 0.3, Y0 - 0.3, Y1 + 0.3), TOP, true)
// fins in the crown band, every 4.1 m, standing out of it
for (let y = Y0 + 2; y < Y1 - 1; y += 4.1) for (const x of [X0 - 0.55, X1 + 0.55]) box(crown, x, y, 0.3, 0.25, CROWN, TOP - 0.4)
// the module grid on both long faces: slabs every two floors, fins every
// two modules, from the first module floor to the crown
{
  const Z0 = 8.0, FLR = 2.9, MOD = 4.1
  for (const [xf, xb] of [[X0, X0 + D], [X1 - D, X1]] as [number, number][]) {
    const cx = (xf + xb) / 2, hx = (xb - xf) / 2
    for (let z = Z0; z <= CROWN - 0.5; z += 2 * FLR) box(conc, cx, 0, hx, (Y1 - Y0) / 2 - END, z - 0.65, z + 0.65)
    for (let y = Y0 + END; y <= Y1 - END + 0.01; y += 2 * MOD) box(conc, cx, y, hx, 0.85, Z0 - 0.65, CROWN)
  }
  // the ground floors below the grid: cream walls with shopfront glass
  walls(conc, rect(X0, X1, Y0 + END, Y1 - END), 0, Z0 - 0.35)
  bayPanels(win, rect(X0, X1, Y0 + END, Y1 - END), [[1.0, 6.4]], 3.0, 1.1, 4, (i) => i === 0 || i === 2)
}
// windows in the end bays (a narrow column each side)
bayPanels(win, rect(X0, X1, Y0, Y0 + END), [[10, 58]], 0.9, 3.2, 4, (i) => i !== 0)
bayPanels(win, rect(X0, X1, Y1 - END, Y1), [[10, 58]], 0.9, 3.2, 4, (i) => i !== 2)
// the lift and stair core above the roof, on the west side
box(conc, X0 + 5, 2.5, 3.0, 10.5, TOP, 73.0)

// The wings: south (east of the slab's south half, along the street) and north.
const WING = 17.5
for (const P of [
  ring([[X1, -39.8], [25.4, -39.8], [25.4, -8.1], [X1, -8.1]]),
  ring([[-10.1, Y1], [9.9, Y1], [9.9, 44.4], [6.0, 44.4], [5.8, 50.2], [3.6, 50.1], [3.8, 54.1], [-10.3, 54.7]]),
]) {
  walls(conc, P, 0, WING)
  capPoly(roofP, P, WING, true)
  bayPanels(win, P, [[7.5, 10.5], [12.0, 15.0]], 2.4, 1.6, 4)
}
// a low entrance block across the slab's south end (lidar about 6 m)
{
  const P = ring([[-14.3, -46.8], [10.9, -46.6], [10.9, Y0], [-14.3, Y0]])
  walls(conc, P, 0, 6.0)
  capPoly(roofP, P, 6.0, true)
}

// Colours from daylight photos, pulled to the palette's lightness.
const parts = [
  { part: conc, material: PALETTE.stone },
  { part: win, material: { name: 'window', color: 0x5b6068, roughness: 0.35 } },
  { part: crown, material: finish('palacio-crown', 0x5e534b) },
  { part: roofP, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Hilton Palacio del Rio', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 21.9, elevation: 0, height: 73.0, anchor: [29.4223935, -98.4878407], replaces: ['way/79156153'],
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/sat-hilton-palacio-del-rio.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
