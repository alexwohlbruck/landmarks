/**
 * Petřín Lookout Tower (Petřínská rozhledna), Prague: procedural, CC0-1.0.
 *   bun generators/prague-petrin-tower.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/prague-petrin-tower.glb, the low model: the octagonal lattice as
 *   real members (eight corner posts, a ring and an X brace in every face
 *   of every storey), the two galleries, the antenna and the pavilion;
 * - models/prague-petrin-tower.detail.glb, drawn from zoom 17: the lattice
 *   with square members and a third tier in the legs, the lift shaft with
 *   the two spiral stairs round it, railings, the glazing bars, the iron
 *   brackets over the pavilion and the antenna's open frame.
 *
 * Uses the kit exported by generators/prague-dancing-house.ts.
 *
 * Frame: not turned (BEARING 0): +x east, +y north, z up, metres. Origin =
 * the tower's axis, the common centre of OSM's octagons (way/456174848,
 * way/467431208, way/467431211), 1.5 m south of the brief's anchor; the
 * anchor below is moved to it. y = 0 is the lowest ground under the
 * pavilion, on its north side, where its brick base storey shows.
 *
 * Evidence
 * - OSM way/7645353 (Petřínská rozhledna, building=civic, height 60, the
 *   pavilion's outline, r 12-14 with its buttresses, 1891, Q12256) and the
 *   parts: way/27337091 (the pavilion, 2 m), way/456174848 (the lattice's
 *   foot, an octagon r 11 with corners at 20 + 45k degrees),
 *   way/467431211 (the lower platform, 18-22 m, r 7.7), way/467431208 (the
 *   shaft, an octagon r 5.4), way/453258654 (the upper gallery, 50-55 m),
 *   way/453258656 (the antenna, 66 m).
 * - Published (en/cs.wikipedia "Petřín Lookout Tower"): 63.5 m; built 1891
 *   for the Jubilee Exhibition, after the Eiffel Tower, by the Club of
 *   Czech Tourists (Vratislav Pasovský, František Prášil); octagonal; 299
 *   steps in two spiral staircases, one up and one down, round a lift;
 *   galleries at about 20 m and 55 m.
 * - Mapterhorn z14 terrain (bun tools/terrain.ts grid): the hilltop falls
 *   about 2.5 m from the south side of the pavilion to its north side.
 * - Commons photos (EVIDENCE):
 *   "Torre de observación de Petřín, Praga, República Checa, 2022-07-02, DD
 *   163.jpg" (Diego Delso, CC BY-SA 4.0; a level telephoto: the shaft and
 *   both galleries are measured on it, 25.3 px/m between OSM's platform and
 *   gallery heights); "Petřín Lookout Tower.jpg" and "Petřínská
 *   rozhledna-Prague-2.jpg" (Yair Haklai, CC BY-SA 4.0 / 3.0; the upper
 *   gallery close up: its corrugated parapet, glazing and copper roof);
 *   "Petřínská rozhledna - BugWarp 01.jpg" (BugWarp, CC BY-SA 4.0; the
 *   lower section's splayed legs and bracing from the pavilion);
 *   "Petřínská rozhledna, Prague.jpg" (Ivan Korostelev, CC BY-SA 4.0; the
 *   whole tower over the pavilion); "Petřínská rozhledna, pata.jpg" (ŠJů,
 *   CC BY-SA 3.0; the pavilion's brick base storey, terrace and iron
 *   brackets); "Petřín Lookout Tower - Prague, Czech Republic - May 17,
 *   2019.jpg" (Giorgio Galeotti, CC BY 4.0); "Petřín Lookout Tower at
 *   night.jpg" (Berlinuno, CC BY-SA 4.0; lit gold from inside).
 *
 * Measured (Delso, heights above the pavilion's floor): the lower platform's
 * deck at 17 m, 15 m across with its railing; the glazed lower gallery on
 * it, 11.5 m across, to 21.5 m; the shaft 9.4 m across there and 4.9 m at
 * 50 m, straight between; storeys of about 3.3 m, each face X-braced; the
 * upper gallery 7.8 m across, its solid parapet 50-51.8, glazing to 54.3,
 * copper roof to 55.7; the antenna to 66 m (OSM). Estimated: the lower
 * section's curve (the corner posts sweep from r 11 at the foot to the
 * platform, as in BugWarp's photo); the pavilion (r 9.6 white storey on an r
 * 12.3 brick base storey 2.6 m high, from ŠJů's photo and the terrain); the
 * member sizes, drawn heavier than real (posts 0.5 m, braces 0.3 m in the low
 * model) so the frame reads; the lift shaft (1.2 m) and the stairs.
 *
 * Left out: the rivets and the lattice girders' own lacing, the souvenir
 * kiosk, the antennas' cabling.
 *
 * Doubts: the pavilion's plan is simplified to octagons; the terrain is
 * coarse (z14), so the 2.6 m base storey is the photo's, not a survey.
 *
 * Colours: the steel painted a dark grey-blue (#4d5a66, as in Delso's and
 * Korostelev's photos), the galleries' parapets a lighter grey; the
 * pavilion white with a dark roof; brick only on the base storey's north
 * (downhill) faces, where ŠJů's photo shows it.
 *
 * Night: the whole frame is lit warm gold from inside (floodlight), the
 * galleries and pavilion windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { TAU, add, mul, sub, lathe, loftSmooth, tube, rod, bar, box, prism, triN, quadN, saveLods, type PartList, type XY } from './prague-dancing-house'

type Lod = { detail: boolean }

const BASE = 2.6 // the pavilion's floor and the legs' feet, above the lowest ground
const A0 = (20 * Math.PI) / 180 // the octagon's first corner (maths angle)
const corner = (k: number) => A0 + (k * TAU) / 8
const Z_DECK = 17, Z_GAL = 50
/** Corner-post radius (to the octagon's corners) at height z above BASE. */
function R(z: number) {
  if (z <= Z_DECK) return 5.1 + 5.9 * Math.pow((Z_DECK - z) / Z_DECK, 1.25)
  return 5.1 + (2.65 - 5.1) * ((z - Z_DECK) / (Z_GAL - Z_DECK))
}
const P = (k: number, z: number, dr = 0): V3 => [(R(z) + dr) * Math.cos(corner(k)), (R(z) + dr) * Math.sin(corner(k)), BASE + z]
const oct = (r: number, rot = A0): XY[] => Array.from({ length: 8 }, (_, k) => [r * Math.cos(rot + (k * TAU) / 8), r * Math.sin(rot + (k * TAU) / 8)] as XY)

function build(L: Lod): PartList {
  const iron = new Part(), wall = new Part(), brick = new Part(), win = new Part(), grey = new Part(), copper = new Part()
  const post = L.detail ? 0.34 : 0.42, brace = L.detail ? 0.14 : 0.22, ring = L.detail ? 0.17 : 0.25
  const S = L.detail ? 4 : 3 // member sides
  const member = (a: V3, b: V3, r: number) => rod(iron, a, b, r / 2 / Math.cos(Math.PI / S), S, false)

  // --- the lattice: levels up the lower section and the shaft ---
  const lower = L.detail ? [0, 5.8, 11.5, Z_DECK] : [0, 8.5, Z_DECK]
  const shaftN = 10
  const shaft = Array.from({ length: shaftN + 1 }, (_, i) => Z_DECK + ((Z_GAL - Z_DECK) * i) / shaftN)
  const levels = [...lower, ...shaft.slice(1)]
  for (let k = 0; k < 8; k++) {
    // the corner post, following the curve
    const pts = levels.map((z) => P(k, z))
    tube(iron, pts, (i) => (levels[i] < Z_DECK ? post * 1.25 : post) / 2 / Math.cos(Math.PI / S), S, false)
  }
  if (L.detail) {
    // the corner posts are lattice girders: an inner chord and zigzag lacing
    for (let k = 0; k < 8; k++) {
      const n = 64
      const zs = Array.from({ length: n + 1 }, (_, i) => (Z_GAL * i) / n)
      tube(iron, zs.map((z) => P(k, z, -0.6)), 0.12, 4, false)
      for (let i = 0; i < n; i++) member(P(k, zs[i], i % 2 ? -0.6 : 0), P(k, zs[i + 1], i % 2 ? 0 : -0.6), 0.08)
    }
  }
  for (let l = 0; l < levels.length; l++) {
    const z = levels[l]
    for (let k = 0; k < 8; k++) {
      const j = (k + 1) % 8
      if (z > 0) member(P(k, z), P(j, z), ring)
      if (l < levels.length - 1) {
        const z1 = levels[l + 1]
        member(P(k, z), P(j, z1), brace)
        member(P(j, z), P(k, z1), brace)
      }
    }
  }
  // --- the lower platform and its glazed gallery ---
  {
    const zf = BASE + Z_DECK
    prism(grey, oct(7.7), zf - 0.7, zf, grey, grey)
    // brackets from the posts out under the deck's edge
    for (let k = 0; k < 8; k++) member(P(k, Z_DECK - 3.2), [7.4 * Math.cos(corner(k)), 7.4 * Math.sin(corner(k)), zf - 0.7], brace)
    // the railing round the deck
    if (L.detail) {
      const o = oct(7.55)
      for (let k = 0; k < 8; k++) {
        const a = o[k], b = o[(k + 1) % 8]
        for (let i = 0; i < 5; i++) {
          const t = i / 5
          const p: V3 = [lerp(a[0], b[0], t), lerp(a[1], b[1], t), zf]
          rod(iron, p, [p[0], p[1], zf + 1.1], 0.05, 4, false)
        }
        rod(iron, [a[0], a[1], zf + 1.1], [b[0], b[1], zf + 1.1], 0.07, 4, false)
        rod(iron, [a[0], a[1], zf + 0.5], [b[0], b[1], zf + 0.5], 0.04, 4, false)
      }
    } else {
      const o = oct(7.55)
      for (let k = 0; k < 8; k++) {
        const a = o[k], b = o[(k + 1) % 8]
        rod(iron, [a[0], a[1], zf + 1.1], [b[0], b[1], zf + 1.1], 0.09, 3, false)
        rod(iron, [a[0], a[1], zf], [a[0], a[1], zf + 1.1], 0.07, 3, false)
      }
    }
    // the gallery: a solid lower band, glazing, a low roof
    const g = oct(5.75)
    prism(grey, g, zf, zf + 1.1, null)
    prism(win, oct(5.7), zf + 1.1, zf + 3.6, null)
    lathe(grey, 0, 0, [[5.95, zf + 3.6], [5.95, zf + 3.95], [4.6, zf + 4.4]], 8, A0)
    if (L.detail) {
      for (let k = 0; k < 8; k++) {
        const a = g[k], b = g[(k + 1) % 8]
        for (const t of [0, 1 / 3, 2 / 3]) {
          const p: XY = [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]
          rod(iron, [p[0] * 1.01, p[1] * 1.01, zf + 1.1], [p[0] * 1.01, p[1] * 1.01, zf + 3.6], 0.06, 4, false)
        }
        rod(iron, [a[0] * 1.01, a[1] * 1.01, zf + 2.6], [b[0] * 1.01, b[1] * 1.01, zf + 2.6], 0.05, 4, false)
      }
    }
  }

  // --- the upper gallery: corrugated parapet, glazing, copper roof, on consoles ---
  {
    const z0 = BASE + Z_GAL
    prism(grey, oct(3.9), z0, z0 + 1.8, null, grey)
    prism(win, oct(3.8), z0 + 1.8, z0 + 4.3, null)
    lathe(copper, 0, 0, [[4.1, z0 + 4.3], [4.1, z0 + 4.55], [2.6, z0 + 5.4], [1.2, z0 + 5.7], [0, z0 + 5.7]], 8, A0)
    for (let k = 0; k < 8; k++) {
      // consoles: from the posts below out to the gallery's corners
      member(P(k, Z_GAL - 3.5), [3.8 * Math.cos(corner(k)), 3.8 * Math.sin(corner(k)), z0], ring)
      if (L.detail) {
        const a = oct(3.82)[k], b = oct(3.82)[(k + 1) % 8]
        for (const t of [0, 0.5]) {
          const p: XY = [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]
          rod(iron, [p[0], p[1], z0 + 1.8], [p[0], p[1], z0 + 4.3], 0.05, 4, false)
        }
        // the parapet's corrugation: a rib every half metre
        const n = 6
        for (let i = 1; i < n; i++) {
          const t = i / n
          const q: XY = [lerp(a[0], b[0], t) * 1.03, lerp(a[1], b[1], t) * 1.03]
          rod(grey, [q[0], q[1], z0 + 0.1], [q[0], q[1], z0 + 1.7], 0.05, 3, false)
        }
      }
    }
    // the antenna: a mast with three cages of panel antennas, to 66 m
    const zr = z0 + 5.7
    rod(iron, [0, 0, zr - 0.2], [0, 0, BASE + 66], 0.22, L.detail ? 8 : 5, true)
    for (const [za, zb] of [[zr + 1.2, zr + 3.2], [zr + 4.0, zr + 6.0], [zr + 6.8, zr + 8.6]]) {
      if (L.detail) {
        for (let k = 0; k < 4; k++) {
          const a = Math.PI / 4 + (k * TAU) / 4
          const c: XY = [1.0 * Math.cos(a), 1.0 * Math.sin(a)]
          rod(iron, [c[0], c[1], za], [c[0], c[1], zb], 0.05, 4, false)
          const d: XY = [1.0 * Math.cos(a + TAU / 4), 1.0 * Math.sin(a + TAU / 4)]
          rod(iron, [c[0], c[1], za], [d[0], d[1], za], 0.04, 4, false)
          rod(iron, [c[0], c[1], zb], [d[0], d[1], zb], 0.04, 4, false)
          box(grey, [0.75 * Math.cos(a + Math.PI / 4), 0.75 * Math.sin(a + Math.PI / 4), (za + zb) / 2], [-Math.sin(a + Math.PI / 4), Math.cos(a + Math.PI / 4), 0], [0, 0, 1], [Math.cos(a + Math.PI / 4), Math.sin(a + Math.PI / 4), 0], 0.25, (zb - za) / 2 - 0.2, -0.1, 0.1, true)
        }
      } else {
        prism(grey, oct(0.75, Math.PI / 8), za, zb, grey, grey)
      }
    }
    lathe(iron, 0, 0, [[1.7, zr], [1.7, zr + 0.3], [0.2, zr + 0.35]], 8, A0)
  }

  // --- inside: the lift shaft and, in the detail model, the two spiral stairs ---
  prism(grey, oct(1.15, Math.PI / 8), BASE + 4.2, BASE + Z_GAL, null)
  if (L.detail) {
    for (const ph of [0, Math.PI]) {
      const pts: V3[] = []
      const z0 = BASE + 4.5, z1 = BASE + Z_GAL - 0.5, turns = (z1 - z0) / 4.2
      const n = Math.round(turns * 16)
      for (let i = 0; i <= n; i++) {
        const t = i / n, a = ph + t * turns * TAU
        pts.push([2.0 * Math.cos(a), 2.0 * Math.sin(a), z0 + (z1 - z0) * t])
      }
      bar(iron, pts, 0.9, 0.18, (i) => [Math.cos(ph + (i / n) * turns * TAU), Math.sin(ph + (i / n) * turns * TAU), 0])
    }
  }

  // --- the pavilion: a brick base storey with a terrace, the white storey, its roof ---
  {
    // the base storey: brick only where it stands clear of the hill, on the
    // north (downhill) faces; elsewhere it is the pavilion's white render
    {
      const o = oct(12.3)
      for (let k = 0; k < 8; k++) {
        const a = o[k], b = o[(k + 1) % 8], l = Math.hypot(b[0] - a[0], b[1] - a[1])
        const n: V3 = [(b[1] - a[1]) / l, -(b[0] - a[0]) / l, 0]
        quadN(n[1] > 0.3 ? brick : wall, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], BASE], [a[0], a[1], BASE], n)
      }
      for (const [i, j, k] of [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 5], [0, 5, 6], [0, 6, 7]]) triN(grey, [o[i][0], o[i][1], BASE], [o[j][0], o[j][1], BASE], [o[k][0], o[k][1], BASE], [0, 0, 1])
    }
    const w = oct(9.6)
    prism(wall, w, BASE, BASE + 4.2, null)
    lathe(iron, 0, 0, [[9.9, BASE + 4.2], [9.9, BASE + 4.5], [5.3, BASE + 5.6], [1.2, BASE + 5.8]], 8, A0)
    // windows: two to a face
    for (let k = 0; k < 8; k++) {
      const a = w[k], b = w[(k + 1) % 8]
      const l = Math.hypot(b[0] - a[0], b[1] - a[1])
      const u: V3 = [(b[0] - a[0]) / l, (b[1] - a[1]) / l, 0], n: V3 = [u[1], -u[0], 0]
      for (const t of [0.3, 0.7]) {
        const c: V3 = [lerp(a[0], b[0], t), lerp(a[1], b[1], t), BASE + 2.1]
        const door = k === 6 && t === 0.3 // the entrance, to the south
        box(door ? win : win, door ? [c[0], c[1], BASE + 1.4] : c, u, [0, 0, 1], n, door ? 0.75 : 0.6, door ? 1.4 : 0.9, -0.05, 0.05)
      }
      // brick base storey: arched windows on the downhill side
      if (Math.sin(A0 + ((k + 0.5) * TAU) / 8) > 0.3) {
        const o = oct(12.3), p = o[k], q = o[(k + 1) % 8]
        const ll = Math.hypot(q[0] - p[0], q[1] - p[1]), uu: V3 = [(q[0] - p[0]) / ll, (q[1] - p[1]) / ll, 0], nn: V3 = [uu[1], -uu[0], 0]
        box(win, [lerp(p[0], q[0], 0.5), lerp(p[1], q[1], 0.5), 1.15], uu, [0, 0, 1], nn, 0.8, 0.8, -0.05, 0.05)
      }
    }
    // the terrace railing on the brick storey
    {
      const o = oct(12.1)
      for (let k = 0; k < 8; k++) {
        const a = o[k], b = o[(k + 1) % 8]
        rod(iron, [a[0], a[1], BASE + 1.0], [b[0], b[1], BASE + 1.0], 0.07, L.detail ? 4 : 3, false)
        rod(iron, [a[0], a[1], BASE], [a[0], a[1], BASE + 1.0], 0.06, L.detail ? 4 : 3, false)
      }
    }
    if (L.detail) {
      // the iron brackets: an arc from each leg to the pavilion's eaves
      for (let k = 0; k < 8; k++) {
        const a = corner(k), pts: V3[] = []
        for (let i = 0; i <= 8; i++) {
          const t = i / 8
          const r = lerp(R(3.4), 9.7, t), z = BASE + lerp(3.4, 4.3, t) + 1.4 * Math.sin(Math.PI * t)
          pts.push([r * Math.cos(a), r * Math.sin(a), z])
        }
        tube(iron, pts, 0.09, 4, false)
      }
    }
  }

  const lit = (p: V3, n: V3) => (p[2] > BASE + 4 ? (n[2] > 0.7 ? 0.5 : 0.95) : 0.3)
  return [
    { part: iron, material: { ...finish('petrin-iron', 0x4d5a66), floodlight: lit } },
    { part: wall, material: { ...PALETTE.trim, floodlight: () => 0.5 } },
    { part: brick, material: finish('petrin-brick', 0xb4735c) },
    { part: win, material: PALETTE.window },
    { part: grey, material: { ...PALETTE.roof, color: 0x6c7782, floodlight: lit } },
    { part: copper, material: finish('petrin-copper', 0xa77f5e) },
  ]
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
void add; void mul; void sub; void loftSmooth; void triN; void quadN

if (import.meta.main) {
  await saveLods('prague-petrin-tower', 'Petřín Lookout Tower', build({ detail: false }), build({ detail: true }), {
    anchor: [50.083506, 14.395086], bearing: 0, height: 68.6,
  })
}
