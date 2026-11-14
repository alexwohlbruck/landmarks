/**
 * St. Vitus Cathedral, Prague (Metropolitní katedrála svatého Víta, Václava
 * a Vojtěcha) — procedural, CC0-1.0, no textures.
 * bun generators/prague-st-vitus-cathedral.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/prague-st-vitus-cathedral.glb, the low model (≤ 6,500 triangles):
 *   every mass, both towers and their spires, the flying buttresses as solid
 *   webs with their piers and pinnacles, the roofs, rose and big windows.
 * - models/prague-st-vitus-cathedral.detail.glb (≤ 40,000 triangles), drawn
 *   from zoom 17: the same model with openwork flying buttresses (coping,
 *   arch rib and struts, two tiers on the choir), crocketed pinnacles,
 *   mullions and head tracery in every window, the rose's spokes and
 *   petals, pierced balustrades, the archivolts of the portals, the Golden
 *   Gate's grille, and crockets on the west spires. All of it is real 3D.
 *
 * This file also exports the small Gothic kit (tf/qf, prism, lathe, plane
 * frames, lancet, rose, flyer, pinnacle, railing, hip roofs) that
 * prague-tyn-church.ts imports; merge this one first. The cathedral itself
 * is built only under `import.meta.main`.
 *
 * Frame: built turned to the church's axis. The nave and choir walls run at
 * 69.4° (OSM, the clerestory ends of the twenty flying buttresses), so the
 * placement bearing is 339.4: +x is the axis towards the altar (ENE), +y
 * liturgical north (NNW), z up, metres. Origin = area centroid of the OSM
 * outline way/1568419039 (lng 14.4005639, lat 50.0908594). The central
 * vessel's axis runs at y = 1.65 in this frame.
 *
 * Evidence
 * - OSM way/1568419039 (building=cathedral) and its 134 building:parts
 *   (source cuzk:ruian, mapped in great detail): the clerestory vessel
 *   way/565398669 (nave) and way/565398673 (choir and apse), 55 m to the
 *   ridge; transept way/279536188 (55); the crossing flèche way/243800050
 *   (51–80); the Great South Tower way/1568419065 (base block, 45),
 *   way/462765679 (tower core with its corner buttresses, 62),
 *   way/462765680 (dome 62–65), way/462765681 (cap, 99) and its four corner
 *   turrets way/462765675–678 (72); the west towers way/279535799 and
 *   way/279535800 (40), their octagons way/762259526/534 (60) and
 *   way/762259530/524 (65), spires way/762259522/523 (85) and corner
 *   pinnacles way/762259525…535 (40–55); the chapel and aisle bodies
 *   way/901132773, way/901190409, way/896479228 (15); the 23 chapel roofs
 *   way/532171881…909 (22, hipped); and each of the twenty flying-buttress
 *   sets as four parts: outer pinnacle (25), lower flyer (20–25), middle
 *   pier pinnacle (40) and upper flyer (25–38) (way/895259329…,
 *   way/901093470…, way/901132774…, way/901190401…). The pier and flyer
 *   positions below are those parts' centroids in this frame.
 * - Published: cs.wikipedia "Katedrála svatého Víta, Václava a Vojtěcha":
 *   the Great South Tower 96.6 m, Gothic to 55 m where the Renaissance
 *   gallery and the Baroque cap begin; en.wikipedia "St. Vitus Cathedral":
 *   124 × 60 m, main tower 102.8 m, west towers 82 m, vault 33 m. The tower
 *   is built to 99 m to the vane (OSM 99, between the two published
 *   figures); the west spires to the published 82 m (OSM 85).
 * - Mapterhorn terrain (z14, bearing 339.4): flat within 0.8 m across the
 *   whole footprint (the third courtyard and Vikářská street); the ground
 *   drops away only beyond y = +40, into the Stag Moat. Elevation 0.
 * - Commons daylight photos (EVIDENCE):
 *   "St Vitus Prague September 2016-30b.jpg" (Alvesgaspar, CC BY-SA 4.0,
 *     the south front square-on: tower, Golden Gate, transept window, the
 *     main photo for heights and the tower cap's profile),
 *   "St Vitus Prague September 2016-21.jpg" (Alvesgaspar, CC BY-SA 4.0,
 *     south-west three-quarter from the third courtyard),
 *   "St Vitus Prague September 2016-27.jpg" (Alvesgaspar, CC BY-SA 4.0,
 *     the west spires and the gable between them),
 *   "St Vitus Prague September 2016-5.jpg" (Alvesgaspar, CC BY-SA 4.0, the
 *     apse: two-tier flyers, pinnacles, the copper chapel pyramids),
 *   "PragueCathedral03.jpg" (MathKnight and Zachi Evenor, CC BY 2.5, the
 *     south side from above: roofs, flyers, the cap and the flèche),
 *   "Prag, Prager Burg, Veitsdom -- 2019 -- 6621.jpg" (Dietmar Rabich,
 *     CC BY-SA 4.0, the north side from the Powder Bridge),
 *   "Prag, Prager Burg, Veitsdom -- 2019 -- 6625.jpg" and "-- 6662.jpg"
 *     (Dietmar Rabich, CC BY-SA 4.0, the west front and the apse),
 *   "St. Vitus Cathedral – roof and spires over Hradčany from the Great
 *     South Tower.jpg" (Punteador, CC BY-SA 4.0, the roof from above),
 *   "St. Vitus Cathedral in Prague 2016.jpg" (JohnCayne, CC BY 4.0, the apse
 *     floodlit at night).
 *
 * Estimated from the photos (scaled to the published heights): chapel and
 * aisle walls 15 m with a pierced balustrade; chapel roofs 15–22 (OSM);
 * clerestory eaves 39, ridge 54 (OSM 55; PragueCathedral03 puts the ridge
 * just under the tower gallery, the transept hip measures about 65°);
 * clerestory windows 21–37; flyers: upper tier from 34.5–38 at the wall to
 * 28–32.5 at the middle pier (a second tier below it round the apse, as in
 * the -5 photo), the outer flyer 22.5–25.5 down to 18–21.5 at the outer
 * pier; middle pier pinnacles to 44 and wall pinnacles to 45.5, a few metres
 * above the eaves as in every photo (OSM 40), outer pinnacles to 26.5.
 * South tower: base block (OSM 45) flush with the porch, pale to the
 * balustrade at 22, with the golden grille window 24–36.5 and the clock at
 * 40.8; core with diagonal corner buttresses 45–56, belfry lancets 46–53.5;
 * gallery 56–63.6 in paler stone with projecting corner pavilions and three
 * arched openings a face; cornice 64.5. Cap profile read off
 * PragueCathedral03 and scaled to 64.5–99: bell with four dormers to 71.8,
 * open lantern to 77.6, second bell to 82.3, small lantern to 86.3, needle
 * to 94.8, gilt ball and vane to 99; corner turrets (wide onion, neck,
 * small onion, gilt ball) to 72.2 (OSM 72). West towers: square body with
 * corner buttresses to 40, octagon 40–61.7 (OSM 60/65), spire foot 61.7–64,
 * spire to 83 and cross to 84.6 (published 82, OSM 85; PragueCathedral03
 * puts the tips about 22 m above the south tower's gallery cornice), corner
 * pinnacles 40–61. West front: portals to 12.5, gallery 22–23, rose 10.7 m
 * across at 29.8, gable 39–54.6. Golden Gate: three pointed arches 0–9.8 on
 * four piers, the Last Judgement mosaic 10.9–16.6 (gold), the transept
 * window above 18.6–37.6, its gable screen to 45.5. Colours from the
 * photos: soot-dark charcoal-brown sandstone over the whole church (kept
 * dark, as it reads in every photo, so the copper and gilt stand out), the
 * paler stone only on the tower's Renaissance gallery and the portals' trim; grey patterned roofs; pale verdigris copper on the
 * tower cap, flèche and chapel pyramids; gilt on the Golden Gate.
 *
 * Doubts: the gallery and cap heights rest on the cs.wikipedia "55 m" and
 * OSM (62–65 for the gallery top and dome); the south photo, scaled linearly
 * from the 99 m top, puts the gallery about 5 m higher. The north transept
 * front is seen only at an angle (6621). The roof's diamond pattern and the
 * mosaic's figures are colour, not modelled. The west spires are openwork
 * in reality; here they are solid with 3D crockets and bands. Sculpture
 * (portal figures, gargoyles) is left out.
 *
 * Night: the stone is floodlit (JohnCayne's night photo shows the whole
 * east end washed gold); up-facing tops less so. Windows glow.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { earcut } from './dc-national-cathedral'

// ===========================================================================
// Kit

export type XY = [number, number]
export type P2 = [number, number]

export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const add = (a: V3, b: V3, s = 1): V3 => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s]
export const cen = (...p: V3[]): V3 => [p.reduce((s, q) => s + q[0], 0) / p.length, p.reduce((s, q) => s + q[1], 0) / p.length, p.reduce((s, q) => s + q[2], 0) / p.length]
export const unit2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/** A triangle wound to face `hint`. */
export function tf(p: Part, a: V3, b: V3, c: V3, hint: V3) {
  const g = cross(sub(b, a), sub(c, a))
  if (Math.hypot(g[0], g[1], g[2]) < 1e-10) return
  if (dot(g, hint) < 0) p.tri(a, c, b)
  else p.tri(a, b, c)
}
/** A quad wound to face `hint`. */
export function qf(p: Part, a: V3, b: V3, c: V3, d: V3, hint: V3) {
  tf(p, a, b, c, hint)
  tf(p, a, c, d, hint)
}

const area2 = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
export const centroid = (r: XY[]): XY => [r.reduce((s, q) => s + q[0], 0) / r.length, r.reduce((s, q) => s + q[1], 0) / r.length]

type PartFor = Part | ((n: V3, z0: number, z1: number) => Part)
const pick = (p: PartFor, n: V3, z0: number, z1: number) => (typeof p === 'function' ? p(n, z0, z1) : p)

/** Vertical walls round a ring (either winding), with optional caps. */
export function prism(p: PartFor, ring: XY[], z0: number, z1: number, top = true, bot = false, skip?: (a: XY, b: XY) => boolean) {
  const s = area2(ring) > 0 ? 1 : -1
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-6 || skip?.(a, b)) continue
    const n: V3 = [s * (b[1] - a[1]), -s * (b[0] - a[0]), 0]
    qf(pick(p, n, z0, z1), [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], n)
  }
  const caps: [number, V3][] = []
  if (top) caps.push([z1, [0, 0, 1]])
  if (bot) caps.push([z0, [0, 0, -1]])
  for (const [z, n] of caps) {
    const pp = pick(p, n, z, z)
    for (const [i, j, k] of earcut(ring)) tf(pp, [ring[i][0], ring[i][1], z], [ring[j][0], ring[j][1], z], [ring[k][0], ring[k][1], z], n)
  }
}

export function obox(p: PartFor, c: XY, u: XY, hu: number, hv: number, z0: number, z1: number, top = true, bot = false) {
  const v: XY = [-u[1], u[0]]
  const ring = ([[-1, -1], [1, -1], [1, 1], [-1, 1]] as XY[]).map(([s, t]) => [c[0] + u[0] * hu * s + v[0] * hv * t, c[1] + u[1] * hu * s + v[1] * hv * t] as XY)
  prism(p, ring, z0, z1, top, bot)
}
export function box(p: PartFor, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top = true, bot = false) {
  obox(p, [(x0 + x1) / 2, (y0 + y1) / 2], [1, 0], (x1 - x0) / 2, (y1 - y0) / 2, z0, z1, top, bot)
}
/** A thin wall or rail along a plan edge, t thick. */
export function ebox(p: PartFor, a: XY, b: XY, t: number, z0: number, z1: number, top = true) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 1e-6) return
  obox(p, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], [(b[0] - a[0]) / L, (b[1] - a[1]) / L], L / 2, t / 2, z0, z1, top)
}

/** A surface of revolution through (r, z) points; r = 0 ends close it. */
export function lathe(p: Part, cx: number, cy: number, prof: [number, number][], n: number, rot = 0, smooth = false) {
  if (smooth) return latheSmooth(p, cx, cy, prof, n, rot)
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const dr = r1 - r0, dz = z1 - z0
    if (Math.abs(dr) < 1e-9 && Math.abs(dz) < 1e-9) continue
    for (let i = 0; i < n; i++) {
      const t0 = rot + (2 * Math.PI * i) / n, t1 = rot + (2 * Math.PI * (i + 1)) / n, tm = (t0 + t1) / 2
      const P = (r: number, t: number, z: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
      const a = P(r0, t0, z0), b = P(r0, t1, z0), c = P(r1, t1, z1), d = P(r1, t0, z1)
      const h: V3 = [Math.cos(tm) * dz, Math.sin(tm) * dz, -dr]
      if (r0 < 1e-6) tf(p, a, c, d, h)
      else if (r1 < 1e-6) tf(p, a, b, c, h)
      else qf(p, a, b, c, d, h)
    }
  }
}

/** A lathe with smooth normals (shared vertices): bells, onions, balls. */
function latheSmooth(p: Part, cx: number, cy: number, prof: [number, number][], n: number, rot: number) {
  const segN = prof.slice(0, -1).map(([r0, z0], k) => {
    const [r1, z1] = prof[k + 1], dz = z1 - z0, dr = r1 - r0, l = Math.hypot(dz, dr) || 1
    return [dz / l, -dr / l] as [number, number]
  })
  const ptN = prof.map((_, k) => {
    const a = segN[Math.max(0, k - 1)], b = segN[Math.min(segN.length - 1, k)]
    const r = a[0] + b[0], z = a[1] + b[1], l = Math.hypot(r, z) || 1
    return [r / l, z / l] as [number, number]
  })
  const uv = [0, 0]
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    if (Math.abs(r1 - r0) < 1e-9 && Math.abs(z1 - z0) < 1e-9) continue
    for (let i = 0; i < n; i++) {
      const t0 = rot + (2 * Math.PI * i) / n, t1 = rot + (2 * Math.PI * (i + 1)) / n
      const P = (r: number, t: number, z: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
      const Nm = (q: number, t: number): V3 => [Math.cos(t) * ptN[q][0], Math.sin(t) * ptN[q][0], ptN[q][1]]
      const a = P(r0, t0, z0), b = P(r0, t1, z0), c = P(r1, t1, z1), d = P(r1, t0, z1)
      if (r0 > 1e-6) p.tri(a, b, c, uv, uv, uv, [Nm(k, t0), Nm(k, t1), Nm(k + 1, t1)])
      if (r1 > 1e-6) p.tri(a, c, d, uv, uv, uv, [Nm(k, t0), Nm(k + 1, t1), Nm(k + 1, t0)])
      else if (r0 > 1e-6) {} // apex: the first triangle already closes it
    }
  }
}

/** Faces along a run of 4-corner sections (convex), with end caps. */
export function sweep4(p: Part, secs: V3[][], caps = true, skipFace = -1) {
  const sc = secs.map((s) => cen(...s))
  for (let i = 0; i < secs.length - 1; i++) {
    const m = cen(sc[i], sc[i + 1])
    for (let j = 0; j < 4; j++) {
      if (j === skipFace) continue
      const A = secs[i][j], B = secs[i][(j + 1) % 4], C = secs[i + 1][(j + 1) % 4], D = secs[i + 1][j]
      qf(p, A, B, C, D, sub(cen(A, B, C, D), m))
    }
  }
  if (caps) {
    const L = secs.length - 1
    qf(p, secs[0][0], secs[0][1], secs[0][2], secs[0][3], sub(sc[0], sc[1]))
    qf(p, secs[L][0], secs[L][1], secs[L][2], secs[L][3], sub(sc[L], sc[L - 1]))
  }
}

/** A square bar between two points, w across (horizontal) and t deep. */
export function bar(p: Part, A: V3, B: V3, w: number, t: number) {
  const ax = sub(B, A), l = Math.hypot(ax[0], ax[1], ax[2]) || 1
  const d: V3 = [ax[0] / l, ax[1] / l, ax[2] / l]
  let s = cross(d, [0, 0, 1])
  if (Math.hypot(s[0], s[1], s[2]) < 1e-6) s = [1, 0, 0]
  const sl = Math.hypot(s[0], s[1], s[2]); s = [s[0] / sl, s[1] / sl, s[2] / sl]
  const up = cross(s, d)
  const sec = (C: V3) => [add(add(C, s, w / 2), up, t / 2), add(add(C, s, -w / 2), up, t / 2), add(add(C, s, -w / 2), up, -t / 2), add(add(C, s, w / 2), up, -t / 2)]
  sweep4(p, [sec(A), sec(B)])
}

/** A vertical plane on a wall: u along it (to the viewer's right), n out. */
export type PF = { o: V3; u: V3; n: V3 }
export const pf = (o: XY, u: XY, n: XY, z = 0): PF => ({ o: [o[0], o[1], z], u: [u[0], u[1], 0], n: [n[0], n[1], 0] })
export const at = (F: PF, a: number, z: number, d = 0): V3 => [F.o[0] + F.u[0] * a + F.n[0] * d, F.o[1] + F.u[1] * a + F.n[1] * d, F.o[2] + z]

/** A flat convex polygon on a plane, d off it, facing out. */
export function fanPlane(p: Part, F: PF, pts: P2[], d = 0.04) {
  for (let i = 1; i < pts.length - 1; i++) tf(p, at(F, ...pts[0], d), at(F, ...pts[i], d), at(F, ...pts[i + 1], d), F.n)
}

/** A rectangular moulding along a path on a plane, hw half-width, from d0 to d1 off it. */
export function tubePath(p: Part, F: PF, pts: P2[], hw: number, d0: number, d1: number, closed = false, back = false, caps = true) {
  const N = pts.length
  const secs = pts.map((q, i) => {
    const a = pts[closed ? (i - 1 + N) % N : Math.max(0, i - 1)], b = pts[closed ? (i + 1) % N : Math.min(N - 1, i + 1)]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    const m: P2 = [-(b[1] - a[1]) / l, (b[0] - a[0]) / l]
    return [at(F, q[0] + m[0] * hw, q[1] + m[1] * hw, d1), at(F, q[0] - m[0] * hw, q[1] - m[1] * hw, d1), at(F, q[0] - m[0] * hw, q[1] - m[1] * hw, d0), at(F, q[0] + m[0] * hw, q[1] + m[1] * hw, d0)]
  })
  if (closed) secs.push(secs[0])
  sweep4(p, secs, !closed && caps, back ? -1 : 2)
}

/** A pointed (drop or equilateral) arch from (a0, zs) over to (a1, zs); k = radius / span. */
export function archPts(a0: number, a1: number, zs: number, k = 0.8, seg = 4): P2[] {
  const w = a1 - a0, r = Math.max(0.5, k) * w
  const ta = Math.acos(Math.min(1, (w / 2 - r) / r))
  const left: P2[] = []
  for (let i = 0; i <= seg; i++) {
    const t = Math.PI + (ta - Math.PI) * (i / seg)
    left.push([a0 + r + r * Math.cos(t), zs + r * Math.sin(t)])
  }
  const right = left.slice(0, -1).reverse().map(([a, z]) => [a0 + a1 - a, z] as P2)
  return [...left, ...right]
}
export const archRise = (w: number, k = 0.8) => { const r = Math.max(0.5, k) * w; return Math.sqrt(r * r - (r - w / 2) ** 2) }

export const circlePts = (ac: number, zc: number, r: number, n: number, rot = 0): P2[] =>
  Array.from({ length: n }, (_, i) => [ac + r * Math.cos(rot + (2 * Math.PI * i) / n), zc + r * Math.sin(rot + (2 * Math.PI * i) / n)] as P2)

export type LancetOpts = { k?: number; lights?: number; frame?: number; depth?: number; detail?: boolean; seg?: number; transom?: number; tracery?: boolean }
/**
 * A Gothic window: glass panel, and in 3D a moulded frame round it, with
 * mullions, sub-arches and a roundel in the head when `detail`.
 */
export function lancet(win: Part, fr: Part | null, F: PF, a0: number, a1: number, z0: number, z1: number, o: LancetOpts = {}) {
  const k = o.k ?? 0.8, w = a1 - a0, h = Math.min(archRise(w, k), z1 - z0), zs = z1 - h
  const arch = archPts(a0, a1, zs, k, o.seg ?? (o.detail ? 4 : 2))
  fanPlane(win, F, [[a0, z0], ...arch, [a1, z0]], 0.04)
  if (!fr) return
  const fw = o.frame ?? 0.22, fd = o.depth ?? 0.35
  tubePath(fr, F, [[a0, z0], ...arch, [a1, z0]], fw, 0, fd)
  if (!o.detail || o.tracery === false) tubePath(fr, F, [[a0 - fw, z0 - 0.15], [a1 + fw, z0 - 0.15]], 0.18, 0, fd + 0.1)
  if (!o.detail) return
  const n = o.lights ?? (w > 6 ? 4 : w > 2.6 ? 2 : 1)
  if (n > 1) {
    const sub = (w - 0.0) / n
    for (let i = 1; i < n; i++) tubePath(fr, F, [[a0 + sub * i, z0], [a0 + sub * i, zs]], 0.09, 0, fd * 0.8, false, false, false)
    if (o.tracery !== false) {
      for (let i = 0; i < n; i++) tubePath(fr, F, archPts(a0 + sub * i, a0 + sub * (i + 1), zs, 0.8, 2), 0.08, 0, fd * 0.8, false, false, false)
      const rr = Math.min(w * 0.24, h * 0.3)
      if (rr > 0.35 && w > 4) tubePath(fr, F, circlePts((a0 + a1) / 2, zs + h * 0.48, rr, 8), 0.08, 0, fd * 0.8, true)
    }
  }
  if (o.transom) tubePath(fr, F, [[a0, o.transom], [a1, o.transom]], 0.1, 0, fd * 0.8, false, false, false)
}

/** A rose window: glass disc, a ring frame, and in detail spokes and petals. */
export function rose(win: Part, fr: Part, F: PF, ac: number, zc: number, R: number, detail: boolean) {
  const n = detail ? 24 : 12
  fanPlane(win, F, circlePts(ac, zc, R, n), 0.04)
  tubePath(fr, F, circlePts(ac, zc, R + 0.25, n), 0.35, 0, 0.6, true)
  if (!detail) return
  tubePath(fr, F, circlePts(ac, zc, R * 0.32, 12), 0.12, 0, 0.45, true)
  for (let i = 0; i < 12; i++) {
    const t = (2 * Math.PI * i) / 12
    tubePath(fr, F, [[ac + R * 0.32 * Math.cos(t), zc + R * 0.32 * Math.sin(t)], [ac + R * Math.cos(t), zc + R * Math.sin(t)]], 0.08, 0, 0.42, false, false, false)
    const tm = t + Math.PI / 12
    tubePath(fr, F, circlePts(ac + R * 0.68 * Math.cos(tm), zc + R * 0.68 * Math.sin(tm), R * 0.17, 8), 0.06, 0, 0.36, true)
  }
}

/**
 * A flying buttress from the wall (A, high) down to a pier (B): a straight
 * coping on top and an arch underneath rising from the pier. Solid in the
 * low model; in detail an open web of coping, rib and struts.
 */
export function flyer(p: Part, A: XY, B: XY, topA: number, topB: number, botA: number, botB: number, w: number, open: boolean, segs = 3) {
  const d = unit2([A[0] - B[0], A[1] - B[1]]), v: XY = [-d[1], d[0]]
  const plan = (s: number): XY => [B[0] + (A[0] - B[0]) * s, B[1] + (A[1] - B[1]) * s]
  const top = (s: number) => topB + (topA - topB) * s
  const bot = (s: number) => botB + (botA - botB) * Math.sin((s * Math.PI) / 2)
  const sec = (s: number, zt: number, zb: number, hw = w / 2): V3[] => {
    const q = plan(s)
    return [[q[0] + v[0] * hw, q[1] + v[1] * hw, zt], [q[0] - v[0] * hw, q[1] - v[1] * hw, zt], [q[0] - v[0] * hw, q[1] - v[1] * hw, zb], [q[0] + v[0] * hw, q[1] + v[1] * hw, zb]]
  }
  const N = open ? 6 : segs
  const ss = Array.from({ length: N + 1 }, (_, i) => i / N)
  if (!open) {
    sweep4(p, ss.map((s) => sec(s, top(s), bot(s))), false)
    return
  }
  const ct = 0.5, rt = 0.45
  sweep4(p, [0, 1].map((s) => sec(s, top(s), top(s) - ct)))
  sweep4(p, ss.map((s) => sec(s, bot(s) + rt, bot(s), w / 2 * 0.9)))
  const M = 3
  for (let k = 1; k <= M; k++) {
    const s = k / (M + 1)
    const z0 = bot(s) + rt, z1 = top(s) - ct
    if (z1 - z0 < 0.3) continue
    const q = plan(s)
    obox(p, q, d, 0.12, w * 0.32, z0, z1, false, false)
  }
}

/** A pinnacle: a shaft and a spirelet, with crockets and a finial in detail. */
export function pinnacle(p: Part, c: XY, u: XY, hu: number, hv: number, z0: number, z1: number, tip: number, detail: boolean) {
  obox(p, c, u, hu, hv, z0, z1, false)
  const v: XY = [-u[1], u[0]]
  const cs = ([[-1, -1], [1, -1], [1, 1], [-1, 1]] as XY[]).map(([s, t]) => [c[0] + u[0] * hu * s + v[0] * hv * t, c[1] + u[1] * hu * s + v[1] * hv * t] as XY)
  const T: V3 = [c[0], c[1], tip]
  for (let i = 0; i < 4; i++) {
    const a = cs[i], b = cs[(i + 1) % 4]
    const m: XY = [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1]]
    tf(p, [a[0], a[1], z1], [b[0], b[1], z1], T, [m[0], m[1], 0.3])
  }
  if (!detail || tip - z1 < 4) return
  const r = Math.max(0.12, Math.min(hu, hv) * 0.4)
  for (let i = 0; i < 4; i++) {
    const q = cs[i], dg = unit2([q[0] - c[0], q[1] - c[1]])
    for (const f of [0.45]) {
      const pp: XY = [q[0] + (c[0] - q[0]) * f + dg[0] * r * 0.8, q[1] + (c[1] - q[1]) * f + dg[1] * r * 0.8]
      const z = z1 + (tip - z1) * f
      obox(p, pp, dg, r, r * 0.7, z - r * 0.8, z + r * 0.5, true, false)
    }
  }
  obox(p, c, u, r * 2.2, r * 0.6, tip - 0.2 - r * 1.2, tip - 0.2 - r * 0.2, true, true)
  obox(p, c, v, r * 2.2, r * 0.6, tip - 0.2 - r * 1.2, tip - 0.2 - r * 0.2, true, true)
}

/** A balustrade along an open polyline: pierced (rail and posts) or solid. */
export function railing(p: Part, pts: XY[], z: number, h: number, t: number, pierced: boolean, gap = 1.1) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.05) continue
    if (!pierced) { ebox(p, a, b, t, z, z + h); continue }
    ebox(p, a, b, t, z + h - 0.28, z + h)
    const n = Math.max(1, Math.round(L / gap))
    const d = unit2([b[0] - a[0], b[1] - a[1]])
    for (let k = 0; k < n; k++) {
      const s = (k + 0.5) / n
      obox(p, [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s], d, 0.1, t * 0.4, z, z + h - 0.28, false)
    }
  }
}

/** A hipped roof from an eave ring up to a ridge (one point: a pyramid). */
export function hipRoof(p: Part, ring: XY[], ze: number, ridge: XY[], zr: number) {
  const s = area2(ring) > 0 ? 1 : -1
  const near = (q: XY) => ridge.reduce((best, t) => (Math.hypot(t[0] - q[0], t[1] - q[1]) < Math.hypot(best[0] - q[0], best[1] - q[1]) ? t : best))
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const h: V3 = [s * (b[1] - a[1]), -s * (b[0] - a[0]), Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.5]
    const ta = near(a), tb = near(b)
    if (ta === tb) tf(p, [a[0], a[1], ze], [b[0], b[1], ze], [ta[0], ta[1], zr], h)
    else qf(p, [a[0], a[1], ze], [b[0], b[1], ze], [tb[0], tb[1], zr], [ta[0], ta[1], zr], h)
  }
}

/** A hipped roof on a quad, ridge along its long axis at equal pitch. */
export function quadHip(p: Part, ring: XY[], ze: number, zr: number) {
  const c = centroid(ring)
  if (ring.length !== 4) { hipRoof(p, ring, ze, [c], zr); return }
  const e = (i: number) => Math.hypot(ring[(i + 1) % 4][0] - ring[i][0], ring[(i + 1) % 4][1] - ring[i][1])
  const i0 = e(0) + e(2) > e(1) + e(3) ? 0 : 1
  const L = (e(i0) + e(i0 + 2)) / 2, S = (e(i0 + 1) + e((i0 + 3) % 4)) / 2
  const d = unit2([ring[i0 + 1][0] - ring[i0][0], ring[i0 + 1][1] - ring[i0][1]])
  const half = Math.max(0, (L - S) / 2)
  if (half < 0.3) { hipRoof(p, ring, ze, [c], zr); return }
  hipRoof(p, ring, ze, [[c[0] - d[0] * half, c[1] - d[1] * half], [c[0] + d[0] * half, c[1] + d[1] * half]], zr)
}

export function insidePoly(q: XY, r: XY[]) {
  let n = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j]
    if ((yi > q[1]) !== (yj > q[1]) && q[0] < xi + ((q[1] - yi) * (xj - xi)) / (yj - yi)) n = !n
  }
  return n
}

export async function writeModel(file: string, title: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number, extras: Record<string, unknown>) {
  const used = parts.filter(({ part }) => part.triangles)
  const triangles = used.reduce((t, { part }) => t + part.triangles, 0)
  if (used.length > 6) throw new Error(`${file}: ${used.length} materials`)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(title, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', ...extras })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

/** Floodlit stone: walls lit, tops dimmer. */
export const stoneLight = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.85)

// ===========================================================================
// The cathedral

const AX = 1.65, HW = 5.85, YS = AX - HW, YN = AX + HW
const X_WEST = -60.05, X_APSE = 44.7
const LOW = 15, EAVE = 39, RIDGE = 54

/** Chapel and aisle bodies (OSM building:parts, 15 m), in this frame. */
const CHOIR_RING: XY[] = [[5.7,7.4],[44.6,7.1],[48.1,5.5],[50.0,2.2],[49.2,-0.9],[48.0,-2.6],[44.7,-3.8],[5.8,-3.9],[5.8,-25.9],[15.1,-25.3],[15.2,-21.5],[20.2,-21.6],[22.3,-21.1],[22.8,-19.2],[33.6,-19.9],[40.3,-19.6],[43.4,-18.8],[43.6,-17.9],[47.8,-18.7],[50.5,-17.8],[52.6,-15.3],[54.7,-14.8],[54.5,-13.8],[57.7,-12.4],[59.9,-10.0],[59.6,-6.3],[60.7,-5.8],[61.2,-4.6],[60.7,-3.9],[62.8,-1.1],[62.8,2.7],[60.5,5.2],[61.5,6.0],[61.1,7.2],[59.6,7.8],[60.1,11.2],[57.9,13.9],[54.3,15.0],[54.9,16.4],[53.8,17.1],[52.8,16.0],[50.6,19.5],[47.4,21.1],[44.7,19.6],[43.8,19.6],[43.5,21.3],[30.4,22.9],[15.1,23.4],[13.1,24.5],[6.6,23.9],[5.7,23.5]]
const NAVE_S: XY[] = [[-47.9,-4.2],[-48.0,-18.4],[-26.6,-18.8],[-26.8,-6.4],[-27.3,-4.2]]
const NAVE_N: XY[] = [[-25.4,22.7],[-27.2,21.4],[-46.3,21.9],[-50.3,16.8],[-50.3,7.5],[-5.6,7.5],[-5.7,23.4]]
/** The 23 chapel roofs (OSM, 15–22, hipped). */
const CHAPEL_ROOFS: XY[][] = [[[30.5,7.9],[35.9,7.8],[35.9,21.2],[30.4,21.3]],[[-27.0,-6.4],[-31.9,-6.3],[-32.1,-18.0],[-26.9,-18.0]],[[37.4,7.9],[43.0,7.8],[43.1,21.0],[37.4,21.2]],[[-19.7,21.5],[-24.9,21.6],[-25.1,8.3],[-19.9,8.2]],[[22.8,-18.5],[27.9,-18.5],[28.0,-4.6],[22.8,-4.5]],[[49.0,6.7],[51.2,4.0],[58.7,7.8],[59.9,10.9],[57.7,13.6],[54.8,14.3]],[[13.6,-4.6],[6.6,-5.0],[6.8,-25.2],[13.6,-25.1]],[[51.1,-2.1],[49.2,-4.0],[54.1,-12.3],[58.1,-11.9],[59.3,-9.7],[59.3,-5.5]],[[-38.8,-5.4],[-38.9,-18.2],[-33.8,-18.3],[-33.7,-5.4]],[[47.6,7.3],[52.5,15.8],[50.6,19.1],[47.4,20.7],[44.7,18.9],[44.7,8.1]],[[51.6,2.5],[51.5,-0.3],[60.1,-3.8],[62.6,-1.2],[62.7,2.4],[60.4,4.9]],[[-17.3,20.0],[-17.2,15.2],[-8.8,15.2],[-8.8,20.0]],[[15.8,8.0],[21.7,7.9],[21.8,22.6],[15.9,22.7]],[[37.3,-18.4],[43.2,-18.6],[43.1,-4.9],[37.6,-5.0]],[[14.1,23.8],[7.0,23.8],[7.1,8.1],[14.2,8.2]],[[15.1,-20.9],[20.7,-21.1],[20.8,-4.8],[15.3,-5.0]],[[-39.1,20.2],[-39.2,8.4],[-33.9,8.4],[-33.9,20.1]],[[44.9,-16.2],[47.9,-18.4],[51.4,-16.9],[52.6,-14.0],[47.5,-4.8],[44.8,-5.7]],[[-47.1,-5.3],[-47.2,-18.2],[-41.3,-18.2],[-41.3,-5.4]],[[30.0,-18.6],[35.5,-18.7],[35.5,-4.9],[30.1,-4.9]],[[-46.4,20.3],[-46.5,8.5],[-41.2,8.5],[-41.1,20.3]],[[-27.0,19.9],[-32.0,20.0],[-32.2,8.0],[-26.9,7.9]],[[23.4,8.0],[28.9,8.0],[29.0,21.6],[23.4,21.6]]]

/** Straight-wall flying buttresses: x, side, middle pier and outer pier distance from the axis (OSM). */
const STRAIGHT: [number, number, number, number][] = [
  [-39.9, -1, 14.9, 19.3], [-33.0, -1, 14.9, 19.3],
  [14.4, -1, 15.4, 20.6], [21.8, -1, 16.0, 21.7], [28.8, -1, 15.4, 20.3], [36.6, -1, 13.9, 18.4], [44.05, -1, 13.1, 16.9],
  [43.8, 1, 15.4, 18.9], [36.6, 1, 17.1, 21.4], [29.7, 1, 17.7, 22.3], [22.6, 1, 17.8, 22.4], [15.0, 1, 18.0, 22.6],
  [-18.4, 1, 16.6, 21.2], [-26.0, 1, 16.2, 20.8], [-32.9, 1, 16.2, 20.8], [-40.0, 1, 16.4, 21.0],
]
/** Apse buttresses, radial at these angles from the apse centre (OSM M: r 14.3, O: r 18.1). */
const APSE_ANGLES = [-54, -18, 18, 54].map((d) => (d * Math.PI) / 180)
const APSE_R = HW

/** The vessel's plan: straight sides from the west front and a half-decagon apse. */
function vesselRing(): XY[] {
  const r: XY[] = [[X_WEST, YS], [X_APSE, YS]]
  for (let i = 1; i < 5; i++) { const t = -Math.PI / 2 + (Math.PI * i) / 5; r.push([X_APSE + APSE_R * Math.cos(t), AX + APSE_R * Math.sin(t)]) }
  r.push([X_APSE, YN], [X_WEST, YN])
  return r
}

const TR = { x0: -5.6, x1: 5.8, y0: -29.85, y1: 23.4 }
const TOWER = { x0: -23.3, x1: -9.9, y0: -22.0, y1: -8.4 }
const TC: XY = [(TOWER.x0 + TOWER.x1) / 2, (TOWER.y0 + TOWER.y1) / 2]
const WT = [{ c: [-55.1, 12.15] as XY }, { c: [-55.1, -9.15] as XY }]

function build(detail: boolean) {
  const D = detail
  const stone = new Part(), sand = new Part(), slate = new Part(), cu = new Part(), win = new Part(), gold = new Part()
  const vessel = vesselRing()
  let last = 0, lastLen = [0, 0, 0, 0, 0, 0]
  const mark = (label: string) => {
    const ps = [stone, sand, slate, cu, win, gold]
    const t = ps.reduce((s, q) => s + q.triangles, 0)
    if (process.env.DEBUG) {
      let verts = 0
      ps.forEach((q, i) => {
        const keys = new Set<string>()
        for (let k = lastLen[i]; k < q.pos.length; k += 3) keys.add([q.pos[k], q.pos[k + 1], q.pos[k + 2], q.nrm[k], q.nrm[k + 1], q.nrm[k + 2]].map((x) => x.toFixed(4)).join(','))
        verts += keys.size
      })
      console.log(label.padEnd(14), t - last, 'tris', ((verts * 24 + (t - last) * 6) / 1024).toFixed(1), 'KB')
    }
    last = t; lastLen = ps.map((q) => q.pos.length)
  }
  const inVolumes = (q: XY) => insidePoly(q, vessel) || (q[0] > TR.x0 - 0.3 && q[0] < TR.x1 + 0.3 && q[1] > TR.y0 - 0.3 && q[1] < TR.y1 + 0.3)

  // ---- Low bodies: chapels and aisles, 0–15, balustrade on top.
  const bodies: [XY[], PartFor][] = [[CHOIR_RING, stone], [NAVE_S, stone], [NAVE_N, (n) => (n[1] > 0.5 ? stone : stone)]]
  for (const [ring, mat] of bodies) {
    prism(mat, ring, 0, D ? LOW : LOW + 1.2, true, false)
    // windows and balustrades on the outer edges
    const s = area2(ring) > 0 ? 1 : -1
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      const n = unit2([s * (b[1] - a[1]), -s * (b[0] - a[0])])
      if (inVolumes([m[0] + n[0] * 0.6, m[1] + n[1] * 0.6])) continue
      if (D && L > 1.2) railing(typeof mat === 'function' ? mat([n[0], n[1], 0], 0, 0) : mat, [[a[0] + n[0] * 0.05, a[1] + n[1] * 0.05], [b[0] + n[0] * 0.05, b[1] + n[1] * 0.05]], LOW, 1.2, 0.3, false)
      if (L < (D ? 3.2 : 4)) continue
      const F = pf(a, unit2([b[0] - a[0], b[1] - a[1]]), n)
      const k = Math.max(1, Math.floor(L / 7))
      for (let j = 0; j < k; j++) {
        const c = (L * (j + 0.5)) / k, ww = Math.min(3.0, L / k - 1.8)
        lancet(win, D ? stone : null, F, c - ww / 2, c + ww / 2, 3.5, 12.8, { detail: D, lights: 2, tracery: false, seg: D ? 3 : 2 })
      }
    }
  }
  for (const r of CHAPEL_ROOFS) quadHip(cu, r, D ? LOW + 0.2 : LOW + 1.2, 22)

  mark('bodies')
  // ---- The clerestory vessel: walls, windows, balustrade, roof.
  prism(stone, vessel, 0, D ? EAVE : EAVE + 1.3, false)
  const vs = area2(vessel) > 0 ? 1 : -1
  for (let i = 0; i < vessel.length; i++) {
    const a = vessel[i], b = vessel[(i + 1) % vessel.length]
    const n = unit2([vs * (b[1] - a[1]), vs * -(b[0] - a[0])])
    if (D) railing(stone, [[a[0] + n[0] * 0.2, a[1] + n[1] * 0.2], [b[0] + n[0] * 0.2, b[1] + n[1] * 0.2]], EAVE, 1.3, 0.35, D, 2.6)
  }
  hipRoof(slate, vessel, EAVE, [[X_WEST, AX], [X_APSE, AX]], RIDGE)

  // Clerestory windows between the buttresses, both sides.
  const clerestory = (side: number, xs: number[]) => {
    const y = side < 0 ? YS : YN
    const F = pf([0, y], [side < 0 ? 1 : -1, 0], [0, side])
    const sorted = [...xs].sort((p, q) => p - q)
    for (let i = 0; i < sorted.length - 1; i++) {
      const x0 = sorted[i], x1 = sorted[i + 1], g = x1 - x0
      const nWin = g > 11 ? 2 : 1
      for (let j = 0; j < nWin; j++) {
        const c = x0 + (g * (j + 0.5)) / nWin, ww = Math.min(3.8, g / nWin - 2.2)
        if (ww < 1.2) continue
        const a = side < 0 ? c : -c
        lancet(win, D ? stone : null, F, a - ww / 2, a + ww / 2, 21, 37, { detail: D, lights: 2 })
      }
    }
  }
  const sx = STRAIGHT.filter((s) => s[1] < 0).map((s) => s[0]), nx = STRAIGHT.filter((s) => s[1] > 0).map((s) => s[0])
  clerestory(-1, [-50.3, ...sx.filter((x) => x < 0), -24.5, -9, TR.x0])
  clerestory(-1, [TR.x1, ...sx.filter((x) => x > 0), X_APSE])
  clerestory(1, [-50.3, ...nx.filter((x) => x < 0), TR.x0])
  clerestory(1, [TR.x1, ...nx.filter((x) => x > 0), X_APSE])
  for (let i = 0; i < 5; i++) {
    const t0 = -Math.PI / 2 + (Math.PI * i) / 5, t1 = t0 + Math.PI / 5, tm = (t0 + t1) / 2
    const a: XY = [X_APSE + APSE_R * Math.cos(t0), AX + APSE_R * Math.sin(t0)], b: XY = [X_APSE + APSE_R * Math.cos(t1), AX + APSE_R * Math.sin(t1)]
    const F = pf(a, unit2([b[0] - a[0], b[1] - a[1]]), [Math.cos(tm), Math.sin(tm)])
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    lancet(win, D ? stone : null, F, 0.55, L - 0.55, 21, 37, { detail: D, lights: 2 })
  }

  mark('vessel')
  // ---- Flying buttresses.
  const buttress = (I: XY, M: XY, O: XY) => {
    const d = unit2([O[0] - I[0], O[1] - I[1]])
    const M1: XY = [M[0] - d[0] * 0.65, M[1] - d[1] * 0.65], M2: XY = [M[0] + d[0] * 0.65, M[1] + d[1] * 0.65], O1: XY = [O[0] - d[0] * 0.65, O[1] - d[1] * 0.65]
    // wall pier on the clerestory and its pinnacle
    const Iw: XY = [I[0] + d[0] * 0.45, I[1] + d[1] * 0.45]
    if (D) {
      obox(stone, Iw, d, 0.5, 0.55, 18, EAVE + 0.5, true)
      pinnacle(stone, [I[0] + d[0] * 0.4, I[1] + d[1] * 0.4], d, 0.4, 0.4, EAVE + 0.5, EAVE + 2.8, EAVE + 6.5, D)
    } else pinnacle(stone, Iw, d, 0.65, 0.65, EAVE + 1.3, EAVE + 1.3, EAVE + 7, false)
    // middle pier rising out of the chapel roofs, and its tall pinnacle
    if (D) {
      obox(stone, M, d, 0.65, 0.5, LOW - 1, 33.5, true)
      obox(stone, M, d, 0.8, 0.6, LOW - 1, 24, true)
      pinnacle(stone, M, d, 0.5, 0.4, 33.5, 37.5, 44, D)
    } else pinnacle(stone, M, d, 0.85, 0.65, LOW, 36.5, 44.5, false)
    // outer pier with its water table and pinnacle
    if (D) {
      obox(stone, O, d, 0.75, 0.55, 0, 10, true)
      obox(stone, O, d, 0.6, 0.45, 10, 21.5, true)
      pinnacle(stone, O, d, 0.45, 0.4, 21.5, 23, 26.5, D)
    } else pinnacle(stone, O, d, 0.85, 0.6, 0, 22.5, 27, false)
    // flyers
    flyer(stone, Iw, M1, 38, 32.5, 34.5, 28, D ? 0.85 : 1.3, D, 2)
    if (D && I[0] > 44) flyer(stone, Iw, M1, 31, 26.8, 28.4, 22.6, 0.75, true)
    flyer(stone, M2, O1, 25.5, 21.5, 22.5, 18.2, D ? 0.8 : 1.2, false, D ? 3 : 2)
  }
  for (const [x, side, dm, dout] of STRAIGHT) {
    const y = side < 0 ? YS : YN
    buttress([x, y], [x, AX + side * dm], [x, AX + side * dout])
  }
  for (const t of APSE_ANGLES) {
    const c: XY = [Math.cos(t), Math.sin(t)]
    const I: XY = [X_APSE + APSE_R * c[0], AX + APSE_R * c[1]]
    buttress(I, [X_APSE + 14.3 * c[0], AX + 14.3 * c[1]], [X_APSE + 18.1 * c[0], AX + 18.1 * c[1]])
  }

  mark('buttresses')
  // ---- Transept: walls to the eaves, hipped ends, big windows both fronts.
  const trRing: XY[] = [[TR.x0, TR.y0], [TR.x1, TR.y0], [TR.x1, TR.y1], [TR.x0, TR.y1]]
  prism((n, z0) => (n[1] < -0.5 && z0 < 1 ? stone : stone), trRing, 0, D ? EAVE : EAVE + 1.3, false)
  const trc = (TR.x0 + TR.x1) / 2, trh = (TR.x1 - TR.x0) / 2
  hipRoof(slate, trRing, EAVE, [[trc, TR.y0 + trh], [trc, TR.y1 - trh]], RIDGE)
  if (D) {
    railing(stone, [[TR.x0 - 0.2, TR.y0 + 0.3], [TR.x0 - 0.2, TR.y1 - 0.3]], EAVE, 1.3, 0.35, D, 2.6)
    railing(stone, [[TR.x1 + 0.2, TR.y0 + 0.3], [TR.x1 + 0.2, TR.y1 - 0.3]], EAVE, 1.3, 0.35, D, 2.6)
  }
  // corner turrets of the fronts
  for (const y of [TR.y0, TR.y1]) for (const x of [TR.x0, TR.x1]) {
    if (y === TR.y0 && x === TR.x0) continue // the tower stands there
    const c: XY = [x + (x < 0 ? -0.2 : 0.2), y + (y < 0 ? -0.3 : 0.3)]
    obox(stone, c, [1, 0], 0.8, 0.8, 0, 40.5, true)
    pinnacle(stone, c, [1, 0], 0.6, 0.6, 40.5, 43, 47.5, D)
  }
  // south front: Golden Gate below, the great window above, a screen of tracery on top
  const FS = pf([trc, TR.y0], [1, 0], [0, -1])
  const FN = pf([trc, TR.y1], [-1, 0], [0, 1])
  lancet(win, stone, FS, -5.0, 5.0, 18.6, 37.6, { detail: D, lights: 6, k: 0.72, frame: 0.3, depth: 0.5 })
  lancet(win, D ? stone : null, FN, -4.2, 4.2, 18, 36.2, { detail: D, lights: 6, k: 0.75, frame: 0.3, depth: 0.5 })
  for (const F of [FS, FN]) {
    // the wimperg (gable screen) over the window, a thick 3D triangle
    const g: P2[] = [[-5.2, 37], [5.2, 37], [0, 45.5]]
    const pts3 = (d: number) => g.map(([a, z]) => at(F, a, z, d))
    const f0 = pts3(0.05), f1 = pts3(0.65)
    tf(stone, f1[0], f1[1], f1[2], F.n)
    for (let i = 0; i < 3; i++) qf(stone, f0[i], f0[(i + 1) % 3], f1[(i + 1) % 3], f1[i], sub(cen(f0[i], f0[(i + 1) % 3]), cen(...f0)))
    if (D) tubePath(stone, F, circlePts(0, 40.2, 1.5, 10), 0.14, 0.65, 0.9, true)
    pinnacle(stone, [F.o[0] + F.n[0] * 0.35, F.o[1] + F.n[1] * 0.35], [1, 0], 0.3, 0.3, 45.3, 45.8, 48, D)
  }
  // Golden Gate porch: three pointed arches on four piers, mosaic above
  const yP = TR.y0 - 1.55, piers = [-6.3, -2.2, 1.85, 5.9]
  for (const x of piers) box(stone, x - 0.45, x + 0.45, yP, TR.y0, 0, 7.2, false)
  const FP = pf([0, yP], [1, 0], [0, -1])
  for (let i = 0; i < 3; i++) {
    const a0 = piers[i] + 0.45, a1 = piers[i + 1] - 0.45
    const arc = archPts(a0, a1, 7.2, 0.85, D ? 6 : 3)
    tubePath(stone, FP, arc, 0.3, -1.55, 0.05, false, D)
    if (D) tubePath(stone, FP, archPts(a0 - 0.35, a1 + 0.35, 7.2, 0.85, 6), 0.12, 0, 0.25)
    // spandrels up to the porch's upper block
    const top = 10.3, mid = Math.floor(arc.length / 2)
    const outer = arc.map(([a, z], k) => { const c = (a0 + a1) / 2; const dx = a - c; return [a + Math.sign(dx) * 0.3, z + (k === mid ? 0.3 : 0.2)] as P2 })
    const left: P2[] = [[a0 - 0.45, top], [a0 - 0.45, 7.2], ...outer.slice(0, mid + 1), [outer[mid][0], top]]
    const right: P2[] = [[a1 + 0.45, top], [outer[mid][0], top], ...outer.slice(mid), [a1 + 0.45, 7.2]]
    fanPlane(stone, FP, left, 0.06)
    fanPlane(stone, FP, right, 0.06)
    // doors behind
    fanPlane(slate, pf([0, TR.y0], [1, 0], [0, -1]), [[a0 + 0.3, 0], [a1 - 0.3, 0], [a1 - 0.3, 5.5], [(a0 + a1) / 2, 7.4], [a0 + 0.3, 5.5]], 0.04)
  }
  box(stone, -6.75, 6.35, yP - 0.06, TR.y0, 10.3, 17.4, true, true)
  fanPlane(gold, pf([0, yP - 0.06], [1, 0], [0, -1]), [[-5.9, 10.9], [5.5, 10.9], [5.5, 16.6], [-5.9, 16.6]], 0.05)
  railing(stone, [[-6.75, yP - 0.1], [6.35, yP - 0.1]], 17.4, 1.2, 0.3, D)

  mark('transept')
  // ---- The crossing flèche.
  lathe(cu, 0.0, 1.8, [[2.1, 50], [2.1, 57], [2.45, 57], [2.45, 57.6], [1.75, 57.6], [0.08, 79.2], [0, 79.2]], 8, Math.PI / 8)
  if (D) for (let i = 0; i < 8; i++) {
    const t = Math.PI / 8 + (2 * Math.PI * (i + 0.5)) / 8, ap = 2.1 * Math.cos(Math.PI / 8)
    const F = pf([0.0 + ap * Math.cos(t), 1.8 + ap * Math.sin(t)], [-Math.sin(t), Math.cos(t)], [Math.cos(t), Math.sin(t)])
    lancet(win, null, F, -0.5, 0.5, 53.5, 56.3, { k: 0.8 })
  }
  lathe(gold, 0.0, 1.8, [[0, 79.0], [0.35, 79.3], [0.35, 79.7], [0, 80.0]], 6, 0, true)
  bar(gold, [0.0, 1.8, 79.9], [0.0, 1.8, 81.4], 0.14, 0.14)
  bar(gold, [-0.5, 1.8, 80.9], [0.5, 1.8, 80.9], 0.12, 0.12)

  mark('fleche')
  // ---- The Great South Tower.
  // Base block (OSM way/1568419065, 45 m) flush with the porch front: pale
  // cleaned sandstone to the balustrade at 22, dark above; the core with its
  // diagonal corner buttresses (way/462765679) rises out of it to the gallery.
  const BB = { x0: -26.3, x1: -8.6, y0: -26.8, y1: -5.4 }
  box(stone, BB.x0, BB.x1, BB.y0, BB.y1, 0, 22, true)
  box(stone, BB.x0 + 0.2, BB.x1, BB.y0 + 0.2, BB.y1, 22, 45, true)
  box(stone, -8.7, TR.x0, -26.8, -5.4, 0, 22, true)
  box(stone, -8.7, TR.x0 + 0.1, TOWER.y0, -5.4, 22, EAVE, true)
  railing(stone, [[BB.x0 - 0.1, BB.y0 - 0.1], [BB.x1, BB.y0 - 0.1]], 22, 1.1, 0.3, D)
  box(stone, BB.x0 - 0.1, BB.x1 + 0.1, BB.y0 - 0.25, BB.y1, 44.6, 45.3, true, false)
  box(stone, TOWER.x0, TOWER.x1, TOWER.y0, TOWER.y1, 45, 56, false)
  for (const sx2 of [-1, 1]) for (const sy2 of [-1, 1]) {
    const dg = unit2([sx2, sy2])
    // the block's corner buttresses, then the core's above it
    if (sy2 < 0) {
      const bx = sx2 < 0 ? BB.x0 : BB.x1, by = BB.y0
      obox(stone, [bx + dg[0] * 0.5, by + dg[1] * 0.5], dg, 1.2, 0.85, 0, 21.5, true)
      obox(stone, [bx + dg[0] * 0.4, by + dg[1] * 0.4], dg, 1.1, 0.8, 22, 44, false)
      pinnacle(stone, [bx + dg[0] * 0.5, by + dg[1] * 0.5], dg, 0.45, 0.45, 44, 46.5, 49.5, D)
    }
    const cx = sx2 < 0 ? TOWER.x0 : TOWER.x1, cy = sy2 < 0 ? TOWER.y0 : TOWER.y1
    obox(stone, [cx + dg[0] * 0.4, cy + dg[1] * 0.4], dg, 1.1, 0.8, sy2 < 0 ? 45 : 22, 55, true)
    pinnacle(stone, [cx + dg[0] * 0.6, cy + dg[1] * 0.6], dg, 0.42, 0.42, 55, 57.5, 61, D)
    if (D) for (const [u, nn] of [[[1, 0], [0, sy2]], [[0, 1], [sx2, 0]]] as [XY, XY][]) {
      if (sy2 < 0 && nn[1] < 0) continue
      const c: XY = [cx - u[0] * sx2 * 3.2 + nn[0] * 0.45, cy - u[1] * sy2 * 3.2 + nn[1] * 0.45]
      obox(stone, c, nn[0] ? [1, 0] : [0, 1], nn[0] ? 0.45 : 0.55, nn[0] ? 0.55 : 0.45, 45, 54, true)
      pinnacle(stone, c, [1, 0], 0.3, 0.3, 54, 55, 57.5, true)
    }
  }
  // the block's south face: the base window, the golden grille window, the clock
  const SB = pf([TC[0], BB.y0], [1, 0], [0, -1])
  lancet(win, D ? stone : null, SB, -2.4, 2.4, 3.5, 14.5, { detail: D, lights: 2, k: 0.7 })
  lancet(gold, D ? stone : null, SB, -2.3, 2.3, 24, 36.5, { detail: false, frame: 0.3, depth: 0.5, k: 0.75 })
  if (D) {
    for (let k = 1; k < 6; k++) tubePath(gold, SB, [[-2.3 + (4.6 * k) / 6, 24], [-2.3 + (4.6 * k) / 6, 34.6]], 0.05, 0.04, 0.2)
    for (let k = 1; k < 8; k++) tubePath(gold, SB, [[-2.3, 24 + k * 1.3], [2.3, 24 + k * 1.3]], 0.05, 0.04, 0.2)
    // flanking blind tracery panels, real frames
    for (const a of [-5.4, 5.4]) lancet(stone, stone, SB, a - 1.1, a + 1.1, 24.5, 36.5, { detail: true, lights: 2, frame: 0.14, depth: 0.25, tracery: false })
  }
  fanPlane(gold, SB, circlePts(0, 40.8, 1.75, D ? 16 : 10), 0.12)
  tubePath(stone, SB, circlePts(0, 40.8, 1.95, D ? 16 : 10), 0.22, 0, 0.35, true)
  if (D) { tubePath(stone, SB, [[0, 40.8], [0, 42.1]], 0.07, 0.12, 0.3); tubePath(stone, SB, [[0, 40.8], [0.9, 40.8]], 0.07, 0.12, 0.3) }
  lancet(win, D ? stone : null, pf([BB.x0, -16], [0, -1], [-1, 0]), -2.0, 2.0, 26, 38, { detail: D, lights: 2, tracery: false })
  // the core's belfry: two lancets a face
  const tfaces: PF[] = [
    pf([TC[0], TOWER.y0], [1, 0], [0, -1]), pf([TOWER.x1, TC[1]], [0, 1], [1, 0]),
    pf([TC[0], TOWER.y1], [-1, 0], [0, 1]), pf([TOWER.x0, TC[1]], [0, -1], [-1, 0]),
  ]
  for (const F of tfaces) {
    lancet(win, D ? stone : null, F, -2.9, -0.3, 46, 53.5, { detail: D, lights: 1, seg: 3 })
    lancet(win, D ? stone : null, F, 0.3, 2.9, 46, 53.5, { detail: D, lights: 1, seg: 3 })
  }
  // gallery storey in paler stone: projecting corner pavilions, three
  // arched openings a face, balustrade, dark cornice
  const G = { x0: TOWER.x0 + 0.3, x1: TOWER.x1 - 0.3, y0: TOWER.y0 + 0.3, y1: TOWER.y1 - 0.3 }
  box(sand, G.x0, G.x1, G.y0, G.y1, 56, 63.6, false)
  box(stone, TOWER.x0 - 0.3, TOWER.x1 + 0.3, TOWER.y0 - 0.3, TOWER.y1 + 0.3, 55.6, 56.2, true, false)
  if (D) railing(sand, [[TOWER.x0 - 0.2, TOWER.y0 - 0.2], [TOWER.x1 + 0.2, TOWER.y0 - 0.2], [TOWER.x1 + 0.2, TOWER.y1 + 0.2], [TOWER.x0 - 0.2, TOWER.y1 + 0.2], [TOWER.x0 - 0.2, TOWER.y0 - 0.2]], 56.2, 1.1, 0.3, D, 1.6)
  const gfaces: PF[] = [
    pf([TC[0], G.y0], [1, 0], [0, -1]), pf([G.x1, TC[1]], [0, 1], [1, 0]),
    pf([TC[0], G.y1], [-1, 0], [0, 1]), pf([G.x0, TC[1]], [0, -1], [-1, 0]),
  ]
  for (const F of gfaces) for (const c of [-2.6, 0, 2.6]) {
    const head = circlePts(c, 61.0, 0.95, 12).filter(([, z]) => z > 61.01).sort((p, q) => q[0] - p[0])
    if (D) fanPlane(win, F, [[c - 0.95, 58.0], [c + 0.95, 58.0], [c + 0.95, 61.0], ...head, [c - 0.95, 61.0]], 0.04)
    else fanPlane(win, F, [[c - 0.95, 58.0], [c + 0.95, 58.0], [c + 0.95, 61.0], [c, 62.0], [c - 0.95, 61.0]], 0.04)
    if (D) tubePath(sand, F, [[c + 0.95, 58.0], [c + 0.95, 61.0], ...head, [c - 0.95, 61.0], [c - 0.95, 58.0]], 0.14, 0, 0.3)
  }
  for (const sx2 of [-1, 1]) for (const sy2 of [-1, 1]) {
    const cx = sx2 < 0 ? TOWER.x0 + 1.3 : TOWER.x1 - 1.3, cy = sy2 < 0 ? TOWER.y0 + 1.3 : TOWER.y1 - 1.3
    box(sand, cx - 1.6, cx + 1.6, cy - 1.6, cy + 1.6, 56, 63.6, false)
    if (D) for (const F of [pf([cx, cy + sy2 * 1.6], [sy2 < 0 ? 1 : -1, 0], [0, sy2]), pf([cx + sx2 * 1.6, cy], [0, sx2 > 0 ? 1 : -1], [sx2, 0])])
      lancet(win, null, F, -0.4, 0.4, 59.2, 61.4, { k: 0.5, seg: 3 })
  }
  box(stone, TOWER.x0 - 0.6, TOWER.x1 + 0.6, TOWER.y0 - 0.6, TOWER.y1 + 0.6, 63.6, 64.5, true, true)
  // the copper cap (profile from PragueCathedral03.jpg, scaled to 64.5–99):
  // bell with dormers, open lantern, second bell, small lantern, needle
  const N = D ? 16 : 10
  lathe(cu, TC[0], TC[1], [[0, 64.5], [5.6, 64.5], [5.75, 65.2], [5.55, 66.5], [4.9, 68.0], [3.9, 69.6], [2.9, 70.8], [2.45, 71.4], [2.75, 71.8], [0, 71.8]], N, Math.PI / N, true)
  lathe(cu, TC[0], TC[1], [[2.75, 71.8], [2.75, 77.6], [3.2, 77.6], [3.2, 78.0], [3.1, 78.1], [3.0, 79.0], [2.6, 80.4], [1.8, 81.6], [1.3, 82.3], [1.45, 82.3], [1.45, 86.3], [1.7, 86.3], [1.7, 86.7], [1.3, 86.8], [0.75, 88.0], [0.08, 94.8], [0, 94.8]], N, Math.PI / N, true)
  const nl = D ? 8 : 4
  for (let i = 0; i < nl; i++) {
    const t = (2 * Math.PI * (i + 0.5)) / nl, cd: XY = [Math.cos(t), Math.sin(t)]
    const F = pf([TC[0] + 2.72 * cd[0], TC[1] + 2.72 * cd[1]], [-cd[1], cd[0]], cd)
    lancet(win, null, F, -0.6, 0.6, 72.4, 77.0, { k: 0.5, seg: 4 })
    if (D) lancet(win, null, pf([TC[0] + 1.42 * cd[0], TC[1] + 1.42 * cd[1]], [-cd[1], cd[0]], cd), -0.3, 0.3, 82.9, 85.8, { k: 0.5, seg: 3 })
  }
  // dormers on the bell, each with a little onion (detail)
  if (D) for (let i = 0; i < 4; i++) {
    const t = (Math.PI / 2) * i - Math.PI / 2, c: XY = [Math.cos(t), Math.sin(t)]
    const q: XY = [TC[0] + c[0] * 4.9, TC[1] + c[1] * 4.9]
    obox(cu, q, c, 0.8, 0.75, 65.6, 68.0, false)
    lathe(cu, q[0] + c[0] * 0.2, q[1] + c[1] * 0.2, [[0.95, 68.0], [1.0, 68.4], [0.55, 69.2], [0.12, 69.8], [0.05, 70.6], [0, 70.6]], 8, 0, true)
    lancet(win, null, pf([q[0] + c[0] * 0.8, q[1] + c[1] * 0.8], [-c[1], c[0]], c), -0.4, 0.4, 66.0, 67.7, { k: 0.5 })
  }
  lathe(gold, TC[0], TC[1], [[0, 94.7], [0.5, 95.0], [0.58, 95.4], [0.5, 95.8], [0, 96.1]], 8, 0, true)
  bar(gold, [TC[0], TC[1], 96.0], [TC[0], TC[1], 99], 0.16, 0.16)
  bar(gold, [TC[0] - 0.8, TC[1], 97.8], [TC[0] + 0.8, TC[1], 97.8], 0.1, 0.7)
  // corner turrets on the pavilions: dark plinth, wide onion, neck, small onion, gilt ball and vane
  for (const sx2 of [-1, 1]) for (const sy2 of [-1, 1]) {
    const cx = sx2 < 0 ? TOWER.x0 + 1.0 : TOWER.x1 - 1.0, cy = sy2 < 0 ? TOWER.y0 + 1.0 : TOWER.y1 - 1.0
    box(stone, cx - 1.2, cx + 1.2, cy - 1.2, cy + 1.2, 64.5, 65.2, true)
    if (D) lathe(cu, cx, cy, [[1.05, 65.2], [1.5, 65.9], [1.55, 66.6], [1.25, 67.4], [0.6, 68.0], [0.3, 68.3], [0.3, 68.9], [0.55, 69.3], [0.5, 69.8], [0.22, 70.3], [0.1, 70.6], [0, 70.6]], 12, Math.PI / 12, true)
    else lathe(cu, cx, cy, [[1.05, 65.2], [1.55, 66.2], [1.25, 67.4], [0.3, 68.3], [0.55, 69.3], [0.1, 70.6], [0, 70.6]], 8, Math.PI / 8, true)
    if (D) lathe(gold, cx, cy, [[0, 70.5], [0.28, 70.7], [0.28, 71.0], [0, 71.2]], 6, 0, true)
    bar(gold, [cx, cy, 70.6], [cx, cy, 72.2], 0.09, 0.09)
  }

  mark('tower')
  // ---- West towers and front.
  for (const { c } of WT) {
    const h = 4.8
    box(stone, c[0] - h, c[0] + h, c[1] - h, c[1] + h, 0, 40, false)
    // two buttresses at each corner, stepping in
    for (const sx2 of [-1, 1]) for (const sy2 of [-1, 1]) {
      const cx = c[0] + sx2 * h, cy = c[1] + sy2 * h
      for (const [u, n] of [[[1, 0], [0, sy2]], [[0, 1], [sx2, 0]]] as [XY, XY][]) {
        const p0: XY = [cx - u[0] * sx2 * 0.75 + n[0] * 0.8, cy - u[1] * sy2 * 0.75 + n[1] * 0.8]
        if (D) {
          obox(stone, p0, u, 0.6, 0.8, 0, 26, true)
          const p1: XY = [p0[0] - n[0] * 0.3, p0[1] - n[1] * 0.3]
          obox(stone, p1, u, 0.5, 0.5, 26, 40, true)
        }
      }
      if (!D) obox(stone, [cx + sx2 * 0.35, cy + sy2 * 0.35], unit2([sx2, sy2]), 1.1, 0.8, 0, 39.4, false)
      pinnacle(stone, [cx - sx2 * 0.3, cy - sy2 * 0.3], [1, 0], 0.75, 0.75, 40, 54, 61, D)
    }
    box(stone, c[0] - h - 0.25, c[0] + h + 0.25, c[1] - h - 0.25, c[1] + h + 0.25, 39.4, 40.2, true, true)
    // octagon belfry, gallery, spire
    const r8 = 4.3 / Math.cos(Math.PI / 8)
    lathe(stone, c[0], c[1], [[r8, 40.2], [r8, 61], [r8 + 0.4, 61], [r8 + 0.4, 61.7], [0, 61.7]], 8, Math.PI / 8)
    for (let i = 0; i < 8; i++) {
      const t = (2 * Math.PI * (i + 0.5)) / 8 + Math.PI / 8 - Math.PI / 8
      const tt = Math.PI / 8 + (2 * Math.PI * i) / 8 + Math.PI / 8
      const cdir: XY = [Math.cos(tt), Math.sin(tt)]
      const F = pf([c[0] + 4.3 * cdir[0], c[1] + 4.3 * cdir[1]], [-cdir[1], cdir[0]], cdir)
      if (D) {
        lancet(win, stone, F, -0.85, 0.85, 43.5, 59.6, { detail: D, lights: 1, frame: 0.16, depth: 0.25, seg: 3 })
      } else if (i % 2 === 0) lancet(win, null, F, -0.85, 0.85, 43.5, 59.6, {})
      void t
      // ring of small pinnacles round the spire foot
      const pc: XY = [c[0] + (r8 + 0.05) * Math.cos(Math.PI / 8 + (2 * Math.PI * i) / 8), c[1] + (r8 + 0.05) * Math.sin(Math.PI / 8 + (2 * Math.PI * i) / 8)]
      if (D) pinnacle(stone, pc, [1, 0], 0.3, 0.3, 61.7, 63.4, 67, D)
    }
    if (D) railing(stone, Array.from({ length: 9 }, (_, i) => [c[0] + (r8 + 0.2) * Math.cos(Math.PI / 8 + (2 * Math.PI * i) / 8), c[1] + (r8 + 0.2) * Math.sin(Math.PI / 8 + (2 * Math.PI * i) / 8)] as XY), 61.7, 1.0, 0.25, true, 1.5)
    const rs = 2.6 / Math.cos(Math.PI / 8), rd = 3.4 / Math.cos(Math.PI / 8)
    lathe(stone, c[0], c[1], [[rd, 61.7], [rd, 63.3], [rs, 63.3], [rs, 64], [0.12, 83], [0, 83]], 8, Math.PI / 8)
    bar(stone, [c[0], c[1], 82.5], [c[0], c[1], 84.6], 0.25, 0.25)
    if (D) {
      bar(stone, [c[0] - 0.55, c[1], 83.9], [c[0] + 0.55, c[1], 83.9], 0.2, 0.2)
      bar(stone, [c[0], c[1] - 0.55, 83.9], [c[0], c[1] + 0.55, 83.9], 0.2, 0.2)
    }
    // the spire's edges: crockets (detail) and banding
    for (let i = 0; i < 8; i++) {
      const t = Math.PI / 8 + (2 * Math.PI * i) / 8, dg: XY = [Math.cos(t), Math.sin(t)]
      const nk = D ? 4 : 0
      for (let k = 1; k <= nk; k++) {
        const f = k / (nk + 1), z = 64 + (83 - 64) * f, r = rs + (0.12 - rs) * f
        obox(stone, [c[0] + dg[0] * (r + 0.25), c[1] + dg[1] * (r + 0.25)], dg, 0.32, 0.18, z - 0.3, z + 0.25, true)
      }
    }
    if (D) for (const f of [0.28, 0.55]) {
      const z = 64 + (83 - 64) * f, r = rs + (0.12 - rs) * f
      lathe(stone, c[0], c[1], [[r - 0.05, z - 0.25], [r + 0.22, z - 0.1], [r + 0.22, z + 0.15], [r - 0.12, z + 0.3]], 8, Math.PI / 8)
    }
    // tower west face: portal and tall lancets
    const F = pf([X_WEST - 0.0 - 0.0, c[1]], [0, -1], [-1, 0])
    const Fw = { ...F, o: [c[0] - h, c[1], 0] as V3 }
    lancet(win, D ? stone : null, Fw, -1.5, 1.5, 17, 35.5, { detail: D, lights: 2, k: 0.7 })
    portal(Fw, 0, 3.6, 10.5, 1)
    // tower outer face lancet
    const side = c[1] > AX ? 1 : -1
    const Fo = pf([c[0], c[1] + side * h], [side, 0], [0, side])
    lancet(win, D ? stone : null, Fo, -1.4, 1.4, 17, 35.5, { detail: D, lights: 2, k: 0.7 })
  }

  mark('westtowers')
  // the centre bay of the west front
  const FW = pf([X_WEST, AX], [0, -1], [-1, 0])
  portal(FW, 0, 5.4, 12.5, 1.5)
  rose(win, stone, FW, 0, 29.8, 5.35, D)
  box(stone, X_WEST - 0.6, X_WEST, YS, YN, 22.0, 22.8, true, true)
  if (D) railing(stone, [[X_WEST - 0.45, YS], [X_WEST - 0.45, YN]], 22.8, 1.0, 0.25, true, 1.2)
  if (D) for (let i = 0; i < 7; i++) {
    const a = -4.8 + i * 1.6
    lancet(win, stone, FW, a - 0.5, a + 0.5, 17.2, 21.6, { detail: false, frame: 0.12, depth: 0.25, k: 0.6 })
  }
  // gable between the towers, thick, with a roundel; finial
  {
    const g: P2[] = [[-HW - 0.2, EAVE], [HW + 0.2, EAVE], [0, RIDGE + 0.6]]
    const f0 = g.map(([a, z]) => at(FW, a, z, -0.1)), f1 = g.map(([a, z]) => at(FW, a, z, 0.55))
    tf(stone, f1[0], f1[1], f1[2], FW.n)
    for (let i = 0; i < 3; i++) qf(stone, f0[i], f0[(i + 1) % 3], f1[(i + 1) % 3], f1[i], sub(cen(f0[i], f0[(i + 1) % 3]), cen(...f0)))
    tf(stone, f0[0], f0[1], f0[2], [-FW.n[0], -FW.n[1], 0])
    if (D) rose(win, stone, { ...FW, o: add(FW.o, FW.n, 0.55) }, 0, 44.5, 2.2, false)
    else fanPlane(win, { ...FW, o: add(FW.o, FW.n, 0.55) }, circlePts(0, 44.5, 2.2, 8), 0.04)
    if (D) for (const a of [-2.4, 2.4]) lancet(win, stone, { ...FW, o: add(FW.o, FW.n, 0.55) }, a - 0.5, a + 0.5, 40, 43.3, { k: 0.7 })
    pinnacle(stone, [X_WEST - 0.3, AX], [1, 0], 0.35, 0.35, RIDGE + 0.2, RIDGE + 1.2, RIDGE + 3.6, D)
  }

  /** A portal: door, pointed archivolts in 3D, and a gable (wimperg) over it. */
  function portal(F: PF, ac: number, w: number, zTop: number, depth: number) {
    const a0 = ac - w / 2, a1 = ac + w / 2
    const rise = archRise(w, 0.75), zs = zTop - rise
    fanPlane(slate, F, [[a0, 0], [a1, 0], ...archPts(a0, a1, zs, 0.75, 4).reverse()], 0.03)
    const rings = D ? 2 : 1
    for (let r = 0; r < rings; r++) {
      const e = 0.45 + r * 0.5
      tubePath(sand, F, [[a0 - e, 0], ...archPts(a0 - e, a1 + e, zs, 0.75, D ? 6 : 2), [a1 + e, 0]], 0.25, 0, depth * (1 - r * 0.25))
    }
    const top = zTop + 0.6 + rings * 0.5 + 3.5, ew = w / 2 + 0.6 + rings * 0.5
    const g: P2[] = [[ac - ew, zs + 0.5], [ac + ew, zs + 0.5], [ac, top]]
    const f0 = g.map(([a, z]) => at(F, a, z, 0)), f1 = g.map(([a, z]) => at(F, a, z, 0.35))
    for (let i = 0; i < 3; i++) qf(sand, f0[i], f0[(i + 1) % 3], f1[(i + 1) % 3], f1[i], sub(cen(f0[i], f0[(i + 1) % 3]), cen(...f0)))
    tubePath(sand, F, [[ac - ew, zs + 0.5], [ac, top], [ac + ew, zs + 0.5]], 0.22, 0.2, 0.55)
    if (D) for (const s of [-1, 1]) pinnacle(sand, [at(F, ac + s * (ew + 0.2), 0, 0.3)[0], at(F, ac + s * (ew + 0.2), 0, 0.3)[1]], [1, 0], 0.25, 0.25, 0, zs + 1.2, top - 0.5, false)
    if (D) pinnacle(sand, [at(F, ac, 0, 0.3)[0], at(F, ac, 0, 0.3)[1]], [1, 0], 0.18, 0.18, top - 0.3, top, top + 1.4, D)
  }

  mark('westfront')
  const lit = (base: number) => (_p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : base)
  return [
    { part: stone, material: { ...finish('vitus-stone', 0x564f48), floodlight: lit(0.85) } },
    { part: sand, material: { ...finish('vitus-sandstone', 0xc9b794), floodlight: lit(0.9) } },
    { part: slate, material: finish('vitus-roof', 0x80898a) },
    { part: cu, material: { ...PALETTE.copper, color: 0x84ad9b, floodlight: lit(0.6) } },
    { part: win, material: PALETTE.window },
    { part: gold, material: { ...finish('vitus-gold', 0xcfae5c), floodlight: lit(0.9) } },
  ]
}

if (import.meta.main) {
  const extras = { bearing: 339.4, elevation: 0, height: 99 }
  await writeModel('prague-st-vitus-cathedral.glb', 'St. Vitus Cathedral', build(false), 6500, 245_000, extras)
  await writeModel('prague-st-vitus-cathedral.detail.glb', 'St. Vitus Cathedral', build(true), 40_000, 1536 * 1024, extras)
}
