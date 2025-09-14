// Supabase-driven register
console.log('Destiny register page loaded');

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.auth-form');
  if (!form) return;

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

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"], button');
    if (submitBtn) submitBtn.disabled = true;
    const email = (document.getElementById('register-mail') || {}).value || '';
    const loginName = (document.getElementById('register-login') || {}).value || '';
    const pass = (document.getElementById('register-password') || {}).value || '';
    const repeat = (document.getElementById('register-repeat') || {}).value || '';

    if (pass !== repeat) return showError('Паролі не співпадають');
    if (!window.sb) return showError('Auth ще не налаштовано. Перевір env.js');

    // Build absolute URL to dashboard relative to the current page.
    // Works on GitHub Pages repo subpath and on localhost.
    let redirectUrl;
    try {
      redirectUrl = new URL('../desteny cabinet/dashboard.html', window.location.href).toString();
    } catch (_) {
      redirectUrl = undefined;
    }

    const { data, error } = await window.sb.auth.signUp({
      email,
      password: pass,
      options: {
        data: { display_name: loginName },
        // після підтвердження листа Supabase поверне сюди
        emailRedirectTo: redirectUrl,
      },
    });
    if (error) {
      // Покращене повідомлення для rate limit
      if (String(error.message || '').toLowerCase().includes('rate limit')) {
        showError('Занадто часті запити на лист. Будь ласка, зачекай ~60 секунд і спробуй знову.');
        // Запропонувати повторну відправку через API
        renderResendLink(email);
      } else if (String(error.message || '').toLowerCase().includes('user already registered')) {
        showError('Емейл вже зареєстровано. Перевір пошту або увійди.');
        renderResendLink(email);
      } else {
        showError(error.message || 'Помилка під час реєстрації');
      }
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    // Require email confirmation. If not confirmed — sign out and show info
    const user = data?.user;
    const isConfirmed = !!(user?.email_confirmed_at || user?.confirmed_at);
    if (!isConfirmed) {
      try { await window.sb.auth.signOut(); } catch (_) {}
      form.innerHTML = '<p style="color:#c7cce3">We have sent a confirmation email. Please open it and click the button to verify your address. You will be redirected to the dashboard after confirmation.</p>';
      // Додати кнопку повторної відправки
      const resendWrap = document.createElement('div');
      resendWrap.style.marginTop = '12px';
      resendWrap.innerHTML = '<a href="#" style="color:#8fa2ff">Resend confirmation email</a>';
      form.appendChild(resendWrap);
      const link = resendWrap.querySelector('a');
      link.addEventListener('click', async (ev) => {
        ev.preventDefault();
        try {
          const r = await window.sb.auth.resend({ type: 'signup', email });
          if (r.error) throw r.error;
          link.textContent = 'Email sent again';
          link.style.pointerEvents = 'none';
          link.style.opacity = '0.7';
        } catch (err) {
          const m = String(err?.message || '').toLowerCase();
          if (m.includes('rate limit')) {
            alert('Please wait ~60 seconds before resending.');
          } else {
            alert('Failed to resend: ' + (err?.message || 'unknown error'));
          }
        }
      });
      return;
    }

    // Якщо акаунт вже підтверджений/автопідтверджений — редірект у кабінет
    try {
      const dashboardPath = new URL('../desteny cabinet/dashboard.html', window.location.href).toString();
      window.location.href = dashboardPath;
    } catch (_) {
      window.location.href = encodeURI('../desteny cabinet/dashboard.html');
    }
  });
});
