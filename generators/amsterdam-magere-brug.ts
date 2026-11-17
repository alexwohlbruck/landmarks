/**
 * Magere Brug (Skinny Bridge, brug 242), Amsterdam — procedural, CC0-1.0, no textures.
 * bun generators/amsterdam-magere-brug.ts
 *
 * The white-painted timber double-leaf drawbridge over the Amstel (this
 * form 1934, rebuilt in tropical hardwood 1969): eight low segmental arches
 * on white timber spandrels, four each side of a central opening; over the
 * opening two leaves, each lifted by a pair of balance beams ("wippen")
 * pivoting on a tall white portal frame ("hamei") that the roadway passes
 * through, with arches on all four faces; chains from the beam tips to the
 * leaf, and black iron struts. At night the arches, the deck edges, the
 * portals and the beams are outlined with strings of bulbs (about 1,200).
 *
 * Map frame: x across the bridge (+x upstream, bearing 163.2°), y along it
 * (+y the east bank, bearing 73.2°), z up, metres. Placed at bearing 73.2°
 * (the outline's long edges). Anchor: the outline's area centroid.
 * y = 0 / z = 0 is the waterline of the Amstel; the abutments run down to it.
 *
 * Bridges (docs/reference.md): one placement; `replaces` lists the
 * man_made=bridge outline way/601096321, which the model covers end to end
 * (abutment to abutment). No road surface is drawn: the deck's top is a
 * masonry/plank surface 0.3 m under the roadway the map draws (built to
 * 3.0 m over the water at the abutments and 3.3 m at the portals, the leaves
 * level at 3.3 m; estimated, see below), so the map's road rests on it.
 *
 * Evidence
 * - OSM way/601096321 (man_made=bridge, bridge:structure=arch,
 *   historic=bridge, wikidata Q1344400): 81 m long, 9.8 m wide over the
 *   fixed spans and 5.2 m over the movable part (y −4.3…6.5 here); the
 *   outline's 1 m notches give the piers at y −25.3, −18.5, −11.6, 7.0,
 *   14.2, 21.3, 28.5 and the arch spans of 5.8–6.1 m between them;
 *   abutments y −40.5…−31.6 and 35.1…40.4.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - C messier, "Magere Brug 2042.jpg", CC BY-SA 4.0 — side view from the
 *     river, both portals with their side arches, beams, chains, struts.
 *     https://commons.wikimedia.org/wiki/File:Magere_Brug_2042.jpg
 *   - C messier, "Magere Brug 2048.jpg", CC BY-SA 4.0 — straight down the
 *     deck through both portals: the portal arch, the beam frame and its
 *     cross beam. https://commons.wikimedia.org/wiki/File:Magere_Brug_2048.jpg
 *   - Zairon, "Amsterdam Magere Brug 1.jpg", "… 2.jpg", "… 3.jpg",
 *     CC BY-SA 4.0 — the whole bridge from the river, the arch count, the
 *     beam slope. https://commons.wikimedia.org/wiki/File:Amsterdam_Magere_Brug_3.jpg
 *   - Suicasmo, "Magere Brug 20180702.jpg", CC BY-SA 4.0 — from the east
 *     approach: the portal's end and side arches.
 *     https://commons.wikimedia.org/wiki/File:Magere_Brug_20180702.jpg
 *   - Max Piletski, "Night Bridge Reflection (228162771).jpeg", CC0 — the
 *     bulb strings at night: deck edges, every arch, portals, beams.
 *     https://commons.wikimedia.org/wiki/File:Night_Bridge_Reflection_(228162771).jpeg
 * - Estimated from the photos. Scale: the people on the deck beside the
 *   west portal in C messier 2042 (about 46 px/m) and the clear width
 *   between the portal posts in C messier 2048 (about 54 px/m); the OSM arch
 *   spans (5.8 m) for the arches. Arches: crown 2.45 m over the water, the
 *   segment's circle springing 0.4 m under it, so the openings run the full
 *   span between the piers; deck 3.0–3.3 m. Portals 6.4 wide × 4.0 deep
 *   (on the portal piers and partly over the last arches, as Zairon's and
 *   C messier's side views show), posts 7.2 m over the deck (6.1–7.7 from
 *   the two photos, about 2.3× the deck's height over the water), cornice
 *   to 7.75; portal arches springing 4.4 and crowning 6.0 over the deck,
 *   well over head height. Balance beams about 14 m long, pivoting 0.5 m
 *   over the cornice, tails 7 m behind the portal's middle, tips over the
 *   leaves' free ends, tips 2 m higher than the tails (about 8°, the
 *   slope in Zairon's view); leaves 4.0 m each (an 8 m opening).
 *   Bulbs: about 350 beads 1.1 m apart (0.9 m round the arches); the real
 *   string is denser, about 1,200.
 * - Not available: no published dimensions were reachable (Wikipedia was
 *   rate-limited); no lidar (USGS covers only the US), and the 3D BAG has no
 *   bridges. Mapterhorn has no z15 terrain here.
 *
 * Doubts: the portal depth along the bridge (4.0 m) and the leaf length
 * rest on oblique photos; OSM's narrow 5.2 m part (y −4.3…6.5) is wider
 * here (−7…9), as the portals and leaves photograph; the portal piers'
 * fenders are drawn as plain dark blocks. The railings (dark green iron on the fixed
 * spans, white on the leaves) are left out as too thin for the low model,
 * as are the lamp posts on the bridge. The struts are simplified to one
 * front and one rear pair per portal side.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { finishModel } from './nyc-570-lexington'
import { face, rod, bead, along } from './bridge-kit'

const white = new Part(), dark = new Part(), deck = new Part(), lamps = new Part(), timber = new Part()

// ---------------------------------------------------------------- layout
const HW = 4.9 // half width over the fixed spans
const LW = 2.6 // half width of the leaves
const ROAD = (y: number) => {
  // 3.0 at the abutments rising to 3.3 at the portals; level across the opening.
  const a = Math.min(1, Math.max(0, (Math.abs(y - 1.0) - 3.6) / (39.5 - 3.6)))
  return 3.3 - 0.3 * a
}
const TOP = (y: number) => ROAD(y) - 0.3 // our deck top, under the map's road
const SPANS: [number, number][] = [
  [-31.6, -25.8], [-24.8, -19.0], [-18.0, -12.2], [-11.1, -5.4],
  [7.5, 13.6], [14.7, 20.8], [21.8, 27.9], [29.0, 35.1],
]
const RISE = 2.45, SINK = 0.4
const PORTALS: [number, number][] = [[-7.0, -3.0], [5.0, 9.0]]
// The piers under them (the portals stand partly over the last arches).
const PIERS: [number, number][] = [[-5.4, -3.0], [5.0, 7.5]]
const Y0 = -40.5, Y1 = 40.4
const LEAF0 = -3.0, LEAF1 = 5.0, MID = (LEAF0 + LEAF1) / 2

/** Height of the arch intrados at y, or 0 outside every span. */
function soffit(y: number) {
  for (const [a, b] of SPANS) {
    if (y > a && y < b) {
      // Segmental arch springing at the waterline: a circle through both
      // springings and the crown.
      // The circle springs 0.7 m under the water, so the visible arch is
      // flatter than a semicircle, as in the photos.
      const h = (b - a) / 2, c = (a + b) / 2, r = RISE + SINK, R = (h * h + r * r) / (2 * r)
      return Math.max(0, Math.sqrt(Math.max(0, R * R - (y - c) ** 2)) - (R - r) - SINK)
    }
  }
  return 0
}
const fixed = (y: number) => y <= PIERS[0][0] + 1e-6 || y >= PIERS[1][1] - 1e-6

// Stations along the fixed spans: arch subdivisions plus the pier faces.
const ys: number[] = [Y0, PIERS[0][0], PIERS[1][1], Y1]
for (const [a, b] of SPANS) for (let i = 0; i <= 10; i++) ys.push(a + ((b - a) * i) / 10)
const YS = [...new Set(ys.map((v) => Math.round(v * 1000) / 1000))].sort((a, b) => a - b)

// ---------------------------------------------------------------- fixed spans
// Spandrel faces on both sides, from the arch (or the water) up to a kerb
// 0.15 m over the deck top; the deck top itself; arch soffits.
const KERB = 0.15
for (let i = 0; i < YS.length - 1; i++) {
  const ya = YS[i], yb = YS[i + 1]
  if (!(fixed(ya) && fixed(yb))) continue
  const inArch = soffit((ya + yb) / 2) > 0
  const ba = inArch ? soffit(ya) : 0, bb = inArch ? soffit(yb) : 0
  const ta = TOP(ya) + KERB, tb = TOP(yb) + KERB
  for (const s of [1, -1]) face(white, [s * HW, ya, ba], [s * HW, yb, bb], [s * HW, yb, tb], [s * HW, ya, ta], [s, 0, 0])
  face(deck, [-HW, ya, TOP(ya)], [HW, ya, TOP(ya)], [HW, yb, TOP(yb)], [-HW, yb, TOP(yb)], [0, 0, 1])
  // Kerb top, a 0.3 m lip on each edge.
  for (const s of [1, -1]) {
    face(white, [s * HW, ya, ta], [s * (HW - 0.3), ya, ta], [s * (HW - 0.3), yb, tb], [s * HW, yb, tb], [0, 0, 1])
    face(white, [s * (HW - 0.3), ya, TOP(ya)], [s * (HW - 0.3), yb, TOP(yb)], [s * (HW - 0.3), yb, tb], [s * (HW - 0.3), ya, ta], [-s, 0, 0])
  }
  if (inArch) {
    // The soffit, lit from below; facing down and inward.
    const da: V3 = [0, 0, -1]
    face(timber, [-HW, ya, ba], [HW, ya, ba], [HW, yb, bb], [-HW, yb, bb], da)
  }
}
// Abutment ends and the faces of the piers inside each arch (the springing
// is at the waterline, so the soffit closes the arch; nothing more needed).
for (const [y, s] of [[Y0, -1], [Y1, 1]] as [number, number][])
  face(white, [-HW, y, 0], [HW, y, 0], [HW, y, TOP(y) + KERB], [-HW, y, TOP(y) + KERB], [0, s, 0])

// ---------------------------------------------------------------- portal piers
// The piers under the portals: white over a dark timber fender at the water.
for (const [a, b] of PIERS) {
  const t = TOP(a)
  for (const s of [1, -1]) face(white, [s * HW, a, 1.2], [s * HW, b, 1.2], [s * HW, b, t + KERB], [s * HW, a, t + KERB], [s, 0, 0])
  // Faces toward the opening / the arch.
  const inner = a < 0 ? b : a, sgn = a < 0 ? 1 : -1
  face(white, [-HW, inner, 1.2], [HW, inner, 1.2], [HW, inner, t], [-HW, inner, t], [0, sgn, 0])
  face(deck, [-HW, a, t], [HW, a, t], [HW, b, t], [-HW, b, t], [0, 0, 1])
  for (const s of [1, -1]) face(white, [s * HW, a, t + KERB], [s * (HW - 0.3), a, t + KERB], [s * (HW - 0.3), b, t + KERB], [s * HW, b, t + KERB], [0, 0, 1])
  // Fender: a dark timber block a little wider than the pier, 0…1.2.
  const f0 = a - (a < 0 ? 0 : 0.6), f1 = b + (a < 0 ? 0.6 : 0)
  box(timber, -HW - 0.25, f0, HW + 0.25, f1, 0, 1.2)
}

// ---------------------------------------------------------------- leaves
// Each leaf: a thin deck under the map's road, white side girders, and a
// white handrail (top rail and three posts) along each edge.
for (const [a, b] of [[LEAF0, MID - 0.05], [MID + 0.05, LEAF1]] as [number, number][]) {
  const t = TOP(MID)
  box(timber, -LW, a, LW, b, t - 0.45, t)
  for (const s of [1, -1]) {
    box(white, s > 0 ? LW - 0.05 : -LW - 0.2, a, s > 0 ? LW + 0.2 : -LW + 0.05, b, t - 0.6, t + 0.45)
    box(white, s > 0 ? LW - 0.02 : -LW - 0.1, a, s > 0 ? LW + 0.1 : -LW + 0.02, b, t + 1.15, t + 1.35)
    for (const yy of [a + 0.3, (a + b) / 2, b - 0.3]) box(white, s * (LW + 0.04) - 0.08, yy - 0.08, s * (LW + 0.04) + 0.08, yy + 0.08, t + 0.45, t + 1.15)
  }
}

// ---------------------------------------------------------------- portals
const PH = 7.2 // post height over the deck top
const CH = 0.55 // cornice
const PW = 3.2 // half width of the portal (posts' outer faces)
const POST = 0.6
const SPRING = 4.4, CROWN = 6.0
/** An arched plate between two posts: the opening's segmental arch below, flat top at `zTop`. */
function archPlate(p: Part, u0: number, u1: number, z0: number, zTop: number, at: (u: number, z: number, outer: boolean) => V3, out: V3) {
  const n = 10, h = (u1 - u0) / 2, c = (u0 + u1) / 2, rise = CROWN - SPRING
  const R = (h * h + rise * rise) / (2 * rise)
  const arc = (u: number) => z0 + SPRING + Math.sqrt(Math.max(0, R * R - (u - c) ** 2)) - (R - rise)
  const inv: V3 = [-out[0], -out[1], -out[2]]
  for (let i = 0; i < n; i++) {
    const ua = u0 + ((u1 - u0) * i) / n, ub = u0 + ((u1 - u0) * (i + 1)) / n
    face(p, at(ua, arc(ua), true), at(ub, arc(ub), true), at(ub, zTop, true), at(ua, zTop, true), out)
    face(p, at(ua, arc(ua), false), at(ub, arc(ub), false), at(ub, zTop, false), at(ua, zTop, false), inv)
    face(p, at(ua, arc(ua), false), at(ub, arc(ub), false), at(ub, arc(ub), true), at(ua, arc(ua), true), [0, 0, -1])
  }
  return arc
}
/** An axis-aligned box, all six faces. */
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  face(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  face(p, [x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [0, 1, 0])
  face(p, [x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [-1, 0, 0])
  face(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
  face(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  face(p, [x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0], [0, 0, -1])
}
/** A rectangular beam from a to b, `w` wide (horizontal) and `h` deep, closed ends. */
function beam(p: Part, a: V3, b: V3, w: number, h: number) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const L = Math.hypot(...d), t: V3 = [d[0] / L, d[1] / L, d[2] / L]
  let s: V3 = [t[1], -t[0], 0]
  const sl = Math.hypot(...s) || 1
  s = [s[0] / sl, s[1] / sl, 0]
  const u: V3 = [s[1] * t[2] - s[2] * t[1], s[2] * t[0] - s[0] * t[2], s[0] * t[1] - s[1] * t[0]]
  const C = (o: V3, i: number, j: number): V3 => [o[0] + s[0] * i * w / 2 + u[0] * j * h / 2, o[1] + s[1] * i * w / 2 + u[1] * j * h / 2, o[2] + s[2] * i * w / 2 + u[2] * j * h / 2]
  const corners: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  for (let k = 0; k < 4; k++) {
    const [i0, j0] = corners[k], [i1, j1] = corners[(k + 1) % 4]
    const n: V3 = [s[0] * (i0 + i1) + u[0] * (j0 + j1), s[1] * (i0 + i1) + u[1] * (j0 + j1), s[2] * (i0 + i1) + u[2] * (j0 + j1)]
    face(p, C(a, i0, j0), C(a, i1, j1), C(b, i1, j1), C(b, i0, j0), n)
  }
  face(p, C(a, -1, -1), C(a, 1, -1), C(a, 1, 1), C(a, -1, 1), [-t[0], -t[1], -t[2]])
  face(p, C(b, -1, -1), C(b, 1, -1), C(b, 1, 1), C(b, -1, 1), t)
}

const lampPts: V3[] = []
const string = (path: V3[], step = 1.1) => {
  let L = 0
  for (let i = 1; i < path.length; i++) L += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1], path[i][2] - path[i - 1][2])
  lampPts.push(...along(path, Math.max(2, Math.round(L / step))))
}

for (const [a, b] of PORTALS) {
  const z0 = TOP(a), zp = z0 + PH, zc = zp + CH
  const front = a < 0 ? b : a // the face toward the opening
  const dir = a < 0 ? 1 : -1 // toward the opening
  // Four posts.
  for (const sx of [-1, 1]) for (const yy of [a, b]) {
    const yi = yy === a ? a : b - POST
    box(white, sx > 0 ? PW - POST : -PW, yi, sx > 0 ? PW : -PW + POST, yi + POST, z0, zp)
  }
  // Arched plates: the two end faces (across the road) and the two sides.
  for (const yy of [a, b]) {
    const s = yy === a ? -1 : 1, outer = yy, inner = yy - s * 0.35
    archPlate(white, -PW + POST, PW - POST, z0, zp, (u, z, o) => [u, o ? outer : inner, z], [0, s, 0])
  }
  for (const sx of [-1, 1]) {
    archPlate(white, a + POST, b - POST, z0, zp, (u, z, o) => [o ? sx * PW : sx * (PW - 0.35), u, z], [sx, 0, 0])
  }
  // Cornice: a slab a little proud all round.
  box(white, -PW - 0.2, a - 0.2, PW + 0.2, b + 0.2, zp, zc)
  // Lamps up the posts' outer edges, over the end arches and along the cornice.
  for (const sx of [-1, 1]) for (const yy of [a, b]) {
    const yo = yy === a ? a - 0.06 : b + 0.06
    string([[sx * (PW + 0.06), yo, z0 + 0.4], [sx * (PW + 0.06), yo, zp]])
  }
  for (const yy of [a, b]) {
    const yo = yy === a ? a - 0.24 : b + 0.24
    string([[-PW - 0.2, yo, zc + 0.05], [PW + 0.2, yo, zc + 0.05]])
  }
  for (const sx of [-1, 1]) string([[sx * (PW + 0.24), a - 0.2, zc + 0.05], [sx * (PW + 0.24), b + 0.2, zc + 0.05]])

  // Balance beams: pivot 0.5 m over the cornice at the portal's middle,
  // tips over the leaf's free end, tails out over the approach.
  const yc = (a + b) / 2, zpiv = zc + 0.5
  const tipY = MID - dir * 0.25, tailY = yc - dir * 7.0
  const tipZ = zpiv + 1.0, tailZ = zpiv - 1.0
  for (const sx of [-1, 1]) {
    const x = sx * (PW - 0.3)
    box(white, x - 0.25, yc - 0.3, x + 0.25, yc + 0.3, zc, zpiv - 0.3)
    beam(white, [x, tailY, tailZ], [x, tipY, tipZ], 0.5, 0.75)
    string([[x + sx * 0.3, tailY, tailZ + 0.4], [x + sx * 0.3, tipY, tipZ + 0.4]])
    // Chain from the tip down to the leaf end.
    rod(dark, [x, tipY - dir * 0.3, tipZ - 0.38], [sx * (LW + 0.1), MID - dir * 0.45, z0 + 0.4], 0.09, 4)
    // Struts: from the cornice's front and rear corners down to the deck.
    rod(dark, [sx * (PW - 0.1), front + dir * 0.1, zp - 0.3], [sx * (LW + 0.12), front + dir * 2.6, z0 + 0.45], 0.1, 4)
    const rear = a < 0 ? a : b
    rod(dark, [sx * (PW - 0.1), rear - dir * 0.1, zp - 0.3], [sx * (HW - 0.5), rear - dir * 3.4, z0 + 0.2], 0.1, 4)
  }
  // Cross beams tying the pair at the tip and the tail.
  for (const [yy, zz] of [[tipY - dir * 0.35, tipZ], [tailY + dir * 0.35, tailZ]] as [number, number][])
    beam(white, [-(PW - 0.3), yy, zz], [PW - 0.3, yy, zz], 0.45, 0.6)
}

// ---------------------------------------------------------------- bulb strings
// Deck edges (on the kerb line), both sides, over the fixed spans.
for (const s of [1, -1]) {
  for (const [y0, y1] of [[Y0 + 0.3, PIERS[0][0]], [PIERS[1][1], Y1 - 0.3]] as [number, number][]) {
    const path: V3[] = []
    for (let k = 0; k <= 12; k++) { const y = y0 + ((y1 - y0) * k) / 12; path.push([s * (HW + 0.06), y, TOP(y) + KERB - 0.05]) }
    string(path)
  }
  // Every arch, on both faces.
  for (const [a, b] of SPANS) {
    const path: V3[] = []
    for (let k = 1; k < 16; k++) { const y = a + ((b - a) * k) / 16; path.push([s * (HW + 0.06), y, soffit(y) + 0.1]) }
    string(path, 0.9)
  }
}
for (const p of lampPts) bead(lamps, p, 0.13, true)

// ---------------------------------------------------------------- write
finishModel('Magere Brug', 'amsterdam-magere-brug', [
  { part: white, material: finish('magere-white', 0xf2eee4) },
  { part: deck, material: finish('magere-paving', 0x9a7468) },
  { part: timber, material: finish('magere-timber', 0x5a5650) },
  { part: dark, material: finish('magere-iron', 0x4a4f57) },
  { part: lamps, material: { name: 'lamp', color: 0xf1ead6, roughness: 0.6 } },
], { bearing: 73.2, osm: 'way/601096321', height: 11.2 }, 6500)
