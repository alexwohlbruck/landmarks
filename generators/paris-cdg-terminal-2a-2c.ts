/**
 * Paris-Charles de Gaulle Airport, Terminals 2A, 2B, 2C and 2D (Paul Andreu
 * for Aéroport de Paris; 2B 1982, 2A 1982, 2D 1989, 2C 1993): the two pairs
 * of curved halls facing each other across the roads in an S, each roofed
 * by a row of concrete-framed barrel vaults running across the hall, with
 * the round Satellite A, and the 2012 (A–C) and 2017 (B–D) junction
 * buildings — procedural, CC0-1.0, no textures.
 * bun generators/paris-cdg-terminal-2a-2c.ts
 *
 * Writes two models, one per freestanding building, each as a low GLB and a
 * `.detail.glb` (the detail level adds finer vaults, the vault frames,
 * mullions and glazed jet bridges):
 * - paris-cdg-terminal-2a-2c ("Paris-CDG Terminals 2A and 2C"): halls 2A
 *   and 2C, joined by Liaison AC and the landside building between them,
 *   with Satellite A and its link to 2A. Anchor: the area centroid of those
 *   outlines together (2.5642842, 49.0027773).
 * - paris-cdg-terminal-2b-2d ("Paris-CDG Terminals 2B and 2D"): halls 2B
 *   and 2D, joined by the 2017 junction and the landside building between
 *   them. Anchor: the area centroid of those outlines together (2.5644419,
 *   49.0044996).
 * The two stand about 60 m apart across the roads.
 *
 * Map frame: x = east, y = north, z up, metres. Bearing 0. The OSM data
 * below are in the old joint model's frame (anchor 2.564362, 49.0036252);
 * each building is built there and moved to its own anchor. y = 0 is the
 * lowest ground under each building, the road trench on its landside; the
 * apron is G higher (7.2 m for 2B–2D, 6.2 m for 2A–2C, whose trench is 1 m
 * higher; see `G_OF`).
 *
 * Identifying features (photos): four long halls, each a curved band, the
 * pairs facing each other across the roads; on each a row of grey barrel
 * vaults spanning across the hall (axis from the landside to the airside),
 * their ends glazed in concrete frames, one vault per structural bay;
 * glass walls under a concrete fascia; jet bridges on the airside; the
 * silver dome of Satellite A at the west end of 2A.
 *
 * Evidence
 * - OSM (API map call, November 2026): 2A way/319030302, 2B way/319030292,
 *   2C way/172836959, 2D way/140940413 (the outlines draw the jet bridges'
 *   fixed links, cut off here by `despur` and drawn as bridges); Satellite
 *   A way/172836957 (height 13, roof dome, metal); Liaison AC
 *   way/141149076 (3 levels); the B–D junction way/685749605; the two
 *   landside buildings at the middle of each pair way/40016329 and
 *   way/40016326; the link to Satellite A way/1227121965 (5–8 m); the
 *   kiosk way/319030331; the small open canopy way/140910242 on 2A's
 *   landside is replaced (by 2A–2C) but not drawn. The CDG 2 TGV
 *   station, the Sheraton and the "Module" east of 2C are left out.
 * - Published: dates (fr.wikipedia, "Aéroport Paris-Charles-de-Gaulle":
 *   2A–2C link 2012, 16,600 m²; 2B–2D junction, 23,500 m²).
 * - Terrain: Mapterhorn z15: apron 9.5–11.3 m, the road trench between the
 *   pairs 3–7 m; the halls' landside walls run down to the trench.
 * - Photos (Wikimedia Commons; in the catalog, Salard's and Avdeev's are
 *   on both models, Borisov's on 2A–2C, Klack's and Greenboost's on 2B–2D):
 *   https://commons.wikimedia.org/wiki/File:CDG_TERMINAL_2A_FROM_A320_F-GJVW_AIR_FRANCE_TAKE_OFF_FLIGHT_CDG-VCE_(16644015646).jpg
 *     (Eric Salard, CC BY-SA 2.0) from the south, airborne: the row of
 *     vaults on 2A and 2B, Satellite A's dome, the jet bridges;
 *   https://commons.wikimedia.org/wiki/File:CDG-aerialview.jpg (Fyodor
 *     Borisov, CC BY-SA 3.0) aerial over 2A/2C: vault rows, the dome;
 *   https://commons.wikimedia.org/wiki/File:Terminal-2D-Paris-Charles-de-Gaulle-Roissy-en-France-02-2018.jpg
 *     (Gunnar Klack, CC BY-SA 4.0) the landside of 2D: the vault ends'
 *     concrete frames and slatted clerestories, the curved canopy;
 *   https://commons.wikimedia.org/wiki/File:Vue_2B_2D.jpg (Greenboost,
 *     public domain) over 2B/2D toward the apron;
 *   https://commons.wikimedia.org/wiki/File:Paris_-_Charles_de_Gaulle_(Roissy)_(CDG_-_LFPG)_AN0844044.jpg
 *     (Dmitry Avdeev, CC BY-SA 3.0) all four halls from the south, airborne:
 *     the vault rows run nearly the whole length of each hall.
 *
 * Numbers: eave G + 9.5 m, vault rise 7 m (crown G + 16.5) (estimated from Klack's photo:
 * the vault ends are about a storey and a half over the canopy, and from
 * the vaults' proportions in Salard's); one vault per ~27 m along each
 * hall's arc (counted: 11 on 2C in Salard's photo); halls' arcs fitted to
 * the OSM outlines; Satellite A 13 m to the dome's crown (OSM), wall 8 m
 * (estimated); junctions G + 14 m (estimated: a storey over the halls'
 * eaves in the aerials); landside buildings G + 10 m (estimated); jet
 * bridges at G + 3.6…6.4 m (estimated).
 * Doubts: the junction buildings (2012, 2017) are newer than every aerial
 * found and are drawn as plain glass blocks; the curved landside canopies
 * along each hall (Klack) are left out; the halls' landside below the
 * apron is drawn as a plain wall down to the trench.
 */
import { type V3 } from './mesh'
import { type XY, quadN, unit, capPoly, area } from './nyc-570-lexington'
import { prismRing, writeLod, newMats, ccw, despur, jetBridges, simplify, type Mats } from './tokyo-haneda-terminal-1'
import { CDG, lathe, glassBlock, centroid } from './paris-cdg-terminal-1'

/**
 * Apron over the lowest ground under each building (terrain): 2B–2D's
 * trench is the one the old joint model stood on (apron 7.2 m over it);
 * 2A–2C's own lowest ground is 1.0 m higher (Mapterhorn: 100.7 m against
 * 99.7 m), so its apron is 6.2 m over its y = 0 and the building stands
 * exactly where it did. Set per building by `build`.
 */
const G_OF = { ac: 6.2, bd: 7.2 }
let G = G_OF.bd
let EAVE = G + 9.5
const RISE = 7

/** Where the line p + t·d crosses the ring: the nearest crossing on each side of p (t < 0, t > 0). */
function crossings(ring: XY[], p: XY, d: XY): [number, number] | null {
  let lo = -Infinity, hi = Infinity
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], e: XY = [b[0] - a[0], b[1] - a[1]]
    const den = d[0] * e[1] - d[1] * e[0]; if (Math.abs(den) < 1e-9) continue
    const w: XY = [a[0] - p[0], a[1] - p[1]]
    const t = (w[0] * e[1] - w[1] * e[0]) / den, u = (w[0] * d[1] - w[1] * d[0]) / den
    if (u < 0 || u > 1) continue
    if (t < 0 && t > lo) lo = t
    if (t >= 0 && t < hi) hi = t
  }
  return Number.isFinite(lo) && Number.isFinite(hi) ? [lo, hi] : null
}

/**
 * Cut a long curved hall into bays across its length: the hall's principal
 * axis gives stations; at each, the band's mid-point; the cut runs along the
 * local normal of that centre line, from the outline's edge on one side to
 * the other. Returns each bay's four corners (side 0 at the start cut).
 */
export function hallBays(body: XY[], bay: number, margin = 3) {
  const { cuts, n } = bandCuts(body, bay, margin)
  const bays: [XY, XY, XY, XY][] = []
  const len = (c: [XY, XY]) => Math.hypot(c[1][0] - c[0][0], c[1][1] - c[0][1])
  const lens = cuts.filter(Boolean).map((c) => len(c!)).sort((a, b) => a - b), med = lens[Math.floor(lens.length / 2)]
  const ok = (c: [XY, XY] | null) => c && len(c) < med * 1.9 && len(c) > med * 0.5
  for (let k = 0; k < n; k++) {
    const A = cuts[k], B = cuts[k + 1]
    if (!ok(A) || !ok(B)) continue
    const da = Math.atan2(A![1][1] - A![0][1], A![1][0] - A![0][0]), db = Math.atan2(B![1][1] - B![0][1], B![1][0] - B![0][0])
    let dd = Math.abs(da - db); if (dd > Math.PI) dd = 2 * Math.PI - dd
    if (dd > 0.8) continue
    bays.push([A![0], B![0], B![1], A![1]])
  }
  return bays
}

/** Cuts across a curved band (see hallBays): n + 1 cuts, each [one side, other side], or null where the cut missed. */
export function bandCuts(body: XY[], bay: number, margin = 3) {
  const n0 = body.length, mx = body.reduce((s, p) => s + p[0], 0) / n0, my = body.reduce((s, p) => s + p[1], 0) / n0
  let sxx = 0, syy = 0, sxy = 0
  for (const [x, y] of body) { sxx += (x - mx) ** 2; syy += (y - my) ** 2; sxy += (x - mx) * (y - my) }
  const th = 0.5 * Math.atan2(2 * sxy, sxx - syy), ax: XY = [Math.cos(th), Math.sin(th)], ay: XY = [-ax[1], ax[0]]
  const proj = body.map(([x, y]) => (x - mx) * ax[0] + (y - my) * ax[1])
  const s0 = Math.min(...proj) + margin, s1 = Math.max(...proj) - margin
  // the centre line, sampled finely
  const mid = (s: number): XY | null => { const p: XY = [mx + ax[0] * s, my + ax[1] * s], c = crossings(body, p, ay); return c ? [p[0] + ay[0] * (c[0] + c[1]) / 2, p[1] + ay[1] * (c[0] + c[1]) / 2] : null }
  const L = s1 - s0, n = Math.max(2, Math.round(L / bay))
  const cut = (s: number): [XY, XY] | null => {
    const c = mid(s), a = mid(s - 4), b = mid(s + 4); if (!c || !a || !b) return null
    const t = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(t[0], t[1]), nn: XY = [-t[1] / l, t[0] / l]
    const x = crossings(body, c, nn); if (!x) return null
    return [[c[0] + nn[0] * x[0], c[1] + nn[1] * x[0]], [c[0] + nn[0] * x[1], c[1] + nn[1] * x[1]]]
  }
  const cuts = Array.from({ length: n + 1 }, (_, k) => cut(s0 + (L * k) / n))
  return { cuts, n }
}

/**
 * A barrel vault over a quad (i0, i1 the inner edge, o1, o0 the outer edge;
 * i0–o0 and i1–o1 the springing lines): the arch runs across from the
 * 0-side to the 1-side; its axis from inner to outer. Ends glazed.
 */
export function quadVault(M: Mats, c: [XY, XY, XY, XY], z0: number, rise: number, n: number, ends: boolean, frame = 0, frameEnds: number[] = [0, 1]) {
  const [i0, i1, o1, o0] = c
  const g = 0.035 // the gap between neighbouring vaults, as a share of the bay
  const at = (t0: number, s: number): V3 => {
    const t = g + (1 - 2 * g) * t0
    const a: XY = [i0[0] + (i1[0] - i0[0]) * t, i0[1] + (i1[1] - i0[1]) * t], b: XY = [o0[0] + (o1[0] - o0[0]) * t, o0[1] + (o1[1] - o0[1]) * t]
    return [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, z0 + rise * Math.pow(Math.sin(Math.PI * t0), 0.55)]
  }
  for (let k = 0; k < n; k++) {
    const t0 = k / n, t1 = (k + 1) / n
    const p = [at(t0, 0), at(t1, 0), at(t1, 1), at(t0, 1)]
    // normal: across (t) and along (s) derivatives
    const nrm = (t: number): V3 => {
      const e = 1e-3, A = at(Math.max(0, t - e), 0.5), B = at(Math.min(1, t + e), 0.5), S0 = at(t, 0), S1 = at(t, 1)
      const dt: V3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], ds: V3 = [S1[0] - S0[0], S1[1] - S0[1], S1[2] - S0[2]]
      const v = unit([dt[1] * ds[2] - dt[2] * ds[1], dt[2] * ds[0] - dt[0] * ds[2], dt[0] * ds[1] - dt[1] * ds[0]])
      return v[2] < 0 ? [-v[0], -v[1], -v[2]] : v
    }
    quadN(M.roof, p[0], p[1], p[2], p[3], [nrm(t0), nrm(t1), nrm(t1), nrm(t0)])
  }
  if (!ends) return
  for (const s of [0, 1]) {
    const pts = Array.from({ length: n + 1 }, (_, k) => at(k / n, s))
    const base0 = pts[0], base1 = pts[n]
    const d: XY = [base1[0] - base0[0], base1[1] - base0[1]], L = Math.hypot(d[0], d[1])
    if (L < 0.5) continue
    const nn: V3 = s === 0 ? [d[1] / L, -d[0] / L, 0] : [-d[1] / L, d[0] / L, 0]
    // outward: away from the other end
    const other = at(0.5, 1 - s), mid = at(0.5, s)
    const out: V3 = (other[0] - mid[0]) * nn[0] + (other[1] - mid[1]) * nn[1] > 0 ? [-nn[0], -nn[1], 0] : nn
    for (let k = 1; k < n - 0; k++) M.win.tri(base0, pts[k], pts[k + 1], undefined, undefined, undefined, [out, out, out])
    if (frame > 0 && frameEnds.includes(s)) for (let k = 0; k < n; k++) { // the concrete frame round the arch
      const a = pts[k], b = pts[k + 1], o: V3 = [out[0] * 0.15, out[1] * 0.15, 0]
      M.con.tri([a[0] + o[0], a[1] + o[1], a[2]], [b[0] + o[0], b[1] + o[1], b[2]], [b[0] + o[0], b[1] + o[1], b[2] - frame], undefined, undefined, undefined, [out, out, out])
      M.con.tri([a[0] + o[0], a[1] + o[1], a[2]], [b[0] + o[0], b[1] + o[1], b[2] - frame], [a[0] + o[0], a[1] + o[1], a[2] - frame], undefined, undefined, undefined, [out, out, out])
    }
  }
}

/** Hall walls: concrete below the apron and as a fascia, glass between. */
function hallWalls(M: Mats, ring: XY[], z1: number, detail: boolean) {
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.05) continue
    const n: XY = [(b[1] - a[1]) / L * 0.05, (a[0] - b[0]) / L * 0.05]
    M.con.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], G + 0.8], [a[0], a[1], G + 0.8])
    M.win.quad([a[0], a[1], G + 0.8], [b[0], b[1], G + 0.8], [b[0], b[1], z1 - 1.8], [a[0], a[1], z1 - 1.8])
    M.white.quad([a[0], a[1], z1 - 1.8], [b[0], b[1], z1 - 1.8], [b[0], b[1], z1], [a[0], a[1], z1])
    if (detail && L > 6) { const k = Math.round(L / 6); for (let j = 1; j < k; j++) { const t = j / k, c: XY = [a[0] + (b[0] - a[0]) * t + n[0] * 2, a[1] + (b[1] - a[1]) * t + n[1] * 2], u: XY = [(b[0] - a[0]) / L * 0.2, (b[1] - a[1]) / L * 0.2]
      M.white.quad([c[0] - u[0], c[1] - u[1], G + 0.8], [c[0] + u[0], c[1] + u[1], G + 0.8], [c[0] + u[0], c[1] + u[1], z1 - 1.8], [c[0] - u[0], c[1] - u[1], z1 - 1.8]) } }
  }
}

function hall(M: Mats, outline: XY[], detail: boolean) {
  const { body, spurs } = despur(outline, 9.5, 40)
  const b = detail ? body : simplify(ccw(body), 0.8)
  hallWalls(M, b, EAVE, detail)
  capPoly(M.metal, b, EAVE - 0.05) // the flat roof round the vaults
  for (const c of hallBays(b, 26, 2)) {
    // the landside is the edge nearer the roads between the two rows of halls (y ≈ 0)
    const e0 = Math.abs((c[0][1] + c[1][1]) / 2), e1 = Math.abs((c[2][1] + c[3][1]) / 2)
    const land = e0 < e1 ? 0 : 1
    quadVault(M, c, EAVE, RISE, detail ? 10 : 6, true, 1.1, detail ? [0, 1] : [land])
    // the wavy concrete canopy over the landside kerb
    const [p, q] = land === 0 ? [c[0], c[1]] : [c[2], c[3]]
    const other = land === 0 ? [c[3], c[2]] : [c[1], c[0]]
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]), u: XY = [(q[0] - p[0]) / L, (q[1] - p[1]) / L]
    let nn: XY = [u[1], -u[0]]
    const mid: XY = [(other[0][0] + other[1][0]) / 2 - (p[0] + q[0]) / 2, (other[0][1] + other[1][1]) / 2 - (p[1] + q[1]) / 2]
    if (nn[0] * mid[0] + nn[1] * mid[1] > 0) nn = [-nn[0], -nn[1]]
    const k = detail ? 8 : 4, D = 9, zc = G + 5.2
    for (let i = 0; i < k; i++) {
      const t0 = i / k, t1 = (i + 1) / k, z = (t: number) => zc + 1.6 * Math.sin(Math.PI * t)
      const A: XY = [p[0] + (q[0] - p[0]) * t0, p[1] + (q[1] - p[1]) * t0], B: XY = [p[0] + (q[0] - p[0]) * t1, p[1] + (q[1] - p[1]) * t1]
      const Ao: XY = [A[0] + nn[0] * D, A[1] + nn[1] * D], Bo: XY = [B[0] + nn[0] * D, B[1] + nn[1] * D]
      const za = z(t0), zb = z(t1), zao = zc + 0.2, zbo = zc + 0.2
      M.con.quad([A[0], A[1], za], [Ao[0], Ao[1], zao], [Bo[0], Bo[1], zbo], [B[0], B[1], zb])
      M.con.quad([A[0], A[1], za - 0.7], [B[0], B[1], zb - 0.7], [Bo[0], Bo[1], zbo - 0.5], [Ao[0], Ao[1], zao - 0.5])
      M.con.quad([Ao[0], Ao[1], zao - 0.5], [Bo[0], Bo[1], zbo - 0.5], [Bo[0], Bo[1], zbo], [Ao[0], Ao[1], zao])
    }
  }
  jetBridges({ ...M, bridge: M.metal, roof: M.metal }, spurs, { z0: G + 3.6, z1: G + 6.4, detail })
}

/** The two freestanding buildings: 2A + 2C (with Liaison AC and Satellite A), and 2B + 2D. */
type Pair = 'ac' | 'bd'

function build(detail: boolean, pair: Pair) {
  G = G_OF[pair]; EAVE = G + 9.5
  const M: Mats = newMats(['con', 'roof', 'win', 'white', 'metal'])
  for (const h of pair === 'ac' ? [H2A, H2C] : [H2B, H2D]) hall(M, h, detail)
  const S = { wall: M.con, win: M.win, trim: M.white, roof: M.metal }
  // Satellite A: a glazed drum under a silver dome (OSM 13 m)
  if (pair === 'ac') {
    const c: XY = [SAT_A.reduce((s, p) => s + p[0], 0) / SAT_A.length, SAT_A.reduce((s, p) => s + p[1], 0) / SAT_A.length]
    const R = SAT_A.reduce((s, p) => s + Math.hypot(p[0] - c[0], p[1] - c[1]), 0) / SAT_A.length
    const n = detail ? 40 : 20
    lathe(M.con, [[R, 0], [R, G + 1]], n, { cx: c[0], cy: c[1] })
    lathe(M.win, [[R, G + 1], [R, G + 7]], n, { cx: c[0], cy: c[1] })
    lathe(M.white, [[R, G + 7], [R + 0.4, G + 7.2], [R + 0.4, G + 8]], n, { cx: c[0], cy: c[1] })
    const dome: [number, number][] = Array.from({ length: (detail ? 8 : 5) + 1 }, (_, k) => { const t = (Math.PI / 2) * (k / (detail ? 8 : 5)); return [(R + 0.4) * Math.cos(t), G + 8 + 5 * Math.sin(t)] })
    lathe(M.metal, dome, n, { cx: c[0], cy: c[1] })
  }
  if (pair === 'ac') {
    glassBlock(S, LINK_A, G + 5, G + 8, { fascia: 0.8 })
    capPoly(M.white, LINK_A, G + 5, false)
  }
  for (const r of [pair === 'ac' ? LIAISON_AC : JUNCTION_BD]) {
    prismRing(M.con, r, 0, G + 0.6, null)
    glassBlock(S, detail ? r : simplify(ccw(r), 0.8), G + 0.6, G + 14, { fascia: 1.6, bay: detail ? 6 : 12, rows: detail ? [G + 5.5, G + 10.5] : [] })
  }
  for (const r of [pair === 'ac' ? LAND_S : LAND_N]) { prismRing(M.con, r, 0, G + 0.6, null); glassBlock(S, r, G + 0.6, G + 10, { fascia: 1.4 }) }
  if (pair === 'ac') prismRing(M.white, KIOSK, G + 4.5, G + 5.5, M.white, M.white)

  return [
    { part: M.con, material: CDG.concrete },
    { part: M.roof, material: CDG.roof },
    { part: M.win, material: CDG.window },
    { part: M.white, material: CDG.white },
    { part: M.metal, material: CDG.metal },
  ]
}

// ===========================================================================
// OSM data, in this frame (bearing 0, anchor 2.564362, 49.0036252)
// ===========================================================================

/** way/319030302 */
const H2A: XY[] = [[-300.0,-148.7],[-298.6,-149.3],[-291.7,-133.8],[-283.5,-115.7],[-276.5,-118.4],[-275.5,-115.9],[-275.7,-112.8],[-273.7,-107.9],[-272.8,-105.7],[-262.9,-83.7],[-269.0,-81.8],[-270.1,-85.2],[-285.9,-80.1],[-298.1,-77.6],[-309.9,-76.7],[-322.1,-76.9],[-337.9,-79.7],[-353.3,-84.5],[-360.9,-62.0],[-349.6,-59.0],[-335.0,-55.7],[-322.4,-54.2],[-304.4,-53.8],[-294.8,-54.7],[-275.1,-58.5],[-269.5,-60.4],[-261.4,-63.1],[-262.9,-67.5],[-257.1,-69.5],[-254.3,-62.3],[-232.4,-71.1],[-209.7,-76.1],[-185.0,-80.0],[-161.1,-80.6],[-136.6,-79.1],[-123.6,-76.5],[-112.5,-74.2],[-101.9,-70.9],[-90.2,-67.4],[-67.3,-57.0],[-46.7,-44.9],[-43.6,-50.0],[-31.3,-65.0],[-12.2,-97.4],[-9.0,-102.3],[-38.7,-120.3],[-44.6,-123.1],[-38.3,-136.8],[-31.7,-151.6],[-29.8,-155.8],[-35.1,-158.2],[-36.4,-158.8],[-37.6,-156.2],[-40.8,-157.5],[-41.0,-157.9],[-44.2,-159.3],[-44.8,-159.2],[-45.4,-159.0],[-45.8,-158.7],[-46.2,-158.2],[-46.3,-157.6],[-46.3,-157.0],[-46.0,-156.4],[-45.6,-156.0],[-42.5,-154.6],[-41.9,-154.7],[-41.7,-154.8],[-38.8,-153.6],[-45.4,-139.0],[-51.2,-126.2],[-60.6,-130.6],[-89.9,-139.2],[-85.0,-157.6],[-81.7,-170.0],[-80.4,-174.7],[-87.8,-176.5],[-88.6,-173.4],[-91.9,-174.1],[-91.9,-174.2],[-92.4,-174.6],[-95.7,-175.4],[-96.3,-175.2],[-96.8,-174.9],[-97.2,-174.5],[-97.4,-173.9],[-97.5,-173.3],[-97.3,-172.7],[-97.0,-172.2],[-96.5,-171.9],[-93.2,-171.1],[-92.5,-171.3],[-92.4,-171.4],[-89.3,-170.7],[-91.9,-161.0],[-97.1,-141.4],[-122.7,-148.1],[-137.4,-148.7],[-135.7,-168.5],[-134.7,-179.6],[-134.3,-184.1],[-141.5,-184.8],[-141.8,-181.9],[-144.9,-182.1],[-145.4,-182.5],[-148.8,-182.8],[-149.4,-182.5],[-149.8,-182.2],[-150.2,-181.6],[-150.3,-181.1],[-150.2,-180.5],[-150.0,-179.9],[-149.6,-179.5],[-149.1,-179.2],[-145.6,-178.9],[-145.2,-179.2],[-142.0,-178.9],[-142.9,-169.3],[-144.6,-149.0],[-171.1,-150.1],[-186.6,-148.7],[-188.1,-167.0],[-189.1,-179.7],[-189.6,-184.9],[-196.4,-184.5],[-196.1,-180.6],[-198.1,-180.4],[-198.7,-180.7],[-202.1,-180.5],[-202.6,-180.2],[-203.0,-179.7],[-203.3,-179.2],[-203.4,-178.6],[-203.2,-178.0],[-202.9,-177.5],[-202.4,-177.1],[-201.9,-176.9],[-198.5,-177.1],[-197.9,-177.5],[-197.9,-177.5],[-195.8,-177.8],[-194.9,-166.2],[-193.4,-147.5],[-206.4,-146.1],[-216.1,-144.8],[-233.4,-140.4],[-238.1,-156.7],[-242.6,-172.0],[-243.7,-175.6],[-250.2,-173.9],[-249.5,-171.0],[-251.3,-170.4],[-251.7,-170.6],[-255.1,-169.9],[-255.5,-169.5],[-255.9,-169.0],[-256.1,-168.5],[-256.0,-167.9],[-255.8,-167.3],[-255.4,-166.8],[-254.9,-166.5],[-254.3,-166.4],[-251.0,-167.0],[-250.5,-167.5],[-250.4,-167.6],[-248.7,-168.1],[-245.1,-154.8],[-240.7,-138.4],[-253.5,-134.5],[-279.5,-124.2],[-285.5,-137.8],[-293.0,-154.6],[-294.7,-158.4],[-300.1,-156.0],[-301.3,-155.5],[-299.7,-151.8],[-301.3,-151.1],[-301.9,-151.2],[-305.0,-149.9],[-305.4,-149.4],[-305.7,-148.9],[-305.7,-148.3],[-305.6,-147.7],[-305.3,-147.2],[-304.8,-146.8],[-304.2,-146.6],[-303.6,-146.6],[-300.5,-147.9],[-300.1,-148.4]]
/** way/319030292 */
const H2B: XY[] = [[-159.3,159.8],[-159.2,159.9],[-158.7,160.2],[-155.3,160.4],[-154.7,160.1],[-154.2,159.6],[-154.0,159.0],[-153.9,158.4],[-154.1,157.8],[-154.5,157.2],[-155.0,156.8],[-158.4,156.6],[-159.0,156.8],[-159.2,157.0],[-163.2,156.5],[-162.8,151.7],[-158.5,152.0],[-158.4,152.1],[-157.9,152.4],[-154.5,152.6],[-153.9,152.3],[-153.5,151.8],[-153.2,151.2],[-153.2,150.6],[-153.3,149.9],[-153.7,149.4],[-154.2,149.0],[-157.6,148.8],[-158.2,149.0],[-158.3,149.1],[-162.6,148.7],[-162.0,141.0],[-160.8,125.1],[-139.5,126.2],[-119.3,126.0],[-118.0,142.0],[-116.7,157.3],[-116.1,165.0],[-109.0,164.4],[-111.1,141.4],[-112.6,125.4],[-93.7,122.3],[-72.3,118.1],[-68.2,134.1],[-64.1,149.9],[-62.4,156.4],[-56.6,154.9],[-54.8,154.4],[-56.1,149.6],[-52.7,148.5],[-52.6,148.6],[-52.0,148.7],[-48.7,147.8],[-48.2,147.4],[-48.0,146.8],[-47.9,146.1],[-48.1,145.5],[-48.4,145.0],[-49.0,144.6],[-49.6,144.4],[-52.9,145.2],[-53.3,145.5],[-56.9,146.6],[-58.2,141.8],[-54.9,140.8],[-54.9,140.8],[-54.3,140.9],[-51.0,140.1],[-50.5,139.6],[-50.2,139.0],[-50.2,138.4],[-50.3,137.8],[-50.7,137.2],[-51.2,136.8],[-51.8,136.6],[-55.2,137.5],[-55.6,137.8],[-59.0,138.9],[-62.1,126.0],[-59.2,125.2],[-60.5,120.4],[-42.9,114.4],[-26.1,108.1],[-27.5,101.5],[-39.0,73.4],[-43.9,62.8],[-49.9,48.9],[-53.4,40.7],[-75.7,49.5],[-99.4,56.0],[-123.1,59.4],[-147.6,60.1],[-161.3,59.3],[-171.8,57.9],[-195.7,53.7],[-219.0,46.0],[-241.0,35.9],[-261.5,24.1],[-264.4,28.7],[-272.4,22.6],[-288.8,16.2],[-314.5,8.6],[-346.3,6.5],[-369.4,8.9],[-365.3,33.0],[-350.8,31.1],[-330.8,31.1],[-312.2,35.5],[-295.1,41.1],[-280.1,47.9],[-278.3,44.5],[-275.0,45.6],[-297.1,80.7],[-293.7,83.4],[-301.6,95.5],[-311.3,110.4],[-314.5,115.2],[-310.1,117.9],[-308.9,118.6],[-305.7,113.6],[-303.8,114.7],[-303.8,115.0],[-303.6,115.5],[-303.3,116.0],[-300.3,117.7],[-299.6,117.7],[-299.0,117.4],[-298.5,117.0],[-298.2,116.4],[-298.1,115.8],[-298.2,115.1],[-298.5,114.6],[-301.5,112.9],[-302.1,112.9],[-302.7,113.0],[-304.6,111.9],[-301.4,107.0],[-299.4,108.1],[-299.4,108.3],[-299.2,108.9],[-298.8,109.4],[-295.8,111.0],[-295.2,111.0],[-294.6,110.8],[-294.1,110.3],[-293.8,109.8],[-293.7,109.1],[-293.8,108.5],[-294.1,107.9],[-297.1,106.3],[-297.7,106.2],[-298.3,106.4],[-298.3,106.4],[-300.3,105.3],[-296.1,98.8],[-288.0,86.4],[-275.0,94.0],[-258.5,100.9],[-265.1,115.3],[-271.9,130.4],[-274.9,137.0],[-270.6,139.1],[-268.5,140.0],[-266.2,134.9],[-263.4,136.0],[-263.3,136.2],[-262.9,136.6],[-259.7,137.7],[-259.0,137.6],[-258.5,137.2],[-258.1,136.7],[-257.8,136.1],[-257.8,135.4],[-258.1,134.8],[-258.5,134.3],[-261.7,133.2],[-262.1,133.2],[-264.9,132.1],[-262.8,127.2],[-260.2,128.3],[-260.1,128.4],[-259.6,128.9],[-256.4,130.0],[-255.8,129.8],[-255.2,129.5],[-254.8,129.0],[-254.6,128.4],[-254.6,127.7],[-254.8,127.1],[-255.2,126.6],[-258.5,125.5],[-258.8,125.5],[-261.5,124.5],[-258.6,118.0],[-252.4,104.1],[-234.9,110.8],[-214.6,116.9],[-218.5,132.3],[-222.6,148.5],[-224.2,154.8],[-219.5,156.0],[-217.1,156.6],[-215.7,151.1],[-212.3,152.0],[-212.3,152.1],[-211.9,152.6],[-211.5,153.0],[-208.1,153.8],[-207.5,153.5],[-207.0,153.1],[-206.6,152.6],[-206.5,151.9],[-206.6,151.3],[-206.8,150.7],[-207.3,150.2],[-210.7,149.5],[-211.2,149.6],[-211.6,149.8],[-215.1,148.9],[-213.6,143.3],[-210.4,144.3],[-210.2,144.6],[-209.7,144.9],[-206.4,145.7],[-205.8,145.5],[-205.3,145.1],[-204.9,144.5],[-204.8,143.9],[-204.8,143.2],[-205.1,142.6],[-205.6,142.2],[-208.9,141.4],[-209.5,141.5],[-209.8,141.7],[-213.0,140.8],[-211.1,133.9],[-207.2,119.0],[-186.8,122.7],[-167.9,124.6],[-169.0,140.6],[-170.2,157.7],[-170.7,164.7],[-163.9,164.9],[-163.4,159.4]]
/** way/172836959 */
const H2C: XY[] = [[94.6,-114.3],[96.5,-114.9],[95.0,-118.4],[118.4,-124.2],[119.0,-120.8],[127.0,-121.9],[126.5,-125.7],[137.9,-127.3],[136.1,-140.9],[133.0,-164.8],[134.7,-165.1],[137.3,-165.5],[138.1,-161.0],[140.6,-141.3],[142.3,-127.9],[150.7,-129.1],[151.3,-125.4],[159.8,-126.5],[159.8,-129.8],[183.6,-131.4],[183.6,-127.4],[186.7,-127.1],[187.6,-142.4],[189.1,-170.0],[191.1,-169.9],[193.0,-169.9],[192.9,-164.4],[191.1,-142.4],[189.7,-126.8],[192.5,-126.5],[192.9,-130.2],[216.6,-129.1],[216.7,-125.1],[225.3,-123.7],[226.2,-127.5],[239.1,-124.6],[241.2,-137.9],[245.2,-163.6],[246.8,-163.2],[249.5,-162.7],[248.6,-157.9],[244.6,-137.0],[242.1,-124.0],[249.1,-122.4],[248.3,-119.3],[257.5,-116.8],[258.5,-120.7],[281.2,-113.4],[280.0,-110.1],[284.0,-108.4],[289.6,-123.0],[299.4,-149.1],[301.0,-148.5],[303.3,-147.6],[301.3,-142.3],[293.5,-121.7],[287.8,-106.7],[288.4,-106.5],[289.6,-109.6],[311.5,-100.5],[310.2,-97.0],[318.0,-92.9],[319.6,-96.6],[332.0,-89.3],[338.4,-99.8],[351.4,-121.2],[353.2,-120.1],[355.2,-118.9],[353.4,-116.1],[342.2,-97.6],[335.8,-87.1],[340.5,-84.3],[313.3,-37.4],[307.1,-26.7],[301.4,-16.8],[280.0,-29.2],[258.3,-39.2],[234.8,-46.4],[211.3,-51.0],[187.8,-52.2],[163.1,-51.4],[139.2,-48.7],[115.9,-41.7],[93.5,-33.3],[92.5,-35.8],[83.4,-58.1],[74.1,-81.0],[68.9,-93.7],[63.8,-106.3],[86.3,-115.2],[87.9,-112.5],[91.6,-113.5],[83.4,-138.1],[78.6,-152.8],[80.1,-153.2],[82.5,-153.9],[84.0,-148.8],[87.0,-139.0]]
/** way/140940413 */
const H2D: XY[] = [[325.8,138.8],[310.9,145.1],[298.3,149.3],[286.0,152.9],[295.0,187.9],[288.9,189.5],[279.5,154.3],[266.2,158.0],[250.0,160.7],[237.7,162.3],[240.4,198.1],[234.0,198.8],[231.0,162.3],[214.4,163.1],[199.4,163.3],[187.9,162.9],[185.3,198.4],[178.7,198.0],[181.3,162.0],[167.2,160.5],[154.3,158.4],[139.8,155.3],[130.7,189.9],[124.3,188.3],[133.2,153.8],[116.9,148.2],[104.8,144.1],[92.8,139.5],[77.8,172.6],[72.2,169.9],[87.5,137.5],[74.0,128.8],[62.6,122.3],[49.4,114.1],[59.0,97.6],[69.2,82.3],[72.3,76.3],[85.0,54.7],[87.3,51.1],[107.1,61.2],[129.8,71.2],[152.9,78.9],[176.6,83.6],[200.4,85.4],[225.1,84.6],[248.9,81.1],[272.1,75.3],[279.3,73.5],[297.2,68.8],[301.1,78.3],[302.2,81.6],[305.4,89.1],[323.2,134.4],[329.9,131.5],[346.8,168.7],[345.5,169.3],[341.2,171.6],[338.8,166.6]]
/** way/172836957 */
const SAT_A: XY[] = [[-412.9,-124.2],[-407.9,-117.4],[-401.1,-112.4],[-393.1,-109.6],[-384.7,-109.3],[-376.5,-111.4],[-369.3,-115.9],[-367.9,-117.5],[-366.0,-119.7],[-363.8,-122.2],[-360.4,-129.9],[-359.4,-138.2],[-360.9,-146.5],[-364.9,-153.9],[-370.8,-159.9],[-378.3,-163.9],[-386.6,-165.5],[-395.0,-164.5],[-402.8,-161.2],[-409.2,-155.8],[-413.7,-148.6],[-415.9,-140.5],[-415.6,-132.1]]
/** way/141149076 */
const LIAISON_AC: XY[] = [[9.1,-116.5],[11.1,-126.7],[12.6,-129.2],[15.3,-130.0],[26.8,-131.2],[35.1,-131.2],[53.5,-126.5],[56.1,-124.3],[56.9,-121.3],[56.8,-111.8],[64.4,-92.6],[68.9,-93.7],[74.1,-81.0],[69.7,-79.3],[76.1,-63.4],[59.5,-59.1],[52.2,-57.7],[39.8,-57.0],[30.7,-57.3],[30.1,-49.1],[21.0,-50.4],[21.8,-58.3],[16.7,-59.2],[11.0,-60.5],[8.9,-60.9],[-0.8,-63.7],[-17.7,-71.0],[-5.3,-92.5],[-12.2,-97.4],[-9.0,-102.3],[-2.1,-97.4]]
/** way/685749605 */
const JUNCTION_BD: XY[] = [[-26.1,108.1],[-27.5,101.5],[-39.0,73.4],[-12.7,66.5],[7.9,64.6],[10.3,58.1],[24.1,58.9],[25.3,66.1],[43.8,70.5],[57.2,76.2],[69.2,82.3],[59.0,97.6],[49.4,114.1],[47.8,137.6],[-27.3,132.3]]
/** way/40016329 */
const LAND_S: XY[] = [[-40.6,-48.2],[-23.0,-37.6],[3.3,-27.7],[25.2,-25.8],[35.2,-25.8],[57.1,-27.6],[75.9,-31.0],[87.0,-34.0],[92.5,-35.8],[83.4,-58.1],[65.3,-52.6],[52.0,-49.8],[42.3,-49.1],[30.1,-49.1],[21.0,-50.4],[17.0,-51.0],[4.7,-53.7],[-2.2,-55.9],[-7.6,-57.7],[-15.4,-61.0],[-23.9,-65.3],[-25.8,-62.2],[-31.3,-65.0],[-43.6,-50.0]]
/** way/40016326 */
const LAND_N: XY[] = [[62.9,71.1],[42.0,62.8],[24.1,58.9],[10.3,58.1],[-4.8,58.7],[-22.3,62.5],[-32.3,65.6],[-37.8,67.5],[-40.2,61.6],[-43.9,62.8],[-49.9,48.9],[-45.9,47.1],[-47.2,43.7],[-31.0,38.7],[-10.4,34.5],[6.5,33.5],[22.3,34.2],[40.3,37.0],[56.4,41.7],[69.1,46.0],[79.7,51.4],[85.0,54.7],[72.3,76.3]]
/** way/1227121965 */
const LINK_A: XY[] = [[-363.8,-122.2],[-357.3,-117.1],[-347.7,-112.3],[-329.8,-108.2],[-311.2,-106.4],[-290.9,-109.7],[-275.5,-115.9],[-275.7,-112.8],[-273.7,-107.9],[-290.5,-102.2],[-306.8,-99.9],[-325.9,-99.9],[-337.8,-102.3],[-351.1,-106.8],[-360.3,-111.4],[-367.9,-117.5],[-366.0,-119.7]]
/** way/319030331 */
const KIOSK: XY[] = [[26.8,-131.2],[28.4,-145.5],[36.5,-145.0],[35.1,-131.2]]

/** Area centroid of several outlines together. */
function centroidOf(rings: XY[][]): XY {
  let A = 0, x = 0, y = 0
  for (const r0 of rings) { const r = ccw(r0), c = centroid(r), a = area(r); A += a; x += c[0] * a; y += c[1] * a }
  return [x / A, y / A]
}
const LNG0 = 2.564362, LAT0 = 49.0036252
const lngLat = ([x, y]: XY) => [+(LNG0 + x / (Math.cos((LAT0 * Math.PI) / 180) * 111320)).toFixed(7), +(LAT0 + y / 110574).toFixed(7)]

/** Move built parts (already in glTF's frame) east and north by -o: the new anchor becomes the origin; heights stay. */
function moveTo(parts: ReturnType<typeof build>, o: XY) {
  for (const { part } of parts) for (let i = 0; i < part.pos.length; i += 3) { part.pos[i] -= o[0]; part.pos[i + 2] += o[1] }
  return parts
}

const MODELS: { id: string; name: string; pair: Pair; rings: XY[][]; osm: string }[] = [
  { id: 'paris-cdg-terminal-2a-2c', name: 'Paris-CDG Terminals 2A and 2C', pair: 'ac', rings: [H2A, H2C, SAT_A, LIAISON_AC, LAND_S, LINK_A, KIOSK], osm: 'way/319030302' },
  { id: 'paris-cdg-terminal-2b-2d', name: 'Paris-CDG Terminals 2B and 2D', pair: 'bd', rings: [H2B, H2D, JUNCTION_BD, LAND_N], osm: 'way/319030292' },
]

if (import.meta.main) {
  for (const m of MODELS) {
    const c = centroidOf(m.rings)
    console.log(`${m.id}: anchor ${c.map((v) => v.toFixed(1)).join(', ')} in the old frame = lng, lat ${lngLat(c).join(', ')}`)
    const extras = { bearing: 0, osm: m.osm, height: EAVE + RISE }
    writeLod(m.name, `${m.id}.glb`, moveTo(build(false, m.pair), c), extras, 8000, 250_000)
    writeLod(m.name, `${m.id}.detail.glb`, moveTo(build(true, m.pair), c), extras, 40_000, 1_500_000)
  }
}
