/**
 * Royal Palace (Koninklijk Paleis, Paleis op de Dam), Amsterdam — procedural,
 * CC0-1.0, no textures.
 * bun generators/amsterdam-royal-palace.ts
 *
 * Jacob van Campen's town hall of 1648–1665, a royal palace since 1808.
 *
 * Map frame: x = model east, y = model north, z up, metres. The Dam front
 * faces +x (east), the Nieuwezijds Voorburgwal rear faces −x. Placed at
 * bearing 1.5°, the outline's long walls. Anchor: area centroid of the OSM
 * multipolygon relation/3580875 (courtyards subtracted).
 *
 * Evidence
 * - OSM relation/3580875 (outline: 80 m along the Dam, 56 m deep, central
 *   projections of 5 m front and rear, two inner courtyards about 20 × 12 m)
 *   and its building:parts: wing roofs 748659172–183 (height 30, roof 5 m,
 *   courtyard skillions 23 m), corner pavilions 748659184–187 (pyramidal,
 *   31 m), the cupola 748659171 (dome, 30–45 m, centred about 22 m east of
 *   the middle, i.e. over the Dam wing just behind the front pediment).
 * - Published: 1648–1665, architect Jacob van Campen; Bentheim sandstone,
 *   "originally very light" and cleaned 2005–2009 (nl.wikipedia, Paleis op de
 *   Dam); the bronze figures on the east and west pediments (Peace in front,
 *   Atlas with the globe at the rear, about 6 m: en.wikipedia); the cupola
 *   with its cog-ship weathervane. No published heights were found, so every
 *   height below is photo-scaled.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - Diego Delso, "Palacio Real, Ámsterdam, Países Bajos, 2016-05-30, DD 07-09
 *     HDR.jpg", CC BY-SA 4.0 — the front, straight on, at dusk (floodlit).
 *     https://commons.wikimedia.org/wiki/File:Palacio_Real,_%C3%81msterdam,_Pa%C3%ADses_Bajos,_2016-05-30,_DD_07-09_HDR.jpg
 *   - Zairon, "Amsterdam Paleis op de Dam 1.jpg", CC BY-SA 4.0 — the front from
 *     the south-east in sun. https://commons.wikimedia.org/wiki/File:Amsterdam_Paleis_op_de_Dam_1.jpg
 *   - Zairon, "Amsterdam Paleis op de Dam Turm.jpg", CC BY-SA 4.0 — the cupola.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_Paleis_op_de_Dam_Turm.jpg
 *   - Chris Booms (RCE), "Overzicht Koninklijk Paleis op de Dam met rechts de
 *     Nieuwe Kerk - 20528550", CC BY-SA 4.0 — front from the Dam.
 *     https://commons.wikimedia.org/wiki/File:Overzicht_Koninklijk_Paleis_op_de_Dam_met_rechts_de_Nieuwe_Kerk_-_Amsterdam_-_20528550_-_RCE.jpg
 *   - Chris Booms (RCE), "Overzicht Koninklijk Paleis Amsterdam, zijde
 *     Nieuwezijds Voorburgwal - 20528557", CC BY-SA 4.0 — the rear with Atlas.
 *     https://commons.wikimedia.org/wiki/File:Overzicht_Koninklijk_Paleis_Amsterdam,_zijde_Nieuwezijds_Voorburgwal_-_Amsterdam_-_20528557_-_RCE.jpg
 *   - Chris Booms (RCE), "Gezicht over de daken van het Koninklijk Paleis in
 *     noordwestelijke richting - 20528588", CC BY-SA 4.0 — slate roofs, a
 *     courtyard, chimney stacks. https://commons.wikimedia.org/wiki/File:Gezicht_over_de_daken_van_het_Koninklijk_Paleis_in_noordwestelijke_richting_-_Amsterdam_-_20528588_-_RCE.jpg
 *   - Dietmar Rabich, "Amsterdam (NL), Koninklijk Paleis -- 2015 -- 7193.jpg",
 *     CC BY-SA 4.0 — the rear pediment and Atlas.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_(NL),_Koninklijk_Paleis_--_2015_--_7193.jpg
 *   - Marcelmulder68, "Paleis op de Dam, Nieuwezijds Voorburgwal 147.JPG",
 *     CC BY-SA 3.0 NL — the front in winter light.
 *     https://commons.wikimedia.org/wiki/File:Paleis_op_de_Dam,_Nieuwezijds_Voorburgwal_147.JPG
 *
 * Estimated, from Delso's straight-on front scaled to OSM's 80 m: main
 * cornice 25.3 m, middle cornice 15 m, basement 4.6 m, pediment apex 32 m,
 * roof ridges 30 m (OSM 30), pavilion tops 31 m (OSM 31); the cupola's
 * square base to 31.5 m, the drum to 44.5 m, the dome to 48.2 m, the lantern
 * to 51.3 m, the vane to about 56 m. 21 bays across the front (3 + 4 + 7 +
 * 4 + 3), counted on the photo; the side and rear bay counts are drawn to
 * the same pitch. The courtyards are symmetrical here (OSM's differ by
 * 0.5 m). Chimney positions from Delso and the roof view.
 *
 * Colour: the cleaned sandstone reads warm grey-beige in sun (Zairon), drawn
 * a pale yellowish sandstone; slate roofs blue-grey; copper cupola dome and
 * statues verdigris; vane gilt.
 *
 * Doubts: the side facades (Paleisstraat, Mozes en Aäronstraat) are drawn
 * with the front's rhythm from one oblique photo; the courtyard walls are
 * plain. The cupola's open arches are drawn as dark inset panels.
 *
 * Night: the whole palace is floodlit from the Dam (Delso), so the
 * sandstone carries a floodlight wash, strongest on the front and cupola.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, massing, prism, circle, type XY, spire } from './nyc-570-lexington'
import { block, rectPanel, archPanel, hipRoof, band, dome, figure, discPanel, spread } from './nyc-city-hall'

const stone = new Part(), win = new Part(), roof = new Part(), cu = new Part(), gilt = new Part(), dark = new Part()

// ---------------------------------------------------------------- plan
const FX = 28.0 // front (and rear) wall
const RX = 33.0 // central projections
const RY = 12.7 // their half width
const SY = 39.5 // side walls
const PX0 = 15.5, PX1 = 29.0, PY0 = 27.5, PY1 = 40.6 // corner pavilions (mirrored)
const CX = 10.2, CY0 = 9.5, CY1 = 21.3 // courtyards (mirrored)
const EAVE = 25.3, MID = 15.0, BASE = 4.6

const boxes: [number, number, number, number, number][] = [
  [CX, -SY, FX, SY, EAVE], [-FX, -SY, -CX, SY, EAVE], // Dam and rear wings
  [-FX, CY1, FX, SY, EAVE], [-FX, -SY, FX, -CY1, EAVE], // north and south wings
  [-FX, -CY0, FX, CY0, EAVE], // the middle range (Burgerzaal)
  [FX - 0.1, -RY, RX, RY, EAVE], [-RX, -RY, -FX + 0.1, RY, EAVE], // projections
]
for (const sx of [1, -1]) for (const sy of [1, -1]) {
  const xs = [sx * PX0, sx * PX1].sort((a, b) => a - b), ys = [sy * PY0, sy * PY1].sort((a, b) => a - b)
  boxes.push([xs[0], ys[0], xs[1], ys[1], EAVE])
}
massing({ wall: stone, win: null, roof, boxes, facade: null, bevel: 0.35 })

// Plinth, middle cornice and main cornice bands round the outside.
const outer: XY[] = [
  [PX1, -PY1], [PX1, -PY0], [FX, -PY0], [FX, -RY], [RX, -RY], [RX, RY], [FX, RY], [FX, PY0], [PX1, PY0], [PX1, PY1], [PX0, PY1], [PX0, SY],
  [-PX0, SY], [-PX0, PY1], [-PX1, PY1], [-PX1, PY0], [-FX, PY0], [-FX, RY], [-RX, RY], [-RX, -RY], [-FX, -RY], [-FX, -PY0], [-PX1, -PY0], [-PX1, -PY1],
  [-PX0, -PY1], [-PX0, -SY], [PX0, -SY], [PX0, -PY1],
]
band(stone, outer, 0, 0.9, 0.2)
band(stone, outer, BASE - 0.35, BASE, 0.15)
band(stone, outer, MID - 0.5, MID + 0.3, 0.3)
band(stone, outer, EAVE - 1.1, EAVE - 0.1, 0.55)

// ---------------------------------------------------------------- windows
// Per bay: a basement window, then one tall panel per main storey that
// takes in the big window and the mezzanine window above it (the two read
// as one opening from the Dam).
const ROWS: [number, number][] = [[1.3, 3.7], [5.5, 12.3], [16.1, 22.8]]
function bays(a: XY, b: XY, n: number, margin = 1.2, door = false) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const c = spread(margin, L - margin, n), w = ((L - 2 * margin) / n) * 0.5
  for (const s of c) {
    if (door) archPanel(dark, a, b, s, w * 1.15, 0.9, 4.0)
    else rectPanel(win, a, b, s, w * 0.9, ROWS[0][0], ROWS[0][1])
    rectPanel(win, a, b, s, w, ROWS[1][0], ROWS[1][1])
    rectPanel(win, a, b, s, w, ROWS[2][0], ROWS[2][1])
  }
}
for (const sx of [1, -1]) {
  // A wall a→b on the east side, mirrored to the west with the order swapped so it still faces out.
  const W = (a: XY, b: XY, n: number, m = 1.2, door = false) =>
    sx > 0 ? bays(a, b, n, m, door) : bays([-b[0], b[1]], [-a[0], a[1]], n, m, door)
  W([PX1, -PY1], [PX1, -PY0], 3)
  W([FX, -PY0], [FX, -RY], 4, 0.9)
  W([RX, -RY], [RX, RY], 7, 1.0, sx > 0) // seven arched doors under the Dam front
  W([FX, RY], [FX, PY0], 4, 0.9)
  W([PX1, PY0], [PX1, PY1], 3)
}
// Sides: north and south, three bays on each pavilion and eight between.
for (const sy of [1, -1]) {
  const W = (x0: number, x1: number, y: number, n: number) => (sy > 0 ? bays([x1, y], [x0, y], n) : bays([x0, -y], [x1, -y], n))
  W(PX0, PX1, PY1, 3); W(-PX1, -PX0, PY1, 3); W(-PX0, PX0, SY, 8)
}

// ---------------------------------------------------------------- roofs
// Slate: hipped roofs over the four ranges and the middle, pyramids over
// the corner pavilions, gabled roofs behind the two pediments.
const RISE = 4.8
hipRoof(roof, CX - 0.3, -SY + 0.2, FX - 0.2, SY - 0.2, EAVE, RISE)
hipRoof(roof, -FX + 0.2, -SY + 0.2, -CX + 0.3, SY - 0.2, EAVE, RISE)
hipRoof(roof, -FX + 0.2, CY1 - 0.3, FX - 0.2, SY - 0.2, EAVE, RISE)
hipRoof(roof, -FX + 0.2, -SY + 0.2, FX - 0.2, -CY1 + 0.3, EAVE, RISE)
hipRoof(roof, -FX + 0.2, -CY0 - 0.3, FX - 0.2, CY0 + 0.3, EAVE, RISE)
for (const sx of [1, -1]) for (const sy of [1, -1]) {
  const cx = sx * (PX0 + PX1) / 2, cy = sy * (PY0 + PY1) / 2, h = (PX1 - PX0) / 2 - 0.2
  spire(roof, [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]], EAVE, [cx, cy, 31.2])
}
// Pediments: a stone triangle with a bold raking cornice on each projection,
// and a slate gable roof running back to the wing ridge.
const PED = 32.2
for (const sx of [1, -1]) {
  const x = sx * RX, xb = sx * (CX + 8.9)
  const A: V3 = [x, -RY, EAVE], B: V3 = [x, RY, EAVE], T: V3 = [x, 0, PED]
  if (sx > 0) stone.tri(A, B, T); else stone.tri(B, A, T)
  // raking cornices: a sloped slab along each pediment edge
  for (const sy of [1, -1]) {
    const e0: V3 = [x + sx * 0.6, sy * (RY + 0.4), EAVE - 0.1], e1: V3 = [x + sx * 0.6, 0, PED + 0.55]
    const i0: V3 = [x - sx * 1.2, sy * (RY + 0.4), EAVE - 0.1], i1: V3 = [x - sx * 1.2, 0, PED + 0.55]
    const d0: V3 = [x + sx * 0.6, sy * RY, EAVE - 0.9], d1: V3 = [x + sx * 0.6, 0, PED - 0.4]
    stone.quad(...(orient([e0, e1, i1, i0], [0, 0, 1])))
    stone.quad(...(orient([d0, d1, e1, e0], [sx, 0, 0])))
  }
  // gable roof behind
  const r0: V3 = [x - sx * 1.2, -RY - 0.4, EAVE - 0.1], r1: V3 = [x - sx * 1.2, RY + 0.4, EAVE - 0.1], rt: V3 = [x - sx * 1.2, 0, PED + 0.5]
  const b0: V3 = [xb, -RY - 0.4, EAVE - 0.1], b1: V3 = [xb, RY + 0.4, EAVE - 0.1], bt: V3 = [xb, 0, PED + 0.5]
  roof.quad(...orient([r0, b0, bt, rt], [0, -1, 1]))
  roof.quad(...orient([r1, rt, bt, b1], [0, 1, 1]))
}

/** Reorder a quad so it faces roughly along `dir`. */
function orient(q: [V3, V3, V3, V3] | V3[], dir: V3): [V3, V3, V3, V3] {
  const [a, b, c] = q
  const n = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
  const s = n[0] * dir[0] + n[1] * dir[1] + n[2] * dir[2]
  return (s >= 0 ? [q[0], q[1], q[2], q[3]] : [q[0], q[3], q[2], q[1]]) as [V3, V3, V3, V3]
}

// Chimney stacks along the Dam and rear wings (Delso, the roof view).
for (const sx of [1, -1]) for (const y of [-26, -11.5, 11.5, 26]) {
  const x = sx * 19.1
  block(stone, x - 0.8, y - 0.8, x + 0.8, y + 0.8, EAVE + 2, 31.0)
  block(stone, x - 1.0, y - 1.0, x + 1.0, y + 1.0, 31.0, 31.5)
}
for (const sy of [1, -1]) for (const x of [-6, 6]) {
  const y = sy * 30.4
  block(stone, x - 0.8, y - 0.8, x + 0.8, y + 0.8, EAVE + 2, 31.0)
  block(stone, x - 1.0, y - 1.0, x + 1.0, y + 1.0, 31.0, 31.5)
}

// ---------------------------------------------------------------- statues
// Bronze figures, drawn bold: Peace on the front apex, two figures at the
// front projection's corners, Atlas with the globe astride the rear apex.
figure(cu, RX - 0.6, 0, PED + 0.3, 4.6, { raise: 1 })
for (const sy of [1, -1]) {
  block(stone, RX - 1.6, sy * (RY - 0.6) - 0.7, RX - 0.2, sy * (RY - 0.6) + 0.7, EAVE - 0.1, EAVE + 0.7)
  figure(cu, RX - 0.9, sy * (RY - 0.6), EAVE + 0.7, 3.8, { raise: 0 })
  block(stone, -RX + 0.2, sy * (RY - 0.6) - 0.7, -RX + 1.6, sy * (RY - 0.6) + 0.7, EAVE - 0.1, EAVE + 0.7)
  figure(cu, -RX + 0.9, sy * (RY - 0.6), EAVE + 0.7, 3.8, { raise: 0 })
}
{
  const ax = -RX + 0.8, z0 = PED + 0.3
  figure(cu, ax, 0, z0, 3.6, { raise: 0 })
  // the globe on his shoulders, about 3.4 m across
  const g = 1.75, gz = z0 + 3.6 + g * 0.7
  const rings: V3[][] = []
  for (let k = 0; k <= 6; k++) {
    const t = -Math.PI / 2 + (k / 6) * Math.PI
    rings.push(circle(ax, 0, Math.max(0.01, g * Math.cos(t)), 12).map(([x, y]) => [x, y, gz + g * Math.sin(t)] as V3))
  }
  for (let k = 0; k < 6; k++) for (let i = 0; i < 12; i++) {
    const j = (i + 1) % 12, n = (p: V3): V3 => { const v: V3 = [p[0] - ax, p[1], p[2] - gz]; const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
    const a = rings[k][i], b = rings[k][j], c = rings[k + 1][j], d = rings[k + 1][i]
    if (k > 0) cu.tri(a, b, c, undefined, undefined, undefined, [n(a), n(b), n(c)])
    if (k < 5) cu.tri(a, c, d, undefined, undefined, undefined, [n(a), n(c), n(d)])
  }
}

// ---------------------------------------------------------------- cupola
// Over the Dam wing just behind the pediment (OSM 748659171): a square
// stone base, an octagonal open drum (arches as dark insets, a gilt clock
// on the Dam side), a broad cornice, the copper dome, the lantern and the
// gilt cog-ship vane, all drawn a little bold for the phone view.
{
  const cx = 21.9, cy = 0, B = 5.7
  prism({ wall: stone, win: null, roof: stone, ring: [[cx - B, cy - B], [cx + B, cy - B], [cx + B, cy + B], [cx - B, cy + B]], z0: EAVE + 1, z1: 31.5, facade: null, bevel: 0.25 })
  band(stone, [[cx - B, cy - B], [cx + B, cy - B], [cx + B, cy + B], [cx - B, cy + B]], 30.8, 31.5, 0.3)
  const R = 5.3, oct = circle(cx, cy, R, 8, Math.PI / 8)
  prism({ wall: stone, win: null, roof: null, ring: oct, z0: 31.5, z1: 43.6, facade: null, bevel: 0.15 })
  for (let i = 0; i < 8; i++) {
    const a = oct[i], b = oct[(i + 1) % 8]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    archPanel(dark, a, b, L / 2, L * 0.64, 32.4, 41.4, 0.05)
    // engaged columns at the angles
    const ang = Math.atan2(a[1] - cy, a[0] - cx)
    const px = cx + (R + 0.25) * Math.cos(ang), py = cy + (R + 0.25) * Math.sin(ang)
    prism({ wall: stone, win: null, roof: stone, ring: circle(px, py, 0.5, 6), z0: 31.5, z1: 43.2, facade: null, bevel: 0.05 })
  }
  // clock on the Dam side, in the head of the arch
  discPanel(gilt, [cx + R * Math.cos(-Math.PI / 8), cy + R * Math.sin(-Math.PI / 8)], [cx + R * Math.cos(Math.PI / 8), cy + R * Math.sin(Math.PI / 8)], R * Math.sin(Math.PI / 8), 39.6, 1.2, 0.12, 12)
  const cor = circle(cx, cy, R + 0.95, 8, Math.PI / 8)
  prism({ wall: stone, win: null, roof: stone, ring: cor, z0: 43.2, z1: 44.5, facade: null, bevel: 0.2 })
  dome(cu, cx, cy, R + 0.45, 44.45, 3.7, 16, 5)
  // lantern
  prism({ wall: cu, win: null, roof: null, ring: circle(cx, cy, 1.35, 8, Math.PI / 8), z0: 47.6, z1: 50.2, facade: null, bevel: 0.05 })
  const lo = circle(cx, cy, 1.35, 8, Math.PI / 8)
  for (let i = 0; i < 8; i++) {
    const a = lo[i], b = lo[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    archPanel(dark, a, b, L / 2, L * 0.55, 48.1, 49.7, 0.04, 6)
  }
  dome(cu, cx, cy, 1.6, 50.15, 1.1, 10, 3)
  // gilt finial: stem, orb and the ship vane (a hull and a sail, bold)
  block(gilt, cx - 0.14, cy - 0.14, cx + 0.14, cy + 0.14, 51.1, 53.8)
  prism({ wall: gilt, win: null, roof: gilt, ring: circle(cx, cy, 0.45, 8), z0: 51.6, z1: 52.4, facade: null, bevel: 0.1 })
  const hull: XY[] = [[-1.5, 0], [1.5, 0], [1.1, -0.55], [-1.1, -0.55]]
  const t = 0.2, z = 54.2
  // hull, broadside to the Dam (±y), drawn as a thick plate
  const H = (u: number, v: number, d: number): V3 => [cx + d, cy + u, z + v]
  const plate = (pts: XY[], d0: number, d1: number) => {
    const n = pts.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      gilt.quad(...orient([H(pts[i][0], pts[i][1], d0), H(pts[j][0], pts[j][1], d0), H(pts[j][0], pts[j][1], d1), H(pts[i][0], pts[i][1], d1)], [0, (pts[i][0] + pts[j][0]) / 2, (pts[i][1] + pts[j][1]) / 2]))
    }
    for (let i = 1; i < n - 1; i++) {
      gilt.tri(...(orientT([H(pts[0][0], pts[0][1], d1), H(pts[i][0], pts[i][1], d1), H(pts[i + 1][0], pts[i + 1][1], d1)], [1, 0, 0])))
      gilt.tri(...(orientT([H(pts[0][0], pts[0][1], d0), H(pts[i][0], pts[i][1], d0), H(pts[i + 1][0], pts[i + 1][1], d0)], [-1, 0, 0])))
    }
  }
  plate(hull, -t, t)
  plate([[-0.75, 0], [0.75, 0], [0.6, 1.5], [-0.6, 1.5]], -t * 0.7, t * 0.7)
  block(gilt, cx - 0.09, cy - 0.09, cx + 0.09, cy + 0.09, z, z + 2.0)
}

function orientT(t: [V3, V3, V3], dir: V3): [V3, V3, V3] {
  const [a, b, c] = t
  const n = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
  return n[0] * dir[0] + n[1] * dir[1] + n[2] * dir[2] >= 0 ? [a, b, c] : [a, c, b]
}

// ---------------------------------------------------------------- write
const lit = (p: V3, n: V3): number => {
  if (p[2] > 31) return n[2] > 0.7 ? 0.4 : 0.95
  if (n[2] > 0.7) return 0.15
  return n[0] > 0.5 ? 1 : 0.55
}
finishModel('Royal Palace', 'amsterdam-royal-palace', [
  { part: stone, material: { ...finish('palace-sandstone', 0xdccdab), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: roof, material: finish('palace-slate', 0x8a929c) },
  { part: cu, material: PALETTE.copper },
  { part: gilt, material: finish('palace-gilt', 0xd8b25a) },
  { part: dark, material: { ...PALETTE.window, name: 'window-2', color: 0x55626e } },
], { bearing: 1.5, osm: 'relation/3580875', height: 56.2 }, 6500)
