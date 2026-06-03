import { previewPromptTemplates } from "./prompt-templates";
import type {
  BusinessId,
  PreviewPromptBundle,
  PreviewPromptContext,
  PromptTemplateKey,
} from "./types";

function resolveTemplateKey(
  businessId: BusinessId,
  templateType: PreviewPromptContext["templateType"]
): PromptTemplateKey {
  return `${businessId}_${templateType}` as PromptTemplateKey;
}

function fillTemplate(template: string, context: PreviewPromptContext) {
  return template
    .replaceAll("{{fabricName}}", context.fabricName)
    .replaceAll("{{fabricCategory}}", context.fabricCategory)
    .replaceAll("{{colorName}}", context.colorName)
    .replaceAll("{{material}}", context.material)
    .replaceAll("{{craft}}", context.craft)
    .replaceAll("{{templateName}}", context.templateName)
    .replaceAll("{{sceneDescription}}", context.sceneDescription);
}

export function buildPreviewPrompt(
  context: PreviewPromptContext
): PreviewPromptBundle {
  const templateKey = resolveTemplateKey(context.businessId, context.templateType);
  const template = previewPromptTemplates[templateKey];
  const userPrompt = fillTemplate(template.userPrompt, context);
  const composedPrompt = [
    `系统角色：${template.systemPrompt}`,
    userPrompt,
    `负向约束：${template.negativePrompt}`,
  ].join("\n\n");

  return {
    templateKey,
    title: template.title,
    summary: template.summary,
    systemPrompt: template.systemPrompt,
    userPrompt,
    negativePrompt: template.negativePrompt,
    composedPrompt,
  };
}
