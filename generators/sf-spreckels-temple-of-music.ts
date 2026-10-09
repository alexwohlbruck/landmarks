/**
 * Spreckels Temple of Music (the Golden Gate Park bandshell), San Francisco —
 * original procedural geometry, CC0-1.0.
 * bun generators/sf-spreckels-temple-of-music.ts
 *
 * Map frame: x east, y north, z up, metres, built turned to bearing 235: the
 * model's south (-y) is the stage's open side, facing north-east over the
 * Music Concourse; +x runs along the colonnades (bearing 325). Origin =
 * centroid of the OSM outline way/30896932.
 *
 * Evidence
 * - OSM way/30896932 (building, height 12): the arch block and both
 *   colonnades in one outline.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m: the concourse in
 *   front 73.0 m NAVD88 (y = 0), the ground behind 74.7; the arch block 20 m
 *   wide (x ±10) and 14.5 m deep, its cornice at +17.4 and the attic above it
 *   (set in 1 m) to +21.0 with its roof recessed to +18.1; the colonnades
 *   16 m long and 6 m deep (y -8 to -2), roofed at +10.0 with balustrades to
 *   +11.4; the stage at +1.5; a low back-stage block behind to ~+5.
 * - Published (Wikipedia; SF Rec & Park): 1900, architects Reid Brothers,
 *   Colusa sandstone, Italian Renaissance; gift of Claus Spreckels.
 * - Commons daylight photos: "Golden Gate Park - Spreckels Temple of Music
 *   02.jpg" and "01.jpg" (Joe Mabel, CC BY-SA 3.0); "Spreckels Temple of
 *   Music from Hamon Observation Tower, De Young Museum 01.jpg" (Joe Mabel,
 *   CC BY 4.0, from above); "Spreckels Temple of Music - Golden Gate Park -
 *   02.jpg" (Daderot, CC0, the arch face on); "Spreckels Temple of Music 1
 *   2019-02-25.jpg" (FASTILY, CC BY-SA 4.0).
 *
 * Estimated from the photos, scaled by the lidar: the arch (r 6.8 m, springing
 * at +7.0) and the depth of its half-dome; the engaged columns either side of
 * the arch; eight column pairs per colonnade and their size. The half-dome's
 * coffers, the spandrel reliefs, the attic lettering and the balustrade's
 * balusters are left out (too fine); the balustrades are solid parapets.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { lathe, prism, report, offset, flat, type XY } from './sf-de-young'

const ANCHOR = { lng: -122.4685871, lat: 37.76986089 }
const stone = new Part(), trim = new Part(), roof = new Part()

const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
/** A prism with a parapet: walls to z1, a lip `lip` wide, the roof recessed to z1 - drop. */
function parapet(wall: Part, top: Part, ring: XY[], z0: number, z1: number, lip: number, drop: number) {
  prism(wall, ring, z0, z1, null)
  const inner = offset(ring, -lip)
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length
    wall.quad([...ring[i], z1], [...ring[j], z1], [...inner[j], z1], [...inner[i], z1])
    wall.quad([...inner[j], z1], [...inner[i], z1], [...inner[i], z1 - drop], [...inner[j], z1 - drop])
  }
  flat(top, inner, z1 - drop)
}

// --- heights above y = 0 (73.0 m NAVD88) ---
const STAGE = 1.5, SPRING = 7.0, R_ARCH = 6.8, CORNICE = 17.4, ATTIC = 21.0
const FRONT = -10, BACK = 4.5, HALF = 10
const NICHE_Y = FRONT + 1.5 // where the arch's barrel ends and the half-dome begins
const SEG = 12

// --- The arch block ---
// Front face: the wall round the arch, which is cut down to the stage.
{
  const top = CORNICE - 0.8
  const P = (q: XY): V3 => [q[0], FRONT, q[1]]
  const tl: XY = [-HALF, top], tr: XY = [HALF, top]
  const arc: XY[] = Array.from({ length: SEG + 1 }, (_, i) => [R_ARCH * Math.cos((Math.PI * i) / SEG), SPRING + R_ARCH * Math.sin((Math.PI * i) / SEG)] as XY)
  stone.quad(P([R_ARCH, 0]), P([HALF, 0]), P(tr), P([R_ARCH, SPRING])) // right pier
  stone.quad(P([-HALF, 0]), P([-R_ARCH, 0]), P([-R_ARCH, SPRING]), P(tl)) // left pier
  const mid = SEG / 2
  for (let i = 0; i < SEG; i++) stone.tri(P(arc[i]), P(i < mid ? tr : tl), P(arc[i + 1])) // spandrels
  stone.tri(P(arc[mid]), P(tr), P(tl))
}
// the archivolt: a moulded band round the arch and down its jambs, standing proud of the face
{
  const W = 0.8, D = 0.25, y = FRONT - D
  const Q = (r: number, a: number, yy: number): V3 => [r * Math.cos(a), yy, SPRING + r * Math.sin(a)]
  for (let i = 0; i < SEG; i++) {
    const a0 = (Math.PI * i) / SEG, a1 = (Math.PI * (i + 1)) / SEG
    trim.quad(Q(R_ARCH, a0, y), Q(R_ARCH + W, a0, y), Q(R_ARCH + W, a1, y), Q(R_ARCH, a1, y))
    trim.quad(Q(R_ARCH + W, a0, y), Q(R_ARCH + W, a0, FRONT), Q(R_ARCH + W, a1, FRONT), Q(R_ARCH + W, a1, y))
    trim.quad(Q(R_ARCH, a1, y), Q(R_ARCH, a1, FRONT), Q(R_ARCH, a0, FRONT), Q(R_ARCH, a0, y))
  }
  for (const s of [-1, 1]) {
    const x0 = s * R_ARCH, x1 = s * (R_ARCH + W)
    const [l, r] = s > 0 ? [x0, x1] : [x1, x0]
    trim.quad([l, y, STAGE], [r, y, STAGE], [r, y, SPRING], [l, y, SPRING])
    trim.quad([x1, y, STAGE], [x1, FRONT, STAGE], [x1, FRONT, SPRING], [x1, y, SPRING].map((v) => v) as V3)
  }
}
// side and back walls, cornice, attic
{
  const P = (x: number, y: number, z: number): V3 => [x, y, z]
  const zc = CORNICE - 0.8
  stone.quad(P(HALF, FRONT, 0), P(HALF, BACK, 0), P(HALF, BACK, zc), P(HALF, FRONT, zc))
  stone.quad(P(-HALF, BACK, 0), P(-HALF, FRONT, 0), P(-HALF, FRONT, zc), P(-HALF, BACK, zc))
  stone.quad(P(HALF, BACK, 0), P(-HALF, BACK, 0), P(-HALF, BACK, zc), P(HALF, BACK, zc))
  // cornice: a projecting slab with a soft top edge
  prism(trim, offset(rect(-HALF, FRONT, HALF, BACK), 0.45), zc, CORNICE, trim, 0.3, true)
  // the attic, set in, under a moulded top band; its roof is recessed behind the band (lidar)
  const attic = rect(-HALF + 1, FRONT + 1.2, HALF - 1, BACK - 1)
  prism(stone, attic, CORNICE, ATTIC - 0.6, null)
  parapet(trim, roof, offset(attic, 0.25), ATTIC - 0.6, ATTIC, 0.95, 2.9)
}
// the arch's barrel (soffit), the niche wall and the half-dome, all facing in
{
  const ang = (i: number) => (Math.PI * i) / SEG
  for (let i = 0; i < SEG; i++) {
    const a0 = ang(i), a1 = ang(i + 1)
    const A = (a: number, y: number): V3 => [R_ARCH * Math.cos(a), y, SPRING + R_ARCH * Math.sin(a)]
    trim.quad(A(a0, FRONT), A(a1, FRONT), A(a1, NICHE_Y), A(a0, NICHE_Y))
  }
  // jambs of the barrel below the springing
  stone.quad([R_ARCH, FRONT, STAGE], [R_ARCH, NICHE_Y, STAGE], [R_ARCH, NICHE_Y, SPRING], [R_ARCH, FRONT, SPRING])
  stone.quad([-R_ARCH, NICHE_Y, STAGE], [-R_ARCH, FRONT, STAGE], [-R_ARCH, FRONT, SPRING], [-R_ARCH, NICHE_Y, SPRING])
  // the niche: a half-cylinder wall up to the springing, then a quarter sphere
  const H = (a: number, phi: number, z0: number): V3 => [R_ARCH * Math.cos(a) * Math.cos(phi), NICHE_Y + R_ARCH * Math.sin(a) * Math.cos(phi), z0 + R_ARCH * Math.sin(phi)]
  for (let i = 0; i < SEG; i++) {
    const a0 = ang(i), a1 = ang(i + 1)
    stone.quad(H(a1, 0, STAGE), H(a0, 0, STAGE), H(a0, 0, SPRING), H(a1, 0, SPRING))
    for (let k = 0; k < 4; k++) {
      const p0 = (k * Math.PI) / 8, p1 = ((k + 1) * Math.PI) / 8
      const n = (a: number, p: number): V3 => [-Math.cos(a) * Math.cos(p), -Math.sin(a) * Math.cos(p), -Math.sin(p)]
      trim.tri(H(a1, p0, SPRING), H(a0, p0, SPRING), H(a0, p1, SPRING), undefined, undefined, undefined, [n(a1, p0), n(a0, p0), n(a0, p1)])
      if (k < 3) trim.tri(H(a1, p0, SPRING), H(a0, p1, SPRING), H(a1, p1, SPRING), undefined, undefined, undefined, [n(a1, p0), n(a0, p1), n(a1, p1)])
    }
  }
  // the stage floor and its front
  const floor: XY[] = [[-R_ARCH, FRONT], [R_ARCH, FRONT]]
  for (let i = 0; i <= SEG; i++) floor.push([R_ARCH * Math.cos(ang(i)), NICHE_Y + R_ARCH * Math.sin(ang(i))])
  flat(stone, floor, STAGE)
  stone.quad([-R_ARCH, FRONT - 0.01, 0], [R_ARCH, FRONT - 0.01, 0], [R_ARCH, FRONT - 0.01, STAGE], [-R_ARCH, FRONT - 0.01, STAGE])
}
// engaged columns on the piers either side of the arch
for (const s of [-1, 1]) {
  for (const x of [7.75, 9.25]) {
    lathe(trim, [[0.75, STAGE], [0.6, STAGE + 0.6], [0.52, 14.6], [0.75, 15.4], [0.75, 16.2]], 10, [s * x, FRONT - 0.15])
  }
}

// --- The colonnades ---
const CY0 = -8.2, CY1 = -1.8, CZ = 8.6, CROOF = 10.0, BAL = 11.4
for (const s of [-1, 1]) {
  const x0 = HALF, x1 = 26
  const R = (a: number, b: number) => (s > 0 ? rect(a, CY0, b, CY1) : rect(-b, CY0, -a, CY1))
  // podium
  prism(stone, R(x0 - 0.2, x1 + 0.4).map(([x, y]) => [x, y < 0 && y < -5 ? y - 0.5 : y + 0.5] as XY), 0, STAGE, stone, 0.2)
  // entablature and roof, then the solid balustrade round it
  prism(trim, R(x0 - 0.2, x1), CZ, CROOF, null, 0, true)
  parapet(trim, roof, R(x0 - 0.2, x1), CROOF, BAL, 0.4, 1.0)
  // two rows of columns
  for (let i = 0; i < 8; i++) {
    const x = s * (11.4 + i * 2.0)
    for (const y of [CY0 + 0.6, CY1 - 0.6]) lathe(stone, [[0.55, STAGE], [0.42, STAGE + 0.35], [0.36, CZ - 0.4], [0.55, CZ]], 8, [x, y])
  }
}

// --- the low back-stage block behind the arch ---
prism(stone, rect(-10.5, BACK, 8, 11.5), 0, 5.0, roof, 0.3)

const parts = [
  { part: stone, material: finish('spreckels-sandstone', 0xdcc6a0) },
  { part: trim, material: finish('spreckels-trim', 0xe9dabd) },
  { part: roof, material: finish('spreckels-roof', 0xbfb8aa) },
]
const glb = writeGlb('Spreckels Temple of Music', parts, {
  license: 'CC0-1.0', bearing: 235, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: ATTIC,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/30896932'],
})
const tris = report('Spreckels', parts, glb)
const out = new URL('../models/sf-spreckels-temple-of-music.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
