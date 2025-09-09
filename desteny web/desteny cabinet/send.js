// Send page: mirror of Receive, creates 'withdraw' transaction (pending)
(function(){
  document.addEventListener('DOMContentLoaded', async () => {
    if (!window.sb || !window.authHelpers) return;
    const session = await window.authHelpers.session();
    if (!session) return;

    const NETWORKS = {
      USDT: ['TRC20','ERC20','BEP20'],
      BTC: ['BTC'], ETH: ['ERC20'], BNB: ['BEP20'], ADA:['Cardano'],
      DOGE:['Dogecoin'], DOT:['Polkadot'], XRP:['XRP'], MATIC:['Polygon'], AVAX:['Avalanche C-Chain']
    };

    const els = {
      asset: document.getElementById('sendAsset'),
      network: document.getElementById('sendNetwork'),
      amount: document.getElementById('sendAmount'),
      estimate: document.getElementById('sendEstimate')?.querySelector('.send-amount'),
      to: document.getElementById('sendTo'),
      paste: document.getElementById('btnPasteAddr'),
      submit: document.getElementById('sendSubmit'),
      notice: document.getElementById('sendNotice'),
      ratesStatus: document.getElementById('sendRatesStatus'),
    };

    function populateNetworks(){
      const a = (els.asset.value || 'USDT').toUpperCase();
      els.network.innerHTML = '';
      (NETWORKS[a] || ['N/A']).forEach(n=>{
        const opt = document.createElement('option'); opt.value = n; opt.textContent = n; els.network.appendChild(opt);
      });
      els.notice.textContent = `Send only ${a} on ${els.network.value}.`;
    }

    async function updateEstimate(){
      const a = (els.asset.value||'USDT').toUpperCase();
      const amt = Number(els.amount.value||0);
      const usdt = await (window.ratesUtil?.estimateUSDT(a, amt) || Promise.resolve(0));
      if (els.estimate) els.estimate.textContent = `${usdt}`;
      if (els.ratesStatus) els.ratesStatus.textContent = await (window.ratesUtil?.status() || '');
    }

    els.paste?.addEventListener('click', async () => {
      try{ const t = await navigator.clipboard.readText(); if (t) els.to.value = t.trim(); }catch{}
    });

    async function submitSend(){
      const a = (els.asset.value||'USDT').toUpperCase();
      const n = els.network.value;
      const amountAsset = Number(els.amount.value||0);
      const to = (els.to.value||'').trim();
      if (!to) return alert('Enter recipient address');
      if (!amountAsset || amountAsset <= 0) return alert('Enter amount');
      const rate = await (window.ratesUtil?.estimateUSDT(a, 1) || Promise.resolve(0));
      const amountUsdt = +(rate * amountAsset).toFixed(4);
      const payload = {
        user_id: session.user.id,
        type: 'withdraw',
        amount: amountUsdt,
        meta: { asset: a, network: n, amount_asset: amountAsset, rate_to_usdt: rate, to_address: to, status: 'pending' }
      };
      try{
        els.submit.disabled = true;
        const { error } = await window.sb.from('transactions').insert(payload).single();
        if (error) throw error;
        els.amount.value = ''; els.to.value=''; await updateEstimate();
        alert('Withdrawal request submitted. It will be processed by admin.');
      }catch(err){
        console.warn('Submit withdraw error', err);
        alert(err.message || 'Failed to submit');
      } finally { els.submit.disabled = false; }
    }

    els.asset?.addEventListener('change', () => { populateNetworks(); updateEstimate(); });
    els.network?.addEventListener('change', () => { els.notice.textContent = `Send only ${els.asset.value} on ${els.network.value}.`; });
    els.amount?.addEventListener('input', updateEstimate);
    els.submit?.addEventListener('click', submitSend);

    populateNetworks(); updateEstimate();
  });
})();

