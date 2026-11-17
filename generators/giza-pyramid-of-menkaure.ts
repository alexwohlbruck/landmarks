/**
 * Pyramid of Menkaure, Giza: procedural, CC0-1.0.
 * bun generators/giza-pyramid-of-menkaure.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * centre of OSM's outline; y = 0 is the pyramid's base. tools/terrain.ts
 * could not check the site (Mapterhorn has no z15 tiles here); elevation is 0.
 *
 * Built c. 2510 BC for Menkaure: the smallest of the three great pyramids.
 * Its lowest courses were cased in red granite, part of which remains, and
 * its north face carries a deep vertical breach cut in 1196.
 *
 * Published (Wikipedia, "Pyramid of Menkaure"): base 102.2 x 104.6 m; height
 * 65.5 m as built, 61 m now; slope 51.2 degrees; granite casing on the lowest
 * sixteen courses.
 * OSM: way/4420398 (height 66, a notched outline ~98 x 95 m; the published
 * base is used, centred on it). Replaced.
 * From photos: the breach's width and height on the north face (estimated
 * from "Pyramid of Menkaure in Giza May 2015.JPG", MusikAnimal, CC BY-SA 4.0);
 * the granite band drawn to 7 m all round (the real casing survives
 * patchily, mostly on the north and east).
 * Built with the kit in giza-great-pyramid.ts (see its header); courses of
 * 1.25 m here, as the pyramid is smaller.
 *
 * Photos (Wikimedia Commons):
 * - "Pyramid of Menkaure in Giza May 2015.JPG", MusikAnimal, CC BY-SA 4.0
 * - "All Gizah Pyramids.jpg", Ricardo Liberato, CC BY-SA 2.0
 */
import { writePyramid } from './giza-great-pyramid'

await writePyramid({
  name: 'Pyramid of Menkaure', file: 'giza-pyramid-of-menkaure.glb',
  base: [102.2, 104.6], apex: 65.5, height: 61, core: 0xd1b089, course: 1.25,
  graniteTo: 7.5, breach: [-5, 5, 18, 44],
})
