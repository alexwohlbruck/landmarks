/**
 * The Watergate complex — procedural, CC0-1.0, no textures.
 * bun generators/dc-watergate.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0°. The anchor is the
 * area centroid of the OSM outline way/66417587 (lng -77.0552848, lat
 * 38.8988385), which maps the whole complex as one building.
 *
 * What it is: Luigi Moretti's six buildings (1963–71) on the Potomac: three
 * curving apartment buildings (Watergate East, South and West), the hotel
 * and office building on Virginia Avenue, and the round Watergate 600
 * office building at the south end, over a common garage. The identity is
 * the curving, wave-like white buildings wrapped floor by floor in
 * continuous projecting balconies with toothed precast railings. The
 * balconies are drawn two floors to a band, each a broad white slab (2.1 m
 * tall) standing 1.8 m proud of a dark recessed window band, so the bands
 * read as relief, not painted stripes, and stay clear of stripe moiré at
 * phone size (one band a floor aliased at 200 px). The Watergate 600
 * office building has shallower window bands (1.0 m) instead of balconies,
 * as it does in reality.
 *
 * Covers and replaces: the outline way/66417587 (all six buildings' plan
 * as one polygon), Watergate West's own outline way/445989816 (inside it),
 * and every building:part inside the outline: 445989815, 445989817,
 * 445989818, 445989819, 445989821, 445989823, 445989825, 445989828,
 * 445989830, 445989831, 445989835, 445989839, 445989841 and 445989846.
 * Because the client hides by OSM id and the outline is one
 * polygon, the model has to cover every building in it; it does.
 *
 * How the outline is split (measured on the outline's vertices, checked on
 * the NAIP orthophoto): Watergate West (vertices 173–186), the hotel and
 * office block on Virginia Avenue (147–172 and 186–13), Watergate East
 * (13–43 and 134–147), the low link between East and South (43–50, 127–134),
 * Watergate South (86–127), the Watergate 600 podium (50–86) with its
 * tower from part 445989823 and its penthouse from part 445989825; the
 * hotel's taller part from 445989828. The
 * outline is simplified to 1.2 m.
 *
 * Evidence
 * - OSM (measured): the outline and parts above; Watergate West height 42,
 *   building:levels 13; hotel part 12 levels with a 13th on top; Watergate
 *   600's tower 12 levels and podium (445989821) 6; link parts 1–3 levels.
 * - Published (Wikipedia, "Watergate complex"; NRHP 2005): architect Luigi
 *   Moretti; three apartment buildings cut to 13 storeys (112 ft) by the
 *   1962 agreement; Watergate East 110 ft; the 12-storey hotel and office
 *   building; Watergate South 1968, West 1969; the 600 building turned to
 *   the south-west in 1968.
 * - Photos (Wikimedia Commons): "2013 Watergate complex 01.JPG" and "2013
 *   Watergate complex 02.JPG" (Farragutful, CC BY-SA 3.0), from the
 *   parkway and from the Kennedy Center roof; "Watergate.jpg" (Allen Lew,
 *   CC BY 2.0); "Watergate Complex.JPG" and "Watergate Complex2.JPG"
 *   (AgnosticPreachersKid, CC BY-SA 3.0); "Watergate Complex
 *   (55264711403).jpg" (ajay_suresh, CC BY 4.0); "Aerial view of the
 *   infamous Watergate Hotel.jpg" (Carol M. Highsmith, public domain), from
 *   above the south-west; "WatergateFromAir.JPG" (Indutiomarus, public
 *   domain); "Watergate complex, 2025.jpg" (PRRfan, CC BY-SA 4.0);
 *   "WatergateComplex.JPG" (G0T0, CC0).
 * - USGS NAIP orthophoto (public domain): the plan and the split.
 * - Estimated: a 3 m ground storey and 3.0 m floors from y = 0 (the
 *   parkway side; the Virginia Avenue side stands a few metres higher and
 *   its lowest band sinks into the slope); East, South and West 13 floors
 *   (42 m, OSM's West height); the hotel and office block 12 (the office
 *   wing is drawn at the hotel's 12, not its own 11); the 600 podium 6 and tower 12, the
 *   link 3.
 * - Simplified: the hotel's partial 13th storey (part 445989841) is left
 *   off, its mapped outline being too ragged to cap cleanly; the railings' teeth are not drawn (too fine for map
 *   scale); the rooftop water tanks and plant are left out; the garden
 *   courts and pools are the map's.
 */
import { Part, cross, len, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save } from './dc-white-house'

type Pt = [number, number, number] // x, y, 1 if the edge to the next vertex is a party wall

// Building plans (OSM, simplified), counter-clockwise.
const PLAN: Record<string, Pt[]> = {
  west: [[-52.5, 106.2, 0], [-42.1, 120.2, 0], [-42.6, 125.1, 0], [-71.1, 143.9, 0], [-116.7, 164.7, 0], [-105.3, 127.1, 0], [-58.6, 99.6, 1]],
  east: [[16.3, 51.8, 0], [31.1, 42.6, 0], [53.7, 24.2, 0], [69.3, 8.3, 0], [73.1, 2.0, 0], [75.3, -11.0, 0], [72.0, -22.2, 0], [64.1, -30.8, 0], [48.7, -35.5, 1], [54.1, -50.6, 0], [60.7, -53.9, 0], [68.2, -54.5, 0], [75.3, -52.3, 0], [81.8, -47.6, 0], [93.5, -33.5, 0], [99.9, -14.8, 0], [102.5, -16.3, 0], [105.6, -13.1, 0], [106.4, -1.6, 0], [101.3, 11.8, 0], [98.4, 13.3, 0], [96.1, 11.8, 0], [88.8, 23.4, 0], [51.9, 57.8, 0], [36.6, 68.5, 0], [29.7, 70.6, 0], [23.6, 69.8, 1]],
  south: [[33.0, -46.3, 0], [25.2, -37.3, 0], [12.5, -29.0, 0], [4.4, -26.0, 0], [-11.0, -23.9, 0], [-27.4, -26.5, 0], [-36.1, -30.1, 0], [-49.4, -40.0, 0], [-56.5, -50.8, 0], [-59.1, -61.5, 0], [-57.9, -69.9, 0], [-55.6, -75.2, 0], [-47.9, -83.4, 0], [-40.9, -72.0, 0], [-31.1, -61.3, 0], [-22.3, -54.9, 0], [-14.2, -52.7, 0], [-0.6, -54.9, 0], [6.9, -60.3, 0], [11.8, -68.2, 0], [12.9, -81.6, 0], [15.8, -82.0, 1]],
  podium600: [[15.8, -82.0, 0], [15.8, -85.9, 0], [-0.8, -85.1, 0], [-6.0, -86.3, 0], [-14.5, -91.8, 0], [-22.6, -104.1, 0], [-24.9, -121.0, 0], [-23.8, -126.7, 0], [-18.0, -136.9, 0], [-8.5, -143.6, 0], [-2.5, -145.4, 0], [3.2, -146.0, 0], [14.2, -143.3, 0], [25.4, -134.6, 0], [41.1, -115.4, 0], [46.2, -100.0, 0], [46.7, -86.2, 0], [44.8, -76.6, 0], [47.2, -75.7, 0], [41.5, -60.0, 1]],
  link: [[48.7, -35.5, 0], [48.7, -39.3, 0], [40.0, -40.7, 0], [37.8, -45.3, 0], [33.0, -46.3, 1], [15.8, -82.0, 1], [41.5, -60.0, 0], [43.8, -56.4, 0], [46.4, -58.6, 0], [49.0, -57.5, 0], [54.1, -50.6, 1]],
  north: [[23.6, 69.8, 0], [18.7, 66.7, 0], [14.3, 60.5, 0], [6.1, 65.6, 0], [16.3, 81.4, 0], [6.3, 88.6, 0], [4.1, 94.0, 0], [-16.6, 108.3, 0], [-21.7, 108.1, 0], [-33.1, 115.8, 0], [-44.3, 100.7, 0], [-52.5, 106.2, 1], [-53.7, 98.7, 0], [-32.4, 84.6, 0], [-32.0, 79.2, 0], [-34.4, 76.6, 0], [-39.5, 76.1, 0], [-44.2, 78.3, 0], [-60.7, 60.2, 0], [-83.0, 44.7, 0], [-78.4, 34.3, 0], [-80.1, 33.7, 0], [-74.9, 14.8, 0], [-62.8, 26.7, 0], [-22.6, 58.0, 0], [-12.2, 61.2, 0], [1.7, 61.0, 0], [16.3, 51.8, 1]],
  hotel: [[-44.3, 100.7, 0], [-47.6, 94.1, 0], [-32.4, 84.6, 0], [-32.0, 79.2, 0], [-34.4, 76.6, 0], [-39.5, 76.1, 0], [-44.2, 78.3, 0], [-60.7, 60.2, 0], [-83.0, 44.7, 0], [-78.4, 34.3, 0], [-80.1, 33.7, 0], [-74.9, 14.8, 0], [-62.8, 26.7, 0], [-22.6, 58.0, 0], [-24.3, 63.1, 0], [-22.9, 68.0, 0], [-16.4, 71.9, 0], [-11.6, 71.2, 0], [1.7, 61.0, 0], [16.3, 81.4, 0], [-33.1, 115.8, 0]],
  hotelTop: [[-40.4, 72.8, 0], [-43.5, 65.3, 0], [-41.4, 62.1, 0], [-38.9, 61.7, 0], [-38.0, 56.7, 0], [-35.4, 55.8, 0], [-30.2, 57.3, 0], [-22.8, 70.4, 0], [-16.4, 73.3, 0], [-12.8, 77.8, 0], [-5.8, 72.5, 0], [-2.0, 72.5, 0], [5.2, 77.4, 0], [6.6, 82.8, 0], [3.6, 87.6, 0], [-11.3, 96.1, 0], [-12.0, 98.5, 0], [-20.9, 104.5, 0], [-27.0, 106.3, 0], [-32.3, 103.8, 0], [-34.6, 95.8, 0], [-31.6, 91.2, 0], [-25.5, 87.2, 0], [-27.6, 83.0, 0], [-29.6, 82.9, 0], [-29.4, 78.8, 0], [-32.2, 74.9, 0]],
  tower600: [[-18.0, -121.5, 0], [-14.2, -131.1, 0], [-7.2, -138.0, 0], [4.0, -142.1, 0], [15.2, -140.5, 0], [25.4, -134.6, 0], [36.8, -122.0, 0], [44.5, -107.5, 0], [46.2, -100.0, 0], [46.7, -86.2, 0], [44.5, -83.7, 0], [15.8, -85.9, 0], [9.9, -101.9, 0], [1.9, -111.3, 0]],
  top600: [[4.0, -128.2, 0], [6.3, -127.3, 0], [8.7, -131.0, 0], [14.3, -130.7, 0], [22.1, -119.9, 0], [19.1, -114.5, 0], [14.6, -114.3, 0], [2.3, -126.0, 0]],}

const conc = new Part(), win = new Part(), roof = new Part()
// Bands are grouped two floors each: per-floor stripes alias at phone size.
const BASE = 3.0, FL = 3.0, LEDGE = 2.1, PER = 2

type XY = [number, number]
const norm2 = (x: number, y: number): XY => { const l = Math.hypot(x, y) || 1; return [x / l, y / l] }

/** Outward unit normal of edge i (CCW ring: outward is to the right). */
function edgeN(r: Pt[], i: number): XY {
  const a = r[i], b = r[(i + 1) % r.length]
  return norm2(b[1] - a[1], -(b[0] - a[0]))
}

/** The ring offset inward by d, mitred, the miter clamped. */
function inset(r: Pt[], d: number): Pt[] {
  const n = r.length
  return r.map((p, i) => {
    const n0 = edgeN(r, (i - 1 + n) % n), n1 = edgeN(r, i)
    let [mx, my] = norm2(n0[0] + n1[0], n0[1] + n1[1])
    const c = Math.max(0.5, mx * n1[0] + my * n1[1])
    return [p[0] - (mx * d) / c, p[1] - (my * d) / c, p[2]] as Pt
  })
}

/** Per-vertex smooth normals where the ring bends gently, so curves shade smoothly. */
function vnormals(r: Pt[], i: number): [XY, XY] {
  const n = r.length, e = edgeN(r, i)
  const pick = (k: number): XY => {
    const a = edgeN(r, (k - 1 + n) % n), b = edgeN(r, k)
    return a[0] * b[0] + a[1] * b[1] > 0.8 ? norm2(a[0] + b[0], a[1] + b[1]) : e
  }
  return [pick(i), pick((i + 1) % n)]
}

/** Walls round a ring between z0 and z1; `only` filters edges. */
function walls(p: Part, r: Pt[], z0: number, z1: number, only: (i: number) => boolean = () => true) {
  const n = r.length
  for (let i = 0; i < n; i++) {
    if (!only(i)) continue
    const a = r[i], b = r[(i + 1) % n], [na, nb] = vnormals(r, i)
    const A0: V3 = [a[0], a[1], z0], B0: V3 = [b[0], b[1], z0], A1: V3 = [a[0], a[1], z1], B1: V3 = [b[0], b[1], z1]
    const NA: V3 = [na[0], na[1], 0], NB: V3 = [nb[0], nb[1], 0]
    p.tri(A0, B0, B1, undefined, undefined, undefined, [NA, NB, NB])
    p.tri(A0, B1, A1, undefined, undefined, undefined, [NA, NB, NA])
  }
}

/** Ear-clipping cap over a simple CCW ring at height z. */
function cap(p: Part, r: Pt[], z: number) {
  const idx = r.map((_, i) => i)
  const pt = (i: number) => r[i]
  const crossZ = (a: Pt, b: Pt, c: Pt) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (q: Pt, a: Pt, b: Pt, c: Pt) => crossZ(a, b, q) > 0 && crossZ(b, c, q) > 0 && crossZ(c, a, q) > 0
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k - 1 + idx.length) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = pt(i0), b = pt(i1), c = pt(i2)
      if (crossZ(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(pt(j), a, b, c))) continue
      p.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) { const [a, b, c] = idx.map(pt); p.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z]) }
}

/**
 * A banded building: a dark window core set `d` back, a white ledge at the
 * foot of each band (PER floors) standing proud of it, a plain ground storey,
 * a parapet and a roof. Party walls get a plain wall and no bands. `from`
 * starts the walls at that floor, for a tower rising out of a lower block.
 */
function banded(r: Pt[], floors: number, d: number, from = 0) {
  const core = inset(r, d), n = r.length
  const open = (i: number) => !r[i][2]
  const topF = BASE + floors * FL, top = topF + 1.0, z0 = from ? BASE + from * FL : 0
  if (!from) walls(conc, r, 0, BASE, open)
  walls(win, core, from ? z0 : BASE, topF, open)
  for (let f = from; f < floors; f += PER) {
    const a = BASE + f * FL, b = a + LEDGE
    walls(conc, r, a, b, open)
    // The ledge's top: a quad per edge between the ring and the core.
    for (let i = 0; i < n; i++) {
      if (!open(i)) continue
      const j = (i + 1) % n
      conc.quad([core[i][0], core[i][1], b], [r[i][0], r[i][1], b], [r[j][0], r[j][1], b], [core[j][0], core[j][1], b])
    }
  }
  walls(conc, r, topF, top, open)
  walls(conc, r, z0, top, (i) => !open(i))
  cap(roof, r, top)
  return top
}

/** A plain block (rooftop storeys, plant), white walls and a roof. */
function block(r: Pt[], z0: number, z1: number) {
  walls(conc, r, z0, z1)
  cap(roof, r, z1)
}

// Apartment buildings: deep balconies.
banded(PLAN.west, 13, 1.8)
banded(PLAN.east, 13, 1.8)
banded(PLAN.south, 13, 1.8)
// The hotel and office block, at the hotel's 12 floors throughout.
banded(PLAN.north, 12, 1.8)
// The low link between East and South.
banded(PLAN.link, 3, 1.5)
// Watergate 600: office window bands, podium and tower.
banded(PLAN.podium600, 6, 1.0)
const t600 = banded(PLAN.tower600, 12, 1.0, 6)
block(PLAN.top600, t600, t600 + 3.5)

await save('dc-watergate', 'Watergate complex', [
  { part: conc, material: finish('watergate-precast', 0xf1ede5) },
  { part: win, material: PALETTE.window },
  { part: roof, material: finish('watergate-roof', 0xd0cfca) },
], { bearing: 0, osm: 'way/66417587', footprint: [223.3, 310.7], height: t600 + 3.5 }, 6500)
