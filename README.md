# Landmarks

**Low-poly 3D landmarks for maps.**

![Washington Square Arch and the Empire State Building at night](docs/images/washington-square.jpg)

3D models of landmarks that replace a building's default extrusion on the
map. Each model is generated from code, has a few thousand triangles and no
textures, and uses a shared color palette.

500+ landmarks in New York, Chicago, Los Angeles, San Francisco, Charlotte,
Washington DC, Las Vegas, Seattle and a few theme parks.

The dataset is published at **https://alexwohlbruck.github.io/landmarks/**
in the [Open Landmarks](https://github.com/benjamintd/open-landmarks) format,
and is drawn in [Parchment](https://github.com/alexwohlbruck/parchment) via
[Barrelman](https://github.com/alexwohlbruck/barrelman).

## Getting started

You need [Bun](https://bun.sh). Nothing else.

```sh
git clone https://github.com/alexwohlbruck/landmarks
cd landmarks
bun install
```

| Command | Does |
|---|---|
| `bun generators/<id>.ts` | Build one model into `models/<id>.glb` |
| `bun run preview <id> [--night]` | Render a model from every side into `preview/<id>/` |
| `bun run sheet <id ...>` | Contact sheets for a list of landmarks |
| `bun run validate` | Check the catalog and every model |
| `bun test` / `bun run typecheck` | Tests and types |

## Contributing a model

Each landmark is a small TypeScript file in `generators/` that builds the
model from boxes, prisms and curves, and writes a GLB.

1. **Pick an id.** A lowercase slug, prefixed with its city or park:
   `nyc-brooklyn-bridge`, `chi-cloud-gate`, `carowinds-fury-325`.
2. **Gather evidence.** OSM footprints, published heights, photos from
   several sides. Note in the generator's header where each number came
   from. See [`docs/evidence.md`](docs/evidence.md) for what may be used.
3. **Write `generators/<id>.ts`** with the shared kit (`mesh.ts`,
   `palette.ts`, plus `coaster-kit.ts` or `bridge-kit.ts`). Good examples to
   copy from: `eiffel-tower.ts`, `chrysler-building.ts`,
   `carowinds-fury-325.ts`. Then run `bun generators/<id>.ts`.
4. **Look at it** with `bun run preview <id>`, and compare against photos.
5. **Add it to `catalog.json`**: a `models` entry and a `landmarks` entry
   placing it on the map, with the OSM buildings it `replaces`.
6. **Check it** with `bun run validate` and `bun test`.
7. **Open a pull request** with a contact sheet
   (`bun run sheet --branch-diff`).

Models made in Blender or elsewhere are welcome too, as long as they follow
the frame contract (+Y up, −Z north, metres, origin on the ground at the
anchor) and carry a licence the catalog can state.

## Generating models with Claude

Most models here were built by [Claude Code](https://claude.com/claude-code)
working from the briefs in [`docs/briefs/`](docs/briefs/). Run it from the
repo root.

**One landmark.** Paste this into Claude Code, with the blanks filled in:

```
Build a landmark model for this repo: <name>, <city>.
Id: <prefix>-<slug>. Location: <lng> <lat>.

Before writing any code, read STYLE.md (all of it, especially "Building a
famous or intricate model" and "Rejected looks"), docs/reference.md (frame
contract, elevation, what `replaces` must list) and docs/evidence.md.

1. Evidence. Fetch the OSM outline and every building:part inside it
   (python3 tools/osm.py buildings <lng> <lat> 150). Find published heights and dimensions. Get licensed
   photos from at least three sides plus one from above or far away
   (tools/photos.py commons "<name>" 10, Openverse, Mapillary). Use lidar
   (tools/lidar.py) where it covers the site. Open evidence only: never
   Google, Apple, Bing or any 3D tiles. Record every number's source in
   the generator's header comment, and mark what is estimated.
2. Before modelling, list the 3 to 5 features that make this landmark
   recognisable, each tied to the photo that shows it.
3. Write generators/<id>.ts with the kit (mesh.ts, palette.ts, plus
   coaster-kit.ts or bridge-kit.ts if relevant), using a similar existing
   generator as the template. Build massing first, render it with
   `bun run preview <id> preview/<id> <photo.png ...>`, and compare each
   render against a photo from the same direction. Fix proportions until
   the silhouette matches before adding any facade detail.
4. Add the identifying features, then the facade. Check the 200 and 80 px
   views; if a feature vanishes, make it bigger or bolder, not more
   detailed. Check the night view with --night. Stay within the budget in
   STYLE.md.
5. Add the models and landmarks entries to catalog.json, with `replaces`
   listing the outline and every building:part the model covers.
6. Run `bun run validate` and `bun test`.

Before calling it done, name every difference you can still see between
the renders and the photos, and fix them or list them. Don't say it looks
right without putting a render next to a photo. Finish by reporting the
sources, the estimates and any doubts.
```

**A whole city.** Start a Claude Code session and paste
[`docs/briefs/lead.md`](docs/briefs/lead.md), followed by the city, an id
prefix and a branch:

```
city: Boston
prefix: bos
branch: batch/boston
```

The lead picks 20 to 50 candidates and starts builder sub-agents. It
reviews every model and merges them, then opens a draft PR with contact
sheets. Expect a long session.

**A few models.** Paste [`docs/briefs/builder.md`](docs/briefs/builder.md)
and fill in its "Your assignment" block: `WT` is your checkout, `SCRATCH`
any directory outside the repo, and the landmarks to build. The
builder writes the generators and models and stages the placements. You
then add the placements to `catalog.json` and open the PR.

Either way, review the renders against photos before merging.
[`docs/workflow.md`](docs/workflow.md) is the full process the lead follows
and has the rules from past reviews.

### Before you start, read

- [`STYLE.md`](STYLE.md): the art style, the triangle budget, and what
  reviewers look for.
- [`docs/reference.md`](docs/reference.md): the catalog fields, the frame
  contract, elevation, bridges, what `replaces` must list, and how releases
  are built.
- [`docs/workflow.md`](docs/workflow.md): the full process for a batch of
  20 to 50 models, start to finish.

## Licence

Models and code are [CC0-1.0](LICENSE): public domain, no credit needed.
Placements are derived from OpenStreetMap and are ODbL-1.0,
© OpenStreetMap contributors.
