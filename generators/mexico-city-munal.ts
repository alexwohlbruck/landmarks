/**
 * Museo Nacional de Arte (MUNAL; the former Palacio de Comunicaciones y
 * Obras Públicas, Tacuba 8, 1904–1911, Silvio Contri), Mexico City —
 * original procedural geometry, CC0-1.0.
 * bun generators/mexico-city-munal.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline (outer way 143292663 of
 * relation/14592229), 19.436463, -99.139401. Its walls run at 8.9° / 98.9°,
 * so the catalog bearing is 8.9 and the model is square to its own frame:
 * about 81 × 55 m, the main front on Tacuba (south, −y) facing Plaza Tolsá,
 * El Caballito and the Palacio de Minería; a 26 m centre bay projects 4.6 m
 * on the east (Calle Xicoténcatl) side.
 *
 * Identity, in order: a dark grey Italian Renaissance palazzo block, three
 * rows of openings (a rusticated ground storey of round-arched windows, a
 * mezzanine of square windows, a tall piano nobile of round-arched windows
 * between engaged columns), a deep entablature carrying "SECRETARIA DE
 * COMUNICACIONES Y OBRAS PUBLICAS", a cornice, and a balustrade between
 * solid attics; the end pavilions of the south front with paired columns,
 * and its three-bay centre with paired columns, the arched main door and a
 * crested attic of four pinnacles; urns on the attics' corners.
 *
 * The brief called the main front curved: it isn't. The curve in the OSM
 * plan is the semicircular stair hall projecting into the courtyard (Juan
 * Carlos Fonseca Mata's interior views), modelled here as a half-round
 * block under a glass roof.
 *
 * Evidence:
 *  - plan: OSM relation/14592229 (outer way 143292663, the courtyard inner
 *    way 1095452902 with its half-round notch), squared up in the 8.9°
 *    frame.
 *  - heights: none published. Photo-scaled on Covadongino's front view
 *    (Fachada MUNAL.jpg) by the people at the main door (~12 px/m at the
 *    facade): ground storey ~7.9 m, mezzanine windows ~9.6–12 m, piano
 *    nobile windows ~14.6–20.4 m, entablature ~22–24.5 m, balustrade to
 *    ~26 m, the crested centre attic ~29.7 m with its cartouche to ~32.4 m
 *    and six pinnacles to ~33.7 m (drawn bold, a little over the photos). All
 *    estimates (±2 m).
 *  - bays (south front): an end pavilion of one bay between paired columns,
 *    four bays of the link, the three-bay centre, four bays, a pavilion
 *    (Covadongino; José Luiz's two Main facade views; JonathanVitela's
 *    frontal view of the centre). The west front is the same order (José
 *    Luiz); the north and east are not photographed and carry the link's
 *    bays.
 *  - colour: a dark slate-grey stone (#7b7d7b in daylight) pulled to the
 *    mid-dark #8c8f91 (it is the dark one beside Minería), the columns,
 *    cornices and balustrades a lighter #b3b5b5. Floodlit at night from the plaza (Fonseca Mata, Nocturna).
 *  - terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s); the
 *    Centro sits on the flat lake-bed basin (~2,240 m). Modelled level.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Fachada MUNAL.jpg, Covadongino, CC0
 *    https://commons.wikimedia.org/wiki/File:Fachada_MUNAL.jpg
 *  - Main facade - Museo Nacional de Arte - Mexico 2024.jpg (and (2)), José Luiz, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Main_facade_-_Museo_Nacional_de_Arte_-_Mexico_2024.jpg
 *    https://commons.wikimedia.org/wiki/File:Main_facade_-_Museo_Nacional_de_Arte_-_Mexico_2024_(2).jpg
 *  - Museo Nacional de Arte (MUNAL) - Ciudad de México.jpg, Juan Carlos Fonseca Mata, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Museo_Nacional_de_Arte_(MUNAL)_-_Ciudad_de_M%C3%A9xico.jpg
 *  - Museo Nacional de Arte (MUNAL) - Ciudad de México - 2.jpg and - 3.jpg (courtyard, stair hall), Juan Carlos Fonseca Mata, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Museo_Nacional_de_Arte_(MUNAL)_-_Ciudad_de_M%C3%A9xico_-_3.jpg
 *  - Museo Nacional de Arte (MUNAL) - Ciudad de México - Nocturna.jpg, Juan Carlos Fonseca Mata, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Museo_Nacional_de_Arte_(MUNAL)_-_Ciudad_de_M%C3%A9xico_-_Nocturna.jpg
 *  - Museo Nacional de Arte and El Caballito, Plaza Manuel Tolsá, Mexico City.jpg, JonathanVitela, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Museo_Nacional_de_Arte_and_El_Caballito,_Plaza_Manuel_Tols%C3%A1,_Mexico_City.jpg
 *  - El Caballito and Museo Nacional de Arte, Mexico City, 2017.jpg, Secretaría de Cultura de la Ciudad de México, CC BY-SA 2.0
 *    https://commons.wikimedia.org/wiki/File:El_Caballito_and_Museo_Nacional_de_Arte,_Mexico_City,_2017.jpg
 *  - Museo Nacional De Arte- front.jpg, Thayne Tuason, CC BY 4.0
 *    https://commons.wikimedia.org/wiki/File:Museo_Nacional_De_Arte-_front.jpg
 * Look-only: none. No commercial imagery.
 *
 * Left out: the rustication's joints, the carved window surrounds and
 * keystones, the frieze lettering, the lamp brackets and banners, the
 * cartouches' carving (drawn as plain blocks).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { onWall, rect, save, type XY } from './chi-aon-center'
import { face, lathe, smooth } from './nyc-columbus-monument'

const ANCHOR: [number, number] = [19.436463, -99.139401]
const BEARING = 8.9

// Plan (squared up from OSM in the 8.9° frame).
const W = -41.7, S = -27.8, N = 27.65, E1 = 39.2, E2 = 40.3, EP = 43.8, EP0 = -13.0, EP1 = 13.1
const CY0 = -5.8, CY1 = 18.8, CXW = -21.65, CXE = 21.3 // courtyard
const CX = (W + E1) / 2 // the south front's centre line
const AR = 8.3, AY = -5.9 // the stair hall's half-round, centre (CX, AY)

// Heights (estimates, see header).
const G1 = 7.9, M0 = 9.6, M1 = 12.0, PN0 = 13.6, ENT0 = 22.0, CORN = 24.5, BAL = 26.0, ATT = 26.6

function proud(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, o0: number, o1: number) {
  const { P } = onWall(a, b)
  p.quad(P(s0, z0, o1), P(s1, z0, o1), P(s1, z1, o1), P(s0, z1, o1))
  p.quad(P(s1, z0, o1), P(s1, z0, o0), P(s1, z1, o0), P(s1, z1, o1))
  p.quad(P(s0, z0, o0), P(s0, z0, o1), P(s0, z1, o1), P(s0, z1, o0))
  p.quad(P(s0, z1, o1), P(s1, z1, o1), P(s1, z1, o0), P(s0, z1, o0))
}
/** A moulded band with its top front edge chamfered by c. */
function band(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out: number, c = 0.25) {
  const { P } = onWall(a, b), zc = z1 - c, oc = out - c
  p.quad(P(s0, z0, out), P(s1, z0, out), P(s1, zc, out), P(s0, zc, out))
  p.quad(P(s0, zc, out), P(s1, zc, out), P(s1, z1, oc), P(s0, z1, oc))
  p.quad(P(s0, z1, oc), P(s1, z1, oc), P(s1, z1, -0.01), P(s0, z1, -0.01))
  p.quad(P(s0, z0, -0.01), P(s1, z0, -0.01), P(s1, z0, out), P(s0, z0, out))
  for (const [s, k] of [[s0, -1], [s1, 1]] as [number, number][]) {
    const q = [P(s, z0, -0.01), P(s, z0, out), P(s, zc, out), P(s, z1, oc), P(s, z1, -0.01)]
    if (k < 0) for (let i = 1; i < 4; i++) p.tri(q[0], q[i], q[i + 1])
    else for (let i = 1; i < 4; i++) p.tri(q[0], q[i + 1], q[i])
  }
}
/** A flat opening on wall a→b, optionally round-headed (z1 is the springing). */
function opening(p: Part, a: XY, b: XY, s: number, w: number, z0: number, z1: number, round = false, out = 0.05) {
  const { P } = onWall(a, b), r = w / 2
  p.quad(P(s - r, z0, out), P(s + r, z0, out), P(s + r, z1, out), P(s - r, z1, out))
  if (!round) return
  const c = P(s, z1, out), n = 6
  for (let k = 0; k < n; k++) {
    const t0 = (k / n) * Math.PI, t1 = ((k + 1) / n) * Math.PI
    p.tri(c, P(s + r * Math.cos(t0), z1 + r * Math.sin(t0), out), P(s + r * Math.cos(t1), z1 + r * Math.sin(t1), out))
  }
}
function balustrade(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, o0: number, o1: number, step = 4.5) {
  const h = z1 - z0
  proud(p, a, b, s0, s1, z0, z0 + 0.25 * h, o0, o1)
  proud(p, a, b, s0, s1, z0 + 0.25 * h, z1 - 0.22 * h, o0 + 0.18, o1 - 0.18)
  proud(p, a, b, s0, s1, z1 - 0.22 * h, z1, o0 - 0.03, o1 + 0.03)
  const n = Math.max(1, Math.round((s1 - s0) / step))
  for (let k = 1; k < n; k++) {
    const s = s0 + ((s1 - s0) * k) / n
    proud(p, a, b, s - 0.3, s + 0.3, z0 + 0.25 * h, z1 - 0.22 * h, o0, o1)
  }
}
/** An engaged column standing just proud of wall a→b at s. */
function column(p: Part, a: XY, b: XY, s: number, out: number, z0: number, z1: number, r: number) {
  const [x, y] = onWall(a, b).P(s, 0, out + r * 0.9)
  smooth(p, q => lathe(q, [[r * 1.3, z0], [r * 1.05, z0 + 0.5], [r * 0.9, z1 - 0.6], [r * 1.35, z1 - 0.2], [r * 1.35, z1]], 6, x, y, true), 50)
}
/** An urn or a pinnacle on an attic. */
function urn(p: Part, x: number, y: number, z: number, h = 1.6, r = 0.5) {
  smooth(p, q => lathe(q, [[r * 0.9, z], [r * 0.9, z + 0.25 * h], [r * 0.45, z + 0.35 * h], [r, z + 0.6 * h], [r * 0.35, z + 0.85 * h], [0, z + h]], 6, x, y), 50)
}

export function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), glass = new Part()

  // ---- Body: the outline's walls and the courtyard's, roofed in ranges. ----
  const O: XY[] = [[W, S], [E1, S], [E1, EP0], [EP, EP0], [EP, EP1], [E2, EP1], [E2, N], [W, N]]
  for (let i = 0; i < O.length; i++) {
    const a = O[i], b = O[(i + 1) % O.length], { P, L } = onWall(a, b)
    stone.quad(P(0, 0), P(L, 0), P(L, CORN), P(0, CORN))
  }
  const rf = (x0: number, y0: number, x1: number, y1: number, z = CORN) => roof.quad([x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z])
  rf(W, S, E1, CY0); rf(W, CY1, E2, N); rf(W, CY0, CXW, CY1); rf(CXE, CY0, E1, EP1); rf(CXE, EP1, E2, CY1); rf(E1, EP0, EP, EP1)
  // Courtyard walls (facing in), with the half-round stair hall on the south.
  const court: XY[] = [[CXW, CY0], [CXW, CY1], [CXE, CY1], [CXE, CY0]] // clockwise: faces into the court
  for (let i = 0; i < 4; i++) {
    const a = court[i], b = court[(i + 1) % 4], { P, L } = onWall(a, b)
    const south = i === 3
    if (south) {
      // Wall pieces either side of the half-round.
      const s0 = (CXE - (CX + AR)), s1 = (CXE - (CX - AR))
      stone.quad(P(0, 0), P(s0, 0), P(s0, CORN), P(0, CORN))
      stone.quad(P(s1, 0), P(L, 0), P(L, CORN), P(s1, CORN))
      stone.quad(P(s0, 22), P(s1, 22), P(s1, CORN), P(s0, CORN))
    } else stone.quad(P(0, 0), P(L, 0), P(L, CORN), P(0, CORN))
    // Three storeys of arcaded galleries, drawn as arched openings.
    const n = Math.max(1, Math.round(L / 5.2))
    for (let k = 0; k < n; k++) {
      const s = ((k + 0.5) * L) / n
      if (south && Math.abs(s - (CXE - CX)) < AR + 1.2) continue
      opening(win, a, b, s, 2.8, 0.5, 5.6, true)
      opening(win, a, b, s, 2.6, 9.0, 13.6, true)
      opening(win, a, b, s, 2.4, 16.2, 19.6, true)
    }
  }
  {
    // The stair hall: a half-round drum into the court under a glass roof.
    const n = 10, zt = 22
    for (let k = 0; k < n; k++) {
      const t0 = (k / n) * Math.PI, t1 = ((k + 1) / n) * Math.PI
      const p = (t: number, z: number, r = AR): V3 => [CX + r * Math.cos(t), AY + r * Math.sin(t), z]
      face(stone, p(t0, 0), p(t1, 0), p(t1, zt), p(t0, zt), [CX, AY, zt / 2])
      // Tall glazed panels between piers.
      const tm0 = t0 + 0.05, tm1 = t1 - 0.05
      face(win, p(tm0, 3, AR + 0.05), p(tm1, 3, AR + 0.05), p(tm1, 19, AR + 0.05), p(tm0, 19, AR + 0.05), [CX, AY, 10])
      glass.tri(p(t0, zt), p(t1, zt), [CX, AY, zt + 2.6])
    }
  }

  // ---- The fronts. ----
  type Bay = { s: number; kind: 'pav' | 'link' | 'centre' | 'door' }
  const fronts: { a: XY; b: XY; bays: Bay[]; cols: boolean; pav: [number, number][]; centre?: [number, number] }[] = []
  // South (main): a→b from west to east has `out` = −y. L = 80.9.
  {
    const a: XY = [W, S], b: XY = [E1, S], L = E1 - W, c = CX - W
    const bays: Bay[] = [{ s: 4.5, kind: 'pav' }, { s: L - 4.5, kind: 'pav' }]
    for (let k = 0; k < 4; k++) { bays.push({ s: 9 + (k + 0.5) * (c - 8.5 - 9) / 4, kind: 'link' }); bays.push({ s: L - 9 - (k + 0.5) * (c - 8.5 - 9) / 4, kind: 'link' }) }
    bays.push({ s: c - 5.4, kind: 'centre' }, { s: c, kind: 'door' }, { s: c + 5.4, kind: 'centre' })
    fronts.push({ a, b, bays, cols: true, pav: [[0, 9], [L - 9, L]], centre: [c - 8.5, c + 8.5] })
  }
  // West (Filomeno Mata side): pavilions at both ends, five bays between.
  {
    const a: XY = [W, N], b: XY = [W, S], L = N - S
    const bays: Bay[] = [{ s: 4.5, kind: 'pav' }, { s: L - 4.5, kind: 'pav' }]
    for (let k = 0; k < 6; k++) bays.push({ s: 9 + (k + 0.5) * (L - 18) / 6, kind: 'link' })
    fronts.push({ a, b, bays, cols: false, pav: [[0, 9], [L - 9, L]] })
  }
  // North and east: the link's bays (not photographed).
  const plain = (a: XY, b: XY) => {
    const { L } = onWall(a, b), n = Math.max(1, Math.round((L - 2) / 5.6)), bays: Bay[] = []
    for (let k = 0; k < n; k++) bays.push({ s: 1 + (k + 0.5) * (L - 2) / n, kind: 'link' })
    fronts.push({ a, b, bays, cols: false, pav: [] })
  }
  plain([E2, N], [W, N])
  plain([E1, S], [E1, EP0]); plain([EP, EP0], [EP, EP1]); plain([E2, EP1], [E2, N])

  for (const f of fronts) {
    const { a, b, bays, cols, pav } = f
    const { L } = onWall(a, b)
    // Plinth, the ground storey's top band, the mezzanine sill, the
    // entablature (a broad frieze and the cornice), and the balustrade.
    proud(stone, a, b, 0, L, 0, 0.9, -0.01, 0.3)
    band(trim, a, b, 0, L, G1, G1 + 0.6, 0.35, 0.15)
    band(trim, a, b, 0, L, PN0 - 0.6, PN0, 0.4, 0.15)
    proud(trim, a, b, 0, L, ENT0, ENT0 + 0.5, -0.01, 0.55)
    band(trim, a, b, -1.0, L + 1.0, CORN - 1.0, CORN, 1.0, 0.5)
    // Attics: solid over the pavilions and the centre, a balustrade between.
    const solidAt: [number, number][] = [...pav, ...(f.centre ? [f.centre] : [])].sort((x, y) => x[0] - y[0])
    let s = 0
    for (const [s0, s1] of [...solidAt, [L, L] as [number, number]]) {
      if (s0 - s > 1) balustrade(trim, a, b, s, s0, CORN, BAL, -0.3, 0.3)
      if (s1 > s0) {
        proud(stone, a, b, s0, s1, CORN, ATT, -0.3, 0.3)
        band(trim, a, b, s0, s1, ATT - 0.3, ATT, 0.45, 0.15)
      }
      s = s1
    }
    // Pavilions and the centre stand a little proud, their corners marked.
    for (const [s0, s1] of pav) {
      proud(stone, a, b, s0, s1, 0.9, CORN - 1.0, -0.01, 0.4)
      const { P } = onWall(a, b)
      const top = (ss: number) => P(ss, 0, 0)
      for (const ss of [s0 + 0.9, s1 - 0.9]) { const [x, y] = top(ss); urn(trim, x, y, ATT, 2.4, 0.6) }
    }
    if (f.centre) {
      const [s0, s1] = f.centre
      proud(stone, a, b, s0, s1, 0.9, CORN - 1.0, -0.01, 0.7)
      // The crested attic: a raised middle block, a pinnacle on each column pair.
      proud(stone, a, b, s0 + 1.0, s1 - 1.0, ATT, 29.4, -0.8, 0.6)
      band(trim, a, b, s0 + 1.0, s1 - 1.0, 29.0, 29.7, 0.8, 0.25)
      const { P } = onWall(a, b), m = (s0 + s1) / 2
      // The cartouche: a tall block with a stepped top, a finial on it.
      proud(trim, a, b, m - 2.0, m + 2.0, 29.7, 31.6, -0.4, 0.55)
      proud(trim, a, b, m - 1.2, m + 1.2, 31.6, 32.4, -0.2, 0.45)
      { const [x, y] = P(m, 0, 0.1); urn(trim, x, y, 32.4, 2.0, 0.5) }
      // Six bold pinnacles: on each column pair and at the attic's ends.
      for (const ss of [m - 7.9, m - 5.3, m - 2.7, m + 2.7, m + 5.3, m + 7.9]) {
        const [x, y] = P(ss, 0, 0.35), inner = Math.abs(ss - m) < 7
        urn(trim, x, y, inner ? 29.7 : ATT, inner ? 4.0 : 3.6, 0.75)
      }
    }
    // Bays.
    for (const { s, kind } of bays) {
      const out = kind === 'pav' ? 0.45 : kind === 'link' ? 0.05 : 0.75
      if (kind === 'door') {
        opening(win, a, b, s, 3.4, 0.9, 5.4, true, out)
      } else {
        opening(win, a, b, s, 2.6, 1.5, 4.8, true, out)
      }
      opening(win, a, b, s, 2.2, M0 - 0.3, M1 + 0.2, false, out)
      opening(win, a, b, s, 2.8, 14.5, 19.4, true, out)
      proud(trim, a, b, s - 1.6, s + 1.6, PN0, PN0 + 0.9, out - 0.01, out + 0.45) // balcony
      // Pilasters between the link bays on the west front.
      if (!cols && f.pav.length && kind === 'link') for (const sg of [-1, 1]) proud(trim, a, b, s + sg * 2.6 - 0.35, s + sg * 2.6 + 0.35, PN0 + 0.9, ENT0, -0.01, 0.35)
    }
    if (cols) {
      // The main front's engaged columns: paired either side of each
      // pavilion's window and between the centre's bays, single between
      // the link bays.
      const at: [number, number][] = [] // [s, out]
      for (const [s0, s1] of pav) { const m = (s0 + s1) / 2; for (const d of [-2.95, -1.95, 1.95, 2.95]) at.push([m + d, 0.45]) }
      if (f.centre) { const m = (f.centre[0] + f.centre[1]) / 2; for (const d of [-7.9, -2.7, 2.7, 7.9]) for (const e of [-0.5, 0.5]) at.push([m + d + e, 0.75]) }
      const links = bays.filter(x => x.kind === 'link').map(x => x.s).sort((x, y) => x - y)
      for (let k = 0; k < links.length - 1; k++) if (links[k + 1] - links[k] < 7) at.push([(links[k] + links[k + 1]) / 2, 0.05])
      for (const [cs, o] of at) column(trim, a, b, cs, o, PN0 + 0.9, ENT0, 0.5)
    }
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : n[1] < -0.5 ? 0.85 : 0.4)
  return [
    // Dark slate-grey stone (#7b7d7b in daylight), kept mid-dark so it reads
    // clearly darker than Minería across the plaza; columns and cornices lighter.
    { part: stone, material: { ...finish('munal-stone', 0x8c8f91), floodlight: lit } },
    { part: trim, material: { ...finish('munal-trim', 0xb3b5b5), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: glass, material: PALETTE.glass },
  ]
}

if (import.meta.main) await save('mexico-city-munal', 'Museo Nacional de Arte', ANCHOR, BEARING, build(), 6500)
