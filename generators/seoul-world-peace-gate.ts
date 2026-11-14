/**
 * World Peace Gate (세계평화의문, Olympic Park, Songpa-gu; architect Kim
 * Chung-up, completed 31 August 1988 for the Seoul Olympics; the mural of
 * the Four Guardians on the wings' undersides by Baek Geum-nam): original
 * procedural geometry, CC0-1.0.
 * bun generators/seoul-world-peace-gate.ts
 *
 * Note: the brief named Kim Swoo-geun; OSM (architect:en) and the
 * published sources give Kim Chung-up, used here. The gate stands at
 * 127.11540 37.51831 (OSM relation/16563734), not at the approximate point
 * in the brief.
 *
 * Map frame: x east, y north, z up, metres. Anchor = area centroid of OSM
 * relation/16563734 (building=yes, historic=monument, height 24, wikidata
 * Q12621853; outer way/75542638, inner way/1218503075), lng 127.1153972,
 * lat 37.5183104. Bearing 68.8: model +x runs along the line of the two
 * wings (compass 158.8, the outline's long axis), +y through the gate.
 *
 * Identity, in order: the two great wings spreading from the middle, flat
 * on top and deepest at the pylons, their undersides and front faces
 * painted (navy, red and the cream leopard-spotted fields of the Four
 * Guardians mural); the four tall pylons; the white beam between them with
 * the Olympic rings; the concave ends of the wings.
 *
 * Evidence
 *  - Plan (OSM, measured in this frame, made symmetric): the outline is a
 *    rectangle 37 m deep (y +-18.5) whose ends are concave arcs (the wing
 *    tips, x +-30.5 at the corners, +-20.7 at the middle); notches x +-4.4,
 *    |y| 10.6-18.5 on both faces (the gap between the pylons); the inner
 *    way, x +-4.4, y -9..7, is the open passage. The strips between them
 *    (|y| 7.2-10.6) are the beams carrying the rings plates.
 *  - Heights: OSM height 24 (top of the wings). From the level front view
 *    isa6, scaled to that: pylons 4.8 m wide, the gap 8.8 m (OSM), the
 *    wings' soffit 13.5 m at the pylons rising to 22.4 m at the tips, the
 *    white top band 1.6 m, the beam 13.5-16.5 m, the rings plate to 19.8 m,
 *    each ring ~2.3 m across. Pylons 7.9 m deep (OSM notch), at the front
 *    and back of each wing (estimated: lwt shows the front pair; the back
 *    pair is hidden and assumed the same).
 *  - Mural: six columns across each wing from the pylon outward, each split
 *    at mid-height into an upper and a lower field (cream leopard field;
 *    navy over red; red over the figure's pale face; red over navy; the
 *    second cream field; navy to the tip), read from isa6, both wings,
 *    mirrored; flat colours on the front and back faces and the underside.
 *    The figures and leopard spots themselves are left out (no textures).
 *  - Pylons: banded in broad white and grey courses (isa6), the grey ones
 *    set back 0.2 m; four white bands and four grey, not the real fine
 *    striping. The dark slot up each face (isa6).
 *  - The white top band stands 0.3 m proud of the painted faces and runs
 *    round the concave tips, giving the wings their fine edge (isa6, lwt).
 *  - The beam between the pylons (grey, to 15 m), the white plate over it
 *    (to 20.2 m) and the five rings, 3D, in the Olympic colours as far as
 *    six materials allow: blue and black both navy, yellow cream, green the
 *    roof's grey-green, red red (isa6).
 *  - Wing tops: a flat grey-green roof (lwt).
 *  - Photos (EVIDENCE):
 *    - isa6: InSapphoWeTrust (photo by Rachel K. So), "올림픽공원 Olympic
 *      Park, Seoul", Flickr, CC BY-SA 2.0; level, face-on: proportions,
 *      mural bands, rings. https://www.flickr.com/photos/56619626@N05/5678836656
 *    - lwt: Tristan Surtel, "Seoul Olympic Park from Lotte World Tower.jpg",
 *      Wikimedia Commons, CC BY-SA 4.0; high, from the south-west: plan,
 *      wing tops, pylons. https://commons.wikimedia.org/wiki/File:Seoul_Olympic_Park_from_Lotte_World_Tower.jpg
 *    - op2005: M. Öcalan, "Olympic Park Seoul 2005.jpg", Wikimedia Commons,
 *      CC0; from the side. https://commons.wikimedia.org/wiki/File:Olympic_Park_Seoul_2005.jpg
 *    - silas: Silas Low, "Olympic Park Seoul.jpg", Wikimedia Commons, CC
 *      BY-SA 4.0; oblique. https://commons.wikimedia.org/wiki/File:Olympic_Park_Seoul.jpg
 *  No look-only sources. No commercial imagery. No lidar, NAIP or map
 *  terrain here (Mapterhorn has no z15 tiles over Seoul): the terrain could
 *  not be checked. Elevation 0.
 *
 * Invented or simplified: the pylons' fine striping is grouped into broad
 *  bands (fine stripes would be pinstripes); two of the rings share navy;
 *  the flame / torch is not mapped in OSM and is not drawn. Night: the pylons
 *  and the mural carry _FLOODLIGHT.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save } from './chi-aon-center'
import { face, strip } from './seoul-world-cup-stadium'

const BEARING = 68.8
const DEPTH = 18.5 // half depth (y)
const GAP = 4.4 // half gap between pylons (x)
const PW = 4.8 // pylon width (x)
const XP = GAP + PW // outer face of the pylons
const YN = 10.6 // the notch: pylons stand from |y| 10.6 to 18.5
const Z_TOP = 24, BAND = 1.6, Z_SOFF = 13.5, Z_TIPS = Z_TOP - BAND
/** The wing tip's concave end: x at depth y (arc through x 30.5 at the corners, 20.7 at the middle). */
const tipX = (y: number) => {
  const c = 30.5, m = 20.7, h = DEPTH
  // a circular arc through (m, 0) and (c, +-h)
  const R = (h * h + (c - m) ** 2) / (2 * (c - m))
  return m + R - Math.sqrt(R * R - y * y)
}
/** Soffit height at distance x from the axis. */
const soff = (x: number, y: number) => {
  if (x <= XP) return Z_SOFF
  const t = (x - XP) / (tipX(y) - XP)
  return Z_SOFF + (Z_TIPS - Z_SOFF) * t
}
type Col = 'cream' | 'navy' | 'red' | 'roof' | 'white' | 'pylon'
/**
 * The mural's colour fields on each wing face, from isa6 (both wings,
 * mirrored about the gate): u runs from the pylon (0) to the tip (1), and
 * each column is split at mid-height into an upper and a lower field.
 */
const MURAL: [number, number, Col, Col][] = [
  [0, 0.14, 'cream', 'cream'], // leopard-spotted field by the pylon
  [0.14, 0.3, 'navy', 'red'], // navy sky over the guardian's red robe
  [0.3, 0.44, 'red', 'cream'], // red field, the figure's pale face and arms
  [0.44, 0.58, 'red', 'navy'],
  [0.58, 0.76, 'cream', 'cream'], // the second leopard field
  [0.76, 1, 'navy', 'navy'], // navy to the tip
]
const V_SPLIT = 0.45

function build() {
  const white = new Part(), roof = new Part(), pylon = new Part(), navy = new Part(), red = new Part(), cream = new Part()
  const paint: Record<Col, Part> = { navy, red, cream, roof, white, pylon }
  const NY = 8 // samples across the depth
  const LIP = 0.3 // the white top band stands this far proud of the painted faces

  for (const sx of [1, -1]) {
    const X = (x: number) => sx * x
    const ys = Array.from({ length: NY + 1 }, (_, j) => -DEPTH + (2 * DEPTH * j) / NY)
    const xAt = (y: number, b: number) => XP + (tipX(y) - XP) * b
    // --- Wing top (flat roof), out to the band's lip.
    for (let j = 0; j < NY; j++) {
      const y0 = ys[j], y1 = ys[j + 1]
      const e0 = j === 0 ? -LIP : 0, e1 = j === NY - 1 ? LIP : 0
      face(roof, [[X(GAP), y0 + e0, Z_TOP], [X(tipX(y0) + LIP), y0 + e0, Z_TOP], [X(tipX(y1) + LIP), y1 + e1, Z_TOP], [X(GAP), y1 + e1, Z_TOP]], [0, 0, 1])
      // the band round the concave tip, and its fine underside edge
      face(white, [[X(tipX(y0) + LIP), y0, Z_TIPS], [X(tipX(y1) + LIP), y1, Z_TIPS], [X(tipX(y1) + LIP), y1, Z_TOP], [X(tipX(y0) + LIP), y0, Z_TOP]], [sx, 0, 0])
      face(white, [[X(tipX(y0)), y0, Z_TIPS], [X(tipX(y1)), y1, Z_TIPS], [X(tipX(y1) + LIP), y1, Z_TIPS], [X(tipX(y0) + LIP), y0, Z_TIPS]], [0, 0, -1])
    }
    // --- The mural: underside fields (the column's lower colour near the
    // faces, its upper colour across the middle) and the front/back faces.
    for (const [b0, b1, up, lo] of MURAL) {
      for (let j = 0; j < NY; j++) {
        const y0 = ys[j], y1 = ys[j + 1]
        const col = j === 0 || j === NY - 1 ? lo : up
        face(paint[col], [[X(xAt(y0, b0)), y0, soff(xAt(y0, b0), y0)], [X(xAt(y1, b0)), y1, soff(xAt(y1, b0), y1)], [X(xAt(y1, b1)), y1, soff(xAt(y1, b1), y1)], [X(xAt(y0, b1)), y0, soff(xAt(y0, b1), y0)]], [0, 0, -1])
      }
      for (const sy of [1, -1]) {
        const y = sy * DEPTH, xa = xAt(y, b0), xb = xAt(y, b1)
        const zs = (x: number) => soff(x, y)
        const zm = (x: number) => zs(x) + (Z_TIPS - zs(x)) * V_SPLIT
        face(paint[lo], [[X(xa), y, zs(xa)], [X(xb), y, zs(xb)], [X(xb), y, zm(xb)], [X(xa), y, zm(xa)]], [0, sy, 0])
        face(paint[up], [[X(xa), y, zm(xa)], [X(xb), y, zm(xb)], [X(xb), y, Z_TIPS], [X(xa), y, Z_TIPS]], [0, sy, 0])
      }
    }
    for (const sy of [1, -1]) {
      const y = sy * DEPTH, yl = sy * (DEPTH + LIP)
      // the white top band along the front and back, standing proud, with its underside
      face(white, [[X(GAP), yl, Z_TIPS], [X(tipX(y) + LIP), yl, Z_TIPS], [X(tipX(y) + LIP), yl, Z_TOP], [X(GAP), yl, Z_TOP]], [0, sy, 0])
      face(white, [[X(XP), y, Z_TIPS], [X(tipX(y) + LIP), y, Z_TIPS], [X(tipX(y) + LIP), yl, Z_TIPS], [X(XP), yl, Z_TIPS]], [0, 0, -1])
    }
    // the underside behind the pylons, between them
    face(cream, [[X(GAP), -YN, Z_SOFF], [X(XP), -YN, Z_SOFF], [X(XP), YN, Z_SOFF], [X(GAP), YN, Z_SOFF]], [0, 0, -1])
    // the wing's inner face over the gap, above the beams
    face(white, [[X(GAP), -DEPTH, Z_SOFF], [X(GAP), DEPTH, Z_SOFF], [X(GAP), DEPTH, Z_TOP], [X(GAP), -DEPTH, Z_TOP]], [-sx, 0, 0])

    // --- Pylons, front and back: stacked in broad white and grey bands
    // (the grey ones set back 0.2 m), a dark slot up the front and gap faces.
    const BANDS_Z: [number, number, Col][] = [[0, 1.2, 'pylon'], [1.2, 5.2, 'white'], [5.2, 8.8, 'pylon'], [8.8, 12.6, 'white'], [12.6, 16.2, 'pylon'], [16.2, 19.6, 'white'], [19.6, Z_TIPS, 'pylon'], [Z_TIPS, Z_TOP, 'white']]
    for (const sy of [1, -1]) {
      const ya = sy * YN, yb = sy * DEPTH
      for (const [z0, z1, col] of BANDS_Z) {
        const d = col === 'pylon' ? 0.2 : 0
        const x0 = X(GAP + d), x1 = X(XP - d), yA = ya, yB = yb - sy * d
        const pts = (z: number): V3[] => [[x0, yA, z], [x1, yA, z], [x1, yB, z], [x0, yB, z]]
        const lo = pts(z0), hi = pts(z1)
        const P = paint[col]
        const sides: [number, number, V3][] = [[0, 1, [0, -sy, 0]], [1, 2, [sx, 0, 0]], [2, 3, [0, sy, 0]], [3, 0, [-sx, 0, 0]]]
        for (const [a, b, n] of sides) {
          if (z0 >= Z_SOFF - 0.01 && (n[0] === sx || n[1] === -sy)) continue // inside the wing
          face(P, [lo[a], lo[b], hi[b], hi[a]], n)
        }
        // ledges where a white band steps out over a grey one
        if (col === 'white' && z0 > 0) face(white, pts(z0), [0, 0, -1])
        if (col === 'white' && z1 < Z_SOFF) face(white, pts(z1), [0, 0, 1])
      }
      const c = (x: number, y: number, z: number): V3 => [x, y, z]
      const xm = sx * (GAP + PW / 2)
      face(navy, [c(xm - 0.45, yb + sy * 0.05, 1.2), c(xm + 0.45, yb + sy * 0.05, 1.2), c(xm + 0.45, yb + sy * 0.05, Z_TIPS - 0.6), c(xm - 0.45, yb + sy * 0.05, Z_TIPS - 0.6)], [0, sy, 0])
      const ym = (ya + yb) / 2, x0 = X(GAP)
      face(navy, [c(x0 - sx * 0.05, ym - 0.45, 1.2), c(x0 - sx * 0.05, ym + 0.45, 1.2), c(x0 - sx * 0.05, ym + 0.45, Z_SOFF - 0.6), c(x0 - sx * 0.05, ym - 0.45, Z_SOFF - 0.6)], [-sx, 0, 0])
    }
  }

  // --- The beams across the gap, front and back: a grey beam, the white
  // plate over it, and the five rings standing on the plate's face in the
  // Olympic colours (blue and black navy, yellow cream, green the roof's
  // grey-green, red).
  for (const sy of [1, -1]) {
    const yo = sy * YN, yi = sy * 7.2
    const box = (P: Part, z0: number, z1: number, yOut: number) => {
      face(P, [[-GAP, yOut, z0], [GAP, yOut, z0], [GAP, yOut, z1], [-GAP, yOut, z1]], [0, sy, 0])
      face(P, [[-GAP, yi, z0], [GAP, yi, z0], [GAP, yi, z1], [-GAP, yi, z1]], [0, -sy, 0])
      face(P, [[-GAP, yi, z1], [GAP, yi, z1], [GAP, yOut, z1], [-GAP, yOut, z1]], [0, 0, 1])
      face(P, [[-GAP, yi, z0], [GAP, yi, z0], [GAP, yOut, z0], [-GAP, yOut, z0]], [0, 0, -1])
    }
    box(pylon, Z_SOFF, 15, yo + sy * 0.2)
    box(white, 15, 16.4, yo)
    box(white, 16.4, 20.2, yo - sy * 0.5)
    const R = 1.15, w = 0.34, dep = 0.35
    const yf = yo - sy * 0.5
    const rings: [number, number, Col][] = [[-2.5, 18.9, 'navy'], [0, 18.9, 'navy'], [2.5, 18.9, 'red'], [-1.25, 17.75, 'cream'], [1.25, 17.75, 'roof']]
    for (const [u, zc, col] of rings) {
      const S = 14, P = paint[col]
      const Q = (a: number, r: number, o: number): V3 => [u + r * Math.cos(a), yf + sy * o, zc + r * Math.sin(a)]
      for (let i = 0; i < S; i++) {
        const a0 = (i / S) * 2 * Math.PI, a1 = ((i + 1) / S) * 2 * Math.PI, am = (a0 + a1) / 2
        face(P, [Q(a0, R - w, dep), Q(a1, R - w, dep), Q(a1, R, dep), Q(a0, R, dep)], [0, sy, 0])
        face(P, [Q(a0, R, 0), Q(a1, R, 0), Q(a1, R, dep), Q(a0, R, dep)], [Math.cos(am), 0, Math.sin(am)])
        face(P, [Q(a0, R - w, 0), Q(a1, R - w, 0), Q(a1, R - w, dep), Q(a0, R - w, dep)], [-Math.cos(am), 0, -Math.sin(am)])
      }
    }
  }

  const lit = (_p: V3, n: V3) => (n[2] > 0.5 ? 0 : 0.8)
  return [
    { part: white, material: PALETTE.trim },
    { part: roof, material: finish('wpg-roof', 0xaeb09c) },
    { part: pylon, material: { ...finish('wpg-pylon', 0xd2d3d4), floodlight: lit } },
    { part: navy, material: { ...finish('wpg-navy', 0x46527e), floodlight: lit } },
    { part: red, material: { ...finish('wpg-red', 0xb4483f), floodlight: lit } },
    { part: cream, material: { ...finish('wpg-cream', 0xd8c9a6), floodlight: lit } },
  ]
}

if (import.meta.main) await save('seoul-world-peace-gate', 'World Peace Gate', [37.5183104, 127.1153972], BEARING, build() as any, 6500)
