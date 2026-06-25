/* ============================================================
   QUALTOR PAGE JAVASCRIPT
   Quality tracking functionality
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