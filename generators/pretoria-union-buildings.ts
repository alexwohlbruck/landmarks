/**
 * Union Buildings (Sir Herbert Baker, 1910-1913), Meintjieskop, Pretoria:
 * original procedural geometry, CC0-1.0, no textures.
 *   bun generators/pretoria-union-buildings.ts
 * Writes models/pretoria-union-buildings.glb (low) and
 * models/pretoria-union-buildings.detail.glb (detail, every window, the
 * balustrades, dome ribs, rounder columns).
 *
 * This file also exports the small kit the other pretoria-, johannesburg-
 * and durban- models by this builder use (writeModel, cyl, hipEaves,
 * mirrorX, Face/panel helpers). Merge it first.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Anchor = area centroid of the outer way (way/32315844) of
 * OSM relation/101159, lng 28.2118967, lat -25.7405649. Bearing 12.7: the
 * line through the two OSM dome parts (way/773722641, way/773722642), so
 * model +x runs along the building, east wing at +x, and +y points
 * north-north-east, up the hill. The OSM plan is symmetric about x = 0 in
 * this frame to within a metre (the colonnade's arc pairs exactly); the
 * wings are drawn mirrored, from the average of the two OSM wings.
 *
 * Identity, in order: the two long sandstone wings with red tile hipped
 * roofs; the twin domed cupola towers at their inner ends; the semicircular
 * colonnade of the amphitheatre between them, opening south; the giant
 * colonnaded loggias on the south faces of the four end pavilions; the
 * punched windows in three rows (round-headed on the top floor).
 *
 * Evidence
 *  - Plan: OSM relation/101159 and its building:parts (ways 772902480-
 *    772902501, 773635736, 773722639-773722642, 773793588-773793591),
 *    read in this frame: outer pavilions x 125.5-141.3, y -37.5..28.9;
 *    inner pavilions x 42.1-58.0, y -40.5..27.3; south ranges y -29.8..
 *    -14.6, north ranges y 2.5..17.7; cross ranges x 66.2-78.5 and
 *    102.3-114.5; towers 9.4 m square centred (47.3, 7.2); south porches
 *    x 88.7-97.1, y -39..-27.6. The colonnade (the arc of the outer way)
 *    is a true semicircle centred on the origin: inner radius 35.5, outer
 *    52 (measured from the OSM nodes, within 0.6 m).
 *  - Heights: OSM gives the wings 17-18 m, the towers 26 m and the domes
 *    26-40 m, measured from the hill side, which is higher. Drawn from the
 *    south elevation in the telephoto photo p3 (nearly orthographic): wing
 *    eaves 16 m over the front terrace, ridges 20-21.5 m, tower finial
 *    49.5 m (p3, scaled by the OSM wing length: finial 46.5 m over an eave
 *    of 14.8 m; drawn at the same ratio over a 16 m eave). The tower's
 *    stages (clock stage to 30.6 m, belfry 31.6-36.4, attic, dome 39-44.6,
 *    lantern, finial) are scaled from p3 and p6. The colonnade's gallery
 *    floor (+10.5 m) is ESTIMATED: the amphitheatre rises to the colonnade,
 *    and the map terrain behind it is 10-13 m above the wings' south faces,
 *    so the gallery is set just clear of the drawn ground there; columns
 *    7 m, eave 18.8 m, a little over the wings' (16 m) where p3 shows them
 *    about level: a compromise between p3 and the terrain.
 *  - Terrain (Mapterhorn; z15, z14 and z13 404 here, read at z12 and z11,
 *    about 30 m a pixel): the ground falls about 10 m across each wing from
 *    north to south and about 13 m from the back of the colonnade to the
 *    wings' south faces. y = 0 is the south faces; the uphill walls run
 *    down to y = 0 and sink into the hill. Windows are drawn only above an
 *    estimated ground line (0 south of y = -28, rising 0.16 m per metre north),
 *    so no window sits in the buried part of an uphill wall.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - p1 Davinci77, "Uniegebou.jpg", CC BY-SA 3.0 — from the gardens
 *      (south): towers, colonnade, pavilions, chimneys, colours.
 *      https://commons.wikimedia.org/wiki/File:Uniegebou.jpg
 *    - p2 Leo za1, "Pretoria Union Buildings-001.jpg", CC BY-SA 3.0 —
 *      night, from the south: floodlit stone, lit windows.
 *      https://commons.wikimedia.org/wiki/File:Pretoria_Union_Buildings-001.jpg
 *    - p3 Jcgill1000, "The Union Buildings, Pretoria, South Africa.jpg",
 *      CC BY-SA 3.0 — telephoto from the south: the height ratios, bays,
 *      loggias, porches. (Tilt-shift and colour-boosted; not used for
 *      colour.) https://commons.wikimedia.org/wiki/File:The_Union_Buildings,_Pretoria,_South_Africa.jpg
 *    - p4, p5 PHParsons, "Union Buildings Pretoria 002.jpg", "... 003.jpg",
 *      CC BY-SA 3.0 — the south porch, windows (round-headed top floor
 *      with shutters, pedimented middle floor), sandstone and tile colour.
 *      https://commons.wikimedia.org/wiki/File:Union_Buildings_Pretoria_002.jpg
 *      https://commons.wikimedia.org/wiki/File:Union_Buildings_Pretoria_003.jpg
 *    - p6 Portiatn, "Union Buildings, Pretoria, South Africa.JPG", CC BY-SA
 *      3.0 — a tower close up: clock stage, columned belfry, attic, ribbed
 *      dome, lantern, finial.
 *      https://commons.wikimedia.org/wiki/File:Union_Buildings,_Pretoria,_South_Africa.JPG
 *    - p7 Pierre André Leclercq, "Union Buildings in Pretoria ( Uniegebou).jpg",
 *      CC BY-SA 4.0 — an end pavilion: rusticated arched base, giant
 *      columns, hipped tile roof; the dome behind.
 *      https://commons.wikimedia.org/wiki/File:Union_Buildings_in_Pretoria_(_Uniegebou).jpg
 *    - p8 Hein waschefort, "1 Aspect of Union Buildings - Pretoria - South
 *      Africa.jpg", CC BY-SA 3.0 — dusk, from the south-west terraces.
 *      https://commons.wikimedia.org/wiki/File:1_Aspect_of_Union_Buildings_-_Pretoria_-_South_Africa.jpg
 *    - p10 Ruby D-Brown, "Union Buildings Pretoria 01.jpg" ... CC BY 4.0
 *      (looked at for the clock face only).
 *  - Published: Wikipedia "Union Buildings" (Herbert Baker; 1910-1913;
 *    about 285 m long; Pretoria sandstone; the amphitheatre between the
 *    wings).
 *  No look-only sources. No commercial imagery. No lidar exists here.
 *
 * Invented or simplified: the courtyards are left open; the cross ranges
 * and connectors are plain; the hill-side (north) faces carry only the top
 * row of windows (no licensed photo of them was found); chimney positions
 * are read from p1 and p3, their depth in plan is a guess; the amphitheatre
 * steps and the garden terraces are the map's ground and are not drawn.
 * Colours: sandstone #d4bf9c (walls) and #e2d3b6 (dressed stone: columns,
 * cornices, dome) from the sunlit stone in p1, p4, p7, pulled to the
 * palette's lightness; tile #b9644b from p1 and p4. Night: floodlit stone
 * (_FLOODLIGHT on walls, columns and towers) and lit windows, as in p2.
 * Doubts: the colonnade's terrace height; the hill-side faces; the true
 * tower height (OSM's 40 m to the dome top is from the uphill ground).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { cap, lathe, rect, walls, type XY } from './chi-aon-center'
import { face } from './phl-independence-hall'

// ---------------------------------------------------------------------------
// Kit (exported for this builder's other models).

export type Mat = Swatch & { floodlight?: (p: V3, n: V3) => number; doubleSided?: boolean; opacity?: number }
export type Slot = { part: Part; material: Mat }

/** Check the budget and write models/<file>. */
export async function writeModel(file: string, name: string, parts: Slot[], extras: Record<string, unknown>, maxTri: number, maxBytes: number) {
  const used = parts.filter((x) => x.part.triangles > 0)
  if (process.env.TRIS) console.log(used.map((x) => `${x.material.name}:${x.part.triangles}`).join(" "))
  const triangles = used.reduce((s, x) => s + x.part.triangles, 0)
  if (used.length > 6) throw new Error(`${file}: ${used.length} materials`)
  const glb = writeGlb(name, used, { frame: 'Y up, -Z north, +X east; metres; ground anchor', ...extras })
  if (triangles > maxTri || glb.length > maxBytes) throw new Error(`${file}: budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

/** Append `src` to `dst` twice: as it is, and mirrored in x = 0 (winding kept outward). */
export function mirrorX(dst: Part, src: Part, keep = true) {
  if (keep) { dst.pos.push(...src.pos); dst.nrm.push(...src.nrm); dst.uv.push(...src.uv) }
  for (let t = 0; t < src.pos.length / 9; t++) {
    for (const k of [0, 2, 1]) {
      const i = t * 9 + k * 3
      dst.pos.push(-src.pos[i], src.pos[i + 1], src.pos[i + 2])
      dst.nrm.push(-src.nrm[i], src.nrm[i + 1], src.nrm[i + 2])
      dst.uv.push(src.uv[(t * 3 + k) * 2], src.uv[(t * 3 + k) * 2 + 1])
    }
  }
}

/** A vertical cylinder, smooth-sided, flat top (and bottom) caps. */
export function cyl(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, seg = 12, top = true, bottom = false, r1 = r) {
  const dr = r - r1, hz = z1 - z0, l = Math.hypot(dr, hz) || 1
  for (let k = 0; k < seg; k++) {
    const a = (k / seg) * 2 * Math.PI, b = ((k + 1) / seg) * 2 * Math.PI
    const A: V3 = [cx + r * Math.cos(a), cy + r * Math.sin(a), z0], B: V3 = [cx + r * Math.cos(b), cy + r * Math.sin(b), z0]
    const C: V3 = [cx + r1 * Math.cos(b), cy + r1 * Math.sin(b), z1], D: V3 = [cx + r1 * Math.cos(a), cy + r1 * Math.sin(a), z1]
    const na: V3 = [Math.cos(a) * hz / l, Math.sin(a) * hz / l, dr / l], nb: V3 = [Math.cos(b) * hz / l, Math.sin(b) * hz / l, dr / l]
    p.tri(A, B, C, undefined, undefined, undefined, [na, nb, nb])
    if (r1 > 1e-6) p.tri(A, C, D, undefined, undefined, undefined, [na, nb, na])
    if (top && r1 > 1e-6) p.tri([cx, cy, z1], D, C)
    if (bottom) p.tri([cx, cy, z0], B, A)
  }
}

/** An axis-aligned box. */
export function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top = true, bottom = false) {
  walls(p, rect(x0, y0, x1, y1), z0, z1)
  if (top) cap(p, rect(x0, y0, x1, y1), z1)
  if (bottom) cap(p, rect(x0, y0, x1, y1), z0, false)
}

/**
 * A hipped roof over the wall rectangle, with eaves `o` beyond it: the
 * slopes in `roof`, the soffit (underside of the overhang) in `soffit`.
 * `rise` is the ridge's height over the eave.
 */
export function hipEaves(roof: Part, soffit: Part | null, x0: number, y0: number, x1: number, y1: number, z: number, rise: number, o = 0.7) {
  const X0 = x0 - o, X1 = x1 + o, Y0 = y0 - o, Y1 = y1 + o
  const w = X1 - X0, d = Y1 - Y0, cx = (X0 + X1) / 2, cy = (Y0 + Y1) / 2
  const r = Math.abs(w - d) / 2
  const A: V3 = w >= d ? [cx - r, cy, z + rise] : [cx, cy - r, z + rise]
  const B: V3 = w >= d ? [cx + r, cy, z + rise] : [cx, cy + r, z + rise]
  const sw: V3 = [X0, Y0, z], se: V3 = [X1, Y0, z], ne: V3 = [X1, Y1, z], nw: V3 = [X0, Y1, z]
  if (w >= d) {
    face(roof, [sw, se, B, A], [0, -1, 1]); face(roof, [ne, nw, A, B], [0, 1, 1])
    face(roof, [se, ne, B], [1, 0, 1]); face(roof, [nw, sw, A], [-1, 0, 1])
  } else {
    face(roof, [se, ne, B, A], [1, 0, 1]); face(roof, [nw, sw, A, B], [-1, 0, 1])
    face(roof, [sw, se, A], [0, -1, 1]); face(roof, [ne, nw, B], [0, 1, 1])
  }
  if (soffit && o > 0) {
    const i: V3[] = [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], e = [sw, se, ne, nw]
    for (let k = 0; k < 4; k++) face(soffit, [e[k], e[(k + 1) % 4], i[(k + 1) % 4], i[k]], [0, 0, -1])
  }
}

/** A vertical wall face: origin o (x, y), unit direction u along it, outward normal n. */
export type Face = { o: XY; u: XY; n: XY }
export const faceOf = (a: XY, b: XY): Face => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  return { o: a, u, n: [u[1], -u[0]] }
}
export const onFace = (f: Face, s: number, z: number, out = 0.05): V3 => [f.o[0] + f.u[0] * s + f.n[0] * out, f.o[1] + f.u[1] * s + f.n[1] * out, z]
/** A flat panel on a face, centred at s, half-width hw, z0..z1. */
export function fpanel(p: Part, f: Face, s: number, hw: number, z0: number, z1: number, out = 0.05) {
  face(p, [onFace(f, s - hw, z0, out), onFace(f, s + hw, z0, out), onFace(f, s + hw, z1, out), onFace(f, s - hw, z1, out)], [f.n[0], f.n[1], 0])
}
/** A round-headed panel: rectangle to the springline zs, then a semicircle. */
export function farch(p: Part, f: Face, s: number, hw: number, z0: number, zs: number, seg = 8, out = 0.05) {
  const n: V3 = [f.n[0], f.n[1], 0]
  if (zs > z0) fpanel(p, f, s, hw, z0, zs, out)
  const C = onFace(f, s, zs, out)
  for (let k = 0; k < seg; k++) {
    const t0 = (k / seg) * Math.PI, t1 = ((k + 1) / seg) * Math.PI
    face(p, [C, onFace(f, s + hw * Math.cos(t0), zs + hw * Math.sin(t0), out), onFace(f, s + hw * Math.cos(t1), zs + hw * Math.sin(t1), out)], n)
  }
}
/** A slab standing proud of a face (a cornice, a sill, a band): depth d out from the wall. */
export function fband(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d: number) {
  const n: V3 = [f.n[0], f.n[1], 0], u: V3 = [f.u[0], f.u[1], 0]
  const a0 = onFace(f, s0, z0, 0), b0 = onFace(f, s1, z0, 0), a1 = onFace(f, s0, z0, d), b1 = onFace(f, s1, z0, d)
  const A0 = onFace(f, s0, z1, 0), B0 = onFace(f, s1, z1, 0), A1 = onFace(f, s0, z1, d), B1 = onFace(f, s1, z1, d)
  face(p, [a1, b1, B1, A1], n)
  face(p, [A0, A1, B1, B0], [0, 0, 1])
  face(p, [a0, b0, b1, a1], [0, 0, -1])
  face(p, [a0, a1, A1, A0], [-u[0], -u[1], 0])
  face(p, [b0, B0, B1, b1], u)
}

// ---------------------------------------------------------------------------
// Union Buildings

const ID = 'pretoria-union-buildings'
const NAME = 'Union Buildings'
const ANCHOR: [number, number] = [28.2118967, -25.7405649]
const BEARING = 12.7

/** Estimated ground over the south faces (see header): 0 at y = -40. */
const ground = (y: number) => Math.max(0, Math.min(13, (y + 28) * 0.16))

const EAVE = 16, PAV_EAVE = 17, PITCH = 0.55 // rise per metre of half-depth (about 29 deg)

function build(detail: boolean) {
  const stone = new Part(), dressed = new Part(), tile = new Part(), win = new Part(), shade = new Part()
  // The east wing is built into these, then mirrored to the west.
  const eStone = new Part(), eDressed = new Part(), eTile = new Part(), eWin = new Part(), eShade = new Part()
  const SEG = detail ? 12 : 6, ASEG = detail ? 8 : 3

  /** Window rows on the wings: [sill, head/springline, arched?] */
  const ROWS: [number, number, boolean][] = [[2.2, 4.6, false], [6.4, 9.4, false], [10.8, 12.9, true]]

  /** Punched windows across a face from s0 to s1, `n` bays, skipping any below the ground. */
  function windows(f: Face, s0: number, s1: number, n: number, opts: { skip?: (s: number) => boolean; rows?: [number, number, boolean][] } = {}) {
    const pitch = (s1 - s0) / n
    for (let i = 0; i < n; i++) {
      const s = s0 + pitch * (i + 0.5)
      if (opts.skip?.(s)) continue
      const p = onFace(f, s, 0)
      const g = ground(p[1])
      for (const [z0, z1, arched] of opts.rows ?? ROWS) {
        if (z0 < g + 0.8) continue
        if (!detail && z0 < 6 && f.n[1] > -0.5) continue // low LOD: side and hill faces keep the upper rows
        if (arched) farch(eWin, f, s, 0.75, z0, z1, ASEG)
        else fpanel(eWin, f, s, 0.78, z0, z1)
        if (detail && !arched && z0 > 6) fband(eDressed, f, s - 1.15, s + 1.15, z1 + 0.25, z1 + 0.55, 0.22) // pediment hood
      }
    }
  }

  /** A block of the wing: walls to the eave, a cornice, a hipped tile roof. */
  function wingBlock(x0: number, y0: number, x1: number, y1: number, eave: number, cornice = true, roofY0 = y0) {
    walls(eStone, rect(x0, y0, x1, y1), 0, eave)
    if (cornice) {
      // a bold cornice band proud of every face
      const r = rect(x0, y0, x1, y1)
      for (let k = 0; k < 4; k++) fband(eDressed, faceOf(r[k], r[(k + 1) % 4]), -0.3, Math.hypot(r[(k + 1) % 4][0] - r[k][0], r[(k + 1) % 4][1] - r[k][1]) + 0.3, eave - 0.9, eave - 0.3, 0.3)
    }
    const half = Math.min(x1 - x0, y1 - roofY0) / 2 + 0.7
    hipEaves(eTile, eShade, x0, roofY0, x1, y1, eave, half * PITCH, 0.7)
  }

  // --- East wing (x > 0). Ranges first, then the taller pavilions over them.
  const S0 = -29.8, S1 = -14.6, N0 = 2.5, N1 = 17.7
  const IP = [42.1, 58.0, -40.5, 27.3] // inner pavilion x0 x1 y0 y1
  const OP = [125.5, 141.3, -37.5, 28.9] // outer pavilion
  wingBlock(IP[1] - 6, S0, OP[0] + 6, S1, EAVE) // south range (ends tucked into the pavilions)
  wingBlock(IP[1] - 6, N0, OP[0] + 6, N1, EAVE) // north range
  for (const [a, b] of [[66.2, 78.5], [102.3, 114.5]]) wingBlock(a, S1 - 3, b, N0 + 3, EAVE - 0.5, false) // cross ranges
  wingBlock(49.4, -12.8, 63.6, -2.7, EAVE - 1, false) // connectors (OSM 17 m parts)
  wingBlock(119.1, -11.0, 133.2, -0.8, EAVE - 1, false)
  const LD = 2.6 // loggia depth: the pavilions' south walls stand this far behind the columns
  for (const P of [IP, OP]) wingBlock(P[0], P[2] + LD, P[1], P[3], PAV_EAVE, true, P[2])

  // South range windows: two runs either side of the central porch.
  const fS = faceOf([IP[1], S0], [OP[0], S0])
  const porch = [88.7, 97.1]
  windows(fS, 0, porch[0] - IP[1] - 0.6, 8)
  windows(fS, porch[1] - IP[1] + 0.6, OP[0] - IP[1], 8)
  // the bay over the porch: a tall round-headed doorway behind the balcony
  farch(eWin, fS, (porch[0] + porch[1]) / 2 - IP[1], 1.1, 7.2, 10.2, ASEG)
  // North range, hill side: top row only.
  const fN = faceOf([OP[0], N1], [IP[1], N1])
  windows(fN, 0, OP[0] - IP[1], 17)
  // Outer pavilion's end face (east) and its north face.
  windows(faceOf([OP[1], OP[2]], [OP[1], OP[3]]), 2, OP[3] - OP[2] - 2, 15)
  windows(faceOf([OP[1], OP[3]], [OP[0], OP[3]]), 1, OP[1] - OP[0] - 1, 4)
  // Inner pavilion: its amphitheatre face south of the colonnade, and its north face.
  windows(faceOf([IP[0], IP[3]], [IP[0], IP[2]]), IP[3] - (-10) + 1, IP[3] - IP[2] - 2, 6)
  windows(faceOf([IP[1], IP[3]], [IP[0], IP[3]]), 1, IP[1] - IP[0] - 1, 4)
  // Pavilion side faces toward the courts, south of the ranges (seen from the south-east).
  windows(faceOf([OP[0], S0], [OP[0], OP[2]]), 0.8, S0 - OP[2] - 0.8, 2)
  windows(faceOf([IP[1], IP[2]], [IP[1], S0]), 0.8, S0 - IP[2] - 0.8, 2)

  // --- The pavilions' south loggias: rusticated arched base, a giant order
  // of four columns between square end piers, the recessed wall behind.
  function loggia(x0: number, x1: number, y: number) {
    const f = faceOf([x0, y], [x1, y]), W = x1 - x0, back = y + LD, Z0 = 5.4, Z1 = 15.2, PW = 1.6
    box(eStone, x0, y, x1, back, 0, Z0, false) // rusticated base
    face(eDressed, [[x0, y, Z0], [x1, y, Z0], [x1, back, Z0], [x0, back, Z0]], [0, 0, 1])
    box(eStone, x0, y, x0 + PW, back, Z0, Z1, false) // end piers
    box(eStone, x1 - PW, y, x1, back, Z0, Z1, false)
    box(eStone, x0, y, x1, back, Z1, PAV_EAVE, false, true) // attic over the entablature
    // the recessed wall behind the columns, with two storeys of windows
    face(eShade, [[x0 + PW, back - 0.03, Z0], [x1 - PW, back - 0.03, Z0], [x1 - PW, back - 0.03, Z1], [x0 + PW, back - 0.03, Z1]], [0, -1, 0])
    const fb = faceOf([x0 + PW, back - 0.03], [x1 - PW, back - 0.03])
    for (let i = 0; i < 3; i++) {
      const s = (W - 2 * PW) * (i + 0.5) / 3
      fpanel(eWin, fb, s, 0.8, 6.6, 9.4, 0.04)
      farch(eWin, fb, s, 0.75, 10.8, 12.9, ASEG, 0.04)
    }
    // four giant columns with base and capital blocks
    for (let i = 0; i < 4; i++) {
      const cx = x0 + PW + (W - 2 * PW) * (i + 0.5) / 4, cy = y + 0.65
      cyl(eDressed, cx, cy, 0.52, Z0 + 0.5, Z1 - 0.6, SEG, false, false, 0.44)
      box(eDressed, cx - 0.62, cy - 0.62, cx + 0.62, cy + 0.62, Z0, Z0 + 0.5)
      box(eDressed, cx - 0.64, cy - 0.64, cx + 0.64, cy + 0.64, Z1 - 0.6, Z1, false)
    }
    if (detail) fband(eDressed, faceOf([x0 + PW, y + 1.4], [x1 - PW, y + 1.4]), 0, W - 2 * PW, Z0, Z0 + 1.0, 0.25) // balustrade
    // entablature, base course and cornice across the front
    fband(eDressed, f, -0.3, W + 0.3, Z1, Z1 + 1.1, 0.3)
    fband(eDressed, f, -0.3, W + 0.3, Z0 - 0.6, Z0, 0.35)
    fband(eDressed, f, -0.3, W + 0.3, PAV_EAVE - 0.9, PAV_EAVE - 0.3, 0.3)
    // three arched openings in the rusticated base
    for (let i = 0; i < 3; i++) farch(eShade, f, W * (i + 0.5) / 3, 1.2, 0.0, 2.8, ASEG)
  }
  loggia(IP[0], IP[1], IP[2])
  loggia(OP[0], OP[1], OP[2])

  // --- The south porch on each range: curved-fronted, four columns at the
  // front and two at each side carrying a balustraded balcony (p4, p5).
  {
    const [x0, x1] = porch, y0 = -39, y1 = S0, Zb = 6.2
    const cols: [number, number][] = [[x0 + 0.6, y0 + 0.9], [x0 + 2.9, y0 + 0.3], [x1 - 2.9, y0 + 0.3], [x1 - 0.6, y0 + 0.9], [x0 + 0.5, y0 + 4.5], [x1 - 0.5, y0 + 4.5], [x0 + 0.5, y1 - 1.2], [x1 - 0.5, y1 - 1.2]]
    for (const [cx, cy] of cols) cyl(eDressed, cx, cy, 0.42, 0, Zb - 0.6, SEG, false)
    // balcony slab with a rounded front
    const mid = (x0 + x1) / 2, R = (x1 - x0) / 2 + 0.3, cyy = y0 + 4
    const ccw: XY[] = [[x1 + 0.3, y1], [x0 - 0.3, y1]]
    for (let k = 0; k <= 8; k++) { const t = Math.PI + (k / 8) * Math.PI; ccw.push([mid + R * Math.cos(t), cyy + 4.3 * Math.sin(t)]) }
    walls(eDressed, ccw, Zb - 0.6, Zb + 0.4)
    cap(eDressed, ccw, Zb + 0.4)
    cap(eShade, ccw, Zb - 0.6, false)
    walls(eDressed, ccw, Zb + 0.4, Zb + 1.4) // balustrade (solid)
    // the doorway at ground level behind the porch
    fpanel(eShade, fS, (x0 + x1) / 2 - IP[1], 1.3, 0, 3.6)
  }

  // --- Chimneys (p1, p3): tall stacks with a capping.
  for (const [cx, cy] of [[60.5, -3], [131, -14], [131, 14]] as XY[]) {
    box(eStone, cx - 0.9, cy - 1.4, cx + 0.9, cy + 1.4, PAV_EAVE, 25.5, false)
    box(eDressed, cx - 1.1, cy - 1.6, cx + 1.1, cy + 1.6, 25.5, 26.1)
  }

  // --- The tower (p6): a square clock stage with banded corners, a
  // columned belfry over a balustrade, an attic, a ribbed dome, a lantern.
  {
    const cx = 47.3, cy = 7.2, H = 4.7
    walls(eStone, rect(cx - H, cy - H, cx + H, cy + H), 0, 29.6)
    // corner quoins: slim bands proud of the shaft at the corners
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const qx = cx + sx * H, qy = cy + sy * H
      box(eDressed, Math.min(qx, qx - sx * 0.9) - (sx > 0 ? 0 : 0.15), Math.min(qy, qy - sy * 0.9) - (sy > 0 ? 0 : 0.15), Math.max(qx, qx - sx * 0.9) + (sx > 0 ? 0.15 : 0), Math.max(qy, qy - sy * 0.9) + (sy > 0 ? 0.15 : 0), 20, 29.6, false)
    }
    // clock stage cornice
    box(eDressed, cx - H - 0.45, cy - H - 0.45, cx + H + 0.45, cy + H + 0.45, 29.6, 30.6)
    const r = rect(cx - H, cy - H, cx + H, cy + H)
    for (let k = 0; k < 4; k++) {
      const f = faceOf(r[k], r[(k + 1) % 4])
      // clock face: pale ring with a dark centre
      const C = onFace(f, H, 27.0, 0.06)
      const seg = detail ? 16 : 8
      for (let q = 0; q < seg; q++) {
        const t0 = (q / seg) * 2 * Math.PI, t1 = ((q + 1) / seg) * 2 * Math.PI
        face(eDressed, [C, onFace(f, H + 1.35 * Math.cos(t0), 27.0 + 1.35 * Math.sin(t0), 0.06), onFace(f, H + 1.35 * Math.cos(t1), 27.0 + 1.35 * Math.sin(t1), 0.06)], [f.n[0], f.n[1], 0])
        if (detail) face(eShade, [onFace(f, H, 27.0, 0.1), onFace(f, H + 0.55 * Math.cos(t0), 27.0 + 0.55 * Math.sin(t0), 0.1), onFace(f, H + 0.55 * Math.cos(t1), 27.0 + 0.55 * Math.sin(t1), 0.1)], [f.n[0], f.n[1], 0])
      }
      // a tall window under the clock
      fpanel(eWin, f, H, 0.7, 23.2, 25.2)
    }
    // belfry: balustrade, dark open core, corner piers and two columns a side
    const B0 = 30.6, B1 = 36.4
    box(eDressed, cx - H + 0.1, cy - H + 0.1, cx + H - 0.1, cy + H - 0.1, B0, B0 + 1.0, false)
    box(eShade, cx - H + 1.3, cy - H + 1.3, cx + H - 1.3, cy + H - 1.3, B0 + 1.0, B1, false)
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const px = cx + sx * (H - 0.8), py = cy + sy * (H - 0.8)
      box(eStone, px - 0.8, py - 0.8, px + 0.8, py + 0.8, B0 + 1.0, B1, false)
    }
    for (let k = 0; k < 4; k++) {
      const f = faceOf(r[k], r[(k + 1) % 4])
      for (const s of [H - 1.15, H + 1.15]) { const p = onFace(f, s, 0, -0.7); cyl(eDressed, p[0], p[1], 0.36, B0 + 1.0, B1, SEG, false) }
    }
    // entablature, attic with chamfered corners, the dome on a short drum
    box(eDressed, cx - H - 0.5, cy - H - 0.5, cx + H + 0.5, cy + H + 0.5, B1, B1 + 1.1)
    const att: XY[] = []
    for (let k = 0; k < 8; k++) { const t = (k + 0.5) * Math.PI / 4; att.push([cx + 4.6 * Math.cos(t) / Math.cos(Math.PI / 8), cy + 4.6 * Math.sin(t) / Math.cos(Math.PI / 8)]) }
    const att2 = att.map(([x, y]) => [cx + (x - cx) * 0.93, cy + (y - cy) * 0.93] as XY)
    walls(eStone, att2, B1 + 1.1, 39.0); cap(eDressed, att2, 39.0)
    // the dome: slightly pointed, springing at 37.0, 4.1 m radius, top 42.6
    const prof: XY[] = []
    const DN = detail ? 10 : 6
    for (let k = 0; k <= DN; k++) { const t = (k / DN) * Math.PI / 2; prof.push([4.1 * Math.cos(t) * (1 - 0.06 * Math.sin(t)), 39.0 + 5.6 * Math.sin(t) ** 0.92]) }
    prof[prof.length - 1] = [1.05, prof[prof.length - 1][1]]
    lathe(eDressed, cx, cy, [[4.35, 38.6], [4.35, 39.0], ...prof], detail ? 16 : 10)
    if (detail) {
      // ribs
      for (let k = 0; k < 8; k++) {
        const t = (k * Math.PI) / 4
        for (let j = 0; j < DN; j++) {
          const [r0, z0] = prof[j], [r1, z1] = prof[j + 1]
          const n: V3 = [Math.cos(t), Math.sin(t), 0], tt: V3 = [-Math.sin(t), Math.cos(t), 0]
          const P = (rr: number, z: number, w: number, o: number): V3 => [cx + n[0] * (rr + o) + tt[0] * w, cy + n[1] * (rr + o) + tt[1] * w, z]
          face(eDressed, [P(r0, z0, -0.18, 0.15), P(r0, z0, 0.18, 0.15), P(r1, z1, 0.18, 0.15), P(r1, z1, -0.18, 0.15)], [n[0] * (z1 - z0), n[1] * (z1 - z0), r0 - r1])
        }
      }
    }
    // lantern, cap and finial
    const zt = prof[prof.length - 1][1]
    cyl(eDressed, cx, cy, 1.1, zt - 0.2, zt + 1.9, detail ? 10 : 8, false)
    if (detail) for (let k = 0; k < 6; k++) { const t = k * Math.PI / 3; cyl(eShade, cx + 0.9 * Math.cos(t), cy + 0.9 * Math.sin(t), 0.12, zt + 0.2, zt + 1.5, 4) }
    lathe(eDressed, cx, cy, [[1.35, zt + 1.9], [1.35, zt + 2.2], [0.9, zt + 2.6], [0.2, zt + 3.0], [0, zt + 3.05]], detail ? 10 : 8)
    cyl(eDressed, cx, cy, 0.2, zt + 3.0, 49.5, 6, true, false, 0.08)
  }

  mirrorX(stone, eStone); mirrorX(dressed, eDressed); mirrorX(tile, eTile); mirrorX(win, eWin); mirrorX(shade, eShade)

  // --- The colonnade: a true semicircle (r 35.5-52) on the amphitheatre's
  // terrace (+7 m), clipped where it meets the inner pavilions (x = 42.1).
  {
    const R0 = 35.5, R1 = 52, ZT = 10.5, ZC1 = 17.4, ZE = 18.8, RG = 40.2 // gallery back wall radius
    const NA = detail ? 48 : 28
    const th0 = -0.26, th1 = Math.PI + 0.26
    const Rout = (t: number) => Math.min(R1, (IP[0] + 0.2) / Math.max(1e-3, Math.abs(Math.cos(t))))
    const at = (t: number, r: number, z: number): V3 => [r * Math.cos(t), r * Math.sin(t), z]
    const ts = Array.from({ length: NA + 1 }, (_, k) => th0 + ((th1 - th0) * k) / NA)
    for (let k = 0; k < NA; k++) {
      const a = ts[k], b = ts[k + 1], m = (a + b) / 2
      const ro = (t: number) => Math.max(Rout(t), RG + 1)
      // outer (hill) wall, the base under the gallery, the gallery's back wall
      face(stone, [at(a, ro(a), 0), at(b, ro(b), 0), at(b, ro(b), ZE), at(a, ro(a), ZE)], [Math.cos(m), Math.sin(m), 0])
      face(stone, [at(a, R0, 0), at(b, R0, 0), at(b, R0, ZT), at(a, R0, ZT)], [-Math.cos(m), -Math.sin(m), 0])
      face(dressed, [at(a, R0, ZT), at(b, R0, ZT), at(b, RG, ZT), at(a, RG, ZT)], [0, 0, 1])
      face(dressed, [at(a, R0 - 0.3, ZT - 1.0), at(b, R0 - 0.3, ZT - 1.0), at(b, R0 - 0.3, ZT), at(a, R0 - 0.3, ZT)], [-Math.cos(m), -Math.sin(m), 0])
      face(shade, [at(a, RG, ZT), at(b, RG, ZT), at(b, RG, ZC1), at(a, RG, ZC1)], [-Math.cos(m), -Math.sin(m), 0])
      // entablature over the columns: front face, soffit
      face(dressed, [at(a, R0, ZC1), at(b, R0, ZC1), at(b, R0, ZE), at(a, R0, ZE)], [-Math.cos(m), -Math.sin(m), 0])
      face(dressed, [at(a, R0, ZC1), at(b, R0, ZC1), at(b, RG, ZC1), at(a, RG, ZC1)], [0, 0, -1])
      // tile roof: inner slope from the eave over the columns to the ridge, outer slope to the hill wall
      const RR = (t: number) => R0 - 0.8 + (ro(t) + 1.5 - R0) * 0.5, ZR = (t: number) => ZE + (RR(t) - R0 + 0.8) * 0.42
      face(tile, [at(a, R0 - 0.8, ZE), at(b, R0 - 0.8, ZE), at(b, RR(b), ZR(b)), at(a, RR(a), ZR(a))], [-Math.cos(m), -Math.sin(m), 1.5])
      face(tile, [at(a, RR(a), ZR(a)), at(b, RR(b), ZR(b)), at(b, ro(b) + 0.7, ZE), at(a, ro(a) + 0.7, ZE)], [Math.cos(m), Math.sin(m), 1.5])
      face(shade, [at(a, R0 - 0.8, ZE), at(b, R0 - 0.8, ZE), at(b, R0, ZE), at(a, R0, ZE)], [0, 0, -1])
      face(shade, [at(a, ro(a), ZE), at(b, ro(b), ZE), at(b, ro(b) + 0.7, ZE), at(a, ro(a) + 0.7, ZE)], [0, 0, -1])
      // windows on the gallery's back wall, two storeys, one per bay
      const f: Face = { o: [RG * Math.cos(m) - 0.0, RG * Math.sin(m)], u: [Math.sin(m), -Math.cos(m)], n: [-Math.cos(m), -Math.sin(m)] }
      if (detail || k % 2 === 0) {
        fpanel(win, f, 0, detail ? 0.6 : 0.9, ZT + 1.2, ZT + 3.4, 0.04)
        farch(win, f, 0, detail ? 0.55 : 0.8, ZT + 4.3, ZT + 5.6, ASEG, 0.04)
      }
      // hill-side windows: the top row only
      if (detail || k % 2 === 0) {
        const rr = ro(m), fo: Face = { o: [rr * Math.cos(m), rr * Math.sin(m)], u: [-Math.sin(m), Math.cos(m)], n: [Math.cos(m), Math.sin(m)] }
        if (rr > R1 - 0.5) farch(win, fo, 0, 0.7, ZE - 4.6, ZE - 3.0, ASEG)
      }
    }
    // gallery ends against the pavilions
    for (const t of [th0, th1]) {
      const n: V3 = t < 1 ? [Math.sin(t), -Math.cos(t), 0] : [-Math.sin(t), Math.cos(t), 0]
      face(stone, [at(t, R0, 0), at(t, Math.max(Rout(t), RG + 1), 0), at(t, Math.max(Rout(t), RG + 1), ZE), at(t, R0, ZE)], n)
    }
    // the giant columns along the inner arc
    const NC = detail ? 30 : 22
    for (let i = 0; i < NC; i++) {
      const t = th0 + 0.1 + ((th1 - th0 - 0.2) * (i + 0.5)) / NC
      const c = at(t, R0 + 0.7, 0)
      cyl(dressed, c[0], c[1], 0.47, ZT + 0.4, ZC1 - 0.5, SEG, false, false, 0.4)
      box(dressed, c[0] - 0.62, c[1] - 0.62, c[0] + 0.62, c[1] + 0.62, ZT, ZT + 0.4)
      box(dressed, c[0] - 0.64, c[1] - 0.64, c[0] + 0.64, c[1] + 0.64, ZC1 - 0.5, ZC1, false)
    }
  }

  const floodWall = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.85)
  return [
    { part: stone, material: { ...finish('ub-sandstone', 0xd4bf9c), floodlight: floodWall } },
    { part: dressed, material: { ...finish('ub-dressed-stone', 0xe2d3b6), floodlight: floodWall } },
    { part: tile, material: finish('ub-tile', 0xb9644b) },
    { part: win, material: PALETTE.window },
    { part: shade, material: finish('ub-shade', 0x7b6f62) },
  ] as Slot[]
}

if (import.meta.main) {
  const extras = { anchor: ANCHOR, bearing: BEARING }
  await writeModel(`${ID}.glb`, NAME, build(false), extras, 6500, 250_000)
  await writeModel(`${ID}.detail.glb`, NAME, build(true), extras, 40_000, 1_536_000)
}
