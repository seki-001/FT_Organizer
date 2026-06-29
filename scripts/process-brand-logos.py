#!/usr/bin/env python3
"""Strip black backgrounds from brand logo uploads. Run after replacing source files."""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

BRAND = Path(__file__).resolve().parents[1] / 'public' / 'images' / 'brand'
SOURCE = BRAND / 'fto-logo-source.jpg'


def flood_remove_bg(im: Image.Image, tolerance: int = 28) -> Image.Image:
    im = im.convert('RGBA')
    w, h = im.size
    px = im.load()
    visited = [[False] * w for _ in range(h)]

    def is_bg(r: int, g: int, b: int) -> bool:
        return r < tolerance and g < tolerance and b < tolerance

    q: deque[tuple[int, int]] = deque()
    for x in range(w):
        q.extend([(x, 0), (x, h - 1)])
    for y in range(h):
        q.extend([(0, y), (w - 1, y)])

    while q:
        x, y = q.popleft()
        if x < 0 or x >= w or y < 0 or y >= h or visited[y][x]:
            continue
        r, g, b, _ = px[x, y]
        if not is_bg(r, g, b):
            continue
        visited[y][x] = True
        px[x, y] = (0, 0, 0, 0)
        q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])
    return im


def pad_crop(im: Image.Image, pad: int = 12) -> Image.Image:
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    padded = Image.new('RGBA', (im.width + pad * 2, im.height + pad * 2), (0, 0, 0, 0))
    padded.paste(im, (pad, pad), im)
    return padded


def lighten_dark_text(im: Image.Image) -> Image.Image:
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0 or max(r, g, b) >= 130:
                continue
            lum = min(255, int(200 + max(r, g, b) * 0.45))
            px[x, y] = (lum, lum, lum, a)
    return im


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f'Place source logo at {SOURCE}')
    src = Image.open(SOURCE)
    on_light = pad_crop(flood_remove_bg(src.copy()))
    on_dark = pad_crop(lighten_dark_text(flood_remove_bg(src.copy())))
    on_light.save(BRAND / 'fto-logo-on-light.png', 'PNG', optimize=True)
    on_dark.save(BRAND / 'fto-logo-on-dark.png', 'PNG', optimize=True)
    print('Wrote fto-logo-on-light.png and fto-logo-on-dark.png')


if __name__ == '__main__':
    main()
