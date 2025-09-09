// Supabase client bootstrap for Destiny static site
// Load config from window.__ENV provided by env.js (copy env.example.js -> env.js)
// Exposes window.sb (Supabase client) and authHelpers

(function () {
  const w = typeof window !== 'undefined' ? window : {};
  const hasSupabase = w.supabase && typeof w.supabase.createClient === 'function';
  const cfg = w.__ENV || {};

  if (!hasSupabase) {
    console.warn('[Supabase] UMD build not loaded. Include CDN before this file.');
    w.sb = null;
    return;
  }
  if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
    console.warn('[Supabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY. Provide them in env.js');
    w.sb = null;
    return;
  }

  w.sb = w.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

  w.authHelpers = {
    async session() {
      if (!w.sb) return null;
      const { data } = await w.sb.auth.getSession();
      return data?.session || null;
    },
    async requireAuth(loginHref) {
      const s = await this.session();
      if (!s && loginHref) {
        location.href = loginHref;
        return null;
      }
      return s;
    },
    async signOut() {
      if (!w.sb) return;
      try { await w.sb.auth.signOut(); } catch (e) { console.warn('signOut error', e); }
    },
  };
})();

