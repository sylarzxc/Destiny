// Dashboard data bootstrap (keeps numbers zeroed by default)
(function () {
  const SHOW_REAL_NUMBERS = true; // enable live data for balances

  document.addEventListener('DOMContentLoaded', async () => {
    if (!window.sb || !window.authHelpers) return;
    const session = await window.authHelpers.session();
    if (!session) return;

    // Update greeting name from profile (fallback to email)
    try {
      const { data: prof } = await window.sb
        .from('profiles')
        .select('display_name, email, referrer_id')
        .eq('id', session.user.id)
        .single();
      const greetingEl = document.querySelector('.user-greeting span:last-child');
      if (greetingEl) {
        const name = (prof?.display_name || session.user.email || 'User').toString();
        greetingEl.textContent = 'Hello, ' + name;
      }
    } catch (_) {}

    const referralInput = document.getElementById('referralLinkInput');
    const referralCopyBtn = document.getElementById('referralLinkCopy');
    const allReferralsBtn = document.getElementById('allReferralsBtn');
    if (allReferralsBtn) {
      allReferralsBtn.addEventListener('click', () => { window.location.href = 'referrals.html'; });
    }
    if (referralInput) {
      try {
        const base = (window.__ENV?.SITE_URL && window.__ENV.SITE_URL.trim()) || window.location.origin || 'https://Destiny-cefi.com';
        const normalizedBase = base.replace(/\/?$/, '');
        const link = `${normalizedBase}/?ref=${session.user.id}`;
        referralInput.value = link;
        referralCopyBtn?.addEventListener('click', async () => {
          try {
            if (navigator.clipboard?.writeText) {
              await navigator.clipboard.writeText(link);
            } else {
              const wasReadOnly = referralInput.hasAttribute('readonly');
              if (wasReadOnly) referralInput.removeAttribute('readonly');
              referralInput.select();
              document.execCommand('copy');
              if (wasReadOnly) referralInput.setAttribute('readonly', '');
              referralInput.blur();
            }
            referralCopyBtn?.classList.add('copied');
            setTimeout(() => referralCopyBtn?.classList.remove('copied'), 1500);
          } catch (err) {
            console.warn('Copy failed', err);
          }
        });
      } catch (err) {
        console.warn('Failed to prepare referral link', err);
      }
    }

    try {
      const storedRef = localStorage.getItem('destiny_pending_referral');
      if (storedRef && !(prof?.referrer_id)) {
        await window.sb.rpc('apply_referral', { p_ref_code: storedRef });
        localStorage.removeItem('destiny_pending_referral');
      } else if (prof?.referrer_id) {
        localStorage.removeItem('destiny_pending_referral');
      }
    } catch (err) {
      console.warn('apply_referral failed', err);
    }

    if (!SHOW_REAL_NUMBERS) return; // keep dashboard values as zeros/placeholders

    // Balance card: total USD across wallets and invested across active stakes
    try {
      const balEl = document.querySelector('.card-balance .balance-amount');
      const invEl = document.querySelector('.card-balance .balance-invested');
      if (balEl || invEl) {
        const [{ data: wallets }, { data: stakes }] = await Promise.all([
          window.sb.from('wallets').select('currency, available, locked'),
          window.sb.from('stakes').select('amount, status, currency').eq('user_id', session.user.id)
        ]);
        let totalUsd = 0;
        for (const w of (wallets||[])) {
          const usd = await (window.ratesUtil?.estimateUSDT(String(w.currency||'USDT'), Number(w.available||0)) || Promise.resolve(0));
          totalUsd += Number(usd||0);
        }
        let investedUsd = 0;
        for (const s of (stakes||[])) {
          if (String(s.status||'') !== 'active') continue;
          const usd = await (window.ratesUtil?.estimateUSDT(String(s.currency||'USDT'), Number(s.amount||0)) || Promise.resolve(0));
          investedUsd += Number(usd||0);
        }
        if (balEl) balEl.textContent = '$' + totalUsd.toFixed(2);
        if (invEl) invEl.textContent = 'Invested: $' + investedUsd.toFixed(2);
      }
    } catch (_) {}

    // Transactions table with pagination
    try {
      const pageSize = 10;
      let page = 1;
      const tbody = document.getElementById('txTableBody');
      const prevBtn = document.getElementById('txPrev');
      const nextBtn = document.getElementById('txNext');
      const pageInfo = document.getElementById('txPageInfo');

      const typeLabel = (t) => {
        switch (String(t || '').toLowerCase()) {
          case 'stake_create': return 'Deposit opened';
          case 'withdraw': return 'Withdrawn';
          case 'accrual': return 'Accrual';
          default: return t || '-';
        }
      };
      const fmtDate = (iso) => {
        try { return new Date(iso).toLocaleString(); } catch { return iso || '-'; }
      };

      async function loadPage() {
        if (!tbody) return;
        const from = (page - 1) * pageSize;
        const to = page * pageSize - 1;
        const { data, error, count } = await window.sb
          .from('transactions')
          .select('id, type, amount, created_at, meta', { count: 'exact' })
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .range(from, to);
        if (error) {
          tbody.innerHTML = `<tr><td colspan="5">Failed to load: ${error.message}</td></tr>`;
          return;
        }
        const rows = (data || []).map(r => {
          const cur = (r.meta && r.meta.currency) ? String(r.meta.currency).toUpperCase() : 'USDT';
          const details = r.meta?.stake_id ? `Stake #${r.meta.stake_id}` : '';
          return `<tr>
            <td>${fmtDate(r.created_at)}</td>
            <td>${typeLabel(r.type)}</td>
            <td>${Number(r.amount || 0).toFixed(2)}</td>
            <td>${cur}</td>
            <td>${details}</td>
          </tr>`;
        }).join('');
        tbody.innerHTML = rows || '<tr><td colspan="5">No activity yet</td></tr>';

        const totalPages = Math.max(1, Math.ceil((count || 0) / pageSize));
        if (pageInfo) pageInfo.textContent = `Page ${page} of ${totalPages}`;
        if (prevBtn) prevBtn.disabled = page <= 1;
        if (nextBtn) nextBtn.disabled = page >= totalPages;
      }

      prevBtn?.addEventListener('click', () => { if (page > 1) { page--; loadPage(); } });
      nextBtn?.addEventListener('click', () => { page++; loadPage(); });
      await loadPage();
    } catch (_) {}

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
