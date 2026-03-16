---
title: 上传接口
---

# 上传接口

## 上传头像

```
POST /api/upload/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**表单字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `file` | File | 图片文件（JPEG/PNG） |

**响应：**

```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "url": "http://localhost:8080/uploads/images/avatar/xxx.png"
  }
}
```

---

## 上传番剧封面

```
POST /api/upload/cover
Authorization: Bearer <token>  (需运营权限)
Content-Type: multipart/form-data
```

**表单字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `file` | File | 图片文件 |

---

## 上传轮播图

```
POST /api/upload/banner
Authorization: Bearer <token>  (需运营权限)
Content-Type: multipart/form-data
```

---

## 上传视频（触发转码）

```
POST /api/upload/video
Authorization: Bearer <token>  (需博主权限)
Content-Type: multipart/form-data
```

**表单字段：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `file` | File | 是 | 视频文件（mp4/mkv/avi 等） |
| `episodeId` | number | 是 | 关联的剧集 ID |

**响应（转码开始后）：**

```json
{
  "code": 200,
  "message": "上传成功，转码进行中",
  "data": {
    "resourceId": 1,
    "status": 0
  }
}
```

转码为异步过程，`status = 0` 表示处理中。可轮询以下接口获取转码状态：

```
GET /api/bangumi/resource/:episodeId
```

当 `status = 1` 时表示转码完成，`hlsUrl` 字段可用。

---

## 前端上传示例

```js
// api/upload.js
import request from './index'

export function uploadAvatar(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/upload/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function uploadVideo(file, episodeId, onProgress) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('episodeId', episodeId)
  return request.post('/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      const percent = Math.round((e.loaded / e.total) * 100)
      onProgress && onProgress(percent)
    }
  })
}
```

::: warning 文件大小限制
后端 multer 配置的最大上传文件大小为 **2GB**。超过此限制会返回 `413 Request Entity Too Large`。
:::
