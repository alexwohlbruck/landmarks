/**
 * Adler Planetarium (1300 South DuSable Lake Shore Drive, 1930, Ernest
 * Grunsfeld Jr.; Sky Pavilion 1999, Lohan Associates), Chicago — original
 * procedural geometry, CC0-1.0.
 * bun generators/chi-adler-planetarium.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. The anchor is the centre of the dome, the area centroid of the
 * OSM part way/686342956 (41.8663603, -87.6067964), which is also the
 * centre of the twelve-sided building (way/766703208). The building faces
 * due west (its west face is square to north in OSM), so the bearing is 0.
 *
 * Identity, in order: the low twelve-sided Art Deco drum in warm, mottled
 * rainbow granite, stepped back in tiers; the big copper hemispherical dome
 * on it; the 1999 Sky Pavilion wrapping the lake (east) side as a broad
 * half-ring of dark glass, a sloping glass skirt rising to a ridge and
 * falling back to a flat terrace round the old building; the west entrance
 * with its two tall windows over the doors between fluted pylons.
 *
 * Evidence:
 *  - plan: OSM outline way/24825591 (the whole building with the Sky
 *    Pavilion: a half-ring of outer radius ~51 m about the dome, with short
 *    straight ends running west to the old building), the twelve-sided
 *    building way/766703208 (flat faces on the axes, ~46 m across the
 *    flats) and the dome way/686342956 (~26.5 m across). On USGS NAIP the
 *    Sky Pavilion's dark glass runs from ~r 33 to the outer edge, with a
 *    pale flat terrace inside it round the old building.
 *  - heights: none in OSM (building:levels 1). Estimated on Setiawan
 *    Soekamtoputra's square-on view of the west front, scaled by the
 *    46 m width: the first tier's cornice ~9 m, the second, set-back tier
 *    to ~12.8 m, a short drum band to ~15 m, the dome's rise ~10 m (apex
 *    ~25 m). The Sky Pavilion's glass ridge is about level with the first
 *    tier's cornice (Chris Rycroft's view of the front, where its ends show
 *    as glass gables either side); its skirt and terrace heights are
 *    estimates from Sea Cow's aerials.
 *  - colour: the granite's warm pink-brown grey, pulled light; the dome's
 *    copper is brown with green streaks in every photo since its
 *    re-roofing (Sea Cow 2022, Chris Rycroft 2022), not the green patina of
 *    older pictures, so it is a muted copper brown here; the Sky Pavilion's
 *    glass reads dark blue-grey.
 *
 * Photos (Wikimedia Commons): Adler_Planetarium_Front.JPG and
 * Adler_Planetarium_Different_Angle.JPG (Setiawan Soekamtoputra, CC BY-SA
 * 3.0 / public domain, west and north-west); Front_of_the_Adler_Planetarium_
 * (52030354607).jpg (Chris Rycroft, CC BY 2.0, west); Adler_Planetarium_SW
 * .jpg, Adler_Planetarium_W.jpg and Adler_Planetarium_E.jpg (Sea Cow, CC
 * BY-SA 4.0, aerials from the south-west, south-east and west);
 * AdlerPlanetarium.jpg (Omkarjpathak, CC BY-SA 4.0). USGS NAIP for the
 * plan. No commercial imagery.
 *
 * Left out: the zodiac plaques and the pylons' fluting, the dome's ribs,
 * the entrance steps' handrails, the Doane Observatory (a separate OSM
 * building, not replaced), sculpture on the plaza.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, lathe, panel, relief, save, walls, type XY } from './chi-field-museum'

/** A regular polygon with apothem `a` and `n` sides, a flat face on the +x axis. */
const poly = (a: number, n = 12): XY[] => {
  const R = a / Math.cos(Math.PI / n)
  return Array.from({ length: n }, (_, i) => {
    const t = -Math.PI / n + (i * 2 * Math.PI) / n
    return [R * Math.cos(t), R * Math.sin(t)] as XY
  })
}

function build() {
  const granite = new Part(), copper = new Part(), glass = new Part(), roof = new Part(), win = new Part(), trim = new Part()

  // --- The 1930 building: a twelve-sided block with a stepped attic, a
  // twelve-sided drum, the dome.
  const T1 = 10.0, T2 = 11.8, DRUM = 16.2, APEX = 25.7
  const t1 = poly(23), t3 = poly(14.2)
  walls(granite, t1, 0, T1)
  // Stepped Art Deco attic: two set-back bands.
  cap(granite, t1, T1)
  walls(granite, poly(22.2), T1, T1 + 0.9)
  cap(granite, poly(22.2), T1 + 0.9)
  walls(granite, poly(21.4), T1 + 0.9, T2)
  cap(roof, poly(21.4), T2)
  walls(granite, t3, T2, DRUM - 0.5)
  block(granite, granite, poly(14.5), DRUM - 0.5, DRUM, 0.25)
  // Pilaster strips on the drum's corners.
  for (let i = 0; i < 12; i++) relief(trim, t3[i], t3[(i + 1) % 12], 0.05, 0.9, T2, DRUM - 0.6, 0.25)

  // Pylons at the first tier's corners: slim stone strips standing proud.
  for (let i = 0; i < 12; i++) {
    const a = t1[i], b = t1[(i + 1) % 12]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    relief(trim, a, b, 0.1, 1.5, 0.6, T1 - 0.6, 0.35)
    relief(trim, a, b, L - 1.5, L - 0.1, 0.6, T1 - 0.6, 0.35)
  }
  // The west face (index 6, flat face on -x): two tall windows over doors.
  {
    const a = t1[6], b = t1[7]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (const c of [L * 0.3, L * 0.7]) panel(win, a, b, c - 1.7, c + 1.7, 1.6, 7.4)
    // Entrance steps: a broad stepped block in front of the west face.
    for (let k = 0; k < 3; k++) {
      const x1 = -23 - 0.0, x0 = -23 - 2.2 * (k + 1)
      block(granite, granite, [[x0, -7], [x1, -7], [x1, 7], [x0, 7]], 0, 1.4 - 0.45 * k, 0)
    }
  }
  // Small windows on the second tier's faces.

  // --- Dome: copper, slightly flattened hemisphere on its drum, a small
  // finial.
  {
    const R = 13.3, H = APEX - DRUM, n = 9
    const prof: XY[] = []
    for (let k = 0; k <= n; k++) {
      const t = (k / n) * (Math.PI / 2)
      prof.push([R * Math.cos(t), DRUM + H * Math.sin(t)])
    }
    lathe(copper, 0, 0, prof, 24)
    lathe(trim, 0, 0, [[0.5, APEX - 0.05], [0.5, APEX + 0.6], [0.1, APEX + 1.4], [0, APEX + 1.45]], 6)
  }

  // --- Sky Pavilion: a half-ring on the east, from north to south through
  // east, plus the straight ends running west to the old building.
  {
    const R_OUT = 50.5, R_RIDGE = 38, R_IN = 30, R_TER = 22.6
    const Z_EDGE = 1.0, Z_RIDGE = 10.0, Z_IN = 7.7, Z_TER = 6.0
    const n = 18
    const at = (r: number, t: number, z: number): V3 => [r * Math.cos(t), r * Math.sin(t), z]
    for (let k = 0; k < n; k++) {
      const a = -Math.PI / 2 + (k / n) * Math.PI, b = -Math.PI / 2 + ((k + 1) / n) * Math.PI
      // Stone curb, glass skirt up to the ridge, glass slope down to the
      // terrace, and the terrace itself.
      granite.quad(at(R_OUT, a, 0), at(R_OUT, b, 0), at(R_OUT, b, Z_EDGE), at(R_OUT, a, Z_EDGE))
      glass.quad(at(R_OUT, a, Z_EDGE), at(R_OUT, b, Z_EDGE), at(R_RIDGE, b, Z_RIDGE), at(R_RIDGE, a, Z_RIDGE))
      glass.quad(at(R_RIDGE, a, Z_RIDGE), at(R_RIDGE, b, Z_RIDGE), at(R_IN, b, Z_IN), at(R_IN, a, Z_IN))
      // Inner wall from the slope down to the terrace.
      roof.quad(at(R_IN, a, Z_IN), at(R_IN, b, Z_IN), at(R_TER, b, Z_TER), at(R_TER, a, Z_TER))
    }
    // End sections: the ring's cross-section closed off at north and south,
    // carried west to the outline's ends as a glazed gable.
    for (const s of [-1, 1]) {
      const W = -6.5 // west extent of the ends (outline ~x -6 to -8 here)
      const prof: [number, number][] = [[R_OUT, 0], [R_OUT, Z_EDGE], [R_RIDGE, Z_RIDGE], [R_IN, Z_IN], [R_TER, Z_TER], [R_TER, 0]]
      // Points in (x, |y|): the end face at x = 0 is the ring's own end;
      // the straight part runs from x = 0 to x = W.
      const P = (x: number, r: number, z: number): V3 => [x, s * r, z]
      // Roof surfaces of the straight part.
      const surf = (r0: number, z0: number, r1: number, z1: number, p: Part) => {
        const q: V3[] = [P(0, r0, z0), P(W, r0, z0), P(W, r1, z1), P(0, r1, z1)]
        // Face up/outwards: wind by the sign of s.
        if (s < 0) p.quad(q[0], q[3], q[2], q[1]); else p.quad(q[0], q[1], q[2], q[3])
      }
      surf(R_OUT, Z_EDGE, R_RIDGE, Z_RIDGE, glass)
      surf(R_RIDGE, Z_RIDGE, R_IN, Z_IN, glass)
      surf(R_IN, Z_IN, R_TER, Z_TER, roof)
      // Outer curb along the straight part.
      surf(R_OUT, 0, R_OUT, Z_EDGE, granite)
      // West end gable: the cross-section as a flat wall at x = W.
      const pts = prof.map(([r, z]) => P(W, r, z))
      for (let i = 1; i < pts.length - 1; i++) {
        const A = pts[0], B = pts[i], C = pts[i + 1]
        if (s > 0) glass.tri(A, C, B); else glass.tri(A, B, C)
      }
    }
  }

  return [
    { part: granite, material: finish('rainbow-granite', 0xcdb6a6) },
    { part: trim, material: finish('granite-pylon', 0xdcc8b8) },
    { part: copper, material: finish('adler-copper', 0xa88c76) },
    { part: glass, material: { ...PALETTE.glass, color: 0x7a90a1 } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) await save('chi-adler-planetarium', 'Adler Planetarium', [41.8663603, -87.6067964], 0, build())
