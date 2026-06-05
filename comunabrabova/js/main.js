/* ============================================================
   Primăria Comunei Brabova — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Hamburger Menu Toggle
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger-btn');
  const mainNav   = document.getElementById('main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'Închide meniul' : 'Deschide meniul');
    });

    /* Close mobile menu when a nav link is clicked */
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Deschide meniul');
      });
    });

    /* Close menu on outside click */
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mainNav.contains(e.target)) {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ----------------------------------------------------------
     Sticky Header Behavior
  ---------------------------------------------------------- */
  const header = document.getElementById('site-header');

  if (header) {
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     Active Nav Link (based on current page)
  ---------------------------------------------------------- */
  const navLinks = document.querySelectorAll('#main-nav li a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (
      href === currentPage ||
      (currentPage === '' && href === 'index.html') ||
      (currentPage === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ----------------------------------------------------------
     Smooth Scroll for anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     Filter Bar (Anunțuri page)
  ---------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      const filter = this.dataset.filter;
      const cards  = document.querySelectorAll('.anunt-card[data-cat]');

      cards.forEach(function (card) {
        if (filter === 'toate' || card.dataset.cat === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ----------------------------------------------------------
     Contact Form Validation
  ---------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      /* Required fields */
      const requiredFields = contactForm.querySelectorAll('[required]');

      requiredFields.forEach(function (field) {
        const group = field.closest('.form-group');
        const errEl = group ? group.querySelector('.field-error') : null;

        if (!field.value.trim()) {
          field.classList.add('error');
          if (errEl) { errEl.classList.add('visible'); }
          valid = false;
        } else {
          field.classList.remove('error');
          if (errEl) { errEl.classList.remove('visible'); }
        }
      });

      /* Email validation */
      const emailField = contactForm.querySelector('input[type="email"]');
      if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const group = emailField.closest('.form-group');
        const errEl = group ? group.querySelector('.field-error') : null;

        if (!emailRegex.test(emailField.value.trim())) {
          emailField.classList.add('error');
          if (errEl) {
            errEl.textContent = 'Introduceți o adresă de email validă.';
            errEl.classList.add('visible');
          }
          valid = false;
        }
      }

      /* GDPR checkbox */
      const gdprCheck = contactForm.querySelector('#gdpr-consent');
      if (gdprCheck && !gdprCheck.checked) {
        const errEl = document.getElementById('gdpr-error');
        if (errEl) { errEl.classList.add('visible'); }
        valid = false;
      } else if (gdprCheck) {
        const errEl = document.getElementById('gdpr-error');
        if (errEl) { errEl.classList.remove('visible'); }
      }

      if (valid) {
        const successMsg = document.getElementById('form-success');
        if (successMsg) { successMsg.classList.add('visible'); }
        contactForm.reset();

        /* Auto-hide success after 6s */
        setTimeout(function () {
          if (successMsg) { successMsg.classList.remove('visible'); }
        }, 6000);
      }
    });

    /* Real-time validation feedback */
    contactForm.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('blur', function () {
        const group = this.closest('.form-group');
        const errEl = group ? group.querySelector('.field-error') : null;

        if (this.hasAttribute('required') && !this.value.trim()) {
          this.classList.add('error');
          if (errEl) { errEl.classList.add('visible'); }
        } else {
          this.classList.remove('error');
          if (errEl) { errEl.classList.remove('visible'); }
        }
      });
    });
  }

  /* ----------------------------------------------------------
     Scroll-in Animations (subtle)
  ---------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    const animItems = document.querySelectorAll('.card, .stat-card, .anunt-card, .service-card, .monument-card');

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    animItems.forEach(function (item) {
      item.style.opacity = '0';
      item.style.transform = 'translateY(16px)';
      item.style.transition = 'opacity 0.45s ease, transform 0.45s ease, box-shadow 0.22s ease';
      observer.observe(item);
    });
  }

})();
