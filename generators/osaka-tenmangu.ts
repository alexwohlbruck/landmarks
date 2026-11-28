/**
 * Ōsaka Tenmangū (大阪天満宮), Kita-ku, Osaka: the main hall (the haiden in
 * front, the link and the honden behind, rebuilt 1843) and the omote-ōmon,
 * the great south gate with its zodiac compass plaque (方位盤) —
 * procedural, CC0-1.0.
 * bun generators/osaka-tenmangu.ts
 *
 * Writes models/osaka-tenmangu.glb. Built with the kit in osaka-castle.ts
 * (croof, tube, panelOn) and tokyo-meiji-jingu.ts (gable2, placed).
 *
 * Map frame: x east, y north, z up, metres; bearing 356, the hall's axis
 * (OSM way/164672867's sides run at 356° / 86°). The gate's outline runs at
 * 0°, so the gate is drawn turned 4° in this frame. Origin: the centre of
 * the hall's and the gate's common bounding box (135.5126671, 34.6958892);
 * the hall's axis of symmetry is x = 0.
 *
 * Identity, in order: the broad haiden under its huge sweeping copper
 * hip-and-gable roof, its gables to the east and west, the front eave
 * drawn deep over the dark wooden front with white panels and gilt
 * fittings; the taller honden roof behind it; the dark wooden gate with
 * its two great pillars, the grey tile hip-and-gable roof, the shimenawa
 * rope over the passage and the painted zodiac compass.
 *
 * Evidence:
 *  - OSM: way/164672867 (本殿, building=shrine, Q385793), one outline for the
 *    whole hall: the front steps x -5.8..5.8, y 0.1..3.3; the haiden
 *    x -15.25..15.25, y 3.3..15.6; the link x -8.3..7.7, y 15.6..19.6; the
 *    honden x -12.4..12.0, y 19.6..37.8. way/179076090 (building=roof), a
 *    roofed passage off the haiden's east side, x 15.2..20.8, y 11.5..15.3.
 *    way/231529765 (正門, building=gatehouse) 10.7 × 10.9 m at (-3.2, -33.3).
 *    way/363304259 is the precinct (landuse), not in `replaces`.
 *  - published (ja.wikipedia 大阪天満宮; the shrine's site): founded 949; the
 *    present hall rebuilt in 1843 after the Ōshio fire; the omote-ōmon
 *    (1901) carries the 方位盤, a compass of the twelve zodiac animals,
 *    under its eave. No heights published.
 *  - heights (estimated from Sakai Yayoi's frontal view, "Osaka Tenmangu
 *    Shrine ao 01.jpg", scaled by the haiden's eave = 34 m): the platform
 *    1.5; the front posts and beam to 8.5; the front skirt eave (hisashi)
 *    over the veranda from 9.9 at the wall to 8.7 at its edge; one
 *    hip-and-gable roof over the whole haiden, eave 11.0, gable foot 12.4,
 *    a single straight ridge at 15.3. The honden (663highland's and Sakai
 *    Yayoi's oblique views, where its roof rises above the haiden's): eave
 *    10.0, ridge 16.6. Gate ("ao 04.jpg", its pillars 5.5 m apart, people
 *    for height): beams 5.0-5.8, brackets to 6.9, eave 7.2, ridge 9.8 (the
 *    OSM outline's 10.7 m is the roof).
 *  - colours (daylight photos, sampled and pulled to the palette): the
 *    haiden's (front) copper was re-laid recently and reads a weathered red-brown
 *    in the 2025-26 photos (sampled #9d7e75 sunlit): #8a6658; the link, the
 *    honden and the east passage keep their green patina (sampled #a0b69d in "ao 03"): #8fae96;
 *    the gate's dark tile #5d6067 (sampled #838489 sunlit); the dark
 *    lacquered wood #54463e (sampled near-black #18181a in shade, kept just
 *    above the palette's floor); white panels #ddd6c8, one row per bay between
 *    the posts in the upper wall; gilt fittings #cda550 (the shimenawa's straw and the
 *    compass's rim share it; its ring is the brown copper).
 *  - night: the haiden's front is lit (hatsumōde photos by Mr.ちゅらさん);
 *    its front wood and panels carry `_FLOODLIGHT`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Osaka Tenmangu Shrine ao 01.jpg-04.jpg and Osaka Tenmangu Shrine 2026.jpg, Sakai Yayoi, CC0 (front, south-east, gate)
 *  - Osaka Tenmangu01n3390.jpg, 663highland, CC BY 2.5 (south-west)
 *  - Osaka Temmangu honden.jpeg, nnh, public domain (the honden's side)
 *  - 大阪天満宮 Mar 4, 2016.jpg, aya matsu, CC BY-SA 2.0 (front, before re-roofing)
 *  - 大阪天満宮 01.JPG and 02.JPG, Maechan0360, CC BY-SA 3.0 (gate from the street; front)
 *  - Osaka Tenmangu Houiban.jpg, Kuribo, CC BY-SA 3.0 (the compass)
 *  - Osaka Tenmangu Hatsumoude 2025-1.jpg and -2.jpg, Mr.ちゅらさん, CC BY-SA 4.0 (night)
 * No commercial imagery. No look-only references.
 *
 * Added in review: the hanging lanterns along the front.
 * Left out: the corridors and side buildings either side of the gate, the
 * stone lanterns, lions and fences.
 * Doubts: the honden's height and the link's roof are estimated from
 * oblique views (no photo shows the back); which face of the gate's frieze
 * the compass is on (drawn on the north, inner face, since the south views
 * don't show it); the haiden's side aisles are drawn under the main roof.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { placed, save, gable2, rbox, quadOut, triOut, grid, type Mat } from './tokyo-meiji-jingu'
import { box } from './seoul-geunjeongjeon'
import { croof, tube, panelOn, shachi, type RoofParts } from './osaka-castle'

function build() {
  const copper = new Part(), green = new Part(), tile = new Part(), wood = new Part(), white = new Part(), gold = new Part()
  const HR: RoofParts = { roof: copper, ridge: copper, gable: wood, soffit: wood, edge: wood }
  const GR: RoofParts = { roof: green, ridge: green, gable: wood, soffit: wood, edge: wood }
  const sweep = { coarse: true as const, lift: 1.4, flare: 1.0, sag: 0.7, pow: 1.8 }
  /** White panels between posts on a wall face: n bays along the face, inset from each post. */
  const panels = (f: 's' | 'n' | 'e' | 'w', hx: number, hy: number, cx: number, cy: number, n: number, z0: number, z1: number) => {
    const L = f === 's' || f === 'n' ? hx : hy, bw = (2 * L) / n
    for (let i = 0; i < n; i++) panelOn(white, f, hx, hy, -L + i * bw + 0.4, -L + (i + 1) * bw - 0.4, z0, z1, 0.04, cx, cy)
  }

  // ---- Haiden --------------------------------------------------------------
  const H = { x0: -15.25, x1: 15.25, y0: 3.3, y1: 15.6 }
  const hcy = (H.y0 + H.y1) / 2, hhy = (H.y1 - H.y0) / 2
  const P = 1.5 // the platform
  box(wood, H.x0 - 0.6, 0.1, 0, H.x1 + 0.6, H.y1 + 0.4, P, '') // platform
  box(wood, -5.8, 0.1, 0, 5.8, H.y0, P * 0.6, '') // the steps
  // the walls behind the front veranda: dark lacquered wood, one row of white panels in the upper
  // wall between the posts, under the beam
  const wy0 = H.y0 + 1.6, wcy = (wy0 + H.y1) / 2, whx = 15.25, why = (H.y1 - wy0) / 2
  box(wood, H.x0, wy0, P, H.x1, H.y1, P + 9.0, 'b')
  const bays = 7, bw = (H.x1 - H.x0) / bays
  panels('s', whx, why, 0, wcy, bays, P + 5.2, P + 6.1)
  for (const f of ['e', 'w', 'n'] as const) panels(f, whx, why, 0, wcy, f === 'n' ? bays : 4, P + 7.0, P + 7.9)
  // the front posts, the beam over them and its panels, gilt fittings
  for (let i = 0; i <= bays; i++) tube(wood, [[H.x0 + i * bw, H.y0 + 0.3, P], [H.x0 + i * bw, H.y0 + 0.3, P + 7.0]], [0.32, 0.3], 8)
  box(wood, H.x0, H.y0, P + 6.4, H.x1, H.y0 + 0.6, P + 7.4, '')
  for (let i = 0; i <= bays; i++) rbox(gold, H.x0 + i * bw, H.y0 - 0.02, 0.22, 0.04, P + 6.75, P + 7.05, 0, 'n')
  // hanging lanterns, one in each bay under the beam
  for (let i = 0; i < bays; i++) {
    const x = H.x0 + (i + 0.5) * bw, y = H.y0 + 0.3
    tube(wood, [[x, y, P + 6.4], [x, y, P + 6.15]], [0.05, 0.05], 4)
    tube(white, [[x, y, P + 5.35], [x, y, P + 5.6], [x, y, P + 5.9], [x, y, P + 6.15]], [0.22, 0.33, 0.33, 0.22], 8)
    tube(wood, [[x, y, P + 6.1], [x, y, P + 6.2]], [0.25, 0.25], 8)
  }
  // the front skirt eave (hisashi) over the veranda: a curved lean-to from the wall to the posts' line
  {
    const X = [-16.2, -15.2, -11, -5.5, 0, 5.5, 11, 15.2, 16.2], T = [0, 0.35, 0.7, 1]
    const lift = (x: number) => 0.55 * Math.pow(Math.max(0, (Math.abs(x) - 11) / 5.2), 2)
    const at = (x: number, t: number, dz = 0): V3 => [x, wy0 - (wy0 - 1.7) * t, P + 8.4 - 1.25 * t - 0.25 * t * (1 - t) + lift(x) * t + dz]
    grid(copper, X.map((x) => T.map((t) => at(x, t))), true)
    grid(wood, X.map((x) => T.map((t) => at(x, t, -0.4))))
    for (let k = 0; k < X.length - 1; k++) quadOut(wood, at(X[k], 1, -0.4), at(X[k + 1], 1, -0.4), at(X[k + 1], 1), at(X[k], 1), [0, -1, 0])
    for (const x of [X[0], X[X.length - 1]]) for (let k = 0; k < T.length - 1; k++) quadOut(wood, at(x, T[k], -0.4), at(x, T[k + 1], -0.4), at(x, T[k + 1]), at(x, T[k]), [Math.sign(x), 0, 0])
  }
  // one hip-and-gable roof over the whole haiden: a single straight ridge, gables east and west
  const mcy = 10.4
  croof(HR, { ...sweep, kind: 'paljak', cy: mcy, ex: 16.7, ey: 6.6, ze: P + 9.5, gx: 13.4, gy: 4.2, zg: 12.4, zr: 15.3, rx: 12.8,
    th: 0.55, soffit: { bx: 15.25, by: why, zb: P + 9.0 }, ridge: { h: 0.75, w: 0.8 }, ridgeSag: 0.0, hipRidge: { w: 0.4, h: 0.36 } })
  for (const s of [-1, 1]) {
    const gx = s * 13.4 + s * 0.08
    quadOut(gold, [gx, mcy - 0.9, 13.4], [gx, mcy + 0.9, 13.4], [gx, mcy + 0.6, 14.6], [gx, mcy - 0.6, 14.6], [s, 0, 0])
    rbox(copper, s * 13.0, mcy, 0.45, 0.5, 15.3, 16.4, 0, 'b')
  }
  for (const x of [-9, -4.5, 0, 4.5, 9]) rbox(gold, x, mcy - 0.42, 0.3, 0.05, 15.45, 15.85, 0, 'n')

  // ---- The link and the honden (green copper) ------------------------------
  const L = { x0: -8.3, x1: 7.7, y0: H.y1, y1: 19.6 }
  box(wood, L.x0, L.y0, 0, L.x1, L.y1, P + 8.0, 'b')
  const Kq = placed({ roof: green, edge: wood, soffit: wood, gable: wood }, Math.PI / 2, 0, (L.y0 + L.y1) / 2 + 1)
  gable2(Kq, { L: 3.4, Df: 9.0, Db: 9.0, zf: P + 8.6, zb: P + 8.6, zr: 13.4, sag: 0.45, th: 0.4, ridge: { w: 0.6, h: 0.5 } })
  const R = { x0: -12.4, x1: 12.0, y0: L.y1, y1: 37.8 }
  const rcx = (R.x0 + R.x1) / 2, rcy = (R.y0 + R.y1) / 2, rhx = (R.x1 - R.x0) / 2, rhy = (R.y1 - R.y0) / 2
  box(wood, R.x0, R.y0, 0, R.x1, R.y1, P + 8.0, 'b')
  for (const f of ['s', 'n', 'e', 'w'] as const) panels(f, rhx, rhy, rcx, rcy, f === 's' || f === 'n' ? 6 : 5, P + 5.0, P + 6.3)
  croof(GR, { ...sweep, kind: 'paljak', cx: rcx, cy: rcy, ex: rhx + 1.9, ey: rhy + 1.9, ze: 10.0, gx: rhx - 1.6, gy: rhy * 0.6, zg: 12.4, zr: 16.6, rx: rhx - 2.0,
    th: 0.55, soffit: { bx: rhx, by: rhy, zb: P + 8.0 }, ridge: { h: 0.75, w: 0.8 }, ridgeSag: 0.15, hipRidge: { w: 0.4, h: 0.36 } })
  for (const s of [-1, 1]) {
    rbox(green, rcx + s * (rhx - 1.6), rcy, 0.45, 0.5, 16.6, 17.8, 0, 'b')
    const gx = rcx + s * (rhx - 1.6) + s * 0.08
    quadOut(gold, [gx, rcy - 0.7, 14.8], [gx, rcy + 0.7, 14.8], [gx, rcy + 0.5, 15.8], [gx, rcy - 0.5, 15.8], [s, 0, 0])
  }
  for (const x of [-7, -2.3, 2.3, 7]) rbox(gold, rcx + x, rcy - 0.42, 0.3, 0.05, 16.75, 17.15, 0, 'n')

  // ---- The roofed passage east of the haiden (OSM way/179076090) -----------
  for (const [x, y] of [[16.0, 11.9], [20.3, 11.9], [16.0, 14.9], [20.3, 14.9]]) box(wood, x - 0.15, y - 0.15, 0, x + 0.15, y + 0.15, 3.2, 'b')
  const Cq = placed({ roof: green, edge: wood, soffit: wood, gable: wood }, 0, 18.1, 13.4)
  gable2(Cq, { L: 2.9, Df: 2.2, Db: 2.2, zf: 3.3, zb: 3.3, zr: 4.5, sag: 0.3, th: 0.25, ridge: { w: 0.35, h: 0.3 }, coarse: true })

  // ---- The omote-ōmon (gate), turned 4° ------------------------------------
  const G = placed({ tile, wood, white, gold, copper }, -4 * Math.PI / 180, -3.15, -33.3)
  for (const s of [-1, 1]) {
    tube(G.wood, [[s * 2.75, 0, 0], [s * 2.75, 0, 5.8]], [0.5, 0.46], 10) // the great pillars
    tube(G.gold, [[s * 2.75, 0, 0], [s * 2.75, 0, 1.2]], [0.58, 0.54], 10) // their bronze bases
    for (const t of [-1, 1]) tube(G.wood, [[s * 2.75, t * 2.4, 0], [s * 2.75, t * 2.4, 5.0]], [0.3, 0.28], 8)
    box(G.wood, s * 2.75 - 0.25, -2.4, 4.5, s * 2.75 + 0.25, 2.4, 5.0, '') // tie beams front-back
  }
  for (const t of [-2.4, 0, 2.4]) box(G.wood, -3.5, t - 0.28, 5.0, 3.5, t + 0.28, 5.8, '') // cross beams
  box(G.wood, -3.8, -2.9, 5.8, 3.8, 2.9, 6.9, '') // the bracket zone
  croof({ roof: G.tile, ridge: G.tile, gable: G.wood, soffit: G.wood, edge: G.wood }, { coarse: true, kind: 'paljak', ex: 5.35, ey: 5.45, ze: 7.2, gx: 3.7, gy: 2.0, zg: 8.4, zr: 9.8, rx: 3.4,
    lift: 0.95, flare: 0.65, sag: 0.55, th: 0.45, pow: 1.9, soffit: { bx: 3.8, by: 2.9, zb: 6.9 }, ridge: { h: 0.5, w: 0.55 }, ridgeSag: 0.12, hipRidge: { w: 0.32, h: 0.3 } })
  for (const s of [-1, 1]) shachi(G.tile, [s * 3.75, 0, 10.2], 1.1, [s, 0], false)
  // the shimenawa over the passage (straw, drawn in the gilt)
  const rope: V3[] = [], rr: number[] = []
  for (let i = 0; i <= 8; i++) { const t = i / 8, x = -2.3 + 4.6 * t; rope.push([x, -0.6, 4.6 - 0.5 * Math.sin(Math.PI * t)]); rr.push(0.2 + 0.14 * Math.sin(Math.PI * t)) }
  tube(G.gold, rope, rr, 6)
  // the zodiac compass (方位盤): a gilt-rimmed disc on the frieze's north face
  {
    const n = 16, c: V3 = [0, 2.93, 6.35], R2 = 1.0, R1 = 0.88, R0 = 0.55
    const p = (r: number, a: number): V3 => [c[0] + r * Math.cos(a), c[1], c[2] + r * Math.sin(a)]
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2
      quadOut(G.gold, p(R1, a0), p(R2, a0), p(R2, a1), p(R1, a1), [0, 1, 0])
      quadOut(G.copper, p(R0, a0), p(R1, a0), p(R1, a1), p(R0, a1), [0, 1, 0])
      triOut(G.gold, c, p(R0, a0), p(R0, a1), [0, 1, 0])
    }
  }

  const front = (pt: V3, n: V3) => (pt[1] > -1 && pt[1] < 16 && n[1] < -0.5 && pt[2] < 10 ? 0.75 : 0)
  const parts: Mat[] = [
    { part: copper, material: finish('copper-roof', 0x8a6658) },
    { part: green, material: finish('copper-green', 0x8fae96) },
    { part: tile, material: finish('roof-tile', 0x5d6067) },
    { part: wood, material: { ...finish('dark-wood', 0x54463e), floodlight: front } },
    { part: white, material: { ...finish('white-panel', 0xddd6c8), floodlight: front } },
    { part: gold, material: { ...finish('gilt', 0xcda550), floodlight: front } },
  ]
  return parts
}

if (import.meta.main) {
  await save('Osaka Tenmangu', build(), 'osaka-tenmangu.glb', 5000, 250_000, { bearing: 356, elevation: 0, height: 17.8, osm: 'way/164672867' })
}
