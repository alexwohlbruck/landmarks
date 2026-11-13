/**
 * Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin.ts
 *
 * The fortress on Borovitsky Hill: a triangular red-brick wall about
 * 2.2 km round with swallowtail merlons and twenty towers, five of them
 * crowned by ruby stars, round the cathedrals of Cathedral Square, the Ivan
 * the Great Bell Tower, the Grand Kremlin Palace, the Senate and the
 * Arsenal. St Basil's, the Mausoleum and everything else on Red Square and
 * in the Alexander Garden are left to the map.
 *
 * Map frame: x east, y north, z up, metres; bearing 0, everything placed in
 * true orientation from OSM. The anchor is (37.6175, 55.7515), between the
 * Senate and Cathedral Square. The model is built flat on y = 0; the hill
 * falls about 20 m to the river, and the map drapes the model on its own
 * terrain. tools/terrain.ts could not check the site: Mapterhorn has no
 * tiles above z12 for Moscow.
 *
 * Plan (OSM, fetched 2026-11-13 with the API's map call): every building
 * outline inside the Kremlin territory (relation/1360641), the wall
 * (building=wall relations, extruded as mapped) and the twenty towers,
 * including the river-side towers whose outlines straddle the territory's
 * edge and the Kutafya barbican with the Trinity bridge's masonry
 * (relation/3062894). The Trinity bridge's deck (relation/3061016,
 * man_made=bridge) and the Alexander Garden's buildings are not covered.
 * Outlines are simplified to 0.3-0.6 m.
 *
 * Heights. Published (Wikipedia, "Moscow Kremlin Wall", "Kremlin towers",
 * "Ivan the Great Bell Tower"): wall 2235 m long, 5-19 m high; Troitskaya
 * 80 m, Spasskaya 71 m, Nikolskaya 70.4 m, Vodovzvodnaya 61.25 m, Corner
 * Arsenal 60.2 m, Borovitskaya 54 m, Beklemishevskaya 46.2 m, Middle
 * Arsenal 38.9 m (OSM's 28.9 is a typo; its parts reach 41.5 m); Ivan the
 * Great 81 m; star spans 3.0-3.75 m. Tier heights, wall heights per
 * stretch, the cathedral and palace eaves and the dome positions are OSM's
 * building:part heights (the Kremlin is mapped part by part in OSM). Widths
 * of the Spasskaya tiers were read off the CC BY photo below, where OSM's
 * parts read narrow.
 *
 * Two levels of detail. The site is too big for one low model: the detail
 * model (moscow-kremlin.detail.glb, drawn from detailZoom) has everything;
 * the low model drops the merlons, sheds and booths under 150 m2, the
 * Terem and Twelve Apostles domes and Annunciation's four corner domes,
 * draws the rest with fewer sides, and coarsens the outlines (1.5-2.5 m),
 * to stay inside 6,500 triangles and 250 KB.
 *
 * Estimated or simplified:
 * - Merlons (detail model only): about 1045 real ones, drawn at half their
 *   density (4.2 m pitch) and a little larger (2.3 x 2.5 m), as two flush
 *   plates, so the swallowtail row reads without shimmering.
 * - Stars are about 1.4 times real size, two crossed plates, so they read
 *   from every side at map distance.
 * - Tower tiers: OSM's parts reduced to 4-8 stacked prisms and tents each;
 *   dormers, kokoshniks, pinnacles (but Spasskaya's and Troitskaya's corner
 *   spires), clocks (but Spasskaya's dials, drawn as gold disks), vanes and
 *   crosses left out. The tented towers' green tents are drawn from the
 *   full width of their upper tier, as the photos show, where OSM maps a
 *   narrower tent on a low skirt roof.
 * - Palaces and the Arsenal: their outlines to one eave height each, under
 *   a hipped roof; window bays, porticoes and the Faceted Chamber's white
 *   front are left out. The State Kremlin Palace is a plain white box.
 * - Cathedrals: outline to the eave, a low roof for the zakomara gables,
 *   drums and onion domes where OSM puts them. Assumption's helmet domes use
 *   the same onion profile; Archangel's four silver domes are white; the
 *   Upper Saviour Cathedral's eleven small domes are drawn as five.
 * - The Spasskaya, Nikolskaya and Troitskaya Gothic tiers are plain tiers
 *   with a white cornice.
 *
 * Materials (six): Kremlin brick, white stone (cathedrals, Ivan, cornices,
 * silver domes), ochre (palaces, Senate, Arsenal), green (tower tents,
 * roofs, the Senate dome), gold (domes, clock dials) and `neon-kremlin-star`
 * (the ruby stars, lit red at night as they are). No `window` material: the
 * budget of six goes to the colours that identify the place. At night the
 * walls, towers, cathedrals and palaces are floodlit (`_FLOODLIGHT`), as in
 * the night photos.
 *
 * Photos (Wikimedia Commons):
 * - "Kremlin birds eye view-1.jpg", ITAR-TASS, CC BY 4.0 (from the south-west)
 * - "Kremlin birds eye view-3.jpg", ITAR-TASS, CC BY 4.0 (from the north-east)
 * - "Kremlin birds eye view-2.jpg", ITAR-TASS, CC BY 4.0 (from the south-west)
 * - "Kremlin and Red Square.1.jpg", mos.ru, CC BY 4.0 (from the east)
 * - "Moscow - 2025 - Spasskaya Tower.jpg", Юрий Д.К., CC BY 4.0
 * - "Moscow - 2025 - General view of the Kremlin from the Bolshoy
 *   Moskvoretsky Bridge1.jpg", Юрий Д.К., CC BY 4.0 (from the south)
 * - "Annunciation Cathedral in Moscow, Cathedral of the Archangel and the
 *   Bell Tower of Ivan the Great.jpg", Юрий Д.К., CC BY 4.0
 * - "Cathedral square inside the Kremlin.jpg", Pedro Szekely, CC BY-SA 2.0
 * - "The Troitskaya Tower (19775954258).jpg", Jorge Láscar, CC BY 2.0
 * - "Vista general del Kremlin, Moscú, Rusia, 2016-10-03, DD 18-19 HDR.jpg",
 *   Diego Delso, CC BY-SA 4.0 (night, from the south-east)
 * - "Moscow Kremlin at night (2001) 02.jpg", Godot13, CC BY-SA 4.0
 * - "Панорама Московского Кремля.jpg", kremlin.ru, CC BY 4.0 (from the south-west)
 */
import clipping from 'polygon-clipping'
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { bandTris, earcut, lathe, ngon, offset, type XY } from './sf-de-young'

type Mat = 'brick' | 'white' | 'ochre' | 'green' | 'gold' | 'star'
const fresh = (): Record<Mat, Part> => ({ brick: new Part(), white: new Part(), ochre: new Part(), green: new Part(), gold: new Part(), star: new Part() })
let P = fresh()
/** Building the low model (the map's default) rather than the detail model drawn from detailZoom. */
let LOW = false
const UP: V3 = [0, 0, 1]
const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) > 0 ? r : [...r].reverse())
const cw = (r: XY[]) => (area(r) < 0 ? r : [...r].reverse())
const centroid = (r: XY[]): XY => [r.reduce((s, p) => s + p[0], 0) / r.length, r.reduce((s, p) => s + p[1], 0) / r.length]
/** Douglas-Peucker on a closed ring, keeping its winding. */
function simplify(r: XY[], tol: number): XY[] {
  const dp = (pts: XY[]): XY[] => {
    const a = pts[0], b = pts[pts.length - 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-9
    let at = 0, dm = 0
    for (let k = 1; k < pts.length - 1; k++) {
      const d = Math.abs((pts[k][0] - a[0]) * (b[1] - a[1]) - (pts[k][1] - a[1]) * (b[0] - a[0])) / L
      if (d > dm) { dm = d; at = k }
    }
    return dm > tol ? [...dp(pts.slice(0, at + 1)).slice(0, -1), ...dp(pts.slice(at))] : [a, b]
  }
  const far = r.reduce((m, p, k) => (Math.hypot(p[0] - r[0][0], p[1] - r[0][1]) > Math.hypot(r[m][0] - r[0][0], r[m][1] - r[0][1]) ? k : m), 0)
  const out = [...dp(r.slice(0, far + 1)).slice(0, -1), ...dp([...r.slice(far), r[0]]).slice(0, -1)]
  return out.length >= 3 && Math.abs(area(out)) > 0.5 * Math.abs(area(r)) ? out : r
}
function inside(p: XY, r: XY[]) {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const a = r[i], b = r[j]
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c
  }
  return c
}

// ---------------------------------------------------------------- primitives

/** Side walls of a ring between two heights; a CCW ring faces out, a CW ring (a courtyard) faces in. */
function sides(p: Part, ring: XY[], z0: number, z1: number) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}
/** Join holes into the outer ring with bridges, for ear clipping (outer CCW, holes CW). */
function bridge(outer: XY[], holes: XY[][]): XY[] {
  let ring = ccw(outer)
  const crosses = (a: XY, b: XY, c: XY, d: XY) => {
    const o = (p: XY, q: XY, r: XY) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])
    return o(a, b, c) * o(a, b, d) < -1e-9 && o(c, d, a) * o(c, d, b) < -1e-9
  }
  for (const hole0 of [...holes].sort((a, b) => Math.max(...b.map((p) => p[0])) - Math.max(...a.map((p) => p[0])))) {
    const hole = cw(hole0)
    const hi = hole.reduce((m, p, i) => (p[0] > hole[m][0] ? i : m), 0), H = hole[hi]
    const segs = [...ring, ...hole].map((_, k, all) => k < ring.length ? [ring[k], ring[(k + 1) % ring.length]] : [hole[k - ring.length], hole[(k - ring.length + 1) % hole.length]]) as [XY, XY][]
    let best = -1, bd = Infinity
    ring.forEach((V, i) => {
      const d = Math.hypot(V[0] - H[0], V[1] - H[1])
      if (d < bd && !segs.some(([c, e]) => crosses(H, V, c, e))) { bd = d; best = i }
    })
    if (best < 0) continue
    ring = [...ring.slice(0, best + 1), ...hole.slice(hi), ...hole.slice(0, hi), H, ring[best], ...ring.slice(best + 1)]
  }
  return ring
}
/** A flat face at z over a polygon with holes, facing up (or down). */
function cap(p: Part, outer: XY[], holes: XY[][], z: number, up = true) {
  const ring = holes.length ? bridge(outer, holes) : ccw(outer)
  const n: V3 = up ? UP : [0, 0, -1]
  let tris: [XY, XY, XY][] = earcut(ring).map(([i, j, k]) => [ring[i], ring[j], ring[k]])
  // Ear clipping can fail on a bridged or nearly degenerate ring; the band sweep never does.
  const want = Math.abs(area(outer)) - holes.reduce((s, h) => s + Math.abs(area(h)), 0)
  if (Math.abs(tris.reduce((s, t) => s + Math.abs(area(t)), 0) - want) > 0.01 * want + 0.5) tris = bandTris([outer, ...holes])
  for (const [a, b, c] of tris) p.tri([...a, z], [...b, z], [...c, z], undefined, undefined, undefined, [n, n, n])
}
/** A ring that doesn't cross itself (an inset of a concave plan can). */
function simple(r: XY[]) {
  const u = clipping.union([[[...r, r[0]]]] as any) as unknown as XY[][][]
  return area(r) > 0 && u.length === 1 && u[0].length === 1 && Math.abs(Math.abs(area(u[0][0])) - area(r)) < 0.01 * area(r)
}
/** A loft between two rings with matching corners (the second may be a point). */
function loft(p: Part, a: XY[], za: number, b: XY[] | XY, zb: number) {
  for (let i = 0; i < a.length; i++) {
    const j = (i + 1) % a.length
    if (typeof b[0] === 'number') p.tri([...a[i], za], [...a[j], za], [...(b as XY), zb])
    else {
      const bb = b as XY[]
      p.quad([...a[i], za], [...a[j], za], [...bb[j], zb], [...bb[i], zb])
    }
  }
}
/** A solid prism over a convex or simple ring. */
function prism(p: Part, ring0: XY[], z0: number, z1: number, top: Part | null = p, bottom = false) {
  const ring = ccw(ring0)
  sides(p, ring, z0, z1)
  if (top) cap(top, ring, [], z1)
  if (bottom) cap(p, ring, [], z0, false)
}
/**
 * A building: walls round its outline (and courtyards) to the eave, then a
 * hipped roof: a slope `ins` metres in, `rh` up, and a flat top.
 */
function block(wall: Part, roof: Part, outer0: XY[], holes0: XY[][], h: number, rh: number, ins = Math.min(3, rh * 0.9)) {
  const outer = ccw(outer0), holes = holes0.map(cw)
  sides(wall, outer, 0, h)
  holes.forEach((r) => sides(wall, r, 0, h))
  if (rh <= 0) { cap(roof, outer, holes, h); return }
  // The widest inset that stays a clean polygon; a vertical band of roof if none does.
  let io = outer, ih = holes
  for (const d of [ins, 1.5, 0.8]) {
    const o = offset(outer, -d), hs = holes.map((r) => offset(ccw(r), d))
    const ok = simple(o) && hs.every(simple) && Math.abs(Math.abs(area((clipping.difference([[[...o, o[0]]]] as any, ...hs.map((r) => [[[...r, r[0]]]]) as any) as any)[0]?.[0] ?? [])) - area(o)) < 0.01 * area(o)
    if (ok) { io = o; ih = hs.map(cw); break }
  }
  loft(roof, outer, h, io, h + rh)
  holes.forEach((r, k) => loft(roof, r, h, ih[k], h + rh))
  cap(roof, io, ih, h + rh)
}
const ROT = (c: XY, a: number) => (x: number, y: number): XY => [c[0] + x * Math.cos(a) - y * Math.sin(a), c[1] + x * Math.sin(a) + y * Math.cos(a)]
/** A square of half-width `h`, or an `n`-gon of apothem `h`, turned `a`. */
const poly = (c: XY, h: number, a: number, n = 4): XY[] => ngon(c[0], c[1], h / Math.cos(Math.PI / n), n, a + Math.PI / n)
/** Onion dome over a drum: drum radius rd from z0 to z1, onion of radius r from z1 to z2. */
function onion(c: XY, rd: number, z0: number, z1: number, r: number, z2: number, mat: Mat, n = 8, drum: Mat = 'white') {
  if (LOW) n = Math.max(6, Math.round(n * 0.67))
  sides(P[drum], ccw(ngon(c[0], c[1], rd, n, 0)), z0, z1)
  const H = z2 - z1
  lathe(P[mat], LOW
    ? [[rd * 0.95, z1], [r, z1 + H * 0.24], [r * 0.82, z1 + H * 0.52], [r * 0.36, z1 + H * 0.8], [0, z2]]
    : [[rd * 0.95, z1], [r, z1 + H * 0.2], [r * 0.98, z1 + H * 0.36], [r * 0.7, z1 + H * 0.58], [r * 0.3, z1 + H * 0.82], [0, z2]], n, c, 0)
}
/** A spike (cross, finial) as a thin cone. */
function spike(c: XY, z0: number, z1: number, r: number, mat: Mat) {
  loft(P[mat], ccw(ngon(c[0], c[1], r, 4, 0)), z0, c, z1)
}
/** A five-pointed ruby star, two crossed plates, centred at z, R tip radius. */
function star(c: XY, z: number, R: number) {
  for (const a of [Math.PI / 4, -Math.PI / 4]) {
    const u: V3 = [Math.cos(a), Math.sin(a), 0], n: V3 = [-Math.sin(a), Math.cos(a), 0]
    const pts = Array.from({ length: 10 }, (_, k) => {
      const r = k % 2 ? R * 0.42 : R, t = Math.PI / 2 + (k * Math.PI) / 5
      return [r * Math.cos(t), r * Math.sin(t)] as XY
    })
    for (const side of [1, -1]) {
      const nn: V3 = [n[0] * side, n[1] * side, 0], d = 0.18 * side
      const W = ([s, v]: XY): V3 => [c[0] + u[0] * s + n[0] * d, c[1] + u[1] * s + n[1] * d, z + v]
      const C = W([0, 0])
      for (let k = 0; k < 10; k++) P.star.tri(C, W(pts[k]), W(pts[(k + 1) % 10]), undefined, undefined, undefined, [nn, nn, nn])
    }
  }
}

// ---------------------------------------------------------------- towers

type Stage =
  | ['sq' | 'oct' | 'cyl', number, number, number, Mat] // prism: z0, z1, apothem, material
  | ['band', number, number, number, Mat] // an overhanging prism with an underside
  | ['tent', number, number, number, number, number?] // z0, z1, base apothem, sides, top apothem (0 = apex)
  | ['pins', number, number, number, Mat] // four corner spires: z0, z1, at half-width
  | ['clock', number, number, number] // gold dials on four faces: z, radius, half-width
  | ['star', number, number] // centre z, tip radius
type TowerSpec = { stages: Stage[]; body?: number; round?: boolean; shift?: XY }

/** A typical tent tower (river front, Arsenal side): body, machicolation band, upper tier, green tent with a lookout. */
function tentTower(h0: number, band: [number, number], tier: [number, number], apex: number, lookout = true): TowerSpec {
  const [zb, hb] = band, [zt, ht] = tier, base = ht + 0.3
  const st: Stage[] = [['band', h0, zb, hb, 'brick'], ['sq', zb, zt, ht, 'brick']]
  if (lookout && !LOW) {
    const zl = zt + (apex - zt) * 0.66
    st.push(['tent', zt, zl, base, 4, base * 0.3], ['oct', zl, zl + 2.2, base * 0.36, 'brick'], ['tent', zl + 2.2, apex, base * 0.42, 8])
  } else st.push(['tent', zt, apex, base, 4])
  return { body: h0, stages: st }
}

const towers = (): Record<string, TowerSpec> => ({
  // Spasskaya: body, Gothic tier with corner spires, clock tier, octagon, tent, star.
  'relation/1360656': { body: 28.5, stages: [
    ['band', 28.5, 30, 8.4, 'white'], ['sq', 30, 35, 7.6, 'brick'], ['pins', 30, 38, 7.2, 'white'],
    ['band', 35, 35.6, 7.9, 'white'], ['sq', 35.6, 43.5, 4.7, 'brick'], ['clock', 39.4, 2.9, 4.7],
    ['band', 43.5, 44.3, 5.1, 'white'], ['oct', 44.3, 50, 4.3, 'brick'], ['band', 50, 51.2, 4.6, 'white'],
    ['tent', 51.2, 66.8, 2.8, 8], ['star', 68.6, 2.6]] },
  // Nikolskaya: Gothic, white-trimmed, tall octagon and tent.
  'relation/1359372': { body: 24, stages: [
    ['band', 24, 25, 7.9, 'white'], ['sq', 25, 29, 6.1, 'brick'], ['pins', 24, 32, 6.6, 'white'],
    ['band', 29, 30, 6.5, 'white'], ['oct', 30, 41, 4.2, 'brick'], ['band', 41, 42, 4.5, 'white'],
    ['oct', 42, 51, 3.4, 'white'], ['tent', 51, 66.5, 2.9, 8], ['star', 68.2, 2.3]] },
  // Troitskaya, the tallest: body, white-trimmed tiers, octagon, tent, star.
  'relation/1360627': { body: 33.5, stages: [
    ['band', 33.5, 34.5, 9.9, 'white'], ['sq', 34.5, 38.5, 6.6, 'brick'], ['pins', 33.5, 41, 8.4, 'white'],
    ['sq', 38.5, 42.5, 5.5, 'brick'], ['band', 42.5, 43.3, 5.9, 'white'], ['oct', 43.3, 55.5, 4.5, 'brick'],
    ['band', 55.5, 56.5, 4.8, 'white'], ['tent', 56.5, 75.8, 3.9, 8], ['star', 77.7, 2.6]] },
  // Borovitskaya: a stepped pyramid of diminishing tiers.
  'relation/1360630': { body: 15.5, stages: [
    ['band', 15.5, 16.3, 6.9, 'white'], ['sq', 16.3, 21, 4.95, 'brick'], ['band', 21, 21.6, 5.3, 'white'],
    ['sq', 21.6, 25, 3.8, 'brick'], ['band', 25, 25.5, 4.0, 'white'], ['sq', 25.5, 30, 3.3, 'brick'],
    ['oct', 30, 35, 2.6, 'brick'], ['band', 35, 35.6, 2.8, 'white'], ['tent', 35.6, 51.2, 2.4, 8], ['star', 52.6, 2.0]] },
  // Vodovzvodnaya: round, machicolation crown, octagon, tent with a lookout, star.
  'relation/1360648': { body: 22.5, round: true, stages: [
    ['band', 22.5, 24.6, 6.25, 'brick'], ['oct', 24.6, 28.8, 5.0, 'brick'], ['tent', 28.8, 47.5, 3.7, 8, 1.4],
    ['oct', 47.5, 50, 1.6, 'brick'], ['tent', 50, 57.2, 1.9, 8], ['star', 59.1, 2.1]] },
  // Beklemishevskaya: round, crown, short octagon, tall tent with a lookout.
  'relation/1360651': { body: 21, round: true, stages: [
    ['band', 21, 25.2, 4.6, 'brick'], ['oct', 25.2, 29, 3.4, 'brick'], ['tent', 29, 40, 3.0, 8, 0.9],
    ['oct', 40, 41.5, 1.0, 'brick'], ['tent', 41.5, 46.2, 1.2, 8]] },
  // Corner Arsenal: the broad round corner tower.
  'relation/1360653': { body: 24, round: true, stages: [
    ['band', 24, 29.4, 8.1, 'brick'], ['cyl', 29.4, 33.5, 5.9, 'brick'], ['tent', 33.5, 52, 4.4, 8, 1.4],
    ['oct', 52, 53.6, 1.5, 'brick'], ['tent', 53.6, 59.5, 1.8, 8]] },
  // Senate tower: square body under a green stone tent.
  'relation/1359374': { body: 16, stages: [['band', 16, 16.7, 4.8, 'brick'], ['tent', 16.7, 34, 4.1, 4]] },
  // Tsar's: a small tented pavilion on the wall.
  'relation/1360663': { stages: [['sq', 0, 12.2, 1.9, 'brick'], ['band', 12.2, 13.6, 2.3, 'white'], ['tent', 13.6, 16, 2.5, 4]] },
  'relation/1360661': tentTower(12, [14, 4.9], [17, 3.2], 37), // Nabatnaya (Alarm)
  'relation/1360645': tentTower(12.5, [15.5, 7.85], [18, 6.5], 36.8), // Constantine and Helena
  'relation/1360660': tentTower(11, [13.3, 5.3], [16.5, 3.25], 27.1), // Petrovskaya
  'relation/3229567': tentTower(11, [13, 4.8], [15, 2.95], 30.2), // Second Unnamed
  'relation/1360642': tentTower(10.5, [12, 5.9], [16, 4.5], 34.1, false), // First Unnamed
  'relation/3229147': tentTower(10, [11.5, 9.1], [16.5, 6.4], 38.4, false), // Tainitskaya
  'relation/3229300': tentTower(10, [11.5, 5.2], [15, 3.75], 30.7, false), // Annunciation
  'relation/1360631': tentTower(18.5, [19.3, 5.3], [23.5, 2.95], 32.6), // Armoury
  'relation/1360655': tentTower(22.5, [23.5, 4.5], [30, 3.7], 41), // Commandant
  'relation/1360654': tentTower(17, [20, 5.2], [24, 3.75], 38.9), // Middle Arsenal
})

function buildTower(t: Tower) {
  const spec = towers()[t.id]
  const main = [...t.base].sort((a, b) => Math.abs(area(b.ring)) - Math.abs(area(a.ring)))[0]
  const ring = main?.ring ?? t.outline
  const c = centroid(ring)
  // Orientation: the longest edge of the main part.
  let best = 0, a = 0
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length], L = Math.hypot(q[0] - p[0], q[1] - p[1])
    if (L > best) { best = L; a = Math.atan2(q[1] - p[1], q[0] - p[0]) }
  }
  // The body: OSM's own base parts, each to its height (the main one to the spec's body height).
  for (const b of t.base) {
    const h = b === main && spec.body ? spec.body : Math.min(b.h, spec.body ?? b.h)
    if (b !== main && Math.abs(area(b.ring)) < 0.25 * Math.abs(area(ring)) && b.h > (spec.body ?? 99)) continue
    // The low model keeps only parts that stand clear of the main one (Spasskaya's barbican, Troitskaya's wings).
    if (LOW && b !== main && inside(centroid(b.ring), ring)) continue
    prism(P.brick, LOW ? simplify(ccw(b.ring), 0.5) : ccw(b.ring), 0, h, P.brick)
  }
  if (!t.base.length && spec.body) prism(P.brick, t.outline, 0, spec.body)
  const round = LOW ? 10 : 14
  const shape = (s: 'sq' | 'oct' | 'cyl', h: number) => (s === 'sq' ? poly(c, h, a, 4) : s === 'oct' ? poly(c, h, a, 8) : poly(c, h, a, round))
  for (const s of spec.stages) {
    if (s[0] === 'sq' || s[0] === 'oct' || s[0] === 'cyl') prism(P[s[4]], shape(s[0], s[3]), s[1], s[2])
    else if (s[0] === 'band') prism(P[s[4]], spec.round ? poly(c, s[3], a, round) : poly(c, s[3], a, 4), s[1], s[2], P[s[4]], !LOW)
    else if (s[0] === 'tent') {
      const [, z0, z1, r0, n, r1 = 0] = s
      const base = poly(c, r0, a, n)
      if (r1 > 0) { const top = poly(c, r1, a, n); loft(P.green, base, z0, top, z1); cap(P.green, top, [], z1) }
      else loft(P.green, base, z0, c, z1)
    } else if (s[0] === 'pins' && !LOW) {
      const [, z0, z1, h, m] = s
      for (const [x, y] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) spike(ROT(c, a)(x * h, y * h), z0, z1, 1.0, m)
    } else if (s[0] === 'clock') {
      const [, z, r, h] = s
      for (let k = 0; k < 4; k++) {
        const d = a + (k * Math.PI) / 2, n: V3 = [Math.cos(d), Math.sin(d), 0], u: V3 = [-Math.sin(d), Math.cos(d), 0]
        const o: V3 = [c[0] + n[0] * (h + 0.05), c[1] + n[1] * (h + 0.05), z]
        const m = LOW ? 8 : 12
        const pts = Array.from({ length: m }, (_, i) => { const t = (i / m) * Math.PI * 2; return [o[0] + u[0] * r * Math.cos(t), o[1] + u[1] * r * Math.cos(t), z + r * Math.sin(t)] as V3 })
        for (let i = 1; i < m - 1; i++) P.gold.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
      }
    } else if (s[0] === 'star') star(c, s[1], s[2])
  }
}

// ---------------------------------------------------------------- the rest

type Wall = { id: string; h: number; rings: XY[][] }
type Tower = { id: string; name: string; h: number; outline: XY[]; base: { id: string; h: number; roof: string; ring: XY[] }[] }
type Building = { id: string; name: string; h: number; outer: XY[][]; holes: XY[][] }

/** Eave height, roof rise and wall colour of each building outline; the rest are small service buildings. */
const BUILDINGS: Record<string, { h: number; rh: number; m: Mat }> = {
  'relation/51497': { h: 20, rh: 4, m: 'ochre' }, // Arsenal
  'relation/225033': { h: 23, rh: 4, m: 'ochre' }, // Grand Kremlin Palace (with the Terem Palace)
  'relation/1359233': { h: 20, rh: 4, m: 'ochre' }, // Senate
  'relation/1359243': { h: 19.5, rh: 4, m: 'white' }, // Archangel Cathedral
  'relation/1359248': { h: 17, rh: 2.5, m: 'white' }, // Patriarch's Palace
  'relation/1359249': { h: 19, rh: 2, m: 'white' }, // Church of the Twelve Apostles
  'relation/1359251': { h: 12, rh: 3, m: 'white' }, // Annunciation Cathedral
  'relation/1359278': { h: 30, rh: 2.5, m: 'white' }, // Assumption Belfry and Filaret annex
  'relation/1359281': { h: 13, rh: 0, m: 'white' }, // Ivan the Great's base and annex
  'relation/1359335': { h: 20, rh: 3.5, m: 'ochre' }, // Armoury
  'relation/1359337': { h: 15, rh: 3, m: 'ochre' }, // Amusement Palace
  'relation/3028585': { h: 20, rh: 4.5, m: 'white' }, // Assumption Cathedral
  'relation/3031379': { h: 20, rh: 0, m: 'white' }, // State Kremlin Palace
  'relation/3062894': { h: 7.5, rh: 0, m: 'brick' }, // Trinity bridge masonry
  'relation/3272132': { h: 10, rh: 2.5, m: 'ochre' },
  'relation/3349391': { h: 9, rh: 2.5, m: 'ochre' },
  'relation/3349392': { h: 20, rh: 3.5, m: 'ochre' }, // administration building (Corpus 1's neighbour)
  'relation/3427788': { h: 12, rh: 3, m: 'ochre' },
  'relation/1360650': { h: 13, rh: 3, m: 'ochre' }, // by the Trinity gate
  'relation/1360646': { h: 8, rh: 0, m: 'brick' }, // Trinity gate's bridge end
  'relation/1360662': { h: 8, rh: 0, m: 'brick' }, // Nikolskaya's gate annex
  'relation/1360670': { h: 8, rh: 0, m: 'brick' }, // by the Senate tower
  'relation/1360694': { h: 10, rh: 0, m: 'brick' }, // Constantine and Helena's forework
  'relation/16454316': { h: 6, rh: 1.5, m: 'ochre' },
  'relation/3341858': { h: 6, rh: 1.5, m: 'ochre' },
}
/** Wall stretches mapped without a height. */
const WALL_H: Record<string, number> = { 'relation/1360629': 14, 'relation/2470049': 14, 'relation/3233168': 11 }

function build(D: { walls: Wall[]; towers: Tower[]; buildings: Building[] }) {
  // Walls: each stretch to its mapped height, half a metre under the merlons.
  const wallH = (w: Wall) => (w.h || WALL_H[w.id] || 12) - 0.5
  for (const w of D.walls) for (const r of w.rings) prism(P.brick, LOW ? simplify(ccw(r), 1.5) : r, 0, wallH(w))

  // Merlons along the outer face of the ring of walls and towers.
  const towerRings = D.towers.flatMap((t) => [t.outline, ...t.base.map((b) => b.ring)])
  // Grown half a metre, so stretches mapped with hairline gaps still join into one ring.
  const all = [...D.walls.flatMap((w) => w.rings), ...towerRings].map((r) => { const g = offset(ccw(r), 0.5); return [[...g, g[0]]] }) as any[]
  const union = clipping.union(all[0], ...all.slice(1)) as unknown as XY[][][]
  const biggest = union.sort((p, q) => Math.abs(area(q[0])) - Math.abs(area(p[0])))[0]
  const face = ccw(biggest[0].slice(0, -1))
  const PITCH = 4.2, MW = 2.3, MH = 2.5, NOTCH = 0.8, DEPTH = 0.8
  let carry = PITCH / 2
  for (let i = 0; i < (LOW ? 0 : face.length); i++) {
    const a = face[i], b = face[(i + 1) % face.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 1e-6) continue
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]] // outward
    for (let s = carry; s < L; s += PITCH) {
      carry = s + PITCH - L
      if (s < MW / 2 || s > L - MW / 2) continue
      const m: XY = [a[0] + t[0] * s - n[0] * 0.5, a[1] + t[1] * s - n[1] * 0.5] // back on the real face
      const q: XY = [m[0] - n[0] * 1.2, m[1] - n[1] * 1.2]
      if (towerRings.some((r) => inside(q, r) || inside(m, r))) continue
      const w = D.walls.find((w) => w.rings.some((r) => inside(q, r)))
      if (!w) continue
      const z = wallH(w)
      const shape: XY[][] = [[[-MW / 2, 0], [MW / 2, 0], [0, MH - NOTCH]], [[MW / 2, 0], [MW / 2, MH], [0, MH - NOTCH]], [[-MW / 2, 0], [0, MH - NOTCH], [-MW / 2, MH]]]
      for (const [off, dir] of [[0, 1], [-DEPTH, -1]] as [number, number][]) {
        const nn: V3 = [n[0] * dir, n[1] * dir, 0]
        const W = ([u, v]: XY): V3 => [m[0] + t[0] * u + n[0] * off, m[1] + t[1] * u + n[1] * off, z + v]
        for (const [p0, p1, p2] of shape) P.brick.tri(W(p0), W(p1), W(p2), undefined, undefined, undefined, [nn, nn, nn])
      }
    }
    if (carry < 0) carry = PITCH / 2
  }

  for (const t of D.towers) {
    if (t.id === 'relation/3061015') {
      // Kutafya: the white openwork crown on a low brick barbican.
      prism(P.brick, t.outline, 0, 11, null)
      prism(P.white, offset(ccw(t.outline), 0.25), 11, 13.5, P.white, true)
      continue
    }
    buildTower(t)
  }

  for (const b of D.buildings) {
    const spec = BUILDINGS[b.id] ?? { h: b.h || 4, rh: 1.2, m: 'ochre' as Mat }
    // The low model: coarser outlines, small buildings under a flat roof, and no sheds or booths.
    if (LOW && !BUILDINGS[b.id] && Math.abs(area(b.outer[0])) < 150) continue
    const rh = LOW && Math.abs(area(b.outer[0])) < 400 ? 0 : spec.rh
    const holes = LOW ? b.holes.map((r) => simplify(r, 2.5)) : b.holes
    b.outer.map((r) => (LOW ? simplify(r, 2.5) : r)).forEach((o, k) => block(P[spec.m], spec.rh === 0 ? P[spec.m] : P.green, o, k === 0 ? holes : [], spec.h, rh))
  }


  // Ivan the Great: three octagons, a drum, the great gold dome.
  const iv: XY = [44.6, -86.8]
  prism(P.white, poly(iv, 8.0, 0.3, 8), 13, 25, null)
  prism(P.white, poly(iv, 8.3, 0.3, 8), 25, 26.2, P.white, true)
  prism(P.white, poly(iv, 5.5, 0.3, 8), 26.2, 46, null)
  prism(P.white, poly(iv, 5.8, 0.3, 8), 46, 46.8, P.white, true)
  prism(P.white, poly(iv, 4.55, 0.3, 8), 46.8, 52.5, null)
  prism(P.gold, poly(iv, 4.75, 0.3, 8), 52.5, 53.3, P.gold, true)
  onion(iv, 3.95, 53.3, 65.5, 4.5, 76, 'gold', 12)
  spike(iv, 75.5, 81, 0.35, 'gold')
  // Assumption Belfry: the domed belfry tower and the Filaret annex's tent.
  const bf: XY = [37.8, -67.4]
  prism(P.white, poly(bf, 4.75, 0.28, 4), 32.5, 41, null)
  onion(bf, 4.0, 41, 49.5, 4.3, 57.5, 'gold', 12)
  prism(P.white, poly([30.2, -53.2], 3.4, 0.28, 8), 32.5, 34, null)
  loft(P.green, poly([30.2, -53.2], 3.4, 0.28, 8), 34, [30.2, -53.2], 44)

  // Assumption Cathedral: five gold domes.
  onion([-24.1, -62.3], 3.3, 22, 30.5, 4.9, 40.4, 'gold', 12)
  for (const c of [[-13.7, -68.3], [-30.1, -72.9], [-18.3, -51.8], [-34.9, -56.5]] as XY[]) onion(c, 2.9, 22, 26.5, 4.0, 33.6, 'gold', 10)
  // Archangel: gold centre, four silver.
  onion([20.1, -144.0], 2.9, 21, 32, 3.4, 39.5, 'gold', 10)
  for (const c of [[15.3, -152.5], [26.9, -151.0], [24.8, -135.3], [13.3, -136.8]] as XY[]) onion(c, 2.45, 21, 29.5, 2.6, 35.5, 'white', 8)
  // Annunciation: nine gold domes in three rings.
  onion([-37.8, -162.7], 1.8, 14, 22.5, 2.3, 27.5, 'gold', 8)
  for (const c of [[-42.9, -159.3], [-40.6, -168.0], [-32.5, -166.0], [-34.9, -157.2]] as XY[]) onion(c, 1.35, 14, 21, 1.7, 24.8, 'gold', 6)
  if (!LOW) for (const c of [[-30.5, -169.7], [-48.2, -156.9], [-36.3, -153.5], [-44.2, -173.1]] as XY[]) onion(c, 1.1, 13, 17, 1.4, 20.5, 'gold', 6)
  // Twelve Apostles: five silver domes on the Patriarch's Palace.
  if (!LOW) onion([-4.4, -15.3], 2.2, 20, 27, 2.9, 32, 'white', 8)
  if (!LOW) for (const c of [[2.5, -16.8], [-0.7, -9.4], [-11.1, -14.1], [-8.0, -21.4]] as XY[]) onion(c, 1.7, 20, 25, 2.2, 29, 'white', 6)
  // The Upper Saviour Cathedral's gold domes on the Terem Palace.
  for (const c of (LOW ? [] : [[-80.2, -94.8], [-81.4, -88.0], [-82.6, -81.2], [-77.4, -97.7], [-85.4, -78.4]]) as XY[]) onion(c, 1.2, 25, 27.5, 1.7, 31, 'gold', 6)

  // Grand Kremlin Palace: the belvedere over the river front, green roof, gold crown.
  const gk: XY = [-107.5, -188.3], ga = 0.28
  prism(P.ochre, poly(gk, 13.5, ga, 4), 23, 30, null)
  loft(P.green, poly(gk, 13.5, ga, 4), 30, poly(gk, 9.5, ga, 4), 34)
  loft(P.green, poly(gk, 9.5, ga, 4), 34, poly(gk, 3.2, ga, 4), 36.5)
  cap(P.green, poly(gk, 3.2, ga, 4), [], 36.5)
  prism(P.gold, ngon(gk[0], gk[1], 2.6, 8, 0), 36.5, 39)

  // Senate: the green dome over the Catherine Hall and the small west dome.
  const sd: XY = [104.9, 191.5]
  prism(P.ochre, ngon(sd[0], sd[1], 13.5, 16, 0), 20, 25, null)
  prism(P.white, ngon(sd[0], sd[1], 13.9, 16, 0), 25, 25.8, P.white, true)
  lathe(P.green, [[13, 25.8], [12.4, 29.5], [10.6, 33.2], [7.6, 36.2], [3.4, 38.5], [2.4, 38.8]], LOW ? 10 : 16, sd, 0)
  prism(P.ochre, ngon(sd[0], sd[1], 2.4, 8, 0), 38.8, 41, null)
  loft(P.green, ccw(ngon(sd[0], sd[1], 2.6, 8, 0)), 41, sd, 43)
  lathe(P.green, [[6.6, 24], [6.2, 27], [4.6, 30], [2, 31.7], [0, 32]], LOW ? 8 : 12, [32.8, 193.2], 0)
}

const lit = (_p: V3, n: V3) => (n[2] > 0.8 ? 0.3 : 0.85)

export async function main() {
  const D = DATA as unknown as { walls: Wall[]; towers: Tower[]; buildings: Building[] }
  for (const [file, low, maxTris, maxBytes] of [['moscow-kremlin.glb', true, 6500, 250 * 1024], ['moscow-kremlin.detail.glb', false, 40000, 1536 * 1024]] as const) {
    P = fresh()
    LOW = low
    build(D)
    const parts: Array<{ part: Part; material: MaterialSpec }> = [
      { part: P.brick, material: { ...finish('kremlin-brick', 0xbd5a46), floodlight: lit } },
      { part: P.white, material: { ...PALETTE.stone, color: 0xf3ede3, floodlight: lit } },
      { part: P.ochre, material: { ...finish('kremlin-ochre', 0xe6c584), floodlight: lit } },
      { part: P.green, material: { ...finish('kremlin-green', 0x67a088), floodlight: (_p, n) => (n[2] > 0.8 ? 0.2 : 0.6) } },
      { part: P.gold, material: { ...finish('kremlin-gold', 0xd9b04a, 0.45), floodlight: () => 0.9 } },
      { part: P.star, material: finish('neon-kremlin-star', 0xc8322d, 0.4) },
    ]
    const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
    const glb = writeGlb('Moscow Kremlin', parts, {
      license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 0, elevation: 0, height: 81,
    })
    console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`, Object.fromEntries(Object.entries(P).map(([k, v]) => [k, v.triangles])))
    if ((triangles > maxTris || glb.length > maxBytes)) throw new Error(`${file}: over budget`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url).pathname, glb)
  }
}

// OSM outlines and parts in metres about the anchor, simplified (see the header).
const DATA = {"walls": [{"id": "relation/1360629", "h": 0, "rings": [[[-304.86, -263.58], [-303.89, -263.73], [-303.13, -259.26], [-286.83, -244.04], [-289.75, -240.81], [-289.08, -234.45], [-290.49, -232.74], [-296.07, -238.75], [-296.39, -239.92], [-303.92, -237.87], [-309.24, -269.72], [-315.83, -274.05], [-317.47, -278.86], [-316.78, -279.14], [-306.33, -272.58], [-305.88, -269.83]]]}, {"id": "relation/2470033", "h": 14.0, "rings": [[[-180.64, 57.63], [-180.08, 57.51], [-176.39, 73.93], [-180.77, 75.18], [-183.91, 61.45], [-244.19, -93.07], [-239.26, -95.04], [-194.34, 19.07], [-195.45, 19.49], [-185.04, 46.43]]]}, {"id": "relation/2470034", "h": 12.0, "rings": [[[256.44, 80.27], [252.67, 78.87], [269.1, 38.31], [273.02, 39.55]]]}, {"id": "relation/2470036", "h": 9.0, "rings": [[[277.74, -199.74], [277.6, -194.37], [250.59, -196.14], [180.91, -204.87], [181.62, -210.12], [235.13, -202.8]]]}, {"id": "relation/2470037", "h": 9.0, "rings": [[[11.91, -237.25], [-35.92, -243.12], [-104.86, -277.21], [-142.9, -304.22], [-140.3, -308.35], [-101.84, -281.05], [-102.3, -280.42], [-37.49, -248.53], [13.35, -242.29]]]}, {"id": "relation/2470038", "h": 9.0, "rings": [[[85.39, -226.9], [83.97, -221.56], [30.57, -232.92], [32.01, -238.03]]]}, {"id": "relation/2470039", "h": 12.0, "rings": [[[254.76, 84.73], [246.54, 104.24], [243.84, 101.32], [251.0, 83.34]]]}, {"id": "relation/2470041", "h": 9.0, "rings": [[[171.78, -206.75], [141.59, -213.2], [127.91, -215.36], [94.27, -217.23], [95.7, -222.63], [128.48, -220.84], [142.4, -218.62], [172.54, -212.35]]]}, {"id": "relation/2470042", "h": 12.0, "rings": [[[296.77, -31.08], [282.98, 5.68], [275.33, 30.93], [269.66, 29.14], [292.65, -32.86]]]}, {"id": "relation/2470043", "h": 14.0, "rings": [[[-243.01, -104.37], [-248.13, -102.31], [-299.01, -228.58], [-293.66, -230.05], [-278.64, -193.03]]]}, {"id": "relation/2470047", "h": 9.0, "rings": [[[-151.26, -310.92], [-243.97, -370.01], [-290.7, -311.4], [-302.23, -292.13], [-305.76, -294.19], [-294.14, -313.7], [-247.74, -373.29], [-243.77, -371.97], [-240.05, -373.49], [-148.53, -315.25]]]}, {"id": "relation/2470048", "h": 12.0, "rings": [[[133.89, 219.08], [131.21, 216.19], [231.1, 112.82], [233.78, 115.72], [232.74, 116.77]]]}, {"id": "relation/2470049", "h": 0, "rings": [[[-171.13, 92.92], [-166.68, 108.08], [-118.69, 236.35], [-121.09, 237.23], [-120.02, 240.13], [-121.83, 240.8], [-170.97, 109.48], [-175.91, 94.3]]]}, {"id": "relation/2470050", "h": 12.0, "rings": [[[18.98, 322.6], [16.17, 319.78], [123.64, 222.36], [126.35, 225.28], [110.2, 240.26]]]}, {"id": "relation/3233168", "h": 0, "rings": [[[352.72, -193.73], [353.34, -197.02], [353.89, -194.01], [355.67, -192.51], [354.42, -185.54], [335.82, -142.55], [303.89, -44.63], [299.76, -46.44], [301.03, -50.51], [331.6, -144.08], [350.29, -187.31], [350.98, -190.09], [315.58, -194.11], [286.32, -194.15], [286.46, -199.51], [305.43, -200.03], [321.78, -199.07], [351.61, -193.94]]]}, {"id": "relation/3272131", "h": 12.0, "rings": [[[3.72, 331.47], [5.56, 329.64], [8.38, 332.48], [-55.87, 396.85], [-58.29, 395.37], [-60.91, 394.89], [-63.93, 395.58], [-118.29, 250.28], [-116.51, 249.63], [-115.51, 252.34], [-113.08, 251.46], [-60.42, 392.22], [-57.53, 392.83]]]}], "towers": [{"id": "relation/1359372", "name": "Nicholskaya Tower", "h": 70.4, "outline": [[26.96, 330.13], [26.03, 331.06], [34.02, 338.65], [24.58, 347.95], [17.05, 339.89], [16.19, 340.73], [4.98, 329.07], [15.3, 318.91]], "base": [{"id": "relation/8893364", "h": 24.0, "roof": "pyramidal", "ring": [[16.18, 340.3], [4.98, 329.07], [15.3, 318.91], [26.51, 330.14], [25.18, 331.43]]}, {"id": "relation/8893369", "h": 18.0, "roof": "flat", "ring": [[34.02, 338.65], [24.58, 347.95], [16.83, 339.67], [25.81, 330.83], [26.03, 331.06]]}]}, {"id": "relation/1359374", "name": "Senate Tower", "h": 34.0, "outline": [[122.94, 221.61], [130.13, 215.02], [135.84, 221.17], [128.65, 227.76], [127.53, 226.56]], "base": [{"id": "relation/2763538", "h": 16.0, "roof": "flat", "ring": [[122.94, 221.61], [130.13, 215.02], [135.84, 221.17], [128.65, 227.76], [127.53, 226.56]]}]}, {"id": "relation/1360627", "name": "Trinity Tower", "h": 80.0, "outline": [[-176.91, 94.58], [-177.28, 93.35], [-188.55, 96.91], [-188.92, 95.6], [-190.05, 95.92], [-190.17, 95.52], [-197.64, 97.67], [-197.51, 98.11], [-198.94, 98.52], [-199.3, 97.33], [-198.95, 97.23], [-203.41, 82.9], [-194.41, 80.61], [-193.41, 80.02], [-193.85, 78.5], [-191.93, 77.93], [-191.81, 78.34], [-176.39, 73.93], [-176.53, 73.45], [-174.56, 72.89], [-173.95, 74.98], [-174.36, 75.1], [-173.21, 79.07], [-172.76, 78.95], [-170.82, 85.66], [-171.31, 85.79], [-169.28, 91.65], [-171.15, 92.17], [-170.96, 92.87], [-171.57, 93.04]], "base": [{"id": "relation/3061016", "h": 20.0, "roof": "", "ring": [[-176.91, 94.58], [-177.28, 93.35], [-188.55, 96.91], [-188.92, 95.6], [-190.05, 95.92], [-190.17, 95.52], [-197.64, 97.67], [-197.51, 98.11], [-198.94, 98.52], [-199.3, 97.33], [-198.95, 97.23], [-203.41, 82.9], [-194.41, 80.61], [-193.41, 80.02], [-193.85, 78.5], [-191.93, 77.93], [-191.81, 78.34], [-176.39, 73.93], [-176.53, 73.45], [-174.56, 72.89], [-173.95, 74.98], [-174.36, 75.1], [-173.21, 79.07], [-172.76, 78.95], [-170.82, 85.66], [-171.31, 85.79], [-169.28, 91.65], [-171.15, 92.17], [-170.96, 92.87], [-175.91, 94.3]]}, {"id": "relation/3271450", "h": 23.0, "roof": "", "ring": [[-190.05, 95.92], [-190.17, 95.52], [-197.64, 97.67], [-197.51, 98.11], [-198.94, 98.52], [-199.3, 97.33], [-198.95, 97.23], [-203.41, 82.9], [-193.41, 80.02], [-193.19, 80.77], [-192.53, 80.59], [-188.47, 94.71], [-189.13, 94.89], [-188.92, 95.6]]}, {"id": "relation/3271451", "h": 33.5, "roof": "flat", "ring": [[-188.92, 95.6], [-189.13, 94.89], [-188.47, 94.71], [-191.61, 83.68], [-192.53, 80.59], [-193.19, 80.77], [-193.85, 78.5], [-191.93, 77.93], [-191.81, 78.34], [-176.39, 73.93], [-176.53, 73.45], [-174.56, 72.89], [-173.95, 74.98], [-174.36, 75.1], [-173.21, 79.07], [-172.76, 78.95], [-170.82, 85.66], [-171.31, 85.79], [-169.28, 91.65], [-171.15, 92.17], [-171.31, 91.62], [-188.55, 96.91]]}]}, {"id": "relation/1360630", "name": "Borovitskaya Tower", "h": 54.0, "outline": [[-311.6, -275.94], [-316.78, -279.14], [-317.47, -278.86], [-320.86, -287.02], [-314.06, -297.65], [-314.35, -297.82], [-313.61, -299.09], [-302.23, -292.13], [-311.22, -277.01]], "base": [{"id": "relation/3047138", "h": 15.5, "roof": "flat", "ring": [[-308.81, -281.12], [-317.07, -285.96], [-320.07, -284.86], [-320.86, -287.02], [-314.06, -297.65], [-314.35, -297.82], [-313.61, -299.09], [-302.23, -292.13], [-304.19, -288.85]]}]}, {"id": "relation/1360631", "name": "Armoury Tower", "h": 32.65, "outline": [[-298.05, -228.84], [-303.36, -227.4], [-306.1, -237.27], [-296.39, -239.92], [-293.66, -230.05]], "base": [{"id": "relation/3047225", "h": 18.5, "roof": "flat", "ring": [[-303.92, -237.87], [-296.39, -239.92], [-293.66, -230.05], [-303.36, -227.4], [-306.1, -237.27]]}]}, {"id": "relation/1360642", "name": "First Unnamed Tower", "h": 34.15, "outline": [[85.82, -229.14], [96.88, -226.25], [93.74, -214.4], [82.68, -217.29]], "base": [{"id": "relation/3229393", "h": 10.5, "roof": "flat", "ring": [[93.58, -214.61], [82.87, -217.41], [85.92, -228.9], [96.62, -226.1], [95.7, -222.63]]}]}, {"id": "relation/1360645", "name": "Constantine and Helen Tower", "h": 36.8, "outline": [[312.94, -41.06], [306.47, -26.55], [292.28, -32.71], [298.74, -47.22]], "base": [{"id": "relation/3229904", "h": 12.5, "roof": "flat", "ring": [[292.65, -32.86], [298.87, -46.83], [312.56, -40.9], [306.35, -26.94], [296.77, -31.08]]}]}, {"id": "relation/1360648", "name": "\u0412\u043e\u0434\u043e\u0432\u0437\u0432\u043e\u0434\u043d\u0430\u044f \u0431\u0430\u0448\u043d\u044f", "h": 61.25, "outline": [[-240.28, -372.89], [-242.53, -371.86], [-244.99, -371.75], [-247.39, -372.65], [-249.14, -374.27], [-250.18, -376.49], [-250.28, -378.96], [-249.44, -381.25], [-247.76, -383.06], [-245.53, -384.11], [-243.05, -384.21], [-240.72, -383.36], [-238.89, -381.7], [-237.85, -379.47], [-237.75, -377.0], [-238.59, -374.71]], "base": [{"id": "way/228096087", "h": 22.5, "roof": "flat", "ring": [[-245.32, -383.3], [-243.18, -383.39], [-241.15, -382.65], [-239.56, -381.21], [-238.66, -379.28], [-238.57, -377.15], [-239.31, -375.13], [-240.77, -373.56], [-242.72, -372.67], [-244.87, -372.57], [-246.89, -373.31], [-248.47, -374.76], [-249.37, -376.69], [-249.46, -378.83], [-248.73, -380.82], [-247.28, -382.4]]}, {"id": "relation/16265108", "h": 30.0, "roof": "pyramidal", "ring": [[-248.47, -382.04], [-246.57, -383.43], [-244.27, -383.99], [-241.94, -383.64], [-239.93, -382.41], [-238.53, -380.52], [-237.97, -378.24], [-238.33, -375.93], [-239.56, -373.92], [-241.47, -372.53], [-243.77, -371.97], [-246.09, -372.34], [-248.11, -373.56], [-249.5, -375.44], [-250.06, -377.73], [-249.83, -379.55]]}]}, {"id": "relation/1360651", "name": "Beklemishevskaya Tower", "h": 46.2, "outline": [[360.16, -200.32], [361.54, -198.9], [362.27, -197.08], [362.24, -195.11], [361.45, -193.31], [360.03, -191.93], [358.18, -191.22], [356.2, -191.25], [354.39, -192.03], [353.01, -193.45], [352.28, -195.27], [352.31, -197.24], [353.11, -199.04], [354.53, -200.42], [356.37, -201.13], [358.35, -201.1]], "base": [{"id": "relation/3229747", "h": 21.0, "roof": "flat", "ring": [[354.38, -193.39], [353.53, -194.71], [353.25, -196.25], [353.58, -197.76], [355.8, -199.9], [358.88, -199.84], [360.17, -198.96], [361.02, -197.64], [361.3, -196.1], [360.96, -194.58], [360.08, -193.29], [358.75, -192.45], [355.67, -192.51]]}, {"id": "relation/3229749", "h": 13.0, "roof": "pyramidal", "ring": [[360.16, -200.32], [361.54, -198.9], [362.27, -197.08], [362.24, -195.11], [361.45, -193.31], [360.03, -191.93], [358.18, -191.22], [356.2, -191.25], [354.39, -192.03], [353.01, -193.45], [352.28, -195.27], [352.31, -197.24], [353.11, -199.04], [354.53, -200.42], [356.37, -201.13], [358.35, -201.1]]}]}, {"id": "relation/1360653", "name": "Corner Arsenal Tower", "h": 60.0, "outline": [[-60.91, 394.01], [-57.98, 394.53], [-55.46, 395.97], [-53.51, 398.28], [-52.51, 401.05], [-52.52, 404.0], [-53.55, 406.78], [-55.46, 409.02], [-58.04, 410.49], [-60.97, 410.99], [-63.89, 410.47], [-66.46, 408.99], [-68.36, 406.72], [-69.37, 403.95], [-69.36, 401.0], [-68.33, 398.23], [-66.41, 395.98], [-64.25, 394.74]], "base": [{"id": "relation/3267619", "h": 34.0, "roof": "pyramidal", "ring": [[-60.91, 394.01], [-57.98, 394.53], [-55.46, 395.97], [-53.51, 398.28], [-52.51, 401.05], [-52.52, 404.0], [-53.55, 406.78], [-55.46, 409.02], [-58.04, 410.49], [-60.97, 410.99], [-63.89, 410.47], [-66.46, 408.99], [-68.36, 406.72], [-69.37, 403.95], [-69.36, 401.0], [-68.33, 398.23], [-66.41, 395.98], [-64.25, 394.74]]}]}, {"id": "relation/1360654", "name": "Middle Arsenal Tower", "h": 28.9, "outline": [[-121.09, 237.23], [-118.69, 236.35], [-113.08, 251.46], [-115.51, 252.34], [-116.29, 250.24], [-122.85, 252.64], [-126.82, 241.9], [-120.25, 239.5]], "base": [{"id": "relation/3272348", "h": 17.0, "roof": "flat", "ring": [[-118.29, 250.28], [-122.45, 251.81], [-125.97, 242.31], [-117.62, 239.25], [-114.09, 248.75]]}]}, {"id": "relation/1360655", "name": "Commandant\u2019s Tower", "h": 41.25, "outline": [[-243.86, -93.2], [-247.5, -91.74], [-251.28, -101.05], [-243.01, -104.37], [-239.26, -95.04]], "base": [{"id": "relation/3047295", "h": 22.5, "roof": "flat", "ring": [[-245.68, -92.46], [-249.47, -101.78], [-243.01, -104.37], [-239.26, -95.04]]}, {"id": "relation/3047297", "h": 10.0, "roof": "gabled", "ring": [[-248.13, -102.31], [-247.64, -102.51], [-243.86, -93.2], [-247.5, -91.74], [-251.28, -101.05]]}]}, {"id": "relation/1360656", "name": "Saviour Tower", "h": 71.0, "outline": [[251.76, 114.85], [251.41, 115.17], [255.46, 119.54], [255.78, 119.25], [257.03, 120.6], [250.05, 126.47], [250.31, 126.75], [248.9, 128.03], [244.82, 123.01], [242.54, 121.24], [240.52, 123.67], [239.28, 122.32], [239.62, 122.02], [230.85, 112.55], [230.55, 112.82], [229.3, 111.47], [232.44, 109.07], [232.79, 109.46], [240.05, 102.82], [239.78, 102.55], [242.58, 99.45], [252.24, 110.36], [252.53, 110.1], [253.77, 111.45], [250.74, 113.75]], "base": [{"id": "relation/3271042", "h": 14.0, "roof": "", "ring": [[250.05, 126.47], [250.31, 126.75], [248.9, 128.03], [244.82, 123.01], [242.54, 121.24], [250.74, 113.75], [251.76, 114.85], [251.41, 115.17], [255.46, 119.54], [255.78, 119.25], [257.03, 120.6]]}, {"id": "relation/3271043", "h": 28.5, "roof": "flat", "ring": [[240.52, 123.67], [239.28, 122.32], [239.62, 122.02], [230.85, 112.55], [230.55, 112.82], [229.3, 111.47], [232.44, 109.07], [232.79, 109.46], [240.05, 102.82], [239.78, 102.55], [242.58, 99.45], [252.24, 110.36], [252.53, 110.1], [253.77, 111.45], [252.36, 112.74], [252.12, 112.48], [242.54, 121.24]]}]}, {"id": "relation/1360660", "name": "Peter's Tower", "h": 27.15, "outline": [[286.71, -193.71], [277.19, -193.96], [277.49, -205.69], [287.01, -205.45]], "base": [{"id": "relation/3229626", "h": 11.0, "roof": "flat", "ring": [[286.32, -194.15], [277.6, -194.37], [277.89, -205.28], [286.6, -205.06], [286.46, -199.51]]}]}, {"id": "relation/1360661", "name": "Alarm Bell Tower", "h": 38.0, "outline": [[268.96, 38.71], [266.32, 37.86], [269.3, 28.57], [278.67, 31.52], [275.68, 40.81]], "base": [{"id": "relation/3890580", "h": 12.0, "roof": "flat", "ring": [[266.8, 37.6], [269.52, 29.09], [278.18, 31.82], [275.47, 40.33], [269.1, 38.31]]}]}, {"id": "relation/1360663", "name": "Tsar's Tower", "h": 16.0, "outline": [[251.0, 83.34], [252.67, 78.87], [256.44, 80.27], [254.76, 84.73], [253.82, 84.38]], "base": []}, {"id": "relation/3061015", "name": "Kutafya Tower", "h": 13.5, "outline": [[-286.84, 106.65], [-287.17, 106.74], [-286.66, 108.57], [-286.32, 108.47], [-284.6, 116.05], [-284.3, 115.97], [-283.55, 118.77], [-297.28, 122.45], [-301.85, 122.36], [-304.93, 120.66], [-306.57, 121.09], [-308.59, 113.17], [-306.96, 112.79], [-305.3, 109.77], [-302.19, 107.92], [-287.67, 103.76]], "base": [{"id": "relation/408550", "h": 13.5, "roof": "", "ring": [[-286.84, 106.65], [-287.17, 106.74], [-286.66, 108.57], [-286.32, 108.47], [-284.6, 116.05], [-284.3, 115.97], [-283.55, 118.77], [-297.28, 122.45], [-301.85, 122.36], [-304.93, 120.66], [-306.57, 121.09], [-308.59, 113.17], [-306.96, 112.79], [-305.3, 109.77], [-302.19, 107.92], [-287.67, 103.76]]}]}, {"id": "relation/3229147", "name": "Secret Tower", "h": 38.4, "outline": [[14.88, -249.91], [34.45, -244.43], [29.99, -228.69], [10.42, -234.15]], "base": [{"id": "relation/3229149", "h": 10.0, "roof": "flat", "ring": [[29.56, -229.36], [11.13, -234.52], [15.32, -249.22], [33.72, -244.07], [31.75, -237.11]]}]}, {"id": "relation/3229300", "name": "Annunciation Tower", "h": 30.7, "outline": [[-142.78, -303.82], [-152.33, -309.76], [-147.19, -317.92], [-137.64, -311.98]], "base": [{"id": "relation/3229302", "h": 10.0, "roof": "flat", "ring": [[-147.09, -317.55], [-138.05, -311.92], [-142.9, -304.22], [-151.94, -309.84], [-151.26, -310.92]]}]}, {"id": "relation/3229567", "name": "Second Unnamed Tower", "h": 30.2, "outline": [[172.46, -214.75], [182.48, -213.41], [181.27, -204.46], [171.25, -205.8]], "base": [{"id": "relation/3229569", "h": 11.0, "roof": "flat", "ring": [[180.91, -204.87], [171.69, -206.1], [172.8, -214.35], [182.03, -213.11], [181.62, -210.12]]}]}], "buildings": [{"id": "way/247986321", "name": "", "h": 2.0, "outer": [[[-196.67, -316.5], [-197.71, -314.69], [-200.23, -316.11], [-199.2, -317.91]]], "holes": []}, {"id": "way/247986327", "name": "", "h": 5.0, "outer": [[[-227.87, -343.5], [-222.72, -351.63], [-167.11, -316.81], [-172.26, -308.69]]], "holes": []}, {"id": "way/248468851", "name": "", "h": 3.0, "outer": [[[-306.44, -282.21], [-304.41, -281.85], [-304.74, -280.0], [-306.77, -280.35]]], "holes": []}, {"id": "way/248844324", "name": "", "h": 3.0, "outer": [[[-176.49, -213.84], [-176.7, -212.2], [-178.59, -212.45], [-178.38, -214.08]]], "holes": []}, {"id": "way/248844325", "name": "", "h": 3.0, "outer": [[[-217.34, -210.05], [-217.06, -208.43], [-218.93, -208.11], [-219.22, -209.74]]], "holes": []}, {"id": "way/534095307", "name": "", "h": 0.0, "outer": [[[145.44, 104.54], [150.62, 110.4], [147.07, 113.49], [141.89, 107.63]]], "holes": []}, {"id": "way/534095308", "name": "", "h": 0.0, "outer": [[[133.15, 41.02], [129.45, 44.82], [123.15, 37.35], [126.15, 34.29]]], "holes": []}, {"id": "way/534095309", "name": "", "h": 0.0, "outer": [[[125.68, 70.73], [129.11, 73.85], [125.4, 77.88], [121.97, 74.75]]], "holes": []}, {"id": "way/534095310", "name": "", "h": 0.0, "outer": [[[138.78, 85.33], [140.62, 87.2], [143.22, 84.66], [146.39, 87.86], [143.79, 90.39], [145.78, 92.41], [142.63, 95.48], [135.64, 88.4]]], "holes": []}, {"id": "way/534095311", "name": "", "h": 0.0, "outer": [[[105.19, 91.84], [108.93, 95.47], [105.45, 99.02], [101.7, 95.39]]], "holes": []}, {"id": "way/534095312", "name": "", "h": 0.0, "outer": [[[213.13, 96.98], [219.34, 102.52], [216.26, 105.92], [210.06, 100.38]]], "holes": []}, {"id": "way/534095313", "name": "", "h": 0.0, "outer": [[[190.85, 96.6], [197.16, 103.81], [194.39, 106.21], [188.08, 98.99]]], "holes": []}, {"id": "way/534437577", "name": "", "h": 0.0, "outer": [[[67.81, 85.63], [74.34, 91.65], [70.3, 95.97], [67.39, 93.28], [65.52, 95.28], [61.9, 91.94]]], "holes": []}, {"id": "way/535145289", "name": "\u041c\u0443\u0437\u0435\u0439\u043d\u044b\u0439 \u043c\u0430\u0433\u0430\u0437\u0438\u043d", "h": 0.0, "outer": [[[-56.85, 1.75], [-42.28, -1.36], [-41.44, 2.58], [-56.01, 5.67]]], "holes": []}, {"id": "way/1204092263", "name": "", "h": 0.0, "outer": [[[-225.55, -350.64], [-232.4, -355.56], [-230.68, -357.92], [-223.83, -353.0]]], "holes": []}, {"id": "way/1214065860", "name": "", "h": 0.0, "outer": [[[-32.1, -0.55], [-23.2, 3.09], [-26.73, 11.6], [-35.63, 7.96]]], "holes": []}, {"id": "relation/51497", "name": "Arsenal", "h": 24.0, "outer": [[[-131.51, 107.5], [-75.59, 115.93], [-38.82, 215.84], [-35.16, 214.51], [-29.33, 230.36], [-33.0, 231.69], [3.72, 331.47], [-57.53, 392.83], [-60.42, 392.22], [-166.68, 108.08], [-159.82, 103.23]]], "holes": [[[-73.9, 204.33], [-68.91, 202.55], [-92.75, 137.72], [-131.04, 131.46], [-101.16, 214.05], [-95.96, 212.19], [-74.57, 271.22], [-79.8, 273.08], [-51.05, 352.55], [-24.38, 325.73], [-47.57, 261.58], [-52.56, 263.37], [-68.36, 219.66]]]}, {"id": "relation/225033", "name": "Grand Kremlin Palace", "h": 0.0, "outer": [[[-107.35, -88.53], [-161.76, -99.97], [-157.19, -77.7], [-176.66, -73.75], [-183.52, -107.14], [-200.77, -105.97], [-203.87, -117.04], [-206.34, -116.88], [-209.67, -118.3], [-207.54, -120.02], [-175.52, -122.23], [-171.28, -139.17], [-174.36, -139.93], [-165.99, -173.37], [-161.01, -172.13], [-157.12, -187.67], [-170.11, -190.87], [-162.89, -219.74], [-44.94, -190.62], [-46.65, -183.67], [-48.17, -184.0], [-61.08, -132.68], [-36.39, -126.67], [-35.49, -130.3], [-28.52, -128.6], [-29.42, -124.98], [-26.37, -124.24], [-28.14, -117.08], [-29.8, -117.47], [-36.0, -92.31], [-63.91, -99.1], [-64.48, -95.75], [-67.48, -96.24], [-69.42, -85.73], [-66.83, -85.13], [-66.41, -86.99], [-62.54, -86.14], [-62.3, -87.22], [-52.11, -84.97], [-50.08, -79.97], [-52.63, -76.14], [-54.17, -75.81], [-55.22, -71.11], [-62.81, -72.79], [-63.45, -69.95], [-69.16, -71.21], [-69.55, -69.3], [-87.88, -73.14], [-88.42, -70.2], [-96.77, -71.96], [-96.59, -72.85], [-102.5, -74.08], [-103.33, -77.59], [-109.96, -76.02]]], "holes": [[[-110.23, -165.97], [-113.17, -155.27], [-109.08, -154.16], [-114.02, -134.93], [-137.39, -140.51], [-129.11, -170.64], [-142.86, -174.03], [-153.45, -133.54], [-154.72, -133.88], [-158.88, -119.04], [-122.71, -112.1], [-121.5, -116.98], [-114.9, -115.34], [-116.04, -110.82], [-111.21, -109.89], [-109.05, -118.55], [-110.85, -119.0], [-109.95, -122.6], [-108.14, -122.15], [-97.94, -162.93]]]}, {"id": "relation/1359233", "name": "Kremlin Senate", "h": 0.0, "outer": [[[41.37, 106.74], [43.47, 105.72], [46.34, 106.64], [81.29, 137.53], [82.11, 136.64], [87.59, 141.3], [86.79, 142.18], [90.6, 145.38], [91.44, 144.53], [96.79, 149.04], [96.03, 149.94], [117.37, 167.91], [118.17, 167.01], [129.14, 176.22], [128.38, 177.16], [131.73, 179.98], [131.63, 182.66], [134.36, 183.63], [136.32, 185.6], [137.58, 190.88], [135.9, 195.84], [131.07, 198.57], [130.96, 201.74], [128.33, 204.17], [129.03, 204.95], [118.82, 214.29], [118.07, 213.49], [97.63, 232.22], [98.4, 233.11], [92.54, 238.51], [91.86, 237.5], [88.7, 240.41], [89.49, 241.32], [84.53, 245.89], [83.56, 245.12], [60.31, 266.44], [61.15, 267.43], [49.96, 277.76], [49.02, 276.78], [46.42, 279.17], [44.58, 278.34], [42.62, 278.95], [29.97, 273.32], [29.42, 271.49], [27.57, 270.66], [27.51, 267.92], [26.31, 267.63], [26.0, 252.84], [27.16, 252.76], [25.96, 200.28], [24.9, 200.26], [24.62, 187.14], [25.65, 187.11], [24.41, 132.98], [23.49, 132.95], [23.19, 118.36], [24.08, 118.3], [24.0, 115.12], [27.23, 113.56], [26.7, 112.46], [39.78, 104.54]]], "holes": [[[69.64, 238.9], [67.86, 234.81], [50.14, 226.4], [50.26, 231.61], [44.68, 234.48], [40.27, 232.47], [40.93, 257.7], [46.59, 260.26]], [[96.87, 180.63], [79.19, 165.74], [85.06, 158.87], [81.74, 156.1], [41.87, 178.47], [42.34, 206.64], [83.92, 226.49], [86.14, 224.23], [80.77, 218.13], [97.83, 203.05], [93.92, 199.49], [91.32, 192.09], [93.28, 184.5]], [[37.21, 128.49], [37.94, 158.98], [45.27, 161.65], [64.92, 150.59], [67.24, 144.56], [44.14, 125.13]]]}, {"id": "relation/1359243", "name": "Cathedral of the Archangel", "h": 0.0, "outer": [[[31.82, -138.57], [34.7, -136.46], [34.35, -133.51], [31.85, -132.06], [27.54, -132.48], [27.4, -131.34], [25.32, -132.37], [22.71, -131.95], [18.92, -133.19], [16.44, -132.77], [13.44, -133.88], [0.3, -134.86], [1.63, -138.08], [1.18, -141.6], [2.41, -150.97], [3.72, -154.24], [3.3, -157.69], [6.86, -156.87], [7.62, -162.63], [24.97, -160.13], [28.32, -159.95], [28.52, -161.44], [33.94, -160.73], [33.0, -153.57], [35.85, -152.86], [37.18, -150.46], [35.6, -146.53], [29.91, -146.42], [31.9, -142.74], [31.06, -140.43], [28.99, -138.99]]], "holes": []}, {"id": "relation/1359248", "name": "Patriarch's Palace", "h": 0.0, "outer": [[[-9.02, -26.83], [-17.46, -6.73], [-29.0, -11.42], [-29.55, -10.07], [-31.22, -10.75], [-30.67, -12.1], [-31.98, -12.63], [-30.13, -17.03], [-36.9, -19.84], [-37.43, -22.6], [-38.58, -23.08], [-39.16, -21.72], [-44.9, -24.11], [-44.34, -25.47], [-48.75, -27.29], [-50.18, -23.91], [-52.42, -24.83], [-51.0, -28.22], [-57.7, -30.99], [-60.07, -24.62], [-89.84, -18.2], [-92.8, -31.29], [-76.39, -34.93], [-71.27, -38.9], [-67.62, -43.85], [-67.05, -47.54], [-66.17, -47.27], [-65.74, -48.64], [-72.17, -60.85], [-70.63, -69.52], [-69.55, -69.3], [-69.16, -71.21], [-63.45, -69.95], [-65.12, -61.81], [-61.38, -54.39], [-33.01, -41.49], [-31.44, -44.89], [-21.39, -40.33], [-22.96, -36.91], [-13.73, -32.76], [-15.89, -29.95]]], "holes": []}, {"id": "relation/1359249", "name": "Church of the Twelve Apostles", "h": 0.0, "outer": [[[9.32, -18.66], [2.88, -3.6], [-3.25, -6.09], [-4.39, -3.58], [-16.64, -8.77], [-9.16, -26.47]]], "holes": []}, {"id": "relation/1359251", "name": "Cathedral of the Annunciation", "h": 0.0, "outer": [[[-25.96, -175.46], [-22.91, -174.74], [-23.85, -171.0], [-26.86, -171.73], [-28.3, -166.02], [-29.89, -166.41], [-29.61, -164.77], [-30.62, -163.57], [-29.8, -160.39], [-32.07, -158.5], [-31.95, -156.59], [-33.32, -155.4], [-34.57, -150.46], [-51.78, -154.88], [-45.3, -180.53]]], "holes": []}, {"id": "relation/1359278", "name": "Assumption Belfry", "h": 0.0, "outer": [[[18.88, -77.67], [20.36, -82.18], [22.57, -81.48], [26.06, -92.1], [37.64, -88.34], [36.59, -86.35], [39.48, -80.83], [45.55, -78.85], [50.05, -81.46], [40.75, -53.24], [35.32, -55.0], [30.84, -43.42], [23.73, -45.74], [26.46, -55.95], [21.61, -57.09], [27.0, -75.06]]], "holes": []}, {"id": "relation/1359281", "name": "Ivan the Great Bell Tower", "h": 0.0, "outer": [[[37.64, -88.34], [38.47, -91.74], [43.69, -94.76], [49.77, -92.76], [52.64, -87.24], [50.78, -81.88], [45.55, -78.85], [39.48, -80.83], [36.59, -86.35]]], "holes": []}, {"id": "relation/1359290", "name": "", "h": 8.5, "outer": [[[51.67, 238.3], [55.05, 237.54], [57.99, 239.36], [58.76, 242.71], [56.93, 245.63], [53.55, 246.4], [50.61, 244.58], [49.83, 241.23]]], "holes": []}, {"id": "relation/1359335", "name": "Armoury", "h": 0.0, "outer": [[[-239.09, -175.9], [-247.62, -173.48], [-251.6, -186.87], [-244.81, -188.61], [-243.69, -191.15], [-260.52, -206.17], [-267.47, -205.06], [-273.47, -210.5], [-273.21, -217.49], [-290.49, -232.74], [-289.08, -234.45], [-289.75, -240.81], [-283.25, -248.02], [-277.39, -247.46], [-276.21, -248.67], [-227.59, -205.31], [-220.63, -181.15], [-228.73, -182.8], [-234.7, -177.15]]], "holes": []}, {"id": "relation/1359337", "name": "Amusement Palace", "h": 0.0, "outer": [[[-205.24, -34.63], [-203.03, -35.31], [-204.42, -39.8], [-199.15, -41.41], [-197.76, -36.92], [-191.66, -38.78], [-193.18, -45.07], [-185.11, -47.02], [-183.25, -39.55], [-182.01, -39.85], [-178.98, -27.06], [-180.08, -26.8], [-178.37, -19.93], [-203.21, -12.35], [-209.69, -33.28]]], "holes": []}, {"id": "relation/1360646", "name": "", "h": 8.0, "outer": [[[-206.61, 96.62], [-199.67, 94.76], [-198.94, 98.52], [-188.92, 95.6], [-187.21, 101.73], [-198.25, 105.13], [-196.22, 111.19], [-201.23, 112.74]]], "holes": []}, {"id": "relation/1360650", "name": "", "h": 16.0, "outer": [[[-165.4, 124.36], [-189.06, 132.87], [-198.25, 105.13], [-187.21, 101.73], [-188.55, 96.91], [-177.28, 93.35], [-176.91, 94.58], [-175.91, 94.3]]], "holes": []}, {"id": "relation/1360662", "name": "", "h": 8.0, "outer": [[[3.86, 337.01], [8.38, 332.48], [16.19, 340.73], [17.05, 339.89], [23.39, 346.25], [18.18, 351.37]]], "holes": []}, {"id": "relation/1360670", "name": "", "h": 0.0, "outer": [[[129.18, 215.9], [122.94, 221.61], [123.64, 222.36], [107.61, 237.23], [105.16, 234.59], [122.45, 218.74], [121.29, 217.49], [126.36, 212.84]]], "holes": []}, {"id": "relation/1360694", "name": "", "h": 0.0, "outer": [[[297.9, -44.66], [292.65, -32.86], [288.09, -34.86], [293.39, -46.66]]], "holes": []}, {"id": "relation/3028585", "name": "Assumption Cathedral", "h": 0.0, "outer": [[[-15.02, -45.6], [-15.21, -44.96], [-23.11, -47.96], [-24.52, -47.67], [-26.58, -49.92], [-28.42, -50.45], [-31.71, -49.76], [-39.71, -52.78], [-39.9, -52.14], [-44.1, -54.05], [-49.29, -54.86], [-49.44, -57.07], [-48.7, -56.86], [-46.63, -63.88], [-47.37, -64.09], [-46.92, -65.59], [-49.64, -66.39], [-47.71, -72.9], [-45.01, -72.12], [-44.57, -73.59], [-43.84, -73.37], [-41.82, -80.2], [-42.56, -80.42], [-42.16, -81.78], [-41.24, -82.21], [-40.17, -81.21], [-31.85, -79.49], [-32.04, -78.85], [-25.03, -76.8], [-24.84, -77.46], [-23.66, -77.11], [-23.84, -76.46], [-19.64, -74.33], [-16.47, -75.02], [-5.24, -71.07], [-8.23, -62.84], [-6.99, -59.2], [-7.79, -55.98], [-10.47, -54.4], [-12.91, -44.99]]], "holes": []}, {"id": "relation/3031379", "name": "The State Kremlin Palace", "h": 0.0, "outer": [[[-146.61, 57.82], [-173.49, -61.03], [-103.33, -77.59], [-76.22, 42.15], [-98.32, 47.07], [-96.52, 55.05], [-116.91, 59.59], [-118.71, 51.62]]], "holes": []}, {"id": "relation/3062894", "name": "", "h": 0.0, "outer": [[[-234.66, 104.12], [-283.94, 117.32], [-287.17, 106.74], [-287.17, 105.5], [-202.2, 86.07], [-199.67, 94.76]]], "holes": []}, {"id": "relation/3272132", "name": "", "h": 0.0, "outer": [[[-69.27, 272.84], [-56.12, 268.04], [-52.74, 277.15], [-51.05, 276.53], [-43.6, 296.63], [-41.04, 295.7], [-38.68, 302.07], [-41.24, 303.01], [-32.88, 325.54], [-50.4, 331.94], [-58.75, 309.43], [-61.0, 310.25], [-63.38, 303.85], [-61.12, 303.02], [-68.56, 282.94], [-65.89, 281.96]]], "holes": []}, {"id": "relation/3341858", "name": "", "h": 0.0, "outer": [[[-172.91, -281.31], [-176.48, -272.35], [-209.27, -285.25], [-206.75, -291.58], [-214.03, -291.23], [-214.29, -296.04], [-203.95, -296.44], [-171.9, -283.84]]], "holes": []}, {"id": "relation/3341881", "name": "", "h": 4.0, "outer": [[[-227.38, -325.18], [-236.1, -318.74], [-249.34, -336.42], [-240.62, -342.86]]], "holes": []}, {"id": "relation/3349391", "name": "", "h": 0.0, "outer": [[[-186.16, 43.59], [-181.01, 41.6], [-179.67, 45.24], [-173.21, 43.8], [-180.85, 9.42], [-185.45, 10.41], [-187.23, 2.23], [-185.24, 1.81], [-186.91, -5.88], [-184.29, -6.45], [-185.67, -12.85], [-188.62, -12.2], [-189.59, -16.51], [-178.37, -19.93], [-162.04, 53.62], [-180.64, 57.63]]], "holes": []}, {"id": "relation/3349392", "name": "", "h": 0.0, "outer": [[[-203.87, -117.04], [-201.74, -108.96], [-213.84, -105.33], [-239.26, -95.04], [-278.64, -193.03], [-265.36, -198.39], [-231.19, -113.43], [-217.67, -118.51], [-232.87, -170.78], [-237.23, -169.52], [-239.09, -175.9], [-234.7, -177.15], [-228.73, -182.8], [-220.63, -181.15], [-210.26, -145.48]]], "holes": []}, {"id": "relation/3349393", "name": "", "h": 4.0, "outer": [[[-186.16, 43.59], [-195.45, 19.49], [-188.39, 16.77], [-183.98, 28.73], [-185.54, 29.34], [-181.01, 41.6]]], "holes": []}, {"id": "relation/3427788", "name": "", "h": 0.0, "outer": [[[-213.79, -55.8], [-213.13, -56.03], [-205.56, -35.48], [-214.53, -32.22], [-239.26, -95.04], [-213.84, -105.33], [-201.74, -108.96], [-194.2, -90.24], [-190.55, -69.34], [-185.11, -47.02], [-198.75, -43.73], [-200.46, -50.73], [-197.3, -51.49], [-197.71, -53.18], [-195.3, -53.76], [-196.48, -58.58], [-202.3, -57.58], [-207.59, -87.93], [-214.45, -85.99], [-216.95, -95.66], [-227.67, -92.37]]], "holes": []}, {"id": "relation/6800992", "name": "", "h": 8.5, "outer": [[[46.3, 137.14], [49.67, 136.37], [52.61, 138.21], [53.39, 141.56], [51.55, 144.48], [48.18, 145.25], [45.24, 143.43], [44.46, 140.06]]], "holes": []}, {"id": "relation/16446014", "name": "", "h": 3.0, "outer": [[[-220.81, -329.93], [-217.69, -329.13], [-218.97, -324.15], [-222.09, -324.94]]], "holes": []}, {"id": "relation/16454316", "name": "", "h": 0.0, "outer": [[[308.95, -121.0], [301.94, -105.83], [235.0, -136.32], [242.01, -151.5], [273.01, -137.4], [273.29, -138.01], [305.98, -122.36]]], "holes": []}]}

await main()
