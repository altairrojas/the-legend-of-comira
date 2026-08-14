# Comira — derived animation frames

Transparent, anchor-consistent frames derived from the ten
`reference/isometric-master` crops, per that package's own rule that the
reference sheets must not be used directly as the movable Phaser character.

Regenerate with:

```bash
python tools/derive_comira_sprites.py
```

The reference crops are untouched; everything here is reproducible from them.

## What is here

| Animation | Dir | Frames | Frame size | Tier |
|---|---|---|---|---|
| `walk_down_right` | SE | 3 | 72×83 | primary |
| `walk_up_left` | NW | 3 | 74×78 | primary |
| `walk_up_right` | NE | 3 | 72×83 | primary |
| `walk_down_left` | SW | 3 | 72×83 | **stopgap — mirrored** |
| `walk_north` | N | 5 | 40×53 | secondary |
| `walk_west` | W | 5 | 41×69 | secondary |
| `walk_east` | E | 5 | 49×68 | secondary |
| `sit` | S | 4 | 72×65 | primary |
| `jump` | S | 4 | 78×97 | primary |
| `attack_staff` | S | 4 | 100×83 | primary |

Each animation ships as individual `name/name_NN.png` frames plus a horizontal
`name_strip.png`. `frames.json` is the machine-readable index. `preview/*.gif`
are loop previews for eyeballing timing only — not runtime assets.

`_reconstructed_sheet.png` is reference tiles 01–05 restitched (see below).

## How it was produced

1. **Restitch.** Tiles `01`–`05` are contiguous 512px-wide vertical bands of one
   larger sheet, not independent slices. Concatenating them in order restores the
   cardinal walk rows that the tile boundaries had cut through mid-body.
2. **Key the background.** The crops are opaque, with a paper texture behind the
   art. Alpha comes from a flood fill seeded on the panel border, so the
   character's own white fur — enclosed by its outline — is never keyed out.
3. **Drop baked ground shadows.** The painted grey contact ovals are removed; a
   shadow that does not track the character breaks the anchor and double-draws
   against a runtime shadow.
4. **Repair divider cuts.** Card rules are the same near-white as the paper, so
   the fill ran down them and slit some sprites. Tall, thin, enclosed cuts are
   refilled and recoloured from neighbouring pixels.
5. **Cut cells, then share one bbox.** Frames are cut on a per-row grid and then
   all cropped to one bbox for that animation, so each frame keeps its position
   within the cycle. Trimming frames individually would flatten the walk bob and
   the jump arc. The `jump` row is not evenly pitched and uses explicit cuts.

Anchor is **bottom-centre** for every animation.

## Known limitations

- **Alpha is binary**, not feathered. Correct for crisp sprite rendering; it does
  mean edges are hard at large upscales.
- **`walk_down_left` is a horizontal mirror** of `walk_down_right`. This flips
  the satchel to the character's wrong side. It exists so eight-way movement can
  be wired up now; replace it with authored art.
- **Cardinal walks are roughly half the pixel height of the diagonals** (~53–69px
  vs ~78–83px) because they come from the low-resolution 512px-wide tiles. For a
  fixed isometric camera the diagonals are the primary movement axes, so this is
  usually acceptable — but do not mix tiers at the same on-screen scale.
- **No south-facing (`S`) walk cycle exists.** That row was truncated by the tile
  cut and cannot be recovered from the surviving crops.
- **`jump` and `attack_staff` include the fairy companion and staff VFX** baked
  into the frames. Separate them if the companion is its own entity.
- **Source is lossy WebP.** Colours carry mild compression artifacts; these are
  reference-derived production stand-ins, not final art.
- **Not yet packed into a texture atlas** and frame sizes differ per animation.
  Pack before shipping if draw-call count matters.

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
