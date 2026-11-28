/**
 * Chicago O'Hare International Airport: the Main (central) air traffic
 * control tower in the terminal core, FAA, opened 1996, 260 ft (79 m) to the
 * top of its antennas, with its base building ("Central ATAC") between the
 * frontages of Terminals 2 and 3 — original procedural geometry, CC0-1.0.
 * bun generators/chi-ohare-control-tower.ts
 *
 * Which tower: O'Hare has three FAA towers. The North (2008) and South
 * (2015) towers stand out on the airfield; the Main tower is the one in the
 * terminal core, in front of the Rotunda (Building #6) between Terminals 2
 * and 3, the one seen from every curb and the airport's emblem. OSM
 * way/163500116 ("Control Tower 910", aeroway=tower) is that tower: the
 * lidar's 79 m peak stands on it. The short tower by the Hilton is I. M.
 * Pei's 1970s prototype FAA tower, now the Department of Aviation's ramp
 * tower; it is not this model.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of way/163500116, -87.90326564, 41.97597279.
 * Bearing 0: the octagon's flats face the cardinal points, as in the OSM
 * outline and the lidar.
 *
 * Identity, from the photos: a slender octagonal shaft clad in a fine grid
 * of pale grey-blue glass and metal panels; near the top it flares out in a
 * concave trumpet to a wide octagonal head: a band of dark windows, a
 * sloping silver metal skirt with a deep eave, then the narrower glass cab
 * under a pale band and a flat roof, and the white radome on top.
 *
 * Evidence
 * - OSM: way/163500116 (tower, a 22 m octagon: the outline of the head, not
 *   the shaft), way/682380605 ("Central ATAC", building=airport: the base
 *   block the shaft stands in, wrapped around the tower). No heights in OSM.
 * - Lidar: USGS 3DEP USGS_LPC_IL_4County_Cook_2017_LAS_2019 (2017 flight),
 *   0.5 m grid, heights above the street around the tower (197.9 m; the
 *   map's terrain is flat here within 1 m): radome top 79.2 m; cab roof
 *   76–77 m out to r 7.9; the skirt 67.5–70 m from r 8 to the eave at
 *   r 10.5–11; Central ATAC's roofs 17.5 m (south, main block) and 13.3 m
 *   (its north strip, level with the departures canopy).
 * - Published: 260 ft (79.2 m) to the top of the antennas, 236 ft (72 m)
 *   eye level; opened 1996 (Daily Herald, 13 June 2013; CTBUH Skyscraper
 *   Center lists 79 m). The lidar's 79.2 m agrees.
 * - Photo-scaled (eave radius 10.8 m and the lidar heights as the scale):
 *   shaft 10 m across the flats (r 5.0); the flare 53.5–64.3 m; the pale window
 *   band 64.3–67.3 m at r 9.6 (one dark window per face, 64.9–66.9 m); the cab glass 70.2–73.6 m leaning out from
 *   r 7.4 to r 7.7; the pale band 73.6–76.4 m; radome r 2.8.
 * - Colours (daylight photos): shaft panels pale grey-blue, skirt and roof
 *   silver metal, head band pale grey, windows dark (lit at night), radome
 *   white; Central ATAC's dark ribbed metal walls (as T2/T3's frontage)
 *   pulled to charcoal, grey roof.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - O'Hare_Control_Tower_2022.jpg, Lexington42, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:O%27Hare_Control_Tower_2022.jpg
 *   (from the ATS guideway, west: whole tower over the T2 curb)
 * - Chicago_O'Hare_Tower.JPG, "My name", CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:Chicago_O%27Hare_Tower.JPG
 *   (telephoto of the head: band layout and proportions)
 * - OhareControlTower.jpg, PlusMinus, CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:OhareControlTower.jpg (from the
 *   lower curb: shaft and flare)
 * - Terminals_2_and_3,_Chicago_O'Hare_International_Airport,_Chicago,_IL_
 *   (54600736995.jpg, Warren LeMay, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Terminals_2_and_3,_Chicago_O%27Hare_International_Airport,_Chicago,_IL_(54600736995.jpg
 *   (2025, from the north-west over the upper road: the tower over the
 *   frontages and Central ATAC's dark wall)
 * - At_Chicago_2024_106.jpg, Mike Peel, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:At_Chicago_2024_106.jpg (from
 *   the north, a runway: the tower above the parking garage)
 * USGS NAIP for the plan. No look-only sources; no commercial imagery.
 *
 * Left out: the panel grid's joints (a dot grid at map size), the antennas
 * and the balcony rails. Central ATAC's facade is plain dark panel with one
 * window band, as far as the photos show it behind the canopies.
 * Doubts: the shaft width and flare heights are photo-scaled, not measured
 * (the lidar sees only the head). The shaft is drawn down to the ground;
 * its foot is hidden behind the canopies in every photo.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { clean, clip, cap, walls, inset, type XY } from './clt-terminal'

const N = 8
/** An octagon "radius" across the flats -> its vertex ring, flats facing N/E/S/W. */
const oct = (r: number, z: number): V3[] => {
  const R = r / Math.cos(Math.PI / N)
  return Array.from({ length: N }, (_, i) => {
    const a = ((i + 0.5) / N) * 2 * Math.PI
    return [R * Math.cos(a), R * Math.sin(a), z]
  })
}
const loft = (p: Part, st: [number, number][]) => p.loft(st.map(([r, z]) => oct(r, z)))
function annulus(p: Part, r0: number, r1: number, z: number, up = true) {
  const a = oct(r0, z), b = oct(r1, z)
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    if (up) p.quad(a[i], b[i], b[j], a[j])
    else p.quad(a[i], a[j], b[j], b[i])
  }
}

const shaft = new Part(), win = new Part(), metal = new Part(), pale = new Part(), wall = new Part(), roof = new Part()

// --- The shaft, and the concave flare up to the head (a quarter-ellipse in
// section: steep at the shaft, flattening out under the window band).
const R0 = 5.0, ZF = 53.5, ZH = 64.3, RH = 9.6
const flare: [number, number][] = [[R0, 0], [R0, ZF]]
for (let i = 1; i <= 6; i++) {
  const t = i / 6, a = (t * Math.PI) / 2
  flare.push([R0 + (RH - R0) * (1 - Math.cos(a)), ZF + (ZH - ZF) * Math.sin(a)])
}
loft(shaft, flare)
// a thin pale sill where the flare meets the head
loft(pale, [[RH, ZH], [RH + 0.15, ZH], [RH + 0.15, ZH + 0.35]])

// --- The head: dark window band, pale mullion corners, the silver skirt
// with its deep eave, the glass cab and its pale crown band, roof, radome.
loft(pale, [[RH, ZH + 0.35], [RH, 67.3]])
// one broad dark window per face of the band, pale frame round it (photos)
{
  const lo = oct(RH + 0.06, 64.9), hi = oct(RH + 0.06, 66.9)
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N, f = 0.17
    const L = (p: V3, q: V3, t: number): V3 => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t]
    win.quad(L(lo[i], lo[j], f), L(lo[i], lo[j], 1 - f), L(hi[i], hi[j], 1 - f), L(hi[i], hi[j], f))
  }
}
loft(pale, [[RH, 67.3], [10.8, 67.3], [10.8, 67.8]]) // the eave fascia
loft(metal, [[10.8, 67.8], [8.2, 70.2]]) // the skirt
annulus(metal, 7.4, 8.2, 70.2)
loft(win, [[7.4, 70.2], [7.7, 73.6]]) // cab glass, leaning out
loft(pale, [[7.7, 73.6], [7.9, 73.8], [7.9, 76.2], [7.6, 76.4]])
annulus(roof, 0, 7.6, 76.4)
// radome on a short drum
const dome: [number, number][] = [[2.8, 76.4], [2.8, 77.3]]
for (let i = 1; i <= 4; i++) { const a = (i / 4) * (Math.PI / 2); dome.push([Math.max(0.05, 2.8 * Math.cos(a)), 77.3 + 1.9 * Math.sin(a)]) }
loft(pale, dome)
// one bold mast standing in for the antennas
{
  const sq = (h: number, z: number): V3[] => [[5.6 - h, -h, z], [5.6 + h, -h, z], [5.6 + h, h, z], [5.6 - h, h, z]]
  metal.loft([sq(0.18, 76.4), sq(0.12, 79.0)]); metal.cap(sq(0.12, 79.0), true)
}

// --- Central ATAC: the base block, wrapped round the shaft on its north
// side. Main block 17.5 m south of y = -2; the strip in front 13.3 m.
const ATAC: XY[] = clean([[-41.4, -12.3], [-39.7, -9.7], [-37.7, -6.5], [-28.7, 6.5], [-17.8, 3.6], [-9.9, 2.4], [-3.9, 3.0], [3.9, 3.0], [10.2, 2.3], [19.2, 3.9], [28.4, 6.2], [36.2, -5.2], [40.8, -11.7], [41.2, -12.3], [23.4, -24.5], [21.4, -22.4], [14.1, -17.1], [4.4, -14.1], [-5.8, -14.4], [-15.3, -18.0], [-20.6, -22.0], [-23.1, -24.6]], 0.3)
{
  const front = clean(clip(ATAC, 0, -1, 2), 0.2) // y >= -2
  const back = clean(clip(ATAC, 0, 1, -2), 0.2) // y <= -2
  const block = (r: XY[], h: number) => {
    walls(wall, r, 0, h - 0.5)
    const ins = inset(r, 0.5)
    walls(pale, r, h - 0.5, h, ins) // a pale coping lip
    cap(roof, ins, h)
    return r
  }
  block(front, 13.3)
  const b = block(back, 17.5)
  // a broad window band on the main block's long faces, between the piers
  for (let i = 0; i < b.length; i++) {
    const p = b[i], q = b[(i + 1) % b.length], L = Math.hypot(q[0] - p[0], q[1] - p[1])
    if (L < 6) continue
    const nx = (q[1] - p[1]) / L, ny = -(q[0] - p[0]) / L
    if (ny > 0.5) continue // the north side is behind the front strip
    const u = [(q[0] - p[0]) / L, (q[1] - p[1]) / L], o = 0.05
    const P = (s: number, z: number): V3 => [p[0] + u[0] * s + nx * o, p[1] + u[1] * s + ny * o, z]
    const k = Math.max(1, Math.round((L - 2) / 9)), w = (L - 2 - (k - 1) * 1.2) / k
    for (let j = 0; j < k; j++) { const s0 = 1 + j * (w + 1.2); win.quad(P(s0, 4.6), P(s0 + w, 4.6), P(s0 + w, 11.8), P(s0, 11.8)) }
  }
  // the front strip's glazed curb wall (lit at night), under the canopy
  for (let i = 0; i < front.length; i++) {
    const p = front[i], q = front[(i + 1) % front.length], L = Math.hypot(q[0] - p[0], q[1] - p[1])
    if (L < 5) continue
    const nx = (q[1] - p[1]) / L, ny = -(q[0] - p[0]) / L
    if (ny < 0.3) continue
    const u = [(q[0] - p[0]) / L, (q[1] - p[1]) / L], o = 0.05
    const P = (s: number, z: number): V3 => [p[0] + u[0] * s + nx * o, p[1] + u[1] * s + ny * o, z]
    win.quad(P(0.8, 1.0), P(L - 0.8, 1.0), P(L - 0.8, 9.6), P(0.8, 9.6))
  }
}

const parts = [
  { part: shaft, material: finish('ord-tower-panel', 0xc3ced3, 0.5) },
  { part: win, material: windowVariant(2, 0x7c8d99) },
  { part: metal, material: finish('ord-tower-metal', 0xaab1b5, 0.6) },
  { part: pale, material: PALETTE.trim },
  { part: wall, material: finish('ord-dark-panel', 0x5b6068) },
  { part: roof, material: PALETTE.roof },
]
if (import.meta.main) {
  const tris = parts.reduce((n, { part }) => n + part.triangles, 0)
  const glb = writeGlb("O'Hare Control Tower", parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
    bearing: 0, elevation: 0, height: 79.2, replaces: ['way/163500116', 'way/682380605'],
  })
  const out = new URL('../models/chi-ohare-control-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
