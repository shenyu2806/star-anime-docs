---
title: 架构总览
---

# 架构总览

## 整体架构

StarAnime 采用经典的**前后端分离**架构，通过 RESTful API 进行通信：

```
┌─────────────────────────────────────────────────────────┐
│                      浏览器 / 客户端                        │
│              StarAnime-Vue (Vue 3 + Vite)                │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP / REST API
                       ▼
┌─────────────────────────────────────────────────────────┐
│              StarAnime-Server (Express.js)               │
│  ┌─────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  Routes │→ │  Controllers │→ │      Models        │  │
│  └─────────┘  └──────────────┘  └────────────────────┘  │
│                    │                      │              │
│             ┌──────┴───────┐     ┌────────┴───────────┐  │
│             │  Middleware  │     │   Sequelize (ORM)  │  │
│             │  (auth/log)  │     └────────────────────┘  │
│             └──────────────┘              │              │
│                                    ┌──────┴──────┐       │
│                                    │    MySQL     │       │
│                              ┌─────┴──────┐      │       │
│                              │   Redis    │      │       │
│                              └────────────┘      │       │
│                                           ┌──────┴────┐  │
│                                           │  FFmpeg   │  │
│                                           └───────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 后端模块划分

| 模块 | 目录/文件 | 职责 |
|------|-----------|------|
| 应用入口 | `app.js` | Express 实例创建、中间件注册、路由挂载、服务启动 |
| 路由层 | `routes/` | URL 路径与控制器方法的映射 |
| 控制器层 | `controllers/` | 接收请求、调用模型、返回响应 |
| 模型层 | `models/` | Sequelize 数据模型定义、表关联关系 |
| 中间件 | `middlewares/` | JWT 鉴权、权限校验、操作日志 |
| 数据库配置 | `config/database.js` | Sequelize 连接实例 |
| Redis 配置 | `config/redis.js` | Redis 客户端实例 |

## 前端模块划分

| 模块 | 目录 | 职责 |
|------|------|------|
| 视图层 | `src/views/` | 页面级组件，对应路由 |
| 公共组件 | `src/components/` | Header、Footer 等复用组件 |
| 接口层 | `src/api/` | axios 请求封装，按业务域分文件 |
| 路由 | `src/router/` | Vue Router 路由定义与导航守卫 |
| 状态管理 | `src/store/` | Pinia 状态（用户信息、站点配置） |
| 样式 | `src/assets/styles/` | 全局 SCSS 样式 |

## 数据流示意

```
用户操作（点击按钮）
    ↓
Vue 组件调用 api/ 中的接口函数
    ↓
axios 自动携带 Token（请求拦截器）
    ↓
Express 路由接收请求
    ↓
auth 中间件验证 JWT Token（Redis 检查黑名单）
    ↓
permission 中间件检查用户角色
    ↓
Controller 处理业务逻辑
    ↓
Sequelize Model 操作 MySQL
    ↓
Controller 返回 JSON 响应
    ↓
axios 响应拦截器处理错误
    ↓
Vue 组件更新页面状态
```

## 数据模型关系

```
User
 ├── 1:N → WatchHistory（观看记录）
 ├── 1:N → Favorite（收藏）
 ├── 1:N → Comment（评论）
 ├── 1:N → Rating（评分）
 ├── 1:N → Danmaku（弹幕）
 ├── 1:N → UserFollow（关注）
 ├── 1:1 → UserCertification（认证信息）
 ├── 1:N → BloggerApply（博主申请）
 └── 1:N → UserBanApply（封号申请）

Bangumi（番剧）
 ├── 1:N → Episode（剧集）
 ├── 1:N → Comment（评论）
 ├── 1:N → Rating（评分）
 ├── 1:N → Danmaku（弹幕）
 └── 1:N → BangumiApply（申请记录）

Episode（剧集）
 └── 1:N → BangumiResource（视频资源）
```
