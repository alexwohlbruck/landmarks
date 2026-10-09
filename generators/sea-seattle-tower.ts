/**
 * Seattle Tower (Northern Life Tower, 1929, Albertson, Wilson & Richardson),
 * Seattle — original procedural geometry, CC0-1.0.
 * bun generators/sea-seattle-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the OSM
 * outline's area centroid, -122.3354570, 47.6076875) on the lowest ground
 * under the footprint (37.7 m NAVD88, on 3rd Avenue). Built in the street
 * grid's frame: the model's x axis runs along University Street (ENE, away
 * from 3rd Avenue), y up the avenues (NNW); placement bearing 328.8°.
 *
 * Form: an art-deco setback tower in brick shaded from dark brown at the foot
 * to pale buff at the top. The 27-storey shaft stands on the 3rd Avenue side,
 * ribbed with deep brick piers, and steps in three times above 86 m to a
 * small top at 100 m; low wings of 15-23 m flank it on 3rd Avenue. On the
 * east side a symmetrical block: wings of 58 m either side of a 67 m centre
 * bay.
 *
 * Sources
 * - OSM: outline way/335417547; parts way/232079588 (the shaft, 100 m, its
 *   outline traced pier by pier), way/417915158 (top, 106 m, tagged mansard; drawn as a brick tier, as the
 *   photos show),
 *   way/417915157 (front centre bay, 65 m), way/417915159 (front wings, 50 m).
 *   The pier positions are OSM's.
 * - Lidar (measured, USGS 3DEP WA_KingCo_1_2021, above 37.7 m NAVD88): piers
 *   86 m; crown tiers 93-94 m and 96-97 m; top 99-100 m; front centre bay
 *   67 m; front wings 57-58 m; west low wings 15 m and 22-24 m. OSM's 50 and
 *   65 m front heights are low by ~7 m and the 106 m top high; lidar used.
 * - Published: 27 storeys, 96 m to the roof (Wikipedia, "Seattle Tower").
 * - Photos (Wikimedia Commons): SounderBruce 2017 (from Russell Investments
 *   Center, the crown and the colour gradient), Visitor7 2013 (3rd Avenue and
 *   University Street corner), Joe Mabel (the 3rd Avenue front).
 * Estimated: the three brick bands' heights and colours (the real shading is
 *   continuous, in about ten steps), the window panels' storey groups (four
 *   storeys), the low wings' facades.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Prism, capRing, ccw, chamfer, edgeBase, finishGlb, facePanels, wallEdge, edgePanels } from './sea-rainier-square-tower'

function build() {
  // brick shaded in three bands, dark at the foot to pale at the top
  const dark = new Part(), midB = new Part(), light = new Part(), win = new Part(), roof = new Part()
  const BANDS: [number, Part][] = [[22, dark], [58, midB], [999, light]]
  const wall = (r: XY[], i: number, z0: number, z1: number) => {
    let lo = z0
    for (const [top, part] of BANDS) {
      const hi = Math.min(z1, top)
      if (hi > lo + 0.01) wallEdge(part, r, i, lo, hi)
      lo = Math.max(lo, top)
      if (lo >= z1) break
    }
  }
  const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const H = { pier: 86, tier1: 93.5, tier2: 96.5, top: 99.5, bay: 67.5, wing: 57.5 }
  // body of the shaft (the plane of the recesses) and its piers (OSM)
  const BODY = rect(-13.5, -5.3, 5.6, 5.3)
  const piers: XY[][] = [
    ...[[-12.3, -10.4], [-7.1, -5.5], [-2.5, -0.7], [2.2, 4.0]].map(([a, b]) => rect(a, 5.3, b, 7.0)),
    ...[[-11.9, -10.3], [-7.1, -5.5], [-2.4, -1.0], [2.3, 4.1]].map(([a, b]) => rect(a, -7.0, b, -5.3)),
    ...[[1.9, 3.6], [-3.5, -1.9]].map(([a, b]) => rect(5.6, a, 7.1, b)),
    ...[[1.9, 3.4], [-4.0, -2.0]].map(([a, b]) => rect(-15.2, a, -13.5, b)),
  ]
  const prisms: Prism[] = [
    { ring: BODY, z1: H.pier, wall: light, roof, kind: 'body' },
    // the piers nearest each face's middle run on past the others, so the
    // crown's outline steps like the real one
    ...piers.map((ring, k) => ({ ring, z1: [1, 2, 5, 6, 8, 9, 10, 11].includes(k) ? H.pier + 4.5 : H.pier, wall: light, roof: light, kind: 'pier' })),
    { ring: rect(-13.0, -4.8, 5.1, 4.8), z0: H.pier, z1: H.tier1, wall: light, roof, kind: 'tier' },
    { ring: rect(-12.0, -3.5, 4.2, 4.0), z0: H.tier1, z1: H.tier2, wall: light, roof, kind: 'tier' },
    // front (3rd Avenue): centre bay and the two wings
    { ring: rect(3.4, -7.4, 16.3, 7.5), z1: H.bay, wall: light, roof, kind: 'front' }, // the east block
    { ring: rect(3.3, 7.5, 16.2, 18.05), z1: H.wing, wall: light, roof, kind: 'front' },
    { ring: rect(3.6, -18.0, 16.4, -7.4), z1: H.wing, wall: light, roof, kind: 'front' },
    // low wings west of the front, either side of the shaft
    { ring: rect(-16.4, 7.0, 3.3, 18.0), z1: 15.5, wall: light, roof, kind: 'low' },
    { ring: rect(-15.2, 7.0, 3.3, 14.5), z1: 22, wall: light, roof, kind: 'low' },
    { ring: rect(-16.0, -18.1, 3.6, -7.0), z1: 14.5, wall: light, roof, kind: 'low' },
    { ring: rect(-15.2, -13.5, 3.6, -7.0), z1: 23, wall: light, roof, kind: 'low' },
  ]
  for (const P of prisms) {
    P.ring = chamfer(ccw(P.ring), P.kind === 'pier' ? 0.25 : 0.4)
    const r = P.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = Math.max(P.z0 ?? 0, edgeBase(prisms, P, i))
      if (z0 >= P.z1 - 0.01) continue
      wall(r, i, z0, P.z1)
      if (P.kind === 'front' || P.kind === 'low')
        edgePanels(win, r, i, z0, P.z1, { group: 4 * 3.6, spandrel: 2.2, pier: 2.0, bayW: 3.8, head: 2.4, foot: 1.5 }, false)
    }
    capRing(P.roof, r, P.z1)
  }
  // the top: a last brick tier rather than a roof, as the photos show
  const t3 = chamfer(rect(-8.5, -1.6, 0.7, 2.1), 0.4)
  for (let i = 0; i < t3.length; i++) wall(t3, i, H.tier2, H.top)
  capRing(roof, t3, H.top)

  // window panels in the shaft's recesses between the piers, four storeys a group
  const G = 4 * 3.6
  const recess: { at: (s: number, z: number) => V3; spans: [number, number][]; flip?: boolean }[] = [
    { at: (s, z) => [s, 5.36, z], spans: [[-10.4, -7.1], [-5.5, -2.5], [-0.7, 2.2]], flip: true }, // north, x runs west-east
    { at: (s, z) => [s, -5.36, z], spans: [[-10.3, -7.1], [-5.5, -2.4], [-1.0, 2.3]] }, // south
    { at: (s, z) => [-13.56, -s, z], spans: [[-1.9, 2.0]] }, // west, s = -y
  ]
  for (let z = 0; z < H.pier - 6; z += G) {
    const lo = Math.max(z + 1.1, 3.5), hi = Math.min(z + G, H.pier) - 1.1
    for (const f of recess) for (const [a, b] of f.spans) facePanels(win, f.at, a + 0.45, b - 0.45, lo, hi, 100, 0, f.flip ?? false)
  }
  return finishGlb('sea-seattle-tower', 'Seattle Tower', [
    { part: dark, material: finish('st-brick-dark', 0x9a7c6c) },
    { part: midB, material: finish('st-brick', 0xb59d8a) },
    { part: light, material: finish('st-brick-light', 0xcabba9) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 328.8, height: H.top, replaces: ['way/335417547', 'way/232079588', 'way/417915158', 'way/417915157', 'way/417915159'] })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/sea-seattle-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
