/**
 * Gerald D. Hines Waterwall (Williams Tower Waterwall; Philip Johnson and
 * John Burgee, 1983-85), Waterwall Park, Uptown Houston — original
 * procedural geometry, CC0-1.0.
 * bun generators/hou-waterwall.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/49591461 ("The
 * Waterwall"), 29.735775,-95.461290. The park and the wall are laid out on
 * the Uptown grid, 0.6° anticlockwise of north (OSM park outline
 * way/48486716), so the catalog bearing is 359.4.
 *
 * Only the structure is modelled: the horseshoe wall with water sheeting
 * down both faces, the two stone pylons that end its arms, and the brick
 * screen of three arches under a pediment that fronts it on the park side
 * (north). The lawn, the plaza inside the horseshoe, the basin and the steps
 * are the map's.
 *
 * Identity, in order: the tall U of falling water, open to the north, as
 * high as a six-storey building; the square stone pylons at its ends; the
 * low pedimented red-brick screen with three round arches on paired pale
 * columns, standing across the open end.
 *
 * Evidence:
 *  - plan: OSM way/49591461, read in the turned frame: a semicircle centred
 *    at (0, 7.25), outer radius 14.05 m, inner 11.75 m (a 2.3 m wall), the
 *    arms running straight on to y = 9.5. The lidar ring agrees (its outer
 *    edge a metre wider where the falling water returns).
 *  - pylons: lidar, 4.3 m wide (x 11.0-15.3 each side) and 3.1 m deep
 *    (y 8.5-11.6), capping the ends of the arms.
 *  - screen: lidar, y 13.6-15.4 (1.8 m thick), 24.8 m wide, centred on the
 *    U; eaves 4.75 m, apex 9.0 m above the plaza, the rake straight between.
 *  - heights: lidar (USGS 3DEP TX_Coastal_B1_2018, flown 2018, 0.5 m grid),
 *    above the plaza the wall stands on: wall 18.4 m, pylons 18.6 m.
 *    Published: 64 ft (19.5 m, Uptown Houston / Wikipedia), which matches
 *    the height above the lawn north of the steps (19.3 m); the plaza is
 *    0.9 m above the lawn. y = 0 is the plaza.
 *  - arches: from Carol M. Highsmith's frontal photo, scaled to the
 *    lidar's 24.8 m screen: arch pitch 4.25 m, openings 2.8 m between the
 *    columns, springing 3.35 m, true semicircles to 4.75 m; a pale stone
 *    impost band at the springing across the whole screen; a black granite
 *    base course 0.45 m; columns about 0.8 m across on black plinths, paired
 *    front and back at every jamb (Sitao Xiang's close photo).
 *  - colours (round 2, after lead review): the brick is a buff tan,
 *    sampled #645445-#756457 in Schipul's daylight view of the green and
 *    tan in Highsmith's (Xiang's close-up reads redder in raking light),
 *    pulled to the palette's lightness as #c9b48f; columns, impost and
 *    rake coping in the paler palette trim so they separate from it; the
 *    pylons cool pale grey concrete (#aaa491-#b1a891 in sun, cool grey in
 *    Highsmith's dusk photo) as #c8c7c2; the base course and plinths are
 *    black granite (Xiang's daylight close-up samples #0f0f12), kept dark; the water reads silver-grey over the dark wall
 *    behind it (Ed Schipul's photos, the green and the drone view from above).
 *  - night: the wall is floodlit from its foot inside the horseshoe and
 *    glows (Highsmith's dusk photo); the water faces carry a floodlight
 *    share, brightest low on the inner face. The rest stays unlit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Galleria "Water Wall," Houston, Texas LCCN2011630268.tif, Carol M.
 *    Highsmith, PD
 *    https://commons.wikimedia.org/wiki/File:Galleria_%22Water_Wall,%22_Houston,_Texas_LCCN2011630268.tif
 *  - Gerald D. Hines Waterwall Park.jpg, Sitao Xiang, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Gerald_D._Hines_Waterwall_Park.jpg
 *  - Houston Water Wall from Above (7264672468).jpg, Ed Schipul, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Houston_Water_Wall_from_Above_-transco_-williams_-tower_-landmark_-drones_-photography_(7264672468).jpg
 *  - The Houston Water Wall and Green (7264671820).jpg, Ed Schipul, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:The_Houston_Water_Wall_and_Green_(7264671820).jpg
 *  - Gerald D. Hines Waterwall Park, Houston, Texas, US julesvernex2.jpg,
 *    Jules Verne Times Two, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Gerald_D._Hines_Waterwall_Park,_Houston,_Texas,_US_julesvernex2.jpg
 * Aerial: USGS NAIP (public domain). No look-only sources; no commercial imagery.
 *
 * Doubts: the pylons' depth comes from the lidar alone (no photo from the
 * side shows it clearly). The wall's top is drawn flat at one height; the
 * real one carries a weir and a trough. The grooved band at the foot of the
 * inner face, the steps and the basin are left out. Column capitals are
 * folded into the impost band.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, save, type XY } from './chi-aon-center'

const stone = new Part(), pylon = new Part(), brick = new Part(), water = new Part(), base = new Part(), top = new Part()

// ---------------------------------------------------------------------------
// The horseshoe: a semicircle round (0, CY) opening north, arms on to Y1.
const CY = 7.25, RO = 14.05, RI = 11.75, Y1 = 9.5, ZW = 18.4
const SEG = 16
{
  // Points round the semicircle from the east arm (angle 0) through south to the west arm (angle π).
  const ang = (k: number) => -(k / SEG) * Math.PI // 0 → -π: east, south, west
  const at = (r: number, a: number): XY => [r * Math.cos(a), CY + r * Math.sin(a)]
  const outer: XY[] = [[RO, Y1], ...Array.from({ length: SEG + 1 }, (_, k) => at(RO, ang(k))), [-RO, Y1]]
  const inner: XY[] = [[RI, Y1], ...Array.from({ length: SEG + 1 }, (_, k) => at(RI, ang(k))), [-RI, Y1]]
  // Normals: radial on the curve, ±x on the straight arms.
  const nrm = (p: XY, out: boolean): V3 => {
    const dy = Math.min(0, p[1] - CY), l = Math.hypot(p[0], dy) || 1
    const n: V3 = [p[0] / l, dy / l, 0]
    return out ? n : [-n[0], -n[1], 0]
  }
  const face = (ring: XY[], out: boolean) => {
    for (let i = 0; i < ring.length - 1; i++) {
      const a = ring[i], b = ring[i + 1], na = nrm(a, out), nb = nrm(b, out)
      const A: V3 = [a[0], a[1], 0], B: V3 = [b[0], b[1], 0], C: V3 = [b[0], b[1], ZW], D: V3 = [a[0], a[1], ZW]
      water.tri(A, B, C, undefined, undefined, undefined, [na, nb, nb])
      water.tri(A, C, D, undefined, undefined, undefined, [na, nb, na])
    }
  }
  face(outer, true)
  face(inner, false)
  // The top of the wall, between the two rings.
  for (let i = 0; i < outer.length - 1; i++) {
    const o0 = outer[i], o1 = outer[i + 1], i0 = inner[i], i1 = inner[i + 1]
    top.quad([o0[0], o0[1], ZW], [i0[0], i0[1], ZW], [i1[0], i1[1], ZW], [o1[0], o1[1], ZW])
  }
}

// The pylons at the ends of the arms: pale grey concrete, bevelled.
const ZP = 18.6
for (const s of [-1, 1]) {
  const x0 = s > 0 ? 11.0 : -15.3, x1 = s > 0 ? 15.3 : -11.0
  const r: XY[] = [[x0, 8.5], [x1, 8.5], [x1, 11.6], [x0, 11.6]]
  block(pylon, pylon, r, 0, ZP, 0.35)
}

// ---------------------------------------------------------------------------
// The screen: brick, three arches, a pediment, from y = YB (back) to YF (front).
const YB = 13.6, YF = 15.4, W = 12.4 // half width
const ZE = 4.75, ZA = 9.0 // eaves, apex
const SPRING = 3.15, R = 1.6, PITCH = 4.25, COL = 0.33 // arch springing, radius (the brick opening), pitch; column radius
const NA = 10 // segments per arch
const centres = [-PITCH, 0, PITCH]
/** A flat triangle / quad facing along n (the winding follows n). */
const T = (p: Part, a: V3, b: V3, c: V3, n: V3) => p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
const Q = (p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) => { T(p, a, b, c, n); T(p, a, c, d, n) }
/** A quad facing away from the point `inside`. */
const Qo = (p: Part, a: V3, b: V3, c: V3, d: V3, inside: V3) => {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [d[0] - a[0], d[1] - a[1], d[2] - a[2]]
  let n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  const m: V3 = [(a[0] + c[0]) / 2 - inside[0], (a[1] + c[1]) / 2 - inside[1], (a[2] + c[2]) / 2 - inside[2]]
  if (n[0] * m[0] + n[1] * m[1] + n[2] * m[2] < 0) n = [-n[0], -n[1], -n[2]]
  const l = Math.hypot(...n)
  Q(p, a, b, c, d, [n[0] / l, n[1] / l, n[2] / l])
}
{
  for (const [y, ny] of [[YF, 1], [YB, -1]] as [number, number][]) {
    const n: V3 = [0, ny, 0]
    const P = ([x, z]: XY): V3 => [x, y, z]
    const q = (p: Part, a: XY, b: XY, c: XY, d: XY) => Q(p, P(a), P(b), P(c), P(d), n)
    const t = (p: Part, a: XY, b: XY, c: XY) => T(p, P(a), P(b), P(c), n)
    // Wall below the springing: solid between the openings.
    const edges = [-W, ...centres.flatMap(c => [c - R, c + R]), W]
    for (let i = 0; i < edges.length; i += 2) {
      const x0 = edges[i], x1 = edges[i + 1]
      q(base, [x0, 0], [x1, 0], [x1, 0.45], [x0, 0.45])
      q(brick, [x0, 0.45], [x1, 0.45], [x1, 2.75], [x0, 2.75])
      q(stone, [x0, 2.75], [x1, 2.75], [x1, SPRING], [x0, SPRING])
    }
    // The arcade band from the springing to the eaves, with the semicircles cut out.
    const pierMid = [-W, ...centres.slice(0, -1).map(c => c + PITCH / 2), W]
    centres.forEach((c, k) => {
      const xa = pierMid[k], xb = pierMid[k + 1]
      const arc = Array.from({ length: NA + 1 }, (_, i) => [c - R * Math.cos(Math.PI * i / NA), SPRING + R * Math.sin(Math.PI * i / NA)] as XY)
      const half = NA / 2
      for (let i = 0; i < half; i++) t(brick, [xa, ZE], arc[i + 1], arc[i])
      t(brick, [xa, SPRING], [xa, ZE], arc[0])
      for (let i = half; i < NA; i++) t(brick, [xb, ZE], arc[i + 1], arc[i])
      t(brick, [xb, ZE], [xb, SPRING], arc[NA])
      t(brick, [xa, ZE], arc[half], [xb, ZE])
    })
    // The pediment.
    t(brick, [-W, ZE], [0, ZA], [W, ZE])
  }
  // Ends.
  for (const s of [-1, 1]) {
    const x = s * W, n: V3 = [s, 0, 0]
    Q(base, [x, YB, 0], [x, YF, 0], [x, YF, 0.45], [x, YB, 0.45], n)
    Q(brick, [x, YB, 0.45], [x, YF, 0.45], [x, YF, ZE], [x, YB, ZE], n)
  }
  // Jambs below the springing, and the arch soffits facing the opening.
  for (const c of centres) {
    for (const s of [-1, 1]) {
      const x = c + s * R
      Q(brick, [x, YB, 0], [x, YF, 0], [x, YF, SPRING], [x, YB, SPRING], [-s, 0, 0])
    }
    for (let i = 0; i < NA; i++) {
      const a0 = Math.PI * i / NA, a1 = Math.PI * (i + 1) / NA
      const p0: V3 = [c - R * Math.cos(a0), 0, SPRING + R * Math.sin(a0)], p1: V3 = [c - R * Math.cos(a1), 0, SPRING + R * Math.sin(a1)]
      const am = (a0 + a1) / 2
      Q(brick, [p0[0], YB, p0[2]], [p1[0], YB, p1[2]], [p1[0], YF, p1[2]], [p0[0], YF, p0[2]], [Math.cos(am), 0, -Math.sin(am)])
    }
  }
  // Rake coping: a pale stone slab along each slope, overhanging a little.
  const TH = 0.35, O = 0.1
  for (const s of [-1, 1]) {
    const e: XY = [s * (W + 0.3), ZE - 0.12], a: XY = [0, ZA]
    const at = (y: number): V3[] => [[e[0], y, e[1]], [a[0], y, a[1]], [a[0], y, a[1] + TH], [e[0], y, e[1] + TH]]
    const f = at(YF + O), b = at(YB - O)
    const mid: V3 = [(e[0] + a[0]) / 2, (YF + YB) / 2, (e[1] + a[1]) / 2 + TH / 2]
    Qo(stone, f[0], f[1], f[2], f[3], mid)
    Qo(stone, b[0], b[1], b[2], b[3], mid)
    Qo(stone, f[3], f[2], b[2], b[3], mid) // top
    Qo(stone, f[0], f[1], b[1], b[0], mid) // underside
    Qo(stone, f[0], f[3], b[3], b[0], mid) // eave end
  }
  // Columns: paired front and back at every jamb, on black plinths.
  const SEGC = 10
  const column = (cx: number, cy: number) => {
    const pl: XY[] = [[cx - 0.5, cy - 0.5], [cx + 0.5, cy - 0.5], [cx + 0.5, cy + 0.5], [cx - 0.5, cy + 0.5]]
    block(base, base, pl, 0, 0.6, 0)
    const ring = (z: number): V3[] => Array.from({ length: SEGC }, (_, i) => [cx + COL * Math.cos(2 * Math.PI * i / SEGC), cy + COL * Math.sin(2 * Math.PI * i / SEGC), z] as V3)
    const lo = ring(0.6), hi = ring(2.75)
    const nn = (k: number): V3 => [Math.cos(2 * Math.PI * k / SEGC), Math.sin(2 * Math.PI * k / SEGC), 0]
    for (let i = 0; i < SEGC; i++) {
      const j = (i + 1) % SEGC
      stone.tri(lo[i], lo[j], hi[j], undefined, undefined, undefined, [nn(i), nn(j), nn(j)])
      stone.tri(lo[i], hi[j], hi[i], undefined, undefined, undefined, [nn(i), nn(j), nn(i)])
    }
    const cp: XY[] = [[cx - 0.55, cy - 0.55], [cx + 0.55, cy - 0.55], [cx + 0.55, cy + 0.55], [cx - 0.55, cy + 0.55]]
    block(stone, stone, cp, 2.75, SPRING, 0)
  }
  for (const c of centres) for (const s of [-1, 1]) for (const y of [YF - 0.45, YB + 0.45]) column(c + s * (R + 0.15), y)
}

const water$: MaterialSpec = {
  ...finish('waterwall-water', 0xb5bec7, 0.4),
  // Floodlit from the foot of the inner face (Highsmith's dusk photo).
  floodlight: (p, n) => {
    const inward = -(n[0] * p[0] + n[1] * Math.min(0, p[1] - CY)) > 0
    const k = 1 - 0.45 * Math.min(1, p[2] / ZW)
    return inward ? k : 0.25 * k
  },
}

await save('hou-waterwall', 'Gerald D. Hines Waterwall', [29.735775, -95.46129], 359.4, [
  { part: water, material: water$ as any },
  { part: brick, material: finish('waterwall-brick', 0xc9b48f) },
  { part: stone, material: PALETTE.trim },
  { part: pylon, material: finish('waterwall-concrete', 0xc8c7c2) },
  { part: base, material: finish('waterwall-granite', 0x4a4f57) },
  { part: top, material: PALETTE.roof },
])
