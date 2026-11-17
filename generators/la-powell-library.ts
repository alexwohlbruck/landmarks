/**
 * Powell Library (1929, George W. Kelham), UCLA, Westwood — original
 * procedural geometry, CC0-1.0.
 *
 *   bun generators/la-powell-library.ts
 *
 * Writes models/la-powell-library.glb (low, 4.7k triangles) and
 * models/la-powell-library.detail.glb (detail, 30k triangles).
 *
 * Lombard Romanesque in red brick and cast stone, facing Royce Hall across
 * the quad (Dickson Plaza) to the north: a long two-storey north range
 * with a banded brick-and-stone ground storey, a blind arcade at the
 * mezzanine and tall round-headed windows in pairs; a projecting entrance
 * block with a stone portal, a triple-arched window, a rose window in its
 * gable and two banded pilaster towers carrying open lanterns and spires;
 * the octagonal tower over the rotunda behind (after Sant'Ambrogio /
 * San Zeno) with its arcaded gallery, tile roofs and green lantern; two
 * long gabled wings and flat-roofed stack blocks round a courtyard to the
 * south. Identity, in order: the octagonal tower with its gallery and
 * lantern, the entrance gable (rose, triple window, portal, turrets), the
 * striped ground storey under the arched windows, the red brick and tile.
 *
 * Built as real 3D: every arched window is cut into its wall with jambs,
 * sill and a semicircular soffit back to a recessed light; the octagon's
 * gallery openings go right through the wall to an inner drum (detail:
 * with colonnettes and the inside face of the gallery wall); the rose window
 * is a stone ring with a recessed light and radial stone tracery; the portal
 * is a stone frontispiece with a deep arched doorway; the turret lanterns
 * are open (posts in the low model, an arcaded octagon in the detail one).
 * The low model draws the secondary windows (ground storey, the wings'
 * outer and courtyard faces, the gable-end arcades) as flush panels to stay
 * under 250 KB; the detail model cuts them all and adds the Lombard
 * corbel-arch friezes, more banding and the entrance steps.
 *
 * Frame: x east, y north, z up, metres, bearing 0 (the building is square
 * to the compass). Origin at the OSM outline's area centroid
 * (-118.4421751, 34.0716055); z = 0 is the lowest ground under the
 * footprint (the south ends of the wings, 3DEP about 134.6 m). The quad in
 * front is 2.5 m higher (lidar; the map's terrain draws it 2.2 m up), so
 * the north facade's detail starts there. Elevation 0.
 *
 * Evidence
 * - Plan: OSM way/422876626 (building=yes, height=38.8, name Powell
 *   Library): north faces y 32.3 (entrance block 33.9, x -9.5..8.8), ends
 *   x -33.9 / 33.3, wings to y -42.4, centre bays to -19.1 / -25.8.
 * - Heights: USGS 3DEP lidar USGS_LPC_CA_LosAngeles_2016_LAS_2018 (2016
 *   flight), 0.5 m grid, over the 134.6 m base: north range eaves 20.2,
 *   ridge 23.9; entrance gable eaves 21.2, peak 24.1; turret tips ~25.6
 *   (read low on thin spires; drawn to 27.1 from photo p2); octagon lower
 *   stage eave 27.2 (r 8–9 m), gallery stage from 28.1, pyramid to ~35.8,
 *   lantern finial 38.1 (OSM height 38.8; model tip 38.8); west wing eave
 *   16.2 / ridge 19.2, east wing 18.5 / 21.4; rear blocks 15.9 and 16.5,
 *   centre 13.5 / 15.8, raised hipped block behind the octagon 21.0 / 24.6.
 *   The lidar footprint sits about 1.3 m east of the OSM outline; the
 *   model follows OSM for plan and lidar for heights.
 * - Photos (Wikimedia Commons), compared with renders from the same side:
 *   p1 "2019 UCLA Powell Library 1.jpg" (Beyond My Ken, CC BY-SA 4.0) —
 *      the entrance block and octagon from the north;
 *   p2 "2019 UCLA Powell Library 2.jpg" (Beyond My Ken, CC BY-SA 4.0) —
 *      the north front; bay rhythm, zone heights (scaled from the 16 m
 *      between the turret centres);
 *   p3 "2019 UCLA Powell Library rear 1.jpg" (Beyond My Ken, CC BY-SA 4.0)
 *      — from the south: wing gable ends, the courtyard, the octagon;
 *   p4 "2019 UCLA Powell Library rear 2.jpg" (Beyond My Ken, CC BY-SA 4.0)
 *      — the courtyard block;
 *   p5 "View of Powell Library from Dickson Plaza, facing southwest"
 *      (Jonathan Farrar, HABS CA-2678-A-2, public domain) — from the
 *      north-east;
 *   p6 "View of Powell Library from Dickson Plaza, facing southeast"
 *      (Jonathan Farrar, HABS CA-2678-A-1, public domain) — from the
 *      north-west: the west gable end and the wing's long west face
 *      (the rhythm of tall narrow windows used on both wings);
 *   p7 "Powell Library, angle view, UCLA campus.jpg" (legge_e_mare,
 *      CC BY 2.0) — from the north-east, the east gable end;
 *   p8 "Powell Library, UCLA.jpg" (Neeta Lind, CC BY 2.0) — the front;
 *   p10 "Powell Library overlooking Janss Steps, UCLA.jpg" (Andy Dietler,
 *      CC BY-SA 2.0) — the octagon's tile and gallery from the west;
 *   p11 "Powell Library at night.jpg" (Geographer, CC BY 2.5) — the
 *      floodlit entrance gable and lit windows, for the night look.
 * - Colour: brick, cast stone and tile match Royce Hall's materials
 *   (la-royce-hall.ts: #c48b78, #e8d8bd, terracotta), which the photos
 *   bear out (sampled brick #917066 in sun on p2, hue 14°, the same hue as
 *   Royce's, pulled to the palette's lightness); windows are the palette's
 *   slate-blue, as the glass reads blue in p2; the lantern is patina.
 * - Night: the north faces (brick and stone) carry _FLOODLIGHT, brightest
 *   at the foot, as in p11; windows, the rose and the portal glow.
 *
 * Measured (lidar): every eave, ridge, the octagon stages, the lantern.
 * From OSM: the plan. Estimated from photos: the facade zone heights
 * (banding to 8.2, arcade 8.6–10.5, tall windows 11.3–17.2, frieze
 * 18.4–19.0), bay counts (three pairs of tall windows a side, 15 / 11
 * windows on the wings' outer faces), the octagon's inradii (8.0 and 6.3
 * m) and the gallery's height (photos show a taller gallery than the
 * lidar's eave ring suggests; drawn 28.1–33.0), the turrets, the portal,
 * the rose (2.2 m across, 20.3 m up). Simplified: the courtyard faces, the
 * rear stack blocks (flush windows, string courses), the star ornaments
 * and diaper panels (left out).
 *
 * Doubts: the east wing's east face is seen only obliquely (p5) and is
 * drawn like the west one; the wings' outer window count (15, counted
 * roughly from p6); the later stack blocks round the courtyard are plain;
 * the lean-to roof of the octagon's lower stage may be flatter than drawn.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, cap, circle, cylinder } from './la-getty-center'

export const ID = 'la-powell-library'

// ---------------------------------------------------------------------------
// LOD

type Lod = { hi: boolean; seg: number; small: number }
let L: Lod = { hi: false, seg: 8, small: 4 }

// ---------------------------------------------------------------------------
// Parts

let brick = new Part(), stone = new Part(), tile = new Part(), win = new Part(), flat = new Part(), patina = new Part()
function resetParts() {
  brick = new Part(); stone = new Part(); tile = new Part(); win = new Part(); flat = new Part(); patina = new Part()
}

// ---------------------------------------------------------------------------
// Small vector helpers

const unit = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  p.tri(a, c, d, undefined, undefined, undefined, [n, n, n])
}
function triN(p: Part, a: V3, b: V3, c: V3, n: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
}

/** An axis-aligned box with all six faces (bottom optional). */
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bottom = false) {
  const c = (x: number, y: number, z: number): V3 => [x, y, z]
  quadN(p, c(x0, y0, z0), c(x1, y0, z0), c(x1, y0, z1), c(x0, y0, z1), [0, -1, 0])
  quadN(p, c(x1, y0, z0), c(x1, y1, z0), c(x1, y1, z1), c(x1, y0, z1), [1, 0, 0])
  quadN(p, c(x1, y1, z0), c(x0, y1, z0), c(x0, y1, z1), c(x1, y1, z1), [0, 1, 0])
  quadN(p, c(x0, y1, z0), c(x0, y0, z0), c(x0, y0, z1), c(x0, y1, z1), [-1, 0, 0])
  quadN(p, c(x0, y0, z1), c(x1, y0, z1), c(x1, y1, z1), c(x0, y1, z1), [0, 0, 1])
  if (bottom) quadN(p, c(x0, y0, z0), c(x0, y1, z0), c(x1, y1, z0), c(x1, y0, z0), [0, 0, -1])
}

/** A vertical prism over a convex ring (walls and top). */
function prismRing(wall: Part, top: Part | null, ring: XY[], z0: number, z1: number) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const n = unit([b[1] - a[1], -(b[0] - a[0]), 0])
    quadN(wall, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], n)
  }
  if (top) cap(top, ring, z1)
}

/** A regular octagon with inradius r about (cx, cy), one flat face toward each compass point. */
const octagon = (cx: number, cy: number, r: number): XY[] => circle(cx, cy, r / Math.cos(Math.PI / 8), 8, -Math.PI / 8)

// ---------------------------------------------------------------------------
// Facades with real openings
//
// A wall face runs from a to b (an edge of a counter-clockwise plan ring, so
// its outside is to the right of a→b). Openings are cut out of the face and
// lined with reveals (jambs, sill, arch soffit) back to a recessed panel, or
// left open right through (`back: null`) for a gallery.

type Op = {
  s0: number; s1: number; z0: number; z1: number
  /** round head: a true semicircle as wide as the opening */
  arch?: boolean
  depth: number
  back?: Part | null
  rev?: Part
  sill?: Part
  seg?: number
  /** a full circle (z0..z1 is its diameter): cut only, no reveals */
  round?: boolean
  /** drawn as a flat panel on the face instead of cut into it */
  flush?: boolean
}
type Zone = { z0: number; z1: number; p: Part }

class Wall {
  u: XY; n: XY; L: number
  constructor(public a: XY, public b: XY) {
    this.L = Math.hypot(b[0] - a[0], b[1] - a[1])
    this.u = [(b[0] - a[0]) / this.L, (b[1] - a[1]) / this.L]
    this.n = [this.u[1], -this.u[0]]
  }
  P(s: number, z: number, d = 0): V3 {
    return [this.a[0] + this.u[0] * s + this.n[0] * d, this.a[1] + this.u[1] * s + this.n[1] * d, z]
  }
  N(su: number, nz = 0, nn = 0): V3 {
    return unit([this.u[0] * su + this.n[0] * nn, this.u[1] * su + this.n[1] * nn, nz])
  }
}

function samples(o: Op): [number, number][] {
  if (o.round) {
    const seg = o.seg ?? L.seg, r = (o.s1 - o.s0) / 2, sc = (o.s0 + o.s1) / 2, zc = (o.z0 + o.z1) / 2
    return Array.from({ length: seg + 1 }, (_, k) => {
      const t = Math.PI - (Math.PI * k) / seg
      return [k === 0 ? o.s0 : k === seg ? o.s1 : sc + r * Math.cos(t), zc + r * Math.sin(t)] as [number, number]
    })
  }
  if (!o.arch) return [[o.s0, o.z1], [o.s1, o.z1]]
  const seg = o.seg ?? L.seg, r = (o.s1 - o.s0) / 2, sc = (o.s0 + o.s1) / 2, zs = o.z1 - r
  const out: [number, number][] = []
  for (let k = 0; k <= seg; k++) {
    const t = Math.PI - (Math.PI * k) / seg
    out.push([k === 0 ? o.s0 : k === seg ? o.s1 : sc + r * Math.cos(t), zs + r * Math.sin(t)])
  }
  return out
}
function topAt(sm: [number, number][], s: number) {
  for (let i = 0; i < sm.length - 1; i++) {
    const [s0, z0] = sm[i], [s1, z1] = sm[i + 1]
    if (s >= s0 - 1e-9 && s <= s1 + 1e-9) return s1 - s0 < 1e-9 ? Math.max(z0, z1) : z0 + ((z1 - z0) * (s - s0)) / (s1 - s0)
  }
  return sm[sm.length - 1][1]
}

/**
 * Build a wall face from z0 to z1 with its openings. `zones` paint the face
 * by height (stone bands on brick and so on).
 */
function face(w: Wall, z0: number, z1: number, zones: Zone[] | Part, ops: Op[], gable?: [number, number], s0 = 0, s1 = w.L) {
  const Z: Zone[] = zones instanceof Part ? [{ z0: -1e9, z1: 1e9, p: zones }] : zones
  for (const o of ops.filter((o) => o.flush)) {
    const sm = samples(o), zs = sm[0][1], nb = w.N(0, 0, 1), p = o.back ?? win
    if (zs > o.z0 + 1e-4) quadN(p, w.P(o.s0, o.z0, 0.05), w.P(o.s1, o.z0, 0.05), w.P(o.s1, zs, 0.05), w.P(o.s0, zs, 0.05), nb)
    if (o.arch) for (let i = 0; i < sm.length - 1; i++) triN(p, w.P((o.s0 + o.s1) / 2, zs, 0.05), w.P(sm[i][0], sm[i][1], 0.05), w.P(sm[i + 1][0], sm[i + 1][1], 0.05), nb)
  }
  ops = ops.filter((o) => !o.flush)
  const sm = ops.map(samples)
  const br = new Set<number>([s0, s1])
  if (gable) br.add(w.L / 2)
  const roofAt = (s: number) => (gable ? gable[0] + (gable[1] - gable[0]) * (1 - Math.abs(s - w.L / 2) / (w.L / 2)) : z1)
  for (const s of sm) for (const [x] of s) if (x > s0 && x < s1) br.add(x)
  const S = [...br].sort((x, y) => x - y)
  // Flat runs (same paint, same constant bottom and top) merge across
  // intervals, so a plain band costs one quad however many openings cut
  // the face above or below it.
  const nrm = w.N(0, 0, 1)
  const runs = new Map<string, { p: Part; lo: number; hi: number; s: number }>()
  const flush = (keep: Set<string>, at: number) => {
    for (const [key, r] of runs) if (!keep.has(key)) {
      quadN(r.p, w.P(r.s, r.lo), w.P(at, r.lo), w.P(at, r.hi), w.P(r.s, r.hi), nrm)
      runs.delete(key)
    }
  }
  for (let i = 0; i < S.length - 1; i++) {
    const sa = S[i], sb = S[i + 1], m = (sa + sb) / 2
    if (sb - sa < 1e-6) continue
    const holes = ops.map((o, k) => ({ o, k })).filter(({ o }) => o.s0 < m && m < o.s1).sort((x, y) => x.o.z0 - y.o.z0)
    let lo: [number, number] = [z0, z0]
    const pieces: [[number, number], [number, number]][] = []
    for (const { o, k } of holes) {
      const zc = (o.z0 + o.z1) / 2
      const bot: [number, number] = o.round ? [2 * zc - topAt(sm[k], sa), 2 * zc - topAt(sm[k], sb)] : [o.z0, o.z0]
      pieces.push([lo, bot])
      lo = [topAt(sm[k], sa), topAt(sm[k], sb)]
    }
    pieces.push([lo, [roofAt(sa), roofAt(sb)]])
    const seen = new Set<string>()
    for (const [l, h] of pieces) {
      Z.forEach((zn, zi) => {
        const la = Math.max(l[0], zn.z0), lb = Math.max(l[1], zn.z0)
        const ha = Math.min(h[0], zn.z1), hb = Math.min(h[1], zn.z1)
        const da = ha - la, db = hb - lb
        if (da <= 1e-4 && db <= 1e-4) return
        if (Math.abs(la - lb) < 1e-6 && Math.abs(ha - hb) < 1e-6) {
          const key = `${zi}:${la.toFixed(4)}:${ha.toFixed(4)}`
          seen.add(key)
          if (!runs.has(key)) runs.set(key, { p: zn.p, lo: la, hi: ha, s: sa })
          return
        }
        if (da > 1e-4 && db > 1e-4) quadN(zn.p, w.P(sa, la), w.P(sb, lb), w.P(sb, hb), w.P(sa, ha), nrm)
        else if (da > 1e-4) triN(zn.p, w.P(sa, la), w.P(sb, lb), w.P(sa, ha), nrm)
        else triN(zn.p, w.P(sa, la), w.P(sb, lb), w.P(sb, hb), nrm)
      })
    }
    flush(seen, sa)
  }
  flush(new Set(), S[S.length - 1])
  const zoneAt = (z: number) => (Z.find((zn) => z >= zn.z0 && z < zn.z1) ?? Z[Z.length - 1]).p
  ops.forEach((o, k) => {
    if (o.depth < 0.002) return
    const D = o.depth, rev = o.rev ?? zoneAt((o.z0 + o.z1) / 2), sill = o.sill ?? rev
    const s = sm[k], zs = s[0][1]
    // jambs
    quadN(rev, w.P(o.s0, o.z0, 0), w.P(o.s0, o.z0, -D), w.P(o.s0, zs, -D), w.P(o.s0, zs, 0), w.N(1))
    quadN(rev, w.P(o.s1, o.z0, -D), w.P(o.s1, o.z0, 0), w.P(o.s1, zs, 0), w.P(o.s1, zs, -D), w.N(-1))
    // sill
    quadN(sill, w.P(o.s0, o.z0, 0), w.P(o.s1, o.z0, 0), w.P(o.s1, o.z0, -D), w.P(o.s0, o.z0, -D), [0, 0, 1])
    // head / soffit
    const sc = (o.s0 + o.s1) / 2
    for (let i = 0; i < s.length - 1; i++) {
      const [sa, za] = s[i], [sb, zb] = s[i + 1]
      const nm = o.arch ? w.N(sc - (sa + sb) / 2, zs - (za + zb) / 2) : ([0, 0, -1] as V3)
      quadN(rev, w.P(sa, za, 0), w.P(sa, za, -D), w.P(sb, zb, -D), w.P(sb, zb, 0), nm)
    }
    // the recessed panel
    // (one rectangle to the crown: the soffit hides its corners)
    if (o.back) quadN(o.back, w.P(o.s0, o.z0, -D), w.P(o.s1, o.z0, -D), w.P(o.s1, o.z1, -D), w.P(o.s0, o.z1, -D), w.N(0, 0, 1))
  })
}

/** A horizontal ledge standing `out` proud of a wall face, s0..s1, z0..z1. */
function ledge(p: Part, w: Wall, s0: number, s1: number, z0: number, z1: number, out: number) {
  const f = w.N(0, 0, 1)
  quadN(p, w.P(s0, z0, out), w.P(s1, z0, out), w.P(s1, z1, out), w.P(s0, z1, out), f)
  quadN(p, w.P(s0, z1, 0), w.P(s0, z1, out), w.P(s1, z1, out), w.P(s1, z1, 0), [0, 0, 1])
  quadN(p, w.P(s0, z0, 0), w.P(s1, z0, 0), w.P(s1, z0, out), w.P(s0, z0, out), [0, 0, -1])
  quadN(p, w.P(s0, z0, 0), w.P(s0, z0, out), w.P(s0, z1, out), w.P(s0, z1, 0), w.N(-1))
  quadN(p, w.P(s1, z0, out), w.P(s1, z0, 0), w.P(s1, z1, 0), w.P(s1, z1, out), w.N(1))
}

/** A semicircular archivolt (ring r0..r1 about (sc, zs)) standing `out` proud. */
function archivolt(p: Part, w: Wall, sc: number, zs: number, r0: number, r1: number, out: number, seg = L.seg) {
  const q = (r: number, t: number, d: number) => w.P(sc + r * Math.cos(t), zs + r * Math.sin(t), d)
  for (let k = 0; k < seg; k++) {
    const t0 = Math.PI - (Math.PI * k) / seg, t1 = Math.PI - (Math.PI * (k + 1)) / seg, tm = (t0 + t1) / 2
    quadN(p, q(r0, t0, out), q(r0, t1, out), q(r1, t1, out), q(r1, t0, out), w.N(0, 0, 1))
    quadN(p, q(r1, t0, out), q(r1, t1, out), q(r1, t1, 0), q(r1, t0, 0), w.N(Math.cos(tm), Math.sin(tm)))
    if (L.hi) quadN(p, q(r0, t0, 0), q(r0, t1, 0), q(r0, t1, out), q(r0, t0, out), w.N(-Math.cos(tm), -Math.sin(tm)))
  }
  for (const t of [0, Math.PI]) quadN(p, q(r0, t, 0), q(r1, t, 0), q(r1, t, out), q(r0, t, out), [0, 0, -1])
}

/** Two sloped strips under the raking edges of a gable on wall w (peak at mid-span). */
function rake(p: Part, w: Wall, zE: number, zR: number, h: number, out: number) {
  const m = w.L / 2
  for (const [sa, sb, za, zb] of [[0, m, zE, zR], [m, w.L, zR, zE]] as number[][]) {
    quadN(p, w.P(sa, za - h, out), w.P(sb, zb - h, out), w.P(sb, zb, out), w.P(sa, za, out), w.N(0, 0, 1))
    quadN(p, w.P(sa, za - h, 0), w.P(sb, zb - h, 0), w.P(sb, zb - h, out), w.P(sa, za - h, out), [0, 0, -1])
  }
}

/** The gable triangle above an eave on wall w, peak at mid-span. */
function gableTri(p: Part, w: Wall, zE: number, zR: number) {
  triN(p, w.P(0, zE), w.P(w.L, zE), w.P(w.L / 2, zR), w.N(0, 0, 1))
}

/**
 * A gabled tile roof over an axis-aligned rectangle, ridge along x
 * (`alongY` turns it), overhanging `side` past the eave walls and `end` past
 * the gable walls.
 */
function gableRoof(x0: number, x1: number, y0: number, y1: number, zE: number, zR: number, o: { alongY?: boolean; side?: number; end?: number; hipEnd?: [boolean, boolean] } = {}) {
  const side = o.side ?? 0.5, end = o.end ?? 0.25
  // work in (a, b): a along the ridge, b across
  const ay = !!o.alongY
  const A0 = (ay ? y0 : x0) - end, A1 = (ay ? y1 : x1) + end
  const B0 = (ay ? x0 : y0), B1 = (ay ? x1 : y1), Bm = (B0 + B1) / 2, half = (B1 - B0) / 2
  const slope = (zR - zE) / half
  const zO = zE - side * slope
  const pt = (a: number, b: number, z: number): V3 => (ay ? [b, a, z] : [a, b, z])
  const [h0, h1] = o.hipEnd ?? [false, false]
  const r0 = h0 ? A0 + half + side : A0, r1 = h1 ? A1 - half - side : A1
  const lo0 = B0 - side, lo1 = B1 + side
  // the two slopes (winding fixed by normals)
  const nLo = unit(ay ? [-slope, 0, 1] : [0, -slope, 1]), nHi = unit(ay ? [slope, 0, 1] : [0, slope, 1])
  const s1 = ay ? -1 : 1
  void s1
  quadN(tile, pt(A0, lo0, zO), pt(A1, lo0, zO), pt(r1, Bm, zR), pt(r0, Bm, zR), nLo)
  quadN(tile, pt(A1, lo1, zO), pt(A0, lo1, zO), pt(r0, Bm, zR), pt(r1, Bm, zR), nHi)
  if (h0) triN(tile, pt(A0, lo1, zO), pt(A0, lo0, zO), pt(r0, Bm, zR), unit(ay ? [0, -1, 1] : [-1, 0, 1]))
  if (h1) triN(tile, pt(A1, lo0, zO), pt(A1, lo1, zO), pt(r1, Bm, zR), unit(ay ? [0, 1, 1] : [1, 0, 1]))
  // underside of the overhang
  quadN(tile, pt(A0, lo0, zO), pt(A0, lo1, zO), pt(A1, lo1, zO), pt(A1, lo0, zO), [0, 0, -1])
}

/** An octagonal (or any ring) pyramid / frustum roof. */
function ringRoof(p: Part, ring0: XY[], z0: number, ring1: XY[] | XY, z1: number, under = true) {
  const n = ring0.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a: V3 = [ring0[i][0], ring0[i][1], z0], b: V3 = [ring0[j][0], ring0[j][1], z0]
    if (Array.isArray(ring1[0])) {
      const r = ring1 as XY[]
      const c: V3 = [r[j][0], r[j][1], z1], d: V3 = [r[i][0], r[i][1], z1]
      const nn = unit(cross3(sub3(b, a), sub3(d, a)))
      quadN(p, a, b, c, d, nn[2] < 0 ? [-nn[0], -nn[1], -nn[2]] : nn)
    } else {
      const c: V3 = [(ring1 as XY)[0], (ring1 as XY)[1], z1]
      const nn = unit(cross3(sub3(b, a), sub3(c, a)))
      triN(p, a, b, c, nn[2] < 0 ? [-nn[0], -nn[1], -nn[2]] : nn)
    }
  }
  if (under) cap(p, ring0, z0, false)
}
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

// ---------------------------------------------------------------------------
// The building. Model frame: x east, y north, z up, metres, about the OSM
// outline's area centroid; z = 0 is the lowest ground under the footprint
// (the south courtyard end of the wings).

const AX = -0.35 // the entrance axis (OSM entrance block x -9.5..8.8)
const G = 2.5 // the front (north) grade over z = 0
const DOOR = G + 0.9 // the door sill, at the top of the entrance steps
// north range
const NX0 = -33.95, NX1 = 33.25, NY0 = 13.4, NY1 = 32.3
const N_EAVE = 20.2, N_RIDGE = 23.9
// entrance block
const EY = 33.9, EX0 = -9.5, EX1 = 8.8
const TW = 3.2 // pilaster tower width
const GE = 21.2, GR = 24.1 // entrance gable eave / peak
// octagon
const OC: XY = [AX, 22.4]
const O1 = 7.5, O1TOP = 27.8, O2 = 6.3, O2BASE = 28.4, O2TOP = 33.0, APEX = 35.9, TIP = 38.8
// facade heights (absolute, the floors are level)
const BAND_TOP = 8.2, MZ0 = 8.6, MZ1 = 10.5, TW0 = 11.3, TW1 = 17.2, FR0 = 18.4, FR1 = 19.0, CORN0 = 19.6

/** Paint zones for a north-range wall: banded ground storey, arcade, brick, frieze. */
function wingZones(eave: number): Zone[] {
  const z: Zone[] = [{ z0: -1, z1: 2.9, p: stone }]
  const bands = L.hi ? [3.25, 3.95, 4.65, 5.35, 6.05, 6.75, 7.45] : [3.3, 4.6, 5.9, 7.2]
  const bh = L.hi ? 0.38 : 0.55
  let at = 2.9
  for (const b of bands) {
    z.push({ z0: at, z1: b, p: stone }, { z0: b, z1: b + bh, p: brick })
    at = b + bh
  }
  z.push({ z0: at, z1: MZ1 + 0.5, p: stone })
  const f0 = eave - 1.8, f1 = eave - 1.2
  z.push({ z0: MZ1 + 0.5, z1: f0, p: brick }, { z0: f0, z1: f1, p: stone }, { z0: f1, z1: eave + 10, p: brick })
  return z
}

/** Openings of a north-range bay layout along a wall. */
type Bay = { c: number; tall: number[]; tallW: number; ground: number[]; arcade: [number, number] }

function bayOps(b: Bay, eave: number, opts: { tallTop?: number; flatArcade?: boolean } = {}): Op[] {
  const ops: Op[] = []
  const tTop = opts.tallTop ?? Math.min(TW1, eave - 2.6)
  for (const t of b.tall) ops.push({ s0: b.c + t - b.tallW / 2, s1: b.c + t + b.tallW / 2, z0: TW0, z1: tTop, arch: true, depth: 0.55, back: win, rev: brick, sill: stone })
  for (const g of b.ground) ops.push({ s0: b.c + g - 0.45, s1: b.c + g + 0.45, z0: 4.4, z1: 6.6, depth: 0.3, back: win, rev: stone, flush: !L.hi })
  // the blind arcade at the mezzanine: small round arches between stone colonnettes
  const [a0, a1] = b.arcade
  const n = L.hi ? Math.max(3, Math.round((a1 - a0) / 0.95)) : Math.max(2, Math.round((a1 - a0) / 1.85))
  const pitch = (a1 - a0) / n, w = pitch * 0.68
  for (let k = 0; k < n; k++) {
    const c = b.c + a0 + pitch * (k + 0.5)
    ops.push({ s0: c - w / 2, s1: c + w / 2, z0: MZ0 + 0.1, z1: MZ1 - 0.15, arch: L.hi, depth: 0.28, back: brick, rev: brick, sill: stone, seg: L.small, flush: !L.hi && opts.flatArcade })
  }
  return ops
}

/** Lombard corbel-arch frieze as small recessed arches in the frieze zone (detail only). */
function frieze(s0: number, s1: number, eave: number, pitch = 0.9): Op[] {
  if (!L.hi) return []
  const f0 = eave - 1.8, f1 = eave - 1.2
  const n = Math.max(2, Math.round((s1 - s0) / pitch)), p = (s1 - s0) / n
  const out: Op[] = []
  for (let k = 0; k < n; k++) {
    const c = s0 + p * (k + 0.5)
    out.push({ s0: c - p * 0.36, s1: c + p * 0.36, z0: f0 + 0.05, z1: f1 - 0.08, arch: true, depth: 0.12, back: brick, rev: stone, sill: stone, seg: 4 })
  }
  return out
}

/** Cornice + frieze ledges along a wall. */
function eaveLedges(w: Wall, eave: number, s0 = 0, s1 = w.L) {
  ledge(stone, w, s0, s1, eave - 0.6, eave, 0.35)
  ledge(stone, w, s0, s1, BAND_TOP, MZ0, 0.12)
  ledge(stone, w, s0, s1, MZ1, MZ1 + 0.5, 0.16)
}

function northRange() {
  // ---- the north (front) faces of the two halves, either side of the entrance block
  const halves: [number, number][] = [[NX0, EX0], [EX1, NX1]]
  for (const [x0, x1] of halves) {
    const w = new Wall([x1, NY1], [x0, NY1]) // north face runs east → west
    const len = w.L, ops: Op[] = []
    for (let k = 0; k < 3; k++) {
      const c = (len * (k + 0.5)) / 3
      ops.push(...bayOps({ c, tall: [-1.65, 1.65], tallW: 2.2, ground: [-1.2, 0, 1.2], arcade: [-len / 6 + 0.3, len / 6 - 0.3] }, N_EAVE))
    }
    ops.push(...frieze(0.2, len - 0.2, N_EAVE))
    face(w, 0, N_EAVE, wingZones(N_EAVE), ops)
    eaveLedges(w, N_EAVE)
  }
  // ---- the gable ends (east and west): triple tall windows over the banded storey
  for (const east of [false, true]) {
    const x = east ? NX1 : NX0
    const w = east ? new Wall([x, NY0], [x, NY1]) : new Wall([x, NY1], [x, NY0])
    const len = w.L, c = len / 2, ops: Op[] = []
    ops.push(...bayOps({ c, tall: [-2.9, 0, 2.9], tallW: 2.1, ground: [-5.5, -3.2, 3.2, 5.5], arcade: [-len / 2 + 0.6, len / 2 - 0.6] }, N_EAVE, { tallTop: 17.6, flatArcade: true }))
    ops.push(...frieze(0.2, len - 0.2, N_EAVE))
    face(w, 0, N_RIDGE, wingZones(N_EAVE), ops, [N_EAVE, N_RIDGE])
    eaveLedges(w, N_EAVE)
    for (const t of [-1.45, 1.45]) {
      const [x, y] = w.P(c + t, 0, 0.05)
      cylinder(stone, x, y, 0.2, TW0, 17.6 - 1.05, 8)
    }
    rake(stone, w, N_EAVE, N_RIDGE, 0.55, 0.18)
  }
  // ---- the south face above the rear blocks (punched windows, plain)
  {
    const w = new Wall([NX0, NY0], [NX1, NY0])
    face(w, 0, N_EAVE, brick, [])
    ledge(stone, w, 0, w.L, N_EAVE - 0.6, N_EAVE, 0.35)
    for (const x of [-15.5, -12, 12, 15.5]) {
      const s = x - NX0
      panelW(w, s - 0.6, s + 0.6, 17.0, 18.6)
    }
  }
  gableRoof(NX0, NX1, NY0, NY1, N_EAVE, N_RIDGE, { side: 0.55, end: 0.3 })
}

/** A flush window panel on a wall. */
function panelW(w: Wall, s0: number, s1: number, z0: number, z1: number, p: Part = win) {
  quadN(p, w.P(s0, z0, 0.05), w.P(s1, z0, 0.05), w.P(s1, z1, 0.05), w.P(s0, z1, 0.05), w.N(0, 0, 1))
}

function entrance() {
  const cx = AX, gx0 = EX0 + TW, gx1 = EX1 - TW
  // ---- the gabled centre between the pilaster towers
  {
    const w = new Wall([gx1, EY], [gx0, EY]) // facing north, s runs east → west
    const sAX = gx1 - cx // s of the axis
    const ops: Op[] = []
    // triple window: three tall round-headed lights over the portal
    for (const d of [-3.5, 0, 3.5]) ops.push({ s0: sAX + d - 1.2, s1: sAX + d + 1.2, z0: 11.0, z1: 17.3, arch: true, depth: 0.7, back: win, rev: stone, sill: stone })
    // paired small windows either side of the portal
    for (const d of [-4.55, -3.45, 3.45, 4.55]) ops.push({ s0: sAX + d - 0.42, s1: sAX + d + 0.42, z0: 4.5, z1: 7.3, arch: true, depth: 0.3, back: win, rev: stone, seg: L.small + (L.hi ? 2 : 0) })
    // the blind arcade (diaper panels) at the mezzanine, five a side
    const n = L.hi ? 5 : 3
    for (const side of [-1, 1]) {
      const a0 = 2.9, a1 = 5.8, p = (a1 - a0) / n
      for (let k = 0; k < n; k++) {
        const c = sAX + side * (a0 + p * (k + 0.5))
        ops.push({ s0: c - p * 0.34, s1: c + p * 0.34, z0: MZ0 + 0.05, z1: MZ1, arch: L.hi, depth: 0.2, back: brick, rev: stone, sill: stone, seg: L.small })
      }
    }
    // the doorway passes through behind the portal frontispiece
    ops.push({ s0: sAX - 1.5, s1: sAX + 1.5, z0: DOOR, z1: 8.6, arch: true, depth: 0, back: null })
    // the rose window's opening (rose() lines it)
    ops.push({ s0: sAX - 1.1, s1: sAX + 1.1, z0: 20.3 - 1.1, z1: 20.3 + 1.1, round: true, depth: 0, seg: (L.hi ? 20 : 12) / 2 })
    face(w, 0, GR, [
      { z0: -1, z1: 2.9, p: stone },
      ...wingZones(GE).filter((z) => z.z0 >= 2.9 && z.z1 <= MZ1 + 0.5),
      { z0: MZ1 + 0.5, z1: 99, p: brick },
    ], ops, [GE, GR])
    rake(stone, w, GE, GR, 0.6, 0.2)
    ledge(stone, w, 0, w.L, BAND_TOP, MZ0, 0.12)
    ledge(stone, w, 0, w.L, MZ1, MZ1 + 0.5, 0.16)
    // stone archivolts and colonnettes of the triple window
    for (const d of [-3.5, 0, 3.5]) archivolt(stone, w, sAX + d, 16.1, 1.2, 1.72, 0.18)
    for (const d of [-1.75, 1.75]) {
      const [x, y] = w.P(sAX + d, 0, 0.05)
      cylinder(stone, x, y, 0.3, 11.0, 15.6, L.hi ? 12 : 8)
      box(stone, x - 0.4, y - 0.4, x + 0.4, y + 0.4, 15.6, 16.15)
    }
    // the rose window: stone ring, recessed light and radial tracery
    rose(w, sAX, 20.3)
    // the portal aedicule: a stone frontispiece with a deep arched doorway
    portal(cx)
  }
  // ---- pilaster towers with open lanterns and spires
  for (const [x0, x1] of [[EX0, EX0 + TW], [EX1 - TW, EX1]]) tower(x0, x1)
  // ---- the block's own roof, gabled north–south back to the octagon
  gableRoof(gx0, gx1, 27.0, EY, GE, GR, { alongY: true, side: 0.2, end: 0.15 })
}

function rose(w: Wall, s: number, z: number) {
  const r0 = 1.1, r1 = 1.5, seg = L.hi ? 20 : 12, D = 0.4
  const q = (r: number, t: number, d: number) => w.P(s + r * Math.cos(t), z + r * Math.sin(t), d)
  const nf = w.N(0, 0, 1)
  for (let k = 0; k < seg; k++) {
    const t0 = (2 * Math.PI * k) / seg, t1 = (2 * Math.PI * (k + 1)) / seg, tm = (t0 + t1) / 2
    // stone ring face, outer edge, inner reveal down to the light
    quadN(stone, q(r0, t0, 0.15), q(r0, t1, 0.15), q(r1, t1, 0.15), q(r1, t0, 0.15), nf)
    quadN(stone, q(r1, t0, 0.15), q(r1, t1, 0.15), q(r1, t1, 0), q(r1, t0, 0), w.N(Math.cos(tm), Math.sin(tm)))
    quadN(stone, q(r0, t0, -D), q(r0, t1, -D), q(r0, t1, 0.15), q(r0, t0, 0.15), w.N(-Math.cos(tm), -Math.sin(tm)))
    triN(win, w.P(s, z, -D), q(r0, t0, -D), q(r0, t1, -D), nf)
  }
  // radial tracery: spokes from a hub to the ring, standing in the recess
  const spokes = L.hi ? 12 : 8
  for (let k = 0; k < spokes; k++) {
    const t = (2 * Math.PI * k) / spokes, c = Math.cos(t), sn = Math.sin(t), hw = L.hi ? 0.06 : 0.08
    const pp = (r: number, o: number, d: number) => w.P(s + r * c - o * sn, z + r * sn + o * c, d)
    const ri = 0.3, ro = r0 + 0.02, d1 = -0.1
    quadN(stone, pp(ri, -hw, d1), pp(ro, -hw, d1), pp(ro, hw, d1), pp(ri, hw, d1), nf)
    quadN(stone, pp(ri, hw, -D), pp(ri, hw, d1), pp(ro, hw, d1), pp(ro, hw, -D), w.N(-sn, c))
    quadN(stone, pp(ri, -hw, d1), pp(ri, -hw, -D), pp(ro, -hw, -D), pp(ro, -hw, d1), w.N(sn, -c))
  }
  const hub = L.hi ? 10 : 6
  for (let k = 0; k < hub; k++) {
    const t0 = (2 * Math.PI * k) / hub, t1 = (2 * Math.PI * (k + 1)) / hub
    triN(stone, w.P(s, z, -0.08), q(0.32, t0, -0.08), q(0.32, t1, -0.08), nf)
    quadN(stone, q(0.32, t0, -0.08), q(0.32, t0, -D), q(0.32, t1, -D), q(0.32, t1, -0.08), w.N(Math.cos((t0 + t1) / 2), Math.sin((t0 + t1) / 2)))
  }
}

function portal(cx: number) {
  const hw = 2.45, y0 = EY, y1 = EY + 0.7, top = 9.6
  // the frontispiece block, with an arched doorway right through it
  const w = new Wall([cx + hw, y1], [cx - hw, y1])
  face(w, 0, top, stone, [{ s0: hw - 1.5, s1: hw + 1.5, z0: DOOR, z1: 8.6, arch: true, depth: 0.7 + 1.0, back: win, rev: stone, sill: stone }])
  // sides and top of the block
  const sideE = new Wall([cx + hw, y0], [cx + hw, y1]), sideW = new Wall([cx - hw, y1], [cx - hw, y0])
  face(sideE, 0, top, stone, [])
  face(sideW, 0, top, stone, [])
  // little pediment
  const pw = new Wall([cx + hw + 0.15, y1 + 0.05], [cx - hw - 0.15, y1 + 0.05])
  ledge(stone, w, -0.15, w.L + 0.15, top - 0.35, top, 0.15)
  triN(stone, pw.P(0, top), pw.P(pw.L, top), pw.P(pw.L / 2, top + 1.0), pw.N(0, 0, 1))
  for (const sgn of [-1, 1]) {
    const a: V3 = [cx + sgn * (hw + 0.15), y1 + 0.05, top], b: V3 = [cx, y1 + 0.05, top + 1.0]
    const a2: V3 = [a[0], y0, top], b2: V3 = [cx, y0, top + 1.0]
    quadN(tile, a, b, b2, a2, unit([sgn * 1.0, 0, hw]))
  }
  cap(stone, [[cx - hw, y0], [cx + hw, y0], [cx + hw, y1], [cx - hw, y1]], top)
}

function tower(x0: number, x1: number) {
  const y0 = EY - 3.3, y1 = EY + 0.3, top = 21.5
  const zones: Zone[] = L.hi ? [
    { z0: -1, z1: 2.9, p: stone },
    ...wingZones(top).filter((z) => z.z0 >= 2.9 && z.z1 <= MZ1 + 0.5),
    { z0: MZ1 + 0.5, z1: 16.6, p: brick },
  ] : [
    { z0: -1, z1: 4.0, p: stone }, { z0: 4.0, z1: 5.0, p: brick }, { z0: 5.0, z1: 6.4, p: stone }, { z0: 6.4, z1: 7.4, p: brick },
    { z0: 7.4, z1: MZ1 + 0.5, p: stone }, { z0: MZ1 + 0.5, z1: 16.6, p: brick },
  ]
  const stripes = L.hi ? [16.6, 17.2, 17.8, 18.4, 19.0, 19.6, 20.2, 20.8] : [16.6, 18.0, 19.6, 20.6]
  stripes.forEach((z, i) => zones.push({ z0: z, z1: stripes[i + 1] ?? top + 1, p: i % 2 === 0 ? stone : brick }))
  const ring: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  for (let i = L.hi ? 0 : 1; i < 4; i++) {
    const w = new Wall(ring[i], ring[(i + 1) % 4])
    const ops: Op[] = []
    if (i === 2) {
      // a small arched niche at the mezzanine and a slit window above
      ops.push({ s0: w.L / 2 - 0.45, s1: w.L / 2 + 0.45, z0: MZ0 - 0.2, z1: MZ1 + 0.3, arch: true, depth: 0.25, back: brick, rev: stone, seg: L.small + 2 })
      ops.push({ s0: w.L / 2 - 0.25, s1: w.L / 2 + 0.25, z0: 12.5, z1: 15.0, arch: true, depth: 0.25, back: win, rev: stone, seg: 4 })
    }
    face(w, 0, top, zones, ops)
  }
  ledge(stone, new Wall([x1, y1], [x0, y1]), -0.15, TW + 0.15, top - 0.4, top, 0.15)
  // stone cap
  box(stone, x0 - 0.1, y0 - 0.1, x1 + 0.1, y1 + 0.1, top - 0.4, top + 0.1)
  // the open lantern: posts and arches round a little drum, and the spire
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, h = 1.1
  const z0 = top + 0.1, z1 = top + 2.3
  if (L.hi) {
    // an octagonal arcade, open right through
    const ring8 = octagon(cx, cy, h)
    for (let i = 0; i < 8; i++) {
      const w = new Wall(ring8[i], ring8[(i + 1) % 8])
      face(w, z0, z1, stone, [{ s0: 0.15, s1: w.L - 0.15, z0: z0 + 0.2, z1: z1 - 0.25, arch: true, depth: 0.18, back: null, rev: stone, seg: 4 }])
    }
    prismRing(brick, null, octagon(cx, cy, 0.45), z0, z1)
    ringAnnulus(stone, octagon(cx, cy, h - 0.18), octagon(cx, cy, 0.45), z1 - 0.25, false)
    ringAnnulus(stone, octagon(cx, cy, h - 0.18), octagon(cx, cy, 0.45), z0 + 0.2, true)
  } else {
    for (const [px, py] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) box(stone, cx + px * (h - 0.25) - 0.25, cy + py * (h - 0.25) - 0.25, cx + px * (h - 0.25) + 0.25, cy + py * (h - 0.25) + 0.25, z0, z1)
    prismRing(brick, null, octagon(cx, cy, 0.5), z0, z1)
  }
  box(stone, cx - h - 0.1, cy - h - 0.1, cx + h + 0.1, cy + h + 0.1, z1, z1 + 0.3)
  ringRoof(tile, octagon(cx, cy, h + 0.05), z1 + 0.3, [cx, cy], top + 5.6)
}

function octagonTower() {
  const [cx, cy] = OC
  // ---- lower stage: plain base, a row of small arched windows, frieze, cornice
  {
    const ring = octagon(cx, cy, O1)
    for (let i = 0; i < 8; i++) {
      const w = new Wall(ring[i], ring[(i + 1) % 8])
      const ops: Op[] = []
      const nw = L.hi ? 2 : 0
      for (let k = 0; k < nw; k++) {
        const c = (w.L * (k + 0.5)) / nw
        ops.push({ s0: c - 0.4, s1: c + 0.4, z0: 24.0, z1: 25.0, arch: true, depth: 0.3, back: win, rev: brick, seg: L.small + 2 })
      }
      if (L.hi) {
        const n = 6, p = w.L / n
        for (let k = 0; k < n; k++) ops.push({ s0: p * (k + 0.5) - p * 0.36, s1: p * (k + 0.5) + p * 0.36, z0: 26.68, z1: 27.05, arch: true, depth: 0.1, back: brick, rev: stone, sill: stone, seg: 4 })
      }
      face(w, 16, O1TOP, [{ z0: 0, z1: 25.25, p: brick }, { z0: 25.25, z1: 25.5, p: stone }, { z0: 25.5, z1: 26.6, p: brick }, { z0: 26.6, z1: 27.1, p: stone }, { z0: 27.1, z1: 99, p: brick }], ops)
    }
    octBand(stone, cx, cy, O1 + 0.2, O1TOP - 0.4, O1TOP)
    // the lean-to tile roof up to the gallery stage
    ringRoof(tile, octagon(cx, cy, O1 + 0.35), O1TOP - 0.1, octagon(cx, cy, O2 - 0.05), O2BASE + 0.1)
  }
  // ---- upper stage: the arcaded gallery, three openings a face, open right through
  {
    const t = 0.5 // wall thickness
    const ring = octagon(cx, cy, O2)
    const inner = octagon(cx, cy, O2 - t)
    const core = octagon(cx, cy, O2 - t - 1.0)
    const oz0 = 29.0, oz1 = 32.0
    for (let i = 0; i < 8; i++) {
      const w = new Wall(ring[i], ring[(i + 1) % 8])
      const len = w.L, pier = 0.6, gap = L.hi ? 0.14 : 0.3
      const ow = (len - 2 * pier - 2 * gap) / 3
      const ops: Op[] = []
      for (let k = 0; k < 3; k++) {
        const s0 = pier + k * (ow + gap)
        ops.push({ s0, s1: s0 + ow, z0: oz0, z1: oz1, arch: true, depth: t, back: null, rev: brick, sill: stone, seg: L.hi ? 8 : 4 })
      }
      const zones: Zone[] = [{ z0: 0, z1: 28.6, p: brick }, { z0: 28.6, z1: 28.9, p: stone }, { z0: 28.9, z1: 32.2, p: brick }, { z0: 32.2, z1: 32.6, p: stone }, { z0: 32.6, z1: 99, p: brick }]
      if (L.hi) {
        const n = 5, p = len / n
        for (let k = 0; k < n; k++) ops.push({ s0: p * (k + 0.5) - p * 0.34, s1: p * (k + 0.5) + p * 0.34, z0: 32.22, z1: 32.58, arch: true, depth: 0.08, back: brick, rev: stone, sill: stone, seg: 4 })
      }
      face(w, O2BASE, O2TOP, zones, ops)
      // the inside face of the gallery wall, with the same openings
      const wi = new Wall(inner[(i + 1) % 8], inner[i])
      const k0 = t * Math.tan(Math.PI / 8)
      if (L.hi) face(wi, oz0, oz1 + 0.5, win, ops.filter((o) => o.back === null).map((o) => ({ ...o, s0: wi.L - (o.s1 - k0), s1: wi.L - (o.s0 - k0), depth: 0 })))
      // colonnettes standing in the openings' joints
      if (L.hi) {
        for (let k = 1; k < 3; k++) {
          const s = pier + k * ow + (k - 0.5) * gap
          const [x, y] = w.P(s, 0, -t / 2)
          cylinder(stone, x, y, 0.13, oz0, oz1 - ow / 2 - 0.2, 8)
          box(stone, x - 0.22, y - 0.22, x + 0.22, y + 0.22, oz1 - ow / 2 - 0.2, oz1 - ow / 2)
        }
      }
    }
    octBand(stone, cx, cy, O2 + 0.2, O2TOP - 0.4, O2TOP)
    // floor and ceiling of the gallery walk, and the inner drum
    ringAnnulus(stone, inner, core, oz0, true)
    // the dark inside of the gallery (window slate, so the openings read deep)
    ringAnnulus(win, inner, core, oz1 + 0.5, false)
    prismRing(win, null, core, oz0, oz1 + 0.5)
    // octagonal tile pyramid
    ringRoof(tile, octagon(cx, cy, O2 + 0.6), O2TOP, [cx, cy], APEX)
  }
  // ---- the lantern and finial
  {
    const r = 0.45, z0 = APEX - 0.6, z1 = APEX + 1.0
    if (L.hi) {
      const ring = octagon(cx, cy, r)
      for (let i = 0; i < 8; i++) {
        const w = new Wall(ring[i], ring[(i + 1) % 8])
        face(w, z0, z1, patina, [{ s0: 0.06, s1: w.L - 0.06, z0: z0 + 0.6, z1: z1 - 0.12, arch: true, depth: 0.08, back: null, rev: patina, seg: 4 }])
      }
      prismRing(patina, null, octagon(cx, cy, 0.18), z0, z1)
      ringAnnulus(patina, octagon(cx, cy, r - 0.08), octagon(cx, cy, 0.18), z1 - 0.12, false)
      ringAnnulus(patina, octagon(cx, cy, r - 0.08), octagon(cx, cy, 0.18), z0 + 0.6, true)
    } else {
      prismRing(patina, null, octagon(cx, cy, r), z0, z1)
    }
    ringRoof(patina, octagon(cx, cy, r + 0.08), z1, octagon(cx, cy, r + 0.08), z1 + 0.12, true)
    ringRoof(patina, octagon(cx, cy, r + 0.06), z1 + 0.12, [cx, cy], TIP - 0.3)
    // a small ball and pin
    prismRing(patina, null, octagon(cx, cy, 0.08), TIP - 0.4, TIP)
  }
}

/** A cornice band round an octagon: outer walls and the underside. */
function octBand(p: Part, cx: number, cy: number, r: number, z0: number, z1: number) {
  prismRing(p, null, octagon(cx, cy, r), z0, z1)
  ringAnnulus(p, octagon(cx, cy, r), octagon(cx, cy, r - 0.3), z0, false)
}

/** A flat annulus between two concentric rings, facing up or down. */
function ringAnnulus(p: Part, outer: XY[], inner: XY[], z: number, up: boolean) {
  const n = outer.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a: V3 = [outer[i][0], outer[i][1], z], b: V3 = [outer[j][0], outer[j][1], z], c: V3 = [inner[j][0], inner[j][1], z], d: V3 = [inner[i][0], inner[i][1], z]
    quadN(p, a, b, c, d, up ? [0, 0, 1] : [0, 0, -1])
  }
}

/** A south wing: gabled north–south, long outer face, gable end on the courtyard. */
function wing(x0: number, x1: number, y0: number, y1: number, eave: number, ridge: number, outerEast: boolean) {
  const zones = wingZones(eave)
  // outer long face
  {
    const x = outerEast ? x1 : x0
    const w = outerEast ? new Wall([x, y0], [x, y1]) : new Wall([x, y1], [x, y0])
    const n = L.hi ? 15 : 11, p = w.L / n, ops: Op[] = []
    for (let k = 0; k < n; k++) {
      const c = p * (k + 0.5)
      ops.push({ s0: c - 0.65, s1: c + 0.65, z0: TW0, z1: eave - 2.4, arch: true, depth: 0.45, back: win, rev: brick, sill: stone, seg: L.small + (L.hi ? 4 : 2), flush: !L.hi })
      ops.push({ s0: c - 0.5, s1: c + 0.5, z0: 4.4, z1: 6.6, depth: 0.25, back: win, rev: stone, flush: !L.hi })
    }
    ops.push(...frieze(0.2, w.L - 0.2, eave))
    face(w, 0, eave, zones, ops)
    eaveLedges(w, eave)
  }
  // inner long face, on the courtyard: plain brick with punched windows
  {
    const x = outerEast ? x0 : x1
    const w = outerEast ? new Wall([x, y1], [x, y0]) : new Wall([x, y0], [x, y1])
    face(w, 0, eave, brick, [])
    ledge(stone, w, 0, w.L, eave - 0.6, eave, 0.3)
    const cl = 16.4, n = 4, p = cl / n, base = outerEast ? w.L - cl : 0
    for (let k = 0; k < n; k++) for (const [z0, z1] of [[4.0, 6.4], [8.2, 10.6], [12.0, 14.4]]) {
      const s = base + p * (k + 0.5)
      panelW(w, s - 0.55, s + 0.55, z0, Math.min(z1, eave - 1.2))
    }
  }
  // south gable end on the courtyard
  {
    const w = new Wall([x0, y0], [x1, y0])
    const c = w.L / 2, ops: Op[] = []
    const fl = !L.hi
    for (const d of [-3.6, 0, 3.6]) ops.push({ s0: c + d - 0.6, s1: c + d + 0.6, z0: 2.6, z1: 4.9, depth: 0.25, back: win, rev: stone, flush: fl })
    for (const d of [-2.2, 2.2]) ops.push({ s0: c + d - 0.75, s1: c + d + 0.75, z0: 7.0, z1: 10.4, arch: true, depth: 0.35, back: win, rev: brick, sill: stone, seg: L.small + 2, flush: fl })
    for (const d of [-2.2, 2.2]) ops.push({ s0: c + d - 0.75, s1: c + d + 0.75, z0: 11.8, z1: eave - 2.2, arch: true, depth: 0.35, back: win, rev: brick, sill: stone, seg: L.small + 2, flush: fl })
    ops.push({ s0: c - 0.6, s1: c + 0.6, z0: eave + 0.2, z1: eave + 2.0, arch: true, depth: 0.3, back: win, rev: brick, seg: L.small + 2, flush: fl })
    face(w, 0, ridge, [{ z0: -1, z1: 1.4, p: stone }, { z0: 1.4, z1: 99, p: brick }], ops, [eave, ridge])
    ledge(stone, w, 0, w.L, eave - 0.6, eave, 0.3)
    rake(stone, w, eave, ridge, 0.5, 0.15)
    // a little balcony under the upper windows
    const [bx, by] = w.P(c, 0, 0)
    box(stone, bx - 1.3, by - 0.7, bx + 1.3, by, 10.6, 11.0, true)
  }
  gableRoof(x0, x1, y0, y1, eave, ridge, { alongY: true, side: 0.45, end: 0.25 })
}

/** The flat-roofed blocks behind the north range, round the courtyard. */
function rear() {
  // west and east rear blocks
  for (const [x0, x1, y0, h] of [[-17.8, -9.5, -25.7, 15.9], [9.0, 18.1, -25.9, 16.5]]) {
    const ring: XY[] = [[x0, y0], [x1, y0], [x1, NY0], [x0, NY0]]
    for (let i = 0; i < 4; i++) {
      if (i === 2) continue // against the north range
      const w = new Wall(ring[i], ring[(i + 1) % 4])
      face(w, 0, h, brick, [])
      if (i === 0) {
        for (let k = 0; k < 2; k++) for (const [z0, z1] of [[2.0, 4.6], [6.0, 8.6], [10.0, 12.6]]) {
          const s = (w.L * (k + 0.5)) / 2
          panelW(w, s - 1.4, s + 1.4, z0, z1)
        }
      }
    }
    for (const z of [5.3, 9.3]) ledge(stone, new Wall(ring[0], ring[1]), 0, x1 - x0, z, z + 0.3, 0.1)
    ledge(stone, new Wall(ring[0], ring[1]), -0.1, x1 - x0 + 0.1, h - 0.5, h, 0.2)
    cap(flat, ring, h)
  }
  // centre: low south bay, middle flat, and the raised hipped block behind the octagon
  {
    const parts: [number, number, number][] = [[-19.1, -14.0, 13.5], [-14.0, -6.0, 15.8]]
    for (const [y0, y1, h] of parts) {
      const ring: XY[] = [[-9.5, y0], [9.0, y0], [9.0, y1], [-9.5, y1]]
      for (let i = 0; i < 4; i++) face(new Wall(ring[i], ring[(i + 1) % 4]), 0, h, brick, [])
      cap(flat, ring, h)
      const w = new Wall(ring[0], ring[1])
      if (y0 < -18) {
        for (const d of [-4.6, 0, 4.6]) for (const [z0, z1] of [[1.6, 4.2], [5.6, 8.2], [9.6, 12.2]]) panelW(w, w.L / 2 + d - 1.5, w.L / 2 + d + 1.5, z0, z1)
        for (const z of [4.9, 8.9]) ledge(stone, w, 0, w.L, z, z + 0.35, 0.12)
        ledge(stone, w, -0.1, w.L + 0.1, h - 0.5, h, 0.2)
      }
    }
    const x0 = AX - 7.5, x1 = AX + 7.5
    const ring: XY[] = [[x0, -6.0], [x1, -6.0], [x1, NY0 + 1], [x0, NY0 + 1]]
    for (let i = 0; i < 4; i++) face(new Wall(ring[i], ring[(i + 1) % 4]), 0, 21.0, brick, [])
    const ws = new Wall(ring[0], ring[1])
    ledge(stone, ws, -0.1, ws.L + 0.1, 20.4, 21.0, 0.3)
    for (const d of [-4.5, -1.5, 1.5, 4.5]) panelW(ws, ws.L / 2 + d - 0.6, ws.L / 2 + d + 0.6, 17.0, 19.4)
    gableRoof(x0, x1, -6.0, NY0 + 4, 21.0, 24.6, { alongY: true, side: 0.4, end: 0.3, hipEnd: [true, false] })
  }
}

// ---------------------------------------------------------------------------

function build(hi: boolean) {
  L = hi ? { hi, seg: 10, small: 6 } : { hi, seg: 6, small: 4 }
  resetParts()
  const tally = () => [brick, stone, tile, win, flat, patina].reduce((n, p) => n + p.triangles, 0)
  let t0 = 0
  const step = (name: string, f: () => void) => { f(); const t = tally(); if (process.env.PROFILE) console.log(`  ${name}: ${t - t0}`); t0 = t }
  step('north range', northRange)
  step('entrance', entrance)
  step('octagon', octagonTower)
  step('west wing', () => wing(-32.8, -17.8, -42.4, NY0, 16.2, 19.2, false))
  step('east wing', () => wing(18.1, 33.0, -42.5, NY0, 18.5, 21.4, true))
  step('rear', rear)
  if (hi) step('steps', steps)
  return [
    { part: brick, material: { ...finish('powell-brick', 0xc48b78), floodlight: lit } },
    { part: stone, material: { ...finish('powell-stone', 0xe8d8bd), floodlight: lit } },
    { part: tile, material: PALETTE.terracotta },
    { part: win, material: PALETTE.window },
    { part: flat, material: PALETTE.roof },
    { part: patina, material: PALETTE.patina },
  ] as { part: Part; material: MaterialSpec }[]
}

/** The entrance steps (detail only): six brick risers between stone cheeks. */
function steps() {
  const x0 = AX - 6.2, x1 = AX + 6.2
  for (let k = 0; k < 6; k++) {
    const y1 = EY + 0.7 + 3.0 - k * 0.5
    box(brick, x0, EY, x1, y1, 0, G + 0.15 * (k + 1))
  }
  for (const x of [x0 - 0.6, x1]) box(stone, x, EY, x + 0.6, EY + 3.9, 0, G + 1.1)
}

/** Night: the quad front (north faces) is floodlit from the plaza. */
function lit(p: V3, n: V3) {
  if (n[1] < 0.35 || p[1] < 28) return 0
  return Math.max(0, Math.min(1, 1.05 - Math.max(0, p[2] - G) / 26)) * n[1]
}

function writeModel(file: string, parts: { part: Part; material: MaterialSpec }[], maxTris: number) {
  const tris = parts.reduce((s, { part }) => s + part.triangles, 0)
  const used = parts.filter((p) => p.part.triangles > 0)
  const glb = writeGlb('Powell Library', used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the lowest ground', bearing: 0, elevation: 0, height: TIP, replaces: ['way/422876626'] })
  const maxBytes = maxTris > 8000 ? 1536 * 1024 : 250 * 1024
  console.log(`${file}: ${tris} triangles, ${glb.length} bytes; ` + used.map(({ part, material }) => `${material.name} ${part.triangles}`).join(', '))
  if (tris > maxTris) throw new Error(`${file}: ${tris} triangles`)
  if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes`)
  if (used.length > 6) throw new Error(`${file}: too many materials`)
  Bun.write(new URL(`../models/${file}.glb`, import.meta.url).pathname, glb)
}

if (import.meta.main) {
  writeModel(ID, build(false), 6500)
  writeModel(`${ID}.detail`, build(true), 40000)
}
