export const accents = [
  { id: "cyan", label: "Cyan", swatch: "#0891b2" },
  { id: "purple", label: "Purple", swatch: "#7c3aed" },
  { id: "emerald", label: "Emerald", swatch: "#059669" },
] as const;

export type AccentId = (typeof accents)[number]["id"];

export function isAccentId(value: string | null): value is AccentId {
  return accents.some((accent) => accent.id === value);
}

export function applyAccent(accent: AccentId) {
  document.documentElement.dataset.accent = accent;
  localStorage.setItem("accent", accent);
}
