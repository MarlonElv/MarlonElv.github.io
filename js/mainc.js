/* ============================================================
   EASELY I & II — Mechanical Constraints JS
   Collapsible sections + Animations + Tab switching
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
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach(function (header) {
    // Skip project dividers
    if (header.classList.contains('project-divider-mv')) return;
    
    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'section-toggle';
    toggleBtn.innerHTML = '<span class="toggle-icon">▼</span>';
    toggleBtn.setAttribute('aria-label', 'Toggle section');
    header.insertBefore(toggleBtn, header.firstChild);
    
    // Find and collect content until next section-header
    let content = [];
    let current = header.nextElementSibling;
    while (current && !current.classList.contains('section-header') && current.tagName !== 'FOOTER') {
      content.push(current);
      current = current.nextElementSibling;
    }
    
    // Wrap content in expandable container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'section-content';
    content.forEach(function (el) { contentContainer.appendChild(el); });
    header.parentNode.insertBefore(contentContainer, header.nextSibling);
    
    // Toggle on button click
    toggleBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      contentContainer.classList.toggle('expanded');
      toggleBtn.classList.toggle('collapsed');
    });
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

  /* ---- TAB FUNCTIONALITY --------------------------------- */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const tabName = this.dataset.tab;
      
      // Hide all tabs
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });
      
      // Remove active class from all buttons
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
      });
      
      // Show selected tab and activate button
      document.getElementById(tabName).classList.add('active');
      this.classList.add('active');
    });
  });

});