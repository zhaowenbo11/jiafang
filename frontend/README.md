# 家纺门店 AI 选布预览

这是一个基于 `Next.js 16` 的门店选布演示系统，当前采用前后端一体模式。

当前支持的业务板块：

- 婚庆家纺
- 高端手工定制

## 当前能力

- 第一屏业务分流
- 第二屏布料分类选择
- 固定主模板即时预览
- 确认后调用 AI 生成成品图
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
- `docs/server-deploy.md`
- `database/schema.sql`

## AI 预览配置

### 推荐方案：即梦 AI

项目当前已经接入火山引擎即梦图生图异步任务链路，推荐优先使用：

```bash
JIMENG_IMAGE_PROVIDER=jimeng
JIMENG_IMAGE_MODEL=jimeng_seedream46_cvtob
JIMENG_REQ_KEY=jimeng_seedream46_cvtob
JIMENG_AK=你的AccessKeyID
JIMENG_SK=你的AccessKeySecret
JIMENG_API_HOST=visual.volcengineapi.com
JIMENG_REGION=cn-north-1
JIMENG_SERVICE=cv
JIMENG_TIMEOUT_MS=60000
JIMENG_POLL_INTERVAL_MS=1500
```

说明：

- `/api/preview` 当前支持 `jimeng` provider
- 当前按“模板图 + 布料主图 + 布料细节图 + 固定提示词模板”的方式提交即梦任务
- 当前默认使用 `jimeng_seedream46_cvtob`
- 如果未配置 `JIMENG_AK / JIMENG_SK`，系统会自动回退到 mock 预览

### 备选方案：FLUX

如需保留旧链路，可配置：

```bash
BFL_API_BASE_URL=https://api.bfl.ai/v1
BFL_API_KEY=你的key
BFL_IMAGE_PROVIDER=flux
BFL_IMAGE_MODEL=flux-2-pro-preview
BFL_FLUX_TIMEOUT_MS=45000
BFL_FLUX_POLL_INTERVAL_MS=500
```

## 当前 AI 方案

当前目标不是普通文生图，而是：

- 使用真实布料图做参考
- 使用床品模板图控制构图
- 生成更接近真实销售展示的床品成品图

当前方案：

- 模板底图用于即时预览
- 后端自动拼装业务提示词、负向约束和模型参数
- AI 调用保留完整任务结构，便于后续切换模型或接数据库

## 生产部署

适合部署到支持 `Node.js` 的环境，例如：

- 阿里云 ECS + Nginx + PM2
- 腾讯云轻量服务器
- 阿里云服务器 + Docker
- 任意支持 Next.js 的 Linux 主机

详细步骤见 [docs/server-deploy.md](./docs/server-deploy.md)
