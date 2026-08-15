/**
 * On-screen action buttons for the non-locomotion animations.
 *
 * Hit testing is plain screen-space rectangle maths rather than Phaser
 * interactive objects. The buttons live on the unzoomed UI camera while the
 * world camera is zoomed, and Phaser's hit testing resolves pointers through
 * camera transforms — which is exactly the mismatch that already pushed the HUD
 * off-screen. Screen-space rects are camera-independent and match how the
 * joystick already works.
 */

import Phaser from "phaser";

export interface ActionSpec {
  /** Animation name in the frames manifest, e.g. `jump`. */
  anim: string;
  label: string;
  /** Hold the final pose when the clip ends, until movement breaks it. */
  hold?: boolean;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const BTN_W = 108;
const BTN_H = 54;
const GAP = 12;
const MARGIN = 22;
const FLASH_MS = 140;

export class ActionButtons {
  private readonly scene: Phaser.Scene;
  private readonly specs: ActionSpec[];
  private readonly g: Phaser.GameObjects.Graphics;
  private readonly labels: Phaser.GameObjects.Text[];

  private rects: Rect[] = [];
  private pressed: number | null = null;
  private pending: string | null = null;

  constructor(scene: Phaser.Scene, specs: ActionSpec[]) {
    this.scene = scene;
    this.specs = specs;

    this.g = scene.add.graphics().setScrollFactor(0).setDepth(10_000);
    this.labels = specs.map((s) =>
      scene.add
        .text(0, 0, s.label, {
          fontFamily: "system-ui, sans-serif",
          fontSize: "17px",
          color: "#ffffff",
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(10_001),
    );

    this.layout();
    scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.onDown, this);
    scene.scale.on(Phaser.Scale.Events.RESIZE, this.layout, this);
  }

  /** Stacked bottom-right, clear of the left-hand joystick area. */
  private layout(): void {
    const w = this.scene.scale.width;
    const h = this.scene.scale.height;
    const x = w - MARGIN - BTN_W;
    const total = this.specs.length * BTN_H + (this.specs.length - 1) * GAP;
    const top = h - MARGIN - total;

    this.rects = this.specs.map((_, i) => ({
      x,
      y: top + i * (BTN_H + GAP),
      w: BTN_W,
      h: BTN_H,
    }));
    this.rects.forEach((r, i) => {
      this.labels[i].setPosition(r.x + r.w / 2, r.y + r.h / 2);
    });
    this.redraw();
  }

  private redraw(): void {
    this.g.clear();
    this.rects.forEach((r, i) => {
      const active = this.pressed === i;
      this.g.fillStyle(0xffffff, active ? 0.34 : 0.14);
      this.g.fillRoundedRect(r.x, r.y, r.w, r.h, 12);
      this.g.lineStyle(2, 0xffffff, active ? 0.7 : 0.34);
      this.g.strokeRoundedRect(r.x, r.y, r.w, r.h, 12);
    });
  }

  private indexAt(x: number, y: number): number | null {
    for (let i = 0; i < this.rects.length; i += 1) {
      const r = this.rects[i];
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return i;
    }
    return null;
  }

  private onDown(p: Phaser.Input.Pointer): void {
    const i = this.indexAt(p.x, p.y);
    if (i === null) return;
    this.pending = this.specs[i].anim;
    this.pressed = i;
    this.redraw();
    this.scene.time.delayedCall(FLASH_MS, () => {
      this.pressed = null;
      this.redraw();
    });
  }

  /** True when a pointer landed on a button, so movement should ignore it. */
  contains(x: number, y: number): boolean {
    return this.indexAt(x, y) !== null;
  }

  /** Animation requested since the last call, if any. */
  consumePressed(): string | null {
    const a = this.pending;
    this.pending = null;
    return a;
  }

  displayObjects(): Phaser.GameObjects.GameObject[] {
    return [this.g, ...this.labels];
  }

  destroy(): void {
    this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.onDown, this);
    this.scene.scale.off(Phaser.Scale.Events.RESIZE, this.layout, this);
    this.g.destroy();
    this.labels.forEach((l) => l.destroy());
  }
}
