/**
 * Sumiyoshi Taisha (住吉大社), Sumiyoshi-ku, Osaka: the four main halls
 * (第一〜第四本宮), each a Sumiyoshi-zukuri honden in its vermilion fence
 * (tamagaki) with the dark wooden heiden in front of it — procedural,
 * CC0-1.0. The Sorihashi bridge is its own model
 * (osaka-sumiyoshi-sorihashi.ts): it stands 50 m west of the halls over
 * the pond, and OSM maps it as a footway, not a building.
 * bun generators/osaka-sumiyoshi-taisha.ts
 *
 * Built with the kit in osaka-castle.ts (croof, tube, panelOn) and
 * tokyo-meiji-jingu.ts (gable2, placed).
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the outlines are
 * square to north). Origin: the centre of the four halls' common bounding
 * box (135.4934116, 34.6123914). All four face west, to the sea.
 *
 * Identity, in order: the four steep straight gabled roofs of dark cypress
 * bark, entered on the gable end, each with crossed chigi at both gable
 * ends and five katsuogi on the ridge; vermilion posts, rafters and barge
 * boards on white walls; the low vermilion palisade round each honden; the
 * third and fourth halls side by side, the second and first in line
 * eastward (the shrine's famous "fleet" arrangement).
 *
 * Evidence:
 *  - OSM (way/234736155 第三本宮, way/234736161 第四本宮, way/234511288
 *    第二本宮, way/234511289 第一本宮), each a T: the honden part (east,
 *    12.7-13.4 × 8.6-8.8 m, read as the tamagaki's line) and the heiden part
 *    (west, 8.2-9.4 × 11.6-17.3 m).
 *  - published (ja.wikipedia 住吉大社): all four honden 1810, National
 *    Treasures; Sumiyoshi-zukuri: kirizuma, entered on the gable, 4 ken by
 *    2 ken, cypress-bark roofs with no curve; five katsuogi on each; chigi
 *    cut vertically on the first to third, horizontally on the fourth;
 *    posts, rafters and barge boards vermilion, walls white (gofun); facing
 *    west; the third, second and first in a line west to east, the fourth
 *    beside the third to the south.
 *  - sizes and heights (estimated from photos with people for scale:
 *    そらみみ's back views of the second and third halls, Fraxinus2's view
 *    of the third and fourth, Saint-Rambert's): honden walls 9.0 × 4.8 m,
 *    floor 1.0, walls to 4.3, eaves 4.6, ridge 9.0 (scaled by the 2.0 m
 *    tamagaki, people beside it), chigi 2.6 above it; the tamagaki a solid
 *    board fence on the honden part's outline; heiden walls to 3.9, its
 *    hip-and-gable roof eave 4.3, ridge 7.0.
 *  - terrain (Mapterhorn z14): the halls stand on a nearly flat precinct,
 *    falling ~0.6 m to the west; the floor is drawn 0.6 m above the model's
 *    base and everything runs down to y = 0. Elevation 0.
 *  - colours (daylight photos, pulled to the palette): cypress bark
 *    #5a514a (sampled #48423d); vermilion #cc5a3c; gofun white #efe9df;
 *    the heiden's dark wood #4f4038; gilt caps on the katsuogi and chigi
 *    #cda550.
 *  - night: not lit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Backview of 2nd Hongu / 3rd Hongu of Sumiyoshi Grand Shrine.jpg, そらみみ, CC BY-SA 4.0
 *  - Sumi 3 und 4.jpg and N Sumiyoshi.jpg (plan and elevation drawing), Fraxinus2, CC BY-SA 3.0
 *  - Sumiyoshi Taisha Honden no haimen.jpg, Yanajin33, CC BY-SA 3.0
 *  - Sumiyoshi Taisha Shinto shrine, Osaka, Japan (2) - September 2015.jpg, Rickard Törnblad, CC BY-SA 4.0
 *  - Sumiyoshi-taisha (Osaka Sumiyoshi-ku) Shrine hdsr S5 hu01.jpg, hu04.jpg, Hyppolyte de Saint-Rambert, CC BY 4.0
 *  - Sumiyoshi Taisha-36.jpg, Immanuelle, CC BY 4.0 (a heiden)
 * No commercial imagery. No look-only references.
 *
 * Doubts: the heiden's roofs (seen in one photo) are drawn alike for all
 * four; the first hall's heiden part is larger in OSM (17 m) and drawn to
 * it; the honden's exact plan sizes are scaled from photos.
 */
import { Part } from './mesh'
import { finish } from './palette'
import { placed, save, gable2, rbox, type Mat } from './tokyo-meiji-jingu'
import { box } from './seoul-geunjeongjeon'
import { croof, tube, panelOn } from './osaka-castle'

const F = 0.6

function build() {
  const red = new Part(), white = new Part(), bark = new Part(), wood = new Part(), gold = new Part()
  const OX = 28.55, OY = -67.3 // the frame first drawn (origin 135.4931, 34.6130) to the anchor

  /** One hall: the honden (east part) in its fence, the heiden (west part). */
  const hall = (hx0: number, hy0: number, hx1: number, hy1: number, wx0: number, wy0: number, wx1: number, wy1: number) => {
    hx0 -= OX; hx1 -= OX; wx0 -= OX; wx1 -= OX; hy0 -= OY; hy1 -= OY; wy0 -= OY; wy1 -= OY
    const cx = (hx0 + hx1) / 2 + 0.4, cy = (hy0 + hy1) / 2
    const L = 4.5, Wd = 2.4 // the honden's walls: half-length (E-W), half-width
    box(red, cx - L - 0.1, cy - Wd - 0.1, 0, cx + L + 0.1, cy + Wd + 0.1, F + 1.0, 'b') // the raised floor's skirt
    box(white, cx - L, cy - Wd, F + 1.0, cx + L, cy + Wd, F + 4.3, 'b')
    // vermilion posts and the beam band
    for (const x of [-L, -L / 2, 0, L / 2, L]) for (const s of [-1, 1]) panelOn(red, s < 0 ? 's' : 'n', L, Wd, s < 0 ? x - 0.18 : -x - 0.18, s < 0 ? x + 0.18 : -x + 0.18, F + 1.0, F + 4.3, 0.05, cx, cy)
    for (const s of [-1, 1]) {
      panelOn(red, s < 0 ? 'w' : 'e', L, Wd, -0.18, 0.18, F + 1.0, F + 4.3, 0.05, cx, cy)
      for (const f of ['s', 'n'] as const) panelOn(red, f, L, Wd, -L, L, F + 4.0, F + 4.3, 0.06, cx, cy)
    }
    // the gable-end door (west) and its steps
    panelOn(red, 'w', L, Wd, -0.9, 0.9, F + 1.2, F + 3.4, 0.06, cx, cy)
    box(red, cx - L - 1.6, cy - 1.1, 0, cx - L, cy + 1.1, F + 0.8, 'b')
    // the straight cypress-bark roof, entered on the gable: ridge along x
    const Q = placed({ roof: bark, edge: red, gable: white, soffit: red }, 0, cx, cy)
    gable2(Q, { L: L + 1.1, Df: Wd + 1.4, Db: Wd + 1.4, zf: F + 4.6, zb: F + 4.6, zr: F + 9.0, sag: 0.0, th: 0.55, ridge: { w: 0.7, h: 0.5 }, coarse: true },
      { wx: L, wyf: Wd, wyb: Wd, zw: F + 4.3 })
    // gable boards: vermilion struts on the white gable triangles
    for (const s of [-1, 1]) {
      const x = cx + s * (L + 0.06)
      box(red, x - 0.06, cy - 0.15, F + 4.3, x + 0.06, cy + 0.15, F + 8.5, '')
      box(red, x - 0.06, cy - Wd + 0.4, F + 5.8, x + 0.06, cy + Wd - 0.4, F + 6.1, '')
    }
    // chigi: crossed boards at both gable ends, rising past the ridge
    for (const s of [-1, 1]) {
      const x = cx + s * (L + 1.0), z = F + 9.0
      for (const k of [-1, 1]) {
        tube(bark, [[x, cy + k * 1.2, z - 1.2], [x, cy - k * 1.6, z + 2.6]], [[0.12, 0.38], [0.12, 0.38]], 4, [1, 0, 0])
        rbox(gold, x, cy - k * 1.62, 0.14, 0.14, z + 2.45, z + 2.7, 0, 'b')
      }
    }
    // five katsuogi along the ridge, gilt-capped
    for (let i = 0; i < 5; i++) {
      const x = cx - L + 0.8 + (i * (2 * L - 1.6)) / 4
      tube(bark, [[x, cy - 1.1, F + 9.75], [x, cy + 1.1, F + 9.75]], [0.32, 0.32], 6, [1, 0, 0])
      for (const s of [-1, 1]) tube(gold, [[x, cy + s * 1.1, F + 9.75], [x, cy + s * 1.18, F + 9.75]], [0.33, 0.33], 6, [1, 0, 0])
    }
    // the tamagaki: a vermilion palisade on the honden part's outline (open on the heiden side)
    const rail = (ax: number, ay: number, bx: number, by: number) => {
      const len = Math.hypot(bx - ax, by - ay), n = Math.max(1, Math.round(len / 1.8))
      box(red, Math.min(ax, bx) - 0.08, Math.min(ay, by) - 0.08, 0, Math.max(ax, bx) + 0.08, Math.max(ay, by) + 0.08, F + 1.75, 'b') // the boards
      for (let i = 0; i <= n; i++) { const t = i / n; box(red, ax + (bx - ax) * t - 0.16, ay + (by - ay) * t - 0.16, 0, ax + (bx - ax) * t + 0.16, ay + (by - ay) * t + 0.16, F + 2.0, 'b') }
    }
    rail(hx0 + 0.2, hy0 + 0.2, hx1 - 0.2, hy0 + 0.2); rail(hx0 + 0.2, hy1 - 0.2, hx1 - 0.2, hy1 - 0.2); rail(hx1 - 0.2, hy0 + 0.2, hx1 - 0.2, hy1 - 0.2)
    // the heiden: dark wood, hip-and-gable cypress-bark roof, its ridge north-south
    const ex = (wx1 - wx0) / 2, ey = (wy1 - wy0) / 2, wcx = (wx0 + wx1) / 2, wcy = (wy0 + wy1) / 2
    box(wood, wcx - ex + 0.8, wcy - ey + 0.8, 0, wcx + ex - 0.6, wcy + ey - 0.8, F + 3.9, 'b')
    for (const f of ['w', 's', 'n'] as const) {
      const hx = ex - 0.7, hy = ey - 0.8, len = f === 'w' ? hy : hx
      panelOn(white, f, hx, hy, -len + 0.6, len - 0.6, F + 3.1, F + 3.6, 0.04, wcx - 0.1, wcy)
    }
    const R = placed({ roof: bark, ridge: bark, gable: wood, soffit: wood, edge: wood }, Math.PI / 2, wcx, wcy)
    croof(R, { coarse: 2, kind: 'paljak', ex: ey, ey: ex, ze: F + 4.3, gx: ey - 2.2, gy: ex * 0.45, zg: F + 5.6, zr: F + 7.0, rx: ey - 2.6,
      lift: 0.35, flare: 0.25, sag: 0.35, th: 0.5, pow: 2.6, soffit: { bx: ey - 0.8, by: ex - 0.7, zb: F + 3.9 }, ridge: { h: 0.5, w: 0.55 }, ridgeSag: 0.03, hipRidge: { w: 0.3, h: 0.26 } })
  }
  // hall(honden part x0,y0,x1,y1, heiden part x0,y0,x1,y1) in the first frame
  hall(-10.9, -64.9, 1.9, -56.2, -19.1, -66.0, -10.9, -54.6) // third
  hall(-11.2, -79.1, 2.2, -70.5, -19.5, -80.0, -11.2, -69.2) // fourth
  hall(20.2, -67.4, 32.9, -58.9, 11.9, -68.7, 20.2, -56.9) // second
  hall(63.9, -72.0, 76.6, -62.0, 54.5, -74.6, 63.9, -57.3) // first

  const parts: Mat[] = [
    { part: red, material: finish('vermilion', 0xcc5a3c) },
    { part: white, material: finish('gofun-white', 0xefe9df) },
    { part: bark, material: finish('cypress-bark', 0x5a514a) },
    { part: wood, material: finish('dark-wood', 0x4f4038) },
    { part: gold, material: finish('gilt', 0xcda550) },
  ]
  return parts
}

if (import.meta.main) {
  await save('Sumiyoshi Taisha', build(), 'osaka-sumiyoshi-taisha.glb', 6500, 250_000, { bearing: 0, elevation: 0, height: F + 11.7, osm: 'way/234736155' })
}

