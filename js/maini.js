/* ============================================================
   LOGIMAT PAGE JAVASCRIPT
   Tab switching and date functionality
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- UPDATE DATE ---------------------------------------- */
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
  ['report-date', 'footer-date'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.textContent = today;
  });

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

  /* ---- MOBILE MENU TOGGLE ------------------------------ */
  const toggle = document.getElementById('mobileToggle');
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

});