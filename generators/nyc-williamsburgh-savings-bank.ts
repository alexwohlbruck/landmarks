/**
 * Williamsburgh Savings Bank Tower (One Hanson Place), Brooklyn — procedural, CC0-1.0, no textures.
 * bun generators/nyc-williamsburgh-savings-bank.ts
 *
 * Map frame: x = model east (towards Flatbush Avenue), y = model north
 * (Hanson Place), z up, metres. Placed at bearing -6.7°, the outline's long
 * walls. Anchor: area centroid of the OSM outline way/250979509.
 *
 * Evidence
 * - OSM way/250979509 (outline, 29 × 60 m, 156 m, 37 levels) and its parts
 *   700246652 (dome), 1517819427/428 (clock tower 12 × 12 m, 140–145 m),
 *   1517819429 + relation/20712618 (the slab under it, 16 × 26 m, 110–115 m),
 *   1517819432–444 (the stepped wings, 60–85 m; the 24 m banking-hall base;
 *   a 10 m strip along the east side).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), resampled into the model frame
 *   (/tmp/city/nyc/work/nyc-williamsburgh-savings-bank/bands.png), heights
 *   above the street (13.5 m NAVD88): base 27 m with a light court on the
 *   Ashland Place side (x < -11.5, y -16…14); the wings to 70 m on all four
 *   corners; a ring at 81 m; the main slab (x -9.5…8.5, y -24…26) at 90 m;
 *   the upper slab (x -9…5, y -15.6…12) at 113–117 m, its centre highest; the clock tower
 *   (x -9…5, y -8.6…5.4, flush with the upper slab east and west) to
 *   146 m; the drum and dome to 158 m. The 2 m cells blur the east side,
 *   which is drawn as a plain step.
 * - Published: 1929, Halsey, McCormack & Helmle; 156 m (512 ft) to the
 *   dome, 37 storeys; four clock faces 27 ft (8.2 m) across; a gilded
 *   ribbed dome; buff brick and limestone over a limestone banking hall with
 *   a great arched entrance (Wikipedia; NYC LPC 1977).
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-williamsburgh-savings-bank/photos/credits.txt:
 *   from the south-east (Gryffindor, CC BY-SA 3.0), down Flatbush Avenue
 *   from the south (CityLimitsJunction, CC0), from State Street and from
 *   Hanson Place (Beyond My Ken, CC BY-SA 4.0), from the south-west
 *   (Thomson200, CC0).
 *
 * Estimated: storey heights (3.65 m) and window bays (one panel per bay,
 * two floors), the arcade rows at the top of each setback (drawn as
 * arched panels, counts from the photos), the banking hall's arches, the
 * clock stage's window and belfry layout, the drum's size (lidar: ~12 m
 * across), the lantern. The east side, hemmed in by neighbours, is drawn
 * like the west.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, finishModel, circle, type Facade } from './nyc-570-lexington'
import { archPanel, rectPanel, discPanel, band, block, spread, wallFrame } from './nyc-city-hall'

const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), gold = new Part()

const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const edges = (r: XY[]) => r.map((a, i) => [a, r[(i + 1) % r.length]] as [XY, XY])
const len = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

/** A row of round-arched panels across a wall, the loggias that cap each setback. */
function arcade(a: XY, b: XY, z0: number, z1: number, pitch: number, ratio = 0.55, margin = 1.2) {
  const L = len(a, b)
  if (L < 4) return
  const n = Math.max(1, Math.round((L - 2 * margin) / pitch))
  const w = ((L - 2 * margin) / n) * ratio
  for (const s of spread(margin, L - margin, n)) archPanel(win, a, b, s, w, z0, z1, 0.06, 8)
}

const shaft: Facade = { bay: 4.3, ratio: 0.52, floor: 3.65, group: 2, spandrel: 1.9, sill: 1.6, head: 6.5, ground: 30, margin: 1.4 }

// --- The banking-hall base, 27 m, with the light court on the Ashland Place side ---
const BASE = 27
const base = rect(-14.4, -29.8, 10.7, 30.4)
prism({ wall: stone, win: null, roof, ring: base, z0: 0, z1: BASE, facade: null, bevel: 0.4 })
band(trim, base, BASE - 1.2, BASE, 0.5) // cornice over the banking hall
band(stone, base, 0, 1.5, 0.25) // granite plinth
prism({ wall: stone, win: null, roof, ring: rect(10.7, -29.8, 14.2, 30.4), z0: 0, z1: 9.5, facade: null, bevel: 0.3 })
{
  const [S, E, N, W] = edges(base)
  // South front (Atlantic Avenue/Flatbush): the great arched entrance, tall arched windows either side.
  archPanel(win, S[0], S[1], 12.55, 8.4, 0, 18.5, 0.06)
  for (const s of [3.5, 7.4, 17.7, 21.6]) archPanel(win, S[0], S[1], s, 2.3, 5, 15.5, 0.06)
  // Ashland Place: tall round-arched windows of the banking hall, both sides of the court.
  for (const s of [3.5, 8.0, 12.5, 47.7, 52.2, 56.7]) archPanel(win, W[0], W[1], s, 2.6, 4.5, 17.5, 0.06)
  // Hanson Place and the east wall: two storeys of windows.
  for (const [a, b] of [N, E]) {
    const L = len(a, b)
    for (const s of spread(1.5, L - 1.5, Math.round(L / 4))) { rectPanel(win, a, b, s, 1.7, 3, 7.8); rectPanel(win, a, b, s, 1.7, 10.5, 16.5) }
  }
  // The arcade of arched windows along the top of the base, all round.
  for (const [a, b] of [S, E, N, W]) arcade(a, b, 19.5, 24.8, 3.1, 0.6)
}

// --- The stepped tower ---
type Tier = { ring: XY[]; z0: number; z1: number; arc: number; skip?: number[] }
const tiers: Tier[] = [
  // The four corner wings to 70 m, open in the middle of the Ashland side over the court.
  { ring: [[-14.4, -29.8], [10.7, -29.8], [10.7, 30.4], [-14.4, 30.4], [-14.4, 14], [-11.5, 14], [-11.5, -16], [-14.4, -16]], z0: BASE, z1: 70, arc: 3.6 },
  { ring: rect(-10, -28, 9.5, 29), z0: 70, z1: 81, arc: 3.6 },
  { ring: rect(-9.5, -24, 8.5, 26), z0: 81, z1: 90, arc: 3.6 },
  // The upper slab: its ends, either side of the clock tower, stop a storey short of the centre.
  { ring: rect(-9, -15.6, 5, -8.6), z0: 90, z1: 113, arc: 3.0, skip: [2] },
  { ring: rect(-9, 5.4, 5, 12), z0: 90, z1: 113, arc: 3.0, skip: [0] },
  { ring: rect(-9, -8.6, 5, 5.4), z0: 90, z1: 116.5, arc: 3.3, skip: [0, 2] },
]
for (const t of tiers) {
  prism({ wall: stone, win, roof, ring: t.ring, z0: t.z0, z1: t.z1, facade: shaft, bevel: 0.4 })
  band(trim, t.ring, t.z1 - 1.0, t.z1 - 0.3, 0.3)
  edges(t.ring).forEach(([a, b], i) => { if (!t.skip?.includes(i)) arcade(a, b, t.z1 - 5.6, t.z1 - 1.6, t.arc) })
}

// --- The clock tower: flush with the upper slab east and west, a 14 m square ---
const CT = rect(-9, -8.6, 5, 5.4), CZ0 = 116.5, CZ1 = 145.5
const cx = -2, cy = -1.6
prism({ wall: stone, win: null, roof, ring: CT, z0: CZ0, z1: CZ1, facade: null, bevel: 0.45 })
band(trim, CT, CZ1 - 1.2, CZ1 - 0.2, 0.35)
band(trim, CT, 123.2, 124.0, 0.3)
for (const [a, b] of edges(CT)) {
  const L = len(a, b), m = L / 2
  // Two narrow window bays under the clock.
  for (const ds of [-1.6, 1.6]) rectPanel(win, a, b, m + ds, 1.6, 117.5, 122.6)
  // The clock: a dark ring round a pale dial, 8.2 m across.
  discPanel(win, a, b, m, 130.6, 4.15, 0.08, 16)
  discPanel(trim, a, b, m, 130.6, 3.55, 0.14, 16)
  // Hands: two bold bars.
  const f = wallFrame(a, b, 0.2)
  const hand = (ang: number, r: number, w: number) => {
    const c = [m, 130.6], d = [Math.cos(ang), Math.sin(ang)], q = [-d[1] * w, d[0] * w]
    win.quad(f.at(c[0] + q[0], c[1] + q[1]), f.at(c[0] - q[0], c[1] - q[1]), f.at(c[0] - q[0] + d[0] * r, c[1] - q[1] + d[1] * r), f.at(c[0] + q[0] + d[0] * r, c[1] + q[1] + d[1] * r))
  }
  hand(Math.PI * 0.62, 2.9, 0.22)
  hand(-Math.PI * 0.05, 2.1, 0.26)
  // The belfry: paired round arches over the clock.
  for (const ds of [-2.1, 2.1]) archPanel(win, a, b, m + ds, 2.6, 136.6, 143.4, 0.06, 8)
}
// Corner piers rising a little above the parapet.
for (const [x, y] of CT) block(stone, x - (x < cx ? 0 : 1.6), y - (y < cy ? 0 : 1.6), x + (x < cx ? 1.6 : 0), y + (y < cy ? 1.6 : 0), CZ1, CZ1 + 1.0)

// --- The drum and the gilded ribbed dome ---
{
  const ring = (r: number, z: number, n = 8, ph = Math.PI / 8): V3[] => circle(cx, cy, r, n, ph).map(([x, y]) => [x, y, z] as V3)
  stone.loft([ring(6.3, CZ1), ring(6.3, 149.4)])
  trim.loft([ring(6.3, 149.4), ring(6.6, 149.9), ring(6.6, 150.4), ring(6.0, 150.6)])
  trim.cap(ring(6.0, 150.6), true)
  // Small arched openings round the drum.
  const oct = circle(cx, cy, 6.3, 8, Math.PI / 8)
  for (let i = 0; i < 8; i++) { const a = oct[i], b = oct[(i + 1) % 8]; archPanel(win, a, b, len(a, b) / 2, 1.3, 146.4, 148.9, 0.05, 6) }
  // Twelve flat gores read as the ribs; a faceted (not smooth) dome on purpose.
  const N = 12, R = 5.7, Z = 150.6, H = 6.4, K = 5
  const rings: V3[][] = []
  for (let k = 0; k <= K; k++) {
    const t = (k / K) * (Math.PI / 2)
    rings.push(circle(cx, cy, Math.max(R * Math.cos(t), 0.6), N).map(([x, y]) => [x, y, Z + H * Math.sin(t) * (k === K ? 0.97 : 1)] as V3))
  }
  gold.loft(rings)
  gold.cap(rings[K], true)
  // Lantern and finial.
  const lz = rings[K][0][2]
  const lr = (r: number, z: number): V3[] => circle(cx, cy, r, 8).map(([x, y]) => [x, y, z] as V3)
  gold.loft([lr(0.6, lz), lr(0.6, lz + 0.8), lr(0.15, lz + 1.6)])
}

finishModel('Williamsburgh Savings Bank Tower', 'nyc-williamsburgh-savings-bank', [
  { part: stone, material: finish('wsb-limestone', 0xe4dac8) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: gold, material: finish('wsb-gilded-dome', 0xcfae5f) },
], { bearing: -6.7, osm: 'way/250979509', height: 158 }, 5000)
