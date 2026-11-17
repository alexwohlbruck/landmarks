/**
 * Ariat Arena, formerly Dickies Arena (named so 2019 to October 2026; the
 * rename per Wikipedia, "Ariat Arena"), Fort Worth (2019, David M. Schwarz
 * Architects) — original procedural geometry, CC0-1.0.
 * bun generators/dal-ariat-arena.ts
 *
 * A PLAIN MODEL. No licensed exterior photo of the arena could be found:
 * Wikimedia Commons has only an interior concert photo (Category:Dickies
 * Arena), Openverse has one exterior (CC BY-ND, look-only), and Mapillary
 * has no token here. The form comes from lidar, the NAIP aerial and OSM;
 * the facades are left plain (brick with a stone base and cornice) and the
 * portal's glazing is a single estimated panel.
 *
 * Frame: map frame, x east, y north, z up, metres, turned to bearing 0.8
 * (the OSM outline's long walls run at 0.4-1.7°, its ends at 90.7/270.3°).
 * Anchor = area centroid of OSM way/878763596 (still named "Dickies Arena"
 * in OSM, leisure=stadium), -97.368482 32.741060. The site is flat (lidar
 * ground 7.1-7.6 m over the grid's ground_min all round), so z = 0 is the
 * plaza and `elevation` is 0.
 *
 * Identity, in order: the great white hipped dome on an elongated octagon,
 * with its long lantern along the crown; the two towers with white domes
 * flanking the rounded north portal; the low brick concourse ring wrapped
 * round the drum, with bowed entrance bays on the east and west sides and
 * a block at the south end.
 *
 * Evidence:
 *  - lidar: USGS 3DEP TX_Pecos_Dallas_B3_2018 (2018 flight), 1 m grid read
 *    in this frame (tools/lidar_frame.py). The arena opened in November
 *    2019, but the flight already shows the roof, the ring, the portal and
 *    both towers at full height (their domes rounded in the returns), so
 *    the heights are measured, above the plaza (7.2 m over ground_min):
 *    dome eave 23.4 (on the OSM octagon, which is the drum and roof edge,
 *    not the whole building), ridge 40.4 along y -25..25, the profile
 *    parabolic across and along (fitted, within 0.5 m); the lantern 45.1,
 *    about 8 m wide; the concourse ring 17.4 with a parapet to 18.8; the
 *    portal 19.0 with a front parapet to 20.3; the south block 19.0-21.0;
 *    the towers' shafts 25.8 and their domes' tops 34.3.
 *  - plan: the drum and roof edge = OSM way/878763596 (an elongated
 *    octagon, 95 by 130 m), within a metre of the lidar's eave. The ring,
 *    the portal, the towers and the south block are traced from the lidar
 *    (heights over 18 m above ground_min, row by row every 2.5 m) and
 *    checked on USGS NAIP; made symmetric about the outline's axis (the
 *    lidar's are 0.7 m east of it). OSM maps none of them, so the model
 *    stands wider than the outline it replaces.
 *  - colour: USGS NAIP (public domain): the dome, the lantern and the
 *    tower domes white (#dbdad6 sampled), the concourse roofs light warm
 *    grey (#c7beb4), the walls a red-brown brick where the aerial catches
 *    the drum and the portal (#a38578, #c0aa99, hazy) -> brick #bd7a62
 *    (pulled to the palette's lightness, kept red rather than orange);
 *    limestone trim #e9e0cf; windows `window`; lantern glazing `glass`.
 *  - published: architect, opening date and the rename (Wikipedia, "Ariat
 *    Arena"); the design as brick and limestone in the Spanish / Art Deco
 *    manner of the Will Rogers buildings (batch brief).
 *
 * Look-only (not relied on for shape or colour; not in the catalog's
 * references): "Dickies Arena Fort Worth", bk1bennett, Flickr
 * https://www.flickr.com/photos/9781230@N06/52597417740, CC BY-ND 2.0: the
 * north front from the plaza, showing the white dome and lantern, the two
 * towers and a brick front with stone trim and a tall glazed centre.
 *
 * Doubts: every facade detail. The portal's glazing (the brief describes
 * a big arched portal with a tall glass window) is a plain rectangle
 * because no licensed photo shows its shape; the ring and drum carry no
 * windows; the towers' plan (taken as chamfered squares) and their domes'
 * profile are from 1 m lidar only; the east and west bays are taken as
 * bowed (lidar and NAIP show them rounded) and their entrances are not
 * drawn. Night: no evidence; only the portal glazing glows.
 *
 * Left out: signs and logos, the plazas, the canopies, everything inside.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, chamfer, inset, rect, save, walls, type XY } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.74106, -97.368482]
const BEARING = 0.8

const norm = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3 | V3[]) {
  const ns = Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3, n as V3]
  p.tri(a, b, c, undefined, undefined, undefined, [ns[0], ns[1], ns[2]])
  p.tri(a, c, d, undefined, undefined, undefined, [ns[0], ns[2], ns[3]])
}
const R = (x0: number, y0: number, x1: number, y1: number) => rect(Math.min(x0, x1), Math.min(y0, y1), Math.max(x0, x1), Math.max(y0, y1))
const ccw = (r: XY[]) => (r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) > 0 ? r : r.slice().reverse())
/** Split a ring's long edges into pieces no longer than `m` (for the terrain drape). */
function densify(r: XY[], m = 5): XY[] {
  const out: XY[] = []
  r.forEach((a, i) => {
    const b = r[(i + 1) % r.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / m))
    for (let k = 0; k < n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n])
  })
  return out
}
/** Mirror a list of east-side points (north to south) into a full ring about x = 0. */
function mirrored(east: XY[]): XY[] {
  const west = east.slice().reverse().map(([x, y]) => [-x, y] as XY)
  return ccw([...east, ...west])
}
/** An arc of points about c from angle a0 to a1. */
const arc = (c: XY, r: number, a0: number, a1: number, n: number): XY[] =>
  Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as XY })

// --- Plan --------------------------------------------------------------------
// The drum and roof edge: the OSM outline, made symmetric (x ±47.2, the
// north and south edges ±24.4 at y 64.5 / -65.8, the diagonals to y ±44).
const OCT: XY[] = ccw([[24.4, 64.5], [47.2, 43.5], [47.2, -44.8], [24.4, -65.8], [-24.4, -65.8], [-47.2, -44.8], [-47.2, 43.5], [-24.4, 64.5]])
// The concourse ring (lidar, 17.4 m), east half from the north wing round
// to the south; the east and west entrance bays bow out at y -15..15.
const PORTAL_C: XY = [0, 57.1], PORTAL_R = 30.4 // the portal's rounded front, through (±20.5, 80) and (0, 87.5)
// a circle through (57.3, ±15.5) and (63, 0)
const bay = arc([39.1, 0], 23.9, 0.705, -0.705, 8)
const RING_E: XY[] = [
  [28.7, 72.0], [47.9, 72.0], [47.9, 57.0], [52.2, 55.0], [55.6, 50.0], [57.3, 45.0], [57.3, 15.5],
  ...bay,
  [57.3, -15.5], [57.3, -37.5], [56.2, -45.0], [55.0, -52.5], [52.2, -55.5], [47.9, -57.5], [47.9, -71.0], [28.9, -71.0],
]
const RING = mirrored(RING_E)

function build() {
  const brick = new Part(), stone = new Part(), white = new Part(), flat = new Part(), win = new Part(), glass = new Part()

  // ===== Concourse ring ======================================================
  const ring = densify(RING, 5)
  walls(stone, ring, 0, 3.2) // limestone base course
  walls(brick, ring, 3.2, 17.6)
  block(stone, flat, ring, 17.6, 18.8, 0.35) // stone parapet coping, roof inside
  // Portal: rounded north front between the towers.
  const front = arc(PORTAL_C, PORTAL_R, Math.acos(20.5 / PORTAL_R), Math.PI - Math.acos(20.5 / PORTAL_R), 10)
  const portal = densify(ccw([[20.5, 64], ...front, [-20.5, 64]]), 5)
  walls(stone, portal, 0, 3.2)
  walls(brick, portal, 3.2, 19.0)
  block(stone, flat, portal, 19.0, 20.3, 0.35)
  // its tall glazed centre (estimated: a single panel; see the header)
  {
    const g = arc(PORTAL_C, PORTAL_R + 0.06, Math.PI / 2 - 0.2, Math.PI / 2 + 0.2, 4)
    for (let i = 0; i < g.length - 1; i++) {
      const a = g[i], b = g[i + 1]
      const na = norm([a[0] - PORTAL_C[0], a[1] - PORTAL_C[1], 0]), nb = norm([b[0] - PORTAL_C[0], b[1] - PORTAL_C[1], 0])
      quadN(win, [a[0], a[1], 1.0], [b[0], b[1], 1.0], [b[0], b[1], 16.0], [a[0], a[1], 16.0], [na, nb, nb, na])
    }
  }
  // South block.
  const south = densify(R(-28.9, -85.0, 28.9, -70.5), 5)
  walls(stone, south, 0, 3.2)
  walls(brick, south, 3.2, 19.0)
  block(stone, flat, south, 19.0, 20.6, 0.35)

  // ===== Towers ==============================================================
  for (const s of [-1, 1]) {
    const cx = s * 24.75, cy = 75.0
    const sq = chamfer(R(cx - 4.0, cy - 4.0, cx + 4.0, cy + 4.0), 1.2)
    walls(stone, sq, 0, 3.2)
    walls(brick, sq, 3.2, 24.2)
    block(stone, stone, sq, 24.2, 25.8, 0.3)
    // the dome: a full dome of radius 3.9 rising 7.8 to 33.6, and a finial
    const prof: [number, number][] = []
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * Math.PI / 2; prof.push([3.9 * Math.cos(t) ** 0.6, 25.8 + 7.8 * Math.sin(t)]) }
    lathe(white, cx, cy, prof, 16)
    block(white, white, chamfer(R(cx - 0.35, cy - 0.35, cx + 0.35, cy + 0.35), 0.1), 33.6, 34.3, 0.05)
  }

  // ===== Drum and dome =======================================================
  const drum = densify(OCT, 5)
  walls(brick, drum, 17.6, 22.6)
  walls(stone, drum, 22.6, 23.4)
  // Hipped dome: rings between the octagon (d = 1) and the ridge spine
  // x = 0, y -25..25 (d = 0); z = eave + rise (1 - d^2). Each facet keeps
  // its own outward direction, so the hips show as they do on NAIP.
  const EAVE = 23.4, RIDGE = 40.4, Y0 = -25, Y1 = 25
  const spine = ([x, y]: XY): XY => [0, Math.min(Y1, Math.max(Y0, y))]
  const ds = [1, 0.85, 0.7, 0.55, 0.4, 0.25, 0.1]
  const at = (v: XY, d: number): V3 => { const s = spine(v); return [s[0] + (v[0] - s[0]) * d, s[1] + (v[1] - s[1]) * d, EAVE + (RIDGE - EAVE) * (1 - d * d)] }
  // The octagon's corners plus split points: the long sides at the spine's
  // ends, the north and south edges at the middle.
  const corners: XY[] = []
  OCT.forEach((a, i) => {
    const b = OCT[(i + 1) % OCT.length]
    corners.push(a)
    if (Math.abs(a[0] - b[0]) < 1e-6) {
      const ys = [Y0, Y1].filter(y => (y - a[1]) * (y - b[1]) < 0).sort((p, q) => (b[1] > a[1] ? p - q : q - p))
      for (const y of ys) corners.push([a[0], y])
    } else if (Math.abs(a[1] - b[1]) < 1e-6) corners.push([(a[0] + b[0]) / 2, a[1]])
  })
  for (let i = 0; i < corners.length; i++) {
    const a = corners[i], b = corners[(i + 1) % corners.length]
    const ex = b[0] - a[0], ey = b[1] - a[1], el = Math.hypot(ex, ey)
    const out: [number, number] = [ey / el, -ex / el]
    const run = Math.abs((a[0] - spine(a)[0]) * out[0] + (a[1] - spine(a)[1]) * out[1]) || 1
    for (let k = 0; k < ds.length - 1; k++) {
      const d0 = ds[k], d1 = ds[k + 1]
      const A0 = at(a, d0), B0 = at(b, d0), A1 = at(a, d1), B1 = at(b, d1)
      const g0 = 2 * (RIDGE - EAVE) * d0 / run, g1 = 2 * (RIDGE - EAVE) * d1 / run
      const n0 = norm([out[0] * g0, out[1] * g0, 1]), n1 = norm([out[0] * g1, out[1] * g1, 1])
      quadN(white, A0, B0, B1, A1, [n0, n0, n1, n1])
    }
  }
  const topRing = corners.map(c => { const p = at(c, ds[ds.length - 1]); return [p[0], p[1]] as XY })
  cap(white, ccw(topRing), EAVE + (RIDGE - EAVE) * (1 - ds[ds.length - 1] ** 2))
  // The lantern along the crown: a stadium-shaped monitor 8 m wide, a band
  // of glazing under a white lid.
  const lan: XY[] = ccw([...arc([0, 21], 4, 0, Math.PI, 6), ...arc([0, -21], 4, Math.PI, 2 * Math.PI, 6)])
  walls(white, inset(lan, 0.25), RIDGE - 0.6, 42.2)
  walls(glass, inset(lan, 0.25), 42.2, 43.6)
  block(white, white, lan, 43.6, 45.1, 0.6)

  return [
    { part: brick, material: finish('aa-brick', 0xbd7a62) },
    { part: stone, material: finish('aa-limestone', 0xe9e0cf) },
    { part: white, material: finish('aa-dome', 0xe8e8e4) },
    { part: flat, material: finish('aa-roof', 0xd2cbc0) },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
  ]
}

/** A surface of revolution about (cx, cy) from a (radius, z) profile, smooth-shaded. */
function lathe(p: Part, cx: number, cy: number, prof: [number, number][], seg = 16) {
  const nrm = prof.map((_, i) => {
    const [r0, z0] = prof[Math.max(0, i - 1)], [r1, z1] = prof[Math.min(prof.length - 1, i + 1)]
    const l = Math.hypot(z1 - z0, r1 - r0) || 1
    return [(z1 - z0) / l, -(r1 - r0) / l] as [number, number]
  })
  for (let k = 0; k < seg; k++) {
    const a = (k / seg) * 2 * Math.PI, b = ((k + 1) / seg) * 2 * Math.PI
    const P = ([r, z]: [number, number], t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
    const N = (n: [number, number], t: number): V3 => [n[0] * Math.cos(t), n[0] * Math.sin(t), n[1]]
    for (let i = 0; i < prof.length - 1; i++) {
      const A = P(prof[i], a), B = P(prof[i], b), C = P(prof[i + 1], b), D = P(prof[i + 1], a)
      if (prof[i][0] > 1e-6) p.tri(A, B, C, undefined, undefined, undefined, [N(nrm[i], a), N(nrm[i], b), N(nrm[i + 1], b)])
      if (prof[i + 1][0] > 1e-6) p.tri(A, C, D, undefined, undefined, undefined, [N(nrm[i], a), N(nrm[i + 1], b), N(nrm[i + 1], a)])
    }
  }
}

if (import.meta.main) await save('dal-ariat-arena', 'Ariat Arena', ANCHOR, BEARING, build(), 5000)
