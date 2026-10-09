/**
 * Metropolitan Life Insurance Company Tower (5 Madison Avenue), Manhattan — procedural, CC0-1.0, no textures.
 * bun generators/nyc-metlife-tower.ts
 *
 * Map frame: x = model east (East 24th Street runs along x), y = model north
 * (Madison Avenue runs along y), z up, metres. Placed at bearing 29°, the
 * Manhattan grid. Anchor: area centroid of the tower's OSM outline
 * way/158404390. The model is the tower only; the 1 Madison block that wraps
 * its south and east sides (way/109280428 and its parts) is a separate
 * building and stays on the map.
 *
 * Identifying features (from the photos): a tall plain pale shaft in a
 * 1:8 ratio; the four big clock faces (8 m dials, blue tiled ring) high on the
 * shaft; the five-arch loggia with a balustrade under the top; the narrower
 * block over it; the steep stone pyramid with dormers; the square platform,
 * open peristyle, gilded cupola and lantern.
 *
 * Evidence
 * - OSM way/158404390 (outline, 25.6 × 22.4 m, h 150) and parts 263480034
 *   (cupola circle, r 3.6 m, 206 m), 263480035 (finial, 213.4 m),
 *   263480036–42 (pyramid faces and platform, 190 m), 263480038 (165 m).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), profiles through the centre in the
 *   model frame (/tmp/city/nyc/work/nyc-metlife-tower/lid.png, rot.png),
 *   heights above the street (10.9 m NAVD88): shaft to 135–138 m at its
 *   outline; the block above it set back ~1.8 m to 151–153 m; pyramid from
 *   ±10 m at 153 m to the platform (±5.5 m) at 182 m; peristyle and cupola
 *   194–203 m (r ≈ 4 m); lantern 207 m; finial 211.5 m. Neighbours stand
 *   35–60 m against the south and east sides.
 * - Published: 1909, N. LeBrun & Sons, after St Mark's Campanile; 700 ft
 *   (213 m), 50 floors; 75 × 85 ft plan; four clock faces 26.5 ft (8.1 m)
 *   across on floors 25–27, blue glazed tile round each; shaft of three
 *   triple windows per side per floor; a five-arch loggia on floors 31–33
 *   with a balustrade; floors 35–38 a freestanding plinth; pyramid with
 *   hooded dormers from floor 39; square viewing platform on 45, a peristyle
 *   of eight columns on 46–47, a gold-coloured cupola on 48 (Wikipedia, NRHP).
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-metlife-tower/photos/credits.txt: from Madison
 *   Square Park (west, Ryan Schwark CC0; south-west, Acediscovery CC BY 4.0),
 *   from the East River (east, Tony Hisgett CC BY 2.0, two shots).
 *
 * Estimated: storey heights (4.1 m) and the window grouping (one panel per
 * triple window, three floors), the clock's square surround, the arcade's
 * proportions and the dormer rows (from the East River photos), the
 * peristyle's piers, the cupola's profile. Windows start at 48 m on the
 * south and east faces, which neighbours hide below that (published: none
 * below the 11th/12th floors there).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, finishModel, circle, capPoly } from './nyc-570-lexington'
import { archPanel, rectPanel, discPanel, band, block, spread, wallFrame } from './nyc-city-hall'

const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), gold = new Part(), blue = new Part()

const rect = (hx: number, hy: number): XY[] => [[-hx, -hy], [hx, -hy], [hx, hy], [-hx, hy]]
const edges = (r: XY[]) => r.map((a, i) => [a, r[(i + 1) % r.length]] as [XY, XY])
const len = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

// --- Heights (lidar, above the street) ---
const HX = 12.8, HY = 11.2
const SHAFT_TOP = 120.5 // cornice under the loggia
const LOGGIA_TOP = 138 // balustrade over the arcade
const PLINTH_TOP = 152.5 // cornice under the pyramid
const PYR_TOP = 181 // viewing platform
const CLOCK_Z = 103, CLOCK_R = 4.6 // 8.1 m dial plus its tiled rim and moulding

const shaft = rect(HX, HY)
prism({ wall: stone, win: null, roof: null, ring: shaft, z0: 0, z1: SHAFT_TOP, facade: null, bevel: 0.5 })
band(trim, shaft, 0, 1.6, 0.25) // granite water table
band(trim, shaft, 9.2, 10.2, 0.35) // cornice over the two-storey base
band(trim, shaft, SHAFT_TOP - 1.0, SHAFT_TOP, 0.5)

// Shaft windows: three triple-window bays per side, one panel per three floors.
// Faces: 0 south, 1 east, 2 north, 3 west (counter-clockwise ring).
edges(shaft).forEach(([a, b], i) => {
  const L = len(a, b), bays = spread(2.8, L - 2.8, 3), w = (L - 5.6) / 3 * 0.56
  const z0 = i === 0 || i === 1 ? 48 : 11.8
  const floor = 4.1, rowH = floor * 2
  for (let z = z0; z + rowH - 2.6 <= SHAFT_TOP - 8.6; z += rowH) {
    const lo = z, hi = z + rowH - 2.6
    const clockZone = hi > CLOCK_Z - CLOCK_R - 1.4 && lo < CLOCK_Z + CLOCK_R + 1.4
    for (const [k, s] of bays.entries()) {
      // The clock storeys keep only narrow windows hard against the corner piers.
      if (clockZone && k === 1) continue
      if (clockZone) rectPanel(win, a, b, k === 0 ? 2.2 : L - 2.2, 1.0, lo, hi, 0.05)
      else rectPanel(win, a, b, s, w, lo, hi, 0.05)
    }
  }
  // Ground floor: shop windows and the door.
  for (const s of [L * 0.2, L * 0.8]) rectPanel(win, a, b, s, 3.6, 2, 7.6, 0.05)
  // The transitional storeys under the loggia: ten windows in five pairs.
  for (const s of spread(3, L - 3, 5)) rectPanel(win, a, b, s, (L - 6) / 5 * 0.6, SHAFT_TOP - 7.0, SHAFT_TOP - 2.8, 0.05)
  // The clock: a pale square surround spanning three storeys, the blue tiled ring
  // (drawn dark so it reads), a pale dial, and two bold dark hands.
  const m = L / 2
  rectPanel(trim, a, b, m, 2 * CLOCK_R + 2.4, CLOCK_Z - CLOCK_R - 1.2, CLOCK_Z + CLOCK_R + 1.2, 0.07)
  discPanel(blue, a, b, m, CLOCK_Z, CLOCK_R, 0.12, 24)
  discPanel(trim, a, b, m, CLOCK_Z, CLOCK_R - 0.9, 0.17, 24)
  const f = wallFrame(a, b, 0.22)
  const hand = (ang: number, r: number, hw: number) => {
    const c = [m, CLOCK_Z], d = [Math.cos(ang), Math.sin(ang)], q = [-d[1] * hw, d[0] * hw]
    win.quad(f.at(c[0] + q[0] - d[0] * 0.5, c[1] + q[1] - d[1] * 0.5), f.at(c[0] - q[0] - d[0] * 0.5, c[1] - q[1] - d[1] * 0.5), f.at(c[0] - q[0] + d[0] * r, c[1] - q[1] + d[1] * r), f.at(c[0] + q[0] + d[0] * r, c[1] + q[1] + d[1] * r))
  }
  hand(Math.PI * 0.5 + 0.35, 3.3, 0.38) // minute
  hand(-0.25, 2.4, 0.48) // hour
})

// --- The loggia: full width, five tall round arches a side, balustrade over ---
prism({ wall: stone, win: null, roof, ring: shaft, z0: SHAFT_TOP, z1: LOGGIA_TOP, facade: null, bevel: 0.5 })
for (const [a, b] of edges(shaft)) {
  const L = len(a, b), pitch = (L - 4.4) / 5
  for (const s of spread(2.2, L - 2.2, 5)) archPanel(win, a, b, s, pitch * 0.68, SHAFT_TOP + 1.2, LOGGIA_TOP - 3.0, 0.06, 8)
  // The loggia's own railing across the foot of the arches.
  rectPanel(trim, a, b, L / 2, L - 4.0, SHAFT_TOP + 1.2, SHAFT_TOP + 2.4, 0.1)
}
band(trim, shaft, LOGGIA_TOP - 2.4, LOGGIA_TOP - 1.4, 0.5) // cornice
band(trim, shaft, LOGGIA_TOP - 1.4, LOGGIA_TOP, 0.15) // balustrade

// --- The plinth block over the loggia, set back 1.8 m ---
const plinth = rect(HX - 1.9, HY - 1.8)
prism({ wall: stone, win: null, roof, ring: plinth, z0: LOGGIA_TOP, z1: PLINTH_TOP, facade: null, bevel: 0.45 })
for (const [a, b] of edges(plinth)) {
  const L = len(a, b), n = L > 20 ? 6 : 4 // published: six north and south, four east and west
  for (const s of spread(2.2, L - 2.2, n)) { rectPanel(win, a, b, s, 1.3, LOGGIA_TOP + 2.0, LOGGIA_TOP + 5.6, 0.05); rectPanel(win, a, b, s, 1.3, LOGGIA_TOP + 7.0, LOGGIA_TOP + 10.6, 0.05) }
}
band(trim, plinth, PLINTH_TOP - 1.2, PLINTH_TOP, 0.55)

// --- The pyramid: stone, steep, from the plinth's cornice to the platform ---
const PB = [HX - 3.0, HY - 2.9] as const // base half-widths
const PT = [3.4, 3.3] as const // top half-widths
{
  const r0: V3[] = rect(PB[0], PB[1]).map(([x, y]) => [x, y, PLINTH_TOP])
  const r1: V3[] = rect(PT[0], PT[1]).map(([x, y]) => [x, y, PYR_TOP])
  stone.loft([r0, r1])
  // Dormers: rows of small hooded windows, 3-2-2-1 up each face (photos from the east).
  const rows: [number, number][] = [[0.2, 3], [0.42, 2], [0.62, 2], [0.8, 1]]
  for (let f = 0; f < 4; f++) {
    const a0 = r0[f], b0 = r0[(f + 1) % 4], a1 = r1[f], b1 = r1[(f + 1) % 4]
    const at = (s: number, t: number): V3 => {
      // s across the face 0..1, t up 0..1, pushed 0.06 m out along the face normal
      const lo = [a0[0] + (b0[0] - a0[0]) * s, a0[1] + (b0[1] - a0[1]) * s], hi = [a1[0] + (b1[0] - a1[0]) * s, a1[1] + (b1[1] - a1[1]) * s]
      const ex = b0[0] - a0[0], ey = b0[1] - a0[1], el = Math.hypot(ex, ey), nx = ey / el, ny = -ex / el
      return [lo[0] + (hi[0] - lo[0]) * t + nx * 0.06, lo[1] + (hi[1] - lo[1]) * t + ny * 0.06, PLINTH_TOP + (PYR_TOP - PLINTH_TOP) * t + 0.03]
    }
    const H = PYR_TOP - PLINTH_TOP
    for (const [t, n] of rows) {
      const wHalf = (PB[f % 2 === 0 ? 0 : 1] + (PT[f % 2 === 0 ? 0 : 1] - PB[f % 2 === 0 ? 0 : 1]) * t) * 2
      const dw = 1.7 / wHalf, dh = 2.0 / H
      const step = n === 1 ? 0 : Math.min(0.24, 0.6 / (n - 1))
      for (let k = 0; k < n; k++) {
        const s = 0.5 + (k - (n - 1) / 2) * step
        win.quad(at(s - dw / 2, t), at(s + dw / 2, t), at(s + dw / 2, t + dh), at(s - dw / 2, t + dh))
        win.tri(at(s - dw / 2, t + dh), at(s + dw / 2, t + dh), at(s, t + dh + dw * wHalf / H * 0.5))
      }
    }
  }
}

// --- Platform, peristyle, gilded cupola, lantern ---
const plat = rect(5.3, 5.3)
prism({ wall: trim, win: null, roof, ring: plat, z0: PYR_TOP - 0.6, z1: PYR_TOP + 0.6, facade: null, bevel: 0.25 })
// Railing round the platform as a low trim band.
band(trim, rect(5.0, 5.0), PYR_TOP + 0.6, PYR_TOP + 1.6, 0.1)
// The square base storey of the belvedere.
const belv = rect(4.0, 4.0)
prism({ wall: stone, win: null, roof: null, ring: belv, z0: PYR_TOP + 0.6, z1: 186, facade: null, bevel: 0.3 })
for (const [a, b] of edges(belv)) rectPanel(win, a, b, 4, 1.2, 182.6, 185, 0.05)
// The peristyle: a dark open core with stone piers at the corners and mid-sides.
block(win, -3.3, -3.3, 3.3, 3.3, 186, 193.2)
for (const [x, y] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as XY[]) block(stone, x * 4.0 - (x > 0 ? 0.9 : 0), y * 4.0 - (y > 0 ? 0.9 : 0), x * 4.0 + (x < 0 ? 0.9 : 0), y * 4.0 + (y < 0 ? 0.9 : 0), 186, 193.2)
for (const [x, y] of [[0, -1], [1, 0], [0, 1], [-1, 0]] as XY[]) {
  const cx = x * 3.55, cy = y * 3.55
  block(stone, cx - 0.45, cy - 0.45, cx + 0.45, cy + 0.45, 186, 193.2)
}
prism({ wall: stone, win: null, roof: null, ring: rect(4.3, 4.3), z0: 193.2, z1: 195, facade: null, bevel: 0.25 })
capPoly(stone, rect(4.3, 4.3), 195)
{
  const ring = (r: number, z: number, n = 16): V3[] => circle(0, 0, r, n, Math.PI / 16).map(([x, y]) => [x, y, z] as V3)
  // Gilded drum and dome, a little bulbous, then the lantern and finial.
  gold.loft([ring(3.6, 195), ring(3.6, 197.2), ring(3.95, 197.6), ring(3.9, 198.8), ring(3.4, 200.6), ring(2.5, 202.2), ring(1.3, 203.2), ring(0.9, 203.4)])
  gold.loft([ring(0.9, 203.4, 8), ring(1.1, 203.6, 8), ring(1.1, 205.6, 8), ring(1.3, 206.0, 8), ring(0.7, 207.4, 8), ring(0.35, 208.8, 8), ring(0.55, 209.6, 8), ring(0.3, 210.4, 8), ring(0.02, 213.4, 8)])
  for (let i = 0; i < 8; i++) {
    const t = (i / 8) * Math.PI * 2 + Math.PI / 8
    const a: XY = [3.52 * Math.cos(t - 0.22), 3.52 * Math.sin(t - 0.22)], b: XY = [3.52 * Math.cos(t + 0.22), 3.52 * Math.sin(t + 0.22)]
    archPanel(win, a, b, len(a, b) / 2, 0.9, 195.6, 197.2, 0.04, 6)
  }
}

finishModel('Metropolitan Life Insurance Company Tower', 'nyc-metlife-tower', [
  { part: stone, material: finish('metlife-marble', 0xebe3d3) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: gold, material: finish('metlife-gilding', 0xd2b062) },
  { part: blue, material: finish('metlife-clock-ring', 0x5b7a93) },
], { bearing: 29, osm: 'way/158404390', height: 213.4 }, 5000)
