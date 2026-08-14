import Phaser from "phaser";

import {
  ASSET_DIR,
  MANIFEST_KEY,
  createAnimations,
  queueSpritesheets,
  type FramesManifest,
} from "../comira";
import { buildTextures } from "../textures";

/**
 * Loads in two passes: the frames manifest first, then the spritesheets it
 * describes. Frame sizes differ per animation, so they cannot be queued until
 * the manifest is in hand.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  preload(): void {
    this.load.json(MANIFEST_KEY, `${ASSET_DIR}/frames.json`);
  }

  create(): void {
    buildTextures(this);

    const meta = this.cache.json.get(MANIFEST_KEY) as FramesManifest | undefined;
    if (!meta) {
      throw new Error(`Comira frames manifest missing at ${ASSET_DIR}/frames.json`);
    }

    queueSpritesheets(this.load, meta);
    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      createAnimations(this.anims, meta);
      this.scene.start("pornalia-proof");
    });
    this.load.start();
  }
}
