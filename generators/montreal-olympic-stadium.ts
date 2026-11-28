/**
 * Olympic Stadium (Stade olympique) and the Montreal Tower: original
 * procedural geometry, CC0-1.0, no textures.
 *   bun generators/montreal-olympic-stadium.ts
 *
 * One landmark: the bowl, the inclined tower and the sports-centre base
 * under the tower (the tower is its own OSM building, way/20213158, whose
 * outline also takes in that base; both are replaced). Writes two levels:
 * - models/montreal-olympic-stadium.glb, the low model (<= 6,500 tris);
 * - models/montreal-olympic-stadium.detail.glb, from zoom 16: each console
 *   pair drawn as its two ribs, finer shell and membrane, the shell's
 *   transom, the tower's niche recessed 7 m, the funicular rail.
 *
 * Map frame: x east', y north', z up, metres, turned to bearing 351.4 (the
 * principal axis of the stadium outline way/108505523, which the tower's
 * axis, 349.6, also follows). +y runs along the long axis toward the tower.
 * Anchor: the bowl's centre, lng -73.5516318, lat 45.5577033 (the outline's
 * area centroid is 11 m north of it, pulled by the junction with the tower).
 *
 * Identity, in order: the inclined tower, leaning south over the bowl, its
 * front face from vertical to 45 degrees, its long back spine, the cap with
 * the observatory, the dark niche under it and the side glazing; the
 * 26 cables fanning from the niche to the roof; the bowl's ring of curved
 * concrete consoles (17 pairs on the ground, 2 pairs on the tower) standing
 * proud of the grey shell, legs on the ground and tips turned up over the
 * technical ring; the dark glazed concourse band under the shell's lip; the
 * white membrane roof in tent facets.
 *
 * Evidence
 *  - OSM: way/108505523 (building=stadium, Q285467), in this frame x
 *    -130..131, y -142..+150 (its north edge is the straight junction with
 *    the tower); way/20213158 (Tour de Montréal, height=165, Q61602719),
 *    the tower's overhang and its base, y +71..+340.
 *  - Published (parcolympique.qc.ca "Data and statistics"; fr.wikipedia
 *    "Stade olympique de Montréal"): outside 284 x 245 m, stadium and tower
 *    484 m long; height 61 m at the centre of the covered stadium; tower
 *    165 m, front (south) face 0 -> 45 degrees, back face 81 -> 22.5 degrees
 *    (from the vertical), funicular rails 266 m on the back; observatory 3
 *    floors at the top (1,526 m2), outside niche 35 m high, 9-18 m wide,
 *    6-8 m deep; technical ring 175 x 104 m; 38 consoles, 34 on the ground
 *    and 4 on the tower, in 17 + 2 pairs; 26 cables carry the roof.
 *  - Heights used: field y = 0; console tops 46 m, technical ring 47.5 m,
 *    membrane to 61.5 m at the centre (published 61); tower 165 m + cap
 *    and mast to 180 m (published 165 to the top of the concrete/steel;
 *    the mast is estimated from p25a).
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - aerial: Wilfredor, "Aerial view of Olympic Stadium of Montreal.jpg", CC0, from the west (Mont Royal).
 *      https://commons.wikimedia.org/wiki/File:Aerial_view_of_Olympic_Stadium_of_Montreal.jpg
 *    - may24: Acediscovery, "Montreal-Olympic-Stadium-May-2024.jpg", CC BY 4.0, the south-west at plaza level: console pairs, shell, base glazing.
 *      https://commons.wikimedia.org/wiki/File:Montreal-Olympic-Stadium-May-2024.jpg
 *    - mtroyal: Declan Martin, "Montreal Olympic Stadium from Mont Royal.JPG", CC BY-SA 3.0.
 *      https://commons.wikimedia.org/wiki/File:Montreal_Olympic_Stadium_from_Mont_Royal.JPG
 *    - fromtower: Eric Marshall, "Olympic Stadium from Tower - panoramio.jpg", CC BY 3.0: the membrane's tent facets, the shell bays.
 *      https://commons.wikimedia.org/wiki/File:Olympic_Stadium_from_Tower_-_panoramio.jpg
 *    - pano: Paolo Costa Baldi, "Montreal - Olympic Park panorama - Cropped version.jpg", CC BY 3.0, from the south-west esplanade.
 *      https://commons.wikimedia.org/wiki/File:Montreal_-_Olympic_Park_panorama_-_Cropped_version.jpg
 *    - jg1: Jeangagnon, "Stade olympique de Montreal 01.JPG", CC BY-SA 3.0, from the east: the tower's side profile, cables.
 *      https://commons.wikimedia.org/wiki/File:Stade_olympique_de_Montreal_01.JPG
 *    - bb1: Bohemian Baltimore, "Montreal Tower, La Tour de Montréal 01.jpg", CC BY-SA 4.0, the tower from the north-east.
 *      https://commons.wikimedia.org/wiki/File:Montreal_Tower,_La_Tour_de_Montr%C3%A9al_01.jpg
 *    - gv2: Guilhem Vellut, "Olympic Stadium @ Montreal (30394986356).jpg", CC BY 2.0, the tower from behind (north).
 *      https://commons.wikimedia.org/wiki/File:Olympic_Stadium_@_Montreal_(30394986356).jpg
 *    - inside24: Quintin Soloviev, "À l'intérieur du stade olympique lors des rénovations de 2024.jpg", CC BY 4.0: the roof's hub structure.
 *      https://commons.wikimedia.org/wiki/File:%C3%80_l%27int%C3%A9rieur_du_stade_olympique_lors_des_r%C3%A9novations_de_2024.jpg
 *    - vaer: abdallahh, "Stade olympique de Montréal vue aérienne (2350811667).jpg", CC BY 2.0: plan, roof extent.
 *      https://commons.wikimedia.org/wiki/File:Stade_olympique_de_Montr%C3%A9al_vue_a%C3%A9rienne_(2350811667).jpg
 *    - mast: Roger Hart, "Montreal Stadium full mast.jpg", CC BY-SA 2.0, from the east: side glazing.
 *      https://commons.wikimedia.org/wiki/File:Montreal_Stadium_full_mast.jpg
 *    - p25a: Dillan Payne, "Olympic Stadium Montreal, July 26 2025 (04).jpg", CC BY-SA 4.0: the back spine, rail, cap, side glazing, colour.
 *      https://commons.wikimedia.org/wiki/File:Olympic_Stadium_Montreal,_July_26_2025_(04).jpg
 *  No lidar or NAIP here (Canada); no commercial imagery used.
 *
 * Estimated, and doubts:
 *  - The shell top / console ring (156 x 194 m) and the membrane's rim
 *    (134 x 174 m) are scaled from aerial, vaer and fromtower (the white
 *    region reads about 64% of the stadium's width); the published
 *    technical ring is 175 x 104, which would leave a narrower roof on the
 *    short axis than the photos show. The shell's profile is a power curve
 *    fitted by eye to may24.
 *  - The tower's widths across (32 m at the foot to 12 m at the neck, 15.5
 *    at the cap) are scaled from pano and may24; the back spine follows the
 *    published angles, its flat tail reaching the ground ~100 m behind the
 *    top. The side glazing's outline is drawn from p25a and mast.
 *  - The sports-centre base is OSM's tower outline extruded to 16 m (its
 *    curved shells and skylights are not drawn); its window band is invented.
 *  - The cables' roof ends are spread over the membrane (inside24 shows
 *    hubs across the whole roof); their order is invented.
 *  - ROOF: the 1998 membrane was taken off in 2024 (inside24) and a new
 *    steel roof with a glazed ring is being built (fr.wikipedia: halfway in
 *    March 2026, due 2027). No licensed photo of the new roof exists yet, so
 *    the model keeps the white membrane as in every exterior photo. Rework
 *    the roof when the new one is photographed.
 *  - The stands are not drawn: the roof is opaque and hides them.
 *  - Elevation 0. The field (y = 0) is taken at the lowest ground under the
 *    footprint (Mapterhorn: the south edge, about 7 m below the esplanade
 *    plateau round the bowl); no published field depth was found. The
 *    console feet on the esplanade side are buried by up to 7 m, as the
 *    real ones stand on the plaza.
 *  - OSM's six small building:parts at x about -155 (way/1050391838-43)
 *    are outside the model and not replaced.
 *  - Night: the tower is floodlit (concrete `_FLOODLIGHT`, strongest on the
 *    upper tower), the membrane faintly; the office glazing, observatory and
 *    concourse band are `window`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { face, beam, nrm3, crs, vsub, vadd, vmul, dot } from './seoul-world-cup-stadium'
import { band, rod3, bar, writeLods, type XY } from './milan-san-siro'
import { triangulate } from './chi-aon-center'

const BEARING = 351.4
const D2R = Math.PI / 180

// ---------------------------------------------------------------------------
// The bowl: an elliptical shell of 38 curved consoles, x across (east'), y
// along the axis (north', toward the tower).

const AF = 127, BF = 139 // the shell's foot (z = ZF), elliptical half-axes
const AT = 78, BT = 97 // the shell's top, the consoles' ring (z = ZT)
const ZF = 10, ZT = 46, Q = 2.2
const RING_IN: XY = [67, 87] // the technical ring's inner edge, the roof's rim
const Z_RING = 47.5
const N_RIB = 19 // 17 pairs of consoles on the ground + 2 pairs on the tower

/** Shell point at angle phi (elliptical parameter), h 0 at the top .. 1 at the foot (> 1 below, < 0 inward). */
function shellAt(phi: number, h: number): V3 {
  const A = AT + (AF - AT) * h, B = BT + (BF - BT) * h
  const z = h >= 0 ? ZF + (ZT - ZF) * (1 - Math.pow(h, Q)) : ZT + 3.2 * Math.min(1, -h / 0.16)
  return [A * Math.cos(phi), B * Math.sin(phi), z]
}
/** Outward normal of the shell. */
function shellN(phi: number, h: number): V3 {
  const e = 1e-3
  const dh = vsub(shellAt(phi, h + e), shellAt(phi, h - e))
  const dp = vsub(shellAt(phi + e, h), shellAt(phi - e, h))
  let n = nrm3(crs(dp, dh))
  const p = shellAt(phi, h)
  if (dot(n, [p[0], p[1], 0.3 * Math.hypot(p[0], p[1])]) < 0) n = vmul(n, -1)
  return n
}
const H_LEG = Math.pow(1 + ZF / (ZT - ZF), 1 / Q) // where the console meets the ground
const H_TIP = -0.16

// ---------------------------------------------------------------------------
// The tower: horizontal sections between a front curve (south face, from
// vertical at the foot to 45 degrees at the top) and a back curve (the
// funicular's spine, 23 -> 64 degrees, run stretched to the OSM tail).

const T_TOP = 165
const V_TF = 73 // the top's front edge (OSM tower outline's southern tip)
const V_TB = 109 // the top's back edge (36 m deep cap)
const LF = (T_TOP * (Math.PI / 4)) / Math.sin(Math.PI / 4)
const V_FF = V_TF + (LF * (1 - Math.cos(Math.PI / 4))) / (Math.PI / 4)

function frontV(z: number) {
  const a = Math.asin(Math.min(1, (z * (Math.PI / 4)) / LF))
  return V_FF - (LF * (1 - Math.cos(a))) / (Math.PI / 4)
}
const BACK: [number, number][] = (() => {
  // the spine's angle from the horizontal, 9 degrees at the foot (the long
  // flat tail) rising quickly to 67 near the top (published 81 -> 22.5
  // degrees from the vertical); run integrated up the height
  const pts: [number, number][] = [[V_TB, T_TOP]]
  const n = 330
  let v = V_TB
  for (let k = n - 1; k >= 0; k--) {
    const z = (T_TOP * (k + 0.5)) / n
    const a = (9 + 58 * (1 - Math.exp(-z / 14))) * D2R
    v += T_TOP / n / Math.tan(a)
    pts.push([v, (T_TOP * k) / n])
  }
  return pts.reverse()
})()
export const V_TAIL = BACK[0][0]
function backV(z: number) {
  for (let k = 0; k < BACK.length - 1; k++) {
    const [v0, z0] = BACK[k], [v1, z1] = BACK[k + 1]
    if (z <= z1) return v0 + ((v1 - v0) * (z - z0)) / (z1 - z0)
  }
  return V_TB
}
const lerpTab = (tab: [number, number][], z: number) => {
  if (z <= tab[0][0]) return tab[0][1]
  for (let k = 0; k < tab.length - 1; k++)
    if (z <= tab[k + 1][0]) return tab[k][1] + ((tab[k + 1][1] - tab[k][1]) * (z - tab[k][0])) / (tab[k + 1][0] - tab[k][0])
  return tab[tab.length - 1][1]
}
const WF: [number, number][] = [[0, 32], [16, 26], [36, 20], [60, 16], [90, 13], [120, 12], [145, 13.5], [166, 15.5]]
const WB: [number, number][] = [[0, 4.5], [30, 6], [80, 9], [120, 11.5], [166, 14.5]]
const NICHE_W = 6.5
const GLAZE: [number, number] = [16, 108]
const OBS: [number, number] = [152, 162]
const NICHE: [number, number] = [116, 152]
const glazeFrac = (z: number) => {
  const zz = Math.min(GLAZE[1], Math.max(GLAZE[0], z))
  return 0.05 + 0.4 * Math.pow((GLAZE[1] - zz) / (GLAZE[1] - GLAZE[0]), 1.3)
}

/** A section ring, counter-clockwise from above: front (niche split), right side (glazing split), back, left side. */
function section(z: number): V3[] {
  const F = frontV(z), B = backV(z), wf = lerpTab(WF, z), wb = lerpTab(WB, z), g = glazeFrac(z)
  const side = (s: number, f: number): V3 => [s * (wf + (wb - wf) * f), F + (B - F) * f, z]
  return [
    [-wf, F, z], [-NICHE_W, F, z], [NICHE_W, F, z], [wf, F, z],
    side(1, 0.04), side(1, g), [wb, B, z], [-wb, B, z], side(-1, g), side(-1, 0.04),
  ]
}

// ---------------------------------------------------------------------------

type Parts = { concrete: Part; panel: Part; roof: Part; win: Part; steel: Part }

function build(detail: boolean) {
  const P: Parts = { concrete: new Part(), panel: new Part(), roof: new Part(), win: new Part(), steel: new Part() }
  const { concrete, panel, roof, win, steel } = P
  const cable = new Part()
  const ribPhi = Array.from({ length: N_RIB }, (_, k) => (90 + ((k + 0.5) * 360) / N_RIB) * D2R)
  const bayPhi: number[] = []
  const sub = detail ? 6 : 3
  for (let k = 0; k < N_RIB; k++) {
    const a = ribPhi[k], b = k + 1 < N_RIB ? ribPhi[k + 1] : ribPhi[0] + 2 * Math.PI
    for (let s = 0; s < sub; s++) bayPhi.push(a + ((b - a) * s) / sub)
  }

  // --- the shell between the consoles: grey glazing and cladding, over a
  // pale sill at its foot
  const hs = detail ? [0, 0.12, 0.25, 0.38, 0.5, 0.62, 0.75, 0.86, 0.92, 1] : [0, 0.3, 0.6, 0.86, 1]
  for (let r = 0; r < hs.length - 1; r++) {
    band(hs[r] >= 0.86 ? concrete : panel, bayPhi.map((f) => shellAt(f, hs[r + 1])), bayPhi.map((f) => shellAt(f, hs[r])), (q) => [q[0], q[1], 0.6 * Math.hypot(q[0], q[1])])
  }
  // a pale horizontal transom across the panels (detail)
  if (detail) {
    const hl = 0.5
    band(concrete, bayPhi.map((f) => vadd(shellAt(f, hl), vmul(shellN(f, hl), 0.5))), bayPhi.map((f) => shellAt(f, hl - 0.02)), (q) => [q[0], q[1], 2 * Math.hypot(q[0], q[1])])
    band(concrete, bayPhi.map((f) => shellAt(f, hl + 0.02)), bayPhi.map((f) => vadd(shellAt(f, hl), vmul(shellN(f, hl), 0.5))), (q) => [q[0], q[1], -0.3 * Math.hypot(q[0], q[1])])
  }

  // --- the base: a recessed concourse wall glazed between the consoles' legs,
  // under the shell's lip
  const inset = 3.5
  const baseRing = (z: number) => bayPhi.map((f) => [(AF - inset) * Math.cos(f), (BF - inset) * Math.sin(f), z] as V3)
  band(concrete, baseRing(0), baseRing(ZF), (q) => [q[0], q[1], 0])
  band(concrete, baseRing(ZF), bayPhi.map((f) => shellAt(f, 1)), () => [0, 0, -1]) // soffit
  for (let k = 0; k < bayPhi.length; k++) {
    const f0 = bayPhi[k], f1 = bayPhi[(k + 1) % bayPhi.length] + (k + 1 === bayPhi.length ? 2 * Math.PI : 0)
    const first = k % sub === 0, last = (k + 1) % sub === 0
    const a = first ? f0 + (f1 - f0) * 0.4 : f0, b = last ? f1 - (f1 - f0) * 0.4 : f1
    const o = (AF - inset + 0.05), oy = (BF - inset + 0.05)
    const pt = (f: number, z: number): V3 => [o * Math.cos(f), oy * Math.sin(f), z]
    face(win, [pt(a, 1.6), pt(b, 1.6), pt(b, 8.8), pt(a, 8.8)], [Math.cos((a + b) / 2), Math.sin((a + b) / 2), 0])
  }

  // --- the consoles, in pairs: bold curved ribs standing proud of the
  // shell, their legs reaching the ground, their tips turned up over the
  // technical ring. The low model draws each pair as one broad rib.
  const hsR = detail
    ? [H_TIP, H_TIP / 2, 0, 0.08, 0.17, 0.27, 0.38, 0.5, 0.62, 0.74, 0.86, 0.95, 1, 1.06, H_LEG]
    : [H_TIP, 0, 0.17, 0.38, 0.6, 0.82, 1, H_LEG]
  const RD = 3.4 // radial depth
  for (const f of ribPhi) {
    const tang: V3 = nrm3([-Math.sin(f) * AF, Math.cos(f) * BF, 0])
    const offs = detail ? [-2.0, 2.0] : [0]
    const w = detail ? 3.4 : 6.2
    for (const o of offs) {
      const path = hsR.map((h) => {
        const n = shellN(f, Math.max(0, Math.min(1, h)))
        return vadd(vadd(shellAt(f, h), vmul(n, RD / 2 - 0.2)), vmul(tang, o))
      }).reverse() // from the ground up, so the cap is the tip
      beam(concrete, path, RD, w, tang)
    }
  }

  // --- the technical ring: a concrete annulus the consoles' tips meet
  const NR = detail ? 96 : 48
  const ringPhi = Array.from({ length: NR }, (_, k) => (k / NR) * 2 * Math.PI)
  const el = (A: number, B: number, z: number) => ringPhi.map((f) => [A * Math.cos(f), B * Math.sin(f), z] as V3)
  band(concrete, el(RING_IN[0], RING_IN[1], Z_RING), el(AT + 1, BT + 1, Z_RING), () => [0, 0, 1])
  band(concrete, el(RING_IN[0], RING_IN[1], Z_RING - 4), el(RING_IN[0], RING_IN[1], Z_RING), (q) => [-q[0], -q[1], 0])
  band(concrete, el(AT + 1, BT + 1, Z_RING), el(AT, BT, ZT), (q) => [q[0], q[1], 0.5])

  // --- the roof: a white membrane in tent facets, peaks at the cable hubs
  const RR = detail ? 7 : 5, NN = detail ? 36 : 24
  const rho = (i: number) => 1 - i / RR
  const rz = (r: number, peak: boolean) => Z_RING + 10.5 * (1 - r * r) + (peak ? 3.4 : 0)
  const ringPt = (i: number, k: number): V3 => {
    const r = rho(i), f = ((k + (i % 2) * 0.5) / NN) * 2 * Math.PI
    return [RING_IN[0] * r * Math.cos(f), RING_IN[1] * r * Math.sin(f), rz(r, i > 0)]
  }
  const centre: V3 = [0, 0, Z_RING + 10.5 + 2.6]
  for (let i = 0; i < RR - 1; i++)
    for (let k = 0; k < NN; k++) {
      const a = ringPt(i, k), b = ringPt(i, (k + 1) % NN)
      const c = i % 2 === 0 ? ringPt(i + 1, k) : ringPt(i + 1, (k + 1) % NN)
      const c0 = i % 2 === 0 ? ringPt(i + 1, (k - 1 + NN) % NN) : ringPt(i + 1, k)
      face(roof, [a, b, c], [0, 0, 1])
      face(roof, [a, c, c0], [0, 0, 1])
    }
  for (let k = 0; k < NN; k++) face(roof, [ringPt(RR - 1, k), ringPt(RR - 1, (k + 1) % NN), centre], [0, 0, 1])

  // --- the tower
  const zs = detail
    ? [0, 2, 4, 6.5, 9, 12, 16, 21, 26, 32, 38, 45, 52, 60, 68, 76, 84, 92, 100, 108, 116, 124, 132, 139, 145, 152, 157, 162, 166]
    : [0, 4, 9, 16, 26, 38, 52, 68, 84, 100, 116, 132, 145, 152, 162, 166]
  const secs = zs.map(section)
  const inR = (z0: number, z1: number, r: [number, number]) => z0 >= r[0] - 1e-6 && z1 <= r[1] + 1e-6
  for (let k = 0; k < zs.length - 1; k++) {
    const A = secs[k], B = secs[k + 1], z0 = zs[k], z1 = zs[k + 1]
    const n = A.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      let p = concrete
      const obs = inR(z0, z1, OBS)
      if (i === 1 && inR(z0, z1, NICHE)) p = detail ? concrete : steel
      if ((i === 4 || i === 7) && inR(z0, z1, GLAZE)) p = win
      if (obs && i !== 6) p = win
      if (detail && i === 1 && inR(z0, z1, NICHE)) {
        // the niche, recessed 7 m into the front face, dark inside
        const d: V3 = [0, 7, 0]
        const a0 = vadd(A[1], d), a1 = vadd(A[2], d), b0 = vadd(B[1], d), b1 = vadd(B[2], d)
        steel.quad(a0, a1, b1, b0)
        face(concrete, [A[1], a0, b0, B[1]], [1, 0, 0])
        face(concrete, [a1, A[2], B[2], b1], [-1, 0, 0])
        if (z0 === NICHE[0]) face(concrete, [A[1], A[2], a1, a0], [0, 0, 1])
        if (z1 === NICHE[1]) face(concrete, [B[1], b0, b1, B[2]], [0, 0, -1])
        continue
      }
      p.quad(A[i], A[j], B[j], B[i])
    }
  }
  // the cap and its visor, the antenna mast
  const top = secs[secs.length - 1]
  face(concrete, top, [0, 0, 1])
  const capPts = top.filter((_, i) => [0, 3, 6, 7].includes(i)).map((q) => [q[0] * 1.08, q[1], q[2]] as V3)
  const cF = capPts[0][1] - 1.5, cB = capPts[2][1] + 0.5
  const cap: XY[] = [[capPts[0][0], cF], [capPts[1][0], cF], [capPts[2][0], cB], [capPts[3][0], cB]]
  for (let i = 0; i < 4; i++) {
    const a = cap[i], b = cap[(i + 1) % 4]
    face(concrete, [[a[0], a[1], 166], [b[0], b[1], 166], [b[0], b[1], 168], [a[0], a[1], 168]], [b[1] - a[1], -(b[0] - a[0]), 0])
  }
  face(concrete, cap.map(([x, y]) => [x, y, 168] as V3), [0, 0, 1])
  face(concrete, cap.map(([x, y]) => [x, y, 166] as V3), [0, 0, -1])
  const mid = (top[6][1] + top[0][1]) / 2
  bar(steel, [0, mid + 6, 168], [0, mid + 6, 180], 1.0, 1.0)
  if (detail) {
    // the funicular's rail in its groove down the back spine
    const railZ = zs.filter((z) => z >= 9 && z <= 162)
    const path = railZ.map((z) => [0, backV(z) + 0.4, z] as V3)
    beam(steel, path, 2.6, 0.5, [1, 0, 0])
  }

  // --- the 26 cables from the niche to hubs on the roof
  const hubs: V3[] = []
  for (let k = 0; k < 12; k++) {
    const f = ((-60 + (k * 300) / 11) * D2R) - Math.PI / 2 // round the south and the sides
    const r = 0.72
    hubs.push([RING_IN[0] * r * Math.cos(f), RING_IN[1] * r * Math.sin(f), rz(r, true)])
  }
  for (let k = 0; k < 10; k++) {
    const f = ((k * 360) / 10 + 18) * D2R
    const r = 0.42
    hubs.push([RING_IN[0] * r * Math.cos(f), RING_IN[1] * r * Math.sin(f), rz(r, true)])
  }
  for (const [x, y] of [[-14, 30], [14, 30], [-14, -30], [14, -30]] as XY[]) hubs.push([x, y, rz(Math.hypot(x / RING_IN[0], y / RING_IN[1]), true)])
  hubs.sort((a, b) => a[1] - b[1]) // farthest (south) first
  hubs.forEach((h, i) => {
    const t = i / (hubs.length - 1)
    const z = 150 - 30 * t
    const u = Math.max(-5, Math.min(5, h[0] * 0.08))
    const A: V3 = [u, frontV(z) + (detail ? 3 : -0.2), z]
    rod3(cable, A, h, detail ? 0.4 : 0.5)
  })

  // --- the tower's base: the sports centre under the tower (the rest of
  // the OSM tower outline north of the bowl), bridged to the bowl
  const raw: XY[] = [[-65.9, 138.7], [-76.0, 151.1], [-98.2, 178.2], [-101.8, 182.7], [-108.1, 190.5], [-100.6, 198.2], [-96.5, 202.4], [-60.5, 239.1], [-34.2, 262.0], [-27.5, 272.8], [-20.0, 329.1], [-10.9, 329.3], [-0.2, 274.5], [8.3, 266.8], [18.8, 259.6], [28.8, 252.8], [38.8, 245.2], [47.8, 237.9], [60.4, 227.0], [69.6, 218.4], [76.9, 211.1], [80.0, 207.6], [84.1, 205.2], [87.5, 204.9], [90.5, 203.9], [91.0, 202.0], [90.1, 197.6], [86.3, 196.3], [82.6, 193.0], [78.6, 188.3], [63.8, 166.1], [58.6, 158.5], [52.1, 148.8]]
  const pod: XY[] = raw.map(([u, v]) => [u + 1, v + 11] as XY)
  // the bridge along the bowl's foot, from the east end of the cut to the west
  const bridge: XY[] = []
  for (let k = 0; k <= 6; k++) {
    const x = 53 - (118 * k) / 6
    bridge.push([x, (BF - inset - 1) * Math.sqrt(Math.max(0, 1 - (x / (AF - inset - 1)) ** 2))])
  }
  const podium: XY[] = [...pod, ...bridge]
  // make it counter-clockwise
  let ar = 0
  for (let i = 0; i < podium.length; i++) { const [a, b] = podium[i], [c, d] = podium[(i + 1) % podium.length]; ar += a * d - b * c }
  if (ar < 0) podium.reverse()
  const PZ = 16
  for (const [a, b, c] of triangulate(podium)) face(concrete, [[...podium[a], PZ], [...podium[b], PZ], [...podium[c], PZ]] as V3[], [0, 0, 1])
  for (let i = 0; i < podium.length; i++) {
    const a = podium[i], b = podium[(i + 1) % podium.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    face(concrete, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], PZ], [a[0], a[1], PZ]], n)
    if (L > 8 && Math.hypot((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 / 1.1) > 125) {
      const o = vmul(nrm3(n), 0.06)
      const t = 1.5 / L
      const p0: V3 = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0], p1: V3 = [b[0] - (b[0] - a[0]) * t, b[1] - (b[1] - a[1]) * t, 0]
      face(win, [vadd([p0[0], p0[1], 9], o), vadd([p1[0], p1[1], 9], o), vadd([p1[0], p1[1], 13.5], o), vadd([p0[0], p0[1], 13.5], o)], n)
    }
  }

  // nothing below the field: the consoles' feet are cut at y = 0
  for (const q of [concrete, panel, roof, win, steel, cable]) for (let i = 1; i < q.pos.length; i += 3) if (q.pos[i] < 0) q.pos[i] = 0
  const tower = (p: V3, n: V3) => (p[1] > 60 && p[2] > 20 ? (n[2] < -0.3 ? 0.9 : 0.7) : p[2] > 20 && n[2] < 0.5 ? 0.45 : 0.2)
  return [
    { part: concrete, material: { ...finish('mtl-concrete', 0xe7e0d2), floodlight: tower } },
    { part: panel, material: finish('mtl-shell-panels', 0x8d9a9b) },
    { part: roof, material: { ...finish('mtl-membrane', 0xe9ecec), floodlight: () => 0.35 } },
    { part: win, material: { ...PALETTE.window, color: 0x5d6b77 } },
    { part: steel, material: finish('mtl-steel', 0x5b6169) },
    { part: cable, material: finish('mtl-cables', 0x858c93) },
  ]
}

if (import.meta.main)
  await writeLods('Olympic Stadium (Stade olympique) and Montreal Tower', { bearing: BEARING, elevation: 0, height: 180 }, [
    { file: 'montreal-olympic-stadium.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'montreal-olympic-stadium.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1_500_000 },
  ])
