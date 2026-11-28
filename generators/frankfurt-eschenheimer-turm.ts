/**
 * Eschenheimer Turm, Frankfurt am Main: procedural, CC0-1.0.
 * bun generators/frankfurt-eschenheimer-turm.ts
 *
 * The late-Gothic gate tower (Madern Gerthener, 1426-28): a square gate
 * block, the round tower on it, an arched corbel table carrying the parapet
 * at the wall-walk, four corner turrets and the steep central spire, all in
 * ochre render with red sandstone dressings and slate roofs.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing -9.5 (the gate
 * block's sides, from OSM way/53671623). Origin: the round tower's axis, the
 * centre of OSM way/1071371036, 8.679687 50.116946; y = 0 is the street.
 *
 * Published (German Wikipedia, "Eschenheimer Turm"):
 * - 48 m to the top of the knob; eight full storeys and two in the spire.
 * - the gate block 10.7 m square; the round tower 10.20-10.28 m across.
 * - the projecting wall-walk (Wehrgang) at 31 m, the steep spire with four
 *   small turrets (Scharwachttürmchen) round it.
 * - two octagonal watch-houses (Wichhäuschen) 7.80 m tall at the corners of
 *   the north (field) side, at the second storey.
 * - the passage 4.25 m wide under a Gothic arch; the city arms (south) and
 *   the imperial eagle (north) at the second storey.
 *
 * OSM: the outline way/53671623 (the gate block, with a stub on the east);
 * the round tower way/1071371036 (r 5.1, centred 0.8 m east of the block's
 * centre, as the photos show); the roof plan way/96390549, whose lobes put
 * the four turrets on the frame's axes, 4.5 m out.
 *
 * Heights, measured off photos scaled from the published 10.24 m diameter:
 * - "Eschenheimer Turm in the evening sun from north west.jpg" (north side,
 *   near orthographic): block cornice 12.3 m; the watch-houses' corbels
 *   10.9-12.1, walls to 17.0, gabled crowns to 18.2, spires to 23.6 m,
 *   3.5 m across, one at the north-west corner and one 2.4 m east of the
 *   block's centre; the corbel table 30.4-31.8 m; the parapet to 36.0 m;
 *   the turrets' drums to 37.6 m, their cones to 43.7 m; the spire to
 *   47.4 m, the knob to 48 m; the north passage's tall pointed frame
 *   springing at 8.8 m, apex 10.9 m, 2.5 m west of the block's centre.
 * - "Eschenheimer Turm Frankfurt November 2012.jpg" (south side): the
 *   slate skirt roof over the block's south, east and west sides from
 *   10.8 m to the tower at 13 m; the south passage arch (now the
 *   restaurant's door) 3.5 m wide, apex 4.6 m; the window column on the
 *   south axis at 14.8, 18.6, 22.3 and 26.1 m; the city arms at 16.4 m.
 *
 * Estimated: the corbel count (24), the parapet's slit windows, the
 * spire's dormers (four on the axes at 39.5 m, four on the diagonals at
 * 43.5 m) from the photos' rows; the north windows on two columns at -40°
 * and +50° from north; the east side's windows; window sizes 0.8 x 1.3 m.
 * Left out: the chimney by the spire, the weathervane's flag (a small pole and
 * plate in sandstone colour stand for it), the gate's portcullis slot, the restaurant's awnings.
 *
 * Colours (daylight photos, pulled to the palette): the warm ochre-tan
 * render, red sandstone dressings (knob and vanes too), the corbel table
 * a darker shade of the same stone as it reads in shadow, mid-grey slate.
 * Night: the tower is floodlit; the render and sandstone carry
 * `_FLOODLIGHT`; the windows glow; the passages are `entrance`.
 *
 * Photos (evidence, Wikimedia Commons):
 * - "Eschenheimer Turm in the evening sun from north west.jpg", Jürgen Matern, CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:Eschenheimer_Turm_in_the_evening_sun_from_north_west.jpg
 * - "Eschenheimer Turm Frankfurt November 2012.jpg", Felix König, CC BY 3.0
 *   https://commons.wikimedia.org/wiki/File:Eschenheimer_Turm_Frankfurt_November_2012.jpg
 * - "Eschenheimer Turm Frankfurt am Main 2024-10-02 06.jpg", Leonhard Lenz, CC0
 *   https://commons.wikimedia.org/wiki/File:Eschenheimer_Turm_Frankfurt_am_Main_2024-10-02_06.jpg
 * - "Eschenheimer Turm Frankfurt am Main 2024-10-02 02.jpg", Leonhard Lenz, CC0
 *   https://commons.wikimedia.org/wiki/File:Eschenheimer_Turm_Frankfurt_am_Main_2024-10-02_02.jpg
 * Look-only: none.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe } from './berlin-fernsehturm'
import { save } from './atl-flatiron-building'
import { triangulate, type XY } from './chi-aon-center'

const TAU = Math.PI * 2
const D = Math.PI / 180

// ───────────────────────────── face helpers ─────────────────────────────

/** A local face frame: origin O on the wall, u along it, n out of it. */
type Frame = { O: V3; u: V3; n: V3 }
const fpt = (f: Frame, s: number, z: number, d = 0): V3 => [f.O[0] + f.u[0] * s + f.n[0] * d, f.O[1] + f.u[1] * s + f.n[1] * d, z]
/** The frame on a cylinder of radius r at math angle a (from +x, CCW). */
const cylFrame = (r: number, a: number, c: XY = [0, 0]): Frame => ({ O: [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), 0], u: [-Math.sin(a), Math.cos(a), 0], n: [Math.cos(a), Math.sin(a), 0] })
/** The frame on a plane wall: u from a toward b, outward on its right. */
function wallFrame(a: XY, b: XY): Frame {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0]
  return { O: [a[0], a[1], 0], u, n: [u[1], -u[0], 0] }
}

/** A flat polygon (s, z) on a face, `d` out from it, facing out. */
export function facePoly(p: Part, f: Frame, poly: XY[], d: number) {
  const ccwPoly = area(poly) < 0 ? [...poly].reverse() : poly
  for (const [a, b, c] of triangulate(ccwPoly)) p.tri(fpt(f, ccwPoly[a][0], ccwPoly[a][1], d), fpt(f, ccwPoly[b][0], ccwPoly[b][1], d), fpt(f, ccwPoly[c][0], ccwPoly[c][1], d))
}
/** A polygon on a face extruded from d0 to d1: front face and sides. */
export function faceSlab(p: Part, f: Frame, poly: XY[], d0: number, d1: number, sides: Part = p) {
  const P = area(poly) < 0 ? [...poly].reverse() : poly
  facePoly(p, f, P, d1)
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length]
    // Counter-clockwise in (s, z) seen from outside: the side faces out of the polygon.
    sides.quad(fpt(f, a[0], a[1], d0), fpt(f, b[0], b[1], d0), fpt(f, b[0], b[1], d1), fpt(f, a[0], a[1], d1))
  }
}
const area = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2

/** A pointed (equilateral-ish) arch outline: jambs from z0, springing at zs, apex at za; n points per side. */
export function pointedArch(sc: number, hw: number, z0: number, zs: number, za: number, n = 5): XY[] {
  const out: XY[] = [[sc - hw, z0], [sc + hw, z0]]
  // Each side is a circular arc centred on the other side's springing line.
  const h = za - zs
  const R = (hw * hw + h * h) / (2 * hw) // radius of an arc through the springing and the apex, centred at the springing level
  const cx = sc + hw - R // right arc's centre
  const a1 = Math.atan2(h, sc - cx)
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * a1
    out.push([cx + R * Math.cos(t), zs + R * Math.sin(t)])
  }
  const cxl = sc - hw + R
  for (let i = n - 1; i >= 0; i--) {
    const t = Math.PI - (i / n) * a1
    out.push([cxl + R * Math.cos(t), zs + R * Math.sin(t)])
  }
  return out
}
/** A rectangle in (s, z). */
const rect = (s0: number, s1: number, z0: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]

// ───────────────────────────── the tower ─────────────────────────────

if (import.meta.main) await build()
function gilt() { return new Part() }

async function build() {
  const render = new Part()   // ochre render
  const stone = new Part()    // red sandstone dressings, corbels
  const slate = new Part()    // slate roofs
  const win = new Part()      // windows
  const door = new Part()     // the passages
  const gold = gilt()        // knob and vanes, drawn in sandstone
  const shade = new Part()    // the corbel table: the stone in shadow

  const R = 5.12, K = 24
  const BX = -1.0, H = 5.35 // gate block centre (x) and half side
  const BW = BX - H, BE = BX + H, BS = -H, BN = H

  // ── The gate block ──
  // North wall to the cornice at 12.3; south, east and west walls to the
  // skirt roof's eave at 10.8, rising to 12.3 over the last 2 m at the north.
  const eave = (x: number, y: number) => (y >= BN - 0.01 ? 12.3 : 10.8 + 1.5 * Math.max(0, (y - (BN - 2.5)) / 2.5))
  const ring: XY[] = []
  const corners: XY[] = [[BW, BS], [BE, BS], [BE, BN], [BW, BN]]
  for (let i = 0; i < 4; i++) {
    const a = corners[i], b = corners[(i + 1) % 4]
    for (let k = 0; k < 6; k++) ring.push([a[0] + ((b[0] - a[0]) * k) / 6, a[1] + ((b[1] - a[1]) * k) / 6])
  }
  // Walls with a varying top.
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    render.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], eave(b[0], b[1])], [a[0], a[1], eave(a[0], a[1])])
  }
  // The skirt roof from the eave (0.35 m out) up to the tower at 13 m, on
  // the same angular stations as the block's perimeter.
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length
    const e = (q: XY): V3 => {
      const dx = q[0] - BX, dy = q[1], m = Math.max(Math.abs(dx), Math.abs(dy))
      const k = (H + 0.35) / m
      return [BX + dx * k, dy * k, eave(q[0], q[1]) - 0.15]
    }
    const t = (q: XY): V3 => {
      const a = Math.atan2(q[1], q[0] - 0) // round the tower's own axis
      return [R * Math.cos(a), R * Math.sin(a), q[1] >= BN - 0.01 ? 12.3 : 13.0]
    }
    const A = e(ring[i]), B = e(ring[j]), C = t(ring[j]), Dd = t(ring[i])
    // Over the north wall there is no skirt: the wall-walk is a flat top.
    const north = ring[i][1] >= BN - 0.01 && ring[j][1] >= BN - 0.01
    if (north) {
      const a = ring[i], b = ring[j]
      render.quad([a[0], a[1], 12.3], [b[0], b[1], 12.3], C, Dd)
      continue
    }
    slate.quad(A, B, C, Dd)
    // Eave soffit: from the wall top out to the eave edge.
    const a = ring[i], b = ring[j]
    slate.quad([b[0], b[1], eave(b[0], b[1])], [a[0], a[1], eave(a[0], a[1])], A, B)
  }
  // North cornice: a sandstone string at 12.0-12.3, 0.25 out.
  {
    const f = wallFrame([BE, BN], [BW, BN])
    faceSlab(stone, f, rect(-0.25, 2 * H + 0.25, 11.95, 12.35), 0, 0.25)
  }
  // Corner quoins: sandstone strips on each corner, both faces.
  for (const [a, b] of [[corners[0], corners[1]], [corners[1], corners[2]], [corners[2], corners[3]], [corners[3], corners[0]]] as [XY, XY][]) {
    const f = wallFrame(a, b), L = 2 * H
    const top = Math.min(eave(a[0], a[1]), eave(b[0], b[1])) - 0.2
    faceSlab(stone, f, rect(0, 0.55, 0, top), 0, 0.05)
    faceSlab(stone, f, rect(L - 0.55, L, 0, top), 0, 0.05)
  }
  // North passage: the tall pointed frame and the gate in it.
  {
    const f = wallFrame([BE, BN], [BW, BN]) // s runs east → west along the north face
    const sc = BE - (BX - 2.5) // s of the arch centre (x = BX - 2.5)
    const outer = pointedArch(sc, 2.35, 0, 8.8, 10.95, 6), inner = pointedArch(sc, 1.95, 0, 8.9, 10.6, 6)
    // Frame band: outer minus inner, drawn as the two jamb strips and the arch ring.
    faceSlab(stone, f, rect(sc - 2.35, sc - 1.95, 0, 8.8), 0, 0.08)
    faceSlab(stone, f, rect(sc + 1.95, sc + 2.35, 0, 8.8), 0, 0.08)
    // Arch ring as quads between outer and inner arc points.
    const oa = outer.slice(2), ia = inner.slice(2)
    for (let k = 0; k < oa.length - 1; k++) facePoly(stone, f, [ia[k], oa[k], oa[k + 1], ia[k + 1]], 0.08)
    // The pointed gate inside, recessed.
    faceSlab(door, f, pointedArch(sc, 1.45, 0, 4.3, 5.9, 5), -0.05, 0.03, stone)
    faceSlab(stone, f, rect(sc - 1.7, sc + 1.7, 5.9, 6.2), 0, 0.06)
  }
  // South passage (the restaurant door) with a sandstone surround.
  {
    const f = wallFrame([BW, BS], [BE, BS])
    const sc = -1.6 - BW
    faceSlab(stone, f, pointedArch(sc, 2.15, 0, 3.2, 4.95, 5), 0, 0.06)
    faceSlab(door, f, pointedArch(sc, 1.75, 0, 3.2, 4.6, 5), 0.06, 0.09)
  }
  // Gallery openings under the skirt on the south, east and west faces.
  for (const [a, b] of [[corners[0], corners[1]], [corners[1], corners[2]], [corners[3], corners[0]]] as [XY, XY][]) {
    const f = wallFrame(a, b)
    for (let k = 0; k < 5; k++) {
      const s = 1.4 + k * 1.9
      if (s > 2 * H - 2.6 && b[1] === BN) continue
      faceSlab(win, f, rect(s, s + 0.9, 9.3, 10.3), 0, 0.04)
    }
  }

  // ── The watch-houses on the north side ──
  for (const cx of [BW + 1.6, BX + 2.4]) {
    const c: XY = [cx, BN - 0.7], r = 1.65, ro = r / Math.cos(Math.PI / 8)
    const ph = Math.PI / 8
    // Corbelled foot, walls, gabled crown and spire.
    lathe([[0.9, 10.6], [ro, 12.1]], () => stone, 8, 10, c, ph)
    lathe([[ro, 12.1], [ro, 17.0]], () => render, 8, 10, c, ph)
    lathe([[ro + 0.08, 17.2], [0.9, 20.0], [0, 24.0]], () => slate, 8, 25, c, ph)
    lathe([[0.09, 23.4], [0.09, 24.6]], () => gold, 4, 10, c)
    // Gables on each face, flush with the wall.
    for (let k = 0; k < 8; k++) {
      const a0 = ph + (k / 8) * TAU, a1 = ph + ((k + 1) / 8) * TAU
      const p0: V3 = [c[0] + ro * Math.cos(a0), c[1] + ro * Math.sin(a0), 17.0], p1: V3 = [c[0] + ro * Math.cos(a1), c[1] + ro * Math.sin(a1), 17.0]
      const am = (a0 + a1) / 2, rm = r
      const apex: V3 = [c[0] + rm * Math.cos(am), c[1] + rm * Math.sin(am), 18.5]
      render.tri(p0, p1, apex)
      // Small window on the faces that look out (north, east, west).
      if (Math.sin(am) > -0.2) {
        const f = cylFrame(r + 0.01, am, c)
        faceSlab(stone, f, rect(-0.36, 0.36, 13.6, 15.4), 0, 0.04)
        faceSlab(win, f, rect(-0.24, 0.24, 13.75, 15.25), 0.04, 0.06)
      }
    }
  }

  // ── The round tower ──
  lathe([[R, 12.0], [R, 22], [R, 29.8]], () => render, K, 30)
  // Windows: sandstone frame and slate-blue light. [compass bearing, heights]
  const cols: [number, number[]][] = [
    [-40, [15.6, 19.8, 23.9, 27.5]],
    [50, [15.6, 19.8, 23.9, 27.5]],
    [180, [14.8, 18.6, 22.3, 26.1]],
    [100, [27.0]],
    [262, [27.0]],
    [5, [29.0]],
  ]
  for (const [cb, zs] of cols) {
    const f = cylFrame(R, (90 - cb) * D)
    for (const z of zs) {
      faceSlab(stone, f, rect(-0.55, 0.55, z - 0.85, z + 0.85), 0, 0.05)
      faceSlab(win, f, rect(-0.38, 0.38, z - 0.65, z + 0.65), 0.05, 0.07)
    }
  }
  // The arms: the city's (south) and the empire's (north), a sandstone panel each.
  for (const [cb, z] of [[180, 16.4], [-40, 17.6]] as [number, number][]) {
    const f = cylFrame(R, (90 - cb) * D)
    faceSlab(stone, f, rect(-0.6, 0.6, z - 0.7, z + 0.7), 0, 0.08)
  }

  // ── The corbel table and parapet ──
  const RP = 5.8, NC = 24, ZC0 = 29.8, ZC1 = 31.4, ZA = 32.8, ZP = 35.5
  for (let i = 0; i < NC; i++) {
    const a0 = (i / NC) * TAU, a1 = ((i + 1) / NC) * TAU
    const cw = 0.24 // corbel half-width (in angle × r)
    // Corbel: a stepped block from the wall out to the parapet face.
    const fc = cylFrame(R, a0)
    faceSlab(shade, fc, rect(-cw, cw, ZC0, ZC1), 0, RP - R - 0.02)
    // Parapet face between corbel i and i+1, with an arched lower edge.
    const n = 6, P = (a: number, z: number, r: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]
    const aL = a0 + cw / RP, aR = a1 - cw / RP
    const arc: [number, number][] = []
    for (let k = 0; k <= n; k++) {
      const t = k / n, a = aL + (aR - aL) * t
      arc.push([a, ZC1 + (ZA - ZC1) * Math.sin(Math.PI * t)])
    }
    for (let k = 0; k < n; k++) {
      const [a, z] = arc[k], [b, zb] = arc[k + 1]
      render.quad(P(a, z, RP), P(b, zb, RP), P(b, ZP, RP), P(a, ZP, RP))
      // Soffit of the arch, back to the tower wall.
      shade.quad(P(b, zb, RP), P(a, z, RP), P(a, z, R), P(b, zb, R))
    }
    // Over the corbel: the parapet face down to the corbel's foot of the arch.
    const ac0 = a0 - cw / RP, ac1 = a0 + cw / RP
    render.quad(P(ac0, ZC1, RP), P(ac1, ZC1, RP), P(ac1, ZP, RP), P(ac0, ZP, RP))
    shade.quad(P(ac1, ZC1, RP), P(ac0, ZC1, RP), P(ac0, ZC1, R), P(ac1, ZC1, R))
  }
  // The tower wall behind the corbels and arches, dark as the shadow in
  // the photos, and up inside the parapet.
  lathe([[R, 29.8], [R, ZA + 0.1]], () => shade, K * 2, 30)
  lathe([[R, ZA + 0.1], [R, ZP - 1.0]], () => render, K, 30)
  // Parapet top and inner face.
  lathe([[RP, ZP], [RP - 0.6, ZP], [RP - 0.6, ZP - 1.0]], () => render, K * 2, 10)
  lathe([[RP - 0.6, ZP - 1.0], [2.8, ZP - 1.0]], () => slate, K, 10)
  // Slit windows in the parapet between the turrets.
  for (const cb of [45, 135, 225, 315, 22, 68, 112, 158, 202, 248, 292, 338]) {
    const f = cylFrame(RP, (90 - cb) * D)
    faceSlab(win, f, rect(-0.25, 0.25, 33.9, 35.0), 0, 0.03)
  }

  // ── Four turrets on the axes ──
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU, c: XY = [4.6 * Math.cos(a), 4.6 * Math.sin(a)]
    lathe([[1.1, ZP - 1.0], [1.1, 37.0]], () => render, 12, 30, c)
    lathe([[1.2, 36.9], [1.15, 37.15], [0.75, 39.6], [0, 43.7]], () => slate, 12, 30, c)
    lathe([[0.1, 43.5], [0.1, 44.6]], () => gold, 4, 10, c)
    lathe([[0.22, 44.6], [0.22, 44.9], [0, 45.0]], () => gold, 6, 10, c)
    // A small window on the turret's outer face.
    const f = cylFrame(1.1, a, c)
    faceSlab(stone, f, rect(-0.28, 0.28, 35.5, 36.6), 0, 0.04)
    faceSlab(win, f, rect(-0.18, 0.18, 35.6, 36.5), 0.04, 0.06)
  }

  // ── The central spire, with dormers ──
  const spire: [number, number][] = [[3.0, ZP - 1.0], [2.95, 36.8], [2.6, 39.0], [1.9, 41.8], [1.0, 44.6], [0.28, 46.9], [0, 47.4]]
  lathe(spire, () => slate, 16, 30, [0, 0], TAU / 32)
  const spireR = (z: number) => {
    for (let k = 0; k < spire.length - 1; k++) if (z <= spire[k + 1][1]) { const [r0, z0] = spire[k], [r1, z1] = spire[k + 1]; return r0 + ((r1 - r0) * (z - z0)) / (z1 - z0) }
    return 0
  }
  /** A gabled dormer facing compass bearing cb, its face at height z0..z0+h. */
  function dormer(cb: number, z0: number, w: number, h: number) {
    const a = (90 - cb) * D, rf = spireR(z0 + h / 2) + (h < 1.2 ? 0.3 : 0.55)
    const f = cylFrame(rf, a), back = -1.6
    faceSlab(render, f, rect(-w / 2, w / 2, z0, z0 + h), back, 0)
    // Gable roof: two slopes from the eaves to the ridge, back into the spire.
    const zr = z0 + h + w * 0.55
    const L: V3 = fpt(f, -w / 2 - 0.1, z0 + h, 0.1), Rr: V3 = fpt(f, w / 2 + 0.1, z0 + h, 0.1), T: V3 = fpt(f, 0, zr, 0.1)
    const Lb = fpt(f, -w / 2 - 0.1, z0 + h, back), Rb = fpt(f, w / 2 + 0.1, z0 + h, back), Tb = fpt(f, 0, zr, back)
    slate.quad(Rr, T, Tb, Rb)
    slate.quad(T, L, Lb, Tb)
    render.tri(fpt(f, -w / 2, z0 + h, 0), fpt(f, w / 2, z0 + h, 0), fpt(f, 0, zr - 0.05, 0))
    faceSlab(stone, f, rect(-w / 2 + 0.12, w / 2 - 0.12, z0 + 0.15, z0 + h - 0.1), 0, 0.03)
    faceSlab(win, f, rect(-w / 2 + 0.25, w / 2 - 0.25, z0 + 0.3, z0 + h - 0.25), 0.03, 0.05)
  }
  for (const cb of [0, 90, 180, 270]) dormer(cb + 45, 38.8, 1.2, 1.4)
  for (const cb of [0, 90, 180, 270]) dormer(cb, 42.7, 0.9, 1.1)
  // Knob and vane.
  lathe([[0.12, 47.2], [0.12, 47.6], [0.38, 47.75], [0.38, 48.05], [0.12, 48.2], [0.07, 48.2], [0.07, 49.4]], () => gold, 8, 40)
  {
    const f: Frame = { O: [0, 0, 0], u: [1, 0, 0], n: [0, -1, 0] }
    faceSlab(gold, f, [[0.07, 48.6], [1.1, 48.6], [1.1, 49.3], [0.07, 49.3]], -0.03, 0.03)
  }

  // ── Output ──
  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : p[2] < 12.5 ? 0.85 : p[2] < 37 ? 0.75 : 0.45)
  stone.pos.push(...gold.pos); stone.nrm.push(...gold.nrm); stone.uv.push(...gold.uv)
  const parts = [
    { part: render, material: { ...finish('eschenheimer-render', 0xc4a47e), floodlight: lit } },
    { part: stone, material: { ...finish('eschenheimer-sandstone', 0xb9725f), floodlight: lit } },
    { part: slate, material: finish('eschenheimer-slate', 0x80868d) },
    { part: win, material: PALETTE.window },
    { part: door, material: { ...PALETTE.entrance, color: 0x8c6c52 } },
    { part: shade, material: { ...finish('eschenheimer-stone-shade', 0x96784f), floodlight: lit } },
  ]
  return save('frankfurt-eschenheimer-turm', 'Eschenheimer Turm', parts, { bearing: -9.5, elevation: 0, height: 49.4 }, 6500)
}
