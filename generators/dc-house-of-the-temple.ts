/**
 * House of the Temple (Scottish Rite, Southern Jurisdiction) — procedural,
 * CC0-1.0, no textures. bun generators/dc-house-of-the-temple.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0°, the 16th Street
 * front facing due west. The anchor is the area centroid of the OSM outline
 * way/67086344 (lng -77.0358382, lat 38.9137036). y = 0 is 16th Street at
 * the foot of the grand stair, the lowest ground the building touches.
 *
 * What it is: John Russell Pope's temple (1911–15) after the Mausoleum of
 * Halicarnassus, in pale limestone. The identifying features: a square
 * temple on a high podium, ringed by tall Ionic columns standing proud of a
 * shaded cella wall; a deep entablature and a set-back attic; the stepped
 * pyramid on top with its skylight; the grand stair rising from 16th Street
 * between two sphinxes on their pedestals; the plain podium wings either
 * side of the stair; and the half-round apse on the rear (east).
 *
 * Covers and replaces: way/67086344 (the outline). No parts inside it.
 * The stair and the sphinxes stand outside the outline, in front of it, as
 * they do on the map.
 *
 * Evidence
 * - OSM (measured): the podium's outline, 45.4 × 45.2 m with the stair's
 *   recess on the west (x -26.7…-20, y -10.8…12.2) and the rear half-round
 *   (radius about 15 m round (13.5, -0.3)).
 * - USGS NAIP orthophoto (public domain): the temple block, about 32 m
 *   square at its cornice, centred at x -4; the stepped pyramid's base
 *   24.5 m across and its flat top 8.5 m with the skylight in it; the apse drum, about 9.5 m in
 *   radius, against the temple's east side; the podium's flat pale roofs.
 * - Published: 33 Ionic columns, each 33 ft (10 m) tall; the stair's
 *   flights of 3, 5, 7 and 9 steps (Scottish Rite; widely published).
 * - Photos (Wikimedia Commons): "House of the Temple by Carol M.
 *   Highsmith.tiff" (public domain, head on from 16th Street, corrected
 *   verticals): ten columns across the front at 3.2 m centres, the
 *   entablature 3.6 m deep, the attic 1.8 m, the podium wall about 7.9 m
 *   above the door sill; "House of the Temple - Dupont Circle.JPG", "House
 *   of the Temple - southwest corner.JPG", "House of the Temple rear
 *   view.JPG" (APK, CC BY-SA 3.0): the stair and sphinxes, the side
 *   colonnade, the apse with its engaged columns; "House of the Temple -
 *   Washington DC.jpg" (Michiel1972, CC BY-SA 3.0, from the south-west).
 * - Estimated: the stair's rise (24 steps, 3.6 m); podium roof 10.5 m and
 *   the stylobate 11.6 m above the street; the pyramid's 13 steps of
 *   0.46 m (to 33.2 m), which no photo shows square on; the apse to 20.5 m;
 *   the sphinxes as simple blocks.
 * - Doubt: the published 33 columns. Ten to a side all round, less the rear
 *   ones behind the apse, gives 30; the photos show the front's ten and
 *   the side colonnades, not how the rear row meets the apse.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, cap, lathe, orient, save, slab, walls } from './dc-nmaahc'
import { band, bayCentres, edgePanel, edges, onEdge, type Edge } from './dc-old-post-office'

const sq = (cx: number, cy: number, h: number): XY[] => [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]]
const box = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const lenOf = (e: Edge) => Math.hypot(e[1][0] - e[0][0], e[1][1] - e[0][1])

function build() {
  const stone = new Part(), shade = new Part(), pyr = new Part(), win = new Part(), glass = new Part(), door = new Part()

  const CX = -4.0 // the temple's centre line
  const SILL = 3.6, PODIUM = 10.5, STYLO = 11.6
  const COL_TOP = 21.6, ENT = 25.2, ATTIC = 27.2
  const STEPS = 13, RISE = 0.46, RUN = 0.6

  // ---- The podium: the OSM outline.
  const O: XY[] = [
    [18.5, -22.5], [-26.7, -22.4], [-26.7, -10.8], [-20.0, -10.8], [-20.0, 12.2], [-26.7, 12.2], [-26.7, 22.7],
    [18.7, 22.6], [18.7, 14.6], [23.2, 11.6], [25.7, 8.7], [27.4, 5.2], [28.2, -0.5], [27.6, -4.3], [26.1, -7.9],
    [23.8, -10.9], [20.8, -13.4], [20.8, -18.0], [18.5, -18.0],
  ]
  slab(stone, O, 0, PODIUM, 0.3)
  band(stone, O, PODIUM - 0.9, PODIUM - 0.3, 0.35, 0.15)
  // Windows: a few tall grilled ones on each straight side; the door at
  // the head of the stair.
  for (const e of edges(O)) {
    const l = lenOf(e), m = onEdge(e, l / 2, 0, 0)
    if (l < 10) continue
    if (Math.abs(m[0] + 20) < 0.1) { // the stair's wall: the bronze door
      edgePanel(door, e, l / 2 - 1.4, l / 2 + 1.4, SILL, SILL + 4.6)
      continue
    }
    for (const c of bayCentres(2.5, l - 2.5, 7.5)) edgePanel(win, e, c - 0.9, c + 0.9, 4.2, 7.6)
  }

  // ---- The grand stair from 16th Street up to the door, between cheek
  // walls, and the two sphinxes on their pedestals.
  {
    const x0 = -33.5, x1 = -20.0, n = 12, w = 9.8
    for (let k = 0; k < n; k++) {
      const xs = x0 + ((x1 - x0) * k) / n
      slab(stone, box(xs, x1, -w, w), (SILL * k) / n, (SILL * (k + 1)) / n, 0, true)
    }
    for (const s of [-1, 1]) {
      slab(stone, box(x0, -26.7, s < 0 ? -w - 2.6 : w, s < 0 ? -w : w + 2.6), 0, 1.6, 0.15)
      // Pedestal and sphinx, couchant, facing the street.
      const y = s * (w + 1.3)
      slab(stone, box(-31.0, -27.0, y - 1.3, y + 1.3), 1.6, 3.4, 0.15)
      slab(stone, box(-30.6, -27.6, y - 0.75, y + 0.75), 3.4, 4.5, 0.2) // the body
      slab(stone, box(-31.0, -29.6, y - 0.8, y + 0.8), 3.4, 5.6, 0.2) // breast and head
    }
  }

  // ---- The temple: stylobate, cella, columns, entablature, attic.
  slab(stone, sq(CX, 0, 16.2), PODIUM, STYLO - 0.5, 0.2)
  slab(stone, sq(CX, 0, 15.8), STYLO - 0.5, STYLO, 0.15)
  const cella = sq(CX, 0, 12.0)
  walls(shade, cella, STYLO, COL_TOP)
  for (const e of edges(cella)) {
    const l = lenOf(e)
    for (const c of [l / 2 - 3.2, l / 2, l / 2 + 3.2]) edgePanel(win, e, c - 0.9, c + 0.9, STYLO + 1.0, COL_TOP - 1.6)
  }
  const P = 3.2, H = 14.4
  for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) {
    if (i > 0 && i < 9 && j > 0 && j < 9) continue // the ring only
    const x = CX - H + i * P, y = -H + j * P
    if (i === 9 && Math.abs(y) < 9.6) continue // behind the apse
    lathe(stone, x, y, [[0.68, STYLO], [0.54, STYLO + 0.4], [0.48, COL_TOP - 0.7], [0.72, COL_TOP]], 8, false)
  }
  slab(stone, sq(CX, 0, 15.6), COL_TOP, ENT - 0.9, 0, true, true)
  band(stone, sq(CX, 0, 15.6), ENT - 0.9, ENT, 0.5, 0.25)
  slab(stone, sq(CX, 0, 12.4), ENT, ATTIC - 0.5, 0, false)
  band(stone, sq(CX, 0, 12.4), ATTIC - 0.5, ATTIC, 0.35, 0.15)
  // Acroteria on the entablature's corners.
  for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    slab(stone, sq(CX + dx * 14.6, dy * 14.6, 0.7), ENT, ENT + 1.7, 0.2)
  }

  // ---- The stepped pyramid and its skylight.
  for (let k = 0; k < STEPS; k++) {
    const h = 12.0 - k * RUN, z0 = ATTIC + k * RISE
    slab(pyr, sq(CX, 0, h), z0, z0 + RISE, 0, false)
    const inner = h - RUN, z = z0 + RISE
    const o = sq(CX, 0, h), n = sq(CX, 0, inner)
    for (let a = 0; a < 4; a++) {
      const b = (a + 1) % 4
      orient(pyr, [[...o[a], z], [...o[b], z], [...n[b], z], [...n[a], z]] as V3[], [0, 0, 1])
    }
  }
  const topH = 12.0 - STEPS * RUN, topZ = ATTIC + STEPS * RISE
  cap(pyr, sq(CX, 0, topH), topZ)
  cap(glass, sq(CX, 0, topH - 1.6), topZ + 0.03) // the skylight, inside a stone kerb

  // ---- The apse: a half-round drum against the temple's east side, with
  // engaged columns, tall windows and a stepped top.
  {
    const ax = CX + 15.6, R = 9.5, n = 12
    const arc: XY[] = Array.from({ length: n + 1 }, (_, k) => {
      const t = -Math.PI / 2 + (Math.PI * k) / n
      return [ax + R * Math.cos(t), R * Math.sin(t)] as XY
    })
    slab(stone, arc, PODIUM, 20.5, 0.3)
    slab(stone, arc.map(([x, y]) => [ax + (x - ax) * 0.8, y * 0.8] as XY), 20.5, 22.0, 0.3)
    for (let k = 0; k < n; k++) {
      const e: Edge = [arc[k], arc[k + 1]]
      if (k % 2 === 1) edgePanel(win, e, 0.6, lenOf(e) - 0.6, 13.0, 17.5)
    }
    for (let k = 1; k < 6; k++) {
      const t = -Math.PI / 2 + (Math.PI * k) / 6
      lathe(stone, ax + (R + 0.15) * Math.cos(t), (R + 0.15) * Math.sin(t), [[0.5, PODIUM + 0.6], [0.42, 19.6], [0.55, 20.3]], 6, false)
    }
  }

  return [
    { part: stone, material: finish('temple-limestone', 0xece2d2) },
    { part: shade, material: finish('temple-cella', 0xc8b9a3) },
    { part: pyr, material: finish('temple-pyramid', 0xc8c2b8) },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) {
  await save('dc-house-of-the-temple', 'House of the Temple', build(), {
    bearing: 0, osm: 'way/67086344', footprint: [61.7, 45.2], height: 33.2,
  }, 6500)
}
