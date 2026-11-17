/**
 * Sam Houston Monument, Hermann Park, Houston (1925; bronze by Enrico
 * Cerracchio, granite arch by Frank Teich) — procedural, CC0-1.0, no
 * textures.
 * bun generators/hou-sam-houston-monument.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Placed at bearing 0: the arch's passage runs north-south, on the
 * axis of the Jones Reflection Pool (the Pioneer Memorial obelisk stands
 * 330 m due south on it), and the lidar footprint is square to the grid.
 * Sam Houston rides east (+x), side-on to the passage, pointing ahead with
 * his right arm (toward San Jacinto, as the park tells it). Anchor: OSM
 * node/1043838592 (historic=memorial), which sits on the arch's centre in
 * the lidar to within 0.5 m. OSM maps no building here: replaces [].
 *
 * Identity, in order: the walk-through granite arch, taller than wide, with
 * rounded corners, a carved frieze band and a heavy flared cornice; the
 * single round-headed passage with its ornamented archivolt; the bronze
 * horse and rider on top, side-on to the passage, the horse prancing (near
 * fore raised and bent, head tucked on an arched neck, tail streaming), Sam
 * Houston upright in a broad hat and cloak with his right arm thrust
 * forward; the stair flights up to the arch from north and south.
 *
 * Evidence
 * - Lidar: USGS 3DEP TX_Coastal_B1_2018 (flown 2018), 0.5 m grid. The arch
 *   stands on a grassy mound whose top, and the landing under the arch, is
 *   2.0 m over the grid's lowest ground; the stair foot is ~1.0 m (z = 0
 *   here). Arch top 7.4 m (5.4 m above the landing), over a footprint
 *   ~5.3 x 3.4 m; the bronze's highest return 12.2 m (4.8 m above the arch).
 * - Published: Wikipedia "Sam Houston Monument"; Houston Arts Foundation;
 *   Hermann Park Conservancy: designed 1924, dedicated August 1925; gray
 *   granite arch about 25 x 18 x 9 ft (taken as height x width x depth, the
 *   height from the stair foot); overall 20 x 20 x 9 ft (statue).
 * - Photos (Wikimedia Commons, all evidence), credits in
 *   SCRATCH/work/hou-sam-houston-monument/photos:
 *   - "Sam Houston Monument in Hermann Park.JPG", Agsftw, CC BY-SA 3.0
 *     https://commons.wikimedia.org/wiki/File:Sam_Houston_Monument_in_Hermann_Park.JPG
 *     (from the south-west, the plaza steps; colours)
 *   - "Sam Houston Monument in Hermann Park (cropped) (1).JPG", Agsftw,
 *     CC BY-SA 3.0, the close three-quarter view from the south-west: the
 *     horse's pose, the frieze, archivolt and corner shafts
 *     https://commons.wikimedia.org/wiki/File:Sam_Houston_Monument_in_Hermann_Park_(cropped)_(1).JPG
 *   - "Hermann Park, Sam Houston monument, 2012.JPG", Another Believer,
 *     CC BY-SA 3.0, face-on from the south through the passage
 *     https://commons.wikimedia.org/wiki/File:Hermann_Park,_Sam_Houston_monument,_2012.JPG
 *   - "Sam Houston monument, Hermann Park.jpg", Another Believer, CC BY-SA 3.0
 *     https://commons.wikimedia.org/wiki/File:Sam_Houston_monument,_Hermann_Park.jpg
 *   - "Sam Houston Monument.JPG", Agsftw, CC BY-SA 3.0, from the north-east
 *     https://commons.wikimedia.org/wiki/File:Sam_Houston_Monument.JPG
 *   - "Gfp-texas-houston-horse-statue-hermann-park.jpg", Yinan Chen, public
 *     domain, face-on from the north (horse facing left = east)
 *     https://commons.wikimedia.org/wiki/File:Gfp-texas-houston-horse-statue-hermann-park.jpg
 *
 * Measured: the landing (z 1.0), arch top (z 6.6, 5.6 m over the landing:
 * between the lidar's 5.4 and the photos' height/width ratio of ~1.05-1.15,
 * which put it nearer 5.8), bronze top (z 11.25; lidar 11.2 over the stair
 * foot), the footprint. Estimated from the photos against those: the base
 * course, frieze and cornice split, the passage (1.5 m wide, crown 3.4 m
 * over the landing), the archivolt band, the stairs (5 risers, ~6 m wide,
 * cheek walls with blocks at the top), the horse and rider (heroic scale
 * 1.5, ~3.9 m nose to tail). Left out: the inscriptions (SAM / HOUSTON on
 * the side shafts), the lone star on the keystone, the plaques, the
 * frieze's rosettes (drawn as a slightly darker band).
 *
 * Follows the photos over the brief: the brief says pink Texas granite;
 * every photo, and the published record, show a cool light gray granite.
 *
 * Colours, sampled from three photos and pulled to the palette's
 * lightness: granite #c5ccce / #bec7c9 / #cdccca in sun -> #dcdfdc; the
 * frieze a shade darker; the bronze a dark warm brown-black (#41403e /
 * #4b4c4b in sun) -> #5e5848, darker than the palette but kept dark as it
 * is the landmark's silhouette.
 *
 * Ground. The terrain (Mapterhorn) shows the mound as a smooth 1.5 m dome;
 * the landing is built to its lidar height. The landing and stairs are
 * split into pieces no longer than ~3 m. Night: no night photo found, so
 * nothing is lit (doubt).
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { TAU, smooth, solid, tube, ellipsoid, face } from './nyc-columbus-monument'

/** A rounded rectangle ring (half sizes w, d, corner radius r), counter-clockwise from above. */
function rrect(cx: number, cy: number, w: number, d: number, r: number, z: number, n = 4): V3[] {
  const pts: V3[] = []
  const corners: [number, number, number][] = [[w - r, d - r, 0], [-(w - r), d - r, 1], [-(w - r), -(d - r), 2], [w - r, -(d - r), 3]]
  // Start at the east side, go counter-clockwise: NE, NW, SW, SE corners.
  for (const [x, y, k] of corners) for (let i = 0; i <= n; i++) {
    const a = (k * Math.PI) / 2 + (i * Math.PI) / 2 / n
    pts.push([cx + x + r * Math.cos(a), cy + y + r * Math.sin(a), z])
  }
  return pts
}

/** A closed box with every face split into pieces no longer than `step`. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, step = 3, bottom = false) {
  const nx = Math.max(1, Math.ceil((x1 - x0) / step)), ny = Math.max(1, Math.ceil((y1 - y0) / step))
  const c: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]
  for (let i = 0; i < nx; i++) {
    const a = x0 + ((x1 - x0) * i) / nx, b = x0 + ((x1 - x0) * (i + 1)) / nx
    for (const y of [y0, y1]) face(p, [a, y, z0], [b, y, z0], [b, y, z1], [a, y, z1], c)
    for (let j = 0; j < ny; j++) {
      const u = y0 + ((y1 - y0) * j) / ny, v = y0 + ((y1 - y0) * (j + 1)) / ny
      face(p, [a, u, z1], [b, u, z1], [b, v, z1], [a, v, z1], c)
      if (bottom) face(p, [a, u, z0], [b, u, z0], [b, v, z0], [a, v, z0], c)
    }
  }
  for (let j = 0; j < ny; j++) {
    const u = y0 + ((y1 - y0) * j) / ny, v = y0 + ((y1 - y0) * (j + 1)) / ny
    for (const x of [x0, x1]) face(p, [x, u, z0], [x, v, z0], [x, v, z1], [x, u, z1], c)
  }
}

function build() {
  const granite = new Part(), steps = new Part(), frieze = new Part(), bronze = new Part()

  // --- Landing and the two stair flights (north and south), 5 risers. ---
  const ZL = 1.0, YL = 1.9, R = 5, TREAD = 0.42, XS = 2.9
  for (let i = 1; i <= R; i++) {
    const Y = YL + (R - i) * TREAD
    box(steps, -XS, XS, -Y, Y, ((i - 1) * ZL) / R, (i * ZL) / R)
  }
  // Cheek walls beside the flights, sloping with them, a block at the top of each.
  for (const sx of [-1, 1]) {
    const x0 = sx < 0 ? -3.55 : XS, x1 = sx < 0 ? -XS : 3.55
    box(steps, x0, x1, -YL, YL, 0, ZL + 0.15)
    for (const sy of [-1, 1]) {
      const yA = sy * YL, yB = sy * (YL + R * TREAD + 0.1)
      const c: V3 = [(x0 + x1) / 2, (yA + yB) / 2, 0.3]
      const top = (y: number) => (Math.abs(y) <= YL ? ZL + 0.15 : 0.35)
      // Sloping top, two sides, end.
      face(steps, [x0, yA, top(yA)], [x1, yA, top(yA)], [x1, yB, top(yB)], [x0, yB, top(yB)], [c[0], c[1], -5])
      for (const x of [x0, x1]) face(steps, [x, yA, 0], [x, yB, 0], [x, yB, top(yB)], [x, yA, top(yA)], c)
      face(steps, [x0, yB, 0], [x1, yB, 0], [x1, yB, top(yB)], [x0, yB, top(yB)], c)
      const b0 = sy < 0 ? -2.65 : YL, b1 = sy < 0 ? -YL : 2.65
      box(steps, x0 - 0.05 * sx, x1 + 0.05 * sx, b0, b1, ZL + 0.15, 1.75)
    }
  }

  // --- The arch. ---
  const W = 2.55, D = 1.3, RC = 0.45      // body half-width, half-depth, corner radius
  const A = 0.75, ZS = 3.65               // passage half-width, springing (crown 4.4)
  const Z0 = 1.8, Z1 = 5.05               // body, above the base course
  const NA = 10                           // segments per semicircle

  // Base course: two blocks either side of the passage.
  for (const sx of [-1, 1]) {
    const x0 = sx < 0 ? -2.75 : A, x1 = sx < 0 ? -A : 2.75
    smooth(granite, q => solid(q, [rrectHalf(x0, x1, -1.5, 1.5, sx, 0.35, ZL), rrectHalf(x0, x1, -1.5, 1.5, sx, 0.35, Z0 - 0.08), rrectHalf(x0 + 0.06 * (sx < 0 ? 1 : 0), x1 - 0.06 * (sx > 0 ? 1 : 0), -1.44, 1.44, sx, 0.3, Z0)]), 40)
  }

  // Body: rounded corners, the faces y = ±D carry the passage.
  smooth(granite, q => {
    // Corner quarter-rounds and the x = ±W side faces, full height.
    const ring0 = rrect(0, 0, W, D, RC, Z0, 4), ring1 = rrect(0, 0, W, D, RC, Z1, 4)
    // The ring runs NE corner (east side start) ... ; drop the two long y-faces, which
    // are drawn with the opening below. Segments between corner groups k*5+4 -> k*5+5.
    const n = ring0.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      if (i === 4 || i === 14) continue // north face (NE->NW) and south face (SW->SE)
      q.quad(ring0[i], ring0[j], ring1[j], ring1[i])
    }
  }, 50)
  // The two arched faces and the passage, flat-shaded.
  for (const sy of [-1, 1]) {
    const y = sy * D, inside: V3 = [0, 0, (Z0 + Z1) / 2]
    const L = W - RC
    face(granite, [-L, y, Z0], [-A, y, Z0], [-A, y, Z1], [-L, y, Z1], inside)
    face(granite, [A, y, Z0], [L, y, Z0], [L, y, Z1], [A, y, Z1], inside)
    for (let k = 0; k < NA; k++) {
      const a0 = Math.PI - (k * Math.PI) / NA, a1 = Math.PI - ((k + 1) * Math.PI) / NA
      const p0: V3 = [A * Math.cos(a0), y, ZS + A * Math.sin(a0)], p1: V3 = [A * Math.cos(a1), y, ZS + A * Math.sin(a1)]
      face(granite, p0, p1, [p1[0], y, Z1], [p0[0], y, Z1], inside)
    }
  }
  // Passage: jambs and the barrel vault, facing the passage's axis.
  for (const sx of [-1, 1]) face(granite, [sx * A, -D, ZL], [sx * A, D, ZL], [sx * A, D, ZS], [sx * A, -D, ZS], [sx * (A + 1), 0, ZS / 2])
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    // Base-course faces inside the passage (the base course is 0.2 m deeper than the body).
    face(granite, [sx * A, sy * D, ZL], [sx * A, sy * 1.5, ZL], [sx * A, sy * 1.5, Z0], [sx * A, sy * D, Z0], [sx * (A + 1), sy * 1.4, 1.4])
  }
  for (let k = 0; k < NA; k++) {
    const a0 = (k * Math.PI) / NA, a1 = ((k + 1) * Math.PI) / NA, am = (a0 + a1) / 2
    const P = (a: number, y: number): V3 => [A * Math.cos(a), y, ZS + A * Math.sin(a)]
    face(granite, P(a0, -D), P(a1, -D), P(a1, D), P(a0, D), [3 * Math.cos(am), 0, ZS + 3 * Math.sin(am)])
  }
  // Archivolt: a band 0.32 m wide, 0.07 m proud, round the arch and down the jambs.
  for (const sy of [-1, 1]) {
    const y = sy * (D + 0.07), back: V3 = [0, 0, ZS]
    const B = A + 0.32
    for (const sx of [-1, 1]) {
      face(frieze, [sx * A, y, Z0], [sx * B, y, Z0], [sx * B, y, ZS], [sx * A, y, ZS], back)
      // Its outer and inner returns.
      face(frieze, [sx * B, sy * D, Z0], [sx * B, y, Z0], [sx * B, y, ZS], [sx * B, sy * D, ZS], [0, y, ZS])
    }
    for (let k = 0; k < NA; k++) {
      const a0 = (k * Math.PI) / NA, a1 = ((k + 1) * Math.PI) / NA
      const i0: V3 = [A * Math.cos(a0), y, ZS + A * Math.sin(a0)], i1: V3 = [A * Math.cos(a1), y, ZS + A * Math.sin(a1)]
      const o0: V3 = [B * Math.cos(a0), y, ZS + B * Math.sin(a0)], o1: V3 = [B * Math.cos(a1), y, ZS + B * Math.sin(a1)]
      face(frieze, i0, o0, o1, i1, [0, sy * (D - 1), ZS])
      face(frieze, [o0[0], sy * D, o0[2]], [o1[0], sy * D, o1[2]], o1, o0, [0, y, ZS])
      const am = (a0 + a1) / 2
      face(frieze, [i0[0], sy * D, i0[2]], [i1[0], sy * D, i1[2]], i1, i0, [3 * Math.cos(am), y, ZS + 3 * Math.sin(am)])
    }
    for (const sx of [-1, 1]) face(frieze, [sx * A, sy * D, Z0], [sx * A, y, Z0], [sx * A, y, ZS], [sx * A, sy * D, ZS], [sx * (A + 1), y, ZS])
    // Keystone block.
    face(frieze, [-0.2, y + sy * 0.03, ZS + A - 0.05], [0.2, y + sy * 0.03, ZS + A - 0.05], [0.24, y + sy * 0.03, ZS + B + 0.15], [-0.24, y + sy * 0.03, ZS + B + 0.15], back)
  }

  // Frieze band, cornice (flared, rounded corners), blocking course.
  smooth(frieze, q => solid(q, [rrect(0, 0, W, D, RC, Z1), rrect(0, 0, W, D, RC, 5.55)]), 50)
  smooth(granite, q => solid(q, [
    rrect(0, 0, W + 0.02, D + 0.02, RC, 5.55), rrect(0, 0, W + 0.12, D + 0.12, RC + 0.1, 5.8),
    rrect(0, 0, W + 0.3, D + 0.3, RC + 0.25, 6.05), rrect(0, 0, W + 0.32, D + 0.32, RC + 0.27, 6.25),
    rrect(0, 0, W + 0.22, D + 0.22, RC + 0.2, 6.32), rrect(0, 0, W + 0.05, D + 0.05, RC, 6.36),
    rrect(0, 0, W + 0.05, D + 0.05, RC, 6.6), rrect(0, 0, W - 0.05, D - 0.05, RC - 0.05, 6.62),
  ]), 40)

  // --- Bronze: the ground plate, horse and rider. ---
  const ZB = 6.75
  smooth(bronze, q => {
    solid(q, [rrect(0, 0, 2.15, 0.8, 0.4, 6.6), rrect(0, 0, 2.1, 0.75, 0.35, ZB)])
    // Heroic scale K; f forward (east, +x), s to the horse's left (north, +y), u up.
    const K = 1.5, hx = -0.05
    // The horse's length is drawn 1.15x (FS) its life proportion: the photos
    // show it nose-to-tail about 0.9 of the cornice's width, ~5 m.
    const FS = 1.15
    const H = (f: number, s: number, u: number): V3 => [hx + f * K * FS, s * K, ZB + u * K]
    // Barrel from rump to chest.
    tube(q, [H(-0.86, 0, 1.44), H(-0.66, 0, 1.47), H(-0.1, 0, 1.42), H(0.42, 0, 1.5), H(0.68, 0, 1.56)], [0.28 * K, 0.44 * K, 0.46 * K, 0.46 * K, 0.3 * K], 12)
    // Arched neck rising forward, the head tucked, nose down.
    tube(q, [H(0.55, 0, 1.62), H(0.76, 0, 2.15), H(0.84, 0, 2.5)], [0.33 * K, 0.23 * K, 0.17 * K], 10)
    tube(q, [H(0.84, 0, 2.54), H(1.02, 0, 2.4), H(1.14, 0, 2.12)], [0.15 * K, 0.12 * K, 0.085 * K], 8)
    // Mane crest along the neck.
    tube(q, [H(0.48, 0, 1.95), H(0.66, 0, 2.35), H(0.8, 0, 2.62)], [0.07 * K, 0.08 * K, 0.06 * K], 6)
    const leg = (pts: V3[]) => tube(q, pts, [0.15 * K, 0.095 * K, 0.08 * K], 8)
    leg([H(0.55, -0.15, 1.25), H(0.86, -0.17, 0.98), H(0.74, -0.17, 0.58)])   // near (right) fore, raised high and bent
    leg([H(0.55, 0.15, 1.25), H(0.6, 0.15, 0.62), H(0.66, 0.15, 0.0)])        // off fore, planted
    leg([H(-0.62, 0.15, 1.25), H(-0.78, 0.15, 0.62), H(-0.86, 0.15, 0.0)])    // off hind, planted, angled back
    leg([H(-0.62, -0.15, 1.25), H(-0.45, -0.15, 0.66), H(-0.6, -0.15, 0.12)]) // near hind, stepping
    // Hooves.
    for (const [f, s, u] of [[0.74, -0.17, 0.55], [0.67, 0.15, 0.02], [-0.87, 0.15, 0.02], [-0.61, -0.15, 0.1]] as V3[])
      ellipsoid(q, H(f, s, u + 0.03), [0.08 * K, 0.07 * K, 0.05 * K], 6, 3)
    // Tail streaming back.
    tube(q, [H(-0.9, 0, 1.56), H(-1.12, 0, 1.3), H(-1.28, 0, 0.98)], [0.08 * K, 0.12 * K, 0.07 * K], 8)

    // Sam Houston, upright in the saddle.
    for (const s of [-1, 1]) tube(q, [H(0.0, s * 0.18, 1.86), H(0.28, s * 0.36, 1.55), H(0.18, s * 0.36, 1.1)], [0.1 * K, 0.08 * K, 0.065 * K], 6)
    tube(q, [H(-0.02, 0, 1.84), H(0.0, 0, 2.25), H(0.02, 0, 2.55)], [0.23 * K, 0.21 * K, 0.19 * K], 8)
    ellipsoid(q, H(0.04, 0, 2.74), [0.11 * K, 0.11 * K, 0.13 * K], 8, 4)
    // Broad-brimmed hat.
    solid(q, [ellRing(H(0.05, 0, 2.83), 0.25 * K, 0.25 * K, 12), ellRing(H(0.05, 0, 2.86), 0.25 * K, 0.25 * K, 12),
      ellRing(H(0.05, 0, 2.87), 0.13 * K, 0.13 * K, 12), ellRing(H(0.05, 0, 3.0), 0.11 * K, 0.11 * K, 12)])
    // Right arm thrust forward, pointing; left hand low on the reins.
    tube(q, [H(0.02, -0.21, 2.5), H(0.36, -0.25, 2.58), H(0.72, -0.27, 2.66)], [0.08 * K, 0.07 * K, 0.055 * K], 6)
    tube(q, [H(0.02, 0.21, 2.48), H(0.18, 0.27, 2.2), H(0.42, 0.16, 2.02)], [0.075 * K, 0.065 * K, 0.05 * K], 6)
    // Cloak from the shoulders, sweeping back over the horse's quarters.
    solid(q, [ellRing(H(-0.06, 0, 2.58), 0.22 * K, 0.25 * K, 10), ellRing(H(-0.16, 0, 2.3), 0.28 * K, 0.31 * K, 10),
      ellRing(H(-0.3, 0, 1.95), 0.3 * K, 0.36 * K, 10), ellRing(H(-0.36, 0, 1.78), 0.24 * K, 0.33 * K, 10)])
  }, 55)

  finishModel('Sam Houston Monument', 'hou-sam-houston-monument', [
    { part: granite, material: { name: 'gray-granite', color: 0xdcdfdc, roughness: 0.85 } },
    { part: frieze, material: { name: 'granite-carved', color: 0xc9ccc9, roughness: 0.85 } },
    { part: steps, material: { name: 'granite-steps', color: 0xd6d7d2, roughness: 0.85 } },
    { part: bronze, material: { name: 'bronze', color: 0x5e5848, roughness: 0.5 } },
  ], { bearing: 0, osm: 'node/1043838592', height: 11.25 }, 5000)
}

/** An elliptical ring about a centre point. */
function ellRing(c: V3, rx: number, ry: number, n: number): V3[] {
  return Array.from({ length: n }, (_, i): V3 => [c[0] + rx * Math.cos((i * TAU) / n), c[1] + ry * Math.sin((i * TAU) / n), c[2]])
}

/**
 * A base-course block x0..x1, y0..y1 with its outer corners (the side away
 * from the passage, given by sx) rounded and the passage side square.
 */
function rrectHalf(x0: number, x1: number, y0: number, y1: number, sx: number, r: number, z: number): V3[] {
  const pts: V3[] = []
  const arc = (cx: number, cy: number, a0: number) => { for (let i = 0; i <= 3; i++) { const a = a0 + (i * Math.PI) / 2 / 3; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z]) } }
  if (sx > 0) {
    // passage side x0 square; outer side x1 rounded. CCW: SW, SE(round), NE(round), NW.
    pts.push([x0, y0, z]); arc(x1 - r, y0 + r, -Math.PI / 2); arc(x1 - r, y1 - r, 0); pts.push([x0, y1, z])
  } else {
    // outer side x0 rounded. CCW: SW(round), SE, NE, NW(round).
    arc(x0 + r, y0 + r, Math.PI); pts.push([x1, y0, z]); pts.push([x1, y1, z]); arc(x0 + r, y1 - r, Math.PI / 2)
  }
  return pts
}

if (import.meta.main) build()
