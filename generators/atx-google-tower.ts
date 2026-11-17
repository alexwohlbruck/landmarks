/**
 * Google Tower (Block 185, "Sail Tower"), 601 W 2nd St, Austin (2022, Pelli
 * Clarke Pelli Architects) — original procedural geometry, CC0-1.0.
 * bun generators/atx-google-tower.ts
 *
 * Identity check: OSM node/12714844121 (office=company, brand Google) lies
 * inside way/961789209, name "Block 185", alt_name "Google Tower", 35 levels,
 * height 181.05, architect Pelli Clarke Pelli (also Wikipedia's infobox; the
 * brief's "Pickard Chilton" does not match either source). Wikipedia
 * ("Block 185"): also known as Sail Tower; Google leases the whole building.
 * The photos below are all of this tower (the curved west sail over Shoal
 * Creek, terraces toward Lady Bird Lake). The 2019 photo "Google Tower
 * Austin, Texas.jpg" on Commons shows a different, older Google building
 * (500 W 2nd St, with the "G" logo) and is not used.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.7: the model's axes follow Austin's street grid
 * (2nd Street and Cesar Chavez run along x, Nueces Street along y). Anchor =
 * area centroid of way/961789209, -97.7504255, 30.2655650.
 *
 * Form (from the photos and the aerial):
 *  1. The west face over Shoal Creek is a smooth light glass "sail" with
 *     white vertical fins. It leans back to the east as it rises (it is
 *     seen from above in the NAIP aerial, and leans in every photo from the
 *     south) and its south edge sweeps up in a concave curve from the
 *     ground at Cesar Chavez to the peak, with a white blade running up
 *     that edge and past the peak.
 *  2. The south side steps back floor by floor in white-edged terraces
 *     facing Lady Bird Lake; the terrace fronts run east-west, so from the
 *     east the stepped edge climbs diagonally across the Nueces face.
 *  3. The north (2nd Street) and east (Nueces) faces are plain vertical
 *     blue glass to about 0.9 of the peak, under a sloped glass cap that
 *     rises west to the peak over the sail.
 * Drawn as tiers of one storey, each cut back to the terrace line (white
 * slab edge on every terrace front), a steep pyramid cap to the point, and
 * the sail as a 0.6 m glass sheet on a grid of 8 x 26 facets: bowed 2.6 m
 * toward the creek in plan, leaning back 12 m in section. The terraces
 * trail the sail's leading edge (16 m at the ground, nothing at the peak),
 * so low down the sail stands south of them as a free glass blade: the band
 * between the two diagonals in the east-south-east photos.
 *
 * Evidence:
 *  - plan: OSM way/961789209 in the turned frame (the west side's two small
 *    kinks are straightened, under 1 m).
 *  - NAIP (USGS, 0.17 m, after 2022): the terraces' east-west fronts, the
 *    stepped east edge and the sail face seen from above.
 *  - heights: published 594 ft = 181 m to the top (Wikipedia, "Block 185";
 *    OSM height 181.05), 35 storeys. The lidar (USGS 3DEP
 *    USGS_LPC_TX_Central_B1_2017, 2017 flight) predates the tower (the site
 *    was an empty lot) and is used only for the ground.
 *  - photo-scaled (from "pfl22", "cap10k", "lake", "ajay", "farbod1/2",
 *    "oleg1/2"): the peak 78% of the way up the west side from the south
 *    (the far west-south-west photo "pfl22" puts it close to the north
 *    end); the glass peak at
 *    174 m, the blade the rest; the north and east walls 0.9 of the peak;
 *    the sail curve z/H = t^1.25 (t the fraction of the way from the south
 *    end to the peak); the west face's lean, 12 m at the top, is estimated
 *    from the south-west photos and the aerial's lean.
 *  - ground: Mapterhorn falls from about 9.5 m (Nueces) to 6.8 m at the
 *    south-west corner on the creek bank; y = 0 is that low corner, and the
 *    street is taken as 3 m above it, so the published heights start at 3 m.
 *  - colours: the sail's silver-white glass and fins, the bluer glass on the
 *    north and east, the white terrace edges, all from the daylight photos.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  lake    "Block 185 from Lady Bird Lake.jpg", Pixelsandbacon, CC BY-SA 4.0
 *          (from the south, 2021) https://commons.wikimedia.org/wiki/File:Block_185_from_Lady_Bird_Lake.jpg
 *  ajay    "Block 185 - Austin, TX (54987420388).jpg", ajay_suresh, CC BY 4.0
 *          (from the south-west, 2025) https://commons.wikimedia.org/wiki/File:Block_185_-_Austin,_TX_(54987420388).jpg
 *  farbod1 "Block 185 Tower-Austin TX.jpg", Farbod Farbod, CC BY-SA 4.0
 *          (from the west, the rail bridge, 2023) https://commons.wikimedia.org/wiki/File:Block_185_Tower-Austin_TX.jpg
 *  farbod2 "Block 185-Austin TX-Sept 15 2023.jpg", Farbod Farbod, CC BY-SA 4.0
 *          https://commons.wikimedia.org/wiki/File:Block_185-Austin_TX-Sept_15_2023.jpg
 *  oleg1   "Downtown Austin skyline featuring Block 185 along Lady Bird Lake.jpg",
 *          Oleg Yunakov, CC BY-SA 4.0 (from the south-east, 2024)
 *          https://commons.wikimedia.org/wiki/File:Downtown_Austin_skyline_featuring_Block_185_along_Lady_Bird_Lake.jpg
 *  oleg2   "Downtown Austin skyline featuring the triangular Block 185 tower along Lady Bird Lake.jpg",
 *          Oleg Yunakov, CC BY-SA 4.0
 *  west    "Block 185 construction, west side 2021-08-10.jpg", Xnatedawgx,
 *          CC BY-SA 4.0 (the sail face's fins)
 *  ne      "Block 185 construction, NE corner 2021-08-10.jpg", Xnatedawgx,
 *          CC BY-SA 4.0 (the 2nd / Nueces corner)
 *  pfl22   "Downtown Austin from Pfluger Pedestrian Bridge, October 2022.jpg",
 *          Ryan (Flickr), CC BY-SA 4.0 (from the west-south-west, far)
 *  col22   "Downtown Austin, Texas from the Colorado River, October 2022.jpg",
 *          Ryan (Flickr), CC BY-SA 4.0
 *  cap10k  "Waiting for Cap10K to Start 2022.jpg", Larry D. Moore, CC BY 4.0
 *          (from the east-south-east, the terraces and the cap)
 *  sky23   "Austin Texas skyline, December 2023 - Day.jpg", Steve, CC BY-SA 2.0
 *  se22    "Austin Skyline from the Southeast 2022.jpg", Larry D. Moore, CC BY 4.0
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the terraces' notched corners are left out. The exact
 * position of the peak and the heights of the north corners are read off
 * oblique photos (a few metres either way). The west face's lean and
 * swoop are estimated; its bow in plan is estimated. The
 * glass cap's facets are reduced to one pyramid. No photo shows the north face squarely.
 * The lobby (recessed behind columns on 2nd and Nueces) is not drawn.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { save, type XY } from './atl-flatiron-building'

// ───────────────────────────── small shared kit ─────────────────────────────
// (also used by the other atx- towers of this batch)

export const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
export const add3 = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
export const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
export const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const unit3 = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
export const lerpXY = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

/** A triangle wound to face `out`. */
export function triOut(p: Part, a: V3, b: V3, c: V3, out: V3) {
  if (dot3(cross3(sub3(b, a), sub3(c, a)), out) < 0) p.tri(a, c, b)
  else p.tri(a, b, c)
}
export function quadOut(p: Part, a: V3, b: V3, c: V3, d: V3, out: V3) {
  triOut(p, a, b, c, out)
  triOut(p, a, c, d, out)
}

/** Clip a counter-clockwise ring to the half-plane n·p <= c. */
export function clipHalf(ring: XY[], n: XY, c: number): XY[] {
  const out: XY[] = []
  const f = (p: XY) => n[0] * p[0] + n[1] * p[1] - c
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], fa = f(a), fb = f(b)
    if (fa <= 0) out.push(a)
    if ((fa < 0 && fb > 0) || (fa > 0 && fb < 0)) out.push(lerpXY(a, b, fa / (fa - fb)))
  }
  return out.filter((p, i) => Math.hypot(p[0] - out[(i + 1) % out.length][0], p[1] - out[(i + 1) % out.length][1]) > 0.05)
}

/** A flat band standing `o` off a wall from a to b (outside to the right of a→b), z0..z1. */
export function wallBand(p: Part, a: XY, b: XY, z0: number, z1: number, o = 0.06, inset = 0) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 2 * inset + 0.2) return
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [t[1], -t[0], 0]
  const A: XY = [a[0] + t[0] * inset + n[0] * o, a[1] + t[1] * inset + n[1] * o], B: XY = [b[0] - t[0] * inset + n[0] * o, b[1] - t[1] * inset + n[1] * o]
  quadOut(p, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1], n)
}

// ───────────────────────────────── the tower ────────────────────────────────

if (import.meta.main) {
  const sail = new Part(), glass = new Part(), deck = new Part(), white = new Part(), fins = new Part()

  // Plan corners (OSM way/961789209 in the frame, simplified).
  const SW: XY = [-34.27, -38.64], SEa: XY = [25.07, -38.95], SEb: XY = [27.6, -33.0]
  const NE: XY = [28.08, 42.05], NW: XY = [-20.73, 41.64]

  const Z0 = 3 // street level above the model's base (the creek-bank corner)
  const TIP = Z0 + 181 // published top
  const H = Z0 + 174 // glass peak
  const VP = 0.78 // the peak, as a fraction of the west side from SW to NW
  const P = 1.25 // the sail edge's swoop
  const zNW = Z0 + 0.9 * 174 // the flat roof of the north and east walls
  const BASE = Z0 + 9 // the full-plate base (lobby and first office floors)
  const ST = 4.75 // storey

  // The sail: a curved glass surface over the west side. In plan it bows
  // out toward the creek (BOW at mid-length); in section it leans back to
  // the east, more steeply toward the top (LEAN at the peak).
  const BOW = 2.6, LEAN = 12
  const wd = unit3([NW[0] - SW[0], NW[1] - SW[1], 0]), wo: V3 = [-wd[1], wd[0], 0] // along the west side, and out of it
  const xoff = (z: number) => LEAN * Math.pow(Math.max(0, z) / H, 1.8)
  const S = (v: number, z: number, off = 0): V3 => {
    const q = lerpXY(SW, NW, v), d = BOW * Math.sin(Math.PI * v) - xoff(z) + off
    return [q[0] + wo[0] * d, q[1] + wo[1] * d, z]
  }
  // The leading edge: up the west side from SW to the peak, concave.
  const sailV = (z: number) => VP * Math.pow(Math.max(0, z / H), 1 / P)
  const sailZ = (v: number) => H * Math.pow(Math.min(1, v / VP), P)
  // the top edge, from the peak down to the north-west corner
  const topZ = (v: number) => (v <= VP ? sailZ(v) : H + ((zNW - H) * (v - VP)) / (1 - VP))
  // The terraces run east-west, but trail the sail's leading edge: low down
  // the sail stands well south of them as a free glass blade (LAG at the
  // ground, closing to nothing at the peak), which is the band between the
  // two diagonals in the east-south-east photos.
  const LAG = 16
  const yS = (z: number) => S(sailV(z), z)[1] + LAG * (1 - Math.min(1, z / H))

  // A floor plate at height z: the plan with the sail curve as its west
  // side, cut back on the south to the terrace line yS(z).
  const NB = 8
  const plate = (z: number): XY[] => {
    const west: XY[] = []
    for (let i = NB; i >= 0; i--) { const p = S(i / NB, z); west.push([p[0], p[1]]) }
    const ring: XY[] = [west[west.length - 1], SEa, SEb, NE, ...west.slice(0, -1)]
    return clipHalf(ring, [0, -1], -yS(z))
  }

  // Tiers of one storey, each set back to the terrace line at its top: the
  // fine stepped diagonal of white slab edges on the south.
  const levels = [0, BASE]
  for (let z = BASE + ST; z < zNW - 1; z += ST) levels.push(z)
  levels.push(zNW)
  const up: V3 = [0, 0, 1]
  for (let k = 0; k < levels.length - 1; k++) {
    const z0 = levels[k], z1 = levels[k + 1], ring = plate(z1)
    if (ring.length < 3) continue
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length], n = unit3([b[1] - a[1], a[0] - b[0], 0])
      if (n[0] * wo[0] + n[1] * wo[1] > 0.8) continue // behind the sail
      // terrace fronts (facing south): a white slab edge on every storey;
      // the plain north and east walls one every third storey
      const front = n[1] < -0.7, band = front || k % 3 === 0 || k === levels.length - 2
      const zb = front ? z1 - 1.1 : band ? z1 - 0.6 : z1
      quadOut(glass, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], zb], [a[0], a[1], zb], n)
      if (band) quadOut(white, [a[0], a[1], zb], [b[0], b[1], zb], [b[0], b[1], z1], [a[0], a[1], z1], n)
    }
    const tri = (A: XY, B: XY, C: XY) => triOut(deck, [A[0], A[1], z1], [B[0], B[1], z1], [C[0], C[1], z1], up)
    for (let i = 1; i < ring.length - 1; i++) tri(ring[0], ring[i], ring[i + 1])
  }

  // The glass cap: a steep pyramid over the west 16 m of the roof, rising to
  // the sharp point over the sail (the rest of the roof stays flat at 0.9 of
  // the peak, as the north-east corner does in the south-east photos).
  const apex = S(VP, H, -0.3)
  {
    const ring = clipHalf(plate(zNW), [1, 0], apex[0] + 16)
    const c: V3 = [ring.reduce((t, q) => t + q[0], 0) / ring.length, ring.reduce((t, q) => t + q[1], 0) / ring.length, zNW]
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      const A: V3 = [a[0], a[1], zNW], B: V3 = [b[0], b[1], zNW]
      const out = unit3(sub3(add3(add3(A, B), apex), add3(add3(c, c), [c[0], c[1], zNW - 40])))
      triOut(sail, A, B, apex, [out[0], out[1], Math.abs(out[2]) + 0.3])
    }
  }

  // The sail sheet, 0.6 m thick: a grid of NB strips across, between the
  // leading edge and the north-west corner, at each level.
  const T = 0.6, NZ = 26
  const zs = Array.from({ length: NZ + 1 }, (_, i) => (H * i) / NZ)
  const vN = (z: number) => (z <= zNW ? 1 : 1 - ((1 - VP) * (z - zNW)) / (H - zNW))
  for (const off of [0.05, -T]) {
    const out: V3 = off > 0 ? wo : [-wo[0], -wo[1], 0]
    for (let j = 0; j < NZ; j++) {
      const z0 = zs[j], z1 = zs[j + 1]
      // split the band at zNW so the top edge is followed exactly
      const cuts = z0 < zNW && z1 > zNW ? [z0, zNW, z1] : [z0, z1]
      for (let c = 0; c < cuts.length - 1; c++) {
        const za = cuts[c], zb = cuts[c + 1], a0 = sailV(za), a1 = sailV(zb), b0 = vN(za), b1 = vN(zb)
        for (let i = 0; i < NB; i++) {
          const t0 = i / NB, t1 = (i + 1) / NB
          quadOut(sail, S(a0 + (b0 - a0) * t0, za, off), S(a0 + (b0 - a0) * t1, za, off), S(a1 + (b1 - a1) * t1, zb, off), S(a1 + (b1 - a1) * t0, zb, off), out)
        }
      }
    }
  }
  // the sheet's north end
  for (let j = 0; j < NZ; j++) {
    const z0 = zs[j], z1 = Math.min(zs[j + 1], zNW)
    if (z0 >= zNW) break
    quadOut(sail, S(1, z0, 0.05), S(1, z0, -T), S(1, z1, -T), S(1, z1, 0.05), [wd[0], wd[1], 0])
  }
  // the top edge from the peak down to NW
  quadOut(white, S(VP, H, 0.05), S(1, zNW, 0.05), S(1, zNW, -T), S(VP, H, -T), up)

  // The leading edge: a white blade up the curve, standing a little proud
  // of the sail on both faces, and on past the peak to the top.
  for (let j = 0; j < NZ; j++) {
    const z0 = zs[j], z1 = zs[j + 1], v0 = sailV(z0), v1 = sailV(z1)
    const e0 = S(v0, z0, 0), e1 = S(v1, z1, 0)
    const n = unit3(cross3(sub3(e1, e0), wo)), o: V3 = n[1] < 0 ? n : [-n[0], -n[1], -n[2]]
    quadOut(white, S(v0, z0, 0.15), S(v0, z0, -T - 0.1), S(v1, z1, -T - 0.1), S(v1, z1, 0.15), o)
    for (const off of [0.15, -T - 0.1]) {
      const out: V3 = off > 0 ? wo : [-wo[0], -wo[1], 0]
      quadOut(white, S(v0, z0, off), S(v0 + 0.03, z0, off), S(v1 + 0.03, z1, off), S(v1, z1, off), out)
    }
  }
  {
    const pts: [number, number][] = [[VP, H - 1], [VP - 0.004, H + 2], [VP + 0.025, TIP], [VP + 0.045, TIP - 1.5], [VP + 0.03, H - 1]]
    for (const off of [0.15, -T - 0.1]) {
      const out: V3 = off > 0 ? wo : [-wo[0], -wo[1], 0], q = pts.map(([v, z]) => S(v, z, off))
      triOut(white, q[0], q[1], q[4], out); triOut(white, q[1], q[2], q[4], out); triOut(white, q[2], q[3], q[4], out)
    }
  }

  // The sail's fins: pale vertical lines every 6 m, following the curve.
  const ws = Math.hypot(NW[0] - SW[0], NW[1] - SW[1])
  for (let s = 5; s < ws - 2; s += 6) {
    const v = s / ws, top = topZ(v) - 2.5, w = 0.35 / ws
    if (top < 12) continue
    for (let j = 0; j < NZ && zs[j] < top; j++) {
      const z0 = Math.max(1, zs[j]), z1 = Math.min(top, zs[j + 1])
      quadOut(fins, S(v - w, z0, 0.11), S(v + w, z0, 0.11), S(v + w, z1, 0.11), S(v - w, z1, 0.11), wo)
    }
  }

  // A light grid on the plain east and north walls: mullion lines every 9 m.
  const eastTop = (y: number) => {
    // the terraces reach the east wall where yS(z) passes y
    if (y >= yS(zNW)) return zNW
    let z = 0
    while (z < zNW && yS(z) < y) z += 0.5
    return Math.floor(Math.max(0, z - BASE) / ST) * ST + BASE
  }
  for (let y = SEb[1] + 6; y < NE[1] - 2; y += 9) {
    const top = eastTop(y) - 1.2
    if (top < BASE + 4) continue
    const x = SEb[0] + ((NE[0] - SEb[0]) * (y - SEb[1])) / (NE[1] - SEb[1])
    wallBand(white, [x, y - 0.3], [x, y + 0.3], BASE, top, 0.07)
  }
  for (let s = 6; s < NE[0] - NW[0] - 2; s += 9) {
    const x = NE[0] - s, y = NE[1] + ((NW[1] - NE[1]) * s) / (NE[0] - NW[0])
    wallBand(white, [x + 0.3, y], [x - 0.3, y], BASE, zNW - 1.2, 0.07)
  }

  await save('atx-google-tower', 'Google Tower (Block 185)', [
    { part: glass, material: { ...PALETTE.window, color: 0x6f96c2 } },
    { part: sail, material: windowVariant(2, 0x8eaecd) },
    { part: deck, material: finish('google-terrace', 0xebebe6) },
    { part: white, material: PALETTE.trim },
    { part: fins, material: finish('google-sail-fins', 0xe4ebef) },
  ], { bearing: 17.7, height: TIP, replaces: ['way/961789209'] })
}
