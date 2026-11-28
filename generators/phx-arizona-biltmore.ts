/**
 * Arizona Biltmore, Phoenix (1929, Albert Chase McArthur with Frank Lloyd
 * Wright as consultant; "Biltmore block" textile-block walls, copper roofs).
 * Procedural, CC0-1.0, no textures.
 *   bun generators/phx-arizona-biltmore.ts
 *
 * Map frame: x along the main guest wing (bearing 112 deg, ESE), y across it
 * (bearing 22 deg), z up, metres; the model is placed at bearing 22. Anchor
 * -112.0233287, 33.5235984, the centroid of OSM way/921096611 ("Arizona
 * Biltmore"), which is the one building drawn here: OSM maps the 1929 main
 * building, the lobby, the ballroom and conference wings that join it and the
 * entrance pavilion as one C-shaped outline round the lawn courtyard. The
 * outline is drawn whole (a ref only hides the whole outline), so the newer
 * conference wings at the west end are drawn as plain low block masses.
 * replaces: way/921096611 only. The cottages, the Paradise and Valley wings
 * (way/921096612-614, 921100028-031) and the other buildings round it stand
 * apart and are left to the map.
 *
 * Identity (photos below):
 *  1. The patterned "Biltmore block" walls: tan-grey cast blocks, deep
 *     relief panels; drawn as one warm tan with punched windows. (c4, c14, c19)
 *  2. The tower at the west end of the main wing: slender, fluted, its top
 *     stepping in, a lamp globe on top.                       (c14, c19, j20)
 *  3. The main guest wing: four storeys under a copper hip skirt with a
 *     deep overhang, weathered grey-green, flat on top.      (j20, c14, NAIP)
 *  4. The entrance pavilion: a steep copper pyramid on an octagon with a tall
 *     thin spire, and the flat porte-cochère canopy in front.     (c19, j20)
 *
 * Plan: the OSM outline in this frame. Heights: USGS 3DEP lidar
 * AZ_MaricopaPinal_1_2020 (flown 2020), 1 m grid, read in this frame; the
 * lowest ground (south side) is lidar 2.0 = z 0, the north side about z 3.
 * Measured (z): the low wings and lobby 6.5-8 (drawn 7); the main wing's eaves
 * about 12 and its flat top 13.5-14 (NAIP: a pale flat roof inside a
 * grey-green copper hip skirt), x -8..90, y -17..5; the tower 20 at
 * about x -15..-7, y 1..10 (its 1 m lidar peak; drawn 21.5 to the top step, with
 * the globe to 23.6, as c19 shows it well above the wing); a 4-storey block
 * south of it (lidar 14, x -17..-3, y -10..1) with the broad hip roof of c14; the higher conference block x -85..-55, y 5..30 at 10.5;
 * the entrance octagon's eaves about 6.5, centred (17, -40), radius 11 from
 * the outline's rounded corner; the porte-cochère 4-5.
 * Estimated: the pyramid's apex (13) and the spire's height (25, about as
 * tall again as the pyramid in c19); the tower's steps; the windows (rows
 * from c4/c14 scaled to the lidar eaves); the overhangs (1.5 m).
 *
 * Photos (EVIDENCE, Wikimedia Commons; w_lemay, CC BY-SA 2.0, titled
 * "Arizona Biltmore Hotel, Missouri Ave, Biltmore Area, Phoenix, AZ - <n>"):
 *  c14  n = 54437952669 (the tower and the hip-roofed wing, close)
 *  c19  n = 54437952704 (the entrance: spire pavilion, canopy, tower)
 *  c4   n = 54436901437 (the tower over the front lawn)
 *  j20  "Phoenix-Arizona Biltmore Hotel-1929.JPG", Tony the Marine
 *       (Marine 69-71), CC BY-SA 3.0,
 *       https://commons.wikimedia.org/wiki/File:Phoenix-Arizona_Biltmore_Hotel-1929.JPG
 *       (the main wing with its balconies and copper roof, the tower, the spire)
 *  USGS NAIP orthophoto: the plan, pale flat roofs, the grey-green wing roof.
 * No look-only sources. No commercial imagery.
 * Doubts: the conference wings are drawn plain from lidar (no close photo
 * used); some patios inside the outline are drawn as roof at the low wings'
 * height; the wing's balconies and the block relief are left out; the
 * tower's footprint is small for the 1 m lidar, so its height may read low.
 *
 * Night: windows glow; the tower and the entrance pavilion are floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, capPoly, ccw, cornice, edgePanels, prism, save, wall, at, circle, type XY } from './atl-flatiron-building'
import { hipRoof, revolve } from './atl-tech-tower'

const ANCHOR = { lng: -112.0233287, lat: 33.5235984 }, BEARING = 22
const block = new Part(), copper = new Part(), win = new Part(), flat = new Part(), door = new Part()

const OUTLINE: XY[] = ccw([[26.92, 64.78], [16.42, 41.50], [16.78, 39.30], [-3.44, 24.77], [-5.91, 28.18], [-20.20, 26.83], [-20.34, 28.36], [-22.45, 28.16], [-22.83, 32.29], [-35.97, 31.06], [-36.20, 33.63], [-51.37, 32.21], [-51.81, 37.14], [-54.13, 36.92], [-53.97, 34.97], [-56.75, 34.72], [-58.19, 51.04], [-101.58, 47.01], [-99.04, 18.45], [-89.01, 19.38], [-87.76, 5.36], [-86.92, 5.44], [-86.69, 2.88], [-96.19, 1.99], [-95.68, -3.75], [-104.43, -4.57], [-104.13, -8.00], [-104.77, -8.05], [-104.44, -11.82], [-104.89, -11.87], [-104.51, -16.08], [-108.02, -16.41], [-106.75, -30.59], [-102.91, -30.23], [-102.19, -38.25], [-101.58, -38.19], [-101.32, -41.09], [-100.46, -41.02], [-100.22, -43.70], [-94.85, -43.21], [-95.07, -40.63], [-94.03, -40.53], [-93.60, -45.55], [-86.07, -44.87], [-85.73, -48.86], [-81.92, -48.51], [-81.70, -51.05], [-58.00, -48.94], [-57.53, -54.46], [-48.56, -53.66], [-49.00, -48.48], [-29.30, -46.74], [-29.88, -39.87], [-25.32, -39.47], [-25.60, -36.12], [6.68, -33.27], [7.76, -35.12], [4.90, -39.52], [5.11, -44.86], [8.62, -49.40], [14.94, -51.11], [25.14, -50.13], [26.05, -59.27], [26.58, -65.78], [34.67, -65.01], [34.14, -58.64], [33.16, -48.58], [31.58, -48.73], [30.37, -35.58], [35.25, -26.82], [40.07, -26.37], [39.92, -24.62], [56.43, -23.10], [58.20, -43.15], [67.54, -42.29], [67.97, -47.19], [86.96, -45.43], [86.88, -44.62], [95.23, -43.80], [94.54, -36.53], [104.05, -35.59], [102.45, -18.78], [100.69, -18.95], [99.69, -8.56], [100.47, -8.48], [100.09, -4.57], [98.91, -4.69], [97.92, 5.28], [99.71, 5.47], [99.20, 10.57], [103.42, 19.69], [107.46, 17.87], [110.99, 25.52], [107.17, 27.25], [112.27, 38.30], [105.30, 41.47], [105.74, 42.42], [112.16, 39.51], [137.07, 56.92], [135.15, 59.60], [112.31, 43.49], [107.42, 46.19], [125.80, 58.90], [122.38, 63.82], [118.79, 61.34], [118.06, 62.38], [105.87, 53.91], [91.60, 74.33], [103.91, 82.86], [103.42, 83.56], [107.10, 86.14], [103.03, 91.90], [90.90, 83.40], [88.87, 86.28], [72.43, 74.73], [90.19, 49.63], [74.14, 14.27], [42.47, 11.52], [21.55, 41.62], [31.15, 62.91]])

const LOW = 7
const winOpts = { group: 3.4, gap: 1.6, bay: 4.2, pier: 1.8, margin: 1.5, min: 5 }

// ── The low wings: the whole outline at the lobby's height, a parapet lip ──
prism(block, OUTLINE, 0, LOW, flat, 0.25)
for (let i = 0; i < OUTLINE.length; i++) edgePanels(win, OUTLINE[i], OUTLINE[(i + 1) % OUTLINE.length], 0.6, LOW - 0.6, winOpts)

// a rectangular mass with its own windows (counter-clockwise ring)
function mass(x0: number, x1: number, y0: number, y1: number, z1: number, roofPart: Part | null, z0 = LOW - 0.3) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  prism(block, r, z0, z1, roofPart, 0.25)
  for (let i = 0; i < 4; i++) edgePanels(win, r[i], r[(i + 1) % 4], LOW + 0.6, z1 - 0.7, { ...winOpts, group: 3 })
}

// ── The higher conference block (plain) ──
mass(-85, -55, 5, 30, 10.5, flat)

// ── The main guest wing: four storeys, copper hip roof with a deep overhang ──
{
  const x0 = -8, x1 = 90, y0 = -17, y1 = 5, EAVE = 12
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  prism(block, r, 0, EAVE, null, 0)
  for (let i = 0; i < 4; i++) edgePanels(win, r[i], r[(i + 1) % 4], LOW + 0.6, EAVE - 0.8, { group: 2.6, gap: 0.9, bay: 3.6, pier: 1.4, margin: 2, min: 5 })
  cornice(block, r, EAVE - 0.6, 0.6, 0.3, null)
  // the roof (NAIP): a pale flat top inside a copper hip skirt with a deep
  // overhang; eaves 1.5 m out at z 12, the skirt rising to 13.9
  const o = 1.5, ZR = 13.9, inset = 5
  const outer: XY[] = [[x0 - o, y0 - o], [x1 + o, y0 - o], [x1 + o, y1 + o], [x0 - o, y1 + o]]
  const inner: XY[] = [[x0 - o + inset, y0 - o + inset], [x1 + o - inset, y0 - o + inset], [x1 + o - inset, y1 + o - inset], [x0 - o + inset, y1 + o - inset]]
  copper.loft([at(outer, EAVE), at(inner, ZR)])
  capPoly(flat, inner, ZR, true)
  const t = 0.35
  copper.loft([at(outer, EAVE - t), at(outer, EAVE)])
  capPoly(copper, outer, EAVE - t, false)
}

// ── The tower: fluted shaft at the wing's west end, stepping in at the top ──
{
  const x0 = -15.5, x1 = -7, y0 = 1, y1 = 10
  box(block, x0, x1, y0, y1, 0, 18.6, block, 0.2)
  box(block, x0 + 0.9, x1 - 0.9, y0 + 0.9, y1 - 0.9, 18.6, 20.2, block, 0.2)
  box(block, x0 + 2, x1 - 2, y0 + 2, y1 - 2, 20.2, 21.5, block, 0.2)
  // flutes: three ribs on each long face running up into the steps
  for (const s of [-1, 1]) for (const k of [-1.6, 0, 1.6]) {
    const y = s > 0 ? y1 : y0, xm = (x0 + x1) / 2 + k
    box(block, xm - 0.4, xm + 0.4, s > 0 ? y : y - 0.4, s > 0 ? y + 0.4 : y, 9, 19.8 - Math.abs(k) * 0.5, block, 0.12)
  }
  // a tall slot window on the south and east faces
  edgePanels(win, [x0, y0], [x1, y0], 14, 18, { group: 3.5, gap: 0, bay: 1.2, pier: 0, margin: 2.9, min: 1 })
  edgePanels(win, [x1, y0], [x1, y1], 14, 18, { group: 3.5, gap: 0, bay: 1.2, pier: 0, margin: 3.4, min: 1 })
  // the lamp globe
  revolve(copper, [(x0 + x1) / 2, (y0 + y1) / 2], [[0, 21.5], [0.8, 21.8], [1, 22.6], [0.8, 23.3], [0, 23.6]], 8, 0, false, false)
}

// ── The hip-roofed block beside the tower (c14, c19): four storeys, a broad
// copper hip with a deep overhang ──
{
  const x0 = -17, x1 = -3, y0 = -10, y1 = 1, EAVE = 11.5
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  prism(block, r, 0, EAVE, null, 0)
  for (let i = 0; i < 4; i++) edgePanels(win, r[i], r[(i + 1) % 4], LOW + 0.6, EAVE - 0.8, { group: 2.6, gap: 0.9, bay: 3.4, pier: 1.4, margin: 1.5, min: 5 })
  hipRoof(copper, x0, x1, y0, y1, EAVE, 15, 1.6)
}

// ── The entrance pavilion: octagon, steep copper pyramid, thin spire ──
{
  const C: XY = [17, -40], R = 10.5, N = 8, EAVE = 6.8
  const ring = circle(C, R, N, Math.PI / 8)
  prism(block, ring, 0, EAVE, null, 0)
  const ov = circle(C, R + 1.4, N, Math.PI / 8)
  const apex: V3 = [C[0], C[1], 13.2]
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    copper.tri([ov[i][0], ov[i][1], EAVE], [ov[j][0], ov[j][1], EAVE], apex)
  }
  copper.loft([at(ov, EAVE - 0.35), at(ov, EAVE)])
  capPoly(copper, ov, EAVE - 0.35, false)
  // the spire: a thin needle on a small drum
  revolve(copper, C, [[1.1, 12.2], [0.5, 14.2], [0.28, 16], [0.12, 25], [0, 25.4]], 6, 0, false, false)
  for (let i = 0; i < N; i++) if (i % 2 === 0) edgePanels(door, ring[i], ring[(i + 1) % N], 0.3, 3.2, { group: 2.9, gap: 0, bay: 3, pier: 0.4, margin: 1.4, min: 2 })
}

// ── The porte-cochère: a flat canopy on posts over the drive ──
{
  const x0 = 26.3, x1 = 34.4, y0 = -65.4, y1 = -50
  box(flat, x0, x1, y0, y1, 4.1, 4.9, flat, 0.15)
  wall(block, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 4.1, 4.9)
  for (const x of [x0 + 0.6, x1 - 0.6]) for (const y of [y0 + 0.6, (y0 + y1) / 2, y1 - 0.6]) box(block, x - 0.35, x + 0.35, y - 0.35, y + 0.35, 0, 4.1, null, 0)
}

await save('phx-arizona-biltmore', 'Arizona Biltmore', [
  { part: block, material: { ...finish('biltmore-block', 0xdccbb0), floodlight: (p, n) => (n[2] < 0.5 && ((p[0] < -7 && p[0] > -16 && p[1] > 0 && p[1] < 10) || Math.hypot(p[0] - 17, p[1] + 40) < 12) ? 0.8 : 0) } },
  { part: copper, material: finish('biltmore-copper', 0x8fa89a) },
  { part: win, material: PALETTE.window },
  { part: flat, material: finish('biltmore-flat-roof', 0xddd8cd) },
  { part: door, material: { ...PALETTE.entrance, color: 0x7a6a58 } },
], { height: 25.4, anchor: [ANCHOR.lat, ANCHOR.lng], bearing: BEARING }, 6500)
