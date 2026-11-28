/**
 * St. Mary's Basilica (Church of the Immaculate Conception of the Blessed
 * Virgin Mary), Phoenix (1914, Mission Revival) — original procedural
 * geometry, CC0-1.0.
 * bun generators/phx-st-marys-basilica.ts
 *
 * This file also holds a small kit the other g5 Phoenix models import
 * (phx-orpheum-theatre, phx-city-hall, phx-historic-city-hall,
 * phx-oconnor-courthouse): walls extruded from a profile, a rounded-corner
 * rectangle, a vertical cylinder and a ring of window panels. The
 * basilica's own build runs only when this file is run directly.
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * anchor. Bearing 0: the OSM walls run within a degree of north–south.
 * Anchor -112.0693994, 33.4507751, the centroid of OSM way/37057984
 * ("Saint Mary's Basilica", 231 N 3rd Street). The church faces south onto
 * Monroe Street. The friary (way/37057980) and the school portal stand
 * apart and are left to the map.
 *
 * Identity (from the photos below):
 *  1. The south front: two square towers, each a plain shaft, a belfry with
 *     two round-arched openings a face under a moulded cornice, then a
 *     small arcaded octagonal drum and a dome with a lantern and cross.
 *                                                     (stark, conv1, bradley)
 *  2. Between them the curved Mission Revival gable with a cross on top and
 *     a big round window, over a balustraded balcony.    (stark, bradley)
 *  3. The raised terrace across the front, an arcade of round arches under
 *     it (the lower church) and stairs up at both ends.  (stark, conv1)
 *  4. A long nave of salmon stucco under a red tile gable roof, with tall
 *     round-headed windows along its sides.               (conv1)
 *
 * Plan: OSM way/37057984 as drawn. The nave is x -10.5..11.7 (OSM), the
 * towers x -10.9..-4.3 and 5.5..12.1, y -27.5..-21, set symmetric about
 * the nave's axis (x 0.6). North of the nave: the sanctuary (x -6..9.5,
 * y 11..20), low sacristies on each side and a low north range to y 23.2;
 * on the west a low side wing to x -15.6 (all OSM, heights from lidar).
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (2020 flight), 0.5 m
 * grid; ground 1 m above ground_min 331.07 is y = 0. The lidar sits about
 * 1.2 m east of OSM here; OSM is kept. Measured (model metres): nave eaves
 * 12.5, ridge 19; front gable peak 21.6; tower belfry cornice 22, dome top
 * 30 (the cross to about 32.5); sanctuary eaves 13, ridge 16; sacristies
 * and north range 9.3; west wing 8.3; front terrace 3.4; crossing lantern
 * 21.5. Published: 1914 (National Register, Wikipedia).
 * Estimated from stark and conv1 scaled to the lidar: the tower stages
 * (shaft to 15.8, belfry 15.8–22), the openings, the rose window (r 2.2 at
 * 13), the balcony at 8.6, the arcade (five arches a side of the stairs).
 *
 * Photos (evidence, Wikimedia Commons):
 *  stark   "St Mary's Basilica (6377886805).jpg", Alan Stark, CC BY-SA 2.0:
 *          the south front at night, floodlit
 *          https://commons.wikimedia.org/wiki/File:St_Mary%27s_Basilica_(6377886805).jpg
 *  bradley "St. Mary's Basilica exterior.jpg", Fr James Bradley, CC BY 2.0:
 *          the west tower's belfry and the gable, close
 *          https://commons.wikimedia.org/wiki/File:St._Mary%27s_Basilica_exterior.jpg
 *  conv1   "St. Mary's Roman Catholic Basilica, Phoenix, Arizona, USA
 *          (54221040743).jpg", Domenico Convertini, CC BY-SA 2.0: from the
 *          south-west along Monroe, the west side, colours
 *          https://commons.wikimedia.org/wiki/File:St._Mary%27s_Roman_Catholic_Basilica,_Phoenix,_Arizona,_USA_(54221040743).jpg
 * No look-only sources. No commercial imagery.
 *
 * Ground: Mapterhorn dips about 1 m inside the footprint's north half, so
 * the front stairs start 1.3 m up to stay above the drawn street.
 *
 * Doubts: the north and west sides are seen in no photo; the sanctuary
 * and sacristies are drawn plain from the lidar. The crossing lantern's
 * form is a guess from a small lidar bump. The domes read grey-green in
 * conv1 and are drawn `copper`.
 *
 * Night: the front and towers are floodlit (stark); the windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, capPoly, ccw, gableRoof, onWall, prism, rectShape, revolve, save, type XY } from './atl-tech-tower'

// ─────────────────────────────────── kit ───────────────────────────────────

/** Triangulate a simple polygon (any winding) in 2D. */
export function tris2(pts: XY[]): Array<[XY, XY, XY]> {
  const tmp = new Part()
  capPoly(tmp, ccw(pts), 0, true)
  const out: Array<[XY, XY, XY]> = []
  for (let i = 0; i < tmp.pos.length; i += 9) {
    const q = (k: number): XY => [tmp.pos[i + k * 3], -tmp.pos[i + k * 3 + 2]]
    out.push([q(0), q(1), q(2)])
  }
  return out
}

/**
 * A slab whose face is a profile in a vertical plane: `prof` is [s, z]
 * points along the direction `u` from `o`, extruded `d0..d1` along the
 * plan normal n = (u.y, -u.x) (the right of u). Closed on all sides.
 */
export function profileSlab(p: Part, o: XY, u: XY, prof: Array<[number, number]>, d0: number, d1: number) {
  const n: XY = [u[1], -u[0]]
  const P = ([s, z]: [number, number], d: number): V3 => [o[0] + u[0] * s + n[0] * d, o[1] + u[1] * s + n[1] * d, z]
  const ring = ccw(prof as XY[])
  for (const [a, b, c] of tris2(ring)) {
    p.tri(P(a, d1), P(b, d1), P(c, d1)) // the face toward +n (d1 > d0)
    p.tri(P(a, d0), P(c, d0), P(b, d0)) // the face toward -n
  }
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    p.quad(P(a, d0), P(b, d0), P(b, d1), P(a, d1))
  }
}

/** A rectangle with its corners rounded by r (0 keeps one sharp), counter-clockwise. */
export function roundRect(x0: number, x1: number, y0: number, y1: number, r: [number, number, number, number], seg = 4): XY[] {
  const out: XY[] = []
  const corner = (cx: number, cy: number, rr: number, a0: number, px: number, py: number) => {
    if (rr <= 0) { out.push([px, py]); return }
    for (let i = 0; i <= seg; i++) {
      const a = a0 + (i / seg) * (Math.PI / 2)
      out.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)])
    }
  }
  const [rSW, rSE, rNE, rNW] = r
  corner(x0 + rSW, y0 + rSW, rSW, Math.PI, x0, y0)
  corner(x1 - rSE, y0 + rSE, rSE, -Math.PI / 2, x1, y0)
  corner(x1 - rNE, y1 - rNE, rNE, 0, x1, y1)
  corner(x0 + rNW, y1 - rNW, rNW, Math.PI / 2, x0, y1)
  return out
}

/** A regular n-gon ring (counter-clockwise) of circumradius r. */
export function ngon(c: XY, r: number, n: number, phase = 0): XY[] {
  return Array.from({ length: n }, (_, i) => {
    const a = phase + (i / n) * Math.PI * 2
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as XY
  })
}

/** Run `f(a, b)` for every edge of a counter-clockwise ring (outside on the right of a→b). */
export function edges(ring: XY[], f: (a: XY, b: XY, i: number) => void) {
  ring.forEach((a, i) => f(a, ring[(i + 1) % ring.length], i))
}

export const wallLen = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

// ─────────────────────────────── the basilica ──────────────────────────────

if (import.meta.main) {
  const stucco = new Part(), trim = new Part(), tile = new Part(), win = new Part(), dome = new Part(), door = new Part()

  const AX = 0.6 // the nave's axis
  const NX0 = -10.5, NX1 = 11.7, NY0 = -21, NY1 = 11, EAVE = 12.5, RIDGE = 19
  const TY0 = -27.5, TY1 = -21

  // ── Low parts first: the west wing, sacristies and north range ──
  prism(stucco, ccw([[-12.6, -0.3], [NX0, -0.3], [NX0, 6.7], [-15.6, 6.7], [-15.6, 19.6], [-6, 19.6], [-6, 11], [-12.6, 11]]), 0, 8.3, tile, 0.25)
  prism(stucco, ccw([[-15.6, 19.6], [-6, 19.6], [-6, 20], [9.5, 20], [9.5, 11], [13.97, 11], [13.97, 23.17], [-16.76, 23.17], [-16.76, 19.57]]), 0, 9.3, tile, 0.25)
  prism(stucco, ccw([[NX1, -2.2], [13.97, -2.2], [13.97, 11], [NX1, 11]]), 0, 9.3, tile, 0.2)

  // ── The nave: walls, tile gable roof, round-headed windows down both sides ──
  box(stucco, NX0, NX1, NY0, NY1, 0, EAVE, null, 0)
  gableRoof(tile, stucco, NX0, NX1, TY1, NY1, EAVE, RIDGE, 'y', 0.6, 0.3)
  for (let k = 0; k < 7; k++) {
    const y = -17.5 + k * 3.9
    if (y > 9.5) break
    // east side (a south, b north) and west side (a north, b south)
    onWall(win, [NX1, NY0], [NX1, NY1], archShape(y - NY0, 1.5, 6.2, 10.2, 8))
    if (y < -0.8 || y > 7) onWall(win, [NX0, NY1], [NX0, NY0], archShape(NY1 - y, 1.5, 9.0, 10.6, 8))
    onWall(win, [NX1, NY0], [NX1, NY1], archShape(y - NY0, 1.1, 1.2, 3.2, 6))
    if (y < -0.8) onWall(win, [NX0, NY1], [NX0, NY0], archShape(NY1 - y, 1.1, 1.2, 3.2, 6))
  }
  // a stucco eave band under the roof
  box(trim, NX0 - 0.25, NX1 + 0.25, NY0 + 0.1, NY1, EAVE - 0.6, EAVE, null, 0)

  // ── The sanctuary to the north and the little crossing lantern ──
  box(stucco, -6, 9.5, NY1, 20, 0, 13, null, 0)
  gableRoof(tile, stucco, -6, 9.5, NY1, 20, 13, 16.2, 'y', 0.5, 0.3)
  for (const y of [13.5, 17]) {
    onWall(win, [9.5, NY1], [9.5, 20], archShape(y - NY1, 1.2, 10.0, 11.6, 8))
    onWall(win, [-6, 20], [-6, NY1], archShape(20 - y, 1.2, 10.0, 11.6, 8))
  }
  const LC: XY = [AX, 6.5]
  revolve(stucco, LC, [[1.3, RIDGE - 1.2], [1.3, 20.0]], 8, Math.PI / 8, true, false)
  revolve(dome, LC, [[1.5, 20.0], [1.2, 20.6], [0.6, 21.1], [0, 21.3]], 8, Math.PI / 8)

  // ── The front between the towers: the Mission gable, balcony, rose ──
  const GX0 = -4.3, GX1 = 5.5
  const gable: Array<[number, number]> = [] // s from GX0 across the front, z
  {
    const w = GX1 - GX0, half = w / 2
    // the shoulders curve up in an S to a raised centre with a round head
    const prof = (t: number) => { // t 0..1 from the edge to the centre
      const s = Math.min(1, Math.max(0, (t - 0.12) / 0.55))
      const sCurve = s * s * (3 - 2 * s)
      const z = 17.4 + sCurve * 2.9
      const head = t > 0.72 ? Math.sqrt(Math.max(0, 1 - ((1 - t) / 0.28) ** 2)) * 1.4 : 0
      return z + head
    }
    gable.push([0, 0], [w, 0])
    for (let i = 0; i <= 16; i++) { const t = i / 16; gable.push([w - t * half, prof(t)]) }
    for (let i = 15; i >= 0; i--) { const t = i / 16; gable.push([t * half, prof(t)]) }
  }
  profileSlab(stucco, [GX0, TY1], [1, 0], gable, -0.2, 0.2) // the face, standing 0.2 proud of the nave front
  // the coping along the gable's top
  for (let i = 2; i < gable.length - 1; i++) {
    const a = gable[i], b = gable[i + 1]
    const P = (s: number, z: number, d: number): V3 => [GX0 + s, TY1 - d, z]
    trim.quad(P(a[0], a[1], 0.45), P(b[0], b[1], 0.45), P(b[0], b[1] + 0.3, 0.45), P(a[0], a[1] + 0.3, 0.45))
    trim.quad(P(a[0], a[1] + 0.3, 0.45), P(b[0], b[1] + 0.3, 0.45), P(b[0], b[1] + 0.3, -0.2), P(a[0], a[1] + 0.3, -0.2))
  }
  // the cross on the gable
  box(trim, AX - 0.15, AX + 0.15, TY1 - 0.35, TY1 + 0.05, 21.2, 23.6, trim, 0.05)
  box(trim, AX - 0.65, AX + 0.65, TY1 - 0.35, TY1 + 0.05, 22.6, 22.95, trim, 0.05)
  // the rose window with a pale ring
  const FS: [XY, XY] = [[GX0, TY1 - 0.2], [GX1, TY1 - 0.2]]
  const ring = (r: number, seg = 16) => Array.from({ length: seg }, (_, i) => [AX - GX0 + r * Math.cos((i / seg) * 2 * Math.PI), 13 + r * Math.sin((i / seg) * 2 * Math.PI)] as [number, number])
  onWall(trim, FS[0], FS[1], ring(2.7), 0.04)
  onWall(win, FS[0], FS[1], ring(2.2), 0.08)
  // the arched door group under the balcony and the balcony itself
  onWall(trim, FS[0], FS[1], archShape(AX - GX0, 3.4, 3.4, 6.2, 10), 0.04)
  onWall(door, FS[0], FS[1], archShape(AX - GX0, 2.6, 3.4, 6.0, 10), 0.08)
  for (const s of [-2.9, 2.9]) onWall(win, FS[0], FS[1], archShape(AX - GX0 + s, 1.0, 4.4, 6.3, 6), 0.08)
  box(trim, GX0, GX1, TY1 - 1.2, TY1 - 0.2, 7.6, 7.9, trim, 0.05) // balcony floor
  box(trim, GX0, GX1, TY1 - 1.2, TY1 - 0.95, 7.9, 8.8, trim, 0.05) // its balustrade

  // ── The towers ──
  for (const cx of [-7.6, 8.8]) {
    const x0 = cx - 3.3, x1 = cx + 3.3
    box(stucco, x0, x1, TY0, TY1, 0, 15.8, trim, 0)
    box(trim, x0 - 0.25, x1 + 0.25, TY0 - 0.25, TY1 + 0.25, 15.4, 15.9, trim, 0.1) // string course
    box(stucco, x0 + 0.25, x1 - 0.25, TY0 + 0.25, TY1 - 0.25, 15.9, 21.4, null, 0)
    box(trim, x0 - 0.1, x1 + 0.1, TY0 - 0.1, TY1 + 0.1, 21.4, 22.2, trim, 0.25) // belfry cornice
    // faces: south, east, north, west (a → b with the outside on the right)
    const faces: Array<[XY, XY]> = [[[x0, TY0], [x1, TY0]], [[x1, TY0], [x1, TY1]], [[x1, TY1], [x0, TY1]], [[x0, TY1], [x0, TY0]]]
    faces.forEach(([a, b], f) => {
      const inner: [XY, XY] = [[a[0] + (a[0] < cx ? 0.25 : -0.25), a[1] + (a[1] < -24 ? 0.25 : -0.25)], [b[0] + (b[0] < cx ? 0.25 : -0.25), b[1] + (b[1] < -24 ? 0.25 : -0.25)]]
      const L = wallLen(inner[0], inner[1])
      // the belfry: two tall round-headed openings
      for (const s of [L / 2 - 1.35, L / 2 + 1.35]) {
        onWall(trim, inner[0], inner[1], archShape(s, 1.75, 16.5, 19.7, 8), 0.03)
        onWall(win, inner[0], inner[1], archShape(s, 1.25, 16.7, 19.7, 8), 0.07)
      }
      const Lo = wallLen(a, b)
      // the shaft: a round window on the front and outer sides, slit windows
      if (f === 0 || (f === 1 && cx > 0) || (f === 3 && cx < 0)) {
        const rw = Array.from({ length: 12 }, (_, i) => [Lo / 2 + 0.85 * Math.cos((i / 12) * 2 * Math.PI), 13 + 0.85 * Math.sin((i / 12) * 2 * Math.PI)] as [number, number])
        onWall(win, a, b, rw, 0.06)
        for (const z0 of [5.0, 9.2]) onWall(win, a, b, archShape(Lo / 2, 0.8, z0, z0 + 1.6, 6), 0.06)
      }
      if (f === 0) onWall(door, a, b, archShape(Lo / 2, 1.6, 3.4, 5.6, 8), 0.06)
    })
    // the octagonal arcaded drum, the dome, the lantern and the cross
    const C: XY = [cx, (TY0 + TY1) / 2]
    revolve(stucco, C, [[2.5, 22.2], [2.5, 25.3]], 8, Math.PI / 8, true, false)
    edges(ngon(C, 2.5 / Math.cos(Math.PI / 8) * 1.0, 8, Math.PI / 8), (a, b) => {
      const L = wallLen(a, b)
      onWall(win, a, b, archShape(L / 2, 1.0, 22.7, 24.4, 6), 0.06)
    })
    revolve(trim, C, [[2.9, 25.3], [2.9, 25.7]], 8, Math.PI / 8, true, true)
    revolve(dome, C, [[2.7, 25.7], [2.55, 26.6], [2.1, 27.6], [1.3, 28.4], [0.5, 28.7]], 12, 0)
    revolve(trim, C, [[0.55, 28.6], [0.55, 29.6], [0.75, 29.7], [0.0, 30.2]], 8, 0)
    box(trim, cx - 0.12, cx + 0.12, C[1] - 0.12, C[1] + 0.12, 30.1, 32.4, trim, 0.04)
    box(trim, cx - 0.55, cx + 0.55, C[1] - 0.12, C[1] + 0.12, 31.4, 31.7, trim, 0.04)
  }

  // ── The terrace across the front: arcade below, balustrade, stairs ──
  const PX0 = -10.9, PX1 = 12.1, PY0 = -28.6
  box(stucco, PX0 + 3.4, PX1 - 3.4, PY0, TY0, 0, 3.4, trim, 0.1)
  {
    const a: XY = [PX0 + 3.4, PY0], b: XY = [PX1 - 3.4, PY0], L = wallLen(a, b)
    for (let k = 0; k < 5; k++) onWall(door, a, b, archShape(L / 2 + (k - 2) * 3.1, 1.9, 0, 1.9, 8), 0.05)
  }
  box(trim, PX0 + 3.4, PX1 - 3.4, PY0, PY0 + 0.3, 3.4, 4.3, trim, 0.05) // balustrade
  // stairs up both ends, rising toward the centre
  for (const side of [-1, 1]) {
    const xe = side < 0 ? PX0 : PX1, xs = side < 0 ? PX0 + 3.4 : PX1 - 3.4
    for (let i = 0; i < 4; i++) {
      const xa = xe + (xs - xe) * (i / 4), xb = xs
      box(stucco, Math.min(xa, xb), Math.max(xa, xb), PY0, TY0, 0, 1.3 + 0.7 * i, trim, 0)
    }
    box(trim, Math.min(xe, xs), Math.max(xe, xs), PY0 - 0.01, PY0 + 0.3, 1.3, 2.2, trim, 0.05) // the stair's parapet
  }

  await save('phx-st-marys-basilica', "St. Mary's Basilica", [
    {
      part: stucco,
      material: {
        ...finish('st-marys-stucco', 0xe6bfa5),
        floodlight: (p, n) => (p[1] < -20 && n[2] < 0.5 ? (n[1] < -0.5 ? 0.9 : 0.6) : 0),
      },
    },
    { part: trim, material: { ...finish('st-marys-trim', 0xf6e7da), floodlight: (p, n) => (p[1] < -20 && n[2] < 0.5 ? 0.8 : 0) } },
    { part: tile, material: PALETTE.terracotta },
    { part: win, material: PALETTE.window },
    { part: dome, material: PALETTE.copper },
    { part: door, material: finish('st-marys-door', 0x8a6a52) },
  ], { height: 32.4, anchor: [33.4507751, -112.0693994], bearing: 0 })
}
