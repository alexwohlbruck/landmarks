/**
 * Myers Park Presbyterian Church Outreach Center, 1073 Providence Road,
 * Charlotte. Detached building split from the church campus generator.
 * bun generators/clt-myers-park-presbyterian-outreach-center.ts
 *
 * Evidence and original forms: Josh Richard and Thiencg's campus model
 * supplied by Alex Wohlbruck with permission (https://www.fiverr.com/thiencfv,
 * https://www.linkedin.com/in/richardjosh/); OSM way/369312110 (ODbL).
 * https://www.openstreetmap.org/way/369312110
 * USGS 3DEP USGS_LPC_NC_Phase4_Mecklenburg_2016_LAS_2019 (2016, public domain):
 * main ridge 19.2 m, cross ridge 20.3 m, eaves 13.9/14.5 m, canopy 9.3 m,
 * annex 11.5 m above the original lidar box's ground_min (204.2 m NAVD88).
 * Ground under the OSM outline is at least 4.45 m above that minimum;
 * rounded down to 4.4 m for this building's own y = 0. Original facade
 * ground estimate 4.6 m is used only to recover door/fanlight dimensions.
 * Source terrain offsets are removed using clt-mppc-ground.ts before the
 * map applies Mapterhorn draping. This flatter site keeps a flat base;
 * both entrance leaves start at y = 0, with the map's ordinary 0.5 m sink
 * hiding their lower edge below terrain. Canopy posts extend to y = 0.
 * Roof finish: USGS NAIP orthophoto (public domain). Window shapes and
 * spacing, gables, pilasters, doors and canopy follow the supplied model.
 * Estimated: window dimensions and bay counts, west-side facade ground.
 * Doubts: no open exterior photos; stone colour assumes the church's OSM
 * stone finish. Arched windows are flush rather than recessed; north-west
 * fins are omitted. Night: windows glow; no evidence for floodlit stone.
 *
 * +Y up, -Z north, +X east, metres; bearing 334°. The anchor is the centre
 * of the main hall's plan width at q=29 m in its original local frame.
 * Geometry and catalog anchor are rebased together to preserve OSM alignment.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, ccw, flatShape, extrudeShape, archShape, finishGlb, writeModel } from './sea-tacoma-union-station'
import { type Frame, gabled, flatBlock, sideFace, sAt, doorway, R, windowRows, framed, tracery, at, dir, reanchor, terrainRelative } from './clt-myers-park-presbyterian'

const Z = (h: number) => h - 4.4

function build() {
  const stone = new Part(), trim = new Part(), shingle = new Part(), win = new Part(), door = new Part()
  const flat = trim
  // ---- the Outreach Center (way/369312110), 170 m east, its walls turned 5.4° from the church's
  {
    const a = (5.4 * Math.PI) / 180, O: XY = [81.2, -87.4]
    const W = (p: number, q: number): XY => [O[0] + p * Math.cos(a) - q * Math.sin(a), O[1] + p * Math.sin(a) + q * Math.cos(a)]
    const fr = (p0: number, q0: number, p1: number, q1: number, along: 'p' | 'q'): [Frame, number, number] => {
      const c = W((p0 + p1) / 2, (q0 + q1) / 2)
      return along === 'p' ? [{ cx: c[0], cy: c[1], a }, p1 - p0, q1 - q0] : [{ cx: c[0], cy: c[1], a: a + Math.PI / 2 }, q1 - q0, p1 - p0]
    }
    const OG = Z(4.6) // its ground
    const [mf, mL, mW] = fr(0, 0, 33.4, 38.6, 'q')
    gabled(mf, mL, mW, 0, Z(13.9), Z(19.2), stone, shingle, { over: 0.5, bevel: 0.2, ends: [true, false] })
    const [cf, cL, cW] = fr(-11.9, 29.5, 33.6, 47.8, 'p')
    gabled(cf, cL, cW, 0, Z(14.5), Z(20.3), stone, shingle, { over: 0.5, bevel: 0.2 })
    flatBlock(stone, trim, flat, [W(33.3, 4.1), W(39.1, 4.2), W(38.5, 27.0), W(33.3, 27.0)], Z(11.5))
    // the north entry: an open flat canopy on posts over the glazed doors in the cross gable
    {
      const top = Z(9.3)
      prism(trim, trim, ccw([W(13.3, 47.8), W(20.1, 47.8), W(20.1, 58.0), W(13.3, 58.0)]), top - 0.6, top)
      for (const [p, q] of [[13.7, 57.6], [19.7, 57.6], [13.7, 52.7], [19.7, 52.7]]) {
        const c = W(p, q), d = 0.22
        prism(trim, null, ccw([[c[0] - d, c[1] - d], [c[0] + d, c[1] - d], [c[0] + d, c[1] + d], [c[0] - d, c[1] + d]]), 0, top - 0.6)
      }
      const nf = sideFace(cf, [0, 1], cW / 2)
      doorway(trim, door, win, nf, sAt(nf, W(16.7, 47.8)), 2.6, OG, OG + 2.6, 'flat', 0.3)
      flatShape(win, nf, R(sAt(nf, W(16.7, 47.8)) - 1.3, OG + 3.3, sAt(nf, W(16.7, 47.8)) + 1.3, OG + 4.0), 0.06)
      windowRows(win, nf, -cL / 2 + 1.5, -cL / 2 + 24.0, [[OG + 1.4, OG + 3.4], [OG + 5.0, OG + 7.6]], 4.2, 0.8)
    }
    // the south gable: two rows of windows in pairs, a round-headed louvre in the apex
    const sg = sideFace(mf, [-1, 0], mL / 2)
    extrudeShape(trim, sg, [[-mW / 2 - 0.2, Z(13.9)], [0, Z(19.55)], [mW / 2 + 0.2, Z(13.9)], [mW / 2 - 0.6, Z(13.9)], [0, Z(19.0)], [-mW / 2 + 0.6, Z(13.9)]], 0, 0.3)
    for (const d of [-14.4, -1.4, 1.4, 14.4]) for (const [z0, z1] of [[1.1, 3.1], [5.1, 7.1]]) framed(trim, win, sg, d - 0.65, OG + z0, d + 0.65, OG + z1, 0.15)
    flatShape(win, sg, archShape(0, 1.2, OG + 9.1, OG + 10.5, 6), 0.06)
    // the long sides: six bays of tall round-headed windows under square ones, pilasters between
    for (const v of [-1, 1] as const) {
      const side = sideFace(mf, [0, v], mW / 2), u0 = -mL / 2 + 0.6, u1 = -mL / 2 + 29.4, bay = (u1 - u0) / 6
      for (let k = 0; k < 6; k++) {
        const s = -v * (u0 + bay * (k + 0.5))
        flatShape(trim, side, archShape(s, 2.6, OG + 0.3, OG + 3.4, 8), 0.03)
        flatShape(win, side, archShape(s, 2.2, OG + 0.5, OG + 3.4, 8), 0.06)
        tracery(trim, side, s, 2.2, OG + 0.5, OG + 3.4, 2, 'round', [OG + 2.6], 0.14)
        framed(trim, win, side, s - 0.8, OG + 5.2, s + 0.8, OG + 7.2, 0.16)
      }
      for (let k = 0; k <= 6; k++) {
        const u = u0 + bay * k, c = at(mf, u, v * (mW / 2 + 0.2)), d = dir(mf, 1, 0), nn = dir(mf, 0, v)
        prism(trim, trim, ccw([[c[0] - d[0] * 0.35 - nn[0] * 0.2, c[1] - d[1] * 0.35 - nn[1] * 0.2], [c[0] + d[0] * 0.35 - nn[0] * 0.2, c[1] + d[1] * 0.35 - nn[1] * 0.2], [c[0] + d[0] * 0.35 + nn[0] * 0.2, c[1] + d[1] * 0.35 + nn[1] * 0.2], [c[0] - d[0] * 0.35 + nn[0] * 0.2, c[1] - d[1] * 0.35 + nn[1] * 0.2]]), 0, Z(13.6))
      }
    }
    // the cross gable's ends: the tall round-headed centre window, windows either side, the west door
    for (const e of [-1, 1] as const) {
      const end = sideFace(cf, [e, 0], cL / 2)
      extrudeShape(trim, end, [[-cW / 2 - 0.2, Z(14.5)], [0, Z(20.65)], [cW / 2 + 0.2, Z(14.5)], [cW / 2 - 0.6, Z(14.5)], [0, Z(20.1)], [-cW / 2 + 0.6, Z(14.5)]], 0, 0.3)
      flatShape(trim, end, archShape(0, 2.8, OG + 0.2, OG + 6.9, 8), 0.03)
      flatShape(win, end, archShape(0, 2.3, OG + 0.4, OG + 6.9, 8), 0.06)
      tracery(trim, end, 0, 2.3, OG + 0.4, OG + 6.9, 2, 'round', [OG + 2.8, OG + 5.2], 0.14)
      for (const d of [-7.4, -3.0, 3.0, 7.4]) framed(trim, win, end, d - 0.65, OG + 5.0, d + 0.65, OG + 7.2, 0.15)
      for (const d of [-7.4, 3.0, 7.4]) framed(trim, win, end, d - 0.65, OG + 1.0, d + 0.65, OG + 3.2, 0.15)
      if (e === -1) doorway(trim, door, win, end, -3.0, 2.0, OG, OG + 2.7, 'flat', 0.25)
      else framed(trim, win, end, -3.65, OG + 1.0, -2.35, OG + 3.2, 0.15)
    }
  }

  terrainRelative([stone, trim, shingle, win, door], 4.4)
  const a = 5.4 * Math.PI / 180
  reanchor([stone, trim, shingle, win, door], 81.2 + 16.7 * Math.cos(a) - 29 * Math.sin(a), -87.4 + 16.7 * Math.sin(a) + 29 * Math.cos(a))
  return finishGlb('Myers Park Presbyterian Church Outreach Center', [
    { part: stone, material: finish('mppc-stone', 0xe4d5c3) },
    { part: trim, material: PALETTE.trim },
    { part: shingle, material: finish('mppc-shingle', 0xb7b5a8) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('mppc-door', 0x76675a) },
  ], { bearing: 334, height: Z(20.65) })
}

if (import.meta.main) await writeModel('clt-myers-park-presbyterian-outreach-center', build())
