(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Scroll progress bar ---- */
  var bar = document.createElement('div');
  bar.className = 'progress';
  document.body.appendChild(bar);

  function updateBar() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateBar, { passive: true });
  window.addEventListener('resize', updateBar);
  updateBar();

  /* ---- Scroll reveal ---- */
  var blocks = document.querySelectorAll(
    'main section:not(.hero) .section-head, .about-grid, .osi-layer, .skill-group, ' +
    '.timeline-item, .project-card, .edu-card, .languages, .contact-inner'
  );

  if ('IntersectionObserver' in window && !reduce) {
    blocks.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 6) * 70 + 'ms';
    });

    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          revealObs.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    blocks.forEach(function (el) { revealObs.observe(el); });
  }

  /* ---- Active nav link ---- */
  var sections = document.querySelectorAll('main section[id]');
  var links = document.querySelectorAll('.nav-links a');
  var map = {};
  links.forEach(function (link) {
    map[link.getAttribute('href').replace('#', '')] = link;
  });

  if (sections.length && links.length && 'IntersectionObserver' in window) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link || !entry.isIntersecting) return;
        links.forEach(function (l) {
          l.style.color = '';
          l.style.textShadow = '';
        });
        link.style.color = '#FF2E45';
        link.style.textShadow = '0 0 14px rgba(255,46,69,0.5)';
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { navObs.observe(s); });
  }

  /* ---- Cursor-following glow on project cards ---- */
  if (!reduce) {
    document.querySelectorAll('.project-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---- Count-up on the hero CGPA stat ---- */
  var cgpa = document.querySelector('.hero-stats dt');
  if (cgpa && !reduce && /^[\d.]+$/.test(cgpa.textContent.trim())) {
    var target = parseFloat(cgpa.textContent);
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1100, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      cgpa.textContent = (target * eased).toFixed(2);
      if (p < 1) requestAnimationFrame(step);
    }
    cgpa.textContent = '0.00';
    setTimeout(function () { requestAnimationFrame(step); }, 800);
  }
})();
