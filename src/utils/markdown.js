import { marked } from 'marked'

/**
 * Markdown utility functions
 */

// Configure marked
marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false
})

/**
 * Convert Markdown to HTML
 */
export function markdownToHtml(markdown) {
    try {
        return marked.parse(markdown)
    } catch (error) {
        console.error('Markdown parse error:', error)
        return ''
    }
}

/**
 * Convert Markdown to plain text (remove formatting)
 */
export function markdownToText(markdown) {
    // Remove Markdown syntax
    let text = markdown

    // Remove heading markers
    text = text.replace(/^#{1,6}\s+/gm, '')

    // Remove bold and italic
    text = text.replace(/(\*\*|__)(.*?)\1/g, '$2')
    text = text.replace(/(\*|_)(.*?)\1/g, '$2')

    // Remove strikethrough
    text = text.replace(/~~(.*?)~~/g, '$1')

    // Remove links, keep text
    text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')

    // Remove images
    text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '')

    // Remove code blocks
    text = text.replace(/```[\s\S]*?```/g, '')
    text = text.replace(/`([^`]+)`/g, '$1')

    // Remove quote markers
    text = text.replace(/^>\s+/gm, '')

    // Remove list markers
    text = text.replace(/^[\*\-\+]\s+/gm, '')
    text = text.replace(/^\d+\.\s+/gm, '')

    // Remove horizontal rules
    text = text.replace(/^[\-\*_]{3,}\s*$/gm, '')

    return text.trim()
}

/**
 * Generate complete HTML document
 */
export function generateHtmlDocument(markdown, title = 'Document') {
    const htmlContent = markdownToHtml(markdown)

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }
    
    h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    h3 { font-size: 1.25em; }
    h4 { font-size: 1em; }
    h5 { font-size: 0.875em; }
    h6 { font-size: 0.85em; color: #6a737d; }
    
    p { margin-bottom: 16px; }
    
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    
    code {
      background-color: #f6f8fa;
      border-radius: 3px;
      padding: 0.2em 0.4em;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 85%;
    }
    
    pre {
      background-color: #f6f8fa;
      border-radius: 3px;
      padding: 16px;
      overflow: auto;
      line-height: 1.45;
    }
    
    pre code {
      background-color: transparent;
      padding: 0;
    }
    
    blockquote {
      border-left: 4px solid #dfe2e5;
      margin: 0;
      padding: 0 1em;
      color: #6a737d;
    }
    
    ul, ol {
      padding-left: 2em;
      margin-bottom: 16px;
    }
    
    li { margin-bottom: 0.25em; }
    
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 16px;
    }
    
    table th, table td {
      border: 1px solid #dfe2e5;
      padding: 6px 13px;
    }
    
    table th {
      background-color: #f6f8fa;
      font-weight: 600;
    }
    
    table tr:nth-child(2n) {
      background-color: #f6f8fa;
    }
    
    img {
      max-width: 100%;
      height: auto;
    }
    
    hr {
      border: 0;
      border-top: 1px solid #eaecef;
      margin: 24px 0;
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`
}

/**
 * Insert Markdown syntax
 */
export const markdownInsert = {
    bold: (text) => `**${text}**`,
    italic: (text) => `*${text}*`,
    strikethrough: (text) => `~~${text}~~`,
    code: (text) => `\`${text}\``,
    codeBlock: (text, lang = '') => `\`\`\`${lang}\n${text}\n\`\`\``,
    link: (text, url) => `[${text}](${url})`,
    image: (alt, url) => `![${alt}](${url})`,
    heading: (text, level = 1) => `${'#'.repeat(level)} ${text}`,
    quote: (text) => `> ${text}`,
    ul: (items) => items.map(item => `- ${item}`).join('\n'),
    ol: (items) => items.map((item, i) => `${i + 1}. ${item}`).join('\n'),
    hr: () => '---',
    table: (headers, rows) => {
        const headerRow = `| ${headers.join(' | ')} |`
        const separator = `| ${headers.map(() => '---').join(' | ')} |`
        const dataRows = rows.map(row => `| ${row.join(' | ')} |`).join('\n')
        return `${headerRow}\n${separator}\n${dataRows}`
    }
}

export default {
    markdownToHtml,
    markdownToText,
    generateHtmlDocument,
    markdownInsert
}
