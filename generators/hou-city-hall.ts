/**
 * Houston City Hall (901 Bagby Street, 1938-39, Joseph Finger), Houston —
 * original procedural geometry, CC0-1.0.
 * bun generators/hou-city-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. The model is built turned to the downtown grid: catalog bearing
 * 34.3 (the outline's walls run at 34.3° / 124.3°), so model +y points
 * north-east along Bagby Street and +x south-east, to the front on Hermann
 * Square and its reflecting pool. Anchor = the centre of the lidar roof
 * outline, 29.7601763,-95.3693653: 1.2 m south-east of the OSM outline's
 * centroid (way/54358731), which sits that far off the lidar and is
 * 2.5 m narrower across.
 *
 * Identity, in order: the stripped-classical limestone tower, its clock
 * stage set back above a cornice with a clock on every face; the tower's
 * tall vertical window bands, five across the front and seven down the
 * sides; the five-storey wings either side that wrap its lower half, and
 * the one-storey blocks at the four corners, all flat-roofed, stepping
 * down to the reflecting pool; the entrance at the tower's foot between the
 * wings, under three tall windows. At night the limestone is floodlit (often
 * in colour) and the windows are lit.
 *
 * Evidence:
 *  - plan and heights: USGS 3DEP lidar TX_Coastal_B1_2018 (flown 2018),
 *    0.5 m grid, read in the turned frame; street ground 5.0 m above the
 *    grid's minimum. Measured: corner blocks x ±25.3, y ±32.5 (two blocks,
 *    |y| 10-32.5), roof 8.0 m, coping 9.0 m; wings x ±18, y ±19.5,
 *    notched to the tower face for |y| < 5.5 front and back, roof 20.2 m,
 *    parapet 21.7 m; tower x ±14.5, y ±11, cornice 45.8 m; clock stage
 *    inset 0.7-1 m (drawn x ±13.8, y ±10.3), top 53.0 m. A small rooftop structure and
 *    the flagpole reach ~66 m (flagpole left out, too thin).
 *  - OSM: outline way/54358731 and its five building:part ways
 *    (580993421-580993425), whose 10/21/60 m heights agree with the lidar
 *    tiers to within a few metres; the model follows the lidar.
 *  - facade: bay counts from the photos below: five window bands across
 *    the tower's front and back, seven down its sides, pitch ~3.66 m
 *    (scaled on Jujutacular's and Highsmith's frontal photos against the
 *    22 m face), bands ~1.5 m (drawn 1.7 m so they read); three bays on
 *    each wing front; three tall windows and the entrance between the
 *    wings; punched windows on the corner blocks. Window bands are grouped
 *    two storeys a panel (storey ~3.7 m, estimated) with stone between.
 *  - clock: a ring of dots and two hands on each face of the clock stage
 *    (Highsmith front; Barera's side views show it on the sides too),
 *    ~3.5 m across, scaled on the face width. Drawn as a ring and hands.
 *  - colour: Texas Cordova limestone, warm pale grey-beige: #e0dccf in
 *    Highsmith's sunlit photo, #cfc3a8 in Barera's; drawn #e9e0cd. Roofs
 *    pale grey (#bcc0c1): NAIP shows them near white, pulled down a step
 *    so the flat roofs don't glare. The spandrels between the windows are grey metal;
 *    the bands are the palette window.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Houston_City_Hall_from_Hermann_Square_(HDR).jpg, Ed Uthman, CC BY 3.0
 *    https://commons.wikimedia.org/wiki/File:Houston_City_Hall_from_Hermann_Square_(HDR).jpg
 *  - Houston_City_Hall_August_2010.jpg, Jujutacular, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Houston_City_Hall_August_2010.jpg
 *  - City_Hall,_Houston,_Texas_LCCN2011630468.tif, Carol M. Highsmith,
 *    public domain
 *    https://commons.wikimedia.org/wiki/File:City_Hall,_Houston,_Texas_LCCN2011630468.tif
 *  - Houston_May_2022_34_(Houston_City_Hall).jpg and
 *    Houston_May_2022_20_(Houston_City_Hall).jpg, Michael Barera,
 *    CC BY-SA 4.0 (the long side and the back corner)
 *    https://commons.wikimedia.org/wiki/File:Houston_May_2022_34_(Houston_City_Hall).jpg
 *    https://commons.wikimedia.org/wiki/File:Houston_May_2022_20_(Houston_City_Hall).jpg
 *  - Houston,Tx_City_Hall.jpg, Cristian Sorto, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Houston,Tx_City_Hall.jpg
 *  - Aerial_view_of_Houston_City_Hall_-_01.jpg, Owen Johnson, public domain
 *    (1970s, high view of the front: the plan of wings and corner blocks)
 *    https://commons.wikimedia.org/wiki/File:Aerial_view_of_Houston_City_Hall_-_01.jpg
 *  USGS NAIP for the plan. Published: 1939, Joseph Finger, Texas Cordova
 *  limestone (Wikipedia, "Houston City Hall"). No commercial imagery.
 *
 * Left out: the relief friezes and the horse-tamers group over the door,
 * the dentil bands, the fluted pilasters along the ground floor of the long
 * sides, the flagpole, the rooftop plant.
 *
 * Doubts: the storey height and the window band width are estimates from
 * photos; the back (Bagby) side is only seen at an angle in Barera's photo
 * and is drawn as the front without the entrance's lettering.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, inset, panel, rect, save, walls, type XY } from './chi-aon-center'

const G = 0 // street level

// Tiers (measured, metres above the street).
const LOW = 8.0, LOW_TOP = 9.0
const WING = 20.2, WING_TOP = 21.7
const CORNICE = 45.8, CLOCK = 53.0

// Plan (half-sizes).
const LX = 25.3, LY = 32.5, LIN = 10 // corner blocks: |y| from LIN to LY
const WX = 18, WY = 19.5, NOTCH = 5.5 // wings, notched to the tower for |y| < NOTCH
const TX = 14.5, TY = 11 // tower
const CX = 13.8, CY = 10.3 // clock stage

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), door = new Part(), metal = new Part()

  /** A parapeted block: walls to `top`, a trim coping, the roof `drop` below. */
  const parapet = (r: XY[], z0: number, roofZ: number, top: number) => {
    walls(stone, r, z0, top - 0.5)
    walls(trim, r, top - 0.5, top, inset(r, 0.35))
    const i = inset(r, 0.35), ii = inset(r, 0.7)
    // inner face of the parapet down to the roof
    walls(trim, ii.slice().reverse(), roofZ, top, ii.slice().reverse())
    // top of the coping between i and ii
    for (let k = 0; k < r.length; k++) {
      const j = (k + 1) % r.length
      trim.quad([i[k][0], i[k][1], top], [i[j][0], i[j][1], top], [ii[j][0], ii[j][1], top], [ii[k][0], ii[k][1], top])
    }
    cap(roof, ii, roofZ)
  }

  // Corner blocks: two long one-storey blocks across the ends.
  for (const s of [1, -1]) {
    const r = s > 0 ? rect(-LX, LIN, LX, LY) : rect(-LX, -LY, LX, -LIN)
    parapet(r, G, LOW, LOW_TOP)
  }

  // Wings: one block round the tower's lower half, notched front and back.
  const wing: XY[] = [
    [-WX, -WY], [WX, -WY], [WX, -NOTCH], [TX, -NOTCH], [TX, NOTCH], [WX, NOTCH],
    [WX, WY], [-WX, WY], [-WX, NOTCH], [-TX, NOTCH], [-TX, -NOTCH], [-WX, -NOTCH],
  ]
  parapet(wing, G, WING, WING_TOP)

  // Tower shaft, cornice band, clock stage.
  const tower = rect(-TX, -TY, TX, TY)
  walls(stone, tower, WING, CORNICE - 1.6)
  // The cornice: a band standing 0.3 m proud, bevelled on top.
  const corn = inset(tower, -0.3)
  walls(trim, corn, CORNICE - 1.6, CORNICE - 0.3)
  walls(trim, corn, CORNICE - 0.3, CORNICE, inset(corn, 0.3))
  trim.quad([corn[0][0], corn[0][1], CORNICE - 1.6], [corn[3][0], corn[3][1], CORNICE - 1.6], [corn[2][0], corn[2][1], CORNICE - 1.6], [corn[1][0], corn[1][1], CORNICE - 1.6])
  const clockR = rect(-CX, -CY, CX, CY)
  cap(roof, inset(corn, 0.3), CORNICE) // the ledge round the clock stage
  block(stone, null, clockR, CORNICE, CLOCK - 0.5, 0)
  walls(trim, clockR, CLOCK - 0.5, CLOCK, inset(clockR, 0.4))
  cap(roof, inset(clockR, 0.4), CLOCK)

  // ---- windows -----------------------------------------------------------
  const BAND = 1.7, PITCH = 3.66
  // Tower bands: groups of two storeys from above the wings to the frieze.
  const towerRows: [number, number][] = [[22.6, 29.6], [30.3, 37.3], [38.0, 43.4]]
  // front (+x) and back (-x): five bands across y
  for (const s of [1, -1]) {
    const a: XY = s > 0 ? [TX, -TY] : [-TX, TY], b: XY = s > 0 ? [TX, TY] : [-TX, -TY]
    for (let k = -2; k <= 2; k++) {
      const c = TY + k * PITCH
      for (const [z0, z1] of towerRows) panel(win, a, b, c - BAND / 2, c + BAND / 2, z0, z1, 0.05)
      // between the wings: the three middle bays come down to the entrance
      if (Math.abs(k) <= 1) {
        panel(win, a, b, c - BAND / 2, c + BAND / 2, 15.0, 21.0, 0.05)
        panel(win, a, b, c - BAND / 2, c + BAND / 2, 9.6, 14.4, 0.05)
        if (k === 0) panel(door, a, b, c - 1.3, c + 1.3, 0, 6.6, 0.06)
        else panel(win, a, b, c - 0.9, c + 0.9, 1.2, 7.4, 0.05)
      }
    }
  }
  // sides (±y): seven bands along x
  for (const s of [1, -1]) {
    const a: XY = s > 0 ? [TX, TY] : [-TX, -TY], b: XY = s > 0 ? [-TX, TY] : [TX, -TY]
    for (let k = -3; k <= 3; k++) {
      const c = TX + k * PITCH
      for (const [z0, z1] of towerRows) panel(win, a, b, c - BAND / 2, c + BAND / 2, z0, z1, 0.05)
    }
  }
  // Clock stage: one ring and two hands on each face.
  const faces: [XY, XY][] = [[[CX, -CY], [CX, CY]], [[-CX, CY], [-CX, -CY]], [[CX, CY], [-CX, CY]], [[-CX, -CY], [CX, -CY]]]
  for (const [a, b] of faces) clockFace(metal, a, b, CLOCK - 3.4)

  // Wings: three bays on each front and back face, nine down each side,
  // over the corner blocks' roofs; one low window in the entrance court.
  const wingRows: [number, number][] = [[10.0, 14.2], [15.0, 19.2]]
  for (const s of [1, -1]) {
    for (const side of [1, -1]) {
      // the wing face at x = s*WX between |y| = NOTCH and WY
      const y0 = side * NOTCH, y1 = side * WY
      const a: XY = s * side > 0 ? [s * WX, y0] : [s * WX, y1], b: XY = s * side > 0 ? [s * WX, y1] : [s * WX, y0]
      const L = WY - NOTCH
      for (const c of [3.2, 7.2, 11.2]) {
        const sc = s * side > 0 ? c : L - c
        for (const [z0, z1] of wingRows) panel(win, a, b, sc - 0.9, sc + 0.9, z0, z1, 0.05)
        if (c === 3.2) panel(win, a, b, sc - 0.9, sc + 0.9, 1.4, 6.6, 0.05)
      }
    }
    // the long sides of the wings at y = s*WY
    const a: XY = s > 0 ? [WX, WY] : [-WX, -WY], b: XY = s > 0 ? [-WX, WY] : [WX, -WY]
    for (let k = -4; k <= 4; k++) for (const [z0, z1] of wingRows) panel(win, a, b, WX + k * 3.8 - 0.9, WX + k * 3.8 + 0.9, z0, z1, 0.05)
  }
  // Corner blocks: punched windows, one storey.
  for (const s of [1, -1]) {
    const r = s > 0 ? rect(-LX, LIN, LX, LY) : rect(-LX, -LY, LX, -LIN)
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      // skip the inner faces hidden behind the wings (only their ends show)
      const inner = (s > 0 && i === 0) || (s < 0 && i === 2)
      if (inner) {
        for (const c of [3.6, L - 3.6]) panel(win, a, b, c - 0.9, c + 0.9, 1.4, 6.4, 0.05)
        continue
      }
      const n = Math.round(L / 4.6), step = L / n
      for (let q = 0; q < n; q++) panel(win, a, b, step * (q + 0.5) - 0.9, step * (q + 0.5) + 0.9, 1.4, 6.4, 0.05)
    }
  }

  // Floodlight: all the limestone, strongest on the tower, rising to the top.
  const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.5 + 0.5 * Math.min(1, p[2] / CLOCK))
  return [
    { part: stone, material: { ...finish('cordova-limestone', 0xe9e0cd), floodlight: flood } },
    { part: trim, material: { ...PALETTE.trim, floodlight: flood } },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('city-hall-roof', 0xbcc0c1) },
    { part: door, material: PALETTE.entrance },
    { part: metal, material: finish('clock-bronze', 0x5d5a55) },
  ]
}

/** A clock on wall a→b (counter-clockwise ring, so outward is to the right): a ring and two hands. */
function clockFace(p: Part, a: XY, b: XY, z: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const s = L / 2, out = 0.08
  const P = (dx: number, dz: number, o = out): V3 => [a[0] + u[0] * (s + dx) + n[0] * o, a[1] + u[1] * (s + dx) + n[1] * o, z + dz]
  const R0 = 1.45, R1 = 1.9, seg = 16
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * 2 * Math.PI, t1 = ((i + 1) / seg) * 2 * Math.PI
    const q = (r: number, t: number) => P(r * Math.cos(t), r * Math.sin(t))
    p.quad(q(R0, t0), q(R1, t0), q(R1, t1), q(R0, t1))
  }
  // hands: hour to ten, minute to two (as in the photos, roughly)
  const hand = (ang: number, len: number, w: number) => {
    const c = Math.cos(ang), sn = Math.sin(ang), px = -sn * w / 2, pz = c * w / 2
    p.quad(P(px, pz, out + 0.02), P(-px, -pz, out + 0.02), P(c * len - px, sn * len - pz, out + 0.02), P(c * len + px, sn * len + pz, out + 0.02))
  }
  hand(Math.PI * 5 / 6, 1.1, 0.32)
  hand(Math.PI / 3, 1.5, 0.26)
}

if (import.meta.main) await save('hou-city-hall', 'Houston City Hall', [29.7601763, -95.3693653], 34.3, build())
