/**
 * Chicago Temple Building (77 West Washington, 1924, Holabird & Roche),
 * home of the First United Methodist Church — original procedural geometry,
 * CC0-1.0.
 * bun generators/chi-chicago-temple.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/137060374,
 * 41.882859,-87.630615. Its walls run at 359.5° / 89.5°, so the catalog
 * bearing is 359.5 and the block is square to its own frame.
 *
 * Identity, in order: the pale limestone office slab carrying, at its
 * Washington Street (north) end, an openwork Gothic lantern ringed with
 * pinnacles and a tall slender octagonal spire; the pinnacled Gothic
 * parapet round the top of that north end; the plain slab below with its
 * window columns.
 *
 * Evidence:
 *  - plan: OSM outline, 25.4 × 55.6 m. The raised north end, the lantern and
 *    the spire stand over the northern ~25 m (USGS NAIP shows the lantern's
 *    octagon and pinnacles there, the rest of the roof flat and lower).
 *  - heights: 173 m (568 ft) to the top of the cross, published. Sky Chapel
 *    "at the base of the steeple" at 400 ft (122 m), with the three-floor
 *    parsonage below it in the lantern, published; so the lantern runs from
 *    the top of the north end (~92 m) to ~130 m and the spire ~130–172 m.
 *    The main slab’s parapet (~86 m) and the north end’s (~92 m) are read
 *    off DS1953's and Antoine Taveneaux's photos from the north-east
 *    against that total (estimates).
 *  - widths: the lantern ~16 m across, the spire’s base ~11 m, against the
 *    25.4 m north face in the same photos (estimates).
 *  - colour: grey-white Indiana limestone, the palette stone; the spire is
 *    a pale stone, trim.
 *
 * Photos (Wikimedia Commons): Chicago_Temple_Building.jpg (DS1953, CC BY-SA
 * 2.5); Chicago_Temple_Building5.jpg (Antoine Taveneaux, CC BY-SA 3.0);
 * Chicago_-_Temple_-_01.jpg (HaSt, CC BY-SA 4.0); Methodist_Temple_
 * (Chicago).jpg (Chris Light, CC BY-SA 4.0); Chicago_Temple_Building_01.jpg
 * (Sailko, public domain); Chicago_Temple_Building_(First_United_Methodist_
 * Church).jpg (Cameron Murray, CC BY-SA 4.0); Atop_Chicago_(5394336267).jpg
 * (edward stojakovic, CC BY 2.0). No commercial imagery.
 *
 * Left out: the tracery, crockets and gargoyles; the pointed-arch ground
 * floor; the cross is a slim post.
 */
import { Part, type V3 } from './mesh'
import { PALETTE } from './palette'
import { cap, inset, panel, rect, rows, save, walls, type XY } from './chi-aon-center'
import { box } from './chi-board-of-trade'

const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part()

const HX = 12.7, S = -27.8, N = 27.8
const H1 = 86, H2 = 92 // slab parapet, north end's parapet
const NS = 2.8 // the raised north end runs from here to N
const LX = 0, LY = (NS + N) / 2 // lantern centre
const L1 = 130, TIP = 172

/** A regular octagon `w` across the flats, flats facing the axes. */
const oct = (cx: number, cy: number, w: number): XY[] => Array.from({ length: 8 }, (_, i) => {
  const a = Math.PI / 8 + (i * Math.PI) / 4, r = w / 2 / Math.cos(Math.PI / 8)
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as XY
})

/** A square pinnacle: a shaft and a steep four-sided point. */
function pinnacle(p: Part, x: number, y: number, w: number, z0: number, z1: number, tip: number) {
  const r = rect(x - w / 2, y - w / 2, x + w / 2, y + w / 2)
  walls(p, r, z0, z1)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    p.tri([r[i][0], r[i][1], z1], [r[j][0], r[j][1], z1], [x, y, tip])
  }
}

// The slab, the raised north end, their parapets.
const slab = rect(-HX, S, HX, N)
walls(stone, slab, 0, H1 - 0.5)
walls(trim, slab, H1 - 0.5, H1, inset(slab, 0.4))
cap(roof, rect(-HX + 0.4, S + 0.4, HX - 0.4, NS), H1)
const north = rect(-HX, NS, HX, N)
walls(stone, rect(-HX, NS, HX, N), H1 - 0.5, H2 - 1.2)
// The north end's Gothic parapet: a trim band, a little proud.
walls(trim, inset(north, -0.15), H2 - 1.2, H2)
cap(roof, inset(north, -0.15), H2)

// Pinnacles at the north end's corners and on the buttresses of its fronts.
for (const [x, y] of [[-HX, N], [HX, N], [-HX, NS], [HX, NS]] as XY[]) pinnacle(trim, x, y, 2.2, H2 - 2, H2 + 9, H2 + 14)
for (const x of [-4.6, 4.6]) pinnacle(trim, x, N - 0.4, 1.4, H2 - 1, H2 + 5, H2 + 9)
for (const y of [NS + 8.3, NS + 16.7]) for (const x of [-HX + 0.4, HX - 0.4]) pinnacle(trim, x, y, 1.4, H2 - 1, H2 + 5, H2 + 9)

// The lantern: a square-ish base drum, the octagon with tall openings and
// pinnacles at its corners, a parapet, then the spire.
box(stone, roof, LX - 9.4, LY - 9.4, LX + 9.4, LY + 9.4, H2, H2 + 7, 0.4)
const lan = oct(LX, LY, 16)
walls(stone, lan, H2 + 7, L1 - 1.4)
walls(trim, inset(lan, -0.2), L1 - 1.4, L1)
cap(roof, inset(lan, -0.2), L1)
for (let i = 0; i < 8; i++) {
  const a = lan[i], b = lan[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  // Two tiers of tall pointed openings: the parsonage, then the Sky Chapel.
  panel(win, a, b, L * 0.25, L * 0.75, H2 + 9, H2 + 17, 0.05)
  panel(win, a, b, L * 0.22, L * 0.78, H2 + 19.5, L1 - 2.5, 0.05)
  win.tri(...([[L * 0.22, L1 - 2.5], [L * 0.78, L1 - 2.5], [L * 0.5, L1 - 1.6]] as [number, number][]).map(([s, z]) => {
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    return [a[0] + u[0] * s + n[0] * 0.05, a[1] + u[1] * s + n[1] * 0.05, z] as V3
  }) as [V3, V3, V3])
  // Corner pinnacles standing just off the lantern's angles.
  const k = 1.12
  pinnacle(trim, LX + (a[0] - LX) * k, LY + (a[1] - LY) * k, 1.3, H2 + 7, L1 - 4, L1 + 2.5)
}
// A ring of tall pinnacles on the drum, between the corners and the
// lantern, so the crown steps up to it as a cluster.
for (let i = 0; i < 8; i++) {
  const t = (i + 0.5) * Math.PI / 4, r = 10.6
  pinnacle(trim, LX + r * Math.cos(t), LY + r * Math.sin(t), 1.2, H2, H2 + 15, H2 + 20)
}
// Small pinnacles round the base drum.
for (const [x, y] of [[-9.4, -9.4], [9.4, -9.4], [9.4, 9.4], [-9.4, 9.4]] as XY[]) pinnacle(trim, LX + x, LY + y, 1.6, H2 + 6, H2 + 10, H2 + 16)

// The spire: an octagonal needle on a short plinth, a cross post at the top.
{
  const base = oct(LX, LY, 11)
  walls(trim, base, L1, L1 + 1.5)
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    trim.tri([base[i][0], base[i][1], L1 + 1.5], [base[j][0], base[j][1], L1 + 1.5], [LX, LY, TIP])
  }
  box(trim, trim, LX - 0.25, LY - 0.25, LX + 0.25, LY + 0.25, TIP - 1, TIP + 1.2, 0.05)
  box(trim, trim, LX - 0.9, LY - 0.2, LX + 0.9, LY + 0.2, TIP + 0.2, TIP + 0.6, 0.05)
}

// Windows: three-storey groups in columns. The slab's floors are ~3.6 m.
const groups = rows(9, H1 - 2, 7, 1.1)
const top = rows(H1 + 0.5, H2 - 2, 1, 1.1)
// The east wall stands against 69 West Washington and is blank but for the
// window columns near its north end (DS1953's photo); the others are
// punched windows in pairs, drawn as narrow three-storey panels.
const faces: [XY, XY, number, number, number][] = [
  [[HX, N], [-HX, N], 8, 0, 8], // north (Washington)
  [[-HX, N], [-HX, S], 18, 0, 18], // west (Clark)
  [[-HX, S], [HX, S], 8, 0, 8], // south
  [[HX, S], [HX, N], 18, 14, 18], // east: only the last four columns
]
for (const [a, b, n, k0, k1] of faces) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), end = 2.2, pitch = (L - 2 * end) / n
  for (let k = k0; k < k1; k++) {
    const s0 = end + k * pitch + pitch * 0.33, s1 = end + (k + 1) * pitch - pitch * 0.33
    for (const [z0, z1] of groups) panel(win, a, b, s0, s1, z0, z1)
    panel(win, a, b, s0, s1, 2.5, 7.0) // street storey
  }
}
// The north end's top storeys on its three street faces, the east wall blank.
for (const [a, b] of [[[HX, N], [-HX, N]], [[-HX, N], [-HX, NS]]] as [XY, XY][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = 8, pitch = (L - 4.4) / n
  for (let k = 0; k < n; k++) for (const [z0, z1] of top) panel(win, a, b, 2.2 + k * pitch + pitch * 0.33, 2.2 + (k + 1) * pitch - pitch * 0.33, z0, z1)
}

await save('chi-chicago-temple', 'Chicago Temple Building', [41.882859, -87.630615], 359.5, [
  { part: stone, material: PALETTE.stone },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
])
