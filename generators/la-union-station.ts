/**
 * Los Angeles Union Station (headhouse) — procedural, CC0-1.0, no textures.
 *
 *   bun generators/la-union-station.ts
 *
 * Frame: x toward the tracks (east, 100°), y along Alameda Street (10°), z
 * up, metres; placed at bearing 10°, the grid of the OSM outline. The
 * origin is the area centroid of the OSM outline (relation/1483140), which
 * takes in the 1939 headhouse, the later concourse building to its east
 * and a parking lot; only the headhouse is modelled, so the geometry sits
 * west of the origin. The concourse building is its own OSM way
 * (way/428849449) and keeps drawing.
 *
 * Masses (Mission Revival / Streamline, 1939, Parkinson & Parkinson):
 * - the entrance block on Alameda: a white stucco gable front with the
 *   great round-arched portal in a brown surround;
 * - the clock tower beside it to the south (lidar 39.1 m; published 125 ft);
 * - the ticket concourse running north, its Alameda front carrying three
 *   tall arched windows in brown surrounds;
 * - the waiting room running east from the entrance to the concourse;
 * - lower ranges round the south patio, the Fred Harvey restaurant range at
 *   the south end, and the north range; red clay tile roofs throughout.
 * Platforms, canopies and the separately mapped arcade roofs are left out.
 *
 * Evidence
 * - OSM relation/1483140 outline, transformed to this frame; every block
 *   below follows its edges. OSM building=roof arcades (way/1409126574,
 *   /1409126586, /1409126588) are not modelled.
 * - LA County LARIAC 2020 lidar footprint 489984842857: 39.08 m top (the
 *   tower). 3DEP bare earth: 85.5–86.9 m across the headhouse, flat.
 * - USGS NAIP ortho, rotated into this frame: tile roof plan, ridges, the
 *   skylights over the ticket concourse and waiting room, the patios, the
 *   tower's lantern.
 * - Photos (Wikimedia Commons):
 *   - "20140830 50 Los Angeles Union Station (15360153108).jpg", David
 *     Wilson, CC BY 2.0 — Alameda front from the south-west: tower,
 *     entrance gable, ticket concourse arches. Heights scaled from the tower.
 *   - "EXTERIOR OF THE LOS ANGELES UNION PASSENGER TERMINAL ... NARA
 *     555964.jpg", Charles O'Rear, public domain — entrance front head-on:
 *     portal and window arch sizes, gable pitch.
 *   - "Exterior of Los Angeles Union Station.JPG", ZhengZhou, CC BY-SA 3.0
 *     — the front from across Alameda: three arches, gable, tower.
 *   - "Los Angeles Union Station, front entrance.jpg", CC BY-SA 3.0 —
 *     entrance and tower from the north-west.
 *   - "Union Station near Christmas - Los Angeles - CA.jpg", Adam Jones,
 *     CC BY 2.0 — the lantern and clock.
 *
 * Measured: plan (OSM), tower top (lidar), flat ground (3DEP). Estimated
 * from photos, scaled against the lidar tower in two views (tower top about
 * twice the entrance gable): entrance eave 16.6 m / ridge 19.5 m, ticket
 * concourse eave 15.2 m, tower shaft 32 m and lantern, arch sizes. Estimated without a
 * photo: waiting room 15.5 m, the lower ranges 6.5–10 m, window counts on
 * the patio and south sides.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, archPanel, bays, hipRoof, panel, prism, rect, save } from './la-city-hall'

// OSM outline centroid in the rotated frame; everything is drawn in that
// frame and shifted by it.
const O: XY = [7.97, 3.01]
const R = (x0: number, y0: number, x1: number, y1: number) => rect(x0 - O[0], y0 - O[1], x1 - O[0], y1 - O[1])
const P = (x: number, y: number): XY => [x - O[0], y - O[1]]

const stone = new Part(), tile = new Part(), win = new Part(), door = new Part(), shade = new Part(), flat = new Part()

/** A stucco block with a tile roof (hip by default) from its eave. */
function block(x0: number, y0: number, x1: number, y1: number, eave: number, rise: number, hips: [boolean, boolean] = [true, true]) {
  const r = R(x0, y0, x1, y1)
  prism(stone, null, r, 0, eave, { bevel: 0.01, corner: 0.3 })
  hipRoof(tile, r, eave, rise, { hips, gable: stone })
}

// --- Entrance block: gable to Alameda, ridge running east.
block(-77.2, -11.9, -42, 8.6, 16.6, 2.9, [false, true])
// --- Waiting room, east of it.
block(-42, -15.75, 9.5, 11.75, 14.2, 2.8, [true, true])
// --- Ticket concourse, north along Alameda; its south end meets the entrance block.
block(-73, 8.6, -42, 53.2, 15.2, 1.9, [true, true])
// --- North range.
block(-65.8, 53.2, -50.5, 83, 9, 3)
// --- South of the entrance, between the tower and the patio.
block(-66.7, -22.3, -34.5, -11.9, 12, 3)
// --- Patio arcades: north side and east side.
block(-34.5, -22.2, 2.2, -15.75, 6.5, 2)
block(2.2, -47.4, 10.4, -15.75, 6.5, 2)
// --- South range and the Fred Harvey range at the south end.
block(-41, -60.5, 10.4, -47.4, 8, 3)
block(-69, -80, -41, -45.5, 9.5, 3.5)
prism(stone, flat, R(-69, -97.8, -41, -80), 0, 7, { bevel: 0.3 })
// Alameda arcade stub south of the patio opening.
block(-76.6, -56, -69, -45.8, 6.5, 2)

// --- Clock tower.
{
  const cx = -71.95, cy = -17.15, h = 5.25
  prism(stone, null, R(cx - h, cy - h, cx + h, cy + h), 0, 32, { bevel: 0.01, corner: 0.35 })
  prism(stone, stone, R(cx - h - 0.2, cy - h - 0.2, cx + h + 0.2, cy + h + 0.2), 32, 33, { bevel: 0.35, corner: 0.35 })
  const l = 3.7
  prism(stone, null, R(cx - l, cy - l, cx + l, cy + l), 33, 37.3, { bevel: 0.01, corner: 0.3 })
  // Low tile pyramid with a small flat top, eaves just past the lantern.
  hipRoof(tile, R(cx - l - 0.25, cy - l - 0.25, cx + l + 0.25, cy + l + 0.25), 37.3, 1.8)
  // Clock faces on all four sides, and a belfry opening in each lantern face.
  const faces: [XY, XY][] = [
    [P(cx - h, cy + h), P(cx - h, cy - h)], // west
    [P(cx - h, cy - h), P(cx + h, cy - h)], // south
    [P(cx + h, cy - h), P(cx + h, cy + h)], // east
    [P(cx + h, cy + h), P(cx - h, cy + h)], // north
  ]
  for (const [a, b] of faces) {
    const c = h, r = 2.0, z = 26.2, seg = 14
    for (let k = 0; k < seg; k++) {
      const t0 = (k / seg) * 2 * Math.PI, t1 = ((k + 1) / seg) * 2 * Math.PI
      const at = (s: number, zz: number): [number, number, number] => {
        const L = 2 * h, u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
        return [a[0] + u[0] * s + u[1] * 0.06, a[1] + u[1] * s - u[0] * 0.06, zz]
      }
      win.tri(at(c, z), at(c + r * Math.cos(t0), z + r * Math.sin(t0)), at(c + r * Math.cos(t1), z + r * Math.sin(t1)))
    }
  }
  const lf: [XY, XY][] = [
    [P(cx - l, cy + l), P(cx - l, cy - l)],
    [P(cx - l, cy - l), P(cx + l, cy - l)],
    [P(cx + l, cy - l), P(cx + l, cy + l)],
    [P(cx + l, cy + l), P(cx - l, cy + l)],
  ]
  for (const [a, b] of lf) panel(shade, a, b, l - 1.3, l + 1.3, 33.8, 36.6)
}

// --- Alameda front details.
{
  // Portal: brown surround, then the glazed arch inside it.
  const a = P(-77.2, 8.6), b = P(-77.2, -11.9), s = 10.25
  archPanel(tile, a, b, s - 4.6, s + 4.6, 0, 15.4, 0.05, 10)
  archPanel(win, a, b, s - 3.5, s + 3.5, 0, 14.3, 0.1, 10)
  // Doors at the foot of the recess.
  panel(door, a, b, s - 2.6, s + 2.6, 0, 3.4, 0.14)
  // Ticket concourse: three tall arched windows in brown surrounds.
  const c0 = P(-73, 53.2), c1 = P(-73, 8.6)
  for (const y of [15.4, 29.1, 42.8]) {
    const sc = 53.2 - y
    archPanel(tile, c0, c1, sc - 3.6, sc + 3.6, 2.4, 13.4, 0.05, 10)
    archPanel(win, c0, c1, sc - 3.0, sc + 3.0, 3.0, 12.8, 0.1, 10)
  }
  // North range and Harvey range fronts: plain windows, one per opening.
  bays(win, P(-65.8, 83), P(-65.8, 53.2), { n: 5, margin: 2, fill: 0.4, rows: [[2.6, 5.4]] })
  bays(win, P(-69, -45.5), P(-69, -80), { n: 6, margin: 2, fill: 0.4, rows: [[2.6, 5.6]] })
  // Gable-end windows on the north range.
  bays(win, P(-50.5, 83), P(-65.8, 83), { n: 2, margin: 3, fill: 0.4, rows: [[2.6, 5.4]] })
}

// --- Waiting room: tall arched clerestory windows on both long sides.
bays(win, P(9.5, 11.75), P(-42, 11.75), { n: 5, margin: 4, fill: 0.42, arch: true, rows: [[4.5, 12.6]] })
bays(win, P(-34.5, -15.75), P(9.5, -15.75), { n: 4, margin: 3, fill: 0.42, arch: true, rows: [[8.8, 13.4]] })

// --- Patio arcades: open round arches facing the south patio.
bays(shade, P(-34.5, -22.2), P(2.2, -22.2), { n: 8, margin: 0.8, fill: 0.72, arch: true, rows: [[0, 4.6]] })
bays(shade, P(2.2, -22.2), P(2.2, -47.4), { n: 6, margin: 0.8, fill: 0.72, arch: true, rows: [[0, 4.6]] })

save('la-union-station', 'Los Angeles Union Station', [
  { part: stone, material: PALETTE.trim }, // near-white stucco
  { part: tile, material: PALETTE.terracotta },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
  { part: shade, material: finish('arcade-shade', 0x8f857b) },
  { part: flat, material: PALETTE.roof },
], { bearing: 10, anchor: [34.0560743, -118.2357992], height: 39.1, osm: 'relation/1483140' })
