/**
 * Fountain Place (1986, I. M. Pei & Partners, Henry N. Cobb), Dallas —
 * original procedural geometry, CC0-1.0.
 * bun generators/dal-fountain-place.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the OSM
 * outline's area centroid, -96.8025440 32.7847969) on the ground. Placed at
 * bearing 0: the plan is a square turned 45 degrees, drawn straight from
 * OSM's local coordinates.
 *
 * Form: a green glass prism on a square plan set corner-on to the streets
 * (corners N, E, S, W, sides about 63 m). Three cuts make the crystal:
 * - a central band from the W corner to the E corner (between the midpoints
 *   P of the north-west side and Q of the south-east side) rises to 160 m
 *   and ends in a steep gable, ridge at 219.5 m, running across the band
 *   (bearing 45) with its gable ends standing over the two slices;
 * - the north-east triangle P-N-E is sliced by one steep plane, 46 m along
 *   its north-west edge P-N, climbing to 160 m at the E corner;
 * - the south-west triangle Q-S-W likewise, 46 m along Q-S, 160 m at W.
 * So every side shows a different shape: a gable, a raking slice that starts
 * low on one face and runs up to a corner, a sheer wall. The slices and the
 * gable are glass all over; their edges carry the pale steel lines that make
 * the facets read.
 *
 * Night: the vertical walls are `window` (offices, lit); the sloped glass of
 * the slices and the gable is `glass`, which stays dark, as the night photos
 * show the crown dark above lit floors.
 *
 * Sources
 * - OSM (ODbL): outline way/73213058 (219.5 m, 63 levels) and its parts:
 *   way/1491062889 (the central band, gabled, eaves 160, ridge 220),
 *   way/1491062887 and way/1491062888 (the two slices, skillion, 46 to 160 m,
 *   facing 315 and 135), way/1491062886 and way/1493186371 (10 m glass
 *   entrance pieces at the N and S corners, inside the outline; drawn as the
 *   tower's own corners here). The parts' plans and heights are used as
 *   mapped; checked against the photos below.
 * - Published: 219.5 m (720 ft), 60 storeys (Wikipedia, "Fountain Place").
 * - Lidar: USGS 3DEP TX_Pecos_Dallas_B3_2018 has no returns above ~52 m over
 *   the tower; its wall returns roughly match the OSM outline (checked by eye, not measured).
 * - Photos (evidence):
 *   - "View of Fountain Place from Reunion Tower August 2015 21", Michael
 *     Barera, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:View_of_Fountain_Place_from_Reunion_Tower_August_2015_21.jpg
 *   - "Dallas Fountain Place 1" and "2", Andreas Praefcke, CC BY 3.0,
 *     https://commons.wikimedia.org/wiki/File:Dallas_Fountain_Place_1.jpg,
 *     https://commons.wikimedia.org/wiki/File:Dallas_Fountain_Place_2.jpg
 *   - "Downtown Dallas, Texas, with a focus on Fountain Place, a 60-story
 *     late-modernist skyscraper", Carol M. Highsmith, public domain (Library of Congress),
 *     https://commons.wikimedia.org/wiki/File:Downtown_Dallas,_Texas,_with_a_focus_on_Fountain_Place,_a_60-story_late-modernist_skyscraper_LCCN2014632088.tif
 *   - "Fountain place", Kumar Appaiah, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Fountain_place.jpg
 * Estimated: glass colour (between the reflective aqua and dark green of the
 * photos), the band lines every four storeys (3.6 m), line sizes.
 * Doubts: the plaza and its fountains are ground and are not modelled; the
 * tower's open ground-floor corners are drawn solid.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishGlb, type XY } from './sea-columbia-center'
import { bar } from './dal-bank-of-america-plaza'

/** A triangle wound so its normal agrees with `hint`. */
function triOut(part: Part, a: V3, b: V3, c: V3, hint: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] >= 0) part.tri(a, b, c)
  else part.tri(a, c, b)
}

function build() {
  // OSM metres about a point 1.54 m west, 0.61 m north of the anchor.
  const S0: XY = [1.54, -0.61]
  const p = (x: number, y: number): XY => [x + S0[0], y + S0[1]]
  const N = p(0.1, 43.6), E = p(41.8, 1.9), S = p(-3.2, -42.4), W = p(-44.8, -0.6)
  const mid = (a: XY, b: XY): XY => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const P = mid(W, N), Q = mid(S, E) // OSM: (-22.3, 21.5) and (19.3, -20.3)
  // The gable's ridge runs across the band, from over the middle of P-E to
  // over the middle of W-Q (bearing 45), so its roof planes rise from the
  // band's eaves on the NW and SE faces and its gable ends stand over the
  // slices. Seen from the south-west (Barera) the top is a gable end, apex
  // near the middle; seen from the south-east, a rake.
  const R1 = mid(P, E), R2 = mid(W, Q)
  const LOW = 46, EAVE = 160, RIDGE = 219.5
  const v = (q: XY, z: number): V3 => [q[0], q[1], z]
  const out2 = (a: XY, b: XY): V3 => [b[1] - a[1], a[0] - b[0], 0] // outward of a ccw edge

  const wall = new Part(), slope = new Part(), lines = new Part()

  // Vertical walls round the plan, counter-clockwise from above.
  const wallTop = (a: XY, za: number, b: XY, zb: number) => {
    const h = out2(a, b)
    triOut(wall, v(a, 0), v(b, 0), v(b, zb), h)
    triOut(wall, v(a, 0), v(b, zb), v(a, za), h)
  }
  wallTop(W, EAVE, S, LOW) // SW face, under the south-west slice
  wallTop(S, LOW, Q, LOW) // SE face, first half: the slice's low edge
  wallTop(Q, EAVE, E, EAVE) // SE face, second half: the band, to its eave
  wallTop(E, EAVE, N, LOW) // NE face, under the north-east slice
  wallTop(N, LOW, P, LOW) // NW face, first half: the slice's low edge
  wallTop(P, EAVE, W, EAVE) // NW face, second half: the band
  // The band's sides above the slices, each with its gable end on top.
  triOut(wall, v(P, LOW), v(E, EAVE), v(P, EAVE), out2(E, P))
  triOut(wall, v(P, EAVE), v(E, EAVE), v(R1, RIDGE), out2(E, P))
  triOut(wall, v(Q, LOW), v(W, EAVE), v(Q, EAVE), out2(W, Q))
  triOut(wall, v(Q, EAVE), v(W, EAVE), v(R2, RIDGE), out2(W, Q))

  // Sloped glass: the two slices and the gable's two roof planes.
  const up: V3 = [0, 0, 1]
  triOut(slope, v(P, LOW), v(N, LOW), v(E, EAVE), up)
  triOut(slope, v(Q, LOW), v(S, LOW), v(W, EAVE), up)
  triOut(slope, v(W, EAVE), v(P, EAVE), v(R1, RIDGE), up)
  triOut(slope, v(W, EAVE), v(R1, RIDGE), v(R2, RIDGE), up)
  triOut(slope, v(Q, EAVE), v(E, EAVE), v(R1, RIDGE), up)
  triOut(slope, v(Q, EAVE), v(R1, RIDGE), v(R2, RIDGE), up)

  // Pale floor-group lines on the vertical walls, every four storeys, each
  // clipped to the wall's top where the top rakes.
  const STOREY = 3.6, every = 4 * STOREY, t = 0.7, proud = 0.05
  const band = (a: XY, za: number, b: XY, zb: number) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = out2(a, b)
    const nn: XY = [n[0] / L * proud, n[1] / L * proud]
    const inset = 0.5
    for (let z = every; z < Math.max(za, zb) - 1; z += every) {
      // the part of the edge where the wall top is above z + 1
      let s0 = inset / L, s1 = 1 - inset / L
      if (za !== zb) {
        const s = (z + 1.5 - za) / (zb - za)
        if (zb > za) s0 = Math.max(s0, s); else s1 = Math.min(s1, s)
      } else if (z > za - 1.5) continue
      if (s1 - s0 < 0.02) continue
      const A: XY = [a[0] + (b[0] - a[0]) * s0 + nn[0], a[1] + (b[1] - a[1]) * s0 + nn[1]]
      const B: XY = [a[0] + (b[0] - a[0]) * s1 + nn[0], a[1] + (b[1] - a[1]) * s1 + nn[1]]
      triOut(lines, v(A, z - t / 2), v(B, z - t / 2), v(B, z + t / 2), n)
      triOut(lines, v(A, z - t / 2), v(B, z + t / 2), v(A, z + t / 2), n)
    }
  }
  band(W, EAVE, S, LOW); band(S, LOW, Q, LOW); band(Q, EAVE, E, EAVE)
  band(E, EAVE, N, LOW); band(N, LOW, P, LOW); band(P, EAVE, W, EAVE)

  // Steel lines on every facet edge: the creases, the ridge and the rakes.
  const w = 0.8
  const edge = (a: V3, b: V3) => bar(lines, a, b, w)
  edge(v(P, LOW), v(N, LOW)); edge(v(N, LOW), v(E, EAVE)); edge(v(P, LOW), v(E, EAVE))
  edge(v(Q, LOW), v(S, LOW)); edge(v(S, LOW), v(W, EAVE)); edge(v(Q, LOW), v(W, EAVE))
  edge(v(R1, RIDGE), v(R2, RIDGE))
  edge(v(P, EAVE), v(R1, RIDGE)); edge(v(E, EAVE), v(R1, RIDGE))
  edge(v(Q, EAVE), v(R2, RIDGE)); edge(v(W, EAVE), v(R2, RIDGE))
  edge(v(P, EAVE), v(W, EAVE)); edge(v(Q, EAVE), v(E, EAVE))
  for (const [c, z] of [[N, LOW], [E, EAVE], [S, LOW], [W, EAVE], [P, EAVE], [Q, EAVE]] as [XY, number][]) edge(v(c, 1), v(c, z))

  return finishGlb('dal-fountain-place', 'Fountain Place', [
    { part: wall, material: { ...PALETTE.window, color: 0x6c9497 } },
    { part: slope, material: { ...PALETTE.glass, color: 0x86abad } },
    { part: lines, material: finish('fountain-steel', 0xdbe5e4) },
  ], {
    bearing: 0, height: RIDGE,
    replaces: ['way/73213058', 'way/1491062886', 'way/1491062887', 'way/1491062888', 'way/1491062889', 'way/1493186371'],
  })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/dal-fountain-place.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
