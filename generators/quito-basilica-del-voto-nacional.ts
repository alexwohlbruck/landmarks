/**
 * Basílica del Voto Nacional, Quito: procedural, CC0-1.0.
 * bun generators/quito-basilica-del-voto-nacional.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/quito-basilica-del-voto-nacional.glb, the low model (~5,040 tris;
 *   the 250 KB cap binds before the 6,500-tri complex budget, since nearly
 *   every face here is flat);
 * - models/quito-basilica-del-voto-nacional.detail.glb, drawn from zoom 16:
 *   every window a real recessed opening, roses with spokes, hub and ring
 *   tracery, pierced balustrades, a pierced lantern under each tower spire,
 *   crockets on the spires, ridge cresting and clerestory pinnacles.
 *
 * Map frame: x east, y north, z up, metres. Built turned to the church's
 * axis, bearing 38: the model's +y is the apse (real NE), -y the façade and
 * its twin towers (real SW), +x the real SE side. The anchor is the area
 * centroid of the OSM outline way/107938444.
 *
 * Real 3D throughout (reviewer's rule, no 2D fakes): the front towers'
 * belfry stage has paired lancet openings 1 m deep with dark louvres
 * (`window`) at the back; the crossing ("condor") tower's belfry is open
 * right through, both wall faces and the reveals modelled; the portals are
 * 1.4-2.2 m deep pointed arches under projecting wimperg gables; every
 * aisle bay has a sharp 3D wimperg standing 0.8 m proud over its window and
 * above the parapet, with a buttress pinnacle between bays at the aisle and
 * another at the clerestory cornice; flying buttresses are solid half-arches
 * from the aisle piers to the clerestory; the towers' corner buttresses run
 * the full height, stepping in at each balcony with a pinnacle on each
 * step; the crossing tower rises straight out of the roofs as a slender
 * square shaft with corner piers, an open lantern and the spire.
 * Only the small aisle/clerestory lancets of the low model are flush panels
 * (recessed in the detail model).
 *
 * OSM (© OpenStreetMap contributors, ODbL), fetched Nov 2026, in this frame:
 * - way/107938444 outline (building=cathedral, heritage WHC), 37 m wide,
 *   y -55..78. Parts: way/673325418 and way/673325419 the towers (13.2 m
 *   square, x ±5.3..18.5, y -55..-42, tagged height 115, not used, below);
 *   way/673325417 nave (x ±5.4) and way/673325413/-414 the aisles with
 *   chapels (to x ±17.6); way/673325416 transept (y -2.4..12.2, to x ±18.4);
 *   way/673473133 the round crossing-tower part (centre y 4.9, tagged 74);
 *   way/673325415 choir with rounded end (to y 33.5); way/673325410/-411
 *   ambulatory and chapels (rounded, to y 47.4); way/673325412 the long
 *   narrow rear block with short arms (y 47..78, arms x -12..8 at y 62-68),
 *   the Capilla del Inmaculado Corazón de María (es.wikipedia: complex 150 m
 *   long including it).
 *
 * Published (cited):
 * - nave 140 m long, 35 m wide, 30 m high (es/en.wikipedia "Basílica del
 *   Voto Nacional"); 24 side chapels 15 m high; clock faces 4.3 m across,
 *   three per tower (es.wikipedia); crossing 74 m (es.wikipedia, EcuRed).
 * - Tower height is published inconsistently: 115 m (EcuRed, El Telégrafo,
 *   OSM tag), 83 m (es.wikipedia infobox), "reduced to 78.23 m" from a
 *   105 m plan (es.wikipedia), "almost 80 m" (travel guides). Photo scaling
 *   (below) gives about 77 m to the cross, so the model follows 78.23 m plus
 *   the cross, not 115.
 *
 * Measured from photos (scale from the 4.3 m clock faces and the 13.2 m OSM
 * tower width; heights above the SE-side ground, the datum Z0 below):
 * - p12 (perspective-corrected side view): clock 42 px = 4.3 m and the
 *   tower-to-transept length both give 9.8 px/m at the tower plane: clock
 *   centre 47.7 m, balconies 28.5 and 41 m, aisle wall ~12 m with gables to
 *   ~15.6, clerestory cornice ~24, transept gable apex ~36-40 (corrected for
 *   depth), spire cut off at ~73 m.
 * - p11, p02, p04: clock centre to cross top 28-29.5 m, so the cross tops at
 *   ~76.5 m; crown gables to ~62, corner pinnacles ~64.5, spire tip 73.3.
 * - p03 and p09 (telephoto, both long sides): crossing tower to the cross is
 *   0.83-0.88 of the towers' rise above the eaves: cross top 70 m.
 * - roof rise ~7.5 m over the 24 m cornice (ridge 31.5), from p03.
 * Estimated: bay count (7 nave bays, from p08/p12), window and rose sizes,
 *   the condor tower's stage heights (p08), apse polygon and cone, the
 *   ambulatory height (15 m chapels, published), the rear chapel's height
 *   (no photo; OSM says one level: walls 8 m, ridge 13 m).
 *
 * Ground: Mapterhorn here exists only at z12 (~38 m pixels). Across the
 * footprint it rises ~8 m from the lowest point (apse end / SE side of the
 * façade) to the NW corner of the façade. y = 0 is that lowest ground; the
 * heights above are measured from the SE-side ground, set at Z0 = 2 m above
 * it (p12's lawn). `terrain.ts check --zoom 12`: ok.
 *
 * Colours from daylight photos (p03, p08, p10, p12 sampled), pulled to the
 * palette's lightness: a mid-grey andesite for the stone (#afaeab), the
 * same stone a shade darker for the aisle, chapel and clerestory walls that
 * stand in shade in p03/p12 (#a3a2a0), a very light neutral grey roof
 * (#c9cacb) with the dark triangular roof vents (`window`), white clock
 * faces, charcoal iron crosses. (Lead review, Nov 2026: earlier rose-brown
 * lower walls and blue-grey roof were wrong against p03/p12.)
 * Night (p17): stone floodlit (`_FLOODLIGHT`, faces looking up barely),
 * windows, belfry louvres and roof vents glow warm, clock faces glow white
 * (`neon-voto-clock`).
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 * - p01 "Quito as from panecillo Basilica.jpg", Cayambe, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:Quito_as_from_panecillo_Basilica.jpg
 * - p02 "Quito calle Venezuela Basilica.jpg", Cayambe, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:Quito_calle_Venezuela_Basilica.jpg
 * - p03 "Quito Basílica del Voto Nacional seen from Avenida 12 de Octubre.jpg",
 *   Ymblanter, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Quito_Bas%C3%ADlica_del_Voto_Nacional_seen_from_Avenida_12_de_Octubre.jpg
 * - p04 "Quito Basílica del Voto Nacional seen from Plaza Huerto San Agustín.jpg",
 *   Ymblanter, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Quito_Bas%C3%ADlica_del_Voto_Nacional_seen_from_Plaza_Huerto_San_Agust%C3%ADn.jpg
 * - p05 "Vista noroccidental. Basílica del Voto Nacional, Quito - Ecuador.jpg",
 *   Ranoutofusername, CC0,
 *   https://commons.wikimedia.org/wiki/File:Vista_noroccidental._Bas%C3%ADlica_del_Voto_Nacional,_Quito_-_Ecuador.jpg
 * - p08, p09, p10 "Basílica del Voto Nacional, Quito - 2/4/5.jpg", Maros
 *   Mráz, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:Bas%C3%ADlica_del_Voto_Nacional,_Quito_-_2.jpg (and _-_4, _-_5)
 * - p11 "Torres de la Basílica del Voto Nacional con vista al Panecillo.jpg",
 *   Martin.vascovinueza, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Torres_de_la_Bas%C3%ADlica_del_Voto_Nacional_con_vista_al_Panecillo.jpg
 * - p12 "Basilica del voto nacional.jpg", Quito magnífico (perspective
 *   corrected by Rabanus Flavus), CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Basilica_del_voto_nacional.jpg
 * - p13 "(La Basílica del Voto Nacional, Quito) a1b.JPG", David Adam Kess,
 *   CC BY-SA 4.0 (plinth and side stairs),
 *   https://commons.wikimedia.org/wiki/File:(La_Bas%C3%ADlica_del_Voto_Nacional,_Quito)_a1b.JPG
 * - p17 "Basílica del Voto Nacional, Quito (exterior) pic.ao11622.jpg" (night),
 *   David Adam Kess, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Bas%C3%ADlica_del_Voto_Nacional,_Quito_(exterior)_pic.ao11622.jpg
 *
 * Look-only: none. No lidar or open aerial covers Ecuador in the toolset.
 *
 * Doubts:
 * - the tower height (78.9 m to the cross over the lowest ground) disagrees
 *   with the popular 115 m figure; see above. If 115 m were right, every
 *   photo proportion here would be off by ~45%, which the clock scale rules
 *   out.
 * - the rear (Corazón de María) chapel and the NE end are unphotographed:
 *   plain gabled blocks on the OSM plan, heights invented from "1 level".
 * - z12 terrain puts the NW corner of the façade ~8 m above the lowest
 *   ground, burying the NW tower's portal sill several metres at the map;
 *   photos show a level terrace in front of the façade, so the coarse
 *   terrain probably overstates the slope there.
 * - the condor belfry is open and so not lit at night, where the real one
 *   glows orange from inside.
 * - gargoyles (Ecuadorian animals), statues and fine tracery are below the
 *   style's detail floor and left out.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const UP: V3 = [0, 0, 1]
const TAU = Math.PI * 2

export const BEARING = 38
/** Heights in the header are above this datum: the ground on the SE side, about 1.5 m over the lowest ground under the footprint. */
const Z0 = 2.0

type Mats = { stone: Part; low: Part; slate: Part; win: Part; clock: Part; iron: Part }

function build(detail: boolean): Mats {
  const M: Mats = { stone: new Part(), low: new Part(), slate: new Part(), win: new Part(), clock: new Part(), iron: new Part() }
  const D = detail
  const z = (h: number) => h + Z0

  // ------------------------------------------------------------ primitives
  const triN = (p: Part, a: V3, b: V3, c: V3, n: V3) => p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  const quadN = (p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) => { triN(p, a, b, c, n); triN(p, a, c, d, n) }
  /** Flat polygon (convex), normal from its geometry, turned away from `inside`. */
  const faceOut = (p: Part, pts: V3[], inside: V3) => {
    let n = unit(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])))
    if (Math.hypot(...n) < 0.5) n = unit(cross(sub(pts[2], pts[0]), sub(pts[3] ?? pts[1], pts[0])))
    const c = mul(pts.reduce(add, [0, 0, 0] as V3), 1 / pts.length)
    if (dot(n, sub(c, inside)) < 0) n = mul(n, -1)
    for (let i = 1; i < pts.length - 1; i++) triN(p, pts[0], pts[i], pts[i + 1], n)
  }
  /** Vertical prism over a convex ring (XY), from z0 to z1, with optional top cap. */
  const prism = (p: Part, ring: XY[], z0: number, z1: number, top: Part | null = p) => {
    const c: XY = [ring.reduce((s, q) => s + q[0], 0) / ring.length, ring.reduce((s, q) => s + q[1], 0) / ring.length]
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      const n = unit([b[1] - a[1], -(b[0] - a[0]), 0])
      const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      const nn = dot(n, [m[0] - c[0], m[1] - c[1], 0]) < 0 ? mul(n, -1) : n
      quadN(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], nn)
    }
    if (top) for (let i = 1; i < ring.length - 1; i++) triN(top, [ring[0][0], ring[0][1], z1], [ring[i][0], ring[i][1], z1], [ring[i + 1][0], ring[i + 1][1], z1], UP)
  }
  const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = p) => prism(p, rect(x0, x1, y0, y1), z0, z1, top)
  const ngon = (cx: number, cy: number, r: number, n: number, phase = 0): XY[] =>
    Array.from({ length: n }, (_, i) => [cx + r * Math.cos(phase + (i * TAU) / n), cy + r * Math.sin(phase + (i * TAU) / n)] as XY)
  /** Pyramid from a ring at height z to an apex. */
  const spike = (p: Part, ring: XY[], z0: number, apex: V3) => {
    const c: V3 = [apex[0], apex[1], z0]
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      faceOut(p, [[a[0], a[1], z0], [b[0], b[1], z0], apex], c)
    }
  }
  /** A pinnacle: n-sided shaft and a spike, with a small finial knob. */
  const pinnacle = (p: Part, cx: number, cy: number, r: number, z0: number, z1: number, tip: number, n = D ? 8 : 4) => {
    const ph = n === 4 ? Math.PI / 4 : Math.PI / n
    // smooth-shaded shaft and spike: soft edges, and welded corners keep the file small
    const rad = (a: number): V3 => [Math.cos(a), Math.sin(a), 0]
    const r2 = r * 1.08, slope = r2 / Math.max(0.1, tip - z1)
    for (let i = 0; i < n; i++) {
      const a0 = ph + (i * TAU) / n, a1 = ph + ((i + 1) * TAU) / n
      const n0 = rad(a0), n1 = rad(a1)
      const b0: V3 = [cx + r * n0[0], cy + r * n0[1], z0], b1: V3 = [cx + r * n1[0], cy + r * n1[1], z0]
      const t0: V3 = [b0[0], b0[1], z1], t1: V3 = [b1[0], b1[1], z1]
      p.tri(b0, b1, t1, undefined, undefined, undefined, [n0, n1, n1])
      p.tri(b0, t1, t0, undefined, undefined, undefined, [n0, n1, n0])
      const s0 = unit([n0[0], n0[1], slope]), s1 = unit([n1[0], n1[1], slope])
      const c0: V3 = [cx + r2 * n0[0], cy + r2 * n0[1], z1], c1: V3 = [cx + r2 * n1[0], cy + r2 * n1[1], z1]
      p.tri(c0, c1, [cx, cy, tip], undefined, undefined, undefined, [s0, s1, UP])
    }
    if (D && r2 > r) for (let i = 0; i < n; i++) {
      // the little ledge where the spike overhangs the shaft
      const a0 = ph + (i * TAU) / n, a1 = ph + ((i + 1) * TAU) / n
      const DN: V3 = [0, 0, -1]
      triN(p, [cx + r * Math.cos(a0), cy + r * Math.sin(a0), z1], [cx + r2 * Math.cos(a1), cy + r2 * Math.sin(a1), z1], [cx + r2 * Math.cos(a0), cy + r2 * Math.sin(a0), z1], DN)
      if (D) triN(p, [cx + r * Math.cos(a0), cy + r * Math.sin(a0), z1], [cx + r * Math.cos(a1), cy + r * Math.sin(a1), z1], [cx + r2 * Math.cos(a1), cy + r2 * Math.sin(a1), z1], DN)
    }
    if (D) {
      // crockets: a collar at the spike's foot, the gablets every Gothic pinnacle carries
      prism(p, ngon(cx, cy, r * 1.22, n, ph), z1 - 0.12 * (tip - z1) * 0.3, z1 + 0.05, p)
    }
  }
  /** A plain smooth-shaded spike (pinnacle top only): few corners, soft edges. */
  const cone = (p: Part, cx: number, cy: number, r: number, z0: number, tip: number, n = 4, ph = Math.PI / 4) => {
    const slope = r / Math.max(0.1, tip - z0)
    for (let i = 0; i < n; i++) {
      const a0 = ph + (i * TAU) / n, a1 = ph + ((i + 1) * TAU) / n
      const s0 = unit([Math.cos(a0), Math.sin(a0), slope]), s1 = unit([Math.cos(a1), Math.sin(a1), slope])
      p.tri([cx + r * Math.cos(a0), cy + r * Math.sin(a0), z0], [cx + r * Math.cos(a1), cy + r * Math.sin(a1), z0], [cx, cy, tip], undefined, undefined, undefined, [s0, s1, UP])
    }
  }
  /** Cross (iron), two crossed bars each way so it reads from any side. */
  const crossAt = (cx: number, cy: number, z0: number, h: number, w: number) => {
    const t = Math.max(0.18, h * 0.07)
    box(M.iron, cx - t, cx + t, cy - t, cy + t, z0, z0 + h)
    const za = z0 + h * 0.62
    box(M.iron, cx - w / 2, cx + w / 2, cy - t, cy + t, za, za + 2 * t)
    box(M.iron, cx - t, cx + t, cy - w / 2, cy + w / 2, za, za + 2 * t)
  }

  // ------------------------------------------------- face frames and walls
  type Frame = { o: V3; u: V3; n: V3 }
  /** Face through (cx, cy) + n * dist, normal (nx, ny) outward. */
  const frame = (cx: number, cy: number, nx: number, ny: number, dist: number): Frame =>
    ({ o: [cx + nx * dist, cy + ny * dist, 0], u: [-ny, nx, 0], n: [nx, ny, 0] })
  const P = (f: Frame, s: number, h: number, d = 0): V3 => add(add(add(f.o, mul(f.u, s)), mul(f.n, d)), [0, 0, h])
  /** Convex polygon in face coords (s, h) extruded between d0 and d1. */
  const slab = (p: Part, f: Frame, pts0: XY[], d0: number, d1: number, back = false) => {
    let area = 0
    for (let i = 0; i < pts0.length; i++) { const a = pts0[i], b = pts0[(i + 1) % pts0.length]; area += a[0] * b[1] - b[0] * a[1] }
    const pts = area < 0 ? [...pts0].reverse() : pts0
    for (let i = 1; i < pts.length - 1; i++) triN(p, P(f, ...pts[0], d1), P(f, ...pts[i], d1), P(f, ...pts[i + 1], d1), f.n)
    if (back) for (let i = 1; i < pts.length - 1; i++) triN(p, P(f, ...pts[0], d0), P(f, ...pts[i], d0), P(f, ...pts[i + 1], d0), mul(f.n, -1))
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length]
      const e = unit([b[0] - a[0], b[1] - a[1], 0])
      const n = add(mul(f.u, e[1]), mul(UP, -e[0]))
      quadN(p, P(f, ...a, d0), P(f, ...b, d0), P(f, ...b, d1), P(f, ...a, d1), n)
    }
  }
  /** A strip-shaped slab: top and bottom polylines (same length) in face coords, thickness t centred on d. */
  const band = (p: Part, f: Frame, top: XY[], bot: XY[], d: number, t: number, back = true) => {
    const d0 = d - t / 2, d1 = d + t / 2
    for (let i = 0; i < top.length - 1; i++) {
      for (const [dd, sg] of (back ? [[d1, 1], [d0, -1]] : [[d1, 1]]) as [number, number][])
        quadN(p, P(f, ...bot[i], dd), P(f, ...bot[i + 1], dd), P(f, ...top[i + 1], dd), P(f, ...top[i], dd), mul(f.n, sg))
      for (const [line, other] of [[top, bot], [bot, top]] as [XY[], XY[]][]) {
        const a = line[i], b = line[i + 1]
        const e = unit([b[0] - a[0], b[1] - a[1], 0])
        let n = add(mul(f.u, -e[1]), mul(UP, e[0]))
        const away = [a[0] - other[i][0], a[1] - other[i][1]]
        if (-e[1] * away[0] + e[0] * away[1] < 0) n = mul(n, -1)
        quadN(p, P(f, ...a, d0), P(f, ...b, d0), P(f, ...b, d1), P(f, ...a, d1), n)
      }
    }
    for (const i of [0, top.length - 1]) {
      const a = top[i], b = bot[i]
      const e = unit([a[0] - b[0], a[1] - b[1], 0])
      let n = add(mul(f.u, e[1]), mul(UP, -e[0]))
      const other = top[i === 0 ? 1 : top.length - 2]
      if ((other[0] - a[0]) * dot(n, f.u) + (other[1] - a[1]) * n[2] > 0) n = mul(n, -1)
      quadN(p, P(f, ...b, d0), P(f, ...a, d0), P(f, ...a, d1), P(f, ...b, d1), n)
    }
  }

  type Hole = { a0: number; a1: number; zb: number; zs: number }
  /** Pointed (equilateral) arch: left arc points from the springing to the apex. */
  const arcPts = (h: Hole, k: number): XY[] => {
    const w = (h.a1 - h.a0) / 2
    return Array.from({ length: k + 1 }, (_, i) => {
      const t = Math.PI - (i / k) * (Math.PI / 3)
      return [h.a1 + 2 * w * Math.cos(t), h.zs + 2 * w * Math.sin(t)] as XY
    })
  }
  const apexOf = (h: Hole) => h.zs + Math.sqrt(3) * ((h.a1 - h.a0) / 2)
  /**
   * A wall face from s0..s1, h0..h1, pierced by pointed-arch openings with
   * real reveals `depth` deep. Behind each opening: a panel of `back`, or
   * nothing (an open belfry: then `inner` draws the wall's inside face too).
   */
  const archWall = (p: Part, f: Frame, s0: number, s1: number, h0: number, h1: number, holes: Hole[], depth: number,
    back: Part | null, opts: { k?: number; inner?: Part; reveal?: Part } = {}) => {
    const k = opts.k ?? (D ? 4 : 2)
    const faces: [number, Part, V3][] = [[0, p, f.n]]
    if (opts.inner) faces.push([-depth, opts.inner, mul(f.n, -1)])
    const sorted = [...holes].sort((a, b) => a.a0 - b.a0)
    for (const [d, part, n] of faces) {
      const Q = (a: XY, b: XY, c: XY, e: XY) => quadN(part, P(f, ...a, d), P(f, ...b, d), P(f, ...c, d), P(f, ...e, d), n)
      let s = s0
      for (const h of sorted) {
        if (h.a0 > s) Q([s, h0], [h.a0, h0], [h.a0, h1], [s, h1])
        if (h.zb > h0) Q([h.a0, h0], [h.a1, h0], [h.a1, h.zb], [h.a0, h.zb])
        const L = arcPts(h, k)
        const R = L.map(([x, y]) => [h.a0 + h.a1 - x, y] as XY).reverse()
        const arc = [...L, ...R.slice(1)]
        for (let i = 0; i < arc.length - 1; i++) Q(arc[i], arc[i + 1], [arc[i + 1][0], h1], [arc[i][0], h1])
        s = h.a1
      }
      if (s1 > s) Q([s, h0], [s1, h0], [s1, h1], [s, h1])
    }
    const rv = opts.reveal ?? p
    for (const h of sorted) {
      const L = arcPts(h, k)
      // outline, counter-clockwise in (s, h): sill left→right, up the right side, over, down the left
      const out: XY[] = [[h.a0, h.zb], [h.a1, h.zb], ...L.map(([x, y]) => [h.a0 + h.a1 - x, y] as XY), ...[...L].reverse().slice(1)]
      // inward normals (into the opening); smooth round the jambs and arch so
      // neighbouring reveal quads share corners, sharp only at the sill
      const edgeN = (i: number): V3 => {
        const a = out[i], b = out[(i + 1) % out.length]
        const e = unit([b[0] - a[0], b[1] - a[1], 0])
        return add(mul(f.u, -e[1]), mul(UP, e[0]))
      }
      const m = out.length
      for (let i = 0; i < m; i++) {
        const a = out[i], b = out[(i + 1) % m]
        if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-6) continue
        const nE = edgeN(i)
        if (i === 0) { quadN(rv, P(f, ...a, 0), P(f, ...b, 0), P(f, ...b, -depth), P(f, ...a, -depth), nE); continue }
        const nA = i === 1 ? nE : unit(add(edgeN(i - 1), nE))
        const nB = i === m - 1 ? nE : unit(add(edgeN(i + 1), nE))
        const A0 = P(f, ...a, 0), B0 = P(f, ...b, 0), B1 = P(f, ...b, -depth), A1 = P(f, ...a, -depth)
        rv.tri(A0, B0, B1, undefined, undefined, undefined, [nA, nB, nB])
        rv.tri(A0, B1, A1, undefined, undefined, undefined, [nA, nB, nA])
      }
      if (back) {
        const c: XY = [(h.a0 + h.a1) / 2, h.zb]
        const poly = out.slice(1)
        for (let i = 0; i < poly.length - 1; i++) triN(back, P(f, ...c, -depth), P(f, ...poly[i], -depth), P(f, ...poly[i + 1], -depth), f.n)
      }
    }
  }
  /** A pointed window panel flush on a wall (within 0.05 m), for the low model's small windows. */
  const lancetPanel = (p: Part, f: Frame, a0: number, a1: number, zb: number, zs: number, d = 0.05) => {
    const h = { a0, a1, zb, zs }
    const L = arcPts(h, D ? 4 : 2)
    const pts: XY[] = [[a0, zb], [a1, zb], ...L.map(([x, y]) => [a0 + a1 - x, y] as XY), ...[...L].reverse().slice(1)]
    const c: XY = [(a0 + a1) / 2, zb]
    for (let i = 1; i < pts.length - 1; i++) triN(p, P(f, ...c, d), P(f, ...pts[i], d), P(f, ...pts[i + 1], d), f.n)
  }
  /** Round window panel flush on a wall. */
  const disc = (p: Part, f: Frame, sc: number, hc: number, r: number) => {
    const n = D ? 12 : 6
    for (let i = 0; i < n; i++) {
      const a0 = (i * TAU) / n, a1 = ((i + 1) * TAU) / n
      triN(p, P(f, sc, hc, 0.05), P(f, sc + r * Math.cos(a0), hc + r * Math.sin(a0), 0.05), P(f, sc + r * Math.cos(a1), hc + r * Math.sin(a1), 0.05), f.n)
    }
  }
  /** Pointed hood (projecting moulding) round a window: real relief. */
  const hood = (p: Part, f: Frame, a0: number, a1: number, zs: number, w: number, proj: number) => {
    const h = { a0: a0 - w, a1: a1 + w, zb: 0, zs }
    const hi = { a0, a1, zb: 0, zs }
    const k = D ? 4 : 2
    const Lo = arcPts(h, k), Li = arcPts(hi, k)
    const top = [...Lo, ...[...Lo].reverse().slice(1).map(([x, y]) => [a0 + a1 - x, y] as XY)]
    const bot = [...Li, ...[...Li].reverse().slice(1).map(([x, y]) => [a0 + a1 - x, y] as XY)]
    band(p, f, top, bot, proj / 2, proj, false)
  }
  /** Hoods only where they still read in the low model. */
  const hoodD = (...a: Parameters<typeof hood>) => { if (D) hood(...a) }
  /** Gable (wimperg) slab: triangle on a face, base s0..s1 at h0, apex at ha. */
  const gableSlab = (p: Part, f: Frame, s0: number, s1: number, h0: number, ha: number, d0: number, d1: number) =>
    slab(p, f, [[s0, h0], [s1, h0], [(s0 + s1) / 2, ha]], d0, d1)
  /** Rose window: disc panel recessed behind a projecting ring, with radial tracery. */
  const rose = (f: Frame, sc: number, hc: number, r: number, proj: number, small = false) => {
    const tiny = r < 1.6
    const n = D ? (tiny ? 12 : 24) : small ? 8 : 16
    const ring = (rr: number) => Array.from({ length: n + 1 }, (_, i) => [sc + rr * Math.cos((i * TAU) / n), hc + rr * Math.sin((i * TAU) / n)] as XY)
    // window disc, flush on the wall
    const c: XY = [sc, hc]
    const rim = ring(r)
    for (let i = 0; i < n; i++) triN(M.win, P(f, ...c, 0.04), P(f, ...rim[i], 0.04), P(f, ...rim[i + 1], 0.04), f.n)
    // projecting moulding ring with its inner reveal
    const outer = ring(r + (D ? 0.7 : 0.8)), inner = ring(r)
    for (let i = 0; i < n; i++) {
      quadN(M.stone, P(f, ...inner[i], proj), P(f, ...outer[i], proj), P(f, ...outer[i + 1], proj), P(f, ...inner[i + 1], proj), f.n)
      const m = [(inner[i][0] + inner[i + 1][0]) / 2 - sc, (inner[i][1] + inner[i + 1][1]) / 2 - hc]
      const nin = unit(add(mul(f.u, -m[0]), mul(UP, -m[1])))
      quadN(M.stone, P(f, ...inner[i], 0), P(f, ...inner[i + 1], 0), P(f, ...inner[i + 1], proj), P(f, ...inner[i], proj), nin)
      const nout = mul(nin, -1)
      if (D) quadN(M.stone, P(f, ...outer[i], 0), P(f, ...outer[i + 1], 0), P(f, ...outer[i + 1], proj), P(f, ...outer[i], proj), nout)
    }
    if (!D && small) return
    // tracery: spokes and a hub standing proud of the glass
    const spokes = D ? (tiny ? 6 : 12) : 4, tw = D ? (tiny ? 0.12 : 0.22) : 0.3
    // low model: four bars right across, eight spokes, and a hub
    if (!D) {
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 4 + Math.PI / 8
        const ca = Math.cos(a), sa = Math.sin(a)
        const q = (rr: number, w: number): XY => [sc + rr * ca - w * sa, hc + rr * sa + w * ca]
        slab(M.stone, f, [q(-r, -tw), q(r, -tw), q(r, tw), q(-r, tw)], 0.04, proj * 0.6)
      }
      const hub = Array.from({ length: 6 }, (_, i) => [sc + r * 0.28 * Math.cos((i * TAU) / 6), hc + r * 0.28 * Math.sin((i * TAU) / 6)] as XY)
      slab(M.stone, f, hub, 0.04, proj * 0.75)
      return
    }
    for (let i = 0; i < spokes; i++) {
      const a = (i * TAU) / spokes + Math.PI / 2
      const ca = Math.cos(a), sa = Math.sin(a)
      const q = (rr: number, w: number): XY => [sc + rr * ca - w * sa, hc + rr * sa + w * ca]
      slab(M.stone, f, [q(D ? r * 0.25 : 0, -tw), q(r, -tw), q(r, tw), q(D ? r * 0.25 : 0, tw)], 0.04, proj * 0.6)
    }
    if (!D) return
    const hn = tiny ? 6 : 12
    const hub = Array.from({ length: hn }, (_, i) => [sc + r * 0.26 * Math.cos((i * TAU) / hn), hc + r * 0.26 * Math.sin((i * TAU) / hn)] as XY)
    slab(M.stone, f, hub, 0.04, proj * 0.6)
    if (!tiny) {
      const mid = Array.from({ length: 24 }, (_, i) => [sc + r * 0.62 * Math.cos((i * TAU) / 24), hc + r * 0.62 * Math.sin((i * TAU) / 24)] as XY)
      for (let i = 0; i < 24; i++) {
        const a = mid[i], b = mid[(i + 1) % 24]
        const e = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(e[0], e[1]), nn = [-e[1] / l * 0.12, e[0] / l * 0.12]
        slab(M.stone, f, [[a[0] - nn[0], a[1] - nn[1]], [b[0] - nn[0], b[1] - nn[1]], [b[0] + nn[0], b[1] + nn[1]], [a[0] + nn[0], a[1] + nn[1]]], 0.04, proj * 0.5)
      }
    }
  }
  /** Clock face: white disc (lit at night) inside a stone ring, numerals left out. */
  const clockFace = (f: Frame, sc: number, hc: number, r: number) => {
    const n = D ? 24 : 8
    const pts = Array.from({ length: n + 1 }, (_, i) => [sc + r * Math.cos((i * TAU) / n), hc + r * Math.sin((i * TAU) / n)] as XY)
    for (let i = 0; i < n; i++) triN(M.clock, P(f, sc, hc, 0.05), P(f, ...pts[i], 0.05), P(f, ...pts[i + 1], 0.05), f.n)
    const outer = Array.from({ length: n + 1 }, (_, i) => [sc + (r + 0.45) * Math.cos((i * TAU) / n), hc + (r + 0.45) * Math.sin((i * TAU) / n)] as XY)
    for (let i = 0; i < n; i++) {
      quadN(M.stone, P(f, ...pts[i], D ? 0.35 : 0.08), P(f, ...outer[i], D ? 0.35 : 0.08), P(f, ...outer[i + 1], D ? 0.35 : 0.08), P(f, ...pts[i + 1], D ? 0.35 : 0.08), f.n)
      const m = unit(add(mul(f.u, (outer[i][0] + outer[i + 1][0]) / 2 - sc), mul(UP, (outer[i][1] + outer[i + 1][1]) / 2 - hc)))
      if (D) quadN(M.stone, P(f, ...outer[i], 0), P(f, ...outer[i + 1], 0), P(f, ...outer[i + 1], 0.35), P(f, ...outer[i], 0.35), m)
      if (D) quadN(M.stone, P(f, ...pts[i], 0), P(f, ...pts[i + 1], 0), P(f, ...pts[i + 1], 0.35), P(f, ...pts[i], 0.35), mul(m, -1))
    }
    if (!D) return
    // hands: dark, set on the face
    slab(M.iron, f, [[sc - 0.09, hc], [sc + 0.09, hc], [sc + 0.09, hc + r * 0.75], [sc - 0.09, hc + r * 0.75]], 0.05, 0.12)
    slab(M.iron, f, [[sc, hc - 0.09], [sc + r * 0.55, hc - 0.09], [sc + r * 0.55, hc + 0.09], [sc, hc + 0.09]], 0.05, 0.12)
  }
  /** Balustrade band round a ring: a solid rail, pierced in the detail model. */
  const balustrade = (ring: XY[], h0: number, ht: number, proj: number) => {
    // projecting ledge
    const c: XY = [ring.reduce((s, q) => s + q[0], 0) / ring.length, ring.reduce((s, q) => s + q[1], 0) / ring.length]
    const grow = (rr: XY[], d: number) => rr.map(([x, y]) => {
      const dx = x - c[0], dy = y - c[1]
      return [x + Math.sign(dx) * d, y + Math.sign(dy) * d] as XY
    })
    prism(M.stone, grow(ring, proj), h0 - 0.5, h0, M.stone)
    if (!D) { prism(M.stone, grow(ring, proj - 0.15), h0, h0 + ht, M.stone); return }
    // pierced rail: posts and a top rail
    const g = grow(ring, proj - 0.15)
    for (let i = 0; i < g.length; i++) {
      const a = g[i], b = g[(i + 1) % g.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nP = Math.max(2, Math.round(L / 1.25))
      for (let j = 0; j <= nP; j++) {
        const t = j / nP, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t
        box(M.stone, x - 0.16, x + 0.16, y - 0.16, y + 0.16, h0, h0 + ht - 0.25, null)
      }
    }
    // top rail (four boxes)
    for (let i = 0; i < g.length; i++) {
      const a = g[i], b = g[(i + 1) % g.length]
      box(M.stone, Math.min(a[0], b[0]) - 0.2, Math.max(a[0], b[0]) + 0.2, Math.min(a[1], b[1]) - 0.2, Math.max(a[1], b[1]) + 0.2, h0 + ht - 0.25, h0 + ht)
    }
  }
  /** A gabled roof along y (or x): two slopes, gable triangles at the ends as stone. */
  const roofAlong = (axis: 'x' | 'y', c: number, hw: number, a0: number, a1: number, ze: number, zr: number, ends: [boolean, boolean], ov = 0.5) => {
    const pt = (across: number, along: number, h: number): V3 => (axis === 'y' ? [c + across, along, h] : [along, c + across, h])
    const slope = (sg: number) => {
      const n = unit(axis === 'y' ? [sg * (zr - ze), 0, hw] : [0, sg * (zr - ze), hw])
      quadN(M.slate, pt(sg * (hw + ov), a0, ze - ov * (zr - ze) / hw), pt(sg * (hw + ov), a1, ze - ov * (zr - ze) / hw), pt(0, a1, zr), pt(0, a0, zr), n)
    }
    slope(1); slope(-1)
    ends.forEach((e, i) => {
      if (!e) return
      const a = i === 0 ? a0 : a1
      faceOut(M.stone, [pt(-hw, a, ze), pt(hw, a, ze), pt(0, a, zr)], pt(0, i === 0 ? a + 1 : a - 1, ze))
    })
  }
  /** Small triangular dormer vent on a roof slope (dark, lit at night). */
  const dormer = (axis: 'x' | 'y', c: number, sg: number, along: number, hw: number, ze: number, zr: number, at: number) => {
    // at: fraction of the slope from eaves (0) to ridge (1)
    const across = sg * hw * (1 - at), h = ze + (zr - ze) * at
    const w = 0.75, ht = 1.1, dp = 1.4
    const pt = (ac: number, al: number, hh: number): V3 => (axis === 'y' ? [c + ac, al, hh] : [al, c + ac, hh])
    const nOut: V3 = axis === 'y' ? [sg, 0, 0] : [0, sg, 0]
    triN(M.win, pt(across + sg * 0.05, along - w, h), pt(across + sg * 0.05, along + w, h), pt(across + sg * 0.05, along, h + ht), nOut)
    const back = pt(across - sg * dp, along, h + ht + dp * (zr - ze) / hw * 0.2)
    faceOut(M.slate, [pt(across + sg * 0.05, along - w, h), pt(across + sg * 0.05, along, h + ht), back], pt(across, along + 1, h))
    faceOut(M.slate, [pt(across + sg * 0.05, along + w, h), pt(across + sg * 0.05, along, h + ht), back], pt(across, along - 1, h))
  }

  // ================================================================ PLAN
  // Model frame (bearing 38): +y toward the apse (real NE), -y the façade
  // (real SW), +x the real SE side. From OSM (see header).
  const FY = -55.0 // façade plane
  const TW = 6.6 // tower half-width
  const TX = 11.9, TY = FY + TW // tower centres x = ±TX
  const NW = 6.3 // nave half-width (clerestory wall)
  const AW = 17.6 // aisle outer wall
  const TRY0 = -2.4, TRY1 = 12.2, TRX = 18.6 // transept
  const CY = (TRY0 + TRY1) / 2 // crossing centre
  const CHY = 30 // apse centre (choir straight ends)
  const AMB = { c: [0, 31.6] as XY, r: 16.2 } // ambulatory / chapel ring
  const H = { aisle: z(12), aisleGable: z(18), clere: z(24), ridge: z(31.5), transGable: z(40) }

  // ============================================================ TOWERS
  for (const sx of [-1, 1]) {
    const cx = sx * TX, cy = TY
    const core = TW - 1.35 // face plane between the corner buttresses
    // corner buttresses the full height, stepping in at each balcony, with a
    // pinnacle standing on each step outside the balcony rail
    const pierStages: [number, number, number][] = [[0, z(28.5), 1.3], [z(28.5), z(41), 1.1], [z(41), z(52), 0.9]]
    for (const [qx, qy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      for (const [h0, h1, hs] of pierStages) {
        const px = cx + qx * (TW - hs), py = cy + qy * (TW - hs)
        box(M.stone, px - hs, px + hs, py - hs, py + hs, h0, h1)
        if (h1 < z(52)) {
          const qx2 = cx + qx * (TW + 0.15), qy2 = cy + qy * (TW + 0.15)
          if (D) pinnacle(M.stone, qx2, qy2, 0.38, h1 - 0.5, h1 + 1.6, h1 + 4.6, 8)
          else cone(M.stone, qx2, qy2, 0.5, h1 - 0.5, h1 + 4.4)
        }
      }
      // octagonal corner pinnacles above the shaft
      const px = cx + qx * (TW - 0.95), py = cy + qy * (TW - 0.95)
      pinnacle(M.stone, px, py, 1.0, z(52), z(59), z(65.5), D ? 8 : 4)
      if (D) for (const a of [0, 1, 2, 3]) {
        const ang = (a * Math.PI) / 2
        pinnacle(M.stone, px + Math.cos(ang) * 1.05, py + Math.sin(ang) * 1.05, 0.25, z(55.5), z(57.5), z(59.5), 4)
      }
    }
    // the shaft's faces, recessed between the piers: four faces
    const faces: [number, number][] = [[0, -1], [sx, 0], [0, 1], [-sx, 0]]
    faces.forEach(([nx, ny], fi) => {
      const f = frame(cx, cy, nx, ny, core)
      const hw = core - (fi === 0 || fi === 1 ? 0 : 0)
      const isFront = fi === 0, isOuter = fi === 1
      // stage 1: portal (front), tall lancet (front & outer), plain (rear, inner: hidden by nave)
      if (isFront) {
        archWall(M.stone, f, -hw, hw, 0, z(28.5), [
          { a0: -2.6, a1: 2.6, zb: z(0.3), zs: z(7.0) },
        ], 1.8, M.win)
        hoodD(M.stone, f, -2.6, 2.6, z(7.0), 0.6, 0.7)
        gableSlab(M.stone, f, -3.6, 3.6, z(10.9), z(18), 0.0, 0.6)
        lancetPanel(M.win, f, -1.4, 1.4, z(19.2), z(23.2), 0.05)
        hoodD(M.stone, f, -1.4, 1.4, z(23.2), 0.4, 0.4)
      } else if (isOuter) {
        archWall(M.stone, f, -hw, hw, 0, z(28.5), [{ a0: -1.6, a1: 1.6, zb: z(14), zs: z(21.5) }], 0.9, M.win)
        hoodD(M.stone, f, -1.6, 1.6, z(21.5), 0.45, 0.45)
        gableSlab(M.stone, f, -2.6, 2.6, z(23.6), z(28.3), 0.0, 0.45)
      } else {
        archWall(M.stone, f, -hw, hw, 0, z(28.5), [], 0, null)
      }
      // stage 2: the belfry, paired lancets, real openings with dark louvres behind
      archWall(M.stone, f, -hw, hw, z(28.5), z(41), [
        { a0: -2.6, a1: -0.3, zb: z(29.5), zs: z(36.3) },
        { a0: 0.3, a1: 2.6, zb: z(29.5), zs: z(36.3) },
      ], 1.1, M.win)
      if (D || fi < 2) hood(M.stone, f, -2.75, 2.75, z(38.3), 0.35, 0.45)
      // stage 3: smaller paired lancets and the clock (outward faces; the rear one too)
      if (D) archWall(M.stone, f, -hw, hw, z(41), z(52), [
        { a0: -2.0, a1: -0.3, zb: z(41.4), zs: z(43.4) },
        { a0: 0.3, a1: 2.0, zb: z(41.4), zs: z(43.4) },
      ], 0.8, M.win)
      else {
        archWall(M.stone, f, -hw, hw, z(41), z(52), [], 0, null)
        lancetPanel(M.win, f, -2.0, -0.3, z(41.4), z(43.4))
        lancetPanel(M.win, f, 0.3, 2.0, z(41.4), z(43.4))
      }
      clockFace(f, 0, z(47.7), 2.15)
      // crown gable over the clock, one per face
      gableSlab(M.stone, f, -3.9, 3.9, z(51), z(61.5), -0.4, 0.5)
      if (D) {
        // the gable's crockets and finial
        pinnacle(M.stone, P(f, 0, 0, 0.05)[0], P(f, 0, 0, 0.05)[1], 0.3, z(61.1), z(61.9), z(63.7), 4)
        rose(f, 0, z(55.6), 1.3, 0.3)
      } else {
        const fl = P(f, 0, 0, 0.05)
        spike(M.stone, ngon(fl[0], fl[1], 0.45, 4, Math.PI / 4), z(60.9), [fl[0], fl[1], z(63.5)])
      }
    })
    box(M.stone, cx - core, cx + core, cy - core, cy + core, z(51.6), z(52))
    // balconies at the stage breaks
    balustrade(rect(cx - TW + 0.2, cx + TW - 0.2, cy - TW + 0.2, cy + TW - 0.2), z(28.5), 1.0, 0.5)
    balustrade(rect(cx - TW + 0.4, cx + TW - 0.4, cy - TW + 0.4, cy + TW - 0.4), z(41), 0.9, 0.35)
    // the spire: octagonal, slate-capped stone, from inside the gables to the cross
    if (D) {
      prism(M.stone, ngon(cx, cy, 3.3, 8, Math.PI / 8), z(52), z(55), M.stone)
      // a pierced lantern stage under the needle: eight piers round a dark core
      for (let i = 0; i < 8; i++) {
        const a = Math.PI / 8 + (i * TAU) / 8
        const px = cx + 2.85 * Math.cos(a), py = cy + 2.85 * Math.sin(a)
        prism(M.stone, ngon(px, py, 0.42, 4, a + Math.PI / 4), z(55), z(60), null)
      }
      prism(M.win, ngon(cx, cy, 1.7, 8, Math.PI / 8), z(55), z(60), null)
      prism(M.stone, ngon(cx, cy, 3.25, 8, Math.PI / 8), z(60), z(61), M.stone)
      spike(M.stone, ngon(cx, cy, 2.8, 8, Math.PI / 8), z(61), [cx, cy, z(73.3)])
      // crockets up the eight arrises
      for (let i = 0; i < 8; i++) {
        const a = Math.PI / 8 + (i * TAU) / 8
        for (let k = 1; k <= 4; k++) {
          const t = k / 5, r = 2.8 * (1 - t) + 0.3, hh = z(61) + t * 12.3
          const px = cx + r * Math.cos(a), py = cy + r * Math.sin(a)
          spike(M.stone, ngon(px, py, 0.32, 4, a), hh - 0.3, [px + 0.25 * Math.cos(a), py + 0.25 * Math.sin(a), hh + 0.5])
        }
      }
    } else {
      prism(M.stone, ngon(cx, cy, 3.2, 8, Math.PI / 8), z(52), z(56), M.stone)
      spike(M.stone, ngon(cx, cy, 2.9, 8, Math.PI / 8), z(56), [cx, cy, z(73.3)])
    }
    // finial and cross
    prism(M.stone, ngon(cx, cy, 0.45, 6), z(72.9), z(73.9), M.stone)
    crossAt(cx, cy, z(73.9), 3.0, 1.8)
  }

  // ========================================================= WEST FRONT
  {
    // central bay between the towers: portal, rose, gable
    const f = frame(0, FY + 0.5, 0, -1, 0.5) // face plane y = FY
    archWall(M.stone, f, -(TX - TW + 1.0) , TX - TW + 1.0, 0, z(28.5), [{ a0: -3.2, a1: 3.2, zb: z(0.3), zs: z(7.6) }], 2.2, M.win)
    hoodD(M.stone, f, -3.2, 3.2, z(7.6), 0.7, 0.8)
    gableSlab(M.stone, f, -4.3, 4.3, z(12.5), z(19.4), 0, 0.7)
    rose(f, 0, z(24.0), 3.5, 0.7)
    balustrade(rect(-(TX - TW + 1.0), TX - TW + 1.0, FY - 0.2, FY + 1.2), z(28.5), 1.0, 0.0)
    // upper gable between the towers, with its small rose and a statue pinnacle
    slab(M.stone, f, [[-6.3, z(28.5)], [6.3, z(28.5)], [6.3, z(31)], [0, z(39)], [-6.3, z(31)]], -1.5, 0.2, true)
    rose(f, 0, z(32.6), 1.5, 0.35, true)
    pinnacle(M.stone, 0, FY + 0.2, 0.6, z(38.2), z(41), z(43.5), D ? 8 : 4)
  }

  // ===================================================== NAVE AND AISLES
  const naveY0 = FY + 0.5, naveY1 = TRY0
  const bays = 7
  const bay = (naveY1 - (TY + TW)) / bays
  const bayY = (i: number) => TY + TW + bay * (i + 0.5)
  // clerestory walls and roof from the façade to the transept
  for (const sx of [-1, 1]) {
    const ci = D ? 0.5 : 0 // detail: the bays carry their own pierced faces
    box(M.low, sx > 0 ? NW - 0.8 : -NW + ci, sx > 0 ? NW - ci : -NW + 0.8, naveY0, D ? TY + TW : naveY1, H.aisle, H.clere, null)
    if (D) box(M.low, sx > 0 ? NW - 0.8 : -NW + ci, sx > 0 ? NW - ci : -NW + 0.8, TY + TW, naveY1, H.aisle, H.clere, null)
    // cornice and parapet
    box(M.stone, sx > 0 ? NW - 0.2 : -NW - 0.6, sx > 0 ? NW + 0.6 : -NW + 0.2, TY + TW, naveY1, H.clere, H.clere + 0.9)
  }
  roofAlong('y', 0, NW, naveY0, CY - NW, H.clere, H.ridge, [false, false])
  // aisles: outer walls (warmer lower ashlar), lean-to roofs
  for (const sx of [-1, 1]) {
    const xo = sx * AW
    const xi = sx * (AW - (D ? 0.7 : 0))
    box(M.low, Math.min(xi, sx * NW), Math.max(xi, sx * NW), TY + TW, naveY1, 0, H.aisle, null)
    // aisle roof: lean-to from the parapet to the clerestory
    const zA = H.aisle + 0.8, zB = H.aisle + 3.0
    const n = unit([sx * (zB - zA), 0, AW - NW])
    quadN(M.slate, [xo, TY + TW, zA], [xo, naveY1, zA], [sx * NW, naveY1, zB], [sx * NW, TY + TW, zB], n)
    // aisle parapet ledge
    box(M.stone, sx > 0 ? AW - 0.4 : -AW - 0.4, sx > 0 ? AW + 0.4 : -AW + 0.4, TY + TW, naveY1, H.aisle, H.aisle + 0.8)
    const fA = frame(sx * AW, 0, sx, 0, 0)
    const fC = frame(sx * NW, 0, sx, 0, 0)
    for (let i = 0; i < bays; i++) {
      const yc = bayY(i)
      const s = (y: number) => (fA.u[1] * (y - fA.o[1]))
      const sc = s(yc)
      // aisle window (recessed in the detail model) under its gable
      if (D) archWall(M.low, frame(sx * AW, yc, sx, 0, 0), -bay / 2, bay / 2, 0, H.aisle, [{ a0: -1.5, a1: 1.5, zb: z(3.0), zs: z(8.3) }], 0.6, M.win, { k: 3 })
      else lancetPanel(M.win, fA, sc - 1.5, sc + 1.5, z(3.0), z(8.3))
      hoodD(M.stone, fA, sc - 1.5, sc + 1.5, z(8.3), 0.35, 0.4)
      // the wimperg: a sharp gable standing proud over the window and the parapet
      gableSlab(M.stone, fA, sc - 2.55, sc + 2.55, H.aisle - 1.2, H.aisleGable, -0.2, 0.8)
      if (D) {
        const g = frame(sx * AW, yc, sx, 0, 0.8)
        rose(g, 0, H.aisle + 1.7, 0.8, 0.15)
      }
      // clerestory: a big pointed window with a rosette, between pilasters
      if (D) {
        archWall(M.low, frame(sx * NW, yc, sx, 0, 0), -bay / 2, bay / 2, H.aisle + 2.0, H.clere, [
          { a0: -1.7, a1: -0.15, zb: z(16.6), zs: z(19.8) }, { a0: 0.15, a1: 1.7, zb: z(16.6), zs: z(19.8) },
        ], 0.45, M.win, { k: 3 })
        rose(frame(sx * NW, yc, sx, 0, 0), 0, z(22.6), 0.65, 0.2)
      } else {
        lancetPanel(M.win, fC, s(yc) - 1.7, s(yc) - 0.15, z(16.6), z(19.8))
        lancetPanel(M.win, fC, s(yc) + 0.15, s(yc) + 1.7, z(16.6), z(19.8))
        disc(M.win, fC, s(yc), z(22.6), 0.65)
      }
      hoodD(M.stone, fC, s(yc) - 1.95, s(yc) + 1.95, z(19.8), 0.3, 0.35)
    }
    // buttresses with pinnacles and flying buttresses at each bay line
    for (let i = 0; i <= bays; i++) {
      const y = TY + TW + bay * i
      if (i === 0) continue // the towers stand here
      const yb = i === bays ? y - 0.8 : y
      // buttress pier: straddles the aisle wall and rises above the aisle roof to carry the flyer
      const pi = sx * (AW - 0.4)
      box(M.stone, pi - 0.85, pi + 0.85, yb - 0.65, yb + 0.65, 0, z(17.5))
      pinnacle(M.stone, pi, yb, 0.55, z(17.5), z(19.8), z(23.2))
      // flying arch: straight sloping top, curved soffit
      const fF = frame(0, yb, 0, 1, 0)
      const k = D ? 6 : 2
      const xa = sx * (AW - 1.25), xb = sx * (NW + 0.05)
      const sA = fF.u[0] * xa, sB = fF.u[0] * xb
      const top: XY[] = [], bot: XY[] = []
      for (let j = 0; j <= k; j++) {
        const t = j / k
        top.push([sA + (sB - sA) * t, z(17.6) + (z(22.4) - z(17.6)) * t])
        const ang = (Math.PI / 2) * t
        bot.push([sA + (sB - sA) * (1 - Math.cos(ang)), z(15.8) + (z(21.0) - z(15.8)) * Math.sin(ang)])
      }
      band(M.stone, fF, top, bot, 0, 0.7)
      // clerestory pilaster rising to a pinnacle above the cornice
      const xc = sx * (NW + 0.3)
      if (D) box(M.stone, xc - 0.45, xc + 0.45, yb - 0.45, yb + 0.45, H.aisle + 2, H.clere + 0.9)
      pinnacle(M.stone, xc, yb, 0.42, H.clere + 0.9, H.clere + 2.8, H.clere + 5.6)
    }
  }
  // nave roof dormers
  for (const sx of [-1, 1]) for (let i = 0; i < bays; i++) dormer('y', 0, sx, bayY(i), NW, H.clere, H.ridge, 0.35)
  // roof cresting (detail): a row of small iron finials on the ridge
  if (D) for (let y = naveY0 + 1; y < CY - NW; y += 1.6) box(M.iron, -0.08, 0.08, y - 0.08, y + 0.08, H.ridge, H.ridge + 0.9)

  // ============================================================ TRANSEPT
  for (const sx of [-1, 1]) {
    // walls of the arms
    const x0 = sx * NW, x1 = sx * TRX
    const xe = x1 - sx * 1.5
    box(M.stone, Math.min(x0, xe), Math.max(x0, xe), TRY0, TRY1, 0, H.clere, null)
    roofAlong('x', CY, (TRY1 - TRY0) / 2, sx * NW * 0, x1 - sx * 0.6, H.clere, H.ridge, [false, false])
    // gable end
    const f = frame(x1, CY, sx, 0, 0)
    const hw = (TRY1 - TRY0) / 2
    slab(M.stone, f, [[-hw, H.clere - 0.5], [hw, H.clere - 0.5], [0, H.transGable]], -0.6, 0.3, true)
    // portal, rose, upper rose
    archWall(M.stone, f, -hw, hw, 0, H.clere - 0.5, [{ a0: -2.6, a1: 2.6, zb: z(0.3), zs: z(6.6) }], 1.4, M.win)
    hoodD(M.stone, f, -2.6, 2.6, z(6.6), 0.6, 0.7)
    gableSlab(M.stone, f, -3.6, 3.6, z(10.5), z(16.4), 0, 0.6)
    rose(f, 0, z(21.0), 3.6, 0.6)
    rose(frame(x1, CY, sx, 0, 0.3), 0, z(31.0), 1.55, 0.3, true)
    // corner turrets with tall pinnacles
    for (const y of [TRY0, TRY1]) {
      const px = x1 - sx * 0.2, py = y
      prism(M.stone, ngon(px, py, 1.35, D ? 8 : 4, D ? Math.PI / 8 : Math.PI / 4), 0, H.clere + 1.5, M.stone)
      pinnacle(M.stone, px, py, 1.1, H.clere + 1.5, z(31.5), z(38), D ? 8 : 4)
    }
    // transept roof dormers
    for (const sy of [-1, 1]) dormer('x', CY, sy, sx * 12.5, hw, H.clere, H.ridge, 0.35)
  }

  // ===================================================== CHOIR AND APSE
  {
    const ci = D ? 0.5 : 0
    for (const sx of [-1, 1]) box(M.stone, sx > 0 ? NW - 0.8 : -NW + ci, sx > 0 ? NW - ci : -NW + 0.8, TRY1, CHY, H.aisle, H.clere, null)
    roofAlong('y', 0, NW, CY + NW, CHY, H.clere, H.ridge, [false, false])
    // polygonal apse (half-decagon) with a conical roof
    const n = 5
    const ring: XY[] = Array.from({ length: n + 1 }, (_, i) => {
      const a = Math.PI * (i / n) // 0..π, from +x round the +y end to -x
      return [NW * Math.cos(a), CHY + NW * Math.sin(a)] as XY
    })
    for (let i = 0; i < n; i++) {
      const a = ring[i], b = ring[i + 1]
      const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      const nn = unit([m[0], m[1] - CHY, 0])
      // a window per side, and a slate cone facet
      const f = frame(m[0], m[1], nn[0], nn[1], 0)
      const half = Math.hypot(b[0] - a[0], b[1] - a[1]) / 2
      if (D) archWall(M.stone, f, -half, half, H.aisle, H.clere, [{ a0: -0.9, a1: 0.9, zb: z(17.5), zs: z(21.6) }], 0.4, M.win, { k: 3 })
      else {
        quadN(M.stone, [a[0], a[1], H.aisle], [b[0], b[1], H.aisle], [b[0], b[1], H.clere], [a[0], a[1], H.clere], nn)
        lancetPanel(M.win, f, -0.9, 0.9, z(17.5), z(21.6))
      }
      faceOut(M.slate, [[a[0] * 1.08, CHY + (a[1] - CHY) * 1.08, H.clere - 0.4], [b[0] * 1.08, CHY + (b[1] - CHY) * 1.08, H.clere - 0.4], [0, CHY, H.ridge]], [0, CHY, H.clere])
      // apse buttress pinnacles at the angles
      if (i > 0) pinnacle(M.stone, a[0] * 1.12, CHY + (a[1] - CHY) * 1.12, 0.45, H.clere - 1, H.clere + 2.2, H.clere + 4.6)
    }
    // finial at the apse cone
    pinnacle(M.stone, 0, CHY, 0.35, H.ridge - 0.5, H.ridge + 0.5, H.ridge + 2.5, 4)
    // choir dormers
    for (const sx of [-1, 1]) dormer('y', 0, sx, (TRY1 + CHY) / 2 + 2, NW, H.clere, H.ridge, 0.35)
    // choir clerestory windows
    const cb = (CHY - TRY1) / 2
    for (const sx of [-1, 1]) for (const yc of [TRY1 + cb / 2, TRY1 + cb * 1.5]) {
      if (D) archWall(M.stone, frame(sx * NW, yc, sx, 0, 0), -cb / 2, cb / 2, H.aisle + 2.0, H.clere, [
        { a0: -1.7, a1: -0.15, zb: z(16.6), zs: z(19.8) }, { a0: 0.15, a1: 1.7, zb: z(16.6), zs: z(19.8) },
      ], 0.45, M.win, { k: 3 })
      else {
        lancetPanel(M.win, frame(sx * NW, yc, sx, 0, 0), -1.7, -0.15, z(16.6), z(19.8))
        lancetPanel(M.win, frame(sx * NW, yc, sx, 0, 0), 0.15, 1.7, z(16.6), z(19.8))
        disc(M.win, frame(sx * NW, yc, sx, 0, 0), 0, z(22.6), 0.65)
      }
      hoodD(M.stone, frame(sx * NW, yc, sx, 0, 0), -1.95, 1.95, z(19.8), 0.3, 0.35)
    }
    // ambulatory and chapels: straight sides plus a half-ring, lower ashlar
    for (const sx of [-1, 1]) {
      const xi = sx * (AW - (D ? 0.7 : 0))
      box(M.low, Math.min(sx * NW, xi), Math.max(sx * NW, xi), TRY1, AMB.c[1], 0, H.aisle, null)
      {
        const zA = H.aisle + 0.8, zB = H.aisle + 3.0, xo = sx * AW
        quadN(M.slate, [xo, TRY1, zA], [xo, AMB.c[1], zA], [sx * NW, AMB.c[1], zB], [sx * NW, TRY1, zB], unit([sx * (zB - zA), 0, AW - NW]))
        box(M.stone, sx > 0 ? AW - 0.4 : -AW - 0.4, sx > 0 ? AW + 0.4 : -AW + 0.4, TRY1, AMB.c[1], H.aisle, H.aisle + 0.8)
      }
      const ab = (AMB.c[1] - TRY1) / 2
      for (const yc of [TRY1 + ab / 2, TRY1 + ab * 1.5]) {
        const f = frame(sx * AW, yc, sx, 0, 0)
        if (D) archWall(M.low, f, -ab / 2, ab / 2, 0, H.aisle, [{ a0: -1.5, a1: 1.5, zb: z(3.0), zs: z(8.3) }], 0.6, M.win, { k: 3 })
        else lancetPanel(M.win, f, -1.5, 1.5, z(3.0), z(8.3))
        gableSlab(M.stone, f, -2.55, 2.55, H.aisle - 1.2, H.aisleGable, -0.2, 0.8)
      }
      for (const y of [TRY1 + ab, AMB.c[1] - 0.8]) {
        const px = sx * (AW + 0.3)
        box(M.stone, px - 0.8, px + 0.8, y - 0.7, y + 0.7, 0, H.aisle + 1.5)
        pinnacle(M.stone, px, y, 0.55, H.aisle + 1.5, H.aisle + 3.6, H.aisle + 6.2)
      }
    }
    const nr = D ? 10 : 4
    const outer: XY[] = Array.from({ length: nr + 1 }, (_, i) => {
      const a = Math.PI * (i / nr)
      return [Math.max(-AW, Math.min(AW, AMB.r * Math.cos(a))), AMB.c[1] + AMB.r * Math.sin(a)] as XY
    })
    for (let i = 0; i < nr; i++) {
      const a = outer[i], b = outer[i + 1]
      const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      const nn = unit([m[0], m[1] - AMB.c[1], 0])
      quadN(M.low, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], H.aisle], [a[0], a[1], H.aisle], nn)
      // lean-to roof from the ring to the apse wall
      const ia: XY = [NW * Math.cos(Math.PI * (i / nr)), CHY + NW * Math.sin(Math.PI * (i / nr))]
      const ib: XY = [NW * Math.cos(Math.PI * ((i + 1) / nr)), CHY + NW * Math.sin(Math.PI * ((i + 1) / nr))]
      faceOut(M.slate, [[a[0], a[1], H.aisle + 0.6], [b[0], b[1], H.aisle + 0.6], [ib[0], ib[1], H.aisle + 3.0], [ia[0], ia[1], H.aisle + 3.0]], [m[0] * 0.5, AMB.c[1] + (m[1] - AMB.c[1]) * 0.5, 0])
      const f = frame(m[0], m[1], nn[0], nn[1], 0)
      lancetPanel(M.win, f, -1.1, 1.1, z(5.5), z(9.6))
      gableSlab(M.stone, f, -1.9, 1.9, H.aisle - 0.4, H.aisle + 4.2, -0.2, 0.5)
      if (D && i > 0) pinnacle(M.stone, a[0] * 1.03, AMB.c[1] + (a[1] - AMB.c[1]) * 1.03, 0.5, H.aisle - 1, H.aisle + 5, H.aisle + 8)
      // buttress piers with pinnacles round the ambulatory
      if (i > 0 && i % 2 === 0 && i < nr) {
        const ang = Math.PI * (i / nr)
        const p0: XY = [AMB.r * 0.9 * Math.cos(ang), AMB.c[1] + AMB.r * 0.9 * Math.sin(ang)]
        box(M.stone, p0[0] - 0.55, p0[0] + 0.55, p0[1] - 0.55, p0[1] + 0.55, H.aisle, z(16))
        pinnacle(M.stone, p0[0], p0[1], 0.45, z(16), z(18.2), z(21.5), 4)
      }
    }
    // ambulatory flat cap between straight part and ring (hidden mostly)
  }

  // ============================================= REAR CHAPEL (Corazón de María)
  {
    // OSM way/673325412: a long narrow block behind the apse with short arms.
    const x0 = -5.8, x1 = 3.0, y0 = AMB.c[1] + AMB.r - 1, y1 = 75.5
    box(M.low, x0, x1, y0, y1, 0, z(8), null)
    roofAlong('y', (x0 + x1) / 2, (x1 - x0) / 2, y0, y1, z(8), z(13), [false, true])
    box(M.low, -12.0, 8.0, 62.5, 68.2, 0, z(7), null)
    roofAlong('x', 65.35, 2.85, -12.0, 8.0, z(7), z(10.5), [true, true])
    for (const y of D ? [y0 + 4, y0 + 10, y0 + 16, 71.5] : [y0 + 7, y0 + 15]) for (const sx of [-1, 1]) {
      const xx = sx > 0 ? x1 : x0
      lancetPanel(M.win, frame(xx, y, sx, 0, 0), -0.8, 0.8, z(2.5), z(5.4))
    }
    const fe = frame((x0 + x1) / 2, y1, 0, 1, 0)
    lancetPanel(M.win, fe, -1.2, 1.2, z(2.5), z(6.0))
    pinnacle(M.stone, (x0 + x1) / 2, y1 + 0.2, 0.35, z(12.5), z(13.5), z(15.5), 4)
  }

  // ================================================= CROSSING: CONDOR TOWER
  {
    const cx = 0, cy = CY
    const hw = 2.9 // shaft half-width
    // shaft from inside the roofs to the belfry
    box(M.stone, cx - hw, cx + hw, cy - hw, cy + hw, H.clere, z(42.5), null)
    // a blind arcade on the shaft below the belfry (real relief)
    for (const [nx, ny] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const f = frame(cx, cy, nx, ny, hw)
      for (const s of [-1.2, 1.2]) {
        lancetPanel(M.win, f, s - 0.7, s + 0.7, z(35.5), z(39.5), 0.04)
        hoodD(M.stone, f, s - 0.7, s + 0.7, z(39.5), 0.25, 0.3)
      }
    }
    balustrade(rect(cx - hw, cx + hw, cy - hw, cy + hw), z(42.5), 0.8, 0.45)
    // open belfry: four walls, each pierced by two lancets right through
    const bt = 0.75
    for (const [nx, ny] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const f = frame(cx, cy, nx, ny, hw - 0.3)
      archWall(M.stone, f, -(hw - 0.3), hw - 0.3, z(43.3), z(49.9), [
        { a0: -2.0, a1: -0.25, zb: z(43.8), zs: z(47.4) }, { a0: 0.25, a1: 2.0, zb: z(43.8), zs: z(47.4) },
      ], bt, null, { inner: M.stone })
    }
    // wall ends at the corners (close the gaps between the four faces)
    if (D) for (const [qx, qy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const px = cx + qx * (hw - 0.3 - bt / 2), py = cy + qy * (hw - 0.3 - bt / 2)
      box(M.stone, px - bt / 2, px + bt / 2, py - bt / 2, py + bt / 2, z(43.3), z(49.8), null)
    }
    // bell-chamber floor and roof slab so the inside reads dark-free
    box(M.stone, cx - hw + 0.3, cx + hw - 0.3, cy - hw + 0.3, cy + hw - 0.3, z(43.1), z(43.3), M.stone)
    box(M.stone, cx - hw - 0.1, cx + hw + 0.1, cy - hw - 0.1, cy + hw + 0.1, z(49.8), z(50.6))
    // corner pinnacles of the belfry
    for (const [qx, qy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const px = cx + qx * (hw + 0.1), py = cy + qy * (hw + 0.1)
      box(M.stone, px - 0.55, px + 0.55, py - 0.55, py + 0.55, H.ridge - 1.5, z(50.6))
      pinnacle(M.stone, px, py, 0.5, z(50.6), z(53.2), z(57.2), D ? 8 : 4)
    }
    // gables on each face above the belfry
    for (const [nx, ny] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const f = frame(cx, cy, nx, ny, hw - 0.2)
      gableSlab(M.stone, f, -2.2, 2.2, z(50.2), z(54.8), -0.3, 0.35)
    }
    // the needle spire, octagonal, crocketed in the detail model
    const sr = 2.35
    prism(M.stone, ngon(cx, cy, sr, 8, Math.PI / 8), z(50.6), z(52), M.stone)
    spike(M.stone, ngon(cx, cy, sr * 0.95, 8, Math.PI / 8), z(52), [cx, cy, z(66.8)])
    if (D) for (let i = 0; i < 8; i++) {
      const a = Math.PI / 8 + (i * TAU) / 8
      for (let k = 1; k <= 5; k++) {
        const t = k / 6, r = sr * 0.95 * (1 - t) + 0.2, hh = z(52) + t * 14.6
        const px = cx + r * Math.cos(a), py = cy + r * Math.sin(a)
        spike(M.stone, ngon(px, py, 0.28, 4, a), hh - 0.25, [px + 0.22 * Math.cos(a), py + 0.22 * Math.sin(a), hh + 0.45])
      }
    }
    crossAt(cx, cy, z(66.6), 3.4, 1.7)
  }

  return M
}

// --------------------------------------------------------------- write ---
// Night: the stone is floodlit from the plazas (Commons night photo): walls
// and towers fully, faces looking up barely; the clock faces glow white
// (`neon-voto-clock`); the windows, belfry louvres and roof vents glow warm.
const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.2 : p[2] > 40 ? 1 : 0.85)
function materials(M: Mats): Array<{ part: Part; material: MaterialSpec }> {
  return [
    { part: M.stone, material: { ...finish('voto-andesite', 0xafaeab), floodlight: lit } },
    { part: M.low, material: { ...finish('voto-andesite-low', 0xa3a2a0), floodlight: lit } },
    { part: M.slate, material: finish('voto-slate', 0xc9cacb) },
    { part: M.win, material: PALETTE.window },
    { part: M.clock, material: finish('neon-voto-clock', 0xf1efe8, 0.5) },
    { part: M.iron, material: finish('voto-iron', 0x4a4f57) },
  ]
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Basílica del Voto Nacional', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: BEARING, elevation: 0, height: 73.9 + 3.0 + Z0,
  })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes, ${triangles} tris`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

if (import.meta.main) {
  const lo = build(false), hi = build(true)
  await write('quito-basilica-del-voto-nacional.glb', materials(lo), 6500, 256_000)
  await write('quito-basilica-del-voto-nacional.detail.glb', materials(hi), 40_000, 1536 * 1024)
}
