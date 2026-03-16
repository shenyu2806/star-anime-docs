---
title: 后端部署
---

# 后端部署（StarAnime-Server）

## 获取代码

```bash
git clone https://gitee.com/tuxiw/star-anime-server.git
cd star-anime-server
```

## 安装依赖

```bash
npm install
```

::: tip
安装过程中会自动下载 FFmpeg 二进制文件，耗时可能较长，请耐心等待。
:::

## 配置环境变量

在项目根目录创建 `.env` 文件，参考以下模板填写：

```dotenv
# 服务器端口
PORT=8080

# 跨域允许的前端地址（生产环境替换为实际域名）
CORS_ORIGIN=http://localhost:5173

# MySQL 数据库配置
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=star_anime
DB_USER=root
DB_PASS=your_password

# Redis 配置
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT 密钥（请替换为随机字符串，越长越安全）
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# 文件上传目录（默认为项目内的 uploads 目录）
UPLOAD_DIR=./uploads
```

::: danger 安全提示
- `.env` 文件包含数据库密码和 JWT 密钥等敏感信息，**绝对不能提交到 Git 仓库**！
- 项目 `.gitignore` 已默认忽略 `.env` 文件，请不要手动删除该配置。
- 生产环境请使用强密码和足够长度的随机 JWT 密钥。
:::

## 目录结构

```
StarAnime-Server/
├── app.js              # 应用入口，注册路由和中间件
├── config/
│   ├── database.js     # Sequelize 数据库连接配置
│   └── redis.js        # Redis 客户端配置
├── controllers/        # 控制器（业务逻辑处理）
│   ├── admin/          # 管理后台相关控制器
│   └── *.js            # 前台功能控制器
├── middlewares/        # 中间件
│   ├── auth.js         # JWT 鉴权中间件
│   ├── logger.js       # 操作日志记录中间件
│   └── permission.js   # 权限校验中间件
├── models/             # Sequelize 数据模型
├── routes/             # 路由定义
└── uploads/            # 上传文件存储目录（自动创建）
    ├── images/         # 图片文件
    └── hls/            # HLS 视频切片
```

## 启动服务

### 开发模式（热重载）

```bash
npm run dev
```

### 生产模式

```bash
npm start
```

启动成功后，控制台会输出：

```
数据库同步完成
Redis 连接成功
StarAnime 服务器运行在 http://localhost:8080
```

## 数据库自动同步

服务启动时会自动执行 `Model.sync()`，按依赖顺序创建所有数据库表。**无需手动执行 SQL 脚本**，首次启动即可完成建表。

::: warning
`sync()` 默认只创建不存在的表，不会删除或修改已有数据。如需强制重建，可使用 `sync({ force: true })`，但这会**清空所有数据**，生产环境请谨慎操作。
:::

## 健康检查

服务启动后，访问以下地址验证服务是否正常：

```
GET http://localhost:8080/api/health
```

正常响应：

```json
{
  "status": "ok",
  "message": "StarAnime Server is running"
}
```

## 使用 PM2 守护进程（生产推荐）

```bash
# 全局安装 PM2
npm install -g pm2

# 启动服务
pm2 start app.js --name star-anime-server

# 开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs star-anime-server
```
