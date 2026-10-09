/**
 * Carnegie Hall, 881 Seventh Avenue — procedural, CC0-1.0, no textures.
 * bun generators/nyc-carnegie-hall.ts
 *
 * Map frame: x = model east (towards Sixth Avenue), y = model north (West
 * 57th Street), z up, metres. Placed at bearing 29°, the Manhattan grid.
 * Anchor: area centroid of the OSM outline way/265148502.
 *
 * Identifying features (from the photos):
 * 1. A salmon-brown brick and terracotta Renaissance Revival block with heavy
 *    bracketed cornices: the hall itself, its main cornice at ~31 m, and an
 *    attic storey of round-arched windows in threes between pilasters under
 *    a second cornice at 40 m.
 * 2. Rows of round-arched windows on every front, and the 57th Street
 *    entrance: an arcade of five arches under a long marquee.
 * 3. The two studio towers that rise behind the hall: the taller one at the
 *    east end of the 57th Street front, and the block on 56th Street, both
 *    with an arcaded top storey under a projecting cornice.
 * 4. The long Seventh Avenue side: few windows, blind arches, a row of
 *    arched windows high up.
 * 5. Flat grey roofs.
 *
 * Evidence
 * - OSM way/265148502 (outline, 46 × 61 m; height 55.2) and way/1039811293
 *   (a duplicate building way over the same footprint, height 0).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), resampled in the model frame
 *   (/tmp/city/nyc/work/nyc-carnegie-hall/rot.png), above the street at
 *   19.2 m NAVD88: the hall's roof 40–42 m over x −22…10, y −13…30; the
 *   57th Street studio tower 66–70 m at the north-east corner, the strip
 *   behind it along the east side 62–64 m; the 56th Street block 60–64 m,
 *   stepping down to 45 m at the Seventh Avenue end. East of x ≈ 20 the
 *   lidar is Carnegie Hall Tower (231 m), which the outline overlaps by a
 *   few metres; the model stops at x = 20.
 * - Published: William Burnet Tuthill, 1891; studio towers added 1894–97;
 *   Roman brick with terracotta trim, Italian Renaissance Revival
 *   (Wikipedia; NRHP 66000535).
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-carnegie-hall/photos/credits.txt: the 57th Street
 *   and Seventh Avenue fronts from the north-west corner (Ajay Suresh, CC BY
 *   2.0), the same corner (Yair Haklai, CC BY-SA 3.0; Tdorante10, CC BY-SA
 *   4.0, at dusk), Seventh Avenue from the south-west (Kidfly182, CC BY-SA
 *   4.0), the 57th Street front from the east (Epicgenius, CC BY-SA 4.0).
 *
 * Estimated: the storey divisions within the lidar's cornice and roof
 * heights (photos scaled to the 40 m roof), window counts and sizes, the
 * studio towers' plans (from the lidar), their window rhythm. The Seventh
 * Avenue fire-escape balcony and the carved friezes are left out. No
 * licensed photo of the 56th Street or east sides was found; they carry the
 * same storey rhythm as the fronts.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, massing, type XY } from './nyc-570-lexington'
import { rectPanel, archPanel, wallFrame } from './nyc-city-hall'

const brick = new Part(), trim = new Part(), win = new Part(), roof = new Part(), door = new Part()

// Plan, from the lidar and the outline (model frame).
const W = -22, E = 10, N = 30, S = -13 // the hall
const TE = 20 // east edge of the studio strip
const SS = -31 // 56th Street front
const HALL = 40, MAIN = 31.5, TOWER = 69, STRIP = 63, SOUTH = 61.5, SLOW = 45

massing({
  wall: brick, win: null, roof, coping: trim, facade: null, bevel: 0.4,
  boxes: [
    [W, S, E, N, HALL],
    [E, 18, TE, N, TOWER], // the 57th Street studio tower
    [E, S, TE, 18, STRIP],
    [E - 2, SS, TE - 4, S, SOUTH], // 56th Street block, east part
    [-14, SS, E - 2, S, SOUTH],
    [W, SS, -14, -20, SOUTH],
    [W, -20, -14, S, SLOW],
  ],
})

/** A box on a wall a→b: along s0..s1, out from the face d0..d1, z0..z1. */
function onWall(p: Part, a: XY, b: XY, s0: number, s1: number, d0: number, d1: number, z0: number, z1: number) {
  const f = wallFrame(a, b, 0)
  const r: V3[] = [f.at(s0, z0, d1), f.at(s1, z0, d1), f.at(s1, z0, d0), f.at(s0, z0, d0)]
  const t = r.map(([x, y]) => [x, y, z1] as V3)
  p.loft([r, t]); p.cap(t, true); p.cap(r, false)
}
/** A projecting cornice band all along a wall a→b, mitred out at both ends. */
function cornice(p: Part, a: XY, b: XY, z0: number, z1: number, d: number, ext0 = d, ext1 = d) {
  const L = wallFrame(a, b).L
  onWall(p, a, b, -ext0, L + ext1, -0.05, d, z0, z1)
}

type Face = { a: XY; b: XY }
// Counter-clockwise ring order, so each wall faces out.
const north: Face = { a: [E, N], b: [W, N] } // 57th Street, the hall's front
const west: Face = { a: [W, N], b: [W, SS] } // Seventh Avenue
const southF: Face = { a: [W, SS], b: [TE - 4, SS] } // 56th Street
const eastHall: Face = { a: [TE, S], b: [TE, N] }

// --- The hall's elevations ---
// Storeys: rusticated base 0–8.5, arched windows 8.5–21, frieze 21–23.5,
// paired arched windows 23.5–30, main cornice 30–31.5, attic 31.5–38.6,
// top cornice to 40.
function hallFace(f: Face, s0: number, s1: number, front: boolean) {
  const { a, b } = f
  onWall(brick, a, b, s0, s1, -0.05, 0.35, 0, 8.5) // the base, a little proud
  cornice(trim, a, b, 8.5, 9.1, 0.5, 0, 0)
  cornice(trim, a, b, 21.0, 23.4, 0.35, 0, 0) // frieze
  cornice(trim, a, b, 29.8, MAIN, 1.2, 0, 0) // main cornice
  cornice(trim, a, b, 38.6, HALL, 0.9, 0, 0) // top cornice
  const L = s1 - s0
  // Attic: groups of three arched windows between pilasters.
  const groups = Math.max(2, Math.round(L / 10))
  const gw = L / groups
  for (let g = 0; g < groups; g++) {
    const c = s0 + gw * (g + 0.5)
    for (const k of [-1, 0, 1]) archPanel(win, a, b, c + k * 2.2, 1.7, 32.6, 37.6)
    onWall(trim, a, b, s0 + gw * g - 0.45, s0 + gw * g + 0.45, -0.05, 0.3, MAIN, 38.6) // pilaster
  }
  onWall(trim, a, b, s1 - 0.45, s1, -0.05, 0.3, MAIN, 38.6)
  // Paired arched windows under the main cornice.
  const bays = Math.max(3, Math.round(L / 4.6))
  const bw = L / bays
  for (let k = 0; k < bays; k++) {
    const c = s0 + bw * (k + 0.5)
    archPanel(win, a, b, c - 0.75, 1.1, 25.0, 28.6)
    archPanel(win, a, b, c + 0.75, 1.1, 25.0, 28.6)
  }
  if (front) {
    // 57th Street: five tall arched windows over the entrance arcade,
    // single arched windows either side.
    const mid = s0 + L / 2
    for (const k of [-2, -1, 0, 1, 2]) {
      archPanel(win, a, b, mid + k * 4.2, 2.6, 11.0, 19.6)
      archPanel(door, a, b, mid + k * 4.2, 3.2, 0.4, 7.6, 0.4) // the entrance arcade
    }
    for (const sg of [-1, 1]) {
      archPanel(win, a, b, mid + sg * 13.0, 1.8, 12.0, 18.6)
      archPanel(win, a, b, mid + sg * 13.0, 1.6, 2.5, 6.6, 0.4)
    }
    // The marquee over the arcade.
    onWall(trim, a, b, mid - 11, mid + 11, 0.35, 2.4, 3.6, 4.2)
  } else {
    // Seventh Avenue and the sides: blind walls below, a row of arched
    // windows in the upper half of the arched zone, small round-headed
    // doors at the base.
    const n = Math.max(3, Math.round(L / 4.2))
    const w = L / n
    for (let k = 0; k < n; k++) {
      const c = s0 + w * (k + 0.5)
      archPanel(win, a, b, c, 1.7, 14.6, 19.4)
    }
    for (const t of [0.3, 0.7]) archPanel(door, a, b, s0 + L * t, 2.2, 0.4, 5.2, 0.4)
  }
}
const lenOf = (f: Face) => wallFrame(f.a, f.b).L
hallFace(north, 0, lenOf(north), true)
hallFace(west, 0, N - S, false) // the hall's part of Seventh Avenue

// --- Studio towers: brick walls with windows in two-storey groups, an
// arcaded top storey and a heavy cornice ---
function studioFace(f: Face, s0: number, s1: number, z0: number, top: number) {
  const { a, b } = f, L = s1 - s0
  const n = Math.max(1, Math.round(L / 4.2)), w = L / n
  // Window groups from z0 to the arcade.
  const arc0 = top - 6.2
  for (let z = z0 + 1.2; z + 5 <= arc0 - 0.6; z += 6.6) {
    for (let k = 0; k < n; k++) rectPanel(win, a, b, s0 + w * (k + 0.5), w * 0.5, z, z + 4.9)
  }
  // The arcaded top storey: small round arches, two per bay.
  for (let k = 0; k < n * 2; k++) archPanel(win, a, b, s0 + (w / 2) * (k + 0.5), w * 0.3, arc0 + 0.6, top - 2.2)
  cornice(trim, a, b, arc0 - 0.6, arc0, 0.4, 0, 0)
  cornice(trim, a, b, top - 1.6, top, 1.1, 0, 0)
}
// 57th Street tower: its north, west (above the hall) and east faces.
studioFace({ a: [TE, N], b: [E, N] }, 0, TE - E, 1, TOWER)
studioFace({ a: [E, N], b: [E, 18] }, 0, N - 18, HALL, TOWER)
studioFace({ a: [TE, 18], b: [TE, N] }, 0, N - 18, 1, TOWER)
studioFace({ a: [E, 18], b: [TE, 18] }, 0, TE - E, STRIP, TOWER)
// The strip behind, along the east side.
studioFace({ a: [E, 18], b: [E, S] }, 0, 18 - S, HALL, STRIP)
studioFace({ a: [TE, S], b: [TE, 18] }, 0, 18 - S, 1, STRIP)
// 56th Street block.
studioFace(southF, 0, lenOf(southF), 1, SOUTH)
studioFace({ a: [W, -20], b: [W, SS] }, 0, 11, SLOW, SOUTH)
studioFace({ a: [-14, S], b: [W, S] }, 0, 8, HALL, SOUTH) // over the hall roof, facing north
studioFace({ a: [E - 2, S], b: [-14, S] }, 0, E - 2 + 14, HALL, SOUTH)
studioFace({ a: [W, S], b: [W, -20] }, 0, 7, 9.1, SLOW)
// The 56th block's east end, above the strip's roof.
studioFace({ a: [TE - 4, SS], b: [TE - 4, S] }, 0, S - SS, 1, SOUTH)
// The south block's ground storey: brick base and cornice like the hall's.
onWall(brick, southF.a, southF.b, 0, lenOf(southF), -0.05, 0.35, 0, 8.5)
onWall(brick, west.a, west.b, N - S, lenOf(west), -0.05, 0.35, 0, 8.5)
cornice(trim, [W, S], [W, SS], 8.5, 9.1, 0.5, 0, 0)
void eastHall

finishModel('Carnegie Hall', 'nyc-carnegie-hall', [
  { part: brick, material: finish('carnegie-brick', 0xd6a385) },
  { part: trim, material: finish('carnegie-terracotta', 0xe2b89a) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: door, material: PALETTE.entrance },
], { bearing: 29, osm: 'way/265148502', height: TOWER })
