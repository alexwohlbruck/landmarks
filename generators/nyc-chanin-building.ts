/**
 * Chanin Building, 122 East 42nd Street — procedural, CC0-1.0, no textures.
 * bun generators/nyc-chanin-building.ts
 *
 * Map frame: x = model east (Lexington Avenue side), y = model north (away
 * from 42nd Street), z up, metres. Placed at bearing 29°, the Manhattan grid.
 * Anchor: area centroid of the OSM outline way/265947366. Kit shared with
 * the rest of the group, from nyc-570-lexington.ts.
 *
 * Evidence
 * - OSM way/265947366 and its 29 building:part ways, which map every setback
 *   stage; their plans are used as drawn (snapped to 0.5 m).
 * - Lidar: USGS 3DEP NY_NewYorkCity, flown 2017, resampled into the model
 *   frame. Measured stage heights, which replace OSM's where they differ by
 *   more than a metre or two (e.g. the west wing at 84 m, not 92; the low
 *   strip along the west edge at 30 m, not 25; the Lexington-side wing at
 *   23 m). Tower: main walls to 176 m, the crown's buttresses to ~189 m round
 *   a 190 m inner roof, a penthouse to 197 m; radio masts to 212 m (omitted:
 *   thin later additions).
 * - Published: 197 m roof, 56 floors, Sloan & Robertson, 1929 (Wikipedia;
 *   NRHP 80002676). Buff brick over a bronze-and-terracotta frieze and brown
 *   marble at the street; crown of tall buttresses with recessed bays.
 * - Photos (Wikimedia Commons): /tmp/city/nyc/work/nyc-chanin-building/photos/credits.txt
 *
 * Estimated: the buttress count and stepping (from photos), the panel
 * rhythm, the plinth height (≈12 m, three storeys of the frieze and marble).
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Facade, massing, prism, finishModel, insetRing, quadN } from './nyc-570-lexington'
import type { V3 } from './mesh'

const brick = new Part(), win = new Part(), roof = new Part(), base = new Part(), dark = new Part()

// [OSM way, height used (lidar where it differs), plan]
const PARTS: [string, number, XY[]][] = [
  ['289989982', 85, [[14.5, 18.0], [14.5, 24.5], [13.0, 24.5], [-4.5, 24.5], [-5.5, 24.5], [-5.5, 17.5], [-4.5, 17.5], [-4.5, 23.5], [13.0, 23.5], [13.0, 18.0]]],
  ['289989983', 49, [[13.0, -27.0], [-30.0, -27.0], [-30.0, -19.0], [-23.0, -19.0], [-23.0, -22.0], [-9.5, -22.0], [-9.5, -22.5], [-4.5, -22.5], [-4.5, -24.0], [13.0, -24.0]]],
  ['289989984', 56, [[18.5, 18.0], [23.0, 18.0], [23.0, 32.5], [-14.0, 32.5], [-14.0, 17.5], [-12.0, 17.5], [-12.0, 30.0], [-4.5, 30.0], [13.5, 30.0], [21.0, 30.0], [21.0, 21.5], [18.5, 21.5]]],
  ['289989985', 69, [[18.5, -12.5], [18.5, -15.5], [18.5, -22.5], [13.0, -22.5], [13.0, -24.0], [-4.5, -24.0], [-4.5, -22.5], [-9.5, -22.5], [-9.5, -22.0], [-23.0, -22.0], [-23.0, -19.0], [14.5, -19.0], [14.5, -12.5], [15.5, -12.5]]],
  ['289989986', 106, [[-23.0, -13.5], [-23.0, -7.0], [-4.5, -7.0], [-4.5, -13.5]]],
  ['289989987', 84, [[-23.0, -17.5], [-30.0, -17.5], [-30.0, -15.5], [-23.0, -15.5]]],
  ['289989988', 66, [[-4.5, 30.0], [-4.5, 28.0], [13.5, 28.0], [13.5, 30.0]]],
  ['289989989', 97, [[-23.0, -15.5], [-23.0, -13.5], [-4.5, -13.5], [-4.5, -15.5]]],
  ['289989990', 91, [[-23.0, -17.5], [-23.0, -15.5], [-4.5, -15.5], [-4.5, -17.5]]],
  ['289989991', 69, [[-23.0, -19.0], [-30.0, -19.0], [-30.0, -17.5], [-23.0, -17.5]]],
  ['289989993', 101, [[15.5, 12.0], [15.5, -6.5], [13.0, -6.5], [13.0, 12.0]]],
  ['289989995', 23, [[18.5, -12.5], [18.5, 18.0], [23.0, 18.0], [23.0, -12.5]]],
  ['289989996', 84, [[-4.5, 28.0], [13.5, 28.0], [13.5, 24.5], [-4.5, 24.5]]],
  ['289989997', 97, [[13.0, 12.0], [13.0, 18.0], [14.5, 18.0], [15.5, 18.0], [15.5, 12.0]]],
  ['289989998', 97, [[15.5, -6.5], [13.0, -6.5], [13.0, -12.5], [14.5, -12.5], [15.5, -12.5]]],
  ['289989999', 84, [[18.5, 18.0], [18.5, -12.5], [15.5, -12.5], [15.5, -6.5], [15.5, 12.0], [15.5, 18.0]]],
  ['289990000', 61, [[13.0, -24.0], [20.5, -24.0], [20.5, -15.5], [18.5, -15.5], [18.5, -22.5], [13.0, -22.5]]],
  ['289990001', 69, [[-10.0, 17.5], [-5.5, 17.5], [-5.5, 24.5], [-4.5, 24.5], [-4.5, 28.0], [-10.0, 28.0]]],
  ['289990002', 62, [[-4.5, 28.0], [-10.0, 28.0], [-10.0, 17.5], [-12.0, 17.5], [-12.0, 30.0], [-4.5, 30.0]]],
  ['289990003', 62, [[-4.5, -24.0], [-23.0, -24.0], [-23.0, -22.0], [-9.5, -22.0], [-9.5, -22.5], [-4.5, -22.5]]],
  ['289990004', 62, [[13.5, 30.0], [21.0, 30.0], [21.0, 21.5], [18.5, 21.5], [18.5, 28.0], [13.5, 28.0]]],
  ['289990005', 85, [[14.5, -12.5], [14.5, -19.0], [-23.0, -19.0], [-23.0, -17.5], [-4.5, -17.5], [-4.5, -18.0], [13.0, -18.0], [13.0, -12.5]]],
  ['289990006', 56, [[18.5, -12.5], [23.0, -12.5], [23.0, -27.0], [13.0, -27.0], [13.0, -24.0], [20.5, -24.0], [20.5, -15.5], [18.5, -15.5]]],
  ['289990007', 69, [[13.0, 24.5], [14.5, 24.5], [14.5, 18.0], [15.5, 18.0], [18.5, 18.0], [18.5, 21.5], [18.5, 28.0], [13.5, 28.0]]],
  ['289990008', 84, [[-23.0, -15.5], [-30.0, -15.5], [-30.0, -5.5], [-14.5, -5.5], [-4.5, -5.5], [-4.5, -7.0], [-23.0, -7.0], [-23.0, -13.5]]],
  ['290805845', 30, [[-30.0, -5.5], [-30.0, 5.5], [-25.5, 5.5], [-25.5, 8.5], [-14.5, 8.5], [-14.5, -5.5]]],
]
// The tower (way/281777311, the 190 m crown part 289989994, the
// untagged 289989992 inside it and the 205 m penthouse 289990287).
const TOWER = { x0: -4.5, x1: 13.0, y0: -18.0, y1: 23.5 }
const MAIN = 174, CROWN = 189, INNER = 190

const facadeSpec: Facade = { bay: 3.8, ratio: 0.52, floor: 3.45, group: 3, spandrel: 2.4, sill: 1.8, head: 1.8, ground: 13, minLength: 5.5 }
massing({ wall: brick, win, roof, facade: facadeSpec, polys: [...PARTS.map(([, h, r]) => [h, r] as [number, XY[]]),
  [MAIN, [[TOWER.x0, TOWER.y0], [TOWER.x1, TOWER.y0], [TOWER.x1, TOWER.y1], [TOWER.x0, TOWER.y1]]]] })

// Street plinth: three storeys of bronze-and-terracotta frieze over brown
// marble, a shade darker than the brick, laid 0.15 m proud of the outline.
const OUTLINE: XY[] = [[-30, 5.5], [-25.5, 5.5], [-25.5, 8.5], [-14.5, 8.5], [-14.5, -5.5], [-4.5, -5.5], [-4.5, 17.5],
  [-14, 17.5], [-14, 32.5], [23, 32.5], [23, -27], [-30, -27]]
{
  const ring = insetRing(OUTLINE.slice().reverse(), -0.15) // counter-clockwise, grown outward
  const shop: Facade = { bay: 4.6, ratio: 0.6, floor: 5, group: 1, spandrel: 0, sill: 0.8, head: 6, ground: 0.8, minLength: 4 }
  const pts = prism({ wall: base, win: dark, roof: null, ring, z0: 0, z1: 12, facade: shop, bevel: 0.3 })
  // A bevelled cap on the plinth, stepping back to the brick.
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1e-6) continue
    const nn: V3 = [(b[1] - a[1]) / L, (a[0] - b[0]) / L, 0] // outward
    quadN(base, [a[0], a[1], 12], [b[0], b[1], 12], [b[0] - nn[0] * 0.15, b[1] - nn[1] * 0.15, 12.25], [a[0] - nn[0] * 0.15, a[1] - nn[1] * 0.15, 12.25])
  }
}

// Crown: tall buttresses round the tower's edge rise from the 176 m walls to
// 189 m, with recessed bays between them on an inner block that carries the
// 190 m roof; the penthouse stands on that.
const IN = { x0: TOWER.x0 + 2, x1: TOWER.x1 - 2, y0: TOWER.y0 + 2, y1: TOWER.y1 - 2 }
prism({ wall: brick, win, roof, ring: [[IN.x0, IN.y0], [IN.x1, IN.y0], [IN.x1, IN.y1], [IN.x0, IN.y1]], z0: MAIN, z1: INNER, facade: null, bevel: 0.4 })
// The bays between buttresses: windows on the inner block.
const faces: [XY, XY, XY, XY][] = [ // outer a→b, inner a→b (counter-clockwise)
  [[TOWER.x0, TOWER.y0], [TOWER.x1, TOWER.y0], [IN.x0, IN.y0], [IN.x1, IN.y0]],
  [[TOWER.x1, TOWER.y0], [TOWER.x1, TOWER.y1], [IN.x1, IN.y0], [IN.x1, IN.y1]],
  [[TOWER.x1, TOWER.y1], [TOWER.x0, TOWER.y1], [IN.x1, IN.y1], [IN.x0, IN.y1]],
  [[TOWER.x0, TOWER.y1], [TOWER.x0, TOWER.y0], [IN.x0, IN.y1], [IN.x0, IN.y0]],
]
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  prism({ wall: p, win: null, roof: p, ring: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, facade: null, bevel: 0.25 })
}
for (const [oa, ob] of faces) {
  const L = Math.hypot(ob[0] - oa[0], ob[1] - oa[1]), ux = (ob[0] - oa[0]) / L, uy = (ob[1] - oa[1]) / L
  const nx = uy, ny = -ux // outward
  const n = Math.round(L / 4.2), pitch = L / n, fw = 3.0
  // Buttress centres: the two corners plus evenly between.
  for (let k = 0; k <= n; k++) {
    if (k === n) continue // the next face's first buttress is this corner
    const s = k * pitch
    const at = (ss: number, d: number): XY => [oa[0] + ux * ss - nx * d, oa[1] + uy * ss - ny * d]
    const s0 = Math.max(0, s - fw / 2), s1 = Math.min(L, s + fw / 2)
    const corner = k === 0
    const p0 = at(s0, 0), p1 = at(corner ? s0 + 3 : s1, corner ? 3 : 2)
    const x0 = Math.min(p0[0], p1[0]), x1 = Math.max(p0[0], p1[0]), y0 = Math.min(p0[1], p1[1]), y1 = Math.max(p0[1], p1[1])
    box(brick, x0, y0, x1, y1, MAIN, corner ? CROWN + 1 : CROWN - 2.5)
    // Stepped top: a narrower cap set back from the face.
    const q0 = at(s0 + 0.4, 0.6), q1 = at(corner ? s0 + 2.6 : s1 - 0.4, corner ? 3 : 2)
    box(brick, Math.min(q0[0], q1[0]), Math.min(q0[1], q1[1]), Math.max(q0[0], q1[0]), Math.max(q0[1], q1[1]), corner ? CROWN + 1 : CROWN - 2.5, corner ? CROWN + 3 : CROWN)
  }
}
// Window panels on the inner block between buttresses.
for (const [oa, ob, ia, ib] of faces) {
  const L = Math.hypot(ob[0] - oa[0], ob[1] - oa[1]), n = Math.round(L / 4.2), pitch = L / n
  const ux = (ib[0] - ia[0]), uy = (ib[1] - ia[1]), Li = Math.hypot(ux, uy)
  const nx = uy / Li, ny = -ux / Li
  for (let k = 0; k < n; k++) {
    const s = (k + 0.5) * pitch - (L - Li) / 2, w = (pitch - 3.0) * 0.8
    const v = (ss: number, z: number): V3 => [ia[0] + (ux / Li) * ss + nx * 0.05, ia[1] + (uy / Li) * ss + ny * 0.05, z]
    if (s - w / 2 < 0.3 || s + w / 2 > Li - 0.3) continue
    for (const [lo, hi] of [[MAIN + 1, MAIN + 7.5], [MAIN + 8.5, MAIN + 15]]) dark.quad(v(s - w / 2, lo), v(s + w / 2, lo), v(s + w / 2, hi), v(s - w / 2, hi))
  }
}
// Penthouse (way/289990287), lidar 197 m.
prism({ wall: brick, win: null, roof, ring: [[0, 11.5], [9, 11.5], [9, 19.5], [0, 19.5]], z0: INNER, z1: 197, facade: null, bevel: 0.35 })

finishModel('Chanin Building', 'nyc-chanin-building', [
  { part: brick, material: finish('chanin-brick', 0xdcc7a3) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: base, material: finish('chanin-frieze', 0xb59a7a) },
  { part: dark, material: { ...PALETTE.window, name: 'window-2', color: 0x5d6b74 } },
], { bearing: 29, osm: 'way/265947366', height: 197 })
