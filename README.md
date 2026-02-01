# New XES Pan

New XES Pan 是一个现代化的云盘应用，提供文件上传、下载、分享和管理功能。该项目采用前后端分离架构，前端基于 Vue 3 和 Vuetify 构建，后端使用 Python 实现。

## 项目简介

这个项目旨在创建一个用户友好的云盘平台，用户可以：
- 上传和下载文件
- 创建和管理文件夹
- 分享文件给其他用户
- 查看和管理云端存储的文件

## 技术栈

- **Vue 3**: 渐进式 JavaScript 框架
- **Vuetify 3**: 基于 Material Design 的 Vue UI 组件库
- **Vite**: 快速的构建工具
- **TypeScript**: 类型安全的 JavaScript 超集
- **Vue Router**: Vue 的官方路由管理器

## 安装和运行


1. 安装依赖：
   ```bash
   npm install
   # 或
   yarn install
   # 或
   pnpm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   # 或
   yarn dev
   # 或
   pnpm dev
   # 或
   bun dev
   ```

   服务器将在 `http://localhost:3000` 启动。

3. 构建生产版本：
   ```bash
   npm run build
   # 或
   yarn build
   # 或
   pnpm build
   # 或
   bun run build
   ```

## 项目结构

```
new-xes-pan/
├── public/                 # 静态资源目录
│   └── downloader.html     # 下载器页面
├── py-server/              # Python 后端服务
│   ├── cloudvar.py         # 云变量处理模块
│   └── main.py             # 后端主入口文件
├── src/                    # 前端源代码
│   ├── assets/             # 静态资源（图片、样式等）
│   ├── components/         # Vue 组件
│   │   ├── ShareDialog.vue # 文件分享对话框
│   │   └── UploadDialog.vue # 文件上传对话框
│   ├── interfaces/         # TypeScript 接口定义
│   │   └── cloudpan.ts     # 云盘相关接口
│   ├── pages/              # 页面组件
│   │   ├── folders.vue     # 文件夹管理页面
│   │   └── index.vue       # 首页
│   ├── plugins/            # 插件配置
│   │   ├── index.ts        # 插件入口
│   │   └── vuetify.ts      # Vuetify 插件配置
│   ├── router/             # 路由配置
│   │   └── index.ts        # 路由定义
│   ├── styles/             # 样式文件
│   │   └── settings.scss   # 全局样式设置
│   ├── utils/              # 工具函数
│   │   ├── cloudvar.ts     # 云变量工具
│   │   └── converter.ts    # 数据转换工具
│   ├── App.vue             # 根组件
│   └── main.ts             # 前端入口文件
├── env.d.ts                # 环境变量类型定义
├── eslint.config.js        # ESLint 配置
├── index.html              # HTML 模板
├── netlify.toml            # Netlify 部署配置
├── package.json            # 前端项目配置和依赖
├── tsconfig.app.json       # TypeScript 应用配置
├── tsconfig.json           # TypeScript 基础配置
├── tsconfig.node.json      # TypeScript Node 配置
└── vite.config.mts         # Vite 构建配置
```

## 主要功能

- **文件管理**: 上传、下载、删除文件
- **文件夹管理**: 创建、删除、重命名文件夹
- **文件分享**: 生成分享链接，设置分享权限
- **用户界面**: 现代化的 Material Design 界面
- **响应式设计**: 支持桌面和移动设备

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 许可证

本项目采用 MIT 许可证。
