/**
 * Sparks Shot Tower (1808, Thomas Sparks, John Bishop and James Clement),
 * Carpenter Street between Front and 2nd, Queen Village, Philadelphia —
 * original procedural geometry, CC0-1.0.
 * bun generators/phl-shot-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM part way/705302160 (man_made=
 * tower, building:part, height 43), 39.934806,-75.146341. The tower is
 * round, so the catalog bearing is 0.
 *
 * Identity: a lone, plain, tapering round brick shaft, one of the first
 * shot towers in the United States, standing over the low Shot Tower
 * Recreation Center; the flared, bracketed green copper cornice that caps
 * it like a collar; the column of bricked-up window openings climbing the
 * shaft, getting smaller towards the top.
 *
 * Evidence:
 *  - plan: OSM part way/705302160, a 20-sided ring 7.4 m across (radius
 *    3.65-3.75 m about its centroid): the base, radius 3.7 m.
 *  - heights: lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown
 *    2015), 0.5 m grid, above the playground around the base (0.5 m over
 *    the box's ground_min): cap rim ~42.3, roof centre 43.6-43.9 m. OSM
 *    says 43 m; the published height is 142 ft (43.3 m; Wikipedia, PHMC
 *    marker). The lidar's top disc is ~7-7.5 m across, so the copper cap
 *    reaches out about as far as the base.
 *  - taper: estimated from Reading Tom's distant photo (little
 *    perspective): the shaft under the cap is ~0.75 of its width two
 *    thirds of the way down, giving a top diameter of ~5.0 m over the 7.4 m
 *    base; the cap is 1.32 times the top of the shaft (photo), 6.6-7 m.
 *  - cap: flared cornice ~1.6 m deep on corbel brackets, a short fascia and
 *    a low roof (photos; lidar roof centre ~1.4 m over the rim).
 *  - openings: eight bricked-up openings in each of four columns (N-gio's
 *    and Smallbones' photos show columns about a quarter turn apart; HABS
 *    shows a column of six above the recreation center roof), 4.6 m apart,
 *    narrowing from 1.5 × 1.7 m at the base to 1.0 × 1.0 m at the top.
 *    Their azimuths are estimated: drawn facing N, E, S and W.
 *  - colours, from the daylight photos: warm orange-red brick pulled to the
 *    palette's lightness (the same family as the neighbouring
 *    phl-independence-hall brick); the infill a darker, browner brick;
 *    the cap verdigris green (patina).
 *  - night: no floodlighting seen; drawn unlit.
 *
 * Photos (Wikimedia Commons): Sparks_Shot_Tower_129-131_Carpenter_St_
 * Philadelphia_PA_(DSC_3819).jpg (N-gio, CC BY-SA 4.0); Sparks_Shot_Tower1.
 * jpg and Sparks_Shot_Tower2.jpg (Jack E. Boucher, HABS/HAER, public domain);
 * Sparks_Sthot_Tower_Philly.JPG (Smallbones, CC0); Shot_Tower_-_Philadelphia_
 * (2642788206).jpg (Reading Tom, CC BY 2.0). USGS NAIP for the plan. No
 * commercial imagery.
 *
 * Left out: the brackets as separate pieces (the flare reads as one copper
 * collar), the iron straps and lightning conductor, the low glazed window
 * near the base, the attached recreation center (a separate OSM building).
 *
 * Doubts: the taper and the cap's profile are photo estimates; the
 * openings' azimuths and exact count per column are estimated.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe, save } from './chi-aon-center'
import { face } from './phl-independence-hall'

const SEG = 16
const R0 = 3.7, R1 = 2.5, TOP = 41.0
const r = (z: number) => R0 + (R1 - R0) * (z / TOP)

function build() {
  const brick = new Part(), infill = new Part(), cap = new Part(), shade = new Part()

  // The shaft, a straight taper; a few rings so the long faces stay short.
  const prof: [number, number][] = []
  for (let k = 0; k <= 8; k++) prof.push([r((TOP * k) / 8), (TOP * k) / 8])
  lathe(brick, 0, 0, prof, SEG)

  // The copper cap: a pale collar ring, the flared cornice on its brackets,
  // the fascia and the low roof.
  // The flare's underside is in shadow behind its brackets in every photo:
  // a dark cone with pale copper brackets standing on it.
  lathe(cap, 0, 0, [[R1 + 0.06, TOP - 0.45], [R1 + 0.1, TOP - 0.05]], SEG)
  lathe(shade, 0, 0, [[R1 + 0.1, TOP - 0.05], [3.0, TOP + 0.55], [3.55, TOP + 1.05]], SEG)
  lathe(cap, 0, 0, [[3.55, TOP + 1.05], [3.6, TOP + 1.1], [3.6, TOP + 1.65], [3.4, TOP + 1.72], [1.6, TOP + 2.45], [0, TOP + 2.7]], SEG)
  const NB = 24
  for (let k = 0; k < NB; k++) {
    const a = ((k + 0.5) / NB) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a), t = 0.16
    const P = (rr: number, z: number, side: number): V3 => [rr * c - side * t * s, rr * s + side * t * c, z]
    // A triangular corbel: inner edge down the shaft, top under the flare.
    const q = [[R1 + 0.08, TOP - 0.35], [R1 + 0.08, TOP + 0.05], [3.45, TOP + 1.0]] as [number, number][]
    face(cap, q.map(([rr, z]) => P(rr, z, 1)), [-s, c, 0])
    face(cap, q.map(([rr, z]) => P(rr, z, -1)), [s, -c, 0])
    face(cap, [P(q[0][0], q[0][1], -1), P(q[2][0], q[2][1], -1), P(q[2][0], q[2][1], 1), P(q[0][0], q[0][1], 1)], [c, s, -0.6])
  }

  // Bricked-up openings: curved panels just proud of the shaft, in four
  // columns of eight.
  const n = 8
  for (let col = 0; col < 4; col++) {
    const a = (col * Math.PI) / 2 + Math.PI / 2 // N, W, S, E
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1)
      const zc = 4.2 + i * 4.6
      const w = 1.5 - 0.5 * t, h = 1.7 - 0.7 * t
      const z0 = zc - h / 2, z1 = zc + h / 2
      const steps = 3
      for (let s = 0; s < steps; s++) {
        const p0 = a - w / 2 / r(zc) + (s / steps) * (w / r(zc)), p1 = a - w / 2 / r(zc) + ((s + 1) / steps) * (w / r(zc))
        const P = (p: number, z: number): V3 => [(r(z) + 0.05) * Math.cos(p), (r(z) + 0.05) * Math.sin(p), z]
        infill.quad(P(p0, z0), P(p1, z0), P(p1, z1), P(p0, z1))
      }
    }
  }

  return [
    { part: brick, material: finish('shot-brick', 0xa9614b) },
    { part: infill, material: finish('shot-infill', 0x84503f) },
    { part: cap, material: PALETTE.patina },
    { part: shade, material: finish('shot-cap-shadow', 0x46594f) },
  ]
}

if (import.meta.main) await save('phl-shot-tower', 'Sparks Shot Tower', [39.934806, -75.146341], 0, build())
