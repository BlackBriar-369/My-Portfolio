const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = [...document.querySelectorAll('.nav-menu a')];
const year = document.querySelector('#year');
const copyEmailButton = document.querySelector('.copy-email');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxCaption = document.querySelector('#lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
let lastFocusedElement = null;

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const sections = [...document.querySelectorAll('main section[id]')];

const setActiveLink = () => {
  const scrollPosition = window.scrollY + 130;
  let currentId = '';

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPosition) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === `#${currentId}`);
  });
};

window.addEventListener('scroll', setActiveLink, { passive: true });
window.addEventListener('resize', setActiveLink);
setActiveLink();

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  document.querySelectorAll('.reveal').forEach((element) => {
    element.classList.add('is-visible');
  });
}

if (copyEmailButton) {
  copyEmailButton.addEventListener('click', async () => {
    const email = copyEmailButton.dataset.email;

    try {
      await navigator.clipboard.writeText(email);
      copyEmailButton.textContent = 'Email copied';
      copyEmailButton.classList.add('is-copied');

      window.setTimeout(() => {
        copyEmailButton.textContent = 'Copy email';
        copyEmailButton.classList.remove('is-copied');
      }, 1800);
    } catch (error) {
      window.location.href = `mailto:${email}`;
    }
  });
}

const openLightbox = (imageSrc, title) => {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;

  lastFocusedElement = document.activeElement;
  lightboxImage.src = imageSrc;
  lightboxImage.alt = title || 'Preview image';
  lightboxCaption.textContent = title || 'Preview';
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightboxClose?.focus();
};

const closeLightbox = () => {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;

  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  window.setTimeout(() => {
    lightboxImage.src = '';
    lightboxCaption.textContent = '';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }, 180);
};

document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openLightbox(trigger.dataset.lightbox, trigger.dataset.title);
  });
});

if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox?.classList.contains('is-open')) {
    closeLightbox();
  }
});
// Get the button
const backToTopButton = document.getElementById("backToTop");

// Show the button when user scrolls down
window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
};

// Smooth scroll to top on click
backToTopButton.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
