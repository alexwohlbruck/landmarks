/**
 * San Francisco–Oakland Bay Bridge, West Bay Crossing: the inner towers W3
 * and W5, beside the centre anchorage — procedural, CC0-1.0.
 * bun generators/sf-bay-bridge-west-inner.ts
 *
 * The same tower as `sf-bay-bridge-west` (W2, W6), built by its generator:
 * 13.6 m taller (cap plates at 498.2 ft against 453.5 ft above MLLW, HAER
 * drawing 382; lidar hood tops 156.9 m against 143.4 m), the extra length
 * all below the deck, which crosses these towers 13.5 m higher, and the legs'
 * foot flaring wider along the bridge (31 ft 7 in over 172 ft). Sources,
 * estimates and doubts are in that file's header.
 */
import { writeWestTower } from './sf-bay-bridge-west'

await writeWestTower('sf-bay-bridge-west-inner', true)
