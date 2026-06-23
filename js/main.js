/* ============================================================
   EASELY 1 & 2 — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- DYNAMIC DATE ---------------------------------------- */
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
  const reportDateEl = document.getElementById('report-date');
  const footerDateEl = document.getElementById('footer-date');
  if (reportDateEl) reportDateEl.textContent = today;
  if (footerDateEl) footerDateEl.textContent = today;


  /* ---- DUAL HERO BARS (Easely 1 = 100, Easely 2 = 80) ------ */
  const dualBars = document.querySelectorAll('.dual-bar-fill');
  dualBars.forEach(function (bar) {
    const w = parseFloat(bar.dataset.width) || 0;
    requestAnimationFrame(() => {
      setTimeout(() => { bar.style.width = w + '%'; }, 200);
    });
  });


  /* ---- GAUGE (combined 90%) -------------------------------- */
  const gaugeFill  = document.getElementById('gaugeFill');
  const gaugeLabel = document.getElementById('gaugeLabel');
  const COMBINED_PCT = 90;
  const arcLength  = 201;

  if (gaugeFill) {
    const offset = arcLength - (arcLength * COMBINED_PCT / 100);
    if (gaugeLabel) gaugeLabel.textContent = COMBINED_PCT + '%';
    requestAnimationFrame(() => {
      setTimeout(() => {
        gaugeFill.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)';
        gaugeFill.style.strokeDashoffset = offset;
      }, 300);
    });
  }


  /* ---- PHASE BAR ANIMATIONS -------------------------------- */
  const phaseBars = document.querySelectorAll('.phase-bar-fill');
  phaseBars.forEach(function (bar) {
    const w = parseFloat(bar.dataset.width) || 0;
    requestAnimationFrame(() => {
      setTimeout(() => { bar.style.width = w + '%'; }, 450);
    });
  });


  /* ---- ACTIVE NAV LINK ON SCROLL --------------------------- */
  const sections = document.querySelectorAll('[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScroll () {
    let current = '';
    sections.forEach(function (section) {
      const top = section.getBoundingClientRect().top;
      if (top <= 80) current = section.id;
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  /* ---- MOBILE NAV TOGGLE ----------------------------------- */
  const toggle = document.getElementById('mobileToggle');
  const navLinksEl = document.querySelector('.nav-links');

  if (toggle && navLinksEl) {
    toggle.addEventListener('click', function () {
      navLinksEl.classList.toggle('open');
    });

    // Close on link click
    navLinksEl.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinksEl.classList.remove('open');
      });
    });
  }


  /* ---- SCROLL REVEAL --------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.tl-event, .phase-card, .metric, .deliverable, .issue-row'
  );

  if ('IntersectionObserver' in window) {
    revealTargets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '';
          entry.target.style.transform = '';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06 });

    revealTargets.forEach(el => observer.observe(el));
  }

});