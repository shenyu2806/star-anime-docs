---
title: 评论与弹幕
---

# 评论与弹幕

StarAnime 提供两种用户互动方式：**评论**（番剧详情页的楼层式讨论）和**弹幕**（视频播放时的实时浮动文字）。

## 评论系统

### 数据模型

#### Comment（评论）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INTEGER (PK) | 自增主键 |
| `bangumiId` | INTEGER (FK) | 所属番剧 |
| `userId` | INTEGER (FK) | 发送者 |
| `content` | TEXT | 评论内容 |
| `parentId` | INTEGER (nullable) | 父评论 ID（回复功能） |
| `isVisible` | BOOLEAN | 是否可见（管理员可隐藏） |
| `createdAt` | DATE | 评论时间 |

#### CommentLike（评论点赞）

| 字段 | 类型 | 说明 |
|------|------|------|
| `userId` | INTEGER (FK) | 点赞者 |
| `commentId` | INTEGER (FK) | 被点赞的评论 |

### 前台功能

评论区位于番剧详情页（`BangumiDetail.vue`）底部：

- 分页加载评论（按时间倒序）
- 发表评论（登录后可用）
- 回复评论（嵌套一层）
- 点赞评论
- 删除自己的评论

### 管理端功能

管理后台的评论管理页（`admin/CommentList.vue`）：

- 查看所有评论（支持按番剧/用户筛选）
- 隐藏/恢复评论（`isVisible` 字段切换）
- 删除违规评论

### 相关接口

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | `/api/bangumi/:id/comments` | 获取番剧评论列表 |
| POST | `/api/user/comment` | 发表评论 |
| DELETE | `/api/user/comment/:id` | 删除评论 |
| POST | `/api/user/comment/:id/like` | 点赞评论 |
| GET | `/api/admin/comments` | 管理端获取评论列表 |
| PUT | `/api/admin/comments/:id` | 管理端更新评论状态 |
| DELETE | `/api/admin/comments/:id` | 管理端删除评论 |

---

## 弹幕系统

### 数据模型

#### Danmaku（弹幕）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INTEGER (PK) | 自增主键 |
| `episodeId` | INTEGER (FK) | 所属剧集 |
| `userId` | INTEGER (FK) | 发送者 |
| `content` | STRING | 弹幕文本 |
| `time` | FLOAT | 发送时的视频时间点（秒） |
| `color` | STRING | 弹幕颜色（十六进制） |
| `type` | INTEGER | 弹幕类型（0=滚动, 1=顶部, 2=底部） |
| `isVisible` | BOOLEAN | 是否可见 |
| `createdAt` | DATE | 发送时间 |

### 弹幕加载与渲染

播放器（`Player.vue`）初始化时，加载当前剧集的所有弹幕：

```
GET /api/bangumi/danmaku/:episodeId
```

ArtPlayer 通过自定义插件接收弹幕数据，在视频时间线上精准渲染。

### 发送弹幕

用户在播放器底部输入框发送弹幕：

```
POST /api/user/danmaku
{
  "episodeId": 5,
  "content": "这里太好看了！",
  "time": 123.5,
  "color": "#ffffff",
  "type": 0
}
```

弹幕保存后立即显示在当前视频的弹幕列表中。

### 管理端功能

管理后台的弹幕管理页（`admin/DanmakuList.vue`）：

- 查看所有弹幕（支持按剧集/用户/关键词筛选）
- 隐藏违规弹幕（`isVisible = false`）
- 批量删除弹幕

### 相关接口

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | `/api/bangumi/danmaku/:episodeId` | 获取剧集弹幕列表 |
| POST | `/api/user/danmaku` | 发送弹幕 |
| GET | `/api/admin/danmaku` | 管理端获取弹幕列表 |
| PUT | `/api/admin/danmaku/:id` | 更新弹幕状态 |
| DELETE | `/api/admin/danmaku/:id` | 删除弹幕 |
