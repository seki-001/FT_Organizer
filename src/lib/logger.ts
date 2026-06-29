type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogPayload {
  event: string
  level?: LogLevel
  user_id?: string
  resource_id?: string
  error_code?: string
  duration_ms?: number
  timestamp?: string
  [key: string]: unknown
}

function emit(level: LogLevel, payload: LogPayload) {
  const entry = {
    level,
    timestamp: payload.timestamp ?? new Date().toISOString(),
    ...payload,
  }

  if (process.env.NODE_ENV === 'production') {
    const line = JSON.stringify(entry)
    if (level === 'error') process.stderr.write(`${line}\n`)
    else process.stdout.write(`${line}\n`)
    return
  }

  const tag = `[${level.toUpperCase()}] ${payload.event}`
  if (level === 'error') console.error(tag, entry)
  else if (level === 'warn') console.warn(tag, entry)
  else console.info(tag, entry)
}

export const logger = {
  debug: (payload: LogPayload) => emit('debug', payload),
  info:  (payload: LogPayload) => emit('info', payload),
  warn:  (payload: LogPayload) => emit('warn', payload),
  error: (payload: LogPayload) => emit('error', payload),
}
