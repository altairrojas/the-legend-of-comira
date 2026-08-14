"""Derive transparent, anchor-consistent animation frames from the Comira
isometric master reference crops.

The ten reference crops are opaque WebP tiles cut out of a larger art-direction
sheet, with a paper-textured background and baked-in Spanish labels. Tiles 01-05
are contiguous vertical bands, so they are first restitched to recover the
cardinal walk rows that the tile boundaries had cut in half.

For each animation row we cut uniform cells (preserving each frame's position so
the motion arc survives), key the background by flood-fill from the panel
border, drop the painted ground-shadow ovals, then crop every frame in a row to
one shared bbox so the anchor stays stable across the cycle.
"""

import json
import os

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "docs/assets/characters/comira/reference/isometric-master/images")
OUT = os.path.join(ROOT, "docs/assets/characters/comira/sprites/derived")

STITCH = ["01_isometric_views.webp", "02_walk_side.webp", "03_walk_diagonal.webp",
          "04_expressions.webp", "05_actions.webp"]

# (source key, anim, y0, y1, x0, x1, frames, direction, tier)
ROWS = [
    # Diagonals - the isometric movement axes, highest resolution available.
    ("06_vfx_light.webp", "walk_down_right", 76, 162, 30, 312, 3, "SE", "primary"),
    ("06_vfx_light.webp", "walk_up_left", 204, 286, 26, 308, 3, "NW", "primary"),
    ("06_vfx_light.webp", "walk_up_right", 331, 414, 28, 306, 3, "NE", "primary"),
    # Actions.
    ("07_vfx_heal_and_shadow.webp", "sit", 80, 148, 20, 400, 4, "S", "primary"),
    ("07_vfx_heal_and_shadow.webp", "jump", 168, 268, [12, 94, 186, 288, 410], None, None, "S", "primary"),
    ("07_vfx_heal_and_shadow.webp", "attack_staff", 302, 389, 14, 414, 4, "S", "primary"),
    # Cardinals, recovered from the restitched sheet. Roughly half the pixel
    # height of the diagonals, so they are a secondary tier.
    ("__stitch__", "walk_north", 50, 103, 250, 488, 5, "N", "secondary"),
    ("__stitch__", "walk_west", 132, 201, 250, 488, 5, "W", "secondary"),
    ("__stitch__", "walk_east", 231, 299, 248, 491, 5, "E", "secondary"),
]

# Isometric SW is absent from the surviving crops (that row was truncated by the
# tile cut). Mirroring SE is the standard stopgap; it flips the satchel to the
# character's other side, so it is emitted separately and clearly marked.
MIRROR = [("walk_down_right", "walk_down_left", "SW")]


def build_stitch():
    ims = [Image.open(os.path.join(SRC, n)).convert("RGB") for n in STITCH]
    out = Image.new("RGB", (512, sum(i.height for i in ims)))
    y = 0
    for i in ims:
        out.paste(i, (0, y))
        y += i.height
    return out


def background_alpha(rgb):
    """Alpha from a border-seeded flood fill over light, desaturated paper."""
    a = rgb.astype(int)
    lum = a.mean(2)
    sat = a.max(2) - a.min(2)
    paper = (lum >= 198) & (sat <= 42)

    seed = np.zeros_like(paper)
    seed[0, :] = paper[0, :]
    seed[-1, :] = paper[-1, :]
    seed[:, 0] = paper[:, 0]
    seed[:, -1] = paper[:, -1]

    fg = ~ndimage.binary_propagation(seed, mask=paper)

    # Drop paper-texture specks that survived as isolated islands.
    lab, n = ndimage.label(fg)
    if n:
        for i, s in enumerate(ndimage.sum(fg, lab, range(1, n + 1)), start=1):
            if s < 24:
                fg[lab == i] = False
    fg = ndimage.binary_closing(fg, np.ones((3, 3)))

    # Drop painted ground-shadow ovals: detached, flat, desaturated grey blobs.
    # A baked shadow that does not track the character breaks the bottom-center
    # anchor and double-draws against a runtime shadow.
    lab, n = ndimage.label(fg)
    for i in range(1, n + 1):
        comp = lab == i
        yy, xx = np.where(comp)
        h = yy.max() - yy.min() + 1
        w = xx.max() - xx.min() + 1
        if w >= 2.2 * h and sat[comp].mean() <= 26 and 140 <= lum[comp].mean() <= 218:
            fg[comp] = False
            continue
        # Straight hairlines are card rules and panel borders, never character art.
        if (h <= 3 and w >= 15) or (w <= 3 and h >= 15):
            fg[comp] = False
    return repair_slits(fg)


def repair_slits(fg, reach=3):
    """Re-close thin cuts where a light card divider crossed the sprite.

    Panel rules are the same near-white as the paper, so the border flood fill
    runs straight down them and slices the character. Only pixels enclosed by
    foreground within `reach` on both axes are refilled, which repairs interior
    cuts while leaving genuine outer gaps (staff-to-body, VFX spacing) alone.
    """
    before = np.zeros_like(fg)
    after = np.zeros_like(fg)
    for d in range(1, reach + 1):
        before |= np.roll(fg, d, axis=1)
        after |= np.roll(fg, -d, axis=1)

    # Candidates: transparent pixels with sprite close by on both sides. Keep
    # only tall, thin, strongly vertical runs — that is a rule crossing the art,
    # whereas a real gap (between the legs, staff to body) is short or wide.
    cand = ~fg & before & after
    slit = np.zeros_like(fg)
    lab, n = ndimage.label(cand)
    for i in range(1, n + 1):
        comp = lab == i
        yy, xx = np.where(comp)
        h = yy.max() - yy.min() + 1
        w = xx.max() - xx.min() + 1
        if w <= 4 and h >= 15 and h >= 4 * w:
            slit |= comp
    return fg | slit, slit


def inpaint(rgb, slit, reach=4):
    """Replace repaired divider pixels with the nearest sprite colour.

    The refilled pixels still hold the rule's near-white, which would read as a
    bright streak across the scarf and satchel, so pull colour in horizontally.
    """
    out = rgb.copy()
    ys, xs = np.where(slit)
    h, w = slit.shape
    for y, x in zip(ys, xs):
        for d in range(1, reach + 1):
            a, b = x - d, x + d
            if a >= 0 and not slit[y, a]:
                out[y, x] = rgb[y, a]
                break
            if b < w and not slit[y, b]:
                out[y, x] = rgb[y, b]
                break
    return out


def save_strip(frames, path):
    fw, fh = frames[0].size
    sheet = Image.new("RGBA", (fw * len(frames), fh), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        sheet.paste(f, (i * fw, 0))
    sheet.save(path)


def main():
    os.makedirs(OUT, exist_ok=True)

    stitch = build_stitch()
    stitch.save(os.path.join(OUT, "_reconstructed_sheet.png"))

    panels = {"__stitch__": np.asarray(stitch)}
    for src in {r[0] for r in ROWS if r[0] != "__stitch__"}:
        panels[src] = np.asarray(Image.open(os.path.join(SRC, src)).convert("RGB"))
    keyed = {}
    for k, rgb in panels.items():
        fg, slit = background_alpha(rgb)
        keyed[k] = (inpaint(rgb, slit), fg)

    meta = {
        "derived_from": "docs/assets/characters/comira/reference/isometric-master",
        "pipeline": "restitch tiles 01-05 -> border flood-fill key -> drop baked "
                    "ground shadows -> uniform cells -> shared per-animation bbox",
        "anchor": "bottom-center",
        "animations": [],
    }
    produced = {}

    for src, name, y0, y1, x0, x1, n, direction, tier in ROWS:
        rgb, fg = keyed[src]
        # x0 may be an explicit list of cut positions for rows whose frames are
        # not evenly pitched; otherwise cells are uniform across x0..x1.
        if isinstance(x0, list):
            cuts = x0
        else:
            pitch = (x1 - x0) / n
            cuts = [int(round(x0 + i * pitch)) for i in range(n + 1)]
        n = len(cuts) - 1
        cells = [(rgb[y0:y1 + 1, cuts[i]:cuts[i + 1]],
                  fg[y0:y1 + 1, cuts[i]:cuts[i + 1]]) for i in range(n)]

        ys, xs = [], []
        for _, m in cells:
            if m.any():
                yy, xx = np.where(m)
                ys += [yy.min(), yy.max()]
                xs += [xx.min(), xx.max()]
        ty0, ty1, tx0, tx1 = min(ys), max(ys), min(xs), max(xs)

        adir = os.path.join(OUT, name)
        os.makedirs(adir, exist_ok=True)

        imgs = []
        for i, (c_rgb, c_fg) in enumerate(cells):
            cr = c_rgb[ty0:ty1 + 1, tx0:tx1 + 1]
            cf = c_fg[ty0:ty1 + 1, tx0:tx1 + 1]
            out = np.zeros((*cf.shape, 4), dtype=np.uint8)
            out[..., :3] = cr
            out[..., 3] = np.where(cf, 255, 0)
            img = Image.fromarray(out, "RGBA")
            img.save(os.path.join(adir, f"{name}_{i:02d}.png"))
            imgs.append(img)

        save_strip(imgs, os.path.join(OUT, f"{name}_strip.png"))
        produced[name] = imgs
        fw, fh = imgs[0].size
        meta["animations"].append({
            "name": name, "direction": direction, "tier": tier, "source": src,
            "frames": n, "frame_width": fw, "frame_height": fh,
            "strip": f"{name}_strip.png", "origin": "extracted",
        })
        print(f"  {name:18s} {n} frames  {fw}x{fh}  {tier:9s} <- {src}")

    for src_name, dst_name, direction in MIRROR:
        imgs = [f.transpose(Image.FLIP_LEFT_RIGHT) for f in produced[src_name]]
        adir = os.path.join(OUT, dst_name)
        os.makedirs(adir, exist_ok=True)
        for i, img in enumerate(imgs):
            img.save(os.path.join(adir, f"{dst_name}_{i:02d}.png"))
        save_strip(imgs, os.path.join(OUT, f"{dst_name}_strip.png"))
        fw, fh = imgs[0].size
        meta["animations"].append({
            "name": dst_name, "direction": direction, "tier": "stopgap",
            "source": f"mirror of {src_name}", "frames": len(imgs),
            "frame_width": fw, "frame_height": fh, "strip": f"{dst_name}_strip.png",
            "origin": "mirrored",
            "caveat": "Horizontal mirror flips the satchel to the wrong side; "
                      "replace with authored art.",
        })
        print(f"  {dst_name:18s} {len(imgs)} frames  {fw}x{fh}  stopgap   <- mirror {src_name}")

    with open(os.path.join(OUT, "frames.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)
    print(f"\nwrote {OUT}")


if __name__ == "__main__":
    main()
