---
title: 用户系统
---

# 用户系统

用户系统是 StarAnime 的核心基础模块，涵盖注册/登录、个人资料管理、关注体系、收藏、观看历史、认证申请等完整功能。

## 用户角色体系

系统内置四级角色，通过 `role` 字段区分：

| role 值 | 角色 | 权限说明 |
|---------|------|----------|
| `0` | 普通用户 | 浏览番剧、发评论/弹幕、收藏、关注 |
| `1` | 博主 | 在普通用户基础上，可申请上传番剧资源 |
| `2` | 运营 | 可访问管理后台大部分功能 |
| `3` | 管理员 | 拥有全部权限，包括系统设置、系统日志 |

## 数据模型

### User 模型

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INTEGER (PK) | 自增主键 |
| `username` | STRING | 用户名，唯一 |
| `password` | STRING | bcrypt 加密后的密码哈希 |
| `email` | STRING | 邮箱，唯一 |
| `avatar` | STRING | 头像 URL |
| `bio` | TEXT | 个人简介 |
| `role` | INTEGER | 角色等级（0~3） |
| `status` | INTEGER | 账号状态（0=正常, 1=封禁） |
| `createdAt` | DATE | 注册时间 |

### UserCertification 模型

| 字段 | 类型 | 说明 |
|------|------|------|
| `userId` | INTEGER (FK) | 关联用户 |
| `type` | STRING | 认证类型（如：个人认证、企业认证） |
| `content` | TEXT | 认证说明 |
| `status` | INTEGER | 审核状态（0=待审, 1=通过, 2=拒绝） |

### UserFollow 模型

记录用户间的关注关系：

| 字段 | 类型 | 说明 |
|------|------|------|
| `followerId` | INTEGER (FK) | 关注者 ID |
| `followingId` | INTEGER (FK) | 被关注者 ID |

## 认证流程

### 注册

```
POST /api/auth/register
{
  "username": "user123",
  "password": "Password123!",
  "email": "user@example.com"
}
```

1. 检查用户名/邮箱是否已存在
2. 使用 `bcryptjs` 对密码进行哈希（salt rounds = 10）
3. 创建 User 记录
4. 返回用户信息（不含密码）

### 登录

```
POST /api/auth/login
{
  "username": "user123",
  "password": "Password123!"
}
```

1. 查找用户
2. `bcrypt.compare` 验证密码
3. 检查账号状态（封禁则拒绝）
4. 签发 JWT Token（默认 7 天有效）
5. 返回 Token 和用户信息

### 注销

```
POST /api/auth/logout
Authorization: Bearer <token>
```

1. 验证 Token 有效性
2. 将 Token 存入 Redis 黑名单，TTL = Token 剩余有效期
3. 后续携带此 Token 的请求将被拒绝

## 个人中心功能

前端 `views/User.vue` 是个人中心的主页面，包含以下 Tab 功能：

| Tab | 功能 |
|-----|------|
| 基本信息 | 修改昵称、简介、生日、性别 |
| 头像上传 | 裁剪并上传头像 |
| 修改密码 | 验证旧密码后更新 |
| 我的收藏 | 查看/取消收藏的番剧 |
| 观看历史 | 查看并清除观看记录 |
| 我的关注 | 关注列表与粉丝列表 |
| 认证申请 | 提交个人/企业认证申请 |
| 博主申请 | 申请博主身份（需认证） |

## 用户广场

`/users` 页面展示所有公开用户（分页），支持搜索用户名。

`/user-profile/:userId` 展示指定用户的公开主页，包含：
- 头像、用户名、简介、认证徽章
- 该用户公开的收藏列表
- 关注/取消关注按钮

## 相关接口

| 方法 | 路径 | 功能 |
|------|------|------|
| POST | `/api/auth/register` | 注册 |
| POST | `/api/auth/login` | 登录 |
| POST | `/api/auth/logout` | 注销 |
| GET | `/api/user/info` | 获取当前用户信息 |
| PUT | `/api/user/update` | 更新个人资料 |
| PUT | `/api/user/password` | 修改密码 |
| GET | `/api/user/favorites` | 获取收藏列表 |
| POST | `/api/user/favorites/:id` | 收藏番剧 |
| DELETE | `/api/user/favorites/:id` | 取消收藏 |
| GET | `/api/user/history` | 获取观看历史 |
| POST | `/api/user/follow/:id` | 关注用户 |
| DELETE | `/api/user/follow/:id` | 取消关注 |
| POST | `/api/user/certification` | 提交认证申请 |
| POST | `/api/user/blogger-apply` | 提交博主申请 |
