// ============================================
// Scroll-linked screenshot scrolling within devices
// As the user scrolls the device floor horizontally,
// the screenshots inside each device scroll vertically,
// creating the illusion of browsing through each site.
// ============================================
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const floor = document.getElementById('deviceFloor');
  const devices = document.querySelectorAll('.device[data-scroll-speed]');
  if (!devices.length || !floor) return;

  const entries = [];
  devices.forEach((device) => {
    const screenshot = device.querySelector('.device__screenshot');
    const clip = device.querySelector('.device__screen-clip');
    if (!screenshot || !clip) return;
    entries.push({ device, screenshot, clip });
  });

  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const scrollLeft = floor.scrollLeft;

      entries.forEach(({ device, screenshot, clip }) => {
        const speed = parseFloat(device.dataset.scrollSpeed) || 0.1;

        const clipHeight = clip.offsetHeight;
        const screenshotHeight = screenshot.offsetHeight;
        const maxTravel = screenshotHeight - clipHeight;

        if (maxTravel <= 0) return;

        const travel = Math.min(scrollLeft * speed, maxTravel);
        screenshot.style.transform = `translateY(${-travel}px)`;
      });

      ticking = false;
    });
  }

  floor.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


// ============================================
// Redirect vertical wheel events to horizontal scroll
// Lets desktop mouse-wheel users scroll the device floor
// without needing a trackpad or horizontal scrollbar.
// ============================================
(function () {
  const floor = document.getElementById('deviceFloor');
  if (!floor) return;

  floor.addEventListener('wheel', (e) => {
    // If the gesture is already horizontal (trackpad swipe), let it pass through
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

    e.preventDefault();
    floor.scrollBy({
      left: e.deltaY * 1.2,
      behavior: 'auto'   // 'auto' avoids fighting with scroll-snap
    });
  }, { passive: false });
})();


// ============================================
// Staggered fade-in on load
// ============================================
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const devices = document.querySelectorAll('.device');

  // Start all devices invisible
  devices.forEach((device) => {
    device.classList.add('device--hidden');
  });

  // Reveal with staggered delay
  devices.forEach((device, i) => {
    setTimeout(() => {
      device.classList.remove('device--hidden');
      device.classList.add('device--visible');

      // Clean up the transition class once animation completes
      device.addEventListener('transitionend', () => {
        device.classList.remove('device--visible');
      }, { once: true });
    }, 150 + i * 120);
  });
})();
