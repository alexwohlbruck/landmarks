#!/usr/bin/env python3
"""Street-level photos pointing at a landmark, from Mapillary (CC BY-SA 4.0).

    python3 tools/mapillary.py <out-dir> <lon> <lat> [min-m=60] [max-m=400]

Searches a ring of small boxes around the point, keeps photos taken between
min and max metres away whose camera faces the point (within 20 degrees),
and saves the best one from each 30-degree side as <out-dir>/m<side>.jpg,
where <side> is the compass direction from the landmark to the camera. Also
writes every candidate to <out-dir>/cands.json.

Needs a Mapillary client access token: set MAPILLARY_TOKEN, or put it in
~/.config/landmark-refs/keys.json as {"mapillary": {"accessToken": "..."}}.
Never commit the token.

Mapillary 500s on large requests, so the search uses boxes of 0.0015 degrees
with at most 200 results each, and retries. Credit each photo used as
"Mapillary contributor <image id>, CC BY-SA 4.0" with its image id, printed
beside the file name.
"""
import json, math, os, sys, time, urllib.request

if len(sys.argv) < 4:
    sys.exit(__doc__)
out, lon, lat = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
dmin = float(sys.argv[4]) if len(sys.argv) > 4 else 60
dmax = float(sys.argv[5]) if len(sys.argv) > 5 else 400

token = os.environ.get('MAPILLARY_TOKEN')
if not token:
    keys = os.path.expanduser('~/.config/landmark-refs/keys.json')
    if not os.path.exists(keys):
        sys.exit('set MAPILLARY_TOKEN, or put the token in ~/.config/landmark-refs/keys.json')
    with open(keys) as f:
        token = json.load(f)['mapillary']['accessToken']

os.makedirs(out, exist_ok=True)
cands = []
S = 0.0015
for dx in range(-3, 3):
    for dy in range(-3, 3):
        x0, y0 = lon + dx * S, lat + dy * S
        url = ('https://graph.mapillary.com/images?fields=id,captured_at,computed_compass_angle,computed_geometry,thumb_1024_url'
               f'&bbox={x0:.5f},{y0:.5f},{x0 + S:.5f},{y0 + S:.5f}&limit=200&access_token={token}')
        for attempt in range(4):
            try:
                cands += json.load(urllib.request.urlopen(url, timeout=60)).get('data', [])
                break
            except Exception as e:
                print('box failed', type(e).__name__, getattr(e, 'code', ''))
                time.sleep(2 + attempt * 3)
        time.sleep(0.5)
with open(f'{out}/cands.json', 'w') as f:
    json.dump(cands, f)

k = math.cos(math.radians(lat)) * 111320
best = {}
for c in cands:
    g = (c.get('computed_geometry') or {}).get('coordinates')
    a = c.get('computed_compass_angle')
    if not g or a is None or not c.get('thumb_1024_url'):
        continue
    e, n = (lon - g[0]) * k, (lat - g[1]) * 110574
    d = math.hypot(e, n)
    if d < dmin or d > dmax:
        continue
    bearing = math.degrees(math.atan2(e, n)) % 360  # camera to landmark
    off = abs((a - bearing + 180) % 360 - 180)
    if off > 20:
        continue
    side = int(((bearing + 180) % 360) // 30)
    score = off + d / 40 - int(c.get('captured_at', 0)) / 1e12  # well aimed, close, recent
    if side not in best or score < best[side][0]:
        best[side] = (score, c, d, bearing)
for side, (_, c, d, b) in sorted(best.items()):
    name = f'{out}/m{side * 30:03d}.jpg'
    urllib.request.urlretrieve(c['thumb_1024_url'], name)
    print(name, f'{d:.0f} m away, looking {b:.0f}°', time.strftime('%Y-%m', time.gmtime(int(c['captured_at']) / 1000)), 'image', c['id'])
print(len(cands), 'candidates')
