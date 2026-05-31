export type BusinessId = "wedding" | "custom" | "kids";

export type Screen = "entry" | "demo";

export type FabricOption = {
  id?: string;
  name: string;
  detail: string;
  category: string;
  swatch: string;
  secondarySwatch: string;
  detailSwatch: string;
  previewGradient: string;
  previewLabel: string;
  imageUrl?: string;
  detailImageUrl?: string;
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
  imageUrl?: string;
  detailImageUrl?: string;
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

export type GeneratedPreview = {
  imageUrl: string;
  prompt: string;
  provider: "mock" | "flux";
  generatedAt: string;
  debug?: {
    mode: "real" | "fallback";
    status?: number;
    endpoint?: string;
    model?: string;
    responseSnippet?: string;
    message?: string;
  };
};

export type PreviewTemplateType = "hero" | "scene" | "detail";

export type PreviewJobStatus = "queued" | "processing" | "succeeded" | "failed";

export type PreviewRequestPayload = {
  businessId: BusinessId;
  fabricId: string;
  templateType: PreviewTemplateType;
  templateName: string;
};

export type PreviewImageInputs = {
  fabricImageUrl?: string;
  fabricDetailImageUrl?: string;
  templateBaseImageUrl?: string;
};

export type TemplateRegistryItem = {
  businessId: BusinessId;
  templateType: PreviewTemplateType;
  templateName: string;
  sceneDescription: string;
  baseImageUrl?: string;
};

export type PromptTemplateKey =
  | "wedding_hero"
  | "wedding_scene"
  | "wedding_detail"
  | "custom_hero"
  | "custom_scene"
  | "custom_detail";

export type PreviewPromptContext = {
  businessId: BusinessId;
  fabricName: string;
  fabricCategory: string;
  colorName: string;
  material: string;
  craft: string;
  templateType: PreviewTemplateType;
  templateName: string;
  sceneDescription: string;
};

export type PreviewJobRecord = {
  id: string;
  status: PreviewJobStatus;
  request: PreviewRequestPayload;
  imageInputs?: PreviewImageInputs;
  prompt: string;
  resultImageUrl?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
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
