export type BusinessId = "wedding" | "custom" | "kids";

export type Screen = "entry" | "demo";

export type FabricOption = {
  name: string;
  detail: string;
  category: string;
  swatch: string;
  secondarySwatch: string;
  detailSwatch: string;
  previewGradient: string;
  previewLabel: string;
  pattern:
    | "embroidery"
    | "jacquard"
    | "gift"
    | "tailor"
    | "luxe"
    | "gold"
    | "cloud"
    | "forest"
    | "stars";
};

export type TemplateOption = {
  name: string;
  detail: string;
  previewTag: string;
  layout: "hero" | "detail" | "scene";
};

export type FabricLibraryItem = {
  id: string;
  business: BusinessId;
  category: string;
  name: string;
  material: string;
  craft: string;
  season: string;
  priceRange: string;
  tags: string[];
  description: string;
  swatch: string;
  secondarySwatch: string;
  detailSwatch: string;
  previewGradient: string;
  previewLabel: string;
  pattern:
    | "embroidery"
    | "jacquard"
    | "gift"
    | "tailor"
    | "luxe"
    | "gold"
    | "cloud"
    | "forest"
    | "stars";
};

export type BusinessConfig = {
  id: BusinessId;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  accentSoft: string;
  tone: string;
  quickStats: string[];
  customerProfile: string;
  fabricCategories: string[];
  fabricCategoryBindings: Record<string, number>;
  fabrics: FabricOption[];
  templates: TemplateOption[];
  resultTitle: string;
  resultSummary: string;
  resultTemplateSummary: string;
  actions: string[];
  palette: string[];
};
