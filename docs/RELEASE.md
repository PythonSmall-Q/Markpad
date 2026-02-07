# 发布指南

本文档说明如何使用 GitHub Actions 自动构建和发布 Markpad 应用程序。

## 发布新版本

### 1. 更新版本号

在 `package.json` 中更新版本号：

```json
{
  "version": "1.0.1"
}
```

### 2. 提交更改

```bash
git add .
git commit -m "chore: bump version to 1.0.1"
```

### 3. 创建标签

```bash
# 创建带注释的标签
git tag -a v1.0.1 -m "Release version 1.0.1"

# 推送标签到远程仓库
git push origin v1.0.1
```

### 4. 自动构建

推送标签后，GitHub Actions 会自动：
1. 在 Windows、macOS 和 Linux 上构建应用
2. 生成安装包
3. 创建 GitHub Release
4. 上传构建产物

## 手动触发构建

1. 访问 GitHub 仓库的 Actions 页面
2. 选择 "Build and Release" workflow
3. 点击 "Run workflow" 按钮
4. 选择分支并运行

## 构建产物

### Windows
- `Markpad Setup 1.0.0.exe` - NSIS 安装程序

### macOS
- `Markpad-1.0.0.dmg` - DMG 镜像文件

### Linux
- `Markpad-1.0.0.AppImage` - AppImage 可执行文件

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

1. **权限**: 确保仓库有 `GITHUB_TOKEN` 权限
2. **图标**: 确保 `build/` 目录下有正确的图标文件
3. **签名**: 
   - Windows: 需要代码签名证书
   - macOS: 需要 Apple 开发者账号和证书
4. **版本号**: 遵循语义化版本规范 (Semantic Versioning)

## 版本命名规范

- **主版本号** (Major): 重大变更，可能不兼容旧版本
- **次版本号** (Minor): 新增功能，向后兼容
- **修订号** (Patch): bug 修复，向后兼容

示例: `v1.2.3`
- 1 = 主版本号
- 2 = 次版本号
- 3 = 修订号

## 常见问题

### Q: 构建失败怎么办？

1. 检查 GitHub Actions 日志
2. 确认所有依赖都已正确安装
3. 验证 package.json 配置
4. 检查网络连接（特别是在中国大陆）

### Q: 如何添加更新日志？

在创建标签时添加详细的提交信息：

```bash
git tag -a v1.0.1 -m "Release v1.0.1

新增功能:
- 添加设置页面
- 支持主题切换
- 添加自动保存功能

修复问题:
- 修复文件保存bug
- 优化编辑器性能
"
```

GitHub Release 会自动使用标签信息生成发布说明。

### Q: 如何测试 Release 构建？

建议流程：
1. 先使用 `npm run electron:build:dir` 本地测试
2. 创建预发布标签 (如 `v1.0.0-beta.1`)
3. 测试自动构建流程
4. 确认无误后创建正式版本标签
