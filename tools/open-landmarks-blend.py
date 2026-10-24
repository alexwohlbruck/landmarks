"""Write each submission's source.blend from its detail.glb, for Open Landmarks.

    blender -b --factory-startup --python tools/open-landmarks-blend.py -- <collection dir> <id> [<id> ...]

Leaves collection/<id>/source.blend.gz beside the GLBs. The generator stays the
real source; this is the mesh, editable in Blender, as their format asks.
"""
import gzip
import os
import sys

import bpy

args = sys.argv[sys.argv.index('--') + 1:]
collection, ids = args[0], args[1:]
for landmark in ids:
    folder = os.path.join(collection, landmark)
    blend = os.path.join(folder, 'source.blend')
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=os.path.join(folder, 'detail.glb'))
    bpy.ops.wm.save_as_mainfile(filepath=blend, compress=False)
    with open(blend, 'rb') as raw, gzip.GzipFile(blend + '.gz', 'wb', compresslevel=9, mtime=0) as out:
        out.write(raw.read())
    os.remove(blend)
