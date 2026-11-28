/**
 * Deutsche Bank twin towers (Deutsche-Bank-Hochhaus), Frankfurt am Main:
 * procedural, CC0-1.0.
 * bun generators/frankfurt-deutsche-bank.ts
 *
 * ABB Architekten (Hanig, Scheid, Schmidt), 1979-1984, renovated 2007-2010
 * (Mario Bellini): two identical 155 m towers in mirrored blue glass, set
 * point-symmetrically 13 m apart about the site's centre, on a four-storey
 * base whose three arms reach east, south-west and north-west. Every plan
 * is drawn with 45° angles: each tower is two bars at right angles with
 * chamfered, sawtoothed corners.
 *
 * Identity, in order: the two equal mirrored slabs side by side, turned
 * against each other; their faceted 45° corners and the sawtooth chamfer
 * where the two bars of each tower meet; the flat tops; the pale glass grid;
 * the white-framed logo near the top; the low glazed base with its sloped
 * glass rim.
 *
 * Map frame: built turned, bearing 348: local +y faces bearing 348, local
 * +x bearing 78, so the towers' long sides run along the axes. Origin: the
 * area centroid of OSM way/174461753 (50.113866, 8.668243). y = 0 is the
 * lowest ground under the footprint.
 *
 * Evidence:
 * - p1 https://commons.wikimedia.org/wiki/File:Deutsche_Bank_Taunusanlage.jpg
 *   Thomas Wolf (www.foto-tw.de), CC BY-SA 3.0 de: from the Taunusanlage
 *   (south-west), both towers full height, colour, logo.
 * - p2 https://commons.wikimedia.org/wiki/File:Deutsche_Bank_tower_Frankfurt_am_Main_2019-09-15_03.jpg
 *   Leonhard Lenz, CC0: the faceted top of one tower, the logo.
 * - p3 https://commons.wikimedia.org/wiki/File:Deutsche_Bank_tower_Frankfurt_am_Main_2019-09-15_01.jpg
 *   Leonhard Lenz, CC0; p4 ..._04.jpg, the same set: the towers overlapping.
 * - p5 https://commons.wikimedia.org/wiki/File:Deutsche_Bank_Twin_Towers_-_panoramio.jpg
 *   pyraniton, CC BY 3.0: from the Main Tower (south-east), from above:
 *   the plans, the flat tops and the base's sloped glass roofs.
 * - p6 https://commons.wikimedia.org/wiki/File:TaunusAnlage_Park_%26_Deutsche_Bank_Twin_Towers.jpg
 *   Edison McCullen, CC BY-SA 4.0.
 * - OSM (API, 2026-11): the base way/174461753 (height 22, also the
 *   building outline), the towers 174461751 (A, west) and 174461752 (B,
 *   east), both 155 m, 40 levels. The plans here are their nodes, turned.
 * - Published: 155 m, 40 and 38 storeys, four-storey base, 45° plans,
 *   towers 13 m apart (de.wikipedia "Deutsche-Bank-Hochhaus").
 * - No lidar (none in Germany). Look-only: "Frankfurt Am Main-Deutsche Bank
 *   IBCF von Suedwesten-20120315.jpg" (Mylius, GFDL only), looked at only.
 *
 * Numbers: tower heights published and OSM (155). The base's walls 7 m
 * and its sloped glass rim to 11 m, 3 m deep: estimated from p5, where the
 * base stays well below the trees (OSM's 22 m is left out; lead review). Floor lines every three storeys (3.85 m storeys from 155 m over 40;
 * estimated). The logo 6.5 m square, its centre 12 m below the top (p1, p2:
 * about a tenth of the face's width).
 * Colours: the mirror glass a dark blue-grey #4d6079 (p1, p5: deep
 * blue-black mirror glass, kept just above the charcoal floor; lead
 * review); the grid lines a muted grey-blue #9aabbd; the base's walls the
 * same glass, its sloped rim #a4c4d9 (`glass`, p5); the roofs grey.
 *
 * Night: the towers are offices: `window` (lit). The base's sloped glass
 * is `glass` (dark at night).
 *
 * Doubts: OSM's tower plans are coarse and the photos show the faces only
 * obliquely, so the facets follow OSM as drawn, including its small
 * sawtooth steps. The east tower (38 storeys) is drawn at the same 155 m,
 * as published and in OSM.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, capRing, face, saveLods, ccw, type XY, type Layer } from './frankfurt-commerzbank-tower'
import { inset } from './chi-aon-center'

const ID = 'frankfurt-deutsche-bank'
const TOP = 155
const STOREY = TOP / 40

const A: XY[] = [[-11.9, -28.7], [-4.2, -21.1], [-4.3, -0.1], [-6.5, 2.1], [-6.6, 3.2], [-10.4, 7.0], [-11.4, 7.0], [-13.6, 9.3], [-42.2, 9.3], [-46.6, 4.8], [-49.7, 5.5], [-52.1, 3.2], [-52.1, -8.7], [-49.9, -11.0], [-36.4, -11.1], [-35.1, -12.2], [-29.3, -13.0], [-29.3, -14.2], [-30.0, -14.1], [-32.5, -16.6], [-32.6, -17.6], [-28.7, -21.4], [-27.9, -21.3], [-25.4, -18.8], [-25.4, -18.2], [-22.6, -18.0]]
// Tower B is A turned half a turn about the site's centre (point symmetry,
// published); OSM's B agrees within about a metre.
const CEN: XY = [-0.8, 5.3]
const B: XY[] = A.map(([x, y]) => [2 * CEN[0] - x, 2 * CEN[1] - y] as XY)
const BASE: XY[] = [[2.7, 27.1], [-4.5, 26.9], [-27.1, 49.3], [-52.7, 49.0], [-52.7, 19.2], [-49.7, 16.3], [-49.7, 5.5], [-52.1, 3.2], [-52.1, -8.7], [-49.9, -11.0], [-36.4, -11.1], [-22.7, -21.3], [-37.5, -35.7], [-37.2, -61.3], [-11.7, -61.3], [9.4, -40.1], [9.6, -18.8], [15.6, -12.4], [25.4, -12.6], [29.9, -16.4], [55.6, -16.4], [80.9, 9.2], [62.8, 27.1], [39.8, 26.9], [31.3, 18.4], [21.1, 28.6], [10.4, 39.2], [2.7, 31.6]]

const glassWall = new Part(), grid = new Part(), roof = new Part(), rim = new Part(), logo = new Part(), logoDark = new Part()

function tower(plan: XY[], logoEdges: number[]) {
  const r = ccw(plan)
  prism(glassWall, r, 0, TOP - 0.6, { top: null })
  // a pale coping, bevelled, and the flat roof
  const top = inset(r, 0.5)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    grid.quad([r[i][0], r[i][1], TOP - 0.6], [r[j][0], r[j][1], TOP - 0.6], [top[j][0], top[j][1], TOP], [top[i][0], top[i][1], TOP])
  }
  capRing(roof, top, TOP)
  // floor lines every three storeys, and a pale strip down every corner
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [u[1], -u[0], 0]
    const P = (s: number, z: number, o = 0.05): V3 => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o, z]
    for (let z = 3 * STOREY + 4.5; z < TOP - 4; z += 3 * STOREY) face(grid, [P(0, z - 0.22), P(L, z - 0.22), P(L, z + 0.22), P(0, z + 0.22)], n)
    if (L > 2.5) for (const s of [0, L - 0.35]) face(grid, [P(s, 17), P(s + 0.35, 17), P(s + 0.35, TOP - 0.6), P(s, TOP - 0.6)], n)
    // the lobby glazing above the base's roof is the tower's own wall
    if (logoEdges.includes(i)) {
      const zc = TOP - 12, sc = L * 0.78, h = 3.25
      const o = 0.09
      face(logo, [P(sc - h, zc - h, o), P(sc + h, zc - h, o), P(sc + h, zc + h, o), P(sc - h, zc + h, o)], n)
      const q = h - 0.55
      face(logoDark, [P(sc - q, zc - q, o + 0.03), P(sc + q, zc - q, o + 0.03), P(sc + q, zc + q, o + 0.03), P(sc - q, zc + q, o + 0.03)], n)
      // the slash: a white bar from lower left to upper right
      const w = 0.55
      face(logo, [P(sc - q + 0.6, zc - q + 0.6 - w, o + 0.06), P(sc - q + 0.6 + w, zc - q + 0.6 - w, o + 0.06), P(sc + q - 0.6 + w, zc + q - 0.6, o + 0.06), P(sc + q - 0.6, zc + q - 0.6, o + 0.06)], n)
    }
  }
}
// logo faces: the long north and west faces of A, and the matching faces of B
const longest = (r: XY[]) => r.map((a, i) => { const b = r[(i + 1) % r.length]; return [Math.hypot(b[0] - a[0], b[1] - a[1]), i] }).sort((p, q) => q[0] - p[0]).slice(0, 2).map((p) => p[1])
tower(A, longest(ccw(A)))
tower(B, longest(ccw(B)))

// ── the base: glass walls to 7 m, a sloped glass rim to 11 m, flat roof ──
{
  const r = ccw(BASE)
  const WALL = 7, RIM = 11, IN = 3
  prism(glassWall, r, 0, WALL, { top: null })
  const ins = inset(r, IN)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    rim.quad([r[i][0], r[i][1], WALL], [r[j][0], r[j][1], WALL], [ins[j][0], ins[j][1], RIM], [ins[i][0], ins[i][1], RIM])
    // a pale gutter line at the rim's foot
    grid.quad([r[i][0], r[i][1], WALL - 0.5], [r[j][0], r[j][1], WALL - 0.5], [r[j][0], r[j][1], WALL], [r[i][0], r[i][1], WALL])
  }
  capRing(roof, ins, RIM)
}

const parts: Layer[] = [
  { part: glassWall, material: { ...PALETTE.window, color: 0x4d6079 } },
  { part: grid, material: finish('db-grid', 0x9aabbd) },
  { part: roof, material: PALETTE.roof },
  { part: rim, material: PALETTE.glass },
  { part: logo, material: finish('db-logo-white', 0xf4f6f8) },
  { part: logoDark, material: finish('db-logo-blue', 0x3f5f8f) },
]
await saveLods(ID, 'Deutsche Bank Twin Towers', parts, null, { anchor: [50.113866, 8.668243], bearing: 348, elevation: 0, height: TOP })
