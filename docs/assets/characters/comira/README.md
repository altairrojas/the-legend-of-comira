# Comira — character asset specification

Comira is the **white cat heroine** shown in the approved character sheet. She is a distinct character from **Koba**, the black cat. Koba must never be treated as a recolor, skin, alternate form, or version of Comira.

## Canonical visual identity

- Species: cat.
- Fur: predominantly clean white / warm ivory.
- Inner ears: pale peach-pink.
- Eyes: very large, rounded, glossy black/dark brown with bright highlights.
- Nose: tiny dark nose.
- Face: rounded, friendly; small mouth; subtle peach blush on cheeks.
- Body: compact chibi proportions, short legs/paws, rounded torso, large head.
- Tail: fluffy white tail.
- Scarf/cape: muted sage green, wrapped around neck and draping behind the shoulders.
- Harness: brown diagonal leather strap across torso.
- Bag: small brown side satchel.
- Pendant: faceted cyan/light-blue crystal hanging at the chest.
- Weapon: slender brown Light Staff with a blue crystal head and small golden accents.
- Element: Light / solar visual language.
- Personality expressed by design: kind, brave, helpful, curious and gentle.

## Approved views from reference

The reference sheet establishes at least:

1. Front.
2. Side/profile.
3. Back.

The runtime model/sprite set must preserve the same silhouette, scarf, harness, bag, pendant and tail placement from every angle.

## Expressions

Minimum expression set derived from the sheet:

- happy / smiling
- surprised
- thoughtful
- sad
- angry

Useful production additions, while preserving the same face design:

- blink
- determined
- hurt
- relieved
- sleepy

## Actions / animation requirements

The sheet explicitly establishes these actions:

- attack with Light Staff
- heal / light magic
- jump
- explore / read map

Runtime animation set should include:

- idle
- blink
- walk
- run
- turn
- jump_start
- jump_air
- jump_land
- attack_staff
- cast_heal
- interact
- map_read
- hurt
- recover

## Props and UI assets

Character-specific props visible in the sheet:

- Light Staff
- Solar Amulet / crystal pendant
- Light Cape / sage scarf
- health potion
- map of Comira
- brown satchel

Recommended UI assets:

- portrait
- circular avatar
- paw icon
- light-element icon
- health-heart icon
- potion icon
- map icon
- crystal/amulet icon
- staff icon

## VFX language

Comira's effects should use soft luminous shapes rather than harsh explosions:

- warm golden-white attack glow
- pale green/cyan healing rings and sparkles
- tiny star / diamond particles
- blue crystal glow on staff and pendant

## Asset production tree

```text
public/assets/characters/comira/
├── model/
│   ├── comira.glb
│   └── textures/
├── animations/
│   └── comira-animations.glb
├── sprites/
│   ├── comira-idle.png
│   ├── comira-walk.png
│   ├── comira-run.png
│   ├── comira-jump.png
│   ├── comira-attack.png
│   ├── comira-heal.png
│   └── comira-hurt.png
├── portraits/
│   ├── comira-portrait.png
│   └── comira-avatar.png
├── expressions/
│   ├── happy.png
│   ├── surprised.png
│   ├── thoughtful.png
│   ├── sad.png
│   └── angry.png
├── props/
│   ├── light-staff.glb
│   ├── satchel.glb
│   ├── pendant.glb
│   └── map.png
├── vfx/
│   ├── light-attack.png
│   ├── heal-ring.png
│   └── sparkle.png
└── ui/
    ├── comira-icon.png
    ├── paw-icon.png
    ├── light-icon.png
    ├── staff-icon.png
    └── pendant-icon.png
```

These are **target runtime assets**. This document does not claim the GLB, animation or sprite files already exist.

## Koba separation rule

Koba belongs in a completely separate tree:

```text
public/assets/characters/koba/
```

Koba has independent design, lore, models, sprites, animations, props and UI. Do not create `comira-black`, `black-comira`, `comira-dark`, or any equivalent alternate-skin naming.