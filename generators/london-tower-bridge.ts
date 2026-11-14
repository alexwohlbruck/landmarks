/**
 * Tower Bridge, London (1886–1894; Sir Horace Jones, architect, and Sir John
 * Wolfe Barry, engineer) — procedural, CC0-1.0, no textures.
 * bun generators/london-tower-bridge.ts
 *
 * The whole bridge as one placement, from the south end of its OSM outline
 * to the north end: both river piers and their Gothic towers, the two
 * high-level walkways between the tower tops, the bascules' girders, the
 * two side spans with their curved lattice suspension chains and hangers,
 * the two shore abutment towers, and the short approach girders out to the
 * outline's ends. Writes a low model (towers, piers, abutment towers,
 * walkways, chains and deck girders as bold forms, the walkways' lattice
 * already real members) and a detail model (the full lattice in the
 * walkways, chains and bascule girders, the hangers, parapets, window
 * surrounds, battlements, finials and lamp standards), which a map draws
 * from detailZoom 16.
 *
 * Frame: x across the bridge (east of the axis +), y along it toward the
 * north bank, z up, metres. Placed at bearing 23.2°, the line from the south
 * pier's centroid to the north one's; the anchor (-0.0753644, 51.5055164) is
 * midway between them. The map owns the roadway and pavement surfaces:
 * nothing here is a slab at road level. The piers' tops and the abutments'
 * bases stay 0.3 m under the roadway; the high-level walkways, which the map
 * leaves to the model, are drawn floor and all.
 *
 * Height. z = 0 is the river, the lowest ground under the footprint: the
 * Environment Agency lidar reads the Thames here at 3.05 m above Ordnance
 * Datum (Newlyn) on its flight, and the map's terrain (Mapterhorn z15) at
 * 3.08 m, so a height above the water is AOD minus 3.05. The main towers'
 * piers stand in the water at z = 0; the abutment towers' bases and the end
 * walls run down to the map's terrain vertex by vertex (SOUTH_GROUND,
 * NORTH_GROUND, Mapterhorn heights in this frame minus 3.08 m).
 *
 * Roadway heights the deck is built to (lidar, the road surface on the
 * centre line, above the water; AOD = value + 3.05): 10.6 m at midspan
 * (node 8994515127, 13.64 m AOD), 10.1 through the towers, 9.8 at the south
 * pier's outer face (node 8994515128, 12.85 AOD) and 9.9 at the north one's
 * (node 1658899500, y = +64, 12.83 AOD), falling across the side spans to
 * 7.7 at the south abutment and 8.75 at the north one, and 7.1 (node
 * 4411935957, 10.17 AOD) and 8.25 (node 8994515125, 11.30 AOD) at the
 * outline's ends. OSM records none of these: the road ways are layer=1 with
 * no `height` or `ele` (the bascule ways carry height=30', which reads as a
 * clearance, not a deck height), and the outline has no height, so the map
 * guesses the deck from the ground and water under it. If its roadway misses
 * the girders here, tag those nodes' `ele` (docs/bridge-heights.md) rather
 * than move the girders. `road()` below is the profile.
 *
 * Sources:
 * - OSM (fetched 2026-11-13): the outline way/378541210 (man_made=bridge,
 *   bridge:structure=suspension, layer 1), y = -156.6 to +162.4; the river
 *   piers way/367652791 (south) and way/367652787 (north), each a stadium
 *   56.5 x 21 m, 82.0 m apart centre to centre; the towers way/367652741 and
 *   way/367652746 (20 x 10.6 m, 9–46.5 m) with parts way/934056830–837
 *   (gables 39–54 and 47–57, roof 47–65) and eight corner turrets
 *   way/367652756…783 (2.7 m square, 36–58 m); the high-level walkways
 *   way/367652753 and way/367653917 (4.2 m wide, centred 7.2 m either side
 *   of the axis, 40–45 m); the walkway footways way/153173986 (height 143 ft)
 *   and way/153173987 (43.5); the huts on the piers way/367657976, 978, 979
 *   and the exhibition annex way/367657974; the deck parts way/934056842–845;
 *   the abutment towers: Southern Gate way/934173814 with parts 934173815–817,
 *   934056838, 934056840 and the Bridgemaster's Dining Room way/367654912 in
 *   its base; Northern Gate way/934173812 with way/367654296, 934173813,
 *   934056839 and 934056841. Central span between the piers 61 m; side spans
 *   pier face to abutment face 83.2 m (south) and 81.3 m (north).
 * - Lidar: Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government
 *   Licence v3.0 (flights 2000–2022, mostly the late 2010s here), read in
 *   this frame: the walkways' tops 47.8 m above the water, 4.5 m wide,
 *   centred ±7.25 m; the towers 22 x 13 m over their turrets, the roofs'
 *   ridges about 64.5 m and the crowns 67.5 m, the turret spires 62–63 m,
 *   the parapet and roof edge 51–52 m, the inner dormer gables 56.8 m; the
 *   piers' tops 10.1 m; the abutment towers' roofs 29.7–30.6 m,
 *   their walls 24–26 m; the side-span chains (with their hangers) at
 *   x ≈ ±9: 24.5 m at y = 66, 18.2 at 82, 14.8 at 94, a low point of about
 *   11.5 m near y = ±102, then 15.2 at 118 and 18.2 at 126; a parabola with
 *   its vertex 12 m high, 63 % of the way from the tower to the abutment,
 *   fits all of these within about 2 m.
 * - Published (Wikipedia "Tower Bridge"; Historic England list entry
 *   1079120): 244 m long; towers 65 m high; central bascule span 61 m; side
 *   spans 82.3 m (270 ft), suspension spans hung from curved lattice chains;
 *   high-level walkways 42 m above high water; steel frame clad in Cornish
 *   granite and Portland stone; painted blue and white since 1977 (the
 *   colours chosen for the Silver Jubilee; earlier chocolate brown).
 * - Photos (Wikimedia Commons; EVIDENCE): "Tower Bridge London Feb 2006"
 *   and "Tower Bridge London Dusk Feb 2006" (Diliff, CC BY-SA 3.0: the
 *   upstream elevation, chains, hangers, parapets, pier and starling, the
 *   floodlighting); "Tower Bridge (aerial view)" (Bob Collowan, CC BY-SA 3.0:
 *   the upstream side from the Shard, the walkways' lattice, the piers'
 *   round ends, the huts, the bascules' lattice girders); "Tower Bridge,
 *   aerial view (2015) - panoramio" (Alexander Kachkaev, CC BY 3.0: the
 *   plan); "Tower Bridge from the Shard London Bridge. Evening 2019-09-22"
 *   (Colin, CC BY-SA 4.0); "Tower Bridge from the Shard 4K" (Hnapel, CC0);
 *   "London, Tower Bridge -- 2016 -- 4676", "4767", "4772" and "4787"
 *   (Dietmar Rabich, CC BY-SA 4.0: the towers' river faces from the Tower,
 *   the bridge end-on from upstream, the north abutment tower and its chain
 *   end with the medallion, the downstream elevation); "Tower Bridge South
 *   Tower - London, England 2023-10-27" (Ryan Hodnett, CC BY-SA 4.0: the
 *   tower's top stage, dormer, turrets, hipped roof and crown); "Tower Bridge
 *   from St Katharine Docks entrance - 2023-03-18" (The wub, CC BY-SA 4.0:
 *   the downstream side at dusk, the lighting); "View of Tower Bridge from
 *   Bermondsey Wall East" (Robert Lamb, CC BY-SA 2.0); "Tower Bridge längs"
 *   (Dr. Ronald Kunze, CC BY 3.0: the road arch through a tower); "Tower
 *   bridge - Walkways from deck" (Peter Burgess, CC BY 2.0) and "Looking up
 *   at one of the abutments and walkways on Tower Bridge" (Robert Lamb,
 *   CC BY-SA 2.0: the walkways' underside bracing and lattice sides); "Tower
 *   Bridge walkway" (Tristan Surtel, CC BY-SA 4.0); "Tower Bridge at Night,
 *   from the South Bank" (George Oates, CC0).
 * - Look-only: none.
 *
 * Estimated or simplified:
 * - The tower body's plan (19.2 x 11.6 m) between OSM's 20 x 10.6 and the
 *   lidar's 22 x 13 with turrets; the corner turrets drawn bold, octagonal
 *   (hexagonal in the low model), 4.2 m across and standing proud of the
 *   corners, a tall belfry stage from the battlements to 56.6 m and
 *   spirelets to the lidar's 63–63.6 m with finials to 65.4 m (Collowan's
 *   and Diliff's photos); the hipped roof's ridge (5 m) and pitch from Hodnett's and
 *   Rabich's photos and the lidar; the crown's cresting is drawn in the
 *   white trim, not gilt (the model has six materials).
 * - The road arch through each tower 11.2 m wide, crown 20 m (Kunze's photo,
 *   scaled by the corner shafts); the abutment towers' arches 14.8 m wide
 *   with both pavements passing through (OSM's footways), crown 12 m over
 *   the road (Rabich's 4772).
 * - Window positions and sizes from the photos, grouped.
 * - The walkways' depth (43.0–47.8 m) from the lidar top and the published
 *   42 m above high water; their lattice as X panels, 3 m (detail) or 7.8 m
 *   (low), in front of glazing drawn in the pale blue, as it reads in the
 *   daylight photos (the sky and the paint in the glass).
 * - Colour: the paint a pale sky blue (#8fbad6) with the lattice webs,
 *   hangers and walkway bottom chords in the white trim (Diliff, Collowan).
 * - The low model draws each chain as a bold band: deeper chords (0.9 m)
 *   with a pale web plate set back between them and blue posts, so it reads
 *   from the map; the detail model has the open lattice.
 * - The chains: two chords 0.7 m deep, meeting the towers 45.4 m up, just
 *   under the walkways (Hodnett's photo), their top following the lidar
 *   parabola; on the river segment a lens deepest a third of the way out
 *   (up to 5.6 m over the chords, Diliff's photo), on the shore segment
 *   opening to 4.6 m at the abutment tower (Rabich's 4772); the hangers
 *   every 8.4 m; the chains' line from 7.6 m off the axis at the towers to
 *   9 m; the bascules' outer girders 1.5 m deep at the tips and 4.2 m at
 *   the piers; the side spans' girders 1.7 m deep.
 * - The abutment towers' arches, turrets, roofs and finials from Rabich's
 *   4772 and Diliff's photos; both drawn alike, though the real ones differ
 *   in detail. The south one and its approach are shifted 1 m east, as OSM
 *   draws the road there.
 * - Night: the stone is floodlit evenly (towers and abutment towers; the
 *   piers dimmer), as in Oates's and The wub's photos; the walkways' and
 *   chains' strip lights are drawn as `lamp` beads, and as a wash on the
 *   walkways and chains; deck lamp standards every 24 m (detail). The
 *   towers' windows are dark in those photos, so their material is named
 *   `glass` (it keeps the window slate by day); Diliff's 2006 dusk photo
 *   shows them lit. The blue and purple accent lighting in the arches is
 *   left out.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { band, bead, footedLoft, groundAt, piecewise, stations, tube, type GroundGrid } from './bridge-kit'
import { PALETTE, finish } from './palette'

type P2 = [number, number]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))

// ---- Dimensions ------------------------------------------------------------------

const TY = 41.0                 // tower centres at y = ±TY (OSM piers, 82.0 m apart)
const HX = 9.6, HY = 5.8        // tower body half-width (across) and half-depth (along)
const PIER_TOP = 9.8            // 0.3 m under the roadway through the towers
const PIER_HY = 10.5, PIER_X = 17.7 // stadium piers: straight sides ±PIER_X, round ends of radius PIER_HY
const ARCH_HW = 5.6, ARCH_SPRING = 14.0, ARCH_RISE = 6.0
const SC = [21.2, 30.6, 39.8]   // string courses
const CORN = 49.6, BATT = 51.0  // cornice, battlement wall top
const EAVE = 50.6, RIDGE = 64.5, RIDGE_HALF = 2.5, ROOF_HX = 6.8, ROOF_HY = 4.2
// Bold octagonal corner turrets standing proud of the body's corners (the
// lidar's 22 x 13 m over them), their spirelets to the lidar's 62–63 m.
const TUR = { x: 9.5, y: 4.95, r: 2.1, shaft: 51.0, belfry: 56.6, cornice: 57.3, spire: 63.6, finial: 65.4 }
const WALK = { xc: 6.8, hw: 1.8, z0: 43.0, z1: 47.8, y: TY - HY }
const GX = 9.3                  // deck girders' centre lines
const TF = TY + HY              // the towers' shoreward faces, |y|
const PF = TY + PIER_HY         // the piers' shoreward faces
const PI_ = TY - PIER_HY        // the piers' inner faces (the bascules' hinges)

/** The abutment towers: river face, back face (|y| grows shoreward), outline end. */
const ABUT: Record<number, { face: number; back: number; end: number }> = {
  [-1]: { face: 134.7, back: 141.9, end: 156.6 },
  [1]: { face: 132.8, back: 141.7, end: 162.4 },
}
const SHEAR = 1.0 // the south abutment and approach sit 1 m east (OSM's road line)

/** The roadway, metres above the water, along y (lidar, centre line). */
const road = piecewise([
  [-163, 6.95], [-157, 7.12], [-150, 7.3], [-142, 7.5], [-135, 7.7], [-125, 8.0], [-113, 8.3], [-101, 8.6],
  [-89, 8.95], [-77, 9.3], [-65, 9.6], [-54, 9.82], [-47, 9.98], [-35, 10.15], [-25, 10.25], [-13, 10.45],
  [0, 10.6], [13, 10.5], [25, 10.3], [35, 10.2], [47, 10.02], [55, 9.9], [63, 9.85], [75, 9.65], [87, 9.4],
  [99, 9.25], [111, 9.05], [123, 8.85], [131, 8.75], [147, 8.5], [155, 8.4], [163, 8.3],
])

// Mapterhorn heights in this frame, metres above the water (z15 DEM minus
// 3.08 m), 3 m apart: rows along y from y0, columns across from x = -24.
const grid = (y0: number, base: number, rows: number[][]): GroundGrid =>
  ({ y0, x0: -24, step: 3, z: rows.map((r) => r.map((v) => Math.max(0, v + base - 3.08))) })
const NORTH_GROUND = grid(121, 2.31, [
  [0.0, 0.0, 0.1, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 1.7, 2.6, 2.7, 2.7, 2.8, 2.8],
  [0.0, 0.0, 0.1, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 1.6, 2.7, 2.7, 2.8, 2.8, 2.8],
  [0.2, 0.0, 0.0, 0.7, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 1.6, 2.7, 2.8, 2.8, 2.9, 3.0],
  [0.6, 0.1, 0.2, 0.7, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 2.0, 2.8, 2.9, 3.0, 3.1, 3.4],
  [0.8, 0.8, 0.7, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 1.0, 2.5, 2.9, 3.2, 3.3, 3.5, 3.4],
  [1.1, 1.0, 0.9, 0.9, 1.1, 1.3, 1.3, 1.3, 1.4, 1.4, 1.5, 2.9, 3.0, 3.4, 3.6, 3.7, 3.2],
  [2.7, 2.4, 1.4, 0.9, 1.2, 1.4, 1.7, 1.9, 1.9, 2.0, 2.1, 2.9, 3.0, 3.4, 3.4, 3.3, 2.9],
  [2.7, 2.3, 1.3, 0.9, 1.1, 1.4, 1.6, 1.9, 2.2, 2.4, 2.6, 2.8, 2.9, 3.4, 3.4, 2.9, 2.8],
  [2.7, 2.3, 1.3, 0.8, 1.1, 1.3, 1.6, 1.8, 2.1, 2.4, 2.6, 2.7, 2.8, 3.2, 2.8, 2.6, 2.6],
  [2.6, 2.2, 1.1, 0.8, 1.0, 1.3, 1.5, 1.8, 2.0, 2.3, 2.5, 2.6, 2.6, 2.7, 2.6, 2.5, 2.6],
  [2.6, 2.0, 1.0, 0.8, 1.0, 1.2, 1.5, 1.7, 2.0, 2.2, 2.4, 2.4, 2.5, 2.5, 2.4, 2.5, 2.7],
  [2.6, 1.9, 0.8, 0.7, 1.0, 1.2, 1.4, 1.7, 2.0, 2.2, 2.4, 2.3, 2.3, 2.4, 2.4, 2.4, 2.6],
  [2.7, 1.9, 0.8, 0.7, 0.9, 1.2, 1.4, 1.7, 1.9, 2.2, 2.4, 2.4, 2.4, 2.4, 2.5, 2.5, 2.6],
  [2.7, 1.8, 0.7, 0.6, 0.9, 1.1, 1.4, 1.6, 1.9, 2.2, 2.5, 2.5, 2.5, 2.5, 2.6, 2.7, 2.8],
  [2.6, 1.6, 0.6, 0.6, 0.8, 1.1, 1.3, 1.6, 1.9, 2.3, 2.6, 2.6, 2.5, 2.5, 2.6, 2.7, 3.0],
  [2.5, 1.4, 0.5, 0.5, 0.8, 1.0, 1.3, 1.6, 1.9, 2.2, 2.5, 2.7, 2.6, 2.6, 2.6, 2.8, 3.0],
  [2.1, 1.2, 0.4, 0.5, 0.7, 1.0, 1.3, 1.6, 1.9, 2.2, 2.5, 2.7, 2.6, 2.6, 2.7, 2.8, 3.0],
])
const SOUTH_GROUND = grid(-169, 3.0, [
  [1.9, 1.9, 1.8, 1.8, 4.1, 6.6, 6.9, 6.8, 6.9, 6.8, 6.9, 6.7, 5.6, 4.0, 2.3, 1.7, 1.6],
  [1.8, 1.7, 1.7, 1.5, 2.4, 5.3, 6.9, 6.9, 6.9, 6.9, 7.0, 6.1, 4.7, 3.3, 1.9, 1.6, 1.5],
  [1.6, 1.6, 1.6, 1.5, 1.6, 4.2, 6.8, 6.7, 6.9, 7.0, 7.0, 5.3, 3.9, 2.7, 1.6, 1.4, 1.4],
  [1.5, 1.5, 1.5, 1.5, 1.6, 3.1, 4.6, 4.7, 4.8, 5.0, 5.1, 4.4, 3.1, 2.2, 1.4, 1.3, 1.3],
  [1.4, 1.4, 1.4, 1.4, 1.3, 1.6, 2.2, 2.4, 2.5, 2.7, 2.6, 2.0, 1.8, 1.7, 1.3, 1.2, 1.2],
  [1.4, 1.3, 1.2, 1.2, 1.2, 1.2, 1.3, 1.3, 1.3, 1.3, 1.3, 1.2, 1.1, 1.2, 1.1, 1.1, 1.1],
  [1.4, 1.3, 1.2, 1.1, 1.3, 1.2, 1.2, 1.2, 1.2, 1.1, 1.1, 1.1, 1.1, 1.0, 1.0, 1.0, 1.0],
  [1.4, 1.4, 1.3, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1],
  [1.4, 1.4, 1.4, 1.3, 1.3, 1.2, 1.2, 1.3, 1.2, 1.2, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.0],
  [1.5, 1.4, 1.4, 1.4, 1.4, 1.2, 1.1, 0.9, 0.8, 0.8, 0.8, 0.9, 1.0, 1.1, 1.1, 1.0, 1.0],
  [1.4, 1.4, 1.4, 1.3, 1.3, 1.2, 0.9, 0.8, 0.6, 0.5, 0.6, 0.6, 0.7, 0.7, 0.7, 0.7, 0.6],
  [0.6, 0.4, 0.3, 0.3, 0.4, 0.4, 0.4, 0.4, 0.3, 0.3, 0.3, 0.3, 0.3, 0.2, 0.1, 0.2, 0.2],
  [0.1, 0.1, 0.1, 0.0, 0.0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
])
const ground = (x: number, y: number) =>
  Math.abs(y) < 110 ? 0 : groundAt(y > 0 ? NORTH_GROUND : SOUTH_GROUND, x, y)

// ---- Geometry helpers ---------------------------------------------------------------

/** A flat polygon (convex, or a fan from its first corner), facing n. */
function poly(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
}
/** The same, facing away from `centre`. */
function polyOut(p: Part, pts: V3[], centre: V3) {
  let n: V3 = [0, 0, 0]
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    n = add(n, [(a[1] - b[1]) * (a[2] + b[2]), (a[2] - b[2]) * (a[0] + b[0]), (a[0] - b[0]) * (a[1] + b[1])])
  }
  n = unit(n)
  const c = mul(pts.reduce(add, [0, 0, 0] as V3), 1 / pts.length)
  if (dot(n, sub(c, centre)) < 0) n = mul(n, -1)
  poly(p, pts, n)
}

/**
 * A vertical prism over a plan (CCW from above), its top capped in `top`.
 * `soft` shades corners sharper than 50° flat and blends the rest, so round
 * plans (turrets, the piers' ends) read round for half the vertices.
 */
function prism(p: Part, plan: P2[], z0: number, z1: number, top: Part | null = p, bottom: Part | null = null, soft = false) {
  const m = plan.length
  const fn = plan.map((a, i) => { const b = plan[(i + 1) % m]; return unit([b[1] - a[1], a[0] - b[0], 0]) })
  const vn = (i: number, side: number): V3 => {
    // The normal at corner i of face `side` (i is that face's own start or end corner).
    const f = fn[side], g = side === i ? fn[(i - 1 + m) % m] : fn[(side + 1) % m]
    return soft && dot(f, g) > Math.cos((50 * Math.PI) / 180) ? unit(add(f, g)) : f
  }
  for (let i = 0; i < m; i++) {
    const a = plan[i], j = (i + 1) % m, b = plan[j]
    const na = vn(i, i), nb = vn(j, i)
    const A0: V3 = [a[0], a[1], z0], B0: V3 = [b[0], b[1], z0], B1: V3 = [b[0], b[1], z1], A1: V3 = [a[0], a[1], z1]
    p.tri(A0, B0, B1, undefined, undefined, undefined, [na, nb, nb])
    p.tri(A0, B1, A1, undefined, undefined, undefined, [na, nb, na])
  }
  if (top) poly(top, plan.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(bottom, plan.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
const rect = (x0: number, x1: number, y0: number, y1: number, r = 0): P2[] =>
  r <= 0 ? [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    : [[x0 + r, y0], [x1 - r, y0], [x1, y0 + r], [x1, y1 - r], [x1 - r, y1], [x0 + r, y1], [x0, y1 - r], [x0, y0 + r]]
const ngon = (cx: number, cy: number, r: number, n: number, rot = Math.PI / n): P2[] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos(rot + (2 * Math.PI * i) / n), cy + r * Math.sin(rot + (2 * Math.PI * i) / n)] as P2)
const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, r = 0, top: Part | null = p, bottom: Part | null = null) =>
  prism(p, rect(x0, x1, y0, y1, r), z0, z1, top, bottom)

/** A pyramid from a plan at z0 up to an apex. */
function pyramid(p: Part, plan: P2[], z0: number, apex: V3) {
  for (let i = 0; i < plan.length; i++) {
    const a = plan[i], b = plan[(i + 1) % plan.length]
    const A: V3 = [a[0], a[1], z0], B: V3 = [b[0], b[1], z0]
    poly(p, [A, B, apex], unit(cross(sub(B, A), sub(apex, A))))
  }
}

/** A box on edges a, b, c from o; `caps` false leaves off the two faces across a. */
function cuboid(p: Part, o: V3, a: V3, b: V3, c: V3, caps = true) {
  const centre = add(o, mul(add(add(a, b), c), 0.5))
  const q = (u: V3, v: V3, w: V3) => polyOut(p, [u, add(u, v), add(add(u, v), w), add(u, w)], centre)
  const oa = add(o, a), ob = add(o, b), oc = add(o, c)
  q(o, b, c); q(oa, b, c)
  q(o, a, c); q(ob, a, c)
  if (caps) { q(o, a, b); q(oc, a, b) }
}
/** A rectangular member from A to B: ws across its plane (x for members in a plane x = const), wu in it. */
function bar(p: Part, A: V3, B: V3, ws: number, wu: number, caps = false) {
  const d = sub(B, A)
  const s: V3 = Math.abs(d[2]) / Math.hypot(...d) > 0.999 ? [1, 0, 0] : unit(cross(d, [0, 0, 1]))
  const u = unit(cross(s, d))
  const o = sub(sub(A, mul(s, ws / 2)), mul(u, wu / 2))
  // `cuboid` drops the faces across its first edge, so pass the member's length first.
  cuboidLen(p, o, d, mul(s, ws), mul(u, wu), caps)
}
function cuboidLen(p: Part, o: V3, len: V3, a: V3, b: V3, caps: boolean) {
  const centre = add(o, mul(add(add(len, a), b), 0.5))
  const q = (u: V3, v: V3, w: V3) => polyOut(p, [u, add(u, v), add(add(u, v), w), add(u, w)], centre)
  q(o, len, a); q(add(o, b), len, a)
  q(o, len, b); q(add(o, a), len, b)
  if (caps) { q(o, a, b); q(add(o, len), a, b) }
}
/** A member of rectangular section swept along a path (no gaps at the bends). */
function beam(p: Part, path: V3[], ws: number, wu: number) {
  const rings = path.map((pt, i) => {
    const t = unit(sub(path[Math.min(i + 1, path.length - 1)], path[Math.max(i - 1, 0)]))
    const s: V3 = Math.abs(t[2]) > 0.999 ? [1, 0, 0] : unit(cross(t, [0, 0, 1]))
    const u = unit(cross(s, t))
    const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
    return {
      pts: corners.map(([a, b]) => add(pt, add(mul(s, (a * ws) / 2), mul(u, (b * wu) / 2)))),
      ns: corners.map(([a, b]) => unit(add(mul(s, a), mul(u, b)))),
    }
  })
  // Smooth-shaded round its corners: a rounded box section, half the vertices of a flat one.
  for (let i = 0; i < rings.length - 1; i++)
    for (let k = 0; k < 4; k++) {
      const j = (k + 1) % 4, A = rings[i], B = rings[i + 1]
      p.tri(A.pts[k], A.pts[j], B.pts[j], undefined, undefined, undefined, [A.ns[k], A.ns[j], B.ns[j]])
      p.tri(A.pts[k], B.pts[j], B.pts[k], undefined, undefined, undefined, [A.ns[k], B.ns[j], B.ns[k]])
    }
}
/** A thin rod: a prism of `sides` faces, open at the ends. */
const rod = (p: Part, a: V3, b: V3, r: number, sides = 4) => tube(p, [a, b], r, sides)

/** The normal into an arch's opening, from a segment of its curve run left to right. */
const inward = (a: P2, b: P2): V3 => unit([b[1] - a[1], 0, -(b[0] - a[0])])

/** A pointed arch's intrados, from (-hw, 0) over the crown (0, rise) to (hw, 0); rise ≥ hw. */
function ogive(hw: number, rise: number, n: number): P2[] {
  const c = (rise * rise - hw * hw) / (2 * hw), R = hw + c, th = Math.acos(c / R)
  const right: P2[] = Array.from({ length: n + 1 }, (_, i) => [-c + R * Math.cos((th * i) / n), R * Math.sin((th * i) / n)])
  return [...right.map(([x, z]) => [-x, z] as P2), ...right.slice(0, -1).reverse()]
}

/**
 * A vertical face: origin o on the wall, u the horizontal direction along
 * it, n its outward normal. `at(f, u, z, d)` is the point u along, at height
 * z, d out from the wall.
 */
type Face = { o: V3; u: V3; n: V3 }
const at = (f: Face, u: number, z: number, d = 0): V3 => [f.o[0] + f.u[0] * u + f.n[0] * d, f.o[1] + f.u[1] * u + f.n[1] * d, z + f.n[2] * d]
/** A window or blind panel on a face, with a pointed head `head` m high. */
function panel(p: Part, f: Face, u0: number, u1: number, z0: number, z1: number, d = 0.05, head = 0) {
  const pts: V3[] = [at(f, u0, z0, d), at(f, u1, z0, d), at(f, u1, z1, d)]
  if (head > 0) pts.push(at(f, (u0 + u1) / 2, z1 + head, d))
  pts.push(at(f, u0, z1, d))
  poly(p, pts, f.n)
}
/** A block standing proud of a face: u0..u1 along, z0..z1, from d0 to d1 out. */
function relief(p: Part, f: Face, u0: number, u1: number, z0: number, z1: number, d0: number, d1: number, caps = true) {
  cuboid(p, at(f, u0, z0, d0), sub(at(f, u1, z0, d0), at(f, u0, z0, d0)), [0, 0, z1 - z0], mul(f.n, d1 - d0), caps)
}
/** A pentagonal dormer on a face: walls to zw, gable apex za, run back `depth` into the roof. */
function dormer(wall: Part, roof: Part, f: Face, uc: number, w: number, z0: number, zw: number, za: number, depth: number, d = 0) {
  const front = [at(f, uc - w / 2, z0, d), at(f, uc + w / 2, z0, d), at(f, uc + w / 2, zw, d), at(f, uc, za, d), at(f, uc - w / 2, zw, d)]
  const back = front.map((q) => sub(q, mul(f.n, depth + d)))
  const c = mul(add(front.reduce(add, [0, 0, 0] as V3), back.reduce(add, [0, 0, 0] as V3)), 0.1)
  polyOut(wall, front, c)
  polyOut(wall, [front[0], front[4], back[4], back[0]], c)
  polyOut(wall, [front[1], front[2], back[2], back[1]], c)
  // The roof slopes, overhanging the gable a little.
  const o = mul(f.n, 0.25)
  polyOut(roof, [add(front[4], o), add(front[3], add(o, [0, 0, 0.15])), back[3], back[4]], c)
  polyOut(roof, [add(front[3], add(o, [0, 0, 0.15])), add(front[2], o), back[2], back[3]], c)
}
/** A hipped roof over a rectangle, its ridge along x, `rh` either side of the middle. */
function hipRoof(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, rh: number, alongY = false) {
  const xm = (x0 + x1) / 2, ym = (y0 + y1) / 2
  const c: V3 = [xm, ym, z0]
  const a: V3 = [x0, y0, z0], b: V3 = [x1, y0, z0], d: V3 = [x1, y1, z0], e: V3 = [x0, y1, z0]
  if (alongY) {
    const r0: V3 = [xm, ym - rh, z1], r1: V3 = [xm, ym + rh, z1]
    polyOut(p, [b, d, r1, r0], c)
    polyOut(p, [e, a, r0, r1], c)
    polyOut(p, [a, b, r0], c)
    polyOut(p, [d, e, r1], c)
    return
  }
  const r0: V3 = [xm - rh, ym, z1], r1: V3 = [xm + rh, ym, z1]
  polyOut(p, [a, b, r1, r0], c)
  polyOut(p, [d, e, r0, r1], c)
  polyOut(p, [b, d, r1], c)
  polyOut(p, [e, a, r0], c)
}

// ---- The model, at one level of detail -------------------------------------------------

type Parts = { granite: Part; trim: Part; slate: Part; blue: Part; glass: Part; lamp: Part }

function build(hi: boolean): Parts {
  const M: Parts = { granite: new Part(), trim: new Part(), slate: new Part(), blue: new Part(), glass: new Part(), lamp: new Part() }
  const { granite, trim, slate, blue, glass, lamp } = M
  const A = hi ? 8 : 4 // segments per arch half
  let last = 0
  const tally = (what: string) => {
    const n = Object.values(M).reduce((k, p) => k + p.triangles, 0)
    if (process.env.DEBUG) console.log(`  ${hi ? 'detail' : 'low'} ${what}: ${n - last}`)
    last = n
  }

  /**
   * A block pierced by a pointed arch along y: side walls, the mass over
   * the arch from zs up to z1, the spandrels and the soffit. (xc, yc) is its
   * centre, hx/hy its half sizes.
   */
  function archBlock(xc: number, yc: number, hx: number, hy: number, z0: number, zs: number, z1: number, ahw: number, spring: number, rise: number, top: Part | null) {
    box(granite, xc + ahw, xc + hx, yc - hy, yc + hy, z0, zs, 0, null)
    box(granite, xc - hx, xc - ahw, yc - hy, yc + hy, z0, zs, 0, null)
    box(granite, xc - hx, xc + hx, yc - hy, yc + hy, zs, z1, 0, top)
    const curve = ogive(ahw, rise, A).map(([x, z]) => [xc + x, spring + z] as P2)
    for (const s of [-1, 1]) {
      const y = yc + s * hy
      for (let i = 0; i < curve.length - 1; i++) {
        const [xa, za] = curve[i], [xb, zb] = curve[i + 1]
        poly(granite, [[xa, y, za], [xb, y, zb], [xb, y, zs], [xa, y, zs]], [0, s, 0])
      }
      // The archivolt: a proud band round the arch.
      const ring = ogive(ahw + 0.55, rise + 0.55, A).map(([x, z]) => [xc + x, spring + z] as P2)
      for (let i = 0; i < curve.length - 1; i++) {
        const q = (pt: P2, d: number): V3 => [pt[0], y + s * d, pt[1]]
        poly(trim, [q(curve[i], 0.3), q(curve[i + 1], 0.3), q(ring[i + 1], 0.3), q(ring[i], 0.3)], [0, s, 0])
        if (!hi) continue
        poly(trim, [q(ring[i], 0), q(ring[i + 1], 0), q(ring[i + 1], 0.3), q(ring[i], 0.3)], mul(inward(ring[i], ring[i + 1]), -1))
        poly(trim, [q(curve[i], 0), q(curve[i + 1], 0), q(curve[i + 1], 0.3), q(curve[i], 0.3)], inward(curve[i], curve[i + 1]))
      }
    }
    // Soffit, facing into the opening.
    for (let i = 0; i < curve.length - 1; i++) {
      const [xa, za] = curve[i], [xb, zb] = curve[i + 1]
      poly(granite, [[xa, yc - hy, za], [xb, yc - hy, zb], [xb, yc + hy, zb], [xa, yc + hy, za]], inward(curve[i], curve[i + 1]))
    }
    // The side walls of the passage face in: box() faced them out from their own blocks, which is inward here.
  }

  // ---- River piers ----------------------------------------------------------------
  function pierPlan(cy: number, r: number, nose: number): P2[] {
    const n = hi ? 10 : 6, out: P2[] = []
    for (const [cx, a0] of [[PIER_X, -Math.PI / 2], [-PIER_X, Math.PI / 2]] as const)
      for (let i = 0; i <= n; i++) {
        const a = a0 + (Math.PI * i) / n
        const rr = r + (i === n / 2 ? nose : 0)
        out.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)])
      }
    return out
  }
  function pier(cy: number) {
    const sloped = pierPlan(cy, PIER_HY + 1.3, 1.6), wall = pierPlan(cy, PIER_HY, 0)
    prism(granite, sloped, 0, 1.6, null, null, true)
    // The starling's sloped top.
    for (let i = 0; i < wall.length; i++) {
      const j = (i + 1) % wall.length
      polyOut(granite, [[...sloped[i], 1.6], [...sloped[j], 1.6], [...wall[j], 2.8], [...wall[i], 2.8]], [0, cy, -20])
    }
    prism(granite, wall, 2.8, PIER_TOP, granite, null, true)
    // Coping: a proud band under the top.
    const cope = pierPlan(cy, PIER_HY + 0.3, 0)
    prism(trim, cope, PIER_TOP - 0.7, PIER_TOP - 0.1, trim, hi ? trim : null, true)
    if (hi) {
      // The parapet round the edge, open where the deck lands.
      const edge = pierPlan(cy, PIER_HY - 0.25, 0)
      for (let i = 0; i < edge.length; i++) {
        const a = edge[i], b = edge[(i + 1) % edge.length]
        if (Math.abs(a[1] - b[1]) < 0.01 && Math.max(Math.abs(a[0]), Math.abs(b[0])) <= PIER_X + 0.01) {
          // A straight face: wall only outside the deck's width.
          for (const s of [-1, 1]) bar(granite, [s * 10.2, a[1], PIER_TOP + 0.55], [s * PIER_X, a[1], PIER_TOP + 0.55], 0.5, 1.1, true)
          continue
        }
        bar(granite, [a[0], a[1], PIER_TOP + 0.55], [b[0], b[1], PIER_TOP + 0.55], 0.5, 1.1, true)
      }
    }
  }

  // ---- The main towers ------------------------------------------------------------
  function turret(cx: number, cy: number) {
    const r = TUR.r, k = hi ? 8 : 6 // octagonal; hexagonal in the low model
    prism(granite, ngon(cx, cy, r, k), PIER_TOP, TUR.shaft, slate, null, true)
    prism(granite, ngon(cx, cy, r * 0.95, k), TUR.shaft, TUR.belfry, null, null, true)
    prism(trim, ngon(cx, cy, r * 1.12, k), TUR.belfry, TUR.cornice, trim, hi ? trim : null, true)
    pyramid(granite, ngon(cx, cy, r * 0.95, k), TUR.cornice, [cx, cy, TUR.spire])
    // Belfry openings, one on each face, as dark lancets.
    const rr = r * 0.95 * Math.cos(Math.PI / k)
    for (let i = 0; i < k; i += hi ? 1 : 2) {
      const a = (2 * Math.PI * i) / k
      const n: V3 = [Math.cos(a), Math.sin(a), 0]
      const f: Face = { o: [cx + n[0] * rr, cy + n[1] * rr, 0], u: [-n[1], n[0], 0], n }
      panel(glass, f, -0.42, 0.42, TUR.shaft + 0.8, TUR.belfry - 1.3, 0.04, 0.45)
    }
    if (hi) {
      for (const z of [...SC, CORN]) prism(trim, ngon(cx, cy, r * 1.08, 8), z, z + 0.5, trim, null, true)
      rod(trim, [cx, cy, TUR.spire - 0.3], [cx, cy, TUR.finial], 0.1, 4)
      bar(trim, [cx - 0.45, cy, TUR.finial - 0.55], [cx + 0.45, cy, TUR.finial - 0.55], 0.14, 0.14, true)
      bar(trim, [cx, cy - 0.45, TUR.finial - 0.55], [cx, cy + 0.45, TUR.finial - 0.55], 0.14, 0.14, true)
      // Crockets: little ribs up the spire's corners would shimmer; a collar halfway instead.
      prism(trim, ngon(cx, cy, r * 0.62, 8), (TUR.cornice + TUR.spire) / 2 - 0.25, (TUR.cornice + TUR.spire) / 2 + 0.15, trim, trim)
    }
  }

  function tower(sy: number) {
    const cy = sy * TY
    pier(cy)
    archBlock(0, cy, HX, HY, PIER_TOP, SC[0], BATT, ARCH_HW, ARCH_SPRING, ARCH_RISE, slate)
    for (const sx of [-1, 1]) for (const ty of [-1, 1]) turret(sx * TUR.x, cy + ty * TUR.y)

    // String courses and the cornice.
    const courses = hi ? SC : [SC[0], SC[2]]
    for (const z of courses) box(trim, -HX - 0.25, HX + 0.25, cy - HY - 0.25, cy + HY + 0.25, z, z + 0.6, 0, trim, hi ? trim : null)
    box(trim, -HX - 0.4, HX + 0.4, cy - HY - 0.4, cy + HY + 0.4, CORN, CORN + 0.55, 0, trim, trim)

    // Battlements round the roof: merlons along each face between the turrets.
    const merlon = (f: Face, u0: number, u1: number, n: number) => {
      const step = (u1 - u0) / n
      for (let i = 0; i < n; i++) relief(granite, f, u0 + i * step + step * 0.22, u0 + (i + 1) * step - step * 0.22, BATT, BATT + 0.75, -0.55, 0)
    }
    const faces = {
      yOut: (s: number): Face => ({ o: [0, cy + s * HY, 0], u: [-s, 0, 0], n: [0, s, 0] }),
      xOut: (s: number): Face => ({ o: [s * HX, cy, 0], u: [0, s, 0], n: [s, 0, 0] }),
    }
    if (hi) for (const s of [-1, 1]) {
      merlon(faces.yOut(s), -7.6, 7.6, 9)
      merlon(faces.xOut(s), -3.3, 3.3, 4)
    } else for (const s of [-1, 1]) {
      // A low model keeps the parapet's line as one band.
      relief(granite, faces.yOut(s), -7.8, 7.8, BATT, BATT + 0.5, -0.55, 0)
      relief(granite, faces.xOut(s), -3.4, 3.4, BATT, BATT + 0.5, -0.55, 0)
    }

    // The hipped slate roof, its crown and dormers.
    hipRoof(slate, -ROOF_HX, ROOF_HX, cy - ROOF_HY, cy + ROOF_HY, EAVE, RIDGE, RIDGE_HALF)
    for (const s of [-1, 1]) {
      const fy: Face = { o: [0, cy + s * (HY - 0.35), 0], u: [-s, 0, 0], n: [0, s, 0] }
      dormer(granite, slate, fy, 0, 5.6, BATT - 0.6, 54.4, 57.2, HY - 0.4)
      panel(glass, fy, -2.0, -0.35, BATT + 0.5, 54.0, 0.05, 0.6)
      panel(glass, fy, 0.35, 2.0, BATT + 0.5, 54.0, 0.05, 0.6)
      const fx: Face = { o: [s * (HX - 0.35), cy, 0], u: [0, s, 0], n: [s, 0, 0] }
      dormer(granite, slate, fx, 0, 3.6, BATT - 0.6, 53.0, 54.9, 5.0)
      panel(glass, fx, -0.9, 0.9, BATT + 0.4, 52.7, 0.05, 0.5)
      if (hi) {
        // Pinnacles at the big dormers' shoulders.
        for (const u of [-3.0, 3.0]) {
          const [px, py] = at(fy, u, 0, 0.1)
          prism(granite, ngon(px, py, 0.32, 6), BATT, 55.6, null)
          pyramid(granite, ngon(px, py, 0.32, 6), 55.6, [px, py, 57.0])
        }
        relief(trim, fy, -2.9, 2.9, 54.3, 54.6, 0, 0.2)
      }
    }
    // The crown: gilt cresting along the ridge, drawn in the white trim.
    box(trim, -RIDGE_HALF - 0.2, RIDGE_HALF + 0.2, cy - 0.3, cy + 0.3, RIDGE - 0.2, RIDGE + 0.7, 0, trim)
    if (hi) {
      for (const u of stations(-RIDGE_HALF, RIDGE_HALF, 0.75)) bar(trim, [u, cy, RIDGE + 0.6], [u, cy, RIDGE + 1.7], 0.14, 0.14, true)
      box(trim, -RIDGE_HALF, RIDGE_HALF, cy - 0.12, cy + 0.12, RIDGE + 1.6, RIDGE + 1.85, 0, trim, trim)
      rod(trim, [0, cy, RIDGE + 0.6], [0, cy, RIDGE + 3.1], 0.12, 4)
      bar(trim, [-0.5, cy, RIDGE + 2.6], [0.5, cy, RIDGE + 2.6], 0.16, 0.16, true)
      for (const u of [-RIDGE_HALF, RIDGE_HALF]) pyramid(trim, ngon(u, cy, 0.25, 4), RIDGE + 0.7, [u, cy, RIDGE + 2.3])
    } else {
      pyramid(trim, ngon(0, cy, 0.45, 4), RIDGE + 0.7, [0, cy, RIDGE + 3.0])
    }

    // Windows: grouped lancets, on every face. The inner face keeps the
    // middle of its top stage only, between the walkways.
    const win = (f: Face, u0: number, u1: number, z0: number, z1: number, head: number) => {
      panel(glass, f, u0, u1, z0, z1, 0.05, head)
      if (!hi) return
      // A proud hood and sill in the trim.
      relief(trim, f, u0 - 0.25, u1 + 0.25, z0 - 0.35, z0, 0, 0.22)
      relief(trim, f, u0 - 0.25, u0, z0, z1 + head * 0.5, 0, 0.16, false)
      relief(trim, f, u1, u1 + 0.25, z0, z1 + head * 0.5, 0, 0.16, false)
      const hood = [at(f, u0 - 0.3, z1 + head * 0.5, 0), at(f, (u0 + u1) / 2, z1 + head + 0.35, 0), at(f, u1 + 0.3, z1 + head * 0.5, 0)]
      // Hood moulds on the big lancets only.
      if (head >= 0.9) for (let i = 0; i < 2; i++) bar(trim, add(hood[i], mul(f.n, 0.11)), add(hood[i + 1], mul(f.n, 0.11)), 0.22, 0.25, true)
    }
    for (const s of [-1, 1]) {
      const outer = s === sy
      const fy = faces.yOut(s)
      win(fy, -1.5, 1.5, 22.6, 27.4, 0.9)
      if (hi) for (const u of [-1, 1]) win(fy, u * 3.4, u * 5.4, 23.2, 27.0, 0.6)
      win(fy, -2.0, 2.0, 32.0, 37.2, 1.3)
      for (const u of [-1, 1]) win(fy, u * 4.0, u * 5.6, 32.6, 36.6, 0.6)
      for (const u of [-1, 1]) win(fy, u * 0.5, u * 2.3, 41.2, 46.6, 0.6)
      if (outer) for (const u of [-1, 1]) win(fy, u * 3.6, u * 5.4, 41.2, 46.6, 0.6)
      const fx = faces.xOut(s)
      if (hi) for (const u of [-1, 1]) win(fx, u * 0.45, u * 2.2, 13.6, 18.4, 0.5)
      for (const u of [-1, 1]) win(fx, u * 0.45, u * 2.2, 23.0, 27.6, 0.5)
      win(fx, -1.7, 1.7, 32.0, 37.0, 1.1)
      for (const u of [-1, 1]) win(fx, u * 0.45, u * 2.2, 41.2, 46.6, 0.5)
    }
    if (hi) {
      // The oriel balconies under the top-stage windows of the outer faces, as corbelled ledges.
      for (const s of [-1, 1]) relief(trim, faces.yOut(s), -2.8, 2.8, 39.1, 40.6, 0, 0.7)
    }
  }

  // Huts on the piers (OSM parts), stone with slate roofs; the north pier's exhibition annex.
  function hut(x0: number, x1: number, y0: number, y1: number) {
    box(granite, x0, x1, y0, y1, PIER_TOP, 13.2, hi ? 0.3 : 0, null)
    box(trim, x0 - 0.2, x1 + 0.2, y0 - 0.2, y1 + 0.2, 13.0, 13.4, hi ? 0.3 : 0, null)
    const alongX = x1 - x0 >= y1 - y0
    const rh = Math.max(0.2, Math.abs((x1 - x0) - (y1 - y0)) / 2)
    hipRoof(slate, x0, x1, y0, y1, 13.4, 15.2, rh, !alongX)
  }
  hut(-22.8, -16.2, -38.8, -33.2)
  hut(16.2, 20.8, -38.8, -33.2)
  hut(15.9, 20.1, 33.5, 39.2)
  box(granite, -16.2, -10.2, 36.0, 45.9, PIER_TOP, 13.6, 2.4, granite)
  box(trim, -16.4, -10.2, 35.8, 46.1, 13.3, 13.9, 2.5, trim)

  tally('huts')
  tower(-1)
  tally('tower S')
  tower(1)
  tally('tower N')

  // ---- High-level walkways -------------------------------------------------------------
  for (const sx of [-1, 1]) {
    const xc = sx * WALK.xc, y0 = -WALK.y, y1 = WALK.y
    const { z0, z1 } = WALK
    const ys = [y0, y1]
    const edges = [xc - WALK.hw, xc + WALK.hw]
    // Floor and roof.
    band(trim, edges[0], edges[1], ys, () => z0 + 0.55, () => z0 + 0.25, { top: true, bottom: true })
    band(blue, edges[0], edges[1], ys, () => z1, () => z1 - 0.3, { top: true, bottom: false })
    for (const e of edges) {
      const o = Math.sign(e - xc)
      // Bottom chord (white) and top chord (blue) along each side.
      band(trim, e - o * 0.5, e, ys, () => z0 + 1.1, () => z0, { out: true, in: true, top: true, bottom: true })
      band(blue, e - o * 0.55, e + o * 0.05, ys, () => z1, () => z1 - 0.9, { out: true, in: true, bottom: true })
      // The glazing behind the lattice, which reads pale blue by day (it
      // mirrors the sky and the paint) and lit at night, as the walkways' wash.
      const xg = e - o * 0.4
      for (const k of [-1, 1]) poly(blue, [[xg, y0, z0 + 1.1], [xg, y1, z0 + 1.1], [xg, y1, z1 - 0.9], [xg, y0, z1 - 0.9]], [k, 0, 0])
      // The lattice: posts and crossed diagonals in the side's plane, real members.
      const bay = hi ? 3 : 7.8
      const ps = stations(y0, y1, bay)
      const xm = e - o * 0.12, za = z0 + 1.1, zb = z1 - 0.9
      for (let i = 0; i < ps.length; i++) {
        if (hi || i % 2 === 0) bar(trim, [xm, ps[i], za], [xm, ps[i], zb], 0.3, hi ? 0.32 : 0.45)
        if (i === ps.length - 1) continue
        const ya = ps[i], yb = ps[i + 1]
        if (hi) {
          bar(trim, [xm, ya, za], [xm, yb, zb], 0.22, 0.22)
          bar(trim, [xm, ya, zb], [xm, yb, za], 0.22, 0.22)
        } else {
          rod(trim, [xm, ya, za], [xm, yb, zb], 0.2, 3)
          rod(trim, [xm, ya, zb], [xm, yb, za], 0.2, 3)
        }
      }
      if (hi) {
        // Decorative posts standing above the top chord, and lamps under the bottom chord.
        for (const y of stations(y0 + 7, y1 - 7, 14)) box(trim, e - 0.3, e + 0.3, y - 0.3, y + 0.3, z1 - 0.9, z1 + 0.55, 0.08, trim)
        for (const y of stations(y0 + 3, y1 - 3, 6)) bead(lamp, [e + o * 0.15, y, z0 - 0.25], 0.32)
      } else if (o === Math.sign(xc)) {
        for (const y of stations(y0 + 6, y1 - 6, 12)) bead(lamp, [e + o * 0.2, y, z0 - 0.4], 0.8, true)
      }
    }
    // The City's arms on the outer walkway's middle, a little gabled crest on the top.
    const ex = xc + Math.sign(xc) * (WALK.hw - 0.2)
    box(trim, ex - 0.25, ex + 0.25, -1.0, 1.0, z1, z1 + 1.2, 0, trim)
    pyramid(trim, rect(ex - 0.25, ex + 0.25, -1.0, 1.0), z1 + 1.2, [ex, 0, z1 + 2.0])
    if (hi) {
      // Lateral bracing under the floor.
      for (const [ya, yb] of stations(y0, y1, 6).slice(0, -1).map((y) => [y, y + 6]))
        for (const [xa, xb] of [[edges[0], edges[1]], [edges[1], edges[0]]])
          bar(trim, [xa, ya, z0 + 0.15], [xb, Math.min(yb, y1), z0 + 0.15], 0.18, 0.18)
    }
  }

  tally('walkways')
  // ---- Deck: bascules, side spans, approaches ----------------------------------------
  const deck = (y0: number, y1: number, depth: (y: number) => number, kind: 'bascule' | 'span') => {
    const ys = stations(y0, y1, hi ? (kind === 'bascule' ? 2.5 : 5) : kind === 'bascule' ? 10 : 14)
    const coarse = stations(y0, y1, hi ? 5 : 14)
    for (const s of [-1, 1]) {
      const x0 = s * (GX - 0.25), x1 = s * (GX + 0.25)
      const bot = (y: number) => road(y) - depth(y)
      if (!hi) {
        band(blue, x0, x1, ys, (y) => road(y) + 1.25, bot, { out: true, in: true, top: true, bottom: true, ends: true })
        band(trim, s * (GX - 0.3), s * (GX + 0.3), ys, (y) => road(y) + 1.4, (y) => road(y) + 1.25, { out: true, top: true })
        continue
      }
      // Detail: a girder below the roadway, a parapet above it.
      const ps = stations(y0, y1, kind === 'bascule' ? 2.5 : 3.0)
      if (kind === 'bascule') {
        // An open lattice girder: chords and crossed diagonals.
        band(blue, x0, x1, coarse, (y) => road(y) - 0.1, (y) => road(y) - 0.7, { out: true, in: true, top: true, bottom: true, ends: true })
        band(blue, x0, x1, ys, (y) => bot(y) + 0.6, bot, { out: true, in: true, top: true, bottom: true, ends: true })
        for (let i = 0; i < ps.length; i++) {
          bar(blue, [s * GX, ps[i], bot(ps[i]) + 0.6], [s * GX, ps[i], road(ps[i]) - 0.7], 0.45, 0.3)
          if (i === ps.length - 1) continue
          const ya = ps[i], yb = ps[i + 1]
          bar(trim, [s * GX, ya, bot(ya) + 0.6], [s * GX, yb, road(yb) - 0.7], 0.3, 0.2)
          bar(trim, [s * GX, ya, road(ya) - 0.7], [s * GX, yb, bot(yb) + 0.6], 0.3, 0.2)
        }
      } else {
        band(blue, x0, x1, coarse, (y) => road(y) - 0.1, bot, { out: true, in: true, top: true, bottom: true, ends: true })
        // Stiffeners on the girder's outer face.
        for (const y of ps.filter((_, i) => i % 2)) box(blue, s * GX + (s > 0 ? 0.25 : -0.4), s * GX + (s > 0 ? 0.4 : -0.25), y - 0.15, y + 0.15, bot(y), road(y) - 0.1, 0, null)
      }
      // Parapet: a panel band between posts, a white top rail.
      band(blue, s * (GX - 0.06), s * (GX + 0.06), coarse, (y) => road(y) + 1.05, (y) => road(y) - 0.1, { out: true, in: true })
      band(trim, s * (GX - 0.2), s * (GX + 0.2), coarse, (y) => road(y) + 1.25, (y) => road(y) + 1.05, { out: true, in: true, top: true, bottom: true, ends: true })
      for (const y of ps) box(blue, s * GX - 0.17, s * GX + 0.17, y - 0.17, y + 0.17, road(y) - 0.1, road(y) + 1.35, 0, blue)
      // Roundels on the outer face of each panel.
      if (kind === 'span')
        for (let i = 0; i < ps.length - 1; i += 2) {
          const y = (ps[i] + ps[i + 1]) / 2
          const f: Face = { o: [s * (GX + 0.06), y, 0], u: [0, -s, 0], n: [s, 0, 0] }
          const ring = ngon(0, 0, 0.33, 8).map(([u, v]) => at(f, u, road(y) + 0.5 + v, 0.03))
          poly(trim, ring, f.n)
        }
      // Lamp standards every 24 m.
      for (const y of stations(y0, y1, 24).slice(1, -1)) {
        rod(blue, [s * GX, y, road(y) + 1.3], [s * GX, y, road(y) + 4.4], 0.1, 4)
        bead(lamp, [s * GX, y, road(y) + 4.6], 0.35)
      }
    }
    // The underside, facing down, and floor beams in the detail.
    band(blue, -GX, GX, coarse, (y) => road(y) - 1.0, (y) => road(y) - 1.0, { bottom: true })
    if (hi) for (const y of stations(y0, y1, 10)) band(blue, -GX, GX, [y - 0.25, y + 0.25], () => road(y) - 1.0, () => road(y) - 1.6, { bottom: true, ends: true })
  }
  // Bascules: deeper at the hinge, shallow at the tip.
  for (const sy of [-1, 1]) {
    const [a, b] = sy < 0 ? [-PI_, -0.08] : [0.08, PI_]
    deck(a, b, (y) => 1.5 + 2.7 * (Math.abs(y) / PI_) ** 2, 'bascule')
  }
  for (const sy of [-1, 1]) {
    const { face, back, end } = ABUT[sy]
    const [a, b] = sy < 0 ? [-face, -PF] : [PF, face]
    deck(a, b, () => 1.7, 'span')
    const [c, d] = sy < 0 ? [-end, -back] : [back, end]
    deck(c, d, () => 1.7, 'span')
    // The outline's end: an abutment wall from the ground up under the roadway.
    const ye = sy * end
    footedLoft(granite, ground, [
      { plan: rect(-GX - 0.4, GX + 0.4, Math.min(ye, ye - sy * 1.5), Math.max(ye, ye - sy * 1.5)), z: 'ground' },
      { plan: rect(-GX - 0.4, GX + 0.4, Math.min(ye, ye - sy * 1.5), Math.max(ye, ye - sy * 1.5)), z: road(ye) - 1.75 },
    ], hi ? 2.5 : 5)
  }

  tally('deck')
  // ---- Side-span chains and hangers -----------------------------------------------------
  for (const sy of [-1, 1]) {
    const tA = ABUT[sy].face, tV = TF + 0.628 * (tA - TF)
    const zF = 45.4, zV = 12.0, a = (zF - zV) / (tV - TF) ** 2
    const top = (t: number) => zV + a * (t - tV) ** 2
    // The river segment is a lens, its chords meeting at the tower and at the
    // medallion; the shore segment opens out toward the abutment tower.
    const spread = (t: number) => {
      // Deepest a third of the way out from the tower, as in Diliff's photo.
      const u = (t - TF) / (tV - TF)
      return t <= tV ? 28.4 * u * (1 - u) ** 2 : 3.2 * ((t - tV) / (tA - tV)) ** 2
    }
    const CH = hi ? 0.7 : 0.9 // chord depth
    const bot = (t: number) => Math.max(top(t) - 2 * CH - Math.max(0, spread(t)), Math.min(top(t) - 2 * CH, road(sy * t) + 1.45))
    const xOf = (t: number) => 7.0 + 2.0 * smooth((t - TF) / 18)
    const hangers = stations(TF + 8.0, tA - 4, 8.4).filter((t) => bot(t) - (road(sy * t) + 1.25) > 0.5)
    for (const sx of [-1, 1]) {
      const P = (t: number, z: number): V3 => [sx * xOf(t), sy * t, z]
      const seg = (t0: number, t1: number, n: number) => stations(t0, t1, (t1 - t0) / n)
      const ts = [...seg(TF - 1.2, tV, hi ? 18 : 6), ...seg(tV, tA + 1.2, hi ? 10 : 3).slice(1)]
      beam(blue, ts.map((t) => P(t, top(t) - CH / 2)), hi ? 0.6 : 0.8, CH)
      beam(blue, ts.map((t) => P(t, bot(t) + CH / 2)), hi ? 0.6 : 0.8, CH)
      if (!hi) {
        // The low model: the web as a pale plate set back between the chords,
        // so each chain reads as one bold lattice band from the map.
        for (let i = 0; i < ts.length - 1; i++) {
          const ta = ts[i], tb = ts[i + 1]
          if (top(ta) - bot(ta) - 2 * CH < 0.15 && top(tb) - bot(tb) - 2 * CH < 0.15) continue
          for (const k of [-1, 1]) {
            const o = (t: number, z: number): V3 => add(P(t, z), [k * 0.12, 0, 0])
            poly(trim, [o(ta, bot(ta) + CH), o(tb, bot(tb) + CH), o(tb, top(tb) - CH), o(ta, top(ta) - CH)], [k, 0, 0])
          }
        }
      }
      // Lattice between the chords: posts at the hangers, crossed diagonals between.
      const nodes = [TF + 1.5, ...hangers.filter((t) => t < tA - 2), tA - 1.0].filter((t, i, l) => i === 0 || t - l[i - 1] > 2)
      for (let i = 0; i < nodes.length; i++) {
        const t = nodes[i], gap = top(t) - CH - (bot(t) + CH)
        if (gap > 0.4 && (hi || i % 2 === 0)) bar(hi ? trim : blue, P(t, bot(t) + CH), P(t, top(t) - CH), hi ? 0.35 : 0.5, hi ? 0.3 : 0.45)
        if (i === nodes.length - 1) continue
        const t2 = nodes[i + 1]
        const subs = hi ? 2 : 1
        for (let k = 0; k < subs; k++) {
          const ta = t + ((t2 - t) * k) / subs, tb = t + ((t2 - t) * (k + 1)) / subs
          const ga = top(ta) - CH - (bot(ta) + CH), gb = top(tb) - CH - (bot(tb) + CH)
          if (Math.min(ga, gb) < 0.5) continue
          const A1 = P(ta, bot(ta) + CH), B1 = P(tb, top(tb) - CH), A2 = P(ta, top(ta) - CH), B2 = P(tb, bot(tb) + CH)
          if (hi) { bar(trim, A1, B1, 0.3, 0.32); bar(trim, A2, B2, 0.3, 0.32) }
        }
      }
      // The medallion at the chain's low point: the City's arms in a blue ring.
      const mz = top(tV) - CH
      const mf: Face = { o: [sx * (xOf(tV) + 0.32), sy * tV, 0], u: [0, -sy * sx, 0], n: [sx, 0, 0] }
      const disc = (r: number, d: number) => ngon(0, 0, r, hi ? 14 : 8).map(([u, v]) => at(mf, u, mz + v, d))
      // A short drum across the chain's plane, its faces white inside a blue ring.
      const front = disc(1.15, 0.25), back = disc(1.15, -0.85)
      for (let i = 0; i < front.length; i++) {
        const j = (i + 1) % front.length
        polyOut(blue, [front[i], front[j], back[j], back[i]], at(mf, 0, mz, -0.3))
      }
      poly(blue, front, mf.n)
      poly(blue, [...back].reverse(), mul(mf.n, -1))
      poly(trim, disc(0.82, 0.29), mf.n)
      poly(trim, [...disc(0.82, -0.89)].reverse(), mul(mf.n, -1))
      // Hangers, from the lower chord down into the girder.
      if (hi) for (const t of hangers) {
        const x = sx * xOf(t)
        rod(trim, [x, sy * t, road(sy * t) - 0.2], [x, sy * t, bot(t) + 0.1], 0.17, 4)
      }
      // Lamps along the top of each chain.
      const lit = hi ? stations(TF + 3, tA - 2, 5) : stations(TF + 8, tA - 6, 16)
      for (const t of lit) bead(lamp, P(t, top(t) + (hi ? 0.3 : 0.7)), hi ? 0.3 : 0.8, !hi)
    }
  }

  tally('chains')
  // ---- Abutment towers ------------------------------------------------------------------
  for (const sy of [-1, 1]) {
    const { face, back } = ABUT[sy]
    const yc = sy * (face + back) / 2, hy = (back - face) / 2, hx = 11.2
    const rd = road(yc)
    // Under the roadway: 0.3 m below its lowest point over the base.
    const base = Math.min(road(sy * back), road(sy * (back + 2))) - 0.3
    const plan = rect(-hx, hx, yc - hy, yc + hy)
    // The base, from the ground up to just under the roadway; on the south
    // bank it is the wider block of the Bridgemaster's Dining Room.
    const basePlan = sy < 0 ? rect(-13.1, 16.6, -143.7, -133.9) : plan
    footedLoft(granite, ground, [{ plan: basePlan, z: 'ground' }, { plan: basePlan, z: base }], 2.5)
    const WALL = 23.2, BAT = 24.0
    // A broad arch carries the roadway and both pavements through.
    archBlock(0, yc, hx, hy, base, rd + 12.6, BAT, 7.4, rd + 4.3, 7.6, slate)
    // The corbelled cornice under the battlements, and an impost band.
    box(trim, -hx - 0.35, hx + 0.35, yc - hy - 0.35, yc + hy + 0.35, WALL - 0.3, WALL + 0.5, 0, trim, trim)
    if (hi) box(trim, -hx - 0.2, hx + 0.2, yc - hy - 0.2, yc + hy + 0.2, rd + 3.9, rd + 4.3, 0, trim, trim)
    const fy = (s: number): Face => ({ o: [0, yc + s * hy, 0], u: [-s, 0, 0], n: [0, s, 0] })
    const fx = (s: number): Face => ({ o: [s * hx, yc, 0], u: [0, s, 0], n: [s, 0, 0] })
    for (const s of [-1, 1]) {
      // Battlements, lancets on the ends, a dormer with the City's arms.
      if (hi) {
        const f = fy(s), n = 7
        for (let i = 0; i < n; i++) relief(granite, f, -8.4 + (16.8 * (i + 0.25)) / n, -8.4 + (16.8 * (i + 0.75)) / n, BAT, BAT + 0.7, -0.5, 0)
        relief(granite, fx(s), -0.6, 0.6, BAT, BAT + 0.7, -0.5, 0)
      } else relief(granite, fy(s), -8.6, 8.6, BAT, BAT + 0.45, -0.5, 0)
      for (const z of [rd + 2.0, rd + 9.4]) panel(glass, fx(s), -0.6, 0.6, z, z + 4.0, 0.05, 0.6)
      const dy: Face = { o: [0, yc + s * (hy - 0.3), 0], u: [-s, 0, 0], n: [0, s, 0] }
      dormer(granite, slate, dy, 0, 3.8, BAT - 0.5, 26.6, 28.8, hy - 0.5)
      if (hi) {
        // The arms: a shield on the dormer's face.
        const sh = [at(dy, -0.9, 25.4, 0.08), at(dy, 0.9, 25.4, 0.08), at(dy, 0.9, 27.0, 0.08), at(dy, 0, 27.6, 0.08), at(dy, -0.9, 27.0, 0.08)]
        poly(trim, sh, dy.n)
      } else panel(trim, dy, -0.9, 0.9, 25.4, 27.0, 0.08, 0.6)
    }
    hipRoof(slate, -hx + 1.4, hx - 1.4, yc - hy + 0.8, yc + hy - 0.8, BAT - 0.2, 30.0, hx - 1.4 - (hy - 0.8) * 0.9)
    // Square corner turrets, a little above the battlements, with corbelled crenellated tops.
    for (const sx of [-1, 1]) for (const s of [-1, 1]) {
      const cx = sx * (hx - 0.9), cy = yc + s * (hy - 0.9)
      box(granite, cx - 1.4, cx + 1.4, cy - 1.4, cy + 1.4, base, 25.6, hi ? 0.25 : 0, granite)
      box(trim, cx - 1.65, cx + 1.65, cy - 1.65, cy + 1.65, 24.5, 25.1, hi ? 0.3 : 0, trim, hi ? trim : null)
      if (hi) for (const [u, v] of [[-1, -1], [1, -1], [1, 1], [-1, 1], [0, -1], [1, 0], [0, 1], [-1, 0]])
        box(granite, cx + u * 1.2 - 0.32, cx + u * 1.2 + 0.32, cy + v * 1.2 - 0.32, cy + v * 1.2 + 0.32, 25.6, 26.3, 0, granite)
    }
    // The ridge's spire finials, lead-grey.
    const rh = hx - 1.4 - (hy - 0.8) * 0.9
    for (const sx of [-1, 1]) {
      const cx = sx * rh
      prism(slate, ngon(cx, yc, 0.42, 6), 29.6, 30.8, null)
      pyramid(slate, ngon(cx, yc, 0.42, 6), 30.8, [cx, yc, 33.4])
    }
  }
  tally('abutments')
  return M
}

// The south abutment and approach follow OSM's road line, 1 m east of the axis there.
function shearSouth(p: Part) {
  for (let i = 0; i < p.pos.length; i += 3) {
    const y = -p.pos[i + 2]
    p.pos[i] += SHEAR * smooth((-y - (PF + 10)) / (ABUT[-1].face - PF - 10))
  }
}

// ---- Night ---------------------------------------------------------------------------
// The stone is floodlit from the piers and the deck: brightest low on the
// towers, fading a little toward the roofs; faces looking up barely lit.
// The walkways carry strip lights and read lit; the chains carry a line of
// lights along their top.
const stoneLit = (p: V3, n: V3): number => {
  const ay = Math.abs(p[1])
  const inTower = Math.abs(ay - TY) <= PIER_HY + 1.6 && Math.abs(p[0]) <= PIER_X + PIER_HY + 3
  const inAbut = ay >= 130 && ay <= 145 && Math.abs(p[0]) <= 18
  if (!inTower && !inAbut) {
    // Walkways.
    if (ay <= WALK.y + 0.1 && p[2] > WALK.z0 - 0.6 && p[2] < WALK.z1 + 2.5) return 0.55
    return 0
  }
  // Lit evenly from the piers and the deck up (Oates's and The wub's photos),
  // the piers below the deck a little dimmer.
  if (p[2] < PIER_TOP - 0.2) return 0.5 * (n[2] > 0.7 ? 0.3 : 1)
  const top = inTower ? RIDGE + 3 : 33
  const h = 0.85 + 0.15 * Math.min(1, Math.max(0, p[2] - 10) / (top - 10))
  return h * (n[2] > 0.7 ? 0.3 : 1)
}
const steelLit = (p: V3): number => {
  const ay = Math.abs(p[1])
  if (ay <= WALK.y + 0.1 && p[2] > WALK.z0 - 0.6) return 0.8
  if (ay > TF - 1 && ay < 136 && p[2] > road(p[1]) + 1.6 && Math.abs(p[0]) > 7 && Math.abs(p[0]) < 10) return 0.8
  return 0
}

// ---- Write -------------------------------------------------------------------------------

const materials = (parts: Parts) => [
  { part: parts.granite, material: { ...finish('granite', 0xd5cdbf), floodlight: stoneLit } },
  { part: parts.trim, material: { name: 'trim', color: 0xf1ede5, roughness: 0.85, floodlight: stoneLit, doubleSided: false } },
  { part: parts.slate, material: { ...finish('slate', 0x77817e), floodlight: (p: V3, n: V3) => stoneLit(p, n) * 0.4 } },
  { part: parts.blue, material: { ...finish('bridge-blue', 0x8fbad6), floodlight: steelLit } },
  // The towers' windows are dark at night in recent photos (the stone is
  // floodlit, the rooms behind unlit), so they are named `glass` and keep the
  // window's slate colour by day.
  { part: parts.glass, material: { name: 'glass', color: PALETTE.window.color, roughness: 0.35 } },
  { part: parts.lamp, material: { name: 'lamp', color: 0xe6ebea } },
]

const extras = {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the river piers, on the water',
  bearing: 23.2, elevation: 0, towers: [-TY, TY],
  roadwayMidspan: road(0), roadwayAtTowers: [road(-TY), road(TY)], roadwayAtAbutments: [road(-ABUT[-1].face), road(ABUT[1].face)],
  roadwayEnds: [road(-ABUT[-1].end), road(ABUT[1].end)], walkwayFloor: WALK.z0 + 0.55,
}

if (import.meta.main) {
  for (const [file, hi, maxTris, maxBytes] of [
    ['london-tower-bridge.glb', false, 6500, 250 * 1024],
    ['london-tower-bridge.detail.glb', true, 40000, 1536 * 1024],
  ] as const) {
    const parts = build(hi)
    for (const p of Object.values(parts)) shearSouth(p)
    const list = materials(parts)
    const tris = list.reduce((n, { part }) => n + part.triangles, 0)
    const glb = writeGlb('Tower Bridge', list, extras)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`, Object.fromEntries(Object.entries(parts).map(([k, p]) => [k, p.triangles])))
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
  }
}
