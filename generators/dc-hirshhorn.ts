/**
 * Hirshhorn Museum — procedural, CC0-1.0, no textures.
 * bun generators/dc-hirshhorn.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0°, the balcony window
 * facing due north to the Mall. The anchor is the area centroid of the OSM
 * outline relation/3374667 (lng -77.0229526, lat 38.888177), which is the
 * drum's centre to within 0.2 m.
 *
 * What it is: Gordon Bunshaft's hollow concrete drum (1974), about 70 m
 * across and 25 m tall, lifted off the plaza on four massive flared piers,
 * open to the sky in the middle round a courtyard. The outer wall is blank
 * pale aggregate concrete except for one long balcony window slot on the
 * Mall side; the courtyard wall is glazed floor by floor. At plaza level, a
 * glass lobby fills the space under the drum's south side. The drum, its
 * lift off the ground, the open middle and the single slot are the identity.
 * The sculpture garden, the plaza walls and the fountain are not modelled.
 *
 * Covers and replaces: relation/3374667 (the drum, outer way/66418857 tagged
 * as a building:part from 5 to 25 m, inner way/251495389 the courtyard), its
 * twin part relation/3374669, the four piers (way/251495385–388, h 5) and
 * the glass lobby (way/909145546, h 5). way/66418857 itself carries the
 * part's tags and is the relations' outer ring, so it is listed too.
 *
 * Evidence
 * - OSM (measured): drum outer ring r 35.1 m, courtyard r 17.8 m (area
 *   996 m²); drum from 5 to 25 m (min_height/height); the piers as
 *   diamonds about 9 m across centred 26.5 m out on the diagonals; the
 *   lobby between the two southern piers out to r 30.
 * - Published (Wikipedia, "Hirshhorn Museum and Sculpture Garden"): a
 *   cylinder 231 ft (70 m) across, 82 ft (25 m) tall, raised 14 ft on four
 *   piers; the courtyard 115 ft (35 m) across, of pink-tan precast concrete with aggregate.
 * - Photos (Wikimedia Commons): from the north (the Mall side), "Hirshhorn
 *   Museum DC 2007.jpg" (Gryffindor, public domain) and "Hirshhorn Museum
 *   (3452040774).jpg" (Francisco Anzola, CC BY 2.0); from the south,
 *   "Hirshhorn Museum (53830787787).jpg" (Ajay Suresh, CC BY 2.0, 2024);
 *   from the south-east, "Hirshhorn Museum (33515896074).jpg" (Gunnar
 *   Klack, CC BY-SA 2.0, 2014); under the drum, "Joseph H. Hirshhorn
 *   Museum.jpg" (Smash the Iron Cage, CC BY-SA 4.0).
 * - Estimated from the photos: the window slot spans ±26° about north and
 *   runs from 16.2 to 18.9 m, over a balcony whose solid parapet runs from
 *   15.0 to 16.2 m and stands 1.8 m out; the piers' flare; three glazed
 *   storeys on the courtyard side.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { arcWall, arcCap, qf, save } from './dc-white-house'
import { ngon } from './dc-smithsonian-castle'

const conc = new Part(), under = new Part(), roof = new Part(), win = new Part()

const R = 35.1, RI = 17.8, Z0 = 5.0, Z1 = 25.0, SEG = 48

// ---- The drum: outer wall, courtyard wall, roof, underside.
arcWall(conc, 0, 0, R, 0, 360, SEG, Z0, Z1, true)
arcWall(conc, 0, 0, RI, 0, 360, 32, Z0, Z1, false)
// A shallow parapet lip at the roof edge, then the roof.
arcCap(conc, 0, 0, R - 0.6, R, 0, 360, SEG, Z1, true)
arcWall(conc, 0, 0, R - 0.6, 0, 360, SEG, Z1 - 0.4, Z1, false)
arcWall(conc, 0, 0, RI + 0.6, 0, 360, 32, Z1 - 0.4, Z1, true)
arcCap(conc, 0, 0, RI, RI + 0.6, 0, 360, 32, Z1, true)
arcCap(roof, 0, 0, RI + 0.6, R - 0.6, 0, 360, SEG, Z1 - 0.4, true)
arcCap(under, 0, 0, RI, R, 0, 360, SEG, Z0, false)

// ---- The balcony slot on the Mall side: a long window over a balcony
// whose solid parapet stands out from the wall.
{
  const A0 = 90 - 26, A1 = 90 + 26, n = 12, RB = R + 1.8
  // Window: flat panels just off the wall, one per facet.
  for (let k = 0; k < n; k++) {
    const t0 = ((A0 + ((A1 - A0) * k) / n) * Math.PI) / 180, t1 = ((A0 + ((A1 - A0) * (k + 1)) / n) * Math.PI) / 180
    const r = R + 0.05
    const P = (t: number, z: number): V3 => [r * Math.cos(t), r * Math.sin(t), z]
    win.quad(P(t0, 16.2), P(t1, 16.2), P(t1, 18.9), P(t0, 18.9))
  }
  // Balcony: outer face, top, underside and ends.
  arcWall(conc, 0, 0, RB, A0 - 1.5, A1 + 1.5, n, 15.0, 16.2, true)
  arcCap(conc, 0, 0, R, RB, A0 - 1.5, A1 + 1.5, n, 16.2, true)
  arcCap(under, 0, 0, R, RB, A0 - 1.5, A1 + 1.5, n, 15.0, false)
  // The balcony's two ends, each facing away from the slot along the arc.
  for (const [a, dir] of [[A0 - 1.5, -1], [A1 + 1.5, 1]] as Array<[number, number]>) {
    const t = (a * Math.PI) / 180, c = Math.cos(t), sn = Math.sin(t)
    const p = (r: number, z: number): V3 => [r * c, r * sn, z]
    qf(conc, p(R, 15.0), p(RB, 15.0), p(RB, 16.2), p(R, 16.2), [-sn * dir, c * dir, 0])
  }
}

// ---- Courtyard side: three glazed storeys, a panel per facet, with the
// concrete floor edges showing between them.
for (let k = 0; k < 32; k++) {
  const t0 = ((k + 0.08) / 32) * 2 * Math.PI, t1 = ((k + 0.92) / 32) * 2 * Math.PI
  const r = RI - 0.05
  const P = (t: number, z: number): V3 => [r * Math.cos(t), r * Math.sin(t), z]
  for (const [z0, z1] of [[7.0, 10.6], [12.6, 16.6], [18.6, 22.8]]) win.quad(P(t1, z0), P(t0, z0), P(t0, z1), P(t1, z1))
}

// ---- Piers: four flared diamonds on the diagonals (OSM centres and
// extents), widening into the drum's underside.
for (const [cx, cy] of [[-18.7, -18.3], [19.9, 19.6], [19.5, -18.9], [-17.8, 19.4]] as Array<[number, number]>) {
  const ang = Math.atan2(cy, cx)
  const ring = (half: number, z: number) => ngon(cx, cy, half, 4, z, ang)
  conc.loft([ring(3.6, 0), ring(3.8, 1.6), ring(4.6, 3.2), ring(6.0, 4.4), ring(7.6, Z0)])
}

// ---- Glass lobby under the south side, between the southern piers
// (−128° … −52°), lit like the windows.
arcWall(win, 0, 0, 29.5, -128, -52, 10, 0, Z0, true)
arcWall(win, 0, 0, RI + 0.6, -128, -52, 8, 0, Z0, false)

console.log({ conc: conc.triangles, under: under.triangles, roof: roof.triangles, win: win.triangles })
await save('dc-hirshhorn', 'Hirshhorn Museum', [
  { part: conc, material: finish('hirshhorn-concrete', 0xddd0ba) },
  { part: under, material: finish('hirshhorn-soffit', 0xbdb2a0) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
], { bearing: 0, osm: 'relation/3374667', footprint: [70.2, 70.2], height: Z1 }, 5000)
