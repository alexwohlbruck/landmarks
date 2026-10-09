/**
 * Hell Gate Bridge (1917; Gustav Lindenthal, towers by Henry Hornbostel) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-hell-gate-bridge.ts
 *
 * The whole arch span and its two stone towers as one model, since the arch
 * is the bridge. Map frame: x across the bridge, y along it (toward Randalls
 * Island), z up, metres; origin at the middle of the span on the water.
 * Placed at bearing 314.6°, the line between the towers' tops in the lidar
 * (OSM's tower centroids give 314.5°). The approach viaducts beyond the
 * towers are the map's.
 *
 * What makes it the Hell Gate Bridge: a steel through-arch whose top chord
 * rises in a long curve and flattens into the towers, while the bottom chord
 * springs from the towers' feet, so the truss is deepest at its ends and
 * shallowest at the crown; the deck hung through the middle on hangers; two
 * massive granite towers with an arched opening in each face of their top
 * stage, a heavy cornice and a parapet; the arch painted a faded crimson.
 *
 * Sources:
 * - OSM: way/394608567 (man_made=bridge, the span's outline), towers
 *   way/1016643613 (Randalls Island) and way/1016643614 (Queens),
 *   bridge:support, about 44 x 27 m at their feet.
 * - Lidar (USGS 3DEP NY_NewYorkCity 2017, point cloud along the bridge;
 *   heights above the water at about -1 m NAVD88): top chord's top 94.2 m at
 *   the crown, 89.5 at ±50 m, 75.4 at ±100, 61.7 at ±130, 58 m where it meets
 *   the towers; bottom chord about 76–81 m at the crown, 66–70 at ±60, at the
 *   deck (42–47 m) near ±100 and down to about 18–22 m at ±140; the two
 *   trusses 20 m apart; the deck 30 m wide; tower tops 74.1 m, their top
 *   stage and parapet 34.4 m across and 21 m along, centred 165–166 m either
 *   side of mid-span; the ground at their feet 6–8 m up.
 * - Published: arch span 977.5 ft (298 m); towers 250 ft (76 m) above the
 *   water; 135 ft (41 m) clearance (Wikipedia "Hell Gate Bridge"; HAER
 *   NY-136).
 * - Photos (Wikimedia Commons): "Hell Gate Bridge (84459)p" (Rhododendrites,
 *   CC BY-SA 4.0; the whole span side-on from the south-west, the towers'
 *   openings, cornice and parapet); "Hell Gate Bridge (60275p)"
 *   (Rhododendrites, CC BY-SA 4.0; the span from the south, both towers);
 *   "Hell Gate Bridge November 2019" (IvanGeoPetrov, CC BY-SA 4.0; side-on
 *   from Astoria Park); "View of Hell Gate Bridge from Astoria Park, Queens
 *   New York" (Kenneth C. Zirkel, CC BY 4.0; the web and hangers from below,
 *   the Queens tower).
 * - Fitted to the lidar: bottom chord z = 78.5 - 0.00295 y² (centreline);
 *   top chord 92.4 - 0.00188 y² out to ±120 m, then easing flat into the
 *   towers at 56.2 m.
 * - Estimated from photos: 14 web panels (the real truss has about 23), a
 *   Pratt pattern of one diagonal per panel; the towers' openings (9 m wide,
 *   sills just above the deck, crowns 62 m), the cornice and parapet; the
 *   towers' batter and plinth.
 * - Colour: the steel reads a faded crimson to mauve in daylight photos
 *   (maroon in shade, pink at sunset), drawn at the palette's terracotta
 *   lightness; the towers' granite buff-grey (#c5b9a9 to #d4cdbb lit).
 * - y = 0 is the river. The towers stand on ground 6–8 m up and sink into it.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, type Swatch } from './palette'
import { box, beam, countParts } from './nyc-manhattan-bridge'
import { quadOut, hexa, type Face } from './nyc-george-washington-bridge'

const steel = new Part()  // arch trusses, hangers, deck girders
const stone = new Part()  // towers
const road = new Part()   // the deck's top

// ---- The arch -------------------------------------------------------------------

const SPAN = 151                 // springing at the towers' inner faces, |y|
const TOWER_IN = 154             // where the top chord meets the towers
const TRUSS = 10                 // truss planes, |x|
const DECK0 = 41, DECK = 46.5    // deck girders, top of deck

const zb = (y: number) => 78.5 - 0.00295 * y * y
function zt(y: number) {
  const a = Math.abs(y)
  if (a <= 120) return 92.4 - 0.00188 * a * a
  // Ease from the parabola's slope at 120 m to flat at the towers.
  const h = TOWER_IN - 120, t = Math.min(1, (a - 120) / h)
  const p0 = 92.4 - 0.00188 * 120 * 120, m0 = -2 * 0.00188 * 120 * h, p1 = 56.2
  return (2 * t ** 3 - 3 * t ** 2 + 1) * p0 + (t ** 3 - 2 * t ** 2 + t) * m0 + (-2 * t ** 3 + 3 * t ** 2) * p1
}

/** A chord: a w (across) x h (deep) box section swept along z(y) in the plane x = xc. */
function chord(p: Part, xc: number, z: (y: number) => number, y0: number, y1: number, w: number, h: (y: number) => number, n = 36) {
  const sec = (y: number): V3[] => {
    const d = 0.5, ty = 2 * d, tz = z(y + d) - z(y - d), l = Math.hypot(ty, tz)
    const N: [number, number] = [-tz / l, ty / l] // up-normal in the y-z plane
    const c: [number, number] = [y, z(y)], hh = h(y) / 2
    return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) =>
      [xc + (a * w) / 2, c[0] + b * hh * N[0], c[1] + b * hh * N[1]] as V3)
  }
  for (let i = 0; i < n; i++) {
    const ya = y0 + ((y1 - y0) * i) / n, yb = y0 + ((y1 - y0) * (i + 1)) / n
    const A = sec(ya), B = sec(yb)
    const mid: V3 = [xc, (ya + yb) / 2, (z(ya) + z(yb)) / 2]
    for (let k = 0; k < 4; k++) {
      const j = (k + 1) % 4
      quadOut(p, [A[k], A[j], B[j], B[k]], mid)
    }
  }
}

for (const xc of [-TRUSS, TRUSS]) {
  chord(steel, xc, zt, -TOWER_IN, TOWER_IN, 3.0, () => 3.6, 40)
  chord(steel, xc, zb, -SPAN, SPAN, 3.0, (y) => 5 + 2 * (y / SPAN) ** 2, 40)
}

// The web: a post at every panel point (down to the deck where the bottom
// chord rises above it, so the middle posts carry on as hangers) and one
// diagonal per panel, sloping down toward mid-span.
const PANELS = 14, P0 = -147, PW = (2 * -P0) / PANELS
for (const xc of [-TRUSS, TRUSS]) {
  for (let i = 0; i <= PANELS; i++) {
    const y = P0 + i * PW
    const lo = Math.min(zb(y), DECK0)
    beam(steel, [xc, y, lo], [xc, y, zt(y) - 1.6], 2.2, 1.8, [1, 0, 0])
  }
  for (let i = 0; i < PANELS; i++) {
    const ya = P0 + i * PW, yb = ya + PW
    const [yt, yl] = ya + yb < 0 ? [ya, yb] : [yb, ya] // top at the outer end
    beam(steel, [xc, yt, zt(yt) - 1.6], [xc, yl, zb(yl) + 1.5], 2.2, 1.8, [1, 0, 0])
  }
}
// Struts between the trusses along the top chord.
for (let i = 1; i < PANELS; i++) {
  const y = P0 + i * PW
  beam(steel, [-TRUSS + 1.5, y, zt(y)], [TRUSS - 1.5, y, zt(y)], 1.4, 1.4, [0, 0, 1])
}

// The deck: steel girders with the trackbed on top, from tower to tower.
box(steel, -15, 15, -SPAN, SPAN, DECK0, DECK - 0.5, { r: 0.3, bottom: true, lid: road })
box(road, -14.4, 14.4, -SPAN, SPAN, DECK - 0.5, DECK, { r: 0, bottom: false })

// ---- The towers -------------------------------------------------------------------

const TC = 165                     // tower centres, |y|
const SILL = 47, SPRING = 57.5, R = 4.5, CORN0 = 66, CORN1 = 68.5, TOP = 74.1

/** An arch head over an opening: the slab above a semicircle (radius r, spring zs) up to z1, in face frame F, n0..n1 deep. */
function archHead(p: Part, F: Face, r: number, zs: number, z1: number, n0: number, n1: number, seg = 8) {
  for (let i = 0; i < seg; i++) {
    const ta = Math.PI - (Math.PI * i) / seg, tb = Math.PI - (Math.PI * (i + 1)) / seg
    const pa: [number, number] = [r * Math.cos(ta), zs + r * Math.sin(ta)], pb: [number, number] = [r * Math.cos(tb), zs + r * Math.sin(tb)]
    const q = (n: number): V3[] => [F(pa[0], pa[1], n), F(pb[0], pb[1], n), F(pb[0], z1, n), F(pa[0], z1, n)]
    hexa(p, q(n0), q(n1), { skip: [1, 2, 3] }) // only the soffit and the two faces show
  }
}

for (const s of [-1, 1]) {
  const yc = s * TC
  // Plinth, then a battered shaft up to the sills.
  box(stone, -22, 22, yc - 13.75, yc + 13.75, 0, 5.5, { r: 0.5, bottom: false })
  box(stone, -21, 21, yc - 13, yc + 13, 5.5, 7, { r: 0.4, top: 0.4, bottom: false })
  const ring = (z: number, hx: number, hy: number): V3[] => [[-hx, yc - hy, z], [hx, yc - hy, z], [hx, yc + hy, z], [-hx, yc + hy, z]]
  hexa(stone, ring(7, 19.5, 12.5), ring(SILL, 17.3, 11.2), { capA: false })

  // Top stage: four corner piers around crossing openings, an arch head over
  // each opening, a sill ledge under each.
  const HX = 17, HY = 11
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const [x0, x1] = sx > 0 ? [R, HX] : [-HX, -R]
    const [y0, y1] = sy > 0 ? [yc + R, yc + HY] : [yc - HY, yc - R]
    box(stone, x0, x1, y0, y1, SILL, CORN0, { r: 0.3, bottom: false })
  }
  const ends: Face = (a, z, n) => [a, yc + n, z]        // openings facing along the bridge
  const sides: Face = (a, z, n) => [n, yc + a, z]       // openings facing across it
  archHead(stone, ends, R, SPRING, CORN0, -HY, HY)
  archHead(stone, sides, R, SPRING, CORN0, -HX, HX)
  for (const sy of [-1, 1]) box(stone, -R - 0.6, R + 0.6, sy > 0 ? yc + HY : yc - HY - 1.0, sy > 0 ? yc + HY + 1.0 : yc - HY, SILL - 1.6, SILL, { r: 0.2 })
  for (const sx of [-1, 1]) box(stone, sx > 0 ? HX : -HX - 1.0, sx > 0 ? HX + 1.0 : -HX, yc - R - 0.6, yc + R + 0.6, SILL - 1.6, SILL, { r: 0.2 })
  // The opening's floor.
  box(stone, -R, R, yc - HY, yc + HY, SILL - 0.01, SILL, { r: 0, bottom: false })
  box(stone, -HX, HX, yc - R, yc + R, SILL - 0.01, SILL, { r: 0, bottom: false })

  // Cornice and parapet.
  box(stone, -18.4, 18.4, yc - 12.4, yc + 12.4, CORN0, CORN1, { r: 0.4, bot: 0.6, top: 0.2, bottom: true })
  box(stone, -17.2, 17.2, yc - 10.6, yc + 10.6, CORN1, TOP - 0.8, { r: 0.3, bottom: false })
  box(stone, -17.5, 17.5, yc - 10.9, yc + 10.9, TOP - 0.8, TOP, { r: 0.3, top: 0.2, bottom: true })
}

const STEEL: Swatch = finish('hell-gate-red', 0xa8676b)
const STONE: Swatch = finish('granite', 0xd3cab9)
const ROAD: Swatch = finish('deck', 0x8a8580)
const parts = [{ part: steel, material: STEEL }, { part: stone, material: STONE }, { part: road, material: ROAD }]
const triangles = countParts(parts)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Hell Gate Bridge', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at mid-span on the water',
  height: zt(0) + 1.8, bearing: 314.6, elevation: 0,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
await Bun.write(new URL('../models/nyc-hell-gate-bridge.glb', import.meta.url), glb)
console.log(`nyc-hell-gate-bridge.glb: ${triangles} triangles, ${glb.length} bytes`)
