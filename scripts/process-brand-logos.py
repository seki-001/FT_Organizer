#!/usr/bin/env python3
"""Process brand logos into clean transparent PNGs for header + footer."""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

BRAND = Path(__file__).resolve().parents[1] / 'public' / 'images' / 'brand'
WORDMARK_SRC = BRAND / 'fto-logo-wordmark-source.png'
LOCKUP_SRC = BRAND / 'fto-logo-lockup-source.png'


def _resolve_src(preferred: Path) -> Path:
    if preferred.exists():
        return preferred
    alt = preferred.with_suffix('.jpg')
    if alt.exists():
        return alt
    raise SystemExit(f'Missing logo source: {preferred} or {alt}')


def flood_remove_bg(im: Image.Image, tolerance: int = 12) -> Image.Image:
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


def trim_transparent(im: Image.Image, alpha_threshold: int = 24) -> Image.Image:
    px = im.load()
    w, h = im.size
    min_x, min_y, max_x, max_y = w, h, 0, 0
    found = False
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > alpha_threshold:
                found = True
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
    if not found:
        return im
    return im.crop((min_x, min_y, max_x + 1, max_y + 1))


def crop_dense_band(im: Image.Image, axis: str = 'y', margin_ratio: float = 0.06) -> Image.Image:
    """Crop to the densest horizontal or vertical band (keeps logo text, trims stray hands)."""
    im = im.convert('RGBA')
    w, h = im.size
    px = im.load()

    if axis == 'y':
        density = []
        for y in range(h):
            density.append(sum(1 for x in range(w) if px[x, y][3] > 40))
        limit = w
    else:
        density = []
        for x in range(w):
            density.append(sum(1 for y in range(h) if px[x, y][3] > 40))
        limit = h

    peak = max(density) if density else 0
    if peak == 0:
        return im

    threshold = peak * 0.12
    indices = [i for i, d in enumerate(density) if d >= threshold]
    if not indices:
        return im

    start, end = indices[0], indices[-1]
    pad = max(2, int((end - start) * margin_ratio))
    start = max(0, start - pad)
    end = min(limit - 1, end + pad)

    if axis == 'y':
        return im.crop((0, start, w, end + 1))
    return im.crop((start, 0, end + 1, h))


def defringe(im: Image.Image, mode: str = 'light') -> Image.Image:
    """Remove white/dark halos from bad matting."""
    im = im.convert('RGBA')
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            lum = max(r, g, b)

            if mode == 'dark':
                # Footer: kill white/light halos on dark surfaces
                if a < 250 and lum > 160 and (r + g + b) / 3 > 140:
                    px[x, y] = (0, 0, 0, 0)
                    continue
                if a < 100 and lum < 70:
                    px[x, y] = (0, 0, 0, 0)
                elif a < 180 and lum < 90:
                    # Semi-transparent dark fringe
                    px[x, y] = (r, g, b, max(0, a - 40))
            else:
                # Header: kill gray/black fringe on light surfaces
                if a < 200 and lum < 55:
                    px[x, y] = (0, 0, 0, 0)
                    continue
                if a < 180 and lum > 210:
                    px[x, y] = (0, 0, 0, 0)

    return im


def pad(im: Image.Image, px: int = 6) -> Image.Image:
    out = Image.new('RGBA', (im.width + px * 2, im.height + px * 2), (0, 0, 0, 0))
    out.paste(im, (px, px), im)
    return out


def is_brand_red(r: int, g: int, b: int) -> bool:
    return r > 130 and r > g + 22 and r > b + 22


def flatten_for_light(im: Image.Image) -> Image.Image:
    """Flatten 3D shading into crisp dark text + solid red strokes."""
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if is_brand_red(r, g, b):
                if a < 200 or max(r, g, b) > 220:
                    px[x, y] = (196, 18, 32, min(255, a + 30))
                else:
                    px[x, y] = (196, 18, 32, a)
                continue
            lum = max(r, g, b)
            if lum > 200 and a < 160:
                px[x, y] = (0, 0, 0, 0)
            else:
                px[x, y] = (24, 24, 24, min(255, max(a, 220)))
    return im


def flatten_for_dark(im: Image.Image) -> Image.Image:
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            lum = max(r, g, b)
            if is_brand_red(r, g, b):
                if a < 200 or lum > 225:
                    px[x, y] = (214, 28, 44, min(255, a + 40))
                else:
                    px[x, y] = (214, 28, 44, a)
                continue
            if lum > 210 and a < 170:
                px[x, y] = (0, 0, 0, 0)
            elif lum < 200:
                px[x, y] = (240, 240, 240, min(255, max(a, 220)))
    return im


def resize_to_fit(im: Image.Image, max_w: int, max_h: int, allow_upscale: bool = True) -> Image.Image:
    ratio = min(max_w / im.width, max_h / im.height)
    if not allow_upscale:
        ratio = min(ratio, 1.0)
    if abs(ratio - 1.0) < 0.02:
        return im
    return im.resize(
        (max(1, int(im.width * ratio)), max(1, int(im.height * ratio))),
        Image.Resampling.LANCZOS,
    )


def crop_wordmark_for_header(im: Image.Image) -> Image.Image:
    """Wide text band for navbar — trims tall hand graphics above/below."""
    w, h = im.size
    return im.crop((int(w * 0.04), int(h * 0.34), int(w * 0.96), int(h * 0.70)))


def defringe_edges(im: Image.Image) -> Image.Image:
    """Remove only semi-transparent edge pixels (matting junk), keep solid logo strokes."""
    im = im.convert('RGBA')
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0 or a > 210:
                continue
            lum = max(r, g, b)
            if lum > 175 or lum < 35:
                px[x, y] = (0, 0, 0, 0)
    return im


def process_wordmark(src: Path) -> Image.Image:
    im = flood_remove_bg(Image.open(src))
    im = trim_transparent(im)
    im = crop_wordmark_for_header(im)
    im = flatten_for_light(im)
    im = defringe(im, mode='light')
    im = defringe_edges(im)
    im = pad(im, px=8)
    return resize_to_fit(im, max_w=494, max_h=176)


def process_lockup(src: Path) -> Image.Image:
    im = flood_remove_bg(Image.open(src))
    im = trim_transparent(im)
    im = flatten_for_dark(im)
    im = defringe(im, mode='dark')
    im = defringe_edges(im)
    im = pad(im, px=10)
    return resize_to_fit(im, max_w=360, max_h=320)


def main() -> None:
    on_light = process_wordmark(_resolve_src(WORDMARK_SRC))
    on_dark = process_lockup(_resolve_src(LOCKUP_SRC))

    on_light.save(BRAND / 'fto-logo-on-light.png', 'PNG', optimize=True)
    on_dark.save(BRAND / 'fto-logo-on-dark.png', 'PNG', optimize=True)

    print(f'on-light: {on_light.size[0]}x{on_light.size[1]}')
    print(f'on-dark:  {on_dark.size[0]}x{on_dark.size[1]}')


if __name__ == '__main__':
    main()
