/**
 * Christ Church (1727-44, attributed to Dr John Kearsley; steeple 1751-54,
 * Robert Smith), North 2nd Street, Philadelphia — original procedural
 * geometry, CC0-1.0.
 * bun generators/phl-christ-church.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/332757057,
 * 39.950730,-75.143864. Its long walls run at 100.2°, so the catalog bearing
 * is 10.2 and the church is square to this frame: +x is the 2nd Street
 * (east) front with the Palladian window, -x the tower and steeple on the
 * churchyard, ±y the long south and north sides.
 *
 * Identity, in order: the tall white wooden steeple on the square brick
 * tower at the west end — a square stage with urns at its corners, a
 * chamfered stage with a pediment and an oculus on each face, the octagonal
 * arcaded belfry, the bell-shaped cap, a small drum and the long octagonal
 * spire with its gilt ball and vane (at 196 ft the tallest structure in
 * North America until 1810); the long red-brick nave of eight bays, two
 * tiers of round-headed windows between brick pilasters, under a white
 * cornice; the cream balustrade along both eaves with brick pedestals and
 * urns; the pale green copper gable roof; the east front's projecting
 * centre bay with the great Palladian window, an attic and a pediment, all
 * crowned with urns. At night the steeple is floodlit white and the brick
 * lit from the street; the windows glow.
 *
 * Evidence:
 *  - plan: OSM outline way/332757057 and its parts way/340937481 (tower,
 *    tagged 30 m), 340937482 (nave, 24 m), 340952525/340937483/340937484/
 *    340937485 (steeple stages, 35/45/50/60 m). Turned to 10.2° the outline
 *    is exactly rectilinear: nave 26.4 × 19.5 m, the east centre bay
 *    10.2 m wide projecting 1.5 m, tower 10.0 × 11.2 m. HABS PA-1071 (1933,
 *    Library of Congress, public domain) sheets 6, 7 and 8 draw the tower
 *    9.1-9.3 m square on its shaft; it is drawn 9.6 m square, on OSM's west
 *    line and the nave's axis.
 *  - heights: lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015),
 *    0.5 m grid, above the lowest ground under the footprint (2nd Street
 *    side, ~0.5 m above the box's ground_min): ridge 17.0, balustrade
 *    ~12.2, tower top 25.6, highest return 60.3 m (published 196 ft =
 *    59.7 m). The lidar sits ~1 m south of OSM, as at Independence Hall;
 *    OSM is kept. HABS sheet 7 (south elevation, 1:96 scan): cornice 9.6,
 *    balustrade 11.4, urns 12.6, tower string courses 5.1, 12.0, 16.6 m,
 *    window sills, springings and arch tops (all scaled 1.03 to the lidar
 *    tower). HABS sheet 6 (east elevation): centre-bay entablature 10.9-
 *    11.9, attic to 14.4, pediment apex 17.1, urn tops 18.7 m; Palladian
 *    centre light 3.2 m wide springing at 6.4 m. HABS sheet 8 (steeple
 *    elevation, figured in feet) for the steeple's stages and widths; they
 *    sum to 34.6 m over the tower, exactly the lidar's tower-to-vane
 *    height: square stage 2.38 m (6.7 m wide), chamfered stage to 6.1 m
 *    (7.4 m), octagonal plinth to 8.33, belfry to 12.86 (14 ft 10 in;
 *    5.95 m across the flats), bell cap to 15.12 (7 ft), drum and spire to
 *    27.4 (40 ft 3 in), gilt ball 28.1, vane 34.6 m above the tower top.
 *  - bays: eight to each long side (3.3 m), HABS sheet 7 and Al R's photo:
 *    the end bays of the upper tier and the west bay of the lower tier are
 *    blind arches, the second and seventh lower bays doors.
 *  - colours, from the daylight photos: the warm orange-red Flemish-bond
 *    brick pulled to the palette's lightness, the same treatment as the
 *    neighbouring phl-independence-hall and phl-congress-hall; cream
 *    painted wood of the steeple, cornices, sashes and balustrade (palette
 *    trim); the pale green standing-seam copper roof (photos and NAIP);
 *    charcoal for the belfry openings and louvres; the gilt ball.
 *
 * Photos (Wikimedia Commons): Christ_Church,_Philadelphia_12.2021_(edited)
 * .jpg (Al R, CC BY-SA 2.0; the south side and steeple); Christ_Church_-
 * _Philadelphia.JPG (Farragutful, CC BY-SA 4.0; the tower from the north-
 * west); Christ_Church_Phila.JPG (PVSBond, CC BY-SA 3.0; south-west);
 * Christ_Church_from_2nd_Street.jpg and Christ_Church_from_N._2nd_Street.jpg
 * (Beyond My Ken, CC BY-SA 4.0; the east front from the south-east and
 * north-east); Christ_Church_Philadelphia.jpg (Beyond My Ken, CC BY-SA 4.0);
 * Christ_Church,_Philadelphia.jpg (Elisa Rolle, CC BY-SA 3.0). HABS PA-1071
 * sheets 2, 6, 7, 8 and 9 (public domain). USGS NAIP for the roof colour.
 * No commercial imagery.
 *
 * Left out: the balusters (the balustrade is a plain cream band), the
 * scrolls beside the east attic and at the tower, the carved panel and
 * cartouche of the east front, keystones, sash bars, the console brackets
 * and garlands of the steeple, the grey stone base on 2nd Street, the vane's
 * mitre and cardinal balls, the churchyard railings.
 *
 * Doubts: the north side is drawn as the south side's mirror (HABS sheet 9
 * agrees on the bays; photos of it are few and through trees); the bell
 * cap's profile follows HABS, as street photos foreshorten it; the tower's
 * east face above the roof is assumed to repeat the belfry opening.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, lathe, rect, save, walls, type XY } from './chi-aon-center'
import { archOn, bbox, discOn, face, floodWalls, ngon, pedimentOn, rectOn } from './phl-independence-hall'

type Seg = [XY, XY]
const sides = (r: XY[]) => ({ S: [r[0], r[1]], E: [r[1], r[2]], N: [r[2], r[3]], W: [r[3], r[0]] }) as Record<'S' | 'E' | 'N' | 'W', Seg>

/** An urn on a small plinth, standing at (x, y) on z. */
function urn(p: Part, x: number, y: number, z: number, k = 1) {
  lathe(p, x, y, [[0.26 * k, z], [0.3 * k, z + 0.15 * k], [0.17 * k, z + 0.3 * k], [0.36 * k, z + 0.62 * k], [0.24 * k, z + 0.92 * k], [0.09 * k, z + 1.15 * k], [0.13 * k, z + 1.3 * k], [0, z + 1.45 * k]], 6)
}

/** A round-headed window: white surround and glazing, flat on wall a→b. */
function archWin(trim: Part, win: Part, s: Seg, c: number, hw: number, z0: number, zs: number, f = 0.2) {
  archOn(trim, s[0], s[1], c, hw + f, z0 - f * 0.75, zs, 0.04)
  archOn(win, s[0], s[1], c, hw, z0, zs, 0.08)
}

function build() {
  const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), dark = new Part(), gold = new Part()

  // ------------------------------------------------------------- the nave
  const CY = 0.15, HY = 9.75
  const X0 = -9.82, X1 = 16.56, YS = CY - HY, YN = CY + HY
  const ENT = 8.7, CORN = 9.6, BAL = 11.3, EAVE = 11.0, RIDGE = 17.0
  const nave = rect(X0, YS, X1, YN)
  walls(brick, nave, 0, ENT)
  // Entablature and cornice, and the stone belt between the tiers.
  bbox(trim, null, X0 - 0.4, YS - 0.4, X1 + 0.4, YN + 0.4, ENT, CORN, 0.3)
  bbox(trim, null, X0 - 0.07, YS - 0.07, X1 + 0.07, YN + 0.07, 5.0, 5.3, 0.04)

  // Balustrade: a cream band set on the cornice, brick pedestals over the
  // pilasters, urns on the pedestals.
  {
    const o = rect(X0 - 0.1, YS - 0.1, X1 + 0.1, YN + 0.1), i = rect(X0 + 0.25, YS + 0.25, X1 - 0.25, YN - 0.25)
    walls(trim, o, CORN, BAL)
    walls(trim, [...i].reverse(), CORN, BAL)
    for (let k = 0; k < 4; k++) face(trim, [[...o[k], BAL], [...o[(k + 1) % 4], BAL], [...i[(k + 1) % 4], BAL], [...i[k], BAL]] as V3[], [0, 0, 1])
  }
  const BAY = (X1 - X0) / 8
  const px = Array.from({ length: 9 }, (_, i) => X0 + i * BAY)
  for (const x of px) {
    for (const y of [YS, YN]) {
      const s = y < 0 ? -1 : 1
      // Pilaster up the wall, pedestal on the cornice, urn on the pedestal.
      const xa = Math.max(X0 - 0.12, x - 0.38), xb = Math.min(X1 + 0.12, x + 0.38)
      bbox(brick, null, xa, Math.min(y, y + s * 0.16), xb, Math.max(y, y + s * 0.16), 0, ENT, 0.05)
      if (x < X0 + 0.1) continue // the tower covers the west end's pedestals
      const pa = Math.max(X0 - 0.1, x - 0.35), pb = Math.min(X1 + 0.1, x + 0.35)
      bbox(brick, brick, pa, Math.min(y - s * 0.3, y + s * 0.12), pb, Math.max(y - s * 0.3, y + s * 0.12), CORN, BAL + 0.25, 0.06)
      urn(trim, (pa + pb) / 2, y - s * 0.09, BAL + 0.25, 0.75)
    }
  }

  // Windows: eight bays to each long side, two tiers.
  const S = sides(nave)
  for (const k of ['S', 'N'] as const) {
    const seg = S[k]
    const along = (x: number) => (k === 'S' ? x - X0 : X1 - x)
    for (let i = 0; i < 8; i++) {
      const s = along(X0 + (i + 0.5) * BAY)
      if (i > 0 && i < 7) archWin(trim, win, seg, s, 0.82, 5.65, 7.5)
      if (i === 1 || i === 6) {
        // Doors: a white surround, the fanlight, dark panelled leaves.
        archOn(trim, seg[0], seg[1], s, 1.05, 0, 3.0, 0.04)
        archOn(win, seg[0], seg[1], s, 0.82, 3.0, 3.0, 0.08)
        rectOn(dark, seg[0], seg[1], s, 0.82, 0, 2.85, 0.08)
      } else if (i > 0) archWin(trim, win, seg, s, 0.85, 0.95, 3.3)
    }
  }

  // Roof: a copper gable from behind the balustrade to the ridge, closed by
  // brick gable walls at both ends.
  {
    const ys = YS + 0.3, yn = YN - 0.3
    face(roof, [[X0, ys, EAVE], [X1, ys, EAVE], [X1, CY, RIDGE], [X0, CY, RIDGE]], [0, -1, 1.5])
    face(roof, [[X1, yn, EAVE], [X0, yn, EAVE], [X0, CY, RIDGE], [X1, CY, RIDGE]], [0, 1, 1.5])
    face(roof, [[X0, ys, EAVE], [X1, ys, EAVE], [X1, yn, EAVE], [X0, yn, EAVE]], [0, 0, -1])
    face(brick, [[X0, ys, EAVE], [X0, yn, EAVE], [X0, CY, RIDGE]], [-1, 0, 0])
    face(brick, [[X1, ys, EAVE], [X1, yn, EAVE], [X1, CY, RIDGE]], [1, 0, 0])
    cap(roof, rect(X0 + 0.25, YS + 0.25, X1 - 0.25, YN - 0.25), EAVE, true)
  }

  // ------------------------------------------------------ the east front
  {
    const E0 = X1, E1 = 18.08, HB = 5.1
    const ctr = rect(E0 - 0.3, CY - HB, E1, CY + HB)
    walls(brick, ctr, 0, 10.9)
    bbox(trim, null, E0 - 0.3, CY - HB - 0.35, E1 + 0.35, CY + HB + 0.35, 10.9, 11.9, 0.3)
    // Attic and pediment.
    const A0 = E0 - 0.3, A1 = E1 - 0.25, HA = HB - 0.35
    walls(brick, rect(A0, CY - HA, A1, CY + HA), 11.9, 14.4)
    bbox(trim, null, A0, CY - HA - 0.2, A1 + 0.2, CY + HA + 0.2, 14.15, 14.55, 0.12)
    const P0 = 14.55, PA = 17.1
    // Tympanum and the two rakes, then the pediment's roof back to the gable.
    face(brick, [[A1, CY - HA, P0], [A1, CY + HA, P0], [A1, CY, PA - 0.35]], [1, 0, 0])
    for (const s of [-1, 1]) {
      const yo = CY + s * (HA + 0.3)
      face(trim, [[A1 + 0.3, yo, P0 - 0.05], [A1 + 0.3, CY, PA + 0.05], [A1 + 0.3, CY, PA - 0.45], [A1 + 0.3, CY + s * (HA - 0.6), P0 - 0.05]], [1, 0, 0])
      face(roof, [[A0, yo, P0], [A1 + 0.3, yo, P0], [A1 + 0.3, CY, PA + 0.05], [A0, CY, PA + 0.05]], [0, s * (PA - P0), HA])
      face(trim, [[A1, yo, P0 - 0.05], [A1 + 0.3, yo, P0 - 0.05], [A1 + 0.3, CY, PA + 0.05], [A1, CY, PA + 0.05]], [0, s * (PA - P0), HA])
    }
    face(brick, [[A0, CY - HA - 0.3, P0], [A0, CY + HA + 0.3, P0], [A0, CY, PA + 0.05]], [-1, 0, 0])
    discOn(trim, [A1, CY - HA], [A1, CY + HA], HA, 15.6, 0.5, 0.05, 12)
    // Urns on the pediment's corners and apex.
    urn(trim, A1 - 0.1, CY, PA, 1.1)
    for (const s of [-1, 1]) urn(trim, A1 - 0.2, CY + s * (HA - 0.1), P0, 1.0)
    // The Palladian window, in a white surround.
    const F = sides(ctr).E
    const c = HB
    archOn(trim, F[0], F[1], c, 1.9, 1.9, 6.4, 0.04)
    archOn(win, F[0], F[1], c, 1.6, 2.1, 6.4, 0.08)
    for (const d of [-2.45, 2.45]) {
      rectOn(trim, F[0], F[1], c + d, 0.7, 1.9, 6.65, 0.04)
      rectOn(win, F[0], F[1], c + d, 0.47, 2.1, 6.4, 0.08)
    }
    // Pale pilasters at the bay's corners.
    for (const d of [-HB + 0.45, HB - 0.45]) rectOn(trim, F[0], F[1], c + d, 0.38, 0.3, 10.9, 0.05)
    // The side parts of the east wall: an upper round-headed window each.
    const E = S.E
    for (const y of [CY - 7.45, CY + 7.45]) archWin(trim, win, E, y - YS, 0.62, 5.7, 7.55, 0.22)
    // The east end's parapet is brick, not balustrade (HABS sheet 6, photos).
    bbox(brick, brick, X1 - 0.3, YS - 0.12, X1 + 0.12, YN + 0.12, CORN, BAL + 0.05, 0.06)
    // Urns on the east corners of the balustrade.
    for (const y of [YS + 0.1, YN - 0.1]) bbox(brick, brick, X1 - 0.6, y - 0.35, X1 + 0.1, y + 0.35, CORN, BAL + 0.25, 0.06)
    for (const y of [YS + 0.1, YN - 0.1]) urn(trim, X1 - 0.25, y, BAL + 0.25, 0.85)
  }

  // ------------------------------------------------------------ the tower
  const TX = -14.61, TH = 4.79, T = 25.6
  const tower = rect(TX - TH, CY - TH, TX + TH, CY + TH)
  walls(brick, tower, 0, 24.9)
  // Moulded-brick string courses (HABS sheet 7), brick like the wall.
  for (const z of [5.1, 12.0, 16.6]) bbox(brick, null, TX - TH - 0.1, CY - TH - 0.07, TX + TH + 0.1, CY + TH + 0.1, z, z + 0.35, 0.06)
  bbox(trim, null, TX - TH - 0.55, CY - TH - 0.55, TX + TH + 0.55, CY + TH + 0.55, 24.9, T, 0.35)
  cap(roof, rect(TX - TH - 0.2, CY - TH - 0.2, TX + TH + 0.2, CY + TH + 0.2), T)
  // Corner pilasters on the lower stages.
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x = TX + sx * TH, y = CY + sy * TH
    bbox(brick, null, Math.min(x, x - sx * 1.0) - (sx < 0 ? 0.12 : 0), Math.min(y, y + sy * 0.12), Math.max(x, x - sx * 1.0) + (sx > 0 ? 0.12 : 0), Math.max(y, y + sy * 0.12), 0, 16.6, 0.04)
    bbox(brick, null, Math.min(x, x + sx * 0.12), Math.min(y, y - sy * 1.0), Math.max(x, x + sx * 0.12), Math.max(y, y - sy * 1.0), 0, 16.6, 0.04)
  }
  const TF = sides(tower)
  for (const k of ['S', 'W', 'N', 'E'] as const) {
    const [a, b] = TF[k], c = TH
    // Belfry opening with dark louvres, all four faces (the east one shows over the roof).
    archOn(trim, a, b, c, 1.3, 18.5, 22.2, 0.04)
    archOn(dark, a, b, c, 1.02, 18.7, 22.2, 0.08)
    if (k === 'E') continue
    discOn(trim, a, b, c, 14.2, 1.0, 0.05, 14)
    discOn(win, a, b, c, 14.2, 0.72, 0.09, 14)
    archWin(trim, win, [a, b], c, 0.68, 7.0, 9.8, 0.22)
    // The doors in the base of the tower.
    archOn(trim, a, b, c, 1.1, 0, 2.6, 0.04)
    archOn(win, a, b, c, 0.85, 2.6, 2.6, 0.08)
    rectOn(dark, a, b, c, 0.85, 0, 2.45, 0.08)
  }

  // ---------------------------------------------------------- the steeple
  {
    const Z = (h: number) => T + h
    // Heights from HABS sheet 8's figured dimensions (feet, 1:1 with the
    // lidar): square stage 2.38, chamfered stage to 6.1, plinth to 8.33,
    // belfry (14 ft 10 in) to 12.86, bell cap (7 ft) to 15.12, spire
    // (40 ft 3 in with its drum) to 27.4, ball 28.1, vane 34.6 m.
    // Square stage with a louvre on each face; urns at its corners.
    const B = 3.33
    bbox(trim, trim, TX - B, CY - B, TX + B, CY + B, T, Z(2.38), 0.08)
    for (const [a, b] of Object.values(sides(rect(TX - B, CY - B, TX + B, CY + B)))) rectOn(dark, a, b, B, 0.45, Z(0.4), Z(1.9), 0.05)
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      bbox(trim, trim, TX + sx * 3.85 - 0.32, CY + sy * 3.85 - 0.32, TX + sx * 3.85 + 0.32, CY + sy * 3.85 + 0.32, T, Z(0.5), 0.06)
      urn(trim, TX + sx * 3.85, CY + sy * 3.85, Z(0.5), 1.1)
    }
    // Chamfered stage with an oculus and a pediment on each face.
    const C = 3.7, ch = 1.0
    const chring = (h: number, c: number): XY[] => [[TX - h + c, CY - h], [TX + h - c, CY - h], [TX + h, CY - h + c], [TX + h, CY + h - c], [TX + h - c, CY + h], [TX - h + c, CY + h], [TX - h, CY + h - c], [TX - h, CY - h + c]]
    walls(trim, chring(C, ch), Z(2.38), Z(5.8))
    walls(trim, chring(C + 0.3, ch), Z(5.8), Z(6.1))
    face(trim, chring(C + 0.3, ch).map(([x, y]) => [x, y, Z(5.8)] as V3), [0, 0, -1])
    cap(trim, chring(C + 0.3, ch), Z(6.1))
    walls(trim, chring(C + 0.2, ch), Z(2.25), Z(2.6))
    cap(trim, chring(C + 0.2, ch), Z(2.6))
    cap(trim, chring(C + 0.2, ch), Z(2.25), false)
    const C4 = chring(C, ch)
    for (const fi of [0, 2, 4, 6]) {
      const a = C4[fi], b = C4[fi + 1]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      discOn(dark, a, b, L / 2, Z(4.35), 0.7, 0.04, 14)
      discOn(trim, a, b, L / 2, Z(4.35), 0.48, 0.08, 14)
      pedimentOn(trim, a, b, L / 2, 1.65, Z(5.05), Z(5.8), 0.3)
    }
    // Octagonal plinth, then the belfry.
    const R8 = (f: number) => f / Math.cos(Math.PI / 8)
    walls(trim, ngon(TX, CY, R8(3.25), 8), Z(6.1), Z(8.05))
    walls(trim, ngon(TX, CY, R8(3.45), 8), Z(8.05), Z(8.33))
    face(trim, ngon(TX, CY, R8(3.45), 8).map(([x, y]) => [x, y, Z(8.05)] as V3), [0, 0, -1])
    cap(trim, ngon(TX, CY, R8(3.45), 8), Z(8.33))
    const bel = ngon(TX, CY, R8(2.98), 8)
    walls(trim, bel, Z(8.33), Z(12.3))
    for (let k = 0; k < 8; k++) {
      const a = bel[k], b = bel[(k + 1) % 8]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      archOn(dark, a, b, L / 2, 0.7, Z(8.75), Z(11.2), 0.04, 8)
    }
    const ent = ngon(TX, CY, R8(3.3), 8)
    walls(trim, ent, Z(12.3), Z(12.86))
    face(trim, ent.map(([x, y]) => [x, y, Z(12.3)] as V3), [0, 0, -1])
    // The bell cap, the drum and the spire, all octagonal.
    const a8 = Math.PI / 8
    lathe(trim, TX, CY, [[R8(3.3), Z(12.86)], [R8(3.1), Z(13.3)], [R8(2.7), Z(13.95)], [R8(2.15), Z(14.5)], [R8(1.7), Z(14.9)], [R8(1.5), Z(15.12)]], 8, a8)
    const drum = ngon(TX, CY, R8(1.5), 8)
    walls(trim, drum, Z(15.12), Z(16.2))
    for (let k = 0; k < 8; k++) rectOn(dark, drum[k], drum[(k + 1) % 8], R8(1.5) * Math.sin(a8), 0.3, Z(15.4), Z(15.95), 0.04)
    lathe(trim, TX, CY, [[R8(1.5), Z(16.2)], [R8(1.68), Z(16.3)], [R8(1.68), Z(16.55)], [R8(1.35), Z(16.7)], [R8(1.2), Z(17.3)], [R8(1.0), Z(20.5)], [R8(0.62), Z(24.5)], [R8(0.15), Z(27.4)], [0, Z(27.45)]], 8, a8)
    // Finial, gilt ball, vane.
    lathe(trim, TX, CY, [[0.14, Z(27.35)], [0.1, Z(27.7)], [0, Z(27.75)]], 6)
    lathe(gold, TX, CY, [[0, Z(27.6)], [0.26, Z(27.7)], [0.36, Z(27.95)], [0.26, Z(28.2)], [0, Z(28.3)]], 8)
    lathe(dark, TX, CY, [[0.07, Z(28.25)], [0.05, Z(34.6)], [0, Z(34.62)]], 6)
    const vz = Z(32.6)
    for (const [dx, dy] of [[1, 0], [0, 1]]) {
      const q: V3[] = [[TX - dx * 0.75, CY - dy * 0.75, vz - 0.05], [TX + dx * 0.75, CY + dy * 0.75, vz - 0.05], [TX + dx * 0.75, CY + dy * 0.75, vz + 0.05], [TX - dx * 0.75, CY - dy * 0.75, vz + 0.05]]
      face(dark, q, [dy, -dx, 0])
      face(dark, q, [-dy, dx, 0])
    }
    const vane: V3[] = [[TX - 0.9, CY, Z(33.4)], [TX + 1.0, CY, Z(33.4)], [TX + 1.0, CY, Z(33.9)], [TX - 0.9, CY, Z(33.9)]]
    face(gold, vane, [0, -1, 0])
    face(gold, vane, [0, 1, 0])
  }

  const steeple = (p: V3, n: V3) => (p[2] > 25 ? (n[2] > 0.7 ? 0.4 : 1) : floodWalls(p, n))
  return [
    { part: brick, material: { ...finish('cc-brick', 0xb0624c), floodlight: floodWalls } },
    { part: trim, material: { ...PALETTE.trim, floodlight: steeple } },
    { part: roof, material: finish('cc-copper', 0x8fb4a1) },
    { part: win, material: { ...PALETTE.window, color: 0x98a6b1 } },
    { part: dark, material: finish('cc-louvre', 0x4a4f57) },
    { part: gold, material: finish('cc-gilt', 0xc9a24a) },
  ]
}

if (import.meta.main) await save('phl-christ-church', 'Christ Church', [39.95073, -75.143864], 10.2, build(), 6500)
