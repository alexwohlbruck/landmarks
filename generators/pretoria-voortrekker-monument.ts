/**
 * Voortrekker Monument (Gerard Moerdijk, 1937-1949), Monument Hill,
 * Pretoria: original procedural geometry, CC0-1.0, no textures.
 *   bun generators/pretoria-voortrekker-monument.ts
 * Writes models/pretoria-voortrekker-monument.glb (low) and
 * models/pretoria-voortrekker-monument.detail.glb (detail: the chevron
 * corbels of the crown, the wagon wheels on both faces of the laager with
 * spokes, rounder statues).
 *
 * Map frame: x east, y north, z up, metres; origin on the lowest ground
 * under the footprint. Anchor = area centroid of the OSM outline way/
 * 239878491 (building, historic=monument; the 39.5 m square podium with
 * the entrance terrace to the north), lng 28.1757962, lat -25.7763668.
 * Bearing 0: the outline's sides run at 0.1-0.3 deg.
 *
 * Identity, in order: the massive square granite block with its corner
 * piers and the great round-arched lattice window on each face; the crown
 * that steps in over concave shoulders, with its row of tall slots and the
 * chevron corbels between them; the stepped podium with a statue of a
 * Voortrekker leader at each outer corner of the block; the ring of the
 * ox-wagon laager wall round the hilltop with its gate to the north.
 *
 * Evidence
 *  - Plan: OSM way/239878491 (podium, 39.5 x 39.3 m, north entrance bump
 *    x -13.6..15.3); parts way/1432854383 (25.3 x 26.4 m, no height) and
 *    way/1432854382 (15.5 x 16 m, height 40). The gate blocks: ways 1432854367
 *    and 1432854368 (5 m square). The laager: OSM way/
 *    528467678 (barrier=wall, "Wagon laager"), an open ring 97 x 116 m
 *    with its gap (the gate) to the north; used node for node.
 *  - Published: "40 m high, with a base of 40 m by 40 m" (Voortrekker
 *    Monument, vtm.org.za; OSM height=40 on the crown part). Wikipedia now
 *    says 62 m; not used (it would need a 22 m foundation above ground,
 *    which no photo shows). 64 ox-wagons in the laager; a statue at each
 *    outside corner (Retief, Pretorius, Potgieter, the unknown leader),
 *    about 6 tons each (Wikipedia "Voortrekker Monument").
 *  - Proportions from the photos, in particular the telephoto night view
 *    v5 and v2: podium 6 m, block 6-31 m, crown (shoulders and slotted
 *    stage) 31-40 m, crown : block height 0.36 (v2 0.32, v5 0.44); block
 *    width : block-and-crown height about 0.9, which gives a 31 m block
 *    (wider than the OSM part's 25-26 m: v2, v4 and v5 agree on the
 *    ratio; the OSM part is unsourced). Crown 0.72 of the block (v4),
 *    22.4 m. Corner piers 0.23 of a face (v4). Arched window 13.6 m wide,
 *    15.5 m tall to its crown, about two thirds of the block (v2, v4). Nine slots a side in
 *    the crown (v4, v1). Laager wall 2.6 m, gate blocks 4.5 m: estimated
 *    from v2 (the wheels are about 1.5 m across).
 *  - Terrain: the monument stands on a hilltop. Mapterhorn has nothing
 *    finer than z12 here (z13-z15 404); the hill falls 7 m from the podium
 *    to the south of the laager and 5-9 m to its other sides. The model
 *    follows that ground: every wall segment of the laager stands with its
 *    foot on the drawn terrain (the z12 grid is embedded below, read with
 *    `bun tools/terrain.ts grid 28.1757962 -25.7763668 90 10 --zoom 12`),
 *    and the podium's base is set level at the lowest ground under it.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - v1 Ymblanter, "Pretoria Voortrekker Monument seen from the
 *      northeast.jpg", CC BY-SA 4.0 — block, piers, windows, crown.
 *      https://commons.wikimedia.org/wiki/File:Pretoria_Voortrekker_Monument_seen_from_the_northeast.jpg
 *    - v2 Ymblanter, "Pretoria Voortrekker Monument seen from the bottom of
 *      the stairs.jpg", CC BY-SA 4.0 — from the north: the laager wall and
 *      its gate blocks with wheels, the stair, the block.
 *      https://commons.wikimedia.org/wiki/File:Pretoria_Voortrekker_Monument_seen_from_the_bottom_of_the_stairs.jpg
 *    - v4 Leon Pelser, "Voortrekker Monument 922580097.jpg", CC BY-SA 3.0
 *      — north-east corner from the podium: podium tiers, corner statue,
 *      colour (HDR-boosted; colour taken from v1 and v6 instead).
 *      https://commons.wikimedia.org/wiki/File:Voortrekker_Monument_922580097.jpg
 *    - v5 CivArmy, "The Voortrekker Monument, Pretoria, South Africa.jpg",
 *      CC BY-SA 4.0 — the north face from the stair: entrance, bronze
 *      group, crown slots, shoulders.
 *      https://commons.wikimedia.org/wiki/File:The_Voortrekker_Monument,_Pretoria,_South_Africa.jpg
 *    - v6 JRamatsui, "Voortrekker Monument, Pretoria, South Africa.jpg",
 *      CC BY-SA 3.0 — night, floodlit, from the north-west.
 *      https://commons.wikimedia.org/wiki/File:Voortrekker_Monument,_Pretoria,_South_Africa.jpg
 *    - v9 Ymblanter, "Pretoria Voortrekker Monument seen from Skool op
 *      Wiele.jpg", CC BY-SA 4.0 — from the south-east, low.
 *      https://commons.wikimedia.org/wiki/File:Pretoria_Voortrekker_Monument_seen_from_Skool_op_Wiele.jpg
 *  No look-only sources. No commercial imagery. No lidar exists here.
 *
 * Invented or simplified: the lattice of the arched windows is drawn as a
 * dark recessed panel with five bold mullions; the corner piers' small
 * windows as a column of dark squares; the reliefs on the podium are left
 * out; the statues are bold simplified figures (long coat, hat) at their
 * real size, about 4.5 m on a 1.2 m pedestal; the bronze mother-and-
 * children group at the entrance a single bronze mass; the laager wagons
 * are a continuous wall with a wheel in relief per wagon (two a side in
 * the detail model); the great stair from the gate is the map's ground.
 * Colours (sampled, after review: the first pass was too light and
 * pink): granite #938a7e, from the sunlit east face in v1 (#978c7f) and
 * the overcast south-east face in v9 (#766e64), a grey-brown; statues,
 * bands and the laager a little lighter, #a69d91 (v2, shaded #4b4c50 to
 * #626266, so the laager is the same grey granite); lattice and slots
 * #5c564f. v4 is HDR-boosted orange and is not used for colour. Night: the block, crown and podium are
 * floodlit (v6). v6 also shows green light on the crown's parapet; not
 * drawn (its permanence unknown).
 * Doubts: the block's true width (31 m drawn, OSM 25-26 m); the 40 m vs
 * 62 m height; the laager's height; the coarse z12 terrain under the ring.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cap, lathe, rect, walls, type XY } from './chi-aon-center'
import { face } from './phl-independence-hall'
import { box, cyl, faceOf, farch, fband, fpanel, onFace, writeModel, type Slot } from './pretoria-union-buildings'

const ID = 'pretoria-voortrekker-monument'
const NAME = 'Voortrekker Monument'
const ANCHOR: [number, number] = [28.1757962, -25.7763668]

// Mapterhorn z12, 10 m grid in this frame, metres above its lowest reading.
const TG = [
  [13.3, 14.5, 15.6, 16.8, 17.2, 17.5, 17.8, 17.9, 17.9, 17.9, 18.0, 18.2, 18.4, 18.1, 17.6, 17.0, 16.2, 15.3, 14.4], // y 90
  [14.5, 15.8, 17.1, 18.2, 18.8, 19.2, 19.3, 19.4, 19.4, 19.5, 19.7, 19.8, 19.8, 19.3, 18.8, 18.2, 17.2, 16.2, 15.3],
  [15.7, 17.2, 18.4, 19.6, 20.3, 20.8, 20.8, 20.9, 20.9, 21.0, 21.3, 21.3, 21.1, 20.5, 19.9, 19.4, 18.3, 17.2, 16.2],
  [16.9, 18.3, 19.6, 20.8, 21.4, 22.0, 22.2, 22.3, 22.3, 22.4, 22.4, 22.4, 22.3, 21.7, 21.1, 20.5, 19.5, 18.3, 17.2],
  [18.1, 19.5, 20.7, 21.8, 22.4, 23.0, 23.2, 23.5, 23.6, 23.6, 23.6, 23.6, 23.4, 22.9, 22.3, 21.7, 20.6, 19.5, 18.2],
  [19.2, 20.7, 21.8, 22.7, 23.3, 23.8, 24.1, 24.4, 24.7, 24.8, 24.8, 24.8, 24.6, 24.0, 23.5, 22.9, 21.8, 20.6, 19.2],
  [20.1, 21.4, 22.4, 23.3, 23.9, 24.4, 24.7, 25.0, 25.3, 25.4, 25.4, 25.4, 25.2, 24.7, 24.1, 23.5, 22.3, 21.0, 19.5],
  [20.8, 22.0, 23.0, 23.9, 24.5, 25.0, 25.3, 25.6, 25.9, 26.0, 25.9, 25.9, 25.7, 25.1, 24.5, 23.8, 22.6, 21.1, 19.7],
  [21.1, 22.5, 23.6, 24.4, 25.1, 25.6, 25.9, 26.2, 26.5, 26.4, 26.2, 26.0, 25.7, 25.1, 24.3, 23.3, 22.1, 20.8, 19.4],
  [21.3, 22.6, 23.7, 24.6, 25.2, 25.7, 26.0, 26.3, 26.5, 26.3, 26.0, 25.8, 25.4, 24.7, 23.7, 22.5, 21.3, 20.1, 18.6], // y 0
  [21.2, 22.4, 23.4, 24.3, 24.9, 25.4, 25.7, 25.9, 25.9, 25.8, 25.5, 25.2, 24.7, 23.9, 22.7, 21.3, 20.1, 18.9, 17.5],
  [20.5, 21.7, 22.6, 23.5, 24.0, 24.4, 24.7, 24.8, 24.7, 24.5, 24.2, 23.7, 23.2, 22.3, 21.2, 19.9, 18.6, 17.3, 15.8],
  [19.5, 20.7, 21.7, 22.5, 22.9, 23.2, 23.5, 23.5, 23.2, 22.9, 22.6, 22.0, 21.4, 20.5, 19.5, 18.3, 16.9, 15.4, 14.0],
  [17.5, 18.6, 19.6, 20.5, 20.8, 21.1, 21.4, 21.5, 21.2, 20.8, 20.3, 19.5, 18.7, 17.9, 16.8, 15.7, 14.3, 12.8, 11.6],
  [15.3, 16.4, 17.3, 18.2, 18.6, 19.0, 19.3, 19.3, 19.0, 18.5, 17.8, 17.0, 16.1, 15.1, 14.1, 12.9, 11.6, 10.2, 9.0],
  [12.9, 13.8, 14.7, 15.6, 16.1, 16.6, 16.9, 17.0, 16.7, 16.0, 15.2, 14.3, 13.4, 12.3, 11.1, 10.0, 8.8, 7.6, 6.4],
  [10.7, 11.4, 12.2, 13.0, 13.6, 14.1, 14.3, 14.2, 13.9, 13.3, 12.6, 11.7, 10.8, 9.7, 8.6, 7.5, 6.3, 5.1, 4.1],
  [8.6, 9.2, 9.8, 10.3, 10.9, 11.4, 11.4, 11.3, 11.0, 10.5, 9.9, 9.1, 8.2, 7.3, 6.3, 5.1, 4.0, 2.8, 1.9],
  [6.8, 7.4, 7.9, 8.3, 8.7, 9.0, 8.9, 8.7, 8.6, 8.2, 7.6, 6.9, 6.1, 5.3, 4.2, 3.1, 2.0, 1.0, 0.0], // y -90
]
const T = (x: number, y: number) => {
  const c = Math.max(0, Math.min(17.999, (x + 90) / 10)), r = Math.max(0, Math.min(17.999, (90 - y) / 10))
  const c0 = Math.floor(c), r0 = Math.floor(r), fc = c - c0, fr = r - r0
  return (TG[r0][c0] * (1 - fc) + TG[r0][c0 + 1] * fc) * (1 - fr) + (TG[r0 + 1][c0] * (1 - fc) + TG[r0 + 1][c0 + 1] * fc) * fr
}

// The laager (OSM way/528467678), in this frame, gate gap to the north.
const LAAGER: XY[] = [[-12.59, 70.16], [-19.9, 66.81], [-23.31, 64.6], [-26.56, 62.18], [-33.49, 55.2], [-36.3, 51.63], [-38.7, 47.85], [-41.22, 43.22], [-43.41, 38.36], [-45.89, 30.49], [-46.94, 25.36], [-47.61, 20.34], [-47.95, 15.08], [-47.92, 9.85], [-47.51, 4.17], [-46.7, -1.36], [-45.48, -6.53], [-43.88, -11.71], [-40.09, -19.91], [-35.03, -27.43], [-30.16, -33.01], [-24.62, -37.45], [-18.9, -40.85], [-14.99, -42.67], [-10.88, -44.1], [-5.53, -45.21], [-0.14, -45.84], [4.56, -45.61], [9.17, -44.67], [13.64, -43.4], [18.09, -41.69], [25.62, -37.02], [33.76, -29.33], [39.95, -20.79], [44.45, -11.18], [46.21, -6.38], [47.61, -0.63], [48.81, 10.47], [48.95, 22.07], [46.86, 29.96], [45.18, 35.47], [43.33, 40.88], [37.39, 52.32], [30.39, 60.2], [27.59, 62.67], [24.69, 64.89], [21.04, 67.19], [17.29, 68.88], [16.21, 69.26], [14.43, 69.89]]

/** Resample a polyline into n + 1 points evenly spaced along it. */
function resample(path: XY[], n: number): XY[] {
  const d = [0]
  for (let i = 1; i < path.length; i++) d.push(d[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]))
  const out: XY[] = []
  for (let k = 0, j = 0; k <= n; k++) {
    const s = (d[d.length - 1] * k) / n
    while (j < d.length - 2 && d[j + 1] < s) j++
    const t = (s - d[j]) / (d[j + 1] - d[j] || 1)
    out.push([path[j][0] + (path[j + 1][0] - path[j][0]) * t, path[j][1] + (path[j + 1][1] - path[j][1]) * t])
  }
  return out
}

const LOW = Math.min(...resample(LAAGER, 200).map(([x, y]) => T(x, y)))
/** Ground in the model frame: the laager's feet are sunk 1 m into it, and the
 * lowest of them is y = 0, so the lowest ground is at y = 1. */
const G = (x: number, y: number) => T(x, y) - LOW + 1.0

/**
 * A standing figure in a long coat with a broad-brimmed hat, facing `dir`
 * (radians, map frame), feet at z0, `h` tall. Simplified but in its real
 * proportions: coat to the shins, shoulders, head, hat brim.
 */
export function figure(p: Part, x: number, y: number, z0: number, h: number, dir: number, seg: number, hat = true) {
  const s = h / 4.5
  lathe(p, x, y, [[0.55 * s, z0], [0.62 * s, z0 + 0.9 * s], [0.5 * s, z0 + 2.4 * s], [0.62 * s, z0 + 3.2 * s], [0.5 * s, z0 + 3.45 * s], [0.18 * s, z0 + 3.55 * s], [0, z0 + 3.56 * s]], seg, dir)
  // head
  lathe(p, x, y, [[0.0001, z0 + 3.5 * s], [0.26 * s, z0 + 3.65 * s], [0.3 * s, z0 + 3.9 * s], [0.24 * s, z0 + 4.12 * s], [0, z0 + 4.2 * s]], seg, dir)
  if (hat) lathe(p, x, y, [[0.0001, z0 + 4.05 * s], [0.6 * s, z0 + 4.05 * s], [0.6 * s, z0 + 4.12 * s], [0.3 * s, z0 + 4.15 * s], [0.27 * s, z0 + 4.45 * s], [0, z0 + 4.5 * s]], seg, dir)
  // arms as two slabs down the sides, one bent forward (holding a hat or rifle)
  const c = Math.cos(dir), sn = Math.sin(dir)
  const at = (u: number, v: number, z: number): V3 => [x + u * c - v * sn, y + u * sn + v * c, z]
  for (const side of [-1, 1]) {
    const v = side * 0.62 * s
    const a = at(0.05 * s, v, z0 + 3.25 * s), b = at(side > 0 ? 0.45 * s : 0.08 * s, v * 1.05, z0 + 1.9 * s)
    const w = 0.16 * s
    const q = (P: V3, du: number, dv: number, dz: number): V3 => [P[0] + du * c - dv * sn, P[1] + du * sn + dv * c, P[2] + dz]
    face(p, [q(a, w, 0, 0), q(b, w, 0, 0), q(b, -w, 0, 0), q(a, -w, 0, 0)], [-sn * side, c * side, 0])
    face(p, [q(a, w, 0, 0), q(a, w, side * 0.3 * s, 0), q(b, w, side * 0.3 * s, 0), q(b, w, 0, 0)], [c, sn, 0])
    face(p, [q(a, -w, side * 0.3 * s, 0), q(a, -w, 0, 0), q(b, -w, 0, 0), q(b, -w, side * 0.3 * s, 0)], [-c, -sn, 0])
    face(p, [q(a, w, side * 0.3 * s, 0), q(a, -w, side * 0.3 * s, 0), q(b, -w, side * 0.3 * s, 0), q(b, w, side * 0.3 * s, 0)], [-sn * side, c * side, 0])
  }
}

function build(detail: boolean) {
  const granite = new Part(), pale = new Part(), dark = new Part(), roof = new Part(), bronze = new Part()
  const SEG = detail ? 14 : 8

  // --- Podium: base level at the lowest ground under it; two tiers.
  const PH = 19.75 // podium half-size (OSM 39.5 m)
  let gmin = Infinity, gmax = -Infinity
  for (let i = 0; i <= 8; i++) for (let j = 0; j <= 8; j++) { const g = G(-PH + (i * 2 * PH) / 8, -PH + (j * 2 * PH) / 8); gmin = Math.min(gmin, g); gmax = Math.max(gmax, g) }
  const Z0 = gmax - 0.3 // ground at the podium: the hilltop (the base walls run down to gmin)
  const Z1 = Z0 + 3.2, Z2 = Z0 + 6.0 // tier tops
  const B = 15.5 // block half-size (31 m)
  const ZB = Z2 + 25 // top of the block
  const ZC = Z0 + 40 // top of the crown
  const C = 11.2 // crown half-size (22.4 m)

  // lower tier: the OSM outline with its north bump
  const tier1: XY[] = [[-PH, -PH], [PH, -PH], [PH, PH - 1.2], [15.3, PH - 1.2], [15.3, PH + 1.8], [-13.6, PH + 1.8], [-13.6, PH - 1.2], [-PH, PH - 1.2]]
  walls(granite, tier1, gmin - 1.2, Z1 - 0.5)
  const t1b: XY[] = tier1.map(([x, y]) => [x - Math.sign(x) * 0.5 * (Math.abs(x) > 13 ? 1 : 0), y - Math.sign(y) * 0.5] as XY)
  walls(pale, tier1, Z1 - 0.5, Z1, t1b) // coping
  cap(pale, t1b, Z1)
  // upper tier
  const U = 17.2
  walls(granite, rect(-U, -U, U, U), Z1, Z2 - 0.4)
  walls(pale, rect(-U, -U, U, U), Z2 - 0.4, Z2, rect(-U + 0.4, -U + 0.4, U - 0.4, U - 0.4))
  cap(pale, rect(-U + 0.4, -U + 0.4, U - 0.4, U - 0.4), Z2)
  // the entrance on the north face of the podium, with the bronze group before it
  {
    const f = faceOf([U, U], [-U, U]) // north face, outward +y
    fpanel(dark, f, U, 1.6, Z1, Z1 + 4.4, 0.06)
    fband(pale, f, U - 2.4, U + 2.4, Z1 + 4.4, Z1 + 5.2, 0.4)
    for (const s of [U - 9, U - 5, U + 5, U + 9]) fpanel(pale, f, s, 1.7, Z1 + 1.0, Z1 + 3.6, 0.08) // relief panels
    figure(bronze, -0.6, U + 1.6, Z1, 3.0, Math.PI / 2, detail ? 10 : 6, false)
    figure(bronze, 0.6, U + 1.4, Z1, 1.9, Math.PI / 2, detail ? 8 : 5, false)
    // steps up from the stair landing to the lower tier
    const gs = Math.min(Z0, G(0, PH + 4)) - 1.4
    for (let k = 0; k < 4; k++) box(pale, -6, PH + 1.8 + k * 0.6, 6, PH + 2.4 + k * 0.6, gs, Z1 - (k + 1) * 0.6 * (Z1 - Z0) / 2.4, true)
  }

  // --- The block: corner piers proud of the central bays.
  const PW = 7.0, PD = 0.7
  walls(granite, rect(-B + PD, -B + PD, B - PD, B - PD), Z2, ZB)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x0 = sx < 0 ? -B : B - PW, y0 = sy < 0 ? -B : B - PW
    walls(granite, rect(x0, y0, x0 + PW, y0 + PW), Z2, ZB)
    // a column of small square windows on each outer face of the pier
    for (const f of [faceOf(sy < 0 ? [x0, y0] : [x0 + PW, y0 + PW], sy < 0 ? [x0 + PW, y0] : [x0, y0 + PW]), faceOf(sx < 0 ? [x0, y0 + PW] : [x0 + PW, y0], sx < 0 ? [x0, y0] : [x0 + PW, y0 + PW])]) {
      for (let k = 0; k < (detail ? 6 : 4); k++) {
        const z = Z2 + 4 + k * (detail ? 3.0 : 4.4)
        fpanel(dark, f, PW / 2, 0.32, z, z + 0.7, 0.05)
      }
    }
  }
  // the band below the top of the block (the zigzag frieze), proud all round
  const ring: XY[] = rect(-B, -B, B, B)
  for (let k = 0; k < 4; k++) fband(pale, faceOf(ring[k], ring[(k + 1) % 4]), -0.2, 2 * B + 0.2, ZB - 2.8, ZB - 2.0, 0.25)
  // each face: the great arched window in a moulded arch, recessed
  for (let k = 0; k < 4; k++) {
    const r = rect(-B + PD, -B + PD, B - PD, B - PD), f = faceOf(r[k], r[(k + 1) % 4]), L = 2 * (B - PD)
    const hw = 6.8, sill = Z2 + 2.2, spring = sill + 15.5 - hw
    farch(dark, f, L / 2, hw, sill, spring, detail ? 14 : 10, 0.05)
    // five mullions
    for (let m = -2; m <= 2; m++) {
      const s = L / 2 + m * (2 * hw / 5.6)
      const top = spring + Math.sqrt(Math.max(0, hw * hw - (m * 2 * hw / 5.6) ** 2)) - 0.3
      fband(granite, f, s - 0.3, s + 0.3, sill, top, 0.12)
    }
    // the arch moulding: a band following the semicircle, and the sill
    const seg = detail ? 14 : 10, R0 = hw + 0.2, R1 = hw + 1.3
    for (let q = 0; q < seg; q++) {
      const t0 = (q / seg) * Math.PI, t1 = ((q + 1) / seg) * Math.PI
      const P = (t: number, R: number, o: number) => onFace(f, L / 2 + R * Math.cos(t), spring + R * Math.sin(t), o)
      face(pale, [P(t0, R0, 0.25), P(t0, R1, 0.25), P(t1, R1, 0.25), P(t1, R0, 0.25)], [f.n[0], f.n[1], 0])
      face(pale, [P(t0, R1, 0), P(t1, R1, 0), P(t1, R1, 0.25), P(t0, R1, 0.25)], [f.n[0] * 0 + Math.cos((t0 + t1) / 2) * f.u[0], Math.cos((t0 + t1) / 2) * f.u[1], Math.sin((t0 + t1) / 2)])
    }
    fband(pale, f, L / 2 - R1, L / 2 - R0, sill - 0.6, spring, 0.25)
    fband(pale, f, L / 2 + R0, L / 2 + R1, sill - 0.6, spring, 0.25)
    fband(pale, f, L / 2 - R1 - 0.3, L / 2 + R1 + 0.3, sill - 0.9, sill, 0.35)
  }
  // top of the block: a flat roof round the crown
  cap(pale, rect(-B, -B, B, B), ZB)

  // --- The crown: concave shoulders from the block's edge in to the crown,
  // then the crown's walls with nine tall slots a side, the corbels
  // between them, and a plain parapet.
  const ZS = ZB + 2.4
  const sh: [number, number][] = [] // (half, z) profile, concave
  for (let k = 0; k <= 4; k++) { const t = k / 4; sh.push([B - 0.4 - (B - 0.4 - C) * Math.sin(t * Math.PI / 2), ZB + (ZS - ZB) * (1 - Math.cos(t * Math.PI / 2))]) }
  for (let k = 0; k < sh.length - 1; k++) walls(granite, rect(-sh[k][0], -sh[k][0], sh[k][0], sh[k][0]), sh[k][1], sh[k + 1][1], rect(-sh[k + 1][0], -sh[k + 1][0], sh[k + 1][0], sh[k + 1][0]))
  walls(granite, rect(-C, -C, C, C), ZS, ZC - 0.6)
  walls(pale, rect(-C, -C, C, C), ZC - 0.6, ZC, rect(-C + 0.4, -C + 0.4, C - 0.4, C - 0.4))
  cap(granite, rect(-C + 0.4, -C + 0.4, C - 0.4, C - 0.4), ZC)
  const cr = rect(-C, -C, C, C)
  for (let k = 0; k < 4; k++) {
    const f = faceOf(cr[k], cr[(k + 1) % 4])
    for (let i = 0; i < 9; i++) {
      const s = 2 * C * (i + 0.5) / 9
      fpanel(dark, f, s, 0.5, ZS + 1.6, ZC - 2.2, 0.05)
      // the chevron corbel under each slot: a V standing proud
      const n: V3 = [f.n[0], f.n[1], 0]
      if (detail || i % 1 === 0) {
        const a = onFace(f, s - 0.9, ZS + 1.4, 0.3), b = onFace(f, s + 0.9, ZS + 1.4, 0.3), c = onFace(f, s, ZS - 1.2, 0.3)
        face(pale, [a, c, b], n)
        if (detail) {
          const a0 = onFace(f, s - 0.9, ZS + 1.4, 0), b0 = onFace(f, s + 0.9, ZS + 1.4, 0), c0 = onFace(f, s, ZS - 1.2, -0.6)
          face(pale, [a, a0, b0, b], [0, 0, 1])
          face(pale, [a0, a, c, c0], [-f.u[0] - n[0] * 0.3, -f.u[1] - n[1] * 0.3, -0.5])
          face(pale, [b, b0, c0, c], [f.u[0] - n[0] * 0.3, f.u[1] - n[1] * 0.3, -0.5])
        }
      }
    }
  }

  // --- The corner statues, on pedestals at the block's outer corners, facing out diagonally.
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x = sx * (B + 1.6), y = sy * (B + 1.6)
    box(pale, x - 0.9, y - 0.9, x + 0.9, y + 0.9, Z2, Z2 + 1.2)
    figure(pale, x, y, Z2 + 1.2, 4.5, Math.atan2(sy, sx), SEG)
  }

  // --- The laager: 64 wagons in a ring, a wall following the hill, a wheel
  // in relief on each wagon, and the gate blocks at the two ends.
  {
    const NW = 64, pts = resample(LAAGER, NW), TH = 0.45, H = 2.6, SINK = 1.0 // feet sunk 1 m: the drawn terrain varies between grid points
    const off = (p: XY, q: XY, d: number): [XY, XY] => {
      const L = Math.hypot(q[0] - p[0], q[1] - p[1]), n: XY = [(q[1] - p[1]) / L, -(q[0] - p[0]) / L]
      return [[p[0] + n[0] * d, p[1] + n[1] * d], [q[0] + n[0] * d, q[1] + n[1] * d]]
    }
    for (let i = 0; i < NW; i++) {
      const p = pts[i], q = pts[i + 1]
      const gp = G(p[0], p[1]), gq = G(q[0], q[1])
      // the ring runs clockwise from the gate's west end: +normal points out
      const [po, qo] = off(p, q, TH), [pi, qi] = off(p, q, -TH)
      const V = (a: XY, z: number): V3 => [a[0], a[1], z]
      const nOut: V3 = [(q[1] - p[1]), -(q[0] - p[0]), 0]
      face(pale, [V(po, gp - SINK), V(qo, gq - SINK), V(qo, gq + H), V(po, gp + H)], nOut)
      face(pale, [V(pi, gp - SINK), V(qi, gq - SINK), V(qi, gq + H), V(pi, gp + H)], [-nOut[0], -nOut[1], 0])
      face(pale, [V(po, gp + H), V(qo, gq + H), V(qi, gq + H), V(pi, gp + H)], [0, 0, 1])
      // the wagon's wheel(s) in relief, on the outside (and inside in the detail)
      const sides = detail ? [TH, -TH] : [TH]
      for (const d of sides) {
        const [a, b] = off(p, q, d)
        const f = faceOf(d > 0 ? a : b, d > 0 ? b : a)
        const L = Math.hypot(b[0] - a[0], b[1] - a[1])
        for (const u of detail ? [0.28, 0.72] : [0.5]) {
          const s = L * u, zg = gp + (gq - gp) * (d > 0 ? u : 1 - u)
          const seg = detail ? 12 : 8, r = 0.72, zc = zg + 0.95
          const C0 = onFace(f, s, zc, 0.12)
          for (let k = 0; k < seg; k++) {
            const t0 = (k / seg) * 2 * Math.PI, t1 = ((k + 1) / seg) * 2 * Math.PI
            face(dark, [C0, onFace(f, s + r * Math.cos(t0), zc + r * Math.sin(t0), 0.12), onFace(f, s + r * Math.cos(t1), zc + r * Math.sin(t1), 0.12)], [f.n[0], f.n[1], 0])
          }
          if (detail) for (let k = 0; k < 4; k++) {
            const t = (k * Math.PI) / 4, w = 0.07
            const A = onFace(f, s - r * Math.cos(t), zc - r * Math.sin(t), 0.15), Bq = onFace(f, s + r * Math.cos(t), zc + r * Math.sin(t), 0.15)
            const dx = -Math.sin(t) * w, dz = Math.cos(t) * w
            face(pale, [[A[0] + f.u[0] * dx, A[1] + f.u[1] * dx, A[2] + dz], [Bq[0] + f.u[0] * dx, Bq[1] + f.u[1] * dx, Bq[2] + dz], [Bq[0] - f.u[0] * dx, Bq[1] - f.u[1] * dx, Bq[2] - dz], [A[0] - f.u[0] * dx, A[1] - f.u[1] * dx, A[2] - dz]], [f.n[0], f.n[1], 0])
          }
        }
      }
    }
    // the gate blocks at both ends of the ring: OSM way/1432854367 and
    // way/1432854368 (mapped as the toilets they house), 5 x 5 m, 4.3 m
    // tall with a capping (v2).
    for (const [x0, x1] of [[-12.6, -7.7], [9.5, 14.5]]) {
      const y0 = 69.4, y1 = 74.4, g = Math.min(G(x0, y0), G(x1, y0), G(x0, y1), G(x1, y1)) - 1.0
      const gate = rect(x0, y0, x1, y1), top = Math.max(G(x0, y0), G(x1, y1)) + 4.3
      walls(pale, gate, g, top)
      cap(pale, gate, top)
      const ins = rect(x0 + 0.4, y0 + 0.4, x1 - 0.4, y1 - 0.4)
      walls(granite, ins, top, top + 0.6)
      cap(granite, ins, top + 0.6)
      for (const f of [faceOf([x1, y1], [x0, y1]), faceOf([x0, y0], [x1, y0])]) farch(dark, f, 2.5, 0.75, top - 2.6, top - 2.6, detail ? 12 : 8, 0.06) // wheel disc
    }
  }

  const flood = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.9)
  return [
    { part: granite, material: { ...finish('vtm-granite', 0x938a7e), floodlight: flood } },
    { part: pale, material: { ...finish('vtm-granite-pale', 0xa69d91), floodlight: (p: V3, n: V3) => (Math.hypot(p[0], p[1]) > 30 ? 0 : flood(p, n)) } },
    { part: dark, material: finish('vtm-lattice', 0x5c564f) },
    { part: roof, material: PALETTE.roof },
    { part: bronze, material: finish('vtm-bronze', 0x6f7a62) },
  ] as Slot[]
}

if (import.meta.main) {
  const extras = { anchor: ANCHOR, bearing: 0 }
  await writeModel(`${ID}.glb`, NAME, build(false), extras, 6500, 250_000)
  await writeModel(`${ID}.detail.glb`, NAME, build(true), extras, 40_000, 1_536_000)
}
