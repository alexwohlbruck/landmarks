/**
 * 333 Wacker Drive (1983, Kohn Pedersen Fox), Chicago — original procedural
 * geometry, CC0-1.0.
 * bun generators/chi-333-wacker.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/116017092,
 * 41.8860954,-87.6359245. Its back walls run at 179.4° and 269.8°, so the
 * catalog bearing is 0 and the frame is true north.
 *
 * Identity, in order: the great curved wall of green reflective glass
 * following the bend of the river, its top edge rising towards the south-west
 * end, where it slots into a taller block; the flat back faces on the city
 * side, with the 45° south-east face cut by a full-height V notch and the top
 * stepping down towards the south; the dark granite base with green marble
 * stripes; one bronze band around the back high up.
 *
 * Evidence:
 *  - plan: OSM outline. The river face is redrawn as a circular arc through
 *    the outline's two ends and its middle, 16 segments.
 *  - height: 148 m (OSM; published 148.4 m, 36 storeys) to the back
 *    block's top. Measured on MusikAnimal's and Alvesgaspar's views square
 *    to the curve, scaled by the 148 m back: the curve's top edge ~143 m at
 *    the south-west end falling to ~137 m at the north-east end (the photos
 *    from Wolf Point put the taller, slotted end on the right, the south-west), the stepped
 *    back ~144.5 m, base ~12 m (three storeys of granite).
 *  - back: the V notch and the stepped top from Jaysin Trevino's view up
 *    the south-east face and Elisa.rolle's from the south; the notch depth
 *    (3 m) and the bronze band's height (~112 m) are estimates.
 *  - colour: pale green glass as it reads in daylight (a light window
 *    colour, per STYLE); the base a warm grey granite.
 *
 * Photos (Wikimedia Commons): 333_Wacker_Drive,_Chicago_in_May_2016.jpg
 * (MusikAnimal, CC BY-SA 4.0); Chicago_2007-15.jpg (Alvesgaspar, CC BY-SA
 * 3.0); 333_West_Wacker_Drive.JPG (FTSKfan, public domain);
 * 333_Wacker_Dr.jpg (Adsitm, CC BY-SA 3.0); 333_West_Wacker_1_(6573419471)
 * .jpg and 333_West_Wacker_2_(6573421275).jpg (Jaysin Trevino, CC BY 2.0);
 * 333_West_Wacker_Drive,_2000.JPG (Elisa.rolle, CC BY-SA 3.0). No
 * commercial imagery.
 *
 * Left out: mullion grid, the round vents and the arcade in the base, the
 * rooftop sign.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, clip, inset, onWall, rect, save, walls, type XY } from './chi-merchandise-mart'

function circleThrough(a: XY, b: XY, c: XY) {
  const d = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]))
  const s = (p: XY) => p[0] * p[0] + p[1] * p[1]
  const ux = (s(a) * (b[1] - c[1]) + s(b) * (c[1] - a[1]) + s(c) * (a[1] - b[1])) / d
  const uy = (s(a) * (c[0] - b[0]) + s(b) * (a[0] - c[0]) + s(c) * (b[0] - a[0])) / d
  return { cx: ux, cy: uy, r: Math.hypot(a[0] - ux, a[1] - uy) }
}

function build() {
  const granite = new Part(), glass = new Part(), trim = new Part(), roof = new Part(), bronze = new Part()

  // River face: an arc from the south-west end to the north-east end.
  const SW: XY = [-38.1, -28.3], NE: XY = [27.9, 38.5], MID: XY = [-13.3, 13.5]
  const { cx, cy, r } = circleThrough(SW, MID, NE)
  const a0 = Math.atan2(SW[1] - cy, SW[0] - cx), a1 = Math.atan2(NE[1] - cy, NE[0] - cx)
  const N = 16
  const arc: XY[] = Array.from({ length: N + 1 }, (_, i) => {
    const t = a0 + (a1 - a0) * (i / N)
    return [cx + r * Math.cos(t), cy + r * Math.sin(t)] as XY
  })
  // Back: east face, the 45° face with its V notch, south face.
  const SEa: XY = [28.3, -0.6], SEb: XY = [1.6, -28.1]
  const { L, u, n } = onWall(SEa, SEb)
  const m = L / 2
  const notch: XY[] = [
    [SEa[0] + u[0] * (m - 2.6), SEa[1] + u[1] * (m - 2.6)],
    [SEa[0] + u[0] * m + n[0] * 3, SEa[1] + u[1] * m + n[1] * 3],
    [SEa[0] + u[0] * (m + 2.6), SEa[1] + u[1] * (m + 2.6)],
  ]
  // Counter-clockwise: the arc runs SW → NE round the north-west, so go
  // the other way: NE back down the arc is clockwise. Build SW → south face →
  // SE face → east face → NE → arc back to SW.
  const ring: XY[] = [SW, SEb, ...[...notch].reverse(), SEa, NE, ...arc.slice(1, N).reverse()]

  const BASE = 12
  // The curve's top is a plane falling from 143 m at the south-west end to
  // 137 m at the north-east end.
  const dir: XY = [(NE[0] - SW[0]), (NE[1] - SW[1])], dl = Math.hypot(dir[0], dir[1])
  const topZ = (p: XY) => 143 - 6 * (((p[0] - SW[0]) * dir[0] + (p[1] - SW[1]) * dir[1]) / (dl * dl))

  // Granite base, then the glass shaft, its top following the plane.
  walls(granite, ring, 0, BASE)
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length]
    glass.quad([p[0], p[1], BASE], [q[0], q[1], BASE], [q[0], q[1], topZ(q) - 0.6], [p[0], p[1], topZ(p) - 0.6])
    trim.quad([p[0], p[1], topZ(p) - 0.6], [q[0], q[1], topZ(q) - 0.6], [q[0], q[1], topZ(q)], [p[0], p[1], topZ(p)])
  }
  // Roof on the plane (fan from the ring's own triangulation).
  {
    const tris: V3[][] = []
    const flat = new Part()
    cap(flat, ring, 0)
    for (let k = 0; k < flat.pos.length; k += 9) {
      const pts: V3[] = [0, 3, 6].map((o) => {
        // Part stores glTF (x, z, -y); recover map x, y.
        const x = flat.pos[k + o], y = -flat.pos[k + o + 2]
        return [x, y, topZ([x, y])] as V3
      })
      tris.push(pts)
    }
    for (const [A, B, C] of tris) roof.tri(A, B, C)
  }
  // Floor lines on the glass: a few pale bands, one every four storeys.
  for (let z = BASE + 16; z < 132; z += 16.4) walls(trim, inset(ring, -0.04), z, z + 0.45)

  // The taller back blocks: the south slab to 148 m, the band along the
  // south-east face stepping down to 144.5 m.
  const east = clip(ring, rect(-45, -40, 40, -17.5))
  const diag = clip(ring, [[-38.5, -46.7], [60, -60], [60, 40], [38.3, 32.3]] as XY[])
  for (const [poly, z1] of [[diag, 144.5], [east, 148]] as [XY[], number][]) {
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i], q = poly[(i + 1) % poly.length]
      glass.quad([p[0], p[1], Math.min(topZ(p), topZ(q)) - 1], [q[0], q[1], Math.min(topZ(p), topZ(q)) - 1], [q[0], q[1], z1 - 0.6], [p[0], p[1], z1 - 0.6])
    }
    walls(trim, poly, z1 - 0.6, z1, inset(poly, 0.3))
    cap(roof, inset(poly, 0.3), z1)
  }
  // Bronze band round the back faces.
  const back: XY[] = [SW, SEb, ...[...notch].reverse(), SEa, NE]
  for (let i = 0; i < back.length - 1; i++) {
    const p = back[i], q = back[i + 1], { n: nn } = onWall(p, q)
    const o = (s: XY): XY => [s[0] + nn[0] * 0.06, s[1] + nn[1] * 0.06]
    const P = o(p), Q = o(q)
    bronze.quad([P[0], P[1], 111.5], [Q[0], Q[1], 111.5], [Q[0], Q[1], 113], [P[0], P[1], 113])
  }
  // The slot where the curve's south-west end tucks into the back block.
  {
    const p = arc[1], q = SW, { n: nn, L: l } = onWall(p, q)
    const at = (d: number, z: number): V3 => [q[0] + (p[0] - q[0]) * d / l + nn[0] * 0.08, q[1] + (p[1] - q[1]) * d / l + nn[1] * 0.08, z]
    bronze.quad(at(0.4, 108), at(2.0, 108), at(2.0, topZ(SW) + 0.2), at(0.4, topZ(SW) + 0.2))
  }
  // Green marble stripes in the granite base.
  for (const z of [4.2, 8.4]) walls(bronze, inset(ring, -0.05), z, z + 0.5)

  return [
    { part: granite, material: finish('wacker-granite', 0xc4bbb5) },
    { part: glass, material: { ...PALETTE.window, color: 0x93bbb4 } },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: bronze, material: finish('wacker-bronze', 0x8a8274) },
  ]
}

if (import.meta.main) await save('chi-333-wacker', '333 Wacker Drive', [41.8860954, -87.6359245], 0, build())
