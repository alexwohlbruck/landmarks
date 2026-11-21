/**
 * UNC Charlotte Center City Building, now the Dubois Center (320 E 9th St,
 * 2011; KieranTimberlake with Gantt Huberman Architects), Charlotte.
 * Original procedural geometry, CC0-1.0.
 * bun generators/clt-unc-charlotte-center-city.ts
 *
 * Map frame: x, y, z up, metres, turned to bearing 49.5: +y faces East 9th
 * Street (north-east), +x the south-east end (Brevard St side), -x the
 * north-west end above the lawn of First Ward Park, which falls away there.
 * Origin: centroid of OSM way/1004213300 on the lowest ground under the
 * footprint (its west corner), about 2.4 m below 9th Street.
 *
 * Identity, in order:
 *  - a tall glass lower volume, and on it one upper volume (the top five
 *    storeys) turned against it, cantilevered several metres at the
 *    south-east end over a dark wedge-shaped soffit;
 *  - an even skin of pale green-grey fritted glass with fine mullions;
 *  - the low clear-glass entrance pavilion at the south-east end.
 *
 * Evidence:
 *  - OSM way/1004213300 (building university, height 48, 12 levels,
 *    start_date 2011, Q113335212) and its parts way/1356460440-443 (0-12,
 *    12-24, 24-36 and 36-48 m), read in this frame; the parts' plan is
 *    rough, so the tiers' plans come from the lidar and photos.
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17), 1 m grid,
 *    read with tools/lidar_frame.py at bearing 49.5. Ground 4.9-5.3 m on
 *    9th St, 2.3-2.6 m at the west corner (the model's y = 0). Measured:
 *    the top tier's roof 49.5 m above 9th St (52 m here), its plan turned
 *    about 7 degrees clockwise, from (-22.5, +/-15) to (19.5, -19.5) and
 *    (20.5, 11); the third tier's roof 37 m above 9th St showing along the
 *    +y edge out to y = 16; the south-east wing's roof 12.4 m above 9th St
 *    along x = 19-24.
 *  - Photos: "Dubois Center UNC Charlotte northeastern face July 2022.jpg"
 *    (OwenCKing, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Dubois_Center_UNC_Charlotte_northeastern_face_July_2022.jpg);
 *    "UNC Charlotte Center City Campus.jpg" (Nautilus14, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:UNC_Charlotte_Center_City_Campus.jpg),
 *    the cantilevered corner from below;
 *    "UNC Charlotte's Center City Campus.jpg" (Nautilus14, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:UNC_Charlotte%27s_Center_City_Campus.jpg),
 *    the stacked tiers from the park side. No commercial imagery.
 *  - Published: 11-12 storeys, opened 2011, KieranTimberlake (Wikipedia
 *    "UNC Charlotte Center City").
 *
 * Lead review, round 2: drawn as the north-east photo reads it, as two
 * main volumes and the pavilion, not the OSM parts' four 12 m steps.
 * Estimated from the photos: the lower volume rising to about 58% of the
 * height; the upper volume (the top five storeys) on the lidar's turned
 * plan, its south-east end pushed out about 4 m further over the void so
 * the overhang reads; its underside a wedge, 3 m lower at the south-east
 * end, so its bottom edge runs visibly out of parallel with the volume
 * below; the pavilion at 12.4 m over 9th St (lidar). The lidar also shows
 * a ledge 37 m over 9th St along the 9th St edge, which this simplifies
 * away. The vertical mullion stripes and the colours are estimated.
 *
 * Doubts: the park-side photo shows more breaks than two (a third tier);
 * the lower volume's plan is estimated where the upper hides it.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { panel, save, type XY } from './chi-aon-center'
import { wallsF, capF, edgeLen, ccw } from './clt-imaginon'

const BEARING = 49.5
const ANCHOR: [number, number] = [35.2284525, -80.8350723]

const frit = new Part(), mullion = new Part(), glass = new Part(), soffit = new Part(), roof = new Part()

const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])

const TOP = 52.0
/** The upper volume's underside: a wedge, 30.5 m at the north-west end down to 27.5 m at the south-east. */
const base = (q: XY) => 30.5 - 3.0 * Math.min(1, Math.max(0, (q[0] + 22.6) / 47.6))

const LOWER = rect(-22.1, 18.0, -13.0, 16.1)
// the lidar's turned plan, its south-east end pushed out over the void
const UPPER = ccw([[-22.6, -15.2], [23.5, -20.0], [24.6, 11.2], [-22.6, 15.0]])
const PAVILION = rect(18.0, 23.8, -13.0, 16.1)

/** Fine vertical mullions, a close tone, on every face of a ring. */
function mullions(r: XY[], z0: (q: XY) => number, z1: (q: XY) => number) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = edgeLen(a, b)
    const n = Math.round(L / 3.2)
    for (let k = 1; k < n; k++) {
      const s = k * L / n, t = s / L
      const q: XY = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      panel(mullion, a, b, s - 0.14, s + 0.14, z0(q) + 0.2, z1(q) - 0.2, 0.05)
    }
  }
}

// --- the lower volume, its roof following the wedge above it
wallsF(frit, LOWER, () => 0, base)
capF(roof, LOWER, base)
mullions(LOWER, () => 0, base)

// --- the upper volume: walls from the wedge to the roof, a dark underside and a dark band at its foot
wallsF(frit, UPPER, base, () => TOP)
capF(roof, UPPER, () => TOP)
capF(soffit, UPPER, base, false)
mullions(UPPER, q => base(q) + 1.2, () => TOP)
for (let i = 0; i < UPPER.length; i++) {
  const a = UPPER[i], b = UPPER[(i + 1) % UPPER.length], L = edgeLen(a, b)
  // the band, in short steps so it follows the wedge
  const n = Math.max(1, Math.round(L / 4))
  for (let k = 0; k < n; k++) {
    const t0 = k / n, t1 = (k + 1) / n
    const p0: XY = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0], p1: XY = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]
    const d = (p: XY) => Math.hypot(p[0] - a[0], p[1] - a[1])
    const o = 0.05, nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L
    const P = (p: XY, z: number): [number, number, number] => [p[0] + nx * o, p[1] + ny * o, z]
    soffit.quad(P(p0, base(p0)), P(p1, base(p1)), P(p1, base(p1) + 1.2), P(p0, base(p0) + 1.2))
    void d
  }
}

// --- the low clear-glass pavilion at the south-east end (lidar: 12.4 m over 9th St)
{
  const r = PAVILION, top = 14.8
  wallsF(frit, r, () => 0, () => top)
  capF(roof, r, () => top)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = edgeLen(a, b)
    if (Math.abs(a[0] - 18) < 0.01 && Math.abs(b[0] - 18) < 0.01) continue
    const n = Math.max(1, Math.round(L / 3)), w = L / n
    for (let k = 0; k < n; k++) panel(glass, a, b, k * w + 0.12, (k + 1) * w - 0.12, 0.3, top - 0.5, 0.06)
  }
}

if (import.meta.main) {
  await save('clt-unc-charlotte-center-city', 'UNC Charlotte Center City', ANCHOR, BEARING, [
    { part: frit, material: finish('unccc-fritted-glass', 0xb3cbc5) },
    { part: mullion, material: finish('unccc-mullion', 0x9bb5af) },
    { part: glass, material: { ...PALETTE.window, color: 0xa4c0bd } },
    { part: soffit, material: finish('unccc-soffit', 0x2c3335) },
    { part: roof, material: PALETTE.roof },
  ])
}
