/**
 * The Westin Seattle (south tower 1969, north tower 1982; John Graham &
 * Company), Seattle — original procedural geometry, CC0-1.0.
 * bun generators/sea-westin-towers.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the OSM
 * outline's area centroid, -122.3382051, 47.6137035) on the lowest ground
 * under the footprint (30.8 m NAVD88, on Westlake Avenue at the east corner;
 * 5th Avenue on the west is about 5 m higher). Bearing 0: the towers are
 * round, and the podium is drawn in true coordinates.
 *
 * Form: two round hotel towers on a shared podium. Each tower's wall is a
 * ring of 16 shallow bowed lobes, the scalloped "corncob" outline, wrapped
 * by continuous window ribbons between concrete balcony bands; each is capped by a flared cantilevered
 * cornice ring and a round penthouse drum. The north tower is the taller.
 * The podium steps from a 27 m block between the towers down to 21, 14 and
 * 8 m around them.
 *
 * Sources
 * - OSM: outline way/331291911; parts way/331281882 (north tower),
 *   way/331281881 (south tower), way/488733959 and way/488733958 (their
 *   drums), way/770565574 (the main podium block), way/770565573 (the low
 *   podium). Tower centres and radii from OSM (north r 17.0 m, south 16.7 m).
 * - Lidar (measured, USGS 3DEP WA_KingCo_1_2021, above 30.8 m NAVD88):
 *   north tower cornice 140.5 m, roof inside it 138.7 m, drum 147.5 m; south
 *   tower cornice 119.5 m, roof 117.7 m, drum 124 m; podium block 26.7 m,
 *   the lower podium 21 m, east strip 14.5 m, south edge 6-8 m.
 * - Published: north tower 47 storeys, south tower 40 storeys (Wikipedia,
 *   "Westin Seattle").
 * - Photos (Wikimedia Commons): Davidphogan74 (both crowns from below),
 *   SounderBruce (both towers from the Hyatt at Olive 8), Joe Mabel (south
 *   tower from the south), John Martinez Pavliga (north tower from the
 *   Space Needle), Chris06 (both towers), Guilhem Vellut.
 * Estimated: the lobe count (16 around; the real towers have about 18-20
 *   narrower bays, drawn broader as the style asks), the lobes' bulge
 *   (1.6 m), window ribbons grouped three storeys, the concrete colour
 *   (warm taupe from the daylight photos, lightened), the cornice profile, the
 *   podium's plan simplified to four levels.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Prism, capRing, ccw, edgeBase, emit, finishGlb, outward, turn } from './sea-two-union-square'

const SMOOTH = 25 // degrees: shade smoothly across a bay, crisply at a pier

function vn(r: XY[], i: number): XY | undefined {
  if (Math.abs(turn(r, i)) >= SMOOTH) return undefined
  const p = r[(i - 1 + r.length) % r.length], q = r[i], s = r[(i + 1) % r.length]
  const a = outward(p, q), b = outward(q, s), l = Math.hypot(a[0] + b[0], a[1] + b[1])
  return [(a[0] + b[0]) / l, (a[1] + b[1]) / l]
}
/** A wall over edge i, pushed `d` off the face (0 for the wall itself). */
function wall(part: Part, r: XY[], i: number, z0: number, z1: number, d = 0) {
  const j = (i + 1) % r.length, a = r[i], b = r[j], n = outward(a, b)
  const na = vn(r, i) ?? n, nb = vn(r, j) ?? n
  const off = (p: XY, m: XY): XY => { const c = Math.max(0.5, m[0] * n[0] + m[1] * n[1]); return [p[0] + (m[0] * d) / c, p[1] + (m[1] * d) / c] }
  const P = off(a, na), Q = off(b, nb)
  const N = (v: XY): V3 => [v[0], v[1], 0]
  part.tri([P[0], P[1], z0], [Q[0], Q[1], z0], [Q[0], Q[1], z1], undefined, undefined, undefined, [N(na), N(nb), N(nb)])
  part.tri([P[0], P[1], z0], [Q[0], Q[1], z1], [P[0], P[1], z1], undefined, undefined, undefined, [N(na), N(nb), N(na)])
}

type Tower = { c: XY; R: number; rim: number; roof: number; drumR: number; drum: number; floor: number }

const LOBES = 16, LOBE_SEGS = 4, BULGE = 1.6

/** The scalloped ring: 16 shallow bowed lobes meeting in creases, crests at radius R. */
function scallop(t: Tower): XY[] {
  const rp = t.R - BULGE, ring: XY[] = [], step = (2 * Math.PI) / LOBES
  for (let k = 0; k < LOBES; k++)
    for (let s = 0; s < LOBE_SEGS; s++) {
      const u = s / LOBE_SEGS, a = k * step + step * u, r = rp + BULGE * Math.sin(Math.PI * u)
      ring.push([t.c[0] + r * Math.cos(a), t.c[1] + r * Math.sin(a)])
    }
  return ring
}

function circle(c: XY, r: number, n: number): XY[] {
  return Array.from({ length: n }, (_, k) => [c[0] + r * Math.cos((2 * Math.PI * k) / n), c[1] + r * Math.sin((2 * Math.PI * k) / n)] as XY)
}

function build() {
  const concrete = new Part(), win = new Part(), metal = new Part(), roof = new Part()

  const N: Tower = { c: [-33.8, 8.45], R: 17.0, rim: 140.5, roof: 138.7, drumR: 5.9, drum: 147.5, floor: 2.9 }
  const S: Tower = { c: [22.1, -34.75], R: 16.7, rim: 119.5, roof: 117.7, drumR: 5.5, drum: 124.0, floor: 2.9 }
  const CORNICE = 3.4 // depth of the flared cornice band

  // ---- podium (from the OSM outline and parts; heights from lidar)
  const OUTLINE: XY[] = [
    [-45.0, -4.5], [-49.1, 0.8], [-50.9, 7.2], [-50.0, 13.9], [-46.7, 19.6], [-43.8, 22.3], [-43.0, 23.3], [-10.5, 60.1], [35.3, 20.2], [31.9, 16.4],
    [35.8, 13.0], [40.4, -28.0], [38.7, -29.2], [39.4, -35.9], [38.8, -40.1], [40.8, -41.3], [41.0, -43.9], [39.7, -45.5], [37.8, -45.6], [37.8, -47.8],
    [36.1, -49.7], [34.2, -49.7], [34.1, -51.9], [32.4, -53.8], [30.3, -53.3], [30.4, -56.0], [28.4, -58.2], [25.7, -58.3], [23.3, -56.5], [23.4, -52.7],
    [19.2, -52.3], [19.0, -59.4], [18.0, -60.7], [5.0, -49.9], [6.4, -48.0],
  ]
  const MID: XY[] = [
    [-45.0, -4.5], [6.4, -48.0], [8.0, -46.0], [22.1, -34.75], [33.0, -26.0], [32.0, -2.6], [31.9, 16.4], [35.3, 20.2], [-10.5, 60.1],
    [-43.0, 23.3], [-43.8, 22.3], [-46.7, 19.6], [-50.0, 13.9], [-50.9, 7.2], [-49.1, 0.8],
  ]
  const EAST: XY[] = [[31.9, 16.4], [35.8, 13.0], [40.4, -28.0], [38.7, -29.2], [33.0, -26.0], [32.0, -2.6]]
  const BLOCK: XY[] = [
    [-25.3, -6.3], [-20.8, -2.7], [-18.0, 1.8], [-16.7, 7.0], [-17.1, 12.3], [-19.1, 17.2], [-22.5, 21.3], [-27.1, 24.1], [-32.3, 25.4], [-37.6, 25.0],
    [-43.8, 22.3], [-43.0, 23.3], [-10.5, 60.1], [35.3, 20.2], [31.9, 16.4], [23.7, 7.0], [24.7, -2.4], [17.6, -10.5], [-1.0, -12.3], [-4.9, -8.9],
    [-13.1, -18.1], [-24.4, -8.3],
  ]
  const tn = scallop(N), ts = scallop(S)
  const prisms: Prism[] = [
    { ring: ccw(OUTLINE), z1: 8, kind: 'podium' },
    { ring: ccw(EAST), z1: 14.5, kind: 'podium' },
    { ring: ccw(MID), z1: 21, kind: 'podium' },
    { ring: ccw(BLOCK), z1: 26.7, kind: 'podium' },
    { ring: tn, z1: N.rim - CORNICE, kind: 'north' },
    { ring: ts, z1: S.rim - CORNICE, kind: 'south' },
  ]
  for (const P of prisms.filter((p) => p.kind === 'podium')) {
    const r = P.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = edgeBase(prisms, P, i)
      if (z0 < P.z1 - 0.01) wall(concrete, r, i, z0, P.z1)
    }
    capRing(roof, r, P.z1)
  }

  // ---- the towers
  for (const [t, sc, P] of [[N, tn, prisms[4]], [S, ts, prisms[5]]] as const) {
    const r = sc, top = P.z1
    // continuous window ribbons round the drum, one per three storeys, with
    // the concrete balcony band between them
    const G = 3 * t.floor
    for (let i = 0; i < r.length; i++) {
      const z0 = edgeBase(prisms, P, i)
      if (z0 >= top - 0.01) continue
      wall(concrete, r, i, z0, top)
      for (let k = 0; k * G < top; k++) {
        // whole ribbons only, from the podium roofs up, so the foot does not break into fragments
        const lo = k * G + 1.8, hi = Math.min((k + 1) * G - 1.9, top - 1.2)
        if (lo >= Math.max(z0 + 0.5, 20) && hi - lo > 2.5) wall(win, r, i, lo, hi, 0.05)
      }
    }
    // the cornice: flares out from the wall to a thick lip
    const prof: [number, number][] = [[0, top], [0.7, top + 1.1], [1.3, top + 2.1], [1.5, t.rim - 0.3], [1.5, t.rim]]
    const rings = prof.map(([d, z]) => ({ z, r: circle(t.c, t.R + d, 32) }))
    for (let k = 0; k < rings.length - 1; k++) {
      const a = rings[k], b = rings[k + 1]
      for (let i = 0; i < 32; i++) {
        const j = (i + 1) % 32
        const nA = (p: XY): V3 => { const d: XY = [p[0] - t.c[0], p[1] - t.c[1]], l = Math.hypot(d[0], d[1]); const z = k < 2 ? -0.5 : 0, m = Math.hypot(1, z); return [d[0] / l / m, d[1] / l / m, z / m] }
        metal.tri([a.r[i][0], a.r[i][1], a.z], [a.r[j][0], a.r[j][1], a.z], [b.r[j][0], b.r[j][1], b.z], undefined, undefined, undefined, [nA(a.r[i]), nA(a.r[j]), nA(b.r[j])])
        metal.tri([a.r[i][0], a.r[i][1], a.z], [b.r[j][0], b.r[j][1], b.z], [b.r[i][0], b.r[i][1], b.z], undefined, undefined, undefined, [nA(a.r[i]), nA(b.r[j]), nA(b.r[i])])
      }
    }
    // the underside where the cornice meets the bays' crests
    const lip = rings[rings.length - 1].r, inner = circle(t.c, t.R + 1.0, 32)
    for (let i = 0; i < 32; i++) {
      const j = (i + 1) % 32
      // top of the lip, sloping in a little to the sunken roof
      metal.quad([lip[i][0], lip[i][1], t.rim], [lip[j][0], lip[j][1], t.rim], [inner[j][0], inner[j][1], t.rim], [inner[i][0], inner[i][1], t.rim])
      metal.quad([inner[i][0], inner[i][1], t.rim], [inner[j][0], inner[j][1], t.rim], [inner[j][0], inner[j][1], t.roof], [inner[i][0], inner[i][1], t.roof])
    }
    capRing(roof, inner, t.roof)
    // the penthouse drum
    const d = circle(t.c, t.drumR, 16)
    for (let i = 0; i < 16; i++) wall(concrete, d, i, t.roof, t.drum)
    capRing(roof, d, t.drum)
  }

  return finishGlb('The Westin Seattle', [
    { part: concrete, material: finish('westin-concrete', 0xb1a392) },
    { part: win, material: { ...PALETTE.window, color: 0x5d6a74 } },
    { part: metal, material: { ...PALETTE.metal, color: 0x8e7259 } },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 0, height: N.drum, replaces: REPLACES })
}

const REPLACES = ['way/331291911', 'way/331281882', 'way/331281881', 'way/488733959', 'way/488733958', 'way/770565574', 'way/770565573']

if (import.meta.main) await emit('sea-westin-towers', build())
