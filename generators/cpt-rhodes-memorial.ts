/**
 * Rhodes Memorial, Devil's Peak, Cape Town (1912) — procedural, CC0-1.0.
 * bun generators/cpt-rhodes-memorial.ts
 *
 * Frame: built turned to the memorial's axis, BEARING 96.4: +y runs down
 * the axis from the temple to the Physical Energy statue (east, downhill),
 * +x to its right (south), z up, metres. Origin = centroid of the OSM
 * outline way/1290642871 (the temple), at the level of the paved lower
 * terrace where the statue's plinth and the bottom flights stand (z = 0).
 *
 * Sir Herbert Baker's granite memorial on the slope below Devil's Peak: a
 * U-shaped Doric temple (two tall colonnaded pavilions either side of a
 * lower colonnade with Rhodes's bust in the back wall) at the top of a wide
 * monumental stair of 49 steps in five flights, flanked by eight bronze
 * lions (J. M. Swan) on granite pedestals, with G. F. Watts's bronze
 * equestrian "Physical Energy" on a tall granite plinth at the foot.
 *
 * Identity, in order: the pale granite temple with its two colonnaded
 * pavilions and the lower colonnade between; the long stepped stair below
 * it; the pairs of dark bronze lions on pedestals either side; the
 * horseman on his plinth at the bottom. Columns are drawn a little fatter
 * than real and the lions and horseman as bold blocks, so they hold at 80 px.
 *
 * Evidence
 *  - OSM way/1290642871 (building=yes, building:material=stone): the temple
 *    U, 28.2 m across, 16 m deep, wings 8.7 m wide, open courtyard 11 m wide
 *    and 8.1 m deep. Anchor = its centroid; bearing 96.4 = the axis through
 *    the courtyard, the four pairs of lion nodes and the statue node
 *    (building edges 96.1°). Replaces that way only.
 *  - OSM nodes (tourism=artwork, artwork_type=statue): eight lions in pairs
 *    6.5 m either side of the axis, 16.2, 25.2, 33.9 and 44.5 m down it from
 *    the anchor; Physical Energy (node/11966432426) on the axis 44.9 m down.
 *    OSM steps way/4316920 runs the axis from the courtyard to a landing
 *    36.2 m down, then splits either side of the plinth (way/1290642865,
 *    1290642866) to the lower terrace at 46 m; the stone area
 *    way/1290642872 gives the stair 14.5 m between its outer walls and the
 *    plinth's front at 47.1 m. The lower terrace (way/1290642864, its
 *    retaining wall way/1290642869) is the map's paving and is not modelled.
 *  - Published (Wikipedia, "Rhodes Memorial"): Herbert Baker, 1912, Cape
 *    granite quarried on Table Mountain and bronze; 49 steps, one for each
 *    year of Rhodes's life, from a semicircular terrace; a U-shaped temple
 *    of columns; eight bronze lions by J. M. Swan flanking the steps; the
 *    bust by Swan; Physical Energy by G. F. Watts at the foot.
 *  - Heights estimated (no published section; no lidar or NAIP in South
 *    Africa): the 49 steps at about 0.165 m give the 8.0 m rise from the
 *    lower terrace to the courtyard, split into flights of 8, 10, 11, 11
 *    and 9 steps between the landings the lion pairs stand at (SkyPixels'
 *    elevated view 2 along the axis, JasonSmuts' aerial). The temple from
 *    Samir's level view up the axis, scaled to OSM's 8.7 m wing front:
 *    wing podium top 9.8 m, Doric columns 5.2 m, entablature to 16.9 m; the
 *    centre colonnade on the courtyard, columns 4.5 m, entablature to
 *    14.4 m (lower than the wings in every view). Statue plinth 4.0 m,
 *    lion pedestals 1.3 m above the landing above them, the horseman about
 *    4.4 m
 *    (from the elevated views; Watts's bronze size not found).
 *  - Column counts from the photos: four across each pavilion front, three
 *    more down each courtyard side, six down each outer side; six in the
 *    centre colonnade.
 *  - Slope: the stair climbs the hill, so the temple and the upper flights
 *    stand on solid granite walls that run down to z = 0 on the uphill side
 *    and sink into the hill (STYLE.md "Ground"). The map's terrain
 *    (Mapterhorn) has no z15 tiles here; tools/terrain.ts 404s, so how
 *    much of that base the map's hill hides is not checked. elevation 0.
 *  - Colours from daylight photos: pale grey granite, a deeper grey for
 *    the shaded walls behind the columns, roof grey for the flat temple
 *    roofs (never seen; assumed), dark green-black bronze for the lions and
 *    the horseman (pulled to the palette's charcoal floor).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Cecil Rhodes Memorial Elevated View 2.jpg, SkyPixels, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Cecil_Rhodes_Memorial_Elevated_View_2.jpg
 *  - Cecil Rhodes Memorial Elevated View 1.jpg, SkyPixels, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Cecil_Rhodes_Memorial_Elevated_View_1.jpg
 *  - Rhodes memorial in Cape Town, South Africa, aerial photograph (cropped
 *    N.1).jpg, JasonSmuts, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Rhodes_memorial_in_Cape_Town,_South_Africa,_aerial_photograph_(cropped_N.1).jpg
 *  - Rhodes Memorial Cape Town.jpg, Samir insta, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Rhodes_Memorial_Cape_Town.jpg
 *  - Rhodes Memorial, Cape Town (South Africa).jpg, Olga Ernst, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Rhodes_Memorial,_Cape_Town_(South_Africa).jpg
 *  - Rhodes Memorial, Cape Town.jpg, Steven Morrow, CC BY-SA 3.0,
 *    https://commons.wikimedia.org/wiki/File:Rhodes_Memorial,_Cape_Town.jpg
 *  - Rhodes Memorial (11209962564).jpg, Darren Glanville, CC BY-SA 2.0,
 *    https://commons.wikimedia.org/wiki/File:Rhodes_Memorial_(11209962564).jpg
 *  - Energy. Rhodes Memorial Cape Town.jpg, Andrew Massyn, public domain,
 *    https://commons.wikimedia.org/wiki/File:Energy._Rhodes_Memorial_Cape_Town.jpg
 * Look-only references: none. No commercial imagery.
 *
 * Doubts: every height is photo-estimated; the back of the temple and the
 * pavilions' outer sides are seen only obliquely (column counts there are
 * estimated); the flat roofs are assumed; which way the horseman faces is
 * taken as east, down the stair, from Massyn's profile (the lion beyond,
 * which faces down the stair, faces the same way), and his size is estimated.
 * Night: the granite carries a floodlight mask (the memorial is lit from
 * below); no night photo was checked.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, walls, cap, lathe, rect, chamfer, inset, type XY } from './chi-aon-center'
import { face } from './phl-independence-hall'

const BEARING = 96.4
const ANCHOR: [number, number] = [-33.952356, 18.4589723]

const granite = new Part(), shade = new Part(), roof = new Part(), bronze = new Part()

/** A box with chamfered vertical edges and a bevelled top. */
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, ch = 0.15, top: Part | null = p) {
  const r = ch > 0.09 ? chamfer(rect(x0, y0, x1, y1), Math.min(ch, (x1 - x0) / 3, (y1 - y0) / 3)) : rect(x0, y0, x1, y1)
  const b = Math.min(ch, (z1 - z0) / 3)
  if (b <= 0) { walls(p, r, z0, z1); if (top) cap(top, r, z1); return }
  const i = inset(r, b)
  walls(p, r, z0, z1 - b)
  walls(p, r, z1 - b, z1, i)
  if (top) cap(top, i, z1)
}
/** An oriented box: centre c, unit axes u, v, w, half sizes a, b, h. */
function obox(p: Part, c: V3, u: V3, v: V3, w: V3, a: number, b: number, h: number) {
  const P = (i: number, j: number, k: number): V3 => [0, 1, 2].map((q) => c[q] + u[q] * a * i + v[q] * b * j + w[q] * h * k) as V3
  face(p, [P(1, -1, -1), P(1, 1, -1), P(1, 1, 1), P(1, -1, 1)], u)
  face(p, [P(-1, -1, -1), P(-1, 1, -1), P(-1, 1, 1), P(-1, -1, 1)], u.map((x) => -x) as V3)
  face(p, [P(-1, 1, -1), P(1, 1, -1), P(1, 1, 1), P(-1, 1, 1)], v)
  face(p, [P(-1, -1, -1), P(1, -1, -1), P(1, -1, 1), P(-1, -1, 1)], v.map((x) => -x) as V3)
  face(p, [P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1)], w)
  face(p, [P(-1, -1, -1), P(1, -1, -1), P(1, 1, -1), P(-1, 1, -1)], w.map((x) => -x) as V3)
}
/** A Doric column: tapering shaft, echinus, square abacus. */
function column(x: number, y: number, z0: number, z1: number, d: number) {
  const cap0 = z1 - 0.45
  lathe(granite, x, y, [[d / 2, z0], [d / 2 * 0.86, cap0], [d / 2 * 1.15, cap0 + 0.2]], 8, Math.PI / 8)
  box(granite, x - d * 0.62, y - d * 0.62, x + d * 0.62, y + d * 0.62, cap0 + 0.2, z1, 0, null)
}

// --- The stair: flights and landings along the axis ---
// (y where a segment starts, the z it climbs to, steps in it); from the bottom up.
const W = 5.5 // half-width of the flights between the cheek walls
type Seg = { y0: number; y1: number; z0: number; z1: number; n: number }
const segs: Seg[] = []
{
  const plan: [number, number, number][] = [ // [y top of flight, steps, rise]; landings fill between
    [42.0, 8, 1.3], [30.5, 10, 1.6], [21.5, 11, 1.75], [12.0, 11, 1.75], [5.3, 9, 1.6],
  ]
  const starts = [46.1, 36.5, 27.5, 18.5, 9.3]
  let z = 0
  plan.forEach(([yTop, n, rise], i) => {
    segs.push({ y0: starts[i], y1: yTop, z0: z, z1: z + rise, n })
    z += rise
  })
}
const Z_COURT = segs[segs.length - 1].z1 // 8.0
/** Draw a flight's treads and risers across [xa, xb], filled solid beneath. */
function flight(s: Seg, xa: number, xb: number) {
  const run = (s.y0 - s.y1) / s.n, rise = (s.z1 - s.z0) / s.n
  for (let k = 0; k < s.n; k++) {
    const yF = s.y0 - k * run, zB = s.z0 + k * rise, zT = zB + rise
    granite.quad([xb, yF, zB], [xa, yF, zB], [xa, yF, zT], [xb, yF, zT]) // riser faces +y
    granite.quad([xa, yF, zT], [xb, yF, zT], [xb, yF - run, zT], [xa, yF - run, zT]) // tread
  }
}
// bottom flights either side of the statue plinth, the rest full width
flight(segs[0], -W, -1.6)
flight(segs[0], 1.6, W)
for (const s of segs.slice(1)) flight(s, -W, W)
// landings, the courtyard floor and the solid fill's ends
const landing = (ya: number, yb: number, z: number) => granite.quad([-W, ya, z], [W, ya, z], [W, yb, z], [-W, yb, z])
landing(segs[0].y1, segs[1].y0, segs[0].z1)
landing(segs[1].y1, segs[2].y0, segs[1].z1)
landing(segs[2].y1, segs[3].y0, segs[2].z1)
landing(segs[3].y1, segs[4].y0, segs[3].z1)
landing(segs[4].y1, 0.9, Z_COURT)
// landing fronts: the riser face of each landing's front edge down to the flight below is covered by
// the flights' own risers; each flight's first riser starts at its landing, so the mass is closed.

// cheek walls, stepping with the flights, and the lion pedestals
const LIONS: [number, number][] = [[44.5, segs[0].z1], [33.9, segs[1].z1], [25.2, segs[2].z1], [16.2, segs[3].z1]] // y, landing above
const PED_TOP = LIONS.map(([, z]) => z + 1.3)
for (const sgn of [-1, 1]) {
  const xa = sgn > 0 ? W : -7.6, xb = sgn > 0 ? 7.6 : -W
  // wall runs between pedestals; top 0.55 above the landing at its upper end
  const runs: [number, number, number][] = [
    [segs[0].y0 - 1.6, 36.5, segs[0].z1 + 0.55],
    [36.5 - 0.0, 27.5, segs[1].z1 + 0.55],
    [27.5, 18.5, segs[2].z1 + 0.55],
    [18.5, 9.3, segs[3].z1 + 0.55],
  ]
  for (const [ya, yb, zt] of runs) box(granite, xa, yb, xb, ya, 0, zt, 0.12)
  LIONS.forEach(([y], i) => {
    const px0 = sgn > 0 ? 5.35 : -7.75, px1 = sgn > 0 ? 7.75 : -5.35
    const y0 = y - 1.7, y1 = Math.min(y + 1.7, 47.1)
    box(granite, px0, y0, px1, y1, 0, PED_TOP[i] - 0.35, 0.12)
    box(granite, px0 - 0.12, y0 - 0.12, px1 + 0.12, y1 + 0.12, PED_TOP[i] - 0.35, PED_TOP[i], 0.1) // capping
    lion(sgn * 6.55, y - 0.4, PED_TOP[i])
  })
}

/** A couchant bronze lion facing down the stair (+y), as bold blocks. */
function lion(x: number, y: number, z: number) {
  box(bronze, x - 0.55, y - 1.7, x + 0.55, y + 0.5, z, z + 0.8, 0.08) // body
  box(bronze, x - 0.62, y + 0.2, x + 0.62, y + 1.0, z, z + 1.15, 0.08) // chest and mane, upright
  box(bronze, x - 0.42, y + 0.7, x + 0.42, y + 1.45, z + 0.75, z + 1.4, 0.08) // head
  for (const s of [-1, 1]) box(bronze, Math.min(x + s * 0.12, x + s * 0.5), y + 0.9, Math.max(x + s * 0.12, x + s * 0.5), y + 1.95, z, z + 0.32, 0) // forepaws
}

// --- Physical Energy on its plinth ---
const PL_Y0 = 41.6, PL_Y1 = 47.1, PL_X = 1.55, PL_Z = 4.0
box(granite, -PL_X, PL_Y0, PL_X, PL_Y1, 0, 0.5, 0.1)
box(granite, -PL_X + 0.15, PL_Y0 + 0.15, PL_X - 0.15, PL_Y1 - 0.15, 0.5, PL_Z - 0.35, 0.12)
box(granite, -PL_X, PL_Y0, PL_X, PL_Y1, PL_Z - 0.35, PL_Z, 0.1)
{
  // horse and rider facing east, down the stair (+y), as in Massyn's profile (the lions
  // beyond face the same way); bold blocks; local u forward, v left, w up
  const c0: V3 = [0, 44.35, PL_Z]
  const fwd: V3 = [0, 1, 0], side: V3 = [-1, 0, 0], up: V3 = [0, 0, 1]
  const at = (u: number, v: number, w: number): V3 => [c0[0] + fwd[0] * u + side[0] * v, c0[1] + fwd[1] * u + side[1] * v, c0[2] + w]
  const tilt = (deg: number) => { const t = (deg * Math.PI) / 180; return { u: [fwd[0] * Math.cos(t), fwd[1] * Math.cos(t), Math.sin(t)] as V3, w: [-fwd[0] * Math.sin(t), -fwd[1] * Math.sin(t), Math.cos(t)] as V3 } }
  box(bronze, -0.75, 44.35 - 1.6, 0.75, 44.35 + 1.6, PL_Z, PL_Z + 0.2, 0) // bronze ground slab (u runs -x)
  const s = 1.45 // scale: the group stands about 4.4 m on its plinth
  for (const v of [-0.28, 0.28]) obox(bronze, at(-0.95 * s, v * s, 0.75 * s + 0.2), fwd, side, up, 0.16 * s, 0.13 * s, 0.75 * s) // hind legs
  obox(bronze, at(0.75 * s, 0.25 * s, 0.75 * s + 0.2), fwd, side, up, 0.15 * s, 0.12 * s, 0.75 * s) // planted foreleg
  { const t = tilt(-40); obox(bronze, at(1.25 * s, -0.25 * s, 1.45 * s), t.u, side, t.w, 0.4 * s, 0.12 * s, 0.13 * s) } // raised foreleg
  { const t = tilt(14); obox(bronze, at(0, 0, 1.8 * s), t.u, side, t.w, 1.25 * s, 0.38 * s, 0.42 * s) } // barrel
  { const t = tilt(55); obox(bronze, at(1.15 * s, 0, 2.45 * s), t.u, side, t.w, 0.55 * s, 0.24 * s, 0.3 * s) } // neck
  { const t = tilt(-30); obox(bronze, at(1.55 * s, 0, 2.9 * s), t.u, side, t.w, 0.38 * s, 0.17 * s, 0.17 * s) } // head
  { const t = tilt(-60); obox(bronze, at(-1.35 * s, 0, 1.6 * s), t.u, side, t.w, 0.35 * s, 0.1 * s, 0.1 * s) } // tail
  // rider: leaning back, left hand raised to shade his eyes
  { const t = tilt(-12); obox(bronze, at(-0.05 * s, 0, 2.75 * s), t.u, side, t.w, 0.2 * s, 0.24 * s, 0.45 * s) } // torso
  obox(bronze, at(-0.1 * s, 0, 3.35 * s), fwd, side, up, 0.15 * s, 0.13 * s, 0.16 * s) // head
  obox(bronze, at(0.12 * s, 0.22 * s, 3.3 * s), fwd, side, up, 0.2 * s, 0.07 * s, 0.07 * s) // shading arm
  for (const v of [-0.4, 0.4]) obox(bronze, at(0.1 * s, v * s, 2.05 * s), fwd, side, up, 0.14 * s, 0.08 * s, 0.4 * s) // legs
}

// --- The temple ---
const Y_BACK = -7.05, Y_FRONT = 9.0, XI = 5.45, XO = 14.1
const WING_POD = 9.8, WING_COL = 15.0, WING_TOP = 16.9
const C_STY = Z_COURT + 0.3, C_COL = 12.8, C_TOP = 14.4
const floodTop = 0
void floodTop
for (const sgn of [-1, 1]) {
  const x0 = sgn > 0 ? XI : -XO, x1 = sgn > 0 ? XO : -XI
  // podium, rusticated base with a cornice band, then the stylobate
  box(granite, x0, Y_BACK, x1, Y_FRONT, 0, WING_POD - 0.5, 0.15)
  box(granite, x0 - 0.15, Y_BACK - 0.15, x1 + 0.15, Y_FRONT + 0.15, WING_POD - 0.5, WING_POD, 0.12)
  // cella, set back behind the colonnades, in the shaded grey
  const cx0 = sgn > 0 ? XI + 1.9 : -XO + 1.9, cx1 = sgn > 0 ? XO - 1.9 : -XI - 1.9
  box(shade, cx0, Y_BACK + 0.4, cx1, Y_FRONT - 1.9, WING_POD, WING_COL, 0.05, null)
  // columns: front row of four, three more down the courtyard side, five more down the outer side
  const xIn = sgn > 0 ? XI + 0.85 : -XI - 0.85, xOut = sgn > 0 ? XO - 0.85 : -XO + 0.85
  const yF = Y_FRONT - 0.85
  for (let k = 0; k < 4; k++) column(xIn + ((xOut - xIn) * k) / 3, yF, WING_POD, WING_COL, 1.0)
  for (const y of [yF - 2.55, yF - 5.1, yF - 7.65]) column(xIn, y, WING_POD, WING_COL, 1.0)
  for (let k = 1; k <= 5; k++) column(xOut, yF - k * 2.75, WING_POD, WING_COL, 1.0)
  // the back of the wing is walled where it meets the centre (the shaded wall stands behind the inner columns there)
  box(shade, sgn > 0 ? XI : -XI - 1.6, Y_BACK, sgn > 0 ? XI + 1.6 : -XI, yF - 7.65 - 1.0, WING_POD, WING_COL, 0.05, null)
  // entablature with a cornice, flat roof
  box(granite, x0 - 0.1, Y_BACK - 0.1, x1 + 0.1, Y_FRONT + 0.1, WING_COL, WING_TOP - 0.5, 0.06, null)
  box(granite, x0 - 0.35, Y_BACK - 0.35, x1 + 0.35, Y_FRONT + 0.35, WING_TOP - 0.5, WING_TOP - 0.2, 0.08, null)
  box(granite, x0 - 0.15, Y_BACK - 0.15, x1 + 0.15, Y_FRONT + 0.15, WING_TOP - 0.2, WING_TOP, 0.1, roof)
  // ceiling under the entablature, seen from below between columns
  cap(granite, rect(x0 - 0.1, Y_BACK - 0.1, x1 + 0.1, Y_FRONT + 0.1).reverse(), WING_COL)
}
// centre: a solid block behind (its back sinks into the hill), the colonnade on the courtyard
box(granite, -XI, Y_BACK, XI, -1.3, 0, C_STY, 0.1)
box(shade, -XI, Y_BACK, XI, -1.3, C_STY, C_COL, 0.02, null)
box(granite, -XI, -1.3, XI, 0.9, Z_COURT, C_STY, 0.08) // stylobate step
for (let k = 0; k < 6; k++) column(-4.55 + k * 1.82, -0.15, C_STY, C_COL, 0.85)
box(granite, -XI - 0.05, Y_BACK, XI + 0.05, 1.0, C_COL, C_TOP - 0.4, 0.05, null)
box(granite, -XI - 0.05, Y_BACK - 0.25, XI + 0.05, 1.25, C_TOP - 0.4, C_TOP, 0.08, roof)
cap(granite, rect(-XI, -1.3, XI, 1.0).reverse(), C_COL)
// the niche with the bust, a dark recess in the back wall
face(bronze, [[-0.7, -1.27, C_STY + 0.8], [0.7, -1.27, C_STY + 0.8], [0.7, -1.27, C_STY + 3.0], [-0.7, -1.27, C_STY + 3.0]], [0, 1, 0])
for (let k = 0; k < 8; k++) {
  const a0 = (k / 8) * Math.PI, a1 = ((k + 1) / 8) * Math.PI
  face(bronze, [[0, -1.27, C_STY + 3.0], [0.7 * Math.cos(a0), -1.27, C_STY + 3.0 + 0.7 * Math.sin(a0)], [0.7 * Math.cos(a1), -1.27, C_STY + 3.0 + 0.7 * Math.sin(a1)]], [0, 1, 0])
}
// the courtyard's side walls below the wings' stylobate face the courtyard as podium walls (part of the wing boxes)

const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : p[2] > Z_COURT ? 0.9 : 0.6)
await save('cpt-rhodes-memorial', 'Rhodes Memorial', ANCHOR, BEARING, [
  { part: granite, material: { ...finish('cape-granite', 0xdcd7cd), floodlight: flood } as any },
  { part: shade, material: { ...finish('granite-shade', 0xaaa59b), floodlight: flood } as any },
  { part: roof, material: PALETTE.roof },
  { part: bronze, material: finish('lion-bronze', 0x4f5a54) },
], 6500)
