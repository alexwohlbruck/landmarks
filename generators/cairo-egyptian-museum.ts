/**
 * Egyptian Museum (Museum of Egyptian Antiquities), Tahrir Square, Cairo
 * (Marcel Dourgnon, 1897-1902): procedural, CC0-1.0.
 * bun generators/cairo-egyptian-museum.ts
 *
 * Frame: OSM's outline (way/10873198) runs square to the compass, so the
 * bearing is 0: +y north, the main front faces south onto the garden and
 * Tahrir Square. Origin: the outline's centroid.
 *
 * Plan (OSM, measured in this frame): the front range 123 m long and
 * 28 m deep, with the end pavilions standing 4.9 m forward and the
 * central pavilion 0.8 m; the rear block 80.6 x 92 m behind it; the
 * central hall's gabled skylight (building:part way/1426262310, 21 x
 * 86 m); the dome over the entrance rotunda (way/1426262312, 18.8 m
 * across).
 *
 * Heights: OSM gives the front range 20 m (way/1426262311, to its attic),
 * the skylight 20 m with a 3 m roof, the dome 30 m with an 8 m roof.
 * From "Facade of the Egyptian Museum, Tahrir Square, Cairo, Egypt1.jpg"
 * (Diego Delso, frontal), scaled by the central pavilion's 23.2 m width
 * (OSM): the ranges' cornice 15.2 m and parapet 16.4; the central
 * pavilion to 22.8 m with its attic; the great round arch 11 m across,
 * springing at 8.7 m, crowned at 14 m; the door 5.8 m; the statue niches
 * 9 to 14 m; the ground-floor arched windows 6.3 m tall, the upper
 * windows 2 m. The end pavilions' attic to 18 m and the dome's lantern
 * from the aerial "The Egyptian Museum in Cairo, Egypt (2743500211).jpg".
 *
 * Ground: Tahrir is level, but the map's terrain here (Mapterhorn z12, no
 * finer tiles) carries a 13 m hump over the block (it reads the buildings
 * as ground); the map fills the footprint from the ground outside it, and
 * the model rises from y = 0 there. Elevation 0.
 *
 * Simplified or left out: the facade's carved panels and inscriptions
 * (flat panels), the statues of the two women in the niches (simple
 * relief figures), the fanlight's grille (a few bars), the sphinxes and
 * the garden pool (separate), the side and rear facades' details (drawn
 * like the front's wings, no licensed photo of them close up).
 *
 * Colours: the terracotta orange-red render (#c2643f sampled from the
 * frontal photo and the aerial); the cornices, frames and niches a lighter
 * terracotta; the portal's arch surround, columns, lunette lattice and
 * the niche statues a pale stone (as the photos show); the roofs grey; the skylight glass. The fanlight's lattice
 * (radial and ring bars) is drawn in both models so the lunette reads at
 * 200 px.
 *
 * Night: the facade is floodlit (`_FLOODLIGHT`); windows and the portal's
 * fanlight glow.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - "Facade of the Egyptian Museum, Tahrir Square, Cairo, Egypt1.jpg", Diego Delso, CC BY-SA 3.0 (front; main ruler)
 *   https://commons.wikimedia.org/wiki/File:Facade_of_the_Egyptian_Museum,_Tahrir_Square,_Cairo,_Egypt1.jpg
 * - "Egyptian Museum entrance DSCF0770.jpg", R Prazeres, CC BY-SA 4.0 (front with the dome behind)
 *   https://commons.wikimedia.org/wiki/File:Egyptian_Museum_entrance_DSCF0770.jpg
 * - "Egyptian Museum in Cairo in May 2015.JPG", MusikAnimal, CC BY-SA 4.0 (front)
 *   https://commons.wikimedia.org/wiki/File:Egyptian_Museum_in_Cairo_in_May_2015.JPG
 * - "Egyptian Museum in Cairo Far view.JPG", Johnny 201, CC BY-SA 3.0 (oblique from the south-west)
 *   https://commons.wikimedia.org/wiki/File:Egyptian_Museum_in_Cairo_Far_view.JPG
 * - "Egyptian Museum, in Cairo - panoramio.jpg", Maris Teteris, CC BY 3.0 (panorama of the front)
 *   https://commons.wikimedia.org/wiki/File:Egyptian_Museum,_in_Cairo_-_panoramio.jpg
 * - "The Egyptian Museum in Cairo, Egypt (2743500211).jpg", V Manninen, CC BY 2.0 (aerial from the south-east: roofs, dome, end pavilions)
 *   https://commons.wikimedia.org/wiki/File:The_Egyptian_Museum_in_Cairo,_Egypt_(2743500211).jpg
 * Look-only: none.
 *
 * Doubts: the rear block's height and its courts (its roofs are only seen
 * far off in the aerial); the end pavilions' attic height; the dome's
 * profile (low, behind the pavilion).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { TAU, Z, box, dome, face, lathe, norm, panel, quad, save, tri, type Mat, type XY } from './cairo-cairo-tower'
import { arcade } from './cairo-muhammad-ali-mosque'
import { ccw, ringWalls, slab } from './cairo-sultan-hassan-mosque'

const OX = -0.3, OY = -19.1
const L = (x: number, y: number): XY => [x - OX, y - OY]
const CORN = 15.2, PARA = 16.4

function build(detail: boolean): Mat[] {
  const pink = new Part()
  const trim = new Part()
  const roof = new Part()
  const win = new Part()
  const glass = new Part()
  const pale = new Part() // the portal's pale stone: the arch surround, columns, lattice, statues
  const seg = (lo: number, hi: number) => (detail ? hi : lo)

  /** A range: a box with plinth, cornice, parapet and a flat roof. */
  const range = (x0: number, x1: number, y0: number, y1: number, h: number, faces: { s?: boolean; n?: boolean; e?: boolean; w?: boolean } = {}) => {
    const [a0, b0] = L(x0, y0), [a1, b1] = L(x1, y1)
    box(pink, null, a0, a1, b0, b1, 0, h - 1.2)
    box(trim, null, a0 - 0.12, a1 + 0.12, b0 - 0.12, b1 + 0.12, 0, 1.0) // plinth
    box(trim, null, a0 - 0.12, a1 + 0.12, b0 - 0.12, b1 + 0.12, 6.9, 7.4) // the string course over the ground floor
    // cornice: a projecting band with its soffit, then the parapet
    box(trim, trim, a0 - 0.6, a1 + 0.6, b0 - 0.6, b1 + 0.6, h - 1.2, h - 0.6, 0.2)
    box(pink, null, a0 - 0.1, a1 + 0.1, b0 - 0.1, b1 + 0.1, h - 0.6, h + 1.2)
    face(roof, [[a0, b0, h + 0.6], [a1, b0, h + 0.6], [a1, b1, h + 0.6], [a0, b1, h + 0.6]], Z)
    if (detail) box(trim, trim, a0 - 0.2, a1 + 0.2, b0 - 0.2, b1 + 0.2, h + 1.2, h + 1.4)
    void faces
    return [a0, b0, a1, b1]
  }
  /** Bays of windows along a face: an arched ground-floor window and an upper rectangle with its panel. */
  const bays = (A: XY, B: XY, n: V3, count: number, skip: (i: number) => boolean = () => false) => {
    const Ln = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / Ln, (B[1] - A[1]) / Ln]
    for (let i = 0; i < count; i++) {
      if (skip(i)) continue
      const s = (Ln * (i + 0.5)) / count, c: V3 = [A[0] + u[0] * s, A[1] + u[1] * s, 0]
      panel(trim, [c[0], c[1], 1.0], n, 3.8, 6.4, 'round', seg(4, 8), 0.08) // the surround
      panel(win, [c[0], c[1], 1.4], n, 2.8, 5.6, 'round', seg(4, 8), 0.14)
      panel(trim, [c[0], c[1], 9.4], n, 2.6, 3.0, false, 2, 0.08)
      panel(win, [c[0], c[1], 9.8], n, 1.8, 2.2, false, 2, 0.14)
      if (detail) panel(trim, [c[0], c[1], 12.8], n, 2.8, 1.2, false, 2, 0.1) // the carved panel over it
      // pilasters between bays
      if (i > 0) {
        const s0 = (Ln * i) / count, p: XY = [A[0] + u[0] * s0, A[1] + u[1] * s0]
        quad(pink, [p[0] - u[0] * 0.45 + n[0] * 0.2, p[1] - u[1] * 0.45 + n[1] * 0.2, 1.0], [p[0] + u[0] * 0.45 + n[0] * 0.2, p[1] + u[1] * 0.45 + n[1] * 0.2, 1.0], [p[0] + u[0] * 0.45 + n[0] * 0.2, p[1] + u[1] * 0.45 + n[1] * 0.2, CORN - 0.1], [p[0] - u[0] * 0.45 + n[0] * 0.2, p[1] - u[1] * 0.45 + n[1] * 0.2, CORN - 0.1], n)
        for (const sg of [-1, 1]) quad(pink, [p[0] + u[0] * sg * 0.45, p[1] + u[1] * sg * 0.45, 1.0], [p[0] + u[0] * sg * 0.45 + n[0] * 0.2, p[1] + u[1] * sg * 0.45 + n[1] * 0.2, 1.0], [p[0] + u[0] * sg * 0.45 + n[0] * 0.2, p[1] + u[1] * sg * 0.45 + n[1] * 0.2, CORN - 0.1], [p[0] + u[0] * sg * 0.45, p[1] + u[1] * sg * 0.45, CORN - 0.1], [u[0] * sg, u[1] * sg, 0])
      }
    }
  }

  // ── The rear block (galleries round the central hall), then the front
  // range with its end pavilions and the central pavilion.
  const rear = ccw([[-40.3, -45.1], [40.2, -44.7], [40.1, 47.2], [29.5, 47.2], [29.5, 44.2], [14.1, 44.2], [14.1, 49.2], [7.1, 49.2], [7.1, 50.8], [-7.3, 50.8], [-7.3, 49.3], [-14.4, 49.3], [-14.4, 43.9], [-28.8, 43.9], [-28.8, 47.3], [-40.4, 47.3]].map(([x, y]) => L(x, y)))
  ringWalls(pink, rear, 0, CORN)
  const nave = ccw([L(-8.5, -45), L(12.5, -45), L(12.5, 37.4), L(-8.5, 37.4)])
  slab(roof, rear, [nave], PARA - 0.4)
  // the rear block's cornice
  for (let i = 0; i < rear.length; i++) {
    const a = rear[i], b = rear[(i + 1) % rear.length], Ln = Math.hypot(b[0] - a[0], b[1] - a[1]), n: V3 = [(b[1] - a[1]) / Ln, -(b[0] - a[0]) / Ln, 0]
    quad(trim, [a[0] + n[0] * 0.5, a[1] + n[1] * 0.5, CORN], [b[0] + n[0] * 0.5, b[1] + n[1] * 0.5, CORN], [b[0] + n[0] * 0.5, b[1] + n[1] * 0.5, PARA - 0.4], [a[0] + n[0] * 0.5, a[1] + n[1] * 0.5, PARA - 0.4], n)
    quad(trim, [a[0], a[1], CORN], [b[0], b[1], CORN], [b[0] + n[0] * 0.5, b[1] + n[1] * 0.5, CORN], [a[0] + n[0] * 0.5, a[1] + n[1] * 0.5, CORN], [0, 0, -1])
    quad(roof, [a[0] + n[0] * 0.5, a[1] + n[1] * 0.5, PARA - 0.4], [b[0] + n[0] * 0.5, b[1] + n[1] * 0.5, PARA - 0.4], [b[0], b[1], PARA - 0.4], [a[0], a[1], PARA - 0.4], Z)
    if (Ln > 20) bays(a, b, n, Math.round(Ln / seg(9, 6)))
  }
  // the central hall's gabled skylight
  {
    const [x0, y0] = L(-8.5, -45), [x1, y1] = L(12.5, 37.4), xm = (x0 + x1) / 2, zr = PARA + 3.6, ze = PARA - 0.4
    quad(glass, [x0, y0, ze], [x0, y1, ze], [xm, y1, zr], [xm, y0, zr], norm([-(zr - ze), 0, xm - x0]))
    quad(glass, [x1, y1, ze], [x1, y0, ze], [xm, y0, zr], [xm, y1, zr], norm([(zr - ze), 0, x1 - xm]))
    tri(pink, [x0, y1, ze], [x1, y1, ze], [xm, y1, zr], [0, 1, 0])
    for (let k = 0; k <= seg(4, 10); k++) {
      const y = y0 + ((y1 - y0) * k) / seg(4, 10)
      quad(trim, [x0, y - 0.25, ze + 0.05], [x0, y + 0.25, ze + 0.05], [xm, y + 0.25, zr + 0.05], [xm, y - 0.25, zr + 0.05], norm([-(zr - ze), 0, xm - x0]))
      quad(trim, [x1, y + 0.25, ze + 0.05], [x1, y - 0.25, ze + 0.05], [xm, y - 0.25, zr + 0.05], [xm, y + 0.25, zr + 0.05], norm([(zr - ze), 0, x1 - xm]))
    }
  }

  // Front range (between the end pavilions) and the end pavilions.
  range(-45.5, -12.5, -73.2, -45.1, PARA - 0.4)
  range(10.7, 44.3, -73.2, -45.1, PARA - 0.4)
  for (const [x0, x1] of [[-61.4, -45.5], [44.3, 61.8]]) {
    const [a0, b0, a1] = range(x0, x1, -78.1, -45.1, 18.0)
    // the attic block and the end pavilion's great window
    box(pink, trim, a0 + 1.5, a1 - 1.5, b0 + 0.5, b0 + 6, 18.0, 19.6)
    const cx = (a0 + a1) / 2
    panel(trim, [cx, b0, 1.0], [0, -1, 0], 6.6, 11.6, 'round', seg(6, 12), 0.08)
    panel(win, [cx, b0, 1.4], [0, -1, 0], 5.4, 10.6, 'round', seg(6, 12), 0.14)
    for (const s of [-1, 1]) panel(win, [cx + s * 5.6, b0, 9.8], [0, -1, 0], 1.6, 2.2, false, 2, 0.14)
  }
  {
    // the long front's bays, either side of the central pavilion
    bays(L(-45.5, -73.2), L(-12.5, -73.2), [0, -1, 0], 5)
    bays(L(10.7, -73.2), L(44.3, -73.2), [0, -1, 0], 5)
  }

  // ── The central pavilion: forward of the range, taller, with the great
  // round arch, its fanlight and door, the column pairs, the statue niches,
  // the attic and its cornice.
  {
    const [x0, y0] = L(-12.5, -74.0), [x1] = L(10.7, -74.0), [, y1] = L(0, -45.1)
    const cx = (x0 + x1) / 2, H = 20.4
    // the face is drawn round the arch opening; sides and back as a box
    quad(pink, [x0, y0, 0], [x0, y1, 0], [x0, y1, H], [x0, y0, H], [-1, 0, 0])
    quad(pink, [x1, y1, 0], [x1, y0, 0], [x1, y0, H], [x1, y1, H], [1, 0, 0])
    const AW = 9.2, spring = 8.7, depth = 1.6
    arcade(pink, [cx - AW / 2 - 0.01, y0, 0], [1, 0, 0], [0, -1, 0], 1, AW, 0.001, 0, spring, H, 'round', seg(8, 14), depth, { reveal: trim })
    quad(pink, [x0, y0, 0], [cx - AW / 2, y0, 0], [cx - AW / 2, y0, H], [x0, y0, H], [0, -1, 0])
    quad(pink, [cx + AW / 2, y0, 0], [x1, y0, 0], [x1, y0, H], [cx + AW / 2, y0, H], [0, -1, 0])
    // inside the arch: the back wall with the door and the fanlight's bars
    const yb = y0 + depth
    quad(pink, [cx - AW / 2, yb, 0], [cx + AW / 2, yb, 0], [cx + AW / 2, yb, spring], [cx - AW / 2, yb, spring], [0, -1, 0])
    face(win, archRing(cx, yb - 0.02, AW / 2, spring, seg(8, 14)), [0, -1, 0])
    panel(win, [cx, yb, 0.6], [0, -1, 0], 3.2, 5.8, false, 2, 0.04)
    panel(pale, [cx, yb, 6.4], [0, -1, 0], AW - 0.4, 0.6, false, 2, 0.06)
    for (let k = 1; k < 6; k++) {
      const t = (Math.PI * k) / 6
      const a: V3 = [cx + 0.6 * Math.cos(t), yb - 0.06, spring + 0.6 * Math.sin(t)], b: V3 = [cx + (AW / 2) * Math.cos(t), yb - 0.06, spring + (AW / 2) * Math.sin(t)]
      const w = 0.12, nx = -Math.sin(t) * w, nz = Math.cos(t) * w
      quad(pale, [a[0] - nx, a[1], a[2] - nz], [b[0] - nx, b[1], b[2] - nz], [b[0] + nx, b[1], b[2] + nz], [a[0] + nx, a[1], a[2] + nz], [0, -1, 0])
    }
    for (const rr of [AW / 4, AW * 0.38]) {
      const sN2 = seg(6, 12)
      for (let i = 0; i < sN2; i++) {
        const t0 = (Math.PI * i) / sN2, t1 = (Math.PI * (i + 1)) / sN2
        const Q = (t: number, r: number): V3 => [cx + r * Math.cos(t), yb - 0.07, spring + r * Math.sin(t)]
        quad(pale, Q(t1, rr - 0.12), Q(t0, rr - 0.12), Q(t0, rr + 0.12), Q(t1, rr + 0.12), [0, -1, 0])
      }
    }
    // the arch's moulded surround (raised band) and the keystone
    const sN = seg(8, 14)
    for (let i = 0; i < sN; i++) {
      const t0 = (Math.PI * i) / sN, t1 = (Math.PI * (i + 1)) / sN, r0 = AW / 2, r1 = AW / 2 + 0.9
      const Q = (t: number, r: number): V3 => [cx + r * Math.cos(t), y0 - 0.2, spring + r * Math.sin(t)]
      quad(pale, Q(t1, r0), Q(t0, r0), Q(t0, r1), Q(t1, r1), [0, -1, 0])
    }
    box(pale, pale, cx - 0.6, cx + 0.6, y0 - 0.45, y0, spring + AW / 2 - 0.2, spring + AW / 2 + 1.6)
    // the columns flanking the arch
    for (const s of [-1, 1]) {
      lathe(pale, cx + s * (AW / 2 + 0.6), y0 - 0.5, [[0.55, 0], [0.55, 1.0], [0.42, 1.2], [0.42, spring - 0.6], [0.6, spring - 0.2], [0.6, spring]], seg(8, 12))
      // statue niches with the figures in relief
      const nx = cx + s * 7.6
      panel(pale, [nx, y0, 8.5], [0, -1, 0], 3.0, 5.8, 'round', seg(4, 8), 0.06) // the niche's frame
      panel(pink, [nx, y0, 8.7], [0, -1, 0], 2.3, 5.2, 'round', seg(4, 8), 0.1) // the niche
      panel(trim, [nx, y0, 8.4], [0, -1, 0], 3.0, 0.4, false, 2, 0.1)
      box(pale, pale, nx - 0.55, nx + 0.55, y0 - 0.4, y0 - 0.05, 8.8, 12.6) // the figure
      lathe(pale, nx, y0 - 0.2, [[0.3, 12.6], [0.32, 13.0], [0, 13.4]], 6, { smooth: true })
      panel(trim, [nx, y0, 2.0], [0, -1, 0], 2.6, 4.4, false, 2, 0.06) // the panel under it
    }
    // the attic: a raised block with its inscription band, cornice and crest
    box(trim, trim, x0 - 0.5, x1 + 0.5, y0 - 0.5, y1, H, H + 0.6, 0.2)
    box(pink, null, x0 + 0.6, x1 - 0.6, y0 + 0.1, y1, H + 0.6, H + 2.0)
    panel(trim, [cx, y0 + 0.1, H + 0.8], [0, -1, 0], x1 - x0 - 3, 1.0, false, 2, 0.06)
    box(trim, roof, x0 + 0.3, x1 - 0.3, y0 - 0.2, y1, H + 2.0, H + 2.4, 0.2)
    face(roof, [[x0, y0, H], [x1, y0, H], [x1, y1, H], [x0, y1, H]], Z)
  }

  // ── The dome over the rotunda, behind the pavilion: a drum, the low dome
  // and its lantern.
  {
    const [dx, dy] = L(2.4, -58.4), R = 9.4
    lathe(pink, dx, dy, [[R, PARA], [R, 22.0], [R + 0.4, 22.2], [R + 0.4, 22.6], [R, 22.7]], seg(16, 32), { facet: !detail })
    for (let i = 0; i < 12; i += detail ? 1 : 2) {
      const t = (TAU * (i + 0.5)) / 12
      panel(win, [dx + R * Math.cos(t), dy + R * Math.sin(t), 18.6], [Math.cos(t), Math.sin(t), 0], 1.4, 2.6, 'round', 4, 0.06)
    }
    dome(pink, dx, dy, R, 22.7, 6.0, seg(16, 32), seg(4, 8))
    lathe(trim, dx, dy, [[1.4, 28.4], [1.4, 30.2], [1.7, 30.4], [0.6, 31.4], [0, 31.8]], seg(8, 12), { smooth: false })
  }

  const lit = (base: number) => (p: V3, n: V3): number => (n[2] > 0.85 ? 0.35 : 1) * base * (p[2] < 22 ? 1 : 0.6)
  return [
    { part: pink, material: { ...finish('cairo-museum-terracotta', 0xc56a47), floodlight: lit(0.9) } },
    { part: trim, material: { ...finish('cairo-museum-terracotta-light', 0xdc9a78), floodlight: lit(0.9) } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
    { part: pale, material: { ...finish('cairo-museum-pale-stone', 0xe4d6c0), floodlight: lit(0.9) } },
  ]
}

/** A semicircle (as a fan) over a springing line at z, radius r, centred at x; facing -y at plane y. */
function archRing(cx: number, y: number, r: number, z: number, segs: number): V3[] {
  const pts: V3[] = [[cx - r, y, z], [cx + r, y, z]]
  for (let i = 1; i < segs; i++) {
    const t = (Math.PI * i) / segs
    pts.push([cx + r * Math.cos(t), y, z + r * Math.sin(t)])
  }
  return pts
}

if (import.meta.main) {
  const extras = { bearing: 0, osm: 'way/10873198', height: 31.8 }
  // one model: the full set of facade details fits the low budget
  await save('cairo-egyptian-museum.glb', 'Egyptian Museum', build(true), 5000, 250_000, extras)
}
