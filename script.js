'use strict';

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const CONFIG = {
  typedStrings: ['AI Agents', 'RAG Systems', 'Voice AI', 'LLM Automation', 'Multi-Agent Apps'],
  typedSpeed:     50,
  typedBackSpeed: 28,

  particles: {
    number:  { value: 60, density: { enable: true, value_area: 900 } },
    color:   { value: ['#00f5ff', '#8b5cf6'] },
    shape:   { type: 'circle' },
    opacity: { value: 0.45, random: true, anim: { enable: true, speed: 1, opacity_min: 0.08 } },
    size:    { value: 2.2, random: true },
    line_linked: {
      enable: true, distance: 140, color: '#00f5ff', opacity: 0.1, width: 1
    },
    move: {
      enable: true, speed: 1.2, direction: 'none', random: true, out_mode: 'out'
    }
  },

  tiltMax:   12,
  tiltSpeed: 400,
};

// ─── CUSTOM CURSOR GLOW ──────────────────────────────────────────────────────

const CursorGlow = {
  el: null,

  init() {
    this.el = document.getElementById('cursorGlow');
    if (!this.el || window.matchMedia('(pointer: coarse)').matches) return;

    document.addEventListener('mousemove', (e) => {
      this.el.style.opacity = '1';
      this.el.style.left = e.clientX + 'px';
      this.el.style.top  = e.clientY + 'px';
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      this.el.style.opacity = '0';
    });
  }
};

// ─── NAV CONTROLLER ──────────────────────────────────────────────────────────

const NavController = {
  navbar:    null,
  hamburger: null,
  navLinks:  null,
  linkItems: null,

  init() {
    this.navbar    = document.getElementById('navbar');
    this.hamburger = document.getElementById('hamburger');
    this.navLinks  = document.getElementById('navLinks');
    this.linkItems = document.querySelectorAll('.nav-links a[href^="#"]');

    this._bindScroll();
    this._bindHamburger();
    this._bindClose();
    this._bindActiveHighlight();
  },

  _bindScroll() {
    const update = () => this.navbar.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', update, { passive: true });
    update();
  },

  _bindHamburger() {
    this.hamburger.addEventListener('click', () => {
      const open = this.navLinks.classList.toggle('open');
      this.hamburger.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  },

  _bindClose() {
    const close = () => {
      this.navLinks.classList.remove('open');
      this.hamburger.classList.remove('active');
      document.body.style.overflow = '';
    };
    this.linkItems.forEach(l => l.addEventListener('click', close));
    document.addEventListener('click', (e) => {
      if (this.navLinks.classList.contains('open') && !this.navbar.contains(e.target)) close();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  },

  _bindActiveHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (!e.isIntersecting) return;
        this.linkItems.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }),
      { threshold: 0.35, rootMargin: '-80px 0px 0px 0px' }
    );
    sections.forEach(s => io.observe(s));
  }
};

// ─── HERO PARTICLES ──────────────────────────────────────────────────────────

const HeroParticles = {
  init() {
    if (typeof particlesJS === 'undefined') return;
    const cfg = JSON.parse(JSON.stringify(CONFIG.particles));
    if (window.innerWidth < 768) cfg.number.value = 28;
    particlesJS('particles-js', { particles: cfg });
  }
};

// ─── HERO TYPED ──────────────────────────────────────────────────────────────

const HeroTyped = {
  init() {
    const el = document.getElementById('typed-role');
    if (!el || typeof Typed === 'undefined') return;
    new Typed(el, {
      strings:        CONFIG.typedStrings,
      typeSpeed:      CONFIG.typedSpeed,
      backSpeed:      CONFIG.typedBackSpeed,
      loop:           true,
      smartBackspace: true,
      cursorChar:     '_',
    });
  }
};

// ─── SCROLL REVEAL ───────────────────────────────────────────────────────────
// Disabled: elements are always visible. No hidden-until-scroll behaviour.

const ScrollReveal = {
  init() { /* intentionally empty */ }
};

// ─── COUNTER ANIMATOR ────────────────────────────────────────────────────────

const CounterAnimator = {
  init() {
    const els = document.querySelectorAll('.stat-number[data-target]');
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        let current  = 0;
        const inc    = target / (1400 / 16);

        const tick = () => {
          current += inc;
          if (current >= target) { el.textContent = target + '+'; return; }
          el.textContent = Math.floor(current);
          requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        io.unobserve(el);
      }),
      { threshold: 0.6 }
    );

    els.forEach(el => io.observe(el));
  }
};

// ─── PROJECT TILT ────────────────────────────────────────────────────────────

const ProjectTilt = {
  init() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('[data-tilt]').forEach(card => {
      const max = CONFIG.tiltMax;

      card.addEventListener('mousemove', (e) => {
        const r  = card.getBoundingClientRect();
        const x  = ((e.clientX - r.left)  / r.width  - 0.5) * 2;
        const y  = ((e.clientY - r.top)   / r.height - 0.5) * 2;
        card.style.transform  = `perspective(1000px) rotateX(${-y * max}deg) rotateY(${x * max}deg) scale3d(1.02,1.02,1.02)`;
        card.style.transition = 'transform 0.08s ease';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform  = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
        card.style.transition = `transform ${CONFIG.tiltSpeed}ms cubic-bezier(0.25,0.46,0.45,0.94)`;
      });
    });
  }
};

// ─── CONTACT FORM — Web3Forms (real email delivery) ──────────────────────────
// Setup: go to https://web3forms.com → enter vaibhavdubey047@gmail.com → copy key
// Paste the key in index.html inside: <input id="w3fKey" value="YOUR_KEY_HERE" />

const ContactForm = {
  form:     null,
  statusEl: null,
  timer:    null,

  init() {
    this.form     = document.getElementById('contactForm');
    this.statusEl = document.getElementById('formStatus');
    if (!this.form) return;
    this.form.addEventListener('submit', (e) => this._handle(e));
  },

  _handle(e) {
    e.preventDefault();

    const name    = this.form.querySelector('#name').value.trim();
    const email   = this.form.querySelector('#email').value.trim();
    const subject = this.form.querySelector('#msgsubject').value.trim();
    const message = this.form.querySelector('#message').value.trim();
    const key     = (this.form.querySelector('#w3fKey') || {}).value || '';
    const btn     = this.form.querySelector('button[type="submit"]');

    if (!name || !email || !subject || !message) {
      return this._status('Please fill in all fields.', 'error');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return this._status('Please enter a valid email address.', 'error');
    }

    // No key yet → fallback to mailto
    if (!key || key === 'YOUR_WEB3FORMS_KEY') {
      const mailto =
        `mailto:vaibhavdubey830@gmail.com` +
        `?subject=${encodeURIComponent(subject + ' — from ' + name)}` +
        `&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
      window.location.href = mailto;
      return;
    }

    btn.innerHTML = '<span>Sending…</span><i class="fas fa-spinner fa-spin"></i>';
    btn.disabled  = true;

    fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        name,
        email,
        subject:    subject + ' — Portfolio Contact',
        message:    `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      }),
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        this._status("Message sent! I'll reply soon.", 'success');
        this.form.reset();
      } else {
        this._status('Could not send. Please email me directly.', 'error');
      }
    })
    .catch(() => this._status('Network error. Please try again.', 'error'))
    .finally(() => {
      btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
      btn.disabled  = false;
    });
  },

  _status(msg, type) {
    if (!this.statusEl) return;
    this.statusEl.textContent = msg;
    this.statusEl.className   = `form-status ${type}`;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.statusEl.textContent = '';
      this.statusEl.className   = 'form-status';
    }, 5000);
  }
};

// ─── GSAP ANIMATIONS ─────────────────────────────────────────────────────────
// Uses fromTo() so destination is always opacity:1 regardless of CSS state

const GsapAnimations = {
  init() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

    this._hero();
    this._skills();
    this._timeline();
    this._titles();
  },

  _hero() {
    const tl = gsap.timeline({ delay: 0.15 });

    // fromTo: explicitly set destination to opacity:1 so CSS values don't interfere
    tl
      .fromTo('.hero-badge',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' })
      .fromTo('.hero-greeting',
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }, '-=0.1')
      .fromTo('.hero-name',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.15')
      .fromTo('.hero-title',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45 }, '-=0.25')
      .fromTo('.hero-terminal',
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' }, '-=0.2')
      .fromTo('.hero-bio',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
      .fromTo('.hero-stack',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
      .fromTo('.hero-cta-group',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
      .fromTo('.hero-visual',
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out' }, '-=0.75')
      .fromTo('.hero-scroll-indicator',
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }, '-=0.1');
  },

  _skills() {
    // Skill tags are visible by default — no GSAP needed here.
    // The parent .skill-category already animates via CSS [data-reveal].
  },

  _timeline() {
    // No scroll-triggered hide — timeline items always visible.
  },

  _titles() {
    // No scroll-triggered hide — section titles always visible.
  }
};

// ─── SMOOTH SCROLL ───────────────────────────────────────────────────────────

const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }
};

// ─── INIT ────────────────────────────────────────────────────────────────────

function boot() {
  CursorGlow.init();
  SmoothScroll.init();
  NavController.init();
  HeroParticles.init();
  HeroTyped.init();
  ScrollReveal.init();
  CounterAnimator.init();
  ProjectTilt.init();
  ContactForm.init();

  // GSAP scripts are deferred — retry if not yet loaded
  const tryGsap = () => {
    if (typeof gsap !== 'undefined') {
      GsapAnimations.init();
    } else {
      requestAnimationFrame(tryGsap);
    }
  };

  tryGsap();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
