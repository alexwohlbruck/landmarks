/**
 * Shrine of the Immaculate Conception (1873, William H. Parkins), Atlanta:
 * procedural, CC0-1.0.
 * bun generators/atl-shrine-immaculate-conception.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 33 (the
 * walls run 33 degrees east of north). The nave runs along model x; the
 * entrance front with its two towers faces model -x (compass 303). Origin:
 * the area centroid of OSM way/96273719 (-84.3895634, 33.7503597). y = 0 is
 * the lowest ground under the footprint (south side, 0.6 m above the lidar
 * box's ground_min); the street on the north side is 1.5-2.5 m higher.
 *
 * Form: a red-brick Gothic Revival church on a grey stone base. Two unequal
 * towers flank the west front: the tall north-west tower (the corner of the
 * nave's street side) carries a belfry of tall louvred lancets, an arcaded
 * cornice and four white stone pinnacles; the shorter south-west tower ends
 * in a gable on each face with pinnacles at its corners. Between them the
 * gabled front with a large traceried window over the entrance. The nave
 * has lower side aisles under lean-to roofs, buttresses between lancet
 * windows, a clerestory and a steep slate roof; a cross gable with a rose
 * window near the east end; a lower brick rectory wing behind.
 *
 * Sources
 * - OSM way/96273719 (outline, building=church).
 * - USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 0.5 m grid, heights
 *   above y = 0: tall tower x -29.3..-22.6, y 7.3..14.3, flat top 37.0 (its
 *   pinnacles' tips are too thin for the lidar: 38.5 seen); short tower
 *   x -29.5..-23.2, y -9.5..-2.6, gables to 27.6, a pinnacle at 29.4; nave
 *   ridge 21.2 at y 2.2, aisle roofs 10.6-12.1, rear wing about 12.
 * - Photos (Wikimedia Commons, EVIDENCE): Ondřej Žváček, "Kostel
 *   Neposkvrněného početí, Atlanta.jpg", CC BY 2.5 (tall tower, front and
 *   north side); JJonahJackalope, "Shrine of the Immaculate Conception,
 *   Atlanta, Georgia.jpg", CC BY-SA 4.0 (north side, aisles, clerestory);
 *   dbking, "Shrine of the Immaculate Conception.jpg", CC BY 2.0 (from
 *   above, the roof); Ganeshk, "Atlanta Shrine of the Immaculate Conception
 *   2012 09 15 05 6247.JPG", CC BY-SA 3.0; Warren LeMay, "Catholic Shrine of
 *   the Immaculate Conception, Atlanta, GA (47421887862).jpg", CC0 (rear).
 * Published: built 1869-73; the tall tower is the north-west one (photos).
 * Estimated from photos: the pinnacles' height (to 43 m, scaled from the
 *   tower in Žváček's photo), stage heights of the towers, window sizes and
 *   bay counts (7 bays), the stone base's height.
 * Doubts: the south side and the rear are barely photographed; the south
 *   aisle and cross gable mirror the north. The rear wing's form is plain.
 * Colour: brick from the photos (a strong red-brown), pulled to the
 *   palette's lightness; slate roof a mid grey; white stone pinnacles and
 *   dressings as `trim`.
 * Night: lightly floodlit brick (the towers most); windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type XY, type Face, flatShape, lathe, arc, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, gable, faceX, faceY, sOf, qf, tf } from './atl-georgia-state-capitol'

/** A pointed (equilateral) Gothic arch opening: jambs from z0, the arch springing at zs. */
export function pointedShape(sc: number, w: number, z0: number, zs: number, segs = 5): XY[] {
  const r = w, h = w / 2
  const right = arc(sc - h, zs, r, 0, 60, segs) // from the right jamb up to the apex
  const left = arc(sc + h, zs, r, 120, 180, segs) // from the apex down to the left jamb
  return [[sc - h, z0], [sc + h, z0], ...right, ...left.slice(1)]
}
/** n pointed windows evenly along s0..s1 on face f. */
export function lancets(win: Part, f: Face, s0: number, s1: number, n: number, w: number, z0: number, z1: number) {
  const step = (s1 - s0) / n, rise = w * 0.866
  for (let k = 0; k < n; k++) flatShape(win, f, pointedShape(s0 + step * (k + 0.5), w, z0, z1 - rise), 0.06)
}
/** A pinnacle: a square shaft and a spirelet (square pyramid). */
export function spirelet(shaft: Part, cap: Part, x: number, y: number, z0: number, zShaft: number, zTip: number, r: number) {
  box(shaft, null, x - r, y - r, x + r, y + r, z0, zShaft, 0.08)
  const c: V3[] = [[x - r * 1.1, y - r * 1.1, zShaft], [x + r * 1.1, y - r * 1.1, zShaft], [x + r * 1.1, y + r * 1.1, zShaft], [x - r * 1.1, y + r * 1.1, zShaft]]
  for (let i = 0; i < 4; i++) cap.tri(c[i], c[(i + 1) % 4], [x, y, zTip])
}

function build() {
  const brick = new Part(), trim = new Part(), slate = new Part(), win = new Part(), base = new Part()

  const NX0 = -28.3, NX1 = 13.0 // the nave's west and east ends
  const NA0 = -8.9, NA1 = 13.3 // aisle walls (south, north)
  const C0 = -3.6, C1 = 8.1 // clerestory walls
  const EAVE = 10.6, LEAN = 12.4, CLR = 15.0, RIDGE = 21.2
  const RC = (C0 + C1) / 2

  // ---- the aisles and their lean-to roofs, buttresses and lancets
  box(base, null, NX0, NA0, NX1, NA1, 0, 2.2, 0.15)
  box(brick, null, NX0, NA0, NX1, NA1, 2.2, EAVE, 0.15)
  for (const [yo, yi, sgn] of [[NA1, C1, 1], [NA0, C0, -1]] as [number, number, 1 | -1][]) {
    qf(slate, [NX0, yo + sgn * 0.3, EAVE], [NX1, yo + sgn * 0.3, EAVE], [NX1, yi, LEAN], [NX0, yi, LEAN], [0, sgn * (LEAN - EAVE), Math.abs(yo - yi)])
    const f = faceY(yo, sgn)
    const s0 = Math.min(sOf(f, -22.6), sOf(f, 6.4)), s1 = Math.max(sOf(f, -22.6), sOf(f, 6.4))
    lancets(win, f, s0, s1, 6, 2.0, 2.8, 9.0)
    // buttresses between the bays, with stone weathering caps
    for (let k = 0; k <= 6; k++) {
      const x = -22.6 + (29.0 * k) / 6
      box(brick, trim, x - 0.4, sgn > 0 ? yo : yo - 0.7, x + 0.4, sgn > 0 ? yo + 0.7 : yo, 0, 8.6, 0.05)
    }
    // the clerestory: wall, small lancets, pinnacles over the buttresses
    box(brick, null, NX0, Math.min(yi, yi - sgn * 0.6), NX1, Math.max(yi, yi - sgn * 0.6), EAVE, CLR, 0)
    const g = faceY(yi, sgn)
    const t0 = Math.min(sOf(g, -22.6), sOf(g, 6.4)), t1 = Math.max(sOf(g, -22.6), sOf(g, 6.4))
    lancets(win, g, t0, t1, 6, 1.1, LEAN + 0.3, CLR - 0.4)
    for (let k = 0; k <= 6; k++) spirelet(brick, trim, -22.6 + (29.0 * k) / 6, yi + sgn * 0.2, LEAN, CLR + 0.6, CLR + 2.4, 0.3)
  }
  // ---- the nave roof, front gable and east gable
  {
    const f = faceX(NX0, -1), e = faceX(NX1, 1)
    gable(brick, slate, f, Math.min(sOf(f, C0), sOf(f, C1)) - 0.4, Math.max(sOf(f, C0), sOf(f, C1)) + 0.4, CLR, RIDGE, 0, NX1 - NX0, true)
    // the front between the towers, up to the clerestory's eaves
    box(brick, null, NX0, -2.6, NX0 + 1.0, 7.3, 2.2, CLR, 0)
    box(base, null, NX0, -2.6, NX0 + 1.0, 7.3, 0, 2.2, 0)
    const s = sOf(f, RC)
    flatShape(win, f, pointedShape(s, 4.0, 8.4, 13.6, 6), 0.06)
    flatShape(win, f, pointedShape(s, 2.4, 1.2, 4.6, 5), 0.06)
    // a stone cross on the apex, pinnacles at the gable's foot
    box(trim, null, NX0 - 0.1, RC - 0.15, NX0 + 0.2, RC + 0.15, RIDGE, RIDGE + 2.0, 0)
    box(trim, null, NX0 - 0.1, RC - 0.6, NX0 + 0.2, RC + 0.6, RIDGE + 1.1, RIDGE + 1.4, 0)
    const sE = sOf(e, RC)
    flatShape(win, e, pointedShape(sE, 3.0, 9.0, 14.0, 5), 0.06)
  }
  // ---- cross gables with a rose window near the east end (north; mirrored south)
  for (const sgn of [1, -1] as const) {
    const yo = sgn > 0 ? NA1 : NA0
    const f = faceY(yo + sgn * 0.05, sgn)
    const a = sOf(f, 6.6), b = sOf(f, 13.0)
    gable(brick, slate, f, Math.min(a, b), Math.max(a, b), EAVE, 16.8, 0, Math.abs(yo - RC), false)
    const sm = sOf(f, 9.8)
    flatShape(win, f, pointedShape(sm, 2.8, 3.0, 8.6, 5), 0.06)
    flatShape(win, f, arc(sm, 12.8, 1.3, 0, 360, 10).slice(0, -1), 0.06)
  }

  // ---- the tall north-west tower
  {
    const X0 = -29.3, X1 = -22.6, Y0 = 7.3, Y1 = 14.3
    box(base, null, X0, Y0, X1, Y1, 0, 2.4, 0.15)
    box(brick, null, X0, Y0, X1, Y1, 2.4, 25.0, 0.2)
    box(trim, null, X0 - 0.15, Y0 - 0.15, X1 + 0.15, Y1 + 0.15, 15.6, 16.1, 0.1)
    box(trim, null, X0 - 0.15, Y0 - 0.15, X1 + 0.15, Y1 + 0.15, 24.6, 25.1, 0.1)
    box(brick, null, X0 + 0.2, Y0 + 0.2, X1 - 0.2, Y1 - 0.2, 25.0, 34.6, 0.2)
    box(brick, trim, X0 - 0.1, Y0 - 0.1, X1 + 0.1, Y1 + 0.1, 34.6, 37.0, 0.15)
    for (const f of [faceX(X0, -1), faceX(X1, 1), faceY(Y0, -1), faceY(Y1, 1)]) {
      const isX = f.n[0] !== 0
      const a = sOf(f, isX ? Y0 : X0), b = sOf(f, isX ? Y1 : X1)
      const s0 = Math.min(a, b), s1 = Math.max(a, b), sm = (s0 + s1) / 2
      // the belfry's three tall louvred lancets, a lancet below, two on the lower stage
      lancets(trim, f, s0 + 0.9, s1 - 0.9, 3, 1.1, 26.2, 33.6) // white louvres
      flatShape(win, f, pointedShape(sm, 1.2, 18.0, 22.6, 5), 0.06)
      lancets(win, f, s0 + 1.2, s1 - 1.2, 2, 1.2, 9.6, 14.4)
    }
    // the four corner pinnacles
    for (const x of [X0 + 0.5, X1 - 0.5]) for (const y of [Y0 + 0.5, Y1 - 0.5]) {
      box(brick, null, x - 0.55, y - 0.55, x + 0.55, y + 0.55, 37.0, 39.6, 0.08)
      lathe(trim, x, y, [[0.75, 39.6], [0.75, 40.2], [0.55, 40.4], [0.45, 41.6], [0.01, 43.0]], 8)
    }
  }
  // ---- the short south-west tower, gabled on every face
  {
    const X0 = -29.5, X1 = -23.2, Y0 = -9.5, Y1 = -2.6, TOP = 24.6, APEX = 27.6
    box(base, null, X0, Y0, X1, Y1, 0, 2.4, 0.15)
    box(brick, null, X0, Y0, X1, Y1, 2.4, TOP, 0.2)
    box(trim, null, X0 - 0.15, Y0 - 0.15, X1 + 0.15, Y1 + 0.15, 15.6, 16.1, 0.1)
    const xm = (X0 + X1) / 2, ym = (Y0 + Y1) / 2
    for (const f of [faceX(X0, -1), faceX(X1, 1)]) {
      const a = sOf(f, Y0), b = sOf(f, Y1)
      gable(brick, slate, f, Math.min(a, b), Math.max(a, b), TOP, APEX, 0, (X1 - X0) / 2, false)
    }
    for (const f of [faceY(Y0, -1), faceY(Y1, 1)]) {
      const a = sOf(f, X0), b = sOf(f, X1)
      gable(brick, slate, f, Math.min(a, b), Math.max(a, b), TOP, APEX, 0, (Y1 - Y0) / 2, false)
    }
    for (const f of [faceX(X0, -1), faceX(X1, 1), faceY(Y0, -1), faceY(Y1, 1)]) {
      const isX = f.n[0] !== 0
      const sm = sOf(f, isX ? ym : xm)
      lancets(win, f, sm - 1.6, sm + 1.6, 2, 0.9, 19.0, 24.0)
      flatShape(win, f, pointedShape(sm, 1.3, 9.0, 13.6, 5), 0.06)
    }
    flatShape(win, faceX(X0, -1), pointedShape(sOf(faceX(X0, -1), ym), 2.0, 1.2, 4.4, 5), 0.06)
    for (const x of [X0 + 0.4, X1 - 0.4]) for (const y of [Y0 + 0.4, Y1 - 0.4]) {
      box(brick, null, x - 0.45, y - 0.45, x + 0.45, y + 0.45, TOP, TOP + 1.8, 0.06)
      lathe(trim, x, y, [[0.6, TOP + 1.8], [0.45, TOP + 2.1], [0.35, TOP + 3.0], [0.01, TOP + 4.4]], 8)
    }
    lathe(trim, xm, ym, [[0.3, APEX - 0.4], [0.3, APEX + 1.4], [0.01, APEX + 2.0]], 6)
  }
  // ---- the rear wing (rectory link), plain brick under a hipped slate roof
  {
    const X0 = 13.0, X1 = 28.5, Y0 = -19.0, Y1 = 3.4, E = 8.6, R = 12.4
    box(base, null, X0, Y0, X1, Y1, 0, 1.6, 0.15)
    box(brick, null, X0, Y0, X1, Y1, 1.6, E, 0.15)
    const xm = (X0 + X1) / 2
    const c: V3[] = [[X0, Y0, E], [X1, Y0, E], [X1, Y1, E], [X0, Y1, E]]
    const r0: V3 = [xm, Y0 + 5, R], r1: V3 = [xm, Y1 - 5, R]
    tf(slate, c[0], c[1], r0, [0, -1, 1])
    qf(slate, c[1], c[2], r1, r0, [1, 0, 1])
    tf(slate, c[2], c[3], r1, [0, 1, 1])
    qf(slate, c[3], c[0], r0, r1, [-1, 0, 1])
    for (const f of [faceX(X1, 1), faceY(Y0, -1)]) {
      const isX = f.n[0] !== 0
      const a = sOf(f, isX ? Y0 : X0), b = sOf(f, isX ? Y1 : X1)
      lancets(win, f, Math.min(a, b) + 1, Math.max(a, b) - 1, isX ? 6 : 4, 1.3, 2.4, 7.4)
    }
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : p[0] < -22 ? 0.8 : 0.45)
  return finishGlb('Shrine of the Immaculate Conception', [
    { part: brick, material: { ...finish('sic-red-brick', 0xb05a48), floodlight: lit } as Swatch },
    { part: base, material: finish('sic-stone-base', 0xa9adad) },
    { part: trim, material: { ...PALETTE.trim, floodlight: lit } as Swatch },
    { part: slate, material: finish('sic-slate', 0x7f8891) },
    { part: win, material: PALETTE.window },
  ], { bearing: 33, height: 43.0, replaces: ['way/96273719'] }, 5000)
}

if (import.meta.main) await writeModel('atl-shrine-immaculate-conception', build())
