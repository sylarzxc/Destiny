// Guard cabinet pages: require Supabase session; handle logout click
document.addEventListener('DOMContentLoaded', async () => {
  // Clear any hardcoded placeholder name immediately to avoid flicker
  try {
    document.querySelectorAll('.user-greeting span:last-child').forEach((el) => {
      el.textContent = 'Hello,';
    });
  } catch (_) {}
  // If Supabase is not configured yet, skip guarding to avoid blocking local dev
  if (!window.authHelpers) return;
  const loginHref = encodeURI('../desteny login/login.html');
  const session = await window.authHelpers.requireAuth(loginHref);
  if (!session) return;

  // Extra guard: require confirmed email
  if (window.sb && window.sb.auth && typeof window.sb.auth.getUser === 'function') {
    try {
      const { data } = await window.sb.auth.getUser();
      const u = data?.user;
      const confirmed = !!(u?.email_confirmed_at || u?.confirmed_at);
      if (!confirmed) {
        try { await window.authHelpers.signOut(); } catch (_) {}
        window.location.href = encodeURI('../desteny login/login.html?confirm=1');
        return;
      }
      // Sync profile.display_name on first login (if empty, take from user metadata)
      try {
        const desired = (u?.user_metadata?.display_name || '').trim();
        if (desired) {
          const { data: prof, error: pErr } = await window.sb
            .from('profiles')
            .select('display_name')
            .eq('id', u.id)
            .single();
          if (!pErr && (!prof || !prof.display_name)) {
            await window.sb
              .from('profiles')
              .update({ display_name: desired })
              .eq('id', u.id);
          }
        }
      } catch (_) {}
    } catch (_) {}
  }

  // Attach sign out handler
  const logoutLink = document.querySelector('.nav-item.logout');
  if (logoutLink) {
    logoutLink.addEventListener('click', async (e) => {
      e.preventDefault();
      try { await window.authHelpers.signOut(); } catch (_) {}
      window.location.href = encodeURI('../desteny/index.html');
    });
  }

  // Populate user name in sidebar greeting
  try {
    const uRes = await window.sb.auth.getUser();
    const user = uRes?.data?.user || session.user;
    let display = '';
    // 1) Try profiles.display_name
    try {
      const { data: prof } = await window.sb
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();
      if (prof && prof.display_name) display = String(prof.display_name).trim();
    } catch (_) {}
    // 2) Fallback to metadata
    if (!display) {
      display = (user?.user_metadata?.display_name || user?.user_metadata?.name || '').trim();
    }
    // 3) Fallback to email local-part
    if (!display) {
      const email = user?.email || '';
      display = email.includes('@') ? email.split('@')[0] : 'User';
    }
    document.querySelectorAll('.user-greeting').forEach((el) => {
      const nameSpan = el.querySelector('span:last-child');
      if (nameSpan) nameSpan.textContent = `Hello, ${display}`;
    });

    // Add Admin link for admin users
    try {
      const { data: prof } = await window.sb
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      const role = (prof?.role ? String(prof.role) : '').trim().toLowerCase();
      if (role === 'admin') {
        window.__isAdmin = true;
        document.body.classList?.add('is-admin');
        const nav = document.querySelector('.sidebar .sidebar-nav');
        if (nav && !nav.querySelector('a[href="admin.html"]')) {
          const a = document.createElement('a');
          a.href = 'admin.html';
          a.className = 'nav-item';
          a.innerHTML = `
            <svg class="nav-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M3 12h18M3 6h18M3 18h18" fill="none" stroke="currentColor" stroke-width="1.6" />
            </svg>
            <span>Admin</span>
            <svg class="nav-arrow" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
          nav.appendChild(a);
        }
      }
    } catch (_) {}
  } catch (_) {}
});
