/**
 * Republic Monument (Cumhuriyet Anıtı), Taksim Square, Istanbul:
 * procedural, CC0-1.0. bun generators/istanbul-taksim-republic-monument.ts
 *
 * Pietro Canonica, 1928. An 11 m monument: a rectangular frame of pink
 * granite faced with green marble panels, open through its broad faces in
 * a tall round arch, in which two bronze groups stand back to back (the
 * War of Independence group with Atatürk, İnönü and Çakmak on one face, the
 * Republic group on the other) with flags raised behind them; single flag-
 * bearers on the narrow ends; gilt rosettes in the spandrels; a cornice;
 * the whole on a massive flared pink-granite pedestal. Small-object rules:
 * the figures are bold simple masses (body, head, shoulders), not
 * sculpture. The basin round the pedestal is water and paving, left out.
 *
 * Frame: x along the broad faces, y through the arch, z up; placed with
 * bearing 0 (broad faces to the north and south; see doubts). Origin at
 * the OSM node, 28.985118, 41.036999. The square is flat here. Elevation 0.
 * The terrain check could not run (no Mapterhorn z15 here).
 *
 * OSM (ODbL), fetched 2026-11: node/2329194003 "Cumhuriyet Anıtı",
 * historic=memorial, height 20 (too high: the published height is 11 m),
 * wikidata Q1143790 (checked: "Republic Monument", height 11). No way, so
 * `replaces` is empty.
 *
 * Published (Wikidata Q1143790; Wikipedia en "Republic Monument"): 11 m.
 * Estimated from photos (p01-p04, scaled to 11 m): pedestal 3.6 m, its
 * foot 7 x 5.2 m flaring in (bell profile) to 5.5 x 3.8 m, little wider
 * than the frame (p01); frame 4.6 x
 * 3.0 m from 3.6 to 10.4 m, cornice to 11 m; arch 2.8 m wide, springing at
 * 7.5 m; bronze figures about 2.3-2.5 m (life size and a half) on a 0.4 m
 * step; flags to about 8 m; flag-bearers on the narrow ends.
 * Invented / simplified: the number and stance of the figures (six per
 * face, drawn as standing blocks), the flags as flat banners.
 *
 * Colours: pink granite pulled to #dcae98, green marble #8aa597, dark
 * bronze #58615b (the figures are the identity, dark enough to read),
 * gilt rosettes. Night: the monument is floodlit.
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 * - p01 "Monument of the Republic - Taksim (1).jpg", Kurmanbek, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Monument_of_the_Republic_-_Taksim_(1).jpg
 * - p02 "Monument of the Republic - Taksim (2).jpg", Kurmanbek, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Monument_of_the_Republic_-_Taksim_(2).jpg
 * - p03 "Monument of the Republic, Istanbul, Taksim (48985971192).jpg",
 *   Julien Maury, public domain (the frame, face on)
 *   https://commons.wikimedia.org/wiki/File:Monument_of_the_Republic,_Istanbul,_Taksim_(48985971192).jpg
 * - p04 "Monument of the Republic in Taksim, Istanbul 29.10.2023 01.jpg",
 *   Wiki leylek, CC BY 4.0 (whole, far: the proportions)
 *   https://commons.wikimedia.org/wiki/File:Monument_of_the_Republic_in_Taksim,_Istanbul_29.10.2023_01.jpg
 * - p05 "Monument of the Republic, Istanbul 2014 (2).jpg", Radosław Botev,
 *   CC BY 3.0 pl (narrow end towards the camera, the AKM behind: the
 *   orientation)
 *   https://commons.wikimedia.org/wiki/File:Monument_of_the_Republic,_Istanbul_2014_(2).jpg
 * Look-only: "Istanbul asv2021-10 img07 Taksim Monument.jpg", A.Savin
 * (FAL), looked at, not used.
 *
 * Doubts: the bearing rests on one photo (p05) and could be 20 degrees
 * out; the figures are generic.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

type XY = [number, number]
const TAU = Math.PI * 2

function face(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    const g = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}

function crect(hx: number, hy: number, c: number): XY[] {
  return [[-hx + c, -hy], [hx - c, -hy], [hx, -hy + c], [hx, hy - c], [hx - c, hy], [-hx + c, hy], [-hx, hy - c], [-hx, -hy + c]]
}

/** Loft of chamfered rectangles [hx, hy, chamfer, z], capped on top. */
function stack(p: Part, secs: Array<[number, number, number, number]>, top = true) {
  p.loft(secs.map(([hx, hy, c, z]) => crect(hx, hy, c).map(([x, y]) => [x, y, z] as V3)))
  if (top) {
    const [hx, hy, c, z] = secs[secs.length - 1]
    face(p, crect(hx, hy, c).map(([x, y]) => [x, y, z] as V3), [0, 0, 1])
  }
}

function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  p.loft([r.map(([x, y]) => [x, y, z0] as V3), r.map(([x, y]) => [x, y, z1] as V3)])
  face(p, r.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
}

/** A standing figure facing +y (s = 1) or -y (s = -1), on the floor z. */
function figure(p: Part, x: number, y: number, z: number, h: number, s: number) {
  const w = 0.26 * h / 2.4
  // legs/coat, torso with shoulders, head
  stack(p, [[w * 0.9, w * 0.6, 0.06, z], [w * 1.0, w * 0.65, 0.08, z + h * 0.45], [w * 1.25, w * 0.7, 0.1, z + h * 0.78], [w * 0.7, w * 0.5, 0.08, z + h * 0.84]].map(([a, b, c, zz]) => [a, b, c, zz]) as Array<[number, number, number, number]>, false)
  // shift into place: stack builds about the origin, so translate the last added vertices
  const n = 3 * (8 * 2 * 3) // three loft bands x 8 sides x 2 tris x 3 verts
  const start = p.pos.length - n * 3
  for (let i = start; i < p.pos.length; i += 3) { p.pos[i] += x; p.pos[i + 2] -= y }
  // head
  const hz = z + h * 0.84, hr = w * 0.55
  const head: V3[][] = [0, 1, 2].map((k) => {
    const zz = hz + (k * h * 0.16) / 2, rr = k === 1 ? hr : hr * 0.75
    return Array.from({ length: 6 }, (_, i) => [x + rr * Math.cos((i * TAU) / 6), y + rr * Math.sin((i * TAU) / 6) * 0.9, zz] as V3)
  })
  p.loft(head)
  face(p, head[2], [0, 0, 1])
  void s
}

/** A flag on a pole: pole from z0 to z1 at (x, y), banner hanging to the side d. */
function flag(pole: Part, cloth: Part, x: number, y: number, z0: number, z1: number, d: number) {
  box(pole, x - 0.06, x + 0.06, y - 0.06, y + 0.06, z0, z1)
  const bw = 1.1, bh = 1.5
  const pts: V3[] = [[x, y, z1 - 0.1], [x + d * bw, y, z1 - 0.5], [x + d * bw * 0.8, y, z1 - bh - 0.3], [x, y, z1 - bh]]
  face(cloth, pts, [0, 1, 0])
  face(cloth, pts.map((q) => [q[0], q[1] - 0.05, q[2]] as V3), [0, -1, 0])
}

export function build() {
  const granite = new Part(), verde = new Part(), bronze = new Part(), gilt = new Part()

  // Pedestal: foot, bell flare, upright block, cornice.
  stack(granite, [
    [3.5, 2.6, 0.9, 0], [3.5, 2.6, 0.9, 0.5], [3.3, 2.4, 0.8, 0.8],
    [3.05, 2.2, 0.7, 1.5], [2.85, 2.0, 0.6, 2.3], [2.75, 1.9, 0.5, 3.0],
    [2.75, 1.9, 0.5, 3.2], [2.85, 2.0, 0.5, 3.3], [2.85, 2.0, 0.5, 3.6],
  ])

  // The frame: two side piers through the depth, the arch beam, cornice.
  const HX = 2.3, HY = 1.5, AX = 1.4, SPR = 7.5, TOP = 10.4
  for (const s of [-1, 1]) {
    const x0 = s > 0 ? AX : -HX, x1 = s > 0 ? HX : -AX
    box(granite, x0, x1, -HY, HY, 3.6, TOP)
    // green marble panel on the narrow end, with an arched head
    const xf = s * (HX + 0.04)
    const arch: V3[] = [[xf, -0.9, 5.0], [xf, 0.9, 5.0], [xf, 0.9, 8.4]]
    for (let k = 0; k <= 6; k++) { const a = (k * Math.PI) / 6; arch.push([xf, 0.9 * Math.cos(a), 8.4 + 0.9 * Math.sin(a)]) }
    arch.push([xf, -0.9, 8.4])
    face(verde, arch, [s, 0, 0])
    // the rosette above it
    face(gilt, Array.from({ length: 8 }, (_, i) => [xf + s * 0.02, 0.38 * Math.cos((i * TAU) / 8), 9.75 + 0.38 * Math.sin((i * TAU) / 8)] as V3), [s, 0, 0])
    // pier faces on the broad sides: green panels
    for (const t of [-1, 1]) {
      const yf = t * (HY + 0.04)
      face(verde, [[x0 + 0.2, yf, 4.5], [x1 - 0.2, yf, 4.5], [x1 - 0.2, yf, SPR - 0.2], [x0 + 0.2, yf, SPR - 0.2]], [0, t, 0])
    }
  }
  // Arch beam: front and back faces with the semicircular cut, the soffit.
  const segs = 10
  for (const t of [-1, 1]) {
    const y = t * HY
    for (let k = 0; k < segs; k++) {
      const a0 = (k * Math.PI) / segs, a1 = ((k + 1) * Math.PI) / segs
      const p0: V3 = [AX * Math.cos(a0), y, SPR + AX * Math.sin(a0)], p1: V3 = [AX * Math.cos(a1), y, SPR + AX * Math.sin(a1)]
      const corner: V3 = [k < segs / 2 ? AX : -AX, y, TOP]
      face(granite, [p0, p1, corner], [0, t, 0])
      if (k === segs / 2 - 1) face(granite, [p1, [-AX, y, TOP], [AX, y, TOP]], [0, t, 0])
      // soffit strip (faces down/in towards the opening)
      if (t > 0) face(granite, [[p0[0], -HY, p0[2]], [p1[0], -HY, p1[2]], [p1[0], HY, p1[2]], [p0[0], HY, p0[2]]], [-(p0[0] + p1[0]) / 2, 0, -((p0[2] + p1[2]) / 2 - SPR)])
    }
    // spandrel panels in green and the two rosettes
    const yf = y + t * 0.04
    face(verde, [[-HX + 0.2, yf, TOP - 0.25], [HX - 0.2, yf, TOP - 0.25], [HX - 0.2, yf, 9.3], [-HX + 0.2, yf, 9.3]], [0, t, 0])
    for (const s of [-1, 1]) {
      face(gilt, Array.from({ length: 8 }, (_, i) => [s * 1.95 + 0.33 * Math.cos((i * TAU) / 8), yf + t * 0.03, 9.6 + 0.33 * Math.sin((i * TAU) / 8)] as V3), [0, t, 0])
    }
  }
  // Cornice and attic.
  stack(granite, [[2.75, 1.85, 0.12, TOP], [2.75, 1.85, 0.12, TOP + 0.35], [2.6, 1.7, 0.1, TOP + 0.45], [2.6, 1.7, 0.1, 11.0]])

  // Bronze groups, back to back in the arch, on a low step; flags behind.
  box(granite, -AX, AX, -HY, HY, 3.6, 4.0)
  for (const t of [-1, 1]) {
    const xs = [-1.15, -0.7, -0.25, 0.25, 0.7, 1.15]
    xs.forEach((x, k) => figure(bronze, x * 0.93, t * (0.9 + (k % 2) * 0.22), 4.0, k === 2 || k === 3 ? 2.5 : 2.3, t))
    flag(bronze, bronze, -0.5, t * 0.35, 4.0, 7.8, -1)
    flag(bronze, bronze, 0.5, t * 0.35, 4.0, 7.6, 1)
  }
  // Flag-bearers on the narrow ends, on the pedestal's top.
  for (const s of [-1, 1]) {
    figure(bronze, s * 2.55, 0.6, 3.6, 2.2, 1)
    flag(bronze, bronze, s * 2.6, -0.5, 3.6, 7.6, s)
  }

  const lit = (_p: V3, n: V3) => (n[2] > 0.8 ? 0.35 : 0.9)
  return [
    { part: granite, material: { ...finish('pink-granite', 0xdcae98), floodlight: lit } },
    { part: verde, material: { ...finish('green-marble', 0x8aa597), floodlight: lit } },
    { part: bronze, material: { ...finish('bronze', 0x58615b), floodlight: () => 0.6 } },
    { part: gilt, material: { ...finish('gilt', 0xcfa94f), floodlight: () => 0.8 } },
  ]
}

if (import.meta.main) {
  const parts = build()
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  for (const { part, material } of parts) console.log(material.name, part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Republic Monument', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 0, elevation: 0, height: 11,
  })
  if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
  const out = new URL('../models/istanbul-taksim-republic-monument.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
