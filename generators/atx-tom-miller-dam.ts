/**
 * Tom Miller Dam, Austin (1940; City of Austin with the PWA, operated by the LCRA) -
 * procedural, CC0-1.0, no textures.
 * bun generators/atx-tom-miller-dam.ts
 *
 * The concrete gravity dam that holds Lake Austin above Lady Bird Lake: from the
 * west bank, a long uncontrolled ogee spillway; then the gated spillway, nine
 * bays of green tainter gates between ten piers whose downstream ends sweep down
 * to the apron, with the deck and the crane gantry running along the pier tops;
 * then the powerhouse, a tall concrete block with six tall glass-block windows on
 * its downstream face, its intake deck and gantry behind; then the non-overflow
 * crest to the east bank. The water is the map's.
 *
 * Frame: x along the dam's axis (to the east, bearing 96), y across it (+y
 * upstream, to the lake), z up, metres; catalog bearing 6. Anchor -97.78607,
 * 30.29393 (on the gated spillway, near its middle). z = 0 is the tailwater, the
 * lowest ground under the dam on the map's terrain (Mapterhorn 130.56 m; lidar
 * tailwater 130.5-131.0 m). Lake Austin stands at z 19.4 on the map (lidar 19.6;
 * normal pool 492.8 ft = 150.2 m). Everything runs down to z = 0; the upstream
 * faces go down into the lake, where the map's water hides them, and the ends
 * run into the banks.
 *
 * Replaces: the dam way/188468899 (waterway=dam area) and the powerhouse
 * way/382685792. The power plant's other building, way/382685916 (19.4 m, south
 * of the powerhouse), and its switchyard are left to the map.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): way/188468899 (height 30.6324,
 *   ref:US:NID TX01086, Q7816897); the powerhouse way/382685792 (height 25.7); the
 *   Tom Miller Power Plant way/508764501 (landuse, LCRA, 18 MW).
 * - Lidar (measured; USGS 3DEP USGS_LPC_TX_Central_B1_2017_LAS_2019, flown 2017,
 *   1 m grid, read in this frame at bearing 6): the ogee profile (toe at y -4, crest
 *   19.8 m at y 22-24); the piers at x -79.5, -61, -43, -24.5, -6, 12.5, 30.5, 48.5,
 *   66.5 (18.4 m apart, 3.5 m thick); their downstream noses (0 at y -1 to 23.5 m at
 *   y 9), trunnion platforms at 23.5 m, deck 29.7 m, gantry 30.7-31.3 m, crane
 *   units to 33 m; the gated bays' faces (toe at y 0-2 to the sill 12.8 m at y 12)
 *   and gate tops 20.3 m; the powerhouse block (x 82-111, y -15 to 1.7, 26.0 m),
 *   its tailrace deck 2.5 m, intake deck 20 m, intake gantry 28-32.8 m; the east
 *   crest 27.3 m (y 15-27).
 * - Map terrain: Mapterhorn z15 (tools/terrain.ts grid, bearing 3.4, 5 m).
 * - Published (Wikipedia, "Tom Miller Dam"; HAER TX-127): 1940, flood control and
 *   hydroelectric power, on the site of the two Austin Dams.
 * Photos (evidence):
 * - Larry D. Moore, "Tom miller dam austin 2014.jpg", CC BY 4.0 (from downstream,
 *   south-west: the ogee, the nine gates and piers, the gantry, the powerhouse):
 *   https://commons.wikimedia.org/wiki/File:Tom_miller_dam_austin_2014.jpg
 * - Peter Potrowl, "Austin - Tom Miller Dam - 1.jpg" to "- 6.jpg", CC BY-SA 4.0
 *   (upstream from the east bank: piers, deck and gantry along the lake; the
 *   powerhouse from downstream with its windows, the last gate bay):
 *   https://commons.wikimedia.org/wiki/File:Austin_-_Tom_Miller_Dam_-_1.jpg
 *   https://commons.wikimedia.org/wiki/File:Austin_-_Tom_Miller_Dam_-_3.jpg
 *   https://commons.wikimedia.org/wiki/File:Austin_-_Tom_Miller_Dam_-_6.jpg
 *
 * Numbers
 * - Gate skin radius 10.1 m about the trunnion (y 7, z 19) (estimated: tainter gates, top 20.3 m
 *   lidar, sill 12.8 m lidar); gate arms as a green frame (photo).
 * - Pier posts and the deck 6 m wide (lidar); the gantry as two steel bands 1.5 m
 *   deep on the deck edges (photo), two crane units (lidar 33 m).
 * - Powerhouse windows: six, 2.6 x 9 m, z 13-22 (photo-scaled from the 29 m face).
 * - Colours: concrete #ddd6c8 (sunlit in the 2014 photo); gates green #7e9c89
 *   (painted steel, pulled light); gantry #a7aaac; windows `window`.
 * - Night: the powerhouse windows (`window`).
 *
 * Doubts
 * - The west end of the ogee and the east crest are drawn plain (no close photo).
 * - The gate arms' layout is simplified to a frame between the piers.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { face } from './bridge-kit'
import { earclip } from './atx-pfluger-pedestrian-bridge'

type P2 = [number, number]
const CONCRETE: MaterialSpec = finish('dam-concrete', 0xddd6c8)
const GATE: MaterialSpec = finish('gate-green', 0x7e9c89)
const STEEL: MaterialSpec = finish('gantry-steel', 0xa7aaac)
const WIN: MaterialSpec = PALETTE.window

/** A prism along x from x0 to x1 over a simple (y, z) profile (any winding). */
function prismX(p: Part, prof: P2[], x0: number, x1: number, caps: [boolean, boolean] = [true, true]) {
  let a = 0
  for (let i = 0; i < prof.length; i++) a += prof[i][0] * prof[(i + 1) % prof.length][1] - prof[(i + 1) % prof.length][0] * prof[i][1]
  const r = a < 0 ? [...prof].reverse() : prof // CCW in (y, z)
  for (let i = 0; i < r.length; i++) {
    const [y0, z0] = r[i], [y1, z1] = r[(i + 1) % r.length]
    const l = Math.hypot(y1 - y0, z1 - z0) || 1
    face(p, [x0, y0, z0], [x0, y1, z1], [x1, y1, z1], [x1, y0, z0], [0, (z1 - z0) / l, -(y1 - y0) / l])
  }
  for (const [x, n, on] of [[x0, -1, caps[0]], [x1, 1, caps[1]]] as [number, number, boolean][]) {
    if (!on) continue
    const N: V3 = [n, 0, 0]
    for (const [i, j, k] of earclip(r)) p.tri([x, r[i][0], r[i][1]], [x, r[j][0], r[j][1]], [x, r[k][0], r[k][1]], undefined, undefined, undefined, [N, N, N])
  }
}
/** A box. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = false) {
  prismX(p, [[y0, z0], [y1, z0], [y1, z1], [y0, z1]], x0, x1)
  if (!bottom) return
}

// ---- Plan along the axis (lidar) -------------------------------------------------
const X_W = -216, X_OGEE_E = -81.3 // the ogee spillway
const PIERS = [-79.5, -61, -43, -24.5, -6, 12.5, 30.5, 48.5, 66.5]
const PIER_T = 3.5
const X_PH0 = 82, X_PH1 = 111 // the powerhouse
const X_E = 203 // the east end of the crest
const DECK = 29.7, LAKE_UP = 26 // deck top; the upstream face's line (y)

// ---- The ogee spillway ------------------------------------------------------------
// downstream face, toe to crest (lidar at bearing 6), then the crest and the upstream face
const OGEE: P2[] = [[-6, 0], [-4, 0.6], [0, 1.9], [2, 3.1], [4, 4.6], [6, 6.8], [8, 8.8], [10, 11.1], [12, 13.4], [14, 15.4], [16, 17.3], [18, 18.7], [20, 19.5], [22, 19.8], [25, 19.8], [25, 0]]
// a gated bay: apron and face up to the sill, the sill under the gate, then the deck's foot
const BAY: P2[] = [[-2, 0], [0, 1.2], [2, 3.4], [4, 5.6], [6, 7.8], [8, 10], [10, 11.8], [12, 13.1], [15, 13.1], [15, 0]]
// a pier: the downstream nose sweeping up to the trunnion platform, the post and deck, the upstream nose
const PIER: P2[] = [[-1.5, 0], [0, 2], [2, 7.5], [4, 12.3], [6, 17.2], [8, 21.9], [9.5, 23.5], [17, 23.5], [17, DECK - 1], [24, DECK - 1], [24, 0]]

function dam(c: Part, g: Part, s: Part, w: Part, detail: boolean) {
  // ogee, west bank to the first pier; its west end runs into the bank
  // (its west 55 m stand on a rock ledge the tailwater doesn't cover: the toe there is 0.8 m higher; lidar)
  const LEDGE = OGEE.map(([y, z], i) => [y, i === 0 || i === OGEE.length - 1 ? z : z + Math.max(0, 0.9 * (1 - z / 6))] as P2)
  prismX(c, [[-2, 0], [-2, 1.9], ...LEDGE.slice(3)], X_W, -160, [true, false])
  prismX(c, OGEE, -160, X_OGEE_E, [false, true])
  // gated bays between the piers, and the last bay to the powerhouse
  const edges = [...PIERS, X_PH0 - PIER_T / 2 + 0.01]
  for (let i = 0; i + 1 < edges.length; i++) {
    const a = edges[i] + PIER_T / 2, b = edges[i + 1] - PIER_T / 2
    prismX(c, BAY, a, b, [false, false])
    // the tainter gate: a curved skin from the sill up to 20.3 m, centred on the trunnion (y 7, z 19)
    const T: P2 = [7, 19], R = Math.hypot(15 - 7, 13.1 - 19), segs = detail ? 6 : 3
    const a0 = Math.atan2(13.1 - T[1], 15 - T[0]), a1 = Math.asin((20.3 - T[1]) / R)
    const skin: P2[] = []
    for (let k = 0; k <= segs; k++) { const t = a0 + ((a1 - a0) * k) / segs; skin.push([T[0] + R * Math.cos(t), T[1] + R * Math.sin(t)]) }
    const prof: P2[] = [...skin, ...[...skin].reverse().map(([y, z]) => [y + 0.5, z] as P2)]
    prismX(g, prof, a + 0.1, b - 0.1, [false, false])
    // the arms: a frame from the skin's back down to the trunnions on the piers
    for (const x of [a + 0.6, b - 1.2]) prismX(g, [[T[0], T[1] - 0.4], [skin[0][0], skin[0][1]], [skin[segs][0], skin[segs][1]], [T[0], T[1] + 0.4]], x, x + 0.6)
    prismX(g, [[T[0] + 3, 19.2], [T[0] + 7.8, 17.2], [T[0] + 7.8, 18.4], [T[0] + 3, 20.2]], a + 0.6, b - 0.6, [false, false])
  }
  // piers, and the deck along their tops from the ogee to the powerhouse
  for (const x of PIERS) prismX(c, PIER, x - PIER_T / 2, x + PIER_T / 2)
  prismX(c, [[17, DECK - 1], [24, DECK - 1], [24, DECK], [17, DECK]], PIERS[0] - PIER_T / 2, X_PH0)
  // the gantry: steel bands on the deck's edges, and two crane units
  for (const [y0, y1] of [[17.3, 17.9], [23.1, 23.7]]) prismX(s, [[y0, DECK], [y1, DECK], [y1, DECK + 1.5], [y0, DECK + 1.5]], PIERS[0] - PIER_T / 2, X_PH1 - 6)
  for (const x of [-24.5, 70]) box(s, x - 3, x + 3, 17, 24, DECK + 1.5, DECK + 3.3)
  // ---- the powerhouse: the block, the tailrace deck, the intake deck and its gantry
  prismX(c, [[-15, 0], [1.7, 0], [1.7, 26], [-15, 26]], X_PH0 - PIER_T / 2, X_PH1)
  prismX(c, [[-22, 0], [-15, 0], [-15, 2.5], [-22, 2.5]], X_PH0 + 1, X_PH0 + 18)
  prismX(c, [[1.7, 0], [17, 0], [17, 20], [1.7, 20]], X_PH0 - PIER_T / 2, X_PH1)
  prismX(c, [[15, 20], [17, 20], [17, DECK - 1], [24, DECK - 1], [24, DECK], [15, DECK]], X_PH0, X_PH1 - 6)
  prismX(c, [[24, 0], [26, 0], [26, 22], [24, 22]], X_PH0, X_PH1)
  // six tall glass-block windows on the downstream face, a door-height band below
  for (let k = 0; k < 6; k++) {
    const x0 = X_PH0 + 2.4 + k * 4.2
    face(w, [x0, -15.05, 13], [x0 + 2.6, -15.05, 13], [x0 + 2.6, -15.05, 22], [x0, -15.05, 22], [0, -1, 0])
  }
  // ---- the non-overflow crest from the powerhouse to the east bank
  prismX(c, [[14, 0], [27, 0], [27, 27.3], [14, 27.3]], X_PH1, X_E)
}

function build(detail: boolean) {
  const c = new Part(), g = new Part(), s = new Part(), w = new Part()
  dam(c, g, s, w, detail)
  return [{ part: c, material: CONCRETE }, { part: g, material: GATE }, { part: s, material: STEEL }, { part: w, material: WIN }]
}

if (import.meta.main) {
  const list = build(false)
  const tris = list.reduce((n, p) => n + p.part.triangles, 0)
  const glb = writeGlb('Tom Miller Dam', list, { license: 'CC0-1.0', bearing: 6, elevation: 0 })
  console.log(`atx-tom-miller-dam.glb: ${tris} triangles, ${glb.length} bytes; ` + list.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
  if (tris > 5000 || glb.length > 250 * 1024) throw new Error('over budget')
  await Bun.write(new URL('../models/atx-tom-miller-dam.glb', import.meta.url), glb)
}
