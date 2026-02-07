#!/bin/bash

# 开发环境启动脚本

echo "Installing dependencies..."
npm install

echo "Starting development server..."
npm run electron:dev
