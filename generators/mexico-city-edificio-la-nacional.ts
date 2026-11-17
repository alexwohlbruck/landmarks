/**
 * Edificio La Nacional (Avenida Juárez at Eje Central Lázaro Cárdenas,
 * 1929–1932, Manuel Ortiz Monasterio), Mexico City — original procedural
 * geometry, CC0-1.0.
 * bun generators/mexico-city-edificio-la-nacional.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/217470226,
 * 19.434014,-99.141222. Its walls run at 8.9° / 98.9°, so the catalog
 * bearing is 8.9 and the model is square to its own frame: a 29.4 × 26.4 m
 * rectangle, its north front on Avenida Juárez (facing Bellas Artes), its
 * east front on Eje Central. La Nacional II (way/217470230, the Sears
 * building) adjoins it on the west and is not part of this model.
 *
 * Identity, in order: the pale grey Art Deco block stepping up in tiers
 * like a ziggurat (the article says it was inspired by the Templo Mayor);
 * the square crown tower on top, its shoulders stepped in twice and its
 * faces cut by deep vertical flutes under a plain cornice; the tall
 * vertical window strips between flat piers; the dark granite street
 * storey with the arched entrance.
 *
 * Evidence:
 *  - plan: OSM way/217470226 (29.4 × 26.4 m).
 *  - heights: 55 m and 13 floors, published (es Wikipedia, "Mide 55 metros
 *    y tiene 13 pisos"; OSM height=55). The tiers were measured on Thomas
 *    Ledl's level view of the north front from the Bellas Artes plaza,
 *    scaled by the published 55 m (17.4 px/m on a 1,000 px crop; the north
 *    front's 28 m width at the same scale checks against OSM's 29.4 m):
 *    east wing 28 m, the step behind it ~34.5 m, the central mass 38.5 m,
 *    the west end 31 m, the setback storey 42 m, the crown's shoulders
 *    ~46 and ~49 m, the cornice ~53 m, top 55 m. The crown is ~16 m wide
 *    at its foot. The base storey is ~5.5 m.
 *  - review round 1: the setback storey and its window band under the
 *    crown are gone (Ledl's photo shows no projecting ledge there); the
 *    crown is now narrower than the central mass it stands on (8.4 m
 *    shaft against 11.6 m), with five bold flutes on every face, stepped
 *    corner buttresses at its foot and a top stepping in twice; the north
 *    front's tiers step down symmetrically either side of the central
 *    mass: steps 4.6 m wide to 34.5 m, wings 4.3 m wide to 29.6 m (the
 *    average of the 28 and 31.3 m measured for the east and west ends;
 *    the east half, farther from the camera, measured 4.3 + 6.3 m and the
 *    west half one 6 m step, which perspective from the north-west
 *    explains). Estimate.
 *  - the east, south and west fronts: no level photo shows them square on.
 *    The tiers are modelled as slabs running the building's full depth, so
 *    the east front shows the 28 m wing with the higher tiers behind it.
 *    The crown is centred in plan (it reads right of centre in Ledl's
 *    photo, which is taken from the north-west). Estimate.
 *  - colour: the stone is a warm light grey (all daylight photos), pulled
 *    to the palette's lightness; the street storey dark grey granite.
 *  - terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s); the
 *    Centro sits on the flat lake-bed basin (~2,240 m). Modelled level.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Mexico_df_-_Edificio_La_Nacional.jpg, Thomas Ledl, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Mexico_df_-_Edificio_La_Nacional.jpg
 *  - Edificio_La_Nacional_2009.JPG, Felipe Alfonso Castillo Vázquez, CC BY 3.0
 *    https://commons.wikimedia.org/wiki/File:Edificio_La_Nacional_2009.JPG
 *  - Edificio_La_Nacional_I_y_II.JPG, Felipe Alfonso Castillo Vázquez, CC BY 3.0
 *    https://commons.wikimedia.org/wiki/File:Edificio_La_Nacional_I_y_II.JPG
 *  - Bellas_Artes,_Latino,_La_Nacional.JPG, Commons (CC BY-SA 3.0)
 *    https://commons.wikimedia.org/wiki/File:Bellas_Artes,_Latino,_La_Nacional.JPG
 *  - Mexico_df_-_Torre_Latinoamerica.jpg, Thomas Ledl, CC BY-SA 4.0 (the
 *    crown from the north-west)
 *    https://commons.wikimedia.org/wiki/File:Mexico_df_-_Torre_Latinoamerica.jpg
 *  - Ciudad_de_México_(CDMX)_-_Palacio_de_Bellas_Artes,_Torre_Latinoamericana_y_Edificio_La_Nacional.jpg,
 *    Juan Carlos Fonseca Mata, CC BY-SA 4.0 (dusk; the stone unlit)
 * Look-only: none. No commercial imagery.
 *
 * Left out: the lettering and relief over the entrance, window mullions,
 * rooftop masts and plant.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { block, panel, rect, rows, save, type XY } from './chi-aon-center'

const ANCHOR: [number, number] = [19.434014, -99.141222]
const BEARING = 8.9

const W = -14.7, E = 14.7, S = -13.2, N = 13.2
const BASE = 5.5

function build() {
  const stone = new Part(), roof = new Part(), win = new Part(), base = new Part(), trim = new Part()

  /** A tier: a bevelled stone box with a flat roof. */
  const tier = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bevel = 0.45) =>
    block(stone, roof, rect(x0, y0, x1, y1), z0, z1, bevel)

  // The stepped mass, symmetric about the centre of the Juárez front
  // (review round 1): wings, steps, the central mass. Widths from Ledl's
  // north-front view, evened out on both sides (the east half, farther
  // from the camera, measured 4.3 + 6.3 m and the west half's single step
  // 6 m, which perspective from the north-west explains); heights 28 and
  // 31.3 m measured for the two wings are averaged to 29.6 m.
  const XS = 10.4, XM = 5.8 // the steps' and the central mass's half-widths
  const WING = 29.6, STEP = 34.5, MID = 38.5
  block(base, null, rect(W, S, E, N), 0, BASE, 0)
  tier(XS, E, S, N, BASE, WING)
  tier(W, -XS, S, N, BASE, WING)
  tier(XM, XS, S, N, BASE, STEP)
  tier(-XS, -XM, S, N, BASE, STEP)
  tier(-XM, XM, S, N, BASE, MID)

  // The crown (review round 1): narrower than the central mass it stands
  // on, an 8.4 m square shaft cut by five bold flutes on every face, with
  // stepped buttresses at its four corners at the foot, and a top that
  // steps in twice to the flat crown. No projecting ledge at its foot.
  const H = 4.2, Z0 = MID, ZF = 51.2
  tier(-H, H, -H, H, Z0, ZF, 0.3)
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
    // Corner buttresses: two steps, each 0.8 m out from the shaft's corner.
    const box = (o: number, z1: number) => {
      const xa = sx * (H - 1.6), xb = sx * (H + o), ya = sy * (H - 1.6), yb = sy * (H + o)
      tier(Math.min(xa, xb), Math.max(xa, xb), Math.min(ya, yb), Math.max(ya, yb), Z0, z1, 0.25)
    }
    box(1.6, 42.4)
    box(0.8, 46.8)
  }
  // The top: a cornice band flush with the shaft, then two steps in.
  block(trim, roof, rect(-H, -H, H, H), ZF, ZF + 0.9, 0.2)
  tier(-H + 0.7, H - 0.7, -H + 0.7, H - 0.7, ZF + 0.9, 53.6, 0.3)
  tier(-H + 1.4, H - 1.4, -H + 1.4, H - 1.4, 53.6, 55.0, 0.45)
  // The flutes: five ribs standing 0.7 m proud on each face, between the
  // buttresses, from the buttresses' second step to under the cornice.
  const crownRing: XY[] = rect(-H, -H, H, H)
  for (let i = 0; i < 4; i++) {
    const a = crownRing[i], b = crownRing[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
    for (let k = 0; k < 5; k++) {
      const c = L / 2 + (k - 2) * 1.05
      const p0: XY = [a[0] + ux * (c - 0.38), a[1] + uy * (c - 0.38)], p1: XY = [a[0] + ux * (c + 0.38), a[1] + uy * (c + 0.38)]
      const q0: XY = [p0[0] + nx * 0.7, p0[1] + ny * 0.7], q1: XY = [p1[0] + nx * 0.7, p1[1] + ny * 0.7]
      block(stone, stone, [q0, q1, p1, p0], 41.0, ZF - 0.2, 0.15)
    }
  }

  // Windows: vertical strips per bay, grouped two floors to a panel, the
  // stone piers and spandrels between. Floors ~3.45 m over the base storey.
  const F = 3.45
  const groups = (z1: number, from = BASE + 0.6): [number, number][] => {
    const out: [number, number][] = []
    for (let z = from; z + 2 * F - 1.3 <= z1 - 1.0; z += 2 * F) out.push([z, z + 2 * F - 1.3])
    return out
  }
  /** Strips on wall a→b at model-frame positions along it (x or y), each w wide. */
  const stripAt = (a: XY, b: XY, at: number[], w: number, gs: [number, number][]) => {
    const along = a[1] === b[1] ? 0 : 1, dir = Math.sign(b[along] - a[along])
    for (const p of at) {
      const c = (p - a[along]) * dir
      for (const [z0, z1] of gs) panel(win, a, b, c - w / 2, c + w / 2, z0, z1, 0.05)
    }
  }
  // North front (Juárez) and south front, mirrored about x = 0.
  for (const [a, b] of [[[E, N], [W, N]], [[W, S], [E, S]]] as [XY, XY][]) {
    const south = a[1] === S, from = south ? 21.0 : BASE + 0.6
    stripAt(a, b, [12.55, -12.55], 1.4, groups(WING, from))
    stripAt(a, b, [6.9, 9.3, -6.9, -9.3], 1.3, groups(STEP, from))
    stripAt(a, b, [3.6, -3.6], 1.4, groups(MID, from))
    stripAt(a, b, [0], 2.4, groups(MID, south ? from : BASE + 0.6 + 2 * F)) // over the entrance
  }
  // The two deep piers framing the central bay over the entrance, the full
  // height of the central mass (Ledl, Castillo Vázquez).
  for (const x of [-1.7, 1.7]) block(stone, roof, rect(x - 0.45, N - 0.1, x + 0.45, N + 0.55), BASE, MID + 0.6, 0.2)
  // East front (Eje Central), and the higher tiers' east and west faces
  // above the wings; the west wing is against La Nacional II (~33 m).
  stripAt([E, S], [E, N], [-10.4, -5.2, 0, 5.2, 10.4], 1.5, groups(WING))
  for (const [x, z, from] of [[XS, STEP, 30.6], [XM, MID, 35.5], [-XM, MID, 35.5]] as [number, number, number][]) {
    const [a, b]: [XY, XY] = x > 0 ? [[x, S], [x, N]] : [[x, N], [x, S]]
    stripAt(a, b, [-7.8, -2.6, 2.6, 7.8], 1.5, [[from, z - 1.2]])
  }

  // Street storey: shop windows and the arched entrance bay on Juárez.
  const nA: XY = [E, N], nB: XY = [W, N], eA: XY = [E, S], eB: XY = [E, N]
  for (const [a, b] of [[nA, nB], [eA, eB]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (let s = 1.2; s + 3.0 < L - 0.8; s += 4.2) {
      if (a === nA && s + 3.0 > E - 2.8 && s < E + 2.8) continue
      panel(win, a, b, s, s + 3.0, 0.4, BASE - 1.0, 0.05)
    }
  }
  // The entrance: a tall stone surround with the dark doorway.
  block(trim, trim, rect(-2.6, N - 0.2, 2.6, N + 0.6), 0, BASE + 3.2, 0.2)
  panel(win, [2.6, N + 0.6], [-2.6, N + 0.6], 1.0, 4.2, 0, 4.6, 0.05)

  return [
    { part: stone, material: finish('nacional-stone', 0xdcd3c5) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: base, material: finish('nacional-granite', 0x7d7a76) },
  ]
}

if (import.meta.main) await save('mexico-city-edificio-la-nacional', 'Edificio La Nacional', ANCHOR, BEARING, build(), 6500)
