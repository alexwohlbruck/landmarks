/**
 * Cheong Wa Dae (청와대), the Blue House: its main building (본관), Seoul
 * (1991) — original procedural geometry, CC0-1.0.
 * bun generators/seoul-cheong-wa-dae.ts
 *
 * Built with the hanok kit in seoul-geunjeongjeon.ts (roofs, brackets).
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline relation/19338601
 * (way/1413176342), 37.5865051, 126.9748842. Its long sides run at 83.4°,
 * so the catalog bearing is 353.4 and the building faces -y, south (173.4°),
 * over its lawn towards Gyeongbokgung.
 *
 * Identity, in order: the bright blue-glazed tile roofs (about 150,000
 * tiles), above all the wide, low hipped-and-gabled roof of the central
 * hall with its white ridges; the white two-storey hall under it, a loggia
 * of white columns below and the upper floor's grouped windows between
 * white piers, its eaves on a pale blue-green bracket band; the two wings
 * that come forward either side, each under its own blue paljak roof with
 * the terracotta gable to the front; the porch at the central entrance. At
 * night the walls are floodlit and the windows lit: the white walls carry
 * `floodlight`, the windows are `window-2`.
 *
 * Evidence:
 *  - plan and heights: OSM building relation/19333673 and its parts, all
 *    used as tagged: ground storey way/636449773 (7 m) over the whole
 *    outline; the central hall's walls way/1222729683 (7–15 m, x −31.5…24.8,
 *    y −2.7…28.3) and roof way/1222729682 (eaves x −34.9…30.5, y −7…32.2,
 *    roof 15–25 m, hipped-and-gabled, roof:colour #398ea8); the wings
 *    way/1222729684 (west) and way/1222729685 (east), roofs 7–17 m,
 *    hipped-and-gabled; the porch way/1413179875 (gabled, 5–8.5 m) on eight
 *    columns (way/1222729686–93) under the slab way/1413176341.
 *  - proportions within those: measured on the level front view
 *    (Blue_House,_Seoul_(cropped).jpg) at 8.2 px/m for the hall and 12.3 px/m
 *    for the wings (their eaves at OSM's widths): hall eave 15.0 m, ridge
 *    ~41 m long, top 24.9 m; wing eaves 8.8 m, gables ~9.8 m wide at the
 *    foot, 6 m high, apex 17 m; the upper floor 11 bays.
 *  - colours: daylight photos: roof tile blue-green #2f6a7a in sun under
 *    haze, OSM's #398ea8, pulled to #4f8aa3; white walls and ridges; the
 *    wings' gables terracotta #9d8273; the bracket band pale blue-green.
 *  - terrain: Mapterhorn has no z15 tiles over Seoul, so `terrain.ts` could
 *    not check the site; the lawn slopes gently up to the building, which
 *    stands on a level terrace. Elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Blue_House,_Seoul_(cropped).jpg, Rtflakfizer, CC BY-SA 4.0 (front, level)
 *  - Blue_House_Seoul_3.jpg, kallerna, CC BY-SA 4.0 (front panorama)
 *  - Blue_House_buildings_Aug_2022.jpg, Takipoint123, CC BY-SA 4.0 (front, distant)
 *  - CheongWaDae_청와대_14.jpg, Republic of Korea (Korea.net), CC BY-SA 2.0 (front, autumn)
 * No commercial imagery. No look-only references.
 *
 * Left out: the flagpoles, the terrace balustrade and the stair on the
 * lawn, the courtyards' plantings, the bracket band's painted detail.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { bar, box, brackets, hanokMaterials, hanokParts, prism, roof, saveHanok, storey, tally, type HanokParts, type RoofOpts } from './seoul-geunjeongjeon'

/** Append `src` turned 90° (counter-clockwise from above) and moved to (cx, cy). */
function appendTurned(dst: HanokParts, src: HanokParts, cx: number, cy: number) {
  for (const k of Object.keys(src) as (keyof HanokParts)[]) {
    const s = src[k], d = dst[k]
    // Parts store glTF frame (X = x, Y = z, Z = -y); a turn (x, y) → (-y, x)
    // is (X, Z) → (Z, -X).
    for (let i = 0; i < s.pos.length; i += 3) {
      d.pos.push(s.pos[i + 2] + cx, s.pos[i + 1], -s.pos[i] - cy)
      d.nrm.push(s.nrm[i + 2], s.nrm[i + 1], -s.nrm[i])
    }
    d.uv.push(...s.uv)
  }
}

/** Window panels on a wall face, one per bay, `x` along the face, facing `n`. */
function windows(p: Part, xs: number[], y: number, z0: number, z1: number, n: V3, inset = 0.6) {
  for (let i = 0; i < xs.length - 1; i++) {
    const a = xs[i] + inset, b = xs[i + 1] - inset
    const P = (x: number, z: number): V3 => (Math.abs(n[0]) > 0.5 ? [y, x, z] : [x, y, z])
    p.tri(P(a, z0), P(b, z0), P(b, z1), undefined, undefined, undefined, [n, n, n])
    p.tri(P(a, z0), P(b, z1), P(a, z1), undefined, undefined, undefined, [n, n, n])
  }
}

function build() {
  const P = hanokParts()
  const G = 7 // the ground storey

  // Ground storey: the whole outline, white, flat-topped where nothing
  // stands on it.
  const podium: [number, number][] = [[-56.0, -37.3], [-55.6, -8.0], [-55.5, -0.1], [-39.7, 0.5], [-39.6, 12.9], [-35.2, 13.0], [-35.2, 32.6], [21.7, 32.6], [21.7, 37.3], [44.1, 37.3], [44.1, 18.5], [36.0, 18.5], [36.0, 16.3], [39.9, 16.3], [39.9, 12.5], [36.0, 12.5], [36.0, 4.6], [48.5, 4.8], [48.2, -8.3], [47.7, -35.7], [31.4, -36.0], [31.5, -10.1], [27.0, -10.1], [6.5, -10.1], [-12.6, -10.3], [-35.5, -10.5], [-39.9, -10.6], [-40.0, -37.3]]
  // The outline runs clockwise from above; walls wound to face out.
  for (let i = 0; i < podium.length; i++) {
    const [ax, ay] = podium[i], [bx, by] = podium[(i + 1) % podium.length]
    P.stone.quad([bx, by, 0], [ax, ay, 0], [ax, ay, G], [bx, by, G])
  }
  // Its flat top, in convex pieces (the hall and the wings stand on it).
  const roofTop = (pts: [number, number][]) => {
    const n: V3 = [0, 0, 1]
    for (let i = 1; i < pts.length - 1; i++) P.stone.tri([pts[0][0], pts[0][1], G], [pts[i][0], pts[i][1], G], [pts[i + 1][0], pts[i + 1][1], G], undefined, undefined, undefined, [n, n, n])
  }
  roofTop([[-35.5, -10.5], [27.0, -10.1], [27.0, 32.6], [-35.2, 32.6]])
  roofTop([[-55.6, -10.6], [-35.5, -10.6], [-35.5, 0.6], [-55.5, -0.1]])
  roofTop([[-39.7, 0.5], [-35.5, 0.6], [-35.2, 13.0], [-39.6, 12.9]])
  roofTop([[27.0, -10.1], [48.2, -8.3], [48.5, 4.8], [36.0, 4.6], [36.0, 32.6], [27.0, 32.6]])
  roofTop([[21.7, 32.6], [44.1, 32.6], [44.1, 37.3], [21.7, 37.3]])
  roofTop([[36.0, 12.5], [39.9, 12.5], [39.9, 16.3], [36.0, 16.3]])
  roofTop([[36.0, 18.5], [44.1, 18.5], [44.1, 32.6], [36.0, 32.6]])
  // The loggia across the hall's front: a dark recess behind white columns.
  const CX = -3.0
  const fxs = Array.from({ length: 12 }, (_, i) => CX - 28.2 + 56.4 * i / 11)
  windows(P.lattice, fxs, -10.35, 0.6, G - 1.2, [0, -1, 0], 0.5)
  for (const x of fxs) prism(P.stone, x, -11.0, 0, G - 0.6, 0.45, 0.42, 8)
  box(P.stone, fxs[0] - 0.5, -11.6, G - 0.6, fxs[11] + 0.5, -10.4, G + 0.1, 'b')
  tally(P, 'ground storey')

  // The hall's upper storey: white piers, grouped windows, the lintel and
  // the bracket band.
  const xs = fxs, ys = Array.from({ length: 7 }, (_, i) => 12.8 - 15.5 + 31 * i / 6)
  const L1 = 12.9, L2 = 13.4, B1 = 14.6
  box(P.stone, xs[0], ys[0], G, xs[11], ys[6], L1, 'tb')
  storey(P, xs, ys, G, L1, L2, () => 'open')
  for (const [x, y] of [...xs.map((x) => [x, ys[0]]), ...xs.map((x) => [x, ys[6]]), ...ys.slice(1, -1).flatMap((y) => [[xs[0], y], [xs[11], y]])]) box(P.stone, x - 0.45, y - 0.45, G, x + 0.45, y + 0.45, L2, 'tb', true)
  windows(P.lattice, xs, ys[0] - 0.04, 9.4, 11.8, [0, -1, 0], 0.95)
  windows(P.lattice, xs, ys[6] + 0.04, 9.4, 11.8, [0, 1, 0], 0.95)
  windows(P.lattice, ys, xs[11] + 0.04, 9.4, 11.8, [1, 0, 0], 0.95)
  windows(P.lattice, ys, xs[0] - 0.04, 9.4, 11.8, [-1, 0, 0], 0.95)
  brackets(P, xs, ys, L2, B1, { per: 0, depth: 1.4, width: 0.6 })
  tally(P, 'hall')

  roof(P, {
    cx: -2.2, cy: 12.6, kind: 'paljak', ex: 31.1, ey: 18.0, ze: 15.0, gx: 20.5, gy: 4.5, zg: 22.0, zr: 24.0,
    lift: 2.0, flare: 1.6, sag: 0.4, th: 0.85,
    soffit: { bx: 28.2 + 1.5, by: 15.5 + 1.5, zb: B1 },
    ridge: { h: 0.9, w: 1.0, ornament: 1.4 }, ridgeSag: 0.3,
  })
  tally(P, 'hall roof')

  // The wings: white walls with windows on the ground storey's wing blocks,
  // then a paljak roof whose ridge runs north–south, gable to the front.
  const wings: { roof: [number, number, number, number]; wall: [number, number, number, number] }[] = [
    { roof: [-59.6, -35.5, -39.6, -7.9], wall: [-56.0, -40.0, -37.3, -10.6] },
    { roof: [27.0, 52.1, -39.5, -8.3], wall: [31.4, 47.7, -36.0, -10.1] },
  ]
  for (const w of wings) {
    const [wx0, wx1, wy0, wy1] = w.wall
    const W = 8.2
    box(P.stone, wx0, wy0, G, wx1, wy1, W, 'b')
    const wxs = Array.from({ length: 5 }, (_, i) => wx0 + (wx1 - wx0) * i / 4)
    const wys = Array.from({ length: 7 }, (_, i) => wy0 + (wy1 - wy0) * i / 6)
    windows(P.lattice, wxs, wy0 - 0.04, 1.2, 5.6, [0, -1, 0])
    windows(P.lattice, wys, wx0 - 0.04, 1.2, 5.6, [-1, 0, 0])
    windows(P.lattice, wys, wx1 + 0.04, 1.2, 5.6, [1, 0, 0])
    brackets(P, [wx0, (wx0 + wx1) / 2, wx1], [wy0, wy0 + (wy1 - wy0) / 3, wy0 + (wy1 - wy0) * 2 / 3, wy1], W - 0.9, W, { per: 0, depth: 0.9, width: 0.7, tiers: 1 })
    const [rx0, rx1, ry0, ry1] = w.roof
    const cx = (rx0 + rx1) / 2, cy = (ry0 + ry1) / 2
    // Built with the ridge along x about the origin, then turned.
    const T = hanokParts()
    const o: RoofOpts = {
      kind: 'paljak', ex: (ry1 - ry0) / 2 - 1.3, ey: (rx1 - rx0) / 2 - 1.3, ze: 8.8, gx: 9.0, gy: 4.9, zg: 11.0, zr: 16.2,
      lift: 1.6, flare: 1.3, sag: 0.4, th: 0.75,
      soffit: { bx: (wy1 - wy0) / 2 + 0.5, by: (wx1 - wx0) / 2 + 0.5, zb: W },
      ridge: { h: 0.8, w: 0.85, ornament: 0.8 }, ridgeSag: 0.25,
    }
    roof(T, o)
    // The emblem on both gables: a pale ring (the turn puts the -x gable to the south).
    for (const s of [-1, 1]) ringOn(T.stone, s * (o.gx + 0.06), 0, 12.7, 1.2, s)
    appendTurned(P, T, cx, cy)
  }
  tally(P, 'wings')

  // The porch: eight white columns, a slab and a small blue gable.
  for (const x of [-9.3, -6.3, -0.5, 2.6]) for (const y of [-20.0, -14.1]) prism(P.stone, x, y, 0, 4.0, 0.5, 0.48, 10)
  box(P.stone, -10.1, -21.1, 4.0, 3.8, -10.4, 5.0, '')
  // Its small blue gable, ridge north–south, drawn plain.
  const pg = (x: number, y: number, z: number): V3 => [x, y, z]
  const [px0, px1, py0, py1, pz0, pz1] = [-10.5, 4.2, -21.6, -10.4, 5.0, 8.2], pxm = (px0 + px1) / 2
  P.roof.quad(pg(px0, py0, pz0), pg(pxm, py0, pz1), pg(pxm, py1, pz1), pg(px0, py1, pz0))
  P.roof.quad(pg(px1, py1, pz0), pg(pxm, py1, pz1), pg(pxm, py0, pz1), pg(px1, py0, pz0))
  P.red.tri(pg(px0 + 0.5, py0 + 0.4, pz0), pg(px1 - 0.5, py0 + 0.4, pz0), pg(pxm, py0 + 0.4, pz1 - 0.3))
  bar(P.stone, [pg(pxm, py0, pz1), pg(pxm, py1, pz1)], 0.6, 0.45, 0.1)
  for (const x of [px0, px1]) bar(P.stone, [pg(x, py0, pz0), pg(pxm, py0, pz1)], 0.4, 0.3, 0.1)
  tally(P, 'porch')

  return hanokMaterials(P, { stone: 0.6, teal: 0.5, green: 0.3 }, {
    roof: 0x4f8aa3, stone: 0xeeeae2, red: 0xae7c68, green: 0x8fb0ad, teal: 0x5d7b82, lattice: 0x667a86,
  }).map((m) => (m.material.name === 'giwa' ? { ...m, material: finish('blue-giwa', 0x4f8aa3) } : m))
}

/** A pale ring (with three dots) flush on a gable facing ±x at x. */
function ringOn(p: Part, x: number, y: number, z: number, r: number, s: number) {
  const n: V3 = [s, 0, 0]
  const at = (u: number, v: number): V3 => [x, y + u, z + v]
  const K = 16, w = 0.25
  for (let i = 0; i < K; i++) {
    const a = i / K * 2 * Math.PI, b = (i + 1) / K * 2 * Math.PI
    const A0 = at((r - w) * Math.cos(a), (r - w) * Math.sin(a)), A1 = at(r * Math.cos(a), r * Math.sin(a))
    const B0 = at((r - w) * Math.cos(b), (r - w) * Math.sin(b)), B1 = at(r * Math.cos(b), r * Math.sin(b))
    p.tri(A0, A1, B1, undefined, undefined, undefined, [n, n, n]); p.tri(A0, B1, B0, undefined, undefined, undefined, [n, n, n])
  }
  void bar
}

if (import.meta.main) await saveHanok('seoul-cheong-wa-dae', 'Cheong Wa Dae', [37.5865051, 126.9748842], 353.4, build(), 6500)
