/**
 * Torre Ejecutiva Pemex (Marina Nacional 329, 1984, Pedro Moctezuma Díaz
 * Infante), Mexico City — original procedural geometry, CC0-1.0.
 * bun generators/mexico-city-torre-pemex.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/181713097,
 * 19.439073,-99.174897. The outline's long faces run at 122° / 302°, so
 * the catalog bearing is 32 and the slab's long axis is this frame's x.
 *
 * Identity, in order: the tall plain slab of dark olive-bronze reflective
 * glass, 66 × 34 m, nothing but height; the deep dark slot down the middle
 * of each narrow end, full height; the two open mechanical floors that cut
 * dark bands with diagonal bracing across the long faces at about 45% and
 * 78% of the height; the dark octagonal penthouse on the roof under its
 * wide, overhanging helipad deck, painted green on top.
 *
 * Evidence:
 *  - plan: OSM outline way/181713097, a 66.2 × 34.4 m rectangle; the
 *    penthouse is OSM way/1185609790, an elongated octagon 43 × 28 m.
 *  - height: 211.3 m architectural, 51 floors (published: Wikipedia en/es,
 *    CTBUH). OSM tags 211 on the slab part way/1187396041 and 220 on the
 *    penthouse; no photo shows anything 9 m above the helipad but masts,
 *    so 211 m is taken to the helipad deck. The slab's roof at 197 m and
 *    the penthouse are photo-scaled on Sandoval Sida's level telephoto
 *    (penthouse ≈ 14 m against the 66 m face).
 *  - the end slots: ≈ 22% of the end face, centred, full height (Carlos
 *    Valenzuela, TorreDePemex1907p1; Sandoval Sida).
 *  - mechanical floors: two open storeys with diagonal braces, 42 m and
 *    108 m below the roof (Sandoval Sida, Valenzuela 1907p1), spanning the
 *    long faces short of the corners. Estimated from those photos.
 *  - colour: the glass reads dark olive-bronze in daylight (#5c5d51 here,
 *    held just above STYLE's charcoal limit since the dark colour is its
 *    identity); the slots, mechanical floors and penthouse darker, at the
 *    charcoal limit #4a4f57; the helipad green from Mariordo's aerials.
 *
 * Terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s); the
 * site is on the flat lake-bed basin (~2,240 m). Modelled level, elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Torre_ejecutiva_de_PEMEX.jpg, Omar David Sandoval Sida, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Torre_ejecutiva_de_PEMEX.jpg
 *  - TorreDePemex1907p1.jpg, Carlos Valenzuela, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:TorreDePemex1907p1.jpg
 *  - Aerial_view_Torre_Pemex_03_2014_MEX_7827.JPG and _7828.JPG, Mariordo
 *    (Mario Roberto Durán Ortiz), CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Aerial_view_Torre_Pemex_03_2014_MEX_7827.JPG
 *    https://commons.wikimedia.org/wiki/File:Aerial_view_Torre_Pemex_03_2014_MEX_7828.JPG
 *  - Torre_Pemex_(5).jpg, Eneas, CC BY 2.0 (night)
 *    https://commons.wikimedia.org/wiki/File:Torre_Pemex_(5).jpg
 *  - Torre_de_Pemex_1.jpg, ProtoplasmaKid, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Torre_de_Pemex_1.jpg
 * Look-only: none. No commercial imagery.
 *
 * Doubts: the slab-roof / penthouse split (197 / 211 m) is photo-scaled;
 * the mechanical-floor heights are estimated; the slot depth (2 m) is a
 * guess from oblique views. The lower ~20 floors read a little lighter in
 * some photos (lighter spandrels); not modelled.
 *
 * Left out: the PEMEX logo and the anniversary banner, mullions, the
 * helipad railing and masts, the annex buildings (separate OSM buildings).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, panel, save, triangulate, walls, type XY } from './chi-aon-center'

const ANCHOR: [number, number] = [19.439073, -99.174897]
const BEARING = 32
const HX = 33.1, HY = 17.2 // half the slab
const ROOF = 197, DECK = 211
const SLOT_W = 3.8, SLOT_D = 2.0 // half-width and depth of the end slots
const MECH = [[86.5, 91.5], [152.5, 157.5]] as const

/** A quad turned to face along n, whatever order its corners come in. */
function face(p: Part, q: V3[], n: V3) {
  const u = q[1].map((v, k) => v - q[0][k]), w = q[2].map((v, k) => v - q[0][k])
  const c = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]]
  const [a, b, cc, d] = c[0] * n[0] + c[1] * n[1] + c[2] * n[2] >= 0 ? q : [q[3], q[2], q[1], q[0]]
  p.quad(a, b, cc, d)
}
const ccw = (r: XY[]) => {
  const a = r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  return a < 0 ? r.slice().reverse() : r
}

function build() {
  const glass = new Part(), frame = new Part(), dark = new Part(), roof = new Part(), pad = new Part()

  // The slab: a rectangle with a slot cut into the middle of each end,
  // corners chamfered 0.5 m.
  const C = 0.5
  const plan: XY[] = [
    [-HX + C, -HY], [HX - C, -HY], [HX, -HY + C],
    [HX, -SLOT_W], [HX - SLOT_D, -SLOT_W], [HX - SLOT_D, SLOT_W], [HX, SLOT_W],
    [HX, HY - C], [HX - C, HY], [-HX + C, HY], [-HX, HY - C],
    [-HX, SLOT_W], [-HX + SLOT_D, SLOT_W], [-HX + SLOT_D, -SLOT_W], [-HX, -SLOT_W],
    [-HX, -HY + C],
  ]
  // Walls by edge: slot walls dark, the rest glass; split at the mechanical floors.
  const isSlot = (a: XY, b: XY) => Math.abs(Math.abs(a[0]) - (HX - SLOT_D)) < 1e-6 || Math.abs(Math.abs(b[0]) - (HX - SLOT_D)) < 1e-6
  for (let i = 0; i < plan.length; i++) {
    const a = plan[i], b = plan[(i + 1) % plan.length]
    const longFace = Math.abs(a[1] - b[1]) < 1e-6 && Math.abs(Math.abs(a[1]) - HY) < 1e-6
    const p = isSlot(a, b) ? dark : glass
    if (!longFace) { p.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], ROOF], [a[0], a[1], ROOF]); continue }
    // Long faces: glass, with the mechanical floors recessed 1.2 m between x = ±(HX - 2.5).
    let z0 = 0
    for (const [m0, m1] of MECH) {
      p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], m0], [a[0], a[1], m0])
      z0 = m1
    }
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], ROOF], [a[0], a[1], ROOF])
  }
  // The mechanical floors: a dark recess in each long face with V braces.
  for (const s of [-1, 1]) {
    const E = HX - 2.5, D = 1.2, y = s * HY, yi = s * (HY - D)
    for (const [m0, m1] of MECH) {
      // Glass fills either end of the band beyond the recess.
      for (const [x0, x1] of [[-HX + C, -E], [E, HX - C]]) {
        face(glass, [[x0, y, m0], [x1, y, m0], [x1, y, m1], [x0, y, m1]], [0, s, 0])
      }
      // Back wall, soffit, sill and the two end returns.
      face(dark, [[-E, yi, m0], [E, yi, m0], [E, yi, m1], [-E, yi, m1]], [0, s, 0])
      face(dark, [[-E, y, m1], [E, y, m1], [E, yi, m1], [-E, yi, m1]], [0, 0, -1])
      face(dark, [[-E, y, m0], [E, y, m0], [E, yi, m0], [-E, yi, m0]], [0, 0, 1])
      face(dark, [[-E, y, m0], [-E, yi, m0], [-E, yi, m1], [-E, y, m1]], [1, 0, 0])
      face(dark, [[E, y, m0], [E, yi, m0], [E, yi, m1], [E, y, m1]], [-1, 0, 0])
      // V braces: bold diagonal members across the opening.
      const n = 6, step = (2 * E) / n, w = 0.7, yb = s * (HY - 0.5)
      for (let k = 0; k < n; k++) {
        const xa = -E + k * step, xb = xa + step / 2, xc = xa + step
        for (const [p0, p1] of [[[xa, m1], [xb, m0]], [[xb, m0], [xc, m1]]] as [XY, XY][]) {
          const dx = p1[0] - p0[0], dz = p1[1] - p0[1], l = Math.hypot(dx, dz)
          const nx = -dz / l * w / 2, nz = dx / l * w / 2
          const q = (x: number, z: number, yy: number): V3 => [x, yy, z]
          const P = [q(p0[0] + nx, p0[1] + nz, yb), q(p1[0] + nx, p1[1] + nz, yb), q(p1[0] - nx, p1[1] - nz, yb), q(p0[0] - nx, p0[1] - nz, yb)]
          face(frame, P, [0, s, 0])
        }
      }
    }
  }

  // Bronze frame lines on the glass: floor groups every three storeys and
  // a column line every ~8 m, set on the face.
  const FL = ROOF / 51
  const bandZ: number[] = []
  for (let z = 3 * FL * 2; z < ROOF - 3; z += 3 * FL) if (!MECH.some(([m0, m1]) => z > m0 - 2 && z < m1 + 2)) bandZ.push(z)
  for (let i = 0; i < plan.length; i++) {
    const a = plan[i], b = plan[(i + 1) % plan.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 10 || isSlot(a, b)) continue
    const longFace = L > 40
    for (const z of bandZ) panel(frame, a, b, 0.2, L - 0.2, z - 0.35, z + 0.35, 0.05)
    const nb = longFace ? 8 : 2
    for (let k = 1; k < nb; k++) {
      const s = (L * k) / nb
      let z0 = 0
      for (const [m0, m1] of longFace ? MECH : []) { panel(frame, a, b, s - 0.3, s + 0.3, z0, m0, 0.05); z0 = m1 }
      panel(frame, a, b, s - 0.3, s + 0.3, z0, ROOF - 1.6, 0.05)
    }
  }

  // Parapet: a dark coping band at the top, roof sunk inside it.
  for (let i = 0; i < plan.length; i++) {
    const a = plan[i], b = plan[(i + 1) % plan.length]
    dark.quad([a[0], a[1], ROOF - 1.6], [b[0], b[1], ROOF - 1.6], [b[0], b[1], ROOF], [a[0], a[1], ROOF])
  }
  {
    // Top of the coping between the outline (with slots) and the inner ring.
    const ring = ccw(plan)
    // The roof deck at ROOF - 0.9 over the whole plan, then a coping lip.
    for (const [x, y, z] of triangulate(ring)) roof.tri([ring[x][0], ring[x][1], ROOF - 0.9], [ring[y][0], ring[y][1], ROOF - 0.9], [ring[z][0], ring[z][1], ROOF - 0.9])
    for (let i = 0; i < plan.length; i++) {
      const a = plan[i], b = plan[(i + 1) % plan.length]
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [-(b[1] - a[1]) / l * 0.6, (b[0] - a[0]) / l * 0.6]
      const a2: XY = [a[0] + n[0], a[1] + n[1]], b2: XY = [b[0] + n[0], b[1] + n[1]]
      dark.quad([a[0], a[1], ROOF], [b[0], b[1], ROOF], [b2[0], b2[1], ROOF], [a2[0], a2[1], ROOF])
      dark.quad([b2[0], b2[1], ROOF], [a2[0], a2[1], ROOF], [a2[0], a2[1], ROOF - 0.9], [b2[0], b2[1], ROOF - 0.9])
    }
  }

  // The penthouse (OSM way/1185609790, made symmetric): dark walls up to
  // the helipad deck, which overhangs it by 2.5 m all round.
  const oct = (hx: number, hy: number, c: number): XY[] => ccw([[-hx + c, -hy], [hx - c, -hy], [hx, -hy + c * 0.55], [hx, hy - c * 0.55], [hx - c, hy], [-hx + c, hy], [-hx, hy - c * 0.55], [-hx, -hy + c * 0.55]])
  const pent = oct(21.4, 14.0, 10.6)
  walls(dark, pent, ROOF - 0.9, DECK - 2.4)
  const deck = oct(23.9, 16.5, 11.8)
  // Deck underside, edge (bevelled) and green top.
  cap(dark, deck, DECK - 2.4, false)
  walls(dark, deck, DECK - 2.4, DECK - 0.4)
  const deckTop = deck.map(([x, y]) => [x * 0.985, y * 0.98] as XY)
  walls(dark, deck, DECK - 0.4, DECK, deckTop)
  cap(pad, deckTop, DECK)
  // Penthouse glazing band, set on its walls.
  for (let i = 0; i < pent.length; i++) {
    const a = pent[i], b = pent[(i + 1) % pent.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    panel(glass, a, b, 0.8, L - 0.8, ROOF + 2.5, DECK - 4.4, 0.05)
  }

  return [
    { part: glass, material: { ...PALETTE.window, color: 0x5c5d51 } },
    { part: frame, material: finish('pemex-bronze', 0x77705e) },
    { part: dark, material: finish('pemex-dark', 0x4a4f57) },
    { part: roof, material: PALETTE.roof },
    { part: pad, material: finish('pemex-helipad', 0x7aa08e) },
  ]
}

if (import.meta.main) await save('mexico-city-torre-pemex', 'Torre Ejecutiva Pemex', ANCHOR, BEARING, build(), 5000)
