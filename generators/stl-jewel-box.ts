/**
 * The Jewel Box (St. Louis Floral Conservatory), Forest Park, St. Louis
 * (1936, William C. E. Becker, city engineer) — procedural, CC0-1.0, no
 * textures.  bun generators/stl-jewel-box.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (OSM way/28533273's
 * long walls run due north within 0.3°). Anchor -90.2802747, 38.6353224:
 * the outline's area centroid.
 *
 * The building: a glass-and-steel greenhouse in cascading tiers. A tall
 * central nave, and on each long side four lower tiers stepping down and
 * out, like a stepped pyramid in section; at the south front the tiers'
 * ends step back too (the OSM outline's 0.6 m steps), with the Art Deco
 * limestone entrance pavilion before the nave; a rubble-limestone base
 * under all the glass; a lower flat-roofed service wing at the north end.
 *
 * Measured (USGS lidar USGS_LPC_MO_StLouis_2017_LAS_2018, flown 2017–18,
 * 0.5 m grid, above the lowest ground at the north end; the south and the
 * sides stand 1–1.5 m higher): tier tops 16.8 (nave, half-width 4.3),
 * 15.0 (5.3), 13.1 (6.3), 10.8 (7.2) and 6.8 (7.9, the OSM edge); the
 * north wing 6.0. OSM: plan, the south steps (tier ends at y -24.3, -23.7,
 * -23.1, -22.5, -22.2), the pavilion (x -3.1 to 3.3, to y -28.5), the
 * north wing (x ±6.1, to y 27.5).
 * Estimated from the photos: the stone base (2.0 m), the pavilion's height
 * (7.2 m over the lowest ground, about 5.8 over its own paving), its three doors and fluted pilasters, the mullion spacing (about
 * 3.3 m on the long sides, drawn sparser than the real ~1.6 m panes) and
 * the transoms, the plants inside.
 *
 * Glass: the walls and roofs are translucent (STYLE.md, "Translucent
 * glass"): `glass`, a clear blue-grey tint at 26% opacity, double-sided,
 * with the solid dark green-charcoal frame carrying every corner, roof edge, sill,
 * mullion and transom, and what shows through modelled inside: the floor
 * on the base, planting beds and palms, the nave's inner frame.
 * Colours: the frame is the photos' near-black green steel, held at the
 * palette's darkest (#4f5c57);
 * the pavilion and base limestone.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   - "JewelBox2013.jpg", Marcus Qwertyus, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:JewelBox2013.jpg
 *     (south-west: the stepped front, the pavilion, the west tiers);
 *   - "Jewel box, angled view.jpg", MauraWen, CC0,
 *     https://commons.wikimedia.org/wiki/File:Jewel_box,_angled_view.jpg
 *     (south-east: the east tiers, the base, the pavilion's side);
 *   - "Jewel Box St Louis.JPG", Fredlyfish4, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Jewel_Box_St_Louis.JPG;
 *   - "Jewel box front view, Feb 2026.jpg", MauraWen, CC0,
 *     https://commons.wikimedia.org/wiki/File:Jewel_box_front_view,_Feb_2026.jpg;
 *   - "Jewel box interior.jpg", MauraWen, CC0,
 *     https://commons.wikimedia.org/wiki/File:Jewel_box_interior.jpg
 *     (the planting and the inner frame).
 * Look-only (GFDL 1.2, not used for shape): Jonathunder,
 * "JewelBoxStLouisMO.jpg", "FrontJewelBoxStLouis.jpg".
 * Doubts: no photo shows the north wing; it is a plain stone box at its
 * lidar height. The tiers' glass roofs are drawn flat (the real ones pitch
 * slightly).
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { box, ccw, cornice, onWall, prism, rectShape, save, type XY } from './atl-tech-tower'
import { PALETTE } from './palette'

const glass = new Part(), frame = new Part(), stone = new Part(), plants = new Part(), win = new Part()
const R = (x0: number, x1: number, y0: number, y1: number): XY[] => ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
const BASE = 2.0 // the rubble-limestone base under the glass
const N = 17.2 // the tiers' north end
// tiers from the nave outward: half-width, top, south end
const T: [number, number, number][] = [[4.3, 16.8, -24.3], [5.3, 15.0, -23.7], [6.3, 13.1, -23.1], [7.2, 10.8, -22.5], [7.9, 6.8, -22.2]]
const F = 0.13 // half the width of a frame bar

/** A translucent glass quad, both sides drawn by the material. */
const pane = (a: V3, b: V3, c: V3, d: V3) => glass.quad(a, b, c, d)
/** A frame bar between two points (axis-aligned), square in section. */
function bar(a: V3, b: V3, h = F) {
  box(frame, Math.min(a[0], b[0]) - h, Math.max(a[0], b[0]) + h, Math.min(a[1], b[1]) - h, Math.max(a[1], b[1]) + h, Math.min(a[2], b[2]) - h, Math.max(a[2], b[2]) + h, frame, 0)
}

// The base, its top the conservatory floor.
const FOOT = ccw([[-7.9, -22.2], [-6.5, -22.2], [-6.5, -22.8], [-5.4, -22.8], [-5.4, -23.5], [-4.3, -23.5], [-4.3, -24.3], [4.3, -24.3], [4.3, -23.5], [5.7, -23.5], [5.7, -22.9], [6.8, -22.9], [6.8, -22.3], [7.9, -22.3], [7.9, N], [-7.9, N]])
prism(stone, FOOT, 0, BASE, stone, 0.15)

for (let i = 0; i < T.length; i++) {
  const [w, h, s] = T[i]
  const wIn = i > 0 ? T[i - 1][0] : 0
  const below = i < T.length - 1 ? T[i + 1] : null
  const zLow = below ? below[1] : BASE // where the next tier's roof meets this wall
  const sOut = below ? below[2] : s
  for (const sg of [-1, 1]) {
    const x = sg * w
    // the long side wall: above the next tier's roof along most of it, down to
    // the base where this tier runs past the next one at the south end
    pane([x, sOut, zLow], [x, N, zLow], [x, N, h], [x, sOut, h])
    if (sOut > s + 0.01) pane([x, s, BASE], [x, sOut, BASE], [x, sOut, h], [x, s, h])
    // roof strip of this tier
    pane([sg * wIn, s, h], [x, s, h], [x, N, h], [sg * wIn, N, h])
    // the south and north end walls of this tier's strip
    pane([sg * wIn, s, BASE], [x, s, BASE], [x, s, h], [sg * wIn, s, h])
    const nLow = w <= 6.4 ? 6.0 : BASE // above the north wing's roof where it stands behind
    pane([sg * wIn, N, nLow], [x, N, nLow], [x, N, h], [sg * wIn, N, h])
    // frame: the roof edges, the corners, the sill on the next tier's roof
    bar([x, s, h], [x, N, h], 0.18)
    bar([sg * wIn, s, h], [x, s, h], 0.18)
    bar([sg * wIn, N, h], [x, N, h], 0.18)
    bar([x, s, BASE], [x, s, h], 0.18)
    bar([x, N, BASE], [x, N, h], 0.18)
    if (below) bar([x, sOut, zLow], [x, N, zLow])
    // mullions about 3.3 m apart, and a transom on the tall lowest walls
    const n = Math.round((N - sOut) / 3.3)
    for (let k = 1; k < n; k++) {
      const y = sOut + ((N - sOut) * k) / n
      bar([x, y, zLow], [x, y, h])
    }
    if (h - zLow > 3.5) bar([x, sOut, (zLow + h) / 2], [x, N, (zLow + h) / 2])
    // end-wall mullions on the wider strips
    if (w - wIn > 2) bar([sg * (wIn + w) / 2, s, BASE], [sg * (wIn + w) / 2, s, h])
  }
}
// The nave's south front: its mullions and transoms (photo: a tall grid).
{
  const [w, h, s] = T[0]
  for (const x of [-w / 2, 0, w / 2]) bar([x, s, BASE], [x, s, h])
  for (const z of [6.4, 9.6, 12.9]) bar([-w, s, z], [w, s, z])
  for (const z of [6.4, 9.6, 12.9]) bar([-w, N, z], [w, N, z])
  for (const x of [-w / 2, 0, w / 2]) bar([x, N, 6.0], [x, N, h])
}
// The sill bars on the base all round.
for (const sg of [-1, 1]) bar([sg * 7.9, -22.2, BASE], [sg * 7.9, N, BASE])

// Inside: the nave's inner frame (portal columns under the nave walls),
// planting beds and palms, seen through the glass.
for (let y = -20; y <= 14; y += 6.8) for (const sg of [-1, 1]) bar([sg * 4.3, y, BASE], [sg * 4.3, y, 16.8], 0.2)
for (const [x0, x1, y0, y1, hh] of [[-6.8, -2.2, -19, -6, 1.6], [2.2, 6.8, -19, -6, 1.4], [-6.8, -2.2, -3, 14, 1.8], [2.2, 6.8, -3, 14, 1.5]] as [number, number, number, number, number][]) {
  box(plants, x0, x1, y0, y1, BASE, BASE + hh, plants, 0.4)
}
const PALMS: [number, number, number][] = [[-4.5, -15, 9.5], [4.8, -12, 8], [-5.2, 0, 7.5], [4.4, 5, 10.5], [-3.6, 10, 8.5], [5.5, -2, 6], [0, -8, 12.5], [0.5, 9, 11]]
for (const [x, y, top] of PALMS) {
  box(frame, x - 0.18, x + 0.18, y - 0.18, y + 0.18, BASE, top - 1.2, null, 0) // trunk, pale
  box(plants, x - 1.8, x + 1.8, y - 1.8, y + 1.8, top - 2, top, plants, 0.6) // crown
}

// The limestone entrance pavilion before the nave: cornice, four fluted
// pilasters and three glazed doors with transoms on the south face, a window
// on each side.
const PV = R(-3.1, 3.3, -28.5, -24.3)
prism(stone, PV, 0, 7.2, stone, 0.2)
cornice(stone, PV, 6.6, 0.6, 0.2, null)
for (const x of [-2.75, -0.95, 1.15, 2.95]) box(stone, x - 0.32, x + 0.32, -28.8, -28.5, 1.6, 6.3, stone, 0.08)
for (const xc of [-1.85, 0.1, 2.05]) onWall(win, [xc - 0.6, -28.5], [xc + 0.6, -28.5], rectShape(0, 1.2, 1.8, 5.2), 0.06)
onWall(win, [-3.1, -25.2], [-3.1, -27.4], rectShape(0, 2.2, 2.7, 5.3), 0.05)
onWall(win, [3.3, -27.4], [3.3, -25.2], rectShape(0, 2.2, 2.7, 5.3), 0.05)
// the steps before it
box(stone, -3.6, 3.8, -30.4, -28.5, 0, 1.7, stone, 0.08) // to the paving, 1.4 m over the north end

// The north service wing (lidar 6.0), plain limestone.
prism(stone, R(-6.4, 6.4, N, 27.5), 0, 6.0, stone, 0.2)
cornice(stone, R(-6.4, 6.4, N, 27.5), 5.5, 0.5, 0.15, null)

await save('stl-jewel-box', 'Jewel Box', [
  { part: glass, material: { name: 'glass', color: 0x6f8e9c, roughness: 0.2, opacity: 0.26, doubleSided: true } },
  { part: frame, material: finish('jewel-box-frame', 0x4f5c57) },
  { part: stone, material: finish('jewel-box-limestone', 0xe6dac4) },
  { part: plants, material: finish('jewel-box-plants', 0x7fa06e) },
  { part: win, material: PALETTE.window },
], { height: 17, anchor: [38.6353224, -90.2802747], bearing: 0, osm: 'way/28533273' }, 6500)
