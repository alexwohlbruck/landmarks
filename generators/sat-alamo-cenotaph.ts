/**
 * The Alamo Cenotaph ("The Spirit of Sacrifice"), Alamo Plaza, San Antonio,
 * Texas: Pompeo Coppini's 1939-1940 memorial to the Alamo's defenders. A
 * Georgia white-grey marble shaft with chamfered top edges stands at the
 * north end of a long marble base; a sloping wing runs down from the shaft to
 * the south; low-relief figures cover the shaft's long faces (the rising
 * "Spirit of Sacrifice" over the fallen) and the base's ends (groups of the
 * defenders); all on a pink granite plinth. Original procedural geometry,
 * CC0-1.0.   bun generators/sat-alamo-cenotaph.ts
 *
 * Frame: bearing 10 (the OSM memorial outline way/99953212 is square in it).
 * x east, y north, z up, metres. Origin at OSM node/13988611424 (-98.48669,
 * 29.42616), 0.5 m from the outline's centre.
 *
 * Ground: flat (lidar 0.2-0.8 m over its ground_min); heights below are lidar
 * less 0.6. Elevation 0.
 *
 * Evidence
 * - OSM way/99953212 (historic=memorial, not a building): x -2.4..1.3,
 *   y -6.1..5.4. `replaces` is empty: OSM maps no building here.
 * - USGS 3DEP lidar USGS_LPC_TX_Central_B2_2017_LAS_2019 (2017), 0.5 m grid
 *   (~/landmarks-scratch/satx/work/sat-alamo-cenotaph/lidar.json), less 0.6:
 *   the shaft x -1.5..1.5, y 0.9..5.2 to 17.2; the base x -1..2, y -6..6 at
 *   2.3; the sloping wing south of the shaft falling from 5.5 to 2.3; the
 *   plinth to y +-8 at 0.6.
 * - Published: Wikipedia "Alamo Cenotaph" (1939-40, Pompeo Coppini; 60 ft,
 *   Georgia marble on a Texas pink granite base).
 * - Photos (Wikimedia Commons), EVIDENCE:
 *   "Cenotaph & Morgan Hotel (48874537178).jpg" (Eden, Janine and Jim, CC BY
 *     2.0): the whole memorial from the west: the shaft at the north end with
 *     its chamfered top, the relief panel, the sloping wing and the figure
 *     group at its foot, the long base on the plinth;
 *   "The Alamo Cenotaph.jpg" (Batlise, CC BY-SA 4.0) and "ALAMO CENOTAPH.png"
 *     (Michaelluckey, CC BY 4.0): the relief's outline and the chamfer.
 *
 * Drawn as bold forms for zoom 16: the reliefs are raised panels (0.2 m) in
 * a paler marble, the figure groups blocks. The female figure on the narrow
 * face is part of the shaft's relief panel; not modelled as a figure.
 *
 * Night: floodlit all round (the plaza lights it).
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { prism, report, writeGlb, type XY } from './sf-de-young'
import { onWall, rectPts, block } from './sat-san-fernando-cathedral'

const marble = new Part(), relief = new Part(), granite = new Part()

// the pink granite plinth and the marble base
block(granite, -2.6, 2.6, -8.0, 8.0, 0, 0.6, 0.1)
block(marble, -1.8, 1.8, -6.3, 6.2, 0.6, 2.3, 0.1)
// the sloping wing from the shaft down to the south end
{
  const x0 = -1.3, x1 = 1.3, ya = 0.9, yb = -6.0, za = 5.6, zb = 2.3
  marble.quad([x0, yb, zb], [x1, yb, zb], [x1, ya, za], [x0, ya, za])
  marble.tri([x1, yb, 2.3], [x1, ya, 2.3], [x1, ya, za]); marble.tri([x1, yb, 2.3], [x1, ya, za], [x1, yb, zb])
  marble.tri([x0, ya, 2.3], [x0, yb, 2.3], [x0, ya, za]); marble.tri([x0, yb, 2.3], [x0, yb, zb], [x0, ya, za])
}
// the shaft, slightly tapered, its top edges chamfered
{
  const cy = 3.05, hx0 = 1.55, hy0 = 2.2, hx1 = 1.4, hy1 = 2.05, z0 = 2.3, z1 = 16.6, top = 17.2, c = 0.45
  const ring = (hx: number, hy: number): XY[] => [[-hx, cy - hy], [hx, cy - hy], [hx, cy + hy], [-hx, cy + hy]]
  const r0 = ring(hx0, hy0), r1 = ring(hx1, hy1), r2 = ring(hx1 - c, hy1 - c)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    marble.quad([...r0[i], z0], [...r0[j], z0], [...r1[j], z1], [...r1[i], z1])
    marble.quad([...r1[i], z1], [...r1[j], z1], [...r2[j], top], [...r2[i], top])
  }
  marble.quad([...r2[0], top], [...r2[1], top], [...r2[2], top], [...r2[3], top])
  // the relief panels on the long faces (east and west), raised
  for (const s of [-1, 1]) {
    const n: XY = [s, 0], x = s * 1.5
    const sAlong = (y: number) => (s > 0 ? y : -y)
    onWall(relief, [x, 0], n, rectPts(Math.min(sAlong(cy - 1.1), sAlong(cy + 1.1)), Math.max(sAlong(cy - 1.1), sAlong(cy + 1.1)), 4.0, 12.6), 0.2)
    block(relief, s > 0 ? 1.5 : -1.75, s > 0 ? 1.75 : -1.5, cy - 0.35, cy + 0.35, 6.5, 12.2, 0.05) // the rising figure
  }
}
// the figure groups: at the foot of the wing (south) and on the base's north end and long sides
block(relief, -1.6, 1.6, -6.6, -6.2, 0.6, 3.6, 0.1)
block(relief, -1.6, 1.6, 6.2, 6.6, 0.6, 3.6, 0.1)
for (const s of [-1, 1]) block(relief, s > 0 ? 1.8 : -2.05, s > 0 ? 2.05 : -1.8, -5.5, -0.5, 0.6, 2.6, 0.08)
void prism

// ---------------------------------------------------------------------------
const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.4 : 0.95)
const parts = [
  { part: marble, material: { ...finish('cenotaph-marble', 0xe9e8e3), floodlight: lit } },
  { part: relief, material: { ...finish('cenotaph-relief-marble', 0xf6f5f1), floodlight: lit } },
  { part: granite, material: finish('cenotaph-pink-granite', 0xc6aca4) },
]
const glb = writeGlb('Alamo Cenotaph', parts, {
  license: 'CC0-1.0', bearing: 10, elevation: 0, anchor: [29.42616, -98.48669],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: [],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('Alamo Cenotaph', parts, glb, 5000)
const out = new URL('../models/sat-alamo-cenotaph.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
