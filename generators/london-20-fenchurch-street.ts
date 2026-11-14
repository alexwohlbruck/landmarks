/**
 * 20 Fenchurch Street ("the Walkie-Talkie"), City of London — original
 * procedural geometry, CC0-1.0.
 * bun generators/london-20-fenchurch-street.ts
 *
 * Map frame turned to the building: +x is the east face's outward normal, +y
 * the north face's, z up, metres. BEARING 9.7 (the outline's straight north
 * and south edges run 9.7° clockwise of east-west; the parts come out
 * mirror-symmetric in x at exactly this bearing). Origin = centroid of the OSM
 * outline way/201247295.
 *
 * Evidence
 * - OSM way/201247295 (outline = the widest plan, at the top, "Sky Garden",
 *   37 levels, height 160) and its 3D parts way/949000145–949000356: one floor
 *   part plus two east/west strips per level band from 7.7 m to 150 m, and the
 *   stepped Sky Garden roof parts. Read in this frame (bin/frame.py):
 *     east/west faces convex in plan, a 3.5–4.2 m bulge about y = +2.2;
 *       x at the bulge 23.3 (13 m) → 26.4 (54) → 29.2 (100–115) → 28.3 (131);
 *     south face flares hard: y = -20.3 (13 m) → -22.0 (54) → -25.0 (85)
 *       → -27.2 (100) → -29.8 (115) → -32.8 (131) → -34.1 (top outline);
 *     north face flares less: 24.8 (13) → 27.2 (54) → 30.0 (100) → 31.8 (131)
 *       → 34.1 (top outline);
 *     north and south faces slightly concave in plan (0.7 m at the foot,
 *       2 m at the top).
 *   Roof parts: the glass roof rises from ~141 m at the south edge to ~160 m
 *   near y = +20 and falls to ~155 at the north edge; it is arched east-west.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (composite of flights to 2022; the tower was finished 2014). In this
 *   frame: roof plateau 163–164 m above ground_min, street 3.3–4.8 m above it,
 *   so the roof's high point is ~160 m above the street at y ≈ +20; 148–150 m at
 *   y = -30; east-west fall of ~4.5 m from the centre line to x = ±24.
 * - Published (Wikipedia, CTBUH): 160 m, 37/38 storeys, Rafael Viñoly, 2014;
 *   Sky Garden on the top three floors under a glazed roof facing south.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "20 Fenchurch St (Walkie-Talkie building) from Rood Ln, London, UK -
 *     Diliff.jpg", Diliff, CC BY-SA 3.0 — the east face's white fins and the
 *     south face's flare, from the south-east;
 *   "Walkie-Talkie, Londres, Inglaterra, 2014-08-11, DD 098.JPG", Diego Delso,
 *     CC BY-SA 4.0 — from the south bank, south (dark glass) and east (finned)
 *     faces;
 *   "20 Fenchurch Street Mars 2014.jpg", Arild Vågen, CC BY-SA 3.0 — the south
 *     face square-on, white frame and arched crown;
 *   "City of London as seen from The Shard, 2026.jpg", ThatsTheBoss, CC0 —
 *     from the south-south-west and above, the roof and the cluster behind;
 *   "London , Southwark - City of London from The Shard - geograph.org.uk -
 *     4828469.jpg", Lewis Clarke, CC BY-SA 2.0 — at night from the Shard;
 *   "City of London from Monument.jpg", VirtuallyLondonBecky, CC BY-SA 4.0.
 *
 * Measured: plan at every level (OSM parts), roof heights (OSM + lidar).
 * Published: 160 m, 37 storeys. Estimated: fin count (drawn as 30 a face, the
 * real face has many more, thinner), the 4.5 m east-west roof arch (lidar), the
 * entrance band (lobby glazing on the north, 8 m), the white corner frame
 * width (2.8 m, photos), the rounding of the crown corners (up to 6 m below
 * the plain arch at the south edge, from the Vågen and Delso photos), faint
 * floor lines every eight storeys on the dark faces. Not modelled: the ground-floor canopies.
 */
import { Part, writeGlb, addGltfTriangles, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 9.7
const ANCHOR = { lng: -0.0835443, lat: 51.5112527 }

const darkGlass = new Part() // north and south curtain walls
const paleGlass = new Part() // east and west faces between the fins
const alu = new Part() // white aluminium: fins, corner frames, roof rim
const roofGlass = new Part() // Sky Garden glazing
const lobby = new Part()

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
/** Piecewise-linear lookup in a [z, value] table. */
function table(t: [number, number][], z: number) {
  if (z <= t[0][0]) return t[0][1]
  for (let i = 1; i < t.length; i++) if (z <= t[i][0]) return lerp(t[i - 1][1], t[i][1], (z - t[i - 1][0]) / (t[i][0] - t[i - 1][0]))
  return t[t.length - 1][1]
}

// --- Plan as a function of height (OSM parts, see header) ---
const BULGE: [number, number][] = [[0, 23.3], [13, 23.3], [31, 24.5], [54, 26.4], [77, 28.1], [100, 29.2], [115, 29.2], [131, 28.4], [160, 28.9]]
const SAG: [number, number][] = [[0, 3.5], [131, 4.2], [160, 4.0]]
const SOUTH: [number, number][] = [[0, -20.3], [13, -20.3], [31, -20.8], [54, -22.0], [69, -23.3], [85, -25.0], [100, -27.2], [115, -29.8], [131, -32.8], [142, -34.1]]
const NORTH: [number, number][] = [[0, 24.8], [13, 24.8], [31, 25.7], [54, 27.2], [77, 28.7], [100, 30.0], [131, 31.8], [142, 33.6], [160, 34.1]]
const DIP: [number, number][] = [[0, 0.7], [131, 1.4], [160, 2.0]]

/**
 * A point of the plan at height z: u runs -1 (west face) to 1 (east face),
 * v runs 0 (south face) to 1 (north face). East and west faces are convex
 * arcs, north and south faces shallow concave ones.
 */
function plan(u: number, v: number, z: number): [number, number] {
  const ys = table(SOUTH, z), yn = table(NORTH, z), dip = table(DIP, z)
  const xb = table(BULGE, z), sag = table(SAG, z), xc = xb - sag
  const yc = 2.2, hy = Math.max(yn - yc, yc - ys)
  const X = (y: number) => xc + sag * Math.max(0, 1 - ((y - yc) / hy) ** 2)
  const Y = (x: number) => {
    const f = 1 - Math.min(1, (x / xc) ** 2)
    return lerp(ys + dip * f, yn - dip * f, v)
  }
  let y = lerp(ys, yn, v), x = u * X(y)
  for (let k = 0; k < 3; k++) {
    y = Y(x)
    x = u * X(y)
  }
  return [x, y]
}

/** The glazed Sky Garden roof: high near y = +20, down to ~141 m at the south edge, arched east-west. */
const ROOF_Y: [number, number][] = [[-35, 141], [-20, 148.5], [0, 155.5], [10, 158.6], [20, 160.3], [28, 158.8], [35, 155]]
// The crown: arched east-west, with the corners rounded down into the softer "handset" arch the
// south and north faces show (a steep x^8 term on top of the gentle x^2 arch).
const roofZ = (x: number, y: number) => {
  const f = (y + 34) / 68, u = Math.min(1, Math.abs(x) / 29.5)
  return table(ROOF_Y, y) - lerp(2.2, 4.5, f) * u ** 2 - lerp(6, 3.5, f) * u ** 8
}

// Ring samples: u across the north/south faces, v along the east/west faces.
// The outermost u steps are the white corner frames.
const U = [-1, -0.95, -0.9, -0.78, -0.6, -0.36, -0.12, 0.12, 0.36, 0.6, 0.78, 0.9, 0.95, 1]
const NV = 14
const V = Array.from({ length: NV + 1 }, (_, i) => i / NV)
const LEVELS = [0, 8, 20, 35, 50, 65, 80, 95, 110, 122, 132]
const TOPZ = 145 // the plan the top ring (under the roof) takes

/** The ring, anticlockwise from above: south (west→east), east (south→north), north, west. */
type RingPt = { u: number; v: number; face: 'S' | 'E' | 'N' | 'W' }
const RING: RingPt[] = [
  ...U.slice(0, -1).map((u) => ({ u, v: 0, face: 'S' as const })),
  ...V.slice(0, -1).map((v) => ({ u: 1, v, face: 'E' as const })),
  ...U.slice(1).reverse().map((u) => ({ u, v: 1, face: 'N' as const })),
  ...V.slice(1).reverse().map((v) => ({ u: -1, v, face: 'W' as const })),
]
const at = (p: RingPt, z: number, top = false): V3 => {
  const [x, y] = plan(p.u, p.v, top ? TOPZ : z)
  return [x, y, top ? roofZ(x, y) : z]
}

// --- Walls: loft ring by ring, painting each quad by its face ---
for (let k = 0; k < LEVELS.length; k++) {
  const z0 = LEVELS[k], last = k === LEVELS.length - 1
  const z1 = last ? TOPZ : LEVELS[k + 1]
  for (let i = 0; i < RING.length; i++) {
    const a = RING[i], b = RING[(i + 1) % RING.length]
    const face = a.face
    const corner = (face === 'S' || face === 'N') && (Math.abs(a.u) > 0.89 && Math.abs(b.u) > 0.89)
    let part = face === 'E' || face === 'W' ? paleGlass : darkGlass
    if (corner) part = alu
    else if (k === 0 && face === 'N') part = lobby
    else if (last && face === 'S') part = roofGlass // the Sky Garden's south glazing
    part.quad(at(a, z0), at(b, z0), at(b, z1, last), at(a, z1, last))
  }
}

// --- Roof: a grid over the top ring, glass with a white rim ---
{
  const grid = (iu: number, iv: number): V3 => {
    const [x, y] = plan(U[iu], V[iv], TOPZ)
    return [x, y, roofZ(x, y)]
  }
  for (let iu = 0; iu < U.length - 1; iu++)
    for (let iv = 0; iv < V.length - 1; iv++) {
      const rim = iu <= 1 || iu >= U.length - 3 || iv === 0 || iv === V.length - 2
      ;(rim ? alu : roofGlass).quad(grid(iu, iv), grid(iu + 1, iv), grid(iu + 1, iv + 1), grid(iu, iv + 1))
    }
  // Roof ribs: low white arches across the glass, east-west, the Sky Garden's frames.
  for (let iv = 2; iv < V.length - 2; iv += 2) {
    for (let iu = 0; iu < U.length - 1; iu++) {
      const a = grid(iu, iv), b = grid(iu + 1, iv)
      const w = 0.35, h = 0.5
      quadUp(alu, [a[0], a[1] - w, a[2]], [b[0], b[1] - w, b[2]], [b[0], b[1] - w, b[2] + h], [a[0], a[1] - w, a[2] + h])
      quadUp(alu, [b[0], b[1] + w, b[2]], [a[0], a[1] + w, a[2]], [a[0], a[1] + w, a[2] + h], [b[0], b[1] + w, b[2] + h])
      quadUp(alu, [a[0], a[1] - w, a[2] + h], [b[0], b[1] - w, b[2] + h], [b[0], b[1] + w, b[2] + h], [a[0], a[1] + w, a[2] + h])
    }
  }
}
function quadUp(p: Part, a: V3, b: V3, c: V3, d: V3) {
  p.quad(a, b, c, d)
}

// --- Fins: white aluminium ribs standing proud of the east and west faces ---
{
  const N = 30, W = 0.7, D = 0.9
  const zs = [0, 20, 35, 50, 65, 80, 95, 110, 122, 132, TOPZ]
  for (const side of [1, -1]) {
    for (let f = 0; f < N; f++) {
      const v = (f + 0.5) / N
      const sec = zs.map((z, k) => {
        const top = k === zs.length - 1
        const zz = top ? TOPZ : z
        const [x, y] = plan(side, v, zz)
        const [x2, y2] = plan(side, v + 0.01, zz)
        const tl = Math.hypot(x2 - x, y2 - y)
        const t: [number, number] = [(x2 - x) / tl, (y2 - y) / tl]
        const n: [number, number] = [t[1] * side, -t[0] * side] // outward
        const zt = top ? roofZ(x, y) - 0.4 : z
        const p = (s: number, d: number): V3 => [x + t[0] * s + n[0] * d, y + t[1] * s + n[1] * d, zt]
        return [p(-W / 2, -0.05), p(0, D), p(W / 2, -0.05)] // a sharp triangular rib
      })
      for (let k = 0; k < sec.length - 1; k++) {
        const r0 = sec[k], r1 = sec[k + 1]
        for (const [i, j] of [[0, 1], [1, 2]]) {
          // outward winding depends on the side: let the cross product decide
          const q: V3[] = [r0[i], r0[j], r1[j], r1[i]]
          const mid = [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2]
          const c = [(r0[0][0] + r0[2][0]) / 2, (r0[0][1] + r0[2][1]) / 2]
          const e1 = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], e2 = [q[3][0] - q[0][0], q[3][1] - q[0][1], q[3][2] - q[0][2]]
          const nx = e1[1] * e2[2] - e1[2] * e2[1], ny = e1[2] * e2[0] - e1[0] * e2[2]
          if (nx * (mid[0] - c[0]) + ny * (mid[1] - c[1]) >= 0) alu.quad(q[0], q[1], q[2], q[3])
          else alu.quad(q[0], q[3], q[2], q[1])
        }
      }
      // top cap
      const t = sec[sec.length - 1]
      alu.tri(t[0], t[1], t[2])
    }
  }
}

// --- Floor bands on the north and south faces: a pale line every four floors ---
{
  const storey = 152 / 38
  for (let z = 8 * storey + 8; z < 128; z += 8 * storey) {
    for (const v of [0, 1]) {
      for (let i = 1; i < U.length - 2; i++) {
        const ua = v === 0 ? U[i] : U[i + 1], ub = v === 0 ? U[i + 1] : U[i]
        const [xa, ya] = plan(ua, v, z), [xb, yb] = plan(ub, v, z)
        const [xa2, ya2] = plan(ua, v, z + 0.35), [xb2, yb2] = plan(ub, v, z + 0.35)
        const o = v === 0 ? -0.3 : 0.3
        alu.quad([xa, ya + o, z], [xb, yb + o, z], [xb2, yb2 + o, z + 0.35], [xa2, ya2 + o, z + 0.35])
      }
    }
  }
}

/** Smooth-shade a part across edges under `crease` degrees: curved walls weld to a few vertices. */
function smooth(p: Part, crease = 30): Part {
  const out = new Part()
  const n = p.pos.length / 3
  addGltfTriangles(out, new Float32Array(p.pos), Uint32Array.from({ length: n }, (_, i) => i), { creaseDegrees: crease })
  return out
}

const parts = [
  { part: smooth(darkGlass), material: PALETTE.window },
  { part: smooth(paleGlass), material: windowVariant(2, 0xb4c6d4) },
  { part: smooth(alu, 40), material: finish('aluminium', 0xe9ebea, 0.5) },
  { part: smooth(roofGlass), material: { ...PALETTE.glass, color: 0x8eaabd } },
  { part: lobby, material: PALETTE.entrance },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('20 Fenchurch Street', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 160.3,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/201247295', 'way/365920473', 'way/365920474', 'way/365920476', ...Array.from({ length: 212 }, (_, i) => `way/${949000145 + i}`)],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/london-20-fenchurch-street.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
