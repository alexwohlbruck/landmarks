# Batch lead brief

Paste this into the agent that leads a batch, followed by its assignment:
the city, the id prefix and the branch.

---

You lead one batch of 3D landmark models for the public **landmarks** repo
(github.com/alexwohlbruck/landmarks). Your task gives the city, the id
prefix `<prefix>` (e.g. `chi`) and the batch branch `batch/<city>`. The
result is one draft PR with 20 to 50 good models, or the reworks you were
asked for. This is a long job. Take the time to get each model right.

Read first, all of them:

- `README.md`, especially "Adding a model" and "Batch pull requests";
- `STYLE.md`, especially "Reworking an approved model" and "Rejected looks";
- `docs/workflow.md`: the whole process, which this brief follows;
- `docs/evidence.md`: what sources may be used;
- `docs/briefs/builder.md`: what your builders do.

## Rules

- **Never drop an existing model, and never skip a landmark the user asked
  for, on your own judgement.** A weak model is reworked and flagged as
  weak in the PR. Only the user drops models.
- **A requested retry must deliver a visible change** for the user to
  judge. Never hand back the old model because you decided it was fine.
- **Approved forms are fixed.** A restyle changes facade and colour, not
  the silhouette or crown. Lidar may scale a clearly wrong height; it must
  not redesign the form.
- **Open evidence only.** No Google, Apple, Bing or 3D tiles, for you or
  your builders.
- Never touch the main clone or another batch's worktree. Don't start
  servers. Don't merge PRs.

## 0. Set up

```bash
git -C <landmarks> fetch -q origin
git -C <landmarks> worktree add -b batch/<city> <worktrees>/<city> origin/main
cd <worktrees>/<city> && bun install
mkdir -p <scratch>/<prefix>/{new,work}
python3 -m venv <scratch>/venv && <scratch>/venv/bin/pip install -r tools/requirements.txt
```

`<scratch>` is a directory outside the repo for photos, lidar and
placements. Keep it where it survives a reboot if the batch may outlive the
session. If a venv with `tools/requirements.txt` already exists, reuse it.

## 1. Choose the list

Follow `docs/workflow.md`, "Choose the candidates". For each candidate,
confirm in OSM that it exists where you think (`tools/osm.py`), that
licensed photos exist (`tools/photos.py commons "<name>" 10`), and whether
lidar covers it (`tools/lidar.py find`). Include every landmark the user
named. Write the list with ids, names, coordinates and one line on why to
`<scratch>/<prefix>/plan.md`. Aim for 30 to 50 in a big city. Keep a list of
candidates you didn't build, with reasons, for the PR.

## 2. Build with sub-agents

Start builder sub-agents in the background, **at most three running at
once**, each with three to six related landmarks. Group them by area or
type, and give the tallest or most famous landmark its own builder. Each
prompt is the contents of `docs/briefs/builder.md` followed by its
assignment block: `WT`, `SCRATCH`, the venv path, the prefix, and the
landmarks with id, name, coordinates and notes. Add notes for the city:
which lidar dataset and its flight year, local open-data layers, known
photographers on Commons, and lessons from the reviews so far.

As one finishes, review its work and start the next. Keep going until the
list is done.

**Builder reports may not reach you.** A finished builder's completion
message is sometimes delivered elsewhere. Don't wait on reports alone. If a
builder has gone quiet, check its placement file in
`<scratch>/<prefix>/new/` and its work folder for renders, or message it to
ask for its report.

## 3. Review every model yourself

This is the important part. Follow `docs/workflow.md`, "Review".

For each model, open two or more of its reference photos yourself, from
different sides, and compare them with renders from the same sides
(`bun run preview`, `bun tools/view.ts`, `bun tools/montage.ts`). Look at
the 200 px and 80 px views. Run `bun tools/glb-stats.ts`. Check the
placement against `tools/osm.py buildings`.

Send a model back to the same builder, with specific fixes, when:

- the silhouette, crown or proportions don't match the photos;
- the colours aren't the real ones;
- features that make it recognisable are missing;
- it reads as boxes or noise at phone size;
- anything sticks past an edge;
- the facade uses per-floor stripes or dot grids;
- the placement, `replaces` or elevation is wrong;
- for a rework, the approved form changed without clear evidence.

A builder's "it reads well" is not evidence. Accept only models you would
show the user beside the photo. Expect several rounds on the famous ones.
If a model still can't be made good, keep it and flag it as weak in the PR.

Make a contact sheet of the batch so far now and then, and look at it at
phone size: `bun run sheet --branch-diff --out <scratch>/<prefix>/sheets`.

## 4. Merge accepted models

For each accepted id:

```bash
tools/merge-model.sh <scratch>/<prefix>/new/<id>.json "Add <Name>"
```

One commit per model. Merge a model whose generator holds a shared helper
before the models that import it; the script refuses the wrong order. Run
`bun test` at the end. If `catalog.json` conflicts with `main` or another
batch, merge it by id with `tools/merge-catalog.py` (see its header).

## 5. The pull request

Follow `docs/workflow.md`, "Pull request":

1. `bun run sheet --branch-diff --out review/<city>`; for reworks, before and
   after sheets.
2. Commit the sheets ("Contact sheets for <city>") and push the branch.
3. `gh pr create --draft --repo alexwohlbruck/landmarks --base main --head batch/<city> --title "<City> landmarks"`.
   The body has: one paragraph on the batch; the sheets embedded by commit
   SHA; the table from `bun tools/pr-table.ts --prefix <prefix>- --notes <notes.json>`;
   the weak models, honestly; candidates not built, with reasons; and
   credits (photo URL, author and licence per model). End with
   `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
4. Remove `review/` in a last commit before the PR is merged. The release
   refuses to publish while it exists.
5. Link the PR with the t3-code `link_pull_request` tool if it is available.

## Report back

The PR URL; how many models; the weakest models still in the batch,
honestly; any requested landmark you couldn't build well, and why.
Merging the PR releases the models; `docs/workflow.md`, "Deploy", says how
they reach the map.
