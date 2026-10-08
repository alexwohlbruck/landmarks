/**
 * Theme Building, Los Angeles International Airport (1961, Pereira &
 * Luckman with Paul R. Williams and Welton Becket; first design by James
 * Langenheim) — procedural, CC0-1.0.
 * bun generators/la-theme-building.ts
 *
 * Map frame: x along one arch (the "east-west" arch, bearing 83°), y along
 * the other (bearing 353°), z up, metres. Placed at bearing 353°. The anchor
 * is the centre of the four feet (the mean of the four leg tips of OSM
 * way/37891817), which is where the arches cross; the outline's own area
 * centroid sits 1.5 m east of it only because the outline is drawn
 * unevenly. y = 0 is the lowest ground round the feet (LA County lidar,
 * 31.9 m).
 *
 * What makes it the Theme Building: two white parabolic arches crossing at
 * the top, each leg broadening from a slim foot to a Y where it meets the
 * saucer's rim and continues as a slim rib to the crown; the flat saucer
 * with its outward-leaning ring of restaurant glass and a heavy rounded
 * lower rim; the blue-tiled core through it, standing up as a drum on the
 * roof deck; and, round the base, the low circular perforated screen wall.
 *
 * Sources:
 * - Plan: OSM way/37891817 (the outline: the saucer rim, radius ~23.5 m,
 *   flaring into the four legs, whose tips give the feet and the bearing:
 *   353.0° and 83.0°, at right angles; foot to foot 103.8 m both ways).
 *   OSM way/476168322 (the round base building, radius 31.5 m). USGS NAIP
 *   orthophoto (the arches' directions, the base roof and the screen ring
 *   at radius 36.5 m).
 * - Heights (LA County 2020 lidar surface model, 1 m along each arch and a
 *   1.5 m grid over the saucer, over the lidar ground at the feet):
 *   arches' top 40.3 m at the crossing, and the arch top surface follows a
 *   true parabola through the feet (24.1 m at 33 m out, 34.6 m at 20 m,
 *   10.3 m at 45 m); saucer roof deck 24.5 m, its rim falling to 23.6 m;
 *   drum on the deck 31.2 m, radius 5.5 m; base building roof 6.6 m and
 *   screen wall 8.3 m (one clean sample on each of two bearings; trees
 *   elsewhere), not used: the photos show both far lower (see the base).
 * - Published: arches 135 ft (41.1 m) high and 340 ft (103.6 m) across the
 *   feet (Water and Power Associates; LAWA); core of reinforced concrete,
 *   30 ft across (the tiled drum outside it measures 11 m); lower 15 ft of
 *   the legs concrete, the rest stucco over steel trusses (Wikipedia).
 * - Photos (Wikimedia Commons): "Theme building LAX AIRPORT (10629344455)"
 *   (Eric Salard, CC BY-SA 2.0; from the airside along one arch, the
 *   other in profile; north or south, the model is the same both ways), "6207-LAX Theme Building-Restaurant" (EditorASC,
 *   CC BY-SA 4.0; 1961-62, the same alignment from the street), "Theme
 *   Building Los Angeles International Airport 2019" (Steven Lek, CC BY-SA
 *   4.0), "Theme Building (Los Angeles International Airport) in July 2023
 *   (2)" (Benoît Prieur, CC0; from the north-east, the
 *   control tower behind to the right), "The Theme
 *   Building ... (14516663392)" (Ken Lund, CC BY-SA 2.0),
 *   "LAX Theme Building and moon from northwest 2016-07-21"
 *   (Junkyardsparkle, CC0; night, silhouette only).
 * - Overhead check: USGS NAIP against a top render (arch directions, deck
 *   disc, rim flare, screen ring). No usable licensed high oblique photo.
 * - Estimated from photos, scaled by the lidar crown and the feet: the
 *   saucer below its roof (soffit, glass 19.9-16.8 m leaning out from
 *   radius 16.9 to 18.9 m, rounded lower rim to 14.6 m), the legs' and
 *   ribs' cross-sections (foot about 2.2 x 2.2 m, Y about 5 x 5 m, rib
 *   about 1.9 m deep and 2 m wide, narrowing to 1.2 m at the crown), the
 *   rim arms' flare into the legs (OSM outline shape).
 * - Not seen: the base building's own walls (inside the screen and trees
 *   in every photo); drawn plain at OSM's radius and the lidar roof.
 * - Left out: the cables from the arches to the deck, the deck railing,
 *   the perforations of the screen wall (a dot grid; drawn as a plain
 *   pale wall), the gardens and paving inside it.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const white = new Part(), wall = new Part(), roof = new Part()
const glass = new Part(), blue = new Part()

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x))

/**
 * Lookup in a sorted [x, y] table by monotone cubic (PCHIP) interpolation:
 * smooth through the knots without overshoot, so profiles have neither
 * kinks nor flat steps.
 */
function table(t: [number, number][], x: number) {
  const n = t.length
  if (x <= t[0][0]) return t[0][1]
  if (x >= t[n - 1][0]) return t[n - 1][1]
  const h = t.slice(1).map((p, i) => p[0] - t[i][0])
  const d = t.slice(1).map((p, i) => (p[1] - t[i][1]) / h[i])
  const m = t.map((_, i) => {
    if (i === 0) return d[0]
    if (i === n - 1) return d[n - 2]
    if (d[i - 1] * d[i] <= 0) return 0
    const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1]
    return (w1 + w2) / (w1 / d[i - 1] + w2 / d[i])
  })
  let i = 0
  while (x > t[i + 1][0]) i++
  const u = (x - t[i][0]) / h[i], u2 = u * u, u3 = u2 * u
  return (2 * u3 - 3 * u2 + 1) * t[i][1] + (u3 - 2 * u2 + u) * h[i] * m[i] + (-2 * u3 + 3 * u2) * t[i + 1][1] + (u3 - u2) * h[i] * m[i + 1]
}

/**
 * A smooth surface over a grid of points P[i][j]. Normals are averaged from
 * the neighbours, so it shades round. `wrapI` closes the i direction.
 * The face points along cross(d/di, d/dj); `flip` turns it round.
 */
function surf(p: Part, P: V3[][], wrapI: boolean, flip: boolean) {
  const ni = P.length, nj = P[0].length
  const at = (i: number, j: number) => P[wrapI ? (i + ni) % ni : clamp(i, 0, ni - 1)][clamp(j, 0, nj - 1)]
  const N: V3[][] = P.map((row, i) => row.map((_, j) => {
    const di = sub(at(i + 1, j), at(i - 1, j)), dj = sub(at(i, j + 1), at(i, j - 1))
    const n = unit(cross(di, dj))
    return flip ? mul(n, -1) : n
  }))
  const lim = wrapI ? ni : ni - 1
  for (let i = 0; i < lim; i++) {
    const k = (i + 1) % ni
    for (let j = 0; j < nj - 1; j++) {
      const a = P[i][j], b = P[k][j], c = P[k][j + 1], d = P[i][j + 1]
      const na = N[i][j], nb = N[k][j], nc = N[k][j + 1], nd = N[i][j + 1]
      const t = (A: V3, B: V3, C: V3, nA: V3, nB: V3, nC: V3) => {
        if (Math.hypot(...cross(sub(B, A), sub(C, A))) < 1e-9) return
        if (flip) p.tri(A, C, B, undefined, undefined, undefined, [nA, nC, nB])
        else p.tri(A, B, C, undefined, undefined, undefined, [nA, nB, nC])
      }
      t(a, b, c, na, nb, nc)
      t(a, c, d, na, nc, nd)
    }
  }
}

/** A surface of revolution about the z axis from an (r, z) profile. */
function revolve(p: Part, prof: [number, number][], seg: number, flip = false) {
  const P: V3[][] = []
  for (let i = 0; i < seg; i++) {
    const a = (2 * Math.PI * i) / seg
    P.push(prof.map(([r, z]) => [r * Math.cos(a), r * Math.sin(a), z] as V3))
  }
  surf(p, P, true, flip)
}

/** A flat disc (fan) at height z, facing up or down. */
function disc(p: Part, r: number, z: number, seg: number, up: boolean) {
  for (let i = 0; i < seg; i++) {
    const a0 = (2 * Math.PI * i) / seg, a1 = (2 * Math.PI * (i + 1)) / seg
    const A: V3 = [0, 0, z], B: V3 = [r * Math.cos(a0), r * Math.sin(a0), z], C: V3 = [r * Math.cos(a1), r * Math.sin(a1), z]
    if (up) p.tri(A, B, C)
    else p.tri(A, C, B)
  }
}

// ---------------------------------------------------------------------------
// Arches. Each is a true parabola, z = HC (1 - (s/S)^2), with s along the
// arch from the crossing. The lidar top surface fits it with S = 51.8 m
// (the feet, OSM; published 340 ft across) and a top of 40.3 m.
const S = 51.8
const TOP = 40.3
// Section, as functions of |s|: full width across the arch plane, and the
// depth above (outer) and below (inner) the centreline in it. Slim rib to
// the Y at |s| = 31.5 where the rim arm joins, broad leg below it, slim
// foot (photos, scaled by the lidar crown).
const W: [number, number][] = [[0, 1.2], [12, 1.8], [22, 2.3], [28, 3.2], [31.5, 5.0], [35, 4.2], [43, 3.3], [S, 2.2]]
const DOUT: [number, number][] = [[0, 0.9], [20, 0.95], [31.5, 1.35], [40, 1.35], [S, 1.1]]
const DIN: [number, number][] = [[0, 0.9], [20, 0.95], [27, 1.4], [31.5, 3.5], [35, 3.0], [43, 2.1], [S, 1.1]]
const HC = TOP - table(DOUT, 0)
const zc = (s: number) => HC * (1 - (s / S) ** 2)

// Samples along the arch: denser round the Y, where the section changes.
const SS: number[] = []
for (const s of [0, 5, 10, 15, 20, 24, 26.5, 28.5, 30, 31.5, 33, 34.5, 36.5, 39, 42, 45, 48, 50.5, S, S + 1.2]) {
  SS.push(s)
}
const ALONG = [...SS.slice(1).reverse().map(s => -s), ...SS]
const SEC = 10 // corners round the section

function arch(dir: V3) {
  const side: V3 = unit(cross([0, 0, 1], dir)) // across the arch plane
  const rings: V3[][] = ALONG.map(s => {
    const c: V3 = add(mul(dir, s), [0, 0, zc(s)])
    const t = unit(add(dir, [0, 0, (-2 * HC * s) / (S * S)])) // tangent
    let n = unit(sub([0, 0, 1], mul(t, dot([0, 0, 1], t)))) // in-plane normal, up/out
    const a = Math.abs(s)
    const w = table(W, a) / 2, dO = table(DOUT, a), dI = table(DIN, a)
    const ring: V3[] = []
    for (let k = 0; k < SEC; k++) {
      const ph = (2 * Math.PI * k) / SEC
      const cs = Math.cos(ph), sn = Math.sin(ph)
      // A rounded rectangle (superellipse) section.
      const e = 0.6
      const u = Math.sign(cs) * Math.abs(cs) ** e, v = Math.sign(sn) * Math.abs(sn) ** e
      ring.push(add(c, add(mul(n, u * (u > 0 ? dO : dI)), mul(side, v * w))))
    }
    return ring
  })
  // surf wants P[i][j]: i round the section (wrapped), j along the arch.
  const P: V3[][] = []
  for (let k = 0; k < SEC; k++) P.push(rings.map(r => r[k]))
  surf(white, P, true, true)
}

// ---------------------------------------------------------------------------
// Saucer roof plate. Its rim is a circle of radius 23.5 m between the
// arches that flares out along each arch into an arm meeting the leg at the
// Y (OSM outline; photos). Profile per direction: deck, falling top, a
// rounded rim, and the soffit sloping down and in to the top of the glass.
// The flare: a rounded cusp, 7.2 m out at the arch, half gone 2.9° off it.
const rimR = (deg: number) => {
  const m = ((deg % 90) + 90) % 90
  const a = Math.min(m, 90 - m)
  return 23.5 + 7.2 / (1 + (a / 2.9) ** 2)
}
const DECK = 24.5, DECK_R = 13, DRUM_R = 5.5
const GLASS_TOP = 19.9, GLASS_TOP_R = 18.9, GLASS_BOT = 16.8, GLASS_BOT_R = 16.9
const zTop = (r: number) => r <= DECK_R ? DECK : r <= 23.5 ? DECK - 0.9 * (r - DECK_R) / (23.5 - DECK_R) : 23.6 + 0.5 * (r - 23.5) / 9
const zBot = (r: number) => r >= 23 ? 22.2 : GLASS_TOP + (22.2 - GLASS_TOP) * ((r - GLASS_TOP_R) / (23 - GLASS_TOP_R)) ** 0.8

const QUAD = [0, 0.8, 1.6, 2.5, 3.5, 4.6, 5.8, 7.2, 9, 11.5, 15, 20, 30]
const ANG: number[] = []
for (let q = 0; q < 4; q++) {
  for (const a of QUAD) ANG.push(q * 90 + a)
  ANG.push(q * 90 + 45)
  for (const a of [...QUAD].reverse()) if (a > 0) ANG.push(q * 90 + 90 - a)
}
ANG.sort((a, b) => a - b)
{
  const deck: V3[][] = [], plate: V3[][] = []
  for (const deg of ANG) {
    const a = (deg * Math.PI) / 180, R = rimR(deg)
    const P = (r: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]
    deck.push([P(DRUM_R, DECK), P(DECK_R, DECK)])
    const zt = zTop(R), zb = 22.2
    plate.push([
      P(DECK_R, DECK),
      P(R - 0.5, zTop(R - 0.5)),
      P(R - 0.05, zt - 0.3),
      P(R + 0.1, (zt + zb) / 2),
      P(R - 0.05, zb + 0.3),
      P(R - 0.6, zb),
      P(lerpN(R - 0.6, GLASS_TOP_R, 0.5), zBot(lerpN(R - 0.6, GLASS_TOP_R, 0.5))),
      P(GLASS_TOP_R, GLASS_TOP),
    ])
  }
  // Rows are ordered by angle counter-clockwise from above, profile
  // outward-then-under: cross(d/dangle, d/dprofile) points down on the top,
  // so flip.
  surf(roof, deck, true, true)
  surf(white, plate, true, true)
}
function lerpN(a: number, b: number, t: number) { return a + (b - a) * t }

// The restaurant's glass, leaning out, and the heavy rounded lower rim.
const SEG = 48
revolve(glass, [[GLASS_TOP_R, GLASS_TOP], [GLASS_BOT_R, GLASS_BOT]], SEG, true)
revolve(white, [
  [GLASS_BOT_R, GLASS_BOT], [17.4, GLASS_BOT - 0.1], [17.6, 16.0], [17.4, 15.2], [16.7, 14.75], [15.5, 14.6], [DRUM_R, 14.6],
], SEG, true)

// The core: blue drum below the saucer down into the base building, and
// the drum standing on the deck (lidar 31.2 m, radius 5.5 m).
const CSEG = 28
revolve(blue, [[DRUM_R, 3.4], [DRUM_R, 14.7]], CSEG) // from the base roof (BASE_H, below)
revolve(blue, [[DRUM_R, DECK - 0.1], [DRUM_R, 30.9], [DRUM_R - 0.3, 31.2]], CSEG)
disc(roof, DRUM_R - 0.3, 31.2, CSEG, true)

// ---------------------------------------------------------------------------
// The base: the round building under the saucer (OSM way/476168322) and the
// free-standing perforated screen wall round it (NAIP). Both are low: in the
// photo along an arch's axis the screen wall stands about a tenth of the
// arch's height and the base building does not show over it, so the blue
// core runs down to the wall's top. The lidar's 6.6 m and 8.3 m samples there
// were taken to be trees. The wall is perforated and reads light, so it is a
// thin pale ring in `trim`.
const BASE_R = 31.5, BASE_H = 3.6
revolve(wall, [[BASE_R, 0], [BASE_R, BASE_H - 0.3], [BASE_R - 0.3, BASE_H]], 48)
disc(roof, BASE_R - 0.3, BASE_H, 48, true)

const SCR_R = 36.5, SCR_T = 0.4, SCR_H = 4.2
revolve(white, [
  [SCR_R - SCR_T / 2, 0], [SCR_R - SCR_T / 2, SCR_H - 0.1], [SCR_R - SCR_T / 2 + 0.05, SCR_H],
  [SCR_R + SCR_T / 2 - 0.05, SCR_H], [SCR_R + SCR_T / 2, SCR_H - 0.1], [SCR_R + SCR_T / 2, 0],
], 56, true)

arch([0, 1, 0])
arch([1, 0, 0])

// ---------------------------------------------------------------------------
// Palette. The arches, the saucer and the screen wall are white, `trim`;
// the base building `stone`; deck and roofs `roof`; the restaurant glass
// `window` (it is lit at night). The core's tiles are a strong blue that is
// half of the building's identity in every photo, pulled lighter.
const parts = [
  { part: white, material: PALETTE.trim },
  { part: wall, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
  { part: glass, material: PALETTE.window },
  { part: blue, material: finish('theme-blue', 0x5277b8) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(14), part.triangles)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Theme Building', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 353, osm: 'way/37891817',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/la-theme-building.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
