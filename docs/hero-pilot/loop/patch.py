# Soften a small speckle row in the floor reflection that the upscaler sharpened into letter-like marks.
import glob, numpy as np
from PIL import Image, ImageFilter, ImageDraw
X0, Y0, X1, Y1 = 925, 908, 1015, 943      # region in 1920x1080 coordinates
PAD = 24
box = (X0 - PAD, Y0 - PAD, X1 + PAD, Y1 + PAD)
w, h = box[2] - box[0], box[3] - box[1]
mask = Image.new("L", (w, h), 0)
ImageDraw.Draw(mask).rounded_rectangle((PAD - 6, PAD - 6, w - PAD + 6, h - PAD + 6), radius=10, fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(8))
fs = sorted(glob.glob("fr/*.png"))
for f in fs:
    im = Image.open(f).convert("RGB")
    reg = im.crop(box)
    soft = reg.filter(ImageFilter.GaussianBlur(7))
    # keep a little grain so the patch does not read as a smooth blob
    a = np.asarray(soft).astype(np.float32)
    rng = np.random.default_rng(abs(hash(f)) % (2**32))
    a += rng.normal(0, 1.6, a.shape)
    soft = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    reg.paste(soft, (0, 0), mask)
    im.paste(reg, box[:2])
    im.save(f)
print("patched", len(fs))
