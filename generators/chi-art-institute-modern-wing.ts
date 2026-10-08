/**
 * Art Institute of Chicago, the Modern Wing (Renzo Piano Building Workshop,
 * 2009), Monroe Street at Columbus Drive — original procedural geometry,
 * CC0-1.0.
 *
 *   bun generators/chi-art-institute-modern-wing.ts
 *
 * A second placement beside chi-art-institute (the 1893 building on
 * Michigan Avenue): the two are separated by the railway cut and the older
 * wings over it, which are not modelled.
 *
 * Map frame: x east, y north, z up, metres; origin at the centroid of the
 * OSM part way/765296571 "Modern Wing" (41.880287, -87.622027). Its walls
 * run at 359.1° like the rest of the museum, so the model is built square
 * and placed at bearing 359.1; the OSM points below are turned 0.88° to
 * match.
 *
 * Identity: the "flying carpet", a broad, thin, white sunshade of aluminium
 * blades floating above the east pavilion on slender white posts and
 * overhanging it, most of all over the Monroe Street entrance; under it a
 * three-storey glass pavilion, its bays of pale glass with fine white fins
 * between buff limestone piers. West of it, the long lower west wing along
 * the railway, with Griffin Court's glass roof running down its length, and
 * the stone and glass west pavilion on Monroe Street.
 *
 * Evidence:
 *  - OSM: way/765296571 (the wing's part, west arm and east pavilion),
 *    way/943374848 (building:part=roof, roof:colour=white, 3 levels: the
 *    flying carpet, 66 x 66 m), way/943374852 (the small entrance canopy),
 *    way/1425669058 (Ryan Learning Center, the pavilion's ground floor).
 *  - USGS NAIP: the white square of the carpet, and the west arm's roof
 *    with the darker glazed strip of Griffin Court along it.
 *  - Heights: nothing is published that I found. Measured off
 *    TonyTheTiger's photo from the Lurie Garden, scaled by the pavilion's
 *    width: pavilion roof ≈ 21 m, carpet ≈ 24.5 m; the west wing ≈ 18 m
 *    (Fetchcomms' photo from Monroe and Columbus, against the pavilion).
 *    Expect ±2 m.
 *  - Photos (Wikimedia Commons): 20080602_Art_Institute_of_Chicago_Modern
 *    _Wing_From_Lurie_Garden.JPG (TonyTheTiger, CC BY-SA 3.0, north);
 *    Art_Institute_of_Chicago_Modern_Wing.jpg (Fetchcomms, CC BY-SA 3.0,
 *    north-east); Art_Institute_of_Chicago,_Chicago,_Illinois_(9181712330)
 *    .jpg (Ken Lund, CC BY-SA 2.0, from the garden above the north side);
 *    Art_Institute_of_Chicago_Modern_wing.jpg (Alanscottwalker, CC BY-SA
 *    3.0, north-west, with the Nichols Bridgeway); Modern_Wing_of_Art
 *    _Institute_-_panoramio.jpg (Bohao Zhao, CC BY 3.0, night);
 *    Art_Institute_of_Chicago,_Illinois,_Estados_Unidos,_2012-10-20,_DD_03
 *    .jpg (Diego Delso, CC BY-SA 3.0). No commercial imagery.
 *
 * Simplified: the carpet is a solid thin slab (its blades are too fine to
 * draw); the glass's many fins are drawn as five pale lines per bay; the Nichols Bridgeway over
 * Monroe Street (no OSM building) is not drawn. The west wing's south end,
 * against the older wings, is drawn to the OSM outline at one height.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, windowVariant } from './palette'
import { plate } from './chi-picasso'

const stone = new Part(), trim = new Part(), roof = new Part(), glass = new Part(), pane = new Part(), lobby = new Part()

type XY = [number, number]
// OSM coordinates (metres about -87.6216, 41.8806) → this model's frame.
const ANCHOR: XY = [-35.4, -34.6], TURN = (-0.88 * Math.PI) / 180
const M = ([x, y]: XY): XY => {
  const dx = x - ANCHOR[0], dy = y - ANCHOR[1]
  return [dx * Math.cos(TURN) - dy * Math.sin(TURN), dx * Math.sin(TURN) + dy * Math.cos(TURN)]
}
const at = (pts: XY[], z: number): V3[] => pts.map(([x, y]) => [x, y, z])
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
function prism(p: Part, ring: XY[], z0: number, z1: number, top: Part | null = roof) {
  plate(p, ring, (u, v, w) => [u, v, (z0 + z1) / 2 + w], z1 - z0)
  if (top) top.cap(at(ring.slice(), z1 + 0.02), true)
}
type Face = { axis: 'x' | 'y'; c: number; out: 1 | -1 }
function panel(p: Part, f: Face, u0: number, u1: number, z0: number, z1: number, off = 0.06) {
  plate(p, rect(u0, u1, z0, z1), (u, z, w) => f.axis === 'x' ? [f.c + f.out * (off + 0.01 + w), u, z] : [u, f.c + f.out * (off + 0.01 + w), z], 0.02)
}

// ── East pavilion and the flying carpet ─────────────────────────────────
const PAV_TOP = 21.0, CARPET = 24.5
// Pavilion walls: west against the west wing, north on the OSM part's
// Monroe Street line, east on Columbus Drive, south under the carpet's
// south edge less its overhang.
const [px0, py0] = M([-40.0, -47.0]), [px1, py1] = M([23.8, 7.4])
{
  const ring = rect(px0, px1, py0, py1)
  plate(stone, ring, (u, v, w) => [u, v, PAV_TOP / 2 + w], PAV_TOP)
  roof.cap(at(ring, PAV_TOP + 0.02), true)
  // Bays of pale glass between limestone piers, on the three open sides;
  // the ground floor is a darker glazed band (the lobby and learning
  // center), lit at night.
  const faces: [Face, number, number][] = [
    [{ axis: 'y', c: py1, out: 1 }, px0 + 1.5, px1 - 1.5],
    [{ axis: 'x', c: px1, out: 1 }, py0 + 1.5, py1 - 1.5],
    [{ axis: 'y', c: py0, out: -1 }, px0 + 1.5, px1 - 1.5],
  ]
  for (const [f, u0, u1] of faces) {
    const n = 4, pier = 2.6, b = (u1 - u0 + pier) / n
    for (let i = 0; i < n; i++) {
      const a = u0 + i * b, c = a + b - pier
      panel(pane, f, a, c, 5.2, PAV_TOP - 1.4)
      // A few of the white fins, as pale mullion lines.
      for (let k = 1; k < 6; k++) { const u = a + ((c - a) * k) / 6; panel(trim, f, u - 0.14, u + 0.14, 5.2, PAV_TOP - 1.4, 0.1) }
      panel(lobby, f, a, c, 0.4, 4.6)
    }
  }
}
// The carpet: a thin white slab, its edge bevelled, on slender posts.
{
  const [cx0, cy0] = M([-40.9, -50.0]), [cx1, cy1] = M([25.0, 15.7])
  const ring = rect(cx0, cx1, cy0, cy1)
  plate(trim, ring, (u, v, w) => [u, v, CARPET + w], 0.7)
  // Posts along the overhanging north and east edges and the south.
  const posts: XY[] = []
  for (let i = 0; i <= 4; i++) posts.push([px0 + 2 + ((px1 - px0 - 4) * i) / 4, py1 + 2.8])
  for (const t of [0.33, 0.66]) posts.push([px1 + 0.8, py0 + (py1 - py0) * t])
  for (let i = 0; i <= 4; i++) posts.push([px0 + 2 + ((px1 - px0 - 4) * i) / 4, py0 - 1.2])
  for (const [x, y] of posts) prism(trim, rect(x - 0.22, x + 0.22, y - 0.22, y + 0.22), 0, CARPET - 0.35, null)
}

// ── West wing: along the railway, with Griffin Court's glass roof ───────
const WEST_TOP = 18.0
{
  // The OSM part less the pavilion, as two convex-enough pieces.
  const north = [[-76.3, -2.8], [-40.0, -2.8], [-40.0, 6.8], [-68.2, 6.7], [-68.1, -0.9], [-76.3, -0.9]] as XY[]
  const main = [[-76.0, -23.2], [-72.2, -23.2], [-72.0, -34.3], [-67.5, -34.1], [-66.8, -73.5], [-74.1, -73.6], [-74.0, -83.5], [-70.6, -83.5],
    [-70.2, -103.2], [-50.5, -102.8], [-50.8, -89.7], [-27.9, -89.2], [-28.3, -52.3], [-40.0, -52.4], [-40.0, -2.8], [-76.3, -2.8]] as XY[]
  for (const ring of [north, main]) {
    const r = ring.map(M)
    plate(stone, r, (u, v, w) => [u, v, WEST_TOP / 2 + w], WEST_TOP)
    // Roof cap: plate already closes the top; a roof layer just above it.
    plate(roof, r, (u, v, w) => [u, v, WEST_TOP + 0.03 + w], 0.04)
  }
  // Griffin Court: the glazed spine, a low glass ridge down the wing.
  const [gx0, gy0] = M([-52.0, -88.0]), [gx1, gy1] = M([-43.0, 4.0])
  const g = rect(gx0, gx1, gy0, gy1)
  const ridge: XY[] = rect(gx0 + 2.5, gx1 - 2.5, gy0 + 1, gy1 - 1)
  glass.loft([at(g, WEST_TOP + 0.08), at(ridge, WEST_TOP + 1.8)])
  glass.cap(at(ridge, WEST_TOP + 1.8), true)
  // The west pavilion on Monroe: glass bays over the street front.
  const [wx0, wy] = M([-68.0, 6.8]), [wx1] = M([-44.0, 6.8])
  const f: Face = { axis: 'y', c: wy, out: 1 }
  panel(pane, f, wx0 + 1.5, wx1 - 1.5, 5.0, WEST_TOP - 2.0)
  panel(lobby, f, wx0 + 1.5, wx1 - 1.5, 0.4, 4.4)
  // The west wing's railway front: bands of glass on its three steps.
  for (const [x, y0, y1] of [[-67.5, -60, -40], [-72.0, -33, -24], [-76.0, -22, -4]] as [number, number, number][]) {
    const [cx, a] = M([x, y0]), [, b] = M([x, y1])
    panel(pane, { axis: 'x', c: cx, out: -1 }, a, b, 6.0, WEST_TOP - 2.5)
  }
}

const parts = [
  { part: stone, material: PALETTE.stone },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: glass, material: PALETTE.glass },
  { part: pane, material: windowVariant(2, 0xa9bfd1) },
  { part: lobby, material: PALETTE.window },
]
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('Art Institute of Chicago, Modern Wing', parts, {
  frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [41.880287, -87.622027], bearing: 359.1,
})
if (triangles > 5000 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/chi-art-institute-modern-wing.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
