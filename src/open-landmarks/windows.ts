/**
 * Open Landmarks' window attachment contract, applied rather than audited.
 *
 * Their `window` triangles must be vertical and lie wholly on parallel wall
 * triangles of a supporting material within 6 cm. Ours often don't: a band
 * of glazing runs past the wall it sits on, or a curtain wall is all window
 * with nothing behind it. Their own exporter clips panels to the walls; this
 * does the same, and keeps whatever falls off the wall as `glazing`, an
 * opaque finish in the same colour, so the facade looks the same and only
 * the part sitting on a wall glows at night.
 *
 * Without `split`, a panel only partly on a wall becomes glazing whole, which
 * adds no triangles: for a low LOD that has to stay inside its budget.
 */
import { cross, dot, sub, unit, type Triangle, type V3 } from './mesh'

type P2 = [number, number]

/** Their tolerance is 0.06 m; stay inside it so float32 rounding can't push a panel out. */
const PLANE_TOLERANCE_M = 0.05
/** Our panels stand a few cm proud of their walls, some right at their limit. Set them 2 cm off. */
const SNAP_M = 0.25
const STANDOFF_M = 0.02
const VERTICAL = 0.01

const signedArea = (p: P2[]) => p.reduce((s, a, i) => {
  const b = p[(i + 1) % p.length]
  return s + a[0] * b[1] - a[1] * b[0]
}, 0) / 2

/** Split `polygon` by the triangle into the part inside it and the convex parts outside. */
function split(polygon: P2[], triangle: P2[]): { inside: P2[] | null; outside: P2[][] } {
  if (signedArea(triangle) < 0) triangle = [...triangle].reverse()
  let inside = polygon
  const outside: P2[][] = []
  for (let i = 0; i < 3 && inside.length; i++) {
    const a = triangle[i], b = triangle[(i + 1) % 3]
    const side = (p: P2) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])
    const yes: P2[] = [], no: P2[] = []
    for (let j = 0; j < inside.length; j++) {
      const p = inside[j], q = inside[(j + 1) % inside.length], sp = side(p), sq = side(q)
      ;(sp >= 0 ? yes : no).push(p)
      if ((sp >= 0) !== (sq >= 0)) {
        const t = sp / (sp - sq)
        const hit: P2 = [p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]
        yes.push(hit)
        no.push(hit)
      }
    }
    if (no.length >= 3 && Math.abs(signedArea(no)) > 1e-10) outside.push(no)
    inside = yes
  }
  return { inside: inside.length >= 3 && Math.abs(signedArea(inside)) > 1e-10 ? inside : null, outside }
}

/** Below a square centimetre, a clipped piece's float32 normal is too noisy to read as vertical. */
const sliver = (p: V3[]) => Math.hypot(...cross(sub(p[1], p[0]), sub(p[2], p[0]))) / 2 < 1e-4

const normalOf = (t: Triangle) => unit(cross(sub(t.p[1], t.p[0]), sub(t.p[2], t.p[0])))

/**
 * Clip every `window` triangle to its supporting walls. Returns the new
 * triangle list, where window area off any wall has become `glazing`.
 */
export function attachWindows(
  triangles: Triangle[],
  { window, glazing, supports, split: splitPanels = true }: { window: number; glazing: number; supports: Set<number>; split?: boolean },
): { triangles: Triangle[]; attached: number; detached: number } {
  const walls = triangles
    .filter((t) => supports.has(t.material))
    .map((t) => ({ t, n: normalOf(t) }))
    .filter((w) => Math.abs(w.n[1]) < VERTICAL)
  const out: Triangle[] = []
  let attachedArea = 0, detachedArea = 0

  for (let t of triangles) {
    if (t.material !== window) {
      out.push(t)
      continue
    }
    const n = normalOf(t)
    const area = Math.hypot(...cross(sub(t.p[1], t.p[0]), sub(t.p[2], t.p[0]))) / 2
    if (Math.abs(n[1]) >= VERTICAL) {
      out.push({ ...t, material: glazing })
      detachedArea += area
      continue
    }
    const tangent: V3 = [n[2], 0, -n[0]]
    const project0 = (p: V3): P2 => [dot(sub(p, t.p[0]), tangent), p[1] - t.p[0][1]]
    // The nearest wall plane behind the panel that it overlaps.
    let shift = Infinity
    for (const wall of walls) {
      if (dot(n, wall.n) < 0.9999) continue
      const ds = t.p.map((p) => dot(sub(p, wall.t.p[0]), wall.n))
      if (ds.some((d) => d < -0.01 || d > SNAP_M)) continue
      const d = (ds[0] + ds[1] + ds[2]) / 3
      if (d - STANDOFF_M >= shift || !split([...t.p].map(project0), wall.t.p.map(project0)).inside) continue
      shift = d - STANDOFF_M
    }
    if (shift !== Infinity && shift > 0) t = { ...t, p: t.p.map((p) => sub(p, n.map((c) => c * shift) as V3)) as [V3, V3, V3] }
    const origin = t.p[0]
    const project = (p: V3): P2 => [dot(sub(p, origin), tangent), p[1] - origin[1]]
    // Back into the window's plane: along the tangent, and up within the plane.
    const tt = dot(tangent, tangent)
    const upInPlane = cross(n, tangent)
    const up: V3 = upInPlane.map((v) => v / upInPlane[1]) as V3
    const lift = ([u, v]: P2): V3 => [0, 1, 2].map((k) => origin[k] + (u / tt) * tangent[k] + v * up[k]) as V3

    let remaining: P2[][] = [t.p.map(project)]
    const covered: P2[][] = []
    for (const wall of walls) {
      if (Math.abs(dot(n, wall.n)) < 0.9999) continue
      if (t.p.some((p) => Math.abs(dot(sub(p, wall.t.p[0]), wall.n)) > PLANE_TOLERANCE_M)) continue
      const tri = wall.t.p.map(project)
      remaining = remaining.flatMap((poly) => {
        const { inside, outside } = split(poly, tri)
        if (inside) covered.push(inside)
        return outside
      })
      if (!remaining.length) break
    }

    const facing = (poly: P2[]) => {
      const pts = poly.map(lift)
      const out: [V3, V3, V3][] = []
      for (let i = 1; i < pts.length - 1; i++) {
        const tri: [V3, V3, V3] = [pts[0], pts[i], pts[i + 1]]
        out.push(dot(cross(sub(tri[1], tri[0]), sub(tri[2], tri[0])), n) < 0 ? [tri[0], tri[2], tri[1]] : tri)
      }
      return out
    }
    const uncovered = remaining.reduce((s, poly) => s + Math.abs(signedArea(poly)), 0)
    if (uncovered <= area * 1e-6) {
      out.push(t)
      attachedArea += area
      continue
    }
    for (const poly of covered) {
      attachedArea += Math.abs(signedArea(poly))
      // A sliver has no reliable direction, so it can't pass as a vertical panel.
      for (const p of facing(poly)) out.push({ material: sliver(p) ? glazing : window, p, n: [n, n, n] })
    }
    if (!covered.length || !splitPanels) {
      out.push({ ...t, material: glazing })
      detachedArea += area
      continue
    }
    for (const poly of remaining) {
      detachedArea += Math.abs(signedArea(poly))
      for (const p of facing(poly)) out.push({ material: glazing, p, n: [n, n, n] })
    }
  }
  return { triangles: out, attached: attachedArea, detached: detachedArea }
}

/**
 * Their audit, on the final float32 triangles: any window still not wholly on
 * a wall (a strip a millimetre wide can round off one) becomes glazing.
 */
export function demoteUnsupported(triangles: Triangle[], { window, glazing, supports }: { window: number; glazing: number; supports: Set<number> }): number {
  const walls = triangles.filter((t) => supports.has(t.material)).map((t) => ({ t, n: normalOf(t) })).filter((w) => Math.abs(w.n[1]) < VERTICAL)
  let demoted = 0
  for (const t of triangles) {
    if (t.material !== window) continue
    const n = normalOf(t)
    const tangent: V3 = [n[2], 0, -n[0]]
    const project = (p: V3): P2 => [dot(sub(p, t.p[0]), tangent), p[1] - t.p[0][1]]
    let remaining: P2[][] = [t.p.map(project)]
    const area = Math.abs(signedArea(remaining[0]))
    for (const wall of walls) {
      if (Math.abs(dot(n, wall.n)) < 0.9999 || t.p.some((p) => Math.abs(dot(sub(p, wall.t.p[0]), wall.n)) > PLANE_TOLERANCE_M)) continue
      remaining = remaining.flatMap((poly) => split(poly, wall.t.p.map(project)).outside)
      if (!remaining.length) break
    }
    const uncovered = remaining.reduce((s, poly) => s + Math.abs(signedArea(poly)), 0)
    if (Math.abs(n[1]) >= VERTICAL || uncovered > Math.max(1e-6, area * 1e-6)) {
      t.material = glazing
      demoted++
    }
  }
  return demoted
}
