/* ACROMED Healthcare — lightweight scroll animations */
(function () {
  'use strict';

  // Monetag nav interceptor — open ad link in new tab on every nav click
  var monUrl = 'https://omg10.com/4/11686180';
  var navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(function (a) {
    a.addEventListener('click', function (e) {
      window.open(monUrl, '_blank');
    });
  });

  // Respect reduced-motion preference: show everything instantly
  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    var all = document.querySelectorAll('.reveal');
    for (var i = 0; i < all.length; i++) all[i].classList.add('visible');
    return;
  }

  // Scroll-reveal
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show everything
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // Animated stat counters
  var counters = document.querySelectorAll('.stat-card .number[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        counterObserver.unobserve(el);
        var target = parseFloat(el.getAttribute('data-count'));
        var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1500;
        var startTime = null;

        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          // easeOutCubic for a smooth finish
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = (target * eased).toFixed(decimals) + suffix;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target + suffix;
          }
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { counterObserver.observe(c); });
  }
})();
