import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const packageJsonPath = path.resolve(__dirname, '../../package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL_URL

function parseRepository() {
  const repositoryUrl =
    process.env.GITHUB_REPOSITORY ||
    packageJson.repository?.url ||
    packageJson.repository ||
    ''

  if (repositoryUrl.includes('/')) {
    if (repositoryUrl.includes(':')) {
      const sshMatch = repositoryUrl.match(/github\.com:(.+?)\/(.+?)(\.git)?$/)
      if (sshMatch) {
        return { owner: sshMatch[1], repo: sshMatch[2] }
      }
    }

    const normalized = repositoryUrl
      .replace(/^https?:\/\/github\.com\//, '')
      .replace(/^git@github\.com:/, '')
      .replace(/\.git$/, '')

    if (normalized.includes('/')) {
      const [owner, repo] = normalized.split('/')
      return { owner, repo }
    }
  }

  return { owner: 'walkinglabs', repo: packageJson.name || 'course-template' }
}

const { owner, repo } = parseRepository()
const base = process.env.BASE || (isVercel ? '/' : `/${repo}/`)
const siteUrl = process.env.SITE_URL || `https://${owner}.github.io/${repo}`
const editLinkPattern = `https://github.com/${owner}/${repo}/edit/main/docs/:path`

const rootNav = [
  { text: '简体中文', link: '/zh/' },
  { text: 'English', link: '/en/' }
]

const zhNav = [
  { text: '前言', link: '/preface/intro' },
  { text: '开始', link: '/zh/guide/getting-started' },
  {
    text: 'Demo 课件',
    items: [
      { text: '课程导览', link: '/zh/demo/' },
      { text: '01 课程定位与地图', link: '/zh/demo/chapter-01/' },
      { text: '02 内容设计与练习', link: '/zh/demo/chapter-02/' },
      { text: '03 发布与交付', link: '/zh/demo/chapter-03/' }
    ]
  },
  { text: '部署', link: '/zh/deployment/' }
]

const enNav = [
  { text: 'Start', link: '/en/guide/getting-started' },
  {
    text: 'Demo Course',
    items: [
      { text: 'Course Tour', link: '/en/demo/' },
      { text: '01 Positioning and Map', link: '/en/demo/chapter-01/' },
      { text: '02 Content and Practice', link: '/en/demo/chapter-02/' },
      { text: '03 Release and Delivery', link: '/en/demo/chapter-03/' }
    ]
  },
  { text: 'Deployment', link: '/en/deployment/' }
]

const zhSidebar = {
  '/preface/': [
    {
      text: '前言',
      items: [
        { text: '前言', link: '/preface/intro' },
        { text: '强化学习简史', link: '/preface/brief-history' }
      ]
    }
  ],
  '/zh/guide/': [
    {
      text: '模板指南',
      items: [
        { text: '快速开始', link: '/zh/guide/getting-started' },
        { text: '课程结构建议', link: '/zh/guide/course-structure' },
        { text: '项目初始化清单', link: '/zh/guide/project-setup' },
        { text: '部署说明', link: '/zh/deployment/' }
      ]
    }
  ],
  '/zh/demo/': [
    {
      text: 'Demo 课件导览',
      items: [
        { text: '总览', link: '/zh/demo/' },
        { text: '学习路径', link: '/zh/demo/#学习路径' },
        { text: '阶段交付物', link: '/zh/demo/#阶段交付物' }
      ]
    },
    {
      text: 'Part I. 搭课程骨架',
      collapsed: false,
      items: [
        { text: 'Chapter 01 课程定位与地图', link: '/zh/demo/chapter-01/' },
        {
          text: 'Chapter 01 进阶补充',
          link: '/zh/demo/chapter-01/advanced'
        }
      ]
    },
    {
      text: 'Part II. 写内容与练习',
      collapsed: false,
      items: [
        { text: 'Chapter 02 内容设计与练习', link: '/zh/demo/chapter-02/' },
        {
          text: 'Chapter 02 作业说明',
          link: '/zh/demo/chapter-02/homework/'
        }
      ]
    },
    {
      text: 'Part III. 发布与交付',
      collapsed: false,
      items: [{ text: 'Chapter 03 发布与交付', link: '/zh/demo/chapter-03/' }]
    }
  ],
  '/zh/': [
    {
      text: '开始这里',
      items: [
        { text: '首页', link: '/zh/' },
        { text: '快速开始', link: '/zh/guide/getting-started' },
        { text: 'Demo 课件', link: '/zh/demo/' },
        { text: '部署说明', link: '/zh/deployment/' }
      ]
    }
  ]
}

const enSidebar = {
  '/en/guide/': [
    {
      text: 'Template Guide',
      items: [
        { text: 'Getting Started', link: '/en/guide/getting-started' },
        { text: 'Course Structure', link: '/en/guide/course-structure' },
        { text: 'Project Setup Checklist', link: '/en/guide/project-setup' },
        { text: 'Deployment Guide', link: '/en/deployment/' }
      ]
    }
  ],
  '/en/demo/': [
    {
      text: 'Demo Course Tour',
      items: [
        { text: 'Overview', link: '/en/demo/' },
        { text: 'Learning Path', link: '/en/demo/#learning-path' },
        { text: 'Deliverables', link: '/en/demo/#stage-deliverables' }
      ]
    },
    {
      text: 'Part I. Shape the Course',
      collapsed: false,
      items: [
        {
          text: 'Chapter 01 Positioning and Map',
          link: '/en/demo/chapter-01/'
        },
        {
          text: 'Chapter 01 Advanced Notes',
          link: '/en/demo/chapter-01/advanced'
        }
      ]
    },
    {
      text: 'Part II. Write Content and Practice',
      collapsed: false,
      items: [
        {
          text: 'Chapter 02 Content and Practice',
          link: '/en/demo/chapter-02/'
        },
        {
          text: 'Chapter 02 Homework Brief',
          link: '/en/demo/chapter-02/homework/'
        }
      ]
    },
    {
      text: 'Part III. Release and Delivery',
      collapsed: false,
      items: [
        {
          text: 'Chapter 03 Release and Delivery',
          link: '/en/demo/chapter-03/'
        }
      ]
    }
  ],
  '/en/': [
    {
      text: 'Start Here',
      items: [
        { text: 'Home', link: '/en/' },
        { text: 'Getting Started', link: '/en/guide/getting-started' },
        { text: 'Demo Course', link: '/en/demo/' },
        { text: 'Deployment', link: '/en/deployment/' }
      ]
    }
  ]
}

export default defineConfig({
  lang: 'zh-CN',
  title: 'Course Template',
  description: 'WalkingLabs course template powered by VitePress',
  base,
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: `${base}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#0f766e' }],
    [
      'meta',
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
    ],
    ['meta', { name: 'author', content: 'WalkingLabs' }],
    ['meta', { name: 'robots', content: 'index,follow' }],
    ['meta', { property: 'og:title', content: 'Course Template' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'A reusable bilingual documentation and deployment template for future WalkingLabs courses'
      }
    ],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: siteUrl }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
  ],
  locales: {
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: 'Course Template',
      description: 'WalkingLabs 双语课程仓库模板',
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar,
        editLink: {
          pattern: editLinkPattern,
          text: '在 GitHub 上编辑此页'
        },
        footer: {
          message: '为可复用的双语课程交付而构建',
          copyright: 'Copyright © WalkingLabs'
        },
        outline: {
          level: [2, 3],
          label: '页面目录'
        },
        lastUpdated: {
          text: '最后更新'
        },
        docFooter: {
          prev: '上一页',
          next: '下一页'
        },
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '返回顶部',
        langMenuLabel: '切换语言',
        skipToContentLabel: '跳转到正文',
        notFound: {
          title: '页面未找到',
          quote: '这个地址不存在，试试从中文首页重新进入。',
          link: '/zh/',
          linkText: '返回中文首页',
          linkLabel: '返回中文首页'
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'Course Template',
      description: 'WalkingLabs bilingual course repository template',
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        editLink: {
          pattern: editLinkPattern,
          text: 'Edit this page on GitHub'
        },
        footer: {
          message: 'Built for reusable bilingual course delivery',
          copyright: 'Copyright © WalkingLabs'
        },
        outline: {
          level: [2, 3],
          label: 'On this page'
        },
        lastUpdated: {
          text: 'Last updated'
        },
        docFooter: {
          prev: 'Previous page',
          next: 'Next page'
        },
        darkModeSwitchLabel: 'Appearance',
        lightModeSwitchTitle: 'Switch to light theme',
        darkModeSwitchTitle: 'Switch to dark theme',
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Return to top',
        langMenuLabel: 'Change language',
        skipToContentLabel: 'Skip to content',
        notFound: {
          title: 'Page not found',
          quote:
            'This page is missing. Try jumping back in from the English home page.',
          link: '/en/',
          linkText: 'Take me to English home',
          linkLabel: 'Go to English home'
        }
      }
    }
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Course Template',
    nav: rootNav,
    socialLinks: [
      { icon: 'github', link: `https://github.com/${owner}/${repo}` }
    ],
    search: {
      provider: 'local'
    },
    editLink: {
      pattern: editLinkPattern,
      text: 'Edit this page on GitHub'
    },
    footer: {
      message: 'Built for reusable bilingual course delivery',
      copyright: 'Copyright © WalkingLabs'
    },
    outline: {
      level: [2, 3],
      label: 'On this page'
    }
  }
})
