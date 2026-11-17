/**
 * Dolmabahçe Palace, Beşiktaş, Istanbul: procedural, CC0-1.0.
 * bun generators/istanbul-dolmabahce-palace.ts
 *
 * Built 1843-1856 for Abdülmecid (Garabet and Nigoğayos Balyan). The long
 * white palace on the European shore of the Bosphorus, in three parts that
 * OSM maps as three buildings: the Selamlık (Mabeyn, the state rooms) to
 * the south-west, the Ceremonial Hall (Muayede Salonu) in the middle and
 * the Harem to the north-east. Modelled: the two-storey Selamlık and Harem
 * wings with their balustraded parapets, low pale roofs and pedimented
 * column porticos; the Selamlık's white glass dome over the Crystal
 * Staircase; and the Ceremonial Hall's tall, richly pilastered block, twice
 * the wings' height, seven bays wide on the sea, with paired columns, two
 * tiers of great arched windows, a balustraded attic with finials and the
 * broad low hipped roof over its 36 m dome; in front of it the marble sea
 * gate on the quay.
 *
 * Frame: x along the shore (world 68.7), y inland (world 338.7); z up.
 * Placed with bearing 338.7 (OSM edges run 68.4-69.6 / 158-159.6). Origin
 * at the area-weighted centroid of the three outlines (29.000826,
 * 41.039321); the plan below is written in a frame centred at the brief's
 * point (28.99977, 41.03896) and shifted by (97.13, 4.96) on output. Flat
 * shore fill: elevation 0. No terrain check could run (Mapterhorn has no
 * z15 terrain here).
 *
 * OSM (ODbL), fetched 2026-11: way/175516451 (Selamlık), way/263949162
 * (Muayede Salonu), way/263949137 (Harem), all building=palace; the palace
 * item is Q274141 ("Dolmabahçe Palace", checked; the OSM ways carry no
 * wikidata). Walls follow these outlines exactly. The Muayede outline's
 * front projection and semicircle (x 50.7-77.7, to y -43.7) are the landing
 * stairs to the sea gate: only the gate is drawn there. Not modelled and
 * not replaced: the Saltanat Kapısı (way/1271934199) and Hazine Kapısı
 * (way/1423624915) gates, the Clock Tower, the Uzun Yol and Koltuk Kapısı
 * ways, the Veliaht Dairesi (now the Painting Museum, way/175523076) and the
 * outbuildings; all are separate OSM buildings outside these outlines.
 *
 * Published: the Ceremonial Hall's dome 36 m high (Wikipedia, "Dolmabahçe
 * Palace"); palace floor area 45,000 m2.
 * Estimated from the near-orthographic view across the Bosphorus by
 * Alexxx1979 (3.0 px/m on the 1280 px file against the Selamlık's 97 m
 * OSM front, checked against the Harem portico's position) and the frontal
 * views of the hall (SBarnes, Diego Delso DD 24: width / height 1.72):
 * - Selamlık cornice 18 m, parapet 19.5 m, roofs to about 21.5 m, the glass
 *   dome about 19 x 13 m rising to 25 m over x -26;
 * - Harem cornice 17.5 m, parapet 19 m;
 * - Ceremonial Hall block 58.4 m wide on the sea (photos give 62-66 m;
 *   centred on the sea gate at x 64.2, the OSM semicircle's centre),
 *   cornice 33.5 m, balustrade 36 m, hipped roof to about 42 m; its
 *   flanking low parts 19.5 m;
 * - the sea gate 10 m wide, 11 m to the crest's foot, crest to 13 m.
 * The photos make the tall block wider than the part of the Muayede
 * outline that reaches the front (x 38.1-101.4); it is drawn 58.4 m wide
 * about the gate, so its west front corner stands 3 m past the outline
 * (x 35.0-38.1, y -29.7 to -25.4), into what OSM leaves as open quay.
 * Invented / simplified: window counts (one panel per window at about 4 m
 * spacing on the wings), the carving, the hall's attic statuary as plain
 * finials, the inland Harem arm (to y 104) drawn like the sea wings, the
 * land faces drawn like the sea faces.
 *
 * Colours from daylight photos, pulled to the palette: cream-grey marble
 * (#e4ded3), whiter columns, cornices and gate (#f1ece3), pale grey roofs
 * (#a9b1b8), a white glass dome (`glass`). Night: the palace front is
 * floodlit (stone and trim carry _FLOODLIGHT); windows glow.
 *
 * Photos (EVIDENCE, all Wikimedia Commons):
 * - "Istanbul Bosphorus Dolmabahce Palace IMG 7589 1800.jpg", Alexxx1979,
 *   CC BY-SA 3.0 (across the Bosphorus, the whole front: the ruler)
 *   https://commons.wikimedia.org/wiki/File:Istanbul_Bosphorus_Dolmabahce_Palace_IMG_7589_1800.jpg
 * - "Dolmabahçe Palace 2007.jpg", SBarnes, CC BY-SA 3.0 (the hall's sea
 *   front and gate)
 *   https://commons.wikimedia.org/wiki/File:Dolmabah%C3%A7e_Palace_2007.jpg
 * - "Palacio de Dolmabahçe, Estambul, Turquía, 2024-09-29, DD 24.jpg",
 *   Diego Delso, CC BY-SA 4.0 (the hall, frontal)
 *   https://commons.wikimedia.org/wiki/File:Palacio_de_Dolmabah%C3%A7e,_Estambul,_Turqu%C3%ADa,_2024-09-29,_DD_24.jpg
 * - "Dolmabahçe Palace from the sea 2.JPG", Helge Høifødt, CC BY-SA 3.0
 *   (from the south-east: portico, glass dome, hall)
 *   https://commons.wikimedia.org/wiki/File:Dolmabah%C3%A7e_Palace_from_the_sea_2.JPG
 * - "View of Dolmabahçe Palace from the Bosphorus.jpg", Yair Haklai,
 *   CC BY-SA 4.0 (panorama of the whole front)
 *   https://commons.wikimedia.org/wiki/File:View_of_Dolmabah%C3%A7e_Palace_from_the_Bosphorus.jpg
 * - "Dolmabahce Mosque, Dolmabahce Palace and the Bosphorus Bridge in
 *   Istanbul.jpg", ArildV, CC BY 3.0 (from the south-west)
 *   https://commons.wikimedia.org/wiki/File:Dolmabahce_Mosque,_Dolmabahce_Palace_and_the_Bosphorus_Bridge_in_Istanbul.jpg
 * - "View of Dolmabahce palace from Tokpabi palace (13973967333).jpg", Erik
 *   Cleves Kristensen, CC BY 2.0 (telephoto from Topkapı: the roofs)
 *   https://commons.wikimedia.org/wiki/File:View_of_Dolmabahce_palace_from_Tokpabi_palace_(13973967333).jpg
 * - "Palacio de Dolmabahçe, Estambul, Turquía, 2024-09-28, DD 110.jpg",
 *   Diego Delso, CC BY-SA 4.0 (the Selamlık's garden front)
 *   https://commons.wikimedia.org/wiki/File:Palacio_de_Dolmabah%C3%A7e,_Estambul,_Turqu%C3%ADa,_2024-09-28,_DD_110.jpg
 * - "Dolmabahce Palace plan.svg", Gryffindor / Gothika, CC BY-SA 4.0 (the
 *   site plan: which part is which)
 *   https://commons.wikimedia.org/wiki/File:Dolmabahce_Palace_plan.svg
 * Look-only: none.
 *
 * Doubts: the hall block's exact extent along the shore (photo and OSM
 * differ by about 13 m at its west end); the land faces, the inland Harem
 * arm and the roofs behind the parapets are only seen from far off; the
 * Harem's portico position is read from one photo.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const TAU = Math.PI * 2

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), glass = new Part()
const lead = roof, gilt = trim

// Helpers (as in istanbul-blue-mosque.ts).

function poly(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    const g = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}
function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false) {
  p.loft([ring.map(([x, y]) => [x, y, z0] as V3), ring.map(([x, y]) => [x, y, z1] as V3)])
  if (top) poly(p, ring.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, ring.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
function rect(x0: number, x1: number, y0: number, y1: number, c = 0): XY[] {
  if (c <= 0) return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  return [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
}
function circle(cx: number, cy: number, r: number, n: number, phase = 0): XY[] {
  return Array.from({ length: n }, (_, k) => [cx + r * Math.cos(phase + (k * TAU) / n), cy + r * Math.sin(phase + (k * TAU) / n)] as XY)
}
function revolve(p: Part, cx: number, cy: number, prof: [number, number][], n: number, a0 = 0, a1 = TAU, smooth: boolean | 'ring' = true) {
  const m = prof.length
  const nrm2 = prof.map((_, i) => {
    const pa = prof[Math.max(0, i - 1)], pb = prof[Math.min(m - 1, i + 1)]
    const dr = pb[0] - pa[0], dz = pb[1] - pa[1], l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l] as [number, number]
  })
  for (let k = 0; k < n; k++) {
    const t0 = a0 + ((a1 - a0) * k) / n, t1 = a0 + ((a1 - a0) * (k + 1)) / n
    for (let i = 0; i < m - 1; i++) {
      const P = (j: number, t: number): V3 => [cx + prof[j][0] * Math.cos(t), cy + prof[j][0] * Math.sin(t), prof[j][1]]
      const N = (j: number, t: number): V3 => [nrm2[j][0] * Math.cos(t), nrm2[j][0] * Math.sin(t), nrm2[j][1]]
      const dr = prof[i + 1][0] - prof[i][0], dz = prof[i + 1][1] - prof[i][1], l = Math.hypot(dr, dz) || 1
      const S = (t: number): V3 => [(dz / l) * Math.cos(t), (dz / l) * Math.sin(t), -dr / l]
      const nA = smooth === 'ring' ? S(t0) : smooth ? N(i, t0) : S((t0 + t1) / 2), nB = smooth === 'ring' ? S(t1) : smooth ? N(i, t1) : S((t0 + t1) / 2)
      const nC = smooth === 'ring' ? S(t1) : smooth ? N(i + 1, t1) : S((t0 + t1) / 2), nD = smooth === 'ring' ? S(t0) : smooth ? N(i + 1, t0) : S((t0 + t1) / 2)
      const a = P(i, t0), b = P(i, t1), c = P(i + 1, t1), d = P(i + 1, t0)
      if (prof[i][0] > 1e-6) p.tri(a, b, c, undefined, undefined, undefined, [nA, nB, nC])
      if (prof[i + 1][0] > 1e-6) p.tri(a, c, d, undefined, undefined, undefined, [nA, nC, nD])
    }
  }
}
function domeProfile(r: number, z: number, h: number, rings: number): [number, number][] {
  const R = (r * r + h * h) / (2 * h), zc = z + h - R, top = Math.asin(r / R)
  return Array.from({ length: rings + 1 }, (_, k) => {
    const a = top * (1 - k / rings)
    return [R * Math.sin(a), zc + R * Math.cos(a)] as [number, number]
  })
}
function alem(cx: number, cy: number, z: number, h: number) {
  const w = Math.max(0.22, h * 0.07)
  revolve(gilt, cx, cy, [[w * 1.6, z - 0.2], [w * 2.6, z + h * 0.3], [w * 0.9, z + h * 0.55], [0, z + h]], 5)
}
/** A flat panel on a vertical wall from a to b (plan), offset out along n. */
function panel(p: Part, a: XY, b: XY, z0: number, z1: number, n: XY, arch = false, out = 0.05) {
  const o: XY = [n[0] * out, n[1] * out]
  const A: V3 = [a[0] + o[0], a[1] + o[1], z0], B: V3 = [b[0] + o[0], b[1] + o[1], z0]
  const N3: V3 = [n[0], n[1], 0]
  if (!arch) { poly(p, [A, B, [B[0], B[1], z1], [A[0], A[1], z1]], N3); return }
  const w = Math.hypot(b[0] - a[0], b[1] - a[1]), r = w / 2, zs = z1 - r
  poly(p, [A, B, [B[0], B[1], zs], [A[0], A[1], zs]], N3)
  const ux = (b[0] - a[0]) / w, uy = (b[1] - a[1]) / w, cx = (A[0] + B[0]) / 2, cy = (A[1] + B[1]) / 2
  const pts: V3[] = []
  for (let k = 0; k <= 6; k++) { const t = Math.PI - (Math.PI * k) / 6; pts.push([cx + ux * r * Math.cos(t), cy + uy * r * Math.cos(t), zs + r * Math.sin(t)]) }
  poly(p, pts, N3)
}
void TAU; void lead; void gilt; void alem; void circle

// ---------------------------------------------------------------------------
// More helpers.

/** Ear-clipping triangulation of a simple counter-clockwise ring; returns index triples. */
function earcut(r: XY[]): number[][] {
  const idx = r.map((_, i) => i), out: number[][] = []
  const cross = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cross(a, b, p) > 1e-9 && cross(b, c, p) > 1e-9 && cross(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = r[ia], b = r[ib], c = r[ic]
      if (cross(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inside(r[j], a, b, c))) continue
      out.push([ia, ib, ic]); idx.splice(i, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
function capRing(p: Part, r: XY[], z: number, up = true) {
  for (const [a, b, c] of earcut(r)) {
    const A: V3 = [r[a][0], r[a][1], z], B: V3 = [r[b][0], r[b][1], z], C: V3 = [r[c][0], r[c][1], z]
    if (up) p.tri(A, B, C); else p.tri(A, C, B)
  }
}
/** Offset an orthogonal-ish counter-clockwise ring outwards by d. */
function grow(r: XY[], d: number): XY[] {
  return r.map(([x, y], i) => {
    const p = r[(i + r.length - 1) % r.length], n = r[(i + 1) % r.length]
    const e1: XY = [x - p[0], y - p[1]], e2: XY = [n[0] - x, n[1] - y]
    const l1 = Math.hypot(...e1) || 1, l2 = Math.hypot(...e2) || 1
    const n1: XY = [e1[1] / l1, -e1[0] / l1], n2: XY = [e2[1] / l2, -e2[0] / l2]
    const s = n1[0] * n2[0] + n1[1] * n2[1]
    const k = d / Math.max(0.3, 1 + s)
    return [x + (n1[0] + n2[0]) * k, y + (n1[1] + n2[1]) * k] as XY
  })
}
const loftRing = (p: Part, r: XY[], z0: number, z1: number) => p.loft([r.map(([x, y]) => [x, y, z0] as V3), r.map(([x, y]) => [x, y, z1] as V3)])
/** Remove near-duplicate and collinear points. */
function clean(r: XY[]): XY[] {
  const o: XY[] = []
  for (const p of r) if (!o.length || Math.hypot(p[0] - o[o.length - 1][0], p[1] - o[o.length - 1][1]) > 0.3) o.push(p)
  if (Math.hypot(o[0][0] - o[o.length - 1][0], o[0][1] - o[o.length - 1][1]) < 0.3) o.pop()
  return o.filter((p, i) => {
    const a = o[(i + o.length - 1) % o.length], c = o[(i + 1) % o.length]
    return Math.abs((p[0] - a[0]) * (c[1] - a[1]) - (p[1] - a[1]) * (c[0] - a[0])) > 0.4
  })
}

/** A low hipped roof over a rectangle. */
function hip(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, h: number) {
  const m = Math.min(x1 - x0, y1 - y0) / 2
  const r0: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const top: V3[] = [[x0 + m, y0 + m, z0 + h], [x1 - m, y0 + m, z0 + h], [x1 - m, y1 - m, z0 + h], [x0 + m, y1 - m, z0 + h]]
  for (let k = 0; k < 4; k++) {
    const j = (k + 1) % 4
    const e: XY = [r0[j][0] - r0[k][0], r0[j][1] - r0[k][1]], L = Math.hypot(...e)
    const n: V3 = [(e[1] / L) * h, (-e[0] / L) * h, m]
    if (Math.hypot(top[j][0] - top[k][0], top[j][1] - top[k][1]) < 1e-6) poly(p, [r0[k], r0[j], top[k]], n)
    else poly(p, [r0[k], r0[j], top[j], top[k]], n)
  }
}

/**
 * A two-storey wing on an OSM outline: walls, string course, cornice,
 * balustraded parapet, a roof deck, and windows along every edge.
 */
function wing(ring: XY[], cornice: number, parapet: number, seaArched: (a: XY, b: XY) => boolean) {
  const r = clean(ring)
  loftRing(stone, r, 0, cornice - 0.8)
  const c = grow(r, 0.45)
  loftRing(trim, c, cornice - 0.8, cornice)
  loftRing(trim, grow(r, 0.2), 8.8, 9.4) // string course
  const pr = grow(r, 0.15)
  loftRing(stone, pr, cornice, parapet - 0.25)
  loftRing(trim, c, parapet - 0.25, parapet)
  capRing(trim, c, parapet)
  // windows along every edge
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 6) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const count = Math.max(1, Math.round(L / 4.0)), sp = L / count
    const arched = seaArched(a, b)
    for (let k = 0; k < count; k++) {
      const m = sp * (k + 0.5), hw = Math.min(0.95, sp * 0.26)
      const A: XY = [a[0] + u[0] * (m - hw), a[1] + u[1] * (m - hw)], B: XY = [a[0] + u[0] * (m + hw), a[1] + u[1] * (m + hw)]
      panel(win, A, B, 2.6, 7.4, n, false, 0.05)
      panel(win, A, B, 10.6, cornice - 2.6, n, arched, 0.05)
    }
  }
  return r
}

/** A pedimented portico of n columns on a face from a to b (plan), standing out d from it. */
function portico(a: XY, b: XY, ncol: number, top: number, d = 1.6) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const at = (s: number, w: number, z: number): V3 => [a[0] + u[0] * s + n[0] * w, a[1] + u[1] * s + n[1] * w, z]
  // a dark loggia behind the columns
  panel(win, a, b, 1.2, top - 2.0, n, false, 0.05)
  for (let k = 0; k < ncol; k++) {
    const s = 0.8 + ((L - 1.6) * k) / (ncol - 1)
    const c = at(s, d - 0.5, 0)
    revolve(trim, c[0], c[1], [[0.6, 1.0], [0.5, top - 2.2]], 8, 0, TAU, 'ring')
  }
  // entablature
  const e0 = at(0, 0, 0), e1 = at(L, 0, 0), e2 = at(L, d, 0), e3 = at(0, d, 0)
  const ring: XY[] = [[e0[0], e0[1]], [e1[0], e1[1]], [e2[0], e2[1]], [e3[0], e3[1]]]
  const area = ring.reduce((t, p, j) => { const q = ring[(j + 1) % 4]; return t + p[0] * q[1] - q[0] * p[1] }, 0)
  prism(trim, area > 0 ? ring : ring.slice().reverse(), top - 2.2, top, true, true)
  // the pediment: a triangle prism rising 2.4 m
  const h = Math.min(2.6, L * 0.16)
  const F = [at(0, d, top), at(L, d, top), at(L / 2, d, top + h)], Bk = [at(0, -0.2, top), at(L, -0.2, top), at(L / 2, -0.2, top + h)]
  poly(trim, F, [n[0], n[1], 0])
  poly(trim, Bk, [-n[0], -n[1], 0])
  poly(roof, [F[0], F[2], Bk[2], Bk[0]], [-u[0] * h, -u[1] * h, L / 2])
  poly(roof, [F[2], F[1], Bk[1], Bk[2]], [u[0] * h, u[1] * h, L / 2])
}

// ---------------------------------------------------------------------------
// Outlines (OSM, counter-clockwise, in the brief-centred frame).

const SELAMLIK: XY[] = [[20.8, 11.6], [15.5, 11.8], [8.9, 11.8], [8.9, 5.8], [-12.7, 5.9], [-12.7, 8.7], [-18.8, 8.8], [-18.8, 11.3], [-35.6, 11.3], [-35.6, 9.4], [-43.2, 9.4], [-43.2, 5.9], [-63.4, 6.0], [-63.4, 14.3], [-72.7, 14.4], [-72.7, 0.5], [-76.6, 0.5], [-76.6, -7.5], [-76.6, -22.1], [-73.0, -22.2], [-73.0, -33.1], [-63.6, -33.2], [-63.6, -29.2], [-41.1, -29.3], [-41.1, -33.1], [-12.0, -33.2], [-12.0, -28.3], [10.9, -28.3], [10.9, -33.2], [20.1, -33.2], [20.2, -25.9], [20.7, 7.6]]
// the Muayede outline with its landing projection cut off, and its front
// set back behind the tall block (which stands on the outline's front)
const MUAYEDE: XY[] = [[34.0, -25.6], [34.0, -24.0], [94.4, -24.0], [94.4, -30.0], [101.4, -30.0], [101.4, -26.0], [111.9, -25.9], [112.3, 10.0], [98.6, 9.9], [98.9, -18.0], [93.6, -18.0], [93.2, 22.9], [47.3, 22.6], [47.4, 3.9], [28.0, 3.8], [27.9, 8.0], [20.7, 7.6], [20.2, -25.9]]
const HAREM: XY[] = [[131.6, 12.7], [112.3, 12.9], [112.3, 10.0], [111.9, -25.9], [115.0, -26.0], [114.9, -34.6], [125.4, -34.8], [125.5, -30.1], [147.0, -30.4], [146.9, -34.7], [177.5, -35.2], [177.5, -30.5], [199.7, -30.8], [199.7, -35.1], [208.3, -35.2], [208.4, -24.1], [213.0, -24.2], [213.1, -13.5], [208.8, -13.4], [208.9, -2.8], [204.5, -2.8], [204.6, 7.1], [209.2, 7.0], [209.3, 17.9], [213.2, 17.8], [213.3, 29.4], [209.8, 29.4], [210.2, 60.7], [213.4, 60.7], [213.5, 72.1], [210.8, 72.1], [211.0, 95.5], [213.6, 95.5], [213.7, 103.3], [198.0, 103.6], [197.9, 100.1], [193.4, 100.2], [187.3, 100.3], [187.3, 104.1], [172.6, 104.3], [172.6, 95.9], [175.6, 95.9], [175.5, 83.1], [172.1, 83.2], [172.0, 75.2], [174.8, 75.2], [174.7, 57.3], [171.5, 57.3], [171.4, 50.0], [174.4, 49.9], [174.3, 41.5], [171.1, 41.5], [171.0, 33.9], [173.5, 33.8], [173.4, 15.1], [170.5, 15.1], [170.4, 8.6], [157.0, 8.8], [157.1, 12.1], [140.6, 12.3], [140.5, 5.9], [131.5, 6.1]]

const seaFace = (a: XY, b: XY) => Math.abs(a[1] - b[1]) < 1 && b[0] > a[0] && a[1] < -20 // a sea-facing edge

// ---------------------------------------------------------------------------
// Selamlık.

wing(SELAMLIK, 18.0, 19.5, seaFace)
hip(roof, -71.5, 19.0, -27.0, 4.5, 19.5, 2.3)
hip(roof, -71.5, -64.5, 4.5, 13.0, 19.5, 1.5)
// the glass dome over the Crystal Staircase: an oval dome, 18 x 11 m
{
  const cx = -26.3, cy = -12.0, rx = 9.5, ry = 6.5, z0 = 20.2, h = 4.8, nA = 16, nR = 4
  const P = (a: number, t: number): V3 => [cx + rx * Math.cos(a) * Math.cos(t), cy + ry * Math.sin(a) * Math.cos(t), z0 + h * Math.sin(t)]
  const N = (a: number, t: number): V3 => {
    const nx = Math.cos(a) * Math.cos(t) / rx, ny = Math.sin(a) * Math.cos(t) / ry, nz = Math.sin(t) / h
    const l = Math.hypot(nx, ny, nz); return [nx / l, ny / l, nz / l]
  }
  // a low drum
  for (let k = 0; k < nA; k++) {
    const a0 = (k * TAU) / nA, a1 = ((k + 1) * TAU) / nA
    const q = (a: number, z: number): V3 => [cx + (rx + 0.3) * Math.cos(a), cy + (ry + 0.3) * Math.sin(a), z]
    poly(trim, [q(a0, 19.4), q(a1, 19.4), q(a1, z0 + 0.1), q(a0, z0 + 0.1)], [Math.cos((a0 + a1) / 2) / rx, Math.sin((a0 + a1) / 2) / ry, 0])
    poly(trim, [q(a0, z0 + 0.1), q(a1, z0 + 0.1), P(a1, 0), P(a0, 0)], [0, 0, 1])
    for (let i = 0; i < nR; i++) {
      const t0 = (i * Math.PI) / 2 / nR, t1 = ((i + 1) * Math.PI) / 2 / nR
      glass.tri(P(a0, t0), P(a1, t0), P(a1, t1), undefined, undefined, undefined, [N(a0, t0), N(a1, t0), N(a1, t1)])
      if (i < nR - 1) glass.tri(P(a0, t0), P(a1, t1), P(a0, t1), undefined, undefined, undefined, [N(a0, t0), N(a1, t1), N(a0, t1)])
    }
  }
}
// the pedimented portico on the sea front (photo: x -44 to -31)
portico([-43.6, -33.1], [-30.8, -33.1], 4, 16.2)
// the garden (land) front's central pediment of the Selamlık
portico([-34.6, 11.3], [-20.0, 11.3], 4, 16.2)

// ---------------------------------------------------------------------------
// Ceremonial Hall: low flanking parts, then the tall block.

wing(MUAYEDE, 18.0, 19.5, () => false)
hip(roof, 21.5, 35.5, -24.5, 6.5, 19.5, 1.8)
hip(roof, 93.0, 110.8, -24.5, 8.6, 19.5, 1.8)
hip(roof, 48.5, 92.0, 11.0, 21.5, 19.5, 1.8)
const TX0 = 35.0, TX1 = 93.4, TY0 = -29.75, TY1 = 12.0, TC = 33.5, TB = 36.0
{
  const ring = rect(TX0, TX1, TY0, TY1, 0.5)
  prism(stone, ring, 0, TC - 1.2, false)
  prism(trim, rect(TX0 - 0.7, TX1 + 0.7, TY0 - 0.7, TY1 + 0.7, 0.8), TC - 1.2, TC, true, true)
  prism(stone, rect(TX0 - 0.2, TX1 + 0.2, TY0 - 0.2, TY1 + 0.2, 0.5), TC, TB - 0.4, false)
  prism(trim, rect(TX0 - 0.5, TX1 + 0.5, TY0 - 0.5, TY1 + 0.5, 0.6), TB - 0.4, TB, true, true)
  // the rear of the hall behind the tall block, at the low wings' height
  // (the OSM part x 47.3-93.2 to y 22.6 is covered by the Muayede wing)
  hip(roof, TX0 + 1.0, TX1 - 1.0, TY0 + 1.0, TY1 - 1.0, TB, 6.2)
  // sea front: 7 bays between 8 piers of paired columns
  const faceSea = (s: number, w: number, z: number): V3 => [TX0 + s, TY0 - w, z]
  const W = TX1 - TX0, bay = (W - 2) / 7
  for (let k = 0; k <= 7; k++) {
    const s = 1 + k * bay
    for (const off of [-0.7, 0.7]) {
      const c = faceSea(s + off, 0.55, 0)
      revolve(trim, c[0], c[1], [[0.55, 1.2], [0.48, 16.3]], 6, 0, TAU, 'ring')
      revolve(trim, c[0], c[1], [[0.55, 17.6], [0.48, TC - 1.2]], 6, 0, TAU, 'ring')
    }
    // finial on the balustrade above each pier
    const f = faceSea(s, -0.1, 0)
    prism(trim, rect(f[0] - 0.8, f[0] + 0.8, f[1] - 0.8, f[1] + 0.8, 0.2), TB, TB + 1.0)
    revolve(trim, f[0], f[1], [[0.75, TB + 1.0], [0.3, TB + 2.4], [0, TB + 2.9]], 5)
  }
  // a band between the storeys
  poly(trim, [faceSea(0.5, 0.6, 16.3), faceSea(W - 0.5, 0.6, 16.3), faceSea(W - 0.5, 0.6, 17.6), faceSea(0.5, 0.6, 17.6)], [0, -1, 0])
  poly(trim, [faceSea(0.5, 0, 17.6), faceSea(W - 0.5, 0, 17.6), faceSea(W - 0.5, 0.6, 17.6), faceSea(0.5, 0.6, 17.6)], [0, 0, 1])
  poly(trim, [faceSea(0.5, 0, 16.3), faceSea(W - 0.5, 0, 16.3), faceSea(W - 0.5, 0.6, 16.3), faceSea(0.5, 0.6, 16.3)], [0, 0, -1])
  for (let k = 0; k < 7; k++) {
    const m = 1 + (k + 0.5) * bay
    const A = (s: number): XY => [TX0 + s, TY0]
    panel(win, A(m - 1.7), A(m + 1.7), 2.4, 13.6, [0, -1], true, 0.06) // ground: great arched windows
    panel(win, A(m - 2.1), A(m - 0.25), 20.0, 28.6, [0, -1], true, 0.06) // upper: paired arched windows
    panel(win, A(m + 0.25), A(m + 2.1), 20.0, 28.6, [0, -1], true, 0.06)
  }
  // side and land faces: the upper storey shows above the low wings
  const sides: Array<{ a: XY; b: XY; n: XY }> = [
    { a: [TX1, TY0], b: [TX1, TY1], n: [1, 0] },
    { a: [TX0, TY1], b: [TX0, TY0], n: [-1, 0] },
    { a: [TX1, TY1], b: [TX0, TY1], n: [0, 1] },
  ]
  for (const s of sides) {
    const L = Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1]), u: XY = [(s.b[0] - s.a[0]) / L, (s.b[1] - s.a[1]) / L]
    const nb = Math.round(L / 7.2), bw = L / nb
    for (let k = 0; k < nb; k++) {
      const m = (k + 0.5) * bw
      const A = (d: number): XY => [s.a[0] + u[0] * d, s.a[1] + u[1] * d]
      panel(win, A(m - 2.0), A(m - 0.2), 21.0, 28.6, s.n, true, 0.06)
      panel(win, A(m + 0.2), A(m + 2.0), 21.0, 28.6, s.n, true, 0.06)
    }
    for (let k = 0; k <= nb; k++) {
      const d = Math.min(L - 0.8, Math.max(0.8, k * bw))
      const p: XY = [s.a[0] + u[0] * d + s.n[0] * 0.3, s.a[1] + u[1] * d + s.n[1] * 0.3]
      prism(trim, rect(p[0] - 0.6, p[0] + 0.6, p[1] - 0.6, p[1] + 0.6, 0.2), 19.5, TC - 1.2, false)
    }
  }
}

// The sea gate on the quay in front of the hall (x 64.2): marble piers, a
// round arch and a crest.
{
  const gx = 64.2, gy = -36.6, hw = 5.0, pw = 1.7, d = 1.6
  for (const sx of [-1, 1]) {
    const x0 = gx + sx * (hw - pw / 2)
    prism(trim, rect(x0 - pw / 2, x0 + pw / 2, gy - d / 2, gy + d / 2, 0.2), 0, 10.0)
    revolve(trim, x0, gy, [[0.7, 10.0], [0.9, 10.6], [0.4, 11.6], [0, 12.0]], 6)
  }
  // the arch over the opening: a slab with a round-headed opening
  const inner = hw - pw, zs = 6.4
  const front = (w: number) => {
    const pts: V3[] = []
    for (let k = 0; k <= 8; k++) { const t = Math.PI - (Math.PI * k) / 8; pts.push([gx + inner * Math.cos(t), gy + w, zs + inner * Math.sin(t)]) }
    return pts
  }
  for (const w of [-d / 2, d / 2]) {
    const pts = front(w), n: V3 = [0, w < 0 ? -1 : 1, 0]
    for (let k = 0; k < 8; k++) {
      const top = 10.0
      poly(trim, [pts[k], pts[k + 1], [pts[k + 1][0], pts[k + 1][1], top], [pts[k][0], pts[k][1], top]], n)
    }
  }
  const fu = front(-d / 2), bu = front(d / 2)
  for (let k = 0; k < 8; k++) poly(trim, [fu[k], fu[k + 1], bu[k + 1], bu[k]], [-(fu[k][0] + fu[k + 1][0]) / 2 + gx, 0, -((fu[k][2] + fu[k + 1][2]) / 2 - zs)])
  prism(trim, rect(gx - inner, gx + inner, gy - d / 2, gy + d / 2), 10.0, 10.4, true, false)
  // the crest
  const crest: V3[] = []
  for (let k = 0; k <= 6; k++) { const t = Math.PI - (Math.PI * k) / 6; crest.push([gx + 2.6 * Math.cos(t), gy - 0.3, 10.4 + 2.4 * Math.sin(t)]) }
  poly(trim, crest, [0, -1, 0])
  poly(trim, crest.map(([x, y, z]) => [x, y + 0.6, z] as V3), [0, 1, 0])
}

// ---------------------------------------------------------------------------
// Harem.

wing(HAREM, 17.5, 19.0, seaFace)
hip(roof, 113.5, 207.0, -29.0, 11.0, 19.0, 2.2)
hip(roof, 172.5, 209.0, 11.0, 102.0, 19.0, 2.2)
portico([125.6, -30.1], [146.9, -30.1], 6, 15.6)

// ---------------------------------------------------------------------------
// Shift to the centroid anchor and write.

const OX = 97.13, OY = 4.96
const parts = [
  { part: stone, material: { ...finish('marble', 0xe4ded3), floodlight: (_p: V3, n: V3) => (n[2] > 0.9 ? 0.35 : 0.85) } },
  { part: trim, material: { ...PALETTE.trim, color: 0xf1ece3, floodlight: (_p: V3, n: V3) => (n[2] > 0.9 ? 0.4 : 0.95) } },
  { part: roof, material: { ...PALETTE.roof, color: 0xa9b1b8 } },
  { part: win, material: PALETTE.window },
  { part: glass, material: { ...PALETTE.glass, color: 0xdfe6ea } },
]
for (const { part } of parts) for (let i = 0; i < part.pos.length; i += 3) { part.pos[i] -= OX; part.pos[i + 2] += OY }
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Dolmabahçe Palace', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 338.7, elevation: 0, height: 42.2,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/istanbul-dolmabahce-palace.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
