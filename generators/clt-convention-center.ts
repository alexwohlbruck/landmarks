/**
 * Charlotte Convention Center (501 S College St, opened 1995, Thompson,
 * Ventulett, Stainback & Associates; expanded 2021) — original procedural
 * geometry, CC0-1.0.
 * bun generators/clt-convention-center.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/239813217,
 * 35.2221174, -80.8453989. Its walls run at 50° / 140°, so the catalog
 * bearing is 50: model +y points up College Street (NE, toward MLK Blvd),
 * +x toward Brevard Street; College is the -x face, Stonewall St (now
 * Brooklyn Village Ave) the -y face.
 *
 * Identity, in order: a very large, low, cream precast block filling the
 * whole block between College and Brevard; the glazed barrel-vault
 * concourses that cross it (College to Brevard) and run up beside the LYNX
 * tracks to MLK, meeting at a glass-domed rotunda over a raised hub; arched
 * glass entrances at the vault ends under bold curved white hoods between
 * precast pylons; the 2021 rounded glass corner at College/Stonewall and the
 * bridge over Stonewall to the Westin.
 *
 * Evidence:
 *  - plan: OSM outline way/239813217 and its 55 building:parts (way/
 *    1352238822-884) plus the hub relation/18569997; USGS NAIP orthophoto
 *    (tools/usgs.py naip, fetched Oct 2026) for the vaults, rotunda, roof
 *    ridges and the Stonewall bridge, which OSM does not map.
 *  - heights: lidar USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17),
 *    1 m grid. Base = ground_min + 4.7 m (the Stonewall/Brevard corner, the
 *    lowest ground under the footprint); ground rises ~9.5 m to MLK and ~7 m
 *    to College (plane fit, used only to start facade detail above grade).
 *    Measured above base: hall roof 19.7, College wall 22.4, cross ridges
 *    22.2-23, clerestory band 25.2, trench vent towers 28.1, concourse eaves
 *    ~23 under 25.6-26 crowns, hub 30.3, rotunda dome 39.2, spine 21 under
 *    ~24, ballroom 19.7 / 24.2 / 25.8 cross, MLK portal 21.3, court canopy
 *    11. OSM part heights agree with these within ~1 m.
 *  - 2021 work (after the flight): the Stonewall-side meeting rooms take
 *    OSM's heights (19-23 m; the 2016 lidar shows ~11 m there); the rounded
 *    corner follows OSM's arc (fitted: centre -110.5/-72.5, radius 20 m, a
 *    quarter circle), glass from the plinth to 20.2 m under a 1.6 m cornice,
 *    in two-storey bands, height and teal-green glass (window-2 #55807c)
 *    from Mapillary 2022 image 180334787811096; the
 *    bridge's position and width (7 m) are measured on NAIP, its deck
 *    (7.5-13 m) is estimated.
 *  - published: opened 1995, TVS architects, 280,000 sq ft exhibit space,
 *    LYNX passes through it, $110M expansion with the Westin bridge
 *    completed Oct 2021 (Wikipedia, "Charlotte Convention Center").
 *  - colour: precast panels cream-beige in every daylight photo (sunlit
 *    ~#e6dcc8, shade ~#cfc3ad) -> ccc-precast #e9dcc6; white membrane roofs
 *    on NAIP, pulled to a light grey (#c6cacc) so the vaults read; dark
 *    glazing = window; vaults and dome glass; hoods white = trim.
 *
 * Photos (evidence):
 *  - "Charlotte Convention Center in 2017.jpg", Kenneth C. Zirkel, CC BY-SA
 *    4.0, https://commons.wikimedia.org/wiki/File:Charlotte_Convention_Center_in_2017.jpg
 *    (MLK entrance: hood, arched glass, pylons)
 *  - "Entrance to Charlotte, NC, Convention Center IMG 5243.JPG", Billy
 *    Hathorn, CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Entrance_to_Charlotte,_NC,_Convention_Center_IMG_5243.JPG
 *  - "Charlotte NC Convention Center 2007.jpg", Kenneth C. Zirkel, CC BY-SA
 *    4.0, https://commons.wikimedia.org/wiki/File:Charlotte_NC_Convention_Center_2007.jpg
 *    (College entrance and pylon)
 *  - "Charlotte Convention Center", pasa47, CC BY 2.0,
 *    https://www.flickr.com/photos/53301297@N00/49721488483 (MLK side, tracks)
 *  - "Charlotte Skyline From the Caldwell Street South Blvd bridge.jpg", John
 *    Ashley, CC BY 2.0, https://commons.wikimedia.org/wiki/File:Charlotte_Skyline_From_the_Caldwell_Street_South_Blvd_bridge.jpg
 *    (the long low mass from the south)
 *  - "3rd Street (LYNX station).jpg", Patriarca12, CC BY-SA 3.0,
 *    https://commons.wikimedia.org/wiki/File:3rd_Street_(LYNX_station).jpg
 *    (the spine's vault beside the tracks)
 *  - Mapillary (CC BY-SA 4.0), contributors' images 180334787811096
 *    (rounded corner, 2022), 501434965148436 (Stonewall face), 1063116400872692
 *    (MLK face), 527573339047805 (College St), 1121186182150504 and
 *    485654926906582 (Brevard).
 * Look-only: none used. No commercial imagery.
 *
 * Estimated: window and bay sizes (photos, no dimensions), pylon sizes, hood
 * depth (8 m at the crown) and fascia, the College face's clerestory windows,
 * the court's glass wall height. Invented: the hood's plan curve law.
 *
 * Doubts: no licensed photo shows the 2021 Stonewall facade squarely or the
 * Brevard entrance, so both are drawn like the 1995 faces; the College St
 * face between the entrance and the corner is mostly hidden by trees in
 * every photo. The "spires" in the brief's note were not found: the 2016
 * lidar has nothing above the 39 m dome, and the College St photos show
 * pylons and a lattice sign frame, not towers; the arched entrances under
 * their hoods are the curved glass features modelled.
 *
 * Left out: lettering, the lattice sign frames, mullions, rooftop plant.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { block, cap, inset, lathe, panel, rect, save, walls, type XY } from './chi-aon-center'

const PRECAST = finish('ccc-precast', 0xe9dcc6)
const ROOF = finish('ccc-roof', 0xc6cacc)

const precast = new Part(), roof = new Part(), win = new Part(), glass = new Part(), trim = new Part(), teal = new Part()
const door = win

/** Ground above the base (lidar, a plane fit): high on MLK and College, low at Stonewall/Brevard. */
const ground = (x: number, y: number) => Math.max(0, Math.min(10, 4.9 - 0.0129 * x + 0.029 * y))

/** Walls along an open chain of points (outward to the right of travel). */
function chain(p: Part, r: XY[], z0: number, z1: number) {
  for (let i = 0; i < r.length - 1; i++) p.quad([r[i][0], r[i][1], z0], [r[i + 1][0], r[i + 1][1], z0], [r[i + 1][0], r[i + 1][1], z1], [r[i][0], r[i][1], z1])
}

/** A box from the base to z1 with a bevelled top and a roof cap. */
function box(x0: number, y0: number, x1: number, y1: number, z1: number, z0 = 0, bevel = 0.5, top: Part = roof, wall: Part = precast) {
  block(wall, top, rect(x0, y0, x1, y1), z0, z1, bevel)
}

/**
 * A segmental barrel vault over the rectangle, ridge along `axis`, from the
 * eave z0 rising `rise`. `over0`/`over1` cantilever the vault past each end as
 * a canopy, deepest at the crown (the entrances' curved hoods).
 */
function vault(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, rise: number, axis: 'x' | 'y', o: { over0?: number; over1?: number; n?: number; gable?: Part | null; hood?: Part; ribs?: number } = {}) {
  const n = o.n ?? 10
  const [a0, a1, s0, s1] = axis === 'x' ? [y0, y1, x0, x1] : [x0, x1, y0, y1]
  const w = a1 - a0, c = (a0 + a1) / 2
  const R = (rise * rise + (w / 2) ** 2) / (2 * rise), th = Math.asin((w / 2) / R)
  const prof = Array.from({ length: n + 1 }, (_, i) => {
    const t = -th + (2 * th * i) / n
    return { a: c + R * Math.sin(t), z: z0 + R * Math.cos(t) - R * Math.cos(th), na: Math.sin(t), nz: Math.cos(t), u: (2 * i) / n - 1 }
  })
  const P = (a: number, s: number, z: number): V3 => (axis === 'x' ? [s, a, z] : [a, s, z])
  const N = (na: number, nz: number): V3 => (axis === 'x' ? [0, na, nz] : [na, 0, nz])
  const ext0 = (u: number) => (o.over0 ?? 0) * (0.35 + 0.65 * (1 - u * u))
  const ext1 = (u: number) => (o.over1 ?? 0) * (0.35 + 0.65 * (1 - u * u))
  for (let i = 0; i < n; i++) {
    const A = prof[i], B = prof[i + 1]
    const nA = N(A.na, A.nz), nB = N(B.na, B.nz)
    const flip = axis === 'x' ? -1 : 1
    const strip = (part: Part, sa: number, sb: number, ea: number, eb: number) => {
      // sa..sb along the axis at A, sa'..sb' at B (ea/eb: B-side ends)
      const q = [P(A.a, sa, A.z), P(B.a, ea, B.z), P(B.a, eb, B.z), P(A.a, sb, A.z)]
      if (flip > 0) {
        part.tri(q[0], q[3], q[2], undefined, undefined, undefined, [nA, nA, nB])
        part.tri(q[0], q[2], q[1], undefined, undefined, undefined, [nA, nB, nB])
      } else {
        part.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nA, nB, nB])
        part.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nA, nB, nA])
      }
    }
    const hoodTop = o.hood ?? trim
    strip(p, s0, s1, s0, s1)
    if (ext0(0) > 0) strip(hoodTop, s0 - ext0(A.u), s0, s0 - ext0(B.u), s0)
    if (ext1(0) > 0) strip(hoodTop, s1, s1 + ext1(A.u), s1, s1 + ext1(B.u))
    // hood soffits under the cantilevers
    const hood = o.hood ?? trim
    for (const [s, e, sign] of [[s0, ext0, -1], [s1, ext1, 1]] as [number, (u: number) => number, number][]) {
      if (e(0) <= 0) continue
      const d = -2.4
      const h = [P(A.a, s, A.z + d), P(B.a, s, B.z + d), P(B.a, s + sign * e(B.u), B.z + d), P(A.a, s + sign * e(A.u), A.z + d)]
      if ((sign > 0) === (flip > 0)) hood.quad(h[0], h[3], h[2], h[1]); else hood.quad(h[0], h[1], h[2], h[3])
      // hood fascia
      const f = [P(A.a, s + sign * e(A.u), A.z + d), P(B.a, s + sign * e(B.u), B.z + d), P(B.a, s + sign * e(B.u), B.z), P(A.a, s + sign * e(A.u), A.z)]
      hood.quad(f[0], f[1], f[2], f[3]); hood.quad(f[0], f[3], f[2], f[1])
    }
  }
  // Glazing ribs across the vault.
  if (o.ribs) {
    const k = Math.round((s1 - s0) / o.ribs)
    for (let j = 0; j <= k; j++) {
      const s = s0 + ((s1 - s0) * j) / k
      for (let i = 0; i < n; i++) {
        const A = prof[i], B = prof[i + 1], e = 0.12
        const a0 = P(A.a + A.na * e, s - 0.45, A.z + A.nz * e), a1 = P(A.a + A.na * e, s + 0.45, A.z + A.nz * e)
        const b0 = P(B.a + B.na * e, s - 0.45, B.z + B.nz * e), b1 = P(B.a + B.na * e, s + 0.45, B.z + B.nz * e)
        trim.quad(a0, a1, b1, b0); trim.quad(a0, b0, b1, a1)
      }
    }
  }
  // Gable ends: the segment between the arc and the eave chord.
  if (o.gable !== null) {
    const g = o.gable ?? precast
    for (const [s, sign] of [[s0, -1], [s1, 1]] as [number, number][]) {
      const mid = P(c, s, z0)
      for (let i = 0; i < n; i++) {
        const A = prof[i], B = prof[i + 1]
        const a = P(A.a, s, A.z), b = P(B.a, s, B.z)
        if ((sign > 0) === (axis === 'y')) g.tri(mid, a, b); else g.tri(mid, b, a)
      }
    }
  }
}

/** Window panels on the face a→b (counter-clockwise outline, so the outward side is to the right), between s0..s1. */
function bayRow(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, w: number, pitch: number) {
  const L = s1 - s0, k = Math.max(1, Math.floor((L + pitch - w) / pitch)), start = s0 + (L - (k - 1) * pitch - w) / 2
  for (let i = 0; i < k; i++) panel(p, a, b, start + i * pitch, start + i * pitch + w, z0, z1, 0.05)
}

function build() {
  // ---- Exhibit halls: the main body south of the concourse.
  const STONE_Y = -92.3 // Stonewall face (OSM)
  const M: XY[] = [
    [-100, -90.6], [-97, -90.4], [-97, -94.0], [-87.5, -94.0], [-87.5, -95.4], [-76.2, -95.4], [-76.2, -93.5], [-50.8, -93.5], [-50.8, -94.8], [-39.8, -94.8], [-39.1, STONE_Y],
    [-25.6, STONE_Y], [-25.6, -86.1], [-8.6, -86.1], [-8.6, STONE_Y], [6.0, STONE_Y], [6.0, -93.4], [16.9, -93.4], [16.9, -91.7], [42.8, -91.1], [42.8, -92.4], [53.6, -92.3], [53.6, -90.7], [67.6, -90.4], [67.7, -87.8],
    [89.5, -87.1], [89.5, 10], [-129.1, 10], [-129.1, -66.8], [-100, -66.8],
  ]
  const HALL = 19.7
  block(precast, roof, M, 0, HALL, 0.5)
  // Brevard lip, lower.
  box(89.5, -78.8, 94.6, 10, 16, 0, 0.4)
  // College Street wall, a storey proud of the hall roof.
  box(-129.1, -69, -122.8, 10, 22.4, 0, 0.5)
  // The cross-ridges over the hall's structural bays, both sides of the roof.
  for (const [x0, x1] of [[-87.5, -76.2], [-50.8, -39.8], [6.0, 16.9], [42.8, 53.6]]) {
    box(x0, STONE_Y - 1.5, x1, -65, 22.4, HALL - 1, 0.4)
    box(x0, -18, x1, 10, 22.2, HALL - 1, 0.4)
  }
  box(71.5, -79, 89.5, -46, 23.0, HALL - 1, 0.4)
  // The clerestory band down the middle of the halls, and the light-rail
  // trench's vent towers over it.
  box(-102.3, -55, -35, -43.4, 25.2, HALL - 1, 0.4)
  box(1.2, -55, 72.1, -43.5, 25.2, HALL - 1, 0.4)
  box(-34.8, -55, -26.2, -45.1, 28.1, HALL - 1, 0.4)
  box(-7.1, -55, 1.2, -44.8, 28.1, HALL - 1, 0.4)
  box(-26.2, -55, -7.1, -42.3, 23.0, HALL - 1, 0.4)

  // ---- The rounded glass corner at College and Stonewall (2021): a
  // quarter-round teal curtain wall to the cornice, on OSM's arc.
  {
    const cx = -110.5, cy = -72.5, r = 20, TOP = 20.2
    const arc: XY[] = Array.from({ length: 13 }, (_, i) => {
      const t = Math.PI + (i / 12) * (Math.PI / 2)
      return [cx + r * Math.cos(t), cy + r * Math.sin(t)] as XY
    })
    const D: XY[] = [[-100, -66.8], [-130.5, -66.8], ...arc, [-100, -92.5]]
    const face = D.slice(1, D.length - 1)
    walls(precast, D, 0, 0.6)
    chain(teal, face, 0.6, TOP)
    block(precast, roof, D, TOP, 21.8, 0.4)
    walls(precast, [[-100, -92.5], [-100, -66.8], [-100.01, -66.8], [-100.01, -92.5]], 0.6, TOP)
    // two-storey glazing bands
    for (const z of [7.0, 13.6]) chain(trim, inset(D, -0.06).slice(1, D.length - 1), z, z + 0.5)
  }

  // ---- The concourse: two glazed barrel vaults either side of the hub,
  // arched glass entrances under curved hoods at College and Brevard.
  const CY0 = 10, CY1 = 32.4, EAVE = 23
  box(-129.9, CY0, -40, CY1, EAVE, 0, 0)
  box(26, CY0, 94.8, CY1, EAVE, 0, 0)
  vault(glass, -129.9, CY0, -40, CY1, EAVE, 3.2, 'x', { over0: 8, gable: win, ribs: 10 })
  vault(glass, 26, CY0, 94.8, CY1, EAVE, 3.2, 'x', { over1: 8, gable: win, ribs: 10 })
  // Hub and rotunda.
  box(-40, 0, 26, CY1 + 0.1, 30.3, 0, 0.5)
  lathe(precast, 9.3, 19.4, [[7.4, 30.2], [7.4, 33.6], [7.0, 34.0]] as XY[], 16)
  lathe(glass, 9.3, 19.4, [[7.0, 34.0], [6.5, 35.9], [5.2, 37.5], [3.1, 38.7], [0, 39.2]] as XY[], 16)

  // ---- The spine: a glazed barrel along the light rail to the MLK entrance.
  const SX0 = 0.2, SX1 = 17.2, SY1 = 127.3
  box(SX0, CY1, SX1, SY1, 21, 0, 0)
  vault(glass, SX0, CY1, SX1, SY1, 21, 3.0, 'y', { over1: 8, gable: win, ribs: 10 })

  // ---- North-east wing (ballroom) between the spine and Brevard.
  box(SX1, CY1, 94.9, 107, 19.7, 0, 0.5)
  box(20, 33.5, 89, 96, 24.2, 19, 0.4)
  box(52, 33.5, 62, 96, 25.8, 23.5, 0.3)
  box(20, 62, 89, 67, 25.8, 23.5, 0.3)
  box(SX1, 107, 34.8, 126.4, 18.2, 0, 0.4)
  box(79.9, 107, 95.2, 126.7, 18.2, 0, 0.4)
  // The curved glass court under a low canopy, and the portal beam over it on MLK.
  {
    const curve: XY[] = [[79.9, 113.5], [74.9, 110.6], [67.7, 108.2], [59.6, 107.1], [51.2, 107.3], [44.1, 109.2], [37.6, 111.7], [34.8, 113.7]]
    const court: XY[] = [[34.8, 125.4], ...curve.slice().reverse(), [79.9, 125.4]].reverse() as XY[]
    chain(door, curve, ground(55, 110), 10.4)
    chain(precast, curve, 0, ground(55, 110))
    block(precast, roof, court.slice().reverse(), 10.4, 11.4, 0.2)
    box(24.8, 125.4, 89.8, 133.8, 21.3, 15.0, 0.5)
    box(24.8, 126.3, 34.8, 133.8, 15.0, 0, 0)
    box(79.9, 126.3, 89.8, 133.8, 15.0, 0, 0)
  }

  // ---- The 2021 bridge over Stonewall to the Westin (NAIP; height estimated).
  box(-38.5, -124, -31.5, STONE_Y, 13.0, 7.5, 0.3)
  for (const x of [-38.55, -31.45]) {
    const a: XY = x < -35 ? [x, STONE_Y] : [x, -124], b: XY = x < -35 ? [x, -124] : [x, STONE_Y]
    panel(win, a, b, 1.5, 30.2, 8.8, 11.8, 0.03)
  }

  // ---- Facades. Tall slot windows in pairs between precast piers; glass
  // on the concourse and spine; entrances glazed.
  const g0 = (x: number, y: number) => ground(x, y) + 3.2
  // Stonewall face: bays between the cross-ridge pylons.
  const sw = (x0: number, x1: number, y: number) => {
    const z = g0((x0 + x1) / 2, y), m = (z + HALL - 3) / 2
    bayRow(win, [x0, y], [x1, y], 0, x1 - x0, z, m - 0.6, 3.0, 6.5)
    bayRow(win, [x0, y], [x1, y], 0, x1 - x0, m + 0.6, HALL - 3, 3.0, 6.5)
  }
  for (const [x0, x1] of [[-97, -87.5], [-76.2, -50.8], [-39.1, -25.6], [-8.6, 6], [16.9, 42.8], [53.6, 67.6]]) sw(x0 + 1, x1 - 1, STONE_Y - (x0 < -40 ? 1.2 : 0) - 0.02)
  for (const [x0, x1] of [[-76.2, -50.8]]) sw(x0, x1, -93.5)
  // Brevard face of the halls and the ballroom.
  bayRow(win, [94.6, -78], [94.6, 10], 2, 86, 4.5, 13.5, 3.0, 7.5)
  bayRow(win, [94.9, 33], [94.9, 107], 4, 70, 4.0, 15.5, 3.0, 8.5)
  // College face of the halls (the wall strip): tall slots.
  bayRow(win, [-129.15, 9], [-129.15, -66], 3, 72, 13.0, 17.8, 4.2, 9.0)
  // Concourse: the north-east face is glass between piers, the south face
  // shows above the hall roof as a clerestory.
  bayRow(win, [-40, CY1 + 0.02], [-129.9, CY1 + 0.02], 2, 88, ground(-80, 32) + 2.5, EAVE - 1.5, 5.4, 7.0)
  bayRow(win, [-129.9, CY0 - 0.02], [-40, CY0 - 0.02], 2, 88, HALL + 0.6, EAVE - 0.8, 5.4, 7.0)
  bayRow(win, [26, CY0 - 0.02], [94.8, CY0 - 0.02], 2, 66, HALL + 0.6, EAVE - 0.8, 5.4, 7.0)
  bayRow(win, [94.8, CY1 + 0.02], [26, CY1 + 0.02], 10, 66, 20.2, EAVE - 0.8, 5.4, 7.0)
  // Hub clerestory above the concourse roofs.
  bayRow(win, [26, CY1 + 0.12], [-40, CY1 + 0.12], 3, 63, EAVE + 1.0, 28.8, 3.4, 5.6)
  bayRow(win, [-40, -0.02], [26, -0.02], 3, 63, HALL + 0.8, 28.8, 3.4, 5.6)
  // Spine: the light-rail face glazed, the wing face over the ballroom roof.
  bayRow(win, [SX0 - 0.02, SY1], [SX0 - 0.02, CY1], 3, 92, 11.5, 19.8, 4.6, 6.2)

  // Entrances: arched glazing filling each vault end and the wall below, set
  // between precast pylons, with a dark sign band.
  const entrance = (a: XY, b: XY, z0: number, z1: number) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    panel(door, a, b, 2.4, L - 2.4, z0, z0 + 4.2, 0.06)
    panel(win, a, b, 2.4, L - 2.4, z0 + 4.2, z1, 0.06)
    for (const z of [z0 + 4.2, z0 + 9.5, z1 - 0.5]) panel(trim, a, b, 2.4, L - 2.4, z, z + 0.5, 0.1)
  }
  entrance([-129.9, CY1], [-129.9, CY0], ground(-130, 20) + 0.2, EAVE)
  entrance([94.8, CY0], [94.8, CY1], ground(95, 20) + 0.2, EAVE)
  entrance([SX1, SY1], [SX0, SY1], ground(8, 127) + 0.2, 21)
  // Pylons flanking the entrances (photos: Zirkel, Hathorn).
  box(-133.4, CY0 - 0.5, -129.0, CY0 + 3.2, 21.0, 0, 0.4)
  box(-133.4, CY1 - 3.2, -129.0, CY1 + 0.5, 21.0, 0, 0.4)
  box(SX1 - 2.6, SY1 - 0.5, SX1 + 1.2, SY1 + 2.4, 19.5, 0, 0.4)
  box(SX0 - 1.2, SY1 - 0.5, SX0 + 2.6, SY1 + 2.4, 19.5, 0, 0.4)
  box(94.4, CY0 - 0.5, 98.0, CY0 + 3.2, 21.0, 0, 0.4)
  box(94.4, CY1 - 3.2, 98.0, CY1 + 0.5, 21.0, 0, 0.4)

  return [
    { part: precast, material: PRECAST },
    { part: roof, material: ROOF },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
    { part: trim, material: PALETTE.trim },
    { part: teal, material: windowVariant(2, 0x55807c) },
  ]
}

if (import.meta.main) await save('clt-convention-center', 'Charlotte Convention Center', [35.2221174, -80.8453989], 50, build(), 6500)
