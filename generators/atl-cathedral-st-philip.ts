/**
 * Cathedral of St. Philip (1959-62, Harold Bush-Brown), Atlanta: procedural,
 * CC0-1.0.
 * bun generators/atl-cathedral-st-philip.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, bearing 0 (the nave runs north
 * to south). Origin: the area centroid of OSM way/267773373 (-84.3871372,
 * 33.8308240). That outline covers the whole close: the cathedral in its
 * south-west corner (nave x -38..-18, y -16..-86), the cloister and parish
 * house to the north-east, the hall north of them and the memorial garden
 * on the west. The model draws them all, the cathedral in detail and the
 * rest as plain masses at their lidar heights.
 * y = 0 is the lowest ground under the footprint, on the Peachtree Road
 * (east) side (lidar ground 289.3 m). The cathedral's floor is 4.2 m up, on
 * the crest of the hill.
 *
 * Form: a Gothic Revival cathedral in warm tan sandstone with pale limestone
 * dressings: a long nave with lean-to aisles (pointed lancets) and a
 * clerestory of round quatrefoil windows, steep grey slate roofs, shallow
 * transepts, a short chancel with side chapels and a polygonal apse, a
 * gabled porch on the east side near the north end, and over the crossing
 * a big square tower: a plain stage, a belfry with paired tall louvred
 * lancets on each face, angle buttresses and a crenellated parapet.
 *
 * Sources
 * - OSM way/267773373 (outline, building=cathedral) and relation/3591730
 *   (the same outline as a multipolygon building with three courtyards as
 *   inner ways 267773349, 267773370, 267773367, left open here); the nave
 *   sits about 1.5 m east of the lidar's, the model follows the lidar.
 * - USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 1-2 m grid, heights
 *   above y = 0: nave eaves 18.7, ridge 24.8 at x -28; aisles 14.2; transept
 *   y -54..-66, x -44..-12, ridge 24.4; chancel y -66..-84, ridge 24.7; side
 *   chapels 9.0; the tower x -34..-22, y -54..-66, roof deck 40.8,
 *   parapet 42.2; parish house roofs 11-12, the hall's ridge 20.8, eaves 13.7
 *   (all measured).
 * - USGS NAIP (public domain): plan, the slate and the parish house's white
 *   flat roofs.
 * - Photos (Wikimedia Commons, EVIDENCE): Farragutful, "St. Philip -
 *   Atlanta 01.jpg", "02", "03", "04", "05", "06", "07", "10.jpg",
 *   CC BY-SA 4.0 (east side and porch, tower, transept, hall).
 * Published: built 1959-62 (the nave, tower and chancel), Episcopal Diocese
 *   of Atlanta; on Peachtree Road at Andrews Drive.
 * Estimated from photos: window sizes and bay counts (seven nave bays), the
 *   tower's openings, the porch.
 * Doubts: the west side and the north end are photographed only in part;
 *   they mirror the east. The parish buildings are plain blocks with window
 *   bands; their detail (gables, porte-cochere) is simplified. The
 *   memorial garden's walls on the west are a low stone mass.
 * Colour: the sandstone's warm tan from the daylight photos (Farragutful),
 *   pulled to the palette's lightness; pale limestone trim; grey slate.
 * Night: the tower is floodlit; windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, extrudeShape, lathe, arc, finishGlb, writeModel } from './sea-tacoma-union-station'

// ---------------------------------------------------------------- helpers

function qf(part: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) part.quad(a, b, c, d)
  else part.quad(d, c, b, a)
}
function tf(part: Part, a: V3, b: V3, c: V3, want: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) part.tri(a, b, c)
  else part.tri(a, c, b)
}
function box(wall: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bevel = 0.3) {
  prism(wall, top, bevel > 0 ? chamfer(rect(x0, y0, x1, y1), bevel) : rect(x0, y0, x1, y1), z0, z1)
}
const faceX = (x: number, sgn: 1 | -1): Face => ({ o: [x, 0, 0], n: [sgn, 0] })
const faceY = (y: number, sgn: 1 | -1): Face => ({ o: [0, y, 0], n: [0, sgn] })
const sOf = (f: Face, w: number) => (f.n[0] !== 0 ? (f.n[0] > 0 ? w : -w) : f.n[1] > 0 ? -w : w)
const R = (s0: number, z0: number, s1: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
function pointed(sc: number, w: number, z0: number, zs: number, segs = 5): XY[] {
  const h = w / 2
  return [[sc - h, z0], [sc + h, z0], ...arc(sc - h, zs, w, 0, 60, segs), ...arc(sc + h, zs, w, 120, 180, segs).slice(1)]
}
function pointedBand(sc: number, w0: number, w1: number, z0: number, zs: number, segs = 6): XY[] {
  const inner = pointed(sc, w0, z0, zs, segs), outer = pointed(sc, w1, z0, zs + (w1 - w0) * 0.25, segs)
  return [outer[0], inner[0], ...inner.slice(2).reverse(), inner[1], outer[1], ...outer.slice(2)]
}
/** A gable roof over a rectangle, the ridge along y or x; gable-end triangles to `end`. */
function gableRoof(roof: Part, end: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, axis: 'x' | 'y', over = 0.4) {
  if (axis === 'y') {
    const xm = (x0 + x1) / 2
    qf(roof, [x0 - over, y0, z0], [x0 - over, y1, z0], [xm, y1, z1], [xm, y0, z1], [-(z1 - z0), 0, xm - x0])
    qf(roof, [x1 + over, y0, z0], [x1 + over, y1, z0], [xm, y1, z1], [xm, y0, z1], [z1 - z0, 0, x1 - xm])
    if (end) for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) tf(end, [x0, y, z0], [x1, y, z0], [xm, y, z1], [0, s, 0])
  } else {
    const ym = (y0 + y1) / 2
    qf(roof, [x0, y0 - over, z0], [x1, y0 - over, z0], [x1, ym, z1], [x0, ym, z1], [0, -(z1 - z0), ym - y0])
    qf(roof, [x0, y1 + over, z0], [x1, y1 + over, z0], [x1, ym, z1], [x0, ym, z1], [0, z1 - z0, y1 - ym])
    if (end) for (const [x, s] of [[x0, -1], [x1, 1]] as [number, number][]) tf(end, [x, y0, z0], [x, y1, z0], [x, ym, z1], [s, 0, 0])
  }
}
/** A lean-to roof along y from the outer eave (x0, z0) up to the wall (x1, z1). */
function leanTo(roof: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  qf(roof, [x0, y0, z0], [x0, y1, z0], [x1, y1, z1], [x1, y0, z1], [-(z1 - z0) * Math.sign(x1 - x0), 0, Math.abs(x1 - x0)])
}

// ---------------------------------------------------------------- the model

const AX = -28 // the cathedral's axis
const CW0 = -35, CW1 = -21 // the clerestory walls
const AW0 = -38.5, AW1 = -17.5 // the aisle walls
const NY1 = -16, NY0 = -54 // the nave, from the north end to the crossing
const EAVE = 18.7, RIDGE = 24.8, AISLE = 11.2, LEAN = 14.2
const FLOOR = 4.2
const TX0 = -44, TX1 = -12, TY0 = -66, TY1 = -54, TEAVE = 18.4, TRIDGE = 24.4
const QX0 = -34, QX1 = -22, QY0 = -84, CEAVE = 20.0, CRIDGE = 24.7
const TOW0 = -34, TOW1 = -22, TDECK = 40.8, TPAR = 42.2

function build() {
  const stone = new Part(), trim = new Part(), slate = new Part(), win = new Part(), flat = new Part()

  // ---- the nave: aisles, clerestory, roof
  box(stone, null, AW0, NY0, AW1, NY1, 0, AISLE, 0.2)
  box(stone, null, CW0, NY0, CW1, NY1, AISLE, EAVE, 0)
  box(trim, null, CW0 - 0.25, NY0, CW1 + 0.25, NY1, EAVE - 0.45, EAVE, 0.12)
  gableRoof(slate, stone, CW0, NY0, CW1, NY1, EAVE, RIDGE, 'y', 0.5)
  leanTo(slate, AW0 - 0.4, CW0, NY0, NY1, AISLE, LEAN)
  leanTo(slate, AW1 + 0.4, CW1, NY0, NY1, AISLE, LEAN)
  // seven bays: lancets in the aisles, quatrefoil roundels in the clerestory, buttresses between
  const bay = (NY1 - NY0) / 7
  for (const [fa, fc, xa] of [[faceX(AW0, -1), faceX(CW0, -1), AW0], [faceX(AW1, 1), faceX(CW1, 1), AW1]] as [Face, Face, number][]) {
    for (let k = 0; k < 7; k++) {
      const y = NY0 + bay * (k + 0.5)
      flatShape(win, fa, pointed(sOf(fa, y), 1.5, FLOOR + 1.4, FLOOR + 5.4, 4), 0.06)
      flatShape(trim, fc, arc(sOf(fc, y), 16.2, 1.05, 0, 360, 10).slice(0, -1), 0.04)
      flatShape(win, fc, arc(sOf(fc, y), 16.2, 0.75, 0, 360, 10).slice(0, -1), 0.07)
      const yb = NY0 + bay * k
      if (k > 0) {
        const sg = Math.sign(xa - AX)
        box(stone, trim, sg < 0 ? xa - 0.8 : xa, yb - 0.45, sg < 0 ? xa : xa + 0.8, yb + 0.45, 0, AISLE + 0.6, 0.06)
        // the little gablets over the buttresses at the clerestory's foot
        const xc = sg < 0 ? CW0 - 0.3 : CW1 + 0.3
        lathe(trim, xc, yb, [[0.32, LEAN - 0.4], [0.32, LEAN + 0.9], [0.01, LEAN + 2.0]], 4, 45, 405)
      }
    }
  }
  // the north end gable, with a great pointed window, over the narthex link
  {
    const f = faceY(NY1, 1), sc = sOf(f, AX)
    flatShape(trim, f, pointed(sc, 4.6, 10.0, 17.0, 6), 0.03)
    flatShape(win, f, pointed(sc, 3.8, 10.4, 17.0, 6), 0.06)
    extrudeShape(trim, f, [[sOf(f, CW1) - 0.2, EAVE], [sc, RIDGE + 0.4], [sOf(f, CW0) + 0.2, EAVE], [sOf(f, CW0) - 0.6, EAVE], [sc, RIDGE - 0.4], [sOf(f, CW1) + 0.6, EAVE]].map(([s, z]) => [s, z] as XY), 0, 0.3)
  }

  // ---- the east porch: a gabled porch with a big pointed doorway near the north end
  {
    const PX0 = AW1, PX1 = -11.5, PY0 = -36.0, PY1 = -27.5, PE = 9.4, PR = 14.2
    box(stone, null, PX0, PY0, PX1, PY1, 0, PE, 0.2)
    gableRoof(slate, stone, PX0, PY0, PX1, PY1, PE, PR, 'x', 0.35)
    const f = faceX(PX1, 1), sc = sOf(f, (PY0 + PY1) / 2)
    extrudeShape(trim, f, pointedBand(sc, 3.4, 4.6, FLOOR, FLOOR + 3.0, 6), 0, 0.2)
    flatShape(win, f, pointed(sc, 3.4, FLOOR, FLOOR + 3.0, 6), 0.06)
    extrudeShape(trim, f, [[sOf(f, PY0) - 0.15, PE], [sc, PR + 0.3], [sOf(f, PY1) + 0.15, PE], [sOf(f, PY1) - 0.5, PE], [sc, PR - 0.4], [sOf(f, PY0) + 0.5, PE]].map(([s, z]) => [Math.min(s, 99), z] as XY), 0, 0.25)
    for (const y of [PY0, PY1]) lathe(trim, PX1 - 0.1, y, [[0.35, PE - 1.0], [0.35, PE + 0.6], [0.01, PE + 2.2]], 4, 45, 405)
  }

  // ---- the transepts
  box(stone, null, TX0, TY0, TX1, TY1, 0, TEAVE, 0.2)
  box(trim, null, TX0, TY0 - 0.25, TX1, TY1 + 0.25, TEAVE - 0.45, TEAVE, 0.12)
  gableRoof(slate, stone, TX0, TY0, TX1, TY1, TEAVE, TRIDGE, 'x', 0.5)
  for (const f of [faceX(TX0, -1), faceX(TX1, 1)]) {
    const sc = sOf(f, (TY0 + TY1) / 2)
    flatShape(trim, f, pointed(sc, 4.4, 7.0, 15.4, 6), 0.03)
    flatShape(win, f, pointed(sc, 3.6, 7.4, 15.4, 6), 0.06)
    flatShape(win, f, pointed(sc - 3.4, 1.0, 7.0, 10.6, 4), 0.06)
    flatShape(win, f, pointed(sc + 3.4, 1.0, 7.0, 10.6, 4), 0.06)
    extrudeShape(trim, f, [[sc - 6.2, TEAVE], [sc, TRIDGE + 0.4], [sc + 6.2, TEAVE], [sc + 5.6, TEAVE], [sc, TRIDGE - 0.4], [sc - 5.6, TEAVE]], 0, 0.3)
    // angle buttresses at the gable's corners
    for (const s of [sc - 6.0, sc + 6.0]) {
      const y = f.n[0] < 0 ? -s : s, x = f.n[0] < 0 ? TX0 : TX1
      box(stone, trim, x - 0.5, y - 0.5, x + 0.5, y + 0.5, 0, TEAVE + 0.4, 0.08)
    }
  }

  // ---- the chancel with its side chapels and polygonal apse
  const AY = QY0 + 4 // where the straight chancel meets the apse
  box(stone, null, QX0, AY, QX1, TY0, 0, CEAVE, 0.15)
  gableRoof(slate, null, QX0, AY, QX1, TY0, CEAVE, CRIDGE, 'y', 0.45)
  {
    // the apse: a half-octagon, roofed as a half pyramid falling from the ridge
    const r = (QX1 - QX0) / 2
    const pr: XY[] = arc(AX, AY, r, 180, 360, 4)
    prism(stone, null, pr, 0, CEAVE)
    for (let k = 0; k < pr.length - 1; k++) {
      const a: V3 = [pr[k][0], pr[k][1], CEAVE], b: V3 = [pr[k + 1][0], pr[k + 1][1], CEAVE]
      tf(slate, a, b, [AX, AY, CRIDGE], [(a[0] + b[0]) / 2 - AX, (a[1] + b[1]) / 2 - AY, 1])
    }
    // tall lancets in the apse's three outer faces
    for (let k = 1; k < 4; k++) {
      const a = pr[k - 1 + 0], b = pr[k]
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, L = Math.hypot(mx - AX, my - AY)
      const f: Face = { o: [mx, my, 0], n: [(mx - AX) / L, (my - AY) / L] }
      flatShape(win, f, pointed(0, 1.3, 9.0, 16.4, 4), 0.06)
    }
    for (const f of [faceX(QX0, -1), faceX(QX1, 1)]) for (const y of [-70, -75]) flatShape(win, f, pointed(sOf(f, y), 1.4, 11.0, 17.0, 4), 0.06)
  }
  for (const [x0, x1] of [[TX0 + 0.2, QX0], [QX1, -14.0]] as [number, number][]) {
    box(stone, null, x0, -77.0, x1, TY0, 0, 9.0, 0.15)
    box(trim, flat, x0 - 0.15, -77.15, x1 + 0.15, TY0, 8.6, 9.0, 0.1)
    const f = x0 < AX ? faceX(x0, -1) : faceX(x1, 1)
    for (const y of [-69.5, -73.5]) flatShape(win, f, pointed(sOf(f, y), 1.2, 3.4, 6.8, 4), 0.06)
  }

  // ---- the crossing tower
  {
    const x0 = TOW0, x1 = TOW1, y0 = TY0, y1 = TY1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2
    box(stone, null, x0, y0, x1, y1, 0, TDECK, 0.25)
    box(trim, null, x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2, 28.1, 28.6, 0.12) // the belfry's sill course
    box(trim, flat, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, TDECK - 0.5, TDECK, 0.12)
    // the crenellated parapet: merlons along each side
    for (const side of [0, 1, 2, 3]) {
      for (let k = 0; k < 5; k++) {
        const t = -5.2 + k * 2.6
        const [cx, cy, along] = side === 0 ? [xm + t, y0 - 0.1, 'x'] : side === 1 ? [xm + t, y1 + 0.1, 'x'] : side === 2 ? [x0 - 0.1, ym + t, 'y'] : [x1 + 0.1, ym + t, 'y']
        if (along === 'x') box(stone, trim, cx - 0.65, cy - 0.35, cx + 0.65, cy + 0.35, TDECK, TPAR, 0.05)
        else box(stone, trim, cx - 0.35, cy - 0.65, cx + 0.35, cy + 0.65, TDECK, TPAR, 0.05)
      }
    }
    // angle buttresses at the corners, stepping in, rising to small pinnacles
    for (const [cx, cy] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] as [number, number][]) {
      box(stone, trim, cx - 0.9, cy - 0.9, cx + 0.9, cy + 0.9, TRIDGE - 1.0, 34.0, 0.1)
      box(stone, trim, cx - 0.65, cy - 0.65, cx + 0.65, cy + 0.65, 34.0, TPAR + 0.4, 0.08)
      lathe(trim, cx, cy, [[0.5, TPAR + 0.4], [0.01, TPAR + 1.8]], 4, 45, 405)
    }
    // each face: a small lancet on the lower stage, two tall louvred lancets on the belfry
    for (const f of [faceX(x0, -1), faceX(x1, 1), faceY(y0, -1), faceY(y1, 1)]) {
      const sc = f.n[0] !== 0 ? sOf(f, ym) : sOf(f, xm)
      flatShape(win, f, pointed(sc, 1.0, 25.4, 27.0, 4), 0.06)
      for (const d of [-2.5, 2.5]) {
        flatShape(trim, f, pointed(sc + d, 3.0, 28.6, 37.2, 5), 0.03)
        flatShape(win, f, pointed(sc + d, 2.3, 29.0, 37.2, 5), 0.06)
      }
    }
  }

  // ---- the narthex link, the cloister and parish house, the hall, the garden walls (plain)
  const block = (x0: number, y0: number, x1: number, y1: number, top: number, rows: number[] = []) => {
    box(stone, null, x0, y0, x1, y1, 0, top - 0.5, 0.15)
    box(trim, flat, x0 - 0.15, y0 - 0.15, x1 + 0.15, y1 + 0.15, top - 0.5, top, 0.1)
    for (const f of [faceX(x0, -1), faceX(x1, 1), faceY(y0, -1), faceY(y1, 1)]) {
      const along = f.n[0] !== 0 ? [y0, y1] : [x0, x1]
      const a = Math.min(sOf(f, along[0]), sOf(f, along[1])), b = Math.max(sOf(f, along[0]), sOf(f, along[1]))
      if (b - a < 6) continue
      for (const z of rows) flatShape(win, f, R(a + 1.2, z, b - 1.2, z + 1.6), 0.06)
    }
  }
  // around the three courtyards of OSM relation/3591730 (inner ways 267773349, -370, -367), which stay open
  block(CW0, NY1, CW1, -9.5, 8.5, [5.0]) // the narthex link
  block(-15.0, -16.0, 16.5, -11.9, 8.5, [5.0]) // the cloister's south walk
  block(-27.0, -9.5, -15.4, 21.0, 11.4, [5.0, 8.6])
  block(-36.7, -9.5, -34.0, 21.0, 11.4, [])
  block(-34.0, -9.5, -27.0, -3.1, 11.4, [])
  block(-34.0, 7.5, -27.0, 9.5, 11.4, [])
  block(-15.4, -0.6, 7.6, 12.0, 11.4, [4.0, 7.6])
  block(7.6, -11.9, 30.0, 12.0, 11.4, [4.0, 7.6])
  block(7.6, -16.2, 16.5, -11.9, 8.5, [])
  block(-39.0, 21.0, 14.8, 28.3, 12.4, [5.0, 8.6])
  block(14.8, 12.0, 30.6, 28.3, 12.4, [5.0, 8.6])
  // the angled wing to the south-east, as a turned block
  {
    const pts: XY[] = [[25.3, -1.7], [39.9, -13.9], [50.3, -1.8], [35.6, 10.8]]
    prism(stone, null, pts, 0, 13.4)
    prism(trim, flat, chamfer(pts, 0.1), 13.4, 13.9)
    const a = pts[1], b = pts[2], n: XY = [(b[1] - a[1]), -(b[0] - a[0])], L = Math.hypot(n[0], n[1])
    const f: Face = { o: [a[0], a[1], 0], n: [n[0] / L, n[1] / L] }
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (const z of [4.6, 8.6]) flatShape(win, f, R(-len + 1.2, z, -1.2, z + 1.8), 0.06)
  }
  // the hall: gabled east-west, with a cross gable, at its lidar heights
  {
    const HX0 = 14.8, HX1 = 80.0, HY0 = 28.3, HY1 = 44.5, HE = 13.7, HR = 20.8
    box(stone, null, HX0, HY0, HX1, HY1, 0, HE, 0.2)
    gableRoof(slate, stone, HX0, HY0, HX1, HY1, HE, HR, 'x', 0.4)
    const CX0 = 30.6, CX1 = 41.6
    box(stone, null, CX0, 17.5, CX1, 58.6, 0, HE, 0.2)
    gableRoof(slate, stone, CX0, 17.5, CX1, 58.6, HE, HR, 'y', 0.4)
    for (const f of [faceY(HY0, -1), faceY(HY1, 1)]) for (const xs of [[16.5, 29.5], [43, 78]]) {
      const a = Math.min(sOf(f, xs[0]), sOf(f, xs[1])), b = Math.max(sOf(f, xs[0]), sOf(f, xs[1]))
      const n = Math.max(1, Math.round((b - a) / 4.5)), st = (b - a) / n
      for (let k = 0; k < n; k++) flatShape(win, f, R(a + st * k + 0.9, 3.0, a + st * (k + 1) - 0.9, 10.4), 0.06)
    }
    for (const f of [faceY(17.5, -1), faceY(58.6, 1)]) flatShape(win, f, pointed(sOf(f, 36.1), 4.0, 3.0, 12.0, 6), 0.06)
    block(42.0, 44.5, 51.2, 52.0, 9.0, [3.5])
    block(68.6, 44.1, 80.9, 48.1, 9.0, [])
    block(70.5, 24.6, 81.7, 30.6, 9.0, [])
  }
  // the memorial garden's walls on the west, a low stone mass
  prism(stone, trim, [[-71.5, 6.4], [-66.9, 1.3], [-67.4, -3.6], [-58.8, -5.1], [-58.2, 0.3], [-48.4, 7.4], [-37.0, 7.3], [-37.1, 10.4], [-48.4, 10.7], [-56.1, 15.5], [-65.4, 16.6], [-70.9, 13.3]], 0, 2.0)

  const lit = (p: V3, n: V3) => (n[2] > 0.6 ? 0.1 : p[0] > TOW0 - 2 && p[0] < TOW1 + 2 && p[1] > TY0 - 2 && p[1] < TY1 + 2 && p[2] > 24 ? 0.95 : p[0] < 0 && p[1] < -10 ? 0.35 : 0)
  return finishGlb('Cathedral of St. Philip', [
    { part: stone, material: { ...finish('stp-sandstone', 0xd3bd97), floodlight: lit } as Swatch },
    { part: trim, material: { ...finish('stp-limestone', 0xece2cf), floodlight: lit } as Swatch },
    { part: slate, material: finish('stp-slate', 0x7c8288) },
    { part: flat, material: finish('stp-flat-roof', 0xc9cbc8) },
    { part: win, material: PALETTE.window },
  ], { bearing: 0, height: TPAR + 1.8, replaces: ['way/267773373', 'relation/3591730'] }, 6500)
}

if (import.meta.main) await writeModel('atl-cathedral-st-philip', build())
