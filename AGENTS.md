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
- **Compare renders with photos.** Render with `bun run preview` and put
  each view beside a photo from the same direction. Don't call a model done
  until you have named what still differs.
- Bun runs everything: `bun install` once, then `bun run validate` and
  `bun test` before handing back.
