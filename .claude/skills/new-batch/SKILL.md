---
name: new-batch
description: Lead a batch of 20 to 50 landmark models for one city or park, with builder sub-agents, ending in a draft pull request. Asks the user which city, then follows docs/briefs/lead.md.
argument-hint: "[city or park]"
---

# New batch

Lead one batch of landmarks. The user may have named the city already:

> $ARGUMENTS

## 1. Ask

If no city or park is named above, ask which one. Then work out the rest and
confirm it with the user in one message before starting:

- **Prefix**: a short lowercase id prefix (`bos`, `atl`, `disneyland`).
  Reuse an existing one from `catalog.json` if the city already has models,
  and say how many it has.
- **Branch**: `batch/<city>`.
- **Must-haves**: ask whether there are landmarks they definitely want, or
  any to leave out. Both are optional.
- **Scratch directory**: propose one outside the repo, e.g.
  `~/landmarks-scratch/<prefix>`.

## 2. Lead

Read `docs/briefs/lead.md` and follow it as your brief, with the city,
prefix, branch and scratch directory confirmed above. It points to
everything else to read, and to `docs/briefs/builder.md` for the
sub-agents you start.

Keep the user posted at each stage: the candidate list (let them edit it
before building), each model as it passes review, and the draft PR link at
the end.
