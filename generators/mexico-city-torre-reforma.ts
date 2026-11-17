/**
 * Torre Reforma (Paseo de la Reforma 483, 2016, L. Benjamín Romano / LBR&A;
 * structure Arup), Mexico City — original procedural geometry, CC0-1.0.
 * bun generators/mexico-city-torre-reforma.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/217330154,
 * 19.424815,-99.17442. Bearing 0: the plan is irregular (no main axis), so
 * the OSM corners are used as they are, in true east/north metres.
 *
 * Identity, in order: the tall triangular prism of pale exposed concrete;
 * the steep sloped "roof" facet that cuts the tower's south-west corner from
 * ~190 m up to the ridge along the NE wall, so the glass face ends in a
 * long diagonal and the tower reads as a blade; the creased glass face to
 * the west (toward Chapultepec) crossed by the steel bracing in four-storey
 * modules, with a recessed sky garden; the concrete walls' sparse
 * horizontal slot windows.
 *
 * Plan (OSM way/217330154, source SIGCDMX-style survey, 57 levels, height
 * 246): the outline is a triangle A (north) – E (south-west) – J (south-
 * east) with two triangular lobes on its west side (A-B-C, C-D-E). The
 * corners A, C, E lie on one line with a 3° crease at C, which is the
 * crease the architects describe down the middle of the glass face, so
 * A–C–E is taken as the glass face and the lobes as low base structures
 * (2 storeys, 8 m: estimated, no photo shows them; doubt). The NE side
 * J–K–A is one straight 82 m concrete wall; the south side E–F–G–H–I–J is
 * the second concrete wall (with OSM's small jogs at its ends). The two
 * concrete walls meet at the sharp (47°) corner J, as published ("two
 * concrete walls meet at a sharp edge; the third side is glass facing
 * Chapultepec").
 *
 * Which side is which was read from photos: from due west (ProtoplasmaKid's
 * night view from the Auditorio Nacional) and from the south-west (Cvmontuy
 * 1707, the Gobierno CDMX overflight) the braced glass face is seen nearly
 * face-on with its top falling from the north end (full height) to the
 * south end; from the south (Carlos Valenzuela 1612) the sloped facet is a
 * large inverted triangle of concrete with slots, its apex low at the
 * glass/south-wall corner, the glass seen edge-on to its left.
 *
 * Heights: roof 244 m, 57 storeys (published, en/es Wikipedia; CTBUH 246 m
 * to the top of the roof crane, left out). The facet runs from the ridge
 * (top of the NE wall, 244 m) down to the south-west corner E at 150 m:
 * photo-scaled — on the distant, level views (Luis Alvaz's Sonder Aria 01
 * telephoto, ProtoplasmaKid's due-west night view, Carlos Valenzuela 1612)
 * the glass face's top diagonal reaches its southern edge 40–45% of the
 * visible height below the top, ~95 m against the glass face's 55 m width.
 * Cvmontuy 1707 (a close vertical panorama) shows less (~23%), and the
 * press speaks of a "46 m sloped roof"; the distant views were preferred
 * (doubt). Steel bracing in four-storey modules (~17.1 m) from the photos.
 * Sky garden 84–96 m across the whole glass face, 5 m deep, with its steel
 * V (scaled from the night view against the facet's drop; estimate). Lobes
 * 8 m (invented, see above).
 *
 * Colour: board-formed concrete reads pale warm grey (#d6d3cc after
 * pulling to the palette); the glass face reads mid grey behind light
 * louvres (#74828e, a window material: lit at night); the bracing pale
 * steel grey (#a3a9ad, light against the glass in sun); the slots dark (window-2, they are windows).
 *
 * Terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s); the
 * site is on the flat lake-bed basin (~2,240 m). Modelled level.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Torre_Reforma1707.jpg, Cvmontuy, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Torre_Reforma1707.jpg
 *  - Torre_Reforma_.jpg, ProtoplasmaKid, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Torre_Reforma_.jpg
 *  - Torre_Mayor_y_Torre_Reforma1612.jpg, Carlos Valenzuela, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Torre_Mayor_y_Torre_Reforma1612.jpg
 *  - Reforma_towers2019.jpg, Cvmontuy, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Reforma_towers2019.jpg
 *  - Torres_del_Paseo_de_la_Reforma_desde_el_Hotel_Sonder_Aria_03.jpg,
 *    Luis Alvaz, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Torres_del_Paseo_de_la_Reforma_desde_el_Hotel_Sonder_Aria_03.jpg
 *  - Sobrevuelos_CDMX_HJ2A5055_(40386345631).jpg, Gobierno CDMX, CC0
 *    https://commons.wikimedia.org/wiki/File:Sobrevuelos_CDMX_HJ2A5055_(40386345631).jpg
 *  - Vista_aérea_de_la_Ciudad_de_México_desde_el_Auditorio_Nacional_10.jpg,
 *    ProtoplasmaKid, CC BY 4.0
 *    https://commons.wikimedia.org/wiki/File:Vista_a%C3%A9rea_de_la_Ciudad_de_M%C3%A9xico_desde_el_Auditorio_Nacional_10.jpg
 *  - Torre_Reforma_2016.jpg, Monstruodelinfierno, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Torre_Reforma_2016.jpg
 * Published facts: en/es Wikipedia "Torre Reforma"; Dezeen (27 Jul 2016),
 * designboom and archute descriptions of the form (facts only).
 * Look-only: none. No commercial imagery.
 *
 * Doubts: the west lobes' height (nothing photographed); the facet's
 * lowest point (190 m, between photo and press figures); the sky garden's
 * exact storeys; the base (lobby glazing, Casa Austin in front, not
 * modelled: it is its own OSM building, way/790794464). The slot pattern is
 * a pseudo-random stand-in for the real one, with the photos' density.
 *
 * Review round 1: slots roughly tripled, placed in irregular clusters,
 * denser toward the top and hugging the sloped edge (Valenzuela 1612);
 * bolder louvre/chord bands every two storeys on the glass; bevelled
 * concrete arrises (0.4–0.6 m) at the south wall's corners.
 *
 * Left out: the roof crane, individual louvres, tension rods, mullions.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { panel, save, triangulate, type XY } from './chi-aon-center'

const ANCHOR: [number, number] = [19.424815, -99.17442]
const BEARING = 0
const ROOF = 244
const LOW = 150 // the facet's low corner, at E
const MOD = ROOF / 57 * 4 // a four-storey bracing module

// OSM way/217330154, metres from the anchor.
const A: XY = [-0.94, 37.22], B: XY = [-18.72, 28.46], C: XY = [-9.32, 9.67], D: XY = [-25.38, 1.87]
const E: XY = [-16.08, -17.48], F: XY = [-12.15, -15.93], G: XY = [10.79, -25.99], H: XY = [33.79, -30.54]
const I: XY = [36.33, -35.84], J: XY = [37.03, -35.52], K: XY = [11.62, 12.26]
/** Two points 0.6 m either side of corner c (between p and n): a bevelled arris. */
const bev = (p: XY, c: XY, n: XY, d = 0.6): XY[] => [p, n].map(o => { const l = Math.hypot(o[0] - c[0], o[1] - c[1]); return [c[0] + (o[0] - c[0]) * d / l, c[1] + (o[1] - c[1]) * d / l] as XY })
const TOWER: XY[] = [A, C, E, ...bev(E, F, G), ...bev(F, G, H, 0.4), ...bev(G, H, I), I, J, K]

// The facet plane: 244 m along the ridge A–J, falling to LOW at E.
const U: XY = (() => { const l = Math.hypot(J[0] - A[0], J[1] - A[1]); return [(J[0] - A[0]) / l, (J[1] - A[1]) / l] })()
const dist = (p: XY) => (p[0] - A[0]) * U[1] - (p[1] - A[1]) * U[0] // toward E is positive
const DE = dist(E)
const top = (p: XY) => Math.min(ROOF, ROOF - (ROOF - LOW) * Math.max(0, dist(p)) / DE)

/** A wall from a to b, from z0 up to the facet. */
function wallTo(p: Part, a: XY, b: XY, z0 = 0) {
  p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], top(b)], [a[0], a[1], top(a)])
}

/** A square-section member of width w from P to Q. */
function beam(p: Part, P: V3, Q: V3, w: number, h = w) {
  const d: V3 = [Q[0] - P[0], Q[1] - P[1], Q[2] - P[2]], l = Math.hypot(...d), t: V3 = [d[0] / l, d[1] / l, d[2] / l]
  const ref: V3 = Math.abs(t[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const cr = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  const nz = (a: V3): V3 => { const m = Math.hypot(...a); return [a[0] / m, a[1] / m, a[2] / m] }
  const u = nz(cr(t, ref)), v = cr(t, u)
  const sec = (S: V3) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [S[0] + u[0] * a * w / 2 + v[0] * b * h / 2, S[1] + u[1] * a * w / 2 + v[1] * b * h / 2, S[2] + u[2] * a * w / 2 + v[2] * b * h / 2] as V3)
  const s0 = sec(P), s1 = sec(Q)
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; p.quad(s0[i], s0[j], s1[j], s1[i]) }
  p.quad(s1[0], s1[1], s1[2], s1[3])
  p.quad(s0[3], s0[2], s0[1], s0[0])
}

/** Deterministic pseudo-random numbers, so the slot pattern is stable. */
function rng(seed: number) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32 }
}

function inside(p: XY, r: XY[]) {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    if ((r[i][1] > p[1]) !== (r[j][1] > p[1]) && p[0] < (r[j][0] - r[i][0]) * (p[1] - r[i][1]) / (r[j][1] - r[i][1]) + r[i][0]) c = !c
  }
  return c
}

function build() {
  const concrete = new Part(), glass = new Part(), slot = new Part(), steel = new Part(), roof = new Part()
  const rand = rng(483)

  // --- The concrete walls: E→…→J (south) and J→K→A (north-east).
  for (let i = 2; i < TOWER.length; i++) wallTo(concrete, TOWER[i], TOWER[(i + 1) % TOWER.length])

  // --- The glass face A→C→E, with the sky garden recessed across it.
  const SG0 = 84, SG1 = 96, SGD = 5
  {
    const nrm = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l] } // inward
    const n1 = nrm(A, C), n2 = nrm(C, E), nc: XY = [(n1[0] + n2[0]) / 2, (n1[1] + n2[1]) / 2]
    const off = (p: XY, n: XY): XY => [p[0] + n[0] * SGD, p[1] + n[1] * SGD]
    const A2 = off(A, n1), C2 = off(C, nc), E2 = off(E, n2)
    const q = (p: XY, z: number): V3 => [p[0], p[1], z]
    for (const [a, b, a2, b2] of [[A, C, A2, C2], [C, E, C2, E2]] as XY[][]) {
      glass.quad(q(a, 0), q(b, 0), q(b, SG0), q(a, SG0))
      wallTo(glass, a, b, SG1)
      slot.quad(q(a2, SG0), q(b2, SG0), q(b2, SG1), q(a2, SG1)) // the dark inner wall
      slot.quad(q(a, SG0), q(b, SG0), q(b2, SG0), q(a2, SG0)) // garden floor, facing up (dark: reads as a dark band)
      slot.quad(q(a, SG1), q(a2, SG1), q(b2, SG1), q(b, SG1)) // soffit, facing down
    }
    concrete.quad(q(A, SG0), q(A, SG1), q(A2, SG1), q(A2, SG0)) // end cheeks
    concrete.quad(q(E, SG0), q(E2, SG0), q(E2, SG1), q(E, SG1))
    // The steel V across the garden that the photos show (night view).
    const mid = (p: XY, r: XY): V3 => [(p[0] + r[0]) / 2, (p[1] + r[1]) / 2, 0]
    const m = (p: XY, r: XY, z: number): V3 => { const v = mid(p, r); return [v[0], v[1], z] }
    beam(steel, m(A, A2, SG1), m(C, C2, SG0 + 0.4), 1.0)
    beam(steel, m(C, C2, SG0 + 0.4), m(E, E2, SG1), 1.0)
  }


  // Concrete edge piers framing the glass at both ends (the walls' ends).
  for (const [a, b, s0, s1] of [[A, C, 0, 1.8], [C, E, Math.hypot(E[0] - C[0], E[1] - C[1]) - 1.8, Math.hypot(E[0] - C[0], E[1] - C[1])]] as [XY, XY, number, number][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o: XY = [u[1], -u[0]]
    const P = (s: number, out: number): XY => [a[0] + u[0] * s + o[0] * out, a[1] + u[1] * s + o[1] * out]
    const r: XY[] = [P(s0, 0), P(s0, 0.6), P(s1, 0.6), P(s1, 0)]
    // Bevelled pier: three faces, top following the facet.
    const zt = (p: XY) => top(p) - 0.2
    for (let k = 0; k < 3; k++) {
      const p0 = r[k], p1 = r[k + 1]
      concrete.quad([p0[0], p0[1], 0], [p1[0], p1[1], 0], [p1[0], p1[1], zt(p1)], [p0[0], p0[1], zt(p0)])
    }
    concrete.quad([r[0][0], r[0][1], zt(r[0])], [r[1][0], r[1][1], zt(r[1])], [r[2][0], r[2][1], zt(r[2])], [r[3][0], r[3][1], zt(r[3])])
  }

  // --- The bracing: a chord every module and a zigzag diagonal in each
  // module on each half of the face, standing 0.5 m proud of the glass.
  const halves: [XY, XY][] = [[A, C], [C, E]]
  halves.forEach(([a, b], hi) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o: XY = [u[1], -u[0]]
    const P = (s: number, z: number, out = 0.55): V3 => [a[0] + u[0] * s + o[0] * out, a[1] + u[1] * s + o[1] * out, z]
    const zTop = (s: number) => top([a[0] + u[0] * s, a[1] + u[1] * s]) - 0.6
    // How far along the face the facet is above z.
    const reach = (z: number) => { let s = L; while (s > 0 && zTop(s) < z) s -= 0.25; return s }
    for (let k = 1; k * MOD < ROOF; k++) {
      const z = k * MOD
      if (z > SG0 - 1 && z < SG1 + 1) continue
      const s1 = Math.min(L - 2, reach(z + 0.5)), s0 = hi === 0 ? 2 : 0.3
      if (s1 - s0 < 2) continue
      beam(steel, P(s0, z), P(s1, z), 1.0, 1.7) // bold chord with its louvre band
      // The louvre band between chords, two storeys up.
      const zm = z - MOD / 2
      if (zm > 4 && !(zm > SG0 - 1 && zm < SG1 + 1)) {
        const t1 = Math.min(L - 2, reach(zm + 0.5))
        if (t1 - s0 > 2) beam(steel, P(s0, zm, 0.45), P(t1, zm, 0.45), 0.7, 1.0)
      }
    }
    for (let k = 0; (k + 1) * MOD < ROOF; k++) {
      const z0 = k * MOD + 0.6, z1 = (k + 1) * MOD - 0.6
      if (z1 > SG0 - 1 && z0 < SG1 + 1) continue
      const s0 = hi === 0 ? 2.2 : 0.6, s1 = hi === 0 ? L - 0.6 : L - 2.2
      const up = (k + hi) % 2 === 0
      const sa = up ? s0 : s1, sb = up ? s1 : s0
      if (zTop(sb) < z1 || zTop(sa) < z0) continue
      beam(steel, P(sa, z0), P(sb, z1), 0.8)
    }
  })

  // --- The facet: the whole plan lifted onto the sloped plane.
  for (const [a, b, c] of triangulate(TOWER)) {
    const v = (p: XY): V3 => [p[0], p[1], top(p)]
    concrete.tri(v(TOWER[a]), v(TOWER[b]), v(TOWER[c]))
  }

  // --- Slots: horizontal openings in irregular clusters, rows every two
  // storeys, denser toward the top and along the sloped edge (Valenzuela).
  const ROW = ROOF / 57 * 2
  /** Clustered intervals along a row of length L: [s0, s1] pairs, no overlaps. */
  const clusters = (L: number, n: number): [number, number][] => {
    const out: [number, number][] = []
    for (let c = 0; c < n; c++) {
      let s = 1.5 + rand() * (L - 3)
      const k = 1 + Math.floor(rand() * 3)
      for (let j = 0; j < k; j++) {
        const len = 1.8 + rand() * 4.2, s1 = s + len
        if (s1 > L - 1.5) break
        if (!out.some(([a, b]) => s < b + 0.6 && s1 > a - 0.6)) out.push([s, s1])
        s = s1 + 0.7 + rand() * 1.2
      }
    }
    return out
  }
  // On the walls: the south wall and the NE wall.
  for (let i = 2; i < TOWER.length; i++) {
    const a = TOWER[i], b = TOWER[(i + 1) % TOWER.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 10) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const zAt = (s: number) => top([a[0] + u[0] * s, a[1] + u[1] * s])
    for (let z = 10; z < ROOF - 3; z += ROW) {
      const dens = 0.5 + 2.2 * (z / ROOF) ** 2
      for (const [s0, s1] of clusters(L, Math.round(dens * L / 12 + rand() * 0.8))) {
        const room = Math.min(zAt(s0), zAt(s1)) - z
        if (room < 2.5) continue
        panel(slot, a, b, s0, s1, z, z + 1.3, 0.06)
      }
      // Extra slots hugging the sloped edge, as in the photo.
      const edge = Array.from({ length: 20 }, (_, k) => (k + 0.5) * L / 20).find(s => zAt(s) - z > 2.5 && zAt(s) - z < 9)
      if (edge !== undefined && rand() < 0.75) {
        const s0 = Math.max(1.5, Math.min(L - 6, edge - 2 + rand() * 2)), s1 = s0 + 2 + rand() * 3
        if (Math.min(zAt(s0), zAt(s1)) - z > 2.5) panel(slot, a, b, s0, s1, z, z + 1.3, 0.07)
      }
    }
  }
  // On the facet: rows along the ridge (level lines of the plane), denser near the ridge.
  {
    const n: V3 = (() => { // the facet's upward normal
      const k = (ROOF - LOW) / DE
      const g: V3 = [U[1] * k, -U[0] * k, 1] // z falls toward E: the normal leans toward E
      const m = Math.hypot(...g); return [g[0] / m, g[1] / m, g[2] / m]
    })()
    const dir: XY = [U[1], -U[0]] // toward E, in plan
    const P = (s: number, d: number): V3 => {
      const x = A[0] + U[0] * s + dir[0] * d, y = A[1] + U[1] * s + dir[1] * d
      return [x + n[0] * 0.06, y + n[1] * 0.06, top([x, y]) + n[2] * 0.06]
    }
    const L = Math.hypot(J[0] - A[0], J[1] - A[1])
    const dd = 1.3 * DE / (ROOF - LOW) // a 1.3 m tall slot, measured along the slope
    for (let d = 1.5; d < DE - 2; d += ROW * DE / (ROOF - LOW)) {
      const dens = 2.6 - 1.6 * d / DE
      for (const [s0, s1] of clusters(L, Math.round(dens * L / 12 + rand()))) {
        const corners: XY[] = [[s0, d], [s1, d], [s1, d + dd], [s0, d + dd]].map(([s, e]) => [A[0] + U[0] * s + dir[0] * e, A[1] + U[1] * s + dir[1] * e] as XY)
        const clear = corners.every(p => [[1.2, 0], [-1.2, 0], [0, 1.2], [0, -1.2]].every(([dx, dy]) => inside([p[0] + dx, p[1] + dy], TOWER)))
        if (!clear) continue
        slot.quad(P(s0, d + dd), P(s1, d + dd), P(s1, d), P(s0, d))
      }
    }
  }

  // --- The low lobes on the west side (estimated 8 m), concrete with a roof.
  for (const lobe of [[A, B, C], [C, D, E]] as XY[][]) {
    for (let i = 0; i < 2; i++) concrete.quad([lobe[i][0], lobe[i][1], 0], [lobe[i + 1][0], lobe[i + 1][1], 0], [lobe[i + 1][0], lobe[i + 1][1], 8], [lobe[i][0], lobe[i][1], 8])
    for (const [a, b, c] of triangulate(lobe)) roof.tri([lobe[a][0], lobe[a][1], 8], [lobe[b][0], lobe[b][1], 8], [lobe[c][0], lobe[c][1], 8])
  }

  return [
    { part: concrete, material: finish('reforma-concrete', 0xd6d3cc) },
    { part: glass, material: { ...PALETTE.window, color: 0x74828e } },
    { part: slot, material: windowVariant(2, 0x56636e) },
    { part: steel, material: finish('reforma-steel', 0xa3a9ad) },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('mexico-city-torre-reforma', 'Torre Reforma', ANCHOR, BEARING, build(), 6500)
