/**
 * San Diego California Temple (The Church of Jesus Christ of Latter-day
 * Saints), 7474 Charmant Drive, La Jolla — William S. Lewis Jr., 1993.
 *
 * A white temple beside I-5: a low walled body with a band of art-glass
 * screens, a raised central block, and at each end a tall tower of stacked
 * diamond-plan tiers ringed by pinnacles, each rising into a slender
 * spire. The east spire, the taller, carries the gilded angel Moroni.
 *
 * Frame: bearing 4 (the line through the two spires runs 4° south of
 * east). +x along that line (east), +y 4° west of north, metres. Origin
 * at the anchor, midway between the two spires. z = 0 is the lowest
 * ground under the footprint (the west tip, lidar 1.0 m above
 * ground_min); the temple's floor is the top of its mound, B = 10.5 m up
 * (lidar 11.5, the grass on the north and south). The podium below B is
 * the white plinth wall the photos show on the west and the mound's
 * retaining walls. Elevation 0.
 *
 * Sources
 * - OSM way/33647441 (building=temple, San Diego California Temple,
 *   wikidata Q3132715). © OSM contributors.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 0.5 m grid, above
 *   ground_min 92.94 m: east spire with Moroni 161.13 m absolute at
 *   (20.5 E, −2.6 N) = 56.7 m above the floor; west spire 155.64 m at
 *   (−19.3 E, 0.4 N) = 51.2 m; central block roof 23.4; the screened
 *   wings 18.2; the mound 11–12 north and south, 6.3 east, 0.6–2 west.
 * - Mapterhorn terrain under the site: 0–11 m over 93.24 m, falling west.
 * - Wikipedia "San Diego California Temple": dedicated 1993, architect
 *   William S. Lewis Jr., white marble chips in plaster, two towers.
 * Photos (evidence):
 * - "2019 San Diego LDS Temple 1.jpg", "… 2.jpg", "… 3.jpg", Beyond My Ken,
 *   CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:2019_San_Diego_LDS_Temple_1.jpg
 *   (the long side: tiers, pinnacles, screens, central block; spire and
 *   tier proportions scaled from it against the lidar).
 * - "San Diego Mormon Temple17.jpg", Antoine Taveneaux, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:San_Diego_Mormon_Temple17.jpg
 * - "San Diego Temple 2008.JPG", Petter Strandmark, CC BY 3.0,
 *   https://commons.wikimedia.org/wiki/File:San_Diego_Temple_2008.JPG
 * - "San Diego CA Temple side view.jpg", CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:San_Diego_CA_Temple_side_view.jpg
 *   (a tower end-on: the diamond tiers and the ribbed tower face).
 * - "San Diego California Temple, Turret.jpg", Altus Photo Design, CC BY 2.0
 *   (pinnacle form).
 * - "San Diego California Temple - panoramio.jpg", rvd5star, CC BY 3.0
 *   (night: floodlit white, lit tower windows).
 * - "San Diego Temple June 2023.jpg", Nweil, CC BY-SA 4.0 (from the
 *   north-east, the plinth and mound).
 * Look-only: none.
 *
 * Numbers
 * - Footprint: OSM outline (measured), turned into this frame.
 * - Heights above the floor B (lidar, measured): screened wings 6.7,
 *   central block 11.9, east spire + Moroni 56.7, west spire 51.2.
 * - Tier heights (body 19, middle stage to 24.5, top stage to 29, so the
 *   needle spire is about half the tower), plan sizes (diamonds of
 *   half-diagonal 8, 5.2, 3.2; spire base 2.7, as broad as the photos show so the needles hold at 80 px), the fins and slot windows,
 *   and four rings of eight pinnacles, pinnacle heights and
 *   the 4 m statue — scaled from Beyond My Ken's photo 1 against the
 *   lidar spire heights (estimated).
 *
 * Doubts
 * - The pinnacles are drawn as simple needles, eight per stage, which is
 *   still fewer than the real towers have.
 * - The plinth below B is plain; the real mound is grass-covered on the
 *   north and south, which the map's terrain only partly shows.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { qf } from './dc-white-house'
import { pslab, poffset, saveModel, type XY } from './dc-nga-west'

const ID = 'sd-san-diego-temple'

// floodlit white at night, faces looking up barely lit
const WHITE = { ...finish('temple-white', 0xf4f1ea), floodlight: (_p: V3, n: V3) => (Math.abs(n[2]) > 0.7 ? 0.25 : 0.9) }
const GOLD = finish('temple-gold', 0xd6aa3e, 0.5)
const GLASS = { name: 'window', color: 0x5d6b74, roughness: 0.35 }

const white = new Part(), gold = new Part(), win = new Part(), roof = new Part()

const B = 10.5
const BEAR = (4 * Math.PI) / 180
const ANCHOR: XY = [0.6, -1.1] // world metres east/north of -117.22870, 32.86640

// OSM way/33647441, metres east/north of -117.22870, 32.86640.
const OSM: XY[] = [[-33.1, 1.7], [-30.5, -1.3], [-29.9, -1.3], [-28.6, -0.1], [-22.6, -6.9], [-23.8, -8.0], [-23.8, -8.8], [-11.8, -22.6], [-4.5, -16.3], [-1.6, -19.5], [1.5, -16.8], [8.1, -24.4], [22.3, -12.8], [22.4, -11.7], [21.5, -10.7], [28.2, -5.0], [29.3, -6.3], [30.6, -6.4], [32.9, -4.8], [33.2, -2.0], [30.9, 0.5], [30.1, 0.5], [28.5, -0.8], [22.4, 6.4], [23.9, 7.6], [23.9, 8.4], [11.9, 21.9], [4.7, 15.9], [1.6, 19.6], [-2.0, 16.3], [-8.0, 23.6], [-22.2, 12.0], [-22.3, 11.0], [-20.5, 9.2], [-27.6, 3.1], [-29.5, 5.3], [-30.1, 5.3], [-33.0, 2.9]]
const local = ([e, n]: XY): XY => {
  const E = e - ANCHOR[0], N = n - ANCHOR[1]
  return [E * Math.cos(BEAR) - N * Math.sin(BEAR), E * Math.sin(BEAR) + N * Math.cos(BEAR)]
}
const FOOT = OSM.map(local)
// The same outline with its small jogs dropped, for the inset screen band.
const SIMPLE: XY[] = ([[-33.1, 2.3], [-23.2, -8.4], [-11.8, -22.6], [8.1, -24.4], [22.3, -12.3], [33.0, -3.4], [23.9, 8.0], [11.9, 21.9], [-8.0, 23.6], [-22.2, 11.5]] as XY[]).map(local)

/** A diamond (square turned 45°) of half-diagonal r about (cx, cy). */
const diamond = (cx: number, cy: number, r: number): XY[] => [[cx + r, cy], [cx, cy + r], [cx - r, cy], [cx, cy - r]]
const square = (cx: number, cy: number, h: number): XY[] => [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]]

/** A pyramid over a convex ring from z0 to a point at z1. */
function pyramid(p: Part, ring: XY[], z0: number, z1: number) {
  const cx = ring.reduce((s, q) => s + q[0], 0) / ring.length, cy = ring.reduce((s, q) => s + q[1], 0) / ring.length
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const m: V3 = [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0.3]
    const A: V3 = [a[0], a[1], z0], Bv: V3 = [b[0], b[1], z0], T: V3 = [cx, cy, z1]
    const n = m
    // a triangle facing outward and up
    const f = [A, Bv, T]
    const cr = [(Bv[1] - A[1]) * (T[2] - A[2]) - (Bv[2] - A[2]) * (T[1] - A[1]), (Bv[2] - A[2]) * (T[0] - A[0]) - (Bv[0] - A[0]) * (T[2] - A[2]), (Bv[0] - A[0]) * (T[1] - A[1]) - (Bv[1] - A[1]) * (T[0] - A[0])]
    if (cr[0] * n[0] + cr[1] * n[1] + cr[2] * n[2] >= 0) p.tri(f[0], f[1], f[2])
    else p.tri(f[0], f[2], f[1])
  }
}

/** A pinnacle: a square shaft turned 45°, then a needle. */
function pinnacle(cx: number, cy: number, w: number, z0: number, zs: number, zt: number) {
  const r = diamond(cx, cy, w)
  pslab(white, r, z0, zs, 0.1, false)
  pyramid(white, r, zs, zt)
}

/** A flat panel on the wall a→b of a ring, facing out (n), between t0..t1 along it. */
function onWall(p: Part, a: XY, b: XY, t0: number, t1: number, z0: number, z1: number, d = 0.06) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
  const n: XY = [dy / l, -dx / l]
  const P = (t: number, z: number): V3 => [a[0] + dx * t + n[0] * d, a[1] + dy * t + n[1] * d, z]
  qf(p, P(t0, z0), P(t1, z0), P(t1, z1), P(t0, z1), [n[0], n[1], 0])
}

// --- Podium and the low walled body.
pslab(white, FOOT, 0, B + 4.3, 0.3, roof)
// The art-glass screen band: a recessed ring of glass between white fins.
const SCREEN = poffset(SIMPLE, -2.6)
pslab(win, SCREEN, B + 4.3, B + 6.4, 0, false)
pslab(white, SCREEN, B + 6.4, B + 6.9, 0.15, roof)
{
  const R = SCREEN
  for (let i = 0; i < R.length; i++) {
    const a = R[i], b = R[(i + 1) % R.length], l = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.max(1, Math.round(l / 2.6))
    for (let k = 0; k <= n; k++) {
      const t = k / n, w = 0.22 / l
      onWall(white, a, b, Math.max(0, t - w), Math.min(1, t + w), B + 4.3, B + 6.4, 0.12)
    }
  }
}
// The central block between the towers.
pslab(white, square(0, 0, 13).map(([x, y]) => [x * 1.05, y * 0.95] as XY), B + 4.3, B + 11.9, 0.3, roof)

// --- The two towers.
function tower(cx: number, tip: number, moroni: boolean) {
  // Tier tops above the floor: the body, two narrowing stages, then the
  // needle spire, which is close to half the tower's height in the photos.
  const T1 = 19, T2 = 24.5, T3 = 29
  /** Pinnacles at a ring's corners and at its face midpoints. */
  const ring = (r: XY[], inset: number, w: number, z0: number, zs: number, zt: number, mids = true) => {
    for (let i = 0; i < 4; i++) {
      const [x, y] = r[i], [x2, y2] = r[(i + 1) % 4]
      const pts: XY[] = [[x, y]]
      if (mids) pts.push([(x + x2) / 2, (y + y2) / 2])
      for (const [px, py] of pts) {
        const dx = px - cx, dy = py, l = Math.hypot(dx, dy)
        pinnacle(cx + (dx / l) * (l - inset), (dy / l) * (l - inset), w, z0, zs, zt)
      }
    }
  }
  /** Tall vertical fins with narrow dark slots between them, on every face. */
  const fins = (r: XY[], n: number, z0: number, z1: number, d: number) => {
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4]
      for (let k = 1; k < n; k++) {
        const t = k / n, ft = 0.035
        onWall(white, a, b, t - ft, t + ft, z0, z1, d)
        if (k < n - 1) onWall(win, a, b, t + 0.5 / n - 0.012, t + 0.5 / n + 0.012, z0 + 1.5, z1 - 1.2)
      }
    }
  }
  // body
  const r1 = diamond(cx, 0, 8.0)
  pslab(white, r1, B + 4.3, B + T1, 0.3, roof)
  fins(r1, 6, B + 6.9, B + T1 - 0.5, 0.45)
  ring(r1, 1.2, 1.0, B + 4.3, B + T1 + 1.5, B + T1 + 6.5)
  // middle stage
  const r2 = diamond(cx, 0, 5.2)
  pslab(white, r2, B + T1, B + T2, 0.25, roof)
  fins(r2, 4, B + T1 + 0.5, B + T2 - 0.3, 0.3)
  ring(r2, 0.8, 0.7, B + T1, B + T2 + 1.2, B + T2 + 5.5)
  // top stage
  const r3 = diamond(cx, 0, 3.2)
  pslab(white, r3, B + T2, B + T3, 0.2, false)
  fins(r3, 3, B + T2 + 0.4, B + T3 - 0.3, 0.2)
  ring(r3, 0.5, 0.45, B + T2, B + T3 + 0.8, B + T3 + 4.0)
  // a last ring of small pinnacles round the spire's foot
  ring(diamond(cx, 0, 2.2), 0.3, 0.3, B + T3, B + T3 + 0.6, B + T3 + 2.6, false)
  // the spire
  pyramid(white, diamond(cx, 0, 2.7), B + T3, B + tip)
  if (moroni) {
    // the gilded angel on a ball, bold enough to read
    const s = B + tip - 1.2
    pslab(gold, diamond(cx, 0, 0.45), s, s + 1.0, 0.1, true)
    pslab(gold, square(cx, 0, 0.42), s + 1.0, s + 4.4, 0.15, true)
    pyramid(gold, square(cx, 0, 0.42), s + 4.4, s + 4.9)
  } else {
    pyramid(gold, diamond(cx, 0, 0.3), B + tip - 0.8, B + tip + 0.2)
  }
}
// Spire centres from the lidar: 19.9 m either side of the anchor.
tower(-19.95, 51.0, false)
tower(19.95, 53.0, true)

if (import.meta.main) {
  await saveModel(ID, 'San Diego California Temple', [
    { part: white, material: WHITE },
    { part: win, material: GLASS },
    { part: gold, material: GOLD },
    { part: roof, material: { ...PALETTE.roof, color: 0xd9d6cf } },
  ], { source: `generators/${ID}.ts` })
}
