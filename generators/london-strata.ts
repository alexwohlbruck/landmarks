/**
 * Strata SE1 ("the Razor"), Walworth Road, Elephant and Castle — original
 * procedural geometry, CC0-1.0.
 * bun generators/london-strata.ts
 *
 * Map frame turned to the building: +y points along the tower's axis to the
 * pointed north-north-east end (BEARING 13, from the OSM outline: the plan is
 * mirror-symmetric about this axis to ±0.2 m, and OSM's skillion roof:direction
 * is 12), +x is the east side, z up, metres. Origin = centroid of the OSM
 * outline way/37726480.
 *
 * Evidence
 * - OSM way/37726480 (outline, building=apartments, height 148, 43 levels,
 *   roof:material metal, wikidata Q2284719), its parts way/347940186 (the
 *   tower, 43 levels, roof:shape skillion, roof:direction 12, roof:height 28)
 *   and way/347940185 (a 3-level metal-clad lens along the south face). In
 *   this frame the plan is a pointed "gothic arch": half-width 17.8 m at the
 *   south face, a slot 3.4 m wide and 2.4 m deep at the tip (y = 19.6), a
 *   south face concave by 2 m (y = -10.1 on the axis, -12.1 at the corners).
 * - "Floor plan for strata se1.png", Family Mosaic, public domain (Commons):
 *   confirms the pointed plan, the slot at the tip and the concave south face.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0. Sparse over this roof (dark metal, few returns), but it reads the
 *   roof at 133–135 m above the street just behind the south edge and
 *   146.7 m at the south-east horn; street 2.3–3.0 m above ground_min.
 * - Published: 148 m, 43 storeys, BFLS 2010; three 9 m, five-bladed wind
 *   turbines in the crown (Wikipedia "Strata SE1").
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "Strata SE1 from Monument 2014.jpg", Colin, CC BY-SA 4.0 — the tip end
 *     from the north-north-east, level and distant: the sloped dark roof
 *     "shield", the three rings, the white-and-dark banding, the slot;
 *   "Strata SE1 from Kennington 2020.jpg", TheFrog001, CC0 — the south face:
 *     dark grey crown blade with three round openings, concave top, red-lit
 *     horns, dark glazed face below;
 *   "Strata SE1 from the London Eye - geograph.org.uk - 2948482.jpg", Keith
 *     Edkins, CC BY-SA 2.0 — from the north-west and above: the roof's fall
 *     to the tip and the slanted top of the white cladding;
 *   "Strata SE1 - geograph.org.uk - 3971677.jpg", Mr Biz, CC BY-SA 2.0 — the
 *     scooped roof with the rings seen as ellipses on it;
 *   "Cmglee Strata SE1 exterior.jpg", Cmglee, CC BY-SA 3.0 — the tip at the
 *     foot: dark slot, white panels, dark glazed ground floor;
 *   "London - Strata SE1.jpg", Fred Romero, CC BY 2.0 — west side.
 *
 * Measured: plan (OSM), roof fall and horn height (OSM roof:height 28, lidar,
 * photos). Published: 148 m (taken to the top of the horn lights), 43 storeys.
 * Estimated from the photos: opening diameter 8.8 m (photos ~9.2), spacing
 * 9.8 m (photos ~10.5; drawn a little tighter so the outer tubes stay inside
 * the sloped roof), centres 7.6 m below the middle of the top edge, the top
 * edge's 6 m dip, the blade's 17 m depth, the white cladding's slanted top
 * (8 m below the roof edge at the south corners, 26 m at the tip, so the
 * dark glazing makes the "shield" seen from the north), the strips' stagger.
 * Invented: the exact strip pattern (drawn as staggered dark strips on white,
 * one every 3.4 m of girth); the turbines' supporting post.
 * Doubts: the Kennington photo shows the west horn higher than the east; the
 * Monument view shows them level, and the model is symmetric.
 */
import { Part, writeGlb, addGltfTriangles, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 13
const ANCHOR = { lng: -0.0994742, lat: 51.4929446 }

const white = new Part() // white cladding, turbines
const lining = new Part() // the tubes' grey linings
const dark = new Part() // dark window glazing and strips
const metal = new Part() // charcoal crown blade, roof, slot, podium
const lobby = new Part()
const red = new Part()

// --- Plan and roof surfaces ---
const W = 17.8
const ysF = (x: number) => -10.1 - 2.0 * (x / W) ** 2 // the concave south face
const ZM = 140.6, DIP = 5.9, K = 0.74 // middle of the south top edge, its dip to the horns, the roof's fall per metre
const zr = (x: number, y: number) => ZM + DIP * (x / W) ** 2 - K * (y - ysF(x))
const yr = (x: number, z: number) => ysF(x) + (ZM + DIP * (x / W) ** 2 - z) / K
const ztop = (x: number) => zr(x, ysF(x))
const TIPY = 19.6
const G0 = 8, G1 = 26 // the white cladding stops this far below the roof edge: at the south corners, at the tip

// East side of the plan, by x (monotone), smoothed from the OSM outline.
const CTRL: [number, number][] = [[1.75, 19.6], [6.3, 16.1], [10.0, 12.75], [12.7, 8.85], [14.45, 5.5], [15.6, 2.0], [16.6, -1.9], [17.35, -5.6], [17.72, -9.0], [W, -12.1]]
const EAST: [number, number][] = [[1.6, 17.2]]
for (let i = 0; i < CTRL.length - 1; i++) {
  const p0 = CTRL[Math.max(0, i - 1)], p1 = CTRL[i], p2 = CTRL[i + 1], p3 = CTRL[Math.min(CTRL.length - 1, i + 2)]
  const steps = i === 0 ? 1 : 2
  for (let s = 0; s < steps; s++) {
    const t = s / steps
    const cr = (a: number, b: number, c: number, d: number) =>
      0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t)
    EAST.push([cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])])
  }
}
EAST.push([W, -12.1])
for (let i = 1; i < EAST.length; i++) if (EAST[i][0] <= EAST[i - 1][0]) throw new Error('plan not monotone')
/** The north-most plan point at x: the side wall (or the slot's floor). */
function ySide(x: number) {
  const ax = Math.abs(x)
  if (ax <= EAST[0][0]) return EAST[0][1]
  for (let i = 1; i < EAST.length; i++)
    if (ax <= EAST[i][0] + 1e-9) {
      const t = (ax - EAST[i - 1][0]) / (EAST[i][0] - EAST[i - 1][0])
      return EAST[i - 1][1] + t * (EAST[i][1] - EAST[i - 1][1])
    }
  return EAST[EAST.length - 1][1]
}
const zlow = (x: number) => zr(x, ySide(x))

// --- The three turbine openings ---
const CR = 4.4, CSP = 9.8, CZ = ZM - 7.6, NSEG = 16
const CIRCLES = [-CSP, 0, CSP]

// Column x positions: the plan's, the circles', and fill to ≤1.4 m.
let xs: number[] = []
for (const [x] of EAST) xs.push(x, -x)
for (const cx of CIRCLES) for (let k = 0; k <= NSEG / 2; k++) xs.push(cx + CR * Math.cos((k / (NSEG / 2)) * Math.PI))
xs.sort((a, b) => a - b)
xs = xs.filter((x, i) => i === 0 || x - xs[i - 1] > 0.05)
for (let i = 0; i < xs.length - 1; i++) {
  const gap = xs[i + 1] - xs[i]
  if (gap > 1.4) {
    const n = Math.ceil(gap / 1.4)
    const add = Array.from({ length: n - 1 }, (_, k) => xs[i] + (gap * (k + 1)) / n)
    xs.splice(i + 1, 0, ...add)
    i += n - 1
  }
}
xs = xs.map((x) => (Math.abs(x) < 1e-9 ? 0 : x))

/** The circle (if any) spanning x: its bottom and top z there. */
function hole(x: number, xm: number): { cx: number; zb: number; zt: number } | null {
  for (const cx of CIRCLES) {
    if (xm > cx - CR && xm < cx + CR) {
      const h = Math.sqrt(Math.max(0, CR * CR - (x - cx) ** 2))
      return { cx, zb: CZ - h, zt: CZ + h }
    }
  }
  return null
}
for (const x of xs) {
  const h = hole(x, x)
  if (h && h.zb < zlow(x) + 0.4) throw new Error(`opening breaks the side wall at x=${x.toFixed(2)}`)
}

// --- Helpers ---
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
/** A quad wound so its face points along `hint`. */
function quadOut(p: Part, a: V3, b: V3, c: V3, d: V3, hint: V3) {
  const n = cross(sub(b, a), sub(c, a))
  const n2 = cross(sub(c, a), sub(d, a))
  const s: V3 = [n[0] + n2[0], n[1] + n2[1], n[2] + n2[2]]
  if (dot(s, hint) >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}
function box(p: Part, c: V3, h: V3) {
  const [x, y, z] = c, [a, b, e] = h
  const P = (i: number, j: number, k: number): V3 => [x + i * a, y + j * b, z + k * e]
  quadOut(p, P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1), [0, 0, 1])
  quadOut(p, P(-1, -1, -1), P(1, -1, -1), P(1, 1, -1), P(-1, 1, -1), [0, 0, -1])
  quadOut(p, P(1, -1, -1), P(1, 1, -1), P(1, 1, 1), P(1, -1, 1), [1, 0, 0])
  quadOut(p, P(-1, -1, -1), P(-1, 1, -1), P(-1, 1, 1), P(-1, -1, 1), [-1, 0, 0])
  quadOut(p, P(-1, 1, -1), P(1, 1, -1), P(1, 1, 1), P(-1, 1, 1), [0, 1, 0])
  quadOut(p, P(-1, -1, -1), P(1, -1, -1), P(1, -1, 1), P(-1, -1, 1), [0, -1, 0])
}

// --- Side walls (the curved sides and the tip, with the slot) ---
const LOBBY = 5.5
const zWhite = (x: number, y: number) => zr(x, y) - G0 - (G1 - G0) * Math.max(0, (y - ysF(x)) / (TIPY - ysF(0))) ** 1.4
{
  const ring = [...xs].reverse().map((x) => [x, ySide(x)] as [number, number])
  for (let i = 0; i < ring.length - 1; i++) {
    const [xa, ya] = ring[i], [xb, yb] = ring[i + 1]
    const hint: V3 = [yb - ya, -(xb - xa), 0] // outward for an anticlockwise ring
    const slot = Math.abs(xa) <= 1.76 && Math.abs(xb) <= 1.76
    const A = (z: number): V3 => [xa, ya, z], B = (z: number): V3 => [xb, yb, z]
    const ta = zr(xa, ya), tb = zr(xb, yb)
    if (slot) {
      quadOut(metal, A(0), B(0), B(tb), A(ta), hint)
      continue
    }
    const wa = Math.min(ta, zWhite(xa, ya)), wb = Math.min(tb, zWhite(xb, yb))
    quadOut(lobby, A(0), B(0), B(LOBBY), A(LOBBY), hint)
    quadOut(white, A(LOBBY), B(LOBBY), B(wb), A(wa), hint)
    if (ta - wa > 0.05 || tb - wb > 0.05) quadOut(dark, A(wa), B(wb), B(tb), A(ta), hint)
  }
}

// --- Dark strips on the white cladding: staggered, as the real panels jog ---
{
  // Arc length along the east side from the slot's outer edge to the corner.
  const pts = EAST.slice(1)
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const at = (s: number): [number, number] => {
    for (let i = 1; i < pts.length; i++)
      if (s <= cum[i]) {
        const t = (s - cum[i - 1]) / (cum[i] - cum[i - 1])
        return [pts[i - 1][0] + t * (pts[i][0] - pts[i - 1][0]), pts[i - 1][1] + t * (pts[i][1] - pts[i - 1][1])]
      }
    return pts[pts.length - 1]
  }
  const total = cum[cum.length - 1]
  const PER = 3.3, SW = 1.45, OFF = 0.05
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  for (let s = 1.9; s + SW / 2 < total - 1.2; s += PER) {
    const pieces: [number, number][] = []
    let z = LOBBY + 0.8 + rnd() * 9
    while (z < 150) {
      const l = 10 + rnd() * 16
      pieces.push([z, z + l])
      z += l + 2.2 + rnd() * 1.4
    }
    for (const side of [1, -1]) {
      let [xa, ya] = at(s - SW / 2), [xb, yb] = at(s + SW / 2)
      xa *= side
      xb *= side
      if (side < 0) [xa, ya, xb, yb] = [xb, yb, xa, ya]
      let nx = yb - ya, ny = -(xb - xa)
      const l = Math.hypot(nx, ny)
      if (nx * (xa + xb) / 2 + ny * ((ya + yb) / 2 - 2) < 0) { nx = -nx; ny = -ny }
      const o: [number, number] = [nx / l, ny / l]
      const top = Math.min(zWhite(xa, ya), zWhite(xb, yb)) - 0.8
      for (const [z0, z1raw] of pieces) {
        const z1 = Math.min(z1raw, top)
        if (z1 - z0 < 3) continue
        const A = (z: number): V3 => [xa + o[0] * OFF, ya + o[1] * OFF, z], B = (z: number): V3 => [xb + o[0] * OFF, yb + o[1] * OFF, z]
        quadOut(dark, A(z0), B(z0), B(z1), A(z1), [o[0], o[1], 0])
      }
    }
  }
}

// --- South face: glazed, white edge frames, three pale bands; the blade above ---
const BLADE = 17
const zBlade = (x: number) => ztop(x) - BLADE
for (let i = 0; i < xs.length - 1; i++) {
  const xa = xs[i], xb = xs[i + 1], xm = (xa + xb) / 2
  const A = (z: number): V3 => [xa, ysF(xa), z], B = (z: number): V3 => [xb, ysF(xb), z]
  const out: V3 = [0, -1, 0]
  const frame = Math.abs(xm) > W - 1.5
  quadOut(lobby, A(0), B(0), B(LOBBY), A(LOBBY), out)
  quadOut(frame ? white : dark, A(LOBBY), B(LOBBY), B(zBlade(xb)), A(zBlade(xa)), out)
  if (!frame)
    for (let zb = LOBBY + 9.6; zb < 118; zb += 9.6) {
      if (zb + 0.6 > zBlade(xa) - 1 || zb + 0.6 > zBlade(xb) - 1) continue
      const C = (x: number, z: number): V3 => [x, ysF(x) - 0.05, z]
      quadOut(white, C(xa, zb), C(xb, zb), C(xb, zb + 0.55), C(xa, zb + 0.55), out)
    }
  // The blade, around the openings.
  const h0 = hole(xa, xm), h1 = hole(xb, xm)
  if (h0 && h1) {
    quadOut(metal, A(zBlade(xa)), B(zBlade(xb)), B(h1.zb), A(h0.zb), out)
    quadOut(metal, A(h0.zt), B(h1.zt), B(ztop(xb)), A(ztop(xa)), out)
  } else quadOut(metal, A(zBlade(xa)), B(zBlade(xb)), B(ztop(xb)), A(ztop(xa)), out)
}

// --- Roof: the sloped scoop from the south edge down to the tip, pierced ---
{
  const R = (x: number, z: number): V3 => [x, yr(x, z), z]
  const up: V3 = [0, 0.6, 0.8]
  for (let i = 0; i < xs.length - 1; i++) {
    const xa = xs[i], xb = xs[i + 1], xm = (xa + xb) / 2
    const la = zlow(xa), lb = zlow(xb), ta = ztop(xa), tb = ztop(xb)
    const h0 = hole(xa, xm), h1 = hole(xb, xm)
    const piece = (a0: number, b0: number, b1: number, a1: number) => {
      if (b1 - b0 < 1e-3 && a1 - a0 < 1e-3) return
      if (b1 - b0 < 1e-3) metal.tri(...wind(R(xa, a0), R(xb, b0), R(xa, a1)))
      else if (a1 - a0 < 1e-3) metal.tri(...wind(R(xa, a0), R(xb, b0), R(xb, b1)))
      else quadOut(metal, R(xa, a0), R(xb, b0), R(xb, b1), R(xa, a1), up)
    }
    if (h0 && h1) {
      piece(la, lb, h1.zb, h0.zb)
      piece(h0.zt, h1.zt, tb, ta)
    } else piece(la, lb, tb, ta)
  }
  function wind(a: V3, b: V3, c: V3): [V3, V3, V3] {
    return dot(cross(sub(b, a), sub(c, a)), up) >= 0 ? [a, b, c] : [a, c, b]
  }
  // Tube linings between the blade and the roof.
  for (let i = 0; i < xs.length - 1; i++) {
    const xa = xs[i], xb = xs[i + 1], xm = (xa + xb) / 2
    const h0 = hole(xa, xm), h1 = hole(xb, xm)
    if (!h0 || !h1) continue
    for (const [za, zb] of [[h0.zt, h1.zt], [h0.zb, h1.zb]]) {
      const inward: V3 = [h0.cx - xm, 0, CZ - (za + zb) / 2]
      quadOut(lining, [xa, ysF(xa), za], [xb, ysF(xb), zb], R(xb, zb), R(xa, za), inward)
    }
  }
}

// --- Turbines: hub, nacelle, post and five blades, a few metres into each tube ---
for (const cx of CIRCLES) {
  const yt = ysF(cx) + 3.0
  box(white, [cx, yt + 1.0, CZ], [0.6, 1.4, 0.6]) // nacelle
  box(white, [cx, yt + 1.6, (CZ - CR + CZ) / 2 - 0.3], [0.22, 0.22, (CR - 0.3) / 2]) // post
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2 + Math.PI / 2 + (cx / CSP) * 0.4
    const u: [number, number] = [Math.cos(a), Math.sin(a)], v: [number, number] = [-u[1], u[0]]
    const r0 = 0.5, r1 = CR - 0.45, w0 = 0.42, w1 = 0.2, t = 0.12
    const P = (r: number, w: number, d: number): V3 => [cx + u[0] * r + v[0] * w, yt + d, CZ + u[1] * r + v[1] * w]
    const ring = (r: number, w: number) => [P(r, -w, -t), P(r, w, -t), P(r, w, t), P(r, -w, t)]
    const r0s = ring(r0, w0), r1s = ring(r1, w1)
    for (let j = 0; j < 4; j++) {
      const l = (j + 1) % 4
      const mid: V3 = [(r0s[j][0] + r0s[l][0] + r1s[j][0] + r1s[l][0]) / 4, (r0s[j][1] + r0s[l][1] + r1s[j][1] + r1s[l][1]) / 4, (r0s[j][2] + r0s[l][2] + r1s[j][2] + r1s[l][2]) / 4]
      const axisPt: V3 = [cx + u[0] * ((r0 + r1) / 2), yt, CZ + u[1] * ((r0 + r1) / 2)]
      quadOut(white, r0s[j], r0s[l], r1s[l], r1s[j], sub(mid, axisPt))
    }
    quadOut(white, r1s[0], r1s[1], r1s[2], r1s[3], [u[0], 0, u[1]])
  }
  box(white, [cx, yt - 0.3, CZ], [0.55, 0.3, 0.55]) // hub
}

// --- Red aviation lights on the horns ---
for (const s of [1, -1]) box(red, [s * (W - 0.55), ysF(W) + 0.7, ztop(W) + 0.55], [0.4, 0.4, 0.75])

// --- The 3-storey metal lens along the south face (way/347940185) ---
{
  const yo = (x: number) => -14.1 + 2.0 * (x / (W - 1.5)) ** 2
  const H = 9.5
  const lx = [...xs.filter((x) => Math.abs(x) < W - 1.5)]
  lx.unshift(-(W - 1.5))
  lx.push(W - 1.5)
  for (let i = 0; i < lx.length - 1; i++) {
    const xa = lx[i], xb = lx[i + 1]
    const oa: V3 = [xa, yo(xa), 0], ob: V3 = [xb, yo(xb), 0]
    quadOut(metal, oa, ob, [xb, yo(xb), H], [xa, yo(xa), H], [0, -1, 0])
    quadOut(metal, [xa, yo(xa), H], [xb, yo(xb), H], [xb, ysF(xb), H], [xa, ysF(xa), H], [0, 0, 1])
  }
}

function smooth(p: Part, crease = 35): Part {
  const out = new Part()
  const n = p.pos.length / 3
  addGltfTriangles(out, new Float32Array(p.pos), Uint32Array.from({ length: n }, (_, i) => i), { creaseDegrees: crease })
  return out
}

const parts = [
  { part: smooth(white, 30), material: finish('strata-white', 0xe6e8ea, 0.5) },
  { part: smooth(dark, 30), material: PALETTE.window },
  { part: smooth(metal, 30), material: finish('strata-charcoal', 0x50565e, 0.6) },
  { part: smooth(lining, 50), material: PALETTE.roof },
  { part: lobby, material: PALETTE.entrance },
  { part: red, material: finish('neon-red', 0xc8483a) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Strata SE1', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: ztop(W) + 1.3,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/37726480', 'way/347940186', 'way/347940185'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/london-strata.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, top ${(ztop(W) + 1.3).toFixed(1)} m`)
