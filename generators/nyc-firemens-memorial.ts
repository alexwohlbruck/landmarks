/**
 * Firemen's Memorial, Riverside Drive at 100th Street, Manhattan (H. Van
 * Buren Magonigle, architect; Attilio Piccirilli, sculptor; 1913) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-firemens-memorial.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 115°: model +y is the back, on Riverside Drive (ESE); model −y the
 * front, over its terrace, basin and the wide stair down into Riverside Park
 * (WNW); the long axis (model x) runs along the drive (the lidar block's
 * axis, 25°). Anchor: the block's centre in the lidar, 1.9 m east and 2.7 m
 * south of OSM node/357620587 (historic=memorial, no building), so
 * `replaces` is empty.
 *
 * y = 0 is the foot of the front stair, the lowest ground under the model;
 * the terrace is 2.0 m up and Riverside Drive behind 3.8 m up (lidar). The
 * terrace is ground and not drawn: the stair is drawn running straight up
 * to the basin and base (the real stair lands ~5 m short of them), and the
 * base reaches down to y = 0. Elevation 0.
 *
 * Evidence
 * - Published (NYC Parks; Wikipedia): pink Tennessee marble, a sarcophagus-
 *   like block with a bronze relief of a horse-drawn engine on the front and
 *   the dedication on the back; seated groups Duty and Sacrifice at the
 *   ends; a fountain basin and a wide stair to the park.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m (read before the cache
 *   was cleared; /tmp/city/nyc/work/nyc-firemens-memorial/lid.json): block
 *   top 10.0 m (6.2 m above the drive), the block's axis at 25°, ~8–9 m
 *   long; the basin's rim ~1 m over the terrace; the stair falling 2.0 m
 *   over ~7 m from the terrace to the park.
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-firemens-memorial/photos/credits.txt: Pburka
 *   (CC BY 3.0, the front and stair from the park), Jim.henderson (public
 *   domain: the back square on from the drive, the relief, the north end),
 *   Deansfa (CC BY-SA 4.0, from the 100th Street corner).
 *
 * Estimated from the back photo scaled to the lidar's 6.2 m: the upper block
 * 8.6 × 3.0 m from 5.9 to 9.1 m, cornice and attic to 10.0 m; the base 12.2 m
 * long with rounded ends carrying the groups; the groups 2.2 m tall, each a
 * seated woman with a child standing at her knee (Duty with a dead fireman
 * across her lap is drawn as the same bold seated mass); the basin and the
 * stair's width (10 m, thirteen risers). The relief and inscription are
 * flat panels; the lion-head spout and the lamps are left out.
 */
import { Part, type V3 } from './mesh'
import { finishModel, prism, chamferRect } from './nyc-570-lexington'
import { smooth, block } from './nyc-columbus-monument'
import { robed, seated } from './nyc-uss-maine-monument'

const marble = new Part(), base = new Part(), bronze = new Part(), figures = new Part()

const TZ = 2.0 // the terrace in front of the memorial

// --- The wide stair from the park up to the monument's base, its solid
// ends hidden by low cheek walls. ---
{
  const n = 13, yTop = -3.6, yBot = -10.6, X0 = -5.5, X1 = 4.5
  const run = (yTop - yBot) / n, rise = TZ / n
  for (let k = 0; k < n; k++) {
    const z = TZ - k * rise, y1 = yTop - k * run, y0 = y1 - run
    base.quad([X0, y0, z], [X1, y0, z], [X1, y1, z], [X0, y1, z]) // tread
    base.quad([X0, y0, z - rise], [X1, y0, z - rise], [X1, y0, z], [X0, y0, z]) // riser, facing −y
    // the solid ends under each tread
    base.quad([X1, y0, 0], [X1, y1, 0], [X1, y1, z], [X1, y0, z])
    base.quad([X0, y1, 0], [X0, y0, 0], [X0, y0, z], [X0, y1, z])
  }
  // Low cheek walls.
  for (const x0 of [X0 - 0.7, X1]) {
    const prof: [number, number][] = [[yTop, TZ - 0.6], [yTop, TZ + 0.35], [yBot + 0.6, 0.45], [yBot - 0.3, 0.45], [yBot - 0.3, 0]]
    const A = prof.map(([y, z]): V3 => [x0, y, z]), B = prof.map(([y, z]): V3 => [x0 + 0.7, y, z])
    for (let i = 0; i < prof.length; i++) { const j = (i + 1) % prof.length; base.quad(A[j], A[i], B[i], B[j]) }
    for (let i = 1; i < prof.length - 1; i++) { base.tri(A[0], A[i], A[i + 1]); base.tri(B[0], B[i + 1], B[i]) }
  }
}

// --- The basin in front of the relief: a low curved marble trough. ---
prism({ wall: base, win: null, roof: base, ring: chamferRect(-4.4, -3.6, 3.4, -1.0, 1.1), z0: 0, z1: TZ + 1.0, facade: null, bevel: 0.15 })

// --- The base: a long plinth with rounded ends that carry the groups. ---
const BZ = 5.9
{
  const ring: [number, number][] = []
  const cx0 = -4.95, cx1 = 3.95, r = 1.35, yc = 0.1
  for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + (i / 8) * Math.PI; ring.push([cx1 + r * Math.cos(a), yc + 2.0 * Math.sin(a)]) }
  for (let i = 0; i <= 8; i++) { const a = Math.PI / 2 + (i / 8) * Math.PI; ring.push([cx0 + r * Math.cos(a), yc + 2.0 * Math.sin(a)]) }
  prism({ wall: base, win: null, roof: base, ring, z0: 0, z1: BZ - 0.5, facade: null, bevel: 0.15 })
  // A moulded course on top, a little proud.
  const grown = ring.map(([x, y]): [number, number] => [-0.5 + (x + 0.5) * 1.03, yc + (y - yc) * 1.07])
  prism({ wall: base, win: null, roof: marble, ring: grown, z0: BZ - 0.5, z1: BZ, facade: null, bevel: 0.12 })
}

// --- The upper block: piers framing the relief, cornice, attic. ---
const X0 = -4.8, X1 = 3.8, Y0 = -1.4, Y1 = 1.6, TOPW = 9.1
block(marble, X0, Y0, X1, Y1, BZ, TOPW, 0.08, 0.06)
block(marble, X0 - 0.3, Y0 - 0.3, X1 + 0.3, Y1 + 0.3, TOPW, TOPW + 0.5, 0.1, 0.14)
block(marble, X0 + 0.1, Y0 + 0.1, X1 - 0.1, Y1 - 0.1, TOPW + 0.5, 10.0, 0.08, 0.1)
// A moulded band at the block's foot.
block(marble, X0 - 0.12, Y0 - 0.12, X1 + 0.12, Y1 + 0.12, BZ, BZ + 0.35, 0.06, 0.08)
// The bronze relief on the front, set between the end piers.
{
  const y = Y0 - 0.05
  bronze.quad([X0 + 1.15, y, 6.45], [X1 - 1.15, y, 6.45], [X1 - 1.15, y, 8.55], [X0 + 1.15, y, 8.55])
}
// The dedication panel on the back, a sunk field in the shaded marble.
{
  const y = Y1 + 0.03
  base.quad([X1 - 1.15, y, 6.45], [X0 + 1.15, y, 6.45], [X0 + 1.15, y, 8.55], [X1 - 1.15, y, 8.55])
}

// --- The end groups, Duty (north) and Sacrifice (south): a seated woman with
// a child standing at her knee, on the rounded ends, facing out along the
// drive. ---
smooth(figures, q => {
  for (const s of [-1, 1]) {
    const cx = s < 0 ? -5.6 : 4.6
    // Seated mass, facing −y (the front), a robed child beside it, outboard.
    seated(q, [cx, 0.35, BZ], 1.7, 2.0, 2.6)
    robed(q, [cx - s * 0.1, -0.85, BZ], 1.75, [])
  }
}, 55)

finishModel("Firemen's Memorial", 'nyc-firemens-memorial', [
  { part: marble, material: { name: 'marble-pink', color: 0xe6d0c4, roughness: 0.8 } },
  { part: base, material: { name: 'marble-pink-shade', color: 0xd9c0b3, roughness: 0.85 } },
  { part: figures, material: { name: 'marble-figures', color: 0xeee2d8, roughness: 0.75 } },
  { part: bronze, material: { name: 'bronze', color: 0x50574f, roughness: 0.7 } },
], { bearing: 115, osm: 'node/357620587', height: 10.0 }, 5000)
