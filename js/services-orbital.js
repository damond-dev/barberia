// Radial Orbital Services - Based on original prompt
const servicesData = [
  { id: 1, title: "Corte clásico", price: "€18", icon: "✂️", desc: "Técnica precisa con tijera y máquina. Fade, pompadour, undercut o el estilo que prefieras.", duration: "45 min" },
  { id: 2, title: "Arreglo barba", price: "€12", icon: "🪒", desc: "Perfilado, aceite y peine. Definimos tu barba con la precisión de un artista.", duration: "30 min" },
  { id: 3, title: "Paquete completo", price: "€28", icon: "⭐", desc: "Corte + barba + tratamiento capilar. La experiencia Reyes completa.", duration: "75 min" },
  { id: 4, title: "Tratamiento", price: "€15", icon: "💆", desc: "Masaje cuero cabelludo, mascarilla y secado con productos premium.", duration: "35 min" },
  { id: 5, title: "Corte infantil", price: "€12", icon: "👦", desc: "Cortes para los más pequeños. Ambiente seguro y divertido.", duration: "25 min" },
  { id: 6, title: "Coloración", price: "€25", icon: "🎨", desc: "Tintes, decoloraciones y mechas con productos de primera calidad.", duration: "90 min" },
];

(function() {
  let rotationAngle = 0;
  let isExpanded = false;
  let expandedId = null;
  let autoRotate = true;

  function init() {
    const section = document.getElementById('servicios');
    if (!section) return;

    const grid = section.querySelector('.servicios-grid');
    if (grid) grid.style.display = 'none';

    const wrapper = document.createElement('div');
    wrapper.className = 'orbital-outer';
    wrapper.innerHTML = `
      <h2 class="section-title">Servicios</h2>
      <p class="orbital-hint">Toca un servicio para ver detalles</p>
      <div class="orbital-container" id="orbital-container">
        <div class="orbital-center" id="orbital-center">
          <img src="https://res.cloudinary.com/dsqjvn7xw/image/upload/v1779153664/Logo_Corona_y_Navaja_a0ccxd.png" alt="Barbería Reyes">
        </div>
        <div class="orbital-ring" id="orbital-ring"></div>
        <div class="orbital-orbit" id="orbital-orbit">
          ${servicesData.map((item, index) => `
            <div class="orbital-item" data-id="${item.id}" data-index="${index}">
              <div class="orbital-btn">
                <span class="orbital-icon">${item.icon}</span>
              </div>
              <div class="orbital-card" data-id="${item.id}">
                <button class="card-close">×</button>
                <div class="card-header">
                  <span class="card-icon">${item.icon}</span>
                  <span class="card-price">${item.price}</span>
                </div>
                <h3 class="card-title">${item.title}</h3>
                <p class="card-desc">${item.desc}</p>
                <div class="card-duration">⏱️ ${item.duration}</div>
                <a href="reservas.html" class="card-btn">Reservar</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="orbital-features">
        <div class="orb-feature">🎯 Profesionales certificados</div>
        <div class="orb-feature">🧴 Productos premium</div>
        <div class="orb-feature">⏱️ Sin cita previa</div>
        <div class="orb-feature">🏆 8 años de experiencia</div>
      </div>
    `;
    
    section.appendChild(wrapper);

    // Click on items
    document.querySelectorAll('.orbital-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(item.dataset.id);
        toggleItem(id);
      });
    });

    // Click on close buttons
    document.querySelectorAll('.card-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAll();
      });
    });

    startRotation();
  }

  function toggleItem(id) {
    if (isExpanded && expandedId === id) {
      closeAll();
      return;
    }

    // Close any open first
    document.querySelectorAll('.orbital-item').forEach(el => {
      el.classList.remove('active', 'inactive');
      el.querySelector('.orbital-card')?.classList.remove('show');
    });

    const item = document.querySelector(`.orbital-item[data-id="${id}"]`);
    if (item) {
      const index = parseInt(item.dataset.index);
      
      // Rotate the entire ring so selected item is at top (270 degrees = top)
      const targetAngle = (index / servicesData.length) * 360;
      rotationAngle = 270 - targetAngle;
      
      isExpanded = true;
      expandedId = id;
      autoRotate = false;
      
      item.classList.add('active');
      item.querySelector('.orbital-card')?.classList.add('show');
      
      updatePositions();
    }
  }

  function closeAll() {
    isExpanded = false;
    expandedId = null;
    autoRotate = true;

    document.querySelectorAll('.orbital-item').forEach(el => {
      el.classList.remove('active', 'inactive');
      el.querySelector('.orbital-card')?.classList.remove('show');
    });

    updatePositions();
  }

  function updatePositions() {
    const items = document.querySelectorAll('.orbital-item');
    const total = servicesData.length;
    const radius = 180;

    items.forEach((item, index) => {
      const angle = ((index / total) * 360 + rotationAngle) * (Math.PI / 180);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      item.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  function startRotation() {
    function animate() {
      if (autoRotate) {
        rotationAngle = (rotationAngle + 0.4) % 360;
        updatePositions();
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  document.addEventListener('click', (e) => {
    if (isExpanded && !e.target.closest('.orbital-item') && !e.target.closest('.orbital-card')) {
      closeAll();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();