/**
 * Brooklyn Bridge (1883; John A. and Washington Roebling) — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-brooklyn-bridge.ts
 *
 * The whole bridge, anchorage to anchorage, as one placement: both towers,
 * both anchorages, four main cables, the vertical suspenders, the diagonal
 * stays fanning from each tower, the four stiffening trusses, the deck's
 * underside and the elevated promenade, its walking surface included.
 * Writes two GLBs: the low model (towers, anchorages, cables, promenade,
 * trusses as solid bands) and a detail
 * model (trusses opened into lattice, plus suspenders, stays, floor beams
 * and the promenade's cross beams), which a map draws from detailZoom up.
 *
 * Frame: x across the bridge, y along it toward Manhattan, z up, metres.
 * Placed at bearing 316.18°, the line from the Brooklyn tower's centroid to
 * the Manhattan one's; the anchor is midway between them. The map owns the
 * roadways' surfaces: nothing here is a slab at road level, so the map's
 * own decks show between the trusses.
 *
 * Height. z = 0 is the waterline, the lowest ground under the footprint,
 * which the map draws at the river's surface (3DEP reads the East River at
 * -1.6 m NAVD88, so a height above the water is the DEM plus 1.6). The
 * trusses are built around the map's own two roadways, so its decks sit
 * between them; each side follows its own roadway:
 * - main span: 41 − 0.01·S·(2u − 1)², S = 485.1 m between the towers: 41 m
 *   at midspan (OSM height=41 on the outline), 36.1 m at the towers;
 * - side spans and anchorages, from the map's decks: at the Brooklyn
 *   anchorage 34.2 m (west roadway) and 32.1 m (east), 32.8 and 30.3 at its
 *   landward end; at the Manhattan anchorage 26.6 and 27.9, then 24.4 and
 *   25.9 at its landward end.
 * Lidar puts the real roadways a little differently (0.8 m higher at
 * midspan, about 27 m over both anchorages); the trusses follow the map, so
 * the two agree on the map. If its profile changes, change `SIDES` below.
 * The cables are the lidar's, in absolute height.
 *
 * The map draws the roadways' surfaces and markings; this model owns the
 * promenade outright: its walking surface 3.4 m above the higher roadway
 * (lidar; 44.4 m at midspan, 39.6 m at the towers), anchorage to anchorage
 * and over both anchorages, widening into a balcony round each tower's
 * centre pier; the inner trusses either side stand 1.2 m above it as its
 * railings. The anchorages' roofs and the string course over the towers'
 * piers stay 0.25–0.4 m under the roadways; under the arches the masonry
 * steps down a further metre.
 *
 * Standing on the terrain. The towers stand in the river at z = 0. Each
 * anchorage's walls run down to the ground under them, vertex by vertex,
 * from a 5 m table of 3DEP bare-earth heights taken in this frame
 * (`BROOKLYN_GROUND`, `MANHATTAN_GROUND`). So the model's feet all sit 1.6 m
 * above the DEM: the towers on the water and the anchorages 9 to 20 m up on
 * their streets. A map that reads a model's ground from its lowest vertices
 * (Parchment does, for coasters) sees them line up with its terrain and
 * drapes the model over it, rather than setting a kilometre of bridge rigidly
 * on the mean ground of its footprint.
 *
 * Sources:
 * - OSM: towers way/1255363983 (Manhattan) and way/317352708 (Brooklyn),
 *   42.8 × 16.8 m, 485.1 m apart centre to centre; the bridge outline
 *   way/375157262 (height=41, layer 3), 28.4 m wide, from y = -524.2 (the
 *   Brooklyn anchorage's river face) to +526.5 (the Manhattan one's); the
 *   anchorages way/888759002 (Brooklyn, 93 × 34 m) and way/1255363984
 *   (Manhattan, 64 × 34 m), tagged bridge:support=abutment.
 * - Lidar, USGS 3DEP NY_NewYorkCity (2017), 0.5 m grids across the deck at
 *   midspan, the quarter point, beside each tower, mid side span and near
 *   each anchorage; heights above the water (-0.4 m NAVD88 in the cloud):
 *   - four trusses, at x ≈ ±12.9 and ±2.6, their tops 4.6 m above the
 *     roadway; the promenade between the inner pair, 3.4 m above it;
 *   - the cables at x ≈ ±13.75 and ±1.75, 53.2 m high at y = ±121 and
 *     70.6 m at ±200: a parabola 43.2 m low at midspan, 83.5 m at the tower
 *     centre lines (sag 40.3 m; Roebling's published dip is 128 ft, 39 m);
 *     41.3 m and 41.0 m at y = ∓380 on the side spans, and level with the
 *     truss tops over the last 80 m before each anchorage;
 *   - the anchorages' tops at the roadway, 26–28 m; nothing stands above them.
 * - Published (Wikipedia "Brooklyn Bridge", citing the NYC landmark report
 *   and HAER NY-18): main span 1,595.5 ft, side spans 930 ft, 85 ft wide;
 *   four cables of 15.75 in; 1,520 suspenders and 400 diagonal stays, the
 *   stays 138–449 ft long; four stiffening trusses since the 1950s rebuild
 *   (six before); promenade between the roadways; anchorages of limestone
 *   and granite, 129 × 119 ft at the base and about 86 ft high.
 * - Photos: "Brooklyn Bridge anchorage" (Vicpeters, CC BY 4.0, Wikimedia
 *   Commons; the river face of an anchorage under the deck: two blind
 *   arches with windows, rusticated corner piers, the steel deck and floor
 *   beams over it, the steel's buff paint); HAER NY,31-NEYO,90-58 "View
 *   looking E at Brooklyn anchorage and approach" (Jet Lowe, 1982, public
 *   domain; the anchorage's long side with its blind arches, the truss band
 *   over the side span); "Victorian Gothic - New York, NY - Brooklyn Bridge"
 *   (9.4–9.7) (Bmzuckerman, CC BY 4.0; towers, cables and the stay web).
 * - The towers are the approved tower model's design, unchanged but for the
 *   string course: its top is lowered from 36.5 to 35.6 m, it has no top
 *   under the arches, and the roadway strip through them is gone, so the
 *   map's roadways (36.1–36.3 m at the towers) pass through the arches
 *   above the masonry rather than fighting it.
 *
 * Night lighting (`lamp` beads, and `_FLOODLIGHT` on the towers' masonry):
 * - NYC DOT, "NYC DOT Celebrates New Year's 'Glow Up' for the Historic
 *   Brooklyn Bridge" (press release, January 2024): 56 new LED lights
 *   illuminate the towers, the first time since the 1983 centennial; the
 *   166 "necklace" lights on the cables were converted to LED in 2021.
 *   Reported as "bright white" (Our Town Downtown, January 2024).
 * - Photos, Wikimedia Commons: "Brooklyn Bridge at night - 2016" (Mike
 *   Sinko, CC BY 2.0), "Brooklyn Bridge, Manhattan at night 1" and "3"
 *   (Rhododendrites, 2015, CC BY-SA 4.0), "Brooklyn Bridge at night from
 *   BPP" (Jkoss6, CC BY-SA 4.0), "Brooklyn Bridge, New York" (Pierre
 *   Blaché, 2019, CC0), "Cops on the bridge" (2017, CC BY 2.0). They show
 *   the necklace on the two outer cables only, over the main and both side
 *   spans; lamps along the outer trusses over the roadways; and cast-iron
 *   lantern posts along the promenade's railings.
 *
 * Estimated or simplified:
 * - The trusses' depth below the roadway (1.8 m) and the floor beams; no
 *   open evidence shows the underside's depth.
 * - Suspenders every 4.6 m, every second one of the real 2.3 m spacing, and
 *   25 stays per fan on the suspender stations 12–122 m from each tower
 *   face, so the web reads without shimmering; the cables are drawn 0.8 m
 *   thick against the real 0.4 m, and the suspenders and stays thicker too.
 * - The anchorages' walls are drawn plumb; the real ones batter in about
 *   2 m a side. Their footprints are OSM's, longer than the published
 *   129 ft because OSM includes the vaults behind the anchor block.
 * - The night lighting's layout: the necklace's 83 lights a cable spread
 *   evenly by length, and promenade lanterns every 69 m a side, staggered,
 *   from the photos rather than a plan. The roadway lamps are drawn only as
 *   the warm light on the outer trusses. Where the towers' 56 fixtures
 *   stand isn't published, so their wash is a guess at uplighting from the
 *   roadway and the water. One warm white stands for every light, though
 *   the 2015 photos show the roadway lamps amber.
 * - The balconies' extent at the towers (12.6 m wide, 4 m past each face)
 *   and the promenade's line over the anchorages, where the real one starts
 *   its descent to the street.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import {
  along, band, bead, footedWall, groundAt, merged, parabola, piecewise, rod, stations, truss, tube, type GroundGrid,
} from './bridge-kit'

// ---- Towers -------------------------------------------------------------------
// The tower model's own code, emitted once per tower at `DY` along the axis.

const stone = new Part()    // piers, buttresses, lower block, anchorages
const curtain = new Part()  // recessed curtain wall between the piers, blind arches
const trim = new Part()     // plinth, string course, cornice, archivolts, caps
const soffit = new Part()   // arch intrados and the deck's underside, in shadow
const roof = new Part()     // top surfaces: the tower's own stone, a shade darker

const PX = 2.8                  // centre pier half-width
const OX0 = 12.8, OX1 = 18.6    // outer pier
const EX = 21.4                 // end of the buttress / lower block
const PD = 8.3                  // pier half-depth
const CD = 7.1                  // curtain wall half-depth
const BD = 3.6                  // end buttress half-depth
const LD = 8.4                  // lower block half-depth

const PLINTH = 2.0
const DECK0 = 34.1, DECK = 35.6 // string course, 0.3 m or more under the map's roadways at the towers
const SPRING = 61.0, RISE = 9.0 // pointed arches: 10 m wide, crown at 70 m
const COR0 = 79.4, COR1 = 81.2  // cornice
const TOP = 82.2                // wall top
const CAP = 84.3                // pier caps (cable saddle housings)

const XC = (PX + OX0) / 2
const A = (OX0 - PX) / 2
const C = (RISE * RISE - A * A) / (2 * A)
const R = A + C
const SEG = 8
const BAND = 0.9, PROUD = 0.25

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

let MX = 1, MY = 1, FX = false, DY = 0
const m = (v: V3): V3 => [(FX ? 2 * XC - v[0] : v[0]) * MX, v[1] * MY + DY, v[2]]
const mv = (v: V3): V3 => [(FX ? -v[0] : v[0]) * MX, v[1] * MY, v[2]]
function mirrored(build: () => void, xs = [1, -1], ys = [1, -1]) {
  for (const sx of xs) for (const sy of ys) { MX = sx; MY = sy; build() }
  MX = 1; MY = 1
}

function q(p: Part, pts: V3[], ns: V3[]) {
  const P = pts.map(m), N = ns.map(n => unit(mv(n)))
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const avg = N.reduce(add, [0, 0, 0] as V3)
  const [a, b, c, d] = dot(f, avg) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(P[a], P[b], P[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(P[a], P[c], P[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}
const flat = (p: Part, pts: V3[], n: V3) => q(p, pts, [n, n, n, n])
function fan(p: Part, ring: V3[], n: V3) {
  for (let i = 1; i < ring.length - 1; i++) {
    const P = [ring[0], ring[i], ring[i + 1]].map(m), N = unit(mv(n))
    const ok = dot(cross(sub(P[1], P[0]), sub(P[2], P[0])), N) >= 0
    p.tri(P[0], ok ? P[1] : P[2], ok ? P[2] : P[1], undefined, undefined, undefined, [N, N, N])
  }
}

function rim(x0: number, x1: number, y0: number, y1: number, r: number, z: number) {
  r = Math.max(r, 0.04)
  const S: V3 = [0, -1, 0], E: V3 = [1, 0, 0], N: V3 = [0, 1, 0], W: V3 = [-1, 0, 0]
  return {
    pts: [[x0 + r, y0, z], [x1 - r, y0, z], [x1, y0 + r, z], [x1, y1 - r, z],
      [x1 - r, y1, z], [x0 + r, y1, z], [x0, y1 - r, z], [x0, y0 + r, z]] as V3[],
    ns: [S, S, E, E, N, N, W, W],
  }
}

function rbox(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number,
  { r = 0.45, top = 0, bot = 0, lid = p as Part | null, base = false } = {}) {
  const up: V3 = [0, 0, 1], down: V3 = [0, 0, -1]
  const rings: { pts: V3[]; ns: V3[] }[] = []
  if (bot > 0) rings.push({ ...rim(x0 + bot, x1 - bot, y0 + bot, y1 - bot, r - bot * .41, z0), ns: Array(8).fill(down) })
  rings.push(rim(x0, x1, y0, y1, r, z0 + bot))
  rings.push(rim(x0, x1, y0, y1, r, z1 - top))
  if (top > 0) rings.push({ ...rim(x0 + top, x1 - top, y0 + top, y1 - top, r - top * .41, z1), ns: Array(8).fill(up) })
  for (let k = 0; k < rings.length - 1; k++) for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8, a = rings[k], b = rings[k + 1]
    q(p, [a.pts[i], a.pts[j], b.pts[j], b.pts[i]], [a.ns[i], a.ns[j], b.ns[j], b.ns[i]])
  }
  if (lid) fan(lid, rings[rings.length - 1].pts, up)
  if (base) fan(p, rings[0].pts, down)
}

function arc(rad: number, t: number): [number, number, number, number] {
  const crown = Math.acos(-C / rad)
  const th = Math.PI + (crown - Math.PI) * t
  const cx = XC + C
  return [cx + rad * Math.cos(th), SPRING + rad * Math.sin(th), Math.cos(th), Math.sin(th)]
}

function tower(at: number) {
  DY = at
  // Below the roadway: one solid block on a waterline plinth.
  rbox(trim, -EX - .5, EX + .5, -LD - .5, LD + .5, 0, PLINTH, { r: .5, top: .3, lid: roof })
  rbox(curtain, -EX + .5, EX - .5, -LD + .5, LD - .5, PLINTH, DECK0, { r: .3, lid: null })
  mirrored(() => {
    for (const [y0, y1] of [[-LD, -BD - .8], [-BD, BD], [BD + .8, LD]])
      rbox(stone, OX0 + .4, EX, y0, y1, PLINTH, DECK0, { r: .45, lid: null })
  }, [1, -1], [1])
  rbox(stone, -PX, PX, -LD, LD, PLINTH, DECK0, { r: .45, lid: null })
  rbox(trim, -EX - .35, EX + .35, -LD - .35, LD + .35, DECK0, DECK, { r: .5, top: .25, bot: .2, lid: null })
  // Its top over the piers only: the roadways pass through the arches, where
  // a floor in shadow sits a metre further down, under the map's decks.
  const LT = LD + .1
  flat(roof, [[-PX, -LT, DECK], [PX, -LT, DECK], [PX, LT, DECK], [-PX, LT, DECK]], [0, 0, 1])
  mirrored(() => {
    flat(roof, [[OX0, -LT, DECK], [EX + .1, -LT, DECK], [EX + .1, LT, DECK], [OX0, LT, DECK]], [0, 0, 1])
    flat(soffit, [[PX, -LT, DECK - 1], [OX0, -LT, DECK - 1], [OX0, LT, DECK - 1], [PX, LT, DECK - 1]], [0, 0, 1])
  }, [1, -1], [1])

  // Above the roadway: piers, buttresses, curtain wall.
  rbox(stone, -PX, PX, -PD, PD, DECK, TOP, { r: .5, lid: roof })
  mirrored(() => {
    rbox(stone, OX0, OX1, -PD, PD, DECK, TOP, { r: .5, lid: roof })
    rbox(stone, OX1 - .3, EX, -BD, BD, DECK, COR0 + .2, { r: .45, lid: null })
  }, [1, -1], [1])

  for (const f of [false, true]) mirrored(() => {
    FX = f
    for (let i = 0; i < SEG; i++) {
      const [xa, za] = arc(R, i / SEG), [xb, zb] = arc(R, (i + 1) / SEG)
      flat(curtain, [[xa, CD, za], [xb, CD, zb], [xb, CD, TOP], [xa, CD, TOP]], [0, 1, 0])
    }
    for (let i = 0; i < SEG; i++) {
      const [xa, za, ca, sa] = arc(R, i / SEG), [xb, zb, cb, sb] = arc(R, (i + 1) / SEG)
      const na: V3 = [-ca, 0, -sa], nb: V3 = [-cb, 0, -sb]
      q(soffit, [[xa, 0, za], [xb, 0, zb], [xb, CD, zb], [xa, CD, za]], [na, nb, nb, na])
    }
    flat(soffit, [[PX + .01, 0, DECK], [PX + .01, CD, DECK], [PX + .01, CD, SPRING], [PX + .01, 0, SPRING]], [1, 0, 0])
    const RO = R + BAND
    for (let i = 0; i < SEG; i++) {
      const t0 = i / SEG, t1 = (i + 1) / SEG
      const [xi0, zi0, ci0, si0] = arc(R, t0), [xi1, zi1, ci1, si1] = arc(R, t1)
      const [xo0, zo0, co0, so0] = arc(RO, t0), [xo1, zo1, co1, so1] = arc(RO, t1)
      const y1 = CD + PROUD
      flat(trim, [[xi0, y1, zi0], [xi1, y1, zi1], [xo1, y1, zo1], [xo0, y1, zo0]], [0, 1, 0])
      q(trim, [[xo0, CD, zo0], [xo1, CD, zo1], [xo1, y1, zo1], [xo0, y1, zo0]],
        [[co0, 0, so0], [co1, 0, so1], [co1, 0, so1], [co0, 0, so0]])
      q(trim, [[xi0, CD, zi0], [xi1, CD, zi1], [xi1, y1, zi1], [xi0, y1, zi0]],
        [[-ci0, 0, -si0], [-ci1, 0, -si1], [-ci1, 0, -si1], [-ci0, 0, -si0]])
    }
    FX = false
  }, [1, -1], [1, -1])
  mirrored(() => {
    flat(roof, [[PX, -CD, TOP], [OX0, -CD, TOP], [OX0, CD, TOP], [PX, CD, TOP]], [0, 0, 1])
  }, [1, -1], [1])

  // Cornice and caps.
  const CO = .45
  rbox(trim, -PX - CO, PX + CO, -PD - CO, PD + CO, COR0, COR1, { r: .5, top: .2, bot: .25, lid: null })
  mirrored(() => {
    rbox(trim, OX0 - CO, OX1 + CO, -PD - CO, PD + CO, COR0, COR1, { r: .5, top: .2, bot: .25, lid: null })
    rbox(trim, PX, OX0, -CD - CO, CD + CO, COR0, COR1, { r: .2, top: .2, bot: .25, lid: null })
    rbox(trim, OX1, EX + CO, -BD - CO, BD + CO, COR0, COR1, { r: .5, top: .2, bot: .25, lid: roof })
  }, [1, -1], [1])
  rbox(trim, -PX + .5, PX - .5, -PD + .6, PD - .6, TOP, CAP, { r: .4, top: .3, lid: roof })
  mirrored(() => {
    rbox(trim, OX0 + .5, OX1 - .5, -PD + .6, PD - .6, TOP, CAP, { r: .4, top: .3, lid: roof })
  }, [1, -1], [1])
  DY = 0
}

// ---- The span ------------------------------------------------------------------

const S = 485.08                // tower centre to tower centre (OSM)
const TY = S / 2                // towers at y = ±TY
const FACE = LD + .5            // the towers' faces, from their centre lines
const YB = -524.2, YM = 526.5   // the anchorages' river faces: the outline's ends

/**
 * The map's two roadways, metres above the water, side by side (s = -1 the
 * west roadway at x < 0, +1 the east): the main span is 41 − 0.01·S·(2u − 1)²,
 * 41 m at midspan and 36.1 m at the towers; the side spans and the
 * anchorages are read off the map's decks every 20 m (within 0.35 m).
 */
const MAIN = (y: number) => 41 - 0.01 * S * (y / TY) ** 2
const SIDES: Record<number, (y: number) => number> = {
  [-1]: piecewise([
    [-620, 32.78], [-600, 33.06], [-580, 33.34], [-560, 33.63], [-540, 33.92], [-520, 34.21], [-500, 34.49],
    [-480, 34.78], [-460, 35.06], [-440, 35.35], [-420, 35.64], [-400, 35.93], [-380, 36.18], [-360, 36.29],
    [-340, 36.24], [-320, 36.13], [-300, 36.0], [-280, 35.91], [-260, 35.93], [-TY, 36.08],
    [TY, 36.16], [260, 35.64], [280, 35.1], [300, 34.59], [320, 34.1], [340, 33.03], [360, 32.43], [380, 31.79],
    [400, 31.1], [420, 30.39], [440, 29.69], [460, 28.98], [480, 28.27], [500, 27.57], [520, 26.86], [540, 26.16],
    [560, 25.45], [580, 24.74], [595, 24.21],
  ]),
  [1]: piecewise([
    [-620, 30.19], [-600, 30.58], [-580, 30.97], [-560, 31.36], [-540, 31.75], [-520, 32.14], [-500, 32.53],
    [-480, 32.92], [-460, 33.31], [-440, 33.7], [-420, 34.09], [-400, 34.48], [-380, 34.85], [-360, 35.13],
    [-340, 35.31], [-320, 35.45], [-300, 35.72], [-280, 35.73], [-260, 35.95], [-TY, 36.23],
    [TY, 36.05], [260, 35.55], [280, 35.02], [300, 34.51], [320, 34.01], [340, 33.52], [360, 32.99], [380, 32.42],
    [400, 31.81], [420, 31.19], [440, 30.57], [460, 30.07], [480, 29.34], [500, 28.72], [520, 28.11], [540, 27.49],
    [560, 26.87], [580, 26.26], [595, 25.8],
  ]),
}
const road = (y: number, s: number): number => (Math.abs(y) <= TY ? MAIN(y) : SIDES[s](y))
const higher = (y: number) => Math.max(road(y, -1), road(y, 1))
const lower = (y: number) => Math.min(road(y, -1), road(y, 1))
const TOWER_ROAD = MAIN(TY)

const TRUSS_UP = 4.6            // truss tops above the roadway (lidar)
const UNDER = 1.8               // the underside below it
const PROM = 3.4                // the promenade's surface above the higher roadway (lidar)
const RAIL = 1.2                // the inner trusses' tops above the promenade: its railings
const OUT = 12.9, IN = 2.6      // truss centre lines
const EDGE = 13.15              // outer edge of the deck structure
const WALK = IN - .25           // the promenade's half-width, between the inner trusses
const BALCONY = 6.3             // its half-width where it wraps round a tower's centre pier
const CABLES = [-13.75, -1.75, 1.75, 13.75]
const CABLE_R = 0.4
const SADDLE = 83.5, LOW = 43.2
const BAY = 4.57                // two of the real 7.5 ft suspender bays
const BACK_B = -617.1, BACK_M = 590.7 // the anchorages' landward ends (OSM)

// Spans between towers and anchorages: [from, to], each clear of the towers.
const spans: [number, number][] = [[YB, -TY - FACE], [-TY + FACE, TY - FACE], [TY + FACE, YM]]
// The promenade runs on over both anchorages.
const walkSpans: [number, number][] = [[BACK_B, -TY - FACE], [-TY + FACE, TY - FACE], [TY + FACE, BACK_M]]

const prom = (y: number) => higher(y) + PROM

const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))
const mainCable = (y: number) => {
  const z = LOW + (SADDLE - LOW) * (y / TY) ** 2
  // Over the last 15 m the cable rises onto the saddle rather than into the cornice.
  const near = Math.abs(y) - (TY - FACE - 15)
  const atFace = LOW + (SADDLE - LOW) * ((TY - FACE) / TY) ** 2
  return Math.abs(y) >= TY - FACE ? SADDLE : z + (SADDLE - atFace) * smooth(near / 15)
}
const sideCableB = parabola([-TY - FACE, SADDLE], [-380, 41.3], [YB, higher(YB) + 0.8])
const sideCableM = parabola([TY + FACE, SADDLE], [380, 41.0], [YM, higher(YM) + 0.8])
/** A main cable's height along the bridge, never through the roadway. */
const cable = (y: number): number => {
  const z = Math.abs(y) <= TY + FACE ? mainCable(y) : y < 0 ? sideCableB(y) : sideCableM(y)
  return Math.max(z, higher(y) + 0.8)
}

/** Stations along a span, every 20 m: the deck's profile bends between them. */
const curve = ([a, b]: [number, number]) => stations(a, b, 20)
/** The low model's stations, twice as far apart: within 0.1 m of the finer ones. */
const far = ([a, b]: [number, number]) => stations(a, b, 40)
/** Panel points across a span, one per modelled suspender. */
const bays = ([a, b]: [number, number]) => stations(a, b, BAY)

const steelLow = new Part(), steelDetail = new Part()
const webDetail = new Part()                 // lattice strips, double-sided
const soffitDetail = new Part()
const walk = new Part(), walkDetail = new Part() // the promenade's walking surface

const outerTop = (s: number) => (y: number) => road(y, s) + TRUSS_UP
const outerBot = (s: number) => (y: number) => road(y, s) - UNDER
const innerTop = (y: number) => prom(y) + RAIL
const innerBot = (y: number) => lower(y) - UNDER

for (const span of spans) {
  const ys = curve(span)
  for (const s of [1, -1]) {
    // Low: each outer truss a solid band; its underside is the soffit's.
    band(steelLow, s * (OUT - .25), s * (OUT + .25), far(span), outerTop(s), outerBot(s), { out: true, in: true, top: true, ends: true })
    truss(steelDetail, webDetail, s * OUT, bays(span), outerTop(s), outerBot(s), { curve: ys })
    // The underside under each roadway, facing down only.
    band(soffit, 0, s * EDGE, far(span), outerBot(s), outerBot(s), { bottom: true })
    band(soffitDetail, 0, s * EDGE, ys, outerBot(s), outerBot(s), { bottom: true })
  }
  // Floor beams under it, every second bay.
  for (const y of bays(span).filter((_, i) => i % 2 === 0)) {
    const z = lower(y) - UNDER
    band(soffitDetail, -EDGE, EDGE, [y - .3, y + .3], () => z, () => z - .7, { out: false, in: false, bottom: true, ends: true })
  }
}

// The promenade: its walking surface over the higher roadway, the inner
// trusses either side of it as its railings, and cross beams under it.
for (const span of walkSpans) {
  const ys = curve(span)
  for (const s of [1, -1]) {
    band(steelLow, s * (IN - .25), s * (IN + .25), far(span), innerTop, innerBot, { out: true, top: true, ends: true })
    truss(steelDetail, webDetail, s * IN, bays(span), innerTop, innerBot, { curve: ys })
  }
  band(walk, -WALK, WALK, far(span), prom, prom, { top: true })
  band(walkDetail, -WALK, WALK, ys, prom, (y) => prom(y) - .3, { top: true, bottom: true })
  for (const y of bays(span)) {
    const z = prom(y) - .3
    band(steelDetail, -WALK, WALK, [y - .2, y + .2], () => z, () => z - .45, { out: false, in: false, bottom: true, ends: true })
  }
}
// At each tower it widens into a balcony round the centre pier, over the
// inner lanes, with a railing along each side.
for (const t of [-TY, TY]) {
  const ys = stations(t - FACE - 4, t + FACE + 4, 6.5)
  for (const p of [walk, walkDetail]) band(p, -BALCONY, BALCONY, ys, prom, (y) => prom(y) - .5, { out: true, in: true, top: true, bottom: true, ends: true })
  for (const s of [1, -1])
    band(steelDetail, s * (BALCONY - .15), s * (BALCONY + .1), ys, (y) => prom(y) + RAIL, (y) => prom(y) - .5, { out: true, in: true, top: true, ends: true })
}

// Cables, anchorage to anchorage, over the saddles. The ends dive into the
// anchorages' masonry.
const cablePath = (x: number, step: number): V3[] => [
  [x, YB - 9, lower(YB) - 3],
  ...spans.flatMap(([a, b]) => stations(a, b, step).map((y) => [x, y, cable(y)] as V3)),
  [x, YM + 9, lower(YM) - 3],
]
for (const x of CABLES) {
  tube(steelLow, cablePath(x, 30), CABLE_R, 5)
  tube(steelDetail, cablePath(x, 8), CABLE_R, 8)
}

// Suspenders: from each cable down to the floor beams, at every modelled bay.
for (const span of spans)
  for (const y of bays(span)) {
    if (Math.abs(Math.abs(y) - TY) < FACE + 6) continue
    for (const x of CABLES) {
      const z0 = road(y, Math.sign(x)) - UNDER + .6, z1 = cable(y) - CABLE_R * .5
      if (z1 - z0 > 1) rod(steelDetail, [x, y, z0], [x, y, z1], .16)
    }
  }

// Stays: 25 a fan, from the tower top to the deck 12–122 m out, every bay.
const STAYS = 25
for (const t of [-TY, TY])
  for (const dir of [-1, 1]) {
    const y0 = t + dir * FACE
    for (let i = 0; i < STAYS; i++) {
      const y = y0 + dir * (12 + i * BAY)
      if (y < YB || y > YM) continue
      const zTop = 79.4 + 2.6 * (i / (STAYS - 1))
      for (const x of CABLES) {
        const end = Math.abs(x) > IN ? road(y, Math.sign(x)) + TRUSS_UP - .5 : prom(y) - .5
        rod(steelDetail, [x, y0, zTop], [x, y, end], .18)
      }
    }
  }

// ---- Anchorages -------------------------------------------------------------------
// 3DEP bare-earth heights above the water (NAVD88 + 1.6), 5 m apart in this
// frame: rows along y from y0, columns across from x = -20.

const BROOKLYN_GROUND: GroundGrid = { y0: -622, x0: -20, step: 5, z: [
  [12.3, 12.4, 13.0, 12.9, 19.2, 19.1, 19.0, 12.9, 12.8],
  [12.1, 12.3, 12.6, 19.3, 19.2, 19.2, 13.1, 12.9, 12.8],
  [11.9, 12.1, 19.4, 19.4, 19.3, 13.6, 13.1, 12.7, 12.5],
  [11.7, 19.5, 19.5, 19.5, 15.0, 13.4, 12.4, 11.9, 12.4],
  [19.7, 19.5, 19.7, 16.2, 13.6, 11.9, 11.6, 11.2, 12.2],
  [19.9, 19.7, 17.2, 13.8, 11.7, 11.5, 11.2, 10.8, 12.0],
  [20.0, 14.9, 14.0, 11.4, 11.4, 11.2, 11.1, 10.9, 11.9],
  [14.5, 14.3, 11.2, 11.2, 11.1, 11.0, 10.9, 10.8, 11.5],
  [13.8, 11.1, 10.9, 10.9, 10.9, 10.8, 10.8, 10.7, 11.3],
  [10.8, 10.7, 10.7, 10.7, 10.6, 10.6, 10.6, 10.6, 11.0],
  [10.6, 10.9, 10.8, 10.7, 10.7, 10.5, 10.5, 10.4, 10.8],
  [10.5, 10.8, 10.7, 10.6, 10.5, 10.5, 10.4, 10.3, 10.5],
  [10.5, 10.6, 10.5, 10.5, 10.4, 10.4, 10.3, 10.2, 10.2],
  [10.4, 10.5, 10.5, 10.4, 10.4, 10.3, 10.2, 10.0, 10.0],
  [10.3, 10.5, 10.5, 10.4, 10.2, 10.1, 9.9, 9.8, 9.8],
  [10.3, 10.6, 10.5, 10.3, 10.2, 10.0, 9.8, 9.6, 9.6],
  [10.1, 10.4, 10.3, 10.2, 10.1, 10.0, 9.8, 9.7, 9.5],
  [10.0, 10.1, 10.0, 9.8, 9.7, 9.6, 9.4, 9.3, 9.1],
  [9.7, 10.1, 10.0, 9.8, 9.7, 9.5, 9.3, 9.2, 8.9],
  [9.6, 9.9, 9.7, 9.7, 9.5, 9.3, 9.1, 9.0, 8.9],
  [9.5, 9.3, 9.2, 9.1, 9.0, 8.9, 8.8, 8.7, 8.8],
] }

const MANHATTAN_GROUND: GroundGrid = { y0: 524, x0: -20, step: 5, z: [
  [5.1, 5.1, 5.2, 5.2, 5.3, 5.4, 5.6, 5.7, 5.9],
  [5.3, 5.4, 5.5, 5.7, 5.8, 6.0, 6.1, 6.3, 6.1],
  [6.4, 5.6, 5.8, 5.9, 6.0, 6.2, 6.3, 6.5, 6.5],
  [6.8, 5.9, 6.0, 6.2, 6.4, 6.6, 6.8, 7.0, 6.8],
  [6.9, 6.1, 6.2, 6.2, 6.3, 6.4, 6.5, 6.6, 6.9],
  [7.1, 6.4, 6.5, 6.6, 6.6, 6.8, 6.8, 6.9, 7.0],
  [7.0, 6.7, 6.7, 6.8, 6.9, 7.0, 7.1, 7.2, 7.2],
  [7.5, 7.1, 7.2, 7.2, 7.2, 7.2, 7.3, 7.4, 7.4],
  [7.7, 7.6, 7.6, 7.6, 7.6, 7.6, 7.6, 7.7, 7.6],
  [7.7, 7.9, 8.0, 8.0, 8.1, 8.1, 8.1, 8.1, 8.3],
  [7.8, 7.9, 8.1, 8.2, 8.3, 8.5, 8.6, 8.4, 9.3],
  [7.9, 8.1, 8.2, 8.4, 8.5, 8.6, 8.6, 8.7, 9.1],
  [8.0, 8.3, 8.4, 8.5, 8.5, 8.6, 8.6, 8.5, 8.9],
  [8.1, 8.5, 8.6, 8.6, 8.7, 8.7, 8.7, 8.7, 8.8],
  [8.3, 8.7, 8.7, 8.7, 8.7, 8.7, 8.7, 8.7, 8.7],
] }

const AW = 17.2 // anchorage half-width (OSM, 34.3 m)

/**
 * An anchorage: a masonry block from its river face at `y0` back to `y1`,
 * walls footed on the ground grid, its top just under the map's approach
 * roadway (`top`), with corner piers, a cornice, and blind arches on the
 * river face and along the sides.
 */
function anchorage(y0: number, y1: number, ground: GroundGrid, topAt: (y: number) => number) {
  const g = (x: number, y: number) => groundAt(ground, x, y)
  const dir = Math.sign(y1 - y0)
  const t = (_x: number, y: number) => topAt(y)
  const front: V3 = [0, -dir, 0], back: V3 = [0, dir, 0]
  footedWall(stone, [-AW, y0], [AW, y0], g, t, front)
  footedWall(stone, [-AW, y1], [AW, y1], g, t, back)
  for (const s of [-1, 1]) footedWall(stone, [s * AW, y0], [s * AW, y1], g, t, [s, 0, 0])
  // The top, in strips along the bridge so it follows a sloping approach.
  const ys = stations(y0, y1, 6)
  band(roof, -AW, AW, ys, (y) => topAt(y), (y) => topAt(y), { top: true })

  const P = 0.5   // pier and cornice projection
  const CORN = 1.6 // cornice depth below the top
  // Corner piers on the river face, rusticated in the photo: plain proud blocks here.
  const pierTop = (_x: number, y: number) => topAt(y) - CORN
  for (const s of [-1, 1]) {
    const xo = s * (AW + P), xi = s * (AW - 3.2), yf = y0 - dir * P, yb = y0 + dir * 3.2
    footedWall(stone, [xi, yf], [xo, yf], g, pierTop, front)
    footedWall(stone, [xo, yf], [xo, yb], g, pierTop, [s, 0, 0])
    footedWall(stone, [xi, yf], [xi, y0], g, pierTop, [-s, 0, 0])
    footedWall(stone, [s * AW, yb], [xo, yb], g, pierTop, back)
  }
  // Cornice: a proud band round the top.
  const c0 = (y: number) => topAt(y) - CORN, c1 = (y: number) => topAt(y) - .3
  band(trim, -AW - P, AW + P, [y0 - dir * P, y0], () => c1(y0), () => c0(y0))
  for (const s of [-1, 1]) band(trim, s * AW, s * (AW + P), ys, c1, c0, { out: true, top: true, bottom: true })

  // Blind arches: flush panels in the curtain's shade, round-headed.
  const arch = (cx: number, cy: number, w: number, z0: number, z1: number, n: V3, along: boolean) => {
    const pts: V3[] = []
    const r = w / 2, spring = z1 - r
    if (spring - z0 < 1) return
    const at = (u: number, z: number): V3 => (along ? [cx + n[0] * .04, cy + u, z] : [cx + u, cy + n[1] * .04, z])
    pts.push(at(-r, z0), at(r, z0))
    for (let i = 0; i <= 8; i++) {
      const a = (Math.PI * i) / 8
      pts.push(at(r * Math.cos(a), spring + r * Math.sin(a)))
    }
    // A fan from the middle of the sill: the outline is convex.
    const c = at(0, z0)
    const ring = pts
    for (let i = 1; i < ring.length - 1; i++) {
      const [a, b] = [ring[i], ring[i + 1]]
      const ok = dot(cross(sub(a, c), sub(b, c)), n) >= 0
      curtain.tri(c, ok ? a : b, ok ? b : a, undefined, undefined, undefined, [n, n, n])
    }
    // Close the left side back to the sill.
    const ok = dot(cross(sub(ring[ring.length - 1], c), sub(ring[0], c)), n) >= 0
    curtain.tri(c, ok ? ring[ring.length - 1] : ring[0], ok ? ring[0] : ring[ring.length - 1], undefined, undefined, undefined, [n, n, n])
  }
  const archTop = (y: number) => topAt(y) - CORN - 2.5
  const foot = (x: number, y: number) => g(x, y) + 2
  for (const s of [-1, 1]) arch(s * 7.6, y0 - dir * .01, 9.5, foot(s * 7.6, y0), archTop(y0), front, false)
  const len = Math.abs(y1 - y0), n = Math.max(2, Math.round(len / 19))
  for (const s of [-1, 1])
    for (let i = 0; i < n; i++) {
      const cy = y0 + dir * (len * (i + .5)) / n
      arch(s * (AW + .01), cy, Math.min(11, len / n - 4), foot(s * AW, cy), archTop(cy), [s, 0, 0], true)
    }
}

// Their roofs stay 0.4 m under the lower of the map's two roadways over them.
anchorage(YB, BACK_B, BROOKLYN_GROUND, (y) => lower(y) - .4)
anchorage(YM, BACK_M, MANHATTAN_GROUND, (y) => lower(y) - .4)

// ---- Night lights ------------------------------------------------------------------
// The necklace: 166 lights on the cables (NYC DOT), on the two outer cables
// only in every night photo, so 83 a cable, about 13 m apart, spread evenly
// from anchorage to anchorage. Each sits on top of its cable. The low model
// keeps every third, larger, so it reads from far off.
const NECKLACE = 83
const lamps = new Part(), lampsLow = new Part()
const cableTop = (x: number): V3[] => spans.flatMap(([a, b]) => stations(a, b, 4).map((y) => [x, y, cable(y) + CABLE_R] as V3))
for (const x of [CABLES[0], CABLES[3]]) {
  // Per span, by its share of the cable's length, so none hangs in a tower.
  const runs = spans.map(([a, b]) => cableTop(x).filter(([, y]) => y >= a && y <= b))
  const length = (r: V3[]) => r.slice(1).reduce((n, p, i) => n + Math.hypot(...sub(p, r[i])), 0)
  const total = runs.reduce((n, r) => n + length(r), 0)
  const counts = runs.map((run) => Math.round((NECKLACE * length(run)) / total))
  counts[1] = NECKLACE - counts[0] - counts[2]
  runs.forEach((run, i) => {
    along(run, counts[i]).forEach((p, k) => {
      bead(lamps, p, 0.75)
      if (k % 3 === 1 + (i % 2)) bead(lampsLow, p, 3.2, true)
    })
  })
}

// Promenade lanterns: a cast-iron post with a lantern on each railing, every
// 15 bays (69 m) a side, the two sides staggered by half that, half a bay off
// the suspenders and clear of the inner cables where they cross lantern height.
const POST = 3.6, LANTERN = .6
const posts = new Part()
for (const span of walkSpans)
  for (const s of [1, -1]) {
    const x = s * IN
    for (const y of stations(span[0], span[1], BAY * 15).slice(1, -1).map((y) => y + BAY / 2 + (s > 0 ? BAY * 7.5 : 0))) {
      const head: V3 = [x, y, prom(y) + POST + .5]
      if (y >= span[1] - 4 || Math.abs(cable(y) - head[2]) < LANTERN + CABLE_R + .5) continue
      rod(posts, [x, y, innerTop(y)], [x, y, prom(y) + POST], .12, 4)
      bead(lamps, head, LANTERN)
    }
  }

// The towers' floodlights: 56 LED fixtures since January 2024 (NYC DOT),
// lighting every face. Where they stand isn't published; the wash here is
// brightest at the roadway and fades toward the cornice, the lower block a
// little dimmer from the water up. Faces looking down (arch soffits) catch
// it fully, faces looking up hardly at all. Nothing else is floodlit.
const floodlit = (reach: number) => (p: V3, n: V3): number => {
  const d = Math.min(Math.abs(p[1] - TY), Math.abs(p[1] + TY))
  if (d > reach || Math.abs(p[0]) > EX + 1) return 0
  const height = p[2] >= DECK0
    ? 1 - 0.7 * Math.min(1, (p[2] - DECK) / (CAP - DECK))
    : 0.55 + 0.25 * (p[2] / DECK0)
  const facing = n[2] > 0.7 ? 0.3 : Math.abs(n[0]) > Math.abs(n[1]) && n[2] > -0.5 ? 0.85 : 1
  return height * facing
}
// The masonry ends at the towers' plinths; the soffit's arches end short of
// where the deck's underside meets the tower.
const floodlight = floodlit(FACE + .05)

// The roadway lamps, on the outer trusses over each roadway, would be a
// speckle of dots at map scale; what they show from off the bridge is the
// outer trusses lit warm from inside, so that is drawn instead.
const roadwayLit = (p: V3): number => {
  const s = Math.sign(p[0]) || 1
  if (Math.abs(Math.abs(p[0]) - OUT) > .6) return 0
  const r = road(p[1], s)
  return p[2] > r - UNDER - .1 && p[2] < r + TRUSS_UP + .1 ? .5 : 0
}

// ---- Write -----------------------------------------------------------------------

tower(-TY)
tower(TY)

// Colours from daylight photos: the towers' warm buff granite and limestone,
// the cornice a touch paler, the curtain and blind arches a touch deeper,
// the shadowed soffits; the steel's buff paint, pulled to the palette, which
// the tower tops and the promenade's boards share. Lamps are their fixtures'
// paint, the steel's, by day and glow at night.
const STEEL = 0xb9a78f
const masonry = [
  { part: stone, material: { name: 'granite', color: 0xd2c2ab, floodlight } },
  { part: curtain, material: { name: 'curtain-wall', color: 0xc3b19a, floodlight } },
  { part: trim, material: { name: 'limestone-trim', color: 0xdcd0bd, floodlight } },
]
const SOFFIT = { name: 'soffit', color: 0x857766, floodlight: floodlit(LD + .2) }
const LAMP = { name: 'lamp', color: STEEL }
const low = [
  ...masonry,
  { part: soffit, material: SOFFIT },
  { part: merged(steelLow, roof, walk), material: { name: 'bridge-steel', color: STEEL, floodlight: roadwayLit } },
  { part: lampsLow, material: LAMP },
]
const detail = [
  ...masonry,
  { part: merged(soffit, soffitDetail), material: SOFFIT },
  { part: merged(steelDetail, webDetail, roof, walkDetail, posts), material: { name: 'bridge-steel', color: STEEL, doubleSided: true, floodlight: roadwayLit } },
  { part: lamps, material: LAMP },
]

const extras = {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the towers, on the water',
  bearing: 316.18, elevation: 0, towers: [-TY, TY], anchorageFaces: [YB, YM],
  roadwayMidspan: MAIN(0), roadwayAtTowers: TOWER_ROAD, roadwayEnds: [[road(YB, -1), road(YB, 1)], [road(YM, -1), road(YM, 1)]],
  promenadeMidspan: prom(0),
}
const count = (list: { part: Part }[]) => list.reduce((n, { part }) => n + part.triangles, 0)
for (const [file, list, maxTris, maxBytes] of [
  ['nyc-brooklyn-bridge.glb', low, 6500, 250 * 1024],
  ['nyc-brooklyn-bridge.detail.glb', detail, 40000, 1536 * 1024],
] as const) {
  const tris = count(list)
  if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
  const glb = writeGlb('Brooklyn Bridge', [...list], extras)
  if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
