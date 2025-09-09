// Basic rates utility: fetch coin prices and convert to USDT with caching
(function(){
  const CACHE_KEY = 'ratesCacheV1';
  const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min
  const IDMAP = {
    BTC: 'bitcoin', ETH: 'ethereum', BNB: 'binancecoin', ADA: 'cardano',
    USDT: 'tether', USDC: 'usd-coin', DOGE: 'dogecoin', DOT: 'polkadot',
    XRP: 'ripple', MATIC: 'matic-network', AVAX: 'avalanche-2'
  };

  async function fetchRates(){
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids='+
      Object.values(IDMAP).join(',')+'&vs_currencies=usd';
    const res = await fetch(url, { headers: { 'accept': 'application/json' } });
    if(!res.ok) throw new Error('Rates fetch failed');
    const data = await res.json();
    const usd = (sym)=> (data[IDMAP[sym]]?.usd ?? null);
    const usdtUsd = usd('USDT') ?? 1.0;
    const out = {};
    Object.keys(IDMAP).forEach(sym=>{
      const v = usd(sym);
      if (v == null) return;
      out[sym] = usdtUsd ? (v / usdtUsd) : v; // price in USDT
    });
    return out;
  }

  async function getRates(){
    try{
      const raw = localStorage.getItem(CACHE_KEY);
      if(raw){
        const obj = JSON.parse(raw);
        if(Date.now() - (obj.ts||0) < CACHE_TTL_MS) return obj.data || {};
      }
    }catch{}
    try{
      const data = await fetchRates();
      try{ localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); }catch{}
      return data;
    }catch(err){
      console.warn('Rates error', err);
      // Fallback rough rates to USDT ~ USD
      return { USDT:1, BTC:65000, ETH:3500, BNB:600, ADA:0.6, DOGE:0.12, DOT:6, XRP:0.6, MATIC:0.8, AVAX:30 };
    }
  }

  window.ratesUtil = {
    async estimateUSDT(symbol, amount){
      const map = await getRates();
      const r = Number(map[String(symbol).toUpperCase()] || 0);
      const a = Number(amount || 0);
      return +(r * a).toFixed(4);
    },
    async status(){
      const raw = localStorage.getItem(CACHE_KEY);
      if(!raw) return 'rates: loading…';
      try{
        const obj = JSON.parse(raw); const age = Math.round((Date.now()-obj.ts)/1000);
        return `rates: cached ${age}s ago`;
      }catch{ return 'rates: cache'; }
    }
  };
})();

