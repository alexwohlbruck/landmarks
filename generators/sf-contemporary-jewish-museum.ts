/**
 * Contemporary Jewish Museum, San Francisco: the 1907 Jessie Street power
 * substation, red brick with a white cornice and tall round-headed windows,
 * and Daniel Libeskind's 2008 additions: the navy steel cube (the "Yud")
 * crashing out of its south-west end, and a low grey slanted volume beside it.
 * Original procedural geometry, CC0-1.0.
 * bun generators/sf-contemporary-jewish-museum.ts
 *
 * Frame: BEARING 45, turned to the South of Market grid: y runs north-east
 * along the building (the Yud at -y, the ornate end portal at +y), x
 * south-east towards Jessie Square, where the long brick front faces. Origin =
 * area centroid of the OSM outline way/118106934. y = 0 is Jessie Square,
 * 10.98 m NAVD88; a garage ramp at the north-east end drops 4.8 m lower and is
 * left to the map.
 *
 * Evidence
 * - OSM way/118106934 ("Contemporary Jewish Museum", height 14), no parts.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m, cells and raw
 *   points (/tmp/city/sf/work/sf-contemporary-jewish-museum): the brick front
 *   on Jessie Square has a parapet at 14.6 running from y = -24 to 42; the
 *   roof behind sits at 11.4; a lower volume on the north-west side slopes
 *   from 13.9 down to 9 towards the south-west end. (A wedge on the roof,
 *   rising from 13 to 20.5, is left out: no photo shows it clearly.) The
 *   Yud's stainless steel returns little (a mirror to the scanner): its
 *   footprint shows as a hole in the data about 15 m across (x -3.4 to 12)
 *   running from y = -41 to the brick end. Returns at 30, 35 and 45 m above
 *   the substation's end match nothing in the photos (likely a lift or crane
 *   at the time of the 2023 flight) and are ignored.
 * - Published (Wikipedia, CJM): Jessie Street Substation, 1907 (Willis Polk's
 *   1905 facade), gutted and extended by Daniel Libeskind, opened 2008.
 * - Photos (Wikimedia Commons): "2017 Contemporary Jewish Museum 2008
 *   addition.jpg" and "2017 Contemprary Jewish Museum Jessie Street
 *   Substation.jpg" (Beyond My Ken, CC BY-SA 4.0); "Contemporary Jewish
 *   Museum, San Francisco 2023-07-14.jpg" and "... 2.jpg" (The wub, CC BY-SA
 *   4.0); "Contemporary Jewish Museum @ San Francisco (16945265866).jpg",
 *   "(16783538058).jpg", "(16945287956).jpg", "(16785042189).jpg" (Guilhem
 *   Vellut, CC BY 2.0); "San Francisco Contemporary Jewish Museum 001-004.jpg"
 *   (Sebastian Wallroth, public domain); "Contemporary Jewish Museum, San
 *   Francisco (2013).JPG" (Another Believer, CC BY-SA 3.0, the end portal).
 *
 * Estimated from the photos: the window and arch positions on the brick front
 * and their white surrounds, the cornice band's depth, the end portal; the
 * Yud as one 16 m cube balanced on an edge and tipped 36 degrees, turned 8
 * degrees off the grid, its top at 22.4 so the brick cornice (14.6) sits at
 * about two-thirds of its height (people at its foot in Vellut's
 * (16785042189) put it at 20-25 m); a few of its small window slots; the
 * colours: navy steel and grey steel, both lightened to the palette.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { walls, type XY } from './sf-opera-house'
import { ccw, earcut, report } from './sf-de-young'

const BEARING = 45
const ANCHOR = { lng: -122.40369393, lat: 37.78601495 }

const brick = new Part(), white = new Part(), blue = new Part(), steel = new Part(), win = new Part(), roof = new Part()

function prism(wall: Part, top: Part | null, ring0: XY[], z0: number, z1: number) {
  const r = ccw(ring0)
  walls(wall, r, z0, z1)
  if (top) for (const [i, j, k] of earcut(r)) top.tri([r[i][0], r[i][1], z1], [r[j][0], r[j][1], z1], [r[k][0], r[k][1], z1])
}
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// ---------------------------------------------------------------------------
// The substation

const SE = 12, NW = -12.7, NE = 42.3, SW = -24
// main body and its lower south-west wing (beside the Yud)
prism(brick, roof, [[NW, -8.4], [SE, -8.4], [SE, NE], [NW, NE]], 0, 11.4)
prism(brick, roof, rect(-3.4, SW, SE, -8.4), 0, 11.4)
// the front on Jessie Square: brick to 12.6, a white cornice to 14.6, a little proud
prism(brick, null, rect(SE - 1.2, SW, SE, NE), 0, 12.6)
prism(white, white, rect(SE - 1.2, SW, SE + 0.35, NE), 12.6, 14.6)
// the north-east end: the same cornice
prism(white, white, rect(NW, NE - 1.2, SE + 0.35, NE + 0.35), 10.4, 12.2)

/** A window on the Jessie Square front (faces +x) with a white surround. */
function frontWindow(y: number, w: number, z0: number, z1: number, arch = false) {
  const x = SE + 0.06, b = 0.55
  const quad = (p: Part, y0: number, y1: number, za: number, zb: number, dx: number) => p.quad([x + dx, y0, za], [x + dx, y1, za], [x + dx, y1, zb], [x + dx, y0, zb])
  quad(white, y - w / 2 - b, y + w / 2 + b, z0 - b, arch ? z1 - w / 2 : z1 + b, 0)
  quad(win, y - w / 2, y + w / 2, z0, arch ? z1 - w / 2 : z1, 0.03)
  if (arch) {
    const r = w / 2, zc = z1 - r, seg = 8
    for (let i = 0; i < seg; i++) {
      const a0 = (Math.PI * i) / seg, a1 = (Math.PI * (i + 1)) / seg
      const P = (a: number, rr: number, dx: number): V3 => [x + dx, y + rr * Math.cos(a), zc + rr * Math.sin(a)]
      white.quad(P(a0, r, 0), P(a0, r + b, 0), P(a1, r + b, 0), P(a1, r, 0))
      win.tri(P(a0, r, 0.03), P(a1, r, 0.03), [x + 0.03, y, zc])
    }
  }
}
frontWindow(11, 5.2, 1.2, 10.4, true) // the great arched window over the entrance
for (const y of [-18, -12, -2, 3, 19, 24, 29, 34, 39]) frontWindow(y, 2.2, 3.2, 9.8, true) // tall round-headed windows
// the end portal (north-east): a white doorcase with a carved crest
{
  const y = NE + 0.41, x0 = -4, x1 = 4
  const q = (p: Part, a: number, b: number, za: number, zb: number, dy = 0) => p.quad([b, y + dy, za], [a, y + dy, za], [a, y + dy, zb], [b, y + dy, zb])
  q(white, x0, x1, 0, 7.6)
  q(white, x0 + 1.4, x1 - 1.4, 7.6, 9.6)
  q(win, x0 + 1.5, x1 - 1.5, 0, 5.6, 0.03)
}

// ---------------------------------------------------------------------------
// Libeskind's additions

// The low slanted volume on the north-west side, falling to the south-west
// (grey steel in the photos, behind the cube).
{
  const x0 = NW, x1 = -3.4, y0 = -40.5, y1 = -8.4, z0 = 7.6, z1 = 13.9
  const top = (y: number) => z0 + ((y - y0) / (y1 - y0)) * (z1 - z0)
  const A: V3 = [x0, y0, 0], B: V3 = [x1, y0, 0], C: V3 = [x1, y1, 0], D: V3 = [x0, y1, 0]
  const At: V3 = [x0, y0, top(y0)], Bt: V3 = [x1, y0, top(y0)], Ct: V3 = [x1, y1, top(y1)], Dt: V3 = [x0, y1, top(y1)]
  steel.quad(A, B, Bt, At); steel.quad(B, C, Ct, Bt); steel.quad(C, D, Dt, Ct); steel.quad(D, A, At, Dt)
  steel.quad(At, Bt, Ct, Dt)
}

// The Yud: one cube, 16 m a side, balanced on its bottom edge at the
// substation's south-west end and tipped 36 degrees, so that one face leans
// out over Yerba Buena Lane and its top corner stands well above the cornice;
// turned 8 degrees off the old building's grid. A few small window slots.
{
  const S = 16, phi = (36 * Math.PI) / 180, psi = (8 * Math.PI) / 180, xm = 4.3, y0 = -31.6
  const cph = Math.cos(phi), sph = Math.sin(phi), cps = Math.cos(psi), sps = Math.sin(psi)
  /** cube coords: a across (-S/2..S/2), s along the tipped section, t up it (0..S) */
  const W = (a: number, s: number, t: number): V3 => {
    const b = s * cph - t * sph, c = s * sph + t * cph
    return [xm + a * cps - b * sps, y0 + a * sps + b * cps, c]
  }
  const centre = W(0, S / 2, S / 2)
  const h = S / 2
  const faces: V3[][] = [
    [W(-h, 0, 0), W(h, 0, 0), W(h, S, 0), W(-h, S, 0)], [W(-h, 0, S), W(h, 0, S), W(h, S, S), W(-h, S, S)],
    [W(-h, 0, 0), W(h, 0, 0), W(h, 0, S), W(-h, 0, S)], [W(-h, S, 0), W(h, S, 0), W(h, S, S), W(-h, S, S)],
    [W(-h, 0, 0), W(-h, S, 0), W(-h, S, S), W(-h, 0, S)], [W(h, 0, 0), W(h, S, 0), W(h, S, S), W(h, 0, S)],
  ]
  const outward = (f: V3[]) => {
    const u = [f[1][0] - f[0][0], f[1][1] - f[0][1], f[1][2] - f[0][2]], w = [f[2][0] - f[0][0], f[2][1] - f[0][1], f[2][2] - f[0][2]]
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]]
    const m = [0, 1, 2].map((k) => (f[0][k] + f[2][k]) / 2 - centre[k])
    return n[0] * m[0] + n[1] * m[1] + n[2] * m[2] > 0
  }
  for (const f of faces) {
    const q = outward(f) ? f : [...f].reverse()
    blue.quad(q[0], q[1], q[2], q[3])
  }
  // window slots, flush on the plaza-side end face (a = +h) and the upper face (t = S)
  const slot = (p: (x: number, y: number) => V3, x: number, y: number, w: number, hh: number) => {
    const f = [p(x - w / 2, y - hh / 2), p(x + w / 2, y - hh / 2), p(x + w / 2, y + hh / 2), p(x - w / 2, y + hh / 2)]
    const q = outward(f) ? f : [...f].reverse()
    win.quad(q[0], q[1], q[2], q[3])
  }
  const off = 0.07
  const endFace = (s: number, t: number): V3 => W(h + off, s, t)
  const topFace = (a: number, s: number): V3 => W(a, s, S + off)
  for (const [s, t] of [[4, 11.5], [9.5, 6], [12, 12.5], [6, 4]] as [number, number][]) slot(endFace, s, t, 1.1, 2.4)
  for (const [a, s] of [[-4, 5], [2.5, 10], [5, 3.5]] as [number, number][]) slot(topFace, a, s, 1.1, 2.4)
}

const parts = [
  { part: brick, material: finish('substation-brick', 0xbd705c) },
  { part: white, material: PALETTE.trim },
  { part: blue, material: finish('yud-navy', 0x435a82, 0.45) },
  { part: steel, material: finish('steel-grey', 0x8f979e, 0.5) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
]
const glb = writeGlb('Contemporary Jewish Museum', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 22.4,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/118106934'],
})
const tris = report('CJM', parts, glb, 5000)
const out = new URL('../models/sf-contemporary-jewish-museum.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
