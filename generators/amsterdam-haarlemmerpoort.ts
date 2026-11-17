/**
 * Haarlemmerpoort (Willemspoort), Haarlemmerplein, Amsterdam: original
 * procedural geometry, CC0-1.0.
 * bun generators/amsterdam-haarlemmerpoort.ts
 *
 * The neoclassical toll gate of 1840 (Cornelis Alewijn, probably drawn by
 * Bastiaan de Greef), opened as King Willem II rode in: a pale stone
 * gatehouse whose middle is an open hall right through the building,
 * carried on eight Corinthian columns, between two-storey pavilions with
 * half-round ends, under one continuous entablature and a raised attic
 * with a clock. Both fronts are the same (nl.wikipedia).
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/33202039,
 * 52.384967, 4.883080. Bearing 43: the gate's long axis runs at 43
 * degrees, so here it lies along y, the road passes through along x, and
 * the two fronts face +x (133 degrees, the city) and -x (313, the field
 * and the Singelgracht).
 *
 * Identity, in order: the open columned hall in the middle (you see
 * through it), the long pale entablature over it and the pavilions, the
 * attic block with the clock; the half-round ends.
 *
 * Evidence:
 *  - plan: OSM outline way/33202039 read in the turned frame: the main
 *    block x -9.6..9.6 over y -13.85..13.85, the hall's mouth between the
 *    antae at y +-6.4, the column line at x +-9.9, and half-round ends of
 *    radius 3.85 m about (0, +-13.85).
 *  - height: OSM height 14.9 m (3DBAG, from AHN lidar); Janericloebe's
 *    distant level photo (31.4 px/m on the 27.7 m front) gives the
 *    attic's top at about 13.2 m and shows plant on the roof above it,
 *    so the attic is drawn to 13.5 m and the 3DBAG height is taken to
 *    include that plant.
 *  - elevations estimated from the same photo: column capitals at 8.75 m,
 *    entablature to 11.0, attic 9.6 m wide; the half-round ends 6.5 m;
 *    ground-floor windows 1.6-4.1 m; columns at y +-2.9 m, 1.1 m across.
 *    Four columns stand at each front and four more inside (eight in the
 *    hall, nl.wikipedia: "acht Korinthische zuilen"); the inner pairs'
 *    positions are estimated.
 *  - colours: pale grey Bentheim sandstone and render, from the daylight
 *    photos; flat roofs in the palette's roof grey; a dark dial in a
 *    stone frame on the attic.
 *  - night: floodlit lightly (the stone fronts).
 *  - elevation 0 (flat, about 0 m NAP). No lidar read directly.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Amsterdam_Haarlemmerpoort_001.JPG (Janericloebe, CC BY 3.0): the
 *    field side across the Singelgracht, distant and level.
 *  - Overzicht_voorzijde_poortgebouw_-_Amsterdam_-_20536555_-_RCE.jpg
 *    (Bert van As, Rijksdienst voor het Cultureel Erfgoed, CC BY-SA 4.0):
 *    the front, the clock on the attic, the half-round end.
 *  - Haarlemmerpoort_@_Amsterdam_(21748858698).jpg (Guilhem Vellut,
 *    CC BY 2.0): the front, the columns and through the hall.
 *  - Amsterdam_Haarlemmerpoort_002.JPG (Janericloebe, CC BY 3.0): the
 *    hall's coffered ceiling and the arch on its side wall.
 * No commercial imagery. No look-only sources.
 *
 * Left out: the frieze's rinceaux, the coffers and rosettes, the clock's
 * ornament, the window sashes and the cornices over them, the
 * inscription, the rooftop plant.
 *
 * Doubts: the inner columns' positions; the attic's depth; the city side
 * is drawn as the field side's mirror, as the source says it is.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archOn, band, bbox, cap, dialOn, face, lathe, prism, rect, rectOn, save, segs, walls, type XY } from './amsterdam-munttoren'

/** A Corinthian column: base, a slightly tapering shaft, a flared capital and abacus. */
function column(p: Part, x: number, y: number, z0: number, z1: number, r: number, seg = 10) {
  lathe(p, x, y, [[r * 1.3, z0], [r * 1.3, z0 + 0.3], [r * 1.12, z0 + 0.45], [r, z0 + 0.6], [r * 0.88, z1 - 1.1], [r * 0.95, z1 - 1.05], [r * 1.25, z1 - 0.3], [0, z1 - 0.3]], seg)
  bbox(p, p, x - r * 1.45, y - r * 1.45, x + r * 1.45, y + r * 1.45, z1 - 0.3, z1, 0.05)
}

function build() {
  const stone = new Part(), roof = new Part(), win = new Part(), dark = new Part()

  const X = 9.6, YO = 6.4, YE = 13.85, CAP = 8.75, TOP = 11.0
  // ------------------------------------------------------ the pavilions
  for (const s of [1, -1]) {
    const y0 = s > 0 ? YO : -YE, y1 = s > 0 ? YE : -YO
    prism(stone, rect(-X, y0, X, y1), 0, CAP, false)
    band(stone, rect(-X, y0, X, y1), 0, 0.7, 0.06, 0.04, false, false)
    // corner pilasters
    for (const x of [-X, X]) {
      const yc = s * (YE - 0.45)
      bbox(stone, null, x - 0.45 + (x > 0 ? 0.25 : -0.25), yc - 0.45, x + 0.45 + (x > 0 ? 0.25 : -0.25), yc + 0.45, 0.7, CAP, 0.05)
    }
    // windows: a tall ground-floor one and a smaller upper one on each front,
    // and a little one in the frieze
    for (const [a, b] of [[[X, y0], [X, y1]], [[-X, y1], [-X, y0]]] as [XY, XY][]) {
      const c = Math.abs(s * 10.2 - a[1])
      rectOn(stone, a, b, c, 0.95, 1.4, 4.55, 0.06)
      rectOn(win, a, b, c, 0.72, 1.6, 4.2, 0.1)
      bbox(stone, stone, ...cornerBox(a, b, c, 1.1, 0.3), 4.55, 4.8, 0.05)
      rectOn(stone, a, b, c, 0.75, 6.2, 7.95, 0.06)
      rectOn(win, a, b, c, 0.55, 6.35, 7.8, 0.1)
      rectOn(win, a, b, c, 0.5, 9.55, 10.15, 0.06)
    }
    // the hall's side walls: a big blind arch with a doorway
    {
      const a: XY = s > 0 ? [-X, YO] : [X, -YO], b: XY = s > 0 ? [X, YO] : [-X, -YO]
      archOn(stone, a, b, X, 3.0, 0, 4.6, 0.08, 10)
      archOn(dark, a, b, X, 1.0, 0, 2.6, 0.12, 8)
      archOn(win, a, b, X, 2.5, 4.9, 4.9, 0.12, 8)
    }
    // the half-round end, lower
    const N = 10, R = 3.85
    const ring: XY[] = []
    for (let k = 0; k <= N; k++) { const t = (k / N) * Math.PI; ring.push([R * Math.cos(t) * (s > 0 ? 1 : -1), s * (YE + R * Math.sin(t))]) }
    const apse = s > 0 ? ring : ring
    const r2 = s > 0 ? [...apse] : [...apse]
    const ccwRing = area(r2) < 0 ? [...r2].reverse() : r2
    prism(stone, ccwRing, 0, 6.0, false)
    band(stone, ccwRing, 5.6, 6.5, 0.25, 0.1, false)
    cap(roof, ccwRing, 6.45)
    for (const k of [2, 5, 8]) {
      const [p, q] = segs(ccwRing)[k]
      const L = Math.hypot(q[0] - p[0], q[1] - p[1])
      if (L > 3) continue
      rectOn(win, p, q, L / 2, 0.45, 1.8, 4.0, 0.08)
    }
  }

  // ---------------------------------------- the open hall and its columns
  for (const x of [-9.3, -3.2, 3.2, 9.3]) for (const y of [-2.9, 2.9]) column(stone, x, y, 0, CAP, 0.55)
  // antae at the mouths
  for (const x of [X, -X]) for (const s of [1, -1]) {
    bbox(stone, null, Math.min(x, x + Math.sign(x) * 0.3), s > 0 ? YO - 0.3 : -YO - 0.4, Math.max(x, x + Math.sign(x) * 0.3), s > 0 ? YO + 0.4 : -YO + 0.3, 0, CAP - 0.3, 0.05)
    bbox(stone, stone, Math.min(x, x + Math.sign(x) * 0.42), s > 0 ? YO - 0.42 : -YO - 0.52, Math.max(x, x + Math.sign(x) * 0.42), s > 0 ? YO + 0.52 : -YO + 0.42, CAP - 0.3, CAP, 0.05)
  }
  // the coffered ceiling, a step up from the beam over the columns
  const ceil = rect(-X, -YO, X, YO)
  cap(stone, ceil, CAP, false)

  // ---------------------------------------------- the entablature
  const body = rect(-X, -YE, X, YE)
  prism(stone, body, CAP, TOP - 0.7, false)
  cap(stone, body, CAP, false) // underside past the hall
  // the architrave and frieze stand a little proud over the columns
  bbox(stone, null, -9.95, -YO - 0.4, 9.95, YO + 0.4, CAP, TOP - 0.7, 0.04)
  cap(stone, rect(-9.95, -YO - 0.4, 9.95, YO + 0.4), CAP - 0.001, false)
  band(stone, body, TOP - 0.75, TOP, 0.45, 0.15, false)
  cap(roof, body, TOP - 0.02)

  // ---------------------------------------------------- the attic
  const AX = 8.8, AY = 4.8, AT = 13.5
  prism(stone, rect(-AX, -AY, AX, AY), TOP, AT - 0.35, false)
  band(stone, rect(-AX, -AY, AX, AY), AT - 0.4, AT, 0.18, 0.08, false)
  cap(roof, rect(-AX + 0.1, -AY + 0.1, AX - 0.1, AY - 0.1), AT)
  for (const [a, b] of [[[AX, -AY], [AX, AY]], [[-AX, AY], [-AX, -AY]]] as [XY, XY][]) {
    // the clock, framed in stone, and two small windows
    dialOn(dark, stone, a, b, AY, 12.15, 0.72, 0.0, 0.14, 14)
    for (const d of [-3.2, 3.2]) rectOn(win, a, b, AY + d, 0.4, 11.6, 12.2, 0.05)
  }

  const flood = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : n[2] < -0.5 ? 0.3 : 0.7)
  return [
    { part: stone, material: { ...finish('haarlemmerpoort-stone', 0xd6d2c6), floodlight: flood } },
    { part: roof, material: { ...PALETTE.roof } },
    { part: win, material: { ...PALETTE.window } },
    { part: dark, material: finish('haarlemmerpoort-dark', 0x4f565e) },
  ]
}

function area(r: XY[]) {
  return r.reduce((s, q, i) => { const w = r[(i + 1) % r.length]; return s + q[0] * w[1] - w[0] * q[1] }, 0) / 2
}
/** An axis box standing out from wall a→b around c, half-width hw, depth d. */
function cornerBox(a: XY, b: XY, c: number, hw: number, d: number): [number, number, number, number] {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const p0: XY = [a[0] + u[0] * (c - hw), a[1] + u[1] * (c - hw)], p1: XY = [a[0] + u[0] * (c + hw) + n[0] * d, a[1] + u[1] * (c + hw) + n[1] * d]
  return [Math.min(p0[0], p1[0]), Math.min(p0[1], p1[1]), Math.max(p0[0], p1[0]), Math.max(p0[1], p1[1])]
}

void face; void walls
if (import.meta.main) await save('amsterdam-haarlemmerpoort', 'Haarlemmerpoort', [52.384967, 4.88308], 43, build(), 5000)
