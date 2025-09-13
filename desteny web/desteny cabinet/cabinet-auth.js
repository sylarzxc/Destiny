// Guard cabinet pages: require Supabase session; handle logout click
document.addEventListener('DOMContentLoaded', async () => {
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
  } catch (_) {}
});
