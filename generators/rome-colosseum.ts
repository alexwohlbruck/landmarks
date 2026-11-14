/**
 * Colosseum (Colosseo, Flavian Amphitheatre), Rome: procedural, CC0-1.0.
 * bun generators/rome-colosseum.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/rome-colosseum.glb, the low model (6,500-triangle, 250 KB budget):
 *   every arch of the 80-bay rhythm is a real opening, 3 segments per
 *   semicircle; the outer wall's third storey and wall III's top storey
 *   have full reveals, the lower storeys show the dark of the vaulted
 *   ambulatory behind instead; no half-columns; fewer cavea walls (40 low,
 *   20 high), hypogeum walls and cells than the detail model.
 * - models/rome-colosseum.detail.glb, drawn from zoom 16: 8-segment arches
 *   with reveals and sills, smooth engaged half-columns on plinths and
 *   pedestals with capitals, full entablatures, the attic's pilasters, real
 *   windows and velarium consoles, wall II's arcades, wall III's stubs,
 *   80 stepped radial walls, the arcaded ring corridor and the hypogeum's
 *   cells.
 *
 * Map frame: x along the long axis (bearing 109.5, east-south-east), y
 * along the short axis (bearing 19.5), z up, metres; the placement's
 * bearing is 19.5. The origin is the centre of the oval, fitted to OSM's
 * rings (not the outline's centroid, which the missing south side pulls
 * north). y = 0 is the outside ground; elevation 0.
 *
 * Built AD 70-80. An oval of 80 bays round, in concentric rings: the outer
 * wall (wall I) of three arcaded storeys framed by engaged Tuscan, Ionic and
 * Corinthian half-columns under an attic with Corinthian pilasters, windows
 * in alternate bays and consoles for the velarium masts; wall II and wall
 * III of plain arcaded piers behind it; the cavea on radial walls; the
 * podium round the arena; the hypogeum under it.
 *
 * The ruin as it stands, which the model keeps:
 * - the full four-storey outer ring survives on the north only, from the
 *   east end of the long axis round to the west end (OSM way/136190595 etc.:
 *   bays 0.5 to 39.5 here; bay 0 is the east end, 20 north, 40 west);
 * - its east end is held by Stern's brick buttress (1806), a full-height
 *   wedge sloping down to the south; the west end by Valadier's (1820s):
 *   a sloping wedge from the third storey up, the two lower storeys running
 *   on one more bay to a sloping spur, and wall II two storeys high for one
 *   more to another spur;
 * - wall II stands two storeys behind the outer wall; above it the vaults
 *   are gone, so the third storey's arches open to the sky and the inner
 *   faces of the third storey and attic are stripped to brick;
 * - on the south the outer two rings are gone and wall III is the face:
 *   three storeys of plain arches, the second storey's taller and wider
 *   than the first's (4.3 x 8 m against 3.5 x 7 m), travertine piers with
 *   brick infill in some bays, the stubs of the lost radial walls at its
 *   piers, and a broken brick top at 32-36 m with a few big square windows
 *   and some bays broken down to 25.5-28 m;
 * - the attic's inner half is broken off along most of its length (a lip
 *   stands to the full height on the outside; the inner top drops 0.4-2.2
 *   m bay by bay), and its windows open right through;
 * - inside: the cavea as two dark sloping beds of broken vaults split by the
 *   ring corridor, with brick radial walls standing above them at heights
 *   varying wall to wall, broken in steps, and (detail) vault stubs
 *   spanning between some; the podium; the hypogeum as a maze of brick
 *   walls (curved walls following the arena, the central corridor and
 *   parallel walls, cross walls making cells) over a dark shadow deck 0.3 m
 *   above the arena ground; the rebuilt arena floor over the east end in
 *   pale wood.
 *
 * Published (Wikipedia, "Colosseum"): outer oval 189 x 156 m; outer wall
 * 48 m high; arena 87 x 55 m; 80 arches a storey; ground-floor arches
 * 4.2 m wide and 7.05 m high, the upper ones 6.45 m high; storeys about
 * 10.5, 11.85, 11.6 m and the attic 14 m.
 *
 * OSM (relation/1834818 "Colosseo", the outline, and its building:parts,
 * all replaced): relation/1834827 and 1834830 (48.5 m: the outer wall and
 * outer ambulatories, north), 1834828 (36 m: the ring whose outer face is
 * wall III on the south), 1834826 (24 m) and 1834825 (12 m, the cavea
 * zones), 1834829 (15 m, the lower cavea's radial walls), 1834831 and
 * 3371742 (hypogeum ruins), 19666834 and 19666836 (arena levels), 19666835
 * (the rebuilt floor over the east end). Measured from them, in this frame:
 * - the long axis at bearing 109.5 (ellipse fits of every ring agree
 *   within a degree);
 * - outer wall: semi-axes 94.5 x 76-77 (OSM) against the published
 *   94.5 x 78; the published 189 x 156 is used, every ring a parallel curve
 *   of it;
 * - wall III's face 13.3 m in from the outer face (OSM 162.4 x 128.9 m);
 *   cavea zone edges at about 21 and 29 m in; the arena edge 50.5 m in
 *   (OSM north edge of the arena at y 28-29);
 * - the outer wall's ends, the 36 m and 48.5 m heights, the deck's west
 *   edge (x = 20).
 *
 * Estimated (from the photos below): wall II at 6.9-8.9 m and wall III
 * 13.3-15.5 m in; wall III's arches (4 m wide at the first two storeys,
 *   3.5 m at the third) and its broken top; the buttresses' profiles; the
 *   cavea's profile (4.6 m at the podium, 13 m at the corridor, 21 m at the
 *   upper corridor, 24 m behind) and how much of it survives (62-100 %, more
 *   on the north); the radial walls' and corridor's heights; the hypogeum's
 *   plan (curved outer walls following the arena, straight walls along the
 *   axis, cells every 4.4 m: simplified from OSM relation/3371742 and the
 *   interior photos).
 * Invented: the hypogeum's depth. Its walls are drawn 2 m above the arena
 *   level instead of 6 m down, over a dark deck that stands for the pit's
 *   shadow: the map's ground fills the arena and a pit below it would be
 *   hidden. The rebuilt floor sits on the walls.
 *
 * Terrain: Mapterhorn here is z13 (about 15 m a pixel); it slopes about
 * 6.5 m from the west end up to the east across the footprint (the valley
 * between the Palatine, Oppian and Caelian). The real ground round the
 * monument is near level; the map drapes the base. `tools/terrain.ts check`
 * passes for both levels of detail.
 *
 * Colours (daylight photos, pulled to the palette's lightness): outer
 * travertine warm cream; wall III, the reveals and the podium a greyer
 * weathered travertine (also on a share of the ground storey's bays and
 * columns, as the photos' darker patches); brick tan-brown for the
 * buttresses, the stripped inner faces, the cavea and the hypogeum; the
 * vaults seen through the arches a dark warm grey; the rebuilt deck pale
 * wood. Night: the outer travertine (and in the detail model the brick) is
 * floodlit (_FLOODLIGHT); the low model leaves brick unlit to stay in 250 KB,
 * and the vaults behind the north arcades are `window-vault`, so the map
 * glows them warm, as the lit arcades are at night (Ank Kumar's night
 * photos); wall III's interior stays dark.
 *
 * Photos (Wikimedia Commons, all evidence):
 * - "Rome Colosseum exterior 2.jpg", Nicholas Hartmann, CC BY-SA 4.0:
 *   https://commons.wikimedia.org/wiki/File:Rome_Colosseum_exterior_2.jpg
 *   (north face close: orders, attic, consoles, windows)
 * - "Rome Colosseum exterior 1.jpg", Nicholas Hartmann, CC BY-SA 4.0:
 *   https://commons.wikimedia.org/wiki/File:Rome_Colosseum_exterior_1.jpg
 *   (south face: wall III's three storeys and stubs)
 * - "Rome Colosseum exterior panorama.jpg", Nicholas Hartmann, CC BY-SA 4.0:
 *   https://commons.wikimedia.org/wiki/File:Rome_Colosseum_exterior_panorama.jpg
 *   (west-south-west: Valadier's buttress, the step-down to wall III)
 * - "Foto aerea del Colosseo.jpg", Aeroshot.it, CC BY-SA 4.0:
 *   https://commons.wikimedia.org/wiki/File:Foto_aerea_del_Colosseo.jpg
 *   (aerial from the south-south-east: plan, Stern's buttress, interior)
 * - "Colosseum Roma 2009.jpg", Urse Ovidiu, public domain:
 *   https://commons.wikimedia.org/wiki/File:Colosseum_Roma_2009.jpg
 *   (north-north-west: the whole surviving outer wall)
 * - "Colosseum-Rome-May-2009.jpg", Acediscovery, CC BY 4.0:
 *   https://commons.wikimedia.org/wiki/File:Colosseum-Rome-May-2009.jpg
 * - "Colosseum and Arch of Constantine seen from Palatine.jpg",
 *   Livioandronico2013, CC BY-SA 4.0:
 *   https://commons.wikimedia.org/wiki/File:Colosseum_and_Arch_of_Constantine_seen_from_Palatine.jpg
 * - "Colosseum of Rome and Roman forum.jpg", Wilfredor, CC0:
 *   https://commons.wikimedia.org/wiki/File:Colosseum_of_Rome_and_Roman_forum.jpg
 * - "Colosseum seen from Palatine Hill (1).jpg", Tournasol7, CC BY-SA 4.0:
 *   https://commons.wikimedia.org/wiki/File:Colosseum_seen_from_Palatine_Hill_(1).jpg
 * - "Rome Colosseum interior panorama 1.jpg", Nicholas Hartmann, CC BY-SA 4.0:
 *   https://commons.wikimedia.org/wiki/File:Rome_Colosseum_interior_panorama_1.jpg
 *   (cavea, ring corridor, hypogeum, rebuilt floor)
 * - "Colosseum exterior at night, Rome, Italy (Ank Kumar) 11.jpg", Ank
 *   Kumar, CC BY-SA 4.0:
 *   https://commons.wikimedia.org/wiki/File:Colosseum_exterior_at_night,_Rome,_Italy_(Ank_Kumar)_11.jpg
 * Look-only references: none.
 *
 * Doubts: the east end's plan beyond Stern's buttress (wall II's stepped
 * remains there are drawn short); the north interior above the second
 * storey (drawn as the vault tops; the real one has stairs and the upper
 * gallery's stumps); the cavea is a schematic of the ruin, not a survey;
 * the hypogeum is raised (above).
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'

// ---------------------------------------------------------------------------
// Levels of detail
// ---------------------------------------------------------------------------

type Lod = {
  detail: boolean
  /** Segments per semicircle: outer arcade, inner arcades. */
  seg: number
  segIn: number
  /** Radial walls of the cavea: every `radialStep` piers. */
  radialStep: number
}
const LOW: Lod = { detail: false, seg: 3, segIn: 3, radialStep: 2 }
const DETAIL: Lod = { detail: true, seg: 8, segIn: 6, radialStep: 1 }

// ---------------------------------------------------------------------------
// The oval: an ellipse of 189 x 156 m, every ring a parallel curve of it
// ---------------------------------------------------------------------------

/** Semi-axes of the outer face: x along the long axis (east-south-east). */
const A = 94.5, B = 78
/** 80 bays round, bay 0 centred on the east end of the long axis. */
const NB = 80
const TAB = 8192
const cum: number[] = [0]
{
  let px = A, py = 0
  for (let i = 1; i <= TAB; i++) {
    const t = (2 * Math.PI * i) / TAB
    const x = A * Math.cos(t), y = B * Math.sin(t)
    cum.push(cum[i - 1] + Math.hypot(x - px, y - py))
    px = x
    py = y
  }
}
const PER = cum[TAB]

/** Ellipse parameter at bay coordinate s (equal arc length along the outer face). */
function tOf(s: number) {
  const x = ((((s % NB) + NB) % NB) * PER) / NB
  let lo = 0, hi = TAB
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1
    if (cum[m] <= x) lo = m
    else hi = m
  }
  const f = (x - cum[lo]) / (cum[hi] - cum[lo] || 1)
  return (2 * Math.PI * (lo + f)) / TAB
}

type Frame = { e: [number, number]; n: V3; tg: V3 }
const frameCache = new Map<number, Frame>()
function frame(s: number): Frame {
  const key = Math.round(s * 1e6)
  const hit = frameCache.get(key)
  if (hit) return hit
  const t = tOf(s)
  const c = Math.cos(t), si = Math.sin(t)
  const nx = B * c, ny = A * si, l = Math.hypot(nx, ny)
  const n: V3 = [nx / l, ny / l, 0]
  const f: Frame = { e: [A * c, B * si], n, tg: [-n[1], n[0], 0] }
  frameCache.set(key, f)
  return f
}
/** A point at bay coordinate s, d metres in from the outer face, height z. */
function P(s: number, d: number, z: number): V3 {
  const f = frame(s)
  return [f.e[0] - d * f.n[0], f.e[1] - d * f.n[1], z]
}
const nOut = (s: number) => frame(s).n
const nIn = (s: number): V3 => scale(frame(s).n, -1)
/** Bay length along the ring d in from the outer face, at bay s. */
function bayLen(s: number, d: number) {
  const a = P(s - 0.5, d, 0), b = P(s + 0.5, d, 0)
  return Math.hypot(a[0] - b[0], a[1] - b[1])
}

// ---------------------------------------------------------------------------
// Faces, wound to face the way a hint says
// ---------------------------------------------------------------------------

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scale = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}
const UP: V3 = [0, 0, 1], DOWN: V3 = [0, 0, -1]

/** Newell normal of a planar-ish loop, turned to agree with the hint. */
function faceNormal(pts: V3[], hint: V3): V3 {
  let nx = 0, ny = 0, nz = 0
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    nx += (a[1] - b[1]) * (a[2] + b[2])
    ny += (a[2] - b[2]) * (a[0] + b[0])
    nz += (a[0] - b[0]) * (a[1] + b[1])
  }
  let n = norm([nx, ny, nz])
  if (dot(n, hint) < 0) n = [-n[0], -n[1], -n[2]]
  return n
}
/** A triangle facing `hint`; with `n`, that shared face normal (so a face's triangles weld). */
function tri(p: Part, a: V3, b: V3, c: V3, hint: V3, n?: V3) {
  const g = cross(sub(b, a), sub(c, a))
  const l = Math.hypot(g[0], g[1], g[2])
  if (l < 1e-6) return
  let m: V3 = n ?? [g[0] / l, g[1] / l, g[2] / l]
  if (!n && dot(m, hint) < 0) m = [-m[0], -m[1], -m[2]]
  p.tri(a, b, c, [0, 0], [0, 0], [0, 0], [m, m, m])
}
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, hint: V3) {
  const n = faceNormal([a, b, c, d], hint)
  tri(p, a, b, c, hint, n)
  tri(p, a, c, d, hint, n)
}
/** A quad with a normal per corner (smooth along the ring, so bays weld). */
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, na: V3, nb: V3, nc: V3, nd: V3) {
  for (const [x, y, z, nx, ny, nz] of [[a, b, c, na, nb, nc], [a, c, d, na, nc, nd]] as [V3, V3, V3, V3, V3, V3][]) {
    const g = cross(sub(y, x), sub(z, x))
    if (Math.hypot(g[0], g[1], g[2]) < 1e-6) continue
    p.tri(x, y, z, [0, 0], [0, 0], [0, 0], [nx, ny, nz])
  }
}

type P2 = [number, number]
/** Ear clipping of a simple polygon; collinear corners are dropped. */
function earclip(pts: P2[]): [number, number, number][] {
  const area = pts.reduce((s, p, i) => {
    const q = pts[(i + 1) % pts.length]
    return s + p[0] * q[1] - q[0] * p[1]
  }, 0)
  let idx = pts.map((_, i) => i)
  if (area < 0) idx.reverse()
  const out: [number, number, number][] = []
  const cr = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: P2, a: P2, b: P2, c: P2) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 20000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = pts[ia], b = pts[ib], c = pts[ic]
      const k = cr(a, b, c)
      if (Math.abs(k) < 1e-9) {
        idx.splice(i, 1)
        cut = true
        break
      }
      if (k < 0) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inside(pts[j], a, b, c))) continue
      out.push([ia, ib, ic])
      idx.splice(i, 1)
      cut = true
      break
    }
    if (!cut) {
      out.push([idx[0], idx[1], idx[2]])
      idx.splice(1, 1)
    }
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
/** A flat polygon given in 2D, placed by `at`, facing `hint`. */
function poly(p: Part, pts: P2[], at: (u: number, v: number) => V3, hint: V3, smooth?: (u: number, v: number) => V3) {
  const clean = pts.filter((q, i) => {
    const r = pts[(i + 1) % pts.length]
    return Math.abs(q[0] - r[0]) > 1e-7 || Math.abs(q[1] - r[1]) > 1e-7
  })
  const v3 = clean.map((q) => at(q[0], q[1]))
  if (smooth) {
    const ns = clean.map((q) => smooth(q[0], q[1]))
    for (const [a, b, c] of earclip(clean)) {
      const g = cross(sub(v3[b], v3[a]), sub(v3[c], v3[a]))
      if (Math.hypot(g[0], g[1], g[2]) < 1e-6) continue
      p.tri(v3[a], v3[b], v3[c], [0, 0], [0, 0], [0, 0], [ns[a], ns[b], ns[c]])
    }
    return
  }
  const n = faceNormal(v3, hint)
  for (const [a, b, c] of earclip(clean)) tri(p, v3[a], v3[b], v3[c], hint, n)
}

// ---------------------------------------------------------------------------
// Ring pieces
// ---------------------------------------------------------------------------

/** Faces of a ring band between s0 and s1, d0 (outer) to d1 (inner). */
type BandOpts = { front?: Part; back?: Part; top?: Part; bottom?: Part; step?: number }
function band(s0: number, s1: number, d0: number, d1: number, z0: number | ((s: number) => number), z1: number | ((s: number) => number), o: BandOpts) {
  const step = o.step ?? 1
  const n = Math.max(1, Math.round((s1 - s0) / step))
  const lo = typeof z0 === 'number' ? () => z0 : z0
  const hi = typeof z1 === 'number' ? () => z1 : z1
  for (let i = 0; i < n; i++) {
    const a = s0 + ((s1 - s0) * i) / n, b = s0 + ((s1 - s0) * (i + 1)) / n
    const out = frame((a + b) / 2).n, inw = scale(out, -1)
    void out, inw
    if (o.front) quadN(o.front, P(a, d0, lo(a)), P(b, d0, lo(b)), P(b, d0, hi(b)), P(a, d0, hi(a)), nOut(a), nOut(b), nOut(b), nOut(a))
    if (o.back) quadN(o.back, P(a, d1, lo(a)), P(b, d1, lo(b)), P(b, d1, hi(b)), P(a, d1, hi(a)), nIn(a), nIn(b), nIn(b), nIn(a))
    if (o.top) quad(o.top, P(a, d0, hi(a)), P(b, d0, hi(b)), P(b, d1, hi(b)), P(a, d1, hi(a)), UP)
    if (o.bottom) quad(o.bottom, P(a, d0, lo(a)), P(b, d0, lo(b)), P(b, d1, lo(b)), P(a, d1, lo(a)), DOWN)
  }
}
/** A profile in (out, z) swept along the ring: out = metres outward of d = 0. */
function sweep(p: Part, s0: number, s1: number, prof: P2[], step = 1, d = 0) {
  const n = Math.max(1, Math.round((s1 - s0) / step))
  for (let i = 0; i < n; i++) {
    const a = s0 + ((s1 - s0) * i) / n, b = s0 + ((s1 - s0) * (i + 1)) / n
    for (let k = 0; k < prof.length - 1; k++) {
      const [o0, z0] = prof[k], [o1, z1] = prof[k + 1]
      const l = Math.hypot(z1 - z0, o1 - o0) || 1
      const hn = (s: number) => norm(add(scale(frame(s).n, (z1 - z0) / l), scale(UP, -(o1 - o0) / l)))
      quadN(p, P(a, d - o0, z0), P(b, d - o0, z0), P(b, d - o1, z1), P(a, d - o1, z1), hn(a), hn(b), hn(b), hn(a))
    }
  }
}
/** End face of a band at s, closing d0..d1, z0..z1; dir = +1 faces +s. */
function cap(p: Part, s: number, d0: number, d1: number, z0: number, z1: number, dir: number) {
  quad(p, P(s, d0, z0), P(s, d1, z0), P(s, d1, z1), P(s, d0, z1), scale(frame(s).tg, dir))
}
/**
 * A wall slab whose elevation is a polygon in (s, z), between d0 and d1:
 * buttresses and broken ends. Faces: front, back, and the edges.
 */
function slab(p: Part, pts: P2[], d0: number, d1: number, faces = { front: true, back: true, edges: true }) {
  if (faces.front) poly(p, pts, (u, v) => P(u, d0, v), frame(pts[0][0]).n)
  if (faces.back) poly(p, pts, (u, v) => P(u, d1, v), scale(frame(pts[0][0]).n, -1))
  if (!faces.edges) return
  const area = pts.reduce((s, q, i) => s + q[0] * pts[(i + 1) % pts.length][1] - pts[(i + 1) % pts.length][0] * q[1], 0)
  const sg = area > 0 ? 1 : -1
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    const L = bayLen((a[0] + b[0]) / 2, (d0 + d1) / 2)
    const ds = (b[0] - a[0]) * L, dz = b[1] - a[1]
    // Outward normal of a CCW edge in (s, z) is (dz, -ds).
    const tg = frame((a[0] + b[0]) / 2).tg
    const h = add(scale(tg, sg * dz), scale(UP, -sg * ds))
    quad(p, P(a[0], d0, a[1]), P(b[0], d0, b[1]), P(b[0], d1, b[1]), P(a[0], d1, a[1]), h)
  }
}
/** A wall standing across the ring at s (a radial wall), profile in (d, z), half-thickness h metres. */
function fin(p: Part, s: number, h: number, prof: P2[], ends = true, nTop = prof.length) {
  const f = frame(s)
  const at = (d: number, z: number, side: number): V3 => add(P(s, d, z), scale(f.tg, side * h))
  poly(p, prof, (d, z) => at(d, z, 1), f.tg)
  poly(p, prof, (d, z) => at(d, z, -1), scale(f.tg, -1))
  const area = prof.reduce((sm, q, i) => sm + q[0] * prof[(i + 1) % prof.length][1] - prof[(i + 1) % prof.length][0] * q[1], 0)
  const sg = area > 0 ? 1 : -1
  for (let i = 0; i < prof.length; i++) {
    const a = prof[i], b = prof[(i + 1) % prof.length]
    const dd = b[0] - a[0], dz = b[1] - a[1]
    // Outward in (d, z) is (dz, -dd)*sg; +d points along -n.
    const h3 = add(scale(f.n, -sg * dz), scale(UP, -sg * dd))
    if (!ends && Math.abs(dd) < 1e-6) continue
    if (a[1] < 1e-6 && b[1] < 1e-6) continue // the foot
    if (i >= nTop) continue // hidden under the bed
    quad(p, at(a[0], a[1], 1), at(b[0], b[1], 1), at(b[0], b[1], -1), at(a[0], a[1], -1), h3)
  }
}
/** A small block in the local frame at bay s: offsets along tg (u), out of the face (o), z. */
function block(p: Part, s: number, d: number, u0: number, u1: number, o0: number, o1: number, z0: number, z1: number, faces = { top: true, bottom: false, back: false }) {
  const f = frame(s)
  const at = (u: number, o: number, z: number) => add(add(P(s, d, z), scale(f.tg, u)), scale(f.n, o))
  const out = f.n, tg = f.tg
  quad(p, at(u0, o1, z0), at(u1, o1, z0), at(u1, o1, z1), at(u0, o1, z1), out)
  quad(p, at(u0, o0, z0), at(u0, o1, z0), at(u0, o1, z1), at(u0, o0, z1), scale(tg, -1))
  quad(p, at(u1, o0, z0), at(u1, o1, z0), at(u1, o1, z1), at(u1, o0, z1), tg)
  if (faces.top) quad(p, at(u0, o0, z1), at(u1, o0, z1), at(u1, o1, z1), at(u0, o1, z1), UP)
  if (faces.bottom) quad(p, at(u0, o0, z0), at(u1, o0, z0), at(u1, o1, z0), at(u0, o1, z0), DOWN)
  if (faces.back) quad(p, at(u0, o0, z0), at(u1, o0, z0), at(u1, o0, z1), at(u0, o0, z1), scale(out, -1))
}
/** An engaged half-column on the face at bay s: smooth half-cylinder. */
function halfColumn(p: Part, s: number, d: number, r: number, z0: number, z1: number, seg: number) {
  const f = frame(s)
  const pt = (a: number, z: number): V3 => add(P(s, d, z), add(scale(f.n, r * Math.cos(a)), scale(f.tg, r * Math.sin(a))))
  const nr = (a: number): V3 => norm(add(scale(f.n, Math.cos(a)), scale(f.tg, Math.sin(a))))
  for (let k = 0; k < seg; k++) {
    const a0 = -Math.PI / 2 + (Math.PI * k) / seg, a1 = -Math.PI / 2 + (Math.PI * (k + 1)) / seg
    const n0 = nr(a0), n1 = nr(a1)
    p.tri(pt(a0, z0), pt(a1, z0), pt(a1, z1), [0, 0], [0, 0], [0, 0], [n0, n1, n1])
    p.tri(pt(a0, z0), pt(a1, z1), pt(a0, z1), [0, 0], [0, 0], [0, 0], [n0, n1, n0])
  }
}

// ---------------------------------------------------------------------------
// The arcade bay
// ---------------------------------------------------------------------------

type Arch = { w: number; zs: number; sill: number }
type BayParts = { front?: Part; back?: Part; reveal?: Part; sill?: Part; base?: Part }
/**
 * One bay of an arcaded wall centred on bay sc, from d0 (front) to d1
 * (back), z from zb to zt, with a semicircular opening of half-width w
 * (metres, on the front face) springing at zs from a sill.
 */
function bay(sc: number, d0: number, d1: number, zb: number, zt: number, a: Arch, seg: number, o: BayParts) {
  const fw = a.w / bayLen(sc, d0)
  const out = frame(sc).n, inw = scale(out, -1), tg = frame(sc).tg
  const arc: P2[] = []
  for (let k = 0; k <= seg; k++) {
    const phi = Math.PI - (Math.PI * k) / seg
    arc.push([sc + fw * Math.cos(phi), a.zs + a.w * Math.sin(phi)])
  }
  const shape: P2[] = [[sc - 0.5, a.sill], [sc - fw, a.sill], ...arc, [sc + fw, a.sill], [sc + 0.5, a.sill], [sc + 0.5, zt], [sc - 0.5, zt]]
  const faces: Array<[Part | undefined, number, V3]> = [[o.front, d0, out], [o.back, d1, inw]]
  for (const [part, d, h] of faces) {
    if (!part) continue
    const sign = d === d0 ? 1 : -1
    poly(part, shape, (u, v) => P(u, d, v), h, (u) => scale(frame(u).n, sign))
    const l = scale(frame(sc - 0.5).n, sign), r = scale(frame(sc + 0.5).n, sign)
    if (a.sill > zb + 1e-6) quadN(d === d0 && o.base ? o.base : part, P(sc - 0.5, d, zb), P(sc + 0.5, d, zb), P(sc + 0.5, d, a.sill), P(sc - 0.5, d, a.sill), l, r, r, l)
  }
  if (o.reveal) {
    const r = o.reveal
    quad(r, P(sc - fw, d0, a.sill), P(sc - fw, d0, a.zs), P(sc - fw, d1, a.zs), P(sc - fw, d1, a.sill), tg)
    quad(r, P(sc + fw, d0, a.sill), P(sc + fw, d0, a.zs), P(sc + fw, d1, a.zs), P(sc + fw, d1, a.sill), scale(tg, -1))
    // The soffit, smooth round the arch so its segments share corners.
    const nk = arc.map((q) => norm(sub(P(sc, (d0 + d1) / 2, a.zs), P(q[0], (d0 + d1) / 2, q[1]))))
    for (let k = 0; k < seg; k++) {
      const p0 = arc[k], p1 = arc[k + 1]
      quadN(r, P(p0[0], d0, p0[1]), P(p1[0], d0, p1[1]), P(p1[0], d1, p1[1]), P(p0[0], d1, p0[1]), nk[k], nk[k + 1], nk[k + 1], nk[k])
    }
  }
  if (o.sill && a.sill > 0.01) quad(o.sill, P(sc - fw, d0, a.sill), P(sc + fw, d0, a.sill), P(sc + fw, d1, a.sill), P(sc - fw, d1, a.sill), UP)
}

/**
 * One bay of solid wall from z0 to z1 with a rectangular opening of
 * half-width hw (metres) from wz0 to wz1: four panels on each face, and the
 * opening's reveals.
 */
function windowBay(k: number, d0: number, d1: number, z0: number, z1: number, hw: number, wz0: number, wz1: number, front: Part, back: Part | undefined, reveal: Part | undefined, z1b = z1) {
  const s0 = k - 0.5, s1 = k + 0.5
  const fw = hw / bayLen(k, d0)
  const rects: Array<[number, number, number, number]> = [[s0, s1, z0, wz0], [s0, s1, wz1, z1], [s0, k - fw, wz0, wz1], [k + fw, s1, wz0, wz1]]
  for (const [a, b, c, d] of rects) {
    if (d - c < 1e-3) continue
    const pts: P2[] = [[a, c], [b, c], [b, d], [a, d]]
    poly(front, pts, (u, v) => P(u, d0, v), frame(k).n, (u) => nOut(u))
    const db = d === z1 ? z1b : d
    if (back && db - c > 1e-3) poly(back, [[a, c], [b, c], [b, db], [a, db]], (u, v) => P(u, d1, v), scale(frame(k).n, -1), (u) => nIn(u))
  }
  if (!reveal) return
  const tg = frame(k).tg
  quad(reveal, P(k - fw, d0, wz0), P(k + fw, d0, wz0), P(k + fw, d1, wz0), P(k - fw, d1, wz0), UP)
  quad(reveal, P(k - fw, d0, wz1), P(k + fw, d0, wz1), P(k + fw, d1, wz1), P(k - fw, d1, wz1), DOWN)
  quad(reveal, P(k - fw, d0, wz0), P(k - fw, d0, wz1), P(k - fw, d1, wz1), P(k - fw, d1, wz0), tg)
  quad(reveal, P(k + fw, d0, wz0), P(k + fw, d0, wz1), P(k + fw, d1, wz1), P(k + fw, d1, wz0), scale(tg, -1))
}

/** Deterministic noise in [0, 1). */
function rnd(i: number, salt = 0) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

// ---------------------------------------------------------------------------
// Dimensions
// ---------------------------------------------------------------------------

/** Outer wall (wall I) storeys: base, top, entablature base, arch. */
const TIERS = [
  { z0: 0, z1: 10.5, ent: 8.6, arch: { w: 2.2, zs: 5.2, sill: 0 }, col: 0.55, colBase: 0 },
  { z0: 10.5, z1: 22.35, ent: 20.6, arch: { w: 2.2, zs: 16.75, sill: 12.2 }, col: 0.5, colBase: 12.2 },
  { z0: 22.35, z1: 33.95, ent: 32.3, arch: { w: 2.2, zs: 28.55, sill: 24.0 }, col: 0.47, colBase: 24.0 },
]
const ATTIC = { z0: 33.95, z1: 48.5, pil0: 35.0, pil1: 46.0, corn: 46.4 }
/** Ring offsets from the outer face (metres). */
const W1 = [0, 2.4] // outer wall
const W2 = [6.9, 8.9] // second ring of piers
const W3 = [13.3, 15.5] // third ring: the south side's face today
const PODIUM = [46.0, 50.5] // podium wall; the arena edge at 50.5
const ARENA = 50.5
/** The surviving outer ring, in bays (0 = east end of the long axis, 20 = north). */
const OUT_E = 0.5, OUT_W = 39.5, OUT_W_LOW = 40.5
const W2_E = -1.5, W2_W = 41.5
/** Cavea top profile (d, z) before the ruin takes its share. */
const caveaZ = (d: number) => {
  const pts: P2[] = [[46, 4.6], [29, 13], [21, 21], [15, 24]]
  for (let i = 0; i < pts.length - 1; i++) {
    const [da, za] = pts[i], [db, zb] = pts[i + 1]
    if (d >= db) return za + ((da - d) / (da - db)) * (zb - za)
  }
  return 24
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

function build(L: Lod) {
  const trav = new Part() // outer travertine face
  const weath = new Part() // weathered travertine: inner rings, podium, back faces
  const brick = new Part() // brick buttresses, cavea, hypogeum
  const shade = new Part() // the dark of vaults seen through the arches (lit warm at night)
  const dark = new Part() // unlit shadow: the cavea's open corridors, the attic's windows
  const deck = new Part() // the reconstructed arena floor
  const seg = L.seg

  // ---- Wall I, the outer wall: three arcaded storeys and the attic ----
  for (let ti = 0; ti < 3; ti++) {
    const T = TIERS[ti]
    const sEnd = ti < 2 ? OUT_W_LOW : OUT_W
    for (let k = Math.ceil(OUT_E + 0.5); k + 0.5 <= sEnd + 1e-6; k++) {
      // Weathering: the lowest storey and odd patches are greyer.
      const face = ti === 0 && rnd(k, 1) < 0.5 ? weath : trav
      bay(k, W1[0], W1[1], T.z0, T.z1, T.arch, seg, {
        front: face,
        back: ti === 2 ? brick : undefined, // the lower storeys' backs face the vaulted ambulatory only; above, the stripped inner face is brick
        // Lower storeys: reveals in the vaults' shadow (left out of the low
        // model, which shows the dark of wall II behind instead).
        reveal: ti === 2 ? weath : L.detail ? shade : undefined,
        sill: L.detail ? weath : undefined,
      })
    }
    // Half-columns at the piers.
    for (let k = Math.ceil(OUT_E + 0.5) - 0.5; k <= sEnd + 1e-6; k++) {
      const r = T.col
      const zc0 = T.colBase, zc1 = T.ent
      const colPart = rnd(k, 2 + ti) < 0.25 ? weath : trav
      if (L.detail) {
        // Plinth/pedestal, shaft, capital.
        if (ti > 0) block(colPart, k, 0, -0.85, 0.85, 0, 0.75, T.z0, T.colBase)
        block(colPart, k, 0, -r - 0.18, r + 0.18, 0, r + 0.18, zc0, zc0 + 0.45)
        halfColumn(colPart, k, 0, r, zc0 + 0.45, zc1 - 0.6, 8)
        block(colPart, k, 0, -r - 0.2, r + 0.2, 0, r + 0.2, zc1 - 0.6, zc1)
      }
      // The low model leaves the half-columns out: at its zooms they are a
      // pixel wide, and the cornices carry the storeys.
    }
    // Entablature and cornice.
    const s0 = OUT_E, s1 = sEnd
    if (L.detail) {
      // Architrave-frieze band flush with the columns, cornice lip on top.
      sweep(trav, s0, s1, [[0, T.ent], [0.62, T.ent], [0.62, T.z1 - 0.55], [0.95, T.z1 - 0.4], [0.95, T.z1], [0, T.z1]])
      // Balustrade/pedestal band at the foot of the upper storeys.
      if (ti > 0) sweep(weath, s0, s1, [[0, T.z0], [0.3, T.z0], [0.3, T.colBase - 0.25], [0.45, T.colBase - 0.1], [0.45, T.colBase], [0, T.colBase]])
    } else {
      sweep(trav, s0, s1, [[0, T.ent], [0.75, T.z1]])
    }
  }

  // The attic: solid wall, Corinthian pilasters, windows in alternate bays,
  // three consoles a bay for the velarium masts, and the crowning cornice.
  {
    const z0 = ATTIC.z0, z1 = ATTIC.z1
    // The inner half of the attic's top is broken off, bay by bay.
    const zin = (k0: number) => {
      const k = L.detail ? k0 : 2 * Math.floor((k0 + 1) / 2)
      return rnd(k, 41) < 0.6 ? z1 - 0.4 - 1.8 * rnd(k, 42) : z1
    }
    const LIP = 1.0
    for (let k = Math.ceil(OUT_E + 0.5); k + 0.5 <= OUT_W + 1e-6; k++) {
      const zi = zin(k)
      if (k % 2 === 0) {
        // The big windows, in alternate bays, open right through.
        windowBay(k, W1[0], W1[1], z0, z1, 0.9, 37.2, 39.9, trav, brick, L.detail ? weath : undefined, zi)
      } else if (L.detail) {
        // The other bays: a small opening low in the attic.
        windowBay(k, W1[0], W1[1], z0, z1, 0.45, 35.3, 36.3, trav, brick, weath, zi)
      } else {
        band(k - 0.5, k + 0.5, W1[0], W1[1], z0, z1, { front: trav })
        band(k - 0.5, k + 0.5, W1[0], W1[1], z0, zi, { back: brick })
      }
      band(k - 0.5, k + 0.5, LIP, W1[1], zi, zi, { top: brick })
      if (zi < z1 - 0.01) band(k - 0.5, k + 0.5, LIP, LIP, zi, z1, { back: brick })
      const zn = zin(k + 1)
      if (k + 1.5 <= OUT_W + 1e-6 && Math.abs(zn - zi) > 0.01) cap(brick, k + 0.5, LIP, W1[1], Math.min(zi, zn), Math.max(zi, zn), zn > zi ? -1 : 1)
    }
    // Pilasters.
    for (let k = Math.ceil(OUT_E + 0.5) - 0.5; k <= OUT_W + 1e-6; k++) {
      if (L.detail) {
        block(trav, k, 0, -0.55, 0.55, 0, 0.3, ATTIC.pil0, ATTIC.pil1 - 0.5, { top: false, bottom: false, back: false })
        block(trav, k, 0, -0.68, 0.68, 0, 0.42, ATTIC.pil1 - 0.5, ATTIC.pil1)
        block(trav, k, 0, -0.68, 0.68, 0, 0.42, z0, ATTIC.pil0)
      } else {
        block(trav, k, 0, -0.55, 0.55, 0, 0.35, z0, ATTIC.pil1, { top: false, bottom: false, back: false })
      }
    }
    // Consoles: three per bay, between the pilasters, under the cornice.
    if (L.detail) {
      for (let k = Math.ceil(OUT_E + 0.5); k + 0.5 <= OUT_W + 1e-6; k++) {
        const Lk = bayLen(k, 0)
        for (const u of [-0.25, 0, 0.25]) block(trav, k, 0, u * Lk - 0.3, u * Lk + 0.3, 0, 0.55, 43.6, 44.5, { top: true, bottom: true, back: false })
      }
    }
    // The crowning cornice and the attic's top.
    if (L.detail) sweep(trav, OUT_E, OUT_W, [[0, ATTIC.corn], [0.45, ATTIC.corn], [0.45, 47.4], [0.8, 47.7], [0.8, z1], [-1.0, z1]])
    else sweep(trav, OUT_E, OUT_W, [[0, ATTIC.corn], [0.75, z1], [-1.0, z1]], 2)
  }

  // ---- The broken ends of the outer ring ----
  // Stern's buttress (1806), east: a brick wedge against the cut end of the
  // outer wall, full height, its face sloping down to the south.
  {
    const s = OUT_E
    const reach = (z: number) => 1.7 - (1.35 * z) / ATTIC.z1
    const pts: P2[] = [[s, 0], [s, ATTIC.z1], [s - reach(ATTIC.z1), ATTIC.z1], [s - reach(0), 0]]
    if (L.detail) {
      // Stepped like the photos: a set-back every storey.
      const steps: P2[] = [[s, 0], [s, ATTIC.z1]]
      const zs = [ATTIC.z1, 33.95, 22.35, 10.5, 0]
      for (let i = 0; i < zs.length - 1; i++) {
        steps.push([s - reach(zs[i]), zs[i]])
        steps.push([s - reach(zs[i + 1]) + 0.05, zs[i + 1] + 0.6])
        steps.push([s - reach(zs[i + 1]), zs[i + 1] + 0.6])
      }
      steps.pop()
      steps.push([s - reach(0), 0])
      slab(brick, steps, -1.2, 3.6)
    } else slab(brick, pts, -1.2, 3.6, { front: true, back: true, edges: true })
  }
  // Valadier's buttress (1820s), west: the full-height wall ends in a brick
  // wedge from the third storey up; the two lower storeys run on one more
  // bay and end in a sloping brick spur, as does the second ring beyond.
  {
    const s = OUT_W
    slab(weath, [[s, TIERS[2].z0], [s + 1.05, TIERS[2].z0], [s + 0.2, ATTIC.z1], [s, ATTIC.z1]], -1.0, 3.0)
    const s2 = OUT_W_LOW
    slab(weath, [[s2, 0], [s2 + 0.85, 0], [s2 + 0.18, TIERS[1].z1], [s2, TIERS[1].z1]], -1.0, 3.0)
    const s3 = W2_W
    slab(weath, [[s3, 0], [s3 + 0.7, 0], [s3 + 0.15, TIERS[1].z1], [s3, TIERS[1].z1]], W2[0] - 0.8, W2[1] + 0.6)
    // The cut tiers' top and the open ambulatory end above the lower tiers.
    band(OUT_W, OUT_W_LOW, W1[0], W1[1], 0, TIERS[1].z1, { top: weath })
  }

  // ---- Wall II and the ambulatory floors behind the outer wall ----
  // Wall II stands two storeys behind the outer wall; above that the vaults
  // are gone, so the third storey's arches show the sky (photos from the
  // north). Runs along the ring: [s0, s1, storeys].
  const w2Runs: Array<[number, number, number]> = [[W2_E, -0.5, 1], [-0.5, W2_W, 2]]
  for (const [s0, s1, nt] of w2Runs) {
    const zt = TIERS[nt - 1].z1
    if (L.detail) {
      for (let ti = 0; ti < nt; ti++) {
        const T = TIERS[ti]
        const a: Arch = { w: 1.9, zs: T.arch.zs, sill: T.arch.sill }
        // Whole bays only; partial bays are solid.
        let k = Math.ceil(s0 + 0.5)
        if (k - 0.5 > s0 + 1e-6) band(s0, k - 0.5, W2[0], W2[1], T.z0, T.z1, { front: shade })
        for (; k + 0.5 <= s1 + 1e-6; k++) bay(k, W2[0], W2[1], T.z0, T.z1, a, L.segIn, { front: shade, reveal: shade })
        if (k - 0.5 < s1 - 1e-6) band(k - 0.5, s1, W2[0], W2[1], T.z0, T.z1, { front: shade })
      }
      // Vault tops and undersides: rings I-II and II-III at the first floor.
      band(Math.max(s0, OUT_E), Math.min(s1, OUT_W_LOW), W1[1], W2[0], TIERS[0].z1 - 0.6, TIERS[0].z1, { top: weath, bottom: shade })
      band(s0, s1, W2[1], W3[0], TIERS[0].z1 - 0.6, TIERS[0].z1, { top: weath, bottom: shade })
      cap(weath, W2_E, W2[0], W2[1], 0, TIERS[0].z1, -1)
    } else {
      // Low: the second ring as the shadowed back of the ambulatory.
      band(s0, s1, W2[0], W2[1], 0, zt, { front: shade, step: 2 })
      band(Math.max(s0, OUT_E), Math.min(s1, OUT_W_LOW), W1[1], W2[0], TIERS[0].z1, TIERS[0].z1, { top: weath, step: 2 })
    }
    // The top of the surviving vaults, from the outer wall to wall III.
    if (nt >= 2) band(s0, s1, s0 < OUT_E ? W2[0] : W1[1], W3[1], zt, zt, { top: brick, step: L.detail ? 1 : 2 })
    else band(s0, s1, W2[0], W3[1], zt, zt, { top: brick, step: L.detail ? 1 : 2 })
  }

  // ---- Wall III: the face of the south side ----
  // Three storeys of arches, the second storey's taller and wider than the
  // first's. Piers of travertine blocks, the infill above the arches partly
  // brick. Its top is a broken brick wall, 32-36 m, with a few big square
  // windows, and here and there a bay broken down into the third storey.
  const broken = (k: number) => rnd(Math.round(k), 51) < 0.16
  const w3Top = (k: number) => {
    if (broken(k)) return 25.5 + 2.5 * rnd(Math.round(k), 52)
    const z = 33.8 + 1.3 * Math.sin(k * 0.55 + 0.4) + 1.1 * (rnd(Math.round(k), 53) - 0.5) * 2
    return Math.round(z * 2) / 2
  }
  const W3_S0 = W2_W, W3_S1 = NB + W2_E
  {
    const t1: Arch = { w: 1.75, zs: 5.3, sill: 0 }
    const t2: Arch = { w: 2.15, zs: 17.9, sill: 12.0 }
    const t3: Arch = { w: 1.7, zs: 27.4, sill: 24.2 }
    const z3 = 31.0
    for (let k = Math.ceil(W3_S0 + 0.5); k + 0.5 <= W3_S1 + 1e-6; k++) {
      const infill = rnd(k, 54) < 0.45
      // The low model leaves the lower reveals out: behind them is the dark
      // of the ambulatory either way.
      bay(k, W3[0], W3[1], 0, 10.5, t1, L.segIn, { front: trav, back: L.detail ? weath : undefined, reveal: L.detail ? dark : undefined })
      bay(k, W3[0], W3[1], 10.5, 22.35, t2, L.segIn, { front: infill ? weath : trav, base: infill ? brick : undefined, back: L.detail ? weath : undefined, reveal: L.detail ? dark : undefined, sill: L.detail ? weath : undefined })
      const top = w3Top(k)
      if (broken(k)) {
        // Broken down into the third storey: a ragged brick stump.
        band(k - 0.5, k + 0.5, W3[0], W3[1], 22.35, top, { front: brick, back: brick, top: brick })
      } else {
        bay(k, W3[0], W3[1], 22.35, z3, t3, L.segIn, { front: weath, back: weath, reveal: weath, sill: L.detail ? weath : undefined })
        if (top > 34.4 && rnd(k, 55) < 0.45) windowBay(k, W3[0], W3[1], z3, top, 0.85, 31.7, 33.5, brick, brick, brick)
        else band(k - 0.5, k + 0.5, W3[0], W3[1], z3, top, { front: brick, back: brick })
        band(k - 0.5, k + 0.5, W3[0], W3[1], top, top, { top: brick })
      }
      // The broken top steps between bays.
      const next = w3Top(k + 1)
      if (k + 1.5 <= W3_S1 + 1e-6 && Math.abs(next - top) > 0.05) {
        const lo = Math.min(top, next), hi = Math.max(top, next)
        cap(brick, k + 0.5, W3[0], W3[1], lo, hi, next > top ? -1 : 1)
      }
      // Stubs of the vanished radial walls, at the piers (rough projections).
      if (L.detail) block(weath, k + 0.5, W3[0], -0.55, 0.55, 0, 0.8, 0, 9.5 + 12 * rnd(k, 9), { top: true, bottom: false, back: false })
    }
    // String courses.
    for (const z of L.detail ? [10.5, 22.35] : [10.5]) {
      if (L.detail) sweep(weath, W3_S0, W3_S1, [[0, z - 0.7], [0.35, z - 0.55], [0.35, z], [0, z]], 1, W3[0])
      else sweep(weath, W3_S0, W3_S1, [[0, z - 0.7], [0.35, z]], 2, W3[0])
    }
    if (!L.detail) {
      // Low: the dark behind the arches.
      band(W3_S0, W3_S1, W3[1] + 1.4, W3[1] + 1.4, 0, 22.35, { front: dark, step: 2 })
      band(W3_S0, W3_S1, W3[1], W3[1] + 1.4, 22.35, 22.35, { top: weath, step: 2 })
    } else {
      // Detail: the ambulatory behind wall III, roofed at each storey.
      band(W3_S0, W3_S1, W3[1] + 4.2, W3[1] + 5.4, 0, 22.35, { front: dark, back: weath, top: weath })
      for (const z of [10.5, 22.35]) band(W3_S0, W3_S1, W3[1], W3[1] + 4.2, z - 0.6, z, { top: weath, bottom: dark })
    }
    // The ends of wall III where the outer rings stand.
    cap(weath, W3_S0, W3[0], W3[1], 0, w3Top(Math.ceil(W3_S0 + 0.5)), -1)
  }
  // Behind the outer rings (north), wall III shows only through the arches.
  if (L.detail) band(W2_E, W2_W, W3[0], W3[1], 0, 22.35, { front: shade })

  // ---- The cavea: broken radial walls, a ring of vaults, the podium ----
  {
    const d0 = W3[1] + (L.detail ? 5.4 : 1.4), d1 = PODIUM[0]
    // How much of the cavea's rise the vault beds keep: more on the north.
    const keep = (k: number) => {
      const north = Math.sin((2 * Math.PI * (k + 0.5)) / NB) > 0.3 ? 1 : 0
      return 0.66 + 0.12 * rnd(Math.round(k), 11) + 0.08 * north
    }
    const bedZ = (k: number, d: number) => 4.6 + (caveaZ(d) - 4.6) * keep(k) * 0.8
    // The radial walls stand above the beds by a share that varies wall to
    // wall: the broken teeth of the photos.
    const ribZ = (k: number, d: number, salt = 0) => bedZ(k, d) + 0.6 + (caveaZ(d) - 4.6) * (0.06 + 0.34 * rnd(Math.round(k), 60 + salt))
    // Two sloping beds (what is left of the vaults under the seats), split
    // by the ring corridor, and the upper corridor behind; the corridors are
    // open trenches in shadow.
    const zones: Array<[number, number]> = [[d1, 33.2], [29.4, 21.5]]
    const corridors: Array<[number, number]> = [[33.2, 29.4], [21.5, d0]]
    const bstep = L.detail ? 1 : 4
    for (let k = 0; k < NB; k += bstep) {
      const s0 = k - 0.5, s1 = k + bstep - 0.5, ka = k - 1, kb = k + bstep - 1
      for (const [da, db] of zones) {
        const mids = L.detail ? [da, (da + db) / 2, db] : [da, db]
        for (let i = 0; i < mids.length - 1; i++) {
          const u = mids[i], v = mids[i + 1]
          quad(dark, P(s0, u, bedZ(ka, u)), P(s1, u, bedZ(kb, u)), P(s1, v, bedZ(kb, v)), P(s0, v, bedZ(ka, v)), UP)
        }
        // The bed's broken edge where it drops into the corridor behind.
        if (db !== d0) quad(dark, P(s0, db, bedZ(ka, db)), P(s1, db, bedZ(kb, db)), P(s1, db, bedZ(kb, db) - 3.2), P(s0, db, bedZ(ka, db) - 3.2), nOut(k))
      }
      for (const [da, db] of corridors) {
        const z = (kk: number) => bedZ(kk, da) - 3.2
        quad(dark, P(s0, da, z(ka)), P(s1, da, z(kb)), P(s1, db, z(kb)), P(s0, db, z(ka)), UP)
      }
      // The corridor's inner wall, facing the arena, up to the next bed.
      if (!L.detail) {
        const zt = (kk: number) => bedZ(kk, 29.4)
        quadN(brick, P(s0, 29.4, bedZ(ka, 33.2) - 3.2), P(s1, 29.4, bedZ(kb, 33.2) - 3.2), P(s1, 29.4, zt(kb)), P(s0, 29.4, zt(ka)), nIn(s0), nIn(s1), nIn(s1), nIn(s0))
      }
    }
    // The radial walls standing above the beds, at the piers, in brick.
    for (let k = 0; k < NB; k += L.radialStep) {
      const s = k + 0.5
      zones.forEach(([da, db], zi) => {
        if (!L.detail && zi === 1 && k % 4 !== 0) return
        const ds = [da, db]
        const bottom: P2[] = [...ds].reverse().map((d) => [d, bedZ(k, d) - 0.3])
        if (L.detail) {
          // Broken in two steps along its length.
          const m = (da + db) / 2, cut = 0.5 + 1.5 * rnd(k, 30 + zi)
          const prof: P2[] = [[da, ribZ(k, da, zi)], [m, ribZ(k, m, zi)], [m - 0.01, ribZ(k, m, zi) - cut], [db, Math.max(bedZ(k, db) + 0.5, ribZ(k, db, zi) - cut)]]
          fin(brick, s, 0.8, [...prof, ...bottom])
        } else {
          const top: P2[] = ds.map((d) => [d, ribZ(k, d, zi)])
          fin(brick, s, 1.0, [...top, ...bottom], false, top.length - 1)
        }
      })
    }
    // Vault stubs: the barrel vaults that still span between some walls.
    if (L.detail) {
      for (let k = 0; k < NB; k++) {
        if (rnd(k, 70) > 0.4) continue
        zones.forEach(([da, db], zi) => {
          if (rnd(k, 71 + zi) > 0.6) return
          const z = (d: number) => Math.min(ribZ(k, d, zi), ribZ(k + 1, d, zi)) - 0.5
          const e = da - (da - db) * (0.35 + 0.5 * rnd(k, 73 + zi))
          quad(brick, P(k + 0.5, da, z(da)), P(k + 1.5, da, z(da)), P(k + 1.5, e, z(e)), P(k + 0.5, e, z(e)), UP)
          quad(brick, P(k + 0.5, da, z(da) - 0.8), P(k + 1.5, da, z(da) - 0.8), P(k + 1.5, da, z(da)), P(k + 0.5, da, z(da)), nIn(k + 1))
          quad(brick, P(k + 0.5, e, z(e) - 0.8), P(k + 1.5, e, z(e) - 0.8), P(k + 1.5, e, z(e)), P(k + 0.5, e, z(e)), nOut(k + 1))
        })
      }
    }
    // The wall behind the cavea, facing the arena, up to the second storey.
    band(0, NB, d0, d0, 0, 22.35, { back: weath, step: 2 })
    // The ring corridor halfway up the cavea, its inner wall arcaded.
    const RC = [29.4, 30.6]
    if (L.detail) {
      for (let k = 0; k < NB; k++) {
        const top = 14.5 - 3.5 * rnd(k, 15)
        bay(k, RC[0], RC[1], 0, top, { w: 1.35, zs: 9.6, sill: 6.8 }, 4, { front: brick, back: brick, reveal: brick, sill: brick })
        band(k - 0.5, k + 0.5, RC[0], RC[1], 0, top, { top: brick })
      }
    }
    // The podium: the arena wall and its terrace.
    band(0, NB, PODIUM[0], PODIUM[1], 0, 4.6, { back: weath, top: weath, step: L.detail ? 0.5 : 2 })
    if (L.detail) sweep(weath, 0, NB, [[-PODIUM[1], 4.6], [-PODIUM[1] - 0.35, 4.6], [-PODIUM[1] - 0.35, 5.6], [-PODIUM[1] + 0.2, 5.6]], 0.5)
  }

  // ---- The arena: the hypogeum's walls and the rebuilt floor ----
  {
    const H = 2.0
    const DECK_X = 20
    // The arena's half-width at x (the oval 50.5 m in from the outer face).
    const yh = (x: number) => 27.5 * Math.sqrt(Math.max(0, 1 - (x / 44) ** 2))
    // The shadowed floor of the hypogeum, between its walls: a dark deck just
    // above the arena ground, in strips so it follows the terrain.
    {
      const sx = L.detail ? 4 : 8
      const x0 = -43.2
      for (let x = x0; x < DECK_X - 1e-6; x += sx) {
        const xa = x, xb = Math.min(x + sx, DECK_X)
        const ya = yh(xa) * 0.97, yb = yh(xb) * 0.97
        quad(dark, [xa, -ya, 0.3], [xb, -yb, 0.3], [xb, 0, 0.3], [xa, 0, 0.3], UP)
        quad(dark, [xa, 0, 0.3], [xb, 0, 0.3], [xb, yb, 0.3], [xa, ya, 0.3], UP)
      }
    }
    // A brick wall between two points in plan; ends optional.
    const wall = (x0: number, y0: number, x1: number, y1: number, t: number, ends = true) => {
      const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy)
      if (l < 0.3) return
      const nx = (-dy / l) * (t / 2), ny = (dx / l) * (t / 2)
      const pa: V3[] = [[x0 + nx, y0 + ny, 0], [x1 + nx, y1 + ny, 0], [x1 - nx, y1 - ny, 0], [x0 - nx, y0 - ny, 0]]
      const top = pa.map((q) => [q[0], q[1], H] as V3)
      const side = (i: number, j: number) => {
        const m = [(pa[i][0] + pa[j][0]) / 2 - (x0 + x1) / 2, (pa[i][1] + pa[j][1]) / 2 - (y0 + y1) / 2, 0] as V3
        quad(brick, pa[i], pa[j], top[j], top[i], m)
      }
      side(0, 1)
      side(2, 3)
      if (ends) {
        side(1, 2)
        side(3, 0)
      }
      quad(brick, top[0], top[1], top[2], top[3], UP)
    }
    // The curved walls following the arena's oval.
    const rings = L.detail ? [ARENA + 1.2, ARENA + 5.2, ARENA + 9.2] : [ARENA + 1.2, ARENA + 6.2]
    for (const d of rings) {
      const step = L.detail ? 1 : d > ARENA + 3 ? 4 : 2
      for (let s = 0; s < NB; s += step) {
        const a = P(s, d, 0), b = P(s + step, d, 0)
        if (d > ARENA + 3 && (a[0] > DECK_X - 0.5 || b[0] > DECK_X - 0.5)) continue
        band(s, s + step, d, d + 0.9, 0, H, { front: L.detail || d > ARENA + 3 ? brick : undefined, back: brick, top: brick, step })
      }
    }
    // Straight walls along the long axis: the central corridor and the
    // parallel walls, with cross walls making cells between them.
    const lines = L.detail ? [1.6, 5, 8.5, 12, 15.5, 19] : [1.6, 6, 11, 16]
    const xEnd = (y: number) => {
      // Where the line meets the innermost ring.
      const dIn = rings[rings.length - 1] - ARENA + 1.5
      return 44 * Math.sqrt(Math.max(0, 1 - (Math.abs(y) / (27.5 - dIn * 0.55)) ** 2)) - dIn
    }
    for (const sg of [-1, 1]) {
      lines.forEach((ly, i) => {
        const y = sg * ly, hl = xEnd(ly)
        if (hl < 4) return
        wall(-hl, y, Math.min(hl, DECK_X), y, 0.9, L.detail)
        const next = lines[i + 1]
        if (next === undefined || i === 0 && !L.detail) return
        const hn = Math.min(hl, xEnd(next))
        const gap = L.detail ? 3.6 : 14
        for (let x = -hn + 1.5; x < Math.min(hn, DECK_X) - 0.5; x += gap) wall(x, sg * (ly + 0.45), x, sg * (next - 0.45), 0.7, false)
      })
    }
    // The rebuilt arena floor over the east end, at arena level: pale wood.
    const edge: P2[] = []
    for (let s = -20; s <= 20; s += L.detail ? 0.5 : 4) {
      const p = P(s, ARENA, 0)
      if (p[0] >= DECK_X) edge.push([p[0], p[1]])
    }
    const pts: P2[] = [[DECK_X, edge[0][1]], ...edge, [DECK_X, edge[edge.length - 1][1]]]
    const zt = H + 0.35
    poly(deck, pts, (x, y) => [x, y, zt], UP)
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length]
      const m: V3 = [(a[0] + b[0]) / 2 - 32, (a[1] + b[1]) / 2, 0]
      quad(deck, [a[0], a[1], 0.3], [b[0], b[1], 0.3], [b[0], b[1], zt], [a[0], a[1], zt], m)
    }
  }

  // ---- Materials ----
  // Floodlit at night, as the real monument is: the outer faces strongly,
  // tops barely; the vault interiors glow warm through the arches.
  const lit = (k: number) => (_p: V3, n: V3) => (n[2] > 0.7 ? 0.3 * k : k)
  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: trav, material: { ...finish('travertine', 0xe9dcc3), floodlight: lit(0.95) } },
    // Only the outer faces carry the floodlight wash (the attribute costs
    // bytes on every vertex; the weathered parts are mostly reveals and backs).
    { part: weath, material: finish('travertine-weathered', 0xd4c4a8) },
    // The low model lights only the travertine, to keep inside 250 KB.
    { part: brick, material: { ...finish('roman-brick', 0xbf9c82), ...(L.detail ? { floodlight: lit(0.55) } : {}) } },
    // The arcades' vaults are lit from inside at night, the monument's
    // signature: named window-* so the map glows them warm.
    { part: shade, material: finish('window-vault', 0x8c7c69) },
    { part: dark, material: finish('vault-shade', 0x86705e) },
    { part: deck, material: finish('arena-deck', 0xd8c7a6) },
  ]
  return parts
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  const per = parts.map(({ part, material }) => `${material.name} ${part.triangles}`).join(', ')
  const glb = writeGlb('Colosseum', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 19.5, elevation: 0, height: ATTIC.z1,
  })
  console.log(`${file}: ${triangles} triangles, ${glb.length} bytes (${per})`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  if (process.env.DRAFT) await Bun.write(out, glb) // iterate past the budget; never for a release
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  await Bun.write(out, glb)
}

await write('rome-colosseum.detail.glb', build(DETAIL), 40_000, 1536 * 1024)
await write('rome-colosseum.glb', build(LOW), 6500, 250 * 1024)
