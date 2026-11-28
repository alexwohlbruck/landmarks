/**
 * Mystery Castle, Phoenix (built about 1930-1945 by Boyce Luther Gulley from
 * stone, salvage and adobe, against the foot of South Mountain).
 * Procedural, CC0-1.0, no textures.
 *   bun generators/phx-mystery-castle.ts
 *
 * Map frame: x toward bearing 136 (SE), y toward bearing 46 (NE), z up,
 * metres; placed at bearing 46 (the OSM walls run 46/136 deg). Anchor
 * -112.0620056, 33.3565925, the centroid of OSM way/367641021 ("Mystery
 * Castle"). replaces: way/367641021. The separate building to the south-west
 * (way/367641026, a residence) stands apart and is left to the map.
 *
 * Identity (photos below):
 *  1. Rough grey fieldstone walls below, with small barred windows, round
 *     and pointed openings.                                     (k1, ks, lk)
 *  2. Plastered adobe blocks above, stepped and parapeted, with projecting
 *     vigas and little towers carrying spiky finials.            (k1, lk, m2)
 *  3. The red-painted screened porch, two storeys of red timber posts and
 *     rails under a rusty corrugated roof.                          (k1, m2)
 *  4. A tall freestanding fieldstone chimney stack.                  (k1, m3)
 *
 * The site: the hillside rises about 7 m from the north-west to the
 * south-east across the house (lidar ground); z 0 is the lowest ground under
 * the outline (lidar 406.7 m, 5 m above ground_min). Each part's walls run
 * to z 0 and its floors and openings start at its own ground.
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020), 0.5 m grid,
 * read in this frame (z = lidar - 5). Measured: the central adobe block 10
 * (ground 3-5); the porch block's roof 9-10 at its outer edge (ground 3-5 along
 * the south-west face, where k1 shows two storeys of red posts: floor drawn
 * 6.0, above the map terrain's highest point under it; roof 10.2); the south-west arm
 * 8-10 (ground 2-5); the low link 5-6; the north-west arm 5-8 (ground 1-3).
 * Plan from the OSM outline, split into those parts by the lidar and the USGS
 * NAIP orthophoto (which shows the porch's pale corrugated roof over the
 * south-east block, an orange roof at the south-west end, tan adobe roofs).
 * Estimated: the stone/adobe split heights, the tower (12 m, finial 13.6), the
 * chimney (11.5 m), the porch's posts and rails and the windows (from k1, m2
 * and lk); the vigas (drawn every 1.6 m on the central block).
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 *  k1  "Mystery Castle (14242518270).jpg", ksblack99, public domain,
 *      https://commons.wikimedia.org/wiki/File:Mystery_Castle_(14242518270).jpg
 *  ks  "Side of House (14242512188).jpg", ksblack99, public domain,
 *      https://commons.wikimedia.org/wiki/File:Side_of_House_(14242512188).jpg
 *  m2  "Phoenix-Mystery Castle-2.JPG", Marine 69-71, CC BY-SA 3.0,
 *      https://commons.wikimedia.org/wiki/File:Phoenix-Mystery_Castle-2.JPG
 *  m3  "Phoenix-Mystery Castle-3.JPG", Marine 69-71, CC BY-SA 3.0,
 *      https://commons.wikimedia.org/wiki/File:Phoenix-Mystery_Castle-3.JPG
 *  lk  "Mystery Castle Phoenix Arizona2.jpg", Lockley, public domain,
 *      https://commons.wikimedia.org/wiki/File:Mystery_Castle_Phoenix_Arizona2.jpg
 * No look-only sources. No commercial imagery.
 * Doubts: the folk-built house is irregular everywhere; it is drawn as a few
 * boxes with the right materials. Which face k1 shows was matched from the
 * porch's roof in NAIP; the uphill (south-east and south) sides have no
 * close photo. The scatter of small sculptures, walls and terraces round it
 * is left out.
 *
 * Night: windows glow; nothing is floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, ccw, prism, save, type XY } from './atl-flatiron-building'
import { onWall, rectShape } from './atl-tech-tower'

const ANCHOR = { lng: -112.0620056, lat: 33.3565925 }, BEARING = 46
const stone = new Part(), adobe = new Part(), red = new Part(), rust = new Part(), win = new Part()

// a block: stone to `s`, plastered adobe above to `top`, a parapet lip
function block(x0: number, x1: number, y0: number, y1: number, s: number, top: number, roofPart: Part = adobe) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  prism(stone, r, 0, s, top > s ? null : roofPart, 0)
  if (top > s) prism(adobe, r, s, top, roofPart, 0.2)
  return r
}
// small windows: one per `bay` metres, on every face, from z0 to z1
function windows(r: XY[], z0: number, z1: number, bay: number, w = 0.9, faces = [0, 1, 2, 3]) {
  for (const i of faces) {
    const A = r[i], B = r[(i + 1) % 4], L = Math.hypot(B[0] - A[0], B[1] - A[1]), n = Math.max(1, Math.floor(L / bay))
    for (let k = 0; k < n; k++) { const s = (L * (k + 0.5)) / n; onWall(win, A, B, rectShape(s - w / 2, s + w / 2, z0, z1), 0.06) }
  }
}

// ── The central adobe block, two storeys over the stone, vigas, a tower ──
{
  const r = block(-8, 1.3, 3.9, 10.4, 4.6, 10)
  windows(r, 5.6, 7.2, 2.6, 1.1, [0, 2, 3])
  windows(r, 3.4, 4.3, 3.2, 0.8, [3])
  for (let y = 4.8; y < 10; y += 1.6) box(rust, 1.3, 2.0, y - 0.12, y + 0.12, 8.9, 9.15, rust, 0)
  for (let x = -7.2; x < 1; x += 1.6) box(rust, x - 0.12, x + 0.12, 3.2, 3.9, 8.9, 9.15, rust, 0)
  // the tower with a round "wagon wheel" window and its finial
  box(adobe, -4.6, -1.4, 5.8, 8.9, 10, 12, adobe, 0.15)
  onWall(win, [-4.6, 5.8], [-1.4, 5.8], Array.from({ length: 10 }, (_, k) => [1.6 + 0.75 * Math.cos((k / 10) * Math.PI * 2), 10.9 + 0.75 * Math.sin((k / 10) * Math.PI * 2)] as [number, number]), 0.06)
  box(rust, -3.1, -2.9, 7.25, 7.45, 12, 13.6, null, 0)
  for (const z of [12.6, 13.0, 13.4]) box(rust, -3.45, -2.55, 6.9, 7.8, z, z + 0.12, rust, 0)
}

// ── The porch block: stone base to the floor, the red screened porch ──
{
  const x0 = 1.3, x1 = 15.2, y0 = -5.8, y1 = 10.4, F = 6.0, R = 10.2
  const r = block(x0, x1, y0, y1, F, F, stone)
  // the back wall of the rooms behind the porch (set 2.4 m in), plastered
  const bx1 = x1 - 2.4, by0 = y0 + 2.4
  prism(adobe, [[x0, by0], [bx1, by0], [bx1, y1], [x0, y1]], F, R - 0.2, null, 0)
  windows([[x0, by0], [bx1, by0], [bx1, y1], [x0, y1]], F + 0.9, R - 1.1, 2.2, 1.3, [0, 1])
  // posts round the open sides, a rail and a mid-rail band, the roof
  const posts: XY[] = []
  for (let x = x0 + 0.3; x <= x1 - 0.2; x += 2.3) posts.push([x, y0 + 0.2])
  for (let y = y0 + 2.5; y <= y1 - 0.2; y += 2.3) posts.push([x1 - 0.2, y])
  for (const [x, y] of posts) box(red, x - 0.13, x + 0.13, y - 0.13, y + 0.13, F, R - 0.15, null, 0)
  for (const z of [F + 0.9, F + 2.2, F + 3.2]) {
    box(red, x0, x1 - 0.1, y0 + 0.08, y0 + 0.32, z, z + 0.16, red, 0)
    box(red, x1 - 0.32, x1 - 0.08, y0 + 0.1, y1, z, z + 0.16, red, 0)
  }
  // a rusty corrugated roof, a low shed falling outward, 0.5 m overhang
  const o = 0.5
  const a: V3 = [x0, y0 - o, R - 0.25], b: V3 = [x1 + o, y0 - o, R - 0.25], c: V3 = [x1 + o, y1, R - 0.25], d: V3 = [x0, y1, R + 0.15]
  const e: V3 = [bx1, by0, R + 0.15]
  rust.tri(a, b, e); rust.tri(b, c, e); rust.tri(c, d, e); rust.tri(d, a, e)
  rust.quad([a[0], a[1], a[2] - 0.2], [b[0], b[1], b[2] - 0.2], b, a)
  rust.quad([b[0], b[1], b[2] - 0.2], [c[0], c[1], c[2] - 0.2], c, b)
  rust.quad(a, d, c, b) // underside
}

// ── The south-west arm: stone with an adobe storey; its far end under an
// orange-brown roof (NAIP) ──
{
  const r = block(-7.5, 2.9, -21.7, -9.2, 3.6, 8.6)
  windows(r, 4.6, 6.2, 2.6, 1, [0, 1, 3])
  windows(r, 1.6, 2.8, 3, 0.8, [0, 3])
  // a pointed stone doorway on the north-west face (lk, ks)
  onWall(win, [-7.5, -9.2], [-7.5, -21.7], [[4.35, 2.4], [5.65, 2.4], [5.65, 4.0], [5, 4.7], [4.35, 4.0]], 0.06)
  box(rust, -7.8, 3.2, -22, -16.5, 8.6, 8.9, rust, 0.1)
}

// ── The low link and the north-west arm ──
{
  block(-7.4, -1.2, -9.2, 3.9, 5.8, 5.8, stone)
  const r = block(-11, -1.5, 11.8, 19.3, 3.0, 7.4)
  windows(r, 4.0, 5.8, 2.4, 1, [1, 2, 3])
  windows(r, 1.2, 2.4, 3, 0.8, [2, 3])
}

// ── The fieldstone chimney (k1, m3) ──
prism(stone, ccw([[-9.6, 9.0], [-8.0, 9.0], [-8.0, 10.6], [-9.6, 10.6]]), 0, 10.6, stone, 0.25)
prism(stone, ccw([[-9.35, 9.25], [-8.25, 9.25], [-8.25, 10.35], [-9.35, 10.35]]), 10.6, 11.6, stone, 0.2)

await save('phx-mystery-castle', 'Mystery Castle', [
  { part: stone, material: finish('mystery-stone', 0xb8b2a6) },
  { part: adobe, material: finish('mystery-adobe', 0xd9c7a6) },
  { part: red, material: finish('mystery-porch-red', 0xb3564a) },
  { part: rust, material: finish('mystery-rust', 0xa9785f) },
  { part: win, material: { ...PALETTE.window, color: 0x4f5a66 } },
], { height: 13.6, anchor: [ANCHOR.lat, ANCHOR.lng], bearing: BEARING }, 5000)
