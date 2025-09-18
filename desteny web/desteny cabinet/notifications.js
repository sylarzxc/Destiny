// Notification System for Destiny Platform
(function() {
  'use strict';

  // Create notification container if it doesn't exist
  function ensureNotificationContainer() {
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'notification-container';
      document.body.appendChild(container);
    }
    return container;
  }

  // Show notification
  function showNotification(options) {
    const {
      type = 'info',
      title = '',
      message = '',
      duration = 5000,
      closable = true
    } = options;

    const container = ensureNotificationContainer();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Icons for different types
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    notification.innerHTML = `
      <div class="notification-icon">${icons[type] || icons.info}</div>
      <div class="notification-content">
        ${title ? `<div class="notification-title">${title}</div>` : ''}
        <div class="notification-message">${message}</div>
      </div>
      ${closable ? '<button class="notification-close" aria-label="Close notification">×</button>' : ''}
    `;

    // Add close functionality
    if (closable) {
      const closeBtn = notification.querySelector('.notification-close');
      closeBtn.addEventListener('click', () => {
        removeNotification(notification);
      });
    }

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(notification);
      }, duration);
    }

    // Add to container
    container.appendChild(notification);

    // Return notification element for manual control
    return notification;
  }

  // Remove notification with animation
  function removeNotification(notification) {
    if (!notification || !notification.parentNode) return;
    
    notification.classList.add('removing');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  // Convenience methods
  const notifications = {
    success: (title, message, options = {}) => 
      showNotification({ type: 'success', title, message, ...options }),
    
    error: (title, message, options = {}) => 
      showNotification({ type: 'error', title, message, duration: 8000, ...options }),
    
    warning: (title, message, options = {}) => 
      showNotification({ type: 'warning', title, message, ...options }),
    
    info: (title, message, options = {}) => 
      showNotification({ type: 'info', title, message, ...options }),

    // Custom notification
    show: (options) => showNotification(options),

    // Clear all notifications
    clear: () => {
      const container = document.getElementById('notification-container');
      if (container) {
        container.innerHTML = '';
      }
    }
  };

  // Make notifications globally available
  window.notifications = notifications;

  // Auto-clear notifications on page unload
  window.addEventListener('beforeunload', () => {
    notifications.clear();
  });

})();
