# Pornalia map assets

This folder preserves and decomposes the approved Pornalia map reference for the **planning / asset-structuring phase**. No Phaser gameplay code is introduced here.

## World hierarchy

**Coral** is the world in which *The Legend of Comira* takes place. Coral contains **multiple towns/villages and regions**.

**Pornalia is not the whole world.** Pornalia is one village inside Coral. It is the **initial village** and the location selected for the first isometric proof/test scene.

Canonical hierarchy:

```text
Coral (world)
└── Pornalia (initial village / current test-scene focus)
    ├── Plaza del Sol
    ├── schools
    ├── shops and services
    ├── port and lighthouse
    ├── farms and training area
    ├── natural landmarks
    └── Puerta Sur → routes toward other parts of Coral
```

Other Coral villages and regions will be documented separately when they are defined. We should not invent them during the Pornalia planning phase.

## Goals

1. Preserve the full original Pornalia map as a master reference.
2. Split the village map into smaller overlapping regional images.
3. Record every readable label and story note.
4. Define a future Phaser-friendly reconstruction plan without pretending these crops are final runtime tiles.
5. Keep village/map art separate from character art.
6. Keep the asset hierarchy ready for additional Coral villages without mixing their files with Pornalia.

## Asset organization

The long-term hierarchy should distinguish the **world** from its individual **villages/regions**:

```text
public/assets/worlds/coral/
├── shared/                     # future assets genuinely shared across Coral
└── villages/
    └── pornalia/               # first village and proof-scene location
        ├── reference/
        ├── sections/
        ├── tilesets/
        ├── buildings/
        ├── landmarks/
        ├── props/
        └── tiled/
```

The existing Pornalia planning/reference files remain under `docs/assets/map/pornalia/` for now. When runtime assets are produced, they should follow the Coral → villages → Pornalia hierarchy above rather than treating Pornalia as a world.

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

For the Phaser isometric RPG, a later art-production phase should decompose Pornalia into reusable runtime groups such as ground, paths, cliffs, water, bridges, stairs, vegetation, buildings, landmarks and props. These runtime assets belong to Pornalia's village folder inside the Coral world hierarchy.

Nothing in that future structure is claimed to exist yet.

## Phaser reconstruction strategy

Pornalia should eventually be rebuilt in **Tiled** as an isometric village map rather than displayed as one giant background image.

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

## First test scene derived from Pornalia

The first proof scene is deliberately located in **Pornalia**, because Pornalia is Coral's initial village and our current development focus. It is only a technical slice of this village, not a representation of the entire world of Coral.

Do **not** rebuild all Pornalia first.

The future isometric test should use only a tiny region inspired by the center of the map:

- part of Plaza del Sol;
- one short path;
- one small house facade;
- one tree;
- one bridge or stair/elevation;
- one interactable sign;
- Cova.

This is enough to validate isometric depth sorting, touch movement, collision, pathfinding if adopted, camera, occlusion, elevation, interaction prompts and iPad performance.

Only after the test succeeds should the full Pornalia village be reconstructed. Other Coral villages remain outside the scope of this proof scene.
