/**
 * Comira's runtime animation set, driven by the derived frames manifest so the
 * sprite pipeline stays the single source of truth for frame sizes and counts.
 */

import Phaser from "phaser";

import type { Facing } from "./iso";

export interface FrameAnim {
  name: string;
  direction: string;
  tier: string;
  frames: number;
  frame_width: number;
  frame_height: number;
  /** Optional: older manifests predate it, so treat it as possibly absent. */
  frame_rate?: number;
  strip: string;
}

/**
 * Phaser derives `msPerFrame` from `frameRate`, and an `undefined` frameRate
 * yields `msPerFrame: null` — the animation reports as playing but never
 * advances past frame 0. A manifest missing the field must not be able to
 * silently freeze every animation, so fall back to a sane rate.
 */
const DEFAULT_FRAME_RATE = 10;

export interface FramesManifest {
  anchor: string;
  animations: FrameAnim[];
}

export const ASSET_DIR = "assets/characters/comira";
export const MANIFEST_KEY = "comira-frames";

/**
 * The four isometric axes map onto the four authored diagonal cycles. The
 * cardinal cycles exist but are half the resolution, and there is no
 * south-facing walk at all, so movement stays on the diagonals.
 */
export const WALK_ANIM: Record<Facing, string> = {
  SE: "walk_down_right",
  SW: "walk_down_left",
  NW: "walk_up_left",
  NE: "walk_up_right",
};

export function textureKey(name: string): string {
  return `comira-${name}`;
}

export function queueSpritesheets(
  load: Phaser.Loader.LoaderPlugin,
  meta: FramesManifest,
): void {
  for (const anim of meta.animations) {
    load.spritesheet(textureKey(anim.name), `${ASSET_DIR}/${anim.strip}`, {
      frameWidth: anim.frame_width,
      frameHeight: anim.frame_height,
    });
  }
}

export function createAnimations(
  anims: Phaser.Animations.AnimationManager,
  meta: FramesManifest,
): void {
  for (const anim of meta.animations) {
    const key = textureKey(anim.name);
    if (anims.exists(key)) continue;
    anims.create({
      key,
      frames: Array.from({ length: anim.frames }, (_, frame) => ({ key, frame })),
      frameRate: anim.frame_rate ?? DEFAULT_FRAME_RATE,
      repeat: -1,
    });
  }
}
