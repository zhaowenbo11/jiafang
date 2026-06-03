export type BusinessId = "wedding" | "custom";

export type Screen = "entry" | "demo";

export type FabricPattern =
  | "embroidery"
  | "jacquard"
  | "gift"
  | "tailor"
  | "luxe"
  | "gold";

export type PreviewOverlayRegion = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: string;
  rotation?: number;
  opacity?: number;
};

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
  pattern: FabricPattern;
};

export type TemplateOption = {
  name: string;
  detail: string;
  previewTag: string;
  layout: "hero";
  baseImageUrl: string;
  overlayRegions: PreviewOverlayRegion[];
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
  pattern: FabricPattern;
};

export type GeneratedPreview = {
  imageUrl: string;
  prompt: string;
  provider: "mock" | "flux" | "qwen" | "wanx" | "jimeng";
  generatedAt: string;
  debug?: {
    mode: "real" | "fallback";
    status?: number;
    endpoint?: string;
    model?: string;
    responseSnippet?: string;
    message?: string;
    meta?: {
      reqKey?: string;
      inputMode?: "image_urls" | "binary_data_base64" | "mixed" | "unknown";
      imageCount?: number;
      size?: string;
      width?: number;
      height?: number;
      usedImageUrls?: string[];
      localImagePaths?: string[];
    };
  };
};

export type PreviewTemplateType = "hero";

export type PreviewJobStatus = "queued" | "processing" | "succeeded" | "failed";

export type PreviewGenerationStage = "instant_preview" | "ai_render";

export type PreviewOutputGoal = "sales_preview" | "realistic_render";

export type PreviewRequestPayload = {
  businessId: BusinessId;
  fabricId: string;
  templateType: PreviewTemplateType;
  templateName: string;
  generationStage?: PreviewGenerationStage;
  outputGoal?: PreviewOutputGoal;
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

export type PromptTemplateKey = "wedding_hero" | "custom_hero";

export type PreviewPromptTemplate = {
  key: PromptTemplateKey;
  businessId: BusinessId;
  templateType: PreviewTemplateType;
  title: string;
  summary: string;
  systemPrompt: string;
  userPrompt: string;
  negativePrompt: string;
};

export type PreviewPromptBundle = {
  templateKey: PromptTemplateKey;
  title: string;
  summary: string;
  systemPrompt: string;
  userPrompt: string;
  negativePrompt: string;
  composedPrompt: string;
};

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

export type PreviewAiRequestParams = {
  provider: "mock" | "flux" | "qwen" | "wanx" | "jimeng";
  model: string;
  stage: PreviewGenerationStage;
  outputGoal: PreviewOutputGoal;
  promptTemplateKey: PromptTemplateKey;
  promptTitle: string;
  systemPrompt: string;
  userPrompt: string;
  negativePrompt: string;
  prompt: string;
  aspectRatio: string;
  size: string;
  quality: "standard" | "high";
  imageInputs: PreviewImageInputs;
  constraints: {
    preserveRoomLayout: boolean;
    preserveCameraAngle: boolean;
    preserveBedStructure: boolean;
    keepFabricTrueToLife: boolean;
    forbidPartialReplacement: boolean;
    forbidPatternRecreation: boolean;
    salesPhotoRealism: boolean;
    replaceRegions: string[];
  };
};

export type PreviewJobRecord = {
  id: string;
  status: PreviewJobStatus;
  request: PreviewRequestPayload;
  imageInputs?: PreviewImageInputs;
  prompt: string;
  promptBundle: PreviewPromptBundle;
  aiRequest: PreviewAiRequestParams;
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
