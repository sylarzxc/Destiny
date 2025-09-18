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

  // Ensure a visible arrow indicator at the end of each sidebar item
  // Some environments may fail to render inline SVGs; provide a text fallback.
  document.querySelectorAll('.sidebar .nav-item').forEach((item) => {
    const hasSvgArrow = !!item.querySelector('.nav-arrow');
    const hasFallback = !!item.querySelector('.nav-fallback-arrow');
    if (!hasSvgArrow && !hasFallback) {
      const span = document.createElement('span');
      span.className = 'nav-fallback-arrow';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = '›';
      item.appendChild(span);
    }
  });

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
      if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.classList.remove('active');
      }
    };
    const openSidebar = () => {
      document.body.classList.add('sidebar-open');
      if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.classList.add('active');
      }
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

  // Fallback: if user is admin (flag set by cabinet-auth.js), ensure Admin link exists
  function ensureAdminLink() {
    if (!window.__isAdmin) return;
    const nav = document.querySelector('.sidebar .sidebar-nav');
    if (!nav) return;
    if (!nav.querySelector('a[href="admin.html"]')) {
      const a = document.createElement('a');
      a.href = 'admin.html';
      a.className = 'nav-item';
      a.innerHTML = `
        <svg class="nav-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M3 12h18M3 6h18M3 18h18" fill="none" stroke="currentColor" stroke-width="1.6" />
        </svg>
        <span>Admin</span>
        <svg class="nav-arrow" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      nav.appendChild(a);
    }
  }
  // Try now and once again shortly after to avoid timing issues
  ensureAdminLink();
  setTimeout(ensureAdminLink, 400);

  // Watch for auth script finishing and insert Admin link when flag appears
  (function watchAdminLink(){
    let tries = 0;
    const timer = setInterval(() => {
      const have = document.querySelector('.sidebar .sidebar-nav a[href="admin.html"]');
      if (window.__isAdmin && !have) ensureAdminLink();
      tries++;
      if (have || tries > 20) clearInterval(timer); // ~5s max
    }, 250);
  })();
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
      if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.classList.remove('active');
      }
    };
    const openSidebar = () => {
      document.body.classList.add('sidebar-open');
      if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.classList.add('active');
      }
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
        if (menuBtn) {
          menuBtn.setAttribute('aria-expanded', 'false');
          menuBtn.classList.remove('active');
        }
      });
      overlayEl.dataset.bound = '1';
    }

    if (!document.body.dataset.escBound) {
      document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape') {
          document.body.classList.remove('sidebar-open');
          if (menuBtn) {
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.classList.remove('active');
          }
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
              if (menuBtn) {
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.classList.remove('active');
              }
            }, 120);
          }
        });
        link.dataset.bound = '1';
      }
    });
  };

  const destroyMobileUI = () => {
    document.body.classList.remove('sidebar-open');
    const menuBtn = document.querySelector('.mobile-topbar .menu-toggle');
    if (menuBtn) menuBtn.classList.remove('active');
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
