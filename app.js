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


// ============================================
// Napkin note: collapse / expand toggle
// ============================================
(function () {
  const napkin = document.getElementById('napkin');
  const toggle = document.getElementById('napkinToggle');
  if (!napkin || !toggle) return;

  toggle.addEventListener('click', () => {
    const collapsed = napkin.classList.toggle('is-collapsed');
    toggle.textContent = collapsed ? '✏' : '✕';
    toggle.setAttribute('aria-label', collapsed ? 'Expand note' : 'Collapse note');
  });
})();
