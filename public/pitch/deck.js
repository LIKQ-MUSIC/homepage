const slides = document.querySelectorAll('.slide');
const total = slides.length;
const counter = document.querySelector('.counter');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const nav = document.querySelector('.nav');
const stage = document.querySelector('.stage');
let i = 0;

const pad = (n) => String(n).padStart(2, '0');

function show(target) {
  i = Math.max(0, Math.min(total - 1, target));
  slides.forEach((s, n) => s.classList.toggle('active', n === i));
  counter.textContent = pad(i + 1) + ' / ' + pad(total);
  prev.disabled = i === 0;
  next.disabled = i === total - 1;
  history.replaceState(null, '', '#' + (i + 1));
}

// ── Nav auto-hide after 3s inactivity ──
let navTimer = null;
function showNav() {
  nav.classList.remove('nav-hidden');
  clearTimeout(navTimer);
  navTimer = setTimeout(() => nav.classList.add('nav-hidden'), 3000);
}
['mousemove', 'mousedown', 'keydown', 'touchstart', 'touchend']
  .forEach(evt => document.addEventListener(evt, showNav, { passive: true }));
showNav();

// ── Scale stage to fit viewport ──
function scaleStage() {
  const vw = window.innerWidth || document.documentElement.clientWidth;
  const vh = window.innerHeight || document.documentElement.clientHeight;
  if (vw <= 0 || vh <= 0) return;
  const scale = Math.min(vw / 1600, vh / 900);
  stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
  stage.classList.add('ready');
}

scaleStage();
requestAnimationFrame(scaleStage);
window.addEventListener('load', scaleStage);
window.addEventListener('resize', scaleStage);
window.addEventListener('orientationchange', () => {
  scaleStage();
  setTimeout(scaleStage, 200);
  setTimeout(scaleStage, 500);
});
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', scaleStage);
}
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(scaleStage);
}

// ── Keyboard navigation ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
    e.preventDefault(); show(i + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    e.preventDefault(); show(i - 1);
  } else if (e.key === 'Home') show(0);
  else if (e.key === 'End') show(total - 1);
});

prev.addEventListener('click', () => show(i - 1));
next.addEventListener('click', () => show(i + 1));

// ── Touch swipe ──
let touchStartX = 0, touchStartY = 0, touchActive = false;
const SWIPE_MIN = 60, SWIPE_RATIO = 1.6;
if (stage) {
  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchActive = true;
  }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (!touchActive) return;
    touchActive = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    if (Math.abs(dx) < SWIPE_MIN) return;
    if (Math.abs(dx) < Math.abs(dy) * SWIPE_RATIO) return;
    if (dx < 0) show(i + 1); else show(i - 1);
  }, { passive: true });
  stage.addEventListener('touchcancel', () => { touchActive = false; }, { passive: true });
}

// Deep-link via #N
const hash = parseInt(window.location.hash.slice(1), 10);
if (!isNaN(hash) && hash >= 1 && hash <= total) show(hash - 1);
else show(0);
