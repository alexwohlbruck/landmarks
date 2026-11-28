/**
 * St. Peter's Basilica (Basilica di San Pietro in Vaticano), Vatican City:
 * procedural, CC0-1.0, no textures.
 *   bun generators/rome-st-peters-basilica.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 359.5 (the
 * OSM nave roof and facade edges run 0.5 degrees off the compass). The
 * facade looks east (+x) down Via della Conciliazione. Origin: the OSM
 * outline's centroid along the axis and the outline's axis of symmetry
 * across it (12.453730, 41.902161). The dome's centre is 29.5 m west of
 * the origin. Everything is symmetric about y = 0, as the building is.
 *
 * Modelled: Michelangelo's Greek-cross body (the OSM outline, symmetrised
 * from its cleaner north half) with its three apses, the main cornice and
 * attic, two tiers of windows; Maderno's nave and the facade block; the
 * flat roof terraces, the tiled roofs of the nave and the three arms with
 * half-cones over the apses; the octagonal base and the drum of the main
 * dome with its 16 buttresses of paired columns, the 16 windows with their
 * pediments, the entablature breaking forward over the buttresses and the
 * attic with its pilaster strips; the raised (Della Porta) dome in lead
 * with its 16 travertine ribs and a tier of dormers; the lantern with its
 * buttresses, iron balcony, candelabra crown, the spire, the gilt ball and
 * the cross; the two minor domes (Vignola / Della Porta) at the front
 * corners with their drums of paired columns, ribbed lead domes and
 * lanterns; two low domes over the rear corner chapels; four oval
 * cupolettas over the nave's side chapels and the four small tiled huts on
 * the transept terraces (OSM parts). The facade: eight engaged Corinthian
 * columns and four pilasters of the giant order, the five portals, the two
 * open arches at the ends, the loggia windows and the Benediction loggia,
 * the mezzanine windows, the entablature, the central pediment, the attic
 * with its windows and bell openings, the balustrade, the 13 statues
 * (Christ, John the Baptist and 11 apostles) and the two clock aediculae
 * with their angels.
 *
 * Not modelled: Bernini's colonnade and the square (rome-st-peters-square),
 * the sagrato's steps (outside the OSM outline), the sacristy (a separate
 * building) and the two corridors joining it, the lettering in the frieze
 * (too small to read at map scale), dentils, festoons, capitals' leaves.
 *
 * Sources
 * - OSM (ODbL), fetched 2026-11-28: outline way/244159210 (building=
 *   basilica, height 136.5) and relation/18531045; its parts: dome
 *   way/117968816 (60-110 m, r 30.8), the lantern way/117968821 (110-134,
 *   r 6.25), the cross way/243927787 and way/243927792, the octagonal dome
 *   base way/149240100 (apothem 32 m), the body way/1580032975 (54 m), the
 *   nave roof way/1575937053 (gabled, 28.5 m wide, x -93..84), the facade
 *   parts way/244067225, way/244268552, way/244268554 and the south bell
 *   bay way/629717144, the four minor-dome bases way/422977134,
 *   way/422977135, way/1083232914, way/1083232915 (r ~10.3), the four
 *   small hipped huts way/1580924584, 585, 586 and way/1420231564. Plan
 *   positions are taken from OSM; OSM's heights are on a datum about 9 m
 *   above the published facade height (body 54 m against the facade's
 *   published 45.55 m) and are not used.
 * - Published: Wikipedia (en) "St. Peter's Basilica": dome 136.57 m from
 *   the floor to the top of the cross; internal diameter 41.47 m; the drum's
 *   16 pairs of Corinthian columns, "each of 15 m"; facade 114.69 m wide
 *   and 45.55 m high, giant Corinthian order, 13 statues on the attic
 *   (5.7 m, it.wikipedia). it.wikipedia "Cupola di San Pietro": 16
 *   buttresses and windows with alternating pediments, 16 ribs, Della
 *   Porta's raised profile; "Basilica di San Pietro": nave about 45 m high
 *   inside.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 JanST, "St. Peter's Basilica (Basilica Sancti Petri) seen from St.
 *     Angelo (cropped).jpg", CC BY-SA 4.0 (telephoto from the east: the
 *     dome's silhouette row by row, the drum, lantern, spire, ball and
 *     cross, the south minor dome);
 *     https://commons.wikimedia.org/wiki/File:St._Peter%27s_Basilica_(Basilica_Sancti_Petri)_seen_from_St._Angelo_(cropped).jpg
 *   2 Alvesgaspar, "Basilica di San Pietro in Vaticano September 2015-1a.jpg",
 *     CC BY-SA 4.0 (the facade, frontal: every column, opening, statue and
 *     clock position and height, at 11.49 px/m from the published width);
 *     https://commons.wikimedia.org/wiki/File:Basilica_di_San_Pietro_in_Vaticano_September_2015-1a.jpg
 *   3 Quentin Lowagie (Klow), "Dome of Saint Peter's Basilica from the
 *     Vatican gardens.jpg", CC BY 4.0 (the drum and dome from the west,
 *     the lead and travertine colours, a minor dome's lantern);
 *     https://commons.wikimedia.org/wiki/File:Dome_of_Saint_Peter%27s_Basilica_from_the_Vatican_gardens.jpg
 *   4 Bradley Weber, "St. Peter's from Vatican Museums (9035975901).jpg",
 *     CC BY 2.0 (from the north: the north arm's walls, the north-east
 *     minor dome, the drum);
 *     https://commons.wikimedia.org/wiki/File:St._Peter%27s_from_Vatican_Museums_(9035975901).jpg
 *   5 Stivi, "SanPietrodalGianicolo02.jpg", CC BY-SA 4.0 (night, from the
 *     Gianicolo: the floodlit drum and lantern, the dimmer dome, the long
 *     south side, the minor domes' positions, the arms' roofs);
 *     https://commons.wikimedia.org/wiki/File:SanPietrodalGianicolo02.jpg
 *   6 Jordiferrer, "2016 Views from the dome of Saint Peter's Basilica
 *     02.jpg" and "2016 - Roof of the Saint Peter's Basilica.jpg", CC BY-SA
 *     4.0 (the roofs: the tiled nave roof, the terraces, the oval
 *     cupolettas in their wells, the tiled huts);
 *     https://commons.wikimedia.org/wiki/File:2016_Views_from_the_dome_of_Saint_Peter%27s_Basilica_02.jpg
 *     https://commons.wikimedia.org/wiki/File:2016_-_Roof_of_the_Saint_Peter%27s_Basilica.jpg
 *   7 Alberto Luccaroni, "View of saint Peter basilica from a roof.jpg",
 *     CC BY-SA 3.0 (from the south-east, raised: the side walls at the
 *     facade's height, no nave roof above the facade);
 *     https://commons.wikimedia.org/wiki/File:View_of_saint_Peter_basilica_from_a_roof.jpg
 * - Terrain: Mapterhorn z13 only (~15 m pixels). It rises about 3 m from
 *   the north side to the south side under the footprint and hardly at all
 *   east to west; y = 0 is the basilica floor / portico level, so the south
 *   side sits up to ~3 m into the smoothed ground. Elevation 0.
 * - No lidar (Italy). No look-only sources were used.
 *
 * Numbers (z from the portico floor)
 * - Published: cross top 136.6; facade 114.4 m wide here (OSM; published
 *   114.69) and 45.55 high to the balustrade; statues 5.7.
 * - Measured on photo 1 (3840 px): the facade's attic is 2473 px for
 *   114.69 m (21.56 px/m); the dome stands 136 m further back at ~945 m, so
 *   18.85 px/m there (19.53 for the minor domes). From the cross top down:
 *   cross 136.6-131.5 (arm at 134.4), ball 131.5-129.1 (r 1.2), spire to
 *   ~121, candelabra and lantern attic r 4.6 117.6-121.9, lantern r 5.7
 *   108.6-116.6, platform r 7.7, dome from r 8.4 at 107.6 to r 25.3 at
 *   81.5 (the profile rows below), drum attic r 25.2 75.2-80.6,
 *   entablature 72.7-75.2 (r 29 over the buttresses), paired columns
 *   60.7-72.7 (outer face r 28.4). The drum is 4% narrower than OSM's
 *   dome part (r 30.8, which seems to include the plinth); OSM is used for
 *   the plinth. Minor dome: columns 50.1-56.9 (outer r 9.1), entablature
 *   to 58.6, attic to 60.8, dome to 68.1 (r 7.4), lantern r 2.1 to 73.4,
 *   cross top 76.3.
 * - Measured on photo 2 (11.49 px/m): column centres y = 4.8, 12.5, 16.4,
 *   26.8, pilasters 38.6 and 54.5; columns 26.5 m with capitals,
 *   entablature to 32.6, attic to 43.4, its cornice to 44.3, balustrade to
 *   45.5; pediment over y ±15.2 rising 6.8 m; portals at y 0, ±8.6,
 *   ±21.6; end arches at ±46.0, 7.4 m wide, 13.5 m high; loggia windows
 *   17.5-24; mezzanine 12.5-14.8; attic windows 35-38.3; clocks at ±46.4,
 *   centre 46.6, r 2.0, groups to 51.6.
 * - Estimated: the terraces at the attic cornice (44.3, photo 7 and photo
 *   6, where the facade's statues stand at the terrace's level); the
 *   arms' roofs (eaves 44.6, ridge 50.0: the nave roof peeks between the
 *   statues in photo 1 but not over the balustrade from the piazza in
 *   photos 2 and 7, so the ridge can't be the OSM 60; slope from photo 6); the
 *   octagonal base to 50 and the drum plinth 50-60.7 (photos 3 and 5);
 *   the rear corner domes (OSM tags them as the front ones, but no photo
 *   shows them above the roofline: drawn low, to 58.5 with a small
 *   lantern); the cupolettas' and huts' sizes; the body's windows (two
 *   tiers at ~11 m spacing, from photos 4 and 7).
 * - Simplified: columns are polygons with block capitals; ribs are
 *   single bands; statues are bold standing masses.
 *
 * Review changes (lead, 2026-11-28): the lead is a neutral warm grey;
 *   the 16 ribs are wider (3.1 m at the base); the drum's paired columns are
 *   bold travertine-white prisms with larger windows between; the minor
 *   domes stand taller than photo 1's rows give (drum to 59.6, cupola top
 *   73.6, cross 83.9), per review: their cupola rises to about the main
 *   drum's cornice; the facade's
 *   columns and pilasters stand deeper, in trim, and the statues are bolder;
 *   the lantern's stages were re-fitted to photo 1 (body to 117.0, cornice to
 *   118.2, attic and candelabra to 121.9-123.6, spire to 128.8). Measured
 *   on photo 1, the lantern-to-cross height is 1.08x the dome's rise; the
 *   model's is 1.11x, so its overall height was kept. The facade block's
 *   back and the aisle walls sit 1.2 m inside the OSM outline, clear of
 *   the Cappella Paolina, which abuts the north side.
 *
 * Night: the facade, the drum and the lantern are floodlit brightest, the
 *   dome's lead more dimly, the body's walls a little (photo 5).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { earcut, extrude, prism, rect, smooth, type XY } from './dc-wwii-memorial'

const TAU = Math.PI * 2
const DEG = Math.PI / 180

const stone = new Part() // travertine
const trim = new Part() // statues, ribs, cornices, balustrades
const lead = new Part() // the domes' lead and the lantern spire
const glazing = new Part() // windows (glow at night)
const tile = new Part() // tiled roofs and the brick terraces
const bronze = new Part() // doors, open arches, bell openings, the crosses, the lantern's iron balcony

// ---------------------------------------------------------------- helpers

/**
 * A surface of revolution about a vertical axis through (cx, cy): rows of
 * [r, z] bottom to top, `n` segments starting at angle `phase`. With `arc`
 * only the angles from a0 to a1 are drawn (an engaged column's front).
 * Faces point to the right of the profile's direction of travel.
 */
function lathe(p: Part, cx: number, cy: number, prof: Array<[number, number]>, n: number,
  { phase = 0, arc, crease = 55 }: { phase?: number; arc?: [number, number]; crease?: number } = {}) {
  smooth(p, m => {
    const a0 = arc ? arc[0] : phase, span = arc ? arc[1] - arc[0] : TAU
    const count = arc ? n + 1 : n
    const rings = prof.map(([r, z]) => Array.from({ length: count }, (_, i) => {
      const a = a0 + (span * i) / n
      return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3
    }))
    if (!arc) { m.loft(rings); return }
    for (let k = 0; k < rings.length - 1; k++) for (let i = 0; i < n; i++) {
      m.quad(rings[k][i], rings[k][i + 1], rings[k + 1][i + 1], rings[k + 1][i])
    }
  }, crease)
}

/** A regular n-gon's ring. */
const ngon = (cx: number, cy: number, r: number, n: number, phase = 0): XY[] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos(phase + (TAU * i) / n), cy + r * Math.sin(phase + (TAU * i) / n)] as XY)

/** A flat cap over a convex ring at height z. */
function disc(p: Part, ring: XY[], z: number, up = true) {
  p.cap(ring.map(([x, y]) => [x, y, z] as V3), up)
}

/** Triangle wound to face `dir`. */
function tri(p: Part, a: V3, b: V3, c: V3, dir: V3) {
  const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (n[0] * dir[0] + n[1] * dir[1] + n[2] * dir[2] < 0) p.tri(a, c, b)
  else p.tri(a, b, c)
}
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, dir: V3) {
  tri(p, a, b, c, dir)
  tri(p, a, c, d, dir)
}
/** A flat polygon in (u, v) emitted through `at`, facing `dir`. */
function face(p: Part, ring: XY[], at: (u: number, v: number) => V3, dir: V3) {
  for (const [i, j, k] of earcut(ring)) tri(p, at(...ring[i]), at(...ring[j]), at(...ring[k]), dir)
}

/** An opening's outline in (u, v): width w from v0 to v1, a semicircular head if `round`. */
function opening(w: number, v0: number, v1: number, round: boolean, seg = 6): XY[] {
  const h = w / 2
  if (!round) return [[-h, v0], [h, v0], [h, v1], [-h, v1]]
  const spring = v1 - h
  const pts: XY[] = [[-h, v0], [h, v0]]
  for (let k = 0; k <= seg; k++) {
    const a = (Math.PI * k) / seg
    pts.push([h * Math.cos(a), spring + h * Math.sin(a)])
  }
  return pts
}

/** A vertical panel on a wall at (x, y), facing the horizontal normal (nx, ny), `off` in front of it. */
function wallPanel(p: Part, x: number, y: number, nx: number, ny: number, ring: XY[], off = 0.05) {
  const tx = -ny, ty = nx
  face(p, ring, (u, v) => [x + tx * u + nx * off, y + ty * u + ny * off, v], [nx, ny, 0])
}

/** A box between corner ranges (10 tris, or with a bevel b). */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0, bottom = false) {
  prism(p, rect((x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2), z0, z1, b, bottom)
}

/**
 * A block set radially about (cx, cy) at angle a, from radius r0 (inside a
 * wall, so its back is never seen) to r1, tangential half-width hw: the
 * outer face, two sides and the top.
 */
function radialBlock(p: Part, cx: number, cy: number, a: number, r0: number, r1: number, hw: number, z0: number, z1: number, top = true) {
  const c = Math.cos(a), s = Math.sin(a), tx = -s, ty = c
  const P = (r: number, t: number, z: number): V3 => [cx + c * r + tx * t, cy + s * r + ty * t, z]
  quad(p, P(r1, -hw, z0), P(r1, hw, z0), P(r1, hw, z1), P(r1, -hw, z1), [c, s, 0])
  quad(p, P(r0, -hw, z0), P(r1, -hw, z0), P(r1, -hw, z1), P(r0, -hw, z1), [-tx, -ty, 0])
  quad(p, P(r0, hw, z0), P(r1, hw, z0), P(r1, hw, z1), P(r0, hw, z1), [tx, ty, 0])
  if (top) quad(p, P(r0, -hw, z1), P(r1, -hw, z1), P(r1, hw, z1), P(r0, hw, z1), [0, 0, 1])
}

/**
 * Raised ribs on a dome: rounded ridges of half-width hw (narrowing to
 * hwTop) standing h out of a lathe profile, at the given angles.
 */
function ribs(target: Part, cx: number, cy: number, prof: Array<[number, number]>, angles: number[], hw: number, hwTop: number, h: number) {
  smooth(target, p => {
    for (const a of angles) {
      const c = Math.cos(a), s = Math.sin(a), tx = -s, ty = c
      const sec = prof.map(([r, z], j) => {
        const w = hw + ((hwTop - hw) * j) / (prof.length - 1), o = r - 0.15
        return [[cx + c * o - tx * w, cy + s * o - ty * w, z], [cx + c * (r + h), cy + s * (r + h), z], [cx + c * o + tx * w, cy + s * o + ty * w, z]] as V3[]
      })
      for (let j = 0; j < sec.length - 1; j++) {
        const A = sec[j], B = sec[j + 1]
        quad(p, A[0], A[1], B[1], B[0], [c - tx, s - ty, 0.5])
        quad(p, A[1], A[2], B[2], B[1], [c + tx, s + ty, 0.5])
      }
    }
  }, 150)
}

/** Mirror a list of offsets about y = 0. */
const both = (ys: number[]) => ys.flatMap(y => (y === 0 ? [0] : [-y, y]))

// ---------------------------------------------------------------- layout

const DX = -29.5 // the dome's centre (y 0)
const TERRACE = 44.3 // body cornice and roof terraces
const FRONT = 104.6 // facade wall plane
const FW = 57.2 // facade half-width

// The plan: OSM's outline, north half (y >= 0), counter-clockwise from the
// facade's axis, mirrored for the south. The facade block's back and the
// aisle wall are kept 1.2 m inside the outline, clear of the Cappella
// Paolina (way/215302734), which abuts the north side. The corridors to the sacristy on
// the south side are left out.
const HALF: XY[] = [
  [FRONT, 0], [FRONT, FW], [91.8, FW], [91.8, 36.0], [47.5, 36.0], [47.5, 49.0], [23.0, 49.0], [23.0, 52.5],
  [13.5, 52.5], [13.5, 51.0], [3.5, 51.0], [1.5, 54.5], [-3.8, 58.0], [-8.5, 61.0],
]
// The north apse: a semicircle about (DX, 60.5), r 18.6.
const APSE_R = 18.6, APSE_C = 60.5
for (let k = 0; k <= 8; k++) {
  const a = (Math.PI * k) / 8
  HALF.push([DX + APSE_R * Math.cos(a), APSE_C + APSE_R * Math.sin(a)])
}
HALF.push([-50.5, 62.5], [-58.8, 57.9], [-62.8, 53.5], [-87.3, 53.5], [-87.3, 41.8], [-84.4, 41.8], [-84.4, 33.5],
  [-89.2, 31.9], [-96.0, 22.7], [-95.2, 19.6])
// The west apse about (WX, 0), r 19.2, from 112 degrees to 180.
const WX = -91.0, WR = 19.2
for (let k = 0; k <= 4; k++) {
  const a = (112 + (68 * k) / 4) * DEG
  HALF.push([WX + WR * Math.cos(a), WR * Math.sin(a)])
}
HALF[HALF.length - 1][1] = 0
const PLAN: XY[] = [...HALF.slice(0, -1), ...HALF.slice(1).reverse().map(([x, y]) => [x, -y] as XY)]

// ---------------------------------------------------------------- body

// The walls up to the terrace; the main cornice as a band standing out of
// them (inside the facade's own entablature at the front); the terraces.
{
  const ring = (pts: XY[], z: number) => pts.map(([x, y]) => [x, y, z] as V3)
  // The outline pushed out by o along each corner's bisector (mitred).
  const offset = (o: number): XY[] => PLAN.map((p, i) => {
    const a = PLAN[(i + PLAN.length - 1) % PLAN.length], b = PLAN[(i + 1) % PLAN.length]
    const e0 = [p[0] - a[0], p[1] - a[1]], e1 = [b[0] - p[0], b[1] - p[1]]
    const l0 = Math.hypot(e0[0], e0[1]), l1 = Math.hypot(e1[0], e1[1])
    const n0 = [e0[1] / l0, -e0[0] / l0], n1 = [e1[1] / l1, -e1[0] / l1]
    const m = [n0[0] + n1[0], n0[1] + n1[1]], ml = Math.hypot(m[0], m[1])
    const k = o / Math.max(0.35, (m[0] * n0[0] + m[1] * n0[1]) / ml)
    return [p[0] + (m[0] / ml) * k, p[1] + (m[1] / ml) * k] as XY
  })
  smooth(stone, m => m.loft([ring(PLAN, 0), ring(PLAN, TERRACE)]), 35)
  const band = offset(0.55)
  smooth(trim, m => m.loft([ring(band, 30.6), ring(band, 32.6)]), 35)
  for (const [i, j, k] of earcut(PLAN)) {
    tri(tile, [...PLAN[i], TERRACE] as V3, [...PLAN[j], TERRACE] as V3, [...PLAN[k], TERRACE] as V3, [0, 0, 1])
  }
}

// Windows on Michelangelo's walls: round-headed below the main cornice and
// square in the attic, one per bay at ~11 m along the perimeter, where the
// wall runs straight or gently curved; none on the facade block.
{
  const segs = PLAN.map((p, i) => {
    const q = PLAN[(i + 1) % PLAN.length]
    return { p, q, L: Math.hypot(q[0] - p[0], q[1] - p[1]) }
  })
  const total = segs.reduce((s, g) => s + g.L, 0)
  const at = (s: number): XY => {
    let t = ((s % total) + total) % total
    for (const g of segs) {
      if (t <= g.L) return [g.p[0] + ((g.q[0] - g.p[0]) * t) / g.L, g.p[1] + ((g.q[1] - g.p[1]) * t) / g.L]
      t -= g.L
    }
    return segs[0].p
  }
  // Walk the north half only and mirror, so the windows are symmetric.
  const half = segs.slice(0, HALF.length - 1).reduce((s, g) => s + g.L, 0)
  const SP = 14.0
  // Where a flat element of width w fits on the wall at s: its centre and
  // outward normal, or nothing across a corner or a sharp bend.
  const fit = (s: number, w: number) => {
    const a = at(s - w / 2 - 0.7), b = at(s + w / 2 + 0.7), m = at(s)
    const chord = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (chord < w + 1.2 || Math.hypot(m[0] - (a[0] + b[0]) / 2, m[1] - (a[1] + b[1]) / 2) > 0.2 || m[0] > 86) return undefined
    return { m, nx: (b[1] - a[1]) / chord, ny: -(b[0] - a[0]) / chord }
  }
  const placed: number[] = []
  for (let s = 0; s < half; s += 0.5) {
    if (placed.length && s - placed[placed.length - 1] < SP) continue
    const f = fit(s, 3.0)
    if (!f) continue
    placed.push(s)
    for (const k of [1, -1]) {
      wallPanel(glazing, f.m[0], k * f.m[1], f.nx, k * f.ny, opening(2.8, 10.0, 16.5, false), 0.06)
      wallPanel(glazing, f.m[0], k * f.m[1], f.nx, k * f.ny, opening(2.6, 36.0, 40.0, false), 0.05)
    }
  }
  // The giant pilasters between the bays, as pale strips up to the cornice.
  for (let i = 0; i < placed.length - 1; i++) {
    if (placed[i + 1] - placed[i] > 2.2 * SP) continue
    const f = fit((placed[i] + placed[i + 1]) / 2, 2.4)
    if (!f) continue
    for (const k of [1, -1]) wallPanel(trim, f.m[0], k * f.m[1], f.nx, k * f.ny, opening(2.4, 0.8, 30.6, false), 0.06)
  }
}

// ---------------------------------------------------------------- roofs

// Tiled roofs over the nave and the three arms: eaves 44.6, ridge 50.0,
// 28.5 m wide (OSM's nave roof), half-cones over the apses and a hip at the
// facade's back, so the roof stays hidden behind the balustrade.
{
  const W = 14.25, E0 = 44.6, R = 50.0
  const side = (a: XY, b: XY, s: number, alongX: boolean) => {
    const n: V3 = alongX ? [0, s * (R - E0), W] : [s * (R - E0), 0, W]
    const out: V3 = alongX ? [0, s, 0] : [s, 0, 0]
    const e0: V3 = alongX ? [a[0], s * W, E0] : [DX + s * W, a[1], E0], e1: V3 = alongX ? [b[0], s * W, E0] : [DX + s * W, b[1], E0]
    const r0: V3 = alongX ? [a[0], 0, R] : [DX, a[1], R], r1: V3 = alongX ? [b[0], 0, R] : [DX, b[1], R]
    quad(tile, e0, e1, r1, r0, n)
    quad(stone, [e0[0], e0[1], TERRACE], [e1[0], e1[1], TERRACE], e1, e0, out)
  }
  for (const s of [-1, 1]) {
    side([WX, 0], [80, 0], s, true)
    side([0, -APSE_C], [0, APSE_C], s, false)
  }
  const H = 89
  tri(tile, [H, -W, E0], [H, W, E0], [80, 0, R], [1, 0, 1])
  for (const s of [-1, 1]) {
    tri(tile, [80, s * W, E0], [H, s * W, E0], [80, 0, R], [0, s, 1])
    quad(stone, [80, s * W, TERRACE], [H, s * W, TERRACE], [H, s * W, E0], [80, s * W, E0], [0, s, 0])
  }
  const cone = (cx: number, cy: number, a0: number) => {
    const N = 6
    for (let k = 0; k < N; k++) {
      const t0 = a0 + (Math.PI * k) / N, t1 = a0 + (Math.PI * (k + 1)) / N, tm = (t0 + t1) / 2
      const p0: V3 = [cx + W * Math.cos(t0), cy + W * Math.sin(t0), E0], p1: V3 = [cx + W * Math.cos(t1), cy + W * Math.sin(t1), E0]
      tri(tile, p0, p1, [cx, cy, R], [Math.cos(tm) * (R - E0), Math.sin(tm) * (R - E0), W])
      quad(stone, [p0[0], p0[1], TERRACE], [p1[0], p1[1], TERRACE], p1, p0, [Math.cos(tm), Math.sin(tm), 0])
    }
  }
  cone(WX, 0, Math.PI / 2)
  cone(DX, APSE_C, 0)
  cone(DX, -APSE_C, Math.PI)
}

// The four small tiled huts beside the north and south arms (OSM hipped
// parts, 9 m square).
for (const x of [-14.5, -46.5]) for (const s of [-1, 1]) {
  const y = s * 53.0
  box(stone, x - 4.5, x + 4.5, y - 4.5, y + 4.5, TERRACE, TERRACE + 2.4)
  const z0 = TERRACE + 2.4, z1 = z0 + 2.0
  const c: V3[] = [[x - 4.8, y - 4.8, z0], [x + 4.8, y - 4.8, z0], [x + 4.8, y + 4.8, z0], [x - 4.8, y + 4.8, z0]]
  for (let k = 0; k < 4; k++) {
    const a = c[k], b = c[(k + 1) % 4]
    tri(tile, a, b, [x, y, z1], [(a[0] + b[0]) / 2 - x, (a[1] + b[1]) / 2 - y, 3])
  }
}

// Oval cupolettas over the nave's side chapels (photo 6).
for (const x of [58, 76]) for (const s of [-1, 1]) {
  const y = s * 22.0
  lathe(stone, x, y, [[2.6, TERRACE], [2.6, TERRACE + 3.4]], 6)
  lathe(lead, x, y, [[2.85, TERRACE + 3.4], [2.0, TERRACE + 5.3], [0.01, TERRACE + 6.1]], 6, { crease: 70 })
}

// ---------------------------------------------------------------- the facade

{
  const COL_TOP = 26.5, ENT = 32.6, ATTIC = 43.4, CORN = 44.3, BAL = 45.5
  const COLS = [4.8, 12.5, 16.4, 26.8]
  const PIL = [38.6, 54.5]
  // Columns: engaged shafts on base blocks, flared capitals with abaci.
  for (const yc of COLS) for (const s of [-1, 1]) {
    const y = s * yc, x = FRONT + 0.75
    lathe(trim, x, y, [[1.75, 0], [1.6, 2.4], [1.48, 12.0], [1.32, 23.7]], 6, { arc: [-120 * DEG, 120 * DEG], crease: 70 })
    lathe(trim, x, y, [[1.32, 23.7], [1.95, 26.5]], 6, { arc: [-120 * DEG, 120 * DEG], crease: 50 })
  }
  // Pilasters with their capitals.
  for (const yc of PIL) for (const s of [-1, 1]) {
    const ya = s * yc - 1.8, yb = Math.min(s * yc + 1.8, FW)
    box(trim, FRONT - 0.2, FRONT + 1.15, Math.max(ya, -FW), yb, 0, 23.7)
    box(trim, FRONT - 0.2, FRONT + 0.95, Math.max(ya - 0.15, -FW), Math.min(yb + 0.15, FW), 23.7, COL_TOP)
  }
  // The entablature, breaking forward over the columns, with the frieze's
  // inscription read as a darker band.
  box(stone, FRONT - 0.2, FRONT + 0.9, -FW, FW, COL_TOP, ENT - 1.3)
  box(trim, FRONT - 0.2, FRONT + 1.6, -FW, FW, ENT - 1.3, ENT, 0.25)
  quad(bronze, [FRONT + 0.92, -44, COL_TOP + 2.6], [FRONT + 0.92, 44, COL_TOP + 2.6], [FRONT + 0.92, 44, COL_TOP + 3.3], [FRONT + 0.92, -44, COL_TOP + 3.3], [1, 0, 0])
  // Attic pilasters over the columns and pilasters; the attic cornice and the balustrade.
  for (const yc of [...COLS, ...PIL]) for (const s of [-1, 1]) {
    const y = s * yc
    radialBlock(stone, 0, y, 0, FRONT - 0.2, FRONT + 0.45, Math.min(1.3, FW - Math.abs(y)), ENT, ATTIC, false)
  }
  box(trim, FRONT - 0.3, FRONT + 1.0, -FW, FW, ATTIC, CORN, 0.2)
  box(trim, FRONT - 1.2, FRONT + 0.2, -FW + 0.4, FW - 0.4, CORN, BAL, 0.15)

  // The pediment over the centre: tympanum and raking cornices.
  {
    const hw = 15.2, rise = 6.8, base = ENT, X0 = FRONT + 0.2, X1 = FRONT + 1.4
    extrude(stone, [[-hw, base], [hw, base], [0, base + rise]], X0, X1 - 0.4, (u, v, w) => [w, u, v], { caps: [false, true] })
    for (const s of [-1, 1]) {
      extrude(trim, [[s * hw, base], [0, base + rise], [0, base + rise + 0.9], [s * (hw + 0.7), base]], X0, X1, (u, v, w) => [w, u, v], { caps: [false, true] })
    }
  }

  // Portals: the five doors in the centre, the open arches at the ends.
  const at = (y: number, ring: XY[], m = bronze, off = 0.04) => wallPanel(m, FRONT, y, 1, 0, ring, off)
  at(0, opening(4.6, 0, 9.6, false))
  for (const s of [-1, 1]) {
    at(s * 8.6, opening(3.6, 0, 7.4, true, 4))
    at(s * 21.6, opening(4.8, 0, 10.8, false))
    at(s * 46.0, opening(7.4, 0, 13.5, true, 6))
  }
  // Loggia windows (the centre one the Benediction loggia) on their
  // balconies, mezzanine windows, the windows over the end arches.
  for (const y of both([0, 8.6, 21.6, 32.7])) {
    at(y, opening(3.2, 17.4, 24.2, true, 4), glazing, 0.05)
    radialBlock(trim, 0, y, 0, FRONT - 0.1, FRONT + 0.55, 2.3, 16.6, 17.4)
    at(y, opening(2.6, 12.5, 14.8, false), glazing, 0.05)
  }
  for (const s of [-1, 1]) at(s * 46.0, opening(3.0, 17.8, 23.6, true, 4), glazing, 0.05)
  // Attic windows, and the bell openings at the ends.
  for (const y of both([8.3, 21.0, 32.0])) at(y, opening(2.8, 35.0, 38.3, false), glazing, 0.05)
  for (const s of [-1, 1]) at(s * 46.0, opening(3.6, 34.6, 39.6, true, 4), bronze, 0.05)

  // The 13 statues: bold standing figures on the balustrade.
  const statue = (y: number) => {
    const x = FRONT - 0.5, z = BAL
    lathe(trim, x, y, [[1.45, z - 0.3], [1.15, z + 4.6], [0.7, z + 5.3], [0.01, z + 6.4]], 4, { phase: TAU / 8, crease: 100 })
  }
  for (const y of both([0, 4.8, 12.5, 16.4, 26.8, 38.6, 54.0])) statue(y)

  // The clock aediculae over the end bays, with the angels beside them.
  for (const s of [-1, 1]) {
    const y = s * 46.4, x = FRONT - 0.6
    box(stone, x - 1.6, x + 1.0, y - 3.4, y + 3.4, CORN, 47.4)
    const top: XY[] = []
    for (let k = 0; k <= 6; k++) top.push([3.4 * Math.cos((Math.PI * k) / 6), 47.4 + 3.4 * Math.sin((Math.PI * k) / 6)])
    extrude(stone, top, x - 1.6, x + 1.0, (u, v, w) => [w, y + u, v], { caps: [false, true] })
    const dial = (r: number, m: Part, off: number) => face(m, ngon(0, 46.6, r, 12), (u, v) => [x + 1.0 + off, y + u, v], [1, 0, 0])
    dial(2.6, lead, 0.04)
    dial(2.15, trim, 0.08)
    lathe(trim, x - 0.3, y, [[1.2, 50.6], [1.3, 51.4], [0.01, 52.6]], 5)
    for (const t of [-1, 1]) {
      lathe(trim, x - 0.3, y + t * 4.7, [[1.5, CORN], [1.2, CORN + 2.4], [0.01, CORN + 4.2]], 4, { phase: TAU / 8, crease: 100 })
    }
  }
}

// ---------------------------------------------------------------- the main dome

{
  const cx = DX, cy = 0
  const N = 16
  const BUT = (k: number) => (11.25 + 22.5 * k) * DEG // buttresses and ribs
  const WIN = (k: number) => 22.5 * k * DEG // windows (one faces the facade)
  const BUTS = Array.from({ length: 16 }, (_, k) => BUT(k))
  // A 16-gon with its corners on the buttresses: its flat faces carry the windows.
  const R16 = (r: number) => r / Math.cos(Math.PI / 16)
  // The octagonal base (OSM way/149240100, apothem 32 m).
  prism(stone, ngon(cx, cy, 32 / Math.cos(TAU / 16), 8, TAU / 16), TERRACE, 50.0, 0.4)
  // The drum's plinth, with a cornice.
  lathe(stone, cx, cy, [[R16(30.3), 50.0], [R16(30.3), 56.6], [R16(29.6), 56.7], [R16(29.6), 60.7]], N, { phase: BUT(0), crease: 30 })
  disc(trim, ngon(cx, cy, R16(29.6), N, BUT(0)), 60.7)
  // The drum's wall and its 16 windows with alternating pediments.
  lathe(stone, cx, cy, [[R16(25.6), 60.7], [R16(25.6), 72.7]], N, { phase: BUT(0), crease: 30 })
  for (let k = 0; k < 16; k++) {
    const a = WIN(k), nx = Math.cos(a), ny = Math.sin(a)
    const px = cx + 25.6 * nx, py = cy + 25.6 * ny
    wallPanel(glazing, px, py, nx, ny, opening(3.4, 63.0, 69.8, false), 0.05)
    const ring: XY[] = k % 2 ? [[-2.3, 69.8], [2.3, 69.8], [0, 71.4]] : [[-2.3, 69.8], [2.3, 69.8], [1.5, 70.9], [0, 71.3], [-1.5, 70.9]]
    wallPanel(trim, px, py, nx, ny, ring, 0.08)
  }
  // Buttresses with their paired columns.
  for (const a of BUTS) {
    const c = Math.cos(a), s = Math.sin(a), tx = -s, ty = c
    radialBlock(stone, cx, cy, a, 25.0, 27.0, 2.6, 60.7, 72.7, false)
    // the paired columns, bold travertine-white prisms standing out of the buttress
    for (const t of [-1.4, 1.4]) radialBlock(trim, cx + tx * t, cy + ty * t, a, 26.6, 28.6, 0.8, 60.7, 72.7, false)
  }
  // The entablature: a ring over the wall, breaking forward over the buttresses.
  lathe(stone, cx, cy, [[R16(26.4), 72.7], [R16(26.4), 75.2]], N, { phase: BUT(0), crease: 30 })
  for (const a of BUTS) radialBlock(trim, cx, cy, a, 26.0, 29.0, 2.95, 72.7, 75.2)
  // The attic and its cornice.
  disc(trim, ngon(cx, cy, R16(26.4), N, BUT(0)), 75.2)
  lathe(stone, cx, cy, [[R16(25.0), 75.2], [R16(25.0), 80.6]], N, { phase: BUT(0), crease: 30 })
  lathe(trim, cx, cy, [[R16(25.0), 80.6], [R16(26.0), 80.75], [R16(26.0), 81.5], [R16(24.8), 81.5]], N, { phase: BUT(0), crease: 50 })

  // The dome: Della Porta's raised profile, from photo 1's silhouette less
  // the ribs' 0.5 m. Flat lead fields between the 16 ribs.
  const PROF: Array<[number, number]> = [
    [24.8, 81.5], [23.4, 87.9], [20.8, 94.3], [18.9, 97.5], [16.6, 100.6],
    [13.8, 103.2], [11.0, 105.4], [8.4, 107.2],
  ]
  lathe(lead, cx, cy, [...PROF.map(([r, z]) => [R16(r), z] as [number, number]), [R16(8.4), 107.6], [0.01, 107.6]], N, { phase: BUT(0), crease: 40 })
  ribs(trim, cx, cy, [0, 1, 2, 4, 5, 7].map(i => [R16(PROF[i][0]) - 0.05, PROF[i][1]] as [number, number]), BUTS, 1.55, 0.8, 0.7)
  // The three tiers of dormers, one per lead field in each, as dark
  // openings flush on the field.
  for (const [row, z, hw, hh] of [[0, 85.0, 0.55, 0.6], [1, 92.0, 0.75, 1.0], [4, 101.6, 0.5, 0.55]] as const) for (let k = 0; k < 16; k++) {
    const a = WIN(k), c = Math.cos(a), s = Math.sin(a)
    const [r0, z0] = PROF[row], [r1, z1] = PROF[row + 1], r = r0 + ((r1 - r0) * (z - z0)) / (z1 - z0)
    const ml = Math.hypot(r1 - r0, z1 - z0), mr = (r1 - r0) / ml, mz = (z1 - z0) / ml // along the meridian, upward
    const P = (u: number, v: number): V3 => {
      const rr = r + mr * v + mz * 0.06, zz = z + mz * v - mr * 0.06
      return [cx + c * rr - s * u, cy + s * rr + c * u, zz]
    }
    quad(bronze, P(-hw, -hh), P(hw, -hh), P(hw, hh), P(-hw, hh), [c * mz, s * mz, -mr])
  }

  // The lantern: platform, iron balcony, the body with eight buttresses and
  // arched openings, entablature, attic with the candelabra crown, spire,
  // gilt ball and cross (photo 1).
  lathe(stone, cx, cy, [[8.6, 107.6], [8.6, 108.6], [0.01, 108.6]], 8, { phase: TAU / 16, crease: 50 })
  lathe(bronze, cx, cy, [[7.7, 108.6], [7.7, 109.8]], 12)
  lathe(stone, cx, cy, [[4.6, 108.6], [4.6, 117.0]], 8, { phase: TAU / 16, crease: 50 })
  for (let k = 0; k < 8; k++) {
    radialBlock(stone, cx, cy, (22.5 + 45 * k) * DEG, 4.0, 5.85, 1.0, 108.6, 117.0, false)
    const w = 45 * k * DEG
    wallPanel(glazing, cx + 4.25 * Math.cos(w), cy + 4.25 * Math.sin(w), Math.cos(w), Math.sin(w), opening(1.7, 110.0, 115.6, true, 3), 0.04)
  }
  lathe(trim, cx, cy, [[4.5, 117.0], [6.05, 117.0], [6.05, 118.2], [4.6, 118.2]], 8, { phase: TAU / 16, crease: 50 })
  lathe(stone, cx, cy, [[4.6, 118.2], [4.6, 121.9], [2.6, 121.9]], 8, { phase: TAU / 16, crease: 50 })
  // the candelabra crown: eight flames round the attic's top
  smooth(trim, m => {
    for (let k = 0; k < 8; k++) {
      const a = (22.5 + 45 * k) * DEG
      const x = cx + 4.1 * Math.cos(a), y = cy + 4.1 * Math.sin(a)
      for (let j = 0; j < 4; j++) {
        const b0 = (j * TAU) / 4, b1 = ((j + 1) * TAU) / 4
        tri(m, [x + 0.45 * Math.cos(b0), y + 0.45 * Math.sin(b0), 121.9], [x + 0.45 * Math.cos(b1), y + 0.45 * Math.sin(b1), 121.9], [x, y, 123.6],
          [Math.cos((b0 + b1) / 2), Math.sin((b0 + b1) / 2), 0.3])
      }
    }
  }, 100)
  const spire: Array<[number, number]> = []
  for (let k = 0; k <= 4; k++) spire.push([0.45 + 2.15 * Math.pow(1 - k / 4, 1.6), 121.9 + 6.9 * (k / 4)])
  lathe(lead, cx, cy, [...spire, [0.01, 128.6]], 8, { crease: 60 })
  {
    const rows: Array<[number, number]> = []
    for (let k = 0; k <= 4; k++) {
      const e = -Math.PI / 2 + (Math.PI * k) / 4
      rows.push([Math.max(0.01, 1.25 * Math.cos(e)), 130.2 + 1.25 * Math.sin(e)])
    }
    lathe(trim, cx, cy, rows, 6, { crease: 80 })
  }
  box(bronze, cx - 0.25, cx + 0.25, -0.25, 0.25, 131.3, 136.6)
  box(bronze, cx - 0.25, cx + 0.25, -1.25, 1.25, 134.0, 134.6)
}

// ---------------------------------------------------------------- minor domes

/** A minor dome at a front corner (photo 1). */
function minorDome(cx: number, cy: number) {
  const N = 16
  const R8 = (r: number) => r / Math.cos(Math.PI / 8)
  // Raised at review over photo 1's rows (drum +2.7 m, cupola +3.2 m): the
  // lead reads the cupola's top at about the main drum's cornice (75 m).
  const B = 50.3, C = 59.6, E = 61.6, A = 64.0, DR = 6.9, DH = 10.0
  prism(stone, ngon(cx, cy, 10.0, 8, TAU / 16), TERRACE, B, 0)
  // Drum: an octagon with eight buttresses of paired columns at its corners
  // and an arched window in each face.
  lathe(stone, cx, cy, [[R8(6.8), B], [R8(6.8), C]], 8, { phase: TAU / 16, crease: 30 })
  for (let k = 0; k < 8; k++) {
    const a = (22.5 + 45 * k) * DEG
    radialBlock(stone, cx, cy, a, 6.4, 8.0, 1.25, B, C, false)
    radialBlock(trim, cx, cy, a, 7.9, 8.9, 1.05, B, C - 0.4, false)
    const w = 45 * k * DEG
    wallPanel(glazing, cx + 6.8 * Math.cos(w), cy + 6.8 * Math.sin(w), Math.cos(w), Math.sin(w), opening(2.0, B + 1.6, C - 1.2, true, 3), 0.05)
  }
  lathe(trim, cx, cy, [[R8(6.8), C - 0.4], [R8(9.4), C - 0.4], [R8(9.4), E], [R8(7.4), E]], 8, { phase: TAU / 16, crease: 50 })
  lathe(stone, cx, cy, [[R8(7.4), E], [R8(7.4), A - 0.3], [R8(7.6), A - 0.2], [R8(7.6), A], [DR, A]], 8, { phase: TAU / 16, crease: 30 })
  // The ribbed lead dome.
  const prof: Array<[number, number]> = []
  for (let k = 0; k <= 3; k++) {
    const e = (Math.PI / 2) * (k / 3) * 0.82
    prof.push([DR * Math.cos(e), A + DH * Math.sin(e)])
  }
  lathe(lead, cx, cy, [...prof, [0.01, prof[prof.length - 1][1]]], N, { phase: TAU / 16, crease: 40 })
  ribs(trim, cx, cy, prof, Array.from({ length: 8 }, (_, k) => (22.5 + 45 * k) * DEG), 0.55, 0.3, 0.35)
  // The lantern, its cap, ball and cross.
  const zt = prof[prof.length - 1][1]
  lathe(stone, cx, cy, [[2.0, zt - 0.3], [2.0, zt + 5.6], [2.35, zt + 5.7], [1.9, zt + 6.2]], 8, { phase: TAU / 16, crease: 50 })
  for (let k = 0; k < 8; k++) {
    const a = (TAU * k) / 8
    wallPanel(glazing, cx + 1.85 * Math.cos(a), cy + 1.85 * Math.sin(a), Math.cos(a), Math.sin(a), opening(0.9, zt + 1.0, zt + 4.6, false), 0.04)
  }
  lathe(lead, cx, cy, [[1.9, zt + 6.2], [1.2, zt + 7.4], [0.01, zt + 8.3]], 8, { phase: TAU / 16, crease: 60 })
  lathe(trim, cx, cy, [[0.01, zt + 8.2], [0.45, zt + 8.6], [0.01, zt + 9.0]], 5)
  box(bronze, cx - 0.12, cx + 0.12, cy - 0.12, cy + 0.12, zt + 8.9, zt + 10.3)
  box(bronze, cx - 0.12, cx + 0.12, cy - 0.55, cy + 0.55, zt + 9.6, zt + 9.85)
}
for (const s of [-1, 1]) minorDome(7.75, s * 37.0)

/** The low domes over the rear corner chapels (estimated; see the header). */
function rearDome(cx: number, cy: number) {
  prism(stone, ngon(cx, cy, 9.0, 8, TAU / 16), TERRACE, 48.5, 0)
  lathe(stone, cx, cy, [[6.5, 48.5], [6.5, 52.6], [6.9, 52.7], [6.9, 53.2], [6.2, 53.2]], 8, { phase: TAU / 16, crease: 30 })
  const prof: Array<[number, number]> = []
  for (let k = 0; k <= 2; k++) {
    const e = (Math.PI / 2) * (k / 2) * 0.8
    prof.push([6.2 * Math.cos(e), 53.2 + 5.2 * Math.sin(e)])
  }
  lathe(lead, cx, cy, [...prof, [0.01, prof[prof.length - 1][1]]], 12, { crease: 40 })
  const zt = prof[prof.length - 1][1]
  lathe(stone, cx, cy, [[1.6, zt - 0.2], [1.6, zt + 2.8], [1.4, zt + 2.9]], 6, { crease: 50 })
  lathe(lead, cx, cy, [[1.4, zt + 2.9], [0.01, zt + 4.0]], 6)
}
for (const s of [-1, 1]) rearDome(-66.3, s * 37.0)

// ---------------------------------------------------------------- write

const up = (n: V3) => (n[2] > 0.7 ? 0.4 : 1)
const dist = (p: V3) => Math.hypot(p[0] - DX, p[1])
/** Floodlight: the facade brightest, the drum and lantern bright, the body's walls dimmer. */
const stoneLit = (p: V3, n: V3) => {
  if (p[0] > 86) return up(n)
  if (dist(p) < 32 && p[2] > 50) return up(n)
  if (p[2] > 46) return 0.6 * up(n)
  return 0.25 * up(n)
}
const trimLit = (p: V3, n: V3) => (p[0] > 86 || p[2] > 50 ? 1 : 0.3) * up(n)
const leadLit = (_p: V3, n: V3) => 0.6 * up(n)

const PARTS = [
  // Colours from photos 1-3 and 6, pulled to the palette's lightness: warm
  // travertine; whiter statues, ribs and cornices; the dome's pale blue-grey
  // lead; brown-red tiles and the terraces' brick; dark bronze doors.
  { part: stone, material: { ...finish('travertine', 0xe6d9c1), floodlight: stoneLit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: trimLit } },
  { part: lead, material: { ...finish('dome-lead', 0xa9aaa7), floodlight: leadLit } },
  { part: glazing, material: PALETTE.window },
  { part: tile, material: finish('roof-tile', 0xbb9984, 0.9) },
  { part: bronze, material: finish('bronze', 0x6b5a4a) },
]
const triangles = PARTS.reduce((s, { part }) => s + part.triangles, 0)
const glb = writeGlb("St. Peter's Basilica", PARTS, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', bearing: 359.5, osm: 'way/244159210',
})
const json = JSON.parse(new TextDecoder().decode(glb.subarray(20, 20 + new DataView(glb.buffer, glb.byteOffset).getUint32(12, true))))
console.log(PARTS.map(({ part, material }, i) => `${material.name}: ${part.triangles} tris, ${json.accessors[json.meshes[0].primitives[i].attributes.POSITION].count} verts`).join('\n'))
console.log(`${triangles} triangles, ${glb.length} bytes`)
if (triangles > 6500) throw new Error(`triangle budget exceeded: ${triangles}`)
if (glb.length > 250 * 1024) throw new Error(`file budget exceeded: ${glb.length}`)
await Bun.write(new URL('../models/rome-st-peters-basilica.glb', import.meta.url).pathname, glb)
