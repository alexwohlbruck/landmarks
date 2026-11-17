/**
 * Walt Whitman Bridge (1957; Othmar Ammann) — procedural, CC0-1.0, no
 * textures.
 * bun generators/phl-walt-whitman-bridge.ts
 *
 * The whole suspension bridge as one placement, across the whole of its OSM
 * outline way/575987843 (y = ±650): both towers on their piers, both
 * concrete anchorages, the two main cables over the main and side spans,
 * the stiffening deck trusses at the deck's edges from end to end, and the
 * deck's underside. The approach viaducts beyond the outline (way/1044593721
 * … the Pennsylvania outline way/1044593723, and Gloucester City's) are the
 * map's. Writes a low model (towers, anchorages, cables, the trusses as
 * chords and big diagonals) and a detail model (the trusses as Warren
 * lattice with posts, suspenders, floor beams), which a map draws from
 * detailZoom up.
 *
 * Frame: x across the bridge (+x to the south side), y along it toward New
 * Jersey, z up, metres. Placed at bearing 102.52°, the line between the two
 * towers' lidar centres (OSM's tower outlines give 102.74°; their legs sit
 * a metre or so off the lidar's); the anchor (-75.1292927, 39.9051882) is
 * midway between them. The towers stand at y = ±304.05 (608.1 m apart;
 * published main span 2,000 ft, 610 m). The map owns the roadway surface:
 * the trusses stand under and beside it, and nothing here is a slab at road
 * level between them.
 *
 * Height. z = 0 is the Delaware's surface, the lowest ground under the
 * footprint. Structure heights are lidar heights above the water's own
 * returns (-0.5 m NAVD88). The anchorages stand on the ports' flat ground,
 * which the map's terrain (Mapterhorn) draws 3.7–4.1 m above its own
 * reading of the river (-1.25 m) at both sites (the lidar reads 2.5–3.5 m
 * above the water's returns), so their feet are drawn at a flat 3.8 m.
 *
 * The roadway, from lidar (OSM records no height): a vertical curve
 * 52.8 − 4.76e-5·y² over the main span, 52.8 m at midspan and 48.4 m at the
 * towers; then a 2.9 % grade to 41.0 m at y = ±560, and 2.2 % to 39.0 m at
 * the outline's ends (±650). These are the heights the trusses are built
 * around, and the heights to give the map.
 *
 * Sources:
 * - OSM: outline way/575987843 (man_made=bridge, bridge:structure=
 *   suspension, layer 1), 26 m wide, y = −650 to +656; towers
 *   way/755034376 (Pennsylvania) and way/755034375 (New Jersey;
 *   building=tower, height 115); piers way/754831388 and way/754831382
 *   (bridge:support=pier, 40 × 11 m, not buildings); anchorages
 *   way/1044593721 and way/1044593722 (bridge:support=yes, building=yes),
 *   y = ±520 to ±582, |x| ≤ 20.
 * - Lidar: USGS 3DEP USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017, flown
 *   2015; 0.5 m grids over both towers and midspan and on the Pennsylvania
 *   side span, 1 m grids over both anchorages and the outline's ends:
 *   - tower tops 117.0 m (Pennsylvania) and 117.5 m (New Jersey) over the
 *     saddles, the top strut's top 113.0 m, legs |x| 12–15.5 and 5 m deep
 *     along the bridge at the top;
 *   - the roadway as above, 29 m wide (|x| ≤ 14.5), nothing standing above
 *     it but the cables, lamp posts and sign gantries;
 *   - main cables at |x| ≈ 13.9, 55.6 m at midspan (2.8 m over the
 *     roadway) and 115.5 m at the saddles (fitted within 0.2 m at y =
 *     ±274 to ±294); side spans the parabola through 115.5 m at the tower,
 *     74.0 m at ±410 and 50.3 m at ±500 (within 0.3 m at ±334, ±430,
 *     ±450), into the anchorages at about 45.6 m at ±525;
 *   - the anchorages: seen beside the deck at |x| 15–19, level with the
 *     roadway from ±520 to ±550 (cable housings 45 m), then sloping down to
 *     the ground at ±582.
 * - Published (Wikipedia "Walt Whitman Bridge", citing DRPA and
 *   Structurae): main span 610 m; deck 92 ft 2 in wide; seven lanes; 150 ft
 *   clearance; designed by Othmar Ammann; opened 1957.
 * - Photos (Wikimedia Commons):
 *   - "Walt Whitman Bridge-2" (Elliot from Cherry Hill, NJ, CC BY-SA 2.0):
 *     a tower close from the water, the portal with its arched top strut
 *     and the arched strut under the deck, the deck truss and its
 *     underside, an anchorage;
 *   - "Walt Whitman Bridge 20100611-jag9889" (Jag9889, CC BY-SA 4.0): the
 *     deck truss from below, the Pennsylvania tower, the anchorage's
 *     battered concrete;
 *   - "Walt Whitman Bridge Philadelphia" (Ii2nmd, CC BY-SA 4.0): both
 *     towers face-on in low sun;
 *   - "Walt Whitman Bridge 2" (Paul Luffel, CC BY 2.0): the whole main span
 *     broadside;
 *   - "Walt Whitman Bridge from the air" (Doc Searls, CC BY-SA 2.0) and
 *     "Walt Whitman Bridge, Philadelphia" (Dicklyon, CC BY-SA 4.0): from
 *     above, the paint and the truss band;
 *   - night: "Walt Whitman Bridge at night" (Tony Finan, CC BY 2.0).
 *
 * What makes it the Walt Whitman: two plain, tall, grey-green portal towers,
 * each two box legs tied at the top by a deep strut whose underside is a
 * shallow arch, and under the deck by a second arched strut; a long, level
 * deck carried on a lattice truss band; two cables sagging almost to the
 * roadway at midspan; low concrete anchorages.
 *
 * Estimated from photos, scaled by the lidar: the top strut's depth (113 m
 * down to 100.5 m at the legs, its arch rising to 108 m at the centre); the
 * strut under the deck (42 m down to 38 m at the centre, haunched down to
 * 32 m at the legs); the legs' section (3.8 × 6 m at the foot, 3.5 × 5 m at the
 * top); the piers' top (4 m); the truss's depth (7.3 m from the top chord at
 * the railing, 1 m over the roadway, to the bottom chord) and panels (8 m,
 * Warren with posts); the anchorages' river faces and slopes. The span
 * between each anchorage and the outline's end (±582 to ±650) is carried by
 * the same truss; its far support is outside the outline and the map's.
 * The cables are drawn 1.3 m thick against the real 23 in (0.58 m).
 *
 * Colour: the paint's grey-green from sunlit daylight photos (#a9bcbd on
 * the legs in sun, #488d8d saturated in low sun), pulled to the palette's
 * lightness; the anchorages' buff concrete (#bbac90).
 *
 * Night: the bridge is not floodlit; its lamp posts along both edges of the
 * roadway light it, and red beacons stand on the tower tops (Finan's
 * photo). The lamp heads are `lamp` beads every 40 m a side, staggered; the
 * beacons are `neon` red.
 *
 * Shared code (box, beam, cables, beads, the two-LOD writer) is in
 * phl-ben-franklin-bridge.ts.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { band, bead, footedWall, parabola, stations, tube } from './bridge-kit'
import { finish } from './palette'
import { box, cableLine, merge, one, slabXZ, writeLods, type Lod } from './phl-ben-franklin-bridge'

const T = 304.05           // tower centres at y = ±T (lidar)
const FACE = 520           // anchorages' river faces, |y| (OSM)
const LAND = 582           // anchorages' landward ends, |y| (OSM)
const END = 650            // the outline's ends, |y|
const CX = 13.9            // cable and truss planes, |x|
const LX0 = 12.0, LX1 = 15.8 // legs' inner and outer faces at the foot, |x|

/** The roadway, metres above the water (lidar). */
const road = (y: number): number => {
  const a = Math.abs(y)
  if (a <= T) return 52.8 - 4.76e-5 * y * y
  const atT = 52.8 - 4.76e-5 * T * T
  return a <= 560 ? atT - 0.029 * (a - T) : atT - 0.029 * (560 - T) - 0.022 * (a - 560)
}
const side = parabola([T, 115.5], [410, 74.0], [500, 50.3])
const cableZ = (y: number): number => {
  const a = Math.abs(y)
  return a <= T ? 55.6 + (115.5 - 55.6) * (y / T) ** 2 : side(a)
}
const TOPC = 1.0           // truss top chord (the railing) above the roadway
const DEPTH = 7.3          // top chord to bottom chord
const GROUND = 3.8

/**
 * A strut between the legs whose underside is a segmental arch: top at
 * ztop, the soffit springing at zs from the legs' faces (±xi) and rising
 * `rise` to the centre. Drawn as vertical slices, so any arch is fine.
 */
function archStrut(p: Part, xi: number, zs: number, rise: number, ztop: number, y0: number, y1: number, seg = 10) {
  const R = (xi * xi + rise * rise) / (2 * rise), zc = zs + rise - R
  const soffit = (x: number) => zc + Math.sqrt(Math.max(0, R * R - x * x))
  const pts: [number, number][] = [[-xi, ztop], [-xi, zs]]
  for (let i = 1; i < seg; i++) { const x = -xi + (2 * xi * i) / seg; pts.push([x, soffit(x)]) }
  pts.push([xi, zs], [xi, ztop])
  // Split into convex slices between consecutive soffit points.
  for (let i = 1; i < pts.length - 2; i++) {
    const [xa, za] = pts[i], [xb, zb] = pts[i + 1]
    slabXZ(p, [[xa, za], [xb, zb], [xb, ztop], [xa, ztop]], y0, y1)
  }
}

function tower(lit: Part, shade: Part, conc: Part, beacon: Part, detail: boolean) {
  const L = one(lit)
  // Pier (OSM: 40 × 11 m), rounded a little at the ends.
  box(one(conc), -20, 20, -5.5, 5.5, 0, 4.0, { r: 2.5, bottom: false })
  // Legs: box columns tapering slightly in both directions.
  for (const s of [-1, 1]) {
    const ring = (z: number, x0: number, x1: number, hy: number): V3[] => {
      const [a, b] = s > 0 ? [x0, x1] : [-x1, -x0]
      const r = detail ? 0.3 : 0
      return r > 0
        ? [[a + r, -hy, z], [b - r, -hy, z], [b, -hy + r, z], [b, hy - r, z], [b - r, hy, z], [a + r, hy, z], [a, hy - r, z], [a, -hy + r, z]]
        : [[a, -hy, z], [b, -hy, z], [b, hy, z], [a, hy, z]]
    }
    const top = 115.6
    const rings = [ring(4.0, LX0, LX1, 3.0), ring(top, CX - 1.75, CX + 1.75, 2.5)]
    const n = rings[0].length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      lit.quad(rings[0][i], rings[0][j], rings[1][j], rings[1][i])
    }
    lit.cap(rings[1], true)
    // Saddle cap and its red beacon.
    box(L, s * CX - 1.6, s * CX + 1.6, -2.2, 2.2, top, 117.2, detail ? { r: 0.3, top: 0.4 } : { r: 0 })
    bead(beacon, [s * CX, 0, 117.9], detail ? 0.5 : 0.7, !detail)
  }
  /** The legs' inner face at height z. */
  const xi = (z: number) => LX0 + ((CX - 1.75 - LX0) * (z - 4)) / (115.6 - 4)
  // The top strut, its underside a shallow arch.
  archStrut(lit, xi(106) + 0.05, 100.5, 7.5, 113.0, -2.0, 2.0, detail ? 12 : 6)
  // The strut under the deck: the truss's seat, arched below.
  archStrut(lit, xi(37) + 0.05, 32.0, 6.0, road(T) - DEPTH + TOPC - 0.1, -2.3, 2.3, detail ? 12 : 6)
  void shade
}

if (import.meta.main) {
  const mk = () => ({ lit: new Part(), shade: new Part(), conc: new Part(), lamp: new Part(), neon: new Part() })
  const low = mk(), det = mk()
  const place = (dst: Part, src: Part, dy: number) => {
    for (let i = 0; i < src.pos.length; i += 3) dst.pos.push(src.pos[i], src.pos[i + 1], src.pos[i + 2] - dy)
    dst.nrm.push(...src.nrm); dst.uv.push(...src.uv)
  }
  for (const [lod, detail] of [[low, false], [det, true]] as const) {
    const t = { lit: new Part(), shade: new Part(), conc: new Part(), neon: new Part() }
    tower(t.lit, t.shade, t.conc, t.neon, detail)
    for (const dy of [-T, T]) for (const k of ['lit', 'shade', 'conc', 'neon'] as const) place(lod[k], t[k], dy)
  }

  const spans: [number, number][] = [[-END, -T - 2.6], [-T + 2.6, T - 2.6], [T + 2.6, END]]
  const PANEL = 8.0
  const top = (y: number) => road(y) + TOPC
  const bot = (y: number) => road(y) + TOPC - DEPTH

  for (const [lod, detail] of [[low, false], [det, true]] as const) {
    for (const span of spans) {
      const cys = merge(stations(span[0], span[1], detail ? 16 : 40), span[0] < -FACE ? [-560] : span[1] > FACE ? [560] : [])
      for (const s of [-1, 1]) {
        // Deck truss at the edge: top chord (the railing) and bottom chord,
        // with Warren diagonals between.
        band(lod.lit, s * (CX - 0.5), s * (CX + 0.5), cys, top, (y) => top(y) - 0.9, { out: true, in: true, top: true, bottom: true, ends: true })
        band(lod.lit, s * (CX - 0.5), s * (CX + 0.5), cys, (y) => bot(y) + 1.0, bot, { out: true, in: detail, top: detail, bottom: true, ends: true })
        // Far view: a darker web behind the diagonals, so the truss reads as
        // the lattice band it is from a distance.
        if (!detail) band(lod.shade, s * (CX - 0.5), s * (CX - 0.45), cys, (y) => top(y) - 0.9, (y) => bot(y) + 1.0, { out: true })
        const ps = stations(span[0], span[1], detail ? PANEL : 2 * PANEL)
        for (let i = 0; i < ps.length - 1; i++) {
          const [ya, yb] = i % 2 ? [ps[i], ps[i + 1]] : [ps[i + 1], ps[i]]
          tube(lod.lit, [[s * CX, ya, bot(ya) + 0.8], [s * CX, yb, top(yb) - 0.7]], detail ? 0.3 : 0.45, detail ? 4 : 3)
          if (detail) tube(lod.lit, [[s * CX, ps[i], bot(ps[i]) + 0.8], [s * CX, ps[i], top(ps[i]) - 0.7]], 0.22, 4)
        }
        // Suspenders (detail only), one per two panels, over the suspended spans.
        if (detail) for (const y of stations(span[0], span[1], 2 * PANEL)) {
          if (Math.abs(y) > FACE) continue
          const z1 = cableZ(y) - 0.5, z0 = top(y)
          if (z1 - z0 > 0.8) tube(lod.lit, [[s * CX, y, z0], [s * CX, y, z1]], 0.18, 4)
        }
      }
      // The deck's underside: the floor under the roadway, facing down.
      band(lod.shade, -CX, CX, cys, (y) => road(y) - 1.4, (y) => road(y) - 1.4, { bottom: true })
      // Floor beams and bottom lateral bracing (detail only).
      if (detail) for (const y of stations(span[0], span[1], PANEL)) {
        band(lod.shade, -CX + 0.5, CX - 0.5, [y - 0.3, y + 0.3], () => road(y) - 1.4, () => bot(y) + 0.5, { bottom: true, ends: true })
      }
    }

    // Cables, anchorage to anchorage over both saddles.
    const cys = merge(stations(-525, -T, detail ? 8 : 30), stations(-T, T, detail ? 10 : 38), stations(T, 525, detail ? 8 : 30))
    for (const s of [-1, 1]) tube(lod.lit, cableLine(s * CX, cys, cableZ), 0.65, detail ? 10 : 6)

    // Lamp posts along both edges, staggered.
    for (const s of [-1, 1]) for (const y of stations(-END + 20 + (s > 0 ? 20 : 0), END - 20, 40)) {
      if (Math.abs(Math.abs(y) - T) < 8) continue
      bead(lod.lamp, [s * (CX - 1.2), y, road(y) + 9.5], detail ? 0.5 : 0.7, !detail)
      if (detail) tube(lod.lit, [[s * (CX - 0.9), y, top(y)], [s * (CX - 0.9), y, road(y) + 9.6], [s * (CX - 1.2), y, road(y) + 9.8]], 0.14, 4)
    }

    // Anchorages: a concrete block under the deck's end, its river face
    // plumb, level under the deck to ±550, then sloping down to the ground
    // at the landward end; beside the deck it shows as two wedges that
    // carry the cable housings.
    for (const sy of [-1, 1]) {
      const C = lod.conc
      const g = () => GROUND
      const yr = sy * FACE, yl = sy * LAND, ym = sy * 550
      const lvl = (y: number) => road(y) + 2.5
      // Wedges beside the deck, |x| 14.5–19.5.
      for (const s of [-1, 1]) {
        const [x0, x1] = s > 0 ? [14.5, 19.5] : [-19.5, -14.5]
        const wtop = (_x: number, y: number) => Math.abs(y) <= 550 ? lvl(y) : GROUND + (lvl(ym) - GROUND) * (LAND - Math.abs(y)) / (LAND - 550)
        footedWall(C, [x0, yr], [x1, yr], g, wtop, [0, -sy, 0], 6)
        footedWall(C, [s > 0 ? x1 : x0, yr], [s > 0 ? x1 : x0, yl], g, wtop, [s, 0, 0], 8)
        footedWall(C, [s > 0 ? x0 : x1, yr], [s > 0 ? x0 : x1, yl], g, wtop, [-s, 0, 0], 8)
        // The top: level, then the slope.
        band(C, x0, x1, [Math.min(yr, ym), Math.max(yr, ym)], (y) => lvl(y), (y) => lvl(y), { top: true })
        const sl = (y: number) => wtop(0, y)
        band(C, x0, x1, stations(Math.min(ym, yl), Math.max(ym, yl), 40), sl, sl, { top: true })
      }
      // The block between them, under the truss: river face and top.
      const under = (y: number) => bot(y) - 0.4
      footedWall(C, [-14.5, yr], [14.5, yr], g, (_x, y) => under(y), [0, -sy, 0], 7.25)
      const [ya, yb] = sy < 0 ? [yl, yr] : [yr, yl]
      band(C, -14.5, 14.5, [ya, yb], under, under, { top: true })
      footedWall(C, [-14.5, yl], [14.5, yl], g, () => GROUND + 0.5, [0, sy, 0], 7.25)
    }
  }

  const GREEN: MaterialSpec = finish('walt-whitman-green', 0x9fbfb4)
  const GREEN_SHADE: MaterialSpec = finish('walt-whitman-green-shade', 0x82a397)
  const CONCRETE: MaterialSpec = finish('concrete', 0xcfc3a8)
  const LAMP: MaterialSpec = { name: 'lamp', color: 0x9fbfb4, roughness: 0.85 }
  const BEACON: MaterialSpec = finish('neon-beacon-red', 0xc8443a)
  const lod = (m: ReturnType<typeof mk>, detail: boolean): Lod => [
    { part: m.lit, material: detail ? { ...GREEN, doubleSided: true } : GREEN },
    { part: m.shade, material: GREEN_SHADE },
    { part: m.conc, material: CONCRETE },
    { part: m.lamp, material: LAMP },
    { part: m.neon, material: BEACON },
  ]
  await writeLods('phl-walt-whitman-bridge', 'Walt Whitman Bridge', lod(low, false), lod(det, true), {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the towers, on the water',
    bearing: 102.52, elevation: 0, towers: [-T, T], ends: [-END, END],
    roadwayMidspan: road(0), roadwayAtTowers: road(T), roadwayAtAnchorages: road(FACE), roadwayEnds: road(END),
  })
}
