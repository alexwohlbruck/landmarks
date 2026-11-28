/**
 * Cathedral of the Immaculate Conception, 416 W 12th Street, Kansas City,
 * Missouri (1882-83, architect Thomas R. Tinsley; the tower's dome gilded in
 * 1960 and regilded since) — procedural, CC0-1.0, no textures.
 * bun generators/kc-cathedral-immaculate-conception.ts
 *
 * A red-brick hall church with a grey gabled roof, its front to the north
 * (on W 11th Street's side of the block), and a single tall front tower on
 * the axis: a brick shaft with white pilaster capitals, one tall round-arched
 * louvered belfry opening a face, a white cornice, a white baroque attic with
 * a scrolled pediment and an oculus on each face, and on it the gold-leaf
 * ribbed bulb dome, a gold octagonal lantern, a small gold cupola and the
 * cross. The front is brick to a white entablature, with a white pediment
 * over the projecting centre bay, a white balustrade and white wall above it,
 * big white scrolls against the tower and urn pinnacles on the corners; three
 * round-headed doors. The sides are eight tall round-headed windows between
 * brick pilasters with white capitals under a white cornice. A low brick
 * chancel block and flat wings close the south end.
 *
 * Assignment note corrected from the photos: the gold dome stands on the
 * front bell tower; there is no dome over a crossing (the nave is one plain
 * gable, lidar and every photo).
 *
 * Frame: bearing 2 (the side walls run 2 degrees east of north), x right
 * (east), y forward (north), z up, metres. Origin at the OSM outline's
 * centroid, -94.5893084 39.1006474. z = 0 is the lowest ground under the
 * footprint, at the south-east corner (lidar 1.2 over the box's ground_min);
 * the ground rises 2.6 m to the front on W 11th Street (terrain and lidar
 * agree), so the front doors and the front terrace start at z 2.6.
 *
 * Covers: way/195845986 (outline) and its parts way/1343095314 (tower),
 * way/1344425381 (nave), way/1344425382 (south flat wings),
 * way/1344425383 (south gabled block).
 *
 * Sources
 * - OSM (c) OpenStreetMap contributors: the outline and parts above,
 *   wikidata Q5052446.
 * - USGS 3DEP lidar MO_FEMANRCS_1_2020 (flown 2020), 0.5 m grid
 *   (SCRATCH/work/kc-cathedral-immaculate-conception/lidar.json). Measured,
 *   as z here: nave eaves 14.9, ridge 23.0; front roof edge behind the
 *   balustrade 17-19.6; tower about 8.5 m square on the axis at y 24-32;
 *   attic corners 32-33.6; dome radius about 4 at z 35.3, 3 at 37.5 (the
 *   gold returns are sparse); top of the cross 53; south wings 6.5, south block ridge 10.
 * - Mapterhorn terrain: 3.6-3.9 at the front, 1.0 at the south-east corner.
 * Photos (evidence, Wikimedia Commons, all Antony-22, CC BY-SA 4.0, 2025):
 * - "Cathedral of the Immaculate Conception Kansas City 2025a.jpg" (from the
 *   east across the car park: side, south wings, tower)
 *   https://commons.wikimedia.org/wiki/File:Cathedral_of_the_Immaculate_Conception_Kansas_City_2025a.jpg
 * - "... 2025b.jpg" (the tower from the north-east)
 *   https://commons.wikimedia.org/wiki/File:Cathedral_of_the_Immaculate_Conception_Kansas_City_2025b.jpg
 * - "... 2025c.jpg" (the front, face-on, looking up the tower)
 *   https://commons.wikimedia.org/wiki/File:Cathedral_of_the_Immaculate_Conception_Kansas_City_2025c.jpg
 * - "... 2025d.jpg" (from the north-east: front and east side, the dome)
 *   https://commons.wikimedia.org/wiki/File:Cathedral_of_the_Immaculate_Conception_Kansas_City_2025d.jpg
 * - "... 2025f.jpg" (the west side from the south-west)
 *   https://commons.wikimedia.org/wiki/File:Cathedral_of_the_Immaculate_Conception_Kansas_City_2025f.jpg
 *
 * Numbers: outline and parts from OSM (exact); heights from lidar
 * (measured, above). Estimated from the photos against those: the tower
 * stages (belfry opening z 21-28.9, cornice 31.4-32.6 to the lidar's
 * 31.7-33.6 at the tower's front corners, attic 32.6-35.2 with pediments to
 * 36.9). The dome and lantern were measured row by row on the NE close-up
 * (2025d), scaled between the lidar's cornice top (z 32.5) and cross top
 * (52.9): an octagonal ribbed dome no wider than the attic (radius 3.85),
 * its foot behind the pediments, visible 37-41.3; the panelled lantern drum
 * 41.3-44.4 (radius 1.55, 0.37 of the dome's width in the photo); the open
 * lantern 44.4-47.7 (radius 1.28); the bell cap to 49.5, a finial and the
 * cross from 50.3. Lidar agrees: radius 2.5-3 at z 37-39, 1.5 at 45.6-46.3,
 * the cap at 49.6. Also estimated: the window and door sizes, the
 * balustrade and pinnacles. Colours from the daylight photos, pulled to the
 * palette's lightness: brick #a24a33 -> #b25e47; white paint -> trim; roof
 * light grey -> roof; gold leaf #d9b13c -> #d8b24e.
 *
 * Doubts: the south end is seen only past the car park (photo a) and the
 * west side only from the south-west; the chancel block's roof is from
 * lidar and OSM. The dome's diamond ribbing is left out (one gold); the
 * scrolls and the niche statue are drawn as plain white masses. Night: the
 * dome and tower are floodlit (lit gold at night in photos seen look-only on
 * the parish site), so dome, lantern and tower carry _FLOODLIGHT.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { pslab, pwalls, pcap, lathe, circle, orient, type XY } from './dc-nga-west'
import { faceAt, facePoly, faceSlab, archPoly, rectPoly, saveModel, type Face } from './sd-california-tower'

const BRICK = finish('icc-brick', 0xb25e47)
const GOLD = finish('icc-gold-leaf', 0xd8b24e, 0.45)

const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// ---- plan (model frame)
const XL = -7.8, XR = 14.8, XC = 3.5 // nave sides, axis
const YS = -18.9, YN = 31.8 // nave south gable, front
const EAVE = 14.9, RIDGE = 23.0
const ZF = 2.6 // ground at the front
const TW = 4.3, TY0 = 23.6, TY1 = 32.2 // tower half-width, south and north faces

/** A gabled roof along y over x0..x1, eaves at e, ridge at r, overhang o; gable walls at the ends into `ends`. */
function gable(roof: Part, ends: Part | null, x0: number, x1: number, y0: number, y1: number, e: number, r: number, o = 0.3, endsAt: [boolean, boolean] = [true, true]) {
  const xm = (x0 + x1) / 2, h = (x1 - x0) / 2
  const s = (r - e) / h
  const xa = x0 - o, xb = x1 + o, ea = e - o * s, ya = y0 - (endsAt[0] ? o : 0), yb = y1 + (endsAt[1] ? o : 0)
  for (const [xe, sg] of [[xa, -1], [xb, 1]] as [number, number][]) {
    // the slope, facing up and out
    orient(roof, [[xe, ya, ea], [xe, yb, ea], [xm, yb, r], [xm, ya, r]], [sg * s, 0, 1])
    // the underside of the overhang, and its fascia
    orient(roof, [[xe, ya, ea], [xe, yb, ea], [xe - sg * o, yb, e], [xe - sg * o, ya, e]], [0, 0, -1])
    for (const [y, n] of [[ya, -1], [yb, 1]] as [number, number][]) orient(roof, [[xe, y, ea], [xm, y, r], [xm, y, r - 0.3], [xe, y, ea - 0.3]], [0, n, 0])
  }
  if (!ends) return
  for (const [i, y, n] of [[0, y0, -1], [1, y1, 1]] as [number, number, number][]) {
    if (!endsAt[i]) continue
    orient(ends, [[x0, y, e], [x1, y, e], [xm, y, r]], [0, n, 0])
  }
}

/** A round-headed opening in `win` with a white surround in `trim` on face F (u centre, width w, sill z0, springing zs). */
function arched(win: Part, trim: Part | null, F: Face, u: number, w: number, z0: number, zs: number, band = 0.22) {
  if (trim) facePoly(trim, F, archPoly(u, w + 2 * band, z0, zs, 10), 0.04)
  facePoly(win, F, archPoly(u, w, z0, zs, 10), 0.08)
}

/** An urn pinnacle: a square pedestal with a cap, a drum and a pointed finial. */
function pinnacle(trim: Part, x: number, y: number, z0: number, w = 1.1, h = 4.2) {
  pslab(trim, rect(x - w / 2, x + w / 2, y - w / 2, y + w / 2), z0, z0 + h * 0.42, 0.08)
  pslab(trim, rect(x - w * 0.58, x + w * 0.58, y - w * 0.58, y + w * 0.58), z0 + h * 0.42, z0 + h * 0.5, 0.06)
  lathe(trim, x, y, [[w * 0.42, z0 + h * 0.5], [w * 0.46, z0 + h * 0.62], [w * 0.3, z0 + h * 0.74], [w * 0.2, z0 + h * 0.8], [w * 0.24, z0 + h * 0.86], [0.06, z0 + h]], 8)
}

/** A flat-shaded octagonal solid of revolution (corners at 0, 45, ... degrees) through (radius, z) points. */
function octo(p: Part, cx: number, cy: number, prof: [number, number][], capTop = false) {
  const ring = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, k) => [cx + r * Math.cos((k * Math.PI) / 4), cy + r * Math.sin((k * Math.PI) / 4), z] as V3)
  const rings = prof.map(([r, z]) => ring(r, z))
  for (let i = 0; i < rings.length - 1; i++) {
    const [r0] = prof[i], [r1] = prof[i + 1]
    for (let k = 0; k < 8; k++) {
      const j = (k + 1) % 8, A = rings[i][k], B = rings[i][j], C2 = rings[i + 1][j], D = rings[i + 1][k]
      const out: V3 = [Math.cos(((k + 0.5) * Math.PI) / 4) * (prof[i + 1][1] - prof[i][1] + 1e-6), Math.sin(((k + 0.5) * Math.PI) / 4) * (prof[i + 1][1] - prof[i][1] + 1e-6), r0 - r1]
      if (r1 > 1e-6) orient(p, [A, B, C2, D], out)
      else orient(p, [A, B, C2], out)
    }
  }
  if (capTop) { const t = rings[rings.length - 1]; if (prof[prof.length - 1][0] > 1e-6) for (let k = 1; k < 7; k++) orient(p, [t[0], t[k], t[k + 1]], [0, 0, 1]) }
}

function build() {
  const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), gold = new Part(), door = new Part()
  const W = faceAt(XL, 0, 270), E = faceAt(XR, 0, 90), N = faceAt(0, YN, 0), S = faceAt(0, YS, 180)
  // u along each face, from an x or y in the model frame
  const uW = (y: number) => -y, uE = (y: number) => y, uN = (x: number) => -x, uS = (x: number) => x

  // ---- nave: brick walls, white cornice ring, grey gable roof
  pslab(brick, rect(XL, XR, YS, YN), 0, EAVE, 0, false)
  pslab(trim, rect(XL - 0.35, XR + 0.35, YS - 0.35, YN + 0.35), EAVE - 0.75, EAVE + 0.15, 0.15, true, true)
  gable(roof, brick, XL, XR, YS, YN - 0.4, EAVE + 0.15, RIDGE, 0.35, [true, false])

  // ---- sides: nine bays of tall round-headed windows between brick pilasters with white capitals
  const NB = 9, BAY = (YN - YS) / NB
  for (const [F, u, sg] of [[W, uW, -1], [E, uE, 1]] as [Face, (y: number) => number, number][]) {
    for (let k = 0; k <= NB; k++) {
      const y = YS + k * BAY, yc = Math.min(YN - 0.55, Math.max(YS + 0.55, y))
      const x0 = sg < 0 ? XL - 0.3 : XR, x1 = sg < 0 ? XL : XR + 0.3
      pslab(brick, rect(x0, x1, yc - 0.55, yc + 0.55), 0, EAVE - 0.75, 0, false)
      const c0 = sg < 0 ? XL - 0.45 : XR, c1 = sg < 0 ? XL : XR + 0.45
      pslab(trim, rect(c0, c1, yc - 0.7, yc + 0.7), EAVE - 1.7, EAVE - 0.75, 0.06, true, true)
    }
    for (let k = 0; k < NB; k++) {
      const yc = YS + (k + 0.5) * BAY
      arched(win, trim, F, u(yc), 2.2, 3.6, 11.4, 0.2)
      // a stone sill under each window
      facePoly(trim, F, rectPoly(u(yc) - 1.4, u(yc) + 1.4, 3.25, 3.6), 0.1)
    }
  }

  // ---- south gable end: two oculi; low chancel block and flat wings
  facePoly(trim, S, circle(uS(XC), 18.2, 1.55, 14).map(([a, b]) => [a, b] as XY), 0.04)
  facePoly(win, S, circle(uS(XC), 18.2, 1.25, 14).map(([a, b]) => [a, b] as XY), 0.08)
  facePoly(trim, S, circle(uS(XC), 10.6, 1.15, 14).map(([a, b]) => [a, b] as XY), 0.04)
  facePoly(win, S, circle(uS(XC), 10.6, 0.9, 14).map(([a, b]) => [a, b] as XY), 0.08)
  pslab(brick, rect(-7.1, 14.7, -34.5, YS), 0, 6.5, 0.15, roof)
  pslab(trim, rect(-7.25, 14.85, -34.65, YS), 6.2, 6.6, 0.1, false)
  pslab(brick, rect(XC - 6.0, XC + 6.0, -37.0, YS), 0, 7.2, 0, false)
  gable(roof, brick, XC - 6.0, XC + 6.0, -37.0, YS, 7.3, 10.2, 0.3, [true, false])
  const CS = faceAt(0, -37.0, 180)
  for (const u of [-2.2, 2.2]) arched(win, trim, CS, uS(XC) + u, 1.2, 1.6, 4.8, 0.18)

  // ---- the front: terrace, doors, pilasters, entablature, white parapet and scrolls
  const TX0 = XC - TW, TX1 = XC + TW
  pslab(brick, rect(XL - 0.4, XR + 0.4, YN, YN + 2.6), 0, ZF + 0.6, 0.05, trim)
  // big brick pilasters at the corners and either side of the tower bay, white capitals, pale plinths
  for (const x of [XL + 0.6, TX0 - 0.4, TX1 + 0.4, XR - 0.6]) {
    pslab(brick, rect(x - 0.75, x + 0.75, YN, YN + 0.5), ZF, EAVE - 0.75, 0, false)
    pslab(trim, rect(x - 0.85, x + 0.85, YN, YN + 0.65), ZF + 0.6, ZF + 1.9, 0.08)
    pslab(trim, rect(x - 0.95, x + 0.95, YN, YN + 0.75), EAVE - 1.9, EAVE - 0.75, 0.06, true, true)
  }
  // doors: round-headed, oak leaves under a glazed fanlight in a white surround
  const doorway = (F: Face, u: number, w: number, z0: number, zs: number) => {
    facePoly(trim, F, archPoly(u, w + 0.5, z0, zs, 10), 0.04)
    facePoly(win, F, archPoly(u, w, zs - 1.0, zs, 10), 0.08)
    facePoly(door, F, rectPoly(u - w / 2, u + w / 2, z0, zs - 1.0), 0.08)
  }
  const T = faceAt(0, TY1, 0)
  doorway(T, uN(XC), 2.6, ZF + 0.6, 8.2)
  for (const x of [(XL + TX0) / 2, (TX1 + XR) / 2]) {
    doorway(N, uN(x), 2.0, ZF + 0.6, 7.0)
    arched(win, trim, N, uN(x), 1.2, 9.8, 11.3, 0.2)
  }
  arched(win, trim, T, uN(XC), 1.4, 10.0, 11.9, 0.22)
  // the white parapet: frieze and balustrade along the front, rising in a concave scroll to the tower
  const scroll: XY[] = []
  const zp = EAVE + 1.9, zt = 21.6
  scroll.push([uN(XL - 0.35), EAVE + 0.15])
  scroll.push([uN(XR + 0.35), EAVE + 0.15], [uN(XR + 0.35), zp])
  for (let k = 0; k <= 6; k++) { const t = k / 6; scroll.push([uN(TX1 + 3.0 - t * 3.0), zp + (zt - zp) * t * t]) }
  for (let k = 0; k <= 6; k++) { const t = 1 - k / 6; scroll.push([uN(TX0 - 3.0 + t * 3.0), zp + (zt - zp) * t * t]) }
  scroll.push([uN(XL - 0.35), zp])
  faceSlab(trim, faceAt(0, YN - 0.5, 0), scroll.map(([u, z]) => [u, z] as XY), 0, 0.75)
  // urn pinnacles on the front corners
  for (const x of [XL + 0.2, XR - 0.2]) pinnacle(trim, x, YN + 0.1, zp, 1.3, 4.4)
  // the pediment over the tower bay
  faceSlab(trim, T, [[uN(TX1 + 0.6), EAVE + 0.15], [uN(TX0 - 0.6), EAVE + 0.15], [uN(XC), 19.0]], 0, 0.7)

  // ---- the tower: brick shaft, belfry, white cornice and baroque attic
  const ZC0 = 31.4, ZC1 = 32.6, ZA = 35.2
  pslab(brick, rect(TX0, TX1, TY0, TY1), 0, ZC0, 0, false)
  const tc: XY = [XC, (TY0 + TY1) / 2], th = (TY1 - TY0) / 2
  const tfaces: [Face, number][] = [
    [faceAt(0, TY1, 0), uN(XC)], [faceAt(0, TY0, 180), uS(XC)],
    [faceAt(TX1, 0, 90), uE(tc[1])], [faceAt(TX0, 0, 270), uW(tc[1])],
  ]
  for (const [F, u] of tfaces) {
    // corner pilasters with white capitals under the cornice
    for (const s of [-1, 1]) {
      faceSlab(brick, F, rectPoly(u + s * (TW - 0.55) - 0.55, u + s * (TW - 0.55) + 0.55, 17.0, ZC0 - 0.9), 0, 0.25)
      faceSlab(trim, F, rectPoly(u + s * (TW - 0.55) - 0.7, u + s * (TW - 0.55) + 0.7, ZC0 - 0.9, ZC0), 0, 0.35)
    }
    // the belfry opening: white surround, grey louvres, a white mullion
    facePoly(trim, F, archPoly(u, 3.1, 21.0, 27.8, 10), 0.04)
    facePoly(roof, F, archPoly(u, 2.5, 21.3, 27.8, 10), 0.08)
    facePoly(trim, F, rectPoly(u - 0.09, u + 0.09, 21.3, 28.6), 0.1)
  }
  // cornice, attic, scrolled pediments with louvered oculi, corner urns
  pslab(trim, rect(TX0 - 0.5, TX1 + 0.5, TY0 - 0.5, TY1 + 0.5), ZC0, ZC1, 0.2, true, true)
  const AW = TW - 0.5
  pslab(trim, rect(XC - AW, XC + AW, tc[1] - AW, tc[1] + AW), ZC1, ZA, 0.1)
  const ped: XY[] = [[-AW, ZA - 0.4], [AW, ZA - 0.4], [AW, ZA + 0.3], [2.6, ZA + 0.7], [1.7, ZA + 1.35], [0.8, ZA + 1.7], [-0.8, ZA + 1.7], [-1.7, ZA + 1.35], [-2.6, ZA + 0.7], [-AW, ZA + 0.3]]
  const afaces: [Face, number][] = [
    [faceAt(0, tc[1] + AW, 0), uN(XC)], [faceAt(0, tc[1] - AW, 180), uS(XC)],
    [faceAt(XC + AW, 0, 90), uE(tc[1])], [faceAt(XC - AW, 0, 270), uW(tc[1])],
  ]
  for (const [F, u] of afaces) {
    faceSlab(trim, F, ped.map(([a, z]) => [u + a, z] as XY), -0.6, 0.15)
    facePoly(trim, F, circle(u, 34.0, 0.95, 12).map(([a, b]) => [a, b] as XY), 0.06)
    facePoly(roof, F, circle(u, 34.0, 0.7, 12).map(([a, b]) => [a, b] as XY), 0.1)
  }
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) pinnacle(trim, XC + sx * (TW - 0.1), tc[1] + sy * (TW - 0.1), ZC1, 0.9, 2.6)

  // ---- the gold dome: eight ribbed facets (flat-shaded, so the ribs catch the light), as wide as
  // the attic, its foot hidden behind the pediments; then the panelled lantern drum, the open
  // lantern, the bell cap, the finial and the cross. Profile measured row by row from the NE
  // close-up (2025d) against the tower and scaled between the lidar's cornice top and cross top.
  lathe(trim, XC, tc[1], [[AW, ZA], [3.55, ZA], [3.55, ZA + 0.25]], 16, false)
  octo(gold, XC, tc[1], [[3.55, ZA + 0.25], [3.85, 36.4], [3.85, 37.6], [3.55, 38.7], [3.0, 39.6], [2.3, 40.4], [1.75, 41.0], [1.6, 41.3]])
  octo(gold, XC, tc[1], [[1.6, 41.3], [1.55, 41.3], [1.55, 44.0], [1.8, 44.05], [1.8, 44.45], [1.28, 44.45], [1.28, 47.3], [1.48, 47.35], [1.48, 47.65], [1.05, 47.7], [0.62, 48.6], [0.3, 49.5], [0.36, 49.55], [0.36, 50.3], [0.12, 50.35]], true)
  // panels on the drum and the lantern's arched openings, one a facet
  for (let k = 0; k < 8; k++) {
    const a = (k + 0.5) * Math.PI / 4
    const at = (r: number) => faceAt(XC + r * Math.cos(Math.PI / 8) * Math.cos(a), tc[1] + r * Math.cos(Math.PI / 8) * Math.sin(a), 90 - (a * 180) / Math.PI)
    facePoly(trim, at(1.55), rectPoly(-0.3, 0.3, 42.0, 43.4), 0.03)
    facePoly(roof, at(1.28), archPoly(0, 0.5, 45.1, 46.5, 6), 0.03)
  }
  pslab(gold, rect(XC - 0.11, XC + 0.11, tc[1] - 0.11, tc[1] + 0.11), 50.3, 52.9, 0, true)
  pslab(gold, rect(XC - 0.7, XC + 0.7, tc[1] - 0.11, tc[1] + 0.11), 51.6, 51.85, 0, true, true)

  const lit = (lo: number, hi: number) => (q: V3, n: V3) => (n[2] > 0.7 ? 0.15 : q[2] > 19 ? hi : lo)
  return [
    { part: brick, material: { ...BRICK, floodlight: lit(0.15, 0.6) } },
    { part: trim, material: { ...PALETTE.trim, floodlight: lit(0.2, 0.7) } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: gold, material: { ...GOLD, floodlight: () => 0.9 } },
    { part: door, material: finish('icc-oak-door', 0x8a6a4c) },
  ]
}

if (import.meta.main) await saveModel('kc-cathedral-immaculate-conception', 'Cathedral of the Immaculate Conception', build(), 6500)
