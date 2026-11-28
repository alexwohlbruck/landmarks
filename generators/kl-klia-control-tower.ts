/**
 * KLIA air traffic control tower (Tower East, the "Olympic torch", opened
 * 1998 with the airport) — procedural, CC0-1.0, no textures.
 * bun generators/kl-klia-control-tower.ts
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0. Anchor: the
 * centre of the shaft (OSM way/866700358), 101.7024503, 2.7570637.
 *
 * The torch: a tall white fluted shaft; where it meets the bowl a flared fan
 * of folded white ribs (the torch's grip); a wide bowl like a goblet, its
 * lower half grey concrete, its upper half a dark glazed band; a rim deck;
 * above it the octagonal visual control room, dark glass under a grey
 * hipped roof, and a small white radome on top. A low crescent-shaped
 * operations building under a sloping sage-green shell roof wraps the foot
 * of the tower on its south-east side.
 *
 * Evidence
 * - OSM: the tower is mapped in 3D (ways 866700345…866700358): shaft
 *   way/866700358 r 4.6 m to 95.85 m; stacked rings r 5.5 → 11.9 m from
 *   95.85 to 116.5 m (drawn as a trumpet through the same end radii, as the
 *   photos show it), the lower four "#cab091 metal", the upper three
 *   "darkgreen glass"; the rim way/866700357 ("KUL ATC Tower East",
 *   tower:type=aircraft_control) r 12.4 m, 116.5–119 m; octagons r 7.0
 *   (117.5–122 m, white), r 8.2 (122–125.05 m, glass), r 9.2 (125.05–128.1 m,
 *   light green dome), radome r 3.25 to 130 m. The operations building
 *   way/866700356, height 16 m.
 * - Published: 130 m, "shaped like an Olympic torch", in service since the
 *   airport opened in 1998 (English Wikipedia, "Kuala Lumpur International
 *   Airport"). OSM's 130 m top agrees.
 * - Photos (Wikimedia Commons):
 *   • "SMS0437 KLIA control tower s.jpg", CC BY-SA (see catalog
 *     references) — the tower from its foot: fluted shaft, the V-toothed
 *     collar, the bowl and glazed band, the octagonal cab and its teal roof,
 *     the crescent building.
 *   • "KLIA Tower.jpg", "KLIA MTB&Tower.jpg", "KLIA PTC+Tower.jpg",
 *     Craig, public domain — the tower from the apron over the terminal:
 *     the goblet silhouette, the dark band, the cab (teal-glazed in 2006).
 *   • "Aerial photograph of Malaysia on 15 January 2026 - 03.jpg" and
 *     "- 04.jpg", Yu Chu Chin, CC BY-SA 4.0 — the tower today from above:
 *     grey concrete bowl and rim, the glazed band, dark cab glass under a
 *     grey roof, the V-toothed collar, and the crescent building's sloping
 *     green-grey shell roof.
 *   • "KLIA-Tower-kualalumpur.jpg", Mausmaus, CC BY-SA 3.0.
 * - Colours from the 2026 aerials (the current finish), pulled to the
 *   palette's lightness: white shaft and teeth, pale grey concrete bowl,
 *   rim and cab, glass pulled to a light blue-grey, the operations roof
 *   the terminal's green-grey.
 *
 * Numbers: all heights and radii from OSM (above), checked against the
 * published 130 m; the 24 shaft flutes and the grip (24 folded ribs flaring
 * from the shaft at 84 m to r 7.7 m at the bowl, 98 m) are estimated from
 * "SMS0437" and the 2026 aerial, so the bowl's lowest ring is widened from
 * OSM's r 5.5 to meet them; the operations building's roof slope (16 m by the tower
 * to 11 m outside) and window bands are estimated from the 2026 aerial.
 *
 * Doubts: OSM tags the bowl's underside beige metal and the cab roof light
 * green; the 2026 aerials show both pale grey (the older photos show a
 * teal cab), and grey is drawn. The cab base is drawn a little lower
 * (121.6 m) and its glass taller than OSM's split, as the photos show. The
 * white ring walkway round the tower's foot is not in OSM and is left out.
 * The SMS0437 photo has no machine-readable author (uploader R8cocin8).
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { finish } from './palette'
import { type XY, quadN, unit, area } from './nyc-570-lexington'
import { lathe, triangulate } from './chi-aon-center'
import { writeLod, newMats } from './tokyo-haneda-terminal-1'
import { bands } from './kl-klia-terminal-1'

export const ANCHOR: [number, number] = [101.7024503, 2.7570637]

const C = {
  white: finish('klia-tower-white', 0xf1f0ec),
  window: { name: 'window', color: 0x7f99a3, roughness: 0.35 } as MaterialSpec,
  grey: finish('klia-tower-concrete', 0xcfd0cb),
  roof: finish('klia-roof', 0xaab4ad),
  panel: finish('klia-panel', 0xd5d8d6),
}

/** The operations building (OSM way/866700356), this frame. */
const OPS: XY[] = [[-12.0, -12.4], [-25.7, -28.9], [-20.2, -34.3], [-12.6, -37.6], [-5.4, -39.2], [3.4, -39.5], [10.8, -38.6], [17.6, -36.5], [24.3, -33.7], [29.8, -29.8], [34.5, -24.8], [37.7, -18.2], [39.9, -10.1], [41.0, -4.1], [41.2, 0.7], [41.0, 5.2], [40.2, 11.3], [15.2, 8.4], [15.8, 2.7], [15.9, -2.8], [14.7, -6.6], [12.5, -10.0], [8.0, -13.3], [4.6, -15.2], [-0.5, -15.5], [-5.6, -14.9], [-8.5, -14.4]]

function build(detail: boolean) {
  const M = newMats(['white', 'win', 'grey', 'roof', 'panel'])
  const n = detail ? 32 : 24
  // the shaft: 24 deep flutes, each a shallow V channel between sharp ridges,
  // facets flat-shaded so the ribs read as light and shade from any side
  const F = 24, P = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]
  const facet = (A: V3, B: V3, C: V3, D: V3) => {
    const n = unit([(B[1] - A[1]) * (D[2] - A[2]) - (B[2] - A[2]) * (D[1] - A[1]), (B[2] - A[2]) * (D[0] - A[0]) - (B[0] - A[0]) * (D[2] - A[2]), (B[0] - A[0]) * (D[1] - A[1]) - (B[1] - A[1]) * (D[0] - A[0])])
    const o = unit([(A[0] + C[0]) / 2, (A[1] + C[1]) / 2, 0])
    const nn: V3 = n[0] * o[0] + n[1] * o[1] < 0 ? [-n[0], -n[1], -n[2]] : n
    quadN(M.white, A, B, C, D, [nn, nn, nn, nn])
  }
  for (let k = 0; k < F; k++) {
    const a0 = (2 * Math.PI * k) / F, a1 = (2 * Math.PI * (k + 0.5)) / F, a2 = (2 * Math.PI * (k + 1)) / F
    const rb = 4.95, rt = 4.7, d = 0.55
    facet(P(rb, a0, 0), P(rb - d, a1, 0), P(rt - d, a1, 86), P(rt, a0, 86))
    facet(P(rb - d, a1, 0), P(rb, a2, 0), P(rt, a2, 86), P(rt - d, a1, 86))
  }
  // the torch's grip: a flared fan of 24 folded ribs, from the shaft at 84 m
  // out to 7.7 m at the bowl (98 m), over a grey core that shows between them
  lathe(M.grey, 0, 0, [[4.4, 84], [5.4, 91], [6.8, 97.6]], n)
  for (let k = 0; k < F; k++) {
    const a = (2 * Math.PI * k) / F, b = (2 * Math.PI * (k + 1)) / F, m = (a + b) / 2
    const top = 98, bot = 84, rT = 7.7, rB = 4.75
    const tA = P(rT, a, top), tB = P(rT, b, top), tM = P(rT + 0.6, m, top), pt = P(rB + 0.15, m, bot)
    // two folded facets meeting on a ridge from the point up to the rim
    const f = (X: V3, Y: V3, Z: V3) => {
      const n = unit([(Y[1] - X[1]) * (Z[2] - X[2]) - (Y[2] - X[2]) * (Z[1] - X[1]), (Y[2] - X[2]) * (Z[0] - X[0]) - (Y[0] - X[0]) * (Z[2] - X[2]), (Y[0] - X[0]) * (Z[1] - X[1]) - (Y[1] - X[1]) * (Z[0] - X[0])])
      const o: V3 = [Math.cos(m), Math.sin(m), 0]
      const nn: V3 = n[0] * o[0] + n[1] * o[1] < 0 ? [-n[0], -n[1], -n[2]] : n
      M.white.tri(X, Y, Z, undefined, undefined, undefined, [nn, nn, nn])
    }
    f(tA, pt, tM)
    f(tM, pt, tB)
    // the rib's underside back to the core (seen from below)
    const cA = P(6.8, a, 97.6), cB = P(6.8, b, 97.6)
    f(tA, cA, pt); f(cB, tB, pt)
  }
  // the bowl: grey concrete underside, then the glazed band, then the rim deck
  lathe(M.grey, 0, 0, [[6.8, 97.6], [7.75, 98.0], [8.0, 101.75], [8.6, 104.7], [9.5, 107.65]], n)
  lathe(M.win, 0, 0, [[9.5, 107.65], [10.55, 110.6], [11.6, 113.55], [12.0, 116.5]], n)
  lathe(M.grey, 0, 0, [[12.0, 116.5], [12.45, 116.5]], n)
  lathe(M.grey, 0, 0, [[12.45, 116.5], [12.45, 118.2], [11.6, 119.0], [7.3, 119.0]], n)
  // the octagonal control room: a grey base drum (OSM 117.5–122 m), the
  // glass (122–125.05 m), a grey hipped roof (125.05–128.1 m)
  const oc = Math.PI / 8
  lathe(M.grey, 0, 0, [[7.3, 119.0], [7.3, 121.6], [8.3, 121.6]], 8, oc)
  lathe(M.win, 0, 0, [[8.3, 121.6], [8.7, 125.05]], 8, oc)
  lathe(M.grey, 0, 0, [[8.7, 125.05], [9.3, 125.05], [9.3, 125.9], [7.6, 127.4], [4.0, 128.1]], 8, oc)
  lathe(M.grey, 0, 0, [[4.0, 128.1], [0.01, 128.1]], 8, oc)
  // the radome
  lathe(M.white, 0, 0, [[3.25, 128.1], [3.25, 129.0], [2.3, 129.75], [0.01, 130.0]], n)
  // mullions on the control room glass (detail)
  if (detail) {
    for (let k = 0; k < 8; k++) {
      const a = oc + (2 * Math.PI * k) / 8, r = 8.55
      const p: XY = [r * Math.cos(a), r * Math.sin(a)], nn: V3 = [Math.cos(a), Math.sin(a), 0], t: XY = [-Math.sin(a) * 0.18, Math.cos(a) * 0.18]
      quadN(M.white, [p[0] - t[0], p[1] - t[1], 121.6], [p[0] + t[0], p[1] + t[1], 121.6], [p[0] + t[0], p[1] + t[1], 125.05], [p[0] - t[0], p[1] - t[1], 125.05], [nn, nn, nn, nn])
    }
  }
  // the operations building: grey walls with window bands under a sage
  // shell roof that slopes from 16 m by the tower down to 11 m outside
  const zr = (q: XY) => 16 - (5 * Math.max(0, Math.hypot(q[0], q[1]) - 15)) / 26
  const ops = area(OPS) < 0 ? OPS.slice().reverse() : OPS.slice()
  for (let i = 0; i < ops.length; i++) {
    const a = ops[i], b = ops[(i + 1) % ops.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const nn: V3 = [(b[1] - a[1]) / L, (a[0] - b[0]) / L, 0]
    quadN(M.panel, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], zr(b) - 1.2], [a[0], a[1], zr(a) - 1.2], [nn, nn, nn, nn])
    quadN(M.roof, [a[0], a[1], zr(a) - 1.2], [b[0], b[1], zr(b) - 1.2], [b[0], b[1], zr(b)], [a[0], a[1], zr(a)], [nn, nn, nn, nn])
  }
  bands(M.win, OPS, 2.6, 5.6, 8, 1.6)
  bands(M.win, OPS, 7.0, 9.4, 8, 1.6)
  for (const [i, j, k] of triangulate(ops)) {
    const A: V3 = [ops[i][0], ops[i][1], zr(ops[i])], B: V3 = [ops[j][0], ops[j][1], zr(ops[j])], Cc: V3 = [ops[k][0], ops[k][1], zr(ops[k])]
    const g = unit([(B[1] - A[1]) * (Cc[2] - A[2]) - (B[2] - A[2]) * (Cc[1] - A[1]), (B[2] - A[2]) * (Cc[0] - A[0]) - (B[0] - A[0]) * (Cc[2] - A[2]), (B[0] - A[0]) * (Cc[1] - A[1]) - (B[1] - A[1]) * (Cc[0] - A[0])])
    const up: V3 = g[2] < 0 ? [-g[0], -g[1], -g[2]] : g
    M.roof.tri(A, B, Cc, undefined, undefined, undefined, [up, up, up])
  }

  return [
    { part: M.white, material: C.white },
    { part: M.win, material: C.window },
    { part: M.grey, material: C.grey },
    { part: M.roof, material: C.roof },
    { part: M.panel, material: C.panel },
  ]
}

if (import.meta.main) {
  const extras = { bearing: 0, osm: 'way/866700357', height: 130 }
  writeLod('KLIA Air Traffic Control Tower (Tower East)', 'kl-klia-control-tower.glb', build(false), extras, 5000, 250_000)
  writeLod('KLIA Air Traffic Control Tower (Tower East)', 'kl-klia-control-tower.detail.glb', build(true), extras, 40_000, 1_500_000)
}
