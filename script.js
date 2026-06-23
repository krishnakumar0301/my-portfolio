'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initContactForm();
  initScrollToTop();
  initDownloadResume();
});

function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
    }, 2000);
  });
}



function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const navLinks = document.querySelectorAll('.nav-link');
  const path = window.location.pathname;

  let currentPage = 'home';
  if (path.includes('about')) currentPage = 'about';
  else if (path.includes('projects')) currentPage = 'projects';
  else if (path.includes('contact')) currentPage = 'contact';

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const isHome = currentPage === 'home' && (href === 'index.html' || href === '/');
    if (href === `${currentPage}.html` || isHome) {
      link.classList.add('active');
    }
  });

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  const links = navLinks.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach((el) => observer.observe(el));
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const formSuccess = document.getElementById('formSuccess');

  const fields = {
    name: {
      element: document.getElementById('name'),
      error: document.getElementById('nameError'),
      validate: (value) => {
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      }
    },
    email: {
      element: document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate: (value) => {
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      }
    },
    subject: {
      element: document.getElementById('subject'),
      error: document.getElementById('subjectError'),
      validate: (value) => {
        if (!value.trim()) return 'Subject is required';
        if (value.trim().length < 3) return 'Subject must be at least 3 characters';
        return '';
      }
    },
    message: {
      element: document.getElementById('message'),
      error: document.getElementById('messageError'),
      validate: (value) => {
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        return '';
      }
    }
  };

  Object.values(fields).forEach(({ element, error, validate }) => {
    element.addEventListener('blur', () => {
      const message = validate(element.value);
      error.textContent = message;
      element.classList.toggle('error', !!message);
    });

    element.addEventListener('input', () => {
      if (element.classList.contains('error')) {
        const message = validate(element.value);
        error.textContent = message;
        element.classList.toggle('error', !!message);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formSuccess.classList.remove('show');

    let isValid = true;

    Object.values(fields).forEach(({ element, error, validate }) => {
      const message = validate(element.value);
      error.textContent = message;
      element.classList.toggle('error', !!message);
      if (message) isValid = false;
    });

    if (isValid) {
      formSuccess.classList.add('show');
      form.reset();
      Object.values(fields).forEach(({ element }) => {
        element.classList.remove('error');
      });

      setTimeout(() => {
        formSuccess.classList.remove('show');
      }, 5000);
    }
  });
}

function initScrollToTop() {
  const scrollTopBtn = document.getElementById('scrollTop');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initDownloadResume() {
  const btn = document.getElementById('downloadResume');
  if (!btn) return;

  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('resume.pdf');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Krishna_Kumar_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      window.location.href = 'resume.pdf';
    }
  });
}


