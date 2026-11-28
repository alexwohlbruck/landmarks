/**
 * Abuja National Mosque (AIM Consultants; Lodigiani, 1984), Abuja,
 * Nigeria: procedural, CC0-1.0.
 * bun generators/abuja-national-mosque.ts
 *
 * Writes models/abuja-national-mosque.glb (under 6,500 triangles) and a
 * detail model, models/abuja-national-mosque.detail.glb (under 40,000),
 * which adds the drums' arched openings, the stepped merlons of the white
 * friezes at full density, the minarets' corbelled balconies and rings.
 *
 * Frame: origin at the centroid of the OSM outline way/188837229
 * (building=mosque; the site's relation/12186054 is the landuse), bearing
 * 0.7 (its edges). +x is east, toward the qibla; the entrance porch
 * projects west.
 *
 * Plan, from OSM in this frame: the hall's stepped square x -33.8..34.9,
 * y -36.1..35.9 with the west porch to x -37.8 (way/188837229); the raised
 * cross-shaped upper storey x -27..27, y -29.5..27.8 (way/564467263,
 * 25-30 m); the dome 38 m across centred at (0.5, -1.4) (way/564467264);
 * the four minarets on square bases at (+-33.3+0.5, +-34.4)
 * (ways 564467265-272).
 *
 * Heights. OSM: the upper storey 25-30 m; the minaret bases 6 m. OSM's
 * dome (to 40 m) and minarets (55 m) are too low against every photo and
 * are not used. Scaled from the photos with the dome's 38 m width (OSM):
 * "National Mosque Abuja.jpg" (th, front, 0.13 m/px at the dome): the
 * dome a hemisphere (rise 0.48 of its width) on a 6 m drum, crown 54 m;
 * the white frieze 6 m; the small domes 9 m across. "AbujaNationalMosque.jpg"
 * (sc, distant side, 0.24 m/px) and "Abuja Central mosque.jpg" (tf,
 * aerial): the hall's walls to 21 m, the white frieze to 24.5, the tan
 * upper storey to 29.5 (OSM: 25-30); the minarets 3.6 to 4
 * times the hall's wall: the balcony at 64-69 m, the white upper shaft to
 * 78.5, the cone to 92.5, the finial 95 m (unpublished sources say about
 * 120 m).
 * Estimated: the minaret shaft's taper, the porch.
 *
 * Ground: level; the map's terrain (Mapterhorn z12; z13-15 return 404)
 * varies about a metre. Elevation 0.
 *
 * Colours from the daylight photos: the hall's stone panels a warm tan
 * (#a48c6e in th, sunlit), pulled light; the friezes, drums and minarets
 * cream white; the domes gold (#d3af47 in th), kept as the landmark's
 * colour at the palette's lightness; the lattice windows dark.
 *
 * Night: the dome and minarets are floodlit (`_FLOODLIGHT`); the lattice
 * windows glow (`window`).
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - th "National Mosque Abuja.jpg", Tarikhaldun, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:National_Mosque_Abuja.jpg
 * - sc "AbujaNationalMosque.jpg", Shiraz Chakera, CC BY-SA 2.0
 *   https://commons.wikimedia.org/wiki/File:AbujaNationalMosque.jpg
 * - tf "Abuja Central mosque.jpg", Taifayan, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Abuja_Central_mosque.jpg
 * - mf "Abuja National Mosque.jpg", Mark Fischer, CC BY-SA 2.0
 *   https://commons.wikimedia.org/wiki/File:Abuja_National_Mosque.jpg
 * - bo "Nigerian National Mosque.jpg", Blossom Ozurumba, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Nigerian_National_Mosque.jpg
 * - wg "The National Mosque .jpg", Wang-gp, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:The_National_Mosque_.jpg
 * Look-only: none.
 *
 * Doubts: the minarets' height (photo-scaled; no published figure we
 * trust); the west porch's form; the east and north faces are drawn like
 * the photographed ones.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { TAU, domeProfile, lathe, quad, save, type Mat, type XY } from './cairo-cairo-tower'
import { block, ccw, prism, rectRing } from './casablanca-hassan-ii-mosque'

const OUT: XY[] = [[-24.8, -36.1], [26.3, -36.1], [26.3, -30.2], [30.5, -30.2], [30.4, -26.1], [34.9, -26.1], [34.9, 25.8], [30.5, 25.8], [30.5, 30.5], [26.2, 30.5],
  [26.2, 35.9], [-25.9, 35.9], [-25.9, 30.8], [-29.6, 30.8], [-29.6, 26.8], [-33.8, 26.8], [-33.8, 7.7], [-37.8, 7.7], [-37.8, -9.0], [-33.7, -9.0], [-33.7, -26.5],
  [-28.5, -26.5], [-28.5, -31.0], [-24.8, -31.0]]
const CROSS: XY[] = [[-18.5, 27.7], [-18.4, 17.7], [-27.2, 17.6], [-27.1, -19.7], [-18.2, -19.7], [-18.3, -29.5], [18.6, -29.3], [18.5, -19.2], [27.1, -19.2], [27.0, 17.6], [17.7, 17.6], [17.6, 27.8]]
const WALL = 21, FRIEZE = 24.5, UP = 29.5, DRUM = 35.5
const DC: XY = [0.5, -1.4], DR = 19.1
const MIN: XY[] = [[34.2, 35.1], [34.0, -33.1], [-31.7, -33.8], [-32.7, 35.5]]

/** Offset a counter-clockwise ring outward by d (axis-aligned edges). */
function grow(r: XY[], d: number): XY[] {
  return r.map((p, i) => {
    const a = r[(i + r.length - 1) % r.length], b = r[(i + 1) % r.length]
    const n1: XY = [p[1] - a[1], -(p[0] - a[0])], n2: XY = [b[1] - p[1], -(b[0] - p[0])]
    const l1 = Math.hypot(...n1), l2 = Math.hypot(...n2)
    return [p[0] + (n1[0] / l1 + n2[0] / l2) * d, p[1] + (n1[1] / l1 + n2[1] / l2) * d] as XY
  })
}

/** Stepped merlons along every edge of a ring, on top of z: n-step pyramids w wide every `step`. */
function merlons(p: Part, ring: XY[], z: number, step: number, w: number, h: number, steps: number) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const k = Math.max(1, Math.round(L / step))
    for (let j = 0; j < k; j++) {
      const s = ((j + 0.5) * L) / k, c: XY = [a[0] + u[0] * s - n[0] * 0.35, a[1] + u[1] * s - n[1] * 0.35]
      for (let t = 0; t < steps; t++) {
        const hw = (w / 2) * (1 - t / steps), d = 0.35
        const q = (su: number, sv: number): XY => [c[0] + u[0] * su + n[0] * sv, c[1] + u[1] * su + n[1] * sv]
        prism(p, ccw([q(-hw, -d), q(hw, -d), q(hw, d), q(-hw, d)]), z + (h * t) / steps, z + (h * (t + 1)) / steps)
      }
    }
  }
}

/** A flat panel on a vertical face (outward normal n), centred at (x, y): w wide, z0..z1, round head optional. */
function panel(p: Part, x: number, y: number, n: XY, w: number, z0: number, z1: number, arch: boolean, segs = 6, off = 0.06) {
  const u: XY = [-n[1], n[0]], o: XY = [x + n[0] * off, y + n[1] * off], r = w / 2
  const P = (s: number, z: number): V3 => [o[0] + u[0] * s, o[1] + u[1] * s, z]
  const pts: V3[] = [P(-r, z0), P(r, z0)]
  if (arch) for (let i = 0; i <= segs; i++) { const a = (Math.PI * i) / segs; pts.push(P(r * Math.cos(a), z1 - r + r * Math.sin(a))) }
  else pts.push(P(r, z1), P(-r, z1))
  const N: V3 = [n[0], n[1], 0]
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1], [0, 0], [0, 0], [0, 0], [N, N, N])
}

/** A drum (cream) with arched openings, a gold dome and its finial. */
function domed(cream: Part, gold: Part, win: Part, c: XY, r: number, z0: number, zDrum: number, rise: number, openings: number, detail: boolean, finial: number) {
  const seg = detail ? 32 : 16
  lathe(cream, c[0], c[1], [[r + 0.4, z0], [r + 0.4, z0 + 0.6], [r, z0 + 0.6], [r, zDrum - 0.5], [r + 0.5, zDrum - 0.5], [r + 0.5, zDrum], [r + 0.15, zDrum]], seg)
  for (let i = 0; i < openings; i++) {
    const a = ((i + 0.5) * TAU) / openings, n: XY = [Math.cos(a), Math.sin(a)]
    const d = r * Math.cos(Math.PI / seg)
    panel(win, c[0] + n[0] * d, c[1] + n[1] * d, n, Math.min(1.6, (TAU * r) / openings * 0.45), z0 + 1.0, zDrum - 1.0, detail, 5, 0.1)
  }
  lathe(gold, c[0], c[1], domeProfile(r + 0.15, zDrum, rise, detail ? 12 : 7), seg, { smooth: true })
  // the finial: a knob, a rod and (in detail) the crescent's ball
  const top = zDrum + rise
  lathe(gold, c[0], c[1], [[r * 0.06, top - 0.1], [r * 0.06, top + finial * 0.15], [r * 0.04, top + finial * 0.2], [r * 0.015, top + finial * 0.25], [r * 0.015, top + finial], [0, top + finial]], detail ? 8 : 5)
  if (detail) lathe(gold, c[0], c[1], [[0.001, top + finial * 0.55], [r * 0.05, top + finial * 0.62], [0.001, top + finial * 0.69]], 8, { smooth: true })
}

/** A minaret on its square base: fluted shaft, corbelled balcony, white upper shaft, cone, finial. */
function minaret(cream: Part, trim: Part, gold: Part, win: Part, c: XY, detail: boolean) {
  const seg = detail ? 20 : 10
  // the base, a square turned 45 degrees (OSM), 6 m high
  prism(cream, ccw([[c[0], c[1] - 5.0], [c[0] + 5.0, c[1]], [c[0], c[1] + 5.0], [c[0] - 5.0, c[1]]]), 0, 6.5)
  lathe(cream, c[0], c[1], [[2.85, 6.5], [2.75, 27.65], [2.6, 50.15], [2.5, 65.45]], seg, { smooth: false })
  for (const z of [28, 50.5]) lathe(trim, c[0], c[1], [[2.66, z - 0.5], [2.95, z - 0.25], [2.95, z + 0.25], [2.62, z + 0.5]], seg)
  // the balcony: a corbelled ring flaring out, its parapet
  const corb: [number, number][] = detail ? [[2.5, 63.65], [2.8, 64.37], [3.1, 65.09], [3.4, 65.81], [3.7, 66.53], [3.7, 68.69], [2.2, 68.69]] : [[2.5, 63.65], [3.7, 66.35], [3.7, 68.69], [2.2, 68.69]]
  lathe(trim, c[0], c[1], corb, seg)
  if (detail) for (let i = 0; i < 12; i++) {
    const a = ((i + 0.5) * TAU) / 12, n: XY = [Math.cos(a), Math.sin(a)]
    panel(win, c[0] + n[0] * 3.7, c[1] + n[1] * 3.7, n, 0.6, 67.2, 68.3, false, 4, 0.04)
  }
  // the white upper shaft with its ring, then the cone
  lathe(trim, c[0], c[1], [[1.9, 68.69], [1.9, 79.0], [2.3, 79.2], [2.3, 79.9], [1.9, 80.1]], seg)
  lathe(trim, c[0], c[1], detail ? [[1.9, 80.1], [2.05, 81.3], [1.9, 83.0], [1.4, 85.6], [0.8, 88.4], [0.15, 92.45], [0, 92.54]] : [[1.9, 80.1], [2.0, 81.8], [1.2, 86.5], [0, 92.54]], seg, { smooth: true })
  lathe(gold, c[0], c[1], [[0.12, 92.27], [0.12, 95.15], [0, 95.15]], 4)
  if (detail) lathe(gold, c[0], c[1], [[0.001, 92.99], [0.35, 93.44], [0.001, 93.89]], 8, { smooth: true })
}

export function build(detail: boolean): Mat[] {
  const tan = new Part(), cream = new Part(), gold = new Part(), win = new Part(), trim = new Part()

  // ── The hall: tan stone walls with tall lattice windows, a white frieze
  // with stepped merlons, the flat roof
  const ring = ccw(OUT)
  prism(tan, ring, 0, WALL)
  prism(cream, ccw(grow(OUT, 0.35)), WALL, FRIEZE - 1.2)
  prism(cream, ring, FRIEZE - 1.2, FRIEZE)
  merlons(cream, ring, FRIEZE, detail ? 2.0 : 4.0, detail ? 1.6 : 2.6, 1.3, detail ? 2 : 1)
  // a stepped zigzag under the frieze (th): small merlons hanging down, in detail
  if (detail) for (let i = 0; i < OUT.length; i++) {
    const a = OUT[i], b = OUT[(i + 1) % OUT.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    for (let s = 1.0; s < L - 0.5; s += 2.0) {
      const c: XY = [a[0] + u[0] * s + n[0] * 0.15, a[1] + u[1] * s + n[1] * 0.15]
      block(cream, c[0] - 0.55, c[1] - 0.55, c[0] + 0.55, c[1] + 0.55, WALL - 0.9, WALL, 0)
    }
  }
  // lattice windows: tall slits at the panel joints, every 8 m or so
  for (let i = 0; i < OUT.length; i++) {
    const a = OUT[i], b = OUT[(i + 1) % OUT.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 9) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const k = Math.round(L / 8.2)
    for (let j = 1; j < k; j++) {
      const s = (j * L) / k
      panel(win, a[0] + u[0] * s, a[1] + u[1] * s, n, 1.7, 2.2, WALL - 1.6, false)
    }
  }
  // the west entrance porch: three arched doors in a cream frame
  for (const y of [-5.2, -0.65, 3.9]) {
    panel(cream, -37.8, y, [-1, 0], 3.6, 0, 11, true, 8, 0.05)
    panel(win, -37.8, y, [-1, 0], 2.6, 0, 9.8, true, detail ? 8 : 4, 0.1)
  }
  // ── The upper storey: the cross, with its white crenellation
  const cross = ccw(CROSS)
  prism(tan, cross, FRIEZE, UP - 1.0)
  prism(cream, ccw(grow(CROSS.slice().reverse(), 0)), UP - 1.0, UP)
  merlons(cream, cross, UP, detail ? 1.8 : 3.6, detail ? 1.4 : 2.2, 1.1, detail ? 2 : 1)

  // ── The domes: the great gold dome on its arcaded drum, the four small
  // ones on pedestals at the corners of the cross
  domed(cream, gold, win, DC, DR - 0.4, UP, DRUM, 17.8, detail ? 32 : 16, detail, 8)
  for (const [sx, sy] of [[1, 1], [1, -1], [-1, -1], [-1, 1]]) {
    const c: XY = [DC[0] + sx * 21.6, DC[1] + sy * 21.6]
    block(cream, c[0] - 4.6, c[1] - 4.6, c[0] + 4.6, c[1] + 4.6, FRIEZE, UP, 0.3)
    domed(cream, gold, win, c, 4.2, UP, UP + 3.2, 4.4, detail ? 10 : 6, detail, 2.8)
  }

  // ── The four minarets
  for (const c of MIN) minaret(cream, trim, gold, win, c, detail)

  const lit = (q: V3, n: V3) => (n[2] > 0.85 ? 0.3 : 0.85)
  return [
    { part: tan, material: { ...finish('abuja-stone', 0xc8ae8e), floodlight: (q) => (q[2] > 2 ? 0.5 : 0.2) } },
    { part: cream, material: { ...finish('abuja-cream', 0xe9dfc8), floodlight: lit } },
    { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
    { part: gold, material: { ...finish('abuja-gold', 0xd8b24e, 0.45), floodlight: lit } },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) {
  const extras = { bearing: 0.7, osm: 'way/188837229', height: 95 }
  await save('abuja-national-mosque.glb', 'Abuja National Mosque', build(false), 6500, 250_000, extras)
  await save('abuja-national-mosque.detail.glb', 'Abuja National Mosque', build(true), 40_000, 1536 * 1024, extras)
}
void quad; void rectRing
