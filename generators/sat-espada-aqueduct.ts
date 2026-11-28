/**
 * Espada Aqueduct (Piedras Creek Aqueduct), San Antonio Missions National
 * Historical Park, Texas: the 1731-1745 rubble-stone aqueduct that carries
 * the Espada Acequia over Piedras Creek on two round arches, the larger over
 * the creek's channel, the smaller to the east, with the open channel along
 * its top. Original procedural geometry, CC0-1.0.
 *   bun generators/sat-espada-aqueduct.ts
 *
 * Small: about 20 m long and 4.8 m high. Drawn true to size with bold forms
 * (solid masonry, deep arches, a clear channel) so it reads at zoom 16 as a
 * stone bridge with two arches; at 80 px it is a short stone bar.
 *
 * Frame: bearing 357 (x runs along the aqueduct, bearing 87, east; y north;
 * z up; metres). Origin on the aqueduct's centre line, 0.55 m west of the
 * creek arch's centre (-98.461280, 29.332548), found from lidar where OSM's
 * bridge=aqueduct way/80198672 crosses Piedras Creek (way/293131568).
 *
 * Ground: the creek bed is the lowest ground (lidar 0.1-0.4 m over its
 * ground_min), the banks rise to about 1 m east and 2-3 m west. y = 0 is
 * the creek bed; the masonry runs down to it along its whole length and
 * sinks into the banks. Elevation 0.
 *
 * Evidence
 * - OSM way/80198672 (waterway=ditch, bridge=aqueduct, layer 1): the
 *   acequia's line, 170 m long (most of it the ditch on its banks); no
 *   building or bridge outline, so `replaces` is empty.
 * - HAER TX-1A "Espada Acequia, Piedras Creek Aqueduct" (Library of Congress,
 *   1975 measured drawing, public domain, via Wikimedia Commons): north
 *   elevation at 4.9 px/ft (seen from the north, so east is on the left):
 *   masonry 69 ft (21 m) long to the stepped west end, the east arch 10.6 ft
 *   (3.2 m) wide, the creek arch 14 ft (4.3 m), 26 ft between their centres,
 *   1.2 m of masonry over the creek arch's crown; sections: 13.5 ft (4.1 m)
 *   wide, the channel 4 ft wide and about 2.5 ft deep between 2 ft walls,
 *   15.5 ft (4.7 m) high over the creek.
 * - USGS 3DEP lidar USGS_LPC_TX_Central_B2_2017_LAS_2019 (2017), 0.5 m grid
 *   (~/landmarks-scratch/satx/work/sat-espada-aqueduct/lidar.json): the top a
 *   constant 5.0 m over ground_min along the whole span and on west over
 *   the rising bank (drawn to x -11.5, past HAER's 21 m), about 3.3 m wide
 *   (the channel walls); the creek bed 0.1-0.4.
 * - Photos: "Espada Aqueduct TX NPS.jpg" (National Park Service, public
 *   domain): the north side, both arches, the rubble masonry, the stepped
 *   end; "Mission Espada Aqueduct Texas.jpg" (Chris Light, CC BY-SA 4.0);
 *   "GENERAL VIEW OF AQUEDUCT LOOKING SOUTHEAST ... HAER TEX,15-SANT.V,4A-1"
 *   (HAER, public domain).
 *
 * Not modelled: the water in the channel, and the creek. Night: unlit.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { report, writeGlb } from './sf-de-young'

const stone = new Part(), cope = new Part(), floor = new Part()

const X0 = -11.5, X1 = 12.5, HW = 2.05, TOP = 4.8, CH = 0.6, CD = 0.75
const ARCHES = [{ c: 8.55, r: 1.6, spring: 1.4 }, { c: 0.55, r: 2.15, spring: 1.4 }]
/** The underside of the masonry at x: 0, or the arch's intrados. */
function under(x: number) {
  for (const a of ARCHES) if (Math.abs(x - a.c) < a.r) return a.spring + Math.sqrt(a.r * a.r - (x - a.c) ** 2)
  return 0
}
// sample x finely through the arches
const xs: number[] = []
for (let x = X0; x < X1 - 1e-6; ) {
  xs.push(x)
  const inArch = ARCHES.some((a) => x > a.c - a.r - 0.3 && x < a.c + a.r + 0.3)
  x = Math.min(X1, x + (inArch ? 0.25 : 1.0))
  for (const a of ARCHES) for (const e of [a.c - a.r, a.c + a.r]) if (xs[xs.length - 1] < e && x > e) x = e
}
xs.push(X1)
for (let i = 0; i + 1 < xs.length; i++) {
  const a = xs[i], b = xs[i + 1], ua = under(a + 1e-6 * (i ? 1 : 1)), ub = under(b - 1e-6)
  // north and south faces
  stone.quad([a, HW, ua], [a, HW, TOP], [b, HW, TOP], [b, HW, ub])
  stone.quad([b, -HW, ub], [b, -HW, TOP], [a, -HW, TOP], [a, -HW, ua])
  // the arch soffit
  if (ua > 0.01 || ub > 0.01) stone.quad([a, -HW, ua], [a, HW, ua], [b, HW, ub], [b, -HW, ub])
}
// arch jambs (vertical faces where an opening starts and ends): the solid's ends at each arch edge
for (const a of ARCHES) {
  for (const [x, s] of [[a.c - a.r, 1], [a.c + a.r, -1]] as [number, number][]) {
    // face looking into the opening, from 0 up to the springing
    if (s < 0) stone.quad([x, HW, 0], [x, -HW, 0], [x, -HW, a.spring], [x, HW, a.spring])
    else stone.quad([x, -HW, 0], [x, HW, 0], [x, HW, a.spring], [x, -HW, a.spring])
  }
}
// ends
stone.quad([X0, HW, 0], [X0, -HW, 0], [X0, -HW, TOP], [X0, HW, TOP])
stone.quad([X1, -HW, 0], [X1, HW, 0], [X1, HW, TOP], [X1, -HW, TOP])
// the top: two channel walls with a coping, the channel floor between
const cw = (CH + 0.6) // channel half-width (2 ft) plus the wall, the rest is the masonry's top
for (const [y0, y1] of [[-HW, -CH], [CH, HW]]) {
  cope.quad([X0, y0, TOP], [X1, y0, TOP], [X1, y1, TOP], [X0, y1, TOP])
}
floor.quad([X0, -CH, TOP - CD], [X1, -CH, TOP - CD], [X1, CH, TOP - CD], [X0, CH, TOP - CD])
floor.quad([X0, CH, TOP - CD], [X1, CH, TOP - CD], [X1, CH, TOP], [X0, CH, TOP])
floor.quad([X1, -CH, TOP - CD], [X0, -CH, TOP - CD], [X0, -CH, TOP], [X1, -CH, TOP])
void cw

// ---------------------------------------------------------------------------
const parts = [
  { part: stone, material: finish('aqueduct-rubble-stone', 0xc6bca7) },
  { part: cope, material: finish('aqueduct-coping', 0xd9d1c0) },
  { part: floor, material: finish('aqueduct-channel', 0x9c9483) },
]
const glb = writeGlb('Espada Aqueduct', parts, {
  license: 'CC0-1.0', bearing: 357, elevation: 0, anchor: [29.332548, -98.46128],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: [],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('Espada Aqueduct', parts, glb, 5000)
const out = new URL('../models/sat-espada-aqueduct.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
void (0 as unknown as V3)
