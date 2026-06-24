/* ============================================================
   EASELY I & II — riskman.js
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

  /* ---- COLLAPSIBLE SECTIONS -------------------------------- */
  document.querySelectorAll('.collapsible-header').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetId = btn.dataset.target;
      const body     = document.getElementById(targetId);
      if (!body) return;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        body.classList.add('collapsed');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        body.classList.remove('collapsed');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---- UXO BAR ANIMATE ON SCROLL -------------------------- */
  const uxoBars = document.querySelectorAll('.uxo-bar-fill');
  if ('IntersectionObserver' in window && uxoBars.length) {
    uxoBars.forEach(function (bar) {
      const finalW = bar.style.width;
      bar.style.width = '0%';
      const obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () { bar.style.width = finalW; }, 150);
            obs.unobserve(bar);
          }
        });
      }, { threshold: 0.2 });
      obs.observe(bar);
    });
  }

  /* ---- SCROLL REVEAL --------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.insight-card, .ct-node, .uxo-event, .lesson-item, .risk-banner-card, .rc-fig'
  );
  if ('IntersectionObserver' in window) {
    revealTargets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    });
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '';
          entry.target.style.transform = '';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    revealTargets.forEach(function (el) { obs.observe(el); });
  }

  /* ---- MOBILE NAV TOGGLE ----------------------------------- */
  const toggle     = document.getElementById('mobileToggle');
  const navLinksEl = document.querySelector('.nav-links');
  if (toggle && navLinksEl) {
    toggle.addEventListener('click', function () { navLinksEl.classList.toggle('open'); });
    navLinksEl.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { navLinksEl.classList.remove('open'); });
    });
  }

  /* ---- ACTIVE NAV ON SCROLL -------------------------------- */
  const navLinks    = document.querySelectorAll('.nav-link');
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

});