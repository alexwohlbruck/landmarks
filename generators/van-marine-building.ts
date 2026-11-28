/**
 * Marine Building, 355 Burrard Street, Vancouver: procedural, CC0-1.0, no
 * textures.
 *   bun generators/van-marine-building.ts
 *
 * Art deco office tower of 1930 (McCarter & Nairne): warm brown brick with
 * buff terracotta trim at every setback, the shaft stepping in near the top
 * to a central tower under a green copper hipped crown, and the great
 * arched entrance in the middle of the Burrard Street front.
 *
 * Map frame: x east', y north', z up, metres, turned to bearing 45.7 (the
 * Burrard Street front of OSM way/125579375). +x is the Burrard front
 * (south-east), -y runs to West Hastings Street, +y to the harbour.
 * Anchor: the area centroid of way/125579375, lng -123.1171020,
 * lat 49.2875133. Elevation 0.
 *
 * Evidence
 *  - OSM (ODbL): outline way/125579375 (height 97.8, 21 levels, Q1326540);
 *    parts way/360437838 (40, the whole base and the north wing),
 *    360437839 (68, the L-shaped shaft), 360575455 (74), 360437840 (80),
 *    360437841 (88, hipped: the crown), 360575458 (98, the chimney on the
 *    crown), 360575454 (26, the Hastings front), 360575460 (8).
 *  - City of Vancouver building-footprints-2009 (City 2009 lidar; Contains
 *    information licensed under the Open Government Licence - Vancouver),
 *    bldgid 151265, tops above sea level: shaft 87.7, setback 93.0, crown
 *    103.25, north wing 55.6, Hastings front 35.1, west wing 24.3; the
 *    lowest base 13.5 (the north-west corner), the tower's 15.2. Heights
 *    here are above 13.5 (y = 0): shaft 68.5 (OSM, the corners step in)
 *    and 74.2, setback 79.5, the crown's eaves 84 (photo) and apex 89.8,
 *    north wing 42.1, Hastings front 21.6, west wing 10.8.
 *  - Published: 97.8 m (OSM, Wikipedia "Marine Building"); the lidar puts
 *    the crown's apex at 89.8 m over the lowest ground, so the published
 *    figure likely counts from lower down or to the flagpole. The chimney
 *    is drawn to 93 m (photo: about 3 m over the apex).
 *  - Photos (Wikimedia Commons, EVIDENCE):
 *    - zhatt: Zhatt, "Vancouver Marine Building.jpg", public domain (from
 *      the harbour side: the setbacks, trim, crown and north wing).
 *      https://commons.wikimedia.org/wiki/File:Vancouver_Marine_Building.jpg
 *    - darren: Darren Kirby, "Marine Building Vancouver BC.jpg", CC BY-SA
 *      3.0 (the Burrard front from the south, the arched entrance, colour).
 *      https://commons.wikimedia.org/wiki/File:Marine_Building_Vancouver_BC.jpg
 *    - howe: Jc1599, "View of the marine building from Howe street.jpg",
 *      CC BY 4.0 (the top from the south-west).
 *      https://commons.wikimedia.org/wiki/File:View_of_the_marine_building_from_Howe_street.jpg
 *    - dad6701: Daderot, "Marine Building - Vancouver, Canada - DSC06701.JPG",
 *      CC0 (the entrance arch: buff surround, sunburst fanlight, doors).
 *      https://commons.wikimedia.org/wiki/File:Marine_Building_-_Vancouver,_Canada_-_DSC06701.JPG
 *  No commercial imagery.
 *
 * Estimated, and doubts:
 *  - Window bays (about 3.4 m, a narrow punched pair grouped over two
 *    floors) and the trim bands' depth, from zhatt and darren.
 *  - The entrance arch: 7 m wide, its crown about 11.5 m over the
 *    pavement, from darren and dad6701 (estimated against the storeys).
 *  - The finer setbacks of the shaft's corners and the terracotta
 *    ornament (sea life, ships) are left out; the tiers follow OSM.
 *  - The west wing's lot-line wall and the light court (OSM's notch) are
 *    not photographed; drawn plain.
 *  - Night: the windows glow; the entrance doors are `entrance`; the crown
 *    and upper setbacks are floodlit, as at night they are.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, panel, area, inset, type XY } from './chi-aon-center'
import { hipRoof } from './chi-board-of-trade'

export const BEARING = 45.7
export const ANCHOR = { lng: -123.117102, lat: 49.2875133 }

const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)
const inside = (p: XY, r: XY[]) => {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++)
    if ((r[i][1] > p[1]) !== (r[j][1] > p[1]) && p[0] < ((r[j][0] - r[i][0]) * (p[1] - r[i][1])) / (r[j][1] - r[i][1]) + r[i][0]) c = !c
  return c
}

// OSM parts in the turned frame (0.1 m)
const SHAFT: XY[] = [[17.9, 7.0], [1.8, 6.6], [1.9, -2.1], [-12.3, -2.5], [-12.1, -20.9], [18.0, -19.8]]
const SHAFT2: XY[] = [[16.0, 5.6], [1.8, 5.3], [1.9, -2.1], [-10.3, -2.4], [-10.3, -18.1], [15.9, -17.5]]
const TIER3: XY[] = [[11.5, 0.6], [1.8, 0.2], [1.9, -2.1], [-5.2, -2.3], [-5.4, -14.1], [11.5, -13.6]]
const CROWN = { x0: -3.2, y0: -11.3, x1: 8.7, y1: -2.2 }
const NORTH: XY[] = [[17.9, 29.1], [7.6, 28.8], [1.5, 25.6], [1.8, 6.6], [17.9, 7.0]]
const HASTINGS: XY[] = [[18.0, -19.8], [18.0, -21.9], [-9.4, -31.7], [-13.7, -20.9], [-12.1, -20.9]]
const WEST: XY[] = [[-26.6, 10.6], [-16.1, -15.0], [-13.7, -20.9], [-12.1, -20.9], [-12.3, -2.5], [1.9, -2.1], [1.8, 6.6], [1.5, 25.6]]
const NE: XY[] = [[17.9, 29.1], [17.9, 34.3], [7.6, 28.8]]

const Z_SHAFT = 68.5, Z_SHAFT2 = 74.2, Z_TIER3 = 79.5, Z_EAVE = 84, Z_APEX = 89.8, Z_CHIMNEY = 93
const MASSES: [XY[], number, number][] = [
  [SHAFT, 0, Z_SHAFT], [NORTH, 0, 42.1], [HASTINGS, 0, 21.6], [WEST, 0, 10.8], [NE, 0, 8],
  [SHAFT2, Z_SHAFT - 0.5, Z_SHAFT2], [TIER3, Z_SHAFT2 - 0.5, Z_TIER3],
]
/** Pavement over y = 0 (Mapterhorn, rising to the Burrard/Hastings corner). */
const ground = (x: number, y: number) => Math.max(0, Math.min(3, 1.4 + 0.06 * x - 0.03 * y))

function build() {
  const brick = new Part(), trim = new Part(), win = new Part(), roof = new Part(), copper = new Part(), door = new Part()

  for (const [r0, z0, z1] of MASSES) {
    const r = ccw(r0)
    block(brick, null, r, z0, z1 - 1.6, 0) // the brick
    block(trim, roof, r, z1 - 1.6, z1, 0.35) // a buff terracotta coping band at each setback
  }
  // the crown's base tier and the copper hipped roof, the chimney on top
  const cr = ccw([[CROWN.x0, CROWN.y0], [CROWN.x1, CROWN.y0], [CROWN.x1, CROWN.y1], [CROWN.x0, CROWN.y1]])
  block(brick, null, cr, Z_TIER3 - 0.5, Z_EAVE - 1.2, 0)
  block(trim, null, cr, Z_EAVE - 1.2, Z_EAVE, 0)
  const o = 0.5
  hipRoof(copper, CROWN.x0 - o, CROWN.y0 - o, CROWN.x1 + o, CROWN.y1 + o, Z_EAVE, Z_APEX)
  copper.quad([CROWN.x0 - o, CROWN.y0 - o, Z_EAVE], [CROWN.x0 - o, CROWN.y1 + o, Z_EAVE], [CROWN.x1 + o, CROWN.y1 + o, Z_EAVE], [CROWN.x1 + o, CROWN.y0 - o, Z_EAVE]) // eave soffit
  block(trim, roof, ccw([[1.7, -7.8], [3.8, -7.8], [3.8, -5.7], [1.7, -5.7]]), Z_APEX - 3, Z_CHIMNEY, 0.2)

  // windows: narrow punched pairs, two floors to a panel, on every wall
  // above whatever stands against it
  const masses: [XY[], number][] = [...MASSES.map(([r, , z]) => [r, z] as [XY[], number]), [cr, Z_EAVE]]
  const facade = (r0: XY[], zTop: number, zBase: number) => {
    const r = ccw(r0)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 5) continue
      const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
      const m: XY = [(a[0] + b[0]) / 2 + n[0] * 0.6, (a[1] + b[1]) / 2 + n[1] * 0.6]
      if (r0 === WEST && i === 0) continue // the lot line with the Quadra Club
      // a buff terracotta base course, two storeys, on the street fronts
      if (zBase <= 4 && r0 !== WEST) {
        let free = true
        for (const [q] of masses) if (q !== r0 && inside(m, q)) free = false
        if (free) panel(trim, a, b, 0, L, 0, ground(m[0], m[1]) + 7.5, 0.03)
      }
      let z0 = Math.max(zBase, ground(m[0], m[1]) + 4.2)
      for (const [q, h] of masses) if (q !== r0 && inside(m, q)) z0 = Math.max(z0, h + 1.2)
      const z1 = zTop - 2.4
      if (z1 - z0 < 3) continue
      const nf = Math.max(1, Math.round((z1 - z0) / 7.2))
      const k = Math.max(1, Math.round((L - 1.6) / 3.4)), bay = (L - 1.6) / k
      for (let q = 0; q < k; q++) {
        const s = 0.8 + q * bay + bay * 0.22, e = 0.8 + (q + 1) * bay - bay * 0.22
        // the entrance bays on Burrard stay clear of the arch
        if (r0 === SHAFT && Math.abs(a[0] - 18) < 0.3 && Math.abs(b[0] - 18) < 0.3) {
          const y = a[1] + u[1] * (s + e) / 2
          if (Math.abs(y + 6.5) < 5.5 && z0 < 14) { panelsFrom(a, b, s, e, 15.5, z1); continue }
        }
        panelsFrom(a, b, s, e, z0, z1)
      }
      function panelsFrom(a: XY, b: XY, s: number, e: number, za: number, zb: number) {
        const nr = Math.max(1, Math.round((zb - za) / 7.2))
        for (let j = 0; j < nr; j++) panel(win, a, b, s, e, za + ((zb - za) * j) / nr + 0.55, za + ((zb - za) * (j + 1)) / nr - 0.55, 0.05)
      }
      void nf
    }
  }
  facade(SHAFT, Z_SHAFT - 1.6, 4)
  facade(SHAFT2, Z_SHAFT2 - 1.6, Z_SHAFT + 0.5)
  facade(TIER3, Z_TIER3 - 1.6, Z_SHAFT2 + 0.5)
  facade(cr, Z_EAVE - 1.2 + 1.2, Z_TIER3 + 0.4)
  facade(NORTH, 42.1 - 1.6, 4)
  facade(HASTINGS, 21.6 - 1.6, 4)
  facade(WEST, 10.8, 3)

  // the great arched entrance on Burrard: a buff surround, the sunburst
  // fanlight, the doors
  const X = 18.0, YC = -6.5, g = ground(X, YC)
  const arch = (p: Part, r: number, zs: number, zb: number, out: number, seg = 12) => {
    const N: V3 = [1, 0, 0], P = (y: number, z: number): V3 => [X + out, YC + y, z]
    const nn: V3[] = [N, N, N]
    p.tri(P(-r, zb), P(r, zb), P(r, zs), undefined, undefined, undefined, nn)
    p.tri(P(-r, zb), P(r, zs), P(-r, zs), undefined, undefined, undefined, nn)
    for (let i = 0; i < seg; i++) {
      const a0 = (i / seg) * Math.PI, a1 = ((i + 1) / seg) * Math.PI
      p.tri(P(0, zs), P(r * Math.cos(a0), zs + r * Math.sin(a0)), P(r * Math.cos(a1), zs + r * Math.sin(a1)), undefined, undefined, undefined, nn)
    }
  }
  const zs = g + 8.0
  arch(trim, 4.7, zs, g, 0.06)
  arch(win, 3.5, zs, g + 4.6, 0.12)
  const N: V3 = [1, 0, 0]
  door.tri([X + 0.16, YC - 2.6, g], [X + 0.16, YC + 2.6, g], [X + 0.16, YC + 2.6, g + 4.4], undefined, undefined, undefined, [N, N, N])
  door.tri([X + 0.16, YC - 2.6, g], [X + 0.16, YC + 2.6, g + 4.4], [X + 0.16, YC - 2.6, g + 4.4], undefined, undefined, undefined, [N, N, N])

  const top = (p: V3) => (p[2] > Z_SHAFT - 3 ? 0.75 : 0)
  return [
    { part: brick, material: { ...finish('marine-brick', 0xbf9f80), floodlight: top } as MaterialSpec },
    { part: trim, material: { ...finish('marine-terracotta', 0xeadcc0), floodlight: top } as MaterialSpec },
    { part: win, material: PALETTE.window as MaterialSpec },
    { part: roof, material: PALETTE.roof as MaterialSpec },
    { part: copper, material: { ...PALETTE.copper, floodlight: () => 0.6 } as MaterialSpec },
    { part: door, material: PALETTE.entrance as MaterialSpec },
  ]
}

if (import.meta.main) {
  const parts = build().filter((x) => x.part.triangles > 0)
  const tris = parts.reduce((s, x) => s + x.part.triangles, 0)
  const glb = writeGlb('Marine Building', parts, { frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [ANCHOR.lat, ANCHOR.lng], bearing: BEARING })
  if (tris > 5000 || glb.length > 250_000) throw new Error(`budget: ${tris} triangles / ${glb.length} bytes`)
  const out = new URL('../models/van-marine-building.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
