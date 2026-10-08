/**
 * Bellagio, Las Vegas: the bowed cream hotel tower with its three wings, the
 * lower wing ends, and the round hub with its lantern and cupola.
 * Procedural, CC0-1.0.
 * bun generators/lv-bellagio.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: drawn in OSM's own
 * orientation. The origin is the area centroid of the main tower outline,
 * way/25723909 (36.113113, -115.176606).
 *
 * Published (Wikipedia, "Bellagio (resort)"; Jon Jerde, opened 1998): a
 * 36-storey hotel tower. OSM: way/25723909, 120 m, 34 levels; the hub's
 * cupola part way/114703388, 155 m.
 *
 * Measured, from OSM: the main tower is a bowed slab about 25 m deep, its two
 * arms bending in two steps to wrap the lake to the east, with a third wing
 * 27 m wide running 103 m west from the hub; the hub's round bay, 21 m
 * across, stands out on the lake front. USGS NAIP (public domain): the pitched blue-grey roofs
 * run round every wing with flat centres, the cupola sits on the hub, and
 * each wing end has its own lower roof.
 *
 * Photos (Wikimedia Commons):
 * - "Bellagio Las Vegas 2011.jpg", ZooFari, public domain: the lake front
 *   head on, the hub bay with its lantern, the belt two-thirds up, the row
 *   of arched windows under the cornice, the lower wing ends;
 * - "Bellagio Las Vegas.jpg", Clément Bardot, CC BY-SA 3.0: the same from
 *   the Eiffel Tower, high up, for the height of the cupola over the roof;
 * - "Reflection of the Flamingo Hotel in front of the Bellagio.jpg", Julian
 *   Lupyan, CC0: from the north-east, the north arm's lower end and the
 *   blue-grey roofs;
 * - "Bellagio and Caesars Palace during the day.jpg", Ypsilon, CC0: from
 *   the north-east, the stepped wing ends and the cream walls;
 * - "Las Vegas Bellagio P4220718.jpg", Alexander Migl, CC BY-SA 4.0: from
 *   the south-west, the west wing and the south arm meeting at the hub,
 *   both with arched attics, the south arm's lower end.
 *
 * Estimated: the heights. The published storeys and the photos put the main
 * eave at 128 m (OSM's 120 m is short of the 36 storeys), the wing ends
 * three storeys lower at 118 m, the lantern and cupola to OSM's 155 m. The
 * west wing has no photo from the west; its end is drawn lower like the
 * arms'. The belt course, window rows and the bay rhythm are read from the
 * photos; the windows are drawn three storeys to a panel. The
 * roofs are the palette's blue-grey: the photos show slate blue-grey roofs
 * on the towers, not terracotta, which is only on the low pavilions round
 * the lake. Left out: the 33-storey Spa Tower (way/25723910, a separate
 * building 180 m south-west, left to the map), the casino podium and
 * conservatory (relation/1599958, left on the map), the lake and
 * fountains, signs, balustrades.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { band, cap, ccw, chamfer, edgeFacade, lathe, offset, signedArea, walls, type Facade, type XY } from './lv-caesars-palace'
import { save } from './lv-wynn'

// ================================================================ helpers shared by my CityCenter-era models too

/** The wall of a ring a→b with its windows: one entry per window zone. */
export type Zone = { z0: number; z1: number; f: Facade }

/** Windows on chosen edges of a ring, zone by zone. `skip` lists edge indices with none. */
export function windows(part: Part, ring: XY[], zones: Zone[], skip: number[] = []) {
  ring.forEach((a, i) => {
    if (skip.includes(i)) return
    const b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (const z of zones) if (L >= (z.f.minEdge ?? 6)) edgeFacade(part, inset1(a, b, 1.2), inset1(b, a, 1.2), z.z0, z.z1, z.f)
  })
}
/** a moved d metres towards b: keeps panels off the chamfered corners. */
const inset1 = (a: XY, b: XY, d: number): XY => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  return [a[0] + ((b[0] - a[0]) * d) / L, a[1] + ((b[1] - a[1]) * d) / L]
}

/**
 * A mansard-style roof over a ring: from the eave ring (pushed out by
 * `over`) sloping in by `run` and up by `rise`, with a flat top.
 */
export function pitched(slope: Part, flat: Part, ring: XY[], z: number, run: number, rise: number, over = 0.5) {
  const o = offset(ring, over), i = offset(ring, -run)
  slope.loft([o.map(([x, y]) => [x, y, z] as [number, number, number]), i.map(([x, y]) => [x, y, z + rise] as [number, number, number])])
  cap(flat, i, z + rise)
}

// ================================================================ Bellagio

const cream = new Part(), trim = new Part(), roof = new Part(), win = new Part()

const CREAM = finish('bellagio-cream', 0xecdcbc)

// Plan, from way/25723909. The main storeys: the arms up to their lower
// ends, the hub and the west wing; the round bay is drawn on its own.
const MAIN: XY[] = [
  [24.3, 10.2], [34.8, 58.3], [44.3, 80.0], [20.2, 90.8], [9.8, 68.0], [-1.9, 13.8], [-83.1, 13.4],
  [-83.1, -13.7], [-1.8, -13.2], [10.0, -68.0], [20.3, -91.2], [44.3, -80.3], [34.6, -58.9], [24.0, -10.1],
]
// The edges of MAIN that meet a lower end or the bay: no windows there.
const MAIN_BLIND = [2, 6, 10, 13]
const ENDS: XY[][] = [
  [[44.3, 80.0], [55.7, 106.4], [32.1, 117.0], [20.2, 90.8]],
  [[20.3, -91.2], [31.9, -117.3], [56.3, -106.4], [44.3, -80.3]],
  [[-83.1, 13.4], [-104.5, 13.3], [-105.0, -13.8], [-83.1, -13.7]],
]
// The edge of each end that abuts the main block (after ccw ordering it is
// found by matching points, below).

const EAVE = 128, END_EAVE = 118
const BELT = 87 // the belt course, two-thirds up
const BASE_BAND = 25

/** Window rows from the ground to the belt: storey groups of three. */
const SHAFT: Facade = { bay: 7.5, pier: 4.6, group: 11.5, spandrel: 3, minEdge: 9 }
const lowerZones = (top: number): Zone[] => [
  { z0: 4, z1: BASE_BAND - 1, f: SHAFT },
  { z0: BASE_BAND + 2, z1: BELT - 0.6, f: SHAFT },
  { z0: BELT + 2.2, z1: top, f: { ...SHAFT, group: 99, spandrel: 0 } },
]

function tower(ring: XY[], eave: number, zones: Zone[], skip: number[]) {
  const r = chamfer(ring, 0.5)
  walls(cream, r, 0, eave)
  band(trim, ring, 0.35, BASE_BAND, BASE_BAND + 1.2)
  band(trim, ring, 0.4, BELT, BELT + 1.6)
  band(trim, ring, 0.5, eave - 1.6, eave)
  pitched(roof, roof, ring, eave, 6, 4.5, 0.5)
  windows(win, ring, zones, skip)
}

// The main block. The arched attic runs along the arms' inner halves, next
// to the hub, and along the west wing (edges 0, 4, 5, 7, 8, 12); elsewhere
// the attic has plain windows.
const ARCHED = [0, 4, 5, 7, 8, 12]
const ATTIC = { z0: 107, z1: EAVE - 3 }
tower(MAIN, EAVE, lowerZones(104), MAIN_BLIND)
windows(win, MAIN, [{ ...ATTIC, f: { bay: 7.5, pier: 3.2, group: 99, spandrel: 0, minEdge: 9, arch: 6 } }],
  MAIN.map((_, i) => i).filter((i) => !ARCHED.includes(i)))
windows(win, MAIN, [{ ...ATTIC, f: { ...SHAFT, group: 99, spandrel: 0 } }], [...ARCHED, ...MAIN_BLIND])

// The lower ends: no arches, three storeys down.
if (signedArea(MAIN) <= 0) throw new Error('MAIN must be counter-clockwise')
for (const end of ENDS) {
  const r = ccw(end)
  // The blind edge is the one shared with MAIN.
  const shared = r.findIndex((a, i) => {
    const b = r[(i + 1) % r.length]
    const has = (p: XY) => MAIN.some((q) => Math.abs(q[0] - p[0]) < 0.01 && Math.abs(q[1] - p[1]) < 0.01)
    return has(a) && has(b)
  })
  tower(r, END_EAVE, [...lowerZones(END_EAVE - 3)], [shared])
}

// The hub's round bay, the full height of the tower, its lantern and cupola.
const HUB: XY = [22.5, 0]
lathe([cream, trim, cream], HUB, [[10.4, 0], [10.4, EAVE], [8.2, EAVE], [8.2, EAVE + 1.2]], 20)
{
  // bands on the bay, matching the wings'
  for (const [z0, z1, d] of [[BASE_BAND, BASE_BAND + 1.2, 0.35], [BELT, BELT + 1.6, 0.4], [EAVE - 1.6, EAVE, 0.5]] as const)
    lathe([trim, trim, trim], HUB, [[10.4, z0], [10.4 + d, z0], [10.4 + d, z1], [10.4, z1]], 20)
  // windows on the half facing the lake: one per facet, in the same rows
  const n = 20, r = 10.4
  for (let k = -4; k < 4; k++) {
    const a0 = ((k + 0.5) * 2 * Math.PI) / n - 0.0, a1 = ((k + 1.5) * 2 * Math.PI) / n
    const p0: XY = [HUB[0] + r * Math.cos(a0), HUB[1] + r * Math.sin(a0)]
    const p1: XY = [HUB[0] + r * Math.cos(a1), HUB[1] + r * Math.sin(a1)]
    const f: Facade = { bay: 99, pier: 1.2, group: 11.5, spandrel: 2 }
    edgeFacade(win, p0, p1, 4, BASE_BAND - 1, f)
    edgeFacade(win, p0, p1, BASE_BAND + 2, BELT - 0.6, f)
    edgeFacade(win, p0, p1, BELT + 2.2, 104, { ...f, group: 99, spandrel: 0 })
    edgeFacade(win, p0, p1, 107, EAVE - 3, { ...f, group: 99, spandrel: 0, arch: 4 })
  }
}
// Lantern: a cream drum nearly as wide as the bay, with tall arched
// openings all round, a cornice, a low dome and a small lantern on top, to
// OSM's 155 m.
const LZ = EAVE + 1.2, LR = 8.6, LH = 15.5
lathe([cream], HUB, [[LR, LZ], [LR, LZ + LH]], 16)
lathe([trim, trim, trim], HUB, [[LR, LZ + LH], [LR + 0.7, LZ + LH], [LR + 0.7, LZ + LH + 1.5], [LR - 0.4, LZ + LH + 1.5]], 16)
lathe([roof], HUB, [[LR - 0.4, LZ + LH + 1.5], [LR - 1.2, LZ + LH + 3], [LR - 3.2, LZ + LH + 5], [2.2, LZ + LH + 6.2], [1.2, LZ + LH + 6.4]], 16)
lathe([cream, roof], HUB, [[1.2, LZ + LH + 6.4], [1.2, LZ + LH + 8.6], [0, LZ + LH + 9.8]], 8)
{
  const n = 10
  for (let k = 0; k < n; k++) {
    const a0 = ((k + 0.2) * 2 * Math.PI) / n, a1 = ((k + 0.8) * 2 * Math.PI) / n
    const p0: XY = [HUB[0] + LR * Math.cos(a0), HUB[1] + LR * Math.sin(a0)]
    const p1: XY = [HUB[0] + LR * Math.cos(a1), HUB[1] + LR * Math.sin(a1)]
    edgeFacade(win, p0, p1, LZ + 2.5, LZ + LH - 1.5, { bay: 99, pier: 0.3, group: 99, spandrel: 0, arch: 4 })
  }
}

await save('lv-bellagio', 'Bellagio', [
  { part: cream, material: CREAM },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
], 155, 'Y up, -Z north, +X east, metres; origin at the way/25723909 centroid; bearing 0', 6500)
