/**
 * Japan Center, Frankfurt am Main: procedural, CC0-1.0.
 * bun generators/frankfurt-japan-center.ts
 *
 * Joachim Ganz and Walter Rolfes, 1994-1996: a 115 m office tower of 27
 * storeys on a 36.9 m square plan, clad in reddish (terracotta-coloured)
 * granite on a grid derived from the tatami mat, under a wide dark roof
 * that recalls a Japanese stone lantern. Its office floors come in
 * six-storey blocks; in each block one pair of opposite faces has a patch
 * of large windows (open-plan offices) and the others small square ones
 * (single offices), the pairs turning 90 degrees from block to block.
 *
 * Identity, in order: the square red granite shaft; the wide dark roof
 * that oversails it by about 7 m, with a sloping underside whose corners
 * drop like hip rafters to the building's corners; the row of tall granite
 * piers standing free in front of the dark top storey under the roof; the
 * patches of large grey-framed windows among the small punched ones; the
 * tall arcade and louvred bays at the foot.
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin: the area
 * centroid of OSM way/11527497 (50.111289, 8.672421). The square is turned
 * so its faces look to bearings 59.7 (NE), 149.7 (SE), 239.7 (SW) and
 * 329.7 (NW); centre (0, 0.05), half-width 18.45 m (OSM; 36.9 m published).
 * y = 0 is the lowest ground under the footprint.
 *
 * Heights, scaled from b (the SW face square-on, 0.068 m a pixel; total
 * 117 m in the photo, scaled to the published 115 m):
 * - roof top 115 (published total, OSM height 115); eave fascia 114.3-115;
 *   eaves 7.3 m out from the faces (b: roof 51.5 m wide over a 36.9 m shaft);
 * - the roof's underside meets the faces at 106 m and drops at the corners
 *   to 87 m (b: the roof's silhouette beyond the shaft's corners);
 * - the free piers, 11 a face, 98.5-106 m, in front of a dark top storey
 *   set 2.5 m back; a pale band at 97.5-98.5;
 * - office floors 28-97.5 m in three blocks of six storeys (3.86 m), with
 *   pale bands between blocks (b);
 * - the louvred bays 13-28 m (four storeys, five tall bays a face, b, d, e);
 * - the arcade 0-13 m: piers at the face line, the glazed wall 2.5 m back
 *   (b, f; Wikipedia: "transparente Sockelzone mit umlaufender Arkade").
 * - windows: 10 bays a face; the large-window patch the middle 6 bays of a
 *   block (b). Which faces carry the patch in which block is read from b
 *   (SW face, middle block), c (from the west: NW face, top block) and e
 *   (top block on the right-hand face); the rest follow the published rule
 *   (opposite faces alike, turning 90 degrees a block).
 *
 * Evidence (Wikimedia Commons):
 * - a https://commons.wikimedia.org/wiki/File:Japan_Center,_Frankfurt,_South_view_20211016_1.jpg
 *   DXR, CC BY-SA 4.0.
 * - b https://commons.wikimedia.org/wiki/File:Japan_Center,_Frankfurt,_Southwest_view_20211016_1.jpg
 *   DXR, CC BY-SA 4.0: the SW face square-on, full height.
 * - c https://commons.wikimedia.org/wiki/File:Frankfurt_Japan_Center.JPG
 *   Tilman AB, CC0: the top from the Taunusanlage.
 * - d https://commons.wikimedia.org/wiki/File:Frankfurt_am_Main_-_Japan_Center.jpg
 *   Fred Romero, CC BY 2.0: a corner from below, the roof's hip.
 * - e https://commons.wikimedia.org/wiki/File:Japan_Center_Frankfurt_Hesse_Germany.JPG
 *   ArcCan, CC BY-SA 3.0: a corner from below.
 * - f https://commons.wikimedia.org/wiki/File:Frankfurt.Japan-Center.Taunustor_2-4.20150909.jpg
 *   Epizentrum, CC BY-SA 3.0: from the Taunustor, full height.
 * - OSM (API, 2026-11): way/11527497 (115 m, 27 levels, colour brown).
 * - Published: de.wikipedia "Japan Center (Frankfurt am Main)" (115 m,
 *   36.9 x 36.9 m, the six-storey blocks, the lantern roof); en.wikipedia.
 * - No lidar (none in Germany). Look-only: none.
 *
 * Colours from the daylight photos: the granite #c4877a (b, sunlit #c98676,
 * shade #9c6157), pulled a little light; the roof charcoal #4f5359; the
 * small windows slate #5f7584; the large windows' grey frames #cfd3d5;
 * the louvres and the top storey a dark grey-blue #56636e.
 *
 * Night: windows are `window`, the louvred bays and the top storey
 * `window-2` (lit); the arcade glazing is `entrance`.
 *
 * Doubts: which faces carry the large-window patch in each block is only
 * partly seen (above); the roof's underside is drawn as flat facets, the
 * real one may be curved; the roof top is not seen in any photo (drawn
 * flat, dark).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { face, prism, saveLods, type XY, type Layer } from './frankfurt-westhafen-tower'

const ID = 'frankfurt-japan-center'
const DEG = Math.PI / 180
const O: XY = [0, 0.05]
const HW = 18.45
const PHI = [30.3, 120.3, 210.3, 300.3] // outward normals of NE, NW, SW, SE (anticlockwise from east)
const TOP = 115, FASCIA = 114.3, EAVE = 25.75
const SOFFIT_FACE = 106, SOFFIT_CORNER = 87, SOFFIT_S = 16.2
const PIER_TOP = 106, PIER_BOT = 98.5, BAND = 97.5
const OFF0 = 28, BLOCK = (BAND - OFF0) / 3
const LOUVRE0 = 13
const BAYS = 10

/** A point on face f: s along it (anticlockwise seen from above), t out from O. */
const F = (f: number, s: number, t: number, z: number): V3 => {
  const c = Math.cos(PHI[f] * DEG), sn = Math.sin(PHI[f] * DEG)
  return [O[0] + c * t - sn * s, O[1] + sn * t + c * s, z]
}
const N = (f: number): V3 => [Math.cos(PHI[f] * DEG), Math.sin(PHI[f] * DEG), 0]
const xy = (p: V3): XY => [p[0], p[1]]
/** The square at half-width h. */
const sq = (h: number): XY[] => [0, 1, 2, 3].map((f) => xy(F(f, -h, h, 0)))
/** A flat rectangle on face f's plane at t, s0..s1, z0..z1. */
const rect = (p: Part, f: number, t: number, s0: number, s1: number, z0: number, z1: number) =>
  face(p, [F(f, s0, t, z0), F(f, s1, t, z0), F(f, s1, t, z1), F(f, s0, t, z1)], N(f))
/** A box standing on face f: s0..s1 along, t0..t1 out, z0..z1. */
const box = (p: Part, f: number, s0: number, s1: number, t0: number, t1: number, z0: number, z1: number, top = true) =>
  prism(p, [xy(F(f, s0, t0, 0)), xy(F(f, s1, t0, 0)), xy(F(f, s1, t1, 0)), xy(F(f, s0, t1, 0))], z0, z1, { top: top ? undefined : null })

// Faces with the large-window patch, per block (bottom, middle, top).
const PATCH: number[][] = [[1, 3], [0, 2, 3], [1]]

const granite = new Part(), win = new Part(), frame = new Part(), roof = new Part(), dark = new Part(), lobby = new Part()

// ── the shaft: arcade core, then the granite body ──
const ARC_IN = 2.5
prism(lobby, sq(HW - ARC_IN), 0, LOUVRE0 - 1.2, { top: null })
// the arcade's ceiling, and the body over it
{
  const r = sq(HW)
  prism(granite, r, LOUVRE0 - 1.2, BAND, { top: null, bottom: granite })
}
// arcade piers at the face line, under the louvred bays' piers: six a
// face, the corner ones shared (b)
for (let f = 0; f < 4; f++) {
  const n = 5, end = 1.6, gap = 1.6, w = (2 * HW - 2 * end - (n - 1) * gap) / n
  box(granite, f, -HW, -HW + end, HW - end, HW, 0, LOUVRE0 - 1.2, false)
  for (let k = 1; k < n; k++) {
    const s0 = -HW + end + k * w + (k - 1) * gap
    box(granite, f, s0, s0 + gap, HW - 1.6, HW, 0, LOUVRE0 - 1.2, false)
  }
}

// ── louvred bays and windows on each face ──
for (let f = 0; f < 4; f++) {
  const out = HW + 0.05
  // louvred zone: five tall dark bays between granite piers (b, d, e)
  {
    const n = 5, end = 1.6, gap = 1.6, w = (2 * HW - 2 * end - (n - 1) * gap) / n
    for (let k = 0; k < n; k++) {
      const s0 = -HW + end + k * (w + gap)
      rect(dark, f, out, s0, s0 + w, LOUVRE0 + 0.6, OFF0 - 1.2)
    }
  }
  // office blocks: six storeys, in groups of two storeys a panel
  const bw = (2 * HW - 1.2) / BAYS
  for (let b = 0; b < 3; b++) {
    const z0 = OFF0 + b * BLOCK, z1 = z0 + BLOCK
    const patch = PATCH[b].includes(f)
    for (let g = 0; g < 3; g++) {
      const za = z0 + g * (BLOCK / 3), zb = za + BLOCK / 3
      for (let k = 0; k < BAYS; k++) {
        const s0 = -HW + 0.6 + k * bw, s1 = s0 + bw
        const big = patch && k >= 2 && k < 8
        if (big) {
          // the large windows: a pale frame with the glass inside it
          rect(frame, f, out, s0 + 0.15, s1 - 0.15, za + 0.2, zb - 0.2)
          rect(win, f, out + 0.04, s0 + 0.55, s1 - 0.55, za + 0.6, zb - 0.6)
        } else {
          // a square punched window for every two storeys: the real grid
          // at half its density, so it reads without shimmering
          const m = (bw - 2.1) / 2, zc = (za + zb) / 2
          rect(win, f, out, s0 + m, s1 - m, zc - 1.1, zc + 1.1)
        }
      }
    }
    // the pale band over each block (b)
    if (b < 2) rect(frame, f, out, -HW, HW, z1 - 0.25, z1 + 0.25)
  }
  rect(frame, f, out, -HW, HW, OFF0 - 0.55, OFF0 - 0.05)
}

// ── the top: pale band, dark recessed storey, free piers ──
{
  prism(frame, sq(HW + 0.1), BAND, PIER_BOT, { top: null })
  prism(dark, sq(HW - 2.5), PIER_BOT, SOFFIT_FACE + 1, { top: null })
  capRingFlat(frame, sq(HW + 0.1), sq(HW - 2.5), PIER_BOT)
  for (let f = 0; f < 4; f++) {
    const bw = (2 * HW) / BAYS
    for (let k = 0; k < BAYS; k++) {
      const sc = -HW + k * bw
      const w = 1.0
      if (k === 0) box(granite, f, -HW, -HW + 1.4, HW - 1.4, HW, PIER_BOT, PIER_TOP + 1, false)
      else box(granite, f, sc - w / 2, sc + w / 2, HW - 1.6, HW, PIER_BOT, PIER_TOP + 1, false)
    }
  }
}

/** A flat ring between an outer and an inner square, facing up. */
function capRingFlat(p: Part, o: XY[], i: XY[], z: number) {
  for (let k = 0; k < 4; k++) {
    const j = (k + 1) % 4
    p.quad([o[k][0], o[k][1], z], [o[j][0], o[j][1], z], [i[j][0], i[j][1], z], [i[k][0], i[k][1], z])
  }
}

// ── the roof: flat top, fascia, sloping underside with dropped corners ──
{
  const e = sq(EAVE)
  prism(roof, e, FASCIA, TOP)
  for (let f = 0; f < 4; f++) {
    const E1 = F(f, -EAVE, EAVE, FASCIA), E2 = F(f, EAVE, EAVE, FASCIA)
    const C1 = F(f, -HW, HW, SOFFIT_CORNER), C2 = F(f, HW, HW, SOFFIT_CORNER)
    const M1 = F(f, -SOFFIT_S, HW, SOFFIT_FACE), M2 = F(f, SOFFIT_S, HW, SOFFIT_FACE)
    // all facing down and out
    roof.tri(E1, M2, E2)
    roof.tri(E1, M1, M2)
    roof.tri(E2, M2, C2)
    roof.tri(E1, C1, M1)
  }
}

const mats: Layer[] = [
  { part: granite, material: finish('japan-center-granite', 0xc4877a) },
  { part: win, material: { ...PALETTE.window, color: 0x5f7584 } },
  { part: frame, material: finish('japan-center-frame', 0xcfd3d5) },
  { part: roof, material: finish('japan-center-roof', 0x4f5359) },
  { part: dark, material: windowVariant(2, 0x56636e) },
  { part: lobby, material: { ...PALETTE.entrance, color: 0x6b7a85 } },
]

await saveLods(ID, 'Japan Center', mats, null, { anchor: [50.111289, 8.672421], bearing: 0, elevation: 0, height: TOP })
