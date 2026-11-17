/**
 * Tokyo Skytree (東京スカイツリー), Sumida, Tokyo: procedural, CC0-1.0.
 * bun generators/tokyo-skytree.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/tokyo-skytree.glb, the low model: the lattice as an open 3D space
 *   frame of 12 columns and 11 storeys of rings and X-diagonals;
 * - models/tokyo-skytree.detail.glb, drawn from zoom 16: the same frame at
 *   twice the density (24 columns, 22 storeys), with thinner members.
 *
 * Map frame: x east, y north, z up, metres. Built with one corner of the
 * base triangle due north (+y); the placement's bearing (353) turns it to
 * OSM's corners at bearings 353, 113 and 233. The origin is the centre of
 * OSM's base triangle (way/557938593); y = 0 is the ground.
 *
 * Completed 2012 (Nikken Sekkei). A white steel lattice tower whose plan
 * morphs from an equilateral triangle at the foot (a tripod) to a circle
 * higher up, round a central reinforced-concrete shaft, carrying two
 * observation decks and a mast.
 *
 * Published (Wikipedia, "Tokyo Skytree"):
 * - 634 m overall; observatories at 350 m (Tembo Deck) and 450 m (Tembo
 *   Galleria, a spiral glass skywalk); cylindrical from about 350 m up;
 * - a central reinforced-concrete shaft, tied to the frame up to 125 m and
 *   damped to it up to 375 m;
 * - colour "Skytree White", a bluish white (aijiro);
 * - night illumination alternating sky-blue "Iki" and purple "Miyabi".
 *
 * OSM:
 * - way/288269147 outline (634 m, circle r 28.2 m);
 * - building:parts way/557938593 and way/557938595: the base triangle,
 *   corners at r 37.3-38.5 m (side ~65.5 m), turned -7 degrees;
 * - way/362351414 the tower/mast part (r ~3 m, 634 m);
 * - way/362351415 Tembo Deck 290-350 m (r 17.7 m) and way/288269148 Tembo
 *   Galleria 410-450 m (r 13 m). All within the outline, all replaced.
 *
 * From photos. "2019 Tokyo Skytree.jpg" (Kakidai, CC BY-SA 4.0) is a
 * distant, near-level view, scaled at 1.96 px/m: the base reads 66 m wide,
 * matching OSM's triangle, and the 634 m tip and 447 m Galleria give the
 * same scale.
 * - trunk projected width 66 m at the ground, 59 m at 60 m, 49 m at 120 m,
 *   45 m at 176 m, 41 m at 200 m, 37 m at 250 m, 33 m at 300 m, measured
 *   against the sky (below 150 m against the haze): a concave curve,
 *   half-width w = 15.5 + 17.5 (1 - z/360)^1.6. The pod's underside flares
 *   out from this waist from ~322 m;
 * - Tembo Deck pod 320-372 m: an inverted cone from the trunk's waist,
 *   42 m across at 329 m, 50 m at 341 m, widest ~58 m at 356-363 m, then a
 *   roof sloping in by 371 m (OSM's 35 m looks too small against every
 *   photo; the photos are followed);
 * - lattice between the decks ~30 m across;
 * - Galleria ring 439-461 m, ~36 m across (38 m at its flared underside);
 *   the lattice above it ~22 m across, to the mast at 497 m; the mast
 *   tapering from ~11 m to ~7 m, banded, under a ~11 m cap, to 634 m;
 * - the frame: columns on the surface, horizontal ring beams and X-bracing
 *   in every bay, heavier members at the three corners of the tripod.
 *
 * Estimated: the triangle-to-circle blend (complete by 320 m); the frame's
 * spacing (the real one is finer still: about 30 columns round, storeys of
 * ~10 m); member sizes, drawn heavier than real so the frame reads (low
 * model: legs 6 m at the foot, thinning to columns by 320 m, columns and
 * rings ~2.7 m, diagonals 2.3 m; detail model about two thirds of that); the
 * core, drawn at ~55% of the trunk's width up to 320 m, 14 m across to 372 m
 * and 10 m above (the shaft with its lifts and stairs and the lattice's inner
 * faces, which read as one pale mass inside the frame by day and glow in
 * the night scheme's colour; the shaft itself is not dimensioned); the
 * pods' profiles between the photo measurements; the mast's bands.
 * Left out: the elevator shafts and stairs inside the frame, the base
 * station and lobby (separate buildings in OSM), the Galleria's spiral tube.
 * Terrain: `tools/terrain.ts check` passes; elevation 0.
 *
 * Night: in the "Iki" scheme (Kakidai's "Tokyo Skytree at night (Iki).jpg",
 * CC BY-SA 3.0) the frame is washed warm white and the core glows sky blue
 * through it, filling most of the trunk's width. The frame, pods and mast
 * carry a white `floodlight` wash; the core is `neon-skytree-iki`, a pale sky
 * blue that reads as the shaded interior by day and glows blue at night (a
 * stronger blue would read blue by day). The decks' glazing is `window`:
 * the decks are open and lit at night, though under Iki they show dimmer,
 * ringed with blue LEDs, which are left out.
 *
 * Colours (photo, in sun): the lattice members are near white (#fcffff);
 * the pods and mast are a silver grey (#a0b1bf-#a7a9b6 in the photo, drawn
 * #c6ced6 since the map's lighting darkens them).
 *
 * Photos (Wikimedia Commons):
 * - "2019 Tokyo Skytree.jpg", Kakidai, CC BY-SA 4.0 (distant, proportions)
 * - "Tokyo Skytree (white).jpg", Kakidai, CC BY-SA 4.0 (night, decks, mast, frame)
 * - "Tokyo Skytree at night (Iki).jpg", Kakidai, CC BY-SA 3.0 (night colour, core)
 * - "Tokyo Skytree above Sumida.jpg", Sashimi-b, CC BY 4.0 (decks, from the west)
 * - "Aerial view of Tokyo Skytree, January 2025.jpg", Uraniwa, CC BY 4.0 (from above)
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const P = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]

/** A quad whose winding is chosen so it faces `out`, with per-corner normals. */
function face(p: Part, Q: V3[], N: V3[]) {
  const f = cross(sub(Q[1], Q[0]), sub(Q[2], Q[0]))
  const avg = N.reduce(add, [0, 0, 0] as V3)
  const [a, b, c, d] = dot(f, avg) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(Q[a], Q[b], Q[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(Q[a], Q[c], Q[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}

/** Surface of revolution from [r, z]; the left-hand side of the profile is outside. */
function lathe(profile: [number, number][], pick: (band: number) => Part, k: number, smooth = 40) {
  const bandN = profile.slice(0, -1).map(([r0, z0], b) => {
    const [r1, z1] = profile[b + 1]
    const er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
    return [ez / l, -er / l] as [number, number]
  })
  const cosLim = Math.cos((smooth * Math.PI) / 180)
  const vn = (b: number, end: 0 | 1): [number, number] => {
    const own = bandN[b], other = bandN[b + (end ? 1 : -1)]
    if (!other || own[0] * other[0] + own[1] * other[1] < cosLim) return own
    const s = [own[0] + other[0], own[1] + other[1]], l = Math.hypot(s[0], s[1])
    return [s[0] / l, s[1] / l]
  }
  for (let b = 0; b < profile.length - 1; b++) {
    const [r0, z0] = profile[b], [r1, z1] = profile[b + 1]
    if (r0 === 0 && r1 === 0) continue
    const part = pick(b)
    const n0 = vn(b, 0), n1 = vn(b, 1)
    const N = (n: [number, number], a: number): V3 => unit([n[0] * Math.cos(a), n[0] * Math.sin(a), n[1]])
    for (let s = 0; s < k; s++) {
      const a0 = (s / k) * TAU, a1 = ((s + 1) / k) * TAU
      const q = [P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z1), P(r1, a0, z1)]
      const nn = [N(n0, a0), N(n0, a1), N(n1, a1), N(n1, a0)]
      if (r0 === 0) part.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nn[0], nn[2], nn[3]])
      else if (r1 === 0) part.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nn[0], nn[1], nn[2]])
      else face(part, q, nn)
    }
  }
}

/**
 * A straight structural member from a to b: a prism of `sides` flat faces,
 * `r` from its axis to each edge, one edge turned outward from the tower's
 * axis so the faces either side of it catch the light. Open-ended: its ends
 * sit in the joints. Nothing goes below the ground.
 */
function member(p: Part, a: V3, b: V3, r: number, sides = 3) {
  const t = unit(sub(b, a))
  const mid = mul(add(a, b), 0.5)
  let out = unit([mid[0], mid[1], 0])
  if (Math.hypot(mid[0], mid[1]) < 1e-6) out = [1, 0, 0]
  // Make `out` perpendicular to the member.
  let u = sub(out, mul(t, dot(out, t)))
  if (Math.hypot(...u) < 1e-6) u = Math.abs(t[2]) < 0.9 ? unit(cross(t, [0, 0, 1])) : unit(cross(t, [1, 0, 0]))
  u = unit(u)
  const v = unit(cross(t, u))
  const off = (k: number): V3 => {
    const ang = (k / sides) * TAU
    return add(mul(u, r * Math.cos(ang)), mul(v, r * Math.sin(ang)))
  }
  const g = (q: V3): V3 => [q[0], q[1], Math.max(0, q[2])]
  for (let k = 0; k < sides; k++) {
    const o0 = off(k), o1 = off(k + 1)
    // Smooth normals: neighbouring faces share their edge vertices, which
    // halves the file size; a member this thin reads as a soft tube anyway.
    const n0 = unit(o0), n1 = unit(o1)
    face(p, [g(add(a, o0)), g(add(a, o1)), g(add(b, o1)), g(add(b, o0))], [n0, n1, n1, n0])
  }
}

// --------------------------------------------------------------- the shape ---
const TOP = 329            // the trunk meets the Tembo Deck pod
const BLEND_TOP = 320      // triangle fully rounded into a circle by here
/**
 * Projected half-width (photo): the trunk curves in, from 33 m at the ground
 * to a waist of ~16 m under the Tembo Deck, steep low down and nearly
 * straight above 250 m. Fits the photo's widths to within a metre.
 */
const halfW = (z: number) => 15.5 + 17.5 * (1 - z / 360) ** 1.6
const smoothstep = (t: number) => t * t * (3 - 2 * t)
const CORNER0 = Math.PI / 2 // a corner due north
/** The trunk's radius at angle a and height z: a triangle easing into a circle. */
function trunkR(a: number, z: number) {
  const w = halfW(Math.min(z, BLEND_TOP))
  const Rt = (2 * w) / Math.sqrt(3)           // a triangle seen face on is one side wide
  const m = (((a - CORNER0) % (TAU / 3)) + TAU / 3) % (TAU / 3)
  const rTri = (Rt * 0.5) / Math.cos(m - Math.PI / 3)
  const t = smoothstep(Math.min(1, z / BLEND_TOP))
  // The corners stay a little blunt even at the foot: the legs are broad.
  return Math.min(rTri, Rt * 0.94) * (1 - t) + w * t
}

type Sizes = { cols: number; storeys: number; leg: number; col: number; ring: number; diag: number; sides: number; k: number }
const LOW: Sizes = { cols: 12, storeys: 11, leg: 3.0, col: 1.4, ring: 1.3, diag: 1.15, sides: 3, k: 28 }
const DETAIL: Sizes = { cols: 24, storeys: 22, leg: 2.2, col: 0.95, ring: 0.85, diag: 0.7, sides: 3, k: 48 }

/**
 * A space frame on the surface `radius(angle, z)` from z0 to z1: `n` columns,
 * a ring beam at every storey, and X-diagonals in every bay. Columns at
 * `legEvery` (corner) positions get the heavier leg section.
 */
function frame(p: Part, radius: (a: number, z: number) => number, z0: number, z1: number, n: number, storeys: number, s: Sizes, legEvery = 0) {
  const node = (i: number, k: number): V3 => {
    const a = CORNER0 + (i / n) * TAU, z = z0 + ((z1 - z0) * k) / storeys
    return P(radius(a, z), a, z)
  }
  for (let k = 0; k < storeys; k++)
    for (let i = 0; i < n; i++) {
      const isLeg = legEvery > 0 && i % legEvery === 0
      // The legs thin into ordinary columns as the triangle rounds out.
      const legR = s.col + (s.leg - s.col) * Math.max(0, 1 - (z0 + ((z1 - z0) * (k + 0.5)) / storeys) / BLEND_TOP)
      member(p, node(i, k), node(i, k + 1), isLeg ? legR : s.col, isLeg ? 4 : s.sides)
      member(p, node(i, k + 1), node(i + 1, k + 1), s.ring, s.sides)
      member(p, node(i, k), node(i + 1, k + 1), s.diag, s.sides)
      member(p, node(i + 1, k), node(i, k + 1), s.diag, s.sides)
    }
  // The bottom ring (above ground level only on the upper frames).
  if (z0 > 0) for (let i = 0; i < n; i++) member(p, node(i, 0), node(i + 1, 0), s.ring, s.sides)
}

function build(s: Sizes) {
  const lattice = new Part() // the white space frame (floodlit)
  const core = new Part()    // the central shaft (glows Iki blue at night)
  const white = new Part()   // pods, mast and cladding (floodlit)
  const glass = new Part()   // deck glazing (lit)
  const bands = new Part()   // the mast's darker antenna bands
  const K = s.k

  // The trunk: an open frame round the core, the three corners as legs.
  frame(lattice, trunkR, 0, TOP, s.cols, s.storeys, s, s.cols / 3)
  // The glow inside the frame: the shaft and the lit inner faces of the
  // lattice, which by day read as a pale mass behind the members and at
  // night fill the trunk with the scheme's colour (Iki photo). Drawn as one
  // surface at ~55% of the trunk's width.
  const coreProfile: [number, number][] = []
  for (const z of [0, 110, 220, 320]) coreProfile.push([Math.max(7, 0.55 * halfW(z)), z])
  coreProfile.push([7, 372], [0, 372])
  lathe(coreProfile, () => core, 12)

  // Tembo Deck pod (photo): an inverted cone flaring steadily out of the
  // trunk's waist from ~320 m, its window band on the slope at 339-351 m,
  // widest (~58 m) at 356-363 m, and a sloped roof in to the frame above.
  const R_TOP = halfW(BLEND_TOP)
  lathe([[R_TOP - 0.3, 319], [18.6, 323], [24, 339]], () => white, K)
  lathe([[24, 339], [27.6, 351]], () => glass, K)
  lathe([[27.6, 351], [29, 356], [29, 363], [27.5, 366], [23, 369], [15.5, 372]], () => white, K, 50)

  // The frame between the decks round the upper shaft, narrowing from ~31 m
  // across over the pod to ~25 m under the Galleria (photo).
  const UP0 = 372, UP1 = 437, R_UP0 = 15.5, R_UP = 12.5
  frame(lattice, (_a, z) => R_UP0 + ((R_UP - R_UP0) * Math.min(1, (z - UP0) / 58)), UP0, UP1, Math.round(s.cols * 0.84), Math.round(s.storeys * 0.28), s)
  lathe([[5, UP0], [5, 497]], () => core, 12)

  // Tembo Galleria: a flared underside, a glass ring, and its roof.
  // (photo: 38 m across at the underside's lip at 440 m, the glass leaning in
  // from 36 to 34 m, the roof sloping in to the frame above by 461 m)
  lathe([[R_UP - 0.2, 433], [18.9, 440], [17.9, 442]], () => white, K)
  lathe([[17.9, 442], [16.9, 451]], () => glass, K)
  lathe([[16.9, 451], [17.2, 452], [17, 454], [14, 457], [10.8, 461], [10.8, 462]], () => white, K, 50)

  // The frame above the Galleria, tapering a little to the mast.
  const TOPL0 = 462, TOPL1 = 497
  frame(lattice, (_a, z) => 10.8 - (0.8 * (z - TOPL0)) / (TOPL1 - TOPL0), TOPL0, TOPL1, Math.round(s.cols * 0.67), Math.max(2, Math.round(s.storeys * 0.18)), s)
  lathe([[10, TOPL1], [10.6, 498], [10.6, 500], [5.2, 502]], () => white, 24, 50)

  // The gain tower: a white mast, a darker band every 16 m (its antenna
  // sections), and a cap.
  const mastR = (z: number) => 5.2 - (1.6 * (z - 502)) / 112
  for (let z = 502; z < 612; z += 16) {
    const r0 = mastR(z), r1 = mastR(z + 12.5)
    lathe([[r0, z], [r1, z + 12.5]], () => white, 16)
    lathe([[r1, z + 12.5], [r1 + 0.4, z + 13], [r1 + 0.4, z + 16]], () => bands, 16, 30)
  }
  lathe([[mastR(608.5) + 0.4, 614], [5.4, 615], [5.4, 626], [4.0, 628.5], [2.2, 631.5], [0.6, 634], [0, 634]], () => white, 16, 40)

  // Colours from daylight photos: Skytree White is a pale bluish white.
  const lit = (_p: V3, n: V3) => (n[2] > 0.8 ? 0.35 : 0.95)
  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: lattice, material: { ...finish('skytree-white', 0xeef4f8), floodlight: lit } },
    { part: core, material: finish('neon-skytree-iki', 0xa9c3da) },
    { part: white, material: { ...PALETTE.trim, color: 0xc6ced6, floodlight: lit } },
    { part: glass, material: PALETTE.window },
    { part: bands, material: finish('skytree-band', 0xa6b3bd) },
  ]
  return parts
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Tokyo Skytree', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 353, elevation: 0, height: 634,
  })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

await write('tokyo-skytree.glb', build(LOW), 6500, 250_000)
await write('tokyo-skytree.detail.glb', build(DETAIL), 40_000, 1536 * 1024)
