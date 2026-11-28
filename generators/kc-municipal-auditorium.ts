/**
 * Municipal Auditorium (1935, Gentry, Voskamp & Neville with Hoit, Price &
 * Barnes), 301 West 13th Street, Kansas City, Missouri — original
 * procedural geometry, CC0-1.0.
 * bun generators/kc-municipal-auditorium.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of OSM way/38501327, -94.5863852 39.0980232.
 * Its walls run at 2.2° (the downtown grid): bearing 2.2. Elevation 0.
 *
 * Identity, in order: one huge pale limestone block filling the block
 * between 13th and 14th; the sheer north front on 13th Street with its three
 * sculpted medallions high up, fluted pilaster strips and the long marquee
 * canopies over the doors; the stepped attic over the front; the shallow
 * segmental vault of the arena roof behind it; the lower wings along the
 * east and west sides; tall window bays on the long sides.
 *
 * Evidence
 * - OSM way/38501327 (height 32, 8 levels, Q14704450); no building:parts.
 * - USGS 3DEP lidar MO_FEMANRCS_1_2020 (2020 flight), 1 m, read in this
 *   frame; the cloud sits ~1 m west and ~2.5 m south of the OSM outline,
 *   shifted back. Heights above y = 0 (lowest ground under the footprint,
 *   the south-east corner, ~268.2 m NAVD88 from the map's terrain; lidar -
 *   2.2; 13th Street on the north is ~8 m higher, 14th ~2-4), measured: the
 *   main block 32; side wings 15 (west) and 17 (east); over the north
 *   third the attic steps 35, 39, and a fly tower 43 east of the middle;
 *   a flat roof 40 over the south and middle; the arena vault from 41 at
 *   its springing (x ±39) to 46 at the crown, over y -48..12.
 * - Photos: "KCMO Auditorium and ConventionCenter.jpg" (public domain,
 *   Commons; from the north, high: the front, the medallions, the attic
 *   and the vault behind, the marquees); "Kc-memorial-auditorium.jpg"
 *   (CC BY-SA 2.5, Commons, author not given; the north front from the
 *   north-west in daylight: colour, medallions ~5 m across at ~2/3 height,
 *   the fluted strips, the canopies); "Municipal Auditorium - Kansas City,
 *   Missouri.jpg" (Noah Bohland, CC BY-SA 4.0; night, from the north-west:
 *   the floodlit front, the stepped attic, the west wing's windows).
 * - Estimated: window bays of the long sides (no close photo of them; the
 *   aerial shows tall openings between piers); the canopies' depth (~3 m);
 *   the attic's step widths, from the lidar.
 * - Doubts: no daylight photo of the east, west or south faces; the lidar's
 *   attic is not symmetric (the 43 m block east of centre), kept as read.
 *
 * Colours: the limestone reads warm grey-buff in daylight (#cfc4b1), pulled
 * to the palette's lightness; medallions and pilaster strips `trim`; roofs
 * `roof`; canopies metal. Night: the north front and the attic are
 * floodlit (`_FLOODLIGHT`).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, circle, panel, rect, save, shift, walls, type XY } from './chi-aon-center'
import { columns, spread } from './kc-city-hall'
import { groups } from './kc-power-and-light-building'

function build() {
  const stone = new Part(), roof = new Part(), win = new Part(), trim = new Part(), metal = new Part(), door = new Part()
  const N = 64.0, S = -62.8, W = -44.0, E = 43.0

  // --- masses
  block(stone, roof, rect(W, S, E, N), 0, 32, 0.5)
  block(stone, roof, rect(-51.0, -56.0, W, 25.6), 0, 15, 0.35)
  block(stone, roof, rect(E, -55.7, 49.3, 34.7), 0, 17, 0.35)
  // the middle and south: a flat roof at 40
  block(stone, roof, rect(-36, S + 1.5, 33, 30.5), 32, 40, 0.4)
  // the arena vault: a shallow segment from x -39 to 37, crown 46
  {
    const x0 = -39, x1 = 37, zs = 40.6, rise = 5.4, y0 = -47.5, y1 = 12.5, n = 12
    const prof: XY[] = Array.from({ length: n + 1 }, (_, i) => {
      const t = i / n, x = x0 + (x1 - x0) * t
      return [x, zs + rise * Math.sin(Math.PI * t)] as XY
    })
    // side walls under the springing, beyond the flat roof
    walls(stone, rect(x0, y0, x1, y1), 32, zs)
    for (let i = 0; i < n; i++) {
      const [xa, za] = prof[i], [xb, zb] = prof[i + 1]
      roof.quad([xa, y0, za], [xb, y0, zb], [xb, y1, zb], [xa, y1, za])
      // gable ends (segment caps)
      stone.tri([xa, y0, za], [(x0 + x1) / 2, y0, zs], [xb, y0, zb])
      stone.tri([xb, y1, zb], [(x0 + x1) / 2, y1, zs], [xa, y1, za])
    }
    void cap
  }
  // the north third: the stepped attic over the front, the fly tower
  const yA = 32.5
  block(stone, roof, rect(-37, yA, 34, N - 1.2), 32, 35, 0.35)
  block(stone, roof, rect(-26, yA + 1, 26, N - 2.4), 35, 39, 0.35)
  block(stone, roof, rect(3, yA + 2, 26, N - 3.6), 39, 43, 0.35)
  // the attic's stepped profile toward the front: three ribs per step, as in the photos
  for (const [x0, x1, z0, z1, d] of [[-37, 34, 32, 35, 0.6], [-26, 26, 35, 39, 0.6]] as [number, number, number, number, number][]) {
    for (let k = 0; k < Math.floor((x1 - x0) / 3.2); k++) {
      const x = x0 + 1.6 + k * 3.2
      block(stone, null, rect(x - 0.55, N - 1.2 - (z0 === 32 ? 0 : 1.2) - d, x + 0.55, N - 1.2 - (z0 === 32 ? 0 : 1.2)), z0, z1 + 0.5, 0.15)
    }
  }

  // --- the north front: medallions, fluted strips, marquees and doors
  const nA: XY = [E, N], nB: XY = [W, N], L = E - W
  const sx = (x: number) => E - x // s along the north face for an x
  for (const x of [-12, 0, 12]) {
    const disc = shift(circle(0, 0, 2.6, 16), 0, 0)
    // a flush round panel in the wall plane (x along the face, z up)
    for (let i = 0; i < disc.length; i++) {
      const j = (i + 1) % disc.length
      const P = (q: XY): V3 => [x - q[0], N + 0.12, 25.5 + q[1]]
      trim.tri(P([0, 0]), P(disc[i]), P(disc[j]))
    }
  }
  for (const [x0, x1] of [[-33, -27.5], [27.5, 33]] as [number, number][]) {
    for (let k = 0; k < 4; k++) {
      const a = x0 + k * (x1 - x0) / 4
      panel(trim, nA, nB, sx(a + (x1 - x0) / 4 - 0.25), sx(a + 0.25), 15, 29.4, 0.1)
    }
  }
  panel(trim, nA, nB, 3, L - 3, 30.2, 31.2, 0.06) // the cornice band
  // marquee canopies on posts-free brackets: two long slabs, doors under them
  for (const [x0, x1] of [[-38, -14], [-6, 30]] as [number, number][]) {
    block(metal, metal, rect(x0, N, x1, N + 3.2), 13.0, 14.2, 0.15)
    columns(door, nA, nB, spread(sx(x1) + 1, sx(x0) - 1, Math.round((x1 - x0) / 4.2), 2.6), [[8.0, 12.6]])
    panel(win, nA, nB, sx(x1) + 0.5, sx(x0) - 0.5, 14.4, 15.6, 0.06) // the canopy's sign band
  }

  // --- the long sides: tall window bays in two-storey groups between piers
  for (const [a, b, n] of [[[E, S], [E, N], 16], [[W, N], [W, S], 16]] as [XY, XY, number][]) {
    const Ls = Math.hypot(b[0] - a[0], b[1] - a[1])
    columns(win, a, b, spread(6, Ls - 6, n, 2.6), groups(18.5, 30, 3.8, 1, 1.0))
  }
  for (const [a, b, n] of [[[49.3, -55.7], [49.3, 34.7], 18], [[-51.0, 25.6], [-51.0, -56.0], 16]] as [XY, XY, number][]) {
    const Ls = Math.hypot(b[0] - a[0], b[1] - a[1])
    columns(win, a, b, spread(2, Ls - 2, n, 2.0), [[8.6, 13.2]])
  }
  // the west wing's north end (night photo) and the south front
  columns(win, [W, 25.6], [-51.0, 25.6], [[2.3, 4.7]], [[8.6, 13.2]])
  columns(win, [W, S], [E, S], spread(8, L - 8, 14, 2.4), groups(4, 28, 4, 2, 1.2))

  // Night: the north front and the attic are floodlit; the rest stays dark.
  const lit = (p: V3, n: V3) => {
    if (n[1] > 0.5 && p[1] > 60) return 0.9
    if (p[2] > 32.5 && p[1] > 30) return n[2] > 0.7 ? 0.25 : 0.7
    return 0
  }
  return [
    { part: stone, material: { ...finish('kcma-limestone', 0xdcd2c0), floodlight: lit } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: trim, material: finish('kcma-limestone-pale', 0xe9e0cf) },
    { part: metal, material: finish('metal-marquee', 0xb8bcbf, 0.6) },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('kc-municipal-auditorium', 'Municipal Auditorium', [39.0980232, -94.5863852], 2.2, build(), 6500)
