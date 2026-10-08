/**
 * Soarin' Around the World — the hangar, Grizzly Peak Airfield, Disney
 * California Adventure — procedural, CC0-1.0, no textures.
 * bun generators/dlr-soarin.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the vertex centroid of
 * the outline way/312369808. Bearing 0: the outline is square to the compass,
 * with the entrance on its south face.
 *
 * The attraction's front is a 1940s aircraft hangar: a broad barrel-vaulted
 * hall whose curved gable faces the airfield across its whole width, with
 * a band of clerestory windows, big hangar doors and an arched entrance.
 *
 * Evidence
 * - OSM (measured): outline way/312369808 (85 × 38 m, no height) and the part
 *   way/121865023 inside it, 15 m. The entrance canopy way/312369809 (11 m,
 *   building=roof) at x 4–12 m fixes the hangar's centre line.
 * - Photos (Wikimedia Commons):
 *     "Soarin Over California Updated Entrance - July 17th 2015.JPG", KeepingDLRUpdated, CC BY-SA 4.0 — the south front
 *     "Soarin' Over California.JPG", SolarSurfer, public domain — the south front, 2000s colours
 *     "Soarin', Disney California Adventure sign (July 2022).jpg", Benoît Prieur, CC0 — sign (look only)
 *
 * Estimated: the vault, spanning the whole front and rising from 9 m eaves
 * to 17.5 m at the crown (so the hall averages near OSM's 15 m); the window
 * band and hangar doors. The camouflage-pattern paint since 2015 is drawn as one sage
 * finish with a tan band; the back of the building is plain, as no photo shows it.
 */
import { Part, cross, len, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const wall = new Part(), roof = new Part(), band = new Part(), win = new Part(), door = new Part()
const unit = (v: V3): V3 => { const l = len(v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function tri(p: Part, a: V3, b: V3, c: V3, n: V3 | V3[]) {
  const N = Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3]
  const f = cross(sub(b, a), sub(c, a))
  if (len(f) < 1e-9) return
  if (dot(f, unit([N[0][0] + N[1][0] + N[2][0], N[0][1] + N[1][1] + N[2][1], N[0][2] + N[1][2] + N[2][2]])) >= 0) p.tri(a, b, c, undefined, undefined, undefined, N)
  else p.tri(a, c, b, undefined, undefined, undefined, [N[0], N[2], N[1]])
}
const quad = (p: Part, a: V3, b: V3, c: V3, d: V3, n: V3 | V3[]) => {
  const N = Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3, n as V3]
  tri(p, a, b, c, [N[0], N[1], N[2]]); tri(p, a, c, d, [N[0], N[2], N[3]])
}
type XY = [number, number]
const signedArea = (p: XY[]) => p.reduce((s, a, i) => s + a[0] * p[(i + 1) % p.length][1] - p[(i + 1) % p.length][0] * a[1], 0) / 2
const ccw = (p: XY[]) => (signedArea(p) < 0 ? [...p].reverse() : p)
function earClip(poly: XY[]): [XY, XY, XY][] {
  const p = ccw(poly), idx = p.map((_, i) => i), out: [XY, XY, XY][] = []
  const cr = (o: XY, a: XY, b: XY) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i - 1 + idx.length) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const A = p[ia], B = p[ib], C = p[ic]
      if (cr(A, B, C) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && cr(A, B, p[j]) >= -1e-9 && cr(B, C, p[j]) >= -1e-9 && cr(C, A, p[j]) >= -1e-9)) continue
      out.push([A, B, C]); idx.splice(i, 1); cut = true
      break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([p[idx[0]], p[idx[1]], p[idx[2]]])
  return out
}

// --- Wings: the whole outline to 11 m, flat-roofed ----------------------------------
const OUTLINE: XY[] = [[-35.9, 12.7], [-31.2, 12.8], [-25.0, 12.7], [-22.6, 12.7], [-13.2, 12.8], [-13.2, 15.8], [-8.7, 15.8],
  [-8.7, 12.8], [-3.7, 12.9], [-3.8, 19.4], [16.5, 19.6], [16.4, 12.9], [21.7, 12.9], [21.6, 18.7], [26.7, 18.7], [26.8, 12.9],
  [41.6, 13.0], [41.5, 19.4], [44.3, 19.4], [44.3, 14.8], [45.6, 14.9], [45.7, 13.0], [45.8, -15.3], [48.9, -15.3], [49.0, -18.1],
  [40.9, -18.0], [40.9, -17.5], [4.0, -17.6], [-25.5, -17.5], [-25.5, -18.2], [-34.3, -18.1], [-34.2, -15.3], [-33.4, -15.3],
  [-33.5, -9.1], [-36.3, -9.1], [-36.4, 5.8], [-35.6, 5.9]]
const EAVE = 9, CROWN = 17.5
{
  const p = ccw(OUTLINE)
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length], n = unit([b[1] - a[1], -(b[0] - a[0]), 0])
    quad(wall, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], EAVE - 1.4], [a[0], a[1], EAVE - 1.4], n)
    quad(band, [a[0], a[1], EAVE - 1.4], [b[0], b[1], EAVE - 1.4], [b[0], b[1], EAVE], [a[0], a[1], EAVE], n)
  }
  for (const [A, B, C] of earClip(p)) tri(roof, [A[0], A[1], EAVE], [B[0], B[1], EAVE], [C[0], C[1], EAVE], [0, 0, 1])
}

// --- The hangar hall: a barrel vault spanning x0–x1, front to back ------------------
const X0 = -33.4, X1 = 45.7, Y0 = -18.2, Y1 = 12.7, SEG = 14
const arc = (k: number): [number, number, V3] => {
  // An elliptical arc from eave to eave; the normal follows the ellipse.
  const t = Math.PI - (k / SEG) * Math.PI, a = (X1 - X0) / 2, b = CROWN - EAVE, cx = (X0 + X1) / 2
  return [cx + a * Math.cos(t), EAVE + b * Math.sin(t), unit([Math.cos(t) / a, 0, Math.sin(t) / b])]
}
for (let k = 0; k < SEG; k++) {
  const [x0, z0, n0] = arc(k), [x1, z1, n1] = arc(k + 1)
  quad(roof, [x0, Y0 - 0.6, z0], [x1, Y0 - 0.6, z1], [x1, Y1, z1], [x0, Y1, z0], [n0, n1, n1, n0])
}
// The curved gables: the front one stands 0.6 m proud of the wings' face.
for (const [y, s] of [[Y0 - 0.6, -1], [Y1, 1]] as [number, number][]) {
  const n: V3 = [0, s, 0], c: V3 = [(X0 + X1) / 2, y, EAVE]
  for (let k = 0; k < SEG; k++) {
    const [x0, z0] = arc(k), [x1, z1] = arc(k + 1)
    tri(wall, c, [x0, y, z0], [x1, y, z1], n)
  }
  if (s < 0) quad(wall, [X0, y, 0], [X1, y, 0], [X1, y, EAVE], [X0, y, EAVE], n)
}
// The front hall's sides between its proud face and the wings' face.
for (const x of [X0, X1]) quad(wall, [x, Y0 - 0.6, 0], [x, Y0, 0], [x, Y0, EAVE], [x, Y0 - 0.6, EAVE], [x === X0 ? -1 : 1, 0, 0])

// --- The front: clerestory, tan band, entrance ---------------------------------------
const FY = Y0 - 0.66
const front = (p: Part, x0: number, x1: number, z0: number, z1: number, y = FY) =>
  quad(p, [x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1], [0, -1, 0])
// A tan band under the vault's springing, and the clerestory windows above it
// across the hall's gable, in bays.
front(band, X0 + 0.2, X1 - 0.2, EAVE - 1.6, EAVE - 0.4)
for (let x = X0 + 10; x < X1 - 12; x += 5) front(win, x, x + 3.6, EAVE + 0.6, EAVE + 2.0 + 3.6 * Math.sin(Math.PI * (x + 1.8 - X0) / (X1 - X0)), FY - 0.02)
// The arched entrance, centred on the canopy.
{
  const cx = 8, w = 4.2, spring = 6.2, n: V3 = [0, -1, 0]
  front(door, cx - w, cx + w, 0, spring, FY - 0.02)
  for (let k = 0; k < 8; k++) {
    const a = Math.PI - (k / 8) * Math.PI, b = Math.PI - ((k + 1) / 8) * Math.PI
    tri(door, [cx, FY - 0.02, spring], [cx + w * Math.cos(a), FY - 0.02, spring + w * Math.sin(a) * 0.6], [cx + w * Math.cos(b), FY - 0.02, spring + w * Math.sin(b) * 0.6], n)
  }
}
// The big hangar doors either side of the entrance, as dark slate panels.
for (const [x0, x1] of [[-28, -6], [20, 41]] as XY[]) front(win, x0, x1, 0.8, EAVE - 2.2, FY - 0.02)

// --------------------------------------------------------------------------------------
// The hangar's sage-green paint of the 2015 refresh, pulled light, with its
// tan trim band; the vault and flat roofs in the palette's roof grey.
const parts = [
  { part: wall, material: finish('soarin-sage', 0xa3ad9a) },
  { part: band, material: finish('soarin-tan', 0xd9c49d) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb("Soarin' Around the World", parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: CROWN, bearing: 0,
})
await Bun.write(new URL('../models/dlr-soarin.glb', import.meta.url), glb)
console.log(`dlr-soarin.glb: ${triangles} triangles, ${glb.length} bytes`)
