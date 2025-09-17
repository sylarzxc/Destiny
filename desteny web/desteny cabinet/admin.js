(function () {
  const PENDING_SIZE = 20;
  const USER_SIZE = 20;
  const STAKE_SIZE = 20;
  const REFRESH_DELAY = 250;

  const escapeHtml = (value) => {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const formatCurrency = (num, digits = 2) => {
    const value = Number(num || 0);
    return '$' + value.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  };

  const formatNumber = (num, digits = 2) => {
    const value = Number(num || 0);
    return value.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  };

  const formatDateTime = (iso) => {
    if (!iso) return '-';
    try { return new Date(iso).toLocaleString(); } catch { return '-'; }
  };

  const formatDateShort = (iso) => {
    if (!iso) return '-';
    try {
      return new Date(iso).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return '-'; }
  };

  const formatTimer = (seconds) => {
    const value = Number(seconds || 0);
    if (!Number.isFinite(value) || value <= 0) return '—';
    const totalMinutes = Math.floor(value / 60);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    const parts = [];
    if (days) parts.push(days + 'd');
    if (hours) parts.push(hours + 'h');
    if (minutes) parts.push(minutes + 'm');
    return parts.join(' ') || '<1m';
  };

  const debounce = (fn, delay = REFRESH_DELAY) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const setSingleRow = (tbody, colspan, message) => {
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="${colspan}">${escapeHtml(message)}</td></tr>`;
  };

  document.addEventListener('DOMContentLoaded', async () => {
    if (!window.sb || !window.authHelpers) return;
    const session = await window.authHelpers.session();
    if (!session) return;

    // Admin guard
    try {
      let isAdmin = false;
      try {
        const rpc = await window.sb.rpc('is_admin');
        if (!rpc.error) isAdmin = !!rpc.data;
      } catch (err) {
        console.warn('is_admin rpc failed', err);
      }
      if (!isAdmin) {
        const { data: prof } = await window.sb.from('profiles').select('role').eq('id', session.user.id).single();
        const role = (prof?.role ? String(prof.role) : '').trim().toLowerCase();
        isAdmin = role === 'admin';
      }
      if (!isAdmin) {
        location.href = 'dashboard.html';
        return;
      }
    } catch (err) {
      console.error('admin guard failed', err);
      location.href = 'dashboard.html';
      return;
    }

    const els = {
      summary: {
        totalUsers: document.getElementById('metricTotalUsers'),
        totalAvailable: document.getElementById('metricTotalAvailable'),
        totalLocked: document.getElementById('metricTotalLocked'),
        activeStakes: document.getElementById('metricActiveStakes'),
        activeValue: document.getElementById('metricActiveValue'),
        expiring: document.getElementById('metricExpiring'),
        pending: document.getElementById('metricPendingRequests'),
        pendingPill: document.getElementById('adCount')
      },
      pending: {
        body: document.getElementById('adBody'),
        prev: document.getElementById('adPrev'),
        next: document.getElementById('adNext'),
        info: document.getElementById('adInfo'),
        search: document.getElementById('adSearch'),
        refresh: document.getElementById('adRefresh'),
        approveSel: document.getElementById('adApproveSel'),
        rejectSel: document.getElementById('adRejectSel'),
        typeFilter: document.getElementById('adTypeFilter')
      },
      users: {
        body: document.getElementById('uBody'),
        prev: document.getElementById('uPrev'),
        next: document.getElementById('uNext'),
        info: document.getElementById('uInfo'),
        search: document.getElementById('uSearch'),
        refresh: document.getElementById('uRefresh'),
        roleFilter: document.getElementById('uRoleFilter')
      },
      stakes: {
        body: document.getElementById('stBody'),
        prev: document.getElementById('stPrev'),
        next: document.getElementById('stNext'),
        info: document.getElementById('stInfo'),
        search: document.getElementById('stSearch'),
        refresh: document.getElementById('stRefresh'),
        statusFilter: document.getElementById('stStatusFilter')
      },
      logs: {
        body: document.getElementById('logBody'),
        refresh: document.getElementById('logRefresh')
      },
      settings: {
        addresses: document.getElementById('setAddresses'),
        minDeposit: document.getElementById('setMinDeposit'),
        saveAddresses: document.getElementById('saveAddresses'),
        saveMin: document.getElementById('saveMin')
      },
      drawer: {
        root: document.getElementById('userDetailDrawer'),
        overlay: document.getElementById('userDetailOverlay'),
        close: document.getElementById('userDetailClose'),
        name: document.getElementById('detailName'),
        email: document.getElementById('detailEmail'),
        meta: document.getElementById('detailMeta'),
        wallets: document.getElementById('detailWallets'),
        stakes: document.getElementById('detailStakes'),
        stakeBadge: document.getElementById('detailStakeCount'),
        pending: document.getElementById('detailPending'),
        tx: document.getElementById('detailTransactions'),
        credit: document.getElementById('detailCredit'),
        debit: document.getElementById('detailDebit')
      }
    };

    const state = {
      summary: null,
      pendingPage: 1,
      usersPage: 1,
      stakesPage: 1,
      currentDetail: null
    };

    const setSummary = (stats) => {
      state.summary = stats || {};
      if (els.summary.totalUsers) {
        els.summary.totalUsers.textContent = stats?.total_users ?? 0;
      }
      if (els.summary.totalAvailable) {
        els.summary.totalAvailable.textContent = formatCurrency(stats?.total_wallet_available || 0);
      }
      if (els.summary.totalLocked) {
        els.summary.totalLocked.textContent = formatCurrency(stats?.total_wallet_locked || 0);
      }
      if (els.summary.activeStakes) {
        els.summary.activeStakes.textContent = stats?.active_stakes ?? 0;
      }
      if (els.summary.activeValue) {
        els.summary.activeValue.textContent = formatCurrency(stats?.total_active_deposit || 0);
      }
      if (els.summary.expiring) {
        els.summary.expiring.textContent = stats?.expiring_24h ?? 0;
      }
      if (els.summary.pending) {
        els.summary.pending.textContent = stats?.pending_requests ?? 0;
      }
      if (els.summary.pendingPill) {
        els.summary.pendingPill.textContent = `${stats?.pending_requests ?? 0} open`;
        els.summary.pendingPill.classList.toggle('danger', (stats?.pending_requests ?? 0) > 10);
      }
    };

    const loadSummary = async () => {
      try {
        const { data, error } = await window.sb.rpc('admin_dashboard_overview');
        if (error) throw error;
        setSummary(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        console.error('Failed to load summary', err);
      }
    };

    const typeLabel = (raw) => {
      const t = String(raw || '').toLowerCase();
      if (t === 'deposit') return 'Deposit';
      if (t === 'withdraw') return 'Withdraw';
      if (t === 'stake_create') return 'Stake opened';
      if (t === 'stake_yield') return 'Yield';
      return t || '-';
    };

    const statusBadge = (status) => {
      const value = String(status || '').toLowerCase();
      const label = value ? value.replace(/_/g, ' ') : 'unknown';
      const danger = value === 'cancelled' || value === 'rejected';
      return `<span class="status-pill${danger ? ' danger' : ''}">${escapeHtml(label)}</span>`;
    };

    const loadPending = async () => {
      const body = els.pending.body;
      if (!body) return;
      const offset = (state.pendingPage - 1) * PENDING_SIZE;
      try {
        const { data, error } = await window.sb.rpc('admin_list_pending', { p_limit: PENDING_SIZE, p_offset: offset });
        if (error) throw error;
        const list = Array.isArray(data) ? data : [];
        const searchTerm = (els.pending.search?.value || '').trim().toLowerCase();
        const typeFilter = (els.pending.typeFilter?.value || '').trim().toLowerCase();
        const filtered = list.filter((row) => {
          const matchesType = !typeFilter || String(row.type || '').toLowerCase() === typeFilter;
          if (!matchesType) return false;
          if (!searchTerm) return true;
          const email = String(row.email || '').toLowerCase();
          const asset = String(row.asset || '').toLowerCase();
          const type = String(row.type || '').toLowerCase();
          return email.includes(searchTerm) || asset.includes(searchTerm) || type.includes(searchTerm);
        });
        const rows = filtered.map((row) => {
          const actions = [
            `<button class="page-btn" data-act="approve" data-id="${row.id}" data-type="${escapeHtml(row.type)}">Approve</button>`,
            `<button class="page-btn" data-act="reject" data-id="${row.id}">Reject</button>`
          ].join('');
          const amountAsset = Number(row.amount_asset || row.amount || 0);
          return `<tr>
            <td><input type="checkbox" class="sel" value="${row.id}" data-type="${escapeHtml(row.type)}"/></td>
            <td>${escapeHtml(formatDateTime(row.created_at))}</td>
            <td>${escapeHtml(row.email || row.user_id || '-')}</td>
            <td>${escapeHtml(typeLabel(row.type))}</td>
            <td>${escapeHtml(row.asset || 'USDT')}</td>
            <td>${formatNumber(amountAsset, amountAsset >= 1 ? 2 : 8)}</td>
            <td>${formatCurrency(row.amount)}</td>
            <td>${statusBadge(row.status)}</td>
            <td class="table-actions">${actions}</td>
          </tr>`;
        }).join('');
        body.innerHTML = rows || '<tr><td colspan="9">No pending requests</td></tr>';
        if (els.pending.info) {
          els.pending.info.textContent = `Page ${state.pendingPage}`;
        }
        if (els.pending.prev) {
          els.pending.prev.disabled = state.pendingPage <= 1;
        }
        if (els.pending.next) {
          els.pending.next.disabled = list.length < PENDING_SIZE;
        }
      } catch (err) {
        console.error('loadPending failed', err);
        setSingleRow(body, 9, err.message || 'Failed to load pending requests');
      }
    };

    const renderUserRow = (row) => {
      const role = String(row.role || 'user');
      const nextRole = role === 'admin' ? 'user' : 'admin';
      const pendingDeposits = Number(row.pending_deposits || 0);
      const pendingWithdraws = Number(row.pending_withdraws || 0);
      const pendingLabel = pendingDeposits || pendingWithdraws
        ? `D:${pendingDeposits} / W:${pendingWithdraws}`
        : 'None';
      const maturity = row.next_maturity ? formatDateShort(row.next_maturity) : '—';
      const lastActivity = row.last_transaction || row.last_sign_in_at;
      return `<tr>
        <td>
          <div class="user-cell">
            <span class="user-email">${escapeHtml(row.email || '-')}</span>
            <span class="user-name">${escapeHtml(row.display_name || role)}</span>
          </div>
        </td>
        <td>${formatNumber(row.total_available || 0, 2)}</td>
        <td>${formatNumber(row.total_locked || 0, 2)}</td>
        <td>${row.active_stakes || 0}</td>
        <td>${escapeHtml(pendingLabel)}</td>
        <td>${escapeHtml(maturity)}</td>
        <td>${escapeHtml(lastActivity ? formatDateShort(lastActivity) : '—')}</td>
        <td>
          <div class="table-actions">
            <button class="page-btn" data-uact="view" data-id="${row.id}">View</button>
            <button class="page-btn" data-uact="role" data-id="${row.id}" data-role="${nextRole}">${nextRole === 'admin' ? 'Make admin' : 'Make user'}</button>
            <button class="page-btn" data-uact="credit" data-id="${row.id}">Credit</button>
            <button class="page-btn" data-uact="debit" data-id="${row.id}">Debit</button>
          </div>
        </td>
      </tr>`;
    };

    const loadUsers = async () => {
      const body = els.users.body;
      if (!body) return;
      const offset = (state.usersPage - 1) * USER_SIZE;
      try {
        const search = els.users.search?.value || null;
        const { data, error } = await window.sb.rpc('admin_list_users', { p_limit: USER_SIZE, p_offset: offset, p_search: search });
        if (error) throw error;
        const list = Array.isArray(data) ? data : [];
        const roleFilter = (els.users.roleFilter?.value || '').trim().toLowerCase();
        const filtered = list.filter((row) => !roleFilter || String(row.role || '').toLowerCase() === roleFilter);
        body.innerHTML = filtered.length ? filtered.map(renderUserRow).join('') : '<tr><td colspan="8">No users</td></tr>';
        if (els.users.info) {
          els.users.info.textContent = `Page ${state.usersPage}`;
        }
        if (els.users.prev) {
          els.users.prev.disabled = state.usersPage <= 1;
        }
        if (els.users.next) {
          els.users.next.disabled = list.length < USER_SIZE;
        }
      } catch (err) {
        console.error('loadUsers failed', err);
        setSingleRow(body, 8, err.message || 'Failed to load users');
      }
    };

    const renderStakeRow = (row) => {
      const planParts = [];
      if (row.plan_name) planParts.push(row.plan_name);
      if (row.plan_type) planParts.push(row.plan_type);
      if (row.plan_days) planParts.push(`${row.plan_days}d`);
      const planLabel = planParts.join(' • ') || '-';
      const isActive = String(row.status || '').toLowerCase() === 'active';
      const actions = isActive
        ? `<button class="page-btn" data-sact="force" data-id="${row.id}">Force close</button>`
        : '';
      return `<tr>
        <td>#${row.id}</td>
        <td>
          <div class="user-cell">
            <span class="user-email">${escapeHtml(row.email || row.user_id || '-')}</span>
            <span class="user-name">${escapeHtml(row.display_name || '')}</span>
          </div>
        </td>
        <td>${escapeHtml(planLabel)}</td>
        <td>${formatNumber(row.amount || 0, 2)} ${escapeHtml(row.currency || 'USDT')}</td>
        <td>${statusBadge(row.status)}</td>
        <td>${escapeHtml(row.end_at ? formatDateShort(row.end_at) : '—')}</td>
        <td>${escapeHtml(formatTimer(row.seconds_left))}</td>
        <td class="table-actions">${actions || '—'}</td>
      </tr>`;
    };

    const loadStakes = async () => {
      const body = els.stakes.body;
      if (!body) return;
      const offset = (state.stakesPage - 1) * STAKE_SIZE;
      try {
        const search = els.stakes.search?.value || '';
        const status = (els.stakes.statusFilter?.value || '').trim() || null;
        const params = { p_limit: STAKE_SIZE, p_offset: offset, p_search: search || null, p_status: status };
        const { data, error } = await window.sb.rpc('admin_list_stakes', params);
        if (error) throw error;
        const list = Array.isArray(data) ? data : [];
        body.innerHTML = list.length ? list.map(renderStakeRow).join('') : '<tr><td colspan="8">No stakes found</td></tr>';
        if (els.stakes.info) {
          els.stakes.info.textContent = `Page ${state.stakesPage}`;
        }
        if (els.stakes.prev) {
          els.stakes.prev.disabled = state.stakesPage <= 1;
        }
        if (els.stakes.next) {
          els.stakes.next.disabled = list.length < STAKE_SIZE;
        }
      } catch (err) {
        console.error('loadStakes failed', err);
        setSingleRow(body, 8, err.message || 'Failed to load stakes');
      }
    };

    const formatAuditMeta = (meta) => {
      if (!meta || typeof meta !== 'object') return '';
      try {
        const entries = Object.entries(meta).slice(0, 3).map(([key, value]) => `${escapeHtml(key)}: ${escapeHtml(typeof value === 'object' ? JSON.stringify(value) : value)}`);
        return entries.join('<br/>');
      } catch {
        return escapeHtml(JSON.stringify(meta));
      }
    };

    const loadLogs = async () => {
      const body = els.logs.body;
      if (!body) return;
      try {
        const { data, error } = await window.sb.rpc('admin_recent_admin_logs', { p_limit: 50 });
        if (error) throw error;
        const list = Array.isArray(data) ? data : [];
        body.innerHTML = list.length ? list.map((row) => `<tr>
          <td>${escapeHtml(formatDateShort(row.created_at))}</td>
          <td>${escapeHtml(row.admin_email || row.admin_id || '-')}</td>
          <td>${escapeHtml(row.action || '-')}</td>
          <td>${escapeHtml(row.target_type ? `${row.target_type} #${row.target_id || '-'}` : row.target_id || '-')}</td>
          <td>${formatAuditMeta(row.meta)}</td>
        </tr>`).join('') : '<tr><td colspan="5">No recent admin actions</td></tr>';
      } catch (err) {
        console.error('loadLogs failed', err);
        setSingleRow(body, 5, err.message || 'Failed to load log');
      }
    };

    const loadSettings = async () => {
      const { addresses, minDeposit } = els.settings;
      try {
        const { data: addr } = await window.sb.from('settings').select('value').eq('key', 'deposit_addresses').single();
        if (addresses) addresses.value = JSON.stringify(addr?.value || {}, null, 2);
      } catch {
        if (addresses) addresses.value = '{}';
      }
      try {
        const { data: min } = await window.sb.from('settings').select('value').eq('key', 'min_deposit').single();
        if (minDeposit) minDeposit.value = JSON.stringify(min?.value || {}, null, 2);
      } catch {
        if (minDeposit) minDeposit.value = '{}';
      }
    };

    const closeDrawer = () => {
      if (!els.drawer.root) return;
      els.drawer.root.classList.remove('open');
      document.body.classList.remove('drawer-open');
      state.currentDetail = null;
    };

    const openDrawer = () => {
      if (!els.drawer.root) return;
      els.drawer.root.classList.add('open');
      document.body.classList.add('drawer-open');
    };

    const setDetailMeta = (detail) => {
      if (!els.drawer.meta) return;
      const profile = detail?.profile || {};
      const totalAvailable = detail?.wallets?.reduce((acc, w) => acc + Number(w.available || 0), 0) || 0;
      const totalLocked = detail?.wallets?.reduce((acc, w) => acc + Number(w.locked || 0), 0) || 0;
      const items = [
        { label: 'Role', value: profile.role || 'user' },
        { label: 'Created', value: profile.created_at ? formatDateShort(profile.created_at) : '—' },
        { label: 'Last sign-in', value: profile.last_sign_in_at ? formatDateShort(profile.last_sign_in_at) : '—' },
        { label: 'Total available', value: formatNumber(totalAvailable) },
        { label: 'Total locked', value: formatNumber(totalLocked) },
        { label: 'Pending requests', value: (detail?.pending_requests?.length || 0) }
      ];
      els.drawer.meta.innerHTML = items.map(({ label, value }) => `<div>
        <dt>${escapeHtml(label)}</dt>
        <dd>${escapeHtml(value)}</dd>
      </div>`).join('');
    };

    const setDetailTable = (tbody, rows, cols, emptyMessage) => {
      if (!tbody) return;
      if (!rows || !rows.length) {
        tbody.innerHTML = `<tr><td colspan="${cols}">${escapeHtml(emptyMessage)}</td></tr>`;
        return;
      }
      tbody.innerHTML = rows.join('');
    };

    const loadUserDetail = async (userId) => {
      if (!userId || !els.drawer.root) return;
      try {
        const { data, error } = await window.sb.rpc('admin_user_detail', { p_user_id: userId });
        if (error) throw error;
        const detail = data || {};
        state.currentDetail = userId;
        if (els.drawer.name) {
          const display = detail?.profile?.display_name || detail?.profile?.email || 'User detail';
          els.drawer.name.textContent = display;
        }
        if (els.drawer.email) {
          els.drawer.email.textContent = detail?.profile?.email || '-';
        }
        setDetailMeta(detail);

        const walletRows = (detail?.wallets || []).map((w) => `<tr>
          <td>${escapeHtml(w.currency || 'USDT')}</td>
          <td>${formatNumber(w.available || 0)}</td>
          <td>${formatNumber(w.locked || 0)}</td>
          <td>${formatNumber((w.available || 0) + (w.locked || 0))}</td>
          <td>${escapeHtml(w.updated_at ? formatDateShort(w.updated_at) : '—')}</td>
        </tr>`);
        setDetailTable(els.drawer.wallets, walletRows, 5, 'No wallets');

        const stakeRows = (detail?.stakes || []).map((s) => {
          const plan = s.plan ? `${s.plan.name || ''} ${s.plan.type || ''}`.trim() : '-';
          return `<tr>
            <td>#${s.id}</td>
            <td>${escapeHtml(plan)}</td>
            <td>${formatNumber(s.amount || 0)} ${escapeHtml(s.currency || 'USDT')}</td>
            <td>${statusBadge(s.status)}</td>
            <td>${escapeHtml(s.end_at ? formatDateShort(s.end_at) : '—')}</td>
            <td>${escapeHtml(formatTimer(s.seconds_left))}</td>
          </tr>`;
        });
        setDetailTable(els.drawer.stakes, stakeRows, 6, 'No stakes');
        if (els.drawer.stakeBadge) {
          const activeCount = (detail?.stakes || []).filter((s) => String(s.status || '').toLowerCase() === 'active').length;
          els.drawer.stakeBadge.textContent = `${activeCount} active`;
        }

        const pendingRows = (detail?.pending_requests || []).map((p) => `<tr>
          <td>${p.id}</td>
          <td>${escapeHtml(typeLabel(p.type))}</td>
          <td>${formatCurrency(p.amount || 0)}</td>
          <td>${escapeHtml(formatDateShort(p.created_at))}</td>
        </tr>`);
        setDetailTable(els.drawer.pending, pendingRows, 4, 'No pending requests');

        const txRows = (detail?.recent_transactions || []).map((t) => `<tr>
          <td>${t.id}</td>
          <td>${escapeHtml(typeLabel(t.type))}</td>
          <td>${formatCurrency(t.amount || 0)}</td>
          <td>${escapeHtml(formatDateShort(t.created_at))}</td>
        </tr>`);
        setDetailTable(els.drawer.tx, txRows, 4, 'No activity');

        openDrawer();
      } catch (err) {
        console.error('loadUserDetail failed', err);
        alert(err.message || 'Failed to load user detail');
      }
    };

    const adjustWallet = async (userId, action) => {
      const rpc = action === 'credit' ? 'admin_credit_wallet' : 'admin_debit_wallet';
      const amountPrompt = action === 'credit' ? 'Amount to credit' : 'Amount to debit';
      try {
        const currency = prompt('Currency (e.g., USDT)', 'USDT');
        if (!currency) return;
        const amountStr = prompt(amountPrompt);
        const amount = Number(amountStr || 0);
        if (!(amount > 0)) {
          alert('Amount must be greater than zero');
          return;
        }
        const note = prompt('Note (optional)') || null;
        const { error } = await window.sb.rpc(rpc, { p_user_id: userId, p_currency: currency, p_amount: amount, p_note: note });
        if (error) throw error;
        alert('Balance updated');
        await Promise.all([loadSummary(), loadUsers(), loadPending(), loadStakes()]);
        if (state.currentDetail === userId) {
          await loadUserDetail(userId);
        }
      } catch (err) {
        if (err) alert(err.message || 'Failed to update balance');
      }
    };

    const forceCloseStake = async (stakeId) => {
      if (!stakeId) return;
      const confirmClose = confirm('Force close this stake? Locked funds will be returned to the user.');
      if (!confirmClose) return;
      try {
        const note = prompt('Reason / note (optional)') || null;
        const bonusStr = prompt('Bonus payout (optional, numeric)');
        const bonus = bonusStr ? Number(bonusStr) : null;
        if (bonusStr && !Number.isFinite(bonus)) {
          alert('Invalid bonus amount');
          return;
        }
        const { error } = await window.sb.rpc('admin_force_close_stake', { p_stake_id: stakeId, p_note: note, p_bonus: bonusStr ? bonus : null });
        if (error) throw error;
        alert('Stake closed');
        await Promise.all([loadSummary(), loadStakes(), loadUsers(), loadPending()]);
        if (state.currentDetail) {
          await loadUserDetail(state.currentDetail);
        }
      } catch (err) {
        alert(err.message || 'Failed to force close stake');
      }
    };

    // Event bindings
    els.pending.prev?.addEventListener('click', () => {
      if (state.pendingPage > 1) {
        state.pendingPage -= 1;
        loadPending();
      }
    });
    els.pending.next?.addEventListener('click', () => {
      state.pendingPage += 1;
      loadPending();
    });
    els.pending.refresh?.addEventListener('click', () => loadPending());
    els.pending.typeFilter?.addEventListener('change', () => {
      state.pendingPage = 1;
      loadPending();
    });
    if (els.pending.search) {
      els.pending.search.addEventListener('input', debounce(() => {
        state.pendingPage = 1;
        loadPending();
      }));
    }
    els.pending.approveSel?.addEventListener('click', async () => {
      const selected = Array.from(document.querySelectorAll('#adBody input.sel:checked')).map((el) => ({
        id: Number(el.value),
        type: el.getAttribute('data-type')
      }));
      for (const item of selected) {
        try {
          if (String(item.type || '').toLowerCase() === 'deposit') {
            const { error } = await window.sb.rpc('admin_approve_deposit', { p_tx_id: item.id });
            if (error) throw error;
          } else {
            const { error } = await window.sb.rpc('admin_approve_withdraw', { p_tx_id: item.id });
            if (error) throw error;
          }
        } catch (err) {
          console.warn('Failed to approve tx', item.id, err);
        }
      }
      await Promise.all([loadSummary(), loadPending(), loadUsers()]);
    });
    els.pending.rejectSel?.addEventListener('click', async () => {
      const selected = Array.from(document.querySelectorAll('#adBody input.sel:checked')).map((el) => Number(el.value));
      for (const id of selected) {
        try {
          const { error } = await window.sb.rpc('admin_reject_tx', { p_tx_id: id });
          if (error) throw error;
        } catch (err) {
          console.warn('Failed to reject tx', id, err);
        }
      }
      await Promise.all([loadSummary(), loadPending()]);
    });
    els.pending.body?.addEventListener('click', async (event) => {
      const btn = event.target.closest('button[data-act]');
      if (!btn) return;
      const id = Number(btn.getAttribute('data-id'));
      const act = btn.getAttribute('data-act');
      const type = btn.getAttribute('data-type');
      if (!id) return;
      try {
        btn.disabled = true;
        if (act === 'approve') {
          if (String(type || '').toLowerCase() === 'deposit') {
            const { error } = await window.sb.rpc('admin_approve_deposit', { p_tx_id: id });
            if (error) throw error;
          } else {
            const { error } = await window.sb.rpc('admin_approve_withdraw', { p_tx_id: id });
            if (error) throw error;
          }
        } else {
          const { error } = await window.sb.rpc('admin_reject_tx', { p_tx_id: id });
          if (error) throw error;
        }
        await Promise.all([loadSummary(), loadPending(), loadUsers()]);
      } catch (err) {
        alert(err.message || 'Action failed');
      } finally {
        btn.disabled = false;
      }
    });

    els.users.prev?.addEventListener('click', () => {
      if (state.usersPage > 1) {
        state.usersPage -= 1;
        loadUsers();
      }
    });
    els.users.next?.addEventListener('click', () => {
      state.usersPage += 1;
      loadUsers();
    });
    els.users.refresh?.addEventListener('click', () => loadUsers());
    els.users.roleFilter?.addEventListener('change', () => {
      state.usersPage = 1;
      loadUsers();
    });
    if (els.users.search) {
      els.users.search.addEventListener('input', debounce(() => {
        state.usersPage = 1;
        loadUsers();
      }));
    }
    els.users.body?.addEventListener('click', async (event) => {
      const btn = event.target.closest('button[data-uact]');
      if (!btn) return;
      const userId = btn.getAttribute('data-id');
      const action = btn.getAttribute('data-uact');
      if (!userId) return;
      try {
        btn.disabled = true;
        if (action === 'view') {
          await loadUserDetail(userId);
        } else if (action === 'role') {
          const role = btn.getAttribute('data-role');
          const { error } = await window.sb.rpc('admin_set_role', { p_user_id: userId, p_role: role });
          if (error) throw error;
          await loadUsers();
          if (state.currentDetail === userId) {
            await loadUserDetail(userId);
          }
        } else if (action === 'credit' || action === 'debit') {
          await adjustWallet(userId, action);
        }
      } catch (err) {
        alert(err.message || 'Action failed');
      } finally {
        btn.disabled = false;
      }
    });

    els.stakes.prev?.addEventListener('click', () => {
      if (state.stakesPage > 1) {
        state.stakesPage -= 1;
        loadStakes();
      }
    });
    els.stakes.next?.addEventListener('click', () => {
      state.stakesPage += 1;
      loadStakes();
    });
    els.stakes.refresh?.addEventListener('click', () => loadStakes());
    els.stakes.statusFilter?.addEventListener('change', () => {
      state.stakesPage = 1;
      loadStakes();
    });
    if (els.stakes.search) {
      els.stakes.search.addEventListener('input', debounce(() => {
        state.stakesPage = 1;
        loadStakes();
      }));
    }
    els.stakes.body?.addEventListener('click', async (event) => {
      const btn = event.target.closest('button[data-sact]');
      if (!btn) return;
      const stakeId = Number(btn.getAttribute('data-id'));
      if (!stakeId) return;
      if (btn.getAttribute('data-sact') === 'force') {
        await forceCloseStake(stakeId);
      }
    });

    els.logs.refresh?.addEventListener('click', () => loadLogs());

    els.settings.saveAddresses?.addEventListener('click', async () => {
      try {
        const value = JSON.parse(els.settings.addresses?.value || '{}');
        const { error } = await window.sb.rpc('admin_update_setting', { p_key: 'deposit_addresses', p_value: value });
        if (error) throw error;
        alert('Addresses updated');
      } catch (err) {
        alert(err.message || 'Failed to save addresses');
      }
    });
    els.settings.saveMin?.addEventListener('click', async () => {
      try {
        const value = JSON.parse(els.settings.minDeposit?.value || '{}');
        const { error } = await window.sb.rpc('admin_update_setting', { p_key: 'min_deposit', p_value: value });
        if (error) throw error;
        alert('Minimums updated');
      } catch (err) {
        alert(err.message || 'Failed to save minimums');
      }
    });

    els.drawer.overlay?.addEventListener('click', closeDrawer);
    els.drawer.close?.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeDrawer();
    });
    els.drawer.credit?.addEventListener('click', () => {
      if (state.currentDetail) adjustWallet(state.currentDetail, 'credit');
    });
    els.drawer.debit?.addEventListener('click', () => {
      if (state.currentDetail) adjustWallet(state.currentDetail, 'debit');
    });

    await loadSummary();
    await Promise.all([loadPending(), loadUsers(), loadStakes(), loadLogs(), loadSettings()]);
  });
})();




