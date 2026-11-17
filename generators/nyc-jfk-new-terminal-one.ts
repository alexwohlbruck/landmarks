/**
 * JFK Airport New Terminal One (2026, Gensler), Queens — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-jfk-new-terminal-one.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 29.5°, the terminal's own grid (OSM's long walls run 118–120°,
 * its short ones 29–31°). Model north is the landside, facing the Central
 * Terminal Area. Anchor: area centroid of the OSM outline way/1359238780
 * ("New Terminal 1", aeroway=terminal), -73.7871869, 40.6416208.
 *
 * Status: built 2022–26 south of Terminal 1 on the site of Terminals 2 and
 * 3; the first phase opened in 2026, later phases (more gates replacing
 * Terminal 1) continue to 2030 (Wikipedia, "New Terminal One"). The model is
 * what OSM maps now. Terminal 1 (nyc-jfk-terminal-1, way/284907685) stays a
 * separate placement; the two outlines do not overlap.
 *
 * Identifying features:
 *  1. The headhouse: a tall glass hall under a folded "butterfly" roof, high
 *     at both ends and dipping to the middle, where a raised glazed lantern
 *     runs front to back.                                    (p0, p3)
 *  2. Its leaning glass curtain wall with big diagonal mullions.  (p3)
 *  3. Behind it the concourse: pale grey panelled boxes, three storeys on
 *     columns, with dark glazed bands between them and a set-back glazed
 *     clerestory along the top.                              (p2, p4)
 *  4. The pier running south-east to the gates.              (p0, OSM)
 *
 * Evidence — thin; the model is kept plain:
 * - OSM way/1359238780, a coarse 20-node trace from imagery (no height,
 *   no parts). The plan follows it as drawn.
 * - Lidar: none. USGS 3DEP NY_NewYorkCity (2017) is the only dataset here
 *   and predates construction.
 * - Photos (Wikimedia Commons):
 *   p2 https://commons.wikimedia.org/wiki/File:New_Terminal_One_(NTO),_John_F._Kennedy_Airport_(JFK),_New_York_City,_New_York_(USA)_(54742642851).jpg
 *      (Charles from Port Chester, CC0, Aug 2025) the concourse from the airfield;
 *   p3 https://commons.wikimedia.org/wiki/File:New_Terminal_One_(NTO),_John_F._Kennedy_Airport_(JFK),_New_York_City,_New_York_(USA)_(54742871129).jpg
 *      (same, CC0) the headhouse's glass wall, folded roof edge and lantern;
 *   p4 https://commons.wikimedia.org/wiki/File:New_Terminal_One_(NTO),_John_F._Kennedy_Airport_(JFK),_New_York_City,_New_York_(USA)_(54742871154).jpg
 *      (same, CC0) the concourse boxes on columns and the clerestory.
 * - Rendering: p0 https://commons.wikimedia.org/wiki/File:JFK_Terminal_One.jpg
 *   (ANEWJFK, CC0, 2024) an aerial rendering by the terminal's company. Used
 *   only for forms the photos confirm (the butterfly roof and lantern); it
 *   is not as-built.
 *
 * Estimated (no measurement exists): every height. Concourse 20 m with its
 * clerestory to 24 m; headhouse eaves 34 m at the ends and 24 m at the
 * valley, the lantern to 33 m, judged from p3/p4 against the concourse's
 * three storeys and the other JFK terminals' lidar heights (T1 23 m, T4
 * 30 m). The lantern's width and position (centred on the headhouse) and
 * the clerestory's extent are read off p0 and p4. The headhouse walls are
 * drawn upright; the real curtain wall leans out. The rendering's ground
 * transport canopy, the roof's diamond plan and the solar panels are left
 * out.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, clip, ccw, rect, zones, slopedZone, type Facade } from './nyc-jfk-terminal-5'
import { inside, finishModel } from './nyc-570-lexington'
import { box } from './atl-flatiron-building'

const OUTLINE: XY[] = ccw([[10.2, 67.0], [12.0, 157.3], [-213.9, 157.5], [-215.4, 85.0], [-182.2, 70.4], [-182.6, 54.6], [-183.0, 41.2], [-181.5, -50.0], [52.8, -42.5], [80.1, -43.8], [79.9, -54.8], [84.1, -56.7], [115.4, -70.9], [231.8, -228.3], [235.5, -295.7], [333.4, -293.2], [155.5, -58.6], [117.4, -38.2], [118.2, 65.8]])

const HEAD = rect(-230, 66, 20, 170) // the headhouse's share of the outline
const PIER_CUT = rect(-230, -52, 118.5, 170) // everything that is not the pier
const XV = -101, HALF = 114 // the butterfly's valley (the lantern) and the headhouse's half-length
const headZ = (q: XY) => 24 + (10 * Math.min(1, Math.abs(q[0] - XV) / HALF))
const CONCOURSE = 20, CLERESTORY = 24, LANTERN = 33

function build() {
  const panel = new Part(), win = new Part(), roof = new Part(), glass = new Part(), white = new Part()
  const ext = [OUTLINE]
  const head = clip('intersection', [OUTLINE], [HEAD])
  const pier = clip('difference', [OUTLINE], [PIER_CUT])
  const concourse = clip('difference', [OUTLINE], [HEAD], [pier[0]])
  // A set-back glazed clerestory along the concourse and the pier.
  const PIER_SPINE: XY[] = [[132, -64], [148, -76], [291, -266], [275, -278]] // 20 m wide, down the pier's middle
  const clere = [...clip('intersection', concourse, [rect(-165, -32, 100, 50)]), ...clip('intersection', pier, [ccw(PIER_SPINE)])]

  const boxes: Facade = { bay: 9, ratio: 0.7, floor: 4.5, group: 2, spandrel: 1.6, sill: 1.5, head: 2.5, ground: 6, minLength: 8 }
  const band: Facade = { bay: 6, ratio: 0.92, floor: 3.4, group: 1, spandrel: 0, sill: 0.4, head: 0.5, ground: 0.4, minLength: 4 }
  const list = [
    { rings: concourse, z: CONCOURSE, facade: boxes },
    { rings: pier, z: CONCOURSE - 1, facade: boxes },
    { rings: clere, z: CLERESTORY, facade: band },
  ]
  const inHead = (q: XY) => head.some((r) => inside(q, r))
  const zoneAt = (q: XY) => { let h = 0; for (const z of list) for (const r of z.rings) if (inside(q, r)) h = Math.max(h, z.z); return Math.max(h, inHead(q) ? headZ(q) : 0) }
  zones({ wall: panel, win, roof, coping: white, exterior: [...ext, ...clere], list, heightAt: (q) => (inHead(q) ? headZ(q) : 0) })

  // The headhouse: glass walls all round under the butterfly roof.
  const hall: Facade = { bay: 7, ratio: 0.9, floor: 7, group: 1, spandrel: 0.5, sill: 0.4, head: 1.4, ground: 0.4, minLength: 4 }
  for (const h of head) {
    slopedZone({ roof, wall: panel, win, fascia: white, ring: h, z: headZ, axis: 0, step: 19, exterior: ext, heightAt: (q) => (inHead(q) ? headZ(q) : zoneAt(q)), facade: () => hall })
  }
  // The glazed lantern along the valley, front to back.
  box(glass, XV - 11, XV + 11, 70, 153, 22, LANTERN, glass, 0.4)

  finishModel('JFK Airport New Terminal One', 'nyc-jfk-new-terminal-one', [
    { part: panel, material: finish('nto-panel', 0xd2d5d6) },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('nto-roof', 0xc2c6c8) },
    { part: glass, material: PALETTE.glass },
    { part: white, material: PALETTE.trim },
  ], { bearing: 29.5, osm: 'way/1359238780', height: LANTERN }, 6500)
}

if (import.meta.main) build()
