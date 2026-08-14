/** Classic 2:1 diamond isometric projection, per the project rendering plan. */

export const TILE_W = 128;
export const TILE_H = 64;

export interface Vec2 {
  x: number;
  y: number;
}

/** Grid coordinates (tiles, fractional) to screen pixels. */
export function gridToScreen(gx: number, gy: number): Vec2 {
  return {
    x: (gx - gy) * (TILE_W / 2),
    y: (gx + gy) * (TILE_H / 2),
  };
}

/** Screen pixels back to grid coordinates. Inverse of `gridToScreen`. */
export function screenToGrid(sx: number, sy: number): Vec2 {
  const hx = sx / (TILE_W / 2);
  const hy = sy / (TILE_H / 2);
  return {
    x: (hx + hy) / 2,
    y: (hy - hx) / 2,
  };
}

/**
 * The four isometric movement axes. On a 2:1 diamond these are the grid's own
 * axes, which is why they read as diagonals on screen — and they are exactly
 * the four directions Comira has authored walk cycles for.
 */
export type Facing = "SE" | "SW" | "NW" | "NE";

export const FACING_STEP: Record<Facing, Vec2> = {
  SE: { x: 1, y: 0 },
  SW: { x: 0, y: 1 },
  NW: { x: -1, y: 0 },
  NE: { x: 0, y: -1 },
};

/**
 * Pick a facing from a screen-space direction. Each isometric axis owns one
 * screen quadrant, so the quadrant of the movement vector is the facing.
 */
export function facingFromScreen(dx: number, dy: number): Facing {
  if (dy >= 0) return dx >= 0 ? "SE" : "SW";
  return dx >= 0 ? "NE" : "NW";
}

/** Depth key so nearer tiles and actors draw over farther ones. */
export function depthFor(gx: number, gy: number): number {
  return (gx + gy) * 16;
}
