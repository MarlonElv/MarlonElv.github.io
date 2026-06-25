/* ========================================================
   LOGISTICS & MATERIAL PAGE JAVASCRIPT
   Tab switching, date functionality, mobile nav
   ======================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- UPDATE DATE --------------------------------- */
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  ['report-date', 'footer-date'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.textContent = today;
  });

  /* ---- TAB FUNCTIONALITY ----------------------------- */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabButtons.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const tabName = this.dataset.tab;

        // Validate tab exists
        const selectedTab = document.getElementById(tabName);
        if (!selectedTab) return;

        // Hide all tabs & remove active class from buttons
        tabContents.forEach(tab => {
          tab.classList.remove('active');
        });

        tabButtons.forEach(b => {
          b.classList.remove('active');
        });

        // Show selected tab & activate button
        selectedTab.classList.add('active');
        this.classList.add('active');

        // Scroll to top of tab content
        selectedTab.scrollIntoView({ behavior: 'smooth', 
                                    block: 'start' });
      });
    });
  }

  /* ---- MOBILE MENU TOGGLE ----------------------- */
  const toggle = document.getElementById('mobileToggle');
  const navLinksEl = document.querySelector('.nav-links');

  if (toggle && navLinksEl) {
    // Toggle menu on button click
    toggle.addEventListener('click', function () {
      navLinksEl.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinksEl.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinksEl.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      const isToggle = toggle.contains(e.target);
      const isNav = navLinksEl.contains(e.target);

      if (!isToggle && !isNav && 
          navLinksEl.classList.contains('open')) {
        navLinksEl.classList.remove('open');
      }
    });
  }

  /* ---- NAVIGATION ACTIVE STATE ON SCROLL ------- */
  const navLinks = document.querySelectorAll('.nav-link');
  if (navLinks.length > 0) {
    window.addEventListener('scroll', function () {
      const scrollPos = window.scrollY;

      navLinks.forEach(link => {
        link.classList.remove('active');
      });

      // Fallback: highlight first link
      if (navLinks[0]) {
        navLinks[0].classList.add('active');
      }
    });
  }

});