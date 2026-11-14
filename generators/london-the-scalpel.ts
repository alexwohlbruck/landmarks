/**
 * The Scalpel (52 Lime Street), City of London — original procedural
 * geometry, CC0-1.0.
 * bun generators/london-the-scalpel.ts
 *
 * Map frame, unturned (the plan's long north and south edges run within 2° of
 * east-west): BEARING 0, +x east, +y north, z up, metres. Origin = centroid of
 * the OSM outline way/498820075.
 *
 * Evidence
 * - OSM way/498820075 (outline, "The Scalpel", 38 levels, 190 m) and its parts,
 *   mapped as planar facets (skillions) over a triangulated plan:
 *     way/659342597  NW triangle (-36.2,19.3) (18.1,18.4) (-19.8,-5.8): one
 *                    plane from the north edge at the ground up to 190 m at
 *                    the apex (-19.8,-5.8) — the great leaning facet;
 *     way/659342596  triangle (18.1,18.4) (-19.8,-5.8) (20.1,-5.2): from 47 m
 *                    at the north-east corner up to the 190 m ridge;
 *     way/659342599  the crest, 190 m at the apex falling to 150 m at the
 *                    south-west corner, facing SSE;
 *     way/659342598  the lower south-east crest, 164 m at (20.1,-5.2)
 *                    falling to 150 m on the south edge;
 *     way/659342595  the low curved block on the east, 47 m.
 *   OSM tags 596 and 599 as skillions level along (-19.8,-5.8)–(20.1,-5.2) at
 *   190 m, which would give a flat 40 m top. Every photo shows one sharp apex
 *   over the south-west wall: from the west (Cornhill) the north edge runs
 *   straight from the foot to the apex and the crest falls south to a kink on
 *   the right; from the north (The wub) the top is a point; from the Shard
 *   the crest is a pale ribbed plane falling east. So the crest is drawn as
 *   one plane through the apex (190 m) and the south corners (140 m SW,
 *   135 m SE, estimated from the Shard and Cornhill views: OSM says 150),
 *   folded once along apex–SE corner so its north-east corner drops to
 *   140 m, where the north-east facet (from 47 m) meets it.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0: the flight caught the site mid-construction (core at 180–190 m, the
 *   rest an excavation), so it confirms only the height; the street is ~17 m
 *   AOD, the plan is from OSM.
 * - Published (Wikipedia, CTBUH): 190 m, 38 storeys, Kohn Pedersen Fox, 2018;
 *   the angled faces keep views of the Tower of London clear.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "View of the Scalpel from Cornhill - geograph.org.uk - 7160553.jpg",
 *     Robert Lamb, CC BY-SA 2.0 — from the west: the apex at the north-west,
 *     the crest falling south, the near-vertical leaning north edge;
 *   "The Scalpel, August 2018.jpg", The wub, CC BY-SA 4.0 — from the north-
 *     west: the great triangular facet, its fold lines, the low east block;
 *   "The Scalpel, London.jpg", Maksim Sokolov, CC BY-SA 4.0 — the folds from
 *     below, the finned low block;
 *   "30 St Mary Axe & 52-54 Lime Street 2025-02-10.jpg", Tom Page,
 *     CC BY-SA 2.0 — the blue glass and the silver arrises;
 *   "City of London as seen from The Shard, 2026.jpg", ThatsTheBoss, CC0 —
 *     the crest from the south-south-west among its neighbours.
 *
 * Terrain: the map's Mapterhorn terrain still shows the construction dig
 * here — up to 14 m below the surrounding street (~15.5 m above the pit floor
 * on its 7 x 7 grid). `terrain.ts check` passes, but the map will stand the
 * tower on that pit and lift it only by the footprint's mean rise, so it may
 * draw some 7 m low until the terrain is refreshed. Per docs/evidence.md the
 * model is left true to the photos with elevation 0.
 *
 * Measured: plan and facet heights (OSM). Published: 190 m, 38 storeys.
 * Estimated: the two-storey (9 m) glazed base and a 3.5 m silver canopy over
 * the Leadenhall Street entrance, faint floor lines every four storeys (20 m),
 * bevelled (octagonal) silver arrises 1 m wide on every fold, five ribs on the
 * pale crest screen, deeper blue glass (#7d9cba) from the 2018 photos pulled
 * to palette lightness, the east block's fins (2.5 m apart). Doubt: OSM's north facet reaching the ground at the north edge is
 * taken as mapped; photos from the north-west agree it is one great
 * triangular plane, but its foot may be a storey or two up.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 0
const ANCHOR = { lng: -0.081058, lat: 51.5132411 }

const glass = new Part()
const trim = new Part()
const lowGlass = new Part()
const lobby = new Part()
const crestP = new Part() // the crest's pale screen
const lines = new Part() // faint floor lines

type Vec = V3
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add = (a: Vec, b: Vec, s = 1): Vec => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s]
const crossV = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: Vec): Vec => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

// Centre of the mass, for winding every face outward.
const C: Vec = [0, 0, 80]
function triOut(p: Part, a: Vec, b: Vec, c: Vec, inside: Vec = C) {
  const n = crossV(sub(b, a), sub(c, a))
  const m: Vec = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, (a[2] + b[2] + c[2]) / 3]
  if (dot(n, sub(m, inside)) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
const quadOut = (p: Part, a: Vec, b: Vec, c: Vec, d: Vec, inside: Vec = C) => { triOut(p, a, b, c, inside); triOut(p, a, c, d, inside) }

/** A rectangular member from a to b, w across and d deep along `out`. */
function beam(p: Part, a: Vec, b: Vec, out: Vec, w: number, d: number) {
  const dir = unit(sub(b, a)), s = unit(crossV(dir, out)), n = unit(crossV(s, dir))
  const c = (o: Vec, i: number, j: number): Vec => { const q = add(add(o, s, (i * w) / 2), n, (j * d) / 2); return [q[0], q[1], Math.max(0, q[2])] } // nothing below the ground
  const ring = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  const mid = add(a, sub(b, a), 0.5)
  for (let k = 0; k < 4; k++) {
    const [i0, j0] = ring[k], [i1, j1] = ring[(k + 1) % 4]
    quadOut(p, c(a, i0, j0), c(a, i1, j1), c(b, i1, j1), c(b, i0, j0), mid)
  }
}

/** A member with a chamfered (octagonal) section, so fold lines catch a highlight. */
function beam8(p: Part, a: Vec, b: Vec, out: Vec, w: number, d: number) {
  const dir = unit(sub(b, a)), s = unit(crossV(dir, out)), n = unit(crossV(s, dir))
  const cw = w * 0.3, cd = d * 0.3
  const sec: [number, number][] = [[-w / 2 + cw, -d / 2], [w / 2 - cw, -d / 2], [w / 2, -d / 2 + cd], [w / 2, d / 2 - cd], [w / 2 - cw, d / 2], [-w / 2 + cw, d / 2], [-w / 2, d / 2 - cd], [-w / 2, -d / 2 + cd]]
  const c = (o: Vec, [i, j]: [number, number]): Vec => { const q = add(add(o, s, i), n, j); return [q[0], q[1], Math.max(0, q[2])] }
  const mid = add(a, sub(b, a), 0.5)
  for (let k = 0; k < 8; k++) {
    const u = sec[k], v = sec[(k + 1) % 8]
    quadOut(p, c(a, u), c(a, v), c(b, v), c(b, u), mid)
  }
}

// --- Key points (OSM, this frame) ---
const N1: Vec = [-36.2, 19.3, 0] // north-west foot of the great facet
const N2: Vec = [18.1, 18.4, 0] // north-east corner
const N2h: Vec = [18.1, 18.4, 47] // ... where the upper facet starts, on the low block
const A: Vec = [-19.8, -5.8, 190] // the apex, over the south-west wall
const S1: Vec = [-7.3, -25.0, 140] // south-west corner of the crest
const S2: Vec = [21.7, -24.8, 135] // south-east corner of the crest
const g = (p: Vec, z = 0): Vec => [p[0], p[1], z]

// The crest is one plane through the apex and the two south corners, so the top is a single
// sharp point and every other corner of it lies below the apex.
const crest = (() => {
  const n = crossV(sub(S1, A), sub(S2, A))
  return (x: number, y: number) => A[2] - (n[0] * (x - A[0]) + n[1] * (y - A[1])) / n[2]
})()
const on = (x: number, y: number): Vec => [x, y, crest(x, y)]
// The crest folds again along A–S2: its eastern triangle drops to B, so from the north the
// top is a sharp point too (The wub's photo), not a level 40 m edge.
const B: Vec = [20.1, -5.2, 140] // east end of the crest, where the north-east facet meets it
const S1b = on(-4.5, -23.1)
const E1: Vec = [21.1, -17.2, 135 + (140 - 135) * ((-17.2 + 24.8) / (-5.2 + 24.8))]

// --- Facets ---
triOut(glass, N1, N2, A) // the great leaning facet (way/659342597)
triOut(glass, N2h, B, A) // upper north-east facet (way/659342596)
triOut(glass, N2, N2h, A, [10, 0, 60]) // the small fold between them
// The crest (ways 659342599/598 as one plane): a pale ribbed screen in the photos.
triOut(crestP, A, B, E1, [0, -5, 100])
triOut(crestP, A, E1, S2, [0, -5, 100])
quadOut(crestP, A, S2, S1b, S1, [0, -5, 100])
// Walls
triOut(glass, N1, g(A), A) // west: under the great facet's edge
quadOut(glass, g(A), g(S1), S1, A) // south-west wall
quadOut(glass, g(S1), g(S1b), S1b, S1)
quadOut(glass, g(S1b), g(S2), S2, S1b) // south wall
quadOut(glass, g(S2), g(E1), E1, S2) // east walls above the low block
quadOut(glass, g(E1, 47), g(B, 47), B, E1)
quadOut(glass, g(B, 47), g(N2, 47), N2h, B) // under the upper facet's east edge

// Crest ribs: the screen's frames run up the slope, bold enough to read.
{
  const n0 = unit(crossV(sub(S1, A), sub(S2, A))), n: Vec = n0[2] < 0 ? [-n0[0], -n0[1], -n0[2]] : n0
  const lift = (p: Vec, d: number): Vec => add(p, n, d)
  for (let k = 1; k < 6; k++) {
    const t = k / 6
    // from the apex edge (A–B) down to the south edge (S1–S2)
    const top = A, bot = add(S1, sub(S2, S1), t) // ribs fan from the apex down the western crest plane
    beam8(trim, lift(top, 0.3), lift(bot, 0.3), n, 0.6, 0.5)
  }
}

// Glazed base: the lobby, two storeys on the south, south-west and west walls, and a canopy.
{
  const o = 0.08
  const band = (a: Vec, b: Vec, h: number) => {
    const d = unit(sub(b, a)), n: Vec = [d[1], -d[0], 0] // outward for these walls (anticlockwise ring)
    quadOut(lobby, add(g(a, 0), n, o), add(g(b, 0), n, o), add(g(b, h), n, o), add(g(a, h), n, o))
  }
  band(N1, A, 9)
  band(A, S1, 9)
  band(S1, S1b, 9)
  band(S1b, S2, 9)
  // a thin silver canopy over the Leadenhall Street entrance, 3.5 m deep
  const d = unit(sub(S2, S1b)), n: Vec = [d[1], -d[0], 0]
  const a0 = add(g(S1b, 9.2), d, 3), a1 = add(g(S2, 9.2), d, -3)
  const q = (p: Vec, out: number, z: number): Vec => [p[0] + n[0] * out, p[1] + n[1] * out, z]
  const box: Vec[] = [q(a0, 0, 9.2), q(a1, 0, 9.2), q(a1, 3.5, 9.2), q(a0, 3.5, 9.2)]
  const top = box.map((p) => [p[0], p[1], 9.9] as Vec)
  const mid: Vec = [(a0[0] + a1[0]) / 2 + n[0] * 1.7, (a0[1] + a1[1]) / 2 + n[1] * 1.7, 9.5]
  quadOut(trim, top[0], top[1], top[2], top[3], mid)
  quadOut(trim, box[0], box[1], box[2], box[3], mid)
  for (let i = 0; i < 4; i++) quadOut(trim, box[i], box[(i + 1) % 4], top[(i + 1) % 4], top[i], mid)
}

// --- Silver arrises on every fold and corner: bevelled members ---
{
  const W = 1.0, D = 0.7
  const outOf = (a: Vec, b: Vec): Vec => { const m = add(a, sub(b, a), 0.5); return unit([m[0] - C[0], m[1] - C[1], (m[2] - C[2]) * 0.3]) }
  const pairs: [Vec, Vec][] = [
    [N1, A], [N2, A], [N2h, B], [A, B], [A, S1], [A, S2], [B, E1], [E1, S2], [S1, S1b], [S1b, S2],
    [N1, N2], [g(A), A], [g(S1), S1], [g(S2), S2], [N2, N2h],
  ]
  for (const [a, b] of pairs) beam8(trim, a, b, outOf(a, b), W, D)
}

// --- Floor lines every four storeys: contour strips across each glass face ---
{
  const faces: Vec[][] = [
    [N1, N2, A], [N2h, B, A],
    [g(A), g(S1), S1, A], [g(S1b), g(S2), S2, S1b], [g(S2), g(E1), E1, S2], [N1, g(A), A],
  ]
  const STEP = 20
  for (const f of faces) {
    const n0 = unit(crossV(sub(f[1], f[0]), sub(f[2], f[0])))
    const n: Vec = dot(n0, sub(f[0], C)) < 0 ? [-n0[0], -n0[1], -n0[2]] : n0
    for (let z = STEP; z < 190; z += STEP) {
      // segment where the plane z cuts the polygon
      const pts: Vec[] = []
      for (let i = 0; i < f.length; i++) {
        const a = f[i], b = f[(i + 1) % f.length]
        if ((a[2] - z) * (b[2] - z) < 0) {
          const t = (z - a[2]) / (b[2] - a[2])
          pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z])
        }
      }
      if (pts.length !== 2) continue
      // the strip runs up the face from the cut, 0.7 m, lifted off the glass
      const up = unit(sub([0, 0, 1], [n[0] * n[2], n[1] * n[2], n[2] * n[2]]))
      const lift = (p: Vec, k: number): Vec => add(add(p, up, k * 0.4), n, 0.06)
      quadOut(lines, lift(pts[0], 0), lift(pts[1], 0), lift(pts[1], 1), lift(pts[0], 1), add(pts[0], n, -5))
    }
  }
}

// --- The low east block (way/659342595): curved glass with silver fins ---
{
  const ring: [number, number][] = [[18.1, 18.4], [20.1, -5.2], [21.1, -17.2], [22.0, -17.2], [22.2, -10.7], [23.2, -3.9], [25.0, 7.1], [26.5, 17.3]]
  const H = 47
  const inside: Vec = [21.5, 2, 20]
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    quadOut(lowGlass, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], H], [a[0], a[1], H], inside)
  }
  // roof (fan from the inside point; the ring is convex enough)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    triOut(trim, [inside[0], inside[1], H], [a[0], a[1], H], [b[0], b[1], H], [inside[0], inside[1], 0])
  }
  // fins on the curved east face, every ~2.5 m
  const east = ring.slice(2).concat([ring[0]])
  for (let i = 1; i < east.length - 1; i++) {
    const a = east[i], b = east[i + 1]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / 2.5))
    const nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) / n, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t
      beam(trim, [x + nx * 0.5, y + ny * 0.5, 0], [x + nx * 0.5, y + ny * 0.5, H + 1], [nx, ny, 0], 0.35, 1.0)
    }
  }
}

const parts = [
  { part: glass, material: windowVariant(2, 0x7d9cba) },
  { part: crestP, material: finish('crest-screen', 0xc6d2db, 0.5) },
  { part: lines, material: finish('floor-line', 0xa3b7c9, 0.4) },
  { part: trim, material: finish('silver', 0xdfe3e6, 0.5) },
  { part: lowGlass, material: PALETTE.window },
  { part: lobby, material: PALETTE.entrance },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('The Scalpel', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 190.3,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/498820075', 'way/659342595', 'way/659342596', 'way/659342597', 'way/659342598', 'way/659342599'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/london-the-scalpel.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
