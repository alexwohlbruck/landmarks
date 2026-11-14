/**
 * The War Memorial of Korea (전쟁기념관), Yongsan, Seoul: procedural,
 * CC0-1.0.
 * bun generators/seoul-war-memorial.ts
 *
 * Map frame turned to the building: bearing -1.42, so model +x runs along
 * the main facade toward compass 88.58 (the outline's long edges, OSM
 * way/229891120). The origin is that outline's area centroid; y = 0 is the
 * forecourt, the lowest ground: the building stands on a terrace about 3 m
 * up, reached by the broad central stair (photos), and its walls run down
 * to y = 0. Elevation 0. Terrain not checked (no z15 tiles over Seoul).
 *
 * Opened 1994. OSM: the main building way/229891120 (height 45, 3 levels),
 * and the two L-shaped colonnaded wings round the forecourt, way/229995726
 * and way/229995728 (전사자명비, the corridors of the names of the fallen),
 * which also run along the front of the main facade as a portico. All used
 * as tagged; OSM's 45 m is taken as the top of the dome's lantern.
 *
 * From photos (scaled to the outline's 161 m width and the 45 m height):
 * - main block: roof at 27 m above the forecourt, a lighter cornice, a band
 *   of small windows under it, and the ground-floor portico whose piers
 *   read as tall dark slots ("Korean.War.Memorial.01", from the south);
 * - the central pavilion projecting 13 m, with two square towers rising to
 *   35 m and between them the tall glazed entrance under a curved green
 *   canopy (KOCIS 27, 23);
 * - the drum behind, about 27 m across, with small windows, under a shallow
 *   grey dome and a lantern ring;
 * - the wings: double rows of square granite piers, about 5.5 m apart,
 *   under a deep plain entablature, 15 m high (KOCIS 16).
 * The facade is symmetric about the entrance (x = 6.3); the drum and the
 *   towers are placed on that axis. OSM's outline is used as mapped, which
 *   is about 3 m off symmetric at the ends.
 * Estimated: every height but the 45 m (from the photo's proportions),
 *   window counts, pier spacing and size, the drum's radius and position,
 *   the rear block (x -25 to 13.5) at 20 m.
 * Left out: the flags, the stairs and terraces (ground), the statues and
 *   the outdoor exhibits (aircraft, ship, tanks), the gold emblem.
 *
 * Night: the entrance glazing is `entrance`; windows `window`; the granite
 * is floodlit from below (`_FLOODLIGHT`).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Korean.War.Memorial.01.jpg", Andrew Currie, CC BY 2.0 (south front)
 *   https://commons.wikimedia.org/wiki/File:Korean.War.Memorial.01.jpg
 * - "KOCIS Korea War Memorial of Korea 20140107 23 (11850465733).jpg", Korea.net / KOCIS, CC BY-SA 2.0 (south front, wide)
 *   https://commons.wikimedia.org/wiki/File:KOCIS_Korea_War_Memorial_of_Korea_20140107_23_(11850465733).jpg
 * - "KOCIS Korea War Memorial of Korea 20140107 27 (11850464113).jpg", Korea.net / KOCIS, CC BY-SA 2.0 (entrance, towers, drum)
 *   https://commons.wikimedia.org/wiki/File:KOCIS_Korea_War_Memorial_of_Korea_20140107_27_(11850464113).jpg
 * - "KOCIS Korea War Memorial of Korea 20140107 16 (11850467443).jpg", Korea.net / KOCIS, CC BY-SA 2.0 (wing colonnade)
 *   https://commons.wikimedia.org/wiki/File:KOCIS_Korea_War_Memorial_of_Korea_20140107_16_(11850467443).jpg
 * No look-only references used.
 * Doubts: no photo of the north (rear) side or from above; the rear block
 * and the drum's plan position are estimated.
 */
import { Part, cross as cross3, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { flat, lathe, polyCap, prism } from './seoul-n-seoul-tower'

type P2 = [number, number]
const granite = new Part(), trim = new Part(), win = new Part(), roof = new Part(), canopy = new Part(), door = new Part()

/** Axis-aligned box. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = p) {
  prism(p, top, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1)
}
/** A window/entrance panel on a face: 's' faces -y at y, 'e' faces +x at x, etc. */
function panel(p: Part, side: 's' | 'n' | 'e' | 'w', at: number, u0: number, u1: number, z0: number, z1: number) {
  const o = 0.06
  if (side === 's') flat(p, [[u0, at - o, z0], [u1, at - o, z0], [u1, at - o, z1], [u0, at - o, z1]], [0, -1, 0])
  if (side === 'n') flat(p, [[u0, at + o, z0], [u1, at + o, z0], [u1, at + o, z1], [u0, at + o, z1]], [0, 1, 0])
  if (side === 'w') flat(p, [[at - o, u0, z0], [at - o, u1, z0], [at - o, u1, z1], [at - o, u0, z1]], [-1, 0, 0])
  if (side === 'e') flat(p, [[at + o, u0, z0], [at + o, u1, z0], [at + o, u1, z1], [at + o, u0, z1]], [1, 0, 0])
}

function build() {
  const AX = 6.3 // the facade's axis
  const ROOF = 27
  // ---- Main block: OSM outline minus the pavilion and the rear block.
  const main: P2[] = [[-74.2, 31.6], [-74.2, 6.8], [-80.9, 6.8], [-80.4, -17.4], [-73.1, -17.4], [-73.1, -40.8], [-16.5, -40.8], [29.1, -38.6], [76.0, -38.6], [76.0, -19.3], [80.0, -19.3], [79.4, 14.5], [74.8, 14.5], [74.8, 32.6]]
  prism(granite, roof, main, 0, ROOF - 1.6)
  // cornice: a lighter projecting band all round
  const out = (r: P2[], d: number): P2[] => {
    // offset an orthogonal-ish ring outward by d (corners along bisectors)
    const n = r.length
    let s = 0
    for (let i = 0; i < n; i++) s += r[i][0] * r[(i + 1) % n][1] - r[(i + 1) % n][0] * r[i][1]
    const sg = s > 0 ? 1 : -1
    return r.map((p, i) => {
      const a = r[(i + n - 1) % n], b = r[(i + 1) % n]
      const e1 = [p[0] - a[0], p[1] - a[1]], e2 = [b[0] - p[0], b[1] - p[1]]
      const l1 = Math.hypot(e1[0], e1[1]), l2 = Math.hypot(e2[0], e2[1])
      const n1 = [sg * e1[1] / l1, -sg * e1[0] / l1], n2 = [sg * e2[1] / l2, -sg * e2[0] / l2]
      const bx = n1[0] + n2[0], by = n1[1] + n2[1], dotp = (bx * n1[0] + by * n1[1]) || 1
      return [p[0] + (bx / dotp) * d, p[1] + (by / dotp) * d] as P2
    })
  }
  prism(trim, roof, out(main, 0.6), ROOF - 1.6, ROOF)
  polyCap(trim, out(main, 0.6), ROOF - 1.6, false)
  // the continuous dark window band under the cornice, both long faces,
  // divided by low granite mullions every 3.6 m
  for (const [side, segs] of [['s', [[-72, -18.5, -40.8], [31, 74, -38.6]]], ['n', [[-72, -26, 31.6], [15, 72.5, 32.6]]]] as ['s' | 'n', [number, number, number][]][]) {
    for (const [x0, x1, y] of segs) {
      panel(win, side, y, x0, x1, 21.2, 24.2)
      const out = side === 's' ? -1 : 1
      for (let x = x0 + 1.8; x < x1 - 1; x += 3.6) box(granite, x - 0.4, x + 0.4, Math.min(y, y + out * 0.5), Math.max(y, y + out * 0.5), 21.2, 24.2, null)
    }
  }
  // ends: a few windows
  for (const y of [-12, 0, 24]) { panel(win, 'w', -80.9, y - 2.3, y + 2.3, 21.6, 24); panel(win, 'e', 80.0, y - 2.3, y + 2.3, 21.6, 24) }
  // ---- Rear block (OSM's northern projection), lower.
  box(granite, -25.1, 13.5, 31.6, 66.9, 0, 20, roof)
  box(trim, -25.7, 14.1, 31.0, 67.5, 18.8, 20.4, roof)
  // ---- Ground-floor portico along the facade: roof slab and piers, the
  //      gaps between them read as the tall dark slots.
  const PORT_Z = 11
  const portico = (x0: number, x1: number, yIn: number) => {
    box(granite, x0, x1, -51.4, yIn, PORT_Z, PORT_Z + 2.2, roof)
    // back wall, drawn in the roof grey so it reads as shade behind the piers
    // the facade behind the piers: a grid of tall dark window slits, one
    // per bay, in the granite wall (the photo's row of vertical slits)
    for (let x = x0 + 1.2; x <= x1 - 1.2; x += 4.4) {
      box(granite, x - 0.9, x + 0.9, -51.4, -49.6, 0, PORT_Z, null)
      if (x + 3.3 < x1) panel(win, 's', yIn, x + 1.5, x + 2.9, 1.0, PORT_Z - 1.2)
    }
  }
  portico(-63.5, -16.5, -40.8)
  portico(29.1, 70.4, -38.6)
  // ---- Central pavilion and its two towers.
  box(granite, -16.5, 29.1, -51.4, -38, 0, ROOF + 0.4, roof)
  for (const xc of [AX - 16.8, AX + 16.8]) {
    box(granite, xc - 6, xc + 6, -51.4, -22, 0, 35, null)
    box(trim, xc - 6.4, xc + 6.4, -51.8, -21.6, 33.8, 35.4, roof)
  }
  // the glazed entrance, recessed look: dark frame panel, glass, canopy
  panel(door, 's', -51.4, AX - 9.2, AX + 9.2, 3, 19)
  panel(win, 's', -51.4, AX - 10.8, AX + 10.8, 19, 21.5)
  // the green canopy: a straight band on top, its glazed underside curving
  // down to each side like a shallow arch (KOCIS 27), projecting 5 m
  {
    const N = 12, x0 = AX - 11.8, x1 = AX + 11.8, Y = -51.4, DEP = 5.0, TOP = 22.6
    const zb = (t: number) => 16.4 + 3.6 * Math.sin(t * Math.PI) // underside edge, arched
    const X = (t: number) => x0 + (x1 - x0) * t
    // top band
    box(canopy, x0, x1, Y - DEP, Y, TOP - 1.4, TOP, canopy)
    for (let i = 0; i < N; i++) {
      const ta = i / N, tb = (i + 1) / N
      // front face from the arched edge up to the band
      flat(canopy, [[X(ta), Y - DEP, zb(ta)], [X(tb), Y - DEP, zb(tb)], [X(tb), Y - DEP, TOP - 1.4], [X(ta), Y - DEP, TOP - 1.4]], [0, -1, 0])
      // underside, sloping back up to the wall
      const n = cross3([X(tb) - X(ta), 0, zb(tb) - zb(ta)], [0, DEP, (TOP - 1.4) - zb(ta)])
      flat(canopy, [[X(ta), Y - DEP, zb(ta)], [X(ta), Y, TOP - 1.4], [X(tb), Y, TOP - 1.4], [X(tb), Y - DEP, zb(tb)]], n[2] < 0 ? n : [-n[0], -n[1], -n[2]])
    }
    // side cheeks
    for (const [x, sx] of [[x0, -1], [x1, 1]] as [number, number][])
      flat(canopy, [[x, Y - DEP, zb(0)], [x, Y, TOP - 1.4], [x, Y - DEP, TOP - 1.4], [x, Y - DEP, TOP - 1.4]], [sx, 0, 0])
  }
  // ---- The drum and the shallow dome, on the axis behind the towers.
  const DC: [number, number] = [AX, 4]
  lathe(DC, [[13.5, ROOF - 1], [13.5, 37.8]], () => granite, 32)
  lathe(DC, [[13.5, 37.8], [14.1, 38.1], [14.1, 39.0], [13.1, 39.2]], () => trim, 32)
  lathe(DC, [[13.1, 39.2], [10.4, 41.6], [6.3, 43.4], [3.2, 43.9]], () => roof, 32, 30)
  lathe(DC, [[3.2, 43.9], [3.2, 45], [0, 45]], (b) => (b === 0 ? trim : roof), 16)
  // drum windows: small, in one band
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + Math.PI / 16, r = 13.56, w = 0.08
    const p0: V3 = [DC[0] + r * Math.cos(a - w), DC[1] + r * Math.sin(a - w), 31.5], p1: V3 = [DC[0] + r * Math.cos(a + w), DC[1] + r * Math.sin(a + w), 31.5]
    flat(win, [p0, p1, [p1[0], p1[1], 34], [p0[0], p0[1], 34]], [Math.cos(a), Math.sin(a), 0])
  }
  // ---- The wings: double colonnades under a plain entablature.
  const WZ = 11.2, WT = 15
  const wing = (xo: number, xi: number) => {
    const x0 = Math.min(xo, xi), x1 = Math.max(xo, xi)
    box(granite, x0, x1, -156, -51.4, WZ, WT - 1, roof)
    box(trim, x0 - 0.4, x1 + 0.4, -156.4, -51.4, WT - 1, WT, roof)
    for (let y = -153.9; y <= -54; y += 5.5)
      for (const x of [x0 + 1.1, x1 - 1.1]) box(granite, x - 1.0, x + 1.0, y - 1.0, y + 1.0, 0, WZ, null)
    // the end walls facing south, solid
    box(granite, x0, x1, -156, -153, 0, WZ, null)
  }
  wing(70.6, 82.0)
  wing(-63.2, -51.6)

  const lit = (p: V3, n: V3) => (n[2] > 0.6 ? 0.2 : Math.max(0.3, 1 - p[2] / 45))
  const parts = [
    { part: granite, material: { ...finish('war-memorial-granite', 0xd9d1c3), floodlight: lit } },
    { part: trim, material: { ...PALETTE.trim, color: 0xe9e2d4 } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: canopy, material: PALETTE.copper },
    { part: door, material: { ...PALETTE.entrance, color: 0x6a8190 } },
  ]
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('War Memorial of Korea', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: -1.42, elevation: 0, height: 45,
  })
  if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
  const outp = new URL('../models/seoul-war-memorial.glb', import.meta.url).pathname
  Bun.write(outp, glb)
  console.log(`${outp}: ${triangles} triangles, ${glb.length} bytes`)
}

if (import.meta.main) build()
