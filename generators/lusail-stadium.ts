/**
 * Lusail Stadium (Lusail Iconic Stadium), Lusail, Qatar: original
 * procedural geometry, CC0-1.0, no textures.  bun generators/lusail-stadium.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/lusail-stadium.glb, the low model (<= 6,500 triangles, 250 KB):
 *   the vessel as a lattice of flat triangular facets with the diagrid as
 *   ridged ribs, the ribbed PTFE roof and its oculus, two tiers;
 * - models/lusail-stadium.detail.glb, from zoom 16 (<= 40,000, 1.5 MB):
 *   every facade panel a triangular frame sloping in to a recessed
 *   triangular opening (`window`, glows at night), square-section diagrid
 *   ribs, stepped tiers, and the spoke-wheel net under the roof (radial
 *   lower cables, spacer struts, the tension ring at the oculus).
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 348: model +y
 * runs along the pitch (north-north-west). Anchor = the pitch centre, lng
 * 51.4903490, lat 25.4207960 (centroid of OSM way/1006062424, the pitch,
 * 100.6 x 132.4 m, long axis at 168 deg). The stadium outline's centroid
 * (way/684020896) is 3 m from it; the stadium is round about the pitch.
 *
 * Identity, in order: the round golden "vessel" (a bowl that tucks under
 * to a ring of pale plinths, widest just below its top, then a band leaning
 * back to the roof edge); its skin of flat triangular panels with
 * triangular openings, crossed by the big diamond diagrid (24 diamonds,
 * 48 V-frames); the white PTFE cable-net roof in radial pillows with its
 * oval oculus over the pitch; the raised podium. Inside: two tiers of pale
 * seats with a glazed box band between them.
 *
 * Evidence
 *  - OSM (measured in this frame): relation/9489554 building=stadium
 *    height=30 (too low; see below), outer way/684020896 (also the
 *    leisure=stadium outline, Q1186333) nearly a circle, x -135..140,
 *    y -138..136 (r ~137); inner way/684020897 the roof opening,
 *    x +-43, y +-60 (drawn as an ellipse 43 x 60). Pitch way/1006062424.
 *    No building:part ways; no other building within 213 m of the centre.
 *  - Published: roof a 307 m "spoke-wheel" cable net, PTFE membrane (Foster
 *    + Partners via ArchDaily https://www.archdaily.com/1016431/ and Dezeen
 *    https://www.dezeen.com/2022/09/21/qatar-world-cup-lusail-stadium-foster-partners/);
 *    facade "triangular openings that visually reinforce the bowl's
 *    structural diagrid" (ArchDaily); vessel on 24 concrete plinths, 48
 *    V-frames, compression ring ~1 km round in 24 segments, two inner
 *    tension rings and one outer compression ring joined by radial spokes,
 *    "central oculus" (ASCE Civil Engineering, Nov 2023,
 *    https://www.asce.org/publications-and-news/civil-engineering-source/civil-engineering-magazine/issues/magazine-issue/article/2023/11/world-cup-qatar-stadiums-inspired-by-middle-east-aesthetic);
 *    facade ~60,000 m2 of triangular aluminium plates (press, via search).
 *    No published height was found.
 *  - Heights are ESTIMATED from photos: the vessel's visible height over
 *    its width is 0.204 in c42 (a drone ~850 m off, 5 deg up; corrected
 *    for the near face being closer, 0.168, so ~51 m for 303 m across),
 *    consistent with 60,000 m2 of skin over a ~940 m girth
 *    (~60 m of surface). Drawn: podium 6.5 m (o3: about 3.5 people
 *    tall), plinths to the vessel's underside at 11 m, widest r 151.5 m
 *    at 54 m, rim (compression ring) at 64 m, roof membrane 64.8 m at the
 *    rim rising to 67.6 m at the oculus. OSM's height=30 is not used.
 *    Widths: rim radius 147 and widest 151.5 (published 307 m roof; Sentinel
 *    o4 reads ~290-300 m of white roof); the vessel's foot tucks in to
 *    r 121 (c42: 0.79 of the widest width at the bottom).
 *  - Tiers: two, lower ~28 m deep, upper to r 142 at 55 m, with a glazed
 *    box band between (c01, c18). Seats pale cream/grey (c18, c35, 2021).
 *  - Elevation 0: the field is taken to be at the street outside (no
 *    published field level; the podium is the raised concourse, o3).
 *  - Look-only (lead review): o7, footpicshd, "FIFA World Cup Trophy displayed
 *    at Lusail Stadium", Flickr 52569822376: marked Public Domain by the
 *    uploader but looks like a press photo, so it is not relied on.
 *  - Photos (EVIDENCE):
 *    - o3: Bahraini Carguy, "Lusail Stadium - Finale AFC Asian 2023",
 *      Public Domain Mark, https://www.flickr.com/photos/198128242@N04/54317997709
 *      (the vessel close up: panels, diagrid, top band, plinths, podium).
 *    - c42: Djawed_vlog, "Aerial view of Lusail Stadium during the
 *      daytime.png", CC BY 3.0, https://commons.wikimedia.org/wiki/File:Aerial_view_of_Lusail_Stadium_during_the_daytime.png
 *      (profile, roof ribs, oculus, plinths; from the north-north-west).
 *    - o4: Pierre Markuse, "Lusail Stadium, 23 km north of Doha, Qatar -
 *      15 Nov 2022 (52511219242).jpg" (Copernicus Sentinel), CC BY 2.0,
 *      https://commons.wikimedia.org/wiki/File:Lusail_Stadium,_23_km_north_of_Doha,_Qatar_-_15_Nov_2022_(52511219242).jpg
 *      (plan: round white roof, oval oculus along the pitch).
 *    - c01, c18, c35: Palácio do Planalto, "17 11 2021 - Visita ao Estádio
 *      Lusail (51686581152 / 51688052549 / 51688281780).jpg", CC BY 2.0,
 *      https://commons.wikimedia.org/wiki/File:17_11_2021_-_Visita_ao_Est%C3%A1dio_Lusail_(51688052549).jpg
 *      (and the same title with the other numbers): inside, the two tiers,
 *      box band, seat colour, the dark steel under the roof.
 *  - Look-only: *SHERWOOD*, "Lusail Stadium at night", CC BY-NC-SA 2.0,
 *    https://www.flickr.com/photos/30273175@N06/52550724745: the whole
 *    vessel glows gold through its openings (night look: the openings are
 *    `window`, the low model's gold carries _FLOODLIGHT).
 *  No lidar or NAIP (outside the US); no commercial imagery.
 *
 * Invented or simplified, and doubts:
 *  - The plan is a true circle (OSM is within ~3 m of one); the roof's
 *    saddle (the published hyperbolic paraboloid) is drawn level, as the
 *    photos show no visible rise and fall of the rim.
 *  - Panel size: 96 around x 8 rows below the widest point (real plates
 *    are about half that size); openings largest at mid-height. The top
 *    band is drawn solid in a lighter gold (its perforations are fine).
 *  - The podium is drawn as a 6.5 m ring to r 150; the real plaza is larger
 *    and irregular, with grand stairs (left to the map, not modelled).
 *  - The roof pillows: 48 bays (low) / 96 (detail), a ridge per bay; the
 *    real diamond pattern of the membrane is finer.
 *  - Tier rakes and depths are estimated; the upper tier back is level.
 *  - Terrain: Mapterhorn has only z12 here, a surface model with a ~15 m
 *    mound 100-180 m north of the centre; `terrain.ts check` reports the
 *    podium deck buried up to 8.3 m on the north side. The site is flat
 *    (o4, c42), so the model is kept true to the photos.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { face, nrm3, crs, vadd, vsub, vmul, dot, rayHit } from './seoul-world-cup-stadium'
import { band, bar, rrect, writeLods, type XY } from './milan-san-siro'

// ---------------------------------------------------------------------------
// Materials (six per level)

const GOLD: MaterialSpec = {
  ...finish('lusail-gold', 0xbf9757),
  // At night the vessel glows gold from the concourse lights behind the
  // perforated skin: the outward faces are lit, the underside barely.
  floodlight: (_p, n) => (n[2] < -0.5 ? 0.2 : n[2] > 0.7 ? 0.35 : 0.85),
}
const GOLD2: MaterialSpec = { ...finish('lusail-gold-light', 0xd8ba7e), floodlight: (_p, n) => (n[2] > 0.7 ? 0.4 : 0.8) }
const WHITE: MaterialSpec = finish('lusail-white', 0xeeebe4)
const SEATS: MaterialSpec = finish('lusail-seats', 0xd5cec1)
const OPEN: MaterialSpec = { name: 'window', color: 0x6c6052, roughness: 0.5 }
const STEEL: MaterialSpec = finish('lusail-steel', 0x62666c)

// ---------------------------------------------------------------------------
// Dimensions (model frame: x across the pitch to the east-north-east, y along
// it to the north-north-west, z up, metres; origin at the pitch centre on the
// field). See the header for where each number comes from.

const BEARING = 348
const FIELD = rrect(50.3, 50.3, 66.2, 66.2, 14) // OSM way/1006062424, corners rounded
const PODIUM_Z = 6.5
const PODIUM_R = 150
const GLASS_R = 116
const V_BOT = 11 // underside of the vessel, on its plinths
const CREASE = 54 // widest point, where the top band begins
const RIM = 64 // top of the vessel = the compression ring
// The vessel's profile, (z, r): a bowl that tucks under to its plinths, is
// widest just below the top, and leans back in a band to the roof edge.
const PROFILE: [number, number][] = [
  [V_BOT, 121], [12.5, 128], [15, 134.5], [19, 140.5], [24, 145], [30, 148.3], [37, 150.5], [45, 151.4], [CREASE, 151.5],
  [59, 150], [RIM, 147],
]
const OC_A = 43, OC_B = 60 // the roof's oculus, OSM inner way/684020897
const ROOF_R = 146 // where the membrane meets the compression ring
const roofTop = (t: number) => RIM + 0.8 + 2.8 * t // t: 0 at the rim, 1 at the oculus
const roofBot = (t: number) => RIM - 5 + 3.2 * t
const DIAMONDS = 24 // 24 plinths, 48 V-frames: the diagrid

// ---------------------------------------------------------------------------

const OUTF = (q: V3): V3 => [q[0], q[1], 0]
const UPF = (): V3 => [0, 0, 1]
const DOWNF = (): V3 => [0, 0, -1]
const INF = (q: V3): V3 => [-q[0], -q[1], 0]
const P = (r: number, f: number, z: number): V3 => [r * Math.cos(f), r * Math.sin(f), z]
const ocR = (f: number) => 1 / Math.sqrt((Math.cos(f) / OC_A) ** 2 + (Math.sin(f) / OC_B) ** 2)

/** The profile resampled to n+1 points evenly by arc length between z0 and z1. */
function resample(z0: number, z1: number, n: number): [number, number][] {
  const pts = PROFILE.filter(([z]) => z >= z0 - 1e-6 && z <= z1 + 1e-6)
  const acc = [0]
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const L = acc[acc.length - 1]
  const out: [number, number][] = []
  for (let k = 0; k <= n; k++) {
    const s = (k / n) * L
    let i = 1
    while (i < acc.length - 1 && acc[i] < s) i++
    const t = (s - acc[i - 1]) / (acc[i] - acc[i - 1])
    out.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t])
  }
  return out
}

/** A flat rib on a surface: top face and two sides, h proud of it along n. */
function rib(p: Part, A: V3, B: V3, n: V3, w: number, h: number) {
  const s = nrm3(crs(vsub(B, A), n))
  const a0 = vadd(A, vmul(s, -w / 2)), a1 = vadd(A, vmul(s, w / 2)), b0 = vadd(B, vmul(s, -w / 2)), b1 = vadd(B, vmul(s, w / 2))
  const up = (q: V3) => vadd(q, vmul(n, h))
  face(p, [up(a0), up(a1), up(b1), up(b0)], n)
  face(p, [a1, b1, up(b1), up(a1)], s)
  face(p, [a0, up(a0), up(b0), b0], vmul(s, -1))
}

/** A ridged rib: two sloped faces meeting in a crest h proud of the surface. */
function ridgeRib(p: Part, A: V3, B: V3, n: V3, w: number, h: number) {
  const s = nrm3(crs(vsub(B, A), n))
  const a0 = vadd(A, vmul(s, -w / 2)), a1 = vadd(A, vmul(s, w / 2)), b0 = vadd(B, vmul(s, -w / 2)), b1 = vadd(B, vmul(s, w / 2))
  const ca = vadd(A, vmul(n, h)), cb = vadd(B, vmul(n, h))
  face(p, [a1, b1, cb, ca], vadd(s, n))
  face(p, [a0, ca, cb, b0], vadd(vmul(s, -1), n))
}

function build(detail: boolean) {
  const gold = new Part(), gold2 = new Part(), white = new Part(), seats = new Part(), open = new Part(), steel = new Part()
  const N = detail ? 96 : 72 // around the vessel; the lattice's diagonals trace the diagrid
  const dF = (2 * Math.PI) / N
  const rowsMain = (N / DIAMONDS) * 2 // each row advances half a step: 15 deg over the main zone
  const rowsBand = 2

  // --- the golden vessel: a triangulated lattice of flat panels ----------
  const rings = [...resample(V_BOT, CREASE, rowsMain), ...resample(CREASE, RIM, rowsBand).slice(1)]
  const node = (k: number, i: number): V3 => {
    const [z, r] = rings[k]
    return P(r, (i + 0.5 * (k % 2)) * dF, z)
  }
  const tris: [V3, V3, V3, number][] = [] // corners and the ring index below
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < N; i++) {
      if (k % 2 === 0) {
        tris.push([node(k, i), node(k, i + 1), node(k + 1, i), k])
        tris.push([node(k + 1, i), node(k, i + 1), node(k + 1, i + 1), k])
      } else {
        tris.push([node(k, i), node(k, i + 1), node(k + 1, i + 1), k])
        tris.push([node(k + 1, i), node(k, i), node(k + 1, i + 1), k])
      }
    }
  for (const [a, b, c, k] of tris) {
    const n0 = nrm3(crs(vsub(b, a), vsub(c, a)))
    const ctr = vmul(vadd(vadd(a, b), c), 1 / 3)
    const n = dot(n0, OUTF(ctr)) < 0 ? vmul(n0, -1) : n0
    const part = k >= rowsMain ? gold2 : gold
    if (!detail || k >= rowsMain) { face(part, [a, b, c], n); continue }
    // A panel with its triangular opening: the frame slopes in to the
    // opening, which is set back as a dark recess (it glows at night). The
    // openings are biggest at mid-height and small in the top band.
    const zt = (ctr[2] - V_BOT) / (CREASE - V_BOT)
    const s = 0.3 + 0.16 * Math.sin(Math.PI * Math.min(1, zt))
    const q = [a, b, c].map((v) => vadd(vadd(ctr, vmul(vsub(v, ctr), s)), vmul(n, -0.7)))
    const v = [a, b, c]
    for (let e = 0; e < 3; e++) face(part, [v[e], v[(e + 1) % 3], q[(e + 1) % 3], q[e]], n)
    face(open, q, n)
  }
  // The vessel's underside, back to the concourse glazing.
  {
    const A: V3[] = [], B: V3[] = []
    for (let i = 0; i < N; i++) { A.push(P(GLASS_R, i * dF, V_BOT)); B.push(P(rings[0][1], i * dF, V_BOT)) }
    band(gold, A, B, DOWNF, true, true)
  }
  // The top of the compression ring, from the vessel's rim in to the roof.
  {
    const A: V3[] = [], B: V3[] = []
    const off = 0.5 * ((rings.length - 1) % 2)
    for (let i = 0; i < N; i++) { A.push(P(rings[rings.length - 1][1], (i + off) * dF, RIM)); B.push(P(ROOF_R - 0.5, (i + off) * dF, RIM + 0.9)) }
    band(gold2, A, B, UPF, true, true)
  }

  // --- the diagrid: 48 V-frame lines, crossing at mid-height -------------
  {
    const W = (2 * Math.PI) / DIAMONDS
    const segs = detail ? rowsMain : rowsMain / 2
    const step = rowsMain / segs
    for (let d = 0; d < DIAMONDS; d++)
      for (const dir of [1, -1]) {
        for (let s = 0; s < segs; s++) {
          const k0 = s * step, k1 = (s + 1) * step
          const at = (k: number): V3 => {
            const [z, r] = rings[k]
            return P(r, d * W + dir * (k / rowsMain) * W, z)
          }
          const A = at(k0), B = at(k1)
          const n = nrm3(OUTF(vmul(vadd(A, B), 0.5)))
          if (detail) rib(gold2, A, B, n, 1.5, 1.1)
          else ridgeRib(gold2, A, B, n, 2.4, 1.0)
        }
      }
  }

  // --- plinths and podium ---------------------------------------------------
  for (let d = 0; d < DIAMONDS; d++) {
    // A pale wedge under each diagrid foot, the bearing at its tip.
    const f = (d * 2 * Math.PI) / DIAMONDS
    const t: V3 = [-Math.sin(f), Math.cos(f), 0]
    const r0 = GLASS_R + 0.5, r1 = 125
    const base = (r: number, s: number): V3 => vadd(P(r, f, PODIUM_Z), vmul(t, s * 4.2))
    const tip = (r: number): V3 => P(r, f, V_BOT + 0.2)
    face(white, [base(r1, -1), base(r1, 1), tip(r1 - 1.5)], [Math.cos(f), Math.sin(f), 0])
    face(white, [base(r0, -1), tip(r0 + 1), base(r0, 1)], [-Math.cos(f), -Math.sin(f), 0])
    face(white, [base(r0, 1), tip(r0 + 1), tip(r1 - 1.5), base(r1, 1)], t)
    face(white, [base(r0, -1), base(r1, -1), tip(r1 - 1.5), tip(r0 + 1)], vmul(t, -1))
  }
  {
    const M = detail ? 96 : 72, g = (2 * Math.PI) / M
    const ring = (r: number, z: number) => Array.from({ length: M }, (_, i) => P(r, i * g, z))
    band(white, ring(PODIUM_R, 0), ring(PODIUM_R, PODIUM_Z), OUTF, true, true) // podium wall
    band(white, ring(GLASS_R, PODIUM_Z), ring(PODIUM_R, PODIUM_Z), UPF, true, true) // podium deck
    band(open, ring(GLASS_R, PODIUM_Z), ring(GLASS_R, V_BOT), OUTF, true, true) // concourse glazing
  }

  // --- the seating bowl -------------------------------------------------------
  {
    const M = detail ? 96 : 54, g = (2 * Math.PI) / M
    const RB = 142, ZB = 55
    // Each ray: points (d, z) and the part of the segment leading to the next.
    const prof = (f: number): [number, number, Part | null][] => {
      const d0 = rayHit(FIELD as XY[], f) + 1.0
      const pts: [number, number, Part | null][] = [[d0, 0, white], [d0, 1.6, null]]
      const stepsLow = detail ? 9 : 1, stepsUp = detail ? 14 : 1
      const lowTop: [number, number] = [d0 + 28, 15]
      const pushRake = (a: [number, number], b: [number, number], n: number) => {
        for (let s = 0; s < n; s++) {
          const x0 = a[0] + ((b[0] - a[0]) * s) / n, x1 = a[0] + ((b[0] - a[0]) * (s + 1)) / n
          const z1 = a[1] + ((b[1] - a[1]) * (s + 1)) / n
          if (detail) { pts[pts.length - 1][2] = white; pts.push([x0, z1, seats]); pts.push([x1, z1, null]) }
          else { pts[pts.length - 1][2] = seats; pts.push([x1, z1, null]) }
        }
      }
      pushRake([d0, 1.6], lowTop, stepsLow)
      // the boxes: a recessed glazed band between the tiers
      pts[pts.length - 1][2] = white; pts.push([d0 + 30, 15, open]); pts.push([d0 + 30, 21.2, white]); pts.push([d0 + 28.6, 21.2, white]); pts.push([d0 + 28.6, 23, null])
      pushRake([d0 + 28.6, 23], [RB, ZB], stepsUp)
      pts[pts.length - 1][2] = white
      const tb = (ROOF_R - RB) / (ROOF_R - ocR(f))
      pts.push([RB, roofBot(tb) + 0.3, null])
      return pts
    }
    const profs = Array.from({ length: M }, (_, i) => prof(i * g))
    const L = profs[0].length
    for (let j = 0; j < L - 1; j++) {
      const r0 = profs.map((pp, i) => P(pp[j][0], i * g, pp[j][1]))
      const r1 = profs.map((pp, i) => P(pp[j + 1][0], i * g, pp[j + 1][1]))
      const part = profs[0][j][2]
      if (!part) continue
      const horiz = Math.abs(profs[0][j + 1][1] - profs[0][j][1]) < 1e-6
      const vert = Math.abs(profs[0][j + 1][0] - profs[0][j][0]) < 1e-6
      // Faces look in to the pitch and up.
      const hint = horiz ? UPF : vert ? (profs[0][j + 1][1] > profs[0][j][1] ? INF : OUTF) : (q: V3): V3 => [-q[0] * 0.5, -q[1] * 0.5, Math.hypot(q[0], q[1])]
      // the box band's soffit faces down
      const h2 = part === white && horiz && profs[0][j][0] > profs[0][j + 1][0] ? DOWNF : hint
      band(part, r0, r1, h2, true, true)
    }
  }

  // --- the roof: PTFE membrane in radial pillows on a spoke-wheel net -------
  {
    const M = detail ? 96 : 48, g = (2 * Math.PI) / M
    const ts = detail ? [0, 0.25, 0.5, 0.75, 1] : [0, 0.5, 1]
    const at = (f: number, t: number, z: number): V3 => P(ROOF_R + (ocR(f) - ROOF_R) * t, f, z)
    const ridge = detail ? 2.2 : 2.0
    // Valleys on the cable lines, a ridge down each bay's middle.
    for (let i = 0; i < M; i++) {
      const fa = i * g, fm = (i + 0.5) * g, fb = (i + 1) * g
      for (let k = 0; k < ts.length - 1; k++) {
        const t0 = ts[k], t1 = ts[k + 1]
        const h0 = ridge * Math.sin(Math.PI * Math.min(1, 0.15 + t0 * 0.85)) + 0.3, h1 = ridge * Math.sin(Math.PI * Math.min(1, 0.15 + t1 * 0.85)) + 0.3
        const A0 = at(fa, t0, roofTop(t0)), A1 = at(fa, t1, roofTop(t1))
        const B0 = at(fb, t0, roofTop(t0)), B1 = at(fb, t1, roofTop(t1))
        const M0 = at(fm, t0, roofTop(t0) + h0), M1 = at(fm, t1, roofTop(t1) + h1)
        face(white, [A0, M0, M1, A1], UPF())
        face(white, [M0, B0, B1, M1], UPF())
      }
      // the underside (dark steel net and soffit) and the oculus edge
      const ia = at(fa, 1, roofBot(1)), ib = at(fb, 1, roofBot(1)), ja = at(fa, 1, roofTop(1)), jb = at(fb, 1, roofTop(1)), jm = at(fm, 1, roofTop(1) + ridge * Math.sin(Math.PI * 1) + 0.3)
      face(steel, [ia, ib, jb, ja], INF(ia))
      face(steel, [ja, jb, jm], INF(ja))
    }
    // The compression ring's inner face under the membrane's edge, and the soffit.
    {
      const A: V3[] = [], B: V3[] = [], C: V3[] = []
      for (let i = 0; i < M; i++) { A.push(at(i * g, 0, roofBot(0))); B.push(at(i * g, 0, roofTop(0))); C.push(at(i * g, 1, roofBot(1))) }
      band(steel, A, B, INF, true, true)
      band(steel, A, C, DOWNF, true, true)
    }
    if (detail) {
      // 48 spokes: lower radial cable and spacer struts under the membrane,
      // and the two tension rings at the oculus.
      const K = 48
      for (let i = 0; i < K; i++) {
        const f = (i * 2 * Math.PI) / K
        const n = 2
        for (let s = 0; s < n; s++) {
          const t0 = s / n, t1 = (s + 1) / n
          const sag = (t: number) => -2.2 * Math.sin(Math.PI * t)
          bar(steel, at(f, t0, roofBot(t0) + sag(t0)), at(f, t1, roofBot(t1) + sag(t1)), 1.0, 1.0, [0, 0, 1], false)
          if (s > 0) bar(steel, at(f, t0, roofBot(t0) + sag(t0)), at(f, t0, roofBot(t0)), 0.8, 0.8, [1, 0, 0], false)
        }
      }
      for (const z of [roofBot(1) - 1.4]) {
        for (let i = 0; i < M; i++) bar(steel, at(i * g, 1, z), at((i + 1) * g, 1, z), 1.4, 1.4, [0, 0, 1], false)
      }
    }
  }

  return [
    { part: gold, material: GOLD },
    { part: gold2, material: GOLD2 },
    { part: white, material: WHITE },
    { part: seats, material: SEATS },
    { part: open, material: OPEN },
    { part: steel, material: STEEL },
  ]
}

if (import.meta.main) {
  const extras = { name: 'Lusail Stadium', bearing: BEARING }
  await writeLods('lusail-stadium', extras, [
    { file: 'lusail-stadium.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'lusail-stadium.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1_500_000 },
  ])
}
