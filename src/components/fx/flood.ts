import type { PointerEvent } from "react";

/**
 * Light-theme hover for cards: records where the pointer entered (or left) the
 * card as --fx/--fy, so the white disc behind the content grows from, and
 * drains back to, that point. Use on both onPointerEnter and onPointerLeave.
 */
export function setFloodOrigin(e: PointerEvent<HTMLElement>) {
  const card = e.currentTarget;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--fx", `${e.clientX - r.left}px`);
  card.style.setProperty("--fy", `${e.clientY - r.top}px`);
}
