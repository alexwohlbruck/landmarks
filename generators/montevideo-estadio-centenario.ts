/**
 * Estadio Centenario and the Torre de los Homenajes (Parque Batlle,
 * Montevideo; architect Juan Antonio Scasso, opened 18 July 1930 for the
 * first World Cup) — procedural, CC0-1.0, no textures.
 * bun generators/montevideo-estadio-centenario.ts
 *
 * Map frame: x across the pitch (+x the Olímpica stand and the tower,
 * east-north-east), y along it (+y the Colombes end, north-north-west), z
 * up, metres. Placed at bearing 329: the pitch's long side (OSM
 * leisure=pitch way/179533172, 104.5 x 68.0 m, runs at 149 / 329 deg).
 * Anchor -56.152820, -34.894512: the pitch centre.
 *
 * Plan (OSM building=stadium relation/8725753 in this frame): the four
 * stands (Olímpica relation/8725750, Colombes 8725751, América 8725752,
 * Amsterdam 8725754) form a near-round bowl, outer radius 131-136 m, except
 * the lower América stand on the west, 105-113 m; the inner edge a rounded
 * rectangle about 108 x 146 m. Drawn as rings at a fraction f of the way
 * from that inner edge (superellipse 53 x 73, exponent 4) to the outer
 * edge (133 m, easing to 108 m across the América side), symmetric about
 * y = 0.
 *
 * Section, ESTIMATED from the photos (titi from the Olímpica's top, aer,
 * cordero), no published section found: three rings, the lowest bare
 * concrete terraces starting at the pitch wall (aer; the few rows of dark
 * seats in titi are left out, the earth surround inside it is the map's
 * ground), the middle and upper rings sky-blue seat sections, white on
 * the Olímpica (aer, cordero), the rim
 * at 21 m over the field (17 m on the América side, which carries the
 * covered central block, OSM relation/8725772, roof layer 1, drawn at 20 m).
 *
 * The Torre de los Homenajes stands at the back of the Olímpica, x 128:
 * published height 100 m "coronada por un asta" (es.wikipedia); OSM
 * way/1552527230 height 75 (the broad shaft, 4.3 x 5.4 m), way/1552527231
 * height 100 (the slim top shaft), way/1552527232 and 1552527233 height 15
 * (the wing-like flared base, "imita las alas de un avión y la proa de un
 * barco"). Drawn: broad shaft to 75 m, slim shaft to 89 m, the flagpole to
 * 100 m (proportions from the photo torre, rodoluca); its nine balconies
 * ("las franjas de la bandera", five white and four blue) as nine bold
 * white slabs up the side, the four blue stripes on the faces. The broad
 * shaft is drawn 6 x 5 m, a little over OSM, so it holds at phone size.
 *
 * Elevation 0: the bowl is set into the ground (the outside walls read
 * about 10-15 m high against a 21 m rim in aer and cordero; the ends carry
 * earth banks, "taludes"), and the map's terrain already carries that pit:
 * Mapterhorn (z12 only here) reads the field about 1 m and the ground round
 * the bowl 5 m (west, América) to 15-20 m (east, Olímpica) above the lowest
 * point, as for Nippert Stadium. No published field level found; doubt.
 *
 * Evidence (all EVIDENCE):
 *  - OSM: relations above, leisure=stadium relation/2512517 (Q498245).
 *  - Photos, Wikimedia Commons:
 *    - aer: Marcelo Campi, "Estadio Centenario (vista aérea).jpg", CC BY-SA 2.0.
 *      https://commons.wikimedia.org/wiki/File:Estadio_Centenario_(vista_a%C3%A9rea).jpg
 *    - c2021: Marcelo Campi, "Estadio Centenario 2021.jpg", CC BY-SA 2.0 (night).
 *      https://commons.wikimedia.org/wiki/File:Estadio_Centenario_2021.jpg
 *    - torre: rodoluca, "El Estadio Centenario y la Torre de los Homenajes,
 *      Montevideo, Uruguay - panoramio.jpg", CC BY-SA 3.0.
 *      https://commons.wikimedia.org/wiki/File:El_Estadio_Centenario_y_la_Torre_de_los_Homenajes,_Montevideo,_Uruguay_-_panoramio.jpg
 *    - torre2: Uwebart, "Torre de los Homenajes (Estadio Centenario,
 *      Montevideo) above Tribuna Olimpica.jpg", CC BY-SA 3.0.
 *      https://commons.wikimedia.org/wiki/File:Torre_de_los_Homenajes_(Estadio_Centenario,_Montevideo)_above_Tribuna_Olimpica.jpg
 *    - titi: TitiNicola, "Estadio Centenario Montevideo Uruguay.jpg", CC BY-SA 4.0.
 *      https://commons.wikimedia.org/wiki/File:Estadio_Centenario_Montevideo_Uruguay.jpg
 *    - cordero: Ismael Cordero, "Estadio Centenario, Montevideo, Uruguay.JPG", CC BY-SA 3.0.
 *      https://commons.wikimedia.org/wiki/File:Estadio_Centenario,_Montevideo,_Uruguay.JPG
 *  - Published: es.wikipedia "Estadio Centenario" (tower 100 m, nine
 *    balconies, three rings on the Olímpica, capacity 60,235).
 *  - No lidar or usable terrain here. No commercial imagery.
 *
 * Simplified: the gaps between the four stands at the corners are closed;
 * the taludes are left to the map's terrain; the floodlights are four
 * corner masts (c2021, titi). Doubts: every tier height, the field level.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { face, strip, tube } from './seoul-world-cup-stadium'

const rin = (t: number) => {
  const a = 53, b = 73, e = 4
  return Math.pow(Math.pow(Math.abs(Math.cos(t) / a), e) + Math.pow(Math.abs(Math.sin(t) / b), e), -1 / e)
}
/** Outer radius: 133 m, easing to 108 m across the América side (t near pi). */
const rout = (t: number) => {
  const c = Math.cos(t)
  const w = c < -0.6 ? Math.min(1, (-c - 0.6) / 0.25) : 0
  return 133 - 25 * w
}
/** The rim height falls with the América side too. */
const amer = (t: number) => { const c = Math.cos(t); return c < -0.6 ? Math.min(1, (-c - 0.6) / 0.25) : 0 }
const P = (f: number, t: number, z: number): V3 => { const r = rin(t) + f * (rout(t) - rin(t)); return [r * Math.cos(t), r * Math.sin(t), z] }

/** Lofts an (f, z) profile round the ring; z may depend on t (scaled for the America side). */
function loft(p: Part, n: number, prof: [number, number][], side: 1 | -1, zs = (z: number, _t: number) => z, range?: [number, number]) {
  const ts = range ? Array.from({ length: n + 1 }, (_, k) => range[0] + ((range[1] - range[0]) * k) / n) : Array.from({ length: n }, (_, k) => (k / n) * 2 * Math.PI)
  for (let i = 0; i < prof.length - 1; i++) {
    const [f0, z0] = prof[i], [f1, z1] = prof[i + 1]
    const r0 = ts.map((t) => P(f0, t, zs(z0, t))), r1 = ts.map((t) => P(f1, t, zs(z1, t)))
    const nd = -(z1 - z0) * side, nz = (f1 - f0) * 60 * side
    strip(p, r0, r1, (q) => { const l = Math.hypot(q[0], q[1]) || 1; return [(q[0] / l) * nd, (q[1] / l) * nd, nz] }, !range)
  }
}

function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = false) {
  face(p, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1])
  if (bottom) face(p, [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], [0, 0, -1])
  face(p, [[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]], [-1, 0, 0])
  face(p, [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], [1, 0, 0])
  face(p, [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], [0, -1, 0])
  face(p, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], [0, 1, 0])
}

function build() {
  const concrete = new Part(), white = new Part(), celeste = new Part(), dark = new Part(), glazing = new Part(), lamps = new Part()
  const n = 72
  const zs = (z: number, t: number) => z * (1 - 0.19 * amer(t)) // the America side is lower

  // --- The bowl: pitch wall, three rings with walkways between, rim, outer wall.
  loft(concrete, n, [[0, 0], [0, 1.2]], 1, zs)
  // The lowest ring: bare concrete terraces (aer, cordero), starting at the
  // pitch wall; the seat sections above it sky blue, with white sections
  // on the Olimpica (+x, the tower side) as the aerials show.
  loft(dark, n, [[0, 1.2], [0.3, 7]], 1, zs)
  loft(concrete, n, [[0.3, 7], [0.33, 7], [0.33, 7.6]], 1, zs)
  const OL = 0.75 // half-angle of the Olimpica's white sections about +x
  const seats = (prof: [number, number][]) => {
    loft(white, 12, prof, 1, zs, [-OL, OL])
    loft(celeste, 48, prof, 1, zs, [OL, 2 * Math.PI - OL])
  }
  seats([[0.33, 7.6], [0.66, 14]])
  loft(concrete, n, [[0.66, 14], [0.69, 14], [0.69, 14.6]], 1, zs)
  seats([[0.69, 14.6], [1.0, 20.5]])
  loft(concrete, n, [[1.0, 20.5], [1.0, 21.2], [1.012, 21.2], [1.012, 0]], 1, zs)
  // the outer wall's openings: a band of dark doors and windows under the rim
  loft(glazing, n, [[1.0125, 13], [1.0125, 16]], -1, zs)
  loft(glazing, n, [[1.0125, 4], [1.0125, 7]], -1, zs)

  // radial stairs: a white line down every 30 deg of the middle and upper rings
  for (let k = 0; k < 24; k++) {
    const t = ((k + 0.5) / 24) * 2 * Math.PI, w = 0.006
    for (const [f0, z0, f1, z1] of [[0.33, 7.6, 0.66, 14], [0.69, 14.6, 1.0, 20.5]]) {
      const a = P(f0, t - w, zs(z0, t) + 0.1), b = P(f0, t + w, zs(z0, t) + 0.1)
      const c = P(f1, t + w, zs(z1, t) + 0.1), d = P(f1, t - w, zs(z1, t) + 0.1)
      face(concrete, [a, b, c, d], [0, 0, 1])
    }
  }

  // --- The América stand's covered central block (OSM relation/8725772): a roof slab on the back.
  {
    const y0 = -41, y1 = 41, xa = -113, xb = -86
    box(celeste, xa, xb, y0, y1, 0, 15.5)
    face(glazing, [[xa - 0.05, y0 + 2, 4], [xa - 0.05, y1 - 2, 4], [xa - 0.05, y1 - 2, 12], [xa - 0.05, y0 + 2, 12]], [-1, 0, 0])
    box(white, xa, -76, y0, y1, 19.4, 20.2, true)
    for (const y of [-38, -19, 0, 19, 38]) tube(concrete, [xa + 2, y, 15.5], [xa + 2, y, 19.4], 0.5, 0.5, 4, false, false)
  }

  // --- Floodlight masts at the four corners.
  for (const t of [0.75, Math.PI - 0.75, Math.PI + 0.75, 2 * Math.PI - 0.75]) {
    const q = P(1.03, t, 0)
    tube(concrete, q, [q[0], q[1], 44], 0.9, 0.6, 4, false, false)
    box(lamps, q[0] - 2.6, q[0] + 2.6, q[1] - 2.6, q[1] + 2.6, 43, 47, true)
  }

  // --- The Torre de los Homenajes.
  const TX = 128.4, TY = -0.7
  // flared base: two wings and a prow, white concrete
  for (const s of [1, -1]) {
    const y0 = TY + s * 2.5, y1 = TY + s * 10.5
    const pts: V3[] = [[TX - 2.2, y0, 0], [TX + 2.2, y0, 0], [TX + 2.2, y1, 0], [TX - 2.2, y1, 0]]
    const top = (y: number) => 15 - (13 * Math.abs(y - y0)) / 8
    const quad = (a: V3, b: V3, c: V3, d: V3, nn: V3) => face(white, [a, b, c, d], nn)
    // a tapering wing: full height at the shaft, 2 m at its tip
    quad([TX - 2.2, y0, top(y0)], [TX + 2.2, y0, top(y0)], [TX + 2.2, y1, top(y1)], [TX - 2.2, y1, top(y1)], [0, s * 13, 8])
    quad(pts[0], pts[3], [TX - 2.2, y1, top(y1)], [TX - 2.2, y0, top(y0)], [-1, 0, 0])
    quad(pts[1], pts[2], [TX + 2.2, y1, top(y1)], [TX + 2.2, y0, top(y0)], [1, 0, 0])
    quad(pts[3], pts[2], [TX + 2.2, y1, top(y1)], [TX - 2.2, y1, top(y1)], [0, s, 0])
  }
  // the broad shaft 6 x 5 m to 75 m, the slim shaft to 89 m, the flagpole to 100 m
  box(white, TX - 2.5, TX + 2.5, TY - 3, TY + 3, 0, 75)
  box(white, TX - 1.2, TX + 1.2, TY - 1.8, TY + 1.8, 75, 89)
  tube(concrete, [TX, TY, 89], [TX, TY, 100], 0.35, 0.15, 4, false, false)
  // four blue stripes on the pitch and outer faces, between the base and the top
  for (const sx of [-1, 1]) for (let k = 0; k < 4; k++) {
    const y = TY - 2.1 + k * 1.4, x = TX + sx * 2.55
    face(celeste, [[x, y, 16], [x, y + 0.6, 16], [x, y + 0.6, 72], [x, y, 72]], [sx, 0, 0])
  }
  // nine balconies up each side, bold slabs (the flag's nine stripes)
  for (const sy of [-1, 1]) for (let k = 0; k < 9; k++) {
    const z = 18 + k * 6.2, y0 = TY + sy * 3, y1 = TY + sy * 4.6
    box(k % 2 === 0 ? white : celeste, TX - 2.0, TX + 2.0, Math.min(y0, y1), Math.max(y0, y1), z, z + 1.4, true)
  }

  const lit = (_p: V3, nn: V3) => (nn[2] > 0.6 ? 0.1 : 0.7)
  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: concrete, material: { ...finish('centenario-concrete', 0xd6d3cc), floodlight: lit } },
    { part: white, material: { ...finish('centenario-white', 0xf3f1eb), floodlight: (p: V3, nn: V3) => (p[2] > 20 && nn[2] < 0.6 ? 0.9 : 0.2) } },
    { part: celeste, material: finish('centenario-celeste', 0x84b4da) },
    { part: dark, material: finish('centenario-terraces', 0xb4b2ac) },
    { part: glazing, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
    { part: lamps, material: { name: 'lamp', color: 0xe8e6e0, roughness: 0.5 } },
  ]
  return parts
}

if (import.meta.main) {
  const parts = build()
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > 5000) throw new Error(`triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Estadio Centenario', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 329, elevation: 0, height: 100,
  })
  if (glb.length > 250_000) throw new Error(`size budget exceeded: ${glb.length}`)
  const out = new URL('../models/montevideo-estadio-centenario.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
