/**
 * Ōtemon (大手門) of Osaka Castle, Chūō-ku, Osaka: the kōraimon gate and the
 * Tamon-yagura (多聞櫓) gate tower with its long wing, round the Ōte-guchi
 * masugata, the castle's main entrance — procedural, CC0-1.0.
 * bun generators/osaka-castle-otemon.ts
 *
 * Writes models/osaka-castle-otemon.glb. The Sengan-yagura, the turret on
 * the stone wall 20 m north of the Tamon-yagura, is its own model
 * (osaka-castle-sengan-yagura.ts): OSM maps the three buildings apart, and
 * the turret stands on the moat's edge, ~4 m lower on the map's terrain
 * than the masugata, which one rigid model could not follow.
 *
 * Built with the kit in osaka-castle.ts (croof, hafu, panelOn, boxOn).
 *
 * Map frame: x east, y north, z up, metres, turned to the masugata's axis:
 * the OSM outlines' sides run at 356° / 86°, so the catalog bearing is 356.
 * Origin: the centre of the two outlines' common bounding box
 * (135.5232505, 34.6851247).
 *
 * Identity, in order: the long white Tamon-yagura with its grey tile
 * hip-and-gable roof standing on the masugata's huge granite blocks; the
 * big black iron-clad gate under it, with a pent roof over the gate and a
 * long black-barred window above; the wing running south along the
 * masugata's east side; the small black kōraimon gate facing west, its
 * main tile roof on the cross-beam and the two little roofs over its back
 * posts.
 *
 * Evidence:
 *  - OSM: way/48123164 (多聞櫓, building=gatehouse, levels 2, Important
 *    Cultural Property): the gate tower (watari-yagura) x -20.6..21.9,
 *    y 19.5..33.6, and the wing (tsuzuki-yagura) x 12.2..21.8, y -33.6..19.5.
 *    way/48123163 (大手門, building=gatehouse): the kōraimon, its main roof
 *    x -21.9..-18.1, y -8.0..0.7, the rear roofs x -18.1..-15.3 at
 *    y -8.0..-4.9 and -2.6..0.7. No height tags.
 *  - published (文化遺産オンライン; ja.wikipedia 大坂城): the Tamon-yagura is a
 *    watari-yagura over the great gate with a tsuzuki-yagura running south
 *    from its east end at a right angle, two storeys under two roofs, hongawara
 *    tile; built 1628 (est.), burnt 1783, rebuilt 1848. The kōraimon dates
 *    from 1628. No published heights found.
 *  - heights (estimated from photos with people for scale: Spudgun67's and
 *    KENPEI's frontal views of the gate): the masugata's stone 3.8 m; the
 *    gate's black frontage 9 m wide (its centre 15.7 m from the tower's west
 *    end, from 663highland's view from above, where the gate tower's bigger
 *    roof ends just east of the gate and a lower section runs on east) and 4.1 m tall, its passage 3.5 × 3.6 m;
 *    pent roof 4.3-5.0; the barred window 5.05-5.85; the white wall to 6.6,
 *    eave 7.1; ridge 11.6 (estimated from the 14 m depth and the roof's
 *    pitch in 663highland's views from above); the wing's eave 7.0, ridge
 *    10.2. Kōraimon (Spudgun67, KENPEI, Zairon; about two-thirds of the
 *    Tamon-yagura's eave in 663highland's view): posts 5.6, beam 4.8-5.6,
 *    eave 5.9, ridge 7.6; rear roofs 4.0-4.8.
 *  - colours (daylight photos, pulled to the palette): plaster #f1efe9;
 *    dark tile #5d6067 (sampled #575860-#5a5c65 in Zairon's views; #878887
 *    under KENPEI's overcast sky); the masugata granite #7b766f (sampled
 *    #857f77-#86847d in KENPEI's view), drawn in courses; the gate's iron cladding and the
 *    window bars charcoal #4a4f57.
 *  - terrain: the map's terrain (Mapterhorn z14; z15 missing here) smears
 *    the moat edge across the site, so the flat masugata reads as a slope of
 *    ~4 m from the gate tower's west end to the wing. The model is built
 *    flat, its floor 2.0 m above the lowest ground under it; every wall and
 *    post runs down to y = 0. On the map the wing's stone shows ~2 m less
 *    than in reality and the kōraimon's posts stand ~1 m into the ground at
 *    its west face. Elevation 0.
 *  - night: no night photo found; nothing is lit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Tamon-yagura Turret - 2 Osakajo, Chuo Ward, Osaka, 540-0002, Japan.jpg, Spudgun67, CC0 (the gate, from the masugata)
 *  - Otemon Gate - 2-2 Osakajo, Chuo Ward, Osaka, 540-0002, Japan.jpg, Spudgun67, CC0 (kōraimon)
 *  - Osaka Castle Tamon-yagura Turret1.jpg and Osaka Castle Otemon1.jpg, KENPEI, CC BY 3.0
 *  - Osaka Osaka-jo Ote-mon 1.jpg and 2.jpg, Zairon, CC BY-SA 4.0
 *  - Tamon-Yagura of Osaka Castle.JPG, 2.JPG and Side view of Tamon-Yagura of Osaka Castle.JPG, そらみみ (Soramimi), CC BY-SA 4.0 (the wing's south gable)
 *  - Osaka Castle 01bs3200.jpg, 02bs3200.jpg, 03bs3200.jpg, 663highland, CC BY 2.5 (the whole complex from above, south-west)
 *  - Osaka Castle 05s5s4272.jpg, 663highland, CC BY 2.5 (the gate tower's west gable over the moat)
 * No commercial imagery. No look-only references.
 *
 * Left out: the masugata's other walls and the dobei (plastered walls)
 * beside the kōraimon (they are walls, not buildings, and OSM doesn't map
 * them as buildings), the moat bridge.
 * Doubts: the gate's position along the tower (from photos, centred on the
 * masugata's north side); the north (ninomaru) and east sides are drawn
 * like the south and west; the ridge heights are estimated.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { bar, quadOut, rbox, placed, save, gable2, type Mat } from './tokyo-meiji-jingu'
import { box } from './seoul-geunjeongjeon'
import { croof, panelOn, shachi, coursed, type RoofParts } from './osaka-castle'

const F = 2.0 // the masugata floor above the lowest ground under the model

/** A lean-to roof on a wall face at y = y0 facing -y, from x0 to x1: top at the wall zt, eave out by `d` at ze. */
function pent(tile: Part, white: Part, x0: number, x1: number, y0: number, d: number, zt: number, ze: number, th = 0.35) {
  const A: V3 = [x0, y0, zt], Bp: V3 = [x1, y0, zt], C: V3 = [x1, y0 - d, ze], D: V3 = [x0, y0 - d, ze]
  quadOut(tile, A, Bp, C, D, [0, -0.5, 1])
  const dn = (p: V3, h: number): V3 => [p[0], p[1], p[2] - h]
  quadOut(white, dn(D, th), dn(C, th), C, D, [0, -1, 0])
  quadOut(white, dn(A, th), dn(Bp, th), dn(C, th), dn(D, th), [0, -0.3, -1])
  quadOut(tile, dn(D, th), D, A, dn(A, th), [-1, 0, 0])
  quadOut(tile, dn(Bp, th), Bp, C, dn(C, th), [1, 0, 0])
  bar(tile, [[x0 - 0.1, y0 - 0.15, zt + 0.05], [x1 + 0.1, y0 - 0.15, zt + 0.05]], 0.35, 0.3, 0.05, true, false)
}

function build() {
  const plaster = new Part(), tile = new Part(), stone = new Part(), dark = new Part()
  const RP: RoofParts = { roof: tile, ridge: tile, gable: plaster, soffit: plaster, edge: plaster }

  // ---- Tamon-yagura: the gate tower (watari-yagura) -----------------------
  const N = { x0: -20.6, x1: 21.9, y0: 19.5, y1: 33.6 }
  const G = { x0: -9.1, x1: -0.1, o0: -6.35, o1: -2.85 } // the gate frontage and its passage
  const ZS = F + 3.8, ZW = F + 6.6
  const rect = (x0: number, y0: number, x1: number, y1: number, z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  coursed(stone, (t) => rect(N.x0, N.y0, G.x0, N.y1, ZS * t), 5)
  coursed(stone, (t) => rect(G.x1, N.y0, N.x1, N.y1, ZS * t), 5)
  // the gate: black frontage either side of the passage, the lintel, the passage's sides
  box(dark, G.x0, N.y0, 0, G.o0, N.y1, F + 4.1, 'bt')
  box(dark, G.o1, N.y0, 0, G.x1, N.y1, F + 4.1, 'bt')
  box(dark, G.o0, N.y0, F + 3.6, G.o1, N.y1, F + 4.1, 't')
  // the white upper storey
  box(plaster, N.x0, N.y0, ZS, N.x1, N.y1, ZW, 'bt')
  box(plaster, G.x0, N.y0, F + 4.1, G.x1, N.y1, ZS, 'bt')
  // the gate's pent roof and the long barred window over it, both faces
  for (const s of [-1, 1]) {
    const Q = placed({ tile, plaster, dark }, s < 0 ? 0 : Math.PI, s < 0 ? 0 : G.x0 + G.x1, s < 0 ? 0 : N.y0 + N.y1)
    pent(Q.tile, Q.plaster, G.x0 - 1.0, G.x1 + 1.0, N.y0, 1.4, F + 5.0, F + 4.3)
    quadOut(Q.dark, [G.x0 + 0.3, N.y0 - 0.05, F + 5.05], [G.x1 - 0.3, N.y0 - 0.05, F + 5.05], [G.x1 - 0.3, N.y0 - 0.05, F + 5.85], [G.x0 + 0.3, N.y0 - 0.05, F + 5.85], [0, -1, 0])
    for (let x = G.x0 + 0.7; x < G.x1 - 0.4; x += 0.45) rbox(Q.plaster, x, N.y0 - 0.1, 0.06, 0.06, F + 5.05, F + 5.85, 0, 'b')
    // iron straps on the frontage
    for (const x of [G.x0 + 0.9, G.o0 - 0.6, G.o1 + 0.6, G.x1 - 0.9]) rbox(Q.dark, x, N.y0 - 0.08, 0.25, 0.08, 0, F + 4.1, 0, 'b')
  }
  // small windows along the tower
  const win = (f: 's' | 'n' | 'e' | 'w', hx: number, hy: number, cx: number, cy: number, t: number, w = 1.0) =>
    panelOn(dark, f, hx, hy, t - w / 2, t + w / 2, F + 5.0, F + 5.8, 0.04, cx, cy)
  const ncx = (N.x0 + N.x1) / 2, ncy = (N.y0 + N.y1) / 2, nhx = (N.x1 - N.x0) / 2, nhy = (N.y1 - N.y0) / 2
  for (const t of [-18.6, -15.2, -11.8, 2.6, 6.2, 9.8]) win('s', nhx, nhy, ncx, ncy, t)
  for (const t of [-18, -14, -10, -6, 2, 6, 10, 14, 18]) win('n', nhx, nhy, ncx, ncy, t)
  for (const t of [-4, 0, 4]) win('w', nhx, nhy, ncx, ncy, t)
  // the watari-yagura over the gate (west) under the bigger roof, the lower section east of it
  const sec = (x0: number, x1: number, ze: number, zg: number, zr: number) => {
    const cx = (x0 + x1) / 2, hx = (x1 - x0) / 2
    croof(RP, { coarse: 2, kind: 'paljak', cx, cy: ncy, ex: hx + 1.0, ey: nhy + 1.2, ze, gx: hx - 1.3, gy: nhy * 0.42, zg, zr, rx: hx - 1.6,
      lift: 0.65, flare: 0.45, sag: 0.45, th: 0.45, pow: 2.4, soffit: { bx: hx, by: nhy, zb: ZW }, ridge: { h: 0.55, w: 0.6 }, ridgeSag: 0.05, hipRidge: { w: 0.35, h: 0.3 } })
    for (const s of [-1, 1]) shachi(tile, [cx + s * (hx - 1.0), ncy, zr + 0.45], 1.3, [s, 0], false)
  }
  sec(N.x0, -0.6, F + 7.1, F + 9.0, F + 11.6)
  sec(-0.6, N.x1, F + 6.9, F + 8.5, F + 10.6)

  // ---- Tamon-yagura: the wing (tsuzuki-yagura) along the masugata's east side
  const E = { x0: 12.2, x1: 21.8, y0: -33.6, y1: N.y0 }
  coursed(stone, (t) => rect(E.x0, E.y0, E.x1, E.y1, ZS * t), 5)
  box(plaster, E.x0, E.y0, ZS, E.x1, E.y1, ZW, 'bt')
  const ecx = (E.x0 + E.x1) / 2, ehx = (E.x1 - E.x0) / 2
  const ry0 = E.y0, ry1 = ncy, rcy = (ry0 + ry1) / 2, rhy = (ry1 - ry0) / 2
  const ecy = (E.y0 + E.y1) / 2, ehy = (E.y1 - E.y0) / 2
  for (let t = -ehy + 3; t < ehy - 1.5; t += 4.2) { win('w', ehx, ehy, ecx, ecy, t, 0.9); win('e', ehx, ehy, ecx, ecy, t, 0.9) }
  win('s', ehx, ehy, ecx, ecy, -2.2, 0.9); win('s', ehx, ehy, ecx, ecy, 2.2, 0.9)
  const Q = placed({ tile, plaster }, Math.PI / 2, ecx, rcy)
  croof({ roof: Q.tile, ridge: Q.tile, gable: Q.plaster, soffit: Q.plaster, edge: Q.plaster }, {
    coarse: 2, kind: 'paljak', ex: rhy + 1.0, ey: ehx + 1.0, ze: F + 7.0, gx: rhy - 1.2, gy: ehx * 0.45, zg: F + 8.4, zr: F + 10.2, rx: rhy - 1.4,
    lift: 0.6, flare: 0.4, sag: 0.45, th: 0.42, pow: 2.4, soffit: { bx: rhy, by: ehx, zb: ZW }, ridge: { h: 0.5, w: 0.55 }, ridgeSag: 0.04, hipRidge: { w: 0.32, h: 0.28 } })
  shachi(tile, [ecx, ry0 + 1.5, F + 10.6], 1.2, [0, -1], false)

  // ---- The kōraimon --------------------------------------------------------
  const kc = -3.65, kx = -21.3, rx = -16.8 // centre line, main posts' and rear posts' x
  for (const s of [-1, 1]) {
    box(dark, kx - 0.5, kc + s * 2.9 - 0.35, 0, kx + 0.5, kc + s * 2.9 + 0.35, F + 5.6, 'b') // main posts
    box(dark, rx - 0.25, kc + s * 2.75 - 0.25, 0, rx + 0.25, kc + s * 2.75 + 0.25, F + 3.8, 'b') // rear posts
    box(dark, kx + 0.5, kc + s * 2.82 - 0.17, F + 3.2, rx - 0.25, kc + s * 2.82 + 0.17, F + 3.55, '') // tie beams
    box(dark, kx + 0.55, kc + s * 2.4 - 0.14, F + 0.1, kx + 3.0, kc + s * 2.4 + 0.14, F + 4.6, '') // the doors, open
  }
  box(dark, kx - 0.45, kc - 4.0, F + 4.8, kx + 0.45, kc + 4.0, F + 5.6, '') // the cross-beam (kabuki)
  const K = placed({ roof: tile, edge: plaster, soffit: plaster, gable: plaster }, Math.PI / 2, -20.0, kc)
  gable2(K, { L: 4.6, Df: 2.1, Db: 2.1, zf: F + 5.9, zb: F + 5.9, zr: F + 7.6, sag: 0.45, lift: 0.4, th: 0.34, ridge: { w: 0.5, h: 0.4 } })
  for (const s of [-1, 1]) shachi(tile, [-20.0, kc + s * 4.5, F + 7.9], 0.9, [0, s], false)
  for (const yy of [-6.45, -0.95]) {
    const R = placed({ roof: tile, edge: plaster, soffit: plaster, gable: plaster }, 0, -16.7, yy)
    gable2(R, { L: 1.4, Df: 1.55, Db: 1.55, zf: F + 4.0, zb: F + 4.0, zr: F + 4.8, sag: 0.35, lift: 0.2, th: 0.25, ridge: { w: 0.3, h: 0.25 } })
  }

  const parts: Mat[] = [
    { part: plaster, material: finish('white-plaster', 0xf1efe9) },
    { part: tile, material: finish('roof-tile', 0x5d6067) },
    { part: stone, material: finish('granite', 0x7b766f) },
    { part: dark, material: finish('charcoal', 0x4a4f57) },
  ]
  return parts
}

if (import.meta.main) {
  await save('Otemon, Osaka Castle', build(), 'osaka-castle-otemon.glb', 5000, 250_000, { bearing: 356, elevation: 0, height: F + 13.0, osm: 'way/48123164' })
}
