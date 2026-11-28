/**
 * Ponte City (Ponte Tower; Mannie Feldman, Manfred Hermer and Rodney
 * Grosskopff, 1975), Berea, Johannesburg: original procedural geometry,
 * CC0-1.0, no textures.
 *   bun generators/johannesburg-ponte-city.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the lowest ground
 * under the footprint. Anchor = the centre of the ring of OSM way/
 * 759354705 (building=residential, height 173, building:levels 54; the
 * way is the annulus itself, outer and inner rings joined by a seam), lng
 * 28.0571619, lat -26.1905784. Bearing 0 (a cylinder).
 *
 * Identity, in order: the tall plain concrete cylinder; the open core, a
 * real hole through the whole height (Wikipedia: "an open centre ... the
 * core"); the great sign ring round the top; the horizontal banding of the
 * windows; the flat face of the service side on the west.
 *
 * Evidence
 *  - Plan: OSM way/759354705: outer ring 21.5 m in radius, flattened on
 *    the west by a straight face from (-14.7, 15.5) to (-21.2, -1.8);
 *    the core 14.6 m in radius (both measured from the OSM nodes).
 *  - Height: 173 m (OSM height; Wikipedia "Ponte City Apartments"), 54-55
 *    storeys. The sign ring is the top 18 m (155-173 m): q8 and q9 show
 *    it at 0.105 and 0.11 of the visible height. Storeys about 3 m; the
 *    window panels are grouped three storeys to a band with concrete
 *    spandrels and piers between them.
 *  - The sign, dated: Coca-Cola before 2000, Vodacom from 2000 (blue in
 *    q8, 2009-02-08; red, lit red at night, in q9, 2015-05-12), "rebranded
 *    in 2023 to advertise VodaPay" (Wikipedia, read November 2026). No licensed photo of the VodaPay
 *    sign was found: drawn as a plain red lit band (Vodacom red, q9), no
 *    lettering. `neon-ponte-sign`, lit at night as in q9.
 *  - The lift core inside the hole: q7 (looking up the core, 2022): a
 *    rectangular tower against the core's wall, running the full height.
 *    Placed on the west, where the OSM way's seam and the flat outer face
 *    are; its width (7 m) and depth (6 m) are estimated from q7.
 *  - Terrain: Mapterhorn z12 only (z13-z15 404); the hillside falls about
 *    13 m across the footprint, to the east and south-east. y = 0 is the
 *    lowest ground (east); the uphill side sinks into the hill. The core's
 *    "uneven rock floor" is the map's ground inside the hole.
 *  - Photos (EVIDENCE):
 *    - q2 Jorge Láscar, "View from the Top of Africa building - Ponte City
 *      Apartments on the centre" (Flickr), CC BY 2.0 — distant, proportion.
 *      https://www.flickr.com/photos/8721758@N06/4611826497
 *    - q7 NGunasena (WMF), "Ponte City apartments inner courtyard.jpg",
 *      CC BY-SA 4.0 (2022) — the core, the lift tower, the inner windows.
 *      https://commons.wikimedia.org/wiki/File:Ponte_City_apartments_inner_courtyard.jpg
 *    - q8 Geoffrey Hancock, "Ponte City.jpg", CC BY-SA 2.0 (2009) — the
 *      cylinder from the west: banding, colour, the sign's height.
 *      https://commons.wikimedia.org/wiki/File:Ponte_City.jpg
 *    - q9 South African Tourism, "Cityscape, Johannesburg, Gauteng, South
 *      Africa.jpg", CC BY 2.0 (2015) — night: lit windows, the red sign.
 *      https://commons.wikimedia.org/wiki/File:Cityscape,_Johannesburg,_Gauteng,_South_Africa.jpg
 *  No look-only sources. No commercial imagery. No lidar here.
 *
 * Invented or simplified (reworked after review: the first pass, one
 * panel a bay per three storeys, read as a dot grid at phone size): the
 * facade is grouped four storeys to a band, a window band and a proud
 * concrete rib, with eight broad piers round the outside and seven in the
 * core; the window colour is a lighter slate (#7d8a96), as the real
 * small-windowed facade reads mostly concrete;
 * the sign's lettering and logo; the roof plant is left out.
 * Colours: concrete #bcb8b0 (q8, q9, pulled to the palette's lightness),
 * windows the palette's slate, the sign #d23b37.
 * Doubts: q8 makes the cylinder look slimmer (taller for its width)
 * than the OSM ring and 173 m allow; q9 and q2 agree with OSM, so q8
 * (a panorama) is taken as distorted. The current sign (VodaPay since 2023: colour and exact extent
 * unseen); the lift tower's size and position in the core.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { face } from './phl-independence-hall'
import { box, writeModel, type Slot } from './pretoria-union-buildings'

const ID = 'johannesburg-ponte-city'
const NAME = 'Ponte City'
const ANCHOR: [number, number] = [28.0571619, -26.1905784]

const RO = 21.5, RI = 14.6, H = 173, ZSIGN = 155
// the flat west face: the line through these two points (OSM)
const CA: [number, number] = [-14.7, 15.5], CB: [number, number] = [-21.2, -1.8]
const chord = (() => {
  const dx = CB[0] - CA[0], dy = CB[1] - CA[1], L = Math.hypot(dx, dy)
  const n: [number, number] = [dy / L, -dx / L] // pointing west (outwards)
  return { n: n[0] < 0 ? n : [-n[0], -n[1]] as [number, number], d: 0 }
})()
chord.d = CA[0] * chord.n[0] + CA[1] * chord.n[1]

/** Outer ring point at angle t, clipped to the flat west face. */
function outer(t: number, r = RO): [number, number] {
  const p: [number, number] = [r * Math.cos(t), r * Math.sin(t)]
  const s = p[0] * chord.n[0] + p[1] * chord.n[1]
  const lim = chord.d + (r - RO)
  if (s > lim) { const k = lim / s; return [p[0] * k, p[1] * k] }
  return p
}

function build() {
  const concrete = new Part(), win = new Part(), sign = new Part(), roof = new Part()
  const NO = 40, NI = 28
  const to = Array.from({ length: NO + 1 }, (_, k) => (k / NO) * 2 * Math.PI)
  const ti = Array.from({ length: NI + 1 }, (_, k) => (k / NI) * 2 * Math.PI)
  const V = (p: [number, number], z: number): V3 => [p[0], p[1], z]

  // Four-storey groups (3.0 m storeys, 12 m a group, from 3 m to the
  // sign): a window band 8.4 m tall and a 3.6 m concrete spandrel standing
  // 0.4 m proud as a rib round the whole drum, so the cylinder reads as
  // ribbed concrete; eight broad piers break the window bands into bays.
  const bands: [number, number][] = []
  for (let z = 3; z + 12 <= ZSIGN; z += 12) bands.push([z, z + 8.4])
  const PIERS = 8, PIER = 1.6

  // --- The outside: concrete facets, window bands, ribs.
  for (let k = 0; k < NO; k++) {
    const a = outer(to[k]), b = outer(to[k + 1])
    const n: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    face(concrete, [V(a, 0), V(b, 0), V(b, ZSIGN), V(a, ZSIGN)], n)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nl = Math.hypot(n[0], n[1])
    const off = (p: [number, number], s: number, o: number): [number, number] => [p[0] + (b[0] - a[0]) * s + n[0] / nl * o, p[1] + (b[1] - a[1]) * s + n[1] / nl * o]
    // ribs: a proud band over each spandrel, its top, its underside
    const ao = outer(to[k], RO + 0.4), bo = outer(to[k + 1], RO + 0.4)
    for (const [, z1] of bands) {
      const r0 = z1, r1 = Math.min(z1 + 3.6, ZSIGN)
      face(concrete, [V(ao, r0), V(bo, r0), V(bo, r1), V(ao, r1)], n)
      face(concrete, [V(a, r1), V(b, r1), V(bo, r1), V(ao, r1)], [0, 0, 1])
    }
    if (L < 1.5) continue
    const pier = k % (NO / PIERS) === 0 ? PIER / L : 0
    for (const [z0, z1] of bands) face(win, [V(off(a, pier, 0.05), z0), V(off(a, 1, 0.05), z0), V(off(a, 1, 0.05), z1), V(off(a, pier, 0.05), z1)], n)
  }
  // --- The sign ring, standing 0.35 m proud, with a concrete lip over it.
  for (let k = 0; k < NO; k++) {
    const a = outer(to[k], RO + 0.35), b = outer(to[k + 1], RO + 0.35), a0 = outer(to[k]), b0 = outer(to[k + 1])
    const n: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    face(sign, [V(a, ZSIGN + 0.6), V(b, ZSIGN + 0.6), V(b, H - 1.2), V(a, H - 1.2)], n)
    face(sign, [V(a0, ZSIGN + 0.6), V(b0, ZSIGN + 0.6), V(b, ZSIGN + 0.6), V(a, ZSIGN + 0.6)], [0, 0, -1])
    face(concrete, [V(a0, ZSIGN), V(b0, ZSIGN), V(b0, ZSIGN + 0.6), V(a0, ZSIGN + 0.6)], n)
    face(concrete, [V(a, H - 1.2), V(b, H - 1.2), V(b, H), V(a, H)], n)
    face(concrete, [V(a0, H - 1.2), V(b0, H - 1.2), V(b, H - 1.2), V(a, H - 1.2)], [0, 0, -1])
  }
  // --- The core: the inner wall faces the hole, with its own window bays.
  for (let k = 0; k < NI; k++) {
    const a: [number, number] = [RI * Math.cos(ti[k]), RI * Math.sin(ti[k])], b: [number, number] = [RI * Math.cos(ti[k + 1]), RI * Math.sin(ti[k + 1])]
    const n: V3 = [-(b[1] - a[1]), b[0] - a[0], 0] // inwards
    face(concrete, [V(a, 0), V(b, 0), V(b, H), V(a, H)], n)
    const nl = Math.hypot(n[0], n[1]), L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const off = (s: number, o: number): [number, number] => [a[0] + (b[0] - a[0]) * s + n[0] / nl * o, a[1] + (b[1] - a[1]) * s + n[1] / nl * o]
    const mid = (ti[k] + ti[k + 1]) / 2
    if (Math.abs(Math.atan2(Math.sin(mid - 2.79), Math.cos(mid - 2.79))) < 0.3) continue // behind the lift tower
    const pier = k % 4 === 0 ? 1.2 / L : 0
    for (const [z0, z1] of [...bands, [ZSIGN + 3, H - 3] as [number, number]]) face(win, [V(off(pier, 0.05), z0), V(off(1, 0.05), z0), V(off(1, 0.05), z1), V(off(pier, 0.05), z1)], n)
  }
  // --- The roof: a flat ring with a low parapet inside the lip.
  for (let k = 0; k < NO; k++) {
    const a = outer(to[k], RO + 0.35), b = outer(to[k + 1], RO + 0.35)
    const t0 = to[k], t1 = to[k + 1]
    const ia: [number, number] = [RI * Math.cos(t0), RI * Math.sin(t0)], ib: [number, number] = [RI * Math.cos(t1), RI * Math.sin(t1)]
    face(roof, [V(a, H), V(b, H), V(ib, H), V(ia, H)], [0, 0, 1])
  }
  // --- The lift tower in the core, against its west wall (q7).
  {
    const t = 2.79, c = Math.cos(t), s = Math.sin(t), r0 = RI + 0.5, r1 = RI - 6, w = 3.5
    const P = (r: number, u: number): [number, number] => [r * c - u * s, r * s + u * c]
    const ring = [P(r1, -w), P(r0, -w), P(r0, w), P(r1, w)]
    for (let i = 0; i < 4; i++) {
      const a = ring[i], b = ring[(i + 1) % 4], n: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
      face(concrete, [V(a, 0), V(b, 0), V(b, H + 4), V(a, H + 4)], n)
    }
    face(roof, ring.map((p) => V(p, H + 4)), [0, 0, 1])
  }
  // roof plant: a small box on the east (estimated)
  box(concrete, 14, -4, 19, 4, H, H + 3)

  return [
    { part: concrete, material: finish('ponte-concrete', 0xbcb8b0) },
    { part: win, material: { ...PALETTE.window, color: 0x7d8a96 } },
    { part: sign, material: finish('neon-ponte-sign', 0xd23b37) },
    { part: roof, material: PALETTE.roof },
  ] as Slot[]
}

if (import.meta.main) await writeModel(`${ID}.glb`, NAME, build(), { anchor: ANCHOR, bearing: 0 }, 5000, 250_000)
