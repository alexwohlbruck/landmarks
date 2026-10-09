/**
 * Barclays Center (2012), Brooklyn: the arena drum wrapped in a ribbon of
 * pre-rusted weathering-steel lattice over a glass lobby, the green sedum roof
 * swelling over it, and the canopy cantilevered out over the plaza at
 * Flatbush and Atlantic with the oval oculus cut through it, its inside lined
 * with the LED screen. Original procedural geometry, CC0-1.0.
 * bun generators/nyc-barclays-center.ts
 *
 * The plaza, the subway entrance's planted roof under the canopy and the
 * streets are the map's.
 *
 * Frame: BEARING 15.5 (Atlantic Avenue), so +x runs along Atlantic Avenue
 * towards the east-south-east and +y towards Dean Street's opposite, north-
 * north-east; z up, metres. Origin = area centroid of the OSM outline
 * (relation/8610205, outer way/250992428): -73.97532637, 40.68265278.
 * z = 0 is the street, about 14 m NAVD88 (lidar ground returns round the
 * drum); there is no sunken floor visible from outside, so elevation is 0.
 *
 * Evidence
 * - OSM relation/8610205 (building=civic, leisure=stadium, height 35,
 *   Q807966): outer way/250992428, the drum and the canopy wedge over the
 *   plaza; inner way/620716943, the oculus. In this frame the outline is
 *   square to the axes: Atlantic Avenue front at y 61.9, Dean Street side at
 *   y -66.8, the canopy's straight edge along Flatbush Avenue on the
 *   diagonal, and two low service annexes on the south-east (2-6 m in the
 *   lidar), left out: loading structures, not part of the arena's form.
 * - USGS 3DEP lidar NY_NewYorkCity at 0.5 m (/tmp/city/nyc/work/
 *   nyc-barclays-center/lid.json), measured in this frame: the drum spans x
 *   -58 to 81 and y -66 to 59, a rounded rectangle; its roof edge stands at
 *   24-26 m and the sedum roof swells to 41 m in the middle (OSM's 35 is the
 *   average); the canopy's top is level at 14-15 m.
 * - Published (Wikipedia): opened 2012, SHoP Architects and AECOM (Ellerbe
 *   Becket); 12,000 pre-weathered steel panels; the green roof added 2015;
 *   the oculus over the plaza with a 3,000 sq ft LED marquee on its underside.
 * - Photos (Wikimedia Commons, credits in /tmp/city/nyc/work/
 *   nyc-barclays-center/photos/credits.txt): "Barclays Center, Brooklyn New
 *   York, 2023.jpg" (Weber Areiv, CC BY-SA 4.0: the sedum roof, the lattice
 *   bands over the lobby); "Barclays Center western side.jpg" (AEMoreira042281,
 *   CC BY-SA 3.0: the canopy and oculus from Flatbush Avenue); "Barclays
 *   Center 2024.jpg" (CityLimitsJunction, CC0); "Barclays Center from
 *   Flatbush.jpg" (Andrew nyr, CC BY-SA 4.0); "Barclays Center Oculus.jpg"
 *   (Darkhunger, CC BY-SA 3.0: the oculus and its screen from below);
 *   "Barclays Center 17 January 2024.jpg" (Emabarto01, CC BY-SA 4.0: the
 *   canopy's thick visor); "Barclays Center December 2021.jpg" and "...
 *   006.jpg" (Kidfly182, CC BY-SA 4.0); "BarclayCenter-2 (48034233762).jpg"
 *   (Ajay Suresh, CC BY 2.0: the Atlantic Avenue lobby); "Atlantic Terminal td
 *   (2019-03-30) 035 - Barclays Center.jpg" (Tdorante10, CC BY-SA 4.0). USGS
 *   NAIP for the plan and the roof colours.
 *
 * Estimated from the photos: the ribbon's swooping lower edge (3 to 11 m,
 * highest at the plaza end) over the glass lobby, its top edge (25-28 m); the
 * canopy's soffit (10.5 m at the drum) over the plaza entrance, and its tip
 * sweeping up 5 m (the visor 7.5 m deep, its top at 18; the lidar reads 14-15 m on the
 * canopy roof behind the visor); two broad bands standing
 * for the lattice; the corner radii. The lettering is
 * left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, add2, v3, ccw, rayHit, sweep, save } from './nyc-yankee-stadium'

const rust = new Part(), sedum = new Part(), glass = new Part()

// The drum: a rounded rectangle, corner radii from the lidar and NAIP.
const X0 = -58, X1 = 81, Y0 = -66.6, Y1 = 59.5
function drum(off = 0, scale = 1): XY[] {
  const cx = (X0 + X1) / 2, cy = (Y0 + Y1) / 2
  const hx = ((X1 - X0) / 2) * scale + off, hy = ((Y1 - Y0) / 2) * scale + off
  const corners: [number, number, number, number][] = [ // centre sign x, sign y, radius, start angle
    [1, -1, 30, -90], [1, 1, 38, 0], [-1, 1, 28, 90], [-1, -1, 28, 180],
  ]
  const pts: XY[] = []
  for (const [sx, sy, r0, a0] of corners) {
    const r = Math.max(0.5, Math.min(r0 * scale + off, Math.min(hx, hy) - 0.01))
    const ccx = cx + sx * (hx - r), ccy = cy + sy * (hy - r)
    for (let k = 0; k <= 6; k++) {
      const a = ((a0 + (90 * k) / 6) * Math.PI) / 180
      pts.push([ccx + r * Math.cos(a), ccy + r * Math.sin(a)])
    }
  }
  return pts
}
const D = drum()
const N = D.length

// Walls: the glass lobby, then the rusted ribbon up to the roof's edge. The
// ribbon's lower edge swoops round the drum, lifting high over the glass at
// the plaza (north-west) and the far corner, dipping low between, and its
// bands follow the swoop, flaring out as they rise.
const EDGE = 25
const CX = (X0 + X1) / 2, CY = (Y0 + Y1) / 2
const lobby = (p: XY) => {
  const phi = Math.atan2(p[1] - CY, p[0] - CX)
  return 7 + 4 * Math.cos(2 * (phi - (140 * Math.PI) / 180))
}
// the ribbon's top edge swoops too, gently, highest over the plaza end
const rim = (p: XY) => {
  const phi = Math.atan2(p[1] - CY, p[0] - CX)
  return EDGE + 1.6 + 1.4 * Math.cos(phi - (140 * Math.PI) / 180)
}
{
  const Qb = drum(0.6), Qt = drum(1.8)
  const L = D.map(lobby), R = D.map(rim)
  const In = drum(-6) // the ribbon's top rim, 6 m wide round the green roof
  // one tall ribbon: from the roof's edge over the rim, down its leaning face
  // to the swooping lower edge, under it to the glass lobby, and down the glass
  const prof = D.map((p, i) => [v3(In[i], EDGE), v3(In[i], R[i]), v3(Qt[i], R[i]), v3(Qb[i], L[i]), v3(p, L[i]), v3(p, 0)])
  sweep([...prof, prof[0]], (i) => [rust, rust, rust, rust, glass][i])
  // two broad lattice bands within the ribbon, following its swoop
  for (const f of [0.36, 0.7]) {
    const band = D.map((p, i) => {
      const z = L[i] + (R[i] - L[i]) * f
      const off = 0.6 + 1.2 * f + 0.05
      const a = drum(off)[i], b = drum(off + 0.5)[i]
      return [v3(a, z + 0.5), v3(b, z + 0.5), v3(b, z - 0.5), v3(a, z - 0.5)]
    })
    sweep([...band, band[0]], () => rust)
  }
}

// The sedum roof: a swelling dome from the edge (25) to 41 in the middle.
{
  const S = [1, 0.85, 0.68, 0.5, 0.3, 0.12]
  const ring = (s: number) => {
    const z = EDGE + 16 * (1 - s * s)
    return drum(-6, s).map(([x, y]) => [x, y, z] as V3)
  }
  for (let k = 0; k + 1 < S.length; k++) {
    const a = ring(S[k]), b = ring(S[k + 1])
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N
      sedum.quad(a[i], a[j], b[j], b[i])
    }
  }
  const top = ring(S[S.length - 1])
  const c: V3 = [(X0 + X1) / 2, (Y0 + Y1) / 2, EDGE + 16]
  for (let i = 0; i < N; i++) sedum.tri(top[i], top[(i + 1) % N], c)
}

// The canopy over the plaza: a slab at 14 m with a deep rusted visor, the
// oculus cut through it (OSM's inner ring) and lined with the screen. Its
// inner end tucks into the drum.
{
  const OUT: XY[] = ccw([
    [-30, 61.9], [-58.2, 61.9], [-76.7, 60.9], [-83.1, 59.1], [-86.9, 56.2], [-97.7, 41.5], [-102.8, 32.7], [-106.7, 24.0],
    [-107.4, 18.5], [-105.5, 13.8], [-27.1, -66.8], [-27.1, -40], [-30, 0],
  ])
  const HOLE: XY[] = ccw([
    [-82.3, 53.4], [-87.3, 47.7], [-92.4, 39.5], [-95.2, 33.7], [-96.6, 29.0], [-96.4, 24.8], [-94.6, 21.7], [-92.2, 20.1],
    [-88.5, 19.5], [-84.1, 20.3], [-78.9, 23.5], [-75.8, 29.1], [-73.3, 37.7], [-72.4, 46.7], [-73.0, 50.8], [-75.4, 54.2], [-78.8, 55.0],
  ])
  const TOP = 18, SOFFIT = 10.5
  const O: XY = [-85, 37] // inside the oculus; both rings are star-shaped from here
  const ang = (p: XY) => Math.atan2(p[1] - O[1], p[0] - O[0])
  const as = [...OUT.map(ang), ...HOLE.map(ang)]
  for (let k = 0; k < 72; k++) as.push(-Math.PI + (2 * Math.PI * k) / 72)
  as.sort((a, b) => a - b)
  const A = as.filter((a, i) => i === 0 || a - as[i - 1] > 1e-4)
  const hit = (ring: XY[], a: number): XY => { const d: XY = [Math.cos(a), Math.sin(a)], t = rayHit(O, d, ring)!; return add2(O, d, t) }
  const st = [...A, A[0] + 2 * Math.PI].map((a) => {
    const h = hit(HOLE, a), o = hit(OUT, a)
    // the tip sweeps up away from the drum, as the visor does in the photos
    const up = (p: XY) => 5 * Math.min(1, Math.max(0, (-58 - p[0]) / 49)) ** 1.5
    return [v3(h, SOFFIT + up(h)), v3(h, TOP + up(h)), v3(o, TOP + up(o)), v3(o, SOFFIT + up(o)), v3(h, SOFFIT + up(h))]
  })
  // order: the oculus face, the top, the visor, the soffit
  sweep(st, (i) => [glass, rust, rust, rust][i]) // the screen lining the oculus is a window-coloured band
}

await save('nyc-barclays-center', 'Barclays Center', [
  { part: rust, material: finish('barclays-rust', 0x9a6450) },
  { part: sedum, material: finish('sedum-green', 0x8c9a6e) },
  { part: glass, material: PALETTE.window },
], {
  bearing: 15.5, elevation: 0, anchor: [40.68265278, -73.97532637], height: 41,
  replaces: ['relation/8610205', 'way/250992428'],
})
