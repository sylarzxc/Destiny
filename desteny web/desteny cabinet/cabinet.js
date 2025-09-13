// Basic interactivity for Destiny personal cabinet

document.addEventListener('DOMContentLoaded', () => {
  // Toggle staking type on deposit page
  const toggleContainers = document.querySelectorAll('.staking-toggle');
  toggleContainers.forEach((container) => {
    const buttons = container.querySelectorAll('.toggle-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });

  // Copy referral link to clipboard
  const copyBtn = document.querySelector('.btn-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const input = copyBtn.previousElementSibling;
      if (input && input.select) {
        input.select();
        try {
          document.execCommand('copy');
          copyBtn.innerHTML = '<svg class="btn-svg" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          setTimeout(() => {
            copyBtn.innerHTML = '<svg class="btn-svg" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M21 7H9a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M7 7V5a2 2 0 0 1 2-2h10" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
          }, 2000);
        } catch (err) {
          console.error('Copy failed', err);
        }
      }
    });
  }

  // ===== mobile sidebar toggle (insert / replace existing mobile-topbar code) =====
  document.addEventListener('DOMContentLoaded', () => {
    // create mobile topbar (burger only) if not present
    if (!document.querySelector('.mobile-topbar')) {
      const topbar = document.createElement('div');
      topbar.className = 'mobile-topbar';
      // Замінити innerSVG змінною на твій <svg> коли пришлеш
      const innerSVG = `
        <button class="menu-toggle" aria-label="Меню" aria-expanded="false" title="Меню">
          <!-- fallback burger SVG: можна замінити на свій -->
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M3 7h18M3 12h18M3 17h18" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      `;
      topbar.innerHTML = innerSVG;
      document.body.prepend(topbar);
    }

    if (!document.querySelector('.mobile-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'mobile-overlay';
      document.body.appendChild(overlay);
    }

    const menuBtn = document.querySelector('.mobile-topbar .menu-toggle');
    const overlayEl = document.querySelector('.mobile-overlay');
    const closeSidebar = () => {
      document.body.classList.remove('sidebar-open');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    };
    const openSidebar = () => {
      document.body.classList.add('sidebar-open');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    };

    if (menuBtn) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (document.body.classList.contains('sidebar-open')) closeSidebar(); else openSidebar();
      });
    }

    if (overlayEl) overlayEl.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') closeSidebar();
    });

    // close when clicking a nav link (mobile)
    document.querySelectorAll('.sidebar .nav-item').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          setTimeout(() => closeSidebar(), 120);
        }
      });
    });
  });
  // ===== end mobile sidebar toggle =====
});

// Fallback: ensure mobile topbar/sidebar toggle initializes even if a nested
// DOMContentLoaded prevented the original block from running.
(function cabinetMobileResponsiveInit() {
  const MOBILE_MAX = 900;
  let resizeTimer = null;

  const isMobile = () => window.innerWidth <= MOBILE_MAX;

  const buildTopbar = () => {
    if (!document.querySelector('.mobile-topbar')) {
      const topbar = document.createElement('div');
      topbar.className = 'mobile-topbar';
      topbar.innerHTML = `
        <a class="mobile-title" href="../desteny/index.html">DESTINY</a>
        <button class="menu-toggle" aria-label="Open menu" aria-expanded="false" title="Menu">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M3 7h18M3 12h18M3 17h18" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>`;
      document.body.prepend(topbar);
    }
  };

  const buildOverlay = () => {
    if (!document.querySelector('.mobile-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'mobile-overlay';
      document.body.appendChild(overlay);
    }
  };

  const wireEvents = () => {
    const menuBtn = document.querySelector('.mobile-topbar .menu-toggle');
    const overlayEl = document.querySelector('.mobile-overlay');

    const closeSidebar = () => {
      document.body.classList.remove('sidebar-open');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    };
    const openSidebar = () => {
      document.body.classList.add('sidebar-open');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    };

    if (menuBtn && !menuBtn.dataset.bound) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (document.body.classList.contains('sidebar-open')) closeSidebar(); else openSidebar();
      });
      menuBtn.dataset.bound = '1';
    }
    if (overlayEl && !overlayEl.dataset.bound) {
      overlayEl.addEventListener('click', () => {
        document.body.classList.remove('sidebar-open');
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
      });
      overlayEl.dataset.bound = '1';
    }

    if (!document.body.dataset.escBound) {
      document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape') {
          document.body.classList.remove('sidebar-open');
          if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
        }
      });
      document.body.dataset.escBound = '1';
    }

    document.querySelectorAll('.sidebar .nav-item').forEach((link) => {
      if (!link.dataset.bound) {
        link.addEventListener('click', () => {
          if (isMobile()) {
            setTimeout(() => {
              document.body.classList.remove('sidebar-open');
              if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
            }, 120);
          }
        });
        link.dataset.bound = '1';
      }
    });
  };

  const destroyMobileUI = () => {
    document.body.classList.remove('sidebar-open');
    const topbar = document.querySelector('.mobile-topbar');
    const overlay = document.querySelector('.mobile-overlay');
    if (topbar) topbar.remove();
    if (overlay) overlay.remove();
  };

  const ensure = () => {
    if (isMobile()) {
      buildTopbar();
      buildOverlay();
      wireEvents();
    } else {
      destroyMobileUI();
    }
  };

  const start = () => {
    ensure();
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(ensure, 120);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
