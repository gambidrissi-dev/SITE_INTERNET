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


/* PAGE TRANSITION */
(function() {
  // Créer l'overlay — opacity 0 inline AVANT append pour éviter tout flash
  const overlay = document.createElement('div');
  overlay.id = 'page-transition';
  overlay.style.cssText = 'opacity:0;pointer-events:none;transition:none;';
  document.body.appendChild(overlay);
  // Réactiver la transition après le premier paint
  requestAnimationFrame(() => requestAnimationFrame(() => {
    overlay.style.transition = '';
  }));

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
    // Fade out → navigation
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
        overlay.style.transition = 'opacity .32s cubic-bezier(.76,0,.24,1)';
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
    'studio':          '<span class=\"hi\">cobalt.</span><span class=\"marquee-sep\"></span>Design d\'espace<span class=\"marquee-sep\"></span>Architecture d\'intérieur<span class=\"marquee-sep\"></span><span class=\"hi\">Nouvelle-Aquitaine</span><span class=\"marquee-sep\"></span>Réhabilitation<span class=\"marquee-sep\"></span>Mobilier sur mesure<span class=\"marquee-sep\"></span>Angoulême · Bordeaux · Bayonne<span class=\"marquee-sep\"></span>',
    'atelier':         '<span class=\"hi\">l\'atelier.</span><span class=\"marquee-sep\"></span>Fabrication sur mesure<span class=\"marquee-sep\"></span>Prototypage<span class=\"marquee-sep\"></span><span class=\"hi\">Angoulême</span><span class=\"marquee-sep\"></span>Design d\'objet<span class=\"marquee-sep\"></span>Série limitée<span class=\"marquee-sep\"></span>Bois · Métal · Béton<span class=\"marquee-sep\"></span>',
    'bleu-de-cobalt':  '<span class=\"hi\">bleu de cobalt.</span><span class=\"marquee-sep\"></span>Programme architectural<span class=\"marquee-sep\"></span>Cabinets partenaires<span class=\"marquee-sep\"></span><span class=\"hi\">Nouvelle-Aquitaine</span><span class=\"marquee-sep\"></span>Accompagnement<span class=\"marquee-sep\"></span>Réseau<span class=\"marquee-sep\"></span>',
    'media':           '<span class=\"hi\">le média.</span><span class=\"marquee-sep\"></span>Architalk<span class=\"marquee-sep\"></span>Journal<span class=\"marquee-sep\"></span><span class=\"hi\">Architecture</span><span class=\"marquee-sep\"></span>Design<span class=\"marquee-sep\"></span>Culture constructive<span class=\"marquee-sep\"></span>',
  };
  const item = CONTENT[slug] || '<span class=\"hi\">cobalt.</span><span class=\"marquee-sep\"></span>Architecture<span class=\"marquee-sep\"></span>Design d\'espace<span class=\"marquee-sep\"></span>Fabrication<span class=\"marquee-sep\"></span><span class=\"hi\">Nouvelle-Aquitaine</span><span class=\"marquee-sep\"></span>';

  const wrap = document.createElement('div');
  wrap.className = 'marquee-wrap';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML = `<div class="marquee-track"><span class="marquee-item">${item}</span><span class="marquee-item">${item}</span></div>`;

  // Insérer après le premier <section> de la page
  const firstSection = document.querySelector('section');
  if (firstSection && firstSection.nextSibling) {
    firstSection.parentNode.insertBefore(wrap, firstSection.nextSibling);
  } else {
    // Fallback : après la nav
    const nav = document.querySelector('body > nav');
    if (nav) nav.insertAdjacentElement('afterend', wrap);
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
    div.style.cssText = `
      position:absolute;
      left:${x}%; top:${y}%;
      width:${size}vw;
      transform:rotate(${rot}deg) translateZ(0);
      opacity:1;
      color:${cfg.color};
    `;
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
  div.style.cssText = `right:-5%;bottom:-10%;width:28vw;transform:rotate(-8deg);color:${color};`;
  div.innerHTML = `<svg viewBox="0 0 750 450" fill="currentColor" xmlns="http://www.w3.org/2000/svg">${SHAPE_SVG[key]}</svg>`;
  target.appendChild(div);
})();
