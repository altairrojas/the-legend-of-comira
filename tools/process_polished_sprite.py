"""Fit an AI-polished sprite strip back into the runtime frame grid."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def alpha_bbox(image: Image.Image, threshold: int = 8) -> tuple[int, int, int, int] | None:
    alpha = image.getchannel("A").point(lambda value: 255 if value > threshold else 0)
    return alpha.getbbox()


def process_strip(
    source: Path,
    output: Path,
    frame_count: int,
    frame_width: int,
    frame_height: int,
    frame_dir: Path | None,
) -> None:
    image = Image.open(source).convert("RGBA")
    if image.width % frame_count:
        raise ValueError(f"{source} width is not divisible by {frame_count}")

    source_width = image.width // frame_count
    cells = [
        image.crop((index * source_width, 0, (index + 1) * source_width, image.height))
        for index in range(frame_count)
    ]
    boxes = [box for cell in cells if (box := alpha_bbox(cell)) is not None]
    if len(boxes) != frame_count:
        raise ValueError(f"{source} has one or more empty animation cells")

    left = max(0, min(box[0] for box in boxes) - 4)
    top = max(0, min(box[1] for box in boxes) - 4)
    right = min(source_width, max(box[2] for box in boxes) + 4)
    bottom = min(image.height, max(box[3] for box in boxes) + 4)

    crop_width = right - left
    crop_height = bottom - top
    scale = min((frame_width - 2) / crop_width, (frame_height - 1) / crop_height)
    resized_width = max(1, round(crop_width * scale))
    resized_height = max(1, round(crop_height * scale))

    frames: list[Image.Image] = []
    for cell in cells:
        crop = cell.crop((left, top, right, bottom))
        sprite = crop.resize((resized_width, resized_height), Image.Resampling.LANCZOS)
        frame = Image.new("RGBA", (frame_width, frame_height))
        x = (frame_width - resized_width) // 2
        y = frame_height - resized_height
        frame.alpha_composite(sprite, (x, y))
        frames.append(frame)

    strip = Image.new("RGBA", (frame_width * frame_count, frame_height))
    for index, frame in enumerate(frames):
        strip.alpha_composite(frame, (index * frame_width, 0))

    output.parent.mkdir(parents=True, exist_ok=True)
    strip.save(output, optimize=True)
    if frame_dir is not None:
        frame_dir.mkdir(parents=True, exist_ok=True)
        stem = output.stem.removesuffix("_strip")
        for index, frame in enumerate(frames):
            frame.save(frame_dir / f"{stem}_{index:02d}.png", optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--frames", type=int, required=True)
    parser.add_argument("--frame-width", type=int, required=True)
    parser.add_argument("--frame-height", type=int, required=True)
    parser.add_argument("--frame-dir", type=Path)
    args = parser.parse_args()
    process_strip(
        args.source,
        args.output,
        args.frames,
        args.frame_width,
        args.frame_height,
        args.frame_dir,
    )


if __name__ == "__main__":
    main()
