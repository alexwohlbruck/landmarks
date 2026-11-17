/**
 * De Gooyer, Funenkade 5, Amsterdam: the corn mill of 1725 rebuilt on this
 * site in 1814, the tallest wooden mill in the Netherlands — original
 * procedural geometry, CC0-1.0.
 * bun generators/amsterdam-de-gooyer.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground, on the mill's axis. Anchor = area centroid of OSM way/269052487
 * (building=industrial, start_date 1725, BAG 0363100012169758, the mill's
 * outline, 11 m across, next to node/33057057 man_made=windmill "De
 * Gooyer"), 52.366808, 4.926173. The mill is octagonal and drawn
 * symmetric about its axis; the cap turns, and is drawn with its sails to
 * model -y. Bearing 45, so the sails face south-west (bearing 225), into
 * the prevailing wind, as in most of the photos.
 *
 * Identity, in order: the four big lattice sails in an X; the tall
 * octagonal body in two stacked wooden octagons, the upper one dark, the
 * lower one grey, on a red-brick base; the wide stage (stelling) halfway up
 * on its ring of raking struts; the boat-shaped cap; the tail pole and its
 * braces down to the stage at the back.
 *
 * The sails are their own glTF node ("sails"), its origin on the axle at
 * the hub, so they can be turned later (they are not animated here).
 *
 * Evidence
 *  - OSM way/269052487 (a 4-node square, 11 m across) and node/33057057
 *    (man_made=windmill, wikidata Q2756543).
 *  - 3D BAG (3dbag.nl, CC BY 4.0, TU Delft/3DGI), pand
 *    NL.IMBAG.Pand.0363100012169758, AHN5 (2023), sampled on a 1 m grid:
 *    the stage deck reads 18.1 m where it meets the body (the BAG outline
 *    is only the base, so the rest of the stage is not sampled); cap and
 *    sail points 29.6-35.0 (the reconstruction merges cap and sails, so the
 *    cap height is taken from the photos instead). Ground NAP +2.0.
 *  - Published (nl.wikipedia "De Gooyer (Amsterdam)"): a stellingmolen of
 *    two wooden octagons stacked on a stone base; sail span (vlucht) 26.6 m;
 *    Old Dutch (Oudhollandse) lattice sails since 1976; rijksmonument 1107.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - Zairon, "Amsterdam De Gooyer 06.jpg", CC BY-SA 4.0 — the whole mill
 *      from the street, near level: stages, stage struts, sails, tail.
 *      https://commons.wikimedia.org/wiki/File:Amsterdam_De_Gooyer_06.jpg
 *    - Zairon, "Amsterdam De Gooyer 03.jpg", CC BY-SA 4.0 — distant, across
 *      the water. https://commons.wikimedia.org/wiki/File:Amsterdam_De_Gooyer_03.jpg
 *    - Suicasmo, "De Gooyer, Amsterdam 20180702.jpg", CC BY-SA 4.0 — with
 *      the brewery. https://commons.wikimedia.org/wiki/File:De_Gooyer,_Amsterdam_20180702.jpg
 *    - Swimmerguy269, "De Gooyer Windmill.jpg", CC BY-SA 3.0.
 *      https://commons.wikimedia.org/wiki/File:De_Gooyer_Windmill.jpg
 *    - Mariordo, "De Gooyer windmill AMS 12 2016 0436.jpg" and "0474",
 *      CC BY-SA 4.0 — across the Nieuwe Vaart.
 *      https://commons.wikimedia.org/wiki/File:De_Gooyer_windmill_AMS_12_2016_0474.jpg
 *    - Guilhem Vellut, "\"De Gooyer\" windmill @ Amsterdam
 *      (19010316813).jpg", CC BY 2.0.
 *      https://commons.wikimedia.org/wiki/File:%22De_Gooyer%22_windmill_@_Amsterdam_(19010316813).jpg
 *  No commercial imagery, no look-only sources. Elevation 0 (the base stands
 *  on the quay; terrain flat).
 *
 * Estimated from Mariordo's near-level view across the Nieuwe Vaart (widths
 * as ratios to the base, 11 m across from OSM) and Zairon's street view,
 * with the 3D BAG heights: brick base 0-7.5 m, 11 m across the flats
 * tapering to 10.2; lower octagon from a flared skirt at 7.5 m (10.8
 * across) to 8.8 m at the stage; stage deck 18.1, 17.6 m across, on sixteen
 * pale struts from 13.4 m on the body; upper octagon 8.4 tapering to 6.0 m
 * at 27.4; cap to 30.8, 8 m long, 6.6 m wide, its ends rounded down; axle at 29.0, tilted up 8
 * degrees (Mariordo's view puts the stage at 0.6 of the cap's height); sails 13.3 m radius (published span), the
 * lattice from 2.4 m to the tip, 2.1 m wide on the trailing side. The
 * Brouwerij 't IJ next door is a separate building and is not modelled.
 * Drawn bolder than real: stocks 0.6 m, laths 0.3 m, struts 0.5 m, so they
 * read at phone size; the laths at 1.6 m spacing (about half the real
 * number). Left out: the railing's posts (drawn as a low band), the
 * winding wheel's spokes, the brake, doors' details.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, type XY } from './chi-aon-center'
import { swalls, tube } from './amsterdam-johan-cruijff-arena'

const oct = (across: number, z = 0): XY[] => {
  const r = across / 2 / Math.cos(Math.PI / 8)
  return Array.from({ length: 8 }, (_, k) => [r * Math.cos(Math.PI / 8 + (k * Math.PI) / 4), r * Math.sin(Math.PI / 8 + (k * Math.PI) / 4)] as XY)
}
/** Flat-shaded walls between two octagons (each face its own normal). */
function ofaces(p: Part, a: XY[], z0: number, b: XY[], z1: number) {
  for (let i = 0; i < a.length; i++) {
    const j = (i + 1) % a.length
    p.quad([a[i][0], a[i][1], z0], [a[j][0], a[j][1], z0], [b[j][0], b[j][1], z1], [b[i][0], b[i][1], z1])
  }
}
/** A flat panel on octagon face k, between heights, half-width hw at the centre. */
function onFace(p: Part, a: XY[], z0: number, b: XY[], z1: number, k: number, hw: number, h0: number, h1: number) {
  const j = (k + 1) % 8
  const t = (z: number) => (z - z0) / (z1 - z0)
  const P = (s: number, z: number): V3 => {
    const q0: XY = [a[k][0] + (b[k][0] - a[k][0]) * t(z), a[k][1] + (b[k][1] - a[k][1]) * t(z)]
    const q1: XY = [a[j][0] + (b[j][0] - a[j][0]) * t(z), a[j][1] + (b[j][1] - a[j][1]) * t(z)]
    const m: XY = [(q0[0] + q1[0]) / 2, (q0[1] + q1[1]) / 2], d: XY = [q1[0] - q0[0], q1[1] - q0[1]], l = Math.hypot(d[0], d[1])
    const n: XY = [m[0] / Math.hypot(m[0], m[1]), m[1] / Math.hypot(m[0], m[1])]
    return [m[0] + (d[0] / l) * s + n[0] * 0.06, m[1] + (d[1] / l) * s + n[1] * 0.06, z]
  }
  p.quad(P(-hw, h0), P(hw, h0), P(hw, h1), P(-hw, h1))
}

function build() {
  const brick = new Part(), grey = new Part(), dark = new Part(), pale = new Part(), win = new Part(), roof = new Part()

  // --- Brick base, 0-7.5 m, with its door and windows.
  const B0 = oct(11.0), B1 = oct(10.2)
  ofaces(brick, B0, 0, B1, 7.2)
  ofaces(pale, B1, 7.2, oct(10.3), 7.5) // the stone course on top of the base
  for (let k = 0; k < 8; k++) {
    if (k % 2 === 0) onFace(win, B0, 0, B1, 7.2, k, 0.6, 3.6, 5.4)
  }
  onFace(win, B0, 0, B1, 7.2, 5, 0.85, 0, 2.6) // door

  // --- Lower octagon: a flared grey skirt over the base, tapering to the stage.
  const L0 = oct(10.8), L1 = oct(10.1), L2 = oct(8.8)
  ofaces(grey, oct(10.3), 7.5, L0, 7.5)
  ofaces(grey, L0, 7.5, L1, 9.0)
  ofaces(grey, L1, 9.0, L2, 18.1)
  for (const k of [1, 3, 5, 7]) onFace(win, L1, 9.0, L2, 18.1, k, 0.45, 11.6, 13.0)

  // --- The stage: an octagonal deck with a low railing, on raking struts.
  const S = 18.1, SO = oct(17.6), SI = oct(8.8)
  ofaces(dark, SO, S - 0.45, SO, S)
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    grey.quad([SI[i][0], SI[i][1], S], [SI[j][0], SI[j][1], S], [SO[j][0], SO[j][1], S], [SO[i][0], SO[i][1], S]) // deck
    dark.quad([SO[i][0], SO[i][1], S - 0.45], [SO[j][0], SO[j][1], S - 0.45], [SI[j][0], SI[j][1], S - 0.45], [SI[i][0], SI[i][1], S - 0.45]) // underside
  }
  const SR = oct(17.2)
  ofaces(pale, SR, S, SR, S + 1.0)
  ofaces(pale, [...SR].reverse(), S, [...SR].reverse(), S + 1.0) // the railing seen from inside
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * 2 * Math.PI + Math.PI / 16
    const rb = 4.85, rt = 8.3
    tube(pale, [rb * Math.cos(a), rb * Math.sin(a), 13.4], [rt * Math.cos(a), rt * Math.sin(a), S - 0.4], 0.25, 4)
  }

  // --- Upper octagon, dark, tapering to the cap.
  const U0 = oct(8.4), U1 = oct(6.0), ZU = 27.4
  ofaces(dark, U0, S, U1, ZU)
  for (const k of [2, 6]) onFace(win, U0, S, U1, ZU, k, 0.4, 21.6, 22.9)

  // --- Cap: a boat-shaped hood along the axle (model y), 8.4 long.
  {
    const hl = 4.0, hw = 3.3, zc = 30.8
    const prof: XY[] = [[hw, 0], [hw * 0.98, 1.6], [hw * 0.8, 3.0], [hw * 0.45, 4.0], [0, 4.4]] // (half-width, rise)
    const sec = (y: number, f: number) => prof.map(([w, h]) => [w * f, y, ZU + h * f * ((zc - ZU) / 4.4)] as V3)
    const ys = [-hl, -hl * 0.6, 0, hl * 0.6, hl], fs = [0.62, 0.93, 1, 0.93, 0.62]
    for (let i = 0; i < ys.length - 1; i++) {
      const A = sec(ys[i], fs[i]), Bq = sec(ys[i + 1], fs[i + 1])
      for (let k = 0; k < prof.length - 1; k++) {
        for (const sg of [1, -1]) {
          const m = (p: V3): V3 => [p[0] * sg, p[1], p[2]]
          if (sg > 0) roof.quad(m(A[k]), m(Bq[k]), m(Bq[k + 1]), m(A[k + 1]))
          else roof.quad(m(Bq[k]), m(A[k]), m(A[k + 1]), m(Bq[k + 1]))
        }
      }
    }
    // End boards, front and back.
    for (const [i, s] of [[0, -1], [ys.length - 1, 1]] as [number, number][]) {
      const A = sec(ys[i], fs[i])
      const ring: XY[] = [...A.map((p) => [p[0], p[2]] as XY), ...[...A].reverse().slice(1).map((p) => [-p[0], p[2]] as XY)]
      for (let k = 1; k < ring.length - 1; k++) {
        const P = (q: XY): V3 => [q[0], ys[i], q[1]]
        if (s > 0) roof.tri(P(ring[0]), P(ring[k]), P(ring[k + 1]))
        else roof.tri(P(ring[0]), P(ring[k + 1]), P(ring[k]))
      }
    }
    cap(roof, oct(6.0), ZU, false)
  }
  // The axle head out of the cap's front.
  const T = (8 * Math.PI) / 180, HUB: V3 = [0, -4.7, 29.0]
  tube(dark, [0, -3.4, 29.0 - 1.3 * Math.tan(T)], HUB, 0.55, 8, true)

  // --- Tail pole and braces down to the stage at the back (+y), with the winding wheel.
  tube(dark, [0, 3.9, 28.2], [0, 8.4, S + 1.4], 0.32, 6, true)
  for (const sx of [-1, 1]) tube(dark, [sx * 2.6, 2.6, 27.6], [0, 7.6, S + 3.0], 0.22, 4, true)
  {
    const c: V3 = [0, 8.45, S + 2.4], r = 1.4
    const pts = Array.from({ length: 10 }, (_, k) => [c[0] + r * Math.cos((k / 10) * 2 * Math.PI), c[1], c[2] + r * Math.sin((k / 10) * 2 * Math.PI)] as V3)
    for (let k = 0; k < 10; k++) tube(dark, pts[k], pts[(k + 1) % 10], 0.13, 4)
  }

  // --- Sails, in their own node about the hub: two stocks in an X with
  // Old Dutch lattice on the trailing side of each arm.
  const sails = new Part(), stocks = new Part()
  const d: V3 = [0, -Math.cos(T), Math.sin(T)] // axle direction, out of the front
  const e1: V3 = [1, 0, 0], e2: V3 = [0, Math.sin(T), Math.cos(T)] // the sail plane
  const R = 13.3
  const pt = (r: number, w: number, th: number, off = 0): V3 => {
    const u: V3 = [Math.cos(th) * e1[0] + Math.sin(th) * e2[0], Math.cos(th) * e1[1] + Math.sin(th) * e2[1], Math.cos(th) * e1[2] + Math.sin(th) * e2[2]]
    const v: V3 = [-Math.sin(th) * e1[0] + Math.cos(th) * e2[0], -Math.sin(th) * e1[1] + Math.cos(th) * e2[1], -Math.sin(th) * e1[2] + Math.cos(th) * e2[2]]
    return [u[0] * r + v[0] * w + d[0] * off, u[1] * r + v[1] * w + d[1] * off, u[2] * r + v[2] * w + d[2] * off]
  }
  for (let i = 0; i < 4; i++) {
    const th = Math.PI / 4 + (i * Math.PI) / 2
    tube(stocks, pt(0, 0, th, 0.2), pt(R, 0, th, 0.2), 0.3, 6, true)
    // The lattice: a leading lath, the trailing edge lath, and cross laths.
    const r0 = 2.4, r1 = R - 0.2, W = -2.1, Wl = 0.45
    tube(sails, pt(r0, W, th), pt(r1, W, th), 0.15, 4, true)
    tube(sails, pt(r0, Wl, th), pt(r1, Wl, th), 0.12, 4, true)
    for (let r = r0; r <= r1 + 0.01; r += (r1 - r0) / 7) tube(sails, pt(r, Wl, th), pt(r, W, th), 0.15, 4, true)
  }

  const root = [
    { part: brick, material: finish('gooyer-brick', 0x8a5848) },
    { part: grey, material: finish('gooyer-lower', 0x9a9187) },
    { part: dark, material: finish('gooyer-wood', 0x655d55) },
    { part: pale, material: finish('gooyer-white', 0xeeeae1) },
    { part: win, material: { ...PALETTE.window } },
    { part: roof, material: finish('gooyer-wood', 0x655d55) },
  ]
  // The cap shares the wood colour: merge it into one primitive.
  for (let i = 0; i < roof.pos.length; i++) dark.pos.push(roof.pos[i]), dark.nrm.push(roof.nrm[i]), dark.uv.push(roof.uv[i])
  root.pop()
  const node = {
    name: 'sails',
    translation: HUB,
    parts: [
      { part: stocks, material: finish('gooyer-wood', 0x655d55) },
      { part: sails, material: finish('gooyer-white', 0xeeeae1) },
    ],
  }
  return { root, node }
}

if (import.meta.main) {
  const id = 'amsterdam-de-gooyer'
  const { root, node } = build()
  const tris = [...root, ...node.parts].reduce((s, x) => s + x.part.triangles, 0)
  const names = new Set([...root, ...node.parts].map((x) => x.material.name))
  if (names.size > 6) throw new Error(`${id}: ${names.size} materials`)
  const glb = writeGlb('De Gooyer', root, { frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [52.366808, 4.926173], bearing: 45 }, { nodes: [node] })
  if (tris > 5000 || glb.length > 250_000) throw new Error(`${id}: budget exceeded: ${tris} triangles / ${glb.length} bytes`)
  const out = process.argv[2] ?? new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
