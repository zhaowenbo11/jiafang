import type {
  BusinessId,
  PreviewTemplateType,
  TemplateRegistryItem,
} from "./types";

const templateRegistry: TemplateRegistryItem[] = [
  {
    businessId: "wedding",
    templateType: "hero",
    templateName: "婚房正视图",
    sceneDescription: "中式轻奢婚房主卧，1.8米床，整套床品完整铺陈，主视角展示。",
    baseImageUrl: "/templates/wedding-hero.jpg",
  },
  {
    businessId: "wedding",
    templateType: "scene",
    templateName: "床尾氛围图",
    sceneDescription: "婚房主卧床尾区域，展示靠垫、床尾巾和礼盒氛围。",
    baseImageUrl: "/templates/wedding-scene-placeholder.jpg",
  },
  {
    businessId: "wedding",
    templateType: "detail",
    templateName: "局部刺绣图",
    sceneDescription: "婚庆床品局部特写，展示花型、反光、缎面和工艺细节。",
    baseImageUrl: "/templates/wedding-detail-placeholder.jpg",
  },
  {
    businessId: "custom",
    templateType: "hero",
    templateName: "高定正视图",
    sceneDescription: "高端主卧空间，2.0米大床，整体高级、克制、精致。",
    baseImageUrl: "/templates/custom-hero.jpg",
  },
  {
    businessId: "custom",
    templateType: "scene",
    templateName: "高级氛围图",
    sceneDescription: "高端主卧空间搭配图，展示床品与软装的整体协调感。",
    baseImageUrl: "/templates/custom-scene-placeholder.jpg",
  },
  {
    businessId: "custom",
    templateType: "detail",
    templateName: "工艺细节图",
    sceneDescription: "高端定制床品局部工艺特写，展示纹理、边角和反光细节。",
    baseImageUrl: "/templates/custom-detail-placeholder.jpg",
  },
];

export function getTemplateRegistryItem(
  businessId: BusinessId,
  templateType: PreviewTemplateType
) {
  return (
    templateRegistry.find(
      (item) =>
        item.businessId === businessId && item.templateType === templateType
    ) ?? null
  );
}
