# 欢迎使用 Markpad

这是一个示例 Markdown 文档，帮助你快速了解 Markpad 的功能。

## 功能特性

### 📝 Markdown 编辑

Markpad 提供了强大的 Markdown 编辑功能：

- **实时预览**：左侧编辑，右侧实时看到渲染效果
- **语法高亮**：代码块支持多种语言的语法高亮
- **快捷工具**：工具栏提供常用格式化快捷按钮

### 📂 文件管理

- 多文档标签支持
- 自动保存功能
- 最近文件列表
- 文件拖放支持

### 🎨 主题切换

支持明暗两种主题，点击右上角按钮即可切换。

### 📤 导出功能

支持导出为多种格式：
- Markdown (.md)
- HTML (.html)
- PDF (.pdf)
- 纯文本 (.txt)

## Markdown 语法示例

### 文本样式

**这是粗体文本**

*这是斜体文本*

~~这是删除线文本~~

`这是行内代码`

### 列表

#### 无序列表

- 列表项 1
- 列表项 2
  - 嵌套列表项 2.1
  - 嵌套列表项 2.2
- 列表项 3

#### 有序列表

1. 第一项
2. 第二项
3. 第三项

### 代码块

```javascript
// JavaScript 示例
function greet(name) {
  console.log(`Hello, ${name}!`)
}

greet('Markpad')
```

```python
# Python 示例
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

### 引用

> 这是一段引用文本。
> 
> 引用可以包含多个段落。
> 
> —— 某位智者

### 链接

[访问 GitHub](https://github.com)

[Markdown 官方文档](https://www.markdownguide.org/)

### 表格

| 功能 | 快捷键 (Windows) | 快捷键 (Mac) |
| --- | --- | --- |
| 新建 | Ctrl+N | Cmd+N |
| 打开 | Ctrl+O | Cmd+O |
| 保存 | Ctrl+S | Cmd+S |
| 关闭 | Ctrl+W | Cmd+W |

### 任务列表

- [x] 完成项目架构设计
- [x] 实现 Markdown 编辑器
- [x] 添加文件管理功能
- [x] 实现导出功能
- [ ] 添加云同步支持
- [ ] 实现插件系统

### 分隔线

---

## 数学公式（如果支持）

行内公式：$E = mc^2$

块级公式：

$$
\int_{a}^{b} f(x)dx = F(b) - F(a)
$$

## 图片

![Markdown Logo](https://markdown-here.com/img/icon256.png)

## 快捷键参考

### 基本操作

- `Ctrl+N` - 新建文档
- `Ctrl+O` - 打开文件
- `Ctrl+S` - 保存文件
- `Ctrl+W` - 关闭文档

### 编辑操作

- `Ctrl+B` - 加粗
- `Ctrl+I` - 斜体
- `Ctrl+F` - 搜索

## 提示和技巧

1. **使用多文档标签**：同时打开多个文档，方便对照编辑
2. **善用工具栏**：不熟悉 Markdown 语法时，使用工具栏快速插入
3. **定期保存**：虽然有自动保存，但重要内容建议手动保存
4. **利用预览**：实时预览帮助你看到最终效果
5. **图片路径**：使用相对路径引用图片，方便项目移动

## 下一步

- 阅读 `USER_GUIDE.md` 了解详细使用方法
- 查看 `DEVELOPMENT.md` 了解开发相关信息
- 开始创建你的第一个文档！

---

**Markpad** - 让 Markdown 编辑更简单

📧 反馈和建议请提交到 GitHub Issues
