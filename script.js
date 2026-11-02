const html = document.documentElement;
const btn  = document.getElementById('themeBtn');

const MOON = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const SUN  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;

// Topographic background
const topoCanvas = document.createElement('canvas');
topoCanvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;';
document.body.insertBefore(topoCanvas, document.body.firstChild);

function drawTopo() {
  const W   = topoCanvas.width  = window.innerWidth;
  const H   = topoCanvas.height = window.innerHeight;
  const ctx = topoCanvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  const dark  = html.getAttribute('data-theme') === 'dark';
  const color = dark ? 'rgba(123,150,240,0.045)' : 'rgba(54,84,214,0.03)';
  const N     = 52;

  for (let i = 0; i < N; i++) {
    const baseY = (i / (N - 1)) * H * 1.25 - H * 0.125;
    ctx.beginPath();
    let first = true;
    for (let x = 0; x <= W; x += 3) {
      const t = x / W;
      const y = baseY
        + 88  * Math.sin(t * Math.PI * 1.9  + i * 0.36)
        + 46  * Math.sin(t * Math.PI * 4.3  + i * 0.74 + 1.1)
        + 110 * Math.sin(t * Math.PI * 0.85 + i * 0.21 + 2.6)
        + 28  * Math.sin(t * Math.PI * 8.5  + i * 1.15 + 0.5)
        + 18  * Math.sin(t * Math.PI * 13   + i * 0.55 + 3.2);
      if (first) { ctx.moveTo(x, y); first = false; }
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth   = 0.7;
    ctx.stroke();
  }
}

drawTopo();
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(drawTopo, 120);
}, { passive: true });

function toggleTheme() {
  const dark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', dark ? 'light' : 'dark');
  btn.innerHTML = dark ? SUN : MOON;
  drawTopo();
}

btn.innerHTML = MOON;

// Nav scroll state
const navEl = document.querySelector('nav');

// Scroll spy
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const targets  = [...navLinks].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

function updateActiveLink() {
  const threshold = window.innerHeight * 0.35;
  let active = null;
  targets.forEach(t => {
    if (t.getBoundingClientRect().top <= threshold) active = t;
  });
  navLinks.forEach(a => a.classList.toggle('active', !!active && a.getAttribute('href') === '#' + active.id));
}

window.addEventListener('scroll', () => {
  navEl.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveLink();
}, { passive: true });

updateActiveLink();

// Research card expand/collapse — single detail panel below all cards
const rcDetail   = document.querySelector('.rc-detail');
const rcPanes    = document.querySelectorAll('.rc-detail-pane');
let   rcActiveId = null;

document.querySelectorAll('.rc-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.rc-card');
    const id   = card.dataset.id;

    if (rcActiveId === id) {
      rcDetail.classList.remove('open');
      btn.textContent = 'Explore →';
      btn.setAttribute('aria-expanded', 'false');
      card.classList.remove('rc-active');
      rcActiveId = null;
    } else {
      const isSwitch = rcActiveId !== null;

      if (rcActiveId) {
        const prev = document.querySelector(`.rc-card[data-id="${rcActiveId}"]`);
        if (prev) {
          prev.querySelector('.rc-toggle').textContent = 'Explore →';
          prev.querySelector('.rc-toggle').setAttribute('aria-expanded', 'false');
          prev.classList.remove('rc-active');
        }
      }

      btn.textContent = '× Close';
      btn.setAttribute('aria-expanded', 'true');
      card.classList.add('rc-active');
      rcActiveId = id;

      if (isSwitch) {
        rcDetail.classList.add('fading');
        setTimeout(() => {
          rcPanes.forEach(p => { p.hidden = true; });
          const pane = document.querySelector(`.rc-detail-pane[data-for="${id}"]`);
          if (pane) pane.hidden = false;
          rcDetail.dataset.activeId = id;
          rcDetail.classList.remove('fading');
        }, 200);
      } else {
        rcPanes.forEach(p => { p.hidden = true; });
        const pane = document.querySelector(`.rc-detail-pane[data-for="${id}"]`);
        if (pane) pane.hidden = false;
        rcDetail.dataset.activeId = id;
        rcDetail.classList.add('open');
      }
    }
  });
});
