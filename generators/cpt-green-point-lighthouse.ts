/**
 * Green Point Lighthouse, Mouille Point, Cape Town (1824) — procedural,
 * CC0-1.0.
 * bun generators/cpt-green-point-lighthouse.ts
 *
 * Frame: built turned to the building, BEARING 55.6: +y is the front (the
 * north-east face, towards the common, with the tower's door and its stepped
 * plinth), +x runs along the long axis towards the south-east, z up, metres.
 * Origin = centroid of the OSM outline way/134572381.
 *
 * The oldest working lighthouse in South Africa: a square masonry tower
 * painted in bold red and white diagonal bands that spiral round it, a white
 * string course under a frieze with small arched windows, a red overhanging
 * cornice, a wooden-railed gallery, a red round lantern drum, a white
 * lantern with a domed cap, ball and weathervane, rising from the middle of
 * a one-storey white keeper's house whose two wings have grey hipped roofs
 * and arched doors and windows.
 *
 * Identity, in order: the red and white diagonal bands (drawn as flat bands
 * of geometry, about 2.8 m wide, not a texture), the square tower with the
 * red cornice and red drum, the white dome, the low white house with grey
 * roofs either side. Bands, cornice and dome all hold at 80 px.
 *
 * Evidence
 *  - OSM way/134572381 (building=yes, man_made=lighthouse, start_date
 *    1824-04-12, wikidata Q3642248): a 20.86 x 7.85 m rectangle, long axis
 *    145.6°. Anchor = its centroid; bearing 55.6 = the front's normal.
 *    Replaces that way only. The flat-roofed annex behind (way/134572383)
 *    and the service building (way/134572386) are separate and not modelled.
 *  - Published (Wikipedia, "Green Point Lighthouse, Cape Town"): masonry
 *    tower 16 m, focal height 20 m above sea level, square tower with
 *    balcony and lantern rising from a one-storey keeper's house, red and
 *    white diagonal bands, raised to its present height in 1865.
 *  - Proportions estimated from Rabich 3566 (camera 154 m north-east, 105 mm,
 *    square to the front) and 3569 (94 m, from 39°), scaled to a 7.0 m tower:
 *    the two wings and the tower are about equally wide in 3566, which with
 *    OSM's 20.86 m makes the tower about 7.0 m square (the EXIF focal length
 *    and the geotag distance give 7.2–7.8 m; the Teper end view about
 *    6.2–7 m). Heights from 3566 at 27.1 px/m: wing eaves 3.5 m, ridge
 *    6.1 m, stripes from 3.8 m, white string course 10.6–10.9 m, cornice
 *    13.1–13.9 m, gallery rail 15.2 m, red drum (3.7 m across) to 16.2 m,
 *    lantern to 17.9 m, dome to 19.0 m, vane 20.1 m. The lantern centre
 *    lands at 17 m, about the published 20 m focal height less the ground's
 *    3–4 m above the sea; the 16 m tower height reads as the gallery.
 *  - The band pattern: five red-and-white periods round the tower (5.6 m
 *    measured along the wall each), at 45°, rising to the right on every
 *    face, so they spiral continuously; phased so a white band runs from the
 *    front's bottom-left corner to its top-right, as in 3566 and 3569.
 *    The back (Glanville, from 224°) and the north-west end (Teper) show the
 *    same rising-right bands. Band width measured as about 0.4 of a face
 *    horizontally in 3566 and Teper (estimated).
 *  - Openings: arched door in the tower front between stepped white plinth
 *    blocks (3566); two small arched windows in the frieze and a pair at mid
 *    height on every face, a lower pair front and back (3569, Glanville);
 *    each wing's front a door near the tower and a window outboard (3566,
 *    3569), two square windows in each end wall (Teper). The back walls of
 *    the wings are hidden by the annex in every photo: given the same
 *    openings as the front (invented).
 *  - Colours from the daylight photos: lime white walls, signal red (pulled a
 *    little towards the palette), grey corrugated roofs (`roof`), dark wood
 *    gallery railing and vane, white lantern frame and dome.
 *  - No lidar or NAIP in South Africa. The map's terrain (Mapterhorn) has no
 *    z15 tiles here: tools/terrain.ts 404s. The site is flat seafront lawn;
 *    elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Cape Town (ZA), Green Point Lighthouse -- 2024 -- 3566.jpg, Dietmar
 *    Rabich, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Cape_Town_(ZA),_Green_Point_Lighthouse_--_2024_--_3566.jpg
 *  - Cape Town (ZA), Green Point Lighthouse -- 2024 -- 3569.jpg, Dietmar
 *    Rabich, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Cape_Town_(ZA),_Green_Point_Lighthouse_--_2024_--_3569.jpg
 *  - Cape Town (ZA), Green Point Lighthouse -- 2024 -- 3575.jpg, Dietmar
 *    Rabich, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Cape_Town_(ZA),_Green_Point_Lighthouse_--_2024_--_3575.jpg
 *  - The Green Point Lighthouse.jpg, Hilton Teper, CC BY-SA 3.0 (the
 *    north-west end),
 *    https://commons.wikimedia.org/wiki/File:The_Green_Point_Lighthouse.jpg
 *  - Green Point Lighthouse (11270413295).jpg, Darren Glanville, CC BY-SA 2.0
 *    (from the south-west, the back and the annex),
 *    https://commons.wikimedia.org/wiki/File:Green_Point_Lighthouse_(11270413295).jpg
 *  - Green Point Lighthouse Green Point Cape Town - Side view.JPG, Debbie
 *    Louise Lloyd, CC BY-SA 3.0,
 *    https://commons.wikimedia.org/wiki/File:Green_Point_Lighthouse_Green_Point_Cape_Town_-_Side_view.JPG
 * Look-only references: none. No commercial imagery.
 *
 * Doubts: the tower's width rests on photo ratios and OSM's length (±0.5 m);
 * the exact band phase on the end faces is approximate; the frieze's blind
 * panels, the brackets under the cornice and the lantern's own railing
 * detail are left out or simplified. Night: the lantern glazing is `window`
 * so the light glows; the walls are not floodlit (no night photo checked).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, walls, cap, lathe, chamfer, rect, inset, type XY } from './chi-aon-center'
import { along, archOn, rectOn, face } from './phl-independence-hall'

const BEARING = 55.6
const ANCHOR: [number, number] = [-33.9014222, 18.3999212]

const white = new Part(), red = new Part(), roof = new Part(), win = new Part(), wood = new Part()

// --- Dimensions ---
const T = 3.5 // tower half-width
const LX = 10.43, LY = 3.93 // outline half-sizes
const EAVE = 3.5, RIDGE = 6.1
const STRIPE0 = 3.8, COURSE0 = 10.6, COURSE1 = 10.9, CORN0 = 13.1, CORN1 = 13.9
const CH = 0.25 // tower corner chamfer

// --- Tower shaft with the spiral bands ---
const ring: XY[] = chamfer(rect(-T, -T, T, T), CH) // counter-clockwise
const perim = ring.reduce((s, a, i) => { const b = ring[(i + 1) % ring.length]; return s + Math.hypot(b[0] - a[0], b[1] - a[1]) }, 0)
const NP = 4 // periods round the tower: one a face
const PH = perim / NP // horizontal period along the wall
const PV = 8.0 // vertical period: bands at about 50°
// Phase: the white band's centre line passes through the front face's
// bottom-left corner (s at that corner, z = STRIPE0): the middle of the white span there.
// The front face is the edge running -x → +x... seen from +y the viewer's
// left is +x, so the bottom-left of the front is its +x end.
const cumS: number[] = []
{ let s = 0; ring.forEach((a, i) => { cumS.push(s); const b = ring[(i + 1) % ring.length]; s += Math.hypot(b[0] - a[0], b[1] - a[1]) }) }
const frontIdx = ring.findIndex((a, i) => { const b = ring[(i + 1) % ring.length]; return a[1] > T - 0.01 && b[1] > T - 0.01 })
const sFrontLeft = cumS[frontIdx] // the front edge starts at its +x end (CCW from above)
const RED = 0.58 // the red share of each period: red reads a little wider than white in every photo
const C0 = (1 + RED) / 2 - (sFrontLeft / PH - STRIPE0 / PV)
const phi = (s: number, z: number) => s / PH - z / PV + C0

type UZ = [number, number]
/** Keep the part of a convex polygon where f >= 0 (f affine). */
function clip(poly: UZ[], f: (p: UZ) => number): UZ[] {
  const out: UZ[] = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], fa = f(a), fb = f(b)
    if (fa >= 0) out.push(a)
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]) }
  }
  return out
}
/** Paint one wall a→b between z0 and z1 in the spiral bands. */
function stripedWall(a: XY, b: XY, s0: number, z0: number, z1: number, out = 0) {
  const { L, P } = along(a, b)
  const base: UZ[] = [[0, z0], [L, z0], [L, z1], [0, z1]]
  const f = (p: UZ) => phi(s0 + p[0], p[1])
  const vals = base.map(f), m0 = Math.floor(Math.min(...vals)), m1 = Math.ceil(Math.max(...vals))
  // each period: red over [0, RED), white over [RED, 1)
  const spans: [number, number, Part][] = []
  for (let m = m0; m < m1; m++) spans.push([m, m + RED, red], [m + RED, m + 1, white])
  for (const [lo, hi, part] of spans) {
    let poly = clip(base, (p) => f(p) - lo)
    poly = clip(poly, (p) => hi - f(p))
    if (poly.length < 3) continue
    const pts = poly.map(([u, z]) => P(u, z, out))
    for (let i = 1; i < pts.length - 1; i++) part.tri(pts[0], pts[i], pts[i + 1])
  }
}
// plain white below the bands (inside the house roofs and behind the plinth)
walls(white, ring, 0, STRIPE0)
ring.forEach((a, i) => stripedWall(a, ring[(i + 1) % ring.length], cumS[i], STRIPE0, CORN0))

// white string course under the frieze
{
  const o = inset(ring, -0.15), i2 = inset(ring, -0.05)
  walls(white, i2, COURSE0 - 0.08, COURSE0, o)
  walls(white, o, COURSE0, COURSE1)
  walls(white, o, COURSE1, COURSE1 + 0.08, i2)
}
// red cornice: a bevelled overhanging slab, which is the gallery deck
{
  const o = inset(ring, -0.4), m = inset(ring, -0.1)
  walls(red, m, CORN0, CORN0 + 0.3, o)
  walls(red, o, CORN0 + 0.3, CORN1)
  cap(red, o, CORN1)
}

// tower windows: small round-headed, two per face in the frieze and at mid height,
// a lower pair front and back
const faces: [XY, XY][] = [] // the four main faces of the chamfered ring
ring.forEach((a, i) => { const b = ring[(i + 1) % ring.length]; if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 3) faces.push([a, b]) })
for (const [a, b] of faces) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), front = Math.abs(a[1] - b[1]) < 0.01 && Math.abs(a[1]) > 3
  for (const c of [L / 2 - 0.95, L / 2 + 0.95]) {
    archOn(win, a, b, c, 0.32, 11.4, 12.25, 0.04, 6)
    archOn(win, a, b, c, 0.3, 8.2, 8.9, 0.04, 6)
    if (front) archOn(win, a, b, c, 0.3, 5.5, 6.2, 0.04, 6)
  }
}

// stepped white plinth either side of the tower door, and the door
{
  const yF = T, d = 0.7
  const steps: [number, number, number][] = [[-T, -2.7, 1.3], [-2.7, -1.9, 2.5], [-1.9, -0.75, 3.8]]
  for (const [u0, u1, h] of steps) for (const sgn of [1, -1]) {
    const x0 = sgn > 0 ? u0 : -u1, x1 = sgn > 0 ? u1 : -u0
    const r = chamfer(rect(x0, yF - 0.01, x1, yF + d), 0.08)
    walls(white, r, 0, h - 0.1)
    walls(white, r, h - 0.1, h, inset(r, 0.08))
    cap(white, inset(r, 0.08), h)
  }
  // the door, in the recess between the plinth blocks
  const a: XY = [T, T], b: XY = [-T, T]
  archOn(win, a, b, T, 0.6, 0, 2.15, 0.04, 8)
}

// --- Gallery railing (dark wood): posts and two rails on the cornice edge ---
{
  const G = T + 0.32, H = 1.3, z = CORN1, w = 0.09
  const post = (x: number, y: number) => {
    const r = rect(x - w, y - w, x + w, y + w)
    walls(wood, r, z, z + H); cap(wood, r, z + H)
  }
  for (const s of [-1, -0.5, 0, 0.5, 1]) for (const t of [-1, 1]) { post(s * G, t * G); post(t * G, s * G) }
  for (const zr of [z + H - 0.14, z + 0.55]) {
    const o = rect(-G - 0.06, -G - 0.06, G + 0.06, G + 0.06), i = rect(-G + 0.06, -G + 0.06, G - 0.06, G - 0.06)
    walls(wood, o, zr, zr + 0.14)
    walls(wood, [...i].reverse(), zr, zr + 0.14)
    for (let k = 0; k < 4; k++) {
      const l = (k + 1) % 4
      wood.quad([i[k][0], i[k][1], zr + 0.14], [o[k][0], o[k][1], zr + 0.14], [o[l][0], o[l][1], zr + 0.14], [i[l][0], i[l][1], zr + 0.14])
      wood.quad([i[l][0], i[l][1], zr], [o[l][0], o[l][1], zr], [o[k][0], o[k][1], zr], [i[k][0], i[k][1], zr])
    }
  }
}

// --- Lantern: red drum, white deck, glazing with white bars, dome, ball, vane ---
const DRUM1 = 16.2, L0 = 16.35, LG0 = 16.6, LG1 = 17.7, L1 = 17.95, DOME = 19.0
lathe(red, 0, 0, [[0, CORN1], [1.85, CORN1], [1.85, DRUM1 - 0.15], [1.95, DRUM1 - 0.1], [1.95, DRUM1]], 16)
lathe(white, 0, 0, [[1.95, DRUM1], [2.05, DRUM1], [2.05, L0], [1.6, L0], [1.6, LG0], [0, LG0]], 16) // deck and lantern base
lathe(win, 0, 0, [[1.52, LG0], [1.52, LG1]], 16) // glazing
{
  // lantern bars
  for (let k = 0; k < 8; k++) {
    const t = (k / 8) * 2 * Math.PI + Math.PI / 16, c = Math.cos(t), s = Math.sin(t), w = 0.07
    const P = (r: number, q: number, z: number): V3 => [c * r - s * q, s * r + c * q, z]
    face(white, [P(1.56, -w, LG0), P(1.56, w, LG0), P(1.56, w, LG1), P(1.56, -w, LG1)], [c, s, 0])
  }
  // lantern-deck rail, white: a thin ring and posts
  const R = 1.98, zr = L0 + 0.95
  const o = Array.from({ length: 16 }, (_, k) => [R * Math.cos(k * Math.PI / 8), R * Math.sin(k * Math.PI / 8)] as XY)
  const i = inset(o, 0.08)
  walls(white, o, zr, zr + 0.08); walls(white, [...i].reverse(), zr, zr + 0.08)
  for (let k = 0; k < 16; k += 2) {
    const [x, y] = o[k], w = 0.05
    const r = rect(x - w, y - w, x + w, y + w)
    walls(white, r, L0, zr)
  }
}
// roof ring and dome
const domeProf: XY[] = [[1.52, LG1], [1.75, LG1 + 0.05], [1.75, L1], [1.62, L1]]
for (let k = 1; k <= 6; k++) { const t = (k / 6) * (Math.PI / 2); domeProf.push([Math.max(0.0, 1.62 * Math.cos(t)), L1 + (DOME - L1) * Math.sin(t)]) }
lathe(white, 0, 0, domeProf, 16)
// ball, rod and vane
{
  const prof: XY[] = []
  for (let i = 0; i <= 6; i++) { const a = -Math.PI / 2 + (i / 6) * Math.PI; prof.push([Math.max(0, 0.24 * Math.cos(a)), DOME + 0.2 + 0.24 * Math.sin(a)]) }
  prof[0][0] = 0; prof[6][0] = 0
  lathe(wood, 0, 0, prof, 8)
  const r = rect(-0.05, -0.05, 0.05, 0.05)
  walls(wood, r, DOME + 0.4, 20.1); cap(wood, r, 20.1)
  // the vane's arrow, a bold flat plate turned along x
  const zv = 19.85
  for (const n of [1, -1]) face(wood, [[-0.55, 0, zv - 0.12], [0.45, 0, zv - 0.12], [0.45, 0, zv + 0.12], [-0.55, 0, zv + 0.12]], [0, n, 0])
}

// --- The keeper's house: two white wings with grey hipped roofs ---
for (const sgn of [1, -1]) {
  const xIn = sgn * (T - 0.05), xOut = sgn * LX
  const x0 = Math.min(xIn, xOut), x1 = Math.max(xIn, xOut)
  const r = rect(x0, -LY, x1, LY)
  // a low plinth band, then the walls
  walls(white, inset(r, -0.06), 0, 0.45); cap(white, inset(r, -0.06), 0.45)
  walls(white, r, 0.45, EAVE)
  // hipped roof: eaves overhang 0.3 on the long sides and the outer end
  const o = 0.3, s = (RIDGE - EAVE) / LY, lo = EAVE - o * s
  const xo = xOut + sgn * o, xh = xOut - sgn * LY // the hip's peak, a full run in from the end
  const yo = LY + o
  const P = (x: number, y: number, z: number): V3 => [x, y, z]
  face(roof, [P(xIn, yo, lo), P(xo, yo, lo), P(xh, 0, RIDGE), P(xIn, 0, RIDGE)], [0, 1, 1 / s])
  face(roof, [P(xIn, -yo, lo), P(xo, -yo, lo), P(xh, 0, RIDGE), P(xIn, 0, RIDGE)], [0, -1, 1 / s])
  face(roof, [P(xo, -yo, lo), P(xo, yo, lo), P(xh, 0, RIDGE)], [sgn, 0, 1 / s])
  face(roof, [P(xIn, -yo, lo), P(xo, -yo, lo), P(xo, yo, lo), P(xIn, yo, lo)], [0, 0, -1])
  face(roof, [P(xIn, -yo, lo), P(xIn, yo, lo), P(xIn, 0, RIDGE)], [-sgn, 0, 0])
  // a white fascia under the eaves
  const fr = inset(rect(x0 - (sgn < 0 ? o : 0), -yo, x1 + (sgn > 0 ? o : 0), yo), 0)
  walls(white, fr, lo - 0.18, lo)
  // openings: front and back a door by the tower and a window outboard; the end two windows
  for (const yS of [1, -1]) {
    const a: XY = yS > 0 ? [x1, LY] : [x0, -LY], b: XY = yS > 0 ? [x0, LY] : [x1, -LY]
    const L = x1 - x0
    const dist = (x: number) => (yS > 0 ? x1 - x : x - x0) // along a→b
    archOn(win, a, b, dist(sgn * 4.7), 0.5, 0.45, 2.05, 0.04, 8)
    archOn(win, a, b, dist(sgn * 8.3), 0.5, 1.0, 2.1, 0.04, 8)
    void L
  }
  const ea: XY = sgn > 0 ? [x1, -LY] : [x0, LY], eb: XY = sgn > 0 ? [x1, LY] : [x0, -LY]
  for (const c of [LY - 1.9, LY + 1.9]) rectOn(win, ea, eb, c, 0.5, 1.0, 2.6, 0.04)
}

await save('cpt-green-point-lighthouse', 'Green Point Lighthouse', ANCHOR, BEARING, [
  { part: white, material: finish('lime-white', 0xf4f0e8) },
  { part: red, material: finish('lighthouse-red', 0xc93b33) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: wood, material: finish('gallery-wood', 0x6e5240) },
])
