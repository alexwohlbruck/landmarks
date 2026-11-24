/**
 * Plan helper for the Luna Park coasters (nyc-circus-coaster, nyc-steeplechase,
 * nyc-tickler): OSM maps these rides only as an area outline, with no
 * `roller_coaster=track` ways, so each circuit is drawn here as a turtle path
 * of straights and circular arcs traced over the USGS lidar (NY_NewYorkCity,
 * 2017), in metres east (x) and north (y) of the ride's anchor. Not a model:
 * nothing is written when it runs.
 */

/** A straight of length L (m), or a left/right turn of radius r (m) through deg degrees. */
export type Seg = ['S', number] | ['L' | 'R', number, number]

/**
 * The circuit from `start`, heading `heading` (compass degrees: 0 north, 90
 * east), through `segs`. Arcs are sampled every `step` m; `marks[i]` is the
 * distance along the path at the end of segment i, for placing the profile.
 * The last point is dropped when it closes on the first, since the kit closes
 * the circuit itself.
 */
export function turtle(start: [number, number], heading: number, segs: Seg[], step = 1.5) {
  let [x, y] = start
  let h = (heading * Math.PI) / 180
  const pts: [number, number][] = [[x, y]]
  const marks: number[] = []
  let s = 0
  for (const seg of segs) {
    if (seg[0] === 'S') {
      const L = seg[1]
      const n = Math.max(1, Math.round(L / 4))
      for (let k = 1; k <= n; k++) pts.push([x + Math.sin(h) * (L * k) / n, y + Math.cos(h) * (L * k) / n])
      x += Math.sin(h) * L; y += Math.cos(h) * L; s += L
    } else {
      const [dir, r, deg] = seg
      const sg = dir === 'L' ? -1 : 1 // compass: a right turn adds to the heading
      // Centre of the turn, to the left or right of the heading.
      const cx = x + Math.sin(h + (sg * Math.PI) / 2) * r, cy = y + Math.cos(h + (sg * Math.PI) / 2) * r
      const a0 = Math.atan2(x - cx, y - cy) // compass angle of the turtle seen from the centre
      const sweep = (deg * Math.PI) / 180
      const n = Math.max(2, Math.ceil((r * sweep) / step))
      for (let k = 1; k <= n; k++) {
        const a = a0 + (sg * sweep * k) / n
        pts.push([cx + Math.sin(a) * r, cy + Math.cos(a) * r])
      }
      const a = a0 + sg * sweep
      x = cx + Math.sin(a) * r; y = cy + Math.cos(a) * r; h += sg * sweep; s += r * sweep
    }
    marks.push(s)
  }
  const [fx, fy] = pts[0], [lx, ly] = pts[pts.length - 1]
  if (Math.hypot(lx - fx, ly - fy) < 0.5) pts.pop()
  const round = pts.map(([px, py]) => [Math.round(px * 100) / 100, Math.round(py * 100) / 100] as [number, number])
  return { pts: round, marks, end: [x, y] as [number, number], heading: ((((h * 180) / Math.PI) % 360) + 360) % 360 }
}

/** With PLAN=1, print the segment marks and closure, and with PLAN_DUMP=<file> write the plan for overlaying on the lidar. */
export async function reportPlan(name: string, plan: ReturnType<typeof turtle>, segs: Seg[]) {
  if (process.env.PLAN) {
    console.log(`${name}: ${plan.marks[plan.marks.length - 1].toFixed(1)} m drawn; ends at ${plan.end.map((v) => v.toFixed(2))} heading ${plan.heading.toFixed(1)}`)
    segs.forEach((sg, i) => console.log(`  ${String(i).padStart(2)} ${JSON.stringify(sg).padEnd(16)} s ${(i ? plan.marks[i - 1] : 0).toFixed(1)}-${plan.marks[i].toFixed(1)}`))
  }
  if (process.env.PLAN_DUMP) await Bun.write(process.env.PLAN_DUMP, JSON.stringify([[...plan.pts, plan.pts[0]]]))
}
