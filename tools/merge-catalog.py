#!/usr/bin/env python3
"""Merge two branches' catalog.json by id, for when batch branches conflict.

    python3 tools/merge-catalog.py <base.json> <ours.json> <theirs.json>

Writes the result over ours.json: every model and landmark from both sides,
theirs first in their order, then ours that theirs lacks; where both have an
id, ours wins. base is accepted for git's merge-driver interface and unused.

Two batches both append to catalog.json, so git sees every rebase or merge
between them as a conflict at the end of each list. To have git use this
instead, once per clone (.gitattributes already names the driver):

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


def union(key):
    merged = {x['id']: x for x in theirs[key]}
    merged.update({x['id']: x for x in ours[key]})
    order = [x['id'] for x in theirs[key]]
    order += [x['id'] for x in ours[key] if x['id'] not in set(order)]
    return [merged[i] for i in order]


out = {**theirs, **{k: v for k, v in ours.items() if k not in ('models', 'landmarks')}, 'models': union('models'), 'landmarks': union('landmarks')}
with open(ours_path, 'w') as f:
    f.write(json.dumps(out, indent=2, ensure_ascii=False) + '\n')
