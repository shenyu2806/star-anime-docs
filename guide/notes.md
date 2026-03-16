---
title: 注意事项
---

# 注意事项

## 安全事项

### 不要提交敏感文件

以下文件/目录已被 `.gitignore` 忽略，**切勿手动添加到 Git 暂存区**：

| 文件/目录 | 原因 |
|-----------|------|
| `.env` | 包含数据库密码、JWT 密钥 |
| `uploads/` | 包含用户上传的视频、图片，体积庞大 |
| `node_modules/` | 依赖包，可通过 `npm install` 恢复 |
| `dist/` | 前端构建产物，可重新构建 |

### JWT 密钥强度

`.env` 中的 `JWT_SECRET` 请使用足够强的随机字符串，可使用以下命令生成：

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 上传视频注意事项

### 视频转码流程

用户上传视频后，后端会自动调用 FFmpeg 进行以下处理：

1. 解析视频元数据（时长、分辨率）
2. 转码为 H.264 编码的 `.m3u8` + `.ts` 切片（HLS 格式）
3. 切片文件存储在 `uploads/hls/<videoId>/` 目录下
4. 前端通过 HLS.js 加载 `.m3u8` 清单文件进行播放

### 磁盘空间

HLS 切片会显著增大文件体积（约为原始视频的 1.2~1.5 倍）。生产环境建议：

- 将 `uploads/` 目录挂载到独立的存储盘或对象存储（如腾讯云 COS）
- 定期清理废弃的切片文件

### 转码耗时

FFmpeg 转码为 CPU 密集型任务，较长视频（> 30 分钟）可能耗时数分钟。建议：

- 在上传接口中给用户提供转码进度反馈
- 生产环境使用多核服务器，或将转码任务放入消息队列异步处理

---

## 数据库注意事项

### 不要随意使用 `sync({ force: true })`

`app.js` 中使用的是 `Model.sync()`（不加参数），**只会新建不存在的表，不影响已有数据**。

如果你看到某些代码片段使用了 `sync({ force: true })` 或 `sync({ alter: true })`，请注意：

| 选项 | 行为 | 风险 |
|------|------|------|
| `sync()` | 仅建表，已存在则跳过 | 无风险 |
| `sync({ alter: true })` | 对比模型与表结构，自动修改列 | 可能丢失数据 |
| `sync({ force: true })` | 先删除表再重建 | **高危，会清空数据** |

### 字符集

所有表均使用 `utf8mb4`，确保 MySQL 数据库、连接配置均指定此字符集，否则存储 emoji 时会报错。

---

## Redis 注意事项

### Token 黑名单机制

用户注销登录后，后端会将 Token 存入 Redis 黑名单，并设置与 Token 剩余有效期相同的 TTL。  
**如果 Redis 宕机，已注销的 Token 可能被重新使用**，生产环境请确保 Redis 高可用。

### Redis 密码

若 Redis 开启了密码认证，在 `.env` 中填写 `REDIS_PASSWORD`，否则置空。

---

## 跨域（CORS）配置

后端通过 `CORS_ORIGIN` 环境变量控制允许的来源。

- **开发环境**：可以设置为 `*`（允许所有来源）
- **生产环境**：**必须设置为前端的实际域名**，例如：

```dotenv
CORS_ORIGIN=https://www.star-anime.com
```

设置为 `*` 在生产环境存在安全风险，可能被 CSRF 攻击利用。

---

## 常见问题

### Q: 启动后报 `ECONNREFUSED` 连接 Redis 失败

检查 Redis 是否已启动：

```bash
redis-cli ping
```

若无响应，先启动 Redis：

```bash
redis-server
```

### Q: 数据库同步报 `Access denied`

检查 `.env` 中的 `DB_USER` 和 `DB_PASS` 是否正确，并确保该用户对 `star_anime` 数据库有完整权限：

```sql
GRANT ALL PRIVILEGES ON star_anime.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

### Q: 前端页面刷新后显示 404

需要在 Nginx 或其他 Web 服务器中配置 `try_files` 回退规则，参见 [前端部署 · Nginx 配置](/guide/client#部署到-nginx)。

### Q: 视频无法播放，控制台报 CORS 错误

检查后端 `CORS_ORIGIN` 配置是否包含前端地址，或 Nginx 代理配置是否正确转发了 `/uploads/` 路径。
