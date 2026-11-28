/**
 * Kenyatta International Convention Centre (KICC), Nairobi (Karl Henrik
 * Nøstvik with David Mutiso, 1967-73): procedural, CC0-1.0.
 * bun generators/nairobi-kicc.ts
 *
 * Writes two levels of detail in the same frame and materials:
 * - models/nairobi-kicc.glb (low): the podium, the 16-sided tower of
 *   projecting terracotta floor bands round a glazed core, the saucer crown
 *   with its helipad deck and viewing drum, the amphitheatre's faceted cone
 *   roof on its flared skirt and raking struts;
 * - models/nairobi-kicc.detail.glb: the same, plus the undersides of the
 *   floor bands, the dark slots between the band panels at each facet
 *   corner (the "fluted" look), the crown's underside ribs, the
 *   amphitheatre roof's ridge ribs, and the podium's deck balustrades.
 *
 * Frame: origin at the area centroid of the OSM outline way/1577485374
 * (36.823138, -1.288583; the podium part way/1553682723 is the same ring).
 * Bearing 333.6: the outline's edges run at 333.6 / 63.9 degrees, so model
 * +y runs up the north wing and +x along the podium (east-north-east).
 *
 * OSM (2025): outline way/1577485374 (building=yes) and the podium part
 * way/1553682723 (10 m, 1 level); the tower way/123414928 (103 m, 33
 * levels, 23 m across with eight notches); the crown way/1396270912
 * (103-105 m, 32.8 m across); the amphitheatre way/123414930 (cone,
 * 10-25 m, 34 m across).
 *
 * Heights. Published: roof height 105 m, 28 floors to the top occupied
 * floor, the revolving restaurant at the top, the helipad crown
 * (en.wikipedia "Kenyatta International Convention Centre"). Measured from
 * photos, scaled by the crown's 32.8 m (OSM, traced from above, the
 * trustworthy plan dimension): the tower is 1.22 times narrower than the
 * crown in the level telephoto p3, so 27 m across (OSM's 23 m tower part
 * is too narrow); the floor bands are 0.11 of the width apart (3.0 m); 27
 * banded floors from 12 m to 93 m over a dark recessed base, the
 * restaurant's taller glazing at 94.4-97 m, the saucer from 98 m to its
 * rim at 101.6 m, the deck at 102.6 m and the viewing drum to 105 m
 * (published). Facets: the band panels are 0.39 of the radius wide at the
 * centre of p3 (16 sides). The spandrel is about half the floor (p9).
 * Amphitheatre: OSM's 34 m ring; the rim at 16-18 m, the roof's break at
 * 22.5 m and the apex at 31 m from p8 and p10, scaled by the ring (OSM's
 * 25 m roof height reads low against both photos); the skirt narrows to
 * 16 m across at the podium deck (10 m, OSM). Podium: 10 m (OSM), two
 * storeys of glazing under cantilevered decks (p2, p10). Estimated: the
 * band projection (0.8 m), the depth of the podium's recesses, the
 * viewing drum's radius (11 m, p3).
 *
 * Ground: the map's terrain here exists only at z12 (Mapterhorn z13-z15
 * return 404), about 38 m a pixel, and wanders 1.5-8 m across the
 * footprint, more than the site really slopes (the photos show the
 * courtyard and Harambee Avenue nearly level). The podium is built flat to
 * y = 0; on the coarse terrain its higher parts sink a few metres, as the
 * map draws it. Elevation 0.
 *
 * Colours, from daylight photos: the bands are a light terracotta (dusty
 * rose #775752 in overcast p9, #b4a59c to #e7d4b4 in low sun p8), pulled
 * to a pale pinkish #be958a; the glazing is grey-reflective (`window`); the saucer and the
 * amphitheatre's rim fascia are dark brown (#1e1918-#22150e in shadow,
 * kept dark as the crown's signature, #5e4c46); the amphitheatre roof is
 * a rust/copper brown, clearly warmer and darker than the tower's
 * bands (#bc8057 to #cd9061 in sun in p8, #937e68 in p6 and #b8a390 in
 * the overcast close-up p10, where it looks weathered), #9e6340; the podium and the
 * amphitheatre's underside are warm grey concrete; the helipad deck
 * `roof` grey and the viewing drum dark (p3).
 *
 * Night: the tower's band panels are washed by floodlights (often in
 * colour; `_FLOODLIGHT` on the terracotta, strongest low down), the office
 * and restaurant glazing glows (`window`).
 *
 * Simplified or left out: the window mullions, the podium's ramps and
 * stairs, the flagpoles, the helipad's railings and dishes, the courtyard,
 * the eight shallow notches of OSM's tower ring (no photo shows them as
 * more than the slots between the band panels).
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - p1 "Kenyatta International Convention Centre 07.jpg", Francis Akuka for the Wikimedia Foundation, CC0
 *   https://commons.wikimedia.org/wiki/File:Kenyatta_International_Convention_Centre_07.jpg
 * - p2 "Kenyatta International Convention Centre 02.jpg", Francis Akuka for the Wikimedia Foundation, CC0 (courtyard)
 *   https://commons.wikimedia.org/wiki/File:Kenyatta_International_Convention_Centre_02.jpg
 * - p3 "Kenyatta International Convention Centre.jpg", Francis Akuka for the Wikimedia Foundation, CC0 (level telephoto, main ruler)
 *   https://commons.wikimedia.org/wiki/File:Kenyatta_International_Convention_Centre.jpg
 * - p8 "Kenyatta International Convention Centre, Nairobi, by Karl Henrik Nøstvik architect, general.jpg", IndicibleEspace, CC BY-SA 4.0 (from the north-west, the whole group)
 *   https://commons.wikimedia.org/wiki/File:Kenyatta_International_Convention_Centre,_Nairobi,_by_Karl_Henrik_N%C3%B8stvik_architect,_general.jpg
 * - p9 "Jomo Kenyatta Statue and KICC.jpg", Jnncreatives, CC BY-SA 4.0 (overcast; band colour, crown underside)
 *   https://commons.wikimedia.org/wiki/File:Jomo_Kenyatta_Statue_and_KICC.jpg
 * - p10 "Kenyatta International Convention Centre - BugWarp (6).jpg", BugWarp, CC BY-SA 4.0 (the amphitheatre)
 *   https://commons.wikimedia.org/wiki/File:Kenyatta_International_Convention_Centre_-_BugWarp_(6).jpg
 * - p12 "Lascar Kenyatta International Conference Center (4522598390).jpg", Jorge Láscar, CC BY 2.0 (from the courtyard)
 *   https://commons.wikimedia.org/wiki/File:Lascar_Kenyatta_International_Conference_Center_(4522598390).jpg
 * - p5 "The Kenyatta International Convention Centre Amphitheatre.jpg", Giluwa, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:The_Kenyatta_International_Convention_Centre_Amphitheatre.jpg
 * Look-only: none.
 *
 * Doubts: the tower's diameter is photo-scaled from the crown (no published
 * figure); the floor count of the banded shaft (27) is counted from photos
 * and may be off by one; the amphitheatre's heights; the podium's height
 * and its south and east faces (OSM's 10 m, few photos of them); the
 * north wing's roof terraces are drawn as one flat deck.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe, quad, save, TAU, type Mat } from './cairo-cairo-tower'
import { ccw, offsetRing, fquad, type XY } from './casablanca-hassan-ii-mosque'
import { polyTris } from './berlin-oberbaum-bridge'

// ───────────────────────────── plan (model frame) ─────────────────────────────

/** The podium outline, OSM way/1553682723 in the model frame, with jogs under 3 m dropped. */
const PODIUM: XY[] = ccw([
  [18.6, 57.5], [18.6, 8.2], [-83, 8.2], [-83, -28.2], [7.5, -28.2], [7.5, -23.3], [23, -23.3],
  [23, -30.7], [36.2, -30.7], [36.2, -42], [53.9, -42], [53.9, 57.5],
])
const PODIUM_H = 10

const TX = -15.6, TY = -9.2 // tower axis (OSM tower and crown rings agree within 0.6 m)
const NF = 16 // facets
const PH = TAU / NF / 2 // a flat facet faces the model's +x
const R_BAND = 13.5, R_CORE = 12.7
const Z_BAND0 = 12, PITCH = 3.0, FLOORS = 27, SPAN = 1.75
const Z_TOPBAND = Z_BAND0 + FLOORS * PITCH // 93
const Z_REST = Z_TOPBAND + 1.4, Z_REST_TOP = 95.6, Z_CAP = 96.4
const R_RIM = 16.4, Z_RIM = 101.8, Z_DECK = 102.8, R_DRUM = 11, Z_DRUM = 104.4, Z_TOP = 105

const AX = -62.6, AY = -9.0 // amphitheatre axis (OSM)
const NA = 16
const A_RIM = 17.0, A_SKIRT_R = 8, A_Z_SKIRT = 11, A_Z_RIM0 = 17.5, A_Z_RIM1 = 19.3
const A_BREAK_R = 10, A_Z_BREAK = 24.5, A_Z_APEX = 34

// ───────────────────────────── materials ─────────────────────────────

const flood = (z0: number, z1: number) => (p: V3, n: V3) => {
  if (n[1] > 0.7) return 0.15 // map frame: y is up; tops barely lit
  const t = Math.min(1, Math.max(0, (p[1] - z0) / (z1 - z0)))
  return 0.85 - 0.45 * t
}

const M = {
  terracotta: { ...finish('kicc-terracotta', 0xbe958a), floodlight: flood(10, 100) } as MaterialSpec,
  window: PALETTE.window as MaterialSpec,
  crown: finish('kicc-crown', 0x5e4c46) as MaterialSpec,
  concrete: finish('kicc-concrete', 0xb8ae9f) as MaterialSpec,
  amph: finish('kicc-amphitheatre-roof', 0x9e6340) as MaterialSpec,
  roof: PALETTE.roof as MaterialSpec,
}

// ───────────────────────────── helpers ─────────────────────────────

/** A polygon ring at height z, facing up or down. */
function capRing(p: Part, ring: XY[], z: number, up: boolean) {
  for (const [a, b, c] of polyTris(ring)) {
    if (up) p.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
    else p.tri([a[0], a[1], z], [c[0], c[1], z], [b[0], b[1], z])
  }
}
/** The walls of a counter-clockwise ring from z0 to z1. */
function walls(p: Part, ring: XY[], z0: number, z1: number) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}
/**
 * Window bays along every edge of a ring, `off` proud of it, inset `e` from
 * each corner: panels about `bay` wide with `pier` of wall between them.
 */
function bandPanels(p: Part, ring: XY[], z0: number, z1: number, e: number, bay = 7.5, pier = 1.2, off = 0.05) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 2 * e + 1) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * off, a[1] + u[1] * s + n[1] * off, z]
    const nb = Math.max(1, Math.round((L - 2 * e + pier) / (bay + pier)))
    const w = (L - 2 * e - (nb - 1) * pier) / nb
    for (let k = 0; k < nb; k++) {
      const s0 = e + k * (w + pier)
      fquad(p, P(s0, z0), P(s0 + w, z0), P(s0 + w, z1), P(s0, z1), [n[0], n[1], 0])
    }
  }
}
/** A slanted square strut from a to b, half-width w (no end caps). */
function strut(p: Part, a: V3, b: V3, w: number) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const L = Math.hypot(...d)
  const t: V3 = [d[0] / L, d[1] / L, d[2] / L]
  let s: V3 = [-t[1], t[0], 0]
  const sl = Math.hypot(...s) || 1
  s = [s[0] / sl, s[1] / sl, 0]
  const v: V3 = [t[1] * s[2] - t[2] * s[1], t[2] * s[0] - t[0] * s[2], t[0] * s[1] - t[1] * s[0]]
  const c = (o: V3, i: number): V3 => {
    const k = [[1, 1], [-1, 1], [-1, -1], [1, -1]][i]
    return [o[0] + (s[0] * k[0] + v[0] * k[1]) * w, o[1] + (s[1] * k[0] + v[1] * k[1]) * w, o[2] + (s[2] * k[0] + v[2] * k[1]) * w]
  }
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const mid: V3 = [(s[0] * ([1, -1, -1, 1][i] + [1, -1, -1, 1][j]) + v[0] * ([1, 1, -1, -1][i] + [1, 1, -1, -1][j])),
      (s[1] * ([1, -1, -1, 1][i] + [1, -1, -1, 1][j]) + v[1] * ([1, 1, -1, -1][i] + [1, 1, -1, -1][j])),
      (s[2] * ([1, -1, -1, 1][i] + [1, -1, -1, 1][j]) + v[2] * ([1, 1, -1, -1][i] + [1, 1, -1, -1][j]))]
    fquad(p, c(a, i), c(a, j), c(b, j), c(b, i), mid)
  }
}

// ───────────────────────────── the model ─────────────────────────────

function build(detail: boolean): Mat[] {
  const terr = new Part(), win = new Part(), crown = new Part(), conc = new Part(), amph = new Part(), roof = new Part()

  // ── Podium: two glazed storeys, each under a deck that runs out to the
  // outline; the upper storey set back less than the lower.
  const lower = offsetRing(PODIUM, -1.6), upper = offsetRing(PODIUM, -0.9)
  walls(conc, lower, 0, 4.4)
  bandPanels(win, lower, 0.6, 3.8, 1.2)
  walls(conc, PODIUM, 4.4, 5.3)
  capRing(conc, PODIUM, 4.4, false)
  capRing(conc, PODIUM, 5.3, true)
  walls(conc, upper, 5.3, 9.0)
  bandPanels(win, upper, 5.8, 8.4, 1.0)
  walls(conc, PODIUM, 9.0, PODIUM_H)
  capRing(conc, PODIUM, 9.0, false)
  capRing(conc, PODIUM, PODIUM_H, true)
  if (detail) {
    // deck balustrades: a low solid upstand on each deck edge
    const inner5 = offsetRing(PODIUM, -0.25)
    walls(conc, PODIUM, 5.3, 6.3)
    walls(conc, inner5.slice().reverse(), 5.3, 6.3)
    for (let i = 0; i < PODIUM.length; i++) {
      const a = PODIUM[i], b = PODIUM[(i + 1) % PODIUM.length], c = inner5[(i + 1) % PODIUM.length], d = inner5[i]
      quad(conc, [a[0], a[1], 6.3], [b[0], b[1], 6.3], [c[0], c[1], 6.3], [d[0], d[1], 6.3], [0, 0, 1])
    }
    walls(conc, PODIUM, PODIUM_H, PODIUM_H + 1.0)
    walls(conc, inner5.slice().reverse(), PODIUM_H, PODIUM_H + 1.0)
    for (let i = 0; i < PODIUM.length; i++) {
      const a = PODIUM[i], b = PODIUM[(i + 1) % PODIUM.length], c = inner5[(i + 1) % PODIUM.length], d = inner5[i]
      quad(conc, [a[0], a[1], PODIUM_H + 1], [b[0], b[1], PODIUM_H + 1], [c[0], c[1], PODIUM_H + 1], [d[0], d[1], PODIUM_H + 1], [0, 0, 1])
    }
  }

  // ── Tower. The glazed core, then the projecting band of each floor.
  const lat = (p: Part, prof: [number, number][], n = NF, ph = PH) => lathe(p, TX, TY, prof, n, { facet: true, phase: ph })
  lat(conc, [[R_CORE - 0.6, PODIUM_H], [R_CORE - 0.6, Z_BAND0]]) // the dark recessed base storey
  lat(win, [[R_CORE, Z_BAND0], [R_CORE, Z_CAP]])
  for (let k = 0; k <= FLOORS; k++) {
    const z0 = Z_BAND0 + k * PITCH, z1 = z0 + SPAN
    const prof: [number, number][] = detail ? [[R_CORE, z0], [R_BAND, z0], [R_BAND, z1], [R_CORE, z1]] : [[R_BAND, z0], [R_BAND, z1], [R_CORE, z1]]
    lat(terr, prof)
  }
  // the restaurant's cap band (the restaurant glazing runs Z_REST..Z_REST_TOP)
  lat(terr, detail ? [[R_CORE, Z_REST_TOP], [R_BAND, Z_REST_TOP], [R_BAND, Z_CAP]] : [[R_BAND, Z_REST_TOP], [R_BAND, Z_CAP]])
  if (detail) {
    // the dark slots between the band panels at each facet corner
    for (let i = 0; i < NF; i++) {
      const t = PH + (TAU * i) / NF
      for (let k = 0; k <= FLOORS; k++) {
        const z0 = Z_BAND0 + k * PITCH
        const c: XY = [TX + (R_BAND + 0.04) * Math.cos(t), TY + (R_BAND + 0.04) * Math.sin(t)]
        const n: V3 = [Math.cos(t), Math.sin(t), 0], u: XY = [-Math.sin(t), Math.cos(t)]
        const w = 0.22
        fquad(win, [c[0] - u[0] * w, c[1] - u[1] * w, z0], [c[0] + u[0] * w, c[1] + u[1] * w, z0], [c[0] + u[0] * w, c[1] + u[1] * w, z0 + SPAN], [c[0] - u[0] * w, c[1] - u[1] * w, z0 + SPAN], n)
      }
    }
  }

  // ── Crown: the saucer, its fascia, the helipad deck and the viewing drum.
  lat(crown, [[R_CORE + 0.3, Z_CAP], [R_RIM, Z_RIM], [R_RIM, Z_DECK]])
  lat(roof, [[R_RIM, Z_DECK], [R_DRUM, Z_DECK]])
  lat(crown, [[R_DRUM, Z_DECK], [R_DRUM, Z_TOP]])
  lat(crown, [[R_DRUM, Z_TOP], [R_DRUM - 0.4, Z_TOP], [R_DRUM - 0.4, Z_DRUM], [0, Z_DRUM]])
  if (detail) {
    // the underside ribs, one per facet corner
    for (let i = 0; i < NF; i++) {
      const t = PH + (TAU * i) / NF
      const P = (r: number, z: number): V3 => [TX + r * Math.cos(t), TY + r * Math.sin(t), z]
      const s = (Z_RIM - Z_CAP) / (R_RIM - R_CORE - 0.3)
      strut(conc, P(R_CORE + 0.6, Z_CAP + 0.3 * s - 0.15), P(R_RIM - 0.2, Z_RIM - 0.2 * s - 0.15), 0.16)
    }
  }

  // ── Amphitheatre: glazed drum on the podium deck, the flared skirt on
  // raking struts, the dark rim fascia, and the two-pitch faceted roof.
  const alat = (p: Part, prof: [number, number][]) => lathe(p, AX, AY, prof, NA, { facet: true, phase: TAU / NA / 2 })
  alat(win, [[A_SKIRT_R, PODIUM_H], [A_SKIRT_R, A_Z_SKIRT]])
  alat(conc, [[A_SKIRT_R, A_Z_SKIRT], [A_RIM, A_Z_RIM0]])
  alat(crown, [[A_RIM, A_Z_RIM0], [A_RIM, A_Z_RIM1]])
  alat(amph, [[A_RIM, A_Z_RIM1], [A_BREAK_R, A_Z_BREAK], [0, A_Z_APEX]])
  for (let i = 0; i < NA; i++) {
    const t = (TAU * i) / NA
    const P = (r: number, z: number): V3 => [AX + r * Math.cos(t), AY + r * Math.sin(t), z]
    strut(conc, P(A_SKIRT_R + 2.2, PODIUM_H), P(A_RIM - 2.2, A_Z_RIM0 - 1.6), 0.35)
  }
  if (detail) {
    // ridge ribs up each corner of the roof
    for (let i = 0; i < NA; i++) {
      const t = (TAU * i) / NA
      const P = (r: number, z: number): V3 => [AX + r * Math.cos(t), AY + r * Math.sin(t), z]
      strut(crown, P(A_RIM - 0.1, A_Z_RIM1 + 0.12), P(A_BREAK_R, A_Z_BREAK + 0.12), 0.13)
      strut(crown, P(A_BREAK_R, A_Z_BREAK + 0.12), P(0.4, A_Z_APEX - 0.3), 0.13)
    }
  }

  return [
    { part: terr, material: M.terracotta },
    { part: win, material: M.window },
    { part: crown, material: M.crown },
    { part: conc, material: M.concrete },
    { part: amph, material: M.amph },
    { part: roof, material: M.roof },
  ]
}

if (import.meta.main) {
  const extras = { landmark: 'Kenyatta International Convention Centre', source: 'generators/nairobi-kicc.ts' }
  await save('nairobi-kicc.glb', 'nairobi-kicc', build(false), 5000, 250_000, extras)
  await save('nairobi-kicc.detail.glb', 'nairobi-kicc', build(true), 40_000, 1_500_000, extras)
}
