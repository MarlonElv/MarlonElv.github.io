/* ============================================================
   EASELY 1 & 2 — main.js
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

  /* ---- DUAL HERO BARS -------------------------------------- */
  document.querySelectorAll('.dual-bar-fill').forEach(function (bar) {
    const w = parseFloat(bar.dataset.width) || 0;
    requestAnimationFrame(() => setTimeout(() => { bar.style.width = w + '%'; }, 200));
  });

  /* ---- GAUGE ----------------------------------------------- */
  const gaugeFill  = document.getElementById('gaugeFill');
  const gaugeLabel = document.getElementById('gaugeLabel');
  const COMBINED   = 84;
  if (gaugeFill) {
    const offset = 201 - (201 * COMBINED / 100);
    if (gaugeLabel) gaugeLabel.textContent = COMBINED + '%';
    requestAnimationFrame(() => {
      setTimeout(() => {
        gaugeFill.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)';
        gaugeFill.style.strokeDashoffset = offset;
      }, 300);
    });
  }

  /* ---- PHASE BAR ANIMATIONS -------------------------------- */
  document.querySelectorAll('.phase-bar-fill').forEach(function (bar) {
    const w = parseFloat(bar.dataset.width) || 0;
    requestAnimationFrame(() => setTimeout(() => { bar.style.width = w + '%'; }, 450));
  });

  /* ============================================================
     HORIZONTAL TIMELINE
     ============================================================ */

  // --- Parse all vertical events ---
  const vertEvents = Array.from(
    document.querySelectorAll('#verticalLog .tl-event[id]')
  );

  // Date parsing — handles "M/D/YYYY", "Throughout" etc.
  function parseDate(str) {
    if (!str || str.toLowerCase().includes('throughout')) return null;
    // Strip suffix like "· LATEST REPORT"
    const clean = str.split('·')[0].trim();
    const parts  = clean.split('/');
    if (parts.length === 3) {
      return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
    }
    return null;
  }

  // Build event data array
  const events = vertEvents.map(function (el) {
    const dateEl  = el.querySelector('.tl-date');
    const titleEl = el.querySelector('.tl-title');
    const deptEl  = el.querySelector('.tl-dept');
    const dateStr = dateEl ? dateEl.textContent.trim() : '';
    return {
      el:       el,
      id:       el.id,
      dept:     el.dataset.dept || 'site',
      dateStr:  dateStr,
      date:     parseDate(dateStr),
      title:    titleEl ? titleEl.textContent.trim() : '',
      deptText: deptEl  ? deptEl.textContent.trim()  : ''
    };
  });

  // Filter to only dated events for the horizontal strip
  const datedEvents = events.filter(e => e.date !== null);

  if (datedEvents.length === 0) return;

  // Date range
  const minDate = new Date(Math.min(...datedEvents.map(e => e.date)));
  const maxDate = new Date(Math.max(...datedEvents.map(e => e.date)));
  const totalMs = maxDate - minDate || 1;

  // Layout constants
  const DOT_SIZE   = 18;
  const PAD_LEFT   = 48;
  const PAD_RIGHT  = 48;
  const MIN_WIDTH  = 1800;  // px — wider minimum so months are well spaced
  const PER_DAY    = 6.5;   // px per day — more stretch between incidents

  const spanDays  = totalMs / 86400000;
  const trackW    = Math.max(MIN_WIDTH, spanDays * PER_DAY + PAD_LEFT + PAD_RIGHT);

  const htlScroll = document.getElementById('htlScroll');
  const htlDots   = document.getElementById('htlDots');
  const htlMonths = document.getElementById('htlMonths');
  const tooltip   = document.getElementById('htlTooltip');

  if (!htlScroll || !htlDots || !htlMonths) return;

  // Set container widths
  htlDots.style.width   = trackW + 'px';
  htlMonths.style.width = trackW + 'px';
  document.querySelector('.htl-track-wrap').style.width = trackW + 'px';

  // --- Build dots ---
  // Track x positions per date string to stagger overlapping dots
  const datePositions = {};

  datedEvents.forEach(function (ev) {
    const pct = (ev.date - minDate) / totalMs;
    const x   = PAD_LEFT + pct * (trackW - PAD_LEFT - PAD_RIGHT);

    const dateKey = ev.date.toDateString();
    if (!datePositions[dateKey]) datePositions[dateKey] = 0;
    const stackIndex = datePositions[dateKey];
    datePositions[dateKey]++;

    const dot = document.createElement('button');
    dot.className  = 'htl-dot ' + ev.dept;
    dot.style.left = x + 'px';
    dot.setAttribute('aria-label', ev.dateStr + ': ' + ev.title);
    dot.dataset.incId = ev.id;

    // Alternate above/below spine for same-date stacking (spine is at top:24px)
    if (stackIndex % 2 === 1) dot.classList.add('below');
    else if (stackIndex > 0)  dot.classList.add('above');

    // Tooltip on hover
    dot.addEventListener('mouseenter', function (e) {
      tooltip.innerHTML =
        '<div class="htl-tooltip-date">' + ev.dateStr + '</div>' +
        '<div class="htl-tooltip-title">' + ev.title + '</div>' +
        '<span class="htl-tooltip-dept ' + ev.dept + '">' + ev.deptText + '</span>';
      tooltip.classList.add('visible');
      positionTooltip(e);
    });
    dot.addEventListener('mousemove', positionTooltip);
    dot.addEventListener('mouseleave', function () {
      tooltip.classList.remove('visible');
    });

    // Click — scroll to vertical entry
    dot.addEventListener('click', function () {
      // Remove previous highlight
      document.querySelectorAll('.tl-event.htl-highlight').forEach(function (el) {
        el.classList.remove('htl-highlight');
      });
      // Remove previous active dot
      document.querySelectorAll('.htl-dot.htl-active').forEach(function (d) {
        d.classList.remove('htl-active');
      });

      dot.classList.add('htl-active');
      tooltip.classList.remove('visible');

      const target = document.getElementById(ev.id);
      if (target) {
        const navH  = 52;
        const extra = 16;
        const top   = target.getBoundingClientRect().top + window.scrollY - navH - extra;
        window.scrollTo({ top: top, behavior: 'smooth' });

        target.classList.add('htl-highlight');
        setTimeout(function () {
          target.classList.remove('htl-highlight');
        }, 2500);
      }
    });

    htlDots.appendChild(dot);
    ev.dot = dot; // back-reference for filtering
  });

  // --- Build month labels ---
  const months = [];
  const cursor = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  while (cursor <= maxDate) {
    months.push(new Date(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }

  months.forEach(function (m) {
    const pct = (m - minDate) / totalMs;
    const x   = PAD_LEFT + pct * (trackW - PAD_LEFT - PAD_RIGHT);

    const tick = document.createElement('div');
    tick.className  = 'htl-month-tick';
    tick.style.left = x + 'px';
    htlMonths.appendChild(tick);

    const label = document.createElement('div');
    label.className  = 'htl-month-label';
    label.style.left = x + 'px';
    label.textContent = m.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    htlMonths.appendChild(label);
  });

  // --- Tooltip position ---
  function positionTooltip(e) {
    const tw = tooltip.offsetWidth  || 240;
    const th = tooltip.offsetHeight || 80;
    let   lx = e.clientX + 14;
    let   ly = e.clientY - th - 10;
    if (lx + tw > window.innerWidth  - 10) lx = e.clientX - tw - 14;
    if (ly < 10) ly = e.clientY + 14;
    tooltip.style.left = lx + 'px';
    tooltip.style.top  = ly + 'px';
  }

  // --- Drag-to-scroll on the horizontal strip ---
  let isDown = false, startX = 0, scrollL = 0;

  htlScroll.addEventListener('mousedown', function (e) {
    isDown  = true;
    startX  = e.pageX - htlScroll.offsetLeft;
    scrollL = htlScroll.scrollLeft;
    htlScroll.style.userSelect = 'none';
  });

  document.addEventListener('mouseup',   function () { isDown = false; htlScroll.style.userSelect = ''; });
  document.addEventListener('mouseleave', function () { isDown = false; });
  htlScroll.addEventListener('mousemove', function (e) {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - htlScroll.offsetLeft;
    const walk = (x - startX) * 1.2;
    htlScroll.scrollLeft = scrollL - walk;
  });

  // --- Scroll to show roughly the middle of the timeline on load ---
  setTimeout(function () {
    // Start at the beginning so the user sees the full range
    htlScroll.scrollLeft = 0;
  }, 400);

  /* ============================================================
     FILTER BUTTONS
     ============================================================ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const tlEvents   = document.querySelectorAll('#verticalLog .tl-event');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Vertical events
      tlEvents.forEach(function (ev) {
        if (filter === 'all' || ev.dataset.dept === filter) {
          ev.classList.remove('filtered-out');
        } else {
          ev.classList.add('filtered-out');
        }
      });

      // Horizontal dots
      datedEvents.forEach(function (ev) {
        if (!ev.dot) return;
        if (filter === 'all' || ev.dept === filter) {
          ev.dot.classList.remove('htl-filtered');
        } else {
          ev.dot.classList.add('htl-filtered');
        }
      });
    });
  });

  /* ============================================================
     ACTIVE NAV + MOBILE TOGGLE
     ============================================================ */
  const navLinks   = document.querySelectorAll('.nav-link');
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

  const toggle     = document.getElementById('mobileToggle');
  const navLinksEl = document.querySelector('.nav-links');
  if (toggle && navLinksEl) {
    toggle.addEventListener('click', function () { navLinksEl.classList.toggle('open'); });
    navLinksEl.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { navLinksEl.classList.remove('open'); });
    });
  }

  /* ---- SCROLL REVEAL --------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.tl-event, .phase-card, .metric, .deliverable, .issue-row'
  );
  if ('IntersectionObserver' in window) {
    revealTargets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(6px)';
      el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    });
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '';
          entry.target.style.transform = '';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.04 });
    revealTargets.forEach(el => obs.observe(el));
  }

});