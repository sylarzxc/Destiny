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
});