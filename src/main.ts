import Phaser from "phaser";

import { BootScene } from "./scenes/BootScene";
import { PornaliaProofScene } from "./scenes/PornaliaProofScene";

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#14161c",
  // Touch/iPad is a primary target, so the canvas tracks the viewport rather
  // than a fixed design resolution.
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    pixelArt: false,
    antialias: true,
  },
  scene: [BootScene, PornaliaProofScene],
});

// Dev-only handle so the running scene can be inspected or stepped from the
// console. Stripped from production builds.
if (import.meta.env.DEV) {
  (window as unknown as { game: Phaser.Game }).game = game;
}
