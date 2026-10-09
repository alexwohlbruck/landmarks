/**
 * The four Kaskey statues of Independence Square, Charlotte — procedural, CC0-1.0.
 *
 *   bun generators/independence-square-statues.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres. The origin is the centre of the
 * Trade and Tryon crossing (OSM node 172358289); the model is placed at
 * bearing 48°, so its +y runs up North Tryon Street and its ±x along Trade.
 *
 * Raymond Kaskey's four bronzes (1995) stand one on each corner, all facing
 * into the crossing. Each is a figure of about 2.7× life cut off at the
 * thighs, set on top of a tall square shaft of pinkish granite like a ship's
 * figurehead, with a bronze pendant (a relief portrait or emblem tapering to
 * a point) hanging down the shaft's front face below it. The shaft stands on
 * a wider granite base.
 *
 * Evidence
 * - Positions and heights: lidar (USGS 3DEP NC Phase 4, Mecklenburg 2016,
 *   0.5 m). Each statue shows as a 1.5 m blob standing 7.4 m above the
 *   paving (The Future 7.9 m, the child held up). Blob centres, metres
 *   east/north of the junction node, against the OSM artwork nodes:
 *     Commerce        ( 2.4,  13.9)   node/8415199021 at ( 1.9,  14.4)
 *     The Future      (15.6,  -2.4)   node/8415199020 at (15.3,  -1.6)
 *     Industry        (-0.7, -16.0)   node/8415199022 at ( 0.1, -13.2)
 *     Transportation  (-14.0,  0.1)   node/7986487900 at (-14.6,  0.7)
 *   The model uses the lidar centres; Industry's OSM node is 2.8 m short.
 * - Proportions, from the full-height photos (Stabbur's Master, Flickr, CC
 *   BY-SA 2.0, "Charlotte's Sculptures on the Square", four of them, one per
 *   statue, people for scale), scaled to the lidar height: base 1.2 m square
 *   and 1.15 m tall with a sloped collar; shaft 0.86 m square, its top (where
 *   the bronze begins) 4.85 m up; pendant tips 2.7–3.3 m up; head about
 *   0.62 m tall, shoulders about 1.1 m across.
 * - Poses, from close-ups (nan palmero, Flickr, CC BY 2.0, one per statue):
 *   Commerce, the gold miner in a broad-brimmed hat, holding his pan in front
 *   of him with both hands, coins spilling from it, a portrait of a man in
 *   spectacles on the pendant; Industry, the mill worker, her left hand
 *   shading her eyes, elbow high, her right fist on her hip, in a belted
 *   smock and skirt, a man in a cap on the pendant; Transportation, the
 *   railroad worker in a vest, a sledgehammer gripped upright before his
 *   chest, kneeling forward over a winged wheel; The Future, a woman with
 *   long hair, bare to the waist, holding a child high over her head at full
 *   stretch, a woman's face with flowing hair on the pendant.
 * - Colours from the photos: the granite is a pink-brown grey, pulled up to
 *   the palette's stone lightness; the bronze is a dark brown, lifted to a
 *   warm mid brown so the figures read as bronze at map lighting rather than
 *   as black, with a darker bronze for hats, hair, the pendants and props.
 * - Estimated: depth of the figures, exact limb angles, the pendants' relief.
 */
import { Part, addGltfTriangles, cross, sub, len, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const granite = new Part()
const base = new Part()
const bronze = new Part()
const dark = new Part()
const TAU = Math.PI * 2
const unit = (v: V3): V3 => v.map(n => n / (len(v) || 1)) as V3
const plus = (a: V3, b: V3): V3 => a.map((n, i) => n + b[i]) as V3
const scale = (a: V3, s: number): V3 => a.map(n => n * s) as V3

// ------------------------------------------------------------------ helpers

type XY = [number, number]

/** A rectangle's outline with its corners cut by `b`, and per-corner normals. */
function rim(cx: number, cy: number, hx: number, hy: number, b: number): { pts: XY[]; nrm: XY[] } {
  const pts: XY[] = [
    [cx - hx + b, cy - hy], [cx + hx - b, cy - hy], [cx + hx, cy - hy + b], [cx + hx, cy + hy - b],
    [cx + hx - b, cy + hy], [cx - hx + b, cy + hy], [cx - hx, cy + hy - b], [cx - hx, cy - hy + b],
  ]
  const nrm: XY[] = [[0, -1], [0, -1], [1, 0], [1, 0], [0, 1], [0, 1], [-1, 0], [-1, 0]]
  return { pts, nrm }
}

/** A stone block with chamfered vertical and top edges, smooth-shaded. */
function block(p: Part, z0: number, z1: number, hx: number, hy = hx,
  { cx = 0, cy = 0, b = 0.12, top = [hx, hy] as XY } = {}) {
  const tb = Math.min(b, (z1 - z0) * 0.4)
  const lo = rim(cx, cy, hx, hy, b)
  const hi = rim(cx, cy, top[0], top[1], b)
  const lid = rim(cx, cy, top[0] - tb, top[1] - tb, Math.max(0.03, b - tb * 0.4))
  const tilt = (hx - top[0]) / (z1 - z0)
  const sideN = lo.nrm.map(n => unit([n[0], n[1], tilt]))
  const ring = (r: XY[], z: number): V3[] => r.map(([x, y]) => [x, y, z])
  const band = (a: V3[], na: V3[], c: V3[], nc: V3[]) => {
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      p.tri(a[i], a[j], c[j], undefined, undefined, undefined, [na[i], na[j], nc[j]])
      p.tri(a[i], c[j], c[i], undefined, undefined, undefined, [na[i], nc[j], nc[i]])
    }
  }
  const A = ring(lo.pts, z0), B = ring(hi.pts, z1 - tb)
  band(A, sideN, B, sideN)
  band(B, sideN, ring(lid.pts, z1), lid.pts.map(() => [0, 0, 1] as V3))
  const C = ring(lid.pts, z1)
  for (let i = 1; i < 7; i++) p.tri(C[0], C[i], C[i + 1])
}

/** Smooth each sculpted piece separately, keeping edges at joins and caps. */
function smooth(target: Part, build: (p: Part) => void, crease = 70) {
  const p = new Part()
  build(p)
  addGltfTriangles(target, new Float32Array(p.pos),
    Uint32Array.from({ length: p.pos.length / 3 }, (_, i) => i), { creaseDegrees: crease })
}

/**
 * A horizontal ring. `sq` > 2 squares it off (a superellipse), so the hips
 * can sit flush on the square shaft without its corners poking through.
 */
function oval(c: V3, rx: number, ry: number, n = 12, sq = 2): V3[] {
  const f = (t: number) => Math.sign(t) * Math.abs(t) ** (2 / sq)
  return Array.from({ length: n }, (_, i) => {
    const a = (i + 0.5) / n * TAU
    return [c[0] + rx * f(Math.cos(a)), c[1] + ry * f(Math.sin(a)), c[2]]
  })
}

/** A closed loft of horizontal rings, rows of [z, rx, ry, cx, cy, squareness]. */
function body(p: Part, rows: number[][], n = 12, crease = 70) {
  smooth(p, mesh => {
    const rings = rows.map(([z, rx, ry, cx = 0, cy = 0, sq = 2]) => oval([cx, cy, z], rx, ry, n, sq))
    mesh.loft(rings)
    mesh.cap(rings[0], false)
    mesh.cap(rings[rings.length - 1], true)
  }, crease)
}

function ellipsoid(p: Part, c: V3, r: V3, n = 10, rows = 6) {
  smooth(p, mesh => {
    const rings = Array.from({ length: rows + 1 }, (_, j) => {
      const a = -Math.PI / 2 + j / rows * Math.PI
      const k = j === 0 || j === rows ? 0 : Math.cos(a)
      return oval([c[0], c[1], c[2] + r[2] * Math.sin(a)], r[0] * k, r[1] * k, n)
    })
    mesh.loft(rings)
  }, 80)
}

/**
 * A rounded tapered limb along a path; each ring is square to the path. The
 * ring frame is carried along by parallel transport, so a bent elbow doesn't
 * twist the limb flat.
 */
function tube(p: Part, path: V3[], widths: number[], depths = widths, sides = 8) {
  const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  smooth(p, mesh => {
    let u: V3 | undefined
    const rings = path.map((c, i) => {
      const axis = unit(sub(path[Math.min(i + 1, path.length - 1)], path[Math.max(0, i - 1)]))
      const ref: V3 = u ?? (Math.abs(axis[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1])
      u = unit(sub(ref, scale(axis, dot(ref, axis))))
      const v = cross(axis, u)
      return Array.from({ length: sides }, (_, j) => {
        const a = j / sides * TAU
        return plus(c, plus(scale(u!, widths[i] * Math.cos(a)), scale(v, depths[i] * Math.sin(a))))
      })
    })
    mesh.loft(rings)
    mesh.cap(rings[0], false)
    mesh.cap(rings[rings.length - 1], true)
  })
}

/** A flat disc of radius r, thickness t, centred at c and tilted forward by `tilt` rad. */
function disc(p: Part, c: V3, r: number, t: number, tilt: number, n = 14) {
  const rot = ([x, y, z]: V3): V3 => [c[0] + x, c[1] + y * Math.cos(tilt) - z * Math.sin(tilt), c[2] + y * Math.sin(tilt) + z * Math.cos(tilt)]
  const lo = oval([0, 0, -t / 2], r, r, n).map(rot), hi = oval([0, 0, t / 2], r * 0.92, r * 0.92, n).map(rot)
  smooth(p, mesh => { mesh.loft([lo, hi]); mesh.cap(lo, false); mesh.cap(hi, true) }, 50)
}

// ------------------------------------------------------------- one statue
//
// Each statue is authored in its own frame — the shaft centred on the
// origin, the figure facing +y — then turned to face the crossing. Seen from
// the front, the figure's right hand is at +x.

const SHAFT = 0.43 // half-width of the granite shaft
const SHAFT_TOP = 4.85
type Kit = { granite: Part; base: Part; bronze: Part; dark: Part }

function pedestal(k: Kit) {
  // The base, then a sloped collar up to the shaft.
  block(k.base, 0, 0.95, 0.6, 0.6, { b: 0.1 })
  block(k.base, 0.95, 1.15, 0.6, 0.6, { b: 0.08, top: [SHAFT + 0.02, SHAFT + 0.02] })
  block(k.granite, 1.15, SHAFT_TOP, SHAFT, SHAFT, { b: 0.06 })
}

/**
 * The bronze shared by all four: hips set square on the shaft top, a waist,
 * chest and shoulders, a neck. `skirt` flares the hips for the women's
 * skirts; `lean` pushes the chest forward.
 */
function torso(k: Kit, { broad = 0.56, lean = 0.08, skirt = 0, chest = 0.3 } = {}) {
  const w = SHAFT + 0.03
  body(k.bronze, [
    [SHAFT_TOP - 0.04, w + skirt, w + skirt * 0.6, 0, 0, 5],
    [SHAFT_TOP + 0.35, w + skirt * 0.8, w + skirt * 0.4, 0, 0.04, 3.5],
    [5.3, 0.44, 0.3, 0, lean * 0.6, 2.4],
    [5.6, 0.42, 0.28, 0, lean * 0.8],
    [6.05, broad * 0.92, chest, 0, lean],
    [6.38, broad, chest * 0.95, 0, lean * 0.9],
    [6.55, broad * 0.78, chest * 0.8, 0, lean * 0.8],
    [6.66, 0.2, 0.18, 0, lean * 0.8],
  ], 12)
  tube(k.bronze, [[0, lean * 0.8, 6.6], [0, lean * 0.8 + 0.02, 6.84]], [0.15, 0.14], [0.15, 0.14], 8)
}

/** Head on the neck; returns its centre. `tilt` lifts the face (looking up). */
function head(k: Kit, at: V3, r: V3 = [0.24, 0.27, 0.31]): V3 {
  ellipsoid(k.bronze, at, r, 10, 6)
  return at
}

/** An arm: shoulder → elbow → hand, with a rounded elbow and a fist. */
function arm(k: Kit, [s, e, w]: V3[], [a, b, c] = [0.15, 0.13, 0.11]) {
  tube(k.bronze, [s, e], [a, b], [a, b], 8)
  ellipsoid(k.bronze, e, [b, b, b], 8, 4)
  tube(k.bronze, [e, w], [b, c], [b, c], 8)
  ellipsoid(k.bronze, w, [c + 0.03, c + 0.03, c + 0.04], 8, 4)
}

/**
 * The pendant down the shaft's front face: a relief medallion at the top
 * (a head, or the winged wheel), tapering to a point at `tip`.
 */
function pendant(k: Kit, tip: number, top = SHAFT_TOP - 0.05, wide = 0.36) {
  const y = SHAFT
  body(k.dark, [
    [tip, 0.02, 0.02, 0, y + 0.03],
    [tip + (top - tip) * 0.35, wide * 0.45, 0.07, 0, y + 0.06],
    [tip + (top - tip) * 0.75, wide * 0.8, 0.1, 0, y + 0.08],
    [top, wide, 0.12, 0, y + 0.09],
  ], 8)
}
/** A relief face on the pendant's top, with a cap or hair. */
function medallion(k: Kit, z: number, hat: 'cap' | 'hair' | 'bare') {
  const y = SHAFT + 0.14
  ellipsoid(k.bronze, [0, y, z], [0.23, 0.13, 0.3], 8, 5)
  if (hat === 'cap') ellipsoid(k.dark, [0, y + 0.02, z + 0.24], [0.26, 0.14, 0.11], 8, 3)
  if (hat === 'hair') {
    ellipsoid(k.dark, [-0.22, y - 0.02, z - 0.15], [0.12, 0.08, 0.38], 6, 4)
    ellipsoid(k.dark, [0.22, y - 0.02, z - 0.15], [0.12, 0.08, 0.38], 6, 4)
  }
}

const statues: { name: string; at: XY; build: (k: Kit) => void }[] = [
  {
    // Commerce: the gold miner in a broad-brimmed hat, holding his pan out
    // in front of him, coins spilling from it.
    name: 'Commerce', at: [2.4, 13.9],
    build: k => {
      const L = 0.1
      torso(k, { lean: L, broad: 0.58 })
      const h = head(k, [0, L + 0.03, 7.05])
      // The hat: a wide brim and a round crown.
      disc(k.dark, [h[0], h[1], h[2] + 0.2], 0.5, 0.06, 0.12)
      ellipsoid(k.dark, [h[0], h[1] - 0.02, h[2] + 0.3], [0.26, 0.28, 0.18], 10, 4)
      // The beard.
      ellipsoid(k.dark, [0, h[1] + 0.2, h[2] - 0.2], [0.14, 0.09, 0.16], 6, 4)
      // Arms bent, hands on the pan's rim at either side.
      for (const s of [-1, 1]) arm(k, [[s * 0.52, L, 6.4], [s * 0.66, L + 0.25, 5.75], [s * 0.46, L + 0.62, 5.72]])
      disc(k.dark, [0, L + 0.66, 5.72], 0.48, 0.12, -0.45, 14)
      // Coins pouring over the pan's front lip down his lap.
      ellipsoid(k.dark, [0, L + 0.68, 5.25], [0.17, 0.13, 0.32], 6, 4)
      pendant(k, 3.3)
      medallion(k, 4.42, 'bare')
    },
  },
  {
    // The Future: a woman holding a child high over her head, her hair down
    // her back, drapery from the waist.
    name: 'The Future', at: [15.6, -2.4],
    build: k => {
      const L = 0.06
      torso(k, { lean: L, broad: 0.5, skirt: 0.08, chest: 0.28 })
      // Head tipped back, looking up at the child.
      const h = head(k, [0, L - 0.02, 7.02], [0.22, 0.26, 0.29])
      ellipsoid(k.dark, [0, h[1] - 0.16, h[2] - 0.2], [0.24, 0.16, 0.42], 8, 5)
      // Both arms raised at full stretch.
      for (const s of [-1, 1]) arm(k, [[s * 0.46, L, 6.42], [s * 0.6, L + 0.12, 7.05], [s * 0.3, L + 0.2, 7.55]], [0.14, 0.12, 0.1])
      // The child, held flat overhead, head to one side, legs kicking.
      ellipsoid(k.bronze, [0, L + 0.2, 7.72], [0.42, 0.2, 0.2], 10, 5)
      ellipsoid(k.bronze, [0.52, L + 0.24, 7.8], [0.18, 0.18, 0.19], 8, 4)
      for (const d of [-0.06, 0.08]) tube(k.bronze, [[-0.32, L + 0.2 + d, 7.76], [-0.58, L + 0.2 + d, 7.98], [-0.76, L + 0.2 + d, 7.84]], [0.09, 0.08, 0.07], [0.09, 0.08, 0.07], 6)
      // Her drapery falls over the shaft's top and down its front.
      body(k.bronze, [
        [4.25, 0.2, 0.08, 0, SHAFT + 0.06],
        [4.55, 0.42, 0.12, 0, SHAFT + 0.08],
        [SHAFT_TOP + 0.05, 0.5, 0.16, 0, SHAFT + 0.06],
      ], 10)
      pendant(k, 2.7, 4.3)
      medallion(k, 3.92, 'hair')
    },
  },
  {
    // Industry: the mill worker, shading her eyes with her left hand, her
    // right fist on her hip, in a belted smock over a skirt.
    name: 'Industry', at: [-0.7, -16.0],
    build: k => {
      const L = 0.06
      torso(k, { lean: L, broad: 0.55, skirt: 0.1, chest: 0.3 })
      // The belt at the waist.
      body(k.dark, [[5.52, 0.45, 0.31, 0, L * 0.8], [5.64, 0.45, 0.31, 0, L * 0.8]], 12)
      const h = head(k, [0, L + 0.03, 7.02])
      // Hair gathered at the back of the head.
      ellipsoid(k.dark, [0, h[1] - 0.12, h[2] + 0.04], [0.25, 0.2, 0.28], 8, 5)
      // Left arm up, elbow out high, hand flat over the brow.
      arm(k, [[-0.5, L, 6.42], [-0.86, L + 0.1, 7.18], [-0.1, L + 0.36, 7.12]], [0.15, 0.13, 0.11])
      // Right arm akimbo, fist on the hip.
      arm(k, [[0.5, L, 6.42], [0.86, L - 0.08, 5.85], [0.44, L + 0.04, 5.42]], [0.15, 0.13, 0.11])
      pendant(k, 3.2)
      medallion(k, 4.4, 'cap')
    },
  },
  {
    // Transportation: the railroad worker in a vest, a sledgehammer gripped
    // upright before his chest, kneeling forward over a winged wheel.
    name: 'Transportation', at: [-14.0, 0.1],
    build: k => {
      const L = 0.1
      torso(k, { lean: L, broad: 0.68, chest: 0.34 })
      head(k, [0, L + 0.03, 7.05])
      // Kneeling forward like a figurehead: thighs out over the shaft's
      // front, knees well forward, shins folding back down onto its face.
      for (const s of [-1, 1]) {
        tube(k.bronze, [[s * 0.2, 0.0, 5.25], [s * 0.19, 0.62, 4.72]], [0.25, 0.22], [0.25, 0.22], 8)
        ellipsoid(k.bronze, [s * 0.19, 0.64, 4.68], [0.21, 0.21, 0.21], 8, 4)
        tube(k.bronze, [[s * 0.19, 0.64, 4.66], [s * 0.16, SHAFT + 0.18, 4.05]], [0.2, 0.16], [0.2, 0.16], 8)
      }
      // Both forearms in, fists one above the other on the hammer's handle.
      arm(k, [[0.62, L, 6.38], [0.84, L + 0.28, 5.8], [0.05, L + 0.52, 5.92]], [0.19, 0.16, 0.13])
      arm(k, [[-0.62, L, 6.38], [-0.86, L + 0.28, 5.92], [-0.05, L + 0.54, 6.14]], [0.19, 0.16, 0.13])
      // The hammer: handle upright, head across at the shoulders.
      tube(k.dark, [[0, L + 0.58, 5.3], [0, L + 0.58, 6.45]], [0.05, 0.05], [0.05, 0.05], 6)
      tube(k.dark, [[-0.3, L + 0.58, 6.5], [0.3, L + 0.58, 6.5]], [0.1, 0.1], [0.1, 0.1], 6)
      // The winged wheel under his knees, the pendant below it.
      disc(k.dark, [0, SHAFT + 0.28, 3.85], 0.28, 0.14, Math.PI / 2, 12)
      // The wings: a broad swept fan either side of the wheel, up to the knees.
      for (const s of [-1, 1]) {
        smooth(k.dark, mesh => {
          const root: V3 = [s * 0.18, SHAFT + 0.22, 3.85]
          const fan: V3[] = [[s * 0.4, SHAFT + 0.12, 3.6], [s * 0.6, SHAFT + 0.1, 4.0], [s * 0.6, SHAFT + 0.12, 4.45], [s * 0.36, SHAFT + 0.16, 4.5]]
          for (let i = 0; i < fan.length - 1; i++) {
            if (s > 0) mesh.tri(root, fan[i + 1], fan[i])
            else mesh.tri(root, fan[i], fan[i + 1])
            // the back face, against the shaft
            const a = [fan[i][0], SHAFT + 0.02, fan[i][2]] as V3, c = [fan[i + 1][0], SHAFT + 0.02, fan[i + 1][2]] as V3
            mesh.quad(...(s > 0 ? [fan[i + 1], c, a, fan[i]] : [fan[i], a, c, fan[i + 1]]) as [V3, V3, V3, V3])
          }
        }, 10)
      }
      pendant(k, 2.8, 3.7, 0.3)
    },
  },
]

// --------------------------------------------------------------- placement

const BEARING = 48 // degrees: model +y up North Tryon Street (OSM 50.3°), ±x along Trade (136.4°)

/** Copy `src` into `dst`, turned by `a` (map radians, counter-clockwise) and moved to (x, y). */
function place(src: Part, dst: Part, a: number, x: number, y: number) {
  const c = Math.cos(a), s = Math.sin(a)
  // Parts store glTF: X = map x, Y = up, Z = −map y.
  for (let i = 0; i < src.pos.length; i += 3) {
    const X = src.pos[i], Y = src.pos[i + 1], Z = src.pos[i + 2]
    dst.pos.push(X * c + Z * s + x, Y, -X * s + Z * c - y)
    const nX = src.nrm[i], nY = src.nrm[i + 1], nZ = src.nrm[i + 2]
    dst.nrm.push(nX * c + nZ * s, nY, -nX * s + nZ * c)
  }
  dst.uv.push(...src.uv)
}

const b = BEARING * Math.PI / 180
// True east/north → model frame (turn by −bearing about up).
const toModel = ([e, n]: XY): XY => [e * Math.cos(b) - n * Math.sin(b), e * Math.sin(b) + n * Math.cos(b)]
// They face the middle of the four, which is about a metre off the node.
const mid = statues.map(s => toModel(s.at)).reduce((m, p) => [m[0] + p[0] / 4, m[1] + p[1] / 4], [0, 0] as XY)
// ONLY=<name> builds one statue alone, for close-up review renders.
for (const st of statues.filter(s => !process.env.ONLY || s.name === process.env.ONLY)) {
  const [x, y] = toModel(st.at)
  const k: Kit = { granite: new Part(), base: new Part(), bronze: new Part(), dark: new Part() }
  pedestal(k)
  st.build(k)
  // Local +y → towards the middle.
  const a = Math.atan2(x - mid[0], -(y - mid[1]))
  place(k.granite, granite, a, x, y)
  place(k.base, base, a, x, y)
  place(k.bronze, bronze, a, x, y)
  place(k.dark, dark, a, x, y)
}

const parts = [
  { part: granite, material: finish('kaskey-granite', 0xdccbc2) },
  { part: base, material: finish('kaskey-granite-base', 0xcdbbb2) },
  { part: bronze, material: finish('kaskey-bronze', 0x725d4b) },
  // Darker bronze: hats, hair, the pan, the hammer, the pendants.
  { part: dark, material: finish('kaskey-bronze-dark', 0x5c4b3f) },
]
const glb = writeGlb('Independence Square statues', parts, {
  license: 'CC0-1.0',
  frame: 'Y up, -Z north, +X east, metres; origin at the centre of the Trade and Tryon crossing',
  bearing: BEARING, statues: statues.map(s => s.name),
})
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500 || glb.length > 250_000) throw new Error(`Landmark exceeds budget: ${triangles} triangles, ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/independence-square-statues.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
