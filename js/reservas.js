// ── State ──
const state = {
  service: null,
  servicePrice: 0,
  barber: null,
  name: '',
  phone: '',
  notes: ''
};

const serviceNames = { corte: 'Corte clásico', barba: 'Arreglo barba', completo: 'Paquete completo', tratamiento: 'Tratamiento capilar' };
const barberNames = { carlos: 'Carlos Reyes', miguel: 'Miguel García', david: 'David López', javier: 'Javier Sanz' };

// ── EmailJS Config ──
const EMAILJS_PUBLIC_KEY = 'Thre7Wc35WZYRXOSn';
const EMAILJS_SERVICE_ID = 'service_xg12vsg';
const EMAILJS_TEMPLATE_ID = 'template_16iv818';

// ── Hero entrance ──
function initReservasHero() {
  setTimeout(() => {
    const eyebrow = document.getElementById('hero-eyebrow');
    if (eyebrow) eyebrow.classList.add('visible');
  }, 300);
  setTimeout(() => {
    const title = document.getElementById('hero-title');
    if (title) title.classList.add('visible');
  }, 500);
  setTimeout(() => {
    const subtitle = document.getElementById('hero-subtitle');
    if (subtitle) subtitle.classList.add('visible');
  }, 700);
  setTimeout(() => {
    const steps = document.getElementById('steps');
    const formCard = document.getElementById('form-card');
    if (steps) steps.classList.add('visible');
    if (formCard) formCard.classList.add('visible');
  }, 900);
}

// ── Service selection ──
function selectService(el) {
  document.querySelectorAll('.service-option').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  state.service = el.dataset.service;
  state.servicePrice = parseInt(el.dataset.price);
  hideError('service-error');
}

// ── Barber selection ──
function selectBarber(el) {
  document.querySelectorAll('.barber-option').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  state.barber = el.dataset.barber;
}

// ── Step navigation ──
function goStep(n) {
  if (n === 2 && !state.service) {
    showError('service-error');
    return;
  }

  document.querySelectorAll('.step-content').forEach(s => s.style.display = 'none');
  const stepEl = document.getElementById(`step-${n}`);
  if (stepEl) stepEl.style.display = 'block';

  document.querySelectorAll('.step').forEach(step => {
    const num = parseInt(step.dataset.step);
    step.classList.remove('active', 'done');
    if (num === n) step.classList.add('active');
    else if (num < n) step.classList.add('done');
  });

  if (n === 2) updateSummary();
}

function showError(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('show');
}
function hideError(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}

// ── Validation ──
function validateForm() {
  let valid = true;
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!name) { showError('name-error'); valid = false; } else { hideError('name-error'); }
  if (!phone) { showError('phone-error'); valid = false; } else { hideError('phone-error'); }

  return valid;
}

// ── Summary ──
function updateSummary() {
  const list = document.getElementById('summary-list');
  const totalEl = document.getElementById('summary-total');
  if (!list) return;

  let html = `<div class="summary-item"><span>Servicio</span><span>${serviceNames[state.service] || '—'}</span></div>`;
  if (state.barber) {
    html += `<div class="summary-item"><span>Barbero</span><span>${barberNames[state.barber]}</span></div>`;
  }
  list.innerHTML = html;
  if (totalEl) totalEl.textContent = `€${state.servicePrice}`;
}

// ── Submit ──
async function submitReservation() {
  if (!validateForm()) return;

  const loading = document.getElementById('loading');
  loading.classList.add('active');

  state.name = document.getElementById('name').value.trim();
  state.phone = document.getElementById('phone').value.trim();
  state.notes = document.getElementById('notes').value.trim();

  try {
    // Send email with EmailJS
    if (typeof emailjs !== 'undefined') {
      console.log('Enviando email...');
      const result = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        servicio: serviceNames[state.service],
        precio: `€${state.servicePrice}`,
        barbero: state.barber ? barberNames[state.barber] : 'Sin especificar',
        nombre: state.name,
        telefono: state.phone,
        notas: state.notes || 'Sin notas'
      });
      console.log('Email enviado:', result);
    } else {
      console.error('EmailJS no está cargado');
    }
  } catch (e) {
    console.error('Error al enviar email:', e);
  }

  loading.classList.remove('active');

  const formCard = document.getElementById('form-card');
  const steps = document.getElementById('steps');
  const confirmation = document.getElementById('confirmation');
  const confirmDetails = document.getElementById('confirm-details');
  
  if (formCard) formCard.style.display = 'none';
  if (steps) steps.style.display = 'none';

  if (confirmDetails) {
    confirmDetails.innerHTML = `
      <h4>Detalles de tu reserva</h4>
      <p><strong>Servicio:</strong> ${serviceNames[state.service]}</p>
      ${state.barber ? `<p><strong>Barbero:</strong> ${barberNames[state.barber]}</p>` : ''}
      <p><strong>Nombre:</strong> ${state.name}</p>
      <p><strong>Teléfono:</strong> ${state.phone}</p>
      <p><strong>Total:</strong> €${state.servicePrice}</p>
      ${state.notes ? `<p><strong>Notas:</strong> ${state.notes}</p>` : ''}
      <p style="margin-top:16px;padding:12px;background:rgba(217,119,6,0.15);border-radius:6px;border:1px solid rgba(217,119,6,0.3);">
        <strong>Para confirmar tu cita, espera a que el barbero te contacte por WhatsApp.</strong>
      </p>
    `;
  }

  if (confirmation) confirmation.classList.add('show');
  confirmation.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  // Initialize EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
  initReservasHero();
});