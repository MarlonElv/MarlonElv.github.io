/* ============================================================
   EASELY I & II — mechvel.js
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

  /* ---- ANIMATE TORQUE BARS ON SCROLL ----------------------- */
  const tsBars = document.querySelectorAll('.ts-bar');
  if ('IntersectionObserver' in window && tsBars.length) {
    tsBars.forEach(function (bar) {
      const finalW = bar.style.width;
      bar.style.width = '0%';
      const obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () { bar.style.width = finalW; }, 100);
            obs.unobserve(bar);
          }
        });
      }, { threshold: 0.3 });
      obs.observe(bar);
    });
  }

  /* ---- ANIMATE DELIVERY BARS ON SCROLL --------------------- */
  const dtBars = document.querySelectorAll('.dt-bar-fill');
  if ('IntersectionObserver' in window && dtBars.length) {
    dtBars.forEach(function (bar) {
      const finalH = bar.style.height;
      bar.style.height = '0%';
      const obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () { bar.style.height = finalH; }, 80);
            obs.unobserve(bar);
          }
        });
      }, { threshold: 0.1 });
      obs.observe(bar);
    });
  }

  /* ---- SCROLL REVEAL --------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.proc-card, .ts-card, .torque-detail, .ge-item, .dt-total-item'
  );
  if ('IntersectionObserver' in window) {
    revealTargets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
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
    }, { threshold: 0.04 });
    revealTargets.forEach(function (el) { obs.observe(el); });
  }

  /* ---- MOBILE NAV ------------------------------------------ */
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