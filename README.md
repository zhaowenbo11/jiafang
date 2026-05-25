# 家纺门店 AI 选布预览项目

这个仓库用于整理门店实时选布成品预览系统的产品文档和前端演示项目。

## 目录说明

- `frontend/`
  - Next.js 前端演示项目
  - 当前可直接部署到 Vercel
- `门店实时选布成品预览系统-PRD.md`
  - 产品需求文档
- `门店实时选布成品预览系统-技术架构图.md`
  - 技术架构说明
- `门店实时选布成品预览系统-开发任务拆解.md`
  - 研发任务拆解
- `门店实时选布成品预览系统-数据库设计.md`
  - 数据库设计草案

## Git 发布建议

当前推荐把整个根目录作为一个 Git 仓库统一管理。

这样做的好处：

- 产品文档和前端代码放在同一个仓库里
- 后续接 GitHub、Vercel、团队协作都更方便
- Vercel 部署时只需要把 `Root Directory` 指向 `frontend`

## 推送到 GitHub

如果你已经在 GitHub 上创建了仓库，在根目录执行：

```bash
git add .
git commit -m "init showroom demo"
git remote add origin <你的仓库地址>
git push -u origin main
```

如果已经存在 `origin`，则只需要：

```bash
git add .
git commit -m "update showroom demo"
git push
```

## Vercel 部署方式

### 方式一：连接 GitHub

1. 把当前仓库推到 GitHub
2. 打开 Vercel 后台导入仓库
3. 在项目设置里把 `Root Directory` 设为 `frontend`
4. Framework 保持 `Next.js`
5. 点击部署

### 方式二：直接在 frontend 目录用 CLI 部署

进入 `frontend` 目录后执行：

```bash
vercel
```

正式发布：

```bash
vercel --prod
```

## 当前状态

- 前端构建已通过
- 当前版本适合先作为客户演示链接使用
