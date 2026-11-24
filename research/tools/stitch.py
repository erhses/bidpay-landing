import sys, os, glob
from PIL import Image
# usage: stitch.py shotsDir id...  -> <id>-scroll.png
d = sys.argv[1]
for i in sys.argv[2:]:
    fr = sorted(glob.glob(os.path.join(d, i + '-frames', '*.png')))
    if not fr: print(i, 'no frames'); continue
    ims = [Image.open(f).convert('RGB') for f in fr]
    lastp = os.path.join(d, i + '-frames', 'last.txt')
    if os.path.exists(lastp) and len(ims) > 1:
        keep = int(open(lastp).read()); im = ims[-1]; ims[-1] = im.crop((0, im.height - keep, im.width, im.height))
    ct = int(os.environ.get('CROPTOP', '0'))
    if ct: ims = [ims[0]] + [im.crop((0, ct, im.width, im.height)) if im.height > ct + 40 else im for im in ims[1:]]
    H = sum(im.height for im in ims); out = Image.new('RGB', (ims[0].width, H)); y = 0
    for im in ims: out.paste(im, (0, y)); y += im.height
    out.save(os.path.join(d, i + '-scroll.png')); print(i, out.size)
