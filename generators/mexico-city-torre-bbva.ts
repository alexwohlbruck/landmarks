/**
 * Torre BBVA México (Paseo de la Reforma 510, 2016, Legorreta + Legorreta
 * with Rogers Stirk Harbour + Partners; structure Arup / Colinas de Buen),
 * Mexico City — original procedural geometry, CC0-1.0.
 * bun generators/mexico-city-torre-bbva.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/427833539,
 * 19.422822,-99.174810. The tower's faces run at 56.4° / 146.4°, so the
 * catalog bearing is 56.4 and the plan is square to the model frame:
 * model -y is the SW face, +x the SE face, +y the NE face, -x the NW face.
 *
 * Identity, in order: a dark steel frame standing proud of the glass on
 * every face — a corner post at each corner of the plan, a mega-beam every
 * three storeys and a "/\" brace in every band, so each face reads as a
 * stack of chevrons; a pale grey diamond sunscreen lattice over the glass
 * between them; the open three-storey sky gardens cut into the SW and NE
 * faces at staggered levels; the pale service core with its twin shafts
 * rising above the roof at the E corner; the stack of pale-framed glazed
 * pods on the W corner; and the crown: the posts carrying a ring beam over
 * the roof, the navy BBVA signs and the round helipad above.
 *
 * Evidence:
 *  - plan: OSM way/427833539 (Torre BBVA, building=office, 50 levels) is a
 *    ~48 × 50 m square, N and S corners square, the E and W corners cut by
 *    18.4 m faces; the core parts way/1138584858 (18.2 × 5.3 m, 225 m) and
 *    way/1138584859 (10.3 × 4.1 m, 240 m) stand on the E cut, the pods'
 *    strip way/1173440067 on the W cut, the helipad ring way/1173440068
 *    (28.6 m across, 234–235 m). Used as tagged (measured from OSM). The
 *    other parts (way/1138584854 225 m, way/1185622772, way/1484777440/441
 *    230 m) are the mapper's roof subdivisions and are covered by the model.
 *    Photo check: the SW face's projected width in Valenzuela's level view
 *    (Reforma 3 skycrappers) and the whole tower's width from Chapultepec
 *    Castle (José Luiz) agree with the OSM square to ~10 %.
 *  - heights: published 235 m to the helipad, top floor 216 m, 50 floors
 *    (es/en Wikipedia; CTBUH 235 m). The twin shafts 240 m (OSM part, and
 *    1.08 × the face top in Valenzuela's view, scaled by the 235 m helipad);
 *    the face top / roof ~221 m and the crown frame ~231 m from the same
 *    view (estimated); the core block 226 m (OSM 225 m).
 *  - bands: 13.6 m (three office floors) from Drkgk's telephoto of the NE
 *    face, scaled by the 35 m face; 15 bands over a ~17 m lobby (estimated).
 *    Every band has a "/\" brace from its lower corners to mid-span under the
 *    next beam (same photo, and Valenzuela's view of the SW face).
 *  - sky gardens: SW face bands 8 and 15 (the top band, under the sign)
 *    from Valenzuela's view and the CDMX night aerial; NE face bands 7 and
 *    12 from Drkgk's and Monstruodelinfierno's photos. None seen on the SE
 *    and NW faces above ~40 m (estimated: none modelled).
 *  - pods: seven, one band tall, on every second band from the 2nd to the
 *    14th, ~11.6 m wide and ~4.5 m proud (Valenzuela's view and the CDMX
 *    aerial; estimated sizes).
 *  - colour: in every distant photo the tower reads as a dark navy-grey
 *    mass, the sunscreen darkening the glass, with only the sky gardens,
 *    the pods and the white core light (review round 1). So the glass is a
 *    deep grey-blue (#5a6878), the sunscreen and roof decks a mid grey
 *    (#737d89) that reads as a dark mesh, the frame navy-charcoal
 *    (#4a515e, mega-beams 1.7 m and chevrons 1.4 m wide so they hold
 *    against the dark field); the gardens light glass (#a9bfd1), the core
 *    and pods pale grey panels, the sign navy (letters left out). The
 *    assignment called the diagonal lattice white; every photo shows the
 *    big braces dark and only the fine sunscreen paler, so the photos were
 *    followed.
 *  - night: the offices, the sky gardens and the core's window column glow
 *    (CDMX night aerials), so the glass is `window`, the gardens `window-2`;
 *    the sign is lit (`neon-*`).
 *  - terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s); the
 *    site is on the flat lake-bed basin (~2,240 m). Modelled level,
 *    elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Torre_BBVA_Mexico_2019.jpg, Drkgk, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Torre_BBVA_Mexico_2019.jpg
 *  - Torre_bancomer_1612.jpg, Carlos Valenzuela, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Torre_bancomer_1612.jpg
 *  - Reforma_3_skycrappers.jpg, Carlos Valenzuela, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Reforma_3_skycrappers.jpg
 *  - Torre_Bancomer_2016_2.jpg, Monstruodelinfierno, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Torre_Bancomer_2016_2.jpg
 *  - Torre_BBVA_CDMX.jpg, Gobierno CDMX, CC0
 *    https://commons.wikimedia.org/wiki/File:Torre_BBVA_CDMX.jpg
 *  - Sobrevuelos_CDMX_IMG_0224_(40386052191).jpg, Gobierno CDMX, CC0
 *    https://commons.wikimedia.org/wiki/File:Sobrevuelos_CDMX_IMG_0224_(40386052191).jpg
 *  - Sobrevuelos_CDMX_IMG_5816_(40385952891).jpg, Gobierno CDMX, CC0
 *    https://commons.wikimedia.org/wiki/File:Sobrevuelos_CDMX_IMG_5816_(40385952891).jpg
 *  - Sobrevuelos_CDMX_IMG_0226_(40340949152).jpg, Gobierno CDMX, CC0
 *    https://commons.wikimedia.org/wiki/File:Sobrevuelos_CDMX_IMG_0226_(40340949152).jpg
 *  - Sobrevuelos_CDMX_HJ2A5458_(39675459174).jpg, Gobierno CDMX, CC0
 *    https://commons.wikimedia.org/wiki/File:Sobrevuelos_CDMX_HJ2A5458_(39675459174).jpg
 *  - Paseo_de_la_Reforma_from_Chapultepec_Castle_-_Mexico_2024_(2).jpg,
 *    José Luiz, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Paseo_de_la_Reforma_from_Chapultepec_Castle_-_Mexico_2024_(2).jpg
 *  - Torre_BBVA.jpg, AnghelGarcia, CC BY-SA 4.0 (dusk, lighting)
 *    https://commons.wikimedia.org/wiki/File:Torre_BBVA.jpg
 * Look-only: none. No commercial imagery.
 *
 * Doubts: the plan size rests on OSM (the en-Wikipedia floor area suggests
 * a slightly smaller plate); the lobby height and the band count are
 * estimated; the SE and NW faces may have sky gardens below ~40 m that no
 * photo shows; whether the SE and NW faces carry the same chevrons as the
 * SW and NE faces is not clear in the photos (modelled the same).
 *
 * Left out: the floor lines, the garden planting and sculptures, the sign's
 * lettering, the antennas on the shafts, the lift bridge's detail, the
 * neighbouring podium buildings (separate OSM buildings).
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, onWall, save, walls, type XY } from './chi-aon-center'

const ANCHOR: [number, number] = [19.422822, -99.17481]
const BEARING = 56.4

// Plan, in the model frame (x along 146.4°, y along 56.4°): OSM way/427833539.
const X0 = -25.2, X1 = 23.0, Y0 = -26.1, Y1 = 23.7
const CH = 13.0 // the E (core) and W (pods) corners are cut by 18.4 m faces

// Heights (see header).
const LOBBY = 17.2
const BAND = 13.6 // three office floors between mega-beams
const NB = 15
const TOP = LOBBY + NB * BAND // 221.2, the face top / main roof
const POST = 231.2 // crown frame
const PAD = 235 // helipad deck (published height)
const CORE = 240 // twin service shafts (OSM part 240 m)
const CORE_BLOCK = 226 // the core block behind them (OSM part 225 m)

const bandZ = (k: number) => LOBBY + k * BAND

const norm = (a: V3): V3 => { const m = Math.hypot(a[0], a[1], a[2]); return [a[0] / m, a[1] / m, a[2] / m] }
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]

/** A quad whose winding follows the given outward normal. */
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  p.tri(a, c, d, undefined, undefined, undefined, [n, n, n])
}

/**
 * A facade member from A to B lying in a face whose outward normal is n:
 * w wide in the face, standing d proud of it. Its back and ends are hidden
 * against the glass and the members it meets, so only three sides are drawn
 * (the ends too when `ends`).
 */
function member(p: Part, A: V3, B: V3, n: V3, w: number, d: number, back = 0, ends = false) {
  const t = norm(sub(B, A)), u = norm(cross(t, n))
  const c = (P: V3, a: number, b: number): V3 => add(add(P, u, a), n, b)
  const a0 = c(A, -w / 2, -back), a1 = c(A, w / 2, -back), a2 = c(A, w / 2, d), a3 = c(A, -w / 2, d)
  const b0 = c(B, -w / 2, -back), b1 = c(B, w / 2, -back), b2 = c(B, w / 2, d), b3 = c(B, -w / 2, d)
  quadN(p, a1, b1, b2, a2, u)
  quadN(p, a2, b2, b3, a3, n)
  quadN(p, a3, b3, b0, a0, [-u[0], -u[1], -u[2]])
  if (ends) {
    quadN(p, a0, a1, a2, a3, [-t[0], -t[1], -t[2]])
    quadN(p, b0, b1, b2, b3, t)
  }
}

/** A vertical box between two heights over a counter-clockwise ring. */
function prism(side: Part, top: Part | null, r: XY[], z0: number, z1: number) {
  walls(side, r, z0, z1)
  if (top) cap(top, r, z1)
}

const ringAt = (cx: number, cy: number, hx: number, hy: number): XY[] => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]]

function build() {
  const steel = new Part(), win = new Part(), pale = new Part(), screen = new Part(), sign = new Part(), sky = new Part()
  const roof = screen
  const lobby = win

  // The plan: a ~48 × 50 m square, corners N and S sharp, E and W cut.
  const A: XY = [X0 + CH, Y0], B: XY = [X1, Y0], C: XY = [X1, Y1 - CH], D: XY = [X1 - CH, Y1], E: XY = [X0, Y1], F: XY = [X0, Y0 + CH]
  const ring = [A, B, C, D, E, F]
  // Faces: 0 SW (A→B), 1 SE (B→C), 2 E core end (C→D), 3 NE (D→E), 4 NW (E→F), 5 W pods end (F→A).
  const GARDENS: number[][] = [[7, 14], [], [], [6, 11], [], []]
  const PODS = [1, 3, 5, 7, 9, 11, 13]
  const GLASS = 0.7 // glass line behind the structure's face plane
  const RECESS = 4.5 // sky garden glass line

  for (let f = 0; f < 6; f++) {
    const a = ring[f], b = ring[(f + 1) % 6]
    const { L, n: n2, P } = onWall(a, b)
    const n: V3 = [n2[0], n2[1], 0]
    if (f === 2) continue // the service core covers the E end
    // Lobby: storey-high glazing set back behind the posts.
    quadN(lobby, P(0.6, 0, -2.4), P(L - 0.6, 0, -2.4), P(L - 0.6, LOBBY, -2.4), P(0.6, LOBBY, -2.4), n)
    // Soffit over the lobby setback.
    quadN(steel, P(0.6, LOBBY, -2.4), P(L - 0.6, LOBBY, -2.4), P(L - 0.6, LOBBY, -GLASS), P(0.6, LOBBY, -GLASS), [0, 0, -1])
    for (let k = 0; k < NB; k++) {
      const z0 = bandZ(k), z1 = z0 + BAND
      const garden = GARDENS[f].includes(k)
      const pod = f === 5 && PODS.includes(k)
      if (garden) {
        // Sky garden: the glass three storeys deep in, floor, ceiling and ends.
        const s0 = 0.9, s1 = L - 0.9
        quadN(sky, P(s0, z0, -RECESS), P(s1, z0, -RECESS), P(s1, z1, -RECESS), P(s0, z1, -RECESS), n)
        quadN(roof, P(s0, z0, -GLASS), P(s1, z0, -GLASS), P(s1, z0, -RECESS), P(s0, z0, -RECESS), [0, 0, 1])
        quadN(pale, P(s0, z1, -RECESS), P(s1, z1, -RECESS), P(s1, z1, -GLASS), P(s0, z1, -GLASS), [0, 0, -1])
        const t: V3 = norm([b[0] - a[0], b[1] - a[1], 0])
        quadN(sky, P(s0, z0, -GLASS), P(s0, z0, -RECESS), P(s0, z1, -RECESS), P(s0, z1, -GLASS), t)
        quadN(sky, P(s1, z0, -RECESS), P(s1, z0, -GLASS), P(s1, z1, -GLASS), P(s1, z1, -RECESS), [-t[0], -t[1], 0])
      } else {
        quadN(win, P(0.5, z0, -GLASS), P(L - 0.5, z0, -GLASS), P(L - 0.5, z1, -GLASS), P(0.5, z1, -GLASS), n)
      }
      // The mega-structure: a beam over every band and a "/\" brace in it,
      // feet at the band's lower corners, apex mid-span under the next beam.
      member(steel, P(0, z1, 0), P(L, z1, 0), n, 1.7, 1.0, GLASS)
      if (k === 0) member(steel, P(0, z0, 0), P(L, z0, 0), n, 1.7, 1.0, GLASS)
      if (!pod) {
        member(steel, P(0.8, z0 + 0.6, 0), P(L / 2, z1 - 0.6, 0), n, 1.4, 0.8, GLASS)
        member(steel, P(L / 2, z1 - 0.6, 0), P(L - 0.8, z0 + 0.6, 0), n, 1.4, 0.8, GLASS)
      }
    }
    // The sunscreen: a pale diamond lattice over the glass, drawn at about
    // half the real density (two diamonds per band, five across a face) as
    // continuous ridged strips that stop at the sky gardens and the lobby.
    if (f !== 5) {
      const w = L / 5, h = BAND / 2, m = h / w
      const skip = GARDENS[f].map(k => [bandZ(k), bandZ(k) + BAND])
      for (const dir of [1, -1]) {
        for (let j = -7; j <= NB * 2 + 7; j++) {
          const c = LOBBY + j * h
          // z = c + dir * m * s, clipped to the face.
          let sa = 0, sb = L
          const zOf = (s: number) => c + dir * m * s
          const sOf = (z: number) => (z - c) / (dir * m)
          const lo = Math.min(sOf(LOBBY), sOf(TOP)), hi = Math.max(sOf(LOBBY), sOf(TOP))
          sa = Math.max(sa, lo); sb = Math.min(sb, hi)
          if (sb - sa < 0.5) continue
          // Split around the gardens.
          let pieces: [number, number][] = [[sa, sb]]
          for (const [g0, g1] of skip) {
            const out: [number, number][] = []
            for (const [p0, p1] of pieces) {
              const q0 = Math.min(sOf(g0), sOf(g1)), q1 = Math.max(sOf(g0), sOf(g1))
              if (q1 <= p0 || q0 >= p1) { out.push([p0, p1]); continue }
              if (q0 > p0) out.push([p0, q0])
              if (q1 < p1) out.push([q1, p1])
            }
            pieces = out
          }
          for (const [p0, p1] of pieces) {
            if (p1 - p0 < 0.5) continue
            const pa = P(p0, zOf(p0), -GLASS + 0.05), pb = P(p1, zOf(p1), -GLASS + 0.05)
            const t = norm(sub(pb, pa)), u = norm(cross(t, n)), hw = 0.3
            const ra = add(pa, n, 0.4), rb = add(pb, n, 0.4)
            const nu = norm(add(n, u, 1)), nl = norm(add(n, u, -1))
            quadN(screen, add(pa, u, -hw), add(pb, u, -hw), rb, ra, nl)
            quadN(screen, ra, rb, add(pb, u, hw), add(pa, u, hw), nu)
          }
        }
      }
    }
  }

  // The posts: at every corner of the plan, from the ground to the crown frame.
  for (let f = 0; f < 6; f++) {
    const [x, y] = ring[f]
    const h = 1.15
    prism(steel, steel, ringAt(x, y, h, h), 0, POST)
  }
  // The crown frame: a ring beam between the post tops.
  for (let f = 0; f < 6; f++) {
    if (f === 2) continue
    const a = ring[f], b = ring[(f + 1) % 6]
    const { n: n2, P, L } = onWall(a, b)
    const n: V3 = [n2[0], n2[1], 0]
    member(steel, P(0, POST - 0.9, -0.1), P(L, POST - 0.9, -0.1), n, 1.6, 0.9, 0.9, true)
  }

  // The roof: deck at the face top, a mechanical box, the sign boxes.
  cap(roof, ring, TOP - 0.3)
  {
    const ins = ring // the roof edge lip
    walls(steel, ins, TOP - 0.3, TOP + 0.6)
  }
  prism(pale, roof, ringAt(-4, -2, 13, 10), TOP, TOP + 6.5)
  // Signs: a navy panel over the SW face and over the NE face, lit at night.
  {
    const sw = ringAt((A[0] + B[0]) / 2, Y0 + 3.2, 14, 0.8)
    prism(sign, sign, sw, TOP + 0.6, TOP + 6.6)
    const ne = ringAt((D[0] + E[0]) / 2, Y1 - 3.2, 14, 0.8)
    prism(sign, sign, ne, TOP + 0.6, TOP + 6.6)
  }

  // The helipad: a 28.6 m disc on raking struts (OSM way/1173440068).
  {
    const cx = -3, cy = -3, R = 14.3, seg = 20
    const circ = (r: number, z: number): V3[] => Array.from({ length: seg }, (_, i) => {
      const t = (i / seg) * Math.PI * 2
      return [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
    })
    steel.loft([circ(R, PAD - 1.1), circ(R, PAD)])
    roof.cap(circ(R, PAD), true)
    steel.cap(circ(R - 2.5, PAD - 1.4), false)
    steel.loft([circ(R - 2.5, PAD - 1.4), circ(R, PAD - 1.1)].map(r => r))
    // Raking struts from the mechanical box up to the rim.
    for (let i = 0; i < 6; i++) {
      const t = (i / 6) * Math.PI * 2 + 0.3
      const top: V3 = [cx + (R - 3) * Math.cos(t), cy + (R - 3) * Math.sin(t), PAD - 1.3]
      const foot: V3 = [cx + 6 * Math.cos(t), cy + 5 * Math.sin(t), TOP + 6.5]
      const n: V3 = [-Math.sin(t), Math.cos(t), 0]
      member(steel, foot, top, n, 0.9, 0.45, 0.45, false)
    }
  }
  // The glass lift tower and bridge from the core to the helipad.
  {
    const lx = 12, ly = 9
    prism(win, roof, ringAt(lx, ly, 2.2, 2.2), TOP, PAD + 4)
    member(steel, [lx - 2.2, ly - 1, PAD - 0.6], [-3 + 12.5, -3 + 3, PAD - 0.6], [0, 0, 1], 2.4, 0.6, 0.6, true)
  }

  // The service core on the E end: an 18.4 m block of pale panels to ~221 m
  // and the twin shafts in front of it to 240 m, split by a dark slot.
  {
    const { n: n2, P, L } = onWall(C, D)
    const n: V3 = [n2[0], n2[1], 0]
    const blk: XY[] = [[P(0, 0, -0.2)[0], P(0, 0, -0.2)[1]], [P(0, 0, 5.3)[0], P(0, 0, 5.3)[1]], [P(L, 0, 5.3)[0], P(L, 0, 5.3)[1]], [P(L, 0, -0.2)[0], P(L, 0, -0.2)[1]]]
    // Ring order: make it counter-clockwise.
    const ccw = (r: XY[]) => (r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) > 0 ? r : [...r].reverse())
    prism(pale, roof, ccw(blk), 0, CORE_BLOCK)
    // A column of window panels up each side of the block, one per band.
    for (const [s, sgn] of [[0, -1], [L, 1]] as [number, number][]) {
      const t: V3 = norm([D[0] - C[0], D[1] - C[1], 0])
      const sn: V3 = [t[0] * sgn, t[1] * sgn, 0]
      for (let k = 0; k < NB; k++) {
        const z0 = bandZ(k) + 0.9, z1 = bandZ(k) + BAND - 0.9
        const off = s + sgn * 0.05
        quadN(win, P(off, z0, 1.2), P(off, z0, 4.0), P(off, z1, 4.0), P(off, z1, 1.2), sn)
      }
    }
    // The twin shafts, 4.4 m each with a 1.5 m slot, standing 4.1 m proud.
    const mid = L / 2
    for (const [s0, s1] of [[mid - 5.15, mid - 0.75], [mid + 0.75, mid + 5.15]]) {
      const r: XY[] = [P(s0, 0, 5.3), P(s0, 0, 9.4), P(s1, 0, 9.4), P(s1, 0, 5.3)].map(v => [v[0], v[1]] as XY)
      prism(pale, roof, ccw(r), 0, CORE)
      // Dark louvred band at the top of each shaft.
      for (const [sa, sb, o] of [[s0, s1, 9.45]] as [number, number, number][]) {
        quadN(steel, P(sa, CORE - 8, o), P(sb, CORE - 8, o), P(sb, CORE - 0.6, o), P(sa, CORE - 0.6, o), n)
      }
    }
    // The slot between them: dark glazing set back.
    quadN(win, P(mid - 0.75, 0, 6.0), P(mid + 0.75, 0, 6.0), P(mid + 0.75, CORE - 1, 6.0), P(mid - 0.75, CORE - 1, 6.0), n)
  }

  // The pods on the W end: glazed boxes framed in pale panels, one band
  // tall, every second band, standing 3 m proud between the posts.
  {
    const { n: n2, P, L } = onWall(F, A)
    const n: V3 = [n2[0], n2[1], 0]
    const t: V3 = norm([A[0] - F[0], A[1] - F[1], 0])
    for (const k of PODS) {
      const z0 = bandZ(k) - 0.9, z1 = bandZ(k) + BAND + 0.9
      const s0 = L / 2 - 5.8, s1 = L / 2 + 5.8
      const r: XY[] = [P(s0, 0, -0.5), P(s1, 0, -0.5), P(s1, 0, 4.5), P(s0, 0, 4.5)].map(v => [v[0], v[1]] as XY)
      walls(pale, r.slice().reverse(), z0, z1) // ring above runs clockwise; reversed is CCW
      cap(pale, r.slice().reverse(), z1)
      cap(pale, r.slice().reverse(), z0, false)
      // Glass on the three outer faces inside a pale frame.
      quadN(win, P(s0 + 0.9, z0 + 1.4, 4.55), P(s1 - 0.9, z0 + 1.4, 4.55), P(s1 - 0.9, z1 - 1.4, 4.55), P(s0 + 0.9, z1 - 1.4, 4.55), n)
      quadN(win, P(s1 + 0.05, z0 + 1.4, 1.2), P(s1 + 0.05, z0 + 1.4, 3.7), P(s1 + 0.05, z1 - 1.4, 3.7), P(s1 + 0.05, z1 - 1.4, 1.2), t)
      quadN(win, P(s0 - 0.05, z0 + 1.4, 3.7), P(s0 - 0.05, z0 + 1.4, 1.2), P(s0 - 0.05, z1 - 1.4, 1.2), P(s0 - 0.05, z1 - 1.4, 3.7), [-t[0], -t[1], 0])
    }
  }

  return [
    { part: steel, material: finish('bbva-steel', 0x4a515e) },
    { part: win, material: { ...PALETTE.window, color: 0x5a6878 } },
    { part: pale, material: finish("bbva-panel", 0xc9d0d7) },
    // The sunscreen lattice and the roof decks share one mid grey.
    { part: screen, material: finish('bbva-screen', 0x737d89) },
    { part: sign, material: finish('neon-bbva-navy', 0x34528c) },
    { part: sky, material: windowVariant(2, 0xa9bfd1) },
  ]
}

if (import.meta.main) await save('mexico-city-torre-bbva', 'Torre BBVA México', ANCHOR, BEARING, build(), 6500)
