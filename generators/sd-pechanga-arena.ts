/**
 * Pechanga Arena (the San Diego Sports Arena, 1966; Valley View Casino Center
 * 2010-18), Midway District, San Diego. A New Formalist drum by Mark L.
 * Faddis: a rounded oval of tall white precast fins, close-set with shadowed
 * slots between them (a few slots lined in blue-grey), on a low white base,
 * under a flat grey roof with pale membrane patches; low entrance lobbies on
 * the four axes, the main one on the south (Sports Arena Boulevard) under the
 * red arena sign. Original procedural geometry, CC0-1.0.
 *   bun generators/sd-pechanga-arena.ts
 *
 * STATUS: the Midway Rising redevelopment plans to demolish this arena and
 * build a new 16,000-seat arena on the site (Wikipedia, "Pechanga Arena",
 * 2026: the project expects to advance "by the end of 2027"; no demolition
 * date). Still standing as of this model. If it is demolished, drop the
 * placement.
 *
 * Frame: bearing 17 (the oval's short axis points 17 degrees east of north,
 * read from the OSM outline, which is symmetric about that axis). x along the
 * long axis (towards 107 degrees), y along the short axis, z up, metres;
 * origin at the lead's anchor -117.21224, 32.75535, which is the oval's
 * centre to within a metre.
 *
 * Ground: the map's terrain (Mapterhorn) is nearly flat round the arena: the
 * car park outside is 2.0-2.8 m above its lowest point, the loading-dock ramp
 * at the north-east lobby (about (57, 38) here); inside the outline the
 * terrain bulges to 4.5 but the map fills that from the ground outside.
 * y = 0 is the ramp (the lowest ground under the footprint, per STYLE.md);
 * the plaza and the arena floor are at G = 2.4 (terrain.ts check). Elevation
 * 0.
 *
 * Evidence
 * - OSM way/121777136 (building=yes, leisure=stadium, "Pechanga Arena",
 *   old_name San Diego Sports Arena): the outline. In this frame the drum is
 *   a superellipse of semi-axes 69 x 55 (exponent 2.6, fitted to its
 *   vertices: (+-69, 0), (0, +-55), (+-54, +-42)); the lobby blocks stick out
 *   on the west (-77..-69, -22..9), east (65..76, 21..41), north (-16..14,
 *   53..60) and south (-6..25, -68..-51). way/729714896 and way/879493502 are
 *   separate buildings in the car park, not part of the model.
 * - Lidar: none. Neither CA_SanDiegoQL2_2014 nor the 2016 El Nino strip
 *   returns any points here (lidar.py: "no points here"), so no height is
 *   measured.
 * - Published (Wikipedia "Pechanga Arena"): opened 17 November 1966,
 *   architect Mark L. Faddis, New Formalism, a City of San Diego historic
 *   resource, "77 feet tall" (23.5 m): the drum's top here.
 * - USGS NAIP (2022): plan, the flat grey roof and its pale patches (a long
 *   strip along the short axis and two squares), the lobbies.
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   "San Diego Sports Arena.jpg" (Nehrams2020, CC BY-SA 3.0, 2007): the whole
 *     long side from a height, the fins, blue-grey slots, flat roof edge;
 *   "San Diego,California,USA. - panoramio (36).jpg" (Roman Eugeniusz,
 *     CC BY-SA 3.0): the south entrance, its glazed lobby, red canopy band
 *     and the red SPORTS ARENA sign box, the white base under the fins;
 *   "Pechanga Arena Panorama.jpg" (Pink Floyd Fan 101, CC BY 4.0, 2026) and
 *     "VVCasinoCtr.jpeg" (Gateman1997, CC BY 3.0): inside, for the bowl
 *     (not modelled), confirming the flat roof on its trusses.
 *
 * Estimated: fin count (one about every 2.4 m round the drum, counted on the
 * 2007 photo's long side), fin depth 1.1 m, base 3.2 m, roof camber 1.2 m, lobby heights
 * 4.5-6 m, the sign box size. The north, east and west lobbies have no close
 * photo and repeat the south one plainly. Night: the fins are floodlit from
 * below in reality only at the entrances; here only the lobbies glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, prism, report, writeGlb, type XY } from './sf-de-young'
import { panel } from './sf-opera-house'

const fin = new Part(), base = new Part(), slot = new Part(), roofP = new Part(), win = new Part(), red = new Part()

const G = 2.4, TOP = G + 23.5, BASE = G + 3.2
const A = 69, B = 55, P = 2.6
const sx = (t: number) => Math.sign(Math.cos(t)) * Math.abs(Math.cos(t)) ** (2 / P)
const sy = (t: number) => Math.sign(Math.sin(t)) * Math.abs(Math.sin(t)) ** (2 / P)
/** The superellipse at an inward offset d (approximate: scales both axes). */
const pt = (t: number, d = 0): XY => [(A - d) * sx(t), (B - d) * sy(t)]
const NF = 168 // fins round the drum (about every 2.4 m)
const ringN = (n: number, d: number) => Array.from({ length: n }, (_, i) => pt((2 * Math.PI * i) / n, d))

// ---------------------------------------------------------------------------
// The finned drum: each bay is a fin face (outer) and a slot face (1.1 m in),
// the folded-plate rhythm of the precast fins. Four vertices per bay.
{
  const pts: { p: XY; m: Part }[] = []
  for (let i = 0; i < NF; i++) {
    const t0 = (2 * Math.PI * i) / NF, t1 = (2 * Math.PI * (i + 0.55)) / NF, t2 = (2 * Math.PI * (i + 0.62)) / NF, t3 = (2 * Math.PI * (i + 0.93)) / NF
    pts.push({ p: pt(t0, 0), m: fin }, { p: pt(t1, 0), m: fin }, { p: pt(t2, 1.1), m: slot }, { p: pt(t3, 1.1), m: fin })
  }
  for (let k = 0; k < pts.length; k++) {
    const a = pts[k].p, b = pts[(k + 1) % pts.length].p, m = pts[k].m
    m.quad([a[0], a[1], BASE], [b[0], b[1], BASE], [b[0], b[1], TOP], [a[0], a[1], TOP])
  }
  // the fins' tops: a cap ring from the outer line to the roof fascia
  const outer = ringN(NF * 2, 0), inner = ringN(NF * 2, 1.6)
  for (let i = 0; i < outer.length; i++) {
    const j = (i + 1) % outer.length
    fin.quad([inner[i][0], inner[i][1], TOP], [outer[i][0], outer[i][1], TOP], [outer[j][0], outer[j][1], TOP], [inner[j][0], inner[j][1], TOP])
  }
  // the white base under the fins, a little proud, from y = 0
  const br = ringN(96, -0.4)
  for (let i = 0; i < br.length; i++) {
    const j = (i + 1) % br.length
    base.quad([br[i][0], br[i][1], 0], [br[j][0], br[j][1], 0], [br[j][0], br[j][1], BASE], [br[i][0], br[i][1], BASE])
    const bi = pt((2 * Math.PI * i) / br.length, 1.2), bj = pt((2 * Math.PI * j) / br.length, 1.2)
    base.quad([bi[0], bi[1], BASE], [br[i][0], br[i][1], BASE], [br[j][0], br[j][1], BASE], [bj[0], bj[1], BASE])
  }
}
// ---------------------------------------------------------------------------
// The roof: a grey fascia set back from the fins and a very low camber, with
// the pale membrane patches seen in the aerial.
{
  const n = 64, r0 = ringN(n, 1.6), r1 = ringN(n, 2.2)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    roofP.quad([r0[i][0], r0[i][1], TOP], [r0[j][0], r0[j][1], TOP], [r0[j][0], r0[j][1], TOP + 0.9], [r0[i][0], r0[i][1], TOP + 0.9])
    roofP.quad([r1[i][0], r1[i][1], TOP + 0.9], [r0[i][0], r0[i][1], TOP + 0.9], [r0[j][0], r0[j][1], TOP + 0.9], [r1[j][0], r1[j][1], TOP + 0.9])
  }
  let prev = r1, zp = TOP + 0.9
  for (const [k, z] of [[0.6, TOP + 1.6], [0.25, TOP + 2.0]] as [number, number][]) {
    const r = r1.map(([x, y]) => [x * k, y * k] as XY)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      roofP.quad([r[i][0], r[i][1], z], [prev[i][0], prev[i][1], zp], [prev[j][0], prev[j][1], zp], [r[j][0], r[j][1], z])
    }
    prev = r; zp = z
  }
  for (let i = 0; i < n; i++) roofP.tri([prev[i][0], prev[i][1], zp], [prev[(i + 1) % n][0], prev[(i + 1) % n][1], zp], [0, 0, TOP + 2.1])
  // membrane patches (NAIP): a strip along the short axis and two squares
  const zOn = (x: number, y: number) => {
    const s = Math.max(Math.abs(x) / 66.8, Math.abs(y) / 52.8)
    return s > 0.6 ? TOP + 0.9 + ((1 - s) / 0.4) * 0.7 : s > 0.25 ? TOP + 1.6 + ((0.6 - s) / 0.35) * 0.4 : TOP + 2.0
  }
  for (const [x0, x1, y0, y1] of [[-6, 6, -30, 36], [-14, 6, -22, -6], [36, 46, -2, 8]] as number[][]) {
    const nx = 4, ny = 6
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      const xa = x0 + ((x1 - x0) * i) / nx, xb = x0 + ((x1 - x0) * (i + 1)) / nx, ya = y0 + ((y1 - y0) * j) / ny, yb = y0 + ((y1 - y0) * (j + 1)) / ny
      slot.quad([xa, ya, zOn(xa, ya) + 0.12], [xb, ya, zOn(xb, ya) + 0.12], [xb, yb, zOn(xb, yb) + 0.12], [xa, yb, zOn(xa, yb) + 0.12])
    }
  }
}

// ---------------------------------------------------------------------------
// Lobbies on the four axes: low white blocks with glazed fronts and a red
// canopy band; the main (south) one carries the red sign box.
function lobby(ring: XY[], h: number, front: [XY, XY, XY], canopy = true) {
  prism(base, ring, 0, h, roofP)
  const [a, b, n] = front
  panel(win, a, b, n, G + 0.2, G + 3.4, 0.06)
  if (canopy) panel(red, a, b, n, G + 3.6, G + 4.4, 0.4)
}
lobby([[-6, -68], [25, -66], [24, -50], [-7, -52]], G + 5, [[-4, -67.9], [23, -66], [0.07, -1]])
lobby([[-16, 50], [14, 52], [13, 60], [-16, 58]], G + 4.5, [[-14, 58.1], [12, 59.9], [-0.07, 1]])
lobby([[-77, -22], [-66, -22], [-66, 9], [-77, 9]], G + 4.5, [[-77.06, -20], [-77.06, 7], [-1, 0]])
lobby([[64, 21], [76, 23], [74, 41], [62, 38]], G + 4.5, [[76, 23.5], [74.2, 39.5], [0.99, 0.11]])
// the sign box over the south lobby (red face with pale lettering band)
box(red, [9.5, -61.5, G + 8.6], 11, 0.7, 2.2, 0.064)
panel(base, [0.5, -62.8], [18.5, -61.65], [0.064, -1], G + 7.7, G + 9.5, 0.02) // the lettering band, white

// ---------------------------------------------------------------------------
const parts = [
  { part: fin, material: { ...finish('sports-arena-white-fins', 0xf0ece4), floodlight: (p: V3, n: V3) => (n[2] > 0.7 ? 0 : p[2] < G + 10 ? 0.35 : 0.15) } },
  { part: base, material: PALETTE.trim },
  { part: slot, material: finish('sports-arena-fin-slots', 0xbcc5cf) },
  { part: roofP, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: red, material: finish('arena-sign-red', 0xb04848) },
]
const glb = writeGlb('Pechanga Arena', parts, {
  license: 'CC0-1.0', bearing: 17, elevation: 0, anchor: [32.75535, -117.21224],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', replaces: ['way/121777136'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('Pechanga Arena', parts, glb, 5000)
const out = new URL('../models/sd-pechanga-arena.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
