/**
 * Soldiers' and Sailors' Monument, Riverside Drive at 89th Street,
 * Manhattan (Stoughton & Stoughton with Paul E. Duboy, 1902) — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-soldiers-sailors-riverside.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Bearing 0: the
 * monument is round, and its one directional feature, the door in the
 * podium under the bronze eagle, faces true south toward the lower plaza
 * (the lidar shows its projecting surround at r ≈ 8 m due south). Anchor:
 * the centroid of OSM way/270975149 (building=yes, height 31), which this
 * model replaces. y = 0 is the upper terrace round the podium (lidar 25.8 m
 * NAVD88, level across the footprint); the terrace, its balustrade and the
 * retaining wall toward the park are the map's ground, not drawn.
 *
 * Evidence
 * - Published (Wikipedia; NYC Parks; NRHP): white Vermont marble, modelled on
 *   the Choragic Monument of Lysicrates; a cylindrical temple ringed by
 *   twelve Corinthian columns on a high podium; about 100 ft (30 m) tall.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m, radial profile about the
 *   OSM centroid: base steps +0.3–2.3 m to r ≈ 7.6 m; the podium's cornice
 *   +7.0 m (seen between the columns); the main cornice +23.0 m out to
 *   r ≈ 7.0 m; a step +24.5 m at r ≈ 5–5.5 m (blocking course and the attic's
 *   ornaments); +26.3 m at r 4.5–5 m; the dome +28.9 m at the centre; the
 *   finial +30.6 m.
 * - OSM way/270975149: a 13.2 m circle (r 6.6 m), the podium drum.
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-soldiers-sailors-riverside/photos/credits.txt:
 *   Beyond My Ken (CC BY-SA 4.0, the front and its door from the lower
 *   plaza, south), Jim.henderson (public domain, from the promenade below,
 *   west), Djdacha (CC BY-SA 4.0, up the colonnade from the park), Daniel
 *   Hawk Hicks (CC BY-SA 4.0, the colonnade from the park).
 *
 * Estimated from the photos against the lidar heights: the podium's split
 * (plinth 1.6 m, drum to 6.3 m, cornice 0.7 m), the stylobate (two 0.5 m
 * steps), the columns (8.0–19.6 m, 1.04 m across on a 4.5 m radius, from
 * the photos' ratio of colonnade to podium; fluting drawn as twelve flat
 * facets), the cella (r 3.0 m, ashlar, drawn in a shade
 * of the marble), the entablature (architrave and frieze 2.4 m to r 5.15 m,
 * cornice 1.0 m to r 5.8 m), the blocking course and attic (to 25.7 m) and the dome's steps, the flame finial. The cella's
 * front window and the podium's door with its surround are flat panels and a
 * plain block; the eagles, relief band, inscriptions and the terrace
 * balustrade are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, circle, chamferRect } from './nyc-570-lexington'
import { TAU, smooth, lathe, block } from './nyc-columbus-monument'

const marble = new Part(), shade = new Part(), win = new Part(), door = new Part()
const N = 24

/** A vertical drum (r, z0..z1) with a flat top annulus down to rTop; smooth sides. */
function drum(p: Part, r: number, z0: number, z1: number, rTop = 0) {
  smooth(p, q => lathe(q, [[r, z0], [r, z1]], N, 0, 0, false), 30)
  const o = circle(0, 0, r, N), i = circle(0, 0, rTop, N)
  for (let k = 0; k < N; k++) {
    const l = (k + 1) % N
    if (rTop > 0) p.quad([i[k][0], i[k][1], z1], [o[k][0], o[k][1], z1], [o[l][0], o[l][1], z1], [i[l][0], i[l][1], z1])
    else p.tri([0, 0, z1], [o[k][0], o[k][1], z1], [o[l][0], o[l][1], z1])
  }
}

// --- Podium: a step, a moulded plinth, the drum, its cornice; then the two
// steps of the stylobate. ---
drum(marble, 7.6, 0, 0.5, 7.1)
drum(marble, 7.15, 0.5, 1.2, 6.9)
drum(marble, 6.9, 1.2, 1.6, 6.7)
drum(marble, 6.7, 1.6, 6.3, 6.6)
// A moulded band round the podium's drum (the photos show it banded).
drum(marble, 6.82, 4.7, 5.0, 6.7)
drum(marble, 7.0, 6.3, 7.0, 6.5)
drum(marble, 6.0, 7.0, 7.5, 5.7)
drum(marble, 5.7, 7.5, 8.0, 3.0)

// The door on the south face: a pedimented surround standing proud of the
// drum, the dark bronze door within.
{
  const y0 = -6.65, y1 = -7.15
  block(marble, -1.45, y1, 1.45, y0 + 0.4, 1.2, 5.6, 0.08, 0.1)
  block(marble, -1.7, y1 - 0.15, 1.7, y0 + 0.4, 5.6, 6.3, 0.08, 0.12)
  const y = y1 - 0.04
  door.quad([-0.7, y, 1.25], [0.7, y, 1.25], [0.7, y, 4.6], [-0.7, y, 4.6])
}

// --- The cella: a plain ashlar drum inside the colonnade. ---
const C0 = 8.0, C1 = 19.6
smooth(shade, q => lathe(q, [[3.0, C0], [3.0, C1]], N, 0, 0, false), 30)
// Its window, high on the south face between the columns.
{
  const r = 3.0 * Math.cos(Math.PI / N) + 0.05, w = 0.55
  // a flat panel on the facet facing −y
  win.quad([-w, -r, 15.2], [w, -r, 15.2], [w, -r, 17.6], [-w, -r, 17.6])
}

// --- Twelve Corinthian columns: base, a 12-facet fluted shaft, a bell
// capital and its abacus. The front pair straddles the door's axis. ---
for (let k = 0; k < 12; k++) {
  const a = -Math.PI / 2 + (k + 0.5) * TAU / 12
  const cx = 4.5 * Math.cos(a), cy = 4.5 * Math.sin(a)
  smooth(marble, q => lathe(q, [[0.7, C0], [0.7, C0 + 0.18], [0.62, C0 + 0.3], [0.56, C0 + 0.45], [0.52, C0 + 0.55]], 12, cx, cy, false), 50)
  const shaft = [C0 + 0.55, C1 - 1.35].map((z, i) => Array.from({ length: 12 }, (_, j): V3 => {
    const r = i === 0 ? 0.52 : 0.45, t = (j + 0.5) * TAU / 12
    return [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
  }))
  marble.loft(shaft)
  smooth(marble, q => lathe(q, [[0.45, C1 - 1.35], [0.49, C1 - 1.25], [0.57, C1 - 0.75], [0.7, C1 - 0.3]], 12, cx, cy, false), 55)
  // The abacus, square with concave sides drawn as a chamfered square, turned to the radius.
  const from = marble.pos.length
  block(marble, -0.72, -0.72, 0.72, 0.72, C1 - 0.3, C1, 0.22, 0.05)
  // turn the abacus to face out, and move it to the column
  const c = Math.cos(a), s = Math.sin(a)
  for (let i = from; i < marble.pos.length; i += 3) {
    const x = marble.pos[i], y = -marble.pos[i + 2]
    marble.pos[i] = cx + x * c - y * s; marble.pos[i + 2] = -(cy + x * s + y * c)
    const nx = marble.nrm[i], ny = -marble.nrm[i + 2]
    marble.nrm[i] = nx * c - ny * s; marble.nrm[i + 2] = -(nx * s + ny * c)
  }
}

// --- Entablature: architrave and frieze, the projecting cornice with its
// soffit, the attic. ---
// The entablature's soffit over the colonnade, then architrave and frieze.
{
  const o = circle(0, 0, 5.15, N), i = circle(0, 0, 3.0, N)
  for (let k = 0; k < N; k++) {
    const l = (k + 1) % N
    marble.quad([i[k][0], i[k][1], C1], [i[l][0], i[l][1], C1], [o[l][0], o[l][1], C1], [o[k][0], o[k][1], C1])
  }
}
drum(marble, 5.15, C1, 22.0, 5.15)
{
  // The cornice: an overhanging ring, soffit drawn.
  const o = circle(0, 0, 5.8, N), i = circle(0, 0, 5.15, N)
  for (let k = 0; k < N; k++) {
    const l = (k + 1) % N
    marble.quad([i[k][0], i[k][1], 22.0], [i[l][0], i[l][1], 22.0], [o[l][0], o[l][1], 22.0], [o[k][0], o[k][1], 22.0])
  }
  drum(marble, 5.8, 22.0, 23.0, 5.45)
}
// A blocking course, then the tall attic that carries the relief band.
drum(marble, 5.45, 23.0, 23.7, 5.05)
drum(marble, 5.05, 23.7, 25.3, 5.15)
drum(marble, 5.15, 25.3, 25.7, 4.7)

// --- The roof: a low stepped dome rising to the flame finial. ---
smooth(marble, q => lathe(q, [[4.7, 25.7], [4.5, 26.3], [3.2, 26.85], [2.2, 27.3], [1.4, 27.9], [0.95, 28.5]], N, 0, 0, true), 40)
smooth(marble, q => lathe(q, [[0.95, 28.5], [0.6, 28.75], [0.8, 29.3], [0.75, 29.8], [0.45, 30.25], [0.04, 30.6]], 12), 60)
// Four acroteria round the dome's foot, bold leaves.
for (let k = 0; k < 4; k++) {
  const a = Math.PI / 4 + k * Math.PI / 2
  const x = 4.4 * Math.cos(a), y = 4.4 * Math.sin(a)
  prism({ wall: marble, win: null, roof: marble, ring: chamferRect(x - 0.4, y - 0.4, x + 0.4, y + 0.4, 0.15), z0: 25.6, z1: 27.0, facade: null, bevel: 0.12 })
}

finishModel("Soldiers' and Sailors' Monument", 'nyc-soldiers-sailors-riverside', [
  { part: marble, material: finish('marble', 0xf1ebdf) },
  { part: shade, material: finish('marble-shade', 0xdcd3c3) },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('bronze', 0x5f6a62, 0.75) },
], { bearing: 0, osm: 'way/270975149', height: 30.6 }, 5000)
