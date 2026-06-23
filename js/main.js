/* ============================================================
   EASELY 1 & 2 — main.js
   Handles:
     - Progress bar animations (hero + phase cards)
     - Gauge arc animation
     - Dynamic date injection
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- DYNAMIC DATE ----------------------------------------
     Injects today's date into the header and footer.
     Remove or override if you prefer a fixed date.
  ------------------------------------------------------------ */
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
  const reportDateEl = document.getElementById('report-date');
  const footerDateEl = document.getElementById('footer-date');
  if (reportDateEl) reportDateEl.textContent = today;
  if (footerDateEl) footerDateEl.textContent = today;


  /* ---- HERO PROGRESS BAR -----------------------------------
     Reads data-width from #mainBar and animates to that width.
     To update completion: set data-width="68" (for 68%), etc.
  ------------------------------------------------------------ */
  const mainBar = document.getElementById('mainBar');
  if (mainBar) {
    const targetWidth = parseFloat(mainBar.dataset.width) || 0;

    // Update hero percentage displays
    const heroPct = document.querySelector('.hero-heading');
    const overallPct = document.querySelector('.overall-pct');
    if (overallPct) overallPct.textContent = targetWidth + '%';

    // Animate after a short delay so the transition is visible on load
    requestAnimationFrame(() => {
      setTimeout(() => {
        mainBar.style.width = targetWidth + '%';
      }, 200);
    });
  }


  /* ---- GAUGE ARC -------------------------------------------
     Reads the same data-width from #mainBar to drive the SVG arc.
     Total arc path length = ~201px for this viewBox.
  ------------------------------------------------------------ */
  const gaugeFill  = document.getElementById('gaugeFill');
  const gaugeLabel = document.getElementById('gaugeLabel');

  if (gaugeFill && mainBar) {
    const pct = parseFloat(mainBar.dataset.width) || 0;
    const arcLength = 201;
    const offset = arcLength - (arcLength * pct / 100);

    if (gaugeLabel) gaugeLabel.textContent = Math.round(pct) + '%';

    requestAnimationFrame(() => {
      setTimeout(() => {
        gaugeFill.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)';
        gaugeFill.style.strokeDashoffset = offset;
      }, 300);
    });
  }


  /* ---- PHASE BAR ANIMATIONS --------------------------------
     Each .phase-bar-fill reads its own data-width attribute.
  ------------------------------------------------------------ */
  const phaseBars = document.querySelectorAll('.phase-bar-fill');
  phaseBars.forEach(function (bar) {
    const w = parseFloat(bar.dataset.width) || 0;
    requestAnimationFrame(() => {
      setTimeout(() => {
        bar.style.width = w + '%';
      }, 400);
    });
  });


  /* ---- SCROLL REVEAL (OPTIONAL) ----------------------------
     Lightly fades in timeline events and phase cards on scroll.
     Remove this block if you prefer no scroll animation.
  ------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll(
    '.tl-event, .phase-card, .metric, .deliverable'
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
    }, { threshold: 0.08 });

    revealTargets.forEach(el => observer.observe(el));
  }

});