/**
 * Ulugh Beg Madrasa, Registan, Samarkand: procedural, CC0-1.0.
 * bun generators/samarkand-ulugh-beg-madrasa.ts
 *
 * Built 1417-1420 by Ulugh Beg: the oldest of Registan's three madrasahs, on
 * the west side of the square, its lancet-arched pishtaq facing east into
 * it, the corners flanked by four tall minarets, two ribbed domes over the
 * front corner lecture rooms (Wikipedia, "Registan").
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation from OSM. The origin is the outline's area centroid; y = 0 is
 * the square's paving. tools/terrain.ts could not check the site (Mapterhorn
 * has no z15 tiles here); the square is flat in every photo, so elevation is 0.
 *
 * Every part is OSM's building:part extruded to its tagged height, except
 * the features the kit draws (see the kit header): minarets, the portal and
 * its iwan arch, the arcades of the front ranges, domes and turrets. The
 * tilework itself is left out (no textures): portals and minarets are a
 * blue-grey mosaic colour, walls a sand brick, domes turquoise glaze.
 *
 * OSM: relation/2437665 (outline with the courtyard) and its parts: four
 * minarets (33 m), the portal (24 m), the front range (15 m), corner rooms
 * (17 m), their domes (circles r 4.9 m, 20 m), the west gate (20 m).
 * Changed from OSM: the portal is drawn 28 m (in the CC0 panorama it reaches
 * ~0.85 of the 33 m minarets at the same depth; OSM's 24 m reads low); the
 * minarets 4.2 m across at the foot (OSM's circles are 3.6 m; the panorama
 * reads them broader); the domes rise to 21.5 m (photo estimate).
 * Estimated: the uncovered ranges at 13 m (the panorama), the lancet
 * arch (0.44 of the face wide, springing at 0.47 and peaking at 0.81 of the
 * portal's height, read off the panorama), niche bays.
 * Left out: the north-east minaret's lean, the tilework patterns.
 *
 * Photos (Wikimedia Commons):
 * - "Registan 01.jpg", Bernard Gagnon, CC0 (panorama from the south: all three)
 * - "Самарканд. Площадь-Регистан.jpg", Kraftabbas, CC BY-SA 4.0 (night panorama)
 * - "Registan, Samarkand (8590116140).jpg", Aleksandr Zykov, CC BY-SA 2.0
 * - "Sher-Dor Madrasah Samarkand.jpg", Ekrem Canli, CC BY-SA 3.0 (tile colour)
 * - "Ulugh beg Madrasah.jpg", Nassima Chahboun, CC BY-SA 4.0
 * - "Tilya Kori Madrasah (220363333).jpeg", Francisco Anzola, CC BY 3.0
 *
 * Shared kit for the three Registan madrasahs (samarkand-ulugh-beg-madrasa,
 * samarkand-sher-dor-madrasa, samarkand-tilya-kori-madrasa). It lives in the
 * Ulugh Beg generator; that model's own build runs under `import.meta.main`,
 * so importing the kit builds nothing.
 *
 * Every model is built in true orientation (bearing 0) from its OSM outline
 * and building:parts, in metres about its own anchor (the outline's area
 * centroid). Each part is extruded to its OSM height; parts with a role
 * become their feature instead:
 * - `minaret`: a round tiled shaft, tapering, under a corbelled crown;
 * - `portal`: the pishtaq, its face to the square carrying the iwan's
 *   pointed arch as a flush panel inside a pale frame;
 * - `front`: a range whose faces to the square carry two storeys of
 *   pointed-arch niches;
 * - `dome-fluted` / `dome-smooth` / `dome-brick`: a drum and dome over the
 *   part's circle; `turret`: a small corner tower under a turquoise cap.
 * Whatever of the outline no part covers is extruded to `defaultH`.
 *
 * Front ranges are clad in the mosaic colour where the photos show tiled
 * fronts (Ulugh Beg, Sher-Dor) and brick where they read tan (Tilya-Kori).
 *
 * Materials (six): sand-coloured brick (walls, roofs), blue-grey mosaic tile
 * (portals, minarets, drums), turquoise glaze (domes, caps), pale trim
 * (crowns, frames, cornices), `window` for the niches (lit at night) and
 * `entrance` for the iwans (which glow gold at night, as in the photos).
 * The brick, tile and domes carry a warm floodlight wash.
 */
import clipping from 'polygon-clipping'
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { earcut, offset, prism, type XY } from './sf-de-young'

export type Role = 'minaret' | 'portal' | 'front' | 'dome-fluted' | 'dome-smooth' | 'dome-brick' | 'turret' | 'skip'
export type PartData = { id: string; h: number; rings: XY[][][]; role?: Role; base?: number; r?: number; top?: number }
export type MadrasaSpec = {
  name: string
  file: string
  /** The square's centre in this model's frame: faces turned to it get arches. */
  square: XY
  outline: XY[][][]
  parts: PartData[]
  defaultH: number
  minaretR: number
  portalH?: Record<string, number>
  /** Front ranges clad in the mosaic colour (Ulugh Beg, Sher-Dor) rather than brick (Tilya-Kori). */
  frontTile?: boolean
}

const TAU = Math.PI * 2
const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const ccwR = (r: XY[]) => (area(r) > 0 ? r : [...r].reverse())
const cwR = (r: XY[]) => (area(r) < 0 ? r : [...r].reverse())
const open = (r: XY[]) => (r.length > 1 && r[0][0] === r.at(-1)![0] && r[0][1] === r.at(-1)![1] ? r.slice(0, -1) : r)
const centroid = (r: XY[]): XY => { const o = open(r); return [o.reduce((s, p) => s + p[0], 0) / o.length, o.reduce((s, p) => s + p[1], 0) / o.length] }
const meanR = (r: XY[]) => { const c = centroid(r), o = open(r); return o.reduce((s, p) => s + Math.hypot(p[0] - c[0], p[1] - c[1]), 0) / o.length }

/** Join each hole into the outer ring by a bridge, for ear-clipping. */
function bridge(outer0: XY[], holes0: XY[][]): XY[] {
  let ring = ccwR(open(outer0))
  const segs = () => ring.map((p, i) => [p, ring[(i + 1) % ring.length]] as [XY, XY])
  const crosses = (a: XY, b: XY, c: XY, d: XY) => {
    const o = (p: XY, q: XY, r: XY) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])
    return o(a, b, c) * o(a, b, d) < -1e-9 && o(c, d, a) * o(c, d, b) < -1e-9
  }
  const holes = holes0.map((h) => cwR(open(h))).sort((a, b) => Math.max(...b.map((p) => p[0])) - Math.max(...a.map((p) => p[0])))
  for (const hole of holes) {
    const hi = hole.reduce((m, p, i) => (p[0] > hole[m][0] ? i : m), 0), H = hole[hi]
    const all = [...segs(), ...hole.map((p, i) => [p, hole[(i + 1) % hole.length]] as [XY, XY])]
    let best = -1, bd = Infinity
    ring.forEach((V, i) => {
      const d = Math.hypot(V[0] - H[0], V[1] - H[1])
      if (d < bd && !all.some(([c, e]) => crosses(H, V, c, e))) { bd = d; best = i }
    })
    if (best < 0) continue
    const h = [...hole.slice(hi), ...hole.slice(0, hi), H]
    ring = [...ring.slice(0, best + 1), ...h, ring[best], ...ring.slice(best + 1)]
  }
  return ring
}
/** A flat polygon with holes at height z, facing up. */
function roof(p: Part, poly: XY[][], z: number) {
  const ring = bridge(poly[0], poly.slice(1))
  const n: V3 = [0, 0, 1]
  for (const [i, j, k] of earcut(ring)) p.tri([...ring[i], z], [...ring[j], z], [...ring[k], z], undefined, undefined, undefined, [n, n, n])
}
/** Walls round a polygon with holes; the courtyard walls face inward. */
function walls(p: Part, poly: XY[][], z0: number, z1: number) {
  poly.forEach((r0, k) => {
    const r = k === 0 ? ccwR(open(r0)) : cwR(open(r0))
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      p.quad([...a, z0], [...b, z0], [...b, z1], [...a, z1])
    }
  })
}

/** Surface of revolution about c; `ribs` > 0 flutes it (flat-shaded ribs). */
function revolve(p: Part, prof: [number, number][], c: XY, n: number, ribs = 0, depth = 0.07) {
  const pt = (r: number, a: number, z: number): V3 => {
    const f = ribs ? 1 - depth * (1 - Math.abs(Math.cos((ribs * a) / 2))) : 1
    return [c[0] + r * f * Math.cos(a), c[1] + r * f * Math.sin(a), z]
  }
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    for (let s = 0; s < n; s++) {
      const a0 = (s / n) * TAU, a1 = ((s + 1) / n) * TAU
      if (r1 === 0) p.tri(pt(r0, a0, z0), pt(r0, a1, z0), [c[0], c[1], z1])
      else if (r0 === 0) p.tri([c[0], c[1], z0], pt(r1, a1, z1), pt(r1, a0, z1))
      else p.quad(pt(r0, a0, z0), pt(r0, a1, z0), pt(r1, a1, z1), pt(r1, a0, z1))
    }
  }
}

/** A pointed (two-centred) arch outline, `w` wide, springing at `s`, apex at `t`; bottom at `b`. */
function archPts(w: number, b: number, s: number, t: number, n = 5): XY[] {
  const half = w / 2, rise = t - s
  // Two arcs, each centred on the far side of the span, meeting at the apex.
  const R = (half * half + rise * rise) / (2 * half), cx = half - R
  const pts: XY[] = [[-half, b], [half, b], [half, s]]
  const a0 = 0, a1 = Math.atan2(rise, -cx)
  for (let i = 1; i < n; i++) { const a = a0 + ((a1 - a0) * i) / n; pts.push([cx + R * Math.cos(a), s + R * Math.sin(a)]) }
  pts.push([0, t])
  for (let i = n - 1; i >= 1; i--) { const a = a0 + ((a1 - a0) * i) / n; pts.push([-(cx + R * Math.cos(a)), s + R * Math.sin(a)]) }
  pts.push([-half, s])
  return pts
}
/** A flat shape (in face u, v) laid on a wall from a to b, `lift` proud of it. */
function onWall(p: Part, a: XY, b: XY, u0: number, shape: XY[], lift: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const nrm: V3 = [t[1], -t[0], 0] // outward for a counter-clockwise ring
  const P = ([u, v]: XY): V3 => [a[0] + t[0] * (u0 + u) + nrm[0] * lift, a[1] + t[1] * (u0 + u) + nrm[1] * lift, v]
  // Fan from the shape's centroid (the arch is star-shaped about it).
  const c = centroid(shape), C = P(c)
  for (let i = 0; i < shape.length; i++) {
    const A = P(shape[i]), B = P(shape[(i + 1) % shape.length])
    p.tri(C, A, B, undefined, undefined, undefined, [nrm, nrm, nrm])
  }
}
/** Edges of a ring whose outward side faces `to`. */
/** Drop points where a ring runs straight on (within 10 degrees), so one face is one edge. */
function straighten(r: XY[]): XY[] {
  let pts = r
  for (let pass = 0; pass < 3; pass++) {
    const keep = pts.filter((b, i) => {
      const a = pts[(i + pts.length - 1) % pts.length], c = pts[(i + 1) % pts.length]
      const u = Math.atan2(b[1] - a[1], b[0] - a[0]), v = Math.atan2(c[1] - b[1], c[0] - b[0])
      let d = Math.abs(v - u) % TAU; if (d > Math.PI) d = TAU - d
      return d > (10 * Math.PI) / 180
    })
    if (keep.length === pts.length || keep.length < 3) break
    pts = keep
  }
  return pts
}
function facing(ring0: XY[], to: XY, minLen: number, cosMin = 0.6) {
  const r = straighten(ccwR(open(ring0))), out: [XY, XY][] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < minLen) continue
    const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const d: XY = [to[0] - m[0], to[1] - m[1]], dl = Math.hypot(...d)
    if ((n[0] * d[0] + n[1] * d[1]) / dl > cosMin) out.push([a, b])
  }
  return out
}

export function buildMadrasa(spec: MadrasaSpec) {
  const brick = new Part(), tile = new Part(), dome = new Part(), trim = new Part(), niche = new Part(), iwan = new Part()

  // Features win over plain parts: a body or range mapped under a portal,
  // front, minaret or dome is cut away there, so its wall can't cover them.
  const featureRings = spec.parts.filter((p) => p.role && p.role !== 'skip').flatMap((p) => p.rings)
  // Whatever of the outline no part covers. A small leftover touching a
  // portal is the portal's own front (OSM maps some portals from the back of
  // the iwan, leaving the strip out to the front line uncovered): it joins
  // the portal, which then stands on the front line as in the photos.
  const covered = spec.parts.filter((p) => p.role !== 'skip').flatMap((p) => p.rings)
  let rest = clipping.difference(spec.outline as any, ...(covered as any[]).map((r) => [r])) as XY[][][]
  const portalRings = new Map<string, XY[][][]>()
  for (const part of spec.parts.filter((p) => p.role === 'portal')) {
    const grown = [[offset(ccwR(open(part.rings[0][0])), 1.0)]]
    const strips = rest.filter((poly) => Math.abs(area(poly[0])) < 400 && (clipping.intersection(grown as any, [poly] as any) as any[]).length > 0)
    rest = rest.filter((poly) => !strips.includes(poly))
    portalRings.set(part.id, clipping.union(part.rings as any, ...(strips as any[]).map((q) => [q])) as XY[][][])
  }
  for (const part of spec.parts) {
    const role = part.role
    if (role === 'skip') continue
    const ring = part.rings[0][0]
    const c = centroid(ring)
    if (role === 'minaret') {
      const R = Math.max(meanR(ring), spec.minaretR), H = part.h
      revolve(brick, [[R * 1.12, 0], [R * 1.12, 2.4], [R, 2.9]], c, 14)
      revolve(tile, [[R, 2.9], [R * 0.86, H - 3.2]], c, 14)
      revolve(trim, [[R * 0.86, H - 3.2], [R * 1.28, H - 1.4], [R * 1.28, H - 0.6], [R * 1.05, H - 0.4], [R * 0.6, H], [0, H]], c, 14)
      continue
    }
    if (role === 'turret') {
      const R = Math.max(meanR(ring), 1.4), top = part.top ?? part.h + 2
      revolve(tile, [[R, 0], [R, part.h - 1.5]], c, 12)
      revolve(trim, [[R, part.h - 1.5], [R * 1.2, part.h - 0.9], [R * 1.2, part.h - 0.4], [R * 0.95, part.h - 0.3]], c, 12)
      revolve(dome, [[R * 0.95, part.h - 0.3], [R * 1.12, part.h + 0.6], [R * 0.8, top - 0.9], [0.15, top], [0, top]], c, 12)
      continue
    }
    if (role === 'dome-fluted' || role === 'dome-smooth' || role === 'dome-brick') {
      const R = part.r ?? meanR(ring), base = part.base ?? spec.defaultH, H = part.top ?? part.h
      const drumTop = base + (H - base) * (role === 'dome-smooth' ? 0.4 : 0.32)
      revolve(tile, [[R, base], [R, drumTop]], c, 16)
      revolve(trim, [[R, drumTop], [R * 1.06, drumTop + 0.3], [R * 1.0, drumTop + 0.6]], c, 16)
      const d0 = drumTop + 0.6, span = H - d0
      const prof: [number, number][] = role === 'dome-brick'
        ? [[R, d0], [R * 0.93, d0 + span * 0.35], [R * 0.72, d0 + span * 0.68], [R * 0.4, d0 + span * 0.9], [0, H]]
        : [[R, d0], [R * 1.12, d0 + span * 0.18], [R * 1.1, d0 + span * 0.38], [R * 0.92, d0 + span * 0.6], [R * 0.58, d0 + span * 0.8], [R * 0.22, d0 + span * 0.94], [0, H]]
      revolve(role === 'dome-brick' ? brick : dome, prof, c, role === 'dome-smooth' ? 20 : 24, role === 'dome-smooth' ? 0 : 12, 0.08)
      continue
    }
    // Ordinary, front and portal parts: extrude every polygon of the part.
    const H = role === 'portal' ? spec.portalH?.[part.id] ?? part.h : part.h
    const polys: XY[][][] = role === 'portal' ? portalRings.get(part.id)! : role ? part.rings : (clipping.difference(part.rings as any, ...(featureRings as any[]).map((q) => [q])) as XY[][][])
    for (const poly of polys) {
      if (!role && Math.abs(area(poly[0])) < 4) continue
      const wallPart = role === 'portal' || (role === 'front' && spec.frontTile) ? tile : brick
      if (poly.length === 1) prism(wallPart, ccwR(open(poly[0])), 0, H, brick, 0.5)
      else { walls(brick, poly, 0, H); roof(brick, poly, H) }
    }
    if (role === 'portal') {
      for (const [a, b] of facing(polys[0][0], spec.square, 10)) {
        const L = Math.hypot(b[0] - a[0], b[1] - a[1])
        const frame: XY[] = [[0.06 * L, 0], [0.94 * L, 0], [0.94 * L, 0.93 * H], [0.06 * L, 0.93 * H]]
        onWall(trim, a, b, 0, frame, 0.04)
        onWall(tile, a, b, 0, [[0.11 * L, 0], [0.89 * L, 0], [0.89 * L, 0.88 * H], [0.11 * L, 0.88 * H]], 0.07)
        onWall(trim, a, b, L / 2, archPts(0.54 * L, 0, 0.47 * H, 0.86 * H), 0.1)
        onWall(iwan, a, b, L / 2, archPts(0.44 * L, 0, 0.47 * H, 0.81 * H), 0.13)
      }
    }
    if (role === 'front') {
      for (const [a, b] of facing(ring, spec.square, 6, 0.3)) {
        const L = Math.hypot(b[0] - a[0], b[1] - a[1])
        const bays = Math.max(1, Math.round(L / 4.6)), pitch = L / bays
        for (let i = 0; i < bays; i++) {
          const u = (i + 0.5) * pitch
          onWall(niche, a, b, u, archPts(0.58 * pitch, 0.07 * H, 0.32 * H, 0.44 * H, 3), 0.06)
          onWall(niche, a, b, u, archPts(0.58 * pitch, 0.52 * H, 0.75 * H, 0.87 * H, 3), 0.06)
        }
      }
    }
  }

  // The rest of the outline: the plain two-storey ranges.
  for (const poly of rest) {
    const a = Math.abs(area(poly[0])) - poly.slice(1).reduce((s, h) => s + Math.abs(area(h)), 0)
    if (a < 6) continue
    walls(brick, poly, 0, spec.defaultH); roof(brick, poly, spec.defaultH)
  }

  const lit = (_p: V3, n: V3) => (n[2] > 0.8 ? 0.35 : 0.9)
  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: brick, material: { ...finish('registan-brick', 0xd9c4a0), floodlight: lit } },
    { part: tile, material: { ...finish('registan-tile', 0x9dbbbf), floodlight: lit } },
    { part: dome, material: { ...finish('registan-turquoise', 0x4fb3c2, 0.5), floodlight: lit } },
    { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
    { part: niche, material: PALETTE.window },
    { part: iwan, material: { ...PALETTE.entrance, color: 0x7b8c97 } },
  ].filter((p) => p.part.triangles > 0)
  return parts
}

export async function writeMadrasa(spec: MadrasaSpec, extras: Record<string, unknown>) {
  const parts = buildMadrasa(spec)
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > 6500) throw new Error(`${spec.file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(spec.name, parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 0, elevation: 0, ...extras,
  })
  if (glb.length > 250_000) throw new Error(`${spec.file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${spec.file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

const DATA = {"square":[73.7,15.2],"outline":[[[[-47.5,19.6],[-47.4,19.1],[-47.2,18.7],[-46.9,18.3],[-46.4,18.1],[-45.9,18],[-36.3,-32.2],[-36.8,-32.5],[-37.1,-32.9],[-37.3,-33.3],[-37.4,-33.8],[-37.3,-34.3],[-37.1,-34.8],[-36.7,-35.1],[-36.3,-35.4],[-35.8,-35.5],[-35.3,-35.4],[-34.8,-35.3],[-34.4,-34.9],[-34.1,-34.4],[-34,-33.9],[-24.8,-32.2],[1.2,-27.2],[8.3,-25.9],[34.2,-21],[34.5,-20.9],[43.6,-19.2],[43.7,-19.5],[44,-19.9],[44.4,-20.3],[45,-20.4],[45.5,-20.4],[46,-20.2],[46.5,-19.9],[46.8,-19.4],[46.9,-18.9],[46.8,-18.3],[46.6,-17.8],[46.2,-17.4],[45.7,-17.2],[45.1,-17.1],[43.2,-6.5],[45.9,-6],[43.1,8.4],[40.3,22.6],[37.6,22.1],[35.4,33.4],[35.7,33.5],[36.1,33.8],[36.4,34.3],[36.5,34.8],[36.5,35.4],[36.2,35.9],[35.8,36.3],[35.3,36.5],[34.8,36.6],[34.2,36.5],[33.8,36.2],[33.4,35.8],[33.2,35.3],[33.2,34.8],[23.7,33],[4.9,29.4],[-2.2,28.1],[-9.3,26.7],[-34.2,22],[-44.2,20.1],[-44.4,20.6],[-44.8,21],[-45.3,21.2],[-45.9,21.3],[-46.4,21.2],[-46.9,20.9],[-47.2,20.5],[-47.4,20.1],[-47.5,19.6]],[[-15.7,14.9],[-7.1,16.5],[7,19.2],[15.6,20.9],[17.5,11.2],[18.9,4.2],[20.2,-2.8],[22.1,-12.5],[13.5,-14.1],[6.5,-15.5],[-0.6,-16.8],[-9.2,-18.5],[-11.1,-8.8],[-12.4,-1.8],[-13.8,5.2],[-15.7,14.9]]]],"parts":[{"id":"way/1296455126","h":33,"rings":[[[[46,-20.2],[46.5,-19.9],[46.8,-19.4],[46.9,-18.9],[46.8,-18.3],[46.6,-17.8],[46.2,-17.4],[45.7,-17.2],[45.1,-17.1],[44.6,-17.2],[44.1,-17.5],[43.8,-17.9],[43.6,-18.4],[43.5,-19],[43.6,-19.2],[43.7,-19.5],[44,-19.9],[44.4,-20.3],[45,-20.4],[45.5,-20.4],[46,-20.2]]]],"role":"minaret"},{"id":"way/1296455129","h":33,"rings":[[[[35.7,33.5],[36.1,33.8],[36.4,34.3],[36.5,34.8],[36.5,35.4],[36.2,35.9],[35.8,36.3],[35.3,36.5],[34.8,36.6],[34.2,36.5],[33.8,36.2],[33.4,35.8],[33.2,35.3],[33.2,34.8],[33.3,34.2],[33.6,33.8],[34.1,33.4],[34.6,33.3],[35.1,33.3],[35.4,33.4],[35.7,33.5]]]],"role":"minaret"},{"id":"way/1296455130","h":33,"rings":[[[[-34.8,-35.3],[-34.4,-34.9],[-34.1,-34.4],[-34,-33.9],[-34.1,-33.3],[-34.3,-32.8],[-34.7,-32.4],[-35.2,-32.2],[-35.7,-32.1],[-36.3,-32.2],[-36.8,-32.5],[-37.1,-32.9],[-37.3,-33.3],[-37.4,-33.8],[-37.3,-34.3],[-37.1,-34.8],[-36.7,-35.1],[-36.3,-35.4],[-35.8,-35.5],[-35.3,-35.4],[-34.8,-35.3]]]],"role":"minaret"},{"id":"way/1296455132","h":33,"rings":[[[[-45,18.2],[-44.5,18.5],[-44.3,19],[-44.1,19.5],[-44.2,20.1],[-44.4,20.6],[-44.8,21],[-45.3,21.2],[-45.9,21.3],[-46.4,21.2],[-46.9,20.9],[-47.2,20.5],[-47.4,20.1],[-47.5,19.6],[-47.4,19.1],[-47.2,18.7],[-46.9,18.3],[-46.4,18.1],[-45.9,18],[-45.4,18],[-45,18.2]]]],"role":"minaret"},{"id":"way/1296455133","h":17,"rings":[[[[41.2,-7.9],[42.7,-8.9],[44.1,-16.8],[43.1,-18.3],[35.5,-19.7],[34.1,-18.6],[32.6,-10.8],[33.7,-9.2],[41.2,-7.9]]]]},{"id":"way/1296455135","h":20,"rings":[[[[41.9,-16.9],[42.7,-15.5],[43.1,-14],[42.9,-12.4],[42.2,-11],[41,-9.9],[39.6,-9.2],[38,-9],[36.5,-9.4],[35.2,-10.2],[34.3,-11.4],[33.7,-12.8],[33.6,-14.3],[34.1,-15.7],[34.9,-17],[36.1,-17.9],[37.6,-18.4],[39.1,-18.4],[40.6,-17.9],[41.9,-16.9]]]],"role":"dome-brick","base":16,"top":21.5},{"id":"way/1296455136","h":20,"rings":[[[[33.8,24.6],[34.6,26],[35,27.5],[34.8,29.1],[34.1,30.6],[32.9,31.7],[31.5,32.3],[29.9,32.5],[28.4,32.1],[27.1,31.3],[26.2,30.2],[25.6,28.8],[25.5,27.3],[26,25.8],[26.8,24.6],[28,23.7],[29.4,23.2],[31,23.2],[32.5,23.7],[33.8,24.6]]]],"role":"dome-brick","base":16,"top":21.5},{"id":"way/1296455137","h":20,"rings":[[[[-7.4,18.5],[6.7,21.1],[7,19.2],[-7.1,16.5],[-7.4,18.5]]]]},{"id":"way/1296455138","h":17,"rings":[[[[-0.2,-18.8],[13.9,-16.1],[13.5,-14.1],[6.5,-15.5],[-0.6,-16.8],[-0.2,-18.8]]]]},{"id":"way/1296455139","h":17,"rings":[[[[-13,-9.2],[-15.7,4.8],[-13.8,5.2],[-12.4,-1.8],[-11.1,-8.8],[-13,-9.2]]]]},{"id":"way/1296455140","h":17,"rings":[[[[22.2,-2.4],[19.5,11.6],[17.5,11.2],[18.9,4.2],[20.2,-2.8],[22.2,-2.4]]]]},{"id":"way/1296464127","h":15,"rings":[[[[34.2,-21],[30.7,-3.1],[27.3,14.7],[23.7,33],[33.2,34.8],[33.3,34.2],[33.6,33.8],[34.1,33.4],[34.6,33.3],[35.1,33.3],[35.4,33.4],[37.6,22.1],[31.4,21.1],[32.4,15.6],[36.2,16.3],[39.6,-1.6],[35.5,-2.3],[36.5,-7.8],[43.2,-6.5],[45.1,-17.1],[44.6,-17.2],[44.1,-17.5],[43.8,-17.9],[43.6,-18.4],[43.5,-19],[43.6,-19.2],[34.5,-20.9],[34.2,-21]]]],"role":"front"},{"id":"way/1296464144","h":17,"rings":[[[[0.8,-25.3],[15,-22.6],[15.3,-24.5],[8.3,-25.9],[1.2,-27.2],[0.8,-25.3]]]]},{"id":"way/1297399177","h":17,"rings":[[[[33.1,33.7],[34.6,32.7],[36,24.8],[35,23.3],[27.5,21.9],[26,23],[24.5,30.8],[25.6,32.4],[33.1,33.7]]]]},{"id":"way/1297399178","h":24,"rings":[[[[36.2,16.3],[39.6,-1.6],[35.5,-2.3],[30.7,-3.1],[27.3,14.7],[32.4,15.6],[36.2,16.3]]]],"role":"portal"},{"id":"relation/19074575","h":20,"rings":[[[[4.9,29.4],[5.2,27.4],[-8.9,24.7],[-9.3,26.7],[-2.2,28.1],[4.9,29.4]]]]}]} as const

const SPEC: MadrasaSpec = {
  frontTile: true,
  name: "Ulugh Beg Madrasa", file: 'samarkand-ulugh-beg-madrasa.glb', defaultH: 13, minaretR: 2.1,
  portalH: {"way/1297399178": 28},
  square: DATA.square as unknown as XY, outline: DATA.outline as unknown as XY[][][], parts: DATA.parts as unknown as PartData[],
}

if (import.meta.main) await writeMadrasa(SPEC, { height: 33 })
