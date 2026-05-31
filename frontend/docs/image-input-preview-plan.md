# 真实布料图驱动预览方案

## 当前目标

门店系统需要基于以下输入生成床品成品效果图：

- 布料主图
- 布料细节图
- 床品模板图
- 业务类型
- 模板类型

当前接入方案以 `FLUX.2` 为主：

- 模板床图作为主输入图
- 布料主图和布料细节图作为额外参考图
- 后端自动拼装提示词
- 生成婚庆 / 高端定制成品预览

## 当前代码状态

已接入的数据结构：

- `fabricImageUrl`
- `fabricDetailImageUrl`
- `templateBaseImageUrl`

已接入的服务链路：

- `PreviewImageInputs`
- `PreviewJobRecord.imageInputs`
- `POST /api/preview`

## 当前模型策略

### 1. FLUX.2

当前推荐主方案。

特点：

- 支持多参考图
- 更适合“模板图 + 布料主图 + 布料细节图”联合驱动
- 更符合“高度还原布料”的目标

### 2. FLUX.1 Kontext Pro

仅作为备选。

局限：

- 更偏单主图编辑
- 对真实布料还原的上限低于 `FLUX.2`

## 当前后端实现

`src/features/showroom/ai-preview.ts` 已按 FLUX 模式重构：

- 根据 `BFL_IMAGE_PROVIDER` 选择 provider
- 默认走 `flux`
- 支持 FLUX 创建任务
- 支持轮询 `polling_url`
- 支持本地 `public/` 图片自动转 base64
- 上游失败时自动回退到 mock 预览

## 环境变量

`.env.local` 建议配置：

```bash
BFL_API_BASE_URL=https://api.bfl.ai/v1
BFL_API_KEY=your_key
BFL_IMAGE_PROVIDER=flux
BFL_IMAGE_MODEL=flux-2-pro-preview
BFL_FLUX_TIMEOUT_MS=45000
BFL_FLUX_POLL_INTERVAL_MS=500
```

## 当前输入规则

### 当模型是 `flux-2-*`

- `input_image` 使用模板床图
- `input_image_2` 使用布料主图
- `input_image_3` 使用布料细节图

### 当模型是 `flux-kontext-pro`

- `input_image` 使用模板床图
- 布料主图和细节图暂不作为额外图片输入
- 布料信息通过提示词约束输出

## 下一步

1. 将 `.env.local` 切换到 BFL 官方 `flux-2-pro-preview`
2. 真实测试婚庆模板图生成
3. 真实测试高端定制模板图生成
4. 如需更稳定的固定版本，再切到 `flux-2-pro`
