/**
 * Pyramid of Khafre, Giza: procedural, CC0-1.0.
 * bun generators/giza-pyramid-of-khafre.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * centre of OSM's outline; y = 0 is the pyramid's base. tools/terrain.ts
 * could not check the site (Mapterhorn has no z15 tiles here); elevation is
 * 0. (Khafre stands on bedrock ~10 m higher than Khufu, which is why it looks
 * the taller from the ground; the map's own terrain is too coarse to show it.)
 *
 * Built c. 2570 BC for Khafre: the second pyramid, steeper than Khufu's, and
 * the only one that keeps part of its smooth limestone casing, a pale cap on
 * the top fifth of its faces.
 *
 * Published (Wikipedia, "Pyramid of Khafre"): base 215.3 m square; height
 * 143.5 m as built, 136.4 m now; slope 53.13 degrees.
 * OSM: way/4420396 (height 136, an outline ~210 m square; the published base
 * is used, centred on it). Replaced.
 * From photos ("Pyramid of Khafre Giza Egypt in 2015 2.jpg", MusikAnimal,
 * CC BY-SA 3.0, scaled from the base): the casing's lower edge at ~0.8 of
 * the height (estimated 108 m; its ragged edge is drawn straight).
 * Built with the kit in giza-great-pyramid.ts (see its header).
 *
 * Photos (Wikimedia Commons):
 * - "Pyramid of Khafre Giza Egypt in 2015 2.jpg", MusikAnimal, CC BY-SA 3.0
 * - "All Gizah Pyramids.jpg", Ricardo Liberato, CC BY-SA 2.0
 * - "The Sphinx and Pyramid of Khafre.jpg", kallerna, CC BY-SA 4.0
 */
import { writePyramid } from './giza-great-pyramid'

await writePyramid({
  name: 'Pyramid of Khafre', file: 'giza-pyramid-of-khafre.glb',
  base: [215.3, 215.3], apex: 143.5, height: 136.4, core: 0xd2b993, casingFrom: 108,
})
