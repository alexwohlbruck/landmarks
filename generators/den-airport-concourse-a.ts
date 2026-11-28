/**
 * Denver International Airport (DEN): Concourse A, with the A bridge over
 * the taxiway to the Jeppesen Terminal and the bridge's south headhouse.
 * Procedural, CC0-1.0, no textures.
 *
 *   bun generators/den-airport-concourse-a.ts
 *
 * Writes models/den-airport-concourse-a.glb (low) and .detail.glb. Also the
 * small kit the other DEN concourse models import (`DEN` colours, the stacked
 * concourse layers, clerestory spines, raised pods with their taupe stair
 * towers, the stepped glass "ziggurat" cores, jet bridges, the writer);
 * importing this file builds nothing.
 *
 * Frame: x east, y north, z up, metres, bearing 0 (the concourses run within
 * a fraction of a degree of east-west). Anchor (-104.674351, 39.853868): the
 * area centroid of OSM way/81294915 (Concourse A).
 *
 * Evidence
 * - OSM: way/81294915 (Concourse A, aeroway=terminal; no parts, no heights),
 *   way/81468339 (the A bridge's south headhouse, building=yes,
 *   aeroway=terminal), way/81468355 (the short link from the headhouse to the
 *   terminal, building=yes, bridge=yes), way/461365914 ("Bridge to A Gates",
 *   man_made=bridge, bridge=covered: the taxiway bridge itself, not a
 *   building, so the map draws nothing for it), 60-odd aeroway=jet_bridge
 *   lines (A gates). Footprints used as mapped.
 * - Lidar: USGS 3DEP CO_DRCOG_2_2020 (flown 2020), 1 m grid, seven tiles
 *   along the concourse and the bridge. Heights above the apron (1637.5 m;
 *   the map's terrain here is flat within about 1 m):
 *   - wings 13.5 m (the outer bays) with a raised clerestory spine 16.8 m
 *     (about 13 m wide) along the middle; pods across the wing 18.2-18.5 m
 *     at x -181..-112 and 210..279, each with a 21 m lantern;
 *   - the core: an octagon at 18.7 m, the stepped glass roof 21.5, 24.0,
 *     26.3 m, crown 26.9 m; the cross arms to the north (22 m) and the south
 *     diamond to the bridge landing (24-25 m, a 30.5 m landing block);
 *   - the ramp control tower on the south side of the core: 42.7 m;
 *   - the bridge roof 25.2 m at the concourse end rising to 27.1 m mid-span
 *     and 26 m at the south end (the deck is a box about 7 m deep);
 *   - the headhouse: a 37.5-42 m block (x -17..28) and 15.4-20 m halls east
 *     of the bridge.
 *   The flight predates the 2018-2022 gate expansion: A west (x < -230) and
 *   the A east arm (x > 320, y > 20) are construction sites or missing in it.
 *   Those parts follow the current OSM outline at the heights of the old
 *   wings (13.5 m and a 16.8 m spine), checked against the photos below;
 *   estimated, not measured.
 * - NAIP 2019 (USGS, public domain): plan, the white membrane roofs, the
 *   stepped core roofs; the A bridge from above.
 * - Photos (Wikimedia Commons):
 * *   - "Denver Airport at Sunset (54126632282).jpg", Tony Webster, CC BY 2.0:
 *     the A bridge from the taxiway west of it (a long lit glass box on deep
 *     trusses, the headhouse block at its south end) and A's ramp tower
 *     behind it (white shaft, dark cab band, flat roof).
 *   - "Denver Intl Airport Concourse A (202521963).jpeg", Eric Johnson,
 *     CC BY-SA 3.0 and "New Concourse A Denver International Airport.jpg",
 *     Colin Venable, CC BY-SA 4.0: inside, the clerestory spine over the
 *     moving walks, and the tall glazed new A west gates.
 * *   - Shared facade evidence with B and C (same 1995 design, Fentress
 *     Bradburn / Allred Fulton concourses): "DEN Air Traffic Control
 *     Tower.jpg", Bmurphy380, CC BY-SA 4.0; "Denver A Terminal.jpg",
 *     TastyPoutine, CC BY-SA 3.0; "Denver concourse B west ramp
 *     (29657388588).jpg", airbus777, CC BY 2.0; "Central portion of
 *     Concourse B at Denver International Airport (2021).jpg", Steve Morgan,
 *     CC BY-SA 4.0: cream-white panel walls, two long teal-grey glass
 *     ribbons (gate lounges and an upper band), taller white pods flanked by
 *     taupe stair towers, the cores' stepped glass tiers.
 * - Published: the A bridge opened with the airport in 1995, 365 ft (111 m)
 *   over the taxiway (DEN, Wikipedia "Denver International Airport"); the
 *   gate expansion 2018-2022 (39 gates on A, B and C, DEN).
 *
 * Estimated: the glass ribbons' heights (from the photos against the
 *   measured parapet), the taupe stair towers' size and positions (one pair
 *   per pod, from the photos), the bridge's depth (7 m, photo), the
 *   expansion heights (above).
 *
 * Colours: walls cream-white (photos, matched to the Jeppesen Terminal's
 *   body), roofs pale membrane grey (NAIP), glass a mid teal #5f8c8e (the
 *   ribbons read clear teal-green in every daylight photo; darkened in review), taupe stair
 *   towers, pale silver jet bridges.
 * Night: the glass ribbons, the clerestories and the stepped core glass are
 *   lit (`window`), as in night photos of the concourses; the ramp tower cab
 *   too. The bridge glazing is lit (the sunset photo).
 *
 * Doubts: no licensed exterior photo shows A's own wings close up; they are
 *   drawn like B and C, which share the design. The A west and A east arm
 *   heights postdate the lidar and are estimates. The headhouse's tall block
 *   is taken from the lidar only.
 *
 * Replaces way/81294915, way/81468339, way/81468355. Requested "with the
 * pedestrian bridge if OSM maps it as a building part of A": it does not; the
 * bridge is man_made=bridge way/461365914 (not drawn by the map), so it is
 * modelled here with its headhouse, which OSM maps as its own building.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { finish, windowVariant, type Swatch } from './palette'
import { clean, clip, area, cap, walls, rect, box, panelRow, mullions, bandRow, jetBridges, plantClusters, type XY } from './atl-hartsfield-jackson-domestic-terminal'
import { inset } from './clt-terminal'
import { toFrame } from './atl-flatiron-building'

export type { XY }
export { rect, toFrame }

// ---------------------------------------------------------------------------
// DEN colours (daylight photos and NAIP, pulled to the palette)

export const DEN = {
  /** Cream-white metal panel walls; a touch lighter than the terminal body (0xe4e0d8). */
  wall: finish('den-concourse-wall', 0xe8e5de) as Swatch,
  /** White membrane roofs, slightly grey (NAIP). */
  roof: finish('den-concourse-roof', 0xd6d9da) as Swatch,
  /** Mid teal glass (review: the photos show a clear teal-green); lit at night. */
  win: windowVariant(2, 0x5f8c8e),
  /** Taupe stair towers and the tower base. */
  taupe: finish('den-taupe', 0xc9bfaf) as Swatch,
  /** Jet bridges: pale silver. */
  metal: finish('den-jetbridge', 0xcdd1d3, 0.6) as Swatch,
  /** Skylight glass on the core roofs; dark at night. */
  glass: { name: 'glass', color: 0xa9c2cf, roughness: 0.24 } as Swatch,
}

export type DenParts = { wall: Part; roof: Part; win: Part; taupe: Part; metal: Part; glass: Part }
export const newParts = (): DenParts => ({ wall: new Part(), roof: new Part(), win: new Part(), taupe: new Part(), metal: new Part(), glass: new Part() })
export const materials = (p: DenParts) => [
  { part: p.wall, material: DEN.wall },
  { part: p.roof, material: DEN.roof },
  { part: p.win, material: DEN.win },
  { part: p.taupe, material: DEN.taupe },
  { part: p.metal, material: DEN.metal },
  { part: p.glass, material: DEN.glass },
]

// ---------------------------------------------------------------------------
// Kit

/** OSM lon/lat to the frame, cleaned and counter-clockwise. */
export const osmRing = (coords: XY[], anchor: { lng: number; lat: number }, tol = 0.6): XY[] => clean(toFrame(coords, anchor, 0), tol)

/** The part of a ring inside an axis-aligned rectangle. */
export function clipRect(r: XY[], x0: number, y0: number, x1: number, y1: number): XY[] {
  let q = clip(r, 1, 0, x1)
  q = clip(q, -1, 0, -x0)
  q = clip(q, 0, 1, y1)
  q = clip(q, 0, -1, -y0)
  return q.length >= 3 && Math.abs(area(q)) > 2 ? clean(q, 0.3) : []
}

/** A chamfered rectangle (octagon when the chamfer is large). */
export function chamferRect(x0: number, y0: number, x1: number, y1: number, c: number): XY[] {
  if (c <= 0) return rect(x0, y0, x1, y1)
  return [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
}

export type Facade = 'wing' | 'pod' | 'tier' | 'plain' | 'none'

/**
 * Glazing on the edges of a ring standing from z0 to z1:
 * - wing: the gate-lounge ribbon (5.4-9.8 m above the apron) under a deep
 *   white fascia, and a broken apron-level band (1.2-3.6 m), in broad bays
 *   with piers between;
 * - pod: bands two storeys tall (white spandrels between on tall blocks);
 * - tier: a continuous strip of glass round a step of a core;
 * - plain: one narrow band.
 */
export function facade(p: DenParts, r: XY[], z0: number, z1: number, kind: Facade, detail = false, minLen = 6) {
  if (kind === 'none') return
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < (kind === 'wing' ? Math.max(minLen, 11) : minLen)) continue
    if (kind === 'wing') {
      // the gate-lounge ribbon under a deep white fascia, and the broken
      // apron-level band below it (photos)
      panelRow(p.win, a, b, z0 + 5.4, Math.min(z1 - 3.4, z0 + 9.8), { bay: 15, gap: 1.4, end: 1.2 })
      if (z1 - z0 > 8) panelRow(p.win, a, b, z0 + 1.2, z0 + 3.6, { bay: 18, gap: 5.0, end: 2.5 })
      if (detail) mullions(p.wall, a, b, z0 + 5.4, Math.min(z1 - 3.4, z0 + 9.8), 3, 0.16, 0.1)
    } else if (kind === 'pod') {
      // two-storey bands with white spandrels between on tall blocks
      for (let z = z0 + 0.8; z < z1 - 3.3; z += 7.6) panelRow(p.win, a, b, z, Math.min(z + 6.2, z1 - 1.3), { bay: 8, gap: 1.2, end: 1.4 })
    } else if (kind === 'tier') {
      panelRow(p.win, a, b, z0 + 0.15, z1 - 0.4, { bay: 7, gap: 0.45, end: 0.4 })
      if (detail) mullions(p.wall, a, b, z0 + 0.15, z1 - 0.4, 2.4, 0.14, 0.09)
    } else {
      panelRow(p.win, a, b, z0 + 1.0, Math.min(z1 - 1.0, z0 + 3.4), { bay: 8, gap: 1.2, end: 1.2 })
    }
  }
}

/** A layer of the stack: ring extruded from z0 to z1 with a chamfered parapet, its roof, its glazing. */
export function layer(p: DenParts, r: XY[], z0: number, z1: number, kind: Facade, o: { wall?: Part; top?: Part | null; bevel?: number; detail?: boolean } = {}) {
  if (r.length < 3) return r
  const ring = box(o.wall ?? p.wall, o.top === undefined ? p.roof : o.top, r, z0, z1, o.bevel ?? 0.45)
  facade(p, ring, z0, z1, kind, o.detail)
  return ring
}

/** A clerestory spine along x: a raised roof monitor with glass down both long sides. */
export function spine(p: DenParts, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const r = rect(x0, y0, x1, y1)
  box(p.wall, p.roof, r, z0, z1, 0.3)
  const s0: XY = [x0, y0], s1: XY = [x1, y0], n0: XY = [x1, y1], n1: XY = [x0, y1]
  panelRow(p.win, s0, s1, z0 + 0.45, z1 - 0.6, { bay: 12, gap: 1.0, end: 1.0 })
  panelRow(p.win, n0, n1, z0 + 0.45, z1 - 0.6, { bay: 12, gap: 1.0, end: 1.0 })
}

/**
 * A pod: a rectangular block across the wing standing above its roof, glazed,
 * with a taupe stair tower at each corner of its long faces (as in the
 * photos), standing a little proud of the wall and a little above the roof.
 */
export function pod(p: DenParts, outline: XY[], x0: number, x1: number, y0: number, y1: number, zw: number, h: number, o: { towers?: boolean; lantern?: [number, number, number, number, number] } = {}) {
  const r = clipRect(outline, x0, y0, x1, y1)
  if (!r.length) return
  layer(p, r, zw, h, 'pod')
  if (o.towers ?? true) {
    const tw = Math.min(6, (x1 - x0) / 4), td = 5
    for (const [xa, xb] of [[x0 - 0.3, x0 + tw], [x1 - tw, x1 + 0.3]] as [number, number][]) {
      for (const [ya, yb] of [[y0 - 0.3, y0 + td], [y1 - td, y1 + 0.3]] as [number, number][]) {
        const t = clipRect(outline, xa, ya, xb, yb)
        if (t.length) box(p.taupe, p.taupe, rect(xa, ya, xb, yb), 0, h + 1.4, 0)
      }
    }
  }
  if (o.lantern) {
    const [a, b, c, d, hz] = o.lantern
    layer(p, rect(a, c, b, d), h, hz, 'tier')
  }
}

/** A stepped glass core roof: tiers, each a ring standing on the one below with a glass strip round it. */
export function ziggurat(p: DenParts, base: number, tiers: { r: XY[]; z: number }[], detail = false) {
  let z0 = base
  for (const t of tiers) {
    layer(p, t.r, z0, t.z, 'tier', { bevel: 0.25, detail })
    z0 = t.z
  }
}

/** A thin rooftop slab over a ring (canopy, eave): top and bottom faces and edges. */
export function slab(part: Part, r: XY[], z0: number, z1: number) {
  const ring = clean(r, 0.05)
  walls(part, ring, z0, z1)
  cap(part, ring, z1)
  cap(part, ring, z0, false)
}

/** Jet bridges from OSM lines (lon/lat) near the concourse. */
export function denJetBridges(p: DenParts, lines: XY[][], detail: boolean, z = 3.9) {
  if (detail) { jetBridges(p.metal, p.taupe, lines, z, true); return }
  // low model: one straight pale box per bridge, building to aircraft end, no post
  const W = 3.5, H = 3.6
  for (const l of lines) {
    const a = l[0], b = l.at(-1)!, L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4) continue
    const n: XY = [-(b[1] - a[1]) / L * W / 2, (b[0] - a[0]) / L * W / 2]
    let r: XY[] = [[a[0] - n[0], a[1] - n[1]], [b[0] - n[0], b[1] - n[1]], [b[0] + n[0], b[1] + n[1]], [a[0] + n[0], a[1] + n[1]]]
    if (area(r) < 0) r = r.reverse()
    walls(p.metal, r, z, z + H)
    cap(p.metal, r, z + H)
  }
}

/** Write a GLB under a triangle and byte budget. */
export async function writeModel(file: string, name: string, parts: Array<{ part: Part; material: MaterialSpec }>, o: { height: number; maxTris: number; maxBytes: number }) {
  const used = parts.filter(({ part }) => part.triangles > 0)
  const triangles = used.reduce((t, { part }) => t + part.triangles, 0)
  if (used.length > 6) throw new Error(`${file}: ${used.length} materials`)
  const glb = writeGlb(name, used, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 0, elevation: 0, height: o.height,
  })
  console.log(`${file}: ${triangles} triangles, ${glb.length} bytes, ${used.length} materials (${used.map((u) => `${u.material.name} ${u.part.triangles}`).join(', ')})`)
  if (triangles > o.maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  if (glb.length > o.maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  await Bun.write(new URL(`../models/${file}`, import.meta.url).pathname, glb)
}

/** Rooftop plant on a wing roof between x0 and x1 along y = yc. */
export function plant(p: DenParts, x0: number, x1: number, yc: number, z: number, seed: number, detail: boolean) {
  if (!detail) return // rooftop plant only in the detail model (budget)
  plantClusters(p.roof, [x0, yc], [x1, yc], z, seed, { every: 70, half: 4, detail })
}

export { inset, bandRow }

// ---------------------------------------------------------------------------
// Concourse A

const ANCHOR = { lng: -104.674351, lat: 39.853868 }

// OSM way/81294915 in the frame.
const A_RAW: XY[] = [[-228, 15], [-231, 15], [-231, 16], [-241, 16], [-241, 20], [-265, 20], [-265, 16], [-279, 16], [-279, 19], [-289, 19], [-289, 22], [-334, 22], [-334, 18], [-343, 18], [-343, 8], [-350, 8], [-349, 20], [-367, 21], [-368, 16], [-372, 16], [-424, 17], [-424, 22], [-443, 22], [-443, 20], [-451, 20], [-451, 23], [-496, 24], [-496, 20], [-507, 20], [-507, 18], [-518, 18], [-518, 23], [-541, 23], [-541, 20], [-572, 20], [-572, -20], [-504, -21], [-168, -22], [-168, -27], [-126, -27], [-126, -23], [-119, -22], [-9, -23], [-9, -32], [-1, -32], [-1, -38], [16, -55], [13, -58], [33, -79], [33, -83], [31, -83], [31, -87], [59, -87], [59, -83], [58, -83], [57, -80], [78, -61], [75, -57], [94, -39], [95, -34], [103, -34], [103, -26], [218, -26], [221, -31], [268, -31], [268, -27], [328, -27], [328, -15], [336, -15], [336, -11], [371, -11], [371, -14], [382, -14], [382, -11], [426, -11], [426, -15], [433, -15], [433, -27], [471, -27], [471, -14], [479, -14], [479, -6], [476, -6], [476, -2], [438, -2], [438, -5], [434, -5], [434, -2], [425, -2], [425, -6], [382, -5], [382, -2], [371, -2], [371, -6], [337, -5], [337, 1], [330, 1], [330, 11], [316, 11], [316, 16], [322, 19], [384, 20], [397, 42], [400, 41], [400, 32], [441, 32], [442, 41], [478, 41], [478, 32], [487, 32], [487, 40], [505, 40], [505, 31], [534, 31], [534, 40], [549, 40], [549, 27], [568, 27], [568, 32], [570, 32], [570, 26], [648, 25], [648, 56], [400, 56], [400, 48], [394, 48], [380, 26], [320, 26], [309, 15], [309, 11], [267, 11], [267, 14], [223, 14], [223, 32], [218, 33], [205, 33], [205, 11], [152, 11], [152, 31], [140, 31], [140, 10], [105, 10], [106, 22], [86, 22], [57, 50], [43, 51], [15, 22], [-11, 22], [-11, 35], [-24, 35], [-24, 13], [-76, 14], [-76, 32], [-92, 33], [-93, 14], [-123, 14], [-123, 17], [-169, 18], [-169, 15], [-228, 15]]
// OSM aeroway=jet_bridge lines near A (77), in the frame
const A_JB: XY[][] = [[[-564.3, -20.3], [-564.3, -21.8], [-574.5, -21.5], [-574.2, -23.7], [-562.5, -37.9]], [[-528.1, -20.4], [-527.8, -23.4], [-517.5, -43.5]], [[-503.5, -20.5], [-503.4, -24.2], [-477.2, -39.1]], [[-438.0, -20.8], [-438.0, -25.0], [-427.1, -43.0], [-423.8, -42.8]], [[-399.2, -20.9], [-399.3, -25.3], [-390.0, -35.4], [-384.4, -42.1]], [[-350.2, -21.1], [-350.4, -25.9], [-340.5, -40.0]], [[-551.7, 41.4], [-556.6, 69.7]], [[-514.7, 37.4], [-525.4, 48.1]], [[-510.0, 44.4], [-512.2, 59.7], [-513.0, 74.4]], [[-468.7, 47.0], [-471.1, 74.5]], [[-420.6, 34.8], [-423.1, 36.5], [-436.0, 45.1]], [[-416.0, 42.7], [-417.8, 50.7], [-419.2, 55.7], [-422.6, 68.0]], [[-371.9, 34.3], [-379.1, 55.4]], [[-351.1, 53.8], [-349.7, 51.3], [-342.3, 37.1]], [[-337.4, 64.3], [-334.4, 60.8], [-332.0, 44.1], [-332.2, 37.3], [-337.7, 37.2]], [[-337.7, 37.2], [-337.9, 18.3]], [[-342.3, 37.1], [-342.3, 19.9]], [[-342.3, 19.9], [-342.3, 18.3]], [[-372.0, 20.0], [-372.0, 22.6], [-371.9, 34.3]], [[-372.0, 16.2], [-372.0, 20.0]], [[-415.8, 22.7], [-416.0, 42.7]], [[-415.9, 16.6], [-415.8, 22.7]], [[-420.4, 21.0], [-420.6, 34.8]], [[-420.5, 16.5], [-420.4, 21.0]], [[-450.9, 26.9], [-468.7, 47.0]], [[-449.6, 19.9], [-449.7, 25.2], [-450.9, 26.9]], [[-510.4, 23.4], [-510.0, 44.4]], [[-510.5, 18.4], [-510.4, 23.4]], [[-514.9, 22.6], [-514.7, 37.4]], [[-515.3, 18.4], [-514.9, 22.6]], [[-551.9, 23.8], [-551.7, 41.4]], [[-551.9, 20.3], [-551.9, 23.8]], [[-285.5, -21.3], [-286.2, -25.2], [-296.2, -24.7], [-291.7, -39.4]], [[-249.5, -21.4], [-243.4, -41.6]], [[-176.8, -21.7], [-163.3, -44.7], [-152.8, -45.8]], [[-203.5, -21.6], [-203.7, -25.5], [-201.8, -41.9], [-194.5, -42.9]], [[-118.8, -22.4], [-119.1, -35.7], [-107.6, -46.2]], [[-92.2, -22.6], [-75.3, -44.4]], [[-52.5, -22.7], [-52.0, -24.8], [-33.9, -48.1]], [[-176.1, 37.8], [-186.3, 56.5]], [[-234.0, 35.7], [-237.4, 61.4], [-239.0, 62.7]], [[-90.9, 32.5], [-90.9, 35.1], [-96.7, 35.4], [-127.7, 42.0]], [[-79.1, 32.5], [-79.1, 38.4], [-80.7, 41.8], [-90.9, 54.1], [-94.7, 55.1], [-102.8, 57.6]], [[-24.5, 30.5], [-26.2, 34.5], [-37.2, 44.7], [-40.3, 45.2]], [[-10.6, 34.5], [-10.6, 41.5], [6.2, 56.7]], [[-264.5, 59.3], [-255.8, 41.2], [-255.8, 33.3], [-267.7, 33.3], [-267.8, 30.1]], [[-44.3, 32.1], [-40.9, 31.4], [-26.8, 28.8], [-24.5, 30.5]], [[-234.7, 22.0], [-234.0, 35.7]], [[-236.9, 16.3], [-234.7, 22.0]], [[-267.8, 22.5], [-268.0, 15.9]], [[-267.8, 30.1], [-267.8, 22.5]], [[-180.6, 21.0], [-176.1, 37.8]], [[-195.8, 14.9], [-193.5, 20.5], [-180.6, 21.0]], [[-273.4, -3.0], [-273.2, 16.1], [-272.6, 22.5]], [[-272.6, 22.5], [-271.4, 35.7]], [[-271.4, 35.7], [-285.0, 51.5]], [[-193.6, 23.6], [-193.4, 33.0], [-184.2, 32.8], [-184.4, 35.5]], [[-184.4, 35.5], [-198.0, 42.4]], [[-193.5, 20.5], [-193.6, 23.6]], [[149.6, 30.9], [149.6, 37.5], [140.7, 54.4]], [[218.3, 32.7], [217.7, 55.4]], [[205.0, 29.4], [202.8, 33.2], [191.6, 40.1], [180.1, 47.7]], [[139.6, 25.8], [134.4, 27.4], [121.2, 34.9], [118.3, 36.1]], [[291.3, 27.7], [282.6, 40.7], [275.6, 51.4]], [[308.2, 10.7], [308.2, 15.6], [319.1, 28.1], [317.9, 46.5]], [[320.9, 10.6], [320.8, 15.4], [344.9, 27.5], [373.7, 27.3], [358.8, 56.6]], [[321.6, -26.8], [321.6, -29.2], [344.4, -30.0], [360.0, -40.1]], [[300.4, -26.7], [321.4, -51.3]], [[273.0, -26.5], [273.1, -29.3], [280.8, -43.0]], [[214.8, -26.3], [215.0, -29.2], [232.5, -50.3]], [[176.8, -26.0], [191.1, -44.0], [196.3, -44.4]], [[139.4, -26.0], [139.6, -28.4], [143.3, -44.8], [146.0, -46.5]], [[107.9, -26.0], [110.0, -46.1], [114.4, -49.4], [117.5, -51.9]], [[139.6, 25.8], [135.9, 34.6], [122.2, 45.6], [119.8, 45.3]], [[205.0, 29.4], [201.6, 26.6], [185.9, 29.9]], [[291.2, 14.2], [291.3, 27.7]], [[291.2, 10.8], [291.2, 14.2]]]
// way/81468339 (headhouse) and way/81468355 (link), and the bridge (way/461365914, man_made=bridge)
const HEADHOUSE: XY[] = [[-13, -197], [-13, -234], [110, -232], [110, -197]]
const LINK: XY[] = [[38, -234], [38, -246], [59, -247], [59, -234]]
const BR_X0 = 39, BR_X1 = 55 // the bridge's width as mapped (16 m)

export async function buildA(detail: boolean) {
  const p = newParts()
  const outline = clean(A_RAW, 0.6)
  const HW = 13.5, SP = 16.8, POD = 18.4, CORE = 18.7

  // ── the wings: the whole outline at the wing height
  layer(p, outline, 0, HW, 'wing', { detail })
  // the clerestory spine, west and east of the core, and along the A east arm
  spine(p, -566, -30, -6.5, 6.5, HW, SP)
  spine(p, 110, 470, -6.5, 6.5, HW, SP)
  spine(p, 405, 640, 34, 47, HW, SP - 0.8)
  // pods (lidar): x -181..-112 and 210..279, with their lanterns; the west
  // expansion's pods at the same spacing as the old ones (estimated from OSM's bumps)
  pod(p, outline, -181, -112, -28, 22, HW, POD, { lantern: [-153, -136, -9, 2, 21.4] })
  pod(p, outline, 210, 279, -32, 18, HW, POD, { lantern: [234, 255, -13, -1, 21.1] })
  pod(p, outline, -350, -330, -22, 21, HW, POD)
  pod(p, outline, -455, -420, -22, 24, HW, POD)
  pod(p, outline, -545, -515, -21, 24, HW, POD)
  // the A east arm's end blocks
  pod(p, outline, 397, 420, 26, 56, HW - 0.5, 16.5, { towers: false })

  // ── the core: an octagon at 18.7 with the north arm, the south diamond to
  // the bridge landing, and the stepped glass roof (lidar)
  const core = clipRect(outline, -24, -60, 106, 51) // the south diamond below is its own, taller layer
  layer(p, core, HW, CORE, 'pod')
  ziggurat(p, CORE, [
    { r: chamferRect(20, -26, 80, 18, 8), z: 21.5 },
    { r: chamferRect(26, -21, 74, 13, 6), z: 24.0 },
    { r: chamferRect(32, -15, 68, 7, 4), z: 26.3 },
    { r: rect(42, -8, 58, 1), z: 27.0 },
  ], detail)
  // the north arm's raised skylight (22.3, x 41..58, y 39..53)
  layer(p, rect(41, 22, 58, 49), CORE, 22.3, 'tier')
  // the south diamond (24-25) and the bridge landing block (30.5)
  const south = clipRect(outline, 20, -87, 75, -26)
  layer(p, south, HW, 24.6, 'pod')
  layer(p, rect(34, -98, 64, -76), 0, 30.6, 'pod', { wall: p.wall })
  // the ramp control tower (42.7, x 39..58, y -67..-51): white shaft, glass cab, flat roof
  const T = rect(39.5, -67, 57.5, -51)
  box(p.wall, null, T, 24.6, 38.6, 0)
  walls(p.wall, T, 38.6, 39.0)
  const cab = inset(T, -0.3)
  walls(p.win, cab, 39.0, 41.8)
  slab(p.wall, inset(T, -1.1), 41.8, 42.8)

  // ── the A bridge over the taxiway: a glazed box on deep white trusses,
  // roof 25.2 at the concourse rising to 27.1 mid-span, 26 at the headhouse
  const yN = -98, yS = -197
  const roofAt = (y: number) => 25.2 + 1.9 * Math.sin(Math.PI * Math.min(1, Math.max(0, (yN - y) / (yN - yS))))
  const NSEG = 6
  for (let i = 0; i < NSEG; i++) {
    const ya = yN + ((yS - yN) * i) / NSEG, yb = yN + ((yS - yN) * (i + 1)) / NSEG
    const za = roofAt(ya), zb = roofAt(yb), d = 7.2
    // deck box: bottom chord, glass band, top chord, roof
    for (const [x, s] of [[BR_X0, -1], [BR_X1, 1]] as [number, number][]) {
      const q = (y: number, z: number): V3 => [x, y, z]
      const quad = (a: V3, b: V3, c: V3, e: V3, part: Part) => (s < 0 ? part.quad(a, b, c, e) : part.quad(b, a, e, c))
      quad(q(ya, za - d), q(yb, zb - d), q(yb, zb - d + 2.2), q(ya, za - d + 2.2), p.wall)
      quad(q(ya, za - d + 2.2), q(yb, zb - d + 2.2), q(yb, zb - 1.2), q(ya, za - 1.2), p.win)
      quad(q(ya, za - 1.2), q(yb, zb - 1.2), q(yb, zb), q(ya, za), p.wall)
    }
    p.roof.quad([BR_X0, ya, za], [BR_X0, yb, zb], [BR_X1, yb, zb], [BR_X1, ya, za])
    p.wall.quad([BR_X0, ya, za - d], [BR_X1, ya, za - d], [BR_X1, yb, zb - d], [BR_X0, yb, zb - d])
    // diagonal truss members on each face (white), one X per segment in the detail model
    if (detail) {
      for (const x of [BR_X0 - 0.15, BR_X1 + 0.15]) {
        const s = x < 47 ? -1 : 1
        const w = 0.5
        const P = (y: number, z: number): V3 => [x, y, z]
        const bar = (y0: number, z0: number, y1: number, z1: number) => {
          const a = P(y0, z0), b = P(y1, z1), c = P(y1, z1 + w), e = P(y0, z0 + w)
          if (s < 0) p.wall.quad(a, b, c, e)
          else p.wall.quad(b, a, e, c)
        }
        bar(ya, za - d + 2.2, yb, zb - 1.2 - w)
        bar(ya, za - 1.2 - w, yb, zb - d + 2.2)
      }
    }
  }

  // ── the south headhouse (lidar): the tall block, the bridge head, the east halls
  layer(p, HEADHOUSE, 0, 15.4, 'wing')
  layer(p, rect(-13, -234, 28, -197), 15.4, 39.5, 'pod')
  layer(p, rect(-5, -226, 20, -205), 39.5, 42.0, 'tier', { bevel: 0.2 })
  layer(p, rect(31, -234, 62, -190), 15.4, 25.0, 'pod')
  layer(p, rect(62, -232, 74, -199), 15.4, 20.0, 'plain')
  layer(p, LINK, 0, 14.0, 'plain')

  // rooftop plant along the wings
  plant(p, -540, -200, 9.5, HW, 11, detail)
  plant(p, 120, 300, -10, HW, 12, detail)

  // jet bridges (OSM)
  const lines = A_JB
  denJetBridges(p, lines, detail)
  return { p, gates: lines.length }
}

if (import.meta.main) {
  const name = 'Denver International Airport, Concourse A'
  const low = await buildA(false)
  await writeModel('den-airport-concourse-a.glb', name, materials(low.p), { height: 42.8, maxTris: 8000, maxBytes: 250_000 })
  const hi = await buildA(true)
  await writeModel('den-airport-concourse-a.detail.glb', name, materials(hi.p), { height: 42.8, maxTris: 40_000, maxBytes: 1_500_000 })
  console.log(`${low.gates} jet bridges`)
}
