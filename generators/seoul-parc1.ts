/**
 * Parc.1, Yeouido, Seoul — original procedural geometry, CC0-1.0.
 * bun generators/seoul-parc1.ts
 *
 * The whole Parc.1 block: Tower 1 (333 m) and Tower 2 (NH Financial Tower,
 * 266 m) with their red exposed corner mega-frames (Richard Rogers / RSHP),
 * the Fairmont Ambassador hotel and The Hyundai Seoul department store.
 *
 * Map frame turned to the Yeouido grid: +y runs to compass 51.5 (north-east),
 * +x to compass 141.5 (south-east), z up, metres. BEARING 51.5. Origin =
 * centroid of the OSM landuse outline way/681813062 "파크원".
 *
 * Evidence
 * - OSM: way/874639189 "파크원 타워1" (height 322, 69 levels): a 43.4 x 50.6 m
 *   rectangle with a 14.6 x 34.4 m core annex on its south-east side;
 *   way/874639190 "NH금융타워(타워2)" (256, 53 levels): the same plan;
 *   way/874639192 "페어몬트 앰배서더 서울" (111, 31 levels); way/874639191
 *   "더현대 서울" (8 levels, no height): 165 x 100 m. These four are every
 *   building inside the landuse outline.
 * - Published: Tower 1 333 m and Tower 2 266 m to the top of the frames
 *   (Wikipedia "Parc.1", CTBUH Skyscraper Center), completed 2020, RSHP.
 *   OSM's 322 and 256 are taken as the glass roofs.
 * - Commons photos (daylight):
 *   "Yeouido 14.jpg" (kallerna, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Yeouido_14.jpg): Tower 1's crown:
 *     paired red columns at each corner rising to a red top beam, the dark
 *     flat canopy floating over an open top floor, the pale core annex.
 *   "Yeouido 12.jpg" (kallerna, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Yeouido_12.jpg): both towers from
 *     the park pond: red columns at every corner, the glass corner bays
 *     between them, red links at intervals.
 *   "Yeouido 9.jpg", "Yeouido 5.jpg", "Yeouido 6.jpg", "Yeouido 3.jpg"
 *     (kallerna, CC BY-SA 4.0): the frames from the west and south-west.
 *   "Yeouido Han River Park.jpg" (Brit in Seoul, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Yeouido_Han_River_Park.jpg):
 *     from the north: the two towers, their pale core annexes.
 *   Colours: frame red sampled ~#d0302f in sun, pulled to #c8433a; glass
 *   blue-grey ~#7f97b0, drawn #8ca2b8; cores pale grey.
 *
 * Estimated: the column size (4.2 x 2.4 m, bolder than real so they read at
 * 80 px) and position (centred 4.4 m from each corner), the link levels
 * (quarters of the height), the crown (open floor 12 m drawn as a dark void,
 * canopy 2.6 m thick overhanging 3.5 m), the pale vertical piers grouping
 * each glass face into three broad panels, the cores' heights (93% of the roof). The Fairmont
 * hotel and The Hyundai Seoul are drawn plainly from OSM: no licensed
 * exterior photo of either was found; The Hyundai's 44 m is 8 storeys at
 * 5.5 m. No lidar exists for Korea and the map's terrain (Mapterhorn) has no
 * tiles over Seoul; Yeouido is flat.
 *
 * Night: the office floors are lit (window-2); the red frames are floodlit
 * up their faces (`_FLOODLIGHT` on the red, strongest low and on the
 * outward faces), as they are after dark.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 51.5
const ANCHOR = { lng: 126.928288, lat: 37.526027 }

const glass = new Part(), red = new Part(), core = new Part(), roof = new Part(), canopy = new Part(), stone = new Part()

function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bev = 0, bottom = true) {
  const r = (a: number, b: number, c: number, d: number, z: number): V3[] => [[a, c, z], [b, c, z], [b, d, z], [a, d, z]]
  if (bev > 0) {
    p.loft([r(x0, x1, y0, y1, z0), r(x0, x1, y0, y1, z1 - bev), r(x0 + bev, x1 - bev, y0 + bev, y1 - bev, z1)])
    p.cap(r(x0 + bev, x1 - bev, y0 + bev, y1 - bev, z1), true)
  } else {
    p.loft([r(x0, x1, y0, y1, z0), r(x0, x1, y0, y1, z1)])
    p.cap(r(x0, x1, y0, y1, z1), true)
  }
  if (bottom) p.cap(r(x0, x1, y0, y1, z0), false)
}

/** Pale floor-group lines on the four faces of a box (every `every` m). */
/** Pale vertical piers grouping a glass face into broad panels: n bays between u0 and u1. */
function piers(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, n: number, inset: number) {
  const W = 1.6, D = 0.3
  for (let k = 1; k < n; k++) {
    const fx = x0 + inset + ((x1 - x0 - 2 * inset) * k) / n, fy = y0 + inset + ((y1 - y0 - 2 * inset) * k) / n
    box(p, fx - W / 2, fx + W / 2, y0 - D, y0 + 0.01, z0, z1, 0, false) // south face
    box(p, fx - W / 2, fx + W / 2, y1 - 0.01, y1 + D, z0, z1, 0, false) // north face
    box(p, x0 - D, x0 + 0.01, fy - W / 2, fy + W / 2, z0, z1, 0, false) // west face
    box(p, x1 - 0.01, x1 + D, fy - W / 2, fy + W / 2, z0, z1, 0, false) // east face
  }
}
function floorLines(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, every: number, inset = 4.5) {
  for (let z = z0 + every; z < z1 - every / 2; z += every) {
    const a = z - 0.3, b = z + 0.3, o = 0.06
    p.quad([x0 + inset, y0 - o, a], [x1 - inset, y0 - o, a], [x1 - inset, y0 - o, b], [x0 + inset, y0 - o, b])
    p.quad([x1 - inset, y1 + o, a], [x0 + inset, y1 + o, a], [x0 + inset, y1 + o, b], [x1 - inset, y1 + o, b])
    p.quad([x1 + o, y0 + inset, a], [x1 + o, y1 - inset, a], [x1 + o, y1 - inset, b], [x1 + o, y0 + inset, b])
    p.quad([x0 - o, y1 - inset, a], [x0 - o, y0 + inset, a], [x0 - o, y0 + inset, b], [x0 - o, y1 - inset, b])
  }
}

/**
 * One office tower: glass box (x0..x1, y0..y1) to `R`, an open top floor and
 * a floating canopy at `C`, red paired corner columns to `TOP`, red links,
 * and the pale core annex on the +x side.
 */
function parcTower(x0: number, x1: number, y0: number, y1: number, R: number, C: number, TOP: number,
  annex: [number, number, number, number]) {
  box(glass, x0, x1, y0, y1, 0, R, 0, false)
  piers(core, x0, x1, y0, y1, 6, R, 3, 6.5)
  // open top floor: recessed glass, canopy above
  box(canopy, x0 + 4, x1 - 4, y0 + 4, y1 - 4, R, C, 0, false) // the open floor reads as a dark void
  roof.cap([[x0 + 0.01, y0 + 0.01, R], [x1 - 0.01, y0 + 0.01, R], [x1 - 0.01, y1 - 0.01, R], [x0 + 0.01, y1 - 0.01, R]], true)
  box(canopy, x0 - 3.5, x1 + 3.5, y0 - 3.5, y1 + 3.5, C, C + 2.6, 0.5)
  box(roof, x0 + 6, x1 - 6, y0 + 6, y1 - 6, C + 2.6, C + 5, 0.4)

  // Paired red columns at every corner, one on each face, 3.6 m in from the corner.
  const W = 4.2, D = 2.4, IN = 4.4
  const corners: [number, number, number, number][] = [[x0, y0, 1, 1], [x1, y0, -1, 1], [x1, y1, -1, -1], [x0, y1, 1, -1]]
  for (const [cx, cy, sx, sy] of corners) {
    // on the face y = cy (column sits along x)
    const ax = cx + sx * IN
    box(red, Math.min(ax - W / 2, ax + W / 2), Math.max(ax - W / 2, ax + W / 2), sy > 0 ? cy - D : cy - 0.3, sy > 0 ? cy + 0.3 : cy + D, 0, TOP, 0.5)
    // on the face x = cx (column sits along y)
    const ay = cy + sy * IN
    box(red, sx > 0 ? cx - D : cx - 0.3, sx > 0 ? cx + 0.3 : cx + D, Math.min(ay - W / 2, ay + W / 2), Math.max(ay - W / 2, ay + W / 2), 0, TOP, 0.5)
    // links: an L of red around the corner bay at the quarter levels and under the canopy
    for (const z of [0.25 * R, 0.5 * R, 0.75 * R, C - 2.6]) {
      const h = 3.6
      const xa = sx > 0 ? cx - D : cx - IN - W / 2, xb = sx > 0 ? cx + IN + W / 2 : cx + D
      const ya = sy > 0 ? cy - D : cy - 0.3, yb = sy > 0 ? cy + 0.3 : cy + D
      box(red, xa, xb, ya, yb, z, z + h)
      const xa2 = sx > 0 ? cx - D : cx - 0.3, xb2 = sx > 0 ? cx + 0.3 : cx + D
      const ya2 = sy > 0 ? cy - D : cy - IN - W / 2, yb2 = sy > 0 ? cy + IN + W / 2 : cy + D
      box(red, xa2, xb2, ya2, yb2, z, z + h)
    }
  }
  // top beams joining the columns along each face, at the canopy
  const zb = C - 2.6
  box(red, x0 + IN, x1 - IN, y0 - D, y0 + 0.3, zb, zb + 2.6)
  box(red, x0 + IN, x1 - IN, y1 - 0.3, y1 + D, zb, zb + 2.6)
  box(red, x0 - D, x0 + 0.3, y0 + IN, y1 - IN, zb, zb + 2.6)
  box(red, x1 - 0.3, x1 + D, y0 + IN, y1 - IN, zb, zb + 2.6)

  // core annex: pale panels with a few broad window slots
  const [ax0, ax1, ay0, ay1] = annex, AH = 0.93 * R
  box(core, ax0, ax1, ay0, ay1, 0, AH, 0.5, false)
  for (let z = 30; z < AH - 20; z += 42) {
    glass.quad([ax1 + 0.05, ay0 + 4, z], [ax1 + 0.05, ay1 - 4, z], [ax1 + 0.05, ay1 - 4, z + 12], [ax1 + 0.05, ay0 + 4, z + 12])
  }
}

// Tower 1 (OSM 322 to the glass roof, 333 published)
parcTower(-142, -98.6, -54, -3.4, 316, 328, 333, [-98.6, -84, -47.8, -13.4])
// Tower 2 (OSM 256, 266 published)
parcTower(-141.2, -97.8, 16.2, 66.8, 249, 261, 266, [-97.8, -83.1, 22.4, 56.8])

// --- Fairmont Ambassador Seoul (OSM 111 m), plain glass slab with its wing ---
{
  const H = 111
  box(glass, 108.3, 126.4, -36, 28.5, 0, H, 0.6, false)
  piers(core, 108.3, 126.4, -36, 28.5, 4, H, 6, 1)
  box(core, 108.9, 125.8, -35.4, 27.9, H, H + 3, 0.4)
  box(glass, 94.6, 108.3, -24.9, 1.9, 0, 44, 0.4, false)
}

// --- The Hyundai Seoul (8 storeys, ~44 m): pale walls, broad glass bands ---
{
  const H = 44
  box(stone, -70, 94.6, -44.5, 54, 0, H, 0.6, false)
  for (const [z0, z1] of [[6, 16], [22, 32]]) {
    glass.quad([-62, -44.55, z0], [86, -44.55, z0], [86, -44.55, z1], [-62, -44.55, z1])
    glass.quad([86, 54.05, z0], [-62, 54.05, z0], [-62, 54.05, z1], [86, 54.05, z1])
    glass.quad([-70.05, 46, z0], [-70.05, -36, z0], [-70.05, -36, z1], [-70.05, 46, z1])
  }
  // roof: a long glass skylight over the central atrium on the deck
  roof.cap([[-69.4, -43.9, H + 0.05], [94, -43.9, H + 0.05], [94, 53.4, H + 0.05], [-69.4, 53.4, H + 0.05]], true)
  box(glass, -40, 70, -6, 16, H, H + 2.2, 0.8)
}

const redFlood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : Math.max(0.3, 1 - p[2] / 420))
const parts = [
  { part: glass, material: windowVariant(2, 0x8ca2b8) },
  { part: red, material: { ...finish('parc1-red', 0xc8433a), floodlight: redFlood } },
  { part: core, material: finish('core-grey', 0xdcdcd6) },
  { part: roof, material: PALETTE.roof },
  { part: canopy, material: finish('canopy-dark', 0x5a5f66) },
  { part: stone, material: PALETTE.stone },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Parc.1', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 333,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/874639189', 'way/874639190', 'way/874639191', 'way/874639192'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/seoul-parc1.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
