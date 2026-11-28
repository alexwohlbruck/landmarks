/**
 * Omniturm, Frankfurt am Main: procedural, CC0-1.0.
 * bun generators/frankfurt-omniturm.ts   (writes the low and the detail model)
 *
 * BIG (Bjarke Ingels Group), 2016-2019, for Tishman Speyer: a 190 m glass
 * tower of offices with flats in its middle. A plain square-ish glass
 * prism, except that the floor plates of the residential storeys (the 14th
 * to the 23rd) slide out of line in a spiral, up to more than 5 m, and back
 * again: the "hip swing". The shifted plates carry open balconies and
 * terraces with dark slab edges.
 *
 * Identity, in order: the plain dark blue-green glass prism; the hip swing
 * a third of the way up, a stack of thin plates each a little further out
 * of line, turning as they rise, with black slab edges and the glass set
 * back behind open balconies; the upper block back in line with the lower;
 * the tall glazed public foot.
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin: the area
 * centroid of OSM way/598133203 (50.111562, 8.673086). The plan is a
 * rectangle 37.7 x 39.6 m (measured from the outline) centred at
 * (0.05, 0.5), its long sides along the bearing 59.0 (u) and the short
 * along 329.0 (v). y = 0 is the lowest ground under the footprint.
 *
 * Numbers:
 * - 190 m (189.9 m in the planning), 45 storeys: published (de.wikipedia
 *   "Omniturm"; en.wikipedia gives 190 m). OSM 183 m, 45 levels. Storey
 *   4.2 m (190 / 45).
 * - the swing: storeys 14 to 23 (en.wikipedia), offset up to 5.2 m
 *   ("more than 5 m"); each plate shifts by 5.2 sin(pi t) metres, its
 *   direction turning through half a turn from the bottom of the swing to
 *   the top (t = 0..1). The phase (the first plates shift toward the
 *   north-west, the last toward the south-east) is estimated from c and e,
 *   where the lower plates overhang one side and the upper the other.
 * - balconies: the glass of a swing storey set 1.6 m back behind its slab,
 *   the slab edge 0.7 m deep in black (a, b).
 * - the foot: 0-13 m (three public storeys), glazing set 1.5 m back (a, d).
 * - the curtain wall: a pale floor line every two storeys and a pale
 *   mullion every 3.1 m on the plain blocks (a, b: a regular square grid).
 *
 * Evidence (Wikimedia Commons):
 * - a https://commons.wikimedia.org/wiki/File:Omniturm_Frankfurt_09-19.jpg
 *   Silesia711, CC BY-SA 4.0: from below, the swing, the dark slab edges.
 * - b https://commons.wikimedia.org/wiki/File:Omniturm_Frankfurt_am_Main.jpg
 *   Choinowski, CC BY-SA 4.0: from below, the swing's underside.
 * - c https://commons.wikimedia.org/wiki/File:Omniturm_Frankfurt_08-19.jpg
 *   Silesia711, CC BY-SA 4.0: down the Neue Mainzer Strasse, full height.
 * - d https://commons.wikimedia.org/wiki/File:Omniturm_Frankfurt_05-19.jpg
 *   Silesia711, CC BY-SA 4.0.
 * - e https://commons.wikimedia.org/wiki/File:Omniturm_Frankfurt_02-19_B.jpg
 *   Silesia711, CC BY-SA 4.0: full height, the swing in profile.
 * - g https://commons.wikimedia.org/wiki/File:Marienturm_und_Omniturm.jpg
 *   Jonathan Naumann, CC BY-SA 3.0 de: from above, under construction (the
 *   plan).
 * - OSM (API, 2026-11): way/598133203.
 * - No lidar (none in Germany). Look-only: none.
 *
 * Colours: the glass a dark navy blue-black, about #2a3646 in the photos
 * (a, c, e), drawn as dark as the palette's charcoal floor allows, #4d6079;
 * the slab edges charcoal #4a4f57; the mullion and floor lines a muted
 * grey-blue #7d8a97, 0.2-0.24 m wide, so they mark the grid without
 * striping it; the foot glass #485a6b; the roof grey.
 *
 * Night: the curtain wall is `window`, the foot `entrance`.
 *
 * Detail model: a slab edge at every storey of the plain blocks and a
 * mullion every 2.35 m.
 *
 * Doubts: the swing's turning direction and phase are read from a few
 * street views only; the small bay on the east face in OSM (a stair?) is
 * left out; the roof is not seen and is flat.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { face, prism, capRing, saveLods, type XY, type Layer } from './frankfurt-westhafen-tower'

const ID = 'frankfurt-omniturm'
const DEG = Math.PI / 180
const O: XY = [0.05, 0.5]
const U: XY = [Math.sin(59 * DEG), Math.cos(59 * DEG)] // bearing 59
const V: XY = [-U[1], U[0]] // bearing 329
const HU = 37.7 / 2, HV = 39.6 / 2
const TOP = 190, ST = TOP / 45, FOOT = 13
const SW0 = 14, SW1 = 24 // swing storeys [SW0, SW1)
const SHIFT = 5.2, SLAB = 0.7, BALC = 1.6

const P = (u: number, v: number, d: XY = [0, 0]): XY => [O[0] + U[0] * u + V[0] * v + d[0], O[1] + U[1] * u + V[1] * v + d[1]]
const rect = (h: number = 0, d: XY = [0, 0]): XY[] => [P(-HU + h, -HV + h, d), P(HU - h, -HV + h, d), P(HU - h, HV - h, d), P(-HU + h, HV - h, d)]

type Set = { glass: Part; edge: Part; line: Part; foot: Part; roof: Part }
const mk = (): Set => ({ glass: new Part(), edge: new Part(), line: new Part(), foot: new Part(), roof: new Part() })

/** Pale grid lines on the four faces of rect r between z0 and z1. */
function grid(p: Part, r: XY[], z0: number, z1: number, every: number, mull: number) {
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [t[1], -t[0], 0], o = 0.06
    const at = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * o, a[1] + t[1] * s + n[1] * o, z]
    // floor lines
    for (let z = z0 + every; z < z1 - 1; z += every) face(p, [at(0, z - 0.12), at(L, z - 0.12), at(L, z + 0.12), at(0, z + 0.12)], n)
    // mullions
    const nm = Math.round(L / mull)
    for (let k = 1; k < nm; k++) {
      const s = (L * k) / nm
      face(p, [at(s - 0.1, z0), at(s + 0.1, z0), at(s + 0.1, z1), at(s - 0.1, z1)], n)
    }
  }
}

function build(s: Set, detail: boolean) {
  const lineEvery = detail ? ST : 2 * ST, mull = detail ? 2.35 : 3.1
  // ── the foot: glazing set back, the tower's soffit over it ──
  prism(s.foot, rect(1.5), 0, FOOT, { top: null })
  // ── lower block: FOOT to the swing ──
  const zS0 = SW0 * ST, zS1 = SW1 * ST
  prism(s.glass, rect(), FOOT, zS0, { top: null, bottom: s.edge })
  grid(s.line, rect(), FOOT, zS0, lineEvery, mull)
  // a dark band at the foot's top (a)
  prism(s.edge, rect(-0.05), FOOT, FOOT + 1.0, { top: null })
  // ── the swing: one plate per storey ──
  const n = SW1 - SW0
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n
    const m = SHIFT * Math.sin(Math.PI * t), th = (135 + 180 * t) * DEG // direction, anticlockwise from east
    const d: XY = [m * Math.cos(th), m * Math.sin(th)]
    const z0 = zS0 + i * ST, z1 = z0 + ST
    // the slab: its edge in black, its top (the balcony floor) and soffit dark
    prism(s.edge, rect(0, d), z0, z0 + SLAB, { bottom: s.edge })
    // the glass set back behind the balcony
    prism(s.glass, rect(BALC, d), z0 + SLAB, z1, { top: null })
    if (detail) grid(s.line, rect(BALC, d), z0 + SLAB, z1, 99, mull)
  }
  // ── upper block, back in line ──
  prism(s.edge, rect(), zS1, zS1 + SLAB, { top: null, bottom: s.edge })
  prism(s.glass, rect(), zS1 + SLAB, TOP - 0.5, { top: null })
  grid(s.line, rect(), zS1 + SLAB, TOP - 0.5, lineEvery, mull)
  // coping and roof
  prism(s.line, rect(-0.05), TOP - 0.5, TOP, { top: null })
  capRing(s.roof, rect(), TOP)
}

const mats = (s: Set): Layer[] => [
  { part: s.glass, material: { ...PALETTE.window, color: 0x4d6079 } },
  { part: s.edge, material: finish('omniturm-slab-edge', 0x4a4f57) },
  { part: s.line, material: finish('omniturm-mullion', 0x7d8a97) },
  { part: s.foot, material: { ...PALETTE.entrance, color: 0x485a6b } },
  { part: s.roof, material: PALETTE.roof },
]

const low = mk(), det = mk()
build(low, false)
build(det, true)
await saveLods(ID, 'Omniturm', mats(low), mats(det), { anchor: [50.111562, 8.673086], bearing: 0, elevation: 0, height: TOP })
