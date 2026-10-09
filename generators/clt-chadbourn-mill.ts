/**
 * Chadbourn Mill and its smokestack, 2520 N. Brevard St, NoDa, Charlotte —
 * procedural, CC0-1.0.
 * bun generators/clt-chadbourn-mill.ts
 *
 * The former Chadbourn hosiery mill, renovated as offices (ekos and others):
 * a long two-storey block framed by pale concrete pilasters with red-brick
 * spandrels and wide dark steel windows, a raised clerestory monitor down
 * its spine, and across the car park the brick boiler house with the tall
 * round stack, painted down its side with "CHADBOURN" in white letters
 * (lettering not modelled: it would not read at map distance).
 *
 * Evidence:
 *  - OSM: way/1059956512 (the mill, building=office), way/1059956513 (the
 *    boiler house), way/1059956514 (the stack, man_made=chimney, "Chadbourn
 *    smokestack", ~3.2 m across).
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m (ground_min 206.99 m
 *    NAVD88). Base 2.3 m above ground_min, at the mill's north end; the
 *    ground rises ~3 m to its south end. Heights above base: mill roof
 *    10.7 m, the monitor 12.7 m (9 m wide, full length), boiler house 8.7 m,
 *    the stack 35.7 m. In 2016 the mill ran further east; the model follows
 *    today's OSM outline, which matches the 2024 photos.
 *  - Photos (Commons): City Dweller 2, CC BY-SA 4.0: "Chadbourn Mill Late
 *    March 2024" (the long side: pilasters, brick, steel windows),
 *    "Chadbourn Mill Smokestack Late March 2024" (the stack and the boiler
 *    house), "Chadbourne Mill parking lot on Jordan Pl Mid-June 2024" (the
 *    south end: the raised middle bay, the stack beyond). USGS NAIP.
 *
 * Estimated: bay pitch (photos, ~3.8 m: nine bays on the street end,
 * fourteen on the long side), window sizes, the boiler house's openings,
 * the stack's base diameter (taper from OSM's 3.2 m).
 *
 * Model frame: bearing 317.6 (model +y runs along the mill, 42.4° west of
 * north); metres above the base.
 */
import { Part } from './mesh'
import { PALETTE } from './palette'
import {
  type Block, type Built, type Kit, type Row, type XY,
  BRICK, MILL_ROOF, build, centroid, faces, prism, rect, softBox, stack, window, write,
} from './clt-highland-park-mill-3'

/** Ground above base, a plane fitted to the lidar ground round the mill (sd 0.5 m). */
const ground = (p: XY) => 4.22 + 0.0243 * p[0] - 0.0363 * p[1]

/** way/1059956512 in the model frame. */
const MILL: XY[] = rect(-82.5, 3.6, -49.5, 59.4)

export function buildChadbourn(): Built {
  const brick = new Part(), stone = new Part(), win = new Part(), trim = new Part(), roof = new Part()
  const kit: Kit = { win, trim, roof, ground }
  const TOP = 10.7, PITCH = 3.8
  // A basement row where the ground falls away, then two storeys of steel windows.
  const rows: Row[] = [{ z0: 0.7, z1: 2.5, w: 2.5 }, { z0: 3.4, z1: 6.4, w: 2.6 }, { z0: 7.2, z1: 10.0, w: 2.6 }]
  const blocks: Block[] = [
    { poly: MILL, top: TOP, wall: brick, rows, pitch: PITCH },
    // The boiler house: one tall storey, big windows.
    { poly: rect(-18.4, -6.0, -4.2, 9.5), top: 8.7, wall: brick, rows: [{ z0: 4.6, z1: 7.6, w: 2.6 }], pitch: 4.6 },
  ]
  build(blocks, kit)

  // Pale concrete pilasters at every bay line of the mill, full height,
  // standing 25 cm proud, their tops under the coping.
  for (const f of faces(MILL)) {
    const count = Math.floor((f.L - 0.8) / PITCH), start = (f.L - count * PITCH) / 2
    for (let k = 0; k <= count; k++) {
      const s = -f.L / 2 + start + k * PITCH, w = 1.0
      const c: XY = [f.c[0] + f.u[0] * s, f.c[1] + f.u[1] * s]
      const a: XY = [c[0] - f.u[0] * w / 2, c[1] - f.u[1] * w / 2], b: XY = [c[0] + f.u[0] * w / 2, c[1] + f.u[1] * w / 2]
      prism(stone, [a, b, [b[0] + f.o[0] * 0.25, b[1] + f.o[1] * 0.25], [a[0] + f.o[0] * 0.25, a[1] + f.o[1] * 0.25]], -0.6, TOP - 0.05)
    }
  }
  // The clerestory monitor down the spine, a band of steel windows each side.
  {
    const M = rect(-70.6, 4.6, -61.4, 58.4)
    softBox(brick, M, TOP - 0.6, 12.7, 0.2, roof)
    for (const f of faces(M)) {
      const n = Math.floor(f.L / 4.2)
      for (let k = 0; k < n; k++) {
        const s = -f.L / 2 + (k + 0.5) * (f.L / n), c: XY = [f.c[0] + f.u[0] * s, f.c[1] + f.u[1] * s]
        window(win, c, f.u, f.o, { z0: 11.0, z1: 12.2, w: Math.min(3.2, f.L / n - 0.8) })
      }
    }
  }
  // The stack: tapering from ~4 m at the foot to OSM's 3.2 m (lidar top 35.7 m).
  stack(brick, [-0.3, 0], 2.0, 1.55, -0.6, 35.7, trim, 16)

  return {
    id: 'clt-chadbourn-mill', name: 'Chadbourn Mill', anchor: centroid(MILL), height: 35.7,
    parts: [
      { part: brick, material: BRICK },
      { part: stone, material: PALETTE.stone },
      { part: roof, material: MILL_ROOF },
      { part: win, material: PALETTE.window },
      { part: trim, material: PALETTE.trim },
    ],
  }
}

if (import.meta.main) await write(buildChadbourn())
