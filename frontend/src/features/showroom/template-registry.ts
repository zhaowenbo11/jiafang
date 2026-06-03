import type {
  BusinessId,
  PreviewTemplateType,
  TemplateRegistryItem,
} from "./types";

const templateRegistry: TemplateRegistryItem[] = [
  {
    businessId: "wedding",
    templateType: "hero",
    templateName: "婚床主模板",
    sceneDescription:
      "婚庆家纺门店主模板，固定婚床构图，重点展示床单、被面和枕套在婚房中的整体视觉效果。",
    baseImageUrl:
      "https://tyidklw-web.oss-cn-beijing.aliyuncs.com/templates/wedding-hero.png",
  },
  {
    businessId: "custom",
    templateType: "hero",
    templateName: "主卧主模板",
    sceneDescription:
      "高端定制门店主模板，固定主卧构图，重点展示床单、被面和枕套在主卧场景中的整体成品质感。",
    baseImageUrl:
      "https://tyidklw-web.oss-cn-beijing.aliyuncs.com/templates/custom-hero.png",
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
