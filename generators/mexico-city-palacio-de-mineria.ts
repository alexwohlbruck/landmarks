/**
 * Palacio de Minería (Real Seminario de Minería; Calle Tacuba 5, 1797–1813,
 * Manuel Tolsá), Mexico City — original procedural geometry, CC0-1.0.
 * bun generators/mexico-city-palacio-de-mineria.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline (outer way 217322988 of
 * relation/14592228), 19.435459, -99.139579. Its walls run at 9.5° / 99.5°,
 * so the catalog bearing is 9.5 and the model is square to its own frame:
 * about 87 × 82 m (88 m deep at the south-east), the main front on Tacuba
 * (north, +y), facing Plaza Tolsá and El Caballito.
 *
 * Identity, in order: the long grey chiluca front of three window rows under
 * a deep cornice and a balustrade the whole length; the central portico of
 * paired columns in two orders, three deep round-arched entrances below and
 * a balcony above, under a broad triangular pediment; the square attic block
 * rising behind the pediment with its own balustrade and urns, and the small
 * domed observatory lantern on top; the side doors with balconies half-way
 * along each wing; the five courtyards (the big main patio behind the
 * portico).
 *
 * Evidence:
 *  - plan: OSM relation/14592228 (outer way 217322988 and the five patios,
 *    inner ways 1095452897–1095452901), squared up in the 9.5° frame. The
 *    main patio is tagged building:part=roof (9.07 m); no photo here shows
 *    a roof over it, so it is left open and listed in `replaces` so the map
 *    doesn't draw one inside the model.
 *  - heights: none published (es/en Wikipedia, palaciomineria.unam.mx give
 *    none). Photo-scaled, all estimates: on José Luiz's Main facade and
 *    Rafael Sánchez Guiris's view, taking the balustrade top as ~22 m (the
 *    three window rows and the portico's two orders in proportion; the red
 *    double-decker bus in front as a check): window rows 1.2–4.0, 6.6–9.8
 *    and 12.8–16.4 m, the lower order's entablature 11–11.8 m, cornice
 *    19.3–20.6 m, balustrade to 21.9 m, the pediment's apex ~26.8 m, the
 *    attic block's cornice ~31.8 m and its balustrade ~33 m (it stands
 *    ~1.6 × the cornice height in both views), the lantern to ~36 m.
 *  - bays: seven to each wing between the portico and the corner, the door
 *    in the fourth (Main facade, the Rafael Sánchez Guiris view); the
 *    portico about 20 m wide, four pairs of columns over three arches
 *    (ProtoplasmaKid's dusk view). The side fronts (José Luiz, East side)
 *    carry the same three rows at ~4.8 m.
 *  - colour: weathered chiluca, a mid warm grey in daylight (#8f8a80),
 *    pulled to a warm grey-brown #b0a797; the cornices, columns and
 *    balustrades a step lighter (#c6bdae); the doors and the main front's
 *    window frames are painted oxblood red (on the entrance material). The
 *    front is floodlit at night (ProtoplasmaKid's dusk view, Mauricio Campos
 *    Gallardo's night view), so the stone carries `floodlight`.
 *  - terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s); the
 *    Centro sits on the flat lake-bed basin (~2,240 m). Modelled level
 *    (the building has settled unevenly, as most of the Centro has).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Main facade - Palacio de Mineria - Mexico 2024.jpg, José Luiz, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Main_facade_-_Palacio_de_Mineria_-_Mexico_2024.jpg
 *  - Escultura Carlos IV + Palacio de Minería.jpg, ProtoplasmaKid, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Escultura_Carlos_IV_%2B_Palacio_de_Miner%C3%ADa.jpg
 *  - Palacio de Mineria.JPG, Rafael Sánchez Guiris, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Palacio_de_Mineria.JPG
 *  - East side (Calle Filomeno) - Palacio de Minería - Mexico 2024.jpg, José Luiz, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:East_side_(Calle_Filomeno)_-_Palacio_de_Miner%C3%ADa_-_Mexico_2024.jpg
 *  - Plaza Manuel Tolsá - Mexico 2024.jpg, José Luiz, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Plaza_Manuel_Tols%C3%A1_-_Mexico_2024.jpg
 *  - Palacio de Minería - Mexico 2024.jpg, José Luiz, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Palacio_de_Miner%C3%ADa_-_Mexico_2024.jpg
 * Look-only: none. No commercial imagery.
 *
 * Doubts: the south and east fronts and the courtyards are not photographed
 * here; they carry the side front's three rows. The attic block's depth is
 * held to the front range (it can't reach into the main patio), and the
 * lantern's form (a small square drum under a domical cap) is read from two
 * distant views.
 *
 * Left out: the window hoods' carving, the balconies' ironwork (drawn as
 * slabs), the frieze inscription, the flagpole and the lamp standards.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { bays, onWall, rect, save, type XY } from './chi-aon-center'
import { face, lathe, smooth } from './nyc-columbus-monument'

const ANCHOR: [number, number] = [19.435459, -99.139579]
const BEARING = 9.5

// The plan, squared up from OSM in the 9.5° frame.
const W0 = -44.2, E0 = 43.0, S0 = -39.2, N0 = 42.5, SE = -45.1, SEx = -5.2
const PATIOS: [number, number, number, number][] = [
  [-18.5, -0.4, 14.1, 32.0], // main patio, behind the portico
  [-32.7, -31.5, -14.3, -16.8],
  [11.8, -38.6, 26.7, -17.1],
  [24.0, 3.5, 35.1, 28.7],
  [-38.5, 3.2, -27.3, 28.4],
]
const CX = -0.6 // the front's centre line

// Heights (estimates, see header).
const CORN0 = 19.3, CORN1 = 20.6, BAL1 = 21.9

/** A box standing proud of wall a→b (s along, z up, o out), all faces but the back. */
function proud(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, o0: number, o1: number) {
  const { P } = onWall(a, b)
  p.quad(P(s0, z0, o1), P(s1, z0, o1), P(s1, z1, o1), P(s0, z1, o1))
  p.quad(P(s1, z0, o1), P(s1, z0, o0), P(s1, z1, o0), P(s1, z1, o1))
  p.quad(P(s0, z0, o0), P(s0, z0, o1), P(s0, z1, o1), P(s0, z1, o0))
  p.quad(P(s0, z1, o1), P(s1, z1, o1), P(s1, z1, o0), P(s0, z1, o0))
  // No underside: it is only seen from the pavement.
}
/** A moulded band: a box whose top front edge is chamfered by `c`. */
function band(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out: number, c = 0.25) {
  const { P } = onWall(a, b)
  const zc = z1 - c, oc = out - c
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
/** A flat window (or door) panel on wall a→b, optionally with a round head. */
function opening(p: Part, a: XY, b: XY, s: number, w: number, z0: number, z1: number, round = false, out = 0.05) {
  const { P } = onWall(a, b), r = w / 2
  p.quad(P(s - r, z0, out), P(s + r, z0, out), P(s + r, z1, out), P(s - r, z1, out))
  if (!round) return
  const c = P(s, z1, out), n = 8
  for (let k = 0; k < n; k++) {
    const t0 = (k / n) * Math.PI, t1 = ((k + 1) / n) * Math.PI
    p.tri(c, P(s + r * Math.cos(t0), z1 + r * Math.sin(t0), out), P(s + r * Math.cos(t1), z1 + r * Math.sin(t1), out))
  }
}
/**
 * A balustrade along wall a→b standing on top of it (o is measured from the
 * wall face, so 0 is flush): plinth, a recessed baluster band, the rail, and
 * a pedestal every `step` metres.
 */
function balustrade(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, o0: number, o1: number, step = 4.8) {
  const h = z1 - z0
  proud(p, a, b, s0, s1, z0, z0 + 0.25 * h, o0, o1)
  proud(p, a, b, s0, s1, z0 + 0.25 * h, z1 - 0.22 * h, o0 + 0.18, o1 - 0.18)
  proud(p, a, b, s0, s1, z1 - 0.22 * h, z1, o0 - 0.03, o1 + 0.03)
  const n = Math.max(1, Math.round((s1 - s0) / step))
  for (let k = 0; k <= n; k++) {
    const s = s0 + ((s1 - s0) * k) / n, w = 0.32
    proud(p, a, b, Math.max(s0, s - w), Math.min(s1, s + w), z0 + 0.25 * h, z1 - 0.22 * h, o0, o1)
  }
}
/** A column: base, slightly tapered shaft and a capital, about (x, y). */
function column(p: Part, x: number, y: number, z0: number, z1: number, r: number, sides = 8) {
  smooth(p, q => lathe(q, [
    [r * 1.3, z0], [r * 1.3, z0 + 0.35], [r, z0 + 0.55], [r * 0.88, z1 - 0.5], [r * 1.35, z1 - 0.2], [r * 1.35, z1],
  ], sides, x, y, true), 50)
}
/** A flat half-disc on wall a→b: centre s at height z, radius r. */
function semi(p: Part, a: XY, b: XY, s: number, z: number, r: number, out = 0.05, n = 8) {
  const { P } = onWall(a, b), c = P(s, z, out)
  for (let k = 0; k < n; k++) {
    const t0 = (k / n) * Math.PI, t1 = ((k + 1) / n) * Math.PI
    p.tri(c, P(s + r * Math.cos(t0), z + r * Math.sin(t0), out), P(s + r * Math.cos(t1), z + r * Math.sin(t1), out))
  }
}
/** A box from its 8 corners (bottom four, then top four), every face wound outward. */
function hexa(p: Part, c: V3[]) {
  const m: V3 = [0, 1, 2].map(i => c.reduce((t, v) => t + v[i], 0) / 8) as V3
  const F = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]]
  for (const [i, j, k, l] of F) face(p, c[i], c[j], c[k], c[l], m)
}

export function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), door = new Part()

  // ---- The body: a rectilinear plan on a grid, courtyards as holes. ----
  const outer = (x: number, y: number) =>
    (x > W0 && x < E0 && y > S0 && y < N0) || (x > SEx && x < E0 && y > SE && y <= S0)
  const solid = (x: number, y: number) => outer(x, y) && !PATIOS.some(([x0, y0, x1, y1]) => x > x0 && x < x1 && y > y0 && y < y1)
  const xs = [...new Set([W0, E0, SEx, ...PATIOS.flatMap(p => [p[0], p[2]])])].sort((a, b) => a - b)
  const ys = [...new Set([S0, N0, SE, ...PATIOS.flatMap(p => [p[1], p[3]])])].sort((a, b) => a - b)
  const H = CORN0
  for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) {
    const x0 = xs[i], x1 = xs[i + 1], y0 = ys[j], y1 = ys[j + 1], mx = (x0 + x1) / 2, my = (y0 + y1) / 2
    if (!solid(mx, my)) continue
    roof.quad([x0, y0, CORN1], [x1, y0, CORN1], [x1, y1, CORN1], [x0, y1, CORN1])
    // Walls toward empty neighbours (courtyards and the street).
    if (!solid(mx, y0 - 0.01)) stone.quad([x0, y0, 0], [x1, y0, 0], [x1, y0, H], [x0, y0, H])
    if (!solid(mx, y1 + 0.01)) stone.quad([x1, y1, 0], [x0, y1, 0], [x0, y1, H], [x1, y1, H])
    if (!solid(x0 - 0.01, my)) stone.quad([x0, y1, 0], [x0, y0, 0], [x0, y0, H], [x0, y1, H])
    if (!solid(x1 + 0.01, my)) stone.quad([x1, y0, 0], [x1, y1, 0], [x1, y1, H], [x1, y0, H])
  }
  // Courtyard walls up to the roof, and their windows: three rows per bay,
  // the ground floor as an arcade.
  for (const [x0, y0, x1, y1] of PATIOS) {
    const ring = rect(x0, y0, x1, y1).reverse() // clockwise: walls face into the patio
    for (let i = 0; i < 4; i++) {
      const a = ring[i], b = ring[(i + 1) % 4], { P, L } = onWall(a, b)
      stone.quad(P(0, H), P(L, H), P(L, CORN1), P(0, CORN1))
      const n = Math.max(1, Math.round(L / 5.0))
      for (let k = 0; k < n; k++) {
        const s = ((k + 0.5) * L) / n
        if (x1 - x0 > 30) opening(win, a, b, s, 2.6, 0.6, 7.4, false) // the main patio's arcade
        opening(win, a, b, s, 1.6, 12.6, 16.6, false)
      }
    }
  }

  // ---- The street fronts. ----
  const NW: XY = [W0, N0], NE: XY = [E0, N0], SWc: XY = [W0, S0], SEc: XY = [E0, SE]
  const fronts: [XY, XY][] = [
    [NE, NW], // north, Tacuba (main front): a→b runs west so `out` is +y
    [NW, SWc], // west
    [SWc, [SEx, S0]], [[SEx, S0], [SEx, SE]], [[SEx, SE], SEc], // south
    [SEc, NE], // east
  ]
  const PORT0 = CX - 10.2, PORT1 = CX + 10.2 // the portico, x
  for (const [a, b] of fronts) {
    const { L } = onWall(a, b)
    const north = a === NE
    // Plinth, string courses, the lower order's entablature, the cornice and
    // the balustrade all round.
    proud(stone, a, b, 0, L, 0, 0.9, -0.01, 0.25)
    proud(stone, a, b, 0, L, 5.0, 5.4, -0.01, 0.2)
    band(trim, a, b, 0, L, 11.0, 11.8, 0.4, 0.2)
    proud(stone, a, b, 0, L, CORN0 - 0.01, CORN1, -0.01, 0.0)
    band(trim, a, b, -0.9, L + 0.9, CORN0, CORN1, 0.9, 0.45)
    if (north) {
      balustrade(trim, a, b, 0.4, E0 - PORT1 - 0.3, CORN1, BAL1, -0.3, 0.25)
      balustrade(trim, a, b, E0 - PORT0 + 0.3, L - 0.4, CORN1, BAL1, -0.3, 0.25)
    } else if (a === NW) balustrade(trim, a, b, 0.4, L - 0.4, CORN1, BAL1, -0.3, 0.25, 8)
    else if (L > 8) proud(trim, a, b, 0, L, CORN1, BAL1 - 0.3, -0.3, 0.25) // south and east: unphotographed, a plain parapet
    // Corner pilaster strips.
    if (L > 8) for (const s of [0, L - 1.3]) proud(trim, a, b, s, s + 1.3, 0.9, CORN0, -0.01, 0.22)
    if (L < 8) continue
    // Window bays. The north front: seven bays each side of the portico, a
    // door in the fourth; the others ~4.8 m bays.
    const sides: [number, number][] = north
      ? [[1.3, (E0 - PORT1) - 0.2], [(E0 - PORT0) + 0.2, L - 1.3]]
      : [[1.3, L - 1.3]]
    for (const [s0, s1] of sides) {
      const n = north ? 7 : Math.max(1, Math.round((s1 - s0) / 4.8)), w = (s1 - s0) / n
      for (let k = 0; k < n; k++) {
        const s = s0 + (k + 0.5) * w
        const isDoor = north && k === 3
        if (isDoor) {
          // The side door: a red door between two columns, a balcony over.
          opening(door, a, b, s, 2.4, 0.9, 5.6, false, 0.08)
          for (const d of [-1.9, 1.9]) proud(trim, a, b, s + d - 0.4, s + d + 0.4, 0.9, 6.0, -0.01, 0.6)
          band(trim, a, b, s - 2.6, s + 2.6, 6.0, 6.7, 0.95, 0.25)
          proud(trim, a, b, s - 2.3, s + 2.3, 6.7, 7.7, 0.4, 0.9)
          opening(win, a, b, s, 1.9, 7.7, 10.2, false, 0.06)
        } else {
          opening(win, a, b, s, 1.7, 1.3, 4.2, false)
          opening(win, a, b, s, 2.0, 6.3, 10.1, false)
          if (north) opening(door, a, b, s, 2.4, 6.1, 10.3, false, 0.03) // the red-painted frame
          if (north) proud(trim, a, b, s - 1.35, s + 1.35, 6.0, 6.35, -0.01, 0.55) // balcony
        }
        opening(win, a, b, s, 2.2, 12.8, north ? 16.9 : 17.2, false)
        if (north) opening(door, a, b, s, 2.6, 12.6, 17.1, false, 0.03) // the red-painted frame
        if (north) {
          // Segmental hood over the piano-nobile windows, and pilasters between bays.
          proud(trim, a, b, s - 1.6, s + 1.6, 17.1, 17.6, -0.01, 0.35)
          proud(trim, a, b, s - 1.0, s + 1.0, 17.6, 18.3, -0.01, 0.3)
          if (k > 0) proud(stone, a, b, s - w / 2 - 0.35, s - w / 2 + 0.35, 11.8, CORN0, -0.01, 0.2)
        }
      }
    }
  }

  // ---- The portico: two orders of paired columns, three arches, pediment. ----
  {
    const y0 = N0, yF = N0 + 1.0 // its wall stands 1 m proud of the front
    const a: XY = [PORT1, yF], b: XY = [PORT0, yF]
    // The projecting block (its sides and front), up to the cornice.
    stone.quad([PORT1, y0, 0], [PORT1, yF, 0], [PORT1, yF, CORN0], [PORT1, y0, CORN0])
    stone.quad([PORT0, yF, 0], [PORT0, y0, 0], [PORT0, y0, CORN0], [PORT0, yF, CORN0])
    const { P, L } = onWall(a, b)
    const arch = [L / 2 - 5.8, L / 2, L / 2 + 5.8], AW = 3.7, SPRING = 6.6
    // Front wall with three deep arched openings: wall pieces between them.
    const pieces: [number, number][] = [[0, arch[0] - AW / 2], [arch[0] + AW / 2, arch[1] - AW / 2], [arch[1] + AW / 2, arch[2] - AW / 2], [arch[2] + AW / 2, L]]
    const TOPA = SPRING + AW / 2
    for (const [s0, s1] of pieces) stone.quad(P(s0, 0), P(s1, 0), P(s1, TOPA), P(s0, TOPA))
    stone.quad(P(0, TOPA), P(L, TOPA), P(L, CORN0), P(0, CORN0))
    const behind = (s: number) => P(s, SPRING, -1)
    const D = 0.9 // recess depth (its back stays in front of the main wall)
    for (const s of arch) {
      const r = AW / 2, n = 8
      // Recess: back (the iron gates), sides and the vault.
      win.quad(P(s - r, 0, -D), P(s + r, 0, -D), P(s + r, SPRING, -D), P(s - r, SPRING, -D))
      const c = P(s, SPRING, -D)
      for (let k = 0; k < n; k++) {
        const t0 = (k / n) * Math.PI, t1 = ((k + 1) / n) * Math.PI
        win.tri(c, P(s + r * Math.cos(t0), SPRING + r * Math.sin(t0), -D), P(s + r * Math.cos(t1), SPRING + r * Math.sin(t1), -D))
        // the vault's soffit, and the wall face around the arch head
        const p0 = P(s + r * Math.cos(t0), SPRING + r * Math.sin(t0), 0), p1 = P(s + r * Math.cos(t1), SPRING + r * Math.sin(t1), 0)
        const q0 = P(s + r * Math.cos(t0), SPRING + r * Math.sin(t0), -D), q1 = P(s + r * Math.cos(t1), SPRING + r * Math.sin(t1), -D)
        const tm = (t0 + t1) / 2
        face(stone, p0, p1, q1, q0, P(s + 2 * r * Math.cos(tm), SPRING + 2 * r * Math.sin(tm), -D / 2))
        // The wall face between the arch and its square frame.
        const box = (t: number) => { const k = Math.min(r / Math.max(1e-6, Math.abs(Math.cos(t))), r / Math.max(1e-6, Math.sin(t))); return P(s + k * Math.cos(t), SPRING + k * Math.sin(t), 0) }
        face(stone, p0, box(t0), box(t1), p1, behind(s))
      }
      face(stone, P(s - r, 0, -D), P(s - r, 0, 0), P(s - r, SPRING, 0), P(s - r, SPRING, -D), P(s - r - 1, SPRING / 2, -D / 2))
      face(stone, P(s + r, 0, 0), P(s + r, 0, -D), P(s + r, SPRING, -D), P(s + r, SPRING, 0), P(s + r + 1, SPRING / 2, -D / 2))
      // Keystone and impost blocks in trim.
      proud(trim, a, b, s - 0.35, s + 0.35, SPRING + r - 0.2, SPRING + r + 0.7, -0.01, 0.2)
    }
    // Paired columns of the lower order, on a common plinth, and the upper.
    const pairs = [L / 2 - 8.75, L / 2 - 2.9, L / 2 + 2.9, L / 2 + 8.75]
    for (const s of pairs) {
      proud(trim, a, b, s - 1.25, s + 1.25, 0, 0.9, -0.01, 1.25)
      for (const d of [-0.62, 0.62]) {
        const [x, y] = P(s + d, 0, 0.6)
        column(trim, x, y, 0.9, 11.0, 0.46)
        const [x2, y2] = P(s + d, 0, 0.5)
        column(trim, x2, y2, 13.2, CORN0, 0.38, 6)
      }
    }
    // The lower entablature (with the school's name plaque) and the balcony.
    band(trim, a, b, -0.2, L + 0.2, 11.0, 12.1, 1.35, 0.3)
    balustrade(trim, a, b, 0.2, L - 0.2, 12.1, 13.2, 0.25, 1.1, 2.9)
    proud(stone, a, b, L / 2 - 2.6, L / 2 + 2.6, 9.6, 11.0, -0.01, 0.15)
    // Upper windows with arched hoods, between the pairs.
    for (const s of arch) {
      opening(win, a, b, s, 2.1, 13.4, 17.0, false)
      proud(trim, a, b, s - 1.5, s + 1.5, 17.3, 17.8, -0.01, 0.4)
      semi(trim, a, b, s, 17.8, 1.3, 0.3)
    }
    // Upper entablature: the cornice carries on across, a step proud.
    band(trim, a, b, -0.4, L + 0.4, CORN0, CORN1, 1.5, 0.45)
    // The pediment: a triangular prism with raking cornices.
    const AP = 26.8, PY0 = N0 - 0.5, PY1 = yF + 0.9
    const tl: V3 = [PORT0 - 0.3, PY1, CORN1], tr: V3 = [PORT1 + 0.3, PY1, CORN1], tt: V3 = [CX, PY1, AP]
    const bl: V3 = [PORT0 - 0.3, PY0, CORN1], br: V3 = [PORT1 + 0.3, PY0, CORN1], bt: V3 = [CX, PY0, AP]
    stone.tri(tl, tt, tr)
    stone.tri(bl, br, bt)
    // Raking cornices: slabs lying on the two slopes, a step proud in front.
    const up = (v: V3, dz: number, dy = 0): V3 => [v[0], v[1] + dy, v[2] + dz]
    for (const [lo, blo] of [[tl, bl], [tr, br]] as [V3, V3][]) {
      const f = 0.45, k = 0.6
      hexa(trim, [up(blo, 0), up(lo, 0, f), up(tt, 0, f), up(bt, 0), up(blo, k), up(lo, k, f), up(tt, k, f), up(bt, k)])
    }
  }

  // ---- The attic block behind the pediment, and the lantern on it. ----
  {
    const ax0 = CX - 10.6, ax1 = CX + 10.6, ay0 = 32.6, ay1 = N0 - 1.2, Z0 = CORN1 - 0.6, ZT = 31.0
    const ring = rect(ax0, ay0, ax1, ay1)
    for (let i = 0; i < 4; i++) {
      const a = ring[i], b = ring[(i + 1) % 4], { P, L } = onWall(a, b)
      stone.quad(P(0, Z0), P(L, Z0), P(L, ZT), P(0, ZT))
      band(trim, a, b, -0.4, L + 0.4, ZT, ZT + 0.8, 0.6, 0.3)
      balustrade(trim, a, b, 0.3, L - 0.3, ZT + 0.8, ZT + 2.0, -0.2, 0.3, 3.5)
      // A row of windows on each face (the north row shows over the pediment).
      const n = Math.max(1, Math.round(L / 3.4))
      for (let k = 0; k < n; k++) opening(win, a, b, ((k + 0.5) * L) / n, 1.5, 27.6, 30.0)
    }
    roof.quad([ax0, ay0, ZT + 0.8], [ax1, ay0, ZT + 0.8], [ax1, ay1, ZT + 0.8], [ax0, ay1, ZT + 0.8])
    // Urns on the corners.
    for (const [x, y] of ring) {
      const ix = x < CX ? x + 0.5 : x - 0.5, iy = y < 36 ? y + 0.5 : y - 0.5
      smooth(trim, q => lathe(q, [[0.42, ZT + 2.0], [0.42, ZT + 2.3], [0.2, ZT + 2.4], [0.42, ZT + 2.8], [0.12, ZT + 3.3], [0.0, ZT + 3.5]], 6, ix, iy), 50)
    }
    // The observatory lantern: a square drum and a domical cap, set back.
    const lx = CX, ly = 36.0, r = 2.2, z0 = ZT + 0.8, z1 = ZT + 3.3, zt = ZT + 5.0
    const lr = rect(lx - r, ly - r, lx + r, ly + r)
    for (let i = 0; i < 4; i++) {
      const a = lr[i], b = lr[(i + 1) % 4], { P, L } = onWall(a, b)
      stone.quad(P(0, z0), P(L, z0), P(L, z1), P(0, z1))
      band(trim, a, b, -0.15, L + 0.15, z1 - 0.3, z1, 0.25, 0.1)
      opening(win, a, b, L / 2, 1.1, z0 + 0.4, z1 - 0.6)
    }
    // Cloister vault: four curved faces rising to a point.
    const n = 6
    for (let i = 0; i < 4; i++) {
      const a = lr[i], b = lr[(i + 1) % 4]
      for (let k = 0; k < n; k++) {
        const t0 = k / n, t1 = (k + 1) / n
        const h0 = Math.sin((t0 * Math.PI) / 2), h1 = Math.sin((t1 * Math.PI) / 2)
        const s0 = 1 - Math.cos((t0 * Math.PI) / 2), s1 = 1 - Math.cos((t1 * Math.PI) / 2)
        const at = (p: XY, s: number, h: number): V3 => [p[0] + (lx - p[0]) * s, p[1] + (ly - p[1]) * s, z1 + (zt - z1) * h]
        if (k === n - 1) roof.tri(at(a, s0, h0), at(b, s0, h0), at(a, s1, h1))
        else roof.quad(at(a, s0, h0), at(b, s0, h0), at(b, s1, h1), at(a, s1, h1))
      }
    }
  }

  // Floodlit stone at night: the north front and the portico most.
  const lit = (p: V3, nn: V3) => (nn[2] > 0.7 ? 0.2 : nn[1] > 0.5 ? 0.85 : 0.45)
  return [
    // Weathered chiluca, a warm mid grey (#8f8a80 in daylight), pulled light.
    { part: stone, material: { ...finish('chiluca-grey', 0xb0a797), floodlight: lit } },
    { part: trim, material: { ...finish('chiluca-trim', 0xc6bdae), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    // The oxblood side doors and the red-painted window frames of the main
    // front (the portico's iron gates are drawn as dark openings).
    { part: door, material: { ...PALETTE.entrance, color: 0x8a4a3e } },
  ]
}

if (import.meta.main) await save('mexico-city-palacio-de-mineria', 'Palacio de Minería', ANCHOR, BEARING, build(), 6500)
