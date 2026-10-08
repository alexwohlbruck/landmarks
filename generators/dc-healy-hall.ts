/**
 * Healy Hall, Georgetown University — procedural, CC0-1.0, no textures.
 * bun generators/dc-healy-hall.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0°, the outline's walls
 * running due north–south and east–west. The anchor is the area centroid of
 * the OSM outline way/444583709 (lng -77.0727337, lat 38.9073077).
 *
 * What it is: Smithmeyer and Pelz's Flemish Romanesque hall (1877–79), a
 * long north–south range of four storeys over a raised basement, in dark
 * grey-blue Potomac gneiss banded with light sandstone, under a steep slate
 * roof lined with gabled dormers; a taller pavilion at each end (Gaston Hall
 * to the north, Riggs Library to the south) with its own high hip roof, a
 * cross gable to the east front and corner turrets with slate spires; the
 * square clock tower in the middle of the east front, rising to a tall slate
 * spire 200 ft (61 m) up; and the big square south tower with its arcaded
 * top beside the south pavilion. The clock tower and spire, the pavilions'
 * gables and turrets, and the dark stone against the steep slate are the
 * identity.
 *
 * Covers and replaces: the outline way/444583709, which has no
 * building:parts. Its neighbours (Maguire Hall, Old North, Isaac Hawkins
 * Hall, Ryan Hall) are separate buildings and are not touched.
 *
 * Evidence
 * - OSM (measured): outline 34.6 × 97.6 m. Range 15.4 m deep (x −7.2 to
 *   8.2) between the pavilions; north pavilion 29.1 × 23.7 m (x −16.1 to
 *   13.0, y 19.7 to 43.4) with an east bay out to x 15.1 (y 28.5–37), drawn here as the base of a cross gable spanning 23.5–40, as wide as the gable in the photos; south pavilion
 *   22 × 23.4 m (x −9.8 to 12.3, y −52.5 to −29.1); the clock tower's
 *   projection on the east front at y −5.8 to −1.2, out to x 10.7, which
 *   is the middle of the front between the pavilions. Height 61.
 * - Published (Wikipedia, "Healy Hall"; NHL nomination): built 1877–79,
 *   Smithmeyer and Pelz; designed 312 × 95 ft (95 × 29 m); 200 ft (61 m)
 *   to the top of the clock tower; Riggs Library in the south tower,
 *   Gaston Hall on the north pavilion's upper floors.
 * - Photos (Wikimedia Commons): "Healy Hall façade.jpg" (APK, CC BY-SA
 *   4.0), the east front head on; "Healy Hall, Georgetown University,
 *   Georgetown, Washington, DC (39641791973).jpg" and "(46606951611).jpg"
 *   (Warren LeMay, CC0), the east front from the north-east; "Healy Hall
 *   Georgetown University.jpg" (APK, CC BY-SA 4.0) and "Healy Hall at
 *   Georgetown University.jpg" (Gtownsfs, CC BY-SA 3.0), from the
 *   south-east; "Healy Hall tower.jpg" and "Maguire Hall and Healy
 *   Hall.jpg" (APK, CC BY-SA 4.0), the south tower; "Georgetown
 *   University's Healy Hall from across the Potomac.jpg" (Jeff Vincent, CC
 *   BY 2.0), from the south at a distance; "Georgetown University
 *   (53821005319).jpg" (ajay_suresh, CC BY 2.0).
 * - USGS NAIP orthophoto (public domain): the plan and the slate roofs.
 * - Estimated from the photos (storey counts and the far telephoto view)
 *   against the published 61 m: range eaves 20.5 m and roof to 27 m;
 *   pavilions' eaves 24.5 m and hip roofs to 35.5 m; clock tower 5.6 m
 *   square (the photos show it slimmer than OSM's 4.6 m-wide projection
 *   plus wall), shaft to 45 m, rising about as high above the ridge as the
 *   ridge stands above the ground's eaves line, with the belfry arcade at
 *   32–36.6 m and the clock at 39.4–43.4 m; a slender eight-sided spire
 *   to 59.4 m and finial to 61 m (published 200 ft); turret spires to
 *   38–40.5 m; south tower
 *   9 m square at the pavilion's west side to 34 m, its pyramid to 42 m
 *   and spirelet to 46 m.
 * - Colour: the gneiss is drawn as a blue-grey well lighter than the real
 *   stone, so it sits with the palette, but still darker than the stone of
 *   its neighbours; the sandstone bands are a warm light buff; slate dark.
 * - Simplified: one window panel per bay and storey; the dormers are small
 *   gabled boxes, ten to a side; the porches, carving, corbel tables and
 *   cresting are left out; turrets are square with pyramid spires.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cbox, gable, grow, hip, panel, qf, rect, save, tf, type Rect, type Side } from './dc-white-house'

const gneiss = new Part(), sand = new Part(), slate = new Part(), win = new Part()

// ---- Plan (OSM).
const RANGE = rect(-7.2, 8.2, -29.1, 19.7)
const NPAV = rect(-16.1, 13.0, 19.7, 43.4)
const NBAY = rect(8.0, 15.1, 23.5, 40.0)
const SPAV = rect(-9.8, 12.3, -52.5, -29.1)
const STOWER = rect(-9.8, -0.8, -52.5, -43.5)
const CLOCK = rect(5.1, 10.7, -6.3, -0.7)

// ---- Heights.
const EAVES = 20.5, RIDGE = 27.0
const PAV_EAVES = 24.5, PAV_TOP = 35.5
const FLOORS = [1.2, 5.0, 9.3, 13.4, 17.0] // window sills: basement and four storeys

/** Walls with sandstone string courses at every floor, and a bevelled cornice. */
function walls(r: Rect, top: number) {
  cbox(gneiss, r, 0, top, { top: false })
  for (const z of FLOORS.slice(1)) cbox(sand, grow(r, 0.15), z - 0.6, z - 0.15, { top: false, bottom: true })
  cbox(sand, grow(r, 0.35), top - 0.7, top, { b: 0.25, bottom: true, top: false })
}

/** A row of windows, one per bay and storey, from storey `first`. */
function windows(side: Side, at: number, a0: number, a1: number, pitch: number, first = 0, storeys = 5, w = 1.5) {
  const n = Math.max(1, Math.round((a1 - a0) / pitch)), step = (a1 - a0) / n
  for (let k = 0; k < n; k++) {
    const c = a0 + step * (k + 0.5)
    for (let f = first; f < storeys; f++) {
      const z = FLOORS[f], h = f === 0 ? 1.6 : 2.6
      panel(win, side, at, c - w / 2, c + w / 2, z, z + h)
    }
  }
}

/** A gabled dormer on a roof slope facing `side`, its face on the plane `at`. */
function dormer(side: 'e' | 'w', at: number, y: number, z0: number) {
  const s = side === 'e' ? 1 : -1, w = 1.2, h = 2.2, d = 2.4
  const x0 = at, x1 = at - s * d
  const r = rect(Math.min(x0, x1), Math.max(x0, x1), y - w, y + w)
  cbox(slate, r, z0, z0 + h, { top: false })
  panel(win, side, at, y - 0.55, y + 0.55, z0 + 0.3, z0 + h - 0.2)
  // Its little gable roof, ridge running back into the slope.
  gable(slate, slate, r, z0 + h, z0 + h + 2.0, false, [side === 'w', side === 'e'])
}

// ---- The range: walls, a steep lower slope with dormers, a gentler top.
walls(RANGE, EAVES)
hip(slate, grow(RANGE, 0.3, 0), EAVES, EAVES + 5.2, 3.2, false, 0)
hip(slate, grow(RANGE, -2.9, 0), EAVES + 5.2, RIDGE, 4.6, slate, 0)
windows('e', RANGE.x1, RANGE.y0 + 1, CLOCK.y0 - 0.5, 3.7)
windows('e', RANGE.x1, CLOCK.y1 + 0.5, RANGE.y1 - 1, 3.7)
windows('w', RANGE.x0, RANGE.y0 + 1, RANGE.y1 - 1, 3.7)
for (let k = 0; k < 10; k++) {
  const y = RANGE.y0 + 3 + (k * (RANGE.y1 - RANGE.y0 - 6)) / 9
  if (Math.abs(y - (CLOCK.y0 + CLOCK.y1) / 2) > 4.5) dormer('e', RANGE.x1 - 1.0, y, EAVES + 0.4)
  dormer('w', RANGE.x0 + 1.0, y, EAVES + 0.4)
}
// Chimney stacks on the ridge line.
for (const y of [-20, 12]) cbox(gneiss, rect(-1.5, 1.5, y - 0.9, y + 0.9), RIDGE - 2, RIDGE + 2.6, { top: sand, b: 0.15 })

// ---- Pavilions: taller walls, high hip roofs, an east cross gable each.
function pavilion(r: Rect, gableR: Rect) {
  walls(r, PAV_EAVES)
  const wx = r.x1 - r.x0, wy = r.y1 - r.y0
  hip(slate, grow(r, 0.3), PAV_EAVES, PAV_TOP, wx / 2 - 2.2, slate, wy / 2 - 2.2)
  // The cross gable: a stone gable wall on the east front, its roof running
  // back into the hip.
  walls(gableR, PAV_EAVES)
  gable(slate, gneiss, grow(gableR, 0, 0.2), PAV_EAVES, PAV_EAVES + 11.0, false, [false, true])
  windows('e', gableR.x1, gableR.y0 + 0.8, gableR.y1 - 0.8, 3.0, 0, 5, 1.7)
  // A sandstone cross on the gable's apex.
  const yc = (gableR.y0 + gableR.y1) / 2
  cbox(sand, rect(gableR.x1 - 0.5, gableR.x1, yc - 0.15, yc + 0.15), PAV_EAVES + 11.0, PAV_EAVES + 12.8)
  cbox(sand, rect(gableR.x1 - 0.5, gableR.x1, yc - 0.6, yc + 0.6), PAV_EAVES + 11.9, PAV_EAVES + 12.2)
}
pavilion(NPAV, NBAY)
pavilion(SPAV, rect(5.0, 12.6, -48.5, -33.0))
// Pavilion windows on the other faces: Gaston Hall's tall windows high up.
windows('n', NPAV.y1, NPAV.x0 + 1, NPAV.x1 - 1, 3.6)
windows('w', NPAV.x0, NPAV.y0 + 1, NPAV.y1 - 1, 3.6)
windows('s', SPAV.y0, STOWER.x1 + 0.5, SPAV.x1 - 1, 3.4)
windows('w', SPAV.x0, STOWER.y1 + 0.5, SPAV.y1 - 1, 3.4)
for (const yc of [-31, 26]) cbox(gneiss, rect(-1.0, 1.0, yc - 0.9, yc + 0.9), PAV_TOP - 5, PAV_TOP - 1.5, { top: sand, b: 0.15 })

/** A square corner turret with a slate pyramid spire. */
function turret(x: number, y: number, top: number, spire: number, h = 1.6) {
  const r = rect(x - h, x + h, y - h, y + h)
  cbox(gneiss, r, 0, top, { top: false })
  cbox(sand, grow(r, 0.2), top - 0.5, top, { bottom: true, top: false })
  hip(slate, grow(r, 0.2), top, spire, h + 0.2 - 0.05)
}
turret(NPAV.x1, NPAV.y1, 31.0, 40.5)
turret(NPAV.x1, NPAV.y0 + 1.6, 31.0, 40.5)
turret(NPAV.x0, NPAV.y1, 29.5, 38.0)
turret(SPAV.x1, SPAV.y0, 30.5, 40.0)
turret(SPAV.x1 - 1.0, SPAV.y1 - 1.6, 30.5, 40.0)

// ---- South tower: a big square tower with an arcaded, corbelled top.
{
  const r = STOWER, top = 34.0
  walls(r, 30.0)
  windows('s', r.y0, r.x0 + 1, r.x1 - 1, 3.0, 0, 5, 1.3)
  windows('w', r.x0, r.y0 + 1, r.y1 - 1, 3.0, 0, 5, 1.3)
  const t = grow(r, 0.5)
  cbox(gneiss, t, 30.0, top, { bottom: true, top: false })
  cbox(sand, grow(t, 0.2), top - 0.5, top, { bottom: true, top: false })
  // The arcade: four dark openings to a face.
  const sides: [Side, number, number, number][] = [['s', t.y0, t.x0, t.x1], ['n', t.y1, t.x0, t.x1], ['e', t.x1, t.y0, t.y1], ['w', t.x0, t.y0, t.y1]]
  for (const [side, at, a0, a1] of sides) {
    const step = (a1 - a0) / 4
    for (let k = 0; k < 4; k++) panel(win, side, at, a0 + step * (k + 0.2), a0 + step * (k + 0.8), 30.6, 33.0)
  }
  hip(slate, grow(t, 0.3), top, 42.0, 4.5)
  hip(slate, rect(-5.8, -4.8, -48.5, -47.5), 42.0, 46.0, 0.5)
}

// ---- The clock tower.
{
  const r = CLOCK, SHAFT = 45.0, SPIRE = 59.4
  walls(r, EAVES)
  cbox(gneiss, r, EAVES, SHAFT, { top: false })
  for (const z of [25.0, 31.0, 37.8]) cbox(sand, grow(r, 0.2), z, z + 0.45, { top: false, bottom: true })
  cbox(sand, grow(r, 0.35), SHAFT - 0.6, SHAFT, { b: 0.2, bottom: true, top: slate })
  windows('e', r.x1, r.y0 + 0.5, r.y1 - 0.5, 2.2, 0, 5, 1.4)
  const cx = (r.x0 + r.x1) / 2, cy = (r.y0 + r.y1) / 2, hw = (r.x1 - r.x0) / 2
  const faces: [Side, number, number][] = [['e', r.x1, cy], ['w', r.x0, cy], ['n', r.y1, cx], ['s', r.y0, cx]]
  for (const [side, at, c] of faces) {
    // Belfry: three tall arched openings.
    for (const o of [-1.4, 0, 1.4]) panel(win, side, at, c + o - 0.45, c + o + 0.45, 32.2, 36.6)
    // The clock: a pale square dial in a sandstone frame.
    block(sand, side, at, c - 1.6, c + 1.6, 39.4, 43.4, 0.12)
    panel(slate, side, at + (side === 'e' || side === 'n' ? 0.12 : -0.12), c - 1.25, c + 1.25, 39.8, 43.0, 0.02)
  }
  // Corner pinnacles at the spire's foot.
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const px = cx + sx * (hw - 0.5), py = cy + sy * (hw - 0.5)
    hip(slate, rect(px - 0.55, px + 0.55, py - 0.55, py + 0.55), SHAFT, SHAFT + 4.2, 0.5)
  }
  // Gabled lucarnes on each face of the spire's base.
  for (const [side, at, c] of faces) {
    const n: V3 = side === 'e' ? [1, 0, 0] : side === 'w' ? [-1, 0, 0] : side === 'n' ? [0, 1, 0] : [0, -1, 0]
    const P = (a: number, z: number): V3 => (side === 'e' || side === 'w' ? [at, a, z] : [a, at, z])
    tf(slate, P(c - 1.3, SHAFT), P(c + 1.3, SHAFT), P(c, SHAFT + 4.0), n)
    panel(win, side, at, c - 0.45, c + 0.45, SHAFT + 0.6, SHAFT + 2.2)
  }
  // The spire: an eight-sided slate pyramid.
  const ring = (rr: number, z: number): V3[] => Array.from({ length: 8 }, (_, k) => {
    const a = (Math.PI / 8) * (2 * k + 1)
    return [cx + rr * Math.cos(a), cy + rr * Math.sin(a), z] as V3
  })
  const base = ring(hw * 0.95, SHAFT), mid = ring(hw * 0.52, SHAFT + 4.0), tip = ring(0.1, SPIRE)
  slate.loft([base, mid, tip])
  // Finial and cross.
  cbox(sand, rect(cx - 0.12, cx + 0.12, cy - 0.12, cy + 0.12), SPIRE, 61.0, { top: true })
  cbox(sand, rect(cx - 0.12, cx + 0.12, cy - 0.7, cy + 0.7), 59.6, 59.9)
}

await save('dc-healy-hall', 'Healy Hall', [
  { part: gneiss, material: finish('healy-gneiss', 0x8b9194) },
  { part: sand, material: finish('healy-sandstone', 0xd6c3a0) },
  { part: slate, material: finish('healy-slate', 0x5f666e) },
  { part: win, material: PALETTE.window },
], { bearing: 0, osm: 'way/444583709', footprint: [34.6, 97.6], height: 61 })
