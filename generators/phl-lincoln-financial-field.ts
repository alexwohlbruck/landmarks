/**
 * Lincoln Financial Field, Philadelphia (NFL, Philadelphia Eagles; 2003,
 * NBBJ with Agoos Lovera) — procedural, CC0-1.0, no textures.
 * bun generators/phl-lincoln-financial-field.ts
 *
 * Map frame: x across the field (east sideline +x), y along it towards the
 * north end zone, z up, metres. Placed at bearing 351°, the field's long
 * axis (OSM inner ring way/172058912, minimum-area rectangle 171°/351°).
 * The anchor is the area centroid of the stadium outline (building=stadium
 * relation/2294758, outer way/32891768): -75.167523, 39.900800. The bowl is
 * centred on the field, C = (2, -1) in this frame (lidar).
 *
 * z = 0 is the field. The lidar puts the field 1.0 m below the parking lots
 * round the stadium (Mapterhorn agrees, 1.0-1.5 m); that is within the map
 * terrain's error, so `elevation` is 0 and the outer walls start at the
 * field's level. The pitch itself is the map's (STYLE.md, "Don't model the
 * ground"): the model is the bowl, its stands, roofs and towers.
 *
 * What makes it read as itself, from the photos: the two long wing-shaped
 * canopies over the east and west stands, pale on top, held on exposed dark
 * steel masts and ribs that rise above the roof ("wing like canopies above
 * the east and west stands", Wikipedia); the open corners, where the bowl
 * drops to the lower tier and the steel stair frames show; the three tiers
 * of midnight-green seats on the sidelines (lower bowl, club deck, upper
 * deck, with glazed suite bands between them); the end-zone upper decks
 * over the two video boards; the dark lattice wall of the south end on
 * I-95; the glass sideline walls between orange brick piers; the grey
 * east tower.
 *
 * Evidence
 * - OSM: outline relation/2294758 (outer way/32891768, field ring
 *   way/172058912). The solar-panel roofs relation/15668151 nearby are over
 *   a parking lot, not the stadium, and are not replaced.
 * - Measured, lidar: USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown
 *   2015, after the 2013-14 renovation), 1 m grid sampled in this frame
 *   (all heights above the field, which is 1.6 m above the box's lowest
 *   ground):
 *   - field wall 37 m either side of the centre line, 63-64 m to the ends;
 *   - lower bowl rising to 7-9 m: 66 m out at the 50-yard line, curving in
 *     to 51 m at the corners; 93 m to the north, 96 m to the south;
 *   - sidelines: club deck 15-21 m, its front 66 m out at midfield; suite
 *     band to 29 m; upper deck from 79 m out (curving in to 67 m at the
 *     ends), hidden by the canopy from 89 m;
 *   - canopies: top 53 m (55-56 m on the steel), one roof covering most
 *     of the upper deck: inner edge 84-90 m out at midfield, 80-86 m at
 *     60 m along and 76-82 m at 100 m; outer edge 106-112 m at midfield,
 *     98-104 m at 60 m and 88-92 m at 100 m; running from 118 m south to
 *     117 m north of the centre;
 *   - north end: deck from 22 m (95 m out) to 35 m (113 m), a 38-44 m
 *     band of lamps along its back, a 28-30 m terrace to 127 m;
 *   - south end: deck from 20 m (98 m out) to 40 m (119 m), the lattice
 *     wall 30-33 m high at 121-133 m, running further west than east;
 *   - corner and outer blocks: the east tower (110-130 m out, v -15..35,
 *     38 m), west stair and service blocks (28-38 m), the north-east stair
 *     frame (29 m), the north-west sign tower (67 m).
 * - Measured, USGS NAIP orthophoto (2022, 0.42 m): plan of the canopies,
 *   the bowl and the corner blocks; canopy tops white-grey (solar panels).
 * - Published (Wikipedia, "Lincoln Financial Field"): opened 2003; NBBJ;
 *   wing-like canopies; brick facade with exposed steel; the eagle logo in
 *   the dark green upper-deck seats; video boards 192 x 27 ft (north) and
 *   160 x 27 ft (south), from the 2013-14 renovation.
 * - Photos (Wikimedia Commons):
 *   Ron Reiring, "Lincoln Financial Field (Aerial view)" (CC BY 2.0,
 *     from the south over I-95)
 *     https://commons.wikimedia.org/wiki/File:Lincoln_Financial_Field_(Aerial_view).jpg
 *   Dough4872, "Lincoln Financial Field, Philadelphia, Pennsylvania, United
 *     States" (CC BY-SA 4.0, aerial from the south-south-west)
 *     https://commons.wikimedia.org/wiki/File:Lincoln_Financial_Field,_Philadelphia,_Pennsylvania,_United_States.jpg
 *   Dough4872, "Lincoln Financial Field and Wells Fargo Center from airplane
 *     approaching PHL" (CC BY-SA 4.0, aerial from the south-west)
 *     https://commons.wikimedia.org/wiki/File:Lincoln_Financial_Field_and_Wells_Fargo_Center_from_airplane_approaching_PHL.jpeg
 *   JJonahJackalope, "Lincoln Financial Field, Philadelphia, 2024" (CC BY-SA
 *     4.0, inside: tiers, end-zone boards, seat colour)
 *     https://commons.wikimedia.org/wiki/File:Lincoln_Financial_Field,_Philadelphia,_2024.jpg
 *   Betp (fr.wikipedia), "Lincoln Financial Field, Philadelphia" (CC BY-SA
 *     3.0, inside, sideline tiers)
 *     https://commons.wikimedia.org/wiki/File:Lincoln_Financial_Field,_Philadelphia.jpg
 *   Sp. Union-Rail, "TheLinc-outside" (CC BY 3.0, the east canopy and
 *     south wall from I-95)
 *     https://commons.wikimedia.org/wiki/File:TheLinc-outside.jpg
 *   Андрей Бобровский, "South Philadelphia East, Philadelphia, PA, USA -
 *     panoramio" (3), (4), (13), (19) (CC BY 3.0, east side, east tower,
 *     north end, corner stair frames)
 *     https://commons.wikimedia.org/wiki/File:South_Philadelphia_East,_Philadelphia,_PA,_USA_-_panoramio_(4).jpg
 *   Justin Wolfe, "Lincoln Financial Field during 2011 Temple-Penn State
 *     game" (CC BY 2.0, inside, the end-zone board's position)
 *     https://commons.wikimedia.org/wiki/File:Lincoln_Financial_Field_during_2011_Temple-Penn_State_game.jpg
 *   NASA, "South Philadelphia Sports Complex" (public domain, satellite)
 *     https://commons.wikimedia.org/wiki/File:South_Philadelphia_Sports_Complex.jpg
 * Estimated: everything under the canopies (the upper deck's back at
 * 102 m and 47 m, the outer wall at 104 m), the glass wall's height (24 m)
 * and the brick piers' spacing (9 m) from the panoramio photos; the masts'
 * spacing (18 m) and the ribs' size; the boards' height on the end faces
 * (from the 2011 and 2024 photos); the canopy's thickness. The corner blocks
 * are boxes at their lidar heights. Left out: the lamp poles on the end
 * decks, the eagle pattern in the seats, lettering, the field.
 * Doubts: the canopy tips look upswept from street level, but the lidar
 * has them 1-2 m lower than the middle, so the model follows the lidar.
 * No photo shows the west outer wall up close; it mirrors the east.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { quad, box, triangulate, loftSections, rayHit, type XY, type SectionPt } from './dc-nationals-park'

// ---------------------------------------------------------------------------
// Helpers shared with phl-citizens-bank-park.ts and phl-xfinity-mobile-arena.ts.

const unit = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/**
 * Loft a cross-section along a path. `rows[k]` holds the same section's
 * points at the k-th station; edge i (point i to i+1) is drawn in
 * `parts[i]` (null skips it), facing `hint(i, k)`.
 */
export function stripLoft(rows: V3[][], parts: (Part | null)[], hint: (i: number, k: number) => V3) {
  for (let k = 0; k < rows.length - 1; k++)
    for (let i = 0; i < rows[k].length - 1; i++) {
      const p = parts[i]
      if (!p) continue
      quad(p, [rows[k][i], rows[k + 1][i], rows[k + 1][i + 1], rows[k][i + 1]], hint(i, k))
    }
}

/** Close a lofted section with a flat cap, triangulated in its own (a, b) coordinates. */
export function sectionCap(p: Part, pts: V3[], flat: XY[], n: V3) {
  for (const [a, b, c] of triangulate(flat)) quad(p, [pts[a], pts[b], pts[c], pts[c]], n)
}

/** A panel just proud of a vertical face from a to b (plan points), between t0..t1 along it and z0..z1. */
export function facePanel(p: Part, a: XY, b: XY, out: XY, t0: number, t1: number, z0: number, z1: number, d = 0.06) {
  const P = (t: number, z: number): V3 => [a[0] + (b[0] - a[0]) * t + out[0] * d, a[1] + (b[1] - a[1]) * t + out[1] * d, z]
  quad(p, [P(t0, z0), P(t1, z0), P(t1, z1), P(t0, z1)], [out[0], out[1], 0])
}

/** A box between two points (a beam or a mast), w wide and h deep. */
export function beam(p: Part, a: V3, b: V3, w: number, h: number) {
  const ax = unit(sub(b, a))
  const up: V3 = Math.abs(ax[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const s = unit(cross(ax, up)), t = unit(cross(s, ax))
  const c: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]
  box(p, c, [s, t, ax], [w / 2, h / 2, Math.hypot(...sub(b, a)) / 2], true)
}

export async function save(id: string, name: string, parts: { part: Part; material: { name: string; color: number; roughness?: number } }[], extras: Record<string, unknown>, maxTris = 5000) {
  const tris = parts.reduce((s, { part }) => s + part.triangles, 0)
  for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
  if (tris > maxTris) throw new Error(`Triangle budget exceeded: ${tris}`)
  const glb = writeGlb(name, parts.filter((p) => p.part.triangles > 0), { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...extras })
  if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}

// ---------------------------------------------------------------------------
// Lincoln Financial Field.

function build() {
  const seats = new Part(), conc = new Part(), steel = new Part(), top = new Part(), glass = new Part(), brick = new Part()
  const C: XY = [2, -1]
  const at = (u: number, v: number, z: number): V3 => [C[0] + u, C[1] + v, z]

  // Rings about C, in (u, v).
  const se = (A: number, Bn: number, Bs: number, n: number) => (a: number) => {
    const s = Math.sin((a * Math.PI) / 180), c = Math.cos((a * Math.PI) / 180)
    const B = c >= 0 ? Bn : Bs
    return (Math.abs(s / A) ** n + Math.abs(c / B) ** n) ** (-1 / n)
  }
  const R0 = se(37, 63, 64, 4) // the field wall
  const clubFront = (v: number) => 66 - 15 * (v / 80) ** 2
  // The lower bowl's top: the sideline club fronts, the end-zone faces and
  // chamfered corners between them.
  const r1: XY[] = []
  for (let v = -80; v <= 80; v += 10) r1.push([clubFront(v), v])
  r1.push([40, 93], [-40, 93])
  for (let v = 80; v >= -80; v -= 10) r1.push([-clubFront(v), v])
  r1.push([-45, -96], [45, -96])
  const RO: XY[] = [[106, -110], [106, 105], [75, 128], [-75, 128], [-106, 105], [-106, -110], [-80, -133], [80, -133]]
  const dirOf = (a: number): XY => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]
  const R1 = (a: number) => rayHit(r1, [0, 0], dirOf(a))
  const Rout = (a: number) => rayHit(RO, [0, 0], dirOf(a))

  // The lower bowl all round, and the concourse podium behind it out to the
  // outer wall: field wall, seats, the 8 m concourse, the outer wall.
  {
    const angles: number[] = []
    for (let a = 0; a <= 360; a += 5) angles.push(a)
    loftSections(C, angles, angles.map((a): SectionPt[] => [
      { r: R0(a), z: 0, part: conc },
      { r: R0(a), z: 1.2, part: seats },
      { r: R0(a) + (R1(a) - R0(a)) * 0.58, z: 5.2, part: conc }, // cross aisle
      { r: R0(a) + (R1(a) - R0(a)) * 0.58 + 1.8, z: 5.2, part: seats },
      { r: R1(a), z: 8, part: conc },
      { r: Rout(a), z: 8, part: steel }, // the concourse's outer wall, glass and dark steel
      { r: Rout(a), z: 0, part: null },
    ]), null)
  }

  // The sideline stands, east (s = 1) and west (s = -1): suite band, club
  // deck, suite band, upper deck, the outer wall. Straight in plan at the
  // back, their fronts curving in towards the corners (lidar).
  // Each section point is [u, z, half length]: the stands' ends are cut on
  // the diagonal, longer at the back, as the corners chamfer (NAIP).
  const upFront = (v: number) => 79 - 12 * (v / 80) ** 4
  const NV = 12
  const ts: number[] = []
  for (let k = 0; k <= NV; k++) ts.push(-1 + (2 * k) / NV)
  const sideSec = (t: number): [number, number, number][] => {
    const P = (u: (v: number) => number, z: number, L: number): [number, number, number] => [u(t * L), z, t * L]
    return [
      P(clubFront, 7.5, 80), P(clubFront, 15.5, 80), // suite band
      P((v) => upFront(v) - 1.5, 21, 84), P((v) => upFront(v) - 1, 21, 84), P((v) => upFront(v) - 1, 28.5, 84), P(upFront, 29, 86), // club deck, suites
      P(() => 102, 47, 97), P(() => 102, 50, 97), P(() => 104, 50, 98), // upper deck, its back up into the canopy
      P(() => 104, 24, 98), P(() => 104, 0, 98), // the outer wall: the deck's grey underside over glass
    ]
  }
  const sideParts = [conc, seats, conc, conc, conc, seats, conc, conc, conc, glass]
  for (const s of [1, -1]) {
    const rows = ts.map((t) => sideSec(t).map(([u, z, v]) => at(s * u, v, z)))
    stripLoft(rows, sideParts, (i, k) => {
      const a = sideSec(ts[k])[i], b = sideSec(ts[k])[i + 1]
      return [-(b[1] - a[1]) * s, 0, b[0] - a[0]]
    })
    for (const t of [-1, 1]) {
      const sec = sideSec(t)
      sectionCap(conc, sec.map(([u, z, v]) => at(s * u, v, z)), sec.map(([u, z]) => [u, z] as XY), [0, t, 0])
    }
    const vs = ts.map((t) => t * 80)
    // Glazed suite bands on the two vertical faces, broken at the aisles.
    for (let k = 0; k < vs.length - 1; k++) {
      const v0 = vs[k] + 0.8, v1 = vs[k + 1] - 0.8
      for (const [f, z0, z1] of [[clubFront, 9.5, 14.5], [(v: number) => upFront(v) - 1, 23, 27.5]] as [(v: number) => number, number, number][]) {
        quad(glass, [at(s * (f(v0) - 0.06), v0, z0), at(s * (f(v1) - 0.06), v1, z0), at(s * (f(v1) - 0.06), v1, z1), at(s * (f(v0) - 0.06), v0, z1)], [-s, 0, 0])
      }
    }
    // Orange brick piers on the outer wall, every 9 m, up to the steel.
    for (let v = -90; v <= 90.1; v += 9) {
      box(brick, at(s * 104.6, v, 12.5), [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0.6, 1.1, 12.5])
    }
  }

  // The end-zone stands: the board face, the upper deck, its back; north
  // with a terrace behind, south with the lattice wall on I-95. Each row:
  // [distance from C, z, half width, centre offset in u].
  type Row = [number, number, number, number]
  function endStand(sgn: 1 | -1, rows: Row[], parts: (Part | null)[]) {
    const pts = (r: Row, side: -1 | 1): V3 => at(r[3] + side * r[2], sgn * r[0], r[1])
    const L0 = rows.map((r) => pts(r, -1)), L1 = rows.map((r) => pts(r, 1))
    stripLoft([L0, L1], parts, (i) => {
      const a = rows[i], b = rows[i + 1]
      return [0, -(b[1] - a[1]) * sgn, b[0] - a[0]]
    })
    // the ends, sloped where the stand widens towards its back
    for (const [side, line] of [[-1, L0], [1, L1]] as [-1 | 1, V3[]][]) {
      const flat: XY[] = rows.map((r) => [r[0], r[1]])
      sectionCap(conc, line, flat, [side, 0, 0])
    }
  }
  // North: board face at 93 m, deck 22-35 m, lamp band, terrace 29 m to 127 m.
  endStand(1, [
    [93, 7.5, 44, 10], [93, 21, 44, 10], [94.5, 22.5, 45, 10], [113, 34, 46, 6],
    [113, 38, 46, 6], [115.5, 38, 46, 6], [115.5, 29, 46, 6], [127, 29, 46, 6], [127, 0, 46, 6],
  ], [conc, conc, seats, conc, conc, conc, conc, glass])
  // South: board face at 96 m, deck 20-40 m, the lattice wall 31 m at 121-133 m.
  endStand(-1, [
    [96, 8.5, 48, 2], [96, 19.5, 48, 2], [97.5, 20.5, 50, 2], [119, 40, 60, 4],
    [121, 40, 60, 4], [121, 31, 60, 4], [133, 31, 60, 4], [133, 0, 60, 4],
  ], [conc, conc, seats, conc, steel, steel, steel])
  // The lattice wall runs on to the west past the deck, over the
  // south-west concourse.
  quad(steel, [at(-56, -133, 0), at(-86, -133, 0), at(-86, -133, 31), at(-56, -133, 31)], [0, -1, 0])
  box(steel, at(-71, -127, 15.5), [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [15, 6, 15.5])
  // Its diamond lattice: pale diagonals just proud of the dark wall.
  for (let k = -6; k <= 5; k++) {
    const u0 = k * 14 + 2
    for (const d of [1, -1]) {
      const a = at(u0, -133.5, 2), b = at(u0 + d * 14, -133.5, 29)
      if (Math.max(a[0], b[0]) > C[0] + 64 || Math.min(a[0], b[0]) < C[0] - 86) continue
      beam(top, a, b, 0.8, 0.4)
    }
  }

  // The video boards on the end faces, 192 x 27 ft (north) and 160 x 27 ft
  // (south), in steel frames.
  for (const [v, w, z0, uc] of [[93, 58.5, 11.5, 5], [-96, 48.8, 10.5, 2]] as [number, number, number, number][]) {
    const sg = Math.sign(v), f = sg * -0.4
    box(steel, at(uc, v + f, z0 + 4.1), [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [w / 2 + 0.6, 0.4, 4.7])
    quad(glass, [at(uc - w / 2, v + 2 * f - sg * 0.06, z0), at(uc + w / 2, v + 2 * f - sg * 0.06, z0), at(uc + w / 2, v + 2 * f - sg * 0.06, z0 + 8.2), at(uc - w / 2, v + 2 * f - sg * 0.06, z0 + 8.2)], [0, -sg, 0])
  }

  // North end's outer wall: glass between brick piers, as on the sidelines.
  for (let u = -36; u <= 46; u += 9) box(brick, at(u, 127.6, 12.5), [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [1.1, 0.6, 12.5])

  // The canopies: one continuous roof over each upper deck, pale on top and
  // dark steel underneath, 22 m deep at midfield (inner edge 84-90 m out,
  // outer 106-112 m in the lidar at 2 m spacing) and curving in to the
  // corners, 12 m deep at 100 m from the centre.
  const CV = 118
  const uIn = (v: number) => 85 - 8 * (v / 105) ** 2
  const uOut = (v: number) => 107 - 18 * (v / 110) ** 2
  const zIn = (v: number) => 53.5 - 2 * (v / CV) ** 2
  const zOut = (v: number) => 50 - 1 * (v / CV) ** 2
  const cv: number[] = []
  for (let k = 0; k <= 20; k++) cv.push(-CV + (2 * CV * k) / 20)
  for (const s of [1, -1]) {
    const sec = (v: number): XY[] => [
      [uIn(v), zIn(v) - 2.2], [uIn(v), zIn(v)], // fascia
      [uOut(v) - 3.5, zIn(v) - 0.5], [uOut(v), zOut(v)], // the roof: flat at 53 m across most of its depth, rolling down at the back (lidar)
      [uOut(v), zOut(v) - 1.2], [uIn(v), zIn(v) - 2.2], // back edge, underside
    ]
    const rows = cv.map((v) => sec(v).map(([u, z]) => at(s * u, v, z)))
    stripLoft(rows, [steel, top, top, steel, steel], (i, k) => {
      const a = sec(cv[k])[i], b = sec(cv[k])[i + 1]
      return [-(b[1] - a[1]) * s, 0, b[0] - a[0]]
    })
    for (const v of [-CV, CV]) {
      const q = sec(v).slice(0, 5)
      sectionCap(steel, q.map(([u, z]) => at(s * u, v, z)), q, [0, Math.sign(v), 0])
    }
    // The steel: masts outside the outer wall; ribs over the roof every
    // 12 m, high at the back and running down to the roof's front edge;
    // struts from their backs down to the masts and the stand's back; a top
    // chord along the ribs' backs.
    for (let v = -72; v <= 72.1; v += 18) {
      beam(steel, at(s * 105.6, v, 24), at(s * 105.6, v, 55), 1.4, 1.4)
    }
    const ribTop = (v: number): V3 => at(s * (uOut(v) + 0.3), v, zOut(v) + 4 - 2 * (v / CV) ** 2)
    const ribs = cv.filter((_, k) => k % 4 === 1 || k === 19)
    for (const v of ribs) {
      beam(steel, ribTop(v), at(s * (uIn(v) + 1), v, zIn(v) + 0.5), 0.6, 0.8)
      if (Math.abs(v) < 90) beam(steel, ribTop(v), at(s * 104.6, v, 30), 0.8, 0.8)
      else beam(steel, ribTop(v), at(s * (uOut(v) - 1), v, zOut(v) - 1), 0.8, 0.8)
    }
    for (let k = 0; k < ribs.length - 1; k++) beam(steel, ribTop(ribs[k]), ribTop(ribs[k + 1]), 0.9, 1.1)
  }

  // Outer blocks, at their lidar heights: the grey east tower, the west
  // stair and service blocks, the north-east stair frame, the north-west
  // sign tower.
  const blk = (p: Part, u0: number, u1: number, v0: number, v1: number, h: number) =>
    box(p, at((u0 + u1) / 2, (v0 + v1) / 2, h / 2), [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [(u1 - u0) / 2, (v1 - v0) / 2, h / 2])
  blk(conc, 106, 128, -15, 35, 38)
  quad(glass, [at(128.06, 2, 6), at(128.06, 20, 6), at(128.06, 20, 34), at(128.06, 2, 34)], [1, 0, 0]) // its glazed slot
  blk(conc, -115, -106, -82, -40, 35)
  blk(conc, -115, -106, 41, 62, 37)
  blk(steel, -115, -106, 74, 86, 28)
  blk(steel, 70, 84, 104, 128, 29)
  blk(steel, -52, -38, 104, 120, 26)
  for (const [du, dv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) beam(steel, at(-45 + du * 2.5, 112 + dv * 2.5, 26), at(-45 + du * 2.5, 112 + dv * 2.5, 60), 0.8, 0.8)
  box(steel, at(-45, 109.3, 61), [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [5, 0.5, 6], true) // the sign panel

  return [
    { part: seats, material: finish('linc-seats', 0x587773) },
    { part: conc, material: finish('linc-concrete', 0xd9d4ca) },
    { part: steel, material: finish('linc-steel', 0x4d545c) },
    { part: top, material: finish('linc-canopy', 0xe6e8e8) },
    { part: glass, material: PALETTE.window },
    { part: brick, material: finish('linc-brick', 0xb46b4e) },
  ]
}

if (import.meta.main) {
  await save('phl-lincoln-financial-field', 'Lincoln Financial Field', build(), { bearing: 351, osm: 'relation/2294758', height: 57 }, 6500)
}
