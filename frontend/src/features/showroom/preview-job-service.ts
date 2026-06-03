import { buildPreviewPrompt } from "./prompt-builder";
import { getTemplateRegistryItem } from "./template-registry";
import type {
  FabricLibraryItem,
  PreviewAiRequestParams,
  PreviewJobRecord,
  PreviewRequestPayload,
} from "./types";

const previewJobStore = new Map<string, PreviewJobRecord>();

function inferColorName(fabric: FabricLibraryItem) {
  if (fabric.name.includes("豆沙粉")) return "豆沙粉";
  if (fabric.name.includes("酒红")) return "酒红";
  if (fabric.name.includes("暖红")) return "暖红";
  return "待补充";
}

function resolveProvider(): PreviewAiRequestParams["provider"] {
  const provider = (
    process.env.JIMENG_IMAGE_PROVIDER ||
    process.env.BFL_IMAGE_PROVIDER ||
    process.env.KL_IMAGE_PROVIDER ||
    "flux"
  ).trim();

  if (provider === "qwen" || provider === "wanx" || provider === "jimeng") {
    return provider;
  }

  if (provider === "mock") {
    return "mock";
  }

  return "flux";
}

function resolveModel(provider: PreviewAiRequestParams["provider"]) {
  if (provider === "jimeng") {
    return (
      process.env.JIMENG_IMAGE_MODEL?.trim() || "jimeng_seedream46_cvtob"
    );
  }

  if (provider === "qwen") {
    return process.env.QWEN_IMAGE_MODEL?.trim() || "qwen-image-2.0-pro";
  }

  if (provider === "wanx") {
    return process.env.WANX_IMAGE_MODEL?.trim() || "wanx2.1-imageedit";
  }

  if (provider === "mock") {
    return "mock";
  }

  return (
    process.env.BFL_IMAGE_MODEL ||
    process.env.KL_IMAGE_MODEL ||
    "flux-2-pro-preview"
  ).trim();
}

function buildAiRequest(
  payload: PreviewRequestPayload,
  promptBundle: ReturnType<typeof buildPreviewPrompt>,
  templateBaseImageUrl: string | undefined,
  fabric: FabricLibraryItem
): PreviewAiRequestParams {
  const provider = resolveProvider();

  return {
    provider,
    model: resolveModel(provider),
    stage: payload.generationStage ?? "ai_render",
    outputGoal: payload.outputGoal ?? "sales_preview",
    promptTemplateKey: promptBundle.templateKey,
    promptTitle: promptBundle.title,
    systemPrompt: promptBundle.systemPrompt,
    userPrompt: promptBundle.userPrompt,
    negativePrompt: promptBundle.negativePrompt,
    prompt: promptBundle.composedPrompt,
    aspectRatio: "4:3",
    size: "1536x1152",
    quality: "high",
    imageInputs: {
      templateBaseImageUrl,
      fabricImageUrl: fabric.imageUrl,
      fabricDetailImageUrl: fabric.detailImageUrl,
    },
    constraints: {
      preserveRoomLayout: true,
      preserveCameraAngle: true,
      preserveBedStructure: true,
      keepFabricTrueToLife: true,
      forbidPartialReplacement: true,
      forbidPatternRecreation: true,
      salesPhotoRealism: true,
      replaceRegions: ["床单", "被套正面", "左枕套", "右枕套"],
    },
  };
}

export function createPreviewJob(
  payload: PreviewRequestPayload,
  fabric: FabricLibraryItem
) {
  const template = getTemplateRegistryItem(payload.businessId, payload.templateType);

  if (!template) {
    throw new Error("Template registry item not found");
  }

  const promptBundle = buildPreviewPrompt({
    businessId: payload.businessId,
    fabricName: fabric.name,
    fabricCategory: fabric.category,
    colorName: inferColorName(fabric),
    material: fabric.material,
    craft: fabric.craft,
    templateType: payload.templateType,
    templateName: template.templateName,
    sceneDescription: template.sceneDescription,
  });

  const aiRequest = buildAiRequest(
    payload,
    promptBundle,
    template.baseImageUrl,
    fabric
  );
  const now = new Date().toISOString();
  const job: PreviewJobRecord = {
    id: `job_${Date.now()}`,
    status: "queued",
    request: payload,
    imageInputs: aiRequest.imageInputs,
    prompt: promptBundle.composedPrompt,
    promptBundle,
    aiRequest,
    createdAt: now,
    updatedAt: now,
  };

  previewJobStore.set(job.id, job);
  return job;
}

export function updatePreviewJob(
  jobId: string,
  updates: Partial<PreviewJobRecord>
) {
  const existing = previewJobStore.get(jobId);
  if (!existing) return null;

  const next: PreviewJobRecord = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  previewJobStore.set(jobId, next);
  return next;
}

export function getPreviewJob(jobId: string) {
  return previewJobStore.get(jobId) ?? null;
}
