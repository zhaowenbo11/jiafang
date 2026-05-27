# 后端方案

## 目标

- 前端和后端保留在同一个 Next.js 项目中。
- 先把布料数据、分类、模板、预览任务统一成 API。
- 后续再把数据源从本地 mock 切到真实数据库。

## 技术选择

- 框架：Next.js App Router
- 接口：Route Handler
- 数据层：先抽象 repository，再接真实数据库
- 数据库：生产建议 PostgreSQL 或 MySQL；本地开发可先用 SQLite

## 当前接口

- `GET /api/showroom`
- `GET /api/fabrics?business=wedding`
- `GET /api/fabrics?business=custom&category=悦锦缎`
- `GET /api/fabrics/:id`

## 生产表

- `businesses`
- `fabric_categories`
- `fabrics`
- `templates`
- `preview_jobs`

## 下一步

1. 把 `data.ts` 替换成数据库 repository。
2. 增加 `POST /api/preview-jobs`，保存用户选择和 AI 生成任务。
3. 增加图片存储和结果回写。
