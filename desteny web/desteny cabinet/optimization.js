// Performance Optimization System for Destiny Platform
(function() {
  'use strict';

  // Cache configuration
  const CACHE_CONFIG = {
    maxSize: 100, // Maximum number of cached items
    defaultTTL: 5 * 60 * 1000, // 5 minutes default TTL
    longTTL: 30 * 60 * 1000, // 30 minutes for static data
    shortTTL: 30 * 1000 // 30 seconds for dynamic data
  };

  // Cache storage
  let cache = new Map();
  let cacheTimestamps = new Map();

  // Cache management
  const cacheManager = {
    set(key, value, ttl = CACHE_CONFIG.defaultTTL) {
      // Remove oldest items if cache is full
      if (cache.size >= CACHE_CONFIG.maxSize) {
        const oldestKey = cache.keys().next().value;
        this.delete(oldestKey);
      }

      cache.set(key, value);
      cacheTimestamps.set(key, Date.now() + ttl);
    },

    get(key) {
      const timestamp = cacheTimestamps.get(key);
      if (!timestamp || Date.now() > timestamp) {
        this.delete(key);
        return null;
      }
      return cache.get(key);
    },

    delete(key) {
      cache.delete(key);
      cacheTimestamps.delete(key);
    },

    clear() {
      cache.clear();
      cacheTimestamps.clear();
    },

    size() {
      return cache.size;
    }
  };

  // Debounce function for input events
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function for scroll/resize events
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Lazy loading for images
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Preload critical resources
  function preloadCriticalResources() {
    const criticalResources = [
      'cabinet.css',
      'notifications.js',
      'security.js'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });
  }

  // Optimize API calls with caching
  function createCachedApiCall(apiFunction, cacheKey, ttl = CACHE_CONFIG.defaultTTL) {
    return async (...args) => {
      const key = `${cacheKey}_${JSON.stringify(args)}`;
      const cached = cacheManager.get(key);
      
      if (cached) {
        console.log(`Cache hit for ${cacheKey}`);
        return cached;
      }

      try {
        const result = await apiFunction(...args);
        cacheManager.set(key, result, ttl);
        console.log(`Cache miss for ${cacheKey}, result cached`);
        return result;
      } catch (error) {
        console.error(`API call failed for ${cacheKey}:`, error);
        throw error;
      }
    };
  }

  // Bundle multiple API calls
  function batchApiCalls(apiCalls) {
    return Promise.allSettled(apiCalls.map(call => 
      typeof call === 'function' ? call() : call
    ));
  }

  // Optimize DOM operations
  function batchDOMUpdates(updates) {
    // Use DocumentFragment for batch DOM updates
    const fragment = document.createDocumentFragment();
    
    updates.forEach(update => {
      if (typeof update === 'function') {
        update(fragment);
      }
    });

    return fragment;
  }

  // Memory management
  function cleanupMemory() {
    // Clear old cache entries
    const now = Date.now();
    for (const [key, timestamp] of cacheTimestamps.entries()) {
      if (now > timestamp) {
        cacheManager.delete(key);
      }
    }

    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
  }

  // Performance monitoring
  function initPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
      if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        
        console.log(`Page load time: ${loadTime}ms`);
        
        // Log slow page loads
        if (loadTime > 3000) {
          console.warn('Slow page load detected:', loadTime + 'ms');
        }
      }
    });

    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
        const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
        
        if (usedMB > 50) { // Alert if using more than 50MB
          console.warn(`High memory usage: ${usedMB}MB / ${totalMB}MB`);
          cleanupMemory();
        }
      }, 30000); // Check every 30 seconds
    }
  }

  // Optimize scroll performance
  function initScrollOptimization() {
    let ticking = false;
    
    function updateScrollPosition() {
      // Throttled scroll handling
      ticking = false;
    }
    
    function requestScrollUpdate() {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  }

  // Optimize resize performance
  function initResizeOptimization() {
    const handleResize = throttle(() => {
      // Throttled resize handling
      console.log('Window resized');
    }, 250);
    
    window.addEventListener('resize', handleResize);
  }

  // Bundle CSS and JS for critical path
  function optimizeCriticalPath() {
    // Inline critical CSS
    const criticalCSS = `
      .loading-spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top-color: var(--primary-color); animation: spin 1s ease-in-out infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .card { background: var(--card-bg); border-radius: 12px; padding: 1.5rem; border: 1px solid rgba(255, 255, 255, 0.1); }
      .btn-primary { background: linear-gradient(90deg, #5d76f7, #9c48ec); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; }
    `;
    
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
  }

  // Export optimization utilities
  window.optimization = {
    cacheManager,
    debounce,
    throttle,
    createCachedApiCall,
    batchApiCalls,
    batchDOMUpdates,
    cleanupMemory,
    initLazyLoading,
    preloadCriticalResources,
    initPerformanceMonitoring,
    initScrollOptimization,
    initResizeOptimization,
    optimizeCriticalPath
  };

  // Initialize optimizations
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing performance optimizations...');
    
    // Critical path optimization
    optimizeCriticalPath();
    
    // Preload critical resources
    preloadCriticalResources();
    
    // Initialize lazy loading
    initLazyLoading();
    
    // Initialize performance monitoring
    initPerformanceMonitoring();
    
    // Initialize scroll optimization
    initScrollOptimization();
    
    // Initialize resize optimization
    initResizeOptimization();
    
    // Cleanup memory every 5 minutes
    setInterval(cleanupMemory, 5 * 60 * 1000);
    
    console.log('Performance optimizations initialized');
  });

})();
