/* ---------------- TYPES ---------------- */
export * from "./skins/types";

/* ---------------- CATEGORY LIST ---------------- */

import type { SkinCategory } from "./skins/types";

export const SKIN_CATEGORIES: SkinCategory[] = [
  "legend",
  "grand",
  "exquisite",
  "deluxe",
  "exceptional",
  "common",
];

/* ---------------- SKINS ---------------- */

import { legendSkins } from "./skins/legend";
import { grandSkins } from "./skins/grand";
import { exquisiteSkins } from "./skins/exquisite";
import { deluxeSkins } from "./skins/deluxe";
import { exceptionalSkins } from "./skins/exceptional";
import { commonSkins } from "./skins/common";

export const skins = [
  ...legendSkins,
  ...grandSkins,
  ...exquisiteSkins,
  ...deluxeSkins,
  ...exceptionalSkins,
  ...commonSkins,
];
