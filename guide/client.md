---
title: 前端部署
---

# 前端部署（StarAnime-Vue）

## 获取代码

```bash
git clone https://gitee.com/tuxiw/star-anime-vue.git
cd star-anime-vue
```

## 安装依赖

```bash
npm install
```

## 配置环境变量

在项目根目录创建 `.env` 或 `.env.local` 文件：

```dotenv
# 后端 API 地址
VITE_API_BASE_URL=http://localhost:8080/api
```

::: tip 多环境配置
Vite 支持多环境配置文件：
- `.env` — 所有环境通用
- `.env.development` — 仅开发环境
- `.env.production` — 仅生产构建
:::

## 目录结构

```
StarAnime-Vue/
├── src/
│   ├── api/            # 接口封装（axios 请求函数）
│   │   ├── index.js    # axios 实例、拦截器
│   │   ├── admin.js    # 管理后台接口
│   │   ├── bangumi.js  # 番剧相关接口
│   │   ├── user.js     # 用户相关接口
│   │   └── ...
│   ├── assets/
│   │   └── styles/
│   │       └── main.scss   # 全局样式
│   ├── components/     # 公共组件
│   │   ├── Header.vue       # 顶部导航栏
│   │   ├── Footer.vue       # 页脚
│   │   ├── AnnouncementBar.vue  # 公告横幅
│   │   └── ...
│   ├── router/
│   │   └── index.js    # 路由配置与前置守卫
│   ├── store/          # Pinia 状态管理
│   │   ├── user.js     # 用户状态（登录信息、Token）
│   │   └── site.js     # 站点状态（站点名称、配置）
│   ├── views/          # 页面组件
│   │   ├── admin/      # 管理后台页面
│   │   ├── Home.vue
│   │   ├── Player.vue
│   │   └── ...
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── vite.config.js      # Vite 构建配置
└── package.json
```

## 开发模式

```bash
npm run dev
```

启动后访问 `http://localhost:5173`。

::: tip
开发模式下建议在 `vite.config.js` 中配置反向代理，以避免跨域问题：

```js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
```
:::

## 生产构建

```bash
npm run build
```

构建产物默认输出到 `dist/` 目录。

## 部署到 Nginx

将 `dist/` 目录中的文件复制到 Nginx 的 `html` 目录，并配置 Nginx 支持 Vue Router 的 HTML5 History 模式：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/star-anime/dist;
    index index.html;

    # 支持 history 路由模式，所有路径回退到 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 反向代理后端 API
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 代理视频切片等静态资源
    location /uploads/ {
        proxy_pass http://localhost:8080/uploads/;
    }
}
```

::: warning
Vue Router 使用 `createWebHistory` 模式，**必须在服务器配置 `try_files` 回退规则**，否则刷新页面会出现 404 错误。
:::

## 页面路由一览

| 路径 | 页面 | 权限要求 |
|------|------|----------|
| `/` | 首页 | 无 |
| `/bangumi` | 番剧列表 | 无 |
| `/bangumi/:id` | 番剧详情 | 无 |
| `/play/:bangumiId/:episodeId` | 视频播放 | 无 |
| `/search` | 搜索 | 无 |
| `/users` | 用户广场 | 无 |
| `/user-profile/:userId` | 用户主页 | 无 |
| `/user` | 个人中心 | 需登录 |
| `/login` | 登录/注册 | 无 |
| `/admin/*` | 管理后台 | 需运营权限（role ≥ 2）|
