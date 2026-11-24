import os
from PIL import Image
def best(d, i):
    sp, fp = os.path.join(d, i + '-scroll.png'), os.path.join(d, i + '-full.png')
    if not os.path.exists(sp): return fp
    if not os.path.exists(fp): return sp
    sh, fh = Image.open(sp).height, Image.open(fp).height
    return sp if sh >= 0.75 * min(fh, 10800) else fp
