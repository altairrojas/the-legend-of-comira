import Phaser from "phaser";

import { WALK_ANIM, textureKey } from "../comira";
import { Controls } from "../controls";
import {
  depthFor,
  facingFromScreen,
  gridToScreen,
  screenToGrid,
  type Facing,
  type Vec2,
} from "../iso";
import { GROUND_KEYS, buildTextures } from "../textures";

const MAP_SIZE = 22;
const CENTER = (MAP_SIZE - 1) / 2;
const PLAZA_RADIUS = 4.6;
const WALK_SPEED = 3.2; // tiles per second
const ARRIVE_EPSILON = 0.14;

interface Prop {
  key: string;
  gx: number;
  gy: number;
  /** Tiles blocked around the anchor, as [dx, dy] offsets. */
  footprint: Vec2[];
}

const ORIGIN_ONLY: Vec2[] = [{ x: 0, y: 0 }];

const PROPS: Prop[] = [
  {
    key: "prop-house",
    gx: 6,
    gy: 6,
    footprint: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
  },
  { key: "prop-tree", gx: 14, gy: 7, footprint: ORIGIN_ONLY },
  { key: "prop-tree", gx: 8, gy: 15, footprint: ORIGIN_ONLY },
  { key: "prop-tree", gx: 16, gy: 14, footprint: ORIGIN_ONLY },
  { key: "prop-sign", gx: 12, gy: 11, footprint: ORIGIN_ONLY },
];

/**
 * The Pornalia proof scene: a deliberately tiny slice of Plaza del Sol used to
 * validate the isometric foundation — projection, depth sorting, occlusion,
 * touch movement and camera follow — before any of the village is rebuilt.
 */
export class PornaliaProofScene extends Phaser.Scene {
  private controls!: Controls;
  private comira!: Phaser.GameObjects.Sprite;

  private pos: Vec2 = { x: CENTER, y: CENTER + 3 };
  private facing: Facing = "SE";
  private moveTarget: Vec2 | null = null;
  private readonly blocked = new Set<string>();

  constructor() {
    super("pornalia-proof");
  }

  create(): void {
    // Textures live on the global texture manager, but a scene restart during
    // development can outrun that; regenerating is cheap and idempotent.
    if (!this.textures.exists(GROUND_KEYS[0])) buildTextures(this);

    this.cameras.main.setBackgroundColor("#14161c");
    this.buildGround();
    this.buildProps();

    this.comira = this.add
      .sprite(0, 0, textureKey(WALK_ANIM[this.facing]))
      .setOrigin(0.5, 1);
    this.syncSprite();

    this.cameras.main.startFollow(this.comira, true, 0.12, 0.12);
    this.cameras.main.setRoundPixels(true);
    // Pulled in so Comira stays readable on a phone or iPad rather than being
    // a speck in the middle of the plaza.
    this.cameras.main.setZoom(1.3);

    this.controls = new Controls(this);
    this.buildHud();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.controls.destroy());
  }

  private tileKey(i: number, j: number): string {
    return `${i},${j}`;
  }

  private groundFor(i: number, j: number): string {
    const d = Math.hypot(i - CENTER, j - CENTER);
    if (d <= PLAZA_RADIUS) return "tile-plaza";
    // One short path leaving the plaza toward the south-east.
    if (Math.abs(i - j) <= 1 && i > CENTER) return "tile-path";
    return "tile-grass";
  }

  private buildGround(): void {
    for (let i = 0; i < MAP_SIZE; i += 1) {
      for (let j = 0; j < MAP_SIZE; j += 1) {
        const p = gridToScreen(i, j);
        this.add.image(p.x, p.y, this.groundFor(i, j)).setDepth(-1);
      }
    }
  }

  private buildProps(): void {
    for (const prop of PROPS) {
      const p = gridToScreen(prop.gx, prop.gy);
      this.add
        .image(p.x, p.y, prop.key)
        .setOrigin(0.5, 1)
        .setDepth(depthFor(prop.gx, prop.gy));
      for (const cell of prop.footprint) {
        this.blocked.add(this.tileKey(prop.gx + cell.x, prop.gy + cell.y));
      }
    }
  }

  private buildHud(): void {
    const text = this.add
      .text(
        16,
        16,
        "Plaza del Sol — Pornalia proof scene\nDrag to steer · tap to walk there",
        {
          fontFamily: "system-ui, sans-serif",
          fontSize: "15px",
          color: "#ffffff",
          backgroundColor: "#00000066",
          padding: { x: 10, y: 8 },
          lineSpacing: 4,
        },
      )
      .setScrollFactor(0)
      .setDepth(10_002);
    text.setAlpha(0.9);
  }

  private isBlocked(gx: number, gy: number): boolean {
    const i = Math.round(gx);
    const j = Math.round(gy);
    if (i < 0 || j < 0 || i >= MAP_SIZE || j >= MAP_SIZE) return true;
    return this.blocked.has(this.tileKey(i, j));
  }

  /** Screen-space heading the player is asking for, or null when idle. */
  private desiredHeading(): Vec2 | null {
    const stick = this.controls.getScreenVector();
    if (stick.x !== 0 || stick.y !== 0) {
      this.moveTarget = null;
      return stick;
    }

    const tap = this.controls.consumeTapTarget();
    if (tap) this.moveTarget = screenToGrid(tap.x, tap.y);

    if (this.moveTarget) {
      const dx = this.moveTarget.x - this.pos.x;
      const dy = this.moveTarget.y - this.pos.y;
      if (Math.hypot(dx, dy) <= ARRIVE_EPSILON) {
        this.moveTarget = null;
        return null;
      }
      // Convert the grid-space heading to screen space so facing and steering
      // share one code path with the joystick.
      const len = Math.hypot(dx, dy);
      return gridToScreen(dx / len, dy / len);
    }
    return null;
  }

  private syncSprite(): void {
    const p = gridToScreen(this.pos.x, this.pos.y);
    this.comira.setPosition(p.x, p.y);
    this.comira.setDepth(depthFor(this.pos.x, this.pos.y));
  }

  override update(_time: number, delta: number): void {
    const heading = this.desiredHeading();

    if (!heading) {
      this.comira.anims.stop();
      this.comira.setTexture(textureKey(WALK_ANIM[this.facing]), 0);
      this.syncSprite();
      return;
    }

    this.facing = facingFromScreen(heading.x, heading.y);
    const anim = textureKey(WALK_ANIM[this.facing]);
    if (this.comira.anims.currentAnim?.key !== anim || !this.comira.anims.isPlaying) {
      this.comira.play(anim);
    }

    // Steer in grid space so speed stays uniform regardless of facing.
    const g = screenToGrid(heading.x, heading.y);
    const len = Math.hypot(g.x, g.y) || 1;
    const magnitude = Math.min(1, Math.hypot(heading.x, heading.y));
    const step = (WALK_SPEED * delta) / 1000;
    const dx = (g.x / len) * step * magnitude;
    const dy = (g.y / len) * step * magnitude;

    // Resolve axes separately so Comira slides along obstacles instead of
    // sticking to them.
    if (!this.isBlocked(this.pos.x + dx, this.pos.y)) this.pos.x += dx;
    if (!this.isBlocked(this.pos.x, this.pos.y + dy)) this.pos.y += dy;

    this.syncSprite();
  }
}
