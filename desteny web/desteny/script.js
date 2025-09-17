/*
  Destiny CeFi Platform interactivity
  -----------------------------------
  This script powers the minimal interactivity on the Destiny landing page.
  It handles tab switching for the staking section and calculates
  illustrative returns based on user input. Please note that the
  calculations here are for demonstration purposes only and do not
  reflect actual financial products or advice.
*/

document.addEventListener('DOMContentLoaded', () => {\n  try {\n    const params = new URLSearchParams(window.location.search);\n    const refCode = params.get('ref');\n    if (refCode) {\n      localStorage.setItem('destiny_pending_referral', refCode);\n      if (typeof window.history?.replaceState === 'function') {\n        const url = new URL(window.location.href);\n        url.searchParams.delete('ref');\n        window.history.replaceState({}, document.title, url.toString());\n      }\n    }\n  } catch (err) {\n    console.warn('Failed to process referral param', err);\n  }\n\n
  // ------------------------------
  // Token selection & symbol tags
  // ------------------------------
  const TOKEN_SYMBOLS = {
    'Ethereum': 'ETH',
    'Bitcoin': 'BTC',
    'Cardano': 'ADA',
    'Tether': 'USDT',
    'Dogecoin': 'DOGE',
    'XRP': 'XRP',
    'MATIC': 'MATIC',
    'Avalanche': 'AVAX',
    'Polkadot': 'DOT',
    'Binance Coin': 'BNB'
  };
  let selectedToken = 'USDT';
  const amountLabel = document.querySelector('label[for="stakeAmount"]');
  function updateAmountLabel() {
    if (amountLabel) amountLabel.innerHTML = `Enter the amount <span class="unit">(${selectedToken})</span>`;
  }
  function setActiveTokenByImg(imgEl) {
    if (!imgEl) return;
    const alt = imgEl.getAttribute('alt') || '';
    selectedToken = TOKEN_SYMBOLS[alt] || (alt || '').toUpperCase().slice(0, 5) || 'ASSET';
    // Visual active state
    document.querySelectorAll('.token-list li').forEach(li => li.classList.remove('active'));
    const li = imgEl.closest('li');
    li?.classList.add('active');
    updateAmountLabel();
    // Recalculate on token change
    document.getElementById('calculateBtn')?.click();
  }
  // Bind clicks to token icons
  const tokenImgs = document.querySelectorAll('.token-list li img');
  tokenImgs.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => setActiveTokenByImg(img));
  });
  // Default select USDT (Tether) if present, else first token
  const defaultUsdt = Array.from(tokenImgs).find(i => (i.getAttribute('alt') || '').toLowerCase() === 'tether');
  setActiveTokenByImg(defaultUsdt || tokenImgs[0]);
  // Tab switching logic
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active classes
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Activate clicked tab
      button.classList.add('active');
      const targetId = button.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.classList.add('active');
      }
    });
  });

  // Period selection logic
  const periodButtons = document.querySelectorAll('.period-btn');
  periodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      periodButtons.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      // Recalculate on change
      document.getElementById('calculateBtn')?.click();
    });
  });

  // Staking mode toggle (Locked vs Flexible)
  const toggleBtns = document.querySelectorAll('.staking-toggle .toggle-btn');
  const durationPanel = document.getElementById('lockedDurationPanel');
  const calcGrid = document.querySelector('.calculator-grid');
  function setMode(mode) {
    if (mode === 'flexible') {
      toggleBtns.forEach(b => b.classList.toggle('active', b.dataset.target === 'flexible'));
      if (durationPanel) durationPanel.style.display = 'none';
      if (calcGrid) calcGrid.classList.add('flexible');
    } else {
      toggleBtns.forEach(b => b.classList.toggle('active', b.dataset.target === 'locked'));
      if (durationPanel) durationPanel.style.display = '';
      if (calcGrid) calcGrid.classList.remove('flexible');
    }
  }

  // Bind clicks for toggle buttons
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      setMode(target === 'flexible' ? 'flexible' : 'locked');
      // Recalculate on mode change
      document.getElementById('calculateBtn')?.click();
    });
  });

  // Ensure default mode is locked on load
  setMode('locked');

  // Recalculate as amount changes
  const stakeAmountInput = document.getElementById('stakeAmount');
  stakeAmountInput?.addEventListener('input', () => {
    document.getElementById('calculateBtn')?.click();
  });

  // Calculator logic
  const calculateBtn = document.getElementById('calculateBtn');
  calculateBtn.addEventListener('click', () => {
    const amountInput = document.getElementById('stakeAmount');
    const dailyReturnEl = document.getElementById('dailyReturn');
    const totalReturnEl = document.getElementById('totalReturn');
    const activePeriod = document.querySelector('.period-btn.active');
    const flexibleActive = document.querySelector('.staking-toggle .toggle-btn.active[data-target="flexible"]');

    const amount = parseFloat(amountInput.value);
    let days = 0;
    if (flexibleActive) {
      days = 1; // per-day calculation in flexible mode
    } else {
      days = parseInt(activePeriod ? activePeriod.getAttribute('data-days') : '0', 10);
    }

    // Clear previous values if invalid
    if (!amount || amount <= 0 || !days) {
      dailyReturnEl.innerHTML = `0 <span class="unit">(${selectedToken})</span>`;
      totalReturnEl.innerHTML = `0 <span class="unit">(${selectedToken})</span>`;
      return;
    }

    // Client-specified monthly rates (simple interest, no compounding):
    // 30d -> 7.5%/month, 90d -> 10.5%/month, 180d -> 12.5%/month.
    // Profit accrues linearly once per day.
    const monthlyRates = { 30: 0.075, 90: 0.105, 180: 0.125 };
    // Flexible staking: 4.5% per month, accrues daily.
    const dailyRateFlexible = 0.045 / 30;
    // For locked plans, total rate over the whole period is monthly * (days/30)
    const totalRate = (flexibleActive)
      ? dailyRateFlexible * days
      : ((monthlyRates[days] || 0) * (days / 30));

    // Compute returns
    const dailyReturn = flexibleActive
      ? (amount * dailyRateFlexible)
      : (amount * totalRate) / days; // equals amount * (monthlyRate/30)
    const totalReturn = amount * (flexibleActive ? dailyRateFlexible * days : totalRate);

    // Format: show more precision for small values
    const fmt = (v) => (Math.abs(v) < 0.01 ? v.toFixed(4) : v.toFixed(2));
    dailyReturnEl.innerHTML = `${fmt(dailyReturn)} <span class="unit">(${selectedToken})</span>`;
    totalReturnEl.innerHTML = `${fmt(totalReturn)} <span class="unit">(${selectedToken})</span>`;
  });

  // Enable drag-to-scroll for token selector (works for vertical or horizontal)
  const tokenColumn = document.querySelector('.token-column');
  if (tokenColumn) {
    let isDragging = false;
    let startX = 0, startY = 0;
    let startScrollLeft = 0, startScrollTop = 0;
    const axis = () => (tokenColumn.scrollWidth > tokenColumn.clientWidth ? 'x' : 'y');
    const onDown = (x, y) => {
      isDragging = true;
      startX = x; startY = y;
      startScrollLeft = tokenColumn.scrollLeft;
      startScrollTop = tokenColumn.scrollTop;
      tokenColumn.classList.add('no-select');
    };
    const onMove = (x, y) => {
      if (!isDragging) return;
      if (axis() === 'x') {
        tokenColumn.scrollLeft = startScrollLeft - (x - startX);
      } else {
        tokenColumn.scrollTop = startScrollTop - (y - startY);
      }
    };
    const onUp = () => { isDragging = false; tokenColumn.classList.remove('no-select'); };
    // Mouse
    tokenColumn.addEventListener('mousedown', (e) => onDown(e.clientX, e.clientY));
    document.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    document.addEventListener('mouseup', onUp);
    // Touch
    tokenColumn.addEventListener('touchstart', (e) => onDown(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    tokenColumn.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    tokenColumn.addEventListener('touchend', onUp);
  }

  // Intersection observer to animate feature cards when they come into view
  const featureCards = document.querySelectorAll('.feature-card');
  if (featureCards.length) {
    // Set initial hidden state and directional classes
    featureCards.forEach((card, i) => {
      card.setAttribute('data-hidden', 'true');
      // Assign direction: left, right, center (cycle)
      const dir = i % 3 === 0 ? 'slide-left' : (i % 3 === 1 ? 'slide-right' : 'slide-center');
      card.classList.add(dir);
    });

    // Observe the features container and reveal cards in sequence when visible
    const featuresContainer = document.querySelector('.features-cards');
    if (featuresContainer) {
      const containerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Reveal cards one-by-one with staggered delays
            featureCards.forEach((card, idx) => {
              setTimeout(() => {
                card.removeAttribute('data-hidden');
                card.classList.add('visible');
              }, idx * 220); // 220ms between cards
            });
            containerObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      containerObserver.observe(featuresContainer);
    }
  }

  // Support chat toggle
  const chatToggle = document.getElementById('chatToggle');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const leaderboardSection = document.getElementById('leaderboard');
  function openChat() {
    if (!chatPanel) return;
    chatPanel.classList.add('open');
    chatPanel.setAttribute('aria-hidden', 'false');
    chatToggle?.setAttribute('aria-expanded', 'true');
    chatToggle?.classList.add('active');
  }
  function closeChat() {
    if (!chatPanel) return;
    chatPanel.classList.remove('open');
    chatPanel.setAttribute('aria-hidden', 'true');
    chatToggle?.setAttribute('aria-expanded', 'false');
    chatToggle?.classList.remove('active');
  }
  chatToggle?.addEventListener('click', () => {
    if (chatPanel?.classList.contains('open')) closeChat(); else openChat();
  });
  chatClose?.addEventListener('click', closeChat);

  // Show chat toggle only when leaderboard is visible
  if (chatToggle && leaderboardSection) {
    let shown = false;
    const lbObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!shown && entry.isIntersecting) {
          chatToggle.classList.add('visible');
          shown = true;
          observer.disconnect(); // keep it visible permanently after first reveal
        }
      });
    }, { threshold: 0.2 });
    lbObserver.observe(leaderboardSection);
  } else {
    // Fallback: show toggle if no leaderboard found
    chatToggle?.classList.add('visible');
  }

  // ------------------------------
  // Mobile menu (hamburger -> overlay)
  // ------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose = document.getElementById('menuClose');
  function openMenu() {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    // Prevent background scroll while menu is open
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }
  menuToggle?.addEventListener('click', () => {
    if (mobileMenu?.classList.contains('open')) closeMenu(); else openMenu();
  });
  menuClose?.addEventListener('click', closeMenu);
  // Close menu after clicking a link
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
});
