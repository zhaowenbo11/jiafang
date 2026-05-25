# 家纺门店 AI 选布预览

这是一个基于 `Next.js` 的门店演示前端，用于展示：

- 婚庆家纺
- 高端手工定制
- 儿童床上用品

当前版本适合先作为 `H5 演示链接` 发给客户预览。

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

## 部署到 Vercel

### 方式一：网页操作

1. 打开 `https://vercel.com`
2. 登录账号
3. 选择 `Add New Project`
4. 导入当前项目的 `frontend` 目录
5. Framework 选择 `Next.js`
6. 直接点击 `Deploy`

部署完成后会得到一个公网链接，可以直接发给客户。

### 方式二：命令行部署

先安装 Vercel CLI：

```bash
npm install -g vercel
```

然后在 `frontend` 目录执行：

```bash
vercel login
vercel
```

第一次执行 `vercel` 会创建预览环境并返回一个访问链接。

如果要正式发布生产版本：

```bash
vercel --prod
```

## 建议的客户分享方式

- 直接发送 Vercel 链接给客户
- 用链接生成二维码，放到微信或门店平板上
- 门店平板可将网页加入桌面，作为演示入口
