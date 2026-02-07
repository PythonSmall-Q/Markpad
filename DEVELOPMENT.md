# Markpad 开发指南

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# Windows
dev.bat

# Linux/Mac
./dev.sh

# 或直接运行
npm run electron:dev
```

### 构建应用

```bash
npm run electron:build
```

## 项目架构

### 技术栈

- **前端**: Vue 3 + Vite
- **状态管理**: Pinia
- **UI 框架**: Element Plus
- **编辑器**: Toast UI Editor
- **桌面框架**: Electron
- **Markdown 解析**: Marked

### 目录结构

```
markpad/
├── electron/              # Electron 主进程
│   ├── main.js           # 主进程入口
│   └── preload.js        # 预加载脚本
├── src/                  # Vue 应用
│   ├── components/       # 组件
│   │   ├── HeaderBar.vue     # 顶部菜单栏
│   │   ├── Sidebar.vue       # 侧边栏
│   │   ├── DocumentTabs.vue  # 文档标签
│   │   ├── EditorView.vue    # 编辑器视图
│   │   ├── EditorToolbar.vue # 编辑器工具栏
│   │   └── WelcomePage.vue   # 欢迎页
│   ├── views/            # 页面
│   │   └── MainLayout.vue    # 主布局
│   ├── store/            # 状态管理
│   │   ├── documents.js      # 文档状态
│   │   └── settings.js       # 设置状态
│   ├── router/           # 路由
│   │   └── index.js
│   ├── utils/            # 工具函数
│   │   ├── electron.js       # Electron API 封装
│   │   └── markdown.js       # Markdown 工具
│   ├── styles/           # 样式
│   │   ├── main.scss         # 主样式
│   │   └── variables.scss    # 变量
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── public/               # 静态资源
├── .vscode/              # VS Code 配置
├── package.json
├── vite.config.js
└── README.md
```

## 核心功能

### 1. 文档管理

- **新建文档**: `Ctrl+N`
- **打开文件**: `Ctrl+O`
- **保存文件**: `Ctrl+S`
- **关闭文档**: `Ctrl+W`
- **多文档标签**: 支持同时打开多个文档
- **自动保存**: 每 60 秒自动保存修改

### 2. Markdown 编辑

- **实时预览**: 左侧编辑，右侧实时预览
- **语法高亮**: 代码块语法高亮
- **快捷工具栏**: 提供常用 Markdown 语法快捷按钮
- **支持的语法**:
  - 标题 (H1-H6)
  - 粗体、斜体、删除线
  - 列表 (有序、无序)
  - 代码块、行内代码
  - 引用
  - 链接、图片
  - 表格
  - 分隔线

### 3. 文件插入

- **图片插入**: 支持本地图片插入
- **视频插入**: 支持本地视频文件
- **音频插入**: 支持音频文件

### 4. 导出功能

- **Markdown 导出**: 导出为 .md 文件
- **HTML 导出**: 导出为 .html 文件，包含样式
- **PDF 导出**: 导出为 PDF 文档
- **纯文本导出**: 导出为 .txt 文件（去除 Markdown 格式）

### 5. 主题

- **亮色主题**: 默认白色主题
- **暗色主题**: 深色护眼主题
- **快速切换**: 点击右上角按钮切换

### 6. 设置

- 自动保存间隔
- 默认导出格式
- 字体大小
- 行高
- 预览显示/隐藏

## 开发指南

### 添加新组件

1. 在 `src/components/` 下创建组件文件
2. 使用 Vue 3 Composition API
3. 使用 `<script setup>` 语法
4. 添加必要的样式（使用 scoped）

### 使用 Store

```javascript
import { useDocumentsStore } from '@/store/documents'
import { useSettingsStore } from '@/store/settings'

const documentsStore = useDocumentsStore()
const settingsStore = useSettingsStore()

// 访问状态
const docs = documentsStore.documents
const theme = settingsStore.theme

// 调用方法
documentsStore.createDocument()
settingsStore.toggleTheme()
```

### 使用 Electron API

```javascript
import { fileAPI, assetAPI, exportAPI } from '@/utils/electron'

// 文件操作
const result = await fileAPI.open()
await fileAPI.save(filePath, content)

// 资源导入
const image = await assetAPI.importImage()

// 导出
await exportAPI.toPdf('document.pdf')
```

### IPC 通信

**渲染进程** → **主进程**:

```javascript
// preload.js 中已定义的 API
window.electronAPI.fileOpen()
window.electronAPI.fileSave({ filePath, content })
```

**主进程处理**:

```javascript
// electron/main.js
ipcMain.handle('file:open', async () => {
  // 处理逻辑
})
```

## 调试

### 开发者工具

开发模式下会自动打开 Chromium DevTools。

### Vue DevTools

安装 Vue DevTools 浏览器扩展，可以在 Electron 中使用。

### 主进程调试

```bash
# 在启动时添加 --inspect 参数
electron --inspect=5858 .
```

然后在 Chrome 中访问 `chrome://inspect` 进行调试。

## 打包

### Windows

```bash
npm run electron:build
```

生成的安装包在 `dist-electron/` 目录。

### macOS

需要在 macOS 系统上构建：

```bash
npm run electron:build
```

### Linux

```bash
npm run electron:build
```

## 常见问题

### Q: 无法打开文件？

A: 确保 Electron 主进程正常运行，检查文件权限。

### Q: 编辑器样式异常？

A: 清除缓存并重新安装依赖：
```bash
rm -rf node_modules package-lock.json
npm install
```

### Q: 构建失败？

A: 检查 Node.js 版本（建议 16.x 或更高），检查依赖是否完整安装。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
