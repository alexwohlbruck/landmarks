/**
 * Palacio Nacional (National Palace), east side of the Zócalo, Mexico City —
 * procedural, CC0-1.0, no textures. bun generators/mexico-city-palacio-nacional.ts
 *
 * Also the small kit for builder B4's Centro churches
 * (mexico-city-santo-domingo, mexico-city-la-profesa): the helpers below are
 * exported and the palace is only built when this file is run directly.
 *
 * Map frame: x east, y north, z up, metres, turned to the palace's axis. The
 * long walls of the OSM outline run at 6.0–6.5° east of north, so the
 * placement bearing is 6.3. The anchor is the area centroid of the outer way
 * of OSM relation/6191295 (lng -99.1312869, lat 19.4324595). The plan is
 * squared to that frame (every wall within 0.5 m of OSM).
 *
 * What it is: the viceregal palace (from 1522 on Moctezuma's site; rebuilt
 * after 1692; third storey added 1926–29 under Calles, when the facade was
 * refaced in red tezontle with chiluca frames, cornices and crestings —
 * es.wikipedia "Palacio Nacional (México)"). A ~200 m square block of
 * three-storey ranges round courtyards, flat terrace roofs. The west front on
 * the Zócalo: a pale chiluca ground storey with barred windows, then two red
 * tezontle storeys — the balconied piano nobile in pale frames, the 1920s
 * gallery of small arched windows — a pale cornice and a row of pyramidal
 * merlons; three pale stone frontispieces rising above the parapet with
 * scrolled crests (the central one tallest, over the Puerta Central, with the
 * Dolores bell in its niche over the central balcony; the Puerta de Honor to
 * the south, the Puerta Mariana to the north); low corner towers at both
 * ends. Inside, the Patio Central with three storeys of arcades and red back
 * walls, the arcaded Patio de Honor, smaller patios, a courtyard under white
 * skylight vaults.
 *
 * Covers and replaces relation/6191295 (outer way/158032453; inner
 * courtyards way/464560117 Patio Central, way/464560115 Patio de Honor,
 * way/415682427, way/415682429, way/415682431, way/1424006944) and the three
 * building=roof ways over the north courtyard (way/1424006945,
 * way/1424006946, way/1424006947). The Capilla de la Emperatriz
 * (way/464560116, a separate building in the eastern garden notch) is not
 * covered and stays an OSM extrusion.
 *
 * Evidence
 * - OSM (measured, turned 6.3°): west wall x −77.3 from y −86.6 to 108.0
 *   (201 m with the corner towers); south wall y −86.6 to x 123.2; east
 *   wall x 123.2 to y 23.1; north wall y 108.0 to x 60.7; the open garden
 *   notch x 10–78.6, y −66.3…94 with a rounded projection at x 10–19,
 *   y −11…17. Corner bumps (towers) x −80.4…−74.9, y −89.7…−84.5 and
 *   x −80.3…−75.2, y 106.3…111.5. Courtyards: Patio Central x −61.2…−14.3,
 *   y −17.9…28.2; Patio de Honor x −62.0…−37.7, y −71.4…−39.1; three small
 *   patios at y 78…93; the roofed courtyard x −61.3…−4.1, y 42.9…61.4.
 *   OSM tags building:levels 3, roof:shape flat; no height.
 * - Published: three storeys, the third added 1926 (es.wikipedia); about
 *   40,000 m² (infobox). No published height.
 * - Photo-scaled (estimated) on photo 5, a near-elevation telephoto from the
 *   Torre Latinoamericana, using OSM's 46 m Patio Central and the 95 m from
 *   the central crest to the south tower (17.3–18 px/m), checked against
 *   photo 2 (square on from the plaza): ground storey to the balcony line
 *   8.6 m, piano nobile cornice 14.7–15.3, main cornice 20.2, parapet 21.4,
 *   merlons 23.0; frontispieces 11.6 m wide, the central crest to 30.5 m
 *   (drawn to 31 m, a little bolder and 1 m proud, so it holds at 200 px),
 *   the side crests 26.5 m; corner towers 24 m. Bays 4.0–4.2 m: 5 from the
 *   south tower to the south crest, 13 to the centre, 17 to the north crest,
 *   3 to the north tower (counted on photo 5). Crest positions: central
 *   y 5.5 (on the Patio Central's axis), south y −58 (on the Patio de
 *   Honor's), north y 88 (on the Patio Mariano's). Patio Central: 13 arches
 *   a side in three tiers (photo 8). Courtyard skylight vaults ~3 m high.
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s); the
 *   Centro Histórico is on the flat lake bed (~2,240 m). The palace has
 *   settled unevenly; it is modelled level. Elevation 0.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 "Fachada del Palacio Nacional, Ciudad de México 02.jpg" and "… 03.jpg",
 *     Luisalvaz, CC BY-SA 4.0 — the central frontispiece, bell, storeys.
 *   2 "Palacio Nacional, fachada.JPG", Marioli925, CC BY-SA 3.0 — the centre
 *     square on.
 *   3 "El Palacio Nacional.JPG", Patricia Alzuarte Díaz, CC BY-SA 3.0 — the
 *     whole west front from the south-west, crests and towers.
 *   4 "Palacio Nacional Ciudad de México.jpg", MichaelCamacho, CC BY-SA 4.0
 *     — the central crest and bell niche, telephoto.
 *   5 "Zócalo desde la Torre Latinoamericana, Ciudad de México.JPG",
 *     Luisalvaz, CC BY-SA 4.0 — the whole west front near elevation.
 *   6 "Plaza de la Constitución - Zócalo de la Ciudad de México - 6.jpg" and
 *     "… - 4.jpg", ProtoplasmaKid, CC BY-SA 4.0 — drone views from the
 *     south-west: roofs, courtyards, the south front and the SW tower.
 *   7 "Palacio Nacional - Calle Corregidora - Mexico 2024.jpg", José Luiz,
 *     CC BY-SA 4.0 — the south front.
 *   8 "Patio Central en Palacio Nacional Mexico 2019.jpg", Drkgk, CC0 — the
 *     Patio Central arcades.
 *   9 "Palacio Nacional 20201.jpg", Carlos Contreras, CC BY-SA 4.0 — west
 *     front from the north-west.
 * - Look-only: none used. No commercial imagery.
 * - Colours from the photos, pulled to the palette: tezontle #7f5046 (a
 *   little darker than the Sagrario's, so the front reads red as in the
 *   Zócalo photos; the red is the field of the upper storeys and the parapet,
 *   the pale stone only window surrounds, cornices and the ground storey), chiluca a warm pale tan, terrace roofs the
 *   orange-red of the waterproofed terraces in photo 6.
 * - Simplified or left out: the carved crests are flat scrolled profiles;
 *   the balconies, awnings, ironwork, coats of arms, statues, the bell
 *   itself and the flagpole are left out; the third storey's paired arched
 *   windows are paired panels; the merlons are drawn only on the west, south
 *   and north fronts. The space-frame roof over the Patio de Honor in photo 5
 *   (c. 2012) is gone in photo 6 and is not modelled.
 * - Doubts: the north and east fronts have no licensed photo; they are drawn
 *   like the south front (north) and plainer (east, and the walls round the
 *   eastern garden notch). Only the courtyards OSM maps are cut; the real
 *   palace has more small patios. All interior ranges are taken at the
 *   front's height.
 * - Night: the west front is floodlit (strongest), the other fronts softly;
 *   the bell niche and windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save } from './dc-nmaahc'
import { ccw, earcut, offsetPoly } from './dc-national-cathedral'
import { cbox, qf, tf, rect, type Side } from './dc-white-house'

export type XY = [number, number]
type AZ = [number, number]

// ===========================================================================
// Kit (shared with the B4 Centro churches).

export const NRM: Record<Side, V3> = { n: [0, 1, 0], s: [0, -1, 0], e: [1, 0, 0], w: [-1, 0, 0] }
/** A point on a wall plane `at` (x for e/w, y for n/s): `a` along it, `z` up, lifted `d` out of the wall. */
export function wp(side: Side, at: number, a: number, z: number, d = 0): V3 {
  switch (side) {
    case 's': return [a, at - d, z]
    case 'n': return [a, at + d, z]
    case 'w': return [at - d, a, z]
    default: return [at + d, a, z]
  }
}

/** A flat rectangle on a wall, `d` proud of it. */
export function wpanel(p: Part, side: Side, at: number, a0: number, a1: number, z0: number, z1: number, d = 0.05) {
  qf(p, wp(side, at, a0, z0, d), wp(side, at, a1, z0, d), wp(side, at, a1, z1, d), wp(side, at, a0, z1, d), NRM[side])
}

/** A round-headed panel a0..a1 wide, z0 to the crown z1, `d` proud of the wall. Real semicircle. */
export function warch(p: Part, side: Side, at: number, a0: number, a1: number, z0: number, z1: number, d = 0.05, seg = 6) {
  const r = (a1 - a0) / 2, am = (a0 + a1) / 2, zs = Math.max(z0, z1 - r)
  const pts: AZ[] = [[a0, z0], [a1, z0]]
  for (let k = 0; k <= seg; k++) { const t = (Math.PI * k) / seg; pts.push([am + r * Math.cos(t), zs + r * Math.sin(t)]) }
  for (let i = 1; i < pts.length - 1; i++) tf(p, wp(side, at, ...pts[0], d), wp(side, at, ...pts[i], d), wp(side, at, ...pts[i + 1], d), NRM[side])
}

/**
 * A screen of n round arches on a wall plane, a real open arcade: piers and
 * spandrels only, the openings left empty. Faces the side's normal.
 * a0..a1 along the wall, z0..z1; `pier` is the pier width; the arch crowns
 * sit `spandrel` below z1.
 */
export function arcade(p: Part, side: Side, at: number, a0: number, a1: number, z0: number, z1: number, n: number, pier: number, spandrel: number, seg = 6) {
  const N = NRM[side], P = (a: number, z: number) => wp(side, at, a, z)
  const w = (a1 - a0) / n, r = (w - pier) / 2, zs = z1 - spandrel - r
  const Q = (b0: number, b1: number, za: number, zb: number) => qf(p, P(b0, za), P(b1, za), P(b1, zb), P(b0, zb), N)
  for (let k = 0; k <= n; k++) {
    // pier k (the end piers are half piers), up to the springing, and the triangle over it
    const c = a0 + k * w, l = k === 0 ? a0 : c - pier / 2, rr = k === n ? a1 : c + pier / 2
    Q(l, rr, z0, zs)
    const top: AZ = [c, z1]
    if (k > 0 && k < n) tf(p, P(l, zs), P(rr, zs), P(...top), N)
    else if (k === 0) tf(p, P(l, zs), P(rr, zs), P(a0, z1), N)
    else tf(p, P(l, zs), P(rr, zs), P(a1, z1), N)
  }
  for (let k = 0; k < n; k++) {
    const am = a0 + (k + 0.5) * w, L: AZ = [a0 + k * w, z1], R: AZ = [a0 + (k + 1) * w, z1]
    const arc: AZ[] = []
    for (let i = 0; i <= seg; i++) { const t = Math.PI - (Math.PI * i) / seg; arc.push([am + r * Math.cos(t), zs + r * Math.sin(t)]) }
    for (let i = 0; i < seg; i++) tf(p, P(...arc[i]), P(...arc[i + 1]), P(...(i < seg / 2 ? L : R)), N)
    tf(p, P(...L), P(...arc[seg / 2]), P(...R), N)
  }
}

/** A flat polygon in (a, z) on a wall plane, extruded `t` back into the wall from `d` proud. */
export function wprofile(p: Part, side: Side, at: number, poly: AZ[], t: number, d = 0, back = false) {
  const ring = ccw(poly) as AZ[], n = NRM[side], nb: V3 = [-n[0], -n[1], -n[2]]
  for (const [i, j, k] of earcut(ring)) {
    tf(p, wp(side, at, ...ring[i], d), wp(side, at, ...ring[j], d), wp(side, at, ...ring[k], d), n)
    if (back) tf(p, wp(side, at, ...ring[i], d - t), wp(side, at, ...ring[j], d - t), wp(side, at, ...ring[k], d - t), nb)
  }
  const along: V3 = side === 'n' || side === 's' ? [1, 0, 0] : [0, 1, 0]
  for (let i = 0; i < ring.length; i++) {
    const A = ring[i], B = ring[(i + 1) % ring.length]
    const da = B[0] - A[0], dz = B[1] - A[1]
    if (Math.hypot(da, dz) < 1e-6) continue
    // outward in the (a, z) plane for a CCW ring is (dz, -da)
    const out: V3 = [along[0] * dz, along[1] * dz, -da]
    qf(p, wp(side, at, ...A, d), wp(side, at, ...B, d), wp(side, at, ...B, d - t), wp(side, at, ...A, d - t), out)
  }
}

/** A merlon: a pointed pyramid on a square foot s wide, h tall (four faces). */
export function merlon(p: Part, cx: number, cy: number, z: number, s = 0.8, h = 1.1) {
  const hw = s / 2, a: V3[] = [[cx - hw, cy - hw, z], [cx + hw, cy - hw, z], [cx + hw, cy + hw, z], [cx - hw, cy + hw, z]]
  const apex: V3 = [cx, cy, z + h]
  for (let i = 0; i < 4; i++) p.tri(a[i], a[(i + 1) % 4], apex)
}

/** Walls round a ring facing outward (ccw) — or into a courtyard with `inward`. */
export function ringWalls(p: Part, ring0: XY[], z0: number, z1: number, inward = false) {
  const r = ccw(ring0), ring = inward ? [...r].reverse() : r
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-6) continue
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}

const segX = (a: XY, b: XY, c: XY, d: XY) => {
  const o = (p: XY, q: XY, r: XY) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]))
  return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0
}
/** A flat roof over `outer` with `holes` cut out (keyhole bridges, then ear clipping), facing up or down. */
export function capHoles(p: Part, outer: XY[], holes: XY[][], z: number, up = true) {
  let ring: XY[] = ccw(outer).slice()
  const hs = holes.map((h) => ccw(h).slice().reverse()) // clockwise
  const edges = () => {
    const e: [XY, XY][] = []
    for (const r of [ring, ...hs]) for (let i = 0; i < r.length; i++) e.push([r[i], r[(i + 1) % r.length]])
    return e
  }
  // bridge holes in order of their rightmost point, as ear clipping wants
  const order = hs.map((h, i) => [i, Math.max(...h.map((q) => q[0]))] as [number, number]).sort((a, b) => b[1] - a[1])
  const done = new Set<number>()
  for (const [hi] of order) {
    const h = hs[hi]
    let best: [number, number, number] | null = null
    for (let j = 0; j < h.length; j++) for (let i = 0; i < ring.length; i++) {
      const A = h[j], B = ring[i], dd = Math.hypot(A[0] - B[0], A[1] - B[1])
      if (best && dd >= best[2]) continue
      const blocked = edges().some(([c, d]) => !(c === A || d === A || c === B || d === B) && segX(A, B, c, d))
      if (!blocked) best = [i, j, dd]
    }
    if (!best) throw new Error('capHoles: no bridge')
    const [i, j] = best
    const loop = [...h.slice(j), ...h.slice(0, j), h[j]]
    ring = [...ring.slice(0, i + 1), ...loop, ring[i], ...ring.slice(i + 1)]
    done.add(hi)
    hs[hi] = [] // now part of the ring
  }
  const n: V3 = [0, 0, up ? 1 : -1]
  for (const [a, b, c] of earcut(ring)) tf(p, [...ring[a], z] as V3, [...ring[b], z] as V3, [...ring[c], z] as V3, n)
}

/**
 * An open belfry stage: a square of side 2·hw about (cx, cy), z0..z1, walls
 * `t` thick, one round-arched opening of width `aw` in each face, its crown
 * `top` below z1, sill `sill` above z0. Real openings: outer faces, inner
 * faces, the reveals round each arch, and a floor at the sill.
 */
export function belfry(p: Part, floor: Part, cx: number, cy: number, hw: number, z0: number, z1: number, aw: number, t: number, top = 0.6, sill = 0.5, seg = 8) {
  const za = z0 + sill, crown = z1 - top, r = aw / 2, zs = crown - r
  const faces: Array<[Side, number, number, number]> = [['s', cy - hw, cx - hw, cx + hw], ['n', cy + hw, cx - hw, cx + hw], ['w', cx - hw, cy - hw, cy + hw], ['e', cx + hw, cy - hw, cy + hw]]
  const opp: Record<Side, Side> = { n: 's', s: 'n', e: 'w', w: 'e' }
  for (const [side, at, a0, a1] of faces) {
    const am = (a0 + a1) / 2, sp = top
    // below the sill, the outer face is solid
    wpanel(p, side, at, a0, a1, z0, za, 0)
    arcade(p, side, at, a0, a1, za, z1, 1, (a1 - a0) - aw, sp, seg)
    const inAt = at + (side === 'n' || side === 'e' ? -t : t)
    arcade(p, opp[side], inAt, a0 + t, a1 - t, za, z1, 1, (a1 - a0 - 2 * t) - aw, sp, seg)
    // reveals: from the outer plane to the inner one round the opening
    const outline: AZ[] = [[am - r, za], [am - r, zs]]
    for (let k = 1; k <= seg; k++) { const th = Math.PI - (Math.PI * k) / seg; outline.push([am + r * Math.cos(th), zs + r * Math.sin(th)]) }
    outline.push([am + r, za])
    for (let k = 0; k < outline.length - 1; k++) {
      const A = outline[k], B = outline[k + 1], m: AZ = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
      const toC: AZ = [am - m[0], (m[1] > zs ? zs : m[1]) - m[1]]
      const n = wp(side, at, am + 1, 0, 0), o = wp(side, at, am, 0, 0)
      const along: V3 = [n[0] - o[0], n[1] - o[1], 0]
      qf(p, wp(side, at, ...A), wp(side, at, ...B), wp(side, at, ...B, -t), wp(side, at, ...A, -t), [along[0] * toC[0], along[1] * toC[0], toC[1]])
    }
    // the sill
    qf(p, wp(side, at, am - r, za), wp(side, at, am + r, za), wp(side, at, am + r, za, -t), wp(side, at, am - r, za, -t), [0, 0, 1])
  }
  // floor inside at the sill, and the inner walls below it are not needed
  floor.cap([[cx - hw + t, cy - hw + t, za - 0.01], [cx + hw - t, cy - hw + t, za - 0.01], [cx + hw - t, cy + hw - t, za - 0.01], [cx - hw + t, cy + hw - t, za - 0.01]], true)
}

/** A cross of square bars: shaft to `top`, arms at 70 % of its height. */
export function cross3(p: Part, cx: number, cy: number, z0: number, top: number, w = 0.22) {
  const h = top - z0, arm = h * 0.32
  cbox(p, { x0: cx - w / 2, x1: cx + w / 2, y0: cy - w / 2, y1: cy + w / 2 }, z0, top, { top: true })
  cbox(p, { x0: cx - arm, x1: cx + arm, y0: cy - w / 2, y1: cy + w / 2 }, z0 + h * 0.62, z0 + h * 0.62 + w, { top: true, bottom: true })
}

/** Band a ring's outer walls into storeys: [z0, z1, part][]. */
export function bandWalls(ring: XY[], bands: Array<[number, number, Part]>) {
  for (const [z0, z1, p] of bands) ringWalls(p, ring, z0, z1)
}

// ===========================================================================
// The palace.

const XW = -77.3, YS = -86.6, YN = 108.0, XE = 123.15
const Z1 = 8.6, Z2 = 14.7, Z2B = 15.3, Z3 = 20.2, ZP = 21.4

/** The outline (OSM outer way, squared), without the corner towers. */
const OUT: XY[] = [
  [XW, YS], [XE, YS], [XE, 23.1], [84.9, 23.1], [84.9, 14.6], [78.6, 14.6], [78.6, -66.3], [10.0, -66.3],
  [10.0, -11.0], [13.8, -8.4], [17.0, -4.3], [18.8, 0.4], [18.9, 3.0], [18.9, 5.6], [17.8, 9.8], [15.2, 13.7], [10.3, 17.3],
  [10.3, 76.0], [9.9, 76.0], [9.9, 89.5], [24.5, 89.5], [24.5, 88.4], [32.8, 88.4], [32.8, 94.2], [53.7, 94.2], [53.7, 100.8],
  [60.7, 100.8], [60.7, YN], [XW, YN],
]
const PC = { x0: -61.2, x1: -14.3, y0: -17.9, y1: 28.2 } // Patio Central (the arcade line)
const PH = { x0: -62.0, x1: -37.7, y0: -71.4, y1: -39.1 } // Patio de Honor
const SMALL = [rect(-58.8, -43.9, 78.2, 93.4), rect(-34.0, -18.3, 78.1, 93.3), rect(-5.1, 2.8, 78.0, 93.2)]
const LOGGIA = 3.6

const rxy = (r: { x0: number; x1: number; y0: number; y1: number }): XY[] => [[r.x0, r.y0], [r.x1, r.y0], [r.x1, r.y1], [r.x0, r.y1]]

function build() {
  const tez = new Part(), stone = new Part(), roof = new Part(), win = new Part(), door = new Part(), glass = new Part()

  // ---- Massing: banded outer walls, parapet, roof with courtyards.
  bandWalls(OUT, [[0, Z1, stone], [Z1, Z2, tez], [Z2, Z2B, stone], [Z2B, Z3, tez], [Z3, Z3 + 0.45, stone], [Z3 + 0.45, ZP, tez]])
  const IN = offsetPoly(OUT, -0.6)
  ringWalls(tez, IN, Z3, ZP, true)
  {
    const O = ccw(OUT), I = ccw(IN)
    for (let i = 0; i < O.length; i++) {
      const j = (i + 1) % O.length
      qf(stone, [...O[i], ZP] as V3, [...O[j], ZP] as V3, [...I[j], ZP] as V3, [...I[i], ZP] as V3, [0, 0, 1])
    }
  }
  const holes: XY[][] = [rxy(PC), rxy(PH), ...SMALL.map(rxy)]
  capHoles(roof, IN, holes, Z3)

  // ---- Courtyards. The two great patios: three tiers of open arcades in
  // chiluca in front of red loggia walls; floors and ceilings of the loggias.
  for (const [P0, nx, ny, seg] of [[PC, 13, 13, 6], [PH, 6, 8, 4]] as const) {
    const back = { x0: P0.x0 - LOGGIA, x1: P0.x1 + LOGGIA, y0: P0.y0 - LOGGIA, y1: P0.y1 + LOGGIA }
    ringWalls(tez, rxy(back), 0, Z3, true)
    // the Patio de Honor's top storey is a plain wall with windows (budget)
    const tiers: [number, number][] = P0 === PC ? [[0, Z1], [Z1, Z2B], [Z2B, Z3]] : [[0, Z1], [Z1, Z2B]]
    for (const [z0, z1] of tiers) {
      const sp = 0.9
      arcade(stone, 'e', P0.x0, P0.y0, P0.y1, z0, z1, ny, 0.9, sp, seg)
      arcade(stone, 'w', P0.x1, P0.y0, P0.y1, z0, z1, ny, 0.9, sp, seg)
      arcade(stone, 'n', P0.y0, P0.x0, P0.x1, z0, z1, nx, 0.9, sp, seg)
      arcade(stone, 's', P0.y1, P0.x0, P0.x1, z0, z1, nx, 0.9, sp, seg)
    }
    if (P0 === PH) {
      ringWalls(stone, rxy(PH), Z2B, Z3, true)
      for (const [side, at, a0, a1, n] of [['e', PH.x0, PH.y0, PH.y1, ny], ['w', PH.x1, PH.y0, PH.y1, ny], ['n', PH.y0, PH.x0, PH.x1, nx], ['s', PH.y1, PH.x0, PH.x1, nx]] as [Side, number, number, number, number][])
        for (let k = 0; k < n; k++) { const c = a0 + ((a1 - a0) * (k + 0.5)) / n; wpanel(win, side, at, c - 0.7, c + 0.7, Z2B + 0.8, Z3 - 1.0) }
    }
    // loggia floors (up) and ceilings (down) between the arcade line and the back wall
    const O = rxy(back), I = rxy(P0)
    for (const [z, up] of [[Z1, true], [Z2B, true], [Z1 - 0.3, false], [Z2B - 0.3, false], [Z3 - 0.05, false]] as [number, boolean][]) {
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4
        qf(up ? stone : tez, [...O[i], z] as V3, [...O[j], z] as V3, [...I[j], z] as V3, [...I[i], z] as V3, [0, 0, up ? 1 : -1])
      }
    }
    // a pale parapet on the courtyard's roof edge
    for (const [side, at, a0, a1] of [['e', P0.x0, P0.y0, P0.y1], ['w', P0.x1, P0.y0, P0.y1], ['n', P0.y0, P0.x0, P0.x1], ['s', P0.y1, P0.x0, P0.x1]] as [Side, number, number, number][])
      wpanel(stone, side, at, a0, a1, Z3, Z3 + 0.7, 0)
  }
  for (const s of SMALL) ringWalls(stone, rxy(s), 0, Z3, true)

  // The roofed courtyard: three white skylight vaults.
  for (const [x0, x1] of [[-61.3, -42.2], [-42.3, -23.1], [-23.2, -4.1]]) {
    const r = { x0: x0 + 0.8, x1: x1 - 0.8, y0: 43.7, y1: 60.6 }
    cbox(stone, r, Z3, Z3 + 0.6, { top: false })
    const xm = (r.x0 + r.x1) / 2, z0 = Z3 + 0.6, z1 = Z3 + 3.2
    const ridge: [V3, V3] = [[xm, r.y0 + 3, z1], [xm, r.y1 - 3, z1]]
    qf(glass, [r.x0, r.y0, z0], [r.x0, r.y1, z0], ridge[1], ridge[0], [-1, 0, 1])
    qf(glass, [r.x1, r.y0, z0], [r.x1, r.y1, z0], ridge[1], ridge[0], [1, 0, 1])
    tf(glass, [r.x0, r.y0, z0], [r.x1, r.y0, z0], ridge[0], [0, -1, 1])
    tf(glass, [r.x0, r.y1, z0], [r.x1, r.y1, z0], ridge[1], [0, 1, 1])
  }

  // ---- Fronts. Bays: windows per storey, pale frames on the red storeys.
  type Front = { side: Side; at: number; segs: Array<[number, number, number]>; kind: 'west' | 'std' | 'plain' | 'garden'; merlons: number }
  const fronts: Front[] = [
    { side: 'w', at: XW, kind: 'west', merlons: 1, segs: [[-84.5, -63.8, 5], [-52.2, -0.3, 13], [11.3, 82.2, 17], [93.8, 106.3, 3]] },
    { side: 's', at: YS, kind: 'std', merlons: 2, segs: [[-74.4, XE, 47]] },
    { side: 'n', at: YN, kind: 'std', merlons: 2, segs: [[-74.4, 60.7, 32]] },
    { side: 'e', at: XE, kind: 'plain', merlons: 0, segs: [[YS, 23.1, 26]] },
    { side: 'n', at: 23.1, kind: 'plain', merlons: 0, segs: [[84.9, XE, 9]] },
    { side: 'e', at: 10.0, kind: 'garden', merlons: 0, segs: [[-66.3, -11.0, 13]] },
    { side: 'e', at: 10.3, kind: 'garden', merlons: 0, segs: [[17.3, 76.0, 14]] },
    { side: 'n', at: -66.3, kind: 'garden', merlons: 0, segs: [[10.0, 78.6, 16]] },
    { side: 'w', at: 78.6, kind: 'garden', merlons: 0, segs: [[-66.3, 14.6, 19]] },
    { side: 's', at: 94.2, kind: 'garden', merlons: 0, segs: [[32.8, 53.7, 5]] },
    { side: 'e', at: 9.9, kind: 'garden', merlons: 0, segs: [[76.0, 89.5, 3]] },
  ]
  for (const f of fronts) {
    for (const [a0, a1, n] of f.segs) {
      const w = (a1 - a0) / n
      for (let k = 0; k < n; k++) {
        const c = a0 + (k + 0.5) * w
        if (f.kind === 'garden') {
          wpanel(win, f.side, f.at, c - 0.8, c + 0.8, Z1 + 0.8, Z2 - 0.9)
          continue
        }
        if (f.kind === 'plain') {
          wpanel(win, f.side, f.at, c - 0.8, c + 0.8, Z1 + 0.8, Z2 - 0.9)
          continue
        }
        // ground storey: a big barred window every other bay, a low one under it
        if (k % 2 === (n % 2 ? 0 : 1)) {
          wpanel(win, f.side, f.at, c - 0.85, c + 0.85, 3.0, 6.4)
        }
        // piano nobile: a tall balcony window in a pale frame
        if (f.side !== 'n') wpanel(stone, f.side, f.at, c - 1.1, c + 1.1, Z1 + 0.3, Z2 - 0.5, 0.03)
        wpanel(win, f.side, f.at, c - 0.85, c + 0.85, Z1 + 0.5, Z2 - 0.8)
        // gallery: arched windows (paired on the west front)
        if (f.kind === 'west') {
          warch(win, f.side, f.at, c - 1.45, c - 0.1, Z2B + 0.75, Z3 - 0.65, 0.06, 4)
          warch(win, f.side, f.at, c + 0.1, c + 1.45, Z2B + 0.75, Z3 - 0.65, 0.06, 4)
        } else {
          warch(win, f.side, f.at, c - 0.8, c + 0.8, Z2B + 0.75, Z3 - 0.65, 0.06, 4)
        }
      }
      // merlons on the parapet, over the piers
      if (f.merlons) for (let k = 0; k <= n; k += f.merlons) {
        const c = wp(f.side, f.at, a0 + k * w, 0, -0.45)
        merlon(stone, c[0], c[1], ZP, 1.0, 1.6)
      }
    }
  }

  // ---- The three frontispieces on the west front: pale stone, standing
  // 0.7 m proud, a door, the balcony window, a scrolled crest.
  const crestHalf: AZ[] = [[5.8, 0], [5.8, 1.6], [5.2, 2.4], [4.6, 3.6], [4.0, 4.6], [3.4, 5.6], [3.0, 6.4], [3.4, 6.4], [3.4, 7.1], [2.6, 8.0], [1.4, 8.55], [0, 8.8]]
  const mainHalf: AZ[] = [[5.8, 0], [5.8, 3.0], [4.7, 3.0], [4.5, 3.9], [4.0, 4.9], [3.4, 5.8], [3.0, 6.6], [3.6, 6.6], [3.6, 7.4], [2.9, 8.2], [1.6, 8.7], [0, 8.9]]
  for (const [yc, top, main] of [[-58, 26.5, false], [5.5, 31.0, true], [88, 26.5, false]] as [number, number, boolean][]) {
    const D = main ? 1.0 : 0.7, y0 = yc - 5.8, y1 = yc + 5.8
    // The pier and its crest are one piece of stone: the crest's foot runs
    // 1.2 m down into the pier (no seam), it is exactly as deep as the pier,
    // and a ledge at the crest's foot ties it across the pier's full width.
    cbox(stone, { x0: XW - D, x1: XW + 0.4, y0, y1 }, 0, ZP + 0.3, { top: true })
    const zc = ZP + 0.3, sc = (top - zc) / 8.8
    const half = main ? mainHalf : crestHalf
    const poly: AZ[] = [...half.map(([a, z]) => [yc + a, z === 0 ? zc - 1.2 : zc + z * sc] as AZ), ...[...half].reverse().slice(1, -1).map(([a, z]) => [yc - a, zc + z * sc] as AZ)]
    poly.push([yc - half[0][0], zc - 1.2])
    wprofile(stone, 'w', XW, poly, D + 0.4, D, true)
    cbox(stone, { x0: XW - D - 0.3, x1: XW + 0.4, y0: y0 - 0.3, y1: y1 + 0.3 }, zc - 0.45, zc, { top: true, bottom: true })
    // a cornice break between the storeys, standing proud
    cbox(stone, { x0: XW - D - 0.35, x1: XW - D + 0.05, y0: y0 - 0.3, y1: y1 + 0.3 }, Z2, Z2B, { bottom: true })
    // door, balcony window, the niche (bell niche on the centre)
    const F = XW - D
    wpanel(door, 'w', F, yc - 1.7, yc + 1.7, 0, 5.4)
    wpanel(win, 'w', F, yc - 1.0, yc + 1.0, Z1 + 0.5, Z2 - 0.6)
    if (main) {
      warch(win, 'w', F, yc - 1.4, yc + 1.4, Z2B + 0.6, Z3 + 0.4, 0.05, 8)
      wpanel(win, 'w', F, yc - 3.6, yc - 3.0, Z2B + 1.6, Z2B + 3.4)
      wpanel(win, 'w', F, yc + 3.0, yc + 3.6, Z2B + 1.6, Z2B + 3.4)
      // shoulder pinnacles on the crest
      for (const s of [-1, 1]) merlon(stone, XW - D + 0.6, yc + s * 5.25, zc + 3.0 * sc, 1.0, 2.4)
    } else {
      warch(win, 'w', F, yc - 1.0, yc + 1.0, Z2B + 0.8, Z3 - 0.6, 0.05, 6)
    }
  }

  // ---- Corner towers: chiluca blocks a storey's worth over the parapet,
  // with a cornice and corner merlons.
  for (const t of [{ x0: -80.4, x1: -74.4, y0: -89.7, y1: -84.5 }, { x0: -80.3, x1: -74.4, y0: 106.3, y1: 111.5 }]) {
    const ZT = 24.0
    cbox(stone, t, 0, ZT - 0.6, { top: false })
    cbox(stone, { x0: t.x0 - 0.3, x1: t.x1 + 0.3, y0: t.y0 - 0.3, y1: t.y1 + 0.3 }, ZT - 0.6, ZT, { b: 0.2, bottom: true })
    const yc = (t.y0 + t.y1) / 2, xc = (t.x0 + t.x1) / 2
    const outY: Side = t.y0 < 0 ? 's' : 'n', atY = t.y0 < 0 ? t.y0 : t.y1
    for (const [side, at, c] of [['w', t.x0, yc], [outY, atY, xc]] as [Side, number, number][]) {
      wpanel(win, side, at, c - 0.8, c + 0.8, 3.0, 6.2)
      wpanel(win, side, at, c - 0.85, c + 0.85, Z1 + 0.5, Z2 - 0.8)
      warch(win, side, at, c - 0.8, c + 0.8, Z2B + 0.8, Z3 - 0.4, 0.05, 6)
    }
    for (const [x, y] of [[t.x0, t.y0], [t.x1, t.y0], [t.x1, t.y1], [t.x0, t.y1]]) merlon(stone, x + (x < xc ? 0.5 : -0.5), y + (y < yc ? 0.5 : -0.5), ZT, 1.0, 1.3)
  }

  // Night: the fronts are floodlit, the Zócalo front most.
  const lit = (_p: V3, n: V3) => (n[2] > 0.6 ? 0 : n[0] < -0.5 ? 0.9 : 0.35)
  const NOLIT = false
  return [
    { part: tez, material: { ...finish('tezontle', 0x7f5046), ...(NOLIT ? {} : { floodlight: lit }) } },
    { part: stone, material: { ...finish('chiluca', 0xcdbea6), ...(NOLIT ? {} : { floodlight: lit }) } },
    { part: roof, material: finish('terrace-roof', 0xb3735f) },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
    { part: glass, material: PALETTE.glass },
  ]
}

if (import.meta.main && process.env.COUNT) { for (const x of build()) console.log(x.material.name, x.part.triangles) }
else if (import.meta.main) await save('mexico-city-palacio-nacional', 'Palacio Nacional', build(), { generator: 'generators/mexico-city-palacio-nacional.ts' }, 6500)
