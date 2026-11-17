/**
 * Ponce City Market (1926 Sears, Roebuck and Co. building, enlarged to 1929;
 * City Hall East 1990-2011; Ponce City Market since 2014), Atlanta:
 * procedural, CC0-1.0.
 * bun generators/atl-ponce-city-market.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 4 (the
 * building's walls run 4 degrees east of north). Origin: the area centroid
 * of OSM way/184803195 (-84.3656225, 33.7725504). The north front faces
 * Ponce de Leon Avenue; the east side faces the Eastside BeltLine.
 * y = 0 is the lowest ground under the footprint, on the BeltLine side
 * (lidar ground 270.0 m; Mapterhorn 270.1 m). Ponce de Leon Avenue is 2 to
 * 4 m higher, the west car park about 5 m higher.
 *
 * Form: a huge nine-storey red-brick warehouse, an L of blocks around a
 * west courtyard: the Ponce front (x -106..65, roof 42.7), the west wing
 * (40.0) and the long east block (39.7) with a lower strip along the
 * BeltLine (32.5). Brick piers divide every face into 6 m bays of broad
 * steel windows over cream concrete sills; shopfronts below. In the middle
 * of the Ponce front the clock-and-flag tower: a brick shaft rising above
 * the roof, a cream frieze, a belfry stage with two tall arched windows on
 * each face, a heavy white cornice and a green copper hipped roof. Beside
 * it on the street front hangs the red "PONCE" blade sign. On the roof over
 * the courtyard the "PONCE CITY MARKET" sign: red neon letters on a steel
 * frame, facing south. Stair and lift towers stand above the roof; the
 * raised deck east of the tower is the rooftop amusement park (Skyline
 * Park), drawn as its deck only.
 *
 * Lettering (STYLE.md "Famous signs"): the rooftop sign is the landmark's
 * signature, so it carries its letters, traced from Williamcasey's photo:
 * a tall condensed sans-serif in red-orange neon, each letter about 0.5 of
 * its height wide, built with lettering.ts. The blade sign's PONCE uses the
 * same letters, stacked.
 *
 * Sources
 * - OSM way/184803195 (outline, building=industrial, height 50, 10 levels;
 *   name Ponce City Market) and way/335151383 (building:part, the tower,
 *   min_height 70, height 14 - the tower's top; the model uses the lidar).
 * - USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 1 m grid, heights
 *   above y = 0: the Ponce front's roof 42.7, the west wing 40.0, the east
 *   block 39.7, the BeltLine strip 32.5; the tower x -5..11, y 51..69,
 *   cornice 65.5, roof peak 70.5; the rooftop sign along y 28, x -52..-16,
 *   letter tops 52.6 on a frame whose deck is about 47.2; the lift tower
 *   south of the sign 54.0; the raised deck 48.0 (all measured).
 * - USGS NAIP (public domain): plan, roofs.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Williamcasey, "Ponce City Market large neon sign Midtown, Atlanta,
 *     GA.jpg", CC BY-SA 4.0 (the rooftop sign's letters and frame, the
 *     courtyard face);
 *   Marc Merlin, "Ponce City Market viewed from Green's Liquor Store on
 *     Ponce.jpg", CC BY-SA 4.0 (the tower, the blade sign, the Ponce front);
 *   JJonahJackalope, "Ponce City Market, ATL.jpg" and "Ponce City Market,
 *     Atlanta.jpg", CC BY-SA 4.0 (the west and north fronts, bays, colour);
 *   Thomson M, "Ponce City Market - panoramio.jpg", CC BY 3.0 (from the
 *     north, the sign from behind);
 *   Tyler Lahti, "Ponce City Market from Historic Fourth Ward Park.jpg",
 *     CC BY-SA 2.0 (aerial from the south-west at dusk, the lit sign);
 *   Keizers, "Ponce City Market 1.JPG", CC BY-SA 3.0 (the tower, the
 *     north front);
 *   James Willamor, "Ponce city market from afar.jpg", CC BY-SA 2.0.
 * Published: 2.1 million sq ft, built 1926 (Wikipedia).
 * Estimated from photos: storey heights (nine storeys at about 4.15 m over
 *   a 6.5 m shopfront storey), the bay width (6.1 m), the tower's stages,
 *   the blade sign's size and height, the letters' shapes and spacing.
 * Doubts: the courtyard faces are hidden behind the lower market building
 *   (not part of this outline); they are drawn like the other faces. Roof
 *   clutter (mechanical units, Skyline Park's rides) is left out; the
 *   tower's flagpole and railing are left out as too thin.
 * Colour: deep red-brown brick from the daylight photos, pulled to the
 *   palette's lightness; cream concrete sills and the tower's white stone;
 *   green copper; red-orange neon.
 * Night: both signs glow red (`neon-pcm-red`); windows glow; the tower is
 *   floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { Pen, strokes, type Pt } from './lettering'
import { type XY, type Face, prism, rect, chamfer, flatShape, extrudeShape, lathe, arc, archShape, finishGlb, writeModel } from './sea-tacoma-union-station'

// ---------------------------------------------------------------- helpers

function qf(part: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) part.quad(a, b, c, d)
  else part.quad(d, c, b, a)
}
function box(wall: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bevel = 0.3) {
  prism(wall, top, bevel > 0 ? chamfer(rect(x0, y0, x1, y1), bevel) : rect(x0, y0, x1, y1), z0, z1)
}
const faceX = (x: number, sgn: 1 | -1): Face => ({ o: [x, 0, 0], n: [sgn, 0] })
const faceY = (y: number, sgn: 1 | -1): Face => ({ o: [0, y, 0], n: [0, sgn] })
const sOf = (f: Face, w: number) => (f.n[0] !== 0 ? (f.n[0] > 0 ? w : -w) : f.n[1] > 0 ? -w : w)
const R = (s0: number, z0: number, s1: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
/** A pier standing `d` proud of face f between s0 and s1: front and two sides only (its top is hidden by the coping). */
function pier(part: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d: number) {
  const P = (s: number, z: number, dd: number): V3 => {
    const t: XY = [-f.n[1], f.n[0]]
    return [f.o[0] + t[0] * s + f.n[0] * dd, f.o[1] + t[1] * s + f.n[1] * dd, z]
  }
  const out: V3 = [f.n[0], f.n[1], 0], tt: V3 = [-f.n[1], f.n[0], 0]
  qf(part, P(s0, z0, d), P(s1, z0, d), P(s1, z1, d), P(s0, z1, d), out)
  qf(part, P(s1, z0, 0), P(s1, z0, d), P(s1, z1, d), P(s1, z1, 0), tt)
  qf(part, P(s0, z0, 0), P(s0, z0, d), P(s0, z1, d), P(s0, z1, 0), [-tt[0], -tt[1], 0])
  qf(part, P(s0, z1, 0), P(s1, z1, 0), P(s1, z1, d), P(s0, z1, d), [0, 0, 1])
}

// ---------------------------------------------------------------- the letters

/** The sign's letters, centre-lines in units of the cap height; returns the advance. */
function glyph(pen: Pen, ch: string, u: number): number {
  const W = 0.42 // a normal letter's centre-line width
  const p = (x: number, y: number): Pt => [u + x, y]
  switch (ch) {
    case 'P':
      pen.moveTo(p(0, 0)).lineTo(p(0, 1)).lineTo(p(0.24, 1)).cubicTo(p(0.47, 1), p(0.47, 0.5), p(0.24, 0.5), 6).lineTo(p(0, 0.5))
      return W + 0.12
    case 'R':
      pen.moveTo(p(0, 0)).lineTo(p(0, 1)).lineTo(p(0.24, 1)).cubicTo(p(0.47, 1), p(0.47, 0.52), p(0.24, 0.52), 6).lineTo(p(0, 0.52))
      pen.moveTo(p(0.2, 0.52)).lineTo(p(0.42, 0))
      return W + 0.12
    case 'O':
      pen.moveTo(p(0.21, 1)).cubicTo(p(0.46, 1), p(0.42, 0.78), p(0.42, 0.5), 4).cubicTo(p(0.42, 0.22), p(0.46, 0), p(0.21, 0), 4)
        .cubicTo(p(-0.04, 0), p(0, 0.22), p(0, 0.5), 4).cubicTo(p(0, 0.78), p(-0.04, 1), p(0.21, 1), 4)
      return W + 0.12
    case 'C':
      pen.moveTo(p(0.42, 0.8)).cubicTo(p(0.4, 1.02), p(0.02, 1.04), p(0, 0.7), 5).lineTo(p(0, 0.3)).cubicTo(p(0.02, -0.04), p(0.4, -0.02), p(0.42, 0.2), 5)
      return W + 0.12
    case 'N':
      pen.moveTo(p(0, 0)).lineTo(p(0, 1)).moveTo(p(0.42, 0)).lineTo(p(0.42, 1)).moveTo(p(0.02, 0.96)).lineTo(p(0.4, 0.04))
      return W + 0.14
    case 'E':
      pen.moveTo(p(0.4, 1)).lineTo(p(0, 1)).lineTo(p(0, 0)).lineTo(p(0.4, 0))
      pen.moveTo(p(0, 0.52)).lineTo(p(0.32, 0.52))
      return W + 0.08
    case 'I':
      pen.moveTo(p(0.05, 0)).lineTo(p(0.05, 1))
      return 0.24
    case 'T':
      pen.moveTo(p(-0.02, 1)).lineTo(p(0.46, 1)).moveTo(p(0.22, 1)).lineTo(p(0.22, 0))
      return W + 0.1
    case 'Y':
      pen.moveTo(p(-0.02, 1)).lineTo(p(0.22, 0.46)).moveTo(p(0.46, 1)).lineTo(p(0.22, 0.46)).moveTo(p(0.22, 0.5)).lineTo(p(0.22, 0))
      return W + 0.1
    case 'M':
      pen.moveTo(p(0, 0)).lineTo(p(0, 1)).moveTo(p(0.56, 0)).lineTo(p(0.56, 1)).moveTo(p(0.02, 0.96)).lineTo(p(0.28, 0.3)).moveTo(p(0.54, 0.96)).lineTo(p(0.28, 0.3))
      return 0.56 + 0.15
    case 'A':
      pen.moveTo(p(0, 0)).lineTo(p(0.23, 0.98)).moveTo(p(0.46, 0)).lineTo(p(0.23, 0.98)).moveTo(p(0.08, 0.33)).lineTo(p(0.38, 0.33))
      return W + 0.14
    case 'K':
      pen.moveTo(p(0, 0)).lineTo(p(0, 1)).moveTo(p(0.42, 1)).lineTo(p(0.02, 0.42)).moveTo(p(0.14, 0.58)).lineTo(p(0.44, 0))
      return W + 0.12
    case ' ':
      return 0.26
  }
  throw new Error(`no glyph ${ch}`)
}
function word(text: string): { pen: Pen; width: number } {
  const pen = new Pen()
  let u = 0
  for (const ch of text) u += glyph(pen, ch, u)
  return { pen, width: u - 0.12 }
}

// ---------------------------------------------------------------- the model

const BAY = 6.1
const SHOP: [number, number] = [0.8, 5.4]
// two storeys a panel over the 6.5 m shopfront storey (storeys of 4.15 m), brick spandrels between
const GROUPS: [number, number][] = [[7.25, 14.2], [15.55, 22.5], [23.85, 30.8], [32.15, 38.5]]

function build() {
  const brick = new Part(), cream = new Part(), win = new Part(), roof = new Part(), copper = new Part(), neon = new Part()

  // ---- the blocks
  const block = (x0: number, y0: number, x1: number, y1: number, top: number) => {
    box(brick, null, x0, y0, x1, y1, 0, top - 0.5, 0.3)
    box(cream, roof, x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2, top - 0.5, top, 0.2)
  }
  const NORTH = 42.7, WEST = 40.0, EAST = 39.7, STRIP = 32.5
  block(-105.9, 23.0, 65.0, 65.6, NORTH)
  block(-105.9, -30.7, -70.2, 23.0, WEST)
  block(4.1, -99.0, 65.0, 23.0, EAST)
  block(65.0, -87.5, 74.8, 4.0, STRIP)

  // ---- the faces: piers every bay, grouped window panels with cream sills, shopfronts
  const face = (f: Face, a: number, b: number, top: number, opts: { shop?: boolean; skip?: [number, number][] } = {}) => {
    const s0 = Math.min(sOf(f, a), sOf(f, b)), s1 = Math.max(sOf(f, a), sOf(f, b))
    const n = Math.max(1, Math.round((s1 - s0) / BAY)), st = (s1 - s0) / n
    for (let k = 0; k <= n; k++) {
      const s = s0 + st * k
      const w = k === 0 || k === n ? 2.0 : 1.9
      const ps = k === 0 ? s : k === n ? s - w : s - w / 2
      pier(brick, f, ps, ps + w, 0, top - 0.5, 0.4)
    }
    // the window bands run behind the piers, so each bay shows one broad panel between them;
    // split around any skipped stretch (the tower)
    const runs: [number, number][] = []
    let from = s0 + 0.8
    for (const [p, q] of (opts.skip ?? []).sort((m, n) => m[0] - n[0])) { runs.push([from, p]); from = q }
    runs.push([from, s1 - 0.8])
    for (const [r0, r1] of runs) {
      if (r1 - r0 < 1) continue
      for (const [z0, z1] of GROUPS) {
        if (z1 > top - 1.2) continue
        flatShape(cream, f, R(r0, z0 - 0.5, r1, z0 - 0.05), 0.05)
        flatShape(win, f, R(r0, z0, r1, z1), 0.05)
      }
      if (opts.shop !== false) flatShape(win, f, R(r0, SHOP[0], r1, SHOP[1]), 0.05)
    }
  }
  // the Ponce front, its tower bays left to the tower
  const fN = faceY(65.6, 1)
  face(fN, -105.9, 65.0, NORTH, { skip: [[sOf(fN, 11.7) - 0.2, sOf(fN, -5.4) + 0.2]] })
  face(faceX(-105.9, -1), -30.7, 65.6, WEST)
  face(faceY(-30.7, -1), -105.9, -70.2, WEST)
  face(faceX(-70.2, 1), -30.7, 23.0, WEST, { shop: false })
  face(faceY(23.0, -1), -70.2, 4.1, NORTH, { shop: false })
  face(faceX(4.1, -1), -99.0, 23.0, EAST)
  face(faceY(-99.0, -1), 4.1, 65.0, EAST)
  face(faceX(65.0, 1), 4.0, 23.0, EAST)
  face(faceX(65.0, 1), 23.0, 65.6, NORTH)
  face(faceX(74.8, 1), -87.5, 4.0, STRIP)
  face(faceY(-87.5, -1), 65.0, 74.8, STRIP)
  face(faceY(4.0, 1), 65.0, 74.8, STRIP, { shop: false })
  // the east block's upper storeys above the strip
  {
    const f = faceX(65.0, 1), s0 = sOf(f, -87.5), s1 = sOf(f, 4.0), n = Math.round((s1 - s0) / BAY), st = (s1 - s0) / n
    for (let k = 1; k < n; k++) pier(brick, f, s0 + st * k - 0.95, s0 + st * k + 0.95, STRIP, EAST - 0.5, 0.4)
    flatShape(win, f, R(s0 + 0.8, 33.4, s1 - 0.8, 38.5), 0.05)
  }

  // ---- roof structures: stair and lift towers, the Skyline Park deck, the west penthouse
  const head = (x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) => {
    box(brick, null, x0, y0, x1, y1, z0, z1 - 0.4, 0.15)
    box(cream, roof, x0 - 0.15, y0 - 0.15, x1 + 0.15, y1 + 0.15, z1 - 0.4, z1, 0.1)
  }
  head(-6.0, 18.6, 4.0, 28.0, NORTH - 2, 54.0) // the lift tower beside the sign, on the courtyard face
  {
    const f = faceY(18.6, -1)
    for (const z of [44.4, 48.6]) flatShape(win, f, R(sOf(f, -1.0) - 1.2, z, sOf(f, -1.0) + 1.2, z + 2.6), 0.06)
  }
  head(17.0, 21.0, 22.0, 28.0, NORTH - 2, 51.0)
  head(-2.0, 30.0, 16.0, 50.5, NORTH - 1, 48.0) // the raised deck (Skyline Park)
  head(-82.0, 30.0, -58.0, 50.0, NORTH - 1, 47.0)
  head(4.5, -50.0, 10.0, -35.0, EAST - 1, 46.5)
  head(55.0, -56.0, 62.0, -45.0, EAST - 1, 46.0)

  // ---- the tower
  {
    const X0 = -5.4, X1 = 11.7, Y0 = 50.8, Y1 = 69.2, xm = (X0 + X1) / 2, ym = (Y0 + Y1) / 2
    const SHAFT = 53.0, FRIEZE = 54.4, BEL = 62.4, CORN = 65.5, PEAK = 70.5
    box(brick, null, X0, Y0, X1, Y1, 0, SHAFT, 0.35)
    box(cream, null, X0 - 0.35, Y0 - 0.35, X1 + 0.35, Y1 + 0.35, SHAFT, FRIEZE, 0.25) // the frieze
    box(brick, null, X0 + 0.2, Y0 + 0.2, X1 - 0.2, Y1 - 0.2, FRIEZE, BEL, 0.3)
    box(cream, null, X0 - 0.3, Y0 - 0.3, X1 + 0.3, Y1 + 0.3, BEL, CORN - 1.2, 0.2) // the entablature
    box(cream, null, X0 - 1.1, Y0 - 1.1, X1 + 1.1, Y1 + 1.1, CORN - 1.2, CORN, 0.4) // the cornice
    // the copper hipped roof
    const o: V3[] = [[X0 - 0.8, Y0 - 0.8, CORN], [X1 + 0.8, Y0 - 0.8, CORN], [X1 + 0.8, Y1 + 0.8, CORN], [X0 - 0.8, Y1 + 0.8, CORN]]
    const i: V3[] = [[xm - 1.6, ym - 1.6, PEAK - 0.6], [xm + 1.6, ym - 1.6, PEAK - 0.6], [xm + 1.6, ym + 1.6, PEAK - 0.6], [xm - 1.6, ym + 1.6, PEAK - 0.6]]
    const out: V3[] = [[0, -1, 1], [1, 0, 1], [0, 1, 1], [-1, 0, 1]]
    for (let k = 0; k < 4; k++) qf(copper, o[k], o[(k + 1) % 4], i[(k + 1) % 4], i[k], out[k])
    copper.cap(i, true)
    box(cream, null, xm - 1.4, ym - 1.4, xm + 1.4, ym + 1.4, PEAK - 0.6, PEAK, 0.1) // the lookout platform
    // each face: two tall arched windows on the belfry with white surrounds; paired windows on the shaft above the roof
    for (const f of [faceX(X0 + 0.2, -1), faceX(X1 - 0.2, 1), faceY(Y0 + 0.2, -1), faceY(Y1 - 0.2, 1)]) {
      const sc = f.n[0] !== 0 ? sOf(f, ym) : sOf(f, xm)
      for (const d of [-3.4, 3.4]) {
        extrudeShape(cream, f, [[sc + d - 1.9, FRIEZE + 0.8], [sc + d + 1.9, FRIEZE + 0.8], ...arc(sc + d, BEL - 2.9, 1.9, 0, 180, 8).slice(1, -1).map(([s, z]) => [s, z] as XY), [sc + d - 1.9, BEL - 2.9]] as XY[], 0, 0.2)
        flatShape(win, f, archShape(sc + d, 2.6, FRIEZE + 1.2, BEL - 2.9, 8), 0.26)
        // the little balcony under each
        extrudeShape(cream, f, R(sc + d - 1.7, FRIEZE + 0.6, sc + d + 1.7, FRIEZE + 1.5), 0.2, 0.9)
      }
    }
    for (const f of [faceX(X0, -1), faceX(X1, 1), faceY(Y0, -1), faceY(Y1, 1)]) {
      const sc = f.n[0] !== 0 ? sOf(f, ym) : sOf(f, xm)
      for (const d of [-3.4, 3.4]) {
        flatShape(win, f, R(sc + d - 1.3, NORTH + 1.0, sc + d + 1.3, NORTH + 4.0), 0.06)
        flatShape(win, f, R(sc + d - 1.3, NORTH + 5.6, sc + d + 1.3, NORTH + 8.6), 0.06)
      }
    }
    // the north face below the roof: paired windows up the shaft, the arched entrance at its foot
    {
      const f = faceY(Y1, 1), sc = sOf(f, xm)
      for (const [z0, z1] of GROUPS) for (const d of [-3.4, 3.4]) flatShape(win, f, R(sc + d - 1.4, z0, sc + d + 1.4, z1), 0.06)
      extrudeShape(cream, f, R(sc - 6.6, 0, sc + 6.6, 9.6), 0, 0.25)
      for (const d of [-2.6, 2.6]) flatShape(win, f, archShape(sc + d, 3.2, 0.4, 6.4, 8), 0.31)
    }
  }

  // ---- the PONCE blade sign on the street front, west of the tower, with its clock box below
  {
    const bx = -9.4, by0 = 65.6, by1 = 69.2, z0 = 15.0, z1 = 34.0, t = 1.1
    box(neon, null, bx - t / 2, by0, bx + t / 2, by1, z0, z1, 0.08)
    box(roof, null, bx - 0.6, by0 + 0.2, bx + 0.6, by1 + 0.6, z0 - 3.4, z0 - 0.2, 0.08) // the CITY MARKET panel and clock
    // the letters stacked down both faces, in the panel's cream
    const H = 3.0, letters = 'PONCE'
    for (const side of [-1, 1] as const) {
      letters.split('').forEach((ch, k) => {
        const pen = new Pen()
        const adv = glyph(pen, ch, 0) - 0.12
        const cz = z1 - 2.0 - k * 3.75, cy = (by0 + by1) / 2
        const place = (u: number, v: number, w: number): V3 => [bx + side * (t / 2 + w), cy + side * (-(u - adv / 2) * H * 0.95), cz + (v - 0.5) * H]
        strokes(cream, pen.paths, { width: 0.22, depth: 0.12 / H, place })
      })
    }
  }

  // ---- the PONCE CITY MARKET sign: steel frame on the Ponce block's roof, letters along its south edge
  {
    const H = 4.9, YS = 28.0, Z0 = 47.6, DECK = 47.2
    const { pen, width } = word('PONCE CITY MARKET')
    const X0 = -34.0 - (width * H) / 2
    const XA = X0 - 0.6, XB = X0 + width * H + 0.6
    // the frame: a deck on chunky posts, a back rail, braces drawn as solid panels
    box(roof, roof, XA, YS - 0.2, XB, YS + 9.0, DECK - 0.5, DECK, 0.1)
    for (let k = 0; k <= 6; k++) {
      const x = XA + ((XB - XA) * k) / 6
      for (const y of [YS + 0.3, YS + 8.5]) box(roof, null, x - 0.3, y - 0.3, x + 0.3, y + 0.3, NORTH, DECK - 0.5, 0)
    }
    for (let k = 0; k <= 12; k++) {
      const x = XA + ((XB - XA) * k) / 12
      box(roof, null, x - 0.18, YS + 0.6, x + 0.18, YS + 1.0, DECK, Z0 + H * 0.82, 0)
    }
    box(roof, null, XA, YS + 0.6, XB, YS + 1.0, Z0 + H * 0.45, Z0 + H * 0.55, 0)
    const place = (u: number, v: number, w: number): V3 => [X0 + u * H, YS - w * H, Z0 + v * H]
    strokes(neon, pen.paths, { width: 0.19, depth: 0.45 / H, place, back: true })
  }

  if (process.env.B10_DEBUG) console.log({ brick: brick.triangles, cream: cream.triangles, win: win.triangles, roof: roof.triangles, copper: copper.triangles, neon: neon.triangles })
  const lit = (p: V3, n: V3) => (n[2] > 0.6 ? 0.05 : p[0] > -6 && p[0] < 12.5 && p[1] > 50 && p[2] > 42 ? 0.95 : 0)
  return finishGlb('Ponce City Market', [
    { part: brick, material: { ...finish('pcm-brick', 0xab5a47), floodlight: lit } as Swatch },
    { part: cream, material: { ...finish('pcm-cream', 0xf1e8d6), floodlight: lit } as Swatch },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: copper, material: { ...PALETTE.copper, floodlight: lit } as Swatch },
    { part: neon, material: finish('neon-pcm-red', 0xe2553a) },
  ], { bearing: 4, height: 70.5, replaces: ['way/184803195', 'way/335151383'] }, 6500)
}

if (import.meta.main) await writeModel('atl-ponce-city-market', build())
