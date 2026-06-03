# 服务器部署说明

本文档按 Ubuntu 22.04 + Node.js 22 + PM2 + Nginx 编写，适用于当前前后端一体的 Next.js 项目。

## 目录规划

建议服务器目录：

```bash
/var/www/jiafang
```

项目代码目录：

```bash
/var/www/jiafang/frontend
```

## 1. 安装基础环境

```bash
sudo apt update
sudo apt install -y nginx git
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

检查版本：

```bash
node -v
npm -v
pm2 -v
```

## 2. 拉取代码

```bash
sudo mkdir -p /var/www/jiafang
sudo chown -R $USER:$USER /var/www/jiafang
cd /var/www/jiafang
git clone https://github.com/zhaowenbo11/jiafang.git
cd /var/www/jiafang/jiafang/frontend
```

如果目录已经存在：

```bash
cd /var/www/jiafang/jiafang
git pull origin main
cd frontend
```

## 3. 配置生产环境变量

在 `frontend` 目录新建 `.env.production`：

```bash
nano .env.production
```

最少需要补这些：

```bash
JIMENG_IMAGE_PROVIDER=jimeng
JIMENG_IMAGE_MODEL=jimeng_seedream46_cvtob
JIMENG_REQ_KEY=jimeng_seedream46_cvtob
JIMENG_AK=你的AK
JIMENG_SK=你的SK
JIMENG_API_HOST=visual.volcengineapi.com
JIMENG_REGION=cn-north-1
JIMENG_SERVICE=cv
JIMENG_TIMEOUT_MS=60000
JIMENG_POLL_INTERVAL_MS=1500
```

如果线上图片依赖 OSS/CDN，继续保留公网 URL 即可，不需要把图片本体放到服务器。

## 4. 安装依赖并构建

```bash
npm install
npm run build
```

## 5. 启动服务

当前仓库已经提供了 `ecosystem.config.cjs`，启动命令：

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

查看状态：

```bash
pm2 status
pm2 logs jiafang-frontend
```

默认服务端口：

```bash
3000
```

## 6. 配置 Nginx 反向代理

创建配置文件：

```bash
sudo nano /etc/nginx/sites-available/jiafang
```

写入：

```nginx
server {
    listen 80;
    server_name _;

    client_max_body_size 20m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：

```bash
sudo ln -sf /etc/nginx/sites-available/jiafang /etc/nginx/sites-enabled/jiafang
sudo nginx -t
sudo systemctl restart nginx
```

## 7. 验证访问

先在服务器本机检查：

```bash
curl http://127.0.0.1:3000
curl http://127.0.0.1:3000/api/showroom
```

再从公网访问：

```bash
http://服务器IP
```

## 8. 后续更新

以后每次更新代码只需要：

```bash
cd /var/www/jiafang/jiafang
git pull origin main
cd frontend
npm install
npm run build
pm2 restart jiafang-frontend
```

## 9. 常见问题

### 页面打不开

- 检查安全组是否放行 `80`
- 检查服务器防火墙是否放行 `80`
- 检查 `pm2 status` 是否正常
- 检查 `sudo nginx -t` 是否通过

### AI 成图失败

- 检查 `.env.production` 的 AK/SK 是否正确
- 检查 OSS 图片链接是否能公网访问
- 检查 `pm2 logs jiafang-frontend`

### 构建成功但图片异常

- 优先检查模板图和布料图 URL 是否仍可访问
- 确认线上环境变量与本地一致
