/**
 * Swan House (1928, Philip Trammell Shutze), Atlanta History Center:
 * procedural, CC0-1.0.
 * bun generators/atl-swan-house.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 31 (the house's
 * long axis runs 31 degrees east of north). The entrance front with its
 * giant Tuscan portico faces model +x (compass 121, the forecourt); the
 * garden front over the cascade fountain faces model -x (compass 301).
 * Origin: the area centroid of OSM way/267926896 (-84.3875494, 33.8404422).
 * y = 0 is the lowest ground under the footprint: the garden terrace on the
 * -x side (lidar ground 284.1 m; Mapterhorn 284.2 m). The forecourt on the +x
 * side is 2.8 m higher (lidar and terrain agree).
 *
 * Form: a two-storey Palladian/Italianate villa in pale stucco, seven bays
 * by five, under a low hipped slate roof with a flat deck and two
 * chimneys; on the entrance front a full-height tetrastyle portico with a
 * pediment; on the garden front a raised central attic with coved sides,
 * a segmental pediment and an oculus, over a pedimented door, with the
 * garden storey's plain plinth below (hidden by the cascade's stairs); one-storey flat-roofed arcaded wings at each end.
 * The cascade, its stairs and basins are garden ground, not modelled (the
 * water and terraces are the map's).
 *
 * Sources
 * - OSM way/267926896 (outline, building=yes, name Swan House).
 * - USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 1 m grid, heights
 *   above y = 0: main eaves 12.3, roof 15.4 to 16.1 (the model takes 15.4 so the low
 *   hip stays behind the eaves from the forecourt, as in the photos), garden
 *   attic 16.6,
 *   chimneys 18.0, portico pediment apex 15.0, the end wings' flat roofs 9.1
 *   (all measured). The portico reaches about 2 m further out than OSM's
 *   (lidar to x 15); the model uses x 14.0.
 * - USGS NAIP (public domain): plan and the grey roof.
 * - HABS GA,61-ATLA,5 (Library of Congress, public domain): "General view of
 *   front", "General view of rear", "View of rear, closer" (photos on
 *   Wikimedia Commons), for the bay rhythm, the portico and the attic.
 * - HALS GA-2, "The Swan House Gardens" (public domain), for which way the
 *   cascade runs.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   R. Cotton Alston Jr. (HABS), "Swan House, Atlanta.jpg", public domain
 *     (garden front over the cascade);
 *   Marc Merlin, "Historic Swan House (1928) with Hudson Super-Six Coach in
 *     Atlanta's West Paces Ferry neighborhood.jpg", CC BY-SA 4.0 (entrance
 *     front, colour);
 *   Carol M. Highsmith, "Swan House, Atlanta, Georgia LCCN2011633264.tif",
 *     public domain (garden front from the bottom of the hill, colour);
 *   Counse, "Swan House, Atlanta Ga.jpg", CC BY 2.0 (garden front, roof);
 *   Daniel Di Palma, "Swan House - Cascading Fountain.jpg", CC BY-SA 4.0;
 *   Tanyawestbrook, "Swan Houae Atlanta GA 05.jpg", CC BY-SA 4.0 (front).
 * Published: built 1928 for Edward and Emily Inman, Philip T. Shutze
 *   architect; NRHP.
 * Estimated from photos: storey heights and window sizes, the attic's
 *   curve, the portico's column size (scaled from the bays), the wings'
 *   arcades.
 * Doubts: the two ends (north and south wings) are barely photographed;
 *   their arcades are taken from the front corners. Dormers, balustrades,
 *   urns and statues are left out. The roof deck's exact outline is from the
 *   lidar, which is coarse here.
 * Colour: bright white-cream stucco, the brightest thing in the daylight
 *   photos (Counse, Highsmith): the palette's `stone` for walls and garden
 *   storey alike, warmer `trim` for cornice and surrounds, a grey slate roof,
 *   dark window panels. The wings' arches are dark green, as in Counse's
 *   garden photo and Merlin's front (green canvas awnings in the openings).
 * Night: the house is floodlit for events; the walls carry a soft
 *   floodlight, strongest low on the two fronts. Windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, extrudeShape, onFace, lathe, arc, archShape, finishGlb, writeModel } from './sea-tacoma-union-station'

// ---------------------------------------------------------------- helpers

/** A quad wound so it faces `want`. */
function qf(part: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) part.quad(a, b, c, d)
  else part.quad(d, c, b, a)
}
/** A triangle wound so it faces `want`. */
function tf(part: Part, a: V3, b: V3, c: V3, want: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) part.tri(a, b, c)
  else part.tri(a, c, b)
}
/** A bevelled box: walls on `wall`, the top on `top` (or none). */
function box(wall: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bevel = 0.3) {
  prism(wall, top, bevel > 0 ? chamfer(rect(x0, y0, x1, y1), bevel) : rect(x0, y0, x1, y1), z0, z1)
}
const faceX = (x: number, sgn: 1 | -1): Face => ({ o: [x, 0, 0], n: [sgn, 0] })
const faceY = (y: number, sgn: 1 | -1): Face => ({ o: [0, y, 0], n: [0, sgn] })
/** Face coordinate s of a world coordinate along the face (s runs right, seen from outside). */
const sOf = (f: Face, w: number) => (f.n[0] !== 0 ? (f.n[0] > 0 ? w : -w) : f.n[1] > 0 ? -w : w)
const R = (s0: number, z0: number, s1: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]

/** A hipped roof over a rectangle from the eaves at z0 up to a flat deck inset by `inset` at z1. */
function hip(roof: Part, deck: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, inset: number) {
  const o: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const i: V3[] = [[x0 + inset, y0 + inset, z1], [x1 - inset, y0 + inset, z1], [x1 - inset, y1 - inset, z1], [x0 + inset, y1 - inset, z1]]
  const out: V3[] = [[0, -1, 1], [1, 0, 1], [0, 1, 1], [-1, 0, 1]]
  for (let k = 0; k < 4; k++) qf(roof, o[k], o[(k + 1) % 4], i[(k + 1) % 4], i[k], out[k])
  if (deck) deck.cap(i, true)
}

// ---------------------------------------------------------------- the model

// Main block (OSM x -9.9..7.6, y -14.0..13.9)
const MX0 = -9.9, MX1 = 7.6, MY0 = -14.0, MY1 = 13.9
const FRONT = 2.8 // forecourt level on the +x side
const EAVE = 12.3, DECK = 15.4
// Storeys (sill, head) on the entrance front; the garden front uses the same floors.
const L1: [number, number] = [FRONT + 0.7, FRONT + 4.0]
const L2: [number, number] = [FRONT + 5.3, FRONT + 8.0]

function build() {
  const wall = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part(), awning = new Part()
  const base = wall // the garden storey is the same white stucco as the walls

  // ---- the main block: plinth, walls, cornice, hipped roof with deck
  box(base, null, MX0, MY0, MX1, MY1, 0, FRONT + 0.4, 0.15)
  box(wall, null, MX0, MY0, MX1, MY1, FRONT + 0.4, EAVE - 0.7, 0.2)
  box(trim, null, MX0 - 0.15, MY0 - 0.15, MX1 + 0.15, MY1 + 0.15, FRONT + 4.6, FRONT + 4.9, 0.1) // the string course
  box(trim, null, MX0 - 0.55, MY0 - 0.55, MX1 + 0.55, MY1 + 0.55, EAVE - 0.7, EAVE, 0.3) // the cornice
  hip(roof, roof, MX0 - 0.3, MY0 - 0.3, MX1 + 0.3, MY1 + 0.3, EAVE, DECK, 5.0)
  // two chimneys on the deck, on the long axis
  for (const y of [-8.6, 8.6]) {
    box(wall, trim, -2.6, y - 1.5, 0.4, y + 1.5, DECK - 1.0, 17.6, 0.12)
    box(trim, null, -2.8, y - 1.7, 0.6, y + 1.7, 17.6, 18.0, 0.1)
  }

  // ---- windows: seven bays on each long front, five on each end
  const bayS = (f: Face, a: number, b: number, n: number) => {
    const s0 = Math.min(sOf(f, a), sOf(f, b)), s1 = Math.max(sOf(f, a), sOf(f, b)), st = (s1 - s0) / n
    return Array.from({ length: n }, (_, k) => s0 + st * (k + 0.5))
  }
  const sash = (f: Face, s: number, z: [number, number], w = 1.25) => {
    flatShape(trim, f, R(s - w / 2 - 0.25, z[0] - 0.3, s + w / 2 + 0.25, z[1] + 0.3), 0.04) // the white surround
    flatShape(win, f, R(s - w / 2, z[0], s + w / 2, z[1]), 0.08)
  }
  // entrance front (+x): 2 + 3 + 2 bays; the middle three sit in the portico
  const fE = faceX(MX1, 1)
  const sE = bayS(fE, MY0 + 0.6, MY1 - 0.6, 7)
  sE.forEach((s, k) => {
    sash(fE, s, L2)
    if (k === 3) {
      // the front door with its pedimented surround
      flatShape(trim, fE, R(s - 1.4, FRONT, s + 1.4, FRONT + 4.4), 0.04)
      flatShape(door, fE, R(s - 0.85, FRONT, s + 0.85, FRONT + 3.6), 0.08)
    } else if (k === 2 || k === 4) {
      // niches with urns either side of the door
      flatShape(trim, fE, archShape(s, 1.6, FRONT + 0.6, FRONT + 3.3, 8), 0.04)
    } else sash(fE, s, L1, 1.3)
  })
  // garden front (-x): the plinth of the garden storey, seven bays, the pedimented garden door
  const fG = faceX(MX0, -1)
  const sG = bayS(fG, MY0 + 0.6, MY1 - 0.6, 7)
  sG.forEach((s, k) => {
    sash(fG, s, L2)
    if (k === 3) {
      flatShape(trim, fG, R(s - 1.5, FRONT + 0.2, s + 1.5, FRONT + 4.0), 0.04)
      flatShape(win, fG, archShape(s, 1.9, FRONT + 0.4, FRONT + 2.7, 8), 0.08)
      // the segmental pediment over the garden door
      extrudeShape(trim, fG, [...arc(s, FRONT + 3.4, 1.9, 15, 165, 8), ...arc(s, FRONT + 3.4, 1.3, 165, 15, 8)], 0, 0.3)
    } else sash(fG, s, L1, 1.3)
  })
  // the ends: five bays, the outer ones only (the wings cover the middle)
  for (const f of [faceY(MY0, -1), faceY(MY1, 1)]) {
    const ss = bayS(f, MX0 + 0.5, MX1 - 0.5, 5)
    for (const k of [0, 4]) { sash(f, ss[k], L1, 1.2); sash(f, ss[k], L2, 1.2) }
  }

  // ---- the garden attic: a raised centre three bays wide with a curved, broken pediment and an oculus
  {
    const f = fG
    const sc = sOf(f, 0), hw = 6.0, tw = 4.2, z0 = EAVE - 0.4, zs = EAVE + 0.2, zt = 14.7, zApex = 16.6
    // concave (coved) sides sweeping in from the cornice, under a segmental pediment
    const cove = (sgn: 1 | -1): XY[] => Array.from({ length: 6 }, (_, k) => {
      const t = (k / 5) * (Math.PI / 2)
      return [sc + sgn * (hw - (hw - tw) * Math.sin(t)), zt - (zt - zs) * Math.cos(t)] as XY
    })
    const r = (tw * tw + (zApex - zt) ** 2) / (2 * (zApex - zt)), cz = zApex - r
    const a0 = (Math.atan2(zt - cz, tw) * 180) / Math.PI
    const top = arc(sc, cz, r, a0, 180 - a0, 8)
    const prof: XY[] = [[sc - hw, z0], [sc + hw, z0], ...cove(1), ...top.slice(1, -1), ...cove(-1).reverse()]
    // a slab standing on the cornice, 1.2 m deep, its face flush with the wall
    extrudeShape(wall, f, prof, -1.2, 0.0)
    flatShape(wall, { o: [MX0 + 1.2, 0, 0], n: [1, 0] }, prof.map(([s, z]) => [-s, z] as XY), 0)
    // the pediment's moulding following the arc, and the oculus
    extrudeShape(trim, f, [...arc(sc, cz, r + 0.15, a0, 180 - a0, 8), ...arc(sc, cz, r - 0.45, 180 - a0, a0, 8)], 0, 0.3)
    extrudeShape(trim, f, R(sc - tw - 0.3, zt - 0.45, sc + tw + 0.3, zt), 0, 0.25)
    flatShape(trim, f, arc(sc, 13.6, 1.0, 0, 360, 12).slice(0, -1), 0.04)
    flatShape(win, f, arc(sc, 13.6, 0.68, 0, 360, 12).slice(0, -1), 0.08)
  }

  // ---- the entrance portico: four giant Tuscan columns, entablature, pediment
  {
    const PX = 14.0, PY0 = -5.6, PY1 = 5.0, ENT0 = EAVE - 1.6, ENT1 = EAVE, APEX = 15.0
    // the porch floor, a few steps above the forecourt
    box(base, trim, MX1, PY0, PX, PY1, 0, FRONT + 0.5, 0.15)
    const cx = PX - 1.0, cr = 0.62
    for (let k = 0; k < 4; k++) {
      const y = PY0 + 0.9 + ((PY1 - PY0 - 1.8) * k) / 3
      box(trim, null, cx - 0.8, y - 0.8, cx + 0.8, y + 0.8, FRONT + 0.5, FRONT + 0.9, 0.08) // plinth
      lathe(trim, cx, y, [[cr, FRONT + 0.9], [cr * 0.86, ENT0 - 0.5], [cr * 1.15, ENT0 - 0.2], [cr * 1.15, ENT0]], 10)
    }
    box(trim, null, MX1 - 0.1, PY0, PX, PY1, ENT0, ENT1, 0.2)
    // the pediment: tympanum in stucco, raking cornices as a roof
    const fP = faceX(PX, 1)
    const s0 = Math.min(sOf(fP, PY0), sOf(fP, PY1)), s1 = Math.max(sOf(fP, PY0), sOf(fP, PY1)), sm = (s0 + s1) / 2
    flatShape(wall, fP, [[s0 + 0.3, ENT1], [s1 - 0.3, ENT1], [sm, APEX - 0.3]], -0.25)
    const ym = (PY0 + PY1) / 2
    const eL: V3 = [PX + 0.3, PY0 - 0.3, ENT1], eR: V3 = [PX + 0.3, PY1 + 0.3, ENT1], ap: V3 = [PX + 0.3, ym, APEX]
    const bL: V3 = [MX1, PY0 - 0.3, ENT1], bR: V3 = [MX1, PY1 + 0.3, ENT1], bA: V3 = [MX1, ym, APEX]
    qf(roof, eL, ap, bA, bL, [0, -1, 1.6])
    qf(roof, eR, ap, bA, bR, [0, 1, 1.6])
    // a raking cornice band around the tympanum
    extrudeShape(trim, fP, [[s0, ENT1], [sm, APEX], [s1, ENT1], [s1 - 0.6, ENT1], [sm, APEX - 0.5], [s0 + 0.6, ENT1]], -0.3, 0.3)
  }

  // ---- the end wings: one storey, arcaded, flat roofs with a parapet
  for (const [y0, y1, x0, x1] of [[MY1, 22.0, -5.5, 4.8], [-22.7, MY0, -5.3, 4.1]] as [number, number, number, number][]) {
    const WT = 9.1
    box(base, null, x0, y0, x1, y1, 0, FRONT + 0.3, 0.12)
    box(wall, roof, x0, y0, x1, y1, FRONT + 0.3, WT - 0.5, 0.15)
    box(trim, null, x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2, WT - 0.5, WT, 0.12)
    const outer = y1 > 0 ? y1 : y0, sgn = (y1 > 0 ? 1 : -1) as 1 | -1
    // arcades: three on the entrance side, three on the garden side, two on the end
    for (const f of [faceX(x1, 1), faceX(x0, -1)]) {
      const a = sOf(f, y0 + 1.0), b = sOf(f, y1 - 1.0)
      const s0 = Math.min(a, b), s1 = Math.max(a, b), st = (s1 - s0) / 3
      for (let k = 0; k < 3; k++) {
        const sc = s0 + st * (k + 0.5)
        flatShape(trim, f, archShape(sc, 2.3, FRONT + 0.3, FRONT + 3.4, 8), 0.04)
        flatShape(awning, f, archShape(sc, 1.7, FRONT + 0.3, FRONT + 3.3, 8), 0.08)
      }
    }
    const fe = faceY(outer, sgn)
    const a = sOf(fe, x0 + 1.2), b = sOf(fe, x1 - 1.2)
    const s0 = Math.min(a, b), s1 = Math.max(a, b)
    for (const sc of [s0 + (s1 - s0) * 0.25, s0 + (s1 - s0) * 0.75]) {
      flatShape(trim, fe, archShape(sc, 2.3, FRONT + 0.3, FRONT + 3.4, 8), 0.04)
      flatShape(awning, fe, archShape(sc, 1.7, FRONT + 0.3, FRONT + 3.3, 8), 0.08)
    }
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.6 ? 0.1 : Math.abs(n[0]) > 0.5 ? 0.75 - p[2] * 0.03 : 0.4)
  return finishGlb('Swan House', [
    { part: wall, material: { ...PALETTE.stone, floodlight: lit } as Swatch },
    { part: trim, material: { ...PALETTE.trim, floodlight: lit } as Swatch },
    { part: roof, material: finish('swan-slate', 0x8b9299) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('swan-door', 0x3b4f5e) },
    { part: awning, material: finish('swan-awning-green', 0x3f6b57) },
  ], { bearing: 31, height: 18.0, replaces: ['way/267926896'] }, 5000)
}

if (import.meta.main) await writeModel('atl-swan-house', build())
