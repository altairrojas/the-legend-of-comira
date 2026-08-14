/**
 * Procedural placeholder geometry for the proof scene.
 *
 * Pornalia has no runtime art yet — only reference crops — and the asset docs
 * are explicit that placeholder runtime art must not be manufactured just to
 * populate the tree. So the scene's ground and props are generated as plain
 * shapes at boot instead: enough to prove projection, depth sorting and
 * occlusion, and obviously not final art.
 */

import Phaser from "phaser";

import { TILE_H, TILE_W } from "./iso";

export const GROUND_KEYS = ["tile-plaza", "tile-grass", "tile-path"] as const;
export type GroundKey = (typeof GROUND_KEYS)[number];

const GROUND_COLORS: Record<GroundKey, { top: number; edge: number }> = {
  "tile-plaza": { top: 0xd8cdb6, edge: 0xb7a98d },
  "tile-grass": { top: 0x86ab72, edge: 0x6b8d5b },
  "tile-path": { top: 0xc9a97e, edge: 0xa98a63 },
};

function diamondPath(g: Phaser.GameObjects.Graphics, cx: number, cy: number) {
  g.beginPath();
  g.moveTo(cx, cy - TILE_H / 2);
  g.lineTo(cx + TILE_W / 2, cy);
  g.lineTo(cx, cy + TILE_H / 2);
  g.lineTo(cx - TILE_W / 2, cy);
  g.closePath();
}

function groundTiles(g: Phaser.GameObjects.Graphics) {
  for (const key of GROUND_KEYS) {
    const { top, edge } = GROUND_COLORS[key];
    g.clear();
    g.fillStyle(top, 1);
    diamondPath(g, TILE_W / 2, TILE_H / 2);
    g.fillPath();
    g.lineStyle(1, edge, 0.85);
    diamondPath(g, TILE_W / 2, TILE_H / 2);
    g.strokePath();
    g.generateTexture(key, TILE_W, TILE_H);
  }
}

/** Tree tall enough that Comira visibly passes behind it. */
function tree(g: Phaser.GameObjects.Graphics) {
  const w = 96;
  const h = 150;
  g.clear();
  g.fillStyle(0x000000, 0.16);
  g.fillEllipse(w / 2, h - 10, 58, 22);
  g.fillStyle(0x7a5a3c, 1);
  g.fillRect(w / 2 - 8, h - 62, 16, 54);
  g.fillStyle(0x3f6b45, 1);
  g.fillCircle(w / 2, h - 94, 40);
  g.fillStyle(0x53885a, 1);
  g.fillCircle(w / 2 - 13, h - 105, 29);
  g.fillStyle(0x6aa06d, 1);
  g.fillCircle(w / 2 + 13, h - 99, 22);
  g.generateTexture("prop-tree", w, h);
}

/** Small house: an isometric box, two lit faces and a roof diamond. */
function house(g: Phaser.GameObjects.Graphics) {
  const w = TILE_W * 2;
  const h = 232;
  const cx = w / 2;
  const baseY = h - 12;
  const wallH = 92;
  const roofH = 54;
  const halfW = TILE_W;
  const halfH = TILE_H;

  g.clear();
  g.fillStyle(0x000000, 0.16);
  g.fillEllipse(cx, baseY, w * 0.72, 28);

  // Left wall face.
  g.fillStyle(0xcbb493, 1);
  g.beginPath();
  g.moveTo(cx - halfW, baseY - halfH / 2 - wallH);
  g.lineTo(cx, baseY - wallH);
  g.lineTo(cx, baseY);
  g.lineTo(cx - halfW, baseY - halfH / 2);
  g.closePath();
  g.fillPath();

  // Right wall face, shaded.
  g.fillStyle(0xa98f6f, 1);
  g.beginPath();
  g.moveTo(cx + halfW, baseY - halfH / 2 - wallH);
  g.lineTo(cx, baseY - wallH);
  g.lineTo(cx, baseY);
  g.lineTo(cx + halfW, baseY - halfH / 2);
  g.closePath();
  g.fillPath();

  // Door on the left face.
  g.fillStyle(0x6d4f38, 1);
  g.beginPath();
  g.moveTo(cx - 62, baseY - halfH / 2 - 52);
  g.lineTo(cx - 26, baseY - halfH / 2 - 70);
  g.lineTo(cx - 26, baseY - 18);
  g.lineTo(cx - 62, baseY - 1);
  g.closePath();
  g.fillPath();

  // Roof: a diamond lid sitting on the walls, plus its two visible slopes.
  const roofY = baseY - wallH - halfH / 2;
  g.fillStyle(0x9c5f52, 1);
  g.beginPath();
  g.moveTo(cx, roofY - roofH);
  g.lineTo(cx + halfW, roofY);
  g.lineTo(cx, roofY + halfH / 2);
  g.lineTo(cx - halfW, roofY);
  g.closePath();
  g.fillPath();
  g.fillStyle(0xb87264, 1);
  g.beginPath();
  g.moveTo(cx, roofY - roofH);
  g.lineTo(cx - halfW, roofY);
  g.lineTo(cx, roofY + halfH / 2);
  g.closePath();
  g.fillPath();

  g.generateTexture("prop-house", w, h);
}

/** Signpost — the proof scene's interactable landmark. */
function sign(g: Phaser.GameObjects.Graphics) {
  const w = 72;
  const h = 96;
  g.clear();
  g.fillStyle(0x000000, 0.16);
  g.fillEllipse(w / 2, h - 8, 34, 14);
  g.fillStyle(0x6d4f38, 1);
  g.fillRect(w / 2 - 4, h - 56, 8, 50);
  g.fillStyle(0xc9a97e, 1);
  g.fillRoundedRect(8, h - 88, w - 16, 36, 5);
  g.lineStyle(2, 0x6d4f38, 1);
  g.strokeRoundedRect(8, h - 88, w - 16, 36, 5);
  g.fillStyle(0x6d4f38, 0.75);
  g.fillRect(18, h - 78, w - 36, 4);
  g.fillRect(18, h - 68, w - 46, 4);
  g.generateTexture("prop-sign", w, h);
}

export function buildTextures(scene: Phaser.Scene): void {
  const g = scene.add.graphics();
  groundTiles(g);
  tree(g);
  house(g);
  sign(g);
  g.destroy();
}
