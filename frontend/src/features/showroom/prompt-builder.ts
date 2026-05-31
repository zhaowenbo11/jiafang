import { previewPromptTemplates } from "./prompt-templates";
import type {
  BusinessId,
  PreviewPromptContext,
  PromptTemplateKey,
} from "./types";

function resolveTemplateKey(
  businessId: BusinessId,
  templateType: PreviewPromptContext["templateType"]
): PromptTemplateKey {
  return `${businessId}_${templateType}` as PromptTemplateKey;
}

export function buildPreviewPrompt(context: PreviewPromptContext) {
  const templateKey = resolveTemplateKey(context.businessId, context.templateType);
  const template = previewPromptTemplates[templateKey];

  return template
    .replaceAll("{{fabricName}}", context.fabricName)
    .replaceAll("{{fabricCategory}}", context.fabricCategory)
    .replaceAll("{{colorName}}", context.colorName)
    .replaceAll("{{material}}", context.material)
    .replaceAll("{{craft}}", context.craft)
    .replaceAll("{{templateName}}", context.templateName)
    .replaceAll("{{sceneDescription}}", context.sceneDescription);
}
