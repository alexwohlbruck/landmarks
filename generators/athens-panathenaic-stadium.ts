/**
 * Panathenaic Stadium (Kallimarmaro), Athens: original procedural geometry,
 * CC0-1.0, no textures.  bun generators/athens-panathenaic-stadium.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/athens-panathenaic-stadium.glb, the low model: the horseshoe of
 *   white marble rows as real steps two rows to a step, the diazoma, the
 *   top walk and parapet, the entrance end walls, the arena's marble wall,
 *   herms, gate posts, the arena's track and sand, and the Olympic rings;
 * - models/athens-panathenaic-stadium.detail.glb, from zoom 16: every row
 *   its own step (24 below the diazoma, 23 above), and the stairs up the
 *   aisles as half-height steps (two per row, a07), the lower and upper
 *   aisles offset as in a11/a12.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 328.5: model
 * +y runs along the arena to the open entrance end (north-north-west), the
 * sphendone (curved end) is at -y. Anchor = the area centroid of the
 * stands' outline, OSM relation/19023846 (building=stadium, outer ways
 * 763971370 + 1380117176), lng 23.7411100, lat 37.9682121. The arena's
 * axis is at x = 0.7, the sphendone's centre at y = -66.5. Axis bearing
 * from the athletics track way/1380117173 (148.5 / 328.5 deg).
 *
 * Identity, in order: the long U (horseshoe) of white Pentelic marble rows
 * with no roof; the rows as steps, split by a diazoma (walkway and wall)
 * into a lower and upper zone, with stair aisles; the sphendone; the
 * straight entrance end, where the stands stop in tall end walls with
 * parapets sloping up the rake, and the open end is closed by a sill and
 * marble gate posts; the two herms at the sphendone end of the arena; the
 * Olympic rings on their mast at the top of the sphendone.
 *
 * Evidence
 *  - OSM (measured in this frame): the stands' outline relation/19023846:
 *    outer edge x -63.9..65.6 (about +-63 about the axis), y -127.5 (the
 *    sphendone's back) to +125 (the entrance); inner edge x -19.6..21
 *    (+-20.3 about the axis), sphendone inner radius ~18-20. The
 *    leisure=stadium relation/19023844 carries wikidata Q208811. No other
 *    building lies within the model's reach.
 *  - Published: built of Pentelic marble, "the only stadium in the world
 *    built entirely of marble"; arena 204 x 34 m; 50,000 seats; reworked
 *    1869-70 (excavation, Ziller, four herms found) and 1895-96 for the
 *    first modern Olympics (en.wikipedia "Panathenaic Stadium"). Rows: "50
 *    rows" (several guides); "two landings of 23 rows ... separated by an
 *    aisle" (Foundation of the Hellenic World,
 *    https://www.fhw.gr/Olympics/modern/en/heroes/1896a1.html). Drawn: 24 +
 *    23 = 47 rows (counted roughly in a07/a12, consistent with both).
 *  - Section, ESTIMATED: rows 0.80 m deep and 0.42 m high (a07: the aisle
 *    steps, two per row, against people; and the 42 m from the OSM inner
 *    edge to the outer edge over 47 rows plus walkways); front wall 1.3 m;
 *    diazoma 3.0 m wide with a 2.0 m wall (a05, crop of the far stand);
 *    top walk 1.9 m and parapet 1.0 m. Top of the stands 23.9 m above the
 *    arena. Check: from the arena centre (a09) the sphendone's top stands
 *    20-26 m above eye level by scaling people on the podium. a03 (from
 *    the Acropolis) suggests a taller end wall, ~30+ m, but includes the
 *    fall of the ground in front and the far stand's rise; doubt.
 *  - Arena wall: 1.0 m high, 0.5 m thick, 3.3 m in front of the first row
 *    (a05, a07). Herms ~2.6 m on the sand at the sphendone end, about 14 m
 *    apart (a05, a07). Gate: six square marble posts ~3.8 m with caps and a
 *    low sill across the open end (a11, a12; the railings are left out).
 *    Olympic rings: five rings ~4 m across on a mast behind the
 *    sphendone's top, their centres ~9 m above the top walk (a11, a12).
 *  - Ground and elevation: y = 0 is the arena, at the level of the plaza
 *    at the entrance (a17: arena and plaza continuous). The stands are cut
 *    into the hills of Ardettos and Agra: the outer walls run down into
 *    the hill all round (only the entrance end walls stand free, a08).
 *    Mapterhorn has only z12 here (a 30 m grid). It shows the trough but
 *    smooths the hills into the arena: along the axis the floor reads
 *    0.3 m over the plaza at the entrance, ~2 m in the middle, 3-6 m under
 *    the track off the axis, and 6-8 m round the sphendone's end (`terrain.ts
 *    grid ... 140 10 --bearing 328.5 --zoom 12`). With elevation 0 the map
 *    drew grass over the whole arena and buried the lowest rows by up to
 *    6.9 m (10,400 of 22,300 m2 of tops). The real arena is flat (a09,
 *    a07), so the model stays flat and is fitted to this terrain whole:
 *    catalog elevation 4 m lifts it clear of the smoothed floor along the
 *    straight, and the outer walls, the entrance end walls and the open
 *    end's face run down to y = SKIRT (-4) so that nothing stands off the
 *    drawn plaza, which is ~3.4 m below the raised arena there (the face
 *    reads as a plinth; the real arena is level with the plaza). The check
 *    at elevation 4 still finds 950 m2 of the lowest sphendone rows under
 *    the terrain, up to 2.9 m, and the track round the sphendone's end is
 *    still grassed over: the terrain's fault, left as it is. Elevation 3
 *    left the track grassed over; 5 or more would only raise the plinth.
 *  - Arena floor (a05): a charcoal track (#3d3f43) round a sand infield
 *    (#d8c59c) 20 m wide, from the sphendone's centre to 14 m short of the
 *    open end; the marble walk between the arena wall and the first row.
 *    Widths estimated from a05.
 *  - Colours: marble warm off-white (#e9e2d4) on treads, the row fronts in
 *    their own shadow tone (#a59d8f), weathered outer walls (#d2cbbd)
 *    (a05, a07, a08, a13).
 *  - Night: the bowl is floodlit warm white (a12): _FLOODLIGHT on the
 *    marble; the Olympic rings are lit white (`neon-olympic-rings`).
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - a03: Jebulon, "Panathenaic stadium, Pangrati borrough, from
 *      Acropolis, Athens, Greece.jpg", CC0, from the west-south-west.
 *      https://commons.wikimedia.org/wiki/File:Panathenaic_stadium,_Pangrati_borrough,_from_Acropolis,_Athens,_Greece.jpg
 *    - a05: George E. Koronaios, "The Panathenaic Stadium on 2 October
 *      2018.jpg", CC0, from the sphendone: zones, diazoma, herms.
 *      https://commons.wikimedia.org/wiki/File:The_Panathenaic_Stadium_on_2_October_2018.jpg
 *    - a07: George E. Koronaios, "Inside the Panathenaic Stadium on July
 *      19, 2019.jpg", CC BY-SA 4.0: aisle steps, rows, herms.
 *      https://commons.wikimedia.org/wiki/File:Inside_the_Panathenaic_Stadium_on_July_19,_2019.jpg
 *    - a08: George E. Koronaios, "Side view of the entrance to the
 *      Panathenaic Stadium from Ardittos Hill. In the distance Mount
 *      Lycabettus.jpg", CC BY-SA 4.0: the free end wall.
 *      https://commons.wikimedia.org/wiki/File:Side_view_of_the_entrance_to_the_Panathenaic_Stadium_from_Ardittos_Hill._In_the_distance_Mount_Lycabettus.jpg
 *    - a09: Jakub Hałun, "Panathenaic Stadium, Athens, 20240601 1003
 *      0039.jpg", CC BY 4.0, from the arena: heights.
 *      https://commons.wikimedia.org/wiki/File:Panathenaic_Stadium,_Athens,_20240601_1003_0039.jpg
 *    - a11: John Samuel, "Panathenaic Stadium (Athens) from the north
 *      01.jpg", CC BY-SA 4.0: the gate, the sphendone, the rings.
 *      https://commons.wikimedia.org/wiki/File:Panathenaic_Stadium_(Athens)_from_the_north_01.jpg
 *    - a12: George E. Koronaios, "The Panathenaic Stadium at night on March
 *      13, 2024.jpg", CC BY-SA 4.0: night look, gate posts, aisles.
 *      https://commons.wikimedia.org/wiki/File:The_Panathenaic_Stadium_at_night_on_March_13,_2024.jpg
 *    - a13: Jakub Hałun, "Panathenaic Stadium, Athens, 20240601 1013
 *      0058.jpg", CC BY 4.0, from the sphendone's top.
 *      https://commons.wikimedia.org/wiki/File:Panathenaic_Stadium,_Athens,_20240601_1013_0058.jpg
 *    - a17: George E. Koronaios, "The Panathenaic Stadium (Kallimarmaro) of
 *      Athens.jpg", CC BY-SA 4.0: the entrance end, end parapets, plaza.
 *      https://commons.wikimedia.org/wiki/File:The_Panathenaic_Stadium_(Kallimarmaro)_of_Athens.jpg
 *  No look-only sources. No lidar or NAIP (outside the US); no commercial
 *  imagery.
 *
 * Invented or simplified, and doubts:
 *  - No propylaea stands at the entrance today (the photos show a plaza,
 *    flagpoles and a fenced gate); the gate posts are drawn instead.
 *  - The plan is an exact U (two straight sides and a semicircle) fitted
 *    to OSM; the arena's ends and the track are the map's.
 *  - Aisle positions: every 16 m on the straight sides (upper zone offset
 *    8 m) and every 30 deg in the sphendone (upper offset 15 deg), from
 *    a05/a12, not counted exactly. The royal box/tunnel by the east
 *    sphendone (OSM notch at x 27.5, y -66) is left out.
 *  - Left out as too thin to read: the railings, the row of flagpoles and
 *    the light masts along the top walk.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { face, vmul } from './seoul-world-cup-stadium'
import { band, bar, writeLods } from './milan-san-siro'

// ---------------------------------------------------------------------------
// Materials

// Floodlit at night (the whole bowl glows warm white): treads and risers
// facing the arena most, the outer walls little.
const MARBLE: MaterialSpec = {
  ...finish('pentelic-marble', 0xe9e2d4),
  floodlight: (p, n) => (n[2] > 0.7 ? 0.75 : 0.9) * (p[2] > 0 ? 1 : 0.5),
}
const WALL: MaterialSpec = finish('kallimarmaro-wall', 0xd2cbbd)
// The fronts of the rows (risers), in the shadow they cast in every photo.
const RISER: MaterialSpec = { ...finish('pentelic-marble-riser', 0xa59d8f), floodlight: () => 0.8 }
const RINGS: MaterialSpec = { name: 'neon-olympic-rings', color: 0xf3f1ec, roughness: 0.5 }
// The arena floor (a05): a charcoal running track round a sand infield.
const TRACK: MaterialSpec = { ...finish('kallimarmaro-track', 0x3d3f43), floodlight: () => 0.6 }
const SAND: MaterialSpec = { ...finish('kallimarmaro-sand', 0xd8c59c), floodlight: () => 0.7 }

// ---------------------------------------------------------------------------
// Dimensions (model frame: x across the arena, y along it to the entrance,
// bearing 328.5; z up; metres; origin at the centroid of the stands'
// outline, on the arena floor). See the header for sources.

const BEARING = 328.5
const X0 = 0.7 // the arena's axis
const YC = -66.5 // centre of the sphendone
const YE = 124 // the entrance end of the stands
const R0 = 20.3 // front of the first row (OSM inner edge)
const TREAD = 0.8, RISE = 0.42
const LOW_ROWS = 24, UP_ROWS = 23
const FRONT_Z = 1.3
const DIAZ = 3.0, DIAZ_WALL = 2.0
const TOP_WALK = 1.9, PARAPET_W = 0.6, PARAPET_H = 1.0
const ARENA_WALL = 17.0 // the low marble wall round the track
const INFIELD = 10.0 // half-width of the sand infield; the track is the rest (a05)
const INFIELD_END = YE - 14 // where the sand stops short of the open end (a05)
// The model's walls run this far below the arena so that, raised by the
// catalog elevation onto the map's coarse terrain, no edge stands off it.
const SKIRT = -4

// The section of the stands, from the arena out: [r, z] corners in order,
// each tagged with whether the segment that follows is a tread (up) or a
// riser (in).
type Pt = { r: number; z: number }
function section(grouped: number): { pts: Pt[]; rowFronts: { r: number; z: number; zone: 0 | 1 }[] } {
  const pts: Pt[] = [{ r: R0, z: 0 }, { r: R0, z: FRONT_Z }]
  const rowFronts: { r: number; z: number; zone: 0 | 1 }[] = []
  let r = R0, z = FRONT_Z
  const rows = (n: number, zone: 0 | 1) => {
    for (let k = 0; k < n; k += grouped) {
      const m = Math.min(grouped, n - k)
      rowFronts.push({ r, z, zone })
      pts.push({ r: r + TREAD * m, z })
      r += TREAD * m
      z += RISE * m
      pts.push({ r, z })
    }
  }
  rows(LOW_ROWS, 0)
  // The last riser of the lower zone is the diazoma's floor edge: drop it.
  pts.pop(); z -= RISE * Math.min(grouped, LOW_ROWS)
  pts.push({ r: r + DIAZ, z }); r += DIAZ
  z += DIAZ_WALL; pts.push({ r, z })
  rows(UP_ROWS, 1)
  pts.pop(); z -= RISE * Math.min(grouped, UP_ROWS)
  pts.push({ r: r + TOP_WALK, z }); r += TOP_WALK
  pts.push({ r, z: z + PARAPET_H }); pts.push({ r: r + PARAPET_W, z: z + PARAPET_H }); r += PARAPET_W
  pts.push({ r, z: SKIRT })
  return { pts, rowFronts }
}

/** The U path at radius r from the arena axis: west side, sphendone, east side. */
function uPath(r: number, z: number, arcSegs: number, yEnd = YE): V3[] {
  const out: V3[] = [[X0 - r, yEnd, z]]
  for (let k = 0; k <= arcSegs; k++) {
    const t = Math.PI + (k / arcSegs) * Math.PI
    out.push([X0 + r * Math.cos(t), YC + r * Math.sin(t), z])
  }
  out.push([X0 + r, yEnd, z])
  return out
}
/** Toward the arena axis from q (horizontal). */
const inward = (q: V3): V3 => (q[1] > YC ? [X0 - q[0], 0, 0] : [X0 - q[0], YC - q[1], 0])
const outward = (q: V3): V3 => vmul(inward(q), -1)
const UP = (): V3 => [0, 0, 1]

/** A box from a local frame: origin c, radial u, tangent t (horizontal units). */
function box(p: Part, c: V3, u: V3, t: V3, r0: number, r1: number, w: number, z0: number, z1: number, faces = 'all', side: Part = p) {
  const P = (r: number, s: number, z: number): V3 => [c[0] + u[0] * r + t[0] * s, c[1] + u[1] * r + t[1] * s, z]
  const a = P(r0, -w / 2, z0), b = P(r0, w / 2, z0), cc = P(r1, w / 2, z0), d = P(r1, -w / 2, z0)
  const A = P(r0, -w / 2, z1), B = P(r0, w / 2, z1), C = P(r1, w / 2, z1), D = P(r1, -w / 2, z1)
  face(p, [A, B, C, D], [0, 0, 1])
  face(side, [a, b, B, A], vmul(u, -1))
  face(side, [b, cc, C, B], t)
  face(side, [d, a, A, D], vmul(t, -1))
  if (faces === 'all') face(side, [cc, d, D, C], u)
}

function build(detail: boolean) {
  const marble = new Part(), wall = new Part(), rings = new Part(), riser = new Part()
  const track = new Part(), sand = new Part()
  const ARC = detail ? 24 : 12
  const { pts, rowFronts } = section(detail ? 1 : 2)

  // --- the stands: the section swept round the U ------------------------
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1]
    const r0 = uPath(a.r, a.z, ARC), r1 = uPath(b.r, b.z, ARC)
    const isLast = i === pts.length - 2 // the outer retaining wall
    const horiz = Math.abs(a.z - b.z) < 1e-6
    const part = isLast ? wall : horiz || i === 0 ? marble : riser
    const hint = horiz ? UP : b.z > a.z ? inward : outward
    band(part, r0, r1, hint, false, true)
  }
  // End walls at the entrance: under each stand's section, rising into a
  // parapet that slopes up the rake (a17), 0.6 m thick, a column per tread.
  {
    const PZ = pts[pts.length - 3].z // the top parapet
    const ET = 0.6, EH = 0.9
    for (const side of [-1, 1]) {
      const n: V3 = [0, 1, 0]
      for (let i = 1; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1], c = pts[i + 2]
        if (Math.abs(a.z - b.z) > 1e-6 || b.r <= a.r) continue
        const isTop = i === pts.length - 3
        const zl = isTop ? a.z : a.z + EH
        const zr = isTop ? a.z : Math.min(PZ, (c && c.z > b.z ? c.z : b.z) + EH)
        const xa = X0 + side * a.r, xb = X0 + side * b.r
        face(wall, [[xa, YE, SKIRT], [xb, YE, SKIRT], [xb, YE, zr], [xa, YE, zl]], n)
        if (isTop) continue
        const y1 = YE - ET
        face(marble, [[xa, y1, a.z], [xb, y1, a.z], [xb, y1, zr], [xa, y1, zl]], [0, -1, 0])
        face(marble, [[xa, y1, zl], [xb, y1, zr], [xb, YE, zr], [xa, YE, zl]], [0, 0, 1])
      }
    }
  }

  // --- aisles: half-height steps up each stair, in the detail model --------
  if (detail) {
    type F = { c: V3; u: V3; t: V3 }
    const frames: { f: F; zone: 0 | 1 }[] = []
    const arcF = (th: number): F => ({ c: [X0, YC, 0], u: [Math.cos(th), Math.sin(th), 0], t: [-Math.sin(th), Math.cos(th), 0] })
    const sideF = (s: number, y: number): F => ({ c: [X0, y, 0], u: [s, 0, 0], t: [0, 1, 0] })
    for (let j = 1; j < 6; j++) frames.push({ f: arcF(Math.PI + (j * Math.PI) / 6), zone: 0 })
    for (let j = 0; j < 6; j++) frames.push({ f: arcF(Math.PI + ((j + 0.5) * Math.PI) / 6), zone: 1 })
    for (const s of [-1, 1]) {
      for (let y = YC + 10; y < YE - 6; y += 16) frames.push({ f: sideF(s, y), zone: 0 })
      for (let y = YC + 18; y < YE - 6; y += 16) frames.push({ f: sideF(s, y), zone: 1 })
    }
    for (const { f, zone } of frames)
      for (const row of rowFronts) {
        if (row.zone !== zone) continue
        box(marble, f.c, f.u, f.t, row.r + TREAD / 2, row.r + TREAD, 1.3, row.z, row.z + RISE / 2, 'open', riser)
      }
  }

  // --- the arena floor: sand infield, track, and the marble walk -----------
  {
    const yEnd = YE - 1
    const rect = (p: Part, x0: number, x1: number, y0: number, y1: number) =>
      face(p, [[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0]], [0, 0, 1])
    rect(sand, X0 - INFIELD, X0 + INFIELD, YC, INFIELD_END)
    // the track: round the sphendone and up both sides, then across the open end
    band(track, uPath(INFIELD, 0, ARC, yEnd), uPath(ARENA_WALL, 0, ARC, yEnd), UP, false, true)
    face(track, uPath(INFIELD, 0, ARC, YC).slice(1, -1), [0, 0, 1])
    rect(track, X0 - INFIELD, X0 + INFIELD, INFIELD_END, yEnd)
    rect(track, X0 - ARENA_WALL - 0.5, X0 + ARENA_WALL + 0.5, yEnd, YE)
    // the marble walk between the arena wall and the first row
    band(marble, uPath(ARENA_WALL + 0.5, 0, ARC), uPath(R0, 0, ARC), UP, false, true)
    // the open end's face, down to the drawn plaza
    face(wall, [[X0 - R0, YE, SKIRT], [X0 + R0, YE, SKIRT], [X0 + R0, YE, 0], [X0 - R0, YE, 0]], [0, 1, 0])
  }

  // --- the arena's marble wall --------------------------------------------
  {
    const segs = ARC
    const yEnd = YE - 1
    const W = 0.5, H = 1.0
    band(marble, uPath(ARENA_WALL, 0, segs, yEnd), uPath(ARENA_WALL, H, segs, yEnd), inward, false, true)
    band(marble, uPath(ARENA_WALL + W, H, segs, yEnd), uPath(ARENA_WALL + W, 0, segs, yEnd), outward, false, true)
    band(marble, uPath(ARENA_WALL, H, segs, yEnd), uPath(ARENA_WALL + W, H, segs, yEnd), UP, false, true)
  }

  // --- the two herms at the sphendone end of the arena ---------------------
  for (const s of [-1, 1]) {
    const c: V3 = [X0 + s * 7, YC + 4, 0]
    const u: V3 = [1, 0, 0], t: V3 = [0, 1, 0]
    box(marble, c, u, t, -0.45, 0.45, 0.9, 0, 0.35)
    box(marble, c, u, t, -0.3, 0.3, 0.6, 0.35, 2.0)
    box(marble, c, u, t, -0.24, 0.24, 0.5, 2.0, 2.6) // the head
  }

  // --- the entrance: marble gate posts and a low sill across the open end ---
  {
    const y = YE - 0.5
    const u: V3 = [1, 0, 0], t: V3 = [0, 1, 0]
    const posts = [-15.5, -9.5, -3, 3, 9.5, 15.5]
    for (const x of posts) {
      box(marble, [X0 + x, y, 0], u, t, -0.55, 0.55, 1.1, 0, 3.8)
      box(marble, [X0 + x, y, 0], u, t, -0.7, 0.7, 1.4, 3.8, 4.2)
    }
    box(marble, [X0, y, 0], u, t, -R0, R0, 0.6, 0, 0.5)
  }

  // --- the Olympic rings on their mast at the top of the sphendone ----------
  {
    const rTop = pts[pts.length - 2].r + 1.5
    const zTop = pts[pts.length - 2].z - PARAPET_H
    const cy = YC - rTop, zc = zTop + 9
    const R = 2.0, tube = detail ? 0.32 : 0.42
    const centres: [number, number][] = [[-4.5, 0], [0, 0], [4.5, 0], [-2.25, -2.0], [2.25, -2.0]]
    const N = detail ? 20 : 12, S = 4
    for (const [dx, dz] of centres) {
      const ox = X0 + dx, oz = zc + dz
      // a square-section torus in the x-z plane, facing the arena (+y)
      const ringPt = (a: number, b: number): V3 => {
        const rr = R + tube * Math.cos(b)
        return [ox + rr * Math.cos(a), cy + tube * Math.sin(b), oz + rr * Math.sin(a)]
      }
      for (let i = 0; i < N; i++)
        for (let j = 0; j < S; j++) {
          const a0 = (i / N) * 2 * Math.PI, a1 = ((i + 1) / N) * 2 * Math.PI
          const b0 = (j / S) * 2 * Math.PI + Math.PI / 4, b1 = ((j + 1) / S) * 2 * Math.PI + Math.PI / 4
          const q = [ringPt(a0, b0), ringPt(a1, b0), ringPt(a1, b1), ringPt(a0, b1)]
          const m = (Math.cos((b0 + b1) / 2)), n2 = Math.sin((b0 + b1) / 2)
          const am = (a0 + a1) / 2
          face(rings, q, [m * Math.cos(am), n2, m * Math.sin(am)])
        }
    }
    bar(wall, [X0, cy, 0], [X0, cy, zc - 2.0 - R], 0.6, 0.6)
  }

  return [
    { part: marble, material: MARBLE },
    { part: wall, material: WALL },
    { part: rings, material: RINGS },
    { part: riser, material: RISER },
    { part: track, material: TRACK },
    { part: sand, material: SAND },
  ]
}

if (import.meta.main) {
  const extras = { name: 'Panathenaic Stadium', bearing: BEARING }
  await writeLods('athens-panathenaic-stadium', extras, [
    { file: 'athens-panathenaic-stadium.glb', parts: build(false), maxTris: 5000, maxBytes: 250_000 },
    { file: 'athens-panathenaic-stadium.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1_500_000 },
  ])
}
