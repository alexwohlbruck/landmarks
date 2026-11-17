#!/usr/bin/env python3
"""Merge two branches' catalog.json by id, for when batch branches conflict.

    python3 tools/merge-catalog.py <base.json> <ours.json> <theirs.json>

Writes the result over ours.json: every place, model and landmark from both
sides, sorted by id; where both have an id, ours wins. base is accepted for
git's merge-driver interface and unused.

catalog.json is kept sorted by id, so branches adding different landmarks
usually merge cleanly; this is for when two add neighbouring ids. To have
git use it, once per clone (.gitattributes already names the driver):

    git config merge.catalog.name "catalog.json, merged by id"
    git config merge.catalog.driver "python3 tools/merge-catalog.py %O %A %B"

By hand, mid-conflict:

    git show :1:catalog.json > /tmp/base.json; git show :2:catalog.json > /tmp/ours.json
    git show :3:catalog.json > /tmp/theirs.json
    python3 tools/merge-catalog.py /tmp/base.json /tmp/ours.json /tmp/theirs.json
    cp /tmp/ours.json catalog.json && bun run validate && git add catalog.json

During a rebase "ours" is the branch being rebased onto and "theirs" is your
commit; either way, check the result with `bun run validate`.
"""
import json, sys

if len(sys.argv) != 4:
    sys.exit(__doc__)
_, ours_path, theirs_path = sys.argv[1:4]
ours, theirs = (json.load(open(p)) for p in (ours_path, theirs_path))


LISTS = ('places', 'models', 'landmarks')


def union(key):
    merged = {x['id']: x for x in theirs.get(key, [])}
    merged.update({x['id']: x for x in ours.get(key, [])})
    return [merged[i] for i in sorted(merged)]


out = {**theirs, **{k: v for k, v in ours.items() if k not in LISTS}}
out.update({k: union(k) for k in LISTS if k in ours or k in theirs})
with open(ours_path, 'w') as f:
    f.write(json.dumps(out, indent=2, ensure_ascii=False) + '\n')
