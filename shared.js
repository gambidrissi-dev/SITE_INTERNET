/* ═══════════════════════════════════════════
   COLLECTIF COBALT — Shared JS v3
═══════════════════════════════════════════ */

const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

/* CURSOR (desktop uniquement) */
if (!isTouch) {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (dot && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    let lastBgType = 'cream';

    /* ── Détection du fond sous le curseur ── */
    function getBgUnderCursor(x, y) {
      // Masquer temporairement les éléments cursor pour ne pas les détecter
      dot.style.display  = 'none';
      ring.style.display = 'none';
      const el = document.elementFromPoint(x, y);
      dot.style.display  = '';
      ring.style.display = '';
      if (!el) return null;
      let node = el;
      while (node && node !== document.documentElement) {
        const bg = getComputedStyle(node).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
        node = node.parentElement;
      }
      return getComputedStyle(document.body).backgroundColor;
    }

    function classifyBg(rgb) {
      if (!rgb) return 'cream';
      const m = rgb.match(/\d+/g);
      if (!m || m.length < 3) return 'cream';
      const [r, g, b] = m.map(Number);
      // Bleu (#4A82DC ≈ 74,130,220) : canal bleu dominant
      if (b > 140 && b > r + 50 && b > g + 50) return 'bleu';
      // Noir (#1A1A1A) : luminance basse
      if (0.299 * r + 0.587 * g + 0.114 * b < 80) return 'noir';
      return 'cream'; // crème / blanc / fond clair
    }

    function applyCursorColor(bgType) {
      if (bgType === 'noir') {
        dot.style.background   = '#ffffff';
        ring.style.borderColor = 'rgba(255,255,255,0.6)';
      } else if (bgType === 'bleu') {
        dot.style.background   = '#1a1a1a';
        ring.style.borderColor = 'rgba(26,26,26,0.6)';
      } else {
        // cream / fond clair → curseur bleu
        dot.style.background   = '#4A82DC';
        ring.style.borderColor = 'rgba(74,130,220,0.55)';
      }
    }

    // Initialisation par défaut (fond cream)
    applyCursorColor('cream');

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      const bg     = getBgUnderCursor(mx, my);
      const bgType = classifyBg(bg);
      if (bgType !== lastBgType) {
        lastBgType = bgType;
        applyCursorColor(bgType);
      }
    });

    (function animCursor() {
      dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
      rx += (mx - rx) * .13; ry += (my - ry) * .13;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(animCursor);
    })();

    // Hover : agrandir le ring (taille via CSS .hov, couleur déjà gérée par JS)
    document.querySelectorAll('a, button, .proj-card, .cfg-opt, .cp-col, .cp-main-link').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
    });
  }
} else {
  // Tactile : on retire les divs cursor pour éviter tout overlay parasite
  document.getElementById('cursor-dot')?.remove();
  document.getElementById('cursor-ring')?.remove();
}

/* LIQUID GLASS OVERLAY — injecté dynamiquement sur toutes les inner pages */
(function setupOverlay() {
  const nav = document.querySelector('body > nav');
  if (!nav) return;

  // Injecter le skip-link en premier dans le body
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Aller au contenu';
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Injecter l'overlay dans le body
  const overlay = document.createElement('div');
  overlay.id = 'lg-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Navigation');
  overlay.innerHTML = `
    <div class="lg-header">
      <div class="lg-logo"><img src="assets/LOGO/LOGO_COBALT.svg" alt="Collectif Cobalt" style="height:18px;width:auto;opacity:.65;display:block;filter:invert(1);"></div>
      <div class="lg-esc">Échap pour fermer</div>
    </div>
    <div class="lg-strips">

      <div class="lg-strip e1">
        <div class="lg-strip-ghost">01</div>
        <a href="studio.html" class="lg-strip-primary">
          <div class="lg-strip-num">01</div>
          <div class="lg-strip-body">
            <div class="lg-strip-name">Le Studio</div>
            <div class="lg-strip-sub">Architecture & Design d'espace</div>
          </div>
          <div class="lg-strip-arrow">→</div>
        </a>
        <div class="lg-strip-links">
          <a href="studio.html" class="lg-strip-link">Présentation</a>
          <a href="projets.html" class="lg-strip-link">Projets</a>
          <a href="services.html" class="lg-strip-link">Services</a>
        </div>
      </div>

      <div class="lg-strip e2">
        <div class="lg-strip-ghost">02</div>
        <a href="atelier.html" class="lg-strip-primary">
          <div class="lg-strip-num">02</div>
          <div class="lg-strip-body">
            <div class="lg-strip-name">L'Atelier</div>
            <div class="lg-strip-sub">Fabrication & Prototypage</div>
          </div>
          <div class="lg-strip-arrow">→</div>
        </a>
        <div class="lg-strip-links">
          <a href="atelier.html" class="lg-strip-link">Présentation</a>
          <a href="atelier-drops.html" class="lg-strip-link">Drops</a>
          <a href="atelier-services.html" class="lg-strip-link">Services</a>
          <a href="atelier-projets.html" class="lg-strip-link">Projets</a>
        </div>
      </div>

      <div class="lg-strip e3">
        <div class="lg-strip-ghost">03</div>
        <a href="bleu-de-cobalt.html" class="lg-strip-primary">
          <div class="lg-strip-num">03</div>
          <div class="lg-strip-body">
            <div class="lg-strip-name">Bleu de Cobalt</div>
            <div class="lg-strip-sub">Programme & Cabinets partenaires</div>
          </div>
          <div class="lg-strip-arrow">→</div>
        </a>
        <div class="lg-strip-links">
          <a href="bleu-de-cobalt.html" class="lg-strip-link">Présentation</a>
          <a href="bleu-programme.html" class="lg-strip-link">Programme</a>
          <a href="bleu-cabinets.html" class="lg-strip-link">Cabinets</a>
          <a href="bleu-particuliers.html" class="lg-strip-link">Particuliers</a>
        </div>
      </div>

      <div class="lg-strip e4">
        <div class="lg-strip-ghost">04</div>
        <a href="media.html" class="lg-strip-primary">
          <div class="lg-strip-num">04</div>
          <div class="lg-strip-body">
            <div class="lg-strip-name">Le Média</div>
            <div class="lg-strip-sub">Architalk & Journal</div>
          </div>
          <div class="lg-strip-arrow">→</div>
        </a>
        <div class="lg-strip-links">
          <a href="media.html" class="lg-strip-link">Présentation</a>
          <a href="media-journal.html" class="lg-strip-link">Journal</a>
        </div>
      </div>

    </div>
    <div class="lg-overlay-footer">
      <a href="contact.html" class="lg-footer-contact">Contact</a>
      <div class="lg-footer-socials">
        <a href="https://www.instagram.com/collectifcobalt" target="_blank" rel="noopener">Instagram</a>
        <a href="https://www.linkedin.com/company/collectif-cobalt" target="_blank" rel="noopener">LinkedIn</a>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  // Injecter l'ancre #main-content si elle n'existe pas déjà (cible du skip-link)
  if (!document.getElementById('main-content')) {
    const anchor = document.createElement('div');
    anchor.id = 'main-content';
    anchor.setAttribute('tabindex', '-1');
    anchor.style.cssText = 'position:absolute;top:62px;left:0;width:1px;height:1px;overflow:hidden;pointer-events:none;';
    nav.insertAdjacentElement('afterend', anchor);
  }

  // Marquer la page courante active dans l'overlay
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const pageToEnv = {
    'studio.html': 'e1', 'projets.html': 'e1', 'services.html': 'e1',
    'atelier.html': 'e2', 'atelier-projets.html': 'e2',
    'atelier-services.html': 'e2', 'atelier-drops.html': 'e2',
    'bleu-de-cobalt.html': 'e3', 'bleu-programme.html': 'e3', 'bleu-cabinets.html': 'e3',
    'bleu-particuliers.html': 'e3', 'bleu-projets.html': 'e3',
    'media.html': 'e4', 'media-journal.html': 'e4',
  };
  const activeEnvClass = pageToEnv[currentPage];
  if (activeEnvClass) {
    const activeStrip = overlay.querySelector(`.lg-strip.${activeEnvClass}`);
    if (activeStrip) activeStrip.classList.add('active');
  }

  const burgerBtn = document.getElementById('nav-burger');
  if (!burgerBtn) return;

  // Éléments focusables dans l'overlay
  const getFocusable = () => [
    ...overlay.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')
  ].filter(el => !el.closest('[style*="display:none"]'));

  const open = () => {
    overlay.classList.add('open');
    burgerBtn.classList.add('open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Focus sur le premier lien de l'overlay
    setTimeout(() => { const els = getFocusable(); if (els.length) els[0].focus(); }, 60);
  };

  const close = () => {
    overlay.classList.remove('open');
    burgerBtn.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    burgerBtn.focus();
  };

  burgerBtn.addEventListener('click', () => overlay.classList.contains('open') ? close() : open());
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) { close(); return; }
    // Focus trap : Tab / Shift+Tab reste dans l'overlay
    if (e.key === 'Tab' && overlay.classList.contains('open')) {
      const els = getFocusable();
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
  });
})();

/* SCROLL REVEAL */
const srObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); srObs.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.sr').forEach(el => srObs.observe(el));

/* STATS COUNTER */
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    const dur = target > 100 ? 1600 : 800;
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target);
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
    statObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => statObs.observe(el));
