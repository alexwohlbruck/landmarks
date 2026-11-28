/**
 * Skyper, Frankfurt am Main: procedural, CC0-1.0.
 * bun generators/frankfurt-skyper.ts
 *
 * JSK Architekten, 2002-2004: a 153.8 m, 39-storey office tower on the
 * corner of the Taunusanlage and the Taunusstrasse, on a quarter-circle
 * plot: its plan is a quarter of a ring, the convex face turned west to
 * the park, the concave face east to the old Holzmann villa, the two
 * straight ends radial. It is clad all round in a blue-green glass curtain
 * wall with bold vertical aluminium ribs; the glass runs on past the roof
 * as a screen, so the top reads as a clean glass crown.
 *
 * Identity, in order: the quarter-ring plan, which shows from every side as
 * a broad curved glass slab with a sharp radial edge; the blue-green glass
 * with close vertical ribs; the clean top with the glass screen standing
 * above the roof; the recessed glazed foot.
 *
 * The listed villa (1915) and the glass hall that joins it to the tower are
 * separate OSM buildings (way/174435254 "Holzmann Villa", way/174435255
 * "Skyper - Verbindungsbau") and are left to the map: the assignment asked
 * for the villa only if it is part of the tower's outline, and it is not.
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin: the area
 * centroid of OSM way/174435268 (50.110384, 8.669424). y = 0 is the lowest
 * ground under the footprint.
 *
 * Plan (fitted to the OSM outline): both arcs centred on (27.1, -10.8);
 * the outer face radius 44.0 m, the inner 20.1 m; the ends at bearings
 * (from that centre) 293.6 and 23.6 + 180, i.e. the sector runs from 113.6
 * to 203.6 degrees anticlockwise from east.
 *
 * Heights:
 * - 153.8 m, 39 storeys: published (de.wikipedia "Skyper (Frankfurt am
 *   Main)"); OSM 154 m, 39 levels.
 * - the roof 149 m, the glass screen all round to 153.8 m: estimated from a, f and g (the
 *   top two storeys of glass stand clear of the roof against the sky).
 * - the foot: 0-8.5 m, glazing set 2 m back behind columns (e, b).
 * - ribs: one every 3.6 m along the faces, 0.35 m deep (h, a); a pale
 *   floor line every six storeys (h shows a faint one every storey).
 *
 * Evidence (Wikimedia Commons):
 * - a https://commons.wikimedia.org/wiki/File:Skyper_Frankfurt.jpg
 *   Luidger, CC BY-SA 3.0: from the Taunusanlage (west), the convex face.
 * - b https://commons.wikimedia.org/wiki/File:Frankfurt_am_Main,_Taunusstra%C3%9Fe_2021.jpg
 *   Choinowski, CC BY-SA 4.0: down the Taunusstrasse, full height.
 * - d https://commons.wikimedia.org/wiki/File:Frankfurt_Taunusanlage_1.Taunusstra%C3%9Fe_2.20130401.jpg
 *   Epizentrum, CC BY 3.0: the villa and the tower's foot.
 * - e https://commons.wikimedia.org/wiki/File:Frankfurt,_Skyper.jpg
 *   LBM1948, CC BY-SA 4.0: the foot, columns and recessed glazing.
 * - f https://commons.wikimedia.org/wiki/File:Frankfurt_Skyper.S%C3%BCden.20130603.jpg
 *   Epizentrum, CC BY-SA 3.0: from the south, the top.
 * - g https://commons.wikimedia.org/wiki/File:Skyper_Silver_Tower.JPG
 *   Lennart Kudling, CC BY-SA 3.0: from high up, the curved face.
 * - h https://commons.wikimedia.org/wiki/File:SkyperFrankfurtM_P1250540.JPG
 *   JuergenG, CC BY-SA 3.0: the ribs from below.
 * - OSM (API, 2026-11): way/174435268.
 * - No lidar (none in Germany). Look-only: none.
 *
 * Colours: the glass a blue-green #6f98a3 (a, f, g; pulled light from about
 * #4f7f8c); the ribs and floor lines aluminium #d3d9dc; the roof grey; the
 * foot glazing dark #50646d.
 *
 * Night: the curtain wall is `window`; the foot is `entrance`; the screen
 * above the roof is `glass` (nothing behind it to light).
 *
 * Doubts: the top of the inner (east) face is not well seen; the roof's
 * plant is not seen and left flat.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { face, arc, capRing, prism, smoothWall, saveLods, type XY, type Layer } from './frankfurt-westhafen-tower'

const ID = 'frankfurt-skyper'
const DEG = Math.PI / 180
const C: XY = [27.1, -10.8]
const RO = 44.0, RI = 20.1
const A0 = 113.6 * DEG, A1 = 203.6 * DEG
const ROOF = 149, TOP = 153.8, TOP_IN = 153.8, FOOT = 8.5, STOREY = ROOF / 38

const glass = new Part(), rib = new Part(), roof = new Part(), foot = new Part(), screen = new Part()

const P = (r: number, a: number): XY => [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a)]
const SEG_O = 18, SEG_I = 10
const outer = arc(C, RO, A0, A1, SEG_O) // anticlockwise: from the north end round to the south end
const inner = arc(C, RI, A1, A0, SEG_I) // back the other way
const plan: XY[] = [...outer, ...inner]

// ── the shaft: curtain wall from the foot to the roof ──
// outer face (convex): walked anticlockwise about C, the outside is on the right
const outerLine = outer
smoothWall(glass, outerLine, FOOT, ROOF)
// inner face (concave): walked back A1 -> A0, the outside (toward C) on the right
smoothWall(glass, inner, FOOT, ROOF)
// the straight ends
const endS: [XY, XY] = [P(RO, A1), P(RI, A1)]
const endN: [XY, XY] = [P(RI, A0), P(RO, A0)]
for (const [a, b] of [endS, endN]) glass.quad([a[0], a[1], FOOT], [b[0], b[1], FOOT], [b[0], b[1], ROOF], [a[0], a[1], ROOF])

// ── the foot: recessed glazing behind columns ──
{
  const inset = 2
  const o2 = arc(C, RO - inset, A0 + 0.04, A1 - 0.04, SEG_O)
  const i2 = arc(C, RI + inset, A1 - 0.08, A0 + 0.08, SEG_I)
  prism(foot, [...o2, ...i2], 0, FOOT, { top: null })
  // the soffit over the recess
  capRing(rib, plan, FOOT, false)
  // columns at every other rib along the faces
  const col = (p: XY) => prism(rib, [[p[0] - 0.5, p[1] - 0.5], [p[0] + 0.5, p[1] - 0.5], [p[0] + 0.5, p[1] + 0.5], [p[0] - 0.5, p[1] + 0.5]], 0, FOOT, { top: null })
  for (let k = 0; k <= 8; k++) col(P(RO - 0.7, A0 + 0.02 + ((A1 - A0 - 0.04) * k) / 8))
  for (let k = 0; k <= 4; k++) col(P(RI + 0.7, A0 + 0.04 + ((A1 - A0 - 0.08) * k) / 4))
}

// ── ribs: vertical aluminium fins, one every ~3.6 m (h) ──
function fin(p: XY, n: XY, z0: number, z1: number) {
  const t: XY = [-n[1], n[0]], w = 0.22, d = 0.4
  const q = (s: number, o: number): XY => [p[0] + t[0] * s + n[0] * o, p[1] + t[1] * s + n[1] * o]
  const r = [q(-w, 0), q(w, 0), q(w, d), q(-w, d)]
  prism(rib, r, z0, z1, { top: null })
}
{
  const nO = Math.round(((A1 - A0) * RO) / 3.6), nI = Math.round(((A1 - A0) * RI) / 3.6)
  for (let k = 1; k < nO; k++) {
    const a = A0 + ((A1 - A0) * k) / nO
    fin(P(RO, a), [Math.cos(a), Math.sin(a)], FOOT, TOP - 0.3)
  }
  for (let k = 1; k < nI; k++) {
    const a = A0 + ((A1 - A0) * k) / nI
    fin(P(RI, a), [-Math.cos(a), -Math.sin(a)], FOOT, TOP_IN - 0.3)
  }
  // the ends: ribs along the straight faces
  for (const [a, b] of [endS, endN]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.round(L / 3.6)
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
    for (let k = 1; k < n; k++) fin([a[0] + t[0] * (L * k) / n, a[1] + t[1] * (L * k) / n], nn, FOOT, TOP - 0.3)
  }
}

// ── floor lines: a pale band every six storeys ──
{
  const band = (z: number) => {
    const h = 0.3
    smoothWall(rib, outerLine, z - h / 2, z + h / 2, 0.08)
    smoothWall(rib, inner, z - h / 2, z + h / 2, 0.08)
    for (const [a, b] of [endS, endN]) {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [t[1], -t[0], 0]
      const o = (p: XY, zz: number): V3 => [p[0] + n[0] * 0.08, p[1] + n[1] * 0.08, zz]
      face(rib, [o(a, z - h / 2), o(b, z - h / 2), o(b, z + h / 2), o(a, z + h / 2)], n)
    }
  }
  for (let k = 6; k * STOREY < ROOF - 6; k += 6) band(FOOT + (k - 2) * STOREY)
  band(FOOT)
}

// ── the top: roof, and the glass screen above it ──
capRing(roof, plan, ROOF)
{
  // the screen: the outer face and the ends rise to TOP, the inner to TOP_IN;
  // drawn both ways (outer and inner side), thin
  smoothWall(screen, outerLine, ROOF, TOP)
  smoothWall(screen, [...outer].reverse(), ROOF, TOP, -0.3)
  smoothWall(screen, inner, ROOF, TOP_IN)
  smoothWall(screen, [...inner].reverse(), ROOF, TOP_IN, -0.3)
  for (const [a, b] of [endS, endN]) {
    screen.quad([a[0], a[1], ROOF], [b[0], b[1], ROOF], [b[0], b[1], TOP], [a[0], a[1], TOP])
    screen.quad([b[0], b[1], ROOF], [a[0], a[1], ROOF], [a[0], a[1], TOP], [b[0], b[1], TOP])
  }
  // an aluminium coping along the screen's top edge
  const cap = (line: XY[], z: number) => { smoothWall(rib, line, z - 0.5, z, 0.12) }
  cap(outerLine, TOP)
  cap(inner, TOP_IN)
}

const mats: Layer[] = [
  { part: glass, material: { ...PALETTE.window, color: 0x6f98a3 } },
  { part: rib, material: finish('skyper-aluminium', 0xd3d9dc) },
  { part: roof, material: PALETTE.roof },
  { part: foot, material: { ...PALETTE.entrance, color: 0x50646d } },
  { part: screen, material: { ...PALETTE.glass, color: 0x7aa1ab } },
]

await saveLods(ID, 'Skyper', mats, null, { anchor: [50.110384, 8.669424], bearing: 0, elevation: 0, height: TOP })
