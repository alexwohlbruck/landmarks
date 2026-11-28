/**
 * Sengan-yagura (千貫櫓) of Osaka Castle, Chūō-ku, Osaka: the two-storey
 * corner turret on the stone wall north of the Ōtemon, over the west outer
 * moat — procedural, CC0-1.0.
 * bun generators/osaka-castle-sengan-yagura.ts
 *
 * Writes models/osaka-castle-sengan-yagura.glb. Split from the Ōtemon
 * model (osaka-castle-otemon.ts): see that header. Built with the kit in
 * osaka-castle.ts (croof, hafu, shachi, panelOn).
 *
 * Map frame: x east, y north, z up, metres; bearing 356 (the outline's
 * sides run at 356° / 86°). Origin: the centre of OSM way/48123162
 * (135.5228970, 34.6856573).
 *
 * Identity, in order: the white two-storey turret on the corner of the
 * battered granite wall; grey tile roofs, the upper one hip-and-gable with
 * its gable to the south; a projecting bay with its own gable on each of
 * the two outer (west and south) faces under the lower roof; dark barred
 * windows.
 *
 * Evidence:
 *  - OSM way/48123162 (千貫櫓, building=yes, levels 2, Important Cultural
 *    Property): 18.0 × 19.8 m, read as the lower eave's outline (the walls
 *    1.2 m inside it). No height tag.
 *  - published (ja.wikipedia 大坂城; Osaka City): two storeys, two roofs;
 *    its posts were raised in 1620, one of the oldest buildings in the
 *    castle; guards the Ōtemon from the north.
 *  - heights (estimated from Zairon's level view from the Ōtemon bridge,
 *    "Osaka Osaka-jo Sengan-yagura 6.jpg", scaled by the lower walls'
 *    15.6 m; 663highland's west view agrees): lower walls 4.6, lower eave
 *    5.3, the bays' gables to 7.3; upper storey 13.2 × 14.8 m, its eave 9.1,
 *    gable foot 10.0, ridge 12.8. Zairon's close views from the moat are
 *    perspective-corrected and were used for layout only.
 *  - the stone wall: the turret's floor is drawn 5.5 m above the lowest
 *    ground under it, the inner (east) ground on the map's terrain; the
 *    real wall drops ~12 m to the water, which the map's smoothed z14
 *    terrain (z15 missing here) does not show. Battered on the west and
 *    south. Elevation 0.
 *  - colours (daylight photos, pulled to the palette): plaster #f1efe9;
 *    dark tile #5d6067 (sampled #575860-#5a5c65 in Zairon's south view);
 *    granite #6f6962 (sampled #5a4e44 in shade there, #857f77 sunlit at
 *    the Ōtemon), drawn in courses; windows charcoal #4a4f57.
 *  - night: no night photo found; nothing is lit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Osaka Osaka-jo Sengan-yagura 1.jpg-6.jpg, Zairon, CC BY-SA 4.0 (south-west, west, south)
 *  - Osaka Castle 05s5s4272.jpg, 663highland, CC BY 2.5 (west, over the moat)
 *  - Osaka Castle 01bs3200.jpg, 663highland, CC BY 2.5 (from above, south-west)
 *  - Sengan-Yagura Turret and Otemon Gate (5239981198).jpg, KimonBerlin, CC BY-SA 2.0 (south-west)
 * No commercial imagery. No look-only references.
 *
 * Doubts: the inner (north and east) faces are not photographed and are
 * drawn plain; the bays' positions along the faces are read from oblique
 * views; the upper storey's size is estimated.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { placed, save, type Mat } from './tokyo-meiji-jingu'
import { box } from './seoul-geunjeongjeon'
import { croof, hafu, panelOn, shachi, coursed, type HafuParts } from './osaka-castle'

const F = 5.5

function build() {
  const plaster = new Part(), tile = new Part(), stone = new Part(), dark = new Part()
  const L = { hx: 7.8, hy: 8.7 }, U = { hx: 6.6, hy: 7.4 }
  // ---- The stone wall's corner: battered on the outer (west, south) faces
  const ring = (d: number, z: number): V3[] => [[-L.hx - 0.3 - d, -L.hy - 0.3 - d, z], [L.hx + 1.2, -L.hy - 0.3 - d, z], [L.hx + 1.2, L.hy + 1.2, z], [-L.hx - 0.3 - d, L.hy + 1.2, z]]
  coursed(stone, (t) => ring(1.4 * Math.pow(1 - t, 1.8), F * t), 5)

  // ---- Lower storey and its projecting bays -------------------------------
  box(plaster, -L.hx, -L.hy, F, L.hx, L.hy, F + 4.6, 'b')
  const bayS = { x0: -6.0, x1: 2.0 }, bayW = { y0: -0.5, y1: 6.5 }
  box(plaster, bayS.x0, -L.hy - 1.0, F, bayS.x1, -L.hy, F + 4.3, 'bn')
  box(plaster, -L.hx - 1.0, bayW.y0, F, -L.hx, bayW.y1, F + 4.3, 'be')
  const HP: HafuParts = { tile, ridge: tile, plaster, dark: plaster, gold: tile, win: dark }
  hafu(placed(HP, 0, (bayS.x0 + bayS.x1) / 2, -L.hy - 1.0) as HafuParts, { w: 3.9, zb: F + 4.3, za: F + 7.3, D: 3.4, o: 0.5, th: 0.35, band: 0, detail: false, finial: { kind: 'spike', h: 0.6 } })
  hafu(placed(HP, -Math.PI / 2, -L.hx - 1.0, (bayW.y0 + bayW.y1) / 2) as HafuParts, { w: 3.5, zb: F + 4.3, za: F + 7.1, D: 3.4, o: 0.5, th: 0.35, band: 0, detail: false, finial: { kind: 'spike', h: 0.6 } })
  // windows: barred, dark
  const w = (f: 's' | 'n' | 'e' | 'w', hx: number, hy: number, t: number, z0: number, z1: number, ww = 1.2, cx = 0, cy = 0) => panelOn(dark, f, hx, hy, t - ww / 2, t + ww / 2, z0, z1, 0.04, cx, cy)
  for (const t of [-3.4, -0.6]) w('s', L.hx, L.hy + 1.0, t, F + 2.3, F + 3.3)
  for (const t of [4.6, 6.6]) w('s', L.hx, L.hy, t, F + 2.3, F + 3.3, 1.0)
  for (const t of [1.6, 4.4]) w('w', L.hx + 1.0, L.hy, -t, F + 2.3, F + 3.3)
  for (const t of [-6.4, -4.2]) w('w', L.hx, L.hy, -t, F + 2.3, F + 3.3, 1.0)
  for (const t of [-5, -1.7, 1.7, 5]) { w('n', L.hx, L.hy, t, F + 2.3, F + 3.3, 1.0); w('e', L.hx, L.hy, t, F + 2.3, F + 3.3, 1.0) }
  // loopholes (sama): small squares low on the outer faces
  for (const t of [-7, -5, 3.5, 5.5, 7]) w('s', L.hx, L.hy, t, F + 1.0, F + 1.4, 0.35)
  for (const t of [-7.5, -5.5, -3.5, 7.5]) w('w', L.hx, L.hy, t, F + 1.0, F + 1.4, 0.35)

  // ---- Lower roof, upper storey, upper roof -------------------------------
  const RP = { roof: tile, ridge: tile, gable: plaster, soffit: plaster, edge: plaster }
  croof(RP, { coarse: 2, kind: 'skirt', ex: 9.0, ey: 9.9, ze: F + 5.3, gx: U.hx, gy: U.hy, zg: F + 6.6, lift: 0.85, flare: 0.6, sag: 0.4, th: 0.45, pow: 2.2,
    soffit: { bx: L.hx, by: L.hy, zb: F + 4.6 }, hipRidge: { w: 0.32, h: 0.28 } })
  box(plaster, -U.hx, -U.hy, F + 5.4, U.hx, U.hy, F + 8.4, 'bt')
  for (const f of ['s', 'w', 'n', 'e'] as const) {
    const len = f === 's' || f === 'n' ? U.hx : U.hy
    for (const t of [-0.62 * len, 0, 0.62 * len]) w(f, U.hx, U.hy, t, F + 7.0, F + 7.8, 1.4)
  }
  const Q = placed({ tile, plaster }, Math.PI / 2, 0, 0)
  const top = croof({ roof: Q.tile, ridge: Q.tile, gable: Q.plaster, soffit: Q.plaster, edge: Q.plaster }, {
    coarse: 2, kind: 'paljak', ex: U.hy + 1.0, ey: U.hx + 1.0, ze: F + 9.1, gx: 5.6, gy: 3.6, zg: F + 10.0, zr: F + 12.8, rx: 5.3,
    lift: 1.0, flare: 0.65, sag: 0.5, th: 0.45, pow: 2.0, soffit: { bx: U.hy, by: U.hx, zb: F + 8.4 }, ridge: { h: 0.45, w: 0.5 }, ridgeSag: 0.1, hipRidge: { w: 0.3, h: 0.26 } })
  for (const e of top.ridgeEnds ?? []) shachi(tile, [0, e[0], e[2] - 0.1], 1.4, [0, Math.sign(e[0])], false)

  const parts: Mat[] = [
    { part: plaster, material: finish('white-plaster', 0xf1efe9) },
    { part: tile, material: finish('roof-tile', 0x5d6067) },
    { part: stone, material: finish('granite', 0x6f6962) },
    { part: dark, material: finish('charcoal', 0x4a4f57) },
  ]
  return parts
}

if (import.meta.main) {
  await save('Sengan-yagura, Osaka Castle', build(), 'osaka-castle-sengan-yagura.glb', 5000, 250_000, { bearing: 356, elevation: 0, height: F + 14.2, osm: 'way/48123162' })
}
