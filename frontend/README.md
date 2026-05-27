# 家纺门店 AI 选布预览

这是一个基于 `Next.js 16` 的门店选布演示系统，当前已经切换为前后端一体模式。

支持的业务板块：

- 婚庆家纺
- 高端手工定制
- 儿童床上用品

## 当前能力

- 首屏业务分流
- 二屏布料分类选择
- 模板切换
- 右侧成品效果预览
- `GET /api/showroom`
- `GET /api/fabrics`
- `GET /api/fabrics/[id]`

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
- `database/schema.sql`

## 下一阶段重点

- 接入真实数据库
- 导入布料和图片数据
- 开发布料后台管理
- 接入更真实的成品预览能力

## 部署建议

适合部署到支持 Node.js 的环境，例如：

- 阿里云 ECS + Nginx + PM2
- 腾讯云轻量服务器
- 阿里云服务器 + Docker
- 任意支持 Next.js 的云主机
