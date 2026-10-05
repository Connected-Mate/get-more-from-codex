#!/usr/bin/env python3
"""Rebuild optimized site images from design/source/*.png.

Outputs assets/img/<name>-<width>.{avif,webp}, favicons and the social card.
Run from the repo root:  python3 design/build_images.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "design" / "source"
OUT = ROOT / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)

MINT = Image.open(SRC / "hero.png").convert("RGB").getpixel((6, 6))
INK = (27, 32, 44)
GOLD = (232, 176, 52)

# name -> (source file, crop box or None, widths)
JOBS = {
    "hero": ("hero.png", None, [800, 1200, 1774]),
    "mascot": ("mascot.png", (120, 120, 1254 - 60, 1254 - 120), [360, 720]),
    "voice": ("voice-bot.png", (140, 140, 1254 - 140, 1254 - 120), [360, 720]),
    # 16:9 crops; story-1 crop also removes a stray mark bottom-right
    "story-1": ("story-1.png", (0, 0, 1600, 900), [640, 1000, 1600]),
    "story-2": ("story-2.png", (36, 20, 1636, 920), [640, 1000, 1600]),
    "story-3": ("story-3.png", (36, 20, 1636, 920), [640, 1000, 1600]),
}

def save_variants(im, name, widths):
    for w in widths:
        h = round(im.height * w / im.width)
        r = im if w == im.width else im.resize((w, h), Image.LANCZOS)
        r.save(OUT / f"{name}-{w}.webp", "WEBP", quality=82, method=6)
        r.save(OUT / f"{name}-{w}.avif", "AVIF", quality=60)
    print(name, im.size, widths)

for name, (fn, box, widths) in JOBS.items():
    im = Image.open(SRC / fn).convert("RGB")
    if box:
        im = im.crop(box)
    save_variants(im, name, widths)

# Favicons: crop the mascot's head (screen face + beret)
m = Image.open(SRC / "mascot.png").convert("RGBA")
head = m.crop((270, 160, 790, 680))
for s, fn in [(32, "favicon-32.png"), (180, "apple-touch-icon.png"), (512, "icon-512.png")]:
    head.resize((s, s), Image.LANCZOS).save(ROOT / "assets" / fn, optimize=True)

# Social card 1200x630: dusk horizon gradient, framed hero art, DM Sans title
def horizon(w, h):
    stops = [(0.0, (143, 63, 18)), (0.22, (165, 80, 42)), (0.6, (74, 63, 120)), (1.0, (28, 58, 158))]
    row = Image.new("RGB", (w, 1))
    for x in range(w):
        t = x / (w - 1)
        for (a, ca), (b, cb) in zip(stops, stops[1:]):
            if a <= t <= b:
                k = (t - a) / (b - a)
                row.putpixel((x, 0), tuple(round(ca[i] + (cb[i] - ca[i]) * k) for i in range(3)))
                break
    img = row.resize((w, h))
    fade = Image.new("L", (1, h))
    for y in range(h):
        fade.putpixel((0, y), round(255 * max(0.0, (y / h - 0.55) / 0.45)))
    img.paste(Image.new("RGB", (w, h), (10, 10, 10)), (0, 0), fade.resize((w, h)))
    return img

def rounded(im, r):
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, im.width - 1, im.height - 1), r, fill=255)
    return mask

card = horizon(1200, 630)
dm = str(SRC / "DMSans.ttf")
f1 = ImageFont.truetype(dm, 74); f1.set_variation_by_axes([40, 500])
f2 = ImageFont.truetype(dm, 34); f2.set_variation_by_axes([24, 500])
d = ImageDraw.Draw(card)
d.text((64, 70), "Get more", font=f1, fill=(255, 255, 255))
d.text((64, 148), "from Codex", font=f1, fill=(255, 255, 255))
d.text((66, 248), "from your OpenAI subscription", font=f2, fill=(232, 228, 236))
art = Image.open(SRC / "hero.png").convert("RGB")
art = art.resize((620, round(art.height * 620 / art.width)), Image.LANCZOS)
card.paste(art, (530, 296), rounded(art, 24))
card.save(ROOT / "assets" / "og.png", optimize=True)
print("og + favicons done")
