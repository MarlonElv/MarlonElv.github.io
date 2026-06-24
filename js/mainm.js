/* ============================================================
   EASELY I & II — mechsched.js
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

  /* ---- IMAGE UPLOAD PREVIEW -------------------------------- */
  [
    { input: 'upload-e1', preview: 'sched-img-e1-preview', wrap: 'sched-img-e1' },
    { input: 'upload-e2', preview: 'sched-img-e2-preview', wrap: 'sched-img-e2' }
  ].forEach(function (cfg) {
    const input   = document.getElementById(cfg.input);
    const preview = document.getElementById(cfg.preview);
    const wrap    = document.getElementById(cfg.wrap);
    if (!input || !preview || !wrap) return;

    input.addEventListener('change', function () {
      const file = input.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
        wrap.querySelector('.sched-img-placeholder').style.display = 'none';
      };
      reader.readAsDataURL(file);
    });
  });

  /* ---- SCROLL REVEAL --------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.sched-table tbody tr, .delay-drivers, .sched-img-block'
  );
  if ('IntersectionObserver' in window) {
    revealTargets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(6px)';
      el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
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