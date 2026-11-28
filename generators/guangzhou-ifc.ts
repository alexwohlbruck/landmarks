/**
 * Guangzhou International Finance Center (West Tower), Zhujiang New Town,
 * Guangzhou — original procedural geometry, CC0-1.0.
 * bun generators/guangzhou-ifc.ts   (writes the low model and the detail LOD)
 *
 * Frame: bearing 0 (model +y = north). Origin = the area centroid of the OSM
 * outline way/184738716 (113.3179000 E, 23.1202730 N), on the plaza;
 * elevation 0.
 *
 * Form, as read from OSM and the photos:
 * - a rounded-triangle plan (corners towards compass 45, 165 and 285 deg,
 *   from the OSM outline), its sides gently convex: drawn in polar form,
 *   r = R (1 + 0.18 cos 3(phi - corner));
 * - the slight bulge: the plan grows about 4 % from the plaza to ~120 m,
 *   then narrows over a rounded, bullet-like shoulder to 58 % of the base
 *   size at the flat top (438.6 m);
 * - the steel diagrid, which stands just inside the glass and shows only
 *   faintly: drawn as a low relief a shade lighter than the glass, 10 nodes
 *   round the tower on 16 levels of ~27 m (the low model: every other
 *   level, so taller diamonds and half the members), every other level
 *   offset half a bay, so the members cross in X's;
 * - faint darker bands at every second node level;
 * - the flat top: the glass screen carried 3.6 m above the roof as a parapet.
 *
 * Not modelled: the IFC podium mall (Friendship Store, way/312888407) and
 * the Ascott apartment annexe are separate OSM buildings with their own
 * outlines; the map keeps drawing them, so they are left out. The glass
 * canopy way/717941983 between tower and mall is left to the map too.
 *
 * Evidence
 * - OSM (© OpenStreetMap contributors, ODbL), fetched 2026-11-27: outline
 *   way/184738716 "广州国际金融中心(广州西塔)" (440.2 m, 103 levels,
 *   Q1043438).
 * - Published (Wikipedia "Guangzhou International Finance Center"; CTBUH):
 *   438.6 m architectural and roof height, 103 floors, top floor 415.1 m;
 *   WilkinsonEyre, Arup; completed 2010; offices 1-66, mechanical 67-68,
 *   Four Seasons hotel 69-98, observation 99-100.
 * - Photos (Wikimedia Commons):
 *   "Guangzhou Twin Towers IFC(cropped).jpg", xiquinhosilva, CC BY 2.0, from
 *   the SE (131 deg, 1.6 km): profile, bulge and taper (widths scaled at
 *   0.46 m/px), colour; https://commons.wikimedia.org/wiki/File:Guangzhou_Twin_Towers_IFC(cropped).jpg
 *   "Guangzhou International Finance Center from Huacheng Square.jpg",
 *   そらみみ, CC BY-SA 4.0, from the SSE (163 deg, 400 m): dark bands, flat
 *   top; https://commons.wikimedia.org/wiki/File:Guangzhou_International_Finance_Center_from_Huacheng_Square.jpg
 *   "IFC Guangzhou.jpg", 慕尼黑啤酒, CC BY-SA 4.0, 2008 under construction:
 *   the diagrid's X pattern, node spacing and the number of bays;
 *   https://commons.wikimedia.org/wiki/File:IFC_Guangzhou.jpg
 *   "Guangzhou twin towers (4to3).jpg", Sergei Gussev, CC BY 2.0, from the SE:
 *   https://commons.wikimedia.org/wiki/File:Guangzhou_twin_towers_(4to3).jpg
 *   "Guangzhou Two Towers 02-10-2018.jpg", Milkomède, CC BY-SA 4.0: colour;
 *   https://commons.wikimedia.org/wiki/File:Guangzhou_Two_Towers_02-10-2018.jpg
 *   "Canton West Tower 2015 1.jpg", 李言滄, CC BY 2.0: the bands, glass;
 *   https://commons.wikimedia.org/wiki/File:Canton_West_Tower_2015_1.jpg
 *   "Guangzhou West Tower 20220603-01.jpg", 中少, CC BY-SA 4.0: the base,
 *   the Ascott annexe; https://commons.wikimedia.org/wiki/File:Guangzhou_West_Tower_20220603-01.jpg
 *   "Guangzhou Night.jpg", Yli584, CC0: night.
 *   https://commons.wikimedia.org/wiki/File:Guangzhou_Night.jpg
 * - No lidar, NAIP or Mapillary in Guangzhou (batch notes).
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 438.6 m top.
 * - Measured (OSM): the plan (corner bearings, ~35 m to the corners and
 *   ~24 m to the sides from the centroid; area 2,650 m2).
 * - Measured (photo, SE and SSE views): the widest point at about a
 *   quarter of the height; the rounded shoulder from ~355 m, narrowing to
 *   ~0.58 of the base at the roof edge (the 131-deg view's 0.72 is taken
 *   below the shoulder).
 * - Estimated: the bulge (+4 %), the diagrid (10 x 16 nodes, from the 2008
 *   photo), the member width (drawn bolder than the real tubes), the band
 *   heights, the parapet (6 m).
 * - Colours sampled from the 2016 and 2018 photos: glass #24629b / #3b628f
 *   -> #2f5f96 (deep saturated blue, as in the 131-deg photo); the diagrid
 *   #4d78a8, a shade lighter; bands #2a5384; trims #7d97b5.
 *
 * Doubts
 * - The real diagrid sits inside the glass; it is drawn as a faint relief
 *   just proud of it.
 * - The node count round the tower is read from one construction photo.
 *
 * Night: the glass glows as windows (offices and hotel are lit), the bands
 * too; the diagrid is lit along its nodes (`_FLOODLIGHT`, faintly).
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE, windowVariant } from './palette'
import { gridSurface } from './shanghai-tower'
import { saveLods, type Layer } from './auckland-sky-tower'
import { K, type P2 } from './taipei-101'

const ID = 'guangzhou-ifc'
const TOP = 438.6
const ROOF = 435.0 // the roof inside the parapet screen
const RM = 29.5, A = 0.18
const CORNER = (Math.PI / 180) * (90 - 45) // compass 45 deg as a math angle
const NODES = 10, LEVELS = 16

/** Plan scale against height: the bulge and the taper. */
const PROF: [number, number][] = [[0, 1.0], [60, 1.03], [120, 1.04], [190, 1.025], [250, 0.995], [310, 0.945], [355, 0.885], [390, 0.82], [412, 0.75], [428, 0.67], [TOP, 0.58]]
function scaleAt(z: number) {
  for (let k = 0; k < PROF.length - 1; k++) if (z <= PROF[k + 1][0]) {
    const [z0, s0] = PROF[k], [z1, s1] = PROF[k + 1], t = (z - z0) / (z1 - z0)
    const u = t * t * (3 - 2 * t) // smoothstep between the profile points, with slopes matched below
    return s0 + (s1 - s0) * (0.5 * t + 0.5 * u)
  }
  return PROF[PROF.length - 1][1]
}
const rAt = (phi: number, z: number) => RM * scaleAt(z) * (1 + A * Math.cos(3 * (phi - CORNER)))
const P = (phi: number, z: number, out = 0): V3 => {
  const r = rAt(phi, z) + out
  return [r * Math.cos(phi), r * Math.sin(phi), z]
}
/** Outward unit normal of the plan (horizontal) at phi, z. */
function nrmAt(phi: number, z: number): P2 {
  const e = 1e-3, a = P(phi - e, z), b = P(phi + e, z)
  const t = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(t[0], t[1])
  return [t[1] / l, -t[0] / l]
}

type Set = { glass: Part; band: Part; grid: Part; roof: Part; trim: Part }
const mk = (): Set => ({ glass: new Part(), band: new Part(), grid: new Part(), roof: new Part(), trim: new Part() })

function build(detail: boolean): Layer[] {
  const s = mk()
  const N = detail ? 80 : 30
  const dz = ROOF / LEVELS // ~27 m a node level (up to the roof)
  // ---- glass skin: rows at node levels (and in between for the detail), plus the parapet
  const zs: number[] = []
  const sub = detail ? 3 : 1
  for (let k = 0; k < LEVELS; k++) for (let q = 0; q < sub; q++) zs.push(k * dz + (q * dz) / sub)
  // extra rows over the rounded shoulder
  for (const z of detail ? [384, 396, 405, 414, 421, 427, 432] : [396, 414, 426]) zs.push(z)
  zs.sort((a, b) => a - b)
  zs.push(ROOF, TOP)
  const grid = zs.map((z) => Array.from({ length: N }, (_, i) => P((i / N) * Math.PI * 2, z)))
  gridSurface(grid, true, () => s.glass)
  // the parapet's inner face, the roof, and a rooftop plant box
  const ringAt = (z: number, out = 0) => Array.from({ length: N }, (_, i) => P((i / N) * Math.PI * 2, z, out))
  const inner = (z: number) => ringAt(z, -0.7)
  K.loft(s.glass, [...inner(TOP)].reverse(), [...inner(ROOF)].reverse())
  K.loft(s.trim, ringAt(TOP), inner(TOP))
  K.cap(s.roof, inner(ROOF).map((v) => [v[0], v[1]] as P2), ROOF, true)
  K.prism(s.roof, K.circle(0, 0, 9, detail ? 16 : 10), ROOF, ROOF + 3.5)

  // ---- dark bands at every second node level
  for (let k = 2; k < LEVELS; k += 2) {
    const z = k * dz
    bandRing(s.band, z - 1.2, z + 1.2, N, 0.2)
  }
  // a pale band at the foot of the parapet and at the lobby top
  bandRing(s.trim, ROOF - 0.8, ROOF + 0.4, N, 0.5)
  bandRing(s.trim, 11.0, 12.4, N, 0.5)

  // ---- the diagrid: members between the nodes, standing just proud of the glass
  const w = detail ? 1.1 : 1.6, d = detail ? 0.35 : 0.6
  // the low model draws every other node level (taller diamonds, half the members); the detail model all of them
  const L = detail ? LEVELS : LEVELS / 2, dzm = ROOF / L
  const segs = detail ? 3 : 1
  const node = (i: number, k: number) => ({ phi: ((i + (k % 2) * 0.5) / NODES) * Math.PI * 2, z: Math.min(k * dzm, ROOF - 1) })
  for (let k = 0; k < L; k++) {
    for (let i = 0; i < NODES; i++) {
      const a = node(i, k)
      for (const di of [0, 1]) {
        // to the two nodes above: offset half a bay either way
        const b = node(i + (k % 2 === 0 ? di - 1 : di), k + 1)
        let pb = b.phi
        while (pb - a.phi > Math.PI) pb -= Math.PI * 2
        while (a.phi - pb > Math.PI) pb += Math.PI * 2
        member(s.grid, a.phi, a.z, pb, b.z, w, d, segs)
      }
    }
  }

  return [
    { part: s.glass, material: windowVariant(2, 0x2f5f96) },
    { part: s.band, material: windowVariant(3, 0x2a5384) },
    { part: s.grid, material: { ...finish('ifc-diagrid', 0x4d78a8), floodlight: () => 0.15 } },
    { part: s.trim, material: finish('ifc-trim', 0x7d97b5) },
    { part: s.roof, material: PALETTE.roof },
  ]
}

/** A band hugging the skin from z0 to z1, `out` proud: outer face, top and soffit. */
function bandRing(p: Part, z0: number, z1: number, N: number, out: number) {
  const ring = (z: number, o: number) => Array.from({ length: N }, (_, i) => P((i / N) * Math.PI * 2, z, o))
  K.loft(p, ring(z0, out), ring(z1, out))
  if (N > 40) K.loft(p, ring(z1, out), ring(z1, -0.05))
  if (N > 40) K.loft(p, ring(z0, -0.05), ring(z0, out))
}

/** A diagrid member from (phi0, z0) to (phi1, z1) on the skin: outer face and two sides, in `segs` pieces. */
function member(p: Part, phi0: number, z0: number, phi1: number, z1: number, w: number, d: number, segs: number) {
  const pts: { c: V3; n: P2 }[] = []
  for (let q = 0; q <= segs; q++) {
    const t = q / segs, phi = phi0 + (phi1 - phi0) * t, z = z0 + (z1 - z0) * t
    pts.push({ c: P(phi, z, -0.1), n: nrmAt(phi, z) })
  }
  for (let q = 0; q < segs; q++) {
    const A0 = pts[q], B0 = pts[q + 1]
    const dir: V3 = [B0.c[0] - A0.c[0], B0.c[1] - A0.c[1], B0.c[2] - A0.c[2]]
    const sec = (X: { c: V3; n: P2 }) => {
      const n: V3 = [X.n[0], X.n[1], 0]
      // side vector: across the member, in the skin's tangent plane
      let sx = dir[1] * n[2] - dir[2] * n[1], sy = dir[2] * n[0] - dir[0] * n[2], sz = dir[0] * n[1] - dir[1] * n[0]
      const l = Math.hypot(sx, sy, sz) || 1
      sx /= l; sy /= l; sz /= l
      const o = (u: number, v: number): V3 => [X.c[0] + sx * u + n[0] * v, X.c[1] + sy * u + n[1] * v, Math.max(0, X.c[2] + sz * u)]
      return { l0: o(-w / 2, 0), r0: o(w / 2, 0), l1: o(-w / 2, d + 0.1), r1: o(w / 2, d + 0.1), n }
    }
    const a = sec(A0), b = sec(B0)
    const quad = (q0: V3, q1: V3, q2: V3, q3: V3, ref: V3) => {
      // wind so the face points along `ref`
      const e1: V3 = [q1[0] - q0[0], q1[1] - q0[1], q1[2] - q0[2]], e2: V3 = [q2[0] - q0[0], q2[1] - q0[1], q2[2] - q0[2]]
      const g: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
      if (g[0] * ref[0] + g[1] * ref[1] + g[2] * ref[2] >= 0) p.quad(q0, q1, q2, q3)
      else p.quad(q0, q3, q2, q1)
    }
    quad(a.l1, a.r1, b.r1, b.l1, a.n) // outer face
    const side: V3 = [a.r0[0] - a.l0[0], a.r0[1] - a.l0[1], a.r0[2] - a.l0[2]]
    quad(a.r0, b.r0, b.r1, a.r1, side)
    quad(a.l0, a.l1, b.l1, b.l0, [-side[0], -side[1], -side[2]])
  }
}

if (import.meta.main) {
  await saveLods(ID, 'Guangzhou International Finance Center', build(false), build(true), {
    frame: 'Y up, -Z north, +X east, metres; origin at the area centroid of way/184738716, on the plaza',
    bearing: 0, height: TOP, anchor: [23.120273, 113.3179],
  }, 6500)
}
