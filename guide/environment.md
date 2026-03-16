---
title: 环境准备
---

# 环境准备

在部署 StarAnime 之前，请确保你的服务器或开发机已安装以下运行环境。

## 必需环境

| 环境 | 推荐版本 | 说明 |
|------|----------|------|
| Node.js | ≥ 18.x | 后端运行时，建议使用 LTS 版本 |
| npm | ≥ 9.x | 随 Node.js 一并安装 |
| MySQL | ≥ 8.0 | 主数据库，存储所有业务数据 |
| Redis | ≥ 7.x | 缓存层，用于 Token 黑名单和会话管理 |
| FFmpeg | 最新稳定版 | 视频转码与 HLS 切片（后端自动安装） |

::: tip 关于 FFmpeg
后端通过 `@ffmpeg-installer/ffmpeg` 和 `@ffprobe-installer/ffprobe` 自动下载二进制文件，**无需手动安装 FFmpeg**。但在国内网络环境下，自动下载可能较慢，可提前手动安装系统级 FFmpeg。
:::

## 检查环境

```bash
# 检查 Node.js 版本
node -v

# 检查 npm 版本
npm -v

# 检查 MySQL 服务
mysql --version

# 检查 Redis 服务
redis-cli ping
# 输出 PONG 表示 Redis 正常运行
```

## 创建数据库

登录 MySQL 后执行以下命令创建数据库：

```sql
CREATE DATABASE star_anime
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

::: warning 字符集要求
必须使用 `utf8mb4` 字符集，否则存储包含 emoji 的弹幕、评论内容时会报错。
:::

## 启动 Redis

```bash
# Linux / macOS
redis-server

# Windows（若已安装 Redis 服务）
net start Redis
```

## 目录结构说明

```
StarAnime/
├── StarAnime-Server/   # 后端项目
├── StarAnime-Vue/      # 前端项目
└── docs/               # 文档站（即本站）
```
