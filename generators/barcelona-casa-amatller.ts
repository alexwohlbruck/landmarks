/**
 * Casa Amatller (Passeig de Gràcia 41, Barcelona; Josep Puig i Cadafalch's
 * 1898–1900 remodelling) — original procedural geometry, CC0-1.0.
 * bun generators/barcelona-casa-amatller.ts
 *
 * Uses the kit in barcelona-casa-batllo.ts (merge that first).
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM multipolygon relation/9427552,
 * 41.391337, 2.164772. Same frame as Casa Batlló next door: the catalog
 * bearing is 226.8, the street facade is the model's south face (-y,
 * compass 46.8°), +x points north-west to Casa Batlló.
 *
 * Identity, in order: the stepped Flemish gable over the middle of the
 * facade, its steps coped in tan stone and edged with a band of pale
 * glazed tiles, a red tile line stepping up inside it; the pale pink-cream
 * sgraffito wall; the arcaded gallery of arched windows under the gable;
 * the carved stone oriel on the first floor at the Batlló end; the grey
 * stone ground floor with its two arched doors.
 *
 * Evidence:
 *  - plan: the OSM outline (relation/9427552) and its parts: way/679019101
 *    (7 levels, the middle 9 m of the front, under the gable),
 *    way/679019116 and way/679019180 (5 levels, the front's two sides),
 *    way/679019099 (6 levels, the body, round a light well),
 *    way/679019202 (5 levels), way/679019145 (1 level, the rear wing),
 *    way/679019097, way/679019098, way/679019176 (1 level, light courts).
 *    The facade is 17.5 m on OSM.
 *  - heights: measured on C messier's frontal photo across the boulevard
 *    (47.8 px/m on the crop, scaled by the 17.5 m facade): stone ground
 *    floor 3.9 m, first-floor windows 4.6–6.7 m, second floor 8.8–10.7 m,
 *    the arcade 12.3–14.2 m, the attic row 15.6–17.0 m, the side parts'
 *    top 18.2 m, the gable's steps at 21.0, 22.3, 23.6, 24.8 and 26.0 m
 *    (each about 0.95 m in), its top 27.9 m, 2.3 m wide; the gable's three
 *    windows 19.2–20.8 m. The gable is 12.0 m wide at its foot, centred
 *    1.6 m towards Batlló of the facade's middle (as OSM's 7-level part).
 *    The window positions also from G. Argyriou's frontal photo.
 *  - the tiled roof behind the gable (seen orange behind it in Txllxt
 *    TxllxT's oblique view) is an estimate: ridge 25.4 m, back to the end
 *    of the 7-level part. The body at 20 m (6 levels), the 5-level rear
 *    part at 17.5 m and the rear wing at 5 m are estimates from OSM levels.
 *  - colour: the sgraffito reads pale pink-cream (#ead3bd here); the tile
 *    band pale (trim); the red line and the edge strips brick red pulled
 *    light (#b65a4c); ground floor grey sandstone; the roof terracotta.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Casa_Amatller_&_Batlló_2955.jpg (C messier, CC BY-SA 4.0), frontal;
 *  - CasaAmatller.jpg (G. Argyriou, CC BY-SA 3.0), frontal;
 *  - Barcelona_-_Passeig_de_Gràcia_-_Casa_Amatller_&_Casa_Batlló.jpg
 *    (Txllxt TxllxT, CC BY-SA 4.0), looking up at the gable;
 *  - Barcelona_-_Passeig_de_Gràcia_-_View_NW_on_Casa_Amatller_1900_&_Casa_
 *    Batlló_1907.jpg (Txllxt TxllxT, CC BY-SA 4.0), oblique, the gable's
 *    thickness and the roof behind;
 *  - Casa_Amatller_Casa_Batlló,_Barcelona.jpg (МаратД, CC BY-SA 4.0).
 * No look-only sources. No commercial imagery. No lidar.
 *
 * Ground: the map's terrain (Mapterhorn) puts the block's interior about
 * 1.2 m below Passeig de Gràcia and the map stands the model on that
 * lowest ground; every height above stands on a plain 1.2 m plinth that the
 * pavement covers at the front (terrain.ts check ok).
 *
 * Left out: the sgraffito pattern and the red dots, the iron balconies and
 * lamp brackets, the sculpture of the doors and windows, the iron cresting
 * on the side parts, the tile motifs in the band.
 *
 * Doubts: the roof behind the gable and the rear are not photographed in
 * any licensed photo found; they are kept plain.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { cap, save, triangulate, type XY } from './chi-aon-center'
import { archTop, box, ccw, clipY, front, screen, wallsExcept } from './barcelona-casa-batllo'

const FRONT = -39.3
const XL = -7.16, XR = 10.3
const GC = 1.63 // the gable's axis

/** A flat polygon in the plane y facing -y, from an (x, z) ring counter-clockwise seen from -y. */
function facePoly(p: Part, y: number, ring0: XY[], back = false) {
  const ring = ccw(ring0)
  for (const [a, b, c] of triangulate(ring)) {
    const A: V3 = [ring[a][0], y, ring[a][1]], B: V3 = [ring[b][0], y, ring[b][1]], C: V3 = [ring[c][0], y, ring[c][1]]
    if (back) p.tri(A, C, B); else p.tri(A, B, C)
  }
}

function build() {
  const sgr = new Part(), tile = new Part(), red = new Part(), stone = new Part(), win = new Part(), roof = new Part()
  const tiles = red // the pitched roof's terracotta shares the red tiles' material

  // --- Plan --------------------------------------------------------------
  const main: XY[] = ccw([[9.22, -2.9], [9.27, -4.78], [9.48, -12.75], [9.5, -13.33], [9.54, -14.61], [9.6, -16.3], [9.73, -20.56], [9.94, -27.36], [9.97, -28.08], [10.16, -34.35], [10.3, -39.3], [6.14, -39.3], [2.66, -39.28], [-3.0, -39.32], [-7.16, -39.33], [-7.79, -28.59], [-7.98, -25.31], [-8.38, -18.15], [-8.46, -16.81], [-8.55, -15.29], [-8.65, -13.62], [-9.0, -7.28], [-9.1, -5.49], [-9.2, -3.73]])
  const rear: XY[] = ccw([[-9.51, 1.4], [-10.27, 14.88], [-11.45, 35.69], [-11.55, 37.34], [8.31, 38.1], [8.65, 22.5], [8.86, 12.77], [8.93, 9.1], [9.11, 1.84]])
  const YA = -30.1, YB = -13.5
  const A = clipY(main, YA, 'below'), B = clipY(clipY(main, YA, 'above'), YB, 'below'), C = clipY(main, YB, 'above')
  const SIDE = 18.2, BODY = 20.0, BACK = 17.5, WING = 5.0
  const at = (c: number) => (a: XY, b: XY) => Math.abs(a[1] - c) < 0.02 && Math.abs(b[1] - c) < 0.02
  const isFront = (a: XY, b: XY) => a[1] < FRONT + 0.1 && b[1] < FRONT + 0.1
  wallsExcept(sgr, A, 0, SIDE, (a, b) => isFront(a, b) || at(YA)(a, b))
  cap(roof, A, SIDE)
  wallsExcept(sgr, B, 0, BODY, (a, b) => at(YA)(a, b) || at(YB)(a, b))
  cap(roof, B, BODY)
  // B's front above A and its back above C
  const edge = (r: XY[], c: number) => r.filter(p => Math.abs(p[1] - c) < 0.02).sort((a, b) => a[0] - b[0])
  { const e = edge(B, YA); sgr.quad([e[0][0], YA, SIDE], [e[1][0], YA, SIDE], [e[1][0], YA, BODY], [e[0][0], YA, BODY]) }
  { const e = edge(B, YB); sgr.quad([e[1][0], YB, BACK], [e[0][0], YB, BACK], [e[0][0], YB, BODY], [e[1][0], YB, BODY]) }
  wallsExcept(sgr, C, 0, BACK, at(YB))
  cap(roof, C, BACK)
  wallsExcept(sgr, rear, 0, WING, () => false)
  cap(roof, rear, WING)

  // --- Facade -----------------------------------------------------------
  // The gable's outline, left foot to right foot, mirrored about GC.
  const half: XY[] = [[-4.38, SIDE], [-4.38, 21.0], [-3.46, 21.0], [-3.46, 22.3], [-2.56, 22.3], [-2.56, 23.6], [-1.57, 23.6], [-1.57, 24.8], [-0.63, 24.8], [-0.63, 26.0], [0.48, 26.0], [0.48, 27.9]]
  const mirror = (p: XY): XY => [2 * GC - p[0], p[1]]
  const gable: XY[] = [...half, ...[...half].reverse().map(mirror)]
  // the facade face: stone below, sgraffito above, up into the gable
  const STONE = 3.9
  const faceRing: XY[] = [[XL, STONE], [XR, STONE], [XR, SIDE], ...[...gable].reverse(), [XL, SIDE]]
  facePoly(sgr, FRONT, faceRing)
  // the gable's thickness: coped steps and risers, its back face plain
  const GT = 0.7
  for (let i = 0; i < gable.length - 1; i++) {
    const a = gable[i], b = gable[i + 1]
    // a → b runs left to right over the top; the outward side is up/left/right
    stone.quad([a[0], FRONT, a[1]], [b[0], FRONT, b[1]], [b[0], FRONT + GT, b[1]], [a[0], FRONT + GT, a[1]])
  }
  facePoly(sgr, FRONT + GT, [[gable[0][0], SIDE], ...gable.slice(1, -1), [gable[gable.length - 1][0], SIDE]], true)
  // stone coping along the steps, standing a little proud
  for (let i = 0; i < gable.length - 1; i++) {
    const a = gable[i], b = gable[i + 1]
    if (Math.abs(a[1] - b[1]) < 1e-6) box(stone, Math.min(a[0], b[0]) - 0.12, FRONT - 0.12, Math.max(a[0], b[0]) + 0.12, FRONT + GT, a[1], a[1] + 0.22, 0.06)
  }
  // band of pale tiles inside the outline, then the red stepped line
  const insetStep = (d: number) => {
    const L: XY[] = []
    for (let i = 1; i < half.length; i += 2) { const [x, z] = half[i]; L.push([x + d, Math.min(z - d, 99)]); if (i + 1 < half.length) L.push([half[i + 1][0] + d, z - d]) }
    // last (top) step corner
    return L
  }
  const bandPoly = (d0: number, d1: number) => {
    const o = insetStep(d0), i = insetStep(d1)
    const top0 = o[o.length - 1], top1 = i[i.length - 1]
    const left: XY[] = [[o[0][0], SIDE + 0.6], ...o.slice(0, -1), [top0[0], top0[1]]]
    const leftIn: XY[] = [[i[0][0], SIDE + 0.6], ...i.slice(0, -1), [top1[0], top1[1]]]
    const outer = [...left, ...[...left].reverse().map(mirror)]
    const inner = [...leftIn, ...[...leftIn].reverse().map(mirror)]
    return [...outer, ...[...inner].reverse()]
  }
  facePoly(tile, FRONT - 0.03, bandPoly(0, 0.8))
  facePoly(red, FRONT - 0.04, bandPoly(0.8, 1.08))
  // edge strips of red-and-white tiles at the facade's ends
  front(red, FRONT - 0.03, XL, XL + 0.45, STONE, SIDE)
  front(red, FRONT - 0.03, XR - 0.45, XR, STONE, SIDE)
  // the side parts' coping
  box(stone, XL, FRONT - 0.15, -4.38, FRONT + 0.6, SIDE, SIDE + 0.3, 0.06)
  box(stone, 2 * GC + 4.38, FRONT - 0.15, XR, FRONT + 0.6, SIDE, SIDE + 0.3, 0.06)

  // Stone ground floor: two doors and the shop windows between.
  const ar = (x0: number, x1: number, zb: number, zs: number, zt: number) => ({ x0, x1, bot: () => zb, top: archTop(x0, x1, zs, zt), seg: 6 })
  const holes = [ar(-4.95, -2.8, -1, 2.0, 2.95), ar(-1.9, -0.6, 0.6, 2.1, 2.7), ar(-0.3, 1.0, 0.6, 2.1, 2.7), ar(1.3, 2.6, 0.6, 2.1, 2.7), ar(2.9, 4.2, 0.6, 2.1, 2.7), ar(6.85, 9.05, -1, 2.0, 2.95)]
  screen(stone, FRONT + 0.3, 0.3, XL, XR, 0, STONE, holes)
  for (const h of holes) front(win, FRONT + 0.26, h.x0, h.x1, Math.max(0, h.bot()), 3.0)
  // a stone string course over the ground floor
  box(stone, XL, FRONT - 0.18, XR, FRONT + 0.2, STONE - 0.1, STONE + 0.25, 0.08)

  // Windows: flat panels in stone surrounds, by floor.
  const frame = (x0: number, x1: number, z0: number, z1: number, arch = false) => {
    front(stone, FRONT - 0.03, x0 - 0.16, x1 + 0.16, z0 - 0.16, z1 + 0.2)
    if (!arch) front(win, FRONT - 0.07, x0, x1, z0, z1)
    else {
      const ring: XY[] = [[x0, z0], [x1, z0]]
      const cx = (x0 + x1) / 2, r = (x1 - x0) / 2, zs = z1 - r
      for (let i = 0; i <= 6; i++) { const a = (i / 6) * Math.PI; ring.push([cx + r * Math.cos(a), zs + r * Math.sin(a)]) }
      facePoly(win, FRONT - 0.07, ring)
    }
  }
  // first floor (principal): three tall windows on the long balcony, one at the left
  for (const [a, b] of [[-3.0, -1.2], [0.3, 2.15], [4.0, 5.7]] as [number, number][]) frame(a, b, 4.6, 6.7)
  frame(-6.1, -4.65, 4.6, 6.4)
  box(stone, -3.7, FRONT - 0.7, 6.1, FRONT, 4.3, 4.55, 0.1) // the balcony slab
  // second floor
  for (const [a, b] of [[-5.9, -4.65], [-1.6, -0.15], [2.8, 3.9], [7.4, 8.6]] as [number, number][]) frame(a, b, 8.8, 10.7, true)
  // the arcade: a long gallery of arched lights on twisted columns
  {
    const x0 = -5.6, x1 = 8.6, n = 12, w = (x1 - x0) / n
    front(stone, FRONT - 0.03, x0 - 0.2, x1 + 0.2, 12.1, 14.5)
    for (let i = 0; i < n; i++) {
      const a = x0 + i * w + 0.12, b = x0 + (i + 1) * w - 0.12
      const ring: XY[] = [[a, 12.3], [b, 12.3]]
      const cx = (a + b) / 2, r = (b - a) / 2
      for (let k = 0; k <= 5; k++) { const t = (k / 5) * Math.PI; ring.push([cx + r * Math.cos(t), 14.2 - r + r * Math.sin(t)]) }
      facePoly(win, FRONT - 0.07, ring)
    }
    box(stone, x0 - 0.2, FRONT - 0.4, x1 + 0.2, FRONT, 11.9, 12.2, 0.08)
  }
  // the attic row of six arched windows
  for (const x of [-3.3, -1.2, 0.97, 3.1, 5.1, 7.2]) frame(x - 0.45, x + 0.45, 15.6, 17.0, true)
  // the gable's triple window
  frame(-0.05, 0.95, 19.2, 20.8, true); frame(1.13, 2.13, 19.2, 20.8, true); frame(2.31, 3.31, 19.2, 20.8, true)

  // The carved stone oriel on the first floor at the Batlló end.
  {
    const x0 = 6.5, x1 = 9.3, d = 0.85, y = FRONT
    box(stone, x0, y - d, x1, y, 3.9, 8.2, 0.25)
    // corbel under it, tapering to the wall
    stone.quad([x0 + 0.3, y, 3.1], [x1 - 0.3, y, 3.1], [x1, y - d, 3.9], [x0, y - d, 3.9])
    stone.quad([x0, y - d, 3.9], [x0, y, 3.9], [x0 + 0.3, y, 3.1], [x0, y - d, 3.9])
    stone.quad([x1, y, 3.9], [x1, y - d, 3.9], [x1 - 0.3, y, 3.1], [x1, y, 3.9])
    // a pointed gablet on top
    const cx = (x0 + x1) / 2
    stone.quad([x0, y - d, 8.2], [x1, y - d, 8.2], [cx, y - d, 9.6], [cx, y - d, 9.6])
    stone.quad([x1, y - d, 8.2], [x1, y, 8.2], [cx, y, 9.6], [cx, y - d, 9.6])
    stone.quad([x0, y, 8.2], [x0, y - d, 8.2], [cx, y - d, 9.6], [cx, y, 9.6])
    front(win, y - d - 0.04, x0 + 0.3, x1 - 0.3, 4.4, 7.7)
  }

  // --- The tiled roof behind the gable ----------------------------------
  {
    const y0 = FRONT + GT - 0.05, y1 = YA - 0.3, eaveX = 5.35, zE = SIDE + 0.4, zR = 25.4
    const rows: V3[][] = [y0, y1].map(y => [[GC - eaveX, y, zE], [GC, y, zR], [GC + eaveX, y, zE]] as V3[])
    // two flat slopes: draw each as its own quad (crisp ridge)
    tiles.quad(rows[0][0], rows[0][1], rows[1][1], rows[1][0])
    tiles.quad(rows[0][1], rows[0][2], rows[1][2], rows[1][1])
    // the back gable end
    sgr.tri([GC - eaveX, y1, zE], [GC, y1, zR], [GC + eaveX, y1, zE])
    sgr.quad([GC + eaveX, y1, SIDE], [GC - eaveX, y1, SIDE], [GC - eaveX, y1, zE], [GC + eaveX, y1, zE])
    sgr.quad([GC - eaveX, y0, zE], [GC - eaveX, y1, zE], [GC - eaveX, y1, SIDE], [GC - eaveX, y0, SIDE])
    sgr.quad([GC + eaveX, y1, zE], [GC + eaveX, y0, zE], [GC + eaveX, y0, SIDE], [GC + eaveX, y1, SIDE])
  }

  // The map stands the model on the lowest ground of its plan's extent, in
  // the block's interior about 1.2 m below the boulevard (Mapterhorn): the
  // design stands on a plain plinth DZ tall that the pavement covers.
  const DZ = 1.2
  for (const part of [sgr, tile, red, stone, win, roof]) for (let i = 1; i < part.pos.length; i += 3) part.pos[i] += DZ
  wallsExcept(stone, main, 0, DZ, () => false)
  wallsExcept(stone, rear, 0, DZ, () => false)

  const lit = (p: V3, n: V3) => (p[1] < FRONT + 1.5 && n[1] < -0.5 ? 0.45 + 0.4 * Math.min(1, p[2] / 26) : 0)
  return [
    { part: sgr, material: { ...finish('amatller-sgraffito', 0xead3bd), floodlight: lit } },
    { part: tile, material: { ...PALETTE.trim, floodlight: lit } },
    { part: red, material: { ...finish('amatller-red', 0xb65a4c), floodlight: lit } },
    { part: stone, material: { ...finish('amatller-stone', 0xc4b298), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
  ] as { part: Part; material: Swatch }[]
}

if (import.meta.main) await save('barcelona-casa-amatller', 'Casa Amatller', [41.391337, 2.164772], 226.8, build(), 5000)
