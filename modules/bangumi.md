---
title: 番剧系统
---

# 番剧系统

番剧系统是 StarAnime 的核心内容模块，管理所有番剧信息、剧集、申请流程以及相关的评分与评论功能。

## 数据模型

### Bangumi（番剧主表）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INTEGER (PK) | 自增主键 |
| `title` | STRING | 番剧标题 |
| `description` | TEXT | 番剧简介 |
| `cover` | STRING | 封面图 URL |
| `genre` | STRING | 类型标签（动作/恋爱/搞笑等） |
| `status` | INTEGER | 更新状态（0=完结, 1=连载中） |
| `year` | INTEGER | 年份 |
| `season` | STRING | 季度（如：2024-01） |
| `isVisible` | BOOLEAN | 是否公开显示 |

### Episode（剧集）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INTEGER (PK) | 自增主键 |
| `bangumiId` | INTEGER (FK) | 关联番剧 |
| `title` | STRING | 集标题（如：第01话） |
| `episodeNumber` | INTEGER | 集数 |
| `duration` | INTEGER | 视频时长（秒） |
| `isVisible` | BOOLEAN | 是否公开 |

### BangumiResource（视频资源）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INTEGER (PK) | 自增主键 |
| `episodeId` | INTEGER (FK) | 关联剧集 |
| `uploaderId` | INTEGER (FK) | 上传者用户 ID |
| `hlsPath` | STRING | HLS `.m3u8` 文件路径 |
| `resolution` | STRING | 分辨率（如：1920x1080） |
| `status` | INTEGER | 状态（0=处理中, 1=可用, 2=失败） |

### BangumiApply（番剧申请）

博主可以申请为某番剧上传视频资源：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INTEGER (PK) | 自增主键 |
| `bangumiId` | INTEGER (FK) | 申请的番剧 |
| `applicantId` | INTEGER (FK) | 申请人 |
| `reason` | TEXT | 申请理由 |
| `status` | INTEGER | 审核状态（0=待审, 1=通过, 2=拒绝） |

## 前台页面

### 首页（Home.vue）

- 展示站点公告横幅
- 首页轮播图（Banner）
- 最新更新的番剧卡片列表
- 从 `store/site.js` 读取站点名称、副标题等全局配置

### 番剧列表（BangumiList.vue）

- 分页展示所有公开番剧
- 支持按类型、年份、状态筛选
- 支持关键词搜索（跳转到搜索页）

### 番剧详情（BangumiDetail.vue）

- 番剧基本信息（封面、简介、标签）
- 剧集列表（按集数排序）
- 用户评分（星级评分组件）
- 评论区
- 收藏/取消收藏按钮

### 搜索（Search.vue）

- 通过 URL Query 参数 `?q=keyword` 接受搜索词
- 实时搜索番剧标题

## 管理端功能

### 番剧管理（admin/BangumiList.vue）

- 查看所有番剧（含不公开的）
- 新增番剧（填写标题、简介、封面、类型、年份等）
- 编辑番剧信息
- 上传/更换番剧封面图
- 切换番剧显示/隐藏状态
- 删除番剧

### 剧集管理

包含在番剧管理页面内：
- 新增剧集（集数、标题）
- 设置剧集可见性
- 查看各集已上传的视频资源状态

### 番剧资源管理（admin/BangumiResource.vue）

- 查看所有剧集的视频资源
- 查看转码状态（处理中/可用/失败）
- 删除视频资源（同时删除切片文件）
- 重新触发转码

### 番剧申请审核（admin/BangumiApply.vue）

- 查看博主提交的番剧上传申请
- 审核通过/拒绝并填写理由
- 通过后博主可以为该番剧上传资源

## 相关接口

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | `/api/bangumi` | 获取番剧列表（分页、筛选） |
| GET | `/api/bangumi/:id` | 获取番剧详情 |
| GET | `/api/bangumi/:id/episodes` | 获取剧集列表 |
| GET | `/api/bangumi/search` | 搜索番剧 |
| POST | `/api/admin/bangumi` | 新增番剧（运营+） |
| PUT | `/api/admin/bangumi/:id` | 更新番剧 |
| DELETE | `/api/admin/bangumi/:id` | 删除番剧 |
| POST | `/api/admin/bangumi/:id/episodes` | 新增剧集 |
| GET | `/api/admin/apply` | 获取番剧申请列表 |
| PUT | `/api/admin/apply/:id` | 审核番剧申请 |
