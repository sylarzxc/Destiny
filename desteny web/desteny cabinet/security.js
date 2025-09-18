// Security and Logging System for Destiny Platform
(function() {
  'use strict';

  // Security configuration
  const SECURITY_CONFIG = {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    suspiciousActivityThreshold: 10, // requests per minute
    logLevel: 'info' // 'debug', 'info', 'warn', 'error'
  };

  // Log levels
  const LOG_LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  // Security events storage
  let securityEvents = [];
  let loginAttempts = new Map();
  let suspiciousActivity = new Map();

  // Logging function
  function log(level, message, data = null) {
    const currentLevel = LOG_LEVELS[SECURITY_CONFIG.logLevel] || 1;
    const messageLevel = LOG_LEVELS[level] || 1;
    
    if (messageLevel < currentLevel) return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Store in memory (in production, this would go to a secure logging service)
    securityEvents.push(logEntry);
    
    // Keep only last 1000 events
    if (securityEvents.length > 1000) {
      securityEvents = securityEvents.slice(-1000);
    }

    // Console logging for development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console[level] ? console[level](`[${timestamp}] ${message}`, data) : console.log(`[${timestamp}] ${message}`, data);
    }
  }

  // Security event tracking
  function trackSecurityEvent(eventType, details = {}) {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      details,
      ip: 'unknown', // In production, get from server
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    securityEvents.push(event);
    log('info', `Security event: ${eventType}`, details);
  }

  // Rate limiting
  function checkRateLimit(identifier, maxRequests = 10, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!suspiciousActivity.has(identifier)) {
      suspiciousActivity.set(identifier, []);
    }
    
    const requests = suspiciousActivity.get(identifier);
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(time => time > windowStart);
    suspiciousActivity.set(identifier, recentRequests);
    
    if (recentRequests.length >= maxRequests) {
      trackSecurityEvent('rate_limit_exceeded', {
        identifier,
        requestCount: recentRequests.length,
        windowMs
      });
      return false;
    }
    
    recentRequests.push(now);
    return true;
  }

  // Login attempt tracking
  function trackLoginAttempt(email, success) {
    const key = `login_${email}`;
    const now = Date.now();
    
    if (!loginAttempts.has(key)) {
      loginAttempts.set(key, { attempts: 0, lastAttempt: 0, lockedUntil: 0 });
    }
    
    const attempt = loginAttempts.get(key);
    
    if (success) {
      // Reset on successful login
      attempt.attempts = 0;
      attempt.lockedUntil = 0;
      log('info', 'Successful login', { email });
    } else {
      attempt.attempts++;
      attempt.lastAttempt = now;
      
      if (attempt.attempts >= SECURITY_CONFIG.maxLoginAttempts) {
        attempt.lockedUntil = now + SECURITY_CONFIG.lockoutDuration;
        trackSecurityEvent('account_locked', {
          email,
          attempts: attempt.attempts,
          lockedUntil: attempt.lockedUntil
        });
        log('warn', 'Account locked due to failed login attempts', { email, attempts: attempt.attempts });
      } else {
        trackSecurityEvent('failed_login', {
          email,
          attempts: attempt.attempts
        });
        log('warn', 'Failed login attempt', { email, attempts: attempt.attempts });
      }
    }
  }

  // Check if account is locked
  function isAccountLocked(email) {
    const key = `login_${email}`;
    const attempt = loginAttempts.get(key);
    
    if (!attempt) return false;
    
    const now = Date.now();
    if (attempt.lockedUntil > now) {
      return true;
    }
    
    // Unlock if lockout period has passed
    if (attempt.lockedUntil > 0 && attempt.lockedUntil <= now) {
      attempt.lockedUntil = 0;
      attempt.attempts = 0;
    }
    
    return false;
  }

  // Input validation
  function validateInput(input, type) {
    if (!input || typeof input !== 'string') {
      return { valid: false, error: 'Invalid input' };
    }

    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input)) {
          return { valid: false, error: 'Invalid email format' };
        }
        break;
        
      case 'password':
        if (input.length < 8) {
          return { valid: false, error: 'Password must be at least 8 characters' };
        }
        if (input.length > 64) {
          return { valid: false, error: 'Password too long' };
        }
        if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(input)) {
          return { valid: false, error: 'Password must contain letters and numbers' };
        }
        break;
        
      case 'amount':
        const amount = parseFloat(input);
        if (isNaN(amount) || amount <= 0) {
          return { valid: false, error: 'Invalid amount' };
        }
        if (amount > 1000000) {
          return { valid: false, error: 'Amount too large' };
        }
        break;
        
      case 'stake_id':
        const stakeId = parseInt(input);
        if (isNaN(stakeId) || stakeId <= 0) {
          return { valid: false, error: 'Invalid stake ID' };
        }
        break;
    }

    return { valid: true };
  }

  // XSS protection
  function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // CSRF token generation
  function generateCSRFToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Session security
  function checkSessionSecurity() {
    const session = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
    
    if (!session.access_token) {
      log('warn', 'No active session found');
      return false;
    }

    // Check session expiry
    if (session.expires_at && Date.now() > session.expires_at * 1000) {
      log('warn', 'Session expired');
      localStorage.removeItem('supabase.auth.token');
      return false;
    }

    return true;
  }

  // API request security wrapper
  function secureApiCall(apiFunction, ...args) {
    return new Promise(async (resolve, reject) => {
      try {
        // Check session security
        if (!checkSessionSecurity()) {
          throw new Error('Session expired or invalid');
        }

        // Rate limiting
        const userId = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}').user?.id;
        if (userId && !checkRateLimit(`api_${userId}`)) {
          throw new Error('Too many requests. Please try again later.');
        }

        // Make the API call
        const result = await apiFunction(...args);
        
        log('debug', 'API call successful', { function: apiFunction.name });
        resolve(result);
        
      } catch (error) {
        log('error', 'API call failed', { 
          function: apiFunction.name, 
          error: error.message 
        });
        
        trackSecurityEvent('api_error', {
          function: apiFunction.name,
          error: error.message
        });
        
        reject(error);
      }
    });
  }

  // Export security utilities
  window.security = {
    log,
    trackSecurityEvent,
    trackLoginAttempt,
    isAccountLocked,
    validateInput,
    sanitizeInput,
    generateCSRFToken,
    checkSessionSecurity,
    secureApiCall,
    getSecurityEvents: () => [...securityEvents],
    clearSecurityEvents: () => { securityEvents = []; }
  };

  // Initialize security monitoring
  document.addEventListener('DOMContentLoaded', () => {
    log('info', 'Security system initialized');
    
    // Monitor for suspicious activity
    setInterval(() => {
      const now = Date.now();
      const windowMs = 60000; // 1 minute
      
      for (const [identifier, requests] of suspiciousActivity.entries()) {
        const recentRequests = requests.filter(time => now - time < windowMs);
        if (recentRequests.length > SECURITY_CONFIG.suspiciousActivityThreshold) {
          trackSecurityEvent('suspicious_activity', {
            identifier,
            requestCount: recentRequests.length
          });
        }
      }
    }, 30000); // Check every 30 seconds
  });

})();
