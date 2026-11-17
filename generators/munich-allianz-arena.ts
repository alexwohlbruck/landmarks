/**
 * Allianz Arena (Herzog & de Meuron with ArupSport, opened 2005), Munich-
 * Fröttmaning: original procedural geometry, CC0-1.0.
 * bun generators/munich-allianz-arena.ts
 *
 * Writes two levels of detail in the same frame:
 *  - models/munich-allianz-arena.glb: the skin as 36 x 22 = 792 inflated
 *    diamond cushions (about a third of the real count), each a real 3D
 *    pillow of four smooth-shaded facets puffed 1.1 m off the surface;
 *  - models/munich-allianz-arena.detail.glb (from zoom 17): the real panel
 *    density, 64 x 42 = 2,688 cushions (published 2,760), each eight facets
 *    puffed 0.7 m.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground (pitch and street level). Anchor = area centroid of OSM way/
 * 1257847557, the outer ring of relation/18413487 ("widest outline of the
 * stadium"): 48.2187923, 11.6247014. (The batch plan's 11.62362 is 80 m west
 * of it, on the esplanade.) Bearing 343.5: the outline's principal axis; in
 * this frame the outline is a superellipse, half-axes 113.4 (x) by 129.6 (y),
 * exponent 3, symmetric about both axes to within 0.5 m.
 *
 * Identity, in order: the rounded "rubber dinghy" skin of inflated diamond
 * cushions, bulging out at mid-height and tucking in at the foot and over
 * the shoulder; the roof ring of the same cushions, open over the pitch; the
 * skin standing on a dark glazed ground floor over the esplanade; inside,
 * three steep tiers under the roof (grey lower, red middle and upper).
 *
 * Evidence
 *  - OSM (ODbL): relation/18413487 (stadium, height 52, building:min_level 2,
 *    outer way/1257847557, inner way/605825026 = the roof's inside edge,
 *    x +-42.8, y +-60.9, a superellipse of exponent about 4);
 *    relation/142277 (transparent flatter roof, outer way/1344678555 at
 *    x +-101, y +-116.8, height 52); relation/17308579 (outer roof part, cone,
 *    min_height 35, height 52); relation/18450456 (basement, levels 0-1,
 *    height 8, outer way/4431170 = the arena's outline at plaza level,
 *    x +-103.6, y +-119.2); relation/7115751 (the esplanade around it,
 *    min_height 7.5, height 8.5; left to the map); 125 grandstand parts
 *    (lower tier min 1 / height 8, inner edge x +-41.5, y +-59.8, outer
 *    62.7 / 80.7; middle 10-19, 61 / 79 to 83.4 / 99.5; upper 25-38, 78.7 /
 *    98.3 to 106.5 / 122.7) and 37 roof parts (12-35) inside the outline;
 *    the pitch way/123121774, 68 x 105 m.
 *  - Published (en.wikipedia "Allianz Arena"): 2,760 ETFE air cushions; three
 *    tiers; grey seats replaced by red and white; each panel lit white, red or
 *    blue, red for Bayern. Height 52 m (OSM; de.wikipedia gives 50 m).
 *  - Terrain (Mapterhorn): pitch 1.9 m, surroundings 2-3 m above the lowest
 *    point, so the field is at street level: elevation 0. The terrain also
 *    carries the lower bowl (to 10.8 m) as ground; the map fills it from
 *    outside.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - Richard Bartz, "Allianz arena daylight Richard Bartz.jpg", CC BY-SA 2.5:
 *      from the north-west hill, the section (foot tucked in about 11 m, widest
 *      at about 45 % of the skin's height, rolling over at the top) and the
 *      dark glazed band under the skin. https://commons.wikimedia.org/wiki/File:Allianz_arena_daylight_Richard_Bartz.jpg
 *    - Richard Bartz, "Allianz arena at night Richard Bartz.jpg", CC BY-SA 2.5:
 *      the side wall lit, the roof top dark. https://commons.wikimedia.org/wiki/File:Allianz_arena_at_night_Richard_Bartz.jpg
 *    - Tobias Alt, "Allianz-Arena-München.jpg", CC BY-SA 4.0: the same view in
 *      daylight; cushion rows and proportions. https://commons.wikimedia.org/wiki/File:Allianz-Arena-M%C3%BCnchen.jpg
 *    - Phuoc Nguyen, "München - Allianz-Arena (Luftbild) (25205631686).jpg",
 *      CC BY-SA 2.0: aerial from the south-west; the roof ring, the opening,
 *      the dark vent cushions near the shoulder, the esplanade. https://commons.wikimedia.org/wiki/File:M%C3%BCnchen_-_Allianz-Arena_(Luftbild)_(25205631686).jpg
 *    - Martin Falbisoner, "Allianz Arena Exterior Detail.JPG", CC BY-SA 4.0: the
 *      cushions' shape, about 2.3 : 1 wide. https://commons.wikimedia.org/wiki/File:Allianz_Arena_Exterior_Detail.JPG
 *    - Flocci Nivis, "20200228 Allianz Arena 02.jpg", CC BY 4.0: level view
 *      from the north. https://commons.wikimedia.org/wiki/File:20200228_Allianz_Arena_02.jpg
 *    - HerrAdams, "München, Allianz Arena, innen 2019-11 (3).jpg", CC BY-SA 4.0:
 *      the bowl, grey lower tier, red middle and upper tiers, dark roof
 *      underside. https://commons.wikimedia.org/wiki/File:M%C3%BCnchen,_Allianz_Arena,_innen_2019-11_(3).jpg
 *  No look-only sources, no commercial imagery, no 3D city models. No lidar
 *  in Germany.
 *
 * Numbers: plan, roof opening and tier rings measured from OSM (above).
 * Heights: top 52 (OSM); tiers from the OSM parts; esplanade 8.5 (OSM). The
 * skin's section is estimated from the Bartz and Alt photos, scaled by the
 * 40.5 m of skin over the dark band: foot 11.5 m (3 m of glazed band over the
 * esplanade), widest at 29 m, a squarish roll (superellipse section,
 * exponent 2.6, 21 m tall, 29 m deep) reaching 50 m (52.5 m with the
 * cushions' puff), then a near-flat roof rising 0.8 m to the opening (the
 * far rim hides the bowl in the level photos), with a 7 m fascia and a dark
 * underside down to the upper tier's back (estimated). Where the lit wall ends and the dark transparent roof
 * starts (z 49) is estimated from the night photo and OSM's transparent part.
 *
 * Night: the side wall is `neon-arena`, which glows in its own colour. The
 * pipeline draws neon in its daylight colour, so it glows white (the
 * national-team colour), not Bayern red: a red-by-night, white-by-day skin
 * needs a night colour the material contract doesn't have. The roof's
 * transparent cushions stay dark; the glazed ground floor is `window`.
 *
 * Simplified or left out: the "Allianz Arena" signs, the stairs and bridges
 * up to the esplanade, the floodlights, screens and seat lettering, the
 * roller blinds; the tiers are smooth slopes (no rows, no vomitories).
 * Doubts: the roof's exact section between the shoulder and the opening;
 * the grey vent cushions near the shoulder are scattered as in the aerial,
 * not counted one by one.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const ID = 'munich-allianz-arena'

// --- Plan: superellipses sharing one parameter, sampled by arc length on the outline.
const se = (a: number, b: number, n: number, t: number): XY => {
  const c = Math.cos(t), s = Math.sin(t)
  return [a * Math.sign(c) * Math.abs(c) ** (2 / n), b * Math.sign(s) * Math.abs(s) ** (2 / n)]
}
const OA = 113.4, OB = 129.6, ON = 3 // outline
const HA = 42.8, HB = 60.9, HN = 4 // roof opening
/** Parameters t for m points evenly spaced along the outline, from the east point. */
function evenT(m: number): number[] {
  const K = 8000, cum = [0]
  let prev = se(OA, OB, ON, 0)
  for (let i = 1; i <= K; i++) {
    const p = se(OA, OB, ON, (i / K) * 2 * Math.PI)
    cum.push(cum[i - 1] + Math.hypot(p[0] - prev[0], p[1] - prev[1]))
    prev = p
  }
  const L = cum[K], out: number[] = []
  let j = 0
  for (let k = 0; k < m; k++) {
    const target = (k / m) * L
    while (cum[j + 1] < target) j++
    const f = (target - cum[j]) / (cum[j + 1] - cum[j] || 1)
    out.push(((j + f) / K) * 2 * Math.PI)
  }
  return out
}

// --- The skin's meridian: an elliptical roll, then the roof to the opening.
const ZC = 29, RZ = 21, RS = 0.26, SM = 2.6 // roll centre height, vertical radius, depth (fraction of the outline), squareness
const pw = (c: number) => Math.sign(c) * Math.abs(c) ** (2 / SM)
/** The roll as a superellipse section: phi -90 (under) to 90 (top). */
const rollS = (phi: number) => 1 - RS + RS * pw(Math.cos(phi))
const rollZ = (phi: number) => ZC + RZ * pw(Math.sin(phi))
const PHI0 = -Math.asin(((ZC - 11.5) / RZ) ** (SM / 2)) // the foot, z 11.5
const Z_TOP = ZC + RZ // 50; the roof rises 0.8 to the opening and the cushions puff to about 52.5
const S_TOP = 1 - RS // ring scale where the roll turns flat
const ROOF_DROP = -0.8 // the roof rises a little toward the opening

/** A point of the skin: u in [0, 1) round the plan (as a t), v in [0, 1] along the meridian. */
function makeSkin(vWall: number) {
  return (t: number, v: number): V3 => {
    if (v <= vWall) {
      const phi = PHI0 + (Math.PI / 2 - PHI0) * (v / vWall)
      const s = rollS(phi)
      const p = se(OA * s, OB * s, ON, t)
      return [p[0], p[1], rollZ(phi)]
    }
    const w = (v - vWall) / (1 - vWall)
    const a = se(OA * S_TOP, OB * S_TOP, ON, t), b = se(HA, HB, HN, t)
    // ease out of the roll so the roof meets it without a kink
    const e = w
    return [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e, Z_TOP - ROOF_DROP * w * w]
  }
}

/** Meridian split: the wall's arc length against the roof's, at the long axis. */
function wallShare(): number {
  const f = makeSkin(0.5)
  const t = Math.PI / 2
  let wl = 0, rl = 0
  for (let i = 0; i < 400; i++) {
    const a = f(t, (i / 400) * 0.5), b = f(t, ((i + 1) / 400) * 0.5)
    wl += Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])
    const c = f(t, 0.5 + (i / 400) * 0.5), d = f(t, 0.5 + ((i + 1) / 400) * 0.5)
    rl += Math.hypot(d[0] - c[0], d[1] - c[1], d[2] - c[2])
  }
  return wl / (wl + rl)
}

const nrm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
const subv = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]

type Level = { n: number; rows: number; puff: number; fine: boolean; ring: number }
const LOW: Level = { n: 36, rows: 22, puff: 1.7, fine: false, ring: 72 }
const DETAIL: Level = { n: 64, rows: 42, puff: 1.0, fine: true, ring: 128 }

function build(L: Level) {
  const wall = new Part(), roofSkin = new Part(), grey = new Part(), red = new Part(), concrete = new Part(), glaze = new Part()

  const vWall = wallShare()
  const S = makeSkin(vWall)
  const cols = 2 * L.n
  const T = evenT(cols)
  const tAt = (k: number) => {
    const kk = ((k % cols) + cols) % cols, base = T[kk]
    return base
  }
  const vAt = (l: number) => Math.min(1, Math.max(0, l / L.rows))
  const P = (k: number, l: number) => S(tAt(k), vAt(l))
  /** Outward surface normal at a lattice point (fractional indices allowed via neighbours). */
  const N = (k: number, l: number): V3 => {
    const v = vAt(l), dv = 1e-3
    const t0 = tAt(k), t1 = tAt(k + 1), tm = tAt(k - 1)
    const du = subv(S(t1 < t0 ? t1 + 2 * Math.PI : t1, v), S(tm > t0 ? tm - 2 * Math.PI : tm, v))
    const dvv = subv(S(t0, Math.min(1, v + dv)), S(t0, Math.max(0, v - dv)))
    return nrm(crs(du, dvv))
  }
  const Z_LIT = 49 // the lit side wall ends here; above, the transparent roof

  /** One cushion: corners a (k-1), b (l-1), c (k+1), d (l+1) round centre (k, l). */
  function cushion(k: number, l: number) {
    const lo = Math.max(0, l - 1), hi = Math.min(L.rows, l + 1)
    const corners: V3[] = [P(k - 1, l), P(k, lo), P(k + 1, l), P(k, hi)]
    const cn = N(k, l)
    // centre of the diamond on the surface (half-diamonds at the foot and the opening)
    const vc = (vAt(lo) + vAt(hi)) / 2
    const base = S(tAt(k), vc)
    const half = lo === l || hi === l
    const puff = L.puff * (half ? 0.6 : 1)
    const top = add(base, cn, puff)
    const z = base[2]
    const vent = z > 46.5 && z < 50.5 && (k * 7 + l * 3) % 13 === 1
    const part = vent ? grey : z < Z_LIT ? wall : roofSkin
    const tilt = (p: V3, amount: number): V3 => nrm(add(cn, nrm(subv(p, base)), amount))
    const ring = corners.filter((p, i) => !(i === 1 && lo === l) && !(i === 3 && hi === l))
    const m = ring.length
    for (let i = 0; i < m; i++) {
      const a = ring[i], b = ring[(i + 1) % m]
      if (m === 3 && i === m - 1) {
        // the flat side of a half-cushion along the foot or the opening edge
        part.tri(a, b, top, undefined, undefined, undefined, [tilt(a, 1.3), tilt(b, 1.3), cn])
        continue
      }
      if (!L.fine) {
        part.tri(a, b, top, undefined, undefined, undefined, [tilt(a, 1.3), tilt(b, 1.3), cn])
      } else {
        // a pillow: edge midpoint lifted a little, two facets per side
        const mpBase: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]
        const mp = add(mpBase, cn, puff * 0.3)
        const mn = tilt(mpBase, 0.6)
        part.tri(a, mp, top, undefined, undefined, undefined, [tilt(a, 1.3), mn, cn])
        part.tri(mp, b, top, undefined, undefined, undefined, [mn, tilt(b, 1.3), cn])
      }
    }
  }
  for (let l = 0; l <= L.rows; l++)
    for (let k = 0; k < cols; k++) if ((k + l) % 2 === 1) cushion(k, l)

  // --- Rings helpers for the base and bowl
  const R = L.ring
  const TR = evenT(R)
  const ringOf = (a: number, b: number, n: number): XY[] => TR.map((t) => se(a, b, n, t))
  const scaled = (s: number) => ringOf(OA * s, OB * s, ON)
  /** Smooth-shaded band between ring r0 at z0 and r1 at z1 (outward = to the right of travel). */
  function band(p: Part, r0: XY[], z0: number, r1: XY[], z1: number, flip = false, smooth = true) {
    const n = r0.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const a: V3 = [r0[i][0], r0[i][1], z0], b: V3 = [r0[j][0], r0[j][1], z0]
      const c: V3 = [r1[j][0], r1[j][1], z1], d: V3 = [r1[i][0], r1[i][1], z1]
      if (!smooth) {
        if (flip) { p.quad(a, d, c, b) } else { p.quad(a, b, c, d) }
        continue
      }
      const nAt = (k: number): V3 => {
        const kp = (k + 1) % n, km = (k - 1 + n) % n
        const tng: V3 = [(r0[kp][0] + r1[kp][0] - r0[km][0] - r1[km][0]) / 2, (r0[kp][1] + r1[kp][1] - r0[km][1] - r1[km][1]) / 2, 0]
        const up: V3 = [r1[k][0] - r0[k][0], r1[k][1] - r0[k][1], z1 - z0]
        const nn = nrm(crs(tng, up))
        return flip ? [-nn[0], -nn[1], -nn[2]] : nn
      }
      const na = nAt(i), nb = nAt(j)
      p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nb])
      p.tri(a, c, d, undefined, undefined, undefined, [na, nb, na])
    }
  }

  // --- Base: the arena's plaza-level drum (basement, 0-8.5), the dark glazed
  // ground floor under the skin (8.5-11.5), the skin's soffit.
  const plaza = ringOf(103.6, 119.2, ON)
  const foot = scaled(rollS(PHI0))
  const glass = scaled(rollS(PHI0) - 0.025)
  // split the drum in two so no low face is long and flat against the terrain
  band(concrete, plaza, 0, plaza, 4.25)
  band(concrete, plaza, 4.25, plaza, 8.5)
  band(concrete, plaza, 8.5, glass, 8.5, false, false) // plaza-level ledge, faces up
  band(glaze, glass, 8.5, glass, 11.5)
  band(concrete, glass, 11.5, foot, 11.5, false, false) // skin soffit, faces down

  // --- The bowl (rings from the OSM tiers)
  const lowIn = ringOf(41.5, 59.8, 6), lowOut = ringOf(62.7, 80.7, 5)
  const midIn = ringOf(61, 79, 5), midOut = ringOf(83.4, 99.5, 4)
  const upIn = ringOf(78.7, 98.3, 4.5), upOut = ringOf(106.5, 122.7, 3.2)
  const opening = ringOf(HA, HB, HN)
  const Z_EDGE = Z_TOP - ROOF_DROP, Z_UNDER = Z_EDGE - 7
  band(concrete, lowIn, 0, lowIn, 1.2, true) // pitch wall faces in
  band(grey, lowIn, 1.2, lowOut, 8, true)
  band(concrete, midIn, 7.2, midIn, 10, true)
  band(red, midIn, 10, midOut, 19, true)
  band(concrete, midOut, 19, midOut, 21, true)
  band(concrete, midOut, 21, upIn, 21, true, false) // soffit under the upper tier's overhang
  band(concrete, upIn, 21, upIn, 25, true)
  band(red, upIn, 25, upOut, 38, true)
  // the roof's underside, from the back of the upper tier to the opening, and its fascia
  band(grey, upOut, 38, opening, Z_UNDER, true)
  band(concrete, opening, Z_UNDER, opening, Z_EDGE, true)

  const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0 : 0.15)
  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: wall, material: finish('neon-arena', 0xe9edf0, 0.5) },
    { part: roofSkin, material: finish('arena-roof-etfe', 0xd9dee2, 0.4) },
    { part: grey, material: { ...PALETTE.roof, color: 0x8e979e } },
    { part: red, material: finish('arena-seat-red', 0xb4544f) },
    { part: concrete, material: { ...finish('arena-concrete', 0xd6d6d2), floodlight: lit } },
    { part: glaze, material: PALETTE.window },
  ]
  return parts.filter((x) => x.part.triangles > 0)
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  if (parts.length > 6) throw new Error(`${file}: ${parts.length} materials`)
  const glb = writeGlb('Allianz Arena', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    anchor: [48.2187923, 11.6247014], bearing: 343.5, elevation: 0, height: 52,
  })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

if (import.meta.main) {
  await write(`${ID}.glb`, build(LOW), 6500, 250_000)
  await write(`${ID}.detail.glb`, build(DETAIL), 40_000, 1536 * 1024)
}
