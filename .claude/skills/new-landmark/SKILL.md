---
name: new-landmark
description: Build one new landmark model for this repo, from evidence to catalog entry. Asks the user which landmark, then finds its location, picks the id, gathers open evidence, writes the generator and checks it against photos.
argument-hint: "[landmark name, city]"
---

# New landmark

Build one landmark model end to end. The user may have named it already:

> $ARGUMENTS

## 1. Ask

If the landmark isn't named above, ask the user which landmark to build and
in which city. Ask nothing else up front. Work the rest out yourself:

- **Location.** `python3 tools/osm.py search "<name>, <city>"` gives the OSM
  element, centre, height and wikidata. If it returns several plausible
  matches, show them and ask the user which one.
- **Id.** `<prefix>-<slug>`, lowercase. Reuse the city's existing prefix
  from `catalog.json` (`nyc`, `chi`, `la`, `sf`, `clt`, `dc`, `lv`, `sea`,
  `wdw`, `dlr`, `carowinds`, …). For a new city, propose a short prefix.
  Check the id isn't taken.
- **Author.** Every model so far is credited to `Barrelman`. Use that
  unless the user asks for other credit.

Then confirm in one short message: name, id, coordinates, the OSM outline
you'll replace, the author, and anything already in the catalog nearby.
Start once the user agrees.

## 2. Read

Read all of these before writing code:

- `STYLE.md`, all of it, especially "Building a famous or intricate model",
  "Rejected looks" and "Checking a model";
- `docs/reference.md`: frame contract, elevation, bridges, and what
  `replaces` must list;
- `docs/evidence.md`: what may and may not be used;
- one or two existing generators for similar landmarks, as a template.

## 3. Evidence

Keep downloads in a scratch directory outside the repo.

- OSM: `python3 tools/osm.py buildings <lng> <lat> 150` for the outline and
  every `building:part` inside it.
- Published heights and dimensions: Wikipedia, NRHP and landmark reports,
  RCDB for rides.
- Licensed photos from at least three sides, plus one from above or far
  away: `python3 tools/photos.py commons "<name>" 10`, Openverse, Mapillary.
- Lidar where it covers the site: `tools/lidar.py`.
- **Open evidence only.** Never Google, Apple, Bing or Mapbox imagery, Street
  View, or any 3D tiles, even when nothing else exists.

Record every number's source in the generator's header comment and mark
what is estimated.

## 4. Build

1. List the 3 to 5 features that make the landmark recognisable, each tied
   to the photo that shows it.
2. Write `generators/<id>.ts` with the kit (`mesh.ts`, `palette.ts`, plus
   `coaster-kit.ts` or `bridge-kit.ts` where they apply). Run
   `bun generators/<id>.ts`.
3. Massing first. Render with
   `bun run preview <id> preview/<id> <photo.png ...>` and compare each
   render with a photo from the same direction. Fix proportions until the
   silhouette matches before adding any detail.
4. Add the identifying features, then the facade. Check the 200 and 80 px
   views: if a feature vanishes, make it bigger or bolder, not more
   detailed. Check `--night`. Stay within the budget in `STYLE.md`.

## 5. Catalog and checks

- Add the `models` entry (`"license": "CC0-1.0"`, `"author"`,
  `"file": "models/<id>.glb"`, `"source": "generators/<id>.ts"`) and the
  `landmarks` entry: anchor, `bearing`, `scale: 1`, `wikidata`, and
  `replaces` with the outline and every `building:part` the model covers.
- `bun run validate` and `bun test` must pass.

## 6. Report

Show the user the three-quarter render beside a photo, and the phone-size
views. Name every difference you can still see between the renders and the
photos; never say it looks right without putting a render next to a photo.
List the sources, the estimates and any doubts. Ask whether to iterate or to
commit and open a pull request with a contact sheet
(`bun run sheet <id>`).
