# 阿里云 ECS 部署指南

> 适用于：NestJS（后端）+ React（前端）+ MySQL 8.0
> 云盘：系统盘 40 GiB，MySQL 数据默认存储在 `/var/lib/mysql`

---

## 一、服务器环境准备

> **推荐配置**：2核 2G 内存，Ubuntu 22.04 LTS，开通 80/443/3000 端口安全组规则。

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 20（使用 NodeSource 源）
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 pnpm
npm install -g pnpm

# 安装 PM2（进程守护）
npm install -g pm2

# 安装 Nginx
sudo apt install -y nginx
```

---

## 二、安装并初始化 MySQL 8.0

```bash
# 安装 MySQL
sudo apt install -y mysql-server

# 启动并设置开机自启
sudo systemctl enable --now mysql

# 进入 MySQL（首次免密）
sudo mysql
```

在 MySQL Shell 中执行：

```sql
-- 创建数据库
CREATE DATABASE learn1_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建专用账号（替换 your_password 为强密码）
CREATE USER 'learn1_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON learn1_db.* TO 'learn1_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

> ✅ 40 GiB 云盘已够用，MySQL 数据默认存储在 `/var/lib/mysql`，无需额外挂盘。
> 若未来数据量增长，可在阿里云控制台扩容系统盘，在线扩容无需重启。

---

## 三、部署后端（NestJS）

### 3.1 上传代码

```bash
# 在服务器上克隆项目（或使用 scp/rsync 上传）
git clone https://github.com/your-repo/learn1.git /home/ubuntu/learn1
cd /home/ubuntu/learn1/server

# 安装依赖
pnpm install

# 构建生产版本
pnpm build
```

### 3.2 创建生产环境变量

```bash
cp .env.example .env
nano .env  # 填写真实配置
```

`.env` 填写内容示例：

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=learn1_user
DB_PASS=your_password
DB_NAME=learn1_db

JWT_SECRET=一段随机的长字符串_建议32位以上

PORT=3000

# 填写你的 ECS 公网 IP 或域名
CLIENT_ORIGIN=http://你的ECS公网IP
```

### 3.3 用 PM2 启动服务

```bash
pm2 start dist/main.js --name learn1-server
pm2 save
pm2 startup  # 按提示执行输出的命令，设置开机自启
```

验证：

```bash
pm2 logs learn1-server  # 查看是否正常启动
curl http://localhost:3000/api  # 应返回 Swagger JSON
```

---

## 四、部署前端（React + Nginx）

### 4.1 本地构建前端

```bash
cd client

# 修改 API 地址指向服务器
# 在 .env.production 中添加：
# VITE_API_BASE=http://你的ECS公网IP:3000

pnpm build  # 生成 dist/ 目录
```

### 4.2 上传前端产物

```bash
# 将 dist/ 上传到服务器
scp -r dist/ ubuntu@你的ECS公网IP:/var/www/learn1
```

### 4.3 配置 Nginx

```bash
sudo nano /etc/nginx/sites-available/learn1
```

填写以下内容：

```nginx
server {
    listen 80;
    server_name 你的ECS公网IP;  # 有域名则填域名

    # 前端静态文件
    root /var/www/learn1;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;  # 支持 React Router
    }

    # 反向代理后端 API（可选，端口统一）
    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/learn1 /etc/nginx/sites-enabled/
sudo nginx -t    # 测试配置
sudo systemctl reload nginx
```

---

## 五、安全组端口开放

在阿里云控制台 → ECS → 安全组 → 添加入方向规则：

| 端口  | 用途             |
|-------|------------------|
| 22    | SSH              |
| 80    | Nginx 前端       |
| 443   | HTTPS（可选）    |
| 3000  | NestJS API（可关闭，通过Nginx反代访问）|
| 3306  | MySQL（**不要对外开放**，仅本机访问）|

---

## 六、常用维护命令

```bash
# 查看后端服务状态
pm2 status

# 重启后端（更新代码后）
cd /home/ubuntu/learn1/server && git pull && pnpm build && pm2 restart learn1-server

# 查看 MySQL 状态
sudo systemctl status mysql

# 进入 MySQL 查看数据
sudo mysql -u learn1_user -p learn1_db
```
