/**
 * Biblioteca Central, UNAM (1950–56, Juan O'Gorman with Gustavo Saavedra
 * and Juan Martínez de Velasco; murals by O'Gorman), Ciudad Universitaria,
 * Mexico City — original procedural geometry, CC0-1.0, no textures.
 *   bun generators/mexico-city-unam-central-library.ts
 *
 * Map frame: x east, y north, z up, metres; the model is square to the
 * building, whose walls run at 84° / 174°, so the catalog bearing is 354.
 * Anchor = centroid of the OSM outline way/437171951 (19.33340, -99.187331).
 *
 * Identity: the windowless book tower covered on all four faces by
 * O'Gorman's stone mosaics — the pre-Hispanic past on the north, the
 * colonial past on the south with its two great medallions, the modern
 * world with the atom on the east, the university's shield on the west —
 * over a glazed strip, on a wide low base of onyx panels and glass under
 * a red roof.
 *
 * The murals may not be textured: each face is drawn as a few broad flat
 * zones of its dominant colours, read from the evidence photos below: a red-brown
 * ground (the tower's own wall), blue-grey fields, cream figures, discs
 * and ribbons. Not a dot grid; the drawing itself is left out.
 *   North: mostly blue-grey, red-brown upper left, foot and right edge; the
 *     cream disc-platform at the top, the cream sun below, cream figures.
 *   South: red-brown; the two blue-grey medallions in cream rings, the
 *     cream ribbons down the centre, sun and moon-face at the top corners.
 *   East: red-brown; the cream atom (ring and nucleus), blue-grey sky above,
 *     the cream "Revolución" banner and figures below.
 *   West: red-brown; the cream shield, the two roundels above, a blue-grey
 *     and a cream zone low down.
 *
 * Evidence
 * - OSM: way/437171951 (outline = base, 66.9 × 35 m, height 50, 14
 *   levels; part way/1173176556 levels 1–2, glass, roof indianred);
 *   tower way/1173176557 (43.3 × 16.9 m, levels 3–13, stone, windowless,
 *   flush with the base's north edge); glazed storey way/1173176555;
 *   rooftop block way/1173176558 (14.3 × 4.6 m).
 * - Heights (estimated; OSM's 50 m includes masts): the mosaic 27.5 m
 *   tall, from the south face's 43.3 m width on Andrea Juárez's and Armando
 *   Olivo's near-frontal views (l13, l16; 1.57 : 1); the glazed strip
 *   2.6 m and the base 8.6 m (glass ground floor 3.8 m, onyx floor to
 *   7.8 m, roof edge), from the same photos and Lachaume's l05 (review
 *   round 1 lowered them from 3.6 and 10.4 m). Top of tower 38.7 m, rooftop
 *   block 43.3 m.
 * - Terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s); the
 *   campus esplanade is near flat around the library. Not checked.
 * - Photos (Wikimedia Commons; EVIDENCE):
 *   l04–l06 Régis Lachaume, "CU-Mexico-biblioteca-1/2/3.jpg", public
 *     domain, 2006 (south and east faces, the base, the stone wall);
 *   l07 Esparta Palma, "Biblioteca Central de la UNAM.jpg", CC BY 2.0,
 *     2009 (night: lit onyx base, floodlit murals);
 *   l08 ProtoplasmaKid, "Biblioteca Central de la UNAM - 5.jpg", CC BY-SA
 *     4.0, 2011 (the base, its glazing and stone relief);
 *   l09 Ritmodelalluvia, "Biblioteca Central UNAM Campus CU.jpg", CC0, 2026;
 *   l10 ProtoplasmaKid, "Remate de la Biblioteca Central de la UNAM 01.jpg",
 *     CC BY-SA 4.0, 2025 (the rooftop block and the red roof).
 *   l11 Armineaghayan, "Biblioteca Central de la UNAM, ArmAg.JPG", CC BY-SA
 *     4.0, 2015 (north and west faces);
 *   l12 Muñoz LC, "Biblioteca Central, UNAM.JPG", CC BY-SA 4.0, 2015 (east
 *     and north faces, the onyx base);
 *   l13 Andrea Juárez, "Biblioteca Central de la UNAM - 2019.jpg", CC BY-SA
 *     4.0 (west and south faces);
 *   l16 Armando Olivo Martín del Campo, "Biblioteca Central de la
 *     Universidad Nacional Autónoma de México.jpg", CC BY-SA 4.0, 2019
 *     (west and south faces);
 *   l14 Luis Alvaz, "Biblioteca central de la UNAM al amanecer 07.jpg",
 *     CC BY-SA 4.0 (the onyx panels lit at night).
 *   Every face's zones rest on these: north l04, l11, l12; south l05, l06,
 *   l13, l16; east l05, l06, l12; west l11, l13, l16.
 * - Look-only: "Imágenes aéreas de la Biblioteca Central de la UNAM 1–4.jpg"
 *   (Commons, uploader "Juan O'Gormann", stated CC BY 4.0 but dated
 *   1951–5x and credited to the architect, so almost certainly
 *   mis-attributed): frontal drone views of all four faces, used only to
 *   check zones the evidence photos already show.
 * Colours: mosaic red-brown pulled from ~#7a4535 to #a3654f, blue-grey
 *   #7b848d, cream #e9dcc0;
 *   onyx panels amber (`window-2`, they glow at night), glazing `window`.
 * Night: onyx and glazing glow; the mural faces carry `_FLOODLIGHT`.
 * Left out: the stone relief walls south of the base (outside the OSM
 *   outline; dropped in review round 1, as l13 shows the base's west end
 *   glazed), the fountain, mosaic friezes on
 *   the base, the few slit windows in the tower, masts.
 * Doubts: all heights are photo-scaled; mural zones are an abstraction.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, chamfer, rect, save, walls, type XY } from './chi-aon-center'
import { quad } from './dc-nationals-park'

export const ANCHOR: [number, number] = [-99.187331, 19.3334]
export const BEARING = 354

/** A tower face: origin corner, unit direction along the face (left to right seen from outside), outward normal. */
type Face = { o: V3; u: V3; n: V3; W: number; z0: number; H: number }

/** A flat convex polygon (face fractions u, v in 0..1) laid `off` metres proud of a face. */
function poly(p: Part, f: Face, pts: [number, number][], off = 0.06) {
  const P = ([u, v]: [number, number]): V3 => [f.o[0] + f.u[0] * u * f.W + f.n[0] * off, f.o[1] + f.u[1] * u * f.W + f.n[1] * off, f.z0 + v * f.H]
  const Q = pts.map(P)
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}
const rectF = (u0: number, v0: number, u1: number, v1: number): [number, number][] => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]
/** A disc (or ellipse) of radius r metres at face fractions (u, v). */
function disc(p: Part, f: Face, u: number, v: number, r: number, off = 0.06, ry = r, seg = 16) {
  poly(p, f, Array.from({ length: seg }, (_, i) => {
    const a = (i / seg) * 2 * Math.PI
    return [u + (Math.cos(a) * r) / f.W, v + (Math.sin(a) * ry) / f.H] as [number, number]
  }), off)
}
/** A ring between radii r0 and r1 at (u, v). */
function ring(p: Part, f: Face, u: number, v: number, r0: number, r1: number, off = 0.08, seg = 16) {
  const P = (r: number, a: number): V3 => {
    const uu = u + (Math.cos(a) * r) / f.W, vv = v + (Math.sin(a) * r) / f.H
    return [f.o[0] + f.u[0] * uu * f.W + f.n[0] * off, f.o[1] + f.u[1] * uu * f.W + f.n[1] * off, f.z0 + vv * f.H]
  }
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * 2 * Math.PI, b = ((i + 1) / seg) * 2 * Math.PI
    p.quad(P(r0, a), P(r1, a), P(r1, b), P(r0, b))
  }
}

function build() {
  const red = new Part(), blue = new Part(), cream = new Part(), concrete = new Part(), glass = new Part(), onyx = new Part()

  // --- The base (OSM way/437171951, 66.9 × 35 m): a recessed glazed ground
  // floor under a white slab, the upper floor walled in onyx panels
  // between white piers, a white roof edge and the red roof.
  const BASE = chamfer(rect(-33.45, -17.5, 33.45, 17.5), 0.5)
  const GROUND = chamfer(rect(-32.2, -16.25, 32.2, 16.25), 0.5)
  walls(glass, GROUND, 0, 3.8)
  walls(concrete, BASE, 3.8, 4.5) // the first-floor slab edge
  cap(concrete, BASE, 3.8, false)
  cap(concrete, BASE, 4.5)
  // upper floor: onyx panels in bays between white piers, set 0.3 m back
  const UP = chamfer(rect(-33.15, -17.2, 33.15, 17.2), 0.4)
  walls(onyx, UP, 4.5, 7.8)
  const pier = (x: number, y: number, dx: number, dy: number) => {
    const r: XY[] = rect(x - dx, y - dy, x + dx, y + dy)
    walls(concrete, r, 4.5, 7.8)
  }
  for (let i = 0; i <= 10; i++) { const x = -33.15 + 0.3 + (i * (66.3 - 0.6)) / 10; pier(x, -17.15, 0.3, 0.25); pier(x, 17.15, 0.3, 0.25) }
  for (let i = 0; i <= 5; i++) { const y = -17.2 + 0.3 + (i * (34.4 - 0.6)) / 5; pier(-33.1, y, 0.25, 0.3); pier(33.1, y, 0.25, 0.3) }
  walls(concrete, BASE, 7.8, 8.6) // roof edge
  cap(concrete, BASE, 7.8, false)
  cap(red, chamfer(rect(-33.45, -17.5, 33.45, 17.5), 0.5), 8.6) // the red roof

  // --- The glazed storey under the tower, then the windowless book
  // tower (OSM way/1173176557, 43.3 × 16.9 m), flush with the base's
  // north edge, and the small rooftop block (way/1173176558).
  const X0 = -29.15, X1 = 14.15, Y0 = 0.45, Y1 = 17.35
  const TOWER = chamfer(rect(X0, Y0, X1, Y1), 0.4)
  walls(glass, chamfer(rect(X0 + 0.5, Y0 + 0.5, X1 - 0.5, Y1 - 0.5), 0.4), 8.6, 11.2)
  const Z0 = 11.2, ZT = 38.7, H = ZT - Z0
  walls(red, TOWER, Z0, ZT)
  cap(red, TOWER, Z0, false)
  const PAR = chamfer(rect(X0 + 0.35, Y0 + 0.35, X1 - 0.35, Y1 - 0.35), 0.3)
  cap(concrete, TOWER, ZT) // a pale coping round the top
  cap(red, PAR, ZT + 0.05) // the red roof (OSM roof:colour; ProtoplasmaKid l10)
  walls(concrete, PAR, ZT, ZT + 0.05)
  const REM = chamfer(rect(-15, 2.05, -0.6, 6.65), 0.3)
  walls(red, REM, ZT, ZT + 4.6)
  cap(red, REM, ZT + 4.6)

  // --- O'Gorman's murals as broad zones of their dominant colours,
  // face by face, over the red-brown ground of the stone mosaic.
  const S: Face = { o: [X0, Y0, 0], u: [1, 0, 0], n: [0, -1, 0], W: X1 - X0, z0: Z0, H }
  const N: Face = { o: [X1, Y1, 0], u: [-1, 0, 0], n: [0, 1, 0], W: X1 - X0, z0: Z0, H }
  const E: Face = { o: [X1, Y0, 0], u: [0, 1, 0], n: [1, 0, 0], W: Y1 - Y0, z0: Z0, H }
  const Wf: Face = { o: [X0, Y1, 0], u: [0, -1, 0], n: [-1, 0, 0], W: Y1 - Y0, z0: Z0, H }

  // North: the pre-Hispanic past — mostly a dark blue-grey field, red-brown
  // at the upper left and the foot, the cream disc platform at the top,
  // the cream sun below and the clusters of cream figures at each side.
  poly(blue, N, rectF(0.02, 0.03, 0.98, 0.97), 0.04)
  poly(red, N, rectF(0.04, 0.68, 0.3, 0.95), 0.07)
  poly(red, N, rectF(0.36, 0.05, 0.64, 0.3), 0.07)
  poly(red, N, rectF(0.84, 0.2, 0.96, 0.62), 0.07)
  disc(cream, N, 0.5, 0.82, 5.2, 0.1, 1.6)
  disc(cream, N, 0.5, 0.2, 2.6, 0.1)
  poly(cream, N, rectF(0.08, 0.3, 0.2, 0.58), 0.1)
  poly(cream, N, rectF(0.72, 0.32, 0.82, 0.62), 0.1)
  poly(cream, N, rectF(0.36, 0.42, 0.64, 0.5), 0.1) // the band of figures across the middle
  poly(cream, N, rectF(0.7, 0.8, 0.92, 0.88), 0.1)

  // South: the colonial past — red-brown, with the two great blue-grey
  // medallions (Ptolemy's and Copernicus' universes) in cream rings, the
  // cream ribbons down the centre, the sun and the moon-face at the top.
  for (const u of [0.24, 0.76]) {
    disc(blue, S, u, 0.52, 7.0, 0.07)
    ring(cream, S, u, 0.52, 7.0, 7.8, 0.08)
    disc(cream, S, u, 0.52, 1.3, 0.1)
  }
  poly(cream, S, rectF(0.46, 0.06, 0.54, 0.9), 0.08)
  disc(cream, S, 0.91, 0.88, 2.4, 0.08)
  disc(cream, S, 0.09, 0.88, 2.4, 0.08)

  // East: the contemporary world — the atom in cream rings at the centre,
  // a blue-grey sky above, the cream banners and figures below.
  poly(blue, E, rectF(0.04, 0.72, 0.96, 0.97), 0.05)
  ring(cream, E, 0.5, 0.55, 3.6, 4.4, 0.08)
  disc(cream, E, 0.5, 0.55, 1.4, 0.1)
  poly(cream, E, rectF(0.06, 0.06, 0.45, 0.2), 0.08)
  poly(cream, E, rectF(0.6, 0.08, 0.94, 0.38), 0.08)

  // West: the university — the cream shield under the eagle at the top
  // middle, the two roundels above, cream figures low down.
  poly(cream, Wf, [[0.27, 0.6], [0.5, 0.44], [0.73, 0.6], [0.73, 0.78], [0.27, 0.78]], 0.08)
  disc(cream, Wf, 0.15, 0.9, 1.6, 0.08)
  disc(cream, Wf, 0.85, 0.9, 1.6, 0.08)
  poly(blue, Wf, rectF(0.06, 0.06, 0.55, 0.32), 0.06)
  poly(cream, Wf, rectF(0.65, 0.08, 0.94, 0.36), 0.08)

  // the murals are floodlit at night (Esparta Palma's night photo)
  const lit = (p: V3, n: V3) => (p[2] > 11 && Math.abs(n[2]) < 0.5 ? 0.8 : 0)
  return [
    { part: red, material: { ...finish('ogorman-red', 0xa3654f), floodlight: lit } },
    { part: blue, material: { ...finish('ogorman-blue', 0x7b848d), floodlight: lit } },
    { part: cream, material: { ...finish('ogorman-cream', 0xe9dcc0), floodlight: lit } },
    { part: concrete, material: PALETTE.trim },
    { part: glass, material: PALETTE.window },
    { part: onyx, material: windowVariant(2, 0xc9a462) },
  ]
}

if (import.meta.main) {
  const parts = build()
  for (const { part, material } of parts) console.log(material.name.padEnd(18), part.triangles)
  await save('mexico-city-unam-central-library', 'Biblioteca Central UNAM', ANCHOR, BEARING, parts, 5000)
}
