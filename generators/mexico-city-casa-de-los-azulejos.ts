/**
 * Casa de los Azulejos (House of Tiles; Palacio de los Condes del Valle de
 * Orizaba, tiled c. 1737–1750, Sanborns since 1919), between Madero and
 * 5 de Mayo on the Callejón de la Condesa, Mexico City — original
 * procedural geometry, CC0-1.0.
 * bun generators/mexico-city-casa-de-los-azulejos.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/158032444,
 * 19.434351,-99.140123. Its walls run at 8.6° / 98.6°, so the catalog
 * bearing is 8.6 and the model is square to its own frame: a 22.3 × 59.4 m
 * block, its south front on Madero, its north front on 5 de Mayo, its long
 * west side on the Callejón de la Condesa (OSM way/217323082), its east
 * side a party wall.
 *
 * Identity, in order: the blue-and-white Talavera tile that covers the
 * street fronts (colour is identity: one light blue finish, the tiles' blue
 * and white averaged as they read from across the street, pulled to the
 * palette's lightness); the grey cantera stone that frames it — pilasters,
 * the frieze between the two storeys, window and door surrounds, the deep
 * cornice; the tiled parapet rising in a wave over each bay between
 * pinnacles; the tall corner pinnacle and the raised crest over the second
 * bay of the 5 de Mayo front; the iron balconies of the upper storey; the
 * covered patio (the Sanborns restaurant) under a glazed lantern.
 *
 * Evidence:
 *  - plan: OSM way/158032444 (22.3 × 59.4 m).
 *  - heights: OSM's height=9.2 is too low. Measured on José Luiz's level,
 *    frontal view of the 5 de Mayo front (30 px/m over its 22 m width):
 *    frieze 6.0–6.8 m, balconies at ~7 m, cornice top ~12.2 m, parapet
 *    13.5 m rising to ~14.2 m mid-bay, pinnacles ~15.6 m, the corner
 *    pinnacle ~17.7 m, the crest ~16.8 m. Two storeys, as all photos show.
 *  - bays: from the same photo (window centres 2.5, 7, 11.9 and 18 m from
 *    the east end; pilasters between) and from Thomas Ledl's corner view
 *    of the 5 de Mayo front and the callejón side (Casa_de_Azulejos_3.jpg),
 *    which shows the callejón side tiled, with a pinnacle over each
 *    pilaster, at about 5 m bays.
 *  - patio: Diego Delso's interior views (DD 46, DD 47): a two-storey
 *    arcaded court roofed by a glazed clerestory above the roof line. Its
 *    position and size (13 × 15 m, behind the Madero entrance) are
 *    estimates.
 *  - the Madero front is modelled like the 5 de Mayo front, its corner
 *    pinnacle at the callejón corner and without the crest; no level photo
 *    of it was found, so its bays are estimates. The far (north) end of the
 *    callejón side reads browner in José Luiz's street view; it is kept
 *    tiled here (doubt).
 *  - terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s); the
 *    Centro sits on the flat lake-bed basin (~2,240 m). Modelled level.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Casa_de_los_Azulejos_-_Mexico_2024_(5).jpg, José Luiz, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Casa_de_los_Azulejos_-_Mexico_2024_(5).jpg
 *  - Casa_de_los_Azulejos_-_Mexico_2024.jpg, José Luiz, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Casa_de_los_Azulejos_-_Mexico_2024.jpg
 *  - Casa_de_Azulejos_3.jpg, Thomas Ledl, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Casa_de_Azulejos_3.jpg
 *  - Casa_de_los_Azulejos,_Ciudad_de_México_MEX.jpg, Stefano Vigorelli,
 *    CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Casa_de_los_Azulejos,_Ciudad_de_M%C3%A9xico_MEX.jpg
 *  - Avenida_5_de_Mayo,_Centro_Histórico,_Ciudad_de_México_-_Casa_de_los_Azulejos.jpg,
 *    Juan Carlos Fonseca Mata, CC BY-SA 4.0
 *  - El_Callejón_de_la_Condesa,_Ciudad_de_México.jpg, Juan Carlos Fonseca
 *    Mata, CC BY-SA 4.0
 *  - Casa_de_los_Azulejos,_México_D.F.,_México,_2014-10-13,_DD_46.JPG and
 *    DD_47.JPG, Diego Delso, CC BY-SA 3.0 (the patio)
 * Look-only: none. No commercial imagery.
 *
 * Left out: the tile patterns themselves, the carved ornament of the
 * pilasters and surrounds, the iron railings' openwork (drawn as low dark
 * bands), the east party wall's neighbours.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, rect, save, walls, type XY } from './chi-aon-center'

const ANCHOR: [number, number] = [19.434351, -99.140123]
const BEARING = 8.6

const W = -11.15, E = 11.15, S = -29.7, N = 29.7
const FRIEZE0 = 6.0, FRIEZE1 = 6.8, CORNICE = 12.2, PARAPET = 13.5, WAVE = 0.75

/** Wall a→b of the counter-clockwise outline: points s along it, z up, `out` outside. */
export function wall(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number, out = 0): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z]
  const ring = (s0: number, s1: number, o0: number, o1: number): XY[] =>
    [[s0, o1], [s1, o1], [s1, o0], [s0, o0]].map(([s, o]) => { const p = P(s, 0, o); return [p[0], p[1]] as XY })
  return { L, P, ring }
}

function build() {
  const tile = new Part(), stone = new Part(), win = new Part(), roof = new Part(), glass = new Part(), iron = new Part()

  // Fronts, as walls of the outline: [a, b, tiled?]
  const out: XY[] = rect(W, S, E, N)
  const south: [XY, XY] = [out[0], out[1]], east: [XY, XY] = [out[1], out[2]], north: [XY, XY] = [out[2], out[3]], west: [XY, XY] = [out[3], out[0]]

  // The body: tile on the three street fronts above a cantera plinth, the
  // east party wall in plain stone.
  for (const [[a, b], p] of [[south, tile], [north, tile], [west, tile], [east, stone]] as [[XY, XY], Part][]) {
    const { L, P } = wall(a, b)
    stone.quad(P(0, 0), P(L, 0), P(L, 0.9), P(0, 0.9))
    p.quad(P(0, 0.9), P(L, 0.9), P(L, CORNICE), P(0, CORNICE))
  }
  cap(roof, out, CORNICE)

  /** A box standing proud of wall a→b. */
  const proud = (p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, o0: number, o1: number, bevel = 0.1) =>
    block(p, p, wall(a, b).ring(s0, s1, o0, o1), z0, z1, bevel)

  // The cantera frame of each street front: frieze, cornice, pilasters,
  // window and door surrounds, balconies; then the wave parapet with a
  // pinnacle over each pilaster.
  const front = (a: XY, b: XY, pil: number[], bays: number[], o: { corner?: 'start' | 'end'; crest?: number; doors?: number[]; balcony?: [number, number] } = {}) => {
    const { L, P } = wall(a, b)
    proud(stone, a, b, 0, L, FRIEZE0, FRIEZE1, -0.01, 0.3)
    proud(stone, a, b, 0, L, CORNICE - 0.9, CORNICE, -0.01, 0.65, 0.25)
    for (const s of pil) proud(stone, a, b, Math.max(0, s - 0.45), Math.min(L, s + 0.45), 0.9, CORNICE - 0.9, -0.01, 0.25, 0)
    for (const c of bays) {
      // Ground storey: a door or window in a tall cantera surround.
      const door = o.doors?.includes(c)
      proud(stone, a, b, c - 1.45, c + 1.45, 0.9, 5.4, -0.01, 0.12, 0)
      win.quad(P(c - 0.95, door ? 0 : 1.6, 0.16), P(c + 0.95, door ? 0 : 1.6, 0.16), P(c + 0.95, 4.6, 0.16), P(c - 0.95, 4.6, 0.16))
      // Upper storey: a tall window over a balcony, with a lintel crest.
      proud(stone, a, b, c - 1.35, c + 1.35, 7.3, 11.0, -0.01, 0.12, 0)
      win.quad(P(c - 0.85, 7.4, 0.16), P(c + 0.85, 7.4, 0.16), P(c + 0.85, 10.2, 0.16), P(c - 0.85, 10.2, 0.16))
      if (!o.balcony) {
        proud(stone, a, b, c - 1.6, c + 1.6, 6.8, 7.2, 0.25, 1.0, 0) // balcony slab
        proud(iron, a, b, c - 1.55, c + 1.55, 7.2, 8.2, 0.9, 1.0, 0) // railing
      }
    }
    // One long balcony across the front, where the photos show it.
    if (o.balcony) {
      const [b0, b1] = o.balcony
      proud(stone, a, b, b0, b1, 6.8, 7.2, 0.25, 1.1, 0)
      proud(iron, a, b, b0 + 0.05, b1 - 0.05, 7.2, 8.2, 1.0, 1.1, 0)
    }
    // Parapet: a tiled wall 0.35 m thick, its top rising in a wave between
    // the pinnacles.
    const posts = [0, ...pil.filter((s) => s > 0.5 && s < L - 0.5), L]
    for (let i = 0; i < posts.length - 1; i++) {
      const s0 = posts[i], s1 = posts[i + 1], n = 6
      const top = (t: number) => PARAPET + WAVE * Math.sin(Math.PI * t)
      for (let k = 0; k < n; k++) {
        const t0 = k / n, t1 = (k + 1) / n, u0 = s0 + (s1 - s0) * t0, u1 = s0 + (s1 - s0) * t1
        tile.quad(P(u0, CORNICE, -0.05), P(u1, CORNICE, -0.05), P(u1, top(t1), -0.05), P(u0, top(t0), -0.05))
        tile.quad(P(u1, CORNICE, -0.4), P(u0, CORNICE, -0.4), P(u0, top(t0), -0.4), P(u1, top(t1), -0.4))
        stone.quad(P(u0, top(t0), -0.05), P(u1, top(t1), -0.05), P(u1, top(t1), -0.4), P(u0, top(t0), -0.4))
      }
    }
    // Pinnacles: a pedestal and an eight-sided finial over each post.
    for (const s of posts) {
      const big = (o.corner === 'start' && s === 0) || (o.corner === 'end' && s === L)
      const h = big ? 1.2 : 0.4, sc = Math.min(Math.max(s, h), L - h)
      const c = P(sc, 0, -0.2)
      const z0 = CORNICE, z1 = big ? 16.0 : PARAPET + 0.9, tip = big ? 17.7 : 15.6
      block(stone, stone, rect(c[0] - h, c[1] - h, c[0] + h, c[1] + h), z0, z1, 0.12)
      const oct = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => [c[0] + r * Math.cos((i + 0.5) * Math.PI / 4), c[1] + r * Math.sin((i + 0.5) * Math.PI / 4), z] as V3)
      const r0 = h * 0.85
      stone.loft([oct(r0, z1), oct(r0 * 0.75, z1 + (tip - z1) * 0.45), oct(0.05, tip)])
    }
    // The crest over a bay: a raised tiled gable with a cantera frame, a
    // small window and its own pinnacles.
    if (o.crest !== undefined) {
      const c = o.crest
      proud(tile, a, b, c - 1.9, c + 1.9, CORNICE, 15.6, -0.6, -0.05, 0.1)
      proud(stone, a, b, c - 2.2, c + 2.2, 15.6, 16.1, -0.7, 0.05, 0.12)
      for (const e of [-1.9, 1.9]) proud(stone, a, b, c + e - 0.3, c + e + 0.3, CORNICE, 16.1, -0.6, 0.05, 0.08)
      win.quad(P(c - 0.6, 13.6, 0.0), P(c + 0.6, 13.6, 0.0), P(c + 0.6, 15.0, 0.0), P(c - 0.6, 15.0, 0.0))
      const t = P(c, 0, -0.3)
      const oct = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => [t[0] + r * Math.cos((i + 0.5) * Math.PI / 4), t[1] + r * Math.sin((i + 0.5) * Math.PI / 4), z] as V3)
      stone.loft([oct(0.6, 16.1), oct(0.3, 16.5), oct(0.45, 16.8), oct(0.05, 17.4)])
    }
  }

  // 5 de Mayo (north) front, which runs west along y = N: s from the east
  // end. Window centres 2.5, 7, 11.9, 18 m; the crest over the second bay;
  // the big pinnacle at the callejón (west) corner.
  front(north[0], north[1], [0.5, 4.6, 9.4, 14.6, 21.6], [2.5, 7.0, 11.9, 18.0], { corner: 'end', crest: 7.0, doors: [7.0, 18.0], balcony: [0.6, 21.7] })
  // Madero (south) front, running east along y = S: the same rhythm,
  // mirrored, the big pinnacle at the callejón corner (estimate).
  front(south[0], south[1], [0.7, 7.6, 12.4, 17.2, 21.8], [4.3, 10.4, 14.8, 19.8], { corner: 'start', doors: [4.3, 14.8] })
  // The callejón (west) side, running south along x = W: twelve ~5 m bays.
  {
    const L = N - S, n = 12, pil = Array.from({ length: n + 1 }, (_, i) => 0.5 + (i * (L - 1)) / n)
    const bays = pil.slice(0, -1).map((s, i) => (s + pil[i + 1]) / 2)
    front(west[0], west[1], pil, bays, { doors: [bays[2], bays[6], bays[9]] })
  }

  // The patio's glazed lantern over the roof: low glass walls under a
  // shallow glass roof, a stone kerb round it.
  const px0 = -6.5, px1 = 6.5, py0 = -22.5, py1 = -7.5
  block(stone, null, rect(px0 - 0.4, py0 - 0.4, px1 + 0.4, py1 + 0.4), CORNICE, CORNICE + 0.5, 0.1)
  walls(glass, rect(px0, py0, px1, py1), CORNICE + 0.5, CORNICE + 1.4)
  {
    const z0 = CORNICE + 1.4, z1 = CORNICE + 2.2, cx = (px0 + px1) / 2
    // A ridged glass roof, ridge north–south.
    glass.quad([px0, py1, z0], [px0, py0, z0], [cx, py0, z1], [cx, py1, z1])
    glass.quad([px1, py0, z0], [px1, py1, z0], [cx, py1, z1], [cx, py0, z1])
    glass.tri([px0, py0, z0], [px1, py0, z0], [cx, py0, z1])
    glass.tri([px1, py1, z0], [px0, py1, z0], [cx, py1, z1])
  }

  return [
    // Talavera: blue and white averaged, pulled to the palette's lightness.
    { part: tile, material: finish('talavera', 0xb6c6e2) },
    // Grey-brown cantera, the frames and cornice (#7d7368 to #a49d93 in
    // daylight), kept darker than the tile: the contrast is the look.
    { part: stone, material: finish('cantera', 0xa1978b) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: glass, material: PALETTE.glass },
    // Wrought-iron balcony railings, dark.
    { part: iron, material: finish('iron', 0x4f555c) },
  ]
}

if (import.meta.main) await save('mexico-city-casa-de-los-azulejos', 'Casa de los Azulejos', ANCHOR, BEARING, build(), 6500)
