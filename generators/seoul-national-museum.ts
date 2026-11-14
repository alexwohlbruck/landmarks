/**
 * National Museum of Korea (국립중앙박물관), Yongsan, Seoul: procedural,
 * CC0-1.0.
 * bun generators/seoul-national-museum.ts
 *
 * Map frame turned to the building: bearing 3.42, so model +x runs along
 * the long axis toward compass 93.42 (the outline's long edges, OSM
 * way/168364800). The origin is that outline's area centroid; y = 0 is the
 * lowest ground under it (the site rises a storey to the north: the big
 * stair in the open plaza climbs to the north terrace). Elevation 0. The
 * map's terrain could not be checked (no z15 tiles over Seoul).
 *
 * Published (ko.wikipedia "국립중앙박물관"): 404 m long, maximum height
 * 43.08 m, 6 storeys above ground and 1 below; architect Park Seung-hong
 * (Junglim), opened 2005.
 *
 * OSM: the outline way/168364800 (3 levels, flat roof; used as tagged, in
 * the turned frame: a 64 m deep bar from x -62 to 201 and a wider west
 * block, x -171 to -62), the round part way/382079361 (r 22 at the centre:
 * the glass drum) and the sliver way/382079351 beside it.
 *
 * From photos (heights scaled to the published 43.08 m, which is taken as
 * the top of the drum's cap; the stone roof at 40 m):
 * - the open plaza (열린마당): a gap through the whole depth of the bar,
 *   about 86 m wide (x -62 to 24) and 31 m high (74 % of the height at
 *   the pier in "National Museum of Korea (4)"; width/height about 2.8 in
 *   the pond view), under a 9 m stone lintel; its soffit dark grey. The
 *   drum stands inside it against the east pier, and its round cap shows
 *   above the roof; sky shows through the middle third.
 * - the gap's side faces are glass (the west block's glazed wall full
 *   height on the west, glass behind the drum on the east).
 * - the west block: a stone pier for its eastern 48 m, flush with the bar
 *   (OSM's projections south and north of it drawn as 22 m glass), then a
 *   slightly lower
 *   glass-walled wing to the west end (the view across the Mirror Pond).
 * - pale granite cladding, almost windowless: one deep square window east
 *   of the gap and a tall glazed slot farther east on the south face
 *   ("Exterior of the National Museum of Korea in Seoul"); the east end
 *   steps down.
 * Estimated: the gap's width and height (from the pond and plaza views), the west wing's height (34 m), the glazed
 *   volume in the gap, the east end's 30 m, window positions on the north
 *   face (unphotographed, mirrored from the south).
 * Left out: the stair and terraces in the plaza (ground), stone joints,
 *   the Mirror Pond and its pavilion, the separate restaurant and shops.
 *
 * Night: the drum and the glazing are `window`; the soffit carries the
 * plaza lights as `entrance`.
 *
 * Photos (EVIDENCE):
 * - "National Museum of Korea (4).jpg", SJ Yang, CC BY-SA 2.0 (Commons; the plaza from the south)
 *   https://commons.wikimedia.org/wiki/File:National_Museum_of_Korea_(4).jpg
 * - "Front view of national museum of korea.jpg", Jinah78, CC BY-SA 3.0 (Commons; across the pond)
 *   https://commons.wikimedia.org/wiki/File:Front_view_of_national_museum_of_korea.jpg
 * - "Exterior of the National Museum of Korea in Seoul.jpg", Ethan Doyle White, CC BY-SA 4.0 (Commons; south face east of the gap)
 *   https://commons.wikimedia.org/wiki/File:Exterior_of_the_National_Museum_of_Korea_in_Seoul.jpg
 * - "National Museum of Korea.jpg", sarahkim, CC BY-SA 2.0 (Commons)
 *   https://commons.wikimedia.org/wiki/File:National_Museum_of_Korea.jpg
 * - "2026년 3월 2일에 찍은 국립중앙박물관 전경.jpg", Charcoalchoe25, CC0 (Commons; from the west stair)
 *   https://commons.wikimedia.org/wiki/File:2026%EB%85%84_3%EC%9B%94_2%EC%9D%BC%EC%97%90_%EC%B0%8D%EC%9D%80_%EA%B5%AD%EB%A6%BD%EC%A4%91%EC%95%99%EB%B0%95%EB%AC%BC%EA%B4%80_%EC%A0%84%EA%B2%BD.jpg
 * - "National Museum of Korea", KOREA.NET, CC BY-SA 2.0 (Flickr 6387720685)
 *   https://www.flickr.com/photos/42438955@N05/6387720685
 * No look-only references used.
 * Doubts: no photo from the north or from above; the plaza's width is read
 * from oblique views; OSM's levels=3 is the gallery floors, not storeys.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { flat, lathe, polyCap, polyWalls } from './seoul-n-seoul-tower'

type P2 = [number, number]
const stone = new Part(), win = new Part(), roof = new Part(), soffit = new Part(), lit = new Part()

/** An axis-aligned block with a bevelled top edge, walls in `wall`. */
function block(wall: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = roof, bev = 0.5, bottom = false) {
  const ring: P2[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  polyWalls(wall, ring, z0, z1 - bev)
  const inner: P2[] = [[x0 + bev, y0 + bev], [x1 - bev, y0 + bev], [x1 - bev, y1 - bev], [x0 + bev, y1 - bev]]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const o0: V3 = [ring[i][0], ring[i][1], z1 - bev], o1: V3 = [ring[j][0], ring[j][1], z1 - bev]
    const i0: V3 = [inner[i][0], inner[i][1], z1], i1: V3 = [inner[j][0], inner[j][1], z1]
    const ex = ring[j][0] - ring[i][0], ey = ring[j][1] - ring[i][1], l = Math.hypot(ex, ey)
    flat(wall, [o0, o1, i1, i0], [ey / l * 0.7, -ex / l * 0.7, 0.7])
  }
  if (top) polyCap(top, inner, z1, true)
  if (bottom) polyCap(wall, ring, z0, false)
}
/** A flat panel on a vertical face: face 's' (y = y0, facing -y) or 'n' (facing +y), x range, z range. */
function panel(p: Part, side: 's' | 'n' | 'w' | 'e', at: number, u0: number, u1: number, z0: number, z1: number) {
  const o = 0.06
  if (side === 's') flat(p, [[u0, at - o, z0], [u1, at - o, z0], [u1, at - o, z1], [u0, at - o, z1]], [0, -1, 0])
  if (side === 'n') flat(p, [[u0, at + o, z0], [u1, at + o, z0], [u1, at + o, z1], [u0, at + o, z1]], [0, 1, 0])
  if (side === 'w') flat(p, [[at - o, u0, z0], [at - o, u1, z0], [at - o, u1, z1], [at - o, u0, z1]], [-1, 0, 0])
  if (side === 'e') flat(p, [[at + o, u0, z0], [at + o, u1, z0], [at + o, u1, z1], [at + o, u0, z1]], [1, 0, 0])
}

function build() {
  const H = 40, GAP_X0 = -62, GAP_X1 = 24, GAP_Z = 31, Y0 = -28.5, Y1 = 35.8
  // ---- The main bar east of the plaza, to the east end.
  block(stone, GAP_X1, 191.1, Y0, Y1, 0, H)
  // The east end steps down (OSM's end bumps), 30 m.
  block(stone, 191.1, 200.8, Y0, 24.8, 0, 30)
  block(stone, 200.8, 228.2, -25.1, -4.1, 0, 22)
  block(stone, 201.8, 216.9, -4.1, 24.8, 0, 26)
  // ---- The lintel over the open plaza, its dark soffit and lights.
  block(stone, GAP_X0, GAP_X1, Y0, Y1, GAP_Z, H)
  flat(soffit, [[GAP_X0, Y0, GAP_Z - 0.02], [GAP_X0, Y1, GAP_Z - 0.02], [GAP_X1, Y1, GAP_Z - 0.02], [GAP_X1, Y0, GAP_Z - 0.02]], [0, 0, -1])
  // a stone frame lip round the opening, 1.2 m, on both faces
  for (const [y, s] of [[Y0, -1], [Y1, 1]] as [number, number][]) {
    const yi = y - s * 1.6
    flat(stone, [[GAP_X0, y, GAP_Z], [GAP_X1, y, GAP_Z], [GAP_X1, yi, GAP_Z], [GAP_X0, yi, GAP_Z]].map((p) => p as V3), [0, 0, -1])
  }
  // ---- The west block: stone to x -110, then a lower glass wing.
  // OSM's west outline: x -171 to -62, y -61 to 53.5 with notches.
  // the stone pier west of the plaza, flush with the bar's faces
  block(stone, -110, GAP_X0, Y0, Y1, 0, H)
  // OSM's projections south and north of the pier: lower glass, as the
  // pond view shows nothing but glass forward of the stone face
  block(win, -110, GAP_X0, -61.1, Y0, 0, 22, null)
  block(stone, -110.3, GAP_X0, -61.4, Y0, 19.8, 22.4, roof, 0.4)
  block(win, -110, GAP_X0, Y1, 53.5, 0, 22, null)
  block(stone, -110, GAP_X0 + 0.3, Y1, 53.8, 19.8, 22.4, roof, 0.4)
  block(win, -162, -110, -61.1, 47.5, 0, 34, null)
  block(win, -171.1, -162, -10.8, 47.5, 0, 34, null)
  block(win, -151.3, -110, 47.5, 53.5, 0, 34, null)
  // the glass wing's roof: a stone cap band and a roof
  block(stone, -162, -110, -61.1, 47.5, 31.5, 34.4, roof, 0.4)
  block(stone, -171.1, -162, -10.8, 47.5, 31.5, 34.4, roof, 0.4)
  block(stone, -151.3, -110, 47.5, 53.5, 31.5, 34.4, roof, 0.4)
  // mullion/floor lines on the glass wing: a few pale bands
  for (const z of [10.5, 21]) {
    block(stone, -162.3, -109.8, -61.4, 47.8, z, z + 0.7, null, 0.2)
    block(stone, -171.4, -162, -11.1, 47.8, z, z + 0.7, null, 0.2)
  }
  for (let x = -154; x > -165; x -= 13) block(stone, x - 0.4, x + 0.4, -61.4, -61.0, 0, 31.5, null, 0.1)
  for (let x = -147; x < -112; x += 12.5) block(stone, x - 0.4, x + 0.4, -61.4, -61.0, 0, 31.5, null, 0.1)
  // ---- The glazed volume inside the plaza's west side, over a stone base.
  // The gap's two side faces are glazed (the west block's glass wall on
  // the west, glass behind the drum on the east), so the portal reads as a
  // dark opening under the soffit from every side.
  panel(win, 'e', GAP_X0, Y0 + 0.3, Y1 - 0.3, 0, GAP_Z)
  panel(win, 'w', GAP_X1, Y0 + 0.3, Y1 - 0.3, 0, GAP_Z)
  // ---- The drum: glass, r 22, through the roof to 43.08 m.
  lathe([2, 0], [[22, 0], [22, 1.2]], () => stone, 36)
  lathe([2, 0], [[22, 1.2], [22, GAP_Z - 0.1]], () => win, 36)
  lathe([2, 0], [[21.6, H], [21.6, 42.3], [22.4, 42.5], [22.4, 43.08], [21.0, 43.08], [0, 43.08]], (b) => (b === 0 ? win : b < 4 ? stone : roof), 36)
  // the drum's entrance doors at its foot, facing the plaza
  for (const a of [150, 180, 210]) {
    const t = (a * Math.PI) / 180, r = 22.06, w = 0.12
    const p0: V3 = [2 + r * Math.cos(t - w), r * Math.sin(t - w), 1.2], p1: V3 = [2 + r * Math.cos(t + w), r * Math.sin(t + w), 1.2]
    flat(lit, [p1, p0, [p0[0], p0[1], 5], [p1[0], p1[1], 5]], [Math.cos(t), Math.sin(t), 0])
  }
  // ---- Windows: the deep square window and the tall slot on the south
  //      face (Exterior photo), mirrored on the north; the east end's louvres.
  for (const [side, y] of [['s', Y0], ['n', Y1]] as ['s' | 'n', number][]) {
    panel(win, side, y, 42, 51, 16, 25)
    panel(win, side, y, 116, 120, 3, 34)
    panel(win, side, y, 168, 186, 33, 36.5)
  }
  // ground-floor entrances under the lintel, on the faces inside the plaza
  panel(lit, 'w', GAP_X1 - 0.05, 24, 32, 0.5, 5)
  panel(lit, 'e', GAP_X0 + 0.05, 4, 24, 0.5, 5)

  const parts = [
    { part: stone, material: finish('museum-granite', 0xe6e1d7) },
    { part: win, material: { ...PALETTE.window, color: 0x6f8a96 } },
    { part: roof, material: PALETTE.roof },
    { part: soffit, material: finish('soffit', 0x6b7076) },
    { part: lit, material: PALETTE.entrance },
  ]
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('National Museum of Korea', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 3.42, elevation: 0, height: 43.08,
  })
  if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
  const out = new URL('../models/seoul-national-museum.glb', import.meta.url).pathname
  Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

if (import.meta.main) build()
