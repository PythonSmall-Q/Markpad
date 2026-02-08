# Markpad Cloudflare Pages 配置

这个目录包含部署到 Cloudflare Pages 的前端页面，用于托管 Markpad 的发布文件和自动更新。

## 📁 文件说明

- `index.html` - 主页（产品介绍 + 下载中心）
- `features.html` - 功能详情页面
- `_headers` - CORS 和缓存控制配置
- `README.md` - 本说明文件

## 🎨 页面特性

### 主页 (index.html)

**产品展示部分：**

- 精美的渐变头部设计
- 核心特性网格展示（9大特性）
- 技术栈标签展示
- 响应式设计，完美适配移动端

**下载中心部分：**

- 自动检测并显示所有可用平台
- 支持 Windows、macOS、Linux 三大平台
- 显示版本号、文件大小
- 美观的平台卡片设计
- 自动从 `latest.yml` 读取版本信息
- 自动检测各平台安装包是否存在

### 功能详情页 (features.html)

- 详细的功能说明文档
- 9大核心功能模块介绍
- 每个功能的详细特性列表
- 多语言支持展示（10种语言）
- CTA 行动号召区域
- 面包屑导航

## 🚀 设置步骤

### 1. 创建 Cloudflare Pages 项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Pages** > **Create a project**
3. 选择 **Connect to Git** 或 **Direct Upload**

#### 方法 A: 使用 Git 连接（推荐）

- 授权 GitHub 账户
- 选择 `PythonSmall-Q/Markpad` 仓库
- **Build settings:**
  - Build command: `echo "No build required"`
  - Build output directory: `cloudflare-pages`
  - Root directory: `/`

#### 方法 B: 手动上传

- 选择 **Direct Upload**
- 将 `cloudflare-pages` 目录下的所有文件打包上传

### 2. 配置 GitHub Actions

项目已包含自动部署配置，需要设置以下 GitHub Secrets:

在 GitHub 仓库设置中添加 **Settings** > **Secrets and variables** > **Actions**:

- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID ([查看位置](https://dash.cloudflare.com/))
- `CLOUDFLARE_API_TOKEN`: Cloudflare API Token (需要 `Cloudflare Pages:Edit` 权限)

**获取 API Token:**

1. Cloudflare Dashboard > My Profile > API Tokens
2. Create Token > 选择 "Edit Cloudflare Pages" 模板
3. 复制生成的 Token

### 3. 获取 Cloudflare Pages URL

部署完成后，Cloudflare 会提供一个 URL，例如:

```
https://mark-pad.pages.dev
```

或自定义域名:

```
https://download.markpad.app
```

### 4. 更新 electron-updater 配置

在 `package.json` 中添加 `publish` 配置:

```json
{
  "build": {
    "publish": [
      {
        "provider": "generic",
        "url": "https://mark-pad.pages.dev"
      }
    ]
  }
}
```

## 🔄 自动部署流程

1. 推送代码或手动触发 Release Workflow
2. GitHub Actions 构建应用（Windows、macOS、Linux）
3. 创建 GitHub Release
4. **自动上传到 Cloudflare Pages**:
   - **Windows**: `Markpad-Setup-x.x.x.exe`, `*.exe.blockmap`, `latest.yml`
   - **macOS**: `Markpad-x.x.x.dmg`, `*.dmg.blockmap`, `latest-mac.yml`
   - **Linux**: `Markpad-x.x.x.AppImage`, `latest-linux.yml`
   - **网页**: `index.html` (主页), `features.html` (功能详情)
5. Electron 应用从 Cloudflare Pages 检查更新

## 📝 本地测试

```bash
cd cloudflare-pages

# 使用 Python 启动本地服务器
python -m http.server 8080

# 或使用 Node.js
npx http-server -p 8080

# 访问 http://localhost:8080
```

## 🔐 安全说明

- `_headers` 文件配置了必要的 CORS 头
- 所有文件通过 HTTPS 传输
- Cloudflare 提供全球 CDN 加速
- API Token 使用 GitHub Secrets 加密存储

## 📊 更新机制

```
Electron App (1.2.1)
    ↓
检查更新: GET https://mark-pad.pages.dev/latest.yml
    ↓
发现新版本 (1.2.2)
    ↓
下载: GET https://mark-pad.pages.dev/Markpad-Setup-1.2.2.exe
    ↓
安装并重启
```

## 🛠️ 故障排查

### 问题 1: CORS 错误

- 检查 `_headers` 文件是否正确部署
- 确认 Cloudflare Pages 项目设置中没有覆盖 Headers

### 问题 2: 404 错误

- 确认文件已正确上传到 Cloudflare Pages
- 检查文件名是否匹配（区分大小写）

### 问题 3: 更新检查失败ga

- 确认 `package.json` 中的 `publish.url` 正确
- 检查 `latest.yml` 文件内容格式

## 📚 相关链接

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [electron-updater 文档](https://www.electron.build/auto-update)
- [GitHub Actions 文档](https://docs.github.com/actions)
