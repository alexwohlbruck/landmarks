/**
 * Lovett Hall (the Administration Building), Rice University, Houston
 * (1912; Cram, Goodhue & Ferguson) — procedural, CC0-1.0, no textures.
 * bun generators/hou-rice-lovett-hall.ts
 *
 * Map frame: x across the building, y along it, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 335.5, the long axis of the
 * building in the lidar and OSM: model +y looks NNW, +x looks ENE to the
 * entrance lawn and Main Street, -x looks WSW down the academic quad.
 * Anchor -95.397826, 29.719023: the centre of the lidar footprint (the OSM
 * outline way/44896261 is a rough 13-node trace about a metre off it).
 * replaces ["way/44896261"], the only building OSM maps here.
 *
 * Identity, in order: the long symmetric three-storey range, 88 m, with the
 * taller central tower pierced by the Sallyport, one great round arch in a
 * white stone frame that you can see straight through; salmon-pink brick
 * over a ground storey of white marble banded with brick; on the quad side
 * a ground-floor arcade of seven round arches each side and white columns
 * rising between the upper bays to finials over the balustrade; on the
 * entrance side a two-storey recessed loggia either side of the tower; the
 * tower's tiers of grouped round-arched windows and its open arcaded top
 * storey on the quad side; a low gray hipped roof behind a white balustrade.
 *
 * Evidence
 * - OSM way/44896261: building=university, roof:shape=hipped, no heights.
 * - Lidar: USGS 3DEP TX_Coastal_B1_2018 (flown 2018), 0.5 m grid read at
 *   bearing 335.5. Ground ~1.4 m over the grid's lowest (z = 0, flat).
 *   Walls x -7.75..+7.75 (15.5 m), y -45.2..+43.5 (88.7 m), centred 0.9 m
 *   south of the OSM anchor (the anchor here is moved onto that centre);
 *   finials over the balustrade ~15.3 m; the roof's eaves ~14 m, its ridge
 *   16.6 m, hipped down at both ends; the end parapets ~15.6-15.9 m; the
 *   tower 15.5 m long (±7.75 about the centre) and the full width, roof
 *   19.8 m, the attic over its middle 10.5 m long, 21.2 m high.
 *   Photo-scaled (the quad photo, at 0.073 m/px against the tower's lidar
 *   height): the wing's cornice 12.9-13.5 m and balustrade 14.4 m (the
 *   lidar's 15.3 is the finials), the pavilions' parapet 15.9 m.
 * - NAIP 2022 (USGS, 0.17 m): dark gray roofs (not tile), the tower's roof
 *   pale.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Rice University, Houston, Texas LCCN2011630262.tif", Carol M.
 *     Highsmith, public domain: the entrance (ENE) front, face-on
 *     https://commons.wikimedia.org/wiki/File:Rice_University,_Houston,_Texas_LCCN2011630262.tif
 *   - "Rice University Sally Port.jpg", Claudia Paine22, CC BY-SA 4.0: the
 *     quad front, face-on (most proportions scaled from this one)
 *     https://commons.wikimedia.org/wiki/File:Rice_University_Sally_Port.jpg
 *   - "Rice University - Sally Port.JPG", Daderot, public domain: the
 *     tower's quad face close up, the arcade, columns and banding
 *     https://commons.wikimedia.org/wiki/File:Rice_University_-_Sally_Port.JPG
 *   - "Rice University - Rice statue with Lovett Hall.JPG", Daderot, public
 *     domain: the quad front from the south-west
 *     https://commons.wikimedia.org/wiki/File:Rice_University_-_Rice_statue_with_Lovett_Hall.JPG
 *   - "Lovett Hall.jpg", AniRaptor2001, CC BY-SA 3.0, and "Rice
 *     University.jpg", Anatol Stefanowitsch, CC BY-SA 3.0: the quad front
 *     https://commons.wikimedia.org/wiki/File:Lovett_Hall.jpg
 *     https://commons.wikimedia.org/wiki/File:Rice_University.jpg
 *   - "Rice University Lovett Hall.jpg", Harry Walker, CC0 (c. 1912, the
 *     entrance front new)
 *     https://commons.wikimedia.org/wiki/File:Rice_University_Lovett_Hall.jpg
 *
 * Measured (lidar): footprint, wall/balustrade/ridge/tower heights. Scaled
 * from the face-on photos against those: the ground storey (5.4 m), the
 * arcade (7 arches a wing at 4.36 m, crown 4.6 m), the Sallyport (4.5 m
 * clear, crown 7.85 m, stone frame to 9.4 m), the loggia (5 bays a wing,
 * 12.5 m, 5.6-13.4 m), the end pavilions (6 m), window sizes and tiers,
 * the tower's grouped windows and top loggia. Estimated: the cloister's
 * depth (3 m), the loggia's depth (2.4 m), the brick bands in the marble
 * ground storey (drawn as four bold bands, not the dozen thin courses).
 * Left out: carved ornament, the balustrade's balusters (a solid white
 * band), the pinnacle chimneys over the entrance front, the shields and
 * reliefs, the balconies.
 *
 * Follows the photos over the brief: the brief speaks of a triple-arched
 * Sallyport and red tile roofs. Every photo shows the Sallyport as one great
 * round arch (the triple arches are the window groups above it), and both
 * NAIP and the photos show a low gray hipped roof, not red tile (the red
 * tile roofs are on the neighbouring Rice buildings).
 *
 * Colours sampled from four photos, pulled to the palette's lightness:
 * brick #a8795e / #937761 -> #cf9a78; the marble and stone trim near
 * white, #f1eadf; the roof gray, #8f979c; the shaded insides of the
 * arcade and the Sallyport #8a6a58.
 * Night: windows and the loggias glow (window material); the Sallyport's
 * lanterns are left out.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { face } from './nyc-columbus-monument'
import { PALETTE, finish } from './palette'

type XY = [number, number]
/** A vertical plane: origin, unit vector along it, outward normal. */
type Plane = { o: XY; u: XY; n: XY }
const P = (pl: Plane, u: number, z: number, off = 0): V3 =>
  [pl.o[0] + pl.u[0] * u + pl.n[0] * off, pl.o[1] + pl.u[1] * u + pl.n[1] * off, z]

const NA = 8 // segments per semicircle

/** A rectangle on a plane at offset `off`, facing outward. */
function rect(p: Part, pl: Plane, u0: number, u1: number, z0: number, z1: number, off = 0) {
  if (u1 - u0 < 1e-6 || z1 - z0 < 1e-6) return
  face(p, P(pl, u0, z0, off), P(pl, u1, z0, off), P(pl, u1, z1, off), P(pl, u0, z1, off), P(pl, (u0 + u1) / 2, (z0 + z1) / 2, off - 1))
}
/** A triangle facing the side `out` points to. */
function triOut(p: Part, a: V3, b: V3, c: V3, out: V3) {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]]
  if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}
/** A flat window panel, 0.05 m proud, optionally round-headed (spring at z1 - w). */
function panel(p: Part, pl: Plane, u: number, w: number, z0: number, z1: number, arched = false, off = 0.05) {
  const zs = arched ? z1 - w : z1
  rect(p, pl, u - w, u + w, z0, zs, off)
  if (!arched) return
  const out: V3 = [pl.n[0], pl.n[1], 0], c = P(pl, u, zs, off)
  for (let k = 0; k < NA; k++) {
    const a0 = (k * Math.PI) / NA, a1 = ((k + 1) * Math.PI) / NA
    triOut(p, c, P(pl, u + w * Math.cos(a0), zs + w * Math.sin(a0), off), P(pl, u + w * Math.cos(a1), zs + w * Math.sin(a1), off), out)
  }
}

type Opening = { u: number; w: number; zb: number; zs: number }
/**
 * A wall u0..u1 × z0..z1 with round-headed openings cut through it, their
 * reveals `depth` deep, and a back panel closing each at that depth.
 */
function wall(front: Part, pl: Plane, u0: number, u1: number, z0: number, z1: number, ops: Opening[] = [],
  depth = 0, reveal: Part | null = null, back: Part | null = null) {
  ops = [...ops].sort((a, b) => a.u - b.u)
  let cur = u0
  for (const op of ops) {
    rect(front, pl, cur, op.u - op.w, z0, z1)
    rect(front, pl, op.u - op.w, op.u + op.w, z0, op.zb)
    for (let k = 0; k < NA; k++) {
      const a0 = Math.PI - (k * Math.PI) / NA, a1 = Math.PI - ((k + 1) * Math.PI) / NA
      const ua = op.u + op.w * Math.cos(a0), ub = op.u + op.w * Math.cos(a1)
      const za = op.zs + op.w * Math.sin(a0), zb = op.zs + op.w * Math.sin(a1)
      face(front, P(pl, ua, za), P(pl, ub, zb), P(pl, ub, z1), P(pl, ua, z1), P(pl, (ua + ub) / 2, (za + z1) / 2, -1))
    }
    cur = op.u + op.w
    if (reveal) {
      for (const s of [-1, 1]) {
        const uj = op.u + s * op.w
        face(reveal, P(pl, uj, op.zb, 0), P(pl, uj, op.zb, -depth), P(pl, uj, op.zs, -depth), P(pl, uj, op.zs, 0), P(pl, uj + s, op.zs / 2 + op.zb / 2, -depth / 2))
      }
      if (op.zb > 0.01) face(reveal, P(pl, op.u - op.w, op.zb, 0), P(pl, op.u + op.w, op.zb, 0), P(pl, op.u + op.w, op.zb, -depth), P(pl, op.u - op.w, op.zb, -depth), P(pl, op.u, op.zb - 1, -depth / 2))
      for (let k = 0; k < NA; k++) {
        const a0 = (k * Math.PI) / NA, a1 = ((k + 1) * Math.PI) / NA, am = (a0 + a1) / 2
        const A = (a: number, off: number) => P(pl, op.u + op.w * Math.cos(a), op.zs + op.w * Math.sin(a), off)
        face(reveal, A(a0, 0), A(a1, 0), A(a1, -depth), A(a0, -depth), P(pl, op.u + 3 * Math.cos(am), op.zs + 3 * Math.sin(am), -depth / 2))
      }
    }
    if (back) panel(back, pl, op.u, op.w, op.zb, op.zs + op.w, true, -depth)
  }
  rect(front, pl, cur, u1, z0, z1)
}

/** A closed box (no bottom). */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const c: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]
  face(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], c)
  face(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], c)
  face(p, [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], c)
  face(p, [x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1], c)
  face(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], c)
}

function build() {
  const brick = new Part(), stone = new Part(), roof = new Part(), win = new Part(), shade = new Part()

  const HX = 7.75, HY = 44, TX = 8, TY = 7.75
  const ZB = 5.4, ZC = 12.9, ZW = 13.5, ZT = 19.0, ZTT = 19.8
  const PAV = 38 // end pavilions from |y| = 38 to 44
  const STRIPES = [1.0, 2.1, 3.2, 4.3]
  const bandsOn = (pl: Plane, u0: number, u1: number) => { for (const z of STRIPES) rect(brick, pl, u0, u1, z, z + 0.4, 0.03) }

  for (const sy of [-1, 1]) {
    // u runs +y on the east face and the west face alike; ranges for this wing:
    const wingU: [number, number] = sy > 0 ? [TY, HY] : [-HY, -TY]
    const uIn = (a: number) => sy * a // distance from the centre along the wing -> u
    const span = (a: number, b: number): [number, number] => sy > 0 ? [a, b] : [-b, -a]

    // ---------------- east (entrance) face, +x ----------------
    const E: Plane = { o: [HX, 0], u: [0, 1], n: [1, 0] }
    wall(stone, E, wingU[0], wingU[1], 0, ZB)
    bandsOn(E, wingU[0], wingU[1])
    // Brick zone with the loggia: 5 round-headed bays from the tower to |y| 20.
    const loggia: Opening[] = Array.from({ length: 5 }, (_, k) => ({ u: uIn(TY + 1.25 + 2.5 * k), w: 1.0, zb: ZB + 0.2, zs: 11.6 }))
    wall(brick, E, wingU[0], wingU[1], ZB, ZC, loggia, 2.4, stone, win)
    // White columns on the loggia piers.
    for (let k = 1; k < 5; k++) rect(stone, E, uIn(TY + 2.5 * k) - 0.25, uIn(TY + 2.5 * k) + 0.25, ZB + 0.2, 11.6, 0.05)
    // Windows: the plain bays beyond the loggia, and the pavilion.
    for (const a of [21.8, 25.4, 29.0, 32.6, 36.2]) {
      panel(win, E, uIn(a), 0.55, 1.6, 3.7, false, 0.07)
      panel(win, E, uIn(a), 0.65, 6.3, 8.8)
      panel(win, E, uIn(a) - 0.5, 0.38, 10.0, 12.4, true); panel(win, E, uIn(a) + 0.5, 0.38, 10.0, 12.4, true)
    }
    panel(win, E, uIn(41), 0.65, 1.6, 3.9, true, 0.07); panel(win, E, uIn(41), 0.65, 6.3, 8.8)
    panel(win, E, uIn(41) - 0.5, 0.38, 10.0, 12.4, true); panel(win, E, uIn(41) + 0.5, 0.38, 10.0, 12.4, true)

    // ---------------- west (quad) face, -x ----------------
    const Wp: Plane = { o: [-HX, 0], u: [0, -1], n: [-1, 0] }
    // On this plane u runs -y, so a model y maps to u = -y.
    const wU: [number, number] = [-wingU[1], -wingU[0]]
    const pitch = (PAV - TY) / 7
    const arcade: Opening[] = Array.from({ length: 7 }, (_, k) => ({ u: -uIn(TY + pitch * (k + 0.5)), w: 1.73, zb: 0, zs: 2.9 }))
    wall(stone, Wp, wU[0], wU[1], 0, ZB, arcade, 3.0, shade, shade)
    // Brick bands only on the pavilion's base (the arcade is plain stone).
    { const [a, b] = span(PAV, HY); bandsOn(Wp, -b, -a) }
    wall(brick, Wp, wU[0], wU[1], ZB, ZC)
    for (let k = 0; k < 7; k++) {
      const u = -uIn(TY + pitch * (k + 0.5))
      panel(win, Wp, u, 0.65, 6.3, 8.8)
      panel(win, Wp, u - 0.5, 0.38, 10.0, 12.4, true); panel(win, Wp, u + 0.5, 0.38, 10.0, 12.4, true)
    }
    // White columns between the bays, rising to finials over the balustrade.
    for (let k = 1; k < 7; k++) {
      const yk = sy * (TY + pitch * k)
      box(stone, -HX - 0.4, -HX, yk - 0.4, yk + 0.4, ZB, ZC)
      box(stone, -HX - 0.1, -HX + 0.45, yk - 0.3, yk + 0.3, ZW, 15.6)
    }
    panel(win, Wp, -uIn(41), 0.7, 0.0, 3.6, true, 0.07); panel(win, Wp, -uIn(41), 0.65, 6.3, 8.8)
    panel(win, Wp, -uIn(41) - 0.5, 0.38, 10.0, 12.4, true); panel(win, Wp, -uIn(41) + 0.5, 0.38, 10.0, 12.4, true)

    // ---------------- end face ----------------
    const Np: Plane = sy > 0 ? { o: [0, HY], u: [-1, 0], n: [0, 1] } : { o: [0, -HY], u: [1, 0], n: [0, -1] }
    wall(stone, Np, -HX, HX, 0, ZB); bandsOn(Np, -HX, HX)
    wall(brick, Np, -HX, HX, ZB, ZC)
    for (const u of [-3.4, 3.4]) {
      panel(win, Np, u, 0.55, 1.6, 3.7, false, 0.07); panel(win, Np, u, 0.65, 6.3, 8.8)
      panel(win, Np, u - 0.5, 0.38, 10.0, 12.4, true); panel(win, Np, u + 0.5, 0.38, 10.0, 12.4, true)
    }

    // String course over the base, cornice, balustrade and pavilion parapets.
    const [y0, y1] = span(TY, HY)
    box(stone, -HX - 0.12, HX + 0.12, y0, sy > 0 ? y1 + 0.12 : y1, ZB - 0.1, ZB + 0.2)
    box(stone, -HX - 0.15, HX + 0.15, sy > 0 ? y0 : y0 - 0.15, sy > 0 ? y1 + 0.15 : y1, ZC, ZW)
    const [b0, b1] = span(TY, PAV)
    for (const sx of [-1, 1]) box(stone, sx > 0 ? HX - 0.35 : -HX, sx > 0 ? HX : -HX + 0.35, b0, b1, ZW, 14.4)
    const [p0, p1] = span(PAV, HY)
    for (const sx of [-1, 1]) box(brick, sx > 0 ? HX - 0.4 : -HX, sx > 0 ? HX : -HX + 0.4, p0, p1, ZW, 15.55)
    box(brick, -HX + 0.4, HX - 0.4, sy > 0 ? HY - 0.4 : -HY, sy > 0 ? HY : -HY + 0.4, ZW, 15.55)
    for (const sx of [-1, 1]) box(stone, sx > 0 ? HX - 0.45 : -HX - 0.05, sx > 0 ? HX + 0.05 : -HX + 0.45, p0 - 0.05, p1 + 0.05, 15.55, 15.9)
    box(stone, -HX + 0.45, HX - 0.45, sy > 0 ? HY - 0.45 : -HY - 0.05, sy > 0 ? HY + 0.05 : -HY + 0.45, 15.55, 15.9)

    // Low hipped roof: eaves 14.1 inside the balustrade, ridge 16.6, hipped at the end.
    const ex = HX - 0.35, ye = sy * (HY - 0.4), yr = sy * (HY - 0.4 - ex), yt = sy * TY, zr = 16.6, ze = 13.6
    for (const sx of [-1, 1]) {
      const out: V3 = [sx * 0.3, 0, 1]
      triOut(roof, [sx * ex, yt, ze], [sx * ex, ye, ze], [0, yr, zr], out)
      triOut(roof, [sx * ex, yt, ze], [0, yr, zr], [0, yt, zr], out)
    }
    triOut(roof, [-ex, ye, ze], [ex, ye, ze], [0, yr, zr], [0, sy * 0.3, 1])
  }

  // ---------------- the tower ----------------
  const Te: Plane = { o: [TX, 0], u: [0, 1], n: [1, 0] }
  const Tw: Plane = { o: [-TX, 0], u: [0, -1], n: [-1, 0] }
  const SP: Opening = { u: 0, w: 2.25, zb: 0, zs: 5.6 }
  const Z9 = 9.4
  // Lower stage: brick, the Sallyport through it east to west, the banded
  // marble base either side of the arch's white frame.
  const B = SP.w + 0.95
  wall(brick, Te, -TY, TY, 0, Z9, [SP], 2 * TX, shade, null)
  wall(brick, Tw, -TY, TY, 0, Z9, [SP])
  for (const pl of [Te, Tw]) {
    rect(stone, pl, -TY, -B, 0, ZB, 0.02); rect(stone, pl, B, TY, 0, ZB, 0.02)
    for (const z of STRIPES) { rect(brick, pl, -TY, -B, z, z + 0.4, 0.04); rect(brick, pl, B, TY, z, z + 0.4, 0.04) }
    // White stone frame edging the arch's field, up to the band at 9.4.
    for (const s of [-1, 1]) rect(stone, pl, s > 0 ? B + 0.6 : -B - 1.1, s > 0 ? B + 1.1 : -B - 0.6, ZB, Z9, 0.04)
    // The arch's frame: a broad band round the arch and down the jambs, 0.25 m proud.
    const off = 0.25
    for (const s of [-1, 1]) {
      rect(stone, pl, s > 0 ? SP.w : -B, s > 0 ? B : -SP.w, 0, SP.zs, off)
      face(stone, P(pl, s * B, 0, 0), P(pl, s * B, 0, off), P(pl, s * B, SP.zs, off), P(pl, s * B, SP.zs, 0), P(pl, 0, 2, 0))
      face(stone, P(pl, s * SP.w, 0, 0), P(pl, s * SP.w, 0, off), P(pl, s * SP.w, SP.zs, off), P(pl, s * SP.w, SP.zs, 0), P(pl, s * 5, 2, 0))
    }
    for (let k = 0; k < 12; k++) {
      const a0 = (k * Math.PI) / 12, a1 = ((k + 1) * Math.PI) / 12, am = (a0 + a1) / 2
      const I = (a: number, o: number) => P(pl, SP.w * Math.cos(a), SP.zs + SP.w * Math.sin(a), o)
      const O = (a: number, o: number) => P(pl, B * Math.cos(a), SP.zs + B * Math.sin(a), o)
      face(stone, I(a0, off), O(a0, off), O(a1, off), I(a1, off), P(pl, 0, SP.zs, -1))
      face(stone, O(a0, 0), O(a1, 0), O(a1, off), O(a0, off), P(pl, 0, SP.zs, off / 2))
      face(stone, I(a0, 0), I(a1, 0), I(a1, off), I(a0, off), P(pl, 4 * Math.cos(am), SP.zs + 4 * Math.sin(am), off / 2))
    }
  }
  // Brick upper stages and the stone top band.
  wall(brick, Te, -TY, TY, Z9, ZT)
  const topLoggia: Opening[] = [-3.2, -1.6, 0, 1.6, 3.2].map(u => ({ u, w: 0.6, zb: 15.0, zs: 17.4 }))
  wall(brick, Tw, -TY, TY, Z9, ZT, topLoggia, 1.2, stone, win)
  for (const pl of [Te, Tw]) {
    wall(stone, pl, -TY, TY, ZT, ZTT)
    rect(stone, pl, -TY, TY, Z9, Z9 + 0.4, 0.06)
    rect(stone, pl, -TY, TY, ZC, ZW, 0.06)
    // Tier of grouped round-arched windows: three in the middle, one each side.
    for (const u of [-1.2, 0, 1.2]) panel(win, pl, u, 0.45, 10.2, 12.4, true)
    for (const u of [-4.9, 4.9]) panel(win, pl, u, 0.5, 10.2, 12.4, true)
  }
  for (const u of [-1.2, 0, 1.2]) panel(win, Te, u, 0.45, 15.0, 17.6, true)
  for (const u of [-4.9, 4.9]) { panel(win, Te, u, 0.5, 15.0, 17.6, true); panel(win, Tw, u, 0.5, 15.0, 17.6, true) }
  // The tower's ends, above the wings' roofs.
  for (const sy of [-1, 1]) {
    const pl: Plane = sy > 0 ? { o: [0, TY], u: [-1, 0], n: [0, 1] } : { o: [0, -TY], u: [1, 0], n: [0, -1] }
    wall(stone, pl, -TX, TX, 0, ZB)
    wall(brick, pl, -TX, TX, ZB, ZT)
    wall(stone, pl, -TX, TX, ZT, ZTT)
    panel(win, pl, 0, 0.5, 15.2, 17.8, true)
    // Corner pinnacles with domed caps.
    for (const sx of [-1, 1]) {
      const cx = sx * (TX - 0.45), cy = sy * (TY - 0.45)
      box(stone, cx - 0.45, cx + 0.45, cy - 0.45, cy + 0.45, ZTT, 21.0)
      for (let k = 0; k < 8; k++) {
        const a0 = (k * Math.PI) / 4, a1 = ((k + 1) * Math.PI) / 4
        const r = 0.42, q0: V3 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0), 21.0], q1: V3 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1), 21.0]
        const m0: V3 = [cx + 0.3 * Math.cos(a0), cy + 0.3 * Math.sin(a0), 21.45], m1: V3 = [cx + 0.3 * Math.cos(a1), cy + 0.3 * Math.sin(a1), 21.45]
        const am = (a0 + a1) / 2, out: V3 = [Math.cos(am), Math.sin(am), 0.6]
        triOut(stone, q0, q1, m1, out); triOut(stone, q0, m1, m0, out)
        triOut(stone, m0, m1, [cx, cy, 21.8], [Math.cos(am), Math.sin(am), 1.2])
      }
    }
  }
  // The tower's roof and the attic over its middle.
  face(roof, [-TX, -TY, ZTT], [TX, -TY, ZTT], [TX, TY, ZTT], [-TX, TY, ZTT], [0, 0, 0])
  box(stone, -TX + 1.2, TX - 1.2, -5.0, 5.0, ZTT, 21.2)

  finishModel('Lovett Hall', 'hou-rice-lovett-hall', [
    { part: brick, material: finish('lovett-brick', 0xcf9a78) },
    { part: stone, material: finish('lovett-marble', 0xf1eadf) },
    { part: roof, material: { ...PALETTE.roof, color: 0x8f979c } },
    { part: win, material: PALETTE.window },
    { part: shade, material: finish('lovett-shade', 0x8a6a58) },
  ], { bearing: 335.5, osm: 'way/44896261', height: 21.8 }, 6500)
}

if (import.meta.main) build()
