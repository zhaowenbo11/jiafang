export type BusinessId = "wedding" | "custom" | "kids";

export type Screen = "entry" | "demo";

export type FabricOption = {
  name: string;
  detail: string;
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
  fabrics: FabricOption[];
  templates: TemplateOption[];
  resultTitle: string;
  resultSummary: string;
  resultTemplateSummary: string;
  actions: string[];
  palette: string[];
};
