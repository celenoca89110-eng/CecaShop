// Input validation and sanitization utilities
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  
  password: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule')
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre')
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  },
  
  discordUsername: (username: string): { valid: boolean; error?: string } => {
    // Discord username format: username#0000 or just username (new format)
    const oldFormat = /^[a-zA-Z0-9_]{2,32}#\d{4}$/
    const newFormat = /^[a-zA-Z0-9_]{2,32}$/
    
    if (!username || username.trim().length === 0) {
      return { valid: false, error: 'Le pseudo Discord est requis' }
    }
    
    if (!oldFormat.test(username) && !newFormat.test(username)) {
      return { 
        valid: false, 
        error: 'Format invalide. Utilisez username#0000 ou username' 
      }
    }
    
    return { valid: true }
  },
  
  text: (text: string, minLength: number = 1, maxLength: number = 1000): boolean => {
    return text.length >= minLength && text.length <= maxLength
  },
  
  number: (value: string, min: number = 0, max: number = Infinity): boolean => {
    const num = parseFloat(value)
    return !isNaN(num) && num >= min && num <= max
  },
  
  url: (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}

// Sanitize input to prevent XSS
export const sanitize = {
  text: (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  },
  
  html: (html: string): string => {
    // Basic HTML sanitization - in production use a library like DOMPurify
    return html
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '')
      .replace(/<iframe\b[^>]*>([\s\S]*?)<\/iframe>/gim, '')
      .replace(/on\w+="[^"]*"/g, '')
  }
}

// Rate limiting for login attempts
export class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map()
  private maxAttempts: number
  private windowMs: number
  
  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
  }
  
  canAttempt(identifier: string): boolean {
    const now = Date.now()
    const record = this.attempts.get(identifier)
    
    if (!record) {
      return true
    }
    
    // Reset if window has passed
    if (now - record.lastAttempt > this.windowMs) {
      this.attempts.delete(identifier)
      return true
    }
    
    return record.count < this.maxAttempts
  }
  
  recordAttempt(identifier: string): void {
    const now = Date.now()
    const record = this.attempts.get(identifier)
    
    if (record) {
      record.count++
      record.lastAttempt = now
    } else {
      this.attempts.set(identifier, { count: 1, lastAttempt: now })
    }
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier)
  }
  
  getRemainingAttempts(identifier: string): number {
    const record = this.attempts.get(identifier)
    if (!record) return this.maxAttempts
    
    const now = Date.now()
    if (now - record.lastAttempt > this.windowMs) {
      this.attempts.delete(identifier)
      return this.maxAttempts
    }
    
    return Math.max(0, this.maxAttempts - record.count)
  }
  
  getLockoutTime(identifier: string): number {
    const record = this.attempts.get(identifier)
    if (!record || record.count < this.maxAttempts) return 0
    
    const now = Date.now()
    const elapsed = now - record.lastAttempt
    return Math.max(0, this.windowMs - elapsed)
  }
}

export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000) // 5 attempts per 15 minutes
