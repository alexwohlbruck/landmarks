/**
 * Europaturm ("Ginnheimer Spargel"), Frankfurt am Main: procedural, CC0-1.0.
 * bun generators/frankfurt-europaturm.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the tower is round).
 * Origin: the shaft's axis, the centre of the OSM shaft part way/10612387,
 * 8.654641 50.135325; y = 0 is the ground at the foot.
 *
 * Published (German Wikipedia, "Europaturm"):
 * - 337.5 m to the antenna tip (since the 2004 antenna change; 331.15 m before).
 * - the shaft tapers from 20 m across at the foot to 11 m under the pod.
 * - the pod ("Kanzel") at 227 m, six storeys, 59 m across: a flat double
 *   frustum; the ring above it once carried the dish antennas hung upside
 *   down in a recess, now empty.
 * - at night the antenna platforms are lit in Telekom magenta.
 *
 * Heights, measured off "Europaturm, Frankfurt, North-West View 140612 1.jpg"
 * (DXR, telephoto, near orthographic), scaled from the pod's published 59 m
 * (6.61 px per metre at full size), counted down from the 337.5 m tip:
 * - the pod's underside cone from the shaft collar at 207-209 m to its rim
 *   at 223 m; the rounded rim 223-228 m, 29.5 m out;
 * - the red window band 228.6-235 m, 23.1 m out, under the silver cap
 *   (235-239.5 m, 26.3 m out at its foot, 24.2 m at the roof);
 * - the shaft above the pod 4.8 m in radius, 3.4 m between the platforms;
 * - seven antenna platforms, tops from 250.1 to 290.3 m (6.7 m apart),
 *   12.4 m out at the bottom to 11.0 m at the top, flat on top with a
 *   cone underneath;
 * - the antenna's bands: white 295.4-301.2, red -307.2, white -312.2, a red
 *   cone to 316.6 where it necks from 2.3 to 1.1 m, then white, red, white,
 *   red bands of about 5 m to the tip.
 * OSM's part heights (pod 284-295 m, platforms in one 290-337 m part) are a
 * rough sketch and disagree with the photos and Wikipedia; the photos win.
 *
 * Estimated: the shaft's taper is drawn linear (10 m to 5.6 m radius);
 * the pod underside's ribs (detail model only), the cap's seams and the
 * window mullions are spaced to read, not counted.
 * Left out: the dishes, railings and masts on the pod roof and platforms,
 * the maintenance crane, the small entrance at the foot.
 *
 * Colours (daylight photos): mid-grey concrete shaft, the darker grey pod
 * underside and platform undersides, the white-silver rims and cap, the signal-red window band, the red and white antenna.
 * Night: the platforms are lit magenta in reality; the model can't glow a
 * colour other than its day colour (neon), so they get a warm floodlight,
 * as does the pod's underside (lit in the night photo). The red band is
 * dark at night (the restaurant closed in 1999), so it is not a window.
 *
 * Photos (evidence, Wikimedia Commons):
 * - "Europaturm, Frankfurt, North-West View 140612 1.jpg", DXR, CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:Europaturm,_Frankfurt,_North-West_View_140612_1.jpg
 * - "Frankfurt, Europaturm, 2024.jpg", Dr. Thomas Liptak, CC BY-SA 4.0 (daylight colours)
 *   https://commons.wikimedia.org/wiki/File:Frankfurt,_Europaturm,_2024.jpg
 * - "Europaturm Frankfurt am Main 2021-08-17 02.jpg", Leonhard Lenz, CC0 (from the foot)
 *   https://commons.wikimedia.org/wiki/File:Europaturm_Frankfurt_am_Main_2021-08-17_02.jpg
 * - "Europaturm Frankfurt am Main at night 2021-04-04 01.jpg", Leonhard Lenz, CC0 (night)
 *   https://commons.wikimedia.org/wiki/File:Europaturm_Frankfurt_am_Main_at_night_2021-04-04_01.jpg
 * Look-only: none.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe, flat } from './berlin-fernsehturm'
import { save } from './atl-flatiron-building'

const TAU = Math.PI * 2
const ID = 'frankfurt-europaturm'
const NAME = 'Europaturm'

if (import.meta.main) {
  await build(true)
  await build(false)
}

async function build(low: boolean) {
  const concrete = new Part() // shaft, pod underside, platforms
  const clad = new Part()     // the pod's white-silver rim and cap
  const band = new Part()     // the red window band
  const belly = new Part()    // the pod's ribbed underside, a shade darker in every photo
  const red = new Part()      // antenna red
  const white = new Part()    // antenna white
  const K = low ? 24 : 48

  // ── Shaft: 20 m at the foot to 11.2 m at the collar ──
  const shaftR = (z: number) => 10 - (4.4 * z) / 207
  lathe([[shaftR(0), 0], [shaftR(70), 70], [shaftR(140), 140], [shaftR(207), 207]], () => concrete, K, 30)

  // ── The pod ──
  lathe([[shaftR(207), 207], [7.2, 207], [7.2, 209.2]], () => concrete, K, 20)
  // Underside cone, in a few bands so it shades as a slightly curved bowl.
  const under: [number, number][] = [[7.2, 209.2], [14, 214.2], [21.5, 219.2], [28.6, 223.0]]
  lathe(under, () => belly, K, 25)
  // Rim: rounded, white.
  lathe([[28.6, 223.0], [29.5, 223.9], [29.6, 227.3], [29.0, 228.2], [25.0, 228.6]], () => clad, K, 40)
  // Window band.
  lathe([[25.0, 228.6], [23.1, 228.6]], () => clad, K, 10)
  lathe([[23.1, 228.6], [23.1, 235.0]], () => band, K, 10)
  // Cap: out, up sloping in, then the roof.
  lathe([[23.1, 235.0], [26.3, 235.0], [26.0, 236.0], [24.2, 239.5], [4.8, 239.5]], (b) => (b === 3 ? concrete : clad), K, 35)

  // ── Upper shaft and the seven platforms ──
  const tops = Array.from({ length: 7 }, (_, i) => 250.1 + i * 6.7)
  lathe([[4.8, 239.5], [4.8, tops[0] - 3.6]], () => concrete, K, 20)
  tops.forEach((zt, i) => {
    const R = 12.4 - (1.4 * i) / 6, rs = i === 0 ? 4.8 : 3.4
    lathe([[rs, zt - 3.6], [R - 0.6, zt - 1.1], [R, zt - 0.95], [R, zt - 0.2], [R - 0.2, zt], [3.4, zt]], (b) => (b <= 1 ? belly : b <= 3 ? clad : concrete), K, 30)
    const zNext = i < 6 ? tops[i + 1] - 3.6 : 292.2
    lathe([[3.4, zt], [3.4, zNext]], () => concrete, K, 20)
  })
  // Neck from the top platform to the antenna base.
  lathe([[3.4, 292.2], [2.8, 292.8], [2.8, 295.4]], () => concrete, K, 20)

  // ── Antenna: bands from the photo ──
  const AK = low ? 12 : 20
  const bands: [number, number, number, number, Part][] = [
    // z0, z1, r0, r1, colour
    [295.4, 301.2, 2.75, 2.7, white],
    [301.2, 307.2, 2.7, 2.6, red],
    [307.2, 312.2, 2.6, 2.3, white],
    [312.2, 316.6, 2.3, 1.1, red],
    [316.6, 321.6, 1.0, 0.92, white],
    [321.6, 326.6, 0.92, 0.85, red],
    [326.6, 331.5, 0.85, 0.78, white],
    [331.5, 336.8, 0.78, 0.7, red],
    [336.8, 337.5, 0.7, 0.5, red],
  ]
  lathe([[2.8, 295.4], [2.75, 295.4]], () => white, AK)
  bands.forEach(([z0, z1, r0, r1, p], i) => {
    const prof: [number, number][] = [[r0, z0], [r1, z1]]
    const next = bands[i + 1]
    if (next && next[2] < r1 - 0.01) prof.push([next[2], z1])
    if (!next) prof.push([0, z1])
    lathe(prof, () => p, AK, 30)
  })

  // ── Detail model: the pod underside's radial ribs, the cap's seams, the
  // window mullions. ──
  if (!low) {
    const ribs = 48
    for (let i = 0; i < ribs; i++) {
      const a = (i / ribs) * TAU, d: V3 = [Math.cos(a), Math.sin(a), 0], e: V3 = [-Math.sin(a), Math.cos(a), 0]
      // A rib 0.35 m wide standing 0.3 m off the underside cone, 7.2 → 28.6 m.
      const w = 0.18
      for (let k = 0; k < under.length - 1; k++) {
        const [r0, z0] = under[k], [r1, z1] = under[k + 1]
        const nz = -(r1 - r0) / Math.hypot(r1 - r0, z1 - z0), nr = (z1 - z0) / Math.hypot(r1 - r0, z1 - z0)
        const off = (r: number, z: number, s: number, o: number): V3 => [d[0] * (r + nr * o) + e[0] * s, d[1] * (r + nr * o) + e[1] * s, z + nz * o]
        flat(belly, [off(r0, z0, -w, 0.3), off(r0, z0, w, 0.3), off(r1, z1, w, 0.3), off(r1, z1, -w, 0.3)], [d[0] * nr, d[1] * nr, nz])
        flat(belly, [off(r0, z0, w, 0), off(r1, z1, w, 0), off(r1, z1, w, 0.3), off(r0, z0, w, 0.3)], e)
        flat(belly, [off(r0, z0, -w, 0), off(r0, z0, -w, 0.3), off(r1, z1, -w, 0.3), off(r1, z1, -w, 0)], [-e[0], -e[1], 0])
      }
    }
    // Mullions on the window band.
    const mull = 72
    for (let i = 0; i < mull; i++) {
      const a = (i / mull) * TAU, d: V3 = [Math.cos(a), Math.sin(a), 0], e: V3 = [-Math.sin(a), Math.cos(a), 0]
      const P = (r: number, s: number, z: number): V3 => [d[0] * r + e[0] * s, d[1] * r + e[1] * s, z]
      const w = 0.15, r = 23.2
      flat(clad, [P(r, -w, 228.6), P(r, w, 228.6), P(r, w, 235), P(r, -w, 235)], d)
    }
  }

  // ── Output ──
  const podLit = (p: V3, n: V3) => (p[2] > 205 && p[2] < 224 && n[2] < 0 ? 0.9 : 0)
  const platLit = (p: V3, n: V3) => (p[2] > 244 && p[2] < 292 ? (n[2] < -0.2 ? 1 : n[2] > 0.8 ? 0.2 : 0.7) : podLit(p, n))
  const parts = [
    { part: concrete, material: { ...finish('europaturm-concrete', 0xa9a8a2), floodlight: platLit } },
    { part: belly, material: { ...finish('europaturm-pod-underside', 0x7f8286), floodlight: platLit } },
    { part: clad, material: finish('europaturm-cladding', 0xeef0ef, 0.5) },
    { part: band, material: finish('europaturm-red-glass', 0xc4554a, 0.4) },
    { part: red, material: finish('europaturm-antenna-red', 0xd2603f) },
    { part: white, material: PALETTE.trim },
  ]
  const extras = { bearing: 0, elevation: 0, height: 337.5 }
  if (low) return save(ID, NAME, parts, extras, 5000)
  const used = parts.filter((p) => p.part.triangles > 0)
  const tris = used.reduce((n, p) => n + p.part.triangles, 0)
  const glb = writeGlb(NAME, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east; metres; origin at the ground anchor', ...extras })
  if (tris > 40000 || glb.length > 1_500_000) throw new Error(`detail over budget: ${tris} triangles, ${glb.length} bytes`)
  const out = new URL(`../models/${ID}.detail.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
