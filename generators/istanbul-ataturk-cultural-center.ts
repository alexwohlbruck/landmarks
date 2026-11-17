/**
 * Atatürk Cultural Center (new AKM, 2021), Taksim Square, Istanbul:
 * procedural, CC0-1.0. bun generators/istanbul-ataturk-cultural-center.ts
 *
 * Murat Tabanlıoğlu, opened 2021 on the site of the 1969 building. A long
 * travertine-clad box; its front on Taksim Square is a deep travertine
 * picture frame (roof slab and side walls standing proud, the walls leaning
 * out towards the top) round a glass wall screened by a lattice of slim
 * vertical aluminium fins and staggered panels. Behind the glass stands
 * the opera hall, a great red sphere, which is the building's identity,
 * above all at night when it glows through the facade. The glass is drawn
 * translucent (STYLE.md "Translucent glass") with the sphere and two foyer
 * floors modelled inside; the rest of the building is opaque.
 *
 * Frame: x across the front (towards world 15), y towards the square
 * (world 285), z up; placed with bearing 285. Origin at the centroid of the
 * OSM outline (way/1033333873), 28.988264, 41.036578. The square is flat
 * here. Elevation 0. The terrain check could not run (no Mapterhorn z15
 * here).
 *
 * OSM (ODbL), fetched 2026-11: way/1033333873 "Atatürk Kültür Merkezi",
 * height 25, wikidata Q551685 (checked: "Atatürk Cultural Center", height
 * 25.9). Symmetric plan: the front block x +-27.9, y 11.6..60.6; a wider
 * middle x +-37.8, y -34..11.6; the rear x +-27.8, y -51.7..-34 and a tail
 * x +-19.3 to y -59.7. No parts.
 *
 * Published: height 25.9 m (Wikidata).
 * Estimated from photos: the frame 1.8 m thick, standing 3 m proud of the
 * glass; its side walls lean out about 1.5 m over the height (p02, p05);
 * the fins about 2.2 m apart with staggered panels (p03); the sphere about
 * 27 m across, its top about 15 m up, a little right of centre seen from the
 * square (p04 at night shows its upper half through the lower part of the
 * glass); the middle block's side wings 13 m (p02 shows a lower dark
 * block beside the frame); the rear and tail kept at the front's height
 * and 18 m (no photo of the back: plain).
 * Invented: the foyer floors behind the glass (two slabs, to give depth).
 *
 * Colours: grey-beige travertine (#d6cfc3), pale aluminium fins (#d5d8d8),
 * clear blue glass (#7fc4de, opacity 0.3), the opera sphere red (#c45a50,
 * named neon so it glows red at night as in p04).
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 * - p01 "Atatürk Kültür Merkezi (52118111728).jpg", Metro Centric, CC BY 2.0
 *   (the front from the square)
 *   https://commons.wikimedia.org/wiki/File:Atat%C3%BCrk_K%C3%BClt%C3%BCr_Merkezi_(52118111728).jpg
 * - p02 "Atatürk Cultural Center (AKM).jpg", Maurice Flesier, CC BY-SA 4.0
 *   (front and the north side wing)
 *   https://commons.wikimedia.org/wiki/File:Atat%C3%BCrk_Cultural_Center_(AKM).jpg
 * - p03 "Exterior of Atatürk Cultural Center 20220607 (2).jpg", Jelican9,
 *   CC BY-SA 4.0 (the lattice)
 *   https://commons.wikimedia.org/wiki/File:Exterior_of_Atat%C3%BCrk_Cultural_Center_20220607_(2).jpg
 * - p04 "TaksimAKM.jpg", Metuboy, CC BY-SA 4.0 (night: the red sphere)
 *   https://commons.wikimedia.org/wiki/File:TaksimAKM.jpg
 * - p05 "Istanbul, Turkey (November 2023) - 758.jpg", Another Believer,
 *   CC BY-SA 4.0 (the frame's corner)
 *   https://commons.wikimedia.org/wiki/File:Istanbul,_Turkey_(November_2023)_-_758.jpg
 * - p06 "Akm Night photo.jpg", Kübradereli1, CC0 (night, the sphere)
 *   https://commons.wikimedia.org/wiki/File:Akm_Night_photo.jpg
 * Look-only: none.
 *
 * Doubts: the sphere's size and height are read from night photos through
 * the lattice; the back and the rear blocks' heights have no photo.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

function face(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    const g = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}

/** A box from corners; only the listed faces (default all but the bottom). */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, skip: string[] = ['-z']) {
  const F: Array<[string, V3[], V3]> = [
    ['+z', [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1]],
    ['-z', [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], [0, 0, -1]],
    ['+x', [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], [1, 0, 0]],
    ['-x', [[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]], [-1, 0, 0]],
    ['+y', [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], [0, 1, 0]],
    ['-y', [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], [0, -1, 0]],
  ]
  for (const [k, q, n] of F) if (!skip.includes(k)) face(p, q, n)
}

export function build() {
  const stone = new Part(), glass = new Part(), fins = new Part(), sphere = new Part(), win = new Part()

  const H = 25.9
  const FX = 27.9, FY0 = 11.6, FY1 = 60.6 // front block
  const T = 1.8, PROUD = 3, LEAN = 1.5
  const GY = FY1 - PROUD // the glass wall

  // ---- Front block: the frame.
  // Leaning side walls: inner face at x = +-(FX - T) at the foot, leaning out by LEAN at the top.
  for (const s of [-1, 1]) {
    const xo0 = s * FX, xi0 = s * (FX - T), xo1 = s * (FX + LEAN), xi1 = s * (FX - T + LEAN)
    const y0 = FY0, y1 = FY1
    const P = (x: number, y: number, z: number): V3 => [x, y, z]
    face(stone, [P(xo0, y0, 0), P(xo0, y1, 0), P(xo1, y1, H), P(xo1, y0, H)], [s, 0, -s * 0.05])
    face(stone, [P(xi0, y0, 0), P(xi0, y1, 0), P(xi1, y1, H - T), P(xi1, y0, H - T)], [-s, 0, s * 0.05])
    face(stone, [P(xo0, y1, 0), P(xi0, y1, 0), P(xi1, y1, H - T), P(xo1, y1, H)], [0, 1, 0])
    face(stone, [P(xo0, y0, 0), P(xi0, y0, 0), P(xi1, y0, H - T), P(xo1, y0, H)], [0, -1, 0])
  }
  // Roof slab (spans the leaning walls' tops).
  {
    const x1 = FX + LEAN
    box(stone, -x1, x1, FY0, FY1, H - T, H, ['-z'])
    // its soffit over the recess in front of the glass
    face(stone, [[-(FX - T + LEAN), GY, H - T], [FX - T + LEAN, GY, H - T], [FX - T + LEAN, FY1, H - T], [-(FX - T + LEAN), FY1, H - T]], [0, 0, -1])
  }
  // The block's back wall, inside (seen through the glass) and its sides.
  face(stone, [[-FX, FY0, 0], [FX, FY0, 0], [FX, FY0, H], [-FX, FY0, H]], [0, 1, 0])

  // ---- Glass front, translucent, from the foot to the frame's top.
  const xg0 = (z: number) => FX - T + (LEAN * z) / (H - T)
  face(glass, [[-xg0(0), GY, 0], [xg0(0), GY, 0], [xg0(H - T), GY, H - T], [-xg0(H - T), GY, H - T]], [0, 1, 0])
  // the glazed sides of the hall behind the frame are stone; the roof is stone.

  // ---- The lattice: vertical fins and staggered panels in front of the glass.
  const nf = 24
  for (let k = 0; k <= nf; k++) {
    const x = -FX + T + 0.5 + ((2 * (FX - T) - 1) * k) / nf
    box(fins, x - 0.12, x + 0.12, GY + 0.05, GY + 0.75, 0, H - T - 0.05, ['-z', '+z'])
  }
  for (let r = 0; r < 6; r++) {
    const z0 = 4.2 + r * 3.4
    for (let k = 0; k < nf; k++) {
      if ((k + r * 2) % 3 === 0) continue
      const x0 = -FX + T + 0.5 + ((2 * (FX - T) - 1) * k) / nf, w = (2 * (FX - T) - 1) / nf
      const h = 2.0 + ((k * 7 + r * 3) % 4) * 0.3
      face(fins, [[x0 + 0.12, GY + 0.78, z0], [x0 + w * 0.55, GY + 0.78, z0], [x0 + w * 0.55, GY + 0.78, z0 + h], [x0 + 0.12, GY + 0.78, z0 + h]], [0, 1, 0])
      face(fins, [[x0 + 0.12, GY + 0.74, z0], [x0 + w * 0.55, GY + 0.74, z0], [x0 + w * 0.55, GY + 0.74, z0 + h], [x0 + 0.12, GY + 0.74, z0 + h]], [0, -1, 0])
    }
  }
  // the lit entrance band at the foot
  face(win, [[-xg0(0) + 0.5, GY + 0.04, 0.4], [xg0(0) - 0.5, GY + 0.04, 0.4], [xg0(0) - 0.5, GY + 0.04, 3.6], [-xg0(0) + 0.5, GY + 0.04, 3.6]], [0, 1, 0])

  // ---- Inside: the red opera sphere and two foyer floors.
  {
    const cx = 3, cy = 38, cz = 1.5, R = 13.5, n = 16, m = 9
    for (let i = 0; i < m; i++) {
      const amin = Math.asin(-cz / R), a0 = amin + ((Math.PI / 2 - amin) * i) / m, a1 = amin + ((Math.PI / 2 - amin) * (i + 1)) / m
      for (let j = 0; j < n; j++) {
        const b0 = (2 * Math.PI * j) / n, b1 = (2 * Math.PI * (j + 1)) / n
        const pt = (a: number, b: number): V3 => [cx + R * Math.cos(a) * Math.cos(b), cy + R * Math.cos(a) * Math.sin(b), cz + R * Math.sin(a)]
        const nr = (a: number, b: number): V3 => [Math.cos(a) * Math.cos(b), Math.cos(a) * Math.sin(b), Math.sin(a)]
        const A = pt(a0, b0), B = pt(a0, b1), C = pt(a1, b1), D = pt(a1, b0)
        sphere.tri(A, B, C, undefined, undefined, undefined, [nr(a0, b0), nr(a0, b1), nr(a1, b1)])
        if (i < m - 1) sphere.tri(A, C, D, undefined, undefined, undefined, [nr(a0, b0), nr(a1, b1), nr(a1, b0)])
      }
    }
  }
  for (const z of [8.5, 16.5]) box(stone, -(FX - T), FX - T, GY - 7, GY - 1.5, z - 0.6, z, ['-x', '+x'])

  // ---- The rest: middle block with its lower side wings, rear, tail.
  box(stone, -27.9, 27.9, -34, FY0, 0, H, ['-z', '+y'])
  for (const s of [-1, 1]) {
    const x0 = s > 0 ? 27.9 : -37.8, x1 = s > 0 ? 37.8 : -27.9
    box(stone, x0, x1, -34, 11.6, 0, 13, ['-z'])
    // a glazed band on the wings' outer faces
    const xf = s * (37.8 + 0.05)
    face(win, [[xf, -30, 3.5], [xf, 8, 3.5], [xf, 8, 10.5], [xf, -30, 10.5]], [s, 0, 0])
    // and on their fronts towards the square
    face(win, [[x0 + 1, 11.65, 3.5], [x1 - 1, 11.65, 3.5], [x1 - 1, 11.65, 10.5], [x0 + 1, 11.65, 10.5]], [0, 1, 0])
  }
  box(stone, -27.8, 27.8, -51.7, -34, 0, H, ['-z'])
  box(stone, -19.3, 19.3, -59.7, -51.7, 0, 18, ['-z'])
  // a stone coping line on the long sides of the main mass
  for (const s of [-1, 1]) {
    const xf = s * 27.95
    face(win, [[xf, -50, 15], [xf, -36, 15], [xf, -36, 21], [xf, -50, 21]], [s, 0, 0])
  }

  return [
    { part: stone, material: { ...finish('travertine', 0xd6cfc3), floodlight: (_p: V3, n: V3) => (n[2] > 0.8 ? 0.3 : 0.7) } },
    { part: glass, material: { name: 'glass', color: 0x7fc4de, roughness: 0.2, opacity: 0.3, doubleSided: true } },
    { part: fins, material: finish('aluminium', 0xd5d8d8) },
    { part: sphere, material: finish('neon-opera-red', 0xc45a50) },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) {
  const parts = build()
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  for (const { part, material } of parts) console.log(material.name, part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Atatürk Cultural Center', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 285, elevation: 0, height: 25.9,
  })
  if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
  const out = new URL('../models/istanbul-ataturk-cultural-center.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
