/**
 * Brew House, Anheuser-Busch Brewery, Ninth and Pestalozzi Sts, St. Louis
 * (1891–1892; E. Jungenfeld & Co.; part of the brewery's National Historic
 * Landmark) — original procedural geometry, CC0-1.0.
 * bun generators/stl-brew-house.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 21, the building's own axis (OSM's walls run at
 * 21°): +y is the Pestalozzi St front with "BREW HOUSE" over its door, the
 * clock tower at its east corner. Anchor = the centroid of OSM
 * way/106705081, -90.2125379, 38.5973339.
 *
 * Identity (from the photos below):
 *  1. The square clock tower on the corner: tall arched windows up its
 *     shaft, a corbelled balcony gallery, the clock stage with a clock on
 *     each face, a crenellated top with corner turrets.          (p1, p2)
 *  2. A red brick Romanesque block of six storeys: a rusticated stone base
 *     with big round arches, tiers of round-arched windows grouped in
 *     bays, corbel tables, and stepped, crenellated parapets; a turret with
 *     a stepped gable ("1892") at the front's other corner.       (p1, p2)
 *
 * Note on the brief: it describes a pointed tower roof. The tower in both
 * photos (1890s and HABS) ends in a crenellated parapet with corner
 * turrets; the lidar's top returns agree (flat at 46–48 with peaks to 55
 * at the merlons and flagpole). The model follows them.
 *
 * Plan: OSM way/106705081 (the Brew House alone; the brewery's other
 * buildings and relation/7111849 are separate and not replaced) turned to
 * bearing 21: 25.6 x 48.4 m.
 *
 * Heights: USGS 3DEP lidar (IL_HicksDome_FluorsparDist_3_2019, flown 2019,
 * class 18 kept), 0.5 m grid; y = 0 is the lowest ground, on the east (the
 * west is 2–3 m up). Measured: the block's parapets 35–36, its raised
 * middle 38–40, the tower's roof 47–48 inside its parapet, the corner
 * turrets' peaks 54–55. Estimated from p1 (HABS, the front 25.6 m wide): the tower's 1.3 m
 * projection, the base (to
 * 6.5) and its arches, the window tiers, the tower's balcony (38.5) and
 * clock stage (39–48.5, scaled to the photo's proportions), the clocks (3.2 m across), the front turret (to 40).
 * Left out: the eagle relief, the lettering, the iron finials, the flagpole.
 *
 * Night: the clock faces glow (window material); the windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  p1  "Anheuser-Busch Brewery, Broadway & Pestalozzi, Saint Louis (St. Louis City County, Missouri)",
 *      Piaget - van Ravenswaay (HABS), public domain (the front and the tower)
 *  p2  "Anheuser Busch Brewery Brew House and Boiler House, Ninth and Pestalozzi Streets", public domain (c. 1900)
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { archShape, box, cornice, onWall, rectShape, save, type XY } from './atl-tech-tower'
import { discShape } from './stl-cathedral-basilica'

const brick = new Part(), stone = new Part(), win = new Part(), roof = new Part(), clock = new Part()
const X0 = -12.3, X1 = 13.3, Y0 = -25.1, Y1 = 23.3, TOP = 35.5, BASE = 6.5
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** Crenellations: merlons along the edges of a rectangle at z, h tall. */
function merlons(x0: number, x1: number, y0: number, y1: number, z: number, h = 1.4, step = 2.4) {
  for (const [a, b] of [[[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.floor(L / step)), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    for (let k = 0; k < n; k++) {
      const s = (k + 0.5) * (L / n), c: XY = [a[0] + t[0] * s, a[1] + t[1] * s]
      box(brick, c[0] - 0.55, c[0] + 0.55, c[1] - 0.55, c[1] + 0.55, z, z + h, brick, 0)
    }
  }
}

// ── The block ──
box(stone, X0, X1, Y0, Y1, 0, BASE, null, 0)
box(brick, X0, X1, Y0, Y1, BASE, TOP, roof, 0)
cornice(brick, rect(X0, X1, Y0, Y1), TOP - 1.6, 0.8, 0.45, null) // the corbel table
box(brick, -6.0, 4.0, -18.0, 21.0, TOP, 39.0, roof, 0.2) // the raised middle
merlons(X0, X1, Y0, Y1, TOP, 1.4, 2.6)
// windows: round-arched, grouped in bays, in tiers; big arches in the stone base
const faces: [XY, XY][] = [[[X0, Y0], [X1, Y0]], [[X1, Y0], [X1, Y1]], [[X1, Y1], [X0, Y1]], [[X0, Y1], [X0, Y0]]]
for (const [a, b] of faces) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nb = Math.round(L / 5.4), w = L / nb
  for (let k = 0; k < nb; k++) {
    const c = (k + 0.5) * w
    // keep the tower's corner (x > 5, y > 15) for the tower's own windows
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], p: XY = [a[0] + t[0] * c, a[1] + t[1] * c]
    if (p[0] > 4.8 && p[1] > 14.8) continue
    onWall(win, a, b, archShape(c, 3.2, 0.8, 4.4, 8), 0.06) // the base's arches
    // a pair of round-arched windows a bay, grouped two storeys a panel
    for (const [z0, zs] of [[8.2, 13.6], [16.0, 21.4], [23.8, 29.2]]) onWall(win, a, b, archShape(c, 3.0, z0, zs, 8), 0.06)
    onWall(win, a, b, rectShape(c - 1.5, c + 1.5, 31.2, 33.0), 0.06) // the top storey's band
  }
}
// the turret with the stepped gable at the front's west corner
box(brick, X0 - 0.3, X0 + 4.6, Y1 - 4.6, Y1 + 0.3, BASE, 38.0, null, 0)
for (const [k, z] of [[0, 38.0], [1, 39.2], [2, 40.4]] as [number, number][]) box(brick, X0 - 0.3 + k * 1.2, X0 + 4.6 - k * 1.2, Y1 - 0.5, Y1 + 0.3, z, z + 1.2, brick, 0)

// ── The clock tower at the front's east corner ──
const TX0 = 5.0, TX1 = 14.6, TY0 = 14.7, TY1 = 24.6, BAL = 38.5, CTOP = 48.5 // the tower stands 1.3 m proud on both street faces (p1)
box(brick, TX0, TX1, TY0, TY1, BASE, BAL, null, 0)
box(stone, TX0 - 1.2, TX1 + 1.2, TY0 - 1.2, TY1 + 1.2, BAL - 0.4, BAL + 0.8, stone, 0.1) // the corbelled balcony
box(brick, TX0 + 0.3, TX1 - 0.3, TY0 + 0.3, TY1 - 0.3, BAL + 0.6, CTOP, roof, 0)
cornice(brick, rect(TX0 + 0.3, TX1 - 0.3, TY0 + 0.3, TY1 - 0.3), CTOP - 1.0, 0.7, 0.35, null)
merlons(TX0 + 0.3, TX1 - 0.3, TY0 + 0.3, TY1 - 0.3, CTOP, 2.4, 2.0)
for (const [x, y] of [[TX0 + 0.3, TY0 + 0.3], [TX1 - 0.3, TY0 + 0.3], [TX1 - 0.3, TY1 - 0.3], [TX0 + 0.3, TY1 - 0.3]]) box(brick, x - 1.0, x + 1.0, y - 1.0, y + 1.0, CTOP - 2, CTOP + 5.5, brick, 0) // corner turrets (lidar peaks ~54–55)
for (const [a, b] of [[[TX0, TY1], [TX0, TY0]], [[TX1, TY0], [TX1, TY1]], [[TX1, TY1], [TX0, TY1]], [[TX0, TY0], [TX1, TY0]]] as [XY, XY][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  for (const z of [9.0, 17.0, 25.0, 32.0]) for (const d of [-1.7, 1.7]) onWall(win, a, b, archShape(L / 2 + d, 1.3, z, z + 5.0, 6), 0.06)
  onWall(clock, a, b, discShape(L / 2, 43.6, 1.8, 16), 0.38) // the clock faces
  onWall(stone, a, b, discShape(L / 2, 43.6, 2.05, 16), 0.34)
  for (const d of [-2.6, 2.6]) onWall(win, a, b, archShape(L / 2 + d, 0.9, 40.6, 45.0, 6), 0.34)
}

const lit = (p: V3, n: V3) => (p[2] > BAL && n[2] < 0.5 ? 0.6 : 0)
await save('stl-brew-house', 'Anheuser-Busch Brew House', [
  { part: brick, material: { ...finish('stl-brewhouse-brick', 0xb46d58), floodlight: lit } },
  { part: stone, material: finish('stl-brewhouse-stone', 0xd8cbb5) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: clock, material: windowVariant(2, 0xe9e2cf) },
], { height: CTOP + 5.5, anchor: [38.5973339, -90.2125379], bearing: 21 })
