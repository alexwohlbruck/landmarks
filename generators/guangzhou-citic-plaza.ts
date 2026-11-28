/**
 * CITIC Plaza (中信广场), Tianhe, Guangzhou — original procedural geometry,
 * CC0-1.0.
 * bun generators/guangzhou-citic-plaza.ts   (writes the low model and the detail LOD)
 *
 * Frame: bearing 0 (the OSM square is aligned with north). Origin = the
 * centroid of the tower outline way/926228208 (113.319384 E, 23.144363 N),
 * on the plaza; elevation 0.
 *
 * Form, from the OSM parts (mapped in detail) and the photos:
 * - a 47.6 m square, standing on four corner piers (0-17.7 m, way/1548063154
 *   ...57) round a recessed glass lobby, under a transfer storey (17.7-27 m,
 *   way/1548063165);
 * - the body (27-297 m): the octagonal core part way/1548063158 shows on
 *   each face as a 16 m central strip of blue-green glass with pale
 *   horizontal bands, and the two wing parts way/1548063152/53 (27-321.9 m)
 *   fill the corners in pale grey-green cladding with grouped window
 *   panels;
 * - the stepped crown: above 297 m the core stops, opening a slot between
 *   the wings on the north and south faces and the V notches (from the wing
 *   outlines) on the east and west faces; the blue glass drum
 *   way/1548063159 (to 310.8 m) shows in them; the wings rise to 321.9 m;
 * - the two masts in the east and west notches (way/1548063161, 390.2 m,
 *   and way/1548063162, 391.1 m) on triangular bases to 344 m
 *   (way/1548063163/64), and the red "中信" sign between them (330-344 m,
 *   way/1548063160, white frame).
 *
 * The twin 38-storey apartment towers (way/157418082, way/157418084) and the
 * retail podium (way/157418073) are separate OSM buildings, not parts of the
 * tower's outline (only the landuse way/1308645186 ties them together), so
 * they are left to the map, per the batch rule.
 *
 * Evidence
 * - OSM (© OpenStreetMap contributors, ODbL), fetched 2026-11-27: outline
 *   way/926228208 and the parts listed above (heights as tagged).
 * - Published (Wikipedia "CITIC Plaza"; CTBUH): 390.2 m architectural
 *   (with the two spires), roof 321.9 m, top floor 296.9 m, 80 floors;
 *   Dennis Lau & Ng Chun Man; completed 1997; two 38-storey residential
 *   towers in the complex.
 * - Photos (Wikimedia Commons):
 *   "CITIC Plaza 2017.jpg", そらみみ, CC BY-SA 4.0, from the south (180 deg,
 *   940 m): the face layout, slot, drum, sign, masts, colours;
 *   https://commons.wikimedia.org/wiki/File:CITIC_Plaza_2017.jpg
 *   "CITIC Plaza 2018 07.jpg", Nissangeniss, CC BY-SA 4.0, from the south:
 *   the same, closer; https://commons.wikimedia.org/wiki/File:CITIC_Plaza_2018_07.jpg
 *   "中信廣場 CITIC Plaza - panoramio.jpg", Bohao Zhao, CC BY 3.0, from the
 *   WSW (251 deg): the west face, its notch, drum and mast base;
 *   https://commons.wikimedia.org/wiki/File:%E4%B8%AD%E4%BF%A1%E5%BB%A3%E5%A0%B4_CITIC_Plaza_-_panoramio.jpg
 *   "中信大厦南侧 - panoramio.jpg", zengsx, CC BY-SA 3.0, from the south at
 *   the foot (183 deg); https://commons.wikimedia.org/wiki/File:%E4%B8%AD%E4%BF%A1%E5%A4%A7%E5%8E%A6%E5%8D%97%E4%BE%A7_-_panoramio.jpg
 *   "中信广场 - panoramio - 钟启明 (5).jpg", 钟启明, CC BY-SA 3.0, from the NNW
 *   (334 deg); https://commons.wikimedia.org/wiki/File:%E4%B8%AD%E4%BF%A1%E5%B9%BF%E5%9C%BA_-_panoramio_-_%E9%92%9F%E5%90%AF%E6%98%8E_(5).jpg
 *   "Guangzhou CITIC Plaza at Night.jpg", JULIANISME, CC BY-SA 4.0: night
 *   (the sign lit red, the strip lit); https://commons.wikimedia.org/wiki/File:Guangzhou_CITIC_Plaza_at_Night.jpg
 * - No lidar, NAIP or Mapillary in Guangzhou (batch notes).
 * - Look-only references: none.
 *
 * Numbers
 * - Measured (OSM, tagged): every height above; the plan.
 * - Estimated: the lobby inset (4 m), the band and panel rhythm (three
 *   storeys a panel), the mast radii, the drum's cap ring, the sign's
 *   thickness (1.2 m) and the strokes of its characters.
 * - Colours sampled from the 2017 and 2018 photos: wing cladding and glass
 *   #869aac-#8fb0c9 -> cladding #cad4d9 with panels #93abbd; the central
 *   glass #557b8f-#6498bd -> #5e8aa6; the sign red #c0393f.
 *
 * Doubts
 * - The sign's two characters are drawn as heavy straight strokes after the
 *   photos, not traced letterforms (the tower, not the sign, is the
 *   landmark).
 * - The lobby between the corner piers is not mapped; drawn as a glass box.
 *
 * Night: the central strip and the wing panels glow as windows; the sign is
 * neon red; the drum is lit; lamps at the mast tips.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { K, type P2 } from './taipei-101'
import { saveLods, type Layer } from './auckland-sky-tower'

const ID = 'guangzhou-citic-plaza'
const H = 23.8 // half the square
const STRIP = 8.0 // half-width of the central strip (core part)
const Z_PIER = 17.7, Z_BASE = 27, Z_CORE = 297, Z_DRUM = 310.8, Z_WING = 321.9

// OSM wing outlines (model frame, metres)
const WING_E: P2[] = [[3.4, 19.2], [8.0, 23.7], [23.9, 23.7], [23.8, 7.9], [17.5, 1.6], [15.9, 1.6], [14.8, 1.1], [14.3, 0.0], [14.8, -1.1], [15.9, -1.5], [17.5, -1.5], [23.8, -7.9], [23.8, -23.6], [7.9, -23.6], [3.4, -19.1]]
const WING_W: P2[] = WING_E.map(([x, y]) => [-x, y] as P2)
const CORE: P2[] = [[8.0, 23.7], [-7.9, 23.7], [-23.8, 8.0], [-23.8, -7.8], [-8.0, -23.6], [7.9, -23.6], [23.8, -7.9], [23.8, 7.9]]
const MASTS: { x: number; top: number }[] = [{ x: -16.7, top: 390.2 }, { x: 16.7, top: 391.1 }]

type Set = { clad: Part; win: Part; strip: Part; neon: Part; roof: Part; trim: Part }
const mk = (): Set => ({ clad: new Part(), win: new Part(), strip: new Part(), neon: new Part(), roof: new Part(), trim: new Part() })

function build(detail: boolean): Layer[] {
  const s = mk()

  // ---- base: corner piers, recessed lobby, transfer storey
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x0 = sx * H, y0 = sy * H, x1 = sx * (H - 7.9), y1 = sy * (H - 7.9)
    K.prism(s.clad, [[Math.min(x0, x1), Math.min(y0, y1)], [Math.max(x0, x1), Math.min(y0, y1)], [Math.max(x0, x1), Math.max(y0, y1)], [Math.min(x0, x1), Math.max(y0, y1)]], 0, Z_PIER, false)
  }
  const lob = H - 4
  K.prism(s.win, [[-lob, -lob], [lob, -lob], [lob, lob], [-lob, lob]], 0, Z_PIER, false)
  const sq = (h: number): P2[] => [[-h, -h], [h, -h], [h, h], [-h, h]]
  K.prism(s.clad, sq(H), Z_PIER, Z_BASE, false, true)
  K.band(s.win, sq(H), Z_PIER + 3, Z_PIER + 6.5, 0.05, 0)

  // ---- body: wings (to 321.9) and the core (to 297)
  for (const w of [WING_E, WING_W]) K.prism(s.clad, w, Z_BASE, Z_WING, true, false, s.roof)
  K.prism(s.strip, CORE, Z_BASE, Z_CORE, true, false, s.roof)

  // the central strips: pale horizontal bands every three storeys, standing proud of the glass
  const faces: { n: P2; t: P2 }[] = [{ n: [0, -1], t: [1, 0] }, { n: [1, 0], t: [0, 1] }, { n: [0, 1], t: [-1, 0] }, { n: [-1, 0], t: [0, -1] }]
  const storey = (Z_CORE - Z_BASE) / 70 // 70 storeys over the body (80 floors less the base and crown)
  const bandStep = storey * (detail ? 2 : 3)
  for (const f of faces) {
    const o = (u: number, out = 0): P2 => [f.n[0] * (H + out) + f.t[0] * u, f.n[1] * (H + out) + f.t[1] * u]
    for (let z = Z_BASE + bandStep; z < Z_CORE - 2; z += bandStep) {
      const r: P2[] = [o(-STRIP + 0.2, -0.1), o(STRIP - 0.2, -0.1), o(STRIP - 0.2, 0.45), o(-STRIP + 0.2, 0.45)]
      K.prism(s.trim, K.ccw(r), z - (detail ? 0.3 : 0.4), z + (detail ? 0.3 : 0.4), true, true)
    }
    // pale jambs where the strip meets the wings
    for (const u of [-STRIP, STRIP]) {
      const r: P2[] = [o(u - 0.6, -0.1), o(u + 0.6, -0.1), o(u + 0.6, 0.5), o(u - 0.6, 0.5)]
      K.prism(s.clad, K.ccw(r), Z_BASE, Z_CORE, true)
    }
    // the wings' window panels: three bays a side, three (detail: two) storeys a panel
    const rows = detail ? 2 : 3
    const ph = storey * rows
    const bays = detail ? 4 : 3
    for (const side of [-1, 1]) {
      const u0 = side < 0 ? -H + 1.4 : STRIP + 1.0, u1 = side < 0 ? -STRIP - 1.0 : H - 1.4
      const bw = (u1 - u0) / bays
      for (let b = 0; b < bays; b++) {
        const a = u0 + b * bw + 0.55, c = u0 + (b + 1) * bw - 0.55
        // tall panels per group of storeys (spandrels between)
        for (let z = Z_BASE + 1.2; z + ph - 1.0 <= Z_WING - 3; z += ph) {
          const zt = z + ph - 1.1
          const P = (u: number, zz: number): V3 => [o(u, 0.04)[0], o(u, 0.04)[1], zz]
          s.win.quad(P(a, z), P(c, z), P(c, zt), P(a, zt))
        }
      }
    }
  }

  // ---- crown: drum in the slots, wing parapet lips, masts, sign
  const nd = detail ? 32 : 16
  K.cyl(s.strip, 0, 0, Z_CORE, Z_DRUM - 1.5, 20.6, 20.6, nd, false)
  K.cyl(s.trim, 0, 0, Z_DRUM - 1.5, Z_DRUM, 21.0, 21.0, nd, true)
  for (const w of [WING_E, WING_W]) K.band(s.trim, K.ccw(w), Z_WING - 1.4, Z_WING, 0.3, 0)
  for (const m of MASTS) {
    // triangular base (OSM), then a two-stage mast with rings
    const sx = Math.sign(m.x)
    K.prism(s.trim, K.ccw([[m.x - sx * 0.9, 1.8], [m.x + sx * 1.0, 0], [m.x - sx * 0.9, -1.8]]), Z_CORE, 344, true)
    K.cyl(s.trim, m.x, 0, 344, 362, 1.2, 0.8, detail ? 12 : 8, false)
    K.cyl(s.trim, m.x, 0, 362, m.top, 0.7, 0.3, detail ? 10 : 6, true)
    if (detail) for (const zr of [352, 362, 372]) K.cyl(s.trim, m.x, 0, zr, zr + 0.8, 1.15, 1.15, 12, true, true)
    K.cyl(s.neon, m.x, 0, m.top - 1.6, m.top - 0.4, 0.55, 0.55, 6, true, true) // the warning light (lit red at night)
  }
  // the sign: a white panel on each face with the two characters in heavy red strokes (simplified from the photos)
  K.box(s.trim, [0, 0, 337], 15.5, 0.6, 7)
  const ZHONG = [[1.2, 6.8, 8.8, 7.9], [1.2, 3.2, 8.8, 4.3], [1.2, 3.2, 2.3, 7.9], [7.7, 3.2, 8.8, 7.9], [4.4, 0.4, 5.6, 9.6]]
  const XIN = [[1.6, 0.4, 2.7, 7.4], [0.7, 7.6, 3.0, 8.8], [5.9, 8.8, 7.1, 9.7], [3.8, 7.5, 9.4, 8.3], [4.6, 6.1, 8.6, 6.8], [4.6, 4.8, 8.6, 5.5],
    [4.6, 0.4, 8.6, 1.2], [4.6, 3.1, 8.6, 3.9], [4.6, 0.4, 5.4, 3.9], [7.8, 0.4, 8.6, 3.9]]
  for (const sy of [-1, 1]) {
    const t: P2 = [sy < 0 ? 1 : -1, 0] // reading left to right on each face
    ;[ZHONG, XIN].forEach((glyph, gi) => {
      const cu = (gi === 0 ? -7.4 : 7.4) * t[0] // the first character on the reader's left
      for (const [u0, v0, u1, v1] of glyph) {
        const k = 1.15, ou = -5.75, ov = -5.75
        const r: P2[] = [[ou + u0 * k, ov + v0 * k], [ou + u1 * k, ov + v0 * k], [ou + u1 * k, ov + v1 * k], [ou + u0 * k, ov + v1 * k]]
        K.plate(s.neon, r, [cu, sy * 0.6, 337], t, [0, sy], 0.12)
      }
    })
  }

  const lamp = finish('neon-citic-red', 0xc0393f)
  return [
    { part: s.clad, material: finish('citic-cladding', 0xcad4d9) },
    { part: s.win, material: PALETTE.window.color ? { ...PALETTE.window, color: 0x93abbd } : PALETTE.window },
    { part: s.strip, material: windowVariant(2, 0x5e8aa6) },
    { part: s.trim, material: { ...PALETTE.trim, color: 0xf2f1ec } },
    { part: s.roof, material: PALETTE.roof },
    { part: s.neon, material: lamp },
  ]
}

if (import.meta.main) {
  await saveLods(ID, 'CITIC Plaza', build(false), build(true), {
    frame: 'Y up, -Z north, +X east, metres; origin at the centroid of way/926228208, on the plaza',
    bearing: 0, height: 391.1, anchor: [23.144363, 113.319384],
  }, 6500)
}
