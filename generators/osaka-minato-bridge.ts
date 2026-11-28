/**
 * Minato Bridge (港大橋, Minato Ōhashi), Port of Osaka: procedural, CC0-1.0.
 * bun generators/osaka-minato-bridge.ts
 *
 * One model for the whole structure inside its OSM `man_made=bridge`
 * outline (way/574361955, 1,433 m by 22 m, bridge:structure=truss): the
 * three-span double-deck Gerber truss (235 + 510 + 235 m) on its two main
 * piers and two end piers, and the approach viaducts to the outline's ends
 * on both banks. The roadways (Hanshin Expressway, two decks) are the map's;
 * nothing here draws a road surface. Floor beams and the approach girders
 * stand just under the roadway heights below.
 *
 * Writes two levels of detail in the same frame:
 * - models/osaka-minato-bridge.glb (low, ≤ 6,500 triangles): both truss
 *   planes as real members (top chord, deck-truss bottom chord, the arched
 *   lower chords over the main piers, a vertical and a diagonal in every
 *   other panel, the deep web over the piers), top struts and floor beams,
 *   the piers, the approach piers and girders;
 * - models/osaka-minato-bridge.detail.glb (≤ 40,000): every panel's
 *   vertical and diagonal, counter-diagonals over the piers, the mid-height
 *   chord between the decks, top lateral X bracing, sway frames, both decks'
 *   floor beams, and the lights along the top chords (lamp).
 *
 * Frame: x across (east-ish +), y along the bridge (north-north-east +), z
 * up, metres; origin on the water at the outline's centre. Bearing 27.88,
 * the outline's long axis.
 *
 * Published (ja.wikipedia "港大橋"): opened 1974; a three-span Gerber truss,
 * 235 + 510 + 235 = 980 m; 19.3 m wide; 81.5 m high; 51 m clearance under
 * the girder; the trusses 68.5 m deep over the supports; one colour, red.
 * Upper deck: Route 4 Wangan (to Izumisano) and Route 16; lower deck: Route
 * 4 Wangan and Route 5 Wangan (to Kobe).
 *
 * OSM (© OpenStreetMap contributors, ODbL): way/574361955 (the outline);
 * the carriageways way/111784900 (16, layer 3), way/111784902 (4, layer 3),
 * way/111784901 (4, layer 2), way/435242186 (5, layer 2): layer 3 the upper
 * deck, layer 2 the lower; none carries `ele` or a height.
 *
 * Placing the spans: the map's terrain (Mapterhorn z14) along the axis shows
 * open water from y = -320 to y = +140 and the two banks beyond, so the main
 * span is centred at y = -80, its piers at y = +175 (on the north bank's
 * edge) and y = -335 (the south bank's edge), the end piers at y = +410
 * and y = -570; the approaches run to the outline's ends at ±716.
 *
 * Measured on ignis's side-on view ("Minato Ohashi Osaka JPN 001", scaled
 * on the 510 m span, 1.73 px/m): the top chord about 80 m at mid-span,
 * 75-76 m over the main piers and 66 m at the end piers (a gentle crest);
 * the deck truss's lower chord 51-52 m along the whole length (the
 * clearance); the arched lower chords springing from the main piers about
 * 6 m above the water and meeting the deck truss about 156 m into the main
 * span and 214 m into the side spans (a curve steep at the pier, 26 m up
 * 40 m out, easing into the chord); panels about 17 m; a post at each main
 * pier standing about 9 m above the top chord.
 *
 * Roadway heights the model is built to (estimated; no lidar in Japan and
 * no `ele` in OSM): the lower deck 1.0 m above the deck truss's lower chord
 * (about 52.5 m at mid-span), the upper deck 13 m higher (about 65 m),
 * following the chords; on the approaches both fall at 4 % from the truss
 * ends towards the outline's ends. The map's roadways will meet the model
 * only once `ele` tags (docs/bridge-heights.md) put them there; recorded
 * here so they can be.
 *
 * Colour: the red sampled sunlit #c4323b-#d0463f (ignis, Hiroshi Nakai),
 * re-sampled after review on KENPEI's close view
 * (#842530 overall, #b73b49 sunlit), drawn a crimson #b0323c; the piers and approach
 * girders concrete and grey steel.
 *
 * Night (Insightwm, from the Sakishima Building): lights along the top
 * chords and the deck edges: `lamp` beads in the detail model; the red steel
 * carries a gentle floodlight wash.
 *
 * Estimated: member sizes (drawn heavy, as the photos show them, so the
 * truss reads as a deep red band: chords 2.9 m boxes, web 1.7 m, arched
 * chords 3.9 m in the low model; a little lighter in the detail model), the arch curves (1 - (1 - t)^1.9, fitted to three points),
 * the approach girders' depth and pier spacing (about 40 m), the decks'
 * heights, the piers' size (main 34 x 14 m, end 26 x 4 m).
 *
 * Photos (Wikimedia Commons):
 * - "Minato Ohashi Osaka JPN 001.jpg", ignis, CC BY-SA 3.0 (side-on profile)
 * - "Minato Bridge 1181716.jpg", "1181776", "1181750", "1181833", "1181784 パノラマ写真", Hiroshi Nakai, CC BY 2.0 (profile, members, piers)
 * - "Minato Ohashi Osaka1.jpg", KENPEI, CC BY-SA 3.0 (the arched chord over a main pier, close)
 * - "Minato Bridge.jpg", Likadog from Taiwan, CC BY 2.0 (underside, lower deck)
 * - "Minato Bridge (15917537615).jpg", rsakaism, CC BY-SA 2.0 (panorama)
 * - "MinatoOhashi01.jpg", ＋－, CC BY-SA 3.0 (side view)
 * - "Night view of Osaka Minato Bridge from Sakishima Building Observatory", Insightwm, CC BY-SA 4.0 (night)
 * Look-only: none.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'

const TAU = Math.PI * 2
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

function face(p: Part, Q: V3[], N: V3[]) {
  const f = cross(sub(Q[1], Q[0]), sub(Q[2], Q[0]))
  const s = add(add(N[0], N[1]), add(N[2], N[3]))
  const [a, b, c, d] = dot(f, s) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(Q[a], Q[b], Q[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(Q[a], Q[c], Q[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}
/** A member a→b: a box section (sides 4) or a triangle (3), of half-size r. */
function member(p: Part, a: V3, b: V3, r: number, sides = 4) {
  const t = unit(sub(b, a))
  let u = Math.abs(t[0]) < 0.9 ? cross(t, [1, 0, 0]) : cross(t, [0, 0, 1])
  u = unit(u)
  const v = unit(cross(t, u))
  const off = (k: number): V3 => {
    const ang = (k / sides) * TAU + (sides === 4 ? Math.PI / 4 : Math.PI / 2)
    return add(mul(u, r * Math.cos(ang)), mul(v, r * Math.sin(ang)))
  }
  const g = (q: V3): V3 => [q[0], q[1], Math.max(0, q[2])]
  for (let k = 0; k < sides; k++) {
    const o0 = off(k), o1 = off(k + 1)
    face(p, [g(add(a, o0)), g(add(a, o1)), g(add(b, o1)), g(add(b, o0))], [unit(o0), unit(o1), unit(o1), unit(o0)])
  }
}
/** An axis-aligned box from min to max corner. */
function box(p: Part, lo: V3, hi: V3, skipBottom = true) {
  const P = (i: number, j: number, k: number): V3 => [i ? hi[0] : lo[0], j ? hi[1] : lo[1], k ? hi[2] : lo[2]]
  const F: Array<[V3[], V3]> = [
    [[P(1, 0, 0), P(1, 1, 0), P(1, 1, 1), P(1, 0, 1)], [1, 0, 0]], [[P(0, 0, 0), P(0, 0, 1), P(0, 1, 1), P(0, 1, 0)], [-1, 0, 0]],
    [[P(0, 1, 0), P(0, 1, 1), P(1, 1, 1), P(1, 1, 0)], [0, 1, 0]], [[P(0, 0, 0), P(1, 0, 0), P(1, 0, 1), P(0, 0, 1)], [0, -1, 0]],
    [[P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)], [0, 0, 1]],
  ]
  if (!skipBottom) F.push([[P(0, 0, 0), P(0, 1, 0), P(1, 1, 0), P(1, 0, 0)], [0, 0, -1]])
  for (const [q, n] of F) face(p, q, [n, n, n, n])
}
function bead(p: Part, c: V3, r: number) {
  const X: V3[] = [[r, 0, 0], [0, r, 0], [-r, 0, 0], [0, -r, 0]]
  const top = add(c, [0, 0, r]), bot = add(c, [0, 0, -r])
  for (let i = 0; i < 4; i++) {
    const a = add(c, X[i]), b = add(c, X[(i + 1) % 4])
    p.tri(a, b, top)
    p.tri(b, a, bot)
  }
}

// ------------------------------------------------------------ the shape ---
const C = -80              // mid-span, along y
const HALF_MAIN = 255, END = 490
const HALF_W = 9.65        // truss planes from the centre line (19.3 m wide)
const END_N = 716.4, END_S = -716.4 // the outline's ends
/** Top chord over u (from mid-span). */
const zTop = (u: number) => 80 - 14 * (u / END) ** 2
/** The deck truss's lower chord. */
const zBot = (u: number) => 51 + 1.2 * (u / END) ** 2
/** The arched lower chords: from the pier foot (z 6) to the deck truss. */
const MAIN_MEET = 156, SIDE_MEET = 214
function zArch(u: number): number | null {
  const a = Math.abs(u)
  const d = a - HALF_MAIN
  const reach = d < 0 ? MAIN_MEET : SIDE_MEET
  if (Math.abs(d) > reach) return null
  const t = Math.abs(d) / reach // 0 at the pier, 1 where it meets the deck truss
  return 6 + (zBot(u) - 6) * (1 - (1 - t) ** 1.9)
}
const LOWER_DECK = (u: number) => zBot(u) + 1.0
const UPPER_DECK = (u: number) => zBot(u) + 14.0

/** Panel points along u: 15 panels a half main span, 14 a side span. */
function panelPoints(): number[] {
  const pts: number[] = []
  for (let k = -15; k <= 15; k++) pts.push((k * HALF_MAIN) / 15)
  for (let k = 1; k <= 14; k++) {
    pts.push(HALF_MAIN + (k * (END - HALF_MAIN)) / 14)
    pts.push(-HALF_MAIN - (k * (END - HALF_MAIN)) / 14)
  }
  return pts.sort((a, b) => a - b)
}

type Lod = { detail: boolean; chord: number; web: number; brace: number }
const LOW: Lod = { detail: false, chord: 1.45, web: 0.85, brace: 0.55 }
const DETAIL: Lod = { detail: true, chord: 1.3, web: 0.7, brace: 0.4 }

function build(s: Lod) {
  const red = new Part()
  const concrete = new Part()
  const grey = new Part()
  const lamps = new Part()
  const U = panelPoints()
  const P = (x: number, u: number, z: number): V3 => [x, C + u, z]

  for (const x of [-HALF_W, HALF_W]) {
    // chords
    for (let i = 0; i < U.length - 1; i++) {
      const a = U[i], b = U[i + 1]
      member(red, P(x, a, zTop(a)), P(x, b, zTop(b)), s.chord)
      member(red, P(x, a, zBot(a)), P(x, b, zBot(b)), s.chord * 0.85)
      if (s.detail) member(red, P(x, a, (zTop(a) + zBot(a)) / 2 + 1), P(x, b, (zTop(b) + zBot(b)) / 2 + 1), s.web * 0.7)
      const za = zArch(a), zb = zArch(b)
      if (za !== null && zb !== null && Math.abs(Math.abs(a) - HALF_MAIN) < Math.abs(Math.abs(b) - HALF_MAIN) + 400) {
        // the arched chord, finer than the panels
        const n = s.detail ? 3 : 2
        for (let k = 0; k < n; k++) {
          const ua = a + ((b - a) * k) / n, ub = a + ((b - a) * (k + 1)) / n
          const zA = zArch(ua), zB = zArch(ub)
          if (zA !== null && zB !== null) member(red, P(x, ua, zA), P(x, ub, zB), s.chord * 1.35)
        }
      }
    }
    // web: verticals and diagonals in the deck truss, and down to the arches
    for (let i = 0; i < U.length; i++) {
      const u = U[i]
      const every = true
      member(red, P(x, u, zBot(u)), P(x, u, zTop(u)), s.web, s.detail ? 4 : 3)
      const za = zArch(u)
      if (za !== null && zBot(u) - za > 1) member(red, P(x, u, za), P(x, u, zBot(u)), s.web * 1.1)
      if (i < U.length - 1) {
        const v = U[i + 1]
        const up = (u < 0) !== (i % 2 === 0)
        member(red, P(x, u, up ? zBot(u) : zTop(u)), P(x, v, up ? zTop(v) : zBot(v)), s.web * 0.95, 3)
        if (s.detail) member(red, P(x, u, up ? zTop(u) : zBot(u)), P(x, v, up ? zBot(v) : zTop(v)), s.web * 0.6, 3)
        const zb = zArch(v)
        if (za !== null && zb !== null && zBot(u) - za > 1 && zBot(v) - zb > 1 && (s.detail || i % 2 === 0)) {
          member(red, P(x, u, za), P(x, v, zBot(v)), s.web, 3)
          if (s.detail) member(red, P(x, u, zBot(u)), P(x, v, zb), s.web * 0.8, 3)
        }
      }
    }
    // the posts over the main piers, from the foot to above the top chord
    for (const u of [-HALF_MAIN, HALF_MAIN]) member(red, P(x, u, 6), P(x, u, zTop(u) + 9), s.chord * 1.4)
  }

  // cross members: top struts, floor beams under both decks, sway frames
  for (let i = 0; i < U.length; i++) {
    const u = U[i]
    if (s.detail || i % 2 === 0) member(red, P(-HALF_W, u, zTop(u)), P(HALF_W, u, zTop(u)), s.brace, s.detail ? 4 : 3)
    if (s.detail || i % 2 === 0) member(red, P(-HALF_W, u, LOWER_DECK(u) - 0.6), P(HALF_W, u, LOWER_DECK(u) - 0.6), s.brace, s.detail ? 4 : 3)
    if (s.detail) {
      member(red, P(-HALF_W, u, UPPER_DECK(u) - 0.6), P(HALF_W, u, UPPER_DECK(u) - 0.6), s.brace)
      if (i < U.length - 1) {
        const v = U[i + 1]
        member(red, P(-HALF_W, u, zTop(u)), P(HALF_W, v, zTop(v)), s.brace * 0.7, 3)
        member(red, P(HALF_W, u, zTop(u)), P(-HALF_W, v, zTop(v)), s.brace * 0.7, 3)
      }
      if (i % 3 === 0) {
        // a sway frame: knee braces under the top struts
        member(red, P(-HALF_W, u, zTop(u) - 6), P(-HALF_W + 4, u, zTop(u)), s.brace * 0.8, 3)
        member(red, P(HALF_W, u, zTop(u) - 6), P(HALF_W - 4, u, zTop(u)), s.brace * 0.8, 3)
      }
    }
    const za = zArch(u)
    if (za !== null && (s.detail || i % 2 === 0) && zBot(u) - za > 6) member(red, P(-HALF_W, u, za), P(HALF_W, u, za), s.brace)
  }
  // portals over the main piers
  for (const u of [-HALF_MAIN, HALF_MAIN]) {
    member(red, P(-HALF_W, u, 10), P(HALF_W, u, 10), s.chord)
    member(red, P(-HALF_W, u, 10), P(HALF_W, u, 40), s.web, 3)
    member(red, P(HALF_W, u, 10), P(-HALF_W, u, 40), s.web, 3)
  }

  // piers: the main piers (concrete caissons to 6 m), the end piers (portals)
  for (const u of [-HALF_MAIN, HALF_MAIN]) box(concrete, [-17, C + u - 7, 0], [17, C + u + 7, 6])
  for (const u of [-END, END]) {
    for (const x of [-HALF_W, HALF_W]) box(concrete, [x - 2, C + u - 2, 0], [x + 2, C + u + 2, zBot(u) - 1])
    box(concrete, [-HALF_W - 2.5, C + u - 2.5, zBot(u) - 3], [HALF_W + 2.5, C + u + 2.5, zBot(u) - 0.8])
  }

  // approaches: grey girders under both decks on twin-column piers, the
  // roadways falling at 4 % from the truss ends to the outline's ends
  for (const [y0, y1] of [[C + END, END_N], [C - END, END_S]]) {
    const dir = Math.sign(y1 - y0), len = Math.abs(y1 - y0)
    const u0 = (y0 - C)
    const lower = (d: number) => LOWER_DECK(u0) - 0.04 * d
    const upper = (d: number) => UPPER_DECK(u0) - 0.04 * d
    const n = Math.max(1, Math.round(len / (s.detail ? 40 : 56)))
    for (let k = 0; k < n; k++) {
      const da = (k * len) / n, db = ((k + 1) * len) / n
      for (const [deck, depth] of [[lower, 2.6], [upper, 2.6]] as Array<[(d: number) => number, number]>) {
        // a girder as a sloped box: two quads a side and a soffit
        const A: V3 = [0, y0 + dir * da, deck(da) - 0.3], B: V3 = [0, y0 + dir * db, deck(db) - 0.3]
        const w = HALF_W - 0.5
        const q = (pt: V3, x: number, dz: number): V3 => [x, pt[1], pt[2] + dz]
        face(grey, [q(A, -w, 0), q(B, -w, 0), q(B, -w, -depth), q(A, -w, -depth)], Array(4).fill([-1, 0, 0]))
        face(grey, [q(A, w, 0), q(A, w, -depth), q(B, w, -depth), q(B, w, 0)], Array(4).fill([1, 0, 0]))
        face(grey, [q(A, -w, -depth), q(B, -w, -depth), q(B, w, -depth), q(A, w, -depth)], Array(4).fill([0, 0, -1]))
      }
      // the pier at the far end of the bay: two columns and the upper deck's cross head
      const d = db
      if (k === n - 1 && Math.abs(len - d) < 1) continue
      const y = y0 + dir * d
      for (const x of [-HALF_W + 1.5, HALF_W - 1.5]) box(concrete, [x - 1.3, y - 1.3, 0], [x + 1.3, y + 1.3, upper(d) - 2.9])
      box(concrete, [-HALF_W, y - 1.6, lower(d) - 4.4], [HALF_W, y + 1.6, lower(d) - 2.9])
      box(concrete, [-HALF_W, y - 1.6, upper(d) - 4.4], [HALF_W, y + 1.6, upper(d) - 2.9])
    }
  }

  // lights along the top chords (detail)
  if (s.detail) for (const x of [-HALF_W - 0.4, HALF_W + 0.4]) for (let u = -END; u <= END; u += 8.5) bead(lamps, P(x, u, zTop(u) + 0.8), 0.35)

  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: red, material: { ...finish('minato-red', 0xb0323c), floodlight: (_p, n) => (n[2] > 0.8 ? 0.15 : 0.35) } },
    { part: concrete, material: finish('pier-concrete', 0xc9c6bf) },
    { part: grey, material: finish('approach-steel', 0xa3a8ad) },
  ]
  if (lamps.triangles) parts.push({ part: lamps, material: finish('lamp-bridge', 0xd8d4c8) })
  return parts
}

async function write(file: string, lod: Lod, maxTris: number, maxBytes: number) {
  const parts = build(lod)
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Minato Bridge', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 27.88, height: 85,
  })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length}`)
  await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
  console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
}

if (import.meta.main) {
  await write('osaka-minato-bridge.glb', LOW, 6500, 250_000)
  await write('osaka-minato-bridge.detail.glb', DETAIL, 40_000, 1536 * 1024)
}
