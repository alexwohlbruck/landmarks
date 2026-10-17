/**
 * Camp North End: Building 3, the Army Quartermaster warehouse on Woodward
 * Avenue — procedural, CC0-1.0.
 * bun generators/clt-cne-building-3.ts
 *
 * The northernmost of the Quartermaster Corps' 1941–43 warehouses, Building
 * No. 3 in the depot's numbering, between Hercules South
 * (`clt-cne-hercules-south.ts`) and Woodward Avenue. One storey, 367 × 58 m
 * (1,200 × 180 ft), steel-framed, its brick now mostly covered in metal
 * siding; a low-pitched dark roof cut into five by firewalls, with one long
 * raised monitor along its ridge, east to west. The working south face has
 * concrete loading platforms under a canopy the full length, facing the Big
 * Roof and Hercules South across the old rail yard; the west end on
 * Statesville Avenue has a row of truck doors under a metal canopy; low
 * annexes stand along the north side.
 *
 * Identity: the long, low, dark-roofed shed with its single ridge monitor
 * running end to end, paired with Hercules South's red-ribbed white roof.
 *
 * Evidence:
 *  - OSM: the outline way/494906712 (height 8) and its parts
 *    way/835823918 and way/835823920 (the roof's two halves, 7.2),
 *    way/835823919 (the monitor, 10.1, gabled), way/835823921–835823926
 *    (north annexes, 6).
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m (measured, NAVD88):
 *    ground 220.4–220.6 at the west end (the lowest; y = 0 is 220.5), 220.8
 *    on the south, 221.5–221.7 at the east end; eaves 228.5 (8.0 m), the
 *    roof rising to 229.0 (8.5 m) at the monitor; the monitor
 *    y −10.4…9.3, its top 231.5 at the edges to 231.8 on the ridge
 *    (11.0–11.3 m); the south canopy 227.0 (6.5 m) over a platform at 222.0
 *    (1.5 m); the west canopy 227.1 (6.6 m); a lean-to at the east end
 *    225.1–225.8 (4.9 m); the north annexes 226.2 (5.7 m).
 *  - Charlotte-Mecklenburg Historic Landmarks Commission survey and research
 *    report (2017,
 *    landmarkscommission.org/wp-content/uploads/2017/06/Ford-Motor-Co-Plant-SR.pdf),
 *    Building No. 3 (published): 180 × 1,200 ft, "about 27 feet high, with
 *    an east-west running monitor roof that raises its height about 7
 *    additional feet", "in early photographs appears to be brick
 *    faced—today aluminum or vinyl siding covers much of the building's
 *    exterior"; the south face "contains concrete loading platforms
 *    sheltered by broad eaves that run the full length of the building",
 *    with many of the original loading doors; and "the western face ... is
 *    plain, but is characterized by 8 bays of overhead tractor-trailer
 *    loading doors, which are shaded by a rectangular metal canopy" (the
 *    report heads that sentence "Building No. 1", but it sits in the
 *    Building No. 3 section and Building No. 1's west face is the Ford
 *    front, so it is read as this building's).
 *  - Mecklenburg County tax parcel 07903101 (CAMP LANDOWNER LP): built 1943,
 *    modular metal and face brick.
 *  - USGS NAIP orthophoto (public domain): the dark charcoal roof, the
 *    monitor's edges, four transverse firewalls dividing the roof into five
 *    equal lengths (about 73 m), a sliver of pale grey-blue siding on the
 *    west wall.
 *
 * No licensed photo of the building was found (Commons, Openverse,
 * Mapillary — Mapillary has no imagery on Woodward or Statesville Avenue
 * here). So:
 *  - the siding colour is the NAIP sliver, estimated; the roof's charcoal is
 *    from NAIP, pulled light;
 *  - the monitor's glazing (a clerestory band on both long faces) is
 *    assumed, as is its grouping;
 *  - door positions (south one per 12.2 m, west eight) are spaced evenly:
 *    the survey gives the west count only;
 *  - the firewalls' height (0.6 m over the roof) is estimated from their
 *    NAIP shadows.
 *
 * Doubt: Joyfield Rise, 141 apartments on 5.3 acres "at the intersection of
 * Woodward and Statesville Avenues", broke ground in August 2026 (Standard
 * Communities); its site may take the west end of this building. Check
 * OSM and current aerials before release.
 *
 * Frame: the Ford plant's grid, as in `clt-cne-hercules-south.ts`;
 * placement bearing 6.3. The origin is the outline's centroid,
 * lng −80.8333358, lat 35.2488851.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { box, quad, tri } from './clt-cne-ford-plant'
import { DARK_ROOF, block, canopy, onWall, write, type Built } from './clt-cne-hercules-south'

const SIDING = finish('cne-siding', 0xccd3d6)

/** Lidar levels above y = 0 (220.5 m NAVD88). */
const EAVE = 8.0, SHOULDER = 8.5, MON = 11.0, RIDGE = 11.3, DOCK = 1.5
const X0 = -184.85, X1 = 182.6, Y0 = -30.3, Y1 = 27.0
const MY0 = -10.4, MY1 = 9.3
const FIREWALLS = [-105.4, -32.0, 41.4, 114.8]

export function buildBuilding3(): Built {
  const wall = new Part(), trim = new Part(), win = new Part(), roof = new Part(), grey = new Part(), door = roof

  // Walls to the eaves, with a pale fascia band at the top.
  const ring: [number, number][] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
  ring.forEach((A, k) => {
    const B = ring[(k + 1) % 4], f = onWall(A, B)
    quad(wall, f.P(0, 0, 0), f.P(f.L, 0, 0), f.P(f.L, EAVE - 0.5, 0), f.P(0, EAVE - 0.5, 0), f.N)
    quad(trim, f.P(-0.3, EAVE - 0.5, 0.3), f.P(f.L + 0.3, EAVE - 0.5, 0.3), f.P(f.L + 0.3, EAVE, 0.3), f.P(-0.3, EAVE, 0.3), f.N)
    quad(trim, f.P(0, EAVE - 0.5, 0), f.P(f.L, EAVE - 0.5, 0), f.P(f.L + 0.3, EAVE - 0.5, 0.3), f.P(-0.3, EAVE - 0.5, 0.3), [0, 0, -1])
  })
  // The low-pitched roof: from the eaves up to the monitor's shoulders, and
  // the gable-end triangles of that rise.
  const o = 0.3
  quad(roof, [X0 - o, Y0 - o, EAVE], [X1 + o, Y0 - o, EAVE], [X1 + o, MY0, SHOULDER], [X0 - o, MY0, SHOULDER])
  quad(roof, [X1 + o, Y1 + o, EAVE], [X0 - o, Y1 + o, EAVE], [X0 - o, MY1, SHOULDER], [X1 + o, MY1, SHOULDER])
  for (const [x, s] of [[X0 - o, -1], [X1 + o, 1]] as [number, number][]) {
    quad(trim, [x, Y0 - o, EAVE], [x, MY0, SHOULDER], [x, MY1, SHOULDER], [x, Y1 + o, EAVE], [s, 0, 0])
  }

  // The monitor along the ridge: its long faces glazed in a clerestory band
  // between siding piers, a slight gable over it.
  const mx0 = X0 + 1.0, mx1 = X1 - 1.0
  for (const [A, B] of [[[mx0, MY0], [mx1, MY0]], [[mx1, MY1], [mx0, MY1]]] as [number, number][][]) {
    const f = onWall(A as [number, number], B as [number, number])
    quad(wall, f.P(0, SHOULDER - 0.2, 0), f.P(f.L, SHOULDER - 0.2, 0), f.P(f.L, MON, 0), f.P(0, MON, 0), f.N)
    const n = 30, g = 1.2, pw = (f.L - g * (n + 1)) / n
    for (let k = 0; k < n; k++) f.panel(win, g + k * (pw + g), g + k * (pw + g) + pw, SHOULDER + 0.35, MON - 0.4)
  }
  for (const [x, s] of [[mx0, -1], [mx1, 1]] as [number, number][]) {
    quad(wall, [x, MY0, SHOULDER - 0.2], [x, MY1, SHOULDER - 0.2], [x, MY1, MON], [x, MY0, MON], [s, 0, 0])
    tri(trim, [x - s * 0.3, MY0 - 0.3, MON], [x - s * 0.3, MY1 + 0.3, MON], [x - s * 0.3, (MY0 + MY1) / 2, RIDGE], [s, 0, 0])
  }
  const mc = (MY0 + MY1) / 2
  quad(roof, [mx0 - 0.3, MY0 - 0.4, MON], [mx1 + 0.3, MY0 - 0.4, MON], [mx1 + 0.3, mc, RIDGE], [mx0 - 0.3, mc, RIDGE])
  quad(roof, [mx1 + 0.3, MY1 + 0.4, MON], [mx0 - 0.3, MY1 + 0.4, MON], [mx0 - 0.3, mc, RIDGE], [mx1 + 0.3, mc, RIDGE])

  // Firewalls across the roof: low parapets rising 0.6 m over its surface.
  const zr = (y: number) => (y <= MY0 ? EAVE + ((y - Y0) / (MY0 - Y0)) * (SHOULDER - EAVE) : y >= MY1 ? EAVE + ((Y1 - y) / (Y1 - MY1)) * (SHOULDER - EAVE) : RIDGE)
  for (const x of FIREWALLS) {
    for (const [ya, yb] of [[Y0, MY0], [MY1, Y1]]) {
      const za = zr(ya) + 0.6, zb = zr(yb) + 0.6
      quad(grey, [x - 0.3, ya, za - 0.8], [x - 0.3, yb, zb - 0.8], [x - 0.3, yb, zb], [x - 0.3, ya, za], [-1, 0, 0])
      quad(grey, [x + 0.3, yb, zb - 0.8], [x + 0.3, ya, za - 0.8], [x + 0.3, ya, za], [x + 0.3, yb, zb], [1, 0, 0])
      quad(grey, [x - 0.3, ya, za], [x - 0.3, yb, zb], [x + 0.3, yb, zb], [x + 0.3, ya, za], [0, 0, 1])
    }
  }

  // South: the loading platform and its canopy the full length, a door per bay.
  box(trim, X0 + 0.5, X1 - 0.5, Y0 - 3.7, Y0, 0, DOCK, trim)
  canopy(grey, grey, X0, X1, Y0 - 2.6, Y0, 6.5, null)
  {
    const f = onWall([X0, Y0], [X1, Y0])
    for (let a = 6.1; a < f.L - 3; a += 12.2) f.panel(door, a - 1.8, a + 1.8, DOCK, DOCK + 3.4)
  }
  // West end on Statesville Avenue: eight truck doors under a metal canopy.
  canopy(grey, grey, X0 - 2.2, X0, -26.5, 23.5, 6.6, null)
  {
    const f = onWall([X0, Y1], [X0, Y0]), w = f.L / 8
    for (let k = 0; k < 8; k++) f.panel(door, (k + 0.5) * w - 1.6, (k + 0.5) * w + 1.6, 0.9, 4.6)
  }
  // East end: a lean-to on its south half.
  box(grey, X1, X1 + 7.0, -28.2, -11.0, 4.5, 4.9, grey)
  for (const y of [-27.8, -19.6, -11.4]) box(grey, X1 + 6.6, X1 + 6.9, y - 0.15, y + 0.15, 0, 4.5, null)

  // North annexes (OSM parts), clad like the shed, flat-roofed.
  const ANNEX: [number, number, number][] = [[-111.9, -78.4, 35.0], [-46.7, -12.9, 31.2], [16.2, 68.1, 35.2], [71.5, 96.5, 31.1], [109.5, 116.7, 31.7], [149.9, 166.2, 35.2]]
  for (const [ax0, ax1, ay1] of ANNEX)
    block({ wall, coping: trim, deck: roof }, [[ax0, Y1], [ax1, Y1], [ax1, ay1], [ax0, ay1]], 0, 5.7, 0.3, [0])

  return {
    id: 'clt-cne-building-3', name: 'Building 3, Camp North End', height: RIDGE, bearing: 6.3,
    parts: [
      { part: wall, material: SIDING },
      { part: trim, material: PALETTE.trim },
      { part: win, material: PALETTE.window },
      { part: roof, material: DARK_ROOF },
      { part: grey, material: PALETTE.roof },
    ],
  }
}

if (import.meta.main) await write(buildBuilding3())
