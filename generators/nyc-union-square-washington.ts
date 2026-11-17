/**
 * Equestrian statue of George Washington, Union Square, Manhattan (Henry
 * Kirke Brown, 1856; pedestal by Richard Upjohn) — procedural, CC0-1.0, no
 * textures.
 * bun generators/nyc-union-square-washington.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 29°, the axis of the park through this statue, the Independence
 * Flagstaff and the Lincoln statue (OSM node/424555887 → way/1112132914 →
 * node/1251605864, 28.7–28.8°). Model −y is the front: Washington rides
 * south-south-west toward 14th Street. Anchor: OSM node/424555887
 * (historic=memorial, memorial=statue); it is a node, not a building, so
 * `replaces` is empty. It sits at the centre of the round railed garden
 * way/1112132895 (about 11.4 m across), which the map draws.
 *
 * Evidence
 * - Published (Wikipedia, "Equestrian statue of George Washington (New York
 *   City)", from NYC Parks): sculpture 26'4" by 13'6" (read as overall
 *   height 8.03 m and length 4.11 m); Barre granite pedestal 12'2" by 7'9"
 *   by 15' (read as 3.71 m high, 2.36 m wide, 4.57 m long, taken at the
 *   cap). 12'2" + 14'2" of bronze = 26'4", which is what makes this reading
 *   hang together.
 * - Lidar USGS 3DEP NY_NewYorkCity (2017), 0.5 m: bronze and granite
 *   returns are sparse under the trees; the highest return over the statue
 *   is ~7 m above the garden, consistent with 8.0 m. Not used for shape.
 * - Photos (Wikimedia Commons), each opened and compared:
 *   Beyond My Ken, "Washington equestrian statue Union Square.jpg" (CC BY-SA
 *   4.0, front-left: round-ended pedestal, torus band, cap); Shankbone,
 *   "Henry Kirke Brown George Washington statue by David Shankbone.jpg" (CC
 *   BY-SA 3.0, from above, south-west); Martin Furtschegger, "George
 *   Washington hoch zu Ross am Union Square - panoramio.jpg" (CC BY 3.0, the
 *   horse's left side: pose read from it); Artprof23, "Nyc union square
 *   equestrian statue of george washington nov.2024.jpg" (CC0, left side);
 *   Rorschach, "Equestrian statue of George Washington - July 2026 (close
 *   up).jpg" (CC BY 4.0, head on); Aude, "Union square statue.jpg" (CC BY-SA
 *   2.5, front-left); Another Believer, "George Washington in Union Square
 *   New York City, May 2014 - 018.jpg" (CC BY-SA 4.0); Tdorante10, "Union
 *   Square td 30.jpg" (CC BY-SA 4.0, from the south plaza).
 *
 * Pose (read from the left-side photos at ~5.7 mm a pixel, scaled to the
 * published 4.3 m of bronze): the horse walks collected, its near (left,
 * +x) fore raised with the forearm level and the cannon hanging, the off
 * fore planted, the near hind stepping under, the off hind back; a thick
 * arched neck with the head tucked behind the vertical; a long tail hanging
 * from a raised dock. Washington sits upright, bareheaded, his right arm
 * (−x) raised forward and out over the horse's head, palm open; his left
 * hand low with the reins; a cloak rolled behind the saddle.
 *
 * Heights here: pedestal 3.71 m, bronze plate to 3.83 m, Washington's head
 * 7.9 m (the published 8.03 m), the raised hand 8.4 m.
 *
 * Night: unlit. No open night photo shows floodlighting; the park's globe
 * lamps around the garden are the map's, not the statue's.
 *
 * Estimated: every bronze dimension (from photos, not measured); the
 * pedestal's mouldings and the split of its 3.71 m; the base widths (no
 * published figure); the rear of the pedestal (no open photo from the
 * north; drawn round like the front, as the plan in the aerial-ish
 * Shankbone photo suggests). Left out: the small flank blocks low on the
 * pedestal's long sides, the groove where the round ends meet the flat
 * sides, the sword, bridle and stirrups.
 */
import { Part, type V3 } from './mesh'
import { finishModel, prism } from './nyc-570-lexington'
import { smooth, solid, tube, ellipsoid } from './nyc-columbus-monument'
import { ell } from './nyc-uss-maine-monument'

/** A round-ended (stadium) ring: half-width w, half-length l along y, n points per end. */
function stadium(w: number, l: number, n = 8): [number, number][] {
  const pts: [number, number][] = []
  for (let i = 0; i <= n; i++) { const a = Math.PI + (Math.PI * i) / n; pts.push([w * Math.cos(a), -(l - w) + w * Math.sin(a)]) }
  for (let i = 0; i <= n; i++) { const a = (Math.PI * i) / n; pts.push([w * Math.cos(a), (l - w) + w * Math.sin(a)]) }
  return pts
}

function build() {
  const granite = new Part(), bronze = new Part()
  const pr = (w: number, l: number, z0: number, z1: number, bevel = 0.05) =>
    prism({ wall: granite, win: null, roof: granite, ring: stadium(w, l), z0, z1, facade: null, bevel })

  // --- The granite pedestal: plinth, base moulding, dado, torus band,
  // shaft, bed moulding and cap; 3.71 m in all, 2.36 × 4.56 m at the cap.
  pr(1.32, 2.42, 0, 0.26, 0.06)
  pr(1.22, 2.32, 0.26, 0.46, 0.08)
  pr(1.12, 2.22, 0.46, 1.55, 0.03)
  pr(1.17, 2.27, 1.55, 1.7, 0.06)
  pr(1.07, 2.17, 1.7, 3.3, 0.03)
  pr(1.12, 2.22, 3.3, 3.44, 0.04)
  pr(1.18, 2.28, 3.44, 3.71, 0.07)

  smooth(bronze, q => {
    // Bronze ground plate on the cap.
    const zb = 3.83
    solid(q, [ell(0, 0.05, 3.71, 0.95, 2.1, 16), ell(0, 0.05, zb, 0.95, 2.1, 16)])
    const H = (x: number, y: number, z: number): V3 => [x, y, zb + z]

    // The horse, head toward −y. Barrel from chest to rump, the neck rising
    // in an arch to the poll, the head tucked down and back.
    tube(q, [H(0, -1.5, 2.0), H(0, -1.2, 1.98), H(0, -0.4, 1.86), H(0, 0.6, 1.9), H(0, 1.25, 2.0), H(0, 1.55, 2.02)], [0.3, 0.46, 0.47, 0.46, 0.42, 0.24], 12)
    tube(q, [H(0, -0.8, 2.1), H(0, -1.2, 2.82), H(0, -1.55, 3.42), H(0, -1.86, 3.66)], [0.42, 0.34, 0.24, 0.17], 10)
    // The crest bulging up and forward over the arch, and the deep chest.
    ellipsoid(q, H(0, -1.3, 3.0), [0.36, 0.22, 0.6], 8, 5, Math.PI / 2, 0.65)
    ellipsoid(q, H(0, -1.3, 1.95), [0.46, 0.4, 0.5], 10, 5)
    // The rounded quarters, higher than the back.
    ellipsoid(q, H(0, 1.05, 2.05), [0.46, 0.62, 0.42], 10, 5)
    // The head, tucked behind the vertical: broad jowl and forehead, narrow muzzle.
    tube(q, [H(0, -1.98, 3.72), H(0, -2.08, 3.35), H(0, -1.92, 2.85), H(0, -1.76, 2.56)], [0.15, 0.19, 0.14, 0.12], 8)
    for (const sx of [-1, 1]) tube(q, [H(sx * 0.09, -1.95, 3.74), H(sx * 0.11, -1.98, 3.96)], [0.06, 0.02], 5) // ears

    // Legs: near fore raised (forearm level, cannon hanging), off fore
    // planted, near hind stepping under, off hind back. Each ends in a hoof.
    const leg = (pts: V3[]) => tube(q, pts, [0.22, 0.14, 0.115, 0.125].slice(0, pts.length), 8)
    leg([H(0.2, -1.12, 1.68), H(0.22, -1.55, 1.68), H(0.22, -1.44, 0.95), H(0.22, -1.32, 0.72)])
    leg([H(-0.2, -0.85, 1.6), H(-0.2, -0.8, 0.65), H(-0.2, -0.7, 0.12), H(-0.2, -0.66, 0)])
    leg([H(0.2, 0.8, 1.55), H(0.22, 0.62, 0.66), H(0.22, 0.32, 0.12), H(0.22, 0.26, 0)])
    leg([H(-0.2, 1.25, 1.55), H(-0.22, 1.62, 0.62), H(-0.22, 1.6, 0.12), H(-0.22, 1.64, 0)])
    // Upper legs: broad shoulders and hams, so the legs grow out of the body.
    for (const sx of [-1, 1]) {
      ellipsoid(q, H(sx * 0.24, -1.05, 1.85), [0.24, 0.3, 0.38], 8, 4)
      ellipsoid(q, H(sx * 0.2, 1.1, 1.85), [0.26, 0.38, 0.42], 8, 4)
    }
    // Tail: from a raised dock, falling in a broad sweep behind.
    tube(q, [H(0, 1.5, 2.2), H(0, 1.85, 1.72), H(0, 2.02, 1.0), H(0, 2.1, 0.6)], [0.12, 0.17, 0.14, 0.05], 8)

    // Washington, upright in the saddle, bareheaded.
    tube(q, [H(0, 0.18, 2.36), H(0, 0.24, 2.85), H(0, 0.3, 3.35), H(0, 0.32, 3.62)], [0.27, 0.25, 0.27, 0.2], 10)
    ellipsoid(q, H(0, 0.3, 3.48), [0.34, 0.2, 0.18], 8, 4) // shoulders and epaulettes
    ellipsoid(q, H(0, 0.24, 2.6), [0.3, 0.26, 0.32], 8, 4) // coat skirts over the saddle
    ellipsoid(q, H(0, 0.28, 3.9), [0.14, 0.16, 0.18], 8, 5)
    tube(q, [H(0, 0.32, 3.62), H(0, 0.3, 3.76)], [0.08, 0.08], 6)
    // Thighs forward along the barrel, shins down the horse's sides.
    for (const sx of [-1, 1]) tube(q, [H(sx * 0.22, 0.18, 2.42), H(sx * 0.48, -0.18, 2.32), H(sx * 0.5, -0.04, 1.85), H(sx * 0.5, 0.02, 1.45)], [0.15, 0.13, 0.11, 0.09], 7)
    // Right arm (−x) raised forward and out over the horse's head; the open hand.
    tube(q, [H(-0.28, 0.3, 3.52), H(-0.48, -0.25, 3.86), H(-0.7, -0.85, 4.3)], [0.11, 0.09, 0.075], 7)
    ellipsoid(q, H(-0.75, -0.95, 4.42), [0.08, 0.1, 0.15], 6, 3)
    // Left arm low, the hand forward at the saddle bow with the reins.
    tube(q, [H(0.24, 0.3, 3.55), H(0.4, 0.28, 3.12), H(0.22, -0.1, 2.95)], [0.1, 0.085, 0.07], 7)
    // Cloak rolled behind him on the horse's back.
    tube(q, [H(-0.38, 0.62, 2.62), H(0, 0.66, 2.7), H(0.38, 0.62, 2.62)], [0.12, 0.16, 0.12], 8)
  }, 60)

  finishModel('Equestrian statue of George Washington', 'nyc-union-square-washington', [
    { part: granite, material: { name: 'granite', color: 0xd2d1cb, roughness: 0.85 } },
    { part: bronze, material: { name: 'bronze', color: 0x4f5a52, roughness: 0.65 } },
  ], { bearing: 29, osm: 'node/424555887', height: 8.4 }, 5000)
}

if (import.meta.main) build()
