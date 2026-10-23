import type { IconName } from "@/content/site/types";

/** One icon per stage, in lifecycle order (as on the home page). */
export const STAGE_ICONS: IconName[] = ["id", "shield", "fileCheck", "tooth", "send", "coins", "refresh", "chart"];

export const pad = (n: number) => String(n).padStart(2, "0");
