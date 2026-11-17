/**
 * 15 July Martyrs Bridge (Bosphorus Bridge, Boğaziçi Köprüsü; 1973; Freeman
 * Fox & Partners, Gilbert Roberts and William Brown) — procedural, CC0-1.0.
 * bun generators/istanbul-bosphorus-bridge.ts
 *
 * The whole suspension bridge as one placement, across its OSM outline from
 * Ortaköy (Europe) to Beylerbeyi (Asia): the two steel towers on the shore,
 * the main cables and their free back stays down to the anchorages, the
 * aerodynamic box deck of the main span and the side-span decks on their
 * column piers. Writes a low model (towers, cables, the deck as a solid
 * box, piers, anchorages, cable lights) and a detail model (the same with
 * the suspenders as real members, finer cables and the edge railings),
 * which a map draws from detailZoom 16 up.
 *
 * Frame: x across the bridge, y along it toward Europe (Ortaköy), z up,
 * metres; origin midway between the towers, on the water. Placed at bearing
 * 321.7°, the outline's long edges (the towers' line agrees within 0.1°),
 * anchored at 29.0342407, 41.0456261, 21.9 m north-west of the outline's
 * centroid. The map owns the roadway: nothing here is a surface at road
 * level. The box's top is drawn 0.35 m under the roadway (as masonry under
 * a roadway may be), so the deck reads solid where the map's lanes don't
 * reach its edges.
 *
 * Height. z = 0 is the water (Mapterhorn reads the Bosphorus as 0 here).
 * - Roadway, built to the OSM outline's `height` (65 m) at midspan, the
 *   map's own midspan deck: a crest curve to 58.5 m at the towers (photo
 *   jose1, a level side view: the deck meets the Asian tower 58 ± 1.5 m
 *   above the water, scaled on the 165 m tower), then falling on at the
 *   same 2.4 % grade through the side spans to 53.3 m at the Europe end
 *   and 52.3 m at the Asia end (estimated: no photo shows the grade; the
 *   ground there is 45–50 m). The published 64 m navigation clearance is
 *   the box's underside, 3 m under the roadway.
 * - Ground (Mapterhorn z12, about 14 m a pixel; no z13–z15 tiles here):
 *   sampled on 10 m grids in this frame at both ends (ASIA_GROUND,
 *   EUROPE_GROUND), 0 over the water. The tower plinths, side-span columns
 *   and anchorages stand on it vertex by vertex (docs/reference.md,
 *   Bridges). Both towers stand at the shore, the z12 ground under them
 *   2–9 m. z12 smooths the steep hills, so the side-span columns and
 *   anchorages are ±3 m. `bun tools/terrain.ts check` cannot run here (no
 *   z15 tiles). Nothing stands in the water, so the lowest point is a tower
 *   plinth's foot, about 1.5 m above it.
 *
 * Sources:
 * - OSM: the outline way/403255158 (man_made=bridge, bridge:structure=
 *   suspension, height 65 m, min_height 64 m, wikidata Q4484), 32 m wide,
 *   from y = −794.3 (Asia) to +755.0 (Europe). The tower legs as
 *   building:part columns, Europe way/403255153 and way/403255154, Asia
 *   way/403142701 and way/403142702 (6.6 m across by 6.2 m along, centres
 *   35.9 m apart, tagged 165 m); the beams way/403255157 (152–155 m,
 *   Europe) and way/403142703 (building=yes, 50–60 m, Asia). Tower centres
 *   1,076.9 m apart (published span 1,074 m).
 * - Wikidata Q4484 (Bosphorus Bridge; coordinates 41.0456, 29.0340,
 *   checked against OSM).
 * - Published (Wikipedia en "Bosphorus Bridge" and tr "15 Temmuz Şehitler
 *   Köprüsü"): total 1,560 m, main span 1,074 m, side spans 231 m (Europe)
 *   and 255 m (Asia), towers 165 m above the sea, each two box legs joined
 *   by three box beams, the deck resting at the towers on the lowest; deck
 *   33.4 m wide, a 28 m by 3 m welded box of 60 units with 2.7 m
 *   cantilevered footways each side; clearance 64 m; colour-changing LED
 *   lighting since 2007, 2,000 modules on the hangers.
 * - Suspenders. The bridge opened with inclined (Severn-type) hangers; tr
 *   Wikipedia records that they were later replaced with vertical ones,
 *   and every photo of 2022–2026 here (jose1, jose4, aykhan01) shows
 *   vertical paired ropes. Drawn vertical, one member per pair, every
 *   18 m (60 deck units over 1,074 m; jose1 agrees, 17 ± 1 m).
 * - Photos (Wikimedia Commons, evidence):
 *   - jose1: "Bosphorus Bridge 1.jpg" (Joseolgon, CC BY 4.0): level side
 *     view of the Asian tower from the water; the tower's beams (top
 *     159–164 m, middle 105 m, 7 m deep), the deck at the tower, the
 *     vertical paired suspenders, the side span on column piers.
 *   - jose4: "Bosphorus Bridge 4.jpg" (Joseolgon, CC BY 4.0): from under
 *     the deck at the Asian tower; the tapering legs with chamfered edges,
 *     the beams set back from the leg faces, the box's sloped soffit and
 *     cantilevers, the light grey paint.
 *   - jose2, jose6, jose7: "Bosphorus Bridge 2/6/7.jpg" (Joseolgon, CC BY
 *     4.0): the whole bridge from the water, both towers.
 *   - akbas2: "The first Bosphorus Bridge (1973) in Istanbul.jpg"
 *     (Huseyinakbas63, CC BY-SA 4.0): from the Asian hills at dusk, along
 *     the bridge; the portal frames and the lit towers.
 *   - night: "Bosphorus-Bridge-night-view-Istanbul.jpg"
 *     (SeablueTravelOfficial, CC BY-SA 4.0): the lit suspenders and towers.
 * - Estimated from photos: the legs' taper (6.6 m across, OSM, to 4.6 m
 *   at the top; 7.4 m along at the foot to 5.4 m, a little over OSM's
 *   6.2 m, as jose1 scales the legs about 8 m along), the beams (top 157.5–163.5 m, middle
 *   101.5–108.5 m, the deck's seat 51.8–55.3 m, 5 m along), the saddle
 *   hoods, the box's section (sloped soffit from 11.2 m out, 3.2 m deep),
 *   the concrete plinths, the side-span columns (pairs, about every 45 m),
 *   the anchorages (no photo shows them: plain blocks under the road at
 *   the outline's ends, where the published side spans end). The cables
 *   (0.6 m real) are drawn 1.2 m thick, the suspenders 0.4 m.
 * - Colour: the towers and deck a light grey (#a3a9aa in shade in jose4,
 *   near white in sun), pulled to #d9dddc; the soffit a shade darker;
 *   cables mid grey.
 *
 * Night: the towers are floodlit (they change colour; the map lights them
 * warm white), and the suspenders carry LED strips, so in the detail model
 * they are `neon` in their own pale grey, and in the low model, which has
 * no suspenders, `lamp` beads hang at the top of every second suspender
 * along the main cables. The side spans and anchorages stay dark.
 *
 * Doubts: the anchorages and back-stay ends (no photo); the side-span
 * roadway grade; the side-span columns' number; the hanger history (the
 * lead's brief said inclined; the recent photos show vertical).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { along, band, bead, chamferedRect, face, footedLoft, groundAt, merged, rod, stations, tube, type GroundGrid } from './bridge-kit'
import { box, one } from './sf-golden-gate-bridge'
import { finish, type Swatch } from './palette'

// ---- Shared by the Istanbul suspension bridges ------------------------------

/** Half a deck section, (x, z under the roadway), from the outer top edge round to the bottom centre. */
export type Section = [number, number][]

/**
 * A box deck swept along y through `ys`, both halves of `section`, its
 * faces split between `side` (fascias, facing out) and `under` (facing
 * down). `top` (if given) gets the box's top `topDrop` under the roadway;
 * `caps` closes the ends.
 */
export function deck(side: Part, under: Part, top: Part | null, ys: number[], road: (y: number) => number,
  section: Section, { topDrop = 0.35, caps = [true, true] } = {}) {
  const cz = (section[0][1] + section[section.length - 1][1]) / 2
  for (let k = 0; k + 1 < section.length; k++) {
    const [xa, za] = section[k], [xb, zb] = section[k + 1]
    let n: V3 = [zb - za, 0, -(xb - xa)]
    const l = Math.hypot(n[0], n[2]) || 1
    n = [n[0] / l, 0, n[2] / l]
    if (n[0] * ((xa + xb) / 2) + n[2] * ((za + zb) / 2 - cz) < 0) n = [-n[0], 0, -n[2]]
    for (const s of [-1, 1]) {
      const ns: V3 = [n[0] * s, 0, n[2]]
      const part = n[2] < -0.3 ? under : side
      for (let i = 0; i + 1 < ys.length; i++) {
        const y0 = ys[i], y1 = ys[i + 1], r0 = road(y0), r1 = road(y1)
        face(part, [s * xa, y0, r0 + za], [s * xb, y0, r0 + zb], [s * xb, y1, r1 + zb], [s * xa, y1, r1 + za], ns)
      }
    }
  }
  const w = section[0][0]
  if (top) band(top, -w, w, ys, (y) => road(y) - topDrop, (y) => road(y) - topDrop, { top: true })
  // The ends: the whole section, fanned from its middle.
  const ring: [number, number][] = [...section, ...[...section].reverse().map(([x, z]) => [-x, z] as [number, number])]
  ys.forEach((y, i) => {
    if ((i === 0 && !caps[0]) || (i === ys.length - 1 && !caps[1]) || (i > 0 && i < ys.length - 1)) return
    const r = road(y), sgn = i === 0 ? -1 : 1, c: V3 = [0, y, r + cz]
    for (let k = 0; k < ring.length; k++) {
      const a = ring[k], b = ring[(k + 1) % ring.length]
      if (a[0] === b[0] && a[1] === b[1]) continue
      const A: V3 = [a[0], y, r + a[1]], B: V3 = [b[0], y, r + b[1]]
      // face() needs a quad; a degenerate one draws one triangle twice, so wind by hand.
      const e1 = [A[0] - c[0], A[2] - c[2]], e2 = [B[0] - c[0], B[2] - c[2]]
      const ny = -(e1[0] * e2[1] - e1[1] * e2[0]) // y of (A-c)x(B-c)
      if (Math.sign(ny) === sgn) side.tri(c, A, B)
      else side.tri(c, B, A)
    }
  })
}

export type TowerSpec = {
  y: number              // the tower's centre along the bridge
  legX: number           // each leg's centre, |x|
  z0: number             // the steel legs' foot (on the plinth)
  z1: number             // the legs' top
  w: [number, number]    // leg width across, foot and top
  d: [number, number]    // leg depth along, foot and top
  r: number              // the legs' chamfer
  beams: [number, number, number][] // [z0, z1, depth along]
  hood: number           // top of the saddle hoods
  cableX: number         // the cable's x on the hood
  plinth?: { top: number; pad: number } // a concrete pedestal from the ground up to the legs' foot
}

/** One tower: tapering legs, box beams, saddle hoods, into steel (and concrete for plinths). */
export function tower(steel: Part, concrete: Part, ground: (x: number, y: number) => number, t: TowerSpec) {
  const half = (z: number, [a, b]: [number, number]) => (a + (b - a) * (z - t.z0) / (t.z1 - t.z0)) / 2
  for (const s of [-1, 1]) {
    const x = s * t.legX
    const plan = (z: number) => {
      const hw = half(z, t.w), hd = half(z, t.d)
      return chamferedRect(x - hw, x + hw, t.y - hd, t.y + hd, t.r)
    }
    footedLoft(steel, ground, [{ plan: plan(t.z0), z: t.z0 }, { plan: plan(t.z1), z: t.z1 }], 50)
    if (t.plinth) {
      const hw = half(t.z0, t.w) + t.plinth.pad, hd = half(t.z0, t.d) + t.plinth.pad
      const p = chamferedRect(x - hw, x + hw, t.y - hd, t.y + hd, 0.6)
      footedLoft(concrete, ground, [{ plan: p, z: 'ground' }, { plan: p, z: t.plinth.top }], 2.5)
    }
    // The saddle hood, over the cable, a little proud of the leg top.
    const hw = half(t.z1, t.w), hd = half(t.z1, t.d)
    const cx = s * t.cableX
    box(one(steel), Math.min(x - hw, cx - 1.2) + 0.2, Math.max(x + hw, cx + 1.2) - 0.2, t.y - hd * 1.15, t.y + hd * 1.15, t.z1 - 0.01, t.hood, { r: 0.4, top: 0.7, bottom: false })
  }
  for (const [z0, z1, d] of t.beams) {
    const zi = (z0 + z1) / 2, xi = t.legX - half(zi, t.w) + 0.4
    box(one(steel), -xi, xi, t.y - d / 2, t.y + d / 2, z0, z1, { r: 0.3, top: 0.25 })
  }
}

/** Floodlighting on the towers: brightest just above the deck, fading upward; faces looking up catch little. */
export function towerLight(towers: number[], halfDepth: number, deckZ: number, topZ: number) {
  return (p: V3, n: V3): number => {
    if (!towers.some((ty) => Math.abs(p[1] - ty) < halfDepth)) return 0
    const h = p[2] >= deckZ ? 1 - 0.35 * Math.min(1, (p[2] - deckZ) / (topZ - deckZ)) : 0.55
    return h * (n[2] > 0.7 ? 0.3 : 1)
  }
}

/** A footed column from the ground up to z, square with chamfers. */
export function column(p: Part, ground: (x: number, y: number) => number, x: number, y: number, w: number, z: number) {
  const pl = chamferedRect(x - w / 2, x + w / 2, y - w / 2, y + w / 2, w * 0.2)
  footedLoft(p, ground, [{ plan: pl, z: 'ground' }, { plan: pl, z }], 50)
}

// ---- The Bosphorus Bridge -----------------------------------------------------

const TY = 538.45                 // towers at y = ±TY (OSM legs)
const END_EU = 755.0, END_AS = -794.3   // the outline's ends
const ANCH_EU = TY + 231, ANCH_AS = -(TY + 255) // the cables' anchorages (published side spans)
const ROAD_MID = 65, ROAD_TOWER = 58.5
const GRADE = 2 * (ROAD_MID - ROAD_TOWER) / TY
const road = (y: number) => {
  const a = Math.abs(y)
  return a <= TY ? ROAD_MID - (ROAD_MID - ROAD_TOWER) * (y / TY) ** 2 : ROAD_TOWER - GRADE * (a - TY)
}
const CX = 16.6                   // cable and suspender plane
const SADDLE = 164.5, LOW = road(0) + 2.5
const mainCable = (y: number) => LOW + (SADDLE - LOW) * (y / TY) ** 2
/** A back stay from the saddle to its anchorage, sagging a little. */
const backStay = (y: number) => {
  const end = y > 0 ? ANCH_EU : ANCH_AS, zEnd = road(end) - 0.6
  const t = (Math.abs(y) - TY) / (Math.abs(end) - TY)
  return SADDLE + (zEnd - SADDLE) * t - 6 * t * (1 - t)
}
const cable = (y: number) => (Math.abs(y) <= TY ? mainCable(y) : backStay(y))
const CABLE_R = 0.6

const SECTION: Section = [[16.7, -0.35], [16.7, -1.0], [14.2, -1.2], [11.2, -3.2], [0, -3.2]]
const DECK_BOTTOM = 3.2
const LEG: Omit<TowerSpec, 'y' | 'plinth'> = {
  legX: 17.9, z0: 0, z1: 163.5, w: [6.6, 4.6], d: [7.4, 5.4], r: 0.7,
  beams: [[157.5, 163.5, 5.0], [101.5, 108.5, 5.0], [ROAD_TOWER - DECK_BOTTOM - 3.5, ROAD_TOWER - DECK_BOTTOM, 5.2]],
  hood: 166, cableX: CX,
}

// Mapterhorn z12 heights (the water reads 0), 10 m apart in this frame:
// rows along y from y0, columns across from x = -40.
const ASIA_GROUND: GroundGrid = { y0: -820, x0: -40, step: 10, z: [
  [43.7, 44.5, 45.6, 46.9, 47.7, 48.4, 48.6, 48.2, 46.5],
  [41.2, 42.1, 43.4, 44.3, 45.5, 46.2, 46.8, 46.6, 45.4],
  [38.3, 39.3, 40.4, 41.4, 42.8, 43.9, 44.6, 44.5, 43.6],
  [35.6, 36.7, 37.8, 39.1, 40.3, 41.4, 42.2, 42.4, 41.6],
  [33.2, 34.3, 35.8, 37.1, 38.4, 39.4, 40.0, 40.0, 39.5],
  [31.3, 32.7, 34.3, 35.9, 37.1, 38.0, 38.6, 38.4, 37.9],
  [29.9, 31.3, 33.2, 34.9, 36.2, 37.2, 37.4, 37.0, 36.5],
  [28.7, 30.1, 31.8, 33.7, 35.1, 36.2, 36.3, 35.9, 35.3],
  [27.7, 28.9, 30.3, 32.1, 33.8, 34.9, 35.5, 35.1, 34.4],
  [26.8, 27.5, 29.0, 30.3, 31.9, 33.3, 34.2, 34.3, 33.6],
  [26.0, 26.8, 27.7, 28.8, 29.9, 31.5, 32.7, 33.2, 33.0],
  [24.9, 26.2, 26.8, 27.5, 28.5, 29.9, 31.5, 32.4, 32.5],
  [23.8, 25.0, 25.9, 26.5, 27.3, 28.6, 30.2, 31.9, 32.1],
  [22.5, 24.0, 24.8, 25.5, 26.3, 27.6, 29.3, 31.0, 32.0],
  [20.9, 22.6, 23.7, 24.8, 25.7, 27.0, 29.0, 30.7, 31.4],
  [19.5, 21.2, 22.8, 24.0, 25.3, 26.8, 28.6, 30.1, 30.8],
  [18.0, 20.2, 21.8, 23.4, 24.7, 26.1, 27.9, 29.0, 29.5],
  [16.4, 18.6, 20.7, 22.2, 23.4, 25.0, 26.0, 27.1, 27.3],
  [14.7, 16.9, 18.9, 20.4, 21.5, 22.3, 23.4, 24.0, 24.7],
  [13.0, 14.8, 16.6, 18.0, 18.6, 19.2, 19.8, 20.5, 21.1],
  [11.0, 12.6, 13.9, 14.8, 15.4, 15.7, 16.2, 17.0, 17.5],
  [9.3, 10.1, 11.0, 11.8, 12.1, 12.2, 13.2, 13.7, 14.4],
  [7.5, 8.0, 8.3, 8.9, 9.5, 10.0, 10.7, 11.5, 11.9],
  [6.3, 5.9, 6.1, 6.7, 7.5, 8.2, 9.1, 9.9, 10.6],
  [5.0, 4.7, 4.6, 5.3, 6.1, 7.0, 8.1, 9.1, 9.8],
  [4.2, 4.2, 4.0, 4.3, 5.1, 6.2, 7.5, 8.5, 9.1],
  [3.7, 3.8, 3.8, 3.9, 4.5, 5.6, 6.8, 7.9, 8.5],
  [3.1, 3.3, 3.3, 3.5, 3.9, 4.8, 5.9, 6.9, 8.0],
  [2.3, 2.6, 2.6, 2.8, 3.1, 4.0, 4.8, 5.7, 6.7],
  [1.7, 1.8, 1.7, 1.8, 2.0, 2.8, 3.7, 4.3, 5.1],
  [1.2, 1.1, 1.0, 0.9, 1.3, 1.7, 2.2, 2.6, 3.3],
  [0.8, 0.6, 0.4, 0.4, 0.5, 0.7, 0.8, 1.3, 1.6],
  [0.3, 0.3, 0.1, 0.1, 0.1, 0.1, 0.2, 0.3, 0.7],
] }
const EUROPE_GROUND: GroundGrid = { y0: 500, x0: -40, step: 10, z: [
  [0.6, 0.4, 0.3, 0.3, 0.2, 0.2, 0.1, 0.2, 0.4],
  [1.4, 1.2, 0.8, 0.8, 0.7, 0.7, 0.6, 0.5, 0.9],
  [2.7, 2.5, 1.6, 1.3, 1.2, 1.1, 1.1, 1.2, 1.5],
  [3.8, 3.3, 2.5, 2.0, 1.9, 1.7, 1.6, 1.6, 2.0],
  [4.4, 4.0, 3.3, 3.0, 2.9, 2.5, 2.3, 2.4, 2.6],
  [4.7, 4.2, 3.8, 3.7, 3.6, 3.8, 3.6, 3.7, 4.0],
  [4.7, 4.4, 4.3, 4.2, 4.6, 5.0, 5.4, 5.4, 5.8],
  [5.3, 5.1, 5.1, 5.5, 5.8, 6.7, 7.4, 8.0, 8.6],
  [6.6, 6.7, 6.9, 7.2, 8.1, 9.0, 10.2, 11.3, 11.8],
  [8.9, 9.2, 9.5, 10.0, 10.7, 12.0, 13.3, 14.4, 15.1],
  [12.0, 12.6, 13.0, 13.4, 14.4, 15.3, 16.7, 17.9, 18.2],
  [16.0, 16.6, 17.0, 17.7, 18.3, 19.3, 20.4, 21.1, 21.5],
  [20.3, 20.8, 21.3, 21.7, 22.2, 22.8, 23.6, 24.5, 24.7],
  [24.2, 24.8, 25.1, 25.4, 25.6, 25.9, 26.6, 27.5, 28.0],
  [27.5, 28.3, 28.7, 28.5, 28.4, 28.7, 29.4, 30.3, 30.5],
  [30.0, 31.0, 31.3, 31.0, 30.9, 31.1, 31.8, 32.8, 33.0],
  [31.5, 32.5, 33.2, 33.4, 33.1, 33.5, 34.2, 35.0, 35.5],
  [32.1, 33.6, 34.8, 35.6, 35.9, 36.1, 36.8, 37.4, 37.7],
  [32.5, 34.3, 36.1, 37.4, 38.4, 38.9, 39.3, 39.7, 39.9],
  [32.5, 34.8, 36.9, 39.3, 40.5, 41.6, 41.7, 41.7, 42.0],
  [32.6, 35.1, 37.6, 40.2, 42.6, 43.5, 44.3, 44.0, 44.0],
  [32.7, 35.5, 38.2, 40.9, 43.4, 45.1, 46.0, 46.1, 46.2],
  [32.8, 35.7, 38.8, 41.7, 44.3, 46.2, 47.3, 47.9, 48.2],
  [32.7, 35.8, 39.0, 42.1, 45.0, 47.1, 48.3, 49.0, 49.8],
  [32.8, 36.0, 39.2, 42.4, 45.3, 47.7, 48.9, 49.8, 50.7],
  [32.9, 36.1, 39.3, 42.7, 45.7, 48.0, 49.5, 50.4, 51.6],
  [33.0, 36.3, 39.9, 43.5, 46.3, 48.8, 50.1, 51.3, 52.4],
  [33.3, 36.9, 40.6, 43.7, 46.8, 49.2, 50.8, 52.0, 53.1],
  [34.1, 37.5, 40.8, 43.9, 46.9, 49.5, 51.0, 52.4, 53.6],
  [34.5, 37.9, 41.2, 44.1, 47.1, 49.4, 51.2, 52.7, 54.1],
  [35.0, 38.1, 41.1, 44.1, 46.6, 49.0, 51.1, 52.6, 54.3],
] }
const ground = (x: number, y: number) =>
  y <= -500 ? groundAt(ASIA_GROUND, x, y) : y >= 500 ? groundAt(EUROPE_GROUND, x, y) : 0

if (import.meta.main) {
  const make = (detail: boolean) => {
    const steel = new Part(), shade = new Part(), cables = new Part(), concrete = new Part(), lamps = new Part(), hangers = new Part()
    // Towers, each on concrete plinths standing on the shore.
    for (const y of [-TY, TY]) {
      let g = 0
      for (const s of [-1, 1]) for (const dx of [-4, 0, 4]) for (const dy of [-4, 0, 4]) g = Math.max(g, ground(s * LEG.legX + dx, y + dy))
      const z0 = Math.max(6, g + 1.5)
      tower(steel, concrete, ground, { ...LEG, y, z0, plinth: { top: z0, pad: 1.2 } })
      // The deck's passage through the tower, between the legs.
      const xi = LEG.legX - LEG.w[0] / 2 + 0.3
      box(one(shade), -xi, xi, y - LEG.d[0] / 2, y + LEG.d[0] / 2, road(y) - DECK_BOTTOM, road(y) - 0.35, { r: 0, bottom: true })
    }
    // The deck: the main span and the two side spans, the box stopping at each tower's legs.
    const face0 = LEG.d[0] / 2 + 0.1
    const step = detail ? 12 : 30
    for (const [a, b] of [[END_AS, -TY - face0], [-TY + face0, TY - face0], [TY + face0, END_EU]] as [number, number][])
      deck(steel, shade, shade, stations(a, b, step), road, SECTION)
    // Side-span piers: pairs of columns under the box, about every 45 m, and at the outline's ends.
    for (const [a, b] of [[TY + face0, END_EU], [END_AS, -TY - face0]] as [number, number][]) {
      const n = Math.round(Math.abs(b - a) / 45)
      for (let i = 1; i <= n; i++) {
        const y = a + ((b - a) * i) / n - (i === n ? Math.sign(b - a) * 3 : 0)
        const top = road(y) - DECK_BOTTOM + 0.05
        if (top - ground(0, y) < 1) continue
        for (const s of [-1, 1]) column(concrete, ground, s * 7.5, y, 2.6, top)
        box(one(concrete), -9.5, 9.5, y - 1.6, y + 1.6, top - 1.6, top, { r: 0.2 })
      }
    }
    // Anchorages: blocks under the roadway where the back stays end.
    for (const ya of [ANCH_AS, ANCH_EU]) {
      const top = road(ya) - 0.4
      const pl = chamferedRect(-23, 23, ya - 11, ya + 11, 1.2)
      footedLoft(concrete, ground, [{ plan: pl, z: 'ground' }, { plan: pl, z: top }], 4)
    }
    // Main cables and back stays, anchorage to anchorage.
    const cstep = detail ? 10 : 40
    const path = (x: number): V3[] => [
      ...stations(ANCH_AS, -TY, cstep), ...stations(-TY, TY, cstep).slice(1), ...stations(TY, ANCH_EU, cstep).slice(1),
    ].map((y) => [x, y, cable(y)] as V3)
    for (const s of [-1, 1]) tube(cables, path(s * CX), CABLE_R, detail ? 8 : 5)
    // Suspenders, vertical, one per pair, every 18 m.
    const hy: number[] = []
    for (let y = 9; y < TY - 8; y += 18) hy.push(y, -y)
    if (detail) {
      for (const y of hy) for (const s of [-1, 1]) {
        const z0 = road(y) - 0.4, z1 = cable(y) - CABLE_R * 0.7
        if (z1 - z0 > 0.6) rod(hangers, [s * CX, y, z0], [s * CX, y, z1], 0.2, 4)
      }
      // Railings on the footway edges: a top rail on posts.
      for (const [a, b] of [[END_AS, -TY - face0], [-TY + face0, TY - face0], [TY + face0, END_EU]] as [number, number][]) {
        const ys = stations(a, b, 12)
        for (const s of [-1, 1]) {
          band(steel, s * 16.55, s * 16.7, ys, (y) => road(y) + 1.15, (y) => road(y) + 1.0, { out: true, in: true, top: true, bottom: true })
          for (const y of stations(a, b, 6)) rod(steel, [s * 16.62, y, road(y) - 0.35], [s * 16.62, y, road(y) + 1.05], 0.06, 3)
        }
      }
    } else {
      // The LED-lit suspenders, as lights under the cable at every second one.
      for (const y of hy.filter((_, i) => i % 4 < 2)) for (const s of [-1, 1]) bead(lamps, [s * CX, y, cable(y) - 1.6], 0.9, true)
    }
    return { steel, shade, cables, concrete, lamps, hangers }
  }

  const lit = towerLight([-TY, TY], LEG.d[0] / 2 + 1, ROAD_TOWER, 166)
  const STEEL = { ...finish('bridge-grey', 0xd9dddc), floodlight: lit }
  const SHADE: Swatch = finish('bridge-grey-shade', 0xa9b1b6)
  const CABLE: Swatch = finish('cable-grey', 0x8c959a)
  const CONCRETE: Swatch = finish('concrete', 0xd9d3c7)
  const LAMP: Swatch = finish('lamp', 0xc9cdcf)
  const NEON: Swatch = finish('neon-hanger-white', 0xe4e7e8)

  const low = make(false), det = make(true)
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the towers, on the water',
    bearing: 321.7, elevation: 0, towers: [-TY, TY], ends: [END_AS, END_EU],
    roadwayMidspan: road(0), roadwayAtTowers: road(TY), roadwayEnds: [road(END_AS), road(END_EU)],
  }
  const lists = [
    ['istanbul-bosphorus-bridge.glb', [
      { part: low.steel, material: STEEL }, { part: low.shade, material: SHADE }, { part: low.cables, material: CABLE },
      { part: low.concrete, material: CONCRETE }, { part: low.lamps, material: LAMP },
    ], 6500, 250 * 1024],
    ['istanbul-bosphorus-bridge.detail.glb', [
      { part: det.steel, material: STEEL }, { part: det.shade, material: SHADE }, { part: det.cables, material: CABLE },
      { part: det.concrete, material: CONCRETE }, { part: det.hangers, material: NEON },
    ], 40000, 1536 * 1024],
  ] as const
  for (const [file, list, maxTris, maxBytes] of lists) {
    const used = list.filter((p) => p.part.triangles > 0)
    const tris = used.reduce((s, p) => s + p.part.triangles, 0)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('15 July Martyrs Bridge', [...used], extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
