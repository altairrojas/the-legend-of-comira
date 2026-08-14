/**
 * Touch-first input for the proof scene.
 *
 * The control docs call for comparing a virtual joystick against tap-to-move
 * before committing to a scheme, so both are live at once and share one
 * gesture: press and drag past the dead zone gives a floating joystick; press
 * and release without dragging is a tap-to-move. Keyboard is a desktop
 * convenience only — nothing here depends on it.
 */

import Phaser from "phaser";

import type { Vec2 } from "./iso";

const DEAD_ZONE = 14;
const MAX_RADIUS = 68;
const TAP_MS = 320;

export class Controls {
  private readonly scene: Phaser.Scene;
  private readonly keys: Record<string, Phaser.Input.Keyboard.Key> = {};

  private pointerId: number | null = null;
  private origin: Vec2 = { x: 0, y: 0 };
  private pressedAt = 0;
  private dragging = false;
  private stick: Vec2 = { x: 0, y: 0 };

  private tapTarget: Vec2 | null = null;

  private readonly base: Phaser.GameObjects.Arc;
  private readonly knob: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.base = scene.add
      .circle(0, 0, MAX_RADIUS, 0xffffff, 0.12)
      .setStrokeStyle(2, 0xffffff, 0.32)
      .setScrollFactor(0)
      .setDepth(10_000)
      .setVisible(false);
    this.knob = scene.add
      .circle(0, 0, 26, 0xffffff, 0.4)
      .setScrollFactor(0)
      .setDepth(10_001)
      .setVisible(false);

    scene.input.addPointer(2);
    scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.onDown, this);
    scene.input.on(Phaser.Input.Events.POINTER_MOVE, this.onMove, this);
    scene.input.on(Phaser.Input.Events.POINTER_UP, this.onUp, this);
    scene.input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.onUp, this);

    const kb = scene.input.keyboard;
    if (kb) {
      for (const [name, code] of Object.entries({
        up: "UP",
        down: "DOWN",
        left: "LEFT",
        right: "RIGHT",
        w: "W",
        a: "A",
        s: "S",
        d: "D",
      })) {
        this.keys[name] = kb.addKey(code);
      }
    }
  }

  private onDown(p: Phaser.Input.Pointer) {
    if (this.pointerId !== null) return;
    this.pointerId = p.id;
    this.origin = { x: p.x, y: p.y };
    this.pressedAt = this.scene.time.now;
    this.dragging = false;
    this.stick = { x: 0, y: 0 };
  }

  private onMove(p: Phaser.Input.Pointer) {
    if (p.id !== this.pointerId) return;
    const dx = p.x - this.origin.x;
    const dy = p.y - this.origin.y;
    const dist = Math.hypot(dx, dy);
    if (!this.dragging && dist < DEAD_ZONE) return;

    if (!this.dragging) {
      this.dragging = true;
      this.base.setPosition(this.origin.x, this.origin.y).setVisible(true);
      this.knob.setVisible(true);
    }
    const clamped = Math.min(dist, MAX_RADIUS);
    const nx = dx / dist;
    const ny = dy / dist;
    this.stick = { x: (nx * clamped) / MAX_RADIUS, y: (ny * clamped) / MAX_RADIUS };
    this.knob.setPosition(this.origin.x + nx * clamped, this.origin.y + ny * clamped);
  }

  private onUp(p: Phaser.Input.Pointer) {
    if (p.id !== this.pointerId) return;
    const quick = this.scene.time.now - this.pressedAt <= TAP_MS;
    if (!this.dragging && quick) {
      this.tapTarget = { x: p.worldX, y: p.worldY };
    }
    this.pointerId = null;
    this.dragging = false;
    this.stick = { x: 0, y: 0 };
    this.base.setVisible(false);
    this.knob.setVisible(false);
  }

  /** Desired heading in screen space, magnitude 0..1. Zero when idle. */
  getScreenVector(): Vec2 {
    if (this.dragging) return this.stick;

    let x = 0;
    let y = 0;
    const down = (k: string) => this.keys[k]?.isDown ?? false;
    if (down("left") || down("a")) x -= 1;
    if (down("right") || down("d")) x += 1;
    if (down("up") || down("w")) y -= 1;
    if (down("down") || down("s")) y += 1;
    if (x === 0 && y === 0) return { x: 0, y: 0 };
    const len = Math.hypot(x, y);
    return { x: x / len, y: y / len };
  }

  /** Pending tap-to-move destination in world pixels; cleared once read. */
  consumeTapTarget(): Vec2 | null {
    const t = this.tapTarget;
    this.tapTarget = null;
    return t;
  }

  destroy(): void {
    this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.onDown, this);
    this.scene.input.off(Phaser.Input.Events.POINTER_MOVE, this.onMove, this);
    this.scene.input.off(Phaser.Input.Events.POINTER_UP, this.onUp, this);
    this.scene.input.off(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.onUp, this);
    this.base.destroy();
    this.knob.destroy();
  }
}
