/**
 * Chapultepec Uno (R509, Paseo de la Reforma 509, 2019, Taller G; structure
 * Arup), Mexico City — original procedural geometry, CC0-1.0.
 * bun generators/mexico-city-chapultepec-uno.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/508030259,
 * 19.424162,-99.175781. Its long sides run at 333.9°, so the catalog
 * bearing is 333.9: model +y is the NNW end, -x the broad WSW face that
 * looks at Chapultepec Castle, +x the broad ENE face towards Torre Mayor.
 *
 * Identity, in order: a tall flat-topped glass slab whose faces are each
 * folded into two triangles, the fold running from a face's top-left
 * corner to its bottom-right corner, so the slab looks gently twisted and
 * every face shows a big light and dark triangle (the read from the castle
 * and from Reforma); light grey-blue glass banded by pale floor fins; a
 * glass screen round the roof; the glazed lobby behind dark raking V
 * columns.
 *
 * The assignment described a stepped tower with setbacks, a cantilevered
 * crown and staggered terraces near the top. None of the photos show that:
 * every licensed view (from the castle, from Reforma, from below, the
 * construction photos) shows a straight slab with a flat top and folded
 * faces. The photos were followed. The only "notches" are the saw-tooth
 * floor-fin ends along the folds, too fine to model.
 *
 * Evidence:
 *  - plan: OSM way/508030259 (building=office, height=241, 58 levels), a
 *    62.6 × 29.0 m rectangle. No building:part ways. The model's plan at
 *    mid-height is that rectangle; the base is turned 6° clockwise and the
 *    roof 6° counter-clockwise from it (the fold geometry).
 *  - fold: drawn as a 12° turn between base and roof, chosen so the folds
 *    read at map scale; the real fold is probably gentler (estimated from
 *    the near-vertical edges in Crancket's view from the castle, which
 *    allow ~5–10°). Fold direction from the same view, Memo198's and
 *    Secretaría de Cultura CDMX's photos (top-left to bottom-right on the
 *    broad faces). The lower facet is the darker glass, as in the castle
 *    view; in other light the tones swap.
 *  - heights: 241 m, 58 floors (es-Wikipedia, OSM). Floors ~4.1 m; a pale
 *    fin every three floors (the real fins are at every floor, grouped
 *    here per STYLE.md); lobby ~9.5 m (estimated from ProtoplasmaKid's
 *    street photo, the V columns two to three storeys tall); the glass
 *    screen ~4 m over the roof deck and a plant box at the NNW end
 *    (Crancket's view; estimated).
 *  - floor area check: 92,726 m² over 58 floors ≈ 1,600 m² a floor
 *    (es-Wikipedia) against OSM's 1,814 m² footprint.
 *  - colour: light grey-blue glass (#a3b7c8 / #7e93a6 for the two facets),
 *    silver-white fins, dark grey V columns.
 *  - night: the whole slab is lit (hotel, residences and offices), so both
 *    glass tones are `window-*`.
 *  - terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s); the
 *    site is on the flat lake-bed basin (~2,240 m). Modelled level,
 *    elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Paseo_de_la_Reforma_y_Chapultepec.jpg, Crancket, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Paseo_de_la_Reforma_y_Chapultepec.jpg
 *  - Chapultepec_UNO_CDMX.jpg, Secretaría de Cultura Ciudad de México,
 *    CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Chapultepec_UNO_CDMX.jpg
 *  - Hotel_Ritz_Carlton_Ciudad_de_México_1.jpg, ProtoplasmaKid, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Hotel_Ritz_Carlton_Ciudad_de_M%C3%A9xico_1.jpg
 *  - Chapultepec_Uno_y_la_Torre_Mayor.jpg, Luis Alvaz, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Chapultepec_Uno_y_la_Torre_Mayor.jpg
 *  - Vista_del_edificio_Chapultepec_Uno_y_la_Torre_Mayor_03.jpg, Luis
 *    Alvaz, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Vista_del_edificio_Chapultepec_Uno_y_la_Torre_Mayor_03.jpg
 *  - Paseo_de_la_Reforma_Torre_Reforma,_Chapultepec_Uno_and_Torre_Mayor.jpg,
 *    Tyrv, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Paseo_de_la_Reforma_Torre_Reforma,_Chapultepec_Uno_and_Torre_Mayor.jpg
 *  - Reforma_Corner.jpg, Dead.rabbit, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Reforma_Corner.jpg
 *  - Chapultepec_Uno.jpg, Memo198, CC BY-SA 4.0 (under construction)
 *    https://commons.wikimedia.org/wiki/File:Chapultepec_Uno.jpg
 * Look-only: none. No commercial imagery.
 *
 * Doubts: the fold angle is estimated and exaggerated for legibility; the
 * ENE face (towards Torre Mayor) is only seen in steep views from below;
 * the lobby height and the roof plant are estimated; the Ritz-Carlton sign
 * at the top of the WSW face is left out.
 *
 * Left out: per-floor fins and their saw-tooth ends at the folds, vertical
 * mullions, the sign, roof railings and the window-cleaning crane.
 */
import { Part, type V3 } from './mesh'
import { finish, windowVariant } from './palette'
import { cap, inset, save, walls, type XY } from './chi-aon-center'

const ANCHOR: [number, number] = [19.424162, -99.175781]
const BEARING = 333.9

// Plan: OSM way/508030259, 62.7 × 29.0 m; model y along the long axis.
const HA = 31.3, HB = 14.48
const H = 241 // published (es-Wikipedia; OSM height=241)
const TWIST = (12 * Math.PI) / 180 // top turned against the base (estimated, see header)
const LOBBY = 9.5
const FLOOR = H / 58.6 // ~4.1 m

const rot = ([x, y]: XY, a: number): XY => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]
const lerp2 = (p: XY, q: XY, t: number): XY => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]

const RECT: XY[] = [[-HB, -HA], [HB, -HA], [HB, HA], [-HB, HA]]
const BASE = RECT.map(p => rot(p, -TWIST / 2))
const TOPR = RECT.map(p => rot(p, TWIST / 2))

/**
 * The section at height z: each face is two flat triangles, folded along
 * the diagonal from its top-left corner to its bottom-right corner, so a
 * level cuts every face at its two ends and on the fold: an 8-point ring.
 */
function section(z: number): XY[] {
  const t = z / H, out: XY[] = []
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    out.push(lerp2(BASE[i], TOPR[i], t)) // corner i
    out.push(lerp2(BASE[j], TOPR[i], t)) // the fold, from b(i+1) up to t(i)
  }
  return out
}
const at = (r: XY[], z: number): V3[] => r.map(([x, y]) => [x, y, z])

function build() {
  const glass = new Part(), glass2 = new Part(), fin = new Part(), roof = new Part(), crown = new Part()

  // Storey groups: a pale fin band every three floors (the real fins are
  // at every floor), the glass between.
  const levels: number[] = [LOBBY]
  for (let z = LOBBY + 3 * FLOOR; z < H - 6; z += 3 * FLOOR) levels.push(z)
  levels.push(H - 4.5) // the top fin, under the glass crown screen

  // The glazed shaft from the lobby to the crown, lofted level by level so
  // the folds stay flat.
  const zs = [LOBBY, ...levels.slice(1), H]
  // Each face's lower facet (base along the ground, apex at the top-left
  // corner) is drawn in a darker glass than the inverted upper facet: the
  // two always reflect differently in the photos, which is how the fold
  // reads from afar.
  for (let k = 0; k < zs.length - 1; k++) {
    const r0 = section(zs[k]), r1 = section(zs[k + 1])
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8, p = i % 2 === 0 ? glass2 : glass
      p.quad([r0[i][0], r0[i][1], zs[k]], [r0[j][0], r0[j][1], zs[k]], [r1[j][0], r1[j][1], zs[k + 1]], [r1[i][0], r1[i][1], zs[k + 1]])
    }
  }

  // Fins: a band 0.9 m deep standing 0.45 m proud at each level.
  for (const z of levels) {
    const r = section(z), o = inset(r, -0.45)
    walls(fin, o, z - 0.45, z + 0.45)
    for (let k = 0; k < r.length; k++) {
      const j = (k + 1) % r.length
      fin.quad([r[k][0], r[k][1], z + 0.45], [r[j][0], r[j][1], z + 0.45], [o[j][0], o[j][1], z + 0.45], [o[k][0], o[k][1], z + 0.45])
      fin.quad([o[k][0], o[k][1], z - 0.45], [o[j][0], o[j][1], z - 0.45], [r[j][0], r[j][1], z - 0.45], [r[k][0], r[k][1], z - 0.45])
    }
  }

  // The crown: the glass runs up as a screen past the roof; a roof deck
  // sunk inside it and a plant box at the NNW end (Crancket's view from
  // the castle).
  {
    const r = section(H), ri = inset(r, 0.4)
    walls(glass, ri.slice().reverse(), H - 4, H) // the screen's inner face
    for (let k = 0; k < r.length; k++) {
      const j = (k + 1) % r.length
      fin.quad([r[k][0], r[k][1], H], [r[j][0], r[j][1], H], [ri[j][0], ri[j][1], H], [ri[k][0], ri[k][1], H])
    }
    cap(roof, ri, H - 4)
    const box: XY[] = [[-9, 13], [9, 13], [9, 25], [-9, 25]].map(p => rot(p as XY, TWIST / 2))
    walls(roof, box, H - 4, H + 2.5)
    cap(roof, box, H + 2.5)
  }

  // The lobby: glass set back 1.6 m under the first fin, with the dark
  // raking V columns that carry the facade (ProtoplasmaKid's photo).
  {
    const r = section(0), ri = inset(r, 1.6)
    walls(glass2, ri, 0, LOBBY)
    // Soffit from the setback out to the shaft.
    const r1 = section(LOBBY)
    for (let k = 0; k < r1.length; k++) {
      const j = (k + 1) % r1.length
      roof.quad([ri[k][0], ri[k][1], LOBBY], [ri[j][0], ri[j][1], LOBBY], [r1[j][0], r1[j][1], LOBBY], [r1[k][0], r1[k][1], LOBBY])
    }
    // V columns along each face: pairs of raking struts from a shared foot.
    for (let i = 0; i < 4; i++) {
      const a = r1[2 * i], b = r1[(2 * i + 2) % 8]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const n = Math.max(2, Math.round(L / 10))
      for (let q = 0; q < n; q++) {
        const t0 = q / n, t1 = (q + 1) / n, tm = (t0 + t1) / 2
        const top0 = lerp2(a, b, t0 + 0.02), top1 = lerp2(a, b, t1 - 0.02)
        const foot = inset([lerp2(a, b, tm)], 0)[0]
        for (const tp of [top0, top1]) strut(crown, [foot[0], foot[1], 0.45], [tp[0], tp[1], LOBBY - 0.4], 0.9)
      }
    }
  }

  return [
    // Light grey-blue glass (reads light in daylight, lit at night).
    { part: glass, material: windowVariant(2, 0xa3b7c8) },
    { part: glass2, material: windowVariant(3, 0x7e93a6) },
    { part: fin, material: finish('r509-fin', 0xe3e6e8) },
    { part: roof, material: finish('r509-roof', 0x9da6ad) },
    { part: crown, material: finish('r509-steel', 0x5c6470) },
  ]
}

/** A square strut from A to B, w thick, all four sides. */
function strut(p: Part, A: V3, B: V3, w: number) {
  const d: V3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], l = Math.hypot(...d), t: V3 = [d[0] / l, d[1] / l, d[2] / l]
  const ref: V3 = Math.abs(t[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const cr = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  const nz = (a: V3): V3 => { const m = Math.hypot(...a); return [a[0] / m, a[1] / m, a[2] / m] }
  const u = nz(cr(t, ref)), v = cr(t, u), h = w / 2
  const sec = (P: V3) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [P[0] + (u[0] * a + v[0] * b) * h, P[1] + (u[1] * a + v[1] * b) * h, P[2] + (u[2] * a + v[2] * b) * h] as V3)
  const s0 = sec(A), s1 = sec(B)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    p.quad(s0[i], s0[j], s1[j], s1[i])
  }
}

if (import.meta.main) await save('mexico-city-chapultepec-uno', 'Chapultepec Uno', ANCHOR, BEARING, build(), 6500)
