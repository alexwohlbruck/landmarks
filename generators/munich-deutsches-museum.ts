/**
 * Deutsches Museum on the Museumsinsel (Gabriel von Seidl, Sammlungsbau
 * 1906-25; Oswald Bieber and German Bestelmeyer, library 1932 and
 * Kongressbau 1935; Sep Ruf, aeronautics hall 1984), Munich: original
 * procedural geometry, CC0-1.0.
 * bun generators/munich-deutsches-museum.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * anchor. Anchor = area centroid (courts subtracted) of OSM relation/3866522
 * (building=museum): 48.1297894, 11.5830455. Bearing 52: the island's and
 * the buildings' long axis (the dominant edge direction of the outline, OSM),
 * so model +y runs north-east along the island, +x south-east across it; the
 * Isar's main arm and the Ludwigsbrücke side are at -x.
 *
 * What is modelled, south-west to north-east: the Zentrum Neue Technologien
 * with its tall glazed bays and the white interim entrance box at the island's
 * tip; the aeronautics hall behind it; the tower (Museumsturm) with its
 * open belvedere, clock-barometer dial and mast, and the green-roofed
 * entrance porch at its foot; the Sammlungsbau, four storeys round its
 * covered courts, slate roofs, with the two observatory towers and their
 * copper domes at the north corners; the central hall with its copper dome
 * over the Ehrenhof; the Ehrenhof's side wings (the curved south-east one
 * included); the Bibliotheksbau, round two courts, copper roofs, with its
 * raised clock front on the Ehrenhof; and the Kongressbau (now Forum der
 * Zukunft, OSM way/30046693, a separate building, included as asked), with
 * its copper roof. Left to the map: the Isar, the quays and bridges, the
 * lifeboat "Theodor Heuss" and the patent offices across the river.
 *
 * Evidence
 *  - OSM (ODbL): relation/3866522 (outline, 4 courts) and its parts:
 *    relation/11809799 Sammlungsbau (4 levels, gabled), 7293787, 7293788 (court
 *    halls, 1 level), 7293789 (3 levels), 11809800 (central hall, 5 levels,
 *    round north end), way/867308786 (its round dome), way/865229092 and
 *    865229093 (West- and Ost-Sternwarte, 5 levels, domes), relation/11809716
 *    Museumsturm (height 65), way/867309371 (the round-roofed porch),
 *    relation/11809718 (2 levels), 11809719 Halle für Luft- und Raumfahrt
 *    (flat), 11809717 Zentrum Neue Technologien (2 levels, hipped),
 *    way/1077052062 Interimseingang (3 levels, flat), relation/11809538 (3
 *    levels), 11809537 (2 levels, curved), 11809536 (3 levels, hipped),
 *    11809510 Bibliotheksbau (4 levels, two courts); way/30046693 Forum der
 *    Zukunft (5 levels, height 25). Every plan dimension is from these.
 *  - Published: de.wikipedia "Deutsches Museum" (dates, architects, the
 *    reinforced-concrete Sammlungsbau); tower height 65 m from OSM, read
 *    here as the mast's tip (see below).
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - Carsten Steger, "Aerial image of the Deutsches Museum Munich.jpg" and
 *      "(cropped to building)", CC BY-SA 4.0: the whole complex from the
 *      west; roof colours (slate grey Sammlungsbau, pale copper library and
 *      Kongressbau, copper domes), the tower's belvedere, the porch.
 *      https://commons.wikimedia.org/wiki/File:Aerial_image_of_the_Deutsches_Museum_Munich.jpg
 *    - Julian Herzog, "Deutsches Museum Munich 2014 01.jpg", CC BY 4.0: the
 *      river front of the Sammlungsbau and the tower (tower about 4.3 widths
 *      to the parapet, the belvedere's three arches, the dial).
 *      https://commons.wikimedia.org/wiki/File:Deutsches_Museum_Munich_2014_01.jpg
 *    - Tiia Monto, "Deutsches Museum - Isar.jpg", CC BY 4.0: the south-west
 *      front, porch, Zentrum Neue Technologien's glazed bays, the white box.
 *      https://commons.wikimedia.org/wiki/File:Deutsches_Museum_-_Isar.jpg
 *    - Flocci Nivis, "20230410 Deutsches Museum 01.jpg" and "02", CC BY 4.0.
 *      https://commons.wikimedia.org/wiki/File:20230410_Deutsches_Museum_01.jpg
 *    - Martin Falbisoner, "Deutsches Museum in the Evening.JPG", CC BY-SA 4.0:
 *      the night look (the tower floodlit, windows mostly dark).
 *      https://commons.wikimedia.org/wiki/File:Deutsches_Museum_in_the_Evening.JPG
 *    - Burkhard Mücke, "Deutsches Museum Portrait 4.jpg", CC BY-SA 4.0.
 *      https://commons.wikimedia.org/wiki/File:Deutsches_Museum_Portrait_4.jpg
 *  No look-only sources, no commercial imagery, no LoD2 city model. No lidar
 *  in Germany.
 *
 * Numbers: plans measured from OSM, simplified to their main rectangles
 * (jogs under 3 m dropped). Heights estimated from the photos, scaled by OSM
 * widths: tower parapet 52 m (4.3 x its 12 m width), mast to 63 m (OSM's 65
 * read as the mast tip); Sammlungsbau eaves 21 m, ridge 27 m; library eaves
 * 20 m, ridge 25 m, clock front 27 m; Kongressbau 25 m (OSM) to its roof's
 * crown; observatories drum 26 m, dome to 31 m; central dome to 33 m; ZNT
 * eaves 17 m; aeronautics hall 20 m; porch 7 m walls under a 13.7 m vault.
 * Simplified or left out: the Sammlungsbau's courts are drawn as their OSM
 * hall roofs, its ground-floor loggias as windows; dormers, statues, the
 * Kongressbau's portico detail and lettering are left out; the Ehrenhof's
 * curved wing is a polygon of its OSM curve.
 * Ground: the map's terrain puts y = 0 at the quay's foot by the river (0.8 m
 * above the table's lowest point) while the island inside stands 6.4 to 7.2 m
 * higher; every feature is drawn 6 m up (G), with the walls run down to y = 0
 * as the quay walls and the buried plinth. Elevation 0.
 * Night: windows glow (the real museum's are mostly dark after hours); the
 * tower is floodlit, as in the evening photo.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const ID = 'munich-deutsches-museum'
/** The island's ground above the model's y = 0 (Mapterhorn: 6.4-7.2 m inside, 0.8 m at the quays). */
const G = 6
type XY = [number, number]

const stone = new Part(), trim = new Part(), slate = new Part(), copper = new Part(), win = new Part(), tower = new Part()

// ---------------------------------------------------------------------------
// Primitives

/** Walls of a counter-clockwise ring from z0 to z1, and a fan cap (convex rings). */
function prism(p: Part, r: XY[], z0: number, z1: number, cap = true) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (cap) for (let i = 1; i < r.length - 1; i++) p.tri([r[0][0], r[0][1], z1], [r[i][0], r[i][1], z1], [r[i + 1][0], r[i + 1][1], z1])
}
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const circle = (cx: number, cy: number, r: number, n = 16): XY[] =>
  Array.from({ length: n }, (_, k) => [cx + r * Math.cos((2 * Math.PI * k) / n), cy + r * Math.sin((2 * Math.PI * k) / n)] as XY)

/** A hipped roof over a rectangle: eaves at z0 (with overhang o), ridge/apex at z1. */
function hip(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, o = 0.6) {
  x0 -= o; x1 += o; y0 -= o; y1 += o
  const w = x1 - x0, l = y1 - y0
  const a: V3 = [x0, y0, z0], b: V3 = [x1, y0, z0], c: V3 = [x1, y1, z0], d: V3 = [x0, y1, z0]
  const half = Math.min(w, l) / 2
  if (Math.abs(w - l) < 0.5) {
    const t: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, z1]
    p.tri(a, b, t); p.tri(b, c, t); p.tri(c, d, t); p.tri(d, a, t)
  } else if (l > w) {
    const r0: V3 = [(x0 + x1) / 2, y0 + half, z1], r1: V3 = [(x0 + x1) / 2, y1 - half, z1]
    p.tri(a, b, r0); p.quad(b, c, r1, r0); p.tri(c, d, r1); p.quad(d, a, r0, r1)
  } else {
    const r0: V3 = [x0 + half, (y0 + y1) / 2, z1], r1: V3 = [x1 - half, (y0 + y1) / 2, z1]
    p.quad(a, b, r1, r0); p.tri(b, c, r1); p.quad(c, d, r0, r1); p.tri(d, a, r0)
  }
  p.quad(d, c, b, a)
}
/** A truncated hip: slopes rising `rise` over `run` from the eaves, then flat (wide blocks). */
function hipFlat(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, run: number, rise: number, flatPart: Part, o = 0.6) {
  x0 -= o; x1 += o; y0 -= o; y1 += o
  const lo = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(([x, y]) => [x, y, z0] as V3)
  const hi = [[x0 + run, y0 + run], [x1 - run, y0 + run], [x1 - run, y1 - run], [x0 + run, y1 - run]].map(([x, y]) => [x, y, z0 + rise] as V3)
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; p.quad(lo[i], lo[j], hi[j], hi[i]) }
  flatPart.quad(hi[0], hi[1], hi[2], hi[3])
  p.quad(lo[3], lo[2], lo[1], lo[0])
}
/** A dome (quarter-circle profile) on a circle: base radius r at z0, height h. */
function dome(p: Part, cx: number, cy: number, r: number, z0: number, h: number, n = 16, rings = 4) {
  for (let k = 0; k < rings; k++) {
    const a0 = (Math.PI / 2) * (k / rings), a1 = (Math.PI / 2) * ((k + 1) / rings)
    const r0 = r * Math.cos(a0), r1 = r * Math.cos(a1), z_0 = z0 + h * Math.sin(a0), z_1 = z0 + h * Math.sin(a1)
    for (let i = 0; i < n; i++) {
      const t0 = (2 * Math.PI * i) / n, t1 = (2 * Math.PI * (i + 1)) / n
      const P = (rr: number, t: number, z: number): V3 => [cx + rr * Math.cos(t), cy + rr * Math.sin(t), z]
      const nn = (a: number, t: number): V3 => [Math.cos(a) * Math.cos(t) / r, Math.cos(a) * Math.sin(t) / r, Math.sin(a) / h]
      const N = (a: number, t: number): V3 => { const v = nn(a, t), l = Math.hypot(...v); return [v[0] / l, v[1] / l, v[2] / l] }
      if (k === rings - 1) {
        p.tri(P(r0, t0, z_0), P(r0, t1, z_0), [cx, cy, z_1], undefined, undefined, undefined, [N(a0, t0), N(a0, t1), [0, 0, 1]])
      } else {
        p.tri(P(r0, t0, z_0), P(r0, t1, z_0), P(r1, t1, z_1), undefined, undefined, undefined, [N(a0, t0), N(a0, t1), N(a1, t1)])
        p.tri(P(r0, t0, z_0), P(r1, t1, z_1), P(r1, t0, z_1), undefined, undefined, undefined, [N(a0, t0), N(a1, t1), N(a1, t0)])
      }
    }
  }
}

type Face = 'e' | 'w' | 'n' | 's'
function onFace(x0: number, x1: number, y0: number, y1: number, f: Face, d = 0.05) {
  switch (f) {
    case 'e': return { len: y1 - y0, at: (u: number, z: number): V3 => [x1 + d, y0 + u, z] }
    case 'w': return { len: y1 - y0, at: (u: number, z: number): V3 => [x0 - d, y1 - u, z] }
    case 'n': return { len: x1 - x0, at: (u: number, z: number): V3 => [x1 - u, y1 + d, z] }
    case 's': return { len: x1 - x0, at: (u: number, z: number): V3 => [x0 + u, y0 - d, z] }
  }
}
function panel(p: Part, at: (u: number, z: number) => V3, u0: number, u1: number, z0: number, z1: number, arched = false) {
  if (!arched) { p.quad(at(u0, z0), at(u1, z0), at(u1, z1), at(u0, z1)); return }
  const r = (u1 - u0) / 2, zs = z1 - r, um = (u0 + u1) / 2
  p.quad(at(u0, z0), at(u1, z0), at(u1, zs), at(u0, zs))
  for (let k = 0; k < 8; k++) {
    const a0 = (Math.PI * k) / 8, a1 = (Math.PI * (k + 1)) / 8
    p.tri(at(um, zs), at(um + r * Math.cos(a0), zs + r * Math.sin(a0)), at(um + r * Math.cos(a1), zs + r * Math.sin(a1)))
  }
}
type Row = { z0: number; z1: number; w: number; arched?: boolean }
/** Window panels in bays of about `bay` metres across the given faces. */
function windows(b: Box, faces: Face[], bay: number, rows: Row[], margin = 1.5, skip?: (f: Face, u: number) => boolean) {
  for (const f of faces) {
    const { len, at } = onFace(b.x0, b.x1, b.y0, b.y1, f)
    const n = Math.max(1, Math.round((len - 2 * margin) / bay)), bw = (len - 2 * margin) / n
    for (let i = 0; i < n; i++) {
      const uc = margin + bw * (i + 0.5)
      if (skip?.(f, uc)) continue
      for (const r of rows) panel(win, at, uc - Math.min(r.w, bw * 0.7) / 2, uc + Math.min(r.w, bw * 0.7) / 2, r.z0, r.z1, r.arched)
    }
  }
}
type Box = { x0: number; x1: number; y0: number; y1: number }
/** A wing: walls to the eaves, a cornice, a hipped roof. */
function wing(b: Box, eaves: number, ridge: number, roof: Part, faces: Face[], rows: Row[], bay = 3.8) {
  prism(stone, rect(b.x0, b.x1, b.y0, b.y1), 0, eaves, false)
  prism(trim, rect(b.x0 - 0.4, b.x1 + 0.4, b.y0 - 0.4, b.y1 + 0.4), eaves - 0.7, eaves, false)
  hip(roof, b.x0, b.x1, b.y0, b.y1, eaves, ridge, 0.5)
  windows(b, faces, bay, rows)
}

// Storey rows, grouped: the ground floor, then two storeys to a panel.
const SAMMLUNG: Row[] = [{ z0: 1.6, z1: 4.6, w: 1.8 }, { z0: 6.4, z1: 12.4, w: 1.9 }, { z0: 14.0, z1: 19.2, w: 1.9 }]
const LIB: Row[] = [{ z0: 1.6, z1: 4.6, w: 1.6 }, { z0: 6.2, z1: 11.8, w: 1.7 }, { z0: 13.2, z1: 18.4, w: 1.7 }]
const LOW2: Row[] = [{ z0: 1.6, z1: 4.6, w: 1.6 }, { z0: 6.2, z1: 10.0, w: 1.7 }]

function build() {
  // --- Sammlungsbau: four wings round the covered courts
  const E = 21, R = 27
  wing({ x0: -40.8, x1: -22.3, y0: -64.6, y1: 28.2 }, E, R, slate, ['w'], SAMMLUNG)
  wing({ x0: 36.1, x1: 53.1, y0: -64.6, y1: 28.2 }, E, R, slate, ['e'], SAMMLUNG)
  wing({ x0: -22.3, x1: 36.1, y0: -64.6, y1: -48.0 }, E, R, slate, [], SAMMLUNG)
  wing({ x0: -22.3, x1: 36.1, y0: 12.3, y1: 28.2 }, E, R, slate, ['n'], SAMMLUNG)
  // the court halls (OSM 7293787-89)
  hip(slate, -22.0, -8.6, -47.8, 12.2, 12, 16, 0)
  prism(stone, rect(-22.0, -8.6, -47.8, 12.2), 0, 12, false)
  hip(slate, 22.2, 36.1, -48.0, 13.3, 12, 16, 0)
  prism(stone, rect(22.2, 36.1, -48.0, 13.3), 0, 12, false)
  wing({ x0: -8.6, x1: 22.2, y0: -48.0, y1: 5.1 }, 18, 26, slate, [], [])
  // central hall (OSM 11809800): a block with a round north end, 24 m, and its copper dome
  const hall: XY[] = [[-4.2, 5.0], [17.1, 5.1], [16.2, 28.1], ...Array.from({ length: 9 }, (_, k) => {
    const t = (Math.PI * k) / 8
    return [6.45 + 10.3 * Math.cos(t), 30.4 + 10.3 * Math.sin(t)] as XY
  }).slice(0, 9), [-3.9, 28.4]]
  prism(stone, hall, 0, 24)
  prism(trim, circle(6.5, 27.0, 6.6, 16), 24, 28.5)
  dome(copper, 6.5, 27.0, 6.6, 28.5, 4.8)
    // observatory towers with copper domes
  for (const [cx, cy, r] of [[-44.8, 19.4, 5.8], [60.6, 24.2, 4.6]] as [number, number, number][]) {
    prism(stone, circle(cx, cy, r, 16), 0, 26)
    prism(trim, circle(cx, cy, r + 0.4, 16), 25.3, 26.1, false)
    dome(copper, cx, cy, r, 26, r * 0.95)
    const ring = 12
    for (let k = 0; k < ring; k++) {
      const t = (2 * Math.PI * (k + 0.5)) / ring
      for (const [z0, z1] of [[13.8, 17.6], [19.5, 23.2]]) {
        const P = (dt: number, z: number): V3 => [cx + (r + 0.05) * Math.cos(t + dt), cy + (r + 0.05) * Math.sin(t + dt), z]
        win.quad(P(-0.1, z0), P(0.1, z0), P(0.1, z1), P(-0.1, z1))
      }
    }
  }

  // --- The tower (OSM 11809716): x -49.5..-38.0, y -69.5..-57.3
  const T = { x0: -49.5, x1: -38.0, y0: -69.5, y1: -57.3 }
  const tc: XY = [(T.x0 + T.x1) / 2, (T.y0 + T.y1) / 2]
  prism(tower, rect(T.x0, T.x1, T.y0, T.y1), 0, 41.5, false)
  prism(tower, rect(T.x0 - 0.6, T.x1 + 0.6, T.y0 - 0.6, T.y1 + 0.6), 41.5, 42.5) // balcony slab under the belvedere
  // belvedere: four corner piers, a recessed core, three arched openings a face
  prism(tower, rect(T.x0 + 1.2, T.x1 - 1.2, T.y0 + 1.2, T.y1 - 1.2), 42.5, 49.5, false)
  for (const [x, y] of [[T.x0, T.y0], [T.x1 - 1.6, T.y0], [T.x1 - 1.6, T.y1 - 1.6], [T.x0, T.y1 - 1.6]]) prism(tower, rect(x, x + 1.6, y, y + 1.6), 42.5, 49.5)
  for (const f of ['e', 'w', 'n', 's'] as Face[]) {
    const { len, at } = onFace(T.x0 + 1.2, T.x1 - 1.2, T.y0 + 1.2, T.y1 - 1.2, f)
    for (let i = 0; i < 3; i++) { const uc = (len * (i + 0.5)) / 3; panel(win, at, uc - 1.0, uc + 1.0, 43.2, 48.4, true) }
  }
  prism(tower, rect(T.x0 - 0.4, T.x1 + 0.4, T.y0 - 0.4, T.y1 + 0.4), 49.5, 52.0)
  prism(trim, rect(T.x0 + 2.5, T.x1 - 2.5, T.y0 + 2.5, T.y1 - 2.5), 52.0, 53.2)
  prism(trim, circle(tc[0], tc[1], 0.35, 6), 53.2, 63.0) // the mast
  prism(trim, rect(tc[0] - 1.6, tc[0] + 1.6, tc[1] - 0.12, tc[1] + 0.12), 58.5, 58.8) // its yard
  // the clock-barometer dial on the river (west) and court (south) faces, and slit windows
  for (const f of ['w', 'n'] as Face[]) {
    const { len, at } = onFace(T.x0, T.x1, T.y0, T.y1, f)
    const zc = 34.5, R0 = 2.6
    for (let k = 0; k < 16; k++) {
      const a0 = (2 * Math.PI * k) / 16, a1 = (2 * Math.PI * (k + 1)) / 16
      win.tri(at(len / 2, zc), at(len / 2 + R0 * Math.cos(a0), zc + R0 * Math.sin(a0)), at(len / 2 + R0 * Math.cos(a1), zc + R0 * Math.sin(a1)))
    }
    panel(win, at, len / 2 - 0.5, len / 2 + 0.5, 12, 30)
  }
  for (const f of ['e', 's'] as Face[]) {
    const { len, at } = onFace(T.x0, T.x1, T.y0, T.y1, f)
    panel(win, at, len / 2 - 0.5, len / 2 + 0.5, 12, 38)
  }
  // the porch: barrel vault over the entrance, axis across the front (along x)
  {
    const x0 = -59.9, x1 = -49.5, y0 = -70.0, y1 = -56.7, zw = 7, r = (y1 - y0) / 2, yc = (y0 + y1) / 2, n = 10
    prism(stone, rect(x0, x1, y0, y1), 0, zw, false)
    for (let k = 0; k < n; k++) {
      const a0 = (Math.PI * k) / n, a1 = (Math.PI * (k + 1)) / n
      const P = (x: number, a: number): V3 => [x, yc + (r + 0.4) * Math.cos(a), zw + r * Math.sin(a)]
      const N = (a: number): V3 => [0, Math.cos(a), Math.sin(a)]
      copper.tri(P(x0 - 0.4, a0), P(x0 - 0.4, a1), P(x1, a1), undefined, undefined, undefined, [N(a0), N(a1), N(a1)])
      copper.tri(P(x0 - 0.4, a0), P(x1, a1), P(x1, a0), undefined, undefined, undefined, [N(a0), N(a1), N(a0)])
      const Q = (a: number): V3 => [x0, yc + r * Math.cos(a), zw + r * Math.sin(a)]
      stone.tri([x0, yc, zw], Q(a1), Q(a0))
    }
    const { at } = onFace(x0, x1, y0, y1, 'w')
    panel(win, at, r - 4.2, r + 4.2, zw + 0.6, zw + 4.6, true) // the lunette
    panel(win, at, r - 2.0, r + 2.0, 0.2, 5.6, true) // the doorway
    for (const u of [2.0, 2 * r - 2.0]) panel(win, at, u - 1.0, u + 1.0, 0.2, 5.0, true)
  }

  // --- South-west: 11809718, the aeronautics hall, the ZNT and the interim entrance
  wing({ x0: -47.6, x1: -31.6, y0: -104.6, y1: -69.6 }, 12, 16, slate, ['w'], LOW2)
  prism(stone, rect(-31.6, 39.0, -113.2, -64.6), 0, 19.5, false)
  prism(slate, rect(-31.6, 39.0, -113.2, -64.6), 19.4, 19.5, true) // the flat roof
  prism(trim, rect(-31.9, 39.3, -113.5, -64.3), 18.8, 19.9, false)
  windows({ x0: -31.6, x1: 39, y0: -113.2, y1: -64.6 }, ['e'], 7, [{ z0: 2, z1: 17, w: 4.2 }])
  // ZNT: a tall hall with five glazed bays between stone piers on the river front
  {
    const b = { x0: -49.8, x1: -17.4, y0: -167.1, y1: -104.6 }
    prism(stone, rect(b.x0, b.x1, b.y0, b.y1), 0, 17, false)
    prism(trim, rect(b.x0 - 0.4, b.x1 + 0.4, b.y0 - 0.4, b.y1 + 0.4), 16.3, 17, false)
    hipFlat(slate, b.x0, b.x1, b.y0, b.y1, 17, 6, 3.5, slate, 0.5)
    windows(b, ['w', 's'], 7.5, [{ z0: 0.4, z1: 15.2, w: 5.2 }], 2.5)
    windows(b, ['e'], 4, [{ z0: 2, z1: 6, w: 2 }, { z0: 8.5, z1: 14.5, w: 2.2 }])
  }
  // the interim entrance: a white translucent-looking box at the tip
  prism(trim, [[-58.0, -172.6], [-48.6, -168.6], [-48.9, -133.0], [-58.8, -134.0]], 0, 14.5)

  // --- The Ehrenhof wings
  wing({ x0: -42.3, x1: -27.0, y0: 28.2, y1: 87.2 }, 17, 22, slate, ['w', 'e'], LOW2.concat([{ z0: 11.8, z1: 15.2, w: 1.7 }]))
  {
    // the curved south-east wing (OSM 11809537): its outer and inner curve, 2 levels
    const outer: XY[] = [[55.9, 77.6], [59.4, 67.1], [61.9, 54.0], [63.4, 40.6], [63.7, 28.6]]
    const inner: XY[] = [[46.1, 32.8], [46.0, 43.1], [44.8, 53.9], [42.4, 65.4], [39.7, 72.8]]
    // walls: outer curve, inner curve and the ends, as a strip of quads
    const zE = 11.5, zR = 15
    const o = [...outer].reverse() // from y 28.6 up to 77.6
    const iN = inner // from y 32.8 to 72.8
    for (let k = 0; k < o.length - 1; k++) {
      const a = o[k], b2 = o[k + 1], c = iN[k], d = iN[k + 1]
      stone.quad([a[0], a[1], 0], [b2[0], b2[1], 0], [b2[0], b2[1], zE], [a[0], a[1], zE])
      stone.quad([d[0], d[1], 0], [c[0], c[1], 0], [c[0], c[1], zE], [d[0], d[1], zE])
      const ma: V3 = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2, zR], mb: V3 = [(b2[0] + d[0]) / 2, (b2[1] + d[1]) / 2, zR]
      copper.quad([a[0], a[1], zE], [b2[0], b2[1], zE], mb, ma)
      copper.quad([d[0], d[1], zE], [c[0], c[1], zE], ma, mb)
      const at = (p: XY, q: XY, out: number) => (u: number, z: number): V3 => {
        const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy)
        return [p[0] + (dx / l) * u + (dy / l) * out, p[1] + (dy / l) * u - (dx / l) * out, z]
      }
      const L = Math.hypot(b2[0] - a[0], b2[1] - a[1])
      for (let u = 1.8; u < L - 1; u += 3.8) for (const r of LOW2) panel(win, at(a, b2, 0.05), u - 0.8, u + 0.8, r.z0, r.z1)
    }
    const s0 = o[0], s1 = iN[0], e0 = o[o.length - 1], e1 = iN[iN.length - 1]
    stone.quad([s1[0], s1[1], 0], [s0[0], s0[1], 0], [s0[0], s0[1], zE], [s1[0], s1[1], zE])
    stone.quad([e0[0], e0[1], 0], [e1[0], e1[1], 0], [e1[0], e1[1], zE], [e0[0], e0[1], zE])
  }
  wing({ x0: 36.5, x1: 54.5, y0: 76.5, y1: 92.0 }, 16, 21, copper, [], [])

  // --- The library: round two courts, copper roofs, a raised clock front on the Ehrenhof
  const LE = 20, LR = 25
  wing({ x0: -41.6, x1: -25.4, y0: 93.5, y1: 194.4 }, LE, LR, copper, ['w'], LIB)
  wing({ x0: 11.0, x1: 27.0, y0: 93.8, y1: 194.4 }, LE, LR, copper, ['e'], LIB)
  wing({ x0: -25.4, x1: 11.0, y0: 93.6, y1: 109.0 }, LE, LR, copper, ['s'], LIB)
  wing({ x0: -25.4, x1: 11.0, y0: 138.1, y1: 148.5 }, LE, LR - 1, copper, [], [])
  wing({ x0: -25.4, x1: 11.0, y0: 177.7, y1: 194.4 }, LE, LR, copper, ['n'], LIB)
  wing({ x0: 27.0, x1: 47.5, y0: 92.5, y1: 109.6 }, 17, 21.5, copper, ['e', 's'], LOW2)
  {
    // the clock front: a raised centre bay on the south (Ehrenhof) face
    const b = { x0: -14.5, x1: 0.5, y0: 92.6, y1: 101 }
    prism(stone, rect(b.x0, b.x1, b.y0, b.y1), 0, 27)
    prism(trim, rect(b.x0 - 0.4, b.x1 + 0.4, b.y0 - 0.4, b.y1 + 0.4), 26.3, 27.4)
    const { len, at } = onFace(b.x0, b.x1, b.y0, b.y1, 's')
    for (let k = 0; k < 16; k++) {
      const a0 = (2 * Math.PI * k) / 16, a1 = (2 * Math.PI * (k + 1)) / 16
      win.tri(at(len / 2, 22), at(len / 2 + 2.6 * Math.cos(a0), 22 + 2.6 * Math.sin(a0)), at(len / 2 + 2.6 * Math.cos(a1), 22 + 2.6 * Math.sin(a1)))
    }
    for (const u of [len / 2 - 4, len / 2, len / 2 + 4]) panel(win, at, u - 1.2, u + 1.2, 1.2, 15.5, true)
  }

  // --- The Kongressbau (Forum der Zukunft, OSM way/30046693), height 25
  {
    const r: XY[] = [[-40.3, 225.1], [3.2, 230.0], [-2.6, 291.3], [-46.5, 287.0]]
    prism(stone, r, 0, 21, false)
    // a low copper hip: inset ring, then flat top
    const c: XY = [-21.5, 258.4]
    const inset = r.map(([x, y]) => [x + (c[0] - x) * 0.18, y + (c[1] - y) * 0.18] as XY)
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4], ai = inset[i], bi = inset[(i + 1) % 4]
      copper.quad([a[0], a[1], 21], [b[0], b[1], 21], [bi[0], bi[1], 25], [ai[0], ai[1], 25])
    }
    copper.quad([inset[0][0], inset[0][1], 25], [inset[1][0], inset[1][1], 25], [inset[2][0], inset[2][1], 25], [inset[3][0], inset[3][1], 25])
    // tall windows down the long sides and the portico front
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const at = (u: number, z: number): V3 => {
        const dx = (b[0] - a[0]) / L, dy = (b[1] - a[1]) / L
        return [a[0] + dx * u + dy * 0.05, a[1] + dy * u - dx * 0.05, z]
      }
      const nb = Math.round((L - 4) / 4.5)
      for (let k = 0; k < nb; k++) { const u = 2 + ((L - 4) * (k + 0.5)) / nb; panel(win, at, u - 1.1, u + 1.1, 2, 9.5); panel(win, at, u - 1.1, u + 1.1, 11.5, 18.5) }
    }
  }

  const lit = (_p: V3, n: V3) => (n[2] > 0.6 ? 0 : 0.9)
  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: stone, material: finish('museum-stone', 0xddd6c8) },
    { part: tower, material: { ...finish('museum-tower', 0xd2cdc2), floodlight: lit } },
    { part: trim, material: { ...PALETTE.trim, color: 0xf1ede4 } },
    { part: slate, material: { ...PALETTE.roof, color: 0x878e95 } },
    { part: copper, material: { ...PALETTE.copper, color: 0x8fb19c } },
    { part: win, material: PALETTE.window },
  ]
  // Everything stands on the island's ground, G above the lowest point under
  // the footprint (the river's edge, where the quay walls run down): lift all
  // but the walls' feet.
  for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) if (part.pos[i] > 1e-3) part.pos[i] += G
  return parts.filter((x) => x.part.triangles > 0)
}

if (import.meta.main) {
  const parts = build()
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (parts.length > 6) throw new Error(`${parts.length} materials`)
  const glb = writeGlb('Deutsches Museum', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    anchor: [48.1297894, 11.5830455], bearing: 52, elevation: 0,
  })
  if (triangles > 6500 || glb.length > 250_000) throw new Error(`budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
  const out = new URL(`../models/${ID}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
