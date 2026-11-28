/**
 * Istanbul Airport (IST), the main terminal hall and its landside canopy
 * (Grimshaw, Nordic Office of Architecture and Haptic Architects, with Scott
 * Brownrigg; opened 29 October 2018): procedural, CC0-1.0, no textures.
 *
 *   bun generators/istanbul-airport-terminal.ts
 *
 * Writes models/istanbul-airport-terminal.glb (low) and
 * models/istanbul-airport-terminal.detail.glb (detail: the roof's grid of
 * domed bays with their glass rooflights and the pale gutter seams between
 * them, glazing bars and transoms, rounder columns, a finer canopy soffit,
 * apron-drive jet-bridge stubs).
 *
 * Also the kit and frame the piers model imports (`IST` colours,
 * `archWall`, `linkBridge`, `HALL`, `PODS`); the model is only written when
 * this file is run directly.
 *
 * Why two models: the whole terminal (hall, landside canopy and three piers)
 * is about 1.3 x 1.3 km and 1.4 million m2. The hall's roof alone has 325
 * domed bays, which take about 20,000 triangles in the detail model, and the
 * piers carry ~60 link bridges and ~1,000 m of vaulted roof each. Split as
 * the hall (this model) and the piers (istanbul-airport-piers, the three
 * airside piers A-B, D and F-G), each fits its budget without thinning the
 * features that identify it. Both share this frame.
 *
 * Map frame: x along the hall (east, 0.76 deg north of true east), y north,
 * z up, metres; bearing -0.764 (the hall's north edge, way/1282537125, runs
 * 0.76 deg anticlockwise of east). Anchor: the area centroid of
 * way/1282537125, lng 28.7426135, lat 41.2611019.
 *
 * What makes it this terminal (photos)
 * - One vast flat roof over a T-shaped hall, 765 x 380 m, with a dense
 *   diagonal (diamond) grid of shallow domed bays, each with a round
 *   rooflight at its crown: from the air it reads as a quilted lattice.
 * - A thin white roof edge oversailing the walls; on the landside the roof
 *   runs on 60 m as the departures canopy, carried on two rows of tall round
 *   columns, its ribbed grey soffit dipping in domes down to every column
 *   head.
 * - Pale green curtain walls whose tops rise into round arches under each
 *   bay's soffit dome.
 * - The fixed link bridges on the airside face; the piers (other model).
 *
 * Evidence
 * - OSM (ODbL): the hall way/1282537125 (building:part, height 45, 5
 *   levels); the landside canopy way/1116947583 (building=roof, 36-45 m);
 *   325 rooflights (building:part=roof, roof:shape=dome, 45-48 m, r 7.4 m,
 *   r 9 m along the row at y = 65); 212 columns (building:part=column,
 *   r 3.2 m; the canopy's two rows drive its soffit); 8 link bridges on the
 *   hall's north face (building:part, 10-25 m); the terminal outline
 *   way/687768729 (aeroway=terminal, start_date 2018-10-29).
 * - Published: 1,440,000 m2, opened 2018, the architects (Wikipedia,
 *   "Istanbul Airport").
 * - Photos (all Wikimedia Commons or Flickr; evidence):
 *   https://commons.wikimedia.org/wiki/File:%C4%B0stanbul_Yeni_Havaliman%C4%B1_airport_Dec_2019.jpg
 *     (Kulttuurinavigaattori, CC BY-SA 4.0) aerial from the west: the roof
 *     lattice, the green walls, the roof edge, the piers;
 *   https://commons.wikimedia.org/wiki/File:Istanbul_Airport_(IST)_Turkey_(51863891833).jpg
 *     and ..._(51863894878).jpg (Sharon Hahn Darlin, CC BY 2.0, 2022)
 *     aerials from the east: the domed bays in relief, the east pier;
 *   https://commons.wikimedia.org/wiki/File:IstanbulAirport_(1).jpg and
 *     https://commons.wikimedia.org/wiki/File:IstanbulAirport_(2).jpg
 *     (CeeGee, CC BY-SA 4.0) the landside canopy: columns, domed soffit,
 *     arched glazing, the roof edge;
 *   https://commons.wikimedia.org/wiki/File:Istanbul_Airport,_Turkey.jpg
 *     (Andrey Filippov, CC BY 2.0) the canopy and the departures curb;
 *   https://commons.wikimedia.org/wiki/File:%C4%B0stanbul_Havaliman%C4%B1_Airport_2019_18.jpg
 *     and ..._2019_21.jpg (Arne Müseler, CC BY-SA 4.0) the green glazing and
 *     its arched heads, from inside;
 *   https://commons.wikimedia.org/wiki/File:A%C3%A9roport_d%27Istanbul.jpg
 *     (Nicoleon, CC BY-SA 4.0) the glazed end wall and arches;
 *   https://www.flickr.com/photos/41980486@N07/51863787951 (Sharon Hahn
 *     Darlin, CC BY 2.0) the domed bays from below;
 *   https://commons.wikimedia.org/wiki/File:Istanbul_New_Airport_2018.09.23.jpg
 *     (Jekader, CC0) the plan from high altitude.
 * - Look-only: https://commons.wikimedia.org/wiki/File:Istanbul_asv2021-11_img72_IST_Airport.jpg
 *   (A.Savin, Free Art License, which the repo's tool counts as look-only):
 *   the landside facade, used only to confirm what CeeGee's photos show.
 * - No lidar (Turkey). Mapterhorn here is z12 only and older than the
 *   airport (see Doubts).
 *
 * Numbers
 * - Plan: the OSM parts (exact). Roof top 45 m (OSM); rooflight domes to
 *   48.9 m (OSM 48; the bays' raised crowns are added under them).
 * - Estimated from the photos: roof edge 3.5 m deep (41.5-45 m); walls 9 m
 *   in from the roof edge on the airside and the ends, at the hall part's
 *   south edge on the landside; glass to the springing at 21 m, arches to
 *   37.5 m, one per 36 m bay (the roof's bay); apron-level cladding to 7 m on
 *   the airside; canopy columns 1.3 m in radius, their heads at 22.5 m, the
 *   soffit rising to 41 m between them; each bay's dome rising 2.6 m from
 *   its diamond's edges to the rooflight ring (the photos show the bays in
 *   relief; the rise is a guess); link bridges 5-20.5 m (OSM says 10-25 m;
 *   the photos show them reaching nearly to the pier eaves).
 * - Low model: the rooflight grid is left out (at 80 px a 36 m grid of
 *   domes shimmers); the roof is flat there. The detail model carries it.
 *
 * Colours: roof silver-grey, roof edge and bars white, soffit ribbed grey,
 * glass pale green (all from the daylight photos, pulled to the palette's
 * lightness); rooflight glass grey-green. Night: the green walls are
 * `window` and glow; rooflights are `glass` and stay dark.
 *
 * Doubts
 * - Mapterhorn's terrain under the site is from before the 2014-18
 *   earthworks (old pits and hills, ~90 m of relief under the footprint):
 *   the model is built flat, true to the photos. Its own lowest ground lands
 *   at about 102 m, close to the airfield's published 99 m elevation.
 * - The wall line on the airside and ends (9 m in) is read from oblique
 *   aerials only.
 * - The hall's interior levels, the departures viaduct and the car parks
 *   are not drawn (the viaduct and car parks are separate OSM features).
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { finish } from './palette'
import { type XY, capPoly, quadN, unit, area, insetRing } from './nyc-570-lexington'
import { simplify, drum, beam, prismRing, writeLod, newMats, inside, type Mats } from './tokyo-haneda-terminal-1'

const ID = 'istanbul-airport-terminal'
/** The frame shared by the Istanbul Airport terminal and piers models. */
export const IST_ANCHOR = { lng: 28.7426135, lat: 41.2611019 }
export const IST_BEARING = -0.764

// ===========================================================================
// Kit (shared with istanbul-airport-piers)
// ===========================================================================

/** Istanbul Airport colours, from daylight photos, pulled to the palette's lightness. */
export const IST = {
  /** Silver-grey standing-seam roof. */
  roof: finish('ist-roof', 0xc6cbce) as MaterialSpec,
  /** White roof edges, mullions, link bridges. */
  trim: finish('ist-trim', 0xe7e9e9) as MaterialSpec,
  /** The ribbed grey soffits and the spandrels under them. */
  soffit: finish('ist-soffit', 0xb4babe) as MaterialSpec,
  /** The pale green curtain walls; lit at night. */
  window: { name: 'window', color: 0x8db4a7, roughness: 0.35 } as MaterialSpec,
  /** Rooflights: green-tinted glass, stays dark at night. */
  glass: { name: 'glass', color: 0xb2c4c6, roughness: 0.24 } as MaterialSpec,
  /** Pale grey cladding at apron level, columns. */
  panel: finish('ist-panel', 0xd6d9da) as MaterialSpec,
  /** The link bridges to the stands. */
  bridge: finish('ist-bridge', 0xe2e5e6) as MaterialSpec,
}

export const ccwRing = (r: XY[]) => (area(r) < 0 ? r.slice().reverse() : r.slice())
const smooth = (t: number) => { const u = Math.max(0, Math.min(1, t)); return u * u * (3 - 2 * u) }

/**
 * A glazed wall a→b (counter-clockwise ring, so the outside is to the right)
 * in bays of about `pitch`: each bay's glass rises to `spring` and closes in
 * a round-headed arch reaching `crown`; the wall behind, in `back`, runs up
 * to `top`. With `mullions`, pale glazing bars every `mullions` metres and a
 * transom at the springing line.
 */
export function archWall(M: Mats, a: XY, b: XY, o: { z0: number; spring: number; crown: number; top: number; pitch: number; pier: number; back: string; seg: number; mullions?: number; base?: number }) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1) return
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number, off: number): V3 => [a[0] + u[0] * s + n[0] * off, a[1] + u[1] * s + n[1] * off, z]
  const nn: V3 = [n[0], n[1], 0]
  quadN(M[o.back], P(0, o.z0, 0), P(L, o.z0, 0), P(L, o.top, 0), P(0, o.top, 0), [nn, nn, nn, nn])
  const nb = Math.max(1, Math.round(L / o.pitch)), pitch = L / nb
  for (let k = 0; k < nb; k++) {
    const s0 = k * pitch + o.pier / 2, s1 = (k + 1) * pitch - o.pier / 2, w = s1 - s0
    if (w < 2) continue
    const rise = Math.min(o.crown - o.spring, w / 2 * 1.05)
    const head = (t: number): [number, number] => { const ang = Math.PI * (1 - t); return [s0 + w * (0.5 + 0.5 * Math.cos(ang)), o.spring + rise * Math.sin(ang)] }
    const ring: [number, number][] = [[s0, o.z0], [s1, o.z0]]
    for (let i = o.seg; i >= 0; i--) ring.push(head(i / o.seg))
    // fan from the bottom middle (the panel is convex)
    const c = P((s0 + s1) / 2, o.z0, 0.06)
    for (let i = 0; i < ring.length; i++) {
      const p = ring[i], q = ring[(i + 1) % ring.length]
      if ((p[1] === o.z0 && q[1] === o.z0)) continue
      M.win.tri(c, P(p[0], p[1], 0.06), P(q[0], q[1], 0.06), undefined, undefined, undefined, [nn, nn, nn])
    }
    if (o.mullions) {
      const nm = Math.max(1, Math.round(w / o.mullions))
      const zAt = (s: number) => { const t = (s - s0) / w; const x = 2 * t - 1; return o.spring + rise * Math.sqrt(Math.max(0, 1 - x * x)) }
      for (let m = 1; m < nm; m++) {
        const s = s0 + (w * m) / nm, h = 0.18
        const zt = zAt(s) - 0.2
        quadN(M.trim, P(s - h, o.z0, 0.12), P(s + h, o.z0, 0.12), P(s + h, zt, 0.12), P(s - h, zt, 0.12), [nn, nn, nn, nn])
      }
      quadN(M.trim, P(s0, o.spring - 0.25, 0.12), P(s1, o.spring - 0.25, 0.12), P(s1, o.spring + 0.25, 0.12), P(s0, o.spring + 0.25, 0.12), [nn, nn, nn, nn])
    }
  }
  if (o.base) { // apron-level cladding in front of the glass
    quadN(M.panel, P(0, o.z0, 0.1), P(L, o.z0, 0.1), P(L, o.base, 0.1), P(0, o.base, 0.1), [nn, nn, nn, nn])
  }
}

/**
 * The fixed link bridges ("1"-shaped OSM parts) that run out from a facade
 * to the stands: a white box on a stair-core column at its far end.
 */
export function linkBridge(M: Mats, ring: XY[], o: { z0: number; z1: number; detail: boolean }) {
  const r = ccwRing(simplify(ring, 0.6))
  prismRing(M.trim, r, o.z0, o.z1, M.roof, M.trim)
  // the stair core under the far end: the vertex farthest from the root (the ring's first long edge midpoint)
  let cx = 0, cy = 0
  for (const p of r) { cx += p[0]; cy += p[1] }
  cx /= r.length; cy /= r.length
  // far end: point of the ring farthest from the centroid along the longest axis
  let far = r[0], dmax = 0
  for (const p of r) { const d = Math.hypot(p[0] - cx, p[1] - cy); if (d > dmax) { dmax = d; far = p } }
  const fx = cx + (far[0] - cx) * 0.75, fy = cy + (far[1] - cy) * 0.75
  drum(M.panel, fx, fy, 2.2, 2.2, 0, o.z0, o.detail ? 12 : 8, null)
  if (o.detail) { // an apron-drive jet bridge running on from the far end, on its wheeled leg
    const L = Math.hypot(far[0] - cx, far[1] - cy), u: XY = [(far[0] - cx) / L, (far[1] - cy) / L]
    const a: XY = [far[0] - u[0] * 2, far[1] - u[1] * 2], b: XY = [far[0] + u[0] * 22, far[1] + u[1] * 22]
    beam(M.panel, a, b, 3.8, 4.6, 7.6, true)
    drum(M.panel, b[0] - u[0] * 4, b[1] - u[1] * 4, 0.6, 0.6, 0, 4.6, 6, null)
  }
}

// ===========================================================================
// The hall
// ===========================================================================

const Z_ROOF = 45, Z_FASCIA = 41.5, Z_SPRING = 21, Z_CROWN = 37.5, Z_CAP = 22.5, Z_SOFFIT = 41
const BAY = 36

function build(detail: boolean) {
  const M = newMats(['roof', 'trim', 'soffit', 'win', 'glass', 'panel'])
  // ---- the roof: hall and landside canopy under one slab
  const hallR = ccwRing(HALL)
  const iS0 = hallR.findIndex((p) => Math.abs(p[0] + 287.74) < 0.1 && Math.abs(p[1] + 203.69) < 0.1)
  const iS1 = hallR.findIndex((p) => Math.abs(p[0] - 289.56) < 0.1 && Math.abs(p[1] + 203.7) < 0.1)
  // replace the hall's south edge (iS0 → iS1, running east) with the canopy's
  const roofR: XY[] = simplify([...hallR.slice(0, iS0 + 1), [-288.82, -263.59], [290.55, -258.03], ...hallR.slice(iS1)], 0.3)
  capPoly(M.roof, roofR, Z_ROOF)
  // fascia, white, all round
  for (let i = 0; i < roofR.length; i++) {
    const a = roofR[i], b = roofR[(i + 1) % roofR.length]
    M.trim.quad([a[0], a[1], Z_FASCIA], [b[0], b[1], Z_FASCIA], [b[0], b[1], Z_ROOF], [a[0], a[1], Z_ROOF])
  }
  // flat soffit under the hall part (the overhang beyond the walls shows it)
  capPoly(M.soffit, simplify(hallR, 0.3), Z_FASCIA, false)

  // ---- the landside canopy's domed soffit: high between the columns, down to their heads
  const canCols = COLUMNS.filter(([, y]) => y < -205)
  const ySouth = (x: number) => -263.59 + ((x + 288.82) / (290.55 + 288.82)) * (263.59 - 258.03)
  const yN = -203.7, xW = -288.3, xE = 290.0
  const zS = (x: number, y: number) => {
    let d = 1e9
    for (const [cx, cy] of canCols) d = Math.min(d, Math.hypot(x - cx, y - cy))
    return Z_CAP + (Z_SOFFIT - Z_CAP) * smooth(Math.pow(Math.max(0, d - 1.5) / 15.5, 0.85))
  }
  const step = detail ? 3 : 6
  const nx = Math.round((xE - xW) / step), ny = detail ? 14 : 8
  const G: V3[][] = []
  for (let i = 0; i <= nx; i++) {
    const x = xW + ((xE - xW) * i) / nx, col: V3[] = []
    for (let j = 0; j <= ny; j++) { const y = yN + ((ySouth(x) + 0.4 - yN) * j) / ny; col.push([x, y, zS(x, y)]) }
    G.push(col)
  }
  const nrm = (p: V3): V3 => { const e = 0.5; return unit([(zS(p[0] + e, p[1]) - zS(p[0] - e, p[1])) / (2 * e), (zS(p[0], p[1] + e) - zS(p[0], p[1] - e)) / (2 * e), -1]) }
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const a = G[i][j], b = G[i + 1][j], c = G[i + 1][j + 1], d = G[i][j + 1]
    M.soffit.tri(a, b, c, undefined, undefined, undefined, [nrm(a), nrm(b), nrm(c)])
    M.soffit.tri(a, c, d, undefined, undefined, undefined, [nrm(a), nrm(c), nrm(d)])
  }
  // skirts from the soffit's edge up to the fascia, along the south, east and west
  const skirt = (pts: V3[], out: V3) => {
    for (let k = 0; k < pts.length - 1; k++) {
      const p = pts[k], q = pts[k + 1]
      M.soffit.tri(p, q, [q[0], q[1], Z_FASCIA + 0.05], undefined, undefined, undefined, [out, out, out])
      M.soffit.tri(p, [q[0], q[1], Z_FASCIA + 0.05], [p[0], p[1], Z_FASCIA + 0.05], undefined, undefined, undefined, [out, out, out])
    }
  }
  skirt(G.map((c) => c[ny]), [0, -1, 0])
  skirt(G[0], [-1, 0, 0])
  skirt(G[nx], [1, 0, 0])
  // columns under the canopy, flaring into the soffit
  for (const [cx, cy] of canCols) {
    drum(M.panel, cx, cy, 1.3, 1.3, 0, Z_CAP - 2.5, detail ? 14 : 8, null)
    drum(M.panel, cx, cy, 1.3, 2.4, Z_CAP - 2.5, Z_CAP + 0.6, detail ? 14 : 8, null)
  }

  // ---- glazed walls with arched heads, under the soffit
  // airside and the ends: 9 m in from the roof's edge; landside: the hall part's own south edge
  const southY = -203.7
  const wallR = ccwRing(insetRing(simplify(hallR, 0.6), 9)).map(([x, y]) => [x, y < -190 ? southY : y] as XY)
  for (let i = 0; i < wallR.length; i++) {
    const a = wallR[i], b = wallR[(i + 1) % wallR.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 2) continue
    const south = a[1] === southY && b[1] === southY // the landside wall stands at the canopy's inner edge
    archWall(M, a, b, { z0: 0, spring: Z_SPRING, crown: Z_CROWN, top: Z_FASCIA, pitch: BAY, pier: 2.2, back: 'soffit', seg: detail ? 10 : 6, mullions: detail ? 4.5 : 0, base: south ? 0 : 7 })
  }

  // ---- the link bridges on the hall's airside face
  for (const pod of PODS) if (pod.some(([x, y]) => Math.abs(y - 177) < 1.5 && Math.abs(x) < 380)) linkBridge(M, pod, { z0: 5, z1: 20.5, detail })

  // ---- rooflights (detail): every bay a low diamond pyramid with its glass dome
  if (detail) {
    const roofIn = insetRing(roofR, 1)
    for (const [cx, cy, r] of ROOFLIGHTS) {
      const h = BAY / 2
      const corners: XY[] = [[cx + h, cy], [cx, cy + h], [cx - h, cy], [cx, cy - h]]
      const zr = 47.6
      const nSeg = 8
      const angs = Array.from({ length: nSeg }, (_, i) => (2 * Math.PI * i) / nSeg)
      const ringTop: V3[] = angs.map((t) => [cx + (r + 0.4) * Math.cos(t), cy + (r + 0.4) * Math.sin(t), zr])
      if (corners.every((c) => inside(c, roofIn))) {
        // base: corners and edge midpoints, at the same angles as the top ring
        const base: V3[] = angs.map((t, i) => {
          if (i % 2 === 0) { const c = corners[i / 2]; return [c[0], c[1], Z_ROOF] }
          const c0 = corners[(i - 1) / 2], c1 = corners[((i + 1) / 2) % 4]
          return [(c0[0] + c1[0]) / 2, (c0[1] + c1[1]) / 2, Z_ROOF]
        })
        for (let i = 0; i < nSeg; i++) {
          const j = (i + 1) % nSeg
          M.roof.quad(base[i], base[j], ringTop[j], ringTop[i])
        }
        // the pale gutter seams between bays (each bay draws its two northern edges, so the lattice is whole)
        for (const [c0, c1] of [[corners[0], corners[1]], [corners[1], corners[2]]] as [XY, XY][]) {
          const L = Math.hypot(c1[0] - c0[0], c1[1] - c0[1]), w = 0.7
          const n: XY = [-(c1[1] - c0[1]) / L * w, (c1[0] - c0[0]) / L * w], z = Z_ROOF + 0.18
          M.trim.quad([c0[0] - n[0], c0[1] - n[1], z], [c1[0] - n[0], c1[1] - n[1], z], [c1[0] + n[0], c1[1] + n[1], z], [c0[0] + n[0], c0[1] + n[1], z])
        }
      } else {
        // an edge bay: a short drum up to the dome's base
        drum(M.roof, cx, cy, r + 0.4, r + 0.4, Z_ROOF - 0.2, zr, nSeg, null)
      }
      // the glass dome
      const mid: V3[] = angs.map((t) => [cx + r * 0.7 * Math.cos(t), cy + r * 0.7 * Math.sin(t), 48.5])
      for (let i = 0; i < nSeg; i++) {
        const j = (i + 1) % nSeg
        const nr = (p: V3, k: number): V3 => unit([p[0] - cx, p[1] - cy, (p[2] - 45.2) * 2.5])
        quadN(M.glass, ringTop[i], ringTop[j], mid[j], mid[i], [nr(ringTop[i], 0), nr(ringTop[j], 0), nr(mid[j], 0), nr(mid[i], 0)])
        M.glass.tri(mid[i], mid[j], [cx, cy, 48.9])
      }
    }
  }

  return [
    { part: M.roof, material: IST.roof },
    { part: M.trim, material: IST.trim },
    { part: M.soffit, material: IST.soffit },
    { part: M.win, material: IST.window },
    { part: M.glass, material: IST.glass },
    { part: M.panel, material: IST.panel },
  ]
}

// ===========================================================================
// OSM data in this frame (bearing -0.764, anchor 28.7426135, 41.2611019): the
// hall way/1282537125, the landside canopy way/1116947583, rooflights and columns.
// ===========================================================================

export const HALL: XY[] = [[-382.41, 176.98], [-382.37, 5.63], [-382.37, -4.65], [-331.93, -4.64], [-287.74, -4.45], [-287.74, -203.69], [-214.92, -203.73], [-143.62, -203.73], [-107.92, -203.72], [-70.28, -203.72], [0.92, -203.72], [73.1, -203.71], [106.35, -203.71], [144.52, -203.71], [217.1, -203.71], [289.56, -203.7], [289.54, -0.68], [382.49, -0.68], [382.67, 11.22], [382.63, 177.02], [293.9, 177.02], [289.74, 177.02], [284.62, 177.01], [246.13, 177.01], [241.51, 177.01], [236.84, 177.01], [186.36, 177], [181.63, 177.01], [176.81, 177.01], [150.4, 177.01], [150.32, 177.01], [145.36, 177.01], [141.06, 177.01], [51.69, 176.99], [28.85, 176.7], [-28.38, 176.7], [-56.94, 176.99], [-149.38, 176.99], [-153.66, 176.99], [-158.35, 176.99], [-208.98, 176.99], [-213.1, 176.99], [-218.17, 177.09], [-256.71, 176.98], [-262.01, 176.99], [-266.2, 176.98], [-292.26, 177.04], [-297.46, 176.98], [-302.43, 176.98]]
export const CANOPY: XY[] = [[-287.74, -203.69], [-288.82, -263.59], [290.55, -258.03], [289.56, -203.7], [217.1, -203.71], [144.52, -203.71], [106.35, -203.71], [73.1, -203.71], [0.92, -203.72], [-70.28, -203.72], [-107.92, -203.72], [-143.62, -203.73], [-214.92, -203.73]]
/** Hall rooflights: x, y, radius (OSM roof:shape=dome parts, 45-48 m). */
export const ROOFLIGHTS: [number, number, number][] = [[-231.95, -50.64, 7.38], [-250.06, -68.37, 7.38], [-249.64, -104.5, 7.38], [-249.89, -139.72, 7.38], [-249.8, -176.01, 7.39], [-231.85, -193.97, 7.38], [-232.16, -157.96, 7.38], [-231.77, -122.35, 7.38], [-232.06, -86.2, 7.38], [-231.81, -229.28, 7.38], [-250.18, 38.59, 7.38], [-267.99, 21.35, 7.38], [-303.49, 21.1, 7.38], [-339.59, 21.1, 7.38], [-322.37, 38.61, 7.38], [-231.85, 21.23, 7.38], [-232.25, -15.44, 7.38], [-249.71, 2.82, 7.38], [-250.63, -33.49, 7.38], [-286.15, 38.63, 7.38], [-321.85, 92.29, 7.38], [-340.11, 110.27, 7.38], [-304.02, 110.05, 7.38], [-285.81, 92.35, 7.38], [-268.47, 110.17, 7.38], [-250.34, 92.32, 7.38], [-250.88, 127.67, 7.38], [-322.28, 128.65, 7.38], [-340.18, 145.99, 7.38], [-304.33, 146.17, 7.38], [-286.14, 127.96, 7.38], [-268.52, 145.76, 7.38], [-231.96, 145.74, 7.38], [-232.15, 109.93, 7.38], [-340.4, 65.18, 8.95], [-304.24, 65.47, 8.95], [-232.23, 65.62, 8.95], [-268.59, 65.17, 8.95], [-196.08, -50.67, 7.38], [-160.28, -50.41, 7.38], [-88.69, -122.69, 7.38], [-52.82, -122.8, 7.38], [-16.9, -122.58, 7.38], [19.66, -122.32, 7.38], [-88.8, -51.06, 7.38], [-52.53, -51.01, 7.38], [-16.57, -50.71, 7.38], [19.34, -50.81, 7.38], [-124.47, -50.74, 7.38], [55.71, -51.14, 7.38], [91.61, -51.11, 7.38], [127.46, -51.01, 7.38], [162.9, -50.66, 7.38], [199.12, -50.83, 7.38], [-213.77, -175.83, 7.38], [-195.94, -193.79, 7.38], [-160.02, -193.83, 7.38], [-124, -193.96, 7.38], [-88.19, -193.89, 7.38], [-52.06, -193.7, 7.39], [-16.14, -193.73, 7.38], [19.56, -193.77, 7.38], [55.46, -193.91, 7.38], [91.39, -193.5, 7.38], [127.63, -193.43, 7.38], [163.44, -193.67, 7.38], [199.34, -193.84, 7.38], [216.9, -104.92, 7.38], [198.72, -122.42, 7.38], [216.77, -140.23, 7.38], [199.4, -157.77, 7.38], [181.59, -175.43, 7.39], [217.4, -175.64, 7.38], [145.43, -175.56, 7.38], [109.44, -175.82, 7.38], [73.75, -175.85, 7.38], [37.84, -175.96, 7.38], [1.78, -175.78, 7.38], [-34.14, -175.96, 7.38], [-70.05, -176.07, 7.38], [-106.18, -175.89, 7.38], [-142.32, -176.14, 7.38], [-177.64, -175.89, 7.38], [-196.02, -158.11, 7.38], [-160.12, -158.08, 7.38], [-124.34, -157.99, 7.38], [-88.25, -158.15, 7.38], [-52.01, -157.99, 7.38], [-16.05, -158.08, 7.38], [19.73, -157.8, 7.38], [55.77, -158.02, 7.38], [91.55, -157.86, 7.38], [127.58, -157.82, 7.38], [163.36, -157.47, 7.38], [180.96, -140.38, 7.38], [145.44, -140.48, 7.38], [109.54, -140.68, 7.38], [73.48, -140.88, 7.38], [37.48, -140.35, 7.38], [1.25, -140.36, 7.38], [-34.73, -140.48, 7.38], [-70.63, -140.68, 7.38], [-106.52, -140.62, 7.38], [-142.42, -140.48, 7.38], [-177.95, -140.06, 7.38], [-213.94, -140.35, 7.38], [55.71, -122.7, 7.38], [91.57, -122.88, 7.38], [127.52, -122.97, 7.38], [162.46, -122.42, 7.38], [180.93, -104.43, 7.38], [145.35, -104.61, 7.38], [109.44, -104.72, 7.38], [73.52, -104.97, 7.38], [37.47, -104.62, 7.38], [1.2, -104.43, 7.38], [-34.73, -104.84, 7.38], [-70.79, -104.95, 7.38], [-124.85, -122.24, 7.38], [-160.4, -122.8, 7.38], [-196.23, -122.38, 7.38], [-106.69, -104.7, 7.38], [-142.16, -104.73, 7.38], [-178.81, -104.42, 7.38], [-213.84, -104.09, 7.38], [199.08, -86.64, 7.38], [162.84, -86.74, 7.38], [127.56, -87.28, 7.38], [91.59, -86.96, 7.38], [55.44, -87.08, 7.38], [19.52, -87.22, 7.38], [-16.53, -86.32, 7.38], [-52.35, -86.93, 7.38], [-88.24, -86.79, 7.38], [-124.64, -86.81, 7.38], [-160.37, -86.59, 7.38], [-196.69, -86.61, 7.38], [217.03, -68.73, 7.38], [180.73, -68.95, 7.38], [145.36, -68.91, 7.38], [108.94, -68.95, 7.38], [73.62, -69.05, 7.38], [37.16, -68.76, 7.38], [1.19, -68.86, 7.38], [-34.65, -68.96, 7.38], [-70.62, -69.06, 7.38], [-106.65, -68.7, 7.38], [-142.36, -68.55, 7.38], [-178.72, -68.57, 7.38], [-214.44, -69.06, 7.38], [199.31, -229.2, 7.38], [163.34, -229.3, 7.38], [127.52, -229.33, 7.38], [91.47, -229.56, 7.38], [55.5, -229.47, 7.38], [19.98, -229.5, 7.38], [-16.18, -229.34, 7.38], [-52.22, -229.69, 7.38], [-88.32, -229.59, 7.38], [-124.03, -229.56, 7.38], [-160.07, -229.65, 7.38], [-195.97, -229.7, 7.38], [-214.13, 38.68, 7.38], [-195.85, 21.16, 7.38], [-214.41, 2.44, 7.38], [-214.4, -33.6, 7.38], [-178.54, -33.57, 7.38], [-196.24, -15.25, 7.38], [-160.58, -15.74, 7.38], [-142.53, -33.42, 7.38], [217.22, -33.28, 7.38], [181.06, -32.99, 7.38], [145.08, -33.04, 7.38], [109.34, -33.39, 7.38], [73.3, -33.22, 7.38], [-178.54, 38.38, 7.38], [-142.27, 38.93, 7.38], [-160.14, 21.15, 7.38], [-178.11, 2.47, 7.38], [-142.7, 2.14, 7.38], [-124.02, 21.55, 7.38], [-106.43, 38.69, 7.38], [-88.18, 21.44, 7.38], [-106.88, 2.07, 7.38], [-124.42, -15.44, 7.38], [-106.38, -33.5, 7.38], [-88.45, -15.59, 7.38], [-70.21, 2.47, 7.38], [-51.6, 19.67, 7.38], [-16.2, 20.4, 7.38], [-34.42, 38.69, 7.38], [1.34, 38.58, 7.38], [37.13, 38.41, 7.38], [19.74, 20.43, 7.38], [1.31, 2.29, 7.38], [19.46, -15.03, 7.38], [-34.17, 2.26, 7.38], [-52.62, -15.36, 7.38], [-70.54, -33.32, 7.38], [-34.68, -33.34, 7.38], [1.33, -33.24, 7.38], [37.37, -33.14, 7.38], [-16.35, -15.76, 7.38], [55.02, -15.35, 7.38], [37.15, 2.64, 7.38], [73.41, 2.62, 7.38], [91.51, -15.28, 7.38], [110.44, 1.24, 7.38], [127.77, 20.3, 7.38], [91.45, 20.08, 7.38], [55.78, 19.9, 7.38], [181.6, 2.91, 7.38], [163.27, 20.3, 7.38], [199.24, 19.65, 7.38], [217.59, 39.1, 7.38], [181.63, 38.37, 7.38], [145.53, 39.61, 7.38], [110.15, 38.17, 7.38], [73.8, 38.87, 7.38], [-70.82, 38.68, 7.38], [-214.11, 92.11, 7.38], [-177.97, 91.56, 7.38], [-196.26, 109.79, 7.38], [-213.96, 128.21, 7.38], [-196.37, 146, 7.38], [-178.53, 128.5, 7.38], [-160.53, 110.56, 7.38], [-142.39, 127.96, 7.38], [-160.54, 145.98, 7.38], [-124.02, 146.14, 7.38], [-124.13, 110.55, 7.38], [-142.6, 92.36, 7.38], [-106.33, 91.96, 7.38], [-105.7, 126.5, 7.38], [-87.99, 145.48, 7.38], [-88.15, 110.38, 7.38], [-70.29, 91.64, 7.38], [-34.5, 91.54, 7.38], [-52.21, 109.76, 7.38], [-70.51, 128.04, 7.38], [-34.63, 128.09, 7.38], [-52.18, 145.68, 7.38], [-16.51, 146.14, 7.38], [19.47, 145.94, 7.38], [1.57, 127.81, 7.38], [-16.59, 110.25, 7.38], [1.39, 92.23, 7.38], [19.3, 109.65, 7.38], [37.64, 128.04, 7.38], [55.44, 145.81, 7.38], [91.65, 146, 7.38], [73.48, 127.82, 7.38], [55.93, 109.84, 7.38], [37.35, 91.67, 7.38], [73.83, 92.06, 7.38], [91.58, 109.89, 7.38], [127.62, 109.98, 7.38], [109.72, 92.31, 7.38], [127.57, 145.56, 7.38], [145.65, 128, 7.38], [163.74, 145.78, 7.38], [199.45, 145.31, 7.38], [181.07, 128.59, 7.38], [163.52, 109.58, 7.38], [145.43, 92.3, 7.38], [181.18, 92.59, 7.38], [199.38, 110.91, 7.38], [217.37, 92.48, 7.38], [218.28, 127.13, 7.38], [-195.63, 65.32, 8.95], [-160.44, 65.09, 8.95], [-123.82, 64.81, 8.95], [-87.57, 64.77, 8.95], [-52.06, 64.89, 8.95], [-16.67, 65.21, 8.95], [20.08, 64.87, 8.95], [55.74, 65.23, 8.95], [91.32, 64.84, 8.95], [128.17, 64.68, 8.95], [163.73, 64.85, 8.95], [199.64, 64.3, 8.95], [110.1, 126.9, 7.38], [145.25, 2.82, 7.38], [217.22, 3.05, 7.38], [199.29, -14.85, 7.38], [163.29, -16.06, 7.38], [127.16, -15.72, 7.38], [235.09, -50.72, 7.38], [235.47, -193.44, 7.38], [253.34, -175.66, 7.38], [235.46, -157.86, 7.38], [252.93, -140.29, 7.38], [234.8, -122.61, 7.38], [252.67, -104.46, 7.38], [234.76, -86.79, 7.38], [252.78, -68.72, 7.38], [235.53, -229.13, 7.38], [253.08, -33.1, 7.38], [235.02, 20.9, 7.38], [271.29, 20.64, 7.38], [253.44, 39.75, 7.38], [289.12, 38.34, 7.38], [307.08, 20.68, 7.38], [324.87, 38.85, 7.38], [343.3, 21.4, 7.38], [235.46, 110.51, 7.38], [235.64, 146.27, 7.39], [271.44, 147, 7.38], [306.81, 146.77, 7.38], [342.46, 146.39, 7.38], [289.58, 129.27, 7.38], [253.12, 129.18, 7.38], [271.6, 110.85, 7.38], [253.31, 92.8, 7.38], [289.55, 93.19, 7.38], [324.57, 92.82, 7.38], [342.76, 111.05, 7.38], [306.63, 110.95, 7.38], [324.88, 129.01, 7.38], [235.39, 65.08, 8.95], [271.65, 66.13, 8.95], [307.68, 65.98, 8.95], [343.53, 66.17, 8.95], [254.61, 1.95, 7.38], [235.05, -15.4, 7.38]]
/** Columns (OSM building:part=column). */
export const COLUMNS: XY[] = [[-232.21, -176.64], [-268.44, -176.99], [-231.94, -141.98], [-267.9, -142.27], [-267.94, -104.74], [-231.59, -104.97], [-232.32, -69.56], [-267.72, -69.53], [-267.39, -214.17], [-268.25, -249], [-268.11, -33.21], [-232.36, -34.08], [-232.38, 2.72], [-268.66, 2.47], [-231.76, 39.51], [-268.02, 38.26], [-303.58, 38.22], [-340.15, 38.04], [-340.07, 91.09], [-302.69, 91.1], [-303.75, 127.37], [-340.36, 127.33], [-268.36, 127.72], [-231.97, 127.24], [-268.38, 90.74], [-231.88, 91.8], [-304.27, 3.96], [-340.07, 4.44], [-340.55, 161.24], [-304.41, 161.2], [-268.73, 161.03], [-232.31, 160.1], [19.34, -177.14], [-16.01, -176.82], [-15.87, -141.33], [-16.41, -105], [-16.44, -69.33], [55.83, -176.79], [91.78, -176.49], [127.94, -176], [163.88, -177.07], [199.64, -176.96], [-51.65, -176.33], [-88.19, -176.62], [-124.14, -176.72], [-160.87, -176.03], [-196.06, -176.74], [-52.2, -141.55], [-88.01, -141.38], [-124.07, -141.38], [-160.22, -141.86], [-196.37, -142.07], [-196.14, -105.31], [-160.81, -105.27], [-123.94, -104.87], [-88.62, -105.59], [-52.39, -105.05], [20.59, -105.13], [55.78, -105.22], [91.24, -105.17], [127.85, -105.02], [163.69, -105.12], [199.66, -105.33], [20.26, -141.18], [56.4, -140.92], [92.23, -140.82], [127.93, -140.56], [163.77, -140.45], [199.32, -140.33], [199.37, -69.44], [163.38, -69.39], [127.7, -69.35], [91.7, -69.61], [55.12, -70.01], [19.43, -69.82], [-52.24, -69.75], [-88.08, -69.72], [-124.37, -69.67], [-160.35, -69.34], [-196.63, -69.44], [198.99, -248.1], [199.7, -213.8], [163.61, -213.4], [162.94, -247.29], [127.13, -213.7], [128.03, -246.93], [-16.44, -248.56], [19.29, -248.45], [54.93, -248.25], [91.64, -247.7], [90.82, -213.6], [55.16, -213.42], [18.91, -213.52], [-16.75, -213.63], [-52.61, -213.54], [-88.48, -214.12], [-123.66, -213.85], [-160.7, -214.23], [-196.35, -213.76], [-231.92, -214.16], [-232.38, -248.41], [-196.42, -248.01], [-159.48, -248.22], [-123.82, -248.01], [-88.45, -247.91], [-52.29, -248], [-16.49, -34.36], [-16.17, 2.3], [-195.82, -33.99], [-160.64, -33.94], [-124.09, -34.69], [-88.11, -33.89], [-52.01, -34.11], [20.06, -33.41], [55.9, -33.88], [91.61, -33.6], [127.32, -33.69], [162.9, -34.28], [198.87, -33.87], [199.6, 1.67], [162.89, 2.74], [127.48, 1.6], [91.35, 2.23], [55.66, 2.12], [20.27, 2.44], [-52.01, 1.94], [-87.7, 1.97], [-124.42, 2.02], [-160.86, 2.2], [-195.95, 2.38], [-195.49, 38.88], [-160.09, 39.3], [-88.03, 38.9], [-124.27, 38.36], [-195.64, 92.21], [-159.56, 91.59], [-123.71, 91.5], [-87.87, 91.41], [-52.3, 91.45], [-15.81, 90.96], [20.03, 91.12], [55.48, 90.91], [91.97, 91.31], [127.94, 91.48], [163.53, 91.39], [199.77, 92.18], [127.33, 38.55], [163.8, 38.06], [199.64, 37.84], [198.83, 127.12], [163.63, 127.59], [127.28, 127.96], [91.31, 127.66], [55.58, 126.87], [19.87, 126.96], [-16.22, 127.05], [-52.58, 127.53], [-87.9, 127.36], [-124.12, 127.59], [-160.1, 127.18], [-195.94, 126.88], [-196.62, 160.06], [-160.62, 160.76], [-124.34, 160.57], [-88.96, 160.1], [-52.52, 160.2], [-16.83, 160.17], [19.74, 159.53], [54.69, 159.95], [91.42, 160.05], [126.98, 160.75], [162.67, 160.71], [198.8, 160.53], [-52.1, 38.01], [-16.77, 38.43], [20.87, 37.93], [56.32, 37.85], [92.81, 37.88], [234.82, -177.04], [271.18, -176.37], [235.5, -105.05], [270.69, -105.52], [235.89, -140.82], [271.28, -141.44], [271.04, -69.65], [235.5, -69.76], [235.04, -212.6], [235.99, -247.58], [270.23, -212.51], [270.35, -247.54], [235.5, -32.56], [270.55, -33.55], [270.84, 2.19], [235.15, 2.66], [235.86, 92.08], [271.43, 91.22], [308.44, 92.14], [343.38, 91.93], [235.88, 38.13], [270.29, 37.92], [307.18, 38.58], [343.03, 39.26], [342.97, 127.63], [307.01, 128.11], [270.9, 128.22], [234.67, 127.81], [235.23, 160.49], [270.63, 161.04], [306.92, 161.15], [342.46, 160.67], [307.04, 4.76], [343.13, 3.9]]

/** The fixed link bridges to the stands (OSM building:part, min_height 10, height 25). */
export const PODS: XY[][] = [[[-505.02, -23.39], [-506.07, -27.15], [-505.97, -28.55], [-506.57, -30.88], [-462.17, -45.71], [-460.83, -41.57], [-459.64, -37.91]], [[-490.3, -132.49], [-535.35, -118.63], [-536.56, -122.5], [-536.29, -123.37], [-536.97, -125.71], [-492.95, -140.68], [-491.37, -135.82]], [[-562.34, -201.83], [-564.47, -208.8], [-519.95, -223.99], [-518.44, -219.36], [-517.4, -216.14]], [[-589.66, -285.26], [-544.34, -299.26], [-545.51, -302.85], [-546.9, -307.18], [-591.7, -292.19]], [[-619.44, -361.58], [-619.53, -365.87], [-618.76, -366.56], [-618.76, -368.54], [-553.4, -369.08], [-575.26, -412.83], [-572.16, -414.58], [-572.67, -416.73], [-566.73, -419.24], [-565.2, -417.75], [-563.09, -418.54], [-544.62, -385.11], [-539.22, -375.26], [-537.09, -369.28], [-543.3, -367.15], [-548.98, -365.2], [-554.22, -363.4], [-560.04, -361.4]], [[-481.21, -377.77], [-481.07, -426.92], [-473.44, -426.93], [-473.68, -377.66], [-477.92, -377.72]], [[-479.13, 278.4], [-478.63, 276.81], [-478.07, 275.07], [-477.52, 273.33], [-476.93, 271.49], [-519.99, 257.92], [-522.06, 264.48]], [[-431.05, 282.25], [-428.69, 275.13], [-383.87, 290.38], [-386.23, 296.65]], [[-453.61, 353.37], [-453.14, 351.84], [-452.68, 350.35], [-451.91, 347.89], [-451.46, 346.44], [-408.78, 360.93], [-410.89, 367.27]], [[-509.86, 373.14], [-509.44, 371.89], [-508.75, 369.83], [-508.18, 368.11], [-507.48, 366], [-549.86, 352.3], [-552.51, 359.18]], [[-494.69, 181.37], [-492.51, 175.12], [-449.58, 188.39], [-450.17, 190.33], [-450.95, 192.58], [-451.37, 193.81], [-451.91, 195.41]], [[-409.78, 217.51], [-408.75, 214.67], [-407.54, 210.68], [-361.88, 225.43], [-363.71, 231.64]], [[-432.81, 44.9], [-477.55, 58.76], [-479.48, 51.92], [-435.31, 37.19], [-434.18, 40.69]], [[-292.26, 177.04], [-297.46, 176.98], [-302.43, 176.98], [-302.16, 204.58], [-306.83, 204.65], [-306.82, 209.37], [-300.53, 209.5], [-300.52, 211.29], [-291.92, 210.89]], [[-264.51, 209.08], [-271.77, 209.51], [-272.08, 205.41], [-266.39, 205.33], [-266.2, 176.98], [-262.01, 176.99], [-256.71, 176.98], [-256.51, 210.76], [-264.5, 211.18]], [[-579.45, 442.4], [-577.59, 436.1], [-534.71, 449.37], [-535.47, 451.72], [-536.09, 453.61], [-536.5, 454.84], [-537.02, 456.45]], [[-484.18, 467.11], [-429.79, 466.72], [-429.8, 460.13], [-484.13, 459.79], [-484.15, 461.63], [-484.16, 463.82], [-484.17, 465.39]], [[-483.83, 550.33], [-483.81, 548.51], [-483.8, 546.78], [-483.78, 544.13], [-483.76, 542.22], [-429.72, 542.72], [-429.67, 549.83]], [[-606.46, 525.7], [-604.14, 519.26], [-561.64, 532.24], [-562.29, 534.19], [-562.94, 536.16], [-563.53, 537.93], [-564.04, 539.44]], [[-633.56, 608.72], [-631.62, 602.62], [-589.14, 616.02], [-589.89, 618.1], [-590.95, 621.01], [-591.56, 622.71]], [[-590.32, 632.37], [-588.29, 633.04], [-585.99, 633.79], [-583.25, 634.7], [-581.29, 635.36], [-583.37, 642.66], [-621.6, 676.08], [-627.34, 669.52], [-591.77, 637.49]], [[-569.5, 707.86], [-570.09, 706.35], [-572.34, 705.58], [-557.78, 642.71], [-553.87, 643.52], [-550, 644.33], [-565.85, 708.8]], [[-491.11, 705.05], [-500.46, 704.97], [-500.75, 648.55], [-498.27, 648.55], [-496.18, 648.55], [-493.75, 648.55], [-490.82, 648.55]], [[-484.19, 633.98], [-484.21, 632.24], [-484.22, 630.4], [-484.24, 628.04], [-484.19, 626.53], [-430.16, 626.99], [-430.14, 633.67]], [[-217.51, 214.4], [-223.96, 214.13], [-224.07, 205.41], [-218.3, 205.44], [-218.17, 177.09], [-213.1, 176.99], [-208.98, 176.99], [-208.84, 215.84], [-217.44, 215.83]], [[-157.75, 215.84], [-157.77, 214.41], [-164.06, 214.26], [-164.07, 205.63], [-158.31, 205.72], [-158.35, 176.99], [-153.66, 176.99], [-149.38, 176.99], [-148.64, 215.92]], [[-38.26, 239.24], [-85.96, 253.62], [-87.35, 249.78], [-85.97, 249.58], [-86.5, 246.81], [-40.32, 231.79], [-39.25, 235.68]], [[-76.8, 301.79], [-76.86, 297.77], [-75.79, 297.68], [-75.58, 295.79], [-27.09, 294.92], [-27.38, 299.34], [-27.61, 302.93]], [[-76.9, 350.03], [-76.9, 345.91], [-75.35, 345.74], [-75.32, 343.66], [-27.59, 343.02], [-27.46, 347.34], [-27.36, 350.88]], [[19.7, 366.84], [19.59, 363.36], [19.48, 359.79], [68.1, 359.8], [67.98, 366.72]], [[19.71, 303.58], [19.68, 299.96], [19.66, 296], [67.19, 295.8], [69.45, 296.79], [70.09, 300.09], [69.96, 303.45]], [[31.64, 237.96], [32.76, 234.43], [33.96, 230.62], [80.3, 246.06], [79.15, 250.49], [77.67, 250.08], [77, 252.03]], [[150.32, 177.01], [150.32, 216.15], [142.02, 216.16], [142.2, 214.14], [135.57, 214.06], [135.5, 205.78], [141.35, 205.9], [141.06, 177.01], [145.36, 177.01]], [[178.02, 216.45], [177.86, 214.82], [171.35, 214.44], [171.59, 205.96], [177.34, 206.19], [176.81, 177.01], [186.36, 177], [186.29, 216.58]], [[-76.94, 421.78], [-77.03, 417.4], [-75.67, 417.57], [-75.68, 415.39], [-27.65, 414.65], [-27.64, 418.56], [-27.63, 422.29]], [[-77.08, 493.52], [-77.24, 488.98], [-75.49, 489.01], [-75.32, 486.87], [-27.62, 486.25], [-27.69, 490.3], [-27.76, 493.93]], [[-77.13, 565.66], [-77.01, 561.44], [-76.22, 561.54], [-76.2, 558.78], [-27.55, 558.57], [-27.64, 562.44], [-27.73, 565.88]], [[-77.05, 636.98], [-77.12, 632.71], [-75.44, 632.71], [-75.45, 630.54], [-27.62, 629.99], [-27.67, 634.33], [-27.71, 637.89]], [[-88.32, 711.64], [-88.21, 707.45], [-86.75, 707.32], [-86.76, 705.11], [-40.42, 704.73], [-37.55, 705.91], [-38.55, 709.25], [-39.52, 712.46], [-41.4, 712.08]], [[-27.16, 740.52], [-29.04, 746.24], [-38.03, 774.75], [-75.74, 774.65], [-75.46, 777.2], [-77.35, 777.37], [-77.23, 781.25], [-32.59, 781.61], [-19.94, 742.66], [-23.57, 741.59]], [[34.77, 724.17], [77.78, 723.84], [77.73, 721.62], [79.88, 721.33], [79.76, 717.11], [32.74, 716.94], [33.8, 720.73]], [[19.44, 653.32], [19.37, 649.5], [19.32, 646.08], [68.85, 646.43], [69.89, 648.47], [69.78, 653.43]], [[19.35, 581.69], [69.33, 581.35], [69.28, 574.83], [19.37, 574.4], [19.37, 577.77]], [[19.53, 510.39], [19.46, 506.47], [19.4, 502.97], [69.14, 503.54], [69.39, 510.18]], [[19.58, 438.47], [19.61, 435.07], [19.64, 431.37], [67.93, 431.67], [67.91, 438.35]], [[462.38, -61.32], [508.06, -46.37], [509.65, -51.09], [508.28, -51.5], [508.62, -53.04], [464.94, -68.48], [463.69, -64.97]], [[492.5, -152.22], [493.69, -156.15], [494.83, -159.96], [539.19, -144.35], [540.07, -142.14], [539.73, -140.39], [538.43, -136.9]], [[520.94, -238.92], [519.66, -235.41], [518.32, -231.74], [563.91, -216.29], [566.31, -222.99]], [[544.23, -311.14], [545.23, -314.32], [546.55, -318.53], [590.93, -303.38], [591.63, -301.15], [590.05, -296.03]], [[536.09, -361.89], [536.86, -364.61], [590.2, -388.35], [592.2, -384.08], [594.54, -385.41], [597.79, -378.97], [595.43, -377.71], [596.38, -375.93], [552.46, -356.53], [548.16, -357.94], [543.51, -359.46], [538.86, -361.06]], [[511.44, -368.22], [512.25, -374.09], [512.72, -417.91], [519.42, -417.57], [519.61, -373.66], [517.9, -367.08], [514.85, -367.56]], [[449.8, -355.31], [428.36, -355.35], [428.3, -418.81], [435.31, -418.38], [435.42, -362.29], [449.92, -362.13], [449.85, -358.35]], [[246.94, 216.35], [238.13, 216.36], [238.02, 214.76], [231.46, 214.52], [231.34, 206.43], [237.41, 206.88], [236.84, 177.01], [246.13, 177.01]], [[285.84, 216.25], [285.94, 214.69], [279.46, 214.72], [279.37, 206.66], [285.2, 206.8], [284.62, 177.01], [293.9, 177.02], [294.23, 216.31]], [[359.25, 247.18], [406.18, 232.4], [405.01, 228.74], [403.95, 225.43], [358.42, 239.99], [359.34, 242.41], [357.5, 243.05]], [[434.54, 319.73], [433.74, 316.95], [432.52, 312.73], [388.34, 327.2], [390.38, 333.77]], [[490.74, 339.17], [533.64, 324.87], [531.45, 318.61], [488.59, 332.35], [489.54, 335.36]], [[464.43, 259.16], [507.71, 244.98], [506, 239.27], [462.21, 253.04], [463.24, 255.86]], [[435.03, 168.73], [477.65, 154.58], [475.24, 147.85], [432.64, 162.39], [433.92, 165.78]], [[436.44, 18.34], [437.69, 14.74], [439.32, 10.06], [483.47, 26.04], [484.25, 27.88], [484.19, 30.18], [482.65, 33.35]], [[416.24, 413.44], [460.66, 399.48], [459.59, 396.28], [458.24, 392.21], [414.44, 407.16]], [[422.69, 517.36], [477.54, 517.85], [477.57, 514.75], [477.61, 510.75], [422.67, 511.03]], [[423.04, 601.08], [477.37, 601.86], [477.52, 593.7], [422.83, 594.38]], [[492.54, 655.2], [492.34, 659.54], [420.25, 681.14], [418.14, 672.69], [477.38, 654.91], [481.42, 654.99], [485.43, 655.06], [489.48, 655.14]], [[505.63, 713.94], [505.11, 655.41], [508.93, 655.1], [512.96, 654.77], [512.55, 715.36], [509.01, 715.53], [508.91, 713.95]], [[584.21, 696.34], [592.55, 693.94], [578.46, 649.35], [591.12, 645.24], [629.34, 651.04], [629.52, 648.96], [631.33, 648.67], [631.73, 643.7], [590.34, 638.51], [583.46, 640.54], [582.86, 639.14], [579.88, 640.2], [576.38, 641.45], [575.7, 641.69], [570.99, 643.38], [567.11, 644.76]], [[571.52, 588.59], [614.6, 575.23], [612.88, 568.78], [569.43, 581.53], [570.68, 585.75]], [[544.52, 505.33], [588.18, 491.46], [585.82, 484.53], [542.14, 497.43], [543.39, 501.46]], [[517.41, 422.57], [561.24, 408.17], [559.17, 401.45], [515.15, 415.84], [516.33, 419.35]]]

if (import.meta.main) {
  const extras = { name: 'Istanbul Airport terminal', source: `generators/${ID}.ts` }
  writeLod('Istanbul Airport terminal', `${ID}.glb`, build(false), extras, 8000, 250_000)
  writeLod('Istanbul Airport terminal', `${ID}.detail.glb`, build(true), extras, 40_000, 1_500_000)
}
