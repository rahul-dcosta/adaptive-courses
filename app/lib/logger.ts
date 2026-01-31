type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  userId?: string;
  requestId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  
  private log(level: LogLevel, message: string, data?: any) {
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
  
  debug(message: string, data?: any) {
    if (this.isDevelopment) {
      this.log('debug', message, data);
    }
  }
  
  info(message: string, data?: any) {
    this.log('info', message, data);
  }
  
  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }
  
  error(message: string, error?: Error | any) {
    this.log('error', message, {
      error: error?.message || error,
      stack: error?.stack
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
