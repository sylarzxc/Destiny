// Supabase-driven login
console.log('Destiny login page loaded');

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.auth-form');
  if (!form) return;

  // inline error element
  let errorEl = document.querySelector('.auth-error');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'auth-error';
    errorEl.style.color = '#ff6b6b';
    errorEl.style.marginTop = '0.6rem';
    errorEl.style.fontSize = '0.95rem';
    errorEl.style.display = 'none';
    form.appendChild(errorEl);
  }

  async function doLogin(email, password) {
    if (!window.sb) {
      errorEl.textContent = 'Auth не налаштовано. Додайте env.js з ключами Supabase.';
      errorEl.style.display = 'block';
      return;
    }
    const { error } = await window.sb.auth.signInWithPassword({ email, password });
    if (error) {
      errorEl.textContent = error.message || 'Помилка входу';
      errorEl.style.display = 'block';
      form.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(0)' }
      ], { duration: 300, iterations: 1 });
      return;
    }
    try {
      const dashboardPath = new URL('../desteny cabinet/dashboard.html', window.location.href).toString();
      window.location.href = dashboardPath;
    } catch (_) {
      window.location.href = encodeURI('../desteny cabinet/dashboard.html');
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = (document.getElementById('login-email') || {}).value || '';
    const password = (document.getElementById('login-password') || {}).value || '';
    doLogin(email.trim(), password);
  });
});
