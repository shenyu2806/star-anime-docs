---
title: 番剧接口
---

# 番剧接口

## 获取番剧列表

```
GET /api/bangumi
```

**Query 参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码，默认 1 |
| `limit` | number | 否 | 每页数量，默认 20 |
| `genre` | string | 否 | 类型筛选 |
| `year` | number | 否 | 年份筛选 |
| `status` | number | 否 | 状态筛选（0=完结, 1=连载中） |

**响应：**

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "title": "示例番剧",
        "cover": "http://localhost:8080/uploads/images/bangumi/cover_xxx.jpg",
        "genre": "动作",
        "status": 1,
        "year": 2024
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

---

## 搜索番剧

```
GET /api/bangumi/search?q=关键词
```

**Query 参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `q` | string | 是 | 搜索关键词（匹配标题） |
| `page` | number | 否 | 页码 |
| `limit` | number | 否 | 每页数量 |

---

## 获取番剧详情

```
GET /api/bangumi/:id
```

**响应：**

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "title": "示例番剧",
    "description": "这是番剧简介...",
    "cover": "...",
    "genre": "动作",
    "status": 1,
    "year": 2024,
    "avgRating": 4.5,
    "episodeCount": 12
  }
}
```

---

## 获取剧集列表

```
GET /api/bangumi/:id/episodes
```

**响应：**

```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "bangumiId": 1,
      "title": "第01话",
      "episodeNumber": 1,
      "duration": 1440,
      "hasResource": true
    }
  ]
}
```

---

## 获取剧集视频资源

```
GET /api/bangumi/resource/:episodeId
```

**响应：**

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "hlsUrl": "http://localhost:8080/uploads/hls/abc123/index.m3u8",
    "resolution": "1920x1080",
    "status": 1
  }
}
```

---

## 获取番剧评论

```
GET /api/bangumi/:id/comments?page=1&limit=20
```

---

## 获取剧集弹幕

```
GET /api/bangumi/danmaku/:episodeId
```

**响应：**

```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "content": "太好看了！",
      "time": 123.5,
      "color": "#ffffff",
      "type": 0,
      "username": "user123"
    }
  ]
}
```
