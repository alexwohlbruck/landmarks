/**
 * Theatinerkirche St. Kajetan, Odeonsplatz, Munich: Agostino Barelli from
 * 1663, the dome and towers by Enrico Zuccalli (towers 1684-92), the
 * Rococo facade by François de Cuvilliés the elder and younger, 1765-68.
 * Original procedural geometry, CC0-1.0.
 * bun generators/munich-theatinerkirche.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/25514390,
 * 48.142069, 11.576617. The church's walls run at 14.5 / 104.5 degrees, so
 * the catalog bearing is 14.5 and the church is square to this frame: +x is
 * the facade on the Odeonsplatz (east-south-east), -x the apse, the nave
 * axis is y = YC = 0.55 and the model is symmetric about it.
 *
 * Identity, in order: the ochre-yellow facade between two tall towers, the
 * towers' octagonal belfries ringed by big dark copper volutes ("Schnecken")
 * under dark ribbed caps; the great drum and dark copper dome with dormers
 * and a lantern over the crossing (the tallest point); the two-storey
 * facade with paired columns, statue niches, the wide attic and the upper
 * storey with its pediment and coat of arms flanked by scroll wings and
 * vases; the clerestory with arched windows and the concave copper-capped
 * buttresses over the low side chapels; grey sheet roofs.
 *
 * Evidence:
 *  - plan: OSM outline way/25514390 and its parts read in the turned frame:
 *    body and facade to x 34.2, nave and chapels y -15.5..16.6 (drawn
 *    +-16.1 about YC); towers 312008157 / 312008156 x 22.6..33.0, about
 *    9.8 m square outside the body (drawn symmetric, |y - YC| 16.1..25.9);
 *    transept x -22.4..2.3 to y -18.9 / 21.1 (drawn +-20); choir to
 *    x -32.4 and the apse, a half circle of radius 10.3 to x -42.7; the dome
 *    part 497670959, a circle of radius 9.85 centred x -10.6 (the crossing).
 *    Part 1193085484 (the body, 29 m) gives the eave.
 *  - heights (de.wikipedia, Theatinerkirche (München), "Maße"): towers
 *    64.60 m, dome 70.20 m, dome diameter 17.70 m (inside), nave 72.5 m long,
 *    15.5 m wide, 28.55 m high (inside). The facade storeys are scaled from
 *    Wilfredor's frontal photo (~14.6 px per m from the 64.6 m towers):
 *    order entablature 15.3-17, attic to 20.3, upper storey to 32.3,
 *    pediment apex 37.3; tower stages 20.3-32.3, clock storey to 43,
 *    belfry 45-53.4 with four big diagonal S-volutes (scaled from the
 *    volute photo and High Contrast's view against the drum), the cap: an
 *    onion to 59.6, a small lantern to 61.2, a second onion, ball and
 *    finial to the published 64.6. Drum (35-49.5), dome (to 59.5) and
 *    lantern scaled from Martin Falbisoner's and High Contrast's photos
 *    against the 19.7 m drum. Clerestory window and buttress sizes and the
 *    chapel eave (16 m) from High Contrast's photo of the south flank.
 *    Nave ridge 36.5 and the hipped crossing roof: estimated from the same.
 *  - colours from the daylight photos: ochre-yellow render, cream cornices
 *    and statues, dark weathered copper domes, caps and volutes, grey sheet
 *    roofs, green patina on the chapel roofs and buttress caps.
 *  - elevation 0 (flat Odeonsplatz). No lidar in Germany; no 3D city model.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Exterior_of_Theatinerkirche,_Munich.jpg (Wilfredor, CC0): the facade
 *    head-on from the east; main reference for the facade and towers.
 *  - Theatinerkirche_München_2014.jpg (High Contrast, CC BY 3.0 de): from
 *    the south, high: flank, chapels, buttresses, roofs, drum and dome.
 *  - Theatinerkirche_Munich,_March_2018.jpg (Martin Falbisoner,
 *    CC BY-SA 4.0): from the south-west over the roofs: dome, towers.
 *  - Theatinerkirche_Hofgarten_Munich_München_2009.jpg (Schlaier, public
 *    domain) and 20210102_Theatinerkirche_Munich_01.jpg (Flocci Nivis,
 *    CC BY 4.0): from the Hofgarten, north-east.
 *  - Theatinerstrasse_Theatinerkirche_Munich.jpg (Jebulon, CC0): the south
 *    tower from the south, its stages.
 *  - München,_Theatinerkirche,_Turm-Voluten,_2024.jpg (Rendor Thuces
 *    Al'Nachkar, CC BY-SA 4.0): the belfry volutes close up.
 *  - Theatinerkirche_-_Colegiata_de_San_Cayetano.jpg (Pedro J Pacheco,
 *    CC BY-SA 3.0): the dome from inside: eight drum windows.
 * No commercial imagery, no 3D city models. No look-only sources.
 *
 * Left out: the facade's relief panels and garlands, capitals, the
 * statues' and arms' carving (drawn as bold simple figures), the weather
 * vanes (the lion on the lantern drawn as a ball and rod), window bars.
 *
 * Doubts: the north flank and the choir are seen only from far off; the
 * choir and crossing roofs are simplified to a hip and a half cone; the
 * clerestory's line (|y - YC| 9.6) is estimated from the inside width plus
 * walls. The towers' OSM parts differ by about 1 m in size and are drawn
 * equal.
 *
 * Exports a small kit used by this builder's other Munich models.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, lathe, rect, save, triangulate, walls, type XY } from './chi-aon-center'
import { along, archOn, bbox, discOn, face, ngon, rectOn } from './phl-independence-hall'
import { gableRoof, hipRoof, urn, ball, column } from './amsterdam-westerkerk'

// ---------------------------------------------------------------------------
// Kit for this builder's Munich models (Theatinerkirche, Feldherrnhalle,
// Nationaltheater, Hofbräuhaus).

export { save, rect, lathe, walls, cap, along, archOn, bbox, discOn, face, ngon, rectOn, gableRoof, hipRoof, urn, ball, column, triangulate }
export type { XY }

/** A closed box (all six faces). */
export function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bottom = false) {
  walls(p, rect(x0, y0, x1, y1), z0, z1)
  cap(p, rect(x0, y0, x1, y1), z1)
  if (bottom) cap(p, rect(x0, y0, x1, y1), z0, false)
}

/** A box turned by `ang` about (cx, cy), half-sizes hu (along ang) and hv. */
export function obox(p: Part, top: Part | null, cx: number, cy: number, ang: number, hu: number, hv: number, z0: number, z1: number) {
  const c = Math.cos(ang), s = Math.sin(ang)
  const r: XY[] = [[-hu, -hv], [hu, -hv], [hu, hv], [-hu, hv]].map(([u, v]) => [cx + u * c - v * s, cy + u * s + v * c] as XY)
  walls(p, r, z0, z1)
  if (top) cap(top, r, z1)
}

/**
 * A slab on wall a→b (counter-clockwise ring) whose outline is a simple
 * polygon in (s along the wall, z), from `o0` to `o0 + t` outside it.
 * `edge` takes the outline's edges (all but the back face), so a sloped top
 * can go in another material.
 */
export function slab(p: Part, a: XY, b: XY, outline: XY[], t: number, o0 = 0, edge: Part = p, back = true) {
  const { P, n, u } = along(a, b)
  const ar = outline.reduce((s, q, i) => { const r = outline[(i + 1) % outline.length]; return s + q[0] * r[1] - r[0] * q[1] }, 0)
  const ring = ar < 0 ? [...outline].reverse() : outline
  const N: V3 = [n[0], n[1], 0], B: V3 = [-n[0], -n[1], 0]
  for (const [i, j, k] of triangulate(ring)) {
    face(p, [ring[i], ring[j], ring[k]].map(([s, z]) => P(s, z, o0 + t)), N)
    if (back) face(p, [ring[i], ring[j], ring[k]].map(([s, z]) => P(s, z, o0)), B)
  }
  for (let i = 0; i < ring.length; i++) {
    const q = ring[i], r = ring[(i + 1) % ring.length]
    const ds = r[0] - q[0], dz = r[1] - q[1]
    const en: V3 = [u[0] * dz, u[1] * dz, -ds]
    face(edge, [P(q[0], q[1], o0), P(r[0], r[1], o0), P(r[0], r[1], o0 + t), P(q[0], q[1], o0 + t)], en)
  }
}

/** A closed cylinder from c along `axis` (unit) for length h, radius r. */
export function cyl(p: Part, c: V3, axis: V3, r: number, h: number, seg = 8, capEnds = true) {
  const ref: V3 = Math.abs(axis[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const e1n = [axis[1] * ref[2] - axis[2] * ref[1], axis[2] * ref[0] - axis[0] * ref[2], axis[0] * ref[1] - axis[1] * ref[0]]
  const l1 = Math.hypot(e1n[0], e1n[1], e1n[2])
  const e1: V3 = [e1n[0] / l1, e1n[1] / l1, e1n[2] / l1]
  const e2: V3 = [axis[1] * e1[2] - axis[2] * e1[1], axis[2] * e1[0] - axis[0] * e1[2], axis[0] * e1[1] - axis[1] * e1[0]]
  const pt = (k: number, t: number): V3 => {
    const a = (k / seg) * 2 * Math.PI
    return [0, 1, 2].map((i) => c[i] + axis[i] * t + r * (Math.cos(a) * e1[i] + Math.sin(a) * e2[i])) as V3
  }
  const nr = (k: number): V3 => { const a = (k / seg) * 2 * Math.PI; return [0, 1, 2].map((i) => Math.cos(a) * e1[i] + Math.sin(a) * e2[i]) as V3 }
  for (let k = 0; k < seg; k++) {
    const A = pt(k, 0), B = pt(k + 1, 0), C = pt(k + 1, h), D = pt(k, h)
    p.tri(A, B, C, undefined, undefined, undefined, [nr(k), nr(k + 1), nr(k + 1)])
    p.tri(A, C, D, undefined, undefined, undefined, [nr(k), nr(k + 1), nr(k)])
  }
  if (capEnds) {
    const c1: V3 = [c[0] + axis[0] * h, c[1] + axis[1] * h, c[2] + axis[2] * h]
    face(p, Array.from({ length: seg }, (_, k) => pt(k, h)), axis)
    face(p, Array.from({ length: seg }, (_, k) => pt(k, 0)), [-axis[0], -axis[1], -axis[2]])
    void c1
  }
}

/**
 * A standing statue, about h tall, on (x, y, z): a robed figure turned to
 * face `ang` (a lathe body, a head and a forward arm block). Bold, not fine.
 */
export function statue(p: Part, x: number, y: number, z: number, h: number, ang = 0, seg = 5) {
  const k = h / 2.4
  lathe(p, x, y, [[0.5 * k, z], [0.42 * k, z + 1.2 * k], [0.4 * k, z + 1.85 * k], [0.16 * k, z + 2.0 * k], [0.22 * k, z + 2.15 * k], [0.12 * k, z + 2.38 * k], [0, z + 2.4 * k]], seg)
  // an arm raised across the chest, standing forward
  const c = Math.cos(ang), s = Math.sin(ang)
  obox(p, p, x + c * 0.3 * k, y + s * 0.3 * k, ang + 0.6, 0.14 * k, 0.32 * k, z + 1.25 * k, z + 1.75 * k)
}

/** A vase on a foot, about 1.45 k tall (lighter than the westerkerk urn). */
export function vase(p: Part, x: number, y: number, z: number, k = 1, seg = 6) {
  lathe(p, x, y, [[0.3 * k, z], [0.16 * k, z + 0.3 * k], [0.42 * k, z + 0.7 * k], [0.2 * k, z + 1.1 * k], [0.12 * k, z + 1.45 * k], [0, z + 1.5 * k]], seg)
}

/** A clock: a dark ring with a pale dial, on wall a→b. */
export function clockOn(ring: Part, dial: Part, a: XY, b: XY, c: number, z: number, r: number) {
  discOn(ring, a, b, c, z, r, 0.1, 10)
  discOn(dial, a, b, c, z, r * 0.82, 0.16, 10)
}

/** A cornice along wall a→b: a projecting band from s0 to s1, z0..z1, with a chamfered top. */
export function corniceOn(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out: number) {
  const b2 = Math.min(out * 0.6, (z1 - z0) * 0.5)
  const { P, n } = along(a, b)
  // front, top bevel, ends, underside
  face(p, [P(s0, z0, out), P(s1, z0, out), P(s1, z1 - b2, out), P(s0, z1 - b2, out)], [n[0], n[1], 0])
  face(p, [P(s0, z1 - b2, out), P(s1, z1 - b2, out), P(s1, z1, 0), P(s0, z1, 0)], [n[0], n[1], 1.2])
  face(p, [P(s0, z0, 0), P(s1, z0, 0), P(s1, z0, out), P(s0, z0, out)], [0, 0, -1])
  const { u } = along(a, b)
  face(p, [P(s0, z0, 0), P(s0, z0, out), P(s0, z1 - b2, out), P(s0, z1, 0)], [-u[0], -u[1], 0])
  face(p, [P(s1, z0, out), P(s1, z0, 0), P(s1, z1, 0), P(s1, z1 - b2, out)], [u[0], u[1], 0])
}

/** A pilaster on wall a→b, centred c, half-width hw, `out` proud, with a cap band. */
export function pilasterOn(p: Part, a: XY, b: XY, c: number, hw: number, z0: number, z1: number, out = 0.35) {
  const { P, n, u } = along(a, b)
  const N: V3 = [n[0], n[1], 0], U: V3 = [u[0], u[1], 0], M: V3 = [-u[0], -u[1], 0]
  face(p, [P(c - hw, z0, out), P(c + hw, z0, out), P(c + hw, z1, out), P(c - hw, z1, out)], N)
  face(p, [P(c - hw, z0, 0), P(c - hw, z0, out), P(c - hw, z1, out), P(c - hw, z1, 0)], M)
  face(p, [P(c + hw, z0, out), P(c + hw, z0, 0), P(c + hw, z1, 0), P(c + hw, z1, out)], U)
}

/** A half column on wall a→b: half a cylinder, centred c, radius r. */
export function halfColumnOn(p: Part, a: XY, b: XY, c: number, r: number, z0: number, z1: number, seg = 6) {
  const { P, n, u } = along(a, b)
  for (let k = 0; k < seg; k++) {
    const t0 = (k / seg) * Math.PI, t1 = ((k + 1) / seg) * Math.PI
    const q = (t: number, z: number) => P(c - r * Math.cos(t), z, r * Math.sin(t))
    const nn = (t: number): V3 => [-u[0] * Math.cos(t) + n[0] * Math.sin(t), -u[1] * Math.cos(t) + n[1] * Math.sin(t), 0]
    p.tri(q(t0, z0), q(t1, z0), q(t1, z1), undefined, undefined, undefined, [nn(t0), nn(t1), nn(t1)])
    p.tri(q(t0, z0), q(t1, z1), q(t0, z1), undefined, undefined, undefined, [nn(t0), nn(t1), nn(t0)])
  }
}

/** A niche: a dark arched panel with a statue standing in front of it. */
export function nicheOn(back: Part, fig: Part, a: XY, b: XY, c: number, hw: number, z0: number, zs: number, figH: number) {
  archOn(back, a, b, c, hw, z0, zs, 0.05, 6)
  const { P, n } = along(a, b)
  const f = P(c, z0, 0.55)
  bbox(fig, fig, f[0] - 0.45, f[1] - 0.45, f[0] + 0.45, f[1] + 0.45, z0 - 0.5, z0 + 0.05, 0.08)
  statue(fig, f[0], f[1], z0 + 0.05, figH, Math.atan2(n[1], n[0]))
}

/** Floodlight: walls lit, tops a little. */
export const floodFront = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.9)

// ---------------------------------------------------------------------------
// Theatinerkirche

const YC = 0.55

/** A wall quad on a→b from z0 to z1 (outward = the ring's right-hand side). */
function wallAB(p: Part, a: XY, b: XY, z0: number, z1: number) {
  p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
}

/** The side of a rect ring facing direction (nx, ny), as a counter-clockwise wall a→b. */
function sideOf(x0: number, y0: number, x1: number, y1: number, nx: number, ny: number): [XY, XY] {
  if (nx > 0) return [[x1, y0], [x1, y1]]
  if (nx < 0) return [[x0, y1], [x0, y0]]
  if (ny > 0) return [[x1, y1], [x0, y1]]
  return [[x0, y0], [x1, y0]]
}

function build() {
  const ochre = new Part(), trim = new Part(), copper = new Part(), roof = new Part(), win = new Part(), patina = new Part()
  const Y = (d: number) => YC + d

  const EAVE = 29.0, RIDGE = 36.5, CLR = 9.6, CHW = 16.1, CHE = 16.0
  const XF = 33.6 // facade plane between the towers
  const XB = XF - 3.0 // back of the facade block
  const XT0 = 22.8, XT1 = 33.0 // towers
  const XN0 = 2.3 // nave from the crossing

  // -------------------------------------------- nave, chapels, buttresses
  walls(ochre, rect(XN0, Y(-CLR), XB, Y(CLR)), CHE - 1, EAVE)
  gableRoof(roof, ochre, XN0, Y(-CLR), XB + 0.5, Y(CLR), EAVE, RIDGE, true, 0.45, 0)
  for (const s of [-1, 1]) {
    const y0 = Y(s * CLR), y1 = Y(s * CHW)
    walls(ochre, rect(XN0, Math.min(y0, y1), XB, Math.max(y0, y1)), 0, CHE)
    face(patina, [[XN0, Y(s * (CHW + 0.3)), CHE - 0.15], [XB, Y(s * (CHW + 0.3)), CHE - 0.15], [XB, y0, CHE + 1.6], [XN0, y0, CHE + 1.6]], [0, s, 3])
    const [ca, cb] = sideOf(XN0, Math.min(y0, y1), XB, Math.max(y0, y1), 0, s)
    corniceOn(trim, ca, cb, 0, XB - XN0, CHE - 0.9, CHE - 0.2, 0.35)
    const [ea, eb] = sideOf(XN0, Y(-CLR), XB, Y(CLR), 0, s)
    corniceOn(trim, ea, eb, 0, XB - XN0, EAVE - 1.0, EAVE, 0.45)
  }
  // The flank, as High Contrast's photo shows it: three arched clerestory
  // windows over the chapels, each followed by a buttress with a concave
  // copper cap, the last against the tower.
  for (const s of [-1, 1]) {
    const [a, b] = sideOf(XN0, Y(-CLR), XB, Y(CLR), 0, s)
    const [c, d] = sideOf(XN0, Y(-CHW), XB, Y(CHW), 0, s)
    for (const xw of [4.9, 11.6, 18.3]) {
      const sc = s < 0 ? xw - XN0 : XB - xw
      archOn(win, a, b, sc, 1.45, 18.6, 22.6, 0.06, 6)
      archOn(win, c, d, sc, 1.1, 5.0, 9.6, 0.06, 6)
    }
    for (const xj of [8.25, 14.95, 21.4]) {
      const R = CHW - CLR - 0.4, Z0 = CHE + 1.8, H = EAVE - 1.6 - Z0
      const prof: XY[] = [[0, CHE + 0.8], [R, CHE + 0.8], [R, Z0]]
      for (let k = 1; k <= 6; k++) { const t = (k / 6) * Math.PI / 2; prof.push([R - R * Math.sin(t), Z0 + H * (1 - Math.cos(t))]) }
      const pa: XY = [xj - 1.4, Y(s * CLR)], pb: XY = [xj - 1.4, Y(s * (CLR + 10))]
      const [A, B] = s < 0 ? [pb, pa] : [pa, pb]
      slab(ochre, A, B, prof.map(([q, z]) => [s < 0 ? 10 - q : q, z] as XY), 2.8, 0, patina)
    }
  }

  // ------------------------------------------------- crossing and choir
  const XC = -10.6, TR = 20.0
  walls(ochre, rect(-22.4, Y(-TR), XN0, Y(TR)), 0, EAVE)
  hipRoof(roof, -22.4, Y(-TR), XN0, Y(TR), EAVE, RIDGE + 0.5, 0.45)
  for (const s of [-1, 1]) {
    const [a, b] = sideOf(-22.4, Y(-TR), XN0, Y(TR), 0, s), L = XN0 + 22.4
    corniceOn(trim, a, b, -0.2, L + 0.2, EAVE - 1.0, EAVE, 0.45)
    corniceOn(trim, a, b, 0, L, CHE - 0.9, CHE - 0.2, 0.3)
    archOn(win, a, b, L / 2, 1.8, 18.4, 23.4, 0.06, 8)
    rectOn(win, a, b, L / 2, 1.3, 6.0, 10.5, 0.06)
    for (const c of [0.8, L - 0.8]) pilasterOn(ochre, a, b, c, 0.8, 0, EAVE - 1.0, 0.3)
  }
  // The choir, at full eave height with its side rooms, and the apse.
  const XA = -32.3, RA = 10.3, CW = 16.0
  walls(ochre, rect(XA, Y(-CW), -22.4, Y(CW)), 0, EAVE)
  gableRoof(roof, null, XA, Y(-CW), -22.4, Y(CW), EAVE, RIDGE - 0.5, true, 0.45, 0)
  for (const s of [-1, 1]) {
    const [a, b] = sideOf(XA, Y(-CW), -22.4, Y(CW), 0, s), L = 9.9
    corniceOn(trim, a, b, -0.2, L, EAVE - 1.0, EAVE, 0.45)
    archOn(win, a, b, L / 2, 1.2, 17.0, 21.8, 0.06, 6)
    archOn(win, a, b, L / 2, 1.0, 6.5, 10.5, 0.06, 6)
  }
  {
    const N = 8, ring: XY[] = []
    for (let k = 0; k <= N; k++) { const t = Math.PI / 2 + (k / N) * Math.PI; ring.push([XA + RA * Math.cos(t), Y(RA * Math.sin(t))]) }
    for (let k = 0; k < N; k++) {
      const a = ring[k], b = ring[k + 1], L = along(a, b).L
      wallAB(ochre, a, b, 0, EAVE - 2)
      if (k % 2 === 1) archOn(win, a, b, L / 2, 1.0, 17.0, 21.5, 0.06, 6)
      corniceOn(trim, a, b, -0.05, L + 0.05, EAVE - 3, EAVE - 2, 0.4)
      const o = 0.5, t0 = Math.PI / 2 + (k / N) * Math.PI, t1 = Math.PI / 2 + ((k + 1) / N) * Math.PI
      face(roof, [[XA + (RA + o) * Math.cos(t0), Y((RA + o) * Math.sin(t0)), EAVE - 2.3], [XA + (RA + o) * Math.cos(t1), Y((RA + o) * Math.sin(t1)), EAVE - 2.3], [XA + 0.5, YC, RIDGE - 2.5]], [Math.cos((t0 + t1) / 2), Math.sin((t0 + t1) / 2), 1])
    }
  }

  // ------------------------------------------------- drum, dome, lantern
  {
    const R = 9.85, a0 = -Math.PI / 16
    lathe(ochre, XC, YC, [[R + 0.3, 29.0], [R + 0.3, 36.7], [R, 36.7], [R, 47.8]], 16, a0)
    lathe(trim, XC, YC, [[R + 0.3, 36.6], [R + 0.5, 37.2], [R, 37.5]], 16, a0)
    lathe(trim, XC, YC, [[R, 47.6], [R + 0.6, 48.4], [R + 0.6, 49.0], [R + 0.2, 49.5], [0, 49.5]], 16, a0)
    const ap = R * Math.cos(Math.PI / 16)
    for (let k = 0; k < 16; k++) {
      const t = (k * Math.PI) / 8, c = Math.cos(t), s = Math.sin(t)
      const cx = XC + ap * c, cy = YC + ap * s
      const a: XY = [cx + s * 1.9, cy - c * 1.9], b: XY = [cx - s * 1.9, cy + c * 1.9]
      if (k % 2 === 0) {
        archOn(win, a, b, 1.9, 1.15, 39.0, 44.2, 0.06, 6)
      } else {
        pilasterOn(ochre, a, b, 1.35, 0.32, 37.5, 47.6, 0.4)
        pilasterOn(ochre, a, b, 2.45, 0.32, 37.5, 47.6, 0.4)
      }
    }
    // the dome: a raised half-ellipse, dark copper, eight dormers
    const prof: XY[] = []
    for (let i = 0; i <= 5; i++) { const t = (i / 5) * (Math.PI / 2) * 0.9; prof.push([3.3 + (R - 3.5) * Math.cos(t), 49.4 + 10.6 * Math.sin(t)]) }
    prof.push([3.2, 60.1], [0, 60.1])
    lathe(copper, XC, YC, prof, 16, a0)
    for (let k = 0; k < 8; k++) {
      const t = (k * Math.PI) / 4, c = Math.cos(t), s = Math.sin(t)
      const f = 9.55, cx = XC + f * c, cy = YC + f * s
      const a: XY = [cx + s * 1.1, cy - c * 1.1], b: XY = [cx - s * 1.1, cy + c * 1.1]
      const { P } = along(a, b)
      const zb = 50.6, zt = 53.9, zr = 55.1, back = -3.4
      face(copper, [P(0, zb, 0), P(2.2, zb, 0), P(2.2, zt, 0), P(1.1, zr, 0), P(0, zt, 0)], [c, s, 0])
      face(copper, [P(0, zb, 0), P(0, zb, back), P(0, zt, back), P(0, zt, 0)], [-s, c, 0])
      face(copper, [P(2.2, zb, back), P(2.2, zb, 0), P(2.2, zt, 0), P(2.2, zt, back)], [s, -c, 0])
      face(copper, [P(0, zt, 0), P(1.1, zr, 0), P(1.1, zr, back), P(0, zt, back)], [-s, c, 1.5])
      face(copper, [P(1.1, zr, 0), P(2.2, zt, 0), P(2.2, zt, back), P(1.1, zr, back)], [s, -c, 1.5])
      archOn(win, a, b, 1.1, 0.6, 51.2, 52.8, 0.05, 4)
    }
    // the lantern: an octagon with four arched openings, cornice, cap, ball, vane
    const L = ngon(XC, YC, 2.5, 8)
    walls(ochre, L, 59.9, 64.4)
    for (let k = 0; k < 8; k += 2) { const a = L[k], b = L[(k + 1) % 8]; archOn(win, a, b, along(a, b).L / 2, 0.45, 60.6, 62.8, 0.05, 4) }
    lathe(trim, XC, YC, [[2.4, 64.2], [2.95, 64.7], [2.95, 65.2], [0, 65.2]], 8, Math.PI / 8)
    lathe(copper, XC, YC, [[2.75, 65.2], [2.6, 66.2], [1.8, 67.4], [0.7, 68.2], [0.35, 68.6], [0, 68.7]], 8, Math.PI / 8)
    ball(copper, XC, YC, 69.0, 0.42, 6)
    column(copper, XC, YC, 69.2, 70.2, 0.09, 4)
    box(copper, XC - 0.07, YC - 0.6, XC + 0.07, YC + 0.45, 69.4, 70.0)
  }

  // --------------------------------------------------------------- towers
  // Stages: the order to 15.3-17, attic to 20.3, stage 2 to 32.3, the clock
  // storey to 43.8 under segmental pediments, the belfry 45-54.3, the cap.
  const ZC = 43.8, ZB = 45.0, ZT = 53.4
  for (const s of [-1, 1]) {
    const yi = Y(s * CHW), yo = Y(s * 25.9), y0 = Math.min(yi, yo), y1 = Math.max(yi, yo)
    const ty = (y0 + y1) / 2, tx = (XT0 + XT1) / 2, H = (XT1 - XT0) / 2
    walls(ochre, rect(XT0, y0, XT1, y1), 0, 32.3)
    cap(ochre, rect(XT0, y0, XT1, y1), 32.3)
    const faces = (h: number) => [[1, 0], [0, 1], [-1, 0], [0, -1]].map(([nx, ny]) => sideOf(tx - h, ty - h, tx + h, ty + h, nx, ny))
    for (const [a, b] of faces(H)) {
      const { L, n } = along(a, b)
      if (Math.abs(n[1]) > 0.5 && Math.sign(n[1]) === -s) continue // against the facade block
      for (const c of [0.55, L - 0.55]) { pilasterOn(ochre, a, b, c, 0.55, 1.6, 15.3, 0.4); pilasterOn(ochre, a, b, c, 0.55, 20.3, 31.0, 0.35) }
      corniceOn(trim, a, b, -0.4, L + 0.4, 15.3, 17.0, 0.7)
      corniceOn(trim, a, b, -0.3, L + 0.3, 19.6, 20.3, 0.5)
      corniceOn(trim, a, b, -0.4, L + 0.4, 31.0, 32.3, 0.6)
      corniceOn(trim, a, b, -0.15, L + 0.15, 0, 1.6, 0.3)
      archOn(win, a, b, L / 2, 0.85, 24.5, 28.0, 0.06, 6)
      archOn(win, a, b, L / 2, 0.8, 7.5, 11.5, 0.06, 6)
      if (n[0] > 0.5) rectOn(copper, a, b, L / 2, 0.8, 1.6, 4.6, 0.06)
    }
    const H3 = 4.6
    walls(ochre, rect(tx - H3, ty - H3, tx + H3, ty + H3), 32.3, ZC)
    cap(ochre, rect(tx - H3, ty - H3, tx + H3, ty + H3), ZC)
    for (const [a, b] of faces(H3)) {
      const { L } = along(a, b)
      for (const c of [0.5, L - 0.5]) pilasterOn(ochre, a, b, c, 0.5, 32.3, ZC - 1.0, 0.35)
      corniceOn(trim, a, b, -0.35, L + 0.35, ZC - 1.0, ZC, 0.5)
      clockOn(copper, trim, a, b, L / 2, 40.4, 1.3)
      archOn(win, a, b, L / 2, 0.65, 34.4, 37.0, 0.06, 6)
      const h = 1.6, c = L / 2 + 0.3, R = (c * c + h * h) / (2 * h), half = Math.asin(c / R)
      const seg: XY[] = [[-0.3, ZC], [L + 0.3, ZC]]
      for (let k = 1; k < 8; k++) { const t = half - (k / 8) * 2 * half; seg.push([L / 2 + R * Math.sin(t), ZC - (R - h) + R * Math.cos(t)]) }
      slab(trim, a, b, seg, 0.55, 0.0, trim, false)
    }
    // the belfry: an octagon with an arched opening and an oculus on each
    // main face, four big S-volutes on the diagonals and a ring of rolls
    const RB = 3.2
    const B = ngon(tx, ty, RB, 8)
    walls(ochre, B, ZC, ZT)
    lathe(trim, tx, ty, [[RB + 0.05, ZC], [RB + 0.4, ZB - 0.5], [RB + 0.4, ZB], [0, ZB]], 8, Math.PI / 8)
    for (let k = 0; k < 8; k++) {
      const a = B[k], b = B[(k + 1) % 8], { L, n } = along(a, b)
      if (Math.abs(n[0]) > 0.9 || Math.abs(n[1]) > 0.9) {
        archOn(win, a, b, L / 2, 0.6, ZB + 0.6, ZB + 4.0, 0.06, 6)
        discOn(win, a, b, L / 2, ZB + 6.2, 0.6, 0.06, 8)
        // a pair of rolls over the opening's shoulders
        const P = along(a, b).P
        for (const d of [-1, 1]) {
          const q = P(L / 2 + d * 1.15, ZB + 5.0, 0)
          cyl(copper, [q[0], q[1], ZB + 5.0], [n[0], n[1], 0], 0.62, 0.75, 6)
        }
      }
    }
    for (let k = 0; k < 4; k++) {
      // the diagonal volutes: a tall copper console in the diagonal plane,
      // flaring from the cap's cornice down and out to a big roll
      const t = Math.PI / 4 + (k * Math.PI) / 2, ux = Math.cos(t), uy = Math.sin(t), vx = -uy, vy = ux
      const at = (u: number): XY => [tx + ux * u, ty + uy * u]
      const W = 0.55
      const pa: XY = [at(0)[0] - vx * W, at(0)[1] - vy * W], pb: XY = [at(0)[0] + vx * W, at(0)[1] + vy * W]
      void pa; void pb
      // the console's outline in (u outward, z), drawn on a plane through the axis
      const prof: XY[] = [[RB - 0.4, ZB - 0.3], [RB + 1.3, ZB - 0.3], [RB + 2.45, ZB + 0.6], [RB + 2.45, ZB + 2.0], [RB + 1.5, ZB + 2.9]]
      for (let i = 1; i <= 5; i++) { const w = (i / 5) * (Math.PI / 2); prof.push([RB + 1.5 - 1.6 * Math.sin(w), ZB + 2.9 + (ZT + 0.6 - ZB - 2.9) * (1 - Math.cos(w))]) }
      prof.push([RB - 0.4, ZT + 0.6])
      const A: XY = [tx + vx * W, ty + vy * W], Bv: XY = [tx + vx * W + ux, ty + vy * W + uy]
      slab(copper, A, Bv, prof, 2 * W, 0, copper)
      // the big roll at its foot, a pale spiral on each face
      const r = at(RB + 1.25)
      cyl(copper, [r[0] - vx * (W + 0.15), r[1] - vy * (W + 0.15), ZB + 1.05], [vx, vy, 0], 1.3, 2 * W + 0.3, 8)
      for (const sd of [-1, 1]) {
        const c: XY = [r[0] + sd * vx * (W + 0.17), r[1] + sd * vy * (W + 0.17)]
        const e: XY = [c[0] - sd * ux, c[1] - sd * uy], f: XY = [c[0] + sd * ux, c[1] + sd * uy]
        discOn(trim, e, f, 1, ZB + 1.05, 0.95, 0.02, 8)
      }
      // a smaller roll under the cap's cornice
      const q = at(RB + 0.2)
      cyl(copper, [q[0] - vx * (W + 0.1), q[1] - vy * (W + 0.1), ZT - 0.2], [vx, vy, 0], 0.75, 2 * W + 0.2, 6)
    }
    // the cap: a cornice, a big onion, a small lantern, a second onion,
    // ball and finial to 64.6 m
    lathe(trim, tx, ty, [[RB - 0.1, ZT - 0.2], [RB + 0.75, ZT + 0.35], [RB + 0.75, ZT + 0.9], [0, ZT + 0.9]], 8, Math.PI / 8)
    const Z = ZT + 0.9
    lathe(copper, tx, ty, [[3.55, Z], [3.9, Z + 1.2], [3.7, Z + 2.4], [2.7, Z + 3.7], [1.35, Z + 4.7], [0.9, Z + 5.3], [0, Z + 5.3]], 8, Math.PI / 8)
    walls(ochre, ngon(tx, ty, 0.95, 8), Z + 5.3, Z + 6.9)
    lathe(copper, tx, ty, [[1.25, Z + 6.9], [1.35, Z + 7.4], [0.95, Z + 8.1], [0.3, Z + 8.6], [0, Z + 8.7]], 8, Math.PI / 8)
    ball(copper, tx, ty, Z + 9.05, 0.4, 6)
    lathe(copper, tx, ty, [[0.16, Z + 9.3], [0.04, 64.6], [0, 64.6]], 4)
  }

  // ------------------------------------------------------------ the facade
  // Face +x at XF between the towers, s along +y from Y(-CHW). Seven axes
  // with the towers': outer axes at +-12.4, the frontispiece +-10 with
  // paired columns, niches at +-7.3, the portal.
  {
    const a: XY = [XF, Y(-CHW)], b: XY = [XF, Y(CHW)], W = 2 * CHW, M = W / 2
    walls(ochre, rect(XB, Y(-CHW), XF, Y(CHW)), 0, 20.3)
    cap(ochre, rect(XB, Y(-CHW), XF, Y(CHW)), 20.3)
    const FP = 0.6, FH = 10.0
    slab(ochre, a, b, [[M - FH, 0], [M + FH, 0], [M + FH, 20.3], [M - FH, 20.3]], FP, 0, ochre, false)
    const af: XY = [XF + FP, Y(-CHW)], bf: XY = [XF + FP, Y(CHW)]
    corniceOn(trim, a, b, 0, W, 0, 1.6, 0.3)
    corniceOn(trim, af, bf, M - FH, M + FH, 0, 1.6, 0.3)
    corniceOn(trim, a, b, 0, M - FH, 15.3, 17.0, 0.7)
    corniceOn(trim, a, b, M + FH, W, 15.3, 17.0, 0.7)
    corniceOn(trim, af, bf, M - FH - 0.5, M + FH + 0.5, 15.3, 17.0, 0.7)
    corniceOn(trim, a, b, 0, W, 19.6, 20.3, 0.5)
    corniceOn(trim, af, bf, M - FH, M + FH, 19.6, 20.3, 0.5)
    const P = along(a, b).P
    for (const sg of [-1, 1]) {
      for (const d of [2.0, 2.85, 8.95, 9.8]) halfColumnOn(trim, af, bf, M + sg * d, 0.42, 1.6, 15.3)
      pilasterOn(ochre, a, b, M + sg * 15.5, 0.5, 1.6, 15.3, 0.35)
      nicheOn(win, trim, af, bf, M + sg * 5.6, 0.85, 4.5, 7.8, 2.7)
      discOn(trim, af, bf, M + sg * 5.6, 12.4, 0.75, 0.1, 10)
      rectOn(win, a, b, M + sg * 12.7, 0.75, 9.0, 12.4, 0.06)
      face(trim, [P(M + sg * 12.7 - 1.0, 12.6, 0.1), P(M + sg * 12.7 + 1.0, 12.6, 0.1), P(M + sg * 12.7, 13.5, 0.1)], [1, 0, 0])
      rectOn(win, a, b, M + sg * 12.7, 0.75, 5.6, 7.6, 0.06)
      rectOn(copper, a, b, M + sg * 12.7, 0.75, 1.6, 4.6, 0.06)
    }
    rectOn(copper, af, bf, M, 1.25, 1.6, 6.6, 0.06)
    archOn(trim, af, bf, M, 1.7, 6.6, 6.6, 0.12, 6)
    rectOn(trim, af, bf, M, 1.1, 8.9, 10.6, 0.08)
    discOn(trim, af, bf, M, 13.0, 0.7, 0.1, 10)
    for (const d of [-5.6, 0, 5.6]) slab(trim, af, bf, [[M + d - 1.8, 17.4], [M + d + 1.8, 17.4], [M + d + 1.8, 19.2], [M + d - 1.8, 19.2]], 0.12, 0, trim, false)

    // the upper storey, three axes, to 32.3, with the pediment
    const UW = 12.0, UX = XF + 0.2
    const ua: XY = [UX, Y(-UW)], ub: XY = [UX, Y(UW)]
    walls(ochre, rect(XB, Y(-UW), UX, Y(UW)), 20.3, 32.3)
    cap(trim, rect(XB, Y(-UW), UX, Y(UW)), 32.3)
    for (const sg of [-1, 1]) {
      for (const d of [1.95, 2.75]) halfColumnOn(trim, ua, ub, UW + sg * d, 0.38, 20.3, 30.6)
      for (const d of [8.1, 11.4]) pilasterOn(ochre, ua, ub, UW + sg * d, 0.55, 20.3, 30.6, 0.35)
      nicheOn(win, trim, ua, ub, UW + sg * 5.4, 0.8, 23.0, 26.0, 2.5)
      // a scroll wing down to the attic, against the tower
      const SW = 3.0
      const prof: XY[] = [[0, 20.3], [SW, 20.3], [SW, 21.4]]
      for (let k = 1; k <= 6; k++) { const t = (k / 6) * Math.PI / 2; prof.push([SW - SW * Math.sin(t), 21.4 + 7.4 * (1 - Math.cos(t))]) }
      const [wa, wb]: [XY, XY] = sg > 0 ? [[XF - 0.3, Y(UW)], [XF - 0.3, Y(UW + SW)]] : [[XF - 0.3, Y(-UW - SW)], [XF - 0.3, Y(-UW)]]
      slab(ochre, wa, wb, sg > 0 ? prof : prof.map(([q, z]) => [SW - q, z] as XY), 0.9, 0, trim)
      vase(trim, XF, Y(sg * 15.5), 20.3, 1.3, 6)
      vase(trim, UX - 0.3, Y(sg * (UW - 0.6)), 32.3, 1.8, 6)
    }
    rectOn(win, ua, ub, UW, 1.05, 22.6, 27.8, 0.06)
    corniceOn(trim, ua, ub, UW - 1.7, UW + 1.7, 27.9, 28.6, 0.35)
    corniceOn(trim, ua, ub, -0.2, 2 * UW + 0.2, 30.6, 32.3, 0.65)
    slab(ochre, ua, ub, [[0, 32.3], [2 * UW, 32.3], [UW, 37.0]], 0.3, 0)
    slab(trim, ua, ub, [[UW, 37.4], [-0.6, 32.6], [-0.3, 32.2], [UW, 36.6]], 0.7, 0)
    slab(trim, ua, ub, [[UW, 37.4], [UW, 36.6], [2 * UW + 0.3, 32.2], [2 * UW + 0.6, 32.6]], 0.7, 0)
    const oval: XY[] = []
    for (let k = 0; k < 10; k++) { const t = (k / 10) * 2 * Math.PI; oval.push([UW + 1.6 * Math.cos(t), 34.0 + 1.5 * Math.sin(t)]) }
    slab(trim, ua, ub, oval, 0.55, 0.3, trim, false)
    const Q = along(ua, ub).P
    ball(trim, Q(UW, 0, 0.8)[0], Q(UW, 0, 0.8)[1], 35.8, 0.6, 6)
    for (const sg of [-1, 1]) statue(trim, Q(UW + sg * 2.5, 0, 0.7)[0], Q(UW + sg * 2.5, 0, 0.7)[1], 32.4, 1.8, 0)
  }

  const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : p[0] > 20 || p[2] > 34 ? 0.9 : 0.5)
  return [
    { part: ochre, material: { ...finish('theatiner-ochre', 0xe8bd60), floodlight: flood } },
    { part: trim, material: finish('theatiner-cream', 0xf2e6c9) },
    { part: copper, material: finish('theatiner-copper', 0x52625c) },
    { part: roof, material: finish('theatiner-roof', 0x737b81) },
    { part: patina, material: PALETTE.patina },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) await save('munich-theatinerkirche', 'Theatinerkirche', [48.142069, 11.576617], 14.5, build(), 6500)
