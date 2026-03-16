---
title: 视频播放
---

# 视频播放

StarAnime 采用 **HLS（HTTP Live Streaming）** 协议实现视频流式播放，由 ArtPlayer 播放器配合 HLS.js 在浏览器端渲染。

## 技术栈

| 组件 | 版本 | 用途 |
|------|------|------|
| ArtPlayer | ^5.4.0 | 功能完备的 HTML5 视频播放器 |
| HLS.js | ^1.6.15 | 浏览器端 HLS 流解析与播放 |
| FFmpeg | 系统级 | 服务端视频转码与切片 |
| fluent-ffmpeg | ^2.1.3 | Node.js 的 FFmpeg 封装库 |

## HLS 视频流程

```
用户上传视频文件（mp4/mkv 等）
        ↓
服务端接收文件（multer 存储临时文件）
        ↓
调用 FFmpeg 转码
  - 视频编码：H.264 (libx264)
  - 音频编码：AAC
  - 切片时长：默认 10 秒/片
  - 输出格式：.m3u8 + .ts 切片
        ↓
切片文件存储到 uploads/hls/<resourceId>/
        ↓
数据库记录 .m3u8 路径（BangumiResource.hlsPath）
        ↓
前端请求 /api/bangumi/:id/episodes/:episodeId/resource
  获取 .m3u8 地址
        ↓
HLS.js 加载 .m3u8 清单，按需请求 .ts 切片
        ↓
ArtPlayer 渲染视频
```

## 播放页面（Player.vue）

播放页面是前端最复杂的组件（约 1200 行），核心功能包括：

### 播放器初始化

```js
// 创建 ArtPlayer 实例，挂载 HLS.js
const art = new Artplayer({
  container: '#player',
  url: hlsUrl,          // .m3u8 地址
  customType: {
    m3u8: (video, url) => {
      const hls = new Hls()
      hls.loadSource(url)
      hls.attachMedia(video)
    }
  },
  // ...其他配置
})
```

### 路由参数

播放页路由为 `/play/:bangumiId/:episodeId`，通过 URL 参数确定播放内容：

| 参数 | 说明 |
|------|------|
| `bangumiId` | 番剧 ID |
| `episodeId` | 剧集 ID，用于获取视频资源 |

### 核心功能列表

| 功能 | 说明 |
|------|------|
| HLS 流播放 | 加载 `.m3u8` 清单，流式缓冲播放 |
| 弹幕显示 | 加载该集弹幕并在播放时同步显示 |
| 发送弹幕 | 用户输入并发送弹幕，实时显示 |
| 剧集切换 | 侧边栏显示番剧所有剧集，点击切换 |
| 进度记忆 | 自动记录观看位置，下次继续播放 |
| 全屏/网页全屏 | ArtPlayer 内置功能 |
| 音量控制 | 保存到 localStorage |

### 观看记录

每次播放时，前端会定期（每隔若干秒）向后端上报观看进度：

```
POST /api/user/history
{
  "bangumiId": 1,
  "episodeId": 5,
  "progress": 1234   // 当前播放秒数
}
```

后端在 `WatchHistory` 表中记录或更新该条记录。

## 视频上传转码

详见 [上传与转码模块](/modules/upload)。

## 静态文件服务

HLS 切片文件通过 Express 的静态文件中间件提供访问：

```js
app.use('/uploads', express.static('uploads'))
```

访问示例：
```
http://localhost:8080/uploads/hls/abc123/index.m3u8
http://localhost:8080/uploads/hls/abc123/seg001.ts
```

::: warning 生产环境建议
生产环境中，建议将 HLS 切片的静态文件访问交给 Nginx 处理，而不是 Express，以获得更好的性能和并发能力。
:::
