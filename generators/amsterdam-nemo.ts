/**
 * NEMO Science Museum (Renzo Piano Building Workshop, 1997), Oosterdok,
 * Amsterdam: original procedural geometry, CC0-1.0.
 * bun generators/amsterdam-nemo.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/57856769,
 * 52.374196, 4.912322. The building's long sides run at 3 degrees, so the
 * catalog bearing is 3 and the hull lies along y: the rounded prow at +y
 * (north-north-east, over the IJ tunnel's approach and the Oosterdok), the
 * low end at -y over the tunnel mouth.
 *
 * Identity, in order: the green copper hull, its walls flaring outward as
 * they rise, the prow rearing up to 32.6 m and leaning far out over the
 * recessed glazed ground floor; the top edge falling from the prow in two
 * pieces, with a dark slot between them; the broad stepped roof plaza
 * ("the beach"), a public stair climbing the roof from the south end up to
 * the top landing with its white-roofed glass pavilion; the red brick
 * ventilation tower at the south end over the tunnel mouth.
 *
 * Evidence:
 *  - plan: OSM outline way/57856769 (tagged 32.57 m, skillion falling
 *    south, roof height 18 m) and its parts, read in the turned frame:
 *    north hull 1390692765 (30.57 m) with its rim 1390692764 (32.57 m),
 *    y 17..58.6; the stepped roof 1390692772 (21.7 m, skillion, beige),
 *    y -56..17; side parapets 1390692768 and 1390692771 (23.7-23.8 m); the
 *    pavilion 1390692763 (26.5 m, white roof), x -14..11.8, y 5..20.8; the
 *    east block 1390692766 (21.4); the brick tower 1390692769 (22.4 m);
 *    the south end wall 1390692770 (13.5 m). The two notches in the
 *    outline at y 12..17 are the slot between the two hull pieces.
 *  - heights: the OSM tags (BAG-derived, 2022) for the prow (32.6 m), the
 *    top landing (21.4-21.7 m), the pavilion (26.5) and the south end
 *    (13.5); the profile of the top edge between them read from
 *    Gamekeeper's level photo from the east (the first piece falls from the
 *    prow to about 22.6 m, the second from about 21 m to 11-13 m), and from
 *    Ank Kumar's from the north-east.
 *  - the flare and the prow's lean (about 12 m at the prow, 2.5-3 m on the
 *    sides) are estimated from the same photos: the outline is taken as the
 *    top of the hull and the ground floor sits inside it.
 *  - the steps: ten broad steps of about 0.94 m from the landing down to
 *    12 m at the south end (photo-estimated; the real stair has many more,
 *    smaller steps between broad terraces), Elekes Andor's photo of the
 *    roof and Txllxt TxllxT's views over the roof terrace.
 *  - colours: the hull's mint-green patinated copper from the daylight
 *    photos, pulled to the palette (0x6aa690); the steps light beige-grey
 *    stone and timber; the pavilion's white roof; the tower's red brick.
 *  - night (Ank Kumar's dusk photo): the ground-floor glazing and the small
 *    hull windows are lit; the copper is not floodlit. Ground floor and
 *    pavilion are `window`.
 *  - elevation 0 (Oosterdok quay, about 0-1 m NAP). The IJ tunnel's road
 *    runs under the south end; the hull there stands over the open portal,
 *    so the model has no ground floor south of y = -25. No lidar.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - NEMO_(Amsterdam).jpg (Gamekeeper at Dutch Wikipedia, public domain):
 *    level, from the east over the Oosterdok; the main ruler.
 *  - 2018_-_NEMO_Science_Museum,_Amsterdam,_Netherlands_(_Ank_Kumar_)_03.
 *    jpg (Ank Kumar, CC BY-SA 4.0): from the north-east at dusk.
 *  - Nemo_Science_Museum.jpg (Elekes Andor, CC BY-SA 4.0): the stepped
 *    roof and the pavilion.
 *  - Amsterdam_-_Oosterdok_-_NEMO_Science_Centre_1997_by_Renzo_Piano_-_
 *    View_North_on_IJtunnel_&_NEMO.jpg (Txllxt TxllxT, CC BY-SA 4.0): the
 *    south end over the tunnel mouth, the brick tower, the stairs.
 *  - Amsterdam_-_Oosterdok_-_NEMO_Science_Centre_1997_by_Renzo_Piano_-_
 *    View_NNE.jpg (Txllxt TxllxT, CC BY-SA 4.0): the recessed ground floor
 *    under the hull.
 * No commercial imagery. No look-only sources.
 *
 * Left out: the copper panel joints, the hull's small window clusters
 * (too small to read; their night glow is not modelled), the NEMO letters,
 * the roof's play objects, railings, planters and the water cascade.
 *
 * Doubts: the flare and the prow's lean are photo estimates; the hull's
 * sides are drawn as straight lofts between three rings rather than the
 * real curved surface. The roof of the north hull behind the pavilion is
 * not seen in any open photo and is drawn as a plain grey skillion. The
 * step count is simplified.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, rect, save, walls, type XY } from './chi-aon-center'
import { face } from './phl-independence-hall'
import { bprism, ccw, prism } from './amsterdam-adam-toren'

/** Drop vertices closer than d to the previous kept one. */
function simplify(r: XY[], d = 0.9): XY[] {
  const out: XY[] = []
  for (const p of r) if (!out.length || Math.hypot(p[0] - out[out.length - 1][0], p[1] - out[out.length - 1][1]) >= d) out.push(p)
  if (out.length > 2 && Math.hypot(out[0][0] - out[out.length - 1][0], out[0][1] - out[out.length - 1][1]) < d) out.pop()
  return out
}

/** Clip a ring to y >= y0 (keep = 1) or y <= y0 (keep = -1). */
function clipY(r: XY[], y0: number, keep: 1 | -1): XY[] {
  const inside = (p: XY) => (p[1] - y0) * keep >= 0
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (inside(a)) out.push(a)
    if (inside(a) !== inside(b)) {
      const t = (y0 - a[1]) / (b[1] - a[1])
      out.push([a[0] + t * (b[0] - a[0]), y0])
    }
  }
  return out
}

/** The x-range of a ring along the line y. */
function spanAt(r: XY[], y: number): [number, number] | null {
  const xs: number[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if ((a[1] - y) * (b[1] - y) < 0 || (a[1] === y && b[1] !== y)) xs.push(a[0] + (y - a[1]) / (b[1] - a[1]) * (b[0] - a[0]))
  }
  if (xs.length < 2) return null
  return [Math.min(...xs), Math.max(...xs)]
}

const OUTLINE: XY[] = [[20.5, 13.4], [20.8, -7.3], [20.8, -25.8], [20.6, -56.8], [18.0, -56.2], [15.0, -55.5], [-6.6, -50.0], [-10.6, -49.0], [-21.2, -46.3], [-20.8, -43.1], [-20.1, -36.3], [-19.7, -27.9], [-19.5, -20.4], [-19.5, -16.6], [-19.7, -8.6], [-20.0, -2.4], [-21.0, 12.0], [-17.2, 12.2], [-17.5, 17.1], [-22.5, 16.8], [-22.7, 19.4], [-22.9, 22.9], [-22.8, 25.4], [-22.6, 28.0], [-22.3, 30.6], [-22.0, 32.3], [-21.2, 35.7], [-20.2, 39.0], [-19.2, 41.4], [-18.0, 44.1], [-16.5, 46.9], [-14.7, 49.7], [-13.3, 51.8], [-11.1, 54.4], [-9.0, 56.4], [-6.9, 57.6], [-4.9, 58.3], [-3.1, 58.6], [-1.4, 58.6], [0.3, 58.4], [2.0, 58.0], [3.6, 57.3], [5.4, 56.2], [7.2, 54.6], [9.3, 52.7], [10.5, 51.2], [11.9, 49.5], [13.1, 47.7], [14.3, 45.8], [15.3, 43.9], [16.2, 41.8], [16.9, 39.8], [17.5, 37.7], [18.1, 34.8], [20.4, 17.6], [15.5, 17.1], [16.1, 13.0]]

const SPLIT = 15 // between the north hull and the stepped roof
const TIP = 58.6
/** The hull's top edge. */
const topZ = (y: number) => (y >= SPLIT ? 22.6 + 10.0 * Math.pow(Math.max(0, y - SPLIT) / (TIP - SPLIT), 0.85) : 13.0 + ((y + 56) / (SPLIT + 56)) * 8.4)
/** The north hull's roof, a skillion inside the rim. */
const roofN = (y: number) => 21.4 + ((y - SPLIT) / (TIP - SPLIT)) * 7.8
const LAND = 5, NSTEP = 10, STEP_D = 5.9, STEP_H = 0.94, Z_LAND = 21.4
/** The stepped plaza's level at y. */
const plaza = (y: number) => (y >= LAND ? Z_LAND : Z_LAND - STEP_H * Math.min(NSTEP, Math.ceil((LAND - y) / STEP_D)))
/** Where the hull's foot is: the top outline drawn in and the prow pulled back. */
const foot = ([x, y]: XY, k = 1): XY => [x * (1 - 0.14 * k), y >= 28 ? 28 + (y - 28) * (1 - 0.4 * k) : y]
const Z0 = 4.5 // underside of the hull over the ground floor

function build() {
  const hull = new Part(), deck = new Part(), win = new Part(), white = new Part(), roof = new Part(), brick = new Part()
  const top = ccw(simplify(OUTLINE))

  // --- The hull: lofted from its foot at 4.5 m, through a mid ring, to the
  // top outline at the top edge's height. Flares more toward the top.
  const n = top.length
  const ringAt = (k: number, zf: (p: XY) => number): V3[] => top.map((p) => { const q = foot(p, k); return [q[0], q[1], zf(p)] as V3 })
  const R0 = ringAt(1, () => Z0)
  const R1 = ringAt(0.42, (p) => Z0 + 0.5 * (topZ(p[1]) - Z0))
  const R2 = ringAt(0, (p) => topZ(p[1]))
  for (const [A, B] of [[R0, R1], [R1, R2]]) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    hull.quad(A[i], A[j], B[j], B[i])
  }
  cap(hull, R0.map((p) => [p[0], p[1]] as XY), Z0, false)

  // --- The rim: a 0.8 m lip, then the inner walls down to the roofs.
  const inner = inset(top, 0.8)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const zi = topZ(top[i][1]), zj = topZ(top[j][1])
    hull.quad([top[i][0], top[i][1], zi], [top[j][0], top[j][1], zj], [inner[j][0], inner[j][1], zj], [inner[i][0], inner[i][1], zi])
    const fi = inner[i][1] >= SPLIT ? roofN(inner[i][1]) - 0.3 : plaza(inner[i][1]) - 1.2
    const fj = inner[j][1] >= SPLIT ? roofN(inner[j][1]) - 0.3 : plaza(inner[j][1]) - 1.2
    // facing inward: wind the other way round
    hull.quad([inner[j][0], inner[j][1], fj], [inner[i][0], inner[i][1], fi], [inner[i][0], inner[i][1], zi], [inner[j][0], inner[j][1], zj])
  }

  // --- North hull roof: a grey skillion falling to the landing.
  {
    const r = clipY(inner, SPLIT, 1)
    const tris = r
    const tmp = new Part()
    cap(tmp, tris, 0)
    for (let i = 0; i < tmp.pos.length; i += 9) {
      const pts: V3[] = [0, 1, 2].map((k) => { const x = tmp.pos[i + 3 * k], y = -tmp.pos[i + 3 * k + 2]; return [x, y, roofN(y)] as V3 })
      face(roof, pts, [0, -0.18, 1])
    }
    // The drop from the north roof's low edge to the landing.
    const s = spanAt(inner, SPLIT + 0.001)
    if (s) face(roof, [[s[0], SPLIT, Z_LAND - 0.3], [s[1], SPLIT, Z_LAND - 0.3], [s[1], SPLIT, roofN(SPLIT)], [s[0], SPLIT, roofN(SPLIT)]], [0, -1, 0])
  }

  // --- The stepped plaza: the landing, then ten broad steps down south.
  {
    const south = clipY(inner, SPLIT, -1)
    const bands: [number, number, number][] = [[LAND, SPLIT, Z_LAND]]
    for (let k = 1; k <= NSTEP; k++) {
      const y1 = LAND - (k - 1) * STEP_D, y0 = k === NSTEP ? -60 : LAND - k * STEP_D
      bands.push([y0, y1, Z_LAND - k * STEP_H])
    }
    for (const [y0, y1, z] of bands) {
      const r = clipY(clipY(south, y0, 1), y1, -1)
      if (r.length >= 3) cap(deck, ccw(r), z)
    }
    for (let k = 1; k <= NSTEP; k++) {
      const y = LAND - (k - 1) * STEP_D, s = spanAt(south, y)
      if (!s) continue
      face(deck, [[s[0], y, Z_LAND - k * STEP_H], [s[1], y, Z_LAND - k * STEP_H], [s[1], y, Z_LAND - (k - 1) * STEP_H], [s[0], y, Z_LAND - (k - 1) * STEP_H]], [0, -1, 0])
    }
  }

  // --- The dark slot between the two hull pieces, on both sides.
  for (const [xo, nx] of [[-23.2, -1], [21.2, 1]] as [number, number][]) {
    face(win, [[xo, 12.4, 6], [xo, 17.0, 6], [xo, 17.0, 21.8], [xo, 12.4, 21.0]], [nx, 0, 0])
  }

  // --- Pavilion on the landing: glass walls and a white roof.
  {
    const r = rect(-14.0, 5.2, 11.6, 20.6)
    prism(win, r, Z_LAND, 25.6, null)
    bprism(white, white, rect(-14.8, 4.4, 12.4, 21.4), 25.6, 26.5, 0.25)
    cap(white, rect(-14.8, 4.4, 12.4, 21.4), 25.6, false)
  }

  // --- Ground floor under the hull: recessed glazing on a brick base,
  // north of the tunnel portal.
  {
    const base = clipY(inset(ccw(R0.map((p) => [p[0], p[1]] as XY)), 1.2), -25, 1)
    prism(brick, base, 0, 1.0, null)
    prism(win, base, 1.0, Z0, null)
  }

  // --- The brick ventilation tower at the south end.
  bprism(brick, roof, rect(-10.7, -49.6, -6.6, -45.4), 0, 22.4, 0.3)

  return [
    { part: hull, material: finish('nemo-copper', 0x6aa690) },
    { part: deck, material: finish('nemo-steps', 0xcfc4b0) },
    { part: win, material: { ...PALETTE.window } },
    { part: white, material: { ...PALETTE.trim } },
    { part: roof, material: { ...PALETTE.roof } },
    { part: brick, material: finish('nemo-brick', 0xa8614d) },
  ]
}

if (import.meta.main) await save('amsterdam-nemo', 'NEMO Science Museum', [52.374196, 4.912322], 3, build(), 5000)
