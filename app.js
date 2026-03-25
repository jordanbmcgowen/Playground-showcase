// Subtle parallax on mouse move (desktop only)
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
        
        // Only apply parallax shift, preserve the existing rotation from hover
        device.style.setProperty('--parallax-x', `${moveX}px`);
        device.style.setProperty('--parallax-y', `${moveY}px`);
      });

      ticking = false;
    });
  });

  // Apply parallax via CSS transform addition
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

// Staggered fade-in on load
(function () {
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
