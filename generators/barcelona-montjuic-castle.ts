/**
 * Castell de Montjuïc, Barcelona — original procedural geometry, CC0-1.0.
 * bun generators/barcelona-montjuic-castle.ts
 * (uses the shared kit in barcelona-venetian-towers.ts)
 *
 * Map frame: +x east, +y north, z up, metres. BEARING 0. Origin = area
 * centroid of OSM relation/5739196 (the bastioned enceinte), lng 2.166003,
 * lat 41.363346.
 *
 * Evidence
 * - OSM relation/19658818 (historic=castle, "Castell de Montjuïc",
 *   wikidata Q2500125, checked: "Montjuïc Castle", 41.3634 2.1662). It is
 *   not a building; inside it: the enceinte relation/5739196 (building=yes,
 *   barrier=wall, historic=castle_wall: the star-shaped bastioned trace,
 *   271 × 244 m, with the wall's inner face as its inner ring), the keep
 *   relation/1574427 (building=castle, a quadrilateral about 90 m a side
 *   round the Plaça d'Armes), the watchtower way/646482521 ("Torre de
 *   guaita", 2 levels), the Casa del Director way/243594655 on the west
 *   bastion and the building way/646482911 on the north front. All outlines
 *   measured from the OSM nodes. The outer works further south-west (other
 *   members of relation/19658818) are walls, not buildings, and are not
 *   drawn.
 * - Mapterhorn terrain (terrain.ts grid 2.166003 41.363346 150 10): the
 *   fortress platform reads 136 m in the table almost everywhere inside the
 *   enceinte, the moat round it 122–125 m (11–14 m lower), the glacis on the
 *   west 125–130 m, and the hill falls away steeply to the east and south
 *   beyond. So the bastion walls stand about 12.5 m over the moat. The
 *   map's fill takes the platform out of the terrain inside the footprint,
 *   so the model carries it: the enceinte is drawn as a solid platform with
 *   battered scarp walls and a parapet, its top as the fortress terrace.
 *   This is the fortification itself, not ground; the moat floor and the
 *   glacis are left to the map.
 * - Commons photos (daylight, EVIDENCE):
 *   "Castell de Montjuïc 2023-09-13.jpg" (Horcrux, CC BY 4.0: the keep's
 *   entrance front over its moat, the watchtower);
 *   "Barcelona - Montjuïc - Castell de Montjuïc 1799 by Juan Martin
 *   Cermeño - Courtyard - View ENE.jpg" (Txllxt TxllxT, CC BY-SA 4.0: the
 *   Plaça d'Armes, the arcaded casemates, the tower over them);
 *   "Barcelona - Montjuïc - Castell de Montjuïc 1799 - Carretera de
 *   Montjuïc - Panorama View of the Castle 01.jpg" (Txllxt TxllxT, CC BY-SA
 *   4.0: the bastions and the keep from the north-west);
 *   "Castell Montjuic, Barcelona (P1170651).jpg" (Matti Blume, CC BY-SA
 *   4.0, 2024).
 *
 * Heights (above the model's y = 0, the moat): the platform top PLAT (see
 * the constant; 12.5 m over the moat from the terrain, adjusted for the
 * map's drape, see below); the keep's casemate ring 9.5 m above the
 * platform (the courtyard photo: the wall is about twice the arcade
 * height), its roof a walkable terrace; the watchtower about 12 m above the
 * keep with merlons; the two buildings on the bastions 7 m. Estimated from
 * photos.
 *
 * Colours from the daylight photos pulled to the palette: the masonry a
 * sandy brown 0xc4a17d (brick and stone read as one), the terraces and keep
 * roof 0xaba48c, arched casemate openings `window`, the buildings' roofs
 * `roof`.
 *
 * Doubts: the drape. The model is 270 m across on a summit; the map lifts
 * each vertex by the ground under it and fades to the footprint's mean by
 * 25 m, so the platform's walls are drawn shorter or taller than built in
 * places; the final terrain.ts check result is in the report. The keep's
 * own dry moat, its entrance portal and bridge, the cannons and the mast on
 * the tower are left out.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { emit, block, prism, walls, capAny, offset, archPanel, panel, rot, type P2 } from './barcelona-venetian-towers'

const ANCHOR = { lng: 2.166003, lat: 41.363346 }
const ENC_CW: P2[] = [[-137.2, 9.7], [-11.8, 50.9], [-9.7, 54.7], [-8.2, 59.1], [-7.2, 67.1], [-8.5, 75.9], [-23.6, 74.2], [-25.8, 77.5], [-23.6, 80.0], [50.6, 123.1], [52.0, 124.3], [63.5, 81.2], [48.1, 69.0], [64.0, 41.7], [68.3, 34.5], [84.6, 6.8], [101.2, 13.3], [102.8, 12.8], [134.4, -18.3], [76.7, -40.6], [66.8, -31.4], [-60.4, -120.5], [-64.7, -96.1], [-69.4, -74.3], [-56.0, -62.3], [-82.9, -14.9], [-101.7, -21.6], [-135.7, 8.3]]
/** The enceinte, counter-clockwise (OSM's ring runs clockwise). */
const ENC: P2[] = [...ENC_CW].reverse()
const KEEP: P2[] = [[-47.1, 19.1], [1.2, -63.8], [70.6, -12.7], [30.9, 54.5]]
const DIRECTOR: P2[] = [[-110.7, 7.0], [-107.2, -3.7], [-75.0, 7.1], [-78.4, 17.7]]
const NORTH: P2[] = [[7.4, 88.8], [-0.4, 92.3], [-8.0, 77.2], [-5.7, 70.5], [2.3, 69.5], [6.6, 74.3], [11.9, 83.5], [28.5, 91.7], [43.9, 100.9], [38.5, 109.8], [9.3, 92.8]]

const PLAT = Number(process.env.PLAT ?? 12.5)
const KEEP_H = PLAT + 9.5

const stoneM: MaterialSpec = { ...finish('castle-stone', 0xc4a17d), floodlight: (q, n) => (n[2] > 0.7 ? 0.2 : 0.7) }
const terraceM = finish('castle-terrace', 0xaba48c)
const stone = new Part(), terrace = new Part(), win = new Part(), roof = new Part()

// Platform: battered scarp walls from the moat to a cordon, a parapet, the terrace inside.
const encTop = offset(ENC, -1.2) // batter: the wall leans in 1.2 m over its height
{
  const ring = (r: P2[], z: number): V3[] => r.map(([x, y]) => [x, y, z])
  // split long edges so the map's drape can bend them
  const counts = ENC.map((a, i) => { const b = ENC[(i + 1) % ENC.length]; return Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 5)) })
  const dens = (r: P2[]): P2[] => {
    const out: P2[] = []
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], n = counts[i]
      for (let k = 0; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n])
    }
    return out
  }
  const base = dens(ENC)
  // walk the same densified points for the top (offset per point along the original edges)
  const top = dens(encTop)
  if (top.length !== base.length) throw new Error('ring mismatch')
  const inner = dens(offset(ENC, -2.6))
  stone.loft([ring(base, 0), ring(top, PLAT)])
  // cordon (a rounded torus-like roll) and parapet
  const cord = dens(offset(ENC, -0.9))
  stone.loft([ring(top, PLAT), ring(cord, PLAT + 0.2), ring(cord, PLAT + 0.6), ring(top, PLAT + 0.8), ring(top, PLAT + 1.8), ring(inner, PLAT + 1.8), ring(inner, PLAT + 0.9)])
  // terrace: the top inside the parapet
  capAny(terrace, inner, PLAT + 0.9)
  void walls
}

// Keep: a ring of casemates round the Plaça d'Armes.
{
  const inner = offset(KEEP, -15)
  const ring = (r: P2[], z: number): V3[] => r.map(([x, y]) => [x, y, z])
  stone.loft([ring(KEEP, PLAT), ring(KEEP, KEEP_H - 0.6), ring(offset(KEEP, 0.3), KEEP_H - 0.3), ring(offset(KEEP, 0.3), KEEP_H)])
  stone.loft([ring(offset(KEEP, 0.3), KEEP_H), ring(KEEP, KEEP_H + 0.9), ring(offset(KEEP, -0.8), KEEP_H + 0.9), ring(offset(KEEP, -0.8), KEEP_H + 0.3)])
  // roof terrace between the parapets
  const roofRing = [...offset(KEEP, -0.8)]
  for (let i = 0; i < 4; i++) {
    const a = roofRing[i], b = roofRing[(i + 1) % 4], c = inner[(i + 1) % 4], d = inner[i]
    terrace.quad([a[0], a[1], KEEP_H + 0.3], [b[0], b[1], KEEP_H + 0.3], [c[0], c[1], KEEP_H + 0.3], [d[0], d[1], KEEP_H + 0.3])
  }
  // courtyard walls face inward: the inner ring reversed
  const rin = [...inner].reverse()
  stone.loft([ring(rin, KEEP_H + 0.3), ring(rin, PLAT)].reverse())
  // arched casemate openings round the courtyard, about every 8 m
  for (let i = 0; i < 4; i++) {
    const a = inner[i], b = inner[(i + 1) % 4]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]), t: P2 = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
    const n: P2 = [-t[1], t[0]] // into the courtyard (inner ring is CCW, its left is inside)
    const tt: P2 = [-n[1], n[0]]
    const count = Math.floor(len / 8)
    for (let k = 0; k < count; k++) {
      const s = (k + 0.5) * (len / count)
      archPanel(win, [a[0] + t[0] * s, a[1] + t[1] * s], tt, n, 3.4, PLAT, PLAT + 3.0, 0.05, 8)
    }
  }
  // a few windows on the outer faces
  for (let i = 0; i < 4; i++) {
    const a = KEEP[i], b = KEEP[(i + 1) % 4]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]), t: P2 = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
    const n: P2 = [t[1], -t[0]]
    for (let k = 1; k < 6; k++) {
      const s = (k / 6) * len
      const c: P2 = [a[0] + t[0] * s, a[1] + t[1] * s]
      panel(win, [c[0] - t[0] * 0.8, c[1] - t[1] * 0.8], [c[0] + t[0] * 0.8, c[1] + t[1] * 0.8], PLAT + 4, PLAT + 6.2, n)
    }
  }
}

// Watchtower on the keep's north-east range.
{
  const cx = 47.5, cy = 18.8, a = Math.atan2(-67.2, 39.6)
  const TOP = KEEP_H + 12
  block(stone, cx, cy, 4.3, 4.3, PLAT, TOP - 1.2, 0.3, a)
  block(stone, cx, cy, 4.6, 4.6, TOP - 1.2, TOP - 0.6, 0.2, a)
  for (let k = 0; k < 4; k++) for (const s of [-2.9, 0, 2.9]) {
    const [ox, oy] = rot([s, 4.0], a + (k * Math.PI) / 2)
    block(stone, cx + ox, cy + oy, 0.65, 0.4, TOP - 0.6, TOP + 0.9, 0.12, a + (k * Math.PI) / 2)
  }
  for (let k = 0; k < 4; k++) {
    const n = rot([0, 1], a + (k * Math.PI) / 2), t = rot([-1, 0], a + (k * Math.PI) / 2)
    archPanel(win, [cx + n[0] * 4.3, cy + n[1] * 4.3], t, n, 1.1, TOP - 5.2, TOP - 3.6, 0.05, 6)
  }
}

// Buildings on the bastions.
prism(stone, DIRECTOR, PLAT, PLAT + 6.2, false, 6)
prism(roof, DIRECTOR.map(([x, y]) => [x, y] as P2), PLAT + 6.2, PLAT + 7.0)
prism(stone, NORTH, PLAT, PLAT + 6.2, false, 6)
prism(roof, NORTH, PLAT + 6.2, PLAT + 7.0)

await emit('barcelona-montjuic-castle', 'Castell de Montjuïc', [
  { part: stone, material: stoneM },
  { part: terrace, material: terraceM },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
], { bearing: 0, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: KEEP_H + 12.9, replaces: ['relation/5739196', 'relation/1574427', 'way/646482521', 'way/243594655', 'way/646482911'] })
