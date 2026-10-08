/**
 * George Washington Bridge towers (1931; Othmar Ammann, Cass Gilbert) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-george-washington-bridge.ts
 *
 * One tower, placed twice (New Jersey and New York; OSM maps both with the
 * same 72.5 x 28 m outline). Map frame: x across the bridge, y along it
 * (toward New Jersey), z up, metres; origin at the tower's centre on the
 * water. Placed at bearing 284.4°, the line from the New York tower's
 * centroid to the New Jersey one's (1,064 m apart; the published main span
 * is 3,500 ft, 1,067 m). Only the tower and its pier: no cables, and the deck
 * is a stub no longer than the tower is deep, so the map's bridge line
 * carries the span.
 *
 * What makes it the George Washington Bridge: the never-clad steel frame.
 * Two square lattice legs, every face filled with big X panels, joined by a
 * tall semicircular arch over the roadway with lattice spandrels above it, a
 * second arch under the deck, and a deep open attic band across the top.
 * Pale grey paint.
 *
 * Sources:
 * - OSM: tower outlines way/741784699 (New Jersey) and way/741784700 (New
 *   York), bridge:support=pylon, height 184: 72.5 x 28 m in the bridge frame,
 *   which is the pier.
 * - Lidar (USGS 3DEP NY_NewYorkCity 2017, point cloud cropped to each tower,
 *   heights above the river at about -0.7 m NAVD88): top 184 m (NJ 183.5–
 *   184.4, NY 182–185); legs |x| 16–31 (each about 15 m square, 15.5 m deep
 *   along the bridge), the opening between them about 31 m; the arch crown
 *   (outer edge) about 145 m; cross members under the attic at 176–178 m
 *   and in the spandrel at about 151 and 165 m; the upper roadway's top
 *   71.5 m (NY) to 77 m (NJ) at the towers; the NY pier about 5 m.
 *   The tower centres sit 0.5 m off the OSM centroids across the bridge and
 *   1.2 m along it; the placements use the lidar centres.
 * - Published: towers 604 ft (184 m) above the water; deck clearance 213 ft
 *   (65 m) at mid-span; the lower level added 1962 (Wikipedia "George
 *   Washington Bridge"; Port Authority of NY & NJ).
 * - Photos (Wikimedia Commons): "George Washington Bridge (tower structure)"
 *   (Frederika Eilers, CC BY-SA 3.0; the attic, spandrel X panels and arch
 *   ring face-on); "George Washington Bridge west tower and south sidewalk
 *   seen from the west" (Beyond My Ken, CC BY-SA 4.0; the NJ tower's portal
 *   and the legs' inner faces); "2015 George Washington Bridge east tower from
 *   south" (Beyond My Ken, CC BY-SA 4.0; a leg's side face, the arch under
 *   the deck); "George Washington Bridge from Englewood Basin NJ2"
 *   (Acroterion, CC BY-SA 4.0; the NY tower whole, three-quarter from the
 *   north-west); HAER NY-129-18 "George Washington Bridge New York roadway and
 *   tower" (Jet Lowe, public domain; portal face-on from the roadway);
 *   "George Washington Bridge from Ft Tryon Park 06" (Jay Dobkin, CC BY-SA
 *   4.0; the NY tower from the south-east, for the paint).
 * - Estimated from photos: the lower arch (crown about 45 m), the panel
 *   rhythm (four X panels per face below the deck, seven above, square-ish
 *   as in the photos), the attic's ten openings, the deck stub (62–74 m).
 * - Colour: lit steel in daylight photos reads #acb3bd to #e0e2e6, a pale
 *   grey with a faint blue; pulled to the palette's lightness, the bracing a
 *   shade deeper so the X panels read against the posts.
 * - y = 0 is the river. The New Jersey tower stands at the shore's edge on
 *   rock a few metres up; the map puts y = 0 at the lowest ground under it.
 *
 * The lattice is drawn as broad plates: corner posts, horizontal struts at
 * each panel line, and one X of two wide plates per panel, on every face of
 * each leg, so the legs stay see-through as the real frame is.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { finish, type Swatch } from './palette'
import { box, countParts } from './nyc-manhattan-bridge'

// ---- Helpers (shared with the Verrazzano-Narrows and Hell Gate generators) ----

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const avg = (ps: V3[]): V3 => {
  const s: V3 = [0, 0, 0]
  for (const p of ps) { s[0] += p[0]; s[1] += p[1]; s[2] += p[2] }
  return [s[0] / ps.length, s[1] / ps.length, s[2] / ps.length]
}

/** A quad wound to face away from `inside`. */
export function quadOut(p: Part, q: V3[], inside: V3) {
  const n = cross(sub(q[1], q[0]), sub(q[2], q[0]))
  const n2 = cross(sub(q[2], q[0]), sub(q[3], q[0]))
  const m: V3 = [n[0] + n2[0], n[1] + n2[1], n[2] + n2[2]]
  if (dot(m, sub(avg(q), inside)) >= 0) p.quad(q[0], q[1], q[2], q[3])
  else p.quad(q[3], q[2], q[1], q[0])
}

/** A convex hexahedron from two matching corner loops (a0..a3, b0..b3). */
export function hexa(p: Part, a: V3[], b: V3[], { capA = true, capB = true, skip = [] as number[] } = {}) {
  const c = avg([...a, ...b])
  if (capA) quadOut(p, a, c)
  if (capB) quadOut(p, b, c)
  for (let i = 0; i < 4; i++) {
    if (skip.includes(i)) continue
    const j = (i + 1) % 4
    quadOut(p, [a[i], a[j], b[j], b[i]], c)
  }
}

/** A face frame: maps (a along the face, z up, n into the structure) to a point. */
export type Face = (a: number, z: number, n: number) => V3

/** A plate on a face, a0..a1 by z0..z1, n0..n1 deep; `ends: false` leaves off its hidden a0/a1 ends. */
export function facePlate(p: Part, F: Face, a0: number, a1: number, z0: number, z1: number, n0: number, n1: number, ends = true) {
  hexa(p, [F(a0, z0, n0), F(a1, z0, n0), F(a1, z1, n0), F(a0, z1, n0)],
    [F(a0, z0, n1), F(a1, z0, n1), F(a1, z1, n1), F(a0, z1, n1)], { skip: ends ? [] : [1, 3] })
}

/**
 * An X of two broad plates in a face panel a0..a1 by z0..z1, w wide (measured
 * square to the plate) and n0..n1 deep, clipped to the panel so nothing pokes
 * past it.
 */
export function faceX(p: Part, F: Face, a0: number, a1: number, z0: number, z1: number, w: number, n0: number, n1: number) {
  const h = (w / 2) * Math.hypot(a1 - a0, z1 - z0) / (a1 - a0)
  const lo = (z: number) => Math.max(z0, Math.min(z1, z))
  for (const [za, zb] of [[z0, z1], [z1, z0]]) {
    const q = (n: number): V3[] => [F(a0, lo(za - h), n), F(a1, lo(zb - h), n), F(a1, lo(zb + h), n), F(a0, lo(za + h), n)]
    hexa(p, q(n0), q(n1), { skip: [1, 3] }) // the ends butt into the panel's frame
  }
}

export type LatticeOpts = {
  pw?: number; sh?: number; st?: number; xw?: number; xt?: number; faces?: string[]
  /** Leave out the X in face f's panel k. */
  skipX?: (f: string, k: number) => boolean
}

/**
 * A lattice box: corner posts, struts at `levels` and X panels between them,
 * on whichever of its four faces `faces` names. x0..x1 by y0..y1 in plan.
 */
export function latticeBox(post: Part, brace: Part, x0: number, x1: number, y0: number, y1: number,
  levels: number[], { pw = 3, sh = 2, st = 1.0, xw = 2.2, xt = 0.8, faces = ['s', 'n', 'w', 'e'], skipX = (): boolean => false }: LatticeOpts = {}) {
  const zb = levels[0], zt = levels[levels.length - 1]
  for (const [x, y] of [[x0, y0], [x1 - pw, y0], [x1 - pw, y1 - pw], [x0, y1 - pw]])
    box(post, x, x + pw, y, y + pw, zb, zt, { r: 0.35, bottom: false })
  const F: Record<string, [Face, number, number]> = {
    s: [(a, z, n) => [a, y0 + n, z], x0 + pw, x1 - pw],
    n: [(a, z, n) => [a, y1 - n, z], x0 + pw, x1 - pw],
    w: [(a, z, n) => [x0 + n, a, z], y0 + pw, y1 - pw],
    e: [(a, z, n) => [x1 - n, a, z], y0 + pw, y1 - pw],
  }
  for (const f of faces) {
    const [Fn, a0, a1] = F[f]
    for (const z of levels) facePlate(post, Fn, a0, a1, Math.max(zb, z - sh / 2), Math.min(zt, z + sh / 2), 0.15, 0.15 + st, false)
    for (let k = 0; k < levels.length - 1; k++) {
      if (skipX(f, k)) continue
      const za = levels[k] + (k === 0 ? sh / 2 : sh / 2), zc = levels[k + 1] - sh / 2
      if (zc - za > 1) faceX(brace, Fn, a0, a1, za, zc, xw, 0.35, 0.35 + xt)
    }
  }
}

/**
 * An arch ring through the depth y0..y1: intrados ri, extrados ro, centre
 * (0, zs), as a barrel of `seg` segments.
 */
export function archRing(p: Part, ri: number, ro: number, zs: number, y0: number, y1: number, seg = 12) {
  for (let i = 0; i < seg; i++) {
    const t0 = Math.PI - (Math.PI * i) / seg, t1 = Math.PI - (Math.PI * (i + 1)) / seg
    const P = (r: number, t: number, y: number): V3 => [r * Math.cos(t), y, zs + r * Math.sin(t)]
    hexa(p, [P(ri, t0, y0), P(ri, t1, y0), P(ro, t1, y0), P(ro, t0, y0)], [P(ri, t0, y1), P(ri, t1, y1), P(ro, t1, y1), P(ro, t0, y1)])
  }
}

/**
 * Spandrel plates between an arch's extrados (radius ro, centre (0, zs)) and
 * the rectangle |x| <= hx, z <= z1, in the slab y0..y1.
 */
export function haunches(p: Part, ro: number, zs: number, hx: number, z1: number, y0: number, y1: number, seg = 8) {
  const t0 = ro > hx ? Math.acos(hx / ro) : 0
  for (const s of [-1, 1]) for (let i = 0; i < seg; i++) {
    const ta = t0 + ((Math.PI / 2 - t0) * i) / seg, tb = t0 + ((Math.PI / 2 - t0) * (i + 1)) / seg
    const xa = s * ro * Math.cos(ta), xb = s * ro * Math.cos(tb)
    const za = Math.min(z1, zs + ro * Math.sin(ta)), zb = Math.min(z1, zs + ro * Math.sin(tb))
    const q = (y: number): V3[] => [[xa, y, za], [xb, y, zb], [xb, y, z1], [xa, y, z1]]
    if (z1 - Math.min(za, zb) > 0.05) hexa(p, q(y0), q(y1))
  }
  // Below the arch's foot, if the extrados is narrower than the rectangle.
  if (ro < hx) for (const s of [-1, 1]) {
    const q = (y: number): V3[] => [[s * ro, y, zs], [s * hx, y, zs], [s * hx, y, z1], [s * ro, y, z1]]
    hexa(p, q(y0), q(y1))
  }
}

// ---- The George Washington Bridge tower ---------------------------------------

if (import.meta.main) {
  const steel = new Part()   // posts, struts, attic, arch rings
  const brace = new Part()   // X panels and spandrels, a shade deeper
  const pier = new Part()    // concrete pier
  const road = new Part()    // deck stub's roadway

  // Heights (m above the river).
  const PIER = 4.5
  const DECK0 = 63, DECK = 74          // deck stub: underside, upper roadway
  const LOW_SPRING = 42                // lower arch, intrados crown 57
  const SPRING = 127                   // upper arch, intrados crown 142
  const SPAN1 = 146.5, SPAN2 = 161.5   // spandrel struts
  const ATTIC = 176, TOP = 184         // attic band

  // Plan.
  const XI = 15.0, XO = 31.0           // legs, |x| (lidar)
  const D = 7.75                       // half depth along the bridge (lidar 15.5 m)
  const R = XI, RO = XI + 2.4          // arch intrados = the legs' inner faces; ring 2.4 m

  // Pier.
  box(pier, -36.2, 36.2, -14, 14, 0, PIER - 0.8, { r: 0.8, bottom: false })
  box(pier, -34.5, 34.5, -11, 11, PIER - 0.8, PIER, { r: 0.6, top: 0.3, bottom: false })

  // Legs: four X panels on each face below the deck, the deck zone, seven above.
  const levels = [PIER]
  for (let k = 1; k <= 4; k++) levels.push(PIER + ((DECK0 - PIER) * k) / 4)
  levels.push(DECK)
  for (let k = 1; k <= 7; k++) levels.push(DECK + ((ATTIC - DECK) * k) / 7)
  for (const s of [-1, 1]) {
    const [x0, x1] = s > 0 ? [XI, XO] : [-XO, -XI]
    latticeBox(steel, brace, x0, x1, -D, D, levels, {
      // The inner face behind the deck stub is hidden.
      skipX: (f, k) => (f === (s > 0 ? 'w' : 'e') && k === 4),
    })
  }

  // Upper portal: the arch ring through the tower, spandrels to the first strut,
  // then two rows of three X panels on each face up to the attic.
  archRing(steel, R - 0.01, RO, SPRING, -D + 0.5, D - 0.5, 12)
  for (const [y0, y1] of [[-D + 0.4, -D + 1.6], [D - 1.6, D - 0.4]]) haunches(brace, RO, SPRING, XI, SPAN1 - 1, y0, y1, 8)
  const front: Face = (a, z, n) => [a, -D + n, z]
  const back: Face = (a, z, n) => [a, D - n, z]
  for (const F of [front, back]) {
    for (const z of [SPAN1, SPAN2]) facePlate(steel, F, -XI, XI, z - 1, z + 1, 0.15, 1.15)
    for (const [z0, z1] of [[SPAN1 + 1, SPAN2 - 1], [SPAN2 + 1, ATTIC - 1]])
      for (let i = 0; i < 3; i++) {
        const a0 = -XI + (2 * XI * i) / 3, a1 = -XI + (2 * XI * (i + 1)) / 3
        faceX(brace, F, a0, a1, z0, z1, 2.2, 0.35, 1.15)
        if (i > 0) facePlate(steel, F, a0 - 0.6, a0 + 0.6, z0, z1, 0.25, 1.05)
      }
  }

  // Lower portal: an arch under the deck, its spandrels up to the deck stub.
  archRing(steel, R - 0.01, RO, LOW_SPRING, -D + 0.5, D - 0.5, 12)
  for (const [y0, y1] of [[-D + 0.4, -D + 1.6], [D - 1.6, D - 0.4]]) haunches(brace, RO, LOW_SPRING, XI, DECK0, y0, y1, 8)

  // Deck stub through the portal, no longer than the tower is deep.
  box(brace, -XI, XI, -D, D, DECK0, DECK - 0.6, { r: 0.2, bottom: true, lid: road })
  box(road, -XI + 0.4, XI - 0.4, -D, D, DECK - 0.6, DECK, { r: 0, bottom: false })

  // The attic: a beam, posts between ten open bays, a capping slab; side faces
  // with two bays each.
  const AT0 = ATTIC, AT1 = ATTIC + 2.2, CAP0 = TOP - 1.6
  for (const F of [front, back]) {
    facePlate(steel, F, -XO, XO, AT0, AT1, 0, 1.4)
    const n = 10
    for (let i = 0; i <= n; i++) {
      const a = -XO + (2 * XO * i) / n
      const w = i === 0 || i === n ? 3 : 1.4
      const a0 = i === 0 ? -XO : i === n ? XO - w : a - w / 2
      facePlate(steel, F, a0, a0 + w, AT1, CAP0, 0, 1.4)
    }
  }
  for (const s of [-1, 1]) {
    const side: Face = (a, z, n) => [s * (XO - n), a, z]
    facePlate(steel, side, -D + 1.4, D - 1.4, AT0, AT1, 0, 1.4)
    facePlate(steel, side, -0.7, 0.7, AT1, CAP0, 0, 1.4)
  }
  box(steel, -XO - 0.3, XO + 0.3, -D - 0.3, D + 0.3, CAP0, TOP, { r: 0.4, top: 0.3, bot: 0.3, bottom: true })

  const STEEL: Swatch = finish('gwb-steel', 0xbfc5ca)
  const BRACE: Swatch = finish('gwb-steel-shade', 0xa5adb4)
  const PIER_S: Swatch = finish('pier-concrete', 0xd2cabb)
  const ROAD: Swatch = finish('deck', 0x7f8489)
  const parts = [
    { part: steel, material: STEEL }, { part: brace, material: BRACE },
    { part: pier, material: PIER_S }, { part: road, material: ROAD },
  ]
  const triangles = countParts(parts)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('George Washington Bridge tower', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the tower centre on the water',
    height: TOP, bearing: 284.4, elevation: 0,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  await Bun.write(new URL('../models/nyc-george-washington-bridge.glb', import.meta.url), glb)
  console.log(`nyc-george-washington-bridge.glb: ${triangles} triangles, ${glb.length} bytes`)
}
