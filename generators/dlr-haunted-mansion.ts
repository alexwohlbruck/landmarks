/**
 * The Haunted Mansion, New Orleans Square, Disneyland Park (Anaheim) —
 * procedural, CC0-1.0.
 * bun generators/dlr-haunted-mansion.ts
 *
 * Map frame, turned: x along the mansion's front, y back from it, z up,
 * metres. Placed at bearing 327°, the axis of the OSM facade part
 * (its edges run at 56.9° / 326.9°), so the front faces 147° (SSE), over the
 * lawn and the queue. The origin is the area centroid of the facade part
 * way/178238274 (-117.9221698, 33.8117211), on the ground.
 *
 * Only the facade house is modelled. Since 1963 it has stood in front of
 * the railroad berm; the ride runs in a show building outside the berm,
 * reached by the Stretching Room elevator and a tunnel under the tracks.
 * OSM draws house and show building as one outline (way/178254960, h=6),
 * which the model cannot replace; the map keeps drawing it, so the model's
 * ground storey is closed and sits just outside the facade part's edges,
 * hiding the outline's 6 m box where the house stands.
 *
 * A white antebellum house (Ken Anderson's design after the Shipley-Lydecker
 * house in Baltimore): a two-storey cast-iron gallery in sage green lace
 * round the front and sides, a giant tetrastyle portico with a pediment in
 * the middle of the front, an attic storey with green-shuttered windows and
 * a deep bracketed cornice, a low hipped roof with a flat deck ringed by
 * white iron cresting, four red brick chimneys, and a square cupola with an
 * arched window on each face, a bracketed eave, a low pyramid roof and a
 * weather vane.
 *
 * Evidence:
 *  - OSM, measured: the facade part way/178238274 (17.8 × 16.8 m in this
 *    frame), its main-block part way/122193484 (h=6.2) and a round part
 *    way/122193472 (Ø 4.2 m, h=6.8) a little ahead of the house's centre,
 *    taken as the cupola's position. OSM's heights are far too low against
 *    every photo and are not followed.
 *  - Published (Wikipedia, "The Haunted Mansion"): antebellum mansion based on
 *    the Shipley-Lydecker house; facade finished 1963, ride opened 9 Aug 1969;
 *    Stretching Room elevator and tunnel under the railroad berm.
 *  - Photos (Wikimedia Commons):
 *    front-left three-quarter, "Haunted Mansion July 4.jpg" (Alfred A. Si,
 *    public domain) and "Haunted Mansion Exterior.JPG" (SolarSurfer, public
 *    domain); near-frontal, "Haunted Mansion at Disneyland July 2022.jpg"
 *    (Benoît Prieur, CC0) and "Haunted Mansion, Disneyland 2002.jpg" (Rabit,
 *    CC BY-SA 3.0); front-right, "Haunted Mansion (28772701926).jpg" (Theme
 *    Park Tourist, CC BY 2.0) and "Haunted house in Disneyland.jpg" (Davric,
 *    CC BY-SA 4.0).
 *  - Heights scaled from the near-frontal 2002 photo on the portico's
 *    columns, the portico taken as 7 m wide (4 columns, the front split
 *    gallery : portico : gallery ≈ 0.31 : 0.39 : 0.31 in the 2022 photo,
 *    across OSM's 17.8 m): columns 8.8 m, attic cornice ≈ 14.5 m, cupola roof
 *    ≈ 20.5 m, vane ≈ 22 m.
 *
 * Estimated: the gallery's depth (2.5 m), the portico's projection (2 m),
 * every height above (±1 m), the cupola's size and depth on the roof, the
 * chimneys' positions (two each side, from the front-left and front-right
 * photos). Invented: the right-hand side gallery and the back, which no
 * photo shows through the trees; the side galleries are mirrored from the
 * left one. The ground storey of the gallery is drawn closed (iron lace,
 * posts and windows on a wall in the gallery's front plane) so the OSM
 * outline's 6 m block cannot show through it; the upper storey is open.
 * The lace itself is abstracted to posts, arched spandrel panels and a
 * solid balcony band.
 */
import { Part, cross, len, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const wall = new Part()   // cream clapboard walls, pediment tympanum
const trim = new Part()   // columns, cornices, slabs, cresting, cupola
const roof = new Part()   // roofs, lunette
const iron = new Part()   // the green cast-iron lace, posts, shutters
const glaze = new Part()  // windows and doors
const brick = new Part()  // chimneys

type XY = [number, number]
const TAU = Math.PI * 2
const unit = (a: V3): V3 => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

function tri(p: Part, a: V3, b: V3, c: V3, n?: V3[]) { p.tri(a, b, c, undefined, undefined, undefined, n) }
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n?: [V3, V3, V3, V3]) {
  tri(p, a, b, c, n && [n[0], n[1], n[2]])
  tri(p, a, c, d, n && [n[0], n[2], n[3]])
}
/** Both windings: thin free-standing panels (lace, cresting, vane). */
function quad2(p: Part, a: V3, b: V3, c: V3, d: V3) { quad(p, a, b, c, d); quad(p, d, c, b, a) }

const area = (q: XY[]) => q.reduce((s, a, i) => { const b = q[(i + 1) % q.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2

/** A vertical prism over a convex polygon, flat-shaded. */
function prism(p: Part, poly: XY[], z0: number, z1: number, o: { top?: boolean; bottom?: boolean } = {}) {
  if (area(poly) < 0) poly = [...poly].reverse()
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-6) continue
    quad(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (o.top !== false) for (let i = 1; i < poly.length - 1; i++) tri(p, [...poly[0], z1] as V3, [...poly[i], z1] as V3, [...poly[i + 1], z1] as V3)
  if (o.bottom) for (let i = 1; i < poly.length - 1; i++) tri(p, [...poly[0], z0] as V3, [...poly[i + 1], z0] as V3, [...poly[i], z0] as V3)
}

/** A box, its vertical edges chamfered by c. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, c = 0, o: { top?: boolean; bottom?: boolean } = {}) {
  const poly: XY[] = c > 0
    ? [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
    : [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  prism(p, poly, z0, z1, o)
}

/** Rectangle ring corners, counter-clockwise from above. */
const rect = (x0: number, x1: number, y0: number, y1: number, z: number): V3[] =>
  [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]

/** Loft between closed rings of equal length (flat-shaded bands). */
function loft(p: Part, rings: V3[][]) {
  const n = rings[0].length
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      quad(p, rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i])
    }
}

/** A smooth-shaded tapering cylinder about a vertical axis. */
function column(p: Part, cx: number, cy: number, r0: number, z0: number, r1: number, z1: number, n = 12) {
  const k = (r0 - r1) / (z1 - z0)
  for (let i = 0; i < n; i++) {
    const t0 = (i / n) * TAU, t1 = ((i + 1) / n) * TAU
    const n0 = unit([Math.cos(t0), Math.sin(t0), k]), n1 = unit([Math.cos(t1), Math.sin(t1), k])
    quad(p,
      [cx + r0 * Math.cos(t0), cy + r0 * Math.sin(t0), z0], [cx + r0 * Math.cos(t1), cy + r0 * Math.sin(t1), z0],
      [cx + r1 * Math.cos(t1), cy + r1 * Math.sin(t1), z1], [cx + r1 * Math.cos(t0), cy + r1 * Math.sin(t0), z1],
      [n0, n1, n1, n0])
  }
}

/**
 * A point on a wall face: `face` is the wall's outward direction, `plane`
 * its coordinate, u runs left to right as seen from outside, `off` how far
 * proud of the wall.
 */
type Face = 's' | 'n' | 'e' | 'w'
function at(face: Face, plane: number, u: number, z: number, off = 0.05): V3 {
  return face === 's' ? [u, plane - off, z] : face === 'n' ? [-u, plane + off, z]
    : face === 'e' ? [plane + off, u, z] : [plane - off, -u, z]
}
/** A flat rectangle on a wall. */
function panel(p: Part, face: Face, plane: number, u0: number, u1: number, z0: number, z1: number, off = 0.05) {
  quad(p, at(face, plane, u0, z0, off), at(face, plane, u1, z0, off), at(face, plane, u1, z1, off), at(face, plane, u0, z1, off))
}
/** A window, with green shutters either side when `shutters`. */
function windowOn(face: Face, plane: number, u: number, w: number, z0: number, z1: number, shutters = true, arched = false) {
  if (arched) {
    // A semicircular head: rectangle to the springing line, then a fan.
    const r = w / 2, spring = z1 - r
    panel(glaze, face, plane, u - r, u + r, z0, spring)
    const n = 8
    for (let i = 0; i < n; i++) {
      const a0 = Math.PI * (i / n), a1 = Math.PI * ((i + 1) / n)
      tri(glaze, at(face, plane, u, spring), at(face, plane, u + r * Math.cos(a0), spring + r * Math.sin(a0)), at(face, plane, u + r * Math.cos(a1), spring + r * Math.sin(a1)))
    }
  } else panel(glaze, face, plane, u - w / 2, u + w / 2, z0, z1)
  if (shutters) {
    const s = w * 0.48
    panel(iron, face, plane, u - w / 2 - s - 0.06, u - w / 2 - 0.06, z0, z1, 0.07)
    panel(iron, face, plane, u + w / 2 + 0.06, u + w / 2 + s + 0.06, z0, z1, 0.07)
  }
}

/**
 * One bay of iron lace: an arched spandrel panel hanging from `zTop`
 * between u0 and u1, dropping `drop` at the posts and leaving `gap` at the
 * crown. Semi-elliptical, like the gallery's lace arches.
 */
function spandrel(face: Face, plane: number, u0: number, u1: number, zTop: number, drop: number, gap: number, both: boolean, off = 0.05) {
  const n = 8
  for (let i = 0; i < n; i++) {
    const ta = i / n, tb = (i + 1) / n
    const za = zTop - drop + (drop - gap) * Math.sqrt(Math.max(0, 1 - (2 * ta - 1) ** 2))
    const zb = zTop - drop + (drop - gap) * Math.sqrt(Math.max(0, 1 - (2 * tb - 1) ** 2))
    const ua = u0 + (u1 - u0) * ta, ub = u0 + (u1 - u0) * tb
    const q: [V3, V3, V3, V3] = [at(face, plane, ua, za, off), at(face, plane, ub, zb, off), at(face, plane, ub, zTop, off), at(face, plane, ua, zTop, off)]
    if (both) quad2(iron, ...q)
    else quad(iron, ...q)
  }
}

/** A square post centred on (x, y). */
function post(p: Part, x: number, y: number, z0: number, z1: number, w = 0.42) {
  box(p, x - w / 2, x + w / 2, y - w / 2, y + w / 2, z0, z1, 0, { top: false })
}

// ---------------------------------------------------------------------------
// Plan and levels. The house is authored centred on x = 0 and shifted 0.2 m
// at the end to sit on the facade part (whose centroid is the origin).

const FRONT = -8.6           // the gallery's front plane (OSM: -8.46)
const BACK = 8.5             // the back wall (OSM: 8.34)
const HALF = 9.05            // the gallery's outer face either side (OSM: ±8.9)
const BODY = 6.4             // the house walls behind the gallery
const BF = FRONT + 2.5       // the house's front wall
const PH = 3.75              // the portico's half-width
const PF = FRONT - 2.0       // the portico's front

const PORCH = 1.0            // gallery and portico floor
const SLAB0 = 5.6, SLAB1 = 6.1 // upper gallery floor
const GTOP = 9.8             // gallery storey top / column capitals
const GCOR = 10.5            // gallery cornice top
const GROOF = 11.3           // where the gallery roof meets the house
const EAVE = 14.0            // attic wall top
const CORN = 14.8            // cornice top
const DECK = 15.9            // roof deck
const BAY_F = [-HALF, (-HALF - PH) / 2, -PH, PH, (HALF + PH) / 2, HALF] // front post lines
const SIDE_N = 6
const sideY = (k: number) => FRONT + ((BACK - FRONT) * k) / SIDE_N

// The ground storey, closed: a cream wall on the gallery's outer line, with
// a white plinth. It stands just outside the OSM facade part's edges.
box(wall, -HALF, HALF, FRONT, BACK, 0, SLAB0, 0, { top: false })
box(trim, -HALF - 0.08, HALF + 0.08, FRONT - 0.08, BACK + 0.08, 0, PORCH, 0, { top: false })

// The upper gallery floor, a white slab with an edge.
box(trim, -HALF - 0.15, HALF + 0.15, FRONT - 0.15, BACK + 0.15, SLAB0, SLAB1, 0, { bottom: true })

// The house: walls from the gallery floor to the attic cornice.
box(wall, -BODY, BODY, BF, BACK, SLAB1, EAVE, 0, { top: false })

// Gallery cornice: a white band round the gallery's outer line.
loft(trim, [rect(-HALF - 0.2, HALF + 0.2, FRONT - 0.2, BACK + 0.2, GTOP), rect(-HALF - 0.2, HALF + 0.2, FRONT - 0.2, BACK + 0.2, GCOR)])
loft(trim, [rect(-HALF, HALF, FRONT, BACK, GTOP), rect(-HALF - 0.2, HALF + 0.2, FRONT - 0.2, BACK + 0.2, GTOP)]) // soffit
// Gallery roof: low slopes from the cornice up to the house wall.
loft(roof, [rect(-HALF - 0.2, HALF + 0.2, FRONT - 0.2, BACK + 0.2, GCOR), rect(-BODY, BODY, BF, BACK, GROOF)])

// The bracketed attic cornice and the low hipped roof with its deck.
{
  const o = 0.8
  loft(trim, [rect(-BODY, BODY, BF, BACK, EAVE - 0.35), rect(-BODY - o, BODY + o, BF - o, BACK + o, EAVE + 0.15), rect(-BODY - o, BODY + o, BF - o, BACK + o, CORN)])
  const d = 2.2
  loft(roof, [rect(-BODY - o, BODY + o, BF - o, BACK + o, CORN), rect(-BODY + d, BODY - d, BF + d, BACK - d, DECK)])
  const deck = rect(-BODY + d, BODY - d, BF + d, BACK - d, DECK)
  tri(roof, deck[0], deck[1], deck[2]); tri(roof, deck[0], deck[2], deck[3])
  // Brackets under the cornice, about every 1.3 m.
  const bracket = (x: number, y: number, ax: 'x' | 'y') => {
    const w = 0.22, dpt = o - 0.05
    if (ax === 'x') box(trim, x - w / 2, x + w / 2, y < 0 ? y - dpt : y, y < 0 ? y : y + dpt, EAVE - 0.6, EAVE - 0.1)
    else box(trim, x < 0 ? x - dpt : x, x < 0 ? x : x + dpt, y - w / 2, y + w / 2, EAVE - 0.6, EAVE - 0.1)
  }
  const nx = Math.round((2 * BODY) / 1.3), ny = Math.round((BACK - BF) / 1.3)
  for (let i = 0; i <= nx; i++) { const x = -BODY + 0.15 + ((2 * BODY - 0.3) * i) / nx; bracket(x, BF, 'x'); bracket(x, BACK, 'x') }
  for (let i = 1; i < ny; i++) { const y = BF + ((BACK - BF) * i) / ny; bracket(-BODY, y, 'y'); bracket(BODY, y, 'y') }
  // White iron cresting round the deck: a thin band, the roof's lace.
  const c = rect(-BODY + d, BODY - d, BF + d, BACK - d, DECK)
  for (let i = 0; i < 4; i++) {
    const a = c[i], b = c[(i + 1) % 4]
    quad2(trim, a, b, [b[0], b[1], DECK + 0.55], [a[0], a[1], DECK + 0.55])
  }
}

// Attic windows with shutters: one each side of the pediment in front,
// two on each side wall, two at the back.
for (const x of [-4.7, 4.7]) windowOn('s', BF, x, 0.95, GROOF + 0.6, EAVE - 0.7)
for (const y of [-1.8, 4.2]) {
  windowOn('e', BODY, y, 0.95, GROOF + 0.6, EAVE - 0.7)
  windowOn('w', -BODY, -y, 0.95, GROOF + 0.6, EAVE - 0.7)
}
for (const x of [-3, 3]) windowOn('n', BACK, x, 0.95, GROOF + 0.6, EAVE - 0.7)

// Chimneys, red brick with a corbelled cap: two each side.
for (const sx of [-1, 1]) for (const y of [-2.6, 5.4]) {
  const x = sx * (BODY - 0.5)
  box(brick, x - 0.45, x + 0.45, y - 0.65, y + 0.65, EAVE, 17.3, 0, { top: false })
  box(brick, x - 0.58, x + 0.58, y - 0.78, y + 0.78, 17.3, 17.65)
}

// ---------------------------------------------------------------------------
// The gallery: iron posts, lace arches and the balcony band, two storeys.

{
  const drop = 1.55, gap = 0.4
  // Front: two bays each side of the portico.
  for (let i = 0; i < BAY_F.length - 1; i++) {
    const u0 = BAY_F[i], u1 = BAY_F[i + 1]
    const inPortico = u0 === -PH
    if (!inPortico) {
      spandrel('s', FRONT, u0, u1, SLAB0, drop, gap, false)          // ground storey, on the wall
      spandrel('s', FRONT - 0.02, u0, u1, GTOP, drop, gap, true, 0)  // upper storey, free-standing
      quad2(iron, [u0, FRONT, SLAB1], [u1, FRONT, SLAB1], [u1, FRONT, SLAB1 + 1.0], [u0, FRONT, SLAB1 + 1.0])
      windowOn('s', FRONT, (u0 + u1) / 2, 1.0, PORCH + 0.5, PORCH + 3.3)
    } else {
      // Behind the portico: the balcony band only, and the front door below.
      quad2(iron, [u0, FRONT, SLAB1], [u1, FRONT, SLAB1], [u1, FRONT, SLAB1 + 1.0], [u0, FRONT, SLAB1 + 1.0])
      windowOn('s', FRONT, 0, 1.7, PORCH, PORCH + 3.2, false)
      for (const x of [-2.4, 2.4]) windowOn('s', FRONT, x, 0.95, PORCH + 0.5, PORCH + 3.3)
    }
  }
  for (const x of BAY_F) {
    post(iron, x, FRONT, PORCH, SLAB0)
    post(iron, x, FRONT, SLAB1, GTOP)
  }
  // Sides: six bays each, mirrored.
  for (const sx of [-1, 1]) {
    const face: Face = sx > 0 ? 'e' : 'w'
    const x = sx * HALF
    for (let k = 0; k < SIDE_N; k++) {
      const y0 = sideY(k), y1 = sideY(k + 1)
      const u0 = sx > 0 ? y0 : -y1, u1 = sx > 0 ? y1 : -y0
      spandrel(face, x, u0, u1, SLAB0, drop, gap, false)
      spandrel(face, x + sx * 0.02, u0, u1, GTOP, drop, gap, true, 0)
      quad2(iron, [x, y0, SLAB1], [x, y1, SLAB1], [x, y1, SLAB1 + 1.0], [x, y0, SLAB1 + 1.0])
      windowOn(face, x, (u0 + u1) / 2, 1.0, PORCH + 0.5, PORCH + 3.3)
    }
    for (let k = 0; k <= SIDE_N; k++) {
      post(iron, x, sideY(k), PORCH, SLAB0)
      post(iron, x, sideY(k), SLAB1, GTOP)
    }
  }
  // Back: plain, windows on the ground storey.
  for (const x of [-6, -2, 2, 6]) windowOn('n', BACK, x, 1.0, PORCH + 0.5, PORCH + 3.3)
}

// The house's upper-floor windows, seen through the open gallery.
for (const x of [-4.8, -1.5, 1.5, 4.8]) windowOn('s', BF, x, 1.0, SLAB1 + 0.3, SLAB1 + 3.0)
for (let k = 0; k < SIDE_N; k++) {
  const y = (sideY(k) + sideY(k + 1)) / 2
  if (y < BF + 0.8) continue
  windowOn('e', BODY, y, 1.0, SLAB1 + 0.3, SLAB1 + 3.0)
  windowOn('w', -BODY, -y, 1.0, SLAB1 + 0.3, SLAB1 + 3.0)
}
for (const x of [-3, 3]) windowOn('n', BACK, x, 1.0, SLAB1 + 0.3, SLAB1 + 3.0)

// ---------------------------------------------------------------------------
// The portico: four giant columns, entablature, pediment, steps.

{
  // Floor and steps.
  box(trim, -PH - 0.1, PH + 0.1, PF - 0.1, FRONT, 0, PORCH)
  for (let s = 0; s < 3; s++) {
    box(trim, -2.4, 2.4, PF - 0.1 - (s + 1) * 0.4, PF - 0.1 - s * 0.4, 0, (PORCH * (3 - s)) / 4)
  }
  const cy = PF + 0.75
  for (const x of [-3.1, -1.05, 1.05, 3.1]) {
    box(trim, x - 0.5, x + 0.5, cy - 0.5, cy + 0.5, PORCH, PORCH + 0.45, 0.08)
    column(trim, x, cy, 0.42, PORCH + 0.45, 0.36, GTOP - 0.5)
    box(trim, x - 0.52, x + 0.52, cy - 0.52, cy + 0.52, GTOP - 0.5, GTOP, 0.08, { bottom: true })
  }
  // Entablature, its soffit and the pediment over it, roofed back to the house.
  const EN = GTOP + 1.25, APEX = EN + 2.1
  box(trim, -PH, PH, PF, FRONT, GTOP, EN, 0, { bottom: true })
  box(trim, -PH - 0.15, PH + 0.15, PF - 0.15, FRONT, EN - 0.3, EN, 0)
  const y0 = PF - 0.15, y1 = BF
  const w = PH + 0.35
  // Roof slopes.
  quad(roof, [w, y0, EN], [w, y1, EN], [0, y1, APEX], [0, y0, APEX])
  quad(roof, [-w, y1, EN], [-w, y0, EN], [0, y0, APEX], [0, y1, APEX])
  // Tympanum, set back behind the raking cornice.
  tri(wall, [-PH + 0.2, PF + 0.15, EN], [PH - 0.2, PF + 0.15, EN], [0, PF + 0.15, APEX - 0.35])
  // Raking cornices: white bands along both rakes.
  for (const s of [-1, 1]) {
    const A: V3 = [s * w, y0, EN], B: V3 = [0, y0, APEX], t = 0.35
    const A1: V3 = [A[0], A[1], A[2] - t], B1: V3 = [0, y0, APEX - t]
    const Ab: V3 = [A[0], y0 + 0.6, A[2] - t], Bb: V3 = [0, y0 + 0.6, APEX - t]
    if (s > 0) { quad(trim, A1, A, B, B1); quad(trim, Ab, A1, B1, Bb) } else { quad(trim, A, A1, B1, B); quad(trim, A1, Ab, Bb, B1) }
  }
  // The lunette vent in the tympanum.
  const r = 0.75, zc = EN + 0.15, n = 8
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI * (i / n), a1 = Math.PI * ((i + 1) / n)
    tri(roof, [0, PF + 0.08, zc], [r * Math.cos(a0), PF + 0.08, zc + r * Math.sin(a0)], [r * Math.cos(a1), PF + 0.08, zc + r * Math.sin(a1)])
  }
}

// ---------------------------------------------------------------------------
// The cupola: square, an arched window each face, bracketed eave, low
// pyramid roof and the weather vane. Where OSM's round part stands.

{
  const cx = 0, cy = -1.4, h = 1.9
  const z0 = DECK, zw0 = DECK + 0.4, zw1 = DECK + 2.8, zc = zw1 + 0.45, zr = zc + 1.3
  box(trim, cx - h - 0.15, cx + h + 0.15, cy - h - 0.15, cy + h + 0.15, z0, zw0, 0.1)
  box(wall, cx - h, cx + h, cy - h, cy + h, zw0, zw1, 0, { top: false })
  // Corner pilasters.
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x = cx + sx * h, y = cy + sy * h
    box(trim, x - 0.22, x + 0.22, y - 0.22, y + 0.22, zw0, zw1, 0, { top: false })
  }
  windowOn('s', cy - h, cx, 1.0, zw0 + 0.35, zw1 - 0.3, false, true)
  windowOn('n', cy + h, -cx, 1.0, zw0 + 0.35, zw1 - 0.3, false, true)
  windowOn('e', cx + h, cy, 1.0, zw0 + 0.35, zw1 - 0.3, false, true)
  windowOn('w', cx - h, -cy, 1.0, zw0 + 0.35, zw1 - 0.3, false, true)
  // Bracketed eave: a flared band, then the roof.
  const e = h + 0.55
  loft(trim, [rect(cx - h, cx + h, cy - h, cy + h, zw1), rect(cx - e, cx + e, cy - e, cy + e, zc - 0.15), rect(cx - e, cx + e, cy - e, cy + e, zc)])
  const ring = rect(cx - e, cx + e, cy - e, cy + e, zc)
  for (let i = 0; i < 4; i++) tri(roof, ring[i], ring[(i + 1) % 4], [cx, cy, zr])
  // Finial and vane.
  box(roof, cx - 0.06, cx + 0.06, cy - 0.06, cy + 0.06, zr - 0.1, zr + 1.7, 0, { top: true })
  quad2(roof, [cx, cy - 0.05, zr + 1.15], [cx + 0.75, cy - 0.05, zr + 1.15], [cx + 0.75, cy - 0.05, zr + 1.45], [cx, cy - 0.05, zr + 1.45])
}

// ---------------------------------------------------------------------------

// White and cream are the house; the sage-green iron lace is its identity
// (the palette's copper green is the same family, named for what it is
// here); the chimneys are red brick in every photo, pulled light.
const parts = [
  { part: wall, material: PALETTE.stone },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: iron, material: finish('mansion-iron', 0x7f9a87) },
  { part: glaze, material: PALETTE.window },
  { part: brick, material: finish('mansion-brick', 0xc0806c) },
]
// Shift onto the facade part: its centroid is 0.2 m left of the house's centre.
const OX = 0.2
for (const { part } of parts) for (let i = 0; i < part.pos.length; i += 3) part.pos[i] += OX
const triangles = parts.reduce((sum, { part }) => sum + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('The Haunted Mansion (Disneyland)', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 327, elevation: 0, height: 22.1,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/dlr-haunted-mansion.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
