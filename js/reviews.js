// Reviews Management
(function() {
  const STORAGE_KEY = 'barberia_reyes_resenas';
  
  // Initial static reviews
  const staticReviews = [
    { name: 'Mario R.', text: 'El mejor fade que me han hecho en la vida. Carlos me dejó exactamente como lo quería. El ambiente es increíble y el precio muy justo para la calidad que ofrecen.', stars: 5, date: 'Cliente habitual', type: 'static' },
    { name: 'Javier L.', text: 'Llevo viniendo 3 años y nunca me han decepcionado. La barba siempre queda perfecta y el trato es de primera. Mi sitio de confianza sin duda.', stars: 5, date: 'Cliente desde 2021', type: 'static' },
    { name: 'Andrea Pérez', text: 'Encontré Reyes por casualidad y ahora no voy a otro lado. El ambiente, la música, los cocktails que ofrecen... es toda una experiencia, no solo un corte.', stars: 5, date: 'Hace 3 semanas', type: 'static' }
  ];

  let currentRating = 0;

  function init() {
    initStarRating();
    initReviewForm();
    initViewAllButton();
    loadAllReviews();
  }

  // Star rating interactive
  function initStarRating() {
    const stars = document.querySelectorAll('#starsInput .star');
    const ratingInput = document.getElementById('ratingValue');
    
    stars.forEach(star => {
      star.addEventListener('mouseover', () => {
        const value = parseInt(star.dataset.value);
        highlightStars(value);
      });
      
      star.addEventListener('mouseout', () => {
        highlightStars(currentRating);
      });
      
      star.addEventListener('click', () => {
        const value = parseInt(star.dataset.value);
        currentRating = value;
        ratingInput.value = value;
        highlightStars(value);
      });
    });
  }

  function highlightStars(count) {
    const stars = document.querySelectorAll('#starsInput .star');
    stars.forEach((star, index) => {
      if (index < count) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }

  // Review form submission
  function initReviewForm() {
    const form = document.getElementById('reviewForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const rating = parseInt(document.getElementById('ratingValue').value);
      const name = document.getElementById('reviewName').value.trim();
      const text = document.getElementById('reviewText').value.trim();

      if (!name || !text) {
        alert('Por favor, completa todos los campos.');
        return;
      }

      // Save review only if 3+ stars
      if (rating >= 3) {
        saveReview({ name, text, stars: rating, date: 'Hoy', type: 'user' });
        loadAllReviews();
      }

      // Reset form
      form.reset();
      currentRating = 0;
      highlightStars(0);
      
      // Always show success message
      alert('¡Gracias! Tu reseña ha sido publicada.');
    });
  }

  function saveReview(review) {
    let reviews = getReviews();
    reviews.push(review);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }

  function getReviews() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // View all reviews button
  function initViewAllButton() {
    const btn = document.getElementById('viewAllReviewsBtn');
    const section = document.getElementById('allReviewsSection');
    const closeBtn = document.getElementById('closeReviewsBtn');

    if (btn && section) {
      btn.addEventListener('click', () => {
        section.classList.add('show');
        btn.style.display = 'none';
      });
    }

    if (closeBtn && section) {
      closeBtn.addEventListener('click', () => {
        section.classList.remove('show');
        if (btn) btn.style.display = 'flex';
      });
    }
  }

  // Load and display all reviews
  function loadAllReviews() {
    const container = document.getElementById('allReviewsList');
    if (!container) return;

    // Combine static + user reviews
    const userReviews = getReviews();
    const allReviews = [...userReviews, ...staticReviews];

    if (allReviews.length === 0) {
      container.innerHTML = '<p class="no-reviews">No hay reseñas aún. ¡Sé el primero en compartir tu experiencia!</p>';
      return;
    }

    container.innerHTML = allReviews.map((review, index) => `
      <div class="reseña-card reseña-new" style="animation: fadeInUp 0.5s ease ${index * 0.1}s both;">
        <div class="reseña-stars">
          ${renderStars(review.stars)}
        </div>
        <p class="reseña-text">"${review.text}"</p>
        <div class="reseña-author">
          <div class="reseña-avatar">${getInitials(review.name)}</div>
          <div>
            <div class="reseña-author-name">${review.name}</div>
            <div class="reseña-date">${review.date}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderStars(count) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= count) {
        html += '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
      } else {
        html += '<svg viewBox="0 0 24 24" class="empty"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke="currentColor" stroke-width="1"/></svg>';
      }
    }
    return html;
  }

  function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();