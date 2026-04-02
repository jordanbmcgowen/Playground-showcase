// ============================================
// Dynamic device layout (desktop)
// Automatically positions devices in rows of 3
// with staggered y-offsets and alternating rotations.
// Scales to any number of devices — just add HTML.
// ============================================
(function () {
  var COLS = 3;
  var ROW_GAP = 20;        // % between row start positions
  var START_Y = 2;         // % from top for first row
  var Y_JITTER = [0, 3, -1];
  var ROTATIONS = [-1.5, -6, 2, 4, -3, 6, 5, -3, -4, -5, 3, -2];

  function layout() {
    var floor = document.getElementById('deviceFloor');
    if (!floor) return;
    var devices = Array.from(floor.querySelectorAll('.device'));
    if (!devices.length) return;

    // Mobile: clear inline positioning, flexbox handles layout
    if (window.innerWidth < 768) {
      devices.forEach(function (d) {
        d.style.removeProperty('--x');
        d.style.removeProperty('--y');
        d.style.removeProperty('--rot');
      });
      floor.style.removeProperty('min-height');
      return;
    }

    var floorW = floor.offsetWidth;

    // Group devices into rows
    var rows = [];
    for (var i = 0; i < devices.length; i += COLS) {
      rows.push(devices.slice(i, i + COLS));
    }

    rows.forEach(function (row, ri) {
      // Read actual rendered widths (CSS sets explicit sizes per device type)
      var widths = row.map(function (d) { return d.offsetWidth; });
      var total = widths.reduce(function (a, b) { return a + b; }, 0);
      var gap = (floorW - total) / (row.length + 1);

      var x = gap;
      row.forEach(function (d, ci) {
        var gi = ri * COLS + ci;
        d.style.setProperty('--x', ((x / floorW) * 100).toFixed(1) + '%');
        d.style.setProperty('--y', (START_Y + ri * ROW_GAP + Y_JITTER[ci % Y_JITTER.length]) + '%');
        d.style.setProperty('--rot', ROTATIONS[gi % ROTATIONS.length] + 'deg');
        x += widths[ci] + gap;
      });
    });

    // Scale floor height to fit all rows + room for tallest device
    floor.style.minHeight = 'max(100dvh, ' + (rows.length * 300) + 'px)';
  }

  // Debounced resize handler
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 150);
  });

  layout();
})();


// ============================================
// GitHub link click isolation
// Prevents clicks on the GitHub icon from bubbling
// up to the parent device link (which navigates to
// the live site).
// ============================================
(function () {
  document.querySelectorAll('.device__github, .device__link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  });
})();


// ============================================
// Scroll-linked screenshot scrolling within devices
// As the user scrolls the page, the screenshots
// inside each device scroll proportionally, creating
// the illusion of browsing through each site.
// ============================================
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const devices = document.querySelectorAll('.device[data-scroll-speed]');
  if (!devices.length) return;

  // For each device, compute how far its screenshot can scroll
  // within the visible screen area, then map page scroll to that range.
  function setupScrollableScreenshots() {
    const entries = [];

    devices.forEach((device) => {
      const screenshot = device.querySelector('.device__screenshot');
      const clip = device.querySelector('.device__screen-clip');
      if (!screenshot || !clip) return;

      entries.push({ device, screenshot, clip });
    });

    return entries;
  }

  const entries = setupScrollableScreenshots();

  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const scrollTop = window.scrollY;

      entries.forEach(({ device, screenshot, clip }) => {
        const speed = parseFloat(device.dataset.scrollSpeed) || 0.1;

        // Get the actual rendered dimensions
        const clipHeight = clip.offsetHeight;
        const screenshotHeight = screenshot.offsetHeight;

        // How far the screenshot can travel
        const maxTravel = screenshotHeight - clipHeight;

        if (maxTravel <= 0) return; // screenshot fits entirely, no scroll needed

        // Scroll the screenshot proportional to raw scrollTop so the rate
        // (px of screenshot travel per px of page scroll) is identical on
        // both mobile (tall stacked layout) and desktop (short scattered layout).
        const travel = Math.min(scrollTop * speed, maxTravel);
        screenshot.style.transform = `translateY(${-travel}px)`;
      });

      ticking = false;
    });
  }

  // Listen to scroll
  window.addEventListener('scroll', onScroll, { passive: true });

  // Also run once on load
  onScroll();
})();


// ============================================
// Subtle parallax on mouse move (desktop only)
// ============================================
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const floor = document.getElementById('deviceFloor');
  if (!floor) return;

  let ticking = false;

  document.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      const devices = floor.querySelectorAll('.device');
      devices.forEach((device, i) => {
        const depth = (i % 3 + 1) * 0.5;
        const moveX = x * depth * 3;
        const moveY = y * depth * 2;

        device.style.setProperty('--parallax-x', `${moveX}px`);
        device.style.setProperty('--parallax-y', `${moveY}px`);
      });

      ticking = false;
    });
  });

  // Apply parallax via CSS translate property (additive to transform)
  const style = document.createElement('style');
  style.textContent = `
    @media (min-width: 768px) {
      .device {
        translate: var(--parallax-x, 0) var(--parallax-y, 0);
      }
    }
  `;
  document.head.appendChild(style);
})();


// ============================================
// Staggered fade-in on load
// ============================================
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const devices = document.querySelectorAll('.device');

  devices.forEach((device, i) => {
    device.style.opacity = '0';
    device.style.transform += ' translateY(20px)';

    setTimeout(() => {
      device.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      device.style.opacity = '1';
      device.style.transform = device.style.transform.replace(' translateY(20px)', '');

      // Clean up inline styles after animation so CSS handles hover
      setTimeout(() => {
        device.style.opacity = '';
        device.style.transform = '';
        device.style.transition = '';
      }, 700);
    }, 150 + i * 120);
  });
})();
