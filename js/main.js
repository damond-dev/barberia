// ── Mobile menu ──
function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ── Nav scroll ──
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── Scroll Reveal Animation (repeats on scroll up & down) ──
function initScrollReveal() {
  // Select all reveal classes
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade');
  
  if (reveals.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-50px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class when element enters viewport
        entry.target.classList.add('visible');
      } else {
        // Remove visible class when element leaves viewport - enables re-animation
        entry.target.classList.remove('visible');
      }
    });
  }, observerOptions);

  // Also animate elements that are already in viewport on load
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    }
    observer.observe(el);
  });
}

// ── Hero entrance ──
function initHeroEntrance() {
  const eyebrow = document.getElementById('hero-eyebrow');
  const title = document.getElementById('hero-title');
  const subtitle = document.getElementById('hero-subtitle');
  const actions = document.getElementById('hero-actions');
  const stats = document.getElementById('hero-stats');

  setTimeout(() => eyebrow && eyebrow.classList.add('visible'), 300);
  setTimeout(() => title && title.classList.add('visible'), 500);
  setTimeout(() => subtitle && subtitle.classList.add('visible'), 700);
  setTimeout(() => actions && actions.classList.add('visible'), 900);
  setTimeout(() => {
    if (stats) {
      stats.classList.add('visible');
      initCountUp();
    }
  }, 1100);
}

// ── Counter animation ──
function initCountUp() {
  const counters = document.querySelectorAll('.hero-stat-number');
  const speed = 200;

  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const isDecimal = target % 1 !== 0;
    
    const updateCount = () => {
      const current = parseFloat(counter.innerText);
      const increment = target / (speed / 16);
      
      if (current < target) {
        counter.innerText = isDecimal 
          ? Math.min(current + increment, target).toFixed(1)
          : Math.ceil(current + increment);
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = isDecimal ? target.toFixed(1) : target;
      }
    };
    
    updateCount();
  });
}

// ── Smooth anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Gallery tilt effect ──
function initGalleryTilt() {
  const items = document.querySelectorAll('.galeria-item');
  items.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}

// ── Init on DOM ready ──
document.addEventListener('DOMContentLoaded', () => {
  initHeroEntrance();
  initScrollReveal();
  initGalleryTilt();
  
  // Re-run scroll reveal on scroll (for elements that were hidden initially)
  window.addEventListener('scroll', () => {
    const reveals = document.querySelectorAll('.reveal:not(.visible)');
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        el.classList.add('visible');
      }
    });
  });
});