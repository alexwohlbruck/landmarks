/**
 * City Hall (the former Greater London Authority building, 110 The Queen's
 * Walk), Southwark — original procedural geometry, CC0-1.0.
 * bun generators/london-city-hall.ts
 *
 * Map frame, unturned (BEARING 0): +x east, +y north, z up, metres. Origin =
 * centroid of the OSM outline way/8877349. The building leans south: its
 * plan's centre moves 15.5 m south from the ground floor to the top.
 *
 * Evidence
 * - OSM way/8877349 (outline, building=construction, wikidata Q1093950) and
 *   its eleven floor parts way/121244488 (0–4 m), 121244486, 121249822,
 *   121249826, 121249829, 121249833, 121249834, 121249825, 1127933544,
 *   1127933542, 1127933543 (40–45 m), each a near-ellipse. Read in this frame
 *   (LEVELS: centre y, half-widths): the ground floor r 20 at y = +4.3, the
 *   widest floors r 24.3 at 12–20 m, the top r 15 at y = -11.3. The north
 *   edge falls back from y = 27.1 (4–8 m) to 3.7 (top); the south edge runs
 *   out from -15.7 (ground floor) to -27.5 (28–36 m), the stepped overhang.
 *   Plus 86 small parts way/1408628057–1408628142 (the north face's glazing
 *   panels, 8–41 m), all inside the outline.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (flights before the 2024–26 strip-out): street 4.2 m (north) to
 *   5.5 m (south) above ground_min; the top a sloped plane, 44.5–45.4 m above
 *   the street over its south half, falling to 41 m at its north edge; the
 *   north face steps back to 37 m at y = 9 and 32 m at y = 15.
 * - Published: 45 m, 10 storeys, Foster + Partners, 2002 (Wikipedia).
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "London City Hall.jpg", Garry Knight, CC BY-SA 2.0 — from the west: the
 *     lean, the south overhangs as stacked bands, the sloped top;
 *   "City Hall, London.jpg", DaringDonna, CC BY-SA 4.0 — the north face from
 *     the river: the band of triangular panels stepping up the middle, the
 *     floor bands either side, the recessed glazed ground floor;
 *   "Ayuntamiento y Shard, Londres, Inglaterra, 2014-08-11, DD 076.JPG",
 *     Diego Delso, CC BY-SA 4.0 — distant, from the north-west across the
 *     river: the whole silhouette;
 *   "London City Hall and Tower Bridge.jpg", Băng Tỏa, CC BY-SA 4.0 — at
 *     night, from the south-west: lit floor bands;
 *   "Former London City Hall 2026-05-17.jpg", The wub, CC BY-SA 4.0 — the
 *     building stripped to its frame for conversion (see doubts).
 *
 * Measured: every floor's plan (OSM), the top's slope and the north face's
 * heights (lidar). Published: 45 m, 10 storeys. Estimated: the 0.8 m tuck of
 * each floor's glazing under the slab above, the slab bands' 0.5 m depth, the
 * triangular-panel band's extent (from the DaringDonna photo: 42°–114° round
 * from east, its east edge stepping 1.4° a floor), the top floor rounding
 * over 2.6 m inside its OSM plate to the roof rim, the diagrid's
 * spacing (drawn twice as coarse as the real panels), the glass colour.
 * Doubts: the 2026 photo shows the glass removed and the building cut back
 * to its concrete core and floor plates for conversion; OSM tags it
 * building=construction. The model shows the finished glass building, as it
 * stood 2002–2024, which is how it is known.
 */
import { Part, writeGlb, addGltfTriangles, cross, sub, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 0
const ANCHOR = { lng: -0.0786532, lat: 51.5048064 }

/** Floor parts: [z0, z1, cx, cy, rx, ry], from the OSM polygons' extents. */
const LEVELS_STREET: [number, number, number, number, number, number][] = [
  [0, 4, -0.15, 4.3, 19.95, 20.0],
  [4, 8, 0.3, 4.3, 23.0, 22.8],
  [8, 12, 0.0, 1.8, 24.2, 24.1],
  [12, 16, 0.0, 0.55, 24.4, 24.25],
  [16, 20, 0.0, -0.55, 24.2, 24.05],
  [20, 24, -0.1, -2.65, 23.7, 23.55],
  [24, 28, -0.2, -4.4, 22.7, 22.5],
  [28, 32, -0.2, -6.6, 21.0, 20.9],
  [32, 36, -0.2, -8.95, 18.7, 18.55],
  [36, 40, -0.2, -10.8, 16.4, 16.3],
  [40, 45, -0.5, -11.25, 15.0, 14.95],
]
/**
 * Map terrain under the footprint sits 1.9–3.7 m above its lowest point (a
 * cell at the north-west corner, by the river wall and the Scoop), so y = 0
 * falls about 2.2 m below the street the building stands on. Every floor is
 * lifted by BASE and the glazed lobby runs down to y = 0, so the full height
 * stands above the street where the map puts it.
 */
const BASE = 2.2
const LEVELS = LEVELS_STREET.map(([z0, z1, ...r], k) => [k === 0 ? 0 : z0 + BASE, z1 + BASE, ...r] as [number, number, number, number, number, number])
/** The top: a plane falling to the north, 46 m at the south edge, 41.5 m at the north edge (lidar). */
const roofZ = (y: number) => BASE + 46 - 0.15 * (y + 26.2)

const N = 48
const TH = Array.from({ length: N }, (_, i) => (2 * Math.PI * i) / N)
const ring = (k: number, z: number | ((y: number) => number), inset = 0): V3[] => {
  const [, , cx, cy, rx, ry] = LEVELS[k]
  return TH.map((t) => {
    const x = cx + (rx - inset) * Math.cos(t), y = cy + (ry - inset) * Math.sin(t)
    return [x, y, typeof z === 'number' ? z : z(y)] as V3
  })
}
const reach = (p: V3, i: number) => p[0] * Math.cos(TH[i]) + p[1] * Math.sin(TH[i])

const glass = new Part()
const steel = new Part() // slab edges, soffits, roof rim
const frame = new Part() // the triangular panels' dark steel frames
const atriumGlass = new Part()
const lobby = new Part()
const roof = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function quadOut(p: Part, a: V3, b: V3, c: V3, d: V3, hint: V3) {
  const n = cross(sub(c, a), sub(d, b))
  if (dot(n, hint) >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}
const radial = (i: number): V3 => [Math.cos(TH[i] + Math.PI / N), Math.sin(TH[i] + Math.PI / N), 0]

/** Is ring index i inside the triangular-panel band on level k? */
function atrium(k: number, i: number) {
  if (k < 1) return false
  const deg = ((TH[i] + Math.PI / N) * 180) / Math.PI
  return deg > 42 + 1.4 * (k - 1) && deg < 114
}

const SLAB = 0.5, TUCK = 0.8
const tops: V3[][] = [] // each level's outer ring at its top
for (let k = 0; k < LEVELS.length; k++) {
  const [z0, z1] = LEVELS[k]
  const last = k === LEVELS.length - 1
  const T = ring(k, last ? roofZ : z1, last ? 2.6 : 0) // the top floor rounds over to a smaller roof
  const Tlow = T.map((p) => [p[0], p[1], p[2] - SLAB] as V3)
  tops.push(T)
  if (k === 0) {
    // Recessed glazed ground floor under the first overhang.
    const B = ring(0, 0, 1.0), U = ring(0, z1, 1.0)
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N
      quadOut(lobby, B[i], B[j], U[j], U[i], radial(i))
      quadOut(steel, U[i], U[j], T[j], T[i], [0, 0, -1]) // the lobby's ceiling edge
    }
    continue
  }
  const P = tops[k - 1]
  // The glazing's foot: tucked in under the outer of this floor and the one below.
  const B = T.map((t, i) => {
    const outer = reach(P[i], i) > reach(t, i) ? P[i] : t
    const d = Math.hypot(outer[0], outer[1]) || 1
    return [outer[0] - (outer[0] / d) * TUCK, outer[1] - (outer[1] / d) * TUCK, z0] as V3
  })
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    if (atrium(k, i)) {
      // continuous glazing from the floor below's edge to this floor's
      const a: V3 = [P[i][0], P[i][1], z0], b: V3 = [P[j][0], P[j][1], z0]
      quadOut(atriumGlass, a, b, T[j], T[i], radial(i))
      continue
    }
    // ledge (up) or soffit (down) at the floor line, between the slab below and this floor's foot
    const a: V3 = [P[i][0], P[i][1], z0], b: V3 = [P[j][0], P[j][1], z0]
    const over = reach(B[i], i) + reach(B[j], j) > reach(a, i) + reach(b, j)
    quadOut(steel, a, b, B[j], B[i], [0, 0, over ? -1 : 1])
    quadOut(glass, B[i], B[j], Tlow[j], Tlow[i], radial(i))
    quadOut(steel, Tlow[i], Tlow[j], T[j], T[i], radial(i))
  }
  // Where the band meets ordinary floors, close the side of the step.
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    if (atrium(k, i) === atrium(k, j)) continue
    const v = j
    const a: V3 = [P[v][0], P[v][1], z0]
    const hint: V3 = atrium(k, i) ? [-Math.sin(TH[v]), Math.cos(TH[v]), 0] : [Math.sin(TH[v]), -Math.cos(TH[v]), 0]
    steel.tri(...wind([a, B[v], Tlow[v]], hint))
    steel.tri(...wind([a, Tlow[v], T[v]], hint))
  }
}
function wind(t: [V3, V3, V3], hint: V3): [V3, V3, V3] {
  return dot(cross(sub(t[1], t[0]), sub(t[2], t[0])), hint) >= 0 ? t : [t[0], t[2], t[1]]
}

// --- The sloped top, with a slim rim ---
{
  const T = tops[tops.length - 1]
  const [, , cx, cy] = LEVELS[LEVELS.length - 1]
  const inner = ring(LEVELS.length - 1, (y) => roofZ(y) + 0.6, 1.2)
  const c: V3 = [cx, cy, roofZ(cy) + 0.6]
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    quadOut(steel, T[i], T[j], [T[j][0], T[j][1], T[j][2] + 0.6], [T[i][0], T[i][1], T[i][2] + 0.6], radial(i))
    quadOut(steel, [T[i][0], T[i][1], T[i][2] + 0.6], [T[j][0], T[j][1], T[j][2] + 0.6], inner[j], inner[i], [0, 0, 1])
    roof.tri(...wind([inner[i], inner[j], c], [0, 0, 1]))
  }
}

// --- Diagrid over the triangular-panel band: two panels a floor, both ways ---
{
  const W = 0.26, OFF = 0.06
  for (let k = 1; k < LEVELS.length; k++) {
    const [z0] = LEVELS[k]
    const P = tops[k - 1], T = tops[k]
    const at = (u: number, v: number): V3 => {
      // u: ring index (fractional), v: 0 at the floor below's edge, 1 at this floor's top
      const i = Math.floor(u) % N, j = (i + 1) % N, f = u - Math.floor(u)
      const lo: V3 = [P[i][0] * (1 - f) + P[j][0] * f, P[i][1] * (1 - f) + P[j][1] * f, z0]
      const hi: V3 = [T[i][0] * (1 - f) + T[j][0] * f, T[i][1] * (1 - f) + T[j][1] * f, T[i][2] * (1 - f) + T[j][2] * f]
      const p: V3 = [lo[0] + (hi[0] - lo[0]) * v, lo[1] + (hi[1] - lo[1]) * v, lo[2] + (hi[2] - lo[2]) * v]
      const t = TH[i] + (Math.PI * 2 * f) / N
      return [p[0] + Math.cos(t) * OFF, p[1] + Math.sin(t) * OFF, p[2]]
    }
    for (let i = 0; i < N; i++) {
      if (!atrium(k, i)) continue
      for (const [u0, u1] of [[i, i + 1], [i + 1, i]]) {
        for (let s = 0; s < 2; s++) {
          const v0 = s / 2, v1 = (s + 1) / 2
          const ua = u0 + (u1 - u0) * v0, ub = u0 + (u1 - u0) * v1
          const dw = W / (2 * Math.PI * 22 / N)
          const a = at(ua - dw, v0), b = at(ua + dw, v0), c = at(ub + dw, v1), d = at(ub - dw, v1)
          quadOut(frame, a, b, c, d, radial(i))
        }
      }
      // a slim floor line across the band
      const a = at(i, 0), b = at(i + 1, 0), c = at(i + 1, 0.06), d = at(i, 0.06)
      quadOut(frame, a, b, c, d, radial(i))
    }
  }
}

function smooth(p: Part, crease: number): Part {
  const out = new Part()
  const n = p.pos.length / 3
  addGltfTriangles(out, new Float32Array(p.pos), Uint32Array.from({ length: n }, (_, i) => i), { creaseDegrees: crease })
  return out
}

const parts = [
  { part: smooth(glass, 25), material: { ...PALETTE.window, color: 0x7d93a1 } },
  { part: smooth(atriumGlass, 25), material: windowVariant(2, 0x9db5c4) },
  { part: smooth(steel, 25), material: finish('steel', 0xb7bec2, 0.5) },
  { part: frame, material: finish('steel-dark', 0x5b646b, 0.5) },
  { part: lobby, material: PALETTE.entrance },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const PANELS = Array.from({ length: 86 }, (_, i) => `way/${1408628057 + i}`)
const glb = writeGlb('City Hall', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: BASE + 46.6,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/8877349', 'way/121244488', 'way/121244486', 'way/121249822', 'way/121249826', 'way/121249829', 'way/121249833', 'way/121249834', 'way/121249825', 'way/1127933544', 'way/1127933542', 'way/1127933543', ...PANELS],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/london-city-hall.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
