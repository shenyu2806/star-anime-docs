---
pageClass: home-page
---

<div class="home-hero">
  <img src="/img/logo.png" class="home-logo" alt="StarAnime Logo" />
  <h1 class="home-title">StarAnime</h1>
  <p class="home-tagline">团星云番剧 · 专注于番剧收藏与分享的视频播放平台</p>
  <div class="home-actions">
    <a href="/guide/environment" class="action-btn primary">快速开始 →</a>
    <a href="/modules/overview" class="action-btn secondary">核心模块</a>
  </div>
</div>

<div class="home-features">
  <div class="feature-card">
    <div class="feature-icon">🎬</div>
    <h3>HLS 流式播放</h3>
    <p>基于 FFmpeg 将视频自动转码为 HLS 格式，支持自适应码率，配合 ArtPlayer + HLS.js 实现流畅的在线播放体验。</p>
  </div>
  <div class="feature-card">
    <div class="feature-icon">💬</div>
    <h3>实时弹幕</h3>
    <p>内置弹幕系统，观看番剧时可发送、接收弹幕，弹幕数据持久化存储，支持管理员审核与过滤。</p>
  </div>
  <div class="feature-card">
    <div class="feature-icon">👤</div>
    <h3>完整用户体系</h3>
    <p>支持注册/登录、个人资料编辑、关注他人、收藏番剧、观看历史、博主认证申请等完整的用户生命周期管理。</p>
  </div>
  <div class="feature-card">
    <div class="feature-icon">🔐</div>
    <h3>分级权限控制</h3>
    <p>内置四级角色体系（普通用户/博主/运营/管理员），配合 JWT 鉴权与 Redis 缓存，精细控制各模块访问权限。</p>
  </div>
  <div class="feature-card">
    <div class="feature-icon">📋</div>
    <h3>功能完备的管理后台</h3>
    <p>提供番剧管理、用户管理、公告、轮播图、评论/弹幕审核、系统日志、系统设置等一体化后台管理界面。</p>
  </div>
  <div class="feature-card">
    <div class="feature-icon">🚀</div>
    <h3>现代化技术栈</h3>
    <p>后端采用 Node.js + Express + Sequelize + Redis，前端采用 Vue 3 + Vite + Element Plus，前后端完全分离。</p>
  </div>
</div>

<div class="home-tech-table">

## 技术栈一览

| 层次 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Vue 3 + Vite | Composition API，极速构建 |
| UI 组件库 | Element Plus | 企业级 Vue 3 组件库 |
| 状态管理 | Pinia | Vue 3 官方推荐状态方案 |
| 视频播放器 | ArtPlayer + HLS.js | 支持 HLS 流式视频播放 |
| 后端框架 | Node.js + Express | 轻量、高效的 REST API 服务 |
| 数据库 | MySQL + Sequelize | 关系型数据库 + ORM |
| 缓存 | Redis | Token 黑名单、会话缓存 |
| 视频处理 | FFmpeg | 视频转码、HLS 切片 |
| 认证 | JWT | 无状态身份验证 |

</div>
