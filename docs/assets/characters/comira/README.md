# Comira — character asset specification

Comira is the **white cat heroine** shown in the approved character references. She is a distinct character from **Cova**, the dark/black playable cat. Cova must never be treated as a recolor, skin, alternate form, or version of Comira.

## Canonical visual identity

- Species: cat.
- Fur: predominantly clean white / warm ivory.
- Inner ears: pale peach-pink.
- Eyes: very large, rounded, glossy black/dark brown with bright highlights.
- Nose: tiny dark nose.
- Face: rounded and friendly, with a small mouth and subtle peach blush.
- Body: compact chibi proportions, short visible legs/paws, rounded torso and large head.
- Tail: fluffy white tail.
- Scarf/cape: muted sage green around the neck and shoulders.
- Harness: brown diagonal leather strap across the torso.
- Bag: small brown side satchel.
- Pendant: faceted cyan/light-blue crystal at the chest.
- Weapon: slender brown Light Staff with a blue crystal head and small golden accents.
- Element: Light / solar visual language.
- Personality expressed by design: kind, brave, helpful, curious and gentle.

## Approved isometric master

The approved master package has been extracted into:

`docs/assets/characters/comira/reference/isometric-master/`

It contains ten individually reviewable WebP reference slices plus a machine-readable `manifest.json`.

Primary movement / pose references:

- `01_isometric_views.webp`
- `02_walk_side.webp`
- `03_walk_diagonal.webp`
- `05_actions.webp`

Separate art references:

- expressions;
- light VFX;
- healing / shadow VFX;
- UI icons;
- palette;
- technical sprite notes.

These files are **canonical reference assets, not final Phaser animation atlases**.

## Expressions

Minimum expression set derived from the approved material:

- happy / smiling;
- surprised;
- thoughtful;
- sad;
- angry.

Useful production additions, while preserving the same face design:

- blink;
- determined;
- hurt;
- relieved;
- sleepy.

## Animation targets

Future runtime animation coverage should include:

- idle;
- blink;
- walk;
- run;
- turn;
- jump start / air / land;
- attack staff if required by gameplay;
- cast heal / light magic;
- interact;
- map read / explore;
- hurt;
- recover.

Because the game now uses a fixed isometric viewpoint, production must decide and document the required directional set before authoring final locomotion atlases. Start with **4-direction coverage** in the technical proof; move to 8 directions only if the visual gain justifies the additional animation work.

## Props and UI targets

Character-specific props include:

- Light Staff;
- crystal pendant / Solar Amulet;
- sage scarf/cape;
- health potion;
- map;
- brown satchel.

Potential UI assets include portrait/avatar, paw icon, light-element icon, health icon, potion icon, map icon, crystal/amulet icon and staff icon.

## VFX language

Comira's effects should use soft luminous shapes rather than harsh explosions:

- warm golden-white attack glow;
- pale green/cyan healing rings and sparkles;
- tiny star / diamond particles;
- blue crystal glow on staff and pendant.

## Planned runtime tree

```text
public/assets/characters/comira/
├── atlases/
│   ├── locomotion/
│   └── actions/
├── portraits/
├── expressions/
├── props/
├── vfx/
└── ui/
```

This is a **target runtime structure**. It does not claim those production files already exist.

## Cova separation rule

Cova belongs in a completely separate tree:

```text
public/assets/characters/cova/
```

Cova has independent design, lore, sprites, animations, props and UI. Never create names such as `comira-black`, `black-comira`, `comira-dark`, or use Cova assets as Comira variants.
