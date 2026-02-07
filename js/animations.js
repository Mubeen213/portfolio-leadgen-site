/**
 * animations.js — Apple-inspired scroll animations
 * Handles scroll-triggered animations, number counters, and visualization bars
 */

(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    // Show all content immediately
    document.querySelectorAll('[data-animate]').forEach(function (el) {
      el.classList.add('in-view');
    });
    
    // Animate viz bars immediately
    document.querySelectorAll('.viz-bar').forEach(function (bar) {
      var value = bar.getAttribute('data-value');
      bar.style.setProperty('--bar-width', value + '%');
      bar.classList.add('animate');
    });
    
    // Animate counters immediately
    animateAllCounters();
    return;
  }

  // Intersection Observer for scroll animations
  var observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var target = entry.target;
      var animType = target.getAttribute('data-animate');
      var delay = parseInt(target.getAttribute('data-delay')) || 0;

      setTimeout(function() {
        target.classList.add('in-view');
        
        // Handle specific animation types
        if (animType === 'scale' && target.querySelector('.impact-number')) {
          animateCounter(target.querySelector('.impact-number'));
        }
        
        if (animType === 'viz') {
          animateVizBar(target);
        }
      }, delay);

      observer.unobserve(target);
    });
  }, observerOptions);

  // Observe all elements with data-animate
  document.querySelectorAll('[data-animate]').forEach(function (el) {
    observer.observe(el);
  });

  // Hero: mark as in-view on load
  var hero = document.querySelector('.hero');
  if (hero) {
    hero.classList.add('in-view');
    
    // Initialize hero metrics animations
    setTimeout(function() {
      initHeroMetrics();
    }, 500);
  }

  // Number counter animation
  function animateCounter(element) {
    var target = parseInt(element.getAttribute('data-count')) || 0;
    var current = 0;
    var duration = 1500;
    var startTime = null;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = timestamp - startTime;
      var percentage = Math.min(progress / duration, 1);
      
      current = Math.floor(easeOutQuart(percentage) * target);
      element.textContent = current;

      if (percentage < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  // Animate all counters (for reduced motion fallback)
  function animateAllCounters() {
    document.querySelectorAll('.impact-number[data-count]').forEach(function(el) {
      var count = el.getAttribute('data-count');
      el.textContent = count;
    });
  }

  // Visualization bar animation
  function animateVizBar(vizItem) {
    var bar = vizItem.querySelector('.viz-bar');
    if (!bar) return;

    var value = bar.getAttribute('data-value');
    
    setTimeout(function() {
      bar.style.setProperty('--bar-width', value + '%');
      bar.classList.add('animate');
    }, 200);
  }

  // Parallax effect for floating cards
  var floatingCards = document.querySelectorAll('.float-card[data-parallax]');
  if (floatingCards.length > 0 && !reducedMotion) {
    var ticking = false;
    
    function updateParallax() {
      var scrollY = window.scrollY || window.pageYOffset;
      
      floatingCards.forEach(function(card) {
        var speed = parseFloat(card.getAttribute('data-parallax')) || 0.1;
        var yPos = -(scrollY * speed);
        card.style.transform = 'translateY(' + yPos + 'px)';
      });
      
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // Smooth reveal on page load
  window.addEventListener('load', function() {
    document.body.classList.add('loaded');
  });

  // Initialize hero metrics animations
  function initHeroMetrics() {
    // Animate all counters in hero metrics
    var metricCounters = document.querySelectorAll('.hero-metrics-mobile .value-number, .hero-metrics-mobile .stat-number, .hero-metrics-mobile .trust-number');
    metricCounters.forEach(function(counter) {
      animateCounter(counter);
    });

    // Animate slider progress
    var sliderProgress = document.querySelector('.slider-progress');
    if (sliderProgress) {
      var progress = sliderProgress.getAttribute('data-progress') || 85;
      sliderProgress.style.setProperty('--progress-width', progress + '%');
    }

    // Animate engagement bars
    var bars = document.querySelectorAll('.bar-fill');
    bars.forEach(function(bar) {
      var width = bar.getAttribute('data-width') || 100;
      bar.style.setProperty('--fill-width', width + '%');
    });

    // Animate trust circle
    var trustCircle = document.querySelector('.circle-progress');
    if (trustCircle) {
      var progress = parseInt(trustCircle.getAttribute('data-progress')) || 92;
      var circumference = 339.292;
      var offset = circumference - (circumference * progress / 100);
      trustCircle.style.setProperty('--progress-value', progress / 100);
      
      setTimeout(function() {
        trustCircle.style.strokeDashoffset = offset;
      }, 500);
    }
  }

})();
