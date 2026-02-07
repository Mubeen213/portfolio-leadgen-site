/**
 * main.js — Form handling, smooth scroll, sticky CTA.
 */

(function () {
  'use strict';

  // Page load animation
  document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loaded');
  });

  // Smooth scroll for anchor links (fallback for older browsers)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Contact form
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameInput = document.getElementById('name');
      var emailInput = document.getElementById('email');
      var phoneInput = document.getElementById('phone');
      var messageEl = document.getElementById('form-message');

      var name = nameInput && nameInput.value ? nameInput.value.trim() : '';
      var email = emailInput && emailInput.value ? emailInput.value.trim() : '';
      var phone = phoneInput && phoneInput.value ? phoneInput.value.trim() : '';

      messageEl.innerHTML = '';
      messageEl.className = '';

      if (!name) {
        messageEl.textContent = 'Please enter your name.';
        messageEl.className = 'form-error';
        nameInput.focus();
        return;
      }

      if (!email && !phone) {
        messageEl.textContent = 'Please enter your email or phone number.';
        messageEl.className = 'form-error';
        (emailInput || phoneInput).focus();
        return;
      }

      // Submit via Formspree (form action is set in HTML)
      var formData = new FormData(form);
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            messageEl.innerHTML = 'Thanks! I\'ll get back to you within 24 hours.';
            messageEl.className = 'form-success';
            form.reset();
          } else {
            messageEl.textContent = 'Something went wrong. Please try again or contact me on WhatsApp.';
            messageEl.className = 'form-error';
          }
        })
        .catch(function () {
          messageEl.textContent = 'Something went wrong. Please try again or contact me on WhatsApp.';
          messageEl.className = 'form-error';
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send message';
          }
        });
    });
  }

  // Sticky CTA: show after user scrolls past hero
  var stickyCta = document.getElementById('sticky-cta');
  var hero = document.querySelector('.hero');
  if (stickyCta && hero) {
    var heroHeight = hero.offsetHeight;
    var ticking = false;

    function updateStickyCta() {
      var scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > heroHeight) {
        stickyCta.classList.add('is-visible');
        document.body.classList.add('has-sticky-cta');
      } else {
        stickyCta.classList.remove('is-visible');
        document.body.classList.remove('has-sticky-cta');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateStickyCta);
        ticking = true;
      }
    }, { passive: true });
  }
})();
