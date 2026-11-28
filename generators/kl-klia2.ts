/**
 * klia2: the main terminal building with its directly connected piers J
 * and K/L (Kuala Lumpur International Airport Terminal 2, opened 2014) —
 * procedural, CC0-1.0, no textures.
 * bun generators/kl-klia2.ts
 *
 * Writes models/kl-klia2.glb (low) and models/kl-klia2.detail.glb.
 * The satellite building, its piers P and Q and the skybridge are a
 * separate model, kl-klia2-satellite (the whole complex is over 1.4 km
 * across); it imports `K2`, `k2Materials`, `vaultBuilding` from here.
 *
 * Map frame: x = east, y = north, z up, metres, turned to bearing 325.9 (the
 * airport grid: the piers run along x, landside is +y). Anchor: area
 * centroid of the main building, OSM way/1033454787 (101.6863733,
 * 2.7427777).
 *
 * What makes klia2 itself: everything white. A long main building under a
 * white roof of parallel rounded vaults with deep eaves over dark glass;
 * from its airside face two long, low, glass-walled piers (K/L to the
 * south-west, J to the north-east) under smooth white vaulted roofs whose
 * ends roll down; on the airside a rounded nose where the skybridge sets
 * off for the satellite.
 *
 * Evidence
 * - OSM: way/1033454787 "KLIA Terminal 2 (Main Building)"
 *   (building=transportation, building:levels 3), way/1033454803 "Pier J
 *   (Domestic)" and way/1033454802 "Pier K,L (Domestic/International)"
 *   (building:levels 2), way/1033454804 (service, 2 levels), the landside
 *   canopy way/1033454786 (building=roof) and the roof way/1560211281 by
 *   pier J's root. All of relation/13829161 "KLIA Terminal 2" that this
 *   model covers. Read in this frame.
 * - Published: opened 2014; 257,845 m²; five piers J, K, L, P, Q, J/K/L
 *   joined to the main building and P/Q reached by the skybridge
 *   (English Wikipedia, "Kuala Lumpur International Airport").
 * - Photos:
 *   • "View Over KLIA2.jpg", Jason Thien (Flickr), CC BY 2.0 — the whole of
 *     klia2 from the air from the south-west: the white roofs, the parallel
 *     roof vaults of the main building, the piers' smooth vaults and
 *     rounded ends, the skybridge.
 *   • "KLIA2 2016 October.jpg", Morio, CC BY-SA 4.0 — the landside at night
 *     (the canopy and the glass); "KLIA2 4.jpg", "KLIA2 3.jpg",
 *     "KLIA2 entrance.jpg", "KLIA2 at the early dawn 1.jpg", Yjfstorehouse,
 *     CC BY-SA 4.0 — the landside canopy on raking white struts.
 *   • "Kuala Lumpur International Airport 20240509.jpg", Eugene Ormandy,
 *     CC0 — inside a pier: glass walls, timber ceiling, white raking struts.
 *   • "Bird-eye view of KLIA and KLIA2 - panoramio.jpg", CK Tan, CC BY 3.0 —
 *     the white cross of piers from altitude.
 * - Terrain: flat, Mapterhorn z12 only.
 *
 * Numbers (estimated: no lidar, no published heights)
 * - Main building: glass to 24 m, five barrel vaults 44 m wide running
 *   landside to airside, eave 24.6 m, crown 31.5 m, their ends rolled down
 *   over 16 m and the outer eaves overhanging 4 m; scaled from "View Over
 *   KLIA2" against the piers.
 * - Piers: apron level 0–5 m, glass to the eave at 13 m, crown 18.5 m
 *   (two levels, OSM); eaves 3.5 m; the far ends roll down over 22 m.
 * - Airside nose: eave 19 m, crown 25 m. Landside canopy 13 m. Pier J root
 *   roof 9 m.
 * - Colours: roofs white (#eef0ef, as the aerial shows them), glazed walls
 *   a darker blue-grey (#74899a) under them, apron level light grey panels.
 *
 * Look-only: none used.
 *
 * Doubts
 * - No licensed daylight photo from the ground shows the main building's
 *   airside or the roof profile up close; the vault count and heights come
 *   from one aerial at an angle.
 * - Jet bridges and the apron gate boxes are left out.
 */
import { type V3, type MaterialSpec } from './mesh'
import { finish } from './palette'
import { type XY, quadN, capPoly } from './nyc-570-lexington'
import { writeLod, newMats, type Mats } from './tokyo-haneda-terminal-1'
import { KL, glassWalls, ringWalls, pierVault, bands, column } from './kl-klia-terminal-1'

export const K2 = {
  roof: finish('klia2-roof', 0xeef0ef),
  soffit: finish('klia2-soffit', 0xd8d4cc),
  /** Glazed walls: darker than the white roofs, as in the aerial; lit at night. */
  window: { name: 'window', color: 0x74899a, roughness: 0.35 } as MaterialSpec,
  panel: finish('klia2-panel', 0xd2d6d6),
  struct: finish('klia2-steel', 0xf4f4f2),
  glass: KL.glass,
}
export const K2MATS = ['roof', 'soffit', 'win', 'panel', 'stone', 'glass']
export function k2Materials(M: Mats, low: boolean) {
  return [
    { part: M.roof, material: { ...K2.roof, doubleSided: low } as MaterialSpec },
    { part: M.soffit, material: K2.soffit },
    { part: M.win, material: K2.window },
    { part: M.panel, material: K2.panel },
    { part: M.stone, material: K2.struct },
    { part: M.glass, material: K2.glass },
  ]
}

/**
 * A glazed box under a vault: apron-level panels 0…base with window bands,
 * glass to the eave, the vault roof along x (or y with `swap`).
 */
export function vaultBuilding(M: Mats, a0: number, a1: number, b0: number, b1: number, o: { base: number; eave: number; crown: number; oh: number; seg: number; swap?: boolean; ends?: [boolean, boolean]; hip?: number; detail: boolean }) {
  const P = (a: number, b: number): XY => (o.swap ? [b, a] : [a, b])
  const frame = (q: V3): V3 => (o.swap ? [q[1], q[0], q[2]] : q)
  const ring: XY[] = [P(a0, b0), P(a1, b0), P(a1, b1), P(a0, b1)]
  ringWalls(M.panel, ring, 0, o.base)
  bands(M.win, ring, 1.2, o.base - 1.2, 12, 3)
  glassWalls(M, ring, o.base, () => o.eave - 0.9, o.detail ? 6 : 1e4, o.detail ? 6 : 0)
  return pierVault(M, a0, a1, b0, b1, o.eave, o.crown, o.oh, o.seg, frame, o.ends ?? [true, true], o.hip ?? 0)
}

export const ANCHOR: [number, number] = [101.6863733, 2.7427777]
export const BEARING = 325.9

function build(detail: boolean) {
  const M = newMats(K2MATS)
  const seg = detail ? 12 : 6
  // --- the main building: five parallel roof vaults running landside to airside
  const X0 = -110.2, X1 = 111.6, Y0 = -72.5, Y1 = 98.3
  const nV = 5, w = (X1 - X0) / nV // vault width ≈ 44 m
  // podium and glass walls (OSM outline, its landside corner chamfers kept)
  const main: XY[] = [[-108.0, 23.0], [-98.4, 27.2], [-93.4, 35.8], [-94.0, 97.3], [89.6, 98.3], [87.6, 28.0], [104.5, 28.3], [111.6, 21.3], [111.1, -72.3], [-110.2, -72.5]]
  ringWalls(M.panel, main, 0, 6)
  bands(M.win, main, 1.2, 4.8, 14, 3)
  glassWalls(M, main, 6, () => 24, detail ? 6 : 1e4, detail ? 7.2 : 0)
  capPoly(M.panel, main, 24)
  for (let i = 0; i < nV; i++) {
    const xa = X0 + w * i, xb = xa + w
    // each vault runs along y; frame swaps so pierVault's x is our y
    const frame = (q: V3): V3 => [q[1], q[0], q[2]]
    pierVault(M, Y0 - 3, Y1 + 3, xa, xb, 24.6, 31.5, i === 0 || i === nV - 1 ? 4 : 0.6, seg, frame, [true, true], 16)
  }
  // --- the airside nose where the skybridge sets off
  vaultBuilding(M, -131.6, -72.4, -31, 32, { base: 6, eave: 19, crown: 25, oh: 3, seg, swap: true, ends: [true, false], hip: 22, detail })
  // --- the piers
  vaultBuilding(M, 111.1, 605.1, -72.0, -38.1, { base: 5, eave: 13, crown: 18.5, oh: 3.5, seg, ends: [false, true], hip: 22, detail })
  vaultBuilding(M, -507.7, -110.2, -72.6, -42.0, { base: 5, eave: 13, crown: 18.5, oh: 3.5, seg, ends: [true, false], hip: 22, detail })
  // --- service block by pier K/L, the roof by pier J's root, the landside canopy
  const svc: XY[] = [[-109.2, -18.9], [-109.6, -41.9], [-168.6, -42.0], [-152.8, -19.2]]
  ringWalls(M.panel, svc, 0, 10)
  bands(M.win, svc, 2, 8, 10, 2)
  capPoly(M.roof, svc, 10)
  const jr: XY[] = [[104.5, 28.3], [160.9, 26.8], [160.8, 23.4], [121.5, 22.8], [121.1, -38.1], [111.1, -38.1], [111.6, 21.3]]
  canopy(M, jr, 9, 0.8, detail)
  const lc: XY[] = [[89.6, 108.1], [-94.0, 107.1], [-94.0, 97.3], [89.6, 98.3]]
  canopy(M, lc, 13, 1.0, detail)
  return k2Materials(M, !detail)
}

/** A flat roof slab on slender white posts along its outer edge. */
export function canopy(M: Mats, ring: XY[], z: number, th: number, detail: boolean) {
  ringWalls(M.roof, ring, z - th, z)
  capPoly(M.roof, ring, z)
  capPoly(M.soffit, ring, z - th, false)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.floor(L / 18)
    for (let k = 1; k <= n; k++) {
      const t = k / (n + 1), q: XY = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      // posts 1.5 m in from the edge (inward = left of a→b for a counter-clockwise ring is not guaranteed; nudge toward the ring centre)
      const c = ring.reduce((s, p) => [s[0] + p[0] / ring.length, s[1] + p[1] / ring.length], [0, 0])
      const d = Math.hypot(c[0] - q[0], c[1] - q[1]) || 1
      const p: XY = [q[0] + ((c[0] - q[0]) / d) * 1.5, q[1] + ((c[1] - q[1]) / d) * 1.5]
      column(M.stone, p[0], p[1], 0, z - th, detail ? 10 : 6, 0.5, 0.45, 0.6)
    }
  }
}

if (import.meta.main) {
  const extras = { bearing: BEARING, osm: 'way/1033454787', height: 31.5 }
  writeLod('klia2 (main terminal, piers J and K/L)', 'kl-klia2.glb', build(false), extras, 8000, 250_000)
  writeLod('klia2 (main terminal, piers J and K/L)', 'kl-klia2.detail.glb', build(true), extras, 40_000, 1_500_000)
}
