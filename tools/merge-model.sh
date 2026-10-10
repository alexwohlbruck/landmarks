#!/usr/bin/env bash
# Commit one finished model: its generator, its GLB and its catalog entries.
#
#   tools/merge-model.sh <placement.json> "<commit message>"
#
# Run by the batch lead, in the batch worktree, once per accepted model, so
# each model is its own commit. placement.json is what the builder wrote:
#
#   { "model": { "id": "<id>", "license": "CC0-1.0", "author": "...", ... },
#     "landmark": { "id": "<id>", "name": "...", "model": "<id>", "lng": 0, "lat": 0, ... } }
#
# or "landmarks": [ ... ] for a model placed more than once (a bridge's towers).
#
# It regenerates models/<id>.glb from the generator, then puts the entries in
# catalog.json: an id already there is replaced where it stands (a rework), a
# new one is appended. Then it validates, typechecks the generator and
# commits generators/<id>.ts, models/<id>.glb and catalog.json. On any
# failure catalog.json is put back and nothing is committed.
#
# It refuses a generator that imports a helper from another generator that
# isn't committed yet: commit the helper's own model first, or the earlier
# commit doesn't build on its own.
set -euo pipefail
[ $# -eq 2 ] || { sed -n '2,20p' "$0"; exit 2; }
placement=$(realpath "$1"); msg=$2
cd "$(dirname "$0")/.."

id=$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["model"]["id"])' "$placement")
gen=generators/$id.ts
[ -f "$gen" ] || { echo "no $gen"; exit 1; }

# Helpers imported from other generators must already be in HEAD.
for dep in $(grep -oE "from '\./[a-z0-9-]+'" "$gen" | sed -E "s/from '\.\/(.*)'/\1/" | sort -u); do
  git cat-file -e "HEAD:generators/$dep.ts" 2>/dev/null || {
    echo "$gen imports generators/$dep.ts, which isn't committed yet. Merge that model first."; exit 1; }
done

bun "$gen" >/dev/null

python3 - "$placement" <<'PY'
import json, sys
p = json.load(open(sys.argv[1]))
m = p['model']; ls = p.get('landmarks') or [p['landmark']]
m['file'] = f'models/{m["id"]}.glb'; m['source'] = f'generators/{m["id"]}.ts'
c = json.load(open('catalog.json'))
def upsert(rows, new):
    at = {r['id']: i for i, r in enumerate(rows)}
    for n in new:
        if n['id'] in at: rows[at[n['id']]] = n
        else: rows.append(n)
upsert(c['models'], [m]); upsert(c['landmarks'], ls)
open('catalog.json', 'w').write(json.dumps(c, indent=2, ensure_ascii=False) + '\n')
PY

log=$(mktemp)
trap 'rm -f "$log"' EXIT
bun run validate >"$log" 2>&1 || { cat "$log"; git checkout -- catalog.json; exit 1; }
if bun x tsc --noEmit 2>&1 | grep -F "$gen"; then echo "typecheck errors in $gen"; git checkout -- catalog.json; exit 1; fi

git add "$gen" "models/$id.glb" catalog.json
git commit -qm "$msg"
git log --oneline -1
git show --stat HEAD | tail -4
