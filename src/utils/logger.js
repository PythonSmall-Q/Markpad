// 日志系统
class Logger {
  constructor() {
    this.logs = []
    this.maxLogs = 1000 // 最多保存1000条日志
  }

  /**
   * 记录日志
   * @param {string} level - 日志级别 (info, warn, error, success)
   * @param {string} action - 操作/行为
   * @param {string} result - 结果
   * @param {Object} details - 详细信息（可选）
   */
  log(level, action, result, details = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      action,
      result,
      details
    }

    this.logs.push(logEntry)

    // 如果超过最大日志数，删除最旧的
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // 同时输出到控制台
    const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'
    console[consoleMethod](`[${level.toUpperCase()}] ${action}: ${result}`, details || '')
  }

  info(action, result, details) {
    this.log('info', action, result, details)
  }

  warn(action, result, details) {
    this.log('warn', action, result, details)
  }

  error(action, result, details) {
    this.log('error', action, result, details)
  }

  success(action, result, details) {
    this.log('success', action, result, details)
  }

  /**
   * 获取所有日志
   */
  getLogs() {
    return [...this.logs]
  }

  /**
   * 获取过滤后的日志
   * @param {string} level - 日志级别过滤
   */
  getLogsByLevel(level) {
    return this.logs.filter(log => log.level === level)
  }

  /**
   * 清空日志
   */
  clearLogs() {
    this.logs = []
  }

  /**
   * 导出日志为文本
   */
  exportLogs() {
    const lines = this.logs.map(log => {
      const timestamp = new Date(log.timestamp).toLocaleString()
      const details = log.details ? `\n  Details: ${JSON.stringify(log.details, null, 2)}` : ''
      return `[${timestamp}] [${log.level.toUpperCase()}] ${log.action}\n  Result: ${log.result}${details}`
    })
    return lines.join('\n\n')
  }

  /**
   * 导出日志为JSON
   */
  exportLogsJSON() {
    return JSON.stringify(this.logs, null, 2)
  }
}

// 创建全局单例
const logger = new Logger()

export default logger
