/**
 * Madrid-Barajas Terminal 4 (Richard Rogers Partnership with Estudio
 * Lamela, engineers TPS/Anthony Hunt and OTEP/HCA; opened 5 February 2006):
 * the processor under its roof strips, the landside canopy over the
 * departures road and the 1.17 km pier — procedural, CC0-1.0, no textures.
 * bun generators/madrid-barajas-terminal-4.ts
 *
 * Writes models/madrid-barajas-terminal-4.glb (low: the 9 m bands paired
 * into 18 m modules, trees every 36 m) and
 * models/madrid-barajas-terminal-4.detail.glb (detail: every 9 m band, the
 * oculi on the crests and the rooflight slots at the joints, mullions, trees
 * every 18 m).
 *
 * Colours within six materials: roof (its silver top, also the soffits,
 * stems, mullion lines and links), window (glass walls, and the canyons',
 * oculi's and slots' glazing), and four tree colours: blue (north, the K
 * gates) → green → yellow (centre, J gates, the processor) → red (south, H
 * gates). The photographed orange between yellow and red is folded into
 * red, and the light blue/lime steps into blue and green. (A split into
 * several placements, to carry more colours, was tried and dropped: the
 * map's terrain here is a surface model with the terminal's roof in it,
 * and each placement's ground fill is spanned from the raw terrain round
 * it, so at every seam the fill rose through the roof.)
 *
 * This file also holds the kit the other Madrid T4/T4S models import
 * (`MAD` colours, `strip`, `canyon`, `oculi`, `link`, `collect`); the model is
 * only written when this file is run directly.
 *
 * Frame: the T4 frame has its origin at -3.5921,
 * 40.4914, x east, y north, bearing 0 (the pier's long walls run due north in
 * OSM, to 0.1 m over 1.1 km). The model is written relative to its anchor,
 * the area centroid of the outline, (44.5, −2.2) in this frame.
 *
 * Identifying features (photos, PNOA orthophoto): a field of parallel roof
 * bands 9 m wide running east–west across each strip, every band a shallow
 * silver barrel (crowned along its middle, low at the joints, where a slot
 * of rooflight runs) and every band waving across the strip: low tips at the
 * eaves, a crest a third of the way in on each side (where the oculi are), a
 * shallow valley over the central row of trees. The band ends are cut
 * concave, so the eave reads as a row of cusps, with an edge beam in the
 * trees' colour; bamboo-slatted soffits; glass walls set in under the eaves;
 * Y-shaped steel trees outside the long glass walls holding the eaves, and
 * concrete-stemmed trees down the middle; between the strips the "canyons",
 * lines of glazed rooflights filling the cusps; and the colour of the trees
 * shifting along the building, blue at the north end, yellow in the middle,
 * red at the south end (El Español, below).
 *
 * Evidence
 * - OSM: way/8031397 (Terminal 4, building=transportation, aeroway=terminal;
 *   no height, no parts). In this frame: pier x 67.5/72…139, y −589.2…573.2;
 *   processor x −74.5…72, y −195.8…175.1; landside canopy x −142.9…−74.5,
 *   y −143.4…120.4; T-shaped jet-bridge links on the pier's sides. Gate
 *   nodes: H at y < −233, J at −233…+203, K at y > +275.
 * - PNOA orthophoto (Instituto Geográfico Nacional, PNOA-MA WMS, CC BY 4.0,
 *   https://www.ign.es/wms-inspire/pnoa-ma): the plan of the strips, the
 *   canyons at x ≈ −75, −2 and 72, the band pitch (9.0 m, counted over
 *   100 m in several places), the cusped band ends (cusps 6–7 m beyond the
 *   middle of each band's end), the oculi a third of the way in on each side,
 *   the roof's silver colour, the pier's roof from x 72 to 146.5.
 * - Published: area 470,000 m²; six levels, three above ground; 38 contact
 *   stands (es.wikipedia "Aeropuerto Adolfo Suárez Madrid-Barajas"); dock
 *   length up to 1,142 m (ArcelorMittal Constructalia case study); trees
 *   painted "del azul al rojo y pasando por el amarillo": blue K gates to the
 *   north, yellow J gates in the centre, red H gates to the south (El Español,
 *   "¿Sabías que puedes orientarte por los colores de la T4?"); blue marks the
 *   north, red the south and yellow the centre (Dezeen, 12 Jan 2025, "RSHP
 *   and Estudio Lamela's Madrid-Barajas airport"); bamboo-lined ceilings,
 *   circular skylights in rows ("canyons") separating three linear sections,
 *   a wave-edged canopy over the drop-off (Dezeen).
 * - Photos (Wikimedia Commons / Flickr, all EVIDENCE):
 *   https://commons.wikimedia.org/wiki/File:Madrid_Barajas_Airport-Terminal_4S_(7146509957).jpg
 *     (Charles from Port Chester, New York, CC BY 2.0): the end of a pier of
 *     the same architecture, low oblique: the band profile across the pier
 *     (tips, crests, valley), the heights (scaled from the A340's 16.9 m
 *     fin), the edge beam and trees in colour, the central Y outside the
 *     recessed end wall;
 *   https://commons.wikimedia.org/wiki/File:Madrid_Barajas_Airport-Terminal_4_(7000292700).jpg
 *     (Charles from Port Chester, New York, CC BY 2.0): a T4 pier's long
 *     airside wall and the end of the pier: the row of silver barrels, the
 *     cusped eave, the coloured trees outside the glass;
 *   https://commons.wikimedia.org/wiki/File:Madrid_Barajas_Airport-Terminal_4_(7146382753).jpg
 *     (same author, CC BY 2.0): the pier from across the apron;
 *   https://commons.wikimedia.org/wiki/File:Terminal_T-4_Madrid_-_Barajas_Airport_(8520153689)b.jpg
 *     (Magic Aviation, CC BY 2.5): the pier's airside wall beside the T4
 *     apron tower, yellow trees, the eave's barrels end-on;
 *   https://commons.wikimedia.org/wiki/File:Exterior_-_Aeropuerto_de_Madrid-Barajas_T4_-_Madrid_01.jpg
 *     (Javier Perez Montes, CC BY-SA 4.0): a yellow Y tree outside, the
 *     bamboo soffit outside the glass;
 *   https://commons.wikimedia.org/wiki/File:Terminal_4_del_aeropuerto_de_Madrid-Barajas,_Espa%C3%B1a,_2013-01-09,_DD_07.jpg
 *     and DD 01, DD 13, DD 16 (Diego Delso, CC BY-SA 3.0): the pier inside:
 *     the bands' wave, the oculi on the crests, the central trees, blue
 *     trees giving way to green (DD 13), orange (DD 01), yellow (DD 16);
 *   https://commons.wikimedia.org/wiki/File:20210629_Terminal_4,_Aeropuerto_de_Barajas,_Madrid,_Espa%C3%B1a.jpg
 *     (Cabeza2000, CC BY-SA 4.0): green trees at gate J59;
 *   https://commons.wikimedia.org/wiki/File:Barajas_T4_03.JPG (Ángel Riesgo
 *     Martínez, CC BY 2.5): yellow trees turning orange and red along the
 *     pier; https://www.flickr.com/photos/dalbera/4653538178 and 4685194730
 *     (Jean-Pierre Dalbéra, CC BY 2.0): the processor's yellow trees.
 * - Terrain: Mapterhorn z15 flat within 0.8 m under the pier and processor;
 *   it carries the processor's roof as a 26 m bump (a surface model), which
 *   the map fills from the ground around.
 * - No lidar (Spain's PNOA lidar was not used; no repo tool).
 *
 * Numbers: band pitch 9.0 m (PNOA); strips: canopy −151.5…−75, A −75…−2,
 * B −2…72, pier 72…146.5 (tips at the cusps, PNOA); band joints on one grid
 * from y −593.2 (the pier's south end, 4 m past the outline) every 9.0 m;
 * heights estimated from the T4S end photo (same architecture): eave tips
 * 14 m, crests 21 m, valley 18 m, crests at 31% of the half-width; barrel
 * crown 2.0 m (estimated from the barrels' humps in the airside photos); edge
 * beam 1.5 deep; long glass walls 9.5 m in from the cusps (estimated from
 * the trees standing outside the glass under the eave, and the T4S end
 * photo); end walls 4 m inside the roof's end; facade trees at the middle
 * of every other band, 3.5 m outside the glass, stem to 5.5 m, the arms up
 * to the band's two cusps (as in the photos);
 * jet-bridge links 4.6–8 m (estimated). Tree colours pulled to the palette's
 * lightness from the photos.
 * Doubts: the tree colours are four zones, not the real continuous
 * gradient (six-material limit, above); heights are photo estimates from
 * T4S, not measured at T4; the
 * processor may stand a little higher than the pier; no licensed photo of
 * the landside (the canopy over the departures road and its trees, drawn
 * by analogy with the airside); the canyons' ends (open light wells) are
 * simplified; each colour change along the pier is placed between the
 * photos (green at J59, yellow by the apron tower) and the published
 * blue–yellow–red order, two colours per model; the low model draws every
 * band but leaves out oculi, rooflight slots and mullions (in the detail).
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, quadN, unit } from './nyc-570-lexington'
import { despur, jetBridges, drum, writeLod } from './tokyo-haneda-terminal-1'

// ===========================================================================
// Kit (shared with the other Madrid T4 / T4S models)
// ===========================================================================

/** Barajas T4/T4S colours, from daylight photos, pulled to the palette's lightness. */
export const MAD = {
  /** The roof's silver aluminium top. */
  roof: finish('mad-roof-silver', 0xc8cdd1),
  /** The bamboo-slatted soffit under the eaves. */
  soffit: finish('mad-bamboo-soffit', 0xc9a273),
  /** Light grey-blue glass walls; lit at night. */
  window: { name: 'window', color: 0x8799aa, roughness: 0.35 } as MaterialSpec,
  /** The canyons' glazed rooflights: dark at night. */
  glass: PALETTE.glass as MaterialSpec,
  // the trees' rainbow, north to south
  blue: finish('mad-tree-blue', 0x5a6fba),
  lightBlue: finish('mad-tree-light-blue', 0x6fa7d8),
  green: finish('mad-tree-green', 0x70b46b),
  lime: finish('mad-tree-lime', 0xb2c957),
  yellow: finish('mad-tree-yellow', 0xeec84c),
  orange: finish('mad-tree-orange', 0xe8924c),
  vermilion: finish('mad-tree-vermilion', 0xdd6c50),
  red: finish('mad-tree-red', 0xcc5459),
}

/** The band's wave across a strip: u = −1 (one tip) … 0 (the valley) … 1. */
export type Prof = { zTip: number; zCrest: number; zValley: number; uc: number }
export const T4_PROF: Prof = { zTip: 14, zCrest: 21, zValley: 18, uc: 0.31 }
export function profZ(P: Prof, u: number) {
  const a = Math.min(1, Math.abs(u))
  if (a <= P.uc) return P.zValley + (P.zCrest - P.zValley) * (0.5 - 0.5 * Math.cos((Math.PI * a) / P.uc))
  const t = (a - P.uc) / (1 - P.uc)
  return P.zTip + (P.zCrest - P.zTip) * Math.cos((t * Math.PI) / 2)
}

export type Side = { canyon: boolean; wall: boolean }
export type Parts = { roof: Part; soffit: Part; win: Part; glass: Part; stem: Part }
export type StripSpec = {
  /** The cusp lines (the tips at the band joints). */
  x0: number; x1: number
  /** Joint grid: band k spans yA + k·p … yA + (k+1)·p for k in k0…k1−1. */
  yA: number; p: number; k0: number; k1: number
  prof: Prof
  /** How far the middle of each band's end stands in from the cusps. */
  scallop: number
  crown: number; depth: number
  left: (y: number) => Side; right: (y: number) => Side
  /** The long glass walls' x. */
  wallL: number; wallR: number
  /** End walls (glass) at these y, or none. */
  endS?: number | null; endN?: number | null
  /** Draw the whole soffit (an open canopy). */
  open?: boolean
  /** The edge beams' and trees' colour along y. */
  colour: (y: number) => Part
  /** Facade trees every n-th joint outside free long walls (0: none); central trees every n-th joint (0: none). */
  facadeEvery: number; centralEvery: number
  /** Central trees just outside the end walls. */
  endTrees?: boolean
  detail: boolean
  /** Coarser wave in the low model (strips seen mostly from above). */
  coarse?: boolean
}

const U_COARSE = [-1, -0.31, 0, 0.31, 1]
const U_LOW = [-1, -0.62, -0.31, 0, 0.31, 0.62, 1]
const U_DET = [-1, -0.8, -0.58, -0.31, -0.15, 0, 0.15, 0.31, 0.58, 0.8, 1]

/**
 * Where ground-touching parts start, in the frame the roof is built in: 0
 * normally; below 0 when the whole model is then lifted (T4, whose lowest
 * ground is the road cutting under the landside canopy).
 */
export let GROUND = 0
export function setGround(z: number) { GROUND = z }

/** A square-section member from A to B. */
export function beam3(p: Part, A: V3, B: V3, w: number, caps = false) {
  const d = unit([B[0] - A[0], B[1] - A[1], B[2] - A[2]])
  let s = unit([d[1] * 1 - d[2] * 0, d[2] * 0 - d[0] * 1, 0])
  if (Math.hypot(...s) < 1e-3 || Math.abs(d[2]) > 0.999) s = [1, 0, 0]
  const t = unit([d[1] * s[2] - d[2] * s[1], d[2] * s[0] - d[0] * s[2], d[0] * s[1] - d[1] * s[0]])
  const h = w / 2
  const off = (c: V3, a: number, b: number): V3 => [c[0] + (s[0] * a + t[0] * b) * h, c[1] + (s[1] * a + t[1] * b) * h, c[2] + (s[2] * a + t[2] * b) * h]
  const ca: [number, number][] = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
  for (let i = 0; i < 4; i++) {
    const [a0, b0] = ca[i], [a1, b1] = ca[(i + 1) % 4]
    const n = unit([s[0] * (a0 + a1) + t[0] * (b0 + b1), s[1] * (a0 + a1) + t[1] * (b0 + b1), s[2] * (a0 + a1) + t[2] * (b0 + b1)])
    quadN(p, off(A, a0, b0), off(A, a1, b1), off(B, a1, b1), off(B, a0, b0), [n, n, n, n])
  }
  if (caps) {
    const nb: V3 = [-d[0], -d[1], -d[2]]
    quadN(p, off(A, 1, 1), off(A, 1, -1), off(A, -1, -1), off(A, -1, 1), [nb, nb, nb, nb])
    quadN(p, off(B, 1, 1), off(B, -1, 1), off(B, -1, -1), off(B, 1, -1), [d, d, d, d])
  }
}

/** A Y tree: a stem from the ground, arms out to the given points. */
export function tree(stem: Part, arms: Part, base: XY, zs: number, ends: V3[], w: number, thin = false) {
  const m = thin ? tri3 : beam3
  m(stem, [base[0], base[1], GROUND], [base[0], base[1], zs], w * 1.25, !thin)
  for (const e of ends) m(arms, [base[0], base[1], zs - 0.3], e, w, false)
}

/** A member of triangular section (the low model's trees): three faces, no caps. */
export function tri3(p: Part, A: V3, B: V3, w: number, _caps = false) {
  const d = unit([B[0] - A[0], B[1] - A[1], B[2] - A[2]])
  let s = unit([d[1], -d[0], 0])
  if (Math.hypot(...s) < 1e-3 || Math.abs(d[2]) > 0.999) s = [1, 0, 0]
  const t = unit([d[1] * s[2] - d[2] * s[1], d[2] * s[0] - d[0] * s[2], d[0] * s[1] - d[1] * s[0]])
  const r = w * 0.6
  const off = (c: V3, a: number): V3 => [c[0] + (s[0] * Math.cos(a) + t[0] * Math.sin(a)) * r, c[1] + (s[1] * Math.cos(a) + t[1] * Math.sin(a)) * r, c[2] + (s[2] * Math.cos(a) + t[2] * Math.sin(a)) * r]
  for (let i = 0; i < 3; i++) {
    const a0 = (i * 2 * Math.PI) / 3, a1 = ((i + 1) * 2 * Math.PI) / 3, am = (a0 + a1) / 2
    const n = unit([s[0] * Math.cos(am) + t[0] * Math.sin(am), s[1] * Math.cos(am) + t[1] * Math.sin(am), s[2] * Math.cos(am) + t[2] * Math.sin(am)])
    quadN(p, off(A, a0), off(A, a1), off(B, a1), off(B, a0), [n, n, n, n])
  }
}

/**
 * One roof strip: its bands, edge beams, soffits, long and end walls, and
 * trees. Returns helpers to place things on the roof.
 */
export function strip(P: Parts, S: StripSpec) {
  const { x0, x1, yA, p, prof, scallop, crown, depth } = S
  const us = S.detail ? (S.coarse ? U_LOW : U_DET) : S.coarse ? U_COARSE : U_LOW
  const vs = S.detail ? [-1, -0.5, 0, 0.5, 1] : [-1, 0, 1]
  const yOf = (k: number, v: number) => yA + (k + (v + 1) / 2) * p
  const tips = (k: number, v: number): [number, number] => {
    const y = yOf(k, v), c = scallop * (1 - v * v)
    const l = x0 + c, r = x1 - c
    return [l, r]
  }
  /** A point on the roof's top, band k, u across, v along. */
  const top = (k: number, u: number, v: number): V3 => {
    const [l, r] = tips(k, v)
    return [l + ((u + 1) / 2) * (r - l), yOf(k, v), profZ(prof, u) + crown * (1 - v * v)]
  }
  /** The top's height at a given x within band k at v. */
  const zAt = (k: number, x: number, v: number) => {
    const [l, r] = tips(k, v)
    const u = Math.max(-1, Math.min(1, (2 * (x - l)) / (r - l) - 1))
    return profZ(prof, u) + crown * (1 - v * v)
  }
  const nrm = (k: number, u: number, v: number): V3 => {
    const e = 0.01
    const a = top(k, Math.max(-1, u - e), v), b = top(k, Math.min(1, u + e), v)
    const c = top(k, u, Math.max(-1, v - e)), d = top(k, u, Math.min(1, v + e))
    const du: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], dv: V3 = [d[0] - c[0], d[1] - c[1], d[2] - c[2]]
    const n = unit([du[1] * dv[2] - du[2] * dv[1], du[2] * dv[0] - du[0] * dv[2], du[0] * dv[1] - du[1] * dv[0]])
    return n[2] < 0 ? [-n[0], -n[1], -n[2]] : n
  }
  const down = (q: V3): V3 => [q[0], q[1], q[2] - depth]
  const flip = (n: V3): V3 => [-n[0], -n[1], -n[2]]

  for (let k = S.k0; k < S.k1; k++) {
    const yMid = yOf(k, 0)
    const edge = S.colour(yMid)
    const isEnd = (k === S.k0 && S.endS != null) || (k === S.k1 - 1 && S.endN != null)
    // the barrel top
    for (let i = 0; i < us.length - 1; i++) for (let j = 0; j < vs.length - 1; j++) {
      const a = top(k, us[i], vs[j]), b = top(k, us[i + 1], vs[j]), c = top(k, us[i + 1], vs[j + 1]), d = top(k, us[i], vs[j + 1])
      quadN(P.roof, a, b, c, d, [nrm(k, us[i], vs[j]), nrm(k, us[i + 1], vs[j]), nrm(k, us[i + 1], vs[j + 1]), nrm(k, us[i], vs[j + 1])])
    }
    // soffits: under the eaves out to the walls, or the whole band
    const soffitU = (side: -1 | 1): [number, number] | null => {
      const sd = side < 0 ? S.left(yMid) : S.right(yMid)
      if (S.open || isEnd) return side < 0 ? [-1, 0] : [0, 1]
      if (sd.canyon) return null
      // u of the wall line at the band's middle, plus a margin inside
      const [l, r] = tips(k, -1)
      const xw = side < 0 ? S.wallL + 1.2 : S.wallR - 1.2
      const uw = (2 * (xw - l)) / (r - l) - 1
      return side < 0 ? [-1, uw] : [uw, 1]
    }
    for (const side of [-1, 1] as const) {
      const rng = soffitU(side)
      if (!rng) continue
      const sub = us.filter((u) => u > rng[0] + 1e-6 && u < rng[1] - 1e-6)
      const uu = [rng[0], ...sub, rng[1]]
      for (let i = 0; i < uu.length - 1; i++) for (let j = 0; j < vs.length - 1; j++) {
        const a = down(top(k, uu[i], vs[j])), b = down(top(k, uu[i + 1], vs[j])), c = down(top(k, uu[i + 1], vs[j + 1])), d = down(top(k, uu[i], vs[j + 1]))
        quadN(P.soffit, a, d, c, b, [flip(nrm(k, uu[i], vs[j])), flip(nrm(k, uu[i], vs[j + 1])), flip(nrm(k, uu[i + 1], vs[j + 1])), flip(nrm(k, uu[i + 1], vs[j]))])
      }
    }
    // edge beams along the cusped band ends (both sides)
    for (const side of [-1, 1] as const) {
      const sd = side < 0 ? S.left(yMid) : S.right(yMid)
      if (sd.canyon && !S.detail) continue
      for (let j = 0; j < vs.length - 1; j++) {
        const a = top(k, side, vs[j]), b = top(k, side, vs[j + 1])
        const [l0, r0] = tips(k, vs[j]), [l1, r1] = tips(k, vs[j + 1])
        // outward normal of the cut in plan
        const dx = side < 0 ? l1 - l0 : r1 - r0, dy = b[1] - a[1]
        const n = unit(side < 0 ? [-dy, dx, 0] : [dy, -dx, 0])
        quadN(edge, down(a), down(b), b, a, [n, n, n, n])
      }
    }
    // the strip's ends: edge beam across the end band's profile
    for (const [kk, v, sg] of [[S.k0, -1, -1], [S.k1 - 1, 1, 1]] as [number, number, number][]) {
      if (k !== kk) continue
      const n: V3 = [0, sg, 0]
      for (let i = 0; i < us.length - 1; i++) {
        const a = top(k, us[i], v), b = top(k, us[i + 1], v)
        quadN(edge, down(a), down(b), b, a, [n, n, n, n])
      }
    }
    // long glass walls up to the soffit
    for (const side of [-1, 1] as const) {
      const sd = side < 0 ? S.left(yMid) : S.right(yMid)
      if (!sd.wall || S.open) continue
      const xw = side < 0 ? S.wallL : S.wallR
      const n: V3 = [side, 0, 0]
      let ya = yOf(k, -1), yb = yOf(k, 1)
      if (S.endS != null) ya = Math.max(ya, S.endS); if (S.endN != null) yb = Math.min(yb, S.endN)
      if (yb <= ya) continue
      const vv = (S.detail ? vs : [0]).map((v) => yOf(k, v)).filter((y) => y > ya + 0.05 && y < yb - 0.05)
      const ys = [ya, ...vv, yb]
      for (let j = 0; j < ys.length - 1; j++) {
        const va = ((ys[j] - yA) / p - k) * 2 - 1, vb = ((ys[j + 1] - yA) / p - k) * 2 - 1
        const za = zAt(k, xw, va) - depth - 0.1, zb = zAt(k, xw, vb) - depth - 0.1
        quadN(P.win, [xw, ys[j], GROUND], [xw, ys[j + 1], GROUND], [xw, ys[j + 1], zb], [xw, ys[j], za], [n, n, n, n])
      }
    }
  }
  // the rooflight slots along the joints (detail only): a thin glass line over each joint
  if (S.detail) for (let k = S.k0 + 1; k < S.k1; k++) {
    const su = U_LOW
    for (let i = 0; i < su.length - 1; i++) {
      const a = top(k, su[i], -1), b = top(k, su[i + 1], -1)
      const up: V3 = [0, 0, 1], hw = 0.45
      quadN(P.glass, [a[0], a[1] - hw, a[2] + 0.06], [b[0], b[1] - hw, b[2] + 0.06], [b[0], b[1] + hw, b[2] + 0.06], [a[0], a[1] + hw, a[2] + 0.06], [up, up, up, up])
    }
  }
  // end walls (glass) under the end bands
  for (const [ye, sg] of [[S.endS, -1], [S.endN, 1]] as [number | null | undefined, number][]) {
    if (ye == null || S.open) continue
    const k = sg < 0 ? S.k0 : S.k1 - 1
    const v = ((ye - yA) / p - k) * 2 - 1
    const n: V3 = [0, sg, 0]
    const xs = [S.wallL, ...us.map((u) => top(k, u, v)[0]).filter((x) => x > S.wallL + 0.3 && x < S.wallR - 0.3), S.wallR]
    for (let i = 0; i < xs.length - 1; i++) {
      const za = zAt(k, xs[i], v) - depth - 0.1, zb = zAt(k, xs[i + 1], v) - depth - 0.1
      quadN(P.win, [xs[i], ye, GROUND], [xs[i + 1], ye, GROUND], [xs[i + 1], ye, zb], [xs[i], ye, za], [n, n, n, n])
    }
  }
  // trees
  const w = S.detail ? 0.8 : 1.1
  const kOf = (y: number) => Math.min(S.k1 - 1, Math.max(S.k0, Math.floor((y - yA) / p)))
  const vOf = (y: number) => ((y - yA) / p - kOf(y)) * 2 - 1
  const under = (x: number, y: number) => zAt(kOf(y), x, vOf(y)) - depth
  for (let j = S.k0; j < S.k1; j++) {
    const y = yA + j * p
    // facade trees outside free long walls: at the middle of every other band, the arms up to its two cusps
    if (S.facadeEvery && j % S.facadeEvery === 0) {
      const yy = y + p / 2
      for (const side of [-1, 1] as const) {
        const sd = side < 0 ? S.left(yy) : S.right(yy)
        if (sd.canyon || (!sd.wall && !S.open)) continue
        if (S.endS != null && yy < S.endS + 2) continue
        if (S.endN != null && yy > S.endN - 2) continue
        const xw = side < 0 ? S.wallL : S.wallR
        const xt = xw + side * 3.5
        const xe = (side < 0 ? x0 : x1) - side * 1.2
        const ends: V3[] = [-1, 1].map((s) => { const ye = y + (s > 0 ? p : 0) + s * 0.2; return [xe, ye, under(xe, ye) + 0.25] as V3 })
        tree(S.colour(yy), S.colour(yy), [xt, yy], 5.5, ends, w, !S.detail)
      }
    }
    // central trees under the valley
    if (S.centralEvery && j % S.centralEvery === 1 % S.centralEvery) {
      const xc = (x0 + x1) / 2, half = (x1 - x0) / 2
      const ends: V3[] = []
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
        const xe = xc + sx * half * 0.22, ye = y + sy * p * 0.45
        ends.push([xe, ye, under(xe, ye) + 0.2])
      }
      tree(P.stem, S.colour(y), [xc, y], 8, ends, w * 1.3, !S.detail)
    }
  }
  if (S.endTrees) for (const [ye, sg] of [[S.endS, -1], [S.endN, 1]] as [number | null | undefined, number][]) {
    if (ye == null) continue
    const xc = (x0 + x1) / 2, half = (x1 - x0) / 2, yt = ye + sg * 2.2
    const ends: V3[] = [-1, 1].map((sx) => { const xe = xc + sx * half * 0.3; return [xe, yt + sg * 0.8, under(xe, yt + sg * 0.8) + 0.2] as V3 })
    tree(P.stem, S.colour(yt), [xc, yt], 8, ends, w * 1.3, !S.detail)
  }
  return { top, zAt, tips, yOf, kOf, vOf, under }
}

/** A canyon: a strip of glazed rooflight filling the cusps between two strips, at x, y0…y1. */
export function canyon(glass: Part, x: number, y0: number, y1: number, w: number, z: number) {
  const up: V3 = [0, 0, 1], dn: V3 = [0, 0, -1]
  quadN(glass, [x - w / 2, y0, z], [x + w / 2, y0, z], [x + w / 2, y1, z], [x - w / 2, y1, z], [up, up, up, up])
  quadN(glass, [x - w / 2, y0, z - 0.1], [x - w / 2, y1, z - 0.1], [x + w / 2, y1, z - 0.1], [x + w / 2, y0, z - 0.1], [dn, dn, dn, dn])
}

/** Oculi: round glazed openings on the crests, drawn as flat glass discs just above the top. */
export function oculi(glass: Part, S: ReturnType<typeof strip>, k: number, uc: number, r: number) {
  for (const u of [-uc, uc]) {
    const c = S.top(k, u, 0)
    const n = 8, up: V3 = [0, 0, 1]
    const ring: V3[] = Array.from({ length: n }, (_, i) => [c[0] + r * Math.cos((2 * Math.PI * i) / n), c[1] + r * 0.85 * Math.sin((2 * Math.PI * i) / n), c[2] + 0.12])
    for (let i = 1; i < n - 1; i++) glass.tri(ring[0], ring[i], ring[i + 1], undefined, undefined, undefined, [up, up, up])
  }
}

/** Pale horizontal mullion lines on a long glass wall (one strip per line). */
export function wallLines(trim: Part, x: number, side: -1 | 1, y0: number, y1: number, zs: number[], h = 0.45) {
  const n: V3 = [side, 0, 0], xx = x + side * 0.06
  for (const z of zs) {
    if (side > 0) quadN(trim, [xx, y0, z - h / 2], [xx, y1, z - h / 2], [xx, y1, z + h / 2], [xx, y0, z + h / 2], [n, n, n, n])
    else quadN(trim, [xx, y1, z - h / 2], [xx, y0, z - h / 2], [xx, y0, z + h / 2], [xx, y1, z + h / 2], [n, n, n, n])
  }
}
export function wallLinesY(trim: Part, y: number, side: -1 | 1, xA: number, xB: number, zs: number[], h = 0.45) {
  const n: V3 = [0, side, 0], yy = y + side * 0.06
  for (const z of zs) {
    if (side < 0) quadN(trim, [xA, yy, z - h / 2], [xB, yy, z - h / 2], [xB, yy, z + h / 2], [xA, yy, z + h / 2], [n, n, n, n])
    else quadN(trim, [xB, yy, z - h / 2], [xA, yy, z - h / 2], [xA, yy, z + h / 2], [xB, yy, z + h / 2], [n, n, n, n])
  }
}

/** Vertical mullions on a long wall at x, every `step` along y, up to the soffit. */
export function wallMullions(trim: Part, x: number, side: -1 | 1, y0: number, y1: number, step: number, zTop: (y: number) => number, w = 0.3) {
  const n: V3 = [side, 0, 0], xx = x + side * 0.07
  for (let y = y0 + step; y < y1 - 0.5; y += step) {
    const a: V3 = [xx, y - w / 2, 0.2], b: V3 = [xx, y + w / 2, 0.2], c: V3 = [xx, y + w / 2, zTop(y) - 0.3], d: V3 = [xx, y - w / 2, zTop(y) - 0.3]
    if (side > 0) quadN(trim, a, b, c, d, [n, n, n, n]); else quadN(trim, b, a, d, c, [n, n, n, n])
  }
}

// ===========================================================================
// T4 in its frame
// ===========================================================================

export const T4_ANCHOR = { lng: -3.5921, lat: 40.4914 }
/**
 * The apron and forecourt level above the lowest ground under the model
 * (the road cutting under the canopy's south end, 604.1 m on Mapterhorn):
 * 616.3 m round the pier and processor, read with tools/terrain.ts. The
 * building stands on it; walls, stems and posts run down to y = 0.
 */
export const T4_APRON = 12.2
/** The band-joint grid shared by all strips: joint j at y = −593.2 + 9 j. */
export const T4_YA = -593.2, T4_P = 9.0
export const T4_PIER = { x0: 72, x1: 146.5, wallL: 81.5, wallR: 137, k0: 0, k1: 130 }
/** The processor's strips (joints 44…86), the canopy (joints 50…80): even joints, so the low model can pair bands. */
export const T4_PROC = { k0: 44, k1: 86, A: [-75, -2], B: [-2, 72], wallW: -74.5 }
export const T4_CANOPY = { k0: 50, k1: 80, x0: -151.5, x1: -75 }

/** The trees' colour along T4, north to south. */
export const T4_ORDER = ['blue', 'lightBlue', 'green', 'lime', 'yellow', 'orange', 'vermilion', 'red'] as const
export function t4Key(y: number): (typeof T4_ORDER)[number] {
  if (y > 380) return 'blue'
  if (y > 150) return 'green'
  if (y > -230) return 'yellow'
  if (y > -330) return 'orange'
  return 'red'
}
/** The colour at y, or the nearest one along the rainbow among those the model carries. */
export function rainbow(M: Record<string, Part>, keyAt: (y: number) => string, order: readonly string[]) {
  return (y: number): Part => {
    const k = keyAt(y)
    if (M[k]) return M[k]
    const i = order.indexOf(k)
    for (let d = 1; d < order.length; d++) for (const j of [i - d, i + d]) if (M[order[j]]) return M[order[j]]
    throw new Error('no tree colour')
  }
}

/** OSM way/8031397 in the T4 frame (only the jet-bridge spurs are used). */
export const T4_OUTLINE: XY[] = [[-142.9,-143.4],[-74.5,-141.6],[-74.5,-195.8],[72.2,-194.3],[72.0,-275.8],[53.1,-276.1],[53.1,-269.0],[49.5,-268.9],[49.6,-287.7],[53.1,-287.7],[53.1,-280.3],[72.0,-280.3],[72.0,-305.7],[53.3,-306.0],[53.2,-298.7],[49.6,-298.8],[49.7,-317.4],[53.2,-317.4],[53.4,-310.1],[72.0,-309.9],[72.0,-350.8],[53.5,-350.8],[53.6,-343.5],[50.0,-343.4],[49.9,-362.1],[53.4,-362.1],[53.5,-355.0],[72.0,-354.8],[72.0,-392.4],[53.7,-392.7],[53.6,-385.4],[49.9,-385.4],[50.1,-404.0],[53.7,-404.0],[53.7,-396.7],[72.0,-396.9],[72.0,-440.0],[53.7,-440.2],[53.7,-433.1],[50.2,-433.1],[50.3,-451.6],[53.8,-451.6],[53.7,-444.6],[72.0,-444.4],[72.0,-481.9],[54.0,-482.2],[53.9,-474.9],[50.4,-474.9],[50.5,-493.8],[54.2,-493.6],[54.2,-486.5],[72.0,-486.5],[72.0,-526.7],[54.2,-526.8],[54.1,-519.7],[50.6,-519.7],[50.8,-538.6],[54.2,-538.6],[54.3,-531.1],[72.0,-531.0],[72.0,-568.4],[54.3,-568.7],[54.3,-561.6],[50.7,-561.5],[50.8,-580.1],[54.4,-580.1],[54.2,-573.2],[72.0,-573.0],[72.0,-589.2],[139.0,-589.2],[139.0,-533.8],[159.7,-533.9],[159.7,-541.0],[163.2,-541.0],[163.1,-522.3],[159.9,-522.3],[159.9,-529.4],[139.0,-529.3],[139.0,-417.3],[159.4,-417.4],[159.4,-424.4],[163.0,-424.4],[163.0,-405.8],[159.4,-405.7],[159.5,-412.6],[139.0,-412.6],[139.0,-360.9],[158.9,-360.7],[159.1,-368.0],[162.9,-368.0],[162.9,-349.0],[159.1,-349.1],[159.0,-356.1],[139.0,-356.2],[139.0,-315.8],[159.0,-315.8],[159.0,-323.0],[162.9,-323.1],[162.9,-304.3],[159.1,-304.3],[159.0,-311.4],[139.0,-311.4],[139.0,-235.4],[158.6,-235.1],[158.7,-242.3],[162.2,-242.4],[162.0,-223.6],[158.6,-223.6],[158.7,-230.8],[139.0,-230.8],[139.0,-178.4],[158.3,-178.5],[158.4,-185.6],[162.0,-185.7],[161.8,-167.0],[158.3,-166.9],[158.3,-174.0],[139.0,-174.1],[139.0,-136.9],[158.2,-136.5],[158.3,-143.9],[161.7,-144.1],[161.6,-125.2],[158.2,-125.2],[158.2,-132.3],[139.0,-132.4],[139.0,-91.9],[158.1,-91.9],[158.1,-99.4],[161.7,-99.3],[161.6,-80.2],[158.0,-80.4],[157.9,-87.5],[139.0,-87.5],[139.0,-50.1],[157.7,-50.0],[157.8,-52.2],[157.7,-57.0],[161.4,-57.0],[161.2,-38.4],[157.7,-38.4],[157.7,-45.6],[139.0,-45.6],[139.0,36.4],[157.1,36.5],[157.2,29.4],[160.6,29.3],[160.5,48.1],[157.3,48.1],[157.3,40.9],[139.0,40.9],[139.0,72.4],[157.1,72.5],[157.1,65.0],[160.5,65.1],[160.5,84.0],[157.0,83.8],[157.1,76.8],[139.0,76.8],[139.0,114.0],[156.9,114.3],[157.0,107.2],[160.4,107.2],[160.4,125.8],[157.1,125.8],[157.0,118.6],[139.0,118.6],[139.0,158.8],[156.6,159.1],[156.8,151.7],[160.3,151.7],[160.3,170.7],[156.7,170.7],[156.6,163.4],[139.0,163.3],[139.0,200.8],[156.5,200.9],[156.6,193.6],[160.2,193.5],[160.2,212.4],[156.6,212.3],[156.6,205.2],[139.0,205.3],[139.0,272.5],[156.2,272.6],[156.2,265.3],[160.1,265.3],[160.0,284.2],[156.2,284.2],[156.3,276.9],[139.0,276.9],[139.0,308.5],[156.0,308.6],[156.1,301.1],[159.5,301.1],[159.5,319.9],[156.0,319.9],[156.1,312.6],[139.0,312.6],[139.0,359.3],[156.0,359.2],[156.0,352.0],[159.3,351.9],[159.1,370.5],[155.9,370.5],[156.0,363.4],[139.0,363.2],[139.0,418.9],[155.6,418.9],[155.8,411.5],[159.2,411.5],[159.1,430.3],[155.7,430.3],[155.6,423.3],[139.0,423.2],[139.0,484.7],[155.2,484.5],[155.3,477.4],[158.9,477.4],[158.8,496.1],[155.4,496.2],[155.4,488.9],[139.0,488.9],[139.0,523.4],[155.2,523.4],[155.2,515.8],[158.9,515.8],[158.7,534.9],[155.1,534.8],[155.2,527.8],[139.0,527.6],[139.0,573.2],[67.5,573.2],[67.5,266.9],[68.7,175.3],[-73.1,175.1],[-72.9,120.6],[-143.9,120.1]]

/** The jet-bridge links OSM draws: each a T from the pier's wall. Returns [root on the wall, far end] pairs. */
export function t4Bridges(y0: number, y1: number): [XY, XY, number][] {
  const out: [XY, XY, number][] = []
  const { spurs } = despur(T4_OUTLINE, 9.5, 12)
  for (const s of spurs) {
    const a = s[0], b = s[s.length - 1]
    const root: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    let far = s[1], dmax = 0
    for (const q of s) { const d = Math.abs(q[0] - root[0]); if (d > dmax) { dmax = d; far = q } }
    if (root[1] < y0 || root[1] >= y1 || dmax < 8) continue
    if (Math.abs(root[0] - 139) > 3 && Math.abs(root[0] - 72) > 3) continue
    const side = far[0] > root[0] ? 1 : -1
    out.push([[side > 0 ? T4_PIER.wallR : T4_PIER.wallL, root[1]], [far[0], root[1]], side])
  }
  return out
}

/** A fixed jet-bridge link: a box from the wall out to a stair tower at the far end. */
export function link(body: Part, win: Part, a: XY, b: XY, detail: boolean) {
  const z0 = 4.6, z1 = 8.0, w = 3.4
  const L = Math.abs(b[0] - a[0]), sg = Math.sign(b[0] - a[0])
  const xa = a[0], xb = b[0], y = a[1]
  const box = (p: Part, X0: number, X1: number, Y0: number, Y1: number, Z0: number, Z1: number) => {
    const lo = Math.min(X0, X1), hi = Math.max(X0, X1)
    const c: XY[] = [[lo, Y0], [hi, Y0], [hi, Y1], [lo, Y1]]
    for (let i = 0; i < 4; i++) { const q = c[i], r = c[(i + 1) % 4]; p.quad([q[0], q[1], Z0], [r[0], r[1], Z0], [r[0], r[1], Z1], [q[0], q[1], Z1]) }
    p.quad([lo, Y0, Z1], [hi, Y0, Z1], [hi, Y1, Z1], [lo, Y1, Z1]); p.quad([lo, Y1, Z0], [hi, Y1, Z0], [hi, Y0, Z0], [lo, Y0, Z0])
  }
  if (L < 4) return
  box(body, xa, xb - sg * 2, y - w / 2, y + w / 2, z0, z1)
  // the stair/lift head at the end: a taller box (a post in the low model)
  if (detail) box(body, xb - sg * 3.5, xb + sg * 0.5, y - 4.5, y + 4.5, GROUND, z1 + 0.8)
  else box(body, xb - sg * 2.5, xb + sg * 0.5, y - 2.5, y + 2.5, GROUND, z1 + 0.8)
  if (detail) for (const s of [-1, 1]) {
    const yy = y + s * (w / 2 + 0.04), n: V3 = [0, s, 0]
    const P0: V3 = [xa + sg * 0.6, yy, z0 + 0.9], P1: V3 = [xb - sg * 2.6, yy, z0 + 0.9], P2: V3 = [xb - sg * 2.6, yy, z1 - 0.7], P3: V3 = [xa + sg * 0.6, yy, z1 - 0.7]
    quadN(win, P0, P1, P2, P3, [n, n, n, n])
  }
}

/**
 * The whole of T4 in the T4 frame shifted by (dx, dy). The low model pairs
 * the 9 m bands into 18 m modules (same joints, every other one); the
 * detail model draws every band.
 */
export function buildT4(detail: boolean, colours: MaterialSpec[], dx: number, dy: number) {
  setGround(-T4_APRON)
  const P: Parts = { roof: new Part(), soffit: new Part(), win: new Part(), glass: new Part(), stem: new Part() }
  const cParts: Record<string, Part> = {}
  for (const c of colours) cParts[c.name] = new Part()
  const byName: Record<string, Part> = {}
  for (const [k, sw] of Object.entries(MAD)) if (cParts[(sw as MaterialSpec).name]) byName[k] = cParts[(sw as MaterialSpec).name]
  const colour = rainbow(byName, t4Key, T4_ORDER)
  const f = detail ? 1 : 2
  const prof = T4_PROF
  const common = { yA: T4_YA, p: T4_P * f, prof, scallop: 6.5, crown: 2.0, depth: 1.5, colour, detail }
  const free: Side = { canyon: false, wall: true }
  const canyonS: Side = { canyon: true, wall: false }
  const pr = T4_PROC
  const yProc0 = T4_YA + pr.k0 * T4_P, yProc1 = T4_YA + pr.k1 * T4_P
  const yEndS = T4_YA + 4.0, yEndN = T4_YA + T4_PIER.k1 * T4_P - 4.0
  const yC0 = T4_YA + T4_CANOPY.k0 * T4_P, yC1 = T4_YA + T4_CANOPY.k1 * T4_P

  // the pier
  const pier = strip(P, {
    ...common, x0: T4_PIER.x0, x1: T4_PIER.x1, k0: 0, k1: T4_PIER.k1 / f,
    left: (y) => (y > yProc0 && y < yProc1 ? canyonS : free), right: () => free,
    wallL: T4_PIER.wallL, wallR: T4_PIER.wallR, endS: yEndS, endN: yEndN,
    facadeEvery: 2, centralEvery: 0, endTrees: true, coarse: !detail,
  })
  // the processor's two strips and the landside canopy
  const sA = strip(P, {
    ...common, x0: pr.A[0], x1: pr.A[1], k0: pr.k0 / f, k1: pr.k1 / f,
    left: (y) => (y > yC0 && y < yC1 ? { canyon: true, wall: true } : free), right: () => canyonS,
    wallL: pr.wallW, wallR: pr.A[1], endS: yProc0 + 4.5, endN: yProc1 - 4.5,
    facadeEvery: 0, centralEvery: 0, coarse: true,
  })
  const sB = strip(P, {
    ...common, x0: pr.B[0], x1: pr.B[1], k0: pr.k0 / f, k1: pr.k1 / f,
    left: () => canyonS, right: () => canyonS,
    wallL: pr.B[0], wallR: pr.B[1], endS: yProc0 + 4.5, endN: yProc1 - 4.5,
    facadeEvery: 0, centralEvery: 0, coarse: true,
  })
  const sC = strip(P, {
    ...common, x0: T4_CANOPY.x0, x1: T4_CANOPY.x1, k0: T4_CANOPY.k0 / f, k1: T4_CANOPY.k1 / f,
    left: () => free, right: () => canyonS, wallL: T4_CANOPY.x0 + 9.5, wallR: T4_CANOPY.x1,
    open: true, facadeEvery: 2, centralEvery: detail ? 4 : 0, coarse: true,
  })
  if (detail) {
    for (let k = 0; k < T4_PIER.k1; k++) oculi(P.glass, pier, k, prof.uc, 2.6)
    for (let k = pr.k0; k < pr.k1; k++) { oculi(P.glass, sA, k, prof.uc, 2.6); oculi(P.glass, sB, k, prof.uc, 2.6) }
    for (let k = T4_CANOPY.k0; k < T4_CANOPY.k1; k++) oculi(P.glass, sC, k, prof.uc, 2.6)
  }
  // canyons: between canopy and A, A and B, B and the pier
  const zc = prof.zTip - 0.25
  canyon(P.glass, pr.A[0], yC0, yC1, 13.6, zc)
  canyon(P.glass, pr.A[1], yProc0, yProc1, 13.6, zc)
  canyon(P.glass, pr.B[1], yProc0, yProc1, 13.6, zc)
  // the processor's end walls continue across under the B|pier canyon to the pier's west wall
  for (const [ye, sg] of [[yProc0 + 4.5, -1], [yProc1 - 4.5, 1]] as [number, number][]) {
    const n: V3 = [0, sg, 0], xa = pr.B[1], xb = T4_PIER.wallL, z = prof.zTip - 1.6
    if (sg < 0) quadN(P.win, [xa, ye, GROUND], [xb, ye, GROUND], [xb, ye, z], [xa, ye, z], [n, n, n, n])
    else quadN(P.win, [xb, ye, GROUND], [xa, ye, GROUND], [xa, ye, z], [xb, ye, z], [n, n, n, n])
    wallLinesY(P.stem, ye, sg as -1 | 1, pr.wallW, T4_PIER.wallL, detail ? [5.5, 10.5] : [6.5])
  }
  // floor lines (and, in the detail, mullions) on the pier's long walls
  const zs = detail ? [5.2, 10.2] : [6.5]
  wallLines(P.stem, T4_PIER.wallR, 1, yEndS, yEndN, zs)
  wallLines(P.stem, T4_PIER.wallL, -1, yEndS, yProc0, zs); wallLines(P.stem, T4_PIER.wallL, -1, yProc1, yEndN, zs)
  if (detail) {
    wallMullions(P.stem, T4_PIER.wallR, 1, yEndS, yEndN, 4.5, (y) => pier.under(T4_PIER.wallR, y))
    wallMullions(P.stem, T4_PIER.wallL, -1, yEndS, yProc0, 4.5, (y) => pier.under(T4_PIER.wallL, y))
    wallMullions(P.stem, T4_PIER.wallL, -1, yProc1, yEndN, 4.5, (y) => pier.under(T4_PIER.wallL, y))
  }
  // jet-bridge links
  for (const [a, b] of t4Bridges(-1e9, 1e9)) link(P.stem, P.win, a, b, detail)
  setGround(0)
  return collect(P, colours, cParts, dx, dy, T4_APRON)
}

/**
 * The parts as materials: the soffits, stems, mullion lines and links take
 * the roof's silver, and the rooflights (canyons, oculi, slots) the window
 * glass, so the model keeps four tree colours within six materials.
 */
export function collect(P: Parts, colours: MaterialSpec[], cParts: Record<string, Part>, dx: number, dy: number, lift = 0) {
  if (process.env.MAD_DEBUG) console.log(Object.entries(P).map(([k, v]) => `${k} ${v.triangles}`).join(', '), Object.entries(cParts).map(([k, v]) => `${k} ${v.triangles}`).join(', '))
  const join = (to: Part, from: Part) => { to.pos.push(...from.pos); to.nrm.push(...from.nrm); to.uv.push(...from.uv) }
  join(P.roof, P.stem); join(P.roof, P.soffit); join(P.win, P.glass)
  const parts: { part: Part; material: MaterialSpec }[] = [
    { part: P.roof, material: MAD.roof },
    { part: P.win, material: MAD.window },
  ]
  for (const c of colours) parts.push({ part: cParts[c.name], material: c })
  for (const { part } of parts) for (let i = 0; i < part.pos.length; i += 3) { part.pos[i] -= dx; part.pos[i + 1] += lift; part.pos[i + 2] += dy }
  return parts
}

/** lng/lat of a point in the T4 frame. */
export function t4LngLat(x: number, y: number) {
  const kx = 111320 * Math.cos((T4_ANCHOR.lat * Math.PI) / 180), ky = 110540
  return { lng: +(T4_ANCHOR.lng + x / kx).toFixed(7), lat: +(T4_ANCHOR.lat + y / ky).toFixed(7) }
}

// ===========================================================================
// This model
// ===========================================================================

/** The anchor in the T4 frame: the area centroid of OSM way/8031397. */
export const ORIGIN: XY = [44.5, -2.2]

if (import.meta.main) {
  const [dx, dy] = ORIGIN
  const ll = t4LngLat(dx, dy)
  const extras = { bearing: 0, anchor: ll, osm: 'way/8031397', height: T4_APRON + T4_PROF.zCrest + 2.0 }
  const cols = [MAD.blue, MAD.green, MAD.yellow, MAD.red]
  writeLod('Madrid-Barajas Terminal 4', 'madrid-barajas-terminal-4.glb', buildT4(false, cols, dx, dy), extras, 8000, 250_000)
  writeLod('Madrid-Barajas Terminal 4', 'madrid-barajas-terminal-4.detail.glb', buildT4(true, cols, dx, dy), extras, 40_000, 1_500_000)
  console.log('anchor', ll)
}
