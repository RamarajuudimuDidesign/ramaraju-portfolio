/* ============================================================
   RAMARAJU UDIMUDI — PORTFOLIO INTERACTIONS
   ============================================================ */

/* Theme is applied immediately by an inline script in <head> (see index.html)
   so it's already correct before this file even loads — no flash, no reset. */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Theme toggle ---------------- */
  const themeSwitch = document.getElementById('themeSwitch');
  if (themeSwitch) {
    themeSwitch.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem('ru-theme', next);
      } catch (e) {
        /* localStorage unavailable (private mode / blocked storage) —
           theme still applies for this session, just won't persist. */
      }
    });
  }

  /* ---------------- Mouse spotlight ---------------- */
  const spotlight = document.querySelector('.spotlight');
  if (spotlight) {
    window.addEventListener('mousemove', e => {
      spotlight.style.setProperty('--sx', e.clientX + 'px');
      spotlight.style.setProperty('--sy', e.clientY + 'px');
    });
  }

  /* ---------------- Button ripple ---------------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const r = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(r.width, r.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - r.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - r.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---------------- Active section nav indicator ---------------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const navIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const id = '#' + en.target.id;
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
      }
    });
  }, { threshold: 0.5, rootMargin: '-90px 0px -50% 0px' });
  sections.forEach(s => navIO.observe(s));

  /* ---------------- Preloader ----------------
     Tracks real page-load progress (fast on repeat visits / fast connections)
     instead of an artificial timer, and is hard-capped so it can never
     leave the page stuck. */
  const pre = document.getElementById('preloader');
  const preFill = document.querySelector('.pre-bar-fill');
  const prePct = document.querySelector('.pre-pct');
  let finished = false;

  function setProgress(pct) {
    if (finished) return;
    preFill.style.width = pct + '%';
    prePct.textContent = Math.floor(pct) + '%';
  }

  function finishPreloader() {
    if (finished) return;
    finished = true;
    setProgress(100);
    if (pre) pre.classList.add('done');
    document.body.style.overflow = '';
  }

  document.body.style.overflow = 'hidden';
  setProgress(20);

  if (document.readyState === 'complete') {
    setProgress(90);
    finishPreloader();
  } else {
    window.addEventListener('load', () => {
      setProgress(90);
      finishPreloader();
    });
  }

  /* Absolute safety net: never let the preloader block the page. */
  setTimeout(finishPreloader, 700);

  /* ---------------- Custom cursor ---------------- */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  (function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .tilt, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  /* ---------------- Header scroll state ---------------- */
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ---------------- Scroll progress ---------------- */
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if (progressBar) progressBar.style.width = pct + '%';
  });

  /* ---------------- Reveal on scroll ---------------- */
  const revealEls = document.querySelectorAll('.rv');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('on'); });
  }, { threshold: 0.14 });
  revealEls.forEach(el => io.observe(el));

  /* ---------------- Hero parallax (mouse) ---------------- */
  const meshes = document.querySelectorAll('.mesh');
  window.addEventListener('mousemove', e => {
    const cx = (e.clientX / window.innerWidth - 0.5);
    const cy = (e.clientY / window.innerHeight - 0.5);
    meshes.forEach((m, i) => {
      const depth = (i + 1) * 14;
      m.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
    });
  });

  /* ---------------- Typing role animation ---------------- */
  const roles = ['Product Designer', 'UI / UX Designer', 'Front-End Designer'];
  const typeEl = document.getElementById('typeRole');
  if (typeEl) {
    let ri = 0, ci = 0, deleting = false;
    (function typeLoop() {
      const word = roles[ri];
      if (!deleting) {
        ci++;
        typeEl.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; setTimeout(typeLoop, 1400); return; }
      } else {
        ci--;
        typeEl.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
      }
      setTimeout(typeLoop, deleting ? 35 : 65);
    })();
  }

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      const start = performance.now();
      function step(now) {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = target * eased;
        el.textContent = (target % 1 === 0 ? Math.floor(val) : val.toFixed(1)) + suffix;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterIO.observe(el));

  /* ---------------- Skill progress rings ---------------- */
  const rings = document.querySelectorAll('.skill-ring .fg');
  const ringIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const circle = en.target;
      const pct = parseFloat(circle.dataset.pct);
      const r = circle.r.baseVal.value;
      const c = 2 * Math.PI * r;
      circle.style.strokeDasharray = c;
      circle.style.strokeDashoffset = c;
      requestAnimationFrame(() => {
        circle.style.strokeDashoffset = c - (pct / 100) * c;
      });
      ringIO.unobserve(circle);
    });
  }, { threshold: 0.4 });
  rings.forEach(r => ringIO.observe(r));

  /* ---------------- Skill filter ---------------- */
  const skillChips = document.querySelectorAll('[data-skill-filter]');
  const skillCards = document.querySelectorAll('.skill-card');
  skillChips.forEach(chip => {
    chip.addEventListener('click', () => {
      skillChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const val = chip.dataset.skillFilter;
      skillCards.forEach(card => {
        const show = val === 'all' || card.dataset.cat === val;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---------------- Project filter ---------------- */
  const projChips = document.querySelectorAll('[data-proj-filter]');
  const projRows = document.querySelectorAll('.project-row');
  projChips.forEach(chip => {
    chip.addEventListener('click', () => {
      projChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const val = chip.dataset.projFilter;
      projRows.forEach(row => {
        const tags = (row.dataset.tags || '').split(',');
        const show = val === 'all' || tags.includes(val);
        row.classList.toggle('hidden-item', !show);
      });
    });
  });

  /* ---------------- Process step reveal ---------------- */
  const steps = document.querySelectorAll('.process-step');
  const stepIO = new IntersectionObserver(entries => {
    entries.forEach((en, i) => {
      if (en.isIntersecting) {
        setTimeout(() => en.target.classList.add('on'), i * 90);
        stepIO.unobserve(en.target);
      }
    });
  }, { threshold: 0.4 });
  steps.forEach(s => stepIO.observe(s));

  /* ---------------- Experience expand ---------------- */
  document.querySelectorAll('.tl-more').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.tl-card').classList.toggle('open');
    });
  });

  /* ---------------- Project card "Case Study" expand ----------------
     Extra content (challenge/solution) is collapsed by default so every
     card in the grid renders at the same height. Toggling one card only
     expands that card — it never pushes its neighbours taller. */
  document.querySelectorAll('.project-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.project-row');
      const open = row.classList.toggle('case-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---------------- Tilt cards ---------------- */
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ---------------- Magnetic buttons ---------------- */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.28}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ---------------- Mobile nav ---------------- */
  const burger = document.querySelector('.nav-burger');
  const mobileNav = document.getElementById('mobileNav');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => mobileNav.classList.toggle('open'));
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));
  }

  /* ---------------- Contact form (front-end only) ---------------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.querySelector('#cf-name').value.trim();
      const email = form.querySelector('#cf-email').value.trim();
      const msg = form.querySelector('#cf-msg').value.trim();
      const subject = encodeURIComponent(`Portfolio inquiry from ${name || 'a visitor'}`);
      const body = encodeURIComponent(`${msg}\n\n— ${name} (${email})`);
      window.location.href = `mailto:ramarajuudimudi0@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  /* ---------------- Gallery: Load More ----------------
     Extra creatives are hidden behind .gallery-extra until the button
     is clicked, so the section starts compact and expands on demand. */
  const loadMoreBtn = document.getElementById('loadMoreCreatives');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      const targetId = loadMoreBtn.dataset.target;
      const grid = document.getElementById(targetId);
      const hidden = grid ? grid.querySelectorAll('.gallery-extra:not(.show)') : [];
      hidden.forEach(item => item.classList.add('show'));
      loadMoreBtn.style.display = 'none';
    });
  }

  /* ---------------- Lightbox (click a creative to expand) ----------------
     Groups items by [data-lightbox="group"] so each gallery can be
     browsed with prev/next without leaving the overlay. Extra designs
     can simply be added as more .gallery-item elements later — they'll
     automatically join the same lightbox group. */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = document.getElementById('lightboxImg');
    const lbCount = document.getElementById('lightboxCount');
    const lbClose = document.getElementById('lightboxClose');
    const lbPrev = document.getElementById('lightboxPrev');
    const lbNext = document.getElementById('lightboxNext');

    let group = [];
    let idx = 0;

    function openLightbox(items, startIndex) {
      group = items;
      idx = startIndex;
      renderLightbox();
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function renderLightbox() {
      const img = group[idx];
      lbImg.src = img.src;
      lbImg.alt = img.alt || '';
      lbCount.textContent = (idx + 1) + ' / ' + group.length;
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function step(dir) {
      idx = (idx + dir + group.length) % group.length;
      renderLightbox();
    }

    document.querySelectorAll('[data-lightbox]').forEach(item => {
      item.addEventListener('click', () => {
        const groupName = item.dataset.lightbox;
        const groupItems = Array.from(
          document.querySelectorAll(`[data-lightbox="${groupName}"] img`)
        );
        const clickedImg = item.querySelector('img');
        const startIndex = groupItems.indexOf(clickedImg);
        openLightbox(groupItems, Math.max(0, startIndex));
      });
    });

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', () => step(-1));
    lbNext.addEventListener('click', () => step(1));
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  /* ---------------- Smooth anchor scroll ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 90, behavior: 'smooth' });
      }
    });
  });

});
