/**
 * Bailey Fountain, Grand Army Plaza, Brooklyn (Eugene Savage, sculptor;
 * Edgerton Swartwout, architect; 1932) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-bailey-fountain.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Bearing 0: the
 * group faces north (the "north side" photo shows Wisdom and Felicity
 * square on). Anchor: the centroid of the OSM pool way/109277725
 * (amenity=fountain, natural=water; not a building), so `replaces` is
 * empty. y = 0 is the water, ~0.8 m below the plaza's paving (lidar); the
 * water is the map's.
 *
 * Evidence
 * - Published (Wikipedia; NYC Parks): bronze, Art Deco; six figures: Wisdom
 *   (a man, his hand on the ship's tiller) and Felicity (a woman with a
 *   cornucopia) standing on top; below them a child shouldering the
 *   cornucopia and the laughing Nereus; at the sides two Nereids rising from
 *   the water blowing conches, their fish tails curling behind.
 * - OSM way/109277725: the pool, ~10 × 20 m, a teardrop drawn out to the
 *   north.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m: water ~0.15 m, the paving
 *   and kerb ~1.0–1.2 m; a central island ~5 × 9 m at 1.2–2 m; the group's
 *   returns sparse, to 5.8 m.
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-bailey-fountain/photos/credits.txt: Jim.henderson
 *   (CC BY-SA 3.0, the group from the north), GK tramrunner RU (CC BY-SA 4.0, the pool in
 *   the oval, from the west).
 *
 * Estimated from the photos against the lidar: the granite base (to 1.3 m)
 * on the island, the bronze rock-and-prow pedestal (to 2.8 m), the standing
 * pair (3.6 m), the child and Nereus below at the front, the Nereids at the
 * sides; the kerb round the pool, 0.5 m wide, 1.3 m over the water. The
 * jets, the shells and the dolphins' detail are left out.
 */
import { Part, type V3 } from './mesh'
import { finishModel, prism, chamferRect } from './nyc-570-lexington'
import { smooth, solid, tube, ellipsoid } from './nyc-columbus-monument'
import { robed, seated, ell } from './nyc-uss-maine-monument'

const kerb = new Part(), granite = new Part(), bronze = new Part()

// --- The pool's kerb, following the OSM outline, 0.5 m wide. ---
{
  const pool: [number, number][] = [[-2.9, 10.3], [-4.8, -0.1], [-3.3, -5.4], [-1.3, -7.9], [1.4, -8.7], [3.7, -7.3], [5.0, -4.2], [4.7, 1.2], [-0.7, 10.9], [-1.9, 11.1]]
  // Densify and offset outward along the averaged normals (ring is counter-clockwise).
  const n = pool.length, H = 1.3, W = 0.5
  const out = pool.map((b, i) => {
    const a = pool[(i + n - 1) % n], c = pool[(i + 1) % n]
    const u = [b[0] - a[0], b[1] - a[1]], v = [c[0] - b[0], c[1] - b[1]]
    const lu = Math.hypot(u[0], u[1]), lv = Math.hypot(v[0], v[1])
    const nx = u[1] / lu + v[1] / lv, ny = -u[0] / lu - v[0] / lv, l = Math.hypot(nx, ny)
    return [b[0] + (nx / l) * W, b[1] + (ny / l) * W] as [number, number]
  })
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const I = (p: [number, number], z: number): V3 => [p[0], p[1], z]
    kerb.quad(I(out[i], 0), I(out[j], 0), I(out[j], H), I(out[i], H)) // outer face
    kerb.quad(I(pool[j], 0), I(pool[i], 0), I(pool[i], H), I(pool[j], H)) // inner face
    kerb.quad(I(pool[i], H), I(out[i], H), I(out[j], H), I(pool[j], H)) // top
  }
}

// --- The granite base on the island. ---
const C: V3 = [-0.4, -1.4, 0]
prism({ wall: granite, win: null, roof: granite, ring: chamferRect(C[0] - 2.4, C[1] - 3.6, C[0] + 2.4, C[1] + 3.6, 1.2), z0: 0, z1: 0.9, facade: null, bevel: 0.15 })
prism({ wall: granite, win: null, roof: granite, ring: chamferRect(C[0] - 1.9, C[1] - 3.0, C[0] + 1.9, C[1] + 3.0, 1.0), z0: 0.9, z1: 1.3, facade: null, bevel: 0.12 })

smooth(bronze, q => {
  // The rock and ship's prow pedestal: a mound drawn out to a prow on the north.
  solid(q, [ell(C[0], C[1], 1.3, 1.65, 2.5, 14), ell(C[0], C[1] + 0.1, 2.3, 1.5, 2.3, 14), ell(C[0], C[1] + 0.1, 2.6, 1.3, 2.0, 14), ell(C[0], C[1] + 0.1, 2.8, 1.05, 1.6, 14)])
  tube(q, [[C[0], C[1] + 2.4, 1.4], [C[0], C[1] + 3.1, 2.2], [C[0], C[1] + 2.9, 2.9]], [0.45, 0.32, 0.2], 6)
  // Wisdom (west) and Felicity (east), standing side by side, facing north.
  const zT = 2.8, Hs = 3.6, mx = C[0] - 0.45, fx = C[0] + 0.45, yy = C[1] + 0.2
  // robed() faces −y: build each, then turn it 180° about its own axis to face north.
  const turn = (from: number, cx: number) => {
    for (let k = from; k < q.pos.length; k += 3) {
      q.pos[k] = 2 * cx - q.pos[k]; q.pos[k + 2] = -(2 * yy - -q.pos[k + 2])
      q.nrm[k] = -q.nrm[k]; q.nrm[k + 2] = -q.nrm[k + 2]
    }
  }
  let from = q.pos.length
  robed(q, [mx, yy, zT], Hs, [[[mx + 0.45, yy, zT + 2.9], [mx + 0.55, yy - 0.3, zT + 2.2], [mx + 0.5, yy - 0.5, zT + 1.8]]])
  turn(from, mx)
  from = q.pos.length
  robed(q, [fx, yy, zT], Hs, [[[fx - 0.45, yy, zT + 2.9], [fx - 0.6, yy - 0.35, zT + 2.4], [fx - 0.55, yy - 0.5, zT + 2.1]]])
  turn(from, fx)
  // Felicity's cornucopia, from her shoulder down to the child.
  tube(q, [[fx + 0.5, yy + 0.4, zT + 2.3], [fx + 0.9, yy + 0.9, zT + 1.3], [fx + 0.8, yy + 1.5, zT + 0.2]], [0.12, 0.3, 0.45], 7)
  // The tiller under Wisdom's hand.
  tube(q, [[mx - 0.55, yy + 0.5, zT + 1.7], [mx - 0.5, yy + 1.3, zT + 0.4]], [0.08, 0.1], 5)
  // The child shouldering the cornucopia, and Nereus, laughing, at the prow.
  robed(q, [C[0] + 0.75, C[1] + 1.9, 1.3], 1.6, [])
  seated(q, [C[0] - 0.6, C[1] + 1.9, 1.3], 1.2, 1.1, 1.6)
  // The two Nereids rising from the water at the sides, blowing conches,
  // their fish tails curling up behind.
  for (const s of [-1, 1]) {
    const x = C[0] + s * 2.9, y = C[1] - 0.6
    solid(q, [ell(x, y, 0.3, 0.45, 0.4, 8), ell(x + s * 0.1, y, 1.2, 0.36, 0.3, 8), ell(x + s * 0.2, y, 1.9, 0.38, 0.28, 8), ell(x + s * 0.2, y, 2.05, 0.15, 0.13, 8)])
    ellipsoid(q, [x + s * 0.25, y, 2.3], [0.18, 0.2, 0.22], 8, 4, 0, s * 0.4)
    tube(q, [[x + s * 0.15, y - 0.2, 1.95], [x + s * 0.05, y - 0.5, 2.35], [x - s * 0.05, y - 0.7, 2.75]], [0.08, 0.14, 0.22], 6)
    tube(q, [[x, y + 0.3, 0.3], [x - s * 0.3, y + 1.3, 0.9], [x - s * 0.2, y + 1.6, 1.9], [x + s * 0.2, y + 1.2, 2.4]], [0.35, 0.28, 0.2, 0.08], 6)
  }
}, 55)

finishModel('Bailey Fountain', 'nyc-bailey-fountain', [
  { part: kerb, material: { name: 'granite-kerb', color: 0xcfc6bb, roughness: 0.85 } },
  { part: granite, material: { name: 'granite', color: 0xb8aaa0, roughness: 0.85 } },
  { part: bronze, material: { name: 'bronze', color: 0x4f5a54, roughness: 0.65 } },
], { bearing: 0, osm: 'way/109277725', height: 6.4 }, 5000)
