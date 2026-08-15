# Comira - polished animation frames

Transparent, bottom-center anchored runtime sprites polished from the extracted
Comira reference animations. The set now uses one consistent character design,
clean antialiased edges, normalized walk scale, and authored in-between poses.

## Runtime set

| Animation | Dir | Frames | Frame size | FPS |
|---|---|---:|---:|---:|
| `walk_down_right` | SE | 6 | 80x96 | 10 |
| `walk_down_left` | SW | 6 | 80x96 | 10 |
| `walk_up_left` | NW | 6 | 80x96 | 10 |
| `walk_up_right` | NE | 6 | 80x96 | 10 |
| `walk_north` | N | 6 | 80x96 | 10 |
| `walk_west` | W | 6 | 80x96 | 10 |
| `walk_east` | E | 6 | 80x96 | 10 |
| `sit` | S | 4 | 80x80 | 5 |
| `jump` | S | 6 | 96x128 | 10 |
| `attack_staff` | S | 6 | 120x96 | 12 |

Each animation ships as individual `name/name_NN.png` frames plus a horizontal
`name_strip.png`. `frames.json` is the runtime source of truth. Preview GIFs are
for visual timing checks only.

## Production process

1. Extract the recoverable source poses with `tools/derive_comira_sprites.py`.
2. Use the source strips as motion references and a validated polished Comira
   sheet as the locked style reference.
3. Author six-stage walk, jump, and attack cycles with explicit contact,
   passing, recoil, apex, impact, and recovery poses as appropriate.
4. Render on a flat magenta key, remove the key to soft alpha, and reject any
   sheet with shadows, merged cells, wrong facing, or inconsistent identity.
5. Run `tools/process_polished_sprite.py` to preserve one shared animation bbox,
   normalize scale, retain motion offsets, and write runtime strips and frames.

6. Run `tools/publish_comira_sprites.py` to repair alpha and copy the strips and
   manifest into `public/assets/characters/comira`, which is what the game
   actually loads. **This step is required** — editing only this directory
   changes nothing at runtime.

The fitting, alpha-repair and publish steps are reproducible. The AI
pose-authoring step is stochastic and requires visual review.

> **Reproducibility caveat.** The extracted set could be rebuilt from the
> committed reference crops by running one script. This set cannot: its true
> sources are the AI renders, and those intermediates are **not in the repo**
> (an earlier draft of this file pointed at `output/imagegen/`, which does not
> exist). Treat the PNGs here as the source of truth, not a build artifact.

## Improvements over the extracted set

- Walk cycles increased from 3-5 poses to six distinct poses.
- All walk directions now share the same `80x96` frame grid and visual scale.
- Southwest is independently authored and no longer a mirrored southeast strip.
- Jump has a readable crouch, launch, rise, apex, fall, and landing arc.
- Staff attack has a continuous windup, swing, impact, follow-through, and
  recovery path.
- The baked fairy companion and detached jump VFX were removed.
- A 1px antialiased rim replaces the old binary cutout edges.

## Fixed after the polish pass

The magenta-key removal left roughly a fifth of the body at ~45% opacity in 8 of
the 10 animations — not soft *edges* but translucent *interiors*, so the ground
colour bled through and the satchel read olive on grass and pink on magenta. The
RGB underneath was correct, so `tools/publish_comira_sprites.py` forces interior
pixels opaque and keeps the outer rim antialiased. Re-run it after any future
render pass; do not assume a chroma key got the interior right.

## Remaining limitation

No true south-facing walk source exists. The four isometric runtime movement
axes remain SE, SW, NW, and NE; cardinal sheets are available for future use.
## The reference manifest labels are wrong

`reference/isometric-master/manifest.json` names the tiles by guessed content.
The tiles are grid crops of a poster, and most do not contain what they claim.
Actual contents:

| File | Manifest says | Actually contains |
|---|---|---|
| `01` | isometric views | key art + `Arriba (Norte)` walk row (cut) |
| `02` | walk side | `Vista Isométrica` poses + `Derecha (Este)` row (cut) |
| `03` | walk diagonal | isometric tile poses + `Expresiones` row (cut) |
| `04` | expressions | expression labels + `Efectos VFX` / `Sombras` headers |
| `05` | actions | VFX icons, jump shadow, format notes strip |
| `06` | light VFX | **diagonal walk cycles** (SE, NW, NE) |
| `07` | heal + shadow VFX | **`Sentada`, `Salto`, `Ataque` action cycles** |
| `08` | UI icons | palette + `Habilidad Especial` + character data |
| `09` | palette | base size + palette |
| `10` | technical notes | character data block + title card |

The two tiles holding nearly all the usable animation content — `06` and `07` —
are the two labelled as VFX. Anyone trusting the manifest would skip them.
