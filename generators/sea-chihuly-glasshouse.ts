/**
 * Chihuly Garden and Glass: the Glasshouse, Seattle Center: procedural,
 * CC0-1.0.
 * bun generators/sea-chihuly-glasshouse.ts
 *
 * Map frame: x east, y north, z up, metres; placed at bearing 0, the hall
 * itself turned to 342 degrees (OSM way/329416207's long sides) in the
 * geometry. The origin is that outline's centroid. y = 0 is the garden ground
 * round it, 42.4 m NAVD88 (flat to 0.2 m).
 *
 * Owen Richards Architects with Dale Chihuly, 2012: a glass-and-steel
 * conservatory after Sainte-Chapelle and the Crystal Palace, 40 ft tall,
 * 4,500 sq ft (Chihuly Garden and Glass; the plaque in the Glasshouse). Its
 * section is a lopsided pointed arch, carried the length of the hall: the
 * west side rises almost sheer and turns over near the middle, the east
 * side sweeps down in a long curve; white steel frames on the glass.
 *
 * OSM: way/329416207 (Glasshouse, height 10, roof:shape gambrel): 14.4 m by
 * 31.3 m. The model replaces it.
 * Measured (USGS 3DEP WA_KingCo_1_2021 lidar, 0.5 m): the crown returns
 * 11.6-13.6 m above y = 0 along the whole length, centred 1-1.5 m west of
 * the hall's middle; the glass flanks return almost nothing. The model's
 * apex is 13.0 m, between the lidar and the published 40 ft (12.2 m), and
 * 2.6 m west of the middle: the south-end photo puts it about a quarter of
 * the way across, the lidar's crown band nearer the middle.
 * From photos: the section (the south end, from the garden, with the Sun
 * sculpture before it), the white end frames, the hall's arched ribs.
 * Estimated: the two arcs (each struck from a centre on the ground line, so
 * both meet the ground upright), the ribs' spacing and size.
 * Left out: the suspended glass sculpture inside, the doors and the link to
 * the Galleries building (way/329416198, not modelled).
 *
 * Photos: "Glasshouse" (DoNotLick, Flickr, CC BY 2.0, three interior views
 * of the ribs); "'The Sun' and the Glasshouse" (sfoskett, Flickr,
 * CC BY-NC-SA 2.0, the south end: look-only, shape described not copied);
 * "Chihuly Garden and Glass 2014 09.JPG" (Jllm06, CC BY-SA 4.0, from the
 * Space Needle); "Chihuly Garden and Glass Seattle Washington19.jpg"
 * (Burley Packwood, CC BY-SA 4.0).
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE } from './palette'

type P2 = [number, number]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

const glass = new Part()
const frame = new Part()

const HALF_W = 7.2, HALF_L = 15.65, APEX_U = -2.6, APEX_Z = 13.0
/** Arc centres on the ground line, so each side meets the ground upright. */
const RW = ((APEX_U + HALF_W) ** 2 + APEX_Z ** 2) / (2 * (APEX_U + HALF_W)), CW = -HALF_W + RW
const RE = ((HALF_W - APEX_U) ** 2 + APEX_Z ** 2) / (2 * (HALF_W - APEX_U)), CE = HALF_W - RE
/** The section, west foot to east foot over the apex, with outward normals. */
const SECTION: { u: number; z: number; nu: number; nz: number }[] = (() => {
  const out: { u: number; z: number; nu: number; nz: number }[] = []
  const K = 10
  const aW = Math.atan2(APEX_Z, APEX_U - CW) // from pi (west foot) down to the apex
  for (let i = 0; i <= K; i++) {
    const a = Math.PI + ((aW - Math.PI) * i) / K
    out.push({ u: CW + RW * Math.cos(a), z: RW * Math.sin(a), nu: Math.cos(a), nz: Math.sin(a) })
  }
  const aE = Math.atan2(APEX_Z, APEX_U - CE) // from the apex down to 0 (east foot)
  for (let i = 1; i <= K; i++) {
    const a = aE * (1 - i / K)
    out.push({ u: CE + RE * Math.cos(a), z: RE * Math.sin(a), nu: Math.cos(a), nz: Math.sin(a) })
  }
  // at the apex the two arcs meet in a crease: give each side its own normal
  return out
})()

/** Hall frame → map frame: u across (east-ish), v along (north-ish). */
const BEARING = (342 * Math.PI) / 180
const ev: P2 = [Math.sin(BEARING), Math.cos(BEARING)], eu: P2 = [Math.cos(BEARING), -Math.sin(BEARING)]
const M = (u: number, v: number, z: number): V3 => [eu[0] * u + ev[0] * v, eu[1] * u + ev[1] * v, z]
const N = (nu: number, nv: number, nz: number): V3 => unit([eu[0] * nu + ev[0] * nv, eu[1] * nu + ev[1] * nv, nz])

function face(p: Part, P: V3[], n: V3, ns?: V3[]) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const [a, b, c, d] = dot(f, n) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const nn = ns ?? [n, n, n, n]
  p.tri(P[a], P[b], P[c], undefined, undefined, undefined, [nn[a], nn[b], nn[c]])
  p.tri(P[a], P[c], P[d], undefined, undefined, undefined, [nn[a], nn[c], nn[d]])
}

// ------------------------------------------------------------- the glass ---
// The vault, smooth along each arc and creased at the apex, where the east
// arc's band takes the east arc's own normal.
const APEX_I = 10
const aApexE = Math.atan2(APEX_Z, APEX_U - CE)
for (let i = 0; i < SECTION.length - 1; i++) {
  const s0 = SECTION[i], s1 = SECTION[i + 1]
  const n0 = i === APEX_I ? N(Math.cos(aApexE), 0, Math.sin(aApexE)) : N(s0.nu, 0, s0.nz)
  const n1 = N(s1.nu, 0, s1.nz)
  const P = [M(s0.u, -HALF_L, s0.z), M(s1.u, -HALF_L, s1.z), M(s1.u, HALF_L, s1.z), M(s0.u, HALF_L, s0.z)]
  face(glass, P, N((s0.nu + s1.nu) / 2, 0, (s0.nz + s1.nz) / 2), [n0, n1, n1, n0])
}
// The two gable ends: flat glass, fanned from the middle of the base.
for (const side of [-1, 1]) {
  const v = side * HALF_L, n = N(0, side, 0), base = M(APEX_U * 0.4, v, 0)
  for (let i = 0; i < SECTION.length - 1; i++) {
    const a = SECTION[i], b = SECTION[i + 1]
    const A = M(a.u, v, a.z), B = M(b.u, v, b.z)
    if (dot(cross(sub(A, base), sub(B, base)), n) >= 0) glass.tri(base, A, B)
    else glass.tri(base, B, A)
  }
}

// ------------------------------------------------------------ the frames ---
/**
 * A white rib following the section at v, `w` wide along the hall and `d`
 * deep, standing just proud of the glass.
 */
function rib(v: number, w: number, d: number) {
  for (let i = 0; i < SECTION.length - 1; i++) {
    const s0 = SECTION[i], s1 = SECTION[i + 1]
    const o = (s: typeof s0, k: number, vv: number) => M(s.u + s.nu * k, vv, s.z + s.nz * k)
    const out = N((s0.nu + s1.nu) / 2, 0, (s0.nz + s1.nz) / 2)
    // outer face
    face(frame, [o(s0, d, v - w / 2), o(s1, d, v - w / 2), o(s1, d, v + w / 2), o(s0, d, v + w / 2)], out)
    // the two sides
    for (const sd of [-1, 1]) {
      const vv = v + (sd * w) / 2
      face(frame, [o(s0, -0.05, vv), o(s1, -0.05, vv), o(s1, d, vv), o(s0, d, vv)], N(0, sd, 0))
    }
  }
}
// Bold frames at the two ends (photo), lighter ribs between them.
rib(-HALF_L + 0.3, 0.7, 0.45)
rib(HALF_L - 0.3, 0.7, 0.45)
for (let k = 1; k <= 4; k++) rib(-HALF_L + (k * 2 * HALF_L) / 5, 0.35, 0.25)
// A white sill along both feet.
for (const s of [SECTION[0], SECTION[SECTION.length - 1]]) {
  const out = Math.sign(s.nu), u1 = s.u + out * 0.4
  face(frame, [M(u1, -HALF_L, 0), M(u1, HALF_L, 0), M(u1, HALF_L, 0.8), M(u1, -HALF_L, 0.8)], N(out, 0, 0))
  face(frame, [M(s.u, -HALF_L, 0.8), M(u1, -HALF_L, 0.8), M(u1, HALF_L, 0.8), M(s.u, HALF_L, 0.8)], [0, 0, 1])
}

// ---------------------------------------------------------------- output ---
// Clear glass reads light sky-blue-grey in daylight; the frames white.
const parts = [
  { part: glass, material: PALETTE.glass },
  { part: frame, material: PALETTE.trim },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Chihuly Glasshouse', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: APEX_Z,
})
await Bun.write(new URL('../models/sea-chihuly-glasshouse.glb', import.meta.url), glb)
console.log(`sea-chihuly-glasshouse.glb: ${triangles} triangles, ${glb.length} bytes`)
