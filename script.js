// ===== SCROLL REVEAL ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible', 'in');
    }
  });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in, .reveal, .stagger-children');
  animatedElements.forEach(el => observer.observe(el));

  // ===== HERO VIDEO AUTOPLAY FIX =====
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    // Try to play immediately
    const playPromise = heroVideo.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Video is playing
        console.log('Hero video playing');
      }).catch(error => {
        // Autoplay was prevented, try on first user interaction
        console.log('Autoplay blocked, will try on interaction');
        
        const tryPlay = () => {
          heroVideo.play().then(() => {
            document.removeEventListener('click', tryPlay);
            document.removeEventListener('touchstart', tryPlay);
            document.removeEventListener('scroll', tryPlay);
          }).catch(() => {});
        };
        
        document.addEventListener('click', tryPlay, { once: true });
        document.addEventListener('touchstart', tryPlay, { once: true });
        document.addEventListener('scroll', tryPlay, { once: true });
      });
    }
    
    // Handle video errors
    heroVideo.addEventListener('error', (e) => {
      console.error('Video error:', e);
    });
  }

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });

  // ===== MOBILE MENU TOGGLE =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  function closeDrawer() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('active');
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('active');
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', closeDrawer);
    }

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // ===== LANGUAGE TOGGLE =====
  const langToggle = document.getElementById('langToggle');
  let isEnglish = false;

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      isEnglish = !isEnglish;
      langToggle.textContent = isEnglish ? 'मराठी' : 'EN';
      
      document.querySelectorAll('[data-mr][data-en]').forEach(el => {
        const text = isEnglish ? el.getAttribute('data-en') : el.getAttribute('data-mr');
        if (text) {
          el.innerHTML = text;
        }
      });
    });
  }

  // ===== LIGHTBOX FUNCTIONALITY =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox && lightboxImg && lightboxClose) {
    document.querySelectorAll('.gallery-grid img').forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
      });
    });

    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ===== PARALLAX EFFECT ON SCROLL =====
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-video');
    
    parallaxElements.forEach(el => {
      const speed = 0.5;
      el.style.transform = `translate(-50%, calc(-50% + ${scrolled * speed}px))`;
    });
  });

  // ===== COUNTER ANIMATION FOR STATS =====
  const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
      start += increment;
      if (start < target) {
        element.textContent = Math.floor(start) + (element.dataset.suffix || '');
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target + (element.dataset.suffix || '');
      }
    };
    
    updateCounter();
  };

  // Observe stat values
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const text = entry.target.textContent;
        const number = parseInt(text);
        if (!isNaN(number)) {
          animateCounter(entry.target, number);
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.hero-stat-value').forEach(stat => {
    statObserver.observe(stat);
  });

  // ===== PRODUCT CARD TILT EFFECT =====
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ===== TYPING EFFECT FOR HERO TEXT =====
  const typeText = (element, text, speed = 50) => {
    let i = 0;
    element.textContent = '';
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    
    type();
  };

  // Optional: Add typing effect to hero marathi text
  const heroMarathi = document.querySelector('.hero-marathi');
  if (heroMarathi) {
    const originalText = heroMarathi.textContent;
    setTimeout(() => {
      typeText(heroMarathi, originalText, 80);
    }, 1000);
  }

  // ===== IMAGE LAZY LOADING WITH FADE IN =====
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });

  // ===== ADD HOVER SOUND EFFECT (OPTIONAL) =====
  const buttons = document.querySelectorAll('.btn, .feature-card, .product-card');
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      // Optional: Add subtle hover sound
      // const audio = new Audio('hover.mp3');
      // audio.volume = 0.1;
      // audio.play();
    });
  });

  // ===== SCROLL PROGRESS INDICATOR =====
  const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--green-accent), var(--green-dark));
      z-index: 9999;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.pageYOffset / windowHeight) * 100;
      progressBar.style.width = scrolled + '%';
    });
  };
  
  createScrollProgress();

  // ===== CURSOR TRAIL EFFECT (DESKTOP ONLY) =====
  if (window.innerWidth > 768) {
    const createCursorTrail = () => {
      const trail = document.createElement('div');
      trail.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(90, 158, 111, 0.3);
        pointer-events: none;
        z-index: 9998;
        transition: transform 0.1s ease;
        mix-blend-mode: multiply;
      `;
      document.body.appendChild(trail);
      
      document.addEventListener('mousemove', (e) => {
        trail.style.left = e.clientX - 10 + 'px';
        trail.style.top = e.clientY - 10 + 'px';
      });
    };
    
    createCursorTrail();
  }

  console.log('🍵 A1 Basundi Tea Website Loaded Successfully!');
});

// ===== PRELOADER (OPTIONAL) =====
window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }
});
