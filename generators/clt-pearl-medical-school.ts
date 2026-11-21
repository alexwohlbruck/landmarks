/**
 * Howard R. Levine Center for Education and Research, Wake Forest University
 * School of Medicine Charlotte, at The Pearl (915 Pearl Park Way, 2025,
 * Ayers Saint Gross with CO Architects and Neighboring Concepts), Charlotte —
 * original procedural geometry, CC0-1.0.
 * bun generators/clt-pearl-medical-school.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * centroid of the OSM outline way/1558943296) on the lowest ground. Placed at
 * bearing 43.0, square to the district's grid: -x (the gently curved face)
 * looks north-west to Research One and the tiered plaza, -y south-west over
 * Pearl Park Way and McDowell Street.
 *
 * Identity, in order:
 *  - a tall block of pale, sky-reflecting glass, its north-west face bowed
 *    outward so the top edge curves; fine vertical mullions;
 *  - a dark-framed glass base of three storeys under a dark ledge, on a
 *    recessed ground floor of columns;
 *  - a dark picture frame outlining a tall bay near the north end of the
 *    bowed face;
 *  - the short south-west face and the narrower south-east wing in darker
 *    glass behind close dark fins, so from the south-west the tower reads as
 *    a pale bowed sheet beside a dark finned slab.
 *
 * Evidence:
 *  - Identity and address: the school gives its campus address as 915 Pearl
 *    Park Way (https://school.wakehealth.edu/charlotte-campus) and is the
 *    anchor of the Howard R. Levine Center; 905 is the research building
 *    joined to it (Ayers Saint Gross,
 *    https://ayerssaintgross.com/work/project/the-howard-r-levine-center-for-education-and-research-1).
 *    Wikipedia ("The Pearl (Charlotte)") gives 270 ft (82 m) and 18 storeys
 *    as planned; Ayers Saint Gross lists 14 floors. Opened June 2025.
 *  - OSM: outline way/1558943296 (78 m): plan from it, the bowed north-west
 *    face included. Main block 78 m (OSM; 82 m published with the plant).
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17) predates the
 *    building; not used.
 *  - Terrain (Mapterhorn, tools/terrain.ts grid): about 5 m of fall from the
 *    north-west to the south-east corner; elevation 0.
 *  - Photos (Wikimedia Commons, daylight, City Dweller 2, CC BY-SA 4.0):
 *    "The Pearl Early June 2025.jpg" (from the south-west: the bowed top
 *    edge, the frame, the dark base and ledge, the finned slab,
 *    https://commons.wikimedia.org/wiki/File:The_Pearl_Early_June_2025.jpg);
 *    "The Pearl at the corner of South McDowell St and Pearl Park Wy Early
 *    September 2026.jpg" (from the west: the same, the columns at the foot,
 *    https://commons.wikimedia.org/wiki/File:The_Pearl_at_the_corner_of_South_McDowell_St_and_Pearl_Park_Wy_Early_September_2026.jpg).
 *    No commercial imagery. No look-only sources.
 *
 * Estimated: the finned treatment of the south-west face and the
 * south-east wing (OSM's narrower part, x 10..24), the wing at the same 78 m
 * (OSM has no parts); the ground floor 5 m, recessed 2 m; the base to 17 m;
 * mullions every 4.5 m and a spandrel line every three storeys; the frame's
 * position (a sixth to a third of the face, 17 to 46 m), from the June photo;
 * the slab's fins 0.4 m wide every 1.5 m.
 * Doubts: only the north-west and south-west faces are photographed; the
 * others are drawn alike. The school's name sign is left out.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { area, cap, inset, onWall, panel, save, walls, type XY } from './chi-aon-center'

const BEARING = 43.0
const ANCHOR: [number, number] = [35.213993, -80.8415088]

const glass = new Part(), low = new Part(), dark = new Part(), slabGlass = new Part(), roof = new Part()
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)

// main block: OSM's ring without the south-east part, the north-west face bowed
const MAIN = ccw([[-19.6, -18.3], [-20.8, -6.8], [-20.8, -1.1], [-20.8, 5.7], [-19.2, 17.1], [-16.5, 27.6], [-4.9, 27.6], [9.6, 27.6], [10.2, 17.9], [10.0, -17.0], [10.6, -28.4], [-16.4, -26.9]])
const SLAB = ccw([[10.1, -16.9], [23.8, -16.9], [22.4, 18.5], [10.2, 17.9]])
const GROUND = 5, LEDGE = 17, TOP = 78, SLAB_TOP = 78, RUN = 13.5

// --- Main block.
walls(dark, inset(MAIN, 2.0), 0, GROUND)
cap(dark, MAIN, GROUND, false)
walls(low, MAIN, GROUND, LEDGE)
walls(dark, inset(MAIN, -0.4), LEDGE - 0.6, LEDGE + 0.4) // the dark ledge
walls(glass, MAIN, LEDGE + 0.4, TOP)
cap(roof, MAIN, TOP)
walls(roof, inset(MAIN, 6), TOP, TOP + 3.5) // plant
cap(roof, inset(MAIN, 6), TOP + 3.5)

// columns under the overhang, every 9 m round the recessed ground floor
{
  const I = inset(MAIN, 1.0)
  for (let i = 0; i < I.length; i++) {
    const a = I[i], b = I[(i + 1) % I.length], { L } = onWall(a, b)
    if (L < 6) continue
    const n = Math.round(L / 9)
    for (let k = 0; k <= n; k++) {
      const s = k * L / n
      panel(dark, a, b, Math.max(0, s - 0.5), Math.min(L, s + 0.5), 0, GROUND, 0.02)
    }
  }
}
// mullions and spandrel lines on the glass, dark frames on the base
for (let i = 0; i < MAIN.length; i++) {
  const a = MAIN[i], b = MAIN[(i + 1) % MAIN.length], { L } = onWall(a, b)
  if (L < 1) continue
  const n = Math.max(1, Math.round(L / 4.5))
  for (let k = 1; k < n; k++) {
    const s = k * L / n
    panel(low, a, b, s - 0.12, s + 0.12, LEDGE + 0.4, TOP, 0.05) // pale-glass face, mullions in the base tone
    panel(dark, a, b, s - 0.2, s + 0.2, GROUND, LEDGE - 0.6, 0.05)
  }
  for (let z = LEDGE + 0.4 + RUN; z < TOP - 2; z += RUN) panel(low, a, b, 0, L, z - 0.2, z + 0.2, 0.05)
  panel(dark, a, b, 0, L, TOP - 1.0, TOP, 0.05)
}
// the dark picture frame on the bowed north-west face, a sixth to a third of the way from its north end
{
  const a: XY = [-20.8, 5.7], b: XY = [-19.2, 17.1] // the segment it sits on (wound either way, the normal faces out)
  const r = MAIN, k = r.findIndex(p => p[0] === -20.8 && p[1] === 5.7), nb = r[(k + 1) % r.length]
  const [p0, p1] = nb[1] === 17.1 ? [a, b] : [b, a]
  const { L } = onWall(p0, p1), sAt = (y: number) => (y - p0[1]) / (p1[1] - p0[1]) * L
  const s0 = Math.min(sAt(7.0), sAt(16.6)), s1 = Math.max(sAt(7.0), sAt(16.6)), z0 = LEDGE, z1 = 46, w = 0.9, out = 0.35
  panel(dark, p0, p1, s0, s0 + w, GROUND, z1 + w, out) // its outer side runs down to the columns (June photo)
  panel(dark, p0, p1, s1 - w, s1, z0, z1 + w, out)
  panel(dark, p0, p1, s0, s1, z1, z1 + w, out)
}
// the south-west face: darker glass behind close dark fins
{
  const a: XY = [-16.4, -26.9], b: XY = [10.6, -28.4]
  const k = MAIN.findIndex(p => p[0] === -16.4), nb = MAIN[(k + 1) % MAIN.length]
  const [p0, p1] = nb[0] === 10.6 ? [a, b] : [b, a]
  const { L } = onWall(p0, p1)
  panel(slabGlass, p0, p1, 0, L, LEDGE + 0.4, TOP - 1.0, 0.08)
  const n = Math.floor(L / 1.5)
  for (let k = 0; k < n; k++) { const s = (k + 0.5) * L / n; panel(dark, p0, p1, s - 0.2, s + 0.2, LEDGE + 0.4, TOP, 0.4) }
}

// --- The finned slab at the south-east end, set back, a little lower.
walls(dark, inset(SLAB, 1.0), 0, GROUND)
cap(dark, SLAB, GROUND, false)
walls(slabGlass, SLAB, GROUND, SLAB_TOP)
cap(roof, SLAB, SLAB_TOP)
for (let i = 0; i < SLAB.length; i++) {
  const a = SLAB[i], b = SLAB[(i + 1) % SLAB.length], { L } = onWall(a, b)
  if (Math.abs(a[0] - 10.1) < 0.2 && Math.abs(b[0] - 10.2) < 0.2) continue // against the main block
  if (Math.abs(a[0] - 10.2) < 0.2 && Math.abs(b[0] - 10.1) < 0.2) continue
  const n = Math.floor(L / 1.5)
  for (let k = 0; k < n; k++) {
    const s = (k + 0.5) * L / n
    panel(dark, a, b, s - 0.2, s + 0.2, GROUND, SLAB_TOP, 0.35)
  }
  panel(dark, a, b, 0, L, SLAB_TOP - 1.2, SLAB_TOP, 0.36)
}

if (import.meta.main) {
  await save('clt-pearl-medical-school', 'Levine Center, Wake Forest School of Medicine Charlotte', ANCHOR, BEARING, [
    { part: glass, material: { ...PALETTE.window, color: 0x93b4cf } },
    { part: low, material: windowVariant(2, 0x5f7b93) },
    { part: dark, material: finish('pearl-dark-frame', 0x3d3f44) },
    { part: slabGlass, material: windowVariant(3, 0x55687a) },
    { part: roof, material: PALETTE.roof },
  ], 6500)
}
