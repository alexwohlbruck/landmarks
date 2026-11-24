/**
 * Coney Island–Stillwell Avenue station (subway terminal), Brooklyn —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-stillwell-terminal.ts
 *
 * Map frame: x = east, y = north, z up, metres; placed at bearing 0. Anchor:
 * 40.57754, -73.98125, inside the train shed (OSM way/248496231). The model
 * reaches from the shed's north end (y ≈ +61) to the station house on Surf
 * Avenue (y ≈ -201).
 *
 * What is modelled
 * - The 2004 train shed (Kiss + Cathcart; the photovoltaic roof over the
 *   four island platforms): three side-by-side arched bays on one long
 *   vault, the deep white arch trusses that show at its open ends and sides,
 *   the slate-green columns, and the elevated track deck under it.
 * - The north block at the end of the shed (the RTO / trainsmen's building,
 *   rebuilt with the shed): red brick over the tracks, a pale green mansard
 *   rim round a dark flat roof, and the narrow platform canopy west of it
 *   (all inside the OSM outline).
 * - The station house on Surf Avenue (OSM way/248495804 with
 *   building:part way/1360333381): the green steel arcade with arched,
 *   tan-brick bays along Stillwell Avenue, the tan brick block behind it, the
 *   big green-framed lunette over the entrance, the cream terra-cotta canopy
 *   frieze with its three raised castellations and BMT plaques, and the
 *   corner tower with its stepped green pyramid and ring finial.
 * - The red-brick signal tower with its green hipped roof, on the elevated
 *   structure at the north end of the station house, along Stillwell Avenue
 *   (no OSM building).
 * Not modelled: tracks, platforms and platform canopies between the shed and
 * the station house (the map draws the railway lines), trains, signage,
 * lettering, the flagpole and the lamps.
 *
 * Evidence
 * - OSM: way/248496231 (building=train_station, height 19.9, roof:shape
 *   mansard, layer 2: the shed and the north block), way/248495804
 *   (building=transportation, height 13.4: the station house) and its
 *   building:part way/1360333381; the stop-area relation/6353344; platforms
 *   and covered track ways for the shed's extent. The shed's long sides run
 *   8.05° west of north (Stillwell Avenue).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 1 m DSM, heights above the
 *   street (1.9 m NAVD88). Shed: eaves 14.0–14.3 m, three crowns at
 *   20.2–20.4 m with two valleys at 19.5 m, 64–65 m wide, 110 m long. North
 *   block: flat roof 17.6 m, rim to 19.5–20 m. Station house: arcade 9.1–9.6
 *   m along Stillwell Avenue, main block 13.0–13.6 m, the lunette's crown
 *   11.3 m on the Surf front, the tower to 26.2 m. Signal tower 14–15.7 m.
 *   Track deck in the throat 5.0–6.0 m.
 * - USGS NAIP orthophoto (public domain): the shed's plan and its grey-blue
 *   solar panel roof with light gutters along the two valleys; the north
 *   block's dark roof and pale green rim; the signal tower's green roof.
 * - Photos (Wikimedia Commons):
 *   Allie_Caulfield, "Coney Island-Stillwell Avenue Terminus" (CC BY 2.0):
 *     the shed's south end trusses and the signal tower, from Stillwell Av;
 *   Allie_Caulfield, "2008-05-17 Coney Island … Railroad Station
 *     (2677810751)" (CC BY 2.0): north up Stillwell Avenue, the arcade;
 *   David Shankbone, "Coney Island Stillwell Station by David Shankbone"
 *     (CC BY 2.5): the Surf/Stillwell corner and the tower;
 *   Epicgenius, "Coney Island Stillwell Ave Sep 2019 01" (CC BY-SA 4.0): the
 *     station house from the south-west;
 *   Kidfly182, "Coney Island Stillwell Avenue Terminal Building" (CC BY 4.0);
 *   Tdorante10, "MTA Coney Is Stillwell 01" (CC BY-SA 4.0): the shed's south
 *     end, its three arched bays;
 *   Jonathan71, "Coney IslandStillwell" (CC BY-SA 3.0): the Surf Avenue
 *     front, face on: lunette, frieze, castellations, tower and ring;
 *   Daniel Schwen, "NYC Coney Island Stillwell 3" (CC BY-SA 4.0) and
 *     Ecombetz, "Stillwell 04 06 03 045" (public domain): the trusses and the
 *     solar roof from the platforms.
 *   HAER NY-325 (Library of Congress, public domain, before the 2001–04
 *     rebuild): the RTO building on the elevated structure and the signal
 *     tower.
 *
 * Estimated: the arch trusses' depth (5 m at the valleys, 1.2 m at the
 * crown) and spacing (13.75 m); the deck (4.7–6.2 m) and its columns; the
 * north block's walls (red brick as before the rebuild, from HAER; no open
 * photo of its outside today) and its window rows; the station house's bay
 * count (nine along Stillwell Avenue), its window and louvre heights, the
 * canopy's depth (3 m) and the castellations (from a photo scaled to the
 * lidar); the tower's stages (shaft 19.2 m, pyramid to 25.2 m, ring to
 * 27.6 m: the lidar's 26.2 m misses the thin ring); the signal tower's size.
 * Doubts: the tower and lunette positions along the Surf front differ by
 * about 2 m between the lidar and the photos; the lidar wins.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, finishModel, capPoly, insetRing } from './nyc-570-lexington'
import { block, rectPanel, discPanel, wallFrame } from './nyc-city-hall'

const tan = new Part(), green = new Part(), win = new Part(), trim = new Part(), solar = new Part(), brick = new Part()

// ---------------------------------------------------------------- helpers

/** A box turned by `ang` (radians, counter-clockwise) about its own centre. */
function obox(p: Part, cx: number, cy: number, w: number, d: number, z0: number, z1: number, ang: number, bottom = false) {
  const c = Math.cos(ang), s = Math.sin(ang)
  const at = (u: number, v: number, z: number): V3 => [cx + u * c - v * s, cy + u * s + v * c, z]
  const r = [at(-w / 2, -d / 2, z0), at(w / 2, -d / 2, z0), at(w / 2, d / 2, z0), at(-w / 2, d / 2, z0)]
  const t = r.map(([x, y]) => [x, y, z1] as V3)
  p.loft([r, t]); p.cap(t, true); if (bottom) p.cap(r, false)
}

/**
 * A convex profile in a wall's (s, z) plane, counter-clockwise as seen from
 * outside, extruded from d0 (back) to d1 (front). Draws the front face and
 * every side; the back only when asked.
 */
function extrude(p: Part, a: XY, b: XY, pts: [number, number][], d0: number, d1: number, back = false) {
  const f = wallFrame(a, b, 0)
  const F = pts.map(([s, z]) => f.at(s, z, d1)), B = pts.map(([s, z]) => f.at(s, z, d0))
  for (let i = 1; i < F.length - 1; i++) p.tri(F[0], F[i], F[i + 1])
  if (back) for (let i = 1; i < B.length - 1; i++) p.tri(B[0], B[i + 1], B[i])
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length
    if (Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) < 1e-6) continue
    p.quad(F[j], F[i], B[i], B[j])
  }
}

/** Rectangle z0…zs topped by a segmental arch rising to zTop, as an (s, z) profile. */
function archProfile(s0: number, s1: number, z0: number, zs: number, zTop: number, n = 8, ellipse = false): [number, number][] {
  const pts: [number, number][] = [[s0, z0], [s1, z0], [s1, zs]]
  const half = (s1 - s0) / 2, mid = (s0 + s1) / 2, rise = zTop - zs
  if (ellipse) {
    for (let i = 1; i < n; i++) { const t = (i / n) * Math.PI; pts.push([mid + half * Math.cos(t), zs + rise * Math.sin(t)]) }
  } else {
    // A circular segment through both springings and the crown.
    const R = (half * half + rise * rise) / (2 * rise), cz = zTop - R, a0 = Math.asin(half / R)
    for (let i = 1; i < n; i++) { const t = -a0 + (2 * a0 * i) / n; pts.push([mid - R * Math.sin(t), cz + R * Math.cos(t)]) }
  }
  pts.push([s0, zs])
  return pts
}

/** A flat panel of `pts` (convex, (s, z)) on a wall, d proud of it. */
function panel(p: Part, a: XY, b: XY, pts: [number, number][], d = 0.06) {
  const f = wallFrame(a, b, d)
  for (let i = 1; i < pts.length - 1; i++) p.tri(f.at(...pts[0]), f.at(...pts[i]), f.at(...pts[i + 1]))
}

// ------------------------------------------------------------ the shed

const TH = (8.05 * Math.PI) / 180, CT = Math.cos(TH), ST = Math.sin(TH)
const O: XY = [-18.7, -93.9] // the shed's south-west corner (OSM)
/** Shed frame: u across (east-north-east), v along the tracks (north-north-west). */
const sp = (u: number, v: number): XY => [O[0] + u * CT - v * ST, O[1] + u * ST + v * CT]
const s3 = (u: number, v: number, z: number): V3 => [...sp(u, v), z]

const W = 64, LEN = 110, EAVE = 14.1, CROWN = 20.5, DECK0 = 4.7, DECK = 6.2, SLAB = 0.9
const VALLEYS = [24, 40]
const BAYS: [number, number][] = [[0, 24], [24, 40], [40, 64]]

/** The roof's top over u: one broad vault (eaves 14.1, crown 20.5) creased into three arched bays. */
function roofZ(u: number) {
  const t = Math.min(1, Math.abs((2 * u) / W - 1))
  let z = EAVE + (CROWN - EAVE) * Math.pow(1 - Math.pow(t, 2.4), 1 / 2.4)
  for (const v of VALLEYS) { const k = Math.max(0, 1 - Math.abs(u - v) / 6); z -= 1.1 * k * k }
  return z
}
const halfBay = [0, 0.6, 1.4, 2.5, 4, 6, 8.5, 11, 14, 17, 20, 22.3, 24]
const US = [...halfBay, 25.6, 27.6, 30, 32, 34, 36.4, 38.4, ...halfBay.slice().reverse().map((u) => W - u)]

{
  // Roof slab: solar panels on top, the white truss work's underside below.
  for (let i = 0; i < US.length - 1; i++) {
    const u0 = US[i], u1 = US[i + 1], z0 = roofZ(u0), z1 = roofZ(u1)
    solar.quad(s3(u0, 0, z0), s3(u1, 0, z1), s3(u1, LEN, z1), s3(u0, LEN, z0))
    trim.quad(s3(u0, LEN, z0 - SLAB), s3(u1, LEN, z1 - SLAB), s3(u1, 0, z1 - SLAB), s3(u0, 0, z0 - SLAB))
    // Ends: the roof's edge over the end trusses.
    trim.quad(s3(u1, 0, z1 - SLAB), s3(u0, 0, z0 - SLAB), s3(u0, 0, z0), s3(u1, 0, z1))
    trim.quad(s3(u0, LEN, z0 - SLAB), s3(u1, LEN, z1 - SLAB), s3(u1, LEN, z1), s3(u0, LEN, z0))
  }
  // Eave fascias.
  trim.quad(s3(0, LEN, EAVE - SLAB), s3(0, 0, EAVE - SLAB), s3(0, 0, EAVE), s3(0, LEN, EAVE))
  trim.quad(s3(W, 0, EAVE - SLAB), s3(W, LEN, EAVE - SLAB), s3(W, LEN, EAVE), s3(W, 0, EAVE))
  // The light gutters along the two valleys (NAIP).
  for (const v of VALLEYS) {
    const a = v - 0.8, b = v + 0.8
    trim.quad(s3(a, 0, roofZ(a) + 0.05), s3(v, 0, roofZ(v) + 0.05), s3(v, LEN, roofZ(v) + 0.05), s3(a, LEN, roofZ(a) + 0.05))
    trim.quad(s3(v, 0, roofZ(v) + 0.05), s3(b, 0, roofZ(b) + 0.05), s3(b, LEN, roofZ(b) + 0.05), s3(v, LEN, roofZ(v) + 0.05))
  }

  // Arch trusses across the shed, one per bay, springing low at the valleys
  // and the eaves and shallow at each crown — what shows at the open ends.
  const chord = (u: number) => {
    const [a, b] = BAYS.find(([a, b]) => u >= a - 1e-6 && u <= b + 1e-6)!
    const sA = a === 0 ? EAVE - 2.0 : roofZ(a) - 5.0, sB = b === W ? EAVE - 2.0 : roofZ(b) - 5.0
    const mid = (a + b) / 2, half = (b - a) / 2, lin = sA + ((sB - sA) * (u - a)) / (b - a)
    const crown = roofZ(mid) - SLAB - 1.2, linMid = (sA + sB) / 2
    const z = lin + (crown - linMid) * Math.sqrt(Math.max(0, 1 - ((u - mid) / half) ** 2))
    return Math.min(z, roofZ(u) - SLAB - 0.3)
  }
  const TRUSS = 0.8
  for (let k = 0; k <= 8; k++) {
    const v = Math.min(LEN - TRUSS / 2, Math.max(TRUSS / 2, (k * LEN) / 8))
    for (const [a, b] of BAYS) {
      const us = US.filter((u) => u >= a && u <= b)
      for (let i = 0; i < us.length - 1; i++) {
        const u0 = us[i], u1 = us[i + 1]
        const t0 = roofZ(u0) - SLAB, t1 = roofZ(u1) - SLAB, b0 = chord(u0), b1 = chord(u1)
        const vs = v - TRUSS / 2, vn = v + TRUSS / 2
        trim.quad(s3(u0, vs, b0), s3(u1, vs, b1), s3(u1, vs, t1), s3(u0, vs, t0)) // south face
        trim.quad(s3(u1, vn, b1), s3(u0, vn, b0), s3(u0, vn, t0), s3(u1, vn, t1)) // north face
        trim.quad(s3(u0, vn, b0), s3(u1, vn, b1), s3(u1, vs, b1), s3(u0, vs, b0)) // soffit
      }
    }
    // Columns under the trusses: at the eaves and on the platforms at the valleys.
    const vc = Math.min(LEN - 0.5, Math.max(0.5, (k * LEN) / 8))
    for (const u of VALLEYS) {
      const [x, y] = sp(u, vc)
      obox(green, x, y, 0.8, 0.8, DECK, chord(u) + 0.2, TH)
    }
  }
  // Eave columns, closer together, along both open sides.
  for (let k = 0; k <= 16; k++) {
    const v = Math.min(LEN - 0.5, Math.max(0.5, (k * LEN) / 16))
    for (const u of [0.5, W - 0.5]) {
      const [x, y] = sp(u, v)
      obox(green, x, y, 0.7, 0.7, DECK, EAVE - SLAB, TH)
    }
  }
}

// --------------------------------------------- the track deck and its columns

/** A deck slab over a (u, v) rectangle: green girders round it, grey on top. */
function deck(u0: number, u1: number, v0: number, v1: number) {
  const r = [s3(u0, v0, DECK0), s3(u1, v0, DECK0), s3(u1, v1, DECK0), s3(u0, v1, DECK0)]
  const t = r.map(([x, y]) => [x, y, DECK] as V3)
  green.loft([r, t]); green.cap(r, false); solar.cap(t, true)
}
deck(0, W, 0, LEN)
deck(7, 57, LEN, 148.5)
for (let k = 0; k <= 8; k++) {
  const v = Math.min(LEN - 1, Math.max(1, (k * LEN) / 8))
  for (const u of [1, 22, 42, 63]) { const [x, y] = sp(u, v); obox(green, x, y, 0.9, 0.9, 0, DECK0, TH) }
}
for (const v of [124, 147.5]) for (const u of [8, 21, 39, 56]) { const [x, y] = sp(u, v); obox(green, x, y, 0.9, 0.9, 0, DECK0, TH) }

// --------------------------------------------------- the north (RTO) block

{
  const ring: XY[] = [[9, LEN], [57, LEN], [57, 148.5], [20, 148.5], [20, 118.3], [9, 118.3]].map(([u, v]) => sp(u, v))
  // Steel under it, on posts over the tracks.
  prism({ wall: green, win: null, roof: null, ring, z0: 8.6, z1: 9.8, facade: null, bevel: 0.2 })
  capPoly(green, ring, 8.6, false)
  for (const [u, v] of [[9.5, 111], [9.5, 117.8], [20.5, 147.5], [38, 147.5], [56.5, 147.5], [56.5, 133], [56.5, 119], [55, 111], [32, 111]] as XY[]) {
    const [x, y] = sp(u, v); obox(green, x, y, 0.8, 0.8, DECK, 8.6, TH)
  }
  // Red brick, windows in two-storey panels.
  const pts = prism({
    wall: brick, win, roof: null, ring, z0: 9.8, z1: 16.8, bevel: 0, // square corners, so the rim insets cleanly
    facade: { bay: 4.2, ratio: 0.55, floor: 3.2, group: 2, spandrel: 1, sill: 1.1, head: 1.0, minLength: 6 },
  })
  // Pale green mansard rim round a dark flat roof.
  const inner = insetRing(pts, 1.6)
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length
    const a: V3 = [pts[i][0], pts[i][1], 16.8], b: V3 = [pts[j][0], pts[j][1], 16.8]
    const c: V3 = [inner[j][0], inner[j][1], 19.6], d: V3 = [inner[i][0], inner[i][1], 19.6]
    green.quad(a, b, c, d)
    // The rim's inner face, down to the roof.
    green.quad([inner[j][0], inner[j][1], 19.6], [inner[i][0], inner[i][1], 19.6], [inner[i][0], inner[i][1], 17.6], [inner[j][0], inner[j][1], 17.6])
  }
  capPoly(solar, inner, 17.6)
  // The narrow platform canopy west of it.
  const lobe: XY[] = [[7, 118.3], [10.8, 118.3], [10.8, 136], [7, 136]].map(([u, v]) => sp(u, v))
  prism({ wall: green, win: null, roof: green, ring: lobe, z0: 9.6, z1: 10.6, facade: null, bevel: 0.2 })
  capPoly(green, lobe, 9.6, false)
  for (const v of [119, 127, 135]) { const [x, y] = sp(8.9, v); obox(green, x, y, 0.5, 0.5, DECK, 9.6, TH) }
}

// ------------------------------------------------- the Surf Avenue station house

{
  const SW: XY = [12.6, -200.3], SE: XY = [44.3, -201.1], NE: XY = [40.3, -161.6], N: XY = [28.3, -158.4], NW: XY = [6.2, -152.9]
  const ARC = 10.0
  // The arcade storey: green steel over the whole footprint.
  prism({ wall: green, win: null, roof: solar, ring: [SW, SE, NE, N, NW], z0: 0, z1: ARC, facade: null, bevel: 0.3 })

  // Stillwell Avenue front: nine bays, shop fronts, a low louvre arch, tan
  // brick infill and a louvred arch under the cornice in each.
  {
    const a = NW, b = SW, L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = 9, pitch = L / n
    for (let k = 0; k < n; k++) {
      const s = pitch * (k + 0.5), w = pitch - 0.9
      rectPanel(win, a, b, s, w, 0.4, 3.7)
      panel(solar, a, b, archProfile(s - w / 2, s + w / 2, 4.2, 4.6, 5.4))
      rectPanel(tan, a, b, s, w, 5.8, 8.2)
      panel(solar, a, b, archProfile(s - w / 2, s + w / 2, 8.2, 8.5, 9.4))
    }
  }

  // The tan brick block behind the arcade, small square windows near its top.
  const box: XY[] = [[15.5, -196], [43.4, -196], [40.2, -164], [11.2, -164]]
  prism({ wall: tan, win: null, roof: solar, ring: box, z0: ARC - 0.5, z1: 13.4, facade: null, bevel: 0.3 })
  {
    const a = box[3], b = box[0], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (let s = 2.5; s < L - 1; s += 4) rectPanel(win, a, b, s, 0.8, 11.3, 12.1)
    for (const s of [2.0, 4.6]) rectPanel(win, box[0], box[1], s, 0.8, 11.3, 12.1)
  }

  // Surf Avenue front, measured along the wall from the Stillwell corner.
  const a = SW, b = SE
  // Two arcade bays west of the lunette, above the canopy.
  for (const s of [2.4, 6.4]) {
    rectPanel(tan, a, b, s, 3.3, 6.5, 8.0)
    panel(solar, a, b, archProfile(s - 1.65, s + 1.65, 8.0, 8.2, 9.0))
  }
  // Tan brick pier and the tower at the east end.
  const T0 = 23.6, T1 = 29.1
  {
    const f = wallFrame(a, b, 0)
    const pier: XY[] = [f.at(22.5, 0, -1.2), f.at(31.6, 0, -1.2), f.at(31.6, 0, -11), f.at(22.5, 0, -11)].map(([x, y]) => [x, y] as XY)
    prism({ wall: tan, win: null, roof: solar, ring: pier, z0: ARC - 0.5, z1: 15.8, facade: null, bevel: 0.3 })
    rectPanel(win, a, b, 30.6, 0.8, 10.8, 11.6, -1.15)
    const shaft: XY[] = [f.at(T0, 0, -0.9), f.at(T1, 0, -0.9), f.at(T1, 0, -6.4), f.at(T0, 0, -6.4)].map(([x, y]) => [x, y] as XY)
    const sp2 = prism({ wall: green, win: null, roof: green, ring: shaft, z0: ARC - 0.5, z1: 19.2, facade: null, bevel: 0.25 })
    // Tall glazed panels on the tower's three street faces, in two stages.
    const tc = f.at((T0 + T1) / 2, 0, -3.65)
    for (let i = 0; i < sp2.length; i++) {
      const p0 = sp2[i], p1 = sp2[(i + 1) % sp2.length], Lp = Math.hypot(p1[0] - p0[0], p1[1] - p0[1])
      if (Lp < 3) continue
      const nx = p1[1] - p0[1], ny = p0[0] - p1[0]
      if (nx * (p0[0] - tc[0]) + ny * (p0[1] - tc[1]) < 0) continue
      for (const [z0, z1] of [[11.0, 14.2], [14.6, 17.9]]) rectPanel(win, p0, p1, Lp / 2, Lp - 1.6, z0, z1)
    }
    // Stepped pyramid, eight tiers, then a ring finial facing Surf Avenue.
    const [cx, cy] = tc
    const tiers = 8, z0 = 19.2, zt = 25.2
    for (let k = 0; k < tiers; k++) {
      const h = 3.35 - (2.75 * k) / (tiers - 1), za = z0 + ((zt - z0) * k) / tiers, zb = z0 + ((zt - z0) * (k + 1)) / tiers
      block(green, cx - h, cy - h, cx + h, cy + h, za, zb)
    }
    block(green, cx - 0.18, cy - 0.18, cx + 0.18, cy + 0.18, zt, 27.4)
    const R = 1.05, zc = 26.4, n = 14, t = 0.18
    const sections: V3[][] = []
    for (let i = 0; i <= n; i++) {
      const ang = (i / n) * 2 * Math.PI, ca = Math.cos(ang), sa = Math.sin(ang)
      const at = (r: number, dy: number): V3 => [cx + r * ca, cy + dy, zc + r * sa]
      sections.push([at(R - t, -t), at(R + t, -t), at(R + t, t), at(R - t, t)])
    }
    green.sweep(sections)
  }

  // The lunette over the entrance: green frame, glazing, mullions, and its
  // arched roof running back into the block.
  {
    const LC = 17.5, LH = 8.8, ZB = 6.4, ZS = 8.8, ZT = 12.2
    const outline = archProfile(LC - LH, LC + LH, ZB, ZS, ZT, 12, true)
    extrude(green, a, b, outline, -4.6, 0.15)
    const glaze = archProfile(LC - LH + 0.7, LC + LH - 0.7, ZB, ZS, ZT - 0.7, 12, true)
    panel(win, a, b, glaze, 0.2)
    for (const ds of [-5.2, -2.6, 0, 2.6, 5.2]) {
      const s = LC + ds, top = ZS + (ZT - 0.7 - ZS) * Math.sqrt(Math.max(0, 1 - (ds / (LH - 0.7)) ** 2))
      panel(green, a, b, [[s - 0.18, ZB], [s + 0.18, ZB], [s + 0.18, top - 0.05], [s - 0.18, top - 0.05]], 0.26)
    }
  }

  // The terra-cotta canopy: a cream frieze 3 m deep on green posts, three
  // raised castellations, BMT plaques; shop fronts and the entrance under it.
  {
    const D = 3.0, Z0 = 3.6, Z1 = 6.4
    extrude(trim, a, b, [[0.3, Z0], [31.5, Z0], [31.5, Z1], [0.3, Z1]], 0, D)
    for (const [s0, s1, top] of [[2.2, 8.2, 7.4], [14.0, 21.0, 7.8], [25.0, 31.0, 7.4]]) {
      extrude(trim, a, b, archProfile(s0, s1, Z1 - 0.01, Z1 + 0.5, top, 6), D - 0.6, D)
    }
    rectPanel(green, a, b, 10.8, 3.2, 4.4, 5.4, D + 0.04)
    rectPanel(green, a, b, 24.2, 3.2, 4.4, 5.4, D + 0.04)
    discPanel(green, a, b, 17.5, 5.6, 0.6, D + 0.04, 12)
    const f = wallFrame(a, b, 0)
    for (const s of [1.2, 7.5, 13.2, 21.8, 27.6, 31.0]) {
      const [x, y] = f.at(s, 0, D - 0.3)
      block(green, x - 0.22, y - 0.22, x + 0.22, y + 0.22, 0, Z0)
    }
    for (const [s, w] of [[4.3, 5.2], [10.3, 4.6], [17.5, 7.0], [24.6, 4.6], [29.3, 3.6]] as [number, number][]) rectPanel(win, a, b, s, w, 0.4, 3.3)
  }
}

// ---------------------------------------------------- the signal tower

{
  const cx = 2.5, cy = -149.5, W2 = 8.0, D2 = 10.5 // square to Stillwell Avenue
  const at = (u: number, v: number): XY => [cx + u * CT - v * ST, cy + u * ST + v * CT]
  // Legs from the street to the cab's floor.
  for (const [du, dv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const [x, y] = at(du * (W2 / 2 - 0.4), dv * (D2 / 2 - 0.4))
    obox(green, x, y, 0.6, 0.6, 0, 9.0, TH)
  }
  obox(green, cx, cy, W2, D2, 9.0, 9.7, TH, true)
  // Brick cab with windows on every side.
  const ring: XY[] = [at(-W2 / 2 + 0.3, -D2 / 2 + 0.3), at(W2 / 2 - 0.3, -D2 / 2 + 0.3), at(W2 / 2 - 0.3, D2 / 2 - 0.3), at(-W2 / 2 + 0.3, D2 / 2 - 0.3)]
  prism({ wall: brick, win: null, roof: null, ring, z0: 9.7, z1: 13.3, facade: null, bevel: 0.2 })
  for (let i = 0; i < 4; i++) {
    const p0 = ring[i], p1 = ring[(i + 1) % 4], Lp = Math.hypot(p1[0] - p0[0], p1[1] - p0[1])
    for (const t of Lp > 8 ? [0.25, 0.5, 0.75] : [0.3, 0.7]) rectPanel(win, p0, p1, Lp * t, 1.6, 10.4, 12.6)
  }
  // Green hipped roof with deep eaves, its ridge along the tracks.
  const e = 0.9, k = Math.min(W2, D2) / 2 + e
  const r3 = [at(-W2 / 2 - e, -D2 / 2 - e), at(W2 / 2 + e, -D2 / 2 - e), at(W2 / 2 + e, D2 / 2 + e), at(-W2 / 2 - e, D2 / 2 + e)].map(([x, y]) => [x, y, 13.3] as V3)
  green.cap(r3, false)
  const ridgeA: V3 = [...at(0, -D2 / 2 - e + k), 15.7], ridgeB: V3 = [...at(0, D2 / 2 + e - k), 15.7]
  green.tri(r3[0], r3[1], ridgeA)
  green.quad(r3[1], r3[2], ridgeB, ridgeA)
  green.tri(r3[2], r3[3], ridgeB)
  green.quad(r3[3], r3[0], ridgeA, ridgeB)
}

finishModel('Coney Island–Stillwell Avenue', 'nyc-stillwell-terminal', [
  { part: solar, material: finish('stillwell-solar-roof', 0x8693a2) },
  { part: trim, material: PALETTE.trim },
  { part: green, material: finish('stillwell-green', 0x4d7d74) },
  { part: tan, material: finish('stillwell-tan-brick', 0xdcb48c) },
  { part: brick, material: PALETTE.terracotta },
  { part: win, material: PALETTE.window },
], { bearing: 0, osm: 'way/248496231', height: 27 }, 6500)
