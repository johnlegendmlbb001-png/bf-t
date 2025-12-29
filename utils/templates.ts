import { useStore } from "@/store/useStore";

const KEY = "skin_grid_templates";
const MAX_TEMPLATES = 2;

/* ---------------- SAVE ---------------- */

export function saveTemplate() {
  const state = useStore.getState();

  const template = {
    id: Date.now(),
    data: {
      /* GRID */
      selectedSkins: state.selectedSkins,
      columns: state.columns,

      /* BASE */
      profileImage: state.profileImage,

      /* LEFT */
      collectionImage: state.collectionImage,
      weeklyImage: state.weeklyImage,

      /* RIGHT */
      doubleDiamondImage: state.doubleDiamondImage,
      fullSetImages: state.fullSetImages,
      mainHeroImages: state.mainHeroImages,

      /* OVERLAYS */
      tagImages: state.tagImages,
      miscImages: state.miscImages,

      /* FILTER */
      activeCategory: state.activeCategory,
    },
  };

  const existing = JSON.parse(
    localStorage.getItem(KEY) || "[]"
  );

  if (existing.length >= MAX_TEMPLATES) {
    throw new Error("Template limit reached (max 2)");
  }

  localStorage.setItem(
    KEY,
    JSON.stringify([...existing, template])
  );
}

/* ---------------- GET ---------------- */

export function getTemplates() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

/* ---------------- LOAD ---------------- */

export function loadTemplate(templateData: any) {
  const set = useStore.setState;

  set({
    /* GRID */
    selectedSkins: templateData.selectedSkins ?? [],
    columns: templateData.columns ?? 5,

    /* BASE */
    profileImage: templateData.profileImage ?? null,

    /* LEFT */
    collectionImage: templateData.collectionImage ?? null,
    weeklyImage: templateData.weeklyImage ?? null,

    /* RIGHT */
    doubleDiamondImage:
      templateData.doubleDiamondImage ?? null,
    fullSetImages: templateData.fullSetImages ?? [],
    mainHeroImages: templateData.mainHeroImages ?? [],

    /* OVERLAYS */
    tagImages: templateData.tagImages ?? {},
    miscImages: templateData.miscImages ?? [],

    /* FILTER */
    activeCategory:
      templateData.activeCategory ?? "all",
  });
}

/* ---------------- DELETE ---------------- */

export function deleteTemplate(id: number) {
  const templates = getTemplates().filter(
    (t: any) => t.id !== id
  );

  localStorage.setItem(KEY, JSON.stringify(templates));
}
