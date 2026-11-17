/**
 * Santa Fe Depot (Union Station), San Diego — 1050 Kettner Boulevard.
 *
 * Bakewell & Brown, 1915, Mission Revival / Spanish Colonial Revival:
 * a long cream-stucco station under red clay tile, its south front a
 * great semicircular arch with a glazed lunette between two bell towers
 * capped by tiled domes and lanterns, a round-arched arcade down the
 * track (west) side, and the blue "Santa Fe" sign on the ridge.
 *
 * Frame: bearing 0 (the station runs due north-south; OSM's long walls
 * are within 0.3° of north). +x east, +y north, metres, origin at the
 * anchor (the OSM outline's area centroid), y = 0 the ground.
 *
 * Sources
 * - OSM way/27154273 (building=train_station, h=14, hipped, roof tiles
 *   #D04D49, NRHP 72000248), tower parts way/497459943 and way/497459996
 *   (h=24, 9.3 m square plaster), dome parts way/1148666636 and
 *   way/1148666637 (h=29, roof:height 5, tile #DFCB4B). © OSM contributors.
 *   The neighbour way/27154287 at the north end (a later 5-storey block,
 *   19 m in the lidar) is not part of the depot and is not replaced.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 1 m grid, read in
 *   this frame (ground ≈ 1.5 m above the box's ground_min).
 * - USGS NAIP orthophoto (plan, roof colour, the towers at the south end).
 * - Wikipedia "Santa Fe Depot (San Diego)": 1915, Bakewell & Brown, NRHP 1972.
 * Photos (evidence):
 * - "San Diego Santa Fe Depot 01–16.JPG", Ctorbann, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:San_Diego_Santa_Fe_Depot_07.JPG
 *   (07 south front, 05 south-west corner and west arcade, 14/15 west
 *   arcade and sign, 01 tower, 08/09 the lunette and doors).
 * - "San Diego Train Station.jpg", Doug Letterman, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:San_Diego_Train_Station.jpg
 *   (west arcade, clerestory, sign).
 * - "Santa fe depot in San Diego.jpg", Jon Sullivan, public domain
 *   (dome tile pattern and lantern).
 * - "San Diego - Santa Fe Depot - 20130803163619.jpg", Ramesh lalwani,
 *   CC BY-SA 4.0 (west side from afar: sign position, roof line).
 * - "Santa Fe Depot at night.jpg", Gentletouch1954, CC BY-SA 3.0 (night).
 * - "San Diego-Union Depot post card ca 1920.jpg", public domain (plan
 *   from the south-east, the east wing).
 *
 * Numbers
 * - Footprint, tower squares and positions: OSM (measured).
 * - South hall (y −68.6…−5.5): eaves 11.2, ridge 15.2 — lidar (measured).
 *   West lean-to arcade 8.4 → 5.6 — lidar. East wing ridge 10.2, eaves
 *   8.5 — lidar.
 * - North hall (y 16…63.5): one wide gable, ridge 12.0 at x ≈ 1.5,
 *   eaves 5.6 — lidar.
 * - Middle (y −5.5…16): low flat roof ≈ 7.2 with a light well, and two
 *   raised gabled pavilions (ridges 12.4 and 13.2) on the side ranges — lidar.
 * - The sign: one double-faced panel on the south hall's ridge, y −36…−14
 *   (22 m), top 20.0 m — lidar (a thin 21.5 m-above-ground_min line).
 * - Front arch: r 7.6, apex 12.2, gable peak 14.6 — scaled from Ctorbann
 *   07 using the 18.3 m between the towers (estimated).
 * - Towers: shaft 9.0 m to 12.4, belfry 8.0 m to 18.0, attic to 20,
 *   dome r 3.0, lantern to 27.5 — scaled from Ctorbann 07/05 and Sullivan
 *   (estimated); lidar reads 25.5 at the dome's crown cell, OSM says 29.
 * - Arcade bay 6.1 m, arch r 2.7 springing at 2.7 (crown 5.4, eave 6.3, slim 0.7 m
 *   piers) — estimated from
 *   Letterman's photo.
 * - "Santa Fe" lettering: a bold serif traced from Letterman's and
 *   Ctorbann 14; cap height 2.75 m on a 4.2 m panel (estimated from the photos).
 *
 * Doubts
 * - The east (Kettner) side is drawn as an enclosed wing with windows from
 *   the 1920 postcard; no recent photo of it was found.
 * - Domes: mustard glazed tile (#C49F45) with two blue bands standing in for
 *   the yellow/green/blue chevron pattern (Sullivan's photo); the bands share
 *   the sign's material to stay within six.
 * - The sign's letters are white stucco-coloured strokes, unlit at night
 *   (no night photo of the sign was found).
 * - The middle section's light well and flat roofs are simplified.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { qf, tf, cbox, rect, panel, type Side } from './dc-white-house'
import { lathe, save } from './chi-aon-center'
import { Pen, strokes } from './lettering'

const STUCCO = finish('depot-stucco', 0xf1e9dc)
const TILE = PALETTE.terracotta
const WINDOW = finish('window', 0x5a5d60, 0.35)
const SHADE = finish('depot-shade', 0x5c534a)
const DOME = finish('depot-dome-tile', 0xc49f45)
const SIGN = finish('depot-sign-blue', 0x3e4b95)

const stucco = new Part(), tile = new Part(), win = new Part(), shade = new Part(), dome = new Part(), sign = new Part()

// ---------------------------------------------------------------------------
// A wall face with round arches through it.

type Face = { F: (u: number, z: number, d?: number) => V3; N: V3; U: V3 }
const UP: V3 = [0, 0, 1]
function face(side: Side, at: number): Face {
  const N: V3 = side === 'n' ? [0, 1, 0] : side === 's' ? [0, -1, 0] : side === 'e' ? [1, 0, 0] : [-1, 0, 0]
  // u runs along the wall: x for north/south faces, y for east/west faces.
  const ns = side === 'n' || side === 's'
  const U: V3 = ns ? [1, 0, 0] : [0, 1, 0]
  const F = (u: number, z: number, d = 0): V3 => (ns ? [u, at + N[1] * d, z] : [at + N[0] * d, u, z])
  return { F, N, U }
}
type Arch = { c: number; r: number; s: number }
/**
 * The wall u0..u1, z0..zTop on a face, pierced by arches; t is the wall's
 * thickness (arch soffits and jambs run that deep into it).
 */
function archWall(p: Part, f: Face, u0: number, u1: number, z0: number, zTop: number, arches: Arch[], t: number, seg = 8) {
  const { F, N, U } = f
  const sorted = [...arches].sort((a, b) => a.c - b.c)
  let u = u0
  for (const a of sorted) {
    if (a.c - a.r > u + 1e-6) qf(p, F(u, z0), F(a.c - a.r, z0), F(a.c - a.r, zTop), F(u, zTop), N)
    u = a.c + a.r
  }
  if (u1 > u + 1e-6) qf(p, F(u, z0), F(u1, z0), F(u1, zTop), F(u, zTop), N)
  for (const a of sorted) {
    const pts: [number, number][] = []
    for (let k = 0; k <= seg; k++) {
      const th = Math.PI - (Math.PI * k) / seg
      pts.push([a.c + a.r * Math.cos(th), a.s + a.r * Math.sin(th)])
    }
    for (let k = 0; k < seg; k++) {
      const [ua, za] = pts[k], [ub, zb] = pts[k + 1]
      qf(p, F(ua, za), F(ub, zb), F(ub, zTop), F(ua, zTop), N)
      const mid = (Math.PI - (Math.PI * (k + 0.5)) / seg)
      const n: V3 = [-Math.cos(mid) * U[0], -Math.cos(mid) * U[1], -Math.sin(mid)]
      qf(p, F(ua, za), F(ub, zb), F(ub, zb, -t), F(ua, za, -t), n)
    }
    // Jambs below the springing.
    if (a.s > z0) {
      qf(p, F(a.c - a.r, z0), F(a.c - a.r, a.s), F(a.c - a.r, a.s, -t), F(a.c - a.r, z0, -t), U)
      qf(p, F(a.c + a.r, z0), F(a.c + a.r, a.s), F(a.c + a.r, a.s, -t), F(a.c + a.r, z0, -t), [-U[0], -U[1], 0])
    }
  }
}
/** An arched window or recess panel, flat on a face. */
function archPanel(p: Part, f: Face, c: number, w: number, z0: number, zs: number, d = 0.04, seg = 6) {
  const r = w / 2
  qf(p, f.F(c - r, z0, d), f.F(c + r, z0, d), f.F(c + r, zs, d), f.F(c - r, zs, d), f.N)
  for (let k = 0; k < seg; k++) {
    const a = Math.PI * k / seg, b = Math.PI * (k + 1) / seg
    tf(p, f.F(c, zs, d), f.F(c + r * Math.cos(a), zs + r * Math.sin(a), d), f.F(c + r * Math.cos(b), zs + r * Math.sin(b), d), f.N)
  }
}

// ---------------------------------------------------------------------------
// Roofs

/** A gable roof with its ridge along y, eaves overhanging by o; gable triangles on `ends`. */
function gableNS(roof: Part, ends: Part | null, x0: number, x1: number, y0: number, y1: number, ze: number, zr: number, o = 0.5, xr = (x0 + x1) / 2, endsAt: [boolean, boolean] = [true, true]) {
  const sl = (zr - ze) / (xr - x0), sr = (zr - ze) / (x1 - xr)
  const W: V3[] = [[x0 - o, y0 - o, ze - o * sl], [x0 - o, y1 + o, ze - o * sl], [xr, y1 + o, zr], [xr, y0 - o, zr]]
  const E: V3[] = [[x1 + o, y0 - o, ze - o * sr], [x1 + o, y1 + o, ze - o * sr], [xr, y1 + o, zr], [xr, y0 - o, zr]]
  qf(roof, W[0], W[1], W[2], W[3], [-(zr - ze), 0, xr - x0])
  qf(roof, E[0], E[1], E[2], E[3], [zr - ze, 0, x1 - xr])
  // Gable-end edges of the overhang, so the roof has a thickness.
  for (const y of [y0 - o, y1 + o]) {
    const n: V3 = [0, y < y0 ? -1 : 1, 0]
    qf(roof, [x0 - o, y, ze - o * sl], [xr, y, zr], [xr, y, zr - 0.35], [x0 - o, y, ze - o * sl - 0.35], n)
    qf(roof, [x1 + o, y, ze - o * sr], [xr, y, zr], [xr, y, zr - 0.35], [x1 + o, y, ze - o * sr - 0.35], n)
  }
  if (ends) {
    if (endsAt[0]) tf(ends, [x0, y0, ze], [x1, y0, ze], [xr, y0, zr], [0, -1, 0])
    if (endsAt[1]) tf(ends, [x0, y1, ze], [x1, y1, ze], [xr, y1, zr], [0, 1, 0])
  }
}
/** A lean-to roof against a wall at xw (high side zh), falling to the eave at xe (low side zl). */
function leanTo(roof: Part, ends: Part, xw: number, xe: number, y0: number, y1: number, zh: number, zl: number, o = 0.5) {
  const dir = Math.sign(xe - xw), s = (zh - zl) / Math.abs(xe - xw)
  const xo = xe + dir * o, zo = zl - o * s
  const n: V3 = [dir * (zh - zl), 0, Math.abs(xe - xw)]
  qf(roof, [xw, y0 - o, zh], [xw, y1 + o, zh], [xo, y1 + o, zo], [xo, y0 - o, zo], n)
  qf(roof, [xo, y0 - o, zo], [xo, y1 + o, zo], [xo, y1 + o, zo - 0.3], [xo, y0 - o, zo - 0.3], [dir, 0, 0])
  // The arcade's ceiling, seen through the arches.
  qf(shade, [xw, y0, zh - 0.5], [xw, y1, zh - 0.5], [xe, y1, zl - 0.4], [xe, y0, zl - 0.4], [0, 0, -1])
  tf(ends, [xw, y0, zh], [xe, y0, zl], [xw, y0, zl], [0, -1, 0])
  tf(ends, [xw, y1, zh], [xe, y1, zl], [xw, y1, zl], [0, 1, 0])
}

// ---------------------------------------------------------------------------
// The plan (OSM, in this frame).

const XW = -18.3, XE = 19.1 // outer walls
const YS = -68.6, YN = 63.5 // south front, north end
const TOWER_Y = -64.1, TW_X = -13.2, TE_X = 14.45, T_HALF = 4.5
const YT = TOWER_Y + T_HALF // north face of the towers: the side ranges start here
const XC = (TW_X + TE_X) / 2 // the front's axis, 0.6 m east of the anchor

// South hall: the waiting room, a clerestoried nave.
const S_Y1 = -5.5
const NAVE_W = XC - 10, NAVE_E = XC + 10
const S_EAVE = 11.2, S_RIDGE = 15.2
// North hall: one wide gable over nave and side ranges.
const N_Y0 = 16, N_RIDGE = 12.0, N_EAVE = 6.0, N_XR = 1.5
// Arcades
const ARC_TOP = 6.3, ARC_R = 2.7, ARC_S = 2.7, BAY = 6.1

// --- South hall ---------------------------------------------------------
// Side and back walls only: the front is the arched wall below.
qf(stucco, [NAVE_W, YS, 0], [NAVE_W, S_Y1, 0], [NAVE_W, S_Y1, S_EAVE], [NAVE_W, YS, S_EAVE], [-1, 0, 0])
qf(stucco, [NAVE_E, YS, 0], [NAVE_E, S_Y1, 0], [NAVE_E, S_Y1, S_EAVE], [NAVE_E, YS, S_EAVE], [1, 0, 0])
qf(stucco, [NAVE_W, S_Y1, 0], [NAVE_E, S_Y1, 0], [NAVE_E, S_Y1, S_EAVE], [NAVE_W, S_Y1, S_EAVE], [0, 1, 0])
gableNS(tile, stucco, NAVE_W, NAVE_E, YS + 0.6, S_Y1, S_EAVE, S_RIDGE, 0.6, XC, [false, true])
// The front gable wall, its peak just under the ridge, with the great arch.
{
  const f = face('s', YS)
  const R = 7.6, SPRING = 12.2 - R, DEPTH = 2.6
  // Wall around the arch, up to the eaves.
  archWall(stucco, f, NAVE_W, NAVE_E, 0, S_EAVE, [{ c: XC, r: R, s: SPRING }], DEPTH, 12)
  // Gable triangle above the eaves (the arch crown pokes 1 m into it, so the
  // triangle is split around the arch's top).
  const PEAK = 14.6
  const ga: V3 = [NAVE_W, YS, S_EAVE], gb: V3 = [NAVE_E, YS, S_EAVE], gp: V3 = [XC, YS, PEAK]
  tf(stucco, ga, gb, gp, [0, -1, 0])
  // Coping along the gable's rake.
  for (const [a, b] of [[ga, gp], [gp, gb]] as [V3, V3][]) {
    qf(stucco, [a[0], YS - 0.35, a[2]], [b[0], YS - 0.35, b[2]], [b[0], YS - 0.35, b[2] + 0.45], [a[0], YS - 0.35, a[2] + 0.45], [0, -1, 0])
    qf(stucco, [a[0], YS - 0.35, a[2] + 0.45], [b[0], YS - 0.35, b[2] + 0.45], [b[0], YS + 0.3, b[2] + 0.45], [a[0], YS + 0.3, a[2] + 0.45], [0, 0, 1])
  }
  // Inside the arch: the glazed lunette over the five arched doors.
  const back = face('s', YS + DEPTH)
  qf(shade, back.F(XC - R, 0), back.F(XC + R, 0), back.F(XC + R, SPRING), back.F(XC - R, SPRING), back.N)
  for (let k = 0; k < 12; k++) {
    const a = Math.PI * k / 12, b = Math.PI * (k + 1) / 12
    tf(stucco, back.F(XC, SPRING), back.F(XC + R * Math.cos(a), SPRING + R * Math.sin(a)), back.F(XC + R * Math.cos(b), SPRING + R * Math.sin(b)), back.N)
  }
  archPanel(win, back, XC, 2 * (R - 0.9), SPRING + 0.9, SPRING + 0.9, 0.05, 10)
  for (let i = -2; i <= 2; i++) archPanel(win, back, XC + i * 2.45, 1.7, 0.2, 2.6, 0.05, 6)
  // Lit band of the "Waiting room and ticket office" frieze.
  qf(stucco, back.F(XC - 5.8, 4.0, 0.06), back.F(XC + 5.8, 4.0, 0.06), back.F(XC + 5.8, 4.6, 0.06), back.F(XC - 5.8, 4.6, 0.06), back.N)
}
// Clerestory windows above the arcade roof (west) and the east wing (east).
for (let y = YT + 3; y < S_Y1 - 1.5; y += 3.4) {
  archPanel(win, face('w', NAVE_W), y, 1.3, 9.2, 10.2)
  archPanel(win, face('e', NAVE_E), y, 1.3, 9.6, 10.4)
}

// --- West arcade, the whole length ---------------------------------------
{
  const yA = YT, yB = YN
  const f = face('w', XW)
  const n = Math.round((yB - yA) / BAY)
  const bay = (yB - yA) / n
  const arches: Arch[] = Array.from({ length: n }, (_, i) => ({ c: yA + (i + 0.5) * bay, r: ARC_R, s: ARC_S }))
  archWall(stucco, f, yA, yB, 0, ARC_TOP, arches, 0.8)
  // Pier caps (a thin wall top) and the arcade's back wall in shade.
  qf(stucco, [XW, yA, ARC_TOP], [XW, yB, ARC_TOP], [XW + 0.8, yB, ARC_TOP], [XW + 0.8, yA, ARC_TOP], UP)
  // Back walls of the arcade: the hall walls, in shadow.
  qf(shade, [NAVE_W - 0.06, yA, 0], [NAVE_W - 0.06, S_Y1, 0], [NAVE_W - 0.06, S_Y1, 8.4], [NAVE_W - 0.06, yA, 8.4], [-1, 0, 0])
  qf(shade, [-9.06, S_Y1, 0], [-9.06, yB, 0], [-9.06, yB, 8.5], [-9.06, S_Y1, 8.5], [-1, 0, 0])
  // Doors and tall windows on the back wall, seen through the arches.
  for (const a of arches) archPanel(win, face('w', a.c < S_Y1 ? NAVE_W - 0.06 : -9.06), a.c, 1.9, 0.3, 2.9, 0.05)
  // Roofs: the south lean-to against the clerestory, then the north hall's
  // own slope carried down over the arcade.
  leanTo(tile, stucco, NAVE_W, XW, yA, S_Y1, 8.6, ARC_TOP, 0.3)
  // Arcade ends.
  qf(stucco, [XW, yB, 0], [-9, yB, 0], [-9, yB, ARC_TOP], [XW, yB, ARC_TOP], [0, 1, 0])
}

// --- East wing: the south part a gabled range, enclosed ---------------------
{
  const x0 = NAVE_E, x1 = XE
  cbox(stucco, rect(x0, x1, YT, S_Y1), 0, 8.5, { top: false })
  gableNS(tile, stucco, x0, x1, YT, S_Y1, 8.5, 10.2, 0.5)
  for (let y = YT + 2.5; y < S_Y1 - 1.5; y += 4.2) {
    archPanel(win, face('e', x1), y, 1.6, 1.0, 3.6)
    archPanel(win, face('e', x1), y, 1.3, 5.2, 6.6)
  }
}

// --- Middle: low flat roofs, the light well and the signs' frames ------------
{
  const y0 = S_Y1, y1 = N_Y0
  // West: the arcade lean-to continues.
  leanTo(tile, stucco, -9, XW, y0, y1, 8.0, ARC_TOP, 0.3)
  // Centre: flat roof at 7.2 with a parapet.
  cbox(stucco, rect(-9, NAVE_E, y0, y1), 0, 7.8, { top: false, b: 0.3 })
  qf(PALETTE_ROOF(), [-8.6, y0 + 0.4, 7.2], [NAVE_E - 0.4, y0 + 0.4, 7.2], [NAVE_E - 0.4, y1 - 0.4, 7.2], [-8.6, y1 - 0.4, 7.2], UP)
  // East: the gabled range continues.
  cbox(stucco, rect(NAVE_E, XE, y0, y1), 0, 8.5, { top: false })
  gableNS(tile, stucco, NAVE_E, XE, y0, y1, 8.5, 10.4, 0.5, (NAVE_E + XE) / 2, [false, false])
  for (let y = y0 + 2.5; y < y1 - 1; y += 4.2) archPanel(win, face('e', XE), y, 1.6, 1.0, 3.6)
  // Two raised gabled pavilions over the side ranges (lidar: ridges 12.4 and 13.2).
  for (const [a, b, zr] of [[-17.2, -6.2, 12.4], [9.2, 19.1, 13.2]] as [number, number, number][]) {
    cbox(stucco, rect(a, b, 5.5, y1), 0, 10.6, { top: false })
    gableNS(tile, stucco, a, b, 5.5, y1, 10.6, zr, 0.4)
    for (const x of [a + (b - a) * 0.3, a + (b - a) * 0.7]) archPanel(win, face('s', 5.5), x, 1.4, 7.6, 9.0)
  }
}

// --- North hall --------------------------------------------------------------
{
  const y0 = N_Y0, y1 = YN
  const s = (N_RIDGE - N_EAVE) / (N_XR - XW)
  const zAt = (x: number) => N_RIDGE - s * Math.abs(x - N_XR)
  // Walls: nave walls under the slope, east range wall.
  cbox(stucco, rect(-9, XE, y0, y1), 0, N_EAVE, { top: false })
  // Nave walls rise above the eave line inside the roof (hidden); gable ends.
  gableNS(tile, null, XW, XE, y0, y1, N_EAVE, N_RIDGE, 0.3, N_XR)
  // Gable ends: the north one closes the whole width; the south one shows
  // above the middle section's roofs.
  for (const [y, n] of [[y1, [0, 1, 0]], [y0, [0, -1, 0]]] as [number, V3][]) {
    qf(stucco, [XW, y, N_EAVE], [XE, y, N_EAVE], [XE, y, 0], [XW, y, 0], n)
    tf(stucco, [XW, y, N_EAVE], [XE, y, zAt(XE)], [N_XR, y, N_RIDGE], n)
  }
  // The round window in the north gable.
  {
    const f = face('n', y1)
    for (let k = 0; k < 12; k++) {
      const a = 2 * Math.PI * k / 12, b = 2 * Math.PI * (k + 1) / 12
      tf(win, f.F(N_XR, 8.6, 0.05), f.F(N_XR + 1.1 * Math.cos(a), 8.6 + 1.1 * Math.sin(a), 0.05), f.F(N_XR + 1.1 * Math.cos(b), 8.6 + 1.1 * Math.sin(b), 0.05), f.N)
    }
  }
  for (let y = y0 + 2.5; y < y1 - 1; y += 4.2) archPanel(win, face('e', XE), y, 1.6, 1.0, 3.6)
}

// --- North-west annex (OSM outline x −18…−8, y 63.5…79.4) -------------------
cbox(stucco, rect(XW, -8.3, YN, 79.4), 0, 5.6, { top: false })
gableNS(tile, stucco, XW, -8.3, YN, 79.4, 5.6, 8.0, 0.4)

// --- The towers ----------------------------------------------------------------
function tower(cx: number) {
  const cy = TOWER_Y, h = T_HALF
  const shaft = rect(cx - h, cx + h, cy - h, cy + h)
  cbox(stucco, shaft, 0, 12.0, { top: false })
  cbox(stucco, rect(cx - h - 0.3, cx + h + 0.3, cy - h - 0.3, cy + h + 0.3), 12.0, 12.6, { b: 0.25, bottom: true })
  // Ground arches through the base on the outer faces (the arcade's ends).
  const out: Side[] = cx < XC ? ['s', 'w'] : ['s', 'e']
  for (const sd of out) {
    const f = sd === 's' ? face('s', cy - h) : face(sd, cx + (sd === 'e' ? h : -h))
    const c = sd === 's' ? cx : cy
    archPanel(shade, f, c, 4.2, 0, 2.9, 0.05, 8)
  }
  // Belfry: an 8 m stage with a big arched opening on each face and corner pilasters.
  const b = 4.0
  cbox(stucco, rect(cx - b, cx + b, cy - b, cy + b), 12.6, 18.0, { top: false })
  for (const sd of ['n', 's', 'e', 'w'] as Side[]) {
    const f = sd === 'n' ? face('n', cy + b) : sd === 's' ? face('s', cy - b) : face(sd, cx + (sd === 'e' ? b : -b))
    const c = sd === 'n' || sd === 's' ? cx : cy
    archPanel(shade, f, c, 3.0, 13.0, 15.8, 0.05, 8)
    // Pilasters at the corners.
    for (const k of [-1, 1]) {
      const a0 = c + k * b - (k > 0 ? 0.9 : 0), a1 = a0 + 0.9
      const P = (u: number, z: number, d: number) => f.F(u, z, d)
      qf(stucco, P(a0, 12.6, 0.3), P(a1, 12.6, 0.3), P(a1, 18.0, 0.3), P(a0, 18.0, 0.3), f.N)
    }
  }
  cbox(stucco, rect(cx - b - 0.45, cx + b + 0.45, cy - b - 0.45, cy + b + 0.45), 18.0, 18.6, { b: 0.25, bottom: true })
  // Attic stage and corner finials.
  cbox(stucco, rect(cx - 3.3, cx + 3.3, cy - 3.3, cy + 3.3), 18.6, 20.2, { top: true, b: 0.2 })
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const px = cx + sx * 3.75, py = cy + sy * 3.75
    cbox(stucco, rect(px - 0.35, px + 0.35, py - 0.35, py + 0.35), 18.6, 19.6, { top: false })
    lathe(stucco, px, py, [[0.35, 19.6], [0.3, 20.3], [0.12, 20.9], [0, 21.2]], 6)
  }
  // Tiled dome on a short drum, then the lantern.
  // Mustard tile with blue-green chevron bands (Sullivan): two bands in the sign's blue.
  lathe(dome, cx, cy, [[3.1, 20.2], [3.05, 20.8], [2.97, 21.3]], 12)
  lathe(sign, cx, cy, [[2.97, 21.3], [2.85, 21.9]], 12)
  lathe(dome, cx, cy, [[2.85, 21.9], [2.5, 22.6]], 12)
  lathe(sign, cx, cy, [[2.5, 22.6], [2.1, 23.05]], 12)
  lathe(dome, cx, cy, [[2.1, 23.05], [1.55, 23.5], [0.9, 23.75]], 12)
  lathe(stucco, cx, cy, [[0.95, 23.7], [0.95, 25.4], [1.15, 25.5], [1.1, 25.8]], 8)
  lathe(dome, cx, cy, [[1.1, 25.8], [0.95, 26.3], [0.55, 26.75], [0.2, 26.95], [0, 27.0]], 8)
  lathe(stucco, cx, cy, [[0.001, 27.0], [0.25, 27.15], [0.25, 27.35], [0, 27.55]], 6)
  // Lantern openings.
  for (let k = 0; k < 4; k++) {
    const a = k * Math.PI / 2
    const n: V3 = [Math.cos(a), Math.sin(a), 0], t: V3 = [-Math.sin(a), Math.cos(a), 0]
    const P = (u: number, z: number): V3 => [cx + n[0] * 0.97 + t[0] * u, cy + n[1] * 0.97 + t[1] * u, z]
    qf(shade, P(-0.32, 24.0), P(0.32, 24.0), P(0.32, 25.1), P(-0.32, 25.1), n)
  }
}
tower(TW_X)
tower(TE_X)

// --- The "Santa Fe" signs ------------------------------------------------------
{
  const L = 22, H = 4.2, Z0 = 15.8, YC = -25, XS = 1.0
  const word = (): { pen: Pen; w: number } => {
    const pen = new Pen()
    let u = 0
    // S
    pen.moveTo([u + 0.62, 0.84]).cubicTo([u + 0.5, 1.02], [u + 0.08, 1.02], [u + 0.08, 0.76])
      .cubicTo([u + 0.08, 0.5], [u + 0.64, 0.52], [u + 0.64, 0.24]).cubicTo([u + 0.64, -0.04], [u + 0.14, -0.04], [u + 0.04, 0.14])
    u += 0.82
    const a = () => {
      pen.moveTo([u + 0.06, 0.52]).cubicTo([u + 0.16, 0.66], [u + 0.48, 0.66], [u + 0.48, 0.44]).lineTo([u + 0.48, 0.0])
      pen.moveTo([u + 0.48, 0.3]).cubicTo([u + 0.2, 0.36], [u + 0.04, 0.3], [u + 0.04, 0.15]).cubicTo([u + 0.04, -0.04], [u + 0.36, -0.04], [u + 0.48, 0.1])
      u += 0.66
    }
    a()
    // n
    pen.moveTo([u + 0.04, 0.0]).lineTo([u + 0.04, 0.62])
    pen.moveTo([u + 0.04, 0.42]).cubicTo([u + 0.14, 0.66], [u + 0.48, 0.68], [u + 0.48, 0.4]).lineTo([u + 0.48, 0.0])
    u += 0.66
    // t
    pen.moveTo([u + 0.16, 0.84]).lineTo([u + 0.16, 0.12]).cubicTo([u + 0.16, -0.02], [u + 0.3, -0.02], [u + 0.38, 0.04])
    pen.moveTo([u + 0.0, 0.58]).lineTo([u + 0.36, 0.58])
    u += 0.5
    a()
    u += 0.42
    // F (with serifs)
    pen.moveTo([u + 0.12, 0.0]).lineTo([u + 0.12, 1.0]).lineTo([u + 0.72, 1.0]).lineTo([u + 0.72, 0.84])
    pen.moveTo([u + 0.12, 0.54]).lineTo([u + 0.5, 0.54])
    pen.moveTo([u - 0.04, 0.0]).lineTo([u + 0.34, 0.0])
    pen.moveTo([u - 0.04, 1.0]).lineTo([u + 0.12, 1.0])
    u += 0.84
    // e
    pen.moveTo([u + 0.04, 0.32]).lineTo([u + 0.52, 0.32]).cubicTo([u + 0.52, 0.66], [u + 0.04, 0.68], [u + 0.04, 0.3])
      .cubicTo([u + 0.04, -0.04], [u + 0.42, -0.04], [u + 0.52, 0.1])
    u += 0.6
    return { pen, w: u }
  }
  const { pen, w } = word()
  const CAP = 2.75, k = CAP, v0 = Z0 + (H - CAP * 1.02) / 2 + 0.05
  // One double-faced sign on the ridge: the panel, and its frame down to the roof.
  cbox(sign, rect(XS - 0.2, XS + 0.2, YC - L / 2, YC + L / 2), Z0, Z0 + H, { bottom: true, b: 0.05 })
  for (const y of [YC - L / 2 + 1, YC - L / 6, YC + L / 6, YC + L / 2 - 1]) cbox(shade, rect(XS - 0.15, XS + 0.15, y - 0.15, y + 0.15), 14.6, Z0, { top: false })
  for (const [xs, dir] of [[XS - 0.2, -1], [XS + 0.2, 1]] as [number, number][]) {
    // The panel and its frame posts.
    const place = (u: number, v: number, wv: number): V3 => {
      const along = (u - w / 2) * k * 1.3
      return [xs + dir * wv, YC + dir * along, v0 + v * k]
    }
    strokes(stucco, pen.paths, { width: 0.19, depth: 0.06, place })
  }
}

function PALETTE_ROOF(): Part {
  // The flat middle roof is drawn in tile colour: NAIP shows it the same
  // warm red as the pitched roofs around it.
  return tile
}

const parts = [
  { part: stucco, material: { ...STUCCO, floodlight: (p: V3, n: V3) => (p[1] < -57 && n[2] < 0.8 ? 0.8 : 0) } },
  { part: tile, material: TILE },
  { part: win, material: WINDOW },
  { part: shade, material: SHADE },
  { part: dome, material: { ...DOME, floodlight: (p: V3) => (p[1] < -57 ? 0.6 : 0) } },
  { part: sign, material: SIGN },
]
await save('sd-santa-fe-depot', 'Santa Fe Depot', [-117.16956, 32.71695], 0, parts as any, 6500)
