---
title: 管理接口
---

# 管理接口

所有管理接口路径前缀为 `/api/admin`，需要携带有效 Token 且用户角色 `role ≥ 2`（运营）。

## 用户管理

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/api/admin/users` | 运营+ | 获取用户列表 |
| PUT | `/api/admin/users/:id/role` | 运营+ | 修改用户角色 |
| PUT | `/api/admin/users/:id/status` | 运营+ | 封禁/解封用户 |

### 获取用户列表

```
GET /api/admin/users?page=1&limit=20&q=搜索词
```

### 修改用户角色

```
PUT /api/admin/users/:id/role
```

**请求体：**

```json
{
  "role": 1
}
```

### 封禁/解封用户

```
PUT /api/admin/users/:id/status
```

**请求体：**

```json
{
  "status": 1
}
```

---

## 番剧管理

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | `/api/admin/bangumi` | 运营+ | 新增番剧 |
| PUT | `/api/admin/bangumi/:id` | 运营+ | 更新番剧 |
| DELETE | `/api/admin/bangumi/:id` | 运营+ | 删除番剧 |
| POST | `/api/admin/bangumi/:id/episodes` | 运营+ | 新增剧集 |
| PUT | `/api/admin/episodes/:id` | 运营+ | 更新剧集 |
| DELETE | `/api/admin/episodes/:id` | 运营+ | 删除剧集 |

### 新增番剧

```
POST /api/admin/bangumi
```

**请求体：**

```json
{
  "title": "番剧标题",
  "description": "简介",
  "cover": "封面图URL",
  "genre": "动作",
  "status": 1,
  "year": 2024,
  "isVisible": true
}
```

---

## 审核管理

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/api/admin/apply` | 运营+ | 番剧申请列表 |
| PUT | `/api/admin/apply/:id` | 运营+ | 审核番剧申请 |
| GET | `/api/admin/blogger-apply` | 运营+ | 博主申请列表 |
| PUT | `/api/admin/blogger-apply/:id` | 运营+ | 审核博主申请 |
| GET | `/api/admin/ban-apply` | 运营+ | 封号申请列表 |
| PUT | `/api/admin/ban-apply/:id` | 运营+ | 处理封号申请 |
| GET | `/api/admin/certification` | 运营+ | 认证申请列表 |
| PUT | `/api/admin/certification/:id` | 运营+ | 审核认证申请 |

### 审核请求体格式

```json
{
  "status": 1,
  "rejectReason": "拒绝理由（通过时可为空）"
}
```

`status`：`1` = 通过，`2` = 拒绝

---

## 内容管理

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/api/admin/comments` | 运营+ | 评论列表 |
| PUT | `/api/admin/comments/:id` | 运营+ | 更新评论状态 |
| DELETE | `/api/admin/comments/:id` | 运营+ | 删除评论 |
| GET | `/api/admin/danmaku` | 运营+ | 弹幕列表 |
| PUT | `/api/admin/danmaku/:id` | 运营+ | 更新弹幕状态 |
| DELETE | `/api/admin/danmaku/:id` | 运营+ | 删除弹幕 |

---

## 公告管理

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/api/admin/announcement` | 运营+ | 公告列表 |
| POST | `/api/admin/announcement` | 运营+ | 新增公告 |
| PUT | `/api/admin/announcement/:id` | 运营+ | 更新公告 |
| DELETE | `/api/admin/announcement/:id` | 运营+ | 删除公告 |

---

## 轮播图管理

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/api/admin/banner` | 运营+ | 轮播图列表 |
| POST | `/api/admin/banner` | 运营+ | 新增轮播图 |
| PUT | `/api/admin/banner/:id` | 运营+ | 更新轮播图 |
| DELETE | `/api/admin/banner/:id` | 运营+ | 删除轮播图 |

---

## 系统日志（管理员专属）

```
GET /api/admin/logs
Authorization: Bearer <token>  (需管理员权限, role = 3)
```

**Query 参数：**

| 参数 | 说明 |
|------|------|
| `page` | 页码 |
| `limit` | 每页数量 |
| `action` | 操作类型筛选 |
| `userId` | 用户 ID 筛选 |
| `startDate` | 开始日期 |
| `endDate` | 结束日期 |

---

## 系统设置（管理员专属）

```
GET /api/admin/settings
PUT /api/admin/settings
Authorization: Bearer <token>  (需管理员权限, role = 3)
```

**常见配置键：**

| key | 说明 |
|-----|------|
| `siteName` | 站点名称 |
| `siteSubtitle` | 站点副标题 |
| `allowRegister` | 是否允许注册（0/1） |
| `allowUpload` | 是否允许上传（0/1） |
