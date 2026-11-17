/**
 * Fred Hartman Bridge (1995; Greiner Engineering), SH 146 over the Houston
 * Ship Channel between La Porte and Baytown — procedural, CC0-1.0.
 * bun generators/hou-fred-hartman-bridge.ts
 *
 * The cable-stayed unit as one placement: twin parallel bridges, each with
 * two diamond-shaped concrete towers, two inclined planes of yellow stays
 * a side, and its steel edge girders, from the back-span end pier on the
 * La Porte side to the one on the Baytown side. Writes a low model (towers,
 * deck girders, end piers, the stays as translucent yellow fans edged by
 * their outermost and innermost stays) and a detail model (every stay as
 * its own cable), which a map draws from detailZoom up.
 *
 * Frame: x across the bridges (+x toward the south-east deck), y along
 * them toward Baytown (north-east), z up, metres; origin midway between the
 * four towers, on the water. Placed at bearing 47, the line through the
 * towers of each deck (lidar). The map owns the roadways: nothing here is a
 * slab at road level. The edge girders and parapets stand along each deck's
 * edges, the floor's underside hangs between them, and the tops stay open.
 *
 * Height. z = 0 is the channel's water (lidar water returns 0.27-0.35 m
 * NAVD88; 3DEP DEM water ~0.3 m above its lowest cell). Roadway, from
 * lidar (lower quartile of the deck returns, NAVD88 - 0.3): 58.1 m at
 * midspan, 55.8 m at the towers, 54.1 m at y = +/-255, 51.0 m at the end
 * piers; a vertical curve 58.1 - 6.25e-5 y^2 fits every station to 0.3 m
 * on both sides. The OSM outline records no height; these are the heights
 * to give the map's decks.
 *
 * Feet. The La Porte (south-west) towers stand on two overlapping round
 * pier caps in the water, about 60 m across together 90 m (NAIP; the DEM
 * reads their tops 4.4 m above the water), drawn from z = 0 to 4.4. The
 * Baytown towers and both end piers stand on land and run down to the DEM
 * vertex by vertex, from 15 m tables of Mapterhorn/3DEP heights above its
 * water read in this frame (SW_GROUND, NE_GROUND).
 *
 * Sources:
 * - OSM: the bridge relation/9853953 (type=bridge, wikidata Q4115158) and
 *   the man_made=bridge outline way/1303601727 (layer 1), which runs the
 *   whole 3.3 km from the SH 225 interchange to Baytown, approach viaducts
 *   included. No tower or pier is mapped.
 * - Lidar: USGS 3DEP TX_Coastal_B1_2018 (flown 2018), 1 m grids over the
 *   main span (480 m) and both back-span ends: tower tops 136.2/134.9 m
 *   NAVD88 (masts) and 130.0/129.5 (sparser returns), 381 m apart along
 *   each deck, the two decks' towers 29.7 m apart across, staggered 2-3 m
 *   along the axis (drawn in line); decks 26 m wide each, a 4 m gap between
 *   them; stay planes 2 m inside each deck's edges; the last back stays
 *   about 132 m beyond the towers; the roadway profile above.
 * - Published (Wikipedia "Fred Hartman Bridge"; TxDOT): cable-stayed, main
 *   span 1,250 ft (381 m), towers 440 ft (134 m), opened 1995, twin
 *   bridges of four lanes each.
 * - USGS NAIP orthophoto (public domain): the plan, the round pier caps,
 *   the deck edges and gap.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Fred Hartman Bridge Houston.jpg", PA2 James Dillard, US Coast Guard,
 *     public domain: aerial from the west; diamond towers, the round cap,
 *     the green edge girders, the yellow stays in inclined planes.
 *     https://commons.wikimedia.org/wiki/File:Fred_Hartman_Bridge_Houston.jpg
 *   - "Fred Hartman Bridge, Baytown, Texas 1209261519.jpg", Patrick Feller,
 *     CC BY 2.0: broadside from the south-east; the diamond legs meeting
 *     at the foot and the apex, the back spans without intermediate piers.
 *     https://commons.wikimedia.org/wiki/File:Fred_Hartman_Bridge,_Baytown,_Texas_1209261519.jpg
 *   - "The Fred Hartman Bridge in Baytown, Texas LCCN2013650808.tif", Carol
 *     M. Highsmith, public domain: from the deck; the legs' section, the
 *     stay anchorages along the upper legs, the yellow stay pipes.
 *     https://commons.wikimedia.org/wiki/File:The_Fred_Hartman_Bridge_in_Baytown,_Texas_LCCN2013650808.tif
 *   - "Fred Hartman Bridge on Hwy. 146.jpg", Roy Luck, CC BY 2.0: the deck's
 *     green underside and the strut under it in the diamond.
 *     https://commons.wikimedia.org/wiki/File:Fred_Hartman_Bridge_on_Hwy._146.jpg
 *   - "Fred Hartman Bridge.JPG", Sam at English Wikipedia, CC BY-SA 3.0
 *     https://commons.wikimedia.org/wiki/File:Fred_Hartman_Bridge.JPG
 *   - "Fred Hartman Bridge Baytown Texas.jpg", Baytownbert, CC BY-SA 3.0
 *     https://commons.wikimedia.org/wiki/File:Fred_Hartman_Bridge_Baytown_Texas.jpg
 *
 * Estimated from the photos, scaled by the lidar:
 * - each diamond: legs 3 m either side of the tower's centre at the foot,
 *   14.8 m at the deck (they pass the deck's edges), meeting at 124 m under
 *   a solid head to 134 m; legs 4.4 m across and 5.0 m along the bridge
 *   (rework: Highsmith's deck photo puts a leg at about 4.2 m across against
 *   the A's spread, and Roy Luck's end view at about 4.3 m); a strut under
 *   the deck between the legs;
 * - 12 stays per fan (each tower has four fans: two planes, main and back
 *   side), anchored on the upper legs from 92 to 122 m; on the deck from
 *   14 m off the tower to 15 m short of midspan, and to 132 m out on the
 *   back span. The real count may differ by a few; the stays are drawn
 *   0.64 m thick in the detail model, about three times the real pipes;
 * - the edge girders 2.35 m deep, the parapets 1.0 m;
 * - the back-span end piers at y = +/-333 m (12 m past the last stays,
 *   where the land starts on both sides; no drawing found), a column a deck
 *   under a cap beam.
 * - Colour: the towers' pale concrete; the edge girders' green and the
 *   underside's darker teal-green from the photos, pulled to the palette's
 *   lightness; the stays' yellow (the batch notes said white: every photo
 *   shows the stay pipes painted yellow).
 *
 * Doubts:
 * - replaces is empty. The man_made=bridge outline covers the approach
 *   viaducts too (3.3 km); listing it would strip the map's piers from
 *   2.6 km of approach this model doesn't draw. Without it the map may
 *   draw its own piers and parapets along the cable-stayed unit as well.
 * - Night: no open night photo was found, so nothing is lit.
 * - The towers of the two decks are drawn in line; lidar puts them 2-3 m
 *   apart along the axis. The diamonds' feet below the deck and the stay
 *   count are read from photos, not drawings.
 * - Terrain (tools/terrain.ts check, map with the footprint fill): ok.
 *
 * Rework (user review: "a thin yellow vertical sliver" in the sheet's SW
 * view). The sheet looks from the south-west, 35 degrees up; at bearing 47
 * that is straight down the span, so a 670 m bridge 56 m wide is drawn as a
 * tall narrow column with the four diamonds stacked inside it. That is the
 * honest geometry of the sheet view for this bridge, not a modelling fault;
 * broadside (from 137 or 317) and in the oblique photo views the model reads.
 * Compared broadside with "Fred Hartman Bridge.JPG" (Sam, from the San
 * Jacinto Monument to the NW, about 310) and obliquely with Feller's (from
 * about 68, ENE), Roy Luck's (about 212, SSW, low), the Coast Guard aerial
 * (about 200, 15 degrees up) and Highsmith's deck view. The diamonds, the
 * two inclined stay planes per tower, the deck profile and the round La
 * Porte pier caps all matched; what differed and changed:
 * - the legs were thin and grey against the photos' broad white concrete:
 *   now 4.4 x 5.0 m (was 3.4 x 4.2), the concrete a whiter #eceae2 (was
 *   #e6e4dc), WIDE_X 14.8 (was 14.3) so the legs' inner faces stay outside
 *   the decks' edges;
 * - the stay fans were faint at 80 px broadside: the veil opacity 0.3 (was
 *   0.22), the yellow more saturated (#e6cf3a, was #dccf5e, from the USCG
 *   and Highsmith photos), the four drawn stays per fan in the low model
 *   1.1 m thick (was 0.9).
 * The deck edge (2.35 m green girder under a 1 m pale parapet) already
 * matched Luck's and the USCG photos and is unchanged. Remaining
 * differences: the low model's fans read as yellow sheets where the photos
 * show separate lines (pale in haze); the two decks' towers stand in line
 * (lidar staggers them 2-3 m); the head's opening under the apex
 * (Highsmith) is not drawn.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { band, groundAt, merged, rod, stations, type GroundGrid } from './bridge-kit'
import { beam, box, countParts, loftSolid, one, prism } from './sf-golden-gate-bridge'
import { finish } from './palette'

// ---- Layout ------------------------------------------------------------------

const DECKS = [-14.5, 14.5]       // deck centre lines, x
const HALF = 13.0                 // half a deck's width (lidar: 26 m)
const TOWERS = [-190.5, 190.5]    // tower centre lines, y (main span 381 m)
const END = 333                   // back-span end piers
const STAY_X = 11.0               // stay planes' offset from the deck centre at the deck

/** The roadway above the water, m (lidar vertical curve). */
const road = (y: number) => 58.1 - 6.25e-5 * y * y

// 3DEP/Mapterhorn heights above the water, 15 m apart in this frame: rows
// along y from y0, columns across x from -45.
const SW_GROUND: GroundGrid = { y0: -360, x0: -45, step: 15, z: [
  [2.6, 2.4, 2.7, 2.8, 2.7, 2.8, 3.4], [2.5, 2.5, 2.5, 2.5, 2.7, 2.9, 3.1], [2.3, 2.5, 2.5, 2.7, 2.9, 3.1, 3.3],
  [0.2, 0.0, 0.0, 0.0, 0.3, 0.0, 0.8], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
] }
const NE_GROUND: GroundGrid = { y0: 150, x0: -45, step: 15, z: [
  [1.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [2.4, 2.5, 2.3, 2.4, 2.8, 2.8, 0.8], [3.7, 3.4, 2.9, 2.9, 2.9, 2.9, 3.2],
  [1.8, 2.9, 3.3, 3.0, 3.3, 2.8, 3.0], [1.8, 2.7, 2.8, 2.8, 2.8, 2.7, 1.8], [1.8, 2.8, 2.8, 2.8, 2.7, 2.6, 1.8],
  [1.8, 2.7, 2.8, 2.8, 2.7, 2.7, 1.8], [1.8, 1.9, 2.8, 3.0, 2.9, 2.6, 1.8], [1.8, 1.9, 2.8, 3.0, 3.0, 2.6, 1.8],
  [1.8, 1.8, 2.8, 3.0, 3.0, 2.5, 1.8], [1.8, 1.9, 2.8, 2.9, 2.9, 2.6, 1.8], [1.8, 1.9, 2.8, 2.9, 2.9, 2.6, 1.8],
  [1.8, 2.5, 2.9, 2.9, 2.8, 2.6, 1.8], [1.8, 2.1, 2.6, 2.5, 2.8, 2.9, 1.9], [1.8, 2.5, 2.4, 2.1, 2.7, 2.5, 1.8],
] }
const CAP_TOP = 4.4               // the La Porte towers' round pier caps
const ground = (x: number, y: number) =>
  y < 0 ? (y > -300 ? CAP_TOP : groundAt(SW_GROUND, x, y)) : groundAt(NE_GROUND, x, y)

// ---- Parts -------------------------------------------------------------------

const concrete = new Part()   // towers, piers, pier caps, parapets
const girder = new Part()     // green edge girders
const soffit = new Part()     // the floor's underside
const fan = new Part()        // low model: translucent stay fans
const edgeStays = new Part()  // low model: each fan's first and last stay
const stays = new Part()      // detail model: every stay

// ---- Towers ------------------------------------------------------------------

const APEX = 124, TOP = 134
const LEG_W = 4.4, LEG_T = 5.0
const FOOT_X = 3.0, WIDE_X = 14.8

/** One diamond tower at (xc, yt). Returns the stay anchor on each leg at height z. */
function tower(xc: number, yt: number) {
  const C = one(concrete)
  const wideZ = road(yt) - 2.8
  for (const s of [-1, 1]) {
    const footX = xc + s * FOOT_X, footZ = ground(footX, yt)
    const foot: V3 = [footX, yt, footZ - 0.3]
    const wide: V3 = [xc + s * WIDE_X, yt, wideZ]
    const apex: V3 = [xc + s * 0.9, yt, APEX + 1]
    beam(C, foot, [wide[0] + s * 0.25, yt, wide[2] + 0.4], LEG_W, LEG_T)
    beam(C, [wide[0] + s * 0.25, yt, wide[2] - 0.4], apex, LEG_W, LEG_T)
  }
  // The strut under the deck, between the legs.
  box(C, xc - WIDE_X + 1, xc + WIDE_X - 1, yt - 1.8, yt + 1.8, wideZ - 2.2, wideZ, { r: 0, bottom: true })
  // The head: the legs merged into one block, tapering to the top.
  const ring = (hx: number, hy: number, z: number): V3[] => [[xc - hx, yt - hy, z], [xc + hx, yt - hy, z], [xc + hx, yt + hy, z], [xc - hx, yt + hy, z]]
  loftSolid(C, [ring(3.0, 2.0, APEX - 3), ring(2.2, 2.0, TOP - 0.6), ring(1.7, 1.6, TOP)])
  // A pile cap under each Baytown foot pair (the La Porte ones stand on the round caps).
  if (yt > 0) {
    const plan: [number, number][] = [[xc - 6, yt - 5], [xc + 6, yt - 5], [xc + 6, yt + 5], [xc - 6, yt + 5]]
    const g = Math.min(...plan.map(([x, y]) => ground(x, y)))
    prism(C, plan, g - 0.2, g + 1.6)
  }
  /** Where a stay meets the leg on side s at height z (on the leg's inner face). */
  return (s: number, z: number): V3 => [xc + s * (WIDE_X * (APEX - z) / (APEX - wideZ) - LEG_W / 2), yt, z]
}

// The La Porte towers' round pier caps: two overlapping 60 m discs under
// the two towers, drawn as one capsule, in the water from z = 0.
{
  const R = 30, n = 12, yt = TOWERS[0], [xa, xb] = DECKS
  const plan: [number, number][] = []
  for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + (Math.PI * i) / n; plan.push([xb + R * Math.cos(a), yt + R * Math.sin(a)]) }
  for (let i = 0; i <= n; i++) { const a = Math.PI / 2 + (Math.PI * i) / n; plan.push([xa + R * Math.cos(a), yt + R * Math.sin(a)]) }
  prism(one(concrete), plan, 0, CAP_TOP, false)
}

// ---- Stays -------------------------------------------------------------------

const N_STAYS = 12, Z_LOW = 92, Z_HIGH = 122
for (const xc of DECKS)
  for (const yt of TOWERS) {
    const anchor = tower(xc, yt)
    const toMid = -Math.sign(yt)
    for (const s of [-1, 1])
      for (const [dir, near, far] of [[toMid, 14, Math.abs(yt) - 15], [-toMid, 14, 132]] as [number, number, number][]) {
        const line: [V3, V3][] = []
        for (let k = 0; k < N_STAYS; k++) {
          const z = Z_LOW + ((Z_HIGH - Z_LOW) * k) / (N_STAYS - 1)
          const y = yt + dir * (near + ((far - near) * k) / (N_STAYS - 1))
          const top = anchor(s, z)
          const deck: V3 = [xc + s * STAY_X, y, road(y) + 0.6]
          line.push([top, deck])
          rod(stays, top, deck, 0.32, 4)
        }
        // The fan: a ruled sheet between consecutive stays, double-sided.
        for (let k = 0; k < N_STAYS - 1; k++) {
          const [t0, d0] = line[k], [t1, d1] = line[k + 1]
          fan.tri(t0, d0, d1); fan.tri(t0, d1, t1)
        }
        for (const k of [0, 4, 8, N_STAYS - 1]) rod(edgeStays, line[k][0], line[k][1], 0.55, 3)
      }
  }

// ---- Deck --------------------------------------------------------------------

const ys = stations(-END - 2, END + 2, 22)
for (const xc of DECKS) {
  for (const s of [-1, 1]) {
    const edge = xc + s * HALF
    // Edge girder: its outer face is the green fascia.
    band(girder, edge - s * 0.9, edge, ys, (y) => road(y) - 0.25, (y) => road(y) - 2.6, { out: true, in: true, bottom: true, ends: true })
    // Parapet on the girder, standing beside the map's roadway.
    band(concrete, edge - s * 0.45, edge, ys, (y) => road(y) + 1.0, (y) => road(y) - 0.25, { out: true, in: true, top: true, ends: true })
  }
  // The floor's underside between the girders, facing down.
  band(soffit, xc - HALF + 0.9, xc + HALF - 0.9, ys, (y) => road(y) - 0.4, (y) => road(y) - 1.7, { bottom: true })
}

// ---- End piers -----------------------------------------------------------------

for (const y of [-END, END])
  for (const xc of DECKS) {
    const capTop = road(y) - 2.6, capBot = capTop - 2.0
    box(one(concrete), xc - HALF + 0.5, xc + HALF - 0.5, y - 1.6, y + 1.6, capBot, capTop, { r: 0.3 })
    const plan: [number, number][] = [[xc - 2.5, y - 1.5], [xc + 2.5, y - 1.5], [xc + 2.5, y + 1.5], [xc - 2.5, y + 1.5]]
    const g = Math.min(...plan.map(([x, yy]) => ground(x, yy)))
    prism(one(concrete), plan, g - 0.2, capBot, false)
  }

// ---- Write -----------------------------------------------------------------------

const CONCRETE = finish('tower-concrete', 0xeceae2)
const GREEN = finish('girder-green', 0x6aa97c, 0.6)
const UNDER = finish('deck-underside', 0x5f927c)
const YELLOW = finish('stay-yellow', 0xe6cf3a, 0.5)
const VEIL = { ...finish('stay-fan', 0xe6cf3a, 0.5), opacity: 0.3, doubleSided: true }

const low = [
  { part: concrete, material: CONCRETE },
  { part: girder, material: GREEN },
  { part: soffit, material: UNDER },
  { part: edgeStays, material: YELLOW },
  { part: fan, material: VEIL },
]
const detail = [
  { part: concrete, material: CONCRETE },
  { part: girder, material: GREEN },
  { part: soffit, material: UNDER },
  { part: merged(stays), material: YELLOW },
]
const extras = {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the towers, on the water',
  bearing: 47, elevation: 0, towers: TOWERS, decks: DECKS, ends: [-END, END],
  roadwayMidspan: road(0), roadwayAtTowers: road(TOWERS[1]), roadwayEnds: road(END),
}
for (const [file, list, maxTris, maxBytes] of [
  ['hou-fred-hartman-bridge.glb', low, 5000, 250 * 1024],
  ['hou-fred-hartman-bridge.detail.glb', detail, 40000, 1536 * 1024],
] as const) {
  const tris = countParts([...list])
  if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
  const glb = writeGlb('Fred Hartman Bridge', [...list], extras)
  if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
  await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
  console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
}
