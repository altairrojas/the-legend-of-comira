# Comira isometric master — split reference assets

These files are derived from the approved Comira isometric master sheet.

## Storage convention
The approved master remains the canonical visual source. For repository storage and transport, each logical slice is stored as a high-quality WebP image encoded as Base64 text.

Every Base64 file must be decoded according to the metadata in `manifest.json`. The MIME type, file extension, source crop, dimensions, SHA-256, purpose, status and intended Phaser usage are recorded explicitly so there is no ambiguity about what the bytes represent.

## Important
These slices are **reference assets**, not final Phaser character sprites. They exist to avoid one giant master image and to make later production work precise.

The movable Comira character should eventually be built from dedicated directional animation assets/atlases derived from:
- isometric views;
- side walk;
- diagonal walk;
- action poses.

Expressions, VFX, UI and palette slices are separate concerns and should not be mixed into the locomotion atlas.

## Repository storage policy

- Canonical source: approved PNG master sheet.
- Derived repository slices: WebP quality 88.
- Transport/storage: Base64 text.
- Decoding rule: Base64-decode the text and save bytes using the extension and MIME type declared in `manifest.json`.
- Runtime rule: reference slices are **not** loaded as the moving player character. Production sprites/atlases must be authored from them first.

## Logical slices

1. `01_isometric_views` — canonical isometric facing/proportion reference.
2. `02_walk_side` — side locomotion reference.
3. `03_walk_diagonal` — diagonal/isometric locomotion reference.
4. `04_expressions` — face/expression vocabulary.
5. `05_actions` — action pose reference.
6. `06_vfx_light` — light-element effects.
7. `07_vfx_heal_and_shadow` — healing/contact-shadow effects.
8. `08_ui_icons` — Comira HUD/icon language.
9. `09_palette` — canonical color palette.
10. `10_sprite_technical_notes` — technical/layout notes from the approved master.
