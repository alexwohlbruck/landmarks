/**
 * NRG Stadium, Houston (2002, HOK Sport with Houston Stadium Consultants;
 * Walter P Moore, structure): the first NFL stadium with a retractable
 * roof. Procedural, CC0-1.0, no textures.  bun generators/hou-nrg-stadium.ts
 *
 * What makes it read as itself: a long box with rounded sides; two white
 * supertrusses running its full length north-south and cantilevering past
 * both end-zone facades; between them the white fabric roof, two arched
 * retractable panels ribbed by their crossing trusses, closed here, with
 * lower fixed fabric vaults over each end zone; the grey fixed roofs over
 * the sideline stands, bowed out in plan, edged with a white fascia over
 * curved walls of green-grey glass; flat end-zone facades of pale panels and
 * glass between square corner towers; and open ramp blocks at the four
 * corners. The field and the ground are the map's.
 *
 * Roof pose: modelled closed. The 2018 lidar and the USGS NAIP orthophoto
 * both show it closed (fabric panels meeting at the 50-yard line); the
 * 2017 CBP aerial (photo n1) shows it half open, the two panels drawn back
 * over the end-zone vaults.
 *
 * Frame: x east, y north, z up, metres (written as glTF +Y up, -Z north).
 * Bearing 0: the field and the trusses run true north-south. The anchor is
 * the stadium's centre line from the lidar, 3 m west of the area centroid
 * of OSM way/119422708 (-95.410803, 29.684858): the two trusses, the
 * end-zone blocks and the corner towers are all symmetric about x = -3 in
 * the centroid's frame. The sideline roof edges measure symmetric about
 * x = -0.5, so each is drawn at the mean half-width, about 2.5 m off on each
 * side. z = 0 is the street, which is flat round the stadium (lidar ground
 * within 0.5 m all round; Mapterhorn within 1.5 m). Elevation 0: no
 * published source puts the field below the street, so the model is not
 * sunk.
 *
 * Measured, USGS 3DEP lidar TX_Coastal_B1_2018 (2018 flight), 1 m grid,
 * heights above the street (1.4 m over the box's ground_min of 13.8 m):
 * - supertrusses: 9 m wide, centred 58.5 m either side of the axis, from
 *   y = -151 to +151, top 69.4 m;
 * - retractable panels: y -72 to +72, an arch across x from 74.6 m at
 *   x = +-57 to 82.2 m on the axis (OSM height=79.25 is 3 m low);
 * - end-zone fabric vaults: y +-72 to +-101, 66.9 m at x = +-55 to 72.1 m;
 * - end-zone blocks: 54.7 m behind, 46.1 m along the front 10 m, the front
 *   at y = +-133, 90 m wide; corner towers 18 by 16 m, 54.8 m tall, at
 *   x +-63 to +-81, y +-118 to +-134; lower blocks behind them at 51 and
 *   40.5 m;
 * - sideline roofs: from the trusses out to an arc (|x| = 112.5 at y = 0,
 *   101.5 at y = 60, 86 at y = 90; a circle of radius 166.1 m centred
 *   53.6 m across the axis fits within 2.5 m), 57.1 m at y = 0 falling to
 *   about 52 m at y = +-92;
 * - corner ramp blocks: 33.3 m, out to |x| = 117 at y = 56 and 104 at
 *   y = 113.
 * Measured, USGS NAIP: closed roof, the grey sideline roofs (their "nrg
 * stadium" lettering left out), the white fabric and trusses.
 *
 * Published (Wikipedia, "NRG Stadium"): opened August 24, 2002; HOK Sport
 * with Houston Stadium Consultants; Walter P Moore; the roof's two panels
 * split at the 50-yard line and retract over the end zones; ten tri-chord
 * trusses ride on rails on two supertrusses; "fabric roof and expansive
 * areas of glazing", glowing from within at night.
 *
 * Photos (Wikimedia Commons), compared against the renders:
 * - n1 "NRG Stadium, Houston, Texas, United States.jpg", U.S. Customs and
 *   Border Protection, public domain (2017 aerial from the north-west);
 * - n3 "Reliant Stadium Aerial.JPG", LoneStarMike, CC BY-SA 3.0 (from
 *   above, the roof closed);
 * - n5 "NRGStadiumnew.jpg", n6 "Nrgstadium0.jpg" and n7 "NRGStadium1.jpg",
 *   WhisperToMe, CC0 (the north end, the curved glass sideline, the end
 *   towers and truss ends);
 * - n8 "Reliant Stadium (3436384600).jpg", Mark Hodgins, CC BY 2.0 (an end
 *   facade between its towers);
 * - n9 "Reliant Stadium (3421156423).jpg", Randall Chancellor, CC BY-SA 2.0
 *   (from the south-west across the car park).
 *
 * Estimated: the supertrusses' depth (14 m) and their tips (rising 8 m over
 * the 18 m cantilever), the diagonals' spacing, the five ribs on each panel
 * (one per tri-chord truss), the glazing of the vertical faces between the
 * end vaults and the end blocks, the end facades' glass bays, the sideline
 * glass's setback (3 m under the roof edge) and its base, the ramp blocks'
 * open bands. Colours from the photos: pale grey-beige panels, green-grey
 * glass, white trusses and fabric, grey metal roofs.
 *
 * Left out: lettering and logos, banners, the red, white and blue team
 * graphics (they are signage, not structure), the pedestrian bridges and
 * plazas, the field and seats.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const panel = new Part(), win = new Part(), fabric = new Part(), roof = new Part(), white = new Part(), shadow = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => {
  const l = Math.hypot(...a) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}
/** A quad wound to face `hint`; smooth normals if given. */
function quad(p: Part, P: V3[], hint: V3, ns?: V3[]) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const o = dot(f, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const n = ns ? o.map((i) => unit(ns[i])) : undefined
  const tri = (a: number, b: number, c: number) => {
    const A = P[o[a]], B = P[o[b]], C = P[o[c]]
    if (Math.hypot(...cross(sub(B, A), sub(C, A))) < 1e-9) return
    p.tri(A, B, C, undefined, undefined, undefined, n && [n[a], n[b], n[c]])
  }
  tri(0, 1, 2)
  tri(0, 2, 3)
}
/** A vertical prism over a convex polygon (counter-clockwise), no bottom. */
function prism(p: Part, poly: XY[], z0: number, z1: number, topPart: Part = p) {
  const k = poly.length
  for (let i = 0; i < k; i++) {
    const a = poly[i], b = poly[(i + 1) % k]
    const out: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    quad(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], out)
  }
  for (let i = 1; i < k - 1; i++)
    topPart.tri([poly[0][0], poly[0][1], z1], [poly[i][0], poly[i][1], z1], [poly[i + 1][0], poly[i + 1][1], z1])
}
const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part = p) =>
  prism(p, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, top)
/** Mirror helpers: run f for both signs of x and/or y. */
const both = (f: (s: number) => void) => [1, -1].forEach(f)

// ---------------------------------------------------------------------------
// Supertrusses: a top chord, two bottom chords and Warren diagonals on both
// faces, cantilevering past the end facades with their tips rising.
const TX = 58.5, TW = 4.5, TTOP = 69.4, TBOT = 55.4, TEND = 151, FRONT = 133
const tbot = (y: number) => (Math.abs(y) <= FRONT ? TBOT : TBOT + ((Math.abs(y) - FRONT) / (TEND - FRONT)) * 8)
both((sx) => {
  const xc = sx * TX
  box(white, xc - TW, xc + TW, -TEND, TEND, TTOP - 1.8, TTOP)
  // the top chord's underside, so it reads from below
  quad(white, [[xc - TW, -TEND, TTOP - 1.8], [xc + TW, -TEND, TTOP - 1.8], [xc + TW, TEND, TTOP - 1.8], [xc - TW, TEND, TTOP - 1.8]], [0, 0, -1])
  const SEG = 32
  for (const side of [-1, 1]) {
    const x = xc + side * (TW - 0.7)
    // bottom chord, in segments so the tips can rise
    for (let i = 0; i < SEG; i++) {
      const y0 = -TEND + (2 * TEND * i) / SEG, y1 = -TEND + (2 * TEND * (i + 1)) / SEG
      const b0 = tbot(y0), b1 = tbot(y1)
      for (const [P, h] of [
        [[[x - 0.7, y0, b0], [x + 0.7, y0, b0], [x + 0.7, y1, b1], [x - 0.7, y1, b1]], [0, 0, -1]],
        [[[x - 0.7, y0, b0 + 1.4], [x + 0.7, y0, b0 + 1.4], [x + 0.7, y1, b1 + 1.4], [x - 0.7, y1, b1 + 1.4]], [0, 0, 1]],
        [[[x + side * 0.7, y0, b0], [x + side * 0.7, y1, b1], [x + side * 0.7, y1, b1 + 1.4], [x + side * 0.7, y0, b0 + 1.4]], [side, 0, 0]],
        [[[x - side * 0.7, y0, b0], [x - side * 0.7, y1, b1], [x - side * 0.7, y1, b1 + 1.4], [x - side * 0.7, y0, b0 + 1.4]], [-side, 0, 0]],
      ] as [V3[], V3][])
        quad(white, P, h)
      // a diagonal per segment, alternating, on the outer face
      const up = i % 2 === 0
      const ya = up ? y0 : y1, yb = up ? y1 : y0
      const za = tbot(ya) + 1.4, zb = TTOP - 1.8
      const w = 0.9
      const ox = x + side * 0.35
      for (const d of [-1, 1]) {
        quad(white, [[ox + d * 0.35, ya - w, za], [ox + d * 0.35, ya + w, za], [ox + d * 0.35, yb + w, zb], [ox + d * 0.35, yb - w, zb]], [d, 0, 0])
      }
      quad(white, [[ox - 0.35, ya - w, za], [ox + 0.35, ya - w, za], [ox + 0.35, yb - w, zb], [ox - 0.35, yb - w, zb]], [0, -1, 0])
      quad(white, [[ox - 0.35, ya + w, za], [ox + 0.35, ya + w, za], [ox + 0.35, yb + w, zb], [ox - 0.35, yb + w, zb]], [0, 1, 0])
    }
  }
  // the tip: a vertical end post
  for (const sy of [1, -1]) {
    const y = sy * (TEND - 0.8)
    box(white, xc - TW, xc + TW, y - 0.8, y + 0.8, tbot(y), TTOP - 1.8)
  }
})

// ---------------------------------------------------------------------------
// The fabric roof: two retractable panels (closed) and the fixed end vaults.
/** An arch across x: height at x for half-width hw, edge e and crown c. */
const archZ = (x: number, hw: number, e: number, c: number) => {
  const s = c - e, R = (hw * hw + s * s) / (2 * s)
  return c - R + Math.sqrt(Math.max(0, R * R - x * x))
}
function vault(p: Part, hw: number, e: number, c: number, y0: number, y1: number, skirt: number, ends: [Part | null, Part | null]) {
  const K = 16
  const xs = Array.from({ length: K + 1 }, (_, i) => -hw + (2 * hw * i) / K)
  const nrm = (x: number): V3 => {
    const s = c - e, R = (hw * hw + s * s) / (2 * s)
    return unit([x, 0, archZ(x, hw, e, c) - (c - R)])
  }
  for (let i = 0; i < K; i++) {
    const a = xs[i], b = xs[i + 1]
    quad(p, [[a, y0, archZ(a, hw, e, c)], [b, y0, archZ(b, hw, e, c)], [b, y1, archZ(b, hw, e, c)], [a, y1, archZ(a, hw, e, c)]], [0, 0, 1], [nrm(a), nrm(b), nrm(b), nrm(a)])
  }
  // gable ends
  ends.forEach((ep, j) => {
    if (!ep) return
    const y = j === 0 ? y0 : y1, hint: V3 = [0, j === 0 ? -1 : 1, 0]
    for (let i = 0; i < K; i++) {
      const a = xs[i], b = xs[i + 1]
      quad(ep, [[a, y, skirt], [b, y, skirt], [b, y, archZ(b, hw, e, c)], [a, y, archZ(a, hw, e, c)]], hint)
    }
  })
  // side skirts down to the trusses
  both((s) => quad(p, [[s * hw, y0, skirt], [s * hw, y1, skirt], [s * hw, y1, e], [s * hw, y0, e]], [s, 0, 0]))
}
const PHW = 57, PE = 74.6, PC = 82.2, PY = 72, LOBES = 5, DIP = 4
/**
 * A retractable panel: the arch across x, scalloped along y into five
 * lobes between its tri-chord trusses; the scallops are deepest at the
 * edges (lidar: 73.4 m at the trusses, 76.4 m mid-lobe, 4 m inside the
 * edge) and vanish on the crown.
 */
const lobeZ = (x: number, f: number) => archZ(x, PHW, PE, PC) - DIP * (x / PHW) ** 2 * (1 - Math.sin(Math.PI * f))
both((sy) => {
  const K = 16, L = 4
  const xs = Array.from({ length: K + 1 }, (_, i) => -PHW + (2 * PHW * i) / K)
  const lob = PY / LOBES
  const yAt = (j: number, m: number) => sy * (0.3 + j * lob + (m / L) * lob)
  const P = (x: number, j: number, m: number): V3 => [x, yAt(j, m), lobeZ(x, m / L)]
  const N = (x: number, j: number, m: number): V3 => {
    const e = 0.5, f = m / L
    const dzx = (lobeZ(x + e, f) - lobeZ(x - e, f)) / (2 * e)
    const ff = Math.min(1, Math.max(0, f)), fe = 0.02
    const dzy = ((lobeZ(x, Math.min(1, ff + fe)) - lobeZ(x, Math.max(0, ff - fe))) / (2 * fe * lob)) * sy
    return unit([-dzx, -dzy, 1])
  }
  for (let j = 0; j < LOBES; j++)
    for (let m = 0; m < L; m++)
      for (let i = 0; i < K; i++) {
        const a = xs[i], b = xs[i + 1]
        quad(fabric, [P(a, j, m), P(b, j, m), P(b, j, m + 1), P(a, j, m + 1)], [0, 0, 1], [N(a, j, m), N(b, j, m), N(b, j, m + 1), N(a, j, m + 1)])
      }
  // side skirts down to the trusses, following the scallops
  both((s) => {
    const x = s * PHW
    for (let j = 0; j < LOBES; j++)
      for (let m = 0; m < L; m++)
        quad(fabric, [[x, yAt(j, m), TTOP], [x, yAt(j, m + 1), TTOP], P(x, j, m + 1), P(x, j, m)], [s, 0, 0])
  })
  // the end gables (at the seam and over the end vault)
  for (const [j, m, h] of [[0, 0, -sy], [LOBES - 1, L, sy]] as [number, number, number][])
    for (let i = 0; i < K; i++) {
      const a = xs[i], b = xs[i + 1]
      quad(fabric, [[a, yAt(j, m), TTOP], [b, yAt(j, m), TTOP], P(b, j, m), P(a, j, m)], [0, h, 0])
    }
  // the tri-chord trusses: white ribs along every trough
  for (let j = 0; j <= LOBES; j++) {
    const yc = sy * (0.3 + j * lob) - (j === LOBES ? sy * 0.9 : j === 0 ? -sy * 0.9 : 0)
    const z = (x: number) => lobeZ(x, 0) + 0.7
    for (let i = 0; i < K; i++) {
      const a = xs[i], b = xs[i + 1]
      quad(white, [[a, yc - 0.9, z(a)], [b, yc - 0.9, z(b)], [b, yc + 0.9, z(b)], [a, yc + 0.9, z(a)]], [0, 0, 1])
      for (const d of [-1, 1]) quad(white, [[a, yc + d * 0.9, z(a) - 1.4], [b, yc + d * 0.9, z(b) - 1.4], [b, yc + d * 0.9, z(b)], [a, yc + d * 0.9, z(a)]], [0, d, 0])
    }
  }
})
// end-zone fixed vaults, and the glazed face that closes each above the end block
const EHW = 55, EE = 66.9, EC = 72.1, EY0 = 72, EY1 = 101, BLOCK = 54.7
both((sy) => {
  const y0 = sy > 0 ? EY0 : -EY1, y1 = sy > 0 ? EY1 : -EY0
  vault(fabric, EHW, EE, EC, y0, y1, BLOCK, sy > 0 ? [null, win] : [win, null])
})

// ---------------------------------------------------------------------------
// End-zone blocks, corner towers and the lower blocks behind them.
both((sy) => {
  const Y = (a: number, b: number): [number, number] => (sy > 0 ? [a, b] : [-b, -a])
  // back block, full width between the trusses' outer faces
  box(panel, -63, 63, ...Y(100, 123), 0, BLOCK, roof)
  // front block, lower, and the strips either side up to the block height
  box(panel, -45, 45, ...Y(123, FRONT), 0, 46.1, roof)
  both((sx) => box(panel, ...((sx > 0 ? [45, 63] : [-63, -45]) as [number, number]), ...Y(123, FRONT), 0, BLOCK, roof))
  // the end facade's glass: four bays in two tiers, between pale piers
  const yf = sy * (FRONT + 0.05)
  for (let b = 0; b < 4; b++) {
    const x0 = -40 + b * 20 + 0.8, x1 = x0 + 18.4
    for (const [z0, z1] of [[4.5, 22], [23.5, 40]]) quad(win, [[x0, yf, z0], [x1, yf, z0], [x1, yf, z1], [x0, yf, z1]], [0, sy, 0])
  }
  // dark entries at street level
  for (let b = 0; b < 4; b++) {
    const x0 = -40 + b * 20 + 3, x1 = x0 + 14
    quad(shadow, [[x0, yf, 0], [x1, yf, 0], [x1, yf, 3.5], [x0, yf, 3.5]], [0, sy, 0])
  }
  both((sx) => {
    const X = (a: number, b: number): [number, number] => (sx > 0 ? [a, b] : [-b, -a])
    box(panel, ...X(63, 81), ...Y(118, 134), 0, 54.8, roof)
    box(panel, ...X(63, 72), ...Y(96, 118), 0, 51, roof)
    box(panel, ...X(72, 84), ...Y(100, 118), 0, 40.5, roof)
    // a tall glass slot in each tower's end face
    const xm = sx * 72, yt = sy * (134 + 0.05)
    quad(win, [[xm - 2.5, yt, 6], [xm + 2.5, yt, 6], [xm + 2.5, yt, 48], [xm - 2.5, yt, 48]], [0, sy, 0])
  })
})

// ---------------------------------------------------------------------------
// Sideline roofs over the stands, bowed out in plan, and the curved glass
// walls under their edges.
const ARC_C = -53.6, ARC_R = 166.1
const edge = (y: number) => ARC_C + Math.sqrt(ARC_R * ARC_R - y * y)
const roofZ = (y: number) => 57.1 - 5.5 * (y / 100) ** 2
const FASCIA = 4, SET = 3
both((sx) => {
  const S = 20, YM = 100
  for (let i = 0; i < S; i++) {
    const y0 = -YM + (2 * YM * i) / S, y1 = -YM + (2 * YM * (i + 1)) / S
    const e0 = edge(y0), e1 = edge(y1), z0 = roofZ(y0), z1 = roofZ(y1)
    const P = (x: number, y: number, z: number): V3 => [sx * x, y, z]
    // top
    quad(roof, [P(63, y0, z0), P(e0, y0, z0), P(e1, y1, z1), P(63, y1, z1)], [0, 0, 1])
    // fascia and its soffit
    // outward normal of the segment (the hint only sets the winding)
    const fN = unit([sx * (y1 - y0), -(e1 - e0), 0])
    quad(white, [P(e0, y0, z0 - FASCIA), P(e1, y1, z1 - FASCIA), P(e1, y1, z1), P(e0, y0, z0)], fN)
    quad(white, [P(e0 - SET, y0, z0 - FASCIA), P(e1 - SET, y1, z1 - FASCIA), P(e1, y1, z1 - FASCIA), P(e0, y0, z0 - FASCIA)], [0, 0, -1])
    // the glass wall, set back under the edge, on a dark base
    const g0 = e0 - SET, g1 = e1 - SET
    quad(shadow, [P(g0, y0, 0), P(g1, y1, 0), P(g1, y1, 6), P(g0, y0, 6)], fN)
    quad(win, [P(g0, y0, 6), P(g1, y1, 6), P(g1, y1, z1 - FASCIA), P(g0, y0, z0 - FASCIA)], fN)
  }
  // a few pale mullion lines and two floor lines on the glass
  for (let k = -4; k <= 4; k++) {
    const y = k * 20, g = edge(y) - SET + 0.12, n: V3 = unit([sx * (edge(y) - ARC_C), y, 0])
    const t: V3 = unit([-n[1], n[0], 0])
    const a: V3 = [sx * g + t[0] * 0.6, y + t[1] * 0.6, 6], b: V3 = [sx * g - t[0] * 0.6, y - t[1] * 0.6, 6]
    const z = roofZ(y) - FASCIA
    quad(white, [a, b, [b[0], b[1], z], [a[0], a[1], z]], n)
  }
  for (const zl of [20, 35]) {
    for (let i = 0; i < 20; i++) {
      const y0 = -100 + 10 * i, y1 = y0 + 10
      const g0 = edge(y0) - SET + 0.12, g1 = edge(y1) - SET + 0.12
      const fN = unit([sx * (y1 - y0), -(edge(y1) - edge(y0)), 0])
      quad(white, [[sx * g0, y0, zl], [sx * g1, y1, zl], [sx * g1, y1, zl + 1], [sx * g0, y0, zl + 1]], [fN[0], sx * fN[1], 0])
    }
  }
})

// ---------------------------------------------------------------------------
// Corner ramp blocks, with their open decks as dark bands.
both((sx) =>
  both((sy) => {
    const poly: XY[] = [[92, 54], [117, 56], [104, 114], [80, 114]].map(([x, y]) => [sx * x, sy * y] as XY)
    const ccw = sx * sy > 0 ? poly : [...poly].reverse()
    prism(panel, ccw, 0, 33.3, roof)
    // dark bands on the outer face (the 117,56 -> 104,114 side) and the end face
    for (const [p, q] of [[[117, 56], [104, 114]], [[104, 114], [80, 114]], [[92, 54], [117, 56]]] as [XY, XY][]) {
      const a: XY = [sx * p[0], sy * p[1]], b: XY = [sx * q[0], sy * q[1]]
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
      let n: V3 = unit([b[1] - a[1], -(b[0] - a[0]), 0])
      if (n[0] * mx + n[1] * (my - sy * 85) < 0) n = [-n[0], -n[1], 0]
      const o = 0.06
      for (const [z0, z1] of [[7, 11], [15, 19], [23, 27]])
        quad(shadow, [[a[0] + n[0] * o, a[1] + n[1] * o, z0], [b[0] + n[0] * o, b[1] + n[1] * o, z0], [b[0] + n[0] * o, b[1] + n[1] * o, z1], [a[0] + n[0] * o, a[1] + n[1] * o, z1]], n)
    }
  }),
)

const parts = [
  { part: panel, material: finish('nrg-panel', 0xe0dcd3) },
  { part: win, material: { ...PALETTE.window, color: 0x86a3a6 } },
  { part: fabric, material: finish('nrg-fabric', 0xf2f1ec) },
  { part: roof, material: PALETTE.roof },
  { part: white, material: finish('nrg-truss-white', 0xf7f5f0) },
  { part: shadow, material: finish('nrg-shadow', 0x6b737b) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(18), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('NRG Stadium', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [29.684858, -95.410834], height: PC + 0.6,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/119422708'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/hou-nrg-stadium.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
