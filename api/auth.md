---
title: 认证接口
---

# 认证接口

## 注册

```
POST /api/auth/register
```

**请求体：**

```json
{
  "username": "user123",
  "password": "Password123!",
  "email": "user@example.com"
}
```

**成功响应（201）：**

```json
{
  "code": 201,
  "message": "注册成功",
  "data": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "role": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**错误响应：**

| 状态码 | message | 原因 |
|--------|---------|------|
| 400 | 用户名已存在 | 用户名重复 |
| 400 | 邮箱已被注册 | 邮箱重复 |

---

## 登录

```
POST /api/auth/login
```

**请求体：**

```json
{
  "username": "user123",
  "password": "Password123!"
}
```

**成功响应（200）：**

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "user123",
      "avatar": "http://localhost:8080/uploads/images/avatar/xxx.png",
      "role": 0
    }
  }
}
```

**错误响应：**

| 状态码 | message | 原因 |
|--------|---------|------|
| 400 | 用户名或密码错误 | 用户不存在或密码错误 |
| 403 | 账号已被封禁 | 用户 status = 1 |

---

## 注销

```
POST /api/auth/logout
Authorization: Bearer <token>
```

**成功响应（200）：**

```json
{
  "code": 200,
  "message": "已退出登录"
}
```

注销后，当前 Token 会被加入 Redis 黑名单，后续使用该 Token 将返回 `401 Token 已失效`。

---

## 前端使用示例

```js
// api/index.js - axios 实例配置
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000
})

// 请求拦截器 - 自动携带 Token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器 - 处理 401 自动跳转登录
request.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.push('/login')
    }
    return Promise.reject(err)
  }
)
```
