// Dashboard data bootstrap (keeps numbers zeroed by default)
(function () {
  const SHOW_REAL_NUMBERS = false; // switch to true when you want live data

  document.addEventListener('DOMContentLoaded', async () => {
    if (!window.sb || !window.authHelpers) return;
    const session = await window.authHelpers.session();
    if (!session) return;

    // Update greeting name from profile (fallback to email)
    try {
      const { data: prof } = await window.sb
        .from('profiles')
        .select('display_name, email')
        .eq('id', session.user.id)
        .single();
      const greetingEl = document.querySelector('.user-greeting span:last-child');
      if (greetingEl) {
        const name = (prof?.display_name || session.user.email || 'User').toString();
        greetingEl.textContent = 'Hello, ' + name;
      }
    } catch (_) {}

    if (!SHOW_REAL_NUMBERS) return; // keep dashboard values as zeros/placeholders

    // Example: populate Active deposits summary when enabled
    try {
      const amountEl = document.querySelector('.card-active-deposits .active-amount');
      const metaEl = document.querySelector('.card-active-deposits .active-meta');
      const typeEl = document.querySelector('.card-active-deposits .active-type');
      if (amountEl || metaEl || typeEl) {
        const { data: stakes, error } = await window.sb
          .from('stakes')
          .select('id, amount, status, start_at, end_at, plan_id, plans:plan_id (name, days, apr, type)')
          .eq('user_id', session.user.id)
          .order('start_at', { ascending: false });
        if (!error) {
          const active = (stakes || []).filter(s => s.status === 'active');
          const sum = active.reduce((acc, s) => acc + Number(s.amount || 0), 0);
          if (amountEl) amountEl.textContent = '$' + sum.toLocaleString();
          if (active.length) {
            const s0 = active[0];
            const plan = s0.plans || {};
            const aprPct = (Number(plan.apr || 0) * 100).toFixed(2) + '%';
            if (metaEl) metaEl.textContent = (plan.type === 'flexible')
              ? `Flexible • APR ${aprPct}`
              : `Locked ${plan.days} • APR ${aprPct}`;
            if (typeEl) typeEl.textContent = `${plan.name || ''}\nID ${s0.id}`;
          }
        }
      }
    } catch (_) {}
  });
})();

