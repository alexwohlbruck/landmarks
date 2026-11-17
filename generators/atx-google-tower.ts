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
 * Drawn as tiers of two storeys, each cut back to the terrace line and the
 * leaning west face at its top, a pyramid cap, and the sail as a smooth
 * 0.6 m glass sheet a little proud of the stepped tiers.
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
 *  - photo-scaled (from "lake", "ajay", "farbod1/2", "oleg1/2"): the peak
 *    60% of the way up the west side from the south; the glass peak at
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
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the terraces are drawn two storeys to a step (the real ones are
 * one storey, with notched corners). The exact
 * position of the peak and the heights of the north corners are read off
 * oblique photos (a few metres either way). The west face's lean and
 * swoop are estimated; its slight curvature in plan is drawn flat. The
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
  const PLAN: XY[] = [SW, SEa, SEb, NE, NW]

  const Z0 = 3 // street level above the model's base (the creek-bank corner)
  const TIP = Z0 + 181 // published top
  const H = Z0 + 174 // glass peak
  const VP = 0.6 // the peak, as a fraction of the west side from SW to NW
  const P = 1.25 // the sail curve's swoop
  const zSW = 0, zNW = Z0 + 0.9 * 174
  const BASE = Z0 + 9 // the full-plate base (lobby and first office floors)
  const PEAK = lerpXY(SW, NW, VP)
  const westX = (y: number) => SW[0] + ((NW[0] - SW[0]) * (y - SW[1])) / (NW[1] - SW[1])

  // The sail edge, up the west side from SW to the peak.
  const sailV = (z: number) => VP * Math.pow(Math.max(0, (z - zSW) / (H - zSW)), 1 / P)
  const yS = (z: number) => lerpXY(SW, NW, sailV(z))[1]
  const LEAN = 12, xoff = (z: number) => LEAN * Math.pow(Math.max(0, z) / H, 1.8)
  // The glass cap: above the flat-topped north and east walls (0.9 of the
  // peak) the top closes in, up and west, to the peak over the sail.
  const xTop = westX(PEAK[1]) + LEAN + 3
  const xE = (z: number) => (z <= zNW ? 99 : NE[0] + ((xTop - NE[0]) * (z - zNW)) / (H - zNW))
  const yN = (z: number) => (z <= zNW ? 99 : NW[1] + ((PEAK[1] + 2 - NW[1]) * (z - zNW)) / (H - zNW))
  const wd = unit3([NW[0] - SW[0], NW[1] - SW[1], 0]), wo: V3 = [-wd[1], wd[0], 0] // along the west side, and out of it
  // The west face leans back to the east as it rises (it is seen from above
  // in the aerial, and leans in every photo from the south and south-west).
  const plate = (z: number) => clipHalf(clipHalf(clipHalf(clipHalf(PLAN, [0, -1], -yS(z)), [1, 0], xE(z)), [0, 1], yN(z)), [wo[0], wo[1]], wo[0] * SW[0] + wo[1] * SW[1] - xoff(z))

  // Tiers of two storeys (4.75 m), each set back to the plate at its top:
  // the terraces on the south, the steps on the east.
  const ST = 4.75
  const levels = [0, BASE]
  for (let z = BASE + 2 * ST; z < zNW - 2; z += 2 * ST) levels.push(z)
  levels.push(zNW)
  const up: V3 = [0, 0, 1]
  for (let k = 0; k < levels.length - 1; k++) {
    const z0 = levels[k], z1 = levels[k + 1], ring = plate(Math.min(z1, H - 0.8))
    if (ring.length < 3) continue
    const cap = z0 >= zNW - 0.01, wallP = cap ? sail : glass
    // walls (west walls are hidden behind the sail; drawn anyway, they close the solid)
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length], n = unit3([b[1] - a[1], a[0] - b[0], 0])
      // Terrace fronts (facing south) get a white slab edge on every tier;
      // the plain north and east walls one every third tier (three panels of
      // about 9.5 m between pale floor lines would be too busy).
      const front = n[1] < -0.7, band = front || k % 3 === 0 || z1 >= zNW - 0.01
      const zb = front ? z1 - 1.8 : band ? z1 - 0.9 : z1
      quadOut(wallP, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], zb], [a[0], a[1], zb], n)
      if (band) quadOut(white, [a[0], a[1], zb], [b[0], b[1], zb], [b[0], b[1], z1], [a[0], a[1], z1], n)
    }
    // the deck on top (the terrace in front of the next tier, or the roof)
    const tri = (A: XY, B: XY, C: XY) => triOut(deck, [A[0], A[1], z1], [B[0], B[1], z1], [C[0], C[1], z1], up)
    for (let i = 1; i < ring.length - 1; i++) tri(ring[0], ring[i], ring[i + 1])
  }

  // The glass cap: a steep pyramid over the west 16 m of the roof, rising to
  // a sharp point over the sail (the rest of the roof stays flat at 0.9 of
  // the peak, as the north-east corner does in the south-east photos).
  {
    const ring = clipHalf(plate(zNW), [1, 0], westX(PEAK[1]) + xoff(zNW) + 16), apex: V3 = [...lerpXY(SW, NW, VP), H] as V3
    apex[0] += wo[0] * -xoff(H) - wo[0] * 0.3; apex[1] += wo[1] * -xoff(H) - wo[1] * 0.3
    const c: V3 = [ring.reduce((t, q) => t + q[0], 0) / ring.length, ring.reduce((t, q) => t + q[1], 0) / ring.length, zNW]
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      const A: V3 = [a[0], a[1], zNW], B: V3 = [b[0], b[1], zNW]
      const out = unit3(sub3(add3(add3(A, B), apex), add3(add3(c, c), [c[0], c[1], zNW - 40])))
      triOut(sail, A, B, apex, [out[0], out[1], Math.abs(out[2]) + 0.3])
    }
  }

  // The sail: a smooth glass sheet on the west side, 0.6 m thick, whose
  // south edge is the swooping curve. It stands a little proud of the
  // stepped tiers, as the real glass blade does over the terraces.
  const T = 0.6
  const ws = Math.hypot(NW[0] - SW[0], NW[1] - SW[1])
  const at = (v: number, z: number, off: number): V3 => {
    const q = lerpXY(SW, NW, v), d = off - xoff(z)
    return [q[0] + wo[0] * d, q[1] + wo[1] * d, z]
  }
  const N = 24
  const curve: [number, number][] = [] // (v, z) from the bottom to the peak
  for (let i = 0; i <= N; i++) { const z = zSW + ((H - zSW) * i) / N; curve.push([sailV(z), z]) }
  curve[0] = [0, 0]
  // outline of the sheet in (v, z): bottom from NW to SW, up the curve, then the top edge back to NW
  const vTip = VP + 0.035
  const outline: [number, number][] = [[1, 0], [0, 0], ...curve.slice(1), [vTip, TIP], [vTip + 0.012, TIP - 2.5], [1, zNW]]
  // triangulate as a fan of strips: each curve point paired with the north edge at the same height
  const north = (z: number): number => 1
  void north
  for (const off of [0.05, -T]) {
    const out: V3 = off > 0 ? wo : [-wo[0], -wo[1], 0]
    for (let i = 0; i < curve.length - 1; i++) {
      const [v0, z0] = curve[i], [v1, z1] = curve[i + 1]
      const n0 = z0 <= zNW ? 1 : 1 - ((1 - VP) * (z0 - zNW)) / (H - zNW), n1 = z1 <= zNW ? 1 : 1 - ((1 - VP) * (z1 - zNW)) / (H - zNW)
      if (z1 <= zNW || z0 >= zNW) quadOut(sail, at(v0, z0, off), at(n0, z0, off), at(n1, z1, off), at(v1, z1, off), out)
      else {
        const nm = 1
        quadOut(sail, at(v0, z0, off), at(n0, z0, off), at(nm, zNW, off), at(v0 + ((v1 - v0) * (zNW - z0)) / (z1 - z0), zNW, off), out)
        quadOut(sail, at(v0 + ((v1 - v0) * (zNW - z0)) / (z1 - z0), zNW, off), at(nm, zNW, off), at(n1, z1, off), at(v1, z1, off), out)
      }
    }
  }
  void outline
  // the sheet's edges: the north end, and the sail edge (white, the blade)
  for (let i = 0; i < 12; i++) {
    const z0 = (zNW * i) / 12, z1 = (zNW * (i + 1)) / 12
    quadOut(sail, at(1, z0, 0.05), at(1, z0, -T), at(1, z1, -T), at(1, z1, 0.05), [wd[0], wd[1], 0])
  }
  for (let i = 0; i < curve.length - 1; i++) {
    const [v0, z0] = curve[i], [v1, z1] = curve[i + 1]
    const d0 = 0.004, edgeOut: V3 = unit3(add3(cross3(sub3(at(v1, z1, 0), at(v0, z0, 0)), wo), [0, 0, 0]))
    const o: V3 = dot3(edgeOut, [-wd[0], -wd[1], 0]) > 0 ? edgeOut : [-edgeOut[0], -edgeOut[1], -edgeOut[2]]
    // the edge face, and a white strip down each face of the sheet along it
    quadOut(white, at(v0, z0, 0.1), at(v0, z0, -T - 0.05), at(v1, z1, -T - 0.05), at(v1, z1, 0.1), o)
    for (const off of [0.1, -T - 0.05]) {
      const out: V3 = off > 0 ? wo : [-wo[0], -wo[1], 0]
      quadOut(white, at(v0 - d0, z0, off), at(v0 + 0.028, z0, off), at(v1 + 0.028, z1, off), at(v1 - d0, z1, off), out)
    }
  }
  // the top edge from the peak down to NW
  {
    const a = at(VP, H, 0.05), b = at(1, zNW, 0.05), c = at(1, zNW, -T), d = at(VP, H, -T)
    quadOut(white, a, b, c, d, up)
  }
  // the blade past the peak: a thin white fin to the top
  {
    const pts: [number, number][] = [[VP, H - 1], [VP - 0.004, H + 2], [vTip - 0.01, TIP], [vTip + 0.01, TIP - 1.5], [VP + 0.03, H - 1]]
    for (const off of [0.1, -T - 0.05]) {
      const out: V3 = off > 0 ? wo : [-wo[0], -wo[1], 0], q = pts.map(([v, z]) => at(v, z, off))
      triOut(white, q[0], q[1], q[4], out); triOut(white, q[1], q[2], q[4], out); triOut(white, q[2], q[3], q[4], out)
    }
  }

  // The fins on the sail: a few pale vertical lines.
  for (let s = 6; s < ws - 2; s += 7) {
    const v = s / ws
    let top: number
    if (v <= VP) { const t = v / VP; top = zSW + (H - zSW) * Math.pow(t, P) } else top = H + ((zNW - H) * (v - VP)) / (1 - VP)
    if (top < 12) continue
    const w = 0.4 / ws
    const n = Math.max(1, Math.ceil((top - 3) / 15))
    for (let i = 0; i < n; i++) {
      const z0 = 1 + ((top - 3) * i) / n, z1 = 1 + ((top - 3) * (i + 1)) / n
      quadOut(fins, at(v - w, z0, 0.11), at(v + w, z0, 0.11), at(v + w, z1, 0.11), at(v - w, z1, 0.11), wo)
    }
  }

  await save('atx-google-tower', 'Google Tower (Block 185)', [
    { part: glass, material: { ...PALETTE.window, color: 0x7d97ad } },
    { part: sail, material: windowVariant(2, 0x8aa2b8) },
    { part: deck, material: finish('google-terrace', 0xebebe6) },
    { part: white, material: PALETTE.trim },
    { part: fins, material: finish('google-sail-fins', 0xe4ebef) },
  ], { bearing: 17.7, height: TIP, replaces: ['way/961789209'] })
}
