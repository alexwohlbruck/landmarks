/**
 * Memphis Pyramid (Bass Pro Shops at the Pyramid; Pyramid Arena 1991,
 * converted 2015), Memphis — original procedural geometry, CC0-1.0.
 *
 *   bun generators/mem-pyramid.ts
 *
 * Map frame, turned to the building: +y is the NNE face's outward normal,
 * +x the ESE face's, z up, metres. BEARING 18. -y is the main SSW face, with
 * the Bass Pro logo, the entrance lodge in front of it and the Lookout deck
 * near the apex. Origin: the centre of the square plan (lidar), on the ground,
 * at -90.051905, 35.155977 (OSM outline centroid within ~1 m).
 *
 * Evidence
 * - OSM way/118647101 (building=retail, "Memphis Pyramid", height 91, roof
 *   pyramidal, wikidata Q2226897): a 140 m square turned 18.0° (edge bearings
 *   18.1 / 108.0 / 288.0 / 198.1), traced at the podium top. The entrance lodge
 *   in front of the SSW face is OSM way/679255374 and way/679255373; it is not
 *   modelled and stays an OSM building.
 * - USGS 3DEP lidar USGS_LPC_TN_ShelbyCo_2017_LAS_2019 (2017 flight, after the
 *   2015 conversion), 1 m grid: ground 7.1 m above ground_min around the base,
 *   apex 97.5 m above that; faces fitted (20-85 m) as half-width
 *   77.56 - z / 1.281 (52.0°, the Giza slope) with 0.9 m RMS, bearing 18.0,
 *   centre 0.5 m W, 2.5 m S of -90.0519, 35.1560; the top ~15 m sits ~2 m
 *   inside that plane (the glazed apex, drawn steeper to its point); a
 *   podium ring with a flat top 11.6-12.6 m up between the faces (they meet it
 *   at half-width ~68) and a top edge at ~75.5, its outer walls battered down
 *   to ~84 at the ground.
 * - Published (Wikipedia, "Memphis Pyramid"): 321 ft (97.8 m), 32 storeys;
 *   the Lookout observation deck at the apex, reached by a freestanding lift.
 *   The published 591 ft base side does not match OSM or lidar (the faces
 *   would meet the ground 155 m apart); the lidar is used.
 * - NAIP orthophoto (tools/usgs.py naip): plan, podium ring, corner ridges.
 * - Mapterhorn terrain: falls ~3.2 m from the ESE side to the WNW side.
 * - Photos (all EVIDENCE):
 *   "Memphis Pyramid (Great American Pyramid) - Memphis, TN.jpg" (Quintin
 *     Soloviev, CC BY 4.0, from the SSW, raised: faces, ridges, Lookout,
 *     battered podium), https://commons.wikimedia.org/wiki/File:Memphis_Pyramid_(Great_American_Pyramid)_-_Memphis,_TN.jpg
 *   "Pyramide Memphis, TN.jpg" (Morten Haan, CC BY-SA 4.0, from the SE off
 *     I-40: glazed apex on two faces, ridge bands), https://commons.wikimedia.org/wiki/File:Pyramide_Memphis,_TN.jpg
 *   "Memphis IMG 2820 Pyramid Arena.jpg" (Bjoertvedt, CC BY-SA 4.0, from the
 *     south-east, Main Street: silver face in sun), https://commons.wikimedia.org/wiki/File:Memphis_IMG_2820_Pyramid_Arena.jpg
 *   "Memphis, Tennessee 20161011 162548.jpg" (Jonathansammy, CC BY-SA 4.0,
 *     from the south, far), https://commons.wikimedia.org/wiki/File:Memphis,_Tennessee_20161011_162548.jpg
 *   "Bass Pro Shops at the Pyramid in Memphis, T.N." (Flickr 184676626@N03,
 *     CC BY 2.0, from the SSW at the entrance: podium, oval deck from below),
 *     https://www.flickr.com/photos/184676626@N03/51573339880
 *   "Bass Pro Pyramid" (Tyler Merbler, CC BY 2.0, from the south over I-40:
 *     the Lookout deck at the foot of the glazed apex),
 *     https://www.flickr.com/photos/37527185@N05/22552622038
 *
 * Numbers: footprint, face slope, podium and bearing measured (lidar); apex
 * height published (321 ft; lidar 97.5 m). Estimated from the photos: the
 * glazed apex starting at 82 m, the Lookout deck (half-width 12 m, 6.5 m out, 1.6 m slab),
 * the ridge bands (~2.6 m), the logo plaque (33 x 16 m on the face, pale with a
 * bronze rim, centred 60 m up), the podium glazing band on the SSW wall. The face ribbing is
 * drawn as 12 shallow 0.6 m steps, about one per 6 m, standing for the many
 * horizontal panel joints. Left out: the logo lettering, the Ducks Unlimited
 * sign, the entrance lodge (its own OSM building), the outdoor balconies'
 * glass floors, the lift inside.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 18
const ANCHOR = { lng: -90.051905, lat: 35.155977 }

const SLOPE = 1.281 // rise per metre in
const W0 = 77.56 // face half-width extrapolated to z = 0
const half = (z: number) => W0 - z / SLOPE
const POD = 12 // podium top
const POD_TOP = 75.5 // podium top outer edge
const POD_FOOT = 83.5 // battered wall at the ground
const GLASS = 82 // glazed apex starts
const TIP = 97.8
const RIB = 0.6, BANDS = 12

const steel = new Part(), glass = new Part(), trim = new Part(), podium = new Part(), win = new Part(), logo = new Part()

const sq = (h: number, z: number): V3[] => [[h, -h, z], [h, h, z], [-h, h, z], [-h, -h, z]] // anticlockwise from above

// --- Steel faces, ribbed: each band starts on the face plane at its foot and leans
// out RIB by its head, so every joint is a small upward ledge that catches the light. ---
{
  const rings: V3[][] = []
  for (let b = 0; b < BANDS; b++) {
    const za = POD + ((GLASS - POD) * b) / BANDS, zb = POD + ((GLASS - POD) * (b + 1)) / BANDS
    rings.push(sq(half(za), za), sq(half(zb) + (b === BANDS - 1 ? 0 : RIB), zb))
  }
  // loft pairs, plus the horizontal lips between them
  for (let k = 0; k < rings.length - 1; k++) steel.loft([rings[k], rings[k + 1]])
}

// --- Glazed apex: steeper than the steel plane (lidar: ~2 m inside it), to a point. ---
{
  const r0 = sq(half(GLASS), GLASS), tip: V3 = [0, 0, TIP]
  for (let i = 0; i < 4; i++) glass.tri(r0[i], r0[(i + 1) % 4], tip)
}

// --- Corner ridges: a raised band down each corner, apex to podium. ---
{
  const W = 1.6, OUT = 0.8
  const corners: [number, number][] = [[1, -1], [1, 1], [-1, 1], [-1, -1]]
  for (const [sx, sy] of corners) {
    const at = (z: number, h0: number): V3[] => {
      const h = h0 + (z < GLASS ? RIB + 0.25 : 0.25) // clear of the ribs' outer edge
      const c: V3 = [sx * h, sy * h, z]
      // points on the two faces either side, W back from the corner, and the raised crest
      const a: V3 = [sx * h, sy * (h - W), z], b: V3 = [sx * (h - W), sy * h, z]
      const crest: V3 = [c[0] + sx * OUT * 0.7, c[1] + sy * OUT * 0.7, z]
      const inner: V3 = [sx * (h - W), sy * (h - W), z]
      return [a, crest, b, inner]
    }
    const zs = [POD, GLASS, TIP - 2.2]
    const hs = [half(POD), half(GLASS), (half(GLASS) * 2.2) / (TIP - GLASS)]
    const secs = zs.map((z, i) => at(z, hs[i]))
    // orient anticlockwise from above for an outward loft
    const ccw = (r: V3[]) => {
      const cx = r.reduce((s, p) => s + p[0], 0) / 4, cy = r.reduce((s, p) => s + p[1], 0) / 4
      return [...r].sort((p, q) => Math.atan2(p[1] - cy, p[0] - cx) - Math.atan2(q[1] - cy, q[0] - cx))
    }
    const rs = secs.map(ccw)
    trim.loft(rs)
    trim.cap(rs[rs.length - 1], true)
  }
}

// --- Podium: flat-topped ring between the faces and a battered outer wall. ---
{
  const B = 0.5
  const top = sq(POD_TOP - B, POD), lip = sq(POD_TOP, POD - B), foot = sq(POD_FOOT, 0)
  podium.loft([foot, lip, top])
  const inner = sq(half(POD), POD)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    podium.quad(inner[i], top[i], top[j], inner[j])
  }
  // Glazing band on the SSW wall (the store front either side of the lodge): flush
  // on the battered wall, from 2.5 to 6.5 m.
  const z0 = 2.5, z1 = 6.5
  const wallAt = (z: number) => POD_FOOT - ((POD_FOOT - POD_TOP) * z) / (POD - B) + 0.05
  for (const [x0, x1] of [[-56, -16], [16, 56]]) {
    win.quad([x0, -wallAt(z0), z0], [x1, -wallAt(z0), z0], [x1, -wallAt(z1), z1], [x0, -wallAt(z1), z1])
  }
}

/** A triangle wound to face `dir`. */
function tri(p: Part, a: V3, b: V3, c: V3, dir: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * dir[0] + n[1] * dir[1] + n[2] * dir[2] < 0) p.tri(a, c, b)
  else p.tri(a, b, c)
}
const quadTo = (p: Part, a: V3, b: V3, c: V3, d: V3, dir: V3) => { tri(p, a, b, c, dir); tri(p, a, c, d, dir) }

// --- The Lookout: an oval deck cantilevered from the SSW face at the foot of the glazed apex. ---
{
  const z = GLASS - 0.4, back = -half(z) + 1.0, A = 12, D = 6.5, N = 14
  const pts = (zz: number, grow = 0): V3[] => {
    const out: V3[] = []
    for (let i = 0; i <= N; i++) {
      const t = Math.PI * (i / N) // across the face, bulging to -y
      out.push([(A + grow) * Math.cos(t), back - (D + grow) * Math.sin(t), zz])
    }
    return out
  }
  const lo = pts(z - 1.6), hi = pts(z), g0 = pts(z, -0.15), g1 = pts(z + 1.4, -0.15)
  for (let i = 0; i < N; i++) {
    const t = Math.PI * ((i + 0.5) / N), out: V3 = [Math.cos(t), -Math.sin(t), 0]
    quadTo(trim, lo[i], lo[i + 1], hi[i + 1], hi[i], out)
    tri(trim, hi[i], hi[i + 1], [0, back, z], [0, 0, 1])
    tri(trim, lo[i], lo[i + 1], [0, back, z - 1.6], [0, 0, -1])
    quadTo(glass, g0[i], g0[i + 1], g1[i + 1], g1[i], out)
  }
}

// --- The logo: a pale oval plaque with a bold bronze rim, standing proud of the SSW
// face; no lettering. ~54% of the face's width at its height (photos; lead review asked ~45%+). ---
{
  const zc = 60, a = 16.5, b = 7.8, w = 1.8, N = 40
  const k = Math.hypot(1, SLOPE)
  const n: V3 = [0, -SLOPE / k, 1 / k] // the face's outward normal
  // s across the face, t up its slant, `out` horizontally off the plane
  const onFace = (s: number, t: number, out: number): V3 => {
    const zz = zc + (t * SLOPE) / k
    return [s, -(half(zz) + out), zz]
  }
  const PLAQUE = RIB + 0.3, RIM = RIB + 0.5 // clear of every rib joint
  const p = (t: number, r: number, out: number) => onFace(Math.cos(t) * (a - r), Math.sin(t) * (b - r), out)
  const centre = onFace(0, 0, PLAQUE)
  for (let i = 0; i < N; i++) {
    const t0 = (2 * Math.PI * i) / N, t1 = (2 * Math.PI * (i + 1)) / N
    tri(trim, centre, p(t0, w, PLAQUE), p(t1, w, PLAQUE), n) // the plaque
    quadTo(logo, p(t0, 0, RIM), p(t0, w, RIM), p(t1, w, RIM), p(t1, 0, RIM), n) // rim face
    quadTo(logo, p(t0, w, PLAQUE), p(t1, w, PLAQUE), p(t1, w, RIM), p(t0, w, RIM), [-Math.cos(t0), 0, -Math.sin(t0)]) // rim's inner lip
    const o: V3 = [Math.cos(t0), 0, Math.sin(t0)]
    quadTo(logo, p(t0, 0, 0), p(t1, 0, 0), p(t1, 0, RIM), p(t0, 0, RIM), o) // outer edge down to the face
  }
}

const flood = (p: V3) => (p[2] < POD + 0.5 ? 0 : Math.max(0, 0.6 - (p[2] - POD) / 120))
const parts = [
  { part: steel, material: { ...finish('pyramid-steel', 0xb7c6d4, 0.35), floodlight: flood } },
  { part: glass, material: { ...PALETTE.glass, color: 0x7f97ab } },
  { part: trim, material: { ...PALETTE.trim, color: 0xe9ecee } },
  { part: podium, material: finish('pyramid-precast', 0xdcc4a6) },
  { part: win, material: PALETTE.window },
  { part: logo, material: finish('logo-bronze', 0x8c8073) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Memphis Pyramid', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TIP,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/118647101'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/mem-pyramid.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
