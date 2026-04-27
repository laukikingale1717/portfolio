/* ═══════════════════════════════════════════════════════════════
   EXAMGUARD AI - INTERACTIVE JAVASCRIPT
   Author: Laukik Ingale, Mehul Katakiya, Prathmesh Wagh
═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── NAVBAR: SCROLL & MOBILE TOGGLE ───────────────────────────
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveLink();
  toggleBackToTop();
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  // Animate hamburger bars
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  }
});

// Close nav on link click (mobile)
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  });
});

// ─── ACTIVE NAV LINK ON SCROLL ────────────────────────────────
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);

    if (scrollPos >= top && scrollPos < bottom) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      if (link) link.classList.add('active');
    }
  });
}

// ─── SCROLL REVEAL ANIMATION ──────────────────────────────────
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger child reveals if multiple become visible together
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ─── COUNTER ANIMATION ────────────────────────────────────────
const counters = document.querySelectorAll('.counter');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000; // ms
  const step     = Math.ceil(target / (duration / 16));
  let current    = 0;

  const update = () => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current < target) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

// ─── BACK TO TOP BUTTON ───────────────────────────────────────
const backToTop = document.getElementById('backToTop');

function toggleBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── CONTACT FORM ─────────────────────────────────────────────
function handleContact(e) {
  e.preventDefault();
  const msgEl = document.getElementById('formMsg');
  const btn   = e.target.querySelector('button[type="submit"]');
  const origText = btn.innerHTML;

  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  // Simulate async submission (replace with real backend / Formspree / Netlify Forms)
  setTimeout(() => {
    msgEl.textContent = '✓ Message sent! We\'ll get back to you shortly.';
    msgEl.style.color = 'var(--accent-green)';
    e.target.reset();
    btn.innerHTML = origText;
    btn.disabled = false;
    setTimeout(() => { msgEl.textContent = ''; }, 5000);
  }, 1500);
}

// ─── SMOOTH ANCHOR SCROLL (OFFSET FOR NAVBAR) ─────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── TYPING EFFECT ON TAGLINE ─────────────────────────────────
function typeWriter(el, text, speed = 55) {
  el.textContent = '';
  let i = 0;
  const cursor = document.createElement('span');
  cursor.textContent = '|';
  cursor.style.cssText = 'animation: blink 1s step-end infinite; color: var(--accent-cyan);';
  el.appendChild(cursor);

  const type = () => {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i++]), cursor);
      setTimeout(type, speed);
    } else {
      setTimeout(() => cursor.remove(), 1500);
    }
  };
  type();
}

// Wait for the hero tagline to be visible, then type it
const taglineEl = document.querySelector('.hero-tagline');
if (taglineEl) {
  const originalText = taglineEl.textContent.trim();
  taglineEl.textContent = '';
  const tagObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => typeWriter(taglineEl, originalText), 600);
        tagObs.unobserve(taglineEl);
      }
    });
  }, { threshold: 0.5 });
  tagObs.observe(taglineEl);
}

// ─── INIT ──────────────────────────────────────────────────────
// Ensure hero elements are visible on load (no lag)
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 120);
  });
});

console.log(
  '%c ExamGuard AI 🎓 ',
  'background: linear-gradient(135deg, #00d4ff, #3b82f6); color: #000; font-weight: bold; font-size: 14px; padding: 8px 16px; border-radius: 8px;'
);
console.log('%c Built by Laukik Ingale, Mehul Katakiya & Prathmesh Wagh', 'color: #94a3b8; font-size: 12px;');
