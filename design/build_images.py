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

# Social card 1200x630: hero art + title
font_path = str(SRC / "PixelifySans.ttf")
card = Image.new("RGB", (1200, 630), MINT)
hero = Image.open(SRC / "hero.png").convert("RGB")
hero = hero.resize((1060, round(hero.height * 1060 / hero.width)), Image.LANCZOS)
card.paste(hero.crop((0, 60, 1060, 470)), (70, 205))
d = ImageDraw.Draw(card)
f1 = ImageFont.truetype(font_path, 76); f1.set_variation_by_name("Bold")
f2 = ImageFont.truetype(font_path, 38); f2.set_variation_by_name("Medium")
d.text((70, 48), "Get more from Codex", font=f1, fill=INK)
tw = d.textlength("from your OpenAI subscription", font=f2)
d.rectangle((62, 140, 78 + tw, 192), fill=GOLD)
d.text((70, 144), "from your OpenAI subscription", font=f2, fill=INK)
card.save(ROOT / "assets" / "og.png", optimize=True)
print("og + favicons done")
