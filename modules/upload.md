---
title: 上传与转码
---

# 上传与转码

StarAnime 的视频上传和转码模块是整个系统的技术核心，负责将用户上传的原始视频转换为适合 Web 流式播放的 HLS 格式。

## 上传流程总览

```
用户在前端选择视频文件
        ↓
前端使用 FormData 分片上传（可选）或单次上传
        ↓
POST /api/upload/video
        ↓
multer 中间件接收文件，保存到临时目录
        ↓
Controller 调用 FFmpeg 开始转码
  ├── 解析元数据（时长、分辨率）
  ├── 转码为 H.264 + AAC
  └── 生成 .m3u8 清单 + .ts 切片
        ↓
更新 BangumiResource 表记录 hlsPath、resolution、duration
        ↓
删除原始上传文件（节省磁盘空间）
        ↓
返回资源 ID 和状态给前端
```

## 文件存储结构

```
uploads/
├── images/                   # 图片文件（封面、头像、Banner）
│   ├── bangumi/             
│   │   └── cover_xxx.jpg
│   ├── avatar/
│   │   └── avatar_xxx.png
│   └── banner/
│       └── banner_xxx.jpg
└── hls/                      # HLS 视频切片
    └── <resourceId>/
        ├── index.m3u8        # HLS 清单文件
        ├── seg000.ts
        ├── seg001.ts
        └── ...
```

## multer 配置

后端使用 `multer` 处理 `multipart/form-data` 文件上传：

```js
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/tmp/')
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${uuidv4()}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 } // 2GB
})
```

## FFmpeg 转码参数

```js
ffmpeg(inputPath)
  .outputOptions([
    '-c:v libx264',        // 视频编码 H.264
    '-c:a aac',            // 音频编码 AAC
    '-preset fast',        // 编码速度与压缩率平衡
    '-hls_time 10',        // 每个切片时长 10 秒
    '-hls_list_size 0',    // .m3u8 记录所有切片
    '-hls_segment_filename',
    `${outputDir}/seg%03d.ts`
  ])
  .output(`${outputDir}/index.m3u8`)
  .on('end', resolve)
  .on('error', reject)
  .run()
```

## 图片上传

除视频外，系统还支持图片上传，用于：

| 场景 | 路径 | 格式要求 |
|------|------|----------|
| 番剧封面 | `/api/upload/cover` | JPEG/PNG，建议 16:9 |
| 用户头像 | `/api/upload/avatar` | JPEG/PNG，建议 1:1 |
| 轮播图 | `/api/upload/banner` | JPEG/PNG，建议 16:5 |

前端使用 `vue-cropper` 组件提供图片裁剪预览功能（`AvatarUpload.vue`、`ImageUpload.vue`）。

## 前端上传组件

| 组件 | 用途 |
|------|------|
| `AvatarUpload.vue` | 用户头像裁剪上传 |
| `ImageUpload.vue` | 通用图片上传（封面/Banner） |

上传使用 `FormData` + axios：

```js
const formData = new FormData()
formData.append('file', file)
formData.append('episodeId', episodeId)

await axios.post('/api/upload/video', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  onUploadProgress: (e) => {
    progress.value = Math.round(e.loaded / e.total * 100)
  }
})
```

## 上传权限

| 接口 | 所需权限 |
|------|----------|
| `/api/upload/video` | 博主及以上（role ≥ 1），且需通过番剧申请审核 |
| `/api/upload/cover` | 运营及以上（role ≥ 2） |
| `/api/upload/avatar` | 登录用户（role ≥ 0） |
| `/api/upload/banner` | 运营及以上（role ≥ 2） |

## 注意事项

::: warning 磁盘空间
HLS 切片文件总量 = 原始视频大小 × 1.2~1.5。长视频项目需提前规划存储空间，建议挂载独立磁盘或使用对象存储服务。
:::

::: tip 清理废弃文件
删除 `BangumiResource` 记录时，对应的 `uploads/hls/<resourceId>/` 目录也应当一并删除。后端控制器在删除资源时需调用 `fs.rm` 递归删除切片目录。
:::
