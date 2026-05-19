// Animated Theme Toggler - Vanilla JS version
(function() {
  const TOGGLE_ID = 'theme-toggle-btn';
  let isDark = false;

  function init() {
    // Check saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      isDark = savedTheme === 'dark';
    } else {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    }

    createToggleButton();
  }

  function createToggleButton() {
    const btn = document.createElement('button');
    btn.id = TOGGLE_ID;
    btn.className = 'theme-toggle-btn';
    btn.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path class="moon-icon" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
    btn.setAttribute('aria-label', 'Cambiar tema');
    btn.setAttribute('title', 'Switch mode');
    
    btn.addEventListener('click', toggle);
    
    // Add to nav
    const nav = document.querySelector('.nav');
    if (nav) {
      const navRight = document.createElement('div');
      navRight.className = 'nav-right';
      navRight.appendChild(btn);
      nav.appendChild(navRight);
    }

    updateIcon();
  }

  function toggle() {
    isDark = !isDark;
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    playSound();
    updateIcon();
  }

  function updateIcon() {
    const btn = document.getElementById(TOGGLE_ID);
    if (!btn) return;
    
    const svg = btn.querySelector('svg');
    
    if (isDark) {
      // Currently dark - show sun (click to go light)
      svg.setAttribute('fill', 'currentColor');
      svg.setAttribute('stroke', 'none');
      svg.innerHTML = '<circle cx="12" cy="12" r="5" /><g stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></g>';
    } else {
      // Currently light - show moon (click to go dark)
      svg.setAttribute('fill', 'currentColor');
      svg.setAttribute('stroke', 'none');
      svg.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />';
    }
  }

  function playSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const rate = ctx.sampleRate;
      const len = Math.floor(rate * 0.006);
      const buf = ctx.createBuffer(1, len, rate);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        const t = i / len;
        const sine = Math.sin(2 * Math.PI * 3400 * t);
        const noise = Math.random() * 2 - 1;
        ch[i] = (sine * 0.6 + noise * 0.4) * (1 - t) ** 3;
      }
      const src = ctx.createBufferSource();
      const gain = ctx.createGain();
      src.buffer = buf;
      gain.gain.value = 0.08;
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    } catch {}
  }

  // Init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();