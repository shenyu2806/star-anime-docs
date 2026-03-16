import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { recoTheme } from 'vuepress-theme-reco'

export default defineUserConfig({
  bundler: viteBundler(),
  base: '/',
  lang: 'zh-CN',
  title: 'StarAnime',
  description: '团星云番剧 · 番剧视频播放平台文档',

  head: [
    ['link', { rel: 'icon', href: '/img/logo.png' }],
  ],

  theme: recoTheme({
    logo: '/img/logo.png',
    author: 'StarAnime Team',
    authorAvatar: '/img/logo.png',
    docsRepo: 'https://gitee.com/tuxiw/star-anime-docs',
    docsBranch: 'main',

    // 颜色模式
    colorMode: 'dark',
    colorModeSwitch: true,

    // 导航栏
    navbar: [
      { text: '首页', link: '/' },
      {
        text: '快速开始',
        children: [
          { text: '环境准备', link: '/guide/environment' },
          { text: '后端部署', link: '/guide/server' },
          { text: '前端部署', link: '/guide/client' },
          { text: '注意事项', link: '/guide/notes' },
        ]
      },
      {
        text: '核心模块',
        children: [
          { text: '架构总览', link: '/modules/overview' },
          { text: '用户系统', link: '/modules/user' },
          { text: '番剧系统', link: '/modules/bangumi' },
          { text: '视频播放', link: '/modules/player' },
          { text: '评论与弹幕', link: '/modules/interaction' },
          { text: '上传与转码', link: '/modules/upload' },
          { text: '管理后台', link: '/modules/admin' },
          { text: '权限系统', link: '/modules/permission' },
        ]
      },
      {
        text: 'API 文档',
        children: [
          { text: '接口总览', link: '/api/overview' },
          { text: '认证接口', link: '/api/auth' },
          { text: '番剧接口', link: '/api/bangumi' },
          { text: '用户接口', link: '/api/user' },
          { text: '上传接口', link: '/api/upload' },
          { text: '管理接口', link: '/api/admin' },
        ]
      },
      { text: 'Gitee', link: 'https://gitee.com/tuxiw/star-anime-docs' },
    ],

    // 侧边栏
    series: {
      '/guide/': [
        {
          text: '快速开始',
          children: [
            '/guide/environment',
            '/guide/server',
            '/guide/client',
            '/guide/notes',
          ]
        }
      ],
      '/modules/': [
        {
          text: '核心模块',
          children: [
            '/modules/overview',
            '/modules/user',
            '/modules/bangumi',
            '/modules/player',
            '/modules/interaction',
            '/modules/upload',
            '/modules/admin',
            '/modules/permission',
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 接口文档',
          children: [
            '/api/overview',
            '/api/auth',
            '/api/bangumi',
            '/api/user',
            '/api/upload',
            '/api/admin',
          ]
        }
      ],
    },

    // 公告
    bulletin: {
      body: [
        {
          type: 'text',
          content: '🎉 欢迎使用 StarAnime 文档站，本站持续更新中。',
          style: 'font-size: 14px;'
        }
      ]
    },

    commentConfig: {
      type: 'disabled',
    },
  }),
})
