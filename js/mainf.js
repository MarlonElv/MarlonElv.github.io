/* ============================================================
   EASELY I & II — finance.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- DYNAMIC DATE ---------------------------------------- */
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
  ['report-date', 'footer-date'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.textContent = today;
  });

  /* ---- BAR ANIMATION ON SCROLL ----------------------------- */
  const bars = document.querySelectorAll('.bar');

  if ('IntersectionObserver' in window) {
    bars.forEach(function (bar) {
      const finalWidth = bar.style.width;
      bar.style.width = '0%';

      const obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              bar.style.width = finalWidth;
            }, 80);
            obs.unobserve(bar);
          }
        });
      }, { threshold: 0.1 });

      obs.observe(bar);
    });
  }

  /* ---- MOBILE NAV TOGGLE ----------------------------------- */
  const toggle     = document.getElementById('mobileToggle');
  const navLinksEl = document.querySelector('.nav-links');

  if (toggle && navLinksEl) {
    toggle.addEventListener('click', function () {
      navLinksEl.classList.toggle('open');
    });
    navLinksEl.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinksEl.classList.remove('open');
      });
    });
  }

  /* ---- ACTIVE NAV ON SCROLL -------------------------------- */
  const navLinks   = document.querySelectorAll('.nav-link');
  const allSections = document.querySelectorAll('[id]');

  window.addEventListener('scroll', function () {
    let current = '';
    allSections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= 80) current = s.id;
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }, { passive: true });

  /* ---- ROW HOVER HIGHLIGHT --------------------------------- */
  document.querySelectorAll('.cost-table tbody tr').forEach(function (row) {
    row.addEventListener('mouseenter', function () {
      const bar = row.querySelector('.bar');
      if (bar) bar.style.opacity = '1';
    });
    row.addEventListener('mouseleave', function () {
      const bar = row.querySelector('.bar');
      if (bar && !bar.classList.contains('highlight')) bar.style.opacity = '0.7';
    });
  });

});