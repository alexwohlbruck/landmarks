/**
 * Palacio Postal (Quinta Casa de Correos; Eje Central Lázaro Cárdenas at
 * Tacuba, 1902–1907, Adamo Boari, structure Gonzalo Garita), Mexico City —
 * original procedural geometry, CC0-1.0.
 * bun generators/mexico-city-palacio-postal.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/157051114,
 * 19.435630,-99.140290. Its walls run at 9.3° / 99.3°, so the catalog
 * bearing is 9.3 and the model is square to its own frame: about 44 × 73 m,
 * its west front on Eje Central, its north front on Tacuba, the main
 * entrance in the chamfered north-west corner.
 *
 * Identity, in order: the pale pinkish chiluca stone block, four storeys
 * under a continuous top gallery of small arches and a deep cornice with
 * cresting; the corner pavilions rising a storey above the cresting, the
 * chamfered north-west one carrying the clock over the entrance canopy;
 * the arched ground-floor openings and the framed windows of the upper
 * floors in a steady ~5.2 m rhythm; the glazed roof over the central hall.
 *
 * Evidence:
 *  - plan: OSM way/157051114 (traced from SIGCDMX), squared up: the
 *    projecting pavilions at the south-west, south-east and north-east
 *    corners and the 8 m chamfer at the north-west are OSM's.
 *  - heights: no published height (es Wikipedia: "cuatro niveles"). Photo-
 *    scaled on Thomas Ledl's corner view (Palacio_Postal_Version_2.jpg) by
 *    OSM's 8 m chamfer, which faces the camera (19 px/m): ground storey
 *    ~6 m, gallery 18.7–21.6 m, cornice ~22.4 m, cresting ~23.6 m, the
 *    corner tower ~27 m, the clock at ~21 m. The south-west pavilion reads
 *    ~1.2 × the wing's height in Juan Carlos Fonseca Mata's view along Eje
 *    Central (it rises about a storey and a half over the gallery there):
 *    ~30 m. All estimates.
 *  - bays: ~11 bays along the Eje Central front between the pavilions in
 *    Ledl's and Fonseca's views (~5.2 m); the gallery's arches about three
 *    to a bay.
 *  - the central hall's glass roof: interior views (the "cubo de luz",
 *    Palacio Postal, CC BY 4.0; Diego Delso DD 49); its size and position
 *    are estimates.
 *  - colour: chiluca, a warm pale pinkish grey in daylight, pulled to the
 *    palette's lightness. At night the fronts are floodlit (Ledl, dusk
 *    views), so the stone carries `floodlight`.
 *  - terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s); the
 *    Centro sits on the flat lake-bed basin (~2,240 m). Modelled level.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Palacio_Postal_Version_2.jpg, Thomas Ledl, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Palacio_Postal_Version_2.jpg
 *  - Palacio_Postal,_Centro_Histórico,_Ciudad_de_México_-_Eje_Central.jpg,
 *    Juan Carlos Fonseca Mata, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Palacio_Postal,_Centro_Hist%C3%B3rico,_Ciudad_de_M%C3%A9xico_-_Eje_Central.jpg
 *  - Palacio_Postal_-_Mexico_2024.jpg, José Luiz, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Palacio_Postal_-_Mexico_2024.jpg
 *  - Palacio_Postal,_México_D.F.,_México,_2013-10-16,_DD_49.JPG, Diego
 *    Delso, CC BY-SA 3.0 (interior)
 *  - Vista_cubo_de_luz_del_Palacio_Postal.jpg, Palacio Postal, CC BY 4.0
 *    https://commons.wikimedia.org/wiki/File:Vista_cubo_de_luz_del_Palacio_Postal.jpg
 * Look-only: none. No commercial imagery.
 *
 * Left out: the carved window surrounds and twisted columns, the
 * cresting's fretwork (drawn as a band with merlons), the flagpole, the
 * lamp standards.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, rect, save, walls, type XY } from './chi-aon-center'
import { wall } from './mexico-city-casa-de-los-azulejos'

const ANCHOR: [number, number] = [19.43563, -99.14029]
const BEARING = 9.3

const GAL0 = 18.7, GAL1 = 21.6, CORN = 22.4, CREST = 23.6

// The outline, squared up from OSM, counter-clockwise from the chamfer.
const O: XY[] = [
  [-23.1, 30.8], [-21.8, 29.5], [-21.8, -29.4], [-22.9, -29.4], [-22.9, -36.9], [-15.3, -36.9], [-15.3, -33.9],
  [14.3, -33.9], [14.3, -36.7], [21.8, -36.7], [21.8, 36.0], [14.9, 36.0], [14.9, 34.9], [-16.0, 34.9], [-17.3, 36.4],
]

function build() {
  const stone = new Part(), win = new Part(), roof = new Part(), glass = new Part(), metal = new Part(), trim = new Part()

  /** A dark opening on wall a→b: width w centred at s, from z0 up to a semicircular head. */
  const arch = (a: XY, b: XY, s: number, w: number, z0: number, z1: number, out = 0.05) => {
    const { P } = wall(a, b), r = w / 2, n = w < 2.0 ? 6 : 8
    win.quad(P(s - r, z0, out), P(s + r, z0, out), P(s + r, z1, out), P(s - r, z1, out))
    const c = P(s, z1, out)
    for (let k = 0; k < n; k++) {
      const t0 = (k / n) * Math.PI, t1 = ((k + 1) / n) * Math.PI
      win.tri(c, P(s + r * Math.cos(t0), z1 + r * Math.sin(t0), out), P(s + r * Math.cos(t1), z1 + r * Math.sin(t1), out))
    }
  }
  /** A box standing proud of wall a→b. */
  const proud = (p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, o0: number, o1: number, bevel = 0) => {
    if (bevel > 0) return block(p, p, wall(a, b).ring(s0, s1, o0, o1), z0, z1, bevel)
    // Front, ends, top and underside only: the back is inside the wall.
    const { P } = wall(a, b)
    p.quad(P(s0, z0, o1), P(s1, z0, o1), P(s1, z1, o1), P(s0, z1, o1))
    p.quad(P(s1, z0, o1), P(s1, z0, o0), P(s1, z1, o0), P(s1, z1, o1))
    p.quad(P(s0, z0, o0), P(s0, z0, o1), P(s0, z1, o1), P(s0, z1, o0))
    p.quad(P(s0, z1, o1), P(s1, z1, o1), P(s1, z1, o0), P(s0, z1, o0))
    if (z0 > 0.05) p.quad(P(s0, z0, o0), P(s1, z0, o0), P(s1, z0, o1), P(s0, z0, o1))
  }
  /** Whether a point lies on the outline (so a wall there faces the street). */
  const onOutline = (q: XY) => O.some((a, i) => {
    const b = O[(i + 1) % O.length], dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy
    const t = Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / l2))
    return Math.hypot(a[0] + t * dx - q[0], a[1] + t * dy - q[1]) < 0.3
  })

  // The body to the cornice, roofed.
  walls(stone, O, 0, CORN)
  cap(roof, O, CORN)

  // Bands round every wall: the plinth, string courses, the sill of the
  // gallery, and the deep cornice; the cresting over it with a merlon
  // every ~3.4 m. The chamfer carries the tower instead.
  for (let i = 0; i < O.length; i++) {
    if (i === O.length - 1) continue // the chamfer (last → first)
    const a = O[i], b = O[(i + 1) % O.length], { L } = wall(a, b)
    if (L > 3.5) {
      proud(stone, a, b, 0, L, 0, 0.9, -0.01, 0.2)
      proud(stone, a, b, 0, L, 6.2, 6.7, -0.01, 0.3)
      proud(stone, a, b, 0, L, 16.6, 17.2, -0.01, 0.35)
      proud(stone, a, b, 0, L, GAL0 - 0.4, GAL0, -0.01, 0.3)
    }
    proud(trim, a, b, 0, L, GAL1, CORN, -0.01, 0.9, 0.2)
    proud(trim, a, b, 0.6, L - 0.6, CORN, CORN + 0.75, -0.2, 0.15)
    if (L > 4) {
      const n = Math.round(L / 3.4)
      for (let k = 0; k < n; k++) {
        const s = ((k + 0.5) * L) / n
        proud(trim, a, b, s - 0.35, s + 0.35, CORN + 0.75, CREST, -0.2, 0.15)
      }
    }
    // The gallery: small round-headed arches, two or three to a bay.
    if (L > 3) {
      const n = Math.round(L / 2.4)
      for (let k = 0; k < n; k++) arch(a, b, ((k + 0.5) * L) / n, 1.4, GAL0 + 0.3, GAL1 - 1.2)
    }
  }

  // Main fronts: window bays between the pavilions. [a, b, s0, s1]: the
  // stretch of wall a→b that carries bays.
  const fronts: [XY, XY, number, number][] = [
    [[-21.8, 29.5], [-21.8, -29.4], 4.5, 58.9], // west, Eje Central (from the tower to the SW pavilion)
    [[-15.3, -33.9], [14.3, -33.9], 0, 29.6], // south
    [[21.8, -36.7], [21.8, 36.0], 7.6, 64.8], // east
    [[14.9, 34.9], [-16.0, 34.9], 0, 25.4], // north, Tacuba (to the tower)
  ]
  for (const [a, b, s0, s1] of fronts) {
    const n = Math.max(1, Math.round((s1 - s0) / 5.2)), w = (s1 - s0) / n
    for (let k = 0; k < n; k++) {
      const s = s0 + (k + 0.5) * w
      arch(a, b, s, 2.2, 0.9, 4.6) // ground storey
      arch(a, b, s, 1.6, 7.6, 10.2) // first floor
      arch(a, b, s, 1.6, 12.4, 14.8) // second floor
      // The upper windows' stone hoods.
      proud(trim, a, b, s - 1.2, s + 1.2, 15.6, 16.0, -0.01, 0.25)
    }
  }

  // The corner pavilions: a storey over the cresting, their own cornice and
  // merlons, twin arched windows on each face at every level.
  const pavilion = (r: XY[], top: number) => {
    walls(stone, r, CORN, top - 1.0)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], { L } = wall(a, b)
      proud(trim, a, b, 0, L, top - 1.0, top - 0.3, -0.01, 0.6, 0.15)
      for (const s of [0.5, L - 0.5]) proud(trim, a, b, s - 0.4, s + 0.4, top - 0.3, top + 1.3, -0.4, 0.4)
      proud(trim, a, b, L / 2 - 0.35, L / 2 + 0.35, top - 0.3, top + 0.9, -0.3, 0.3)
      proud(trim, a, b, 0.9, L - 0.9, top - 0.3, top + 0.3, -0.3, 0.2)
      if (L < 5) continue
      const street = onOutline([(a[0] + b[0]) / 2 + (b[1] - a[1]) / L * 0.0, (a[1] + b[1]) / 2])
      for (const s of [L / 2 - 1.0, L / 2 + 1.0]) {
        if (street) {
          arch(a, b, s, 1.1, 7.8, 10.2)
          arch(a, b, s, 1.1, 12.6, 14.8)
        }
        arch(a, b, s, 1.1, CORN + 1.0, top - 2.8)
      }
      if (street) arch(a, b, L / 2, 2.6, 0.9, 4.4)
    }
    cap(roof, r, top - 0.3)
  }
  pavilion(rect(-22.9, -36.9, -15.3, -29.4), 30.0) // south-west, the tallest
  pavilion(rect(14.3, -36.7, 21.8, -29.2), 27.0) // south-east
  pavilion(rect(14.9, 28.5, 21.8, 36.0), 27.0) // north-east

  // The north-west tower on the chamfer: a polygon over the corner, the
  // clock and entrance on its diagonal face.
  const T: XY[] = [[-21.8, 24.5], [-16.5, 24.5], [-12.0, 29.0], [-12.0, 34.9], [-16.0, 34.9], [-17.3, 36.4], [-23.1, 30.8], [-21.8, 29.5]]
  const TOP = 27.2
  walls(stone, T, CORN, TOP - 1.0)
  {
    for (let i = 0; i < T.length; i++) {
      const a = T[i], b = T[(i + 1) % T.length], { L } = wall(a, b)
      proud(trim, a, b, 0, L, TOP - 1.0, TOP - 0.3, -0.01, 0.6, 0.15)
      const n = Math.max(1, Math.round(L / 1.6))
      for (let k = 0; k < n; k++) {
        const s = ((k + 0.5) * L) / n
        proud(trim, a, b, s - 0.3, s + 0.3, TOP - 0.3, TOP + 0.9, -0.3, 0.2)
      }
    }
    cap(roof, T, TOP - 0.3)
    // Pinnacles at the chamfer's two ends.
    for (const [x, y] of [[-23.1, 30.8], [-17.3, 36.4]] as XY[]) block(trim, trim, rect(x - 0.6, y - 0.6, x + 0.6, y + 0.6), TOP - 1.0, TOP + 2.0, 0.2)
  }
  const ch: [XY, XY] = [[-17.3, 36.4], [-23.1, 30.8]]
  {
    const { L, P } = wall(ch[0], ch[1]), m = L / 2
    // The tall arched entrance, its metal-and-glass canopy, the window
    // stack over it and the clock in its square frame.
    arch(ch[0], ch[1], m, 3.2, 0, 4.2)
    proud(metal, ch[0], ch[1], m - 2.4, m + 2.4, 5.4, 6.0, 0, 2.4, 0.1)
    proud(stone, ch[0], ch[1], 0, L, 0, 0.9, -0.01, 0.2)
    proud(stone, ch[0], ch[1], 0, L, 16.6, 17.2, -0.01, 0.35)
    arch(ch[0], ch[1], m, 2.4, 7.6, 10.4)
    for (const s of [m - 0.8, m + 0.8]) arch(ch[0], ch[1], s, 1.2, 12.4, 15.0)
    proud(trim, ch[0], ch[1], m - 1.9, m + 1.9, 18.6, 22.4, -0.01, 0.3, 0.1)
    const c = P(m, 20.5, 0.34), n = 16, r = 1.35
    for (let k = 0; k < n; k++) {
      const t0 = (k / n) * 2 * Math.PI, t1 = ((k + 1) / n) * 2 * Math.PI
      win.tri(c, P(m + r * Math.cos(t0), 20.5 + r * Math.sin(t0), 0.34), P(m + r * Math.cos(t1), 20.5 + r * Math.sin(t1), 0.34))
    }
    for (const s of [m - 1.1, m + 1.1]) arch(ch[0], ch[1], s, 1.1, CORN + 0.9, TOP - 3.0)
  }

  // The glass roof over the central hall (size and place estimated).
  {
    const x0 = -9, x1 = 9, y0 = -12, y1 = 12, z0 = CORN, z1 = CORN + 2.6, cx = 0
    walls(stone, rect(x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3), z0, z0 + 0.6)
    glass.quad([x0, y1, z0 + 0.6], [x0, y0, z0 + 0.6], [cx, y0, z1], [cx, y1, z1])
    glass.quad([x1, y0, z0 + 0.6], [x1, y1, z0 + 0.6], [cx, y1, z1], [cx, y0, z1])
    glass.tri([x0, y0, z0 + 0.6], [x1, y0, z0 + 0.6], [cx, y0, z1])
    glass.tri([x1, y1, z0 + 0.6], [x0, y1, z0 + 0.6], [cx, y1, z1])
  }

  // Floodlit fronts at night: the stone's walls, brighter up high.
  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.55 + 0.45 * Math.min(1, p[2] / 28))
  return [
    // Chiluca: a pale pinkish grey (#c8b4a3 in the photos' daylight).
    { part: stone, material: { ...finish('chiluca', 0xdcc4b2), floodlight: lit } },
    { part: trim, material: finish('chiluca-trim', 0xeedccb) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: glass, material: PALETTE.glass },
    { part: metal, material: finish('canopy-bronze', 0x8a7a5e) },
  ]
}

if (import.meta.main) await save('mexico-city-palacio-postal', 'Palacio Postal', ANCHOR, BEARING, build(), 6500)
