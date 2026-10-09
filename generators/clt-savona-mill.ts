/**
 * Savona Mill, 500 S. Turner Ave, Wesley Heights / Seversville, Charlotte —
 * procedural, CC0-1.0.
 * bun generators/clt-savona-mill.ts
 *
 * The 1911 cotton mill on Stewart Creek, converted to apartments, offices
 * and shops (reopened 2024). One long building along South Turner Avenue in
 * three parts, north to south:
 *  - the north block: a concrete-frame mill, brick infill panels between
 *    grey concrete piers and floor bands, two windows a bay, a flat roof with
 *    a new penthouse and roof deck;
 *  - the middle block, the original mill: three tall storeys of big
 *    multi-pane windows in plain red brick, a very low gabled roof behind a
 *    white eave, a stair tower on the west face;
 *  - the south block: a one-storey weave shed with round-arched windows and
 *    a long roof monitor down its middle.
 *
 * "Vera at Savona Mill" (way/1234696611) is not part of the mill: it is a new
 * four-storey white apartment block north-west of it (City Dweller 2's July
 * 2025 photos), so it is neither modelled nor replaced. The parking deck
 * west of the mill (way/1221610331) is new too and left alone.
 *
 * Evidence:
 *  - OSM: way/324411943 (outline) and its building:parts: way/1329177209
 *    (the roof monitor), …211, …212, …214 (roof penthouses), …213 (the
 *    rooftop structure at the north/middle junction), …215 (a small part on
 *    the south block's roof, not modelled: it sits at the roof's own height).
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m (ground_min 192.77 m
 *    NAVD88). Base 8.5 m above ground_min (the west wall); ground rises to
 *    ~10.4 on Turner Ave (east) and 13.5 at the north-east corner. A 2016 pit
 *    west of the middle block (to 5.6 m) is now under the new parking deck
 *    and ignored. Heights above base: north block parapet 16.0; middle block
 *    eave 16.7, ridge 17.4 on the block's axis; west stair tower ~16.6; old
 *    stair tower at the junction 19.5; south block eave 6.8, roof monitor
 *    9.4. The flight predates the conversion, so the new penthouses are not
 *    in it.
 *  - Photos (Commons): Dclemens1971, "Savona Mill 01", "02", "03", CC BY 4.0
 *    (the Turner Ave face of the middle block; the north block's corner);
 *    City Dweller 2, CC BY-SA 4.0: "Savona Mill Seversville February 2024"
 *    (the north block from the north-west, the penthouse), "Savona Mill and
 *    Vera Turner St February 2024", "Savona Mill Turner St February 2024",
 *    "Savona Mill along Turner Ave Mid-July 2025", "Savona Mill along Turner
 *    St Late October 2025" (the south block's arched windows with the
 *    middle block's gable end behind), "Vera at Savona Mill along Turner St
 *    Mid-July 2025". USGS NAIP (2016, before the conversion) for the plan,
 *    the white north roof and the monitor.
 *
 * Estimated: window counts and bay widths (photos), storey heights, the
 * penthouse heights (OSM's 18/20 m read from Turner Ave: 19.5–20.5 above
 * base), the monitor's clerestory, the roof colours (the 2016 roofs were
 * black membrane; post-conversion roofs are not seen in any photo).
 *
 * Model frame: bearing 23.8 (model +y runs along the mill, north-north-east);
 * origin at -80.86729, 35.24163; metres above the base.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import {
  type Block, type Built, type Kit, type Row, type XY,
  BRICK, build, centroid, faces, prism, rect, softBox, window, write,
} from './clt-highland-park-mill-3'

/** Grey board-formed concrete of the north block's frame. */
const CONCRETE = finish('savona-concrete', 0xc2bdb4)

/** Ground above base: a plane fitted to the lidar ground round the mill (sd 0.9 m). */
const ground = (p: XY) => 0.67 + 0.035 * p[0] + 0.0143 * p[1]

/** way/324411943 in the model frame. */
const OUTLINE: XY[] = [[-13.7, -60.0], [-13.6, -36.6], [-18.0, -36.6], [-18.0, -27.6], [-14.0, -27.6], [-13.9, -18.6], [-13.8, 15.6], [-13.4, 30.2], [-13.3, 34.5], [-19.2, 34.5], [-19.2, 44.6], [-14.0, 44.6], [-13.6, 129.2], [24.6, 129.1], [25.0, 92.6], [25.2, 15.6], [24.8, -54.4], [26.2, -54.4], [26.2, -60.0]]
/** way/1329177213: the rooftop structure where the north block meets the middle one. */
const TOP: XY[] = [[-12.4, 100.9], [-12.4, 92.3], [-2.5, 92.3], [-2.4, 97.3], [10.0, 97.2], [10.0, 95.5], [16.7, 95.5], [16.7, 99.7], [9.0, 99.7], [9.1, 115.5], [3.5, 115.5], [3.4, 100.8]]

const X0 = -13.7, X1 = 25.0, YS = 12, YN = 94

export function buildSavona(): Built {
  const brick = new Part(), conc = new Part(), win = new Part(), trim = new Part(), roof = new Part()
  const kit: Kit = { win, trim, roof, ground }

  // The middle block: three tall storeys, the top row shorter (Dclemens1971's photos).
  const mill: Row[] = [{ z0: 2.6, z1: 6.5, w: 2.2 }, { z0: 7.4, z1: 11.3, w: 2.2 }, { z0: 12.2, z1: 15.2, w: 2.2 }]
  // The weave shed: one storey of round-arched windows.
  const shed: Row[] = [{ z0: 1.3, z1: 5.7, w: 2.5, head: 'round' }]
  const blocks: Block[] = [
    { poly: rect(X0, YS, X1, YN), top: 16.7, ridge: { axis: 'y', at: (X0 + X1) / 2, z: 17.4 }, wall: brick, rows: mill, pitch: 3.4 },
    { poly: rect(-19.2, 34.5, X0, 44.6), top: 16.9, wall: brick, rows: mill, pitch: 3.4 },
    { poly: rect(X0, -60, X1, YS), top: 6.8, ridge: { axis: 'y', at: (X0 + X1) / 2, z: 7.3 }, wall: brick, rows: shed, pitch: 4.3 },
    { poly: rect(-18.0, -36.6, X0, -27.6), top: 7.2, wall: brick },
    { poly: rect(X1 - 0.2, -60, 26.2, -54.4), top: 6.2, wall: brick },
    // The roof monitor, clerestory windows down both sides.
    { poly: rect(1.5, -52.4, 10.1, YS), top: 9.0, ridge: { axis: 'y', at: 5.8, z: 9.4 }, wall: brick, rows: [{ z0: 7.7, z1: 8.7, w: 2.3 }], pitch: 3.0 },
    // The north block: walls and roof from the kit, its concrete frame added below.
    { poly: rect(X0, YN, 24.6, 129.2), top: 16.0, wall: brick, base: { part: conc, z: 2.2 } },
  ]
  build(blocks, kit)

  // North block concrete frame: piers at each bay line, a band at each floor
  // and under the coping; two windows a bay on each storey.
  {
    const R = rect(X0, YN, 24.6, 129.2), d = 0.1, pw = 0.7
    const bands: [number, number][] = [[5.4, 6.3], [10.5, 11.4], [15.2, 16.0]]
    const rows: Row[] = [{ z0: 2.6, z1: 4.9, w: 1.6 }, { z0: 6.9, z1: 9.9, w: 1.6 }, { z0: 12.0, z1: 14.7, w: 1.6 }]
    for (const f of faces(R)) {
      if (f.o[1] < -0.9) continue // the south face is against the middle block
      const nb = Math.max(1, Math.round(f.L / 6.6)), bw = f.L / nb
      const at = (s: number): XY => [f.c[0] + f.u[0] * s, f.c[1] + f.u[1] * s]
      const strip = (s0: number, s1: number, z0: number, z1: number) => {
        const a = at(s0), b = at(s1)
        prism(conc, [a, b, [b[0] + f.o[0] * d, b[1] + f.o[1] * d], [a[0] + f.o[0] * d, a[1] + f.o[1] * d]], z0, z1)
      }
      for (let i = 0; i <= nb; i++) {
        const s = -f.L / 2 + i * bw
        strip(Math.max(-f.L / 2, s - pw / 2), Math.min(f.L / 2, s + pw / 2), 2.0, 15.2)
      }
      for (const [z0, z1] of bands) strip(-f.L / 2, f.L / 2, z0, z1)
      // On the street faces (north, east) the ground floor is half sunk: the
      // concrete foundation shows up to the first floor band (Dclemens1971 "02").
      const street = f.o[0] > 0.9 || f.o[1] > 0.9
      if (street) strip(-f.L / 2, f.L / 2, 2.0, 5.4)
      for (let i = 0; i < nb; i++) {
        const sc = -f.L / 2 + (i + 0.5) * bw
        for (const k of [-1, 1]) {
          const c = at(sc + k * bw * 0.22)
          for (const r of street ? rows.slice(1) : rows) if (ground(c) < r.z0 - 0.3) window(win, c, f.u, f.o, r)
        }
      }
    }
  }

  // Roof structures: the new penthouse at the junction (pale cladding),
  // stair/lift penthouses on both roofs.
  prism(trim, TOP, 16.0, 20.5, roof)
  for (const R of [rect(-8.2, 35.7, -4.1, 46.8), rect(-1.2, 37.2, 2.8, 48.3)]) softBox(trim, R, 16.8, 19.8, 0.25, roof)
  softBox(trim, rect(-8.4, 108.3, -4.4, 119.4), 15.5, 19.5, 0.25, roof)

  return {
    id: 'clt-savona-mill', name: 'Savona Mill', anchor: centroid(OUTLINE), height: 20.5,
    parts: [
      { part: brick, material: BRICK },
      { part: conc, material: CONCRETE },
      { part: roof, material: PALETTE.roof },
      { part: win, material: PALETTE.window },
      { part: trim, material: PALETTE.trim },
    ],
  }
}

if (import.meta.main) await write(buildSavona())
