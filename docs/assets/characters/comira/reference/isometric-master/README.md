# Comira isometric master — extracted reference assets

This directory contains the ten **approved Comira reference slices** extracted from the reviewed isometric master package.

## Status

- Character: **Comira**
- Role: canonical art-direction / production reference
- Repository image format: **WebP**
- Runtime status: **reference only — not final Phaser sprites**

## Structure

```text
isometric-master/
├── README.md
├── manifest.json
└── images/
    ├── 01_isometric_views.webp
    ├── 02_walk_side.webp
    ├── 03_walk_diagonal.webp
    ├── 04_expressions.webp
    ├── 05_actions.webp
    ├── 06_vfx_light.webp
    ├── 07_vfx_heal_and_shadow.webp
    ├── 08_ui_icons.webp
    ├── 09_palette.webp
    └── 10_sprite_technical_notes.webp
```

## What each slice is for

- **01 isometric views:** proportions, silhouette, facing and equipment placement.
- **02 walk side:** side locomotion reference.
- **03 walk diagonal:** diagonal/isometric locomotion reference.
- **04 expressions:** facial-expression vocabulary only.
- **05 actions:** action poses and gameplay-pose language.
- **06 light VFX:** light attack / crystal effect language.
- **07 heal and shadow:** healing effects and contact-shadow language.
- **08 UI icons:** Comira-specific HUD and iconography reference.
- **09 palette:** canonical color reference.
- **10 technical notes:** sprite-production guidance from the master sheet.

`manifest.json` is the machine-readable source for MIME type, dimensions, byte size, SHA-256, purpose and runtime status.

## Base64 policy

Base64 remains an acceptable **transport/fallback encoding** when a connector cannot write image bytes directly. Once the archive was extracted successfully, the individual WebP files became the canonical repository copies.

We intentionally do **not** keep duplicate full Base64 copies beside the WebP files because that would add roughly one-third more data and create two competing sources of truth. If Base64 is needed later, it should be generated deterministically from these verified WebP files.

## Phaser production rule

Do **not** use these ten reference sheets directly as the movable Phaser character.

Before gameplay implementation, derive dedicated production sprite sheets / texture atlases with:

- transparent, consistent frame bounds;
- stable origins / anchors;
- explicit directional naming;
- consistent frame timing;
- locomotion separated from expressions, VFX and UI;
- dimensions chosen for the fixed isometric camera.

The main sources for future movement art are **01, 02, 03 and 05**. The other slices remain separate art concerns.
