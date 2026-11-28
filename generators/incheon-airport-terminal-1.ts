/**
 * Incheon International Airport Terminal 1 (Fentress Bradburn with Korean
 * Architects Collaborative International, opened 2001) — procedural, CC0-1.0,
 * no textures.
 * bun generators/incheon-airport-terminal-1.ts
 *
 * Writes models/incheon-airport-terminal-1.glb (low) and
 * models/incheon-airport-terminal-1.detail.glb (detail: the whole landmark
 * again with curtain-wall mullion groups, the roof's cable-stayed masts,
 * the wing skylight rows in finer segments and the jet bridges).
 *
 * Also the shared kit for the other Incheon models of this batch
 * (incheon-airport-concourse, -terminal-2 and -control-tower import `ICN`,
 * `gridSurf`, `wallStrip`, `ribbonPrism` and friends from here). The model
 * itself is only written when this file is run directly.
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0. Anchor: area
 * centroid of the OSM outline relation/3917466 (126.4506642, 37.4494597).
 *
 * Plan. The OSM outline is drawn on circles: the airside edge of the whole
 * crescent lies on one circle (radius 567.5 m about the point C below, to
 * within a metre), the landside edge of the main building on a concentric
 * one (radius 410.5 m), the two end wings' inner edges at 505–510 m, and
 * both piers run radially out from C. So everything here is built in polar
 * coordinates about C:
 * - the main building: r 410.5…567.5 (157 m deep at the eaves; published
 *   width 149 m between the walls), θ 82.0°…166.8° (≈ 730 m along its middle);
 * - the east wing: r 510…567.5, θ 69.7°…82° and a round tip;
 *   the west wing: r 505…567.5, θ 166.8°…179° and a round tip;
 *   (whole crescent ≈ 1,040 m along its middle; published length 1,060 m);
 * - the north pier along θ ≈ 106.1° and the north-west pier along
 *   θ ≈ 144.1°, r 567…915, 62 m wide at the root and 52 m beyond r 785,
 *   with round ends.
 *
 * Identifying features (photos): the long main building, its deep silver
 * landside canopy swooping out over the curb on slim inclined columns, a
 * dark glazed clerestory band behind it, and the hall vault rising from
 * there to the crown and falling again to the airside edge; the landside
 * eave lifting at both ends like a temple roof; tall white mast frames with
 * cable stays along its airside; the two lower glazed gate wings that
 * continue the crescent's curve to rounded tips, and the two straight piers;
 * everywhere the same two layers: a pale panelled gate level with broad
 * window bands, and above it a tall green-tinted curtain wall under a thick
 * silver roof edge; on the wing and pier roofs long rows of low, round-ended
 * glazed skylights.
 *
 * Evidence
 * - OSM: relation/3917466 (outer ways 294776921 + 51479669; building=yes,
 *   aeroway=terminal, building:levels 4, start_date 2001-03-29; no height).
 *   Joined ring read in this frame; the circle fits (centre C, radii) are
 *   measured from it.
 * - Published: length 1,060 m, width 149 m, height 33 m (English Wikipedia,
 *   "Incheon International Airport", passenger terminal), floor area
 *   507,000 m² (Incheon International Airport Corporation, airport.kr,
 *   "Construction Project Overview by Phase"); architect Curtis W. Fentress.
 * - Photos (Wikimedia Commons / Flickr):
 *   • "SEOUL INCHEON AIRPORT SOUTH KOREA OCT 2012 (8643117346).jpg",
 *     calflier001, CC BY-SA 2.0 — the airside of a gate wing from the apron:
 *     panelled gate level, the green curtain wall, the roof edge, the
 *     skylight rows (heights scaled from a 747-400's 19.4 m fin).
 *   • "SEOUL INCHEON AIRPORT SOUTH KOREA OCT 2012 (8192510981).jpg",
 *     (8294115500), (8196599954), calflier001, CC BY-SA 2.0 — airside views
 *     along the wings and the main building.
 *   • Flickr 6231766186 "Seoul-Incheon Airport (ICN)", JasonParis, CC BY 2.0
 *     — the main building's airside: inclined glass, the white mast frames
 *     with cable stays, the curved silver roof behind.
 *   • "202403 Aerial View of Incheon International Airport.jpg", MNXANL,
 *     CC BY-SA 4.0 — the whole crescent from the south-west at altitude: the
 *     long dark-silver main roof, the lower wings, the piers.
 *   • "Unseo-dong, Jung-gu, Incheon, South Korea - panoramio (2).jpg"
 *     (and the sibling without "(2)"), Fumihiko Ueno, CC BY 3.0 — the curved
 *     landside eave soffit and the glazed walls.
 *   • "인천공항T1 전경2 2024.jpg", "인천공항T1 택시타는곳 2024.jpg", Narubaru7,
 *     CC BY 4.0 — the landside eave over the curbs.
 *   • "Incheon International Airport Terminal 1 Departure.jpg", Arne Müseler,
 *     CC BY-SA 3.0 DE — the hall inside: the long skylight bands.
 *   • "Incheon-international-airport.jpg", ckgodman, CC0, and
 *     "Starcraft II Commercial on Korean Air - Seoul Incheon Airport.JPG",
 *     Bryan Rhee, CC BY-SA 3.0 — pier ends and glazing.
 * - Terrain: Mapterhorn has only z12 here (a surface model that still shows
 *   the terminal as a 25 m hump); the ground around is flat reclaimed land at
 *   about 3.5 m. The map fills the terrain under the footprint.
 *
 * Numbers
 * - Plan: measured from OSM (circle fits above).
 * - Roof crown 33 m: published height. The landside canopy reaches 17.5 m
 *   past the glass wall, its tip at 17.5 m at mid-length rising 7 m towards
 *   the ends (the lift is drawn from photos of the eave ends, its amount
 *   estimated and slightly exaggerated so it reads at phone size); it curves
 *   up to 24.5 m at a glazed clerestory (r 458 m), over which the hall vault
 *   starts at 29.5 m and rises to the crown. Inclined columns under the tip.
 * - Airside roof edge 26 m over a gate level 11 m tall: scaled from the
 *   apron photos against aircraft fins.
 * - Wings and piers 23 m to the roof (estimated, 747 fin scale), gate level
 *   11 m, curtain wall 11–21 m, roof edge 21–23 m; skylights 2.4 m.
 * - Mast frames 14 m above the roof (top ≈ 44 m): estimated from the
 *   JasonParis photo. Airside glass leans back 11.5 m over its 15 m height.
 * - Colours: glass sampled from the airside photos (#5c9184, #679788 in sun)
 *   and pulled light; panels warm pale grey (#a99972 sunlit, #7e7875 shade);
 *   roof silver-grey.
 *
 * Look-only (not used for shape or colour): Hugh Dutton Associés Flickr
 * construction photos (CC BY-NC-ND), Fentress Architects' project pages.
 *
 * Doubts
 * - No licensed photo shows the whole landside roof from close, so the roof
 *   section (where the crown sits, how deep the eave reaches) rests on the
 *   aerial, the eave soffit photos and the published 33 m.
 * - The piers' height and section are taken equal to the wings'.
 * - Jet bridges are placed at an even gate pitch, not one by one.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, quadN, unit, capPoly, area } from './nyc-570-lexington'
import { writeLod, drum, beam, prismRing, newMats, type Mats } from './tokyo-haneda-terminal-1'

export type { XY, Mats }

// ===========================================================================
// Kit (shared with the other Incheon models)
// ===========================================================================

/** Incheon colours, from daylight photos, pulled to the palette's lightness. */
export const ICN = {
  /** The silver metal of the main roofs and roof edges (darker than the flat roofs in every aerial). */
  roof: finish('icn-silver-roof', 0xb9c0c4),
  /** The flat roofs of the gate wings and piers. */
  flat: finish('icn-flat-roof', 0xd2d6d3),
  /** The green-tinted curtain walls, light by day; lit at night. */
  window: { name: 'window', color: 0x8fb4aa, roughness: 0.35 } as MaterialSpec,
  /** Warm pale-grey panels of the gate levels and cores. */
  panel: finish('icn-panel', 0xe0dbd1),
  /** White steel: masts, mullions, skylight frames. */
  white: finish('icn-white', 0xeff0ee),
  /** Skylights: green-tinted like the walls, but dark at night. */
  glass: { name: 'glass', color: 0xa3c6bf, roughness: 0.24 } as MaterialSpec,
  /** Jet bridges. */
  bridge: finish('icn-jet-bridge', 0xd0d4d6),
}

export const UP: V3 = [0, 0, 1]
export const DOWN: V3 = [0, 0, -1]

/**
 * A surface over a grid of points G[i][j], smooth-shaded: every face is
 * turned to agree with `hint` (a rough outward direction at a point), and
 * each vertex gets the mean of its faces' normals, so a curved roof shades
 * as one sweep. Part.tri then winds every face to its normal.
 */
export function gridSurf(p: Part, G: V3[][], hint: (q: V3) => V3) {
  const I = G.length - 1, J = G[0].length - 1
  const fn: V3[][] = []
  for (let i = 0; i < I; i++) {
    fn.push([])
    for (let j = 0; j < J; j++) {
      const a = G[i][j], b = G[i + 1][j], c = G[i + 1][j + 1], d = G[i][j + 1]
      const u: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]], v: V3 = [d[0] - b[0], d[1] - b[1], d[2] - b[2]]
      let n = unit([u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]])
      const m: V3 = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2, (a[2] + c[2]) / 2], h = hint(m)
      if (n[0] * h[0] + n[1] * h[1] + n[2] * h[2] < 0) n = [-n[0], -n[1], -n[2]]
      fn[i].push(n)
    }
  }
  const vn = (i: number, j: number): V3 => {
    let s: V3 = [0, 0, 0]
    for (const [di, dj] of [[-1, -1], [-1, 0], [0, -1], [0, 0]]) {
      const a = i + di, b = j + dj
      if (a < 0 || b < 0 || a >= I || b >= J) continue
      s = [s[0] + fn[a][b][0], s[1] + fn[a][b][1], s[2] + fn[a][b][2]]
    }
    return unit(s)
  }
  for (let i = 0; i < I; i++) for (let j = 0; j < J; j++) {
    const a = G[i][j], b = G[i + 1][j], c = G[i + 1][j + 1], d = G[i][j + 1]
    if (Math.hypot(c[0] - a[0], c[1] - a[1], c[2] - a[2]) < 1e-6) continue
    quadN(p, a, b, c, d, [vn(i, j), vn(i + 1, j), vn(i + 1, j + 1), vn(i, j + 1)])
  }
}

/** Points on an arc about c, radius r, from angle a0 to a1 (degrees), n segments. */
export function arcPts(c: XY, r: number, a0: number, a1: number, n: number): XY[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as XY
  })
}
export const polar = (c: XY, r: number, deg: number): XY => [c[0] + r * Math.cos((deg * Math.PI) / 180), c[1] + r * Math.sin((deg * Math.PI) / 180)]

/**
 * A vertical wall strip along a polyline, z0(i)…z1(i) per point, smooth along
 * its length, facing away from `inside` (a point the wall turns its back on,
 * or a function giving the outward direction).
 */
export function wallStrip(p: Part, pts: XY[], z0: number | ((i: number) => number), z1: number | ((i: number) => number), out: (q: XY) => XY, d = 0) {
  const Z0 = typeof z0 === 'number' ? () => z0 : z0, Z1 = typeof z1 === 'number' ? () => z1 : z1
  const off = pts.map((q, i) => {
    if (!d) return q
    const o = out(q)
    return [q[0] + o[0] * d, q[1] + o[1] * d] as XY
  })
  const G = off.map((q, i) => [[q[0], q[1], Z0(i)], [q[0], q[1], Z1(i)]] as V3[])
  gridSurf(p, G, (m) => { const o = out([m[0], m[1]]); return [o[0], o[1], 0] })
}

/**
 * Window panels on a wall strip: between neighbouring points of `pts`, one
 * broad panel per segment from z0 to z1, `margin` short of each end (the
 * wall shows between them as piers), 0.06 m proud of the wall.
 */
export function panelsAlong(p: Part, pts: XY[], z0: number, z1: number, out: (q: XY) => XY, margin: number, d = 0.06) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 2 * margin + 1) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], o = out(m)
    const A: XY = [a[0] + u[0] * margin + o[0] * d, a[1] + u[1] * margin + o[1] * d]
    const B: XY = [b[0] - u[0] * margin + o[0] * d, b[1] - u[1] * margin + o[1] * d]
    const n: V3 = [o[0], o[1], 0]
    quadN(p, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1], [n, n, n, n])
  }
}

/** Thin flush bars on a wall (mullions, floor lines): a quad strip from a to b at heights, d proud. */
export function bar(p: Part, a: V3, b: V3, w: number, n: V3, d = 0.1) {
  // width across, in the wall plane: perpendicular to (b − a) and n
  const t = unit([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
  const s = unit([t[1] * n[2] - t[2] * n[1], t[2] * n[0] - t[0] * n[2], t[0] * n[1] - t[1] * n[0]])
  const o = (q: V3, k: number): V3 => [q[0] + s[0] * k * w / 2 + n[0] * d, q[1] + s[1] * k * w / 2 + n[1] * d, q[2] + s[2] * k * w / 2 + n[2] * d]
  quadN(p, o(a, -1), o(b, -1), o(b, 1), o(a, 1), [n, n, n, n])
}

/**
 * A ribbon building on a plan ring with the two-layer Incheon wall: a panel
 * gate level 0…zGate with broad window bands, a green curtain wall up to
 * zGlass, a silver roof edge up to zRoof, and a flat roof. Every edge of the
 * ring gets the layers; the curtain wall gets white mullions every
 * `mullion` metres (0 for none). Returns nothing; draws into M.
 */
export function ribbonPrism(M: Mats, ring0: XY[], o: { zGate: number; zGlass: number; zRoof: number; roof?: string; mullion?: number; skipEdge?: (a: XY, b: XY) => boolean; winBand?: [number, number]; margin?: number }) {
  const ring = area(ring0) < 0 ? ring0.slice().reverse() : ring0.slice()
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.05) continue
    if (o.skipEdge?.(a, b)) continue
    const out: XY = [(b[1] - a[1]) / L, (a[0] - b[0]) / L], nn: V3 = [out[0], out[1], 0]
    const P = (q: XY, z: number): V3 => [q[0], q[1], z]
    quadN(M.panel, P(a, 0), P(b, 0), P(b, o.zGate), P(a, o.zGate), [nn, nn, nn, nn])
    quadN(M.win, P(a, o.zGate), P(b, o.zGate), P(b, o.zGlass), P(a, o.zGlass), [nn, nn, nn, nn])
    quadN(M[o.roof ?? 'roof'], P(a, o.zGlass), P(b, o.zGlass), P(b, o.zRoof), P(a, o.zRoof), [nn, nn, nn, nn])
    const wb = o.winBand ?? [3.2, 8.6], mg = o.margin ?? 1.6
    if (L > 2 * mg + 2) {
      const steps = Math.max(1, Math.round(L / 16))
      const pts: XY[] = Array.from({ length: steps + 1 }, (_, k) => [a[0] + ((b[0] - a[0]) * k) / steps, a[1] + ((b[1] - a[1]) * k) / steps])
      panelsAlong(M.win, pts, wb[0], wb[1], () => out, mg)
    }
    if (o.mullion && M.white) {
      const steps = Math.max(1, Math.round(L / o.mullion))
      for (let k = 1; k < steps; k++) {
        const q: XY = [a[0] + ((b[0] - a[0]) * k) / steps, a[1] + ((b[1] - a[1]) * k) / steps]
        bar(M.white, P(q, o.zGate), P(q, o.zGlass), 0.45, nn, 0.08)
      }
      bar(M.white, P(a, (o.zGate + o.zGlass) / 2), P(b, (o.zGate + o.zGlass) / 2), 0.4, nn, 0.08)
    }
  }
  capPoly(M[o.roof ?? 'roof'], ring, o.zRoof)
}

/**
 * A row of low glazed skylights on a flat roof, along a polyline: each a
 * round-topped glass ridge (half-cylinder section, `w` wide, `h` tall) with
 * white ends, in runs of `run` metres with `gap` between them.
 */
export function skylightRow(glass: Part, ends: Part, path: XY[], z: number, w: number, h: number, run: number, gap: number, seg: number) {
  // resample the path by length
  const cum = [0]
  for (let i = 1; i < path.length; i++) cum.push(cum[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]))
  const total = cum[cum.length - 1]
  const at = (s: number): [XY, XY] => {
    let k = 1
    while (k < cum.length - 1 && cum[k] < s) k++
    const t = (s - cum[k - 1]) / Math.max(1e-6, cum[k] - cum[k - 1])
    const a = path[k - 1], b = path[k]
    const L = cum[k] - cum[k - 1] || 1
    return [[a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], [(b[0] - a[0]) / L, (b[1] - a[1]) / L]]
  }
  const prof = Array.from({ length: seg + 1 }, (_, j) => { const a = Math.PI * (1 - j / seg); return [Math.cos(a) * w / 2, z + Math.sin(a) * h] as [number, number] })
  for (let s0 = gap / 2; s0 < total - 4; s0 += run + gap) {
    const s1 = Math.min(total - gap / 2, s0 + run)
    if (s1 - s0 < 4) break
    const k = Math.max(1, Math.round((s1 - s0) / 30))
    const G: V3[][] = []
    for (let i = 0; i <= k; i++) {
      const [q, t] = at(s0 + ((s1 - s0) * i) / k), nrm: XY = [-t[1], t[0]]
      G.push(prof.map(([d, zz]) => [q[0] + nrm[0] * d, q[1] + nrm[1] * d, zz] as V3))
    }
    gridSurf(glass, G, (m) => { const [q] = at((s0 + s1) / 2); return [m[0] - q[0], m[1] - q[1], m[2] - z + 0.01] })
    // end caps (half discs), white
    for (const [i, sg] of [[0, -1], [k, 1]] as [number, number][]) {
      const [q, t] = at(s0 + ((s1 - s0) * i) / k), nE: V3 = [t[0] * sg, t[1] * sg, 0]
      const row = G[i], c: V3 = [q[0], q[1], z]
      for (let j = 0; j < row.length - 1; j++) ends.tri(c, row[j], row[j + 1], undefined, undefined, undefined, [nE, nE, nE])
    }
  }
}

/**
 * A stair-and-lift core standing proud of a wall: a pale panel box `w` wide,
 * `depth` out from the wall face at q (outward unit `out`), from the ground
 * to z1, breaking the curtain wall as in the apron photos.
 */
export function core(p: Part, q: XY, out: XY, w: number, depth: number, z1: number) {
  const t: XY = [-out[1], out[0]]
  const A = (s: number, d: number): XY => [q[0] + t[0] * s + out[0] * d, q[1] + t[1] * s + out[1] * d]
  prismRing(p, [A(-w / 2, -1), A(w / 2, -1), A(w / 2, depth), A(-w / 2, depth)], 0, z1)
}

/** A white Π frame: two square posts at a and b from z0 to z1 and a beam across their tops. */
export function piFrame(p: Part, a: XY, b: XY, z0: number, z1: number, w: number) {
  const sq = (q: XY): XY[] => [[q[0] - w / 2, q[1] - w / 2], [q[0] + w / 2, q[1] - w / 2], [q[0] + w / 2, q[1] + w / 2], [q[0] - w / 2, q[1] + w / 2]]
  prismRing(p, sq(a), z0, z1 - w, null)
  prismRing(p, sq(b), z0, z1 - w, null)
  beam(p, a, b, w, z1 - w, z1, true)
  // close the beam's ends over the posts: beam already has caps; posts have no tops (hidden)
}

/** A thin straight rod between two points (square section), for cable stays. */
export function rod(p: Part, a: V3, b: V3, w: number) {
  const t = unit([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
  const ref: V3 = Math.abs(t[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const s = unit([t[1] * ref[2] - t[2] * ref[1], t[2] * ref[0] - t[0] * ref[2], t[0] * ref[1] - t[1] * ref[0]])
  const r = unit([t[1] * s[2] - t[2] * s[1], t[2] * s[0] - t[0] * s[2], t[0] * s[1] - t[1] * s[0]])
  const cs = [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([x, y]) => [s[0] * x * w / 2 + r[0] * y * w / 2, s[1] * x * w / 2 + r[1] * y * w / 2, s[2] * x * w / 2 + r[2] * y * w / 2] as V3)
  for (let k = 0; k < 4; k++) {
    const c0 = cs[k], c1 = cs[(k + 1) % 4], nn = unit([(c0[0] + c1[0]), (c0[1] + c1[1]), (c0[2] + c1[2])])
    quadN(p, [a[0] + c0[0], a[1] + c0[1], a[2] + c0[2]], [a[0] + c1[0], a[1] + c1[1], a[2] + c1[2]], [b[0] + c1[0], b[1] + c1[1], b[2] + c1[2]], [b[0] + c0[0], b[1] + c0[1], b[2] + c0[2]], [nn, nn, nn, nn])
  }
}

/**
 * Jet bridges: from each root point on a wall, a glazed-grey box running out
 * along `dir` for `len` metres at z0…z1, ending at a cab, on a round post.
 */
export function jetBridge(M: Mats, root: XY, dir: XY, len: number, z0 = 4.4, z1 = 7.6) {
  const end: XY = [root[0] + dir[0] * len, root[1] + dir[1] * len]
  beam(M.bridge, root, end, 3.6, z0, z1, true)
  // rotunda at the root side and a drive post near the end
  drum(M.bridge, end[0], end[1], 0.5, 0.5, 0, z0, 6, null)
  const cab: XY = [end[0] + dir[0] * 2.5, end[1] + dir[1] * 2.5]
  beam(M.bridge, end, cab, 4.6, z0 - 0.2, z1 + 0.3, true)
}

// ===========================================================================
// Terminal 1
// ===========================================================================

/** The centre of the plan's circles (model frame), and their radii. */
const C: XY = [290.5, -409.2]
const R_LAND = 410.5, R_AIR = 567.5
const TH_E = 82.0, TH_W = 166.8
/** The main building's landside wall (behind the eave) and its airside glass top. */
const R_WALL = 428, R_GLASS_TOP = 556
/** The clerestory: where the landside canopy meets the hall vault, with a glazed riser between. */
const R_CL = 458
const Z_GATE = 11, Z_AIR_EDGE = 26, CROWN = 33
const Z_WING = 23, Z_WING_GATE = 11, Z_WING_GLASS = 21
/** Wings: inner radius and tip angle. */
const WING_E = { r0: 510.3, a0: TH_E, a1: 69.7 }
const WING_W = { r0: 505.0, a0: TH_W, a1: 179.0 }
/** Piers: axis angle, root/narrowing/end radii, half-widths (m). */
const PIERS = [
  { axis: 106.1, half0: 31, half1: 25.5, rNarrow: 785, rEnd: 915 },
  { axis: 144.1, half0: 31, half1: 25.5, rNarrow: 784, rEnd: 910.5 },
]

/** The landside eave lifts towards both ends of the building, like a temple roof (exaggerated a little). */
function eaveLift(r: number, th: number) {
  const mid = (TH_E + TH_W) / 2, half = (TH_W - TH_E) / 2
  const s = Math.min(1, Math.abs(th - mid) / half)
  const v = Math.max(0, 1 - (r - R_LAND) / (R_CL - R_LAND))
  return 8 * Math.pow(s, 2.2) * Math.pow(v, 1.3)
}
/** The landside canopy: a swoop, low and nearly level at its tip, curving up to the clerestory. */
const canopyZ = (r: number) => 15 + 10 * Math.pow(Math.max(0, Math.min(1, (r - R_LAND) / (R_CL - R_LAND))), 0.8)
/** The hall vault over the clerestory: up to the 33 m crown, down to the airside edge. */
const vaultZ = (r: number) => {
  const u = Math.max(0, Math.min(1, (r - R_CL) / (R_AIR - R_CL)))
  return u < 0.4 ? 29.5 + (CROWN - 29.5) * Math.sin((Math.PI / 2) * (u / 0.4)) : CROWN - (CROWN - Z_AIR_EDGE) * Math.pow((u - 0.4) / 0.6, 1.6)
}
/** Top of the main roof at radius r and angle θ (degrees): canopy landside of R_CL, vault beyond. */
function roofTop(r: number, th: number) {
  return r < R_CL ? canopyZ(r) + eaveLift(r, th) : vaultZ(r)
}
const ROOF_T = 1.6
/** Mast frames' height over the roof. */
const MAST = 14

function buildT1(detail: boolean) {
  const M = newMats(['roof', 'flat', 'win', 'panel', 'white', 'glass'])
  M.bridge = M.panel // jet bridges in the panel colour, to stay within six materials
  const nTh = detail ? 64 : 30
  const rsC = detail ? [R_LAND, 413, 416, 420, 424, R_WALL, 434, 440, 446, 452, R_CL - 0.01] : [R_LAND, 415, 421, R_WALL, 438, 448, R_CL - 0.01]
  const rsV = detail ? [R_CL, 466, 474, 482, 490, 498, 506, 515, 523, 530, 538, 545, 553, R_GLASS_TOP, 564, R_AIR] : [R_CL, 470, 484, 500, 515, 530, 545, R_GLASS_TOP, R_AIR]
  const rsD = [...rsC, ...rsV]
  const ths = Array.from({ length: nTh + 1 }, (_, i) => TH_E + ((TH_W - TH_E) * i) / nTh)
  const P3 = (r: number, th: number, z: number): V3 => { const q = polar(C, r, th); return [q[0], q[1], z] }
  const outR = (q: XY): XY => unit([q[0] - C[0], q[1] - C[1], 0]).slice(0, 2) as XY
  const inR = (q: XY): XY => { const o = outR(q); return [-o[0], -o[1]] }

  // --- Main roof: the top sweep, the edge fascias and the soffits under the overhangs
  gridSurf(M.roof, ths.map((th) => rsC.map((r) => P3(r, th, roofTop(r, th)))), () => UP)
  gridSurf(M.roof, ths.map((th) => rsV.map((r) => P3(r, th, roofTop(r, th)))), () => UP)
  // the clerestory: a glazed riser from the canopy's top up under the vault's landside edge, and that edge's fascia
  gridSurf(M.glass, ths.map((th) => [P3(R_CL - 0.3, th, roofTop(R_CL - 0.01, th)), P3(R_CL - 0.3, th, vaultZ(R_CL) - ROOF_T)]), (m) => { const o = inR([m[0], m[1]]); return [o[0], o[1], 0] })
  gridSurf(M.roof, ths.map((th) => [P3(R_CL, th, vaultZ(R_CL) - ROOF_T), P3(R_CL, th, vaultZ(R_CL))]), (m) => { const o = inR([m[0], m[1]]); return [o[0], o[1], 0] })
  // inclined columns under the canopy's tip
  for (let th = TH_E + 2; th < TH_W - 1; th += detail ? 2.6 : 5.2) {
    const f = polar(C, R_WALL - 7, th), t = polar(C, R_LAND + 3, th)
    rod(M.white, [f[0], f[1], 0], [t[0], t[1], roofTop(R_LAND + 3, th) - ROOF_T], detail ? 0.8 : 1.2)
  }
  // landside eave fascia and the soffit back to the wall
  gridSurf(M.roof, ths.map((th) => [P3(R_LAND, th, roofTop(R_LAND, th) - ROOF_T * 0.7), P3(R_LAND, th, roofTop(R_LAND, th))]), (m) => { const o = inR([m[0], m[1]]); return [o[0], o[1], 0] })
  const softRs = rsD.filter((r) => r <= R_WALL)
  gridSurf(M.white, ths.map((th) => softRs.map((r, k) => P3(r, th, roofTop(r, th) - ROOF_T * (k === 0 ? 0.7 : 1)))), () => DOWN) // white soffit, as in the landside photos
  // airside edge fascia and soffit over the inclined glass
  gridSurf(M.roof, ths.map((th) => [P3(R_AIR, th, roofTop(R_AIR, th) - ROOF_T), P3(R_AIR, th, roofTop(R_AIR, th))]), (m) => { const o = outR([m[0], m[1]]); return [o[0], o[1], 0] })
  gridSurf(M.white, ths.map((th) => [P3(R_GLASS_TOP, th, roofTop(R_GLASS_TOP, th) - ROOF_T), P3(R_AIR, th, roofTop(R_AIR, th) - ROOF_T)]), () => DOWN)
  // end fascias of the roof slab, and the glazed end walls under the roof
  for (const [th, sg] of [[TH_E, -1], [TH_W, 1]] as [number, number][]) {
    const t = unit([-Math.sin((th * Math.PI) / 180) * sg, Math.cos((th * Math.PI) / 180) * sg, 0])
    gridSurf(M.roof, [rsD.map((r) => P3(r, th, roofTop(r, th))), rsD.map((r, k) => P3(r, th, roofTop(r, th) - ROOF_T * (r < R_WALL || r > R_GLASS_TOP ? 1 : 1)))], () => t)
    // the end wall: curtain wall from the landside wall to the airside glass
    const wr = rsD.filter((r) => r >= R_WALL && r <= R_GLASS_TOP)
    gridSurf(M.win, [wr.map((r) => P3(r, th, Z_GATE)), wr.map((r) => P3(r, th, roofTop(r, th) - ROOF_T))], () => t)
    gridSurf(M.panel, [wr.map((r) => P3(r, th, 0)), wr.map((r) => P3(r, th, Z_GATE))], () => t)
    // and the bit of gate level between the glass foot and the airside edge
    gridSurf(M.panel, [[P3(R_GLASS_TOP, th, 0), P3(R_AIR, th, 0)], [P3(R_GLASS_TOP, th, Z_GATE), P3(R_AIR, th, Z_GATE)]], () => t)
    // mullions on the end wall
    const tt: V3 = t
    for (let r = R_WALL + 14; r < R_GLASS_TOP - 6; r += 14) bar(M.white, P3(r, th, Z_GATE), P3(r, th, roofTop(r, th) - ROOF_T), 0.6, tt, 0.08)
  }
  // skylight bands along the hall (glass strips on the roof, following its curve)
  for (const [ra, rb] of (detail ? [[490, 496], [512, 518]] : [[490, 496], [512, 518]]) as [number, number][]) {
    const th0 = TH_E + 6, th1 = TH_W - 6
    const tt = Array.from({ length: (detail ? 48 : 22) + 1 }, (_, i) => th0 + ((th1 - th0) * i) / (detail ? 48 : 22))
    gridSurf(M.glass, tt.map((th) => [P3(ra, th, roofTop(ra, th) + 0.25), P3(rb, th, roofTop(rb, th) + 0.25)]), () => UP)
    for (const th of [th0, th1]) {
      const t = unit([-Math.sin((th * Math.PI) / 180) * (th === th0 ? -1 : 1), Math.cos((th * Math.PI) / 180) * (th === th0 ? -1 : 1), 0])
      gridSurf(M.glass, [[P3(ra, th, roofTop(ra, th) - 0.2), P3(rb, th, roofTop(rb, th) - 0.2)], [P3(ra, th, roofTop(ra, th) + 0.25), P3(rb, th, roofTop(rb, th) + 0.25)]], () => t)
    }
    for (const r of [ra, rb]) gridSurf(M.glass, tt.map((th) => [P3(r, th, roofTop(r, th) - 0.2), P3(r, th, roofTop(r, th) + 0.25)]), (m) => { const o = r === ra ? inR([m[0], m[1]]) : outR([m[0], m[1]]); return [o[0], o[1], 0] })
  }

  // --- Landside wall: the departures hall's curtain wall, set back under the eave
  const wallPts = ths.map((th) => polar(C, R_WALL, th))
  const soffitAt = (th: number) => roofTop(R_WALL, th) - ROOF_T
  wallStrip(M.win, wallPts, 0, (i) => soffitAt(ths[i]), inR)
  // white mullions every ~18 m and two transoms (the departures and mezzanine floors)
  for (let i = 1; i < ths.length - 1; i += detail ? 1 : 2) {
    const q = wallPts[i], o = inR(q)
    bar(M.white, [q[0], q[1], 0], [q[0], q[1], soffitAt(ths[i])], detail ? 0.6 : 0.9, [o[0], o[1], 0])
  }
  for (const z of [8.5, 16]) for (let i = 0; i < ths.length - 1; i++) {
    const a = wallPts[i], b = wallPts[i + 1], o = inR([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2])
    bar(M.white, [a[0], a[1], z], [b[0], b[1], z], 0.7, [o[0], o[1], 0])
  }

  // --- Airside wall: the panelled gate level, then the inclined glass up under the roof edge
  const airPts = ths.map((th) => polar(C, R_AIR, th))
  wallStrip(M.panel, airPts, 0, Z_GATE, outR)
  panelsAlong(M.win, airPts, 3.2, 8.8, outR, 1.4)
  gridSurf(M.win, ths.map((th) => [P3(R_AIR, th, Z_GATE), P3(R_GLASS_TOP, th, roofTop(R_GLASS_TOP, th) - ROOF_T)]), (m) => { const o = outR([m[0], m[1]]); return [o[0], o[1], 0.3] })
  // a ledge at the glass foot
  gridSurf(M.white, ths.map((th) => [P3(R_AIR + 0.4, th, Z_GATE), P3(R_AIR + 0.4, th, Z_GATE + 0.9)]), (m) => { const o = outR([m[0], m[1]]); return [o[0], o[1], 0] })
  for (let i = 1; i < ths.length - 1; i += detail ? 1 : 2) {
    const th = ths[i], a = P3(R_AIR, th, Z_GATE), b = P3(R_GLASS_TOP, th, roofTop(R_GLASS_TOP, th) - ROOF_T)
    const o = outR([a[0], a[1]]), dz = b[2] - a[2], dr = R_AIR - R_GLASS_TOP
    const nn = unit([o[0] * dz, o[1] * dz, dr])
    bar(M.white, a, b, detail ? 0.5 : 0.8, nn, 0.08)
  }

  // --- Masts with cable stays along the main roof's airside (white Π frames)
  const mastTh = detail ? 6.5 : 13
  for (let th = TH_E + 8; th <= TH_W - 7; th += mastTh) {
    const rM = 545, w = detail ? 1.0 : 1.7
    const a = polar(C, rM, th - 1.5), b = polar(C, rM, th + 1.5)
    const zr = roofTop(rM, th)
    piFrame(M.white, a, b, zr - 0.5, zr + MAST, w)
    if (detail) {
      // stays from the frame's top corners down to the roof, both ways along the roof and across it
      for (const [q, dth] of [[a, -1], [b, 1]] as [XY, number][]) {
        const top: V3 = [q[0], q[1], zr + MAST - 0.5]
        for (const [rr, tt] of [[rM, th + dth * 5], [rM - 34, th + dth * 1.5], [rM + 14, th + dth * 1.5]] as [number, number][]) {
          const g = polar(C, rr, tt)
          rod(M.white, top, [g[0], g[1], roofTop(rr, tt) + 0.1], 0.22)
        }
      }
    }
  }

  // --- The wings: the crescent's curve continued to round tips
  const wingRing = (r0: number, a0: number, a1: number): XY[] => {
    const rm = (r0 + R_AIR) / 2, hw = (R_AIR - r0) / 2
    const dir = Math.sign(a1 - a0)
    const n = Math.max(6, Math.round(Math.abs(a1 - a0) / (detail ? 1 : 1.6)))
    // the tip: a half circle about the end of the centre line, turned to the arc's tangent there
    const tipC = polar(C, rm, a1)
    const tang = unit([-Math.sin((a1 * Math.PI) / 180) * dir, Math.cos((a1 * Math.PI) / 180) * dir, 0])
    const radial = unit([tipC[0] - C[0], tipC[1] - C[1], 0])
    const tip: XY[] = Array.from({ length: (detail ? 12 : 8) - 1 }, (_, k) => {
      const ang = Math.PI * ((k + 1) / (detail ? 12 : 8)) // from the outer edge round to the inner edge
      const cr = Math.cos(ang), sr = Math.sin(ang)
      return [tipC[0] + radial[0] * hw * cr + tang[0] * hw * sr, tipC[1] + radial[1] * hw * cr + tang[1] * hw * sr] as XY
    })
    // start a little inside the main building so the joint is closed
    const s0 = a0 - dir * 0.4
    return [...arcPts(C, R_AIR, s0, a1, n), ...tip, ...arcPts(C, r0, a1, s0, n)]
  }
  const wings = [wingRing(WING_E.r0, WING_E.a0, WING_E.a1), wingRing(WING_W.r0, WING_W.a0, WING_W.a1)]
  for (const ring of wings) {
    ribbonPrism(M, ring, { zGate: Z_WING_GATE, zGlass: Z_WING_GLASS, zRoof: Z_WING, roof: 'flat', mullion: detail ? 6 : 0 })
  }
  // skylight rows along the wings
  for (const [w, r0] of [[WING_E, WING_E.r0], [WING_W, WING_W.r0]] as [typeof WING_E, number][]) {
    const dir = Math.sign(w.a1 - w.a0)
    for (const rr of [r0 + 17, R_AIR - 17]) {
      const path = arcPts(C, rr, w.a0 + dir * 0.6, w.a1 - dir * 1.2, detail ? 14 : 7)
      skylightRow(M.glass, M.white, path, Z_WING, 7, 2.4, detail ? 36 : 54, 6, detail ? 6 : 3)
    }
  }

  // stair cores through the wings' curtain walls, both faces
  for (const w of [WING_E, WING_W]) {
    const dir = Math.sign(w.a1 - w.a0)
    for (let th = w.a0 + dir * 4; dir * (w.a1 - th) > 2; th += dir * 5.5) {
      const qa = polar(C, R_AIR, th), o = outR(qa)
      core(M.panel, qa, o, 11, 2.2, Z_WING + 1.2)
      const qi = polar(C, w.r0, th + dir * 2.5)
      core(M.panel, qi, inR(qi), 11, 2.2, Z_WING + 1.2)
    }
  }

  // --- The piers: straight and radial, round-ended
  for (const pr of PIERS) {
    const ax = (pr.axis * Math.PI) / 180, u: XY = [Math.cos(ax), Math.sin(ax)], v: XY = [-u[1], u[0]]
    const Q = (r: number, s: number): XY => [C[0] + u[0] * r + v[0] * s, C[1] + u[1] * r + v[1] * s]
    const r0 = R_AIR - 6, rTipC = pr.rEnd - pr.half1, nT = detail ? 12 : 8
    const tip: XY[] = Array.from({ length: nT - 1 }, (_, k) => { const a = Math.PI * ((k + 1) / nT); return Q(rTipC + Math.sin(a) * pr.half1, -Math.cos(a) * pr.half1) })
    const ring: XY[] = [Q(r0, -pr.half0), Q(pr.rNarrow, -pr.half0), Q(pr.rNarrow + 1.5, -pr.half1), Q(rTipC, -pr.half1), ...tip, Q(rTipC, pr.half1), Q(pr.rNarrow + 1.5, pr.half1), Q(pr.rNarrow, pr.half0), Q(r0, pr.half0)]
    // split the long sides so the window bands come in bays
    const dense: XY[] = []
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const k = Math.max(1, Math.round(L / 16))
      for (let j = 0; j < k; j++) dense.push([a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k])
    }
    ribbonPrism(M, dense, { zGate: Z_WING_GATE, zGlass: Z_WING_GLASS, zRoof: Z_WING, roof: 'flat', mullion: detail ? 6 : 0, skipEdge: (a, b) => { const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; return Math.hypot(m[0] - C[0], m[1] - C[1]) < R_AIR - 3 } })
    for (const s of [-pr.half1 + 11, pr.half1 - 11]) skylightRow(M.glass, M.white, [Q(R_AIR + 6, s), Q(rTipC - 4, s)], Z_WING, 7, 2.4, detail ? 36 : 60, 6, detail ? 6 : 3)
    for (const sg of [-1, 1]) for (let r = R_AIR + 70; r < rTipC - 30; r += 95) core(M.panel, Q(r, sg * (r < pr.rNarrow ? pr.half0 : pr.half1)), [v[0] * sg, v[1] * sg], 11, 2.2, Z_WING + 1.2)
    // rooftop plant box near the root
    prismRing(M.panel, [Q(R_AIR + 30, -9), Q(R_AIR + 52, -9), Q(R_AIR + 52, 9), Q(R_AIR + 30, 9)], Z_WING - 0.2, Z_WING + 3.4)
    if (detail) {
      // jet bridges along both sides
      for (const sg of [-1, 1]) for (let r = R_AIR + 40; r < rTipC - 10; r += 62) {
        const root = Q(r, sg * (r < pr.rNarrow ? pr.half0 : pr.half1)), dir: XY = [v[0] * sg, v[1] * sg]
        jetBridge(M, root, dir, 22)
      }
    }
  }
  // rooftop plant boxes on the wings (stone-clad, as in the apron photos)
  for (const [w, r0] of [[WING_E, WING_E.r0], [WING_W, WING_W.r0]] as [typeof WING_E, number][]) {
    const dir = Math.sign(w.a1 - w.a0), am = w.a0 + dir * 5
    const rr = (r0 + R_AIR) / 2
    const ring = [polar(C, rr - 8, am - 1.2), polar(C, rr - 8, am + 1.2), polar(C, rr + 8, am + 1.2), polar(C, rr + 8, am - 1.2)]
    prismRing(M.panel, ring, Z_WING - 0.2, Z_WING + 3.4)
  }

  // --- Jet bridges (detail): along the main building's and the wings' airside edge
  if (detail) {
    const gates: number[] = []
    for (let th = 71.5; th <= 177.5; th += 4.6) gates.push(th)
    for (const th of gates) {
      // keep clear of the piers' roots
      if (PIERS.some((p) => Math.abs(th - p.axis) < 4.2)) continue
      const q = polar(C, R_AIR, th), o = outR(q)
      jetBridge(M, q, o, 20)
    }
  }

  return [
    { part: M.roof, material: ICN.roof },
    { part: M.flat, material: ICN.flat },
    { part: M.win, material: ICN.window },
    { part: M.panel, material: ICN.panel },
    { part: M.white, material: ICN.white },
    { part: M.glass, material: { name: 'glass', color: 0x7b9e9d, roughness: 0.24 } as MaterialSpec }, // clerestory and skylights: darker, as in the aerial
  ]
}

if (import.meta.main) {
  const extras = { bearing: 0, osm: 'relation/3917466', height: CROWN }
  writeLod('Incheon International Airport Terminal 1', 'incheon-airport-terminal-1.glb', buildT1(false), extras, 8000, 250_000)
  writeLod('Incheon International Airport Terminal 1', 'incheon-airport-terminal-1.detail.glb', buildT1(true), extras, 40_000, 1_500_000)
}
