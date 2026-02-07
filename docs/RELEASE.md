# 发布指南

本文档说明如何使用 GitHub Actions 自动构建和发布 Markpad 应用程序。

## 发布新版本

### 方式一：手动触发（推荐）⭐

**无需修改 package.json 版本号**，直接在 GitHub Actions 中触发发布：

1. 访问 GitHub 仓库的 Actions 页面
2. 选择 "Build and Release" workflow
3. 点击 "Run workflow" 按钮
4. 填写参数：
   - **版本号**: 输入版本号（如 `1.0.1` 或 `1.0.1-beta.1`）
   - **是否创建 git tag**: 
     - ⬜ **默认不勾选**（推荐）- 只创建 GitHub Release，不污染 git 历史
     - ✅ 勾选 - 会尝试自动创建 tag（可能因权限问题失败，不影响 release）
5. 点击运行

GitHub Actions 会自动：
- 更新 package.json 版本号（仅在构建过程中）
- 在 Windows、macOS 和 Linux 上构建应用
- 生成安装包
- 创建 GitHub Release
- 上传构建产物

**优点**：
- 不需要本地修改和提交版本号
- 避免版本号提交污染代码仓库
- 快速发布，一键完成

### 方式二：传统标签方式

如果您更喜欢传统的 git tag 方式：

```bash
# 创建带注释的标签
git tag -a v1.0.1 -m "Release version 1.0.1"

# 推送标签到远程仓库
git push origin v1.0.1
```

推送标签后，GitHub Actions 会自动构建和发布。

## 构建产物

Release 中包含以下可执行文件：

### Windows
- `Markpad-Setup-X.X.X.exe` - NSIS 安装程序

### macOS
- `Markpad-X.X.X.dmg` - DMG 镜像文件

### Linux
- `Markpad-X.X.X.AppImage` - AppImage 可执行文件

## 版本号说明

支持的版本号格式：
- **正式版本**: `1.0.1`, `2.0.0`
- **预发布版本**: `1.0.0-beta.1`, `1.0.0-alpha.2`, `2.0.0-rc.1`

系统会自动识别包含 `beta` 或 `alpha` 的版本为预发布版本。

## 本地构建

### 构建所有平台（需要在对应平台上执行）

```bash
# Windows
npm run electron:build:win

# macOS
npm run electron:build:mac

# Linux
npm run electron:build:linux
```

### 仅构建不打包

```bash
npm run electron:build:dir
```

这将创建未打包的应用程序目录，适合快速测试。

## 发布注意事项

1. **权限**: 仓库自动配置 `GITHUB_TOKEN` 权限
2. **图标**: 确保 `build/` 目录下有正确的图标文件
3. **签名**: 
   - Windows: 代码签名证书（可选）
   - macOS: Apple 开发者账号和证书（可选）
4. **版本号**: 
   - 建议遵循语义化版本规范 (Semantic Versioning)
   - 使用手动触发时无需提前修改 package.json
5. **Git Tag**: 
   - 默认不创建 tag，只创建 GitHub Release
   - 如需 tag，可手动推送或在 workflow 中勾选（可能失败但不影响 release）

## 版本命名规范

- **主版本号** (Major): 重大变更，可能不兼容旧版本
- **次版本号** (Minor): 新增功能，向后兼容
- **修订号** (Patch): bug 修复，向后兼容
- **预发布标识**: `-beta.1`, `-alpha.1`, `-rc.1`

示例: `v1.2.3-beta.1`
- 1 = 主版本号
- 2 = 次版本号
- 3 = 修订号
- beta.1 = 预发布版本

## 常见问题

### Q: 推荐使用哪种发布方式？

**推荐使用手动触发**（方式一），并且：
- ✅ **不勾选**"创建 git tag" - 保持 git 历史清爽，只在 GitHub 创建 release
- ✅ 需要 tag 时，手动在本地创建并推送

这样最简单，不会遇到权限问题，且不污染代码仓库。

### Q: 为什么自动创建 tag 可能会失败？

GitHub Actions 的默认 token 对 workflow 文件有保护机制，可能拒绝推送 tag。但这**不影响 release 的创建**，失败时会显示友好提示。

如需 tag，推荐手动创建：
```bash
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin v1.0.1
```

### Q: 如何快速发布测试版本？

1. 访问 Actions → "Build and Release" → "Run workflow"
2. 输入版本号如 `1.0.0-beta.1`
3. **不勾选**"创建 git tag"
4. 点击运行

这样可以快速发布测试版本，无需任何 git 操作！

### Q: 构建失败怎么办？

1. 检查 GitHub Actions 日志
2. 确认所有依赖都已正确安装
3. 验证 package.json 配置
4. 确认版本号格式正确（不要包含 `v` 前缀）
5. 检查网络连接

### Q: 如何添加更新日志？

**手动触发时**: Release notes 会自动从最近的 commits 生成

**使用 tag 时**: 在创建标签时添加详细信息：

```bash
git tag -a v1.0.1 -m "Release v1.0.1

新增功能:
- 添加设置页面
- 支持主题切换

修复问题:
- 修复文件保存bug
"
```

### Q: 如何测试 Release 构建？

建议流程：
1. 先使用 `npm run electron:build:dir` 本地测试
2. 使用手动触发，输入版本号如 `1.0.0-beta.1`
3. **不勾选**"创建 git tag"
4. 测试自动构建的产物
5. 确认无误后，使用正式版本号（如 `1.0.0`）发布

### Q: 如果只想构建不发布怎么办？

目前 workflow 会自动创建 release。如果只想构建：
```bash
# 本地构建，不打包
npm run electron:build:dir

# 本地构建并打包
npm run electron:build:win   # Windows
npm run electron:build:mac   # macOS
npm run electron:build:linux # Linux
```
