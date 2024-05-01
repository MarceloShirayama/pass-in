import { LOG_ERROR } from '@/_config/settings'
import fs from 'node:fs'

export const LEVEL = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
} as const

type Level = keyof typeof LEVEL

export function logMessage(message: object | string, level: Level) {
  const dirLogs = LOG_ERROR.DIR_LOGS
  const logFilePath = LOG_ERROR.FILE_LOG
  const currentDate = new Date().toLocaleString();
  const messageContent = typeof message === 'string' ? message : JSON.stringify(message, null, 2).replace(/\\n/g, '\n')
  const logContent = `[${currentDate}] - ${level} - ${messageContent}\n`
  switch (level) {
    case LEVEL.ERROR:
    case LEVEL.WARN:
      if (!fs.existsSync(dirLogs)) {
        fs.mkdirSync(dirLogs, { recursive: true })
      }
      if (!fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, logContent)
      }
      fs.appendFileSync(logFilePath, logContent)
      break;
    default:
      // eslint-disable-next-line no-console
      console.log(logContent)
      break;
  }
}
