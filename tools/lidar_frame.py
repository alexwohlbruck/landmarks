#!/usr/bin/env python3
"""Sample a lidar grid (from tools/lidar.py grid) in a model's own frame.

    python3 tools/lidar_frame.py <lidar.json> <bearing> <x0> <x1> <y0> <y1> <step> [dsm|gnd]

Prints a table of heights above ground_min, metres, over x0..x1 and y0..y1 in
the model's plan frame: +y points along the placement's bearing (the model's
"north", glTF -Z), +x is 90 degrees clockwise from that (glTF +X). The
lidar grid must be centred on the placement's anchor. -99 marks an empty cell.

Use it to read the height of each tier, crown or roof edge where the
generator draws it, rather than in the north-up grid.

As a module: `from lidar_frame import load; d, cell = load(path, bearing)`,
then `cell('dsm', x, y)` gives the height above ground_min or None.
"""
import json, math, sys


def load(path, bearing):
    with open(path) as f:
        d = json.load(f)
    n, res, half = d['n'], d['res'], d['half']
    b = math.radians(bearing)

    def cell(grid, x, y):
        east = x * math.cos(b) + y * math.sin(b)
        north = -x * math.sin(b) + y * math.cos(b)
        c, r = int((east + half) / res), int((half - north) / res)
        if 0 <= r < n and 0 <= c < n:
            v = d[grid][r][c]
            return None if v is None else v - d['ground_min']
        return None

    return d, cell


if __name__ == '__main__':
    if len(sys.argv) < 8:
        sys.exit(__doc__)
    d, cell = load(sys.argv[1], float(sys.argv[2]))
    x0, x1, y0, y1, st = map(float, sys.argv[3:8])
    grid = sys.argv[8] if len(sys.argv) > 8 else 'dsm'
    ys = [y1 - i * st for i in range(int((y1 - y0) / st) + 1)]
    xs = [x0 + i * st for i in range(int((x1 - x0) / st) + 1)]
    print('      ' + ''.join(f'{x:6.0f}' for x in xs))
    for y in ys:
        row = (cell(grid, x, y) for x in xs)
        print(f'{y:6.0f}' + ''.join(f'{(-99 if v is None else v):6.1f}' for v in row))
