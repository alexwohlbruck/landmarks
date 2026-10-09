/**
 * Bill Graham Civic Auditorium, San Francisco — original procedural geometry, CC0-1.0.
 * bun generators/sf-bill-graham-auditorium.ts
 *
 * Map frame, turned to the street grid: +y is the Grove Street front's outward
 * normal (north), +x east (Larkin Street), z up, metres. BEARING 351. Origin =
 * centroid of the OSM outline way/25759141; the plan is symmetric about x = 0
 * to within 0.3 m, so the model is mirrored across it.
 *
 * Evidence
 * - OSM way/25759141 (121 x 76 m outline, height 37) and the roof part
 *   way/435831538 (a pyramidal "dome", 37-43 m).
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m. Heights here are
 *   above the lowest street grade at the south-west corner (17.4 m NAVD88):
 *   flat roofs 23.0-23.5; corner blocks' cornice 22.0; the arcade's attic
 *   26.4 and the two towers flanking it 27.2-27.5 (fronts 2.9 m proud of the
 *   Grove front; drawn at 28.4 with their cartouche groups to 30.4 so they
 *   read above the attic, as they do from the street); a low octagonal pyramid roof, 61 m across the flats, rising
 *   from 23.8 at its eaves to 33.5 at a round lantern of radius 7.2 whose
 *   shallow dome tops out at 37.9; the entrance canopy at 7.3, 4.5 m deep.
 *   Flagpoles on the attic stand in pairs at x = +-8.2 and +-24: the column
 *   pairs between the three arches.
 * - Published (Wikipedia; SF Landmark): 1915, John Galen Howard, Frederick
 *   Meyer and John Reid Jr., built as the Exposition Auditorium for the
 *   Panama-Pacific International Exposition.
 * - Commons photos (daylight): "Bill Graham Civic Auditorium (San
 *   Francisco).JPG" (Sanfranman59, CC BY-SA 4.0, the Grove front from the
 *   north); "Bill Graham Civic Auditorium from NE.JPG" (BrokenSphere, CC BY-SA
 *   4.0); "Bill Graham Civic Auditorium, San Francisco, California
 *   (10754276295).jpg" (Ken Lund, CC BY-SA 2.0, from the north-west); "San
 *   Francisco Civic Auditorium side view.jpg" (Andreas Praefcke, CC BY 3.0, the
 *   buff-brick Polk side); HABS CAL,38-SANFRA,71-C-1 "Civic Auditorium, corner
 *   view" (public domain, from the north-east).
 *
 * Estimated from the photos: the storey heights (7 m rusticated base under
 * the canopy, giant order to 18.8, entablature, attic), the arches' size
 * (9.4 m glazing from just above the canopy to a crown at 20.7, just under
 * the entablature, as in the Grove front photos), the towers' and corner
 * blocks' windows. No street photo shows the roof: its octagon and lantern are
 * from lidar, coloured from the USGS NAIP orthophoto (pale flat roofs, dark
 * charcoal octagon). The two concrete fire stairs on the
 * Polk and Larkin sides are left out.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 351
const ANCHOR = { lng: -122.4173275, lat: 37.7780526 }

const stone = new Part(), brick = new Part(), win = new Part(), roof = new Part(), canopy = new Part(), dark = new Part()

type XY = [number, number]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return v.map((n) => n / l) as V3 }
const up: V3 = [0, 0, 1]

// Mirrored in x: the west half is the east half turned over, so its winding flips.
let SX = 1
const T = (p: V3): V3 => [p[0] * SX, p[1], p[2]]
function tri(part: Part, a: V3, b: V3, c: V3, n?: V3[]) {
  const N = n?.map(T)
  if (SX > 0) part.tri(T(a), T(b), T(c), undefined, undefined, undefined, N)
  else part.tri(T(a), T(c), T(b), undefined, undefined, undefined, N && [N[0], N[2], N[1]])
}
function quad(part: Part, a: V3, b: V3, c: V3, d: V3, n?: V3[]) {
  tri(part, a, b, c, n && [n[0], n[1], n[2]])
  tri(part, a, c, d, n && [n[0], n[2], n[3]])
}
type Seg = { a: XY; t: XY; n: XY; len: number }
/** A wall from a to b with the outside on the right (plan walked anticlockwise). */
function seg(a: XY, b: XY): Seg {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
  return { a, t, n: [t[1], -t[0]], len }
}
const P = (g: Seg, s: number, d: number, z: number): V3 => [g.a[0] + g.t[0] * s + g.n[0] * d, g.a[1] + g.t[1] * s + g.n[1] * d, z]
function wall(part: Part, g: Seg, s0: number, s1: number, z0: number, z1: number, d = 0) {
  const n: V3 = [g.n[0], g.n[1], 0]
  quad(part, P(g, s0, d, z0), P(g, s1, d, z0), P(g, s1, d, z1), P(g, s0, d, z1), [n, n, n, n])
}
/** A moulding along a wall: profile (d, z) out from the wall, up, back in. */
function band(part: Part, g: Seg, s0: number, s1: number, prof: [number, number][]) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [d0, z0] = prof[k], [d1, z1] = prof[k + 1]
    quad(part, P(g, s0, d0, z0), P(g, s1, d0, z0), P(g, s1, d1, z1), P(g, s0, d1, z1))
  }
}
const pane = (g: Seg, s0: number, s1: number, z0: number, z1: number, d = 0) => wall(win, g, s0, s1, z0, z1, d + 0.05)
const cornice = (z0: number, z1: number, d: number): [number, number][] => [[0, z0], [d * 0.55, z0 + (z1 - z0) * 0.35], [d, z1 - (z1 - z0) * 0.4], [d, z1], [0, z1]]
const plinth = (h: number, d = 0.3): [number, number][] => [[d, 0], [d, h - 0.3], [0, h]]
/** A round-headed window panel of width w, sill z0, crown z1. */
function arched(g: Seg, sc: number, w: number, z0: number, z1: number, d = 0.05) {
  const r = w / 2, spring = z1 - r, n: V3 = [g.n[0], g.n[1], 0]
  const pts: V3[] = [P(g, sc - r, d, z0), P(g, sc + r, d, z0)]
  for (let k = 0; k <= 10; k++) pts.push(P(g, sc + r * Math.cos((k * Math.PI) / 10), d, spring + r * Math.sin((k * Math.PI) / 10)))
  const c = P(g, sc, d, (z0 + spring) / 2)
  for (let i = 0; i < pts.length; i++) tri(win, c, pts[i], pts[(i + 1) % pts.length], [n, n, n])
}
/** The stone ring round an arch head, standing proud of the wall. */
function archivolt(g: Seg, sc: number, r0: number, r1: number, spring: number, d: number) {
  const k = 10
  for (let i = 0; i < k; i++) {
    const a0 = (i * Math.PI) / k, a1 = ((i + 1) * Math.PI) / k
    const p = (r: number, a: number, dd: number) => P(g, sc + r * Math.cos(a), dd, spring + r * Math.sin(a))
    quad(stone, p(r0, a1, d), p(r0, a0, d), p(r1, a0, d), p(r1, a1, d))
    quad(stone, p(r1, a0, 0), p(r1, a1, 0), p(r1, a1, d), p(r1, a0, d))
  }
}
/** A bold engaged half column, centred on the wall plane (half octagon). */
function halfColumn(g: Seg, sc: number, r: number, z0: number, z1: number) {
  for (let i = 0; i < 4; i++) {
    const a0 = (i * Math.PI) / 4, a1 = ((i + 1) * Math.PI) / 4
    const q = (a: number, z: number) => P(g, sc + r * Math.cos(a), r * Math.sin(a), z)
    const nn = (a: number): V3 => [g.t[0] * Math.cos(a) + g.n[0] * Math.sin(a), g.t[1] * Math.cos(a) + g.n[1] * Math.sin(a), 0]
    quad(stone, q(a1, z0), q(a0, z0), q(a0, z1), q(a1, z1), [nn(a1), nn(a0), nn(a0), nn(a1)])
  }
}
/** A round column (hexagonal prism) standing in front of a wall. */
function column(g: Seg, sc: number, r: number, z0: number, z1: number, d: number, seg = 6) {
  for (let i = 0; i < seg; i++) {
    const a0 = (i * 2 * Math.PI) / seg, a1 = ((i + 1) * 2 * Math.PI) / seg
    const q = (a: number, z: number) => P(g, sc + r * Math.cos(a), d + r * Math.sin(a), z)
    const nn = (a: number): V3 => [g.t[0] * Math.cos(a) + g.n[0] * Math.sin(a), g.t[1] * Math.cos(a) + g.n[1] * Math.sin(a), 0]
    // the quad winds outward when walked with increasing angle in the (t, n) plane
    quad(stone, q(a1, z0), q(a0, z0), q(a0, z1), q(a1, z1), [nn(a1), nn(a0), nn(a0), nn(a1)])
  }
}

// ---------------------------------------------------------------------------
// Plan (east half, x >= 0) and heights, from OSM and lidar.
const XW = 60.7 // brick side walls
const XC = 62.2, YC = 24.1 // stone corner blocks: 1.5 m proud on the sides, from y = 24.1
const YF = 37.0 // Grove front
const XT0 = 28.6, XT1 = 41.6, YT = 39.9 // towers flanking the arcade
const YS = -38.8 // south wall
const ROOF = 23.0, CORNICE = 22.0
const BASE = 7.0, ORDER = 21.0, ENT = 23.0, ATTIC = 26.4, TOWER = 28.4

function half() {
  // --- Arcade: three arches between paired columns, canopy, attic. ---
  {
    // Walked westward from the tower, so the outside (north) is on the right.
    const fr = seg([XT0, YF], [0, YF])
    wall(stone, fr, 0, XT0, 0, ATTIC)
    band(stone, fr, -0.3, XT0, plinth(1.0))
    band(stone, fr, -1.0, XT0, cornice(ORDER, ENT, 1.2))
    band(stone, fr, -1.2, XT0, cornice(ATTIC - 1.1, ATTIC, 1.2))
    band(stone, fr, -0.4, XT0, cornice(BASE - 0.6, BASE, 0.4))
    // s on `fr` is measured from the tower westwards: x = XT0 - s.
    const S = (x: number) => XT0 - x
    for (const pc of [8.2, 24.0]) for (const dx of [-1.3, 1.3]) {
      halfColumn(fr, S(pc + dx), 1.0, BASE, ORDER)
    }
    // arches: the middle one is drawn whole on the east pass only
    for (const ac of [0, 16.1]) {
      if (ac === 0 && SX < 0) continue
      // the great arches: springing about 8 m above the canopy, crown just
      // under the entablature, one broad glazed panel each
      arched(fr, S(ac), 9.4, BASE + 0.9, ORDER - 0.3)
      archivolt(fr, S(ac), 4.7, 5.5, ORDER - 0.3 - 4.7, 0.45)
      // doors under the canopy
      pane(fr, S(ac) - 3.2, S(ac) + 3.2, 0.3, BASE - 1.4)
    }
    // round medallions on the attic over each column pair
    for (const pc of [8.2, 24.0]) {
      const c = P(fr, S(pc), 0.12, 24.4), n: V3 = [0, 1, 0]
      for (let k = 0; k < 8; k++) {
        const a0 = (k * Math.PI) / 4, a1 = ((k + 1) * Math.PI) / 4
        const q = (a: number) => P(fr, S(pc) + 0.9 * Math.cos(a), 0.12, 24.4 + 0.9 * Math.sin(a))
        tri(stone, c, q(a0), q(a1), [n, n, n])
      }
    }
    // the attic's roof behind its parapet
    quad(roof, [0, YF - 3, ATTIC], [XT0, YF - 3, ATTIC], [XT0, YF, ATTIC], [0, YF, ATTIC])
    const back = seg([0, YF - 3], [XT0, YF - 3])
    wall(stone, back, 0, XT0, ROOF, ATTIC)
    // entrance canopy: a dark slab across the arcade
    const x1 = 27.6, y0 = YF, y1 = YF + 4.5, z0 = BASE - 0.1, z1 = BASE + 0.8
    quad(canopy, [0, y0, z1], [x1, y0, z1], [x1, y1, z1], [0, y1, z1])
    quad(canopy, [0, y1, z0], [x1, y1, z0], [x1, y0, z0], [0, y0, z0])
    quad(canopy, [x1, y1, z0], [0, y1, z0], [0, y1, z1], [x1, y1, z1])
    quad(canopy, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1])
  }
  // --- Tower: proud of the front, paired columns at its edges, a balconied window. ---
  {
    const fr = seg([XT1, YT], [XT0, YT]), e = seg([XT1, YF], [XT1, YT]), w = seg([XT0, YT], [XT0, YF])
    // Bands run past the tower's two outer corners by their own depth.
    for (const g of [fr, e, w]) {
      const ext = (d: number): [number, number] => [g === e ? 0 : -d, g === w ? g.len : g.len + d]
      wall(stone, g, 0, g.len, 0, TOWER)
      band(stone, g, ...ext(0.3), plinth(1.0))
      band(stone, g, ...ext(1.0), cornice(ORDER, ENT, 1.0))
      band(stone, g, ...ext(0.8), cornice(TOWER - 0.8, TOWER, 0.8))
      band(stone, g, ...ext(0.4), cornice(BASE - 0.6, BASE, 0.4))
    }
    const L = fr.len
    for (const s of [1.3, 3.5, L - 3.5, L - 1.3]) halfColumn(fr, s, 0.95, BASE, ORDER)
    pane(fr, L / 2 - 1.6, L / 2 + 1.6, 9.0, 18.0)
    pane(fr, L / 2 - 1.0, L / 2 + 1.0, 24.0, 26.6)
    pane(fr, L / 2 - 1.4, L / 2 + 1.4, 0.3, 5.0)
    quad(stone, [XT0, YF - 3, TOWER], [XT1, YF - 3, TOWER], [XT1, YT, TOWER], [XT0, YT, TOWER])
    // the cartouche group on the tower's crown, as one block
    const cx = (XT0 + XT1) / 2
    quad(stone, [cx + 2.2, YT - 0.2, TOWER], [cx - 2.2, YT - 0.2, TOWER], [cx - 1.6, YT - 0.2, TOWER + 2.0], [cx + 1.6, YT - 0.2, TOWER + 2.0])
    quad(stone, [cx - 2.2, YT - 1.6, TOWER], [cx + 2.2, YT - 1.6, TOWER], [cx + 1.6, YT - 1.6, TOWER + 2.0], [cx - 1.6, YT - 1.6, TOWER + 2.0])
    quad(stone, [cx - 1.6, YT - 0.2, TOWER + 2.0], [cx - 1.6, YT - 1.6, TOWER + 2.0], [cx + 1.6, YT - 1.6, TOWER + 2.0], [cx + 1.6, YT - 0.2, TOWER + 2.0])
    for (const sx of [1, -1]) {
      const x0 = cx + 2.2 * sx, x1 = cx + 1.6 * sx
      const a: V3 = [x0, YT - 0.2, TOWER], b: V3 = [x0, YT - 1.6, TOWER], c: V3 = [x1, YT - 1.6, TOWER + 2.0], d: V3 = [x1, YT - 0.2, TOWER + 2.0]
      if (sx > 0) quad(stone, b, a, d, c); else quad(stone, a, b, c, d)
    }
    // tower walls above the roof, behind
    const bk = seg([XT0, YF - 3], [XT1, YF - 3])
    wall(stone, bk, 0, bk.len, ROOF, TOWER)
  }
  // --- Corner block: stone, three storeys of windows on both street fronts. ---
  {
    const fr = seg([XC, YF], [XT1, YF]), sd = seg([XC, YC], [XC, YF]), rt = seg([XW, YC], [XC, YC])
    for (const [g, bays] of [[fr, 3], [sd, 3], [rt, 0]] as [Seg, number][]) {
      wall(stone, g, 0, g.len, 0, CORNICE + 1.3)
      band(stone, g, -0.3, g.len + 0.3, plinth(1.0))
      band(stone, g, -0.4, g.len + 0.4, cornice(BASE - 0.6, BASE, 0.4))
      band(stone, g, -0.4, g.len + 0.4, cornice(16.6, 17.2, 0.4))
      band(stone, g, -0.9, g.len + 0.9, cornice(CORNICE - 0.9, CORNICE, 0.9))
      quad(stone, P(g, 0, 0, CORNICE + 1.3), P(g, g.len, 0, CORNICE + 1.3), P(g, g.len, -0.6, CORNICE + 1.3), P(g, 0, -0.6, CORNICE + 1.3))
      for (let k = 0; k < bays; k++) {
        const sc = (g.len * (k + 0.5)) / bays
        pane(g, sc - 0.9, sc + 0.9, 1.6, 5.2, 0.3)
        pane(g, sc - 1.2, sc + 1.2, 8.6, 16.2) // two storeys in one panel
        pane(g, sc - 0.7, sc + 0.7, 18.2, 20.2)
        // pedimented hood over the main window
        const hz = 16.4, hw = 1.6, n: V3 = [g.n[0], g.n[1], 0]
        tri(stone, P(g, sc - hw, 0.25, hz), P(g, sc + hw, 0.25, hz), P(g, sc, 0.25, hz + 0.9), [n, n, n])
      }
    }
  }
  // --- Brick side and rear, buff with a grey base and a stone cornice line. ---
  {
    const sd = seg([XW, YS], [XW, YC]), rr = seg([0, YS], [XW, YS])
    for (const g of [sd, rr]) {
      wall(brick, g, 0, g.len, 0, CORNICE + 1.3)
      const s0 = (d: number) => (g === rr ? 0 : -d) // the rear stops at the mirror line
      band(stone, g, s0(0.3), g.len + 0.3, plinth(3.0))
      band(brick, g, s0(0.6), g.len + 0.6, cornice(CORNICE - 0.7, CORNICE, 0.6))
      band(brick, g, s0(0.3), g.len + 0.3, cornice(15.6, 16.0, 0.3))
      quad(brick, P(g, 0, 0, CORNICE + 1.3), P(g, g.len, 0, CORNICE + 1.3), P(g, g.len, -0.6, CORNICE + 1.3), P(g, 0, -0.6, CORNICE + 1.3))
      // a few windows in the brick: two rows, widely spaced
      // windows grouped into a few broad two-storey panels
      const n = Math.floor(g.len / 16)
      for (let k = 0; k < n; k++) {
        const sc = (g.len * (k + 0.5)) / n
        pane(g, sc - 2.6, sc + 2.6, 10.0, 15.2)
        pane(g, sc - 2.6, sc + 2.6, 16.6, 20.2)
      }
    }
  }
  // --- Roof: flat round the edges, then the octagonal pyramid and its lantern. ---
  {
    const OC: XY = [0, -4.7], AP = 30.5, z0 = 23.8, LR = 7.2, LZ = 33.5 // lidar centre (0.5, -4.7), kept on the mirror line
    // Flat roof as a ring of quads from the outline in to the octagon's square hull.
    const xo = XC - 0.6, yo = YF - 0.6
    quad(roof, [0, YS + 0.6, ROOF], [xo, YS + 0.6, ROOF], [xo, OC[1] - AP, ROOF], [0, OC[1] - AP, ROOF])
    quad(roof, [0, OC[1] + AP, ROOF], [xo, OC[1] + AP, ROOF], [xo, yo - 2.4, ROOF], [0, yo - 2.4, ROOF])
    quad(roof, [OC[0] + AP, OC[1] - AP, ROOF], [xo, OC[1] - AP, ROOF], [xo, OC[1] + AP, ROOF], [OC[0] + AP, OC[1] + AP, ROOF])
    // octagon: vertices at 22.5 deg off the axes, so its flats face the streets
    const R = AP / Math.cos(Math.PI / 8)
    const oct = (r: number, k: number): XY => {
      const a = Math.PI / 8 + (k * Math.PI) / 4
      return [r * Math.cos(a), r * Math.sin(a)]
    }
    // corners between the octagon and its square hull, at roof level (east half)
    for (const [k, cx, cy] of [[0, 1, 1], [7, 1, -1]] as [number, number, number][]) {
      const v0 = oct(R, k), v1 = oct(R, k === 0 ? 1 : 6)
      const corner: V3 = [OC[0] + AP * cx, OC[1] + AP * cy, ROOF]
      const a: V3 = [OC[0] + v0[0], OC[1] + v0[1], ROOF], b: V3 = [OC[0] + v1[0], OC[1] + v1[1], ROOF]
      if (cy > 0) tri(roof, a, corner, b); else tri(roof, a, b, corner)
    }
    // The east half of the octagon: faces k = 6, 7, 0, 1 and half of 2 and 5.
    // Built whole, once.
    if (SX > 0) {
      const ring = (r: number, z: number) => Array.from({ length: 8 }, (_, k) => { const p = oct(r, k); return [OC[0] + p[0], OC[1] + p[1], z] as V3 })
      const lo = ring(R, ROOF - 0.1), eave = ring(R, z0), top = ring(LR / Math.cos(Math.PI / 8), LZ)
      for (let k = 0; k < 8; k++) {
        const j = (k + 1) % 8
        quad(dark, lo[k], lo[j], eave[j], eave[k])
        quad(dark, eave[k], eave[j], top[j], top[k])
      }
      // close the octagon's top round the lantern's foot
      for (let k = 1; k < 7; k++) tri(dark, top[0], top[k], top[k + 1], [up, up, up])
      // lantern: a short round drum and a shallow dome
      const N = 16
      const prof: [number, number][] = [[LR, LZ - 0.4], [LR, 35.4], [LR + 0.3, 35.7], [LR - 0.2, 35.9]]
      for (let i = 1; i <= 5; i++) { const t = (i / 5) * (Math.PI / 2); prof.push([(LR - 0.2) * Math.cos(t), 35.9 + 2.0 * Math.sin(t)]) }
      for (let s = 0; s < prof.length - 1; s++) {
        const [r0, h0] = prof[s], [r1, h1] = prof[s + 1]
        for (let i = 0; i < N; i++) {
          const a0 = (i / N) * 2 * Math.PI, a1 = ((i + 1) / N) * 2 * Math.PI
          const p = (r: number, h: number, a: number): V3 => [OC[0] + r * Math.cos(a), OC[1] + r * Math.sin(a), h]
          const nn = (a: number): V3 => unit([Math.cos(a) * (h1 - h0), Math.sin(a) * (h1 - h0), r0 - r1])
          if (r1 < 1e-3) tri(dark, p(r0, h0, a0), p(r0, h0, a1), p(0, h1, 0), [nn(a0), nn(a1), up])
          else quad(dark, p(r0, h0, a0), p(r0, h0, a1), p(r1, h1, a1), p(r1, h1, a0), [nn(a0), nn(a1), nn(a1), nn(a0)])
        }
      }
    }
  }
  // rooftop plant rooms (lidar 26-28 m; pale boxes in the NAIP orthophoto)
  for (const [x, y, w, d] of [[50, 4.5, 3, 4], [43, 19, 3, 3], [42, -27, 3, 3]]) {
    const top = 26.5
    quad(roof, [x - w, y - d, top], [x + w, y - d, top], [x + w, y + d, top], [x - w, y + d, top])
    quad(stone, [x - w, y - d, ROOF], [x + w, y - d, ROOF], [x + w, y - d, top], [x - w, y - d, top])
    quad(stone, [x + w, y + d, ROOF], [x - w, y + d, ROOF], [x - w, y + d, top], [x + w, y + d, top])
    quad(stone, [x + w, y - d, ROOF], [x + w, y + d, ROOF], [x + w, y + d, top], [x + w, y - d, top])
    quad(stone, [x - w, y + d, ROOF], [x - w, y - d, ROOF], [x - w, y - d, top], [x - w, y + d, top])
  }
  // closed underneath
  quad(stone, [0, YS, 0], [0, YF, 0], [XW, YF, 0], [XW, YS, 0])
}

for (const sx of [1, -1]) { SX = sx; half() }

// sRGB from the photos: pale grey granite fronts, buff brick sides and rear,
// the canopy's grey-green metal; roofs from the NAIP orthophoto.
const parts = [
  { part: stone, material: finish('granite', 0xe2e0d8) },
  { part: brick, material: finish('buff-brick', 0xdccdb2) },
  { part: win, material: PALETTE.window },
  { part: roof, material: { ...PALETTE.roof, color: 0xbfc2c2 } }, // pale flat roofs (NAIP)
  { part: dark, material: finish('roof-dark', 0x666b70) }, // the octagon's dark roofing (NAIP)
  { part: canopy, material: finish('canopy', 0x87928d) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
for (const { part, material } of parts) console.log(`  ${material.name}: ${part.triangles}`)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Bill Graham Civic Auditorium', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 37.9,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/25759141', 'way/435831538'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-bill-graham-auditorium.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
