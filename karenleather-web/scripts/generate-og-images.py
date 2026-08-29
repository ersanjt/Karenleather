"""Build 1200×630 Open Graph JPEGs for WhatsApp / Telegram / Facebook / LinkedIn."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
UPLOADS = ROOT / "wp-content" / "uploads"
OUT = UPLOADS / "campaign" / "og"
W, H = 1200, 630


def cover(im: Image.Image, tw: int, th: int, fx: float = 0.5, fy: float = 0.5) -> Image.Image:
    im = im.convert("RGB")
    sw, sh = im.size
    scale = max(tw / sw, th / sh)
    nw, nh = round(sw * scale), round(sh * scale)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left = max(0, min(nw - tw, round((nw - tw) * fx)))
    top = max(0, min(nh - th, round((nh - th) * fy)))
    return im.crop((left, top, left + tw, top + th))


def save_og(src: Path, dest: Path, fy: float = 0.5) -> None:
    if not src.is_file():
        raise SystemExit(f"missing source: {src}")
    with Image.open(src) as im:
        out = cover(im, W, H, fy=fy)
    dest.parent.mkdir(parents=True, exist_ok=True)
    out.save(dest, "JPEG", quality=90, optimize=True, progressive=True, subsampling=1)
    if dest.stat().st_size < 120_000:
        out.save(dest, "JPEG", quality=95, optimize=True, progressive=True, subsampling=0)
    size = dest.stat().st_size
    print(f"{dest.name}: {out.size[0]}×{out.size[1]}  {size // 1024}KB  from {src.name}")


JOBS = [
    ("campaign/karen-tabriz/01-yellow-set-street.jpg", "og-home-1200x630.jpg", 0.48),
    ("campaign/karen-tabriz/02-yellow-bag-tabriz-dome.jpg", "og-about-1200x630.jpg", 0.42),
    ("campaign/lookbook-men/mens-loafers-ostrich-buckle.jpg", "og-men-1200x630.jpg", 0.38),
    ("2026/07/store-hotel/04-storefront.jpg", "og-contact-1200x630.jpg", 0.45),
    ("2026/07/ostrich-shoes/02-ostrich-sneaker-cognac.jpg", "og-wholesale-1200x630.jpg", 0.36),
    ("campaign/karen-tabriz/07-burgundy-circle-studio.jpg", "og-shop-1200x630.jpg", 0.42),
]


def main() -> None:
    for rel, name, fy in JOBS:
        save_og(UPLOADS / rel, OUT / name, fy=fy)


if __name__ == "__main__":
    main()
