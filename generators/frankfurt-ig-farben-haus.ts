/**
 * IG-Farben-Haus (Poelzig-Bau), Campus Westend, Frankfurt am Main:
 * procedural, CC0-1.0.  bun generators/frankfurt-ig-farben-haus.ts
 *
 * Hans Poelzig's 1930 office building, now Goethe University's: a curved
 * spine 250 m long crossed by six radial wings, all in pale Cannstatt
 * travertine, flat roofs edged with a thin green copper coping, the
 * colonnaded main portal on the south (front) axis and the glazed round
 * pavilion (Eisenhower-Rotunde) on the north (garden) axis.
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin: the area
 * centroid of the outline way/321136070, 8.6674953 50.1254781; y = 0 is
 * the ground. The site slopes gently; see the terrain check in the report.
 *
 * OSM: outline way/321136070; parts Q1-Q6 (the wings) way/192302479,
 * way/192302468, way/229650593, way/229650592, way/192302482,
 * way/192302485; V1-V5 (the spine) way/23909727, way/192302466,
 * way/321136071, way/192302473, way/192302471; the rotunda way/192302461;
 * the entrance block way/321136069 and the portico way/1279349525. Plans
 * used as drawn (0.1 m). The casino and its annex (way/23909750,
 * way/28724300) are separate buildings 100 m north and are not modelled.
 *
 * Published (German Wikipedia, "I.G.-Farben-Haus"): 250 m long, 35 m high
 * (OSM: 35 m on every wing and spine part), nine storeys from 4.6 m at the
 * ground to 4.2 m at the top; a 10.9 m wide circular segment broken by six
 * radial wings; clad in Cannstatt travertine; windows in continuous bands
 * broken only by the emphasised corners; a fully glazed round pavilion on
 * the rear axis.
 *
 * Measured off "Poelzig-Bau, Frankfurt, South partial view 20140827 1.jpg"
 * (DXR), scaled from the 35 m height: the portico's columns 6.5 m, its
 * entablature to 9 m (OSM tags the entrance block 5 m; the photos win);
 * the rotunda's glazing to 7 m under a 2 m stone band (OSM: 9 m).
 *
 * Estimated: window panels grouped three storeys to a band (1.0-34.0 m,
 * 1.6 m spandrels), bays 2.8 m with 0.9 m piers and 1.6 m plain corners,
 * after the photos' rhythm (STYLE.md: no per-floor stripes); six square
 * portico pillars; the coping 0.6 m; the 1.0 m base course.
 * Left out: the lettering on the portico, the steps and ramps, the roof
 * plant, the bridge to the annex building.
 *
 * Colours (daylight photos, pulled to the palette): warm pale travertine,
 * grey roofs, the copper coping's pale green, slate-blue windows.
 * Night: windows glow; the rotunda's glazing is `window` (a lit hall);
 * the portal's doors are `entrance`.
 *
 * Photos (evidence, Wikimedia Commons):
 * - "Poelzig-Bau, Frankfurt, South partial view 20140827 1.jpg", DXR, CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:Poelzig-Bau,_Frankfurt,_South_partial_view_20140827_1.jpg
 * - "Poelzig-Bau, Frankfurt, South-west partial view 20140827 1.jpg", DXR, CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:Poelzig-Bau,_Frankfurt,_South-west_partial_view_20140827_1.jpg
 * - "IG Farben Building Back 1 Jan2009.jpeg", Marcin Cieślak, CC BY 3.0 (the rotunda, north side)
 *   https://commons.wikimedia.org/wiki/File:IG_Farben_Building_Back_1_Jan2009.jpeg
 * - "2017-08-09 171052 IG-Farben-Haus.jpg", Tim Rademacher, CC BY-SA 4.0 (from the north, across the garden)
 *   https://commons.wikimedia.org/wiki/File:2017-08-09_171052_IG-Farben-Haus.jpg
 * Look-only: none.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, ccw, capPoly, offset, edgePanels, type XY } from './atl-flatiron-building'

const PARTS: Record<string, { id: string; ring: XY[]; h: number }> = {
  Q1: { id: 'way/192302479', h: 35, ring: [[-108.6, -18.9], [-107.2, -7.1], [-107.1, -5.7], [-105.1, 11.4], [-123.2, 12.8], [-125.4, -7.8], [-125.9, -11.4], [-128.5, -37.2], [-110.9, -39.3]] },
  V1: { id: 'way/23909727', h: 35, ring: [[-76.9, -8.3], [-99.4, -7.4], [-107.2, -7.1], [-108.6, -18.9], [-76.6, -20.3]] },
  Q2: { id: 'way/192302468', h: 35, ring: [[-61.7, -20.0], [-61.7, -8.6], [-62.1, 0.7], [-67.4, 0.6], [-69.6, 0.6], [-72.8, 0.5], [-77.0, 0.4], [-76.9, -8.3], [-76.6, -20.3], [-76.2, -41.0], [-61.3, -40.7]] },
  V2: { id: 'way/192302466', h: 35, ring: [[-61.7, -20.0], [-29.0, -17.2], [-30.7, -5.7], [-34.2, -6.1], [-61.7, -8.6]] },
  Q3: { id: 'way/229650593', h: 35, ring: [[-11.8, -33.9], [-14.8, -14.9], [-16.5, -4.1], [-17.3, 1.5], [-18.0, 5.5], [-25.1, 4.4], [-32.1, 3.3], [-30.7, -5.7], [-29.0, -17.2], [-25.8, -37.4], [-11.6, -35.3]] },
  V3: { id: 'way/321136071', h: 35, ring: [[-16.5, -4.1], [13.0, 3.0], [16.2, -8.0], [-14.8, -14.9]] },
  Q4: { id: 'way/229650592', h: 35, ring: [[11.5, 8.1], [13.0, 3.0], [16.2, -8.0], [21.6, -26.3], [22.0, -27.9], [36.7, -23.6], [31.0, -3.8], [27.6, 6.9], [24.9, 15.9], [18.1, 13.9], [10.4, 11.6]] },
  V4: { id: 'way/192302473', h: 35, ring: [[61.7, 7.5], [57.1, 18.2], [28.6, 7.3], [27.6, 6.9], [31.0, -3.8], [60.2, 7.0]] },
  Q5: { id: 'way/192302482', h: 35, ring: [[61.7, 7.5], [70.0, -11.1], [83.2, -5.4], [74.8, 13.3], [70.4, 23.6], [66.7, 32.0], [60.1, 29.1], [57.5, 28.0], [53.5, 26.3], [57.1, 18.2]] },
  V5: { id: 'way/192302471', h: 35, ring: [[104.2, 28.8], [98.2, 38.3], [89.4, 33.6], [70.4, 23.6], [74.8, 13.3]] },
  Q6: { id: 'way/192302485', h: 35, ring: [[98.2, 38.3], [104.2, 28.8], [114.9, 12.0], [128.5, 20.5], [114.3, 43.2], [111.8, 47.3], [103.6, 60.0], [101.9, 62.3], [98.1, 59.9], [88.3, 53.8]] },
  rotunda: { id: 'way/192302461', h: 9, ring: [[-16.5, -4.1], [-17.3, 1.5], [-13.7, 2.3], [-15.1, 9.2], [-15.3, 11.5], [-14.9, 14.6], [-13.9, 17.3], [-13.1, 18.8], [-11.2, 20.8], [-9.3, 22.1], [-7.2, 22.7], [-3.6, 23.0], [-1.0, 22.3], [2.3, 20.5], [5.0, 16.9], [6.7, 13.0], [8.1, 7.2], [11.5, 8.1], [13.0, 3.0]] },
  entrance: { id: 'way/321136069', h: 9, ring: [[16.2, -8.0], [21.6, -26.3], [15.4, -28.0], [5.6, -30.3], [-6.3, -33.0], [-11.8, -33.9], [-14.8, -14.9]] },
}
const PORTICO: XY[] = [[-6.3, -33.0], [-5.2, -38.3], [-4.4, -42.4], [18.2, -37.6], [16.9, -33.1], [15.4, -28.0]] // way/1279349525

/** Ray-cast point in polygon. */
function inside(p: XY, r: XY[]) {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const a = r[i], b = r[j]
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c
  }
  return c
}

if (import.meta.main) await build()

async function build() {
  const trav = new Part(), roof = new Part(), win = new Part(), copper = new Part(), door = new Part()
  const rings = Object.fromEntries(Object.entries(PARTS).map(([k, v]) => [k, ccw(v.ring)])) as Record<string, XY[]>
  /** The height of whatever stands against an edge, sampled just outside its middle. */
  const against = (self: string, a: XY, b: XY) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    let h = 0
    for (const t of [0.25, 0.5, 0.75]) {
      const m: XY = [a[0] + (b[0] - a[0]) * t + n[0] * 0.6, a[1] + (b[1] - a[1]) * t + n[1] * 0.6]
      for (const [k, v] of Object.entries(PARTS)) if (k !== self && inside(m, rings[k])) h = Math.max(h, v.h)
      if (inside(m, PORTICO)) h = Math.max(h, 9)
    }
    return h
  }

  const COP = 0.6
  for (const [k, { h }] of Object.entries(PARTS)) {
    const r = rings[k]
    const tall = h > 20
    // Walls (all edges, so neighbours always close), roof inset under the coping.
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const hid = against(k, a, b)
      if (hid >= h) continue
      const z0 = hid
      if (k === 'rotunda' && hid === 0 && Math.hypot(b[0] - a[0], b[1] - a[1]) < 7 && a[1] > 1) {
        // The rotunda's curved glazing: glass to 7 m, a stone band above.
        win.quad([a[0], a[1], 0.5], [b[0], b[1], 0.5], [b[0], b[1], 7.0], [a[0], a[1], 7.0])
        trav.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], 0.5], [a[0], a[1], 0.5])
        trav.quad([a[0], a[1], 7.0], [b[0], b[1], 7.0], [b[0], b[1], h], [a[0], a[1], h])
        continue
      }
      trav.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], h - (tall ? COP : 0)], [a[0], a[1], h - (tall ? COP : 0)])
      if (tall && z0 === 0) {
        // The plinth: a travertine base course 1.0 m high, 0.18 m proud, with its top.
        const Lp = Math.hypot(b[0] - a[0], b[1] - a[1]), np: XY = [(b[1] - a[1]) / Lp * 0.18, -(b[0] - a[0]) / Lp * 0.18]
        const A: V3 = [a[0] + np[0], a[1] + np[1], 0], B: V3 = [b[0] + np[0], b[1] + np[1], 0]
        trav.quad(A, B, [B[0], B[1], 1.0], [A[0], A[1], 1.0])
        trav.quad([A[0], A[1], 1.0], [B[0], B[1], 1.0], [b[0], b[1], 1.0], [a[0], a[1], 1.0])
      }
      if (tall) {
        // Copper coping, a hair proud, with its top.
        const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L], o = 0.12
        const A: V3 = [a[0] + n[0] * o, a[1] + n[1] * o, h - COP], B: V3 = [b[0] + n[0] * o, b[1] + n[1] * o, h - COP]
        copper.quad([a[0], a[1], h - COP], [b[0], b[1], h - COP], B, A)
        copper.quad(A, B, [B[0], B[1], h], [A[0], A[1], h])
        copper.quad([A[0], A[1], h], [B[0], B[1], h], [b[0], b[1], h], [a[0], a[1], h])
        // Window bands, three storeys each, from above whatever stands against the wall.
        const zs = Math.max(1.0, hid + 1.2)
        if (34.0 - zs > 6 && L >= 6) {
          const nb = Math.max(1, Math.round((34.0 - zs) / 11)), gh = (34.0 - zs) / nb
          edgePanels(win, a, b, zs, 34.0, { group: gh, gap: 2.2, bay: 4.6, pier: 1.4, margin: 1.8, out: 0.05, min: 6 })
        }
      } else if (k === 'rotunda' && hid === 0) {
        edgePanels(win, a, b, 1.0, 6.8, { group: 5.8, gap: 0, bay: 2.4, pier: 0.6, margin: 0.6, out: 0.05, min: 2 })
      }
    }
    capPoly(roof, r, h, true)
  }

  // ── The portal: pillars and entablature over way/1279349525, doors behind ──
  {
    const P = ccw(PORTICO)
    // Entablature: a stone slab 7.0-9.0 m.
    const ring = P
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      if (against('portico', a, b) >= 9) continue
      trav.quad([a[0], a[1], 7.0], [b[0], b[1], 7.0], [b[0], b[1], 9.0], [a[0], a[1], 9.0])
    }
    capPoly(roof, ring, 9.0, true)
    capPoly(trav, ring, 7.0, false)
    // Six square pillars along the front edge (-4.4,-42.4) → (18.2,-37.6), set 0.8 m in.
    const A: XY = [-4.4, -42.4], B: XY = [18.2, -37.6]
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], n: XY = [-u[1], u[0]]
    for (let i = 0; i < 6; i++) {
      const s = 1.4 + (i * (L - 2.8)) / 5
      const c: XY = [A[0] + u[0] * s + n[0] * 1.0, A[1] + u[1] * s + n[1] * 1.0], w = 0.5
      const sq: XY[] = [[-w, -w], [w, -w], [w, w], [-w, w]].map(([p, q]) => [c[0] + u[0] * p + n[0] * q, c[1] + u[1] * p + n[1] * q] as XY)
      const r = ccw(sq)
      for (let j = 0; j < 4; j++) {
        const a = r[j], b = r[(j + 1) % 4]
        trav.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], 7.0], [a[0], a[1], 7.0])
      }
    }
    // The doors under the portico on the entrance block's front.
    const D0: XY = [-6.3, -33.0], D1: XY = [15.4, -28.0]
    const Ld = Math.hypot(D1[0] - D0[0], D1[1] - D0[1]), ud: XY = [(D1[0] - D0[0]) / Ld, (D1[1] - D0[1]) / Ld], nd: XY = [ud[1], -ud[0]]
    for (let i = 0; i < 5; i++) {
      const s0 = 1.5 + i * ((Ld - 3) / 5) + 0.5, s1 = 1.5 + (i + 1) * ((Ld - 3) / 5) - 0.5
      const p = (s: number, z: number): V3 => [D0[0] + ud[0] * s + nd[0] * 0.05, D0[1] + ud[1] * s + nd[1] * 0.05, z]
      door.quad(p(s0, 0.4), p(s1, 0.4), p(s1, 5.8), p(s0, 5.8))
    }
  }

  // ── Output ──
  const parts = [
    { part: trav, material: finish('ig-travertine', 0xe8d8bb) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: { ...PALETTE.window, color: 0x8a9dad } },
    { part: copper, material: finish('ig-copper-coping', 0xa9bdac) },
    { part: door, material: PALETTE.entrance },
  ]
  return save('frankfurt-ig-farben-haus', 'IG-Farben-Haus', parts, { bearing: 0, elevation: 0, height: 35 }, 6500)
}
