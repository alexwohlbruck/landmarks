/**
 * Westerkerk (1620-31, Hendrick and Pieter de Keyser; tower finished 1638),
 * Prinsengracht, Amsterdam: original procedural geometry, CC0-1.0.
 * bun generators/amsterdam-westerkerk.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/99205257,
 * 52.374542, 4.883934. The church's walls run at 3.1 / 93.1 degrees, so the
 * catalog bearing is 3.1 and the church is square to this frame: +x is the
 * east end, -x the Westertoren on the Prinsengracht, -y the south side.
 *
 * Identity, in order: the Westertoren, at about 85 m the tallest church
 * tower in Amsterdam: a square brick shaft with sandstone quoins and bands
 * to its balustrade at 48.6 m, then stages that step in, each narrower
 * than the one below and dark with weathering (the square stone stage with
 * the city arms, its balustrade and blue urns; the octagonal clock stage;
 * the octagonal open belfry), and on top the blue and gold imperial crown
 * of Maximilian with its gilt ball and vane; the brick church with its
 * double-cross plan, two transverse arms with tall Renaissance gables,
 * round-arched windows in sandstone frames, and dark slate roofs. At night
 * the tower is floodlit.
 *
 * Evidence:
 *  - plan: OSM outline way/99205257 and its parts, read in the turned frame:
 *    aisles 749268115 (x -22.0..26.9, y -17.7..12.2, tagged 15 m), nave
 *    749268118 (x -21.4..28.6, y -9.5..4.3, 34 m, roof 9 m), transverse arms
 *    749268116 (x 9.8..20.1) and 749268117 (x -14.1..-3.9), both 33 m with
 *    an 8 m roof, the low annex 749287964 (5 m) on the north side. The
 *    outline's height, 35.2 m, is from 3DBAG (AHN lidar): the nave ridge,
 *    drawn 34 m. The buttresses are the outline's 2 m notches. Published:
 *    58 x 29 m (nl.wikipedia, Westerkerk (Amsterdam)) agrees.
 *  - tower: OSM parts 751083599 (11.1 m square, tagged 0-40 m), 751083598
 *    (9.2 m square, 40-52), 751083596 (clock stage, 52-64), 751083597
 *    (belfry, 64-72), 751083595 (crown, 72-82). Total height: the lead's
 *    brief gives 85 m, nl.wikipedia "about 87 m"; 85 m to the vane's top.
 *    Stage heights (review round 2): in Rabich's and Jvhertum's whole-tower
 *    photos the brick shaft is 55-58% of the height to the vane, so the
 *    shaft is drawn to 46.5 m with its cornice and balustrade to 48.6 m,
 *    above OSM's 40 m part split; the stages above are compressed to fit:
 *    square stage to 56.4 (8.6 m wide), octagonal clock stage to 64.6
 *    (6.2 m across the flats), octagonal belfry to 70.9 (4.7 m), cap to 72,
 *    crown to 76.3, ball 77.1, vane 85 m. Crown orb about 4 m across in
 *    Catarinella's telephoto, drawn 4.8 m so it holds at phone size.
 *  - colours from the daylight photos: very dark brown brick (photo-west, photo-sw, Catarinella), drawn #7a5650,
 *    as dark as the palette allows while still reading as brick, like the
 *    batch's other dark browns; pulled to the
 *    palette's lightness; the tower stages a dark warm grey (weathered
 *    sandstone and dark-painted wood, darker than the brick in most
 *    photos), shared with the dark slate roofs; pale sandstone only for the
 *    cornices, balustrades and the church's trim; the crown's blue and
 *    gilt. The stage openings are window panels (the belfry is lit from
 *    within at night).
 *  - elevation 0 (flat canal ground, about 0-2 m NAP); no lidar (AHN is not
 *    read by the repo's tools, USGS covers only the US).
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - WestertorenAmsterdam.jpg (Massimo Catarinella, CC BY 3.0): the tower
 *    stages and crown, telephoto.
 *  - Amsterdam_(NL),_Westerkerk_--_2015_--_7179.jpg (Dietmar Rabich,
 *    CC BY-SA 4.0): the whole tower from the west over the Prinsengracht.
 *  - .00_3014_Westerkerk_(West_Church)_of_Amsterdam.jpg (W. Bulach,
 *    CC BY-SA 4.0): the upper stages and crown.
 *  - Amsterdam_Westerkerk_2008.jpg (Hnapel, CC BY-SA 4.0): north-west, the
 *    tower and the north transverse gable.
 *  - Prinsengracht_westerkerk_amsterdam.jpg (Jvhertum, CC BY-SA 3.0): south-
 *    west, tower and the south gable.
 *  - Westerkerk_Amsterdam.jpg (Kamanasish Debnath, CC BY-SA 4.0): distant,
 *    from the north along the Prinsengracht.
 *  - Westerkerk_at_Night.jpg (Eden, Janine and Jim, CC BY 2.0): floodlit
 *    tower at night.
 * No commercial imagery. No look-only sources.
 *
 * Left out: the city arms and the red clock dials (the dials are gilt
 * discs), balusters, scrolls and carving of the gables, the vane's cockerel,
 * the sash bars, the lantern on the north annex.
 *
 * Doubts: the east end and the north annex are seen in few photos; the
 * annex's roof is drawn flat. The aisle roofs are drawn as lean-tos against
 * the nave, from OSM's 15 m wall height. The transept gable outline is a
 * simplified stepped Renaissance gable.
 *
 * This file also holds the kit shared by the builder's other amsterdam-
 * church generators (zuiderkerk, oude-kerk, sint-nicolaaskerk, krijtberg);
 * merge it first.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, lathe, rect, save, triangulate, walls, type XY } from './chi-aon-center'
import { along, archOn, bbox, discOn, face, rectOn } from './phl-independence-hall'

// ---------------------------------------------------------------------------
// Kit for this builder's Amsterdam churches.

export type Seg = [XY, XY]
/** The four sides of a rect ring, each running counter-clockwise. */
export const sidesOf = (r: XY[]) => ({ S: [r[0], r[1]], E: [r[1], r[2]], N: [r[2], r[3]], W: [r[3], r[0]] }) as Record<'S' | 'E' | 'N' | 'W', Seg>

/** A prism over a convex or simple ring (counter-clockwise). */
export function prism(p: Part, r: XY[], z0: number, z1: number, top = true, bottom = false) {
  walls(p, r, z0, z1)
  if (top) cap(p, r, z1)
  if (bottom) cap(p, r, z0, false)
}

/** A square block about (cx, cy) of half-size h, top edge chamfered by b. */
export function sq(wall: Part, top: Part | null, cx: number, cy: number, h: number, z0: number, z1: number, b = 0.2, hy = h) {
  bbox(wall, top, cx - h, cy - hy, cx + h, cy + hy, z0, z1, b)
}

/** A cornice slab: a square block with both edges chamfered. */
export function cornice(p: Part, cx: number, cy: number, h: number, z0: number, z1: number, hy = h) {
  const r = rect(cx - h, cy - hy, cx + h, cy + hy), b = Math.min(0.25, (z1 - z0) / 3)
  const i = inset(r, b)
  walls(p, i, z0, z0 + b, r)
  walls(p, r, z0 + b, z1 - b)
  walls(p, r, z1 - b, z1, i)
  cap(p, i, z1)
  cap(p, i, z0, false)
}

/** A parapet or balustrade band on a ring, t thick. */
export function parapet(p: Part, ring: XY[], z0: number, z1: number, t = 0.3) {
  const i = inset(ring, t)
  walls(p, ring, z0, z1)
  walls(p, [...i].reverse(), z0, z1)
  for (let k = 0; k < ring.length; k++) {
    const l = (k + 1) % ring.length
    p.quad([ring[k][0], ring[k][1], z1], [ring[l][0], ring[l][1], z1], [i[l][0], i[l][1], z1], [i[k][0], i[k][1], z1])
  }
}

/** A round column (or post) from z0 to z1. */
export function column(p: Part, x: number, y: number, z0: number, z1: number, r: number, seg = 6) {
  lathe(p, x, y, [[r, z0], [r, z1], [0, z1]], seg)
}

/** An urn or vase, total height ~1.45 k. */
export function urn(p: Part, x: number, y: number, z: number, k = 1, seg = 6) {
  lathe(p, x, y, [[0.26 * k, z], [0.3 * k, z + 0.15 * k], [0.17 * k, z + 0.3 * k], [0.4 * k, z + 0.65 * k], [0.26 * k, z + 0.95 * k], [0.09 * k, z + 1.15 * k], [0.13 * k, z + 1.3 * k], [0, z + 1.45 * k]], seg)
}

/** A sphere (ball finial). */
export function ball(p: Part, x: number, y: number, z: number, r: number, seg = 8) {
  const prof: XY[] = []
  for (let i = 0; i <= 5; i++) { const a = -Math.PI / 2 + (i / 5) * Math.PI; prof.push([Math.max(0, r * Math.cos(a)), z + r * Math.sin(a)]) }
  prof[0][0] = 0; prof[5][0] = 0
  lathe(p, x, y, prof, seg)
}

/** A thin mast with a cross arm near the top. */
export function mastCross(p: Part, x: number, y: number, z0: number, z1: number, arm = 0.8, r = 0.1) {
  column(p, x, y, z0, z1, r, 4)
  const za = z1 - arm * 1.2
  bbox(p, p, x - arm, y - r, x + arm, y + r, za - r, za + r, 0.02)
  bbox(p, p, x - r, y - arm, x + r, y + arm, za - r, za + r, 0.02)
}

/** A pyramid from a ring at z0 to an apex. */
export function pyramid(p: Part, r: XY[], z0: number, apex: V3) {
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    p.tri([r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], apex)
  }
}

/**
 * A gabled roof over x0..x1, y0..y1 from the eave to the ridge, ridge along
 * x (alongX) or y; the gable triangles go in `wall` (null: none). The roof
 * overhangs the long walls by `o`, dropping below the eave so it meets them.
 */
export function gableRoof(roof: Part, wall: Part | null, x0: number, y0: number, x1: number, y1: number, eave: number, ridge: number, alongX = true, o = 0.35, ends = 0.2) {
  if (!alongX) {
    // Swap the axes by building in a turned copy.
    const tmp = new Part(), tw = wall ? new Part() : null
    gableRoof(tmp, tw, y0, -x1, y1, -x0, eave, ridge, true, o, ends)
    const map = (src: Part, dst: Part) => {
      for (let i = 0; i < src.pos.length; i += 9) {
        const pts: V3[] = [0, 1, 2].map(k => { const gx = src.pos[i + 3 * k], gy = -src.pos[i + 3 * k + 2], gz = src.pos[i + 3 * k + 1]; return [-gy, gx, gz] as V3 })
        dst.tri(pts[0], pts[1], pts[2])
      }
    }
    map(tmp, roof)
    if (wall && tw) map(tw, wall)
    return
  }
  const ym = (y0 + y1) / 2, hw = (y1 - y0) / 2, s = (ridge - eave) / hw
  const xa = x0 - ends, xb = x1 + ends
  const lo = eave - o * s
  face(roof, [[xa, y0 - o, lo], [xb, y0 - o, lo], [xb, ym, ridge], [xa, ym, ridge]], [0, -1, 1 / s])
  face(roof, [[xb, y1 + o, lo], [xa, y1 + o, lo], [xa, ym, ridge], [xb, ym, ridge]], [0, 1, 1 / s])
  face(roof, [[xa, y0 - o, lo], [xb, y0 - o, lo], [xb, y1 + o, lo], [xa, y1 + o, lo]], [0, 0, -1])
  // Verges: the roof's thickness at the ends.
  for (const [x, nx] of [[xa, -1], [xb, 1]] as [number, number][]) {
    face(roof, [[x, y0 - o, lo], [x, ym, ridge], [x, ym, ridge - 0.35], [x, y0 - o + 0.3, lo]], [nx, 0, 0])
    face(roof, [[x, y1 + o, lo], [x, ym, ridge], [x, ym, ridge - 0.35], [x, y1 + o - 0.3, lo]], [nx, 0, 0])
  }
  if (wall) {
    face(wall, [[x0, y0, eave], [x0, y1, eave], [x0, ym, ridge]], [-1, 0, 0])
    face(wall, [[x1, y0, eave], [x1, y1, eave], [x1, ym, ridge]], [1, 0, 0])
  }
}

/** A hipped roof over a rect, ridge along the longer side. */
export function hipRoof(roof: Part, x0: number, y0: number, x1: number, y1: number, eave: number, ridge: number, o = 0.3) {
  const X0 = x0 - o, X1 = x1 + o, Y0 = y0 - o, Y1 = y1 + o
  const w = X1 - X0, d = Y1 - Y0
  if (w >= d) {
    const ym = (Y0 + Y1) / 2, h = d / 2
    const a: V3 = [X0 + h, ym, ridge], b: V3 = [X1 - h, ym, ridge]
    face(roof, [[X0, Y0, eave], [X1, Y0, eave], b, a], [0, -1, 1])
    face(roof, [[X1, Y1, eave], [X0, Y1, eave], a, b], [0, 1, 1])
    face(roof, [[X0, Y1, eave], [X0, Y0, eave], a], [-1, 0, 1])
    face(roof, [[X1, Y0, eave], [X1, Y1, eave], b], [1, 0, 1])
  } else {
    const xm = (X0 + X1) / 2, h = w / 2
    const a: V3 = [xm, Y0 + h, ridge], b: V3 = [xm, Y1 - h, ridge]
    face(roof, [[X1, Y0, eave], [X1, Y1, eave], b, a], [1, 0, 1])
    face(roof, [[X0, Y1, eave], [X0, Y0, eave], a, b], [-1, 0, 1])
    face(roof, [[X0, Y0, eave], [X1, Y0, eave], a], [0, -1, 1])
    face(roof, [[X1, Y1, eave], [X0, Y1, eave], b], [0, 1, 1])
  }
  face(roof, [[X0, Y0, eave], [X1, Y0, eave], [X1, Y1, eave], [X0, Y1, eave]], [0, 0, -1])
}

/**
 * A lean-to roof over x0..x1 from the outer wall line yo (low, at z0) to the
 * inner line yi (high, z1), with closing triangles at both ends in `wall`.
 */
export function leanTo(roof: Part, wall: Part, x0: number, x1: number, yo: number, yi: number, z0: number, z1: number, o = 0.3) {
  const sgn = Math.sign(yo - yi), s = (z1 - z0) / Math.abs(yo - yi)
  const ye = yo + sgn * o, ze = z0 - o * s
  face(roof, [[x0, ye, ze], [x1, ye, ze], [x1, yi, z1], [x0, yi, z1]], [0, sgn, 1 / s])
  face(roof, [[x0, ye, ze], [x1, ye, ze], [x1, ye, ze + 0.3], [x0, ye, ze + 0.3]], [0, sgn, 0])
  face(wall, [[x0, yo, z0], [x0, yi, z0], [x0, yi, z1]], [-1, 0, 0])
  face(wall, [[x1, yo, z0], [x1, yi, z0], [x1, yi, z1]], [1, 0, 0])
}

/**
 * A slab standing on wall a→b (counter-clockwise ring): its outline is given
 * in (s along the wall, z) as a simple polygon, `t` thick, set from `o0` to
 * `o0 + t` outside the wall line (negative o0 sinks it in).
 */
export function wallSlab(p: Part, a: XY, b: XY, outline: XY[], t: number, o0 = 0) {
  const { P, n } = along(a, b)
  const ar = outline.reduce((s, q, i) => { const r = outline[(i + 1) % outline.length]; return s + q[0] * r[1] - r[0] * q[1] }, 0)
  const ring = ar < 0 ? [...outline].reverse() : outline
  const N: V3 = [n[0], n[1], 0], B: V3 = [-n[0], -n[1], 0]
  for (const [i, j, k] of triangulate(ring)) {
    const f = [ring[i], ring[j], ring[k]].map(([s, z]) => P(s, z, o0 + t))
    face(p, f, N)
    const g = [ring[i], ring[j], ring[k]].map(([s, z]) => P(s, z, o0))
    face(p, g, B)
  }
  for (let i = 0; i < ring.length; i++) {
    const q = ring[i], r = ring[(i + 1) % ring.length]
    // outward edge normal in (s, z), then to 3D
    const ds = r[0] - q[0], dz = r[1] - q[1]
    const { u } = along(a, b)
    const en: V3 = [u[0] * dz, u[1] * dz, -ds]
    face(p, [P(q[0], q[1], o0), P(r[0], r[1], o0), P(r[0], r[1], o0 + t), P(q[0], q[1], o0 + t)], en)
  }
}

/** A round-headed window with a stone surround: frame in `trim`, glass in `win`. */
export function archWin(trim: Part | null, win: Part, s: Seg, c: number, hw: number, z0: number, zs: number, f = 0.3, seg = 8) {
  if (trim) archOn(trim, s[0], s[1], c, hw + f, z0 - f * 0.6, zs, 0.04, seg)
  archOn(win, s[0], s[1], c, hw, z0, zs, 0.08, seg)
}

/** A pointed (Gothic) window panel on wall a→b: rectangle to zs, then an equilateral-ish point. */
export function pointedOn(p: Part, a: XY, b: XY, c: number, hw: number, z0: number, zs: number, out = 0.06, seg = 5) {
  const { P } = along(a, b)
  p.quad(P(c - hw, z0, out), P(c + hw, z0, out), P(c + hw, zs, out), P(c - hw, zs, out))
  // Two arcs of radius 2hw centred on the opposite jambs.
  const R = 2 * hw, apex = zs + Math.sqrt(R * R - hw * hw)
  const pts: XY[] = []
  const a0 = 0, a1 = Math.acos(hw / R) // angle at the apex from the far centre
  for (let k = 0; k <= seg; k++) { const t = a0 + (k / seg) * a1; pts.push([c - hw + R * Math.cos(t), zs + R * Math.sin(t)]) }
  // right arc, from the right jamb (centre at the left jamb) to the apex
  const C = P(c, zs, out)
  for (let k = 0; k < seg; k++) {
    p.tri(C, P(pts[k][0], pts[k][1], out), P(pts[k + 1][0], pts[k + 1][1], out))
    p.tri(C, P(2 * c - pts[k + 1][0], pts[k + 1][1], out), P(2 * c - pts[k][0], pts[k][1], out))
  }
  void apex
}

/** Faces of a regular polygon ring as segments. */
export const segsOf = (r: XY[]): Seg[] => r.map((a, i) => [a, r[(i + 1) % r.length]] as Seg)

export const floodAll = (p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : 0.9)

export const AMS_CREDITS = 'OnlyHudson (creator), Claude (Claude Opus 5.5, procedural modeling)'

export { save, rect, lathe, walls, cap, inset, archOn, rectOn, discOn, face, bbox, along }
export type { XY }

// ---------------------------------------------------------------------------
// Westerkerk

function build() {
  const brick = new Part(), stone = new Part(), roof = new Part(), win = new Part(), blue = new Part(), gold = new Part()

  // ------------------------------------------------------------- the body
  const AX0 = -22.0, AX1 = 26.85, AY0 = -17.6, AY1 = 12.2, AEAVE = 15
  const NX0 = -21.4, NX1 = 28.6, NY0 = -9.5, NY1 = 4.3, NEAVE = 25, NRIDGE = 34
  const T1 = [-14.1, -3.9], T2 = [9.8, 20.1], TRIDGE = 33.2
  const NYM = (NY0 + NY1) / 2

  const aisles = rect(AX0, AY0, AX1, AY1)
  walls(brick, aisles, 0, AEAVE)
  // Stone plinth and the eaves cornice.
  bbox(stone, null, AX0 - 0.08, AY0 - 0.08, AX1 + 0.08, AY1 + 0.08, 0, 0.9, 0.05)
  bbox(stone, null, AX0 - 0.3, AY0 - 0.3, AX1 + 0.3, AY1 + 0.3, AEAVE - 0.6, AEAVE, 0.2)
  // The nave above the aisles, to 25 m, its east end standing out 1.75 m.
  walls(brick, rect(NX0, NY0, NX1, NY1), AEAVE - 0.6, NEAVE)
  walls(brick, rect(AX1 - 0.1, NY0, NX1, NY1), 0, AEAVE)
  bbox(stone, null, NX0 - 0.25, NY0 - 0.25, NX1 + 0.25, NY1 + 0.25, NEAVE - 0.5, NEAVE, 0.15)
  gableRoof(roof, brick, NX0, NY0, NX1, NY1, NEAVE, NRIDGE, true, 0.35, 0)
  // The two transverse arms, full width, to 25 m, and their roofs.
  for (const [x0, x1] of [T1, T2]) {
    walls(brick, rect(x0, AY0, x1, AY1), AEAVE - 0.6, NEAVE)
    bbox(stone, null, x0 - 0.25, AY0 - 0.25, x1 + 0.25, AY1 + 0.25, NEAVE - 0.5, NEAVE, 0.15)
    gableRoof(roof, null, x0, AY0, x1, AY1, NEAVE, TRIDGE, false, 0.35, 0)
  }
  // Lean-to aisle roofs between the arms, against the nave.
  const free: [number, number][] = [[AX0, T1[0]], [T1[1], T2[0]], [T2[1], AX1]]
  for (const [x0, x1] of free) {
    leanTo(roof, brick, x0, x1, AY0, NY0, AEAVE, 19.5)
    leanTo(roof, brick, x0, x1, AY1, NY1, AEAVE, 19.5)
  }

  // Renaissance gables on the arms' fronts and the east end: a stepped
  // outline standing above the roof, stone copings and a crowning pediment.
  const gable = (a: XY, b: XY, c: number, hw: number, z0: number, apex: number) => {
    const H = apex - z0
    const o: XY[] = [
      [c - hw, z0], [c + hw, z0],
      [c + hw, z0 + 0.22 * H], [c + hw * 0.72, z0 + 0.3 * H], [c + hw * 0.72, z0 + 0.55 * H],
      [c + hw * 0.44, z0 + 0.62 * H], [c + hw * 0.44, z0 + 0.84 * H], [c + hw * 0.24, z0 + 0.88 * H],
      [c, apex],
      [c - hw * 0.24, z0 + 0.88 * H], [c - hw * 0.44, z0 + 0.84 * H], [c - hw * 0.44, z0 + 0.62 * H],
      [c - hw * 0.72, z0 + 0.55 * H], [c - hw * 0.72, z0 + 0.3 * H], [c - hw, z0 + 0.22 * H],
    ]
    wallSlab(brick, a, b, o, 0.6, -0.6)
    // Stone ledges at the steps and pilaster strips.
    const { P, n } = along(a, b)
    const ledge = (s0: number, s1: number, z: number) => {
      const q = (s: number, zz: number, out: number) => P(s, zz, out)
      face(stone, [q(s0, z, 0.15), q(s1, z, 0.15), q(s1, z + 0.4, 0.15), q(s0, z + 0.4, 0.15)], [n[0], n[1], 0])
      face(stone, [q(s0, z + 0.4, -0.6), q(s1, z + 0.4, -0.6), q(s1, z + 0.4, 0.15), q(s0, z + 0.4, 0.15)], [0, 0, 1])
    }
    ledge(c - hw - 0.2, c - hw * 0.72, z0 + 0.22 * H)
    ledge(c + hw * 0.72, c + hw + 0.2, z0 + 0.22 * H)
    ledge(c - hw * 0.72 - 0.1, c - hw * 0.44, z0 + 0.55 * H)
    ledge(c + hw * 0.44, c + hw * 0.72 + 0.1, z0 + 0.55 * H)
    ledge(c - hw * 0.44 - 0.1, c + hw * 0.44 + 0.1, z0 + 0.84 * H - 0.1)
    for (const s of [c - hw * 0.62, c + hw * 0.62]) rectOn(stone, a, b, s, 0.35, z0, z0 + 0.55 * H, 0.04)
    for (const s of [c - hw * 0.34, c + hw * 0.34]) rectOn(stone, a, b, s, 0.3, z0 + 0.55 * H, z0 + 0.84 * H, 0.04)
    // Window in the gable and finials on the shoulders.
    archWin(stone, win, [a, b], c, Math.min(1.1, hw * 0.3), z0 + 0.12 * H, z0 + 0.42 * H, 0.25)
    for (const s of [-1, 1]) {
      const p0 = P(c + s * (hw - 0.3), z0 + 0.22 * H + 0.4, -0.3)
      lathe(stone, p0[0], p0[1], [[0.3, p0[2]], [0.3, p0[2] + 0.4], [0, p0[2] + 1.6]], 4, Math.PI / 4)
      const p1 = P(c + s * (hw * 0.72 - 0.25), z0 + 0.55 * H + 0.4, -0.3)
      lathe(stone, p1[0], p1[1], [[0.25, p1[2]], [0.25, p1[2] + 0.35], [0, p1[2] + 1.3]], 4, Math.PI / 4)
    }
    const pa = P(c, apex, -0.3)
    lathe(stone, pa[0], pa[1], [[0.18, pa[2] - 0.2], [0.18, pa[2] + 0.4], [0, pa[2] + 1.4]], 4, Math.PI / 4)
  }
  for (const [x0, x1] of [T1, T2]) {
    const xm = (x0 + x1) / 2, hw = (x1 - x0) / 2
    const S = sidesOf(rect(x0, AY0, x1, AY1))
    gable(S.S[0], S.S[1], hw, hw, NEAVE, TRIDGE + 3.2)
    gable(S.N[0], S.N[1], hw, hw, NEAVE, TRIDGE + 3.2)
    // Fronts: a tall window in each tier between stone pilasters.
    for (const k of ['S', 'N'] as const) {
      const sg = S[k]
      archWin(stone, win, sg, hw, 1.9, 16.2, 21.6)
      for (const d of [-hw + 0.5, hw - 0.5]) rectOn(stone, sg[0], sg[1], hw + d, 0.45, 0.9, NEAVE - 0.5, 0.05)
      bbox(stone, null, x0 - 0.1, AY0 - 0.1, x1 + 0.1, AY1 + 0.1, AEAVE - 0.6, AEAVE, 0.05)
    }
    void xm
  }
  {
    const E = sidesOf(rect(NX0, NY0, NX1, NY1)).E
    gable(E[0], E[1], (NY1 - NY0) / 2, (NY1 - NY0) / 2, NEAVE, NRIDGE + 3.5)
    archWin(stone, win, E, (NY1 - NY0) / 2, 1.8, 3.6, 11.8)
    archWin(stone, win, E, (NY1 - NY0) / 2, 1.8, 16.2, 21.6)
  }

  // Buttresses (the outline's notches) with stone caps, and the windows
  // between them.
  const bx = [-21.8, -13.9, -6.0, 2.0, 9.9, 17.8, 25.8]
  const S = sidesOf(aisles)
  for (const x of bx) {
    bbox(brick, stone, x - 1.0, AY0 - 1.65, x + 1.0, AY0, 0, AEAVE - 2.5, 0.5)
    if (x > 9) bbox(brick, stone, x - 1.0, AY1, x + 1.0, AY1 + 1.65, 0, AEAVE - 2.5, 0.5)
  }
  for (let i = 0; i < bx.length - 1; i++) {
    const xm = (bx[i] + bx[i + 1]) / 2
    archWin(stone, win, S.S, xm - AX0, 1.55, 3.6, 11.6)
    if (xm > 9) archWin(stone, win, S.N, AX1 - xm, 1.55, 3.6, 11.6)
  }
  // East ends of the aisles; the clerestory over the aisle roofs.
  for (const y of [-13.6, 8.3]) archWin(stone, win, S.E, y - AY0, 1.5, 3.6, 11.6)
  for (const y of [-15.5, 10.2]) bbox(brick, stone, AX1, y - 1.0, AX1 + 1.65, y + 1.0, 0, AEAVE - 2.5, 0.5)
  const NS = sidesOf(rect(NX0, NY0, NX1, NY1))
  for (const x of [-18.0, 0.0, 6.0, 23.4]) {
    archWin(stone, win, NS.S, x - NX0, 1.15, 20.2, 22.9, 0.22)
    archWin(stone, win, NS.N, NX1 - x, 1.15, 20.2, 22.9, 0.22)
  }

  // The low annex on the north side (OSM 749287964, 5 m), flat roofed.
  {
    let an: XY[] = [[-31.9, 13.9], [-25.1, 13.9], [-25.1, 2.7], [-22.0, 2.7], [-22.0, 11.9], [9.8, 12.2], [9.8, 13.8], [-27.2, 23.6]]
    const ar = an.reduce((s, q, i) => { const r = an[(i + 1) % an.length]; return s + q[0] * r[1] - r[0] * q[1] }, 0)
    if (ar < 0) an = an.reverse()
    walls(brick, an, 0, 5)
    cap(roof, an, 5)
    walls(stone, an, 4.7, 5.15)
  }

  // ------------------------------------------------------------ the tower
  // Brick shaft to 47.5 m, then stages that step in, each narrower: the
  // square stone stage with its balustrade and blue urns, the octagonal
  // clock stage, the octagonal belfry, the cap and the crown. The stages are
  // the dark weathered sandstone and painted wood of the photos (in `roof`,
  // the dark slate tone); only cornices and balustrades are pale.
  const TX = -27.05, TY = -2.85
  const H1 = 5.55, ZB = 46.5
  const base = rect(TX - H1, TY - H1, TX + H1, TY + H1)
  walls(brick, base, 0, ZB)
  bbox(stone, null, TX - H1 - 0.1, TY - H1 - 0.1, TX + H1 + 0.1, TY + H1 + 0.1, 0, 1.4, 0.05)
  for (const z of [14.0, 31.0]) bbox(stone, null, TX - H1 - 0.12, TY - H1 - 0.12, TX + H1 + 0.12, TY + H1 + 0.12, z, z + 0.6, 0.1)
  cornice(stone, TX, TY, H1 + 0.45, ZB - 0.1, ZB + 1.0)
  parapet(stone, rect(TX - H1 - 0.2, TY - H1 - 0.2, TX + H1 + 0.2, TY + H1 + 0.2), ZB + 1.0, ZB + 2.1, 0.35)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    sq(stone, stone, TX + sx * (H1 - 0.05), TY + sy * (H1 - 0.05), 0.42, ZB + 1.0, ZB + 2.5, 0.1)
    ball(stone, TX + sx * (H1 - 0.05), TY + sy * (H1 - 0.05), ZB + 2.85, 0.35, 6)
  }
  const TF = sidesOf(base)
  for (const k of ['S', 'W', 'N', 'E'] as const) {
    const [a, b] = TF[k], c = H1
    // Sandstone quoins up the corners.
    rectOn(stone, a, b, 0.4, 0.45, 1.4, ZB - 0.1, 0.04)
    rectOn(stone, a, b, 2 * H1 - 0.4, 0.45, 1.4, ZB - 0.1, 0.04)
    // Upper tier: paired tall arched openings in a stone frame.
    archOn(stone, a, b, c, 2.6, 33.4, 41.6, 0.04, 8)
    archOn(brick, a, b, c, 2.3, 33.6, 41.6, 0.06, 8)
    for (const d of [-1.1, 1.1]) archOn(roof, a, b, c + d, 0.75, 34.2, 41.6, 0.08, 6)
    if (k === 'E') continue
    // Middle tier: the great blind arch with a small window.
    archOn(stone, a, b, c, 2.7, 16.4, 25.6, 0.04, 8)
    archOn(brick, a, b, c, 2.4, 16.6, 25.6, 0.06, 8)
    for (const d of [-0.55, 0.55]) archOn(win, a, b, c + d, 0.4, 21.6, 24.4, 0.08, 5)
    // Lower tier: small paired windows; the west door.
    for (const d of [-0.55, 0.55]) archOn(win, a, b, c + d, 0.4, 8.0, 10.2, 0.08, 5)
    if (k === 'W') {
      archOn(stone, a, b, c, 1.6, 0, 3.4, 0.04, 8)
      archOn(roof, a, b, c, 1.2, 0, 3.4, 0.08, 8)
    }
  }

  // Square stone stage with the city arms, 48.6-56.4 m, balustrade, urns.
  const Z2 = ZB + 2.1, H2 = 4.3
  walls(roof, rect(TX - H2, TY - H2, TX + H2, TY + H2), Z2 - 1.1, 55.6)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) sq(roof, null, TX + sx * (H2 - 0.4), TY + sy * (H2 - 0.4), 0.55, Z2, 55.6, 0.05)
  cornice(stone, TX, TY, H2 + 0.5, 55.6, 56.4)
  for (const [a, b] of Object.values(sidesOf(rect(TX - H2, TY - H2, TX + H2, TY + H2)))) {
    archOn(stone, a, b, H2, 1.75, 49.6, 53.6, 0.05, 8)
    archOn(win, a, b, H2, 1.45, 49.8, 53.6, 0.08, 8)
    discOn(gold, a, b, H2, 52.0, 0.65, 0.12, 8)
  }
  parapet(stone, rect(TX - H2 - 0.35, TY - H2 - 0.35, TX + H2 + 0.35, TY + H2 + 0.35), 56.4, 57.3, 0.3)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) urn(blue, TX + sx * (H2 + 0.05), TY + sy * (H2 + 0.05), 56.4, 1.5, 8)

  // Octagonal clock stage with columns at its corners, 56.4-64.6 m.
  const R8 = (f: number) => f / Math.cos(Math.PI / 8)
  const oct = (f: number) => Array.from({ length: 8 }, (_, i) => [TX + R8(f) * Math.cos(Math.PI / 8 + i * Math.PI / 4), TY + R8(f) * Math.sin(Math.PI / 8 + i * Math.PI / 4)] as XY)
  const o3 = oct(3.1)
  walls(roof, o3, 56.4, 64.0)
  for (const p of oct(3.3)) column(roof, p[0], p[1], 57.3, 63.6, 0.3, 6)
  for (let i = 0; i < 8; i++) {
    const a = o3[i], b = o3[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (i % 2 === 1) discOn(gold, a, b, L / 2, 58.9, 0.95, 0.1, 12)
    archOn(win, a, b, L / 2, 0.68, 60.6, 62.7, 0.08, 6)
  }
  walls(stone, oct(3.6), 64.0, 64.6)
  cap(stone, oct(3.6), 64.0, false)
  parapet(stone, oct(3.45), 64.6, 65.4, 0.25)

  // Octagonal open belfry, 64.6-70.9 m.
  const o4 = oct(2.35)
  walls(roof, o4, 64.6, 70.3)
  for (const p of oct(2.5)) column(roof, p[0], p[1], 65.4, 70.0, 0.24, 5)
  for (let i = 0; i < 8; i++) {
    const a = o4[i], b = o4[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    archOn(win, a, b, L / 2, 0.55, 65.8, 68.9, 0.08, 6)
  }
  walls(stone, oct(2.75), 70.3, 70.9)
  cap(stone, oct(2.75), 70.3, false)
  cap(roof, oct(2.75), 70.9)

  // The imperial crown on a short cap: the gilt circlet with its points,
  // the blue cap with gilt arches, the gilt ball, the mast and the vane.
  const CX = TX, CY = TY, dz = -0.8
  lathe(roof, CX, CY, [[R8(2.6), 70.9], [R8(2.0), 71.5], [R8(1.6), 72.2 + dz + 0.6], [0, 72.2 + dz + 0.6]], 8, Math.PI / 8)
  lathe(gold, CX, CY, [[1.95, 72.9 + dz], [2.45, 73.0 + dz], [2.5, 73.75 + dz], [2.3, 73.85 + dz], [0, 73.85 + dz]], 16)
  for (let i = 0; i < 8; i++) {
    const t = (i / 8) * 2 * Math.PI
    const x = CX + 2.4 * Math.cos(t), y = CY + 2.4 * Math.sin(t)
    lathe(gold, x, y, [[0.34, 73.7 + dz], [0.34, 74.0 + dz], [0, 74.8 + dz]], 4, t)
  }
  lathe(blue, CX, CY, [[2.25, 73.7 + dz], [2.4, 74.5 + dz], [2.3, 75.3 + dz], [2.0, 76.0 + dz], [1.45, 76.6 + dz], [0.6, 76.95 + dz], [0, 77.05 + dz]], 16)
  // Four gilt arches over the cap, meeting at the top.
  {
    const prof: XY[] = [[2.45, 73.85], [2.55, 74.5], [2.45, 75.3], [2.15, 76.05], [1.56, 76.7], [0.68, 77.08], [0.0, 77.2]]
    for (let i = 0; i < 4; i++) {
      const t = (i / 4) * 2 * Math.PI + Math.PI / 4
      const c = Math.cos(t), s = Math.sin(t), w = 0.24
      const secs: V3[][] = prof.map(([r, z0]) => {
        const z = z0 + dz, px = CX + r * c, py = CY + r * s
        return [[px - s * w, py + c * w, z - 0.14], [px + s * w, py - c * w, z - 0.14], [px + s * w, py - c * w, z + 0.14], [px - s * w, py + c * w, z + 0.14]] as V3[]
      })
      gold.sweep(secs)
    }
  }
  column(gold, CX, CY, 77.0 + dz, 77.4 + dz, 0.3, 6)
  ball(gold, CX, CY, 77.9 + dz, 0.6, 8)
  mastCross(roof, CX, CY, 78.4 + dz, 85.0, 0.75, 0.12)
  {
    const vz = 83.4
    const vane: V3[] = [[CX - 0.2, CY, vz], [CX + 1.3, CY, vz], [CX + 1.3, CY, vz + 0.9], [CX - 0.2, CY, vz + 0.9]]
    face(gold, vane, [0, -1, 0])
    face(gold, vane, [0, 1, 0])
  }

  const towerFlood = (p: V3, n: V3) => {
    const d = Math.hypot(p[0] - TX, p[1] - TY)
    if (d < 8) return n[2] > 0.7 ? 0.35 : 1
    return n[2] > 0.7 ? 0.1 : 0.45
  }
  return [
    { part: brick, material: { ...finish('westerkerk-brick', 0x7a5650), floodlight: towerFlood } },
    { part: stone, material: { ...finish('westerkerk-sandstone', 0xc4baab), floodlight: towerFlood } },
    { part: roof, material: { ...finish('westerkerk-slate', 0x625c56), floodlight: towerFlood } },
    { part: win, material: { ...PALETTE.window } },
    { part: blue, material: finish('westerkerk-crown-blue', 0x4a80cc, 0.5) },
    { part: gold, material: finish('westerkerk-gilt', 0xd4a83c, 0.45) },
  ]
}

if (import.meta.main) await save('amsterdam-westerkerk', 'Westerkerk', [52.374542, 4.883934], 3.1, build(), 6500)
