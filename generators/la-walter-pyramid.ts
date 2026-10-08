/**
 * Walter Pyramid (LBS Financial Credit Union Pyramid), California State
 * University Long Beach (1994, Donald Gibbs / HOK Sport) — procedural,
 * CC0-1.0.
 * bun generators/la-walter-pyramid.ts
 *
 * Map frame: x and y along the pyramid's sides, z up, metres. Placed at
 * bearing 353° (the sides of OSM way/35452138 run 7° anticlockwise of the
 * compass). Anchor at the centre of the square, which is the apex in the
 * lidar. y = 0 is the campus ground round the building (lidar 5.1 m,
 * which is also the 3DEP ground there).
 *
 * What makes it the Walter Pyramid: a true square pyramid, about 45°, in
 * a cobalt-blue metal skin, its apex a clean point; the skin stops a storey
 * or two above the ground, so the whole pyramid seems to hover over a dark
 * recessed base; and a bridge to an entrance at the middle of each side.
 *
 * Sources:
 * - Plan: OSM way/35452138 (the square, its bearing, 353°). USGS NAIP
 *   orthophoto (the eave square, 96-97 m across on the side clear of
 *   shadow, and the four entrance bridges, one on each side's axis).
 * - Heights (LA County 2020 lidar surface model, 0.5-3 m grids over the
 *   apex, along both axes, and over each bridge, above the 5.1 m ground):
 *   apex 54.4 m (OSM's height, 54.4 m, is the same LA County figure); the
 *   skin's lower edge 8.0 m above the ground, at 47.0-48.5 m from the
 *   centre on all four sides (so 95.5-96.5 m square; OSM's and the county
 *   footprint's 104 m square take in the base and its moat); faces at
 *   0.97 rise per run (44°), straight to the apex; the four bridge decks
 *   3.7 m up, 13-15 m wide, reaching about 15 m out from the eave, then
 *   stepping down; a sunken moat round the base at ground level between
 *   them.
 * - Published: 18 storeys; the blue skin is anodised aluminium on a space
 *   frame (Wikipedia, "Walter Pyramid"; CSULB Athletics).
 * - Photos (Wikimedia Commons): "Walter Pyramid.jpg" (Summum, CC BY-SA
 *   2.5; one face square on, a bridge's red-railed stair at the left
 *   corner), "Csulb-pyr1.jpg" and "Csulb-pyr3.jpg" (Buchanan-Hermit,
 *   attribution; a corner, two faces, the skin's edge over the dark base
 *   and its struts), "Longbeach pyramid.jpg" (Masonbarge, public domain;
 *   a face from across the parking, overcast). The pyramid is the same on
 *   every side, so each photo stands for any side.
 * - Colour: the skin from the photos in sun and shade (cobalt, #3a5fc0 in
 *   shade, sheened lavender-blue in sun; NAIP roof #5b85b8), pulled to the
 *   palette's lightness and kept clearly blue.
 * - Estimated: the base wall under the skin, set 3.75 m in (photos show a
 *   deep shadowed recess; no lidar reaches under the skin); the entrance
 *   doors' size; the bridges' outer steps, drawn as one sloped flight.
 * - Left out: the skin's corrugation (fine stripes), the diagonal struts
 *   from the skin's edge to the ground (thin at map scale; the recess reads
 *   dark without them), railings, and the separate Pyramid Annex
 *   (way/35568048), which the map draws.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const skin = new Part(), soffit = new Part(), base = new Part()
const deck = new Part(), door = new Part(), hip = new Part()

const APEX = 54.4
const EAVE_Z = 8.0, EAVE = 47.75 // the skin's lower edge: height, half-width
const RUN = (APEX - EAVE_Z) / EAVE // rise per run, 0.97
const FASCIA = 0.7 // the skin's edge, a short vertical band
const BASE = 44 // base wall half-width under the skin
const BRIDGE_Z = 3.7, BRIDGE_W = 7, BRIDGE_OUT = 62.5, STEP_OUT = 69

/** Rotate a point by k quarter turns about z. */
const rot = (p: V3, k: number): V3 => {
  let [x, y, z] = p
  for (let i = 0; i < k; i++) [x, y] = [-y, x]
  return [x, y, z]
}
/** A quad turned to each of the four sides. */
const quad4 = (p: Part, a: V3, b: V3, c: V3, d: V3) => {
  for (let k = 0; k < 4; k++) p.quad(rot(a, k), rot(b, k), rot(c, k), rot(d, k))
}

// The skin. Each face is a triangle from the eave to the apex, with a small
// chamfer where the face meets the fascia, so the edge catches the light.
// Faces are built on the south side (y < 0) and turned round.
{
  const ch = 0.5 // chamfer, inward along the face
  const zTop = EAVE_Z + FASCIA
  const e = EAVE - ch / Math.SQRT2, ez = zTop + (ch / Math.SQRT2) * RUN
  for (let k = 0; k < 4; k++) {
    const A: V3 = [-e, -e, ez], B: V3 = [e, -e, ez], T: V3 = [0, 0, APEX]
    skin.tri(rot(A, k), rot(B, k), rot(T, k))
    // chamfer
    skin.quad(rot([-EAVE, -EAVE, zTop - 0.15], k), rot([EAVE, -EAVE, zTop - 0.15], k), rot(B, k), rot(A, k))
    // fascia
    skin.quad(rot([-EAVE, -EAVE, EAVE_Z], k), rot([EAVE, -EAVE, EAVE_Z], k), rot([EAVE, -EAVE, zTop - 0.15], k), rot([-EAVE, -EAVE, zTop - 0.15], k))
  }
  // The hips: a light raised cap down each of the four edges, as the
  // photos show them (a pale line where the skin turns the corner). Under
  // the map's flat light two faces of a pyramid shade almost alike, so
  // without these it reads from above as a flat blue square. Each cap is
  // two flanks on the faces either side, 1.8 m wide at the eave and
  // closing to the apex, raised 0.3 m along the hip.
  const s = 1.8, r = 0.3
  const T: V3 = [0, 0, APEX + 0.05]
  const nh = (() => { const v: V3 = [-RUN, -RUN, 2]; const l = Math.hypot(...v); return v.map(c => c / l) as V3 })()
  const out = (a: V3, b: V3, c: V3, dir: V3) => {
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    return n[0] * dir[0] + n[1] * dir[1] + n[2] * dir[2] >= 0
  }
  const triOut = (p: Part, a: V3, b: V3, c: V3, dir: V3) => out(a, b, c, dir) ? p.tri(a, b, c) : p.tri(a, c, b)
  for (let k = 0; k < 4; k++) {
    const A: V3 = [-e, -e, ez]
    const Cs: V3 = [-e + s, -e, ez], Cw: V3 = [-e, -e + s, ez]
    const Ch: V3 = [A[0] + nh[0] * r, A[1] + nh[1] * r, A[2] + nh[2] * r]
    triOut(hip, rot(Cs, k), rot(Ch, k), rot(T, k), rot([0, -RUN, 1], k))
    triOut(hip, rot(Ch, k), rot(Cw, k), rot(T, k), rot([-RUN, 0, 1], k))
    triOut(hip, rot(Cs, k), rot(Cw, k), rot(Ch, k), rot([-1, -1, -0.2], k))
  }
  // Soffit: the underside of the skin, flat from the eave in to the base wall.
  quad4(soffit, [-EAVE, -EAVE, EAVE_Z], [-BASE, -BASE, EAVE_Z], [BASE, -BASE, EAVE_Z], [EAVE, -EAVE, EAVE_Z])
}

// The base: a dark recessed wall all round under the skin.
quad4(base, [-BASE, -BASE, 0], [BASE, -BASE, 0], [BASE, -BASE, EAVE_Z], [-BASE, -BASE, EAVE_Z])

// Bridges, one on each side's axis, from the base wall out across the moat
// to the plaza, then a flight down to the ground. Solid blocks.
for (let k = 0; k < 4; k++) {
  const w = BRIDGE_W, y0 = -BASE, y1 = -BRIDGE_OUT, y2 = -STEP_OUT, z = BRIDGE_Z, b = 0.3
  const P = (x: number, y: number, zz: number): V3 => rot([x, y, zz], k)
  // deck top, with a bevelled outer rim
  deck.quad(P(-w + b, y1 + b, z), P(w - b, y1 + b, z), P(w - b, y0, z), P(-w + b, y0, z))
  deck.quad(P(-w, y1, z - b), P(-w + b, y1 + b, z), P(-w + b, y0, z), P(-w, y0, z - b))
  deck.quad(P(w - b, y1 + b, z), P(w, y1, z - b), P(w, y0, z - b), P(w - b, y0, z))
  // sides
  deck.quad(P(-w, y0, 0), P(-w, y1, 0), P(-w, y1, z - b), P(-w, y0, z - b))
  deck.quad(P(w, y1, 0), P(w, y0, 0), P(w, y0, z - b), P(w, y1, z - b))
  // the flight down: a sloped top and two triangular sides
  deck.quad(P(-w, y1, z - b), P(w, y1, z - b), P(w - b, y1 + b, z), P(-w + b, y1 + b, z))
  deck.quad(P(-w, y2, 0), P(w, y2, 0), P(w, y1, z - b), P(-w, y1, z - b))
  deck.tri(P(-w, y1, 0), P(-w, y2, 0), P(-w, y1, z - b))
  deck.tri(P(w, y2, 0), P(w, y1, 0), P(w, y1, z - b))
  // entrance doors on the base wall at deck level
  const dw = 5.5, d = 0.05
  door.quad(P(-dw, y0 - d, z), P(dw, y0 - d, z), P(dw, y0 - d, EAVE_Z - 1.2), P(-dw, y0 - d, EAVE_Z - 1.2))
}

// Palette. The skin is the identity: cobalt anodised aluminium, pulled to
// the palette's lightness and still plainly blue. The recess under it is
// the concourse glazing, `window`, and reads dark as it does in shadow.
const parts = [
  { part: skin, material: finish('pyramid-blue', 0x5b82c9, 0.6) },
  { part: soffit, material: PALETTE.roof },
  { part: hip, material: PALETTE.trim },
  { part: base, material: PALETTE.window },
  { part: deck, material: PALETTE.stone },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(14), part.triangles)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Walter Pyramid', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 353, osm: 'way/35452138',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/la-walter-pyramid.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
