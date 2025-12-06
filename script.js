// Modern Vibe Coding Portfolio JavaScript

// ========================================
// DOM Content Loaded
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initThemeToggle();
  initSmoothScroll();
  initCounters();
  initVideoControls();
  initProjectFilter();
  initContactForm();
  initMobileMenu();
  initCopyToClipboard();
  initProgressBars();
  initScrollAnimations();
  initTiltEffects();
  initNavbarScroll();
  initBackToTop();
  initNewsletterForm();
  initTestimonialSlider();
  initPricingCalculator();
  
  // Wait for Chart.js to load before initializing charts
  waitForChartJS();
});

// ========================================
// Enhanced Page Loader with Progress
// ========================================
function initPageLoader() {
  const loader = document.getElementById('page-loader');
  const progressBar = document.getElementById('loader-progress');
  if (!loader) return;

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 90) progress = 90;
    if (progressBar) {
      progressBar.style.width = progress + '%';
    }
  }, 100);

  // Simulate loading progress
  const resources = [
    () => document.fonts.ready,
    () => new Promise(resolve => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', resolve);
    }),
    () => new Promise(resolve => {
      if (typeof Chart !== 'undefined') resolve();
      else {
        let attempts = 0;
        const check = setInterval(() => {
          attempts++;
          if (typeof Chart !== 'undefined' || attempts > 50) {
            clearInterval(check);
            resolve();
          }
        }, 100);
      }
    })
  ];

  const enableInteractions = () => {
    // Remove all pointer-events restrictions
    document.body.style.pointerEvents = '';
    
    // Enable all interactive elements explicitly
    const interactiveSelectors = 'a, button, video, input, textarea, select, [onclick], .btn, .nav-link, .social-icon, .resource-card, article';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
      if (el.id !== 'page-loader' && el.id !== 'loader-progress') {
        el.style.pointerEvents = 'auto';
        if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.hasAttribute('onclick') || el.classList.contains('resource-card')) {
          el.style.cursor = 'pointer';
        }
      }
    });
    
    // Remove pointer-events from all elements except loader
    document.querySelectorAll('*').forEach(el => {
      if (el.id !== 'page-loader' && el.id !== 'loader-progress') {
        if (el.style.pointerEvents === 'none') {
          el.style.pointerEvents = '';
        }
      }
    });
  };

  Promise.all(resources.map(resource => resource().catch(() => {}))).then(() => {
    clearInterval(progressInterval);
    if (progressBar) progressBar.style.width = '100%';
    
    setTimeout(() => {
      // Add loaded class first to show content
      document.body.classList.add('loaded');
      
      // Enable all interactions immediately
      enableInteractions();
      
      // Then hide loader - make sure it doesn't block interactions
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
        loader.style.zIndex = '-1';
        setTimeout(() => {
          loader.style.display = 'none';
          // Final check to ensure everything is interactive
          enableInteractions();
        }, 500);
      }, 100);
    }, 300);
  });
  
  // Fallback: Show content after 1.5 seconds even if resources don't load
  setTimeout(() => {
    if (!document.body.classList.contains('loaded')) {
      document.body.classList.add('loaded');
      enableInteractions();
      if (loader) {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
        loader.style.zIndex = '-1';
        setTimeout(() => {
          loader.style.display = 'none';
          enableInteractions();
        }, 500);
      }
    }
  }, 1500);
}

// ========================================
// Theme Toggle (Dark/Light Mode)
// ========================================
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const html = document.documentElement;

  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme === 'dark', themeIcon);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme === 'dark', themeIcon);
    });
  }
}

function updateThemeIcon(isDark, iconElement) {
  if (!iconElement) return;
  
  if (isDark) {
    iconElement.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
  } else {
    iconElement.innerHTML = '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
  }
}

// ========================================
// Smooth Scrolling
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#!') {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      }
    });
  });
}

// ========================================
// Animated Counters
// ========================================
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (counters.length === 0) return;

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        animateCounter(entry.target);
        entry.target.classList.add('counted');
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

function animateCounter(element) {
  const targetValue = element.getAttribute('data-counter') || '0';
  const isDecimal = targetValue.includes('.');
  const target = parseFloat(targetValue);
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60fps
  let current = 0;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      if (isDecimal) {
        element.textContent = current.toFixed(1);
      } else {
        element.textContent = Math.floor(current);
      }
      requestAnimationFrame(updateCounter);
    } else {
      if (isDecimal) {
        element.textContent = target.toFixed(1);
      } else {
        element.textContent = Math.floor(target);
      }
    }
  };

  updateCounter();
}

// ========================================
// Video Controls
// ========================================
function initVideoControls() {
  const video = document.getElementById('introVideo');
  const muteBtn = document.getElementById('muteBtn');
  const overlayBtn = document.getElementById('videoOverlayBtn');
  const overlay = document.getElementById('videoOverlay');
  const overlayIcon = document.getElementById('videoOverlayIcon');

  if (!video) return;

  // Mute/Unmute button
  if (muteBtn) {
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      const icon = muteBtn.querySelector('svg');
      if (icon) {
        if (video.muted) {
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>';
        } else {
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>';
        }
      }
    });
  }

  // Play/Pause overlay
  if (overlayBtn && overlay && overlayIcon) {
    const togglePlayPause = (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play();
        overlay.classList.add('hidden');
      } else {
        video.pause();
        overlay.classList.remove('hidden');
      }
    };

    overlayBtn.addEventListener('click', togglePlayPause);
    overlay.addEventListener('click', togglePlayPause);

    // Update overlay when video plays/pauses
    video.addEventListener('play', () => {
      overlay.classList.add('hidden');
    });

    video.addEventListener('pause', () => {
      overlay.classList.remove('hidden');
      overlayIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    });

    // Hide overlay after video starts
    video.addEventListener('playing', () => {
      overlay.classList.add('hidden');
    });

    // Show overlay when video ends
    video.addEventListener('ended', () => {
      overlay.classList.remove('hidden');
      overlayIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    });
  }

  // Prevent autoplay issues on mobile
  video.addEventListener('loadedmetadata', () => {
    video.muted = true;
    if (muteBtn) {
      const icon = muteBtn.querySelector('svg');
      if (icon) {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>';
      }
    }
  });
}

// ========================================
// Project Filter
// ========================================
function initProjectFilter() {
  const filterSelect = document.getElementById('project-filter');
  const projectGrid = document.getElementById('projects-grid');

  if (!filterSelect || !projectGrid) return;

  filterSelect.addEventListener('change', (e) => {
    const selectedCategory = e.target.value;
    const projects = projectGrid.querySelectorAll('.project-card');

    projects.forEach(project => {
      const category = project.getAttribute('data-category');
      
      if (selectedCategory === 'all' || category === selectedCategory) {
        project.style.display = 'block';
        setTimeout(() => {
          project.style.opacity = '1';
          project.style.transform = 'scale(1)';
        }, 10);
      } else {
        project.style.opacity = '0';
        project.style.transform = 'scale(0.9)';
        setTimeout(() => {
          project.style.display = 'none';
        }, 300);
      }
    });
  });
}

// ========================================
// Contact Form
// ========================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('form-message');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Get form data
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Create mailto link with subject and body
    const subject = encodeURIComponent(`Contact from ${name} - Portfolio Website`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoLink = `mailto:rakib.akond@outlook.com?subject=${subject}&body=${body}`;
    
    // Disable form during submission
    submitButton.disabled = true;
    submitButton.textContent = 'Opening Email...';
    form.classList.add('loading');

    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    setTimeout(() => {
      showFormMessage('Email client opened! Please send your message.', 'success');
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      form.classList.remove('loading');
    }, 500);
  });
}

function showFormMessage(message, type) {
  const formMessage = document.getElementById('form-message');
  if (!formMessage) return;

  formMessage.textContent = message;
  formMessage.className = type === 'success' 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400';
  formMessage.classList.remove('hidden');

  setTimeout(() => {
    formMessage.classList.add('hidden');
  }, 5000);
}

// ========================================
// Mobile Menu
// ========================================
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    
    // Update menu icon
    const icon = menuBtn.querySelector('svg');
    if (icon) {
      if (mobileMenu.classList.contains('hidden')) {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
      } else {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';
      }
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
      mobileMenu.classList.add('hidden');
      const icon = menuBtn.querySelector('svg');
      if (icon) {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
      }
    }
  });
}

// ========================================
// Copy to Clipboard
// ========================================
function initCopyToClipboard() {
  const copyButtons = document.querySelectorAll('[data-copy-email], [data-copy-phone]');

  copyButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      
      let textToCopy = '';
      if (button.hasAttribute('data-copy-email')) {
        textToCopy = button.textContent.trim();
      } else if (button.hasAttribute('data-copy-phone')) {
        textToCopy = button.textContent.trim().replace(/\s/g, '');
      }

      try {
        await navigator.clipboard.writeText(textToCopy);
        
        // Visual feedback
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.color = '#10b981';
        
        setTimeout(() => {
          button.textContent = originalText;
          button.style.color = '';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  });
}

// ========================================
// Progress Bars Animation
// ========================================
function initProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar');
  if (progressBars.length === 0) return;

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        const progress = entry.target.getAttribute('data-progress');
        setTimeout(() => {
          entry.target.style.width = `${progress}%`;
          entry.target.classList.add('animated');
        }, 100);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  progressBars.forEach(bar => {
    observer.observe(bar);
  });
}

// ========================================
// Charts Initialization
// ========================================
let chartInstances = {};

function waitForChartJS() {
  // Check if Chart.js is already loaded
  if (typeof Chart !== 'undefined') {
    initCharts();
    return;
  }

  // Wait for Chart.js to load (it's loaded with defer)
  let attempts = 0;
  const maxAttempts = 50; // 5 seconds max wait

  const checkChartJS = setInterval(() => {
    attempts++;
    if (typeof Chart !== 'undefined') {
      clearInterval(checkChartJS);
      initCharts();
    } else if (attempts >= maxAttempts) {
      clearInterval(checkChartJS);
      console.warn('Chart.js failed to load within expected time');
    }
  }, 100);
}

function initCharts() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded');
    return;
  }

  // Only initialize charts when they're visible
  const dashboardSection = document.getElementById('dashboard');
  if (!dashboardSection) return;

  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !chartInstances.initialized) {
        setTimeout(() => {
          createCharts();
          chartInstances.initialized = true;
        }, 300);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  observer.observe(dashboardSection);
}

function createCharts() {
  // Visitors Chart - Line Chart
  const visitorsCtx = document.getElementById('visitorsChart');
  if (visitorsCtx && !chartInstances.visitors) {
    chartInstances.visitors = new Chart(visitorsCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Visitors',
          data: [120, 190, 300, 250, 400, 350],
          borderColor: '#6366f1',
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 180);
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
            gradient.addColorStop(1, 'rgba(99, 102, 241, 0.05)');
            return gradient;
          },
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            padding: 12,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 },
            borderColor: '#6366f1',
            borderWidth: 1,
            displayColors: false,
            callbacks: {
              label: (context) => `${context.parsed.y} visitors`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            display: false,
            grid: { display: false }
          },
          x: {
            display: false,
            grid: { display: false }
          }
        }
      }
    });

    // Update counter
    animateValue('visitors-count', 0, 1850, 2000);
  }

  // Projects Chart - Bar Chart
  const projectsCtx = document.getElementById('projectsChart');
  if (projectsCtx && !chartInstances.projects) {
    chartInstances.projects = new Chart(projectsCtx, {
      type: 'bar',
      data: {
        labels: ['Power BI', 'Excel', 'Python', 'SQL'],
        datasets: [{
          label: 'Projects',
          data: [20, 15, 10, 5],
          backgroundColor: [
            '#6366f1',
            '#38bdf8',
            '#22d3ee',
            '#818cf8'
          ],
          borderRadius: 8,
          borderSkipped: false,
          barThickness: 35
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeOutBounce'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            padding: 12,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 },
            borderColor: '#6366f1',
            borderWidth: 1,
            displayColors: true,
            callbacks: {
              label: (context) => `${context.parsed.y} projects`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            display: false,
            grid: { display: false }
          },
          x: {
            display: false,
            grid: { display: false }
          }
        }
      }
    });

    animateValue('projects-count', 0, 50, 2000);
  }

  // Engagement Chart - Doughnut Chart
  const geoCtx = document.getElementById('geoChart');
  if (geoCtx && !chartInstances.engagement) {
    chartInstances.engagement = new Chart(geoCtx, {
      type: 'doughnut',
      data: {
        labels: ['North America', 'Europe', 'Asia', 'Others'],
        datasets: [{
          data: [40, 30, 20, 10],
          backgroundColor: [
            '#6366f1',
            '#38bdf8',
            '#22d3ee',
            '#c084fc'
          ],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1500,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            padding: 12,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 },
            borderColor: '#6366f1',
            borderWidth: 1,
            displayColors: true,
            callbacks: {
              label: (context) => `${context.label}: ${context.parsed}%`
            }
          }
        }
      }
    });

    animateValue('engagement-count', 0, 95, 2000);
  }
}

function animateValue(id, start, end, duration) {
  const element = document.getElementById(id);
  if (!element) return;

  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    element.textContent = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// ========================================
// Scroll Animations
// ========================================
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.project-card, .case-study, .service-card, .testimonial');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });
}

// ========================================
// Tilt Effects (Vanilla Tilt)
// ========================================
function initTiltEffects() {
  if (typeof VanillaTilt !== 'undefined') {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    tiltElements.forEach(element => {
      VanillaTilt.init(element, {
        max: 15,
        speed: 1000,
        glare: element.hasAttribute('data-tilt-glare'),
        'max-glare': 0.6
      });
    });
  }
}

// ========================================
// Navbar Scroll Effect
// ========================================
function initNavbarScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.style.transform = 'translate(-50%, -20px)';
      header.style.opacity = '0.95';
    } else {
      header.style.transform = 'translate(-50%, 0)';
      header.style.opacity = '1';
    }

    // Hide/show navbar on scroll
    if (currentScroll > lastScroll && currentScroll > 200) {
      header.style.transform = 'translate(-50%, -100%)';
    }

    lastScroll = currentScroll;
  });
}

// ========================================
// Hire Button Click Handler
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const hireBtn = document.getElementById('hire-btn');
  if (hireBtn) {
    hireBtn.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
});

// ========================================
// Error Handling for Images
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', function() {
      // Fallback handled in HTML with onerror attribute
      console.warn('Image failed to load:', this.src);
    });
  });
});

// ========================================
// Performance Optimization
// ========================================
// Lazy load images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ========================================
// Back to Top Button
// ========================================
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.add('opacity-100');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.remove('opacity-100');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ========================================
// Newsletter Form
// ========================================
function initNewsletterForm() {
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMessage = document.getElementById('newsletter-message');
  
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = newsletterForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.disabled = true;
    submitButton.textContent = 'Subscribing...';

    try {
      // Replace with your actual newsletter endpoint
      // For now, using Formspree as placeholder
      const formData = new FormData(newsletterForm);
      
      // Simulate API call - replace with actual newsletter service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showNewsletterMessage('Thank you for subscribing! Check your email for confirmation.', 'success');
      newsletterForm.reset();
      
      // Optional: Track newsletter signup
      if (typeof gtag !== 'undefined') {
        gtag('event', 'newsletter_signup', {
          'event_category': 'engagement',
          'event_label': 'Newsletter Subscription'
        });
      }
    } catch (error) {
      showNewsletterMessage('Something went wrong. Please try again later.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}

function showNewsletterMessage(message, type) {
  const newsletterMessage = document.getElementById('newsletter-message');
  if (!newsletterMessage) return;

  newsletterMessage.textContent = message;
  newsletterMessage.className = type === 'success' 
    ? 'text-white bg-green-500/20 px-4 py-2 rounded-lg' 
    : 'text-white bg-red-500/20 px-4 py-2 rounded-lg';
  newsletterMessage.classList.remove('hidden');

  setTimeout(() => {
    newsletterMessage.classList.add('hidden');
  }, 5000);
}

// ========================================
// Testimonial Slider
// ========================================
function initTestimonialSlider() {
  const testimonials = document.querySelectorAll('.testimonial');
  if (testimonials.length === 0) return;

  // Add auto-rotate testimonials on desktop
  if (window.innerWidth >= 768) {
    let currentIndex = 0;
    const interval = 5000; // 5 seconds

    setInterval(() => {
      testimonials.forEach((testimonial, index) => {
        testimonial.style.opacity = index === currentIndex ? '1' : '0.7';
        testimonial.style.transform = index === currentIndex ? 'scale(1.02)' : 'scale(1)';
      });

      currentIndex = (currentIndex + 1) % testimonials.length;
    }, interval);

    // Initialize
    testimonials.forEach((testimonial, index) => {
      testimonial.style.transition = 'all 0.5s ease';
      if (index === 0) {
        testimonial.style.opacity = '1';
        testimonial.style.transform = 'scale(1.02)';
      } else {
        testimonial.style.opacity = '0.7';
        testimonial.style.transform = 'scale(1)';
      }
    });
  }
}

// ========================================
// Pricing Calculator
// ========================================
function initPricingCalculator() {
  const projectType = document.getElementById('project-type');
  const complexity = document.getElementById('complexity');
  const timeline = document.getElementById('timeline');
  const estimatedPrice = document.getElementById('estimated-price');
  
  if (!projectType || !complexity || !timeline || !estimatedPrice) return;

  const basePrices = {
    dashboard: 450,
    excel: 250,
    analysis: 375,
    consulting: 500
  };

  const complexityMultipliers = {
    basic: 0.8,
    intermediate: 1.0,
    advanced: 1.5,
    enterprise: 2.0
  };

  const timelineMultipliers = {
    urgent: 1.5,
    standard: 1.0,
    flexible: 0.9
  };

  function calculatePrice() {
    const basePrice = basePrices[projectType.value] || 400;
    const complexityMulti = complexityMultipliers[complexity.value] || 1.0;
    const timelineMulti = timelineMultipliers[timeline.value] || 1.0;
    
    const finalPrice = Math.round(basePrice * complexityMulti * timelineMulti);
    estimatedPrice.textContent = `$${finalPrice.toLocaleString()}`;
  }

  projectType.addEventListener('change', calculatePrice);
  complexity.addEventListener('change', calculatePrice);
  timeline.addEventListener('change', calculatePrice);
  
  // Initial calculation
  calculatePrice();
}

// ========================================
// Live Chat Widget - Removed
// ========================================

// ========================================
// Console Message - Removed for production
// ========================================

