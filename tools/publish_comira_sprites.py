"""Repair sprite alpha and publish the derived set to the runtime asset folder.

Two problems this fixes, both found after the AI polish pass:

1. The polished frames carry large *interior* regions at partial alpha (~45%
   opacity over roughly a fifth of the body — the satchel and scarf especially).
   The RGB underneath is correct; only the alpha is wrong, so the ground colour
   bleeds through and the satchel reads olive on grass and pink on magenta.
   Only pixels strictly inside the silhouette are forced opaque, leaving a 1px
   antialiased rim intact.

2. `docs/.../derived` is the authoring location, but the game loads from
   `public/assets/characters/comira`. Nothing kept them in step, so the polished
   art never reached the runtime at all. Publishing is now one command.
"""

from __future__ import annotations

import json
import os
import shutil

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DERIVED = os.path.join(ROOT, "docs/assets/characters/comira/sprites/derived")
RUNTIME = os.path.join(ROOT, "public/assets/characters/comira")

# Alpha at or above this inside the silhouette is treated as intended-solid art
# rather than a deliberately soft effect.
SOLID_THRESHOLD = 30


def repair_alpha(img: Image.Image) -> tuple[Image.Image, int]:
    """Force interior pixels opaque, preserving the outer antialiased rim."""
    a = np.array(img)
    alpha = a[..., 3]

    body = ndimage.binary_fill_holes(alpha > 0)
    interior = ndimage.binary_erosion(body, np.ones((3, 3)), iterations=1)
    target = interior & (alpha >= SOLID_THRESHOLD) & (alpha < 255)

    fixed = int(target.sum())
    a[..., 3] = np.where(target, 255, alpha)
    return Image.fromarray(a, "RGBA"), fixed


def main() -> None:
    with open(os.path.join(DERIVED, "frames.json"), encoding="utf-8") as f:
        meta = json.load(f)

    os.makedirs(RUNTIME, exist_ok=True)
    total = 0

    for anim in meta["animations"]:
        name = anim["name"]
        count = anim["frames"]
        frames = []
        for i in range(count):
            path = os.path.join(DERIVED, name, f"{name}_{i:02d}.png")
            img, fixed = repair_alpha(Image.open(path).convert("RGBA"))
            total += fixed
            img.save(path)
            frames.append(img)

        fw, fh = frames[0].size
        strip = Image.new("RGBA", (fw * count, fh), (0, 0, 0, 0))
        for i, img in enumerate(frames):
            strip.paste(img, (i * fw, 0))
        strip_path = os.path.join(DERIVED, anim["strip"])
        strip.save(strip_path)

        # Loop preview for eyeballing timing; not a runtime asset.
        preview_dir = os.path.join(DERIVED, "preview")
        os.makedirs(preview_dir, exist_ok=True)
        rate = anim.get("frame_rate", 10)
        flat = []
        for img in frames:
            bg = Image.new("RGB", img.size, (126, 168, 124))
            bg.paste(img, (0, 0), img)
            flat.append(bg.resize((img.width * 2, img.height * 2), Image.NEAREST))
        flat[0].save(
            os.path.join(preview_dir, f"{name}.gif"),
            save_all=True,
            append_images=flat[1:],
            duration=int(1000 / rate),
            loop=0,
        )

        shutil.copy2(strip_path, os.path.join(RUNTIME, anim["strip"]))
        print(f"  {name:18s} {count} frames  {fw}x{fh}  fps={rate}")

    shutil.copy2(
        os.path.join(DERIVED, "frames.json"), os.path.join(RUNTIME, "frames.json")
    )
    print(f"\nrepaired {total} translucent interior pixels")
    print(f"published {len(meta['animations'])} animations -> {RUNTIME}")


if __name__ == "__main__":
    main()
