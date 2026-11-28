/**
 * Robert Mueller Municipal Airport control tower, Austin (1961; airport closed
 * 1999, tower kept and re-clad as the Mueller neighbourhood's landmark) -
 * procedural, CC0-1.0, no textures.
 * bun generators/atx-mueller-control-tower.ts
 *
 * A square concrete tower: a plain white base, then the shaft clad in a grid of
 * pale and mid blue panels, straight for its lower half and flaring out in a
 * concave curve to a wide lip, with the cab, a band of glazing under a flat roof
 * slab, on top.
 *
 * Frame: x east, y north, z up, metres, turned to the square's own axes (catalog
 * bearing 11.3, the OSM outline's edges). Anchor -97.698951, 30.291970, the
 * outline's centroid. z = 0 is the ground (lidar 182.05 m; flat site).
 *
 * Replaces: way/352204762 (building=yes, man_made=tower, height 25.6).
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): way/352204762, 5.7 m square.
 * - Lidar (measured; USGS 3DEP USGS_LPC_TX_Central_B1_2017_LAS_2019, flown 2017,
 *   0.5 m grid): the cab roof 25.7 m over the ground, about 7 m across; the lip
 *   of the flare 22.6-22.8 m, about 8.7 m across; railing and masts to 26.8 m.
 * - Photos (evidence):
 *   - Skyler Spaeth, "Robert Mueller Municipal Airport Tower November 2016.png"
 *     and "RMMA Tower Close-up.png", CC BY-SA 4.0 (face-on: base, shaft, flare,
 *     panel grid, cab):
 *     https://commons.wikimedia.org/wiki/File:Robert_Mueller_Municipal_Airport_Tower_November_2016.png
 *     https://commons.wikimedia.org/wiki/File:RMMA_Tower_Close-up.png
 *   - Sunnya343, "Mueller control tower May 2026-1.jpg" and "-2.jpg", CC BY-SA 4.0
 *     (three-quarter views in the park):
 *     https://commons.wikimedia.org/wiki/File:Mueller_control_tower_May_2026-2.jpg
 *   - WhisperToMe, "RMMAControlTowerAustin.JPG", public domain (the tower before
 *     its re-cladding, from the old apron).
 *
 * Numbers
 * - Base 7.45 m tall (photo-scaled: the face-on photo, its 955 px from the
 *   ground to the lip set to the lidar's 22.6 m); the shaft straight to 13 m,
 *   then flaring to 8.7 m across at 22.6 m (photo-scaled, lidar).
 * - The panel grid in groups of two rows (3 m) by five columns a face, pale and
 *   mid blue: mid in alternate columns, alternate bands, as the real panels do;
 *   pale mullion lines between the columns (photo).
 * - Cab: glazing 6.8 m across from 22.6 to 25.0 m, roof slab 7.2 m to 25.5 m: the
 *   lidar's flat top reads 25.7 m, the photos a lower cab; split between them.
 * - Colours from the photos, pulled to the palette: base `trim`; panels
 *   #a9c6d8 and #7aa3c6; the cab tinted glass #6f8796 (`glass-2`) under a `trim` roof slab;
 *   mullions #eef1f2.
 * - Night: nothing glows (the tower is disused; the cab glass stays dark).
 *
 * Doubts
 * - The door in the base (photo) is on a face whose direction is unknown, so it
 *   is not drawn. Railing and masts on the roof are left out.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { face } from './bridge-kit'

const BASE: MaterialSpec = PALETTE.trim
const PALE: MaterialSpec = finish('panel-pale-blue', 0xa9c6d8)
const MID: MaterialSpec = finish('panel-blue', 0x7aa3c6)
const GLASS: MaterialSpec = finish('glass-2', 0x6f8796) // the cab's tinted glazing, dark as in the photos
const MULL: MaterialSpec = finish('mullion-white', 0xeef1f2)

const H0 = 5.7 / 2 // the square's half-width (OSM)
const Z_BASE = 7.45, Z_LIP = 22.6
/** The shaft's half-width at height z: straight to 13 m, then a concave flare to 4.35 m at the lip. */
const half = (z: number) => (z <= 13 ? H0 : H0 + (4.35 - H0) * ((z - 13) / (Z_LIP - 13)) ** 2.2)

/** A square box centred on the axis. */
function sq(p: Part, h: number, z0: number, z1: number, top = true, bottom = false) {
  const c: [number, number][] = [[-h, -h], [h, -h], [h, h], [-h, h]]
  for (let i = 0; i < 4; i++) {
    const [a, b] = [c[i], c[(i + 1) % 4]], n: V3 = [Math.sign(a[1] - b[1] || 0) * 0 + (b[1] - a[1]) / (2 * h), -(b[0] - a[0]) / (2 * h), 0]
    face(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], n)
  }
  if (top) face(p, [-h, -h, z1], [h, -h, z1], [h, h, z1], [-h, h, z1], [0, 0, 1])
  if (bottom) face(p, [-h, -h, z0], [-h, h, z0], [h, h, z0], [h, -h, z0], [0, 0, -1])
}

function build() {
  const mull = new Part(), base = new Part(), pale = new Part(), mid = new Part(), glass = new Part(), roof = new Part()
  sq(base, H0, 0, Z_BASE, false)
  // the shaft: bands of two panel rows, each face five columns, flat between rings
  const rings = [Z_BASE, 10.4, 13, 15.4, 17.6, 19.4, 21.0, Z_LIP]
  const COLS = 5
  // faces: unit outward normal and the along-face direction
  const faces: [[number, number], [number, number]][] = [[[0, -1], [1, 0]], [[1, 0], [0, 1]], [[0, 1], [-1, 0]], [[-1, 0], [0, -1]]]
  for (let k = 0; k + 1 < rings.length; k++) {
    const [za, zb] = [rings[k], rings[k + 1]], [ha, hb] = [half(za), half(zb)]
    for (let f = 0; f < 4; f++) {
      const [[nx, ny], [tx, ty]] = faces[f]
      const pt = (h: number, s: number, z: number): V3 => [nx * h + tx * s * h, ny * h + ty * s * h, z]
      const nz = (hb - ha) / (zb - za), l = Math.hypot(1, nz), n: V3 = [nx / l, ny / l, -nz / l]
      for (let c = 0; c < COLS; c++) {
        const s0 = -1 + (2 * c) / COLS, s1 = -1 + (2 * (c + 1)) / COLS
        const row = Math.floor(k * 1.0)
        const part = c % 2 === 1 && (row + f) % 2 === 0 ? mid : pale
        face(part, pt(ha, s0, za), pt(ha, s1, za), pt(hb, s1, zb), pt(hb, s0, zb), n)
      }
      // pale mullion lines between the columns and at the corners, standing 4 cm proud
      for (let c = 0; c <= COLS; c++) {
        const s = -1 + (2 * c) / COLS, w = c === 0 || c === COLS ? 0.1 : 0.07
        const o = (h: number, ds: number, z: number): V3 => { const q = pt(h, s + ds / h, z); return [q[0] + n[0] * 0.04, q[1] + n[1] * 0.04, q[2] + n[2] * 0.04] }
        face(mull, o(ha, c === COLS ? -w * 2 : -w, za), o(ha, c === 0 ? w * 2 : w, za), o(hb, c === 0 ? w * 2 : w, zb), o(hb, c === COLS ? -w * 2 : -w, zb), n)
      }
    }
  }
  // the lip under the cab, the cab glazing and its roof slab
  const hl = half(Z_LIP)
  sq(base, hl + 0.1, Z_LIP - 0.35, Z_LIP, true, true)
  sq(glass, 3.4, Z_LIP, 25.0, false)
  sq(base, 3.6, 25.0, 25.5, false, true)
  face(roof, [-3.3, -3.3, 25.52], [3.3, -3.3, 25.52], [3.3, 3.3, 25.52], [-3.3, 3.3, 25.52], [0, 0, 1])
  face(base, [-3.6, -3.6, 25.5], [3.6, -3.6, 25.5], [3.6, 3.6, 25.5], [-3.6, 3.6, 25.5], [0, 0, 1])
  return [{ part: base, material: BASE }, { part: pale, material: PALE }, { part: mid, material: MID }, { part: glass, material: GLASS }, { part: mull, material: MULL }, { part: roof, material: PALETTE.roof }]
}

if (import.meta.main) {
  const list = build()
  const tris = list.reduce((n, p) => n + p.part.triangles, 0)
  const glb = writeGlb('Robert Mueller Municipal Airport Control Tower', list, { license: 'CC0-1.0', bearing: 11.3, elevation: 0 })
  console.log(`atx-mueller-control-tower.glb: ${tris} triangles, ${glb.length} bytes; ` + list.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
  if (tris > 5000 || glb.length > 250 * 1024) throw new Error('over budget')
  await Bun.write(new URL('../models/atx-mueller-control-tower.glb', import.meta.url), glb)
}
