# Making a batch of landmarks

New models arrive in batches: one city or park, one branch, one pull request,
usually 20 to 50 models. This page is the whole process, from choosing
candidates to the models showing on the map. It is written so a new session,
human or agent, can run a batch from scratch.

Read [`STYLE.md`](../STYLE.md) and the [README](../README.md) first. Then
[`evidence.md`](evidence.md), for where facts may come from.

## Who does what

A batch has a **lead** and several **builders**. With agents, the lead is
one long-running agent and the builders are sub-agents it starts. The briefs
to paste into them are in [`briefs/`](briefs/):

- [`briefs/lead.md`](briefs/lead.md): plans the list, starts builders,
  reviews every model, merges, opens the PR.
- [`briefs/builder.md`](briefs/builder.md): builds three to six landmarks:
  evidence, generator, model, placement.

Run at most three builders at once, each with three to six related
landmarks. Give the tallest or most famous landmark a builder of its own.

## Rules that override everything else

These come from direct feedback on past batches.

- **Approved forms are fixed.** Never drop an existing model, and never skip
  a landmark the user asked for, on your own judgement. A weak model is
  reworked and flagged as weak in the PR. It is dropped only when the user
  asks.
- **A requested retry delivers a visible change.** When asked to retry a
  model, hand back a version that looks different, for the user to judge.
  Don't conclude it isn't worth changing and return the old one.
- **Restyles change the facade, not the form.** Once the user has approved a
  model's silhouette or crown, a restyle changes only facade treatment and
  colour. Lidar may correct a clearly wrong height by scaling the form. It
  must not redesign it. See "Reworking an approved model" in `STYLE.md`.
- **Open evidence only.** No Google, Apple, Bing or commercial 3D tiles,
  ever. See [`evidence.md`](evidence.md).
- **The reviewer looks at the photos.** A builder's "it reads well" is not
  evidence. The lead opens the reference photos and compares them with the
  renders before accepting a model.

## 1. Set up

```bash
git -C <landmarks> fetch -q origin
git -C <landmarks> worktree add -b batch/<city> <worktrees>/<city> origin/main
cd <worktrees>/<city> && bun install
mkdir -p <scratch>/<prefix>/{new,work}
```

- `<landmarks>` is the main clone. Leave it alone while batches run; each
  batch works in its own worktree.
- `<scratch>` is a scratch directory outside the repo for photos, lidar,
  renders and placement files. It holds a lot of images, and none of it is
  committed. Keep it somewhere that survives a reboot if the batch will
  outlive the session.
- The Python tools need a virtual environment once:
  `python3 -m venv .venv && .venv/bin/pip install -r tools/requirements.txt`.
  Only `tools/lidar.py` needs it; the rest use the standard library.

Ids share a prefix for the batch (`chi-`, `sea-`, `clt-`), so the batch
sorts together.

## 2. Choose the candidates

Look for the city's most recognisable buildings and structures: skyline
towers, civic buildings, monuments, stadiums and arenas, museums, churches,
bridge towers, famous sculpture, stations, rides. Prefer things people look
for on a map and that read in 3D from above.

Skip:

- anything already in `catalog.json` or in Open Landmarks;
- plain boxes with nothing distinctive;
- things too small to read at zoom 16;
- landmarks whose identity is signage, a mural or neon alone.

Never skip a landmark the user named. If one of those is hard, build the
best plain version the evidence allows and flag it.

For each candidate, confirm in OSM that it is where you think
(`tools/osm.py search`, `tools/osm.py named`), that licensed photos exist
(`tools/photos.py commons`), and whether lidar covers it
(`tools/lidar.py find`). Write the list to `<scratch>/<prefix>/plan.md` with
id, name, coordinates and one line on why. Aim for 30 to 50 in a big city.

Also write down the candidates you looked at and didn't build, with the
reason. They go in the PR so the user can ask for any of them.

## 3. Gather evidence

See [`evidence.md`](evidence.md) for sources and rules. In short, per
landmark:

- OSM outline and parts (`tools/osm.py buildings`);
- three to six licensed daylight photos from different sides
  (`tools/photos.py`, `tools/mapillary.py`);
- lidar heights where covered (`tools/lidar.py grid`, `tools/lidar_frame.py`);
- a NAIP aerial for plan, roof colour and shadows (`tools/usgs.py naip`);
- published dimensions, cited;
- an official record for the name and identity where there is any doubt.

Record each source, with URL, author and licence, in the generator header
as you go.

## 4. Build the generator

One generator per model: `generators/<id>.ts` writes `models/<id>.glb`.
Build with the kit (`generators/mesh.ts`, `palette.ts`, and `coaster-kit.ts`
for rides). Good examples to read: `empire-state-building.ts`,
`chrysler-building.ts`, `grand-central-terminal.ts`,
`bank-of-america-corporate-center.ts`, `wonder-wheel.ts`, `chi-board-of-trade.ts`,
`sf-transamerica-pyramid.ts`, `sea-space-needle.ts`, `dc-white-house.ts`;
for coasters `carowinds-fury-325.ts`.

Build in order: massing, then the three to five identifying features, then
the facade, then the phone-size check (`STYLE.md`, "Build in order").

**Shared helpers.** A helper used by several models in one batch lives in
one of their generators and is exported. The generator's own build runs
behind `if (import.meta.main)`, so importing it doesn't write its model:

```ts
export function walls(...) { ... }

if (import.meta.main) await main()
```

`chi-aon-center.ts` and `chi-board-of-trade.ts` work this way for the
Chicago towers. When merging, commit the helper's own model before any model
that imports it, or the earlier commit doesn't build on its own.
`tools/merge-model.sh` refuses the merge if the order is wrong. A helper
useful beyond one batch goes in the kit, in a commit of its own.

**The placement** goes in `<scratch>/<prefix>/new/<id>.json`, which the lead
merges:

```json
{ "model": { "id": "<id>", "license": "CC0-1.0", "author": "<author>" },
  "landmark": { "id": "<id>", "name": "<display name>", "model": "<id>",
                "lng": 0, "lat": 0, "bearing": 0, "elevation": 0, "minzoom": 15,
                "wikidata": "Q...", "replaces": ["way/123"] } }
```

A model placed more than once (each tower of a bridge) uses
`"landmarks": [ ... ]` instead of `"landmark"`.

- `lng`/`lat`: the outline's centroid.
- `bearing`: the building's main axis, clockwise from north. Build the
  model in that turned frame.
- `replaces`: the outline and every `building` or `building:part` the model
  covers; for a coaster, its track ways and station too. Empty when OSM has
  no building (a statue).
- `minzoom`: 13 for supertall or skyline-defining, 14 large, 15 mid-size,
  16 small.
- `elevation`: 0 unless one of the cases in
  [`evidence.md`](evidence.md#elevation) applies.

## 5. Review

The lead reviews every model, over several rounds. This is where batches
succeed or fail.

For each model:

1. Open the builder's reference photos. At least two, from different sides.
2. Render the model from each photo's side: `bun run preview <id>` for the
   fixed views, `bun tools/view.ts <id> out.png <from-deg> <elevation>` for
   any other. Pair photo and render with `bun tools/montage.ts`.
3. Compare silhouette, crown, proportions, colours material by material,
   symmetry, and anything poking past an edge. Name what differs.
4. Check the 200 px and 80 px views. The identifying features must survive
   at 80 px.
5. Check the budget: `bun tools/glb-stats.ts <id>` (at most 6 materials,
   5,000 triangles or 6,500 for complex models, 250 KB, lowest point y = 0).
6. Check the placement: anchor, bearing, `replaces` against
   `tools/osm.py buildings`, elevation.

Send the model back with specific fixes when it fails any of these. Expect
two or three rounds on the famous ones. A weak model that can't be fixed
stays in the batch, marked as weak in the PR table; it is not dropped.

A contact sheet of the whole batch so far, with phone sizes:

```bash
bun run sheet --branch-diff --out <scratch>/<prefix>/sheets
```

Each landmark gets a three-quarter view from the south-west, turned to its
real bearing, plus the same view at 200 and 80 px.

## 6. Merge

For each accepted model, in the batch worktree:

```bash
tools/merge-model.sh <scratch>/<prefix>/new/<id>.json "Add <Name>"
```

It regenerates the GLB, adds or replaces the catalog entries by id,
validates, typechecks the generator and commits the generator, the model
and `catalog.json`: one commit per model. Then run `bun test` once the batch
is merged.

**Catalog conflicts.** Two batch branches both append to `catalog.json`, so
rebasing one onto the other conflicts at the end of each list. Merge the
file by id with `tools/merge-catalog.py`. `.gitattributes` names it as the
merge driver for `catalog.json`; enable it once per clone:

```bash
git config merge.catalog.name "catalog.json, merged by id"
git config merge.catalog.driver "python3 tools/merge-catalog.py %O %A %B"
```

Then `bun run validate`. The script's header shows how to run it by hand
mid-conflict.

## 7. Pull request

1. Contact sheets into the branch:

   ```bash
   bun run sheet --branch-diff --out review/<city>
   git add review/<city> && git commit -m "Contact sheets for <city>"
   git push -u origin batch/<city>
   ```

   For reworks, add before-and-after sheets. Render "before" from a
   checkout of `main`:

   ```bash
   git -C <landmarks> worktree add --detach <scratch>/main origin/main
   (cd <scratch>/main && bun install && bun run sheet <ids> --out <worktree>/review/<city>/before)
   bun run sheet <ids> --out review/<city>/after
   ```

   Remove the `main` worktree afterwards.

2. Open a draft PR against `main`, titled `<City> landmarks`. The body has:
   - one paragraph on the batch: what it covers, the evidence used, what was
     reworked;
   - the sheets, linked by the commit SHA so the links outlive the files:
     `![sheet 1](https://raw.githubusercontent.com/alexwohlbruck/landmarks/<sha>/review/<city>/sheet-1.png)`;
   - the model table: `bun tools/pr-table.ts --prefix <prefix>- --notes notes.json`,
     where `notes.json` maps each id to `[evidence, doubts]`;
   - the weak models, said plainly;
   - the candidates looked at and not built, with reasons;
   - credits: per model, each photo's URL, author and licence, from the
     generator headers.

3. Remove the sheets in a last commit before merging:
   `git rm -r review/<city> && git commit -m "Remove contact sheets"`.
   The images stay reachable through the PR's commits. The release
   workflow refuses to publish from `main` while `review/` exists.

Don't merge the PR yourself. The user reviews it on a phone, against the
sheets and the photos.

## 8. Release

Merging to `main` is releasing. The `Release` workflow
(`.github/workflows/release.yml`) runs `typecheck`, `test` and `build`, and
deploys `dist/` to GitHub Pages at https://alexwohlbruck.github.io/landmarks/.
There is no version to bump and no tag to cut.

The build is deterministic. The release id (`landmarks-<hash>`) depends only
on the catalog and the models, so a push that changes no model or placement
publishes the same release and clients skip it.

## 9. Deploy

Barrelman imports the release; Parchment draws what Barrelman serves.

- **Each Barrelman instance picks up the new release when its API starts.**
  The import fetches the release pointer, and if it moved, downloads only
  the models it doesn't have.
- **To pick it up without a restart**, run the import in the API container:

  ```bash
  docker compose exec barrelman bun run landmarks:import
  ```

  This costs one request when nothing changed.
- **Use `landmarks:import:full` when existing rows must be rewritten**: after
  a change to Barrelman's importer, or to repair a bad import. It re-reads
  every release, re-downloads and verifies every model, and rewrites every
  row.

  ```bash
  docker compose exec barrelman bun run landmarks:import:full
  ```

- **Barrelman 0.10.5 or later** is needed for `elevation`. Older versions
  import every landmark at elevation 0.
- New models need no Barrelman release. When a change to Barrelman itself is
  about landmarks, its release bumps only the patch number (0.10.5 to
  0.10.6).

To check a deploy: the landmark should appear in Barrelman's
`/tiles/landmarks` layer at its anchor, and on the map. For a final look in
the app itself, `tools/app-shot.mjs` screenshots landmarks from street
level in a Parchment development server, with terrain on and off. It can
also draw a landmark at a trial elevation (`SINK=<id>=<metres>`) before that
value is released. See its header for setup.

If the layer is empty or the log says `landmark import failed`, see
Barrelman's troubleshooting page: the API needs outbound HTTPS to the
release host.

## Tools

| Tool | Does |
|---|---|
| `bun run preview <id> [dir] [photo.png ...]` | Every review view of one model, plus photo side-by-sides |
| `bun run sheet <id ...>` / `--branch-diff` | Contact sheets, with 200 and 80 px views |
| `bun tools/view.ts <id> <out> <from> [el]` | One render from any compass side, to match a photo |
| `bun tools/montage.ts <out> <img[=label]> ...` | Photos and renders side by side, PNG or JPEG |
| `bun tools/glb-stats.ts <id ...>` | Triangles, size, materials, bounds, budget flags |
| `bun tools/pr-table.ts --prefix <p>` | The PR's model table |
| `tools/merge-model.sh <placement.json> "<msg>"` | Merge and commit one model |
| `python3 tools/merge-catalog.py` | Merge two `catalog.json` by id; git merge driver |
| `python3 tools/osm.py buildings\|named\|search` | OSM outlines and parts, named features, Nominatim |
| `python3 tools/photos.py commons\|openverse` | Licensed photo search, tagged evidence or look-only |
| `python3 tools/mapillary.py` | Street photos aimed at a landmark, one per side |
| `python3 tools/lidar.py find\|grid` | USGS 3DEP lidar: datasets at a point; height grid |
| `python3 tools/lidar_frame.py` | Read a lidar grid in a model's turned frame |
| `python3 tools/usgs.py naip\|dem` | NAIP aerial; bare-earth ground table |
| `python3 tools/lacounty.py buildings\|dsm` | LA County lidar footprints and surface model |
| `node tools/app-shot.mjs <scenes.json>` | Street-level screenshots in a Parchment dev server |

Every tool prints its usage when run without arguments, and its header
comment says more.

## Disk

Photos, renders and lidar add up across a batch with several builders.

- `tools/lidar.py` deletes its point-cloud downloads on exit. If you keep a
  cache with `LIDAR_CACHE`, delete it when done.
- Keep only the photos and renders you cite.
- On a full disk (`ENOSPC`), stop and report. Don't delete other builders'
  files.
- A finished batch's scratch directory can go once the PR is merged. Its
  facts are in the generator headers.
