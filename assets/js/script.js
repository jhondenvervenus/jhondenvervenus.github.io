(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = document.querySelector('.header');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const revealElements = document.querySelectorAll('.scroll-reveal, .education-item');
  const heroElements = document.querySelectorAll('.hero-greeting, .hero-name, .hero-title, .hero-description, .hero-actions, .hero-social');

  function initHeaderScroll() {
    let lastScroll = 0;
    const threshold = 20;

    function onScroll() {
      const currentScroll = window.scrollY;

      if (currentScroll > threshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initMobileMenu() {
    if (!mobileMenuBtn || !nav || !navOverlay) return;

    function toggleMenu() {
      const isActive = mobileMenuBtn.classList.toggle('active');
      nav.classList.toggle('active');
      navOverlay.classList.toggle('active');
      document.body.style.overflow = isActive ? 'hidden' : '';
      mobileMenuBtn.setAttribute('aria-expanded', isActive);
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
          toggleMenu();
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        toggleMenu();
      }
    });
  }

  function initSmoothScroll() {
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });

        link.focus({ preventScroll: true });
      });
    });
  }

  function initActiveNav() {
    const observerOptions = {
      rootMargin: `-${header.offsetHeight}px 0px -60% 0px`,
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  function initScrollReveal() {
    const observerOptions = {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const delay = entry.target.classList.contains('education-item') ? index * 100 : 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  }

  function initHeroAnimations() {
    heroElements.forEach((el, index) => {
      el.style.animationDelay = `${index * 100}ms`;
    });
  }

  function initContactLinkTracking() {
    const contactLinks = document.querySelectorAll('.contact-link[href^="http"]');
    contactLinks.forEach(link => {
      link.addEventListener('click', () => {
        const platform = link.classList.contains('facebook') ? 'Facebook' :
                        link.classList.contains('instagram') ? 'Instagram' :
                        link.classList.contains('github') ? 'GitHub' : 'Unknown';
        if (typeof gtag !== 'undefined') {
          gtag('event', 'contact_click', { platform });
        }
      });
    });
  }

  function initParallax() {
    if (prefersReducedMotion) return;

    const heroGlow = document.querySelector('.hero::before');
    if (!heroGlow) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const hero = document.querySelector('.hero');
          if (hero) {
            const heroHeight = hero.offsetHeight;
            if (scrolled < heroHeight) {
              const progress = scrolled / heroHeight;
              hero.style.setProperty('--parallax-y', `${progress * 30}px`);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });
  }

  function initImageLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });

      if (img.complete) {
        img.classList.add('loaded');
      }
    });
  }

  function init() {
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initActiveNav();
    initScrollReveal();
    initHeroAnimations();
    initContactLinkTracking();
    initParallax();
    initKeyboardNavigation();
    initImageLoading();

    document.body.classList.add('js-loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();