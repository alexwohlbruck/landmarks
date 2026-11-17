/**
 * Reading Terminal (Philadelphia and Reading Railroad terminal, 1891-93:
 * headhouse by Francis H. Kimball, train shed by Wilson Brothers & Co.;
 * the Reading Terminal Market under the shed since 1893; the shed is now
 * the Pennsylvania Convention Center's Grand Hall, the headhouse part of
 * the Philadelphia Marriott Downtown) — original procedural geometry,
 * CC0-1.0.
 * bun generators/phl-reading-terminal.ts [out.glb]
 *
 * One model for the headhouse and the shed: they are one building (one
 * National Historic Landmark, "Reading Terminal", NRHP "Reading Terminal
 * and Trainshed"), joined by the low concourse block, and read as one from
 * any side; splitting them would leave the concourse to neither.
 *
 * Name: "Reading Terminal". The model is the whole terminal, the 8-storey
 * headhouse on Market St and the 155 m single-span shed; the market is the
 * ground floor under the shed. OSM names the shed's outline and building
 * relation "Reading Terminal Market" and the headhouse "Reading Terminal
 * Headhouse"; the NHL listing is "Reading Terminal". The user asked for it
 * as the "Reading Terminal Market"; the lead may prefer that name for
 * search (see the report).
 *
 * Frame: map frame turned to the Center City grid, bearing 9.3 (OSM sides
 * 8.8-9.6 / 98.9-99.1). +x east-south-east (toward 11th St), +y
 * north-north-east (toward Arch St; Market St is the south side), z up,
 * metres. Origin = area centroid of the shed's OSM outline way/42784822,
 * 39.953148, -75.159048, on the street (7.8 m above the lidar box's
 * ground_min, a subway stair). Flat site. Elevation 0.
 *
 * Identity, in order: the long single-span arched shed roof, pale, with a
 * glazed monitor along its crown; the Italianate headhouse across its
 * Market St end, salmon brick with cream terracotta, a heavy cornice, rows
 * of round-arched windows, and the arcade of seven big arches under a
 * balustraded terrace in the middle of the Market St front; the shed's
 * brick side walls on 12th St.
 *
 * Evidence
 *  - OSM: shed outline way/42784822 (with building relation/4755514 and
 *    its parts way/335828056, the shed, h 26, round roof, and
 *    way/336110703, the north annex), the headhouse way/335293079 with its
 *    parts way/335828068 (43.2 m, 8 levels) and way/335828066 (the
 *    recessed middle of the Market St front), and the concourse
 *    way/335512395 between them. All replaced. The Jefferson Tower parts
 *    to the east (way/335293080 etc.) are a separate building and are not.
 *  - Lidar: USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015), 1 m
 *    grid read in this frame. Above the street: the shed vault fits a
 *    circular arc of R 60 m (crown 33.1, eaves 16.9 at x ±41) from y -84 to
 *    71, with a monitor along the crown to 38.1 (x ±7) in two runs, broken
 *    at y -10..12; the concourse 17.0; the north annex 20.7; the headhouse
 *    roof 44.5-45.3 with plant to 48.5; the middle of its Market St front
 *    (x ±16, 4 m deep) only 18.6 (the arcade with its terrace), and a rear
 *    notch to 15.4.
 *  - Published (Wikipedia "Reading Terminal"; NHL nomination): the shed
 *    267 x 559 ft (81 x 170 m), the largest single-span arched shed of its
 *    day; the headhouse 8 storeys, 1893.
 *  - Photo-measured (r3 and r1 below): the headhouse's stages: arcade and
 *    second floor to the terrace at 18.6, four storeys of arched windows to
 *    37, a top storey, the cornice 42.3-44.8; seven arches in the middle,
 *    five bays each side; the shed's 2-storey brick side wall on 12th St.
 *  - Estimated: bay widths, window sizes, the shed side walls' windows,
 *    the north annex's facade (no photo), the end walls of the vault.
 *  - Colours from the photos and NAIP, pulled to the palette's lightness:
 *    salmon brick, cream terracotta, dark window glass; the shed's roof a
 *    pale membrane and the headhouse roof grey (one light grey roof); the
 *    monitor glass.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - The_Reading_Terminal.jpg, Jersey856, CC BY-SA 4.0 (Market St front
 *    from the south) https://commons.wikimedia.org/wiki/File:The_Reading_Terminal.jpg
 *  - Reading_Terminal,_Philadelphia,_PA.JPG, ProfReader, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Reading_Terminal,_Philadelphia,_PA.JPG
 *  - 20030702 27 Reading Terminal Building (5995800405).jpg, David Wilson,
 *    CC BY 2.0 (12th and Market corner, the shed's side behind)
 *    https://commons.wikimedia.org/wiki/File:20030702_27_Reading_Terminal_Building_(5995800405).jpg
 *  - Reading_Terminal.jpg, DevinHouse, CC BY-SA 3.0 (the arcade)
 *    https://commons.wikimedia.org/wiki/File:Reading_Terminal.jpg
 *  - Reading Terminal Headhouse (3373506287).jpg, Kevin Burkett, CC BY-SA
 *    2.0 (the shed's interior, the Grand Hall's arches)
 *    https://commons.wikimedia.org/wiki/File:Reading_Terminal_Headhouse_(3373506287).jpg
 *  - HABS PA,51-PHILA,521-12 (CT), Jack E. Boucher, PD (Market St front)
 *    https://commons.wikimedia.org/wiki/File:Northeast_front._Duplicate_color_view_of_HABS_PA-1528-3_-_Philadelphia_and_Reading_Railroad,_Terminal_Station,_1115-1141_Market_Street,_Philadelphia,_Philadelphia_County,_HABS_PA,51-PHILA,521-12_(CT).tif
 *  - HABS PA,51-PHILA,521-1 and 521-2 (photocopies of 1893 and ca. 1937
 *    photographs, PD: the headhouse and the shed along 12th St from above)
 *    https://commons.wikimedia.org/wiki/File:Photocopy_of_photograph_(from_Reading_Co._Archives)_Photographer_unknown_ca._1937_NORTHEAST_FRONT_AND_SOUTHEAST_SIDE_-_Philadelphia_and_Reading_Railroad,_Terminal_Station,_1115_HABS_PA,51-PHILA,521-2.tif
 *  - USGS NAIP orthophoto (public domain): the roofs.
 *  No look-only sources; no commercial imagery.
 *
 * Night: the hotel's windows and the market's windows glow (`window`), the
 * main doors in the arcade glow (`entrance`); the monitor and the end lunettes
 * are `glass` and stay dark. No licensed night photo was found.
 *
 * Left out: the corner oriel at 12th and Market, the terracotta ornament,
 * balustrades and pilasters, the shed's trusses, the Market St canopy, the
 * signs (the market's neon sign is on Filbert St, too small here).
 *
 * Doubts: the shed's east side and its north end (behind the Convention
 * Center link) have no photo; the north annex's walls are a guess; the
 * shed's end walls above the concourse are drawn plain with a glazed fan.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, inset, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'

const brick = new Part()
const terra = new Part()
const roof = new Part()
const win = new Part()
const glass = new Part()
const door = new Part()

// ---- the shed (lidar) ----
const SX = 41, SY0 = -84, SY1 = 71
const R = 60, ZC = -26.9
const vz = (x: number) => ZC + Math.sqrt(R * R - x * x)
const EAVE = vz(SX) // 16.9

/** A round-headed panel on wall a→b centred at s, w wide, from z0 springing at zs. */
function archPanel(p: Part, a: XY, b: XY, s: number, w: number, z0: number, zs: number, out = 0.05, seg = 8) {
  const { P } = onWall(a, b)
  const h = w / 2
  p.quad(P(s - h, z0, out), P(s + h, z0, out), P(s + h, zs, out), P(s - h, zs, out))
  for (let j = 0; j < seg; j++) {
    const t0 = (Math.PI * j) / seg, t1 = (Math.PI * (j + 1)) / seg
    p.tri(P(s, zs, out), P(s + h * Math.cos(t0), zs + h * Math.sin(t0), out), P(s + h * Math.cos(t1), zs + h * Math.sin(t1), out))
  }
}

/** A projecting band round ring r, z0..z1. */
function band(p: Part, r: XY[], z0: number, z1: number, out: number) {
  const o = inset(r, -out)
  walls(p, o, z0, z1)
  walls(p, o, z1, z1, r)
  walls(p, r, z0, z0, o)
}

function shed() {
  // side walls, brick, to the eaves
  for (const x of [-SX, SX]) {
    const r = x < 0 ? rect(-SX, SY0, -SX + 0.6, SY1) : rect(SX - 0.6, SY0, SX, SY1)
    walls(brick, r, 0, EAVE)
  }
  // the vault: a segmental arc swept along y, smooth-shaded
  const N = 16
  const xs = Array.from({ length: N + 1 }, (_, i) => -SX + (2 * SX * i) / N)
  const nrm = (x: number): V3 => { const z = vz(x) - ZC; return [x / R, 0, z / R] }
  for (let i = 0; i < N; i++) {
    const x0 = xs[i], x1 = xs[i + 1]
    if (Math.abs(x0) < 6.5 && Math.abs(x1) < 6.5) continue
    const segs: [number, number][] = [[SY0, SY1]]
    for (const [y0, y1] of segs) {
      const A: V3 = [x0, y0, vz(x0)], B: V3 = [x1, y0, vz(x1)], C: V3 = [x1, y1, vz(x1)], D: V3 = [x0, y1, vz(x0)]
      roof.tri(A, B, C, undefined, undefined, undefined, [nrm(x0), nrm(x1), nrm(x1)])
      roof.tri(A, C, D, undefined, undefined, undefined, [nrm(x0), nrm(x1), nrm(x0)])
    }
  }
  // the crown strip under and between the monitors (x ±6.5)
  const zm = vz(6.5)
  roof.quad([-6.5, SY0, zm], [6.5, SY0, zm], [6.5, SY1, zm], [-6.5, SY1, zm])
  // the monitor: glass sides and a low gable, in two runs
  for (const [y0, y1] of [[-80, -11], [13, 60]]) {
    const top = 35.6, ridge = 38.0
    glass.quad([6.5, y0, zm], [6.5, y1, zm], [6.5, y1, top], [6.5, y0, top])
    glass.quad([-6.5, y1, zm], [-6.5, y0, zm], [-6.5, y0, top], [-6.5, y1, top])
    // the monitor's glazed roof (the dark skylight strips in NAIP)
    glass.quad([6.9, y0, top], [6.9, y1, top], [0, y1, ridge], [0, y0, ridge])
    glass.quad([-6.9, y1, top], [-6.9, y0, top], [0, y0, ridge], [0, y1, ridge])
    for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) {
      const pts: V3[] = [[-6.5, y, zm], [6.5, y, zm], [6.5, y, top], [0, y, ridge], [-6.5, y, top]]
      const q = s > 0 ? pts : [...pts].reverse()
      // fan from the first corner, wound to face out along y
      for (let k = 1; k < q.length - 1; k++) {
        const t: V3[] = [q[0], q[k], q[k + 1]]
        if (s > 0) roof.tri(t[0], t[2], t[1]); else roof.tri(t[0], t[2], t[1])
      }
    }
  }
  // end walls of the vault, above the eaves line, with a glazed fan
  for (const [y, s] of [[SY0, -1], [SY1, 1]] as [number, number][]) {
    for (let i = 0; i < N; i++) {
      const x0 = xs[i], x1 = xs[i + 1]
      const a: V3 = [x0, y, 0], b: V3 = [x1, y, 0], c: V3 = [x1, y, vz(x1)], d: V3 = [x0, y, vz(x0)]
      if (s > 0) brick.quad(b, a, d, c); else brick.quad(a, b, c, d)
    }
    // glazed lunette: a half-disc in the end wall, radius 14, centred at x 0 from 18.5
    const o = s * 0.06, zc = 18.5, rr = 13.5
    for (let j = 0; j < 10; j++) {
      const t0 = (Math.PI * j) / 10, t1 = (Math.PI * (j + 1)) / 10
      const A: V3 = [0, y + o, zc], B: V3 = [rr * Math.cos(t0), y + o, zc + rr * Math.sin(t0)], C: V3 = [rr * Math.cos(t1), y + o, zc + rr * Math.sin(t1)]
      if (s > 0) glass.tri(A, C, B); else glass.tri(A, B, C)
    }
  }
  // the market's windows on the side walls: two rows, 17 bays
  for (const side of [-1, 1]) {
    const a: XY = side < 0 ? [-SX, SY1] : [SX, SY0], b: XY = side < 0 ? [-SX, SY0] : [SX, SY1]
    const L = SY1 - SY0, n = 17, st = L / n
    for (let k = 0; k < n; k++) {
      const c = st * (k + 0.5)
      panel(win, a, b, c - 2.4, c + 2.4, 1.0, 5.6)
      archPanel(win, a, b, c, 4.0, 7.4, 11.6)
    }
  }
  band(terra, rect(-SX, SY0, SX, SY1), 6.4, 7.0, 0.25)
  band(terra, rect(-SX, SY0, SX, SY1), EAVE - 0.7, EAVE, 0.45)
}

function concourseAndAnnex() {
  // the concourse between headhouse and shed (lidar 17.0)
  block(brick, roof, rect(-SX, -96, SX, SY0), 0, 17.0, 0.3)
  const c = rect(-SX, -96, SX, SY0)
  for (let k = 0; k < 2; k++) panel(win, c[3], c[0], 2 + k * 5.5, 6.5 + k * 5.5, 2.0, 14.5)
  // north annex (lidar 20.7; walls unphotographed)
  const n = rect(-17.6, SY1, 19.3, 94.2)
  block(brick, roof, n, 0, 20.7, 0.3)
  for (const i of [1, 2, 3]) {
    const a = n[i], b = n[(i + 1) % 4]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (let k = 0; k < Math.round(L / 5); k++) panel(win, a, b, k * (L / Math.round(L / 5)) + 1.2, (k + 1) * (L / Math.round(L / 5)) - 1.2, 9.0, 17.5)
  }
}

// ---- the headhouse ----
const HY0 = -129, HY1 = -96, HX0 = -41, HX1 = 41.6, TOP = 44.8
const TER = 18.6 // the terrace over the arcade

function headhouse() {
  const west = rect(HX0, HY0, -16, HY1), east = rect(16, HY0, HX1, HY1)
  const mid = rect(-16, -125, 16, -100)
  const arcade = rect(-16, HY0, 16, -125), rear = rect(-16, -100, 16, HY1)
  for (const r of [west, east, mid]) block(brick, null, r, 0, TOP - 2.5, 0)
  block(brick, terra, arcade, 0, TER, 0.2)
  block(brick, roof, rear, 0, 15.4, 0.2)
  // the cornice: one projecting block round the whole top
  const top = [[HX0, HY0], [-16, HY0], [-16, -125], [16, -125], [16, HY0], [HX1, HY0], [HX1, HY1], [16, HY1], [16, -100], [-16, -100], [-16, HY1], [HX0, HY1]] as XY[]
  const co = inset(top, -1.0)
  walls(terra, top, TOP - 2.5, TOP - 2.5, co)
  walls(terra, co, TOP - 2.5, TOP)
  walls(terra, co, TOP, TOP, top)
  // roof over the three tall blocks (the cornice ring's inside)
  cap(roof, top, TOP - 0.6)
  walls(terra, top.slice().reverse(), TOP - 0.6, TOP)
  // belts: under the arched storeys (the terrace line) and under the top storey
  band(terra, west, TER - 0.8, TER, 0.3)
  band(terra, east, TER - 0.8, TER, 0.3)
  band(terra, mid, 36.4, 37.2, 0.3)
  band(terra, west, 36.4, 37.2, 0.3)
  band(terra, east, 36.4, 37.2, 0.3)
  band(terra, west, 8.6, 9.4, 0.25)
  band(terra, east, 8.6, 9.4, 0.25)
  // plant on the roof (lidar 48.5)
  block(roof, roof, rect(-24, -112, -8, -102), TOP - 0.6, 48.5, 0.3)

  // windows: each bay's pair of arched windows as one panel, two storeys
  // high, brick showing round them; a rectangular top storey; the second
  // floor's rectangular windows and the ground floor's arched ones.
  const upper = (a: XY, b: XY, n: number, low: boolean, e0 = 0, e1?: number) => {
    const L = (e1 ?? Math.hypot(b[0] - a[0], b[1] - a[1])) - e0, st = L / n
    for (let k = 0; k < n; k++) {
      const c = e0 + st * (k + 0.5), w = Math.min(2.8, st * 0.55)
      // cream terracotta surrounds behind the windows (the facade's
      // cream verticals in the photos), the glass on them
      archPanel(terra, a, b, c, w + 1.0, TER + 0.5, 26.6 - w / 2, 0.03)
      archPanel(terra, a, b, c, w + 1.0, 27.7, 35.6 - w / 2, 0.03)
      panel(terra, a, b, c - w / 2 - 0.5, c + w / 2 + 0.5, 37.7, 41.5, 0.03)
      archPanel(win, a, b, c, w, TER + 1.0, 26.6 - w / 2, 0.06)
      archPanel(win, a, b, c, w, 28.2, 35.6 - w / 2, 0.06)
      panel(win, a, b, c - w / 2, c + w / 2, 38.2, 41.0, 0.06)
      if (low) {
        panel(win, a, b, c - w / 2, c + w / 2, 10.6, 15.6)
        archPanel(win, a, b, c, w + 0.6, 0.6, 6.0)
      }
    }
  }
  // Market St front
  upper(west[0], west[1], 5, true)
  upper(east[0], east[1], 5, true)
  upper(mid[0], mid[1], 7, false)
  // the arcade: seven big arches to the shops behind
  for (let k = 0; k < 7; k++) {
    const c = (32 / 7) * (k + 0.5)
    archPanel(win, arcade[0], arcade[1], c, 3.5, 0.0, 12.6)
    if (k === 3) panel(door, arcade[0], arcade[1], c - 1.2, c + 1.2, 0, 4.0, 0.08) // the main doors
  }
  // terrace balustrade
  band(terra, arcade, TER, TER + 1.1, 0.0)
  // 12th St side and the returns
  upper(west[3], west[0], 7, true)
  upper(west[1], west[2], 1, false, 0, 4)
  upper(east[3], east[0], 1, false, 29, 33)
  // the back, over the concourse
  upper(west[2], west[3], 5, false)
  upper(east[2], east[3], 5, false)
  upper(mid[2], mid[3], 7, false)
}

function build() {
  shed()
  concourseAndAnnex()
  headhouse()
  return [
    { part: brick, material: finish('reading-brick', 0xd8977f) },
    { part: terra, material: finish('reading-terracotta', 0xefe3cc) },
    { part: roof, material: finish('reading-roof', 0xc9cccc) },
    { part: win, material: { ...PALETTE.window, color: 0x5c656e } },
    { part: glass, material: PALETTE.glass },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('phl-reading-terminal', 'Reading Terminal', [39.953148, -75.159048], 9.3, build())
