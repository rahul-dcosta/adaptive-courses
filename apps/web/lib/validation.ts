// Input validation utilities

export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  return emailRegex.test(email);
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function validateCourseInput(data: {
  topic?: string;
  skillLevel?: string;
  goal?: string;
  timeAvailable?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.topic || data.topic.trim().length === 0) {
    errors.push('Topic is required');
  } else if (data.topic.length > 200) {
    errors.push('Topic must be less than 200 characters');
  }
  
  const validSkillLevels = ['beginner', 'intermediate', 'advanced'];
  if (data.skillLevel && !validSkillLevels.includes(data.skillLevel)) {
    errors.push('Invalid skill level');
  }
  
  if (data.goal && data.goal.length > 500) {
    errors.push('Goal must be less than 500 characters');
  }
  
  if (data.timeAvailable && data.timeAvailable.length > 100) {
    errors.push('Time available must be less than 100 characters');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML brackets
    .substring(0, 1000); // Limit length
}

export function validateRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Rate limiting (simple in-memory implementation)
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  isAllowed(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Filter out old requests
    const recentRequests = requests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    
    return true;
  }
  
  clear(key: string) {
    this.requests.delete(key);
  }
}

export const rateLimiter = new RateLimiter();
