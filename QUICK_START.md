# Markpad - 快速启动指南

## 🚀 5 分钟快速启动

### 第一步：准备环境

确保你的系统已安装：
- **Node.js** 16.x 或更高版本 ([下载地址](https://nodejs.org/))
- **npm** (Node.js 自带) 或 **yarn**
- **Git** ([下载地址](https://git-scm.com/))

检查版本：
```bash
node -v    # 应该显示 v16.x 或更高
npm -v     # 应该显示 8.x 或更高
```

### 第二步：获取代码

```bash
# 克隆仓库（如果从 GitHub）
git clone https://github.com/yourusername/markpad.git
cd markpad

# 或者如果你已经有代码，直接进入目录
cd Markpad
```

### 第三步：安装依赖

```bash
npm install
```

这将安装所有必要的依赖包，大约需要 1-2 分钟。

### 第四步：启动应用

#### Windows 用户
```bash
# 方式 1: 使用批处理脚本
dev.bat

# 方式 2: 直接运行命令
npm run electron:dev
```

#### Mac/Linux 用户
```bash
# 方式 1: 使用 shell 脚本
chmod +x dev.sh
./dev.sh

# 方式 2: 直接运行命令
npm run electron:dev
```

### 第五步：开始使用

应用启动后，你将看到欢迎页面。现在可以：
1. 点击"新建文档"创建第一个 Markdown 文档
2. 或点击"打开文件"打开现有的 Markdown 文件
3. 尝试使用工具栏的各种功能

## 🎯 常见使用场景

### 场景 1: 创建第一个文档

1. 启动应用
2. 点击"新建文档"或按 `Ctrl+N`
3. 开始输入 Markdown 内容
4. 右侧会实时显示预览
5. 按 `Ctrl+S` 保存文档

### 场景 2: 编辑现有文档

1. 点击"打开文件"或按 `Ctrl+O`
2. 选择 .md 文件
3. 文档会在新标签中打开
4. 编辑后自动标记为未保存（显示蓝点）
5. 按 `Ctrl+S` 保存

### 场景 3: 同时编辑多个文档

1. 打开或创建多个文档
2. 每个文档显示在独立标签中
3. 点击标签切换文档
4. 侧边栏显示所有打开的文档

### 场景 4: 插入图片

1. 光标定位到想插入图片的位置
2. 点击工具栏的图片按钮
3. 选择本地图片文件
4. 图片会以 Markdown 语法插入

### 场景 5: 导出文档

1. 打开要导出的文档
2. 点击顶部"导出"下拉菜单
3. 选择格式（Markdown、HTML、PDF、纯文本）
4. 选择保存位置
5. 完成！

## 🛠️ 开发模式详解

### 开发模式启动流程

当你运行 `npm run electron:dev` 时，发生了什么：

1. **Vite Dev Server** 在端口 5173 启动
   - 提供热重载
   - 编译 Vue 组件
   - 处理样式和资源

2. **等待服务器就绪**
   - wait-on 等待 Vite 服务器启动

3. **Electron 主进程启动**
   - 加载 electron/main.js
   - 创建浏览器窗口
   - 连接到 Vite Dev Server

4. **应用打开**
   - 显示应用窗口
   - 自动打开开发者工具
   - 可以实时编辑代码并看到变化

### 开发者工具

应用启动后，开发者工具会自动打开：
- **Console**: 查看日志和错误
- **Elements**: 检查 DOM 结构
- **Sources**: 调试 JavaScript
- **Network**: 监控网络请求
- **Application**: 查看本地存储

## 📦 构建生产版本

### 构建所有平台

```bash
npm run electron:build
```

### 只构建特定平台

```bash
# Windows
npm run electron:build:win

# macOS
npm run electron:build:mac

# Linux
npm run electron:build:linux
```

构建产物在 `dist-electron/` 目录：
- **Windows**: `.exe` 安装程序
- **macOS**: `.dmg` 安装程序
- **Linux**: `.AppImage` 文件

## 🔧 故障排查

### 问题 1: 依赖安装失败

**症状**: `npm install` 报错

**解决方案**:
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 问题 2: 应用无法启动

**症状**: 窗口不显示或者立即崩溃

**检查**:
1. 确认 Node.js 版本 >= 16
2. 查看终端错误信息
3. 检查端口 5173 是否被占用

**解决**:
```bash
# 检查进程
netstat -ano | findstr :5173  # Windows
lsof -i :5173                 # Mac/Linux

# 杀死占用进程或换端口
```

### 问题 3: 热重载不工作

**症状**: 修改代码后没有自动刷新

**解决方案**:
1. 检查文件是否真的保存了
2. 重启开发服务器
3. 清除浏览器缓存 (Ctrl+Shift+R)

### 问题 4: 文件无法保存

**症状**: 保存文件时报错

**可能原因**:
- 文件权限问题
- 路径不存在
- 磁盘空间不足

**解决**:
1. 检查文件权限
2. 确认目录存在
3. 检查磁盘空间

### 问题 5: 编辑器样式异常

**症状**: Toast UI Editor 显示不正常

**解决方案**:
```bash
# 重新安装 Toast UI Editor
npm uninstall @toast-ui/editor
npm install @toast-ui/editor
```

## 📚 下一步

恭喜！你已经成功启动 Markpad。接下来：

1. **阅读用户指南**: 查看 [USER_GUIDE.md](USER_GUIDE.md) 了解所有功能
2. **查看示例**: 打开 [EXAMPLE.md](EXAMPLE.md) 学习 Markdown 语法
3. **探索代码**: 阅读 [DEVELOPMENT.md](DEVELOPMENT.md) 了解架构
4. **参与贡献**: 查看 [CONTRIBUTING.md](CONTRIBUTING.md) 参与开发

## 💡 小贴士

1. **快捷键**: 熟练使用快捷键可以大幅提高效率
2. **自动保存**: 默认 60 秒自动保存，可在设置中调整
3. **主题**: 点击右上角切换明暗主题
4. **预览**: 可以随时显示/隐藏预览面板
5. **多文档**: 善用标签和侧边栏管理多个文档

## 🆘 获取帮助

- **文档**: 查看项目文档目录
- **Issues**: 在 GitHub 提交问题
- **讨论**: 参与社区讨论

## 🎉 享受使用 Markpad！

现在你已经准备好使用 Markpad 了。开始创建你的第一个 Markdown 文档吧！

---

**需要更多帮助?** 查看完整文档或提交 Issue。
