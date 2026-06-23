// ── FIELD PROJECT STATUS — main.js ──

window.addEventListener('DOMContentLoaded', () => {

  // Overall hero bar
  setTimeout(() => {
    document.getElementById('mainBar').classList.add('animate');
  }, 300);

  // SVG gauge dial
  const gaugeFill = document.getElementById('gaugeFill');
  if (gaugeFill) {
    const totalLen   = 201;   // approximate arc length in SVG units
    const pct        = 0.68;  // overall completion percentage
    const targetOffset = totalLen - (totalLen * pct);
    setTimeout(() => {
      gaugeFill.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.22, 1, 0.36, 1)';
      gaugeFill.style.strokeDashoffset = targetOffset;
    }, 400);
  }

  // Phase progress bars — animate immediately on load
  document.querySelectorAll('.phase-bar-fill').forEach(el => {
    const w = el.dataset.width;
    setTimeout(() => {
      el.style.width = w + '%';
    }, 500);
  });

  // Intersection observer — re-trigger bar fill when cards scroll into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.phase-bar-fill');
        if (fill && !fill.dataset.animated) {
          fill.dataset.animated = 'true';
          fill.style.width = fill.dataset.width + '%';
        }
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.phase-card').forEach(card => observer.observe(card));

});