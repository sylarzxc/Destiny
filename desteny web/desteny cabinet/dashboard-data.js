(function () {
  const SHOW_REAL_NUMBERS = true;
  const BALANCE_REFRESH_MS = 30000;

  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const formatUsd = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) {
      return usdFormatter.format(0);
    }
    return usdFormatter.format(num);
  };

  const convertToUsd = async (currency, amount) => {
    const value = Number(amount || 0);
    if (!value) return 0;
    const asset = String(currency || 'USDT').toUpperCase();
    if (typeof window.ratesUtil?.estimateUSDT === 'function') {
      try {
        const result = await window.ratesUtil.estimateUSDT(asset, value);
        const numeric = Number(result);
        return Number.isFinite(numeric) ? numeric : value;
      } catch (err) {
        console.warn('ratesUtil.estimateUSDT failed', err);
      }
    }
    return value;
  };

  const setText = (el, text) => {
    if (!el) return;
    el.textContent = text;
  };

  const joinClean = (items, separator) => {
    return items.filter((item) => item && item.length).join(separator);
  };

  let lastKnownAvailableUsd = 0;
  let lastKnownLockedUsd = 0;

  document.addEventListener('DOMContentLoaded', () => {
    initDashboard().catch((err) => console.warn('Dashboard init failed', err));
  });

  async function initDashboard() {
    if (!window.sb || !window.authHelpers) return;
    const session = await window.authHelpers.session();
    if (!session?.user?.id) return;
    const userId = session.user.id;

    const profile = await loadProfile(userId, session);
    setupReferralLink(profile, session);

    if (!SHOW_REAL_NUMBERS) return;

    await initBalances(userId);
    await Promise.all([
      initTransactions(userId),
      initActiveStakes(userId)
    ]);
  }

  async function loadProfile(userId, session) {
    try {
      const { data, error } = await window.sb
        .from('profiles')
        .select('display_name, email')
        .eq('id', userId)
        .single();

      if (error) throw error;
      const profile = data || null;

      const greeting = document.querySelector('.user-greeting span:last-child');
      const name = profile?.display_name || session.user.email || 'User';
      if (greeting) {
        greeting.textContent = 'Hello, ' + String(name);
      }
      return profile;
    } catch (err) {
      console.warn('Failed to load profile', err);
      return null;
    }
  }

  function setupReferralLink(profile, session) {
    const input = document.getElementById('referralLinkInput');
    if (!input) return;

    const copyBtn = document.getElementById('referralLinkCopy');
    const allReferralsBtn = document.getElementById('allReferralsBtn');

    if (allReferralsBtn) {
      allReferralsBtn.addEventListener('click', () => {
        window.location.href = 'referrals.html';
      });
    }

    try {
      const base = (window.__ENV?.SITE_URL && window.__ENV.SITE_URL.trim()) || window.location.origin || '';
      const safeBase = base.replace(/\/?$/, '');
      const codeSource = profile?.referral_code || profile?.ref_code || session?.user?.id || '';
      const link = codeSource ? `${safeBase}/?ref=${encodeURIComponent(codeSource)}` : safeBase;
      input.value = link;

      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
          try {
            if (navigator.clipboard?.writeText) {
              await navigator.clipboard.writeText(link);
            } else {
              const wasReadOnly = input.hasAttribute('readonly');
              if (wasReadOnly) input.removeAttribute('readonly');
              input.select();
              document.execCommand('copy');
              if (wasReadOnly) input.setAttribute('readonly', '');
              input.blur();
            }
            copyBtn.classList.add('copied');
            setTimeout(() => copyBtn.classList.remove('copied'), 1500);
          } catch (err) {
            console.warn('Copy referral link failed', err);
          }
        });
      }
    } catch (err) {
      console.warn('Failed to prepare referral link', err);
    }
  }

  async function initBalances(userId) {
    const balanceEl = document.querySelector('.card-balance .balance-amount');
    const investedEl = document.querySelector('.card-balance .balance-invested');
    if (!balanceEl && !investedEl) return;

    const refresh = async () => {
      try {
        const [{ data: wallets, error: walletsError }, { data: stakes, error: stakesError }] = await Promise.all([
          window.sb
            .from('wallets')
            .select('currency, available, locked')
            .eq('user_id', userId),
          window.sb
            .from('stakes')
            .select('amount, status, currency')
            .eq('user_id', userId)
        ]);

        if (walletsError) throw walletsError;
        if (stakesError) throw stakesError;

        const availableUsdTotals = await Promise.all(
          (wallets || []).map((wallet) => {
            const availableOnly = Number(wallet.available || 0);
            return convertToUsd(wallet.currency, availableOnly);
          })
        );
        const lockedUsdTotals = await Promise.all(
          (wallets || []).map((wallet) => {
            const lockedOnly = Number(wallet.locked || 0);
            return convertToUsd(wallet.currency, lockedOnly);
          })
        );

        const totalUsd = availableUsdTotals.reduce((acc, value) => acc + (Number.isFinite(value) ? value : 0), 0);
        const lockedUsd = lockedUsdTotals.reduce((acc, value) => acc + (Number.isFinite(value) ? value : 0), 0);

        lastKnownAvailableUsd = totalUsd;
        lastKnownLockedUsd = lockedUsd;

        const activeStakes = (stakes || []).filter((stake) => String(stake.status || '').toLowerCase() === 'active');
        const investedTotals = await Promise.all(
          activeStakes.map((stake) => convertToUsd(stake.currency, stake.amount))
        );
        let investedUsd = investedTotals.reduce((acc, value) => acc + (Number.isFinite(value) ? value : 0), 0);

        // Debug after values are computed to avoid ReferenceError
        try {
          console.debug('[dashboard] totals', { availableUsd: totalUsd, lockedUsd, investedUsd });
          console.debug('[dashboard] wallets', wallets, 'stakes', stakes);
        } catch (_) {}

        if (!investedUsd && lockedUsd) {
          investedUsd = lockedUsd;
        }

        setText(balanceEl, formatUsd(totalUsd));
        setText(investedEl, `Invested: ${formatUsd(investedUsd)}`);

      } catch (err) {
        console.warn('Failed to load balances', err);
      }
    };

    await refresh();
    if (BALANCE_REFRESH_MS > 0) {
      setInterval(refresh, BALANCE_REFRESH_MS);
    }
  }

  async function initTransactions(userId) {
    const tbody = document.getElementById('txTableBody');
    if (!tbody) return;

    const prevBtn = document.getElementById('txPrev');
    const nextBtn = document.getElementById('txNext');
    const pageInfo = document.getElementById('txPageInfo');

    const pageSize = 10;
    let page = 1;
    let totalPages = 1;

    const typeLabel = (type) => {
      switch (String(type || '').toLowerCase()) {
        case 'stake_create':
          return 'Deposit opened';
        case 'stake_yield':
          return 'Yield';
        case 'withdraw':
          return 'Withdrawn';
        case 'deposit':
          return 'Deposit';
        case 'accrual':
          return 'Accrual';
        default:
          return type || '-';
      }
    };

    const formatDate = (iso) => {
      if (!iso) return '-';
      try {
        return new Date(iso).toLocaleString();
      } catch (err) {
        return iso;
      }
    };

    const loadPage = async () => {
      try {
        const from = (page - 1) * pageSize;
        const to = page * pageSize - 1;

        const { data, error, count } = await window.sb
          .from('transactions')
          .select('id, type, amount, created_at, meta', { count: 'exact' })
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .range(from, to);

        if (error) throw error;

        const rows = (data || []).map((row) => {
          const meta = row.meta || {};
          const currency = String(meta.currency || 'USDT').toUpperCase();
          const amountNumber = Number(row.amount || 0);
          const amountSign = amountNumber > 0 ? '+' : '';
          const amountDisplay = `${amountSign}${amountNumber.toFixed(2)} ${currency}`;

          const details = joinClean([
            meta.stake_id ? `Stake #${meta.stake_id}` : '',
            meta.note ? String(meta.note) : ''
          ], ' | ');

          return `<tr>
            <td>${formatDate(row.created_at)}</td>
            <td>${typeLabel(row.type)}</td>
            <td>${amountDisplay}</td>
            <td>${currency}</td>
            <td>${details || '-'}</td>
          </tr>`;
        }).join('');

        tbody.innerHTML = rows || '<tr><td colspan="5">No activity yet</td></tr>';

        totalPages = Math.max(1, Math.ceil((count || 0) / pageSize));
        if (pageInfo) pageInfo.textContent = `Page ${page} of ${totalPages}`;
        if (prevBtn) prevBtn.disabled = page <= 1;
        if (nextBtn) nextBtn.disabled = page >= totalPages;
      } catch (err) {
        console.warn('Failed to load transactions', err);
        tbody.innerHTML = '<tr><td colspan="5">Failed to load activity</td></tr>';
        if (pageInfo) pageInfo.textContent = 'Page 1 of 1';
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (page <= 1) return;
        page -= 1;
        loadPage();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (page >= totalPages) return;
        page += 1;
        loadPage();
      });
    }

    await loadPage();
  }

  async function initActiveStakes(userId) {
    const amountEl = document.querySelector('.card-active-deposits .active-amount');
    const metaEl = document.querySelector('.card-active-deposits .active-meta');
    const typeEl = document.querySelector('.card-active-deposits .active-type');
    if (!amountEl && !metaEl && !typeEl) return;

    try {
      const { data, error } = await window.sb
        .from('stakes')
        .select('id, amount, status, currency, start_at, end_at, plan_id, plans:plan_id (name, days, apr, type)')
        .eq('user_id', userId)
        .order('start_at', { ascending: false });

      if (error) throw error;

      const active = (data || []).filter((item) => String(item.status || '').toLowerCase() === 'active');
      if (!active.length) {
        const hasLocked = lastKnownLockedUsd > 0;
        setText(amountEl, formatUsd(hasLocked ? lastKnownLockedUsd : 0));
        setText(metaEl, hasLocked ? 'Funds locked in deposits' : 'No active deposits');
        setText(typeEl, '');
        return;
      }


      const usdValues = await Promise.all(
        active.map((stake) => convertToUsd(stake.currency, stake.amount))
      );
      const totalUsd = usdValues.reduce((acc, value) => acc + (Number.isFinite(value) ? value : 0), 0);
      setText(amountEl, formatUsd(totalUsd));

      const first = active[0];
      const plan = first?.plans || {};
      const planLabel = plan.name ? String(plan.name) : 'Plan';
      const planType = String(plan.type || '').toLowerCase() === 'flexible' ? 'Flexible' : 'Locked';
      const aprValue = Number(plan.apr || 0) * 100;
      const aprLabel = `${aprValue.toFixed(2)}% APR`;
      setText(metaEl, `${planType} | ${aprLabel}`);

      const rangeParts = [];
      if (first?.start_at) {
        rangeParts.push(`Start: ${new Date(first.start_at).toLocaleDateString()}`);
      }
      if (first?.end_at) {
        rangeParts.push(`End: ${new Date(first.end_at).toLocaleDateString()}`);
      }
      const typeParts = [planLabel, ...rangeParts];
      setText(typeEl, typeParts.join(' | '));
    } catch (err) {
      console.warn('Failed to load active stakes', err);
    }
  }
})();








