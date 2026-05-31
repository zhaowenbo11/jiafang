# 家纺门店 AI 选布预览

这是一个基于 `Next.js 16` 的门店选布演示系统，当前为前后端一体模式。

当前支持的业务板块：

- 婚庆家纺
- 高端手工定制
- 儿童床上用品

## 当前能力

- 第一屏业务分流
- 第二屏布料分类选择
- 模板切换
- 右侧成品效果预览
- `GET /api/showroom`
- `GET /api/fabrics`
- `GET /api/fabrics/[id]`
- `POST /api/preview`

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`

## 构建检查

```bash
npm run build
```

## 文档

- `docs/project-status.md`
- `docs/backend-plan.md`
- `docs/image-input-preview-plan.md`
- `database/schema.sql`

## AI 预览配置

推荐直接使用 BFL 官方：

```bash
BFL_API_BASE_URL=https://api.bfl.ai/v1
BFL_API_KEY=你的key
BFL_IMAGE_PROVIDER=flux
BFL_IMAGE_MODEL=flux-2-pro-preview
BFL_FLUX_TIMEOUT_MS=45000
BFL_FLUX_POLL_INTERVAL_MS=500
```

说明：

- `/api/preview` 当前优先按 FLUX 图片编辑链路调用
- 当前默认适配 `flux-2-pro-preview`
- 若后续需要固定稳定版本，可切到 `flux-2-pro`
- 如果没有配置 `BFL_API_KEY`，或上游调用失败，系统会自动回退到 mock 预览
- 旧的 `KL_*` 环境变量仍兼容，但不再推荐

## 当前 AI 方案

当前项目目标不是普通文生图，而是：

- 用真实布料图做参考
- 用床品模板图控制构图
- 生成更接近真实销售展示的床品成品图

当前方案：

- 模板床图作为主输入图
- 后端自动拼接提示词
- `FLUX.2` 联合使用模板图、布料主图、布料细节图，提升布料还原度

## 下一阶段重点

- 补充真实布料库数据
- 按单款布料拆分图片与变体
- 补充后台布料管理
- 优化真实成品预览效果

## 部署建议

适合部署到支持 `Node.js` 的环境，例如：

- 阿里云 ECS + Nginx + PM2
- 腾讯云轻量服务器
- 阿里云服务器 + Docker
- 任意支持 Next.js 的云主机
