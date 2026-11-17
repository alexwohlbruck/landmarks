/**
 * Hagia Sophia (Ayasofya), Istanbul (532–537, Anthemius of Tralles and
 * Isidore of Miletus; dome rebuilt 558–562; Ottoman minarets and buttresses
 * 15th–16th c.; Fossati restoration 1847–49) — original procedural geometry,
 * CC0-1.0.
 * bun generators/istanbul-hagia-sophia.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 33.2: the model's +x is the church's liturgical
 * east (the apse, compass 123.2°), its +y the north side. 33.2 squares the
 * long walls of OSM's aisle block (way/776020497) to within 0.1°. Anchor =
 * the centroid of the OSM outline way/109862851, 28.979973, 41.008537.
 * The geometry is drawn about the dome's centre and shifted by (6.05, 2.61)
 * to that anchor.
 *
 * Identity (from the photos below):
 *  1. The great shallow lead dome on its drum ring of 40 windows and 40
 *     small buttresses, a gilt finial on top.        (roman, galata1, mars2013)
 *  2. The square dome base: tympanum walls north and south with one huge
 *     recessed arch full of windows, glowing red-orange, between four pier
 *     towers with rounded tops.                       (roman, mars2013, tombs)
 *  3. The two big semi-domes east and west on window rings, each with two
 *     smaller exedra semi-domes; the apse semi-dome at the east end. (aerial1/2)
 *  4. The massive buttress towers north and south, rising above the gallery
 *     roofs with barrel caps, and the sloping stone buttresses. (galata1, y2017)
 *  5. Four different minarets: two identical thick Sinan minarets at the
 *     west corners (square base, tapered "pabuç", two balconies), the
 *     red-brick one at the SE on a stone pedestal, the slender white one at
 *     the NE (one balcony each).      (minarets, mars01, mars2013, sultanahmed)
 *  6. Pink-ochre plaster walls, lead-grey domes, pale stone minarets and
 *     lower buttresses.
 *
 * Plan: OSM (© OpenStreetMap contributors, ODbL) way/109862851 and its 52
 * building:parts, turned to bearing 33.2 and read in the dome-centred frame
 * (u east, v north): aisle/gallery block 776020497 (u −38.6…38.5, v ±37.5,
 * h 25); nave block 776020492 (v ±22.4, h 31); dome square 776020498
 * (u −20.3…19.6, v ±22.4, h 41); the N–S buttress walls 776020495/496
 * (u ±11.4…18.6, h 36); drum 305585921 and dome 776067032 (Ø 33, h 56);
 * semi-domes 776067030/031 (h 39, min 23); exedrae 776067024/025,
 * 776086648/649 (r 6.2, h 30); apse 776067023/776086647 (h 31); inner
 * narthex 776067034 (h 25, skillion) and exonarthex 776067033 (h 9); six
 * west buttresses 776020484–487, 776067028/029 (h 12); west turrets
 * 776067026/027; minaret bases and shafts 776020481–483, 776211441,
 * 776020488–491 (h 72), balconies 227758675, 335371711/713/715 (h 50–52);
 * outer buttresses and annexes 776086635–646 (no heights); the baptistery
 * (tomb of Mustafa I) 776086636. Symmetric about the axis v = 0 where the
 * building is (OSM's halves differ by under 0.5 m).
 *
 * Heights. Published: dome crown 55.6 m above the floor, dome Ø 31–32.6 m
 * inside, 40 drum windows, length 82 m, width 73 m (Wikipedia "Hagia
 * Sophia", en and tr). Western minarets published at 60 m (hagiasophia.com
 * via en.wikipedia) but OSM tags 72 m and two distant level photos
 * (galata1, sultanahmed, scaled from the minaret spacing and the dome rise)
 * put the cap tips 13–14 m above the dome crown, about 68–70 m: western
 * caps 59.2→69.6 m plus a 2.5 m alem (72 m, as OSM); NE and SE caps
 * 54.8→68 m (equalised by Fossati; sultanahmed reads 67.9 and 68.3, cap
 * bases 54.7). Balconies: west 50.5 m (OSM 50–52, galata1 50.3, sultanahmed
 * 50.9), NE and SE 47.6–48.2 m (sultanahmed 48); the western minarets'
 * lower balcony at 31 m (OSM base parts h 31, mars01). SE stone pedestal
 * 21 m (OSM) with a stone collar to 26.5 m, then brick. Drum 41→46.4 m
 * (OSM 40/41; sultanahmed reads 40.5→46), dome crown 56.2 m. Tympanum arch
 * r 10.2 m springing at 26.5 m, crown 36.7 m (sultanahmed: 36.3 and 26.1).
 * East semi-dome window ring 29→34.4 m, semi-dome crowns 39.5 m
 * (sultanahmed 39.2; section 38.5). Section drawing (Laengsschnitt):
 * inner narthex 20–22 m, exonarthex 8.7 m. Buttress tower caps 37.6 m
 * (galata1 37.5). The stone masses flanking the apse 17.5 and 20.5 m
 * (ext005, scaled from the apse).
 * Estimated: the drum buttress proportions, the pier towers' rounded
 * tops (to 44 m), window counts
 * and sizes, outer buttress slopes (from photos only), the exedra crowns
 * raised to 33 m so they show above the nave roof as in the aerials (OSM
 * 30 m), the annex fill at 8 m over the rest of the outline (tombs, Sultan's
 * pavilion, ramps), the baptistery's 12 m walls and dome.
 *
 * Minaret shafts: 5.5 m (west), 4.8 m (SE), 4.3 m (NE), about 1.1–1.3×
 * the widths read in sultanahmed (4.9, 3.9, 3.9 m incl. haze), so they
 * survive at phone size; balconies project 1.05 m.
 *
 * The drum reads dark from every distance (its 40 windows and their deep
 * reveals), so the drum wall and the buttresses' faces are `window` (lit at
 * night, as the drum ring is) and only the buttress caps are lead.
 *
 * Ground: no Mapterhorn z15 terrain here (tools/terrain.ts 404s) and no
 * lidar (Turkey). The site is treated as level: the floor is close to the
 * Ayasofya square on the west and the ground falls only gently north and
 * east around the building. Elevation 0.
 *
 * Night: the walls, minarets and dome are floodlit (light: the dome and
 * tympanum glow gold); windows glow.
 *
 * Photos (evidence, Wikimedia Commons):
 *  mars2013    "Hagia Sophia Mars 2013.jpg", Arild Vågen, CC BY-SA 3.0 (from SW, high)
 *  mars01      "Hagia Sophia Mars 2013 01.jpg", Arild Vågen, CC BY-SA 3.0 (from W/SW)
 *  roman       "Hagia Sophia in Istanbul (focused on the original Roman building).jpg",
 *              Maskaravivek, CC BY 3.0 (south tympanum)
 *  tombs       "Hagia Sophia - Exterior with the sultans' tombs.jpg", Alena Belova
 *              for Exhibo, CC BY-SA 4.0 (from SW)
 *  galata1     "View of Hagia Sophia from the Galata Tower (1).jpg", José Luiz,
 *              CC BY-SA 3.0 (from NNW, distant, level)
 *  galata      "Hagia Sophia from Galata Tower.jpg", Vassillis, CC BY-SA 3.0
 *  sultanahmed "Istanbul Hagia Sophia Sultanahmed.JPG", Julian Nyča, CC BY-SA 3.0
 *              (from the Marmara, distant, level)
 *  minarets    "Minarets of Hagia Sophia, Istanbul.jpg", Bernard Gagnon, CC BY-SA 3.0
 *  y2017       "Hagia Sophia 2017.jpg", Nserrano, CC BY-SA 4.0
 *  se9183      "Hagia Sophia exterior SE side in 2016 9183.jpg", Dosseman, CC BY-SA 4.0
 *  feb2013     "Hagia Sophia February 2013 02.jpg", Arild Vågen, CC BY-SA 3.0 (dusk)
 *  light       "Hagia Sophia light.JPG", Kirua, CC BY-SA 4.0 (night)
 *  ext005      "Hagia Sophia exterior 2007 005.jpg", Gryffindor, public domain (east end)
 *  topkapipark "Hagia Sophia - Blick vom Park des Topkapi-Palastes.jpg", Johann H.
 *              Addicks, CC BY-SA 3.0 (south tympanum)
 *  aerial1/2   "ETH-BIB-Hagia Sophia, Istanbul-Weitere-LBS MH02-27-0062.tif" and
 *              "…-0063.tif", Walter Mittelholzer (ETH-Bibliothek), public domain
 *  section     "Hagia-Sophia-Laengsschnitt.jpg", public domain (19th-c. section)
 * Look-only: none.
 *
 * Doubts: heights of the outer buttresses and annexes (OSM has none; read
 * from photos; the south ones drawn as slopes from mars2013, the north ones
 * as stepped blocks from galata1); the north side's lower parts are seen
 * only from far off; the annex fill is a plain 8 m stone block; the site's
 * slope is not modelled; the nave block is drawn at 29 m (OSM 31) east and
 * west of the dome square only, so the tympana come down to the 25 m aisle
 * roofs as the photos show.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { TAU, at, box, capPoly, ccw, circle, offset, prism, save, smoothWall, wall, type XY } from './atl-flatiron-building'
import { archShape, onWall, rectShape, revolve } from './atl-tech-tower'

const plaster = new Part(), brick = new Part(), lead = new Part(), stone = new Part(), win = new Part(), gilt = new Part()

// ───────────────────────────────── helpers ─────────────────────────────────

const nrm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
/** A flat convex polygon, wound to face along n. */
function poly(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const g = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
    if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/**
 * A segmental barrel cap on top of a box, its axis along `axis`: the arch
 * spans the box's other side and rises `rise` above z.
 */
function barrel(p: Part, x0: number, x1: number, y0: number, y1: number, z: number, rise: number, axis: 'x' | 'y', seg = 6) {
  const half = axis === 'y' ? (x1 - x0) / 2 : (y1 - y0) / 2
  const R = (half * half + rise * rise) / (2 * rise), zc = z + rise - R, a0 = Math.asin(half / R)
  const pts: [number, number, number, number][] = [] // s, z, ns, nz
  for (let i = 0; i <= seg; i++) {
    const a = -a0 + (2 * a0 * i) / seg
    pts.push([R * Math.sin(a), zc + R * Math.cos(a), Math.sin(a), Math.cos(a)])
  }
  const P = (s: number, zz: number, t: number): V3 => (axis === 'y' ? [(x0 + x1) / 2 + s, t, zz] : [t, (y0 + y1) / 2 + s, zz])
  const N = (ns: number, nz: number): V3 => (axis === 'y' ? [ns, 0, nz] : [0, ns, nz])
  const [t0, t1] = axis === 'y' ? [y0, y1] : [x0, x1]
  for (let i = 0; i < seg; i++) {
    const [s0, z0, n0s, n0z] = pts[i], [s1, z1, n1s, n1z] = pts[i + 1]
    p.tri(P(s0, z0, t0), P(s1, z1, t0), P(s1, z1, t1), undefined, undefined, undefined, [N(n0s, n0z), N(n1s, n1z), N(n1s, n1z)])
    p.tri(P(s0, z0, t0), P(s1, z1, t1), P(s0, z0, t1), undefined, undefined, undefined, [N(n0s, n0z), N(n1s, n1z), N(n0s, n0z)])
  }
  for (const [t, sgn] of [[t0, -1], [t1, 1]] as [number, number][]) {
    poly(p, pts.map(([s, zz]) => P(s, zz, t)), axis === 'y' ? [0, sgn, 0] : [sgn, 0, 0])
  }
}

/**
 * A wedge buttress: a box over [x0,x1]×[y0,y1] whose top slopes from zHi at
 * the wall side to zLo at the far side. `dir` is the direction away from the
 * wall: '+x', '-x', '+y' or '-y'.
 */
function wedge(p: Part, x0: number, x1: number, y0: number, y1: number, zHi: number, zLo: number, dir: '+x' | '-x' | '+y' | '-y') {
  const h = (x: number, y: number) => {
    const t = dir === '+x' ? (x - x0) / (x1 - x0) : dir === '-x' ? (x1 - x) / (x1 - x0) : dir === '+y' ? (y - y0) / (y1 - y0) : (y1 - y) / (y1 - y0)
    return zHi + (zLo - zHi) * t
  }
  const c: XY[] = rect(x0, x1, y0, y1)
  const top = c.map(([x, y]) => [x, y, h(x, y)] as V3)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, a = c[i], b = c[j]
    const n: V3 = nrm([b[1] - a[1], -(b[0] - a[0]), 0])
    poly(p, [[a[0], a[1], 0], [b[0], b[1], 0], top[j], top[i]], n)
  }
  const e1 = [top[1][0] - top[0][0], top[1][1] - top[0][1], top[1][2] - top[0][2]], e2 = [top[3][0] - top[0][0], top[3][1] - top[0][1], top[3][2] - top[0][2]]
  const tn = nrm([e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]])
  poly(p, top, tn[2] < 0 ? [-tn[0], -tn[1], -tn[2]] : tn)
}

/** A smooth surface of revolution over part of a turn, a0→a1 (radians). */
function revolveArc(p: Part, c: XY, prof: [number, number][], a0: number, a1: number, n: number) {
  const segN = prof.slice(0, -1).map(([r0, z0], k) => { const [r1, z1] = prof[k + 1]; const l = Math.hypot(z1 - z0, r1 - r0) || 1; return [(z1 - z0) / l, -(r1 - r0) / l] })
  const vN = prof.map((_, k) => { const a = segN[Math.max(0, k - 1)], b = segN[Math.min(segN.length - 1, k)]; const l = Math.hypot(a[0] + b[0], a[1] + b[1]) || 1; return [(a[0] + b[0]) / l, (a[1] + b[1]) / l] })
  const ang = (i: number) => a0 + ((a1 - a0) * i) / n
  const P = (k: number, i: number): V3 => [c[0] + prof[k][0] * Math.cos(ang(i)), c[1] + prof[k][0] * Math.sin(ang(i)), prof[k][1]]
  const N = (k: number, i: number): V3 => [vN[k][0] * Math.cos(ang(i)), vN[k][0] * Math.sin(ang(i)), vN[k][1]]
  for (let k = 0; k < prof.length - 1; k++) for (let i = 0; i < n; i++) {
    const a = P(k, i), b = P(k, i + 1), cc = P(k + 1, i + 1), d = P(k + 1, i)
    if (prof[k][0] > 1e-6) p.tri(a, b, cc, undefined, undefined, undefined, [N(k, i), N(k, i + 1), N(k + 1, i + 1)])
    if (prof[k + 1][0] > 1e-6) p.tri(a, cc, d, undefined, undefined, undefined, [N(k, i), N(k + 1, i + 1), N(k + 1, i)])
  }
}

/** A dome profile: radius R at z0 rising `rise` to the crown, elliptical. */
const domeProf = (R: number, z0: number, rise: number, k = 6, lip = 0): [number, number][] => {
  const pr: [number, number][] = lip ? [[R + lip, z0 - 0.35], [R, z0]] : []
  for (let i = lip ? 1 : 0; i <= k; i++) { const t = (i / k) * (Math.PI / 2); pr.push([R * Math.cos(t), z0 + rise * Math.sin(t)]) }
  pr[pr.length - 1][0] = 0
  return pr
}

/** A gilt finial (alem): a ball, a neck and a crescent spike. */
function alem(c: XY, z: number, h: number) {
  const s = h / 4
  revolve(gilt, c, [[0.35 * s, z], [0.8 * s, z + 0.7 * s], [0.3 * s, z + 1.5 * s], [0.55 * s, z + 2.0 * s], [0.12 * s, z + 2.8 * s], [0, z + h]], 6)
}

/**
 * A wall face at y = yf (facing +y when sgn = 1) over x0…x1, z0…z1, with a
 * round-headed opening (centre xc, radius r, springing zs) recessed `depth`
 * to a back wall. Front and soffit in `face`/`soffit`, back wall in `back`.
 */
function archWall(face: Part, soffit: Part, back: Part, x0: number, x1: number, z0: number, z1: number, yf: number, sgn: number, xc: number, r: number, zs: number, depth: number, seg = 10) {
  const yb = yf - sgn * depth, n: V3 = [0, sgn, 0]
  const arc = Array.from({ length: seg + 1 }, (_, i) => { const a = Math.PI - (i / seg) * Math.PI; return [xc + r * Math.cos(a), zs + r * Math.sin(a)] as [number, number] })
  // jambs
  poly(face, [[x0, yf, z0], [xc - r, yf, z0], [xc - r, yf, zs], [x0, yf, zs]], n)
  poly(face, [[xc + r, yf, z0], [x1, yf, z0], [x1, yf, zs], [xc + r, yf, zs]], n)
  // above the arch, a strip from each arc segment up to the top edge
  const top = arc.map((_, i) => x0 + ((x1 - x0) * i) / seg)
  poly(face, [[x0, yf, zs], [arc[0][0], yf, arc[0][1]], [top[0], yf, z1]], n)
  for (let i = 0; i < seg; i++) poly(face, [[arc[i][0], yf, arc[i][1]], [arc[i + 1][0], yf, arc[i + 1][1]], [top[i + 1], yf, z1], [top[i], yf, z1]], n)
  poly(face, [[arc[seg][0], yf, arc[seg][1]], [x1, yf, zs], [top[seg], yf, z1]], n)
  // soffit and jamb returns
  for (let i = 0; i < seg; i++) {
    const [ax, az] = arc[i], [bx, bz] = arc[i + 1], mx = (ax + bx) / 2 - xc, mz = (az + bz) / 2 - zs
    poly(soffit, [[ax, yf, az], [bx, yf, bz], [bx, yb, bz], [ax, yb, az]], nrm([-mx, 0, -mz]))
  }
  poly(soffit, [[xc - r, yf, z0], [xc - r, yb, z0], [xc - r, yb, zs], [xc - r, yf, zs]], [1, 0, 0])
  poly(soffit, [[xc + r, yf, z0], [xc + r, yb, z0], [xc + r, yb, zs], [xc + r, yf, zs]], [-1, 0, 0])
  // back wall
  poly(back, [[xc - r, yb, z0], [xc + r, yb, z0], ...arc.slice().reverse().map(([x, z]) => [x, yb, z] as V3)], n)
  // the top of the front skin
  poly(face, [[x0, yf, z1], [x1, yf, z1], [x1, yb, z1], [x0, yb, z1]], [0, 0, 1])
}

/** Arched window panels along a wall a→b (outside to the right), at s positions. */
function windows(a: XY, b: XY, ss: number[], w: number, z0: number, zs: number, out = 0.06, p: Part = win) {
  for (const s of ss) onWall(p, a, b, archShape(s, w, z0, zs, 6), out)
}

// ───────────────────────────────── the plan ────────────────────────────────

// OSM way/109862851 in the dome-centred frame (u east, v north).
const OUTLINE: XY[] = ccw([[32.2, 37.8], [20.3, 37.6], [20.7, 54.6], [1.7, 56.9], [1.1, 46.8], [-3.7, 47.1], [-4.1, 37.5], [-7.7, 37.5], [-7.0, 49.0], [-21.8, 49.7], [-21.8, 37.3], [-28.2, 37.5], [-28.1, 53.7], [-43.1, 53.9], [-50.0, 53.8], [-50.3, 42.6], [-57.2, 42.5], [-57.2, 35.1], [-64.4, 35.1], [-64.4, 40.6], [-70.5, 40.6], [-70.5, 25.3], [-57.2, 25.4], [-57.1, 13.0], [-61.3, 13.0], [-61.3, 10.7], [-57.2, 10.6], [-57.2, 5.8], [-61.2, 5.8], [-61.2, 3.4], [-57.2, 3.5], [-57.2, 1.0], [-57.2, -1.4], [-61.3, -1.4], [-61.3, -3.8], [-57.1, -4.0], [-57.2, -8.1], [-61.5, -8.0], [-61.4, -11.1], [-57.1, -11.1], [-57.0, -21.8], [-71.3, -21.5], [-71.4, -30.8], [-68.8, -30.9], [-69.0, -43.7], [-58.5, -43.7], [-58.6, -54.8], [-50.0, -54.9], [-47.6, -55.0], [-47.5, -52.6], [-40.8, -52.8], [-41.5, -73.9], [-35.0, -74.3], [-34.6, -62.3], [-17.7, -62.3], [-17.4, -54.7], [-8.7, -54.8], [-8.7, -49.2], [-8.8, -36.5], [-6.3, -36.4], [-6.1, -48.3], [2.1, -48.2], [1.9, -36.6], [9.1, -37.3], [9.3, -47.6], [19.1, -47.4], [19.1, -37.2], [26.0, -37.3], [26.1, -47.2], [30.6, -47.3], [29.9, -60.7], [45.3, -61.1], [46.5, -38.8], [50.1, -38.8], [52.0, 15.2], [62.1, 14.8], [62.8, 26.3], [63.4, 36.0], [55.7, 36.1], [56.4, 43.4], [48.8, 43.2], [48.8, 41.8], [32.1, 41.8]])
const SHIFT: XY = [6.05, 2.61] // dome-centred frame → anchor frame

// Key dimensions (see header).
const CU0 = -38.6, CU1 = 38.5, CV = 37.5 // aisle/gallery block
const NV = 22.4 // nave block half-width
const SQ = 20.0, PIER0 = 11.4, TYMP = 20.4, TYMP_BACK = 18.9 // dome square, pier towers, tympanum faces
const STRIP0 = 11.4, STRIP1 = 18.6 // the N–S buttress walls
const Z_AISLE = 25, Z_NAVE = 29, Z_SQ = 41, Z_DRUM = 46.4, Z_CROWN = 56.2
const DRUM_R = 16.0, DOME_R = 16.3

// 1. The annexes, tombs and ramps the outline holds beyond the church: a plain block.
prism(stone, OUTLINE, 0, 8, lead, 0.35)
// The grey stone buttress masses flanking the apse (ext005), and the east wall's terrace.
box(stone, CU1, 50.0, -36.5, -7.2, 0, 17.5, lead, 0.4)
box(stone, CU1, 50.6, 7.2, 22.2, 0, 20.5, lead, 0.4)

// 2. The aisle and gallery block, and the raised nave block over it.
box(plaster, CU0, CU1, -CV, CV, 0, Z_AISLE, lead, 0.45)
// (east and west of the dome square only: between the piers the tympana come down to the aisle roofs)
box(plaster, CU0, -SQ, -NV, NV, Z_AISLE, Z_NAVE, lead, 0.4)
box(plaster, SQ, CU1, -NV, NV, Z_AISLE, Z_NAVE, lead, 0.4)

// 3. Narthex and exonarthex on the west, with shed roofs falling west.
function shed(x0: number, x1: number, y0: number, y1: number, zLo: number, zHi: number, eave = 0.6) {
  wall(plaster, rect(x0, x1, y0, y1), 0, zLo)
  poly(plaster, [[x1, y0, zLo], [x1, y1, zLo], [x1, y1, zHi], [x1, y0, zHi]], [1, 0, 0])
  poly(plaster, [[x0, y0, zLo], [x1, y0, zLo], [x1, y0, zHi]], [0, -1, 0])
  poly(plaster, [[x0, y1, zLo], [x1, y1, zLo], [x1, y1, zHi]], [0, 1, 0])
  const s = (zHi - zLo) / (x1 - x0)
  const a: V3 = [x0 - eave, y0 - eave, zLo - eave * s], b: V3 = [x1, y0 - eave, zHi], c: V3 = [x1, y1 + eave, zHi], d: V3 = [x0 - eave, y1 + eave, zLo - eave * s]
  poly(lead, [a, b, c, d], nrm([-s, 0, 1]))
  poly(lead, [a, d, [d[0], d[1], d[2] - 0.3], [a[0], a[1], a[2] - 0.3]], [-1, 0, 0])
  poly(lead, [[a[0], a[1], a[2] - 0.3], [d[0], d[1], d[2] - 0.3], [x0, y1, zLo - 0.3], [x0, y0, zLo - 0.3]], [0, 0, -1])
}
shed(-49.6, CU0, -36.7, 37.1, 20.5, 24.2)
shed(-57.2, -49.6, -29.5, 35.2, 7.4, 9.6)
// The six west buttresses, stepping down westwards.
for (const v of [-23.6, -9.65, -2.4, 4.6, 11.85, 26.5]) wedge(plaster, -61.4, -49.6, v - 1.25, v + 1.25, 12.5, 6, '-x')
// The two little domed turrets over the narthex.
for (const v of [-10.6, 9.8]) {
  smoothWall(plaster, circle([-35.1, v], 1.9, 10), Z_AISLE, 31.5)
  revolve(lead, [-35.1, v], domeProf(2.0, 31.5, 2.1, 3, 0.25), 10)
  alem([-35.1, v], 33.6, 1.2)
}

// 4. The dome square: pier towers, tympanum walls, flat top.
for (const s of [-1, 1]) {
  const [x0, x1] = s > 0 ? [PIER0, SQ] : [-SQ, -PIER0]
  box(plaster, x0, x1, -NV, NV, Z_AISLE, Z_SQ + 0.6, lead, 0.35)
  // the pier towers' rounded heads at the four corners
  for (const t of [-1, 1]) {
    const [y0, y1] = t > 0 ? [14.6, NV] : [-NV, -14.6]
    wall(plaster, rect(x0, x1, y0, y1), Z_SQ + 0.6, Z_SQ + 1.0)
    barrel(plaster, x0, x1, y0, y1, Z_SQ + 1.0, 2.4, 'y', 5)
  }
}
box(plaster, -PIER0, PIER0, -(TYMP_BACK - 0.3), TYMP_BACK - 0.3, Z_AISLE, Z_SQ, lead, 0.3) // behind the recesses' back walls
for (const t of [-1, 1]) {
  const yf = t * TYMP
  // archWall builds a face whose outside is +y; mirror for the south by swapping.
  archWall(plaster, brick, brick, -PIER0, PIER0, Z_AISLE, Z_SQ, yf, t, 0, 10.2, 26.5, TYMP - TYMP_BACK, 10)
  // the side returns of the tympanum skin against the piers are hidden.
  // the windows in the red recess: five tall above, seven below
  const yb = t * TYMP_BACK
  const a: XY = t > 0 ? [PIER0, yb] : [-PIER0, yb], b: XY = t > 0 ? [-PIER0, yb] : [PIER0, yb]
  const off = PIER0
  windows(a, b, [-4.4, -2.2, 0, 2.2, 4.4].map((s) => s + off), 1.4, 32.4, 34.2, 0.06)
  windows(a, b, [-7.5, -5, -2.5, 0, 2.5, 5, 7.5].map((s) => s + off), 1.4, 28.6, 30.2, 0.06)
}

// 5. The drum: the ring of 40 windows (dark, between the piers, as it reads
//    from afar) and its 40 lead-capped buttresses, then the dome.
const N40 = 40
const drumRing = circle([0, 0], DRUM_R, N40, Math.PI / N40)
wall(win, drumRing, Z_SQ, Z_DRUM)
for (let i = 0; i < N40; i++) {
  const ang = (i / N40) * TAU, c = Math.cos(ang), s = Math.sin(ang), w = 0.45
  const P = (r: number, d: number, z: number): V3 => [c * r - s * d, s * r + c * d, z]
  const r0 = DRUM_R - 0.2, r1 = DRUM_R + 2.6
  const zt0 = Z_DRUM + 0.1, zt1 = Z_DRUM - 2.6
  // the buttresses' flanks read as the dark window reveals between them
  poly(win, [P(r0, -w, Z_SQ), P(r1, -w, Z_SQ), P(r1, -w, zt1), P(r0, -w, zt0)], [-s, c, 0].map((q) => -q) as V3)
  poly(win, [P(r0, w, Z_SQ), P(r1, w, Z_SQ), P(r1, w, zt1), P(r0, w, zt0)], [-s, c, 0])
  poly(win, [P(r1, -w, Z_SQ), P(r1, w, Z_SQ), P(r1, w, zt1), P(r1, -w, zt1)], [c, s, 0])
  poly(lead, [P(r0, -w, zt0), P(r1, -w, zt1), P(r1, w, zt1), P(r0, w, zt0)], nrm([c * 0.9, s * 0.9, 1]))
}
// the cornice under the dome, then the dome itself
revolve(lead, [0, 0], [[DRUM_R, Z_DRUM - 0.3], [DOME_R + 0.8, Z_DRUM], [DOME_R + 0.8, Z_DRUM + 0.35], [DOME_R, Z_DRUM + 0.5]], 32, 0, true, false)
revolve(lead, [0, 0], domeProf(DOME_R, Z_DRUM + 0.5, Z_CROWN - Z_DRUM - 0.5, 6), 32)
alem([0, 0], Z_CROWN - 0.15, 4.6)

// 6. The semi-domes east and west, on window rings, and their exedrae.
for (const s of [-1, 1]) {
  const c: XY = [s * SQ, 0], a0 = s > 0 ? -Math.PI / 2 : Math.PI / 2, a1 = a0 + Math.PI
  const R = 15.7, zd = 34.4
  const ring = Array.from({ length: 13 }, (_, i) => { const a = a0 + (Math.PI * i) / 12; return [c[0] + R * Math.cos(a), c[1] + R * Math.sin(a)] as XY })
  smoothWall(plaster, ring, Z_NAVE, zd, false)
  for (let i = 2; i < 11; i += 2) { const p0 = ring[i], p1 = ring[i + 1]; const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]); onWall(win, p0, p1, archShape(L / 2, 2.0, 31.2, 32.9, 4), 0.05) }
  revolveArc(lead, c, [[R + 0.6, zd - 0.2], [R + 0.6, zd + 0.15], ...domeProf(R, zd + 0.3, 39.5 - zd - 0.3, 4)], a0, a1, 12)
  // exedrae: small domes on window drums, two per side
  for (const t of [-1, 1]) {
    const e: XY = [s * 25.8, t * 13.9]
    smoothWall(plaster, circle(e, 6.0, 12), Z_NAVE, 31.2)
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * TAU + Math.PI / 12
      const dx = Math.cos(ang), dy = Math.sin(ang)
      if (dx * s * 0.4 + dy * t < 0.2) continue // only the outward-facing windows
      const ra = circle(e, 6.03, 12)
      const p0 = ra[i], p1 = ra[(i + 1) % 12]
      onWall(win, p0, p1, archShape(Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / 2, 1.2, 29.6, 30.6, 3), 0.05)
    }
    revolve(lead, e, domeProf(6.0, 31.2, 2.6, 3, 0.4), 12)
  }
}

// 7. The apse: a three-sided half-hexagon east of the aisle block, with its semi-dome.
{
  const c: XY = [CU1 - 0.2, 0], r = 6.8
  const pts = Array.from({ length: 4 }, (_, i) => { const a = -Math.PI / 2 + (Math.PI * i) / 3; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as XY })
  for (let i = 0; i < 3; i++) {
    const [a, b] = [pts[i], pts[i + 1]]
    poly(brick, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], 25], [a[0], a[1], 25]], nrm([b[1] - a[1], a[0] - b[0], 0]))
    const L = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1])
    windows(pts[i], pts[i + 1], [L / 2], 2.0, 9.5, 14.0)
    windows(pts[i], pts[i + 1], [L / 2 - 1.6, L / 2 + 1.6], 1.3, 17.5, 21.0)
  }
  capPoly(lead, [pts[0], pts[1], pts[2], pts[3]], 25, true)
  revolveArc(lead, c, [[r + 0.4, 24.8], ...domeProf(r * 0.98, 25.2, 5.5, 4)], -Math.PI / 2, Math.PI / 2, 9)
}

// 8. The buttress walls north and south of the dome square, with barrel caps,
//    and their outer buttresses beyond the walls.
for (const s of [-1, 1]) {
  const [x0, x1] = s > 0 ? [STRIP0, STRIP1] : [-STRIP1, -STRIP0]
  for (const t of [-1, 1]) {
    const [y0, y1] = t > 0 ? [NV, CV] : [-CV, -NV]
    box(plaster, x0, x1, y0, y1, Z_AISLE, 35.4, null, 0)
    barrel(plaster, x0, x1, y0, y1, 35.4, 2.2, 'y', 6)
  }
}
// Outer buttresses (OSM parts without heights; slopes from the photos).
wedge(stone, -19.6, -11.3, -50.2, -CV, 23, 9, '-y') // 776086640
wedge(stone, 9.1, 19.1, -47.6, -CV, 23, 9, '-y') // 776086642
wedge(stone, -6.3, 2.1, -48.3, -CV, 14, 6, '-y') // 776086639
wedge(stone, 26.0, 38.5, -47.4, -CV + 1.2, 23, 8, '-y') // 776086641, the SE buttress
// North side: stepped masses rather than slopes (galata1).
box(stone, -21.8, -7.0, CV, 49.7, 0, 21, lead, 0.4) // 776086644
box(stone, 10.3, 20.7, CV, 46.5, 0, 21, lead, 0.4) // 776086646
box(stone, 10.3, 20.7, 46.5, 55.2, 0, 13, lead, 0.4)
box(stone, -4.1, 10.4, CV, 47.1, 0, 15, lead, 0.4) // 776086643

// 9. Facade windows: galleries and aisles on the long walls, between buttresses.
{
  const south: [number, number][] = [[-19.6, -11.3], [-6.3, 2.1], [9.1, 19.1], [26.0, 38.5]]
  const north: [number, number][] = [[-21.8, -7.0], [-4.1, 10.4], [10.3, 20.7]]
  const free = (u: number, bs: [number, number][]) => bs.every(([a, b]) => u < a - 1.8 || u > b + 1.8)
  const us = Array.from({ length: 17 }, (_, i) => -35 + i * 4.4)
  // south wall runs east→west with the outside (−v) to its right
  const sA: XY = [CU0, -CV], sB: XY = [CU1, -CV], nA: XY = [CU1, CV], nB: XY = [CU0, CV]
  const sU = us.filter((u) => free(u, south)), nU = us.filter((u) => free(u, north))
  windows(sA, sB, sU.map((u) => u - CU0), 2.6, 14.5, 18.8)
  windows(sA, sB, sU.map((u) => u - CU0), 2.0, 8.8, 11.6)
  windows(nA, nB, nU.map((u) => CU1 - u), 2.6, 14.5, 18.8)
  windows(nA, nB, nU.map((u) => CU1 - u), 2.0, 8.8, 11.6)
  // east wall either side of the apse (outside +u)
  const eA: XY = [CU1, -CV], eB: XY = [CU1, CV]
  windows(eA, eB, [3.5, 8.0, 12.5, 24.5, 29.0, 34.0].map((s) => s), 2.4, 14.5, 18.6)
  // the nave block's clerestory over the aisle roofs (north and south)
  windows([CU0, -NV], [CU1, -NV], [5, 9, 13, 63.5, 67.5, 71.5], 1.8, 26.0, 27.6)
  windows([CU1, NV], [CU0, NV], [5, 9, 13, 63.5, 67.5, 71.5], 1.8, 26.0, 27.6)
  // the narthex gallery over the exonarthex roof (west face, outside −u)
  const wA: XY = [-49.6, 37.1], wB: XY = [-49.6, -36.7]
  windows(wA, wB, [6, 13.2, 20, 27.5, 34.5, 41.8, 48.5, 56.5, 64.5], 2.6, 12.8, 17.2)
}

// 10. The minarets.
type Minaret = { c: XY; base: number; zBase: number; taper?: [number, number, number]; r: number; serefe: number[]; rUp: number; zCap: number; zTip: number; shaft: Part; band?: number }
function minaret(m: Minaret) {
  const [x, y] = m.c, h = m.base / 2
  box(stone, x - h, x + h, y - h, y + h, 0, m.zBase, stone, 0.3)
  let z = m.zBase, r = m.r
  if (m.taper) {
    // the tapered "pabuç" from the square to the shaft
    const [z1, rb, rt] = m.taper
    revolve(stone, m.c, [[rb, z], [rt, z1]], 12, Math.PI / 12, true, false)
    z = z1
  }
  const n = 12
  const ser = m.serefe
  for (let k = 0; k < ser.length; k++) {
    const zs = ser[k], rr = k === ser.length - 1 ? r : r
    if (zs - 1.0 > z + 0.05) smoothWall(m.shaft, circle(m.c, rr, n), z, zs - 1.0)
    // balcony: corbelled underside, a rim, and the parapet
    const ro = rr + 1.05
    revolve(stone, m.c, [[rr, zs - 1.0], [ro, zs], [ro, zs + 1.1], [rr * 0.98, zs + 1.1]], 12, 0, false, false)
    z = zs + 1.1
    if (k === ser.length - 1) r = m.rUp
  }
  // the upper shaft; a pale stone band under the cap where there is one (SE)
  const zb = m.band ?? m.zCap - 0.4
  smoothWall(m.shaft, circle(m.c, r, n), z, zb)
  if (zb < m.zCap - 0.4) smoothWall(stone, circle(m.c, r, n), zb, m.zCap - 0.4)
  revolve(stone, m.c, [[r, m.zCap - 0.4], [r + 0.3, m.zCap - 0.2], [r + 0.3, m.zCap]], n, 0, true, false)
  revolve(lead, m.c, [[r + 0.3, m.zCap], [0, m.zTip]], n, 0, true, false)
  capPoly(lead, circle(m.c, r + 0.3, n), m.zCap, false)
  alem(m.c, m.zTip - 0.4, 2.9)
}
// West: Sinan's pair for Selim II, identical (square base, pabuç, two balconies).
for (const c of [[-53.2, -33.2], [-53.3, 38.8]] as XY[]) {
  minaret({ c, base: 7.5, zBase: 21, taper: [30.0, 3.7, 2.85], r: 2.75, serefe: [31.0, 50.5], rUp: 2.45, zCap: 59.2, zTip: 69.6, shaft: stone })
}
// SE: red brick on a stone pedestal.
minaret({ c: [43.4, -32.9], base: 7.4, zBase: 21, taper: [26.5, 3.4, 2.55], r: 2.4, serefe: [48.2], rUp: 2.2, zCap: 54.8, zTip: 68.0, shaft: brick, band: 52.6 })
// NE: Bayezid II's slender one.
minaret({ c: [52.7, 39.4], base: 6.4, zBase: 17, taper: [23.0, 3.1, 2.25], r: 2.15, serefe: [47.6], rUp: 1.95, zCap: 54.8, zTip: 68.0, shaft: stone })

// 11. The baptistery (tomb of Mustafa I and Ibrahim), inside the outline at the SW.
{
  const oct: XY[] = ccw([[-32.2, -62.0], [-35.5, -58.5], [-35.1, -49.3], [-32.1, -46.1], [-22.8, -46.0], [-19.7, -49.2], [-19.7, -58.9], [-23.0, -62.1]])
  prism(stone, oct, 0, 12, lead, 0.35)
  for (let i = 0; i < oct.length; i++) {
    const a = oct[i], b = oct[(i + 1) % oct.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L > 6) windows(a, b, [L / 2 - 2, L / 2 + 2], 1.4, 7.5, 9.6)
  }
  smoothWall(stone, circle([-27.6, -54.1], 6.6, 12), 12, 13.4)
  revolve(lead, [-27.6, -54.1], domeProf(6.6, 13.4, 4.4, 4, 0.4), 12)
  alem([-27.6, -54.1], 17.6, 2.0)
}

// ───────────────────────────────── output ──────────────────────────────────

// Shift everything from the dome-centred frame to the anchor (glTF x = map x, glTF z = −map y).
for (const p of [plaster, brick, lead, stone, win, gilt]) {
  for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] += SHIFT[0]; p.pos[i + 2] -= SHIFT[1] }
}

const walls = (p: V3, n: V3) => (n[2] < 0.6 ? 0.75 : 0.15)
await save('istanbul-hagia-sophia', 'Hagia Sophia', [
  { part: plaster, material: { ...finish('ayasofya-plaster', 0xe4b39d), floodlight: walls } },
  { part: brick, material: { ...finish('ayasofya-brick', 0xc26a4b), floodlight: () => 0.6 } },
  { part: lead, material: { ...finish('ayasofya-lead', 0xa3acb5, 0.6), floodlight: (p) => (p[2] > 41 ? 1 : 0.15) } },
  { part: stone, material: { ...PALETTE.stone, floodlight: (p) => (p[2] > 12 ? 0.8 : 0.1) } },
  { part: win, material: PALETTE.window },
  { part: gilt, material: finish('ayasofya-gilt', 0xd8aa45, 0.5) },
], { height: 72, anchor: [41.008537, 28.979973], bearing: 33.2 }, 6500)
