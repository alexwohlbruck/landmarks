/**
 * Cabrillo Bridge, Balboa Park, San Diego. Thomas B. Hunter and Frank P.
 * Allen Jr., 1912–14, for the Panama-California Exposition: a white concrete
 * viaduct of seven tall round arches on hollow piers ("multiple-arched
 * cantilever", the first in California), carrying El Prado 37 m over
 * Cabrillo Canyon and State Route 163 to the West Gate of the California
 * Building. (Not "Cabrillo Canyon Bridge", the SR 163 bridge in Hillcrest.)
 *
 * Frame: bearing 359.47 (El Prado runs 0.53° north of east, so the model's
 * +x lies along the bridge). +x along the bridge eastward, +y across it to
 * the north, z up, metres; origin at the anchor -117.15450, 32.73142, on the
 * outline's long axis 0.4 m south of its centre line (y = 0.4). z = 0 is the
 * model's lowest foot, the pier at x ≈ −45 (Mapterhorn 43.47 m); the
 * canyon's lowest ground, beside SR 163 at x ≈ −40, lies under an arch,
 * where no foot stands, 0.9 m lower.
 *
 * Bridge rules (docs/reference.md, Bridges). No road surface: the map draws
 * El Prado (way/25758576, layer 1). Its roadway was built to the lidar's
 * deck: z 33.64 from the west end to x = 70, rising to 34.99 at the east end
 * (lidar 77.11 → 78.46 m), level with the ground at both ends, as Wikipedia
 * says. Under it a concrete slab stands 0.3 m below that line. The model
 * owns the sidewalks either side (surfaces included), the parapets, the
 * spandrel walls, arches, piers and abutments, and the lamp standards. Every
 * foot runs down to the map's own terrain, sampled every 5 m (`GROUND`,
 * Mapterhorn z15 as Parchment draws it) less 43.47 m, vertex by vertex.
 *
 * Replaces: the man_made=bridge outline way/122353744 (member "outline" of
 * the bridge relation relation/1672334, also listed). The model draws the
 * structure across the whole outline, approaches included.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): outline 260 × 14.4 m with bump-outs
 *   at x −96.4…−84.9 and 57.2…69.6 (the abutment towers); relation height 37.
 * - Wikipedia "Cabrillo Bridge": 916 ft (279 m) with approaches; main span
 *   450 ft (137 m), 120 ft (37 m) high; seven arches each 56 ft (17 m)
 *   across on fourteen hollow concrete pillars; 1914; seismic retrofit and
 *   new lighting 2014–15.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 1 m grid: deck top
 *   and its rise at the east end; canyon floor 2.3–4 m above ground_min.
 * - Mapterhorn terrain (tools/terrain.ts grid, step 5 m, bearing 359.47).
 * - USGS NAIP orthophoto: plan.
 * Photos (evidence, Wikimedia Commons):
 * - "Cabrillo Bridge-2.jpg", Visitor7, CC BY-SA 3.0 (arches and piers from
 *   the south-west): https://commons.wikimedia.org/wiki/File:Cabrillo_Bridge-2.jpg
 * - "Cabrillo Bridge.jpg", Visitor7, CC BY-SA 3.0 (east end and the tower):
 *   https://commons.wikimedia.org/wiki/File:Cabrillo_Bridge.jpg
 * - "Cabrillo Bridge-3.jpg", Visitor7, CC BY-SA 3.0 (from SR 163):
 *   https://commons.wikimedia.org/wiki/File:Cabrillo_Bridge-3.jpg
 * - "43-san-diego-balboa-park-highway-163.jpg", Alfred Twu, CC0 (aerial
 *   from the north-west: seven arches, solid approaches):
 *   https://commons.wikimedia.org/wiki/File:43-san-diego-balboa-park-highway-163.jpg
 * - "Balboa Park, San Diego, CA, USA - panoramio (38).jpg" and "(47)",
 *   Roman Eugeniusz, CC BY-SA 3.0 (the deck, parapets and lamp standards):
 *   https://commons.wikimedia.org/wiki/File:Balboa_Park,_San_Diego,_CA,_USA_-_panoramio_(38).jpg
 * - "El Prado looking west across the Cabrillo Bridge.jpg", Rhododendrites,
 *   CC BY-SA 4.0 (sidewalks and parapet): https://commons.wikimedia.org/wiki/File:El_Prado_looking_west_across_the_Cabrillo_Bridge.jpg
 *
 * Numbers
 * - Arcade from x −84.9 to 57.2 (between the abutment towers, OSM): seven
 *   17 m arches (published) and six 3.85 m piers (the remainder).
 * - Arch crowns 2.3 m under the roadway, just below the 0.8 m cornice band,
 *   semicircular (springing 8.5 m lower, about 23 m above the canyon floor,
 *   so the openings stand some 31 m tall on 17 m spans) — from Visitor7's
 *   Cabrillo Bridge-2, where the crowns sit right under a thin cornice, and
 *   the published 37 m height (estimated; round 2 raised them from 4 m).
 * - Transverse openings through the piers, 6 m wide, to 16 m above the
 *   canyon floor (the "pairs" of hollow pillars, seen as a slot through each
 *   pier in Cabrillo Bridge-2; estimated).
 * - Parapet 1.1 m, cornice band, sidewalks 2.3 m each side, lamp standards
 *   over each pier and abutment, 4.5 m tall — from the deck photos
 *   (estimated).
 *
 * Simplified / doubts
 * - The approaches are drawn as solid walls down to the terrain, as the
 *   aerial and Cabrillo Bridge.jpg show at the west and east ends; their
 *   inside is not known.
 * - The tall safety fence added on the parapets is left out (too thin).
 * - The abutment towers are drawn as plain pilasters 1 m proud on both
 *   faces; their real tops carry small balconies.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { cylinder } from './dc-white-house'
import { bead, groundAt, stations, type GroundGrid } from './bridge-kit'
import { orientTo, saveModel } from './sd-california-tower'

// The map's terrain (Mapterhorn z15), metres above 41.16 m, every 5 m:
// rows along y from y = −15, columns along x from x = −135.
const GROUND: GroundGrid = { y0: -15, x0: -135, step: 5, z: [
  [33.7, 33.6, 32.9, 32.0, 30.5, 28.7, 26.9, 25.0, 22.8, 20.7, 18.4, 16.0, 14.0, 11.8, 9.9, 8.3, 6.8, 5.7, 3.6, 3.0, 2.6, 2.6, 2.8, 2.9, 3.2, 3.6, 3.6, 3.6, 3.9, 4.4, 4.9, 6.0, 6.8, 8.7, 10.3, 13.2, 14.5, 16.4, 18.2, 19.7, 21.2, 22.7, 23.7, 24.6, 25.9, 27.3, 28.1, 29.0, 29.2, 29.0, 29.4, 30.3, 31.5, 32.8, 33.5],
  [34.8, 34.3, 33.4, 32.3, 31.1, 29.3, 27.6, 25.7, 23.3, 20.8, 18.4, 16.2, 14.1, 11.9, 10.4, 8.8, 6.9, 5.7, 3.6, 2.7, 2.5, 2.6, 2.9, 3.0, 3.3, 3.7, 3.6, 3.7, 4.0, 4.4, 4.9, 6.5, 7.1, 8.7, 10.1, 11.8, 14.1, 16.2, 18.5, 20.0, 21.4, 22.9, 24.1, 24.8, 26.0, 27.3, 28.4, 29.4, 29.7, 29.9, 30.5, 31.4, 33.1, 34.7, 35.9],
  [35.9, 34.8, 33.5, 32.4, 31.0, 29.4, 27.8, 26.0, 23.4, 20.7, 18.0, 16.2, 14.1, 12.2, 10.9, 8.9, 6.7, 5.6, 3.5, 2.4, 2.3, 2.5, 2.8, 3.0, 3.3, 3.7, 3.6, 3.7, 4.0, 4.5, 5.1, 7.0, 7.6, 9.3, 10.6, 12.4, 14.6, 16.6, 18.8, 20.2, 21.7, 22.9, 24.0, 24.9, 25.9, 27.2, 28.4, 29.4, 29.9, 30.3, 31.0, 32.1, 33.8, 36.0, 37.3],
  [36.0, 35.1, 33.8, 32.5, 31.0, 29.5, 27.7, 25.8, 23.2, 20.7, 18.1, 16.2, 14.2, 12.4, 10.8, 8.9, 6.5, 5.3, 3.3, 1.9, 2.3, 2.7, 2.9, 3.1, 3.4, 3.8, 3.6, 3.8, 4.1, 4.6, 5.2, 7.3, 8.5, 10.3, 11.6, 13.6, 15.6, 17.3, 19.1, 20.5, 21.9, 22.9, 24.0, 24.9, 26.0, 27.2, 28.4, 29.6, 30.3, 31.0, 32.0, 33.2, 34.6, 36.6, 37.3],
  [36.0, 35.3, 34.1, 32.6, 31.1, 29.6, 27.7, 25.6, 23.1, 20.7, 18.2, 16.3, 14.3, 12.5, 10.6, 8.9, 6.4, 5.2, 3.0, 1.4, 2.3, 2.8, 2.9, 3.1, 3.5, 3.8, 3.7, 3.9, 4.2, 4.6, 5.4, 7.6, 9.4, 11.3, 12.6, 14.7, 16.6, 18.0, 19.4, 20.8, 22.1, 23.1, 24.0, 25.0, 26.1, 27.3, 28.4, 29.7, 30.7, 31.8, 33.0, 34.2, 35.4, 36.6, 37.4],
  [35.9, 35.2, 34.2, 32.8, 31.2, 29.4, 27.4, 25.2, 22.9, 20.6, 18.4, 16.5, 14.5, 12.6, 10.6, 8.9, 6.2, 4.9, 2.7, 1.3, 2.5, 2.8, 3.0, 3.2, 3.6, 3.9, 3.8, 4.0, 4.3, 4.7, 5.7, 8.2, 10.2, 11.8, 13.5, 15.4, 17.3, 18.6, 19.8, 21.0, 22.4, 23.3, 24.1, 25.0, 26.1, 27.2, 28.3, 29.6, 30.8, 32.0, 33.2, 34.1, 35.3, 36.1, 37.4],
  [35.5, 34.9, 34.1, 32.9, 30.8, 28.9, 26.9, 25.0, 22.8, 20.6, 18.4, 16.6, 14.5, 12.6, 10.8, 9.0, 6.3, 4.6, 3.1, 1.4, 2.6, 2.8, 3.0, 3.3, 3.7, 3.9, 3.8, 4.1, 4.4, 4.8, 6.2, 8.5, 10.3, 12.6, 14.5, 16.5, 18.2, 19.4, 20.1, 21.3, 22.6, 23.5, 24.1, 24.9, 26.0, 27.1, 28.4, 28.9, 30.1, 31.2, 32.4, 33.5, 34.5, 35.1, 36.3],
] }
/** The lowest of the map's ground where the model's feet stand (above 41.16 m): z = 0. */
const BASE = (() => {
  let m = Infinity
  for (let x = -129.7; x <= 130.4; x += 0.5) for (const y of [-6.8, -2.6, 3.4, 7.6]) m = Math.min(m, groundAt(GROUND, x, y))
  return m
})()
const ground = (x: number, y: number) => groundAt(GROUND, x, y) - BASE

const CONCRETE = finish('cabrillo-concrete', 0xe6dfd1)
const WALK = finish('cabrillo-walk', 0xcdc8be)

function build() {
  const conc = new Part(), soffit = new Part(), walk = new Part(), metal = new Part(), lamp = new Part()

  // ---- Plan and profile.
  const X0 = -129.7, X1 = 130.4
  const YC = 0.4, HW = 7.2
  const YS = YC - HW, YN = YC + HW
  /** The map's roadway (lidar deck top), z. */
  // lidar deck top 36.0 (to x = 70) rising to 37.35 above its ground_min 41.11 m, in this frame
  const R0 = 36.0 + 41.11 - 41.16 - BASE
  const road = (x: number) => (x <= 70 ? R0 : R0 + (1.35 * (x - 70)) / (X1 - 70))
  const PARA = 1.1, SLAB = 0.3, CURB = 0.18, SIDEWALK = 2.3, PT = 0.45
  // the arcade
  const A = -84.9, B = 57.2, SPAN = 17, NA = 7
  const PIER = (B - A - NA * SPAN) / (NA - 1)
  const arches = Array.from({ length: NA }, (_, i) => { const xs = A + i * (SPAN + PIER); return { xs, xe: xs + SPAN, xc: xs + SPAN / 2 } })
  const R = SPAN / 2
  const crown = (x: number) => road(x) - 2.3
  /** The underside of the structure at x: an arch's intrados over an opening, else the ground (solid). */
  const archAt = (x: number) => arches.find((a) => x > a.xs + 1e-6 && x < a.xe - 1e-6)
  const intradosOf = (a: { xc: number }, x: number) => crown(a.xc) - R + Math.sqrt(Math.max(0, R * R - (x - a.xc) ** 2))
  // transverse openings through the piers: 6 m wide, springing 3 m under their 16 m crowns
  const T_HALF = 3.0, T_TOP = 16, T_SPRING = 13
  const pierOpen = (x: number) => {
    const g = Math.max(ground(x, YC - T_HALF), ground(x, YC + T_HALF))
    return T_SPRING - g >= 3
  }

  // stations along the bridge: every 4 m, plus finely round each arch, plus the arch ends
  const xsSet = new Set<number>(stations(X0, X1, 4).map((v) => +v.toFixed(3)))
  for (const a of arches) {
    for (let k = 0; k <= 16; k++) xsSet.add(+(a.xc - R * Math.cos((Math.PI * k) / 16)).toFixed(3))
  }
  for (const v of [-96.4, -84.9, 57.2, 69.6]) xsSet.add(v)
  const XS = [...xsSet].sort((a, b) => a - b)
  // coarser stations for the deck and cornice, which only follow the roadway's straight profile
  const DS = [...new Set([...stations(X0, X1, 6).map((v) => +v.toFixed(3)), 70])].sort((a, b) => a - b)

  // ---- The two face walls (spandrels, piers, abutments, approaches), each from its bottom to the parapet's top.
  for (const [y, n] of [[YS, -1], [YN, 1]] as [number, number][]) {
    for (let i = 0; i < XS.length - 1; i++) {
      const xa = XS[i], xb = XS[i + 1], xm = (xa + xb) / 2
      const a = archAt(xm)
      const bot = (x: number) => (a ? Math.max(ground(x, y), intradosOf(a, x)) : ground(x, y))
      const ba = bot(xa), bb = bot(xb)
      const ta = road(xa) + PARA, tb = road(xb) + PARA
      if (ta - ba < 0.05 && tb - bb < 0.05) continue
      orientTo(conc, [[xa, y, Math.min(ba, ta)], [xb, y, Math.min(bb, tb)], [xb, y, tb], [xa, y, ta]], [0, n, 0])
    }
    // cornice band at deck level, a little proud
    for (let i = 0; i < DS.length - 1; i += 1) {
      const xa = DS[i], xb = DS[i + 1]
      const yo = y + n * 0.3
      orientTo(conc, [[xa, yo, road(xa) - 1.0], [xb, yo, road(xb) - 1.0], [xb, yo, road(xb) - 0.2], [xa, yo, road(xa) - 0.2]], [0, n, 0])
      orientTo(conc, [[xa, y, road(xa) - 0.2], [xb, y, road(xb) - 0.2], [xb, yo, road(xb) - 0.2], [xa, yo, road(xa) - 0.2]], [0, 0, 1])
      orientTo(soffit, [[xa, y, road(xa) - 1.0], [xb, y, road(xb) - 1.0], [xb, yo, road(xb) - 1.0], [xa, yo, road(xa) - 1.0]], [0, 0, -1])
    }
  }
  // ends of the cornice and of the bridge at the two abutments on the ground
  for (const [x, s] of [[X0, -1], [X1, 1]] as [number, number][]) {
    const zt = road(x) + PARA
    const pts: V3[] = [[x, YS, Math.min(ground(x, YS), zt - 0.1)], [x, YN, Math.min(ground(x, YN), zt - 0.1)], [x, YN, zt], [x, YS, zt]]
    orientTo(conc, pts, [s, 0, 0])
  }

  // ---- Arch soffits (full-width barrels) and the pier faces either side of each opening.
  for (const a of arches) {
    const sp = crown(a.xc) - R
    for (let k = 0; k < 16; k++) {
      const t0 = (Math.PI * k) / 16, t1 = (Math.PI * (k + 1)) / 16
      const P = (t: number, y: number): V3 => [a.xc - R * Math.cos(t), y, sp + R * Math.sin(t)]
      const zA = sp + R * Math.sin(t0), zB = sp + R * Math.sin(t1)
      // below ground the soffit is buried; skip where both ends are under the terrain
      if (zA < ground(a.xc - R * Math.cos(t0), YC) && zB < ground(a.xc - R * Math.cos(t1), YC)) continue
      const nA: V3 = [Math.cos(t0), 0, -Math.sin(t0)], nB: V3 = [Math.cos(t1), 0, -Math.sin(t1)]
      soffit.tri(P(t0, YS), P(t1, YS), P(t1, YN), undefined, undefined, undefined, [nA, nB, nB])
      soffit.tri(P(t0, YS), P(t1, YN), P(t0, YN), undefined, undefined, undefined, [nA, nB, nA])
    }
    // the pier faces below the springing, down to the terrain (split every ~4 m across)
    for (const [x, s] of [[a.xs, 1], [a.xe, -1]] as [number, number][]) {
      const isPier = x > A + 1 && x < B - 1
      const hole = isPier && pierOpen(x)
      for (const [ya, yb] of [[YS, YC - T_HALF], [YC - T_HALF, YC + T_HALF], [YC + T_HALF, YN]]) {
        const mid = ya === YC - T_HALF
        const ga = mid && hole ? T_TOP : ground(x, ya), gb = mid && hole ? T_TOP : ground(x, yb)
        if (ga >= sp && gb >= sp) continue
        orientTo(conc, [[x, ya, Math.min(ga, sp)], [x, yb, Math.min(gb, sp)], [x, yb, sp], [x, ya, sp]], [s, 0, 0])
        if (mid && hole) {
          // the spandrels between the transverse arch and its crown line
          const arc: V3[] = Array.from({ length: 9 }, (_, k) => { const t = (Math.PI * k) / 8; return [x, YC - T_HALF * Math.cos(t), T_SPRING + T_HALF * Math.sin(t)] as V3 })
          for (let k = 0; k < 4; k++) orientTo(conc, [arc[k], arc[k + 1], [x, YC - T_HALF, T_TOP]], [s, 0, 0])
          for (let k = 4; k < 8; k++) orientTo(conc, [arc[k], arc[k + 1], [x, YC + T_HALF, T_TOP]], [s, 0, 0])
          orientTo(conc, [arc[4], [x, YC - T_HALF, T_TOP], [x, YC + T_HALF, T_TOP]], [s, 0, 0])
        }
      }
    }
  }
  // ---- Transverse openings through the six piers (between the "pairs" of hollow pillars).
  for (let i = 0; i < NA - 1; i++) {
    const p0 = arches[i].xe, p1 = arches[i + 1].xs
    const pm = (p0 + p1) / 2
    if (!pierOpen(pm)) continue
    const spring = T_SPRING
    // the two legs' inner faces
    for (const [y, s] of [[YC - 3.0, 1], [YC + 3.0, -1]] as [number, number][])
      orientTo(conc, [[p0, y, ground(p0, y)], [p1, y, ground(p1, y)], [p1, y, spring], [p0, y, spring]], [0, s, 0])
    // the transverse arch's soffit (semicircle across y)
    for (let k = 0; k < 8; k++) {
      const t0 = (Math.PI * k) / 8, t1 = (Math.PI * (k + 1)) / 8
      const Q = (t: number, x: number): V3 => [x, YC - 3.0 * Math.cos(t), spring + 3.0 * Math.sin(t)]
      orientTo(soffit, [Q(t0, p0), Q(t1, p0), Q(t1, p1), Q(t0, p1)], [0, Math.cos((t0 + t1) / 2), -Math.sin((t0 + t1) / 2)])
    }
  }

  // ---- Deck: slab under the roadway, sidewalks, parapets (inner faces and tops).
  for (let i = 0; i < DS.length - 1; i++) {
    const xa = DS[i], xb = DS[i + 1]
    const yi0 = YS + PT + SIDEWALK, yi1 = YN - PT - SIDEWALK
    orientTo(conc, [[xa, yi0, road(xa) - SLAB], [xb, yi0, road(xb) - SLAB], [xb, yi1, road(xb) - SLAB], [xa, yi1, road(xa) - SLAB]], [0, 0, 1])
    for (const [y0, y1, s] of [[YS + PT, yi0, 1], [yi1, YN - PT, -1]] as [number, number, number][]) {
      orientTo(walk, [[xa, y0, road(xa) + CURB], [xb, y0, road(xb) + CURB], [xb, y1, road(xb) + CURB], [xa, y1, road(xa) + CURB]], [0, 0, 1])
      // curb face toward the road
      const yc = s > 0 ? y1 : y0
      orientTo(walk, [[xa, yc, road(xa) - SLAB], [xb, yc, road(xb) - SLAB], [xb, yc, road(xb) + CURB], [xa, yc, road(xa) + CURB]], [0, s > 0 ? 1 : -1, 0])
      // parapet's inner face and top
      const yp = s > 0 ? YS + PT : YN - PT, yo = s > 0 ? YS : YN
      orientTo(conc, [[xa, yp, road(xa) + CURB], [xb, yp, road(xb) + CURB], [xb, yp, road(xb) + PARA], [xa, yp, road(xa) + PARA]], [0, s, 0])
      orientTo(conc, [[xa, yo, road(xa) + PARA], [xb, yo, road(xb) + PARA], [xb, yp, road(xb) + PARA], [xa, yp, road(xa) + PARA]], [0, 0, 1])
    }
  }

  // ---- Abutment towers: pilasters 1 m proud on both faces, up past the parapet.
  for (const [x0, x1] of [[-96.4, -84.9], [57.2, 69.6]]) {
    for (const [y, n] of [[YS, -1], [YN, 1]] as [number, number][]) {
      const yo = y + n * 1.0
      const zt = road((x0 + x1) / 2) + PARA + 0.5
      const xs = stations(x0, x1, 4)
      for (let i = 0; i < xs.length - 1; i++) {
        const xa = xs[i], xb = xs[i + 1]
        orientTo(conc, [[xa, yo, ground(xa, yo)], [xb, yo, ground(xb, yo)], [xb, yo, zt], [xa, yo, zt]], [0, n, 0])
        orientTo(conc, [[xa, y, zt], [xb, y, zt], [xb, yo, zt], [xa, yo, zt]], [0, 0, 1])
      }
      for (const [x, s] of [[x0, -1], [x1, 1]] as [number, number][])
        orientTo(conc, [[x, y, ground(x, y)], [x, yo, ground(x, yo)], [x, yo, zt], [x, y, zt]], [s, 0, 0])
    }
  }

  // ---- Lamp standards over each pier and abutment, both parapets.
  const posts = [...arches.slice(0, -1).map((a) => a.xe + PIER / 2), -90.6, 63.4, -113, 100]
  for (const x of posts) for (const y of [YS + 0.25, YN - 0.25]) {
    const z0 = road(x) + PARA
    cylinder(metal, x, y, 0.13, z0, z0 + 3.4, 6, 0.09)
    bead(lamp, [x, y, z0 + 3.75], 0.35, true)
  }

  // ---- z = 0 at the lowest foot: the canyon's lowest ground lies under an arch, where no
  // foot stands, so drop everything by the lowest foot's height (every foot stays at the
  // DEM less one constant).
  const parts = [conc, soffit, walk, metal, lamp]
  let low = Infinity
  for (const p of parts) for (let i = 1; i < p.pos.length; i += 3) low = Math.min(low, p.pos[i])
  for (const p of parts) for (let i = 1; i < p.pos.length; i += 3) p.pos[i] -= low
  console.log(`lowest foot ${low.toFixed(2)} m above the lowest ground under the footprint; roadway z ${(road(0) - low).toFixed(2)}–${(road(X1) - low).toFixed(2)}`)

  // ---- Night: the faces and arches are floodlit from below (2015 lighting).
  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : Math.abs(n[1]) > 0.7 ? 0.65 : 0.5)
  return [
    { part: conc, material: { ...CONCRETE, floodlight: lit } },
    { part: soffit, material: { ...finish('cabrillo-soffit', 0xd2cabb), floodlight: lit } },
    { part: walk, material: WALK },
    { part: metal, material: finish('cabrillo-lamp-post', 0x4f5459) },
    { part: lamp, material: finish('lamp', 0xe8e2d2) },
  ]
}

if (import.meta.main) await saveModel('sd-cabrillo-bridge', 'Cabrillo Bridge', build())
