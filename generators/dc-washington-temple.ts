/**
 * Washington D.C. Temple (The Church of Jesus Christ of Latter-day Saints),
 * Kensington, Maryland — procedural, CC0-1.0, no textures.
 * bun generators/dc-washington-temple.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0°, the long walls run
 * due east–west in OSM. The anchor is the area centroid of the OSM outline
 * way/87324809 (lng -77.0656093, lat 39.0140535).
 *
 * What it is: Keith Wilcox's temple (1974) in white Alabama marble. An
 * elongated hexagon of walls ribbed with tall marble fins, the fins
 * standing up past the roof as a comb, and six towers at its corners,
 * three to the east and three to the west after the Salt Lake Temple. Each
 * tower is a square turned 45° to the walls: a tall shaft, a stepped crown,
 * a narrower second stage and a gilded needle spire. The east towers are
 * taller than the west; the east central one carries the gilded angel
 * Moroni. The spires are the identity.
 *
 * Covers and replaces the outline way/87324809 and its nineteen
 * building:parts (the six towers' stages): way/781335032, 781335034 and
 * way/845436189 … 845436205. Not covered: the entrance pavilion and the
 * bridge on the north side (way/844023409), outside the outline, and the
 * annex way/795280375.
 *
 * Evidence
 * - OSM (measured): the outline 76 × 41 m; tower centres at (±17.3, ±15.4)
 *   and (±31.9, 0); the walls between them run through those centres, so
 *   the body is a hexagon on them; the towers are drawn as diamonds (their
 *   sides at 45°), the east central one larger (12.4 m corner to corner).
 *   The parts' heights (48–100 m) are rough and were not used.
 * - Published (Wikipedia, "Washington D.C. Temple"): the east central tower
 *   288 ft (88 m) to the top of the angel Moroni, a gilded statue 18 ft
 *   (5.5 m) tall; white Alabama marble; gold-tipped spires.
 * - USGS 3DEP ground: 87.8–88.3 m round the outline, so y = 0 is 87.8 m.
 * - Photos (Wikimedia Commons): "Washington D.C. Temple At Dusk.jpg" (Joe
 *   Ravi, CC BY-SA 3.0; the north front square on, the main source of
 *   heights, scaled from the published 88 m); "Washington Temple 1974.jpg"
 *   (Warren K. Leffler, public domain; north front); "Washington DC
 *   Temple.JPG" (Uriah923, public domain; north-west); "Mormon Temple in
 *   DC.jpeg" (Geraldshields11, CC BY-SA 4.0; north-east, close);
 *   "DCTemple-c.jpg" (public domain; the east end's three spires). USGS NAIP
 *   orthophoto for the plan and the dark flat roof.
 * - Read off the photos (estimated): walls 34.5 m, the fins' comb to
 *   36.2 m; east towers' shafts to 38 m, crowns to 42 m, second stages to
 *   55.5 m, spires to 79 m (corners) and 82.3 m plus Moroni to 88 m
 *   (central); west towers 1.5–4 m lower at each stage, spires to 73.6 m.
 *   Tower size from the dusk photo: about 10.6 m corner to corner (OSM's
 *   parts say 7.5 m, its outline 9.9 m), the east central 12.4 m.
 * - Simplified: the fins are drawn about half as many and twice as broad
 *   as built, as relief against a slightly shaded wall (no window stripes:
 *   the gaps are narrow art-glass slits that do not read at map scale);
 *   each tower's stepped crown of small fins is two plain bands; Moroni is
 *   a slender gilded post.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, ngon, qf, spire, tf, wallsPoly, save, type XY } from './dc-national-cathedral'

/** A turned-square (diamond) ring of half-diagonal r, corners chamfered by c, CCW. */
function diamond(cx: number, cy: number, r: number, c = 0): XY[] {
  const out: XY[] = []
  for (const [ax, ay] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
    const px = -ay, py = ax // the next corner's direction
    const X = cx + ax * r, Y = cy + ay * r
    if (c <= 0) { out.push([X, Y]); continue }
    // Step back along both edges from the corner: towards the previous and the next corner.
    const k = c / Math.SQRT2
    out.push([X + (-ax - px) * k, Y + (-ay - py) * k])
    out.push([X + (-ax + px) * k, Y + (-ay + py) * k])
  }
  return out
}

/** A vertical prism on a ring, with an optional cap. */
function prism(p: Part, ring: XY[], z0: number, z1: number, top: Part | false = p) {
  wallsPoly(p, ring, z0, z1)
  if (top) capPoly(top, ring, z1, true)
}

/** One temple tower: shaft, stepped crown, second stage, collar, gilded needle. */
function tower(marble: Part, gold: Part, cx: number, cy: number, r: number, h: { shaft: number; crown: number; stage: number; collar: number; tip: number }) {
  prism(marble, diamond(cx, cy, r, 0.5), 0, h.shaft)
  // The crown: two stepped bands, each a little in from the last.
  prism(marble, diamond(cx, cy, r * 0.92, 0.5), h.shaft, h.shaft + (h.crown - h.shaft) * 0.55)
  prism(marble, diamond(cx, cy, r * 0.74, 0.4), h.shaft + (h.crown - h.shaft) * 0.55, h.crown)
  // The second stage, a narrower turned square with its corners notched,
  // and a stepped collar above it.
  prism(marble, diamond(cx, cy, r * 0.42, 0.4), h.crown, h.stage)
  const mid = (h.stage + h.collar) / 2
  prism(marble, diamond(cx, cy, r * 0.34, 0.25), h.stage, mid)
  prism(marble, diamond(cx, cy, r * 0.25, 0.2), mid, h.collar)
  // The needle: a short white foot, then gilded to the tip.
  prism(marble, diamond(cx, cy, 1.0), h.collar, h.collar + 1.8, false)
  const base = diamond(cx, cy, 1.0).map(([x, y]) => [x, y, h.collar + 1.8] as V3)
  spire(gold, base, [cx, cy, h.tip])
}

function build() {
  const marble = new Part(), wall = new Part(), roof = new Part(), gold = new Part()

  // Tower centres (OSM) and the body hexagon through them, CCW.
  const C = {
    e: [31.9, 0] as XY, ne: [17.3, 15.45] as XY, nw: [-17.3, 15.45] as XY,
    w: [-31.9, 0] as XY, sw: [-17.3, -15.4] as XY, se: [17.3, -15.4] as XY,
  }
  const hex: XY[] = [C.e, C.ne, C.nw, C.w, C.sw, C.se]
  const WALL = 34.5, FIN = 36.2

  // ---- The body: shaded walls, a marble plinth, the dark flat roof.
  prism(wall, hex, 3.0, WALL, roof)
  prism(marble, hex.map(([x, y]) => [x * 1.012, y * 1.03] as XY), 0, 3.0, false)
  // The fins: broad marble blades standing off each wall, up past the roof.
  const R = { e: 6.2, w: 5.3, c: 5.3 }
  const rOf = (p: XY) => (p === C.e ? R.e : p === C.w ? R.w : R.c)
  for (let i = 0; i < hex.length; i++) {
    const A = hex[i], B = hex[(i + 1) % hex.length]
    const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy)
    const ux = dx / L, uy = dy / L, nx = uy, ny = -ux // outward normal of a CCW ring
    // A diamond reaches r along an axis, r/√2 along a 45° wall.
    const reach = (p: XY) => (Math.abs(ux) > 0.99 || Math.abs(uy) > 0.99 ? rOf(p) : rOf(p) / Math.SQRT2) + 0.6
    const s0 = reach(A), s1 = L - reach(B)
    const n = Math.max(2, Math.round((s1 - s0) / 2.3))
    const step = (s1 - s0) / n
    for (let k = 0; k <= n; k++) {
      const s = s0 + k * step, w = 0.45, d = 0.75
      const P = (a: number, o: number, z: number): V3 => [A[0] + ux * a + nx * o, A[1] + uy * a + ny * o, z]
      const z0 = 3.0, z1 = FIN
      qf(marble, P(s - w, d, z0), P(s + w, d, z0), P(s + w, d, z1), P(s - w, d, z1), [nx, ny, 0])
      qf(marble, P(s - w, 0, z0), P(s - w, d, z0), P(s - w, d, z1), P(s - w, 0, z1), [-ux, -uy, 0])
      qf(marble, P(s + w, 0, z0), P(s + w, d, z0), P(s + w, d, z1), P(s + w, 0, z1), [ux, uy, 0])
      qf(marble, P(s - w, 0, z1), P(s + w, 0, z1), P(s + w, d, z1), P(s - w, d, z1), [0, 0, 1])
      // The comb: the fin's inner part above the roof.
      qf(marble, P(s - w, -0.6, WALL), P(s + w, -0.6, WALL), P(s + w, -0.6, z1), P(s - w, -0.6, z1), [-nx, -ny, 0])
      qf(marble, P(s - w, -0.6, WALL), P(s - w, 0, WALL), P(s - w, 0, z1), P(s - w, -0.6, z1), [-ux, -uy, 0])
      qf(marble, P(s + w, -0.6, WALL), P(s + w, 0, WALL), P(s + w, 0, z1), P(s + w, -0.6, z1), [ux, uy, 0])
      qf(marble, P(s - w, -0.6, z1), P(s + w, -0.6, z1), P(s + w, 0, z1), P(s - w, 0, z1), [0, 0, 1])
    }
  }

  // ---- Six towers: the east three taller, the central one with Moroni.
  const east = { shaft: 38.0, crown: 42.0, stage: 55.5, collar: 58.0 }
  const west = { shaft: 36.5, crown: 40.0, stage: 52.0, collar: 54.5 }
  tower(marble, gold, ...C.e, R.e, { ...east, tip: 82.3 })
  tower(marble, gold, ...C.ne, R.c, { ...east, stage: 54.5, collar: 57.0, tip: 79.0 })
  tower(marble, gold, ...C.se, R.c, { ...east, stage: 54.5, collar: 57.0, tip: 79.0 })
  tower(marble, gold, ...C.w, R.w, { ...west, tip: 73.6 })
  tower(marble, gold, ...C.nw, R.c, { ...west, tip: 73.6 })
  tower(marble, gold, ...C.sw, R.c, { ...west, tip: 73.6 })
  // Moroni: a slender gilded figure on the east central needle.
  {
    const [cx, cy] = C.e
    const ring = (r: number, z: number) => ngon(cx, cy, r, 6, z)
    gold.loft([ring(0.32, 81.0), ring(0.42, 84.0), ring(0.5, 86.6), ring(0.28, 87.4)])
    spire(gold, ring(0.28, 87.4), [cx, cy, 88.0])
  }

  return [
    { part: marble, material: finish('temple-marble', 0xf3f1ec) },
    { part: wall, material: finish('temple-marble-shade', 0xd9d6cf) },
    { part: roof, material: PALETTE.roof },
    { part: gold, material: finish('temple-gold', 0xd6b25e) },
  ]
}

if (import.meta.main) {
  await save('dc-washington-temple', 'Washington D.C. Temple', build(), {
    source: 'generators/dc-washington-temple.ts',
  })
}
