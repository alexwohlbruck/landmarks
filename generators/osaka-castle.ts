/**
 * Osaka Castle main tower (大阪城天守閣, Ōsaka-jō Tenshukaku), Chūō-ku,
 * Osaka: the 1931 steel-framed reinforced-concrete reconstruction, five
 * outer roofs over eight floors, and the tenshudai (the stone base, ishigaki)
 * it stands on — procedural, CC0-1.0.
 * bun generators/osaka-castle.ts
 *
 * Writes models/osaka-castle.glb (low) and models/osaka-castle.detail.glb
 * (detail: finer roof curves, rafter ends, the gold line of the eave tiles,
 * gold hip-end tiles, the gables' lattice and gold studs, window grilles,
 * the lookout's railing posts, the black storey's gold fittings, the corner
 * stones of the ishigaki, fuller shachihoko and tigers).
 *
 * This file also exports the castle/shrine helpers the other Osaka models
 * use (osaka-castle-otemon.ts, osaka-tenmangu.ts): `croof` (the kit's
 * curved Japanese roof with a karahafu bump on chosen eaves), `hafu` (a
 * chidori-hafu gable standing on a roof), `shachi` (a gilt shachihoko),
 * `tube`, `onFace`. The models are only written when this file runs itself.
 *
 * Map frame: x east, y north, z up, metres, turned to the tower's axis. OSM
 * way/34619038 (大阪城, height=58, building:levels=8) and its four nested
 * building:part squares (way/1223142998, -2999, -3000, -3001) all have their
 * sides at 5° / 95°, so the catalog bearing is 5. Origin: the outline's area
 * centroid (135.5258558, 34.6873727), which is also the common centre of the
 * four parts (within 0.1 m).
 *
 * Identity, in order: the tall white tower in five diminishing stages on its
 * steep dark granite base; pale blue-green copper-tiled roofs with upturned
 * corners; the big white lattice gables (chidori-hafu) with gold crests —
 * one huge gable on the first roof and one on the third on the south and
 * north faces, two small ones on the first roof, one on the second and one
 * on the fourth on the east and west; the black top storey with its gilded
 * tigers; the dark lookout gallery under the top hip-and-gable roof, whose
 * east and west eaves rise in a karahafu arch; the two gold shachihoko on
 * its ridge.
 *
 * Evidence:
 *  - OSM (fetched 2026-11): way/34619038, the tenshudai, 37.2 × 41.4 m in the
 *    model frame (x -18.6..18.6, y -20.7..20.9); its parts, all centred on
 *    the origin: way/1223142998 32.8 × 37.3 (levels 4: the first storey's
 *    walls), way/1223142999 27.1 × 31.3 (levels 5), way/1223143000
 *    21.2 × 21.4 (levels 6), way/1223143001 12.3 × 11.2 (levels 8, the
 *    lookout floor). way/1550234049 (also historic=castle, 大阪城) is the
 *    whole castle precinct inside the outer moat (~950 × 900 m): not this
 *    model and not in `replaces`. way/518143058 and way/518143060
 *    (building:part, no tags) south of the base are the kotenshudai (small
 *    tower base, the entrance court and the lift); not modelled, not in
 *    `replaces` (see the report).
 *  - published: the tenshudai ishigaki 13.3 m; the tower 39.4 m above it;
 *    52.7 m in all (Osaka Prefecture, 大阪城天守閣 description, cited in
 *    pref.osaka.lg.jp/documents/140847/shousai_oskajyo.pdf); five outer
 *    roofs, eight floors, faces south, completed 1931 (ja.wikipedia
 *    大阪城天守閣; the prefecture). The OSM height=58 is not used.
 *  - widths (measured on Kakidai's frontal south view, "2018 Osaka Castle
 *    01.jpg", at 25 px/m, its scale set by the first storey = the OSM
 *    part's 32.8 m): storey walls E-W 32.8 / 27.4 / 22.2 / 17.6 (est.) /
 *    14.8 (the black storey), the lookout cage 15.8; eaves 37.5 / 32.6 /
 *    26.6 / 20.6 / 17.6; the big gables 34.0 (first roof) and 22.8 (third
 *    roof) wide. The storeys' N-S depths follow the OSM parts (37.3, 31.3,
 *    21.4); the upper storeys are drawn square.
 *  - heights above the base (same photo, 25 px/m, each level corrected for
 *    its setback from the camera at ~0.22 m per metre of depth, the top set
 *    to the published 39.4): first storey wall 4.9, first eave 5.8; second
 *    storey windows 10.2-11.8, eave 12.6; third storey windows 16.0-17.6,
 *    eave 19.5; fourth eave 24.3; the black storey 25.4-28.0; the lookout
 *    28.0-31.5 (an open gallery: the balcony and its railing at the eave
 *    line, the glazing 0.6 m behind it); top eave 32.3, top gable foot 33.0, apex 36.8, shachihoko
 *    to 39.4. Gables: first roof 6.8-16.3, third roof 20.2-26.8. East/west
 *    gables (estimated from Mc681's south-east view and 663highland's
 *    south-west view): first roof pair 6.8-11.8 (10 m wide), second roof
 *    14.0-20.2 (15 m), fourth roof 24.9-28.5 (8.5 m).
 *  - the base: 13.3 m (published; a quarter of the 52.7 m total), its top
 *    0.5 m outside the first storey, its foot on the OSM outline (1.7 m
 *    out; 663highland's south-west view suggests ~2 m, kept to the outline
 *    so it stays off the kotenshudai), the face flaring out at the foot
 *    (ōgi-no-kōbai). The detail model steps in at each of 11 courses.
 *  - colours (daylight photos, pulled to the palette's lightness): white
 *    plaster #f1efe9; copper tiles, a pale
 *    blue-green verdigris #8ab3a3 (sampled #9ca6a2-#a3b0ae in Kakidai's
 *    view, #afcdbf sunlit in Mc681's); gold leaf #d4aa4a; the black storey,
 *    gable bands and railing charcoal #4a4f57 (the palette's floor; photo
 *    near-black); the ishigaki's dark granite #726e69 (sampled #686561-
 *    #78706a in Ethan Doyle White's entrance view); the lookout's glazing
 *    and the windows the palette's slate.
 *  - night: the tower is floodlit white all over and its windows are lit
 *    (Mc681's night view, Falbisoner's night view); the base stays dark.
 *    White plaster and gold carry `_FLOODLIGHT`; the roofs a little.
 *  - terrain: the map's terrain here (Mapterhorn z14; z15 is missing) is a
 *    coarse surface model: it shows the base as a 7-8 m hump and the trees
 *    east of it as ground up to 24.7 m above the plaza. The base is drawn to
 *    its published 13.3 m from y = 0; elevation 0. See the report.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - 2018 Osaka Castle 01.jpg and 02.jpg, Kakidai, CC BY-SA 4.0 (south, frontal)
 *  - Osaka Castle, Keep tower, South view 20190415 1.jpg, DXR, CC BY-SA 4.0 (south)
 *  - Osaka Castle Keep Tower in 201409.JPG, Mc681, CC BY-SA 4.0 (south-east)
 *  - Osaka Castle Keep Tower in 201504 005.JPG, Mc681, CC BY-SA 4.0 (night, south-east)
 *  - Osaka Castle 01bs3200.jpg, 02bs3200.jpg, 03bs3200.jpg, 663highland, CC BY 2.5 (south-west, from above)
 *  - Osaka Castle 04s5s4272.jpg, 663highland, CC BY 2.5 (north-west)
 *  - Osaka Castle and walls.jpg, Ian G Shingler, CC BY-SA 4.0 (south-west, close)
 *  - Detail on the Osaka Castle Keep Tower (III)-(VI).jpg, Ethan Doyle White, CC BY-SA 4.0 (gables, eaves, gold)
 *  - Entrance to Osaka Castle Keep Tower.jpg, Ethan Doyle White, CC BY-SA 4.0 (first storey, entrance)
 *  - Osaka castle 2.jpg-12.jpg, Syced, CC0 (the base and first storey from below)
 *  - Osaka Castle and OBP.jpg, Sakai Yayoi, CC0 (west-south-west, from above)
 *  - Osaka.castle.aerial photography.jpg, ブルーノ・プラス, CC BY-SA 4.0 (aerial)
 *  - Osaka Castle at Night, November 2016.jpg, Martin Falbisoner, CC BY-SA 4.0 (night)
 * No commercial imagery, no 3D tiles. No look-only references.
 *
 * Left out: the kotenshudai and the lift tower on it, the entrance door and
 * its canopy (they open into the kotenshudai court), the wire net round the
 * lookout (drawn as the dark gallery it reads as).
 * Doubts: the north side is drawn as the south (the few north views agree);
 * the east and west gables' sizes are estimated from oblique views; the
 * upper storeys' N-S depths and the fourth storey's walls are not seen
 * squarely in any photo; the OSM outline is read as the base's top edge
 * (the first storey stands 2 m inside it).
 */
import { Part, cross, sub, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { bar, grid, quadOut, triOut, rbox, placed, rafterEnds, save, type Mat } from './tokyo-meiji-jingu'
import { box } from './seoul-geunjeongjeon'
import { triangulate, type XY } from './chi-aon-center'

const TAU = Math.PI * 2
const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

// ===========================================================================
// Kit (exported for the other Osaka models)

/** The parts a Japanese castle or shrine roof draws into. */
export type RoofParts = { roof: Part; ridge: Part; gable: Part; soffit: Part; edge: Part; gilt?: Part }

export type CRoof = {
  cx?: number; cy?: number
  /** Eave half-sizes at the middle of each side; top of the tile at the eave. */
  ex: number; ey: number; ze: number
  /** 'paljak' hip-and-gable (gables on ±x, ridge along x), 'hip', 'skirt' (a lower roof up to the wall gx, gy at zg). */
  kind: 'paljak' | 'hip' | 'skirt'
  gx: number; gy: number; zg: number; zr?: number
  lift: number; flare: number; pow?: number; sag?: number; th?: number
  soffit?: { bx: number; by: number; zb: number }
  ridge?: { h: number; w: number }
  hipRidge?: { w: number; h: number }
  ridgeSag?: number
  /** Lean of the gables in at the ridge (paljak): the ridge's half-length. */
  rx?: number
  /** Resolution: 2 coarsest, true coarse, false fine. */
  coarse?: boolean | 2
  /** A karahafu bump on the eaves of these sides (0 S/-y, 1 E/+x, 2 N/+y, 3 W/-x): half-width as a fraction of the side, height. */
  kara?: { sides: number[]; a: number; h: number }
  /** A thin gold line along the eave tiles (detail). */
  giltLine?: boolean
}

/**
 * The curved Japanese roof: the kit's `jroof` (tokyo-meiji-jingu.ts), with
 * a karahafu option (the eave arched up in the middle of a side) and a gold
 * eave line. Parts: roof (tile surface), ridge (ridges), gable (the gable
 * triangles of a paljak), soffit, edge (the fascia under the tile edge).
 */
export function croof(P: RoofParts, o: CRoof) {
  const cx = o.cx ?? 0, cy = o.cy ?? 0
  const pow = o.pow ?? 1.6, sag = o.sag ?? 0.5, th = o.th ?? 0.6
  const zr = o.zr ?? o.zg
  let U = o.coarse === 2 ? [0, 0.6, 0.9, 1] : o.coarse ? [0, 0.45, 0.75, 0.92, 1] : [0, 0.3, 0.5, 0.64, 0.75, 0.84, 0.91, 0.96, 1]
  if (o.kara) {
    const a = o.kara.a, extra = o.coarse ? [0.35, 0.7, 1.0] : [0.2, 0.4, 0.6, 0.8, 1.0, 1.15]
    U = [...new Set([...U.filter((u) => u === 0 || u > a * 1.2), ...extra.map((f) => +(f * a).toFixed(4))])].sort((p, q) => p - q)
  }
  const us = [...U.slice(1).reverse().map((u) => -u), ...U]
  const T = o.kind === 'skirt' ? (o.coarse ? [0, 0.4, 1] : [0, 0.3, 0.65, 1]) : o.coarse ? [0, 0.25, 0.6, 1] : [0, 0.14, 0.33, 0.57, 0.8, 1]
  const prof = (t: number) => (1 - sag) * t + sag * t * t
  const L = (t: number) => Math.pow(1 - t, 1.15)
  const bell = (u: number) => (o.kara && Math.abs(u) < o.kara.a ? 0.5 * (1 + Math.cos(Math.PI * u / o.kara.a)) : 0)
  const band = (k: number, A: number, B: number, A1: number, B1: number) => (u: number, t: number): [number, number, number] => {
    const q = Math.max(0, (Math.abs(u) - 0.3) / 0.7), a = Math.pow(q, pow), l = L(t)
    const along = u * (A + (A1 - A) * t + o.flare * l * a)
    const out = B + (B1 - B) * t + o.flare * l * a
    const kb = o.kara && o.kara.sides.includes(k) ? o.kara.h * bell(u) * Math.pow(1 - t, 1.6) : 0
    return [along, -out - kb * 0.25, o.ze + (o.zg - o.ze) * prof(t) + o.lift * l * a + kb]
  }
  const turn = (k: number, [x, y, z]: [number, number, number]): V3 => {
    const r = [[x, y], [-y, x], [-x, -y], [y, -x]][k]
    return [cx + r[0], cy + r[1], z]
  }
  const sides = [0, 1, 2, 3].map((k) => (k % 2 === 0 ? band(k, o.ex, o.ey, o.gx, o.gy) : band(k, o.ey, o.ex, o.gy, o.gx)))
  for (let k = 0; k < 4; k++) grid(P.roof, us.map((u) => T.map((t) => turn(k, sides[k](u, t)))))
  const ring: V3[] = []
  for (let k = 0; k < 4; k++) for (const u of us.slice(0, -1)) ring.push(turn(k, sides[k](u, 0)))
  const n = ring.length
  const at = (f: number) => ring.map(([x, y, z]) => [x, y, z - th * f] as V3)
  const low = at(1), mid = at(0.45), g1 = at(0.3), g2 = at(0.42)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    if (o.giltLine && P.gilt) {
      P.roof.quad(g1[i], g1[j], ring[j], ring[i])
      P.gilt.quad(g2[i], g2[j], g1[j], g1[i])
      P.roof.quad(mid[i], mid[j], g2[j], g2[i])
    } else P.roof.quad(mid[i], mid[j], ring[j], ring[i])
    P.edge.quad(low[i], low[j], mid[j], mid[i])
  }
  if (o.soffit) {
    const { bx, by, zb } = o.soffit
    const inner: V3[] = []
    for (let k = 0; k < 4; k++) for (const u of us.slice(0, -1)) {
      const [x, y] = k % 2 === 0 ? [u * bx, -by] : [u * by, -bx]
      inner.push(turn(k, [x, y, zb]))
    }
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      P.soffit.quad(low[i], inner[i], inner[j], low[j])
    }
  }
  const hr = o.hipRidge ?? { w: 0.36, h: 0.32 }
  const hipEnds: V3[] = []
  for (let k = 0; k < 4; k++) {
    const line = (o.kind === 'skirt' ? [0, 0.3, 1] : o.coarse ? [0, 0.25, 1] : [0, 0.14, 0.33, 0.6, 1]).map((t) => turn(k, sides[k](1, t)))
    const a = line[0], b = line[1], d = norm(sub(a, b))
    const tip: V3 = [a[0] + d[0] * 0.1, a[1] + d[1] * 0.1, a[2] + d[2] * 0.1 + 0.05]
    bar(P.ridge, [tip, ...line], hr.w, hr.h, 0.25, true, false)
    hipEnds.push(tip)
  }
  const gx = o.gx, gy = o.gy
  if (o.kind === 'skirt') {
    const w: V3[] = [[cx - gx, cy - gy, o.zg], [cx + gx, cy - gy, o.zg], [cx + gx, cy + gy, o.zg], [cx - gx, cy + gy, o.zg]]
    for (let k = 0; k < 4; k++) bar(P.ridge, [w[k], w[(k + 1) % 4]], hr.w, hr.h, 0.1, true, false)
    return { hipEnds, ring }
  }
  const rx = o.rx ?? gx
  if (o.kind === 'paljak') {
    const TU = o.coarse ? [0, 0.5, 1] : [0, 0.3, 0.62, 1]
    const ax = (t: number) => gx + (rx - gx) * t
    const zt = (t: number) => o.zg + (zr - o.zg) * (t * (1 - sag * 0.4) + sag * 0.4 * t * t)
    const top = (u: number, t: number): [number, number, number] => [u * ax(t), -gy * (1 - t), zt(t)]
    for (const k of [0, 2]) grid(P.roof, (o.coarse ? [-1, 1] : [-1, -0.5, 0, 0.5, 1]).map((u) => TU.map((t) => turn(k, top(u, t)))))
    for (const k of [1, 3]) {
      P.gable.tri(turn(k, [-gy, -gx, o.zg]), turn(k, [gy, -gx, o.zg]), turn(k, [0, -rx, zr]))
      for (const s of [-1, 1]) bar(P.ridge, TU.map((t) => turn(k, [s * gy * (1 - t), -ax(t) - 0.05, zt(t)])), hr.w, hr.h, 0.1, true, false)
    }
  }
  const R = o.ridge ?? { h: 1.0, w: 0.9 }
  const rs = o.ridgeSag ?? 0.25
  const rl = rx + (o.kind === 'paljak' ? 0.3 : 0)
  const rpts: V3[] = (o.coarse ? [-1, -0.5, 0.5, 1] : [-1, -0.6, -0.25, 0.25, 0.6, 1]).map((s) => [cx + s * rl, cy, zr + rs * s * s])
  bar(P.ridge, rpts, R.w, R.h, 0.6, true, false)
  return { hipEnds, ring, ridgeEnds: [[cx - rl, cy, zr + rs + R.h] as V3, [cx + rl, cy, zr + rs + R.h] as V3] }
}

/** A tube along a spine with a radius (or [side, up] half-sizes) per point, `k` sides, capped. */
export function tube(p: Part, pts: V3[], r: (number | [number, number])[], k = 6, up: V3 = [0, 0, 1]) {
  const rings = pts.map((P, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]
    const t = norm(sub(b, a))
    let s = cross(t, up)
    if (Math.hypot(...s) < 1e-3) s = cross(t, [1, 0, 0])
    s = norm(s)
    const u = norm(cross(s, t))
    const [rs, ru] = typeof r[i] === 'number' ? [r[i] as number, r[i] as number] : (r[i] as [number, number])
    return Array.from({ length: k }, (_, j) => {
      const g = (j / k) * TAU
      return [P[0] + s[0] * rs * Math.cos(g) + u[0] * ru * Math.sin(g), P[1] + s[1] * rs * Math.cos(g) + u[1] * ru * Math.sin(g), P[2] + s[2] * rs * Math.cos(g) + u[2] * ru * Math.sin(g)] as V3
    })
  })
  for (let i = 0; i < rings.length - 1; i++) {
    const A = rings[i], B = rings[i + 1], cA = pts[i], cB = pts[i + 1]
    for (let j = 0; j < k; j++) {
      const j1 = (j + 1) % k
      const nrm = (q: V3, c: V3) => norm(sub(q, c))
      p.tri(A[j], A[j1], B[j1], undefined, undefined, undefined, [nrm(A[j], cA), nrm(A[j1], cA), nrm(B[j1], cB)])
      p.tri(A[j], B[j1], B[j], undefined, undefined, undefined, [nrm(A[j], cA), nrm(B[j1], cB), nrm(B[j], cB)])
    }
  }
  const capRing = (R: V3[], c: V3, out: V3) => { for (let j = 1; j < k - 1; j++) triOut(p, R[0], R[j], R[j + 1], out) }
  capRing(rings[0], pts[0], norm(sub(pts[0], pts[1])))
  capRing(rings[rings.length - 1], pts[pts.length - 1], norm(sub(pts[pts.length - 1], pts[pts.length - 2])))
}

/** A thin flat plate (both faces) through three or more points in a plane, thickness t along its normal. */
function plate(p: Part, pts: V3[], t = 0.06) {
  const n = norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])))
  const off = (q: V3, f: number): V3 => [q[0] + n[0] * f, q[1] + n[1] * f, q[2] + n[2] * f]
  for (let i = 1; i < pts.length - 1; i++) {
    triOut(p, off(pts[0], t / 2), off(pts[i], t / 2), off(pts[i + 1], t / 2), n)
    triOut(p, off(pts[0], -t / 2), off(pts[i], -t / 2), off(pts[i + 1], -t / 2), [-n[0], -n[1], -n[2]])
  }
}

/**
 * A shachihoko standing at `base` on a ridge end, `h` tall: the head down
 * on the ridge facing `out` (unit, horizontal; the head faces inward along
 * the ridge, the tail curls up and out), the body arched, the tail fin
 * spread at the top. Detail adds fins, a fuller body and the face.
 */
export function shachi(p: Part, base: V3, h: number, out: [number, number], detail: boolean) {
  const [ox, oy] = out
  // local: a along the ridge (positive = outward), z up
  const L = (a: number, z: number, s = 0): V3 => [base[0] + ox * a - oy * s, base[1] + oy * a + ox * s, base[2] + z]
  if (!detail) {
    tube(p, [L(-0.42 * h, 0.06 * h), L(-0.2 * h, 0.05 * h), L(0.02 * h, 0.3 * h), L(-0.02 * h, 0.62 * h), L(0.18 * h, 0.86 * h)],
      [[0.13 * h, 0.12 * h], 0.17 * h, 0.15 * h, 0.11 * h, 0.05 * h], 5)
    plate(p, [L(0.12 * h, 0.8 * h, -0.02), L(0.44 * h, 1.0 * h, 0), L(0.2 * h, 1.02 * h, 0.25 * h), L(0.05 * h, 0.95 * h, 0)], 0.05 * h)
    plate(p, [L(0.12 * h, 0.8 * h, 0.02), L(0.05 * h, 0.95 * h, 0), L(0.2 * h, 1.02 * h, -0.25 * h), L(0.44 * h, 1.0 * h, 0)], 0.05 * h)
    return
  }
  const spine: V3[] = [], rad: [number, number][] = []
  const S = [[-0.46, 0.08, 0.1], [-0.36, 0.05, 0.15], [-0.22, 0.06, 0.18], [-0.07, 0.16, 0.19], [0.03, 0.32, 0.17], [0.03, 0.48, 0.15], [-0.02, 0.62, 0.12], [0.04, 0.74, 0.09], [0.14, 0.84, 0.06], [0.2, 0.9, 0.035]]
  for (const [a, z, r] of S) { spine.push(L(a * h, z * h)); rad.push([r * h * 0.85, r * h]) }
  tube(p, spine, rad, 8)
  // tail fin: two lobes spreading out and up
  for (const s of [-1, 1]) {
    plate(p, [L(0.16 * h, 0.86 * h), L(0.46 * h, 1.04 * h, s * 0.06 * h), L(0.34 * h, 1.12 * h, s * 0.3 * h), L(0.12 * h, 0.98 * h, s * 0.12 * h)], 0.04 * h)
    // dorsal and pectoral fins
    plate(p, [L(-0.12 * h, 0.2 * h, s * 0.16 * h), L(-0.02 * h, 0.12 * h, s * 0.36 * h), L(-0.22 * h, 0.12 * h, s * 0.28 * h)], 0.03 * h)
    plate(p, [L(0.12 * h, 0.4 * h, s * 0.05 * h), L(0.32 * h, 0.5 * h, s * 0.12 * h), L(0.14 * h, 0.56 * h, s * 0.05 * h)], 0.03 * h)
  }
  // dorsal spines along the back (outer side of the arch)
  plate(p, [L(0.15 * h, 0.3 * h), L(0.3 * h, 0.42 * h), L(0.12 * h, 0.55 * h)], 0.03 * h)
  plate(p, [L(0.1 * h, 0.6 * h), L(0.25 * h, 0.68 * h), L(0.16 * h, 0.78 * h)], 0.03 * h)
  // head: the snout with its open jaw and the whiskers forward
  tube(p, [L(-0.48 * h, 0.1 * h), L(-0.62 * h, 0.13 * h)], [[0.08 * h, 0.07 * h], [0.03 * h, 0.03 * h]], 6)
  for (const s of [-1, 1]) tube(p, [L(-0.4 * h, 0.18 * h, s * 0.08 * h), L(-0.55 * h, 0.3 * h, s * 0.16 * h)], [0.025 * h, 0.012 * h], 4)
}

/** A point on a wall face of a box of half-sizes hx, hy at (cx, cy): face 's' 'n' 'e' 'w', `t` along it (left to right seen from outside), `o` out. */
export function onFace(face: 's' | 'n' | 'e' | 'w', hx: number, hy: number, t: number, z: number, o = 0, cx = 0, cy = 0): V3 {
  if (face === 's') return [cx + t, cy - hy - o, z]
  if (face === 'n') return [cx - t, cy + hy + o, z]
  if (face === 'e') return [cx + hx + o, cy + t, z]
  return [cx - hx - o, cy - t, z]
}
const faceOut = { s: [0, -1, 0], n: [0, 1, 0], e: [1, 0, 0], w: [-1, 0, 0] } as Record<string, V3>
const faceAlong = { s: [1, 0, 0], n: [-1, 0, 0], e: [0, 1, 0], w: [0, -1, 0] } as Record<string, V3>

/** A flat panel on a wall face, from t0 to t1 along it and z0 to z1, `o` out from the wall. */
export function panelOn(p: Part, face: 's' | 'n' | 'e' | 'w', hx: number, hy: number, t0: number, t1: number, z0: number, z1: number, o = 0.04, cx = 0, cy = 0) {
  quadOut(p, onFace(face, hx, hy, t0, z0, o, cx, cy), onFace(face, hx, hy, t1, z0, o, cx, cy), onFace(face, hx, hy, t1, z1, o, cx, cy), onFace(face, hx, hy, t0, z1, o, cx, cy), faceOut[face])
}

/** A slab of thickness `d` standing out from a wall face (a band, a box on the wall). */
export function boxOn(p: Part, face: 's' | 'n' | 'e' | 'w', hx: number, hy: number, t0: number, t1: number, z0: number, z1: number, d: number, cx = 0, cy = 0, skip = '') {
  const A = onFace(face, hx, hy, t0, z0, 0, cx, cy), B = onFace(face, hx, hy, t1, z0, d, cx, cy)
  box(p, Math.min(A[0], B[0]), Math.min(A[1], B[1]), z0, Math.max(A[0], B[0]), Math.max(A[1], B[1]), z1, skip)
}

/**
 * A stone wall lofted from `ring(t)` (t 0 at the foot, 1 at the top, z
 * from 0 to h) in `n` courses, each course's foot standing `step` proud of
 * its own top, so the face reads as coursed stone. The rings
 * are counter-clockwise from above. Capped at the top.
 */
export function coursed(p: Part, ring: (t: number) => V3[], n: number, step = 0.07) {
  const rings: V3[][] = []
  const at = (t: number, d: number) => {
    const r = ring(t), cx = r.reduce((a, q) => a + q[0], 0) / r.length, cy = r.reduce((a, q) => a + q[1], 0) / r.length
    return r.map(([x, y, z]) => { const dx = x - cx, dy = y - cy; return [x + Math.sign(dx) * d, y + Math.sign(dy) * d, z] as V3 })
  }
  // each course leans back from a proud foot, so the joints are small overhangs (no ledges to collect terrain)
  for (let k = 0; k <= n; k++) {
    const t = k / n
    if (k > 0) rings.push(at(t, 0))
    if (k < n) rings.push(at(t, step))
  }
  p.loft(rings)
  p.cap(ring(1), true)
}

export type HafuParts = { tile: Part; ridge: Part; plaster: Part; dark: Part; gold: Part; win: Part }
export type Hafu = {
  /** Half-width at the eave ends, foot (top of the roof below at the face) and apex heights, depth back, overhang forward. */
  w: number; zb: number; za: number; D: number; o?: number
  th?: number; sag?: number; lift?: number
  /** A row of windows in the gable face: width, bottom, top. */
  win?: { w: number; z0: number; z1: number }
  /** Ornament at the apex: a gilt shachi of this height, or a spike. */
  finial?: { kind: 'shachi' | 'spike'; h: number }
  /** Gold crest under the apex and gold scroll plates at the feet (size factor). */
  gilt?: number
  /** Dark band at the foot of the face (height). */
  band?: number
  detail: boolean
  /** Lattice ribs on the face (detail). */
  lattice?: number
}

/**
 * A chidori-hafu: a gable standing on a roof slope, its triangular face in
 * the plane y = 0 facing -y, centred on x = 0, its two roof slopes running
 * back to y = D. Draw it into a `placed` set of parts to stand it on any face.
 */
export function hafu(P: HafuParts, g: Hafu) {
  const o = g.o ?? 0.8, th = g.th ?? 0.45, sag = g.sag ?? 0.17, lift = g.lift ?? 0.25
  const W = g.w, zR = g.za + 0.3, zE = g.zb - 0.15
  const F = g.detail ? [0, 0.12, 0.25, 0.4, 0.55, 0.7, 0.82, 0.92, 1] : [0, 0.4, 0.8, 1]
  const Y = [-o, g.D]
  const zt = (f: number) => zR - (zR - zE) * f - sag * (zR - zE) * f * (1 - f) + lift * Math.pow(f, 4)
  for (const s of [-1, 1]) {
    const top = F.map((f) => Y.map((y) => [s * f * W, y, zt(f)] as V3))
    const bot = F.map((f) => Y.map((y) => [s * f * W, y, zt(f) - th] as V3))
    grid(P.tile, top, s < 0)
    grid(P.plaster, bot, s > 0)
    // the white barge board under the tile edge, and the eave end
    for (let i = 0; i < F.length - 1; i++) {
      const a = top[i][0], b = top[i + 1][0]
      quadOut(P.plaster, [b[0], b[1], b[2] - th - 0.35], [a[0], a[1], a[2] - th - 0.35], a, b, [0, -1, 0])
      quadOut(P.plaster, [b[0], b[1] + 0.25, b[2] - th - 0.35], [a[0], a[1] + 0.25, a[2] - th - 0.35], [a[0], a[1], a[2] - th - 0.35], [b[0], b[1], b[2] - th - 0.35], [0, 0, -1])
    }
    const e0 = top[F.length - 1][0], e1 = top[F.length - 1][1]
    quadOut(P.plaster, [e0[0], e0[1], e0[2] - th], [e1[0], e1[1], e1[2] - th], e1, e0, [s, 0, 0])
  }
  bar(P.ridge, [[0, -o - 0.15, zR], [0, g.D, zR]], 0.5, 0.42, 0.15, true, false)
  // the face, following the underside of the slopes down to the foot
  const zu = (f: number) => zt(f) - th - 0.35
  const fc = (() => { // where the underside meets the foot
    for (let i = 0; i < 40; i++) { const f = i / 40, f1 = (i + 1) / 40; if (zu(f1) <= g.zb) return f + (f1 - f) * (zu(f) - g.zb) / (zu(f) - zu(f1)) }
    return 1
  })()
  const Fs = F.filter((f) => f < fc - 1e-3)
  const edge = [...Fs.map((f) => [f * W, zu(f)] as [number, number]), [fc * W, g.zb] as [number, number]]
  const ring: [number, number][] = [...edge.slice().reverse().map(([x, z]) => [-x, z] as [number, number]), ...edge.slice(1)]
  for (let i = 0; i < ring.length - 1; i++) triOut(P.plaster, [0, 0, g.zb], [ring[i][0], 0, ring[i][1]], [ring[i + 1][0], 0, ring[i + 1][1]], [0, -1, 0])
  // the wedge's sides under the slopes, closing the gable behind its face
  for (const s of [-1, 1]) for (let i = 0; i < edge.length - 1; i++) {
    const a: V3 = [s * edge[i][0], 0, edge[i][1]], b: V3 = [s * edge[i + 1][0], 0, edge[i + 1][1]]
    quadOut(P.plaster, a, b, [b[0], g.D, b[2]], [a[0], g.D, a[2]], [s, 0, 0.5])
  }
  // half-width of the face at height z
  const xAt = (z: number) => {
    if (z <= g.zb) return fc * W
    for (let i = 0; i < edge.length - 1; i++) if (edge[i][1] >= z && edge[i + 1][1] <= z) return edge[i][0] + (edge[i + 1][0] - edge[i][0]) * (edge[i][1] - z) / (edge[i][1] - edge[i + 1][1])
    return 0
  }
  const bh = g.band ?? 0.55
  if (bh > 0) {
    const z1 = g.zb + bh, x0 = xAt(g.zb) - 0.05, x1 = xAt(z1) - 0.05
    quadOut(P.dark, [-x0, -0.03, g.zb], [x0, -0.03, g.zb], [x1, -0.03, z1], [-x1, -0.03, z1], [0, -1, 0])
  }
  if (g.win) {
    const n = Math.max(1, Math.round(g.win.w / 1.4))
    const lw = g.win.w / n
    if (g.detail) for (let i = 0; i < n; i++) {
      const x0 = -g.win.w / 2 + i * lw + 0.1, x1 = x0 + lw - 0.2
      quadOut(P.win, [x0, -0.05, g.win.z0], [x1, -0.05, g.win.z0], [x1, -0.05, g.win.z1], [x0, -0.05, g.win.z1], [0, -1, 0])
      for (let b = 1; b < 4; b++) { const xb = x0 + ((x1 - x0) * b) / 4; rbox(P.plaster, xb, -0.08, 0.035, 0.035, g.win.z0, g.win.z1, 0, 'b') }
    }
    else quadOut(P.win, [-g.win.w / 2, -0.05, g.win.z0], [g.win.w / 2, -0.05, g.win.z0], [g.win.w / 2, -0.05, g.win.z1], [-g.win.w / 2, -0.05, g.win.z1], [0, -1, 0])
  }
  if (g.detail && g.lattice) {
    const st = g.lattice, z0 = g.zb + bh + 0.1
    const inWin = (x: number, z: number) => g.win && Math.abs(x) < g.win.w / 2 + 0.15 && z > g.win.z0 - 0.15 && z < g.win.z1 + 0.15
    for (let z = z0 + st / 2; z < zu(0) - 0.4; z += st) {
      const x = xAt(z) - 0.15
      if (x < 0.3) continue
      if (g.win && z > g.win.z0 - 0.15 && z < g.win.z1 + 0.15) {
        for (const s of [-1, 1]) if (x > g.win.w / 2 + 0.3) rbox(P.plaster, s * (x + g.win.w / 2 + 0.15) / 2, -0.05, (x - g.win.w / 2 - 0.15) / 2, 0.05, z - 0.04, z + 0.04, 0, 'n')
      } else rbox(P.plaster, 0, -0.05, x, 0.05, z - 0.04, z + 0.04, 0, 'n')
    }
    for (let x = 0; x < xAt(z0) - 0.3; x += st) for (const s of x === 0 ? [1] : [-1, 1]) {
      const xx = s * x, zt1 = Math.min(zu(Math.abs(xx) / W) - 0.15, zu(0) - 0.3)
      if (zt1 - z0 < 0.3) continue
      if (inWin(xx, (g.win?.z0 ?? 0) + 0.01)) {
        rbox(P.plaster, xx, -0.05, 0.04, 0.05, z0, g.win!.z0 - 0.15, 0, 'n')
        if (zt1 > g.win!.z1 + 0.3) rbox(P.plaster, xx, -0.05, 0.04, 0.05, g.win!.z1 + 0.15, zt1, 0, 'n')
      } else rbox(P.plaster, xx, -0.05, 0.04, 0.05, z0, zt1, 0, 'n')
    }
  }
  const k = g.gilt ?? 0
  if (k > 0) {
    // the crest (kegyo) hanging under the apex
    const za = zu(0) - 0.05
    const cr: V3[] = [[0, -0.07, za], [0.75 * k, -0.07, za - 0.45 * k], [0.55 * k, -0.07, za - 1.0 * k], [0, -0.07, za - 1.5 * k], [-0.55 * k, -0.07, za - 1.0 * k], [-0.75 * k, -0.07, za - 0.45 * k]]
    for (let i = 1; i < cr.length - 1; i++) triOut(P.gold, cr[0], cr[i], cr[i + 1], [0, -1, 0])
    if (g.detail) rbox(P.gold, 0, -0.14, 0.25 * k, 0.08, za - 1.0 * k, za - 0.5 * k, 0, 'n')
    // scroll plates at the feet, along the rake
    const zf = g.zb + bh + 0.02
    for (const s of [-1, 1]) {
      const xa = xAt(zf) - 0.1, zb2 = zf + 1.1 * k, xb = xAt(zb2) - 0.1
      triOut(P.gold, [s * xa, -0.07, zf], [s * (xa - 2.6 * k), -0.07, zf], [s * xb, -0.07, zb2], [0, -1, 0])
    }
    if (g.detail) {
      // gold studs (kugikakushi) along the barge boards
      const nS = Math.max(3, Math.round(W / 1.6))
      for (const s of [-1, 1]) for (let i = 1; i < nS; i++) {
        const f = (i / nS) * 0.9, x = s * f * W, z = zt(f) - th - 0.18
        rbox(P.gold, x, -o - 0.04, 0.16, 0.04, z - 0.14, z + 0.14, 0, 'n')
      }
    }
  }
  if (g.finial) {
    const f = g.finial
    if (f.kind === 'shachi') shachi(P.gold, [0, -o + 0.35, zR + 0.3], f.h, [0, -1], g.detail)
    else {
      const b: V3 = [0, -o + 0.3, zR + 0.3]
      tube(P.gold, [b, [b[0], b[1], b[2] + f.h * 0.35], [b[0], b[1], b[2] + f.h]], [0.22 * f.h, 0.16 * f.h, 0.02], 4)
    }
  }
}

/** A gilt tiger in relief, walking, on a wall face: centre t along the face, z its feet, length len, facing +t (dir 1) or -t. */
function tiger(p: Part, face: 's' | 'n' | 'e' | 'w', hx: number, hy: number, t: number, z: number, len: number, dir: number, detail: boolean) {
  const lo: XY[] = [[0, 0.3], [0.04, 0.4], [0.12, 0.46], [0.22, 0.38], [0.5, 0.36], [0.8, 0.38], [0.97, 0.52], [1, 0.45], [0.88, 0.3], [0.88, 0], [0.76, 0], [0.74, 0.16], [0.36, 0.16], [0.3, 0], [0.18, 0], [0.16, 0.2]]
  const hi: XY[] = [[0, 0.3], [0.02, 0.37], [0.07, 0.43], [0.1, 0.5], [0.14, 0.44], [0.22, 0.4], [0.34, 0.38], [0.5, 0.36], [0.66, 0.38], [0.8, 0.39], [0.88, 0.42], [0.94, 0.52], [0.99, 0.56], [1, 0.5], [0.95, 0.46], [0.89, 0.33],
    [0.9, 0.16], [0.94, 0.02], [0.84, 0], [0.8, 0.15], [0.74, 0.18], [0.62, 0.16], [0.44, 0.16], [0.36, 0.14], [0.32, 0.02], [0.22, 0], [0.24, 0.14], [0.16, 0.2], [0.1, 0.22], [0.04, 0.24]]
  const shape = detail ? hi : lo
  const ring: XY[] = shape.map(([x, y]) => [(x - 0.5) * dir, y])
  const r = ring.slice()
  // counter-clockwise in (along, up)
  const area = r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
  if (area < 0) r.reverse()
  const d = 0.14
  const P3 = (q: XY, o: number) => onFace(face, hx, hy, t + q[0] * len, z + q[1] * len, o)
  const out = faceOut[face]
  for (const [a, b, c] of triangulate(r)) triOut(p, P3(r[a], d), P3(r[b], d), P3(r[c], d), out)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    const A = P3(r[i], 0), B = P3(r[j], 0), C = P3(r[j], d), D2 = P3(r[i], d)
    const along = faceAlong[face]
    const e = [r[j][0] - r[i][0], r[j][1] - r[i][1]]
    // outward in the plane: (e.y, -e.x) for a CCW ring
    const nw: V3 = [along[0] * e[1], along[1] * e[1], -e[0]]
    quadOut(p, A, B, C, D2, nw)
  }
}

// ===========================================================================
// Osaka Castle main tower

type Sz = { detail: boolean }
const B = 13.3 // the tenshudai's published height

function build(S: Sz) {
  const plaster = new Part(), tile = new Part(), stone = new Part(), gold = new Part(), dark = new Part(), win = new Part()
  const RP: RoofParts = { roof: tile, ridge: tile, gable: plaster, soffit: plaster, edge: plaster, gilt: gold }
  const HP: HafuParts = { tile, ridge: tile, plaster, dark, gold, win }
  const D = S.detail
  const coarse: boolean | 2 = D ? false : 2

  // ---- The tenshudai (ishigaki) -------------------------------------------
  // the face curves out at the foot (ōgi-no-kōbai); the detail model steps in at each course
  const top = { hx: 16.9, hy: 19.15 }, bat = 1.7, flare = (t: number) => bat * Math.pow(1 - t, 2.4)
  const rect = (hx: number, hy: number, z: number): V3[] => [[-hx, -hy, z], [hx, -hy, z], [hx, hy, z], [-hx, hy, z]]
  if (D) {
    const n = 11, rings: V3[][] = []
    for (let k = 0; k <= n; k++) {
      const t = k / n, d = flare(t)
      if (k > 0) rings.push(rect(top.hx + d + 0.08, top.hy + d + 0.08, B * t))
      rings.push(rect(top.hx + d, top.hy + d, B * t))
    }
    stone.loft(rings)
  } else stone.loft([0, 0.25, 0.55, 1].map((t) => rect(top.hx + flare(t), top.hy + flare(t), B * t)))
  stone.cap(rect(top.hx, top.hy, B), true)
  if (D) {
    // corner stones (sangi-zumi): long and short blocks alternating up each corner
    const n = 12
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) for (let i = 0; i < n; i++) {
      const t0 = i / n, t1 = (i + 1) / n, z0 = B * t0 + 0.04, z1 = B * t1 - 0.04
      const dd = flare((t0 + t1) / 2) + 0.1
      const lx = i % 2 ? 1.0 : 2.0, ly = i % 2 ? 2.0 : 1.0
      const X = sx * (top.hx + dd), Y = sy * (top.hy + dd)
      box(stone, Math.min(X, X - sx * lx), Math.min(Y, Y - sy * 0.35), z0, Math.max(X, X - sx * lx), Math.max(Y, Y - sy * 0.35), z1, 'b')
      box(stone, Math.min(X, X - sx * 0.35), Math.min(Y, Y - sy * ly), z0, Math.max(X, X - sx * 0.35), Math.max(Y, Y - sy * ly), z1, 'b')
    }
  }

  // ---- Storeys --------------------------------------------------------------
  type St = { hx: number; hy: number; z0: number; z1: number }
  const S1: St = { hx: 16.4, hy: 18.65, z0: B, z1: B + 5.2 }
  const S2: St = { hx: 13.7, hy: 15.65, z0: B + 7.0, z1: B + 12.2 }
  const S3: St = { hx: 11.1, hy: 10.7, z0: B + 14.6, z1: B + 18.9 }
  const S4: St = { hx: 8.8, hy: 8.8, z0: B + 20.2, z1: B + 23.0 }
  const S5: St = { hx: 7.4, hy: 7.4, z0: B + 24.6, z1: B + 28.0 }
  for (const s of [S1, S2, S3, S4]) box(plaster, -s.hx, -s.hy, s.z0, s.hx, s.hy, s.z1, 'bt')
  box(dark, -S5.hx, -S5.hy, S5.z0, S5.hx, S5.hy, S5.z1, 'bt')
  // the lookout gallery (with its railing and net) and the balcony floor
  // the gallery: the balcony floor at the eave line, its railing, the glazing set back behind it
  const LK = 7.75, GW = LK - 0.6
  box(dark, -LK - 0.2, -LK - 0.2, B + 27.8, LK + 0.2, LK + 0.2, B + 28.1, '')
  box(win, -GW, -GW, B + 28.1, GW, GW, B + 31.7, 'bt')
  if (!D) for (const [x0, y0, x1, y1] of [[-LK, -LK, LK, -LK + 0.12], [-LK, LK - 0.12, LK, LK], [-LK, -LK, -LK + 0.12, LK], [LK - 0.12, -LK, LK, LK]]) box(dark, x0, y0, B + 28.1, x1, y1, B + 29.1, 'b')

  const faces = ['s', 'e', 'n', 'w'] as const
  const len = (f: string, s: { hx: number; hy: number }) => (f === 's' || f === 'n' ? s.hx : s.hy)
  // black bands where the roofs meet the walls above them
  for (const [s, z] of [[S2, B + 8.0], [S3, B + 15.6], [S4, B + 21.0]] as [St, number][]) for (const f of faces) {
    const L = len(f, s)
    panelOn(dark, f, s.hx, s.hy, -L, L, z, z + 0.45, 0.03)
  }

  // windows: pairs of lights, as one panel per pair (detail: per light with grilles)
  const win2 = (f: 's' | 'n' | 'e' | 'w', s: St, t: number, w: number, z0: number, z1: number) => {
    if (!D) return panelOn(win, f, s.hx, s.hy, t - w / 2, t + w / 2, z0, z1)
    const lw = (w - 0.3) / 2
    for (const q of [-1, 1]) {
      const c = t + q * (lw / 2 + 0.15)
      panelOn(win, f, s.hx, s.hy, c - lw / 2, c + lw / 2, z0, z1)
      for (let b = 1; b < 4; b++) {
        const tb = c - lw / 2 + (lw * b) / 4
        const p0 = onFace(f, s.hx, s.hy, tb, z0, 0.09)
        rbox(plaster, p0[0], p0[1], 0.035, 0.035, z0, z1, 0, 'b')
      }
    }
  }
  for (const f of faces) {
    const L = len(f, S1)
    const ts = L > 17 ? [-12.4, -8.2, -4.1, 0, 4.1, 8.2, 12.4] : [-10.6, -6.4, -2.1, 2.1, 6.4, 10.6]
    for (const t of ts) win2(f, S1, t, 2.4, B + 2.6, B + 4.3)
    if (D) for (const t of ts) panelOn(win, f, S1.hx, S1.hy, t - 0.3, t + 0.3, B + 0.9, B + 1.5)
    // ishi-otoshi: the projecting bays at the corners, their undersides sloped
    for (const e of [-1, 1]) {
      const t0 = e < 0 ? -L : L - 3.6, t1 = e < 0 ? -L + 3.6 : L
      const prof: [number, number][] = [[0, B + 2.0], [0.8, B + 2.9], [0.8, B + 5.2], [0, B + 5.2]]
      const Q = (t: number, [o, z]: [number, number]) => onFace(f, S1.hx, S1.hy, t, z, o)
      for (let i = 0; i < prof.length; i++) {
        const a = prof[i], b = prof[(i + 1) % prof.length]
        const nrm: V3 = (() => { const dz = b[1] - a[1], doo = b[0] - a[0]; const o3 = faceOut[f]; return [o3[0] * dz, o3[1] * dz, -doo] as V3 })()
        if (i === 3) continue
        quadOut(plaster, Q(t0, a), Q(t1, a), Q(t1, b), Q(t0, b), nrm)
      }
      for (const [t, sgn] of [[t0, -1], [t1, 1]] as [number, number][]) {
        const al = faceAlong[f]
        const pts = prof.map((q) => Q(t, q))
        triOut(plaster, pts[0], pts[1], pts[2], [al[0] * sgn, al[1] * sgn, 0]); triOut(plaster, pts[0], pts[2], pts[3], [al[0] * sgn, al[1] * sgn, 0])
      }
    }
  }
  // second storey: beside the big gables (S/N), and on E/W
  for (const f of ['s', 'n'] as const) for (const t of [-11.4, 11.4]) win2(f, S2, t, 2.2, B + 10.2, B + 11.8)
  for (const f of ['e', 'w'] as const) for (const t of [-13.4, -3.6, 3.6, 13.4]) win2(f, S2, t, 2.2, B + 10.2, B + 11.8)
  // third storey: four pairs on S/N, either side of the gable on E/W
  for (const f of ['s', 'n'] as const) for (const t of [-7.9, -2.65, 2.65, 7.9]) win2(f, S3, t, 2.4, B + 16.2, B + 17.7)
  for (const f of ['e', 'w'] as const) for (const t of [-7.6, 7.6]) win2(f, S3, t, 2.2, B + 16.2, B + 17.7)
  // fourth storey: E/W only (the third roof's gables hide it on S/N)
  for (const f of ['e', 'w'] as const) for (const t of [-6.4, -2.6, 2.6, 6.4]) win2(f, S4, t, 1.9, B + 21.5, B + 22.6)

  // the tigers on the black storey, and its gold fittings
  for (const f of faces) {
    const tt = f === 's' || f === 'n' ? 4.8 : 5.6, ln = f === 's' || f === 'n' ? 2.8 : 2.3
    tiger(gold, f, S5.hx, S5.hy, -tt, B + 25.9, ln, -1, D)
    tiger(gold, f, S5.hx, S5.hy, tt, B + 25.9, ln, 1, D)
    if (D) {
      const L = len(f, S5)
      for (const z of [B + 25.4, B + 27.6]) boxOn(gold, f, S5.hx, S5.hy, -L, L, z - 0.06, z + 0.06, 0.06)
      for (let t = -L + 0.6; t <= L - 0.5; t += 1.5) for (const z of [B + 25.4, B + 27.6]) boxOn(gold, f, S5.hx, S5.hy, t - 0.22, t + 0.22, z - 0.2, z + 0.2, 0.1)
      // the railing at the balcony's edge: posts, a top rail and a mid rail, gold caps on the posts
      for (let t = -LK + 0.06; t <= LK; t += 1.1) {
        const p0 = onFace(f, LK - 0.06, LK - 0.06, t, 0, 0)
        rbox(dark, p0[0], p0[1], 0.07, 0.07, B + 28.1, B + 29.1, 0, 'b')
        rbox(gold, p0[0], p0[1], 0.1, 0.1, B + 29.1, B + 29.25, 0, 'b')
      }
      for (const z of [B + 28.45, B + 28.98]) boxOn(dark, f, LK - 0.12, LK - 0.12, -LK + 0.12, LK - 0.12, z, z + 0.1, 0.1)
      // the glazing's frame
      for (let t = -GW + 0.9; t < GW - 0.5; t += 1.8) boxOn(gold, f, GW, GW, t - 0.05, t + 0.05, B + 28.1, B + 31.7, 0.04)
      boxOn(dark, f, GW, GW, -GW, GW, B + 29.6, B + 29.72, 0.04)
    }
  }

  // ---- Roofs ----------------------------------------------------------------
  const rk = { coarse, giltLine: D }
  // first roof: a skirt from the eave to the second storey
  croof(RP, { ...rk, kind: 'skirt', ex: 18.8, ey: 21.05, ze: B + 5.8, gx: S2.hx, gy: S2.hy, zg: B + 8.0, lift: 1.1, flare: 0.75, sag: 0.3, th: 0.7, pow: 2.4,
    soffit: { bx: S1.hx, by: S1.hy, zb: S1.z1 }, hipRidge: { w: 0.4, h: 0.35 } })
  croof(RP, { ...rk, kind: 'skirt', ex: 16.3, ey: 18.25, ze: B + 12.6, gx: S3.hx, gy: S3.hy, zg: B + 15.6, lift: 1.0, flare: 0.7, sag: 0.3, th: 0.65, pow: 2.4,
    soffit: { bx: S2.hx, by: S2.hy, zb: S2.z1 }, hipRidge: { w: 0.4, h: 0.35 } })
  croof(RP, { ...rk, kind: 'skirt', ex: 13.3, ey: 12.9, ze: B + 19.5, gx: S4.hx, gy: S4.hy, zg: B + 21.0, lift: 0.9, flare: 0.6, sag: 0.3, th: 0.6, pow: 2.4,
    soffit: { bx: S3.hx, by: S3.hy, zb: S3.z1 }, hipRidge: { w: 0.38, h: 0.32 } })
  croof(RP, { ...rk, kind: 'skirt', ex: 10.3, ey: 10.3, ze: B + 24.3, gx: S5.hx, gy: S5.hy, zg: B + 25.4, lift: 0.8, flare: 0.55, sag: 0.3, th: 0.55, pow: 2.4,
    soffit: { bx: S4.hx, by: S4.hy, zb: S4.z1 }, hipRidge: { w: 0.36, h: 0.3 } })
  // the top roof: hip-and-gable, its gables to the south and north (built
  // with its gables on ±x and turned a quarter), the karahafu on the east
  // and west eaves (the built frame's south and north sides)
  const Q = placed({ tile, plaster, gold }, Math.PI / 2, 0, 0)
  const top5 = croof({ roof: Q.tile, ridge: Q.tile, gable: Q.plaster, soffit: Q.plaster, edge: Q.plaster, gilt: Q.gold }, {
    ...rk, kind: 'paljak', ex: 8.8, ey: 8.8, ze: B + 32.3, gx: 6.4, gy: 4.9, zg: B + 33.0, zr: B + 36.8, rx: 6.1,
    lift: 0.75, flare: 0.5, sag: 0.4, th: 0.55, pow: 2.2, soffit: { bx: GW, by: GW, zb: B + 31.7 },
    ridge: { h: 0.55, w: 0.6 }, ridgeSag: 0.12, hipRidge: { w: 0.34, h: 0.3 },
    kara: { sides: [0, 2], a: 0.36, h: 1.0 },
  })
  // the top gables' dark foot band, windows and gold crest (on y = ±6.4 in the world frame)
  for (const s of [-1, 1]) {
    const G = placed({ tile, ridge: tile, plaster, dark, gold, win }, s < 0 ? 0 : Math.PI, 0, s * 6.45)
    quadOut(G.dark, [-4.6, -0.03, B + 33.0], [4.6, -0.03, B + 33.0], [4.1, -0.03, B + 33.5], [-4.1, -0.03, B + 33.5], [0, -1, 0])
    quadOut(G.win, [-0.9, -0.05, B + 34.2], [0.9, -0.05, B + 34.2], [0.9, -0.05, B + 34.9], [-0.9, -0.05, B + 34.9], [0, -1, 0])
    const za = B + 36.5, k = 0.8
    const cr: V3[] = [[0, -0.07, za], [0.75 * k, -0.07, za - 0.45 * k], [0.55 * k, -0.07, za - 1.0 * k], [0, -0.07, za - 1.5 * k], [-0.55 * k, -0.07, za - 1.0 * k], [-0.75 * k, -0.07, za - 0.45 * k]]
    for (let i = 1; i < cr.length - 1; i++) triOut(G.gold, cr[0], cr[i], cr[i + 1], [0, -1, 0])
    for (const q of [-1, 1]) triOut(G.gold, [q * 4.3, -0.07, B + 33.52], [q * 2.9, -0.07, B + 33.52], [q * 3.9, -0.07, B + 34.2], [0, -1, 0])
  }
  // the shachihoko on the ridge ends (built frame ±x is world ±y)
  for (const e of top5.ridgeEnds ?? []) {
    const wy = e[0], wz = e[2] - 0.15 // turned: world (−y_b, x_b)
    shachi(gold, [0, wy, wz], 2.45, [0, Math.sign(wy)], D)
  }

  // ---- Gables (chidori-hafu) ----------------------------------------------
  const lat = D ? 1.1 : 0
  const stand = (rot: number, x: number, y: number, g: Omit<Hafu, 'detail'>) => hafu(placed(HP, rot, x, y) as HafuParts, { ...g, detail: D })
  const toS = 0, toN = Math.PI, toE = Math.PI / 2, toW = -Math.PI / 2
  // first roof: the great gable on the south and north
  for (const [rot, y] of [[toS, -S1.hy], [toN, S1.hy]] as [number, number][])
    stand(rot, 0, y, { w: 17.0, zb: B + 6.8, za: B + 16.3, D: 8.0, o: 1.0, th: 0.6, win: { w: 8.2, z0: B + 9.0, z1: B + 10.2 }, finial: { kind: 'shachi', h: 1.9 }, gilt: 1.3, band: 0.6, lattice: lat })
  // first roof: two small gables on the east and west
  for (const [rot, x] of [[toE, S1.hx], [toW, -S1.hx]] as [number, number][]) for (const t of [-9.5, 9.5])
    stand(rot, x, t, { w: 5.0, zb: B + 6.8, za: B + 11.8, D: 3.6, o: 0.6, th: 0.45, win: { w: 1.6, z0: B + 8.0, z1: B + 8.8 }, finial: { kind: 'spike', h: 0.9 }, gilt: 0.55, band: 0.45, lattice: lat })
  // second roof: one gable on the east and west
  for (const [rot, x] of [[toE, S2.hx], [toW, -S2.hx]] as [number, number][])
    stand(rot, x, 0, { w: 7.5, zb: B + 14.0, za: B + 20.2, D: 3.8, o: 0.7, th: 0.5, win: { w: 4.0, z0: B + 15.8, z1: B + 16.8 }, finial: { kind: 'shachi', h: 1.3 }, gilt: 0.8, band: 0.5, lattice: lat })
  // third roof: the second great gable on the south and north
  for (const [rot, y] of [[toS, -S3.hy], [toN, S3.hy]] as [number, number][])
    stand(rot, 0, y, { w: 11.4, zb: B + 20.2, za: B + 26.8, D: 4.2, o: 0.8, th: 0.5, win: { w: 4.6, z0: B + 22.6, z1: B + 23.7 }, finial: { kind: 'shachi', h: 1.7 }, gilt: 1.0, band: 0.5, lattice: lat })
  // fourth roof: a small gable on the east and west, in front of the black storey
  for (const [rot, x] of [[toE, S4.hx], [toW, -S4.hx]] as [number, number][])
    stand(rot, x, 0, { w: 4.25, zb: B + 24.9, za: B + 28.5, D: 2.6, o: 0.5, th: 0.4, finial: { kind: 'spike', h: 0.8 }, gilt: 0.5, band: 0.4, lattice: lat })

  // ---- Detail: rafter ends and gold hip-end tiles ---------------------------
  if (D) {
    const eaves: [St, number, number, number][] = [[S1, 18.8, 21.05, B + 5.8 - 0.7], [S2, 16.3, 18.25, B + 12.6 - 0.65], [S3, 13.3, 12.9, B + 19.5 - 0.6], [S4, 10.3, 10.3, B + 24.3 - 0.55]]
    for (const [s, ex, ey, z] of eaves) {
      const zz = z - 0.12
      for (const f of faces) {
        const L = len(f, s) * 0.85, o = (f === 's' || f === 'n' ? ey - s.hy : ex - s.hx) - 0.25
        const a = onFace(f, s.hx, s.hy, -L, zz, 0), b = onFace(f, s.hx, s.hy, L, zz, 0)
        rafterEnds(plaster, a, b, 0.8, 0.18, 0.22, o, faceOut[f])
      }
    }
  }
  const lit = (p: V3, n: V3) => (p[2] < B - 0.1 ? 0 : n[2] > 0.6 ? 0.35 : 0.95)
  const parts: Mat[] = [
    { part: plaster, material: { ...finish('white-plaster', 0xf1efe9), floodlight: lit } },
    { part: tile, material: { ...finish('copper-tile', 0x8ab3a3), floodlight: () => 0.12 } },
    { part: stone, material: { ...finish('ishigaki', 0x726e69), floodlight: (p) => (p[2] > B - 1 ? 0.06 : 0) } },
    { part: gold, material: { ...finish('gold-leaf', 0xd4aa4a), floodlight: () => 0.85 } },
    { part: dark, material: finish('charcoal', 0x4a4f57) },
    { part: win, material: PALETTE.window },
  ]
  return parts
}

if (import.meta.main) {
  const extras = { bearing: 5, elevation: 0, height: B + 39.4, osm: 'way/34619038' }
  await save('Osaka Castle main tower', build({ detail: false }), 'osaka-castle.glb', 6500, 250_000, extras)
  await save('Osaka Castle main tower', build({ detail: true }), 'osaka-castle.detail.glb', 40_000, 1536 * 1024, extras)
}
