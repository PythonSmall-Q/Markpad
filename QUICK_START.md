# Markpad - Quick Start Guide

## 🚀 5-Minute Quick Start

### Step 1: Prepare Environment

Ensure your system has installed:
- **Node.js** 16.x or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- **Git** ([Download](https://git-scm.com/))

Check versions:
```bash
node -v    # Should show v16.x or higher
npm -v     # Should show 8.x or higher
```

### Step 2: Get the Code

```bash
# Clone repository (if from GitHub)
git clone https://github.com/yourusername/markpad.git
cd markpad

# Or if you already have the code, enter the directory directly
cd Markpad
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install all necessary dependencies, taking about 1-2 minutes.

### Step 4: Start Application

#### Windows Users
```bash
# Method 1: Use batch script
dev.bat

# Method 2: Run command directly
npm run electron:dev
```

#### Mac/Linux Users
```bash
# Method 1: Use shell script
chmod +x dev.sh
./dev.sh

# Method 2: Run command directly
npm run electron:dev
```

### Step 5: Start Using

After the app starts, you'll see the welcome page. Now you can:
1. Click "New Document" to create your first Markdown document
2. Or click "Open File" to open an existing Markdown file
3. Try various features on the toolbar

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

## 🛠️ Development Mode Explained

### Development Mode Startup Process

When you run `npm run electron:dev`, here's what happens:

1. **Vite Dev Server** starts on port 5173
   - Provides hot reload
   - Compiles Vue components
   - Handles styles and assets

2. **Wait for Server Ready**
   - wait-on waits for Vite server to start

3. **Electron Main Process Starts**
   - Loads electron/main.js
   - Creates browser window
   - Connects to Vite Dev Server

4. **Application Opens**
   - Shows application window
   - Automatically opens developer tools
   - Can edit code in real-time and see changes

### Developer Tools

After app starts, developer tools open automatically:
- **Console**: View logs and errors
- **Elements**: Inspect DOM structure
- **Sources**: Debug JavaScript
- **Network**: Monitor network requests
- **Application**: View local storage

## 📦 Build Production Version

### Build All Platforms

```bash
npm run electron:build
```

### Build Specific Platform Only

```bash
# Windows
npm run electron:build:win

# macOS
npm run electron:build:mac

# Linux
npm run electron:build:linux
```

Build artifacts in `dist-electron/` directory:
- **Windows**: `.exe` installer
- **macOS**: `.dmg` installer
- **Linux**: `.AppImage` file

## 🔧 Troubleshooting

### Issue 1: Dependency Installation Failed

**Symptoms**: `npm install` errors

**Solutions**:
```bash
# Clear cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue 2: Application Won't Start

**Symptoms**: Window doesn't display or crashes immediately

**Check**:
1. Confirm Node.js version >= 16
2. View terminal error messages
3. Check if port 5173 is occupied

**Solutions**:
```bash
# Check processes
netstat -ano | findstr :5173  # Windows
lsof -i :5173                 # Mac/Linux

# Kill occupying process or change port
```

### Issue 3: Hot Reload Not Working

**Symptoms**: No automatic refresh after code modifications

**Solutions**:
1. Check if file is actually saved
2. Restart development server
3. Clear browser cache (Ctrl+Shift+R)

### Issue 4: Unable to Save File

**Symptoms**: Error when saving file

**Possible Causes**:
- File permission issues
- Path doesn't exist
- Insufficient disk space

**Solutions**:
1. Check file permissions
2. Confirm directory exists
3. Check disk space

### Issue 5: Editor Style Abnormal

**Symptoms**: Toast UI Editor not displaying correctly

**Solutions**:
```bash
# Reinstall Toast UI Editor
npm uninstall @toast-ui/editor
npm install @toast-ui/editor
```

## 📚 Next Steps

Congratulations! You've successfully started Markpad. Next:

1. **Read User Guide**: Check [USER_GUIDE.md](USER_GUIDE.md) for all features
2. **View Examples**: Open [EXAMPLE.md](EXAMPLE.md) to learn Markdown syntax
3. **Explore Code**: Read [DEVELOPMENT.md](DEVELOPMENT.md) to understand architecture
4. **Participate in Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md) to participate in development

## 💡 Tips

1. **Shortcuts**: Mastering keyboard shortcuts greatly improves efficiency
2. **Auto-save**: Default 60 seconds auto-save, adjustable in settings
3. **Theme**: Click upper right corner to toggle light/dark theme
4. **Preview**: Can show/hide preview panel anytime
5. **Multi-document**: Utilize tabs and sidebar to manage multiple documents

## 🆘 Get Help

- **Documentation**: View project documentation directory
- **Issues**: Submit issues on GitHub
- **Discussion**: Participate in community discussions

## 🎉 Enjoy Using Markpad!

You're now ready to use Markpad. Start creating your first Markdown document!

---

**Need More Help?** Check full documentation or submit an Issue.
