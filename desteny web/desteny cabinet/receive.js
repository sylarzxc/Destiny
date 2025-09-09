// Receive page logic: asset/network selection, address display, USDT estimate, submit request
(function(){
  document.addEventListener('DOMContentLoaded', async () => {
    if (!window.sb || !window.authHelpers) return;
    const session = await window.authHelpers.session();
    if (!session) return;

    // Supported networks per asset (MVP)
    const NETWORKS = {
      USDT: ['TRC20','ERC20','BEP20'],
      BTC: ['BTC'], ETH: ['ERC20'], BNB: ['BEP20'], ADA:['Cardano'],
      DOGE:['Dogecoin'], DOT:['Polkadot'], XRP:['XRP'], MATIC:['Polygon'], AVAX:['Avalanche C-Chain']
    };

    // TODO: Replace placeholders with your own deposit addresses below.
    // This fallback is used if Supabase settings.key = 'deposit_addresses' is absent.
    const FALLBACK_ADDRESSES = {
      USDT: { TRC20: 'PASTE_TRON_ADDRESS_TRX_USDT_HERE', ERC20: 'PASTE_ERC20_ADDRESS_USDT_HERE', BEP20: 'PASTE_BEP20_ADDRESS_USDT_HERE' },
      BTC: { BTC: 'PASTE_BTC_ADDRESS_HERE' },
      ETH: { ERC20: 'PASTE_ETH_ADDRESS_HERE' },
      BNB: { BEP20: 'PASTE_BEP20_BNB_ADDRESS_HERE' },
      ADA: { Cardano: 'PASTE_ADA_ADDRESS_HERE' },
      DOGE: { Dogecoin: 'PASTE_DOGE_ADDRESS_HERE' },
      DOT: { Polkadot: 'PASTE_DOT_ADDRESS_HERE' },
      XRP: { XRP: 'PASTE_XRP_ADDRESS_HERE' },
      MATIC: { Polygon: 'PASTE_MATIC_ADDRESS_HERE' },
      AVAX: { 'Avalanche C-Chain': 'PASTE_AVAX_C_ADDRESS_HERE' }
    };

    // Client-side minimums for better UX (optional)
    const MIN_DEPOSIT = { USDT:1, BTC:0.0001, ETH:0.003, BNB:0.02, ADA:10, DOGE:20, DOT:2, XRP:10, MATIC:5, AVAX:0.2 };

    const els = {
      asset: document.getElementById('recvAsset'),
      network: document.getElementById('recvNetwork'),
      amount: document.getElementById('recvAmount'),
      estimate: document.getElementById('recvEstimate')?.querySelector('.send-amount'),
      address: document.getElementById('recvAddress'),
      copy: document.getElementById('btnCopyAddr'),
      tx: document.getElementById('recvTxHash'),
      submit: document.getElementById('recvSubmit'),
      notice: document.getElementById('recvNotice'),
      history: document.getElementById('recvHistory'),
      ratesStatus: document.getElementById('ratesStatus')
    };

    // Addresses from settings (fallback to local placeholders)
    let addresses = {};
    try{
      const { data } = await window.sb.from('settings').select('value').eq('key','deposit_addresses').single();
      addresses = (data && data.value) || FALLBACK_ADDRESSES;
    }catch(err){ console.warn('load settings error', err); addresses = FALLBACK_ADDRESSES; }

    function populateNetworks(){
      const a = (els.asset.value || 'USDT').toUpperCase();
      const list = NETWORKS[a] || [];
      els.network.innerHTML = '';
      list.forEach(n=>{
        const opt = document.createElement('option'); opt.value = n; opt.textContent = n; els.network.appendChild(opt);
      });
      if (!list.length){
        const opt = document.createElement('option'); opt.value = 'N/A'; opt.textContent='N/A'; els.network.appendChild(opt);
      }
      updateAddress();
    }

    function updateAddress(){
      const a = (els.asset.value||'USDT').toUpperCase();
      const n = els.network.value;
      const addr = addresses?.[a]?.[n] || '';
      els.address.value = addr || '';
      els.notice.textContent = `Send only ${a} on ${n}.`;
      // Min label
      const min = MIN_DEPOSIT[a];
      const minEl = document.getElementById('recvMin');
      if (minEl) minEl.textContent = min ? `Minimum deposit: ${min} ${a}` : '';
      // QR code
      try {
        const canvas = document.getElementById('recvQR');
        if (canvas) {
          const ctx = canvas.getContext('2d'); ctx?.clearRect(0,0,canvas.width,canvas.height);
          if (addr && window.QRCode) QRCode.toCanvas(canvas, addr, { width: 128, margin: 1 });
        }
      } catch {}
      // Memo/Tag toggle
      const extraWrap = document.getElementById('recvExtra');
      const extraLabel = document.getElementById('recvExtraLabel');
      if (extraWrap && extraLabel) {
        if (a === 'XRP') { extraWrap.style.display=''; extraLabel.textContent='Destination tag'; }
        else if (a === 'XLM') { extraWrap.style.display=''; extraLabel.textContent='Memo'; }
        else { extraWrap.style.display='none'; }
      }
    }

    async function updateEstimate(){
      const a = (els.asset.value||'USDT').toUpperCase();
      const amt = Number(els.amount.value||0);
      const usdt = await (window.ratesUtil?.estimateUSDT(a, amt) || Promise.resolve(0));
      if (els.estimate) els.estimate.textContent = `${usdt}`;
      if (els.ratesStatus) els.ratesStatus.textContent = await (window.ratesUtil?.status() || '');
    }

    function wireCopy(){
      els.copy?.addEventListener('click', () => {
        els.address?.select?.();
        try{ document.execCommand('copy'); els.copy.classList.add('copied'); setTimeout(()=>els.copy.classList.remove('copied'), 1200); }catch{}
      });
    }

    async function submitRequest(){
      const a = (els.asset.value||'USDT').toUpperCase();
      const n = els.network.value;
      const amountAsset = Number(els.amount.value||0);
      if (!amountAsset || amountAsset <= 0) return alert('Enter amount');
      const min = MIN_DEPOSIT[a];
      if (min && amountAsset < min) return alert(`Minimum deposit is ${min} ${a}`);
      const rate = await (window.ratesUtil?.estimateUSDT(a, 1) || Promise.resolve(0));
      const amountUsdt = +(rate * amountAsset).toFixed(4);
      const tx = (els.tx.value||'').trim();
      if (!els.address.value) return alert('No deposit address set. Please add your wallet address in receive.js (FALLBACK_ADDRESSES) or settings.deposit_addresses');
      const payload = {
        user_id: session.user.id,
        type: 'deposit',
        amount: amountUsdt,
        meta: { asset: a, network: n, amount_asset: amountAsset, rate_to_usdt: rate, tx_hash: tx, status: 'pending', address: els.address.value }
      };
      try{
        els.submit.disabled = true;
        const { error } = await window.sb.from('transactions').insert(payload).single();
        if (error) throw error;
        els.tx.value = ''; els.amount.value=''; await updateEstimate();
        await loadHistory();
        alert('Deposit request submitted. We will credit after confirmation.');
      }catch(err){
        console.warn('Submit deposit error', err);
        alert(err.message || 'Failed to submit');
      } finally { els.submit.disabled = false; }
    }

    async function loadHistory(){
      try{
        const { data, error } = await window.sb
          .from('transactions')
          .select('id, amount, created_at, meta')
          .eq('user_id', session.user.id)
          .eq('type','deposit')
          .order('created_at', { ascending: false })
          .limit(10);
        if (error) throw error;
        const list = Array.isArray(data) ? data : [];
        els.history.innerHTML = list.length ? list.map(row => {
          const m = row.meta || {}; const st = (m.status||'pending');
          return `<div class="tran-item"><span>${new Date(row.created_at).toLocaleString()}</span><span>${(m.asset||"")}->USDT | ${row.amount} USDT | ${st}</span></div>`;
        }).join('') : '<p>You have not yet topped up the balance of the Destiny service</p>';
      }catch(err){
        els.history.innerHTML = '<p>Failed to load history</p>';
      }
    }

    els.asset?.addEventListener('change', () => { populateNetworks(); updateEstimate(); });
    els.network?.addEventListener('change', updateAddress);
    els.amount?.addEventListener('input', updateEstimate);
    els.submit?.addEventListener('click', submitRequest);

    populateNetworks(); wireCopy(); updateEstimate(); loadHistory();
  });
})();



