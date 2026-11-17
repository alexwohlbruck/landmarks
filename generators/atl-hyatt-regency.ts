/**
 * Hyatt Regency Atlanta (1967, John Portman & Associates) — original
 * procedural geometry, CC0-1.0.
 * bun generators/atl-hyatt-regency.ts
 *
 * Uses the B2 kit exported from generators/atl-westin-peachtree-plaza.ts.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (OSM's edges run
 * east-west and north-south). Anchor = centroid of the original hotel
 * block, OSM way/39448958 (building:part "Atrium", 24 levels, height 100),
 * 33.76159, -84.386805. Only the 1967 atrium block and the Polaris on it
 * are modelled; the later International Tower (way/40808009), the round
 * Radius Tower (way/39448226) and the low podium (way/40808010) stay the
 * map's.
 *
 * Identity: a square block of hotel rooms in pale concrete, their balcony
 * bands wrapping all four faces, round the first great atrium; its skylit
 * roof is raised over the room ring under a frame of crossing concrete
 * beams; and toward its south edge, on a brown fluted
 * stem, the Polaris: a white flying-saucer revolving restaurant ringed
 * with glass, a smaller ring below it, and a bold blue glass dome, lit
 * blue at night.
 *
 * Evidence:
 *  - plan: OSM way/39448958 (the block, 62 × 54 m) and the dome part
 *    way/536754033 (r ≈ 8.6 m, centre 0.5 m west and 10.3 m south of the
 *    anchor); the lidar puts the Polaris's disc on the same centre, 9 m
 *    south of the block's middle, its rim 4 m from the south face; NAIP
 *    (leaning with height) also shows it in the block's southern half.
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 1 m grid
 *    centred on the anchor. Its ground_min (310.8 m) is 3.5 m below
 *    Mapterhorn's lowest ground under the block (314.3 m, its north-east
 *    corner), so heights here are the lidar's minus 3.5 m: room-ring roof
 *    72.2, parapet 73.7, raised atrium roof and frame 79.7, Polaris deck
 *    94.2–95.5 out to r ≈ 12.5 m, its inner step 96.8, dome top 102.7.
 *    Published: 22 floors (Wikipedia). The saucer's underside, the lower
 *    ring and the stem are photo-scaled from Carey's side view (estimates).
 *  - ground: Mapterhorn falls about 8 m from the west side to the north-
 *    east corner; elevation 0. The west faces' lowest band is buried.
 *  - colour: pale concrete, dark windows behind the balcony bands, the
 *    brown stem, the blue dome (all photos); the skylit atrium roof's pale
 *    beige coffers (NAIP, Carey's aerial), kept named `glass` so it stays
 *    dark at night.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Hyatt-regency-atlanta-aerial.jpg, Connor.carey, CC BY-SA 3.0 (from
 *    above: the raised atrium roof, the beam frame, the Polaris)
 *    https://commons.wikimedia.org/wiki/File:Hyatt-regency-atlanta-aerial.jpg
 *  - Hyatt-regency-atlanta-side.jpg, Connor.carey, CC BY-SA 3.0 (a full
 *    face and the Polaris's profile)
 *    https://commons.wikimedia.org/wiki/File:Hyatt-regency-atlanta-side.jpg
 *  - Hyatt Regency Atlanta Hotel, Atlanta, GA (46750903724).jpg, Warren
 *    LeMay, CC0 (the corner from the street)
 *    https://commons.wikimedia.org/wiki/File:Hyatt_Regency_Atlanta_Hotel,_Atlanta,_GA_(46750903724).jpg
 *  - Hyatt Regency Atlanta Hotel, Atlanta, GA (32532281407).jpg, Warren LeMay, CC0
 *    https://commons.wikimedia.org/wiki/File:Hyatt_Regency_Atlanta_Hotel,_Atlanta,_GA_(32532281407).jpg
 *  - Hyatt Regency Atlanta Aug 2025 01.jpg and 02.jpg, Thomson200, CC0 (the
 *    atrium inside; not modelled)
 *    https://commons.wikimedia.org/wiki/File:Hyatt_Regency_Atlanta_Aug_2025_01.jpg
 *    https://commons.wikimedia.org/wiki/File:Hyatt_Regency_Atlanta_Aug_2025_02.jpg
 *  - Atlanta May 2025 (5).jpg, Raskuly, CC BY 4.0
 *    https://commons.wikimedia.org/wiki/File:Atlanta_May_2025_(5).jpg
 * No look-only sources. No licensed night photo was found; the dome is
 * `neon-polaris-dome` (it glows blue, as the dome is lit blue after dark)
 * and the restaurant's glass ring is `window`. No commercial imagery.
 *
 * USGS NAIP (public domain) for the roof plan and colour.
 *
 * Doubts: the beam frame is simplified to two beams each way; only the
 * brown stair shaft on the east face is drawn (the other faces' are not
 * photographed clearly); the balconies are drawn as continuous two-storey
 * window bands rather than per-floor railings; OSM's dome part
 * (r 8.6 m) includes the step round the dome, drawn here as the deck.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, circle, edgePanels, fan, save, type XY } from './atl-westin-peachtree-plaza'

const concrete = new Part(), win = new Part(), glass = new Part(), dome = new Part(), taupe = new Part(), roof = new Part()

const X0 = -31, X1 = 31, Y0 = -27.3, Y1 = 27.2
const ROOF = 72.2, PARA = 73.7, ATR = 79.7
const C: XY = [0.5, -10] // the Polaris's centre

/**
 * A surface of revolution about `c` through profile points (r, z), with
 * smooth normals along the profile's segments (flat-shaded between
 * segments, so rims stay crisp).
 */
function lathe(p: Part, c: XY, prof: [number, number][], n = 16) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const dr = r1 - r0, dz = z1 - z0, l = Math.hypot(dr, dz) || 1
    // Outward normal of the segment in the (r, z) plane.
    const nr = dz / l, nz = -dr / l
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2
      const P = (r: number, z: number, a: number): V3 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z]
      const N = (a: number): V3 => [nr * Math.cos(a), nr * Math.sin(a), nz]
      const A = P(r0, z0, a0), B = P(r0, z0, a1), Cc = P(r1, z1, a1), D = P(r1, z1, a0)
      if (r0 > 1e-6) p.tri(A, B, Cc, undefined, undefined, undefined, [N(a0), N(a1), N(a1)])
      if (r1 > 1e-6) p.tri(A, Cc, D, undefined, undefined, undefined, [N(a0), N(a1), N(a0)])
    }
  }
}

// ── The room block, with its parapet. ──
box(concrete, X0, X1, Y0, Y1, 0, PARA, roof, 0.5)
// Balcony bands: two storeys each, wrapping every face.
const band = { group: 6.6, gap: 1.9, bay: 70, pier: 0.9, margin: 2 }
edgePanels(win, [X1, Y1], [X0, Y1], 7, ROOF - 1, band)
edgePanels(win, [X0, Y0], [X1, Y0], 7, ROOF - 1, band)
edgePanels(win, [X0, Y1], [X0, Y0], 7, ROOF - 1, band)
edgePanels(win, [X1, Y0], [X1, Y1], 7, ROOF - 1, band)

// The brown stair shaft near the north end of the east face (Carey's side
// view), standing a little proud and rising past the parapet.
box(taupe, X1 - 2.5, X1 + 0.6, 9.5, 14.5, 0, PARA + 3, roof, 0.3)

// ── The raised atrium roof: glazed clerestory sides and a skylit top. ──
const AX0 = -21, AX1 = 21, AY0 = -18.8, AY1 = 15.6
box(glass, AX0, AX1, AY0, AY1, PARA - 0.5, ATR - 1.5, glass, 0.2)
box(concrete, AX0 - 0.3, AX1 + 0.3, AY0 - 0.3, AY1 + 0.3, ATR - 1.5, ATR - 0.4, glass, 0.3)
// The beam frame: two beams each way across the roof, out to the block's
// edges and no further (NAIP shows them ending at the parapet).
for (const y of [AY0 + 1, AY1 - 1]) box(concrete, X0 + 0.4, X1 - 0.4, y - 0.9, y + 0.9, ATR - 1.6, ATR, concrete, 0.3)
for (const x of [AX0 + 1, AX1 - 1]) box(concrete, x - 0.9, x + 0.9, Y0 + 0.4, Y1 - 0.4, ATR - 1.6, ATR, concrete, 0.3)
// Short posts carrying the beams over the room-ring roof.
for (const y of [AY0 + 1, AY1 - 1]) for (const x of [X0 + 2, X1 - 2]) box(concrete, x - 0.8, x + 0.8, y - 0.8, y + 0.8, PARA - 0.5, ATR - 1.6, concrete, 0.2)
for (const x of [AX0 + 1, AX1 - 1]) for (const y of [Y0 + 2, Y1 - 2]) box(concrete, x - 0.8, x + 0.8, y - 0.8, y + 0.8, PARA - 0.5, ATR - 1.6, concrete, 0.2)

// ── The Polaris. ──
// The brown fluted stem (a 12-sided drum).
lathe(taupe, C, [[4.6, ATR - 0.5], [4.6, 88]], 12)
// The lower ring.
lathe(concrete, C, [[4.6, 84.4], [10.4, 84.4], [10.4, 86.6], [7.2, 86.6], [7.2, 85.2], [4.6, 85.2]], 16)
// The saucer: the flared underside, the rim, the restaurant's glass ring,
// the deck and the inner step.
lathe(concrete, C, [[4.6, 88], [10.5, 90.6], [13, 92.2], [13, 93.4]], 16)
lathe(win, C, [[13, 93.4], [12.6, 93.4], [12.6, 94.6], [12.9, 94.6]], 16)
lathe(concrete, C, [[12.9, 94.6], [12.9, 95.4], [8.4, 95.7], [8.4, 96.8], [7.2, 96.8]], 16)
// The dome: a flattened half-ellipsoid, 7.2 m in radius (lidar: 104–106
// within r ≈ 5, 100 at r ≈ 8 on the step), 5.9 m high.
{
  const R = 7.2, H = 5.9, rings = 5, prof: [number, number][] = []
  for (let k = 0; k <= rings; k++) {
    const a = (k / rings) * (Math.PI / 2)
    prof.push([R * Math.cos(a), 96.8 + H * Math.sin(a)])
  }
  // Smooth across the rings: normals from the ellipsoid itself.
  for (let k = 0; k < rings; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    for (let i = 0; i < 16; i++) {
      const a0 = (i / 16) * Math.PI * 2, a1 = ((i + 1) / 16) * Math.PI * 2
      const P = (r: number, z: number, a: number): V3 => [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a), z]
      const N = (r: number, z: number, a: number): V3 => {
        const v: V3 = [(r / (R * R)) * Math.cos(a), (r / (R * R)) * Math.sin(a), (z - 96.8) / (H * H)], l = Math.hypot(...v)
        return [v[0] / l, v[1] / l, v[2] / l]
      }
      dome.tri(P(r0, z0, a0), P(r0, z0, a1), P(r1, z1, a1), undefined, undefined, undefined, [N(r0, z0, a0), N(r0, z0, a1), N(r1, z1, a1)])
      if (k < rings - 1) dome.tri(P(r0, z0, a0), P(r1, z1, a1), P(r1, z1, a0), undefined, undefined, undefined, [N(r0, z0, a0), N(r1, z1, a1), N(r1, z1, a0)])
    }
  }
  // The ribs' small cap at the top.
  fan(concrete, circle(C, 0.6, 8), 96.8 + H + 0.02, true, C)
}

await save('atl-hyatt-regency', 'Hyatt Regency Atlanta', [
  { part: concrete, material: finish('hyatt-concrete', 0xe8dfcf) },
  { part: win, material: PALETTE.window },
  { part: glass, material: { ...PALETTE.glass, color: 0xd9cdb6 } },
  { part: dome, material: finish('neon-polaris-dome', 0x4a84c4, 0.3) },
  { part: taupe, material: finish('hyatt-taupe', 0x9c8a77) },
  { part: roof, material: PALETTE.roof },
], { height: 102.7, anchor: [33.76159, -84.386805], bearing: 0 })
