/**
 * Istanbul Sapphire, 4. Levent, Istanbul: procedural, CC0-1.0.
 * bun generators/istanbul-sapphire.ts
 *
 * Tabanlıoğlu Architects, 2010. A slim glass slab (54 floors above ground)
 * with a double-skin curtain wall whose outer skin sweeps out at the foot
 * of the east face in a concave curve and runs into the roof of the
 * shopping-mall podium; garden floors every third storey and communal or
 * plant floors every ninth, which show as lighter bands on the glass; a
 * roof that slopes along the slab's length, with the spire at the high end.
 * The mall podium (two wings either side of the slab, glass walls) is part
 * of the same OSM building.
 *
 * Frame: x across the slab (towards world 87.6), y along it (world 357.6),
 * z up; placed with bearing 357.6. Origin at the centroid of the mall's
 * outline (way/156828034), 29.006050, 41.084961; the slab stands at
 * x -33.3..-6.7, y -24..24. The site is flat (Levent). Elevation 0. The
 * terrain check could not run (no Mapterhorn z15 here).
 *
 * OSM (ODbL), fetched 2026-11: way/156828034 "Sapphire" (shop=mall, 3
 * levels, wikidata Q166882), a 134.6 x 48.4 m rectangle; way/673790538
 * building:part "İstanbul Sapphire", height 235, 64 levels (counting the
 * ten basements), 26.6 x 48.1 m. way/905823757 (landuse) is not a
 * building. Wikidata Q166882 checked: "Istanbul Sapphire", height 261.
 *
 * Published (Wikipedia en "Istanbul Sapphire"): roof 238 m, 261 m with the
 * spire; 54 floors above ground; gardens between every three floors, every
 * nine floors separated by a communal or mechanical floor; 35,000 m2 mall.
 *
 * Estimated from photos: floors about 4.3 m (238 / 55); light bands every
 * nine floors (38.7 m) and pale lines every three; the roof falls about
 * 9 m along the slab (p02, p05: the broad face's top edge runs down from
 * the spire end); the skirt leaves the east face at about 44 m and meets
 * the podium roof 16 m out (p01, p03, p04); podium glass walls 14 m (three
 * storeys), the east wing's roof lifting to 18 m at its end (p03, the
 * cantilevered entrance canopy, kept inside the outline). Spire from the
 * north end, 238 to 261 m (published), drawn 1.6 m wide at its foot.
 * Invented: which narrow end is high, and that the skirt is on the east
 * face (the photos agree it sweeps into the long wing of the podium, which
 * OSM puts east of the slab); the slab's north narrow face is drawn as the
 * dark frame seen in p05, the south one with the garden floors' light bands.
 *
 * Colours: the curtain wall reads dark teal-blue in daylight, pulled light
 * to #67838f; the podium glass is lighter, sky grey-blue #a9bfd1; pale trim
 * bands; grey roofs; a metal spire. Night: the residential floors and the
 * mall glow (window materials).
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 * - p01 "IstanbulSapphireOverall straighten.jpg", Mimar77, CC BY-SA 4.0
 *   (from a height, the slab and the skirt into the podium)
 *   https://commons.wikimedia.org/wiki/File:IstanbulSapphireOverall_straighten.jpg
 * - p02 "Istanbul Sapphire 2024 (cropped).jpg", Hello40339, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Istanbul_Sapphire_2024_(cropped).jpg
 * - p03 "Sapphire building 7375.jpg", Dosseman, CC BY-SA 4.0 (podium,
 *   entrance canopy, skirt)
 *   https://commons.wikimedia.org/wiki/File:Sapphire_building_7375.jpg
 * - p04 "Sapphire building 9010.jpg", Dosseman, CC BY-SA 4.0 (the skirt)
 *   https://commons.wikimedia.org/wiki/File:Sapphire_building_9010.jpg
 * - p05 "Istanbul Sapphire4.jpg", Scott Dexter, CC BY-SA 2.0 (whole
 *   slab, the top and spire)
 *   https://commons.wikimedia.org/wiki/File:Istanbul_Sapphire4.jpg
 * Look-only: none.
 *
 * Doubts: no distant level photo from a known side, so the slab's
 * orientation of skirt, spire and top slope is inferred; heights are
 * published, not measured; the podium's height is photo-estimated.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]

function poly(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    const g = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}

function rect(x0: number, x1: number, y0: number, y1: number, c = 0): XY[] {
  if (c <= 0) return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  return [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
}

/** Prism over a convex ring whose top follows top(x, y). */
function prism(p: Part, ring: XY[], z0: number, top: number | ((x: number, y: number) => number), cap = true, bottom = false) {
  const zt = typeof top === 'number' ? () => top : top
  const lo = ring.map(([x, y]) => [x, y, z0] as V3), hi = ring.map(([x, y]) => [x, y, zt(x, y)] as V3)
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length
    p.quad(lo[i], lo[j], hi[j], hi[i])
  }
  if (cap) poly(p, hi, [0, 0, 1])
  if (bottom) poly(p, lo, [0, 0, -1])
}

export function build() {
  const glassW = new Part(), podGlass = new Part(), trim = new Part(), roof = new Part(), metal = new Part()

  const X0 = -33.3, X1 = -6.7, Y0 = -24, Y1 = 24
  const ROOF_N = 238, ROOF_S = 229
  const roofZ = (_x: number, y: number) => ROOF_S + ((ROOF_N - ROOF_S) * (y - Y0)) / (Y1 - Y0)

  // The slab: curtain wall, chamfered corners.
  prism(glassW, rect(X0, X1, Y0, Y1, 0.8), 0, (x, y) => roofZ(x, y) - 1.2, false)
  // parapet / roof edge in trim, roof in grey
  {
    const r = rect(X0 - 0.2, X1 + 0.2, Y0 - 0.2, Y1 + 0.2, 0.95)
    const lo = r.map(([x, y]) => [x, y, roofZ(x, y) - 1.4] as V3), hi = r.map(([x, y]) => [x, y, roofZ(x, y) + 0.4] as V3)
    for (let i = 0; i < r.length; i++) { const j = (i + 1) % r.length; trim.quad(lo[i], lo[j], hi[j], hi[i]) }
    poly(roof, hi, [0, 0, 1])
  }

  // Floor bands: a broad pale band every nine floors, a thin line every three.
  const FL = 238 / 55
  for (let f = 3; f < 54; f += 3) {
    const z = 15 + f * FL
    const big = f % 9 === 0
    const h = big ? 1.5 : 0.45
    const r = rect(X0 - 0.12, X1 + 0.12, Y0 - 0.12, Y1 + 0.12, 0.85)
    if (z + h > ROOF_S - 3) continue
    const lo = r.map(([x, y]) => [x, y, z] as V3), hi = r.map(([x, y]) => [x, y, z + h] as V3)
    for (let i = 0; i < r.length; i++) { const j = (i + 1) % r.length; trim.quad(lo[i], lo[j], hi[j], hi[i]) }
  }
  // Corner frames on the long edges (pale mullion lines, a few only).
  for (const x of [X0, X1]) for (const y of [Y0, Y1]) {
    const sx = x < -20 ? -1 : 1, sy = y < 0 ? -1 : 1
    const cx = x - sx * 0.45, cy = y - sy * 0.45
    prism(trim, rect(cx - 0.5, cx + 0.5, cy - 0.5, cy + 0.5), 14, (xx, yy) => roofZ(xx, yy) + 0.4, false)
  }
  // The north narrow face: the dark frame, a vertical fin pair standing proud.
  for (const x of [X0 + 2.2, X1 - 2.2]) prism(glassW, rect(x - 0.8, x + 0.8, Y1, Y1 + 1.2), 14, (xx, yy) => roofZ(xx, yy) + 1.5, true)
  // The south narrow face: the garden floors as pale recessed bands.
  for (let f = 3; f < 52; f += 3) {
    const z = 15 + f * FL
    if (z > ROOF_S - 6) continue
    poly(trim, [[X0 + 3, Y0 - 0.06, z - 1.6], [X1 - 3, Y0 - 0.06, z - 1.6], [X1 - 3, Y0 - 0.06, z + 0.3], [X0 + 3, Y0 - 0.06, z + 0.3]], [0, -1, 0])
  }

  // The skirt: the outer skin sweeps out from the east face into the
  // podium roof. A concave fillet between x = X1 and the curve.
  {
    const zTop = 44, zBot = 14, out = 16
    const n = 8
    const prof: Array<[number, number]> = []
    for (let k = 0; k <= n; k++) {
      const t = k / n // 0 at the top, 1 at the foot
      const a = (t * Math.PI) / 2
      // quarter ellipse, concave outward: starts tangent to the face
      prof.push([X1 + out * (1 - Math.cos(a)), zTop - (zTop - zBot) * Math.sin(a)])
    }
    const ya = Y0 + 0.8, yb = Y1 - 0.8
    for (let k = 0; k < n; k++) {
      const [x0, z0] = prof[k], [x1, z1] = prof[k + 1]
      // outward surface: normal points +x and up
      poly(glassW, [[x0, ya, z0], [x0, yb, z0], [x1, yb, z1], [x1, ya, z1]], [z0 - z1, 0, x1 - x0])
      // side caps (triangles fanning from the face line)
      poly(glassW, [[X1, ya, z0], [x0, ya, z0], [x1, ya, z1], [X1, ya, z1]], [0, -1, 0])
      poly(glassW, [[X1, yb, z0], [x0, yb, z0], [x1, yb, z1], [X1, yb, z1]], [0, 1, 0])
    }
    // the bright edge where the skin meets the roof
    poly(trim, [[X1 + out, ya, zBot + 0.6], [X1 + out, yb, zBot + 0.6], [X1 + out + 0.6, yb, zBot], [X1 + out + 0.6, ya, zBot]], [1, 0, 1])
  }

  // Podium: two glass wings with grey roofs; the east wing's roof lifts to
  // its entrance canopy at the east end.
  const PH = 14, PX0 = -67.3, PX1 = 67.3, PY = 24.2
  const eastTop = (x: number) => (x < 40 ? PH : PH + ((x - 40) / (PX1 - 40)) * 4)
  for (const [x0, x1, top] of [[PX0, X0, () => PH], [X1, PX1, (x: number) => eastTop(x)]] as Array<[number, number, (x: number, y: number) => number]>) {
    const r = rect(x0, x1, -PY, PY)
    // glass walls, set back a little under the roof edge
    prism(podGlass, rect(x0 < -40 ? x0 + 0.6 : x0 - 1, x1 > 40 ? x1 - 0.6 : x1 + 1, -PY + 0.6, PY - 0.6), 0, (x, y) => top(x, y) - 1, false)
    // roof slab
    const lo = r.map(([x, y]) => [x, y, top(x, y) - 1] as V3), hi = r.map(([x, y]) => [x, y, top(x, y)] as V3)
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; trim.quad(lo[i], lo[j], hi[j], hi[i]) }
    poly(roof, hi, [0, 0, 1])
    poly(trim, lo, [0, 0, -1])
    // a storey line on the glass
    for (const z of [5]) {
      const rr = rect(x0 + 0.5, x1 - 0.5, -PY + 0.5, PY - 0.5)
      const l2 = rr.map(([x, y]) => [x, y, z] as V3), h2 = rr.map(([x, y]) => [x, y, z + 0.5] as V3)
      for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; trim.quad(l2[i], l2[j], h2[j], h2[i]) }
    }
  }

  // Spire at the north end.
  {
    const cx = (X0 + X1) / 2, cy = Y1 - 4
    const secs: Array<[number, number]> = [[ROOF_N - 0.5, 1.6], [248, 1.0], [256, 0.5], [261, 0.15]]
    const sq = (h: number, z: number): V3[] => [[cx - h, cy - h, z], [cx + h, cy - h, z], [cx + h, cy + h, z], [cx - h, cy + h, z]]
    metal.loft(secs.map(([z, h]) => sq(h, z)))
    metal.cap(sq(0.15, 261), true)
    // its housing on the roof
    prism(trim, rect(cx - 4, cx + 4, cy - 3, cy + 3, 0.6), ROOF_N - 3, ROOF_N + 2.5, true)
  }

  return [
    { part: glassW, material: windowVariant(2, 0x67838f) },
    { part: podGlass, material: windowVariant(3, 0xa9bfd1) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: metal, material: { ...PALETTE.metal, color: 0x8d9299 } },
  ]
}

if (import.meta.main) {
  const parts = build()
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  for (const { part, material } of parts) console.log(material.name, part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Istanbul Sapphire', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 357.6, elevation: 0, height: 261,
  })
  if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
  const out = new URL('../models/istanbul-sapphire.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
