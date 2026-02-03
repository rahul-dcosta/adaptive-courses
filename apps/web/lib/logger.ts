type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  userId?: string;
  requestId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  
  private log(level: LogLevel, message: string, data?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };
    
    // In development, use console
    if (this.isDevelopment) {
      const method = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[method](`[${level.toUpperCase()}]`, message, data || '');
      return;
    }
    
    // In production, send to logging service or just use console
    // TODO: Integrate with DataDog, LogRocket, or similar
    console.log(JSON.stringify(entry));
  }
  
  debug(message: string, data?: unknown) {
    if (this.isDevelopment) {
      this.log('debug', message, data);
    }
  }
  
  info(message: string, data?: unknown) {
    this.log('info', message, data);
  }
  
  warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }
  
  error(message: string, error?: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    this.log('error', message, {
      error: errorMessage,
      stack: errorStack
    });
  }
  
  // Performance monitoring
  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.info(`${name} completed`, { durationMs: duration });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.error(`${name} failed`, { error, durationMs: duration });
      throw error;
    }
  }
}

export const logger = new Logger();
