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
      const els = document.elementsFromPoint(x, y);
      const el = els.find(e => e.id !== 'cursor-dot' && e.id !== 'cursor-ring') || null;
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
      // Jaune (#F1CB4F) : R et G élevés, B faible
      if (r > 200 && g > 180 && b < 110) return 'jaune';
      return 'cream'; // crème / blanc / fond clair
    }

    function applyCursorColor(bgType) {
      if (bgType === 'noir') {
        dot.style.background   = '#ffffff';
        ring.style.borderColor = 'rgba(255,255,255,0.6)';
      } else if (bgType === 'bleu') {
        dot.style.background   = '#1a1a1a';
        ring.style.borderColor = 'rgba(26,26,26,0.6)';
      } else if (bgType === 'jaune') {
        dot.style.background   = '#1A1A1A';
        ring.style.borderColor = 'rgba(26,26,26,0.5)';
      } else {
        // cream / fond clair → curseur bleu
        dot.style.background   = '#4A82DC';
        ring.style.borderColor = 'rgba(74,130,220,0.55)';
      }
    }

    // Initialisation par défaut (fond cream)
    applyCursorColor('cream');

    let bgCheckPending = false;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      if (!bgCheckPending) {
        bgCheckPending = true;
        requestAnimationFrame(() => {
          const bg     = getBgUnderCursor(mx, my);
          const bgType = classifyBg(bg);
          if (bgType !== lastBgType) {
            lastBgType = bgType;
            applyCursorColor(bgType);
          }
          bgCheckPending = false;
        });
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

/* LIQUID GLASS FILTER SVG — injecté une fois, référencé par backdrop-filter: url('#cobalt-glass') */
(function injectGlassFilter() {
  if (document.getElementById('cobalt-glass-svg')) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'cobalt-glass-svg';
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;';
  svg.innerHTML = `<defs>
    <filter id="cobalt-glass" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.055 0.055" numOctaves="1" seed="3" result="noise"/>
      <feGaussianBlur in="noise" stdDeviation="1.5" result="blurNoise"/>
      <feDisplacementMap in="SourceGraphic" in2="blurNoise" scale="55" xChannelSelector="R" yChannelSelector="B" result="displaced"/>
      <feGaussianBlur in="displaced" stdDeviation="3.5" result="out"/>
      <feComposite in="out" in2="out" operator="over"/>
    </filter>
  </defs>`;
  document.body.insertBefore(svg, document.body.firstChild);
})();

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
      <button class="lg-close-btn" aria-label="Fermer le menu">✕</button>
    </div>
    <div class="lg-strips">

      <div class="lg-strip e0">
        <div class="lg-strip-ghost">01</div>
        <a href="collectif" class="lg-strip-primary">
          <div class="lg-strip-num">01</div>
          <div class="lg-strip-body">
            <div class="lg-strip-name">Le Collectif Cobalt</div>
            <div class="lg-strip-sub">Manifeste · Équipe · Intention</div>
          </div>
          <div class="lg-strip-arrow">→</div>
        </a>
        <div class="lg-strip-links">
          <a href="collectif" class="lg-strip-link">Présentation</a>
        </div>
      </div>

      <div class="lg-strip e1">
        <div class="lg-strip-ghost">02</div>
        <a href="studio" class="lg-strip-primary">
          <div class="lg-strip-num">02</div>
          <div class="lg-strip-body">
            <div class="lg-strip-name">Le Studio</div>
            <div class="lg-strip-sub">Architecture & Design d'espace</div>
          </div>
          <div class="lg-strip-arrow">→</div>
        </a>
        <div class="lg-strip-links">
          <a href="studio" class="lg-strip-link">Présentation</a>
          <a href="projets" class="lg-strip-link">Projets</a>
          <a href="services" class="lg-strip-link">Prestations</a>
          <a href="contact" class="lg-strip-link">Démarrer un projet</a>
        </div>
      </div>

      <div class="lg-strip e2">
        <div class="lg-strip-ghost">03</div>
        <a href="atelier" class="lg-strip-primary">
          <div class="lg-strip-num">03</div>
          <div class="lg-strip-body">
            <div class="lg-strip-name">L'Atelier</div>
            <div class="lg-strip-sub">Co-design · Éditions · E-Shop</div>
          </div>
          <div class="lg-strip-arrow">→</div>
        </a>
        <div class="lg-strip-links">
          <a href="atelier" class="lg-strip-link">Présentation</a>
          <a href="atelier-drops" class="lg-strip-link">E-Shop</a>
          <a href="atelier-projets" class="lg-strip-link">Projets</a>
          <a href="atelier-services" class="lg-strip-link">Prestation sur mesure</a>
          <a href="contact" class="lg-strip-link">Démarrer un projet</a>
        </div>
      </div>

      <div class="lg-strip e3">
        <div class="lg-strip-ghost">04</div>
        <a href="bleu-de-cobalt" class="lg-strip-primary">
          <div class="lg-strip-num">04</div>
          <div class="lg-strip-body">
            <div class="lg-strip-name">Bleu de Cobalt</div>
            <div class="lg-strip-sub">Alternance · Cabinets · Particuliers</div>
          </div>
          <div class="lg-strip-arrow">→</div>
        </a>
        <div class="lg-strip-links">
          <a href="bleu-de-cobalt" class="lg-strip-link">Présentation</a>
          <a href="bleu-confier" class="lg-strip-link">Confier une mission</a>
          <a href="bleu-cabinets" class="lg-strip-link">Professionnels</a>
          <a href="bleu-particuliers" class="lg-strip-link">Particuliers</a>
        </div>
      </div>

      <div class="lg-strip e4">
        <div class="lg-strip-ghost">05</div>
        <a href="media" class="lg-strip-primary">
          <div class="lg-strip-num">05</div>
          <div class="lg-strip-body">
            <div class="lg-strip-name">Le Média</div>
            <div class="lg-strip-sub">Architalk · Journal · Formats</div>
          </div>
          <div class="lg-strip-arrow">→</div>
        </a>
        <div class="lg-strip-links">
          <a href="media" class="lg-strip-link">Présentation</a>
          <a href="media-journal" class="lg-strip-link">Formats</a>
          <a href="https://www.instagram.com/collectifcobalt_/" target="_blank" rel="noopener" class="lg-strip-link">Suivre →</a>
        </div>
      </div>

    </div>
    <div class="lg-overlay-footer">
      <a href="contact" class="lg-footer-contact">Contact</a>
      <div class="lg-footer-socials">
        <a href="https://www.instagram.com/collectifcobalt_/" target="_blank" rel="noopener">Instagram</a>
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

  // Scroll — jonction visible en haut, disparaît au scroll
  const subnavBar = document.querySelector('.nav-subnav');
  let scrollTicking = false;
  const onScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      nav.classList.toggle('nav-scrolled', y > 40);
      if (subnavBar) subnavBar.classList.toggle('is-hidden', y > 50);
      scrollTicking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // état initial au chargement

  // Marquer la page courante active dans l'overlay
  // cleanUrls:true dans vercel.json supprime le .html — on le réinjecte si absent
  const currentPage = (() => {
    let p = window.location.pathname.split('/').pop() || 'index';
    if (p && !p.includes('.')) p += '.html';
    return p;
  })();
  const pageToEnv = {
    'collectif.html': 'e0',
    'studio.html': 'e1', 'projets.html': 'e1', 'services.html': 'e1', 'projet.html': 'e1',
    'atelier.html': 'e2', 'atelier-projets.html': 'e2', 'atelier-services.html': 'e2', 'atelier-drops.html': 'e2', 'drop-piece.html': 'e2',
    'bleu-de-cobalt.html': 'e3', 'bleu-programme.html': 'e3', 'bleu-cabinets.html': 'e3', 'bleu-particuliers.html': 'e3', 'bleu-confier.html': 'e3',
    'media.html': 'e4', 'media-journal.html': 'e4',
  };
  const activeEnvClass = pageToEnv[currentPage];
  if (activeEnvClass) {
    const activeStrip = overlay.querySelector(`.lg-strip.${activeEnvClass}`);
    if (activeStrip) activeStrip.classList.add('active');
    // Indicateur couleur dans la barre de nav
    nav.setAttribute('data-env', activeEnvClass);
  }



  /* ── ACCORDÉON OVERLAY MOBILE — sous-liens en chips ── */
  (function initMobileAccordion() {
    overlay.querySelectorAll('.lg-strip').forEach(strip => {
      const linksEl = strip.querySelector('.lg-strip-links');
      if (!linksEl) return;

      /* Chevron dans strip-primary */
      const primary = strip.querySelector('.lg-strip-primary');
      if (primary) {
        const chev = document.createElement('span');
        chev.className = 'lg-strip-chevron';
        chev.setAttribute('aria-hidden', 'true');
        chev.textContent = '›';
        primary.appendChild(chev);
      }

      /* Chips extraites des sous-liens existants */
      const chips = document.createElement('div');
      chips.className = 'lg-strip-chips';
      linksEl.querySelectorAll('a').forEach(a => {
        const chip = document.createElement('a');
        chip.href = a.href;
        chip.className = 'lg-strip-chip';
        chip.textContent = a.textContent.trim();
        chips.appendChild(chip);
      });
      strip.appendChild(chips);

      /* Toggle accordéon — mobile seulement, clic sur le primary */
      if (primary) {
        primary.addEventListener('click', e => {
          if (window.innerWidth > 768) return; /* desktop → navigation normale */
          e.preventDefault();
          const isOpen = strip.classList.contains('expanded');
          /* Fermer les autres */
          overlay.querySelectorAll('.lg-strip.expanded').forEach(s => s.classList.remove('expanded'));
          if (!isOpen) strip.classList.add('expanded');
        });
      }
    });
  })();

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

  // Bouton × dans l'overlay header
  const closeBtn = overlay.querySelector('.lg-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', close);

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
}, { threshold: 0.18 });
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


/* PAGE TRANSITION — wipe diagonal (fallback) + View Transitions API (natif) */
(function() {
  function closeNavOverlay() {
    const lgOverlay = document.getElementById('lg-overlay');
    if (lgOverlay && lgOverlay.classList.contains('open')) {
      lgOverlay.classList.remove('open');
      const burger = document.getElementById('nav-burger');
      if (burger) { burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
    }
  }

  /* ── View Transitions API disponible : le CSS @view-transition gère tout ── */
  if (CSS.supports('view-transition-name', 'none')) {
    document.addEventListener('click', e => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') ||
          href.startsWith('mailto') || href.startsWith('tel') ||
          link.target === '_blank') return;
      closeNavOverlay();
      /* Pas de preventDefault — le navigateur déclenche la VT automatiquement */
    });
    return;
  }

  /* ── Fallback : wipe diagonal noir pour navigateurs sans VT API ── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const CLIP_HIDDEN   = 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)';
  const CLIP_COVERED  = 'polygon(0% 0%, 110% 0%, 90% 100%, 0% 100%)';
  const CLIP_OFFRIGHT = 'polygon(100% 0%, 110% 0%, 110% 100%, 100% 100%)';

  const overlay = document.createElement('div');
  overlay.id = 'page-transition';
  overlay.style.cssText = `position:fixed;inset:0;z-index:9000;background:#1A1A1A;pointer-events:none;clip-path:${CLIP_HIDDEN};will-change:clip-path;`;
  document.body.appendChild(overlay);

  let cleared = false;
  function clearOverlay() {
    if (cleared) return;
    cleared = true;
    if (prefersReduced) {
      overlay.style.pointerEvents = 'none';
      return;
    }
    overlay.style.transition = 'clip-path .42s cubic-bezier(.25,0,.10,1)';
    overlay.style.clipPath = CLIP_OFFRIGHT;
    overlay.style.pointerEvents = 'none';
    setTimeout(() => {
      overlay.style.transition = 'none';
      overlay.style.clipPath = CLIP_HIDDEN;
    }, 480);
  }

  const fromTransition = sessionStorage.getItem('pageTransition');
  if (fromTransition) {
    sessionStorage.removeItem('pageTransition');
    overlay.style.transition = 'none';
    overlay.style.clipPath = prefersReduced ? CLIP_HIDDEN : CLIP_COVERED;
    if (!prefersReduced) overlay.style.pointerEvents = 'all';
    requestAnimationFrame(() => requestAnimationFrame(clearOverlay));
    setTimeout(clearOverlay, 700);
  }

  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#') ||
        href.startsWith('mailto') || href.startsWith('tel') ||
        link.target === '_blank') return;
    e.preventDefault();

    closeNavOverlay();
    sessionStorage.setItem('pageTransition', '1');

    if (prefersReduced) {
      window.location.href = href;
      return;
    }
    overlay.style.transition = 'clip-path .28s cubic-bezier(.76,0,.24,1)';
    overlay.style.clipPath = CLIP_COVERED;
    overlay.style.pointerEvents = 'all';
    setTimeout(() => { window.location.href = href; }, 320);
  });

  window.addEventListener('pageshow', e => {
    if (e.persisted) {
      cleared = false;
      overlay.style.transition = 'none';
      overlay.style.clipPath = CLIP_COVERED;
      overlay.style.pointerEvents = 'all';
      requestAnimationFrame(() => requestAnimationFrame(clearOverlay));
      setTimeout(clearOverlay, 700);
    }
  });
})();


/* MARQUEE AUTO-INJECT
   Injecte un marquee après le premier <section> ou après la <nav>
   si la page n'en a pas déjà un. Contenu adapté par page. */
(function injectMarquee() {
  // Ne rien faire si un marquee existe déjà dans la page
  if (document.querySelector('.marquee-wrap')) return;

  const slug = window.location.pathname.split('/').pop().replace('.html','');
  const CONTENT = {
    'studio':          '<span class=\"hi\">cobalt.</span><span class=\"marquee-sep\"></span>Design d\'espace<span class=\"marquee-sep\"></span>Architecture d\'intérieur<span class=\"marquee-sep\"></span><span class=\"hi\">Nouvelle-Aquitaine</span><span class=\"marquee-sep\"></span>Réhabilitation<span class=\"marquee-sep\"></span>Mobilier sur mesure<span class=\"marquee-sep\"></span>Bordeaux · Angoulême · Bayonne · Toulouse<span class=\"marquee-sep\"></span>',
    'atelier':         '<span class=\"hi\">l\'atelier.</span><span class=\"marquee-sep\"></span>Co-design avec artisans<span class=\"marquee-sep\"></span>Éditions limitées<span class=\"marquee-sep\"></span><span class=\"hi\">Sud-Ouest</span><span class=\"marquee-sep\"></span>Design d\'objet<span class=\"marquee-sep\"></span>Série limitée<span class=\"marquee-sep\"></span>Bois · Métal · Béton<span class=\"marquee-sep\"></span>',
    'bleu-de-cobalt':  '<span class=\"hi\">bleu de cobalt.</span><span class=\"marquee-sep\"></span>Employeur associatif<span class=\"marquee-sep\"></span>Alternants en architecture<span class=\"marquee-sep\"></span><span class=\"hi\">Sud-Ouest<\/span><span class=\"marquee-sep\"></span>Missions réelles<span class=\"marquee-sep\"></span>',
    'media':           '<span class=\"hi\">le média.</span><span class=\"marquee-sep\"></span>Architalk<span class=\"marquee-sep\"></span>Journal<span class=\"marquee-sep\"></span><span class=\"hi\">Architecture</span><span class=\"marquee-sep\"></span>Design<span class=\"marquee-sep\"></span>Culture constructive<span class=\"marquee-sep\"></span>',
  };
  const item = CONTENT[slug] || '<span class=\"hi\">cobalt.</span><span class=\"marquee-sep\"></span>Architecture<span class=\"marquee-sep\"></span>Design d\'espace<span class=\"marquee-sep\"></span>Fabrication<span class=\"marquee-sep\"></span><span class=\"hi\">Nouvelle-Aquitaine</span><span class=\"marquee-sep\"></span>';

  const wrap = document.createElement('div');
  wrap.className = 'marquee-wrap';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML = `<div class="marquee-track"><span class="marquee-item">${item}</span><span class="marquee-item">${item}</span></div>`;

  // Insérer après le premier bloc hero/section — jamais directement après la nav
  const anchor =
    document.querySelector('section') ||
    document.querySelector('.page-hero, .hero, .atelier-hero, .bdc-hero, .media-hero, .collectif-hero') ||
    document.querySelector('main > *:first-child') ||
    document.querySelector('body > *:not(nav):not(script):not(style):not([id$="-overlay"])');

  if (anchor) {
    anchor.insertAdjacentElement('afterend', wrap);
  } else {
    // Dernier recours : fin du body (jamais juste après la nav)
    document.body.appendChild(wrap);
  }
})();


/* HERO SHAPES — formes architecturales dans les héros des inner pages
   Injectées en position absolue côté droit, couleur accent de l'env */
(function injectHeroShapes() {
  const SHAPE_SVG = {
    item1: `<path d="M2.46143e-06 95.5659H750V450H2.46143e-06V95.5659Z"/><path d="M248.695 95.566L2.46143e-06 95.5659L0 1.39797e-07L248.695 95.566Z"/><path d="M498.858 95.566H248.695L248.695 7.7012e-08L498.858 95.566Z"/><path d="M750 95.5659L498.858 95.566V0L750 95.5659Z"/>`,
    item2: `<path d="M0 160.169H750V450H0V160.169Z"/><path d="M375 0L750 160.169H0L375 0Z"/>`,
    item3: `<path d="M750 450H502.677V252.561C502.677 192.924 445.394 144.578 374.732 144.578C304.623 144.578 247.684 192.171 246.799 251.165L246.788 252.561V450H0V0H750V450Z"/>`,
    item6: `<path d="M375 0C582.107 0 750 84.5762 750 188.906C750 189.063 749.998 189.219 749.997 189.375H750V450H0V189.375H0.00292969C0.0021765 189.219 0 188.906 0 84.5762 167.893 0 375 0Z"/>`,
    item7: `<path d="M0 233.901H750V450H0V233.901Z"/><path d="M124.837 96.4286H625.163V233.901H124.837V96.4286Z"/><path d="M233.518 0H516.971V96.4286H233.518V0Z"/>`,
    item8: `<path d="M0 0H215.989V450H0V0Z"/><path d="M215.989 75.9446H445.892V450H215.989V75.9446Z"/><path d="M445.892 149.622H750V450H445.892V149.622Z"/>`,
    item9: `<path d="M0 180.85H750V450H0V180.85Z"/><path d="M375 180.85C375 280.73 291.053 361.699 187.5 361.699C83.9466 361.699 0 280.73 0 180.85C0 80.9692 83.9466 0 187.5 0C291.053 0 375 80.9692 375 180.85Z"/><path d="M750 180.85C750 280.73 666.053 361.699 562.5 361.699C458.947 361.699 375 280.73 375 180.85C375 80.9692 458.947 0 562.5 0C666.053 0 750 80.9692 750 180.85Z"/>`,
  };

  // Configs par slug : [couleur, opacité, shapes à utiliser, positions [{x,y,size,rot}]]
  const CONFIGS = {
    'studio': {
      color: 'rgba(243,239,215,0.22)',
      shapes: [
        { key:'item7', x:62, y:8,  size:28, rot:-18 },
        { key:'item2', x:78, y:40, size:18, rot:12  },
        { key:'item3', x:52, y:55, size:22, rot:5   },
        { key:'item9', x:85, y:65, size:14, rot:-8  },
      ]
    },
    'atelier': {
      color: 'rgba(243,239,215,0.22)',
      shapes: [
        { key:'item8', x:65, y:5,  size:26, rot:15  },
        { key:'item1', x:80, y:42, size:20, rot:-10 },
        { key:'item6', x:55, y:60, size:18, rot:8   },
        { key:'item7', x:88, y:68, size:13, rot:-15 },
      ]
    },
    'bleu-de-cobalt': {
      color: 'rgba(26,26,26,0.13)',
      shapes: [
        { key:'item3', x:60, y:6,  size:30, rot:-12 },
        { key:'item9', x:80, y:35, size:16, rot:20  },
        { key:'item2', x:50, y:58, size:22, rot:-5  },
        { key:'item8', x:86, y:65, size:14, rot:10  },
      ]
    },
    'media': {
      color: 'rgba(243,239,215,0.18)',
      shapes: [
        { key:'item6', x:63, y:8,  size:28, rot:8   },
        { key:'item7', x:82, y:38, size:18, rot:-18 },
        { key:'item1', x:54, y:62, size:20, rot:12  },
        { key:'item9', x:87, y:70, size:12, rot:-6  },
      ]
    },
  };

  const slug = window.location.pathname.split('/').pop().replace('.html','');
  const cfg  = CONFIGS[slug];
  if (!cfg) return;

  // Trouver le hero de la page
  const hero = document.querySelector('.hero, .atelier-hero, .bdc-hero, .media-hero');
  if (!hero) return;
  // Ne pas ajouter si déjà présent
  if (hero.querySelector('.hs-wrap')) return;

  const wrap = document.createElement('div');
  wrap.className = 'hs-wrap';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:1;';

  cfg.shapes.forEach(({ key, x, y, size, rot }) => {
    const div = document.createElement('div');
    div.style.cssText = `position:absolute;left:${x}%;top:${y}%;width:${size}vw;color:${cfg.color};`;
    div.style.setProperty('--rot', rot + 'deg');
    div.innerHTML = `<svg viewBox="0 0 750 450" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">${SHAPE_SVG[key]}</svg>`;
    wrap.appendChild(div);
  });

  // Insérer au début du hero (derrière le contenu)
  hero.insertBefore(wrap, hero.firstChild);

  // S'assurer que les enfants directs du hero sont au-dessus
  [...hero.children].forEach(el => {
    if (el !== wrap && !el.style.position) el.style.position = 'relative';
    if (el !== wrap) el.style.zIndex = '2';
  });
})();


/* SECTION SHAPES — 1 forme décorative dans la première grande section cream */
(function injectSectionShape() {
  const SHAPE_SVG = {
    item3: `<path d="M750 450H502.677V252.561C502.677 192.924 445.394 144.578 374.732 144.578C304.623 144.578 247.684 192.171 246.799 251.165L246.788 252.561V450H0V0H750V450Z"/>`,
    item9: `<path d="M0 180.85H750V450H0V180.85Z"/><path d="M375 180.85C375 280.73 291.053 361.699 187.5 361.699C83.9466 361.699 0 280.73 0 180.85C0 80.9692 83.9466 0 187.5 0C291.053 0 375 80.9692 375 180.85Z"/><path d="M750 180.85C750 280.73 666.053 361.699 562.5 361.699C458.947 361.699 375 280.73 375 180.85C375 80.9692 458.947 0 562.5 0C666.053 0 750 80.9692 750 180.85Z"/>`,
    item7: `<path d="M0 233.901H750V450H0V233.901Z"/><path d="M124.837 96.4286H625.163V233.901H124.837V96.4286Z"/><path d="M233.518 0H516.971V96.4286H233.518V0Z"/>`,
  };
  const ENV_COLOR = {
    'studio':'#4A82DC','atelier':'#5DA16B',
    'bleu-de-cobalt':'#C9A81A','media':'#BB3B34',
  };
  const ENV_SHAPE = {
    'studio':'item9','atelier':'item7',
    'bleu-de-cobalt':'item3','media':'item9',
  };

  const slug  = window.location.pathname.split('/').pop().replace('.html','');
  const color = ENV_COLOR[slug];
  const key   = ENV_SHAPE[slug];
  if (!color || !key) return;

  // Première section cream (background: #F3EFD7 ou var(--cream))
  const sections = document.querySelectorAll('section, .featured, .pieces, .why-section, .editorial');
  let target = null;
  for (const el of sections) {
    const bg = getComputedStyle(el).backgroundColor;
    // cream = rgb(243, 239, 215)
    if (bg === 'rgb(243, 239, 215)') { target = el; break; }
  }
  if (!target || target.querySelector('.section-shape')) return;

  target.classList.add('has-shapes');
  const div = document.createElement('div');
  div.className = 'section-shape';
  div.style.cssText = `right:-5%;bottom:-10%;width:28vw;color:${color};`;
  div.style.setProperty('--rot', '-8deg');
  div.innerHTML = `<svg viewBox="0 0 750 450" fill="currentColor" xmlns="http://www.w3.org/2000/svg">${SHAPE_SVG[key]}</svg>`;
  target.appendChild(div);
})();

/* ── WORD REVEAL — clip-mask slide up, h1 + gros h2 ── */
(function initWordReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* Wrap chaque mot texte en <span class="rw-word"><span class="rw-word-inner">mot</span></span>
     On parcourt les TextNodes pour préserver les balises enfants (<em>, <br>…) */
  function splitWords(el) {
    el.classList.remove('sr');

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    const nodes  = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);

    nodes.forEach(tn => {
      const parts = tn.textContent.split(/(\s+)/);
      const frag  = document.createDocumentFragment();
      parts.forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const outer = document.createElement('span');
          outer.className = 'rw-word';
          const inner = document.createElement('span');
          inner.className = 'rw-word-inner';
          inner.textContent = part;
          outer.appendChild(inner);
          frag.appendChild(outer);
        }
      });
      tn.parentNode.replaceChild(frag, tn);
    });
  }

  function revealWords(el) {
    /* Double rAF garantit que le navigateur a calculé la position initiale
       translateY(112%) avant de démarrer la transition */
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.querySelectorAll('.rw-word').forEach((w, i) => {
        /* Stagger : 55 ms entre chaque mot, max 8 mots décalés au-delà */
        /* Stagger easé : rush naturel, les derniers mots se rejoignent (~125ms max) */
        const idx = Math.min(i, 8);
        const delay = Math.round(idx * 55 * Math.pow(0.85, idx));
        setTimeout(() => w.classList.add('in'), delay);
      });
    }));
  }

  /* Cible : tous les h1, plus les h2 ayant une font-size calculée ≥ 44px */
  const targets = [
    ...document.querySelectorAll('h1'),
    ...[...document.querySelectorAll('h2')].filter(h => {
      const fs = parseFloat(getComputedStyle(h).fontSize);
      return fs >= 44;
    })
  ];

  targets.forEach(el => {
    splitWords(el);

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.unobserve(el);
      revealWords(el);
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    obs.observe(el);
  });
})();

/* ── BUTTON SHIMMER — injecte un span .btn-shimmer dans chaque .btn-primary ── */
(function injectBtnShimmer() {
  document.querySelectorAll('.btn.btn-primary').forEach(btn => {
    if (btn.querySelector('.btn-shimmer')) return;
    const shimmer = document.createElement('span');
    shimmer.className = 'btn-shimmer';
    shimmer.setAttribute('aria-hidden', 'true');
    btn.appendChild(shimmer);
  });
})();

/* ── BUTTON INTERACTIONS — specular highlight + magnetic pull + ripple on click ── */
(function initBtnInteractions() {
  if (window.matchMedia('(pointer: coarse)').matches) return; /* désactiver sur touch */

  document.querySelectorAll('.btn').forEach(btn => {

    /* Specular + magnetic */
    btn.addEventListener('pointermove', e => {
      const r  = btn.getBoundingClientRect();
      const sx = ((e.clientX - r.left) / r.width)  * 100;
      const sy = ((e.clientY - r.top)  / r.height) * 100;
      btn.style.setProperty('--sx', sx + '%');
      btn.style.setProperty('--sy', sy + '%');

      /* Magnetic : jusqu'à 7px d'attraction vers le curseur */
      const dx = ((e.clientX - r.left) - r.width  / 2) * 0.12;
      const dy = ((e.clientY - r.top)  - r.height / 2) * 0.12;
      btn.style.transform = `scale(1.04) translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
      btn.style.removeProperty('--sx');
      btn.style.removeProperty('--sy');
    });

    /* Ripple au clic */
    btn.addEventListener('pointerdown', e => {
      if (e.button !== 0 && e.button !== undefined) return;
      const r = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.left = (e.clientX - r.left  - 30) + 'px';
      ripple.style.top  = (e.clientY - r.top   - 30) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 750);
    });
  });
})();

/* ── HERO REVEAL ORCHESTRATED — labels, paragraphes, CTA (pas h1 qui a son propre anim) ── */
(function initHeroReveal() {
  const hero = document.querySelector('.hero, .atelier-hero, .bdc-hero, .media-hero, .collectif-hero');
  if (!hero) return;

  const selectors = '.s-label, .hero-tag, .hero-meta, .hero-sub, p, .btn, .hero-cta, .hero-badge';
  const els = hero.querySelectorAll(selectors);
  if (!els.length) return;

  els.forEach((el, i) => {
    /* Ne pas interférer avec les éléments déjà animés autrement */
    if (el.closest('.rw-word')) return;
    el.classList.add('hero-reveal');
    el.style.animationDelay = Math.min(0.15 + i * 0.11, 0.55) + 's';
  });
})();

/* ── CURSOR VELOCITY BLOB + LABEL "VOIR →" ── */
(function initCursorBlob() {
  if (isTouch) return;
  const ring = document.getElementById('cursor-ring');
  if (!ring) return;

  /* Label flottant */
  const lbl = document.createElement('div');
  lbl.id = 'cursor-label';
  lbl.textContent = 'VOIR →';
  document.body.appendChild(lbl);

  let cx = 0, cy = 0, pcx = 0, pcy = 0;

  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    lbl.style.left = cx + 'px';
    lbl.style.top  = cy + 'px';
  });

  /* Cartes projet → label-mode */
  const CARD_SEL = '.proj-card, .feat-card, .atelier-card, .media-card, .drop-card';
  document.querySelectorAll(CARD_SEL).forEach(card => {
    card.addEventListener('mouseenter', () => {
      ring.classList.add('label-mode');
      lbl.style.opacity = '1';
    });
    card.addEventListener('mouseleave', () => {
      ring.classList.remove('label-mode');
      lbl.style.opacity = '0';
    });
  });

  /* rAF : blob velocity stretch (désactivé en label-mode pour lisibilité) */
  (function blobLoop() {
    if (!document.hidden) {
      const vx = cx - pcx;
      const vy = cy - pcy;
      pcx = cx; pcy = cy;

      if (!ring.classList.contains('label-mode')) {
        const speed   = Math.sqrt(vx * vx + vy * vy);
        const angle   = Math.atan2(vy, vx) * 180 / Math.PI;
        const stretch = Math.min(speed * 0.036, 0.28);
        const sx      = 1 + stretch;
        const sy      = 1 - stretch * 0.55;
        ring.style.transform =
          `translate(-50%,-50%) rotate(${angle.toFixed(1)}deg) scaleX(${sx.toFixed(3)}) scaleY(${sy.toFixed(3)})`;
      } else {
        ring.style.transform = 'translate(-50%,-50%)';
      }
    }

    requestAnimationFrame(blobLoop);
  })();
})();

/* ── CARDS 3D TILT (desktop uniquement) ── */
(function initCardTilt() {
  if (isTouch) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const SEL = '.proj-card, .feat-card, .atelier-card, .media-card';
  document.querySelectorAll(SEL).forEach(card => {
    let cachedRect = null;

    /* Cacher le rect à l'entrée — évite getBoundingClientRect sur chaque pointermove */
    card.addEventListener('pointerenter', () => {
      cachedRect = card.getBoundingClientRect();
    });

    card.addEventListener('pointermove', e => {
      if (!cachedRect) return;
      const nx = (e.clientX - cachedRect.left) / cachedRect.width  - 0.5;
      const ny = (e.clientY - cachedRect.top)  / cachedRect.height - 0.5;
      const rx = -ny * 10;
      const ry =  nx * 10;
      card.style.transform =
        `perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.016)`;
    });

    card.addEventListener('pointerleave', () => {
      cachedRect = null;
      card.style.transform = '';
    });
  });

  /* Recalculer les rects mis en cache si la fenêtre est redimensionnée */
  window.addEventListener('resize', () => {
    document.querySelectorAll(SEL).forEach(card => {
      card.dispatchEvent(new Event('pointerleave'));
    });
  }, { passive: true });
})();

/* ── LETTER STAGGER — split .s-label en .sl-letter, déclenché par IntersectionObserver ── */
(function initLabelStagger() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const labels = document.querySelectorAll('.s-label');
  if (!labels.length) return;

  labels.forEach(el => {
    if (el.querySelector('.sl-letter')) return; /* déjà splité */
    const text = el.textContent.trim();
    el.textContent = '';
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'sl-letter';
      span.style.setProperty('--i', i);
      span.textContent = ch === ' ' ? ' ' : ch;
      el.appendChild(span);
    });
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.sl-letter').forEach(s => s.classList.add('in'));
      io.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  labels.forEach(el => io.observe(el));
})();

/* ── SCROLL PARALLAX — hero shapes flottent plus lentement que le scroll ── */
(function initScrollParallax() {
  const wrap = document.querySelector('.hs-wrap');
  if (!wrap) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      wrap.style.transform = `translateY(${(window.scrollY * 0.12).toFixed(1)}px)`;
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
})();

/* ── SECTION REVEAL — fade-up staggeré sur les enfants de .section ── */
(function initSectionReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* Sélecteurs à animer à l'intérieur de chaque .section */
  const CHILD_SEL = [
    'h2', 'h3', 'p', '.btn', '.proj-card', '.feat-card',
    '.atelier-card', '.media-card', '.service-item',
    '.team-card', '.stat-block', '.testimonial',
    'figure', 'blockquote', '.cfg-step'
  ].join(', ');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const section = entry.target;

      /* Stagger sur les enfants directs ciblés */
      const children = [...section.querySelectorAll(CHILD_SEL)]
        .filter(el =>
          !el.closest('.hero, .atelier-hero, .bdc-hero, .media-hero, .collectif-hero') &&
          !el.classList.contains('sr') /* déjà géré par le système .sr manuel */
        );

      children.forEach((el, i) => {
        if (el.classList.contains('sr-el')) return; /* déjà marqué */
        el.classList.add('sr-el');
        /* Double rAF pour s'assurer que opacity:0 est peint avant l'animation */
        requestAnimationFrame(() => requestAnimationFrame(() => {
          el.classList.add('sr-in');
          el.style.animationDelay = Math.min(i * 0.07, 0.50) + 's';
        }));
      });

      io.unobserve(section);
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.section, section').forEach(s => io.observe(s));
})();

/* ── SCROLL PROGRESS BAR ── */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.appendChild(bar);

  let ticking = false;
  function update() {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const pct      = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = pct.toFixed(2) + '%';
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  update(); /* état initial */
})();

/* ── CURSOR TRAIL PARTICLES — Canvas 2D (zéro DOM thrashing) ── */
(function initCursorTrail() {
  if (isTouch) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9990;';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let cssW = window.innerWidth, cssH = window.innerHeight;
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    cssW = window.innerWidth;
    cssH = window.innerHeight;
    canvas.width  = cssW * dpr;
    canvas.height = cssH * dpr;
    canvas.style.width  = cssW + 'px';
    canvas.style.height = cssH + 'px';
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const particles = [];
  let lastX = 0, lastY = 0, frameCount = 0;
  const INTERVAL = 3;
  const MAX_LIFE = 34; /* ~0.55s @ 60fps */

  document.addEventListener('mousemove', e => { lastX = e.clientX; lastY = e.clientY; });

  (function trailLoop() {
    if (!document.hidden) {
      frameCount++;
      const spawnThisFrame = frameCount % INTERVAL === 0;
      if (spawnThisFrame) {
        particles.push({ x: lastX, y: lastY, size: (0.5 + Math.random() * 0.8) * 2.5, life: 0 });
      }

      if (particles.length > 0) {
        ctx.clearRect(0, 0, cssW, cssH);
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life++;
          const t = p.life / MAX_LIFE;
          const r = p.size * (1 - t * 0.8);
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(74,130,220,${(0.45 * (1 - t)).toFixed(3)})`;
          ctx.fill();
          if (p.life >= MAX_LIFE) particles.splice(i, 1);
        }
      }
    }
    requestAnimationFrame(trailLoop);
  })();
})();

/* initGradientText supprimé — background-clip:text rend le h1 invisible sur fonds colorés */

/* ── COUNTER ANIMATION — éléments [data-count="N"] ── */
(function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(el => { el.textContent = el.dataset.count; });
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur    = 1600; /* ms */
      const start  = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / dur, 1);
        /* Ease out cubic */
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = (Number.isInteger(target)
          ? Math.round(value)
          : value.toFixed(1)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  els.forEach(el => io.observe(el));
})();

/* ── IMAGE PARALLAX IN-CARD — object-position suit le scroll ── */
(function initCardImgParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const CARD_SEL = '.proj-card, .feat-card, .atelier-card';
  const cards    = [...document.querySelectorAll(CARD_SEL)];
  if (!cards.length) return;

  let ticking = false;

  function update() {
    const vh = window.innerHeight;
    cards.forEach(card => {
      const img = card.querySelector('img');
      if (!img) return;
      const r   = card.getBoundingClientRect();
      /* Progression de la card dans le viewport : 0 (bas) → 1 (haut) */
      const progress = 1 - (r.bottom / (vh + r.height));
      /* object-position Y : 55% (card en bas) → 45% (card en haut), ±5% */
      const py = 50 + (progress - 0.5) * -10;
      img.style.setProperty('--py', py.toFixed(1) + '%');
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  update();
})();

/* ── MAGNETIC NAV LINKS (overlay) ── */
(function initMagneticNav() {
  if (isTouch) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.lg-strip-name').forEach(el => {
    const strip = el.closest('.lg-strip');
    if (!strip) return;

    strip.addEventListener('pointermove', e => {
      const r  = el.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) * 0.18;
      const dy = (e.clientY - cy) * 0.18;
      el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
    });

    strip.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
})();

/* ── TEXT SCRAMBLE — titres de l'overlay nav au hover ── */
(function initTextScramble() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  function scramble(el) {
    const original = el.dataset.original || el.textContent.trim();
    el.dataset.original = original;

    let frame = 0;
    const totalFrames = 14;
    let lastTime = 0;
    const frameDuration = 28; /* ~35fps */

    function tick(now) {
      if (now - lastTime < frameDuration) { requestAnimationFrame(tick); return; }
      lastTime = now;

      el.textContent = [...original].map((ch, i) => {
        if (ch === ' ') return ' ';
        if (frame / totalFrames > i / original.length) return ch;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');

      if (++frame > totalFrames) {
        el.textContent = original;
      } else {
        requestAnimationFrame(tick);
      }
    }
    requestAnimationFrame(tick);
  }

  document.querySelectorAll('.lg-strip-name').forEach(el => {
    el.closest('.lg-strip')?.addEventListener('mouseenter', () => scramble(el));
  });
})();


/* ═══════════════════════════════════════════
   ANIMATIONS v18 — Lenis · Clip reveal · Progress · Ambient · Morph
═══════════════════════════════════════════ */

/* ── LENIS SMOOTH SCROLL ── */
(function initLenis() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (isTouch) return; /* scroll natif sur mobile */
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.45/bundled/lenis.min.js';
  s.onload = function () {
    const lenis = new Lenis({
      duration:     1.15,
      easing:       function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel:  true,
      smoothTouch:  false,
    });
    window.lenis = lenis;
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    /* Anchor scroll : utilise Lenis au lieu du comportement natif */
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        const id = a.getAttribute('href').slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -80, duration: 1.4 }); }
      });
    });
  };
  document.head.appendChild(s);
})();

/* ── IMAGE CLIP REVEAL — scroll-triggered, stagger par rangée ── */
(function initImgReveal() {
  const cards = document.querySelectorAll('.proj-card, .feat-card, .atelier-card');
  if (!cards.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cards.forEach(function(c) { c.classList.add('img-in'); });
    return;
  }

  const io = new IntersectionObserver(function(entries) {
    /* Trier par position verticale pour un stagger naturel */
    const visible = entries.filter(function(e) { return e.isIntersecting; });
    visible
      .slice()
      .sort(function(a, b) {
        const ra = a.target.getBoundingClientRect();
        const rb = b.target.getBoundingClientRect();
        return ra.top !== rb.top ? ra.top - rb.top : ra.left - rb.left;
      })
      .forEach(function(entry, i) {
        setTimeout(function() { entry.target.classList.add('img-in'); }, i * 90);
        io.unobserve(entry.target);
      });
  }, { threshold: 0.12 });

  cards.forEach(function(c) { io.observe(c); });
})();

/* ── FOOTER SILHOUETTE — stroke-dashoffset drawing ── */
(function initSilhouetteReveal() {
  const sils = document.querySelectorAll('.footer-silhouette');
  if (!sils.length) return;

  /* Prefers-reduced-motion : afficher immédiatement */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.sil-stroke').forEach(function(p) {
      p.style.strokeDashoffset = 0;
    });
    return;
  }

  /* Init : cacher tous les traits (dashoffset = totalLength) */
  document.querySelectorAll('.sil-stroke').forEach(function(path) {
    try {
      var len = path.getTotalLength();
      path.style.strokeDasharray  = len;
      path.style.strokeDashoffset = len;
    } catch(e) { /* getTotalLength non dispo */ }
  });

  /* Observer : déclencher le dessin quand la silhouette entre en vue */
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var sil = entry.target;
      sil.classList.add('sil-in');

      sil.querySelectorAll('.sil-stroke').forEach(function(path, i) {
        /* Stagger : chaque trait se dessine 250 ms après le précédent */
        var delay = 0.10 + i * 0.28;
        path.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1) ' + delay + 's';
        path.style.strokeDashoffset = 0;
      });

      io.unobserve(sil);
    });
  }, { threshold: 0.01 });

  sils.forEach(function(s) { io.observe(s); });
})();


/* ── OVERLAY AMBIENT — teinte de fond selon entité survolée ── */
(function initOverlayAmbient() {
  const overlay = document.getElementById('lg-overlay');
  if (!overlay) return;

  const AMB_MAP = { e1: 'amb-e1', e2: 'amb-e2', e3: 'amb-e3', e4: 'amb-e4' };
  const ALL_AMB = Object.values(AMB_MAP);

  document.querySelectorAll('.lg-strip').forEach(function(strip) {
    const cls = Array.from(strip.classList).find(function(c) { return /^e\d$/.test(c); });
    if (!cls) return;

    strip.addEventListener('mouseenter', function() {
      overlay.classList.remove.apply(overlay.classList, ALL_AMB);
      if (AMB_MAP[cls]) overlay.classList.add(AMB_MAP[cls]);
    });
    strip.addEventListener('mouseleave', function() {
      /* Délai court : laisse le temps de passer sur une autre bande */
      setTimeout(function() {
        if (!overlay.querySelector('.lg-strip:hover')) {
          overlay.classList.remove.apply(overlay.classList, ALL_AMB);
        }
      }, 90);
    });
  });
})();

/* ── NAV COLOR MORPH — sections avec data-nav-color="#hex" ── */
(function initNavColorMorph() {
  const nav = document.querySelector('body > nav');
  if (!nav) return;
  const sections = document.querySelectorAll('[data-nav-color]');
  if (!sections.length) return;

  const io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      const color = entry.target.dataset.navColor;
      /* Recolore le dot/indicator nav sans forcer un repaint complet */
      nav.style.setProperty('--nav-section-color', color);
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  sections.forEach(function(s) { io.observe(s); });
})();

