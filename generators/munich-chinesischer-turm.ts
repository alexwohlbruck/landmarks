/**
 * Chinesischer Turm, Englischer Garten, Munich: Joseph Frey after Johann
 * Baptist Lechner's design, 1789-90, on the model of the Great Pagoda at Kew;
 * burnt out in 1944 and rebuilt in timber to the old form in 1951-52.
 * Original procedural geometry, CC0-1.0.
 * bun generators/munich-chinesischer-turm.ts
 *
 * Map frame: x east, y north, z up, metres, origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/18961351,
 * 48.1525608, 11.5920978. The tower is a regular twelve-sided pagoda on a
 * vertical axis; bearing 0 (its twelve corners are drawn at 15 + 30k
 * degrees, which no photo pins down).
 *
 * Identity, in order: five stacked wooden roofs, each smaller, with
 * scalloped eaves that kick up at every corner and a bell hanging from
 * each corner; an open ground floor under the widest roof, a ring of posts
 * round a dark stair core; four open timber galleries above, each a ring of
 * posts with a Chinese-lattice railing in front of a dark screened room;
 * the ogee top with its green copper ball and spike.
 *
 * Evidence:
 *  - plan (OSM, measured): outline way/18961351, the lowest roof, 18.7 m
 *    across; building:part rings way/1050396295 (15.1 m), 1050396294
 *    (11.6 m), 1050396293 (7.8 m) and 1050396292 (4.5 m), the four upper
 *    roofs. OSM traces them as 18-26-gons; the photos show twelve sides
 *    (twelve bells and posts round each tier, 30 degrees apart in Thomas
 *    Ledl's frontal view).
 *  - heights: published 25 m (de.wikipedia; OSM height=25). Tiers measured
 *    from Falbisoner's more distant view (0.026 m/px, scaled to the ball at
 *    22.3 m), checked against Ledl's near-frontal photo (whose low camera
 *    foreshortens the roofs): lowest eave 3.0, gallery floors 4.6 / 8.6 /
 *    12.4 / 16.0, eaves 7.0 / 11.0 / 14.8 / 17.9, top roof to 20.2, ball
 *    21.9-22.7, spike to 25.0 (the published total). The upper roof widths from the
 *    same photo (the top two a little wider than OSM's: 8.4 and 5.4 m).
 *    Post rings: ground 15.8 m across (outer) and 12.6 m (inner), galleries
 *    12.6, 9.6, 6.6 and 3.8 m, from the photo.
 *  - estimated: the eave kick (0.4-0.6 m up, 0.4 m out at the corners), roof
 *    curvature, post and rail sizes, the stair core 3.6 m across.
 *  - colours: weathered dark brown timber and grey-brown wooden shingles
 *    (photos; OSM roof:material=shingles, roof:colour=darkbrown,
 *    building:colour #85552e), the green copper finial, brass bells. The
 *    roofs are not green: every recent photo shows grey shingle.
 *  - night: lamps hang inside every gallery (Kajebi's night photo), so the
 *    screened rooms are `window-2` and glow; the timber stays dark.
 *  - elevation 0 (flat beer garden). No lidar (none in Germany); no
 *    Bavarian 3D city model used.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Chinesischer_Turm,_München.jpg (Thomas Ledl, CC BY 4.0): frontal; all
 *    heights and widths.
 *  - Chinesischer_Turm_München.jpg (H.Helmlechner, CC BY-SA 4.0): from
 *    below, the ground floor posts and the lowest roof.
 *  - Chinese_Tower_in_February.JPG (Martin Falbisoner, CC BY-SA 3.0): from
 *    further off, the stack of roofs.
 *  - Chinesischer_Turm_München_-_Turmspitze.jpg (Maximilian Dörrbecker,
 *    CC BY-SA 2.5): the top tiers, lattice, scalloped eaves, bells, finial.
 *  - München_Chinesischer_Turm_bei_Nacht_April_2018_1.jpg (Kajebi II.,
 *    CC BY-SA 4.0): night.
 * No commercial imagery, no 3D city models, no look-only sources.
 *
 * Two levels of detail: the low model (models/<id>.glb) has one lattice
 * cross per railing bay and no bells; the detail model (.detail.glb, from
 * zoom 17) two crosses a bay, the corner brackets under the eaves and the
 * bells.
 *
 * Left out: the wire mesh screens (drawn as a dark wall a little behind the
 * posts), the stairs, the lanterns, the beer-garden kiosks.
 *
 * Doubts: the corner orientation; the gallery heights above the second
 * floor are read from one low photo with perspective; the roof curvature.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { lathe } from './chi-aon-center'
import { tube } from './munich-olympiaturm'
import { abox, faceN, saveLods } from './munich-propylaeen'

const N = 12
const A0 = Math.PI / 12 // corners at 15 + 30k degrees
const ang = (k: number) => A0 + (k * 2 * Math.PI) / N
const at = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]
/** Corner k of the regular 12-gon of circumradius r. */
const corner = (r: number, k: number, z: number) => at(r, ang(k), z)

const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

/** A square-section beam from a to b; `t` is the thickness direction (half ht), the width is across both (half hw). */
function beam(p: Part, a: V3, b: V3, t: V3, ht: number, hw: number) {
  const d = unit(sub(b, a)), T = unit(t), W = unit(cross(d, T))
  const off = (c: V3, s: number, u: number): V3 => [c[0] + T[0] * s * ht + W[0] * u * hw, c[1] + T[1] * s * ht + W[1] * u * hw, c[2] + T[2] * s * ht + W[2] * u * hw]
  for (const [s0, u0, s1, u1, n] of [[1, -1, 1, 1, T], [-1, -1, -1, 1, [-T[0], -T[1], -T[2]]], [-1, 1, 1, 1, W], [-1, -1, 1, -1, [-W[0], -W[1], -W[2]]]] as [number, number, number, number, V3][])
    faceN(p, [off(a, s0, u0), off(a, s1, u1), off(b, s1, u1), off(b, s0, u0)], n)
}

type Tier = { eave: number; eaveR: number; top: number; topR: number; lift: number }

function build(D: boolean) {
  const wood = new Part(), shingle = new Part(), screen = new Part(), copper = new Part(), brass = new Part()
  const SUB = D ? 4 : 2 // points per side along a scalloped eave

  /** A ring of SUB points a side on the 12-gon of radius r at z, kicked out and up at the corners. */
  const ring = (r: number, z: number, kick = 0, lift = 0): V3[] => {
    const pts: V3[] = []
    for (let k = 0; k < N; k++) for (let s = 0; s < SUB; s++) {
      const t = s / SUB, a = corner(r, k, 0), b = corner(r, k + 1, 0)
      const f = (Math.cos(2 * Math.PI * t) + 1) / 2 // 1 at the corners, 0 mid-side
      const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t, l = Math.hypot(x, y)
      pts.push([x + (x / l) * kick * f, y + (y / l) * kick * f, z + lift * f])
    }
    return pts
  }

  /** One roof: fascia, the concave shingled slope to the next tier, the soffit under it. */
  const roof = (t: Tier, soffitR: number) => {
    const kick = 0.4 * Math.min(1, t.eaveR / 6), lift = t.lift
    const edge = ring(t.eaveR, t.eave, kick, lift)
    const below = ring(t.eaveR, t.eave - 0.28, kick, lift)
    const midR = t.eaveR - (t.eaveR - t.topR) * 0.45, midZ = t.eave + (t.top - t.eave) * 0.28
    const mid = ring(midR, midZ, kick * 0.3, lift * 0.35)
    const top = ring(t.topR, t.top)
    wood.loft([below, edge])
    shingle.loft([edge, mid, top])
    wood.loft([ring(soffitR, t.eave - 0.28), below])
  }

  /** Twelve posts on a ring. */
  const posts = (r: number, z0: number, z1: number, h = 0.15) => {
    for (let k = 0; k < N; k++) {
      const c = corner(r, k, 0)
      abox(wood, c[0] - h, c[1] - h, c[0] + h, c[1] + h, z0, z1, 'b,t')
    }
  }

  /** A gallery railing between the posts: rails and Chinese lattice. */
  const railing = (r: number, z0: number) => {
    const zt = z0 + 1.0
    for (let k = 0; k < N; k++) {
      const a = corner(r, k, 0), b = corner(r, k + 1, 0)
      const out = unit([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0])
      const P = (s: number, z: number): V3 => [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, z]
      beam(wood, P(0.03, zt), P(0.97, zt), [0, 0, 1], 0.07, 0.09)
      beam(wood, P(0.03, z0 + 0.12), P(0.97, z0 + 0.12), [0, 0, 1], 0.05, 0.07)
      const n = D ? 2 : 1
      for (let q = 0; q < n; q++) {
        const s0 = 0.05 + (0.9 * q) / n, s1 = 0.05 + (0.9 * (q + 1)) / n
        beam(wood, P(s0, z0 + 0.17), P(s1, zt - 0.07), out, 0.04, 0.045)
        beam(wood, P(s0, zt - 0.07), P(s1, z0 + 0.17), out, 0.04, 0.045)
      }
      if (D) beam(wood, P(0.03, (z0 + zt) / 2), P(0.97, (z0 + zt) / 2), out, 0.035, 0.04)
    }
  }

  /** The dark screened room behind a gallery's posts (glows at night). */
  const room = (r: number, z0: number, z1: number, deckR: number) => {
    screen.loft([ring(r, z0), ring(r, z1)])
    // the gallery's deck between the room and the roof below
    wood.loft([ring(deckR, z0), ring(r, z0)])
  }

  // --------------------------------------------------------------- tiers
  const tiers: Tier[] = [
    { eave: 3.0, eaveR: 9.35, top: 4.6, topR: 6.5, lift: 0.6 },
    { eave: 7.0, eaveR: 7.55, top: 8.6, topR: 5.0, lift: 0.6 },
    { eave: 11.0, eaveR: 5.8, top: 12.4, topR: 3.5, lift: 0.5 },
    { eave: 14.8, eaveR: 4.2, top: 16.0, topR: 2.1, lift: 0.45 },
  ]
  const galleries = [
    { floor: 4.6, r: 6.3, eave: 7.0 },
    { floor: 8.6, r: 4.8, eave: 11.0 },
    { floor: 12.4, r: 3.3, eave: 14.8 },
    { floor: 16.0, r: 1.9, eave: 17.9 },
  ]

  // ground floor: outer and inner post rings, the stair core
  posts(7.9, 0, 3.0 - 0.28, 0.17)
  posts(6.3, 0, 4.6, 0.17)
  {
    const lo = Array.from({ length: N }, (_, k) => corner(1.9, k, 0)), hi = Array.from({ length: N }, (_, k) => corner(1.9, k, 4.6))
    wood.loft([lo, hi])
  }
  tiers.forEach((t, i) => roof(t, i === 0 ? 1.9 : galleries[i - 1].r - 0.55))
  // beams tying the outer posts under the lowest roof
  for (let k = 0; k < N; k++) beam(wood, corner(7.9, k, 2.55), corner(7.9, k + 1, 2.55), [0, 0, 1], 0.12, 0.1)

  galleries.forEach((g, gi) => {
    posts(g.r, g.floor, g.eave - 0.28, 0.13)
    railing(g.r, g.floor)
    room(g.r - 0.55, g.floor, g.eave - 0.28, tiers[gi].topR)
    // the gallery's head beam under the eave
    for (let k = 0; k < N; k++) beam(wood, corner(g.r, k, g.eave - 0.45), corner(g.r, k + 1, g.eave - 0.45), [0, 0, 1], 0.12, 0.1)
    if (D) for (let k = 0; k < N; k++) {
      // corner brackets from the post up and out to the eave
      const c = corner(g.r, k, g.eave - 1.0), e = corner(g.r + 0.8, k, g.eave - 0.3)
      tube(wood, c, e, 0.06, 0.06, 4, false)
    }
  })

  // the top roof: an ogee to the finial
  {
    const t = { eave: 17.9, eaveR: 2.75, lift: 0.4 }
    const edge = ring(t.eaveR, t.eave, 0.3, t.lift), below = ring(t.eaveR, t.eave - 0.25, 0.3, t.lift)
    const r1 = ring(2.0, 18.4, 0.1, 0.1), r2 = ring(1.1, 19.1), r3 = ring(0.45, 19.8), r4 = ring(0.18, 20.2)
    wood.loft([below, edge])
    shingle.loft([edge, r1, r2, r3, r4])
    wood.loft([ring(1.35, t.eave - 0.25), below])
    lathe(copper, 0, 0, [[0.18, 20.2], [0.22, 20.5], [0.12, 21.6], [0.2, 21.95], [0.36, 22.3], [0.2, 22.7], [0.06, 22.8], [0.04, 24.0], [0, 25.0]], D ? 12 : 8)
  }

  // bells at every eave corner (detail model)
  if (D) {
    for (const [r, z, lift] of [[9.35, 3.0, 0.6], [7.55, 7.0, 0.6], [5.8, 11.0, 0.5], [4.2, 14.8, 0.45], [2.75, 17.9, 0.4]]) {
      const kick = 0.4 * Math.min(1, r / 6)
      for (let k = 0; k < N; k++) {
        const c = corner(r + kick - 0.1, k, z + lift - 0.3)
        lathe(brass, c[0], c[1], [[0.02, c[2] - 0.05], [0.16, c[2] - 0.35], [0.12, c[2] - 0.3], [0.07, c[2] - 0.12], [0, c[2] - 0.05]], 6)
      }
    }
  }

  return [
    { part: wood, material: finish('chinaturm-timber', 0x6e5a47) },
    { part: shingle, material: finish('chinaturm-shingle', 0x857a70) },
    { part: screen, material: windowVariant(2, 0x57524c) },
    { part: copper, material: { ...PALETTE.patina } },
    { part: brass, material: finish('chinaturm-brass', 0xc9a24c, 0.5) },
  ]
}

if (import.meta.main) {
  await saveLods('munich-chinesischer-turm', 'Chinesischer Turm', [48.1525608, 11.5920978], 0, build(false), build(true))
}
