// Deposit page: load plans from Supabase, estimate return, create stake, list active stakes
(function () {
  document.addEventListener('DOMContentLoaded', async () => {
    if (!window.sb || !window.authHelpers) return; // Supabase not configured yet

    // Demo switch: when true, delete/reset act only on UI (no Supabase writes)
    const DEMO_LOCAL_DELETE = true;

    const amountEl = document.getElementById('depositAmount');
    const termEl = document.getElementById('depositTerm');
    const daysEl = document.getElementById('depositDays');
    const openBtn = document.getElementById('depositOpenBtn');
    const estEl = document.getElementById('depositEstimated');
    const dailyEl = document.getElementById('depositDailyIncome');
    const currencyEl = document.getElementById('depositCurrency');
    const toggleBtns = document.querySelectorAll('.staking-toggle .toggle-btn');
    const activeListContainer = document.querySelector('.deposit-active .card-body');

    const session = await window.authHelpers.session();
    if (!session) return; // guarded by cabinet-auth.js, but be safe

    const state = {
      plans: [],
      lockedPlans: [],
      flexiblePlans: [],
      mode: 'locked', // 'locked' | 'flexible'
      selectedPlanId: null,
    };
    const openCard = document.querySelector('.card.deposit-open');

    // Fetch plans
    async function loadPlans() {
      const { data, error } = await window.sb
        .from('plans')
        .select('*')
        .order('days', { ascending: true });
      if (error) {
        console.warn('Load plans error', error);
        return;
      }
      state.plans = Array.isArray(data) ? data : [];
      state.lockedPlans = state.plans.filter(p => p.type === 'locked');
      state.flexiblePlans = state.plans.filter(p => p.type === 'flexible');
      populateTerm();
      estimate();
    }

    function populateTerm() {
      if (!termEl) return;
      termEl.innerHTML = '';
      // For locked mode: show locked plans by days
      if (state.mode === 'locked') {
        openCard?.classList.add('mode-locked');
        openCard?.classList.remove('mode-flexible');
        const seenDays = new Set();
        state.lockedPlans.forEach(p => {
          const d = Number(p.days);
          if (seenDays.has(d)) return; // deduplicate same day values
          seenDays.add(d);
          const opt = document.createElement('option');
          opt.value = String(p.id); // pick first plan for that duration
          opt.textContent = String(d);
          termEl.appendChild(opt);
        });
        // Fallback when there are no locked plans from DB: show defaults 30/90/180
        if (!state.lockedPlans.length) {
          [30, 90, 180].forEach(d => {
            const opt = document.createElement('option');
            opt.value = String(d); // use days as value in fallback
            opt.textContent = String(d);
            termEl.appendChild(opt);
          });
        }
        const firstVal = termEl.options[0]?.value;
        state.selectedPlanId = state.selectedPlanId ?? firstVal ?? null;
        if (firstVal != null) termEl.value = String(state.selectedPlanId);
        termEl.disabled = false;
        termEl.title = '';
      } else {
        // Flexible: user types days in number input
        openCard?.classList.add('mode-flexible');
        openCard?.classList.remove('mode-locked');
        termEl.disabled = true; // hidden via CSS
        termEl.title = '';
        if (daysEl && (!daysEl.value || Number(daysEl.value) < 1)) {
          daysEl.value = '1';
        }
      }
    }

    function formatAmount(n) {
      const num = Number(n || 0);
      if (!Number.isFinite(num)) return '0';
      return num % 1 === 0 ? num.toString() : num.toFixed(2);
    }

    function getSelectedLockedPlan() {
      if (!state.selectedPlanId) return null;
      const found = state.lockedPlans.find(p => String(p.id) === String(state.selectedPlanId)) || null;
      if (found) return found;
      // Fallback: when using local default options (30/90/180) without DB plans
      const sel = termEl?.options[termEl.selectedIndex] || null;
      if (sel) {
        const d = Number(sel.textContent || sel.value || 0);
        if (d > 0) return { id: null, days: d, apr: null, type: 'locked' };
      }
      return null;
    }

    // Local monthly percent rules (matching landing page calculator)
    const LOCAL_MONTHLY_RATES = { 30: 0.075, 90: 0.105, 180: 0.125 };
    const FLEX_MONTHLY_RATE = 0.045; // flexible 4.5% per month

    function computeDailyFlexibleRate() {
      // Use fixed 4.5% monthly -> daily
      return FLEX_MONTHLY_RATE / 30;
    }

    function currencyCode() {
      return String(currencyEl?.value || 'usdt').toUpperCase();
    }

    function estimate() {
      if (!estEl) return;
      const amount = Number(amountEl?.value || 0);
      const cur = currencyCode();
      if (!amount || amount <= 0) {
        estEl.textContent = `0 ${cur}`;
        if (dailyEl) dailyEl.textContent = `0 ${cur}`;
        return;
      }
      if (state.mode === 'locked') {
        const plan = getSelectedLockedPlan();
        if (!plan) { estEl.textContent = `0 ${cur}`; if (dailyEl) dailyEl.textContent = `0 ${cur}`; return; }
        const days = Number(plan.days || 0);
        const monthly = LOCAL_MONTHLY_RATES[days];
        // If we recognise the duration (30/90/180), use our monthly rules; otherwise fallback to plan.apr
        const profit = (monthly != null)
          ? amount * monthly * (days / 30)
          : amount * Number(plan.apr || 0);
        const totalPayout = amount + profit;
        const dailyProfit = days > 0 ? (profit / days) : 0;
        estEl.textContent = `${totalPayout.toFixed(2)} ${cur}`;
        if (dailyEl) dailyEl.textContent = `${dailyProfit.toFixed(2)} ${cur}`;
      } else {
        const days = Math.max(1, Number(daysEl?.value || 1));
        const daily = amount * computeDailyFlexibleRate();
        const profit = daily * days;
        const totalPayout = amount + profit;
        estEl.textContent = `${totalPayout.toFixed(2)} ${cur}`;
        if (dailyEl) dailyEl.textContent = `${daily.toFixed(2)} ${cur}`;
      }
    }

    async function openDeposit() {
      const amount = Number(amountEl?.value || 0);
      if (!amount || amount <= 0) return;

      let planId = null;
      if (state.mode === 'locked') {
        const plan = getSelectedLockedPlan();
        if (!plan) return;
        planId = plan.id;
      } else {
        // choose first flexible plan if exists
        if (!state.flexiblePlans.length) {
          alert('No flexible plan configured in the database.');
          return;
        }
        planId = state.flexiblePlans[0].id;
      }

      const payload = {
        user_id: session.user.id,
        plan_id: planId,
        amount,
        status: 'active',
      };
      if (state.mode === 'flexible') {
        const flexDays = Math.max(1, Number(daysEl?.value || 1));
        payload.flex_days = flexDays; // may be ignored if column absent
      }
      let { data: inserted, error } = await window.sb
        .from('stakes')
        .insert(payload)
        .select('id')
        .single();
      // If flex_days column doesn't exist yet, retry without it (so UI works before migration)
      if (error && String(error.message || '').toLowerCase().includes('flex_days')) {
        delete payload.flex_days;
        ({ data: inserted, error } = await window.sb
          .from('stakes')
          .insert(payload)
          .select('id')
          .single());
      }
      if (error) {
        console.warn('Open deposit error', error);
        alert(error.message || 'Failed to open deposit');
        return;
      }
      // Log a transaction for transparency (may require RLS insert policy on transactions)
      try {
        await window.sb.from('transactions').insert({
          user_id: session.user.id,
          type: 'stake_create',
          amount,
          meta: { plan_id: planId, stake_id: inserted?.id || null },
        });
      } catch (txErr) {
        console.warn('Transaction log failed (optional):', txErr);
      }
      // If demo reset was used (ALL hidden), clear the flag so new deposits appear
      try {
        if (DEMO_LOCAL_DELETE) {
          const raw = sessionStorage.getItem('demoHiddenStakes');
          if (raw === 'ALL') {
            sessionStorage.removeItem('demoHiddenStakes');
          } else if (raw) {
            try {
              const ids = JSON.parse(raw) || [];
              const newId = inserted?.id;
              if (newId != null) {
                const idx = ids.indexOf(newId);
                if (idx >= 0) { ids.splice(idx, 1); sessionStorage.setItem('demoHiddenStakes', JSON.stringify(ids)); }
              }
            } catch {}
          }
        }
      } catch {}
      amountEl.value = '';
      estimate();
      await renderActiveStakesNew();
    }

    async function renderActiveStakes() {
      if (!activeListContainer) return;
      const { data, error } = await window.sb
        .from('stakes')
        .select('id, amount, status, start_at, end_at, yield_accumulated, plans:plan_id (name, days, apr, type)')
        .eq('user_id', session.user.id)
        .order('start_at', { ascending: false });
      if (error) {
        activeListContainer.innerHTML = '<p>Failed to load deposits.</p>';
        return;
      }
      const list = Array.isArray(data) ? data : [];
      if (!list.length) {
        activeListContainer.innerHTML = '<p>No deposits were found!</p>';
        return;
      }
      activeListContainer.innerHTML = list.map(row => {
        const plan = row.plans || {};
        const type = plan.type === 'flexible' ? 'Flexible' : `Locked ${plan.days}`;
        const apr = Number(plan.apr || 0);
        const est = plan.type === 'flexible' ? (Number(row.amount) * (apr / Math.max(1, Number(plan.days || 1)))).toFixed(2)
                                             : (Number(row.amount) * apr).toFixed(2);
        return `
          <div class="deposit-item">
            <div class="deposit-item-main">
              <div>
                <div class="deposit-title">${type} (${plan.name ?? ''})</div>
                <div class="deposit-meta">Stake ID ${row.id} · ${new Date(row.start_at).toLocaleDateString()}</div>
              </div>
              <div class="deposit-amount">$${Number(row.amount).toLocaleString()}</div>
            </div>
            <div class="deposit-footer">
              <span class="status">${row.status}</span>
              <span class="apr">APR ${(apr * 100).toFixed(2)}%</span>
              <span class="est">Est. reward ${est}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    // New rendering with amount in title, payout on right, and actions (withdraw for flexible)
    async function renderActiveStakesNew() {
      if (!activeListContainer) return;
      const { data, error } = await window.sb
        .from('stakes')
        .select('id, amount, status, start_at, end_at, yield_accumulated, plans:plan_id (days, apr, type)')
        .eq('user_id', session.user.id)
        .order('start_at', { ascending: false });
      if (error) {
        activeListContainer.innerHTML = '<p>Failed to load deposits.</p>';
        return;
      }
      let list = Array.isArray(data) ? data : [];
      // Filter out items hidden in demo mode
      if (DEMO_LOCAL_DELETE) {
        const raw = sessionStorage.getItem('demoHiddenStakes');
        if (raw === 'ALL') list = [];
        else if (raw) {
          try {
            const ids = new Set(JSON.parse(raw));
            list = list.filter(r => !ids.has(r.id));
          } catch {}
        }
      }
      if (!list.length) {
        activeListContainer.innerHTML = '<p>No deposits were found!</p>';
        return;
      }
      activeListContainer.innerHTML = list.map(row => {
        const plan = row.plans || {};
        const typeLabel = plan.type === 'flexible' ? 'Flexible' : 'Locked';
        // Flexible days: prefer row.flex_days if API returns it; else fall back to elapsed days
        const started = row.start_at ? new Date(row.start_at) : new Date();
        const elapsed = Math.max(1, Math.floor((Date.now() - started.getTime()) / (1000*60*60*24)));
        const flexDays = (row.flex_days ? Number(row.flex_days) : null) || elapsed;
        const titleLeft = `${typeLabel} ${formatAmount(row.amount)} USDT`;
        const titleRight = plan.type === 'flexible' ? `(${flexDays} day${flexDays===1?'':'s'})` : `(${plan.days} days)`;
        const apr = Number(plan.apr || 0);
        const perDay = apr / Math.max(1, Number(plan.days || 1));
        const est = plan.type === 'flexible' ? (Number(row.amount) * perDay * flexDays).toFixed(2)
                                             : (Number(row.amount) * apr).toFixed(2);
        const totalPayout = (Number(row.amount) + Number(est)).toFixed(2);
        return `
          <div class="deposit-item">
            <div class="deposit-item-main">
              <div>
                <div class="deposit-title">${titleLeft} ${titleRight}</div>
                <div class="deposit-meta">Stake ID ${row.id} - ${new Date(row.start_at).toLocaleDateString()}</div>
              </div>
              <div class="deposit-right">
                <div class="deposit-amount">${totalPayout} USDT</div>
                ${plan.type === 'flexible' && row.status === 'active' ? '<button class="btn-small" data-action="withdraw-stake" data-id="'+row.id+'">Withdraw</button>' : ''}
                ${DEMO_LOCAL_DELETE ? '<button class="btn-small btn-danger" data-action="demo-delete-stake" data-id="'+row.id+'">Delete</button>' : ''}
              </div>
            </div>
            <div class="deposit-footer">
              <span class="status">${row.status}</span>
              <span class="apr">APR ${(apr * 100).toFixed(2)}%</span>
              <span class="est">Est. reward ${est} USDT</span>
            </div>
          </div>`;
      }).join('');
    }

    // Wire up events
    amountEl?.addEventListener('input', estimate);
    termEl?.addEventListener('change', () => {
      if (state.mode === 'locked') state.selectedPlanId = termEl.value;
      estimate();
    });
    daysEl?.addEventListener('input', estimate);
    currencyEl?.addEventListener('change', estimate);
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        state.mode = target === 'flexible' ? 'flexible' : 'locked';
        // visual state toggled by cabinet.js already
        populateTerm();
        estimate();
      });
    });
    openBtn?.addEventListener('click', openDeposit);
    // Withdraw flexible stake now (close)
    activeListContainer?.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-action="withdraw-stake"]');
      if (!btn) return;
      const id = btn.getAttribute('data-id');
      if (!id) return;
      if (!confirm('Withdraw this flexible deposit now?')) return;
      const { data: stake, error: loadErr } = await window.sb
        .from('stakes')
        .select('id, amount, start_at, plans:plan_id (days, apr, type)')
        .eq('id', id)
        .eq('user_id', session.user.id)
        .single();
      if (loadErr || !stake) {
        alert(loadErr?.message || 'Failed to load deposit');
        return;
      }
      const plan = stake.plans || {};
      if (plan.type !== 'flexible') {
        alert('Only flexible deposits can be withdrawn early.');
        return;
      }
      const started = new Date(stake.start_at);
      const now = new Date();
      const elapsedDays = Math.max(1, Math.floor((now - started) / (1000*60*60*24)));
      const perDay = Number(plan.apr || 0) / Math.max(1, Number(plan.days || 1));
      const reward = Number(stake.amount) * perDay * elapsedDays;
      const { error: updErr } = await window.sb
        .from('stakes')
        .update({ status: 'closed', end_at: now.toISOString(), yield_accumulated: reward })
        .eq('id', id)
        .eq('user_id', session.user.id);
      if (updErr) {
        alert(updErr.message || 'Failed to withdraw');
        return;
      }
      try {
        await window.sb.from('transactions').insert({
          user_id: session.user.id,
          type: 'stake_withdraw',
          amount: Number(stake.amount) + reward,
          meta: { stake_id: id, reward, elapsed_days: elapsedDays }
        });
      } catch {}
      await renderActiveStakesNew();
    });

    // Reset all deposits (test only)
    document.getElementById('btnResetDeposits')?.addEventListener('click', async (ev) => {
      if (!confirm('Delete ALL your deposits? (test only)')) return;
      const btn = ev.currentTarget;
      try { btn.disabled = true; btn.textContent = 'Resetting…'; } catch {}
      if (DEMO_LOCAL_DELETE) {
        sessionStorage.setItem('demoHiddenStakes', 'ALL');
        await renderActiveStakesNew();
        try { btn.disabled = false; btn.textContent = 'Reset'; } catch {}
        return;
      }
      const { error: delErr } = await window.sb
        .from('stakes')
        .delete()
        .eq('user_id', session.user.id);
      if (delErr) {
        console.warn('Reset deposits error:', delErr);
        alert(delErr.message || 'Failed to reset');
      }
      await renderActiveStakesNew();
      try { btn.disabled = false; btn.textContent = 'Reset'; } catch {}
    });

    // Demo-only per-item delete (UI only)
    if (DEMO_LOCAL_DELETE) {
      activeListContainer?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action="demo-delete-stake"]');
        if (!btn) return;
        const id = Number(btn.getAttribute('data-id'));
        const raw = sessionStorage.getItem('demoHiddenStakes');
        let ids = [];
        if (raw && raw !== 'ALL') {
          try { ids = JSON.parse(raw) || []; } catch {}
        }
        if (!ids.includes(id)) ids.push(id);
        sessionStorage.setItem('demoHiddenStakes', JSON.stringify(ids));
        const item = btn.closest('.deposit-item');
        if (item) item.remove();
        if (!activeListContainer.querySelector('.deposit-item')) {
          activeListContainer.innerHTML = '<p>No deposits were found!</p>';
        }
      });
    }
    // (removed old Delete handler),n

    await loadPlans();
    await renderActiveStakesNew();
  });
})();

