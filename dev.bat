@echo off
REM Windows 开发环境启动脚本

echo Installing dependencies...
call npm install

echo Starting development server...
call npm run electron:dev
