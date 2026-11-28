/**
 * Scotiabank Arena (Air Canada Centre), Toronto (1999, Brisbin Brook
 * Beynon with HOK Sport), built into the 1941 Toronto Postal Delivery
 * Building (Charles B. Dolphin) — original procedural geometry, CC0-1.0.
 * bun generators/tor-scotiabank-arena.ts
 *
 * Frame: x east-north-east +, y north-north-west +, z up, metres; origin
 * at the anchor on the ground. Bearing 343.3 (the Toronto street grid;
 * Bay Street front runs true in it). Anchor = area centroid of the OSM
 * outline way/19882585 ("Scotiabank Arena"): -79.379168, 43.6434626.
 *
 * What it covers (all inside way/19882585): the arena and its curved roof
 * (part way/1104128156), the retained Postal Delivery Building's limestone
 * range along Bay Street and Lake Shore Boulevard (way/1104128153) and the
 * strip behind it (way/1104128155), the glass concourse on the west plaza
 * front (way/1104128157) and its canopy (way/1104128152), the north range
 * (way/1104128154) and the low glass links on the north-west towards Union
 * Station (way/1104128158-1104128162). The 15-storey office tower in the
 * north-east notch (way/1104128150, parts 187583789, 1104128163) is a
 * separate building and is left to the map.
 *
 * Correction to the brief: the glass atrium is on the WEST front (the
 * Maple Leaf Square plaza), not the east (cn, se; OSM tags the west part
 * glass). The east (Bay Street) front is the old Postal Delivery Building.
 *
 * Identity (from the photos):
 *  1. A broad, low-curved arena roof, a shallow vault across the building
 *     from north to south, over a band of pale grey metal panels.    (cn)
 *  2. The west front: a tall glass concourse wall with the red
 *     "Scotiabank Arena" sign over it.                           (se, cn)
 *  3. The east and south fronts: the 1941 art deco limestone range of tall
 *     green-framed windows between pilasters, a green frieze along its
 *     top, and the rounded north-east corner with horizontal ribbon
 *     windows.                                                     (post)
 *
 * Heights (no lidar in Canada):
 *  - City of Toronto 3D Massing 2025 (https://open.toronto.ca/dataset/3d-massing/):
 *    the whole complex one 48.0 m block (site plan), read as an upper
 *    bound: the cn photo shows a shallow vault, crown 40.5 m over 34 m eaves.
 *  - estimated from post and se: the limestone range 16 m (its frieze; the
 *    rounded corner 18 m), the metal-panel band up to the roof's eaves at
 *    34 m, the west glass concourse 24.5 m with the sign above it.
 *  - OSM heights 12 (stone), 18 (north and south ranges) and 22 (roof)
 *    are below what the photos show for the stone and the roof; the 18 m
 *    ranges are used as tagged; the north-west glass links from their
 *    tagged levels at about 4 m each over the rail-side ground.
 *  - plan: OSM parts as listed above, turned into this frame; the roof is
 *    a vault over the quadrilateral of the roof part's four corners
 *    (the small bulge at its north-east is left out, and the north-east
 *    corner pulled 1.9 m south and the stone range's inner face 0.6 m
 *    east, clear of the office tower's part way/1104128163).
 *  - ground: Mapterhorn z15 is 0.6-1 m over most of the site, rising to
 *    the rail corridor on the north; elevation 0.
 *
 * Colours: buff limestone and its green frieze and window frames (post),
 * the pale grey metal panels and the light grey roof (cn, post), the red
 * sign (se).
 *
 * Night: the west glass concourse and the old building's windows glow;
 * the red sign is neon; the limestone range is floodlit (`_FLOODLIGHT`).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  se    "Scotiabank Arena - 2018 (cropped).jpg", Paperfire, CC BY-SA 4.0 —
 *        the west glass front and sign from the plaza.
 *        https://commons.wikimedia.org/wiki/File:Scotiabank_Arena_-_2018_(cropped).jpg
 *  cn    "Air Canada Centre from CN Tower.jpg", Balcer, public domain (2006) —
 *        the roof, the west front and the north side from above.
 *        https://commons.wikimedia.org/wiki/File:Air_Canada_Centre_from_CN_Tower.jpg
 *  post  "Postal terminal now Air Canada Centre.jpg", Andy Burgess, CC BY 2.0 —
 *        the Bay Street limestone range and the rounded corner.
 *        https://commons.wikimedia.org/wiki/File:Postal_terminal_now_Air_Canada_Centre.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the roof's crown and eaves heights (estimated); the Lake Shore
 * face of the limestone range is drawn like the Bay Street one (no close
 * photo); the reliefs over the doors are left out; the sign is a plain
 * red neon band, not lettering.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, capPoly, ccw, cornice, edgePanels, prism, save, wall, type XY } from './atl-flatiron-building'

const lime = new Part(), panel = new Part(), roof = new Part(), win = new Part(), neon = new Part(), green = new Part()

const STONE = 16, CORNER = 18, EAVE = 34, CROWN = 40.5, GLASS = 24.5

// ── The arena body and its vaulted roof ──
const SW: XY = [-38.84, -61.39], SE: XY = [68.45, -36.39], NE: XY = [68.36, 36.6], NW: XY = [-56.99, 30.42]
const body: XY[] = [SW, SE, NE, NW]
wall(panel, body, 0, EAVE)
const NU = 10, NV = 10
const P = (u: number, v: number): V3 => {
  const s: XY = [SW[0] + (SE[0] - SW[0]) * u, SW[1] + (SE[1] - SW[1]) * u]
  const n: XY = [NW[0] + (NE[0] - NW[0]) * u, NW[1] + (NE[1] - NW[1]) * u]
  return [s[0] + (n[0] - s[0]) * v, s[1] + (n[1] - s[1]) * v, EAVE + (CROWN - EAVE) * Math.sin(Math.PI * v)]
}
const nrm = (v: number): V3 => {
  // the vault's normal, from its slope across the span (about 92 m)
  const dz = (CROWN - EAVE) * Math.PI * Math.cos(Math.PI * v) / 92
  const l = Math.hypot(dz, 1)
  // across-span direction is about the frame's +y turned 11 degrees
  return [0.19 * (-dz) / l, 0.98 * (-dz) / l, 1 / l]
}
for (let i = 0; i < NU; i++) for (let j = 0; j < NV; j++) {
  const u0 = i / NU, u1 = (i + 1) / NU, v0 = j / NV, v1 = (j + 1) / NV
  roof.tri(P(u0, v0), P(u1, v0), P(u1, v1), undefined, undefined, undefined, [nrm(v0), nrm(v0), nrm(v1)])
  roof.tri(P(u0, v0), P(u1, v1), P(u0, v1), undefined, undefined, undefined, [nrm(v0), nrm(v1), nrm(v1)])
}
// The gable walls under the vault's two ends, in the panel finish.
for (const u of [0, 1]) {
  for (let j = 0; j < NV; j++) {
    const a = P(u, j / NV), b = P(u, (j + 1) / NV)
    const a0: V3 = [a[0], a[1], EAVE], b0: V3 = [b[0], b[1], EAVE]
    if (u === 0) panel.quad(b0, a0, a, b) // west end faces west
    else panel.quad(a0, b0, b, a)
  }
}
// A pale edge under the roof's eaves on the long sides.
for (const [a, b] of [[SW, SE], [NE, NW]] as [XY, XY][]) {
  const n: XY = [b[1] - a[1], a[0] - b[0]], l = Math.hypot(n[0], n[1]), o: XY = [n[0] / l * 0.5, n[1] / l * 0.5]
  panel.quad([a[0] + o[0], a[1] + o[1], EAVE - 1.2], [b[0] + o[0], b[1] + o[1], EAVE - 1.2], [b[0] + o[0], b[1] + o[1], EAVE], [a[0] + o[0], a[1] + o[1], EAVE])
}

// ── The 1941 Postal Delivery Building range along Bay Street and Lake Shore ──
const STONE_L: XY[] = ccw([[-2.04, -58.59], [0.16, -66.03], [73.68, -42.11], [73.07, 52.95], [68.95, 51.2], [68.95, 36.6], [68.45, -36.39], [68.64, -41.04], [42.95, -49.58]])
prism(lime, STONE_L, 0, STONE, roof, 0.35)
cornice(green, STONE_L, STONE - 0.9, 0.5, 0.2, null) // the green frieze
// The rounded north-east corner pavilion, a storey higher.
prism(lime, [[69.0, 26], [73.4, 26], [73.1, 50.5], [71.6, 52.4], [69.0, 51.3]], 0, CORNER, roof, 0.4)
// Bay Street face: tall windows between pilasters, then the corner's ribbon windows.
const BAY: [XY, XY] = [[73.68, -42.11], [73.4, 26]]
edgePanels(win, BAY[0], BAY[1], 1.0, 13.2, { group: 13, gap: 0, bay: 7.2, pier: 3.2, margin: 3, min: 5 })
for (const [z0, z1] of [[6.5, 9.0], [11.5, 14.0]]) edgePanels(win, [73.4, 26], [73.1, 50.5], z0, z1, { group: 9, gap: 0, bay: 30, pier: 0, margin: 3 })
// Lake Shore face.
edgePanels(win, [0.16, -66.03], [73.68, -42.11], 1.0, 13.2, { group: 13, gap: 0, bay: 7.2, pier: 3.2, margin: 3, min: 5 })
// The south range behind the stone, and the north range.
prism(panel, [[-38.84, -61.39], [-37.93, -65.97], [-6.39, -59.49], [-2.04, -58.59], [42.95, -49.58], [68.64, -41.04], [68.45, -36.39]], 0, 18, roof, 0.3)
prism(panel, ccw([[-56.99, 30.42], [-58.07, 35.89], [-58.24, 36.75], [-43.54, 39.99], [-43.14, 37.91], [17.61, 49.96], [17.74, 48.39], [27.31, 48.97], [29.3, 47.86]]), 0, 18, roof, 0.3)

// ── The west glass concourse, its canopy, and the sign ──
const WEST: XY[] = ccw([[-58.07, 35.89], [-61.38, 35.22], [-60.29, 29.44], [-61.87, 29.25], [-56.77, 5.65], [-59.3, 5.15], [-63.79, 4.23], [-65.4, -19.54],
  [-59.2, -49.45], [-58.55, -52.84], [-55.87, -65.24], [-41.47, -62.33], [-41.21, -64.07], [-40.71, -67.32], [-34.74, -66.24], [-34.63, -67.79],
  [-30.79, -67.08], [-6.05, -62.51], [-6.39, -59.49], [-37.93, -65.97], [-38.84, -61.39], [-56.99, 30.42]])
prism(win, WEST, 0, GLASS, roof, 0.3)
cornice(panel, WEST, GLASS - 1.0, 1.0, 0.35, null)
// The canopy along the west sidewalk (way/1104128152) on a few posts.
{
  const C: XY[] = ccw([[-59.71, 6.87], [-59.3, 5.15], [-63.79, 4.23], [-65.4, -19.54], [-59.2, -49.45], [-58.55, -52.84], [-55.87, -65.24], [-57.17, -67.07],
    [-59.99, -53.31], [-60.69, -49.92], [-66.87, -19.78], [-65.29, 5.62]])
  prism(panel, C, 5.0, 5.6, panel, 0.1, true)
  for (const [x, y] of [[-66.0, -8], [-65.8, -30], [-61.2, -52]] as XY[]) box(panel, x - 0.25, x + 0.25, y - 0.25, y + 0.25, 0, 5.0, null, 0)
}
// The red sign on the panel band over the concourse, centred on the west front.
{
  const mx = (SW[0] + NW[0]) / 2, my = (SW[1] + NW[1]) / 2
  const t: XY = [NW[0] - SW[0], NW[1] - SW[1]], L = Math.hypot(t[0], t[1]), d: XY = [t[0] / L, t[1] / L], o: XY = [-d[1] * 0.35, d[0] * 0.35]
  // o points out of the west face (left of SW→NW is outside for a CCW body ring)
  const a: XY = [mx - d[0] * 17 + o[0], my - d[1] * 17 + o[1]], b: XY = [mx + d[0] * 17 + o[0], my + d[1] * 17 + o[1]]
  neon.quad([b[0], b[1], 26.2], [a[0], a[1], 26.2], [a[0], a[1], 29.4], [b[0], b[1], 29.4])
}

// ── The low glass links to the north-west, toward Union Station ──
const LINKS: [XY[], number][] = [
  [[[-59.92, 37.45], [-61.38, 35.22], [-62.77, 33.11], [-63.68, 36.6]], 5],
  [[[-61.38, 35.22], [-60.29, 29.44], [-61.87, 29.25], [-56.77, 5.65], [-59.3, 5.15], [-59.71, 6.87], [-61.62, 15.79], [-64.22, 15.31], [-64.89, 19.93], [-62.56, 20.29], [-64.44, 30.19], [-62.77, 33.11]], 9],
  [[[-61.38, 35.22], [-59.92, 37.45], [-58.31, 40.1], [-49.0, 41.61], [-48.02, 42.9], [-46.98, 40.35], [-10.68, 52.69], [-16.84, 71.06], [-20.32, 69.96], [-21.32, 72.28], [10.4, 71.71], [15.88, 72.09], [17.61, 49.96], [-43.14, 37.91], [-43.54, 39.99], [-58.24, 36.75], [-58.07, 35.89]], 12],
  [[[-53.23, 71.95], [-50.57, 60.4], [-20.32, 69.96], [-21.32, 72.28]], 15],
  [[[-52.91, 57.04], [-53.63, 59.29], [-50.57, 60.4], [-20.32, 69.96], [-16.84, 71.06], [-10.68, 52.69], [-46.98, 40.35], [-48.02, 42.9], [-50.5, 49.97]], 19],
]
for (const [ring, h] of LINKS) {
  const r = ccw(ring)
  prism(panel, r, 0, h, roof, 0.3)
  for (let i = 0; i < r.length; i++) edgePanels(win, r[i], r[(i + 1) % r.length], h - 4.2, h - 1.0, { group: 4, gap: 0, bay: 9, pier: 1.2, margin: 1.2, min: 6 })
}
void capPoly

const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.1 : p[2] < STONE + 2.5 ? 0.75 : 0.2)
await save('tor-scotiabank-arena', 'Scotiabank Arena', [
  { part: lime, material: { ...finish('postal-limestone', 0xe3d6bd), floodlight: lit } },
  { part: panel, material: finish('arena-panel', 0xd5d8da) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: neon, material: finish('neon-scotiabank-red', 0xd2333b) },
  { part: green, material: PALETTE.patina },
], { anchor: [43.6434626, -79.379168], bearing: 343.3 }, 6500)
