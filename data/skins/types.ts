/* ---------------- TYPES ---------------- */

export type SkinCategory =
  | "legend"
  | "grand"
  | "exquisite"
  | "deluxe"
  | "exceptional"
  | "common";

/* 🔮 Sub-category (event / batch / season etc.) */
export type SkinSubCategory = string;

/* ---------------- SKIN MODEL ---------------- */

export type SkinItem = {
  id: string;
  image: string;
  category: SkinCategory;
  subCategory: SkinSubCategory; // required
};
