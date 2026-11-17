/**
 * Basílica de la Sagrada Família, Barcelona: procedural, CC0-1.0.
 * bun generators/barcelona-sagrada-familia.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/barcelona-sagrada-familia.glb, the low model (budget 6,500 tris);
 * - models/barcelona-sagrada-familia.detail.glb, drawn from zoom 16: the same
 *   forms with twice the segments and ribs, both-side crosses on the pinnacle discs, the Passion frieze's full
 *   18 posts and the cypress tip.
 *
 * Modelled as photographed in 2026, after the Tower of Jesus Christ was
 * topped out (cross completed 20 Feb 2026, blessed 10 Jun 2026). Photos dated
 * April 2026 and summer 2026 show it with the cross and no scaffold.
 *
 * Map frame: x east, y north, z up, metres. Built turned to the basilica's
 * own axis, bearing 314: the model's north (+y) is the apse (real NW), +x is
 * the Nativity façade (real NE), -x the Passion façade (real SW), -y the
 * Glory façade (real SE). The anchor is the area centroid of the OSM outline
 * relation/9194723 (with its six Passion portico column rings); everything is
 * authored about the crossing (the Tower of Jesus Christ's axis), which sits
 * at C = (4.85, 3.34) from the anchor in this frame.
 *
 * Ground: Mapterhorn z15 under the footprint runs from about 0 (the sunken
 * moat round the apse crypt) to 5-6 m (Passion side), the city sloping NW to
 * SE. y = 0 is that lowest ground; the published heights are taken from a
 * datum Z0 = 2 m above it (about the Glory/Mallorca street and the temple
 * floor), and every wall runs down to 0.
 *
 * Published (cited):
 * - Tower of Jesus Christ 172.5 m to the top of the cross (Wikipedia en/ca;
 *   Wikidata Q48435 P2048; catalannews.com "Sagrada Família reaches 172.5
 *   metres", Feb 2026). The cross is 17 m tall and 13.5 m wide, a 3D cross
 *   with four horizontal arms and an upper arm, white glazed ceramic and
 *   glass (sagradafamilia.org news, Jan 2026; artdependence.com, Feb 2026).
 * - Evangelists' towers 135 m; Virgin Mary tower 138 m with its 12-point
 *   glass star (ca.wikipedia plan legend). Star 7.5 m across (drawn 8.4 m so
 *   it reads at phone size).
 * - Apostles' bell towers (ca.wikipedia plan legend, matching OSM height
 *   tags): Nativity Bernabé 98, Simó 107, Judes Tadeu 107, Maties 98;
 *   Passion Jaume el Menor 107, Bartomeu 112, Tomàs 112, Felip 107.
 * - Nave 90 m long, 45 m wide (five aisles on a 7.5 m column grid),
 *   transept 60 m; vaults 45 m (nave), 30 m (aisles), 60 m (crossing),
 *   75 m (apse) (Wikipedia en).
 *
 * OSM (© OpenStreetMap contributors, ODbL), fetched Nov 2026:
 * - relation/9194723 outline, building=church, wikidata Q48435 (checked:
 *   "Basilica and Expiatory Church of the Holy Family").
 * - tower parts, used for every tower's position: the eight bell towers
 *   (way/1207779447, 1207779448, 1207779469, 661321474 Nativity;
 *   way/1207779425-1207779428 Passion), the four Evangelists
 *   (relation/16329171-16329174), the Virgin Mary (way/1207779418, base
 *   r 8.7 m), and the Jesus Christ rings (way/359084975-359086380:
 *   r 9.9 at 110 m, 9.3 at 120, 8.6 at 130, 7.3 at 140, 5.8 at 150), which
 *   give the cone's profile here. Their height tags for Mary (123) and the
 *   Evangelists (125) predate completion and are not used.
 * - relation/16329170 Sagristia Oest (west sacristy), relation/16329175
 *   (the crossing base).
 * - Positions read in this frame, from the crossing: Nativity towers
 *   x 33.9, y -16.0 / -8.7 / 6.6 / 14.1; Passion towers x -36.1,
 *   y -13.5 / -6.3 / 7.8 / 14.9; Evangelists (±10.9, ±10.9); Mary (0, 23.3);
 *   Passion portico columns at x -45..-50; nave ends at y -48 with the
 *   Glory narthex to -54.6; apse to y 45.
 *
 * Estimated (from the photos below, scaled against the published heights):
 * - bell towers: cylinder to ~45% of their height, parabolic taper to the
 *   pinnacle at H-25 m; pinnacle 7 m "Hosanna" stone section, then the
 *   mosaic needle, then the sun disc with its ring of white balls at the top.
 * - bell towers: the stone spindle is fluted, 8 deep grooves (14 in the
 *   detail model) flat-shaded, standing for the louvred openings that
 *   pierce them in every photo; the pinnacle above stays round.
 * - Jesus tower: fluted (8 sharp ribs, 16 in the detail model), in three
 *   stages read from the 2026 photos: shaft r 9 to a gallery at 107-110 m,
 *   a cone stepping in at 127 m and 141 m, and the top to r 2.2 at the
 *   cross foot (155.5 m). Widths scaled against the Evangelists (centres
 *   21.8 m apart) and the 13.5 m cross: about r 7 at 127 m and r 4.5 at
 *   141 m, slimmer than OSM's rings.
 * - Evangelists fluted (6 ribs; 12 in detail), r 3.5 at 40 m, a step at
 *   100 m, 1.1 at 122 m; pale orb 122-127 m and white winged figure to
 *   135 m. Mary fluted (8 ribs), r 7.8 at 50 m, a step at 96 m, 0.9 at
 *   126.5, white needle to 131.5, star centre 134.
 * - nave: aisle walls 28 m with a row of pointed gables to 34 m; clerestory
 *   ±12 m to 46 m with the tall white gables (fruit finials) to 50 m; roof
 *   ridge 54 m (the 2025-26 photos show the nave roof under white sheeting).
 *   Four bays a side between the transept and the Glory end.
 * - Nativity porch to 18 m with three pointed gables, central gable to 52 m
 *   and the cypress 50-62 m; Passion portico: six leaning bone columns to
 *   17 m, a 3 m overhang, an 18-column frieze sloping from 22 m at the ends
 *   to 33 m at the centre, white cross to 42 m.
 * - apse: semicircle r 22.5 about (0, 22), walls 30 m, seven chapel spires
 *   to 46 m, roof cone rising into the Mary tower at 52 m.
 * - west sacristy: r 9.5 drum to 14 m, pointed dome to 40 m, finial 45 m.
 * - cloister wings (13 m) filling the outline beside the apse on both sides.
 * - Glory: as built, a plain concrete end wall with the tall glazed central
 *   bay (2022 photo) and a 14 m narthex; no Glory towers exist yet.
 *
 * Colours from daylight photos, pulled to the palette's lightness, in three
 * stone tones: the new central towers (Jesus, Evangelists, Mary), the nave,
 * apse and sacristy a pale grey-white stone; the 1950s-70s Passion towers
 * and façade a grey-beige; the 1890s-1930s Nativity towers, façade, porch
 * and cypress a dark weathered ochre-brown. White trim for the cross, the
 * Evangelists' crowns, the nave gables, the Passion portico and the
 * pinnacle balls and crosses; red-orange trencadís on the pinnacles and the
 * fruit finials. No gold (six materials): the Evangelists' gold orbs are
 * drawn white with their crowns. Mary's glass star is `window`, so it
 * glows at night as the real star does. Night: the
 * towers and façades are floodlit (December 2025 night photo), the cross
 * fully (it is lit since 2026).
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 * - "Sagrada Família construction april 2026" 01-08, Rémih, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Sagrada_Fam%C3%ADlia_construction_april_2026_02.jpg
 *   (tower tops, cross, star, pinnacles, from the Passion side and W)
 * - "View of Sagrada Familia 2026 corrected", ほっきー, CC0,
 *   https://commons.wikimedia.org/wiki/File:View_of_Sagrada_Familia_2026_corrected.jpg
 *   (Nativity side from Plaça de Gaudí, with the cross)
 * - "Sagrada Família exterior Barcelona 2026", Wikipsico43, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Sagrada_Fam%C3%ADlia_exterior_Barcelona_2026.jpg
 *   (Passion façade and portico, cross)
 * - "Sagrada Familia, December 2025, Day" / "Night", Hendrik Manuels Stoops
 *   Lugo, CC BY 4.0 / CC0,
 *   https://commons.wikimedia.org/wiki/File:Sagrada_Familia,_December_2025,_Day.jpg
 *   https://commons.wikimedia.org/wiki/File:Sagrada_Familia,_December_2025,_Night.jpg
 * - "Sagrada Familia back side", Blablabalooo, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Sagrada_Familia_back_side.jpg
 * - "Sagrada Família side view 1", Reda Kerbush, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Sagrada_Fam%C3%ADlia_side_view_1.jpg
 * - "Sagrada Família, Barcelona" (from Park Güell, 2023), Julian Lupyan, CC0,
 *   https://commons.wikimedia.org/wiki/File:Sagrada_Fam%C3%ADlia,_Barcelona.jpg
 * - "Temple Expiatori de la Sagrada Familia de Barcelona" (aerial), Manel
 *   Subirats Ferrer, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Temple_Expiatori_de_la_Sagrada_Familia_de_Barcelona.jpg
 * - "SF - Gloria (2022)", Canaan, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:SF_-_Gloria_(2022).jpg
 * - "Basilique Sagrada Familia Barcelone. Vue sud-est 12" (2019), Chabe01,
 *   CC BY-SA 4.0 (nave gables and fruit finials),
 *   https://commons.wikimedia.org/wiki/File:Basilique_Sagrada_Familia_Barcelone._Vue_sud-est_12.jpg
 *
 * Look-only: none.
 *
 * Doubts:
 * - the Glory side: the newest licensed photo of it is from 2022; any
 *   2025-26 work on the Glory portico is not shown. No Mapillary token was
 *   available for street photos of that side.
 * - nave, transept and apse heights are photo estimates; the nave roof is
 *   under sheeting in every recent photo.
 * - the Passion portico's frieze slope and the sacristy height are
 *   estimates; the east sacristy is not in the OSM outline and is left out.
 * - the cypress has no green and the Evangelists' orbs no gold (six
 *   materials).
 * - the bell towers' louvres are suggested by fluting only; the real
 *   openings are many small slots in spiral rows.
 * - the Jesus tower's pierced top and lettering are not modelled.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** The crossing, from the anchor, in the model frame. */
const C: [number, number] = [4.85, 3.34]
/** Published heights are above this datum (see header). */
const Z0 = 2
const BEARING = 314

type Mats = {
  pas: Part; nat: Part; pale: Part; win: Part; red: Part; trim: Part
}

function build(detail: boolean) {
  const M: Mats = { pas: new Part(), nat: new Part(), pale: new Part(), win: new Part(), red: new Part(), trim: new Part() }
  const S = (n: number) => (detail ? n * 2 : n)
  const P = (x: number, y: number, z: number): V3 => [x + C[0], y + C[1], z]

  // ---------------------------------------------------------- primitives ---
  /** A triangle with one flat normal; Part.tri winds it to face `n`. */
  const triN = (p: Part, a: V3, b: V3, c: V3, n: V3) => p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  const quadN = (p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) => { triN(p, a, b, c, n); triN(p, a, c, d, n) }
  /** A flat face from points in order, normal from their geometry, facing away from `inside`. */
  const faceOut = (p: Part, pts: V3[], inside: V3) => {
    let n = unit(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])))
    const c = mul(pts.reduce(add, [0, 0, 0] as V3), 1 / pts.length)
    if (dot(n, sub(c, inside)) < 0) n = mul(n, -1)
    for (let i = 1; i < pts.length - 1; i++) triN(p, pts[0], pts[i], pts[i + 1], n)
  }

  /**
   * Surface of revolution about (cx, cy) from [r, z] (crossing frame, z
   * above y = 0), bottom to top. Smooth across bends under `smooth` degrees.
   * `pick` chooses a part per band. a0..a1 limits the sweep (half an apse).
   */
  function lathe(cx: number, cy: number, prof: [number, number][], segs: number, pick: (b: number) => Part, opts: { phase?: number; a0?: number; a1?: number; smooth?: number } = {}) {
    const { phase = 0, a0 = 0, a1 = TAU, smooth = 35 } = opts
    const full = a1 - a0 >= TAU - 1e-9
    const bandN = prof.slice(0, -1).map(([r0, z0], b) => {
      const [r1, z1] = prof[b + 1], er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
      return [ez / l, -er / l] as [number, number]
    })
    const lim = Math.cos((smooth * Math.PI) / 180)
    const vn = (b: number, end: 0 | 1): [number, number] => {
      const own = bandN[b], o = bandN[b + (end ? 1 : -1)]
      if (!o || own[0] * o[0] + own[1] * o[1] < lim) return own
      const s = [own[0] + o[0], own[1] + o[1]], l = Math.hypot(s[0], s[1])
      return [s[0] / l, s[1] / l]
    }
    const n = segs
    for (let b = 0; b < prof.length - 1; b++) {
      const part = pick(b)
      const [r0, z0] = prof[b], [r1, z1] = prof[b + 1]
      if (r0 === 0 && r1 === 0) continue
      const n0 = vn(b, 0), n1 = vn(b, 1)
      for (let i = 0; i < n; i++) {
        const ta = a0 + phase + ((a1 - a0) * i) / n, tb = a0 + phase + ((a1 - a0) * (i + 1)) / n
        const pt = (r: number, t: number, z: number) => P(cx + r * Math.cos(t), cy + r * Math.sin(t), z)
        const N = (nn: [number, number], t: number): V3 => unit([nn[0] * Math.cos(t), nn[0] * Math.sin(t), nn[1]])
        const A = pt(r0, ta, z0), B = pt(r0, tb, z0), Ct = pt(r1, tb, z1), D = pt(r1, ta, z1)
        if (r0 > 0) part.tri(A, B, Ct, undefined, undefined, undefined, [N(n0, ta), N(n0, tb), N(n1, tb)])
        if (r1 > 0) part.tri(A, Ct, D, undefined, undefined, undefined, [N(n0, ta), N(n1, tb), N(n1, ta)])
      }
      void full
    }
    return { top: prof[prof.length - 1] }
  }
  /** A flat disc cap on a lathe. */
  function discCap(p: Part, cx: number, cy: number, r: number, z: number, segs: number, up = true, phase = 0) {
    const ring: V3[] = []
    for (let i = 0; i < segs; i++) { const t = phase + (TAU * i) / segs; ring.push(P(cx + r * Math.cos(t), cy + r * Math.sin(t), z)) }
    for (let i = 1; i < segs - 1; i++) triN(p, ring[0], ring[i], ring[i + 1], [0, 0, up ? 1 : -1])
  }

  /** Inset a convex ccw polygon by d. */
  const inset = (poly: [number, number][], d: number): [number, number][] => poly.map((v, i) => {
    const a = poly[(i + poly.length - 1) % poly.length], b = poly[(i + 1) % poly.length]
    const e1 = [v[0] - a[0], v[1] - a[1]], e2 = [b[0] - v[0], b[1] - v[1]]
    const l1 = Math.hypot(e1[0], e1[1]), l2 = Math.hypot(e2[0], e2[1])
    const n1 = [-e1[1] / l1, e1[0] / l1], n2 = [-e2[1] / l2, e2[0] / l2] // inward (left) normals for ccw
    const k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    return [v[0] + (d * (n1[0] + n2[0])) / k, v[1] + (d * (n1[1] + n2[1])) / k]
  })
  /** A vertical prism over a convex ccw polygon, top edge bevelled by `bev`. */
  function prism(p: Part, poly: [number, number][], z0: number, z1: number, bev = 0.5, top: Part | null = p) {
    const n = poly.length
    const zt = bev > 0 ? z1 - bev : z1
    for (let i = 0; i < n; i++) {
      const a = poly[i], b = poly[(i + 1) % n]
      const e = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(e[0], e[1])
      const nn: V3 = [e[1] / l, -e[0] / l, 0]
      quadN(p, P(a[0], a[1], z0), P(b[0], b[1], z0), P(b[0], b[1], zt), P(a[0], a[1], zt), nn)
    }
    if (!top) return
    const ring = bev > 0 ? inset(poly, bev) : poly
    if (bev > 0) for (let i = 0; i < n; i++) {
      const a = poly[i], b = poly[(i + 1) % n], c = ring[(i + 1) % n], d = ring[i]
      const e = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(e[0], e[1])
      const nn = unit([e[1] / l, -e[0] / l, 1])
      quadN(top, P(a[0], a[1], zt), P(b[0], b[1], zt), P(c[0], c[1], z1), P(d[0], d[1], z1), nn)
    }
    for (let i = 1; i < n - 1; i++) triN(top, P(ring[0][0], ring[0][1], z1), P(ring[i][0], ring[i][1], z1), P(ring[i + 1][0], ring[i + 1][1], z1), [0, 0, 1])
  }
  const rect = (x0: number, x1: number, y0: number, y1: number, ch = 0): [number, number][] => ch > 0
    ? [[x0 + ch, y0], [x1 - ch, y0], [x1, y0 + ch], [x1, y1 - ch], [x1 - ch, y1], [x0 + ch, y1], [x0, y1 - ch], [x0, y0 + ch]]
    : [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const ngon = (cx: number, cy: number, r: number, n: number, ph = 0): [number, number][] =>
    Array.from({ length: n }, (_, i) => [cx + r * Math.cos(ph + (TAU * i) / n), cy + r * Math.sin(ph + (TAU * i) / n)] as [number, number])

  /**
   * A convex polygon given in a vertical plane — (s, z) with s along the
   * horizontal unit `sd` from (ox, oy) — extruded `t` along the plane normal.
   */
  function slab(p: Part, pts: [number, number][], ox: number, oy: number, sd: [number, number], t: number) {
    const nd: [number, number] = [sd[1], -sd[0]]
    const at = (s: number, z: number, k: number) => P(ox + sd[0] * s + nd[0] * k, oy + sd[1] * s + nd[1] * k, z)
    const F = pts.map(([s, z]) => at(s, z, t / 2)), B = pts.map(([s, z]) => at(s, z, -t / 2))
    const ctr = mul(F.concat(B).reduce(add, [0, 0, 0] as V3), 1 / (2 * pts.length))
    faceOut(p, F, ctr)
    faceOut(p, B, ctr)
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length
      faceOut(p, [F[i], F[j], B[j], B[i]], ctr)
    }
  }

  /** A one-sided flat polygon in a vertical plane (as `slab`), facing `out`. */
  function panel(p: Part, pts: [number, number][], ox: number, oy: number, sd: [number, number], out: [number, number]) {
    const at = (s: number, z: number) => P(ox + sd[0] * s, oy + sd[1] * s, z)
    const F = pts.map(([s, z]) => at(s, z)), n: V3 = [out[0], out[1], 0]
    for (let i = 1; i < F.length - 1; i++) triN(p, F[0], F[i], F[i + 1], n)
  }

  /**
   * A fluted surface of revolution: `ribs` sharp ridges with valleys `depth`
   * (fraction of r) between them, flat-shaded so the ribs read. Profile
   * [r, z] bottom to top; equal z on successive points makes a ledge.
   */
  function fluted(p: Part, cx: number, cy: number, prof: [number, number][], ribs: number, depth: number, phase = 0) {
    const n = 2 * ribs
    const ring = ([r, z]: [number, number]) => Array.from({ length: n }, (_, k) => {
      const t = phase + (Math.PI * k) / ribs, rr = r * (k % 2 ? 1 - depth : 1)
      return P(cx + rr * Math.cos(t), cy + rr * Math.sin(t), z)
    })
    const R = prof.map(ring)
    const nb = prof.length - 1
    for (let k = 0; k < n; k++) {
      const j = (k + 1) % n
      // each band's facet normal in this column, facing out
      const N = Array.from({ length: nb }, (_, b) => {
        const q = [R[b][k], R[b][j], R[b + 1][j], R[b + 1][k]]
        let m = cross(sub(q[1], q[0]), sub(q[3], q[0]))
        if (Math.hypot(...m) < 1e-9) m = cross(sub(q[2], q[1]), sub(q[3], q[1]))
        m = unit(m)
        const c = mul(q.reduce(add, [0, 0, 0] as V3), 0.25), inside = P(cx, cy, (prof[b][1] + prof[b + 1][1]) / 2 - 0.3)
        return dot(m, sub(c, inside)) < 0 ? mul(m, -1) : m
      })
      const lim = Math.cos((35 * Math.PI) / 180)
      const vn = (b: number, end: 0 | 1): V3 => {
        const o = N[b + (end ? 1 : -1)]
        return o && dot(o, N[b]) > lim ? unit(add(o, N[b])) : N[b]
      }
      for (let b = 0; b < nb; b++) {
        const lo = vn(b, 0), hi = vn(b, 1)
        if (prof[b][0] > 0) p.tri(R[b][k], R[b][j], R[b + 1][j], undefined, undefined, undefined, [lo, lo, hi])
        if (prof[b + 1][0] > 0) p.tri(R[b][k], R[b + 1][j], R[b + 1][k], undefined, undefined, undefined, [lo, hi, hi])
      }
    }
    const top = prof[prof.length - 1]
    if (top[0] > 0) { const t = R[R.length - 1]; for (let i = 1; i < n - 1; i++) triN(p, t[0], t[i], t[i + 1], [0, 0, 1]) }
  }

  /** A tapered tube between two horizontal rings at different centres. */
  function strut(p: Part, rings: { c: [number, number]; r: number; z: number }[], segs: number, capTop = true) {
    const R = rings.map(({ c, r, z }) => Array.from({ length: segs }, (_, i) => {
      const t = (TAU * i) / segs + Math.PI / segs
      return P(c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), z)
    }))
    for (let k = 0; k < rings.length - 1; k++) {
      const axis = unit(sub(P(rings[k + 1].c[0], rings[k + 1].c[1], rings[k + 1].z), P(rings[k].c[0], rings[k].c[1], rings[k].z)))
      for (let i = 0; i < segs; i++) {
        const j = (i + 1) % segs
        const mid = mul(add(add(R[k][i], R[k][j]), add(R[k + 1][i], R[k + 1][j])), 0.25)
        const ctr = mul(add(P(rings[k].c[0], rings[k].c[1], rings[k].z), P(rings[k + 1].c[0], rings[k + 1].c[1], rings[k + 1].z)), 0.5)
        let nrm = sub(mid, ctr); nrm = unit(sub(nrm, mul(axis, dot(nrm, axis))))
        quadN(p, R[k][i], R[k][j], R[k + 1][j], R[k + 1][i], nrm)
      }
    }
    if (capTop) { const t = R[R.length - 1]; for (let i = 1; i < segs - 1; i++) triN(p, t[0], t[i], t[i + 1], [0, 0, 1]) }
  }

  /** An axis-aligned box (crossing frame). */
  function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = false) {
    prism(p, rect(x0, x1, y0, y1), z0, z1, 0)
    if (bottom) triN(p, P(x0, y0, z0), P(x1, y1, z0), P(x1, y0, z0), [0, 0, -1]), triN(p, P(x0, y0, z0), P(x0, y1, z0), P(x1, y1, z0), [0, 0, -1])
  }
  /** A pyramid point on a face: base square half `h` centred at c, apex at tip. */
  function point(p: Part, c: V3, h: number, axis: 0 | 1 | 2, tip: V3) {
    const o = [0, 1, 2].filter((k) => k !== axis)
    const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => {
      const v: V3 = [...c] as V3; v[o[0]] += a * h; v[o[1]] += b * h; return P(v[0], v[1], v[2])
    })
    const T = P(tip[0], tip[1], tip[2]), base = P(c[0], c[1], c[2])
    for (let i = 0; i < 4; i++) faceOut(p, [corners[i], corners[(i + 1) % 4], T], base)
  }

  // ======================================================= the church body ===
  // Nave (five aisles, x ±22.5) from the transept (y -15) to the Glory end
  // (y -48); same section continues north to the apse (y 15..22).
  const naveSection = (y0: number, y1: number) => {
    prism(M.pale, rect(-22.5, 22.5, y0, y1), 0, 28, 0.5, M.pale)
    prism(M.pale, rect(-12, 12, y0, y1), 28, 46, 0.4, null)
    // ridge roof along y, pale sheeting
    const r0 = P(-12, y0, 46), r1 = P(12, y0, 46), r2 = P(12, y1, 46), r3 = P(-12, y1, 46)
    const k0 = P(0, y0, 54), k1 = P(0, y1, 54)
    quadN(M.pas, r1, r2, k1, k0, unit([8, 0, 12]))
    quadN(M.pas, r3, r0, k0, k1, unit([-8, 0, 12]))
    triN(M.pale, r0, r1, k0, [0, -1, 0])
    triN(M.pale, r2, r3, k1, [0, 1, 0])
  }
  naveSection(-48, -15)
  naveSection(15, 22)
  // Transept arms along x, between the façades' towers.
  const armSection = (x0: number, x1: number, outerFace: boolean) => {
    prism(M.pale, rect(x0, x1, -15, 15), 0, 28, 0.5, M.pale)
    prism(M.pale, rect(x0, x1, -12, 12), 28, 46, 0.4, null)
    const r0 = P(x0, -12, 46), r1 = P(x1, -12, 46), r2 = P(x1, 12, 46), r3 = P(x0, 12, 46)
    const k0 = P(x0, 0, 54), k1 = P(x1, 0, 54)
    quadN(M.pas, r0, r1, k1, k0, unit([0, -8, 12]))
    quadN(M.pas, r2, r3, k0, k1, unit([0, 8, 12]))
    if (outerFace) {
      if (x1 > 0) triN(M.pale, r1, r2, k1, [1, 0, 0])
      else triN(M.pale, r3, r0, k0, [-1, 0, 0])
    }
  }
  armSection(15, 31, true)
  armSection(-32, -15, true)
  // Crossing: chamfered square to 60 m, an octagonal tier to 76 m.
  prism(M.pale, rect(-15, 15, -15, 15, 4), 0, 60, 0.6)
  prism(M.pale, ngon(0, 0, 13.5, 8, Math.PI / 8), 60, 76, 0.6)

  // Nave bays: lower pointed gables on the aisle walls, tall white gables
  // on the clerestory, rose windows between.
  const bays = [-21.75, -29.25, -36.75, -44.25]
  for (const side of [-1, 1]) {
    for (const yb of bays) {
      slab(M.trim, [[-3.6, 25], [3.6, 25], [0, 36]], side * 22.6, yb, [0, 1], 1.4)
      slab(M.trim, [[-3.4, 38], [3.4, 38], [0, 53]], side * 12.4, yb, [0, 1], 1.2)
      slab(M.trim, [[-1.8, 30], [1.8, 30], [1.8, 40], [-1.8, 40]], side * 12.4, yb, [0, 1], 1.0)
      // fruit finial
      lathe(side * 12.4, yb, [[0, 52.2], [1.1, 53.4], [0, 55.2]], S(4), () => M.red)
      // rose window on the aisle wall
      const rw = ngon(0, 15, 2.8, detail ? 12 : 6).map(([s, z]) => [s, z] as [number, number])
      panel(M.win, rw, side * 22.53, yb, [0, 1], [side, 0])
      // tall window panel on the clerestory face between gables
      panel(M.win, [[-1.3, 31], [1.3, 31], [1.3, 38], [0, 39.5], [-1.3, 38]], side * 12.03, yb - 3.75, [0, 1], [side, 0])
    }
  }
  // Transept side walls: one gable each where they show.
  for (const xs of [22.5, 27, -23.5, -28]) for (const side of [-1, 1]) {
    slab(M.trim, [[-2.2, 26], [2.2, 26], [0, 33]], xs, side * 15.1, [1, 0], 1.0)
    panel(M.win, ngon(0, 15, 2.0, S(8)), xs, side * 15.03, [1, 0], [0, side])
  }

  // Glory: plain end wall, tall glazed central bay, narthex.
  prism(M.pale, rect(-23, 23, -54.6, -48), 0, 14, 0.5)
  panel(M.win, [[-4.5, 16], [4.5, 16], [4.5, 44], [-4.5, 44]], 0, -48.03, [1, 0], [0, -1])
  for (const s of [-1, 1]) lathe(s * 6.2, -48.6, [[1.6, 0], [1.6, 30], [0, 31.5]], S(8), () => M.pas)
  panel(M.win, [[-6, 2], [6, 2], [6, 10], [-6, 10]], 0, -54.63, [1, 0], [0, -1])
  for (const s of [-1, 1]) panel(M.win, [[-3, 16], [3, 16], [3, 22], [-3, 22]], s * 16, -48.03, [1, 0], [0, -1])

  // Apse: half drum about (0, 22) r 22.5, walls to 30 m, roof cone to Mary.
  const apseSegs = S(8)
  {
    const poly: [number, number][] = [[22.5, 15]]
    for (let i = 0; i <= apseSegs; i++) { const t = (Math.PI * i) / apseSegs; poly.push([22.5 * Math.cos(t), 22 + 22.5 * Math.sin(t)]) }
    poly.push([-22.5, 15])
    prism(M.pale, poly, 0, 30, 0.5, null)
    lathe(0, 22, [[22.5, 30], [16, 40], [7.6, 52]], apseSegs, () => M.pas, { a0: 0, a1: Math.PI })
    // close the half cone's flat face toward the crossing with a wall
    slab(M.pas, [[-22.5, 30], [22.5, 30], [7.6, 52], [-7.6, 52]], 0, 22, [1, 0], 0.4)
    // chapel spires round the apse
    const nSp = 7
    for (let i = 0; i < nSp; i++) {
      const t = (Math.PI * (i + 0.5)) / nSp
      const x = 23 * Math.cos(t), y = 22 + 23 * Math.sin(t)
      lathe(x, y, [[2.4, 24], [2.0, 34], [0.9, 42], [0, 46]], S(5), (b) => (b === 2 ? M.trim : M.pas))
      panel(M.win, [[-1.4, 8], [1.4, 8], [1.4, 20], [0, 22], [-1.4, 20]], 22.53 * Math.cos(t), 22 + 22.53 * Math.sin(t), [-Math.sin(t), Math.cos(t)], [Math.cos(t), Math.sin(t)])
    }
  }

  // Cloister wings in the outline between the façades and the apse corners.
  prism(M.pale, rect(-40, -22.5, 18.5, 34.5), 0, 13, 0.5)
  prism(M.pale, rect(22.5, 38.5, 17.5, 35), 0, 13, 0.5)

  // West sacristy: drum and pointed dome.
  lathe(-28, 43, [[9.5, 0], [9.5, 14], [9.0, 18], [7.4, 26], [4.6, 33], [1.6, 38], [0.6, 40], [0, 45]], S(10), () => M.pale)

  // =========================================================== the towers ===
  /**
   * An Apostle's bell tower: cylinder, parabolic spindle, pinnacle, and the
   * sun-disc head facing `face` (unit x: +1 Nativity, -1 Passion).
   */
  function bellTower(x: number, y: number, H: number, R: number, stone: Part, face: 1 | -1) {
    const zc = 0.45 * H, zp = H - 25
    const prof: [number, number][] = [[R, 0], [R, zc]]
    const steps = detail ? 8 : 3
    for (let i = 1; i <= steps; i++) {
      const s = i / steps
      prof.push([2.2 + (R - 2.2) * (1 - Math.pow(s, 2.6)), zc + (zp - zc) * s])
    }
    const nStone = prof.length - 1
    // pinnacle: Hosanna section, then the mosaic needle in bands
    prof.push([1.75, zp + 7], [1.95, zp + 10], [1.35, zp + 14.5], [1.6, zp + 16.5], [0.9, H - 4.4], [0, H - 3.8])
    const pick = (b: number) => b <= nStone + 1 ? stone : b === nStone + 3 ? M.trim : M.red
    const pz = prof.map(([r, z]) => [r, z === 0 ? 0 : z + Z0] as [number, number])
    // Stone spindle fluted with deep grooves (flat-shaded) for the louvred,
    // pierced texture; the pinnacle above stays round.
    fluted(stone, x, y, pz.slice(0, nStone + 1), detail ? 14 : 8, 0.2, face > 0 ? 0 : Math.PI / 8)
    lathe(x, y, pz.slice(nStone), S(8), (b) => pick(b + nStone), { phase: Math.PI / 8 })
    // head: red sun disc in a white ring of balls, facing out from the façade
    const zc2 = H - 2.3 + Z0
    const disc = (r: number, n: number) => ngon(0, zc2, r, n).map(([s, z]) => [s, z] as [number, number])
    slab(M.red, disc(1.85, S(8)), x, y, [0, 1], 1.0)
    for (const k of [-1, 1]) panel(M.trim, disc(2.35, S(8)), x + k * 0.27, y, [0, 1], [k, 0])
    // the cross on the disc
    for (const k of detail ? [-1, 1] : [face]) {
      panel(M.trim, [[-0.32, zc2 - 1.3], [0.32, zc2 - 1.3], [0.32, zc2 + 1.3], [-0.32, zc2 + 1.3]], x + k * 0.52, y, [0, 1], [k, 0])
      panel(M.trim, [[-1.3, zc2 - 0.32], [1.3, zc2 - 0.32], [1.3, zc2 + 0.32], [-1.3, zc2 + 0.32]], x + k * 0.53, y, [0, 1], [k, 0])
    }
  }
  // Nativity (x +33.9): Bernabé, Simó, Judes Tadeu, Maties.
  for (const [y, H] of [[-16.0, 98], [-8.7, 107], [6.6, 107], [14.1, 98]] as [number, number][]) bellTower(33.9, y, H, 4.1, M.nat, 1)
  // Passion (x -36.1): Felip, Tomàs, Bartomeu, Jaume el Menor.
  for (const [y, H] of [[-13.5, 107], [-6.3, 112], [7.8, 112], [14.9, 107]] as [number, number][]) bellTower(-36.1, y, H, 4.3, M.pas, -1)

  // Tower of Jesus Christ.
  const jz = (z: number) => z + Z0
  // Ribbed, in three stages: the shaft to the gallery at 110 m, a cone
  // stepping in at 127 and 141 m, and the pierced top under the cross.
  fluted(M.pale, 0, 0, ([[9.0, 74], [9.0, 106], [9.8, 107], [9.8, 110], [8.3, 110], [7.0, 127], [6.3, 127], [4.8, 141], [4.2, 141], [2.6, 151], [2.2, 155.5]] as [number, number][]).map(([r, z]) => [r, jz(z)]), detail ? 16 : 8, 0.15)
  // The cross: shaft 155.5-172.5, four horizontal arms 13.5 m across at 166.
  {
    const w = 1.55, a = 1.35, zc = jz(166.2), top = jz(172.5)
    box(M.trim, -w, w, -w, w, jz(155.5), top - 1.6)
    point(M.trim, [0, 0, top - 1.6], w, 2, [0, 0, top])
    box(M.trim, -6.75 + 1.2, 6.75 - 1.2, -a, a, zc - a, zc + a)
    box(M.trim, -a, a, -6.75 + 1.2, 6.75 - 1.2, zc - a, zc + a)
    point(M.trim, [6.75 - 1.2, 0, zc], a, 0, [6.75, 0, zc])
    point(M.trim, [-6.75 + 1.2, 0, zc], a, 0, [-6.75, 0, zc])
    point(M.trim, [0, 6.75 - 1.2, zc], a, 1, [0, 6.75, zc])
    point(M.trim, [0, -6.75 + 1.2, zc], a, 1, [0, -6.75, zc])
  }

  // Four Evangelists: fluted spindle, orb and white winged figure.
  for (const [sx, sy] of [[1, 1], [1, -1], [-1, -1], [-1, 1]]) {
    const x = 10.9 * sx, y = 10.9 * sy
    fluted(M.pale, x, y, ([[3.5, 40], [3.3, 60], [2.85, 82], [2.4, 100], [2.05, 100], [1.5, 114], [1.1, 122]] as [number, number][]).map(([r, z]) => [r, jz(z)]), detail ? 12 : 6, 0.18, Math.atan2(sy, sx))
    lathe(x, y, ([[1.1, 122], [2.0, 124.5], [0.9, 127]] as [number, number][]).map(([r, z]) => [r, jz(z)]), S(4) + 2, () => M.trim)
    // the figure faces outward along the diagonal
    const out: [number, number] = [sx / Math.SQRT2, sy / Math.SQRT2], tan: [number, number] = [-out[1], out[0]]
    strut(M.trim, [{ c: [x, y], r: 1.2, z: jz(126.5) }, { c: [x, y], r: 1.0, z: jz(132.5) }, { c: [x, y], r: 0.5, z: jz(134) }], S(5))
    for (const k of [-1, 1]) slab(M.trim, [[0.6 * k, 127.5 + Z0], [2.6 * k, 131], [1.4 * k, 135 + Z0], [0.4 * k, 133 + Z0]].map(([s, z]) => [s, z === 131 ? 131 + Z0 : z] as [number, number]), x - out[0] * 0.3, y - out[1] * 0.3, tan, 0.5)
  }

  // Tower of the Virgin Mary and its star.
  fluted(M.pale, 0, 23.3, ([[7.8, 50], [7.2, 62], [6.5, 80], [5.6, 96], [5.0, 96], [3.8, 108], [2.6, 116], [1.5, 123], [0.9, 126.5]] as [number, number][]).map(([r, z]) => [r, jz(z)]), detail ? 16 : 8, 0.13, Math.PI / 2)
  lathe(0, 23.3, ([[1.0, 126.5], [0.55, 131.5], [0, 132]] as [number, number][]).map(([r, z]) => [r, jz(z)]), S(6), () => M.trim)
  {
    // twelve spikes along an icosahedron's vertices, 8.4 m tip to tip
    const g = (1 + Math.sqrt(5)) / 2
    const verts: V3[] = []
    for (const s1 of [-1, 1]) for (const s2 of [-1, 1]) verts.push([0, s1, s2 * g], [s1, s2 * g, 0], [s2 * g, 0, s1])
    const c: V3 = [0, 23.3, jz(134.2)]
    for (const v of verts) {
      const d = unit(v)
      const tip = add(c, mul(d, 4.2))
      const e1 = unit(cross(d, Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), e2 = cross(d, e1)
      const base = [0, 1, 2].map((k) => add(add(c, mul(d, 0.6)), add(mul(e1, 1.0 * Math.cos((TAU * k) / 3)), mul(e2, 1.0 * Math.sin((TAU * k) / 3)))))
      const PP = (q: V3) => P(q[0], q[1], q[2])
      for (let k = 0; k < 3; k++) faceOut(M.win, [PP(base[k]), PP(base[(k + 1) % 3]), PP(tip)], PP(c))
    }
  }

  // ====================================================== the façades ===
  // Nativity porch: a dark block in front of the towers, three pointed
  // portals, the tall central gable and the cypress.
  {
    const x0 = 30, x1 = 39.5, yc = -1.05
    prism(M.nat, rect(x0, x1, -19.5, 17.5), 0, 18, 0.6)
    for (const [yy, w, top] of [[yc, 7.4, 52], [-12.35, 6.6, 34], [10.35, 6.6, 34]] as [number, number, number][]) {
      slab(M.nat, [[-w / 2, 17], [w / 2, 17], [w / 2, top - 14], [0, top], [-w / 2, top - 14]], x1 - 2.4, yy, [0, 1], 4.4)
      // the portal's deep pointed opening
      panel(M.win, [[-w / 2 + 1.3, 1.5], [w / 2 - 1.3, 1.5], [w / 2 - 1.3, 10], [0, 15.5], [-w / 2 + 1.3, 10]], x1 + 0.03, yy, [0, 1], [1, 0])
    }
    // the cypress, between the inner towers
    lathe(35.5, yc, [[2.6, 49], [2.4, 54], [1.4, 59], [0, 63]], S(6), () => M.nat)
    if (detail) lathe(35.5, yc, [[0.5, 63], [0.5, 64.5], [0, 66]], 4, () => M.red)
    // wall between the towers up to the porch top
    prism(M.nat, rect(29, 36.5, -18, 16), 0, 40, 0.6)
  }

  // Passion façade: wall between the towers and the bone-column portico.
  {
    prism(M.pas, rect(-40, -30.5, -17.5, 18.5), 0, 40, 0.6)
    slab(M.pas, [[-2.9, 40], [2.9, 40], [0, 50]], -36.1, 0.75, [0, 1], 4)
    const yc = 0.75
    // six leaning columns, their feet where OSM maps them
    const feet: [number, number][] = [[-50.0, 9.6], [-48.0, 17.2], [-45.1, 22.7], [-48.2, -15.9], [-50.2, -8.3], [-45.4, -21.6]]
    for (const [fx, fy] of feet) {
      const tx = fx + 3.0, ty = yc + (fy - yc) * 1.04
      strut(M.pas, [
        { c: [fx, fy], r: 1.5, z: 0 },
        { c: [lerp(fx, tx, 0.5), lerp(fy, ty, 0.5)], r: 1.0, z: 9 },
        { c: [tx, ty], r: 1.6, z: 17.2 },
      ], S(5), false)
    }
    // overhang (white) on the columns
    prism(M.trim, rect(-51.5, -40, -24, 25.5), 17, 20.5, 0.5)
    // frieze: 18 bone posts under a sloped white band (the pediment)
    const ends = [-23.5, 25]
    const topAt = (y: number) => 22.5 + 11 * (1 - Math.abs(y - yc) / ((ends[1] - ends[0]) / 2))
    const nPosts = detail ? 18 : 10
    for (let i = 0; i < nPosts; i++) {
      const y = ends[0] + 1 + ((ends[1] - ends[0] - 2) * i) / (nPosts - 1)
      if (detail) box(M.trim, -46.6, -45.4, y - 0.55, y + 0.55, 20.5, topAt(y) - 1.4)
      else for (const k of [-1, 1]) panel(M.trim, [[-0.55, 20.5], [0.55, 20.5], [0.55, topAt(y) - 1.4], [-0.55, topAt(y) - 1.4]], -46 + k * 0.6, y, [0, 1], [k, 0])
    }
    // the sloped band, two halves
    for (const [ya, yb] of [[ends[0], yc], [yc, ends[1]]]) {
      const za = topAt(ya), zb = topAt(yb)
      const pts: [number, number][] = [[ya, za - 1.6], [yb, zb - 1.6], [yb, zb], [ya, za]]
      slab(M.trim, pts, -46, 0, [0, 1], 2.4)
    }
    // white cross over the centre
    box(M.trim, -46.7, -45.3, yc - 0.7, yc + 0.7, topAt(yc), topAt(yc) + 9)
    box(M.trim, -46.7, -45.3, yc - 2.8, yc + 2.8, topAt(yc) + 5.2, topAt(yc) + 6.6)
    // the portal recess behind the columns
    panel(M.win, [[-5, 1.5], [5, 1.5], [5, 13], [-5, 13]], -40.03, yc, [0, 1], [-1, 0])
  }

  return M
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// ----------------------------------------------------------------- write ---
// Night: floodlit towers and façades; faces looking up barely lit; the
// cross fully lit.
const lit = (p: V3, n: V3) => (p[2] > 157 ? 1 : n[2] > 0.8 ? 0.25 : p[2] < 125 ? 0.85 : 0.55)
function materials(M: Mats): Array<{ part: Part; material: MaterialSpec }> {
  return [
    { part: M.pas, material: { ...finish('sf-passion-stone', 0xc8b89b), floodlight: lit } },
    { part: M.nat, material: { ...finish('sf-nativity-stone', 0xa58a68), floodlight: lit } },
    { part: M.pale, material: { ...finish('sf-new-stone', 0xe0d5c0), floodlight: lit } },
    { part: M.win, material: PALETTE.window },
    { part: M.red, material: { ...finish('sf-trencadis', 0xcf6548), floodlight: lit } },
    { part: M.trim, material: { ...PALETTE.trim, floodlight: lit } },
  ]
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Basílica de la Sagrada Família', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: BEARING, elevation: 0, height: 172.5 + Z0,
  })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes, ${triangles} tris`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

await write('barcelona-sagrada-familia.glb', materials(build(false)), 6500, 250_000)
await write('barcelona-sagrada-familia.detail.glb', materials(build(true)), 40_000, 1536 * 1024)
