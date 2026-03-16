---
title: 权限系统
---

# 权限系统

StarAnime 采用**基于角色的访问控制（RBAC）**，通过 JWT Token 携带身份信息，结合 Redis 黑名单和中间件层实现细粒度权限管理。

## 角色级别

```
role = 0  普通用户（默认）
role = 1  博主（可上传视频资源）
role = 2  运营（可访问管理后台）
role = 3  管理员（最高权限）
```

权限是**累积的**：高级别角色拥有低级别角色的所有权限。

## JWT 认证流程

### Token 生成（登录时）

```js
const token = jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
)
```

### Token 验证（请求时）

`middlewares/auth.js` 实现 JWT 校验：

```
请求到达 →
  1. 读取 Authorization: Bearer <token>
  2. jwt.verify() 验证签名和有效期
  3. Redis 检查 token 是否在黑名单中（已注销）
  4. 解析出 { id, role } 挂载到 req.user
  5. 调用 next() 放行
```

### Token 黑名单（注销时）

```js
// 注销时将 token 存入 Redis，TTL = token 剩余有效期
const decoded = jwt.decode(token)
const ttl = decoded.exp - Math.floor(Date.now() / 1000)
await redisClient.setEx(`blacklist:${token}`, ttl, '1')
```

## 权限中间件

`middlewares/permission.js` 提供角色校验函数：

```js
// 要求登录（任意已登录用户）
const requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ code: 401, message: '请先登录' })
  next()
}

// 要求指定最低角色级别
const requireRole = (minRole) => (req, res, next) => {
  if (!req.user || req.user.role < minRole) {
    return res.status(403).json({ code: 403, message: '权限不足' })
  }
  next()
}
```

使用示例：

```js
// routes/admin.js
router.get('/users', auth, requireRole(2), adminUserController.list)
router.get('/logs', auth, requireRole(3), adminLogController.list)
```

## 路由权限矩阵

| 路由前缀 | 鉴权要求 | 说明 |
|----------|----------|------|
| `/api/bangumi` (GET) | 无 | 公开内容 |
| `/api/auth/register` | 无 | 注册 |
| `/api/auth/login` | 无 | 登录 |
| `/api/auth/logout` | 需 Token | 注销 |
| `/api/user/*` | 需 Token | 用户相关操作 |
| `/api/upload/avatar` | 需 Token（role ≥ 0） | 上传头像 |
| `/api/upload/video` | 需 Token（role ≥ 1） | 上传视频 |
| `/api/admin/*` | 需 Token（role ≥ 2） | 管理后台 |
| `/api/admin/logs` | 需 Token（role ≥ 3） | 系统日志 |
| `/api/admin/settings` | 需 Token（role ≥ 3） | 系统设置 |

## 前端路由守卫

`router/index.js` 中的 `beforeEach` 钩子实现前端权限拦截：

```js
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null')
  const role = userInfo?.role ?? -1

  // 需要登录
  if (to.meta.requiresAuth && !token) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }
  // 需要管理员
  if (to.meta.requiresAdmin && role < 3) {
    next('/admin')
    return
  }
  // 需要运营
  if (to.meta.requiresOperator && role < 2) {
    next('/')
    return
  }
  next()
})
```

::: warning 前端守卫仅为 UX 层面
前端路由守卫只是用户体验层面的防护，**不能替代后端鉴权**。所有涉及数据修改的接口均在后端通过中间件进行权限校验。
:::

## 操作日志

`middlewares/logger.js` 记录关键操作到 `SystemLog` 表：

| 字段 | 说明 |
|------|------|
| `userId` | 操作者 ID |
| `action` | 操作类型（如：LOGIN, DELETE_BANGUMI） |
| `target` | 操作对象（如：bangumi:5） |
| `detail` | 操作详情（JSON 格式） |
| `ip` | 请求 IP |
| `createdAt` | 操作时间 |

可在管理后台的「系统日志」页面（需管理员权限）查看所有操作记录。
