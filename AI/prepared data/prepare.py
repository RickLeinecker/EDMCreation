import os
import sys
import uuid
import numpy as np
sys.path.insert(0,'..')
from drumvec import mid2drumvec, drumvec2mid
# EDM drums
for subdir, dirs, files  in os.walk('../datasets/edm'):
    for filename in files:
        filepath = subdir + os.sep + filename
        if filepath.endswith(".mid"):
            try:
                drums = mid2drumvec(filepath, 32, 24, loop=True)
                drums = np.split(drums, 2, axis=1)
                for i in range(2):
                    drumvec2mid(drums[i], f'edm/{i}_{filename}', 16, 24)
            except:
                pass


# groove drums
for subdir, dirs, files  in os.walk('../datasets/groove'):
    for filename in files:
        filepath = subdir + os.sep + filename
        if filepath.endswith(".mid"):
            try:
                drums = mid2drumvec(filepath, 64, 24, loop=True)
                drums = np.split(drums, 4, axis=1)
                for i in range(4):
                    drumvec2mid(drums[i], f'groove/{i}_{filename}', 16, 24)
            except:
                pass

# toontrack drums
for subdir, dirs, files  in os.walk('../datasets/toontrack'):
    for filename in files:
        filepath = subdir + os.sep + filename
        if filepath.endswith(".mid"):
            try:
                drums = mid2drumvec(filepath, 16, 24, loop=True)
                filename = str(uuid.uuid4())
                drumvec2mid(drums, 'toontrack/' + filename + '.mid', 16, 24)
            except:
                pass
