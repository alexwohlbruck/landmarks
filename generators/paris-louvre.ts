/**
 * Palais du Louvre — procedural, CC0-1.0, no textures.
 * bun generators/paris-louvre.ts
 *
 * The whole palace as one model, since its wings meet above ground: the
 * Cour Carrée block, the Richelieu and Denon wings round the Cour Napoléon,
 * the Rivoli wing and the Grande Galerie running west to the Pavillons de
 * Marsan and de Flore. The Arc du Carrousel, the Pyramid (its own model,
 * paris-louvre-pyramid) and the underground Carrousel du Louvre are not part
 * of it.
 *
 * Frame: x along the Cour Napoléon axis (bearing 110.5°), y along 20.5°;
 * placement bearing 20.5°. Measured from OSM: the Denon wing's court face
 * runs at 110.4°, the Richelieu wing's at 110.2–111.0°, the Pyramid's sides
 * at 110.2–110.7° and 20.0–21.1°, the Cour Carrée at 107.5–110° / 17.3–20.3°.
 * The Rue de Rivoli front is not parallel (116°), so the Rivoli and
 * Richelieu wings' north faces are drawn on that line, skewed in the frame.
 * Anchor: the area centroid of relation/3262297, lng 2.33585, lat 48.861021.
 * Plan numbers below are metres in that frame from lng 2.3359, lat 48.8610,
 * shifted by (OX, OY) onto the anchor.
 *
 * Covers and replaces: the outline relation/3262297 (outer way/53813362 and
 * its court inners), the glazed courts' building=roof ways Cour Marly
 * 53814919, Cour Puget 53814914, Cour Khorsabad 53814916 and Cour Visconti
 * 53814917, and every building:part inside it: Aile Turgot 457462581, the
 * Lescot wing's roof parts 1195559065–1195559069, the Horloge 1195559070 and
 * 1215702805, the Grande Galerie's roof parts 1209881911–1209881919,
 * Pavillons de Lesdiguières 1359877259 and de La Trémoille 1359877261, the
 * Grands Guichets 1359877260, Grande Galerie occidentale 1359877263, Aile de
 * Flore 1359877262, Pavillons de Flore 979394058 and de Marsan 979394057,
 * 1209823909, and the passage part 338651869 at the Cour Carrée's NE corner.
 *
 * Evidence
 * - OSM (measured): the outline and courts above (cadastre-derived); plan
 *   of every wing, court and pavilion position read off it in the frame.
 *   No heights are tagged on the palace parts (building:levels 3–5 only).
 * - Photos (Wikimedia Commons, all evidence licences):
 *   · "Louvre Paris from top.jpg", Matthias Kabel, CC BY-SA 3.0 — aerial from
 *     the north: plan, the glazed courts, which pavilions carry square domes
 *     (Richelieu, Denon, Horloge) and which tall truncated roofs (the end
 *     pavilions of the Cour Napoléon, Rohan, Flore, Marsan, Trémoille,
 *     Lesdiguières); the Cour Carrée's flat roofs.
 *     https://commons.wikimedia.org/wiki/File:Louvre_Paris_from_top.jpg
 *   · "Musée du Louvre along the Quai François Mitterrand (Panorama)
 *     (22287914199).jpg", Jorge Láscar, CC BY 2.0 — the Seine front:
 *     Grande Galerie mansard about 40% of its wall, the Guichets pavilions,
 *     the Denon dome behind, the flat-topped Cour Carrée south front.
 *     https://commons.wikimedia.org/wiki/File:Mus%C3%A9e_du_Louvre_along_the_Quai_Fran%C3%A7ois_Mitterrand_(Panorama)_(22287914199).jpg
 *   · "Louvre Cour Carrée June 2010.jpg", King of Hearts, CC BY-SA 3.0 — the
 *     Lescot wing and the Pavillon de l'Horloge from the east wing; heights
 *     scaled on the facade plane (the court is 122 m wide in OSM, 8.1 px/m).
 *     https://commons.wikimedia.org/wiki/File:Louvre_Cour_Carr%C3%A9e_June_2010.jpg
 *   · "Pavillon de l'Horloge, Musée du Louvre in July 2022.jpg", DiscoA340,
 *     CC BY-SA 4.0 — the square dome's profile: flat top 0.58 of the base,
 *     height 0.44 of the base width, a crest on top.
 *     https://commons.wikimedia.org/wiki/File:Pavillon_de_l%27Horloge,_Mus%C3%A9e_du_Louvre_in_July_2022.jpg
 *   · "Pavillon de Flore from the Tuileries Garden, Paris 5 November 2019.jpg",
 *     Ali Sabbagh, CC0 — Flore's steep truncated roof and four chimney
 *     stacks; its 30 m face = 303 px gives cornice ~20–21 m, roof ~15 m.
 *     https://commons.wikimedia.org/wiki/File:Pavillon_de_Flore_from_the_Tuileries_Garden,_Paris_5_November_2019.jpg
 *   · "Cour Napoléon seen from the pavillon de l'Horloge, Louvre 8 July
 *     2016.jpg", Tangopaso, public domain — the court fronts and pavilions.
 *     https://commons.wikimedia.org/wiki/File:Cour_Napol%C3%A9on_seen_from_the_pavillon_de_l%27Horloge,_Louvre_8_July_2016.jpg
 *   · "Louvre Museum Wikimedia Commons.jpg", Benh LIEU SONG, CC BY-SA 3.0 —
 *     the court at dusk: floodlit stone, dark roofs (the night look).
 *     https://commons.wikimedia.org/wiki/File:Louvre_Museum_Wikimedia_Commons.jpg
 *   · "Louvre toits.JPG", Jebulon, CC BY-SA 3.0 — the Colonnade and the Cour
 *     Carrée's flat roofs behind their balustrades.
 *     https://commons.wikimedia.org/wiki/File:Louvre_toits.JPG
 * - No lidar (France; IGN products not used). Mapterhorn terrain: the
 *   lowest ground under the footprint is the Colonnade's dry moat (28.5 m);
 *   the streets and courts round the palace are 5.4–7 m higher (the
 *   Carrousel and Rivoli ~5.6, the Cour Carrée ~7, the quai ~4–6), so every
 *   height is measured from G = 5.6 m and the walls run down to y = 0, as
 *   the moat side really does.
 * - Estimated heights above the street (from the photos above; no published
 *   figures found): Napoleon III court wings cornice 20 m, mansard 28 m;
 *   Lefuel's west wings 19/27 m; Grande Galerie 18/25.5 m with a glazed ridge
 *   lantern (OSM tags its roof parts glass); Cour Carrée north, south and
 *   east wings 26.5 m flat with a balustrade; Lescot wing 24/31 m; Horloge
 *   body 33 m, dome to 46 m; Richelieu and Denon body 27 m, domes to 42 m;
 *   end pavilions 24/37 m; Rohan and Bibliothèque 22/35 m; Trémoille and
 *   Lesdiguières 23/38 m; Flore and Marsan 22/38 m, chimneys to ~41 m.
 * - Simplified: window panels one per pair of bays, two rows (arcade,
 *   storeys grouped) or three on the Lescot wing; no dormers, sculpture,
 *   pilasters or balustrade detail; the Colonnade's paired columns are one
 *   pale pier per pair before windows; courts under glass are hidden and
 *   drawn as glass hips at cornice height; the Pavillon de la Bibliothèque's
 *   place on the Rivoli front is inferred from the Richelieu cross range.
 * - Doubts: no photo checked of the Rivoli front or of the Rohan and
 *   Bibliothèque pavilions; the end pavilions' plan size is estimated; the
 *   pavilions' names follow the usual layout (Turgot, Richelieu, Colbert to
 *   the north; Mollien, Denon, Daru to the south) without an official plan.
 * - Night: the stone and trim carry _FLOODLIGHT on their walls (the palace
 *   is floodlit), roofs barely; windows and the arched passages glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { qf, tf, save } from './dc-white-house'

type XY = [number, number]

// ---- Frame. Plan coordinates below are metres in the turned frame (x along
// the palace axis, bearing 110.5°; y along 20.5°) measured from lng 2.3359,
// lat 48.8610; the anchor (the outline's area centroid) sits at (-4.26,
// 0.92) in that frame, so every point is shifted by (OX, OY).
const OX = 4.26, OY = -0.92
const P = (x: number, y: number): XY => [x + OX, y + OY]

// ---- Ground. y = 0 is the lowest map ground under the footprint (the
// Colonnade's dry moat); the streets and courts round the palace stand G
// higher, and every height below is measured from them.
export const G = 5.6

const stone = new Part(), trim = new Part(), slate = new Part(), win = new Part(), glass = new Part(), door = new Part()

// ===========================================================================
// Polygon kit (convex polygons, plan coordinates already shifted).

function area(p: XY[]) {
  let a = 0
  for (let i = 0; i < p.length; i++) { const q = p[i], r = p[(i + 1) % p.length]; a += q[0] * r[1] - r[0] * q[1] }
  return a / 2
}
const ccw = (p: XY[]) => (area(p) > 0 ? p : [...p].reverse())
/** Offset a convex CCW polygon outward by d (inward if negative). */
function offset(p: XY[], d: number): XY[] {
  const n = p.length
  const lines = p.map((a, i) => {
    const b = p[(i + 1) % n]
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
    const nx = dy / l, ny = -dx / l
    return { a: [a[0] + nx * d, a[1] + ny * d] as XY, dx, dy }
  })
  return p.map((_, i) => {
    const L1 = lines[(i - 1 + n) % n], L2 = lines[i]
    const den = L1.dx * L2.dy - L1.dy * L2.dx
    if (Math.abs(den) < 1e-9) return L2.a
    const t = ((L2.a[0] - L1.a[0]) * L2.dy - (L2.a[1] - L1.a[1]) * L2.dx) / den
    return [L1.a[0] + L1.dx * t, L1.a[1] + L1.dy * t] as XY
  })
}
const ring = (p: XY[], z: number): V3[] => p.map(([x, y]) => [x, y, z] as V3)
function inside(pt: XY, poly: XY[]) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
/** Short sides of a quad-ish polygon: its half-width, for clamping insets. */
function halfWidth(p: XY[]) {
  let m = Infinity
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length]
    m = Math.min(m, Math.hypot(b[0] - a[0], b[1] - a[1]))
  }
  return m / 2
}
function prism(part: Part, p: XY[], z0: number, z1: number, top: Part | false = part) {
  part.loft([ring(p, z0), ring(p, z1)])
  if (top) top.cap(ring(p, z1), true)
}
const rectXY = (x0: number, x1: number, y0: number, y1: number): XY[] => [P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1)]

// ===========================================================================
// Masses.

type Roof = 'mansard' | 'flat' | 'steep' | 'dome' | 'none'
type Mass = {
  name: string
  p: XY[] // shifted, CCW
  C: number // cornice above the street
  T: number // roof top above the street
  roof: Roof
  rows: [number, number][] // window rows above the street
  pitch: number
  topGlass?: boolean // a glazed ridge lantern (the galleries' skylights)
  facade?: boolean // false: no window panels (hidden faces)
  chimneys?: boolean
}
const masses: Mass[] = []
const courts: XY[][] = [] // glazed courts: walls facing them are hidden under glass
const add = (m: Omit<Mass, 'p'> & { p: XY[] }) => { const mm = { ...m, p: ccw(m.p) }; masses.push(mm); return mm }
const quad = (pts: [number, number][]) => pts.map(([x, y]) => P(x, y))
/** The Rue de Rivoli front: one straight line from Marsan to the Cour Carrée. */
const yN = (x: number) => 173.2 - 0.0974 * (x + 351)

// Window rows (above the street) for each family of wings.
const ROWS_N3: [number, number][] = [[1.4, 6.2], [8.2, 16.8]] // Napoleon III / Lefuel wings: arcade, two storeys grouped
const ROWS_GAL: [number, number][] = [[1.2, 5.6], [7.4, 15.0]] // Grande Galerie: ground floor, mezzanine + gallery
const ROWS_CC: [number, number][] = [[1.6, 7.6], [10.0, 22.8]] // Cour Carrée: ground floor, giant-order storeys
const ROWS_LES: [number, number][] = [[1.6, 7.6], [9.6, 15.2], [17.0, 21.6]] // Lescot wing: arcade, piano nobile, attic

const N3 = { C: 20, T: 28, roof: 'mansard' as Roof, rows: ROWS_N3, pitch: 8.6 }
const LEF = { C: 19, T: 27, roof: 'mansard' as Roof, rows: ROWS_N3, pitch: 8.6 }
const GAL = { C: 18, T: 25.5, roof: 'mansard' as Roof, rows: ROWS_GAL, pitch: 8.2, topGlass: true }
const CC = { C: 26.5, T: 27.6, roof: 'flat' as Roof, rows: ROWS_CC, pitch: 8.6 }

// ---- North arm: the Rivoli wing, Marsan to the Richelieu wing.
add({ name: 'rivoli-west', p: quad([[-353, 142], [-230, 132], [-229, yN(-229)], [-351, yN(-351)]]), ...LEF })
add({ name: 'rivoli-east', p: quad([[-229, 140], [-90, 127], [-90, yN(-90)], [-229, yN(-229)]]), ...LEF })

// ---- Richelieu wing round its three glazed courts.
add({ name: 'richelieu-south', p: quad([[-90, 61], [121, 61], [121, 82], [-90, 82]]), ...N3 })
add({ name: 'richelieu-north', p: quad([[-90, yN(-90) - 21], [111, yN(111) - 21], [111, yN(111)], [-90, yN(-90)]]), ...N3 })
add({ name: 'richelieu-x1', p: quad([[-90, 82], [-71, 82], [-71, 127], [-90, 127]]), ...N3, facade: false })
add({ name: 'richelieu-x2', p: quad([[-14, 82], [8, 82], [8, 122], [-14, 122]]), ...N3, facade: false })
add({ name: 'richelieu-x3', p: quad([[64.4, 82], [78, 82], [78, 119], [64.4, 119]]), ...N3, facade: false })
add({ name: 'richelieu-x4', p: quad([[97.6, 75], [111, 75], [111, 110], [97.6, 110]]), ...N3 })
courts.push(quad([[-71, 82.5], [-13.6, 82.5], [-13.6, 125.4], [-71, 125.4]])) // Cour Marly
courts.push(quad([[8.3, 81.4], [64.4, 81.4], [64.4, 117.8], [8.3, 117.8]])) // Cour Puget
courts.push(quad([[77.9, 81.9], [97.6, 81.9], [97.6, 110.9], [77.9, 110.9]])) // Cour Khorsabad

// ---- Denon wing and the Grande Galerie's eastern half (Galerie du Bord de l'Eau).
add({ name: 'denon-north', p: quad([[-92, -85], [125, -85], [125, -62], [-92, -62]]), ...N3 })
add({ name: 'galerie-east', p: quad([[-112, -140.5], [113, -137], [113, -125], [-112, -127]]), ...GAL })
add({ name: 'denon-x1', p: quad([[-92, -127], [-72, -127], [-72, -85], [-92, -85]]), ...N3, facade: false })
add({ name: 'denon-x2', p: quad([[-17, -127], [9, -127], [9, -85], [-17, -85]]), ...N3, facade: false })
add({ name: 'denon-x3', p: quad([[63, -127], [72, -127], [72, -85], [63, -85]]), ...N3, facade: false })
add({ name: 'denon-x4', p: quad([[92, -137], [114, -137], [114, -77], [92, -77]]), ...N3 })
courts.push(quad([[72, -117], [92, -117], [92, -86], [72, -86]])) // Cour du Sphinx

// ---- Grande Galerie, west of the Denon wing.
add({ name: 'galerie-guichets', p: quad([[-159, -143], [-125, -143], [-125, -127], [-159, -127]]), ...LEF, C: 21, T: 29 })
add({ name: 'galerie-west', p: quad([[-255, -141.5], [-171, -142], [-171, -110], [-255, -110]]), ...LEF, C: 20, T: 28 })
add({ name: 'aile-de-flore', p: quad([[-353, -144], [-255, -141.5], [-255, -123], [-352, -125]]), ...LEF })

// ---- Cour Carrée.
add({ name: 'cc-south', p: quad([[125, -87], [292, -82], [292, -61], [125, -61]]), ...CC })
add({ name: 'cc-east', p: quad([[270, -82], [289.5, -82], [289.5, 92], [270, 92]]), ...CC })
add({ name: 'cc-north', p: quad([[114, 66], [287, 66], [287, 80], [114, 80]]), ...CC })
add({ name: 'cc-west', p: quad([[125, -62], [143, -62], [143, 67], [125, 67]]), C: 24, T: 31, roof: 'mansard', rows: ROWS_LES, pitch: 7.6, topGlass: true })

// ---- Pavilions.
type Pav = { name: string; r: [number, number, number, number]; body: number; top: number; roof: Roof; rows: [number, number][]; pitch: number; chimneys?: boolean }
const pavs: Pav[] = [
  // Steep truncated roofs with chimney stacks: Flore and Marsan, the ends of the arms.
  { name: 'flore', r: [-380, -352, -152, -122], body: 22, top: 38, roof: 'steep', rows: [[1.5, 7.0], [8.8, 18.6]], pitch: 7.0, chimneys: true },
  { name: 'marsan', r: [-353, -330, 141, 172.5], body: 22, top: 38, roof: 'steep', rows: [[1.5, 7.0], [8.8, 18.6]], pitch: 7.0, chimneys: true },
  // The Grande Galerie's pavilions either side of the Grands Guichets.
  { name: 'tremoille', r: [-171.5, -158, -145, -125], body: 23, top: 38, roof: 'steep', rows: ROWS_N3, pitch: 7.6 },
  { name: 'lesdiguieres', r: [-125, -112, -144, -124], body: 23, top: 38, roof: 'steep', rows: ROWS_N3, pitch: 7.6 },
  // Rivoli front: Pavillon de Rohan and the Pavillon de la Bibliothèque.
  { name: 'rohan', r: [-128, -102, 126, yN(-115)], body: 22, top: 35, roof: 'steep', rows: ROWS_N3, pitch: 7.6 },
  { name: 'bibliotheque', r: [-16, 10, 121, yN(-3)], body: 22, top: 35, roof: 'steep', rows: ROWS_N3, pitch: 7.6 },
  // Cour Napoléon: square domes on the centre pavilions (Richelieu, Denon),
  // steep roofs on the end pavilions (Turgot, Mollien to the west; Colbert,
  // Daru to the east).
  { name: 'richelieu', r: [-16, 10, 58.5, 86], body: 27, top: 42, roof: 'dome', rows: [[1.4, 6.2], [8.2, 16.8], [18.6, 23.4]], pitch: 7.6 },
  { name: 'denon', r: [-17, 10, -88, -59.5], body: 27, top: 42, roof: 'dome', rows: [[1.4, 6.2], [8.2, 16.8], [18.6, 23.4]], pitch: 7.6 },
  { name: 'turgot', r: [-92, -68, 59.5, 86], body: 24, top: 37, roof: 'steep', rows: ROWS_N3, pitch: 7.6 },
  { name: 'mollien', r: [-93, -69, -88, -60.5], body: 24, top: 37, roof: 'steep', rows: ROWS_N3, pitch: 7.6 },
  { name: 'colbert', r: [90, 114, 57.5, 84], body: 24, top: 37, roof: 'steep', rows: ROWS_N3, pitch: 7.6 },
  { name: 'daru', r: [88, 115, -88, -58.5], body: 24, top: 37, roof: 'steep', rows: ROWS_N3, pitch: 7.6 },
  // Cour Carrée: the Pavillon de l'Horloge (Sully) and the Lescot wing's corner pavilions.
  { name: 'horloge', r: [121, 148, -10, 10], body: 33, top: 46, roof: 'dome', rows: [[1.6, 7.6], [9.6, 15.2], [17.0, 21.6], [24.5, 30.5]], pitch: 6.0 },
  { name: 'roi', r: [122, 146, -88, -61], body: 26.5, top: 32, roof: 'dome', rows: ROWS_CC, pitch: 7.0 },
  { name: 'beauvais', r: [112, 146, 63, 80.5], body: 26.5, top: 32, roof: 'dome', rows: ROWS_CC, pitch: 7.0 },
]
const pavMasses = pavs.map((v) => add({ name: v.name, p: rectXY(...v.r), C: v.body, T: v.top, roof: v.roof, rows: v.rows, pitch: v.pitch, chimneys: v.chimneys }))

// ===========================================================================
// Build.

const occluders = () => [...masses.map((m) => m.p), ...courts]

function walls(m: Mass) {
  prism(stone, m.p, 0, G + m.C - 1.2, false)
  // Cornice: a projecting band with a bevelled top lip.
  const c0 = G + m.C - 1.2
  trim.loft([ring(offset(m.p, 0.55), c0), ring(offset(m.p, 0.55), G + m.C - 0.3), ring(offset(m.p, 0.15), G + m.C)])
}

function mansard(m: Mass) {
  const z0 = G + m.C, h = m.T - m.C, hw = halfWidth(m.p)
  const lower = Math.min(0.3 * h, hw - 1.5)
  const upper = Math.min(hw - 0.9, lower + Math.max(2.5, 0.75 * h))
  const b = offset(m.p, 0.15), r1 = offset(m.p, -lower), r2 = offset(m.p, -upper)
  slate.loft([ring(b, z0), ring(r1, z0 + 0.7 * h), ring(r2, z0 + h)])
  if (m.topGlass) {
    // A glazed lantern along the ridge: a low glass hip on the flat top.
    const r3 = offset(r2, -Math.min(0.6, halfWidth(r2) - 0.3))
    glass.loft([ring(r2, z0 + h), ring(r3, z0 + h + 0.9)])
    glass.cap(ring(r3, z0 + h + 0.9), true)
  } else slate.cap(ring(r2, z0 + h), true)
}

function flatRoof(m: Mass) {
  // Perrault's flat roofs behind a balustrade: a parapet band and a low deck.
  const z0 = G + m.C
  trim.loft([ring(offset(m.p, 0.15), z0), ring(offset(m.p, 0.15), z0 + 1.1)])
  const inner = offset(m.p, -0.5)
  trim.loft([ring(inner, z0 + 0.4).reverse(), ring(inner, z0 + 1.1).reverse()])
  // top of the parapet
  const o = ring(offset(m.p, 0.15), z0 + 1.1), i = ring(inner, z0 + 1.1)
  for (let k = 0; k < o.length; k++) { const l = (k + 1) % o.length; trim.quad(i[k], o[k], o[l], i[l]) }
  slate.cap(ring(inner, z0 + 0.4), true)
}

function steep(m: Mass) {
  // A pavilion's tall truncated roof: a slight flare at the eaves, then
  // straight steep slopes to a flat top with a crest.
  const z0 = G + m.C, h = m.T - m.C, hw = halfWidth(m.p)
  const b = offset(m.p, 0.2), r1 = offset(m.p, -0.9), r2 = offset(m.p, -hw * 0.6)
  slate.loft([ring(b, z0), ring(r1, z0 + 1.4), ring(r2, z0 + h - 0.6)])
  // Crest: a dark band and the flat top.
  const r3 = offset(r2, -0.25)
  slate.loft([ring(r2, z0 + h - 0.6), ring(r3, z0 + h)])
  slate.cap(ring(r3, z0 + h), true)
  if (m.chimneys) {
    // Flore and Marsan: four tall stone stacks rising at the corners of the top.
    for (const [x, y] of offset(r2, 0.6)) {
      const s: XY[] = [[x - 1.0, y - 1.0], [x + 1.0, y - 1.0], [x + 1.0, y + 1.0], [x - 1.0, y + 1.0]]
      prism(stone, s, z0 + h - 5, z0 + h + 2.5, false)
      prism(trim, offset(s, 0.25), z0 + h + 2.5, z0 + h + 3.1)
    }
  }
}

function dome(m: Mass) {
  // A square "dôme à l'impériale": quarter-ellipse faces from a vertical
  // start to a flat top 0.58 of the base, read off the Horloge photo; an attic
  // band below it and a dark crest on the top.
  const z0 = G + m.C, h = m.T - m.C, hw = halfWidth(m.p)
  const base = offset(m.p, -1.0)
  const rb = hw - 1.0, a = 0.42 * rb, crest = Math.min(1.8, h * 0.14), hd = h - crest
  // Attic plinth the dome stands on.
  prism(trim, offset(m.p, -0.6), z0, z0 + 0.9)
  const rings: V3[][] = []
  const N = 6
  for (let k = 0; k <= N; k++) {
    const th = (k / N) * (Math.PI / 2)
    const inset = a * (1 - Math.cos(th))
    rings.push(ring(offset(base, -inset), z0 + 0.9 + (hd - 0.9) * Math.sin(th)))
  }
  slate.loft(rings)
  const top = rings[N].map((v) => [v[0], v[1]] as XY)
  // Crest: a dark lead lantern-like block with a pale cap.
  // The crest: a dark lead cresting round the flat top, narrower than it.
  const c = offset(top, -Math.min(1.6, halfWidth(top) * 0.3))
  slate.cap(ring(top, z0 + hd), true)
  prism(slate, c, z0 + hd, z0 + h)
}

// Windows: one panel per pair of bays, per row, on every exposed face.
function facade(m: Mass) {
  if (m.facade === false) return
  const others = occluders().filter((q) => q !== m.p)
  const n = m.p.length
  for (let i = 0; i < n; i++) {
    const a = m.p[i], b = m.p[(i + 1) % n]
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy)
    if (L < 6) continue
    const ux = dx / L, uy = dy / L, nx = uy, ny = -ux
    const count = Math.max(1, Math.floor((L - 2.4) / m.pitch))
    const step = (L - 2.4) / count, w = Math.min(3.2, step * 0.5)
    for (let k = 0; k < count; k++) {
      const s = 1.2 + step * (k + 0.5)
      const cx = a[0] + ux * s, cy = a[1] + uy * s
      const probe: XY = [cx + nx * 1.2, cy + ny * 1.2]
      if (others.some((q) => inside(probe, q))) continue
      const o = 0.05
      const A: XY = [cx - ux * w / 2 + nx * o, cy - uy * w / 2 + ny * o], B: XY = [cx + ux * w / 2 + nx * o, cy + uy * w / 2 + ny * o]
      for (const [z0, z1] of m.rows) {
        if (z1 > m.C - 1.4) continue
        qf(win, [A[0], A[1], G + z0], [B[0], B[1], G + z0], [B[0], B[1], G + z1], [A[0], A[1], G + z1], [nx, ny, 0])
      }
    }
  }
}

for (const m of masses) {
  walls(m)
  if (m.roof === 'mansard') mansard(m)
  else if (m.roof === 'flat') flatRoof(m)
  else if (m.roof === 'steep') steep(m)
  else if (m.roof === 'dome') dome(m)
  facade(m)
}

// ---- Glazed courts: low glass hips at the cornice of the wings round them.
function glassHip(p: XY[], z0: number, h: number, pyramid = false) {
  const hw = halfWidth(p)
  const t = offset(p, -(pyramid ? hw - 0.3 : Math.min(hw - 0.5, h * 2.2)))
  glass.loft([ring(p, z0), ring(t, z0 + h)])
  glass.cap(ring(t, z0 + h), true)
}
glassHip(courts[0], G + 18.6, 3.2)
glassHip(courts[1], G + 18.6, 3.2)
glassHip(courts[2], G + 18.6, 3.4, true)
glassHip(courts[3], G + 18.6, 2.6)
// Cour Visconti's low glass veil (OSM: building=roof, height 3.5).
{
  const v = quad([[9, -124.9], [63.3, -124.9], [63.3, -85.1], [9, -85.1]])
  prism(glass, offset(v, -1.0), G + 2.9, G + 3.5)
}

// ---- Pediments on the main fronts.
function pediment(axis: 'x' | 'y', at: number, sgn: number, a0: number, a1: number, z0: number, h: number) {
  const am = (a0 + a1) / 2, f = at + sgn * 0.4, bk = at - sgn * 2.5
  const Q = (a: number, d: number, z: number): V3 => (axis === 'y' ? [a + OX, d + OY, z] : [d + OX, a + OY, z])
  const n: V3 = axis === 'y' ? [0, sgn, 0] : [sgn, 0, 0]
  tf(stone, Q(a0, f, z0), Q(a1, f, z0), Q(am, f, z0 + h), n)
  const s0: V3 = axis === 'y' ? [-h, 0, (a1 - a0) / 2] : [0, -h, (a1 - a0) / 2]
  const s1: V3 = axis === 'y' ? [h, 0, (a1 - a0) / 2] : [0, h, (a1 - a0) / 2]
  qf(trim, Q(a0, f, z0), Q(am, f, z0 + h), Q(am, bk, z0 + h), Q(a0, bk, z0), s0)
  qf(trim, Q(a1, f, z0), Q(am, f, z0 + h), Q(am, bk, z0 + h), Q(a1, bk, z0), s1)
}
// Horloge: on both its fronts, below the dome.
pediment('x', 121, -1, -9, 9, G + 33, 3.6)
pediment('x', 148, 1, -9, 9, G + 33, 3.6)
// Richelieu and Denon face the pyramid.
pediment('y', 58.5, -1, -13.5, 7.5, G + 27, 3.4)
pediment('y', -59.5, 1, -14.5, 7.5, G + 27, 3.4)
// Colonnade's centre and the Cour Carrée's Seine front.
pediment('x', 291.5, 1, -8, 17, G + CC.C + 1.1, 4.2)
pediment('y', -84.5, -1, 194, 222, G + CC.C + 1.1, 3.6)
// Grands Guichets, both fronts.
pediment('y', -143, -1, -152, -132, G + 21, 3.4)
pediment('y', -127, 1, -152, -132, G + 21, 3.4)

// ---- The Colonnade: paired columns across the upper storeys of the east
// front, standing before a shadowed loggia, between end pavilions.
{
  const xF = 289.5
  // The centre avant-corps projects a little.
  prism(stone, quad([[289.5, -9], [291.5, -9], [291.5, 18], [289.5, 18]]), 0, G + CC.C - 0.3)
  for (let y = -62; y <= 72; y += 7.6) {
    if (y > -12 && y < 21) continue
    const s = quad([[xF, y - 1.5], [xF + 1.6, y - 1.5], [xF + 1.6, y + 1.5], [xF, y + 1.5]])
    prism(trim, s, G + 8.6, G + CC.C - 1.2, false)
  }
}

// ---- Arched passages: the Guichets and the Passage Richelieu, as lit doors.
function arch(axis: 'x' | 'y', at: number, sgn: number, a: number, w: number, h: number) {
  const n: V3 = axis === 'y' ? [0, sgn, 0] : [sgn, 0, 0]
  const d = at + sgn * 0.06
  const Q = (s: number, z: number): V3 => (axis === 'y' ? [s + OX, d + OY, z] : [d + OX, s + OY, z])
  const r = w / 2, zs = G + h - r
  qf(door, Q(a - r, G), Q(a + r, G), Q(a + r, zs), Q(a - r, zs), n)
  const seg = 8
  for (let k = 0; k < seg; k++) {
    const t0 = (Math.PI * k) / seg, t1 = (Math.PI * (k + 1)) / seg
    tf(door, Q(a, zs), Q(a + r * Math.cos(t0), zs + r * Math.sin(t0)), Q(a + r * Math.cos(t1), zs + r * Math.sin(t1)), n)
  }
}
for (const a of [-148, -142, -136]) { arch('y', -143, -1, a, 4.6, 9); arch('y', -127, 1, a, 4.6, 9) }
for (const a of [-10, -3, 4]) arch('y', 58.5, -1, a, 4.0, 7.5) // Passage Richelieu
arch('x', 121, -1, 0, 4.6, 8) // Passage Sully under the Horloge
arch('x', 148, 1, 0, 4.6, 8)
arch('x', 291.5, 1, 4.5, 4.6, 8) // the Colonnade's gate

const lit = (p: V3, n: V3) => (Math.abs(n[2]) > 0.7 ? 0.15 : p[2] < G + 30 ? 0.9 : 0.6)
console.log({ stone: stone.triangles, trim: trim.triangles, slate: slate.triangles, win: win.triangles, glass: glass.triangles, door: door.triangles })
await save('paris-louvre', 'Palais du Louvre', [
  { part: stone, material: { ...finish('louvre-stone', 0xeadcc4), floodlight: lit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
  { part: slate, material: { ...finish('louvre-slate', 0x838c97), floodlight: (_p, n) => (Math.abs(n[2]) > 0.95 ? 0 : 0.25) } },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
  { part: door, material: PALETTE.entrance },
], { bearing: 20.5, osm: 'relation/3262297', footprint: [672, 325], height: G + 46 }, 6500)
