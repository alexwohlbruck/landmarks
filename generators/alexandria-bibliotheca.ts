/**
 * Bibliotheca Alexandrina (Snøhetta, competition 1988, opened 2002),
 * Shatby, Alexandria: original procedural geometry, CC0-1.0, no textures.
 *   bun generators/alexandria-bibliotheca.ts
 * Writes models/alexandria-bibliotheca.glb (low) and
 * models/alexandria-bibliotheca.detail.glb (detail: louvre bars in every
 * roof eyelid, carved script on the drum, the entrance columns, rounder
 * sphere).
 *
 * This file also exports a few helpers the other models by this builder
 * use (`slopedCap`, `clipBelow`, `ringAt`). Merge it first.
 *
 * Map frame: x east, y north, z up, metres. Anchor = the centre of the
 * circle fitted to the OSM outline (way/97409601 with way/1245270052;
 * residuals under 1.3 m), lng 29.90929, lat 31.20882. Bearing 340: model
 * +y points to 340 deg, square to the Corniche (Al Geish Road, which runs
 * at 60-72 deg past the building), the way the roof tilts down to the sea.
 *
 * Identity, in order: the 160 m disc of the roof tilted down to the sea,
 * a diagonal lattice of panels each with a north-facing glazed eyelid;
 * the grey granite drum carved with script, leaning outward, highest at
 * the south; the notch cut out of the disc on the west-south-west (glazed
 * faces onto the plaza); the dark planetarium sphere on the plaza with its
 * ring bands and its "eye".
 *
 * Evidence
 *  - Plan: OSM way/97409601 (the disc less a notch) and way/1245270052
 *    (the wedge that closes the notch's south side), both 11 levels and
 *    tagged with the library's wikidata (Q501851); in this frame the arc
 *    runs from -131 deg round by the east and north to +149 deg, radius
 *    77.6 m (fitted; Snøhetta publishes "160 m"), and the notch's apex is
 *    (-22.8, -41.7). Planetarium: OSM way/157879323, a 24 m square pit,
 *    centre (-96.9, 53.0), turned 30 deg.
 *  - Heights: published (Snøhetta project page; Wikipedia): rises to 32 m
 *    above ground, 12 m below; the roof tilts toward the sea. Here the
 *    roof plane runs from 33 m at the south rim to 2 m at the north rim
 *    (slope 0.2, about 11 deg), ESTIMATED from p5 (north rim about 2 m
 *    over the Corniche pavement) and p12 (the drum's coping stands over
 *    the roof on the north side). The drum leans out up to about 8 deg
 *    (published: "vertical to circa 8 degrees"); drawn as 0.1 m out per
 *    metre up. The recessed glazed ground floor under the south drum
 *    (granite from 6.5 m) is from p6 and p21.
 *  - Roof lattice: diamonds 15 m across (east-west) by 20 m (north-south)
 *    in plan, from p5 (about 10 across the disc); each a plate
 *    tilted 2.4 m less steeply than the roof, so it steps up over its
 *    northern neighbours, with its northern half glazed (p1, p5, p9, n1).
 *  - Planetarium: sphere 17 m across, ESTIMATED from the 24 m OSM pit and
 *    p14/p16 (it fills about 70 % of the pit); about 60 % of it shows over
 *    a 3 m plinth (p13, p16; the plaza stands above the north rim). Its eye (the recessed opening ringed by
 *    lit rings) faces the plaza, model south-south-east (p16, p20, n2);
 *    six ring bands round the eye axis (p17, n2).
 *  - Terrain: Mapterhorn 404s at z13-z15 here; at z12 (about 30 m a pixel)
 *    it is a surface model that shows the library itself as a 17 m hill.
 *    The ground outside is 1-5 m, rising gently to the south. y = 0 is the
 *    north rim; the planetarium plinth is 3 m (the plaza stands above the street,
 *    p13, p19), its sphere clipped at 2.7 m inside the pit. Terrain check
 *    (z12): ok, ok.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    p1 Mido, "BA roof.jpg", CC BY 3.0 (roof eyelids close up)
 *      https://commons.wikimedia.org/wiki/File:BA_roof.jpg
 *    p2 Filip Maljković, "BibAlex from the sea (2715600208).jpg", CC BY-SA 2.0
 *      https://commons.wikimedia.org/wiki/File:BibAlex_from_the_sea_(2715600208).jpg
 *    p5 Mahmoud Saaid, "BA outside view.jpg", CC BY 2.5 (from the Corniche, north: the lattice)
 *      https://commons.wikimedia.org/wiki/File:BA_outside_view.jpg
 *    p6 Ahmedsalahemam, "Alexandria library (1).jpg", CC BY-SA 4.0 (south drum, notch glazing)
 *      https://commons.wikimedia.org/wiki/File:Alexandria_library_(1).jpg
 *    p8 Ahmed Hagrasi, "Alexandria Library View.jpg", CC BY-SA 4.0 (drum and pool, north)
 *      https://commons.wikimedia.org/wiki/File:Alexandria_Library_View.jpg
 *    p12 Avocato, "BA outside (2).jpg", CC BY-SA 3.0 (drum over the roof, north)
 *      https://commons.wikimedia.org/wiki/File:BA_outside_(2).jpg
 *    p13 Zeinab Aly, "القبة السماوية ومبنى مكتبة الإسكندرية.jpg", CC BY-SA 4.0 (planetarium, plinth)
 *      https://commons.wikimedia.org/wiki/File:القبة_السماوية_ومبنى_مكتبة_الإسكندرية.jpg
 *    p14 Nikola Smolenski, "Bibliotheca Alexandrina planetarium.jpg", CC BY-SA 3.0 rs (the pit)
 *      https://commons.wikimedia.org/wiki/File:Bibliotheca_Alexandrina_planetarium.jpg
 *    p16 Mmelouk, "Alexandria library outside.jpg", CC BY-SA 4.0 (plaza, sphere)
 *      https://commons.wikimedia.org/wiki/File:Alexandria_library_outside.jpg
 *    p17 Ahmed Younis Sif Saad, "Library of Alexandria -1.JPG", CC BY-SA 4.0 (sphere close: bands, eye, colour)
 *      https://commons.wikimedia.org/wiki/File:Library_of_Alexandria_-1.JPG
 *    p20 David Lisbona, "Flickr - dlisbona - Alexandria library and conference centre.jpg", CC BY 2.0
 *      https://commons.wikimedia.org/wiki/File:Flickr_-_dlisbona_-_Alexandria_library_and_conference_centre.jpg
 *    p21 Alacoolwiki, "Alexandrie - Egypte 2008 11.jpg", CC BY-SA 4.0 (the carved drum, granite colour)
 *      https://commons.wikimedia.org/wiki/File:Alexandrie_-_Egypte_2008_11.jpg
 *    p23 Hassan Hamdy wahidy, "Bibliotheca Alexandrina GLAM EGY 05.jpg", public domain
 *      https://commons.wikimedia.org/wiki/File:Bibliotheca_Alexandrina_GLAM_EGY_05.jpg
 *    n1 Bibliotheca Alexandrina, "BA night water.jpg", public domain (the lit roof eyelids)
 *      https://commons.wikimedia.org/wiki/File:BA_night_water.jpg
 *    n2 Roland Unger, "AlexBibliothecaNight1.jpg", CC BY-SA 3.0 (the lit planetarium rings)
 *      https://commons.wikimedia.org/wiki/File:AlexBibliothecaNight1.jpg
 *  - Colours, sampled: granite #adaba7 sunlit (p21, p8), drawn #c4c2ba;
 *    roof panels #c8ccc7 (p5), drawn #dde1de; sphere #43454b-#727581 (p17,
 *    p14), drawn #63666c; eyelid glazing blue-grey, lit pale cyan at night
 *    (n1); sphere rings pale metal, lit violet-blue at night (n2).
 *  No look-only sources. No commercial imagery. No lidar exists here.
 *
 * Invented or simplified: the pool on the north side and the plaza paving
 * are the map's; the footbridge over the plaza is left out; the carved
 * characters are a stand-in set of letters from several scripts, not a
 * trace of the real wall; the notch faces are drawn as plain grouped
 * glazing. Doubts: the exact tilt axis (taken square to the Corniche);
 * the north rim's height; the plaza level (drawn at y = 0).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { triangulate, type XY } from './chi-aon-center'
import { face } from './phl-independence-hall'
import { beam, fquad, ftri } from './berlin-oberbaum-bridge'
import { cyl, writeModel, type Slot } from './pretoria-union-buildings'
import { Pen, strokes } from './lettering'

// ---------------------------------------------------------------------------
// Helpers shared with this builder's other models.

/** Triangulate a counter-clockwise ring and lift it onto the surface z(x, y), facing up. */
export function slopedCap(p: Part, ring: XY[], z: (x: number, y: number) => number) {
  for (const [a, b, c] of triangulate(ring)) {
    const A: V3 = [ring[a][0], ring[a][1], z(...ring[a])], B: V3 = [ring[b][0], ring[b][1], z(...ring[b])], C: V3 = [ring[c][0], ring[c][1], z(...ring[c])]
    face(p, [A, B, C], [0, 0, 1])
  }
}

/** Drop every triangle of `p` lying wholly below z0 and clamp the rest onto it. */
export function clipBelow(p: Part, z0 = 0) {
  const pos: number[] = [], nrm: number[] = [], uv: number[] = []
  for (let t = 0; t < p.pos.length / 9; t++) {
    // Part stores glTF (x, z, -y): height is component 1.
    const ys = [p.pos[t * 9 + 1], p.pos[t * 9 + 4], p.pos[t * 9 + 7]]
    if (Math.max(...ys) <= z0 + 1e-6) continue
    for (let k = 0; k < 3; k++) {
      pos.push(p.pos[t * 9 + k * 3], Math.max(z0, p.pos[t * 9 + k * 3 + 1]), p.pos[t * 9 + k * 3 + 2])
      nrm.push(p.nrm[t * 9 + k * 3], p.nrm[t * 9 + k * 3 + 1], p.nrm[t * 9 + k * 3 + 2])
    }
    uv.push(...p.uv.slice(t * 6, t * 6 + 6))
  }
  p.pos = pos; p.nrm = nrm; p.uv = uv
}

/** A point at angle a (radians, counter-clockwise from +x) and radius r about (cx, cy). */
export const ringAt = (cx: number, cy: number, r: number, a: number, z: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]

// ---------------------------------------------------------------------------

const ID = 'alexandria-bibliotheca'
const NAME = 'Bibliotheca Alexandrina'
const ANCHOR: [number, number] = [29.90929, 31.20882]
const BEARING = 340

const R = 77.6
const RAD = Math.PI / 180
/** The roof plane: 33 m at the south rim, 2 m at the north rim. */
const roofZ = (_x: number, y: number) => 17.5 - (15.5 * y) / R
const LEAN = 0.1
const A0 = -131 * RAD, A1 = 149 * RAD
const APEX: XY = [-22.8, -41.7]
const P1: XY = [R * Math.cos(A1), R * Math.sin(A1)]
const P0: XY = [R * Math.cos(A0), R * Math.sin(A0)]
/** The recessed glazed ground floor under the south drum. */
const ENT0 = -131 * RAD, ENT1 = -72 * RAD, ENTZ = 6.5

function inside(ring: XY[], p: XY) {
  let c = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i], b = ring[j]
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c
  }
  return c
}
function distToSeg(p: XY, a: XY, b: XY) {
  const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy)
}

function build(detail: boolean): Slot[] {
  const granite = new Part(), alu = new Part(), lit = new Part(), win = new Part(), sphere = new Part(), rings = new Part()
  const STEP = (detail ? 2.5 : 5) * RAD

  // The disc less the notch, counter-clockwise.
  const arcN = Math.ceil((A1 - A0) / STEP)
  const arc: number[] = Array.from({ length: arcN + 1 }, (_, i) => A0 + ((A1 - A0) * i) / arcN)
  const outline: XY[] = [...arc.map((a) => [R * Math.cos(a), R * Math.sin(a)] as XY), APEX]

  // --- roof: the skin, the lattice of stepped plates and eyelids, the rim.
  const inner = outline.map(([x, y]) => [x, y] as XY)
  slopedCap(alu, inner, roofZ)
  const HX = 7.5, HY = 10, H = 2.4
  const nearEdge = (p: XY) => Math.hypot(p[0], p[1]) > R - 2.2 || distToSeg(p, P1, APEX) < 2.2 || distToSeg(p, APEX, P0) < 2.2
  const ok = (p: XY) => inside(outline, p) && !nearEdge(p)
  for (let j = -12; j <= 12; j++) for (let i = -14; i <= 14; i++) {
    if ((i + j) % 2 !== 0) continue
    const cx = i * HX, cy = j * HY
    const N: XY = [cx, cy + HY], S: XY = [cx, cy - HY], E: XY = [cx + HX, cy], W: XY = [cx - HX, cy]
    if (![N, S, E, W].every(ok)) continue
    const lift = (p: XY, k: number): V3 => [p[0], p[1], roofZ(p[0], p[1]) + 0.12 + k * H]
    const n = lift(N, 1), s = lift(S, 0), e = lift(E, 0.5), w = lift(W, 0.5)
    const sb = lift(S, 0), nb: V3 = [N[0], N[1], roofZ(...N) + 0.05], eb: V3 = [E[0], E[1], roofZ(...E) + 0.05], wb: V3 = [W[0], W[1], roofZ(...W) + 0.05]
    // plate: south half aluminium, north half glazed
    face(alu, [s, e, w], [0, 0, 1])
    face(lit, [w, e, n], [0, 0, 1])
    // the steps over the northern neighbours (glazed) and the low sides (aluminium)
    const side = (dst: Part, a: V3, b: V3, ab: V3, bb: V3, out: XY) => face(dst, [ab, bb, b, a], [out[0], out[1], 0])
    side(lit, e, n, eb, nb, [HY, HX])
    side(lit, n, w, nb, wb, [-HY, HX])
    if (!ok([cx + HX, cy - 2 * HY]) || !ok([cx + 2 * HX, cy - HY])) side(alu, s, e, sb, eb, [HY, -HX])
    if (!ok([cx - HX, cy - 2 * HY]) || !ok([cx - 2 * HX, cy - HY])) side(alu, w, s, wb, sb, [-HY, -HX])
    if (detail) {
      // two louvre bars across each eyelid, parallel to its east-west diagonal
      for (const t of [0.35, 0.68]) {
        const a: V3 = [w[0] + (n[0] - w[0]) * t, w[1] + (n[1] - w[1]) * t, w[2] + (n[2] - w[2]) * t + 0.12]
        const b: V3 = [e[0] + (n[0] - e[0]) * t, e[1] + (n[1] - e[1]) * t, e[2] + (n[2] - e[2]) * t + 0.12]
        beam(alu, a, b, 0.3, [0, 0, 1], true, 0.2)
      }
    }
  }

  // --- the drum: granite, leaning out, coursed in bands of alternate relief.
  const top = (a: number) => Math.max(roofZ(0, R * Math.sin(a)) + 1.3, 3.6)
  const TIER = detail ? 3.2 : 4.6, PROUD = 0.22, T = 0.9
  const rOut = (z: number, k: number) => R + LEAN * z + (k % 2 ? PROUD : 0)
  for (let i = 0; i < arcN; i++) {
    const a = arc[i], b = arc[i + 1], am = (a + b) / 2
    const ta = top(a), tb = top(b)
    const entrance = am > ENT0 && am < ENT1
    const z0 = entrance ? ENTZ : 0
    const P = (ang: number, r: number, z: number) => ringAt(0, 0, r, ang, z)
    // tiers up the outer face
    const zt = Math.min(ta, tb)
    let k = 0
    for (let z = z0; z < zt - 0.01; z += TIER, k++) {
      const z1 = Math.min(z + TIER, zt), last = z1 >= zt - 0.01
      const za = last ? ta : z1, zb = last ? tb : z1
      const n0: V3 = [Math.cos(am), Math.sin(am), 0]
      const q = [P(a, rOut(z, k), z), P(b, rOut(z, k), z), P(b, rOut(zb, k), zb), P(a, rOut(za, k), za)]
      fquad(granite, q[0], q[1], q[2], q[3], [n0[0], n0[1], -LEAN])
      if (k % 2) {
        // ledges top and bottom of a proud tier
        fquad(granite, P(a, rOut(z, 0), z), P(b, rOut(z, 0), z), P(b, rOut(z, 1), z), P(a, rOut(z, 1), z), [0, 0, -1])
        if (!last) fquad(granite, P(a, rOut(z1, 1), z1), P(b, rOut(z1, 1), z1), P(b, rOut(z1, 0), z1), P(a, rOut(z1, 0), z1), [0, 0, 1])
      }
      if (last) {
        // coping, then the inner face down to the roof
        const kr = (zz: number) => rOut(zz, k)
        fquad(granite, P(a, kr(ta), ta), P(b, kr(tb), tb), P(b, R - T, tb), P(a, R - T, ta), [0, 0, 1])
        const ra = roofZ(0, R * Math.sin(a)) - 0.5, rb = roofZ(0, R * Math.sin(b)) - 0.5
        fquad(granite, P(b, R - T, rb), P(a, R - T, ra), P(a, R - T, ta), P(b, R - T, tb), [-Math.cos(am), -Math.sin(am), 0])
      }
    }
    if (entrance) {
      // soffit under the drum and the recessed glazing behind
      const RI = R - 3.2
      fquad(granite, P(a, RI, ENTZ), P(a, rOut(ENTZ, 0), ENTZ), P(b, rOut(ENTZ, 0), ENTZ), P(b, RI, ENTZ), [0, 0, -1])
      fquad(win, P(a, RI, 0), P(b, RI, 0), P(b, RI, ENTZ), P(a, RI, ENTZ), [Math.cos(am), Math.sin(am), 0])
    }
  }
  // the drum's cut ends at the notch
  for (const [ang, sgn] of [[A0, -1], [A1, 1]] as [number, number][]) {
    const t = top(ang), d: XY = [-Math.sin(ang) * sgn, Math.cos(ang) * sgn]
    const z0 = ang === A0 ? ENTZ : 0
    face(granite, [ringAt(0, 0, R - T, ang, z0), ringAt(0, 0, R + LEAN * z0, ang, z0), ringAt(0, 0, R + LEAN * t, ang, t), ringAt(0, 0, R - T, ang, t)], [d[0], d[1], 0])
  }
  // entrance columns under the drum
  {
    const n = detail ? 10 : 6
    for (let i = 0; i < n; i++) {
      const a = ENT0 + ((ENT1 - ENT0) * (i + 0.5)) / n
      const c = ringAt(0, 0, R - 1.2, a, 0)
      cyl(alu, c[0], c[1], 0.55, 0, ENTZ, detail ? 12 : 6, false)
    }
  }

  // --- the notch: glazed faces onto the plaza under an aluminium fascia.
  for (const [A, B] of [[P1, APEX], [APEX, P0]] as [XY, XY][]) {
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], n: XY = [u[1], -u[0]]
    const at = (s: number, z: number, o = 0): V3 => [A[0] + u[0] * s + n[0] * o, A[1] + u[1] * s + n[1] * o, z]
    const zr = (s: number) => roofZ(A[0] + u[0] * s, A[1] + u[1] * s)
    const z0 = (s: number) => (A === APEX ? 0 : 0)
    // wall skin, fascia band
    face(alu, [at(0, z0(0)), at(L, z0(L)), at(L, zr(L)), at(0, zr(0))], [n[0], n[1], 0])
    face(alu, [at(0, zr(0) - 1.4, 0.6), at(L, zr(L) - 1.4, 0.6), at(L, zr(L) + 0.3, 0.6), at(0, zr(0) + 0.3, 0.6)], [n[0], n[1], 0])
    face(alu, [at(0, zr(0) - 1.4), at(L, zr(L) - 1.4), at(L, zr(L) - 1.4, 0.6), at(0, zr(0) - 1.4, 0.6)], [0, 0, -1])
    face(alu, [at(0, zr(0) + 0.3, 0.6), at(L, zr(L) + 0.3, 0.6), at(L, zr(L) + 0.3), at(0, zr(0) + 0.3)], [0, 0, 1])
    // glazing in bays 7.5 m wide, two-storey groups (about 9 m)
    const bays = Math.round(L / 7.5), bw = L / bays
    for (let q = 0; q < bays; q++) {
      const s0 = q * bw + 0.35, s1 = (q + 1) * bw - 0.35
      const zTop = Math.min(zr(s0), zr(s1)) - 1.9
      for (let z = 0.4; z < zTop - 1.5; z += 9) {
        const z1 = Math.min(z + 8.4, zTop)
        face(win, [at(s0, z, 0.05), at(s1, z, 0.05), at(s1, z1, 0.05), at(s0, z1, 0.05)], [n[0], n[1], 0])
      }
    }
  }

  // --- planetarium: plinth around the pit, the sphere, its ring bands and eye.
  {
    const C: XY = [-96.9, 53.0], turn = 30 * RAD, half = 12, th = 0.9, zp = 3.0
    const sq = (h: number): XY[] => [[-h, -h], [h, -h], [h, h], [-h, h]].map(([x, y]) => [C[0] + x * Math.cos(turn) - y * Math.sin(turn), C[1] + x * Math.sin(turn) + y * Math.cos(turn)] as XY)
    const o = sq(half), ii = sq(half - th)
    for (let k = 0; k < 4; k++) {
      const j = (k + 1) % 4
      face(granite, [[...o[k], 0], [...o[j], 0], [...o[j], zp], [...o[k], zp]] as V3[], [o[j][1] - o[k][1], o[k][0] - o[j][0], 0])
      face(granite, [[...ii[j], 0], [...ii[k], 0], [...ii[k], zp], [...ii[j], zp]] as V3[], [ii[k][1] - ii[j][1], ii[j][0] - ii[k][0], 0])
      face(granite, [[...o[k], zp], [...o[j], zp], [...ii[j], zp], [...ii[k], zp]] as V3[], [0, 0, 1])
    }
    const RS = 8.5, cz = 4.5
    const ax = -72 * RAD
    const d: V3 = [Math.cos(ax), Math.sin(ax), 0], e1: V3 = [-Math.sin(ax), Math.cos(ax), 0], e2: V3 = [0, 0, 1]
    // point at polar angle th (from the eye axis) and azimuth ph
    const S = (r: number, thA: number, ph: number): V3 => {
      const c = Math.cos(thA), s = Math.sin(thA)
      return [C[0] + r * (d[0] * c + (e1[0] * Math.cos(ph) + e2[0] * Math.sin(ph)) * s), C[1] + r * (d[1] * c + (e1[1] * Math.cos(ph) + e2[1] * Math.sin(ph)) * s), cz + r * (d[2] * c + (e1[2] * Math.cos(ph) + e2[2] * Math.sin(ph)) * s)]
    }
    const nAt = (thA: number, ph: number): V3 => { const p = S(1, thA, ph); return [p[0] - C[0], p[1] - C[1], p[2] - cz] }
    const NPH = detail ? 36 : 18, EYE = 44 * RAD
    const lat = [EYE, ...Array.from({ length: detail ? 14 : 8 }, (_, i) => EYE + ((Math.PI - EYE) * (i + 1)) / (detail ? 14 : 8))]
    for (let i = 0; i < lat.length - 1; i++) for (let k = 0; k < NPH; k++) {
      const p0 = (k / NPH) * 2 * Math.PI, p1 = ((k + 1) / NPH) * 2 * Math.PI
      const t0 = lat[i], t1 = lat[i + 1]
      const A = S(RS, t0, p0), B = S(RS, t0, p1), Cc = S(RS, t1, p1), D = S(RS, t1, p0)
      sphere.tri(A, B, Cc, undefined, undefined, undefined, [nAt(t0, p0), nAt(t0, p1), nAt(t1, p1)])
      if (t1 < Math.PI - 1e-6) sphere.tri(A, Cc, D, undefined, undefined, undefined, [nAt(t0, p0), nAt(t1, p1), nAt(t1, p0)])
    }
    // the eye: a funnel into a recessed disc, with lit rings
    const deep = 2.2, rr = RS * Math.sin(EYE), xr = RS * Math.cos(EYE)
    const E = (r: number, x: number, ph: number): V3 => [C[0] + d[0] * x + (e1[0] * Math.cos(ph) + e2[0] * Math.sin(ph)) * r, C[1] + d[1] * x + (e1[1] * Math.cos(ph) + e2[1] * Math.sin(ph)) * r, cz + (e1[2] * Math.cos(ph) + e2[2] * Math.sin(ph)) * r]
    for (let k = 0; k < NPH; k++) {
      const p0 = (k / NPH) * 2 * Math.PI, p1 = ((k + 1) / NPH) * 2 * Math.PI
      // inner wall of the funnel (faces in, toward the axis and out of the eye)
      face(sphere, [E(rr, xr, p0), E(rr - 0.6, xr - deep, p0), E(rr - 0.6, xr - deep, p1), E(rr, xr, p1)], [d[0] - 0.3 * (e1[0] * Math.cos(p0) + e2[0] * Math.sin(p0)), d[1] - 0.3 * (e1[1] * Math.cos(p0) + e2[1] * Math.sin(p0)), -0.3 * Math.sin(p0)])
      face(sphere, [E(rr - 0.6, xr - deep, p0), E(0, xr - deep, p0), E(rr - 0.6, xr - deep, p1)], d)
    }
    // lit rings: the eye's rim and two inside, then six bands round the axis
    const band = (dst: Part, thA: number, w: number, h: number) => {
      // a raised strip round the sphere at polar angle thA, w wide (along the surface), h proud
      const dt = w / 2 / RS
      for (let k = 0; k < NPH; k++) {
        const p0 = (k / NPH) * 2 * Math.PI, p1 = ((k + 1) / NPH) * 2 * Math.PI
        const a0 = S(RS + h, thA - dt, p0), a1 = S(RS + h, thA - dt, p1), b0 = S(RS + h, thA + dt, p0), b1 = S(RS + h, thA + dt, p1)
        const c0 = S(RS - 0.05, thA - dt, p0), c1 = S(RS - 0.05, thA - dt, p1), f0 = S(RS - 0.05, thA + dt, p0), f1 = S(RS - 0.05, thA + dt, p1)
        face(dst, [a0, a1, b1, b0], nAt(thA, (p0 + p1) / 2))
        face(dst, [c0, c1, a1, a0], nAt(thA - Math.PI / 2, (p0 + p1) / 2))
        face(dst, [b0, b1, f1, f0], nAt(thA + Math.PI / 2, (p0 + p1) / 2))
      }
    }
    band(rings, EYE + 0.03, 0.55, 0.25)
    for (const t of [62, 80, 98, 116, 134, 152]) band(rings, t * RAD, 0.5, 0.18)
    for (const f of [0.45, 0.8]) {
      for (let k = 0; k < NPH; k++) {
        const p0 = (k / NPH) * 2 * Math.PI, p1 = ((k + 1) / NPH) * 2 * Math.PI, r0 = rr * f - 0.25, r1 = rr * f + 0.25, x = xr - deep + 0.08
        face(rings, [E(r0, x, p0), E(r1, x, p0), E(r1, x, p1), E(r0, x, p1)], d)
      }
    }
    clipBelow(sphere, 2.7)
    clipBelow(rings, 2.7)
  }

  // --- carved script on the drum (detail): letters from several scripts in relief.
  if (detail) carveScript(granite)

  const g = finish('bibalex-granite', 0xc4c2ba)
  return [
    { part: granite, material: g },
    { part: alu, material: finish('bibalex-aluminium', 0xdde1de) },
    { part: lit, material: finish('neon-bibalex-eyelid', 0x9fb5c4) },
    { part: win, material: PALETTE.window },
    { part: sphere, material: finish('bibalex-planetarium', 0x63666c) },
    { part: rings, material: finish('neon-bibalex-rings', 0xa3abcb) },
  ]
}

/** Letters standing 0.18 m proud of the drum, in loose rows on its south face. */
function carveScript(p: Part) {
  const glyphs: ((pen: Pen) => void)[] = [
    (q) => q.moveTo([0, 0]).lineTo([0.45, 1]).lineTo([0.9, 0]).moveTo([0.2, 0.42]).lineTo([0.7, 0.42]), // A
    (q) => q.moveTo([0.1, 0]).lineTo([0.1, 1]).moveTo([0.1, 1]).arc([0.1, 0.75], -Math.PI, 6).moveTo([0.1, 0.5]).arc([0.1, 0.25], -Math.PI, 6), // B-ish
    (q) => q.moveTo([0.05, 0.05]).cubicTo([0.2, 0.05], [0.05, 0.55], [0.3, 0.6]).cubicTo([0.6, 0.65], [0.8, 0.3], [0.95, 0.4]), // Arabic stroke
    (q) => q.circle([0.45, 0.5], 0.4, 0.4, 10).moveTo([0.45, 0.1]).lineTo([0.45, 0.9]), // phi
    (q) => q.moveTo([0, 0.5]).lineTo([1, 0.5]).moveTo([0.5, 0]).lineTo([0.5, 1]).moveTo([0.2, 0.15]).lineTo([0.8, 0.15]), // Chinese-like
    (q) => q.moveTo([0, 0.5]).quadTo([0.5, 1.1], [1, 0.5]).quadTo([0.5, -0.1], [0, 0.5]).moveTo([0.45, 0.5]).circle([0.5, 0.5], 0.1, 0.1, 6), // eye glyph
    (q) => q.moveTo([0.2, 0]).lineTo([0.2, 0.9]).arc([0.35, 0.9], -Math.PI * 0.9, 5), // note / hook
    (q) => q.moveTo([0, 1]).lineTo([0.5, 0]).lineTo([1, 1]), // V
    (q) => q.moveTo([0, 0]).lineTo([1, 0]).moveTo([0.15, 0]).lineTo([0.15, 0.8]).moveTo([0.85, 0]).lineTo([0.85, 0.8]).moveTo([0, 0.8]).lineTo([1, 0.8]), // pi
    (q) => q.moveTo([0.9, 0.85]).arc([0.5, 0.5], Math.PI * 1.6, 8), // C
  ]
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  for (let a = -128; a < 40; a += 5.5) {
    const ang = a * RAD, t = Math.max(roofZ(0, R * Math.sin(ang)) + 1.3, 3.6)
    for (let z = (ang > ENT0 && ang < ENT1 ? ENTZ : 0) + 2; z < t - 2.5; z += 4.2) {
      if (rnd() < 0.35) continue
      const pen = new Pen()
      glyphs[Math.floor(rnd() * glyphs.length)](pen)
      const size = 1.6 + rnd() * 1.4, a0 = ang + (rnd() - 0.5) * 2 * RAD, zz = z + rnd() * 0.8
      const k = Math.floor((zz - 0) / 3.2)
      const base = (h: number) => R + LEAN * h + (k % 2 ? 0.22 : 0)
      strokes(p, pen.paths, {
        width: 0.16, depth: 0.16,
        place: (u, v, w) => {
          const h = zz + v * size, aa = a0 + (u * size) / R
          const r = base(h) + w
          return [r * Math.cos(aa), r * Math.sin(aa), h]
        },
      })
    }
  }
}

if (import.meta.main) {
  const extras = { anchor: ANCHOR, bearing: BEARING }
  await writeModel(`${ID}.glb`, NAME, build(false), extras, 6500, 250_000)
  await writeModel(`${ID}.detail.glb`, NAME, build(true), extras, 40_000, 1_536_000)
}
