/**
 * Dolmabahçe Clock Tower (Dolmabahçe Saat Kulesi), Beşiktaş, Istanbul:
 * procedural, CC0-1.0.
 * bun generators/istanbul-dolmabahce-clock-tower.ts
 *
 * Built 1890-1895 (Sarkis Balyan) in front of the palace's Treasury Gate. A
 * square neo-Baroque tower in four stages that step in as they rise: a
 * ground stage with paired Corinthian columns at the corners and an arched
 * doorway under a small dial; a second stage with columns and a tall arched
 * window; a third with rounded corners and a rectangular window, carried out
 * at its top into a curved balcony with a balustrade; the clock stage with a
 * dial on every face; and a crown of segmental pediments over a cornice,
 * with a round ribbed stone cap and an iron finial.
 *
 * Frame: x, y along the tower's faces, z up; placed with bearing 58.8 (OSM
 * edges run 58.8 / 148.5). The tower is drawn the same on all four faces.
 * Origin at the centroid of OSM way/263949143 (28.996381, 41.037683). The
 * site is the flat shore fill in front of the palace: elevation 0. No
 * terrain check could run (Mapterhorn has no z15 terrain here).
 *
 * OSM (ODbL): way/263949143, building=yes, height 27, levels 4,
 * man_made=tower, wikidata Q1818013 (checked: "Dolmabahçe Clock Tower").
 * Its outline (11.3 x 10.9 m) is the marble platform with the corner
 * fountains; the platform is ground-like paving and is not modelled, the
 * tower stands centred on it.
 *
 * Published: height 27 m (OSM height tag; Wikipedia, "Dolmabahçe Clock
 * Tower"), four storeys.
 * Estimated from the distant, near-level photo by Moonik (scaled to the
 * 27 m total, about 26 px/m on the 1280 px file): stage tops 6.8, 13.4,
 * 17.6 (balcony floor), 18.7 (balustrade), 23.0 (clock-stage cornice), the
 * stone cap to 27 m; face widths from the same photo and the level view
 * from the Bosphorus (mike): clock stage 4.2 m with a 1.6 m dial (dial 0.38
 * of the face), stage 2 about 1.28 times the clock stage, ground stage 5.8 m
 * with its corner columns to about 7.2 m.
 * Invented / simplified: the sculpture, cartouches and urns; the columns
 * are drawn as bold round shafts in pairs at the corners; the weathervane is
 * a short gilt rod.
 *
 * Colours from daylight photos, pulled to the palette: pale grey limestone
 * (#dad4c9) with whiter marble columns and cornices (#f0ebe2), a stone cap,
 * white dials with dark bezels. Night: the tower is floodlit (stone and
 * marble and the dials carry _FLOODLIGHT); windows glow.
 *
 * Photos (EVIDENCE, all Wikimedia Commons):
 * - "Dolmabahçe Clock Tower in Istanbul, Turkey 001.jpg", Moonik,
 *   CC BY-SA 3.0 (distant, near level: the ruler)
 *   https://commons.wikimedia.org/wiki/File:Dolmabah%C3%A7e_Clock_Tower_in_Istanbul,_Turkey_001.jpg
 * - "Palacio de Dolmabahçe, Estambul, Turquía, 2024-09-28, DD 106.jpg",
 *   Diego Delso, CC BY-SA 4.0 (front, stage details)
 *   https://commons.wikimedia.org/wiki/File:Palacio_de_Dolmabah%C3%A7e,_Estambul,_Turqu%C3%ADa,_2024-09-28,_DD_106.jpg
 * - "Dolmabahçe Clock Tower, Istanbul.jpg", Julian Lupyan, CC0
 *   https://commons.wikimedia.org/wiki/File:Dolmabah%C3%A7e_Clock_Tower,_Istanbul.jpg
 * - "Dolmabahçe Clock Tower 2014.jpg", Radosław Botev, CC BY 3.0 pl
 *   https://commons.wikimedia.org/wiki/File:Dolmabah%C3%A7e_Clock_Tower_2014.jpg
 * - "Dolmabahçe Clock Tower from the Bosphorus.jpg", mike, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Dolmabah%C3%A7e_Clock_Tower_from_the_Bosphorus.jpg
 * Look-only: none.
 *
 * Doubts: stage heights are photo-scaled from one near-level photo; the
 * real faces differ slightly (door on the front only), drawn alike here.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const TAU = Math.PI * 2

const stone = new Part(), marble = new Part(), win = new Part(), dial = new Part(), dark = new Part()

/** A convex planar polygon, fan-triangulated and wound to face `n`. */
function poly(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    const g = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}
/** Vertical prism over a counter-clockwise ring. */
function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false) {
  p.loft([ring.map(([x, y]) => [x, y, z0] as V3), ring.map(([x, y]) => [x, y, z1] as V3)])
  if (top) poly(p, ring.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, ring.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
/** A centred square of half-side h with chamfered corners c. */
function sq(h: number, c = 0): XY[] {
  if (c <= 0) return [[-h, -h], [h, -h], [h, h], [-h, h]]
  return [[-h + c, -h], [h - c, -h], [h, -h + c], [h, h - c], [h - c, h], [-h + c, h], [-h, h - c], [-h, -h + c]]
}
/** A square with rounded corners of radius r, k segments per corner. */
function rsq(h: number, r: number, k = 3): XY[] {
  const out: XY[] = []
  const cs: XY[] = [[h - r, -h + r], [h - r, h - r], [-h + r, h - r], [-h + r, -h + r]]
  cs.forEach(([cx, cy], q) => {
    for (let i = 0; i <= k; i++) {
      const a = -Math.PI / 2 + (q * Math.PI) / 2 + (i * Math.PI) / 2 / k
      out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
    }
  })
  return out
}
function circle(cx: number, cy: number, r: number, n: number, phase = 0): XY[] {
  return Array.from({ length: n }, (_, k) => [cx + r * Math.cos(phase + (k * TAU) / n), cy + r * Math.sin(phase + (k * TAU) / n)] as XY)
}
/** Surface of revolution about a vertical axis; prof is [r, z] bottom up. */
function revolve(p: Part, cx: number, cy: number, prof: [number, number][], n: number) {
  const m = prof.length
  const nr = prof.map((_, i) => {
    const a = prof[Math.max(0, i - 1)], b = prof[Math.min(m - 1, i + 1)]
    const dr = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l] as [number, number]
  })
  for (let k = 0; k < n; k++) {
    const t0 = (k * TAU) / n, t1 = ((k + 1) * TAU) / n
    const P = (j: number, t: number): V3 => [cx + prof[j][0] * Math.cos(t), cy + prof[j][0] * Math.sin(t), prof[j][1]]
    const N = (j: number, t: number): V3 => [nr[j][0] * Math.cos(t), nr[j][0] * Math.sin(t), nr[j][1]]
    for (let i = 0; i < m - 1; i++) {
      if (prof[i][0] > 1e-6) p.tri(P(i, t0), P(i, t1), P(i + 1, t1), undefined, undefined, undefined, [N(i, t0), N(i, t1), N(i + 1, t1)])
      if (prof[i + 1][0] > 1e-6) p.tri(P(i, t0), P(i + 1, t1), P(i + 1, t0), undefined, undefined, undefined, [N(i, t0), N(i + 1, t1), N(i + 1, t0)])
    }
  }
}

/** Repeat a face-local builder on all four faces: f(u, v→out, rot) with local (u along face, w out of face). */
const faces = [0, 1, 2, 3].map((q) => {
  const a = (q * Math.PI) / 2
  const c = Math.round(Math.cos(a)), s = Math.round(Math.sin(a))
  // local (u, w) -> world: face normal is (c, s)... u runs along the face counter-clockwise
  return { n: [c, s] as XY, at: (u: number, w: number): XY => [c * w - s * u, s * w + c * u] }
})

/** A flat panel on face f at distance d from centre: u0..u1, z0..z1, with optional round head. */
function facePanel(p: Part, f: (typeof faces)[number], d: number, u0: number, u1: number, z0: number, z1: number, arch = false, segs = 6) {
  const N3: V3 = [f.n[0], f.n[1], 0]
  const P = (u: number, z: number): V3 => { const [x, y] = f.at(u, d + 0.05); return [x, y, z] }
  if (!arch) { poly(p, [P(u0, z0), P(u1, z0), P(u1, z1), P(u0, z1)], N3); return }
  const r = (u1 - u0) / 2, zs = z1 - r, uc = (u0 + u1) / 2
  poly(p, [P(u0, z0), P(u1, z0), P(u1, zs), P(u0, zs)], N3)
  const pts: V3[] = []
  for (let k = 0; k <= segs; k++) { const t = (Math.PI * k) / segs; pts.push(P(uc + r * Math.cos(t), zs + r * Math.sin(t))) }
  poly(p, pts, N3)
}

/** A disc on face f (the dials), with a dark bezel ring. */
function faceDisc(f: (typeof faces)[number], d: number, z: number, r: number) {
  const N3: V3 = [f.n[0], f.n[1], 0]
  const ring = (rr: number, off: number) => Array.from({ length: 14 }, (_, k) => {
    const t = (k * TAU) / 14; const [x, y] = f.at(rr * Math.cos(t), d + off); return [x, y, z + rr * Math.sin(t)] as V3
  })
  poly(dark, ring(r * 1.14, 0.04), N3)
  poly(dial, ring(r, 0.09), N3)
}


/** A solid segmental pediment on face f: front at distance d, `depth` thick, base z, half-width w, rise h. */
function pediment(f: (typeof faces)[number], d: number, depth: number, z: number, w: number, h: number) {
  const pts: V3[] = [], back: V3[] = []
  for (let k = 0; k <= 6; k++) {
    const t = (Math.PI * k) / 6, u = w * Math.cos(t), zz = z + h * Math.sin(t)
    const [x, y] = f.at(u, d), [bx, by] = f.at(u, d - depth)
    pts.push([x, y, zz]); back.push([bx, by, zz])
  }
  poly(marble, pts, [f.n[0], f.n[1], 0])
  poly(marble, back, [-f.n[0], -f.n[1], 0])
  for (let k = 0; k < 6; k++) {
    const tm = (Math.PI * (k + 0.5)) / 6
    const [ux, uy] = f.at(Math.cos(tm) / h * w, 0) // along-face component, scaled for the ellipse normal
    const m: V3 = [ux * h / w, uy * h / w, Math.sin(tm) * w / h]
    poly(marble, [pts[k], pts[k + 1], back[k + 1], back[k]], m)
  }
}

/** A pair of round columns on each face either side of every corner. */
function cornerColumns(p: Part, h: number, z0: number, z1: number, r: number, inset: number) {
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    // one column on each of the two faces meeting at the corner, plus one at the corner
    const pts: XY[] = [[sx * (h - inset), sy * (h + r * 0.3)], [sx * (h + r * 0.3), sy * (h - inset)], [sx * (h + r * 0.1), sy * (h + r * 0.1)]]
    for (const [x, y] of pts) {
      revolve(p, x, y, [[r * 1.25, z0], [r * 1.25, z0 + 0.45], [r, z0 + 0.5], [r * 0.9, z1 - 0.55], [r * 1.3, z1 - 0.15], [r * 1.3, z1]], 8)
    }
  }
}

// ---------------------------------------------------------------------------
// Stage 1: the ground stage. Pedestal, body, corner columns, cornice.
const S1 = 2.9 // half side of the body (5.8 m)
prism(stone, sq(S1 + 0.6, 0.35), 0, 1.15) // column pedestal / plinth
prism(stone, sq(S1, 0.35), 1.15, 6.0, false)
cornerColumns(marble, S1, 1.15, 5.95, 0.32, 0.8)
prism(marble, sq(S1 + 0.75, 0.4), 5.95, 6.45) // entablature
prism(marble, sq(S1 + 0.9, 0.45), 6.45, 6.85)
for (const f of faces) {
  facePanel(win, f, S1, -0.85, 0.85, 1.5, 4.3) // the doorway / window
  faceDisc(f, S1, 4.95, 0.5) // the small dial over it
  facePanel(marble, f, S1 + 0.02, -1.1, 1.1, 4.3, 4.42) // its transom
}

// Stage 2: columns and a tall arched window.
const S2 = 2.55
prism(stone, sq(S2 + 0.5, 0.3), 6.85, 7.6)
prism(stone, sq(S2, 0.3), 7.6, 12.6, false)
cornerColumns(marble, S2, 7.6, 12.55, 0.3, 0.72)
prism(marble, sq(S2 + 0.75, 0.4), 12.55, 13.0)
prism(marble, sq(S2 + 0.9, 0.45), 13.0, 13.4)
for (const f of faces) {
  facePanel(win, f, S2, -0.75, 0.75, 8.4, 11.9, true)
  pediment(f, S2 + 0.8, 0.7, 13.4, 1.3, 0.7)
}

// Stage 3: rounded corners, a rectangular window, the curved balcony.
const S3 = 2.3
prism(stone, rsq(S3, 0.65), 13.4, 16.9, false)
for (const f of faces) facePanel(win, f, S3, -0.6, 0.6, 14.0, 16.4)
// corbelled balcony: a flared ring out to the balustrade line
const B = 2.85
{
  const lo = rsq(S3, 0.65), hi = rsq(B, 1.2)
  stone.loft([lo.map(([x, y]) => [x, y, 16.9] as V3), hi.map(([x, y]) => [x, y, 17.55] as V3)])
  prism(marble, rsq(B, 1.2), 17.55, 17.85)
  // balustrade: a pierced-looking parapet, drawn as a solid low wall
  // with a darker band would shimmer; a plain marble parapet reads better
  const outer = rsq(B - 0.05, 1.15), inner = rsq(B - 0.35, 0.9)
  marble.loft([outer.map(([x, y]) => [x, y, 17.85] as V3), outer.map(([x, y]) => [x, y, 18.7] as V3)])
  marble.loft([inner.map(([x, y]) => [x, y, 18.7] as V3).reverse(), inner.map(([x, y]) => [x, y, 17.85] as V3).reverse()])
  // coping
  for (let i = 0; i < outer.length; i++) {
    const j = (i + 1) % outer.length
    poly(marble, [[outer[i][0], outer[i][1], 18.7], [outer[j][0], outer[j][1], 18.7], [inner[j][0], inner[j][1], 18.7], [inner[i][0], inner[i][1], 18.7]], [0, 0, 1])
  }
  poly(stone, rsq(B - 0.35, 0.9).map(([x, y]) => [x, y, 17.85] as V3), [0, 0, 1])
}

// Stage 4: the clock stage.
const S4 = 2.1
prism(stone, sq(S4, 0.3), 17.85, 23.0, false)
// pilasters at the corners
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const c: XY = [sx * (S4 - 0.2), sy * (S4 - 0.2)]
  prism(marble, [[c[0] - 0.4, c[1] - 0.4], [c[0] + 0.4, c[1] - 0.4], [c[0] + 0.4, c[1] + 0.4], [c[0] - 0.4, c[1] + 0.4]], 18.7, 22.9, false)
}
for (const f of faces) {
  faceDisc(f, S4, 21.0, 0.8)
  facePanel(win, f, S4, -0.5, 0.5, 19.0, 19.7)
}
prism(marble, sq(S4 + 0.45, 0.3), 22.9, 23.35)
prism(marble, sq(S4 + 0.6, 0.35), 23.35, 23.65)

// Crown: attic, a segmental pediment on each face, corner urns, the stone cap.
prism(stone, sq(S4 - 0.1, 0.3), 23.65, 24.35)
for (const f of faces) pediment(f, S4 + 0.1, 0.4, 24.35, 1.45, 0.8)
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  revolve(marble, sx * (S4 + 0.15), sy * (S4 + 0.15), [[0.35, 23.65], [0.35, 24.0], [0.3, 24.4], [0.2, 24.75], [0, 24.95]], 6)
}
// the stone cap: a drum, a bulging ring, a waist and a small ribbed dome
revolve(stone, 0, 0, [[1.55, 24.35], [1.55, 24.6], [1.75, 24.8], [1.8, 25.1], [1.6, 25.45], [1.1, 25.7], [1.0, 25.95], [0.95, 26.3], [0.75, 26.7], [0.4, 26.95], [0, 27.0]], 12)
revolve(dark, 0, 0, [[0.2, 26.95], [0.3, 27.2], [0.1, 27.45], [0.08, 28.2], [0, 28.3]], 5)

// ---------------------------------------------------------------------------
const lit = (k: number) => (_p: V3, n: V3) => k * (n[2] > 0.9 ? 0.45 : 1)
const parts = [
  { part: stone, material: { ...finish('limestone', 0xdad4c9), floodlight: lit(0.9) } },
  { part: marble, material: { ...finish('marble', 0xf0ebe2), floodlight: lit(0.95) } },
  { part: win, material: PALETTE.window },
  { part: dial, material: { ...finish('clock-dial', 0xf7f4ec), floodlight: () => 0.9 } },
  { part: dark, material: finish('bezel', 0x5a5f66) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Dolmabahçe Clock Tower', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 58.8, elevation: 0, height: 28.3,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/istanbul-dolmabahce-clock-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
