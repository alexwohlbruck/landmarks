/**
 * Astrodome, Houston (1965, Lloyd & Morgan with Wilson, Morris, Crain &
 * Anderson; closed since 2008): the world's first domed stadium, as it
 * stands now. Procedural, CC0-1.0, no textures.
 * bun generators/hou-astrodome.ts
 *
 * What makes it read as itself: the low lamella dome, white with its
 * skylight panels and cut by twelve dark radial wedges that meet at the
 * flat cupola on the crown; the plain grey ring of solid roof below the
 * skylights; the flat ledge round the top of the drum; and the drum itself,
 * a pale wall of precast diamond-pattern screen (shown as one pale surface)
 * between tall white pilasters, under a dark band at the top whose lower
 * edge sags between the pilasters. The four 1989 ramp towers are not
 * modelled: three were demolished in December 2013 (Wikipedia, "Astrodome"),
 * and the 2014 and 2017 photos below show none standing. The interior was
 * cleared in 2013-14; the roof covers it, so nothing inside is modelled. The
 * field and the ground are the map's.
 *
 * Frame: x east, y north, z up, metres (written as glTF +Y up, -Z north).
 * Bearing 0 (the dome is round). The anchor is the area centroid of OSM
 * way/119420928 (-95.407742, 29.684871), which is also the centre of the
 * dome in the lidar (the drum edge is at r = 108-109 m in every direction).
 *
 * Ground and elevation: z = 0 is the floor of the bowl, the old playing
 * field, which is published as 25 ft (7.6 m) below street level
 * (Wikipedia, "Astrodome", citing 1965 sources: "the ceiling is 208 feet
 * above the playing surface, which itself sits 25 feet below street
 * level"). The catalog elevation is therefore -7.6. Lidar agrees: the crown
 * stands 58.9 m above the street outside, and 58.9 + 7.6 = 66.5 m against
 * OSM's height=66.4 and the published 208 ft (63.4 m) ceiling plus the roof's
 * depth. Street level is STREET = 7.6 m in this frame; below it the drum is
 * hidden by the terrain.
 *
 * Measured, USGS 3DEP lidar TX_Coastal_B1_2018 (2018 flight), 1 m grid,
 * along rays every 15-30 degrees (they agree within a metre): street
 * 4.5-5.5 m above the box's ground_min (10.5 m; taken as 4.8); the drum's
 * top ledge flat at 32-33 m above ground_min from r = 100 to 108.5 m; the
 * dome 33.5 m at r = 100, 43 at 88, 52 at 60, 57.5 at 40, 60.7 at 20, a
 * step at r = 11 up to the cupola, 63.7 m at the crown. Field-relative
 * (+2.8 m): ledge 35.6, crown 66.5. A sphere through z = 36.3 at r = 100 and
 * 64.3 at r = 0 (R = 192.6 m) fits every ring within 0.5 m.
 * Measured, USGS NAIP orthophoto: the drum 217 m across (OSM 216-217 m),
 * the white skylight field to r = 83 m, the grey solid ring outside it,
 * twelve dark radial lines 30 degrees apart (sampled round three rings:
 * 0, 30, 60, 93, 243, 271, 299, 327, 357 degrees; the rest in shadow), the
 * cupola about 21 m across.
 *
 * Photos (Wikimedia Commons), compared against the renders:
 * - p13 "NRG Stadium, Houston, Texas, United States.jpg", U.S. Customs and
 *   Border Protection (cbp.gov), public domain, 2017 aerial from the
 *   north-west: the skylight field in concentric rows, the twelve wedges
 *   widening outward, the cupola, the grey ring, the ledge, the dark band
 *   with its sagging lower edge, the pilasters; no ramp towers;
 * - p1 "Reliant Astrodome in January 2014.jpg", EricEnfermero, CC BY-SA 3.0,
 *   from the south: towers gone, the dome's profile, the band;
 * - p9 "ReliantAstrodomeClosup.JPG", WhisperToMe, public domain: the east
 *   entrance, the band glazed in dark panels, the screen's scalloped top;
 * - p3 "EAST ELEVATION, LOOKING WEST", p4 "NORTH ELEVATION, LOOKING SOUTH",
 *   p6 "DETAIL OF NORTH FACADE. NOTE PRE-CAST CONCRETE SCREEN..." and p7
 *   "ASTRODOME LOOKING EAST FROM ROOFTOP OF ADJACENT RELIANT STADIUM", Jet
 *   Lowe, HAER TX-108 (Library of Congress), public domain, c. 2004: the
 *   screen, the pilasters, the proportions (the ramp towers in them are
 *   gone now);
 * - p2 "Reliant Astrodome (3436391630).jpg", Mark Hodgins, CC BY 2.0;
 *   p8 "The Astrodome, aerial view.jpg", Carol M. Highsmith, public domain.
 *
 * Estimated: 48 pilasters (counted over half the drum in p13 and p1), 1.4 m
 * wide and 1 m proud; the dark band from 6 m below the ledge, sagging 1.6 m
 * mid-bay (p13, p9); the wedges 6 m wide at the skylight field's edge,
 * closing to a point at the cupola (p13); the cupola 1.8 m proud of the
 * shell (lidar step). The screen colour is the precast's pale grey from p1
 * and p9; the band is a dark slate, not `window`, since the building is
 * closed and unlit at night.
 *
 * Left out: the low structures at the old tower sites (OSM way/626284515,
 * 626284522, 626284543, 1-4 m high in lidar), the entrance canopies and
 * doors at street level, lettering, the interior.
 *
 * Doubt: the 2018 lidar's ground round the drum and Mapterhorn both read
 * the street, not the bowl, so the map sinks the model 7.6 m into terrain
 * drawn at street level over the old field; only what stands above the
 * street shows, which is the real view.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const STREET = 7.6 // field to street, published 25 ft
const LEDGE = 35.6 // drum top, lidar
const RW = 108.5 // drum wall radius, OSM and lidar
const RD = 100 // dome springing
const SPH = 192.6 // dome sphere radius
const CROWN = 64.3 // shell at r = 0
const RL = 83 // skylight field edge, NAIP
const RC = 11 // cupola radius
const CUP = 66.5 // cupola top, lidar
const N = 96 // segments round the drum
const PIL = 48 // pilasters
const BAND = 6 // dark band depth below the ledge
const SAG = 1.6

const screen = new Part(), trim = new Part(), roof = new Part(), lattice = new Part(), band = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => {
  const l = Math.hypot(...a) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}
/** A quad wound to face `hint`, with per-corner normals if given (smooth), else flat. */
function quad(p: Part, P: V3[], hint: V3, ns?: V3[]) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const o = dot(f, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const n = ns ? o.map((i) => unit(ns[i])) : undefined
  const tri = (a: number, b: number, c: number) => {
    const A = P[o[a]], B = P[o[b]], C = P[o[c]]
    if (Math.hypot(...cross(sub(B, A), sub(C, A))) < 1e-9) return
    p.tri(A, B, C, undefined, undefined, undefined, n && [n[a], n[b], n[c]])
  }
  tri(0, 1, 2)
  tri(0, 2, 3)
}
const ang = (i: number, n = N) => (i / n) * 2 * Math.PI
const polar = (t: number, r: number, z: number): V3 => [Math.sin(t) * r, Math.cos(t) * r, z]
const radial = (t: number): V3 => [Math.sin(t), Math.cos(t), 0]

/** Dome shell height at radius r. */
const shell = (r: number) => CROWN - SPH + Math.sqrt(SPH * SPH - r * r)
/** Outward normal of the shell at (t, r). */
const shellN = (t: number, r: number): V3 => unit([Math.sin(t) * r, Math.cos(t) * r, shell(r) - (CROWN - SPH)])

// ---------------------------------------------------------------------------
// The drum: the screen wall from the field to the band, the band to the
// ledge, the ledge ring out to the dome's springing.
{
  const bandLow = (t: number) => {
    // Lower edge of the band: highest at the pilasters, sagging mid-bay.
    const bay = (t / (2 * Math.PI)) * PIL
    const f = bay - Math.floor(bay)
    return LEDGE - BAND - SAG * Math.sin(Math.PI * f)
  }
  for (let i = 0; i < N; i++) {
    const t0 = ang(i), t1 = ang(i + 1), tm = (t0 + t1) / 2
    const n0 = radial(t0), n1 = radial(t1)
    const z0 = bandLow(t0), z1 = bandLow(t1)
    quad(screen, [polar(t0, RW, 0), polar(t1, RW, 0), polar(t1, RW, z1), polar(t0, RW, z0)], radial(tm), [n0, n1, n1, n0])
    quad(band, [polar(t0, RW, z0), polar(t1, RW, z1), polar(t1, RW, LEDGE - 0.6), polar(t0, RW, LEDGE - 0.6)], radial(tm), [n0, n1, n1, n0])
    // The ledge: a 0.6 m fascia and the flat ring in to the dome.
    quad(trim, [polar(t0, RW, LEDGE - 0.6), polar(t1, RW, LEDGE - 0.6), polar(t1, RW + 0.3, LEDGE), polar(t0, RW + 0.3, LEDGE)], radial(tm))
    quad(screen, [polar(t0, RW + 0.3, LEDGE), polar(t1, RW + 0.3, LEDGE), polar(t1, RD, LEDGE), polar(t0, RD, LEDGE)], [0, 0, 1])
  }
  // Pilasters: full height, standing 1 m proud, their tops level with the ledge.
  for (let k = 0; k < PIL; k++) {
    const t = ang(k, PIL), r = radial(t), s: V3 = [Math.cos(t), -Math.sin(t), 0]
    const w = 0.7, d0 = RW - 0.2, d1 = RW + 1.0, top = LEDGE + 0.4
    const P = (side: number, d: number, z: number): V3 => [r[0] * d + s[0] * side * w, r[1] * d + s[1] * side * w, z]
    quad(trim, [P(-1, d1, 0), P(1, d1, 0), P(1, d1, top), P(-1, d1, top)], r)
    quad(trim, [P(1, d0, 0), P(1, d1, 0), P(1, d1, top), P(1, d0, top)], s)
    quad(trim, [P(-1, d0, 0), P(-1, d1, 0), P(-1, d1, top), P(-1, d0, top)], [-s[0], -s[1], 0])
    quad(trim, [P(-1, d0, top), P(1, d0, top), P(1, d1, top), P(-1, d1, top)], [0, 0, 1])
  }
}

// ---------------------------------------------------------------------------
// The dome: a smooth spherical cap from the springing to the cupola, grey.
// The skylight field lies on it as twelve white gores, the wedges between
// them showing the grey shell.
{
  const rings = [RD, 96, 90, RL, 72, 60, 48, 36, 24, RC]
  const zAt = (r: number) => (r === RD ? LEDGE : shell(r))
  // A short upturn from the ledge to the shell, then the cap.
  for (let j = 0; j < rings.length - 1; j++) {
    const ra = rings[j], rb = rings[j + 1]
    for (let i = 0; i < N; i++) {
      const t0 = ang(i), t1 = ang(i + 1)
      const na = j === 0 ? shellN(t0, ra) : shellN(t0, ra), nb = shellN(t0, rb)
      const ma = shellN(t1, ra), mb = shellN(t1, rb)
      quad(roof, [polar(t0, ra, zAt(ra)), polar(t1, ra, zAt(ra)), polar(t1, rb, zAt(rb)), polar(t0, rb, zAt(rb))], [0, 0, 1], [na, ma, mb, nb])
    }
  }
  // The skylight gores: 12 sectors, centred between the wedges.
  const WEDGE = 6 // wedge width at RL, closing to 0 at the cupola
  const ROWS = [RL, 72, 60, 48, 36, 24, RC]
  const SUB = 6
  const LIFT = 0.25
  for (let g = 0; g < 12; g++) {
    const c = ang(g, 12) + Math.PI / 12 // wedges sit on 0, 30, 60 ... degrees
    const half = (r: number) => Math.PI / 12 - ((WEDGE / 2) * ((r - RC) / (RL - RC))) / r
    for (let j = 0; j < ROWS.length - 1; j++) {
      const ra = ROWS[j], rb = ROWS[j + 1]
      for (let s = 0; s < SUB; s++) {
        const u0 = -1 + (2 * s) / SUB, u1 = -1 + (2 * (s + 1)) / SUB
        const pt = (r: number, u: number): V3 => {
          const t = c + u * half(r), n = shellN(t, r), p = polar(t, r, shell(r))
          return [p[0] + n[0] * LIFT, p[1] + n[1] * LIFT, p[2] + n[2] * LIFT]
        }
        const nn = (r: number, u: number) => shellN(c + u * half(r), r)
        quad(lattice, [pt(ra, u0), pt(ra, u1), pt(rb, u1), pt(rb, u0)], [0, 0, 1], [nn(ra, u0), nn(ra, u1), nn(rb, u1), nn(rb, u0)])
      }
    }
  }
  // The cupola: a flat disc on a short drum, 16-sided as in p13.
  const CN = 16, zb = shell(RC)
  for (let i = 0; i < CN; i++) {
    const t0 = ang(i, CN), t1 = ang(i + 1, CN)
    quad(trim, [polar(t0, RC, zb - 0.3), polar(t1, RC, zb - 0.3), polar(t1, RC, CUP), polar(t0, RC, CUP)], radial((t0 + t1) / 2))
    roof.tri(polar(t0, RC, CUP), polar(t1, RC, CUP), [0, 0, CUP + 0.4], undefined, undefined, undefined, [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
  }
}

const parts = [
  { part: screen, material: finish('astrodome-screen', 0xdedbd3) },
  { part: trim, material: PALETTE.trim },
  { part: band, material: finish('astrodome-band', 0x5b636c) },
  { part: roof, material: finish('astrodome-roof', 0x9a9f9f) },
  { part: lattice, material: finish('astrodome-skylights', 0xe9e9e4) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(22), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Astrodome', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: -STREET, anchor: [29.684871, -95.407742], height: CUP + 0.4,
  frame: 'Y up, -Z north, +X east, metres; origin at the old field level under the anchor',
  replaces: ['way/119420928'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/hou-astrodome.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
