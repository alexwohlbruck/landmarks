/**
 * Rijksmuseum, Amsterdam — procedural, CC0-1.0, no textures.
 * bun generators/amsterdam-rijksmuseum.ts
 *
 * Pierre Cuypers' national museum of 1876–1885: a long, symmetrical
 * red-brick block with two glass-roofed courtyards, the public passage
 * running through the middle under the Gallery of Honour, two tall towers
 * on the city (Stadhouderskade) front, two lower towers on the Museumplein
 * front, corner pavilions with steep slate roofs, and long glazed roof
 * bands over the galleries.
 *
 * Map frame: x = model east, y = model north, z up, metres. Model north
 * (+y) is the Stadhouderskade front, which faces bearing 39.5° (north-east);
 * the Museumplein front faces −y. Placed at bearing 39.55°, the outline's
 * long walls (length-weighted mean of the BAG outline's edges). Anchor: the
 * outline's area centroid moved 6.1 m along the long axis onto the axis of
 * symmetry (the line through both pairs of towers and the passage), so the
 * model can be mirrored exactly about x = 0.
 *
 * Evidence
 * - OSM way/431070185 (Rijksmuseumgebouw, building=museum, the BAG outline;
 *   way/29989787 is the museum site area, not a building) and its 30
 *   building:parts (749429987–749430001, 749805753–749805764, 431070791,
 *   431070942, 517791046): towers 54 m (roof 20), Museumplein towers and
 *   corner towers 43 m, corner pavilions 38 m, ranges 27 m (roof 8), the
 *   courtyards 27 m gabled, the central blocks 32 m, the south porch 17 m.
 * - 3D BAG (3dbag.nl, CC BY 4.0), building NL.IMBAG.Pand.0363100012237298,
 *   LoD2.2 roof surfaces reconstructed from AHN5 lidar (2023, 18 pts/m²),
 *   sampled on a 1 m grid in this frame. Measured: tower tips 54.3, city
 *   range ridge 28.2 at y 32, eaves 19.9 (the 24–25 m readings along the
 *   front are the lucarnes, Derbrauni's photo); courtyard roofs gabled, ridge 28.3 at y 4.5, eaves 19.8;
 *   Gallery of Honour ridge 28.0 on x = 0, eaves 20.3; side wings ridge 28.4
 *   at x ±55.8, eaves 19.1–20; Museumplein ranges ridge 28.1 at y −16,
 *   eaves 19.7; corner pavilions eave about 28.5, flat crested top 39.1
 *   about 6 × 6 m; Museumplein towers 41.5; south-east corner tower 39.5,
 *   south-west corner tower 34.4 (it really is lower: Museumplein photos);
 *   south-east corner block 30.4. Ground NAP +0.19 m, flat.
 * - Published: architect P.J.H. Cuypers, built 1876–1885, renovated
 *   2003–2013 by Cruz y Ortiz, when the courtyards were reopened as atria
 *   under glass roofs (nl/en.wikipedia "Rijksmuseum", "Rijksmuseumgebouw").
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - C messier, "Rijksmuseum from Museumplein 2523.jpg", CC BY-SA 4.0 —
 *     the Museumplein front, distant and level: tower stack, glazed roof
 *     bands, porch. https://commons.wikimedia.org/wiki/File:Rijksmuseum_from_Museumplein_2523.jpg
 *   - olexdj, "Rijksmuseum Amsterdam.jpeg", CC BY-SA 4.0 — the same front,
 *     evening sun. https://commons.wikimedia.org/wiki/File:Rijksmuseum_Amsterdam.jpeg
 *   - Derbrauni, "Rijksmuseum Amsterdam 01.jpg", CC BY 4.0 — down the passage
 *     from the south. https://commons.wikimedia.org/wiki/File:Rijksmuseum_Amsterdam_01.jpg
 *   - Derbrauni, "North facade of the Rijksmuseum Amsterdam 01.jpg", CC BY 4.0
 *     — the Stadhouderskade front straight on: tower stages, central gable,
 *     pavilions. https://commons.wikimedia.org/wiki/File:North_facade_of_the_Rijksmuseum_Amsterdam_01.jpg
 *   - Vasyatka1, "North facade of the Rijksmuseum Amsterdam (1).jpg",
 *     CC BY-SA 4.0. https://commons.wikimedia.org/wiki/File:North_facade_of_the_Rijksmuseum_Amsterdam_(1).jpg
 *   - Charlotte Heineccius, "Rijksmuseum Amsterdam North facade at
 *     Stadhouderskade, clock tower.jpg" and "..., east tower.jpg", CC BY-SA
 *     4.0 — the east tower's clock dormers (north and east faces), its bell
 *     roof, corner turrets and lantern.
 *     https://commons.wikimedia.org/wiki/File:Rijksmuseum_Amsterdam_North_facade_at_Stadhouderskade,_clock_tower.jpg
 *     https://commons.wikimedia.org/wiki/File:Rijksmuseum_Amsterdam_North_facade_at_Stadhouderskade,_east_tower.jpg
 *   - Alf van Beem, "Rijksmuseum vanaf de Hobbemakade pic1.JPG", public
 *     domain — a corner pavilion and the city front receding past the
 *     towers; despite the title the view matches the north-east corner seen
 *     from the east. https://commons.wikimedia.org/wiki/File:Rijksmuseum_vanaf_de_Hobbemakade_pic1.JPG
 *   - Alf van Beem, "Rijksmuseum vanaf de Ruysdaelkade pic1.JPG", public
 *     domain — the east wing: glazed roof band, mural panels, corner tower.
 *     https://commons.wikimedia.org/wiki/File:Rijksmuseum_vanaf_de_Ruysdaelkade_pic1.JPG
 *   - Julien Chatelain, "Rijksmuseum (28692264928).jpg", CC BY-SA 2.0 — the
 *     south-east from the garden. https://commons.wikimedia.org/wiki/File:Rijksmuseum_(28692264928).jpg
 *   - C messier, "Rijksmuseum winter 7441.jpg", CC BY-SA 4.0 — Museumplein
 *     front, raised. https://commons.wikimedia.org/wiki/File:Rijksmuseum_winter_7441.jpg
 *   - KLM Aerocarto, "Luchtfoto van het Rijksmuseum 1921.jpg", public domain
 *     — the roof plan from the south: glazed ranges, gallery and courtyards.
 *     https://commons.wikimedia.org/wiki/File:Luchtfoto_van_het_Rijksmuseum_1921.jpg
 *   - Steven Lek, "Rijksmuseum Amsterdam by night 2017.jpg", CC BY-SA 4.0 —
 *     the night look. https://commons.wikimedia.org/wiki/File:Rijksmuseum_Amsterdam_by_night_2017.jpg
 *
 * Estimated from the photos, scaled to the 3D BAG heights: corner pavilion
 * eaves 27.6 (three storeys against the ranges' two); the city towers'
 * stack (shaft cornice 34.5, a steep slate bell to 39.2, a slate pyramid to
 * 45.6, stone collar, an open lantern 46.2–48.6, a flared cap, a needle
 * spire to 54.2, vane to 56.3); the Museumplein towers' shafts 31 m and
 * their crested roofs to 40; the south porch 17.5 m with the passage arch
 * 9 m wide and 8.8 m to the crown; the central south bay's cornice 22.7;
 * window rows, storey bands and dormer counts (counted on the photos). The
 * passage is drawn the same 9 m wide right through; inside it is plain.
 *
 * Colour: red-brown brick pulled light but still brick red; white stone
 * bands, quoins and cornices; blue-grey slate; pale greenish roof glazing.
 *
 * Doubts: the courtyard (inner) slopes of the city ranges are glazed as in
 * the 1921 aerial; no current photo shows them. The south-west corner (the
 * Asian Pavilion, the low wings and the annex south of the west wing, all
 * inside the BAG outline) is drawn plainly from OSM and 3D BAG heights; the
 * annex has no close photo. The north mouth of the passage is drawn like
 * the south one (the photos show the arcade only partly). Statues, tile
 * tableaux and the Museumplein lettering are left out; the murals on the
 * side wings are pale panels.
 *
 * Night: the fronts are floodlit (Lek), so brick and stone carry a
 * floodlight wash; windows, the passage walls and the tower lanterns glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, massing, capPoly, unit, type XY } from './nyc-570-lexington'
import { block, rectPanel, archPanel, band, parapet } from './nyc-city-hall'

const brick = new Part(), stone = new Part(), slate = new Part(), win = new Part(), glass = new Part(), gilt = new Part()

// ---------------------------------------------------------------- helpers
const cr = (a: V3, b: V3, c: V3): V3 => {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
}
/** A convex polygon as a fan, turned to face `out`. */
function poly(p: Part, pts: V3[], out: V3) {
  const n = cr(pts[0], pts[1], pts[2])
  const q = n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0 ? pts : [...pts].reverse()
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}
/** Triangles from one apex to each edge of a chain, each turned to face `out`. */
function fan(p: Part, apex: V3, chain: V3[], out: V3) {
  for (let k = 0; k < chain.length - 1; k++) poly(p, [apex, chain[k], chain[k + 1]], out)
}
const MX = (x: number) => -x
/** Mirror a wall a→b (counter-clockwise, facing out) to the other side of x = 0. */
const mirrorWall = (a: XY, b: XY): [XY, XY] => [[-b[0], b[1]], [-a[0], a[1]]]
const both = (f: (s: 1 | -1) => void) => { f(1); f(-1) }

/** A point on a quad roof slope: u along the eave (A→B), v up the slope (A→D). */
function onQuad(A: V3, B: V3, C: V3, D: V3, u: number, v: number, lift = 0.06): V3 {
  const e: V3 = [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u, A[2] + (B[2] - A[2]) * u]
  const r: V3 = [D[0] + (C[0] - D[0]) * u, D[1] + (C[1] - D[1]) * u, D[2] + (C[2] - D[2]) * u]
  const p: V3 = [e[0] + (r[0] - e[0]) * v, e[1] + (r[1] - e[1]) * v, e[2] + (r[2] - e[2]) * v]
  const n = unit(cr(A, B, D))
  const s = n[2] >= 0 ? 1 : -1
  return [p[0] + n[0] * lift * s, p[1] + n[1] * lift * s, p[2] + n[2] * lift * s]
}
/** Panels set on a roof slope (glazing bands). */
function slopePanels(p: Part, A: V3, B: V3, C: V3, D: V3, n: number, u0: number, u1: number, v0: number, v1: number, gap: number) {
  const span = (u1 - u0) / n
  for (let k = 0; k < n; k++) {
    const a = u0 + span * k + (k ? gap / 2 : 0), b = u0 + span * (k + 1) - (k < n - 1 ? gap / 2 : 0)
    poly(p, [onQuad(A, B, C, D, a, v0), onQuad(A, B, C, D, b, v0), onQuad(A, B, C, D, b, v1), onQuad(A, B, C, D, a, v1)], [0, 0, 1])
  }
}

/**
 * A gabled roof with its ridge along x (axis 'x') or y, between eave lines
 * at `lo`/`hi` on the cross axis; the ridge may sit off centre and the two
 * eaves may differ. Returns the two slopes as quads (eave first) for
 * glazing. `ends` draws brick gable triangles at the start/end of the ridge.
 */
function gable(o: { axis: 'x' | 'y'; a0: number; a1: number; lo: number; hi: number; zLo: number; zHi: number; ridge: number; zR: number; ends?: [boolean, boolean]; over?: number; part?: Part }) {
  const p = o.part ?? slate, ov = o.over ?? 0.3
  const P = (a: number, c: number, z: number): V3 => (o.axis === 'x' ? [a, c, z] : [c, a, z])
  // Eaves overhang a little past the walls, a touch lower.
  const sLo = (o.zR - o.zLo) / (o.ridge - o.lo), sHi = (o.zR - o.zHi) / (o.hi - o.ridge)
  const eLo = o.lo - ov, zeLo = o.zLo - ov * sLo, eHi = o.hi + ov, zeHi = o.zHi - ov * sHi
  const lo: [V3, V3, V3, V3] = [P(o.a0, eLo, zeLo), P(o.a1, eLo, zeLo), P(o.a1, o.ridge, o.zR), P(o.a0, o.ridge, o.zR)]
  const hi: [V3, V3, V3, V3] = [P(o.a1, eHi, zeHi), P(o.a0, eHi, zeHi), P(o.a0, o.ridge, o.zR), P(o.a1, o.ridge, o.zR)]
  const crossOut = (sgn: number): V3 => (o.axis === 'x' ? [0, sgn, 1] : [sgn, 0, 1])
  poly(p, lo, crossOut(-1)); poly(p, hi, crossOut(1))
  const [e0, e1] = o.ends ?? [false, false]
  const endTri = (a: number, sgn: number) => poly(brick, [P(a, o.lo, o.zLo), P(a, o.hi, o.zHi), P(a, o.ridge, o.zR)], o.axis === 'x' ? [sgn, 0, 0] : [0, sgn, 0])
  if (e0) endTri(o.a0, -1)
  if (e1) endTri(o.a1, 1)
  return { lo, hi }
}

/** A truncated pyramid roof from a rectangle at z0 to a rectangle at z1 (flat top in `top`). */
function trunc(p: Part, b: [number, number, number, number], z0: number, t: [number, number, number, number], z1: number, top: Part | null = p) {
  const B: V3[] = [[b[0], b[1], z0], [b[2], b[1], z0], [b[2], b[3], z0], [b[0], b[3], z0]]
  const T: V3[] = [[t[0], t[1], z1], [t[2], t[1], z1], [t[2], t[3], z1], [t[0], t[3], z1]]
  const cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const m: V3 = [(B[i][0] + B[j][0]) / 2 - cx, (B[i][1] + B[j][1]) / 2 - cy, 0.5]
    poly(p, [B[i], B[j], T[j], T[i]], m)
  }
  if (top) poly(top, T, [0, 0, 1])
  return { B, T }
}
/** A square spike (finial, pinnacle, spire) from half-width r at z0 to an apex. */
function spike(p: Part, x: number, y: number, r: number, z0: number, z1: number) {
  const B: V3[] = [[x - r, y - r, z0], [x + r, y - r, z0], [x + r, y + r, z0], [x - r, y + r, z0]]
  const A: V3 = [x, y, z1]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    poly(p, [B[i], B[j], A], [(B[i][0] + B[j][0]) / 2 - x, (B[i][1] + B[j][1]) / 2 - y, 0.3])
  }
}
const sq = (x: number, y: number, h: number): [number, number, number, number] => [x - h, y - h, x + h, y + h]

/**
 * A gabled dormer (lucarne) on a roof slope. `e` is the eave point under its
 * centre, `t` the unit direction along the eave, `d` the unit direction
 * into the building, `s` the slope (rise per metre inward).
 */
function dormer(e: V3, t: XY, d: XY, s: number, w: number, hc: number, hg: number, front = 0.35, face: Part = stone, withWin = true) {
  const at = (u: number, f: number, z: number): V3 => [e[0] + t[0] * u + d[0] * f, e[1] + t[1] * u + d[1] * f, z]
  const zb = e[2] + s * front - 0.3, zt = zb + hc, za = zt + hg
  const fT = (zt - e[2]) / s, fA = (za - e[2]) / s
  const out: V3 = [-d[0], -d[1], 0]
  poly(face, [at(-w / 2, front, zb), at(w / 2, front, zb), at(w / 2, front, zt), at(0, front, za), at(-w / 2, front, zt)], out)
  for (const k of [-1, 1]) {
    poly(slate, [at((k * w) / 2, front, zt), at(0, front, za), at(0, fA, za), at((k * w) / 2, fT, zt)], [t[0] * k, t[1] * k, 1])
    poly(slate, [at((k * w) / 2, front, zb), at((k * w) / 2, front, zt), at((k * w) / 2, fT, zt)], [t[0] * k, t[1] * k, 0])
  }
  if (withWin) {
    const m = 0.04
    poly(win, [at(-w * 0.3, front - m, zb + 0.35), at(w * 0.3, front - m, zb + 0.35), at(w * 0.3, front - m, zt - 0.1), at(-w * 0.3, front - m, zt - 0.1)], out)
  }
}

// ---------------------------------------------------------------- facades
/** A flat round-headed panel: a rectangle and a true semicircle (fan from its centre). */
function arch(p: Part, a: XY, b: XY, s: number, w: number, z0: number, zTop: number, d = 0.05, segs = 5) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const at = (u: number, z: number): V3 => [a[0] + ux * u + uy * d, a[1] + uy * u - ux * d, z]
  const r = w / 2, spring = Math.max(z0, zTop - r)
  if (spring > z0 + 1e-3) p.quad(at(s - r, z0), at(s + r, z0), at(s + r, spring), at(s - r, spring))
  for (let k = 0; k < segs; k++) {
    const t0 = (k / segs) * Math.PI, t1 = ((k + 1) / segs) * Math.PI
    p.tri(at(s, spring), at(s + r * Math.cos(t0), spring + r * Math.sin(t0)), at(s + r * Math.cos(t1), spring + r * Math.sin(t1)))
  }
}
type Row = { lo: number; hi: number; arch?: boolean; ratio?: number; n?: number; part?: Part }
/** Window rows on a wall a→b: `bays` per row unless the row sets its own count; stone bands. */
function facade(a: XY, b: XY, bays: number, rows: Row[], bands: [number, number][], margin = 0.8) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  for (const r of rows) {
    const n = r.n ?? bays, pitch = (L - 2 * margin) / n, w = pitch * (r.ratio ?? 0.5)
    for (let k = 0; k < n; k++) {
      const s = margin + pitch * (k + 0.5)
      if (r.arch) arch(r.part ?? win, a, b, s, w, r.lo, r.hi, 0.05, w > 2.6 ? 6 : 5)
      else rectPanel(r.part ?? win, a, b, s, w, r.lo, r.hi, 0.05)
    }
  }
  for (const [z0, z1] of bands) rectPanel(stone, a, b, L / 2, L - 0.02, z0, z1, 0.07)
}
/** White stone quoins: strips on both faces at each corner of a rectangle. */
function quoins(x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, w = 0.9) {
  const ring: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  for (let i = 0; i < 4; i++) {
    const a = ring[i], b = ring[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    rectPanel(stone, a, b, w / 2, w, z0, z1, 0.08)
    rectPanel(stone, a, b, L - w / 2, w, z0, z1, 0.08)
  }
}
const both2 = (a: XY, b: XY, f: (a: XY, b: XY) => void) => { f(a, b); const [c, d] = mirrorWall(a, b); f(c, d) }

// ---------------------------------------------------------------- plan
// Half plan (x ≥ 0), mirrored. Values from the BAG outline and OSM parts,
// averaged across the axis.
const PW = 4.5 // half width of the passage
const PASS = 8.8 // passage crown
const XW = 49.4 // inner line of the side wings and pavilions
const boxes: [number, number, number, number, number][] = []
const sym = (x0: number, y0: number, x1: number, y1: number, h: number) => { boxes.push([x0, y0, x1, y1, h], [MX(x1), y0, MX(x0), y1, h]) }
sym(9.9, 31.6, 20.9, 43.4, 34.5) // city towers
sym(9.9, 18.8, 20.9, 31.6, 27.0) // their rear wings
sym(20.9, 18.8, XW, 37.0, 19.9) // city ranges
sym(XW, 18.6, 68.0, 38.6, 27.6) // corner pavilions
sym(9.9, -11.3, XW, 18.8, 19.8) // courtyards (atria)
sym(XW, -20.0, 61.9, 18.6, 19.5) // side wings
sym(20.7, -21.9, XW, -11.3, 19.8) // Museumplein ranges
sym(XW, -28.1, 61.5, -19.9, 24.0) // south corner blocks
sym(14.1, -27.4, 20.7, -20.5, 31.0) // Museumplein towers
boxes.push([61.5, -28.2, 68.4, -20.4, 31.0]) // south-east corner tower
boxes.push([-68.4, -28.2, -61.5, -20.4, 27.0]) // south-west corner tower (lower)
// The spine, left and right of the passage.
sym(PW, -37.4, 10.4, -27.2, 17.5) // south porch
sym(PW, -27.2, 14.1, -21.9, 22.7) // central south bay
sym(PW, -21.9, 20.7, -11.3, 22.7) // central south block
sym(PW, -11.3, 9.9, 31.6, 20.3) // Gallery of Honour
sym(PW, 31.6, 9.9, 42.8, 26.5) // central north bay
// South-west, inside the same BAG outline (not mirrored).
boxes.push([-61.5, -45.1, -49.4, -28.1, 20.0]) // west wing, run on south
boxes.push([-68.0, -45.3, -61.5, -28.2, 22.0])
boxes.push([-49.4, -45.1, -46.6, -26.6, 8.0], [-49.4, -26.6, -45.3, -22.1, 10.0])
boxes.push([-52.1, -75.8, -43.8, -45.5, 15.0], [-69.0, -70.3, -52.1, -53.3, 14.0]) // annex
massing({ wall: brick, win: null, roof: slate, coping: stone, boxes, facade: null, bevel: 0.35 })

// ---------------------------------------------------------------- the passage
// The bike and foot passage runs right through under the Gallery of Honour.
// The massing above left a 9 m slot; here it is roofed over at the crown,
// with the arches at both ends and glazed walls inside (the atria entrances).
const spine: [number, number, number][] = [[-37.4, -27.2, 17.5], [-27.2, -11.3, 22.7], [-11.3, 31.6, 20.3], [31.6, 42.8, 26.5]]
for (const [y0, y1, h] of spine) {
  poly(stone, [[-PW, y0, PASS], [PW, y0, PASS], [PW, y1, PASS], [-PW, y1, PASS]], [0, 0, -1])
  poly(y0 < -30 ? stone : slate, [[-PW, y0, h], [PW, y0, h], [PW, y1, h], [-PW, y1, h]], [0, 0, 1])
}
poly(brick, [[-PW, -27.2, 17.5], [PW, -27.2, 17.5], [PW, -27.2, 22.7], [-PW, -27.2, 22.7]], [0, -1, 0])
function portal(y: number, top: number, sgn: number) {
  const r = PW, spring = PASS - r, N = 10
  const arc: V3[] = []
  for (let k = 0; k <= N; k++) { const t = Math.PI - (k * Math.PI) / N; arc.push([r * Math.cos(t), y, spring + r * Math.sin(t)]) }
  // Face above the arch, in two halves so each fan stays convex.
  const half = N / 2
  fan(brick, [-r, y, top], [...arc.slice(0, half + 1), [0, y, top]], [0, sgn, 0])
  fan(brick, [r, y, top], [[0, y, top], ...arc.slice(half)], [0, sgn, 0])
  // Stone archivolt and the soffit, 1.2 m deep.
  for (let k = 0; k < N; k++) {
    const a = arc[k], b = arc[k + 1]
    const ia: V3 = [a[0], y - sgn * 1.2, a[2]], ib: V3 = [b[0], y - sgn * 1.2, b[2]]
    poly(stone, [a, b, ib, ia], [-a[0], 0, -(a[2] - spring)])
    const g = 0.75, oa: V3 = [a[0] * (1 + g / r), y + sgn * 0.08, spring + (a[2] - spring) * (1 + g / r)], ob: V3 = [b[0] * (1 + g / r), y + sgn * 0.08, spring + (b[2] - spring) * (1 + g / r)]
    poly(stone, [[a[0], y + sgn * 0.08, a[2]], [b[0], y + sgn * 0.08, b[2]], ob, oa], [0, sgn, 0])
  }
}
portal(-37.4, 17.5, -1)
portal(42.8, 26.5, 1)
// Glazed passage walls (the atria entrances), lit at night.
for (const s of [1, -1]) {
  const a: XY = s > 0 ? [PW, 41.6] : [-PW, -36.2], b: XY = s > 0 ? [PW, -36.2] : [-PW, 41.6]
  rectPanel(win, a, b, 38.9, 77.4, 0.4, PASS - 0.7, 0.05)
}

// ---------------------------------------------------------------- facades
const BASE: [number, number] = [0, 2.4]
// City (north) front: ranges, three rows of windows, dormers above.
both2([XW, 37.0], [20.9, 37.0], (a, b) => facade(a, b, 5, [
  { lo: 3.6, hi: 9.4, arch: true, ratio: 0.46 }, { lo: 11.0, hi: 17.6, arch: true, ratio: 0.5 },
], [BASE, [10.0, 10.5], [18.3, 18.8]]))
// Corner pavilions: north and outer faces, and the short south face.
const PAV: Row[] = [{ lo: 3.6, hi: 9.4, arch: true, ratio: 0.46 }, { lo: 11.0, hi: 17.6, arch: true }, { lo: 19.4, hi: 25.4, arch: true, ratio: 0.46 }]
const PAVB: [number, number][] = [BASE, [10.0, 10.5], [18.3, 18.8]]
both2([68.0, 38.6], [XW, 38.6], (a, b) => facade(a, b, 4, PAV, PAVB, 1.3))
both2([68.0, 18.6], [68.0, 38.6], (a, b) => facade(a, b, 4, PAV, PAVB, 1.3))
both2([61.9, 18.6], [68.0, 18.6], (a, b) => facade(a, b, 1, PAV, PAVB, 0.9))
both(s => quoins(s > 0 ? XW : -68.0, 18.6, s > 0 ? 68.0 : -XW, 38.6, 0.7, 26.7))
// City towers: tall shafts, tile band, triple arched windows at the top.
const TOWER: Row[] = [{ lo: 3.4, hi: 8.8, arch: true }, { lo: 10.8, hi: 16.6, arch: true }, { lo: 18.4, hi: 21.6, arch: true, ratio: 0.45 },
  { lo: 22.8, hi: 25.8, ratio: 0.8, n: 1, part: stone }, { lo: 27.6, hi: 32.4, arch: true, n: 3, ratio: 0.62 }]
both2([20.9, 43.4], [9.9, 43.4], (a, b) => facade(a, b, 2, TOWER, [BASE, [9.5, 10.0], [17.3, 17.8], [26.5, 27.0]], 1.0))
both2([20.9, 37.0], [20.9, 43.4], (a, b) => facade(a, b, 1, TOWER, [BASE, [9.5, 10.0], [17.3, 17.8], [26.5, 27.0]], 0.9))
both2([20.9, 31.6], [20.9, 37.0], (a, b) => facade(a, b, 1, [{ lo: 27.6, hi: 32.4, arch: true, n: 2, ratio: 0.5 }], [[26.5, 27.0]], 0.9))
both2([9.9, 31.6], [20.9, 31.6], (a, b) => facade(a, b, 1, [{ lo: 27.6, hi: 32.4, arch: true, n: 3, ratio: 0.62 }], [[26.5, 27.0]], 1.0))
both(s => quoins(s > 0 ? 9.9 : -20.9, 31.6, s > 0 ? 20.9 : -9.9, 43.4, 0.7, 33.6))
// Central north bay: the great arched window over the passage mouth,
// doors either side, the stepped gable above.
{
  const a: XY = [9.9, 42.8], b: XY = [-9.9, 42.8]
  archPanel(win, a, b, 9.9, 6.4, 11.6, 23.2, 0.05, 8)
  for (const s of [9.9 - 7.2, 9.9 + 7.2]) {
    archPanel(win, a, b, s, 2.6, 0.2, 5.6, 0.05, 6)
    archPanel(win, a, b, s, 1.8, 13.0, 19.5, 0.05, 6)
  }
  rectPanel(stone, a, b, 9.9, 19.8, 9.4, 10.0, 0.07)
  rectPanel(stone, a, b, 9.9, 19.8, 24.4, 25.0, 0.07)
  // Buttresses either side of the great window, banded, with pinnacles.
  for (const k of [-1, 1]) {
    const x = k * 4.8
    block(brick, x - 0.6, 42.8, x + 0.6, 44.1, 0, 26.0)
    for (const z of [2.4, 9.4, 17.0, 24.4]) block(stone, x - 0.65, 42.75, x + 0.65, 44.15, z - 0.6, z)
    spike(stone, x, 43.45, 0.6, 26.0, 30.2)
  }
}
// Side wings: one row of tall arched windows, the mural panels above.
both2([61.9, -20.0], [61.9, 18.6], (a, b) => facade(a, b, 9, [
  { lo: 3.4, hi: 10.6, arch: true, ratio: 0.48 }, { lo: 12.6, hi: 17.4, n: 4, ratio: 0.82, part: stone },
], [BASE, [11.4, 11.9]]))
// Museumplein ranges.
both2([20.7, -21.9], [XW, -21.9], (a, b) => facade(a, b, 7, [
  { lo: 3.4, hi: 9.4, arch: true }, { lo: 11.2, hi: 17.0, arch: true, ratio: 0.45 },
], [BASE, [10.1, 10.6]]))
// South corner blocks and towers.
const LOW: Row[] = [{ lo: 3.4, hi: 9.4, arch: true }, { lo: 11.2, hi: 17.0, arch: true }]
both2([XW, -28.1], [61.5, -28.1], (a, b) => facade(a, b, 3, [...LOW, { lo: 19.0, hi: 22.6, arch: true, ratio: 0.45 }], [BASE, [10.1, 10.6]]))
both2([XW, -21.9], [XW, -28.1], (a, b) => facade(a, b, 1, LOW, [BASE, [10.1, 10.6]]))
const CT: Row[] = [...LOW, { lo: 22.0, hi: 29.2, arch: true, ratio: 0.36, n: 3 }]
facade([61.5, -28.2], [68.4, -28.2], 2, CT, [BASE, [10.1, 10.6], [19.6, 20.2]])
facade([68.4, -28.2], [68.4, -20.4], 2, CT, [BASE, [10.1, 10.6], [19.6, 20.2]])
facade([68.4, -20.4], [61.9, -20.4], 1, CT, [BASE, [10.1, 10.6], [19.6, 20.2]])
quoins(61.5, -28.2, 68.4, -20.4, 0.7, 30.1)
const CTW: Row[] = [...LOW, { lo: 19.6, hi: 25.6, arch: true, ratio: 0.36, n: 3 }]
facade([-68.4, -20.4], [-68.4, -28.2], 2, CTW, [BASE, [10.1, 10.6]])
facade([-68.4, -28.2], [-61.5, -28.2], 2, CTW, [BASE, [10.1, 10.6]])
quoins(-68.4, -28.2, -61.5, -20.4, 0.7, 26.1)
// Museumplein towers: windows up the south face, the tall group at the top.
const STW: Row[] = [{ lo: 3.4, hi: 9.4, arch: true }, { lo: 11.2, hi: 19.6, arch: true }, { lo: 23.6, hi: 29.4, arch: true, n: 3, ratio: 0.62 }]
both2([14.1, -27.4], [20.7, -27.4], (a, b) => facade(a, b, 1, STW, [BASE, [10.1, 10.6], [21.4, 22.0]], 0.8))
both2([20.7, -27.4], [20.7, -21.9], (a, b) => facade(a, b, 1, STW, [BASE, [10.1, 10.6], [21.4, 22.0]], 0.8))
both2([20.7, -21.9], [20.7, -20.5], (a, b) => facade(a, b, 1, [{ lo: 23.6, hi: 29.4, arch: true, n: 1, ratio: 0.6 }], [], 0.2))
both(s => quoins(s > 0 ? 14.1 : -20.7, -27.4, s > 0 ? 20.7 : -14.1, -20.5, 0.7, 30.1, 0.75))
// Central south bay above the porch: an arcade of small arched windows.
{
  const a: XY = [-14.1, -27.2], b: XY = [14.1, -27.2]
  for (let k = 0; k < 9; k++) archPanel(win, a, b, 14.1 - 12 + k * 3, 1.5, 18.4, 21.6, 0.05, 6)
  rectPanel(stone, a, b, 14.1, 28.2, 17.5, 18.0, 0.07)
  for (const s of [1.8, 26.4]) archPanel(win, a, b, s, 1.6, 6.0, 14.0, 0.05, 6)
}
// South porch: the passage arch with doorways either side, a balustrade.
{
  const a: XY = [-10.4, -37.4], b: XY = [10.4, -37.4]
  for (const s of [10.4 - 7.45, 10.4 + 7.45]) {
    archPanel(win, a, b, s, 3.2, 0.2, 6.2, 0.05, 6)
    archPanel(stone, a, b, s, 3.4, 9.6, 15.6, 0.05, 6)
  }
  rectPanel(stone, a, b, 10.4, 20.8, 9.4, 9.9, 0.08)
  both2([10.4, -37.4], [10.4, -27.2], (p, q) => facade(p, q, 2, [{ lo: 5.4, hi: 12.4, arch: true, ratio: 0.45 }], [BASE, [16.6, 17.0]]))
  parapet(stone, [[-10.4, -37.4], [10.4, -37.4], [10.4, -27.2], [-10.4, -27.2]], 17.5, 18.7, 0.4)
  poly(stone, [[-10.0, -37.0, 17.52], [10.0, -37.0, 17.52], [10.0, -27.2, 17.52], [-10.0, -27.2, 17.52]], [0, 0, 1])
}

// ---------------------------------------------------------------- roofs
// City ranges: steep front slope with dormers, long glazed back slope.
both(s => {
  const x0 = s > 0 ? 20.9 : -XW, x1 = s > 0 ? XW : -20.9
  const r = gable({ axis: 'x', a0: x0, a1: x1, lo: 18.8, hi: 37.0, zLo: 19.9, zHi: 19.9, ridge: 32.0, zR: 28.2 })
  slopePanels(glass, ...r.lo, 4, 0.04, 0.96, 0.22, 0.82, 0.03)
  // Big stone lucarnes standing on the cornice, one over each bay.
  const slope = (28.2 - 19.9) / 5.0
  for (let k = 0; k < 5; k++) {
    const x = x0 + 0.8 + ((x1 - x0 - 1.6) * (k + 0.5)) / 5
    dormer([x, 37.0, 19.9], [1, 0], [0, -1], slope, 2.8, 2.9, 1.7, -0.06)
  }
  // Gable-end sliver above the tower's rear wing.
  const xe = s > 0 ? 20.9 : -20.9
  poly(brick, [[xe, 30.1, 27.0], [xe, 31.6, 27.95], [xe, 31.6, 27.0]], [-s, 0, 0])
})
// Tower rear wings: gabled, ridge running back from the towers.
both(s => {
  const x0 = s > 0 ? 9.9 : -20.9, x1 = s > 0 ? 20.9 : -9.9
  gable({ axis: 'y', a0: 18.8, a1: 31.6, lo: x0, hi: x1, zLo: 27.0, zHi: 27.0, ridge: (x0 + x1) / 2, zR: 34.0, ends: [true, false] })
})
// Courtyards: glass gables, brick gable ends.
both(s => {
  const x0 = s > 0 ? 9.9 : -XW, x1 = s > 0 ? XW : -9.9
  gable({ axis: 'x', a0: x0, a1: x1, lo: -11.3, hi: 18.8, zLo: 19.8, zHi: 19.8, ridge: 4.5, zR: 28.3, ends: [true, true], part: glass, over: 0 })
})
// Gallery of Honour: a glass gable from the south block to the city front.
gable({ axis: 'y', a0: -11.3, a1: 31.6, lo: -9.9, hi: 9.9, zLo: 20.3, zHi: 20.3, ridge: 0, zR: 28.0, ends: [true, false], part: glass, over: 0 })
// Side wings: slate, a glazed band on the outer slope.
both(s => {
  const x0 = s > 0 ? XW : -61.9, x1 = s > 0 ? 61.9 : -XW
  const r = gable({ axis: 'y', a0: -20.0, a1: 18.6, lo: x0, hi: x1, zLo: 19.5, zHi: 19.5, ridge: s * 55.7, zR: 28.4, ends: [true, false] })
  const outer = s > 0 ? r.hi : r.lo
  slopePanels(glass, ...outer, 4, 0.05, 0.95, 0.12, 0.88, 0.035)
})
// Museumplein ranges: slate, the glazed band on the south slope.
both(s => {
  const x0 = s > 0 ? 20.7 : -XW, x1 = s > 0 ? XW : -20.7
  const r = gable({ axis: 'x', a0: x0, a1: x1, lo: -21.9, hi: -11.3, zLo: 19.8, zHi: 19.8, ridge: -16.6, zR: 28.1, ends: [s > 0, s < 0] })
  slopePanels(glass, ...r.lo, 5, 0.03, 0.97, 0.18, 0.78, 0.03)
})
// Corner pavilions: steep crested roofs with lucarnes.
both(s => {
  const x0 = s > 0 ? XW : -68.0, x1 = s > 0 ? 68.0 : -XW, cx = (x0 + x1) / 2, cy = 28.6
  const o = 0.3
  trunc(slate, [x0 - o, 18.6 - o, x1 + o, 38.6 + o], 27.3, [cx - 3.1, cy - 3.0, cx + 3.1, cy + 3.0], 38.9)
  parapet(stone, [[cx - 3.1, cy - 3.0], [cx + 3.1, cy - 3.0], [cx + 3.1, cy + 3.0], [cx - 3.1, cy + 3.0]], 38.9, 39.7, 0.3)
  for (const k of [-1, 1]) spike(gilt, cx + k * 2.6, cy, 0.22, 39.7, 42.0)
  for (const k of [-1, 0, 1]) {
    dormer([cx + k * 5.2, 38.6 + o, 27.3], [-1, 0], [0, -1], 11.6 / 7.3, 2.4, 2.6, 1.6, 0.35)
    dormer([s > 0 ? x1 + o : x0 - o, cy + k * 5.6, 27.3], s > 0 ? [0, 1] : [0, -1], [-s, 0], 11.6 / 6.55, 2.4, 2.6, 1.6, 0.35)
  }
})
// South corner blocks: hipped.
both(s => {
  const x0 = s > 0 ? XW : -61.5, x1 = s > 0 ? 61.5 : -XW
  trunc(slate, [x0, -28.4, x1, -19.6], 23.8, [x0 + 4.4, -24.3, x1 - 4.4, -23.7], 30.4)
})
// Central south bay: hipped slate roof, the big skylight on its south slope.
{
  const r = trunc(slate, [-14.4, -27.5, 14.4, -11.0], 22.5, [-6.6, -19.6, 6.6, -18.9], 30.2)
  const [A, B] = [r.B[0], r.B[1]], [D, C] = [r.T[0], r.T[1]]
  slopePanels(glass, A, B, C, D, 1, 0.31, 0.69, 0.14, 0.86, 0)
  for (const u of [0.14, 0.86]) {
    const e = onQuad(A, B, C, D, u, 0, 0)
    dormer([e[0], e[1], e[2]], [1, 0], [0, 1], (30.2 - 22.5) / 7.9, 1.6, 1.6, 1.0, 0.8)
  }
  // The wings of the south block behind the Museumplein towers.
  both(s => { const x0 = s > 0 ? 14.1 : -20.7, x1 = s > 0 ? 20.7 : -14.1; trunc(slate, [x0, -20.5, x1, -11.3], 22.6, [x0 + 2.4, -18.0, x1 - 2.4, -13.8], 25.6) })
}

// ---------------------------------------------------------------- city towers
// Shaft to 34.5, a steep slate bell, a slate pyramid, stone collar, an
// open lantern, a flared cap and a needle spire with a gilt vane.
both(s => {
  const cx = s * 15.4, cy = 37.5, x0 = cx - 5.5, x1 = cx + 5.5, y0 = 31.6, y1 = 43.4
  band(stone, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 33.6, 34.5, 0.4)
  trunc(slate, [x0 - 0.1, y0 - 0.1, x1 + 0.1, y1 + 0.1], 34.5, sq(cx, cy, 4.4), 39.2, null)
  trunc(slate, sq(cx, cy, 4.4), 39.2, sq(cx, cy, 2.5), 45.6, null)
  block(stone, cx - 2.8, cy - 2.8, cx + 2.8, cy + 2.8, 45.6, 46.2, true)
  block(stone, cx - 2.0, cy - 2.0, cx + 2.0, cy + 2.0, 46.2, 49.0)
  const L: XY[] = [[cx - 2.0, cy - 2.0], [cx + 2.0, cy - 2.0], [cx + 2.0, cy + 2.0], [cx - 2.0, cy + 2.0]]
  for (let i = 0; i < 4; i++) archPanel(win, L[i], L[(i + 1) % 4], 2.0, 2.3, 46.5, 48.7, 0.03, 6)
  trunc(slate, sq(cx, cy, 2.75), 48.9, sq(cx, cy, 1.1), 50.3, null)
  spike(slate, cx, cy, 1.1, 50.3, 54.2)
  spike(gilt, cx, cy, 0.2, 54.0, 56.3)
  poly(gilt, [[cx, cy - 0.06, 55.2], [cx + 1.0, cy - 0.06, 55.2], [cx + 1.0, cy - 0.06, 55.9], [cx, cy - 0.06, 55.9]], [0, -1, 0])
  poly(gilt, [[cx, cy + 0.06, 55.2], [cx + 1.0, cy + 0.06, 55.2], [cx + 1.0, cy + 0.06, 55.9], [cx, cy + 0.06, 55.9]], [0, 1, 0])
  // Corner pinnacles on the cornice.
  for (const [px, py] of [[x0 + 0.5, y0 + 0.5], [x1 - 0.5, y0 + 0.5], [x1 - 0.5, y1 - 0.5], [x0 + 0.5, y1 - 0.5]]) spike(stone, px, py, 0.45, 34.5, 38.0)
  // Stone dormers on the bell, the west tower's carrying the clock.
  for (const [ex, ey, tx, ty, dx, dy] of [[cx, y1 + 0.1, -1, 0, 0, -1], [cx, y0 - 0.1, 1, 0, 0, 1], [x1 + 0.1, cy, 0, 1, -1, 0], [x0 - 0.1, cy, 0, -1, 1, 0]] as const) {
    // The east tower's north and east dormers carry its clock faces.
    dormer([ex, ey, 34.5], [tx, ty], [dx, dy], dx ? 3.6 : 3.0, 2.6, 3.0, 1.6, 0.25, stone, !(s > 0 && (dy === -1 || dx === -1)))
  }
  if (s > 0) {
    const n = 12, zc = 36.4, r = 0.95
    const disc = (c: (u: number, z: number) => V3, out: V3) => {
      for (let k = 0; k < n; k++) {
        const a0 = (k * 2 * Math.PI) / n, a1 = ((k + 1) * 2 * Math.PI) / n
        poly(gilt, [c(0, zc), c(r * Math.cos(a0), zc + r * Math.sin(a0)), c(r * Math.cos(a1), zc + r * Math.sin(a1))], out)
      }
    }
    const yN = y1 + 0.1 - 0.25 + 0.04, xE = x1 + 0.1 - 0.25 + 0.04
    disc((u, z) => [cx + u, yN, z], [0, 1, 0])
    disc((u, z) => [xE, cy + u, z], [1, 0, 0])
  }
  // Four small corner turrets round the lantern (Heineccius).
  for (const [px, py] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const tx = cx + px * 2.35, ty = cy + py * 2.35
    block(stone, tx - 0.45, ty - 0.45, tx + 0.45, ty + 0.45, 46.2, 47.5)
    spike(slate, tx, ty, 0.65, 47.5, 48.9)
  }
})

// ---------------------------------------------------------------- Museumplein and corner towers
function crestedTower(x0: number, y0: number, x1: number, y1: number, z0: number, zTop: number, top: number, dormers: [number, number, number, number, number, number][]) {
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  band(stone, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0 - 0.7, z0, 0.35)
  trunc(slate, [x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2], z0, sq(cx, cy, top), zTop)
  parapet(stone, [[cx - top, cy - top], [cx + top, cy - top], [cx + top, cy + top], [cx - top, cy + top]], zTop, zTop + 0.6, 0.22)
  spike(gilt, cx, cy, 0.2, zTop + 0.6, zTop + 3.0)
  for (const [px, py] of [[x0 + 0.4, y0 + 0.4], [x1 - 0.4, y0 + 0.4], [x1 - 0.4, y1 - 0.4], [x0 + 0.4, y1 - 0.4]]) spike(slate, px, py, 0.4, z0, z0 + 3.2)
  const sl = (zTop - z0) / ((x1 - x0) / 2 - top)
  for (const [ex, ey, tx, ty, dx, dy] of dormers) dormer([ex, ey, z0], [tx, ty], [dx, dy], sl, 1.6, 1.8, 1.2, 0.5)
}
both(s => {
  const x0 = s > 0 ? 14.1 : -20.7, x1 = s > 0 ? 20.7 : -14.1, cx = (x0 + x1) / 2
  crestedTower(x0, -27.4, x1, -20.5, 31.0, 40.2, 1.1, [[cx, -27.6, 1, 0, 0, 1], [s > 0 ? x1 + 0.2 : x0 - 0.2, -23.95, 0, s, -s, 0]])
})
crestedTower(61.5, -28.2, 68.4, -20.4, 31.0, 39.5, 1.2, [[64.95, -28.4, 1, 0, 0, 1], [68.6, -24.3, 0, 1, -1, 0]])
crestedTower(-68.4, -28.2, -61.5, -20.4, 27.0, 34.4, 1.2, [[-64.95, -28.4, 1, 0, 0, 1], [-68.6, -24.3, 0, -1, 1, 0]])

// ---------------------------------------------------------------- central north gable
{
  const y = 42.8, zb = 26.5, za = 34.4, hw = 7.0
  poly(brick, [[-hw, y, zb], [hw, y, zb], [0, y, za]], [0, 1, 0])
  // Gablet roof back into the main roof (valleys meet the main slope).
  poly(slate, [[-hw, y, zb], [0, y, za], [0, 37.2, 34.0]], [-1, 0.2, 1])
  poly(slate, [[hw, y, zb], [0, 37.2, 34.0], [0, y, za]], [1, 0.2, 1])
  // Stone coping up both rakes.
  for (const k of [-1, 1]) {
    const a: V3 = [k * (hw + 0.3), y + 0.15, zb - 0.2], b: V3 = [0, y + 0.15, za + 0.45], c: V3 = [0, y - 0.6, za + 0.45], d: V3 = [k * (hw + 0.3), y - 0.6, zb - 0.2]
    poly(stone, [a, b, c, d], [k, 0, 1.2])
    poly(stone, [[k * (hw + 0.3), y + 0.15, zb - 0.6], [0, y + 0.15, za + 0.05], b, a], [0, 1, 0])
  }
  block(stone, -0.7, y - 0.6, 0.7, y + 0.2, za + 0.3, za + 1.4)
  spike(stone, 0, y - 0.2, 0.55, za + 1.4, za + 3.2)
  archPanel(win, [6, y], [-6, y], 6, 2.4, 28.0, 31.6, 0.05, 6)
}
// Central north bay roof, ridge across between the towers.
gable({ axis: 'x', a0: -9.9, a1: 9.9, lo: 31.6, hi: 42.8, zLo: 26.5, zHi: 26.5, ridge: 37.2, zR: 34.0 })

// ---------------------------------------------------------------- south-west, inside the BAG outline
// The west wing runs on south and ends in a tall gable on the garden.
gable({ axis: 'y', a0: -45.1, a1: -28.1, lo: -61.5, hi: -49.4, zLo: 20.0, zHi: 20.0, ridge: -55.45, zR: 27.6, ends: [true, false] })
facade([-61.5, -45.1], [-49.4, -45.1], 3, LOW, [BASE, [10.1, 10.6]])
archPanel(win, [-61.5, -45.1], [-49.4, -45.1], 6.05, 2.6, 20.6, 24.4, 0.05, 6)
facade([-49.4, -28.1], [-49.4, -45.1], 4, [{ lo: 10.2, hi: 15.0, arch: true }], [[18.6, 19.1]])
facade([-68.0, -28.2], [-68.0, -45.3], 4, LOW, [BASE, [10.1, 10.6]])
facade([-68.0, -45.3], [-61.5, -45.3], 2, LOW, [BASE, [10.1, 10.6]])
// The annex south of it: plain brick under slate.
gable({ axis: 'y', a0: -75.8, a1: -45.5, lo: -52.1, hi: -43.8, zLo: 15.0, zHi: 15.0, ridge: -47.95, zR: 18.6, ends: [true, false] })
gable({ axis: 'x', a0: -69.0, a1: -52.1, lo: -70.3, hi: -53.3, zLo: 14.0, zHi: 14.0, ridge: -61.8, zR: 17.6, ends: [true, false] })
facade([-43.8, -75.8], [-43.8, -45.5], 7, [{ lo: 3.2, hi: 6.4, ratio: 0.4 }, { lo: 8.0, hi: 12.0, ratio: 0.42 }], [BASE])
facade([-52.1, -75.8], [-43.8, -75.8], 2, [{ lo: 3.2, hi: 6.4, ratio: 0.4 }, { lo: 8.0, hi: 12.0, ratio: 0.42 }], [BASE])
facade([-69.0, -53.3], [-69.0, -70.3], 4, [{ lo: 3.2, hi: 6.4, ratio: 0.4 }, { lo: 8.0, hi: 11.6, ratio: 0.42 }], [BASE])
facade([-69.0, -70.3], [-52.1, -70.3], 4, [{ lo: 3.2, hi: 6.4, ratio: 0.4 }, { lo: 8.0, hi: 11.6, ratio: 0.42 }], [BASE])
// The Asian Pavilion (2013): a low pale stone pavilion with glass walls.
{
  const ring: XY[] = [[-42.8, -40.0], [-39.7, -44.5], [-30.8, -44.3], [-29.9, -40.2], [-27.9, -39.6], [-29.4, -34.5], [-27.3, -33.0], [-31.2, -26.3], [-40.2, -29.5]]
  const sa = ring.reduce((t, a, i) => { const b = ring[(i + 1) % ring.length]; return t + a[0] * b[1] - b[0] * a[1] }, 0)
  const r = sa < 0 ? ring.slice().reverse() : ring.slice() // counter-clockwise
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    poly(stone, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], 7], [a[0], a[1], 7]], [b[1] - a[1], a[0] - b[0], 0])
    if (L > 3) rectPanel(win, a, b, L / 2, L - 1.6, 0.6, 5.6, 0.05)
  }
  capPoly(stone, ring, 7)
}

// ---------------------------------------------------------------- write
const B = finish('rijks-brick', 0xab5c49)
const lit = (p: V3, n: V3) => (Math.abs(n[2]) < 0.6 ? (p[2] < 30 ? 0.6 : 0.45) : 0.12)
finishModel('Rijksmuseum', 'amsterdam-rijksmuseum', [
  { part: brick, material: { ...B, floodlight: lit } },
  { part: stone, material: { ...PALETTE.stone, floodlight: lit } },
  { part: slate, material: finish('rijks-slate', 0x737c87) },
  { part: win, material: PALETTE.window },
  { part: glass, material: { ...PALETTE.glass, color: 0xa2b6b8 } },
  { part: gilt, material: finish('rijks-gilt', 0xd8b25a) },
], { bearing: 39.55, osm: 'way/431070185', height: 56.3 }, 6500)
