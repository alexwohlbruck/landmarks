/**
 * Old Basilica of Guadalupe (Antigua Basílica de Guadalupe; since 2000 the
 * Templo Expiatorio a Cristo Rey), Villa de Guadalupe, Mexico City —
 * procedural, CC0-1.0, no textures. bun generators/mexico-city-old-basilica.ts
 *
 * Pedro de Arrieta, 1695–1709. A hall church of three naves and five bays
 * (fifteen vaults and an octagonal dome) in red tezontle with grey cantera
 * quoins, cornices and portals: the main front to the south-south-west
 * with a tall cantera frontispiece (two storeys of columns, a relief, a
 * mixtilinear pediment with the clock) between two corner towers and
 * under a scalloped yellow parapet; four octagonal corner towers, their
 * brick shafts topped by two white stone belfry stages and yellow-tiled
 * cupolas with lanterns; the octagonal drum and yellow tiled dome (talavera
 * amarilla with a blue border; es.wikipedia "Antigua Basílica de
 * Guadalupe") with pale ribs and a lantern; side portals; at the back a
 * lower block with the camarín's brown brick dome.
 *
 * The building has settled and leans (it was closed 1976–2000 for that);
 * it is modelled level.
 *
 * Map frame: x east, y north, z up, metres, turned to the church's axis:
 * the long walls of OSM way/120733637 run at 23° (and 113°), so the
 * placement bearing is 23. The anchor is the area centroid (lng
 * −99.116855, lat 19.485217). The front is at y −30.5, the back at +30.5.
 *
 * Covers and replaces way/120733637 (building=cathedral, "Templo Expiatorio
 * a Cristo Rey (Antigua Basilica)"). The Capilla de Capuchinas / Ex
 * Convento de Capuchinas (way/121255553, the red dome to the east), the
 * Parroquia (way/1172646234), the Capilla del Sagrario (way/1172646235) and
 * the Capilla del Pocito (on the hill side, further east) are separate OSM
 * buildings and are not modelled.
 *
 * Evidence
 * - OSM (measured): the outline is a 37.6 × 61.0 m rectangle at 23°.
 * - Photo-scaled (estimated) from photo 8 (the main front, straight on,
 *   31.5 px/m on the 37.6 m front): tower shafts 6.7 m square to 18.3 m,
 *   ledges at 9.4 and 13.6 m; belfry stages (octagons 5.4 and 4.4 m across)
 *   to 23.4 and 26.8 m; cupola, lantern and cross to ~31.5 m. Front walls
 *   to 17.1 m, the scalloped parapet to ~19.5 m, the frontispiece 14 m
 *   wide, its pediment to 24.4 m. Main door 4 m wide, arched to 7.3 m;
 *   side doors and the two stained-glass windows (3.3 × 4.4 m at 11–15.5 m).
 * - The dome: ~15 m across the drum (drone photo 12, against the 5.4 m
 *   belfries), drum to ~25 m, dome to ~33.5, lantern and cross to ~40 m
 *   (photos 12, 20, 21: its cross stands above the towers'). Its place
 *   (y ≈ −8, over the side portals) and the rear towers' (y ≈ +12) from
 *   photo 9 (the west flank) and photo 12. The rear block and the camarín
 *   dome (r ~6 m, to ~20.5 m) from photos 19 and 20 (from the hill).
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s);
 *   the site is on the flat lake-bed plain at the foot of the Tepeyac
 *   (~2,240 m). Elevation 0.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 "Templo Expiatorio a Cristo Rey (Antigua Basílica de Guadalupe) -
 *     Ciudad de México.jpg", Juan Carlos Fonseca Mata, CC BY-SA 4.0
 *   2 "Antigua Basílica de Nuestra Señora de Guadalupe 2026 01.jpg",
 *     ProtoplasmaKid, CC BY 4.0 (the frontispiece, the yellow parapet)
 *   6 "Templo Expiatorio a Cristo Rey (Antigua Basílica de Guadalupe) -
 *     Costado.jpg", Juan Carlos Fonseca Mata, CC BY-SA 4.0 (side portal)
 *   7 "Fachada del Templo Expiatorio de Cristo Rey al atardecer.jpg",
 *     ProtoplasmaKid, CC BY 4.0
 *   8 "Antigua Basílica de Nuestra Señora de Guadalupe front.jpg",
 *     Polimerek, CC BY-SA 3.0 (the front, straight on)
 *   9 "West facade - Old Basilica of Our Lady of Guadalupe - Mexico
 *     2024.jpg", José Luiz, CC BY-SA 4.0
 *   12 "Basílica de Guadalupe desde el aire 2.jpg", ProtoplasmaKid,
 *     CC BY-SA 4.0 (drone, from the west-south-west)
 *   19 "Vista de la Plaza Mariana desde el Cerro del Tepeyac 03.jpg",
 *     ProtoplasmaKid, CC BY 4.0; 20 "Basílica de Guadalupe CDMX 2024.jpg",
 *     PlanoAbierto, CC BY 4.0 (the back and the roofs, from the hill)
 *   21 "Atrio de las Américas - La Villa - Basílica de Guadalupe - Ciudad
 *     de México.jpg", Juan Carlos Fonseca Mata, CC BY-SA 4.0
 * - Look-only: none. No commercial imagery.
 * - Colours: tezontle walls a dark red-brown pulled light (#8c5a4e); the
 *   cantera grey (#b2a898); the belfries white-washed stone (#e6dfd2); the
 *   tiles golden yellow (#dcb44c; the parapet is painted the same yellow
 *   in the 2020s photos, red in older ones); the roof terraces and vaults
 *   whitewashed (#d2cabe).
 * - Simplified: the frontispiece's columns, niches and reliefs are flat
 *   pilasters and panels; the clock and statues are left out; the blue
 *   border of the dome tiles is left out.
 * - Doubts: the east flank is seen only partly (photo 6, a courtyard); the
 *   rear annexes are simplified to one block. All heights are photo
 *   estimates.
 * - Night: the front and towers are floodlit; windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, lathe } from './dc-nmaahc'
import { cbox, qf, tf } from './dc-white-house'
import { cross3, merlon, warch, wpanel, wprofile, wp } from './mexico-city-palacio-nacional'

type AZ = [number, number]
const X = 18.8, YF = -30.5, YB = 30.5
const YM = 15.5 // back of the main block
const ZW = 17.1 // main walls
const TW = 6.7 // tower shaft width
const ZT = 18.3 // tower shafts
const DY = -8 // dome centre

/** An octagon (flats facing the axes) of apothem a, at height z. */
const oct = (cx: number, cy: number, a: number, z: number): V3[] => {
  const r = a / Math.cos(Math.PI / 8)
  return Array.from({ length: 8 }, (_, k) => {
    const t = Math.PI / 8 + (k * Math.PI) / 4 - Math.PI / 2
    return [cx + r * Math.cos(t), cy + r * Math.sin(t), z] as V3
  })
}
/** An octagonal prism, optionally capped. */
function octPrism(p: Part, cx: number, cy: number, a: number, z0: number, z1: number, top = true, bottom = false, a1 = a) {
  p.loft([oct(cx, cy, a, z0), oct(cx, cy, a1, z1)])
  if (top) p.cap(oct(cx, cy, a1, z1), true)
  if (bottom) p.cap(oct(cx, cy, a, z0), false)
}
/** An octagonal "lathe": profile of apothems (a, z), flat-shaded faces. */
function octLathe(p: Part, cx: number, cy: number, prof: AZ[], capTop = false) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [a0, z0] = prof[k], [a1, z1] = prof[k + 1]
    if (a1 < 1e-4) {
      const ring = oct(cx, cy, a0, z0)
      for (let i = 0; i < 8; i++) p.tri(ring[i], ring[(i + 1) % 8], [cx, cy, z1])
    } else p.loft([oct(cx, cy, a0, z0), oct(cx, cy, a1, z1)])
  }
  const [at, zt] = prof[prof.length - 1]
  if (capTop && at > 1e-4) p.cap(oct(cx, cy, at, zt), true)
}
/** A dark arched opening on each of an octagon's four axis faces (or all eight). */
function octArches(p: Part, cx: number, cy: number, a: number, w: number, z0: number, z1: number, all = false, d = 0.05) {
  for (let k = 0; k < (all ? 8 : 4); k++) {
    const t = all ? (k * Math.PI) / 4 : (k * Math.PI) / 2
    const o: V3 = [Math.cos(t), Math.sin(t), 0], u: V3 = [-Math.sin(t), Math.cos(t), 0]
    const P = (s: number, z: number): V3 => [cx + o[0] * (a + d) + u[0] * s, cy + o[1] * (a + d) + u[1] * s, z]
    const r = w / 2, zs = z1 - r
    qf(p, P(-r, z0), P(r, z0), P(r, zs), P(-r, zs), o)
    for (let i = 0; i < 6; i++) {
      const t0 = (Math.PI * i) / 6, t1 = (Math.PI * (i + 1)) / 6
      tf(p, P(0, zs), P(r * Math.cos(t0), zs + r * Math.sin(t0)), P(r * Math.cos(t1), zs + r * Math.sin(t1)), o)
    }
  }
}

function build() {
  const red = new Part(), grey = new Part(), white = new Part(), tile = new Part(), terr = new Part(), win = new Part()

  // ---- Main block: tezontle walls, cantera plinth and cornice, a
  // whitewashed terrace with the fifteen saucer vaults.
  cbox(red, { x0: -X, x1: X, y0: YF, y1: YM }, 0, ZW, { top: terr })
  cbox(grey, { x0: -X - 0.15, x1: X + 0.15, y0: YF - 0.15, y1: YM + 0.15 }, 0, 1.2, { top: false })
  cbox(grey, { x0: -X - 0.4, x1: X + 0.4, y0: YF - 0.4, y1: YM + 0.4 }, ZW - 0.6, ZW, { b: 0.2, bottom: true, top: false })
  // the terrace parapet
  for (const [x0, x1, y0, y1] of [[-X, X, YF, YF + 0.5], [-X, X, YM - 0.5, YM], [-X, -X + 0.5, YF, YM], [X - 0.5, X, YF, YM]]) cbox(red, { x0, x1, y0, y1 }, ZW, ZW + 0.9, { b: 0.1 })
  // saucer vaults: 3 naves × 5 bays (the crossing bay carries the dome)
  const bays = [-22.5, -15.2, DY, -0.8, 7.0]
  for (const by of bays) for (const bx of [-11.5, 0, 11.5]) {
    if (bx === 0 && by === DY) continue
    const rr = bx === 0 ? 4.8 : 3.8
    lathe(terr, bx, by, [[rr, ZW], [rr * 0.82, ZW + 1.1], [rr * 0.45, ZW + 1.9], [0, ZW + 2.15]], 10)
  }

  // Side walls: cantera pilaster strips at the bays, arched stained-glass
  // windows, and a side portal on each flank under the dome.
  for (const [side, at, sg] of [['w', -X, -1], ['e', X, 1]] as const) {
    for (const y of [-19.0, -11.6, -4.4, 3.2, 11.0]) {
      cbox(grey, { x0: at - (sg < 0 ? 0.5 : 0), x1: at + (sg > 0 ? 0.5 : 0), y0: y - 0.55, y1: y + 0.55 }, 0, ZW - 0.6, { top: false })
    }
    for (const y of [-15.3, -0.6, 7.1]) {
      wpanel(grey, side, at, y - 1.9, y + 1.9, 10.4, 15.6, 0.03)
      warch(win, side, at, y - 1.5, y + 1.5, 10.8, 15.2, 0.06, 6)
    }
    // the side portal: a cantera frontispiece with an arched door
    const c = DY
    cbox(grey, side === 'w' ? { x0: at - 0.7, x1: at, y0: c - 4.2, y1: c + 4.2 } : { x0: at, x1: at + 0.7, y0: c - 4.2, y1: c + 4.2 }, 0, 13.2, { b: 0.15 })
    const F = at + sg * 0.7
    const top: AZ[] = [[c - 3.4, 13.2], [c + 3.4, 13.2], [c + 2.2, 14.8], [c, 15.8], [c - 2.2, 14.8]]
    wprofile(grey, side, at, top, 0.6, 0.6)
    warch(win, side, F, c - 1.6, c + 1.6, 0, 6.2, 0.04, 8)
    wpanel(grey, side, F, c - 1.4, c + 1.4, 8.2, 11.6, 0.06)
  }

  // ---- The front: tezontle wall, side doors, stained-glass windows, the
  // scalloped yellow parapet, and the cantera frontispiece.
  for (const s of [-1, 1]) {
    const c = s * 9.0
    wpanel(grey, 's', YF, c - 2.3, c + 2.3, 0, 7.6, 0.04)
    warch(win, 's', YF, c - 1.6, c + 1.6, 0, 7.0, 0.08, 6)
    wpanel(grey, 's', YF, c - 2.0, c + 2.0, 10.6, 15.9, 0.04)
    wpanel(win, 's', YF, c - 1.6, c + 1.6, 11.0, 15.5, 0.08)
    // the scalloped parapet between the tower and the frontispiece
    const a0 = s * (X - TW), a1 = s * 7.0
    const pts: AZ[] = [[a0, ZW], [a1, ZW]]
    const n = 10
    for (let k = 0; k <= n; k++) {
      const t = k / n, a = a1 + (a0 - a1) * t
      const z = ZW + 2.3 + 0.3 * t - 1.0 * Math.sin(Math.PI * t) // sagging between the frontispiece and the tower (photo 8)
      pts.push([a, z])
    }
    wprofile(tile, 's', YF, pts.map(([a, z]) => [a, z] as AZ), 0.6, 0, true)
  }
  // the frontispiece: 14 m wide, two storeys, a mixtilinear pediment
  cbox(grey, { x0: -7.0, x1: 7.0, y0: YF - 0.9, y1: YF + 0.3 }, 0, ZW + 0.4, { b: 0.2 })
  for (const z of [7.9, 13.0]) cbox(grey, { x0: -7.3, x1: 7.3, y0: YF - 1.3, y1: YF - 0.7 }, z, z + 0.6, { b: 0.15, bottom: true })
  for (const u of [-5.8, -4.3, -2.8, 2.8, 4.3, 5.8]) cbox(grey, { x0: u - 0.35, x1: u + 0.35, y0: YF - 1.25, y1: YF - 0.85 }, 1.2, 13.0, { top: false })
  warch(win, 's', YF - 0.9, -2.0, 2.0, 0, 7.3, 0.05, 8)
  cbox(grey, { x0: -2.1, x1: 2.1, y0: YF - 1.15, y1: YF - 0.85 }, 8.9, 12.6, { b: 0.1 }) // the relief panel
  const ped: AZ[] = [[-6.6, ZW + 0.4], [6.6, ZW + 0.4], [6.4, 19.2], [5.0, 20.0], [4.2, 21.4], [2.6, 22.0], [1.6, 23.4], [0.7, 23.6], [0, 24.4],
    [-0.7, 23.6], [-1.6, 23.4], [-2.6, 22.0], [-4.2, 21.4], [-5.0, 20.0], [-6.4, 19.2]]
  wprofile(grey, 's', YF - 0.9, ped, 1.0, 0, true)
  for (const s of [-1, 1]) merlon(grey, s * 6.0, YF - 0.4, ZW + 0.4, 0.8, 1.6)
  // the clock: a pale disc
  {
    const P = (u: number, z: number): V3 => wp('s', YF - 0.9, u, z, 0.06)
    for (let k = 0; k < 8; k++) {
      const t0 = (k * Math.PI) / 4, t1 = ((k + 1) * Math.PI) / 4
      tf(white, P(0, 21.0), P(0.75 * Math.cos(t0), 21.0 + 0.75 * Math.sin(t0)), P(0.75 * Math.cos(t1), 21.0 + 0.75 * Math.sin(t1)), [0, -1, 0])
    }
  }

  // ---- The four corner towers: brick shafts with cantera quoins and
  // ledges, two white octagonal belfry stages, yellow tiled cupolas,
  // lanterns and crosses.
  const towers: Array<[number, number]> = [[-X + TW / 2, YF + TW / 2], [X - TW / 2, YF + TW / 2], [-X + TW / 2, YM - TW / 2], [X - TW / 2, YM - TW / 2]]
  for (const [cx, cy] of towers) {
    const h = TW / 2
    cbox(red, { x0: cx - h - 0.1, x1: cx + h + 0.1, y0: cy - h - 0.1, y1: cy + h + 0.1 }, 0, ZT, { top: false })
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) cbox(grey, { x0: cx + sx * h - 0.55, x1: cx + sx * h + 0.55, y0: cy + sy * h - 0.55, y1: cy + sy * h + 0.55 }, 0, ZT - 0.6, { top: false })
    for (const z of [9.0, 13.2]) cbox(grey, { x0: cx - h - 0.35, x1: cx + h + 0.35, y0: cy - h - 0.35, y1: cy + h + 0.35 }, z, z + 0.45, { b: 0.12, bottom: true, top: false })
    cbox(grey, { x0: cx - h - 0.6, x1: cx + h + 0.6, y0: cy - h - 0.6, y1: cy + h + 0.6 }, ZT - 0.7, ZT, { b: 0.25, bottom: true })
    // small square windows in the shafts' outer faces
    for (const z of [5.0, 11.0, 15.4]) {
      const fs: Array<['s' | 'n' | 'e' | 'w', number, number]> = []
      fs.push([cy < 0 ? 's' : 'n', cy + (cy < 0 ? -h - 0.1 : h + 0.1), cx])
      fs.push([cx < 0 ? 'w' : 'e', cx + (cx < 0 ? -h - 0.1 : h + 0.1), cy])
      for (const [side, at, c] of fs) {
        wpanel(grey, side, at, c - 0.75, c + 0.75, z - 0.75, z + 0.75, 0.03)
        wpanel(win, side, at, c - 0.42, c + 0.42, z - 0.42, z + 0.42, 0.06)
      }
    }
    // belfry stage 1 (5.4 across) and 2 (4.4 across)
    octPrism(white, cx, cy, 2.7, ZT, 23.0, false)
    octArches(win, cx, cy, 2.7, 1.3, ZT + 0.9, 22.2)
    octPrism(white, cx, cy, 3.1, 23.0, 23.6, true, true)
    for (let k = 0; k < 8; k++) {
      const v = oct(cx, cy, 2.95, 23.6)[k]
      merlon(white, v[0], v[1], 23.6, 0.45, 1.0)
    }
    octPrism(white, cx, cy, 2.2, 23.6, 26.4, false)
    octArches(win, cx, cy, 2.2, 1.05, 24.2, 25.9)
    octPrism(white, cx, cy, 2.55, 26.4, 26.9, true, true)
    // the yellow cupola, lantern, cross
    octLathe(tile, cx, cy, [[2.3, 26.9], [2.2, 27.6], [1.85, 28.3], [1.25, 28.9], [0.6, 29.2]])
    octLathe(white, cx, cy, [[0.55, 29.2], [0.55, 30.0], [0.75, 30.0], [0.75, 30.2], [0.3, 30.5]], true)
    cross3(grey, cx, cy, 30.4, 31.8, 0.18)
  }

  // ---- The dome over the crossing: an octagonal drum with arched
  // windows between cantera pilasters, the yellow tiled octagonal dome
  // with pale ribs, a white lantern with its own yellow cap, the cross.
  const DA = 7.4, Z1 = 24.6
  octPrism(red, 0, DY, DA, ZW, Z1, false)
  octArches(win, 0, DY, DA, 1.9, ZW + 2.6, Z1 - 1.0, true)
  for (const v of oct(0, DY, DA, 0)) cbox(grey, { x0: v[0] - 0.45, x1: v[0] + 0.45, y0: v[1] - 0.45, y1: v[1] + 0.45 }, ZW, Z1, { top: false })
  octPrism(grey, 0, DY, DA + 0.45, Z1, Z1 + 0.8, true, true)
  const prof: AZ[] = []
  for (let k = 0; k <= 6; k++) { const t = (Math.PI / 2) * (k / 6); prof.push([1.5 + (DA - 0.2 - 1.5) * Math.cos(t), Z1 + 0.8 + 8.0 * Math.sin(t)]) }
  octLathe(tile, 0, DY, prof)
  // ribs at the dome's corners
  {
    const rr = 1 / Math.cos(Math.PI / 8)
    for (let k = 0; k < 8; k++) {
      const t = Math.PI / 8 + (k * Math.PI) / 4 - Math.PI / 2, o: V3 = [Math.cos(t), Math.sin(t), 0], u: V3 = [-Math.sin(t), Math.cos(t), 0]
      for (let i = 0; i < prof.length - 1; i++) {
        const [a0, z0] = prof[i], [a1, z1] = prof[i + 1]
        const R0 = a0 * rr + 0.12, R1 = a1 * rr + 0.12, w = 0.3
        const A = (R: number, s: number, z: number): V3 => [o[0] * R + u[0] * s, DY + o[1] * R + u[1] * s, z]
        qf(white, A(R0, -w, z0), A(R0, w, z0), A(R1, w, z1), A(R1, -w, z1), [o[0] * (z1 - z0), o[1] * (z1 - z0), R0 - R1])
      }
    }
  }
  const ZL = Z1 + 0.8 + 8.0
  octPrism(white, 0, DY, 1.5, ZL, ZL + 2.6, false)
  octArches(win, 0, DY, 1.5, 0.75, ZL + 0.5, ZL + 2.1)
  octPrism(white, 0, DY, 1.8, ZL + 2.6, ZL + 3.0, true, true)
  octLathe(tile, 0, DY, [[1.6, ZL + 3.0], [1.3, ZL + 3.7], [0.6, ZL + 4.2], [0.3, ZL + 4.3]], true)
  cross3(grey, 0, DY, ZL + 4.2, ZL + 6.2, 0.22)

  // ---- The back: a lower tezontle block with the camarín's brown dome.
  cbox(red, { x0: -14.5, x1: 14.5, y0: YM, y1: YB }, 0, 13.0, { top: terr })
  cbox(grey, { x0: -14.8, x1: 14.8, y0: YM, y1: YB + 0.3 }, 12.4, 13.0, { b: 0.15, bottom: true, top: false })
  for (const [side, at] of [['w', -14.5], ['e', 14.5]] as const) for (const y of [19.5, 26.5]) warch(win, side, at, y - 1.2, y + 1.2, 6.5, 10.5, 0.06, 6)
  lathe(red, 0, 23.5, [[6.2, 13.0], [6.2, 15.6]], 16, false)
  lathe(grey, 0, 23.5, [[6.5, 15.6], [6.5, 16.1], [6.0, 16.1]], 16, false)
  const cam: [number, number][] = []
  for (let k = 0; k <= 5; k++) { const t = (Math.PI / 2) * (k / 5); cam.push([0.5 + 5.6 * Math.cos(t), 16.1 + 4.2 * Math.sin(t)]) }
  lathe(red, 0, 23.5, cam, 16)

  // Night: the front and the towers are floodlit.
  const lit = (p: V3, n: V3) => (n[2] > 0.6 ? 0 : p[1] < YF + 8 || p[2] > ZT ? 0.85 : 0.3)
  return [
    { part: red, material: { ...finish('tezontle', 0x8c5a4e), floodlight: lit } },
    { part: grey, material: { ...finish('cantera-grey', 0xb2a898), floodlight: lit } },
    { part: white, material: { ...finish('belfry-white', 0xe6dfd2), floodlight: lit } },
    { part: tile, material: finish('yellow-tile', 0xdcb44c) },
    { part: terr, material: finish('terrace-white', 0xd2cabe) },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) await save('mexico-city-old-basilica', 'Old Basilica of Guadalupe', build(), { generator: 'generators/mexico-city-old-basilica.ts' }, 6500)
