/**
 * National Museum of Natural History (Smithsonian) — procedural, CC0-1.0,
 * no textures.
 * bun generators/dc-natural-history.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the area centroid of
 * the OSM outline (way/66418787). The building is square to the compass, so
 * it is placed at bearing 0.
 *
 * Modelled: the 1911 building's granite block, with its south facade of
 * two eleven-bay pavilions either side of the domed south pavilion; the
 * portico of Corinthian columns, its entablature and the stairs up to it;
 * the extended pediments with their big semicircular clerestory windows on
 * the four sides of the south pavilion; the drum in two stages and the
 * shallow green-slate dome; the low hipped roofs of the east, west and north
 * pavilions with their skylights; the mansard ranges round the two (now
 * infilled) courtyards and the infill roofs; the projecting north entrance
 * block; and the 1960s east and west wings, the same height as the original,
 * with their set-back attic and penthouse. Windows are one slate panel per
 * bay: the tall two-storey windows between the pilasters, the attic windows
 * above the cornice, and the ground-floor openings.
 *
 * Evidence:
 * - OSM: way/66418787 (outline, 274 × 109 m); way/453546745, the south
 *   pavilion and portico (x ±18.7, the portico ±13.2 and 5 m deep);
 *   way/453546747, the drum, 23.6 m across, centred 30.5 m south of the
 *   outline's centroid.
 * - Published: National Register nomination (DC Historic Preservation
 *   Office, "National Museum of Natural History", undated): four storeys plus
 *   an attic; south pavilion with an eight-column Corinthian portico and an
 *   extended pediment with a semicircular clerestory window, repeated on its
 *   east, north and west walls; drum 75 ft (22.9 m) across; dome clad in
 *   green Vermont slate; east, west and north pavilions with low hipped slate
 *   roofs and skylights; L-shaped ranges with mansard roofs enclosing two
 *   courtyards, since infilled (1974–77, 1995–98); east and west wings
 *   (1961–65) the same height as the original, attic and 1991 penthouses
 *   stepped back; the site rises from Constitution Avenue to the Mall, so the
 *   north entrance is at ground-floor level and the south one at the first
 *   floor. Hornblower & Marshall, 1904–11.
 * - Photos (Wikimedia Commons): "National Museum of Natural History - Madison
 *   Drive - 2026 (55256219324).jpg" (ajay_suresh, CC BY 4.0, frontal from the
 *   south: column spacing, storey heights); "The National Museum of Natural
 *   History (NMNH) (53831938363).jpg" (ajay_suresh, CC BY 2.0, telephoto
 *   from the south: drum, dome, pediment and parapet heights);
 *   "National Museum of Natural History, Washington.jpg" (Amanda, CC BY 2.0,
 *   from the Washington Monument: roofs, west wing, dome colour);
 *   "2021 Smithsonian National Museum of Natural History from Pennsylvania
 *   Avenue.jpg" (Beyond My Ken, CC BY-SA 4.0, the north side);
 *   "National Museum of Natural History (side).jpg" (Cressonhist, CC BY-SA
 *   3.0, the east wing).
 * - USGS NAIP orthophoto (public domain): the courts, roof skylights and the
 *   wings' penthouses.
 *
 * Ground: the site falls from the Mall to Constitution Avenue. USGS 3DEP
 * spot heights (EPQS) give 7.0–7.1 m at the Madison Drive front and 3.0 m
 * just off the north front, so the south ground is taken as 4.0 m above the
 * north grade, which is y = 0. That is the storey the nomination describes:
 * the north entrance is at the ground floor, the south one at the first.
 * South-facing detail starts at 4.0 m; on the north the ground storey runs
 * down to y = 0. The east and west ends, along which the slope runs, are
 * detailed from the south level, so their north ends show a plain base.
 *
 * Measured from the frontal photos against the OSM pavilion width (37.4 m),
 * above Madison Drive (add 4.0 m for the model): parapet 21.6 m, main
 * cornice 16.6 m, portico columns to 18.6 m, south pavilion cornice 27.9 m,
 * pediment apex 35 m. Drum and dome, measured at 1:1 on the telephoto
 * (14.8 px/m): lower drum 24.4 m across (the nomination's 75 ft, OSM's
 * 23.6 m) to 35.1 m with its ring of frieze windows, upper drum 23.2 m
 * across to 37.6 m, dome 19.6 m across springing at 37.9 m, crown 43.0 m.
 * The east and west faces' extended pediments are drawn lower than the
 * south and north ones (the south-east photo), so the drum stands clear
 * above the attic as it does from the Mall.
 * Portico: six columns across the front and one behind each end, the
 * eight of the nomination; the frontal photo shows six across and the
 * south-east one (ajay_suresh, 55255088887) shows the column behind the
 * east end. Windows: one broad panel per bay over the two main storeys,
 * with the pilasters as wall between. Estimated: the plan split into
 * pavilions, ranges and courts (from NAIP, to a metre or two), the roof
 * pitches, the wings' attic and penthouse sizes, the stair depth.
 * Not modelled: sculpture, the elephant-head bronzes, the north balustrades,
 * dormer pediments (drawn as attic windows), the courtyard glass walls.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, annulus, cap, circle, lathe, orient, rect, save, slab, walls } from './dc-nmaahc'

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), glass = new Part(), dome = new Part()

// Heights.
// y = 0 is the north grade on Constitution Avenue, the lowest ground; the
// Mall side (Madison Drive) is SG higher, and every height measured from the
// south photos is lifted by it.
const SG = 4.0
const CORNICE = SG + 16.6, PARAPET = SG + 21.6, COL_TOP = SG + 18.6, PORTICO = SG + 5.0
const PAV_TOP = SG + 27.9, APEX_S = SG + 35.0
// The east and west faces carry lower extended pediments (as the south-east
// photo shows); full-height ones would hide the drum from the Mall.
const APEX_EW = PAV_TOP + 3.2
const DRUM: [number, number, number][] = [[12.2, PAV_TOP, SG + 35.1], [11.6, SG + 35.1, SG + 37.6]]
const DOME_R = 9.8, CROWN = SG + 43.0

// Plan.
const XS = 85.3, YS = -51.2, YN = 45.5         // the 1911 block
const XW = 137.0, WY0 = -23.0, WY1 = 36.0        // the 1960s wings, x from XS to XW
const XC = 18.7, CY0 = -49.0, CY1 = -12.0, CC = 5.5 // the south pavilion's high block, chamfer
const DC: XY = [-0.2, -30.5]                     // drum centre
const PX = 13.2, PY = -56.0                      // portico

type Side = 'n' | 's' | 'e' | 'w'
/** A window panel on an axis-aligned wall at `at`, spanning a0..a1 along it. */
function pane(p: Part, side: Side, at: number, a0: number, a1: number, z0: number, z1: number, d = 0.05) {
  const o = side === 'n' || side === 'e' ? at + d : at - d
  const q: V3[] = side === 'n' || side === 's'
    ? [[a0, o, z0], [a1, o, z0], [a1, o, z1], [a0, o, z1]]
    : [[o, a0, z0], [o, a1, z0], [o, a1, z1], [o, a0, z1]]
  orient(p, q, side === 's' ? [0, -1, 0] : side === 'n' ? [0, 1, 0] : side === 'e' ? [1, 0, 0] : [-1, 0, 0])
}
/**
 * Bays of windows along a wall: one broad panel per bay spanning the two
 * main storeys between the pilasters, an attic window, and a ground-storey
 * opening (`ground` gives its heights; on the north it is a full storey
 * taller, the basement storey the slope exposes).
 */
const SOUTH_GROUND: [number, number] = [SG + 0.8, SG + 3.8]
const NORTH_GROUND: [number, number] = [1.2, SG + 3.6]
function bays(side: Side, at: number, a0: number, a1: number, n: number, attic = true, ground: [number, number] | false = SOUTH_GROUND, tall: [number, number] = [SG + 5.6, SG + 15.4]) {
  const w = (a1 - a0) / n
  for (let k = 0; k < n; k++) {
    const c = a0 + (k + 0.5) * w
    pane(win, side, at, c - w * 0.31, c + w * 0.31, tall[0], tall[1])
    if (attic) pane(win, side, at, c - w * 0.28, c + w * 0.28, CORNICE + 1.3, PARAPET - 1.3)
    if (ground) pane(win, side, at, c - w * 0.25, c + w * 0.25, ground[0], ground[1])
  }
}
/** A projecting band round a rectangle (cornice, coping). */
function band(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, out = 0.45) {
  // a ring only: the faces outside the wall line, so it never lids a court
  const O = rect(x0 - out, x1 + out, y0 - out, y1 + out), I = rect(x0, x1, y0, y1)
  walls(trim, O, z0, z1)
  annulus(trim, O, I, z1, true)
  annulus(trim, O, I, z0, false)
}
/** A hipped roof over a rectangle, truncated to a flat top inset by `inset`; the top may be glass. */
function hip(x0: number, x1: number, y0: number, y1: number, z0: number, rise: number, inset: number, top: Part = roof) {
  const lo = rect(x0, x1, y0, y1).map(([x, y]) => [x, y, z0] as V3)
  const I = rect(x0 + inset, x1 - inset, y0 + inset, y1 - inset)
  roof.loft([lo, I.map(([x, y]) => [x, y, z0 + rise] as V3)])
  cap(top, I, z0 + rise)
}

// ---------------------------------------------------------------------------
// The 1911 block, as its parts: E/W pavilions, outer and north ranges, the
// north pavilion, and the court infills between.

const RANGE = 18.0
const PAV_Y1 = -21.0
const CX0 = XC - 1.2 // the north pavilion's half width
for (const s of [-1, 1]) {
  const xa = (v: number) => s * v
  const lo = (a: number, b: number): [number, number] => [Math.min(xa(a), xa(b)), Math.max(xa(a), xa(b))]
  // East / west pavilion: 11 bays to the south, 5 deep.
  {
    const [x0, x1] = lo(XC, XS)
    slab(stone, rect(x0, x1, YS, PAV_Y1), 0, PARAPET, 0.3)
    hip(x0 + 0.8, x1 - 0.8, YS + 0.8, PAV_Y1 - 0.8, PARAPET, 3.2, 10, glass)
  }
  // Outer range, from the pavilion to the north front.
  {
    const [x0, x1] = lo(XS - RANGE, XS)
    slab(stone, rect(x0, x1, PAV_Y1, YN), 0, PARAPET, 0.3)
    hip(x0 + 0.6, x1 - 0.6, PAV_Y1 + 0.6, YN - 0.6, PARAPET, 4.0, 4.5)
  }
  // North range.
  {
    const [x0, x1] = lo(CX0, XS - RANGE)
    slab(stone, rect(x0, x1, YN - 14.5, YN), 0, PARAPET, 0.3)
    hip(x0 + 0.6, x1 - 0.6, YN - 14.5 + 0.6, YN - 0.6, PARAPET, 4.0, 4.5)
  }
  // Court infill, lower, with a glazed atrium strip along the old court wall.
  {
    const [x0, x1] = lo(CX0, XS - RANGE)
    slab(stone, rect(x0, x1, PAV_Y1, YN - 14.5), 0, SG + 17.5, 0, roof)
    const [g0, g1] = lo(XS - RANGE - 7, XS - RANGE - 0.2)
    cap(glass, rect(g0, g1, PAV_Y1 + 0.5, YN - 15), SG + 17.56)
  }
}
// North pavilion, with a long skylight along its hipped roof.
slab(stone, rect(-CX0, CX0, CY1, YN), 0, PARAPET, 0.3)
hip(-CX0 + 0.6, CX0 - 0.6, CY1, YN - 0.6, PARAPET, 3.6, 5.2, glass)
// North entrance block, projecting.
slab(stone, rect(-19.0, 19.0, YN - 1, 52.7), 0, PARAPET - 0.4, 0.3, roof)

// Cornices and copings over the 1911 walls (one band each round the south
// front and round the whole block reads as the continuous entablature).
band(-XS, XS, YS, YN, CORNICE - 0.5, CORNICE, 0.45)
band(-XS, XS, YS, YN, PARAPET - 0.35, PARAPET, 0.2)
band(-19.0, 19.0, YN, 52.7, CORNICE - 0.5, CORNICE, 0.45)

// Windows on the 1911 block.
bays('s', YS, -XS, -XC, 11)
bays('s', YS, XC, XS, 11)
bays('n', YN, -XS, -19.0, 9 + 4, true, NORTH_GROUND) // north ranges' legs, dormers drawn as attic windows
bays('n', YN, 19.0, XS, 13, true, NORTH_GROUND)
bays('n', 52.7, -19.0, 19.0, 5, true, NORTH_GROUND)
// The original side walls show two bays north of the wings and the
// pavilion's end south of them.
for (const s of [-1, 1]) {
  const side: Side = s < 0 ? 'w' : 'e'
  bays(side, s * XS, YS, WY0 - 0.5, 4)
  bays(side, s * XS, WY1 + 0.5, YN, 1)
}

// ---------------------------------------------------------------------------
// The 1960s wings: plain granite blocks to the old parapet, with a set-back
// attic and a penthouse.

for (const s of [-1, 1]) {
  const [x0, x1] = s < 0 ? [-XW, -XS] : [XS, XW]
  slab(stone, rect(x0, x1, WY0, WY1), 0, PARAPET, 0.3)
  band(x0 + (s < 0 ? 0 : 0.5), x1 - (s < 0 ? 0.5 : 0), WY0, WY1, PARAPET - 0.35, PARAPET, 0.2)
  const [a0, a1] = s < 0 ? [x0 + 3.5, x1 - 1] : [x0 + 1, x1 - 3.5]
  slab(stone, rect(a0, a1, WY0 + 3.5, WY1 - 3.5), PARAPET, PARAPET + 3.4, 0.3, roof)
  slab(roof, rect(a0 + 6, a1 - 6, WY0 + 9, WY1 - 9), PARAPET + 3.4, PARAPET + 6.4, 0.3)
  // seven bays to the south and north, nine to the outer end
  const sideOut: Side = s < 0 ? 'w' : 'e'
  bays('s', WY0, x0 + 1, x1 - 1, 7, true, SOUTH_GROUND, [SG + 4.5, SG + 16.0])
  bays('n', WY1, x0 + 1, x1 - 1, 7, true, NORTH_GROUND, [SG + 4.5, SG + 16.0])
  bays(sideOut, s < 0 ? x0 : x1, WY0 + 1, WY1 - 1, 9, true, SOUTH_GROUND, [SG + 4.5, SG + 16.0])
  // attic windows, one per bay
  for (let k = 0; k < 7; k++) {
    const c = a0 + ((k + 0.5) * (a1 - a0)) / 7
    pane(win, 's', WY0 + 3.5, c - 1.6, c + 1.6, PARAPET + 0.8, PARAPET + 2.6)
  }
}

// ---------------------------------------------------------------------------
// The south pavilion: a high block with chamfered corners, a pediment on
// each face with its semicircular clerestory window, the drum and the dome.

const cx = DC[0], cy = (CY0 + CY1) / 2
const oct: XY[] = [
  [-XC + CC, CY0], [XC - CC, CY0], [XC, CY0 + CC], [XC, CY1 - CC],
  [XC - CC, CY1], [-XC + CC, CY1], [-XC, CY1 - CC], [-XC, CY0 + CC],
]
slab(stone, oct, 0, PAV_TOP, 0.4, roof)
// cornice of the high block
slab(trim, oct.map(([x, y]) => [x + Math.sign(x) * 0.5, y + Math.sign(y - cy) * 0.5] as XY), PAV_TOP - 1.0, PAV_TOP - 0.3, 0.2, true, true)
// corner piers with their acroteria blocks
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const x = sx * (XC - CC / 2), y = cy + sy * ((CY1 - CY0) / 2 - CC / 2)
  slab(stone, rect(x - 2.2, x + 2.2, y - 2.2, y + 2.2), PAV_TOP - 0.3, PAV_TOP + 2.6, 0.3)
}

/** A gable from a face at `edge` (on axis `ax`) running to the drum centre, half width hw. */
function pediment(ax: 'x' | 'y', edge: number, hw: number, APEX = APEX_S) {
  const centre = ax === 'y' ? DC[1] : DC[0], o = ax === 'y' ? cx : cy
  const P = (along: number, across: number, z: number): V3 => ax === 'y' ? [o + across, along, z] : [along, o + across, z]
  const face: V3[] = [P(edge, -hw, PAV_TOP), P(edge, hw, PAV_TOP), P(edge, 0, APEX)]
  const dir: V3 = ax === 'y' ? [0, Math.sign(edge - centre), 0] : [Math.sign(edge - centre), 0, 0]
  orient(stone, face, dir)
  // the two roof slopes, a short way back: behind the pediment the roof is
  // flat and the drum stands clear of it
  const back = edge - 5.5 * Math.sign(edge - centre)
  orient(stone, [P(back, -hw, PAV_TOP), P(back, hw, PAV_TOP), P(back, 0, APEX)], [-dir[0], -dir[1], 0])
  for (const s of [-1, 1]) {
    const q: V3[] = [P(edge, s * hw, PAV_TOP), P(back, s * hw, PAV_TOP), P(back, 0, APEX), P(edge, 0, APEX)]
    orient(roof, q, ax === 'y' ? [s, 0, 1] : [0, s, 1])
  }
  // raking cornice: a thin trim lip along each edge of the gable
  for (const s of [-1, 1]) {
    const out = 0.5 * Math.sign(edge - centre)
    const a = P(edge + out, s * (hw + 0.3), PAV_TOP - 0.2), b = P(edge + out, 0, APEX + 0.35)
    const a2 = P(edge, s * (hw + 0.3), PAV_TOP - 0.2), b2 = P(edge, 0, APEX + 0.35)
    orient(trim, [a, b, P(edge + out, 0, APEX - 0.5), P(edge + out, s * (hw - 0.6), PAV_TOP - 0.2)], dir)
    orient(trim, [a, b, b2, a2], [0, 0, 1])
  }
  // the clerestory window: a half disc, springing below the pavilion cornice
  const R = 6.2, Z = PAV_TOP - 5.6, n = 10
  const d = 0.06 * Math.sign(edge - centre)
  for (let k = 0; k < n; k++) {
    const t0 = (Math.PI * k) / n, t1 = (Math.PI * (k + 1)) / n
    orient(win, [P(edge + d, 0, Z), P(edge + d, R * Math.cos(t0), Z + R * Math.sin(t0)), P(edge + d, R * Math.cos(t1), Z + R * Math.sin(t1))], dir)
  }
  // and its stone mullions, as two pale bars, so it reads as the tripartite window
  for (const m of [-1.9, 1.9]) {
    const top = Z + Math.sqrt(R * R - m * m)
    orient(trim, [P(edge + 2 * d, m - 0.3, Z), P(edge + 2 * d, m + 0.3, Z), P(edge + 2 * d, m + 0.3, top), P(edge + 2 * d, m - 0.3, top)], dir)
  }
}
pediment('y', CY0, 12.5)
pediment('y', CY1, 12.5)
pediment('x', XC, 10.5, APEX_EW)
pediment('x', -XC, 10.5, APEX_EW)

// Drum (two stages, each with a cornice) and dome.
for (const [r, z0, z1] of DRUM) {
  lathe(stone, DC[0], DC[1], [[r, z0], [r, z1 - 0.7]], 20, false)
  lathe(trim, DC[0], DC[1], [[r, z1 - 0.7], [r + 0.45, z1 - 0.3], [r + 0.45, z1], [r - 1.0, z1]], 20, false)
}
// (the drum cornice runs in under the dome's foot ring, so no roof ring is needed)
// The ring of windows in the lower drum's frieze, one broad panel on each
// face of the 20-sided drum, set just proud of it.
{
  const [r, , z1] = DRUM[0], n = 20, rr = r * Math.cos(Math.PI / n) + 0.06
  for (let k = 0; k < n; k++) {
    const a = (2 * Math.PI * (k + 0.5)) / n, half = 0.34 * (2 * Math.PI / n) * r
    const c: [number, number] = [DC[0] + rr * Math.cos(a), DC[1] + rr * Math.sin(a)]
    const t: [number, number] = [-Math.sin(a), Math.cos(a)]
    const P = (u: number, z: number): V3 => [c[0] + t[0] * u, c[1] + t[1] * u, z]
    orient(win, [P(-half, z1 - 3.4), P(half, z1 - 3.4), P(half, z1 - 1.3), P(-half, z1 - 1.3)], [Math.cos(a), Math.sin(a), 0])
  }
}
{
  // A stepped stone ring at the dome's foot (as on the Pantheon), then a
  // shallow dome on a spherical section through its springing and the crown.
  const z0 = DRUM[1][2], zs = z0 + 0.3
  lathe(trim, DC[0], DC[1], [[DOME_R + 0.4, z0], [DOME_R + 0.4, zs], [DOME_R, zs]], 20, false)
  const h = CROWN - 0.4 - zs, R = (DOME_R * DOME_R + h * h) / (2 * h), zc = CROWN - 0.4 - R
  const prof: [number, number][] = []
  const a0 = Math.asin(DOME_R / R)
  for (let k = 0; k <= 7; k++) {
    const a = a0 * (1 - k / 7)
    prof.push([R * Math.sin(a), zc + R * Math.cos(a)])
  }
  prof[prof.length - 1] = [1.4, CROWN - 0.4]
  lathe(dome, DC[0], DC[1], prof, 20, false)
  // the stone ring round the oculus at the crown
  lathe(trim, DC[0], DC[1], [[1.8, CROWN - 0.5], [1.8, CROWN], [0, CROWN]], 12, false)
}

// ---------------------------------------------------------------------------
// The portico: columns, corner piers, entablature, the recessed entrance and
// the stairs.

slab(stone, rect(-PX - 1, PX + 1, PY, CY0), 0, PORTICO, 0.2) // the portico floor
{
  const cols = [-10.8, -6.6, -2.3, 2.3, 6.6, 10.8]
  for (const x of cols) {
    lathe(stone, x, PY + 1.6, [[0.85, PORTICO], [0.72, PORTICO + 0.5], [0.62, COL_TOP - 1.4], [0.9, COL_TOP - 0.2]], 10, false)
    slab(stone, rect(x - 1.0, x + 1.0, PY + 0.6, PY + 2.6), COL_TOP - 0.2, COL_TOP, 0)
  }
  // the two columns behind the ends
  for (const x of [-10.8, 10.8]) lathe(stone, x, PY + 5.0, [[0.72, PORTICO], [0.62, COL_TOP - 1.4], [0.9, COL_TOP]], 10, false)
  // corner piers
  for (const s of [-1, 1]) slab(stone, rect(s < 0 ? -PX - 1 : PX - 1.1, s < 0 ? -PX + 1.1 : PX + 1, PY + 0.2, CY0), PORTICO, COL_TOP, 0.2)
  // entablature over the portico and its cornice
  slab(stone, rect(-PX - 1, PX + 1, PY + 0.2, CY0), COL_TOP, PARAPET - 0.6, 0.2, roof)
  band(-PX - 1, PX + 1, PY + 0.2, CY0, PARAPET - 0.9, PARAPET - 0.4, 0.4)
  // the recessed entrance wall: three tall dark openings
  for (const x of [-4.4, 0, 4.4]) pane(win, 's', CY0, x - 1.4, x + 1.4, PORTICO, PORTICO + 8.0)
  // stairs, as a few broad steps down to the drive
  const N = 6, run = 7.0 / N
  for (let k = 0; k < N; k++) {
    const y0 = PY - 7.0 + k * run
    slab(stone, rect(-PX - 2.5, PX + 2.5, y0, PY), 0, SG + ((k + 1) * (PORTICO - SG)) / N, 0)
  }
}

const GRANITE = finish('nmnh-granite', 0xebe6dc)
const SLATE = finish('nmnh-dome-slate', 0x908d74)
await save('dc-natural-history', 'National Museum of Natural History', [
  { part: stone, material: GRANITE },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: finish('nmnh-roof', 0xaaa69e) },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
  { part: dome, material: SLATE },
], { source: 'generators/dc-natural-history.ts' }, 6500)
