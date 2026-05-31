import { getTemplateRegistryItem } from "./template-registry";
import { buildPreviewPrompt } from "./prompt-builder";
import type {
  FabricLibraryItem,
  PreviewJobRecord,
  PreviewRequestPayload,
} from "./types";

const previewJobStore = new Map<string, PreviewJobRecord>();

function inferColorName(fabric: FabricLibraryItem) {
  if (fabric.name.includes("豆沙粉")) return "豆沙粉";
  if (fabric.name.includes("酒红")) return "酒红";
  return "未标注";
}

export function createPreviewJob(
  payload: PreviewRequestPayload,
  fabric: FabricLibraryItem
) {
  const template = getTemplateRegistryItem(payload.businessId, payload.templateType);

  if (!template) {
    throw new Error("Template registry item not found");
  }

  const prompt = buildPreviewPrompt({
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

  const now = new Date().toISOString();
  const job: PreviewJobRecord = {
    id: `job_${Date.now()}`,
    status: "queued",
    request: payload,
    imageInputs: {
      fabricImageUrl: fabric.imageUrl,
      fabricDetailImageUrl: fabric.detailImageUrl,
      templateBaseImageUrl: template.baseImageUrl,
    },
    prompt,
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
