# Comira isometric master — split reference assets

These files are derived from the approved Comira isometric master sheet.

## Storage convention
Each logical slice exists in two forms:
- `png/`: human-review preview.
- `base64/`: the exact PNG bytes encoded as Base64 text for repository transport/storage.

Every Base64 file represents `image/png`. The metadata in `manifest.json` records dimensions, crop coordinates, SHA-256, intended use, and whether the slice is suitable for runtime use.

## Important
These slices are **reference assets**, not final Phaser character sprites. They exist to avoid one giant master image and to make later production work precise.

The movable Comira character should eventually be built from dedicated directional animation assets/atlases derived from:
- isometric views,
- side walk,
- diagonal walk,
- actions.

Expressions, VFX, UI and palette slices are separate concerns and should not be mixed into the locomotion atlas.
