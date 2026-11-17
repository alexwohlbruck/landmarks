/**
 * Contemporary Arts Museum Houston (5216 Montrose Boulevard, 1972, Gunnar
 * Birkerts) — original procedural geometry, CC0-1.0.
 * bun generators/hou-contemporary-arts-museum.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Bearing 0: the parallelogram's long sides run due east-west, its
 * slanted sides run south-west to north-east (parallel to nothing on the
 * street grid, which is what makes it read). Anchor = the centroid of the
 * OSM outline (way/55563504), 29.726396,-95.391510.
 *
 * Identity, in order: a windowless box of corrugated stainless steel on a
 * parallelogram (rhomboid) plan, its two acute (~46°) corners drawn to sharp
 * points; the bright, sky-reflecting steel; the pointed steel entrance canopy
 * at the south-east corner, a knife-edge blade aimed at the Montrose /
 * Bissonnet corner; the band of sloped skylights along the foot of the walls
 * that lights the lower gallery.
 *
 * Note against the brief: the lead's note says the acute corner points at the
 * Montrose/Bissonnet intersection. OSM, the 2018 lidar and NAIP all agree that
 * the acute corners are the north-east and south-west ones; the corner facing
 * the intersection (south-east) is obtuse (~134°). What points at the
 * intersection is the triangular entrance canopy at that corner (Highsmith's
 * photos), so the model follows the evidence and makes the canopy the point.
 *
 * Evidence:
 *  - plan: OSM way/55563504 (both acute tips truncated 0.7-0.9 m, kept);
 *    NAIP (USGS NAIP Plus) and the lidar roof agree with it to ~0.5 m.
 *    Sides: east-west 32.2 m, slanted 33.6 m (measured).
 *  - heights: USGS 3DEP lidar TX_Coastal_B1_2018 (flown 2018), 0.5 m grid.
 *    Ground at the walls 3.0-3.1 m over the grid minimum (east, west), the
 *    south walk 3.8 m; roof field 11.1 m, wall top (parapet) 12.5-12.6 m.
 *    So walls 9.6 m over the ground at the base (measured), roof 1.4 m below
 *    the wall top (measured). y = 0 is the ground at the walls.
 *  - canopy: shape and height from Highsmith's two photos (a flat triangular
 *    blade at about 55% of the wall height, its tip beyond the corner);
 *    lidar shows a ~9.2 m return (5.4 m over the walk) at x 1-5, y -14..-15
 *    under it. Its depth (3.5 m) is estimated from the photos.
 *  - skylight band: in photos along the south-east face and the east part of
 *    the south face, a sloped glazed strip ~0.8 m high at the foot of the
 *    wall (estimated from the photos).
 *  - colour: the steel is a mirror, so it takes the sky: wall samples
 *    #a8b2bc and #b7c4d3 (sunlit, Highsmith, Lange), #bcbabd (overcast,
 *    Feller), #849096-#8a8884 (WhisperToMe, shade of trees); drawn a cool
 *    silver #cfd6db, pulled to the palette's lightness. Roof NAIP #b9b7b6,
 *    drawn #b2b5b6, a step darker than the steel so the rim reads around it.
 *
 * Photos (all evidence):
 *  - Carol M. Highsmith, "CAMH, the Contemporary Arts Museum in Houston,
 *    Texas" (LCCN2011633003) and "Contemporary Art Museum, Houston, Texas"
 *    (LCCN2011630270), public domain: the south-east face from the
 *    north-east, the canopy blade beyond the corner, the skylight band.
 *    https://commons.wikimedia.org/wiki/File:CAMH,_the_Contemporary_Arts_Museum_in_Houston,_Texas_LCCN2011633003.tif
 *    https://commons.wikimedia.org/wiki/File:Contemporary_Art_Museum,_Houston,_Texas_LCCN2011630270.tif
 *  - WhisperToMe, "Contemporary Arts Museum Houston A.jpg", "... 0.jpg",
 *    "Contemporary Arts Museum Houston.jpg", CC0: the Montrose plaza, the
 *    south-east face, the canopy at the south-east corner.
 *    https://commons.wikimedia.org/wiki/File:Contemporary_Arts_Museum_Houston_A.jpg
 *    https://commons.wikimedia.org/wiki/File:Contemporary_Arts_Museum_Houston.jpg
 *  - Hannah Lange, "Contemporary Arts Museum Houston exterior.jpg",
 *    CC BY-SA 4.0: corrugation and the sloped skylights, close up.
 *    https://commons.wikimedia.org/wiki/File:Contemporary_Arts_Museum_Houston_exterior.jpg
 *  - WhisperToMe, "ContArtMuseumHouston.JPG" (CC0) and
 *    "ContemporaryArtsMuseumHoustonTX.JPG" (public domain): the south face
 *    from Bissonnet with the ramped walk.
 *    https://commons.wikimedia.org/wiki/File:ContArtMuseumHouston.JPG
 *    https://commons.wikimedia.org/wiki/File:ContemporaryArtsMuseumHoustonTX.JPG
 *  Published: 1972, Gunnar Birkerts (Wikipedia, "Contemporary Arts Museum
 *  Houston"). No commercial imagery.
 *
 * Left out: the corrugation itself (fine vertical ribs; the steel reads as a
 * plain silver wall at map distance), the sign pylons, banners, the fountain,
 * planters and the ramps (ground).
 *
 * Doubts: the north and north-west faces have no licensed photo; they are
 * drawn plain, without the skylight band. The canopy's exact plan is from
 * oblique photos only.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cap, inset, save, walls, type XY } from './chi-aon-center'

const TOP = 9.6, ROOF = 8.2, COPE = 0.35

function build() {
  const steel = new Part(), roof = new Part(), trim = new Part(), glass = new Part(), door = new Part()

  // OSM outline, counter-clockwise from the south-west tip
  const plan: XY[] = [[-27.7, -12.5], [4.5, -11.9], [27.4, 11.5], [27.4, 12.4], [-4.5, 12.1], [-27.7, -11.8]]

  // the steel walls, a thin bright coping, and the roof sunk inside them
  walls(steel, plan, 0, TOP - COPE)
  const lip = inset(plan, 0.45)
  walls(trim, plan, TOP - COPE, TOP)
  for (let i = 0; i < plan.length; i++) {
    const j = (i + 1) % plan.length
    const a = plan[i], b = plan[j], c = lip[j], d = lip[i]
    trim.quad([a[0], a[1], TOP], [b[0], b[1], TOP], [c[0], c[1], TOP], [d[0], d[1], TOP])
  }
  // inner face of the parapet, facing into the roof well
  const lipRev = [...lip].reverse()
  walls(steel, lipRev, ROOF, TOP)
  cap(roof, lip, ROOF)

  // ---- skylight band: a sloped glazed strip at the foot of the wall ----
  const sky = (a: XY, b: XY, s0: number, s1: number) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [u[1], -u[0]]
    const P = (s: number, out: number, z: number): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z]
    // slope from the wall (z 1.0) down and out to the kerb (1.2 m out, z 0.45)
    glass.quad(P(s0, 1.2, 0.45), P(s1, 1.2, 0.45), P(s1, 0, 1.0), P(s0, 0, 1.0))
    // the concrete kerb under it, and its end cheeks
    trim.quad(P(s0, 1.2, 0), P(s1, 1.2, 0), P(s1, 1.2, 0.45), P(s0, 1.2, 0.45))
    trim.tri(P(s1, 1.2, 0), P(s1, 0, 0), P(s1, 0, 1.0))
    trim.tri(P(s1, 1.2, 0), P(s1, 0, 1.0), P(s1, 1.2, 0.45))
    trim.tri(P(s0, 0, 0), P(s0, 1.2, 0), P(s0, 1.2, 0.45))
    trim.tri(P(s0, 0, 0), P(s0, 1.2, 0.45), P(s0, 0, 1.0))
  }
  // south-east face (SE corner → NE tip), in pieces of ~5 m for the terrain
  const se: [XY, XY] = [[4.5, -11.9], [27.4, 11.5]]
  const seL = Math.hypot(22.9, 23.4)
  for (let s = 1.5; s < seL - 4; s += 5) sky(se[0], se[1], s, Math.min(s + 4.6, seL - 4))
  // south face, east half (the west half is behind the ramp walls)
  const so: [XY, XY] = [[-27.7, -12.5], [4.5, -11.9]]
  for (let s = 14; s < 21; s += 5) sky(so[0], so[1], s, Math.min(s + 4.6, 22))

  // ---- entrance: glazed doors under the canopy on the south face ----
  {
    const a = so[0], b = so[1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [u[1], -u[0]]
    const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * 0.05, a[1] + u[1] * s + n[1] * 0.05, z]
    door.quad(P(26.5, 0.8), P(30.0, 0.8), P(30.0, 3.8), P(26.5, 3.8))
  }

  // ---- the canopy blade: a flat triangle aimed south-east ----
  {
    const zc = 5.4
    const w0: XY = [-4.2, -11.98], w1: XY = [4.5, -11.9], tip: XY = [7.6, -16.2]
    const t0 = 0.55, t1 = 0.12 // thickness at the wall and at the tip
    const top = (p: XY, t: number): V3 => [p[0], p[1], zc + t / 2]
    const bot = (p: XY, t: number): V3 => [p[0], p[1], zc - t / 2]
    steel.tri(top(w0, t0), top(tip, t1), top(w1, t0))
    steel.tri(bot(w0, t0), bot(w1, t0), bot(tip, t1))
    steel.quad(bot(w0, t0), bot(tip, t1), top(tip, t1), top(w0, t0))
    steel.quad(bot(tip, t1), bot(w1, t0), top(w1, t0), top(tip, t1))
  }

  return [
    { part: steel, material: finish('camh-stainless', 0xcfd6db, 0.3) },
    { part: trim, material: finish('camh-steel-edge', 0xdfe3e5, 0.4) },
    { part: roof, material: finish('camh-roof', 0xb2b5b6) },
    { part: glass, material: PALETTE.glass },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('hou-contemporary-arts-museum', 'Contemporary Arts Museum Houston', [29.726396, -95.39151], 0, build())
