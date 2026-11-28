/**
 * Simmons Hall (MIT Building W79), Cambridge MA: original procedural
 * geometry, CC0-1.0.
 * bun generators/bos-simmons-hall.ts
 *
 * Steven Holl with Perry Dean Rogers, 2002. A ten-storey undergraduate
 * dormitory, a 117 m long slab clad in aluminium and pierced by thousands
 * of small square windows in deep reveals (the "sponge"), some reveals
 * painted red or yellow; its roofline steps down twice; corner volumes are
 * cut away at different heights at both ends, leaving cantilevers; a
 * through-passage opens at the base; a few large free-form openings light
 * the atria; and the recessed walls are clad in mauve panels.
 *
 * Frame: map frame turned to BEARING 326.5, so the long axis runs along x
 * (compass 56.5°, east-north-east) and +y faces Vassar Street (compass
 * 326.5°); -y is the south face on Briggs Field. Metres, z up. Origin = the
 * anchor, the centroid of OSM way/29585286.
 *
 * Evidence
 * - OSM way/29585286 (outline, 117.3 x 16.2 m, 10 levels, "MassGIS
 *   Buildings") and its 19 building:parts: the section roofs (32 / 25.6 /
 *   32 / 22.4 / 32 m), the corner cut-outs (min_height/height pairs at both
 *   ends: SW 10-19.2, NW 16-25.6, NE 12.8-22.4, SE 16-25.6) and the
 *   through-passage (min_height 9.6 over x 10.9-22.6).
 * - USGS 3DEP lidar MA_CentralEastern_1_2021 (2021 flight), 1 m grid read in
 *   this frame; ground flat (±0.3 m). Measured above y = 0: tall sections
 *   32.0 (parapet) over x -58.6..-33, -16..15.5 and 24.8..58.7; the west
 *   low section 22.0 (OSM says 25.6; lidar wins) over x -33..-16; the
 *   east notch 19.5 (OSM 22.4) over x 15.5..24.8.
 * - Published: 10 storeys, 350 residents, opened 2002, aluminium-clad
 *   precast "perfcon" grid of 2 ft square windows (Wikipedia, "Simmons
 *   Hall"; MIT Housing).
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - "Simmons Hall, MIT, Cambridge, Massachusetts.JPG", Daderot,
 *     CC BY-SA 3.0 (south face from the south-west: cut-outs, low
 *     sections, free-form openings, mauve recess walls, the passage):
 *     https://commons.wikimedia.org/wiki/File:Simmons_Hall,_MIT,_Cambridge,_Massachusetts.JPG
 *   - "MIT Simmons Hall.jpg", Madcoverboy, CC BY-SA 3.0 (south face, square
 *     on; used to place the openings and recesses):
 *     https://commons.wikimedia.org/wiki/File:MIT_Simmons_Hall.jpg
 *   - "Simmons Hall and Briggs Field.jpg", Chris Rycroft, CC BY 2.0 (south
 *     face from the south-south-west; the red and yellow reveals):
 *     https://commons.wikimedia.org/wiki/File:Simmons_Hall_and_Briggs_Field.jpg
 *   - "Simmons Hall, MIT - Cambridge, MA - DSC07607.jpg", Daderot, CC0
 *     (close-up: aluminium, reveals, red and yellow):
 *     https://commons.wikimedia.org/wiki/File:Simmons_Hall,_MIT_-_Cambridge,_MA_-_DSC07607.jpg
 *   No look-only sources. No commercial imagery.
 *
 * The sponge, abstracted (STYLE: no dot grids): the real grid is about
 * 1.6 m square; here each panel stands for a cluster of openings two
 * storeys tall and two bays wide (a 6.4 x ~6.4 m module), drawn as one
 * dark square that fills ~55% of the module, so the facade still reads as
 * a perforated silver block at phone size. A share of the panels carry a
 * red or yellow strip, the painted reveals, denser towards the ends as in
 * the photos; which panels is a fixed hash, not traced.
 *
 * Estimated: the free-form openings' outlines and places (scaled from the
 * Madcoverboy photo against the lidar section lengths); the south recess
 * in the centre block (x -10..-4, 18.6-26.8, drawn flush); the dining
 * hall's glazing under the west low section.
 * Doubts: the north (Vassar Street) face is not photographed here; its
 * openings and colour are drawn like the south face's, without free-form
 * openings. The cut-outs' back walls are drawn mauve throughout; the SW
 * one is grey-blue in the photos.
 *
 * Night: windows glow (window, window-2).
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE, windowVariant } from './palette'
import { box, onWall, rectShape, save, type XY } from './atl-tech-tower'

const alu = new Part(), win = new Part(), red = new Part(), yellow = new Part(), blob = new Part(), mauve = new Part()

const B = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) => box(alu, x0, x1, y0, y1, z0, z1, alu, 0.35, z0 > 0)

// ── Massing ──
const XW = -58.6, XE = 58.7, YS = -8.1, YN = 8.1, H = 32
// the west block, with the SW (10-19.2) and NW (16-25.6) corners cut away
B(XW, -33, -4.4, 4.5, 0, H)
B(-45.7, -33, YS, -4.4, 0, H); B(XW, -45.7, YS, -4.4, 0, 10); B(XW, -45.7, YS, -4.4, 19.2, H)
B(-46.7, -33, 4.5, YN, 0, H); B(XW, -46.7, 4.5, YN, 0, 16); B(XW, -46.7, 4.5, YN, 25.6, H)
// the west low section
B(-33, -16, YS, YN, 0, 22.0)
// the centre block, and the part over the through-passage
B(-16, 10.9, YS, YN, 0, H)
B(10.9, 15.5, YS, YN, 9.6, H)
// the east notch, over the passage then to the ground
B(15.5, 22.6, YS, YN, 9.6, 19.5)
B(22.6, 24.8, YS, YN, 0, 19.5)
// the east block, with the NE (12.8-22.4) and SE (16-25.6) corners cut away
B(24.8, XE, -4.6, 4.3, 0, H)
B(24.8, 44.7, YS, -4.6, 0, H); B(44.7, XE, YS, -4.6, 0, 16); B(44.7, XE, YS, -4.6, 25.6, H)
B(24.8, 44.6, 4.3, YN, 0, H); B(44.6, XE, 4.3, YN, 0, 12.8); B(44.6, XE, 4.3, YN, 22.4, H)

// ── The sponge ──
/** Deterministic 0..1 hash of a module. */
const hash = (a: number, b: number, c: number) => {
  const s = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453
  return s - Math.floor(s)
}
const MOD = 6.4, GAP = 1.3, MULL = 0.5
type Hole = [number, number, number, number] // s0, s1, z0, z1 to keep clear
/**
 * Panels on a wall from a to b (outside on the right), between z0 and z1:
 * modules two storeys (6.4 m) tall and about 6.4 m wide, each a cluster of
 * four dark squares (two where a row is one storey), the cluster's squares
 * close together and the clusters further apart, so the sponge reads as
 * grouped panels rather than a fine dot grid. Some squares carry a painted
 * reveal. `clear` lists areas to skip.
 */
function sponge(a: XY, b: XY, z0: number, z1: number, clear: Hole[] = [], colour = 0.25, key = 0) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n = Math.max(1, Math.round(L / MOD)), w = L / n
  const rows: Array<[number, number]> = []
  for (let z = z0; z < z1 - 1; z += MOD) rows.push([z, Math.min(z + MOD, z1)])
  for (let i = 0; i < n; i++) {
    for (const [ra, rb] of rows) {
      const s0 = i * w + GAP / 2, s1 = (i + 1) * w - GAP / 2, za = ra + GAP / 2, zb = rb - GAP / 2
      const sm = (s0 + s1) / 2, zm = (za + zb) / 2, two = rb - ra > 4.5
      const cols: Array<[number, number]> = [[s0, sm - MULL / 2], [sm + MULL / 2, s1]]
      const zs: Array<[number, number]> = two ? [[za, zm - MULL / 2], [zm + MULL / 2, zb]] : [[za, zb]]
      const ends = Math.min(1, Math.abs(a[0] + ((b[0] - a[0]) * sm) / L) / 58)
      cols.forEach(([c0, c1], ci) => zs.forEach(([d0, d1], zi) => {
        if (clear.some(([e0, e1, f0, f1]) => c1 > e0 - 0.4 && c0 < e1 + 0.4 && d1 > f0 - 0.4 && d0 < f1 + 0.4)) return
        const h = hash(i * 2 + ci + key * 37, ra + zi * 3.2, L)
        if (h < colour * (0.4 + ends)) {
          const cw = (c1 - c0) * 0.4, left = hash(i, ra, key + ci) < 0.5
          const cs = left ? [c0, c0 + cw] : [c1 - cw, c1]
          onWall(hash(ra + zi, i + ci, 3) < 0.5 ? red : yellow, a, b, rectShape(cs[0], cs[1], d0, d1), 0.05)
          onWall(win, a, b, left ? rectShape(c0 + cw, c1, d0, d1) : rectShape(c0, c1 - cw, d0, d1), 0.05)
        } else onWall(win, a, b, rectShape(c0, c1, d0, d1), 0.05)
      }))
    }
  }
}
/** A free-form opening: a skewed rounded shape in (s, z), its long side slanted. */
function freeform(a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, lean = 1) {
  const sc = (s0 + s1) / 2, zc = (z0 + z1) / 2, rx = (s1 - s0) / 2, rz = (z1 - z0) / 2
  const pts: [number, number][] = []
  for (let i = 0; i < 14; i++) {
    const t = (i / 14) * Math.PI * 2
    const c = Math.cos(t), s = Math.sin(t)
    // a superellipse, sheared so one side leans
    const k = 0.6
    const px = Math.sign(c) * Math.abs(c) ** k * rx, pz = Math.sign(s) * Math.abs(s) ** k * rz
    pts.push([sc + px + lean * 0.25 * pz * (rx / rz), zc + pz])
  }
  onWall(blob, a, b, pts, 0.07)
}

// South face (y = YS), west to east; s = x - XW.
{
  const a: XY = [XW, YS], b: XY = [XE, YS], s = (x: number) => x - XW
  const blobs: Array<[number, number, number, number, number]> = [
    [-48.4, -44.6, 20.0, 25.0, 1], [-39.4, -37.4, 11.4, 15.8, -1], [2.9, 6.5, 15.8, 21.4, 1], [34.4, 36.8, 12.2, 17.2, -1],
  ]
  const clear: Hole[] = blobs.map(([x0, x1, z0, z1]) => [s(x0), s(x1), z0, z1])
  clear.push([s(-10), s(-4), 18.6, 26.8], [s(-38.5), s(-20), 0, 6.0])
  for (const [x0, x1, z0, z1] of blobs) freeform(a, b, s(x0), s(x1), z0, z1)
  const seg = (x0: number, x1: number, z0: number, z1: number) =>
    sponge([x0, YS], [x1, YS], z0, z1, clear.map(([c0, c1, d0, d1]) => [c0 - s(x0), c1 - s(x0), d0, d1] as Hole), 0.25, x0)
  seg(XW, -45.7, 0, 9.6); seg(XW, -45.7, 19.2, H)
  seg(-45.7, -33, 0, H)
  seg(-33, -16, 0, 22.0)
  seg(-16, 10.9, 0, H)
  seg(10.9, 15.5, 9.6, H)
  seg(15.5, 24.8, 9.6, 19.2)
  seg(24.8, 44.7, 0, H)
  seg(44.7, XE, 0, 16); seg(44.7, XE, 25.6, H)
  // the centre block's mauve recess, with two windows; the dining hall's glazing
  onWall(mauve, a, b, rectShape(s(-10), s(-4), 18.6, 26.8), 0.04)
  onWall(win, a, b, rectShape(s(-8.6), s(-7.0), 20.4, 22.0), 0.07)
  onWall(win, a, b, rectShape(s(-6.6), s(-5.2), 23.6, 25.2), 0.07)
  onWall(win, a, b, rectShape(s(-38.5), s(-20), 0.4, 6.0), 0.05)
}
// North face (y = YN), east to west.
{
  const seg = (x0: number, x1: number, z0: number, z1: number) => sponge([x1, YN], [x0, YN], z0, z1, [], 0.25, x0 + 100)
  seg(XW, -46.7, 0, 16); seg(XW, -46.7, 25.6, H)
  seg(-46.7, -33, 0, H)
  seg(-33, -16, 0, 22.0)
  seg(-16, 10.9, 0, H)
  seg(10.9, 15.5, 9.6, H)
  seg(15.5, 24.8, 9.6, 19.2)
  seg(24.8, 44.6, 0, H)
  seg(44.6, XE, 0, 12.8); seg(44.6, XE, 22.4, H)
}
// End faces: west (x = XW, south to north... outside -x: a = north, b = south) and east.
{
  sponge([XW, 4.5], [XW, -4.4], 0, H, [], 0.4, 7)
  sponge([XW, YN], [XW, 4.5], 0, 16, [], 0.4, 8); sponge([XW, YN], [XW, 4.5], 25.6, H, [], 0.4, 9)
  sponge([XW, -4.4], [XW, YS], 0, 9.6, [], 0.4, 10); sponge([XW, -4.4], [XW, YS], 19.2, H, [], 0.4, 11)
  sponge([XE, -4.6], [XE, 4.3], 0, H, [], 0.4, 12)
  sponge([XE, YS], [XE, -4.6], 0, 16, [], 0.4, 13); sponge([XE, YS], [XE, -4.6], 25.6, H, [], 0.4, 14)
  sponge([XE, 4.3], [XE, YN], 0, 12.8, [], 0.4, 15); sponge([XE, 4.3], [XE, YN], 22.4, H, [], 0.4, 16)
}

// ── Mauve walls: the cut-outs' back walls, the tall blocks' ends over the low sections ──
const mauveWall = (a: XY, b: XY, z0: number, z1: number, wins: number) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  onWall(mauve, a, b, rectShape(0.2, L - 0.2, z0 + 0.2, z1 - 0.2), 0.04)
  for (let k = 0; k < wins; k++) {
    const s = ((k + 0.5) * L) / wins, z = z0 + (z1 - z0) * (k % 2 ? 0.62 : 0.35)
    onWall(win, a, b, rectShape(s - 0.8, s + 0.8, z - 0.8, z + 0.8), 0.07)
  }
}
mauveWall([XW, -4.4], [-45.7, -4.4], 10, 19.2, 3) // SW
mauveWall([-46.7, 4.5], [XW, 4.5], 16, 25.6, 3) // NW
mauveWall([44.7, -4.6], [XE, -4.6], 16, 25.6, 3) // SE
mauveWall([XE, 4.3], [44.6, 4.3], 12.8, 22.4, 3) // NE
// the cut-outs' side walls (the faces of the full-height strips)
mauveWall([-45.7, -4.4], [-45.7, YS], 10, 19.2, 0)
mauveWall([-46.7, YN], [-46.7, 4.5], 16, 25.6, 0)
mauveWall([44.7, YS], [44.7, -4.6], 16, 25.6, 0)
mauveWall([44.6, 4.3], [44.6, YN], 12.8, 22.4, 0)
// the tall blocks' ends above the low sections
mauveWall([-16, YN], [-16, YS], 22.0, H, 3) // centre block, west end
mauveWall([-33, YS], [-33, YN], 22.0, H, 2) // west block, east end
mauveWall([15.5, YS], [15.5, YN], 19.5, H, 2) // centre block, east end
mauveWall([24.8, YN], [24.8, YS], 19.5, H, 3) // east block, west end
// the passage's side walls
mauveWall([10.9, YS], [10.9, YN], 0, 9.6, 0)
mauveWall([22.6, YN], [22.6, YS], 0, 9.6, 0)

await save('bos-simmons-hall', 'Simmons Hall', [
  { part: alu, material: finish('simmons-aluminium', 0xd3d6d8) },
  { part: win, material: PALETTE.window },
  { part: red, material: finish('simmons-red', 0xc85a4c) },
  { part: yellow, material: finish('simmons-yellow', 0xe2c24c) },
  { part: blob, material: windowVariant(2, 0x7f9fbe) },
  { part: mauve, material: finish('simmons-mauve', 0xae8d88) },
], { height: 32, anchor: [42.357115, -71.101519], bearing: 326.5 })
