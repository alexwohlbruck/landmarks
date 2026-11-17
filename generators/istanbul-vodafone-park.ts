/**
 * Tüpraş Stadium (Vodafone Park, Beşiktaş Stadium), Beşiktaş, Istanbul:
 * procedural, CC0-1.0. bun generators/istanbul-vodafone-park.ts
 *
 * Opened 2016 on the site of the 1947 İnönü Stadium. A rounded-rectangle
 * bowl wrapped in a colonnade of tall pale stone piers with dark glazing
 * behind, a glazed band and slim steel posts above it, and the roof: a
 * continuous ring of cream membrane cushions on a dark steel edge, sloping
 * in over the stands. On the Dolmabahçe (south-east) side the old open
 * stand of İnönü (Eski Açık Tribün) is kept as a curved ashlar wall, with
 * the square stone towers of the old stadium. The pitch is the map's.
 *
 * Frame: x across the pitch (towards world 52.5), y along it (towards world
 * 322.5, the Maçka end), z up; placed with bearing 322.5. Origin at the
 * centroid of the grandstand outline (relation/6554433), 28.994412,
 * 41.039443. y = 0 is the field and the Dolmabahçe street, the lowest
 * ground; the bowl is cut into the Maçka slope on the north-west, where the
 * walls run down into the hill. Elevation 0 (the field is at the
 * Dolmabahçe street's level in p01 and p02, not dug below it). The terrain
 * check could not run (no Mapterhorn z15 here).
 *
 * OSM (ODbL), fetched 2026-11: relation/6554433 building=grandstand,
 * height 25, wikidata Q14914703 (outer way/440558676, 161 x 213 m; inner
 * way/440558677, the stands' front edge, 78 x 129 m), drawn here as given;
 * way/1328815936 leisure=stadium "Tüpraş Stadyumu", height 34 (the site, not
 * a building); way/489743779 "Eski Açık Tribün" (building, museum), the
 * old stand's curved block 30 m south-east of the bowl. Wikidata
 * Q14914703 checked: "Beşiktaş Stadium", association football stadium.
 *
 * Measured / estimated from photos (no lidar): p01 and p02 (from the hotel
 * roofs to the west, high) give the ratios. With the roof's eave at
 * 30 m (OSM height 34 for the cushions' top): colonnade 18.5 m, its
 * entablature to 20 m, the glazed band and posts 20-28.5 m, the dark edge
 * beam 28.5-30 m, cushions rising to 33 m and falling to 27 m at the inner
 * edge, 2 m in over the stands' front edge (p01, p02). Piers about 9 m apart
 * (72 round the bowl, against about 100 real ones, drawn 3.6-4.2 m
 * wide so the stone dominates as in the photos; p03 shows them irregular, about 2 m wide). The old
 * stand's wall 7 m with a parapet (p05, people for scale); the towers 8 m
 * square and 16 m high (p04).
 * Invented: the towers' positions, at the inner ends of the old stand's
 * arc (p04 shows one beside the colonnade, with stairs; no photo shows
 * both); the stands as one rake from 2 to 24 m.
 *
 * Colours: pale travertine piers (#ede3d3), dark glazing, cream membrane
 * (#e9dccb, beige in daylight in p01, white at dusk in p02), charcoal roof
 * edge and posts (#5b6169), grey stands (black and white seats, pulled to
 * one mid grey). Night: the glazing behind the piers glows; the piers are
 * floodlit.
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 * - p01 "Vodafone Park.jpg", Matt Growcoot, CC BY-SA 4.0 (from the west,
 *   high) https://commons.wikimedia.org/wiki/File:Vodafone_Park.jpg
 * - p02 "20220606-L1000240.jpg", Thomas Berwing, CC BY-SA 4.0 (dusk, from
 *   the west, high) https://commons.wikimedia.org/wiki/File:20220606-L1000240.jpg
 * - p03 "Vodafone Park-.jpg", Yair Haklai, CC BY-SA 4.0 (the colonnade)
 *   https://commons.wikimedia.org/wiki/File:Vodafone_Park-.jpg
 * - p04 "Vodafone Park, Istanbul (from outside).jpg", Olos88, CC0 (the
 *   stone tower) https://commons.wikimedia.org/wiki/File:Vodafone_Park,_Istanbul_(from_outside).jpg
 * - p05 "Besiktas Stadion - Istambul, 2014.10.24 (1).JPG", Derzsi Elekes
 *   Andor, CC BY-SA 4.0 (the old stand's wall, during construction)
 *   https://commons.wikimedia.org/wiki/File:Besiktas_Stadion_-_Istambul,_2014.10.24_(1).JPG
 * Look-only: none.
 *
 * Doubts: heights are photo ratios; the old stand's top and the towers'
 * number and places; the roof's inner edge.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const OUTER: XY[] = [[-0.8,106.5],[-20.4,105.1],[-36.5,101.0],[-50.8,93.4],[-62.4,83.5],[-71.1,71.3],[-76.4,58.9],[-79.0,44.7],[-80.0,25.9],[-80.7,-0.0],[-79.7,-25.9],[-78.5,-44.7],[-75.6,-58.9],[-70.2,-71.3],[-61.3,-83.5],[-49.6,-93.4],[-35.2,-100.9],[-19.0,-105.0],[0.8,-106.4],[20.4,-104.9],[36.6,-100.9],[50.9,-93.3],[62.4,-83.4],[71.2,-71.2],[76.4,-58.8],[79.0,-44.6],[80.0,-25.8],[80.6,0.1],[79.7,26.0],[78.4,44.8],[75.5,59.0],[70.1,71.3],[61.2,83.6],[49.5,93.5],[35.1,101.0],[18.9,105.0]]
const INNER: XY[] = [[-0.5,64.6],[-13.5,63.7],[-21.2,61.8],[-27.0,58.7],[-31.2,55.1],[-34.4,50.6],[-36.1,46.6],[-37.4,39.5],[-38.2,24.0],[-38.9,-0.1],[-38.0,-24.0],[-37.0,-39.5],[-35.5,-46.6],[-33.8,-50.5],[-30.5,-55.1],[-26.3,-58.7],[-20.5,-61.7],[-12.6,-63.6],[0.5,-64.6],[13.4,-63.6],[21.3,-61.6],[27.0,-58.6],[31.2,-55.0],[34.5,-50.5],[36.1,-46.5],[37.5,-39.4],[38.3,-24.0],[38.7,0.1],[37.9,24.1],[36.9,39.6],[35.5,46.6],[33.7,50.6],[30.4,55.1],[26.2,58.7],[20.4,61.7],[12.6,63.7]]
// The old stand (way/489743779), outer arc then inner arc, resampled.
const OLD_OUT: XY[] = [[54.4,-128.1],[45.5,-136.4],[35.1,-143.0],[23.6,-147.6],[11.5,-149.9],[-0.8,-150.0],[-13.0,-147.9],[-24.6,-143.5],[-35.1,-137.1],[-44.4,-128.9]]
const OLD_IN: XY[] = [[44.3,-120.7],[36.8,-127.3],[28.2,-132.5],[18.8,-136.0],[8.9,-137.7],[-1.1,-137.5],[-11.0,-135.5],[-20.3,-131.8],[-28.8,-126.3],[-32.6,-123.1]]

/** Resample a closed ring to n points evenly by arc length. */
function resample(r: XY[], n: number): XY[] {
  const seg = r.map((p, i) => { const q = r[(i + 1) % r.length]; return Math.hypot(q[0] - p[0], q[1] - p[1]) })
  const L = seg.reduce((a, b) => a + b, 0)
  const out: XY[] = []
  let i = 0, acc = 0
  for (let k = 0; k < n; k++) {
    const d = (L * k) / n
    while (acc + seg[i] < d) { acc += seg[i]; i++ }
    const t = (d - acc) / seg[i], p = r[i], q = r[(i + 1) % r.length]
    out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t])
  }
  return out
}

/** A convex planar polygon, wound to face n. */
function face(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    const g = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}

/** Offset a convex-ish ring inward by d along the vertex normals. */
function inset(r: XY[], d: number): XY[] {
  const n = r.length
  return r.map((p, i) => {
    const a = r[(i + n - 1) % n], b = r[(i + 1) % n]
    const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1
    // ring is counter-clockwise: outward normal is (ty, -tx)
    return [p[0] - (ty / l) * d, p[1] + (tx / l) * d] as XY
  })
}

function ccw(r: XY[]): XY[] {
  const a = r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  return a > 0 ? r : r.slice().reverse()
}

function box(p: Part, c: XY, u: XY, hw: number, hd: number, z0: number, z1: number, top = true) {
  // u: unit along the width; depth along the normal (u rotated -90)
  const n: XY = [u[1], -u[0]]
  const P = (s: number, t: number): XY => [c[0] + u[0] * s + n[0] * t, c[1] + u[1] * s + n[1] * t]
  const ring = ccw([P(-hw, -hd), P(hw, -hd), P(hw, hd), P(-hw, hd)])
  const lo = ring.map(([x, y]) => [x, y, z0] as V3), hi = ring.map(([x, y]) => [x, y, z1] as V3)
  p.loft([lo, hi])
  if (top) p.cap(hi, true)
}

export function build() {
  const stone = new Part(), win = new Part(), membrane = new Part(), steel = new Part(), seats = new Part()

  const N = 72
  const out = resample(ccw(OUTER), N)
  const inn = resample(ccw(INNER), N)
  const COL = 18.5, ENT = 20, EAVE0 = 28.5, EAVE = 30
  // outward normal of segment i of a counter-clockwise ring
  const onrm = (r: XY[], i: number): V3 => {
    const a = r[i], b = r[(i + 1) % r.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l, 0]
  }
  const P = (r: XY[], k: number, z: number): V3 => [r[k % r.length][0], r[k % r.length][1], z]
  const UP: V3 = [0, 0, 1], DOWN: V3 = [0, 0, -1]
  const neg = (v: V3): V3 => [-v[0], -v[1], -v[2]]

  // Glazing behind the piers, and the glazed band above, set further in.
  const g1 = inset(out, 2.2), g2 = inset(out, 3.2)
  for (let i = 0; i < N; i++) {
    face(win, [P(g1, i, 0), P(g1, i + 1, 0), P(g1, i + 1, ENT), P(g1, i, ENT)], onrm(g1, i))
    face(win, [P(g2, i, ENT), P(g2, i + 1, ENT), P(g2, i + 1, EAVE0 - 1.5), P(g2, i, EAVE0 - 1.5)], onrm(g2, i))
  }
  // Piers, one per segment (every third a little broader), and the
  // entablature ring over them.
  for (let i = 0; i < N; i++) {
    const a = out[i], b = out[(i + 1) % N]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / l, (b[1] - a[1]) / l]
    box(stone, [a[0] - u[1] * 1.05, a[1] + u[0] * 1.05], u, 1.8 + (i % 3 === 0 ? 0.3 : 0), 1.05, 0, COL, false)
  }
  {
    const o2 = inset(out, -0.15), i2 = inset(out, 2.6)
    for (let i = 0; i < N; i++) {
      face(stone, [P(o2, i, COL), P(o2, i + 1, COL), P(o2, i + 1, ENT), P(o2, i, ENT)], onrm(o2, i))
      face(stone, [P(i2, i, ENT), P(o2, i, ENT), P(o2, i + 1, ENT), P(i2, i + 1, ENT)], UP)
      face(stone, [P(o2, i, COL), P(i2, i, COL), P(i2, i + 1, COL), P(o2, i + 1, COL)], DOWN)
    }
  }
  // Steel posts from the entablature to the roof edge.
  for (let i = 0; i < N; i += 3) {
    const a = out[i], b = out[(i + 1) % N]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / l, (b[1] - a[1]) / l]
    box(steel, [a[0] - u[1] * 1.0, a[1] + u[0] * 1.0], u, 0.35, 0.35, ENT, EAVE0, false)
  }

  // Stands: one rake from the front edge to the back, under the roof.
  const back = inset(out, 4.5)
  for (let i = 0; i < N; i++) {
    const o = onrm(inn, i)
    face(seats, [P(inn, i, 1.5), P(inn, i + 1, 1.5), P(back, i + 1, 24), P(back, i, 24)], [-o[0] * 0.7, -o[1] * 0.7, 1])
    face(seats, [P(inn, i, 0), P(inn, i + 1, 0), P(inn, i + 1, 1.5), P(inn, i, 1.5)], neg(o))
  }

  // Roof: dark edge beam, then cushions sloping in to the inner edge.
  const eo = inset(out, -0.3), ei = inset(out, 1.2)
  for (let i = 0; i < N; i++) {
    face(steel, [P(eo, i, EAVE0), P(eo, i + 1, EAVE0), P(eo, i + 1, EAVE), P(eo, i, EAVE)], onrm(eo, i))
    face(steel, [P(eo, i, EAVE0), P(ei, i, EAVE0), P(ei, i + 1, EAVE0), P(eo, i + 1, EAVE0)], DOWN)
  }
  {
    const rIn = inset(inn, 2)
    const lerpR = (t: number) => out.map((p, k) => [p[0] + (rIn[k][0] - p[0]) * t, p[1] + (rIn[k][1] - p[1]) * t] as XY)
    const ts = [0, 0.25, 0.62, 1]
    const zt = [EAVE, 32.6, 32.4, 27]
    const rings = ts.map((t) => lerpR(t))
    for (let i = 0; i < N; i += 2) {
      const i1 = i + 1, i2 = i + 2
      for (let k = 0; k < ts.length - 1; k++) {
        const lift0 = k === 0 ? 0 : 1.7, lift1 = k + 1 === ts.length - 1 ? 0 : 1.7
        const A = P(rings[k], i, zt[k]), B = P(rings[k], i1, zt[k] + lift0), C = P(rings[k], i2, zt[k])
        const D = P(rings[k + 1], i, zt[k + 1]), E = P(rings[k + 1], i1, zt[k + 1] + lift1), F = P(rings[k + 1], i2, zt[k + 1])
        for (const q of [[A, B, E], [A, E, D], [B, C, F], [B, F, E]] as V3[][]) {
          face(membrane, q, UP)
          face(membrane, q.map((v) => [v[0], v[1], v[2] - 0.6] as V3), DOWN)
        }
      }
    }
    const r = rings[ts.length - 1]
    for (let i = 0; i < N; i++) {
      const q = [P(r, i, 26.2), P(r, i + 1, 26.2), P(r, i + 1, 27), P(r, i, 27)]
      face(steel, q, neg(onrm(r, i)))
    }
  }

  // The old open stand: a curved ashlar wall, a stepped top, a window row.
  {
    const H = 7, cen: XY = [5, -110]
    const o = OLD_OUT, w = OLD_IN // both east -> west
    const away = (p: XY, q: XY): V3 => { const m = [(p[0] + q[0]) / 2 - cen[0], (p[1] + q[1]) / 2 - cen[1]], l = Math.hypot(m[0], m[1]); return [m[0] / l, m[1] / l, 0] }
    const n = o.length
    for (let k = 0; k < n - 1; k++) {
      const ao = away(o[k], o[k + 1])
      face(stone, [[o[k][0], o[k][1], 0], [o[k + 1][0], o[k + 1][1], 0], [o[k + 1][0], o[k + 1][1], H], [o[k][0], o[k][1], H]], ao)
      face(stone, [[w[k][0], w[k][1], 0], [w[k + 1][0], w[k + 1][1], 0], [w[k + 1][0], w[k + 1][1], H - 2], [w[k][0], w[k][1], H - 2]], neg(away(w[k], w[k + 1])))
      face(stone, [[o[k][0], o[k][1], H], [o[k + 1][0], o[k + 1][1], H], [w[k + 1][0], w[k + 1][1], H - 2], [w[k][0], w[k][1], H - 2]], [-ao[0] * 0.3, -ao[1] * 0.3, 1])
      const f = (t: number, z: number): V3 => [o[k][0] + (o[k + 1][0] - o[k][0]) * t + ao[0] * 0.06, o[k][1] + (o[k + 1][1] - o[k][1]) * t + ao[1] * 0.06, z]
      face(win, [f(0.2, 4.2), f(0.8, 4.2), f(0.8, 5.8), f(0.2, 5.8)], ao)
    }
    for (const [p, q, s] of [[o[0], w[0], 1], [o[n - 1], w[n - 1], -1]] as Array<[XY, XY, number]>) {
      const t: V3 = [q[1] - p[1], -(q[0] - p[0]), 0], l = Math.hypot(t[0], t[1])
      const nn: V3 = [(t[0] / l) * s, (t[1] / l) * s, 0]
      const q4: V3[] = [[p[0], p[1], 0], [q[0], q[1], 0], [q[0], q[1], H - 2], [p[0], p[1], H]]
      face(stone, q4, nn)
      face(stone, q4, neg(nn))
    }
    // the square stone towers at the arc's inner ends
    for (const c of [[-37.5, -121.5], [48.5, -119.5]] as XY[]) {
      const a = 0.45 * (c[0] > 0 ? -1 : 1)
      const u: XY = [Math.cos(a), Math.sin(a)]
      box(stone, c, u, 4, 4, 0, 15.4, false)
      box(stone, c, u, 4.3, 4.3, 15.2, 16.3, true)
      for (const nn of [[u[1], -u[0]], [-u[1], u[0]], u, [-u[0], -u[1]]] as XY[]) {
        const tt: XY = [-nn[1], nn[0]]
        const fc: XY = [c[0] + nn[0] * 4.06, c[1] + nn[1] * 4.06]
        for (const z of [6, 9.5, 12.5]) {
          const Q = (sx: number, h: number): V3 => [fc[0] + tt[0] * sx, fc[1] + tt[1] * sx, h]
          face(win, [Q(-0.45, z), Q(0.45, z), Q(0.45, z + 1.6), Q(-0.45, z + 1.6)], [nn[0], nn[1], 0])
        }
      }
    }
  }

  const lit = (_p: V3, n: V3) => (n[2] > 0.8 ? 0.25 : 0.85)
  return [
    { part: stone, material: { ...finish('travertine', 0xede3d3), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: membrane, material: { ...finish('membrane', 0xe9dccb), floodlight: () => 0.35 } },
    { part: steel, material: finish('roof-steel', 0x5b6169) },
    { part: seats, material: finish('seats', 0x8a8f96) },
  ]
}

if (import.meta.main) {
  const parts = build()
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  for (const { part, material } of parts) console.log(material.name, part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Tüpraş Stadium', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 322.5, elevation: 0, height: 33,
  })
  if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
  const out = new URL('../models/istanbul-vodafone-park.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
