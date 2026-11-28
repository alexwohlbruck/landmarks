/**
 * Croke Park, Dublin: original procedural geometry, CC0-1.0, no textures.
 * bun generators/dublin-croke-park.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/dublin-croke-park.glb, the low model;
 * - models/dublin-croke-park.detail.glb (zoom 16 up): stepped tiers and
 *   terrace, the roof trusses as open frames with their masts and stays,
 *   more raking struts, the stands' stair towers.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 19.3: model
 * +y runs along the pitch (north-north-east, to Hill 16), +x across it (the
 * Cusack Stand). Anchor = the centre of the pitch, OSM way/4541251 (142.3 x
 * 84.8 m, long edges at 19.3 deg), lng -6.2511279, lat 53.3607524.
 *
 * Identity, in order: the great horseshoe of three roofed stands, Cusack
 * (east), Davin (south, the canal end, wrapping both corners) and Hogan
 * (west), each three tiers of grey seats with a box band between, under a
 * dark cantilever roof with a pale translucent leading edge, carried by a
 * row of steel trusses that stand up above the roof on V masts; the stands'
 * raking concrete undersides on bold diagonal struts outside; the open,
 * low Hill 16 terrace (and the Nally terrace) at the railway end.
 *
 * Evidence
 *  - OSM: leisure=stadium way/564099741 (Q478225); building=stadium
 *    relation/3235289 (its inner ring, x -49..51, y -79..78, is the pitch's
 *    edge where the stands begin); parts relation/3235290 Cusack Stand
 *    (x 44..96, wrapping to the south-east corner), 3235291 Davin Stand
 *    (y -77..-131, both southern corners), 3235292 Hill 16 (y 73..111,
 *    sweeping to the north-east corner), 3235293 Hogan Stand (x -97..-48,
 *    y -78..71); the two corridor bridges relation/19510621 and 19510622
 *    behind the Davin Stand (drawn as stair blocks). The stands are swept
 *    along the inner ring to each part's depth (Cusack 46 m, Hogan 48 m,
 *    Davin 52 m, Hill 16 33 m), blending round the corners; the fan puts
 *    the Davin's south-east corner within 2 m of OSM's.
 *  - Published: en.wikipedia "Croke Park": the Cusack Stand is 180 m long
 *    and 35 m high, three tiers; the Skyline walkway on the roof is 44 m
 *    above the ground; Hill 16 is a terrace (Hill A, Hill B and the Nally
 *    terrace), rebuilt 2003-05; pitch 145 x 88 m.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - mc4, mc3, mc2: Metro Centric, "Croke Park (48139459926/48139486498/
 *      48139486223).jpg", CC BY 2.0, outside: the raking undersides, V
 *      struts, the trusses and masts over the roof, the stair towers.
 *      https://commons.wikimedia.org/wiki/File:Croke_Park_(48139459926).jpg
 *    - gj: Gareth James, "Croke Park stadium, Dublin - geograph.org.uk -
 *      5345386.jpg", CC BY-SA 2.0, the Cusack Stand's end in section: the
 *      tiers, the cantilever roof, its truss and mast.
 *      https://commons.wikimedia.org/wiki/File:Croke_Park_stadium,_Dublin_-_geograph.org.uk_-_5345386.jpg
 *    - pan: Rob Hurson, "Croke Park panorama.jpg", CC BY-SA 2.0, from the
 *      Hogan Stand's top: grey seats, the three tiers, Hill 16.
 *      https://commons.wikimedia.org/wiki/File:Croke_Park_panorama.jpg
 *    - seb: John Seb Barber, "Croke Park 2018.jpg", CC BY 2.0, inside: the
 *      roof's underside and its pale leading edge.
 *      https://commons.wikimedia.org/wiki/File:Croke_Park_2018.jpg
 *    - phib: O'Dea, "Croke Park stadium, viewed from Phibsborough.jpg", CC
 *      BY-SA 4.0, from the north-west: the roofline and trusses.
 *      https://commons.wikimedia.org/wiki/File:Croke_Park_stadium,_viewed_from_Phibsborough.jpg
 *    - hill: Dearbhla, "Croke Park fans on the hill.jpg", CC BY-SA 2.0,
 *      Hill 16. https://commons.wikimedia.org/wiki/File:Croke_Park_fans_on_the_hill.jpg
 *  No lidar or NAIP exists here; no commercial imagery.
 *
 * Numbers (z above the pitch and street, level: elevation 0):
 *  - Stands 35 m to the back of the upper tier (published, Cusack; the
 *    Davin and Hogan are drawn the same, as the photos show one roofline);
 *    tiers ESTIMATED from pan and gj: lower to 12 m, box band 12-17 m,
 *    middle to 24 m, band 24-27 m, upper to 35 m.
 *  - Roof 38 m at the back to 39.5 m at its leading edge, which reaches
 *    over the lower tier (gj, seb); the translucent strip the outer 8 m;
 *    trusses every ~13 m with masts to 46 m (the Skyline walkway at 44 m,
 *    published, runs along them): ESTIMATED from gj and mc4.
 *  - The underside: the upper tier oversails the concourse wall, which
 *    stands 8 m inside the outline, on V struts, its raker beams exposed
 *    (mc4, gj).
 *  - Hill 16: a terrace to 11 m at its back: ESTIMATED from pan.
 *
 * Doubts: the Nally corner (north-west) is drawn as terrace to the straight
 * line closing the outline; the stands' tier heights are estimates; the
 * stair towers, the glazed corporate boxes outside and the Skyline walkway
 * are simplified or left out. The building outline relation/3235289 reaches
 * past the stands (x -131..113, y to -157: 17% of it is outside the model),
 * and is replaced whole.
 * Terrain: Mapterhorn has only z12 here, a surface model with the stands in
 * it (13 m of relief); the open field is not filled, so `terrain.ts check`
 * reports the front rows buried by up to 8 m. The terrain is wrong for the
 * site; the model is built to the photos.
 * Night: the box bands and the concourse glazing are `window`; the roof's
 * underside and the trusses are floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { band, bar, writeLods } from './milan-san-siro'
import { face, vlerp } from './seoul-world-cup-stadium'

const BEARING = 19.3
// The stands are swept along the pitch's edge (OSM's inner ring, x -49..51,
// y -79..78, corners r 3) with outward normals, each side to its depth from
// OSM: Cusack (east) 46 m, Hogan (west) 48 m, Davin (south) 52 m, Hill 16
// (north) 33 m; at the corners the depth blends and the normals fan, which
// gives the Davin's round corners (its south-east corner lands within 2 m
// of OSM's) and Hill 16's sweep.
const XW = 49, XE = 51, YS = 79, YN = 78, RC = 3
const DEP = { e: 46, n: 33, w: 48, s: 52 }
type Pt = { x: number; y: number; nx: number; ny: number; d: number }
function edgePath(cornerSeg: number, step: number): Pt[] {
  const out: Pt[] = []
  // corners counter-clockwise from the south-east: [centre, start angle, side before, side after]
  const C: [number, number, number, number, number][] = [
    [XE - RC, -YS + RC, -90, DEP.s, DEP.e], [XE - RC, YN - RC, 0, DEP.e, DEP.n],
    [-XW + RC, YN - RC, 90, DEP.n, DEP.w], [-XW + RC, -YS + RC, 180, DEP.w, DEP.s],
  ]
  for (let c = 0; c < 4; c++) {
    const [cx, cy, a0, d0, d1] = C[c]
    for (let k = 0; k <= cornerSeg; k++) {
      const t = k / cornerSeg, a = (a0 + 90 * t) * DEG
      const nx = Math.cos(a), ny = Math.sin(a)
      out.push({ x: cx + RC * nx, y: cy + RC * ny, nx, ny, d: d0 + (d1 - d0) * (0.5 - 0.5 * Math.cos(Math.PI * t)) })
    }
    // the straight side to the next corner, subdivided
    const [nx2, ny2, a2] = [C[(c + 1) % 4][0], C[(c + 1) % 4][1], C[(c + 1) % 4][2]]
    const last = out[out.length - 1]
    const ex = nx2 + RC * Math.cos(a2 * DEG), ey = ny2 + RC * Math.sin(a2 * DEG)
    const L = Math.hypot(ex - last.x, ey - last.y), n = Math.max(1, Math.round(L / step))
    for (let k = 1; k < n; k++) out.push({ x: last.x + ((ex - last.x) * k) / n, y: last.y + ((ey - last.y) * k) / n, nx: last.nx, ny: last.ny, d: last.d })
  }
  // a point exactly where the stands meet the terraces (y = 76) on the east and west sides
  const res: Pt[] = []
  for (let i = 0; i < out.length; i++) {
    const p = out[i], q = out[(i + 1) % out.length]
    res.push(p)
    if ((p.y - 76) * (q.y - 76) < 0 && Math.abs(p.nx) > 0.9) {
      const t = (76 - p.y) / (q.y - p.y)
      res.push({ ...p, x: p.x + (q.x - p.x) * t, y: 76 })
    }
  }
  return res
}
const DEG = Math.PI / 180

function build(detail: boolean) {
  const conc = new Part(), seats = new Part(), roof = new Part(), steel = new Part(), win = new Part(), glass = new Part()
  const path = edgePath(detail ? 12 : 6, detail ? 8 : 16)
  const M = path.length
  const UP = (): V3 => [0, 0, 1]
  const DOWN = (): V3 => [0, 0, -1]
  const INW = (q: V3): V3 => [-q[0], -q[1], 0]
  const OUTW = (q: V3): V3 => [q[0], q[1], 0]
  const SEAT = (q: V3): V3 => [-q[0], -q[1], 70]
  const at = (p: Pt, s: number, z: number): V3 => [p.x + p.nx * p.d * s, p.y + p.ny * p.d * s, z]
  const S = (s: number, z: number) => path.map((p) => at(p, s, z))
  const hillSeg = (i: number) => (path[i].y + path[(i + 1) % M].y) / 2 > 76
  const st = (p: Part) => (i: number) => (hillSeg(i) ? null : p)
  const hl = (p: Part) => (i: number) => (hillSeg(i) ? p : null)
  // the stands' two ends, at y = 76 on the east and west sides
  const ends = path.map((p, i) => i).filter((i) => Math.abs(path[i].y - 76) < 1e-6)
  const endSide = (i: number): V3 => [0, path[i].nx > 0 ? 1 : 1, 0]

  // --- The three roofed stands.
  const rake = (s0: number, z0: number, s1: number, z1: number, steps: number) => {
    if (steps <= 1) { band(st(seats), S(s0, z0), S(s1, z1), SEAT); return }
    for (let k = 0; k < steps; k++) {
      const a = s0 + ((s1 - s0) * k) / steps, b = s0 + ((s1 - s0) * (k + 1)) / steps
      const za = z0 + ((z1 - z0) * k) / steps, zb = z0 + ((z1 - z0) * (k + 1)) / steps
      band(st(seats), S(a, za), S(a, zb), INW)
      band(st(seats), S(a, zb), S(b, zb), UP)
    }
  }
  band(st(conc), S(0, 0), S(0, 1.2), INW)
  rake(0, 1.2, 0.36, 12, detail ? 8 : 1)
  band(st(conc), S(0.36, 12), S(0.39, 12), UP)
  band(st(win), S(0.39, 12), S(0.39, 17), INW) // the box band (premium level)
  rake(0.39, 17, 0.6, 24, detail ? 5 : 1)
  band(st(conc), S(0.6, 24), S(0.62, 24), UP)
  band(st(win), S(0.62, 24), S(0.62, 27), INW)
  rake(0.62, 27, 0.96, 35, detail ? 8 : 1)
  band(st(conc), S(0.96, 35), S(1, 35), UP)
  band(st(conc), S(1, 35), S(1, 36.5), OUTW) // the parapet behind the upper tier
  band(st(conc), S(0.96, 36.5), S(1, 36.5), UP)
  band(st(conc), S(0.96, 35), S(0.96, 36.5), INW)
  // outside: the raking underside over the concourse, and the concourse wall
  band(st(conc), S(0.84, 9), S(1, 35), (q) => [q[0], q[1], -60])
  band(st(win), S(0.84, 0), S(0.84, 9), OUTW)
  for (const i of ends) {
    const p = path[i]
    face(conc, [at(p, 0, 0), at(p, 0.84, 0), at(p, 0.84, 9), at(p, 1, 35), at(p, 1, 36.5), at(p, 0.96, 36.5), at(p, 0.62, 27), at(p, 0.62, 24), at(p, 0.39, 17), at(p, 0.39, 12), at(p, 0, 1.2)], endSide(i))
  }

  // --- The roof: dark, from behind the upper tier out over the lower tier,
  // its outer strip translucent.
  const s0 = 0.17, sg = 0.31
  const Z = (s: number) => 38 + (1.5 * (1.02 - s)) / (1.02 - s0)
  band(st(roof), S(1.02, Z(1.02)), S(sg, Z(sg)), UP)
  band(st(glass), S(sg, Z(sg)), S(s0, Z(s0)), UP)
  band(st(roof), S(s0, Z(s0) - 1.4), S(1.02, Z(1.02) - 1.4), DOWN)
  band(st(steel), S(s0, Z(s0) - 1.4), S(s0, Z(s0) + 0.2), INW) // the leading edge's girder
  band(st(roof), S(1.02, Z(1.02) - 1.4), S(1.02, Z(1.02)), OUTW)
  for (const i of ends) {
    const p = path[i]
    face(roof, [at(p, s0, Z(s0) - 1.4), at(p, 1.02, Z(1.02) - 1.4), at(p, 1.02, Z(1.02)), at(p, s0, Z(s0))], endSide(i))
  }
  // the trusses standing up over the roof (a V mast near the back, a top
  // chord down to the leading edge, a back stay) every ~13 m along the
  // roof's back, and the raking V struts under the stand's back on the
  // same lines
  {
    // positions: walk the roof's back line and drop one every SP metres
    const SP = detail ? 12.5 : 16
    const back = S(1, 0)
    const cum = [0]
    for (let i = 1; i <= M; i++) cum.push(cum[i - 1] + Math.hypot(back[i % M][0] - back[i - 1][0], back[i % M][1] - back[i - 1][1]))
    const L = cum[M]
    for (let d = SP / 2; d < L; d += SP) {
      let i = 0
      while (cum[i + 1] < d) i++
      if (hillSeg(i)) continue
      const t = (d - cum[i]) / (cum[i + 1] - cum[i])
      const pa = path[i], pb = path[(i + 1) % M]
      // stay clear of the ends
      if (pa.y > 70 || pb.y > 70) continue
      const p: Pt = { x: pa.x + (pb.x - pa.x) * t, y: pa.y + (pb.y - pa.y) * t, nx: pa.nx + (pb.nx - pa.nx) * t, ny: pa.ny + (pb.ny - pa.ny) * t, d: pa.d + (pb.d - pa.d) * t }
      const l = Math.hypot(p.nx, p.ny); p.nx /= l; p.ny /= l
      const P = (s: number, z: number) => at(p, s, z)
      const tg: V3 = [-p.ny, p.nx, 0]
      const off = (q: V3, w: number): V3 => [q[0] + tg[0] * w, q[1] + tg[1] * w, q[2]]
      const mastTop = P(0.82, 46), front = P(s0 + 0.01, Z(s0) + 0.2), bk = P(1.02, Z(1.02))
      const w = detail ? 0.8 : 1.5
      for (const o of [-2.2, 2.2]) bar(steel, off(P(0.82, Z(0.82)), o), mastTop, w, w, [0, 0, 1], false)
      bar(steel, mastTop, front, w, w, [0, 0, 1], false)
      bar(steel, mastTop, bk, w * 0.8, w * 0.8, [0, 0, 1], false)
      if (detail) {
        const n = 5
        for (let k = 0; k < n; k++) {
          const a = s0 + 0.01 + ((0.82 - s0 - 0.01) * k) / n, b = s0 + 0.01 + ((0.82 - s0 - 0.01) * (k + 1)) / n
          bar(steel, P(a, Z(a) + 0.3), P(b, Z(b) + 0.3), 0.5, 0.5, [0, 0, 1], false)
          bar(steel, P(b, Z(b) + 0.3), vlerp(front, mastTop, (b - s0) / (0.82 - s0)), 0.4, 0.4, [0, 0, 1], false)
        }
      }
      for (const o of [-2.5, 2.5]) bar(conc, P(0.87, 0.9), off(P(0.98, 31), o), detail ? 1.2 : 1.6, detail ? 1.2 : 1.6, [0, 0, 1], true)
      // raker beams under the sloping underside: one on the strut line and one between
      for (const o of [0, SP / 2]) {
        const a = off(P(0.84, 9), o), b = off(P(1, 35), o)
        const n: V3 = [p.nx * 0.55, p.ny * 0.55, -0.9]
        bar(conc, [a[0] + n[0], a[1] + n[1], a[2] + n[2]], [b[0] + n[0], b[1] + n[1], b[2] + n[2]], 1.0, 1.4, [p.nx, p.ny, -0.6], true)
      }
    }
  }

  // --- Hill 16 and the Nally terrace: open, stepped, low.
  {
    band(hl(conc), S(0, 0), S(0, 1.2), INW)
    const steps = detail ? 12 : 1
    if (steps === 1) band(hl(conc), S(0, 1.2), S(1, 11), SEAT)
    else for (let k = 0; k < steps; k++) {
      const a = k / steps, b = (k + 1) / steps, za = 1.2 + 9.8 * a, zb = 1.2 + 9.8 * b
      band(hl(conc), S(a, za), S(a, zb), INW)
      band(hl(conc), S(a, zb), S(b, zb), UP)
    }
    band(hl(conc), S(1, 0), S(1, 12), OUTW)
    band(hl(conc), S(1, 12), S(0.97, 12), UP)
    band(hl(conc), S(0.97, 11), S(0.97, 12), INW)
    if (detail) for (const s of [0.25, 0.5, 0.75]) band(hl(steel), S(s, 1.2 + 9.8 * s + 0.2), S(s, 1.2 + 9.8 * s + 1.2), INW)
  }

  // --- The two stair blocks behind the Davin Stand (the corridor bridges).
  for (const [x0, x1, y0, y1] of [[30.4, 36.2, -141.4, -131.5], [-39.1, -33.6, -138, -130.8]]) {
    const z = 20
    const B: V3[] = [[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0]]
    for (let k = 0; k < 4; k++) {
      const a = B[k], b = B[(k + 1) % 4]
      face(conc, [a, b, [b[0], b[1], z], [a[0], a[1], z]], [((a[0] + b[0]) / 2) - (x0 + x1) / 2, ((a[1] + b[1]) / 2) - (y0 + y1) / 2, 0])
    }
    face(conc, B.map((p) => [p[0], p[1], z] as V3), [0, 0, 1])
  }

  const lit = (_p: V3, n: V3) => (n[2] < -0.3 ? 0.8 : 0.3)
  return [
    { part: conc, material: { ...finish('croke-concrete', 0xc9c6bd), floodlight: lit } },
    { part: seats, material: finish('croke-seats', 0x8e99a6) },
    { part: roof, material: { ...finish('croke-roof', 0x6f757c), floodlight: lit } },
    { part: steel, material: { ...finish('croke-steel', 0xe6e8e8), floodlight: () => 0.7 } },
    { part: win, material: { ...PALETTE.window, color: 0x5d6f80 } },
    { part: glass, material: { ...PALETTE.glass, color: 0xc9d6de } },
  ]
}

if (import.meta.main)
  await writeLods('Croke Park', { bearing: BEARING, elevation: 0, height: 46.5 }, [
    { file: 'dublin-croke-park.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'dublin-croke-park.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1_500_000 },
  ])
