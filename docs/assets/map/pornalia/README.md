# Pornalia map assets

This folder preserves and decomposes the approved Pornalia map reference for the **planning / asset-structuring phase**. No Phaser gameplay code is introduced here.

## Goals

1. Preserve the full original map as a master reference.
2. Split the map into smaller overlapping regional images.
3. Record every readable label and story note.
4. Define a future Phaser-friendly reconstruction plan without pretending these crops are final runtime tiles.
5. Keep map art separate from character art.

## Current files

```text
docs/assets/map/pornalia/
├── README.md
├── TRANSCRIPT.md
├── crop-manifest.json
├── landmark-manifest.json
└── reference/
    └── pornalia-map-master.jpg

public/assets/map/pornalia/
└── sections/
    ├── 01_northwest_lighthouse_port.jpg
    ├── 02_north_memory_tree.jpg
    ├── 03_northeast_forest_waterfall.jpg
    ├── 04_west_bakery_light_school.jpg
    ├── 05_center_plaza.jpg
    ├── 06_east_lumin_wind_school.jpg
    ├── 07_southwest_training_farms.jpg
    ├── 08_southeast_inn_healing.jpg
    ├── 09_south_gate_unknown_path.jpg
    ├── 10_legend.jpg
    ├── 11_about_pornalia.jpg
    └── 12_story_memory_panel.jpg
```

The section images overlap intentionally. This avoids cutting roads, rivers, stairs, cliffs, bridges or buildings exactly at crop boundaries.

## Important distinction: reference sections vs runtime assets

The current regional JPGs are **reference assets**, not yet production tilemaps.

For a real Phaser isometric RPG, the next art-production phase should decompose the reference into reusable runtime groups:

```text
public/assets/map/pornalia/
├── tilesets/
│   ├── ground/
│   ├── paths/
│   ├── cliffs/
│   ├── water/
│   ├── bridges/
│   ├── stairs/
│   └── vegetation/
├── buildings/
│   ├── lighthouse/
│   ├── bakery/
│   ├── lumin-shop/
│   ├── light-school/
│   ├── wind-school/
│   ├── inn/
│   ├── healing-hall/
│   └── workshop/
├── landmarks/
│   ├── memory-tree/
│   ├── sun-plaza/
│   ├── clear-waterfall/
│   ├── training-field/
│   ├── rainbow-farms/
│   └── south-gate/
├── props/
│   ├── lamps/
│   ├── fences/
│   ├── signs/
│   ├── banners/
│   ├── crates/
│   ├── flowers/
│   └── market-stalls/
└── tiled/
    ├── pornalia.tmx
    ├── pornalia-world.json
    └── tilesets/
```

Nothing in the tree above is claimed to exist yet. It is the intended production breakdown.

## Phaser reconstruction strategy

The map should be rebuilt in **Tiled** as an isometric map rather than displayed as one giant background image.

Recommended logical layers:

1. `ground`
2. `water`
3. `paths`
4. `cliffs`
5. `stairs`
6. `bridges`
7. `buildings_back`
8. `vegetation_back`
9. `collision`
10. `navigation`
11. `interactions`
12. `characters`
13. `buildings_front`
14. `vegetation_front`
15. `roof_occlusion`
16. `vfx`
17. `labels_debug`

The front/back split is important so Cova can correctly pass behind trees, houses and tall props.

## First test scene derived from this map

Do **not** rebuild all Pornalia first.

The first isometric test should use only a tiny region inspired by the center of the map:

- part of Plaza del Sol;
- one short path;
- one small house facade;
- one tree;
- one bridge or stair/elevation;
- one interactable sign;
- Cova.

This is enough to validate:
- isometric depth sorting;
- touch movement;
- collision;
- pathfinding if adopted;
- camera;
- occlusion;
- elevation;
- interaction prompts;
- performance on iPad.

Only after the test succeeds should the full Pornalia map be reconstructed.
