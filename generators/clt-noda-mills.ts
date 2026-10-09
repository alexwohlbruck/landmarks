/**
 * Mecklenburg Mill (later Mercury Mills), now the Lofts at NoDa Mills,
 * 3327 N. Davidson St, NoDa, Charlotte — procedural, CC0-1.0.
 * bun generators/clt-noda-mills.ts
 *
 * Which mill: the North Charlotte Historic District names two mills on this
 * stretch of N. Davidson, the Mecklenburg Mill (later Mercury Mills, 1905)
 * and the Johnston Mill (1913) (Wikipedia, "North Charlotte Historic
 * District"). The Lofts at NoDa Mills is the Mecklenburg Mill: Commons files
 * the 2010 photo "PANO Mecklenburg Mill Front" (the closed mill from the
 * railway) under "The Lofts at NoDa Mills", and the Johnston Mill is the
 * Wandry NoDa building at 3315 N. Davidson, whose stair tower still reads
 * "JOHNSTON MFG. CO." (`clt-johnston-mill`).
 *
 * The mill: a three-storey red-brick block on a raised basement where the
 * ground falls to the east, with a low gabled roof behind a pale cornice,
 * rows of tall segment-headed windows, a tower on each long face (the one
 * on the railway side was the mill's front door, a big arched opening), a
 * one-storey west wing, lower annexes at the east end and, east of them,
 * the free-standing round brick stack.
 *
 * Evidence:
 *  - OSM: way/323193332 (outline) and its building:parts way/1279174943
 *    (west wing), …944 (main block), …945 (south tower), …946 and …947 (east
 *    annexes). The north tower and the stack are not mapped.
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m (ground_min 209.64 m
 *    NAVD88). Base 7.5 m above ground_min at the east annexes; the ground
 *    rises ~4.5 m to the west end. Heights above base: main eaves 14.4 m,
 *    ridge 15.4 m near the block's axis; south tower 16.5 m; north tower
 *    ~15.6 m (one return at 14.5 m, the rest at 10.5 m: estimated); west wing
 *    9.3 m (≈5 m over its ground); annexes 10.0 and 7.5 m; the stack 22.5 m,
 *    about 2.6 m across at the top.
 *  - Photos (Commons): City Dweller 2, April 2024, CC BY-SA 4.0: "The Lofts
 *    at NoDa Mills Mid-April 2024" (the south front from Davidson St, the
 *    west wing and the south tower), "… main entrance", "… from a distance"
 *    (the east end, the annexes and the stack); Escapists606, "PANO
 *    Mecklenburg Mill Front.jpg", 2010, CC BY-SA 3.0 (the north face from
 *    the railway: the tower and its arched door, the stack); James Willamor,
 *    "North Charlotte Historic District.jpg", CC BY-SA 3.0. USGS NAIP for
 *    the plan and the white roof.
 *
 * Estimated: window counts (photos, ~3.4 m bays), storey heights, the north
 * tower's plan and height, the towers' cornices.
 *
 * Model frame: bearing 350.4 (model +x runs along the mill, 80.4° east of
 * north); metres above the base.
 */
import { Part } from './mesh'
import { PALETTE } from './palette'
import {
  type Block, type Built, type Kit, type Row, type XY,
  BRICK, MILL_ROOF, build, centroid, faces, inset, oculus, rect, softBox, stack, window, write,
} from './clt-highland-park-mill-3'

/** Ground above base, a plane fitted to the lidar ground round the mill (sd 0.6 m). */
const ground = (p: XY) => 2.15 - 0.0423 * p[0] - 0.0094 * p[1]

/** way/323193332 in the model frame. */
const OUTLINE: XY[] = [[-13.6, -22.0], [-13.6, -17.5], [-38.1, -17.5], [-38.1, -9.6], [-57.4, -9.6], [-57.4, 9.2], [-38.1, 9.2], [-38.1, 17.9], [13.2, 17.9], [13.2, 24.6], [28.9, 24.6], [43.5, 24.6], [43.5, 7.2], [38.0, 7.2], [38.1, 11.1], [28.9, 11.1], [23.4, 11.1], [23.3, 1.5], [17.9, 1.5], [18.1, -16.8], [-5.8, -17.2], [-5.8, -22.0], [-9.8, -22.0]]
const MAIN: XY[] = [[-38.1, 9.2], [-38.1, -17.5], [-13.6, -17.5], [-5.8, -17.2], [18.1, -16.8], [17.9, 1.5], [23.3, 1.5], [23.4, 12.2], [18.0, 12.3], [18.0, 17.9], [-38.1, 17.9]]

export function buildNodaMills(): Built {
  const brick = new Part(), win = new Part(), trim = new Part(), roof = new Part()
  const kit: Kit = { win, trim, roof, ground, frame: trim }
  // Raised basement, then two tall storeys; the basement row only shows
  // where the ground falls away to the east and north.
  const mill: Row[] = [{ z0: 1.2, z1: 3.2, w: 1.6, head: 'segment' }, { z0: 4.8, z1: 8.6, w: 2.1, head: 'segment' }, { z0: 9.6, z1: 13.4, w: 2.1, head: 'segment' }]
  const blocks: Block[] = [
    { poly: MAIN, top: 14.4, ridge: { axis: 'x', at: 0.5, z: 15.4 }, wall: brick, rows: mill, pitch: 3.4 },
    // West wing: one tall storey of big arched windows.
    { poly: rect(-57.4, -9.6, -38.1, 9.2), top: 9.3, wall: brick, rows: [{ z0: 5.2, z1: 8.4, w: 2.2, head: 'segment' }], pitch: 3.6 },
    // East annexes, flat behind parapets.
    { poly: [[13.2, 17.9], [13.2, 24.6], [28.9, 24.6], [28.9, 11.1], [23.4, 11.1], [23.4, 12.2], [18.0, 12.3], [18.0, 17.9]], top: 10.0, wall: brick, rows: [{ z0: 1.2, z1: 3.6, w: 1.6, head: 'segment' }, { z0: 5.0, z1: 8.4, w: 1.7, head: 'segment' }], pitch: 3.4 },
    { poly: [[28.9, 24.6], [43.5, 24.6], [43.5, 7.2], [38.0, 7.2], [38.1, 11.1], [28.9, 11.1]], top: 7.5, wall: brick, rows: [{ z0: 1.2, z1: 3.4, w: 1.5, head: 'flat' }, { z0: 4.2, z1: 6.4, w: 1.5, head: 'flat' }], pitch: 3.6 },
  ]
  build(blocks, kit)

  // The towers: brick shafts a storey over the eaves, a pale cornice band.
  const tower = (R: XY[], top: number, front: (o: XY) => boolean, door: boolean) => {
    softBox(brick, R, -0.6, top, 0.3, roof)
    softBox(trim, inset(R, -0.15), top - 0.8, top - 0.25, 0.12, null)
    for (const f of faces(R)) {
      if (!front(f.o) || f.L < 4) continue
      window(win, f.c, f.u, f.o, { z0: 9.8, z1: 13.4, w: 1.7, head: 'segment' }, trim)
      oculus(win, f.c, f.u, f.o, top - 1.6, 0.45)
      window(win, f.c, f.u, f.o, door ? { z0: 2.6, z1: 7.8, w: 3.0, head: 'round' } : { z0: 4.4, z1: 7.4, w: 1.4, head: 'segment' }, trim)
    }
  }
  tower(rect(-13.6, -22.0, -5.8, -17.2), 16.5, (o) => o[1] < -0.5 || Math.abs(o[0]) > 0.5, false)
  tower(rect(-14.0, 17.6, -6.2, 22.6), 15.8, (o) => o[1] > 0.5 || Math.abs(o[0]) > 0.5, true)

  // The stack, free-standing east of the annexes (lidar).
  stack(brick, [46.5, 19.5], 1.6, 1.3, -0.6, 22.5, trim)

  return {
    id: 'clt-noda-mills', name: 'Mecklenburg Mill (Lofts at NoDa Mills)', anchor: centroid(OUTLINE), height: 22.5,
    parts: [
      { part: brick, material: BRICK },
      { part: roof, material: MILL_ROOF },
      { part: win, material: PALETTE.window },
      { part: trim, material: PALETTE.trim },
    ],
  }
}

if (import.meta.main) await write(buildNodaMills())
