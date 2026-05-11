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
        <a href="collectif.html" class="lg-strip-primary">
          <div class="lg-strip-num">01</div>
          <div class="lg-strip-body">
            <div class="lg-strip-name">Le Collectif</div>
            <div class="lg-strip-sub">Manifeste · Équipe · Intention</div>
          </div>
          <div class="lg-strip-arrow">→</div>
        </a>
        <div class="lg-strip-links">
          <a href="collectif.html" class="lg-strip-link">Manifeste</a>
          <a href="collectif.html#equipe" class="lg-strip-link">Équipe</a>
        </div>
      </div>

      <div class="lg-strip e1">
        <div class="lg-strip-ghost">02</div>
        <a href="studio.html" class="lg-strip-primary">
          <div class="lg-strip-num">02</div>
          <div class="lg-strip-body">
            <div class="lg-strip-name">Le Studio</div>
            <div class="lg-strip-sub">Architecture & Design d'espace</div>
          </div>
          <div class="lg-strip-arrow">→</div>
        </a>
        <div class="lg-strip-links">
          <a href="studio.html" class="lg-strip-link">Présentation</a>
          <a href="projets.html" class="lg-strip-link">Projets</a>
          <a href="contact.html" class="lg-strip-link">Démarrer un projet</a>
        </div>
      </div>

      <div class="lg-strip e2">
        <div class="lg-strip-ghost">03</div>
        <a href="atelier.html" class="lg-strip-primary">
          <div class="lg-strip-num">03</div>
          <div class="lg-strip-body">
            <div class="lg-strip-name">L'Atelier</div>
            <div class="lg-strip-sub">Fabrication & Prototypage</div>
          </div>
          <div class="lg-strip-arrow">→</div>
        </a>
        <div class="lg-strip-links">
          <a href="atelier.html" class="lg-strip-link">Présentation</a>
          <a href="atelier-projets.html" class="lg-strip-link">Projets</a>
          <a href="atelier-services.html" class="lg-strip-link">Services</a>
          <a href="atelier-drops.html" class="lg-strip-link">Drops</a>
        </div>
      </div>

      <div class="lg-strip e3">
        <div class="lg-strip-ghost">04</div>
        <a href="bleu-de-cobalt.html" class="lg-strip-primary">
          <div class="lg-strip-num">04</div>
          <div class="lg-strip-body">
            <div class="lg-strip-name">Bleu de Cobalt</div>
            <div class="lg-strip-sub">Programme & Cabinets partenaires</div>
          </div>
          <div class="lg-strip-arrow">→</div>
        </a>
        <div class="lg-strip-links">
          <a href="bleu-de-cobalt.html" class="lg-strip-link">Le programme</a>
          <a href="bleu-cabinets.html" class="lg-strip-link">Cabinets</a>
          <a href="bleu-particuliers.html" class="lg-strip-link">Particuliers</a>
        </div>
      </div>

      <div class="lg-strip e4">
        <div class="lg-strip-ghost">05</div>
        <a href="media.html" class="lg-strip-primary">
          <div class="lg-strip-num">05</div>
          <div class="lg-strip-body">
            <div class="lg-strip-name">Le Média</div>
            <div class="lg-strip-sub">ARCHITALK · FRAGMENTS · CARNET BLEU · RACCOURCI</div>
          </div>
          <div class="lg-strip-arrow">→</div>
        </a>
        <div class="lg-strip-links">
          <a href="media.html" class="lg-strip-link">Les formats</a>
          <a href="contact.html" class="lg-strip-link">Suivre</a>
        </div>
      </div>

    </div>
    <div class="lg-overlay-footer">
      <a href="contact.html" class="lg-footer-contact">Contact</a>
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
  const onScroll = () => nav.classList.toggle('nav-scrolled', window.scrollY > 40);
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
    'atelier.html': 'e2', 'atelier-projets.html': 'e2', 'atelier-services.html': 'e2', 'atelier-drops.html': 'e2',
    'bleu-de-cobalt.html': 'e3', 'bleu-programme.html': 'e3', 'bleu-cabinets.html': 'e3', 'bleu-particuliers.html': 'e3',
    'media.html': 'e4', 'media-journal.html': 'e4',
  };
  const activeEnvClass = pageToEnv[currentPage];
  if (activeEnvClass) {
    const activeStrip = overlay.querySelector(`.lg-strip.${activeEnvClass}`);
    if (activeStrip) activeStrip.classList.add('active');
    // Indicateur couleur dans la barre de nav
    nav.setAttribute('data-env', activeEnvClass);
  }


  /* ── PILL CONTEXTUELLE RETOUR (sous-pages uniquement) ── */
  const PARENT_MAP = {
    'projets.html':           { href: 'studio.html',        label: 'Le Studio',      env: 'e1' },
    'services.html':          { href: 'studio.html',        label: 'Le Studio',      env: 'e1' },
    'atelier-projets.html':   { href: 'atelier.html',       label: "L'Atelier",      env: 'e2' },
    'atelier-services.html':  { href: 'atelier.html',       label: "L'Atelier",      env: 'e2' },
    'atelier-drops.html':     { href: 'atelier.html',       label: "L'Atelier",      env: 'e2' },
    'bleu-cabinets.html':     { href: 'bleu-de-cobalt.html', label: 'Bleu de Cobalt', env: 'e3' },
    'bleu-particuliers.html': { href: 'bleu-de-cobalt.html', label: 'Bleu de Cobalt', env: 'e3' },
    'bleu-programme.html':    { href: 'bleu-de-cobalt.html', label: 'Bleu de Cobalt', env: 'e3' },
    'bleu-projets.html':      { href: 'bleu-de-cobalt.html', label: 'Bleu de Cobalt', env: 'e3' },
    'media-journal.html':     { href: 'media.html',          label: 'Le Média',       env: 'e4' },
  };
  const parentInfo = PARENT_MAP[currentPage];
  if (parentInfo) {
    const backPill = document.createElement('a');
    backPill.href = parentInfo.href;
    backPill.className = 'nav-back-pill';
    backPill.setAttribute('data-env', parentInfo.env);
    backPill.setAttribute('aria-label', 'Retour vers ' + parentInfo.label);
    backPill.innerHTML =
      '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2L4 6L8 10"/></svg>' +
      '<span class="nav-back-label">' + parentInfo.label + '</span>';
    const burger = nav.querySelector('.nav-burger-btn');
    if (burger) nav.insertBefore(backPill, burger);
    else nav.appendChild(backPill);
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


/* PAGE TRANSITION */
(function() {
  const overlay = document.createElement('div');
  overlay.id = 'page-transition';

  // Si on arrive depuis une transition (flag sessionStorage), démarrer opaque puis fade-in
  const fromTransition = sessionStorage.getItem('pageTransition');
  if (fromTransition) {
    sessionStorage.removeItem('pageTransition');
    overlay.style.cssText = 'opacity:1;pointer-events:all;transition:none;';
    document.body.appendChild(overlay);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      overlay.style.transition = 'opacity .38s cubic-bezier(.76,0,.24,1)';
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
    }));
  } else {
    // Chargement direct : overlay invisible, aucun flash
    overlay.style.cssText = 'opacity:0;pointer-events:none;transition:none;';
    document.body.appendChild(overlay);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      overlay.style.transition = '';
    }));
  }

  // Intercepter tous les liens internes
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    // Ignorer : externe, ancre, mailto, tel, nouvel onglet
    if (!href || href.startsWith('http') || href.startsWith('#') ||
        href.startsWith('mailto') || href.startsWith('tel') ||
        link.target === '_blank') return;
    e.preventDefault();

    // Fermer l'overlay nav si ouvert — évite le flash overlay-sur-transition
    const lgOverlay = document.getElementById('lg-overlay');
    if (lgOverlay && lgOverlay.classList.contains('open')) {
      lgOverlay.classList.remove('open');
      const burger = document.getElementById('nav-burger');
      if (burger) { burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
    }

    // Flag pour la page de destination
    sessionStorage.setItem('pageTransition', '1');

    overlay.style.transition = 'opacity .28s cubic-bezier(.76,0,.24,1)';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    setTimeout(() => { window.location.href = href; }, 300);
  });

  // Gestion du back/forward (bfcache)
  window.addEventListener('pageshow', e => {
    if (e.persisted) {
      overlay.style.transition = 'none';
      overlay.style.opacity = '1';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        overlay.style.transition = 'opacity .38s cubic-bezier(.76,0,.24,1)';
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      }));
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

/* ── WORD REVEAL — h1 mot par mot, spring (équivalent Framer Motion stagger) ── */
(function initWordReveal() {
  /* Parcourt les noeuds texte, emballe chaque mot dans un .rw-word */
  function splitWords(el) {
    el.classList.remove('sr'); /* word reveal remplace le scroll reveal global */

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    const nodes = [];
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
          const span = document.createElement('span');
          span.className = 'rw-word';
          span.textContent = part;
          frag.appendChild(span);
        }
      });
      tn.parentNode.replaceChild(frag, tn);
    });
  }

  function revealWords(h) {
    /* Double rAF : s'assure que le browser a peint opacity:0 avant de déclencher
       la transition — sans ça l'état initial est ignoré et on voit juste un flash */
    requestAnimationFrame(() => requestAnimationFrame(() => {
      h.querySelectorAll('.rw-word').forEach((w, i) => {
        setTimeout(() => w.classList.add('in'), i * 80);
      });
    }));
  }

  document.querySelectorAll('h1').forEach(h => {
    splitWords(h);

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.unobserve(h);
      revealWords(h);
    }, { threshold: 0, rootMargin: '0px' });

    obs.observe(h);
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

  const selectors = '.s-label, .hero-tag, .hero-meta, .hero-sub, p, .btn, .hero-cta, h2, .hero-badge';
  const els = hero.querySelectorAll(selectors);
  if (!els.length) return;

  els.forEach((el, i) => {
    /* Ne pas interférer avec les éléments déjà animés autrement */
    if (el.closest('.rw-word')) return;
    el.classList.add('hero-reveal');
    el.style.animationDelay = (0.15 + i * 0.11) + 's';
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

    requestAnimationFrame(blobLoop);
  })();
})();

/* ── CARDS 3D TILT (desktop uniquement) ── */
(function initCardTilt() {
  if (isTouch) return;

  const SEL = '.proj-card, .feat-card, .atelier-card, .media-card';
  document.querySelectorAll(SEL).forEach(card => {
    card.addEventListener('pointermove', e => {
      const r  = card.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width  - 0.5; /* -0.5 → +0.5 */
      const ny = (e.clientY - r.top)  / r.height - 0.5;
      const rx = -ny * 10; /* max ±5deg sur X */
      const ry =  nx * 10; /* max ±5deg sur Y */
      card.style.transform =
        `perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.016)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
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
        .filter(el => !el.closest('.hero, .atelier-hero, .bdc-hero, .media-hero, .collectif-hero'));

      children.forEach((el, i) => {
        if (el.classList.contains('sr-el')) return; /* déjà marqué */
        el.classList.add('sr-el');
        /* Double rAF pour s'assurer que opacity:0 est peint avant l'animation */
        requestAnimationFrame(() => requestAnimationFrame(() => {
          el.classList.add('sr-in');
          el.style.animationDelay = (i * 0.07) + 's';
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

/* ── CURSOR TRAIL PARTICLES ── */
(function initCursorTrail() {
  if (isTouch) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let lastX = 0, lastY = 0, frameCount = 0;
  const INTERVAL = 3; /* 1 particule tous les N frames */

  document.addEventListener('mousemove', e => {
    lastX = e.clientX; lastY = e.clientY;
  });

  (function trailLoop() {
    frameCount++;
    if (frameCount % INTERVAL === 0) {
      const dot = document.createElement('div');
      dot.className = 'cursor-trail';
      dot.style.left = lastX + 'px';
      dot.style.top  = lastY + 'px';
      /* Légère variation de taille */
      const s = 0.5 + Math.random() * 0.8;
      dot.style.transform = `translate(-50%,-50%) scale(${s.toFixed(2)})`;
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 580);
    }
    requestAnimationFrame(trailLoop);
  })();
})();

/* ── HERO H1 GRADIENT ANIMÉ ── */
(function initGradientText() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* Cible le premier h1 dans le hero, hors word-reveal (pour ne pas casser l'anim) */
  const hero = document.querySelector('.hero, .atelier-hero, .bdc-hero, .media-hero, .collectif-hero');
  if (!hero) return;

  const h1 = hero.querySelector('h1');
  if (!h1) return;

  /* Si le h1 contient un word-reveal, on applique sur les spans directs uniquement
     via une classe sur le h1 lui-même (CSS background-clip) */
  h1.classList.add('hero-gradient-text');
})();

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
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  function scramble(el) {
    const original = el.dataset.original || el.textContent.trim();
    el.dataset.original = original;

    let frame = 0;
    const totalFrames = 14;
    const interval = setInterval(() => {
      el.textContent = [...original].map((ch, i) => {
        if (ch === ' ') return ' ';
        if (frame / totalFrames > i / original.length) return ch;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');

      if (++frame > totalFrames) {
        clearInterval(interval);
        el.textContent = original;
      }
    }, 28);
  }

  document.querySelectorAll('.lg-strip-name').forEach(el => {
    el.closest('.lg-strip')?.addEventListener('mouseenter', () => scramble(el));
  });
})();
