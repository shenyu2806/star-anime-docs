---
title: 接口总览
---

# API 接口总览

## 基本信息

| 项目 | 说明 |
|------|------|
| 基础 URL | `http://localhost:8080/api` |
| 数据格式 | JSON |
| 认证方式 | Bearer Token（JWT） |
| 字符编码 | UTF-8 |

## 统一响应格式

所有接口返回统一的 JSON 结构：

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

| 状态码 | 说明 |
|--------|------|
| `200` | 请求成功 |
| `201` | 创建成功 |
| `400` | 请求参数错误 |
| `401` | 未认证（Token 缺失或无效） |
| `403` | 权限不足 |
| `404` | 资源不存在 |
| `500` | 服务器内部错误 |

## 认证方式

需要登录的接口，请在请求头中携带 JWT Token：

```
Authorization: Bearer eyJhbGci...
```

## 接口列表

### 认证模块 `/api/auth`

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | `/api/auth/register` | 无 | 注册 |
| POST | `/api/auth/login` | 无 | 登录 |
| POST | `/api/auth/logout` | 需登录 | 注销 |

### 番剧模块 `/api/bangumi`

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/api/bangumi` | 无 | 番剧列表 |
| GET | `/api/bangumi/search` | 无 | 搜索番剧 |
| GET | `/api/bangumi/:id` | 无 | 番剧详情 |
| GET | `/api/bangumi/:id/episodes` | 无 | 剧集列表 |
| GET | `/api/bangumi/:id/comments` | 无 | 番剧评论 |
| GET | `/api/bangumi/danmaku/:episodeId` | 无 | 剧集弹幕 |
| GET | `/api/bangumi/resource/:episodeId` | 无 | 剧集资源 |

### 用户模块 `/api/user`

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/api/user/info` | 需登录 | 获取当前用户信息 |
| PUT | `/api/user/update` | 需登录 | 更新个人资料 |
| PUT | `/api/user/password` | 需登录 | 修改密码 |
| GET | `/api/user/favorites` | 需登录 | 收藏列表 |
| POST | `/api/user/favorites/:id` | 需登录 | 收藏番剧 |
| DELETE | `/api/user/favorites/:id` | 需登录 | 取消收藏 |
| GET | `/api/user/history` | 需登录 | 观看历史 |
| DELETE | `/api/user/history` | 需登录 | 清空观看历史 |
| POST | `/api/user/comment` | 需登录 | 发表评论 |
| DELETE | `/api/user/comment/:id` | 需登录 | 删除评论 |
| POST | `/api/user/danmaku` | 需登录 | 发送弹幕 |
| POST | `/api/user/rating` | 需登录 | 评分 |
| GET | `/api/user/follow/:id` | 需登录 | 关注用户 |
| DELETE | `/api/user/follow/:id` | 需登录 | 取消关注 |
| POST | `/api/user/certification` | 需登录 | 提交认证申请 |
| POST | `/api/user/blogger-apply` | 需登录 | 提交博主申请 |
| GET | `/api/user/list` | 无 | 用户广场列表 |
| GET | `/api/user/profile/:id` | 无 | 用户公开主页 |

### 上传模块 `/api/upload`

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | `/api/upload/avatar` | 需登录 | 上传头像 |
| POST | `/api/upload/cover` | 运营+ | 上传番剧封面 |
| POST | `/api/upload/banner` | 运营+ | 上传轮播图 |
| POST | `/api/upload/video` | 博主+ | 上传视频并转码 |

### 轮播图模块 `/api/banner`

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/api/banner` | 无 | 获取轮播图列表 |

### 管理模块 `/api/admin`

详见 [管理接口](/api/admin)。

## 健康检查

```
GET /api/health
```

响应：

```json
{
  "status": "ok",
  "message": "StarAnime Server is running"
}
```
