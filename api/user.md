---
title: 用户接口
---

# 用户接口

所有用户接口（除公开接口外）均需在请求头中携带 Token：

```
Authorization: Bearer <token>
```

## 获取当前用户信息

```
GET /api/user/info
```

**响应：**

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "avatar": "http://...",
    "bio": "个人简介",
    "role": 0,
    "status": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 更新个人资料

```
PUT /api/user/update
```

**请求体（字段可选）：**

```json
{
  "bio": "新的个人简介",
  "gender": 1,
  "birthday": "2000-01-01"
}
```

---

## 修改密码

```
PUT /api/user/password
```

**请求体：**

```json
{
  "oldPassword": "旧密码",
  "newPassword": "新密码"
}
```

---

## 收藏番剧

```
POST /api/user/favorites/:bangumiId
```

**响应（200）：**

```json
{
  "code": 200,
  "message": "收藏成功"
}
```

---

## 取消收藏

```
DELETE /api/user/favorites/:bangumiId
```

---

## 获取收藏列表

```
GET /api/user/favorites?page=1&limit=20
```

---

## 获取观看历史

```
GET /api/user/history?page=1&limit=20
```

---

## 上报观看进度

```
POST /api/user/history
```

**请求体：**

```json
{
  "bangumiId": 1,
  "episodeId": 5,
  "progress": 1234
}
```

---

## 发表评论

```
POST /api/user/comment
```

**请求体：**

```json
{
  "bangumiId": 1,
  "content": "这部番太好看了！",
  "parentId": null
}
```

---

## 发送弹幕

```
POST /api/user/danmaku
```

**请求体：**

```json
{
  "episodeId": 5,
  "content": "这里太燃了！",
  "time": 123.5,
  "color": "#ffffff",
  "type": 0
}
```

---

## 评分

```
POST /api/user/rating
```

**请求体：**

```json
{
  "bangumiId": 1,
  "score": 5
}
```

`score` 取值范围：1~5。

---

## 关注用户

```
POST /api/user/follow/:userId
```

---

## 取消关注

```
DELETE /api/user/follow/:userId
```

---

## 用户广场

```
GET /api/user/list?page=1&limit=20&q=搜索词
```

---

## 查看用户主页

```
GET /api/user/profile/:userId
```

---

## 提交认证申请

```
POST /api/user/certification
```

**请求体：**

```json
{
  "type": "personal",
  "content": "认证说明..."
}
```

---

## 提交博主申请

```
POST /api/user/blogger-apply
```

**请求体：**

```json
{
  "reason": "我想上传番剧资源，服务大家..."
}
```
