# Markpad

一个功能强大的 Markdown 笔记本应用，基于 Vue 3 和 Electron 构建。

## 功能特性

- ✅ **Markdown 编辑**：支持实时预览、语法高亮
- ✅ **文件管理**：多文档标签、自动保存、最近文件
- ✅ **插入功能**：支持插入图片、音视频、文件（Base64 图片自动折叠）
- ✅ **导出功能**：导出为 PDF、HTML、Markdown、纯文本
- ✅ **搜索替换**：全文搜索与替换
- ✅ **主题切换**：支持明暗主题切换、跟随系统
- ✅ **国际化 (i18n)**：支持简体中文和 English，可扩展更多语言
- ✅ **设置中心**：完整的设置页面，支持编辑器、外观、文件、语言等配置
- ✅ **跨平台**：支持 Windows、macOS、Linux
- ✅ **CI/CD**：GitHub Actions 自动构建和发布

## 技术栈

- **前端框架**：Vue 3 + Pinia + Vue Router
- **UI 框架**：Element Plus
- **编辑器**：Toast UI Editor
- **桌面框架**：Electron
- **构建工具**：Vite

## 开发

```bash
# 安装依赖
npm install

# 开发模式运行
npm run electron:dev

# 构建应用（仅目录，适合测试）
npm run electron:build:dir

# 完整构建（含安装包）
npm run electron:build
```

## 发布版本

```bash
# 1. 更新版本号
npm version patch  # 或 minor, major

# 2. 创建并推送标签
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 3. GitHub Actions 自动构建和发布
```

查看详细发布指南：[docs/RELEASE.md](docs/RELEASE.md)

## 项目结构

```
markpad/
├── .github/          # GitHub 配置
│   ├── workflows/    # CI/CD workflows
│   └── ISSUE_TEMPLATE/ # Issue 模板
├── build/            # 构建资源
│   └── icon.*        # 应用图标
├── electron/         # Electron 主进程
│   ├── main.js       # 主进程入口
│   └── preload.js    # 预加载脚本
├── src/              # Vue 应用
│   ├── components/   # 组件
│   ├── views/        # 页面
│   ├── store/        # 状态管理 (Pinia)
│   ├── router/       # 路由
│   ├── i18n/         # 国际化
│   │   ├── index.js  # i18n 配置
│   │   └── locales/  # 语言包（zh-CN, en-US）
│   ├── utils/        # 工具函数
│   ├── styles/       # 全局样式
│   ├── App.vue       # 根组件
│   └── main.js       # 入口文件
├── docs/             # 文档
├── public/           # 公共资源
├── package.json
└── vite.config.js
```

## 文档

- [用户指南](docs/USER_GUIDE.md)
- [开发指南](docs/DEVELOPMENT.md)
- [发布指南](docs/RELEASE.md)
- [国际化 (i18n)](docs/I18N.md)
- [快速开始](docs/QUICK_START.md)

## 许可证

MIT License
