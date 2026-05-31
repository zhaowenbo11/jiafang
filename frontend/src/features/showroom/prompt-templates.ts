import type { PromptTemplateKey } from "./types";

export const previewPromptTemplates: Record<PromptTemplateKey, string> = {
  wedding_hero: `
任务：
根据提供的真实布料参考图，生成婚庆家纺床上成品效果图。

业务类型：
婚庆家纺

布料信息：
布料名称：{{fabricName}}
布料分类：{{fabricCategory}}
颜色：{{colorName}}
材质：{{material}}
工艺：{{craft}}

模板信息：
模板名称：{{templateName}}
场景描述：{{sceneDescription}}

要求：
1. 严格保留布料原始颜色、花卉纹样、缎面反光和真实质感
2. 生成 1.8 米婚房主卧床品完整铺陈效果
3. 画面真实自然，适合门店销售展示
4. 不要夸张艺术化，不要改变原布料主色和纹样
`.trim(),
  wedding_scene: `
任务：
根据提供的真实布料参考图，生成婚庆家纺床尾氛围效果图。

业务类型：
婚庆家纺

布料信息：
布料名称：{{fabricName}}
布料分类：{{fabricCategory}}
颜色：{{colorName}}
材质：{{material}}
工艺：{{craft}}

模板信息：
模板名称：{{templateName}}
场景描述：{{sceneDescription}}

要求：
1. 严格保留布料原始颜色和花卉细节
2. 重点展示床尾巾、靠垫和整体氛围搭配
3. 适合客户判断婚房成套效果
4. 画面真实、柔和，不要夸张概念化
`.trim(),
  wedding_detail: `
任务：
根据提供的真实布料参考图，生成婚庆家纺局部工艺特写图。

业务类型：
婚庆家纺

布料信息：
布料名称：{{fabricName}}
布料分类：{{fabricCategory}}
颜色：{{colorName}}
材质：{{material}}
工艺：{{craft}}

模板信息：
模板名称：{{templateName}}
场景描述：{{sceneDescription}}

要求：
1. 清晰展示布料纹理、反光和花卉细节
2. 不要生成与原图不一致的假纹理
3. 适合客户近距离判断工艺品质
`.trim(),
  custom_hero: `
任务：
根据提供的真实布料参考图，生成高端手工定制床上成品效果图。

业务类型：
高端手工定制

布料信息：
布料名称：{{fabricName}}
布料分类：{{fabricCategory}}
颜色：{{colorName}}
材质：{{material}}
工艺：{{craft}}

模板信息：
模板名称：{{templateName}}
场景描述：{{sceneDescription}}

要求：
1. 严格保留布料原始颜色、纹理、反光和工艺特征
2. 突出高级感、定制感和整体空间格调
3. 适合高客单客户选款沟通
4. 不要过度奢华浮夸，不要失真
`.trim(),
  custom_scene: `
任务：
根据提供的真实布料参考图，生成高端手工定制空间氛围图。

业务类型：
高端手工定制

布料信息：
布料名称：{{fabricName}}
布料分类：{{fabricCategory}}
颜色：{{colorName}}
材质：{{material}}
工艺：{{craft}}

模板信息：
模板名称：{{templateName}}
场景描述：{{sceneDescription}}

要求：
1. 保留真实布料色调和材质表现
2. 突出空间气质、软装协调和高定氛围
3. 适合高端客户判断整体搭配效果
`.trim(),
  custom_detail: `
任务：
根据提供的真实布料参考图，生成高端手工定制工艺特写图。

业务类型：
高端手工定制

布料信息：
布料名称：{{fabricName}}
布料分类：{{fabricCategory}}
颜色：{{colorName}}
材质：{{material}}
工艺：{{craft}}

模板信息：
模板名称：{{templateName}}
场景描述：{{sceneDescription}}

要求：
1. 清晰展示边角、纹理、反光和工艺层次
2. 强调精致、克制和高级质感
3. 适合高端客户近距离判断品质
`.trim(),
};
