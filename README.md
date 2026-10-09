# Landmarks

Hand-made 3D models of landmarks for maps: a stand-in for a building's plain
extrusion, the way Apple Maps draws the Eiffel Tower as a tower rather than a
box. Every model is generated from code, kept small (a few thousand
triangles, no textures) and drawn in one shared palette, so a city's
landmarks look like one set.

The dataset is published as static files in the
[Open Landmarks](https://github.com/benjamintd/open-landmarks) release format
at **https://alexwohlbruck.github.io/landmarks/**, so any client that reads
Open Landmarks reads this too. [Barrelman](https://github.com/alexwohlbruck/barrelman)
imports it beside Open Landmarks and serves both to
[Parchment](https://github.com/alexwohlbruck/parchment) as one tile layer.

## Layout

| Path | What |
|---|---|
| `catalog.json` | Every model and every placement of it |
| `models/<id>.glb` | The models, as the generators write them |
| `generators/<id>.ts` | One generator per model: the source of truth for its GLB |
| `generators/mesh.ts`, `palette.ts`, `coaster-kit.ts` | The shared kit the generators build with |
| `STYLE.md` | The art style, and how to build a model that holds up to review |
| `tools/` | `preview.ts` and `sheet.ts`, for looking at models without a browser |
| `src/` | The release build: validation, placement baking, the published format |
| `test/` | Tests for the build and the catalog |

`bun install` once; nothing else is needed. Bun runs everything.

| Command | Does |
|---|---|
| `bun generators/<id>.ts` | Write `models/<id>.glb` |
| `bun run validate` | Check the catalog and every model, as the release build does |
| `bun run preview <id>` | Render one model from every side into `preview/<id>/` |
| `bun run sheet <id ...>` | Contact sheets for a list of landmarks, into `preview/sheets/` |
| `bun run sheet --branch-diff` | Contact sheets for everything this branch adds or changes |
| `bun run build` | Validate, then write the release to `dist/` |
| `bun test` / `bun run typecheck` | Tests, types |

## Models and placements

The catalog keeps two lists, because a model and the places it stands are
different things.

A **model** is a GLB plus its `license`, `author` and `source` (its
generator). A **landmark** places a model:

- `id` and `name`;
- `lng`/`lat` of the anchor;
- `bearing`: degrees clockwise from north that the model's north is turned to;
- `scale`, plus an optional `elevation` and `minzoom` (14 when absent);
  `elevation` is in metres, positive to raise the model and negative to sink
  it, within ±200 (0 when absent);
- `replaces`: the OSM elements it stands in for, as `way/123` or `relation/456`;
- `wikidata`, where the landmark has an item.

The Eiffel Tower model is placed twice: in Paris, and on the Las Vegas Strip
at `scale: 0.5`. The Statue of Liberty stands on Liberty Island with
`elevation: 10`, so her pedestal rests on Fort Wood's map geometry.

### Elevation

The map stands every model on its terrain: it puts y = 0 on the lowest
ground under the footprint. `elevation` moves the model up or down from
there, for ground the terrain doesn't show. Leave it at 0 unless one of
these applies:

- **Something under the model that OSM doesn't map**, so the map draws no
  building for it to stand on: a plinth, a fort, a pier, a deck. Liberty
  stands 10 m up on Fort Wood. The Pacific Wheel stands 7.5 m up on the
  Santa Monica Pier.
- **A base below the street.** A stadium whose field is dug below the
  street around it keeps y = 0 at the field, and `elevation` is minus the
  depth: how far the field is below the street outside. Nationals Park's
  field is about 7 m below the street, so it would take `elevation: -7`. The map
  then sets the street-level parts of the model on the street, with terrain
  on or off, and hides whatever ends up below the ground.

Measure the depth from a section drawing, a published field level or
street-level imagery, not from the map's terrain. The terrain is often too
coarse, or older than the dig: it shows SoFi Stadium's field 1.9 m below the
street, where the real field is about 30 m down.

A positive value lifts the whole model rigidly. Its base no longer follows
the terrain, so don't use it to make up for a slope; the map handles slopes.

### The frame contract

Every model uses the same frame, so a client can place it from a position, a
bearing and a scale alone:

- **+Y is up, -Z is north, +X is east.**
- **Units are metres.**
- **The origin is the anchor, on the lowest ground the footprint touches.**
  The model stands on y = 0. With terrain on, the map samples the ground
  across the footprint and puts y = 0 at the lowest point, so on a slope the
  uphill side sinks into the hill rather than the downhill side floating.
- **There is no transform on the root node.** Moving parts are child nodes
  (see Animation in `STYLE.md`).

### What `replaces` must list

The client hides buildings by OSM id. List the outline and every
`building:part` inside it. Detailed buildings are mapped twice in OSM, an
outline over the whole footprint and `building:part` polygons inside it, and a
ref left off this list keeps drawing and shows through the model as a box.

To find the parts, select the outline in the iD editor and look at what sits
inside it, or ask Overpass:

```
way(5013364);map_to_area->.a;(way(area.a)["building:part"];);out ids tags;
```

Some parts are separate buildings that happen to sit inside the outline, such
as the ticket booths under the Eiffel Tower. Leave those off if the model
doesn't cover them.

A roller coaster lists its track ways too, as well as its station: maps draw
coaster tracks as lines and hide the ways a landmark replaces, so a way left
off draws through the model. List every way the model draws, including
covered and tunnel stretches, and leave off spurs and sidings it doesn't
draw (`service=siding`).

## Adding a model

1. **Pick the id.** A lowercase slug, prefixed with its city or park when it
   belongs to a batch (`clt-`, `wdw-`, `carowinds-`). The model, its
   generator and its first placement share it.
2. **Gather evidence and build it** as `STYLE.md` describes: OSM, published
   dimensions, photos from several sides. Record in the generator's header
   comment where every number came from and what is estimated.
3. **Write `generators/<id>.ts`** with the kit (`mesh.ts`, `palette.ts`, and
   `coaster-kit.ts` for rides). The worked examples are
   `generators/eiffel-tower.ts`, `generators/chrysler-building.ts` and
   `generators/carowinds-fury-325.ts`. It writes `models/<id>.glb`:

       bun generators/<id>.ts

4. **Look at it.** `bun run preview <id>` renders every view the review
   checklist in `STYLE.md` asks for, with map lighting, into `preview/<id>/`.
   Pass PNG photos to get side-by-side comparisons.
5. **Add it to `catalog.json`**: a `models` entry
   (`"license": "CC0-1.0"`, `"author"`, `"file": "models/<id>.glb"`,
   `"source": "generators/<id>.ts"`) and a `landmarks` entry placing it.
6. **`bun run validate`**, then `bun test`.
7. **Open a pull request** with its contact sheet (below).

Models made in Blender or elsewhere are fine too, as long as they follow the
frame contract and carry a licence the catalog can state.

## Batch pull requests

New models arrive in batches: one branch and one pull request per city or
park, usually 20 to 50 models.

- **Ids share a prefix** for the batch (`clt-`, `wdw-`, `nyc-`), so the batch
  sorts together and its files are easy to find.
- **One generator per model**, `generators/<id>.ts`, plus its
  `models/<id>.glb` and its catalog entries. Helpers shared within the batch
  go in a generator the others import (as `clt-terminal.ts` does for the
  airport); helpers useful beyond it go in the kit, in their own commit.
- **One commit per model**, so a model can be reviewed, reverted or dropped
  alone.
- **Contact sheets in the PR description.** Reviewers look at the sheets
  first. Make them with:

      bun run sheet --branch-diff --out review/<batch>

  Each image holds 8 landmarks (`--per` changes it): a three-quarter view
  from the south-west, turned to the landmark's real bearing, and the same
  view at phone size, labelled with id, name, anchor and size.

GitHub has no API for attaching images to a pull request, so the sheets are
committed on the PR branch and linked by commit:

1. `git add review/<batch> && git commit -m "Contact sheets for <batch>"` and push.
2. Link each image in the PR body by that commit's SHA, so the link outlives
   the files:

       ![sheet 1](https://raw.githubusercontent.com/alexwohlbruck/landmarks/<sha>/review/<batch>/sheet-1.png)

3. Before merging, `git rm -r review/<batch>` in a last commit. The images
   stay reachable through the PR's commits. The release workflow fails on
   `main` if `review/` is still there.

## Releases

`bun run build` validates the catalog and every model, fails on any problem,
and writes `dist/` in the Open Landmarks format:

| Path | What |
|---|---|
| `api/v1/latest.json`, `api/v1/preview.json` | Channel pointers. Both name the current release |
| `api/v1/releases/<release>/catalogue.json` | The release: count, bounds, attribution, links |
| `api/v1/releases/<release>/assets.json` | Every asset record |
| `api/v1/releases/<release>/index/12/<x>/<y>.json` | The same records, by z12 tile |
| `models/<id>/<sha256>/low.glb` (+ `.gz`) | Models, content-addressed, with a gzip file of each |
| `assets/<id>/<revision>/asset.json` | One record on its own |
| `objects/<sha256>/<id>.ts` | The generator that made it |

Each placement is one asset. Open Landmarks has no bearing or scale (its
assets are baked in place with `heading: 0`), so the build bakes each
placement's bearing and scale into its own copy of the GLB: static geometry
has its vertices turned and scaled, and moving parts have the same transform
folded into their node and keyframes, so they still move. A placement with
nothing to bake keeps the model's bytes exactly, and identical bytes are
stored once. `replaces` becomes `osm` (the first ref) and `additionalOsm`
(the rest). Three fields are additions to the format: `wikidata`;
`elevation`, sent only when it isn't 0; and `model` with `placement`,
recording what was baked.

Elevation is not baked. A map finds a model's ground from its lowest
vertices and sets them on the terrain, so a lift baked into the geometry
gets pulled back down. Sent as a field, it is applied after the model has
been grounded. A reader that doesn't know the field draws the model at
ground level.

The build reads no clock and no git state, so the same catalog always gives
the same files and the same release id (`landmarks-<hash>`). Clients that
skip an unchanged release, as Barrelman does, skip a push that changed
nothing.

Every push to `main` runs the tests, builds, and deploys `dist/` to GitHub
Pages (`.github/workflows/release.yml`). There is no separate release step:
merging is releasing. Pages holds only the current release, so a client
should read the pointer, catalogue and assets in one go, as Open Landmarks
clients do.

## Licences

- **Models are CC0-1.0**: public domain, no credit needed. Each states its
  licence in the catalog and in its asset record; a model under another
  licence must say so, and a CC-BY one must carry an `attribution`.
- **Placements are ODbL-1.0.** Anchors and `replaces` are derived from
  OpenStreetMap, © OpenStreetMap contributors.
- The code in `src/`, `tools/` and `generators/` is CC0-1.0 as well.

Reference photos used while modelling keep their own licences and are not
part of this repo.
