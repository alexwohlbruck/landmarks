/**
 * Buckingham Palace, London (John Nash and Edward Blore 1826-50; east front
 * refaced by Sir Aston Webb, 1913): original procedural geometry, CC0-1.0.
 * bun generators/london-buckingham-palace.ts
 *
 * Map frame, turned to BEARING 326.5: +x is model east = compass 56.5 deg,
 * the way the east front faces down the Mall; +y is model north = compass
 * 326.5 deg; z up, metres. Origin = the area centroid of the outer ring of
 * the OSM multipolygon relation/5208404 (-0.142480, 51.500872), on the
 * ground. y = 0 is the quadrangle's floor; the forecourt in front of the
 * east front is ~0.4 m higher, the garden ~0.6 m higher.
 *
 * What makes it Buckingham Palace, and how each is drawn
 * - The 1913 east front (Portland stone, slightly greyer than the palette's
 *   stone): 108 m long, a rusticated ground floor with three arched gateways,
 *   a first-floor balustrade, giant Corinthian pilasters between the window
 *   bays, a deep cornice and a balustraded parapet. The centre (18.7 m)
 *   projects with four attached columns, a pediment and the attic block
 *   behind it carrying the flagpole; the famous balcony runs across it at
 *   first-floor level over the central arch. The two end pavilions project
 *   with four attached columns, a pediment and a raised attic each. All real
 *   geometry: round columns, boxed pilasters, a balustrade of pedestals, rail
 *   and recessed infill, window hoods, pediments as solid prisms.
 * - The open quadrangle behind (the map draws its ground; the inner walls
 *   carry windows) and the long north and south wings.
 * - The west garden front (Nash, Bath stone, warmer): the central bow with
 *   six attached columns, its upper drum and a shallow green copper dome; the
 *   raised attic behind it; the two columned loggias (real recesses behind
 *   free-standing columns); the frieze and cornice; the top storey over the
 *   centre range; balustrades over the end ranges.
 * - The Ballroom block (1855) to the south-west under its hipped roof, the
 *   lower service ranges and annexes the outline takes in.
 * - Second pass (lead review): the giant order made bold relief - pilasters
 *   0.75 m proud with capitals 0.9 m, attached columns of 0.75 m radius on
 *   the centre and 0.68 m on the pavilions, the entablature breaking forward
 *   over them; the ground floor in three broad rusticated courses 0.28 m
 *   proud with deep grooves; a heavier cornice (1.0 m projection) and parapet
 *   balustrade; tall first- and second-floor windows in stone surrounds with
 *   hoods; the pediments' raking cornices 0.5 m proud and 0.6 m deep; the
 *   Portland stone shifted warmer and pinker. To stay under 250 KB the
 *   quadrangle side of the east wing has two window rows, and the low
 *   service ranges and annexes (south-west, north-west, north-east) are
 *   plain walls.
 * - Night: the east front is floodlit (portland stone carries _FLOODLIGHT on
 *   east-facing faces); windows glow.
 *
 * Evidence
 * - OSM (ODbL): outline relation/5208404 (building=palace, height 23.4,
 *   3 levels, wikidata Q42182, Historic England list entry 1239087), outer
 *   way/348343214, inner (quadrangle, man_made=courtyard) way/349637488 and
 *   two small light wells way/356378617, way/356378618 (covered by the low
 *   south range here). Parts inside it: way/1037796041, way/1213040567
 *   (Palace Chapel), way/1226754887..1226754902, way/1226905189. Their
 *   heights (6-24 m) are coarse; the lidar was used instead.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (composite of flights ~2000-2022). Ground: forecourt 4.1, quadrangle
 *   3.7, garden 4.3 m above the box's ground_min. Measured, above the
 *   quadrangle floor: east front parapet 22.9 (23.3 above the forecourt,
 *   OSM 23.4), its lead roof 24.3, end-pavilion attics 26.3, centre attic
 *   28.3; north and south wings 18.5; west (garden) range 22.8 with the attic
 *   behind the bow 26.2 and the bow's dome 25.0; the inner west range 20.3;
 *   the Ballroom roof 26 (walls ~22); the south range 14.1; the west service
 *   wing 9.5; the north-west annex 9.3; the south-east annex 8.3; the long
 *   north-east range 7.4.
 * - Plan from the OSM outline read in the model frame: east front face
 *   x = 69.1, centre projection 71.6 (y 9.1..27.8), end pavilions 70.7
 *   (y -35.8..-22.3 and 58.2..71.4); the quadrangle x -14..55.3, y -18.8..54.5;
 *   the garden front x = -48.4 with the bow (radius 7.3, centre y 18.9) and
 *   the loggia projections at x = -50.3 (y -8.4..-1.5, 39.9..46.6).
 * - Published: east front 108 m long, refaced in Portland stone 1913 (Aston
 *   Webb); the garden front in Bath stone (Wikipedia "Buckingham Palace";
 *   Historic England 1239087). The model's east front is 107.2 m.
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Buckingham Palace, London - April 2009.jpg", Diliff, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Buckingham_Palace,_London_-_April_2009.jpg
 *     (east front from the north-east, level: storey heights, centre and
 *     pavilion columns, pediments, flagpole height);
 *   "Buckingham Palace from gardens, London, UK - Diliff.jpg", Diliff, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Buckingham_Palace_from_gardens,_London,_UK_-_Diliff.jpg
 *     (east front from the south-east);
 *   "Buckingham Palace London Morning 2020 04.jpg", Julian Herzog, CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Buckingham_Palace_London_Morning_2020_04.jpg
 *     (close oblique of the east front: first-floor balustrade, arches,
 *     window hoods, pavilion attic);
 *   "Rear of Buckingham Palace in 2025.jpg", Dgp4004, CC0,
 *     https://commons.wikimedia.org/wiki/File:Rear_of_Buckingham_Palace_in_2025.jpg
 *     (garden front: bow, green dome, raised attic, loggias, top storey);
 *   "Buckingham Palace from the air - geograph.org.uk - 4597489.jpg",
 *     Thomas Nugent, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Buckingham_Palace_from_the_air_-_geograph.org.uk_-_4597489.jpg
 *     (from the air: quadrangle, grey roofs, wing layout);
 *   "Buckingham Palace at night.jpg", Tristan Surtel, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Buckingham_Palace_at_night.jpg
 *     (floodlit east front).
 * - Look-only: none.
 *
 * Estimated (from the photos against the lidar): every storey line (ground
 * floor 8.2 m, first-floor balustrade 8.2-9.6, cornice 19.4-20.5, parapet to
 * 22.9), the bay count (7 bays each side of the centre), the column and
 * pilaster sizes, the pediment pitch, the flagpole (11.7 m above the attic,
 * scaled from Diliff's level photo), the garden front's storey lines and its
 * column counts. The tympanum sculpture, the window hoods' alternation, the
 * gates and railings and the forecourt are left out (the forecourt, gates
 * and the Victoria Memorial are outside the outline).
 *
 * Doubts
 * - The inner faces of the quadrangle and the north and south wings are drawn
 *   with generic grouped windows from the aerial and the lidar only; no level
 *   photo of them was used.
 * - Part of the outline south-west (x -63.5..-50.8, y -97..-84) reads as open
 *   ground in the lidar; it is left open.
 * - The map's terrain under the palace is uneven (0-3.8 m); the east front
 *   may sink a little at its foot.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { massing, type XY, type Facade } from './nyc-570-lexington'
import { lathe, tube, TAU } from './nyc-columbus-monument'

export const BEARING = 326.5

/** Write models/<id>.glb, enforcing the budget (LOOSE=1 skips the checks while iterating). */
export function writeModel(name: string, id: string, parts: { part: Part; material: MaterialSpec }[], extras: Record<string, unknown>, maxTris: number, file = id) {
  const tris = parts.reduce((s, { part }) => s + part.triangles, 0)
  const glb = writeGlb(name, parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...extras })
  const maxBytes = maxTris > 8000 ? 1536 * 1024 : 250 * 1024
  console.log(`${id}: ${tris} triangles, ${glb.length} bytes; ` + parts.map(({ part, material }) => `${material.name} ${part.triangles}`).join(', '))
  if (!process.env.LOOSE) {
    if (tris > maxTris) throw new Error(`${id}: triangle budget exceeded: ${tris}`)
    if (glb.length > maxBytes) throw new Error(`${id}: file budget exceeded: ${glb.length}`)
    if (parts.length > 6) throw new Error(`${id}: too many materials`)
  }
  Bun.write(new URL(`../models/${file}.glb`, import.meta.url).pathname, glb)
}

// ---------------------------------------------------------------------------
// Small geometry kit (axis-aligned; everything here is square to the frame).
// ---------------------------------------------------------------------------

const ringXY = (x0: number, y0: number, x1: number, y1: number, z: number): V3[] => [
  [x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z],
]

/** A box: four walls and a top (no bottom). */
export function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top = true) {
  p.loft([ringXY(x0, y0, x1, y1, z0), ringXY(x0, y0, x1, y1, z1)])
  if (top) p.cap(ringXY(x0, y0, x1, y1, z1), true)
}

/** A box with chamfered vertical edges (c) for a softer silhouette. */
export function cbox(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, c = 0.3) {
  if (c <= 0) return box(p, x0, y0, x1, y1, z0, z1)
  const r = (z: number): V3[] => [
    [x0 + c, y0, z], [x1 - c, y0, z], [x1, y0 + c, z], [x1, y1 - c, z],
    [x1 - c, y1, z], [x0 + c, y1, z], [x0, y1 - c, z], [x0, y0 + c, z],
  ]
  p.loft([r(z0), r(z1)])
  p.cap(r(z1), true)
}

/** A low hipped roof: a frustum from the rectangle at z0 to an inset ridge at z1. */
export function hip(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, inset: number) {
  const ix = Math.min(inset, (x1 - x0) / 2 - 0.2), iy = Math.min(inset, (y1 - y0) / 2 - 0.2)
  p.loft([ringXY(x0, y0, x1, y1, z0), ringXY(x0 + ix, y0 + iy, x1 - ix, y1 - iy, z1)])
  p.cap(ringXY(x0 + ix, y0 + iy, x1 - ix, y1 - iy, z1), true)
}

/** A wall face: points a→b in counter-clockwise ring order (outward normal on the right of a→b seen from above). */
export type Face = { a: XY; b: XY }
export const faceAt = (f: Face, s: number, z: number, d: number): V3 => {
  const L = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1]), ux = (f.b[0] - f.a[0]) / L, uy = (f.b[1] - f.a[1]) / L
  return [f.a[0] + ux * s + uy * d, f.a[1] + uy * s - ux * d, z]
}
export const faceLen = (f: Face) => Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1])

/** A flat panel on a face, s0..s1 along it, z0..z1, d proud of it. */
export function panel(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d = 0.06) {
  p.quad(faceAt(f, s0, z0, d), faceAt(f, s1, z0, d), faceAt(f, s1, z1, d), faceAt(f, s0, z1, d))
}

/** A round-headed panel: rectangle to zs, semicircle above (n segments). */
export function archPanel(p: Part, f: Face, sc: number, w: number, z0: number, zs: number, d = 0.06, n = 8) {
  const r = w / 2
  panel(p, f, sc - r, sc + r, z0, zs, d)
  const c = faceAt(f, sc, zs, d)
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI * i / n, a1 = Math.PI * (i + 1) / n
    p.tri(c, faceAt(f, sc + r * Math.cos(a0), zs + r * Math.sin(a0), d), faceAt(f, sc + r * Math.cos(a1), zs + r * Math.sin(a1), d))
  }
}

/**
 * A block standing on a face: s0..s1 along it, z0..z1, from d0 to d1 out
 * from it. Draws the front, the two ends and the top; the back sits on the
 * wall. `bottom` adds the soffit (for ledges seen from below).
 */
export function proud(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number, o: { bottom?: boolean; ends?: boolean; top?: boolean } = {}) {
  const P = (s: number, z: number, d: number) => faceAt(f, s, z, d)
  p.quad(P(s0, z0, d1), P(s1, z0, d1), P(s1, z1, d1), P(s0, z1, d1))
  if (o.top !== false) p.quad(P(s0, z1, d1), P(s1, z1, d1), P(s1, z1, d0), P(s0, z1, d0))
  if (o.ends !== false) {
    p.quad(P(s0, z0, d0), P(s0, z0, d1), P(s0, z1, d1), P(s0, z1, d0))
    p.quad(P(s1, z0, d1), P(s1, z0, d0), P(s1, z1, d0), P(s1, z1, d1))
  }
  if (o.bottom) p.quad(P(s0, z0, d0), P(s1, z0, d0), P(s1, z0, d1), P(s0, z0, d1))
}

/** A triangular pediment on a face: base s0..s1 at z0, apex rise h, from d0 to d1 out of the face. Raking top in `top`. */
export function pediment(body: Part, top: Part, f: Face, s0: number, s1: number, z0: number, h: number, d0: number, d1: number) {
  const P = (s: number, z: number, d: number) => faceAt(f, s, z, d)
  const sm = (s0 + s1) / 2
  // Front triangle.
  body.tri(P(s0, z0, d1), P(s1, z0, d1), P(sm, z0 + h, d1))
  // Raking roofs.
  top.quad(P(s1, z0, d1), P(s1, z0, d0), P(sm, z0 + h, d0), P(sm, z0 + h, d1))
  top.quad(P(sm, z0 + h, d1), P(sm, z0 + h, d0), P(s0, z0, d0), P(s0, z0, d1))
  // A raking cornice lip proud of the tympanum.
  const t = 0.6, o = 0.5
  top.quad(P(s0 + 0.4, z0 + 0.05, d1 + o), P(sm, z0 + h - t, d1 + o), P(sm, z0 + h + 0.15, d1 + o), P(s0 - 0.3, z0 - 0.05, d1 + o))
  top.quad(P(sm, z0 + h - t, d1 + o), P(s1 - 0.4, z0 + 0.05, d1 + o), P(s1 + 0.3, z0 - 0.05, d1 + o), P(sm, z0 + h + 0.15, d1 + o))
  // Raking cornice soffits/edges (so the lip has thickness from above).
  top.quad(P(s0 - 0.3, z0 - 0.05, d1 + o), P(sm, z0 + h + 0.15, d1 + o), P(sm, z0 + h + 0.15, d1), P(s0 - 0.3, z0 - 0.05, d1))
  top.quad(P(sm, z0 + h + 0.15, d1 + o), P(s1 + 0.3, z0 - 0.05, d1 + o), P(s1 + 0.3, z0 - 0.05, d1), P(sm, z0 + h + 0.15, d1))
}

/** An attached or free column: square base, 8-sided tapering shaft, square capital. */
export function column(p: Part, cx: number, cy: number, z0: number, z1: number, r: number) {
  lathe(p, [[r, z0], [r * 0.88, z1 - 0.9]], 8, cx, cy, false)
  // Capital: a block flaring to the abacus.
  box(p, cx - r * 1.3, cy - r * 1.3, cx + r * 1.3, cy + r * 1.3, z1 - 0.9, z1)
}

/**
 * A balustrade on a straight axis-aligned run along a face: plinth, rail,
 * the baluster zone as a recessed band, and pedestals every `pitch` m.
 */
export function balustrade(p: Part, f: Face, s0: number, s1: number, z0: number, h: number, d0: number, d1: number, pitch = 4) {
  const ph = Math.min(0.35, h * 0.2), rh = Math.min(0.3, h * 0.2)
  proud(p, f, s0, s1, z0, z0 + ph, d0, d1)
  proud(p, f, s0, s1, z0 + h - rh, z0 + h, d0, d1, { bottom: true })
  const inset = (d1 - d0) * 0.35
  proud(p, f, s0, s1, z0 + ph, z0 + h - rh, d0, d1 - inset, { top: false, ends: false })
  const n = Math.max(1, Math.round((s1 - s0) / pitch))
  for (let i = 0; i <= n; i++) {
    const s = s0 + (s1 - s0) * i / n, w = 0.38
    proud(p, f, Math.max(s0, s - w), Math.min(s1, s + w), z0 + ph, z0 + h - rh, d0, d1, { top: false })
  }
}

// ---------------------------------------------------------------------------
// The palace
// ---------------------------------------------------------------------------

function build() {
  const port = new Part(), bath = new Part(), trim = new Part(), roof = new Part(), win = new Part(), dome = new Part()

  // ===== East front (Portland stone) =====================================
  const XF = 69.1, XC = 71.6, XP = 70.7, XQ = 55.2 // main face, centre, pavilions, quadrangle face
  const YS0 = -35.8, YS1 = -22.3, YN0 = 58.2, YN1 = 71.4, YC0 = 9.1, YC1 = 27.8
  const ZG = 8.2, ZB = 9.6, ZK = 19.4, ZC = 20.4, ZP = 22.9 // ground floor top, balustrade top, capitals, cornice top, parapet top
  const XPB = 48.6 // pavilions' back

  // Bodies to the cornice.
  cbox(port, XQ, YS1 - 0.01, XF, YC0 + 0.01, 0, ZK, 0.0)
  cbox(port, XQ, YC1 - 0.01, XF, YN0 + 0.01, 0, ZK, 0.0)
  cbox(port, XQ - 1, YC0, XC, YC1, 0, ZK, 0.0)
  cbox(port, XPB, YS0, XP, YS1, 0, ZK, 0.35)
  cbox(port, XPB, YN0, XP, YN1, 0, ZK, 0.35)

  // Faces of the east front (counter-clockwise ring order: running +y on the +x face).
  const fS: Face = { a: [XF, YS1], b: [XF, YC0] }
  const fN: Face = { a: [XF, YC1], b: [XF, YN0] }
  const fC: Face = { a: [XC, YC0], b: [XC, YC1] }
  const fPS: Face = { a: [XP, YS0], b: [XP, YS1] }
  const fPN: Face = { a: [XP, YN0], b: [XP, YN1] }

  // Cornice: a deep projecting band all round the east wing's outer faces.
  const corn = (x0: number, y0: number, x1: number, y1: number) => {
    box(trim, x0 - 0.35, y0 - 0.35, x1 + 0.35, y1 + 0.35, ZK, ZK + 0.4)
    box(trim, x0 - 1.0, y0 - 1.0, x1 + 1.0, y1 + 1.0, ZK + 0.4, ZC + 0.1)
  }
  corn(XQ, YS1, XF, YN0)
  corn(XQ - 1, YC0, XC, YC1)
  corn(XPB, YS0, XP, YS1)
  corn(XPB, YN0, XP, YN1)

  // Ground-floor top: a string course / ledge carrying the first-floor balustrade.
  for (const f of [fS, fN, fC, fPS, fPN]) {
    proud(trim, f, 0, faceLen(f), ZG - 0.45, ZG, 0, 0.9, { bottom: true })
    balustrade(trim, f, 0.3, faceLen(f) - 0.3, ZG, ZB - ZG, 0.15, 0.7, 4.4)
  }
  // The balcony: deeper, across the centre at first-floor level.
  proud(port, fC, 2.5, faceLen(fC) - 2.5, ZG - 0.6, ZG, 0, 2.0)
  balustrade(trim, fC, 2.5, faceLen(fC) - 2.5, ZG, 1.15, 1.5, 2.0, 2.4)
  // Returns of the balcony balustrade.
  for (const s of [2.5, faceLen(fC) - 2.5]) proud(trim, fC, s - 0.25, s + 0.25, ZG, ZG + 1.15, 0.5, 2.0)

  // Windows and pilasters along the two main runs: 7 bays each.
  // Rusticated ground floor: three broad banded courses proud of the wall,
  // with deep grooves between (real relief).
  const rusticate = (f: Face) => {
    const L = faceLen(f)
    for (const [z0, z1] of [[0, 2.5], [2.85, 5.25], [5.6, ZG - 0.45]] as [number, number][]) proud(port, f, 0, L, z0, z1, 0, 0.28)
  }
  // One bay's windows: tall panels in stone surrounds, a hood over the
  // first-floor window, a smaller second-floor window, a frieze light.
  const bayWindows = (f: Face, c: number, deepHood = false) => {
    panel(win, f, c - 0.75, c + 0.75, 2.0, 4.4, 0.34)
    proud(trim, f, c - 1.25, c + 1.25, 9.7, 13.8, 0, 0.1, { top: false, ends: false }) // surround
    panel(win, f, c - 1.0, c + 1.0, 9.9, 13.6, 0.16)
    proud(trim, f, c - 1.45, c + 1.45, 13.85, 14.3, 0, deepHood ? 0.6 : 0.45, { ends: false, bottom: true }) // hood
    proud(trim, f, c - 1.1, c + 1.1, 14.6, 17.55, 0, 0.1, { top: false, ends: false })
    panel(win, f, c - 0.88, c + 0.88, 14.75, 17.4, 0.16)
    panel(win, f, c - 0.6, c + 0.6, 18.0, 18.8, 0.06)
  }
  const bays = (f: Face, n: number, arch: number) => {
    const L = faceLen(f), pitch = L / n
    rusticate(f)
    for (let i = 0; i < n; i++) {
      const c = pitch * (i + 0.5)
      if (i === arch) {
        // Arched gateway through the rusticated ground floor, with its voussoir frame.
        archPanel(win, f, c, 3.2, 0, 4.4, 0.34, 8)
        frameArch(port, f, c, 3.2, 4.4)
        bayWindows(f, c)
        // (the gateway replaces the ground-floor window)
      } else bayWindows(f, c)
    }
    // Giant Corinthian pilasters at every bay line, bold relief on the ledge.
    for (let i = 0; i <= n; i++) {
      const s = pitch * i
      proud(port, f, Math.max(0, s - 0.6), Math.min(L, s + 0.6), ZB - 0.2, ZK - 0.7, 0, 0.75)
      proud(trim, f, Math.max(0, s - 0.75), Math.min(L, s + 0.75), ZK - 0.7, ZK, 0, 0.9, { bottom: true }) // capital
    }
  }
  bays(fS, 7, 3)
  bays(fN, 7, 3)

  // Columned compositions: the centre and the two end pavilions.
  const columned = (f: Face, nb: number, arch: boolean, colR: number) => {
    const L = faceLen(f), pitch = L / nb
    rusticate(f)
    for (let i = 0; i < nb; i++) {
      const c = pitch * (i + 0.5)
      if (arch && i === Math.floor(nb / 2)) {
        archPanel(win, f, c, 4.0, 0, 5.0, 0.34, 8)
        frameArch(port, f, c, 4.0, 5.0)
      }
      bayWindows(f, c, i === Math.floor(nb / 2))
    }
    // Attached columns at the inner bay lines, strong pilasters at the ends.
    for (let i = 0; i <= nb; i++) {
      const s = pitch * i
      if (i === 0 || i === nb) {
        const s0 = i === 0 ? 0 : L - 1.4, s1 = i === 0 ? 1.4 : L
        proud(port, f, s0, s1, ZB - 0.2, ZK - 0.7, 0, 0.8)
        proud(trim, f, s0, s1, ZK - 0.7, ZK, 0, 0.95, { bottom: true })
      } else {
        const p = faceAt(f, s, 0, colR * 0.85)
        column(port, p[0], p[1], ZB - 0.2, ZK, colR)
      }
    }
    // The entablature breaks forward over the columns.
    proud(trim, f, 0, L, ZK, ZC, 0.4, colR * 1.85 + 0.35, { bottom: true })
  }
  columned(fC, 3, true, 0.75)
  columned(fPS, 3, false, 0.68)
  columned(fPN, 3, false, 0.68)

  // Pediments over the centre and the pavilions, standing on the cornice.
  const pedFace = (f: Face, d1: number, rise: number) => pediment(port, trim, f, 0.2, faceLen(f) - 0.2, ZC + 0.05, rise, -1.5, d1)
  pedFace(fC, 1.7, 3.9)
  pedFace(fPS, 1.55, 2.9)
  pedFace(fPN, 1.55, 2.9)

  // Parapet balustrade along the main runs and round the pavilion and centre returns.
  const parapet = (f: Face, s0: number, s1: number) => balustrade(trim, f, s0, s1, ZC, ZP - ZC, -0.7, 0.45, 3.6)
  parapet(fS, 0, faceLen(fS))
  parapet(fN, 0, faceLen(fN))
  // Pavilion and wing returns (north and south ends, and the quadrangle side): plain parapet.
  box(port, XPB, YS0, XP, YS0 + 0.7, ZC, ZP - 0.4)
  box(port, XPB, YN1 - 0.7, XP, YN1, ZC, ZP - 0.4)
  box(port, XQ, YS1, XQ + 0.7, YN0, ZC, ZP - 0.6)
  box(trim, XPB, YS0 - 0.1, XP + 0.1, YS0 + 0.8, ZP - 0.4, ZP - 0.1)
  box(trim, XPB, YN1 - 0.8, XP + 0.1, YN1 + 0.1, ZP - 0.4, ZP - 0.1)

  // Lead roofs: a low hip over the main runs, raised attics over the pavilions and centre.
  hip(roof, XQ + 0.6, YS1, XF - 0.7, YN0, ZC, 24.3, 4.5)
  // Pavilion attics (stone walls, grey roof).
  for (const [y0, y1] of [[YS0 + 1.2, YS1 - 0.8], [YN0 + 0.8, YN1 - 1.2]]) {
    cbox(port, XPB + 1.2, y0, XP - 2.6, y1, ZC, 24.0, 0.3)
    box(trim, XPB + 0.9, y0 - 0.3, XP - 2.3, y1 + 0.3, 24.0, 24.4)
    hip(roof, XPB + 1.2, y0, XP - 2.6, y1, 24.4, 25.2, 2.5)
  }
  // Centre attic with the flagpole.
  cbox(port, 54.2, YC0 + 0.6, XC - 2.2, YC1 - 0.6, ZC, 25.9, 0.3)
  box(trim, 53.9, YC0 + 0.3, XC - 1.9, YC1 - 0.3, 25.9, 26.4)
  hip(roof, 54.2, YC0 + 0.6, XC - 2.2, YC1 - 0.6, 26.4, 26.9, 3)
  // Panels on the attic's front face (sunk relief reads as a slightly darker plate: trim).
  // Flagpole: a bold white pole on a plinth.
  const fx = 62.0, fy = (YC0 + YC1) / 2
  box(trim, fx - 0.6, fy - 0.6, fx + 0.6, fy + 0.6, 26.9, 27.6)
  tube(trim, [[fx, fy, 27.6], [fx, fy, 38.6]], [0.24, 0.15], 6)
  lathe(trim, [[0.01, 38.5], [0.32, 38.7], [0.01, 39.0]], 6, fx, fy, false)

  // Quadrangle side of the east wing: windows in three rows.
  {
    const f: Face = { a: [XQ, YN0 - 3.7], b: [XQ, YS1 + 3.5] } // faces −x, runs −y
    const L = faceLen(f), n = 11, pitch = L / n
    for (let i = 0; i < n; i++) {
      const c = pitch * (i + 0.5)
      for (const [z0, z1] of [[9.6, 13.0], [14.6, 17.0]]) panel(win, f, c - 0.8, c + 0.8, z0, z1)
    }
    proud(trim, f, 0, L, ZG - 0.35, ZG, 0, 0.3)
  }
  // The pavilions' end faces (north and south): pilasters, windows.
  for (const f of [
    { a: [XP, YN1], b: [XPB, YN1] } as Face, // faces +y
    { a: [XPB, YS0], b: [XP, YS0] } as Face, // faces −y
  ]) {
    const L = faceLen(f), n = 4, pitch = L / n
    for (let i = 0; i < n; i++) {
      const c = pitch * (i + 0.5)
      panel(win, f, c - 0.75, c + 0.75, 2.0, 4.6)
      panel(win, f, c - 0.85, c + 0.85, 10.0, 13.3)
      proud(trim, f, c - 1.1, c + 1.1, 13.45, 13.85, 0, 0.3, { ends: false })
      panel(win, f, c - 0.8, c + 0.8, 14.7, 17.0)
    }
    proud(trim, f, 0, L, ZG - 0.4, ZG, 0, 0.45)
    for (let i = 1; i < n; i++) proud(port, f, pitch * i - 0.45, pitch * i + 0.45, ZB, ZK, 0, 0.25)
  }

  // ===== The rest of the palace (Bath stone), a stepped union of ranges ===
  const wingFacade: Facade = { bay: 7.0, ratio: 0.3, floor: 4.7, group: 1, spandrel: 2.0, sill: 2.2, head: 2.3, ground: 2.2, minLength: 4 }
  const wingWin = new Part()
  massing({
    wall: bath, win: wingWin, roof, coping: trim, facade: wingFacade, bevel: 0.4,
    boxes: [
      // North wing (to the east wing's quadrangle face).
      [-47.4, 54.6, XQ + 0.4, 72.3, 18.5],
      // South wing: the high range on the quadrangle, the low range behind it.
      [-14.0, -29.5, XQ + 0.4, -18.8, 18.5],
      [-1.4, -43.0, XPB + 0.2, -29.5, 9.5],
      [36.4, -76.2, 48.8, -43.0, 8.3],
      // Inner west range, stepping round the Grand Entrance projection.
      [-36.2, -27.8, -14.0, 10.2, 20.3],
      [-36.2, 10.2, -5.5, 26.5, 20.3],
      [-36.2, 26.5, -16.5, 39.5, 20.3],
      [-36.2, 39.5, -13.6, 54.7, 20.3],
      // South-west: ranges round the Ballroom.
      [-50.6, -43.0, -14.0, -27.8, 19.0],
      [-14.0, -43.0, -1.4, -29.5, 21.0],
      [-50.6, -70.0, -16.0, -43.0, 22.2],
      [-16.0, -70.0, -1.4, -43.0, 21.0],
      [-50.8, -90.5, -15.5, -70.0, 14.1],
      [-15.5, -83.3, -1.4, -70.0, 8.0],
      [-70.6, -84.0, -50.6, -34.0, 9.6],
      [-72.4, -104.3, -63.5, -84.0, 5.6],
      [-63.5, -104.3, -56.5, -97.0, 5.6],
      // North-west and north-east annexes.
      [-71.2, 72.3, -41.0, 85.6, 9.3],
      [43.6, 72.3, 49.4, 110.1, 7.4],
      [40.6, 104.6, 43.6, 110.1, 7.4],
    ],
  })
  // Keep only the windows on walls that are really outside: drop those on
  // walls that butt into the east wing or the garden range.
  copyWhere(win, wingWin, ([x, y]) => !(x < -35.9 && y > -27.9 && y < 72.4) && !(x > 54.9) && !(x > 48.3 && (y < -22.2 || y > 58.1)) && y > -70.5 && y < 72.6 && x > -50.9)
  // (The low service ranges and annexes to the south-west, north-west and north-east are left as plain walls.)
  // The Ballroom's hipped roof.
  hip(roof, -49.6, -69.0, -17.0, -44.0, 22.2, 26.0, 7)

  // ===== West (garden) front, Nash, Bath stone ===========================
  const XW = -48.4, XB = -36.2 // garden face, back of the garden range
  const ZO = 13.0, ZE = 15.4, ZT = 22.8 // top of the order, top of the main cornice, top of the centre range
  // Ranges: [y0, y1, face x, height]
  const ends: [number, number, number][] = [[-27.8, -8.4, -47.1], [46.6, 65.5, -47.7], [65.5, 72.3, -50.6]]
  for (const [y0, y1, xf] of ends) {
    cbox(bath, xf, y0, XB, y1, 0, ZE, 0.0)
    hip(roof, xf + 2.5, y0, XB, y1, ZE, 18.6, 2.5)
    box(trim, xf - 0.5, y0, xf + 0.4, y1, ZO + 1.6, ZE)
    balustrade(trim, { a: [xf, y1], b: [xf, y0] }, 0.2, y1 - y0 - 0.2, ZE, 1.6, -0.4, 0.15, 4.5)
  }
  // Centre range (with the top storey) between the loggias.
  cbox(bath, XW, -8.4, XB, 46.6, 0, ZT - 0.8, 0.0)
  hip(roof, XW + 1.5, -8.4, XB, 46.6, ZT - 0.8, 23.6, 3)
  // Cornices: main (over the order) and top.
  box(trim, XW - 0.7, -8.4, XW + 0.3, 46.6, ZO + 1.6, ZE)
  box(trim, XW - 0.5, -8.4, XW + 0.3, 46.6, ZT - 1.3, ZT - 0.6)
  box(bath, XW - 0.25, -8.4, XW + 0.3, 46.6, ZO, ZO + 1.6) // frieze band
  for (const [y0, y1, xf] of ends) box(bath, xf - 0.25, y0, xf + 0.3, y1, ZO, ZO + 1.6)
  // Top-storey parapet.
  balustrade(trim, { a: [XW, 46.6], b: [XW, -8.4] }, 0.2, 54.8, ZT - 0.6, 1.0, -0.3, 0.1, 4.5)

  // Garden-front windows: tall French windows in the order with hoods and the
  // relief panels above them; the top storey's windows; plinth course.
  const gardenRun = (f: Face, n: number, top: boolean, skip: (c: number) => boolean = () => false) => {
    const L = faceLen(f), pitch = L / n
    for (let i = 0; i < n; i++) {
      const c = pitch * (i + 0.5)
      if (skip(c)) continue
      panel(win, f, c - 0.95, c + 0.95, 3.2, 7.8)
      proud(trim, f, c - 1.25, c + 1.25, 8.0, 8.45, 0, 0.3, { ends: false })
      if (top) panel(win, f, c - 0.8, c + 0.8, 16.6, 19.0)
    }
    proud(trim, f, 0, L, 0, 1.4, 0, 0.35) // plinth
  }
  // The centre range's face runs −y on the −x face: from y 46.6 to −8.4; skip the bow's span.
  gardenRun({ a: [XW, 39.9], b: [XW, 26.2] }, 3, true)
  gardenRun({ a: [XW, 11.6], b: [XW, -1.5] }, 3, true)
  for (const [y0, y1, xf] of ends) gardenRun({ a: [xf, y1], b: [xf, y0] }, Math.max(2, Math.round((y1 - y0) / 4.6)), false)
  // Relief panels in the centre range (the sculpted frieze panels between the windows' heads and the frieze).
  for (const [y0, y1] of [[27.5, 38.6], [-0.2, 10.3]]) proud(trim, { a: [XW, y1], b: [XW, y0] }, 0, y1 - y0, 9.8, 11.8, 0, 0.12)

  // Loggias: projections whose ground and order are open: columns standing in
  // front of the recessed wall, the entablature and attic carried over them.
  for (const [y0, y1] of [[-8.4, -1.5], [39.9, 46.6]]) {
    const XL = -50.3
    box(trim, XL - 0.35, y0, XW, y1, 0, 1.4)
    box(bath, XL - 0.25, y0, XW, y1, ZO, ZO + 1.6)
    box(trim, XL - 0.8, y0 - 0.3, XW, y1 + 0.3, ZO + 1.6, ZE)
    balustrade(trim, { a: [XL, y1 + 0.3], b: [XL, y0 - 0.3] }, 0, y1 - y0 + 0.6, ZE, 1.6, -0.5, 0.25, 3.5)
    // Four columns, the middle pair wider apart.
    for (const t of [0.12, 0.34, 0.66, 0.88]) column(bath, XL + 0.25, y0 + (y1 - y0) * t, 1.4, ZO, 0.5)
    // The recessed wall behind them has a tall window each side of the middle.
    const f: Face = { a: [XW, y1], b: [XW, y0] }
    panel(win, f, 1.4, 2.9, 2.6, 8.4)
    panel(win, f, (y1 - y0) - 2.9, (y1 - y0) - 1.4, 2.6, 8.4)
  }

  // The bow: a semicircular drum with six attached columns, its frieze and
  // cornice, the upper drum, a balustrade ring and the green dome.
  {
    const cx = -48.8, cy = 18.9, R = 7.3, n = 12
    const arc = (r: number, z0: number, z1: number, part: Part) => lathe(part, [[r, z0], [r, z1]], n, cx, cy, true)
    lathe(trim, [[R + 0.35, 0], [R + 0.35, 1.4]], n, cx, cy, true)
    arc(R, 1.4, ZO, bath)
    arc(R + 0.25, ZO, ZO + 1.6, bath)
    lathe(trim, [[R + 0.7, ZO + 1.6], [R + 0.7, ZE]], n, cx, cy, true)
    arc(R - 0.5, ZE, 20.2, bath)
    lathe(trim, [[R - 0.1, 20.2], [R - 0.1, 20.7]], n, cx, cy, true)
    // Shallow dome.
    const prof: [number, number][] = []
    for (let k = 0; k <= 5; k++) {
      const t = k / 5 * Math.PI / 2
      prof.push([Math.max(0.05, (R - 0.6) * Math.cos(t)), 20.7 + 4.3 * Math.sin(t)])
    }
    lathe(dome, prof, n, cx, cy, true)
    lathe(trim, [[0.6, 25.0], [0.45, 25.6], [0.05, 25.8]], 8, cx, cy, false) // lantern finial
    // Columns and windows round the outer half (facing −x).
    for (const k of [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5]) {
      const a = Math.PI + k * 0.5
      column(bath, cx + (R + 0.35) * Math.cos(a), cy + (R + 0.35) * Math.sin(a), 1.4, ZO, 0.48)
    }
    for (const k of [-2, -1, 0, 1, 2]) {
      const a = Math.PI + k * 0.5, w = 0.8
      const tx = -Math.sin(a), ty = Math.cos(a), nx = Math.cos(a), ny = Math.sin(a)
      const P = (s: number, z: number, r: number): V3 => [cx + nx * r + tx * s, cy + ny * r + ty * s, z]
      // Panels tangent to the drum, facing out.
      const q = (r: number, z0: number, z1: number, hw: number) => win.quad(P(-hw, z0, r), P(hw, z0, r), P(hw, z1, r), P(-hw, z1, r))
      q(R + 0.06, 2.6, 8.4, w)
      q(R - 0.44, 16.4, 18.8, 0.7)
      // Round windows (oculi) in the order above the French windows.
      const oc = (j: number): V3 => P(0.55 * Math.cos(j / 8 * TAU), 10.8 + 0.55 * Math.sin(j / 8 * TAU), R + 0.08)
      for (let j = 0; j < 8; j++) win.tri(P(0, 10.8, R + 0.08), oc(j), oc(j + 1))
    }
  }
  // The raised attic behind the bow, with its relief panel.
  cbox(bath, -46.6, 9.0, -38.0, 28.8, ZT - 0.8, 25.6, 0.3)
  box(trim, -46.9, 8.7, -37.7, 29.1, 25.6, 26.2)
  proud(trim, { a: [-46.6, 26.8], b: [-46.6, 11.0] }, 0, 15.8, 23.0, 24.9, 0, 0.12)

  // ===== Write ===========================================================
  const flood = (p: V3, n: V3) => (p[0] > 45 && n[0] > 0.4 ? Math.min(1, 0.55 + p[2] / 50) : p[0] > 45 && n[2] > 0.9 ? 0.15 : 0)
  writeModel('Buckingham Palace', 'london-buckingham-palace', [
    { part: port, material: { ...finish('portland-stone', 0xe9ded4), floodlight: flood } },
    { part: bath, material: finish('bath-stone', 0xe9e0cd) },
    { part: trim, material: finish('stone-trim', 0xf3eee4) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: dome, material: PALETTE.copper },
  ], { bearing: BEARING, osm: 'relation/5208404', height: 39.0 }, 6500)
}

/** Copy the triangles of `src` whose centroid (map frame) passes `keep` into `dst`. */
function copyWhere(dst: Part, src: Part, keep: (c: V3) => boolean) {
  for (let k = 0; k < src.pos.length; k += 9) {
    // Part stores glTF (x, z, −y).
    const c: V3 = [(src.pos[k] + src.pos[k + 3] + src.pos[k + 6]) / 3, -(src.pos[k + 2] + src.pos[k + 5] + src.pos[k + 8]) / 3, (src.pos[k + 1] + src.pos[k + 4] + src.pos[k + 7]) / 3]
    if (!keep(c)) continue
    dst.pos.push(...src.pos.slice(k, k + 9)); dst.nrm.push(...src.nrm.slice(k, k + 9)); dst.uv.push(...src.uv.slice(k / 3 * 2, k / 3 * 2 + 6))
  }
}

/** Voussoir frame round an arch on a face: a thick semicircular band proud of the wall. */
function frameArch(p: Part, f: Face, sc: number, w: number, zs: number) {
  const r0 = w / 2, r1 = w / 2 + 0.55, n = 8
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI * i / n, a1 = Math.PI * (i + 1) / n
    const P = (r: number, a: number, d: number) => faceAt(f, sc + r * Math.cos(a), zs + r * Math.sin(a), d)
    p.quad(P(r0, a1, 0.15), P(r0, a0, 0.15), P(r1, a0, 0.15), P(r1, a1, 0.15))
    p.quad(P(r1, a1, 0), P(r1, a1, 0.15), P(r1, a0, 0.15), P(r1, a0, 0))
  }
  // Keystone.
  proud(p, f, sc - 0.35, sc + 0.35, zs + r0 - 0.1, zs + r1 + 0.15, 0, 0.3)
  // Jambs.
  for (const s of [sc - r1, sc + r0]) proud(p, f, s, s + 0.55, 0, zs, 0, 0.15)
}

if (import.meta.main) build()
