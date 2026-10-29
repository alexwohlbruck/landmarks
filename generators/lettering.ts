/**
 * Lettering for famous signs, drawn as the real letters' strokes.
 *
 * A sign that is itself the landmark (STYLE.md, "Towers, rides, sculpture
 * and signs") carries its lettering as geometry. Trace each letter's
 * centre-lines from a licensed photo of the sign, with real curves, and
 * give the stroke the real letter's weight: a script "Pepsi-Cola" is a few
 * flowing strokes, a sans-serif "STATEN ISLAND FERRY" is straight strokes
 * and round bowls. Never a pixel or 5 × 7 grid font.
 *
 *   const pen = new Pen()
 *   pen.moveTo([0, 0]).lineTo([0, 1])                    // an I
 *   pen.moveTo([0.6, 0.5]).circle([0.6, 0.5], 0.5)       // an O
 *   strokes(red, pen.paths, { width: 0.16, depth: 0.3, place })
 *
 * Letter units are free (a cap height of 1 is handy). `place(u, v, w)`
 * maps them onto the sign: u to the reader's right, v up, w out of the
 * sign face toward the reader, in model metres. Bend `place` to set the
 * letters along a curved canopy or a cylinder.
 *
 * A stroke costs about six triangles per segment; keep curves to 4–8
 * segments and a whole sign to a couple of thousand triangles.
 */
import { Part, type V3, sub, cross } from './mesh'

export type Pt = [number, number]

/** Builds centre-line paths with straight and curved segments. */
export class Pen {
  paths: Pt[][] = []
  private cur: Pt[] | null = null

  moveTo(p: Pt) {
    this.cur = [p]
    this.paths.push(this.cur)
    return this
  }

  lineTo(p: Pt) {
    this.need().push(p)
    return this
  }

  /** Quadratic Bézier from the current point through control c to p. */
  quadTo(c: Pt, p: Pt, n = 6) {
    const path = this.need(), a = path[path.length - 1]
    for (let i = 1; i <= n; i++) {
      const t = i / n, s = 1 - t
      path.push([s * s * a[0] + 2 * s * t * c[0] + t * t * p[0], s * s * a[1] + 2 * s * t * c[1] + t * t * p[1]])
    }
    return this
  }

  /** Cubic Bézier from the current point through controls c1, c2 to p. */
  cubicTo(c1: Pt, c2: Pt, p: Pt, n = 8) {
    const path = this.need(), a = path[path.length - 1]
    for (let i = 1; i <= n; i++) {
      const t = i / n, s = 1 - t
      const k0 = s * s * s, k1 = 3 * s * s * t, k2 = 3 * s * t * t, k3 = t * t * t
      path.push([k0 * a[0] + k1 * c1[0] + k2 * c2[0] + k3 * p[0], k0 * a[1] + k1 * c1[1] + k2 * c2[1] + k3 * p[1]])
    }
    return this
  }

  /** Circular arc about c from the current point, turning `sweep` radians (positive = counter-clockwise). */
  arc(c: Pt, sweep: number, n = 8) {
    const path = this.need(), a = path[path.length - 1]
    const r = Math.hypot(a[0] - c[0], a[1] - c[1]), a0 = Math.atan2(a[1] - c[1], a[0] - c[0])
    for (let i = 1; i <= n; i++) {
      const t = a0 + sweep * i / n
      path.push([c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)])
    }
    return this
  }

  /** A closed circle (or ellipse with ry) of radius r about c, as its own path. */
  circle(c: Pt, r: number, ry = r, n = 16) {
    const path: Pt[] = []
    for (let i = 0; i <= n; i++) {
      const t = 2 * Math.PI * i / n
      path.push([c[0] + r * Math.cos(t), c[1] + ry * Math.sin(t)])
    }
    this.paths.push(path)
    this.cur = path
    return this
  }

  /** Shift every path, e.g. to lay letters out along a word. */
  translate(du: number, dv = 0) {
    for (const p of this.paths) for (const q of p) { q[0] += du; q[1] += dv }
    return this
  }

  /** Add another pen's paths, shifted. */
  add(other: Pen, du = 0, dv = 0) {
    for (const p of other.paths) this.paths.push(p.map(([u, v]) => [u + du, v + dv] as Pt))
    return this
  }

  private need() {
    if (!this.cur) throw new Error('Pen: moveTo first')
    return this.cur
  }
}

export type StrokeOptions = {
  /** Stroke width in letter units. */
  width: number
  /** How far the letters stand out of the sign face, in w units. */
  depth: number
  /** Letter units (u right, v up, w toward the reader) → model metres. */
  place: (u: number, v: number, w: number) => V3
  /** Also close the back (for letters standing free, with no panel behind). */
  back?: boolean
}

/** Extrude centre-line paths into solid strokes of even width. */
export function strokes(part: Part, paths: Pt[][], o: StrokeOptions) {
  const h = o.width / 2
  for (const raw of paths) {
    const pts = dedupe(raw)
    if (pts.length < 2) continue
    const closed = pts.length > 2 && Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]) < 1e-6
    const ring = closed ? pts.slice(0, -1) : pts
    const n = ring.length
    // Offset each point along its mitred normal, the mitre capped at 2×.
    const L: Pt[] = [], R: Pt[] = [], N: Pt[] = []
    for (let i = 0; i < n; i++) {
      const prev = closed ? ring[(i + n - 1) % n] : ring[Math.max(0, i - 1)]
      const next = closed ? ring[(i + 1) % n] : ring[Math.min(n - 1, i + 1)]
      const d0 = unit2(i === 0 && !closed ? sub2(next, ring[i]) : sub2(ring[i], prev))
      const d1 = unit2(i === n - 1 && !closed ? sub2(ring[i], prev) : sub2(next, ring[i]))
      const t = unit2([d0[0] + d1[0], d0[1] + d1[1]])
      const nl: Pt = [-t[1], t[0]]
      const k = Math.min(2, 1 / Math.max(0.5, nl[0] * -d0[1] + nl[1] * d0[0]))
      const p = ring[i]
      L.push([p[0] + nl[0] * h * k, p[1] + nl[1] * h * k])
      R.push([p[0] - nl[0] * h * k, p[1] - nl[1] * h * k])
      N.push(nl)
    }
    const P = (q: Pt, w: number) => o.place(q[0], q[1], w)
    const out = (dir: Pt, w = 0) => sub(o.place(dir[0], dir[1], w), o.place(0, 0, 0))
    const front = out([0, 0], 1), segs = closed ? n : n - 1
    for (let i = 0; i < segs; i++) {
      const j = (i + 1) % n
      quadFacing(part, P(R[i], o.depth), P(R[j], o.depth), P(L[j], o.depth), P(L[i], o.depth), front)
      if (o.back) quadFacing(part, P(R[i], 0), P(R[j], 0), P(L[j], 0), P(L[i], 0), [-front[0], -front[1], -front[2]])
      const nl: Pt = [(N[i][0] + N[j][0]) / 2, (N[i][1] + N[j][1]) / 2]
      quadFacing(part, P(L[i], 0), P(L[j], 0), P(L[j], o.depth), P(L[i], o.depth), out(nl))
      quadFacing(part, P(R[i], 0), P(R[j], 0), P(R[j], o.depth), P(R[i], o.depth), out([-nl[0], -nl[1]]))
    }
    if (!closed) {
      const d0 = unit2(sub2(ring[0], ring[1])), d1 = unit2(sub2(ring[n - 1], ring[n - 2]))
      quadFacing(part, P(L[0], 0), P(R[0], 0), P(R[0], o.depth), P(L[0], o.depth), out(d0))
      quadFacing(part, P(L[n - 1], 0), P(R[n - 1], 0), P(R[n - 1], o.depth), P(L[n - 1], o.depth), out(d1))
    }
  }
}

/** A quad wound so its face points along `want`. */
function quadFacing(part: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) part.quad(a, b, c, d)
  else part.quad(d, c, b, a)
}

const sub2 = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]]
function unit2(v: Pt): Pt {
  const l = Math.hypot(v[0], v[1]) || 1
  return [v[0] / l, v[1] / l]
}
function dedupe(p: Pt[]) {
  return p.filter((q, i) => i === 0 || Math.hypot(q[0] - p[i - 1][0], q[1] - p[i - 1][1]) > 1e-6)
}
