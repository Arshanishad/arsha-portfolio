document.addEventListener('DOMContentLoaded', () => {

  /* ========== THEME TOGGLE ========== */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  setTheme(initialTheme);

  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
  });

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeToggle.innerHTML = theme === 'dark'
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  }

  /* ========== MOBILE NAV ========== */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('is-open');
    navLinks.classList.toggle('is-open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('is-open');
      navLinks.classList.remove('is-open');
    });
  });

  /* ========== SCROLL PROGRESS + NAVBAR SHADOW ========== */
  const scrollProgress = document.getElementById('scrollProgress');
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    navbar.classList.toggle('is-scrolled', scrollTop > 20);
  }, { passive: true });

  /* ========== ACTIVE SECTION HIGHLIGHTING ========== */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = 'home';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 140) {
        current = section.getAttribute('id');
      }
    });
    navLinksAll.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  /* ========== SCROLL REVEAL ========== */

  /* ========== GITHUB CONTRIBUTIONS ========== */
  (async () => {
    const ghGraph = document.getElementById('ghGraph');
    const ghMonths = document.getElementById('ghMonths');
    const ghTotal = document.getElementById('ghTotal');
    if (!ghGraph) return;

    const username = 'Arshanishad'; // your GitHub username
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    try {
      const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
      const data = await res.json();
      const days = data.contributions;

      ghTotal.textContent = `${days.reduce((s, d) => s + d.count, 0).toLocaleString()} contributions in the last year`;

      // Build week columns (Sun→Sat), padding start
      const weeks = [];
      let currentWeek = [];
      days.forEach((day, i) => {
        const dow = new Date(day.date).getDay();
        if (i === 0) for (let j = 0; j < dow; j++) currentWeek.push(null);
        currentWeek.push(day);
        if (dow === 6) { weeks.push(currentWeek); currentWeek = []; }
      });
      if (currentWeek.length) weeks.push(currentWeek);

      // Render cells
      weeks.forEach(week => {
        for (let d = 0; d < 7; d++) {
          const day = week[d];
          const cell = document.createElement('span');
          cell.className = 'gh-cell';
          if (day) {
            cell.dataset.level = day.level;
            cell.title = `${day.count} contribution${day.count === 1 ? '' : 's'} on ${day.date}`;
          } else {
            cell.style.visibility = 'hidden';
          }
          ghGraph.appendChild(cell);
        }
      });

      // Render month labels aligned to week columns
      let lastMonth = -1;
      weeks.forEach(week => {
        const firstRealDay = week.find(d => d);
        if (!firstRealDay) return;
        const month = new Date(firstRealDay.date).getMonth();
        const label = document.createElement('span');
        if (month !== lastMonth) {
          label.textContent = monthNames[month];
          lastMonth = month;
        }
        ghMonths.appendChild(label);
      });
    } catch (err) {
      ghTotal.textContent = 'Could not load GitHub activity right now.';
      console.error('GitHub contributions error:', err);
    }
  })();

  /* ========== FOOTER YEAR ========== */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ========== TYPING ANIMATION ========== */
  const roles = [
    "Flutter Developer",
    "Mobile App Developer",
    "Cross-Platform Developer"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingElement = document.getElementById("typing-text");

  function typeEffect() {
    const current = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typingElement.textContent = current.substring(0, charIndex);

    let speed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === current.length) {
      speed = 1200;
      isDeleting = true;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 300;
    }

    setTimeout(typeEffect, speed);
  }

  typeEffect();

  /* ========== GALLERY / CAROUSEL ========== */
  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const track = gallery.querySelector('.gallery-track');
    const slides = gallery.querySelectorAll('.gallery-slide');
    const dotsContainer = gallery.querySelector('.gallery-dots');
    const prevBtn = gallery.querySelector('.gallery-arrow.prev');
    const nextBtn = gallery.querySelector('.gallery-arrow.next');

    if (!slides.length) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Create dots
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('button');

    function goToSlide(index) {
      currentIndex = (index + totalSlides) % totalSlides;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Keyboard navigation
    gallery.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault();
        goToSlide(currentIndex - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault();
        goToSlide(currentIndex + 1); }
    });

    // Touch swipe support
    let startX = 0;
    let isDragging = false;
    gallery.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });
    gallery.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const diff = startX - e.touches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) goToSlide(currentIndex + 1);
        else goToSlide(currentIndex - 1);
        isDragging = false;
      }
    });
  });

  /* ========== LIGHTBOX ========== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let lightboxImages = [];
  let lightboxIndex = 0;

  // Open lightbox on gallery slide click
  document.querySelectorAll('.gallery-slide').forEach((slide, index) => {
    slide.addEventListener('click', () => {
      const gallery = slide.closest('[data-gallery]');
      const allSlides = gallery.querySelectorAll('.gallery-slide');
      lightboxImages = Array.from(allSlides).map(s => s.querySelector('img').src);
      lightboxIndex = Array.from(allSlides).indexOf(slide);
      openLightbox(lightboxIndex);
    });
  });

  function openLightbox(index) {
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    updateLightboxImage(index);
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function updateLightboxImage(index) {
    lightboxIndex = (index + lightboxImages.length) % lightboxImages.length;
    lightboxImg.src = lightboxImages[lightboxIndex];
    lightboxImg.alt = `Screenshot ${lightboxIndex + 1}`;
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => updateLightboxImage(lightboxIndex - 1));
  lightboxNext.addEventListener('click', () => updateLightboxImage(lightboxIndex + 1));

  // Close lightbox on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard shortcuts for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateLightboxImage(lightboxIndex - 1);
    if (e.key === 'ArrowRight') updateLightboxImage(lightboxIndex + 1);
  });

  /* ========== SMOOTH SCROLL FOR NAV LINKS ========== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ========== DYNAMIC DOTS BACKGROUND (CSS handles this) ========== */
  // The moving dots background is controlled entirely by CSS
  // No JavaScript needed - it's handled by the animation in style.css
  console.log('✨ Moving dots background active (CSS animation)');

});