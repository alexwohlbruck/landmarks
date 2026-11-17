/**
 * Atlanta Marriott Marquis (1985, John Portman & Associates) — original
 * procedural geometry, CC0-1.0.
 * bun generators/atl-marriott-marquis.ts
 *
 * Uses the B2 kit exported from generators/atl-westin-peachtree-plaza.ts.
 *
 * Map frame: x east, y north, z up, metres, turned to the placement's
 * bearing (1°, the hotel tower's long axis in OSM). Anchor = centroid of
 * the hotel tower part OSM way/536787107 ("Marriott", 52 levels, height
 * 168.9), 33.761597, -84.384846. Only the tower is modelled; the low
 * podium round it (way/39448231 and its part way/1454316165, the atrium
 * wings, the dome way/886346703) stays the map's.
 *
 * Identity: a long white concrete slab whose two long faces swell outward
 * toward the bottom in a smooth concave curve — the "pregnant" profile —
 * both in section and in plan, where the base bulges as an arc out to
 * 35 m from the centre line against the 16 m of the upper slab. The faces
 * are a dense dark window grid between white piers that run down the
 * curve as fins; the narrow ends are blank white walls with a recessed
 * slot; a white parapet band crowns the top.
 *
 * Evidence:
 *  - plan: OSM way/536787107: the upper slab 84 × 32 m, the base arc to
 *    y = ±35.4 m at the middle, the end slots (x = ±39.4–42, y = −5.7–5.2).
 *  - section: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 1 m grid
 *    centred on the anchor. Along the middle of the north face the surface
 *    stands at 158 m (above lidar ground_min) at y = 16, 138 at 18, 115 at
 *    20, 84 at 24, 69 at 28 and meets the podium at about 30 m out near
 *    y = 34; the south face and the sections off the middle agree. The
 *    flare is modelled as offset d(x, z) = d0(x)·(1 − t)^1.4, with
 *    d0(x) = 19.4·(1 − (x/42)²)^0.85 m fitted to OSM's base arc, and
 *    t = (z − 34)/(top − 34) fitted to the lidar profile.
 *  - heights: the lidar's ground_min (310.3 m) lies about 4.5 m above
 *    Mapterhorn's lowest ground under the tower (305.8 m, its east side),
 *    because the podium covers the block; heights here are the lidar's plus
 *    4.5 m so y = 0 is the map's ground: roof 162.5, plant 165.5. Published:
 *    52 floors, 169 m (Wikipedia; OSM 168.9) — the model's 165.5 is within
 *    the difference of street levels round the block.
 *  - ground: Mapterhorn rises 4.6 m from the east side to the west;
 *    elevation 0.
 *  - colour: white painted concrete, dark window grid (all photos).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Marriott-marquis-atlanta-exterior.jpg, Connor.carey, CC BY-SA 3.0
 *    (the long face and its flare)
 *    https://commons.wikimedia.org/wiki/File:Marriott-marquis-atlanta-exterior.jpg
 *  - Atlanta Marriott Marquis.jpg, JJonahJackalope, CC BY-SA 4.0 (the
 *    long face and the podium)
 *    https://commons.wikimedia.org/wiki/File:Atlanta_Marriott_Marquis.jpg
 *  - Atlanta Marriott Marquis Hotel, Atlanta, GA (47474200551).jpg, Warren
 *    LeMay, CC0 (the white end wall and the flare from the corner)
 *    https://commons.wikimedia.org/wiki/File:Atlanta_Marriott_Marquis_Hotel,_Atlanta,_GA_(47474200551).jpg
 *  - Atlanta Marriott Marquis Hotel, Atlanta, GA (32532281487).jpg, Warren LeMay, CC0
 *    https://commons.wikimedia.org/wiki/File:Atlanta_Marriott_Marquis_Hotel,_Atlanta,_GA_(32532281487).jpg
 *  - Marriott-Marquis-rear-down.jpg, Connor.carey, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Marriott-Marquis-rear-down.jpg
 *  - Atlanta May 2025 (4).jpg, Raskuly, CC BY 4.0 (the atrium, inside;
 *    not modelled)
 *    https://commons.wikimedia.org/wiki/File:Atlanta_May_2025_(4).jpg
 * No look-only sources. No commercial imagery.
 *
 * The tower is drawn to the ground with its own facade: below the flare's
 * foot (34 m, where the podium meets it) the faces drop vertically, so no
 * bare band shows above the map's lower podium. Both long faces carry the
 * flare and the facade (the building is symmetric about its long axis).
 *
 * Doubts: the window grid is drawn as one panel per 5.25 m bay and four
 * storeys up the slab, and as broad two-bay strips between bold fins down
 * the flare (the real grid is finer); the red "Marriott Marquis" sign is
 * left off; the end walls' shallow vertical steps are reduced to the one recessed slot OSM maps.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, save } from './atl-westin-peachtree-plaza'

const concrete = new Part(), win = new Part(), roof = new Part()

const HX = 42, HY = 16, D0 = 19.4, ZB = 34, ROOF = 162.5, PARAPET = 154, PLANT = 165.5
const d0 = (x: number) => D0 * Math.pow(Math.max(0, 1 - (x / HX) ** 2), 0.85)
const f = (z: number) => (z <= ZB ? 1 : Math.pow(1 - (z - ZB) / (ROOF - ZB), 1.4))
/** The north face's surface point; the south face is its mirror. */
const S = (x: number, z: number, side: number): V3 => [x, side * (HY + d0(x) * f(z)), z]

// The concrete faces: rows denser where the curve bends most.
const rows = [0, ZB, 42, 51, 61, 72, 86, 104, 128, ROOF]
const BAYS = 16, W = (2 * HX) / BAYS
const cols = Array.from({ length: BAYS + 1 }, (_, i) => -HX + i * W)
const quadOut = (p: Part, a: V3, b: V3, c: V3, d: V3, side: number) => (side > 0 ? p.quad(b, a, d, c) : p.quad(a, b, c, d))

for (const side of [1, -1]) {
  for (let j = 0; j < rows.length - 1; j++) {
    for (let i = 0; i < cols.length - 1; i++) {
      const x0 = cols[i], x1 = cols[i + 1], z0 = rows[j], z1 = rows[j + 1]
      quadOut(concrete, S(x0, z0, side), S(x1, z0, side), S(x1, z1, side), S(x0, z1, side), side)
    }
  }
  // Windows, four storeys (about 12.5 m) a band, cut on the face's own
  // grid. Up the slab, one panel per 5.25 m bay with slim piers: the dense
  // dark grid. Down the flare and the tower's foot, to 3 m above the
  // ground, broad glass strips two bays wide between bold 2.8 m white fins
  // (jjj, LeMay's corner view). The end bays stay white on both.
  const G0 = 3, G1 = PARAPET - 1, bands = Math.round((G1 - G0) / 12.5), gh = (G1 - G0) / bands, GAP = 1.0
  for (let g = 0; g < bands; g++) {
    const za = G0 + g * gh + GAP / 2, zb = G0 + (g + 1) * gh - GAP / 2
    const flare = (za + zb) / 2 < 95
    const spans: [number, number][] = []
    if (flare) for (let k = 1; k < BAYS - 1; k += 2) spans.push([-HX + k * W + 1.4, -HX + (k + 2) * W - 1.4])
    else for (let k = 1; k < BAYS - 1; k++) spans.push([-HX + k * W + 0.4, -HX + (k + 1) * W - 0.4])
    for (const [xa, xb] of spans) {
      // Cut on the surface grid so each piece lies on one drawn cell.
      const zs = [za, ...rows.filter((r) => r > za && r < zb), zb]
      const xs = [xa, ...cols.filter((c) => c > xa && c < xb), xb]
      for (let q = 0; q < zs.length - 1; q++) {
        for (let r = 0; r < xs.length - 1; r++) {
          const P = (x: number, z: number) => L(x, z, side)
          quadOut(win, P(xs[r], zs[q]), P(xs[r + 1], zs[q]), P(xs[r + 1], zs[q + 1]), P(xs[r], zs[q + 1]), side)
        }
      }
    }
  }
}

/** The drawn (piecewise bilinear) surface, pushed 0.06 m out. */
function L(x: number, z: number, side: number): V3 {
  const i = Math.min(cols.length - 2, Math.max(0, cols.findIndex((c, n) => n < cols.length - 1 && x <= cols[n + 1] + 1e-9)))
  const j = Math.min(rows.length - 2, Math.max(0, rows.findIndex((c, n) => n < rows.length - 1 && z <= rows[n + 1] + 1e-9)))
  const u = (x - cols[i]) / (cols[i + 1] - cols[i]), v = (z - rows[j]) / (rows[j + 1] - rows[j])
  const y = (xx: number, zz: number) => S(xx, zz, side)[1]
  const yy = (1 - u) * (1 - v) * y(cols[i], rows[j]) + u * (1 - v) * y(cols[i + 1], rows[j]) + u * v * y(cols[i + 1], rows[j + 1]) + (1 - u) * v * y(cols[i], rows[j + 1])
  // Pushed out along the face's plan normal, so panels near the curved
  // ends stand clear of the wall too.
  // Plus the cell's twist: a drawn cell is two flat triangles, which part
  // from the bilinear surface by up to a quarter of the twist.
  const twist = Math.abs(y(cols[i], rows[j]) + y(cols[i + 1], rows[j + 1]) - y(cols[i + 1], rows[j]) - y(cols[i], rows[j + 1])) / 4
  const o = 0.06 + twist
  const e = 0.05, g = (S(x + e, z, side)[1] - S(x - e, z, side)[1]) / (2 * e), n = Math.hypot(g, 1)
  return [x - (side * g * o) / n, yy + (side * o) / n, z]
}

// The slab's core and its blank ends, with the recessed slot at each end.
box(concrete, -39.4, 39.4, -HY, HY, 0, ROOF, roof, 0.5)
for (const sx of [-1, 1]) {
  const x0 = sx > 0 ? 39.4 : -HX, x1 = sx > 0 ? HX : -39.4
  box(concrete, x0, x1, -HY, -5.7, 0, ROOF, roof, 0.4)
  box(concrete, x0, x1, 5.2, HY, 0, ROOF, roof, 0.4)
}
// The roof's plant room (lidar 3 m over the roof).
box(concrete, -4, 24, -12, 8, ROOF - 0.5, PLANT, roof, 0.4)

await save('atl-marriott-marquis', 'Atlanta Marriott Marquis', [
  { part: concrete, material: finish('marquis-concrete', 0xece5d9) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
], { height: PLANT, anchor: [33.761597, -84.384846], bearing: 1 })
