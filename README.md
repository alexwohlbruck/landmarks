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
| `generators/mesh.ts`, `palette.ts`, `coaster-kit.ts`, `bridge-kit.ts` | The shared kit the generators build with |
| `STYLE.md` | The art style, and how to build a model that holds up to review |
| `docs/` | How a batch of models is made, from candidates to deploy, and the agent briefs |
| `tools/` | Renderers for looking at models without a browser, evidence fetchers (lidar, OSM, photos), the merge script, and the Open Landmarks export |
| `src/` | The release build: validation, placement baking, the published format; `src/open-landmarks/`, the submission export |
| `test/` | Tests for the build and the catalog |

`bun install` once; nothing else is needed. Bun runs everything.

| Command | Does |
|---|---|
| `bun generators/<id>.ts` | Write `models/<id>.glb` |
| `bun run validate` | Check the catalog and every model, as the release build does |
| `bun run preview <id> [--night]` | Render one model from every side into `preview/<id>/`, or as the map draws it at night |
| `bun run sheet <id ...>` | Contact sheets for a list of landmarks, into `preview/sheets/` |
| `bun run sheet --branch-diff` | Contact sheets for everything this branch adds or changes |
| `bun run build` | Validate, then write the release to `dist/` |
| `bun test` / `bun run typecheck` | Tests, types |

The full process for a batch, and every tool in `tools/`, is in
[`docs/workflow.md`](docs/workflow.md). Where evidence comes from, and what
may not be used, is in [`docs/evidence.md`](docs/evidence.md). The briefs
handed to agents that build or lead a batch are in [`docs/briefs/`](docs/briefs/).

## Models and placements

The catalog keeps two lists, because a model and the places it stands are
different things.

A **model** is a GLB plus its `license`, `author` and `source` (its
generator), and optionally a `detail` GLB with a `detailZoom` (see Levels
of detail). A **landmark** places a model:

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

### Levels of detail

A model is one GLB, its low level of detail, held to the budget in
`STYLE.md`. A model whose identity is in parts too thin or too many for that
budget, such as a bridge's suspenders, may add a finer GLB in the same frame:

    "detail": "models/<id>.detail.glb", "detailZoom": 16

A map draws the low model below `detailZoom` (17 when absent) and the detail
model from there up. The detail model is the whole landmark, not an
addition to the low one, and has Open Landmarks' detail budget: 40,000
triangles, 1.5 MB, six materials. The low model drops the thin parts and
keeps everything that reads from far off. The release publishes it as the
asset's `lods.detail`, baked like the low one.

### Bridges

A bridge is one placement for the whole structure, not one per tower: the
towers, anchorages, cables, suspenders and stays, trusses or girders and
the deck's underside. The model owns the walkways and tracks on the bridge,
their surfaces included. The map draws the road surfaces and their
markings, and the approach viaducts and ramps outside the bridge's
`man_made=bridge` outline, with their own piers and parapets.

- **No road surfaces.** A bridge model draws nothing at road level across a
  roadway: trusses stand beside the roadways, the underside hangs below
  them, railings stand on their edges, and the tops stay open for the map's
  roadways to show through. A raised promenade or a rail deck is the
  model's, walking or riding surface and all, since the map leaves those out
  within the model's reach.
- **Masonry just under a roadway is allowed.** An anchorage's roof or a
  tower's string course may sit under the map's roadway, 0.25 m or more
  below it, so the roadway rests on it rather than floating. Keep it out of
  arches and openings the roadway passes through.
- **`replaces` lists the outline.** List the bridge's `man_made=bridge`
  outline (a way or a multipolygon relation) beside the towers, anchorages
  and any other buildings the model covers. The outline is what tells the
  map to leave out its own piers and parapets across it, so list it only
  when the model draws the structure across the whole outline. An outline
  that runs on over approach viaducts the model doesn't draw leaves those
  approaches without piers.
- **Heights.** y = 0 is the water under the main span, the lowest ground
  under the footprint. The trusses are built around the roadway the map
  draws, so the two meet: for a suspended span the map raises its decks to
  the outline's `height` at midspan and lowers them along a parabola to the
  towers. Record in the generator the roadway heights the model was built
  to.
- **Feet on the terrain.** Towers in the water stand at y = 0. Anything
  standing on land, such as an anchorage, runs down to the ground under it
  vertex by vertex, at the DEM's height above its own water reading. A map
  that finds a model's ground from its lowest vertices then drapes the
  bridge over its terrain instead of setting it rigidly on the mean ground
  of a kilometre-long footprint.

A masonry approach outside the outline, which OSM maps as
`bridge:support=abutment` buildings between the street crossings, can be a
placement of its own: it replaces those buildings, leaves the crossings'
outlines and every deck on top to the map, and builds its top 0.4 m under
the map's roadways and its feet on the map's terrain
(`nyc-brooklyn-bridge-brooklyn-approach.ts`).

`generators/bridge-kit.ts` has the shared pieces: cables, rods, open and
solid trusses, terrain-footed walls. `nyc-brooklyn-bridge.ts` and
`sf-golden-gate-bridge.ts` are the worked examples.

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

## Contributing to Open Landmarks

The release above is read by Open Landmarks clients; contributing a model to
the Open Landmarks repository itself is a separate export, because a
submission there is stricter than a release here:

    bun run open-landmarks <open-landmarks checkout>
    blender -b --factory-startup --python tools/open-landmarks-blend.py -- <checkout>/collection <id ...>
    cd <checkout> && node tools/render-previews.mjs <id ...>   # then click Render

The first writes `collection/<id>/` for every placement Open Landmarks
doesn't already have (matched by OSM element, Wikidata item or footprint),
with `asset.json`, both LODs and `spatial-source.json`, and adds the finishes
the models need to their `materials.json`. On the way it:

- flattens the model to one static node, moving parts in their rest pose;
- cuts away footings below y = 0, since they stand a model on its lowest point;
- converts colours exactly: our kit encodes with a 2.2 gamma, they check the
  sRGB curve, so a colour off their swatches becomes a finish named after the
  model rather than being snapped to one;
- clips `window` panels to the walls behind them, setting proud panels 2 cm
  off the wall, and keeps any glazing with no wall behind it as a
  `<model>-glazing` finish in the window colour;
- folds the closest colours together where a model would otherwise use more
  than their six materials, and says so in the asset's notes.

Ids there name the landmark (`sutro-tower`), not our batch. OSM versions,
tags and geometry come from the OSM API and Commons credits from the Commons
API, cached in `.cache/open-landmarks/`. Textured models are skipped: v1
takes plain colour only.

## Licences

- **Models are CC0-1.0**: public domain, no credit needed. Each states its
  licence in the catalog and in its asset record; a model under another
  licence must say so, and a CC-BY one must carry an `attribution`.
- **Placements are ODbL-1.0.** Anchors and `replaces` are derived from
  OpenStreetMap, © OpenStreetMap contributors.
- The code in `src/`, `tools/` and `generators/` is CC0-1.0 as well.
- **Copies contributed to Open Landmarks are CC BY 4.0**, under their
  contributor grant, credited to Alex Wohlbruck. The CC0 originals here are
  unaffected.

Reference photos used while modelling keep their own licences and are not
part of this repo.
