// Destiny Reset Password Page JavaScript
document.addEventListener('DOMContentLoaded', async function() {
  const resetForm = document.getElementById('reset-form');
  const emailInput = document.getElementById('reset-email');
  const resetBtn = document.getElementById('reset-btn');
  const resetStatus = document.getElementById('reset-status');
  const emailHint = document.getElementById('email-hint');

  // Email validation
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Show/hide hints
  function showHint(element, message, isError = true) {
    element.textContent = message;
    element.style.display = 'block';
    element.style.color = isError ? '#ff6b6b' : '#51cf66';
  }

  function hideHint(element) {
    element.style.display = 'none';
  }

  // Show status message
  function showStatus(message, isSuccess = true) {
    resetStatus.innerHTML = message;
    resetStatus.style.display = 'block';
    resetStatus.style.color = isSuccess ? '#51cf66' : '#ff6b6b';
    resetStatus.style.backgroundColor = isSuccess ? 'rgba(81, 207, 102, 0.1)' : 'rgba(255, 107, 107, 0.1)';
    resetStatus.style.padding = '0.75rem';
    resetStatus.style.borderRadius = '8px';
    resetStatus.style.textAlign = 'center';
    resetStatus.style.marginTop = '1rem';
  }

  // Email input validation
  emailInput.addEventListener('blur', function() {
    const email = this.value.trim();
    if (email && !validateEmail(email)) {
      showHint(emailHint, 'Please enter a valid email address', true);
    } else {
      hideHint(emailHint);
    }
  });

  emailInput.addEventListener('input', function() {
    const email = this.value.trim();
    if (email && validateEmail(email)) {
      hideHint(emailHint);
    }
  });

  // Reset form submission
  resetForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    // Validate email
    if (!email) {
      showHint(emailHint, 'Please enter your email address', true);
      emailInput.focus();
      return;
    }
    
    if (!validateEmail(email)) {
      showHint(emailHint, 'Please enter a valid email address', true);
      emailInput.focus();
      return;
    }

    // Show loading state
    resetBtn.disabled = true;
    resetBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    try {
      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/desteny login/login.html?reset=true`
      });

      if (error) {
        throw error;
      }

      // Success
      showStatus(`
        <i class="fas fa-check-circle"></i>
        <strong>Reset link sent!</strong><br>
        Check your email for instructions to reset your password.
      `, true);
      
      // Clear form
      emailInput.value = '';
      hideHint(emailHint);
      
    } catch (error) {
      console.error('Reset password error:', error);
      
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      if (error.message.includes('Invalid email')) {
        errorMessage = 'This email address is not registered.';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      }
      
      showStatus(`
        <i class="fas fa-exclamation-circle"></i>
        <strong>Error:</strong> ${errorMessage}
      `, false);
      
    } finally {
      // Reset button state
      resetBtn.disabled = false;
      resetBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Reset Link';
    }
  });

  // Check if redirected from reset link
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('reset') === 'true') {
    showStatus(`
      <i class="fas fa-info-circle"></i>
      <strong>Password reset successful!</strong><br>
      You can now log in with your new password.
    `, true);
  }
});
