@echo off
echo ========================================
echo Markpad 重新构建脚本
echo ========================================
echo.

echo [1/5] 关闭正在运行的应用...
taskkill /F /IM Markpad.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo 完成!
echo.

echo [2/5] 清理旧的构建文件...
if exist dist-electron rmdir /s /q dist-electron
if exist dist rmdir /s /q dist
if exist node_modules\.vite rmdir /s /q node_modules\.vite
echo 清理完成!
echo.

echo [3/5] 构建 Vue 应用...
call npm run build
if errorlevel 1 (
    echo 构建失败！请检查错误信息。
    pause
    exit /b 1
)
echo Vue 应用构建完成!
echo.

echo [4/5] 打包 Electron 应用...
call npx electron-builder --publish never --dir
if errorlevel 1 (
    echo 打包失败！请检查错误信息。
    pause
    exit /b 1
)
echo Electron 应用打包完成!
echo.

echo [5/5] 构建成功！
echo.
echo 打包后的应用位置：
echo   - 可执行文件: dist-electron\win-unpacked\Markpad.exe
echo.
echo 按任意键运行应用并查看控制台输出...
pause >nul

echo.
echo 启动应用...
start "" "dist-electron\win-unpacked\Markpad.exe"
echo.
echo 应用已启动！请按 F12 打开开发者工具检查控制台输出。
echo 查找 "=== Preload script is running ===" 和 "✓ Running in Electron environment"
pause
