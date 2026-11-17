/**
 * Templo de Santiago Tlatelolco, Plaza de las Tres Culturas, Mexico City —
 * procedural, CC0-1.0, no textures. bun generators/mexico-city-santiago-tlatelolco.ts
 *
 * The Franciscan church of Santiago (1604–10), beside the ruins of
 * Tlatelolco: a fortress-like cross-plan church in dark basalt and
 * tezontle rubble with grey cantera portals. Its west front stands between
 * two square towers whose bases are battered out like buttresses; the
 * north tower carries two belfry stages, a small domed lantern and a
 * cross, the south tower one open belfry and a domed cap. A curved gable
 * crowns the front over the cantera portal and choir window. The long
 * walls are plain, stiffened by flat buttress strips and topped by small
 * merlons; the nave roof is three whitewashed saucer vaults, and over the
 * crossing sits a low red dome, with red-washed terraces over the
 * transept and the polygonal apse.
 *
 * Map frame: x east, y north, z up, metres, turned to the church's axis:
 * the walls of OSM way/1298615719 run at 100.5° and 10.5°, so the
 * placement bearing is 10.5 and the nave runs along +x to the apse (east);
 * the front is at x −34.3 (west). The anchor is the area centroid
 * (lng −99.136655, lat 19.451126).
 *
 * Covers and replaces way/1298615719 (building=yes, "Templo de Santiago
 * Apostol Tlatelolco"). The convent / Colegio de Santa Cruz south of it,
 * and the ruins (building=ruins) around, are not part of it.
 *
 * Evidence
 * - OSM (measured, turned 10.5°): nave x −34.3…7.3, y −9.4…9.0; transept
 *   x 7.3…23.1, y −13.4…14.3; apse x 23.1…32.2, a half-octagon.
 * - Photo-scaled (estimated) from photo 2 (from the south-west, ~10 px/m
 *   on the 18.4 m front): tower shafts to ~20 m, the north tower's belfry
 *   stages to ~25.5 and ~29.5 m, lantern and cross to ~34 m; the south
 *   tower's belfry to ~26 m and its cap to ~28 m; walls to ~15.5 m, well below the shafts (photos 2, 8); the
 *   front gable to ~19 m. Battered tower bases to ~8.5 m (photo 9). The
 *   three white saucer vaults over the nave and the red crossing dome from
 *   the drone view (photo 6); the dome's height (~25.5 m) estimated from it.
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s);
 *   the plaza is on the flat lake bed (~2,240 m). Elevation 0.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 "Tlatelolco e iglesia de Santiago Tlatelolco, México D.F., México,
 *     2013-10-16, DD 22.jpg" and 2 "… DD 25.JPG", Diego Delso, CC BY-SA 3.0
 *   6 "Vista aérea de la Zona Arqueológica de Tlatelolco.jpg",
 *     ProtoplasmaKid, CC BY-SA 4.0
 *   7 "Iglesia de Tlatelolco.jpg", Socrackdown, CC BY-SA 4.0
 *   8 "Templo de Santiago Tlatelolco (vista lateral) 01.jpg", Luis Alvaz,
 *     CC BY-SA 4.0 (the north flank and portal)
 *   9 "Fachada del Templo de Santiago Tlatelolco 02.jpg", Luis Alvaz,
 *     CC BY-SA 4.0 (the front)
 *   10 "Tlatelolco Templo de Santiago.jpg", Karycocco, CC BY-SA 3.0
 * - Look-only: none. No commercial imagery.
 * - Colours: the walls a dark grey-brown rubble (#76695f, pulled lighter
 *   than the near-black basalt); cantera portals grey (#b5ad9e); the
 *   vaults whitewashed; the dome and terraces red (terracotta).
 * - Doubts: the east end and the south flank are hidden by the convent in
 *   most photos; the dome's height is a guess from the drone photo.
 * - Night: the front and towers are floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, lathe } from './dc-nmaahc'
import { cbox, qf } from './dc-white-house'
import { belfry, cross3, merlon, warch, wpanel, wprofile } from './mexico-city-palacio-nacional'

type AZ = [number, number]
const XW = -34.3, XT0 = 7.3, XT1 = 23.1, XA = 32.2
const YS = -9.4, YN = 9.0, TYS = -13.4, TYN = 14.3
const ZW = 15.5
const TS = 5.6 // tower side

function build() {
  const st = new Part(), grey = new Part(), white = new Part(), red = new Part(), win = new Part()

  // ---- Nave, transept and apse: plain walls to 15.5 m,
  // merlons on the parapet.
  cbox(st, { x0: XW + TS, x1: XT0 + 0.01, y0: YS, y1: YN }, 0, ZW, { top: white })
  cbox(st, { x0: XT0, x1: XT1, y0: TYS, y1: TYN }, 0, ZW, { top: red })
  // apse: half-octagon
  {
    const cy = (YS + YN) / 2, hw = (YN - YS) / 2
    const ring: V3[] = [[XT1, cy - hw, 0], [XA - 4.0, cy - hw, 0], [XA, cy - hw + 4.0, 0], [XA, cy + hw - 4.0, 0], [XA - 4.0, cy + hw, 0], [XT1, cy + hw, 0]]
    const top = ring.map(([x, y]) => [x, y, ZW] as V3)
    st.loft([ring, top])
    red.cap(top, true)
  }
  // merlons along the long walls and the transept ends
  for (let x = XW + TS + 2; x < XT0 - 1; x += 3.6) for (const y of [YS + 0.4, YN - 0.4]) merlon(st, x, y, ZW, 0.8, 1.3)
  for (let y = TYS + 2; y < TYN - 1; y += 3.6) for (const x of [XT0 + 0.4, XT1 - 0.4]) if (y < YS - 0.5 || y > YN + 0.5) merlon(st, x, y, ZW, 0.8, 1.3)
  // buttress strips on the flanks
  for (const x of [-22.0, -13.0, -4.0]) for (const [y0, y1] of [[YS - 0.7, YS], [YN, YN + 0.7]]) cbox(st, { x0: x - 0.8, x1: x + 0.8, y0, y1 }, 0, ZW - 0.3, { b: 0.2 })
  for (const x of [XT0 + 0.8, XT1 - 0.8]) for (const [y0, y1] of [[TYS - 0.7, TYS], [TYN, TYN + 0.7]]) cbox(st, { x0: x - 0.8, x1: x + 0.8, y0, y1 }, 0, ZW - 0.3, { b: 0.2 })
  // high windows
  for (const x of [-17.5, -8.5, 1.5]) {
    warch(win, 's', YS, x - 0.8, x + 0.8, 9.6, 12.9, 0.05, 6)
    warch(win, 'n', YN, x - 0.8, x + 0.8, 9.6, 12.9, 0.05, 6)
  }
  for (const [side, at] of [['s', TYS], ['n', TYN]] as const) warch(win, side, at, 14.0, 16.4, 8.6, 12.9, 0.05, 6)
  // the north side portal: cantera frame, arched door, a crowning panel
  {
    const c = -10.5
    wpanel(grey, 'n', YN, c - 2.6, c + 2.6, 0, 7.6, 0.25)
    warch(win, 'n', YN + 0.25, c - 1.4, c + 1.4, 0, 5.4, 0.05, 8)
    wpanel(grey, 'n', YN, c - 2.0, c + 2.0, 7.6, 11.2, 0.2)
    const ped: AZ[] = [[c - 2.0, 11.2], [c + 2.0, 11.2], [c, 12.6]]
    wprofile(grey, 'n', YN, ped, 0.2, 0.2)
  }

  // ---- The vaults: three whitewashed saucer domes over the nave, the red
  // crossing dome on a low drum.
  for (const x of [-22.7, -10.7, 1.3]) lathe(white, x, (YS + YN) / 2, [[5.9, ZW], [5.1, ZW + 1.7], [3.2, ZW + 3.0], [0, ZW + 3.5]], 16)
  const CX = (XT0 + XT1) / 2, CY = (YS + YN) / 2
  lathe(st, CX, CY, [[6.6, ZW], [6.6, ZW + 2.2]], 16, false)
  lathe(grey, CX, CY, [[6.9, ZW + 2.2], [6.9, ZW + 2.7], [6.5, ZW + 2.7]], 16, false)
  const dp: [number, number][] = []
  for (let k = 0; k <= 6; k++) { const t = (Math.PI / 2) * (k / 6); dp.push([0.9 + 5.5 * Math.cos(t), ZW + 2.7 + 4.6 * Math.sin(t)]) }
  lathe(red, CX, CY, dp, 16)
  lathe(white, CX, CY, [[0.9, ZW + 7.3], [0.9, ZW + 8.4], [0.3, ZW + 8.8]], 8)
  cross3(grey, CX, CY, ZW + 8.6, ZW + 10.0, 0.16)

  // ---- The west front: the frontage between the towers, with its curved
  // gable, the cantera portal and the choir window.
  const FX = XW, FY0 = YS + TS, FY1 = YN - TS
  cbox(st, { x0: FX, x1: XW + TS, y0: FY0, y1: FY1 }, 0, ZW, { top: white })
  {
    const cy = (FY0 + FY1) / 2, hw = (FY1 - FY0) / 2
    const g: AZ[] = [[cy - hw, ZW], [cy + hw, ZW], [cy + hw, ZW + 0.6], [cy + hw * 0.55, ZW + 1.6], [cy + hw * 0.35, ZW + 3.0], [cy, ZW + 3.5], [cy - hw * 0.35, ZW + 3.0], [cy - hw * 0.55, ZW + 1.6], [cy - hw, ZW + 0.6]]
    wprofile(st, 'w', FX, g, 0.8, 0, true)
    // portal: two storeys of cantera, the arched door, the window, the top panel
    wpanel(grey, 'w', FX, cy - 3.1, cy + 3.1, 0, 7.4, 0.35)
    warch(win, 'w', FX - 0.35, cy - 1.45, cy + 1.45, 0, 5.8, 0.05, 8)
    wpanel(grey, 'w', FX, cy - 2.7, cy + 2.7, 7.4, 11.4, 0.3)
    wpanel(win, 'w', FX - 0.3, cy - 0.85, cy + 0.85, 8.0, 10.6, 0.05)
    wpanel(grey, 'w', FX, cy - 2.0, cy + 2.0, 11.4, 14.2, 0.25)
    wprofile(grey, 'w', FX, [[cy - 2.0, 14.2], [cy + 2.0, 14.2], [cy, 15.2]], 0.25, 0.25)
  }

  // ---- The towers: battered bases, square shafts, open belfries.
  const tower = (cy: number, north: boolean) => {
    const cx = XW + TS / 2, h = TS / 2
    // battered base: wider at the ground, sloping in to the shaft at 8.5 m
    const B = 0.9
    st.loft([
      [[cx - h - B, cy - h - B, 0], [cx + h + (north ? 0 : 0), cy - h - B, 0], [cx + h, cy + h + B, 0], [cx - h - B, cy + h + B, 0]].map((p) => p as V3),
      [[cx - h, cy - h, 8.5], [cx + h, cy - h, 8.5], [cx + h, cy + h, 8.5], [cx - h, cy + h, 8.5]].map((p) => p as V3),
    ])
    cbox(st, { x0: cx - h, x1: cx + h, y0: cy - h, y1: cy + h }, 8.4, 20, { top: false })
    cbox(grey, { x0: cx - h - 0.35, x1: cx + h + 0.35, y0: cy - h - 0.35, y1: cy + h + 0.35 }, 19.4, 20.1, { b: 0.2, bottom: true })
    if (north) {
      belfry(st, white, cx, cy, 2.5, 20.1, 25.3, 2.0, 0.5, 0.7, 0.5)
      cbox(grey, { x0: cx - 2.85, x1: cx + 2.85, y0: cy - 2.85, y1: cy + 2.85 }, 25.3, 25.9, { b: 0.2, bottom: true })
      belfry(st, white, cx, cy, 2.1, 25.9, 29.4, 1.5, 0.45, 0.6, 0.4)
      cbox(grey, { x0: cx - 2.4, x1: cx + 2.4, y0: cy - 2.4, y1: cy + 2.4 }, 29.4, 29.9, { b: 0.18, bottom: true })
      lathe(st, cx, cy, [[1.6, 29.9], [1.6, 30.6], [1.2, 31.6], [0.5, 32.2], [0, 32.3]], 8)
      cross3(grey, cx, cy, 32.1, 34.0, 0.2)
    } else {
      belfry(st, white, cx, cy, 2.5, 20.1, 25.8, 2.0, 0.5, 0.7, 0.5)
      cbox(grey, { x0: cx - 2.85, x1: cx + 2.85, y0: cy - 2.85, y1: cy + 2.85 }, 25.8, 26.4, { b: 0.2, bottom: true })
      lathe(st, cx, cy, [[2.2, 26.4], [1.9, 27.3], [1.1, 28.0], [0, 28.3]], 10)
    }
    // narrow slit windows in the shaft
    for (const z of [12.0, 16.0]) wpanel(win, 'w', cx - h, cy - 0.25, cy + 0.25, z, z + 1.0, 0.05)
  }
  tower(YN - TS / 2, true)
  tower(YS + TS / 2, false)

  // Night: the front and towers are floodlit.
  const lit = (p: V3, n: V3) => (n[2] > 0.6 ? 0 : p[0] < XW + 8 ? 0.85 : 0.35)
  return [
    { part: st, material: { ...finish('basalt-rubble', 0x76695f), floodlight: lit } },
    { part: grey, material: { ...finish('cantera-grey', 0xb5ad9e), floodlight: lit } },
    { part: white, material: finish('whitewash', 0xe3ddd3) },
    { part: red, material: PALETTE.terracotta },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) await save('mexico-city-santiago-tlatelolco', 'Templo de Santiago Tlatelolco', build(), { generator: 'generators/mexico-city-santiago-tlatelolco.ts' }, 6500)
