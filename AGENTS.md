# Agents

Instructions for AI coding agents working in this repo (Claude Code, Codex,
Cursor, Copilot, Gemini CLI and others).

Recommended models: Astra, Claude Opus 5.5 or newer, or Claude Fable 5.1 or
newer. Building a landmark means judging renders against photos, and other
models tend to stop before the model matches. If you are not one of these,
tell the user so before starting.

## Tasks

- **Build one landmark**: follow
  [`.claude/skills/new-landmark/SKILL.md`](.claude/skills/new-landmark/SKILL.md).
  If the user hasn't said which landmark, ask.
- **Build a batch for a city or park**: follow
  [`.claude/skills/new-batch/SKILL.md`](.claude/skills/new-batch/SKILL.md).
  If the user hasn't said which city, ask.

In Claude Code these are the `/new-landmark` and `/new-batch` commands.
Anywhere else, read the file and follow it step by step. Ignore the
`$ARGUMENTS` line; use what the user asked for.

## Read first

- [`STYLE.md`](STYLE.md): the art style, the budget, and how a model is
  checked.
- [`docs/reference.md`](docs/reference.md): the catalog, the frame contract
  (+Y up, -Z north, +X east, metres, origin on the ground at the anchor),
  and what `replaces` must list.
- [`docs/evidence.md`](docs/evidence.md): what sources may be used.

## Rules

- **Open evidence only.** Never use Google, Apple, Bing or Mapbox imagery,
  Street View, or any 3D tiles, not even as a rough reference. A model
  shaped against them can't be published.
- **Start from OSM and photos.** Fetch the OSM outline and parts and
  licensed photos from several sides before writing a generator.
- **One building per model.** A model is one freestanding building or
  structure. Buildings that stand apart, joined only by a tunnel, a people
  mover or nothing (airport concourses and satellites, campus halls, a
  terminal and its car park) each get their own model, id and catalog
  entry, with their own anchor and `replaces`. Wings, piers and links that
  meet above ground stay in one model. Several models may share one
  generator. Never put two separate buildings in one model to save work or
  placements.
- **Compare renders with photos.** Render with `bun run preview` and put
  each view beside a photo from the same direction. Don't call a model done
  until you have named what still differs.
- **Contact sheets, always.** Every pull request that adds or changes a
  model carries contact sheets, made with
  `bun run sheet --terrain --branch-diff --out review/<batch>` (plus
  before-and-after sheets for reworks), committed and embedded in the PR
  body as `docs/reference.md` describes. Whenever you hand model work back,
  tell the user to generate the contact sheets and give them that exact
  command, even if you have already made them, and say where they go. This
  applies to reviewing someone else's PR too: if it has no sheets, tell
  the user to generate them before reviewing it. Never open, approve or
  hand back a model PR without them.
- **Credit the author.** Ask who to credit as a model's creator and their
  GitHub username (or GitLab, Codeberg or Bitbucket username, or profile
  URL) unless the user has said. Never guess one.
- Bun runs everything: `bun install` once, then `bun run validate` and
  `bun test` before handing back. Locally both check only the models your
  branch adds or changes (plus everything when `src/` or `test/` changed);
  CI checks every model. Use `--all` or `LANDMARKS_ALL=1` to check all.
