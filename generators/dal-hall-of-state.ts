/**
 * Hall of State, Fair Park, Dallas (1936, Donald Barthelme with George
 * Dahl's Centennial team; Texas Centennial Exposition) — original procedural
 * geometry, CC0-1.0.
 * bun generators/dal-hall-of-state.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/27113243 ("Hall of
 * State", wikidata Q5642713), 32.7807531, -96.7610538. The long front runs
 * at 17.4° (OSM edges 17.1-17.8°), so the catalog bearing is 17.4: +y runs
 * along the front, +x points 107° (away from the Esplanade), and the
 * entrance faces -x, west-north-west, toward the Esplanade's reflecting
 * pool.
 *
 * Identity, in order: the tall entrance bay, two plain limestone pylons
 * flanking a recess curved in plan and open to the sky, with a fluted
 * curved band at the top carried on four fluted piers; the deep blue tile
 * of the recess wall, with the gold Tejas warrior on his pedestal over the
 * centre doors; the long low wings either side, each a solid pavilion with
 * a tall portal next to the tower and then a colonnade of square piers
 * under a deep plain attic; the Great Hall behind the tower, making the
 * plan a T.
 *
 * Evidence:
 *  - plan: USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018 flight), 1 m grid,
 *    read in this frame (tools/lidar_frame.py), checked against the OSM
 *    outline and USGS NAIP. Wings x -18.5..-3.6, y ±55 (OSM draws them
 *    1.5 m narrower and 1 m shorter: lidar used, measured); tower x
 *    -15.5..-4, y ±11; the recess a half circle of radius 6.6 m on the
 *    tower's front face (measured, lidar and the OSM curve); Great Hall x
 *    -4..36, y ±11.5 with a raised middle ±8.5; the chamfered infill in the
 *    re-entrant corners (lidar and OSM's 148° edges).
 *  - heights above the ground east of the building (lidar ground 4.4-4.5 m
 *    above ground_min; the front terrace is 1.8 m higher, not modelled, and
 *    the map's terrain smooths it to ~0.4 m): pylons 26.4, top of the
 *    curved band 25.5, wing parapets 14.5, Great Hall 17.5 and its raised
 *    middle 18.9, corner infill 12.5, the recess floor (top of the
 *    entrance steps) 3.1. Measured.
 *  - front: from Carol M. Highsmith's straight-on views (~44 px/m across the
 *    22 m tower): pylons 4.4 m wide; fluted band 5.4 m deep; inner piers at
 *    ±2.1 m, drawn 1.25 m wide, outer ones against the pylons; tile from
 *    5.7 m (just over the door lintel) to the band at 20.1 m; doors 2.2 m
 *    tall over the porch; statue ~3 m on a 1.3 m
 *    pedestal (published: 11 ft, Allie Tennant, gold leaf on bronze);
 *    wing attic 2.2 m, frieze 2.0 m (estimated, scaled from the photos).
 *    Wing fronts stand 3 m ahead of the pylons (lidar; the photos show the
 *    wings' return faces beside the tower).
 *  - wings: a solid pavilion 5.4 m | a 4.8 m portal | 3.7 m, then six
 *    openings between square piers to the end (counted on Praefcke 2009;
 *    widths from Highsmith's front view), each opening glazed dark from
 *    0.6 m to just under the frieze on the loggia's back wall. The loggia behind the piers is 3 m deep with
 *    a blue ceiling (Eejjmm8888's portal view).
 *  - colour: Texas cream limestone, pale warm grey-cream in the daylight
 *    photos (sampled #cfbc9c in warm light, #d1d3d7 in cool), pulled to the
 *    palette's lightness as #e6decd, a touch greyer than `stone`; the tile a
 *    deep ultramarine (sunlit in Eejjmm8888's photos), lifted to #3f55ad so
 *    it reads at phone size; the statue's gold leaf #d6a840. Windows and
 *    the bronze doors are `window`; flat roofs `roof`.
 *  - night: the stone is floodlit warm (Larry D. Moore 2014, ZTPeterson
 *    2021, 17Shamrocks): _FLOODLIGHT on the walls, strongest in the recess.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - The_Texas_Hall_of_State_at_Fair_Park..._LCCN2015630304.tif, Carol M.
 *    Highsmith, public domain (front, straight on)
 *  - The_Hall_of_State_at_Fair_Park..._LCCN2015630308.tif, Carol M.
 *    Highsmith, public domain (entrance bay, straight on)
 *  - Fair_Park_August_2016_46_(Hall_of_State).jpg and _47, Michael Barera,
 *    CC BY-SA 4.0 (front from the Esplanade)
 *  - Dallas_Fair_Park_Hall_of_State_2009.jpg, Andreas Praefcke, CC BY 3.0
 *    (front from the south-west)
 *  - Hall_of_State_6.jpg and Hall_of_State_7.jpg, Eejjmm8888, CC BY-SA 4.0
 *    (the open recess from below; a pavilion portal)
 *  - Dallas_Fair_Park_Hall_of_State_at_night_2014.jpg, Larry D. Moore,
 *    CC BY 4.0 (night)
 *  - Hall_of_State_during_the_2021_State_Fair_of_Texas.jpg, ZTPeterson,
 *    CC BY-SA 4.0 (dusk)
 * No look-only sources. No commercial imagery or 3D tiles.
 *
 * Doubts: no licensed photo shows the back (east) or the wing ends, so the
 * Great Hall's sides, the rear of the wings and the ends carry plain
 * estimated window panels; the Great Hall's raised middle is drawn with a
 * window band for its skylights (interior photos show daylight along the
 * top of the hall). The rear porch steps (lidar, x 36-39) are left out.
 *
 * Left out: the names in the frieze, the fluting, the emblem's relief (a
 * plain plaque), the tile's orange stripes, the urns, lamp standards and
 * statues on the terrace, the terrace and its steps (paving, the map's).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, chamfer, panel, rect, save, wallBays, type XY } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.7807531, -96.7610538]
const BEARING = 17.4

// Plan (model frame: +y along the front at 17.4°, -x the entrance side).
const WF = -18.5 // wing fronts (the colonnade piers)
const WB = -15.5 // back of the loggia; also the tower's front face
const WR = -3.6 // rear of the wings
const YT = 11 // tower half-width; the wings start here
const YE = 55 // wing ends
const TR = -4 // rear of the tower
const NR = 6.6 // the recess's radius, on the tower front
const PY = 6.6 // pylons from ±PY to ±YT
const HALL_E = 36, HALL_Y = 11.5, CLER_Y = 8.5
// Wing fronts: the portal from P0 to P1, the pavilion to PE, then twelve
// openings on a 3 m pitch and a 1.4 m end pier.
const P0 = 13.3, P1 = 16.3, PE = 19, PIER = 0.95, END = 1.4
const OPEN = (YE - END - PE - 11 * PIER) / 12

// Heights above the ground east of the building.
const PORCH = 3.1, PYLON = 26.4, BAND_TOP = 25.5, BAND_BOT = 20.1
// Doors to 5.3, a thin cream lintel, then tile from 5.7 nearly to the
// band (lead review: the blue rises from the door lintels); the warrior's
// pedestal stands on the lintel.
const TILE_BOT = 5.7, DOOR = 5.3, PED = 6.5
const WING = 14.5, FRIEZE = 10.3, CORNICE = 12.3
const HALL = 17.5, CLER = 18.9, INFILL = 12.5

const norm = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

/** An axis-aligned rect from any two corners, counter-clockwise. */
const R = (x0: number, y0: number, x1: number, y1: number) => rect(Math.min(x0, x1), Math.min(y0, y1), Math.max(x0, x1), Math.max(y0, y1))

/** A quad whose winding follows the normal n. */
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3 | V3[]) {
  const ns = Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3, n as V3]
  p.tri(a, b, c, undefined, undefined, undefined, [ns[0], ns[1], ns[2]])
  p.tri(a, c, d, undefined, undefined, undefined, [ns[0], ns[2], ns[3]])
}

/** A point on the recess's circle: radius r, angle t (0 = straight back, +x), height z. */
const arc = (r: number, t: number, z: number): V3 => [WB + r * Math.cos(t), r * Math.sin(t), z]
/** A curved panel on the recess wall, facing the centre, from angle t0 to t1. */
function arcPanel(p: Part, r: number, t0: number, t1: number, z0: number, z1: number, seg: number) {
  for (let i = 0; i < seg; i++) {
    const a = t0 + (t1 - t0) * i / seg, b = t0 + (t1 - t0) * (i + 1) / seg
    const na: V3 = [-Math.cos(a), -Math.sin(a), 0], nb: V3 = [-Math.cos(b), -Math.sin(b), 0]
    quadN(p, arc(r, a, z0), arc(r, b, z0), arc(r, b, z1), arc(r, a, z1), [na, nb, nb, na])
  }
}

/** A box turned by angle t about its centre (cx, cy), chamfered c, bevelled on top. */
function turned(p: Part, top: Part | null, cx: number, cy: number, hw: number, hd: number, t: number, z0: number, z1: number, c = 0.25, bevel = 0.15) {
  const ring = chamfer(rect(-hd, -hw, hd, hw), c).map(([u, v]) => [cx + u * Math.cos(t) - v * Math.sin(t), cy + u * Math.sin(t) + v * Math.cos(t)] as XY)
  block(p, top, ring, z0, z1, bevel)
}

/** A straight beam of square section s from a to b. */
function beam(p: Part, a: V3, b: V3, s: number, s1 = s) {
  const T = norm([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
  let N = norm([T[1], -T[0], 0])
  if (Math.hypot(T[0], T[1]) < 1e-6) N = [1, 0, 0]
  const B: V3 = [T[1] * N[2] - T[2] * N[1], T[2] * N[0] - T[0] * N[2], T[0] * N[1] - T[1] * N[0]]
  const ring = (c: V3, h: number) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [c[0] + (N[0] * u + B[0] * v) * h, c[1] + (N[1] * u + B[1] * v) * h, c[2] + (N[2] * u + B[2] * v) * h] as V3)
  const r0 = ring(a, s / 2), r1 = ring(b, s1 / 2)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const n = norm([r0[i][0] + r0[j][0] - 2 * a[0], r0[i][1] + r0[j][1] - 2 * a[1], r0[i][2] + r0[j][2] - 2 * a[2]])
    quadN(p, r0[i], r0[j], r1[j], r1[i], n)
  }
  quadN(p, r0[3], r0[2], r0[1], r0[0], [-T[0], -T[1], -T[2]])
  quadN(p, r1[0], r1[1], r1[2], r1[3], T)
}

function build() {
  const lime = new Part(), roof = new Part(), win = new Part(), tile = new Part(), gold = new Part()

  // --- The wings ----------------------------------------------------------
  for (const s of [1, -1]) {
    const Y = (y: number) => s * y
    // Main body behind the loggia, and the attic and frieze over both,
    // carried on the piers.
    block(lime, null, R(WB, Y(YT), WR, Y(YE)), 0, FRIEZE, 0)
    block(lime, roof, R(WF, Y(YT), WR, Y(YE)), FRIEZE, WING, 0.4)
    // Its blue ceiling (Eejjmm8888's portal view).
    cap(tile, R(WF + 0.05, Y(YT + 0.05), WB, Y(YE - 0.05)), FRIEZE - 0.02, false)
    // A cornice course at the foot of the attic, round the front and ends.
    block(lime, null, R(WF - 0.18, Y(YT), WB + 1, Y(YE + 0.18)), CORNICE - 0.35, CORNICE, 0)
    block(lime, null, R(WB, Y(YE), WR - 0.18, Y(YE + 0.18)), CORNICE - 0.35, CORNICE, 0)
    // The pavilion by the tower: wall, portal, wall (Highsmith's front
    // view: 2.3 | 3.0 | 2.7 m). Then the colonnade: twelve openings between
    // eleven square piers and the end pier (counted on Praefcke's view).
    block(lime, null, R(WF, Y(YT), WB, Y(P0)), 0, FRIEZE, 0)
    block(lime, null, R(WF, Y(P1), WB, Y(PE)), 0, FRIEZE, 0)
    for (let k = 1; k <= 11; k++) {
      const y0 = PE + k * OPEN + (k - 1) * PIER
      block(lime, null, chamfer(R(WF, Y(y0), WF + 1.1, Y(y0 + PIER)), 0.15), 0, FRIEZE, 0)
    }
    block(lime, null, R(WF, Y(YE - END), WB, Y(YE)), 0, FRIEZE, 0)
    // Windows on the loggia's back wall, one per opening, and the portal door.
    const back = s > 0 ? ([[WB, YE], [WB, YT]] as [XY, XY]) : ([[WB, -YT], [WB, -YE]] as [XY, XY])
    const along = (y: number) => (s > 0 ? YE - y : y - YT) // distance along `back` from its start
    for (let k = 0; k < 12; k++) {
      const y0 = PE + k * (OPEN + PIER), y1 = y0 + OPEN
      const a = along(y0), b = along(y1)
      panel(win, back[0], back[1], Math.min(a, b) + 0.05, Math.max(a, b) - 0.05, 0.6, FRIEZE - 0.25, 0.04)
    }
    {
      const a = along(P0), b = along(P1)
      panel(win, back[0], back[1], Math.min(a, b) + 0.1, Math.max(a, b) - 0.1, 0.6, FRIEZE - 0.25, 0.04)
    }
    // The rear and the ends: tall windows in pairs of storeys (estimated).
    const rear = s > 0 ? ([[WR, YT + 10.5], [WR, YE]] as [XY, XY]) : ([[WR, -YE], [WR, -YT - 10.5]] as [XY, XY])
    wallBays(win, rear[0], rear[1], [[2.0, 6.2], [7.4, 11.4]], { pitch: 5, w: 2.2, end: 1.6, out: 0.04 })
    const end = s > 0 ? ([[WR, YE], [WB, YE]] as [XY, XY]) : ([[WB, -YE], [WR, -YE]] as [XY, XY])
    wallBays(win, end[0], end[1], [[2.0, 6.2], [7.4, 11.4]], { pitch: 4, w: 2.0, end: 1.4, out: 0.04 })
    // The re-entrant corner between the wing and the Great Hall.
    const infill: XY[] = [[WR, HALL_Y], [5.5, HALL_Y], [5.5, 14.5], [-1.5, 21.5], [WR, 21.5]].map(([x, y]) => [x, s * y] as XY)
    block(lime, roof, s > 0 ? infill : [...infill].reverse(), 0, INFILL, 0.3)
  }

  // --- The tower ------------------------------------------------------------
  for (const s of [1, -1]) {
    block(lime, null, R(WB, s * PY, TR, s * YT), 0, PYLON - 0.5, 0.3)
    block(lime, roof, R(WB + 0.3, s * (PY + 0.3), TR - 0.3, s * (YT - 0.3)), PYLON - 0.6, PYLON, 0.2)
  }
  // The mass behind the recess: its front is the half circle, open above.
  const seg = 14
  const ring: XY[] = [[TR, -PY], [TR, PY], [WB, PY]]
  for (let i = 1; i < seg; i++) {
    const t = Math.PI / 2 - (Math.PI * i) / seg
    ring.push([WB + NR * Math.cos(t), NR * Math.sin(t)])
  }
  ring.push([WB, -PY])
  block(lime, roof, ring, 0, BAND_TOP, 0.25)
  // The recess's floor, the top of the entrance steps.
  const half: XY[] = [[WB, -NR]]
  for (let i = 1; i < seg; i++) {
    const t = -Math.PI / 2 + (Math.PI * i) / seg
    half.push([WB + NR * Math.cos(t), NR * Math.sin(t)])
  }
  half.push([WB, NR])
  block(lime, lime, half.map(([x, y]) => [x - 0.02, y] as XY), 0, PORCH, 0)
  // Entrance steps across the tower front, between the wings.
  for (let k = 0; k < 4; k++) block(lime, lime, R(WB - 4 + k, -YT, WB, YT), 0, PORCH * (k + 1) / 4, 0)

  // The fluted band: a curved lintel standing 0.6 m proud of the recess
  // wall, from the piers' heads to the top, with its emblem.
  const t0 = -Math.PI / 2, t1 = Math.PI / 2
  for (let i = 0; i < seg; i++) {
    const a = t0 + (t1 - t0) * i / seg, b = t0 + (t1 - t0) * (i + 1) / seg
    const na: V3 = [-Math.cos(a), -Math.sin(a), 0], nb: V3 = [-Math.cos(b), -Math.sin(b), 0]
    const r = NR - 0.6
    quadN(lime, arc(r, a, BAND_BOT), arc(r, b, BAND_BOT), arc(r, b, BAND_TOP), arc(r, a, BAND_TOP), [na, nb, nb, na])
    quadN(lime, arc(r, a, BAND_BOT), arc(NR, a, BAND_BOT), arc(NR, b, BAND_BOT), arc(r, b, BAND_BOT), [0, 0, -1])
    quadN(roof, arc(r, a, BAND_TOP), arc(NR, a, BAND_TOP), arc(NR, b, BAND_TOP), arc(r, b, BAND_TOP), [0, 0, 1])
  }
  // The band's ends, flush with the tower front.
  for (const s of [1, -1]) quadN(lime, [WB, s * (NR - 0.6), BAND_BOT], [WB, s * NR, BAND_BOT], [WB, s * NR, BAND_TOP], [WB, s * (NR - 0.6), BAND_TOP], [-1, 0, 0])
  // A horizontal groove, to show the flutes at a distance.
  arcPanel(roof, NR - 0.62, t0 + 0.05, t1 - 0.05, 22.7, 22.95, seg)
  block(lime, null, chamfer(R(WB + NR - 0.95, -1.4, WB + NR - 0.55, 1.4), 0.15), 21.4, 24.4, 0.1)

  // The recess wall: bronze doors, a cream lintel course, then the tile.
  arcPanel(tile, NR - 0.05, t0, t1, TILE_BOT, BAND_BOT, seg)
  for (const [c, w] of [[0, 1.4], [0.68, 0.95], [-0.68, 0.95]]) {
    const dt = w / NR
    arcPanel(win, NR - 0.05, c - dt, c + dt, PORCH, DOOR, 2)
  }
  // Four fluted piers carrying the band: the inner pair stands clear of
  // the tile, the outer pair against the pylons.
  for (const s of [1, -1]) {
    const ti = s * Math.asin(2.1 / 5.75)
    turned(lime, null, WB + 5.75 * Math.cos(ti), 5.75 * Math.sin(ti), 0.62, 0.55, ti, PORCH, BAND_BOT + 0.1, 0.2, 0)
    const to = s * Math.asin(5.5 / 5.85)
    turned(lime, null, WB + 5.85 * Math.cos(to), 5.85 * Math.sin(to), 0.62, 0.6, to, PORCH, BAND_BOT + 0.1, 0.25, 0)
  }

  // --- The Tejas warrior ----------------------------------------------------
  // On a pedestal over the centre doors, in front of the tile: drawing a
  // bow, his left arm up and out. Bolder than life so it reads as a gold
  // figure on blue from the Esplanade.
  const PX = WB + NR - 0.75
  block(lime, lime, chamfer(R(PX - 0.6, -0.95, PX + 0.6, 0.95), 0.15), DOOR, PED, 0.1)
  {
    const z = PED, x = PX
    beam(gold, [x, -0.35, z], [x, -0.12, z + 1.5], 0.36, 0.42) // legs, astride
    beam(gold, [x, 0.4, z], [x, 0.12, z + 1.5], 0.36, 0.42)
    beam(gold, [x, 0, z + 1.4], [x, 0.05, z + 2.55], 0.62, 0.72) // torso
    beam(gold, [x, 0.07, z + 2.7], [x, 0.1, z + 3.05], 0.36, 0.32) // head
    // The bow: an arc over his head, held out at 40° by the bow arm.
    const C: V3 = [x, 0, z + 2.9], r = 1.25
    const at = (deg: number): V3 => [x, C[1] + r * Math.cos(deg * Math.PI / 180), C[2] + r * Math.sin(deg * Math.PI / 180)]
    beam(gold, [x, 0.3, z + 2.45], at(40), 0.22) // bow arm, up and out
    beam(gold, [x, -0.25, z + 2.4], [x, 0.3, z + 2.9], 0.22) // drawing arm
    const bow: V3[] = []
    for (let i = 0; i <= 6; i++) bow.push(at(10 + 105 * i / 6))
    for (let i = 0; i < bow.length - 1; i++) beam(gold, bow[i], bow[i + 1], 0.16)
  }

  // --- The Great Hall ---------------------------------------------------------
  block(lime, roof, R(TR, -HALL_Y, HALL_E, HALL_Y), 0, HALL, 0.4)
  block(lime, roof, R(TR + 0.5, -CLER_Y, HALL_E - 1, CLER_Y), HALL - 0.4, CLER, 0.25)
  for (const s of [1, -1]) {
    // Skylight band along the raised middle.
    const top = s > 0 ? ([[HALL_E - 1, CLER_Y], [TR + 0.5, CLER_Y]] as [XY, XY]) : ([[TR + 0.5, -CLER_Y], [HALL_E - 1, -CLER_Y]] as [XY, XY])
    panel(win, top[0], top[1], 1.5, HALL_E - TR - 3, HALL + 0.1, CLER - 0.4, 0.04)
    // Tall windows on the sides (estimated: no photo of the back).
    const side = s > 0 ? ([[HALL_E, HALL_Y], [5.5, HALL_Y]] as [XY, XY]) : ([[5.5, -HALL_Y], [HALL_E, -HALL_Y]] as [XY, XY])
    wallBays(win, side[0], side[1], [[3.0, 13.0]], { pitch: 6, w: 2.2, end: 2.5, out: 0.04 })
  }
  // The rear: a tall central doorway.
  panel(win, [HALL_E, -HALL_Y], [HALL_E, HALL_Y], HALL_Y - 2.2, HALL_Y + 2.2, 3.2, 12.5, 0.04)

  // --- Night ------------------------------------------------------------------
  // Floodlit from the terrace: the walls, fading upward, brightest in the
  // recess; roofs and anything facing up unlit.
  const lit = (p: V3, n: V3) => {
    if (n[2] > 0.5) return 0
    const inRecess = p[0] > WB - 0.1 && p[0] < WB + NR + 0.1 && Math.abs(p[1]) < NR + 0.1
    if (inRecess) return 0.85 - 0.012 * p[2]
    const front = n[0] < -0.5 ? 0.6 : 0.3
    return Math.max(0, front - 0.012 * p[2])
  }
  return [
    { part: lime, material: { ...finish('hos-limestone', 0xe6decd), floodlight: lit } },
    { part: roof, material: finish('hos-roof', 0xb0a998) },
    { part: win, material: PALETTE.window },
    { part: tile, material: { ...finish('hos-tile-blue', 0x3f55ad), floodlight: (p: V3, n: V3) => (n[2] < -0.5 ? 0 : 0.35) } },
    { part: gold, material: { ...finish('hos-gold', 0xd6a840, 0.5), floodlight: () => 0.9 } },
  ]
}

if (import.meta.main) await save('dal-hall-of-state', 'Hall of State', ANCHOR, BEARING, build())
