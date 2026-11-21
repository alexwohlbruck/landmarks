/**
 * Latta Arcade and Brevard Court (320 S Tryon St, 1914-15; William H.
 * Peeps for Edward Dilworth Latta's Charlotte Consolidated Construction
 * Company), Charlotte — original procedural geometry, CC0-1.0.
 * bun generators/clt-latta-arcade.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * centroid of the OSM outline way/1047699822) on the lowest ground. Placed at
 * bearing 47.93, square to Uptown's grid: +x faces South Tryon Street, -x
 * runs back to Brevard Court.
 *
 * Identity:
 *  - the cream two-storey front on Tryon under a band of grey-green tile
 *    roof, its dentilled cornice, the central entrance recessed 0.7 m
 *    between two stone pilasters, with a semicircular fanlit arch (its
 *    soffit drawn back to the recessed wall) and keystone over the "LATTA
 *    ARCADE" band, shopfronts either side (Dmadeo's exterior photo);
 *  - the long skylit arcade behind it, a glass gable over the middle
 *    (interior photo; lidar's ridge);
 *  - the low shops of Brevard Court at the back.
 *
 * Evidence:
 *  - OSM: way/1047699822 (Latta Arcade, 2 levels), way/1047699832 and
 *    way/1047699833 (Brevard Court shops, 2 levels). National Register
 *    1975; built 1914 (Wikipedia "Latta Arcade"; the sidewalk plaque says
 *    opened 1915).
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17), 1 m grid,
 *    read in this frame. Street 5.0 m above the box's lowest return;
 *    heights from it. Front block 12.5 m (x 16-27); arcade ranges 9.3 m;
 *    the skylight's ridge 11.2 m over |y| ≤ 3; Brevard Court shops 7.5 m;
 *    the passage at |y| < 3 west of the arcade is open ground.
 *  - Photos (Wikimedia Commons): "Latta Arcade Exterior, Charlotte,
 *    NC.JPG" (Dmadeo, CC BY-SA 3.0,
 *    https://commons.wikimedia.org/wiki/File:Latta_Arcade_Exterior,_Charlotte,_NC.JPG);
 *    "Latta Arcade Charlotte.jpg" (EricCable, CC BY-SA 3.0, the entrance
 *    and pilasters, https://commons.wikimedia.org/wiki/File:Latta_Arcade_Charlotte.jpg);
 *    "Latta Arcade, interior, Charlotte, NC.JPG" (Dmadeo, CC BY-SA 3.0,
 *    the skylight and the Brevard Court end,
 *    https://commons.wikimedia.org/wiki/File:Latta_Arcade,_interior,_Charlotte,_NC.JPG).
 *    No commercial imagery or 3D tiles; no look-only sources.
 *
 * Next door: 300 South Tryon (clt-300-south-tryon) stands north-east of
 * the arcade. The two OSM outlines do not overlap (a 1-2 m gap); each model
 * stays inside its own outline and lists only its own ways.
 *
 * Estimated (Dmadeo's photo, scaled to the 30.4 m front): the cornice at
 * 10.2 m, the tile band rising 2.1 m over 2 m, the shopfronts 0.6-5.2 m,
 * the upper windows 6.4-8.8 m, the pilasters (1 m, 6.3 m tall), the arch
 * (radius 1.9 m, springing at 7.1 m from the sign band), the recess
 * 0.7 m (estimated), the entrance centred on the front.
 *
 * Checked against Dmadeo's exterior photo from Tryon (front, arch,
 * cornice and tile band) and the interior photo (the skylit spine).
 *
 * Doubts: the photo shows fewer upper windows than the six drawn (two at
 * the left, one cross-barred window right of the arch, one at the right);
 * the rest of the upper front is blank stucco. The entrance is drawn at the front's centre; the photo is
 * framed so it may sit a little off. Brevard Court and the arcade's back
 * are seen only from inside; drawn plain, cream, with shopfronts. The
 * side walls are party walls and get no windows.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, panel, rect, save, walls, type XY } from './chi-aon-center'

const BEARING = 47.93
const ANCHOR: [number, number] = [35.2254639, -80.8462695]

const stucco = new Part(), trim = new Part(), tile = new Part(), win = new Part(), sky = new Part(), roof = new Part()

const FX0 = 16, FX1 = 26.6, FY0 = -15.1, FY1 = 15.3
const CORNICE = 10.2, FRONT_TOP = 12.5, RANGE = 9.3, DEPTH = 0.7

// --- The arcade's two-storey ranges, and the skylit spine between them.
{
  const A: XY[] = [[-27.6, -14.1], [0.9, -14.1], [0.9, -15.1], [FX0, -15.1], [FX0, 15.3], [3.0, 15.3], [3.0, 14.1], [-27.6, 14.1]]
  walls(stucco, A, 0, RANGE)
  cap(roof, A, RANGE)
  // a pale coping
  walls(trim, A, RANGE - 0.4, RANGE + 0.15)
  // spine: clerestory walls and a glass gable along the arcade
  const S: XY[] = rect(-27.6, -4, FX0, 4)
  walls(stucco, S, RANGE, 10.2)
  const r = (x: number, y: number, z: number): V3 => [x, y, z]
  const xs = -27.6, xe = FX0
  sky.quad(r(xs, -4, 10.2), r(xe, -4, 10.2), r(xe, 0, 11.4), r(xs, 0, 11.4))
  sky.quad(r(xe, 4, 10.2), r(xs, 4, 10.2), r(xs, 0, 11.4), r(xe, 0, 11.4))
  sky.tri(r(xs, 4, 10.2), r(xs, -4, 10.2), r(xs, 0, 11.4))
  // back (Brevard Court) end: the arcade's rear entrance and windows
  const back = (y0: number, y1: number, z0: number, z1: number) => panel(win, [-27.6, 14.1], [-27.6, -14.1], 14.1 - y1, 14.1 - y0, z0, z1)
  back(-2.2, 2.2, 0, 4.2)
  back(-2.2, 2.2, 5.6, 8.4)
  for (const y of [-11, -7, 7]) { back(y - 1.4, y + 1.4, 0.6, 3.8); back(y - 1.2, y + 1.2, 5.6, 8.2) }
}

// --- The Tryon front block.
{
  // The front wall, with the entrance bay recessed DEPTH behind it between
  // the pilasters (its arch is closed again at the front plane below).
  const F: XY[] = [[FX0, FY0], [FX1, FY0], [FX1, -2.1], [FX1 - DEPTH, -2.1], [FX1 - DEPTH, 2.1], [FX1, 2.1], [FX1, FY1], [FX0, FY1]]
  walls(stucco, F, 0, CORNICE)
  // cornice: a projecting pale band across the front, returning at the ends
  const C: XY[] = rect(FX0, FY0 - 0.3, FX1 + 0.45, FY1 + 0.3)
  walls(trim, C, CORNICE - 0.7, CORNICE)
  cap(trim, C, CORNICE - 0.7, false)
  cap(trim, C, CORNICE)
  // the tile band: a slope from the cornice up to the flat roof, closed at the ends
  const xi = FX1 - 2.0
  tile.quad([FX1 + 0.3, FY0 - 0.2, CORNICE], [FX1 + 0.3, FY1 + 0.2, CORNICE], [xi, FY1 + 0.2, FRONT_TOP], [xi, FY0 - 0.2, FRONT_TOP])
  tile.tri([FX1 + 0.3, FY1 + 0.2, CORNICE], [FX0, FY1 + 0.2, CORNICE], [xi, FY1 + 0.2, FRONT_TOP])
  tile.quad([FX0, FY1 + 0.2, CORNICE], [FX0, FY1 + 0.2, FRONT_TOP], [xi, FY1 + 0.2, FRONT_TOP], [xi, FY1 + 0.2, FRONT_TOP])
  stucco.quad([FX0, FY1 + 0.2, CORNICE], [FX0, FY0 - 0.2, CORNICE], [FX0, FY0 - 0.2, FRONT_TOP], [FX0, FY1 + 0.2, FRONT_TOP])
  stucco.quad([FX0, FY0 - 0.2, CORNICE], [xi, FY0 - 0.2, FRONT_TOP], [FX0, FY0 - 0.2, FRONT_TOP], [FX0, FY0 - 0.2, FRONT_TOP])
  stucco.tri([FX0, FY0 - 0.2, CORNICE], [FX1 + 0.3, FY0 - 0.2, CORNICE], [xi, FY0 - 0.2, FRONT_TOP])
  stucco.tri([FX0, FY0 - 0.2, CORNICE], [xi, FY0 - 0.2, FRONT_TOP], [FX0, FY0 - 0.2, FRONT_TOP])
  stucco.tri([FX0, FY1 + 0.2, CORNICE], [FX0, FY1 + 0.2, FRONT_TOP], [xi, FY1 + 0.2, FRONT_TOP])
  cap(roof, rect(FX0, FY0 - 0.2, xi, FY1 + 0.2), FRONT_TOP)

  // Facade on Tryon (x = FX1), drawn in face coordinates s (along, from
  // the south end) and z. The wall runs FY0 → FY1 seen from Tryon.
  const a: XY = [FX1, FY0], b: XY = [FX1, FY1], L = FY1 - FY0, mid = -FY0 // s of y = 0
  // shopfronts and upper windows, three bays each side of the entrance
  const bayW = (mid - 3.6) / 3
  for (const side of [-1, 1]) {
    for (let k = 0; k < 3; k++) {
      const s0 = side < 0 ? 0.5 + k * bayW : mid + 3.6 + k * bayW, s1 = s0 + bayW - 0.8
      panel(win, a, b, s0 + 0.2, s1, 0.6, 5.2)
      // pale pier between shopfronts
      panel(trim, a, b, s1, s1 + 0.8, 0, 5.6, 0.12)
      panel(win, a, b, s0 + 0.9, s1 - 0.5, 6.4, 8.8)
    }
  }
  // a pale sill band under the upper windows
  panel(trim, a, b, 0, L, 5.6, 6.0, 0.1)
  // the entrance: pilasters, sign band, recessed doors, the fanlit arch
  const e0 = mid - 3.1, e1 = mid + 3.1
  for (const s of [e0, e1 - 1]) {
    const P: XY[] = [[FX1, FY0 + s], [FX1 + 0.45, FY0 + s], [FX1 + 0.45, FY0 + s + 1], [FX1, FY0 + s + 1]]
    walls(trim, P, 0, 6.3)
    cap(trim, P, 6.3)
  }
  // doors on the recessed wall
  const ar: XY = [FX1 - DEPTH, FY0], br: XY = [FX1 - DEPTH, FY1]
  panel(win, ar, br, mid - 1.9, mid + 1.9, 0, 5.3, 0.04)
  panel(trim, a, b, e0, e1, 5.4, 7.1, 0.25)
  panel(win, a, b, e0 + 0.5, e1 - 0.5, 5.8, 6.7, 0.27) // the dark sign panel
  // The fanlit arch: a true semicircle springing from the sign band. The
  // front plane is closed round it (spandrels), the arch's soffit runs back
  // to the recessed wall, and the fanlight glass sits on that wall.
  const cz = 7.1, R = 1.9, ring = 0.45, N = 12, W2 = 2.1, H = CORNICE - 0.7 - cz
  const P = (s: number, z: number, o: number): V3 => [FX1 + o, FY0 + s, z]
  const arc = (t: number, r: number, o: number) => P(mid - r * Math.cos(t), cz + r * Math.sin(t), o)
  const out: V3 = [1, 0, 0]
  const tc = Math.atan2(H, W2)
  const ts = [...Array.from({ length: N + 1 }, (_, k) => Math.PI * k / N), tc, Math.PI - tc].sort((p, q) => p - q)
  const bound = (t: number) => {
    const c = Math.cos(t), sn = Math.sin(t)
    const k = Math.min(Math.abs(c) > 1e-9 ? W2 / Math.abs(c) : Infinity, sn > 1e-9 ? H / sn : Infinity)
    return P(mid - k * c, cz + k * sn, 0)
  }
  for (let i = 0; i < ts.length - 1; i++) {
    const t0 = ts[i], t1 = ts[i + 1]
    if (t1 - t0 < 1e-6) continue
    // spandrel between the arch and the bay's rectangle, in the front plane
    stucco.tri(arc(t0, R, 0), bound(t0), bound(t1), undefined, undefined, undefined, [out, out, out])
    stucco.tri(arc(t0, R, 0), bound(t1), arc(t1, R, 0), undefined, undefined, undefined, [out, out, out])
    // fanlight glass on the recessed wall
    win.tri(P(mid, cz, -DEPTH + 0.04), arc(t1, R, -DEPTH + 0.04), arc(t0, R, -DEPTH + 0.04), undefined, undefined, undefined, [out, out, out])
    // soffit, facing in toward the arch's centre
    const n0: V3 = [0, Math.cos(t0), -Math.sin(t0)], n1: V3 = [0, Math.cos(t1), -Math.sin(t1)]
    stucco.tri(arc(t0, R, 0), arc(t1, R, 0), arc(t1, R, -DEPTH), undefined, undefined, undefined, [n0, n1, n1])
    stucco.tri(arc(t0, R, 0), arc(t1, R, -DEPTH), arc(t0, R, -DEPTH), undefined, undefined, undefined, [n0, n1, n0])
    // the pale moulded ring round the arch, just proud of the front
    trim.tri(arc(t0, R, 0.14), arc(t0, R + ring, 0.14), arc(t1, R + ring, 0.14), undefined, undefined, undefined, [out, out, out])
    trim.tri(arc(t0, R, 0.14), arc(t1, R + ring, 0.14), arc(t1, R, 0.14), undefined, undefined, undefined, [out, out, out])
  }
  panel(trim, a, b, mid - 0.35, mid + 0.35, cz + R - 0.1, CORNICE - 0.6, 0.2)
}

// --- Brevard Court shops (OSM way/1047699832, way/1047699833).
for (const B of [
  [[-39.2, 3.0], [-27.6, 3.3], [-27.6, 14.1], [-39.4, 14.2]],
  [[-49.3, 2.8], [-39.2, 3.0], [-39.4, 14.2], [-49.6, 14.0]],
] as XY[][]) {
  walls(stucco, B, 0, 7.5)
  walls(trim, B, 7.1, 7.6)
  cap(roof, B, 7.6)
  // shopfronts on the court side (the south face) and upper windows
  const a = B[0], b = B[1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = 2
  for (let k = 0; k < n; k++) {
    panel(win, a, b, k * L / n + 0.8, (k + 1) * L / n - 0.8, 0.5, 3.6)
    panel(win, a, b, k * L / n + 1.2, (k + 1) * L / n - 1.2, 4.5, 6.6)
  }
}

if (import.meta.main) {
  await save('clt-latta-arcade', 'Latta Arcade', ANCHOR, BEARING, [
    { part: stucco, material: finish('latta-stucco', 0xe9e0cd) },
    { part: trim, material: PALETTE.trim },
    { part: tile, material: finish('latta-tile', 0x9eab9b) },
    { part: win, material: PALETTE.window },
    { part: sky, material: PALETTE.glass },
    { part: roof, material: PALETTE.roof },
  ])
}
