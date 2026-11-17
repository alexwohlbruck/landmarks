/**
 * Renaissance Tower (1974, Hellmuth, Obata + Kassabaum; re-clad and crowned
 * 1986), Dallas — original procedural geometry, CC0-1.0.
 * bun generators/dal-renaissance-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the OSM
 * outline's area centroid, -96.8018350 32.7812967) on the ground. Built in a
 * frame turned to bearing 345.7, the plan's axis (sides at 75.7 and 165.7
 * degrees).
 *
 * Form: a plain square glass shaft, 56.6 m a side. Its silver-blue curtain
 * wall is divided by a pale grid (bays of about 7 m, bands every four
 * storeys) and each face carries two big X's of darker blue glass stacked
 * one over the other, each the full width of the face and half its height:
 * the pattern that names the tower from across downtown, drawn here as bold
 * flat diagonal bands so it survives at phone size. On the flat roof stands
 * the 1986 crown: an equipment deck and penthouse, four short square lattice
 * turrets at the corners and a slender grey steel lattice mast on the
 * penthouse, each capped with a small green pyramid. Lattice is drawn as solid square shafts (STYLE.md: no
 * lattice).
 *
 * Night: the curtain wall is `window` (an office tower, lit). The X bands are
 * an unlit dark finish, so after dark the X's read dark against the lit wall
 * as they read dark against the silver glass by day.
 *
 * Sources
 * - OSM (ODbL): outline way/28182729 (height 270, 56 levels, Q1515605). No
 *   building:parts.
 * - Published: 56 storeys; 216 m (710 ft) to the roof as built in 1974, 270 m
 *   (886 ft) to the top of the spire added in 1986 (Wikipedia, "Renaissance
 *   Tower (Dallas)").
 * - Lidar: USGS 3DEP TX_Pecos_Dallas_B3_2018 has no returns above ~50 m here;
 *   its wall returns roughly match the OSM square (checked by eye).
 * - Photos (evidence):
 *   - "Dallas Renaissance Tower 1", Andreas Praefcke, CC BY 3.0,
 *     https://commons.wikimedia.org/wiki/File:Dallas_Renaissance_Tower_1.jpg
 *   - "Dallas Renaissance Tower, June of 2025", Johnny plane 1, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Dallas_Renaissance_Tower,_June_of_2025.jpg
 *   - "Dallas Elm Place Renaissance Tower", Andreas Praefcke, CC BY 3.0,
 *     https://commons.wikimedia.org/wiki/File:Dallas_Elm_Place_Renaissance_Tower.jpg
 *   - "Dallas West End Station Renaissance Tower", Justin Cozart, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Dallas_West_End_Station_Renaissance_Tower.jpg
 *   - "View of Bank of America Plaza from Reunion Tower August 2015 20",
 *     Michael Barera, CC BY-SA 4.0 (crown from above),
 *     https://commons.wikimedia.org/wiki/File:View_of_Bank_of_America_Plaza_from_Reunion_Tower_August_2015_20.jpg
 * Estimated (from the photos, scaled by the 56.6 m face): the X placement (two
 * X's, crossings at a quarter and three quarters of the height), the grid
 * spacing, the deck (4.5 m) and penthouse (6.5 m), turret (11 m + 4 m cap) and mast
 * sizes: the mast and cap reach about 43 m above the roof in Praefcke's photo, and a thin
 * mast carries it on to the published 270 m.
 * Doubts: the brief says "twin spires"; the photos show one tall central
 * mast and four short corner turrets, which is what is modelled.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capRing, type XY } from './sea-columbia-center'
import { bar, quadOut, slab } from './dal-bank-of-america-plaza'

const BEARING = 345.7
const H = 216, TOP = 270, HALF = 28.3

/** A square frustum (or prism) between z0 and z1, with a cap. */
function frustum(part: Part, cx: number, cy: number, h0: number, h1: number, z0: number, z1: number, cap = true) {
  const r = (h: number, z: number): V3[] => [[cx - h, cy - h, z], [cx + h, cy - h, z], [cx + h, cy + h, z], [cx - h, cy + h, z]]
  const a = r(h0, z0), b = r(h1, z1), C: V3 = [cx, cy, (z0 + z1) / 2]
  for (let k = 0; k < 4; k++) { const l = (k + 1) % 4; quadOut(part, a[k], a[l], b[l], b[k], C) }
  if (cap) capRing(part, b.map((p) => [p[0], p[1]] as XY), z1)
}

/** A square pyramid cap. */
function pyramid(part: Part, cx: number, cy: number, h: number, z0: number, z1: number) {
  const r: V3[] = [[cx - h, cy - h, z0], [cx + h, cy - h, z0], [cx + h, cy + h, z0], [cx - h, cy + h, z0]]
  const apex: V3 = [cx, cy, z1]
  for (let k = 0; k < 4; k++) part.tri(r[k], r[(k + 1) % 4], apex)
}

function build() {
  const wall = new Part(), xband = new Part(), grid = new Part(), roof = new Part(), white = new Part(), caps = new Part()
  const ring: XY[] = [[-HALF, -HALF], [HALF, -HALF], [HALF, HALF], [-HALF, HALF]]
  slab(wall, roof, ring, 0, H)

  // Each face, in its own coordinates: s along the face (0..W, left to right
  // seen from outside), z up; `at` places a point proud of the face.
  const W = 2 * HALF
  const faces = ring.map((a, i) => {
    const b = ring[(i + 1) % 4], t: XY = [(b[0] - a[0]) / W, (b[1] - a[1]) / W], n: XY = [t[1], -t[0]]
    return (s: number, z: number, proud: number): V3 => [a[0] + t[0] * s + n[0] * proud, a[1] + t[1] * s + n[1] * proud, z]
  })
  const out: V3 = [0, 0, H / 2]
  const inset = 0.6
  for (const at of faces) {
    // the X's: each diagonal is a band from one side of a half-face to the
    // other, cut square at the face's edges so nothing passes a corner.
    const hv = 10.5 // vertical thickness of a band at the face edge
    for (const [zt, zb] of [[H - 2, H / 2], [H / 2, 2]]) {
      const lo = (zb), hi = (zt)
      // down-right diagonal: high at left, low at right
      quadOut(xband, at(inset, hi - hv, 0.03), at(W - inset, lo, 0.03), at(W - inset, lo + hv, 0.03), at(inset, hi, 0.03), out)
      // down-left diagonal, a hair further out where the two cross
      quadOut(xband, at(inset, lo, 0.035), at(W - inset, hi - hv, 0.035), at(W - inset, hi, 0.035), at(inset, lo + hv, 0.035), out)
    }
    // the pale grid: eight bays, bands every four storeys (3.86 m)
    const bays = 8, t = 0.5
    for (let k = 1; k < bays; k++) {
      const s = (k * W) / bays
      quadOut(grid, at(s - t / 2, 0, 0.06), at(s + t / 2, 0, 0.06), at(s + t / 2, H, 0.06), at(s - t / 2, H, 0.06), out)
    }
    for (let z = 4 * 3.86; z < H - 2; z += 4 * 3.86)
      quadOut(grid, at(inset, z - t / 2, 0.065), at(W - inset, z - t / 2, 0.065), at(W - inset, z + t / 2, 0.065), at(inset, z + t / 2, 0.065), out)
    // a pale cap band at the roof line
    quadOut(grid, at(0, H - 1.6, 0.065), at(W, H - 1.6, 0.065), at(W, H, 0.065), at(0, H, 0.065), out)
  }

  // The crown: equipment deck, four corner turrets, central mast.
  frustum(roof, 0, 0, HALF - 3.5, HALF - 3.5, H, H + 4.5)
  frustum(roof, 0, 0, 7, 7, H + 4.5, H + 11)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const cx = sx * (HALF - 3.6), cy = sy * (HALF - 3.6)
    frustum(white, cx, cy, 2.6, 2.6, H, H + 11, false)
    frustum(caps, cx, cy, 3.0, 3.0, H + 11, H + 11.6, false)
    pyramid(caps, cx, cy, 3.0, H + 11.6, H + 15)
  }
  // mast to H + 37, cap to H + 43 (photo-scaled), a thin mast to the
  // published 270 m
  // a slender tapered steel mast on the penthouse (a lattice in reality)
  frustum(white, 0, 0, 2.8, 1.5, H + 11, H + 37, false)
  frustum(caps, 0, 0, 2.2, 2.2, H + 37, H + 37.6, false)
  pyramid(caps, 0, 0, 2.2, H + 37.6, H + 43)
  bar(white, [0, 0, H + 42], [0, 0, TOP], 0.5)

  const live = [
    { part: wall, material: { ...PALETTE.window, color: 0x7391b3 } },
    { part: xband, material: finish('renaissance-x-glass', 0x3f5b8c, 0.35) },
    { part: grid, material: finish('renaissance-mullion', 0xc9d4de) },
    { part: roof, material: PALETTE.roof },
    { part: white, material: finish('renaissance-steel', 0x8a9097) },
    { part: caps, material: PALETTE.patina },
  ]
  return { live }
}

if (import.meta.main) {
  const { finishGlb } = await import('./sea-columbia-center')
  const { live } = build()
  const { glb, triangles } = finishGlb('dal-renaissance-tower', 'Renaissance Tower', live, { bearing: BEARING, height: TOP, replaces: ['way/28182729'] })
  const out = process.argv[2] ?? new URL('../models/dal-renaissance-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
